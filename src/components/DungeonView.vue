<template>
  <div class="dungeon-wrap">

    <!-- Header -->
    <div class="dungeon-header">
      <h2 class="dungeon-title">Dungeons</h2>
      <p class="dungeon-intro">Spend energy to discover what lurks nearby. Choose wisely — the hardest path may hold treasures with power beyond ordinary gear.</p>
    </div>

    <!-- Explore button -->
    <div class="explore-row">
      <button
        class="explore-btn"
        :disabled="!energy.canAfford(dungeonStore.EXPLORE_COST)"
        @click="doExplore"
      >
        <span class="explore-icon">🔭</span>
        Explore
        <span class="explore-cost">
          <span class="energy-icon">⚡</span>{{ dungeonStore.EXPLORE_COST }}
        </span>
      </button>
      <span class="energy-status">{{ energy.energy }}/{{ energy.maxEnergy }} energy</span>
    </div>

    <!-- Current discovered options -->
    <div v-if="dungeonStore.currentOptions.length" class="section">
      <div class="section-label">Discovered</div>
      <div class="dungeon-grid">
        <DungeonCard
          v-for="d in dungeonStore.currentOptions"
          :key="d.id"
          :dungeon="d"
          @enter="$emit('enter-dungeon', d)"
          @pin="dungeonStore.pin(d.id)"
          @claim="openNodePicker(d.id)"
        />
      </div>
    </div>

    <div v-else-if="explored" class="empty-hint">No dungeons found. Explore again.</div>

    <!-- Pinned Nightmares -->
    <div v-if="dungeonStore.pinnedDungeons.length" class="section">
      <div class="section-label">
        📌 Pinned Nightmares
        <span class="section-note">— saved until you clear them</span>
      </div>
      <div class="dungeon-grid">
        <DungeonCard
          v-for="d in dungeonStore.pinnedDungeons"
          :key="d.id"
          :dungeon="d"
          @enter="$emit('enter-dungeon', d)"
          @unpin="dungeonStore.unpin(d.id)"
        />
      </div>
    </div>

    <!-- Node picker modal -->
    <div class="modal-backdrop" v-if="dungeonStore.pendingNodeId" @click.self="dungeonStore.closeNode()">
      <div class="node-modal">
        <div class="modal-title">
          {{ pendingNode?.nodeType === 'forge' ? '🔨 Ancient Forge' : '✨ Blessed Area' }}
        </div>
        <div class="modal-sub">Choose an item to receive a permanent stat line.</div>

        <div v-if="equippedLegendaries.length" class="legend-list">
          <button
            v-for="entry in equippedLegendaries"
            :key="entry.instance.instanceId"
            class="legend-item"
            :class="entry.instance.rarity.toLowerCase()"
            @click="claimNode(entry.instance.instanceId)"
          >
            <div class="li-name">{{ entry.instance.name }}</div>
            <div class="li-meta">{{ entry.instance.rarity }} · {{ entry.heroName }} · {{ entry.slot }}</div>
            <div class="li-lines" v-if="entry.instance.lines?.length">{{ entry.instance.lines.length }} line{{ entry.instance.lines.length > 1 ? 's' : '' }} already</div>
          </button>
        </div>

        <div v-else class="no-legends">
          No items equipped on your team — equip gear first.
        </div>

        <button class="modal-cancel" @click="dungeonStore.closeNode()">Cancel</button>
      </div>
    </div>

    <!-- Claim result toast -->
    <div class="claim-toast" :class="{ visible: !!claimResult }">
      ✦ {{ claimResult }}
    </div>

    <!-- Empty state -->
    <div v-if="!dungeonStore.currentOptions.length && !dungeonStore.pinnedDungeons.length && !explored" class="empty-state">
      <div class="empty-icon">⚔</div>
      <div class="empty-text">No dungeons discovered yet.</div>
      <div class="empty-sub">Hit Explore to reveal what lurks nearby.</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDungeonStore } from '../stores/useDungeonStore.js'
import { useEnergyStore } from '../stores/useEnergyStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { GearSlot, SLOT_LABELS } from '../game/Gear.js'
import DungeonCard from './DungeonCard.vue'

defineEmits(['enter-dungeon'])

const dungeonStore = useDungeonStore()
const energy       = useEnergyStore()
const inventory    = useInventoryStore()
const collection   = useCollectionStore()
const explored     = ref(dungeonStore.currentOptions.length > 0)
const claimResult  = ref('')
let claimTimer = null

const pendingNode = computed(() =>
  dungeonStore.pendingNodeId
    ? dungeonStore.findDungeon(dungeonStore.pendingNodeId)
    : null
)

