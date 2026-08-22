import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'player-bonds'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}

export const useBondStore = defineStore('bonds', () => {
  const discoveredIds = ref(new Set(load()))

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...discoveredIds.value]))
  }

  // Returns true if this was a new discovery (first time).
  function discover(bondId) {
    if (discoveredIds.value.has(bondId)) return false
    discoveredIds.value.add(bondId)
    persist()
    return true
  }

  function isDiscovered(bondId) { return discoveredIds.value.has(bondId) }

  const discoveredList = computed(() => [...discoveredIds.value])

  return { discover, isDiscovered, discoveredList }
})
