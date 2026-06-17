import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { GearSlot, GearType, SLOT_ALLOWED_TYPES, DUAL_WIELD_BONUS, SHIELD_PASSIVE_DR, WEAPON_ARMOR_TYPE, TWO_HANDED_WEAPON_TYPES, createItemInstance, computeLineStats } from '../game/Gear.js'
import { SET_BONUSES, SET_PASSIVE_6 } from '../game/data/setBonus.js'
import { GEAR_CATALOG, GEAR_BY_ID } from '../game/data/gear.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'
import { usePlayerHeroStore } from './usePlayerHeroStore.js'
import { useCurrencyStore } from './useCurrencyStore.js'
import { computeCP } from '../game/cp.js'
import { RECIPES, STAR_BAR_COST } from '../game/data/recipes.js'

// Gold per bar by material tier — the main economy tuning knob
const TIER_BAR_GOLD = {
  copper:     50,
  tin:       120,
  steel:     250,
  darksteel: 500,
  mithril:   900,
  moonsilver: 1500,
  vaultmetal: 1200,
  runeite:   1800,
}

export function calcSellPrice(item) {
  const goldPerBar = TIER_BAR_GOLD[item.tier]
  if (!goldPerBar) return 50
  const recipe = RECIPES.find(r => r.id === item.id)
  const craftBars = recipe ? Object.values(recipe.barCost).reduce((s, v) => s + v, 0) : 0
  let upgradeBars = 0
  for (let s = 1; s <= (item.stars ?? 0); s++) upgradeBars += (STAR_BAR_COST[s] ?? 0)
  return (craftBars + upgradeBars) * goldPerBar
}

const STARTER_IDS = []

const PLAYER_KEYS = ['IRON_BLADE', 'EMBER_SAGE', 'LIRIEN', 'SHADOW_FANG']

const EMPTY_LOADOUT = () => ({
  [GearSlot.MAIN_HAND]: null,
  [GearSlot.OFF_HAND]:  null,
  [GearSlot.HEAD]:      null,
  [GearSlot.CHEST]:     null,
  [GearSlot.LEGS]:      null,
  [GearSlot.BOOTS]:     null,
  [GearSlot.GLOVES]:    null,
})

const SOUL_KEY      = 'raid-soul-vessels'
const INVENTORY_KEY = 'raid-inventory'

function loadSoulData() {
  try { return JSON.parse(localStorage.getItem(SOUL_KEY) ?? 'null') } catch { return null }
}

function attachMethod(item) {
  item.lines     = item.lines     ?? []
  item.stars     = item.stars     ?? 0
  item.baseStats = item.baseStats ?? { ...item.stats }
  item.fitsSlot  = function(slot) { return SLOT_ALLOWED_TYPES[slot]?.includes(this.gearType) ?? false }
  return item
}

function loadInventoryData() {
  try {
    const saved = JSON.parse(localStorage.getItem(INVENTORY_KEY) ?? 'null')
    if (!saved) return null
    return {
      instances:    (saved.instances   ?? []).map(attachMethod),
      loadouts:     saved.loadouts     ?? {},
      gearDisabled: saved.gearDisabled ?? {},
    }
  } catch { return null }
}

function saveInventoryData(instances, loadouts, gearDisabled) {
  // fitsSlot is a method — JSON.stringify drops it automatically
  localStorage.setItem(INVENTORY_KEY, JSON.stringify({ instances, loadouts, gearDisabled }))
}

