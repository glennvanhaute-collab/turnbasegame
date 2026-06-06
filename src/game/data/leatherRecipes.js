import { GearType, GearSlot } from '../Gear.js'
import { HIDES } from './hides.js'

// materialCost: { leatherId: amount } — the processed leather strips consumed per craft
// tier matches the blacksmith tier IDs so the upgrade/star system works unchanged
// armorType: 'leather' makes these pieces count toward the leather set bonus

export const LEATHER_RECIPES = [
  // ── Rough (copper-equivalent) ───────────────────────────────────
  {
    id: 'rough_hood',        name: 'Rough Hood',
    tier: 'copper', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Scraped and stitched in an afternoon. Better than nothing, and barely.',
    materialCost: { rough: 1 }, baseStats: { hp: 700, spd: 5 }, rarity: 'Common',
  },
  {
    id: 'rough_vest',        name: 'Rough Vest',
    tier: 'copper', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Layered hides laced over the torso. Stiff but light.',
    materialCost: { rough: 2 }, baseStats: { hp: 950, critRate: 0.02 }, rarity: 'Common',
  },
  {
    id: 'rough_leggings',    name: 'Rough Leggings',
    tier: 'copper', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Flexible enough to run in. Crude enough that you might have to.',
    materialCost: { rough: 1 }, baseStats: { hp: 800, spd: 4, critRate: 0.01 }, rarity: 'Common',
  },
  {
    id: 'rough_boots',       name: 'Rough Boots',
    tier: 'copper', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Soft soles. Silent movement. The scout\'s first lesson.',
    materialCost: { rough: 1 }, baseStats: { spd: 14 }, rarity: 'Common',
  },
  {
    id: 'rough_bracers',     name: 'Rough Bracers',
    tier: 'copper', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Wrist guards that leave the fingers free. Every hit finds a gap.',
    materialCost: { rough: 1 }, baseStats: { atk: 75, critRate: 0.03 }, rarity: 'Common',
  },

  // ── Thick (tin-equivalent) ───────────────────────────────────────
  {
    id: 'thick_hood',        name: 'Thick Hood',
    tier: 'tin', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Dense enough to absorb a glancing blow without breaking pace.',
    materialCost: { thick: 1 }, baseStats: { hp: 945, spd: 7 }, rarity: 'Uncommon',
  },
  {
    id: 'thick_jerkin',      name: 'Thick Jerkin',
    tier: 'tin', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Reinforced with layered thick hide. Worn by hunters who plan to come back.',
    materialCost: { thick: 2 }, baseStats: { hp: 1283, critRate: 0.03 }, rarity: 'Uncommon',
  },
  {
    id: 'thick_chaps',       name: 'Thick Chaps',
    tier: 'tin', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Overlapping hide panels that move as one. Hard to read.',
    materialCost: { thick: 2 }, baseStats: { hp: 1080, spd: 5, critRate: 0.01 }, rarity: 'Uncommon',
  },
  {
    id: 'thick_boots',       name: 'Thick Boots',
    tier: 'tin', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Still light. Still quiet. Better at taking punishment.',
    materialCost: { thick: 2 }, baseStats: { spd: 19 }, rarity: 'Uncommon',
  },
  {
    id: 'thick_bracers',     name: 'Thick Bracers',
    tier: 'tin', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Padded and reinforced. The extra grip matters in extended fights.',
    materialCost: { thick: 1 }, baseStats: { atk: 101, critRate: 0.04 }, rarity: 'Uncommon',
  },

  // ── Hardened (steel-equivalent) ──────────────────────────────────
  {
    id: 'hardened_hood',     name: 'Hardened Helm',
    tier: 'steel', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Battle-cured hide pressed into shape. It was already half-made by the time it arrived.',
    materialCost: { hardened: 2 }, baseStats: { hp: 1276, spd: 9 }, rarity: 'Rare',
  },
  {
    id: 'hardened_vest',     name: 'Hardened Cuirass',
    tier: 'steel', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Lacquered and compressed. Stops more than most plate of the same weight.',
    materialCost: { hardened: 3 }, baseStats: { hp: 1732, critRate: 0.04 }, rarity: 'Rare',
  },
  {
    id: 'hardened_leggings', name: 'Hardened Leggings',
    tier: 'steel', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Segmented hide, articulated at every joint. Nothing slows them.',
    materialCost: { hardened: 2 }, baseStats: { hp: 1458, spd: 7, critRate: 0.02 }, rarity: 'Rare',
  },
  {
    id: 'hardened_boots',    name: 'Hardened Boots',
    tier: 'steel', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Stiffened soles, but the ankle moves free. Every step is controlled.',
    materialCost: { hardened: 2 }, baseStats: { spd: 26 }, rarity: 'Rare',
  },
  {
    id: 'hardened_vambraces', name: 'Hardened Vambraces',
    tier: 'steel', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Covers from knuckle to elbow. Precise. Lethal.',
    materialCost: { hardened: 2 }, baseStats: { atk: 137, critRate: 0.05 }, rarity: 'Rare',
  },

  // ── Shadow (darksteel-equivalent) ────────────────────────────────
  {
    id: 'shadow_cowl',       name: 'Shadow Cowl',
    tier: 'darksteel', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Absorbs light. Muffles sound. The wearer appears slightly wrong to look at.',
    materialCost: { shadow: 2 }, baseStats: { hp: 1723, spd: 12 }, rarity: 'Epic',
  },
  {
    id: 'shadow_vest',       name: 'Shadow Vest',
    tier: 'darksteel', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'It doesn\'t reflect. Doesn\'t catch light. It doesn\'t want to be seen.',
    materialCost: { shadow: 3 }, baseStats: { hp: 2339, critRate: 0.05 }, rarity: 'Epic',
  },
  {
    id: 'shadow_chaps',      name: 'Shadow Chaps',
    tier: 'darksteel', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Movement leaves no trace. Not even dust.',
    materialCost: { shadow: 2 }, baseStats: { hp: 1968, spd: 9, critRate: 0.03 }, rarity: 'Epic',
  },
  {
    id: 'shadow_treads',     name: 'Shadow Treads',
    tier: 'darksteel', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'No footstep. No shadow. Just arrival.',
    materialCost: { shadow: 2 }, baseStats: { spd: 35 }, rarity: 'Epic',
  },
  {
    id: 'shadow_wraps',      name: 'Shadow Wraps',
    tier: 'darksteel', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'The fingers find gaps that don\'t exist. The crit arrives before the strike.',
    materialCost: { shadow: 2 }, baseStats: { atk: 185, critRate: 0.06 }, rarity: 'Epic',
  },

  // ── Celestial (mithril-equivalent) ───────────────────────────────
  {
    id: 'celestial_hood',    name: 'Starwarden Hood',
    tier: 'mithril', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Spun from the pelts of sky-touched creatures. It hums when you move.',
    materialCost: { celestial: 2 }, baseStats: { hp: 2326, spd: 16 }, rarity: 'Legendary',
  },
  {
    id: 'celestial_vest',    name: 'Starwarden Vest',
    tier: 'mithril', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Impossibly light. Holds shape like it was made for you specifically.',
    materialCost: { celestial: 3 }, baseStats: { hp: 3158, critRate: 0.07 }, rarity: 'Legendary',
  },
  {
    id: 'celestial_leggings',name: 'Starwarden Chaps',
    tier: 'mithril', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Move without warning. Strike before they hear you.',
    materialCost: { celestial: 2 }, baseStats: { hp: 2657, spd: 12, critRate: 0.04 }, rarity: 'Legendary',
  },
  {
    id: 'celestial_boots',   name: 'Starwarden Treads',
    tier: 'mithril', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'You were already across the room. They just haven\'t registered it yet.',
    materialCost: { celestial: 2 }, baseStats: { spd: 47 }, rarity: 'Legendary',
  },
  {
    id: 'celestial_grips',   name: 'Starwarden Grips',
    tier: 'mithril', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Every strike is placed. Every crit is earned, but barely — they happen constantly.',
    materialCost: { celestial: 2 }, baseStats: { atk: 250, critRate: 0.08 }, rarity: 'Legendary',
  },

  // ── Moonscale (moonsilver-equivalent) ────────────────────────────
  {
    id: 'moonscale_coif',    name: 'Moonscale Coif',
    tier: 'moonsilver', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Scales overlapping like a second skin. Light refracts around it strangely.',
    materialCost: { moonscale: 3 }, baseStats: { hp: 2600, spd: 18, critRate: 0.02 }, rarity: 'Epic',
  },
  {
    id: 'moonscale_coat',    name: 'Moonscale Coat',
    tier: 'moonsilver', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Forged, not sewn. A coat that has forgotten it isn\'t armour.',
    materialCost: { moonscale: 5 }, baseStats: { hp: 3600, critRate: 0.08 }, rarity: 'Epic',
  },
  {
    id: 'moonscale_leggings',name: 'Moonscale Leggings',
    tier: 'moonsilver', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'Each scale flexes independently. The legs remember every motion.',
    materialCost: { moonscale: 3 }, baseStats: { hp: 3000, spd: 14, critRate: 0.05 }, rarity: 'Epic',
  },
  {
    id: 'moonscale_treads',  name: 'Moonscale Treads',
    tier: 'moonsilver', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'The drake they came from moved faster than a crossbow bolt. This is inherited.',
    materialCost: { moonscale: 2 }, baseStats: { spd: 52, hp: 300 }, rarity: 'Epic',
  },
  {
    id: 'moonscale_grips',   name: 'Moonscale Grips',
    tier: 'moonsilver', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'leather',
    craftDiscipline: 'leatherworking',
    desc: 'The grip does not slip. The crit does not miss. This is moonscale law.',
    materialCost: { moonscale: 2 }, baseStats: { atk: 280, critRate: 0.09 }, rarity: 'Epic',
  },
]

