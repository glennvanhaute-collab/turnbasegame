import { GearItem, GearType } from '../Gear.js'
import { Rarity } from '../Hero.js'

export const GEAR_CATALOG = [

  // ── SHIELDS ───────────────────────────────────────────────────────
  new GearItem({
    id: 'wooden_shield', name: 'Wooden Shield',
    gearType: GearType.SHIELD,
    rarity: Rarity.COMMON,
    description: 'Basic protection. Small DEF bonus.',
    stats: { def: 100 },
  }),

  new GearItem({
    id: 'iron_shield', name: 'Iron Shield',
    gearType: GearType.SHIELD,
    rarity: Rarity.UNCOMMON,
    description: 'Sturdy iron construction. DEF and HP.',
    stats: { def: 160, hp: 800 },
  }),

  new GearItem({
    id: 'knights_bulwark', name: "Knight's Bulwark",
    gearType: GearType.SHIELD,
    rarity: Rarity.RARE,
    description: 'A tower shield. Significant DEF, HP, and passive damage reduction.',
    stats: { defPct: 0.15, hp: 1500 },
  }),

  new GearItem({
    id: 'enchanted_aegis', name: 'Enchanted Aegis',
    gearType: GearType.SHIELD,
    rarity: Rarity.EPIC,
    description: 'Magic-infused buckler. DEF, HP, and resistance.',
    stats: { defPct: 0.20, hpPct: 0.10, resistance: 0.08 },
  }),

  new GearItem({
    id: 'dragon_shield', name: 'Dragon Shield',
    gearType: GearType.SHIELD,
    rarity: Rarity.LEGENDARY,
    description: 'Forged from dragon scales. Maximum defensive power.',
    stats: { defPct: 0.30, hpPct: 0.15, resistance: 0.12 },
  }),

  // ── HELMETS ───────────────────────────────────────────────────────
  new GearItem({
    id: 'iron_helm', name: 'Iron Helm',
    gearType: GearType.HELMET,
    rarity: Rarity.COMMON,
    description: 'Simple iron helmet.',
    stats: { def: 80, hp: 400 },
  }),

  new GearItem({
    id: 'mage_hood', name: 'Mage Hood',
    gearType: GearType.HELMET,
    rarity: Rarity.UNCOMMON,
    description: 'Arcane-weaved hood. ATK% and resistance.',
    stats: { atkPct: 0.08, resistance: 0.05 },
  }),

  new GearItem({
    id: 'champions_helm', name: "Champion's Helm",
    gearType: GearType.HELMET,
    rarity: Rarity.RARE,
    description: 'Veteran fighter\'s helm. Balanced HP and DEF.',
    stats: { hpPct: 0.10, def: 120 },
  }),

  new GearItem({
    id: 'shadow_cowl', name: 'Shadow Cowl',
    gearType: GearType.HELMET,
    rarity: Rarity.EPIC,
    description: 'Assassin\'s hood. SPD, crit rate, and accuracy.',
    stats: { spd: 8, critRate: 0.06, accuracy: 0.08 },
  }),

  // ── ARMOR ─────────────────────────────────────────────────────────
  new GearItem({
    id: 'leather_vest', name: 'Leather Vest',
    gearType: GearType.ARMOR,
    rarity: Rarity.COMMON,
    description: 'Light armor. HP bonus.',
    stats: { hp: 600 },
  }),

  new GearItem({
    id: 'chainmail', name: 'Chainmail',
    gearType: GearType.ARMOR,
    rarity: Rarity.UNCOMMON,
    description: 'Linked rings. DEF and HP.',
    stats: { def: 140, hp: 800 },
  }),

  new GearItem({
    id: 'plate_armor', name: 'Plate Armor',
    gearType: GearType.ARMOR,
    rarity: Rarity.RARE,
    description: 'Full plate. Excellent DEF and HP%.',
    stats: { defPct: 0.12, hpPct: 0.08 },
  }),

  new GearItem({
    id: 'warlord_plate', name: 'Warlord Plate',
    gearType: GearType.ARMOR,
    rarity: Rarity.EPIC,
    description: 'Battle-tested plate. Massive DEF% and HP%.',
    stats: { defPct: 0.22, hpPct: 0.14 },
  }),

  // ── BOOTS ─────────────────────────────────────────────────────────
  new GearItem({
    id: 'leather_boots', name: 'Leather Boots',
    gearType: GearType.BOOTS,
    rarity: Rarity.COMMON,
    description: 'Light footwear. Small SPD bonus.',
    stats: { spd: 5 },
  }),

  new GearItem({
    id: 'swiftboots', name: 'Swiftboots',
    gearType: GearType.BOOTS,
    rarity: Rarity.UNCOMMON,
    description: 'Built for speed.',
    stats: { spd: 10, spdPct: 0.05 },
  }),

  new GearItem({
    id: 'greaves', name: 'Greaves',
    gearType: GearType.BOOTS,
    rarity: Rarity.RARE,
    description: 'Heavy greaves. DEF and moderate SPD.',
    stats: { spd: 6, def: 100 },
  }),

  new GearItem({
    id: 'phantom_steps', name: 'Phantom Steps',
    gearType: GearType.BOOTS,
    rarity: Rarity.EPIC,
    description: 'Ghost-forged boots. High SPD and crit rate.',
    stats: { spdPct: 0.12, spd: 8, critRate: 0.05 },
  }),

  // ── LEGENDARY ─────────────────────────────────────────────────────
  new GearItem({
    id: 'celestial_crown', name: 'Celestial Crown',
    gearType: GearType.HELMET,
    rarity: Rarity.LEGENDARY,
    description: 'Forged from starfall metal. Supreme HP and crit.',
    stats: { hpPct: 0.22, critRate: 0.10, critDmg: 0.25 },
  }),

  new GearItem({
    id: 'dragonhide_armor', name: 'Dragonhide Armor',
    gearType: GearType.ARMOR,
    rarity: Rarity.LEGENDARY,
    description: 'Scales of an elder dragon. Maximum defence and HP.',
    stats: { defPct: 0.28, hpPct: 0.18 },
  }),

  new GearItem({
    id: 'windrider_greaves', name: 'Windrider Greaves',
    gearType: GearType.BOOTS,
    rarity: Rarity.LEGENDARY,
    description: 'Blessed by wind spirits. Unmatched speed and crit.',
    stats: { spdPct: 0.20, spd: 16, critRate: 0.08 },
  }),
]

export const GEAR_BY_ID = Object.fromEntries(GEAR_CATALOG.map(g => [g.id, g]))
