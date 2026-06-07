import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ORES } from '../game/data/ores.js'
import { BARS } from '../game/data/bars.js'
import { UPGRADE_COMPONENTS } from '../game/data/upgradeComponents.js'
import { HIDES } from '../game/data/hides.js'
import { LEATHERS } from '../game/data/leathers.js'
import { FIBERS } from '../game/data/fibers.js'
import { CLOTHS } from '../game/data/cloths.js'
import { WOODS } from '../game/data/woods.js'
import { PLANKS } from '../game/data/planks.js'
import { BOWSTRINGS } from '../game/data/bowstrings.js'

const STORAGE_KEY = 'raid-resources'

const XP_PER_LEVEL = 100

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useResourceStore = defineStore('resources', () => {
  const saved = loadSaved()
  const ores       = ref(saved?.ores       ?? Object.fromEntries(Object.keys(ORES).map(k => [k, 0])))
  const bars       = ref(saved?.bars       ?? Object.fromEntries(Object.keys(BARS).map(k => [k, 0])))
  const smithingXp       = ref(saved?.smithingXp       ?? 0)
  const leatherworkingXp = ref(saved?.leatherworkingXp ?? 0)
  const tailoringXp      = ref(saved?.tailoringXp      ?? 0)
  const woodworkingXp    = ref(saved?.woodworkingXp    ?? 0)

  const logs       = ref(saved?.logs       ?? Object.fromEntries(Object.keys(WOODS).map(k => [k, 0])))
  const planks     = ref(saved?.planks     ?? Object.fromEntries(Object.keys(PLANKS).map(k => [k, 0])))
  const bowstrings = ref(saved?.bowstrings ?? Object.fromEntries(Object.keys(BOWSTRINGS).map(k => [k, 0])))

  const hides   = ref(saved?.hides   ?? Object.fromEntries(Object.keys(HIDES).map(k => [k, 0])))
  const leathers = ref(saved?.leathers ?? Object.fromEntries(Object.keys(LEATHERS).map(k => [k, 0])))
  const fibers   = ref(saved?.fibers   ?? Object.fromEntries(Object.keys(FIBERS).map(k => [k, 0])))
  const cloths   = ref(saved?.cloths   ?? Object.fromEntries(Object.keys(CLOTHS).map(k => [k, 0])))

  // Unlocked by Codex progression: 0=Basic, 1=Iron, 2=Darksteel, 3=Mythril
  const forgeLevel          = ref(saved?.forgeLevel          ?? 0)
  // Unlocked by rare encounter rewards — each forge is an independent discovery
  const elvenForgeUnlocked  = ref(saved?.elvenForgeUnlocked  ?? false)
  const goblinForgeUnlocked = ref(saved?.goblinForgeUnlocked ?? false)
  const dwarfForgeUnlocked  = ref(saved?.dwarfForgeUnlocked  ?? false)

  const upgradeComponents = ref(
    saved?.upgradeComponents ?? Object.fromEntries(Object.keys(UPGRADE_COMPONENTS).map(k => [k, 0]))
  )

  const smithingLevel          = computed(() => Math.floor(smithingXp.value / XP_PER_LEVEL) + 1)
  const smithingProgress       = computed(() => (smithingXp.value % XP_PER_LEVEL) / XP_PER_LEVEL)
  const smithingXpInLevel      = computed(() => smithingXp.value % XP_PER_LEVEL)

  const leatherworkingLevel    = computed(() => Math.floor(leatherworkingXp.value / XP_PER_LEVEL) + 1)
  const leatherworkingProgress = computed(() => (leatherworkingXp.value % XP_PER_LEVEL) / XP_PER_LEVEL)
  const leatherworkingXpInLevel = computed(() => leatherworkingXp.value % XP_PER_LEVEL)

  const tailoringLevel         = computed(() => Math.floor(tailoringXp.value / XP_PER_LEVEL) + 1)
  const tailoringProgress      = computed(() => (tailoringXp.value % XP_PER_LEVEL) / XP_PER_LEVEL)
  const tailoringXpInLevel     = computed(() => tailoringXp.value % XP_PER_LEVEL)

  const woodworkingLevel       = computed(() => Math.floor(woodworkingXp.value / XP_PER_LEVEL) + 1)
  const woodworkingProgress    = computed(() => (woodworkingXp.value % XP_PER_LEVEL) / XP_PER_LEVEL)
  const woodworkingXpInLevel   = computed(() => woodworkingXp.value % XP_PER_LEVEL)

  watch([ores, bars, smithingXp, leatherworkingXp, tailoringXp, woodworkingXp, logs, planks, bowstrings,
         hides, leathers, fibers, cloths,
         forgeLevel, elvenForgeUnlocked, goblinForgeUnlocked, dwarfForgeUnlocked, upgradeComponents], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ores:                ores.value,
      bars:                bars.value,
      smithingXp:          smithingXp.value,
      leatherworkingXp:    leatherworkingXp.value,
      tailoringXp:         tailoringXp.value,
      woodworkingXp:       woodworkingXp.value,
      logs:                logs.value,
      planks:              planks.value,
      bowstrings:          bowstrings.value,
      hides:               hides.value,
      leathers:            leathers.value,
      fibers:              fibers.value,
      cloths:              cloths.value,
      forgeLevel:          forgeLevel.value,
      elvenForgeUnlocked:  elvenForgeUnlocked.value,
      goblinForgeUnlocked: goblinForgeUnlocked.value,
      dwarfForgeUnlocked:  dwarfForgeUnlocked.value,
      upgradeComponents:   upgradeComponents.value,
    }))
  }, { deep: true })

  function addOre(oreId, amount)    { if (oreId in ores.value) ores.value[oreId] += amount }
  function removeOre(oreId, amount) { if (oreId in ores.value) ores.value[oreId] = Math.max(0, ores.value[oreId] - amount) }
  function addBar(barId, amount)    { if (barId in bars.value) bars.value[barId] += amount }
  function removeBar(barId, amount) { if (barId in bars.value) bars.value[barId] = Math.max(0, bars.value[barId] - amount) }
  function addSmithingXp(amount)       { smithingXp.value += amount }
  function addLeatherworkingXp(amount) { leatherworkingXp.value += amount }
  function addTailoringXp(amount)      { tailoringXp.value += amount }
  function addWoodworkingXp(amount)    { woodworkingXp.value += amount }

  function addLog(woodId, amount)    { if (woodId in logs.value) logs.value[woodId] += amount }
  function removeLog(woodId, amount) { if (woodId in logs.value) logs.value[woodId] = Math.max(0, logs.value[woodId] - amount) }
  function addPlank(id, amount)       { if (id in planks.value) planks.value[id] += amount }
  function removePlank(id, amount)    { if (id in planks.value) planks.value[id] = Math.max(0, planks.value[id] - amount) }
  function addBowstring(id, amount)   { if (id in bowstrings.value) bowstrings.value[id] += amount }
  function removeBowstring(id, amount){ if (id in bowstrings.value) bowstrings.value[id] = Math.max(0, bowstrings.value[id] - amount) }

  function addHide(id, amount)       { if (id in hides.value) hides.value[id] += amount }
  function removeHide(id, amount)    { if (id in hides.value) hides.value[id] = Math.max(0, hides.value[id] - amount) }
  function addLeather(id, amount)    { if (id in leathers.value) leathers.value[id] += amount }
  function removeLeather(id, amount) { if (id in leathers.value) leathers.value[id] = Math.max(0, leathers.value[id] - amount) }
  function addFiber(id, amount)      { if (id in fibers.value) fibers.value[id] += amount }
  function removeFiber(id, amount)   { if (id in fibers.value) fibers.value[id] = Math.max(0, fibers.value[id] - amount) }
  function addCloth(id, amount)      { if (id in cloths.value) cloths.value[id] += amount }
  function removeCloth(id, amount)   { if (id in cloths.value) cloths.value[id] = Math.max(0, cloths.value[id] - amount) }

  function addUpgradeComponent(id, amount = 1) {
    if (id in upgradeComponents.value) upgradeComponents.value[id] += amount
  }
  function removeUpgradeComponent(id, amount = 1) {
    if (id in upgradeComponents.value) upgradeComponents.value[id] = Math.max(0, upgradeComponents.value[id] - amount)
  }

  return {
    ores, addOre, removeOre,
    bars, addBar, removeBar,
    forgeLevel,
    elvenForgeUnlocked, goblinForgeUnlocked, dwarfForgeUnlocked,
    smithingXp, smithingLevel, smithingProgress, smithingXpInLevel,
    addSmithingXp,
    leatherworkingXp, leatherworkingLevel, leatherworkingProgress, leatherworkingXpInLevel,
    addLeatherworkingXp,
    tailoringXp, tailoringLevel, tailoringProgress, tailoringXpInLevel,
    addTailoringXp,
    woodworkingXp, woodworkingLevel, woodworkingProgress, woodworkingXpInLevel,
    addWoodworkingXp,
    logs, addLog, removeLog,
    planks, addPlank, removePlank,
    bowstrings, addBowstring, removeBowstring,
    hides, addHide, removeHide,
    leathers, addLeather, removeLeather,
    fibers, addFiber, removeFiber,
    cloths, addCloth, removeCloth,
    upgradeComponents, addUpgradeComponent, removeUpgradeComponent,
    UPGRADE_COMPONENTS,
    XP_PER_LEVEL,
  }
})
