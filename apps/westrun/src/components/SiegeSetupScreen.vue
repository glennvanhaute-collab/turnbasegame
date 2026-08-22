<template>
  <div class="setup-root" :style="{ backgroundImage: `url(${faction.img})` }">
    <div class="setup-overlay" />

    <!-- ── Header ───────────────────────────────────────────────────── -->
    <div class="setup-header">
      <button class="btn-back" @click="$emit('back')">← Back</button>
      <div class="setup-header-info">
        <span class="sh-house" :style="{ color: faction.color }">{{ faction.house }}</span>
        <span class="sh-sep">·</span>
        <span class="sh-event">{{ faction.event.title }}</span>
        <span class="sh-sep">·</span>
        <span class="sh-tier" :style="{ color: tier.color }">{{ tier.name }}</span>
      </div>
      <div class="setup-header-right" />
    </div>

    <!-- ── Body ─────────────────────────────────────────────────────── -->
    <div class="setup-body">

      <!-- Left: Army recruitment -->
      <div class="panel army-panel">
        <div class="panel-label">Your Army</div>
        <div class="unit-rows">
          <div v-for="unit in UNIT_LIST" :key="unit.id" class="unit-row" :style="{ '--uc': unit.color }">
            <div class="unit-icon">{{ unit.icon }}</div>
            <div class="unit-info">
              <div class="unit-name">{{ unit.name }}</div>
              <div class="unit-bar-wrap">
                <div class="unit-bar" :style="{ width: (siege.army[unit.id] / unit.maxStack * 100) + '%', background: unit.color }" />
              </div>
              <div class="unit-count">{{ siege.army[unit.id] }} / {{ unit.maxStack }}</div>
            </div>
            <button class="btn-recruit" :disabled="!siege.canRecruit(unit.id)" @click="siege.recruit(unit.id)">
              +{{ unit.recruitPer }}
            </button>
          </div>
        </div>
        <div class="recruit-cost-hint">
          <div v-for="unit in UNIT_LIST" :key="unit.id" class="cost-line">
            <span class="cost-unit-name">{{ unit.shortName }} ×{{ unit.recruitPer }}:</span>
            <span v-for="(amt, barId) in unit.recruitCost.bars" :key="'b'+barId" class="cost-chip bar-cost"
              :class="{ short: (resources.bars[barId] ?? 0) < amt * unit.recruitPer }">
              {{ BAR_NAMES[barId] }} ×{{ amt * unit.recruitPer }}
            </span>
            <span v-for="(amt, plankId) in unit.recruitCost.planks" :key="'p'+plankId" class="cost-chip plank-cost"
              :class="{ short: (resources.planks[plankId] ?? 0) < amt * unit.recruitPer }">
              {{ PLANK_NAMES[plankId] }} ×{{ amt * unit.recruitPer }}
            </span>
          </div>
        </div>
      </div>

      <!-- Center: Phase tabs -->
      <div class="panel center-panel">

        <!-- Phase tab toggle -->
        <div class="phase-tabs">
          <button class="phase-tab" :class="{ active: activePhase === 1 }" @click="activePhase = 1">
            <span class="pt-num">I</span>
            <span class="pt-label">The Breach</span>
            <span class="pt-status" :class="{ ready: siege.phase1Ready }">◆</span>
          </button>
          <button class="phase-tab" :class="{ active: activePhase === 2 }" @click="activePhase = 2">
            <span class="pt-num">II</span>
            <span class="pt-label">The Vanguard</span>
            <span class="pt-status" :class="{ ready: siege.phase2Ready }">◆</span>
          </button>
        </div>

        <!-- ── Phase 1: Lane deployment ──────────────────────────── -->
        <div v-if="activePhase === 1" class="lanes-view">
          <div v-for="lane in LANES" :key="lane.id" class="lane-col">

            <div class="lane-header">
              <span class="lane-name">{{ lane.name }}</span>
              <span class="lane-count" :class="{ full: siege.lanes[lane.id].length >= 10 }">
                {{ siege.lanes[lane.id].length }}/10
              </span>
            </div>

            <div class="lane-commanders">
              <div v-for="heroKey in siege.lanes[lane.id]" :key="heroKey" class="lane-hero">
                <HeroAvatar :hero="heroForKey(heroKey)" :size="40" />
                <div class="lane-hero-info">
                  <span class="lane-hero-name">{{ heroForKey(heroKey)?.name ?? heroKey }}</span>
                  <div class="unit-selector">
                    <button
                      v-for="unit in UNIT_LIST"
                      :key="unit.id"
                      class="unit-pick-btn"
                      :class="{ active: siege.assignments[heroKey] === unit.id }"
                      :style="siege.assignments[heroKey] === unit.id ? { borderColor: unit.color, color: unit.color } : {}"
                      :title="unit.name + ' (' + siege.army[unit.id] + ')'"
                      @click="siege.assignUnit(heroKey, unit.id)"
                    >{{ unit.icon }}</button>
                  </div>
                  <span class="lane-unit-label" v-if="siege.assignments[heroKey]"
                    :style="{ color: UNIT_TYPES[siege.assignments[heroKey]].color }">
                    {{ UNIT_TYPES[siege.assignments[heroKey]].shortName }}
                    <span class="lane-unit-count">({{ siege.army[siege.assignments[heroKey]] }})</span>
                  </span>
                  <span class="lane-unit-label missing" v-else>No unit</span>
                </div>
                <button class="lane-hero-remove" @click="siege.removeFromLane(lane.id, heroKey)">✕</button>
              </div>

              <!-- Empty slot placeholder when lane is empty -->
              <div v-if="siege.lanes[lane.id].length === 0" class="lane-empty-hint">
                Assign a commander
              </div>
            </div>

            <button
              class="lane-add-btn"
              :disabled="siege.lanes[lane.id].length >= 10 || siege.totalDeployed >= 30"
              @click="openPicker({ type: 'lane', lane: lane.id })"
            >
              + Commander
            </button>
          </div>

          <div class="deploy-total">
            {{ siege.totalDeployed }}/{{ MAX_TOTAL }} commanders deployed
          </div>
        </div>

        <!-- ── Phase 2: Vanguard ──────────────────────────────────── -->
        <div v-else class="phase2-view">
          <div class="phase2-subtitle">
            Three heroes lead the final assault on the enemy commander.
          </div>
          <div class="hero-slots">
            <div v-for="(heroKey, i) in siege.phase2Party" :key="i" class="hero-slot">
              <template v-if="heroKey">
                <div class="slot-portrait" @click="openPicker({ type: 'phase2', slot: i })">
                  <HeroAvatar :hero="heroForKey(heroKey)" :size="72" />
                  <button class="slot-clear" @click.stop="siege.clearPhase2Slot(i)">✕</button>
                </div>
                <div class="slot-name">{{ heroForKey(heroKey)?.name ?? heroKey }}</div>
              </template>
              <template v-else>
                <button class="slot-empty" @click="openPicker({ type: 'phase2', slot: i })">
                  <span class="slot-empty-icon">+</span>
                  <span class="slot-empty-label">Add Hero</span>
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- Readiness row -->
        <div class="readiness-row">
          <template v-if="activePhase === 1">
            <span class="readiness-dot" :class="{ ready: siege.phase1Ready }">◆</span>
            <span class="readiness-text" v-if="siege.phase1Ready">All lanes ready to breach</span>
            <span class="readiness-text missing" v-else>Each lane needs 1+ commander with a unit assigned</span>
          </template>
          <template v-else>
            <span class="readiness-dot" :class="{ ready: siege.phase2Ready }">◆</span>
            <span class="readiness-text" v-if="siege.phase2Ready">Vanguard ready</span>
            <span class="readiness-text missing" v-else>Assign 3 heroes to the vanguard</span>
          </template>
        </div>

      </div>

      <!-- Right: Garrison intel -->
      <div class="panel intel-panel">
        <div class="panel-label">Garrison Intel</div>

        <div class="intel-block">
          <div class="intel-faction" :style="{ color: faction.color }">{{ faction.house }}</div>
          <div class="intel-dispatch">{{ faction.event.dispatch }}</div>
        </div>

        <div class="intel-matchup">
          <div class="intel-row">
            <span class="intel-label">Affinity</span>
            <span class="intel-val affinity-chip" :class="faction.affinity.toLowerCase()">{{ faction.affinity }}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Difficulty</span>
            <span class="intel-val" :style="{ color: tier.color }">{{ tier.name }}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Reward</span>
            <span class="intel-val">🪙 {{ tier.gold.toLocaleString() }} · 💎 {{ tier.diamonds }}</span>
          </div>
          <div class="intel-row">
            <span class="intel-label">Spoils</span>
            <span class="intel-val" :style="{ color: faction.color }">◆ {{ faction.event.matReward }} ×{{ tier.matCount }}</span>
          </div>
        </div>

        <div class="garrison-preview">
          <div class="garrison-label">Defending garrison</div>
          <div v-for="g in tier.garrison" :key="g" class="garrison-line">
            <span class="garrison-dot">⚔</span> {{ g }}
          </div>
        </div>
      </div>

    </div>

    <!-- ── Footer ────────────────────────────────────────────────────── -->
    <div class="setup-footer">
      <div class="phase-indicators">
        <span class="pi-dot" :class="{ ready: siege.phase1Ready }">◆ Breach</span>
        <span class="pi-sep">·</span>
        <span class="pi-dot" :class="{ ready: siege.phase2Ready }">◆ Vanguard</span>
      </div>
      <button
        class="btn-march"
        :disabled="!siege.siegeReady"
        :style="siege.siegeReady ? { borderColor: faction.color, color: faction.color } : {}"
        @click="$emit('march')"
      >
        ⚔ March on {{ faction.house }}
      </button>
    </div>

    <!-- ── Hero Picker Modal ─────────────────────────────────────────── -->
    <div v-if="pickerFor" class="picker-backdrop" @click.self="pickerFor = null">
      <div class="picker-modal">
        <div class="picker-header">
          <span class="picker-title">{{ pickerTitle }}</span>
          <button class="picker-close" @click="pickerFor = null">✕</button>
        </div>
        <div class="picker-grid">
          <button
            v-for="entry in availableHeroes"
            :key="entry.key"
            class="picker-hero"
            :class="{ 'in-target': isInTarget(entry.key), 'locked-out': isLockedOut(entry.key) }"
            @click="pickHero(entry.key)"
          >
            <HeroAvatar :hero="entry.hero" :size="52" />
            <span class="ph-name">{{ entry.hero.name }}</span>
            <span class="ph-bp">{{ entry.bp.toLocaleString() }} BP</span>
            <span class="ph-badge" v-if="heroBadge(entry.key)">{{ heroBadge(entry.key) }}</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import HeroAvatar from './HeroAvatar.vue'
