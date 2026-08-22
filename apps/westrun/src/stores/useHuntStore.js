import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { HUNTS_BY_ID } from '../game/data/hunts.js'
import { useResourceStore } from './useResourceStore.js'
import { useArtisanStore } from './useArtisanStore.js'

const STORAGE_KEY = 'raid-hunts'
const MAX_SLOTS   = 6

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

function padSlots(arr) {
  const base = Array.isArray(arr) ? [...arr] : []
  while (base.length < MAX_SLOTS) base.push(null)
  return base
}

export const useHuntStore = defineStore('hunts', () => {
  const saved = loadSaved()
  // Each slot: { missionId, heroKey, startedAt, duration } | null
  const slots = ref(padSlots(saved?.slots))

  // Last auto-collected cycle — watched by HuntsView for toast display
  const lastAutoCollect = ref(null)

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ slots: slots.value }))
  }

  function isComplete(i) {
    const s = slots.value[i]
    if (!s) return false
    return Date.now() >= s.startedAt + s.duration * 1000
  }

  function progress(i) {
    const s = slots.value[i]
    if (!s) return 0
    const elapsed = Date.now() - s.startedAt
    return Math.min(1, elapsed / (s.duration * 1000))
  }

  function eta(i) {
    const s = slots.value[i]
    if (!s) return 0
    return Math.max(0, (s.startedAt + s.duration * 1000) - Date.now())
  }

  const firstFreeSlot = computed(() => slots.value.findIndex(s => s === null))

  function heroInSlot(heroKey) {
    return slots.value.findIndex(s => s?.heroKey === heroKey)
  }

  function startHunt(missionId, heroKey) {
    const slotIdx = firstFreeSlot.value
    if (slotIdx === -1) return false
    if (heroKey && heroInSlot(heroKey) !== -1) return false
    const mission = HUNTS_BY_ID[missionId]
    if (!mission) return false
    slots.value[slotIdx] = {
      missionId,
      heroKey: heroKey ?? null,
      startedAt: Date.now(),
      duration:  mission.duration,
    }
    _persist()
    return true
  }

  function _applyDrops(mission, heroKey) {
    const resources = useResourceStore()
    const artisan   = useArtisanStore()
    const collected = []

    for (const drop of mission.drops) {
      const hits = drop.chance == null ? true : Math.random() < drop.chance
      if (!hits) continue
      const amt = rand(drop.min, drop.max)
      if (drop.materialType === 'hide')      resources.addHide(drop.id, amt)
      else if (drop.materialType === 'log')  resources.addLog(drop.id, amt)
      else                                   resources.addFiber(drop.id, amt)
      collected.push({ materialType: drop.materialType, id: drop.id, amount: amt })
    }

    if (heroKey && mission.artisanBonus) {
      const bonus = mission.artisanBonus
      if (artisan.getSkillLevel(heroKey, bonus.skill) >= 1) {
        const amt = rand(bonus.min, bonus.max)
        if (bonus.materialType === 'hide')      resources.addHide(bonus.id, amt)
        else if (bonus.materialType === 'log')  resources.addLog(bonus.id, amt)
        else                                    resources.addFiber(bonus.id, amt)
        const existing = collected.find(c => c.id === bonus.id && c.materialType === bonus.materialType)
        if (existing) existing.amount += amt
        else collected.push({ materialType: bonus.materialType, id: bonus.id, amount: amt, bonus: true })
      }
    }

    return collected
  }

  // Collect ALL completed cycles and restart. Catches up offline sessions in one tick.
  const MAX_CATCHUP_CYCLES = 100
  function collectHunt(i) {
    const s = slots.value[i]
    if (!s || !isComplete(i)) return null

    const mission   = HUNTS_BY_ID[s.missionId]
    const combined  = []
    let startedAt   = s.startedAt
    let cycles      = 0

    while (Date.now() >= startedAt + s.duration * 1000 && cycles < MAX_CATCHUP_CYCLES) {
      const drops = _applyDrops(mission, s.heroKey)
      for (const d of drops) {
        const ex = combined.find(c => c.id === d.id && c.materialType === d.materialType)
        if (ex) ex.amount += d.amount
        else combined.push({ ...d })
      }
      startedAt += s.duration * 1000
      cycles++
    }

    slots.value[i] = { missionId: s.missionId, heroKey: s.heroKey, startedAt, duration: s.duration }
    _persist()
    return combined.length > 0 ? combined : []
  }

  // Auto-tick: fires every 1s and collects any completed slots automatically
  setInterval(() => {
    slots.value.forEach((slot, i) => {
      if (slot && isComplete(i)) {
        const missionName = HUNTS_BY_ID[slot.missionId]?.name ?? 'Mission'
        const drops = collectHunt(i)
        if (drops?.length) lastAutoCollect.value = { missionName, drops }
      }
    })
  }, 1000)

  function cancelHunt(i) {
    if (!slots.value[i]) return
    slots.value[i] = null
    _persist()
  }

  return {
    slots, MAX_SLOTS,
    firstFreeSlot, heroInSlot,
    isComplete, progress, eta,
    startHunt, collectHunt, cancelHunt,
    lastAutoCollect,
  }
})