// Tier metadata for the left panel (matching RECIPE_TIERS pattern in recipes.js)
export const LEATHER_RECIPE_TIERS = [
  { id: 'copper',     name: 'Rough',     color: '#c8906e', recipes: LEATHER_RECIPES.filter(r => r.tier === 'copper')     },
  { id: 'tin',        name: 'Thick',     color: '#b07040', recipes: LEATHER_RECIPES.filter(r => r.tier === 'tin')        },
  { id: 'steel',      name: 'Hardened',  color: '#8a5028', recipes: LEATHER_RECIPES.filter(r => r.tier === 'steel')      },
  { id: 'darksteel',  name: 'Shadow',    color: '#7040b0', recipes: LEATHER_RECIPES.filter(r => r.tier === 'darksteel')  },
  { id: 'mithril',    name: 'Celestial', color: '#5bacd4', recipes: LEATHER_RECIPES.filter(r => r.tier === 'mithril')    },
  { id: 'moonsilver', name: 'Moonscale', color: '#7ee8ff', recipes: LEATHER_RECIPES.filter(r => r.tier === 'moonsilver') },
]

export const LEATHER_BY_ID = Object.fromEntries(LEATHER_RECIPES.map(r => [r.id, r]))

// XP awarded for crafting each tier
export const LEATHER_XP_PER_TIER = { copper: 8, tin: 14, steel: 22, darksteel: 36, mithril: 55, moonsilver: 90 }