import { useSiegeStore } from '../stores/useSiegeStore.js'
import { useResourceStore } from '../stores/useResourceStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { UNIT_TYPES, UNIT_LIST } from '../game/data/siegeUnits.js'
import { PLANK_LIST } from '../game/data/planks.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'

const props = defineProps({
  faction: { type: Object, required: true },
  tier:    { type: Object, required: true },
})
defineEmits(['back', 'march'])

const siege      = useSiegeStore()
const resources  = useResourceStore()
const collection = useCollectionStore()
const inventory  = useInventoryStore()

const MAX_TOTAL = 30

const BAR_NAMES   = { copper: 'Copper Bar', tin: 'Tin Bar', steel: 'Steel Bar', darksteel: 'Darksteel Bar', mithril: 'Mithril Bar' }
const PLANK_NAMES = Object.fromEntries(PLANK_LIST.map(p => [p.id, p.name]))

const LANES = [
  { id: 'west', name: 'West Flank' },
  { id: 'gate', name: 'Front Gate' },
  { id: 'east', name: 'East Flank' },
]

const LANE_LABELS = { west: 'West', gate: 'Gate', east: 'East' }

const activePhase = ref(1)

function heroForKey(key) {
  if (!key) return null
  const entry = collection.roster.find(r => r.key === key)
  return entry ? entry.hero : (HERO_TEMPLATES[key]?.() ?? null)
}

