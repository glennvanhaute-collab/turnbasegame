import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { usePlayerHeroStore } from './usePlayerHeroStore.js'
import { useResourceStore }   from './useResourceStore.js'
import { useCurrencyStore }   from './useCurrencyStore.js'

const STORAGE_KEY  = 'raid-idle-training'
const CAP_HOURS    = 12
const FIGHTS_PER_HOUR = 3

// Flat hourly rates — no decay, AFK Arena style
export const IDLE_HOURLY_RATES = {
  Easy: {
    gold: 150,
    ores: [{ id: 'copper', rate: 2 }, { id: 'tin', rate: 0.5 }],
    keys: [{ tier: 'easy', rate: 1.5 }],
  },
  Normal: {
    gold: 300,
    ores: [{ id: 'copper', rate: 2 }, { id: 'tin', rate: 1.5 }],
    keys: [{ tier: 'easy', rate: 1.5 }, { tier: 'medium', rate: 0.5 }],
  },
  Hard: {
    gold: 600,
    ores: [{ id: 'tin', rate: 3 }, { id: 'steel', rate: 1.5 }],
    keys: [{ tier: 'medium', rate: 1.0 }, { tier: 'hard', rate: 0.25 }],
  },
  Nightmare: {
    gold: 1200,
    ores: [{ id: 'steel', rate: 3 }, { id: 'darksteel', rate: 1 }],
    keys: [{ tier: 'hard', rate: 0.75 }, { tier: 'nightmare', rate: 0.15 }],
  },
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export function idleHourlyXp(xpPerFight) {
  return xpPerFight * FIGHTS_PER_HOUR
}

export const useIdleTrainingStore = defineStore('idleTraining', () => {
  const saved   = loadSaved()
  const session = ref(saved?.session ?? null)
  // session: { encounterId, encounterName, difficulty, startTime }

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

  // Real elapsed — shown to the player (not capped)
  const realElapsedMs = computed(() => {
    if (!session.value) return 0
    _tick.value
    return Date.now() - session.value.startTime
  })

  // Capped elapsed — used for resource calculation
  const elapsedMs = computed(() => Math.min(realElapsedMs.value, CAP_HOURS * 3_600_000))

  const elapsedHours = computed(() => elapsedMs.value / 3_600_000)

  const isCapped = computed(() => {
    if (!session.value) return false
    _tick.value
    return realElapsedMs.value >= CAP_HOURS * 3_600_000
  })

  const capProgress = computed(() => Math.min(elapsedHours.value / CAP_HOURS, 1))

  const accumulatedXp = computed(() => {
    if (!session.value) return 0
    _tick.value
    const ph = usePlayerHeroStore()
    return Math.floor(ph.xpForDifficulty(session.value.difficulty) * FIGHTS_PER_HOUR * elapsedHours.value)
  })

  const accumulatedGold = computed(() => {
    if (!session.value) return 0
    _tick.value
    return Math.floor((IDLE_HOURLY_RATES[session.value.difficulty]?.gold ?? 0) * elapsedHours.value)
  })

  const accumulatedOres = computed(() => {
    if (!session.value) return []
    _tick.value
    return (IDLE_HOURLY_RATES[session.value.difficulty]?.ores ?? [])
      .map(o => ({ id: o.id, amount: Math.floor(o.rate * elapsedHours.value) }))
      .filter(o => o.amount > 0)
  })

  const accumulatedKeys = computed(() => {
    if (!session.value) return []
    _tick.value
    return (IDLE_HOURLY_RATES[session.value.difficulty]?.keys ?? [])
      .map(k => ({ tier: k.tier, amount: Math.floor(k.rate * elapsedHours.value) }))
      .filter(k => k.amount > 0)
  })

  const hasAnything = computed(() =>
    accumulatedXp.value > 0 || accumulatedGold.value > 0 ||
    accumulatedOres.value.length > 0 || accumulatedKeys.value.length > 0
  )

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

  function collect() {
    if (!session.value) return null
    const ph        = usePlayerHeroStore()
    const resources = useResourceStore()
    const currency  = useCurrencyStore()

    const xp   = accumulatedXp.value
    const gold = accumulatedGold.value
    const ores = [...accumulatedOres.value]
    const keys = [...accumulatedKeys.value]

    const levelsGained = xp   > 0 ? ph.addXp(xp)         : 0
    if (gold > 0)               currency.addGold(gold)
    ores.forEach(({ id, amount })   => resources.addOre(id, amount))
    keys.forEach(({ tier, amount }) => resources.addDungeonKey(tier, amount))

    session.value = { ...session.value, startTime: Date.now() }
    persist()

    return { xp, gold, levelsGained, ores, keys }
  }

  return {
    session, isRunning,
    realElapsedMs, elapsedMs, elapsedHours,
    isCapped, capProgress, hasAnything,
    accumulatedXp, accumulatedGold, accumulatedOres, accumulatedKeys,
    FIGHTS_PER_HOUR, CAP_HOURS, IDLE_HOURLY_RATES,
    startIdle, stopIdle, collect,
  }
})
