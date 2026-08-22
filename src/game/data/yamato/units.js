// Yamato placeholder units — 5 allies, 3 enemies.
// Each skill carries an `fxId` that keys into SKILL_FX (src/game/data/skillFxLibrary.js),
// so the 52-skill FX library drives the visuals without being modified.

const A = import.meta.env.BASE_URL + 'yamato/battle/'

export const ALLY_UNITS = [
  {
    id: 'akane', name: 'Akane of Sakuragawa', role: 'Blossom Vanguard', clan: 'SAKURAGAWA',
    team: 'ally', portrait: A + 'barrow_portrait.jpg', combat: A + 'combat_akane.png',
    filter: 'hue-rotate(336deg) saturate(.62) brightness(1.16)',
    atk: 3900, def: 2550, speed: 178, crit: 0.32, critDamage: 1.55, maxHp: 46000, res: 145,
    skills: [
      { name: 'Petal Strike',    type: 'A1 · ATTACK',  desc: 'Measured single-target cut.',            cd: 0, fxId: 'nature-thorn-whip',       kind: 'attack',   power: 1.02 },
      { name: 'Crimson Guard',   type: 'A2 · SHIELD',  desc: 'Shields the team and raises DEF.',       cd: 3, fxId: 'earth-mountain-guard',    kind: 'shield',   shieldPct: 0.16, buff: 'defUp' },
      { name: 'Vermilion Oath',  type: 'A3 · EXECUTE', desc: 'Heavy strike, stronger on marked foes.', cd: 4, fxId: 'blood-crimson-ascension', kind: 'attack',   power: 1.42, heavy: true, critIfMarked: true },
    ],
  },
  {
    id: 'renji', name: 'Renji Seiryo', role: 'Moonlit Duelist', clan: 'SEIRYOZAN',
    team: 'ally', portrait: A + 'serix_portrait.jpg', combat: A + 'combat_renji.png',
    filter: 'hue-rotate(278deg) saturate(.74) brightness(1.05)',
    atk: 4480, def: 2140, speed: 199, crit: 0.64, critDamage: 1.9, maxHp: 41800, res: 126,
    skills: [
      { name: 'Moon Slash',  type: 'A1 · ATTACK',      desc: 'Quick slash with Weaken chance.',        cd: 0, fxId: 'ice-frostbite-cut',      kind: 'attack',    power: 1.06, applyChance: { id: 'weaken', chance: 0.35, turns: 2 } },
      { name: 'Twin Iai',    type: 'A2 · DOUBLE HIT',  desc: 'Two cuts that may place DEF Down.',      cd: 3, fxId: 'wind-vacuum-blade',      kind: 'multihit',  power: 0.72, hits: 2, applyChance: { id: 'defDown', chance: 0.48, turns: 2 } },
      { name: 'Hollow Moon', type: 'A3 · FINISHER',    desc: 'High burst empowered by debuffs.',       cd: 5, fxId: 'dark-eclipse-sovereign', kind: 'attack',    power: 1.72, heavy: true, ignoreDef: 0.28, eclipse: true, debuffScale: 0.22 },
    ],
  },
  {
    id: 'kaede', name: 'Kaede Kitsune', role: 'Foxfire Archer', clan: 'KITSUNEGASHIMA',
    team: 'ally', portrait: A + 'serix_portrait.jpg', combat: A + 'combat_kaede.png',
    filter: 'hue-rotate(110deg) saturate(.68) brightness(1.12)',
    atk: 3760, def: 2020, speed: 191, crit: 0.39, critDamage: 1.56, maxHp: 40500, res: 140,
    skills: [
      { name: 'Foxfire Arrow', type: 'A1 · ATTACK', desc: 'Ranged shot into a single enemy.', cd: 0, fxId: 'fire-ember-fang',    kind: 'attack', power: 0.98 },
      { name: 'Spirit Mend',   type: 'A2 · HEAL',   desc: 'Restores health across the team.', cd: 3, fxId: 'nature-grove-mend',  kind: 'heal',   healPct: 0.14 },
      { name: 'Hunter Mark',   type: 'A3 · MARK',   desc: 'Damages and brands the target.',   cd: 4, fxId: 'light-beacon-brand', kind: 'attack', power: 1.08, apply: { id: 'marked', turns: 2 } },
    ],
  },
  {
    id: 'mizuki', name: 'Mizuki Suisen', role: 'Ofuda Channeler', clan: 'SUISEN NO SATO',
    team: 'ally', portrait: A + 'serix_portrait.jpg', combat: A + 'combat_mizuki.png',
    filter: 'hue-rotate(180deg) saturate(.86) brightness(1.1)',
    atk: 4140, def: 1980, speed: 205, crit: 0.42, critDamage: 1.62, maxHp: 39200, res: 152,
    skills: [
      { name: 'Ofuda Bolt',    type: 'A1 · ARCANE',  desc: 'Paper talisman bolt with Weaken chance.', cd: 0, fxId: 'arcane-sigil-lance',        kind: 'attack',  power: 0.95, applyChance: { id: 'weaken', chance: 0.30, turns: 2 } },
      { name: 'Azure Ward',    type: 'A2 · SUPPORT', desc: 'Shield allies and raise Speed.',          cd: 3, fxId: 'arcane-mirror-ward',        kind: 'shield',  shieldPct: 0.14, buff: 'speedUp' },
      { name: 'Tide of Seals', type: 'A3 · AOE',     desc: 'Arcane burst across the enemy line.',     cd: 4, fxId: 'arcane-astral-convergence', kind: 'aoe',     power: 0.74, applyChance: { id: 'defDown', chance: 0.35, turns: 2 } },
    ],
  },
  {
    id: 'isao', name: 'Isao Heijan', role: 'Temple Spear', clan: 'HEIJANJO',
    team: 'ally', portrait: A + 'barrow_portrait.jpg', combat: A + 'combat_isao.png',
    filter: 'hue-rotate(18deg) saturate(.35) brightness(1.24)',
    atk: 4060, def: 2280, speed: 173, crit: 0.36, critDamage: 1.58, maxHp: 43800, res: 154,
    skills: [
      { name: 'Temple Thrust',   type: 'A1 · ATTACK', desc: 'A disciplined spear thrust.',              cd: 0, fxId: 'light-sunblade',        kind: 'attack', power: 1.0 },
      { name: 'Harmony Sutra',   type: 'A2 · HEAL',   desc: 'Heals allies and raises DEF.',             cd: 4, fxId: 'light-radiant-covenant', kind: 'heal',  healPct: 0.12, buff: 'defUp' },
      { name: 'Heaven Splitter', type: 'A3 · SPEAR',  desc: 'Single-target burst against afflicted foes.', cd: 4, fxId: 'light-dawn-ascendant', kind: 'attack', power: 1.24, heavy: true, ignoreDef: 0.16, afflictedBonus: 0.22 },
    ],
  },
]

