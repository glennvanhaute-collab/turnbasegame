import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const MAX_ENERGY  = 120
const REGEN_MS    = 3 * 60 * 1000  // 1 point every 3 minutes
const STORAGE_KEY = 'raid-energy'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useEnergyStore = defineStore('energy', () => {
  const saved = loadSaved()

  // Apply offline regen
  let initial = saved?.energy ?? MAX_ENERGY
  if (saved?.savedAt) {
    const gained = Math.floor((Date.now() - saved.savedAt) / REGEN_MS)
    initial = Math.min(MAX_ENERGY, initial + gained)
  }

  const energy    = ref(initial)
  const maxEnergy = MAX_ENERGY

  const isFull = computed(() => energy.value >= maxEnergy)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      energy: energy.value,
      savedAt: Date.now(),
    }))
  }

  function canAfford(cost) { return energy.value >= cost }

  function spend(cost) {
    energy.value = Math.max(0, energy.value - cost)
    persist()
  }

  function add(amount) {
    energy.value = Math.min(maxEnergy, energy.value + amount)
    persist()
  }

  // Live regen tick — accumulates ms so regen fires accurately even at 1s resolution
  let acc = 0
  setInterval(() => {
    if (energy.value >= maxEnergy) return
    acc += 1000
    if (acc >= REGEN_MS) {
      acc -= REGEN_MS
      add(1)
    }
  }, 1000)

  persist()

  return { energy, maxEnergy, isFull, canAfford, spend, add }
})
