<template>
  <div class="battle-arena">

    <!-- ── Left: combat ──────────────────────────────────────────── -->
    <div class="col-combat">
      <div class="encounter-label">{{ encounter?.name }} · {{ encounter?.difficulty }}</div>
      <CombatStage />
      <SkillPanel v-if="!store.isOver" />
    </div>

    <!-- ── Right: info panel ─────────────────────────────────────── -->
    <div class="col-info">

      <!-- Rewards (top of right col, shown on victory) -->
      <div class="reward-panel" v-if="store.state === 'victory' && store.lastReward">

        <div class="reward-title">
          Victory!
          <span class="training-badge" v-if="store.currentEncounter?.isTraining">Training</span>
        </div>

        <!-- Level-up -->
        <div class="levelup-banner" v-if="store.lastReward.levelsGained > 0">
          ★ Level Up! → Lv. {{ playerHero.level }}
          <span class="levelup-rarity" :class="playerHero.rarity.toLowerCase()" v-if="rarityChanged">
            {{ playerHero.rarity }}!
          </span>
        </div>

        <!-- Currency + XP -->
        <div class="reward-chips">
          <div class="chip gold" v-if="store.lastReward.gold > 0">
            🪙 +{{ store.lastReward.gold.toLocaleString() }}
          </div>
          <div class="chip diamonds" v-if="store.lastReward.diamonds > 0">
            💎 +{{ store.lastReward.diamonds }}
          </div>
          <div class="chip xp" v-if="store.lastReward.xp && playerHero.isCreated">
            ⭐ +{{ store.lastReward.xp }} XP
          </div>
        </div>

        <!-- Drops -->
        <div class="drops-row" v-if="store.lastReward.oreDrops?.length || store.lastReward.componentDrops?.length">
          <div
            v-for="drop in store.lastReward.oreDrops"
            :key="drop.oreId"
            class="drop-chip"
            :style="{ '--c': ORES[drop.oreId]?.color ?? '#888' }"
          >
            <span class="dot" />{{ ORES[drop.oreId]?.name ?? drop.oreId }} ×{{ drop.amount }}
          </div>
          <div
            v-for="key in store.lastReward.componentDrops"
            :key="key"
            class="drop-chip"
            :style="{ '--c': UPGRADE_COMPONENTS[key]?.color ?? '#888' }"
          >
            <span class="dot" />{{ UPGRADE_COMPONENTS[key]?.name ?? key }}
          </div>
        </div>

        <!-- XP bar -->
        <div class="xp-bar-wrap" v-if="playerHero.isCreated">
          <div class="xp-bar-label">
            <span>{{ playerHero.heroName }} · Lv.{{ playerHero.level }}</span>
            <span>{{ playerHero.xpProgress }} / {{ playerHero.XP_PER_LEVEL }}</span>
          </div>
          <div class="xp-bar-track">
            <div class="xp-bar-fill" :style="{ width: (playerHero.xpProgress / playerHero.XP_PER_LEVEL * 100) + '%' }" />
          </div>
        </div>
      </div>

      <!-- Battle log -->
      <BattleLog />

      <!-- Batch progress (replaces controls while running) -->
      <div class="batch-progress" v-if="store.isBatchRunning">
        <div class="batch-label">⚡ Run {{ store.batchDone + 1 }} / {{ store.batchTotal }}</div>
        <div class="batch-track">
          <div class="batch-fill" :style="{ width: (store.batchDone / store.batchTotal * 100) + '%' }" />
        </div>
        <button class="btn btn-retry" @click="store.stopBatch()">■ Stop</button>
      </div>

      <!-- Controls after battle -->
      <div class="controls-row" v-if="store.isOver && !store.isBatchRunning">
        <!-- Victory -->
        <template v-if="store.state === 'victory'">
          <button
            v-if="hasNextEncounter"
            class="btn btn-primary"
            @click="nextEncounter"
          >Next →</button>
          <button class="btn btn-retry"      @click="retryEncounter">▷ Run Once</button>
          <button class="btn btn-batch"      v-if="!encounter?.isDungeon" @click="startBatch">⚡ Run 10×</button>
          <button class="btn btn-batch100"   v-if="canRun100 && !encounter?.isDungeon" @click="startBatch100">⚡ Run 100×</button>
          <button class="btn btn-secondary" @click="$emit('back')">← Team</button>
        </template>
        <!-- Defeat -->
        <template v-else>
          <button class="btn btn-retry"     @click="retryEncounter">↺ Retry</button>
          <button class="btn btn-secondary" @click="$emit('back')">← Team</button>
        </template>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBattleStore }     from '../stores/useBattleStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { ORES }               from '../game/data/ores.js'
import { UPGRADE_COMPONENTS } from '../game/data/upgradeComponents.js'
import CombatStage from './PixiCombatStage.vue'
import SkillPanel  from './SkillPanel.vue'
import BattleLog   from './BattleLog.vue'

defineEmits(['back'])

const playerHero = usePlayerHeroStore()
const store      = useBattleStore()
const collection = useCollectionStore()

