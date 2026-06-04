import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Hero, Rarity, Faction, Affinity } from '../game/Hero.js'
import { SKILLS } from '../game/data/skills.js'

const STORAGE_KEY = 'player-hero'

// XP needed per level (flat — easy to tune)
const XP_PER_LEVEL = 300

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

  const heroName    = ref(saved?.heroName    ?? null)
  const heroFaction = ref(saved?.heroFaction ?? null)
  const heroAvatar  = ref(saved?.heroAvatar  ?? null)
  const level       = ref(saved?.level       ?? 1)
  const xp          = ref(saved?.xp          ?? 0)

  const isCreated  = computed(() => heroName.value !== null)
  const rarity     = computed(() => rarityFromLevel(level.value))
  const xpProgress = computed(() => xp.value % XP_PER_LEVEL)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      heroName:    heroName.value,
      heroFaction: heroFaction.value,
      heroAvatar:  heroAvatar.value,
      level:       level.value,
      xp:          xp.value,
    }))
  }

  function create(name, faction, avatarId) {
    heroName.value    = name.trim()
    heroFaction.value = faction
    heroAvatar.value  = avatarId
    level.value       = 1
    xp.value          = 0
    persist()
  }

  // Returns how many levels were gained
  function addXp(amount) {
    if (!isCreated.value) return 0
    let gained = 0
    xp.value += amount
    while (xp.value >= XP_PER_LEVEL) {
      xp.value -= XP_PER_LEVEL
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
      skills:   [SKILLS.CRUDE_SWING, SKILLS.FORTIFY, SKILLS.PATCH_UP],
      isPlayer: true,
    })
    // Extra fields for UI display (not part of Hero class formally)
    hero.level             = lv
    hero.xp                = xp.value
    hero.xpToNext          = XP_PER_LEVEL
    hero.isPlayerCharacter = true
    hero.avatarId          = heroAvatar.value
    return hero
  }

  return {
    heroName, heroFaction, heroAvatar, level, xp,
    isCreated, rarity, xpProgress,
    XP_PER_LEVEL,
    PLAYER_FACTIONS: [Faction.ALDRIC, Faction.VALDRIS, Faction.CAELWYN, Faction.MORDAINE],
    HOUSE_META,
    create, addXp, xpForDifficulty, buildHeroInstance, levelMultiplier,
  }
})
