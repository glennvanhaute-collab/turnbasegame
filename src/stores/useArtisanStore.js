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
  const assignedTannerKey     = ref(saved?.assignedTannerKey     ?? null)
  const assignedTailorKey     = ref(saved?.assignedTailorKey     ?? null)
  const assignedCarpenterKey  = ref(saved?.assignedCarpenterKey  ?? null)

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      skillData:             skillData.value,
      assignedForgeSmithKey: assignedForgeSmithKey.value,
      assignedTannerKey:     assignedTannerKey.value,
      assignedTailorKey:     assignedTailorKey.value,
      assignedCarpenterKey:  assignedCarpenterKey.value,
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

  function assignForgeSmith(heroKey) { assignedForgeSmithKey.value = heroKey; _persist() }
  function unassignForgeSmith()      { assignedForgeSmithKey.value = null;    _persist() }

  function assignTanner(heroKey) { assignedTannerKey.value = heroKey; _persist() }
  function unassignTanner()      { assignedTannerKey.value = null;    _persist() }

  function assignTailor(heroKey) { assignedTailorKey.value = heroKey; _persist() }
  function unassignTailor()      { assignedTailorKey.value = null;    _persist() }

  function assignCarpenter(heroKey) { assignedCarpenterKey.value = heroKey; _persist() }
  function unassignCarpenter()      { assignedCarpenterKey.value = null;    _persist() }

  // Speed multipliers: flat +5% base, +3% per relevant skill level
  function smithSpeedMultiplier(heroKey)     { return 1 + 0.05 + getSkillLevel(heroKey, 'blacksmithing')  * 0.03 }
  function tannerSpeedMultiplier(heroKey)    { return 1 + 0.05 + getSkillLevel(heroKey, 'leatherworking') * 0.03 }
  function tailorSpeedMultiplier(heroKey)    { return 1 + 0.05 + getSkillLevel(heroKey, 'tailoring')      * 0.03 }
  function carpenterSpeedMultiplier(heroKey) { return 1 + 0.05 + getSkillLevel(heroKey, 'woodworking')    * 0.03 }

  return {
    skillData,
    assignedForgeSmithKey, assignedTannerKey, assignedTailorKey, assignedCarpenterKey,
    xpForLevel, getSkillLevel, getSkillXp, addSkillXp,
    assignForgeSmith, unassignForgeSmith,
    assignTanner, unassignTanner,
    assignTailor, unassignTailor,
    assignCarpenter, unassignCarpenter,
    smithSpeedMultiplier, tannerSpeedMultiplier, tailorSpeedMultiplier, carpenterSpeedMultiplier,
  }
})
