import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Hero, Rarity, Faction, Affinity } from '../game/Hero.js'
import { SKILLS } from '../game/data/skills.js'
import { ARTISAN } from '../game/data/artisanSkills.js'
import { useArtisanStore } from './useArtisanStore.js'

const STORAGE_KEY = 'player-hero'

// Exponential XP curve (RuneScape / MapleStory feel)
// Each level costs ~6% more than the previous; Mythical takes ~1400 nightmare clears total
function xpForLevel(lv) { return Math.floor(100 * Math.pow(1.06, lv - 1)) }

// XP awarded per battle difficulty
const XP_BY_DIFFICULTY = {
  Easy:      40,
  Normal:    80,
  Hard:     160,
  Brutal:   280,
  Nightmare: 400,
}

// Rarity unlocks at these level thresholds
const RARITY_THRESHOLDS = [
  [101, Rarity.MYTHICAL],
  [61,  Rarity.LEGENDARY],
  [26,  Rarity.EPIC],
  [1,   Rarity.RARE],
]

// Floor level for each rarity — soul-bound heroes scale from at least this level
export const RARITY_FLOOR_LEVEL = {
  [Rarity.RARE]:      1,
  [Rarity.EPIC]:      26,
  [Rarity.LEGENDARY]: 61,
  [Rarity.MYTHICAL]:  101,
}

export function multiplierForLevel(lv) {
  return Math.min(2.5, 1 + (lv - 1) * 0.015)
}

export const HOUSE_AFFINITY = {
  [Faction.ALDRIC]:   Affinity.FORCE,
  [Faction.VALDRIS]:  Affinity.MAGIC,
  [Faction.CAELWYN]:  Affinity.SPIRIT,
  [Faction.MORDAINE]: Affinity.VOID,
}

export const HOUSE_META = {
  [Faction.ALDRIC]: {
    tagline: 'Warriors of the Iron Gate',
    flavor:  'Unyielding defenders. Masters of force and steel.',
    color:   '#ff9944',
    affinityLabel: 'Force',
  },
  [Faction.VALDRIS]: {
    tagline: 'Scholars of the Arcane Tower',
    flavor:  'Seekers of forbidden knowledge. Magic bends to their will.',
    color:   '#4fa8ff',
    affinityLabel: 'Magic',
  },
  [Faction.CAELWYN]: {
    tagline: 'Wardens of the Ancient Grove',
    flavor:  'Guardians of balance. The spirit of nature flows through them.',
    color:   '#4dff88',
    affinityLabel: 'Spirit',
  },
  [Faction.MORDAINE]: {
    tagline: 'Shadowblades of the Dark Spire',
    flavor:  'Walkers between realms. The void answers their call.',
    color:   '#b44fff',
    affinityLabel: 'Void',
  },
}

function rarityFromLevel(lv) {
  for (const [threshold, rarity] of RARITY_THRESHOLDS) {
    if (lv >= threshold) return rarity
  }
  return Rarity.RARE
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const usePlayerHeroStore = defineStore('player-hero', () => {
  const saved = loadSaved()

  const heroName         = ref(saved?.heroName         ?? null)
  const heroFaction      = ref(saved?.heroFaction      ?? null)
  const heroAvatar       = ref(saved?.heroAvatar       ?? null)
  const heroArtisanSkill = ref(saved?.heroArtisanSkill ?? null)
  const level            = ref(saved?.level            ?? 1)
  const xp               = ref(saved?.xp               ?? 0)

  const isCreated  = computed(() => heroName.value !== null)
  const rarity     = computed(() => rarityFromLevel(level.value))
  const xpProgress   = computed(() => xp.value)
  const xpToNextLevel = computed(() => xpForLevel(level.value))

  // Next rarity tier and the level required to unlock it (null when at max)
  const nextUnlock = computed(() => {
    const entry = [...RARITY_THRESHOLDS].reverse().find(([lv]) => lv > level.value)
    return entry ? { level: entry[0], rarity: entry[1] } : null
  })

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      heroName:         heroName.value,
      heroFaction:      heroFaction.value,
      heroAvatar:       heroAvatar.value,
      heroArtisanSkill: heroArtisanSkill.value,
      level:            level.value,
      xp:               xp.value,
    }))
  }

  function create(name, faction, avatarId, artisanSkill) {
    heroName.value         = name.trim()
    heroFaction.value      = faction
    heroAvatar.value       = avatarId
    heroArtisanSkill.value = artisanSkill ?? null
    level.value            = 1
    xp.value               = 0
    persist()

    const artisan = useArtisanStore()
    artisan.unassignForgeSmith()
    artisan.unassignTanner()
    artisan.unassignTailor()
    artisan.unassignCarpenter()
    if (artisanSkill === 'blacksmithing')       artisan.assignForgeSmith('player_character')
    else if (artisanSkill === 'leatherworking') artisan.assignTanner('player_character')
    else if (artisanSkill === 'tailoring')      artisan.assignTailor('player_character')
    else if (artisanSkill === 'woodworking')    artisan.assignCarpenter('player_character')
  }

  // Returns how many levels were gained
  function addXp(amount) {
    if (!isCreated.value) return 0
    let gained = 0
    xp.value += amount
    while (xp.value >= xpForLevel(level.value)) {
      xp.value -= xpForLevel(level.value)
      level.value++
      gained++
    }
    persist()
    return gained
  }

  function xpForDifficulty(difficulty) {
    return XP_BY_DIFFICULTY[difficulty] ?? 60
  }

  // Multiplier applied to base stats of Soul Vessel heroes. Caps at 2.5×.
  const levelMultiplier = computed(() =>
    Math.min(2.5, 1 + (level.value - 1) * 0.015)
  )

  function buildHeroInstance() {
    const lv      = level.value
    const faction = heroFaction.value ?? Faction.ALDRIC
    const hero = new Hero({
      id:       'player_character',
      name:     heroName.value ?? 'Hero',
      faction,
      rarity:   rarity.value,
      affinity: HOUSE_AFFINITY[faction] ?? Affinity.FORCE,
      baseHp:   6000 + (lv - 1) * 200,
      baseAtk:  300  + (lv - 1) * 22,
      baseDef:  220  + (lv - 1) * 12,
      baseSpd:  85   + Math.floor((lv - 1) * 0.5),
      critRate: Math.min(0.5, 0.12 + lv * 0.001),
      critDmg:  0.50 + lv * 0.005,
      skills:        [SKILLS.CRUDE_SWING, SKILLS.FORTIFY, SKILLS.PATCH_UP],
      artisanSkills: heroArtisanSkill.value ? [ARTISAN[heroArtisanSkill.value]].filter(Boolean) : [],
      isPlayer: true,
    })
    // Extra fields for UI display (not part of Hero class formally)
    hero.level             = lv
    hero.xp                = xp.value
    hero.xpToNext          = xpForLevel(lv)
    hero.isPlayerCharacter = true
    hero.avatarId          = heroAvatar.value
    return hero
  }

  return {
    heroName, heroFaction, heroAvatar, heroArtisanSkill, level, xp,
    isCreated, rarity, xpProgress, xpToNextLevel,
    XP_PER_LEVEL: xpToNextLevel,
    PLAYER_FACTIONS: [Faction.ALDRIC, Faction.VALDRIS, Faction.CAELWYN, Faction.MORDAINE],
    HOUSE_META,
    create, addXp, xpForDifficulty, buildHeroInstance, levelMultiplier, nextUnlock,
  }
})
