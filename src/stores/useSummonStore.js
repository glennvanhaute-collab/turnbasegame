import { defineStore } from 'pinia'
import { ref } from 'vue'
import { HERO_TEMPLATES, RECRUIT_POOL } from '../game/data/heroes.js'
import { Rarity } from '../game/Hero.js'
import { useCurrencyStore } from './useCurrencyStore.js'
import { useCollectionStore } from './useCollectionStore.js'
import { usePlayerHeroStore } from './usePlayerHeroStore.js'
import { useBondStore } from './useBondStore.js'
import { useCityStore } from './useCityStore.js'
import { BONDS } from '../game/data/bonds.js'

// ── Portal definitions ──────────────────────────────────────────────────────
export const PORTALS = {
  common_writ: {
    id: 'common_writ',
    scrollType: 'commonWrit',
    name: 'Common Writ',
    flavour: 'A contract sealed at the crossroads — wanderers, scouts, and sell-swords answer the call.',
    pool: RECRUIT_POOL,
    rates: {
      [Rarity.RARE]: 0.95,
      [Rarity.EPIC]: 0.05,
    },
    pity: { threshold: Rarity.EPIC, every: 40 },
    duplicateGold: 500,
  },
  sealed_charter: {
    id: 'sealed_charter',
    scrollType: 'sealedCharter',
    name: 'Sealed Charter',
    flavour: "A minor lord's endorsement. Experienced champions and veteran knights answer the house seal.",
    pool: RECRUIT_POOL,
    ignoreCeiling: true,
    rates: {
      [Rarity.RARE]: 0.70,
      [Rarity.EPIC]: 0.30,
    },
    pity: { threshold: Rarity.EPIC, every: 20 },
    duplicateGold: 3000,
  },
  house_seal: {
    id: 'house_seal',
    scrollType: 'houseSeal',
    name: 'House Seal',
    flavour: "The lord's direct summons. Only those who have earned a name — the legendary and the mythical — will answer.",
    pool: RECRUIT_POOL,
    ignoreCeiling: true,
    rates: {
      [Rarity.RARE]:      0.55,
      [Rarity.EPIC]:      0.40,
      [Rarity.LEGENDARY]: 0.05,
    },
    pity: { threshold: Rarity.LEGENDARY, every: 20 },
    duplicateGold: 10000,
  },
}

const RARITY_ORDER = [
  Rarity.RARE, Rarity.EPIC, Rarity.LEGENDARY, Rarity.MYTHICAL,
]

function rarityIndex(r) { return RARITY_ORDER.indexOf(r) }

function rollRarity(rates, guaranteeMinRarity = null, maxRarity = null) {
  let eligible = Object.entries(rates)

  if (maxRarity !== null) {
    const maxIdx = rarityIndex(maxRarity)
    eligible = eligible.filter(([r]) => rarityIndex(r) <= maxIdx)
  }

  if (guaranteeMinRarity) {
    const minIdx = rarityIndex(guaranteeMinRarity)
    eligible = eligible.filter(([r]) => rarityIndex(r) >= minIdx)
  }

  const total = eligible.reduce((s, [, w]) => s + w, 0)
  let roll = Math.random() * total
  for (const [rarity, weight] of eligible) {
    roll -= weight
    if (roll <= 0) return rarity
  }
  return eligible[eligible.length - 1][0]
}

