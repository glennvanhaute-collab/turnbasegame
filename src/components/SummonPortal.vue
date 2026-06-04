<template>
  <div class="contract-card" :class="portal.id">

    <div class="contract-header">
      <div class="contract-seal" :class="portal.id" />
      <div class="contract-title-block">
        <h3 class="contract-name">{{ portal.name }}</h3>
        <div class="contract-flavour">{{ portal.flavour }}</div>
      </div>
    </div>

    <div class="contract-divider" />

    <!-- Fee -->
    <div class="contract-fee">
      <span class="fee-label">Contract Fee</span>
      <span class="fee-value gold"    v-if="portal.cost.gold">🪙 {{ portal.cost.gold.toLocaleString() }} gold</span>
      <span class="fee-value diamond" v-if="portal.cost.diamonds">💎 {{ portal.cost.diamonds }} diamonds</span>
    </div>

    <!-- Rank distribution -->
    <div class="rank-table">
      <div class="rank-title">Expected Calibre</div>
      <div
        class="rank-row"
        v-for="(weight, rarity) in visibleRates"
        :key="rarity"
        :class="{ locked: isLocked(rarity) }"
      >
        <span class="rank-label" :class="rarity.toLowerCase()">
          <span class="lock-icon" v-if="isLocked(rarity)">⌁</span>
          {{ rarity }}
        </span>
        <div class="rank-bar-wrap">
          <div class="rank-bar" :class="[rarity.toLowerCase(), { 'rank-bar--locked': isLocked(rarity) }]" :style="{ width: (weight * 100) + '%' }" />
        </div>
        <span class="rank-pct">{{ (weight * 100).toFixed(0) }}%</span>
      </div>
    </div>

    <!-- Recruitment ceiling -->
    <div class="ceiling-badge">
      <span class="ceiling-icon">⚑</span>
      <span class="ceiling-text">
        Ceiling: <strong :class="recruitmentCeiling.toLowerCase()">{{ recruitmentCeiling }}</strong>
        <span class="ceiling-next" v-if="nextUnlock"> · {{ nextUnlock.rarity }} unlocks at level {{ nextUnlock.level }}</span>
        <span class="ceiling-next" v-else> · Max tier reached</span>
      </span>
    </div>

    <!-- Fate's promise (pity) -->
    <div class="fate-row">
      <div class="fate-label">
        <span class="fate-title">Fate's Promise</span>
        <span class="fate-sub">{{ portal.pity.threshold }}+ rank guaranteed every {{ portal.pity.every }} contracts</span>
      </div>
      <div class="fate-bar-wrap">
        <div class="fate-bar" :style="{ width: progress.pct + '%' }" />
      </div>
      <span class="fate-count">{{ progress.current }}/{{ progress.max }}</span>
    </div>

    <!-- Hire buttons -->
    <div class="hire-actions">
      <button
        class="hire-btn hire-btn-1"
        :class="portal.id"
        :disabled="!canAfford || pulling"
        @click="$emit('summon', portal.id)"
      >
        <span v-if="pulling">Seeking…</span>
        <span v-else-if="!canAfford">Insufficient {{ portal.cost.gold ? 'gold' : 'diamonds' }}</span>
        <span v-else>Hire Champion</span>
      </button>
      <button
        class="hire-btn hire-btn-10"
        :class="portal.id"
        :disabled="!canAfford10 || pulling"
        @click="$emit('summon10', portal.id)"
      >
        <span v-if="pulling">Seeking…</span>
        <span v-else-if="!canAfford10">Insufficient {{ portal.cost.gold ? 'gold' : 'diamonds' }} for ×10</span>
        <span v-else>Send the Call ×10 · {{ cost10Label }}</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  portal:             { type: Object,  required: true },
  canAfford:          { type: Boolean, default: false },
  canAfford10:        { type: Boolean, default: false },
  pulling:            { type: Boolean, default: false },
  progress:           { type: Object,  required: true },
  recruitmentCeiling: { type: String,  default: 'Rare' },
  nextUnlock:         { type: Object,  default: null },
})
defineEmits(['summon', 'summon10'])

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical']
function rarityIndex(r) { return RARITY_ORDER.indexOf(r) }

const ceilingIdx = computed(() => rarityIndex(props.recruitmentCeiling))
function isLocked(rarity) { return rarityIndex(rarity) > ceilingIdx.value }

const visibleRates = computed(() =>
  Object.fromEntries(Object.entries(props.portal.rates).filter(([r]) => r !== 'Ancient'))
)

const cost10Label = computed(() => {
  const c = props.portal.cost
  if (c.gold)     return `🪙 ${(c.gold * 10).toLocaleString()}`
  if (c.diamonds) return `💎 ${c.diamonds * 10}`
  return ''
})
</script>

