// Camp building definitions — each building has 5 upgrade tiers
// Costs require gold + ores, scaling from copper (T1) to mithril (T5)

export const BUILDING_IDS = [
  'warband_hall',
  'breachwrights_yard',
  'the_vigil',
  'healers_tent',
  'arcane_post',
  'quartermasters_hold',
  'siege_forge',
  'lumber_hall',
]

// Ore display names (for cost breakdown)
export const ORE_NAMES = {
  copper:    'Copper Ore',
  tin:       'Tin Ore',
  steel:     'Steel Ore',
  darksteel: 'Darksteel Ore',
  mithril:   'Mithril Ore',
}

export const CAMP_BUILDINGS = {

  warband_hall: {
    id:    'warband_hall',
    name:  'The Warband Hall',
    lore:  'Where soldiers sleep, sharpen blades, and remember what they fight for.',
    image: 'camp_warband_hall.png',
    tiers: [
      { cost: { gold: 500,   ores: { copper:    15 } }, bonus: '+5% ATK to all heroes'  },
      { cost: { gold: 1200,  ores: { tin:       20 } }, bonus: '+10% ATK to all heroes' },
      { cost: { gold: 2800,  ores: { steel:     15 } }, bonus: '+15% ATK to all heroes' },
      { cost: { gold: 6000,  ores: { darksteel: 20 } }, bonus: '+20% ATK to all heroes' },
      { cost: { gold: 12000, ores: { mithril:   15 } }, bonus: '+25% ATK to all heroes' },
    ],
  },

  breachwrights_yard: {
    id:    'breachwrights_yard',
    name:  "The Breachwright's Yard",
    lore:  'Siege engines are not built in a day. But when they are ready, walls mean nothing.',
    image: 'camp_breachwrights_yard.png',
    tiers: [
      { cost: { gold: 800,   ores: { copper:    20 } }, bonus: 'Unlocks Easy Sieges',                   unlocks: ['siege_easy']      },
      { cost: { gold: 2000,  ores: { tin:       25 } }, bonus: 'Unlocks Medium Sieges',                 unlocks: ['siege_medium']    },
      { cost: { gold: 4500,  ores: { steel:     20 } }, bonus: 'Unlocks Hard Sieges + +10% siege loot', unlocks: ['siege_hard']      },
      { cost: { gold: 9000,  ores: { darksteel: 25 } }, bonus: 'Unlocks Nightmare Sieges',              unlocks: ['siege_nightmare'] },
      { cost: { gold: 18000, ores: { mithril:   20 } }, bonus: '+25% siege loot, siege gear guaranteed' },
    ],
  },

  the_vigil: {
    id:    'the_vigil',
    name:  'The Vigil',
    lore:  'The tower watches. The tower remembers. No enemy moves unseen.',
    image: 'camp_the_vigil.png',
    tiers: [
      { cost: { gold: 600,   ores: { copper:    10 } }, bonus: 'See enemy HP before entering dungeons'       },
      { cost: { gold: 1500,  ores: { tin:       15 } }, bonus: 'See enemy skills before entering dungeons'   },
      { cost: { gold: 3000,  ores: { steel:     12 } }, bonus: '+10% SPD to all heroes on first turn'        },
      { cost: { gold: 6500,  ores: { darksteel: 15 } }, bonus: 'Notify when idle training cap is near (90%)' },
      { cost: { gold: 13000, ores: { mithril:   12 } }, bonus: '+15% SPD first turn, +5% Crit Rate'          },
    ],
  },

  healers_tent: {
    id:    'healers_tent',
    name:  "The Healer's Tent",
    lore:  'The battle is won or lost in here, long after the swords fall silent.',
    image: 'camp_healers_tent.png',
    tiers: [
      { cost: { gold: 700,   ores: { copper:    12 } }, bonus: 'All heroes start battle with +5% HP'          },
      { cost: { gold: 1600,  ores: { tin:       18 } }, bonus: '+10% effectiveness of all healing skills'     },
      { cost: { gold: 3500,  ores: { steel:     14 } }, bonus: 'One hero revives once per siege (50% HP)'     },
      { cost: { gold: 7500,  ores: { darksteel: 18 } }, bonus: 'All heroes start battle with +15% HP'         },
      { cost: { gold: 15000, ores: { mithril:   14 } }, bonus: 'Two heroes revive once per siege (75% HP)'    },
    ],
  },

  arcane_post: {
    id:    'arcane_post',
    name:  'The Arcane Post',
    lore:  'House Valdris sends no soldiers. They send knowledge. Which is worse.',
    image: 'camp_arcane_post.png',
    tiers: [
      { cost: { gold: 900,   ores: { copper:    18 } }, bonus: '+5% magic damage'                         },
      { cost: { gold: 2200,  ores: { tin:       22 } }, bonus: '+8% magic damage, +5% magic resistance'   },
      { cost: { gold: 4800,  ores: { steel:     18 } }, bonus: '+12% magic damage, +10% magic resistance' },
      { cost: { gold: 9500,  ores: { darksteel: 22 } }, bonus: '+15% magic damage, +12% magic resistance' },
      { cost: { gold: 19000, ores: { mithril:   18 } }, bonus: '+20% magic damage, +15% magic resistance' },
    ],
  },

  quartermasters_hold: {
    id:    'quartermasters_hold',
    name:  "The Quartermaster's Hold",
    lore:  'An army travels on its stomach. A warband survives on its ledger.',
    image: 'camp_quartermasters_hold.png',
    tiers: [
      { cost: { gold: 500,   ores: { copper:    10 } }, bonus: '+20% idle training gold rate'              },
      { cost: { gold: 1200,  ores: { tin:       14 } }, bonus: '+25% idle gold, +15% idle ore rates'       },
      { cost: { gold: 2600,  ores: { steel:     10 } }, bonus: '+30% idle gold, +25% idle ore rates'       },
      { cost: { gold: 5500,  ores: { darksteel: 14 } }, bonus: '+35% all idle rates, idle cap extends to 16h' },
      { cost: { gold: 11000, ores: { mithril:   10 } }, bonus: '+50% all idle rates, idle cap extends to 20h' },
    ],
  },

  siege_forge: {
    id:    'siege_forge',
    name:  'The Siege Forge',
    lore:  'The blacksmith who forges a siege bolt forges the outcome of a battle.',
    image: 'camp_siege_forge.png',
    tiers: [
      { cost: { gold: 1000,  ores: { copper:    25 } }, bonus: 'Siege materials begin dropping from sieges'    },
      { cost: { gold: 2500,  ores: { tin:       30 } }, bonus: 'Unlocks Tier 1 siege gear recipes'             },
      { cost: { gold: 5500,  ores: { steel:     25 } }, bonus: 'Unlocks Tier 2 siege gear recipes'             },
      { cost: { gold: 11000, ores: { darksteel: 30 } }, bonus: 'Unlocks Tier 3 siege gear recipes'             },
      { cost: { gold: 22000, ores: { mithril:   25 } }, bonus: 'Unlocks Legendary siege gear + unique weapons' },
    ],
  },
}

  lumber_hall: {
    id:    'lumber_hall',
    name:  'The Lumber Hall',
    lore:  'Surplus timber does not rot in this camp. It becomes walls, weapon racks, and eventually — advantage.',
    image: 'camp_lumber_hall.png',
    tiers: [
      { cost: { gold: 600,   planks: { pine:      25000 } }, bonus: '+20% woodworking XP from all crafting'                   },
      { cost: { gold: 1400,  planks: { oak:        8000 } }, bonus: '+35% woodworking XP from all crafting'                   },
      { cost: { gold: 3000,  planks: { yew:        3500 } }, bonus: '+50% woodworking XP, +5% DEF to all heroes'              },
      { cost: { gold: 6000,  planks: { ashwood:    2000 } }, bonus: '+65% woodworking XP, +10% DEF to all heroes'             },
      { cost: { gold: 12000, planks: { ironwood:   1000 } }, bonus: '+80% woodworking XP, +15% DEF, bows deal +10% in raids'  },
    ],
  },

// Helper: get bonus description for a given building at a given tier (1-indexed)
export function getBuildingBonus(buildingId, tier) {
  const b = CAMP_BUILDINGS[buildingId]
  if (!b || tier < 1 || tier > b.tiers.length) return null
  return b.tiers[tier - 1].bonus
}

// Helper: what unlocks does a tier grant?
export function getTierUnlocks(buildingId, tier) {
  const b = CAMP_BUILDINGS[buildingId]
  if (!b || tier < 1 || tier > b.tiers.length) return []
  return b.tiers[tier - 1].unlocks ?? []
}

// Aggregate all active unlocks for a given building levels map { buildingId: currentTier }
export function getActiveUnlocks(buildingLevels) {
  const unlocks = new Set()
  for (const [id, tier] of Object.entries(buildingLevels)) {
    for (let t = 1; t <= tier; t++) {
      getTierUnlocks(id, t).forEach(u => unlocks.add(u))
    }
  }
  return unlocks
}