// All equipped items across the team — any rarity can receive a node line
const equippedLegendaries = computed(() => {
  const results = []
  for (const heroKey of collection.team) {
    const heroEntry = collection.roster.find(r => r.key === heroKey)
    for (const slot of Object.values(GearSlot)) {
      const item = inventory.getEquippedItem(heroKey, slot)
      if (item) {
        results.push({
          instance: item,
          heroName: heroEntry?.hero?.name ?? heroKey,
          slot: SLOT_LABELS[slot] ?? slot,
        })
      }
    }
  }
  return results
})

function doExplore() {
  dungeonStore.explore()
  explored.value = true
}

function openNodePicker(id) {
  dungeonStore.openNode(id)
}

function claimNode(instanceId) {
  const result = dungeonStore.applyNodeToItem(instanceId)
  if (result) {
    showToast(`${result.itemName} received: ${result.line.label}`)
  }
}

function showToast(msg) {
  claimResult.value = msg
  clearTimeout(claimTimer)
  claimTimer = setTimeout(() => { claimResult.value = '' }, 3500)
}
</script>

<style scoped>
.dungeon-wrap {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.dungeon-header { text-align: center; }
.dungeon-title {
  font-family: var(--font-head);
  font-size: 1.3rem;
  color: var(--gold);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.dungeon-intro {
  font-size: 0.8rem;
  color: var(--text-muted);
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Explore row */
.explore-row { display: flex; align-items: center; gap: 14px; }
.explore-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1a0e05, #2a1508);
  border: 1px solid var(--gold-dim);
  border-radius: 8px;
  color: var(--gold);
  font-family: var(--font-head);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.explore-btn:hover:not(:disabled) { border-color: var(--gold); box-shadow: 0 0 14px rgba(201,162,39,0.25); }
.explore-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.explore-icon { font-size: 1rem; }
.explore-cost {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0,0,0,0.35);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.75rem;
  color: #aaff44;
}
.energy-icon { font-size: 0.78rem; }
.energy-status { font-size: 0.72rem; color: var(--text-muted); }

/* Section */
.section { display: flex; flex-direction: column; gap: 12px; }
.section-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  font-weight: 600;
}
.section-note { text-transform: none; font-style: italic; letter-spacing: 0; color: var(--text-dim); }

.dungeon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 12px;
}

.empty-hint { font-size: 0.75rem; color: var(--text-dim); font-style: italic; }

/* Node picker modal */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.node-modal {
  background: #120a05;
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  padding: 24px;
  width: min(480px, 92vw);
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 0 40px rgba(0,0,0,0.8);
}
.modal-title { font-family: var(--font-head); font-size: 1rem; color: var(--gold); font-weight: 700; letter-spacing: 2px; }
.modal-sub   { font-size: 0.75rem; color: var(--text-muted); }
.legend-list { display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.legend-item {
  background: #0e0804; border: 1px solid #3a1c0a; border-radius: 8px;
  padding: 10px 14px; text-align: left; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  display: flex; flex-direction: column; gap: 3px;
}
.legend-item:hover          { background: #180e06; border-color: var(--gold-dim); }
.legend-item.legendary      { border-color: #7a5228; }
.legend-item.legendary:hover{ border-color: var(--gold); }
.legend-item.mythical       { border-color: #6a1a6a; }
.legend-item.mythical:hover { border-color: #cc44ff; }
.li-name  { font-size: 0.85rem; font-weight: 700; color: var(--text-parchment); }
.li-meta  { font-size: 0.65rem; color: var(--text-muted); }
.li-lines { font-size: 0.62rem; color: #cc44ff; font-weight: 600; }
.no-legends { font-size: 0.75rem; color: var(--text-dim); font-style: italic; text-align: center; padding: 16px 0; }
.modal-cancel {
  align-self: flex-end; background: none; border: 1px solid #3a1c0a;
  border-radius: 6px; color: var(--text-muted); font-size: 0.72rem;
  padding: 6px 16px; cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.modal-cancel:hover { color: #ff6b6b; border-color: #ff6b6b66; }

/* Toast */
.claim-toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  background: #1a1208; border: 1px solid var(--gold-dim);
  border-radius: 8px; padding: 10px 20px;
  font-size: 0.8rem; color: var(--gold); font-weight: 600;
  z-index: 200; pointer-events: none;
  opacity: 0; transition: opacity 0.3s;
}
.claim-toast.visible { opacity: 1; }

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}
.empty-icon { font-size: 2rem; margin-bottom: 12px; opacity: 0.3; }
.empty-text { font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; }
.empty-sub  { font-size: 0.75rem; font-style: italic; }
</style>
