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
  normal: {
    id: 'normal',
    name: 'Free Companies',
    flavour: 'Warriors, scouts, void-touched wanderers — all walk the same roads seeking coin and a worthy banner. Post your call.',
    cost: { gold: 2000, diamonds: 0 },
    pool: RECRUIT_POOL,
    rates: {
      [Rarity.RARE]:      0.880,
      [Rarity.EPIC]:      0.090,
      [Rarity.LEGENDARY]: 0.025,
      [Rarity.MYTHICAL]:  0.005,
    },
    pity: { threshold: Rarity.EPIC, every: 40 },
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
  const pityCounters = ref({ normal: 0 })

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
    if (p.cost.gold     > 0 && !currency.canAffordGold(p.cost.gold))         return false
    if (p.cost.diamonds > 0 && !currency.canAffordDiamonds(p.cost.diamonds)) return false
    return true
  }

  function canAfford10(portalId) {
    const p = PORTALS[portalId]
    if (p.cost.gold     > 0 && !currency.canAffordGold(p.cost.gold * 10))         return false
    if (p.cost.diamonds > 0 && !currency.canAffordDiamonds(p.cost.diamonds * 10)) return false
    return true
  }

  function summon(portalId) {
    if (pulling.value) return
    const portal = PORTALS[portalId]
    if (!canAfford(portalId)) return

    pulling.value = true
    try {
      // Deduct cost
      if (portal.cost.gold)     currency.spendGold(portal.cost.gold)
      if (portal.cost.diamonds) currency.spendDiamonds(portal.cost.diamonds)

      // City guaranteed recruit overrides normal rarity roll
      const cityKey = cityStore.popPending()
      let entry, rarity, fromCity = false
      if (cityKey && HERO_TEMPLATES[cityKey]) {
        entry    = portal.pool.find(e => e.key === cityKey) ?? { key: cityKey, rarity: HERO_TEMPLATES[cityKey]().rarity }
        rarity   = entry.rarity
        fromCity = true
      } else {
        // Pity check
        const counter = pityCounters.value[portalId]
        const triggerPity = counter >= portal.pity.every - 1
        const guarantee   = triggerPity ? portal.pity.threshold : null
        // Roll rarity then hero — capped at player's current recruitment ceiling
        rarity = rollRarity(portal.rates, guarantee, playerHero.rarity)
        entry  = pickFromPool(portal.pool, rarity)
      }

      if (!entry) return

      // Pity counter management
      if (rarityIndex(rarity) >= rarityIndex(portal.pity.threshold)) {
        pityCounters.value[portalId] = 0
      } else {
        pityCounters.value[portalId]++
      }

      // Add to collection (or handle duplicate)
      const isDuplicate = collection.ownsHero(entry.key)
      collection.addToRoster(entry.key)
      checkBondUnlocks([entry.key])

      // Duplicate compensation
      if (isDuplicate) {
        if (portal.cost.gold)     currency.addGold(Math.floor(portal.cost.gold * 0.5))
        if (portal.cost.diamonds) currency.addDiamonds(Math.floor(portal.cost.diamonds * 0.25))
      }

      lastResult.value = {
        heroKey: entry.key,
        hero: HERO_TEMPLATES[entry.key](),
        rarity,
        isDuplicate,
        portal: portalId,
        fromCity,
        compensation: isDuplicate
          ? (portal.cost.gold ? { gold: Math.floor(portal.cost.gold * 0.5) }
                              : { diamonds: Math.floor(portal.cost.diamonds * 0.25) })
          : null,
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
      if (portal.cost.gold)     currency.spendGold(portal.cost.gold * 10)
      if (portal.cost.diamonds) currency.spendDiamonds(portal.cost.diamonds * 10)

      const results = []
      // Inject city recruit as first result if pending
      const cityKey10 = cityStore.popPending()
      if (cityKey10 && HERO_TEMPLATES[cityKey10]) {
        const cityEntry    = portal.pool.find(e => e.key === cityKey10) ?? { key: cityKey10, rarity: HERO_TEMPLATES[cityKey10]().rarity }
        const cityRarity   = cityEntry.rarity
        const isDup        = collection.ownsHero(cityEntry.key)
        collection.addToRoster(cityEntry.key)
        if (isDup && portal.cost.gold) currency.addGold(Math.floor(portal.cost.gold * 0.5))
        if (rarityIndex(cityRarity) >= rarityIndex(portal.pity.threshold)) pityCounters.value[portalId] = 0
        else pityCounters.value[portalId]++
        results.push({
          heroKey: cityEntry.key, hero: HERO_TEMPLATES[cityEntry.key](), rarity: cityRarity,
          isDuplicate: isDup, portal: portalId, fromCity: true,
          compensation: isDup && portal.cost.gold ? { gold: Math.floor(portal.cost.gold * 0.5) } : null,
        })
      }
      for (let i = 0; i < (cityKey10 ? 9 : 10); i++) {
        const counter     = pityCounters.value[portalId]
        const triggerPity = counter >= portal.pity.every - 1
        const guarantee   = triggerPity ? portal.pity.threshold : null

        const rarity = rollRarity(portal.rates, guarantee, playerHero.rarity)
        const entry  = pickFromPool(portal.pool, rarity)
        if (!entry) continue

        if (rarityIndex(rarity) >= rarityIndex(portal.pity.threshold)) {
          pityCounters.value[portalId] = 0
        } else {
          pityCounters.value[portalId]++
        }

        const isDuplicate = collection.ownsHero(entry.key)
        collection.addToRoster(entry.key)

        if (isDuplicate) {
          if (portal.cost.gold)     currency.addGold(Math.floor(portal.cost.gold * 0.5))
          if (portal.cost.diamonds) currency.addDiamonds(Math.floor(portal.cost.diamonds * 0.25))
        }

        results.push({
          heroKey: entry.key,
          hero:    HERO_TEMPLATES[entry.key](),
          rarity,
          isDuplicate,
          portal:  portalId,
          compensation: isDuplicate
            ? (portal.cost.gold ? { gold: Math.floor(portal.cost.gold * 0.5) }
                                : { diamonds: Math.floor(portal.cost.diamonds * 0.25) })
            : null,
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
