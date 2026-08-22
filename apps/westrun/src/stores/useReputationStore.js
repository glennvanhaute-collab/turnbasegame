import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCollectionStore } from './useCollectionStore.js'
import { repHouseFor } from '../game/data/westrun/factions.js'

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

// Westrun is split twice, and the two splits do not line up.
//
// POWER — who should hold it, and how:
//   Aldric + Mordaine   both believe the realm is ruled, not administered
//   Caelwyn + Valdris   both believe something outranks the throne
//
// FAITH — see HOUSES_BY_FAITH in game/data/westrun/factions.js:
//   New Gods            Aldric + Valdris
//   Old Gods            Caelwyn + Mordaine
//
// So every alliance is half an alliance. Aldric and Mordaine agree on power and
// nothing at the altar; Caelwyn and Valdris agree the throne is not the point,
// and disagree entirely about what is. There is no pair that agrees on both,
// which is the intended shape — a house is always your ally in one room and your
// opponent in the other.
export const HOUSE_PAIRS = [
  ['House Aldric', 'House Mordaine'],   // power: the realm is ruled
  ['House Caelwyn', 'House Valdris'],   // power: something outranks the throne
]

// The other map. Kept separate on purpose — faith cuts across the power pairs.
export const FAITH_PAIRS = [
  ['House Aldric', 'House Valdris'],    // faith: the New Gods
  ['House Caelwyn', 'House Mordaine'],  // faith: the Old Gods
]

export const ALL_HOUSES = ['House Aldric', 'House Mordaine', 'House Caelwyn', 'House Valdris']

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useReputationStore = defineStore('reputation', () => {
  const saved = loadSaved()
  const rep = ref(saved?.rep ?? {})

  // Rep can go negative — houses lose interest when you consistently oppose them.
  // Bannermen have no track of their own: repHouseFor() sends it up to the liege,
  // so serving Ignar is serving Aldric as far as the ledger is concerned.
  function getRep(faction) {
    return Math.min(REP_MAX, rep.value[repHouseFor(faction)] ?? 0)
  }

  // Legacy single-house gain (used by DevMenu)
  function earnRep(faction, amount) {
    const house = repHouseFor(faction)
    if (!house) return          // the Crown keeps no ledger
    const current = getRep(house)
    rep.value = { ...rep.value, [house]: Math.min(REP_MAX, current + amount) }
    save()
  }

  // Quest-driven: apply a map of { houseName: delta } all at once
  function applyRepChanges(changes) {
    const updated = { ...rep.value }
    for (const [faction, delta] of Object.entries(changes)) {
      const house = repHouseFor(faction)
      if (!house) continue      // the Crown keeps no ledger
      const current = updated[house] ?? 0
      updated[house] = Math.min(REP_MAX, current + delta)
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
