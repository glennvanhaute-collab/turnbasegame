import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { BARS } from '../game/data/bars.js'
import { useResourceStore } from './useResourceStore.js'
import { useArtisanStore } from './useArtisanStore.js'

const STORAGE_KEY = 'raid-smelting'
function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useSmeltingStore = defineStore('smelting', () => {
  const saved = loadSaved()
  // job: { barId, startedAt, lastTickAt, totalBars, timePerBar(ms) } | null
  const job  = ref(saved?.job ?? null)
  const _now = ref(Date.now())

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ job: job.value }))
  }

  const completedCount = computed(() => {
    if (!job.value) return 0
    const elapsed = _now.value - job.value.startedAt
    return Math.min(job.value.totalBars, Math.floor(elapsed / job.value.timePerBar))
  })

  const remainingCount = computed(() => {
    if (!job.value) return 0
    return job.value.totalBars - completedCount.value
  })

  const currentBarProgress = computed(() => {
    if (!job.value || remainingCount.value === 0) return 1
    const elapsed = _now.value - job.value.startedAt
    return (elapsed % job.value.timePerBar) / job.value.timePerBar
  })

  const isRunning = computed(() => !!job.value && remainingCount.value > 0)

  // Called every second from App.vue — awards completed bars and updates _now
  function tick() {
    _now.value = Date.now()
    if (!job.value) return

    const elapsedNow  = _now.value         - job.value.startedAt
    const elapsedLast = job.value.lastTickAt - job.value.startedAt

    const totalDue = Math.min(job.value.totalBars, Math.floor(elapsedNow  / job.value.timePerBar))
    const lastDue  = Math.min(job.value.totalBars, Math.floor(elapsedLast / job.value.timePerBar))
    const newBars  = totalDue - lastDue

    if (newBars > 0) {
      const resources = useResourceStore()
      const artisan   = useArtisanStore()
      const bar = BARS[job.value.barId]
      resources.addBar(job.value.barId, newBars)
      resources.addSmithingXp(Math.ceil(bar.xp * newBars * 0.5))
      if (job.value.assignedSmithKey) {
        artisan.addSkillXp(job.value.assignedSmithKey, 'blacksmithing', bar.xp * newBars)
      }
    }

    job.value.lastTickAt = _now.value

    if (totalDue >= job.value.totalBars) {
      job.value = null
    }

    _persist()
  }

  function startSmelt(barId, qty, speedMultiplier = 1) {
    if (job.value || qty <= 0) return
    const bar = BARS[barId]
    if (!bar) return
    const resources = useResourceStore()
    const artisan   = useArtisanStore()
    resources.removeOre(bar.oreId, bar.oreCost * qty)
    const now = Date.now()
    job.value = {
      barId,
      startedAt:        now,
      lastTickAt:       now,
      totalBars:        qty,
      timePerBar:       Math.round(bar.smeltTime * 1000 / Math.max(1, speedMultiplier)),
      assignedSmithKey: artisan.assignedForgeSmithKey ?? null,
    }
    _now.value = now
    _persist()
  }

  function cancelSmelt() {
    if (!job.value) return
    const resources = useResourceStore()
    const bar = BARS[job.value.barId]
    resources.addOre(bar.oreId, remainingCount.value * bar.oreCost)
    job.value = null
    _persist()
  }

  // Catch up on init (handles offline progress)
  tick()

  return {
    job, isRunning,
    completedCount, remainingCount, currentBarProgress,
    tick, startSmelt, cancelSmelt,
  }
})
