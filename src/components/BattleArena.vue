<template>

  <!-- ── Dungeon Victory Screen ──────────────────────────────────── -->
  <div class="dungeon-victory" v-if="isDungeonVictory">

    <!-- md-12: dungeon image with Victory overlay -->
    <div
      class="dv-scene"
      :style="dungeonBg ? { backgroundImage: `url(${dungeonBg})` } : {}"
    >
      <div class="dv-gradient" />
      <div class="dv-text">
        <div class="dv-victory">Victory!</div>
        <div class="dv-name">{{ encounter.name }}</div>
      </div>
    </div>

    <!-- md-12: rewards + actions -->
    <div class="dv-rewards">
      <div class="dv-rewards-title">Rewards</div>

      <div class="dv-chips">
        <div class="chip gold" v-if="store.lastReward.gold > 0">
          🪙 +{{ store.lastReward.gold.toLocaleString() }}
        </div>
        <div class="chip diamonds" v-if="store.lastReward.diamonds > 0">
          💎 +{{ store.lastReward.diamonds }}
        </div>
        <div
          v-for="drop in store.lastReward.oreDrops"
          :key="drop.oreId"
          class="drop-chip"
          :style="{ '--c': ORES[drop.oreId]?.color ?? '#888' }"
        >
          <span class="dot" />{{ ORES[drop.oreId]?.name ?? drop.oreId }} ×{{ drop.amount }}
        </div>
        <div
          v-for="drop in store.lastReward.gatherDrops?.hides"
          :key="'h_'+drop.id"
          class="drop-chip"
          :style="{ '--c': HIDES[drop.id]?.color ?? '#888' }"
        >
          <span class="dot" />{{ HIDES[drop.id]?.name ?? drop.id }} ×{{ drop.amount }}
        </div>
        <div
          v-for="drop in store.lastReward.gatherDrops?.fibers"
          :key="'f_'+drop.id"
          class="drop-chip"
          :style="{ '--c': FIBERS[drop.id]?.color ?? '#888' }"
        >
          <span class="dot" />{{ FIBERS[drop.id]?.name ?? drop.id }} ×{{ drop.amount }}
        </div>
        <div
          v-for="key in store.lastReward.componentDrops"
          :key="key"
          class="drop-chip"
          :style="{ '--c': UPGRADE_COMPONENTS[key]?.color ?? '#888' }"
        >
          <span class="dot" />{{ UPGRADE_COMPONENTS[key]?.name ?? key }}
        </div>
        <div
          v-for="kd in store.lastReward.keyDrops"
          :key="'k_'+kd.tier"
          class="drop-chip"
          :style="{ '--c': DUNGEON_KEY_COLORS[kd.tier] ?? '#888' }"
        >
          <span class="dot" />{{ DUNGEON_KEY_NAMES[kd.tier] ?? kd.tier }} ×{{ kd.amount }}
        </div>
        <div
          v-for="lf in store.lastReward.loreFragments"
          :key="'lf_'+lf.frag.id"
          class="drop-chip"
          style="--c: #d4a855"
        >
          <span class="dot" />📜 Lore Fragment
        </div>
        <div class="chip dim" v-if="!store.lastReward.gold && !store.lastReward.diamonds && !store.lastReward.oreDrops?.length && !store.lastReward.gatherDrops?.hides?.length && !store.lastReward.gatherDrops?.fibers?.length && !store.lastReward.componentDrops?.length && !store.lastReward.keyDrops?.length && !store.lastReward.loreFragments?.length">
          No drops this run
        </div>
      </div>

      <div class="dv-actions">
        <button class="dv-btn dv-btn-back" @click="$emit('back')">← Dungeons</button>
      </div>
    </div>

  </div>

  <!-- ── Normal Battle Arena ─────────────────────────────────────── -->
  <div class="battle-arena" v-else>

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

        <!-- Forge unlock banner -->
        <div class="forge-unlock-banner" v-if="store.lastReward.forgeUnlock === 'darksteel'">
          <span class="forge-unlock-icon">⚒</span>
          <div class="forge-unlock-text">
            <div class="forge-unlock-title">Darksteel Forge Unlocked</div>
            <div class="forge-unlock-sub">You can now smelt Darksteel Bars at the Blacksmith.</div>
          </div>
        </div>

        <!-- Lore fragment drops -->
        <template v-if="store.lastReward.loreFragments?.length">
          <div class="lore-frag-banner" v-for="frag in store.lastReward.loreFragments" :key="frag.frag.id">
            <span class="lore-frag-icon">📜</span>
            <div class="lore-frag-text">
              <div class="lore-frag-title">Lore Fragment Discovered</div>
              <div class="lore-frag-sub">{{ frag.heroTitle }} — {{ frag.frag.title }}</div>
            </div>
          </div>
        </template>

        <!-- Drops -->
        <div class="drops-row" v-if="store.lastReward.oreDrops?.length || store.lastReward.gatherDrops?.hides?.length || store.lastReward.gatherDrops?.fibers?.length || store.lastReward.componentDrops?.length || store.lastReward.keyDrops?.length">
          <div
            v-for="drop in store.lastReward.oreDrops"
            :key="drop.oreId"
            class="drop-chip"
            :style="{ '--c': ORES[drop.oreId]?.color ?? '#888' }"
          >
            <span class="dot" />{{ ORES[drop.oreId]?.name ?? drop.oreId }} ×{{ drop.amount }}
          </div>
          <div
            v-for="drop in store.lastReward.gatherDrops?.hides"
            :key="'h_'+drop.id"
            class="drop-chip"
            :style="{ '--c': HIDES[drop.id]?.color ?? '#888' }"
          >
            <span class="dot" />{{ HIDES[drop.id]?.name ?? drop.id }} ×{{ drop.amount }}
          </div>
          <div
            v-for="drop in store.lastReward.gatherDrops?.fibers"
            :key="'f_'+drop.id"
            class="drop-chip"
            :style="{ '--c': FIBERS[drop.id]?.color ?? '#888' }"
          >
            <span class="dot" />{{ FIBERS[drop.id]?.name ?? drop.id }} ×{{ drop.amount }}
          </div>
          <div
            v-for="key in store.lastReward.componentDrops"
            :key="key"
            class="drop-chip"
            :style="{ '--c': UPGRADE_COMPONENTS[key]?.color ?? '#888' }"
          >
            <span class="dot" />{{ UPGRADE_COMPONENTS[key]?.name ?? key }}
          </div>
          <div
            v-for="kd in store.lastReward.keyDrops"
            :key="'k_'+kd.tier"
            class="drop-chip"
            :style="{ '--c': DUNGEON_KEY_COLORS[kd.tier] ?? '#888' }"
          >
            <span class="dot" />{{ DUNGEON_KEY_NAMES[kd.tier] ?? kd.tier }} ×{{ kd.amount }}
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
        <button v-if="$isDev" class="btn btn-dev-instant" @click="store.devCompleteBatch()">⚡ Instant Complete</button>
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
          <button
            class="btn btn-batch"
            v-if="!encounter?.isDungeon"
            :disabled="!currency.canAffordDiamonds(BATCH10_COST)"
            @click="startBatch"
          >⚡ Run 10× <span class="batch-cost">💎{{ BATCH10_COST }}</span></button>
          <button
            class="btn btn-batch100"
            v-if="canRun100 && !encounter?.isDungeon"
            :disabled="!currency.canAffordDiamonds(BATCH100_COST)"
            @click="startBatch100"
          >⚡ Run 100× <span class="batch-cost">💎{{ BATCH100_COST }}</span></button>
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
import { useCurrencyStore }   from '../stores/useCurrencyStore.js'
import { ORES }               from '../game/data/ores.js'
import { HIDES }              from '../game/data/hides.js'
import { FIBERS }             from '../game/data/fibers.js'
import { UPGRADE_COMPONENTS } from '../game/data/upgradeComponents.js'
import { DUNGEON_KEY_NAMES, DUNGEON_KEY_COLORS } from '../game/data/dungeons.js'
import CombatStage from './PixiCombatStage.vue'
import SkillPanel  from './SkillPanel.vue'
import BattleLog   from './BattleLog.vue'

