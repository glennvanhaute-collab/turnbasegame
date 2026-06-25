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

      <!-- Left: Army readiness + recruit -->
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
            <button
              class="btn-recruit"
              :disabled="!siege.canRecruit(unit.id)"
              @click="siege.recruit(unit.id)"
            >+{{ unit.recruitPer }}</button>
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

      <!-- Center: Hero slots -->
      <div class="panel hero-slots-panel">
        <div class="panel-label">War Party</div>

        <div class="hero-slots">
          <div v-for="(heroKey, i) in siege.party" :key="i" class="hero-slot">

            <!-- Filled slot -->
            <template v-if="heroKey">
              <div class="slot-portrait" @click="openPicker(i)">
                <HeroAvatar :hero="heroForKey(heroKey)" :size="72" />
                <button class="slot-clear" @click.stop="siege.clearPartySlot(i)">✕</button>
              </div>
              <div class="slot-name">{{ heroForKey(heroKey)?.name ?? heroKey }}</div>

              <!-- Unit type selector -->
              <div class="unit-selector">
                <button
                  v-for="unit in UNIT_LIST"
                  :key="unit.id"
                  class="unit-pick-btn"
                  :class="{ active: siege.assignments[heroKey] === unit.id }"
                  :style="siege.assignments[heroKey] === unit.id ? { borderColor: unit.color, color: unit.color } : {}"
                  :title="unit.name"
                  @click="siege.assignUnit(heroKey, unit.id)"
                >{{ unit.icon }}</button>
              </div>
              <div class="slot-unit-label" v-if="siege.assignments[heroKey]">
                {{ UNIT_TYPES[siege.assignments[heroKey]].name }}
                <span class="slot-unit-count">({{ siege.army[siege.assignments[heroKey]] }})</span>
              </div>
              <div class="slot-unit-label missing" v-else>No unit assigned</div>
            </template>

            <!-- Empty slot -->
            <template v-else>
              <button class="slot-empty" @click="openPicker(i)">
                <span class="slot-empty-icon">+</span>
                <span class="slot-empty-label">Assign Hero</span>
              </button>
            </template>
          </div>
        </div>

        <!-- Readiness status -->
        <div class="readiness-row">
          <span class="readiness-dot" :class="{ ready: siege.partyReady }">◆</span>
          <span class="readiness-text" v-if="siege.partyReady">War party ready to march</span>
          <span class="readiness-text missing" v-else>Assign 3 heroes with units to march</span>
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
      <button
        class="btn-march"
        :disabled="!siege.partyReady"
        :style="siege.partyReady ? { borderColor: faction.color, color: faction.color } : {}"
        @click="$emit('march')"
      >
        ⚔ March on {{ faction.house }}
      </button>
    </div>

    <!-- ── Hero Picker Modal ─────────────────────────────────────────── -->
    <div v-if="pickerOpen" class="picker-backdrop" @click.self="pickerOpen = false">
      <div class="picker-modal">
        <div class="picker-header">
          <span class="picker-title">Assign Commander</span>
          <button class="picker-close" @click="pickerOpen = false">✕</button>
        </div>
        <div class="picker-grid">
          <button
            v-for="entry in availableHeroes"
            :key="entry.key"
            class="picker-hero"
            :class="{ selected: siege.party.includes(entry.key) }"
            @click="pickHero(entry.key)"
          >
            <HeroAvatar :hero="entry.hero" :size="52" />
            <span class="ph-name">{{ entry.hero.name }}</span>
            <span class="ph-taken" v-if="siege.party.includes(entry.key) && siege.party.indexOf(entry.key) !== pickerSlot">In party</span>
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
import { UNIT_TYPES, UNIT_LIST } from '../game/data/siegeUnits.js'
import { PLANK_LIST } from '../game/data/planks.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'

const props = defineProps({
  faction: { type: Object, required: true },
  tier:    { type: Object, required: true },
})
defineEmits(['back', 'march'])

const siege     = useSiegeStore()
const resources = useResourceStore()
const collection = useCollectionStore()

const BAR_NAMES   = { copper: 'Copper Bar', tin: 'Tin Bar', steel: 'Steel Bar', darksteel: 'Darksteel Bar', mithril: 'Mithril Bar' }
const PLANK_NAMES = Object.fromEntries(PLANK_LIST.map(p => [p.id, p.name]))

function heroForKey(key) {
  if (!key) return null
  const entry = collection.roster.find(r => r.key === key)
  return entry ? entry.hero : (HERO_TEMPLATES[key]?.() ?? null)
}

const availableHeroes = computed(() =>
  collection.roster.filter(r => r.hero?.isPlayer)
)

// ── Hero picker ──────────────────────────────────────────────────
const pickerOpen = ref(false)
const pickerSlot = ref(0)

function openPicker(slotIndex) {
  pickerSlot.value = slotIndex
  pickerOpen.value = true
}

function pickHero(heroKey) {
  siege.setPartySlot(pickerSlot.value, heroKey)
  pickerOpen.value = false
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
  grid-template-columns: 260px 1fr 280px;
  gap: 16px;
  padding: 20px 24px;
  overflow: hidden;
}

.panel {
  background: rgba(10,6,3,0.7);
  border: 1px solid #1e1008;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
}

/* ── Army panel ─────────────────────────────────────────────── */
.unit-rows { display: flex; flex-direction: column; gap: 10px; }

.unit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px solid #1a1008;
  border-left: 3px solid var(--uc);
  border-radius: 6px;
  padding: 8px 10px;
}

.unit-icon { font-size: 1.1rem; flex-shrink: 0; width: 24px; text-align: center; }