const rarityAtBattleStart = ref(playerHero.rarity)
const rarityChanged = computed(() =>
  store.lastReward?.levelsGained > 0 && playerHero.rarity !== rarityAtBattleStart.value
)

const EPIC_OR_HIGHER = new Set(['Epic', 'Legendary', 'Mythical', 'Ancient'])
const canRun100 = computed(() =>
  encounter.value?.difficulty === 'Easy' &&
  EPIC_OR_HIGHER.has(playerHero.rarity)
)

const encounter = computed(() =>
  store.currentEncounter ?? store.ENCOUNTERS?.[store.currentEncounterIndex]
)
const hasNextEncounter = computed(() =>
  !store.currentEncounter?.isDungeon &&
  store.currentEncounterIndex >= 0 &&
  store.currentEncounterIndex < (store.ENCOUNTERS?.length ?? 0) - 1
)

function nextEncounter() {
  const team = collection.buildTeam()
  store.initBattle(store.currentEncounterIndex + 1, team)
}
function retryEncounter() {
  const team = collection.buildTeam()
  store.initBattle(store.currentEncounterIndex, team)
}
function startBatch() {
  store.startBatchRun(10)
}
function startBatch100() {
  store.startBatchRun(100)
}
</script>

<style scoped>
/* ── Two-column grid ─────────────────────────────────────────────── */
.battle-arena {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 14px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
  align-items: start;
}
@media (max-width: 680px) {
  .battle-arena { grid-template-columns: 1fr; padding: 10px; }
}

/* ── Left column ─────────────────────────────────────────────────── */
.col-combat {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.encounter-label {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #444;
}

/* ── Right column ────────────────────────────────────────────────── */
.col-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* ── Reward panel ────────────────────────────────────────────────── */
.reward-panel {
  background: #0d1a0d;
  border: 1px solid #1a4a1a;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.reward-title {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4dff88;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}
.training-badge {
  font-size: 0.55rem;
  color: #666;
  border: 1px solid #333;
  border-radius: 4px;
  padding: 1px 6px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.levelup-banner {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #1a1400;
  border: 1px solid #ffd700;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 0.76rem;
  font-weight: 700;
  color: #ffd700;
  animation: levelup-pulse 0.6s ease-out;
}
.levelup-rarity {
  font-size: 0.62rem;
  padding: 1px 7px;
  border-radius: 8px;
}
.levelup-rarity.epic      { background: #2a0a3a; color: #b44fff; }
.levelup-rarity.legendary { background: #3a2a00; color: #ffd700; }
.levelup-rarity.mythical  { background: #2a0a2a; color: #ff6ef7; }
@keyframes levelup-pulse { from { transform: scale(1.03); } to { transform: scale(1); } }

.reward-chips { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  line-height: 1;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 20px;
  background: #0e0706;
  border: 1px solid #3e1c0c;
}
.chip.gold     { color: #ffd700; border-color: #3a2a00; }
.chip.diamonds { color: #88ccff; border-color: #0a2040; }
.chip.xp       { color: #aaff44; border-color: #1a2a00; }

.drops-row { display: flex; gap: 6px; flex-wrap: wrap; }
.drop-chip {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-parchment);
  background: #0e0a06;
  border: 1px solid color-mix(in srgb, var(--c) 30%, #2a1a08);
  border-radius: 20px;
  padding: 4px 10px 4px 7px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c);
  box-shadow: 0 0 5px var(--c);
  flex-shrink: 0;
}

.xp-bar-wrap  { display: flex; flex-direction: column; gap: 3px; }
.xp-bar-label { display: flex; justify-content: space-between; font-size: 0.58rem; color: #555; }
.xp-bar-track { height: 3px; background: #1a2a00; border-radius: 2px; overflow: hidden; }
.xp-bar-fill  { height: 100%; background: linear-gradient(to right, #4dff88, #aaff44); border-radius: 2px; transition: width 0.6s ease; }

/* ── Controls ────────────────────────────────────────────────────── */
.controls-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn {
  flex: 1;
  padding: 9px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.82rem;
  transition: opacity 0.15s;
  white-space: nowrap;
}
.btn:hover     { opacity: 0.85; }
.btn-primary   { background: #e94560; color: #fff; }
.btn-retry     { background: #5c2810; color: #d4a060; border: 1px solid #7a3a18; }
.btn-secondary { background: #3e1c0c; color: #ccc; }
.btn-batch     { background: #0a1a2a; color: #4fa8ff; border: 1px solid #1a3a5a; }
.btn-batch100  { background: #180a2a; color: #b44fff; border: 1px solid #3a1a5a; }

/* ── Batch progress ──────────────────────────────────────────────── */
.batch-progress {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #080d14;
  border: 1px solid #1a3050;
  border-radius: 8px;
  padding: 10px 12px;
}
.batch-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #4fa8ff;
  letter-spacing: 0.5px;
}
.batch-track {
  height: 3px;
  background: #0e1a28;
  border-radius: 2px;
  overflow: hidden;
}
.batch-fill {
  height: 100%;
  background: linear-gradient(to right, #4fa8ff, #88ccff);
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>
