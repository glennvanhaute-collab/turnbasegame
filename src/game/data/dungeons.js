import { GEAR_CATALOG } from './gear.js'
import { HERO_TEMPLATES, RECRUIT_POOL } from './heroes.js'
import { CITY_DATA, CITY_FACTIONS } from './cities.js'
import { createItemInstance, addLineToItem, LineType } from '../Gear.js'
import { Rarity } from '../Hero.js'

const NAMES = {
  Easy:      ['Crypt of Ash', 'Goblin Warrens', 'Rotted Cellar', 'Bandit Cave', 'Mossy Catacombs', 'The Hollow Den', 'The Undead Crypt', 'The Desolate Swamp'],
  Medium:    ['Ashveil Mine', 'Thornwood Depths', 'Ruins of Vel', 'The Sunken Fort', "Deserter's Hollow", 'The Old Watchtower', 'The Forgotten Lair'],
  Hard:      ['Thornhaven Ruins', 'The Dread Spire', 'Ignar Outpost', "Warlord's Tomb", 'The Crimson Hold', 'Shattered Ramparts', "The Vampire's Keep"],
  Nightmare: ["The Barrow King's Tomb", 'Siege of the Risen Dead', 'The Bonecrypt', 'Necropolis of Valdris', 'The Wailing Crypts', 'Citadel of the Forsaken'],
}

