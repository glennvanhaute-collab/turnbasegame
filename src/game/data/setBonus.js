// Flat stat bonuses granted at each piece-count threshold.
// Thresholds stack: hitting 4 also gives the 2-piece bonus.
// Keys match the stat keys in computeGearStats totals.
export const SET_BONUSES = {
  plate: {
    2: { defPct: 0.08 },               // +8% DEF
    4: { hpPct: 0.12 },                // +12% HP
    6: { defPct: 0.05, hpPct: 0.08 }, // additional +5% DEF, +8% HP
  },
  leather: {
    2: { spdPct: 0.08 },               // +8% SPD
    4: { critRate: 0.10 },             // +10% Crit Rate
    6: { atkPct: 0.08 },               // +8% ATK
  },
  cloth: {
    2: { atkPct: 0.12 },               // +12% ATK
    4: { critDmg: 0.10 },              // +10% Crit DMG
    6: { hpPct: 0.08 },                // +8% HP (cloth mages need survivability)
  },
}

// 6-piece passive effects — checked by the combat store, not computeGearStats.
// Stub: combat hooks not yet implemented.
export const SET_PASSIVE_6 = {
  plate:   { id: 'steadfast',   desc: 'When HP drops below 30%, gain a shield equal to 10% max HP (once per battle).' },
  leather: { id: 'shroud',      desc: 'At battle start, become untargetable for 1 turn. Enemies cannot select this hero as a single target.' },
  cloth:   { id: 'aoe_amplify', desc: 'Skills that hit all enemies deal 15% increased damage.' },
}

// Human-readable set names for UI display
export const SET_NAMES = {
  plate:   'Plate',
  leather: 'Leather',
  cloth:   'Cloth',
}

// ── Named (raid) set bonuses — keyed by setId ──────────────────────────────
export const NAMED_SET_BONUSES = {
  regret: {
    2: { raidDmg: 0.15, siegeDmg: 0.10 },                      // +15% Raid DMG, +10% Siege DMG
    4: { atkPct: 0.20, critDmg: 0.20 },                        // +20% ATK, +20% Crit DMG
    6: { raidDmg: 0.15 },                                       // additional +15% Raid DMG
  },
}

export const NAMED_SET_PASSIVE_6 = {
  regret: {
    id:   'throne_judgment',
    desc: 'Shadow Throne: Your first skill each turn surges with void energy, dealing +50% bonus damage.',
  },
}

export const NAMED_SET_INFO = {
  regret: { name: 'Regalia of Regret', color: '#b44fff', source: 'The Throne of Regret' },
}
