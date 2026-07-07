import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useCollectionStore } from './useCollectionStore.js'

const STORAGE_KEY = 'raid-reputation'

// Reputation earned by interacting with each house (0–30000)
export const REP_MAX = 30000

export const REP_TIERS = [
  { name: 'Stranger',  threshold: 0     },
  { name: 'Known',     threshold: 500   },
  { name: 'Trusted',   threshold: 2500  },
  { name: 'Allied',    threshold: 7500  },
  { name: 'Devoted',   threshold: 15000 },
  { name: 'Exalted',   threshold: 30000 },
]

// Hero key that unlocks when the house reaches Exalted
export const HOUSE_LORD = {
  'House Caelwyn':  'LORD_CAELWYN',
  'House Aldric':   'LORD_ALDRIC',
  'House Valdris':  'ARCHMAGE_VALDRIS',
  'House Mordaine': 'LORD_MORDAINE',
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useReputationStore = defineStore('reputation', () => {
  const saved = loadSaved()
  const rep = ref(saved?.rep ?? {})

  function getRep(faction) {
    return Math.min(REP_MAX, rep.value[faction] ?? 0)
  }

  function earnRep(faction, amount) {
    const current = getRep(faction)
    rep.value = { ...rep.value, [faction]: Math.min(REP_MAX, current + amount) }
    save()
  }

  function setRep(faction, amount) {
    rep.value = { ...rep.value, [faction]: Math.min(REP_MAX, Math.max(0, amount)) }
    save()
  }

  function tier(faction) {
    const r = getRep(faction)
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
    return { name: current.name, index: REP_TIERS.indexOf(current), next: next?.name ?? null, pct, rep: r }
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

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rep: rep.value }))
  }

  return {
    getRep, earnRep, setRep,
    tier, isExalted,
    lordKey, canClaimLord, claimLord,
    REP_TIERS, HOUSE_LORD, REP_MAX,
  }
})