// Serialisable enemy pool registry — key stored in dungeon card
export const DUNGEON_ENEMY_POOLS = {
  easy_1: [HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  easy_2: [HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  easy_3: [HERO_TEMPLATES.KARG, HERO_TEMPLATES.BLOODRAIDER_TUSK],
  med_1:  [HERO_TEMPLATES.KARG, HERO_TEMPLATES.BLOODRAIDER_TUSK, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  med_2:  [HERO_TEMPLATES.IGNAR_CULTIST, HERO_TEMPLATES.BLOODRAIDER_TUSK, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  med_3:  [HERO_TEMPLATES.KARG, HERO_TEMPLATES.IGNAR_CULTIST],
  hard_1: [HERO_TEMPLATES.IGNAR_CULTIST, HERO_TEMPLATES.KARG, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  hard_2: [HERO_TEMPLATES.CARNAX, HERO_TEMPLATES.IGNAR_CULTIST],
  hard_3: [HERO_TEMPLATES.IGNAR_CULTIST, HERO_TEMPLATES.IGNAR_CULTIST, HERO_TEMPLATES.KARG],
  nm_1:   [HERO_TEMPLATES.BARROW_KNIGHT, HERO_TEMPLATES.SKELETON_WARRIOR, HERO_TEMPLATES.ZOMBIE_BRUTE],
  nm_2:   [HERO_TEMPLATES.LICH_SOVEREIGN, HERO_TEMPLATES.SKELETON_WARRIOR, HERO_TEMPLATES.SKELETON_WARRIOR],
  nm_3:   [HERO_TEMPLATES.BARROW_KNIGHT, HERO_TEMPLATES.ZOMBIE_BRUTE, HERO_TEMPLATES.ZOMBIE_BRUTE],
}

// Human-readable enemy label per pool
export const POOL_LABELS = {
  easy_1: '3× Bloodtusk Raiders',
  easy_2: '2× Bloodtusk Raiders',
  easy_3: 'Karg + Bloodraider Tusk',
  med_1:  'Karg + Bloodraider Tusk + Raider',
  med_2:  'Ignar Cultist + Bloodraider Tusk + Raider',
  med_3:  'Karg + Ignar Cultist',
  hard_1: 'Ignar Cultist, Karg, Raider',
  hard_2: 'Carnax + Cultist',
  hard_3: '2 Cultists + Karg',
  nm_1:   'Barrow Knight + Skeleton + Zombie',
  nm_2:   'Lich Sovereign + 2 Skeleton Warriors',
  nm_3:   'Barrow Knight + 2 Zombie Brutes',
}

// Dungeon mechanics per pool — passive rules that fire during battle
const POOL_MECHANICS = {
  nm_1: ['undead_regen'],
  nm_2: ['revival', 'undead_regen'],
  nm_3: ['undead_regen'],
}

// Short warning shown on the dungeon card
export const POOL_MECHANIC_HINTS = {
  nm_1: ['☠ Undead regenerate 4% HP per turn — bring DPS'],
  nm_2: ['☠ Undead regenerate 4% HP per turn', '⚠ Lich Sovereign revives once at 30% HP — burst through it'],
  nm_3: ['☠ Undead regenerate 4% HP per turn — bring DPS'],
}

const POOLS_BY_TIER = {
  Easy:      ['easy_1', 'easy_2', 'easy_3'],
  Medium:    ['med_1',  'med_2',  'med_3'],
  Hard:      ['hard_1', 'hard_2', 'hard_3'],
  Nightmare: ['nm_1',   'nm_2',   'nm_3'],
}

// Build gear pool by rarity from catalog
const GEAR_POOL_BY_RARITY = (() => {
  const pools = {}
  for (const item of GEAR_CATALOG) {
    if (!pools[item.rarity]) pools[item.rarity] = []
    pools[item.rarity].push(item)
  }
  return pools
})()

const LOOT_WEIGHTS = {
  Easy:      { [Rarity.COMMON]: 65, [Rarity.UNCOMMON]: 35 },
  Medium:    { [Rarity.UNCOMMON]: 55, [Rarity.RARE]: 45 },
  Hard:      { [Rarity.RARE]: 60, [Rarity.EPIC]: 40 },
  Nightmare: { [Rarity.LEGENDARY]: 100 },
}

export const LOOT_LABEL = {
  Easy:      'Common / Uncommon · Copper & Tin Ore & Essence',
  Medium:    'Uncommon / Rare · Steel Ore & Essence',
  Hard:      'Rare / Epic · Darksteel Ore & Essence',
  Nightmare: 'Legendary + Lines · Mithril Ore & Essence',
}

export const DUNGEON_REWARDS = {
  Easy:      { gold: 0, diamonds: 0  },
  Medium:    { gold: 0, diamonds: 5  },
  Hard:      { gold: 0, diamonds: 10 },
  Nightmare: { gold: 0, diamonds: 30 },
}

// Keys required to enter dungeons — one type per tier
export const DUNGEON_KEY_TIERS = {
  Easy:      'easy',
  Medium:    'medium',
  Hard:      'hard',
  Nightmare: 'nightmare',
}

export const DUNGEON_KEY_NAMES = {
  easy:      'Copper Key',
  medium:    'Iron Key',
  hard:      'Darksteel Key',
  nightmare: 'Void Key',
}

export const DUNGEON_KEY_COLORS = {
  easy:      '#cd7f32',
  medium:    '#4fa8ff',
  hard:      '#7c5cbf',
  nightmare: '#cc44ff',
}

export const TIER_DIFFICULTY = {
  Easy:      'Easy',
  Medium:    'Normal',
  Hard:      'Hard',
  Nightmare: 'Nightmare',
}

// Static dungeon list — always available, gated by keys
export const DUNGEON_LIST = [
  { id: 'dng_goblin_warrens',        name: 'Goblin Warrens',           tier: 'Easy',      enemyPoolId: 'easy_1' },
  { id: 'dng_crypt_of_ash',          name: 'Crypt of Ash',             tier: 'Easy',      enemyPoolId: 'easy_2' },
  { id: 'dng_bandit_cave',           name: 'Bandit Cave',              tier: 'Easy',      enemyPoolId: 'easy_3' },
  { id: 'dng_ashveil_mine',          name: 'Ashveil Mine',             tier: 'Medium',    enemyPoolId: 'med_1' },
  { id: 'dng_thornwood_depths',      name: 'Thornwood Depths',         tier: 'Medium',    enemyPoolId: 'med_2' },
  { id: 'dng_ruins_of_vel',          name: 'Ruins of Vel',             tier: 'Medium',    enemyPoolId: 'med_3' },
  { id: 'dng_thornhaven_ruins',      name: 'Thornhaven Ruins',         tier: 'Hard',      enemyPoolId: 'hard_1' },
  { id: 'dng_the_dread_spire',       name: 'The Dread Spire',          tier: 'Hard',      enemyPoolId: 'hard_2' },
  { id: 'dng_the_crimson_hold',      name: 'The Crimson Hold',         tier: 'Hard',      enemyPoolId: 'hard_3' },
  { id: 'dng_barrow_kings_tomb',     name: "The Barrow King's Tomb",   tier: 'Nightmare', enemyPoolId: 'nm_1' },
  { id: 'dng_necropolis_of_valdris', name: 'Necropolis of Valdris',    tier: 'Nightmare', enemyPoolId: 'nm_2' },
  { id: 'dng_the_wailing_crypts',    name: 'The Wailing Crypts',       tier: 'Nightmare', enemyPoolId: 'nm_3' },
].map(d => ({
  ...d,
  rewards:    DUNGEON_REWARDS[d.tier],
  difficulty: TIER_DIFFICULTY[d.tier],
  isDungeon:  true,
  isNode:     false,
  pinned:     false,
}))

// Discovery line value ranges (dungeon drops, unchanged)
const LINE_RANGES = {
  atk:      { min: 80,   max: 150  },
  atkPct:   { min: 0.04, max: 0.10 },
  def:      { min: 60,   max: 100  },
  hp:       { min: 500,  max: 1200 },
  spd:      { min: 3,    max: 7    },
  critRate: { min: 0.02, max: 0.05 },
  critDmg:  { min: 0.06, max: 0.12 },
}
const LINE_STAT_KEYS = Object.keys(LINE_RANGES)
const PCT_STATS = new Set(['atkPct', 'defPct', 'hpPct', 'spdPct', 'critRate', 'critDmg', 'resistance', 'accuracy', 'siegeDmg', 'raidDmg'])

function rollDiscoveryLine() {
  return rollLine(false)
}

// Exported so the forge system can re-roll discovery lines.
// prime=true biases each roll to the upper 30% of the range (Master Cube behaviour).
export function rollLine(prime = false) {
  const stat = pick(LINE_STAT_KEYS)
  const { min, max } = LINE_RANGES[stat]
  const rng = prime ? 0.7 + Math.random() * 0.3 : Math.random()
  let val = min + rng * (max - min)
  val = PCT_STATS.has(stat)
    ? Math.round(val * 1000) / 1000
    : Math.round(val)
  const label = PCT_STATS.has(stat)
    ? `+${Math.round(val * 100)}% ${stat.replace('Pct', '').toUpperCase()}`
    : `+${val} ${stat.toUpperCase()}`
  return { type: LineType.DISCOVERY, label, bonus: { [stat]: val }, source: 'cube', earnedAt: Date.now() }
}

// ── Potential system line ranges (scale per tier) ────────────────────────
// Each tier unlocks better stat ceilings. ATK scales aggressively since
// the user noted damage numbers feel low at endgame.
export const POTENTIAL_TIER_RANGES = {
  rare: {
    atk:      { min: 80,   max: 180  },
    atkPct:   { min: 0.04, max: 0.12 },
    def:      { min: 60,   max: 110  },
    hp:       { min: 600,  max: 1400 },
    spd:      { min: 3,    max: 8    },
    critRate: { min: 0.02, max: 0.05 },
    critDmg:  { min: 0.06, max: 0.13 },
    siegeDmg: { min: 0.03, max: 0.07 },
    raidDmg:  { min: 0.03, max: 0.07 },
  },
  epic: {
    atk:      { min: 140,  max: 300  },
    atkPct:   { min: 0.07, max: 0.18 },
    def:      { min: 100,  max: 190  },
    hp:       { min: 1000, max: 2400 },
    spd:      { min: 5,    max: 13   },
    critRate: { min: 0.03, max: 0.08 },
    critDmg:  { min: 0.10, max: 0.20 },
    siegeDmg: { min: 0.05, max: 0.11 },
    raidDmg:  { min: 0.05, max: 0.11 },
  },
  unique: {
    atk:      { min: 220,  max: 460  },
    atkPct:   { min: 0.11, max: 0.26 },
    def:      { min: 160,  max: 300  },
    hp:       { min: 1600, max: 3800 },
    spd:      { min: 8,    max: 19   },
    critRate: { min: 0.05, max: 0.11 },
    critDmg:  { min: 0.15, max: 0.30 },
    siegeDmg: { min: 0.08, max: 0.17 },
    raidDmg:  { min: 0.08, max: 0.17 },
  },
  legendary: {
    atk:      { min: 340,  max: 700  },
    atkPct:   { min: 0.17, max: 0.38 },
    def:      { min: 240,  max: 460  },
    hp:       { min: 2400, max: 5800 },
    spd:      { min: 12,   max: 26   },
    critRate: { min: 0.07, max: 0.15 },
    critDmg:  { min: 0.22, max: 0.45 },
    siegeDmg: { min: 0.13, max: 0.25 },
    raidDmg:  { min: 0.13, max: 0.25 },
  },
}

const POTENTIAL_STAT_LABEL = {
  atk:      v => `+${v} ATK`,
  atkPct:   v => `+${Math.round(v * 100)}% ATK`,
  def:      v => `+${v} DEF`,
  hp:       v => `+${v} HP`,
  spd:      v => `+${v} SPD`,
  critRate: v => `+${Math.round(v * 100)}% Crit Rate`,
  critDmg:  v => `+${Math.round(v * 100)}% Crit DMG`,
  siegeDmg: v => `+${Math.round(v * 100)}% Siege DMG`,
  raidDmg:  v => `+${Math.round(v * 100)}% Raid DMG`,
}

// Rolls one potential line from a tier-specific pool.
// prime=true (Magnificent Orb behaviour) biases rolls to the upper 30%.
export function rollLineForPotential(potentialTier, prime = false) {
  const ranges = POTENTIAL_TIER_RANGES[potentialTier] ?? POTENTIAL_TIER_RANGES.rare
  const stats  = Object.keys(ranges)
  const stat   = pick(stats)
  const { min, max } = ranges[stat]
  const rng = prime ? 0.7 + Math.random() * 0.3 : Math.random()
  let val = min + rng * (max - min)
  val = PCT_STATS.has(stat) ? Math.round(val * 1000) / 1000 : Math.round(val)
  const label = (POTENTIAL_STAT_LABEL[stat] ?? (v => `+${v} ${stat}`))(val)
  return { type: LineType.POTENTIAL, label, bonus: { [stat]: val }, source: 'potential', earnedAt: Date.now() }
}

// Line count per potential tier
export const POTENTIAL_LINE_COUNT = { rare: 2, epic: 3, unique: 3, legendary: 3 }

// Rank-up path
export const POTENTIAL_NEXT_TIER = { rare: 'epic', epic: 'unique', unique: 'legendary', legendary: null }

export const POTENTIAL_TIER_COLORS = {
  rare:      '#4dff88',
  epic:      '#b44fff',
  unique:    '#ffd700',
  legendary: '#ff88ff',
}

export const POTENTIAL_TIER_LABELS = {
  rare:      'Rare Potential',
  epic:      'Epic Potential',
  unique:    'Unique Potential',
  legendary: 'Legendary Potential',
}

function rollRarity(weights) {
  const entries = Object.entries(weights)
  const total = entries.reduce((s, [, w]) => s + w, 0)
  let r = Math.random() * total
  for (const [rarity, w] of entries) {
    r -= w; if (r <= 0) return rarity
  }
  return entries[0][0]
}

export const NIGHTMARE_SLAYER_LINE = {
  type: 'slayer',
  label: '+20% vs Undead',
  bonus: { slayerUndead: 0.20 },
  source: 'nightmare',
}

export function rollDungeonDrops(tier) {
  const weights = LOOT_WEIGHTS[tier]
  let count
  if (tier === 'Nightmare') {
    count = 2 + (Math.random() < 0.65 ? 1 : 0)           // 2 guaranteed + 65% for 3rd
  } else if (tier === 'Hard') {
    count = 2 + (Math.random() < 0.40 ? 1 : 0)           // 2 guaranteed + 40% for 3rd
  } else if (tier === 'Medium') {
    count = 1 + (Math.random() < 0.55 ? 1 : 0)           // 1 guaranteed + 55% for 2nd
  } else {
    count = 1 + (Math.random() < 0.40 ? 1 : 0)           // Easy: 1 + 40% for 2nd
  }

  const drops = []
  for (let i = 0; i < count; i++) {
    const rarity = rollRarity(weights)
    const pool = GEAR_POOL_BY_RARITY[rarity]
    if (!pool?.length) continue
    const instance = createItemInstance(pick(pool))
    if (tier === 'Nightmare') {
      const lineCount = 1 + Math.floor(Math.random() * 3)  // 1–3 discovery lines
      for (let j = 0; j < lineCount; j++) addLineToItem(instance, rollDiscoveryLine())
      // Slayer line is NOT auto-applied — player picks which item gets it in the victory screen
    }
    drops.push(instance)
  }
  return drops
}

let _counter = 0
function uid()  { return `dng_${Date.now()}_${++_counter}` }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

const FORGE_CHANCE   = 0.01
const BLESSED_CHANCE = 0.01
const TAVERN_CHANCE  = 0.08

// Per-slot tier weights — lower tiers roll more often
const TIER_WEIGHTS = [
  { tier: 'Easy',      weight: 45 },
  { tier: 'Medium',    weight: 30 },
  { tier: 'Hard',      weight: 17 },
  { tier: 'Nightmare', weight: 8  },
]
const TIER_WEIGHT_TOTAL = TIER_WEIGHTS.reduce((s, e) => s + e.weight, 0)

function rollTier() {
  let r = Math.random() * TIER_WEIGHT_TOTAL
  for (const { tier, weight } of TIER_WEIGHTS) {
    r -= weight
    if (r <= 0) return tier
  }
  return 'Easy'
}

const CITY_CONFIG = {
  Easy:      { chance: 0.20, rarities: ['Rare'] },
  Medium:    { chance: 0.12, rarities: ['Epic'] },
  Hard:      { chance: 0.08, rarities: ['Legendary'] },
  Nightmare: { chance: 0.08, rarities: ['Legendary'] },
}

const NODE_NAMES = {
  forge:   ['Ancient Forge', 'The Ironbound Hearth', "Runesmith's Anvil", 'The Ember Forge', 'Ashen Smithy'],
  blessed: ['Well of Elune', 'Sacred Grove', 'Shrine of the Fallen', 'The Moonlit Pool', 'Hallowed Spring'],
  tavern:  ["The Wanderer's Rest", 'The Rusty Flagon', 'The Crow & Crown', 'The Saltstone Inn', 'The Broken Compass', 'The Muddy Boot', "The Dead Man's Lantern"],
}

// Stat pools per node type
export const NODE_FORGE_STATS   = ['atk', 'atkPct', 'def', 'defPct', 'hp', 'hpPct', 'spd']
export const NODE_BLESSED_STATS = ['critRate', 'critDmg', 'resistance', 'accuracy']

export function rollNodeLine(nodeType) {
  const statKey = pick(nodeType === 'forge' ? NODE_FORGE_STATS : NODE_BLESSED_STATS)
  const range   = LINE_RANGES[statKey] ?? { min: 0.02, max: 0.06 }
  let val = range.min + Math.random() * (range.max - range.min)
  val = PCT_STATS.has(statKey)
    ? Math.round(val * 1000) / 1000
    : Math.round(val)
  const label = PCT_STATS.has(statKey)
    ? `+${Math.round(val * 100)}% ${statKey.replace('Pct', '').toUpperCase()}`
    : `+${val} ${statKey.toUpperCase()}`
  return { type: LineType.DISCOVERY, label, bonus: { [statKey]: val }, source: nodeType, earnedAt: Date.now() }
}

function pickCityHero(faction, rarities) {
  const eligible = RECRUIT_POOL.filter(e => {
    if (!rarities.includes(e.rarity)) return false
    const hero = HERO_TEMPLATES[e.key]?.()
    return hero && hero.faction === faction
  })
  if (!eligible.length) return null
  return eligible[Math.floor(Math.random() * eligible.length)]
}

function rollCityNode(tier = 'Hard') {
  const cfg = CITY_CONFIG[tier] ?? CITY_CONFIG.Hard
  if (Math.random() >= cfg.chance) return null
  const faction   = CITY_FACTIONS[Math.floor(Math.random() * CITY_FACTIONS.length)]
  const cityInfo  = CITY_DATA[faction]
  const cityName  = cityInfo.cityNames[Math.floor(Math.random() * cityInfo.cityNames.length)]
  const heroEntry = pickCityHero(faction, cfg.rarities)
  if (!heroEntry) return null
  const hero = HERO_TEMPLATES[heroEntry.key]()
  return { nodeType: 'city', faction, cityName, heroKey: heroEntry.key, heroName: hero.name, heroRarity: heroEntry.rarity }
}

function buildCityCard(city) {
  return { id: uid(), name: city.cityName, nodeType: 'city', isNode: true, isDungeon: false, pinned: false,
    faction: city.faction, cityName: city.cityName, heroKey: city.heroKey, heroName: city.heroName, heroRarity: city.heroRarity }
}

// Returns a special node type if one rolls, else null
function rollSpecialNode() {
  const r = Math.random()
  if (r < FORGE_CHANCE)                            return { nodeType: 'forge' }
  if (r < FORGE_CHANCE + BLESSED_CHANCE)           return { nodeType: 'blessed' }
  if (r < FORGE_CHANCE + BLESSED_CHANCE + TAVERN_CHANCE) return { nodeType: 'tavern' }
  return null
}

const NUM_EXPEDITION_SLOTS = 5

export function generateDungeonOptions() {
  const special     = rollSpecialNode()
  const specialSlot = special ? Math.floor(Math.random() * NUM_EXPEDITION_SLOTS) : -1

  return Array.from({ length: NUM_EXPEDITION_SLOTS }, (_, i) => {
    // One slot may become a special discovery node (forge / blessed / tavern)
    if (i === specialSlot) {
      return {
        id: uid(),
        name: pick(NODE_NAMES[special.nodeType]),
        nodeType: special.nodeType,
        isNode: true,
        isDungeon: false,
        pinned: false,
      }
    }

    const tier = rollTier()
    const city = rollCityNode(tier)
    if (city) return buildCityCard(city)

    const enemyPoolId = pick(POOLS_BY_TIER[tier])
    return {
      id: uid(),
      name: pick(NAMES[tier]),
      tier,
      enemyPoolId,
      rewards: DUNGEON_REWARDS[tier],
      difficulty: TIER_DIFFICULTY[tier],
      isDungeon: true,
      isNode: false,
      pinned: false,
    }
  })
}

// Stat multipliers applied to enemy base stats per difficulty tier.
// Easy = raw template stats. Each tier scales HP, ATK, DEF, SPD together.
const ENEMY_SCALE = { Easy: 1.0, Medium: 1.35, Hard: 2.6, Nightmare: 3.0 }

export function buildDungeonEncounter(dungeon) {
  return {
    id: dungeon.id,
    name: dungeon.name,
    tier: dungeon.tier,
    difficulty: dungeon.difficulty,
    enemies:    DUNGEON_ENEMY_POOLS[dungeon.enemyPoolId] ?? DUNGEON_ENEMY_POOLS.easy_1,
    enemyScale: ENEMY_SCALE[dungeon.tier] ?? 1.0,
    mechanics:  POOL_MECHANICS[dungeon.enemyPoolId] ?? [],
    rewards:    dungeon.rewards,
    isDungeon: true,
    dungeonId: dungeon.id,
  }
}
