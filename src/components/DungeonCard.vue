<template>
  <!-- Discovery Node card -->
  <div v-if="dungeon.isNode" class="dungeon-card node-card" :class="`node-${dungeon.nodeType}`">
    <div class="node-icon">{{ dungeon.nodeType === 'forge' ? '🔨' : '✨' }}</div>
    <div class="node-type-badge" :style="{ color: nodeColor, borderColor: nodeColor + '44' }">
      {{ dungeon.nodeType === 'forge' ? 'Forge' : 'Blessed Area' }}
    </div>
    <div class="card-name">{{ dungeon.name }}</div>
    <div class="node-desc">
      {{ dungeon.nodeType === 'forge'
        ? 'A master smithy imbued with ancient power. Apply one physical stat line to a Legendary item.'
        : 'A sacred site touched by divine light. Apply one magical stat line to a Legendary item.' }}
    </div>
    <div class="node-stat-pool">
      <span class="card-label">Stats</span>
      <span class="node-pool-tags">
        <span v-for="s in statPool" :key="s" class="pool-tag" :style="{ borderColor: nodeColor + '55', color: nodeColor }">{{ s }}</span>
      </span>
    </div>
    <button class="enter-btn" :style="{ borderColor: nodeColor, color: nodeColor }" @click="$emit('claim')">
      Claim →
    </button>
  </div>

  <!-- Dungeon card -->
  <div
    v-else
    class="dungeon-card"
    :class="[`tier-${dungeon.tier.toLowerCase()}`]"
    :style="pickBg(dungeon.tier, dungeon.id) ? { backgroundImage: `url(${pickBg(dungeon.tier, dungeon.id)})` } : {}"
  >
    <div class="tier-badge" :style="{ color: tierColor, borderColor: tierColor + '44' }">
      {{ dungeon.tier }}
    </div>

    <button
      v-if="dungeon.tier === 'Nightmare' && !dungeon.pinned"
      class="pin-btn"
      title="Pin this dungeon so it survives your next Explore"
      @click.stop="$emit('pin')"
    >📌</button>
    <button
      v-else-if="dungeon.pinned"
      class="pin-btn pinned"
      title="Unpin"
      @click.stop="$emit('unpin')"
    >📌</button>

    <div class="card-name">{{ dungeon.name }}</div>

    <div class="card-row">
      <span class="card-label">Enemies</span>
      <span class="card-value">{{ POOL_LABELS[dungeon.enemyPoolId] ?? '?' }}</span>
    </div>

    <div class="card-row">
      <span class="card-label">Loot</span>
      <span class="card-value loot" :style="{ color: tierColor }">{{ LOOT_LABEL[dungeon.tier] }}</span>
    </div>

    <div class="card-row">
      <span class="card-label">Gold</span>
      <span class="card-value gold">{{ dungeon.rewards.gold.toLocaleString() }}</span>
    </div>

    <div v-if="dungeon.tier === 'Nightmare'" class="nightmare-badge">
      ◈ Lines gear guaranteed
    </div>

    <button class="enter-btn" :style="{ borderColor: tierColor, color: tierColor }" @click="$emit('enter')">
      Enter →
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { POOL_LABELS, LOOT_LABEL, NODE_FORGE_STATS, NODE_BLESSED_STATS } from '../game/data/dungeons.js'
const _dungeonBgs = import.meta.glob('../assets/dungeons/dungeon_*.png', { eager: true })

const TIER_BG_PREFIX = { medium: 'intermediate' }
function tierbgs(tier) {
  const key = tier.toLowerCase()
  const prefix = `dungeon_${TIER_BG_PREFIX[key] ?? key}_`
  return Object.entries(_dungeonBgs)
    .filter(([p]) => p.includes(prefix))
    .map(([, m]) => m.default)
}

