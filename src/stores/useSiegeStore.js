import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useResourceStore } from './useResourceStore.js'
import { UNIT_TYPES, UNIT_LIST } from '../game/data/siegeUnits.js'

const STORAGE_KEY = 'raid-siege-army'
const MAX_PER_LANE = 10
const MAX_TOTAL    = 30

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useSiegeStore = defineStore('siege', () => {
  const saved = loadSaved()

  // Unit pool
  const army = ref(saved?.army ?? Object.fromEntries(UNIT_LIST.map(u => [u.id, 0])))

  // Phase 1 — 3 lanes, each is an array of heroKeys
  const lanes = ref(saved?.lanes ?? { west: [], gate: [], east: [] })

  // Phase 2 — 3 vanguard hero slots for the commander fight
  const phase2Party = ref(saved?.phase2Party ?? [null, null, null])

  // heroKey → unitTypeId (applies to Phase 1 lane commanders only)
  const assignments = ref(saved?.assignments ?? {})

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      army:        army.value,
      lanes:       lanes.value,
      phase2Party: phase2Party.value,
      assignments: assignments.value,
    }))
  }

  // ── Computed ──────────────────────────────────────────────────────
  const allLaneHeroes = computed(() => [
    ...lanes.value.west,
    ...lanes.value.gate,
    ...lanes.value.east,
  ])

  const totalDeployed = computed(() => allLaneHeroes.value.length)

  const phase1Ready = computed(() =>
    Object.values(lanes.value).every(l => l.length >= 1) &&
    allLaneHeroes.value.every(k => !!assignments.value[k])
  )

  const phase2Ready = computed(() => phase2Party.value.every(k => k !== null))

  const siegeReady = computed(() => phase1Ready.value && phase2Ready.value)

  // ── Lane management ───────────────────────────────────────────────
  function heroCurrentLane(heroKey) {
    for (const [lane, heroes] of Object.entries(lanes.value)) {
      if (heroes.includes(heroKey)) return lane
    }
    return null
  }

  function addToLane(lane, heroKey) {
    if (!lanes.value[lane]) return
    if (lanes.value[lane].length >= MAX_PER_LANE) return
    if (totalDeployed.value >= MAX_TOTAL) return
    const current = heroCurrentLane(heroKey)
    if (current) {
      const idx = lanes.value[current].indexOf(heroKey)
      if (idx !== -1) lanes.value[current].splice(idx, 1)
    }
    lanes.value[lane].push(heroKey)
    persist()
  }

  function removeFromLane(lane, heroKey) {
    const idx = lanes.value[lane]?.indexOf(heroKey) ?? -1
    if (idx !== -1) {
      lanes.value[lane].splice(idx, 1)
      delete assignments.value[heroKey]
    }
    persist()
  }

  // ── Phase 2 party ─────────────────────────────────────────────────
  function setPhase2Slot(slotIndex, heroKey) {
    const existing = phase2Party.value.indexOf(heroKey)
    if (existing !== -1 && existing !== slotIndex) phase2Party.value[existing] = null
    phase2Party.value[slotIndex] = heroKey
    persist()
  }

  function clearPhase2Slot(slotIndex) {
    phase2Party.value[slotIndex] = null
    persist()
  }

  // ── Unit assignment (Phase 1 only) ────────────────────────────────
  function assignUnit(heroKey, unitTypeId) {
    if (!heroKey) return
    assignments.value[heroKey] = unitTypeId
    persist()
  }

  // ── Recruitment ───────────────────────────────────────────────────
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

  // ── Casualty reporting (called after battle) ──────────────────────
  function applyLosses(losses) {
    for (const [unitId, dead] of Object.entries(losses)) {
      if (unitId in army.value) {
        army.value[unitId] = Math.max(0, army.value[unitId] - dead)
      }
    }
    persist()
  }

  return {
    army, lanes, phase2Party, assignments,
    allLaneHeroes, totalDeployed,
    phase1Ready, phase2Ready, siegeReady,
    heroCurrentLane,
    addToLane, removeFromLane,
    setPhase2Slot, clearPhase2Slot,
    assignUnit,
    canRecruit, recruit,
    applyLosses,
  }
})
