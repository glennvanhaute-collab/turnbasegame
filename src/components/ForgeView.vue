<template>
  <div class="forge-view">

    <!-- Materials row -->
    <div class="materials-row">
      <div
        v-for="(meta, id) in forge.MATERIALS"
        :key="id"
        class="material-chip"
        :style="{ '--mat-color': meta.color }"
        :title="meta.desc"
      >
        <span class="mat-gem">◆</span>
        <span class="mat-label">{{ meta.label }}</span>
        <span class="mat-count">{{ forge.materials[id] }}</span>
      </div>
    </div>

    <div class="forge-body">

      <!-- Left: Crafting -->
      <div class="craft-panel">
        <h3 class="panel-title">Craft Orbs</h3>
        <div class="orb-recipes">
          <div
            v-for="(meta, id) in forge.ORBS"
            :key="id"
            class="orb-recipe"
            :class="{ 'can-craft': forge.canCraft(id) }"
            :style="{ '--orb-color': meta.color }"
          >
            <div class="orb-header">
              <OrbIcon :orbId="id" :size="44" />
              <div class="orb-info">
                <div class="orb-name">{{ meta.label }}</div>
                <div class="orb-owned">×{{ forge.orbs[id] }} owned</div>
              </div>
            </div>
            <p class="orb-desc">{{ meta.desc }}</p>
            <div class="orb-recipe-cost">
              <span
                v-for="(qty, mat) in meta.recipe"
                :key="mat"
                class="cost-chip"
                :class="{ lacking: forge.materials[mat] < qty }"
              >
                <span class="cost-gem" :style="{ color: forge.MATERIALS[mat]?.color }">◆</span>
                {{ qty }}× {{ forge.MATERIALS[mat]?.label }}
              </span>
            </div>
            <button
              class="btn-craft"
              :disabled="!forge.canCraft(id)"
              @click="forge.craft(id)"
            >Craft</button>
          </div>
        </div>
      </div>

      <!-- Right: Orbing workspace -->
      <div class="orb-panel">
        <div class="panel-title-row">
          <h3 class="panel-title">Apply Orb</h3>
          <div class="orb-summary">
            <span v-for="(meta, id) in forge.ORBS" :key="id" class="orb-summary-item" :style="{ '--orb-color': meta.color }">
              <OrbIcon :orbId="id" :size="28" />
              <span class="orb-summary-count">{{ forge.orbs[id] }}</span>
            </span>
          </div>
        </div>

        <!-- Item selector -->
        <div class="workspace">
          <div class="ws-row">
            <label class="ws-label">Item</label>
            <select class="ws-select" v-model="selectedItemId">
              <option value="">— Select Legendary / Mythical gear —</option>
              <option
                v-for="item in orbableItems"
                :key="item.instanceId"
                :value="item.instanceId"
              >{{ item.name }} ({{ item.rarity }}) · {{ item.lines.filter(l => l.type === 'discovery').length }} lines</option>
            </select>
          </div>

          <!-- Current lines -->
          <div class="lines-preview" v-if="selectedItem">
            <div class="lines-label">Current lines</div>
            <div class="lines-list">
              <div
                v-for="(line, i) in selectedItem.lines.filter(l => l.type === 'discovery')"
                :key="i"
                class="line-chip"
              >{{ line.label }}</div>
              <div class="line-chip line-empty" v-if="!selectedItem.lines.some(l => l.type === 'discovery')">
                No discovery lines yet — orbing adds 1
              </div>
            </div>
          </div>

          <!-- Orb selector -->
          <div class="ws-row" v-if="selectedItem">
            <label class="ws-label">Orb</label>
            <div class="orb-picker">
              <button
                v-for="(meta, id) in forge.ORBS"
                :key="id"
                class="orb-pick-btn"
                :class="{ selected: selectedOrb === id, disabled: forge.orbs[id] === 0 }"
                :style="{ '--orb-color': meta.color }"
                :disabled="forge.orbs[id] === 0"
                @click="selectedOrb = id"
              >
                <OrbIcon :orbId="id" :size="32" />
                <span class="cp-name">{{ meta.label }}</span>
                <span class="cp-count">×{{ forge.orbs[id] }}</span>
              </button>
            </div>
          </div>

          <button
            class="btn-apply"
            v-if="selectedItem && selectedOrb"
            :disabled="forge.orbs[selectedOrb] === 0"
            @click="applySelectedOrb"
          >
            Apply {{ forge.ORBS[selectedOrb]?.label }}
          </button>

          <!-- Dark Orb preview -->
          <div class="dark-preview" v-if="forge.darkPreview">
            <div class="dp-title"><OrbIcon orbId="dark" :size="22" style="vertical-align:middle;margin-right:6px;" /> Astral Orb — Choose your lines</div>
            <div class="dp-compare">
              <div class="dp-col">
                <div class="dp-col-label">Current</div>
                <div class="line-chip" v-for="(l,i) in forge.darkPreview.oldLines" :key="'old'+i">{{ l.label }}</div>
                <div class="line-chip line-empty" v-if="!forge.darkPreview.oldLines.length">No lines</div>
              </div>
              <div class="dp-arrow">→</div>
              <div class="dp-col">
                <div class="dp-col-label new-label">New Roll</div>
                <div class="line-chip line-new" v-for="(l,i) in forge.darkPreview.newLines" :key="'new'+i">{{ l.label }}</div>
              </div>
            </div>
            <div class="dp-actions">
              <button class="btn-keep-new" @click="forge.confirmDark(true)">Keep New</button>
              <button class="btn-keep-old" @click="forge.confirmDark(false)">Keep Current</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useForgeStore } from '../stores/useForgeStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import OrbIcon from './OrbIcon.vue'

