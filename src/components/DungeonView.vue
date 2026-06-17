<template>
  <div class="dungeon-wrap">

    <!-- Header -->
    <div class="dungeon-header">
      <h2 class="dungeon-title">Dungeons</h2>
      <p class="dungeon-intro">Each dungeon costs one key. Keys drop from the training grounds. Harder grounds yield rarer keys.</p>
    </div>

    <!-- Key inventory -->
    <div class="key-bar">
      <div
        v-for="(tier, idx) in KEY_TIERS"
        :key="tier"
        class="key-chip"
        :style="{ '--kc': KEY_COLORS[tier] }"
      >
        <span class="key-icon">🗝</span>
        <span class="key-name">{{ KEY_NAMES[tier] }}</span>
        <span class="key-count" :class="{ zero: resources.getDungeonKeys(tier) === 0 }">
          {{ resources.getDungeonKeys(tier) }}
        </span>
      </div>
    </div>

    <!-- Dungeon tiers -->
    <div v-for="tier in TIERS" :key="tier" class="tier-section">
      <div class="tier-heading" :style="{ '--tc': TIER_COLORS[tier] }">
        <span class="tier-label">{{ tier }}</span>
        <span class="tier-key-count">
          <span class="tier-key-icon">🗝</span>
          {{ KEY_NAMES[KEY_TIERS_BY_TIER[tier]] }} ×{{ resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) }}
        </span>
      </div>
      <div class="dungeon-grid">
        <div
          v-for="dungeon in dungeonsByTier[tier]"
          :key="dungeon.id"
          class="dungeon-card"
          :class="`tier-${tier.toLowerCase()}`"
          :style="pickBg(dungeon.tier, dungeon.id) ? { backgroundImage: `url(${pickBg(dungeon.tier, dungeon.id)})` } : {}"
        >
          <div class="tier-badge" :style="{ color: TIER_COLORS[tier], borderColor: TIER_COLORS[tier] + '44' }">
            {{ tier }}
          </div>

          <div class="card-name">{{ dungeon.name }}</div>

          <div class="card-row">
            <span class="card-label">Enemies</span>
            <span class="card-value">{{ POOL_LABELS[dungeon.enemyPoolId] ?? '?' }}</span>
          </div>

          <div class="card-row">
            <span class="card-label">Loot</span>
            <span class="card-value loot" :style="{ color: TIER_COLORS[tier] }">{{ LOOT_LABEL[tier] }}</span>
          </div>

          <div v-if="dungeon.rewards.diamonds > 0" class="card-row">
            <span class="card-label">Diamonds</span>
            <span class="card-value gold">💎 {{ dungeon.rewards.diamonds }}</span>
          </div>

          <div v-if="tier === 'Nightmare'" class="nightmare-badge">
            ◈ Lines gear guaranteed
          </div>

          <div v-if="mechanicHints(dungeon).length" class="mechanic-hints">
            <div v-for="hint in mechanicHints(dungeon)" :key="hint" class="mechanic-hint">{{ hint }}</div>
          </div>

          <div class="enter-row">
            <button
              class="enter-btn"
              :class="{ 'no-key': resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) === 0 }"
              :style="{ borderColor: TIER_COLORS[tier], color: TIER_COLORS[tier] }"
              :disabled="resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) === 0"
              @click="enterDungeon(dungeon)"
            >
              <span v-if="resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) > 0">🗝 Enter</span>
              <span v-else>No key</span>
            </button>
            <button
              class="enter-btn batch-btn"
              :class="{ 'no-key': resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) < 10 }"
              :style="{ borderColor: TIER_COLORS[tier], color: TIER_COLORS[tier] }"
              :disabled="resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) < 10"
              :title="resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) < 10 ? 'Need 10 keys' : 'Run 10 times, spend 10 keys'"
              @click="enterDungeonBatch(dungeon, 10)"
            >
              <span v-if="resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) >= 10">🗝×10</span>
              <span v-else>🗝×10 ({{ resources.getDungeonKeys(KEY_TIERS_BY_TIER[tier]) }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useResourceStore } from '../stores/useResourceStore.js'
import {
  DUNGEON_LIST,
  POOL_LABELS,
  LOOT_LABEL,
  POOL_MECHANIC_HINTS,
  DUNGEON_KEY_TIERS,
  DUNGEON_KEY_NAMES,
  DUNGEON_KEY_COLORS,
} from '../game/data/dungeons.js'

const emit   = defineEmits(['enter-dungeon'])
const resources = useResourceStore()

const TIERS       = ['Easy', 'Medium', 'Hard', 'Nightmare']
const TIER_COLORS = { Easy: '#4dff88', Medium: '#4fa8ff', Hard: '#ff9944', Nightmare: '#cc44ff' }
const KEY_TIERS   = ['easy', 'medium', 'hard', 'nightmare']
const KEY_NAMES   = DUNGEON_KEY_NAMES
const KEY_COLORS  = DUNGEON_KEY_COLORS

// Maps tier label → key tier string
const KEY_TIERS_BY_TIER = {
  Easy:      DUNGEON_KEY_TIERS.Easy,
  Medium:    DUNGEON_KEY_TIERS.Medium,
  Hard:      DUNGEON_KEY_TIERS.Hard,
  Nightmare: DUNGEON_KEY_TIERS.Nightmare,
}

const dungeonsByTier = computed(() => {
  const map = {}
  for (const tier of TIERS) map[tier] = DUNGEON_LIST.filter(d => d.tier === tier)
  return map
})

function mechanicHints(dungeon) {
  return POOL_MECHANIC_HINTS[dungeon.enemyPoolId] ?? []
}

// Background images — explicit per-dungeon assignments for thematic accuracy
const _dungeonBgs = import.meta.glob('../assets/dungeons/*.png', { eager: true })

const DUNGEON_IMAGE_MAP = {
  dng_goblin_warrens:        'dungeon_easy_01.png',
  dng_crypt_of_ash:          'easy_undead_crypt.png',
  dng_bandit_cave:           'easy_desolate_swamp.png',
  dng_ashveil_mine:          'dungeon_intermediate_01.png',
  dng_thornwood_depths:      'dungeon_intermediate_01.png',
  dng_ruins_of_vel:          'intermediate_forgotten lair.png',
  dng_thornhaven_ruins:      'dungeon_hard_01.png',
  dng_the_dread_spire:       'dungeon_hard_02.png',
  dng_the_crimson_hold:      'hard_vampire_castle.png',
  dng_barrow_kings_tomb:     'dungeon_nightmare_01.png',
  dng_necropolis_of_valdris: 'dungeon_nightmare_01.png',
  dng_the_wailing_crypts:    'dungeon_nightmare_01.png',
}

function pickBg(tier, id) {
  const filename = DUNGEON_IMAGE_MAP[id]
  if (!filename) return null
  return _dungeonBgs[`../assets/dungeons/${filename}`]?.default ?? null
}

function enterDungeon(dungeon) {
  const keyTier = KEY_TIERS_BY_TIER[dungeon.tier]
  if (!resources.spendDungeonKey(keyTier)) return
  emit('enter-dungeon', dungeon)
}

function enterDungeonBatch(dungeon, count) {
  const keyTier = KEY_TIERS_BY_TIER[dungeon.tier]
  if (resources.getDungeonKeys(keyTier) < count) return
  for (let i = 0; i < count; i++) resources.spendDungeonKey(keyTier)
  emit('enter-dungeon', { ...dungeon, batchCount: count })
}
</script>

<style scoped>
.dungeon-wrap {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 60px;
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

/* Key bar */
.key-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
.key-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border: 1px solid var(--kc);
  border-radius: 20px;
  background: rgba(0,0,0,0.3);
  font-size: 0.75rem;
}
.key-icon  { font-size: 0.85rem; }
.key-name  { color: var(--kc); font-weight: 700; }
.key-count { color: var(--kc); font-weight: 700; font-size: 0.9rem; }
.key-count.zero { color: #444; }

/* Tier section */
.tier-section { display: flex; flex-direction: column; gap: 12px; }
.tier-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}
.tier-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--tc);
  font-weight: 700;
}
.tier-key-count {
  font-size: 0.62rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}
