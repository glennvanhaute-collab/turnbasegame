import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useResourceStore } from './useResourceStore.js'
import { useCurrencyStore } from './useCurrencyStore.js'
import { UNIT_TYPES, UNIT_LIST } from '../game/data/siegeUnits.js'

const STORAGE_KEY = 'raid-siege-army'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useSiegeStore = defineStore('siege', () => {
  const saved = loadSaved()

  // Recruited unit pool — how many soldiers of each type you have
  const army = ref(saved?.army ?? Object.fromEntries(UNIT_LIST.map(u => [u.id, 0])))

  // Current setup — party of 3 heroKeys + which unit type each commands
  const party       = ref(saved?.party       ?? [null, null, null])
  const assignments = ref(saved?.assignments ?? {})   // { heroKey: unitTypeId }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      army:        army.value,
      party:       party.value,
      assignments: assignments.value,
    }))
  }

  // ── Recruitment ──────────────────────────────────────────────────
  function canRecruit(unitId) {
    const unit = UNIT_TYPES[unitId]
    if (!unit) return false
    if (army.value[unitId] + unit.recruitPer > unit.maxStack) return false
    const resources = useResourceStore()
    const n = unit.recruitPer
    for (const [barId, amt] of Object.entries(unit.recruitCost.bars ?? {})) {
      if ((resources.bars[barId] ?? 0) < amt * n) return false
    }
    for (const [plankId, amt] of Object.entries(unit.recruitCost.planks ?? {})) {
      if ((resources.planks[plankId] ?? 0) < amt * n) return false
    }
    return true
  }

  function recruit(unitId) {
    if (!canRecruit(unitId)) return false
    const unit = UNIT_TYPES[unitId]
    const resources = useResourceStore()
    const n = unit.recruitPer
    for (const [barId, amt] of Object.entries(unit.recruitCost.bars ?? {})) {
      resources.removeBar(barId, amt * n)
    }
    for (const [plankId, amt] of Object.entries(unit.recruitCost.planks ?? {})) {
      resources.removePlank(plankId, amt * n)
    }
    army.value[unitId] = Math.min(unit.maxStack, army.value[unitId] + n)
    persist()
    return true
  }

  // ── Party management ─────────────────────────────────────────────
  function setPartySlot(slotIndex, heroKey) {
    // Remove from any existing slot first
    const existing = party.value.indexOf(heroKey)
    if (existing !== -1 && existing !== slotIndex) party.value[existing] = null
    party.value[slotIndex] = heroKey
    persist()
  }

  function clearPartySlot(slotIndex) {
    const heroKey = party.value[slotIndex]
    if (heroKey) delete assignments.value[heroKey]
    party.value[slotIndex] = null
    persist()
  }

  function assignUnit(heroKey, unitTypeId) {
    if (!heroKey) return
    assignments.value[heroKey] = unitTypeId
    persist()
  }

  const partyReady = computed(() =>
    party.value.every(k => k !== null) && party.value.every(k => assignments.value[k])
  )

  // ── Casualty reporting (called after a siege) ────────────────────
  function applyLosses(losses) {
    // losses = { infantry: 12, archers: 5, siege_crew: 1 }
    for (const [unitId, dead] of Object.entries(losses)) {
      if (unitId in army.value) {
        army.value[unitId] = Math.max(0, army.value[unitId] - dead)
      }
    }
    persist()
  }

  return {
    army, party, assignments, partyReady,
    canRecruit, recruit,
    setPartySlot, clearPartySlot, assignUnit,
    applyLosses,
  }
})
