import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { rollLine } from '../game/data/dungeons.js'
import { LineType } from '../game/Gear.js'
import { useInventoryStore } from './useInventoryStore.js'

const STORAGE_KEY = 'raid-forge'

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const MATERIALS = {
  ashen_fragment: { label: 'Ashen Fragment', color: '#888',    desc: 'Gray dust of shattered iron. Found in low-tier dungeons.' },
  ember_shard:    { label: 'Ember Shard',    color: '#ff7722', desc: 'A shard of forged metal still warm with battle heat.' },
  void_crystal:   { label: 'Void Crystal',   color: '#aa44ff', desc: 'Crystallised nightmare energy. Bleeds with dark power.' },
}

export const ORBS = {
  cracked: {
    label:  'Simple Orb',
    color:  '#888',
    desc:   'Randomly re-rolls all discovery lines on a piece of gear. Unpredictable, but cheap.',
    recipe: { ashen_fragment: 5 },
  },
  master: {
    label:  'Magnificent Orb',
    color:  '#ff9944',
    desc:   'Re-rolls lines with a 40% chance each rolls prime — biased toward the upper range.',
    recipe: { ember_shard: 3 },
  },
  dark: {
    label:  'Astral Orb',
    color:  '#9944ff',
    desc:   'Rolls new lines in secret, then reveals old vs new. You choose which to keep — orb consumed either way.',
    recipe: { void_crystal: 2, ember_shard: 1 },
  },
}

export const useForgeStore = defineStore('forge', () => {
  const saved = loadSaved()

  const materials = ref({
    ashen_fragment: saved?.materials?.ashen_fragment ?? 0,
    ember_shard:    saved?.materials?.ember_shard    ?? 0,
    void_crystal:   saved?.materials?.void_crystal   ?? 0,
  })

  const orbs = ref({
    cracked: saved?.orbs?.cracked ?? saved?.cubes?.cracked ?? 0,
    master:  saved?.orbs?.master  ?? saved?.cubes?.master  ?? 0,
    dark:    saved?.orbs?.dark    ?? saved?.cubes?.dark    ?? 0,
  })

  // Dark Orb: holds a pending comparison before the player commits
  const darkPreview = ref(null)
  // { instanceId, oldLines: [...], newLines: [...] }

  watch([materials, orbs], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      materials: materials.value,
      orbs:      orbs.value,
    }))
  }, { deep: true })

  // ── Material drops ──────────────────────────────────────────────
  function awardMaterials(tier) {
    const m = materials.value
    const r = () => Math.random()
    if (tier === 'Easy') {
      if (r() < 0.70) m.ashen_fragment += r() < 0.25 ? 2 : 1
    } else if (tier === 'Medium') {
      if (r() < 0.80) m.ashen_fragment += r() < 0.30 ? 2 : 1
      if (r() < 0.20) m.ember_shard += 1
    } else if (tier === 'Hard') {
      m.ember_shard += r() < 0.45 ? 2 : 1
      if (r() < 0.18) m.void_crystal += 1
    } else if (tier === 'Nightmare') {
      m.void_crystal += r() < 0.50 ? 2 : 1
      if (r() < 0.30) m.ember_shard += 1
    }
  }

  // ── Crafting ────────────────────────────────────────────────────
  function canCraft(orbId) {
    const recipe = ORBS[orbId]?.recipe
    if (!recipe) return false
    return Object.entries(recipe).every(([mat, qty]) => (materials.value[mat] ?? 0) >= qty)
  }

  function craft(orbId) {
    if (!canCraft(orbId)) return false
    const recipe = ORBS[orbId].recipe
    for (const [mat, qty] of Object.entries(recipe)) materials.value[mat] -= qty
    orbs.value[orbId]++
    return true
  }

  // ── Orbing ──────────────────────────────────────────────────────
  function _rerollLines(item, prime) {
    const discovery = item.lines.filter(l => l.type === LineType.DISCOVERY)
    const rest      = item.lines.filter(l => l.type !== LineType.DISCOVERY)
    const count     = Math.max(1, discovery.length)
    const newLines  = Array.from({ length: count }, () => rollLine(prime))
    return { rest, newLines }
  }

  function applyOrb(instanceId, orbId) {
    if ((orbs.value[orbId] ?? 0) <= 0) return false
    const inventory = useInventoryStore()
    const item = inventory.instanceById(instanceId)
    if (!item) return false
    if (item.rarity !== 'Legendary' && item.rarity !== 'Mythical') return false

    if (orbId === 'dark') {
      const discovery = item.lines.filter(l => l.type === LineType.DISCOVERY)
      const count     = Math.max(1, discovery.length)
      const newLines  = Array.from({ length: count }, () => rollLine(false))
      orbs.value.dark--
      darkPreview.value = {
        instanceId,
        oldLines: [...discovery],
        newLines,
      }
      return true
    }

    const prime = orbId === 'master'
    const { rest, newLines } = _rerollLines(item, prime)
    item.lines = [...rest, ...newLines]
    orbs.value[orbId]--
    return true
  }

  function confirmDark(keepNew) {
    if (!darkPreview.value) return
    const inventory = useInventoryStore()
    const item = inventory.instanceById(darkPreview.value.instanceId)
    if (item && keepNew) {
      const rest = item.lines.filter(l => l.type !== LineType.DISCOVERY)
      item.lines = [...rest, ...darkPreview.value.newLines]
    }
    darkPreview.value = null
  }

  function cancelDarkPreview() {
    darkPreview.value = null
  }

  const totalOrbs = computed(() =>
    orbs.value.cracked + orbs.value.master + orbs.value.dark
  )

  return {
    materials, orbs, darkPreview, totalOrbs,
    MATERIALS, ORBS,
    awardMaterials, canCraft, craft,
    applyOrb, confirmDark, cancelDarkPreview,
  }
})
