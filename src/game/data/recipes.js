import { GearType, GearSlot, SLOT_LABELS } from '../Gear.js'
import { ORES } from './ores.js'
import { BARS } from './bars.js'

export const RECIPES = [
  // ── Copper tier ──────────────────────────────────────────────────────
  {
    id: 'copper_helmet',
    name: 'Copper Helmet',
    tier: 'copper',
    slot: GearSlot.HEAD,
    gearType: GearType.HELMET,
    armorType: 'plate',
    desc: 'Basic head protection, malleable but effective.',
    barCost: { copper: 1 },
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
    barCost: { copper: 2 },
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
    barCost: { copper: 2 },
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
    barCost: { copper: 1 },
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
    barCost: { copper: 1 },
    baseStats: { atk: 80, atkPct: 0.04 },
    rarity: 'Common',
  },

  // ── Tin tier ─────────────────────────────────────────────────────────
  {
    id: 'tin_helmet',
    name: 'Tin Helmet',
    tier: 'tin',
    slot: GearSlot.HEAD,
    gearType: GearType.HELMET,
    armorType: 'plate',
    desc: 'A well-fitted cap of hammered tin. Protects what matters most.',
    barCost: { tin: 2 },
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
    barCost: { tin: 3 },
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
    barCost: { tin: 2 },
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
    barCost: { tin: 2 },
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
    barCost: { tin: 2 },
    baseStats: { atk: 108, atkPct: 0.05 },
    rarity: 'Uncommon',
  },

  // ── Steel tier ───────────────────────────────────────────────────────
  {
    id: 'steel_helmet',     name: 'Steel Helmet',
    tier: 'steel', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'plate',
    desc: 'Solid protection with a visor that narrows the world to what matters.',
    barCost: { steel: 2 }, baseStats: { hp: 2190, def: 54 }, rarity: 'Rare',
  },
  {
    id: 'steel_chestplate', name: 'Steel Chestplate',
    tier: 'steel', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'plate',
    desc: 'Heavy and unforgiving. The kind of armor that outlasts its wearer.',
    barCost: { steel: 3 }, baseStats: { hp: 3280, def: 108 }, rarity: 'Rare',
  },
  {
    id: 'steel_legplates',  name: 'Steel Legplates',
    tier: 'steel', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'plate',
    desc: 'Articulated plates that move with the body without sacrificing coverage.',
    barCost: { steel: 2 }, baseStats: { hp: 2550, def: 90 }, rarity: 'Rare',
  },
  {
    id: 'steel_greaves',    name: 'Steel Greaves',
    tier: 'steel', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'plate',
    desc: 'Reinforced soles and ankle guards. You still move fast when you have to.',
    barCost: { steel: 2 }, baseStats: { spd: 13, def: 73 }, rarity: 'Rare',
  },
  {
    id: 'steel_gauntlets',  name: 'Steel Gauntlets',
    tier: 'steel', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'plate',
    desc: 'The knuckles leave an impression. So does everything else about them.',
    barCost: { steel: 2 }, baseStats: { atk: 146, atkPct: 0.06 }, rarity: 'Rare',
  },

  // ── Darksteel tier ───────────────────────────────────────────────────
  {
    id: 'darksteel_helmet',     name: 'Darksteel Helm',
    tier: 'darksteel', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'plate',
    desc: 'The visored face reflects nothing. Whatever is behind it, the enemy doesn\'t want to know.',
    barCost: { darksteel: 2 }, baseStats: { hp: 2960, def: 73 }, rarity: 'Epic',
  },
  {
    id: 'darksteel_chestplate', name: 'Darksteel Chestplate',
    tier: 'darksteel', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'plate',
    desc: 'The surface shifts slightly in torchlight, like something sleeping beneath the metal.',
    barCost: { darksteel: 4 }, baseStats: { hp: 4430, def: 146 }, rarity: 'Epic',
  },
  {
    id: 'darksteel_legplates',  name: 'Darksteel Legplates',
    tier: 'darksteel', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'plate',
    desc: 'No joint, no hinge, no weak point. Just continuous dark iron from hip to boot.',
    barCost: { darksteel: 3 }, baseStats: { hp: 3445, def: 122 }, rarity: 'Epic',
  },
  {
    id: 'darksteel_greaves',    name: 'Darksteel Greaves',
    tier: 'darksteel', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'plate',
    desc: 'Silent on stone. Leave no mark. Move like a shadow carrying a mountain.',
    barCost: { darksteel: 2 }, baseStats: { spd: 17, def: 99 }, rarity: 'Epic',
  },
  {
    id: 'darksteel_gauntlets',  name: 'Darksteel Gauntlets',
    tier: 'darksteel', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'plate',
    desc: 'The grip doesn\'t loosen. Some say they\'ve never seen the wearer miss.',
    barCost: { darksteel: 2 }, baseStats: { atk: 197, atkPct: 0.07 }, rarity: 'Epic',
  },

  // ── Mithril tier ─────────────────────────────────────────────────────
  {
    id: 'mithril_helmet',     name: 'Mithril Helm',
    tier: 'mithril', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'plate',
    desc: 'Worn by commanders who intend to return. The metal hums faintly in the presence of magic.',
    barCost: { mithril: 3 }, baseStats: { hp: 4000, def: 99 }, rarity: 'Common',
  },
  {
    id: 'mithril_chestplate', name: 'Mithril Chestplate',
    tier: 'mithril', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'plate',
    desc: 'The finest armor a smith can produce without elven blood or divine favor.',
    barCost: { mithril: 5 }, baseStats: { hp: 5980, def: 197 }, rarity: 'Common',
  },
  {
    id: 'mithril_legplates',  name: 'Mithril Legplates',
    tier: 'mithril', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'plate',
    desc: 'Articulated mithril, fitted by master smiths. They move as though made of cloth.',
    barCost: { mithril: 3 }, baseStats: { hp: 4650, def: 165 }, rarity: 'Common',
  },
  {
    id: 'mithril_greaves',    name: 'Mithril Greaves',
    tier: 'mithril', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'plate',
    desc: 'The ground doesn\'t slow them. Nothing does.',
    barCost: { mithril: 2 }, baseStats: { spd: 23, def: 134 }, rarity: 'Common',
  },
  {
    id: 'mithril_gauntlets',  name: 'Mithril Gauntlets',
    tier: 'mithril', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'plate',
    desc: 'Every strike feels augmented, as if the metal itself wants to hit harder.',
    barCost: { mithril: 3 }, baseStats: { atk: 266, atkPct: 0.08 }, rarity: 'Common',
  },

  // ── Moonsilver tier (Elven Forge) ────────────────────────────────────
  {
    id: 'elven_helm', name: 'Elven Helm', tier: 'moonsilver', craftDiscipline: 'elven',
    slot: GearSlot.HEAD, gearType: GearType.HELMET,
    armorType: 'plate',
    desc: 'A crown of woven moonsilver that guards the mind and soul as much as the skull.',
    barCost: { moonsilver: 3 }, baseStats: { hp: 4800, def: 120 },
    rarity: 'Common',
  },
  {
    id: 'elven_chest', name: 'Elven Chestplate', tier: 'moonsilver', craftDiscipline: 'elven',
    slot: GearSlot.CHEST, gearType: GearType.ARMOR,
    armorType: 'plate',
    desc: 'Elven armorers spent decades perfecting this form. It breathes like silk, endures like stone.',
    barCost: { moonsilver: 5 }, baseStats: { hp: 7200, def: 200 },
    rarity: 'Common',
  },
  {
    id: 'elven_platelegs', name: 'Elven Platelegs', tier: 'moonsilver', craftDiscipline: 'elven',
    slot: GearSlot.LEGS, gearType: GearType.LEGS,
    armorType: 'plate',
    desc: 'Fluid as water, hard as starstone. No mortal forge could produce their like.',
    barCost: { moonsilver: 3 }, baseStats: { spd: 22, def: 150, hp: 2400 },
    rarity: 'Common',
  },
  {
    id: 'elven_gloves', name: 'Elven Gloves', tier: 'moonsilver', craftDiscipline: 'elven',
    slot: GearSlot.GLOVES, gearType: GearType.GLOVES,
    armorType: 'plate',
    desc: 'The touch of these gloves makes every strike deliberate, every grip unbreakable.',
    barCost: { moonsilver: 2 }, baseStats: { atk: 200, atkPct: 0.08 },
    rarity: 'Common',
  },
]

