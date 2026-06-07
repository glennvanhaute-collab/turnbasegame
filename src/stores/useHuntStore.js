import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { HUNTS_BY_ID } from '../game/data/hunts.js'
import { useResourceStore } from './useResourceStore.js'
import { useArtisanStore } from './useArtisanStore.js'

const STORAGE_KEY = 'raid-hunts'
const MAX_SLOTS   = 3

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useHuntStore = defineStore('hunts', () => {
  const saved = loadSaved()
  // Each slot: { missionId, heroKey, startedAt, duration } | null
  const slots = ref(saved?.slots ?? Array(MAX_SLOTS).fill(null))

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

  function collectHunt(i) {
    const s = slots.value[i]
    if (!s || !isComplete(i)) return null

    const mission   = HUNTS_BY_ID[s.missionId]
    const resources = useResourceStore()
    const artisan   = useArtisanStore()
    const collected = []

    for (const drop of mission.drops) {
      const hits = drop.chance == null ? true : Math.random() < drop.chance
      if (!hits) continue
      const amt = rand(drop.min, drop.max)
      if (drop.materialType === 'hide') {
        resources.addHide(drop.id, amt)
      } else if (drop.materialType === 'log') {
        resources.addLog(drop.id, amt)
      } else {
        resources.addFiber(drop.id, amt)
      }
      collected.push({ materialType: drop.materialType, id: drop.id, amount: amt })
    }

    // Artisan skill bonus
    if (s.heroKey && mission.artisanBonus) {
      const bonus = mission.artisanBonus
      const hasSkill = artisan.getSkillLevel(s.heroKey, bonus.skill) >= 1
      if (hasSkill) {
        const amt = rand(bonus.min, bonus.max)
        if (bonus.materialType === 'hide') {
          resources.addHide(bonus.id, amt)
        } else if (bonus.materialType === 'log') {
          resources.addLog(bonus.id, amt)
        } else {
          resources.addFiber(bonus.id, amt)
        }
        const existing = collected.find(c => c.id === bonus.id && c.materialType === bonus.materialType)
        if (existing) existing.amount += amt
        else collected.push({ materialType: bonus.materialType, id: bonus.id, amount: amt, bonus: true })
      }
    }

    slots.value[i] = null
    _persist()
    return collected
  }

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
  }
})