defineEmits(['back'])

// ── Dungeon victory background (same logic as DungeonCard) ─────────
const _dungeonBgs = import.meta.glob('../assets/dungeons/dungeon_*.png', { eager: true })
const DUNGEON_TIER_PREFIX = { medium: 'intermediate' }
function dungeonTierBgs(tier) {
  const prefix = `dungeon_${DUNGEON_TIER_PREFIX[tier.toLowerCase()] ?? tier.toLowerCase()}_`
  return Object.entries(_dungeonBgs).filter(([p]) => p.includes(prefix)).map(([, m]) => m.default)
}
const dungeonBg = computed(() => {
  const enc = encounter.value
  if (!enc?.isDungeon) return null
  const pool = dungeonTierBgs(enc.tier ?? 'easy')
  if (!pool.length) return null
  const seed = enc.id ?? enc.dungeonId ?? ''
  const idx = [...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % pool.length
  return pool[idx]
})

const isDungeonVictory = computed(() =>
  store.state === 'victory' && !!encounter.value?.isDungeon && !!store.lastReward
)

const playerHero = usePlayerHeroStore()
const store      = useBattleStore()
const collection = useCollectionStore()
const currency   = useCurrencyStore()

const BATCH10_COST  = 5
const BATCH100_COST = 25

const rarityAtBattleStart = ref(playerHero.rarity)
const rarityChanged = computed(() =>
  store.lastReward?.levelsGained > 0 && playerHero.rarity !== rarityAtBattleStart.value
)

const canRun100 = computed(() => !encounter.value?.isDungeon)

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
  if (!currency.spendDiamonds(BATCH10_COST)) return
  store.startBatchRun(10)
}
function startBatch100() {
  if (!currency.spendDiamonds(BATCH100_COST)) return
  store.startBatchRun(100)
}
</script>

