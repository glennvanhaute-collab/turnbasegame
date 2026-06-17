import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { CLOTHS } from '../game/data/cloths.js'
import { useResourceStore } from './useResourceStore.js'
import { useArtisanStore } from './useArtisanStore.js'

const STORAGE_KEY = 'raid-weaving'
function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useWeavingStore = defineStore('weaving', () => {
  const saved = loadSaved()
  const job  = ref(saved?.job ?? null)
  const _now = ref(Date.now())

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ job: job.value }))
  }

  const completedCount = computed(() => {
    if (!job.value) return 0
    const elapsed = _now.value - job.value.startedAt
    return Math.min(job.value.totalBolts, Math.floor(elapsed / job.value.timePerBolt))
  })

  const remainingCount = computed(() => {
    if (!job.value) return 0
    return job.value.totalBolts - completedCount.value
  })

  const currentProgress = computed(() => {
    if (!job.value || remainingCount.value === 0) return 1
    const elapsed = _now.value - job.value.startedAt
    return (elapsed % job.value.timePerBolt) / job.value.timePerBolt
  })

  const isRunning = computed(() => !!job.value && remainingCount.value > 0)

  function tick() {
    _now.value = Date.now()
    if (!job.value) return

    const elapsedNow  = _now.value         - job.value.startedAt
    const elapsedLast = job.value.lastTickAt - job.value.startedAt

    const totalDue = Math.min(job.value.totalBolts, Math.floor(elapsedNow  / job.value.timePerBolt))
    const lastDue  = Math.min(job.value.totalBolts, Math.floor(elapsedLast / job.value.timePerBolt))
    const newBolts = totalDue - lastDue

    if (newBolts > 0) {
      const resources = useResourceStore()
      const artisan   = useArtisanStore()
      const cloth = CLOTHS[job.value.clothId]
      resources.addCloth(job.value.clothId, newBolts)
      resources.addTailoringXp(Math.ceil(cloth.xp * newBolts * 0.5))
      if (job.value.assignedTailorKey) {
        artisan.addSkillXp(job.value.assignedTailorKey, 'tailoring', cloth.xp * newBolts)
      }
    }

    job.value.lastTickAt = _now.value

    if (totalDue >= job.value.totalBolts) {
      job.value = null
    }

    _persist()
  }

  function startWeave(clothId, qty, speedMultiplier = 1) {
    if (job.value || qty <= 0) return
    const cloth = CLOTHS[clothId]
    if (!cloth) return
    const resources = useResourceStore()
    const artisan   = useArtisanStore()
    resources.removeFiber(cloth.fiberId, cloth.fiberCost * qty)
    const now = Date.now()
    job.value = {
      clothId,
      startedAt:       now,
      lastTickAt:      now,
      totalBolts:      qty,
      timePerBolt:     Math.round(cloth.weaveTime * 1000 / Math.max(1, speedMultiplier)),
      assignedTailorKey: artisan.assignedTailorKey ?? null,
    }
    _now.value = now
    _persist()
  }

  function addToQueue(clothId, qty) {
    if (!job.value || job.value.clothId !== clothId || qty <= 0) return
    const cloth = CLOTHS[clothId]
    if (!cloth) return
    const resources = useResourceStore()
    resources.removeFiber(cloth.fiberId, cloth.fiberCost * qty)
    job.value.totalBolts += qty
    _persist()
  }

  function cancelWeave() {
    if (!job.value) return
    const resources = useResourceStore()
    const cloth = CLOTHS[job.value.clothId]
    resources.addFiber(cloth.fiberId, remainingCount.value * cloth.fiberCost)
    job.value = null
    _persist()
  }

  function instantFinish() {
    if (!job.value) return
    const t = Date.now() - job.value.totalBolts * job.value.timePerBolt - 1000
    job.value.startedAt  = t
    job.value.lastTickAt = t
    tick()
  }

  tick()

  return {
    job, isRunning,
    completedCount, remainingCount, currentProgress,
    tick, startWeave, addToQueue, cancelWeave, instantFinish,
  }
})
