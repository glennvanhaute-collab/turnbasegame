import { GearType, GearSlot, WeaponType, SLOT_LABELS } from '../Gear.js'
import { ORES } from './ores.js'
import { BARS } from './bars.js'

export const RECIPES = [
  // ── Copper tier ──────────────────────────────────────────────────────
  {
    id: 'copper_sword',
    name: 'Copper Sword',
    tier: 'copper',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.SWORD,
    armorType: 'plate',
    desc: 'A serviceable blade smelted from raw copper.',
    barCost: { copper: 3 },
    baseStats: { atk: 120 },
    rarity: 'Common',
  },
  {
    id: 'copper_dagger',
    name: 'Copper Dagger',
    tier: 'copper',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.DAGGER,
    armorType: 'leather',
    desc: 'A light blade favored by scouts and those who strike first.',
    barCost: { copper: 2 },
    baseStats: { atk: 90, critRate: 0.02 },
    rarity: 'Common',
  },
  {
    id: 'copper_shield',
    name: 'Copper Shield',
    tier: 'copper',
    slot: GearSlot.OFF_HAND,
    gearType: GearType.SHIELD,
    armorType: 'plate',
    desc: 'A round shield beaten from copper plate.',
    barCost: { copper: 3 },
    baseStats: { def: 80, hp: 800 },
    rarity: 'Common',
  },
  {
    id: 'copper_helmet',
    name: 'Copper Helmet',
    tier: 'copper',
    slot: GearSlot.HEAD,
    gearType: GearType.HELMET,
    armorType: 'plate',
    desc: 'Basic head protection, malleable but effective.',
    barCost: { copper: 2 },
    baseStats: { hp: 1200, def: 30 },
    rarity: 'Common',
  },
  {
    id: 'copper_chestplate',
    name: 'Copper Chestplate',
    tier: 'copper',
    slot: GearSlot.CHEST,
    gearType: GearType.ARMOR,
    armorType: 'plate',
    desc: 'A hammered breastplate of basic copper alloy.',
    barCost: { copper: 4 },
    baseStats: { hp: 1800, def: 60 },
    rarity: 'Common',
  },
  {
    id: 'copper_legs',
    name: 'Copper Legplates',
    tier: 'copper',
    slot: GearSlot.LEGS,
    gearType: GearType.LEGS,
    armorType: 'plate',
    desc: 'Hammered copper plates strapped over the thighs. Slow, but dependable.',
    barCost: { copper: 3 },
    baseStats: { hp: 1400, def: 50 },
    rarity: 'Common',
  },
  {
    id: 'copper_greaves',
    name: 'Copper Greaves',
    tier: 'copper',
    slot: GearSlot.BOOTS,
    gearType: GearType.BOOTS,
    armorType: 'plate',
    desc: 'Lightweight leg guards that do not hinder movement.',
    barCost: { copper: 2 },
    baseStats: { spd: 8, def: 40 },
    rarity: 'Common',
  },
  {
    id: 'copper_gauntlets',
    name: 'Copper Gauntlets',
    tier: 'copper',
    slot: GearSlot.GLOVES,
    gearType: GearType.GLOVES,
    armorType: 'plate',
    desc: 'Crude but solid. A firm grip and a hard knuckle.',
    barCost: { copper: 2 },
    baseStats: { atk: 80, atkPct: 0.04 },
    rarity: 'Common',
  },

  // ── Tin tier ─────────────────────────────────────────────────────────
  {
    id: 'tin_sword',
    name: 'Tin Sword',
    tier: 'tin',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.SWORD,
    armorType: 'plate',
    desc: 'A sturdier blade than copper. Holds an edge longer and bites deeper.',
    barCost: { tin: 4 },
    baseStats: { atk: 162 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_dagger',
    name: 'Tin Dagger',
    tier: 'tin',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.DAGGER,
    armorType: 'leather',
    desc: 'Lighter than iron, sharper than copper. A quick draw and a clean cut.',
    barCost: { tin: 3 },
    baseStats: { atk: 120, critRate: 0.03 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_mace',
    name: 'Tin Mace',
    tier: 'tin',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.MACE,
    armorType: 'plate',
    desc: 'A weighted bludgeon. Slower than a sword, but armor means nothing to it.',
    barCost: { tin: 4 },
    baseStats: { atk: 140, defPct: 0.04 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_shield',
    name: 'Tin Shield',
    tier: 'tin',
    slot: GearSlot.OFF_HAND,
    gearType: GearType.SHIELD,
    armorType: 'plate',
    desc: 'A reinforced round shield. Tin absorbs blows copper would dent under.',
    barCost: { tin: 4 },
    baseStats: { def: 108, hp: 1080 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_helmet',
    name: 'Tin Helmet',
    tier: 'tin',
    slot: GearSlot.HEAD,
    gearType: GearType.HELMET,
    armorType: 'plate',
    desc: 'A well-fitted cap of hammered tin. Protects what matters most.',
    barCost: { tin: 3 },
    baseStats: { hp: 1620, def: 40 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_chestplate',
    name: 'Tin Chestplate',
    tier: 'tin',
    slot: GearSlot.CHEST,
    gearType: GearType.ARMOR,
    armorType: 'plate',
    desc: 'Full chest coverage in tin alloy. A significant step up from copper.',
    barCost: { tin: 5 },
    baseStats: { hp: 2430, def: 80 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_legplates',
    name: 'Tin Legplates',
    tier: 'tin',
    slot: GearSlot.LEGS,
    gearType: GearType.LEGS,
    armorType: 'plate',
    desc: 'Heavy plates strapped over the thighs and shins. Dependable protection.',
    barCost: { tin: 4 },
    baseStats: { hp: 1890, def: 67 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_greaves',
    name: 'Tin Greaves',
    tier: 'tin',
    slot: GearSlot.BOOTS,
    gearType: GearType.BOOTS,
    armorType: 'plate',
    desc: 'Reinforced foot guards. Still light enough to move when it counts.',
    barCost: { tin: 3 },
    baseStats: { spd: 10, def: 54 },
    rarity: 'Uncommon',
  },
  {
    id: 'tin_gauntlets',
    name: 'Tin Gauntlets',
    tier: 'tin',
    slot: GearSlot.GLOVES,
    gearType: GearType.GLOVES,
    armorType: 'plate',
    desc: 'A firm grip reinforced with tin plate. Power behind every strike.',
    barCost: { tin: 3 },
    baseStats: { atk: 108, atkPct: 0.05 },
    rarity: 'Uncommon',
  },

  // ── Steel tier ───────────────────────────────────────────────────────
  // ── Darksteel tier ───────────────────────────────────────────────────
  // ── Mithril tier ─────────────────────────────────────────────────────

  // ── Moonsilver tier (Elven Forge) ────────────────────────────────────
  {
    id: 'elven_sword', name: 'Elven Blade', tier: 'moonsilver',
    slot: GearSlot.MAIN_HAND, gearType: GearType.WEAPON, weaponType: WeaponType.SWORD,
    armorType: 'plate',
    desc: 'A blade of moonsilver that hums with elven enchantment. Strikes true even in darkness.',
    barCost: { moonsilver: 4 }, baseStats: { atk: 420, critRate: 0.06 },
    rarity: 'Epic', image: 'elven/sword', frame: 'elven',
  },
  {
    id: 'elven_spear', name: 'Elven Spear', tier: 'moonsilver',
    slot: GearSlot.MAIN_HAND, gearType: GearType.WEAPON, weaponType: WeaponType.SPEAR,
    armorType: 'plate',
    desc: 'Swift as moonlight, this spear finds every gap in armor before the eye can follow.',
    barCost: { moonsilver: 3 }, baseStats: { atk: 360, spd: 18 },
    rarity: 'Epic', image: 'elven/spear', frame: 'elven',
  },
  {
    id: 'elven_shield', name: 'Elven Shield', tier: 'moonsilver',
    slot: GearSlot.OFF_HAND, gearType: GearType.SHIELD,
    armorType: 'plate',
    desc: 'Woven from moonsilver vines by elven hands. Impossibly light, completely impenetrable.',
    barCost: { moonsilver: 4 }, baseStats: { def: 300, hp: 5000 },
    rarity: 'Epic', image: 'elven/shield', frame: 'elven',
  },
  {
    id: 'elven_helm', name: 'Elven Helm', tier: 'moonsilver',
    slot: GearSlot.HEAD, gearType: GearType.HELMET,
    armorType: 'plate',
    desc: 'A crown of woven moonsilver that guards the mind and soul as much as the skull.',
    barCost: { moonsilver: 3 }, baseStats: { hp: 4800, def: 120 },
    rarity: 'Epic', image: 'elven/helm', frame: 'elven',
  },
  {
    id: 'elven_chest', name: 'Elven Chestplate', tier: 'moonsilver',
    slot: GearSlot.CHEST, gearType: GearType.ARMOR,
    armorType: 'plate',
    desc: 'Elven armorers spent decades perfecting this form. It breathes like silk, endures like stone.',
    barCost: { moonsilver: 5 }, baseStats: { hp: 7200, def: 200 },
    rarity: 'Epic', image: 'elven/chest', frame: 'elven',
  },
  {
    id: 'elven_platelegs', name: 'Elven Platelegs', tier: 'moonsilver',
    slot: GearSlot.LEGS, gearType: GearType.LEGS,
    armorType: 'plate',
    desc: 'Fluid as water, hard as starstone. No mortal forge could produce their like.',
    barCost: { moonsilver: 3 }, baseStats: { spd: 22, def: 150, hp: 2400 },
    rarity: 'Epic', image: 'elven/platelegs', frame: 'elven',
  },
  {
    id: 'elven_gloves', name: 'Elven Gloves', tier: 'moonsilver',
    slot: GearSlot.GLOVES, gearType: GearType.GLOVES,
    armorType: 'plate',
    desc: 'The touch of these gloves makes every strike deliberate, every grip unbreakable.',
    barCost: { moonsilver: 2 }, baseStats: { atk: 200, atkPct: 0.08 },
    rarity: 'Epic', image: 'elven/gloves', frame: 'elven',
  },
]

// Tier metadata — controls left-panel grouping and appearance
export const RECIPE_TIERS = [
  { id: 'copper',     name: 'Copper',     color: ORES.copper.color,       recipes: RECIPES.filter(r => r.tier === 'copper')     },
  { id: 'tin',        name: 'Tin',        color: ORES.tin.color,          recipes: RECIPES.filter(r => r.tier === 'tin')        },
  { id: 'steel',      name: 'Steel',      color: ORES.steel.color,        recipes: RECIPES.filter(r => r.tier === 'steel')      },
  { id: 'darksteel',  name: 'Darksteel',  color: ORES.darksteel.color,    recipes: RECIPES.filter(r => r.tier === 'darksteel')  },
  { id: 'mithril',    name: 'Mithril',    color: ORES.mithril.color,      recipes: RECIPES.filter(r => r.tier === 'mithril')    },
  { id: 'moonsilver', name: 'Moonsilver', color: BARS.moonsilver.color,   recipes: RECIPES.filter(r => r.tier === 'moonsilver') },
]

// Slot display helpers
export const SLOT_ICONS = {
  [GearSlot.MAIN_HAND]: '⚔',
  [GearSlot.OFF_HAND]:  '🛡',
  [GearSlot.HEAD]:      '⬡',
  [GearSlot.CHEST]:     '◈',
  [GearSlot.LEGS]:      '▽',
  [GearSlot.BOOTS]:     '▾',
  [GearSlot.GLOVES]:    '◇',
}

// Human-readable stat labels + formatter
export const STAT_LABELS = {
  hp: 'HP', hpPct: 'HP %',
  atk: 'ATK', atkPct: 'ATK %',
  def: 'DEF', defPct: 'DEF %',
  spd: 'SPD', spdPct: 'SPD %',
  critRate: 'Crit Rate', critDmg: 'Crit DMG',
  resistance: 'Resistance', accuracy: 'Accuracy',
}

export function formatStatValue(key, val) {
  if (['hpPct','atkPct','defPct','spdPct','critRate','critDmg','resistance','accuracy'].includes(key)) {
    return `+${Math.round(val * 100)}%`
  }
  return `+${val.toLocaleString()}`
}

// Rarity thresholds — item rarity steps up when stars reach these values
export const STAR_RARITY = [
  { stars: 0,  rarity: 'Common'    },
  { stars: 2,  rarity: 'Uncommon'  },
  { stars: 4,  rarity: 'Rare'      },
  { stars: 6,  rarity: 'Epic'      },
  { stars: 8,  rarity: 'Legendary' },
  { stars: 10, rarity: 'Mythical'  },
]

export function rarityForStars(stars) {
  let result = 'Common'
  for (const t of STAR_RARITY) {
    if (stars >= t.stars) result = t.rarity
    else break
  }
  return result
}

// Bar cost to upgrade TO each star (index = target star, 1–10)
export const STAR_BAR_COST = [0, 1, 2, 3, 4, 5, 7, 9, 12, 15, 20]

// Stat multiplier at a given star count.
// ★1–4: +5%/star  ★5–6: +8%/star (gate reward)  ★7–10: +6%/star
// ★10 total: +60% over base
export function starMultiplier(stars) {
  let m = 1
  for (let s = 1; s <= stars; s++) {
    if (s <= 4)      m += 0.05
    else if (s <= 6) m += 0.08
    else             m += 0.06
  }
  return m
}
