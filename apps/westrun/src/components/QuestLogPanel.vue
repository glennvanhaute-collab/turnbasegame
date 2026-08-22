<template>
  <div class="ql-wrap">

    <!-- Cipher puzzle modal -->
    <Teleport to="body">
      <div v-if="showCipher" class="ql-cipher-backdrop" @click.self="showCipher = false">
        <div class="ql-cipher-modal">
          <button class="ql-cipher-close" @click="showCipher = false">✕</button>
          <CipherPuzzle @solved="onCipherSolved" />
        </div>
      </div>
    </Teleport>

    <!-- ── Left: quest list ── -->
    <div class="ql-list">
      <div class="ql-list-header">
        <span class="ql-progress">{{ completedCount }} of {{ questStore.QUESTS.length }} quests complete</span>
        <span class="ql-qp-total">{{ questStore.totalQP }}<span class="ql-qp-label"> QP</span></span>
      </div>

      <template v-for="group in groups" :key="group.status">
        <div class="ql-group-label">{{ group.label }}</div>
        <div
          v-for="q in group.quests"
          :key="q.id"
          class="ql-item"
          :class="[`status-${group.status}`, { 'is-selected': selectedId === q.id }]"
          @click="selectedId = q.id"
        >
          <span class="ql-dot" />
          <span class="ql-item-name">{{ q.name }}</span>
          <span class="ql-item-qp">{{ q.questPoints }}QP</span>
        </div>
      </template>
    </div>

    <!-- ── Right: detail ── -->
    <div class="ql-detail" v-if="selected">
      <div class="ql-detail-top">
        <span class="ql-type-tag" :class="`type-${selected.quest.type.toLowerCase()}`">{{ selected.quest.type }}</span>
        <span class="ql-status-badge" :class="`badge-${selected.status}`">{{ STATUS_LABEL[selected.status] }}</span>
      </div>

      <h2 class="ql-detail-name">{{ selected.quest.name }}</h2>

      <p class="ql-lore" :class="{ 'is-locked': selected.status === 'locked' }">
        {{ selected.status === 'locked' ? selected.quest.lockedLore : selected.quest.lore }}
      </p>

      <!-- Locked: vague requirements -->
      <div v-if="selected.status === 'locked'" class="ql-section">
        <p class="ql-section-label">Requirements</p>
        <div v-for="(req, i) in selected.quest.vagueReqs" :key="i" class="ql-vague-req">
          <span class="ql-req-bullet">◦</span>{{ req }}
        </div>
      </div>

      <!-- Available / dispatch_ready: objectives -->
      <div v-else-if="selected.status !== 'completed' && selected.objectives.length" class="ql-section">
        <p class="ql-section-label">Objectives</p>
        <div
          v-for="obj in selected.objectives"
          :key="obj.id"
          class="ql-objective"
          :class="{ 'obj-done': obj.done }"
        >
          <span class="ql-obj-icon">{{ obj.done ? '✓' : '○' }}</span>
          <span class="ql-obj-text">{{ obj.label }}</span>
          <template v-if="obj.type === 'donate' && !obj.done">
            <span class="ql-donate-count">
              {{ questStore.donateAvailableCount(selected.quest.id, obj.id) }}/{{ obj.count }}
            </span>
            <button
              class="ql-donate-btn"
              :disabled="!questStore.canDonate(selected.quest.id, obj.id)"
              @click="questStore.donateItems(selected.quest.id, obj.id)"
            >Donate</button>
          </template>
          <template v-if="obj.type === 'puzzle' && !obj.done">
            <button class="ql-donate-btn" @click="showCipher = true">Open Cipher</button>
          </template>
          <template v-if="obj.type === 'raidSetComplete' && !obj.done">
            <div class="ql-raidset-progress">
              <span class="ql-raidset-count">{{ raidSetProgress.count }}/5</span>
              <span
                v-for="s in raidSetProgress.slots"
                :key="s.slot"
                class="ql-raidset-slot"
                :class="{ 'ql-raidset-slot--owned': s.owned }"
              >{{ SLOT_LABELS[s.slot] }}</span>
            </div>
          </template>
        </div>
        <div v-if="selected.status === 'dispatch_ready'" class="ql-dispatch-ready-note">
          A dispatch awaits you in the Hall.
        </div>
      </div>

      <!-- Completed: outcome -->
      <div v-if="selected.status === 'completed'" class="ql-section">
        <p class="ql-section-label">Outcome</p>
        <p class="ql-outcome-text">{{ selected.quest.options.find(o => o.id === questStore.chosenOptions[selected.quest.id])?.outcomeText ?? '—' }}</p>
      </div>

      <div class="ql-reward-row">
        <span class="ql-section-label">Reward</span>
        <div class="ql-reward-chips">
          <span class="ql-qp-chip">{{ selected.quest.questPoints }} QP</span>
          <span v-for="r in selected.quest.options[0]?.reward" :key="r.type" class="ql-reward-chip">
            {{ r.amount }}× {{ SCROLL_LABEL[r.type] }}
          </span>
        </div>
      </div>
    </div>

    <div class="ql-detail ql-empty" v-else>
      <p>Select a quest from the log.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuestStore } from '../stores/useQuestStore.js'