const availableHeroes = computed(() =>
  collection.roster
    .filter(r => r.hero?.isPlayer)
    .map(r => ({ ...r, bp: inventory.heroCP(r.key) }))
    .sort((a, b) => b.bp - a.bp)
)

// ── Hero picker ──────────────────────────────────────────────────────
// pickerFor = { type: 'lane', lane: 'west' } | { type: 'phase2', slot: 0 } | null
const pickerFor = ref(null)

const pickerTitle = computed(() => {
  if (!pickerFor.value) return ''
  if (pickerFor.value.type === 'lane') return `Assign Commander — ${LANE_LABELS[pickerFor.value.lane]} Flank`
  return 'Assign Vanguard Hero'
})

function openPicker(target) {
  pickerFor.value = target
}

function isInTarget(heroKey) {
  if (!pickerFor.value) return false
  if (pickerFor.value.type === 'lane') {
    return siege.lanes[pickerFor.value.lane].includes(heroKey)
  }
  return siege.phase2Party[pickerFor.value.slot] === heroKey
}

function isLockedOut(heroKey) {
  if (!pickerFor.value || pickerFor.value.type !== 'lane') return false
  const current = siege.heroCurrentLane(heroKey)
  return current !== null && current !== pickerFor.value.lane
}

function heroBadge(heroKey) {
  if (!pickerFor.value) return null
  if (pickerFor.value.type === 'lane') {
    const lane = siege.heroCurrentLane(heroKey)
    if (lane) return LANE_LABELS[lane]
    return null
  }
  const idx = siege.phase2Party.indexOf(heroKey)
  if (idx !== -1 && idx !== pickerFor.value.slot) return 'Vanguard'
  return null
}

