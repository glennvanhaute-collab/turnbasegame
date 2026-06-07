import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LORE } from '../game/data/lore.js'

const STORAGE_KEY = 'codex-fragments'

export const useCodexStore = defineStore('codex', () => {
  const saved = (() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
  })()

  const unlockedIds = ref(saved?.unlockedIds ?? [])

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ unlockedIds: unlockedIds.value }))
  }

  function isUnlocked(fragmentId) {
    return unlockedIds.value.includes(fragmentId)
  }

  function unlock(fragmentId) {
    if (unlockedIds.value.includes(fragmentId)) return false
    unlockedIds.value = [...unlockedIds.value, fragmentId]
    persist()
    return true
  }

  // Returns the next locked fragment (in order) for a random eligible hero.
  // Fragments always unlock top-to-bottom: f1 before f2, f2 before f3, etc.
  function pickTavernFragment() {
    const candidates = []
    for (const [heroId, entry] of Object.entries(LORE)) {
      if (entry.locked) {
        if (!entry.unlockedBy || !unlockedIds.value.includes(entry.unlockedBy)) continue
      }
      const nextFrag = (entry.fragments ?? []).find(f => !unlockedIds.value.includes(f.id))
      if (nextFrag) candidates.push({ heroId, heroTitle: entry.title, frag: nextFrag })
    }
    if (!candidates.length) return null
    return candidates[Math.floor(Math.random() * candidates.length)]
  }

  return { unlockedIds, isUnlocked, unlock, pickTavernFragment }
})
