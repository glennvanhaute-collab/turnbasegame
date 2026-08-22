import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'city-recruits'

export const useCityStore = defineStore('cities', () => {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
  })()

  // Ordered queue of hero keys guaranteed on next summon (FIFO)
  const pendingRecruits = ref(saved?.pendingRecruits ?? [])

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ pendingRecruits: pendingRecruits.value }))
  }

  function hasPending() {
    return pendingRecruits.value.length > 0
  }

  // Add to queue; skip if already queued for same hero
  function addPending(heroKey) {
    if (pendingRecruits.value.includes(heroKey)) return
    pendingRecruits.value = [...pendingRecruits.value, heroKey]
    persist()
  }

  // Pop and return the next queued hero key
  function popPending() {
    if (!pendingRecruits.value.length) return null
    const [first, ...rest] = pendingRecruits.value
    pendingRecruits.value = rest
    persist()
    return first
  }

  return { pendingRecruits, hasPending, addPending, popPending }
})