const forge     = useForgeStore()
const inventory = useInventoryStore()

const selectedItemId = ref('')
const selectedOrb    = ref('')

const orbableItems = computed(() =>
  inventory.ownedInstances.filter(i => i.rarity === 'Legendary' || i.rarity === 'Mythical')
)

const selectedItem = computed(() =>
  selectedItemId.value
    ? inventory.instanceById(selectedItemId.value)
    : null
)

function applySelectedOrb() {
  if (!selectedItemId.value || !selectedOrb.value) return
  forge.applyOrb(selectedItemId.value, selectedOrb.value)
}
</script>

<style scoped>
.forge-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Materials */
.materials-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.material-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #120a04;
  border: 1px solid var(--border-brown);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: default;
  transition: border-color 0.15s;
}
.material-chip:hover { border-color: var(--mat-color); }
.mat-gem   { color: var(--mat-color); font-size: 1rem; }
.mat-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
.mat-count { font-size: 0.88rem; font-weight: 800; color: var(--mat-color); margin-left: 4px; }

/* Two column layout */
.forge-body {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 20px;
  align-items: start;
}
.panel-title {
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 14px;
}

/* Craft panel */
.craft-panel {
  background: #0e0805;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 18px;
}
.orb-recipes { display: flex; flex-direction: column; gap: 12px; }
.orb-recipe {
  background: #140c06;
  border: 1px solid #2a1a08;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.2s;
}
.orb-recipe.can-craft { border-color: color-mix(in srgb, var(--orb-color) 40%, transparent); }
.orb-header { display: flex; align-items: center; gap: 10px; }
.orb-gem    { font-size: 1.3rem; color: var(--orb-color); }
.orb-info   { display: flex; flex-direction: column; gap: 1px; }
.orb-name   { font-size: 0.8rem; font-weight: 700; color: var(--orb-color); }
.orb-owned  { font-size: 0.6rem; color: #554; }
.orb-desc   { font-size: 0.68rem; color: #776; line-height: 1.5; }
.orb-recipe-cost { display: flex; gap: 8px; flex-wrap: wrap; }
.cost-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.64rem;
  color: #887;
  background: #0a0602;
  border: 1px solid #1a1008;
  border-radius: 6px;
  padding: 2px 8px;
}
.cost-chip.lacking { color: #cc3333; border-color: #3a1010; }
.cost-gem { font-size: 0.7rem; }
.btn-craft {
  padding: 7px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--orb-color) 35%, transparent);
  background: color-mix(in srgb, var(--orb-color) 10%, transparent);
  color: var(--orb-color);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
  align-self: flex-end;
  min-width: 72px;
}
.btn-craft:hover:not(:disabled) { background: color-mix(in srgb, var(--orb-color) 20%, transparent); }
.btn-craft:disabled { opacity: 0.3; cursor: not-allowed; }

