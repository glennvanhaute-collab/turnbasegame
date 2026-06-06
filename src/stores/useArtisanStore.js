import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'raid-artisan'
function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useArtisanStore = defineStore('artisan', () => {
  const saved = loadSaved()

  // { [heroKey]: { [skillId]: { level: number, xp: number } } }
  const skillData             = ref(saved?.skillData ?? {})
  const assignedForgeSmithKey = ref(saved?.assignedForgeSmithKey ?? null)

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      skillData: skillData.value,
      assignedForgeSmithKey: assignedForgeSmithKey.value,
    }))
  }

  // XP needed to advance FROM this level: level * 100
  function xpForLevel(level) { return level * 100 }

  function getSkillLevel(heroKey, skillId) {
    return skillData.value[heroKey]?.[skillId]?.level ?? 1
  }

  function getSkillXp(heroKey, skillId) {
    return skillData.value[heroKey]?.[skillId]?.xp ?? 0
  }

  function addSkillXp(heroKey, skillId, amount) {
    if (!skillData.value[heroKey]) skillData.value[heroKey] = {}
    if (!skillData.value[heroKey][skillId]) skillData.value[heroKey][skillId] = { level: 1, xp: 0 }
    const sd = skillData.value[heroKey][skillId]
    sd.xp += amount
    while (sd.xp >= xpForLevel(sd.level)) {
      sd.xp -= xpForLevel(sd.level)
      sd.level++
    }
    skillData.value = { ...skillData.value }
    _persist()
  }

  function assignForgeSmith(heroKey) {
    assignedForgeSmithKey.value = heroKey
    _persist()
  }

  function unassignForgeSmith() {
    assignedForgeSmithKey.value = null
    _persist()
  }

  // Speed multiplier for a smith assigned to the forge: flat +5% base, +3% per Blacksmithing level
  function smithSpeedMultiplier(heroKey) {
    const level = getSkillLevel(heroKey, 'blacksmithing')
    return 1 + 0.05 + level * 0.03
  }

  return {
    skillData, assignedForgeSmithKey,
    xpForLevel, getSkillLevel, getSkillXp,
    addSkillXp, assignForgeSmith, unassignForgeSmith,
    smithSpeedMultiplier,
  }
})
