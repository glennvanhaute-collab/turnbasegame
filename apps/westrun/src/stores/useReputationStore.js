import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCollectionStore } from './useCollectionStore.js'

const STORAGE_KEY = 'raid-reputation'

export const REP_MAX = 30000

export const REP_TIERS = [
  { name: 'Stranger',  threshold: 0     },
  { name: 'Known',     threshold: 500   },
  { name: 'Trusted',   threshold: 2500  },
  { name: 'Allied',    threshold: 7500  },
  { name: 'Devoted',   threshold: 15000 },
  { name: 'Exalted',   threshold: 30000 },
]

export const HOUSE_LORD = {
  'House Caelwyn':  'LORD_CAELWYN',
  'House Aldric':   'LORD_ALDRIC',
  'House Valdris':  'ARCHMAGE_VALDRIS',
  'House Mordaine': 'LORD_MORDAINE',
}

// Which houses are bound together by shared worldview
export const HOUSE_PAIRS = [
  ['House Aldric', 'House Mordaine'],   // old order vs new order — both are about power
  ['House Caelwyn', 'House Valdris'],   // nature vs science — both look beyond human politics
]

export const ALL_HOUSES = ['House Aldric', 'House Mordaine', 'House Caelwyn', 'House Valdris']

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useReputationStore = defineStore('reputation', () => {
  const saved = loadSaved()
  const rep = ref(saved?.rep ?? {})

  // Rep can go negative — houses lose interest when you consistently oppose them
  function getRep(faction) {
    return Math.min(REP_MAX, rep.value[faction] ?? 0)
  }

  // Legacy single-house gain (used by DevMenu)
  function earnRep(faction, amount) {
    const current = getRep(faction)
    rep.value = { ...rep.value, [faction]: Math.min(REP_MAX, current + amount) }
    save()
  }

  // Quest-driven: apply a map of { houseName: delta } all at once
  function applyRepChanges(changes) {
    const updated = { ...rep.value }
    for (const [faction, delta] of Object.entries(changes)) {
      const current = updated[faction] ?? 0
      updated[faction] = Math.min(REP_MAX, current + delta)
    }
    rep.value = updated
    save()
  }

  function setRep(faction, amount) {
    rep.value = { ...rep.value, [faction]: Math.min(REP_MAX, amount) }
    save()
  }

  function tier(faction) {
    const r = Math.max(0, getRep(faction))  // display tiers floor at Stranger
    let current = REP_TIERS[0]
    let next    = REP_TIERS[1]
    for (let i = 0; i < REP_TIERS.length; i++) {
      if (r >= REP_TIERS[i].threshold) {
        current = REP_TIERS[i]
        next    = REP_TIERS[i + 1] ?? null
      }
    }
    const from = current.threshold
    const to   = next?.threshold ?? REP_MAX
    const pct  = next ? Math.min(100, ((r - from) / (to - from)) * 100) : 100
    return { name: current.name, index: REP_TIERS.indexOf(current), next: next?.name ?? null, pct, rep: getRep(faction) }
  }

  function isExalted(faction) {
    return getRep(faction) >= REP_MAX
  }

  function lordKey(faction) {
    return HOUSE_LORD[faction] ?? null
  }

  function canClaimLord(faction) {
    const key = lordKey(faction)
    if (!key || !isExalted(faction)) return false
    const collection = useCollectionStore()
    return !collection.ownsHero(key)
  }

  function claimLord(faction) {
    const key = lordKey(faction)
    if (!key || !canClaimLord(faction)) return
    const collection = useCollectionStore()
    collection.addToRoster(key, { silent: true })
  }

  // Which pair is currently ahead based on combined rep
  const leadingPair = computed(() => {
    const pairScores = HOUSE_PAIRS.map(pair => ({
      pair,
      score: pair.reduce((s, h) => s + getRep(h), 0),
    }))
    pairScores.sort((a, b) => b.score - a.score)
    if (pairScores[0].score === pairScores[1].score) return null  // tied
    return pairScores[0].pair
  })

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rep: rep.value }))
  }

  return {
    getRep, earnRep, applyRepChanges, setRep,
    tier, isExalted, leadingPair,
    lordKey, canClaimLord, claimLord,
    REP_TIERS, HOUSE_LORD, HOUSE_PAIRS, ALL_HOUSES, REP_MAX,
  }
})
