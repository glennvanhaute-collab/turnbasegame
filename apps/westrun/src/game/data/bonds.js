// Companionship bonds — passive stat bonuses when specific heroes fight together.
// Heroes in a bond gain their bonus on top of full gear-applied stats.
// Heroes receive hero.activeBonds = [...] so the UI can display bond indicators.

export const BONDS = [
  {
    id:          'iron_vow',
    name:        'The Iron Vow',
    keys:        ['LORD_ALDRIC', 'HELGA'],
    heroes:      ['lord_aldric', 'helga'],
    description: 'Aldric and Helga have stood together through war and silence. She steadies him; he sets her alight.',
    bonuses: {
      lord_aldric: { hpPct: 0.15, defPct: 0.20 },
      helga:        { hpPct: 0.15, atkPct: 0.20 },
    },
  },
  {
    id:          'last_conquest',
    name:        'The Last Conquest',
    keys:        ['ARNE_FROSTBOUND', 'HILDA_SHIELDMAIDEN'],
    heroes:      ['arne_frostbound', 'hilda_shieldmaiden'],
    description: 'He conquered kingdoms and called it easy. She held a gate alone and called it Tuesday. Together, nothing has stood against them since.',
    bonuses: {
      arne_frostbound:    { hpPct: 0.18, atkPct: 0.22 },
      hilda_shieldmaiden: { hpPct: 0.20, defPct: 0.24 },
    },
  },
  {
    id:          'edge_of_the_tide',
    name:        'The Edge of the Tide',
    keys:        ['MARINA_AEGIRA', 'GLENNIOS_AEGIRA'],
    heroes:      ['marina_aegira', 'glennios_aegira'],
    description: 'She tells the sea where to go. He decides where it stops. Aegira has fought this way for four hundred years and sees no reason to improve on it.',
    bonuses: {
      marina_aegira:   { hpPct: 0.14, atkPct: 0.22 },
      glennios_aegira: { hpPct: 0.20, defPct: 0.24 },
    },
  },
]

// Apply all active bonds to an already-geared hero array (mutates in place).
export function applyBonds(heroes) {
  const byId = Object.fromEntries(heroes.map(h => [h.id, h]))

  for (const bond of BONDS) {
    const allPresent = bond.heroes.every(id => byId[id])
    if (!allPresent) continue

    for (const [id, bonus] of Object.entries(bond.bonuses)) {
      const hero = byId[id]
      if (!hero) continue

      if (bonus.hpPct)  { hero.baseHp  = Math.floor(hero.baseHp  * (1 + bonus.hpPct));  hero.maxHp = hero.baseHp; hero.hp = hero.baseHp }
      if (bonus.atkPct) { hero.baseAtk = Math.floor(hero.baseAtk * (1 + bonus.atkPct)) }
      if (bonus.defPct) { hero.baseDef = Math.floor(hero.baseDef * (1 + bonus.defPct)) }
      if (bonus.spdPct) { hero.baseSpd = Math.floor(hero.baseSpd * (1 + bonus.spdPct)) }

      hero.activeBonds = hero.activeBonds ?? []
      hero.activeBonds.push({ id: bond.id, name: bond.name })
    }
  }
}
