import { GearSlot, GearType, WeaponType } from '../Gear.js'
import { WOODS } from './woods.js'

// Bows only — strung with a Tailoring bowstring to complete.
// Staves moved to Tailoring and crafted from dungeon essences.

export const WOODWORKING_RECIPES = [
  // ── Pine (Common) ────────────────────────────────────────────────
  {
    id: 'pine_shortbow',
    name: 'Pine Shortbow',
    tier: 'pine',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.BOW,
    armorType: 'leather',
    desc: 'A simple shortbow whittled from pine, strung with cotton. Light and quick.',
    plankCost: { pine: 3 },
    bowstringCost: 'cotton',
    baseStats: { atk: 100, spd: 6 },
    rarity: 'Common',
  },

  // ── Oak (Uncommon) ───────────────────────────────────────────────
  {
    id: 'oak_shortbow',
    name: 'Oak Shortbow',
    tier: 'oak',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.BOW,
    armorType: 'leather',
    desc: 'Hardwood body, reliable draw. Wool string gives it a satisfying snap.',
    plankCost: { oak: 4 },
    bowstringCost: 'wool',
    baseStats: { atk: 135, spd: 8 },
    rarity: 'Uncommon',
  },

  // ── Yew (Rare) ───────────────────────────────────────────────────
  {
    id: 'yew_longbow',
    name: 'Yew Longbow',
    tier: 'yew',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.BOW,
    armorType: 'leather',
    desc: "Yew's natural flex paired with silk string. It punishes those in its path.",
    plankCost: { yew: 5 },
    bowstringCost: 'silkweave',
    baseStats: { atk: 182, spd: 10 },
    rarity: 'Rare',
  },

  // ── Ashwood (Epic) ───────────────────────────────────────────────
  {
    id: 'ashwood_longbow',
    name: 'Ashwood Longbow',
    tier: 'ashwood',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.BOW,
    armorType: 'leather',
    desc: 'Highland ash strung with shadow cloth. Arrows leave this bow like bad news.',
    plankCost: { ashwood: 6 },
    bowstringCost: 'shadowcloth',
    baseStats: { atk: 246, spd: 13 },
    rarity: 'Epic',
  },

  // ── Ironwood (Legendary) ─────────────────────────────────────────
  {
    id: 'ironwood_warbow',
    name: 'Ironwood Warbow',
    tier: 'ironwood',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.BOW,
    armorType: 'leather',
    desc: 'Rings like metal. Starweave string draws the star-cold power out of every shot.',
    plankCost: { ironwood: 7 },
    bowstringCost: 'starweave',
    baseStats: { atk: 332, spd: 17 },
    rarity: 'Legendary',
  },

  // ── Dragonwood (Legendary) ───────────────────────────────────────
  {
    id: 'dragonwood_warbow',
    name: 'Dragonwood Warbow',
    tier: 'dragonwood',
    slot: GearSlot.MAIN_HAND,
    gearType: GearType.WEAPON,
    weaponType: WeaponType.BOW,
    armorType: 'leather',
    desc: 'Still radiates faint heat. Moonweave string hums under tension. Arrows arrive before you hear the shot.',
    plankCost: { dragonwood: 8 },
    bowstringCost: 'moonweave',
    baseStats: { atk: 450, spd: 22 },
    rarity: 'Legendary',
  },
]

export const WOOD_RECIPE_TIERS = [
  { id: 'pine',       name: 'Pine',       color: WOODS.pine.color,       woodworkingLevel: 1,  recipes: WOODWORKING_RECIPES.filter(r => r.tier === 'pine')       },
  { id: 'oak',        name: 'Oak',        color: WOODS.oak.color,        woodworkingLevel: 3,  recipes: WOODWORKING_RECIPES.filter(r => r.tier === 'oak')        },
  { id: 'yew',        name: 'Yew',        color: WOODS.yew.color,        woodworkingLevel: 6,  recipes: WOODWORKING_RECIPES.filter(r => r.tier === 'yew')        },
  { id: 'ashwood',    name: 'Ashwood',    color: WOODS.ashwood.color,    woodworkingLevel: 10, recipes: WOODWORKING_RECIPES.filter(r => r.tier === 'ashwood')    },
  { id: 'ironwood',   name: 'Ironwood',   color: WOODS.ironwood.color,   woodworkingLevel: 15, recipes: WOODWORKING_RECIPES.filter(r => r.tier === 'ironwood')   },
  { id: 'dragonwood', name: 'Dragonwood', color: WOODS.dragonwood.color, woodworkingLevel: 20, recipes: WOODWORKING_RECIPES.filter(r => r.tier === 'dragonwood') },
]
