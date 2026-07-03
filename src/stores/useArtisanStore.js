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
  const assignedForgeSmithKey    = ref(saved?.assignedForgeSmithKey    ?? null)
  const assignedTannerKey        = ref(saved?.assignedTannerKey        ?? null)
  const assignedTailorKey        = ref(saved?.assignedTailorKey        ?? null)
  const assignedCarpenterKey     = ref(saved?.assignedCarpenterKey     ?? null)
  const assignedFusionArcaneKey1  = ref(saved?.assignedFusionArcaneKey1  ?? null)  // req1 (Blacksmithing)
  const assignedFusionArcaneKey2  = ref(saved?.assignedFusionArcaneKey2  ?? null)  // req2 (Tailoring)
  const assignedFusionShadowKey1  = ref(saved?.assignedFusionShadowKey1  ?? null)  // req1 (Leatherworking)
  const assignedFusionShadowKey2  = ref(saved?.assignedFusionShadowKey2  ?? null)  // req2 (Tailoring)
  const assignedFusionTanneryKey1 = ref(saved?.assignedFusionTanneryKey1 ?? null)  // req1 (Blacksmithing)
  const assignedFusionTanneryKey2 = ref(saved?.assignedFusionTanneryKey2 ?? null)  // req2 (Leatherworking)

  function _persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      skillData:                skillData.value,
      assignedForgeSmithKey:    assignedForgeSmithKey.value,
      assignedTannerKey:        assignedTannerKey.value,
      assignedTailorKey:        assignedTailorKey.value,
      assignedCarpenterKey:     assignedCarpenterKey.value,
      assignedFusionArcaneKey1:  assignedFusionArcaneKey1.value,
      assignedFusionArcaneKey2:  assignedFusionArcaneKey2.value,
      assignedFusionShadowKey1:  assignedFusionShadowKey1.value,
      assignedFusionShadowKey2:  assignedFusionShadowKey2.value,
      assignedFusionTanneryKey1: assignedFusionTanneryKey1.value,
      assignedFusionTanneryKey2: assignedFusionTanneryKey2.value,
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

  function assignCarpenter(heroKey)      { assignedCarpenterKey.value = heroKey;     _persist() }
  function unassignCarpenter()           { assignedCarpenterKey.value = null;         _persist() }

  function assignFusionArcane1(heroKey)   { assignedFusionArcaneKey1.value  = heroKey; _persist() }
  function unassignFusionArcane1()        { assignedFusionArcaneKey1.value  = null;    _persist() }
  function assignFusionArcane2(heroKey)   { assignedFusionArcaneKey2.value  = heroKey; _persist() }
  function unassignFusionArcane2()        { assignedFusionArcaneKey2.value  = null;    _persist() }
  function assignFusionShadow1(heroKey)   { assignedFusionShadowKey1.value  = heroKey; _persist() }
  function unassignFusionShadow1()        { assignedFusionShadowKey1.value  = null;    _persist() }
  function assignFusionShadow2(heroKey)   { assignedFusionShadowKey2.value  = heroKey; _persist() }
  function unassignFusionShadow2()        { assignedFusionShadowKey2.value  = null;    _persist() }
  function assignFusionTannery1(heroKey)  { assignedFusionTanneryKey1.value = heroKey; _persist() }
  function unassignFusionTannery1()       { assignedFusionTanneryKey1.value = null;    _persist() }
  function assignFusionTannery2(heroKey)  { assignedFusionTanneryKey2.value = heroKey; _persist() }
  function unassignFusionTannery2()       { assignedFusionTanneryKey2.value = null;    _persist() }

  // Speed multipliers: flat +5% base, +3% per relevant skill level
  function smithSpeedMultiplier(heroKey)     { return 1 + 0.05 + getSkillLevel(heroKey, 'blacksmithing')  * 0.03 }
  function tannerSpeedMultiplier(heroKey)    { return 1 + 0.05 + getSkillLevel(heroKey, 'leatherworking') * 0.03 }
  function tailorSpeedMultiplier(heroKey)    { return 1 + 0.05 + getSkillLevel(heroKey, 'tailoring')      * 0.03 }
  function carpenterSpeedMultiplier(heroKey) { return 1 + 0.05 + getSkillLevel(heroKey, 'woodworking')    * 0.03 }

  return {
    skillData,
    assignedForgeSmithKey, assignedTannerKey, assignedTailorKey, assignedCarpenterKey,
    assignedFusionArcaneKey1, assignedFusionArcaneKey2,
    assignedFusionShadowKey1, assignedFusionShadowKey2,
    assignedFusionTanneryKey1, assignedFusionTanneryKey2,
    xpForLevel, getSkillLevel, getSkillXp, addSkillXp,
    assignForgeSmith, unassignForgeSmith,
    assignTanner, unassignTanner,
    assignTailor, unassignTailor,
    assignCarpenter, unassignCarpenter,
    assignFusionArcane1, unassignFusionArcane1,
    assignFusionArcane2, unassignFusionArcane2,
    assignFusionShadow1, unassignFusionShadow1,
    assignFusionShadow2, unassignFusionShadow2,
    assignFusionTannery1, unassignFusionTannery1,
    assignFusionTannery2, unassignFusionTannery2,
    smithSpeedMultiplier, tannerSpeedMultiplier, tailorSpeedMultiplier, carpenterSpeedMultiplier,
  }
})
