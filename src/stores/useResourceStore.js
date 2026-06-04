import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ORES } from '../game/data/ores.js'
import { BARS } from '../game/data/bars.js'

const STORAGE_KEY = 'raid-resources'

const XP_PER_LEVEL = 100

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useResourceStore = defineStore('resources', () => {
  const saved = loadSaved()
  const ores       = ref(saved?.ores       ?? Object.fromEntries(Object.keys(ORES).map(k => [k, 0])))
  const bars       = ref(saved?.bars       ?? Object.fromEntries(Object.keys(BARS).map(k => [k, 0])))
  const smithingXp = ref(saved?.smithingXp ?? 0)
  // Unlocked by Codex progression: 0=Basic, 1=Iron, 2=Darksteel, 3=Mythril
  const forgeLevel          = ref(saved?.forgeLevel          ?? 0)
  // Unlocked by rare encounter rewards — each forge is an independent discovery
  const elvenForgeUnlocked  = ref(saved?.elvenForgeUnlocked  ?? false)
  const goblinForgeUnlocked = ref(saved?.goblinForgeUnlocked ?? false)
  const dwarfForgeUnlocked  = ref(saved?.dwarfForgeUnlocked  ?? false)

  const smithingLevel     = computed(() => Math.floor(smithingXp.value / XP_PER_LEVEL) + 1)
  const smithingProgress  = computed(() => (smithingXp.value % XP_PER_LEVEL) / XP_PER_LEVEL)
  const smithingXpInLevel = computed(() => smithingXp.value % XP_PER_LEVEL)

  watch([ores, bars, smithingXp, forgeLevel, elvenForgeUnlocked, goblinForgeUnlocked, dwarfForgeUnlocked], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ores:                ores.value,
      bars:                bars.value,
      smithingXp:          smithingXp.value,
      forgeLevel:          forgeLevel.value,
      elvenForgeUnlocked:  elvenForgeUnlocked.value,
      goblinForgeUnlocked: goblinForgeUnlocked.value,
      dwarfForgeUnlocked:  dwarfForgeUnlocked.value,
    }))
  }, { deep: true })

  function addOre(oreId, amount)    { if (oreId in ores.value) ores.value[oreId] += amount }
  function removeOre(oreId, amount) { if (oreId in ores.value) ores.value[oreId] = Math.max(0, ores.value[oreId] - amount) }
  function addBar(barId, amount)    { if (barId in bars.value) bars.value[barId] += amount }
  function removeBar(barId, amount) { if (barId in bars.value) bars.value[barId] = Math.max(0, bars.value[barId] - amount) }
  function addSmithingXp(amount)    { smithingXp.value += amount }

  return {
    ores, addOre, removeOre,
    bars, addBar, removeBar,
    forgeLevel,
    elvenForgeUnlocked, goblinForgeUnlocked, dwarfForgeUnlocked,
    smithingXp, smithingLevel, smithingProgress, smithingXpInLevel,
    addSmithingXp,
    XP_PER_LEVEL,
  }
})