export const useInventoryStore = defineStore('inventory', () => {
  const _soul      = loadSoulData()
  const _inventory = loadInventoryData()

  const soulVessels         = ref(_soul?.count          ?? 0)
  const progressiveHeroKeys = ref(_soul?.progressiveKeys ?? [])

  watch([soulVessels, progressiveHeroKeys], () => {
    localStorage.setItem(SOUL_KEY, JSON.stringify({
      count:           soulVessels.value,
      progressiveKeys: progressiveHeroKeys.value,
    }))
  }, { deep: true })

  function awardSoulVessel() {
    soulVessels.value++
  }

  function useSoulVessel(heroKey) {
    if (soulVessels.value <= 0) return false
    if (progressiveHeroKeys.value.includes(heroKey)) return false
    soulVessels.value--
    progressiveHeroKeys.value = [...progressiveHeroKeys.value, heroKey]
    return true
  }

  function isProgressive(heroKey) {
    return progressiveHeroKeys.value.includes(heroKey)
  }

  const ownedInstances = ref(
    _inventory?.instances ?? STARTER_IDS.map(id => createItemInstance(GEAR_BY_ID[id])).filter(Boolean)
  )
  const loadouts     = ref(_inventory?.loadouts     ?? {})
  const gearDisabled = ref(_inventory?.gearDisabled ?? {})

  watch([ownedInstances, loadouts, gearDisabled], () => {
    saveInventoryData(ownedInstances.value, loadouts.value, gearDisabled.value)
  }, { deep: true })

  const focusedHeroKey = ref(null)
  const pendingSlot    = ref(null)

  // Alias for components that iterate owned items
  const ownedItems = computed(() => ownedInstances.value)

  function instanceById(instanceId) {
    return ownedInstances.value.find(i => i.instanceId === instanceId) ?? null
  }

  function getLoadout(heroKey) {
    if (!loadouts.value[heroKey]) loadouts.value[heroKey] = EMPTY_LOADOUT()
    return loadouts.value[heroKey]
  }

  function getEquippedItem(heroKey, slot) {
    const iid = getLoadout(heroKey)[slot]
    return iid ? instanceById(iid) : null
  }

  function isTwoHanded(item) {
    return item?.gearType === GearType.WEAPON && TWO_HANDED_WEAPON_TYPES.has(item.weaponType)
  }

  function isTwoHandedMainHand(heroKey) {
    return isTwoHanded(getEquippedItem(heroKey, GearSlot.MAIN_HAND))
  }

  function equip(heroKey, slot, instanceId) {
    const item = instanceById(instanceId)
    if (!item) return
    if (!item.fitsSlot(slot)) return
    // Block off_hand while a two-handed weapon occupies main_hand
    if (slot === GearSlot.OFF_HAND && isTwoHandedMainHand(heroKey)) return
    // Remove from any other slot first (one item, one hero)
    for (const key of Object.keys(loadouts.value)) {
      for (const s of Object.values(GearSlot)) {
        if (loadouts.value[key][s] === instanceId) loadouts.value[key][s] = null
      }
    }
    getLoadout(heroKey)[slot] = instanceId
    // Two-handed weapon in main_hand → clear off_hand
    if (slot === GearSlot.MAIN_HAND && isTwoHanded(item)) {
      getLoadout(heroKey)[GearSlot.OFF_HAND] = null
    }
  }

  function getEquippedBy(instanceId) {
    for (const [key, loadout] of Object.entries(loadouts.value)) {
      for (const [slot, iid] of Object.entries(loadout)) {
        if (iid === instanceId) return { heroKey: key, slot }
      }
    }
    return null
  }

  function equipTargets(instanceId) {
    const item = instanceById(instanceId)
    if (!item) return []
    const results = []
    for (const key of PLAYER_KEYS) {
      for (const slot of Object.values(GearSlot)) {
        if (item.fitsSlot(slot)) results.push({ heroKey: key, slot })
      }
    }
    return results
  }

  function unequip(heroKey, slot) {
    getLoadout(heroKey)[slot] = null
  }

  function isDualWielding(heroKey) {
    const loadout = getLoadout(heroKey)
    const mh = loadout[GearSlot.MAIN_HAND] ? instanceById(loadout[GearSlot.MAIN_HAND]) : null
    const oh = loadout[GearSlot.OFF_HAND]  ? instanceById(loadout[GearSlot.OFF_HAND])  : null
    return mh?.gearType === GearType.WEAPON && oh?.gearType === GearType.WEAPON && !isTwoHanded(mh)
  }

  function hasShield(heroKey) {
    const oh = getLoadout(heroKey)[GearSlot.OFF_HAND]
    return oh ? instanceById(oh)?.gearType === GearType.SHIELD : false
  }

  function isGearEnabled(heroKey)  { return gearDisabled.value[heroKey] !== true }
  function toggleGearEnabled(heroKey) {
    gearDisabled.value[heroKey] = isGearEnabled(heroKey) ? true : false
  }

  const EMPTY_STATS = { hp: 0, hpPct: 0, atk: 0, atkPct: 0, def: 0, defPct: 0, spd: 0, spdPct: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 }

  function computeGearStats(heroKey) {
    if (!isGearEnabled(heroKey)) return { stats: { ...EMPTY_STATS }, damageReduction: 0 }

    const totals = { hp: 0, hpPct: 0, atk: 0, atkPct: 0, def: 0, defPct: 0, spd: 0, spdPct: 0, critRate: 0, critDmg: 0, resistance: 0, accuracy: 0 }
    const loadout = getLoadout(heroKey)

    for (const slot of Object.values(GearSlot)) {
      const item = loadout[slot] ? instanceById(loadout[slot]) : null
      if (!item) continue

      // Base stats
      for (const [key, val] of Object.entries(item.stats)) {
        if (key in totals) totals[key] += val
      }

      // Line bonuses
      if (item.lines?.length) {
        const lineStats = computeLineStats(item.lines)
        for (const [key, val] of Object.entries(lineStats)) {
          if (key in totals) totals[key] += val
        }
      }
    }

    // Set bonus counting — tally armorType per equipped item
    const setPieces = { plate: 0, leather: 0, cloth: 0 }
    for (const slot of Object.values(GearSlot)) {
      const item = loadout[slot] ? instanceById(loadout[slot]) : null
      if (!item) continue
      const type = item.armorType ?? WEAPON_ARMOR_TYPE[item.weaponType]
      if (type && type in setPieces) setPieces[type]++
    }
    for (const [armorType, count] of Object.entries(setPieces)) {
      const bonusTiers = SET_BONUSES[armorType]
      if (!bonusTiers) continue
      for (const [threshold, stats] of Object.entries(bonusTiers)) {
        if (count >= Number(threshold)) {
          for (const [key, val] of Object.entries(stats)) {
            if (key in totals) totals[key] += val
          }
        }
      }
    }

    if (isDualWielding(heroKey)) {
      totals.atkPct   += DUAL_WIELD_BONUS.atkPct
      totals.critRate += DUAL_WIELD_BONUS.critRate
    }

    // Forge affinity bonus — +6% ATK and DEF per matching forge-tier piece
    const forgeAffinities = HERO_TEMPLATES[heroKey]?.()?.forgeAffinities ?? []
    let forgeAffinityCount = 0
    if (forgeAffinities.length > 0) {
      for (const slot of Object.values(GearSlot)) {
        const item = loadout[slot] ? instanceById(loadout[slot]) : null
        if (item && forgeAffinities.includes(item.tier)) forgeAffinityCount++
      }
      if (forgeAffinityCount > 0) {
        totals.atkPct += forgeAffinityCount * 0.06
        totals.defPct += forgeAffinityCount * 0.06
      }
    }

    const activePassives = new Set()
    for (const [armorType, count] of Object.entries(setPieces)) {
      if (count >= 6 && SET_PASSIVE_6[armorType]) activePassives.add(SET_PASSIVE_6[armorType].id)
    }

    // Role-based passives — base passive always active; boosted when gear matches role condition
    const ROLE_TO_PASSIVE = { warrior: 'execute', tank: 'grit', mage: 'spellweave', healer: 'mending', ranger: 'mark', debuffer: 'lingering_curse' }
    const heroRole = HERO_TEMPLATES[heroKey]?.()?.role ?? null
    if (heroRole && ROLE_TO_PASSIVE[heroRole]) {
      activePassives.add(ROLE_TO_PASSIVE[heroRole])
      const mainHandItem = loadout[GearSlot.MAIN_HAND] ? instanceById(loadout[GearSlot.MAIN_HAND]) : null
      const mwt = mainHandItem?.weaponType
      const PLATE_WEAPONS = ['sword', 'axe', 'mace', 'spear']
      const STAFF_WEAPONS = ['staff', 'wand']
      let boosted = false
      if      (heroRole === 'warrior')  boosted = isDualWielding(heroKey) && setPieces.plate >= 3
      else if (heroRole === 'tank')     boosted = PLATE_WEAPONS.includes(mwt) && hasShield(heroKey) && setPieces.plate >= 3
      else if (heroRole === 'mage')     boosted = STAFF_WEAPONS.includes(mwt) && setPieces.cloth >= 3
      else if (heroRole === 'healer')   boosted = STAFF_WEAPONS.includes(mwt) && setPieces.cloth >= 3
      else if (heroRole === 'ranger')   boosted = setPieces.leather >= 3
      else if (heroRole === 'debuffer') boosted = setPieces.leather >= 3 || setPieces.cloth >= 3
      if (boosted) activePassives.add(ROLE_TO_PASSIVE[heroRole] + '_boosted')
    }

    const dr = hasShield(heroKey) ? SHIELD_PASSIVE_DR : 0
    return { stats: totals, damageReduction: dr, setPieces, forgeAffinityCount, activePassives }
  }

  function availableForSlot(heroKey, slot) {
    const allowedTypes = SLOT_ALLOWED_TYPES[slot] ?? []
    return ownedInstances.value.filter(item => allowedTypes.includes(item.gearType))
  }

  function openPicker(heroKey, slot) {
    focusedHeroKey.value = heroKey
    pendingSlot.value = slot
  }
  function closePicker() { pendingSlot.value = null }

  function addToInventory(gearId) {
    const base = GEAR_BY_ID[gearId]
    if (base) ownedInstances.value.push(createItemInstance(base))
  }

  function addInstance(instance) {
    if (instance) ownedInstances.value.push(instance)
  }

  function sellItem(instanceId) {
    const idx = ownedInstances.value.findIndex(i => i.instanceId === instanceId)
    if (idx === -1) return 0
    const item = ownedInstances.value[idx]
    if (getEquippedBy(instanceId)) return 0   // can't sell equipped gear
    const gold = calcSellPrice(item)
    ownedInstances.value.splice(idx, 1)
    // Remove from any loadout just in case
    for (const key of Object.keys(loadouts.value)) {
      for (const s of Object.values(GearSlot)) {
        if (loadouts.value[key][s] === instanceId) loadouts.value[key][s] = null
      }
    }
    useCurrencyStore().addGold(gold)
    return gold
  }

  function sellAllByRarity(rarity) {
    const toSell = ownedInstances.value
      .filter(i => i.rarity === rarity && !getEquippedBy(i.instanceId))
      .map(i => i.instanceId)
    let total = 0
    for (const id of toSell) total += sellItem(id)
    return total
  }

  function heroCP(heroKey) {
    let hero
    if (heroKey === 'PLAYER_CHARACTER') {
      const ph = usePlayerHeroStore()
      if (!ph.isCreated) return 0
      hero = ph.buildHeroInstance()
    } else {
      const template = HERO_TEMPLATES[heroKey]
      if (!template) return 0
      hero = template()
    }
    const { stats, damageReduction } = computeGearStats(heroKey)
    hero.applyGear(stats, damageReduction)
    return computeCP(hero)
  }

  function getSetPieces(heroKey) {
    const loadout  = getLoadout(heroKey)
    const counts = { plate: 0, leather: 0, cloth: 0 }
    for (const slot of Object.values(GearSlot)) {
      const item = loadout[slot] ? instanceById(loadout[slot]) : null
      if (!item) continue
      const type = item.armorType ?? WEAPON_ARMOR_TYPE[item.weaponType]
      if (type && type in counts) counts[type]++
    }
    return counts
  }

  return {
    ownedInstances, ownedItems, loadouts,
    focusedHeroKey, pendingSlot,
    GEAR_CATALOG,
    GearSlot, GearType,
    instanceById,
    getLoadout, getEquippedItem,
    equip, unequip,
    isDualWielding, hasShield, isTwoHandedMainHand,
    isGearEnabled, toggleGearEnabled,
    computeGearStats, availableForSlot,
    getEquippedBy, equipTargets,
    openPicker, closePicker,
    addToInventory, addInstance, heroCP,
    soulVessels, progressiveHeroKeys,
    awardSoulVessel, useSoulVessel, isProgressive,
    sellItem, sellAllByRarity,
    getSetPieces,
  }
})