function pickHero(heroKey) {
  if (!pickerFor.value) return
  if (isLockedOut(heroKey)) return
  if (pickerFor.value.type === 'lane') {
    siege.addToLane(pickerFor.value.lane, heroKey)
  } else {
    siege.setPhase2Slot(pickerFor.value.slot, heroKey)
  }
  pickerFor.value = null
}
</script>

<style scoped>
.setup-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.setup-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(6,3,2,0.92) 100%);
  pointer-events: none;
}

/* ── Header ─────────────────────────────────────────────────── */
.setup-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.btn-back {
  background: none;
  border: 1px solid #333;
  color: #888;
  font-size: 0.72rem;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-head);
  letter-spacing: 1px;
  transition: all 0.15s;
}
.btn-back:hover { border-color: #666; color: #ccc; }

.setup-header-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-head);
}
.sh-house  { font-weight: 700; font-size: 0.78rem; }
.sh-sep    { color: #444; font-size: 0.7rem; }
.sh-event  { color: #ccc; font-size: 0.72rem; }
.sh-tier   { font-size: 0.7rem; font-weight: 700; }
.setup-header-right { width: 80px; }

/* ── Body ───────────────────────────────────────────────────── */
.setup-body {
  position: relative;
  z-index: 1;
  flex: 1;
  display: grid;
  grid-template-columns: 240px 1fr 260px;
  gap: 14px;
  padding: 16px 20px;
  overflow: hidden;
  min-height: 0;
}

.panel {
  background: rgba(10,6,3,0.75);
  border: 1px solid #1e1008;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  backdrop-filter: blur(6px);
}

.panel-label {
  font-family: var(--font-head);
  font-size: 0.56rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #555;
  border-bottom: 1px solid #1a1008;
  padding-bottom: 8px;
  flex-shrink: 0;
}

/* ── Army panel ─────────────────────────────────────────────── */
.unit-rows { display: flex; flex-direction: column; gap: 8px; }

.unit-row {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid #1a1008;
  border-left: 3px solid var(--uc);
  border-radius: 6px;
  padding: 7px 8px;
}

.unit-icon { font-size: 1rem; flex-shrink: 0; width: 22px; text-align: center; }
.unit-info { flex: 1; min-width: 0; }
.unit-name { font-size: 0.65rem; font-weight: 700; color: #ccc; margin-bottom: 3px; }
.unit-bar-wrap { height: 3px; background: #1a1008; border-radius: 2px; margin-bottom: 3px; }
.unit-bar { height: 100%; border-radius: 2px; transition: width 0.3s; }
.unit-count { font-size: 0.56rem; color: #555; }

.btn-recruit {
  background: none;
  border: 1px solid var(--uc);
  color: var(--uc);
  font-size: 0.6rem;
  font-weight: 700;
  font-family: var(--font-head);
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
  flex-shrink: 0;
}
.btn-recruit:hover:not(:disabled) { background: color-mix(in srgb, var(--uc) 15%, transparent); }
.btn-recruit:disabled { opacity: 0.3; cursor: not-allowed; }

.recruit-cost-hint { display: flex; flex-direction: column; gap: 4px; }
.cost-line { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.cost-unit-name { font-size: 0.54rem; color: #555; min-width: 74px; }
.cost-chip { font-size: 0.54rem; padding: 1px 5px; border-radius: 3px; border: 1px solid; }
.bar-cost   { color: #c8962a; border-color: #c8962a44; background: #c8962a11; }
.plank-cost { color: #c8a87a; border-color: #c8a87a44; background: #c8a87a11; }
.cost-chip.short { color: #e05050; border-color: #e0505044; background: #e0505011; }

/* ── Center panel ───────────────────────────────────────────── */
.center-panel { gap: 0; padding: 0; overflow: hidden; }

/* Phase tabs */
.phase-tabs {
  display: flex;
  border-bottom: 1px solid #1a1008;
  flex-shrink: 0;
}

.phase-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  font-family: var(--font-head);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}
.phase-tab:hover { color: #888; background: rgba(255,255,255,0.02); }
.phase-tab.active { color: #ccc; border-bottom-color: #c8962a; background: rgba(255,255,255,0.03); }

.pt-num { font-size: 0.58rem; color: inherit; opacity: 0.6; }
.pt-label { }
.pt-status { font-size: 0.6rem; color: #2a1808; transition: color 0.2s; }
.pt-status.ready { color: #4dff88; }

/* Readiness row */
.readiness-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-top: 1px solid #1a1008;
  flex-shrink: 0;
}
.readiness-dot { font-size: 0.65rem; color: #2a1808; transition: color 0.2s; }
.readiness-dot.ready { color: #4dff88; }
.readiness-text { font-size: 0.62rem; color: #555; }
.readiness-text.missing { color: #5a3030; }

/* ── Phase 1: Lanes ─────────────────────────────────────────── */
.lanes-view {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr auto;
  gap: 10px;
  padding: 12px;
  overflow: hidden;
  min-height: 0;
}

.deploy-total {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 0.56rem;
  color: #444;
  font-family: var(--font-head);
  letter-spacing: 1px;
  text-transform: uppercase;
  padding-top: 4px;
}

.lane-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid #1a1008;
  border-radius: 8px;
  padding: 10px 10px 8px;
  overflow: hidden;
  min-height: 0;
}

.lane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.lane-name {
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #888;
}
.lane-count {
  font-size: 0.56rem;
  color: #444;
  font-family: var(--font-head);
}
.lane-count.full { color: #c8962a; }

.lane-commanders {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  min-height: 60px;
}

.lane-empty-hint {
  font-size: 0.58rem;
  color: #2a1a0a;
  text-align: center;
  font-style: italic;
  padding: 8px 0;
  border: 1px dashed #1e1008;
  border-radius: 6px;
  margin-top: auto;
  margin-bottom: auto;
}

.lane-hero {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  background: rgba(255,255,255,0.02);
  border: 1px solid #1e1008;
  border-radius: 6px;
  padding: 6px 6px 6px 8px;
  flex-shrink: 0;
}

.lane-hero-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.lane-hero-name {
  font-size: 0.62rem;
  font-weight: 700;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unit-selector {
  display: flex;
  gap: 3px;
}
.unit-pick-btn {
  width: 24px;
  height: 24px;
  border: 1px solid #2a1a0a;
  background: rgba(255,255,255,0.02);
  border-radius: 4px;
  font-size: 0.72rem;
  cursor: pointer;
  transition: all 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.unit-pick-btn:hover { border-color: #555; background: rgba(255,255,255,0.06); }
.unit-pick-btn.active { background: rgba(255,255,255,0.07); }

.lane-unit-label {
  font-size: 0.56rem;
  color: #888;
}
.lane-unit-label.missing { color: #5a2a2a; }
.lane-unit-count { color: #555; margin-left: 2px; }

.lane-hero-remove {
  background: none;
  border: none;
  color: #3a1a1a;
  font-size: 0.6rem;
  cursor: pointer;
  padding: 2px 4px;
  border-radius: 3px;
  transition: all 0.12s;
  flex-shrink: 0;
  margin-top: 2px;
}
.lane-hero-remove:hover { color: #cc5555; background: rgba(200,40,40,0.1); }

.lane-add-btn {
  background: none;
  border: 1px dashed #2a1808;
  color: #4a3020;
  font-size: 0.6rem;
  font-family: var(--font-head);
  letter-spacing: 1px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
  text-align: center;
}
.lane-add-btn:hover:not(:disabled) { border-color: #5a3820; color: #8a6040; background: rgba(255,255,255,0.02); }
.lane-add-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ── Phase 2: Vanguard ───────────────────────────────────────── */
.phase2-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px;
  overflow: hidden;
}

.phase2-subtitle {
  font-size: 0.65rem;
  color: #555;
  font-style: italic;
  text-align: center;
  max-width: 360px;
  line-height: 1.7;
}

.hero-slots {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.hero-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100px;
}

.slot-portrait {
  position: relative;
  cursor: pointer;
}
.slot-clear {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #1a0808;
  border: 1px solid #5a1a1a;
  color: #cc5555;
  font-size: 0.55rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.12s;
}
.slot-clear:hover { background: #5a1a1a; color: #ffaaaa; }

.slot-name {
  font-size: 0.66rem;
  font-weight: 700;
  color: #ccc;
  text-align: center;
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slot-empty {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px dashed #2a1a0a;
  background: rgba(255,255,255,0.02);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.15s;
}
.slot-empty:hover { border-color: #5a3a1a; background: rgba(255,255,255,0.04); }
.slot-empty-icon { font-size: 1.3rem; color: #3a2a1a; line-height: 1; }
.slot-empty-label { font-size: 0.48rem; color: #3a2a1a; text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-head); }

/* ── Intel panel ─────────────────────────────────────────────── */
.intel-block { display: flex; flex-direction: column; gap: 6px; }
.intel-faction { font-family: var(--font-head); font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
.intel-dispatch { font-size: 0.63rem; color: #888; line-height: 1.7; font-style: italic; }

.intel-matchup { display: flex; flex-direction: column; gap: 6px; }
.intel-row { display: flex; align-items: center; justify-content: space-between; }
.intel-label { font-size: 0.56rem; color: #555; text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-head); }
.intel-val { font-size: 0.63rem; color: #ccc; font-weight: 600; }

.affinity-chip { font-size: 0.58rem; padding: 2px 8px; border-radius: 8px; font-weight: 700; }
.affinity-chip.force  { background: rgba(26,6,0,0.6);  color: #ff8c42; border: 1px solid #66331166; }
.affinity-chip.magic  { background: rgba(0,16,31,0.6); color: #4fa8ff; border: 1px solid #11336666; }
.affinity-chip.spirit { background: rgba(0,16,8,0.6);  color: #4dff88; border: 1px solid #11663366; }
.affinity-chip.void   { background: rgba(15,0,26,0.6); color: #b44fff; border: 1px solid #44118866; }

.garrison-preview { display: flex; flex-direction: column; gap: 4px; }
.garrison-label { font-size: 0.54rem; font-family: var(--font-head); text-transform: uppercase; letter-spacing: 2px; color: #555; margin-bottom: 2px; }
.garrison-line { font-size: 0.63rem; color: #888; display: flex; gap: 6px; }
.garrison-dot { color: #5a3a1a; }

/* ── Footer ─────────────────────────────────────────────────── */
.setup-footer {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 14px 24px;
  border-top: 1px solid rgba(255,255,255,0.04);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}

.phase-indicators {
  display: flex;
  align-items: center;
  gap: 8px;
}
.pi-dot { font-size: 0.62rem; font-family: var(--font-head); color: #2a1808; transition: color 0.2s; }
.pi-dot.ready { color: #4dff88; }
.pi-sep { color: #2a1808; font-size: 0.6rem; }

.btn-march {
  padding: 13px 44px;
  font-family: var(--font-head);
  font-size: 0.84rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  border-radius: 8px;
  border: 1px solid #333;
  background: rgba(255,255,255,0.04);
  color: #444;
  cursor: not-allowed;
  transition: all 0.2s;
}
.btn-march:not(:disabled) {
  cursor: pointer;
  background: rgba(255,255,255,0.05);
}
.btn-march:not(:disabled):hover {
  background: rgba(255,255,255,0.1);
  box-shadow: 0 0 30px -8px currentColor;
}

/* ── Hero picker modal ───────────────────────────────────────── */
.picker-backdrop {
  position: absolute;
  inset: 0;
  z-index: 10;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
}

.picker-modal {
  background: #0e0906;
  border: 1px solid #3e1c0c;
  border-radius: 12px;
  padding: 20px;
  width: 500px;
  max-height: 72vh;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.picker-title {
  font-family: var(--font-head);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #ccc;
}
.picker-close {
  background: none;
  border: none;
  color: #666;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 4px 8px;
}
.picker-close:hover { color: #ccc; }

.picker-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  overflow-y: auto;
}

.picker-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 6px;
  border: 1px solid #2a1208;
  border-radius: 8px;
  background: #130908;
  cursor: pointer;
  transition: all 0.12s;
  position: relative;
}
.picker-hero:hover:not(.locked-out) { border-color: #5a2810; background: #1a0d09; }
.picker-hero.in-target { border-color: #c8962a55; background: #1a1208; }
.picker-hero.locked-out { opacity: 0.28; cursor: not-allowed; }

.ph-name {
  font-size: 0.58rem;
  font-weight: 700;
  color: #ccc;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}
.ph-bp {
  font-size: 0.54rem;
  color: #666;
  font-family: var(--font-head);
  letter-spacing: 0.5px;
}
.ph-badge {
  font-size: 0.5rem;
  color: #c8962a;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-family: var(--font-head);
}
</style>
