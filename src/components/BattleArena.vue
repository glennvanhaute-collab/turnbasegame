<template>
  <div class="battle-arena">
    <!-- Visual combat stage -->
    <section>
      <h3 class="encounter-label">{{ encounter?.name }} · {{ encounter?.difficulty }}</h3>
      <CombatStage />
    </section>

    <!-- Skill / status panel -->
    <section class="middle-row">
      <SkillPanel />
    </section>

    <!-- Battle log -->
    <section class="log-row">
      <BattleLog />
    </section>

    <!-- Victory reward panel -->
    <section class="reward-panel" v-if="store.state === 'victory' && store.lastReward">
      <div class="reward-title">Battle Complete!</div>

      <!-- Level-up banner -->
      <div class="levelup-banner" v-if="store.lastReward.levelsGained > 0">
        <span class="levelup-icon">★</span>
        Level Up! → Lv. {{ playerHero.level }}
        <span class="levelup-rarity" :class="playerHero.rarity.toLowerCase()" v-if="rarityChanged">
          Promoted to {{ playerHero.rarity }}!
        </span>
      </div>

      <div class="reward-items">
        <div class="reward-item gold">
          <span class="reward-icon">🪙</span>
          <span class="reward-label">Gold</span>
          <span class="reward-value">+{{ store.lastReward.gold.toLocaleString() }}</span>
        </div>
        <div class="reward-item diamonds" v-if="store.lastReward.diamonds > 0">
          <span class="reward-icon">💎</span>
          <span class="reward-label">Diamonds</span>
          <span class="reward-value">+{{ store.lastReward.diamonds }}</span>
        </div>
        <div class="reward-item xp" v-if="store.lastReward.xp && playerHero.isCreated">
          <span class="reward-icon">⭐</span>
          <span class="reward-label">XP</span>
          <span class="reward-value">+{{ store.lastReward.xp }}</span>
        </div>
      </div>

      <!-- Ore drops -->
      <div class="ore-drops" v-if="store.lastReward.oreDrops?.length">
        <div class="drops-title">⛏ Resources</div>
        <div class="drops-list">
          <div
            v-for="drop in store.lastReward.oreDrops"
            :key="drop.oreId"
            class="drop-chip ore"
            :style="{ '--ore-color': ORES[drop.oreId]?.color ?? '#888' }"
          >
            <span class="ore-dot" />
            <span class="drop-name">{{ ORES[drop.oreId]?.name ?? drop.oreId }}</span>
            <span class="drop-amount">×{{ drop.amount }}</span>
          </div>
        </div>
      </div>

      <!-- Component drops -->
      <div class="ore-drops" v-if="store.lastReward.componentDrops?.length">
        <div class="drops-title">⚙ Components</div>
        <div class="drops-list">
          <div
            v-for="key in store.lastReward.componentDrops"
            :key="key"
            class="drop-chip component"
            :style="{ '--ore-color': UPGRADE_COMPONENTS[key]?.color ?? '#888' }"
          >
            <span class="ore-dot" />
            <span class="drop-name">{{ UPGRADE_COMPONENTS[key]?.name ?? key }}</span>
            <span class="drop-amount">×1</span>
          </div>
        </div>
      </div>

      <!-- XP bar -->
      <div class="xp-bar-wrap" v-if="playerHero.isCreated">
        <div class="xp-bar-label">
          <span>{{ playerHero.heroName }} · Lv.{{ playerHero.level }} · {{ playerHero.rarity }}</span>
          <span>{{ playerHero.xpProgress }} / {{ playerHero.XP_PER_LEVEL }} XP</span>
        </div>
        <div class="xp-bar-track">
          <div class="xp-bar-fill" :style="{ width: (playerHero.xpProgress / playerHero.XP_PER_LEVEL * 100) + '%' }" />
        </div>
      </div>
    </section>

    <!-- Controls -->
    <section class="controls-row" v-if="store.isOver">
      <button
        v-if="store.state === 'victory' && hasNextEncounter"
        class="btn btn-primary"
        @click="nextEncounter"
      >Next Encounter →</button>
      <button class="btn btn-retry" @click="retryEncounter">↺ Retry</button>
      <button class="btn btn-secondary" @click="$emit('back')">← Change Team</button>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBattleStore } from '../stores/useBattleStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { ORES } from '../game/data/ores.js'
