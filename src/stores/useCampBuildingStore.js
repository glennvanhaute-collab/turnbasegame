import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useResourceStore }  from './useResourceStore.js'
import { useCurrencyStore }  from './useCurrencyStore.js'
import { CAMP_BUILDINGS, BUILDING_IDS, getActiveUnlocks } from '../game/data/campBuildings.js'

const STORAGE_KEY = 'raid-camp-buildings'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useCampBuildingStore = defineStore('campBuildings', () => {
  const saved = loadSaved()

  // { buildingId: currentTier (0 = not built) }
  const levels = ref(saved?.levels ?? Object.fromEntries(BUILDING_IDS.map(id => [id, 0])))

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ levels: levels.value }))
  }

  function getLevel(id) {
    return levels.value[id] ?? 0
  }

  function getMaxTier(id) {
    return CAMP_BUILDINGS[id]?.tiers.length ?? 0
  }

  function isMaxed(id) {
    return getLevel(id) >= getMaxTier(id)
  }

  function getNextCost(id) {
    const nextTier = getLevel(id) + 1
    const def = CAMP_BUILDINGS[id]
    if (!def || nextTier > def.tiers.length) return null
    return def.tiers[nextTier - 1].cost
  }

  function canAfford(id) {
    const cost = getNextCost(id)
    if (!cost) return false
    const resources = useResourceStore()
    const currency  = useCurrencyStore()
    if (currency.gold < cost.gold) return false
    for (const [oreId, amount] of Object.entries(cost.ores ?? {})) {
      if ((resources.ores[oreId] ?? 0) < amount) return false
    }
    for (const [plankId, amount] of Object.entries(cost.planks ?? {})) {
      if ((resources.planks[plankId] ?? 0) < amount) return false
    }
    return true
  }

  function upgrade(id) {
    if (!canAfford(id) || isMaxed(id)) return false
    const cost      = getNextCost(id)
    const resources = useResourceStore()
    const currency  = useCurrencyStore()

    currency.spendGold(cost.gold)
    for (const [oreId, amount] of Object.entries(cost.ores ?? {})) {
      resources.removeOre(oreId, amount)
    }
    for (const [plankId, amount] of Object.entries(cost.planks ?? {})) {
      resources.removePlank(plankId, amount)
    }
    levels.value[id] = getLevel(id) + 1
    persist()
    return true
  }

  // All siege/feature unlocks from current building levels
  const activeUnlocks = computed(() => getActiveUnlocks(levels.value))

  function hasUnlock(unlockId) {
    return activeUnlocks.value.has(unlockId)
  }

  // Quartermaster's Hold bonus: multiplier on idle rates
  const idleRateMultiplier = computed(() => {
    const tier = getLevel('quartermasters_hold')
    const bonuses = [0, 0.20, 0.25, 0.30, 0.35, 0.50]
    return 1 + (bonuses[tier] ?? 0)
  })

  // Quartermaster's Hold: extended cap hours
  const idleCapHours = computed(() => {
    const tier = getLevel('quartermasters_hold')
    if (tier >= 5) return 20
    if (tier >= 4) return 16
    return 12
  })

  // Warband Hall ATK bonus (as a fraction, e.g. 0.15 = +15%)
  const atkBonus = computed(() => {
    const tier = getLevel('warband_hall')
    const bonuses = [0, 0.05, 0.10, 0.15, 0.20, 0.25]
    return bonuses[tier] ?? 0
  })

  // Arcane Post magic damage bonus (fraction)
  const magicDmgBonus = computed(() => {
    const tier = getLevel('arcane_post')
    const bonuses = [0, 0.05, 0.08, 0.12, 0.15, 0.20]
    return bonuses[tier] ?? 0
  })

  const magicResBonus = computed(() => {
    const tier = getLevel('arcane_post')
    const bonuses = [0, 0, 0.05, 0.10, 0.12, 0.15]
    return bonuses[tier] ?? 0
  })

  // Healer's Tent: starting HP bonus (fraction)
  const healerHpBonus = computed(() => {
    const tier = getLevel('healers_tent')
    const bonuses = [0, 0.05, 0.05, 0.05, 0.15, 0.15]
    return bonuses[tier] ?? 0
  })

  // Healer's Tent: revive count per siege
  const siegeRevives = computed(() => {
    const tier = getLevel('healers_tent')
    if (tier >= 5) return 2
    if (tier >= 3) return 1
    return 0
  })

  // Vigil: first-turn SPD bonus (fraction)
  const vigilSpdBonus = computed(() => {
    const tier = getLevel('the_vigil')
    if (tier >= 5) return 0.15
    if (tier >= 3) return 0.10
    return 0
  })

  // Lumber Hall: woodworking XP multiplier bonus (fraction, e.g. 0.20 = +20%)
  const lumberXpBonus = computed(() => {
    const bonuses = [0, 0.20, 0.35, 0.50, 0.65, 0.80]
    return bonuses[getLevel('lumber_hall')] ?? 0
  })

  // Lumber Hall: DEF bonus for heroes (fraction)
  const lumberDefBonus = computed(() => {
    const tier = getLevel('lumber_hall')
    if (tier >= 5) return 0.15
    if (tier >= 4) return 0.10
    if (tier >= 3) return 0.05
    return 0
  })

  return {
    levels,
    getLevel, getMaxTier, isMaxed,
    getNextCost, canAfford, upgrade,
    activeUnlocks, hasUnlock,
    idleRateMultiplier, idleCapHours,
    atkBonus, magicDmgBonus, magicResBonus,
    healerHpBonus, siegeRevives, vigilSpdBonus,
    lumberXpBonus, lumberDefBonus,
  }
})
