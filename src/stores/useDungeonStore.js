import { defineStore } from 'pinia'
import { ref } from 'vue'
import { generateDungeonOptions, rollNodeLine } from '../game/data/dungeons.js'
import { addLineToItem } from '../game/Gear.js'
import { rollOreDrops } from '../game/data/ores.js'
import { useEnergyStore } from './useEnergyStore.js'
import { useInventoryStore } from './useInventoryStore.js'
import { useResourceStore } from './useResourceStore.js'
import { useForgeStore } from './useForgeStore.js'

export const EXPLORE_COST = 5
const STORAGE_KEY = 'raid-dungeons'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useDungeonStore = defineStore('dungeons', () => {
  const saved = loadSaved()

  const currentOptions  = ref(saved?.currentOptions ?? [])
  const pinnedDungeons  = ref(saved?.pinnedDungeons ?? [])
  const pendingNodeId   = ref(null)   // node awaiting item pick

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
    currentOptions.value = generateDungeonOptions()
    persist()
    return true
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

  function onDungeonVictory(dungeonId) {
    const dungeon = findDungeon(dungeonId)
    if (!dungeon) return { oreDrops: [] }

    const oreDrops = rollOreDrops(dungeon.tier)
    const resources = useResourceStore()
    oreDrops.forEach(({ oreId, amount }) => resources.addOre(oreId, amount))

    currentOptions.value = currentOptions.value.filter(d => d.id !== dungeonId)
    pinnedDungeons.value = pinnedDungeons.value.filter(d => d.id !== dungeonId)
    useForgeStore().awardMaterials(dungeon.tier)

    // Upgrade component drops
    const componentDrops = []
    if (dungeon.tier === 'Easy') {
      if (Math.random() < 0.20) { resources.addUpgradeComponent('copper_essence', 1); componentDrops.push('copper_essence') }
      if (Math.random() < 0.08) { resources.addUpgradeComponent('tin_essence',    1); componentDrops.push('tin_essence') }
    }

    if (dungeon.tier === 'Nightmare' && Math.random() < 0.04) {
      useInventoryStore().awardSoulVessel()
    }

    persist()
    return { oreDrops, componentDrops }
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

  return {
    currentOptions, pinnedDungeons, pendingNodeId,
    EXPLORE_COST,
    explore, pin, unpin, onDungeonVictory, findDungeon,
    openNode, closeNode, applyNodeToItem,
  }
})