function pickFromPool(pool, rarity) {
  const candidates = pool.filter(e => e.rarity === rarity)
  if (!candidates.length) return null
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export const useSummonStore = defineStore('summon', () => {
  const currency    = useCurrencyStore()
  const collection  = useCollectionStore()
  const playerHero  = usePlayerHeroStore()
  const bondStore   = useBondStore()
  const cityStore   = useCityStore()

  // Per-portal pity counters (pulls since last pity-threshold hit)
  const pityCounters = ref({ common_writ: 0, sealed_charter: 0, house_seal: 0 })

  // Last pull result(s) for the reveal animation
  const lastResult  = ref(null)   // single pull
  const lastResults = ref([])     // 10x pull
  const pulling     = ref(false)

  // Set when a pull completes a bond for the first time — cleared by dismissBondReveal()
  const pendingBondReveal = ref(null)

  function checkBondUnlocks(pulledKeys) {
    for (const bond of BONDS) {
      if (!bond.keys.some(k => pulledKeys.includes(k))) continue
      if (!bond.keys.every(k => collection.ownsHero(k))) continue
      if (bondStore.discover(bond.id)) {
        pendingBondReveal.value = bond
        break
      }
    }
  }

  function dismissBondReveal() { pendingBondReveal.value = null }

  function canAfford(portalId) {
    const p = PORTALS[portalId]
    return currency.canAffordScroll(p.scrollType, 1)
  }

  function canAfford10(portalId) {
    const p = PORTALS[portalId]
    return currency.canAffordScroll(p.scrollType, 10)
  }

  function summon(portalId) {
    if (pulling.value) return
    const portal = PORTALS[portalId]
    if (!canAfford(portalId)) return

    pulling.value = true
    try {
      currency.spendScroll(portal.scrollType, 1)

      // City guaranteed recruit overrides normal rarity roll
      const cityKey = cityStore.popPending()
      let entry, rarity, fromCity = false
      if (cityKey && HERO_TEMPLATES[cityKey]) {
        const tentativeEntry  = portal.pool.find(e => e.key === cityKey) ?? { key: cityKey, rarity: HERO_TEMPLATES[cityKey]().rarity }
        const tentativeRarity = tentativeEntry.rarity
        if (rarityIndex(tentativeRarity) <= rarityIndex(playerHero.rarity)) {
          entry    = tentativeEntry
          rarity   = tentativeRarity
          fromCity = true
        } else {
          cityStore.addPending(cityKey)
        }
      }
      if (!fromCity) {
        const counter     = pityCounters.value[portalId]
        const triggerPity = counter >= portal.pity.every - 1
        const guarantee   = triggerPity ? portal.pity.threshold : null
        const maxRarity   = portal.ignoreCeiling ? null : playerHero.rarity
        rarity = rollRarity(portal.rates, guarantee, maxRarity)
        entry  = pickFromPool(portal.pool, rarity)
      }

      if (!entry) return

      if (rarityIndex(rarity) >= rarityIndex(portal.pity.threshold)) {
        pityCounters.value[portalId] = 0
      } else {
        pityCounters.value[portalId]++
      }

      const isDuplicate = collection.ownsHero(entry.key)
      collection.addToRoster(entry.key)
      checkBondUnlocks([entry.key])

      let starAdded = false
      if (isDuplicate) {
        starAdded = collection.addStar(entry.key)
        currency.addGold(portal.duplicateGold ?? 500)
      }

      lastResult.value = {
        heroKey: entry.key,
        hero: HERO_TEMPLATES[entry.key](),
        rarity,
        isDuplicate,
        starAdded,
        newStarCount: collection.getStars(entry.key),
        portal: portalId,
        fromCity,
        compensation: isDuplicate ? { gold: portal.duplicateGold ?? 500 } : null,
      }
    } catch (e) {
      console.error('Summon error:', e)
    } finally {
      pulling.value = false
    }
  }

  function summon10(portalId) {
    if (pulling.value) return
    const portal = PORTALS[portalId]
    if (!canAfford10(portalId)) return

    pulling.value = true
    try {
      currency.spendScroll(portal.scrollType, 10)

      const results = []
      const cityKey10 = cityStore.popPending()
      let usedCitySlot = false
      if (cityKey10 && HERO_TEMPLATES[cityKey10]) {
        const cityEntry  = portal.pool.find(e => e.key === cityKey10) ?? { key: cityKey10, rarity: HERO_TEMPLATES[cityKey10]().rarity }
        const cityRarity = cityEntry.rarity
        if (rarityIndex(cityRarity) <= rarityIndex(playerHero.rarity)) {
          const isDup = collection.ownsHero(cityEntry.key)
          collection.addToRoster(cityEntry.key)
          let cityStarAdded = false
          if (isDup) { cityStarAdded = collection.addStar(cityEntry.key); currency.addGold(portal.duplicateGold ?? 500) }
          if (rarityIndex(cityRarity) >= rarityIndex(portal.pity.threshold)) pityCounters.value[portalId] = 0
          else pityCounters.value[portalId]++
          results.push({
            heroKey: cityEntry.key, hero: HERO_TEMPLATES[cityEntry.key](), rarity: cityRarity,
            isDuplicate: isDup, starAdded: cityStarAdded, newStarCount: collection.getStars(cityEntry.key),
            portal: portalId, fromCity: true,
            compensation: isDup ? { gold: portal.duplicateGold ?? 500 } : null,
          })
          usedCitySlot = true
        } else {
          cityStore.addPending(cityKey10)
        }
      }
      const maxRarity = portal.ignoreCeiling ? null : playerHero.rarity
      for (let i = 0; i < (usedCitySlot ? 9 : 10); i++) {
        const counter     = pityCounters.value[portalId]
        const triggerPity = counter >= portal.pity.every - 1
        const guarantee   = triggerPity ? portal.pity.threshold : null

        const rarity = rollRarity(portal.rates, guarantee, maxRarity)
        const entry  = pickFromPool(portal.pool, rarity)
        if (!entry) continue

        if (rarityIndex(rarity) >= rarityIndex(portal.pity.threshold)) {
          pityCounters.value[portalId] = 0
        } else {
          pityCounters.value[portalId]++
        }

        const isDuplicate = collection.ownsHero(entry.key)
        collection.addToRoster(entry.key)
        let starAdded = false
        if (isDuplicate) {
          starAdded = collection.addStar(entry.key)
          currency.addGold(portal.duplicateGold ?? 500)
        }

        results.push({
          heroKey: entry.key,
          hero:    HERO_TEMPLATES[entry.key](),
          rarity,
          isDuplicate,
          starAdded,
          newStarCount: collection.getStars(entry.key),
          portal:  portalId,
          compensation: isDuplicate ? { gold: portal.duplicateGold ?? 500 } : null,
        })
      }

      // Sort best rarity first
      results.sort((a, b) => rarityIndex(b.rarity) - rarityIndex(a.rarity))
      lastResults.value = results
      checkBondUnlocks(results.map(r => r.heroKey))
    } catch (e) {
      console.error('Summon ×10 error:', e)
    } finally {
      pulling.value = false
    }
  }

  function dismissResult()  { lastResult.value  = null }
  function dismissResults() { lastResults.value = [] }

  function pityProgress(portalId) {
    const portal = PORTALS[portalId]
    const count  = pityCounters.value[portalId]
    return { current: count, max: portal.pity.every, pct: (count / portal.pity.every) * 100 }
  }

  return {
    PORTALS, pulling, lastResult, lastResults, pendingBondReveal,
    canAfford, canAfford10, summon, summon10, dismissResult, dismissResults, dismissBondReveal, pityProgress,
  }
})
