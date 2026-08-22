import { GearType, GearSlot, WeaponType } from '../Gear.js'

// materialCost: { clothId: amount } — processed cloth bolts consumed per craft
// armorType: 'cloth' makes these count toward the cloth set bonus
// Stats focus: ATK%, critDmg — cloth wearers hit harder, not safer

export const TAILORING_RECIPES = [
  // ── Cotton (copper-equivalent) ──────────────────────────────────
  {
    id: 'cotton_cowl',     name: 'Cotton Cowl',
    tier: 'copper', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Soft enough to sleep in. Light enough to fight in. Not much else.',
    materialCost: { cotton: 1 }, baseStats: { hp: 500, atkPct: 0.03 }, rarity: 'Common',
  },
  {
    id: 'cotton_robe',     name: 'Cotton Robe',
    tier: 'copper', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Unassuming. Comfortable. The kind of garment that doesn\'t announce anything until it\'s too late.',
    materialCost: { cotton: 2 }, baseStats: { hp: 700, atkPct: 0.06 }, rarity: 'Common',
  },
  {
    id: 'cotton_trousers', name: 'Cotton Trousers',
    tier: 'copper', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Nothing here impresses. The damage output, on the other hand.',
    materialCost: { cotton: 1 }, baseStats: { hp: 600, atkPct: 0.04 }, rarity: 'Common',
  },
  {
    id: 'cotton_slippers', name: 'Cotton Slippers',
    tier: 'copper', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'No protection. No weight. The mage moves unimpeded.',
    materialCost: { cotton: 1 }, baseStats: { spd: 6, atkPct: 0.02 }, rarity: 'Common',
  },
  {
    id: 'cotton_wraps',    name: 'Cotton Handwraps',
    tier: 'copper', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Keeps the fingers nimble. Every gesture carries intent.',
    materialCost: { cotton: 1 }, baseStats: { atk: 60, critDmg: 0.04 }, rarity: 'Common',
  },

  // ── Wool (tin-equivalent) ────────────────────────────────────────
  {
    id: 'wool_cowl',      name: 'Wool Cowl',
    tier: 'tin', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Heavier than cotton, but the focus it provides is worth it.',
    materialCost: { wool: 1 }, baseStats: { hp: 675, atkPct: 0.04 }, rarity: 'Uncommon',
  },
  {
    id: 'wool_robe',      name: 'Wool Robe',
    tier: 'tin', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Layered wool wicks heat from spellcasting. The output climbs accordingly.',
    materialCost: { wool: 2 }, baseStats: { hp: 945, atkPct: 0.08 }, rarity: 'Uncommon',
  },
  {
    id: 'wool_breeches',  name: 'Wool Breeches',
    tier: 'tin', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'High-waisted, well-fitted. Nothing gets in the way of the next cast.',
    materialCost: { wool: 2 }, baseStats: { hp: 810, atkPct: 0.05 }, rarity: 'Uncommon',
  },
  {
    id: 'wool_shoes',     name: 'Wool Shoes',
    tier: 'tin', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Lined with warmth, cut for movement. The casting stance holds steady.',
    materialCost: { wool: 1 }, baseStats: { spd: 8, atkPct: 0.03 }, rarity: 'Uncommon',
  },
  {
    id: 'wool_gloves',    name: 'Wool Gloves',
    tier: 'tin', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Thick but dexterous. Channelling through them adds something extra.',
    materialCost: { wool: 1 }, baseStats: { atk: 81, critDmg: 0.06 }, rarity: 'Uncommon',
  },

  // ── Silkweave (steel-equivalent) ────────────────────────────────
  {
    id: 'silk_cowl',      name: 'Silk Cowl',
    tier: 'steel', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Finer than air. Wearing it changes how you think about damage.',
    materialCost: { silkweave: 2 }, baseStats: { hp: 911, atkPct: 0.05 }, rarity: 'Rare',
  },
  {
    id: 'silk_vestment',  name: 'Silk Vestment',
    tier: 'steel', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Feels like wearing nothing. The enemy would agree — each hit lands harder than expected.',
    materialCost: { silkweave: 3 }, baseStats: { hp: 1276, atkPct: 0.11 }, rarity: 'Rare',
  },
  {
    id: 'silk_breeches',  name: 'Silk Breeches',
    tier: 'steel', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'The material moves before you do. Initiative follows.',
    materialCost: { silkweave: 2 }, baseStats: { hp: 1094, atkPct: 0.07 }, rarity: 'Rare',
  },
  {
    id: 'silk_slippers',  name: 'Silk Slippers',
    tier: 'steel', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'The footwork becomes unconscious. The spells arrive before the movement ends.',
    materialCost: { silkweave: 2 }, baseStats: { spd: 11, atkPct: 0.04 }, rarity: 'Rare',
  },
  {
    id: 'silk_gloves',    name: 'Silk Gloves',
    tier: 'steel', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Thin enough to feel everything. The critical strike is no longer accidental.',
    materialCost: { silkweave: 2 }, baseStats: { atk: 109, critDmg: 0.08 }, rarity: 'Rare',
  },

  // ── Shadow Cloth (darksteel-equivalent) ─────────────────────────
  {
    id: 'shadowcloth_cowl',     name: 'Shadowcloth Cowl',
    tier: 'darksteel', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Threads woven from void-touched moths. Focus sharpens to a point.',
    materialCost: { shadowcloth: 2 }, baseStats: { hp: 1230, atkPct: 0.07 }, rarity: 'Epic',
  },
  {
    id: 'shadowcloth_vestment', name: 'Shadowcloth Vestment',
    tier: 'darksteel', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Channels power from outside what is visible. The damage comes from nowhere.',
    materialCost: { shadowcloth: 4 }, baseStats: { hp: 1722, atkPct: 0.14 }, rarity: 'Epic',
  },
  {
    id: 'shadowcloth_breeches', name: 'Shadowcloth Breeches',
    tier: 'darksteel', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Void-dyed and silent. Power builds in the weave with each step.',
    materialCost: { shadowcloth: 3 }, baseStats: { hp: 1477, atkPct: 0.09 }, rarity: 'Epic',
  },
  {
    id: 'shadowcloth_slippers', name: 'Shadowcloth Slippers',
    tier: 'darksteel', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Absence is also a kind of presence. The strike arrives without announcement.',
    materialCost: { shadowcloth: 2 }, baseStats: { spd: 15, atkPct: 0.06 }, rarity: 'Epic',
  },
  {
    id: 'shadowcloth_gloves',   name: 'Shadowcloth Gloves',
    tier: 'darksteel', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Power pours through the fingers. Critical strikes land like judgements.',
    materialCost: { shadowcloth: 2 }, baseStats: { atk: 147, critDmg: 0.11 }, rarity: 'Epic',
  },

  // ── Starweave (mithril-equivalent) ──────────────────────────────
  {
    id: 'starweave_diadem',   name: 'Starweave Diadem',
    tier: 'mithril', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Threads of fallen starlight, woven under open skies. The mind expands to fill it.',
    materialCost: { starweave: 2 }, baseStats: { hp: 1661, atkPct: 0.09 }, rarity: 'Common',
  },
  {
    id: 'starweave_mantle',   name: 'Starweave Mantle',
    tier: 'mithril', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'The greatest offensive garment in mortal creation. It doesn\'t defend. It doesn\'t need to.',
    materialCost: { starweave: 4 }, baseStats: { hp: 2325, atkPct: 0.19 }, rarity: 'Common',
  },
  {
    id: 'starweave_breeches', name: 'Starweave Breeches',
    tier: 'mithril', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Woven with dormant radiance. The attack bonus is a side effect of simply wearing them.',
    materialCost: { starweave: 3 }, baseStats: { hp: 1994, atkPct: 0.12 }, rarity: 'Common',
  },
  {
    id: 'starweave_treads',   name: 'Starweave Treads',
    tier: 'mithril', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Woven from star-fall. The next action begins before the last one ends.',
    materialCost: { starweave: 2 }, baseStats: { spd: 20, atkPct: 0.08 }, rarity: 'Common',
  },
  {
    id: 'starweave_gloves',   name: 'Starweave Gloves',
    tier: 'mithril', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Every critical strike carries light from above. It hits harder than intended. Always.',
    materialCost: { starweave: 2 }, baseStats: { atk: 199, critDmg: 0.15 }, rarity: 'Common',
  },

  // ── Moonweave (moonsilver-equivalent) ───────────────────────────
  {
    id: 'moonweave_diadem',   name: 'Moonweave Diadem',
    tier: 'moonsilver', slot: GearSlot.HEAD, gearType: GearType.HELMET, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'Woven by lunar wraiths who have never known stillness. Focus becomes absolute.',
    materialCost: { moonweave: 2 }, baseStats: { hp: 1800, atkPct: 0.11 }, rarity: 'Common',
  },
  {
    id: 'moonweave_mantle',   name: 'Moonweave Mantle',
    tier: 'moonsilver', slot: GearSlot.CHEST, gearType: GearType.ARMOR, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'The moon does not show mercy. Neither does this. Every hit lands with lunar certainty.',
    materialCost: { moonweave: 5 }, baseStats: { hp: 2600, atkPct: 0.22 }, rarity: 'Common',
  },
  {
    id: 'moonweave_breeches', name: 'Moonweave Breeches',
    tier: 'moonsilver', slot: GearSlot.LEGS, gearType: GearType.LEGS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'The tides obey the moon. So does the damage output.',
    materialCost: { moonweave: 3 }, baseStats: { hp: 2200, atkPct: 0.14 }, rarity: 'Common',
  },
  {
    id: 'moonweave_treads',   name: 'Moonweave Treads',
    tier: 'moonsilver', slot: GearSlot.BOOTS, gearType: GearType.BOOTS, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'You move with the pull of the moon. Opponents react to where you were.',
    materialCost: { moonweave: 2 }, baseStats: { spd: 22, atkPct: 0.09 }, rarity: 'Common',
  },
  {
    id: 'moonweave_gloves',   name: 'Moonweave Gloves',
    tier: 'moonsilver', slot: GearSlot.GLOVES, gearType: GearType.GLOVES, armorType: 'cloth',
    craftDiscipline: 'tailoring',
    desc: 'When a lunar-touched mage crits, they see a reflection of the kill before it happens.',
    materialCost: { moonweave: 2 }, baseStats: { atk: 220, critDmg: 0.17 }, rarity: 'Common',
  },
]