import { useBattleStore } from '../stores/useBattleStore.js'
import { useDungeonStore } from '../stores/useDungeonStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import CipherPuzzle from './CipherPuzzle.vue'

const questStore   = useQuestStore()
const battleStore  = useBattleStore()
const dungeonStore = useDungeonStore()
const collection   = useCollectionStore()
const inventory    = useInventoryStore()

const STATUS_LABEL = {
  completed:      'Completed',
  available:      'In Progress',
  dispatch_ready: 'Ready',
  locked:         'Locked',
}

const SCROLL_LABEL = {
  commonWrit:    'Common Writ',
  sealedCharter: 'Sealed Charter',
  houseSeal:     'House Seal',
}

const SLOT_LABELS = { head: 'Helm', chest: 'Chest', legs: 'Legs', boots: 'Boots', gloves: 'Gloves' }

const gameStats = computed(() => ({
  battleWins:      battleStore.battleWins,
  dungeonClears:   dungeonStore.dungeonClears,
  heroCount:       collection.ownedKeys.filter(k => k !== 'PLAYER_CHARACTER').length,
  raidClears:      battleStore.clearedRaids.size,
  siegeClears:     battleStore.siegeClears,
  ownedInstances:  inventory.ownedInstances,
}))

const GEAR_SLOTS = ['head', 'chest', 'legs', 'boots', 'gloves']

const raidSetProgress = computed(() => {
  const instances = inventory.ownedInstances
  const make = (setId, setName) => {
    const slots = GEAR_SLOTS.map(slot => ({ slot, owned: instances.some(i => i.setId === setId && i.slot === slot) }))
    return { setId, setName, slots, count: slots.filter(s => s.owned).length }
  }
  const r = make('regret', 'Regalia of Regret')
  const n = make('null_panoply', 'Null Panoply')
  return r.count >= n.count ? r : n
})

const selectedId  = ref(null)
const showCipher  = ref(false)

function onCipherSolved() {
  showCipher.value = false
  // find which quest+objective has type 'puzzle' that is currently in progress
  for (const q of questStore.QUESTS) {
    for (const obj of q.objectives ?? []) {
      if (obj.type === 'puzzle' && !questStore.completedIds.has(q.id)) {
        const status = questStore.questStatus(q.id, gameStats.value)
        if (status === 'available' || status === 'dispatch_ready') {
          questStore.markManualDone(q.id, obj.id)
          return
        }
      }
    }
  }
}

const questsWithStatus = computed(() =>
  questStore.QUESTS.map(q => ({
    quest:      q,
    status:     questStore.questStatus(q.id, gameStats.value),
    objectives: questStore.objectiveProgress(q, gameStats.value),
  }))
)

const selected = computed(() =>
  questsWithStatus.value.find(q => q.quest.id === selectedId.value) ?? null
)

const completedCount = computed(() =>
  questsWithStatus.value.filter(q => q.status === 'completed').length
)

const STATUS_ORDER = ['dispatch_ready', 'available', 'completed', 'locked']
const GROUP_LABELS = {
  dispatch_ready: 'Ready',
  available:      'In Progress',
  completed:      'Completed',
  locked:         'Locked',
}

const groups = computed(() =>
  STATUS_ORDER
    .map(status => ({
      status,
      label:  GROUP_LABELS[status],
      quests: questsWithStatus.value.filter(q => q.status === status).map(q => q.quest),
    }))
    .filter(g => g.quests.length > 0)
)
</script>

<style scoped>
/* ── Cipher modal ── */
.ql-cipher-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.ql-cipher-modal {
  position: relative;
  border: 1px solid #3a2e18;
  border-radius: 4px;
  background: #09080c;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.9), 0 0 20px rgba(80, 60, 20, 0.2);
}

.ql-cipher-close {
  position: absolute;
  top: 10px;
  right: 14px;
  background: none;
  border: none;
  color: #4a4030;
  font-size: 0.9rem;
  cursor: pointer;
  z-index: 1;
  transition: color 0.12s;
}
.ql-cipher-close:hover { color: #9a8e70; }

.ql-wrap {
  display: flex;
  height: 100%;
  overflow: hidden;
  background: #09080c;
}

/* ── List ── */
.ql-list {
  width: 260px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid #1e1a2a;
}

.ql-list-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 14px 14px 10px;
  border-bottom: 1px solid #1e1a2a;
  flex-shrink: 0;
}

.ql-progress {
  font-size: 0.62rem;
  color: #7a7090;
  letter-spacing: 0.3px;
}

