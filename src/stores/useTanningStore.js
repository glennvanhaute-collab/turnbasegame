import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { LEATHERS } from '../game/data/leathers.js'
import { useResourceStore } from './useResourceStore.js'
import { useArtisanStore } from './useArtisanStore.js'

const STORAGE_KEY = 'raid-tanning'
function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useTanningStore = defineStore('tanning', () => {
  const saved = loadSaved()
  // job: { leatherId, startedAt, lastTickAt, totalStrips, timePerStrip(ms) } | null
  const job  = ref(saved?.job ?? null)
  const _now = ref(Date.now())

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ job: job.value }))
  }

  const completedCount = computed(() => {
    if (!job.value) return 0
    const elapsed = _now.value - job.value.startedAt
    return Math.min(job.value.totalStrips, Math.floor(elapsed / job.value.timePerStrip))
  })

  const remainingCount = computed(() => {
    if (!job.value) return 0
    return job.value.totalStrips - completedCount.value
  })

  const currentProgress = computed(() => {
    if (!job.value || remainingCount.value === 0) return 1
    const elapsed = _now.value - job.value.startedAt
    return (elapsed % job.value.timePerStrip) / job.value.timePerStrip
  })

  const isRunning = computed(() => !!job.value && remainingCount.value > 0)

  function tick() {
    _now.value = Date.now()
    if (!job.value) return

    const elapsedNow  = _now.value         - job.value.startedAt
    const elapsedLast = job.value.lastTickAt - job.value.startedAt

    const totalDue = Math.min(job.value.totalStrips, Math.floor(elapsedNow  / job.value.timePerStrip))
    const lastDue  = Math.min(job.value.totalStrips, Math.floor(elapsedLast / job.value.timePerStrip))
    const newStrips = totalDue - lastDue

    if (newStrips > 0) {
      const resources = useResourceStore()
      const artisan   = useArtisanStore()
      const leather = LEATHERS[job.value.leatherId]
      resources.addLeather(job.value.leatherId, newStrips)
      resources.addLeatherworkingXp(Math.ceil(leather.xp * newStrips * 0.5))
      if (job.value.assignedTannerKey) {
        artisan.addSkillXp(job.value.assignedTannerKey, 'leatherworking', leather.xp * newStrips)
      }
    }

    job.value.lastTickAt = _now.value

    if (totalDue >= job.value.totalStrips) {
      job.value = null
    }

    _persist()
  }

  function startTan(leatherId, qty, speedMultiplier = 1) {
    if (job.value || qty <= 0) return
    const leather = LEATHERS[leatherId]
    if (!leather) return
    const resources = useResourceStore()
    const artisan   = useArtisanStore()
    resources.removeHide(leather.hideId, leather.hideCost * qty)
    const now = Date.now()
    job.value = {
      leatherId,
      startedAt:        now,
      lastTickAt:       now,
      totalStrips:      qty,
      timePerStrip:     Math.round(leather.tanTime * 1000 / Math.max(1, speedMultiplier)),
      assignedTannerKey: artisan.assignedTannerKey ?? null,
    }
    _now.value = now
    _persist()
  }

  function addToQueue(leatherId, qty) {
    if (!job.value || job.value.leatherId !== leatherId || qty <= 0) return
    const leather = LEATHERS[leatherId]
    if (!leather) return
    const resources = useResourceStore()
    resources.removeHide(leather.hideId, leather.hideCost * qty)
    job.value.totalStrips += qty
    _persist()
  }

  function cancelTan() {
    if (!job.value) return
    const resources = useResourceStore()
    const leather = LEATHERS[job.value.leatherId]
    resources.addHide(leather.hideId, remainingCount.value * leather.hideCost)
    job.value = null
    _persist()
  }

  tick()

  return {
    job, isRunning,
    completedCount, remainingCount, currentProgress,
    tick, startTan, addToQueue, cancelTan,
  }
})