export const TAILORING_RECIPE_TIERS = [
  { id: 'copper',     name: 'Cotton',     color: '#f0e0c0', recipes: TAILORING_RECIPES.filter(r => r.tier === 'copper')     },
  { id: 'tin',        name: 'Wool',       color: '#d4c4a8', recipes: TAILORING_RECIPES.filter(r => r.tier === 'tin')        },
  { id: 'steel',      name: 'Silkweave',  color: '#e8d8ff', recipes: TAILORING_RECIPES.filter(r => r.tier === 'steel')      },
  { id: 'darksteel',  name: 'Shadowcloth',color: '#9060c0', recipes: TAILORING_RECIPES.filter(r => r.tier === 'darksteel')  },
  { id: 'mithril',    name: 'Starweave',  color: '#88ccff', recipes: TAILORING_RECIPES.filter(r => r.tier === 'mithril')    },
  { id: 'moonsilver', name: 'Moonweave',  color: '#bbeeff', recipes: TAILORING_RECIPES.filter(r => r.tier === 'moonsilver') },
]

export const TAILORING_BY_ID = Object.fromEntries(TAILORING_RECIPES.map(r => [r.id, r]))

export const TAILORING_XP_PER_TIER = { copper: 8, tin: 14, steel: 22, darksteel: 36, mithril: 55, moonsilver: 90 }

// Staves moved to Woodworking — crafted from planks + dungeon essence in one step.