function pickBg(tier, seed) {
  const pool = tierbgs(tier)
  if (!pool.length) return null
  // stable pick per dungeon: sum char codes mod pool length
  const idx = [...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % pool.length
  return pool[idx]
}

const props = defineProps({
  dungeon: { type: Object, required: true },
})

defineEmits(['enter', 'pin', 'unpin', 'claim'])

const TIER_COLORS = {
  Easy:      '#4dff88',
  Medium:    '#4fa8ff',
  Hard:      '#ff9944',
  Nightmare: '#cc44ff',
}

const tierColor = computed(() => TIER_COLORS[props.dungeon.tier] ?? '#888')
const nodeColor = computed(() => props.dungeon.nodeType === 'forge' ? '#ff9944' : '#88ccff')
const statPool  = computed(() => {
  const keys = props.dungeon.nodeType === 'forge' ? NODE_FORGE_STATS : NODE_BLESSED_STATS
  return keys.map(k => k.replace('Pct', '%').toUpperCase())
})
</script>

<style scoped>
.dungeon-card {
  background: #0e0804;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.dungeon-card:hover { border-color: #5c3a14; }

/* Node card */
.node-card {
  background: #0a0c10;
  border-color: #1a2a3a;
  text-align: center;
  align-items: center;
}
.node-card.node-forge   { border-color: #3a2208; background: #0d0a06; }
.node-card.node-blessed { border-color: #0a1a2a; background: #060a10; }
.node-icon { font-size: 1.6rem; margin-bottom: 2px; }
.node-type-badge {
  display: inline-flex; align-items: center;
  font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.5px; border: 1px solid; border-radius: 4px;
  padding: 2px 8px; width: fit-content;
}
.node-desc { font-size: 0.68rem; color: var(--text-muted); line-height: 1.5; text-align: center; }
.node-stat-pool { display: flex; flex-direction: column; gap: 4px; align-items: center; width: 100%; }
.node-pool-tags { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
.pool-tag {
  font-size: 0.55rem; font-weight: 700; border: 1px solid;
  border-radius: 3px; padding: 1px 5px; opacity: 0.8;
}

.dungeon-card.tier-easy {
  background-color: #040e06;
  background-size: cover;
  background-position: center top;
  border-color: #1a4a22;
  overflow: hidden;
}
.dungeon-card.tier-easy::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(2, 10, 4, 0.45) 0%,
    rgba(2, 10, 4, 0.68) 60%,
    rgba(2, 10, 4, 0.88) 100%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: 10px;
}
.dungeon-card.tier-easy > * {
  position: relative;
  z-index: 1;
}
.dungeon-card.tier-easy:hover {
  border-color: #2a7a38;
  box-shadow: 0 0 20px rgba(60, 200, 80, 0.15);
}

.dungeon-card.tier-medium {
  background-color: #060a12;
  background-size: cover;
  background-position: center top;
  border-color: #1a3a6a;
  overflow: hidden;
}
.dungeon-card.tier-medium::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(4, 8, 20, 0.50) 0%,
    rgba(4, 8, 20, 0.70) 60%,
    rgba(4, 8, 20, 0.88) 100%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: 10px;
}
.dungeon-card.tier-medium > * {
  position: relative;
  z-index: 1;
}
.dungeon-card.tier-medium:hover {
  border-color: #2a5aaa;
  box-shadow: 0 0 22px rgba(50, 130, 220, 0.18);
}

.dungeon-card.tier-hard {
  background-color: #100a04;
  background-size: cover;
  background-position: center top;
  border-color: #7a3a08;
  overflow: hidden;
}
.dungeon-card.tier-hard::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(16, 6, 0, 0.50) 0%,
    rgba(16, 6, 0, 0.70) 60%,
    rgba(16, 6, 0, 0.88) 100%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: 10px;
}
.dungeon-card.tier-hard > * {
  position: relative;
  z-index: 1;
}
.dungeon-card.tier-hard:hover {
  border-color: #b05010;
  box-shadow: 0 0 24px rgba(255, 120, 30, 0.20);
}

.dungeon-card.tier-nightmare {
  background-color: #100814;
  background-size: cover;
  background-position: center top;
  border-color: #6622aa;
  box-shadow: 0 0 24px rgba(180, 60, 255, 0.15);
  overflow: hidden;
}
.dungeon-card.tier-nightmare::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(10, 4, 16, 0.55) 0%,
    rgba(10, 4, 16, 0.72) 60%,
    rgba(10, 4, 16, 0.88) 100%
  );
  pointer-events: none;
  z-index: 0;
  border-radius: 10px;
}
.dungeon-card.tier-nightmare > * {
  position: relative;
  z-index: 1;
}
.dungeon-card.tier-nightmare:hover {
  border-color: #aa44ee;
  box-shadow: 0 0 32px rgba(180, 60, 255, 0.30);
}

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

.pin-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  opacity: 0.45;
  transition: opacity 0.15s;
  padding: 0;
  line-height: 1;
}
.pin-btn:hover  { opacity: 1; }
.pin-btn.pinned { opacity: 1; }

.card-name {
  font-family: var(--font-head);
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--text-parchment);
  margin: 2px 0 4px;
  padding-right: 24px;
}

.card-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.68rem;
}
.card-label { color: var(--text-muted); min-width: 44px; flex-shrink: 0; }
.card-value { color: #aaa; flex: 1; line-height: 1.4; }
.card-value.gold { color: var(--gold); }

.nightmare-badge {
  font-size: 0.62rem;
  color: #cc44ff;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.enter-btn {
  margin-top: 4px;
  padding: 8px 14px;
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
  width: 100%;
}
.enter-btn:hover {
  background: rgba(255,255,255,0.05);
  box-shadow: 0 0 10px rgba(255,255,255,0.05);
}
</style>
