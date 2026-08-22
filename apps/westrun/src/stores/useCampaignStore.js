import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ENCOUNTERS } from '../game/data/heroes.js'

const STORAGE_KEY = 'raid-campaign'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useCampaignStore = defineStore('campaign', () => {
  const saved = loadSaved()
  const completedIds = ref(new Set(saved?.completedIds ?? []))

  function isCompleted(encounterId) { return completedIds.value.has(encounterId) }

  function isUnlocked(index) {
    if (index === 0) return true
    return isCompleted(ENCOUNTERS[index - 1].id)
  }

  function completeEncounter(encounterId) {
    if (completedIds.value.has(encounterId)) return
    completedIds.value = new Set([...completedIds.value, encounterId])
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedIds: [...completedIds.value] }))
  }

  const currentIndex = computed(() => {
    for (let i = 0; i < ENCOUNTERS.length; i++) {
      if (!isCompleted(ENCOUNTERS[i].id)) return i
    }
    return ENCOUNTERS.length - 1
  })

  return { isCompleted, isUnlocked, completeEncounter, currentIndex, ENCOUNTERS }
})