<style scoped>
.contract-card {
  background: rgba(12, 7, 3, 0.82);
  backdrop-filter: blur(10px);
  border: 1px solid #3e1c0c;
  border-radius: 2px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.contract-card::before,
.contract-card::after {
  content: '◆';
  position: absolute;
  font-size: 8px;
  line-height: 1;
  pointer-events: none;
}
.contract-card::before { top: -4px; left: -4px; }
.contract-card::after  { bottom: -4px; right: -4px; }

.contract-card.normal {
  border-color: #5a2810;
  box-shadow: 0 4px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(100,40,10,0.06);
}
.contract-card.void {
  border-color: #3a1a5e;
  box-shadow: 0 4px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(80,20,140,0.06);
}
.contract-card.normal::before,
.contract-card.normal::after { color: #5a2810; }
.contract-card.void::before,
.contract-card.void::after   { color: #5a2890; }

.contract-card.normal:hover { border-color: #8a3818; box-shadow: 0 6px 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(100,40,10,0.10); }
.contract-card.void:hover   { border-color: #6a3aae; box-shadow: 0 6px 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(80,20,140,0.12); }

/* Header */
.contract-header {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}
.contract-seal {
  width: 38px; height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid currentColor;
  position: relative;
}
.contract-seal::after {
  content: '';
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.25;
}
.contract-seal.normal { color: #c87030; }
.contract-seal.void   { color: #9050cc; }

.contract-name {
  font-family: var(--font-head);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.normal .contract-name { color: #d4803a; }
.void   .contract-name { color: #b47fff; }
.contract-flavour {
  font-size: 0.74rem;
  color: var(--text-parchment);
  opacity: 0.55;
  line-height: 1.5;
}

.contract-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, #3e1c0c, transparent);
}
.void .contract-divider { background: linear-gradient(to right, transparent, #3a1a5e, transparent); }

/* Fee */
.contract-fee  { display: flex; align-items: center; gap: 10px; }
.fee-label     { font-family: var(--font-head); font-size: 0.60rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); flex: 1; }
.fee-value     { font-size: 0.95rem; font-weight: 700; }
.fee-value.gold    { color: var(--gold); }
.fee-value.diamond { color: #88ccff; }

/* Rank table */
.rank-table { background: rgba(0,0,0,0.25); border-radius: 4px; padding: 12px; }
.rank-title { font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 10px; }
.rank-row   { display: grid; grid-template-columns: 76px 1fr 34px; align-items: center; gap: 8px; margin-bottom: 6px; }
.rank-row:last-child { margin-bottom: 0; }
.rank-label { font-size: 0.68rem; font-weight: 700; }
.rank-label.legendary { color: #ffd700; }
.rank-label.epic      { color: #b44fff; }
.rank-label.rare      { color: #4fa8ff; }
.rank-label.uncommon  { color: #4dff88; }
.rank-label.common    { color: #666; }
.rank-bar-wrap { height: 5px; background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden; }
.rank-bar      { height: 100%; border-radius: 3px; }
.rank-bar.legendary { background: #ffd700; }
.rank-bar.epic      { background: #b44fff; }
.rank-bar.rare      { background: #4fa8ff; }
.rank-bar.uncommon  { background: #4dff88; }
.rank-bar.common    { background: #555; }
.rank-pct { font-size: 0.62rem; color: var(--text-muted); text-align: right; }

.rank-row.locked { opacity: 0.28; }
.lock-icon { font-size: 0.60rem; margin-right: 3px; opacity: 0.6; }
.rank-bar--locked { background: #333 !important; }

/* Ceiling badge */
.ceiling-badge {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  background: rgba(0,0,0,0.30);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 4px;
  font-size: 0.68rem;
  color: var(--text-muted);
}
.ceiling-icon { opacity: 0.4; font-size: 0.72rem; }
.ceiling-text strong.rare      { color: #4fa8ff; }
.ceiling-text strong.epic      { color: #b44fff; }
.ceiling-text strong.legendary { color: #ffd700; }
.ceiling-text strong.mythical  { color: #ff88cc; }
.ceiling-text strong.uncommon  { color: #4dff88; }
.ceiling-text strong.common    { color: #888; }
.ceiling-next { color: #444; }

/* Fate's promise */
.fate-row    { display: flex; align-items: center; gap: 10px; }
.fate-label  { flex: 1; }
.fate-title  { display: block; font-family: var(--font-head); font-size: 0.60rem; letter-spacing: 1px; text-transform: uppercase; color: var(--text-parchment); opacity: 0.7; }
.fate-sub    { display: block; font-size: 0.60rem; color: var(--text-muted); margin-top: 2px; line-height: 1.3; }
.fate-bar-wrap { width: 56px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; flex-shrink: 0; overflow: hidden; }
.fate-bar    { height: 100%; background: var(--gold); transition: width 0.3s; border-radius: 2px; }
.fate-count  { font-size: 0.60rem; color: var(--text-muted); white-space: nowrap; }

/* Hire buttons */
.hire-actions { display: flex; flex-direction: column; gap: 8px; }
.hire-btn {
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 12px;
  font-family: var(--font-head);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s, box-shadow 0.15s;
}
.hire-btn-10 { font-size: 0.70rem; padding: 10px 12px; }
.hire-btn:active:not(:disabled) { transform: scale(0.97); }
.hire-btn:disabled { opacity: 0.30; cursor: not-allowed; }

.hire-btn.normal {
  background: linear-gradient(135deg, #5a1a0a, #8a2a10);
  border-color: #a03010;
  color: #f0c080;
}
.hire-btn.normal:not(:disabled):hover {
  box-shadow: 0 0 16px rgba(180,80,20,0.4);
  opacity: 0.92;
}
.hire-btn.void {
  background: linear-gradient(135deg, #2a0a5a, #5a1ace);
  border-color: #6a2aae;
  color: #c8a0ff;
}
.hire-btn.void:not(:disabled):hover {
  box-shadow: 0 0 16px rgba(120,40,220,0.4);
  opacity: 0.92;
}
</style>
