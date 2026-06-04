import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePlayerHeroStore } from './usePlayerHeroStore.js'

const STORAGE_KEY = 'raid-idle-training'
const DECAY  = 0.85   // per-hour rate multiplier
const FLOOR  = 0.10   // minimum rate (10% of base, reached at ~14h)
const FIGHTS_PER_HOUR = 3  // base hourly XP = xpForDifficulty × this

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

// Closed-form integral: ∫₀ᵀ baseHourly * max(FLOOR, DECAY^t) dt
function calcXp(startTime, baseHourlyXp) {
  const T = Math.min((Date.now() - startTime) / 3_600_000, 48)
  if (T <= 0) return 0

  const crossover = Math.log(FLOOR) / Math.log(DECAY)  // ~14.13h
  const lnDecay   = Math.log(DECAY)

  if (T <= crossover) {
    return Math.floor(baseHourlyXp * (Math.pow(DECAY, T) - 1) / lnDecay)
  }
  const phase1 = baseHourlyXp * (FLOOR - 1) / lnDecay
  const phase2 = baseHourlyXp * FLOOR * (T - crossover)
  return Math.floor(phase1 + phase2)
}

export function idleHourlyXp(xpPerFight) {
  return xpPerFight * FIGHTS_PER_HOUR
}

export const useIdleTrainingStore = defineStore('idleTraining', () => {
  const saved   = loadSaved()
  const session = ref(saved?.session ?? null)
  // session shape: { encounterId, encounterName, difficulty, startTime }

  const _tick = ref(Date.now())
  let _interval = null

  watch(() => session.value, (s) => {
    if (s && !_interval) {
      _interval = setInterval(() => { _tick.value = Date.now() }, 10_000)
    } else if (!s && _interval) {
      clearInterval(_interval)
      _interval = null
    }
  }, { immediate: true })

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ session: session.value }))
  }

  const isRunning = computed(() => session.value !== null)

  const accumulatedXp = computed(() => {
    if (!session.value) return 0
    _tick.value  // reactive tie-in so this recomputes every 10s
    const ph = usePlayerHeroStore()
    const baseHourly = ph.xpForDifficulty(session.value.difficulty) * FIGHTS_PER_HOUR
    return calcXp(session.value.startTime, baseHourly)
  })

  const elapsedMs = computed(() => {
    if (!session.value) return 0
    _tick.value
    return Date.now() - session.value.startTime
  })

  // 0.10 – 1.00: current rate relative to base hourly
  const currentRate = computed(() => {
    if (!session.value) return 1
    _tick.value
    const tHours = (Date.now() - session.value.startTime) / 3_600_000
    return Math.max(FLOOR, Math.pow(DECAY, tHours))
  })

  function startIdle(encounter) {
    session.value = {
      encounterId:   encounter.id,
      encounterName: encounter.name,
      difficulty:    encounter.difficulty,
      startTime:     Date.now(),
    }
    persist()
  }

  function stopIdle() {
    session.value = null
    persist()
  }

  // Award accumulated XP and reset the timer so the next collect starts from now
  function collect() {
    if (!session.value) return null
    const xp = accumulatedXp.value
    if (xp <= 0) return { xp: 0, levelsGained: 0 }
    const ph = usePlayerHeroStore()
    const levelsGained = ph.addXp(xp)
    session.value = { ...session.value, startTime: Date.now() }
    persist()
    return { xp, levelsGained }
  }

  return {
    session, isRunning, accumulatedXp, elapsedMs, currentRate,
    FIGHTS_PER_HOUR,
    startIdle, stopIdle, collect,
  }
})
