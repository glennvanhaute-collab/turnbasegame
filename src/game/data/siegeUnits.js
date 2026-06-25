// Siege unit types — recruited from resources, commanded by heroes in battle.
// Each hero commands one unit stack. Soldiers die in battle and must be replenished.

export const UNIT_TYPES = {
  infantry: {
    id:          'infantry',
    name:        'Iron Soldiers',
    shortName:   'Infantry',
    desc:        'Disciplined front-line fighters. High defence — they absorb punishment so heroes don\'t have to.',
    icon:        '⚔',
    color:       '#c8962a',
    // Per-soldier stats
    atk:         45,
    def:         60,
    hp:          280,
    spd:         55,
    // Recruitment (per soldier)
    recruitCost: { bars: { copper: 2 } },
    recruitPer:  10,    // recruit in batches of 10
    maxStack:    120,
  },

  archers: {
    id:          'archers',
    name:        'Siege Archers',
    shortName:   'Archers',
    desc:        'Ranged attackers who rain arrows from behind the front line. Fragile but lethal.',
    icon:        '🏹',
    color:       '#4dbb6a',
    atk:         90,
    def:         18,
    hp:          140,
    spd:         72,
    recruitCost: { planks: { pine: 5 } },
    recruitPer:  10,
    maxStack:    100,
  },

  siege_crew: {
    id:          'siege_crew',
    name:        'Battering Ram',
    shortName:   'Ram Crew',
    desc:        'Slow-moving siege engine crew. Deals punishing damage to gates and fortified positions.',
    icon:        '🪵',
    color:       '#c85050',
    atk:         380,
    def:         35,
    hp:          900,
    spd:         22,
    recruitCost: { planks: { pine: 15 }, bars: { copper: 3 } },
    recruitPer:  5,
    maxStack:    25,
  },
}

export const UNIT_LIST = Object.values(UNIT_TYPES)