.ql-qp-total {
  font-size: 0.78rem;
  font-weight: 700;
  color: #d4af37;
  font-variant-numeric: tabular-nums;
}
.ql-qp-label { font-size: 0.6rem; font-weight: 400; color: #9a8050; }

.ql-group-label {
  padding: 10px 14px 4px;
  font-size: 0.55rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #504868;
}

.ql-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: background 0.12s;
}
.ql-item:hover { background: #110f18; }
.ql-item.is-selected { background: #130f1e; border-left-color: currentColor; }

.ql-item.status-completed      { color: #4dff88; }
.ql-item.status-available      { color: #9a8e70; }
.ql-item.status-dispatch_ready { color: #d4af37; }
.ql-item.status-locked         { color: #3a3448; }

.ql-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  opacity: 0.9;
}

.ql-item-name {
  flex: 1;
  font-size: 0.68rem;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.9;
}
.ql-item.status-locked .ql-item-name     { color: #4a4260; opacity: 1; }
.ql-item.status-completed .ql-item-name  { color: #7a9e88; }

.ql-item-qp {
  font-size: 0.58rem;
  color: #504868;
  flex-shrink: 0;
}
.ql-item.status-completed .ql-item-qp { color: #4d7a60; }

/* ── Detail ── */
.ql-detail {
  flex: 1;
  overflow-y: auto;
  padding: 22px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ql-empty {
  justify-content: center;
  align-items: center;
  color: #3a3448;
  font-size: 0.72rem;
  font-style: italic;
}

.ql-detail-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ql-type-tag {
  font-size: 0.55rem;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 2px;
  font-weight: 700;
}
.type-story     { background: #1a1a3a; color: #7c8cff; }
.type-house     { background: #2a1a0a; color: #c8962a; }
.type-puzzle    { background: #2a0a2a; color: #e060ff; }
.type-character { background: #0a2a0a; color: #4dff88; }
.type-combat    { background: #2a0a0a; color: #ff6060; }
.type-craft     { background: #1a1a0a; color: #c8c030; }
.type-lore      { background: #0a1a2a; color: #60b0ff; }
.type-final     { background: #2a0808; color: #ff4040; border: 1px solid #5a1010; }

.ql-status-badge {
  font-size: 0.58rem;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 2px;
}
.badge-completed      { background: #0a2a14; color: #4dff88; }
.badge-available      { background: #1a1628; color: #7a7090; }
.badge-dispatch_ready { background: #2a1e00; color: #d4af37; }
.badge-locked         { background: #1a1620; color: #4a4260; }

.ql-detail-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: #d4c9a8;
  line-height: 1.2;
  margin: 0;
}

.ql-lore {
  font-size: 0.72rem;
  color: #9a8e70;
  line-height: 1.7;
  margin: 0;
}
.ql-lore.is-locked {
  color: #4a4260;
  font-style: italic;
}

.ql-section {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ql-section-label {
  font-size: 0.55rem;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: #504868;
  margin: 0;
}

.ql-vague-req {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 0.7rem;
  color: #5a5070;
  font-style: italic;
}
.ql-req-bullet { color: #3a3048; font-size: 0.8rem; }

.ql-objective {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  color: #9a8e70;
}
.ql-obj-icon {
  font-size: 0.65rem;
  color: #5a5070;
  flex-shrink: 0;
  width: 12px;
}
.ql-obj-text { flex: 1; }
.ql-objective.obj-done         { color: #4a7a5a; }
.ql-objective.obj-done .ql-obj-icon { color: #4dff88; }

.ql-donate-count {
  font-size: 0.6rem;
  color: #5a5070;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
}

.ql-donate-btn {
  flex-shrink: 0;
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 9px;
  background: #1a1508;
  border: 1px solid #3a3020;
  color: #d4af37;
  border-radius: 2px;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
}
.ql-donate-btn:hover:not(:disabled) {
  background: #241e0a;
  border-color: #5a5030;
}
.ql-donate-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.ql-raidset-progress {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.ql-raidset-count {
  font-size: 0.62rem;
  color: #6a6040;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  min-width: 24px;
}

.ql-raidset-slot {
  font-size: 0.62rem;
  padding: 2px 7px;
  border-radius: 2px;
  border: 1px solid #2a2418;
  color: #4a4030;
  background: #0d0b0a;
  letter-spacing: 0.04em;
}

.ql-raidset-slot--owned {
  color: #4dcc88;
  border-color: #1a4a2a;
  background: #0a1a10;
}

.ql-dispatch-ready-note {
  font-size: 0.68rem;
  color: #d4af37;
  font-style: italic;
  padding-top: 4px;
}

.ql-outcome-text {
  font-size: 0.7rem;
  color: #7a8e7a;
  line-height: 1.6;
  font-style: italic;
  margin: 0;
}

.ql-reward-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid #1a1628;
}

.ql-reward-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ql-qp-chip {
  font-size: 0.65rem;
  padding: 2px 8px;
  background: #1a140a;
  color: #d4af37;
  border: 1px solid #3a2e10;
  border-radius: 2px;
}

.ql-reward-chip {
  font-size: 0.65rem;
  padding: 2px 8px;
  background: #101020;
  color: #7090c0;
  border: 1px solid #202040;
  border-radius: 2px;
}
</style>