// Tier metadata — controls left-panel grouping and appearance
export const RECIPE_TIERS = [
  { id: 'copper',     name: 'Copper',     color: ORES.copper.color,       smithingLevel: 1,  recipes: RECIPES.filter(r => r.tier === 'copper')     },
  { id: 'tin',        name: 'Tin',        color: ORES.tin.color,          smithingLevel: 3,  recipes: RECIPES.filter(r => r.tier === 'tin')        },
  { id: 'steel',      name: 'Steel',      color: ORES.steel.color,        smithingLevel: 6,  recipes: RECIPES.filter(r => r.tier === 'steel')      },
  { id: 'darksteel',  name: 'Darksteel',  color: ORES.darksteel.color,    smithingLevel: 10, recipes: RECIPES.filter(r => r.tier === 'darksteel')  },
  { id: 'mithril',    name: 'Mithril',    color: ORES.mithril.color,      smithingLevel: 15, recipes: RECIPES.filter(r => r.tier === 'mithril')    },
  { id: 'moonsilver', name: 'Moonsilver', color: BARS.moonsilver.color,   smithingLevel: 15, recipes: RECIPES.filter(r => r.tier === 'moonsilver') },
]

// Slot display helpers
export const SLOT_ICONS = {
  [GearSlot.HEAD]:   '⬡',
  [GearSlot.CHEST]:    '◈',
  [GearSlot.LEGS]:     '▽',
  [GearSlot.BOOTS]:    '▾',
  [GearSlot.GLOVES]:   '◇',
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
export const STAR_BAR_COST = [0, 1, 1, 2, 2, 3, 3, 5, 7, 9, 12]

// Hard star ceiling per tier — gear cannot be upgraded past this
export const TIER_MAX_STARS = {
  copper:     3,
  tin:        4,
  steel:      5,
  darksteel:  6,
  mithril:    8,
  moonsilver: 10,
}

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