<style scoped>
/* ── Two-column grid ─────────────────────────────────────────────── */
.battle-arena {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  width: 100%;
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
  container-type: inline-size;
  container-name: combat-col;
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
.levelup-rarity.mythical  { background: #2a0808; color: #ff2244; }
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

.forge-unlock-banner {
  display: flex; align-items: center; gap: 10px;
  background: rgba(124,92,191,0.12); border: 1px solid #7c5cbf;
  border-radius: 8px; padding: 10px 14px;
}
.forge-unlock-icon { font-size: 1.4rem; flex-shrink: 0; }
.forge-unlock-title { font-size: 0.78rem; font-weight: 700; color: #b48fff; font-family: var(--font-head); letter-spacing: 1px; }
.forge-unlock-sub   { font-size: 0.62rem; color: var(--text-muted); margin-top: 2px; }

.lore-frag-banner {
  display: flex; align-items: center; gap: 10px;
  background: rgba(180,144,80,0.10); border: 1px solid #a07840;
  border-radius: 8px; padding: 10px 14px;
}
.lore-frag-icon  { font-size: 1.2rem; flex-shrink: 0; }
.lore-frag-title { font-size: 0.78rem; font-weight: 700; color: #d4a855; font-family: var(--font-head); letter-spacing: 1px; }
.lore-frag-sub   { font-size: 0.62rem; color: var(--text-muted); margin-top: 2px; font-style: italic; }

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
.btn-batch      { background: #0a1a2a; color: #4fa8ff; border: 1px solid #1a3a5a; }
.btn-batch100   { background: #180a2a; color: #b44fff; border: 1px solid #3a1a5a; }
.batch-cost     { margin-left: 5px; font-size: 0.65em; opacity: 0.7; }
.btn-dev-instant { background: #0a2a0a; color: #88cc44; border: 1px dashed #3a5a10; font-size: 0.7rem; }

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

/* ── Dungeon Victory Screen ──────────────────────────────────────── */
.dungeon-victory {
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 48px rgba(0,0,0,0.8);
}

.dv-scene {
  position: relative;
  width: 100%;
  height: 380px;
  background-color: #080808;
  background-size: cover;
  background-position: center 20%;
  flex-shrink: 0;
}
.dv-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.10) 0%,
    rgba(0,0,0,0.20) 55%,
    rgba(0,0,0,0.80) 100%
  );
}
.dv-text {
  position: absolute;
  bottom: 28px;
  left: 0; right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.dv-victory {
  font-family: var(--font-head);
  font-size: 2.4rem;
  font-weight: 900;
  color: #4dff88;
  letter-spacing: 6px;
  text-transform: uppercase;
  text-shadow:
    0 0 24px rgba(77,255,136,0.8),
    0 0 48px rgba(77,255,136,0.4),
    0 2px 8px rgba(0,0,0,0.9);
  animation: dv-pulse 1.2s ease-out;
}
.dv-name {
  font-family: var(--font-head);
  font-size: 0.75rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255,230,180,0.7);
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
}
@keyframes dv-pulse {
  from { opacity: 0; transform: scale(1.06); }
  to   { opacity: 1; transform: scale(1); }
}

.dv-rewards {
  background: #0a0604;
  border-top: 1px solid #2a1a08;
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.dv-rewards-title {
  font-family: var(--font-head);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #555;
  font-weight: 700;
}
.dv-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  min-height: 32px;
}
.chip.dim { color: #444; border-color: #222; }

.dv-actions {
  display: flex;
  gap: 10px;
}
.dv-btn {
  padding: 11px 28px;
  border-radius: 7px;
  font-weight: 700;
  font-size: 0.84rem;
  cursor: pointer;
  transition: opacity 0.15s;
  border: none;
}
.dv-btn:hover { opacity: 0.85; }
.dv-btn-retry { background: #5c2810; color: #d4a060; border: 1px solid #7a3a18; }
.dv-btn-back  { background: #3e1c0c; color: #ccc; }
</style>