export const ENEMY_UNITS = [
  {
    id: 'ronin', name: 'Ashen Ronin', role: 'Enemy Vanguard', clan: 'ASHEN BAND',
    team: 'enemy', portrait: A + 'barrow_portrait.jpg', combat: A + 'combat_ronin.png',
    filter: 'hue-rotate(0deg) saturate(.55) brightness(.92)',
    atk: 3920, def: 2580, speed: 176, crit: 0.22, critDamage: 1.52, maxHp: 36800, res: 140,
    ai: 'lowestHp',
    skills: [
      { name: 'Iron Cleave',   type: 'A1', desc: 'Single-target sword strike.',        cd: 0, fxId: 'earth-stonebreaker', kind: 'attack', power: 1.0, applyChance: { id: 'bleed', chance: 0.22, turns: 2 } },
      { name: 'Ashen Guard',   type: 'A2', desc: 'Self shield and Increase DEF.',      cd: 3, fxId: 'earth-mountain-guard', kind: 'selfShield', shieldPct: 0.22, buff: 'defUp' },
      { name: 'Decisive Fall', type: 'A3', desc: 'Heavy strike against wounded foes.', cd: 4, fxId: 'earth-worldshaker', kind: 'attack', power: 1.58, heavy: true, ignoreDef: 0.18 },
    ],
  },
  {
    id: 'oni', name: 'Oni Retainer', role: 'Crusher', clan: 'RED HORN',
    team: 'enemy', portrait: A + 'barrow_portrait.jpg', combat: A + 'combat_oni.png',
    filter: 'hue-rotate(320deg) saturate(1.1) brightness(.9)',
    atk: 3620, def: 2360, speed: 168, crit: 0.18, critDamage: 1.48, maxHp: 35200, res: 132,
    ai: 'marked',
    skills: [
      { name: 'Club Sweep',   type: 'A1', desc: 'Sweeping attack on all allies.',     cd: 0, fxId: 'earth-fault-line',   kind: 'aoe',       power: 0.62 },
      { name: 'Bone Pin',     type: 'A2', desc: 'Marks one foe and breaks defense.',  cd: 3, fxId: 'poison-venom-needle', kind: 'attack',   power: 0.92, apply: { id: 'defDown', turns: 2 }, apply2: { id: 'marked', turns: 1 } },
      { name: 'Soul Draught', type: 'A3', desc: 'Restores its own health.',           cd: 4, fxId: 'blood-sanguine-pact', kind: 'selfHeal', healPct: 0.16 },
    ],
  },
  {
    id: 'wraith', name: 'Marsh Wraith', role: 'Curse Caster', clan: 'YOKAIGATA',
    team: 'enemy', portrait: A + 'serix_portrait.jpg', combat: A + 'combat_wraith.png',
    filter: 'hue-rotate(310deg) saturate(.95) brightness(.88)',
    atk: 3480, def: 2100, speed: 186, crit: 0.24, critDamage: 1.44, maxHp: 32800, res: 126,
    ai: 'lowestDef',
    skills: [
      { name: 'Shadow Jab',   type: 'A1', desc: 'Single-target curse strike.',        cd: 0, fxId: 'dark-shadow-rend', kind: 'attack',     power: 0.95 },
      { name: 'Miasma Wave',  type: 'A2', desc: 'Weaken across the allied line.',     cd: 3, fxId: 'poison-toxic-bloom', kind: 'aoe',      power: 0.58, applyChance: { id: 'weaken', chance: 0.45, turns: 2 } },
      { name: 'Dark Shelter', type: 'A3', desc: 'Wraps itself in a shield.',          cd: 4, fxId: 'void-abyssal-shelter', kind: 'selfShield', shieldPct: 0.18 },
    ],
  },
]

export const STATUS_META = {
  weaken:  { icon: '◇', label: 'Weaken',        kind: 'debuff', short: 'WEAK' },
  defDown: { icon: '⬟', label: 'Decrease DEF',  kind: 'debuff', short: 'DEF↓' },
  defUp:   { icon: '⬟', label: 'Increase DEF',  kind: 'buff',   short: 'DEF↑' },
  bleed:   { icon: '†', label: 'Bleed',         kind: 'debuff', short: 'BLEED' },
  shield:  { icon: '◈', label: 'Shield',        kind: 'buff',   short: 'SHIELD' },
  marked:  { icon: '✥', label: 'Marked',        kind: 'debuff', short: 'MARK' },
  speedUp: { icon: '➤', label: 'Speed Up',      kind: 'buff',   short: 'SPD↑' },
}

export const PALETTE = {
  ally: '180,80,106', enemy: '154,74,84', support: '79,125,115',
  magic: '82,98,138', gold: '201,166,101',
}