import { UPGRADE_COMPONENTS } from '../game/data/upgradeComponents.js'
import CombatStage from './PixiCombatStage.vue'
import SkillPanel from './SkillPanel.vue'
import BattleLog from './BattleLog.vue'

defineEmits(['back'])

const playerHero = usePlayerHeroStore()
const store = useBattleStore()

// Capture rarity at mount to detect promotion after a level-up
const rarityAtBattleStart = ref(playerHero.rarity)
const rarityChanged = computed(() =>
  store.lastReward?.levelsGained > 0 && playerHero.rarity !== rarityAtBattleStart.value
)
const collection = useCollectionStore()
const encounter = computed(() => store.currentEncounter ?? store.ENCOUNTERS?.[store.currentEncounterIndex])
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

</script>

<style scoped>
.battle-arena {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}
.encounter-label {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #444;
  margin: 0 0 8px;
}

.reward-panel {
  background: #0d1a0d;
  border: 1px solid #1a4a1a;
  border-radius: 8px;
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.reward-title {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #4dff88;
  font-weight: 700;
}

/* Level-up banner */
.levelup-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a1400;
  border: 1px solid #ffd700;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #ffd700;
  animation: levelup-pulse 0.6s ease-out;
}
.levelup-icon { font-size: 1rem; }
.levelup-rarity { font-size: 0.68rem; padding: 1px 8px; border-radius: 8px; }
.levelup-rarity.epic      { background: #2a0a3a; color: #b44fff; }
.levelup-rarity.legendary { background: #3a2a00; color: #ffd700; }
.levelup-rarity.mythical  { background: #2a0a2a; color: #ff6ef7; }
@keyframes levelup-pulse { from { transform: scale(1.04); } to { transform: scale(1); } }

.reward-items { display: flex; gap: 10px; flex-wrap: wrap; }
.reward-item {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #0e0706;
  border-radius: 20px;
  padding: 5px 14px;
  border: 1px solid #3e1c0c;
}
.reward-item.gold     { border-color: #3a2a00; }
.reward-item.diamonds { border-color: #0a2040; }
.reward-item.xp       { border-color: #1a2a00; }
.reward-icon  { font-size: 1rem; }
.reward-label { font-size: 0.7rem; color: #666; }
.reward-value { font-size: 0.9rem; font-weight: 700; }
.reward-item.gold     .reward-value { color: #ffd700; }
.reward-item.diamonds .reward-value { color: #88ccff; }
.reward-item.xp       .reward-value { color: #aaff44; }

/* Ore drops */
.ore-drops   { display: flex; flex-direction: column; gap: 8px; }
.drops-title { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); font-weight: 600; }
.drops-list  { display: flex; gap: 8px; flex-wrap: wrap; }
.drop-chip.ore {
  background: #0e0a06;
  border: 1px solid color-mix(in srgb, var(--ore-color) 35%, #2a1a08);
  border-radius: 20px;
  padding: 5px 12px 5px 8px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.ore-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--ore-color);
  box-shadow: 0 0 6px var(--ore-color);
  flex-shrink: 0;
}
.drop-name   { font-size: 0.78rem; font-weight: 600; color: var(--text-parchment); }
.drop-amount { font-size: 0.72rem; font-weight: 700; color: var(--ore-color); }

/* XP bar */
.xp-bar-wrap { display: flex; flex-direction: column; gap: 4px; }
.xp-bar-label { display: flex; justify-content: space-between; font-size: 0.62rem; color: #555; }
.xp-bar-track { height: 4px; background: #1a2a00; border-radius: 2px; overflow: hidden; }
.xp-bar-fill  { height: 100%; background: linear-gradient(to right, #4dff88, #aaff44); border-radius: 2px; transition: width 0.6s ease; }

.controls-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}
.btn {
  padding: 10px 24px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.9rem;
  transition: opacity 0.15s;
}
.btn:hover     { opacity: 0.85; }
.btn-primary   { background: #e94560; color: #fff; }
.btn-retry     { background: #5c2810; color: #d4a060; border: 1px solid #7a3a18; }
.btn-secondary { background: #3e1c0c; color: #ccc; }

</style>
