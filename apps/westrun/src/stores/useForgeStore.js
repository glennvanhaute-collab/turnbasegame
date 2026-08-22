import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { rollLine, rollLineForPotential, POTENTIAL_LINE_COUNT, POTENTIAL_NEXT_TIER } from '../game/data/dungeons.js'
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

  const stamps = ref(saved?.stamps ?? 0)  // Potential Stamps (bought with diamonds)

  // Dark Orb: holds a pending comparison before the player commits
  // { instanceId, oldLines, newLines, oldTier, newTier, ranked }
  const darkPreview = ref(null)

  // Rank-up probability per orb type
  const ORB_RANKUP = { cracked: 0.05, master: 0.15, dark: 0.25 }

  watch([materials, orbs, stamps], () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      materials: materials.value,
      orbs:      orbs.value,
      stamps:    stamps.value,
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

  // ── Potential Stamp ─────────────────────────────────────────────
  // Reveals potential on an item — sets tier to Rare, rolls 2 initial lines.
  function applyPotentialStamp(instanceId) {
    if (stamps.value <= 0) return false
    const inventory = useInventoryStore()
    const item = inventory.instanceById(instanceId)
    if (!item || item.potentialTier) return false
    if (item.rarity !== 'Legendary' && item.rarity !== 'Mythical') return false
    const lineCount = POTENTIAL_LINE_COUNT.rare
    item.potentialLines = Array.from({ length: lineCount }, () => rollLineForPotential('rare', false))
    item.potentialTier  = 'rare'
    stamps.value--
    return true
  }

  // ── Orbing (potential tier re-roll + rank-up) ────────────────────
  function _rollPotentialLines(tier, prime) {
    const count = POTENTIAL_LINE_COUNT[tier] ?? 2
    return Array.from({ length: count }, () => rollLineForPotential(tier, prime))
  }

  function applyOrb(instanceId, orbId) {
    if ((orbs.value[orbId] ?? 0) <= 0) return false
    const inventory = useInventoryStore()
    const item = inventory.instanceById(instanceId)
    if (!item) return false

    // Potential-tier items use the new system
    if (item.potentialTier) {
      const ranked   = Math.random() < (ORB_RANKUP[orbId] ?? 0)
      const nextTier = ranked ? (POTENTIAL_NEXT_TIER[item.potentialTier] ?? item.potentialTier) : item.potentialTier
      const prime    = orbId === 'master' || ranked
      const newLines = _rollPotentialLines(nextTier, prime)

      if (orbId === 'dark') {
        orbs.value.dark--
        darkPreview.value = {
          instanceId,
          oldLines: [...(item.potentialLines ?? [])],
          newLines,
          oldTier:  item.potentialTier,
          newTier:  nextTier,
          ranked,
        }
        return true
      }

      item.potentialLines = newLines
      if (ranked) item.potentialTier = nextTier
      orbs.value[orbId]--
      return true
    }

    // Legacy path — items with discovery lines but no potential tier
    if (item.rarity !== 'Legendary' && item.rarity !== 'Mythical') return false
    const discovery = item.lines.filter(l => l.type === LineType.DISCOVERY)
    const rest      = item.lines.filter(l => l.type !== LineType.DISCOVERY)
    const count     = Math.max(1, discovery.length)
    const prime     = orbId === 'master'
    const newLines  = Array.from({ length: count }, () => rollLine(prime))

    if (orbId === 'dark') {
      orbs.value.dark--
      darkPreview.value = {
        instanceId,
        oldLines: [...discovery],
        newLines,
        oldTier:  null,
        newTier:  null,
        ranked:   false,
      }
      return true
    }

    item.lines = [...rest, ...newLines]
    orbs.value[orbId]--
    return true
  }

  function confirmDark(keepNew) {
    if (!darkPreview.value) return
    const inventory = useInventoryStore()
    const item = inventory.instanceById(darkPreview.value.instanceId)
    if (item && keepNew) {
      if (item.potentialTier) {
        // Potential system
        item.potentialLines = darkPreview.value.newLines
        if (darkPreview.value.ranked) item.potentialTier = darkPreview.value.newTier
      } else {
        // Legacy discovery lines
        const rest = item.lines.filter(l => l.type !== LineType.DISCOVERY)
        item.lines = [...rest, ...darkPreview.value.newLines]
      }
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
    materials, orbs, stamps, darkPreview, totalOrbs,
    MATERIALS, ORBS, ORB_RANKUP,
    awardMaterials, canCraft, craft,
    applyOrb, confirmDark, cancelDarkPreview,
    applyPotentialStamp,
  }
})
