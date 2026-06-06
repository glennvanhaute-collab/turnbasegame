import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { HERO_TEMPLATES, STARTER_KEYS } from '../game/data/heroes.js'
import { applyBonds } from '../game/data/bonds.js'
import { Rarity, Faction, Affinity } from '../game/Hero.js'
import { useInventoryStore } from './useInventoryStore.js'
import { usePlayerHeroStore, RARITY_FLOOR_LEVEL, multiplierForLevel } from './usePlayerHeroStore.js'

const MAX_TEAM_SIZE = 5
const STORAGE_KEY = 'raid-collection'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useCollectionStore = defineStore('collection', () => {
  const saved = loadSaved()

  const playerHero = usePlayerHeroStore()

  // Allow 'PLAYER_CHARACTER' through even though it's not in HERO_TEMPLATES
  const validSaved = (saved?.ownedKeys ?? []).filter(k =>
    k in HERO_TEMPLATES || (k === 'PLAYER_CHARACTER' && playerHero.isCreated)
  )

  const starterChosen = ref(saved?.starterChosen ?? (validSaved.length > 0))
  const ownedKeys = ref(starterChosen.value ? (validSaved.length > 0 ? validSaved : [...STARTER_KEYS]) : [])

  const team = ref((saved?.team ?? []).filter(k => ownedKeys.value.includes(k)))

  // Always ensure the player character is present if they've been created
  if (playerHero.isCreated && !ownedKeys.value.includes('PLAYER_CHARACTER')) {
    ownedKeys.value = ['PLAYER_CHARACTER', ...ownedKeys.value]
  }
  if (playerHero.isCreated && !team.value.includes('PLAYER_CHARACTER')) {
    team.value = ['PLAYER_CHARACTER', ...team.value]
  }
  const filterFaction = ref('')
  const filterRarity = ref('')
  const filterAffinity = ref('')
  const searchText = ref('')
  const sortBy = ref('rarity')   // 'rarity' | 'bp'
  const detailHeroKey = ref(null)

  const roster = computed(() =>
    ownedKeys.value.map(key => {
      if (key === 'PLAYER_CHARACTER') {
        if (!playerHero.isCreated) return null
        return { key, hero: playerHero.buildHeroInstance() }
      }
      if (!(key in HERO_TEMPLATES)) return null
      return { key, hero: HERO_TEMPLATES[key]() }
    }).filter(Boolean)
  )

  const RARITY_RANK = { Ancient: -1, Mythical: 0, Legendary: 1, Epic: 2, Rare: 3, Uncommon: 4, Common: 5 }

  const filteredRoster = computed(() => {
    const inventory = useInventoryStore()
    return roster.value
      .filter(({ hero }) => {
        if (filterFaction.value && hero.faction !== filterFaction.value) return false
        if (filterRarity.value && hero.rarity !== filterRarity.value) return false
        if (filterAffinity.value && hero.affinity !== filterAffinity.value) return false
        if (searchText.value && !hero.name.toLowerCase().includes(searchText.value.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        const teamA = team.value.includes(a.key) ? 0 : 1
        const teamB = team.value.includes(b.key) ? 0 : 1
        if (teamA !== teamB) return teamA - teamB
        if (sortBy.value === 'bp') {
          return inventory.heroCP(b.key) - inventory.heroCP(a.key)
        }
        return (RARITY_RANK[a.hero.rarity] ?? 6) - (RARITY_RANK[b.hero.rarity] ?? 6)
      })
  })

  const teamEntries = computed(() => team.value.map(key => roster.value.find(r => r.key === key)))
  const isFull  = computed(() => team.value.length >= MAX_TEAM_SIZE)
  const isReady = computed(() => team.value.length > 0)

  const detailEntry = computed(() =>
    detailHeroKey.value ? roster.value.find(r => r.key === detailHeroKey.value) : null
  )

  function claimStarterHero(key) {
    ownedKeys.value = [key]
    starterChosen.value = true
  }

  function ownsHero(key) { return ownedKeys.value.includes(key) }

  function addToRoster(key) {
    if (!ownedKeys.value.includes(key)) ownedKeys.value = [...ownedKeys.value, key]
  }

  function isInTeam(key) {
    return team.value.includes(key)
  }

  function toggleTeam(key) {
    if (isInTeam(key)) {
      team.value = team.value.filter(k => k !== key)
    } else if (!isFull.value) {
      team.value = [...team.value, key]
    }
  }

  function removeFromTeam(key) {
    team.value = team.value.filter(k => k !== key)
  }

  function moveUp(index) {
    if (index === 0) return
    const arr = [...team.value]
    ;[arr[index - 1], arr[index]] = [arr[index], arr[index - 1]]
    team.value = arr
  }

  function moveDown(index) {
    if (index === team.value.length - 1) return
    const arr = [...team.value]
    ;[arr[index], arr[index + 1]] = [arr[index + 1], arr[index]]
    team.value = arr
  }

  function openDetail(key) { detailHeroKey.value = key }
  function closeDetail()   { detailHeroKey.value = null }

  watch([ownedKeys, team, starterChosen], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ownedKeys: ownedKeys.value,
      team: team.value,
      starterChosen: starterChosen.value,
    }))
  }, { deep: true })

  function unlockAll() {
    const allKeys = Object.keys(HERO_TEMPLATES)
    for (const key of allKeys) {
      if (!ownedKeys.value.includes(key)) ownedKeys.value = [...ownedKeys.value, key]
    }
  }

  function addPlayerCharacter() {
    if (!ownedKeys.value.includes('PLAYER_CHARACTER')) {
      ownedKeys.value = ['PLAYER_CHARACTER', ...ownedKeys.value]
    }
    if (!team.value.includes('PLAYER_CHARACTER')) {
      team.value = ['PLAYER_CHARACTER', ...team.value]
    }
    starterChosen.value = true   // Bob is the starter — skip StarterPickView
  }

  // Provide fresh Hero instances for battle with gear applied
  function buildTeam() {
    const inventory = useInventoryStore()
    return team.value.map(key => {
      const hero = key === 'PLAYER_CHARACTER'
        ? playerHero.buildHeroInstance()
        : HERO_TEMPLATES[key]?.()
      if (!hero) return null
      // Soul Vessel: scale stats alongside player hero's level
      if (key !== 'PLAYER_CHARACTER' && inventory.isProgressive(key)) {
        const floorLevel      = RARITY_FLOOR_LEVEL[hero.rarity] ?? 1
        const floorMultiplier = multiplierForLevel(floorLevel)
        const effectiveMult   = Math.max(playerHero.levelMultiplier, floorMultiplier)
        hero.applyLevelScale(effectiveMult)
      }
      const { stats, damageReduction, activePassives } = inventory.computeGearStats(key)
      hero.applyGear(stats, damageReduction)
      hero.passives = activePassives ?? new Set()
      return hero
    }).filter(Boolean)
    applyBonds(heroes)
    return heroes
  }

  return {
    ownedKeys, roster, filteredRoster, team, teamEntries,
    filterFaction, filterRarity, filterAffinity, searchText, sortBy,
    isFull, isReady, detailEntry,
    MAX_TEAM_SIZE,
    FACTIONS: Object.values(Faction),
    RARITIES: Object.values(Rarity),
    AFFINITIES: Object.values(Affinity),
    starterChosen, claimStarterHero,
    ownsHero, addToRoster, addPlayerCharacter, unlockAll,
    isInTeam, toggleTeam, removeFromTeam, moveUp, moveDown,
    openDetail, closeDetail, buildTeam,
  }
})
