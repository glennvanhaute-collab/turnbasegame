import { GEAR_CATALOG } from './gear.js'
import { HERO_TEMPLATES } from './heroes.js'
import { createItemInstance, addLineToItem, LineType } from '../Gear.js'
import { Rarity } from '../Hero.js'

const NAMES = {
  Easy:      ['Crypt of Ash', 'Goblin Warrens', 'Rotted Cellar', 'Bandit Cave', 'Mossy Catacombs', 'The Hollow Den'],
  Medium:    ['Ashveil Mine', 'Thornwood Depths', 'Ruins of Vel', 'The Sunken Fort', "Deserter's Hollow", 'The Old Watchtower'],
  Hard:      ['Thornhaven Ruins', 'The Dread Spire', 'Ignar Outpost', "Warlord's Tomb", 'The Crimson Hold', 'Shattered Ramparts'],
  Nightmare: ["The Barrow King's Tomb", 'Siege of the Risen Dead', 'The Bonecrypt', 'Necropolis of Valdris', 'The Wailing Crypts', 'Citadel of the Forsaken'],
}

// Serialisable enemy pool registry — key stored in dungeon card
export const DUNGEON_ENEMY_POOLS = {
  easy_1: [HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  easy_2: [HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  easy_3: [HERO_TEMPLATES.KARG, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  med_1:  [HERO_TEMPLATES.KARG, HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
  med_2:  [HERO_TEMPLATES.IGNAR_CULTIST, HERO_TEMPLATES.BLOODTUSK_RAIDER, HERO_TEMPLATES.BLOODTUSK_RAIDER],
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
  easy_3: 'Karg + Raider',
  med_1:  'Karg + 2 Raiders',
  med_2:  'Ignar Cultist + 2 Raiders',
  med_3:  'Karg + Ignar Cultist',
  hard_1: 'Ignar Cultist, Karg, Raider',
  hard_2: 'Carnax + Cultist',
  hard_3: '2 Cultists + Karg',
  nm_1:   'Barrow Knight + Skeleton + Zombie',
  nm_2:   'Lich Sovereign + 2 Skeleton Warriors',
  nm_3:   'Barrow Knight + 2 Zombie Brutes',
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
  Easy:      'Common / Uncommon',
  Medium:    'Uncommon / Rare',
  Hard:      'Rare / Epic',
  Nightmare: 'Legendary + Lines',
}

export const DUNGEON_REWARDS = {
  Easy:      { gold: 300,  diamonds: 0  },
  Medium:    { gold: 600,  diamonds: 5  },
  Hard:      { gold: 1000, diamonds: 10 },
  Nightmare: { gold: 2000, diamonds: 30 },
}

export const TIER_DIFFICULTY = {
  Easy:      'Easy',
  Medium:    'Normal',
  Hard:      'Hard',
  Nightmare: 'Nightmare',
}

// Discovery line value ranges
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
const PCT_STATS = new Set(['atkPct', 'defPct', 'hpPct', 'spdPct', 'critRate', 'critDmg', 'resistance', 'accuracy'])

function rollDiscoveryLine() {
  return rollLine(false)
}

// Exported so the forge system can re-roll lines.
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
  const count = (tier === 'Nightmare')
    ? (Math.random() < 0.5 ? 2 : 1)
    : (Math.random() < 0.30 ? 2 : 1)

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

const NIGHTMARE_CHANCE = 0.12
const FORGE_CHANCE     = 0.01   // slot 3 only
const BLESSED_CHANCE   = 0.01   // slot 3 only

const NODE_NAMES = {
  forge:   ['Ancient Forge', 'The Ironbound Hearth', "Runesmith's Anvil", 'The Ember Forge', 'Ashen Smithy'],
  blessed: ['Well of Elune', 'Sacred Grove', 'Shrine of the Fallen', 'The Moonlit Pool', 'Hallowed Spring'],
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

function rollSlot3() {
  const r = Math.random()
  if (r < FORGE_CHANCE)                          return { nodeType: 'forge' }
  if (r < FORGE_CHANCE + BLESSED_CHANCE)         return { nodeType: 'blessed' }
  if (r < FORGE_CHANCE + BLESSED_CHANCE + NIGHTMARE_CHANCE) return { dungeon: 'Nightmare' }
  return { dungeon: 'Hard' }
}

export function generateDungeonOptions() {
  const slot3 = rollSlot3()

  return ['Easy', 'Medium', 'Hard'].map((tier, i) => {
    if (i === 2 && slot3.nodeType) {
      // Slot 3 is a discovery node
      return {
        id: uid(),
        name: pick(NODE_NAMES[slot3.nodeType]),
        nodeType: slot3.nodeType,
        isNode: true,
        isDungeon: false,
        pinned: false,
      }
    }
    const t = (i === 2 && slot3.dungeon === 'Nightmare') ? 'Nightmare' : tier
    const enemyPoolId = pick(POOLS_BY_TIER[t])
    return {
      id: uid(),
      name: pick(NAMES[t]),
      tier: t,
      enemyPoolId,
      rewards: DUNGEON_REWARDS[t],
      difficulty: TIER_DIFFICULTY[t],
      isDungeon: true,
      isNode: false,
      pinned: false,
    }
  })
}

export function buildDungeonEncounter(dungeon) {
  return {
    id: dungeon.id,
    name: dungeon.name,
    difficulty: dungeon.difficulty,
    enemies: DUNGEON_ENEMY_POOLS[dungeon.enemyPoolId] ?? DUNGEON_ENEMY_POOLS.easy_1,
    rewards: dungeon.rewards,
    isDungeon: true,
    dungeonId: dungeon.id,
  }
}
