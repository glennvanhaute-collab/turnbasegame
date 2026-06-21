import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateDungeonOptions, rollNodeLine } from '../game/data/dungeons.js'
import { addLineToItem } from '../game/Gear.js'
import { useEnergyStore } from './useEnergyStore.js'
import { useInventoryStore } from './useInventoryStore.js'
import { useResourceStore } from './useResourceStore.js'
import { useForgeStore } from './useForgeStore.js'
import { useCodexStore } from './useCodexStore.js'

export const EXPLORE_COST = 5
const STORAGE_KEY = 'raid-dungeons'

// Chance drops sharply after the first forge — specialise, don't collect
const FORGE_DISCOVERY_CHANCE = {
  elven:  0.05,   // first forge: 5%
  goblin: 0.008,  // second: 0.8%
  dwarf:  0.004,  // third: 0.4%
}

export const FORGE_DISCOVERY_DATA = {
  elven:  { name: 'Ruins of the Moonforge',       color: '#88ffcc', tier: 'Moonsilver',  desc: 'An ancient elven forge, still warm with residual magic. Moonsilver crafting is now unlocked.' },
  goblin: { name: "Gearvein's Contraption Works", color: '#aaff44', tier: 'Vaultmetal',  desc: 'A chaotic goblin workshop humming with clever contraptions. Vaultmetal crafting is now unlocked.' },
  dwarf:  { name: 'The Dwarven Ironhall',         color: '#ff9966', tier: 'Runeite',     desc: 'A legendary forge carved into living rock by dwarven hands. Runeite crafting is now unlocked.' },
}

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useDungeonStore = defineStore('dungeons', () => {
  const saved = loadSaved()

  const currentOptions  = ref(saved?.currentOptions ?? [])
  const pinnedDungeons  = ref(saved?.pinnedDungeons ?? [])
  const pendingNodeId       = ref(null)   // node awaiting item pick
  const pendingTavernId     = ref(null)   // tavern node awaiting claim
  const pendingTavernFrag   = ref(null)   // { heroId, heroTitle, frag } pre-rolled for modal

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentOptions: currentOptions.value,
      pinnedDungeons: pinnedDungeons.value,
    }))
  }

  function explore() {
    const energy = useEnergyStore()
    if (!energy.canAfford(EXPLORE_COST)) return false
    energy.spend(EXPLORE_COST)
    const DIFF_ORDER = ['Easy', 'Normal', 'Hard', 'Brutal', 'Nightmare']
    const options = generateDungeonOptions()
    const discovery = rollForgeDiscovery()
    if (discovery) options[Math.floor(Math.random() * options.length)] = discovery
    options.sort((a, b) => (DIFF_ORDER.indexOf(a.difficulty) ?? 99) - (DIFF_ORDER.indexOf(b.difficulty) ?? 99))
    currentOptions.value = options
    persist()
    return true
  }

  function rollForgeDiscovery() {
    const resources = useResourceStore()
    if (resources.smithingLevel < 70) return null
    let forgeType = null
    if (!resources.elvenForgeUnlocked)       forgeType = 'elven'
    else if (!resources.goblinForgeUnlocked) forgeType = 'goblin'
    else if (!resources.dwarfForgeUnlocked)  forgeType = 'dwarf'
    if (!forgeType || Math.random() >= FORGE_DISCOVERY_CHANCE[forgeType]) return null
    const data = FORGE_DISCOVERY_DATA[forgeType]
    return {
      id: `fd_${Date.now()}`,
      name: data.name,
      nodeType: 'forge_discovery',
      forgeType,
      isNode: true,
      isDungeon: false,
      pinned: false,
    }
  }

  function claimForgeDiscovery(id) {
    const node = findDungeon(id)
    if (!node || node.nodeType !== 'forge_discovery') return null
    const resources = useResourceStore()
    if (node.forgeType === 'elven')       resources.elvenForgeUnlocked = true
    else if (node.forgeType === 'goblin') resources.goblinForgeUnlocked = true
    else if (node.forgeType === 'dwarf')  resources.dwarfForgeUnlocked = true
    currentOptions.value = currentOptions.value.filter(d => d.id !== id)
    pinnedDungeons.value  = pinnedDungeons.value.filter(d => d.id !== id)
    persist()
    return node.forgeType
  }

  function pin(id) {
    const idx = currentOptions.value.findIndex(d => d.id === id)
    if (idx === -1) return
    const dungeon = { ...currentOptions.value[idx], pinned: true }
    currentOptions.value = currentOptions.value.filter(d => d.id !== id)
    pinnedDungeons.value = [...pinnedDungeons.value, dungeon]
    persist()
  }

  function unpin(id) {
    pinnedDungeons.value = pinnedDungeons.value.filter(d => d.id !== id)
    persist()
  }

  function onDungeonVictory(dungeonId, tier) {
    const dungeon = findDungeon(dungeonId)
    const effectiveTier = dungeon?.tier ?? tier
    if (!effectiveTier) return { componentDrops: [] }

    const resources = useResourceStore()

    // First win only: remove from active lists
    if (dungeon) {
      currentOptions.value = currentOptions.value.filter(d => d.id !== dungeonId)
      pinnedDungeons.value = pinnedDungeons.value.filter(d => d.id !== dungeonId)
    }

    useForgeStore().awardMaterials(effectiveTier)

    // First Hard clear unlocks Darksteel forge
    let forgeUnlock = null
    if (effectiveTier === 'Hard' && resources.forgeLevel < 2) {
      resources.forgeLevel = 2
      forgeUnlock = 'darksteel'
    }

    // Essence drops — scale with dungeon tier; copper/tin come from training grounds
    const ESSENCE_TABLE = {
      Easy:      [{ id: 'copper_essence', chance: 0.60, amt: 1 }, { id: 'tin_essence',       chance: 0.35, amt: 1 }],
      Medium:    [{ id: 'steel_essence',     chance: 0.60, amt: 1 }, { id: 'tin_essence',     chance: 0.30, amt: 1 }],
      Hard:      [{ id: 'darksteel_essence', chance: 0.65, amt: 2 }, { id: 'steel_essence',   chance: 0.40, amt: 1 }],
      Nightmare: [{ id: 'mithril_essence',   chance: 0.70, amt: 2 }, { id: 'darksteel_essence', chance: 0.50, amt: 1 }],
    }
    const componentDrops = []
    for (const { id, chance, amt } of (ESSENCE_TABLE[effectiveTier] ?? [])) {
      if (Math.random() < chance) {
        resources.addUpgradeComponent(id, amt)
        componentDrops.push(id)
      }
    }

    if (effectiveTier === 'Nightmare' && Math.random() < 0.04) {
      useInventoryStore().awardSoulVessel()
    }

    persist()
    return { componentDrops, forgeUnlock }
  }

  function findDungeon(id) {
    return currentOptions.value.find(d => d.id === id)
      ?? pinnedDungeons.value.find(d => d.id === id)
      ?? null
  }

  // Called when player clicks a node card — opens the item picker
  function openNode(id) {
    pendingNodeId.value = id
  }

  function closeNode() {
    pendingNodeId.value = null
  }

  // Tavern: pre-roll the fragment so the modal can display it before confirming
  function openTavern(id) {
    const codex = useCodexStore()
    const fragment = codex.pickTavernFragment()
    if (!fragment) {
      // All fragments already found — just consume the node silently
      currentOptions.value = currentOptions.value.filter(d => d.id !== id)
      persist()
      return null
    }
    pendingTavernId.value   = id
    pendingTavernFrag.value = fragment
    return fragment
  }

  function claimTavern() {
    if (!pendingTavernFrag.value) return null
    const codex = useCodexStore()
    codex.unlock(pendingTavernFrag.value.frag.id)
    currentOptions.value = currentOptions.value.filter(d => d.id !== pendingTavernId.value)
    pinnedDungeons.value  = pinnedDungeons.value.filter(d => d.id !== pendingTavernId.value)
    const result = pendingTavernFrag.value
    pendingTavernId.value   = null
    pendingTavernFrag.value = null
    persist()
    return result
  }

  function closeTavern() {
    pendingTavernId.value   = null
    pendingTavernFrag.value = null
  }

  // Apply node line to a chosen instance; returns the line that was applied
  function applyNodeToItem(instanceId) {
    const node = findDungeon(pendingNodeId.value)
    if (!node?.isNode) return null

    const inventory = useInventoryStore()
    const instance  = inventory.instanceById(instanceId)
    if (!instance) return null

    const line = rollNodeLine(node.nodeType)
    addLineToItem(instance, line)

    // Remove the node card
    currentOptions.value = currentOptions.value.filter(d => d.id !== pendingNodeId.value)
    pinnedDungeons.value  = pinnedDungeons.value.filter(d => d.id !== pendingNodeId.value)
    pendingNodeId.value   = null
    persist()
    return { line, itemName: instance.name }
  }

  function claimCityNode(id) {
    const node = findDungeon(id)
    if (!node || node.nodeType !== 'city') return null
    currentOptions.value = currentOptions.value.filter(d => d.id !== id)
    pinnedDungeons.value  = pinnedDungeons.value.filter(d => d.id !== id)
    persist()
    return { heroKey: node.heroKey, heroName: node.heroName, heroRarity: node.heroRarity, faction: node.faction }
  }

  return {
    currentOptions, pinnedDungeons, pendingNodeId,
    pendingTavernId, pendingTavernFrag,
    EXPLORE_COST,
    explore, pin, unpin, onDungeonVictory, findDungeon,
    openNode, closeNode, applyNodeToItem,
    openTavern, claimTavern, closeTavern,
    claimForgeDiscovery, claimCityNode,
  }
})