.panel-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.panel-title-row .panel-title { margin-bottom: 0; }

.orb-summary { display: flex; gap: 8px; align-items: center; }
.orb-summary-item { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.orb-summary-count {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--orb-color);
  line-height: 1;
}

/* Orb panel */
.orb-panel {
  background: #0e0805;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 18px;
}
.workspace { display: flex; flex-direction: column; gap: 14px; }
.ws-row { display: flex; flex-direction: column; gap: 6px; }
.ws-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
.ws-select {
  background: #0a0602;
  border: 1px solid #3a1e0a;
  border-radius: 6px;
  color: var(--text-parchment);
  font-size: 0.76rem;
  padding: 8px 10px;
  width: 100%;
  cursor: pointer;
}
.ws-select option { background: #1a0e06; }

/* Lines preview */
.lines-preview { display: flex; flex-direction: column; gap: 6px; }
.lines-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
.lines-list { display: flex; flex-wrap: wrap; gap: 6px; }
.line-chip {
  font-size: 0.68rem;
  font-weight: 700;
  color: #cc88ff;
  background: #1a0828;
  border: 1px solid #44116655;
  border-radius: 6px;
  padding: 3px 10px;
}
.line-chip.line-empty { color: #443; background: #0e0805; border-color: #1a1008; font-weight: 400; font-style: italic; }
.line-chip.line-new   { color: #44ffaa; background: #081a10; border-color: #114422; }

/* Orb picker */
.orb-picker { display: flex; gap: 8px; flex-wrap: wrap; }
.orb-pick-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid #2a1a08;
  background: #0a0602;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  flex: 1;
}
.orb-pick-btn:hover:not(.disabled):not(.selected) { border-color: var(--orb-color); }
.orb-pick-btn.selected {
  border-color: var(--orb-color);
  background: color-mix(in srgb, var(--orb-color) 12%, transparent);
}
.orb-pick-btn.disabled { opacity: 0.35; cursor: not-allowed; }
.cp-gem   { font-size: 1.1rem; color: var(--orb-color); }
.cp-name  { font-size: 0.66rem; font-weight: 700; color: var(--orb-color); flex: 1; text-align: left; }
.cp-count { font-size: 0.62rem; color: #554; }

.btn-apply {
  padding: 11px;
  border-radius: 8px;
  border: 1px solid var(--border-gold);
  background: #1c1208;
  color: var(--gold);
  font-family: var(--font-head);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-apply:hover:not(:disabled) { background: #2a1c0a; border-color: var(--gold-bright); }
.btn-apply:disabled { opacity: 0.35; cursor: not-allowed; }

/* Dark Orb preview */
.dark-preview {
  background: #0e0618;
  border: 1px solid #6622cc55;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.dp-title { font-size: 0.75rem; font-weight: 800; color: #aa77ff; letter-spacing: 0.5px; }
.dp-compare {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}
.dp-col { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.dp-col-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; color: #554; margin-bottom: 2px; }
.dp-col-label.new-label { color: #2a8844; }
.dp-arrow { color: #aa77ff; font-size: 1.2rem; margin-top: 24px; flex-shrink: 0; }
.dp-actions { display: flex; gap: 10px; }
.btn-keep-new {
  flex: 1;
  padding: 9px;
  border-radius: 7px;
  border: 1px solid #114422;
  background: #081a10;
  color: #44ffaa;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-keep-new:hover { background: #0d2a1a; border-color: #226644; }
.btn-keep-old {
  flex: 1;
  padding: 9px;
  border-radius: 7px;
  border: 1px solid #2a1a08;
  background: #0e0805;
  color: #887;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-keep-old:hover { background: #1a0e06; color: #aaa; }
</style>