.tier-key-icon { font-size: 0.75rem; }

.dungeon-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

/* Cards */
.dungeon-card {
  background: #0e0804;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  min-height: 280px;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-size: cover;
  background-position: center top;
  overflow: hidden;
}
.dungeon-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(8,4,2,0.45) 0%, rgba(8,4,2,0.72) 55%, rgba(8,4,2,0.92) 100%);
  pointer-events: none;
  z-index: 0;
  border-radius: 10px;
}
.dungeon-card > * { position: relative; z-index: 1; }

.dungeon-card.tier-easy      { border-color: #1a4a22; }
.dungeon-card.tier-easy:hover { border-color: #2a7a38; box-shadow: 0 0 20px rgba(60,200,80,0.15); }
.dungeon-card.tier-medium     { border-color: #1a3a6a; }
.dungeon-card.tier-medium:hover { border-color: #2a5aaa; box-shadow: 0 0 22px rgba(50,130,220,0.18); }
.dungeon-card.tier-hard       { border-color: #7a3a08; }
.dungeon-card.tier-hard:hover { border-color: #b05010; box-shadow: 0 0 24px rgba(255,120,30,0.20); }
.dungeon-card.tier-nightmare  { border-color: #6622aa; box-shadow: 0 0 24px rgba(180,60,255,0.15); }
.dungeon-card.tier-nightmare:hover { border-color: #aa44ee; box-shadow: 0 0 32px rgba(180,60,255,0.30); }

.tier-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border: 1px solid;
  border-radius: 4px;
  padding: 2px 8px;
  width: fit-content;
}
.card-name {
  font-family: var(--font-head);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-parchment);
  margin: 2px 0 4px;
}
.card-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.74rem;
}
.card-label { color: var(--text-muted); min-width: 60px; flex-shrink: 0; }
.card-value { color: #aaa; flex: 1; line-height: 1.4; }
.card-value.gold { color: var(--gold); }

.nightmare-badge {
  font-size: 0.62rem;
  color: #cc44ff;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: 2px;
}
.mechanic-hints { display: flex; flex-direction: column; gap: 3px; }
.mechanic-hint {
  font-size: 0.6rem;
  color: #ff8844;
  font-weight: 600;
  line-height: 1.4;
  opacity: 0.85;
}

.enter-row {
  margin-top: auto;
  display: flex;
  gap: 6px;
}
.enter-btn {
  padding: 11px 14px;
  background: transparent;
  border: 1px solid;
  border-radius: 6px;
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  flex: 1;
}
.enter-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.05);
  box-shadow: 0 0 10px rgba(255,255,255,0.05);
}
.enter-btn.no-key,
.enter-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  border-color: #444 !important;
  color: #444 !important;
}
.batch-btn { flex: 0 0 auto; padding: 11px 16px; }

@media (max-width: 900px) {
  .dungeon-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 560px) {
  .dungeon-grid { grid-template-columns: 1fr; }
  .dungeon-wrap { padding: 0 14px 60px; }
}
</style>
