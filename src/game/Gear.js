export const GearSlot = {
  MAIN_HAND: 'main_hand',
  OFF_HAND:  'off_hand',   // accepts weapon OR shield — the player's choice
  HEAD:      'head',
  CHEST:     'chest',
  LEGS:      'legs',
  BOOTS:     'boots',
  GLOVES:    'gloves',
}

export const GearType = {
  WEAPON:  'weapon',
  SHIELD:  'shield',
  HELMET:  'helmet',
  ARMOR:   'armor',
  LEGS:    'legs',
  BOOTS:   'boots',
  GLOVES:  'gloves',
}

export const WeaponType = {
  SWORD:   'sword',
  AXE:     'axe',
  DAGGER:  'dagger',
  STAFF:   'staff',
  MACE:    'mace',
  SPEAR:   'spear',
  BOW:     'bow',
  WAND:    'wand',
}

export const ArmorType = {
  PLATE:   'plate',
  LEATHER: 'leather',
  CLOTH:   'cloth',
}

// Which armor type a weapon contributes toward for set bonus counting
export const WEAPON_ARMOR_TYPE = {
  sword:  'plate',
  axe:    'plate',
  mace:   'plate',
  spear:  'plate',
  dagger: 'leather',
  bow:    'leather',
  staff:  'cloth',
  wand:   'cloth',
}

// Which gear types are allowed in each slot
export const SLOT_ALLOWED_TYPES = {
  [GearSlot.MAIN_HAND]: [GearType.WEAPON],
  [GearSlot.OFF_HAND]:  [GearType.WEAPON, GearType.SHIELD],
  [GearSlot.HEAD]:      [GearType.HELMET],
  [GearSlot.CHEST]:     [GearType.ARMOR],
  [GearSlot.LEGS]:      [GearType.LEGS],
  [GearSlot.BOOTS]:     [GearType.BOOTS],
  [GearSlot.GLOVES]:    [GearType.GLOVES],
}

export const SLOT_LABELS = {
  [GearSlot.MAIN_HAND]: 'Main Hand',
  [GearSlot.OFF_HAND]:  'Off Hand',
  [GearSlot.HEAD]:      'Helmet',
  [GearSlot.CHEST]:     'Armor',
  [GearSlot.LEGS]:      'Legs',
  [GearSlot.BOOTS]:     'Boots',
  [GearSlot.GLOVES]:    'Gloves',
}

// Weapon types that occupy both hands — off-hand is blocked while one is equipped
export const TWO_HANDED_WEAPON_TYPES = new Set(['staff'])

// Bonus applied when both hands hold weapons
export const DUAL_WIELD_BONUS = {
  atkPct:   0.15,  // +15% ATK
  critRate: 0.05,  // +5% crit rate
}

// Passive damage reduction when off-hand is a shield
export const SHIELD_PASSIVE_DR = 0.12   // 12% damage reduction

export const LineType = {
  USE:       'use',        // earned through battle use
  SLAYER:    'slayer',     // earned by defeating specific enemies
  DISCOVERY: 'discovery',  // found at hidden forges, blacksmiths, wells
}

let _instanceCounter = 0
function genInstanceId() {
  return `inst_${Date.now()}_${++_instanceCounter}`
}

export class GearItem {
  constructor({
    id, name, gearType, weaponType = null, rarity,
    description = '',
    stats = {},
    // stats keys: hp, hpPct, atk, atkPct, def, defPct, spd, spdPct,
    //             critRate, critDmg, resistance, accuracy
  }) {
    this.id = id
    this.name = name
    this.gearType = gearType
    this.weaponType = weaponType
    this.rarity = rarity
    this.description = description
    this.stats = stats
  }

  fitsSlot(slot) {
    return SLOT_ALLOWED_TYPES[slot]?.includes(this.gearType) ?? false
  }
}

// Creates a unique owned instance of a base GearItem.
// Each instance has its own identity, lines, and can promote to Mythical.
export function createItemInstance(baseItem) {
  return {
    instanceId:  genInstanceId(),
    id:          baseItem.id,
    name:        baseItem.name,
    gearType:    baseItem.gearType,
    weaponType:  baseItem.weaponType ?? null,
    rarity:      baseItem.rarity,
    description: baseItem.description,
    stats:       { ...baseItem.stats },
    baseStats:   baseItem.baseStats ? { ...baseItem.baseStats } : { ...baseItem.stats },
    tier:        baseItem.tier       ?? null,
    slot:        baseItem.slot       ?? null,
    image:       baseItem.image      ?? null,
    frame:       baseItem.frame      ?? null,
    armorType:   baseItem.armorType  ?? null,
    stars:       0,
    craftedAt:   null,
    crafted:     false,
    lines:       [],
    level:       0,
    useCount:    0,
    fitsSlot(slot) { return SLOT_ALLOWED_TYPES[slot]?.includes(this.gearType) ?? false },
  }
}

// Adds a line to a Legendary item instance. Promotes to Mythical at 6 lines.
// line: { type, label, bonus: {stat: value, ...}, source, earnedAt }
export function addLineToItem(instance, line) {
  instance.lines.push(line)
  if (instance.rarity === 'Legendary' && instance.lines.length >= 6) {
    instance.rarity = 'Mythical'
  }
}

// Totals all stat bonuses contributed by an item's lines.
export function computeLineStats(lines) {
  const totals = {}
  for (const line of lines) {
    for (const [key, val] of Object.entries(line.bonus ?? {})) {
      totals[key] = (totals[key] ?? 0) + val
    }
  }
  return totals
}