.unit-info { flex: 1; min-width: 0; }
.unit-name { font-size: 0.68rem; font-weight: 700; color: #ccc; margin-bottom: 4px; }
.unit-bar-wrap { height: 4px; background: #1a1008; border-radius: 2px; margin-bottom: 3px; }
.unit-bar { height: 100%; border-radius: 2px; transition: width 0.3s; }
.unit-count { font-size: 0.58rem; color: #555; }

.btn-recruit {
  background: none;
  border: 1px solid var(--uc);
  color: var(--uc);
  font-size: 0.62rem;
  font-weight: 700;
  font-family: var(--font-head);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.12s;
  flex-shrink: 0;
}
.btn-recruit:hover:not(:disabled) { background: color-mix(in srgb, var(--uc) 15%, transparent); }
.btn-recruit:disabled { opacity: 0.3; cursor: not-allowed; }

.recruit-cost-hint { display: flex; flex-direction: column; gap: 5px; }
.cost-line { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.cost-unit-name { font-size: 0.56rem; color: #555; min-width: 80px; }
.cost-chip { font-size: 0.56rem; padding: 1px 6px; border-radius: 3px; border: 1px solid; }
.bar-cost   { color: #c8962a; border-color: #c8962a44; background: #c8962a11; }
.plank-cost { color: #c8a87a; border-color: #c8a87a44; background: #c8a87a11; }
.cost-chip.short { color: #e05050; border-color: #e0505044; background: #e0505011; }

/* ── Hero slots ─────────────────────────────────────────────── */
.hero-slots-panel { justify-content: center; align-items: center; }
.hero-slots { display: flex; gap: 20px; justify-content: center; align-items: flex-start; }

.hero-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 110px;
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
  font-size: 0.68rem;
  font-weight: 700;
  color: #ccc;
  text-align: center;
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unit-selector {
  display: flex;
  gap: 4px;
  justify-content: center;
}
.unit-pick-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #333;
  background: rgba(255,255,255,0.03);
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.12s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.unit-pick-btn:hover { border-color: #666; background: rgba(255,255,255,0.07); }
.unit-pick-btn.active { background: rgba(255,255,255,0.08); }

.slot-unit-label {
  font-size: 0.58rem;
  color: #888;
  text-align: center;
}
.slot-unit-label.missing { color: #5a3030; }
.slot-unit-count { color: #555; }

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
.slot-empty-icon { font-size: 1.4rem; color: #3a2a1a; line-height: 1; }
.slot-empty-label { font-size: 0.5rem; color: #3a2a1a; text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-head); }

.readiness-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 4px;
}
.readiness-dot { font-size: 0.7rem; color: #3a2a1a; transition: color 0.2s; }
.readiness-dot.ready { color: #4dff88; }
.readiness-text { font-size: 0.64rem; color: #555; }
.readiness-text.missing { color: #5a3030; }

/* ── Intel panel ─────────────────────────────────────────────── */
.intel-block { display: flex; flex-direction: column; gap: 6px; }
.intel-faction { font-family: var(--font-head); font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
.intel-dispatch { font-size: 0.65rem; color: #888; line-height: 1.7; font-style: italic; }

.intel-matchup { display: flex; flex-direction: column; gap: 6px; }
.intel-row { display: flex; align-items: center; justify-content: space-between; }
.intel-label { font-size: 0.58rem; color: #555; text-transform: uppercase; letter-spacing: 1px; font-family: var(--font-head); }
.intel-val { font-size: 0.65rem; color: #ccc; font-weight: 600; }

.affinity-chip { font-size: 0.6rem; padding: 2px 8px; border-radius: 8px; font-weight: 700; }
.affinity-chip.force  { background: rgba(26,6,0,0.6);  color: #ff8c42; border: 1px solid #66331166; }
.affinity-chip.magic  { background: rgba(0,16,31,0.6); color: #4fa8ff; border: 1px solid #11336666; }
.affinity-chip.spirit { background: rgba(0,16,8,0.6);  color: #4dff88; border: 1px solid #11663366; }
.affinity-chip.void   { background: rgba(15,0,26,0.6); color: #b44fff; border: 1px solid #44118866; }

.garrison-preview { display: flex; flex-direction: column; gap: 5px; }
.garrison-label { font-size: 0.56rem; font-family: var(--font-head); text-transform: uppercase; letter-spacing: 2px; color: #555; margin-bottom: 2px; }
.garrison-line { font-size: 0.65rem; color: #888; display: flex; gap: 6px; }
.garrison-dot { color: #5a3a1a; }

/* ── Footer ─────────────────────────────────────────────────── */
.setup-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  padding: 16px 24px;
  border-top: 1px solid rgba(255,255,255,0.04);
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(8px);
}

.btn-march {
  padding: 14px 48px;
  font-family: var(--font-head);
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  border-radius: 8px;
  border: 1px solid #444;
  background: rgba(255,255,255,0.04);
  color: #555;
  cursor: not-allowed;
  transition: all 0.2s;
}
.btn-march:not(:disabled) {
  cursor: pointer;
  background: rgba(255,255,255,0.06);
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
  width: 480px;
  max-height: 70vh;
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
  font-size: 0.72rem;
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
  gap: 10px;
  overflow-y: auto;
}

.picker-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 6px;
  border: 1px solid #2a1208;
  border-radius: 8px;
  background: #130908;
  cursor: pointer;
  transition: all 0.12s;
  position: relative;
}
.picker-hero:hover { border-color: #5a2810; background: #1a0d09; }
.picker-hero.selected { border-color: #4a3020; opacity: 0.6; cursor: default; }

.ph-name {
  font-size: 0.6rem;
  font-weight: 700;
  color: #ccc;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}
.ph-taken {
  font-size: 0.52rem;
  color: #886644;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
