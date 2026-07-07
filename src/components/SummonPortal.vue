<template>
  <div class="contract-card" :class="portal.id">

    <div class="contract-art" v-if="portalImage">
      <img :src="portalImage" :alt="portal.name" class="portal-art-img" />
      <div class="portal-art-fade" />
    </div>

    <div class="contract-header">
      <div class="contract-seal" :class="portal.id" />
      <div class="contract-title-block">
        <h3 class="contract-name">{{ portal.name }}</h3>
        <div class="contract-flavour">{{ portal.flavour }}</div>
      </div>
    </div>

    <div class="contract-divider" />

    <!-- Scroll inventory -->
    <div class="scroll-row">
      <span class="scroll-label">{{ scrollLabel }}</span>
      <span class="scroll-owned" :class="{ empty: scrollCount === 0 }">
        📜 {{ scrollCount }} owned
      </span>
    </div>

    <!-- Rank distribution (collapsed by default) -->
    <div class="rank-table" :class="{ expanded: showRates }">
      <button class="rank-toggle" @click="showRates = !showRates">
        <span class="rank-toggle-label">Expected Calibre</span>
        <span class="rank-toggle-icon">{{ showRates ? '▲' : 'ℹ' }}</span>
      </button>
      <transition name="rates-slide">
        <div v-if="showRates" class="rank-rows">
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
      </transition>
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
        <span v-else-if="!canAfford">No {{ scrollLabel }} available</span>
        <span v-else>{{ actionLabel }}</span>
      </button>
      <button
        class="hire-btn hire-btn-10"
        :class="portal.id"
        :disabled="!canAfford10 || pulling"
        @click="$emit('summon10', portal.id)"
      >
        <span v-if="pulling">Seeking…</span>
        <span v-else-if="!canAfford10">No {{ scrollLabel }} available</span>
        <span v-else>{{ actionLabel }} ×10</span>
      </button>
      <button
        class="hire-btn hire-btn-100"
        :class="portal.id"
        :disabled="!canAfford100 || pulling"
        @click="$emit('summon100', portal.id)"
      >
        <span v-if="pulling">Seeking…</span>
        <span v-else-if="!canAfford100">No {{ scrollLabel }} available</span>
        <span v-else>{{ actionLabel }} ×100</span>
      </button>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import recruitImg  from '../assets/ui/recruit.png'
import recruit2Img from '../assets/ui/recruit_2.png'
import recruit3Img from '../assets/ui/recruit_3.png'

const props = defineProps({
  portal:      { type: Object,  required: true },
  canAfford:   { type: Boolean, default: false },
  canAfford10: { type: Boolean, default: false },
  canAfford100:{ type: Boolean, default: false },
  pulling:     { type: Boolean, default: false },
  progress:    { type: Object,  required: true },
  scrollCount: { type: Number,  default: 0 },
})
defineEmits(['summon', 'summon10', 'summon100'])

const RARITY_ORDER = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical']
function rarityIndex(r) { return RARITY_ORDER.indexOf(r) }

function isLocked() { return false }

const visibleRates = computed(() =>
  Object.fromEntries(Object.entries(props.portal.rates).filter(([r]) => r !== 'Ancient'))
)

const SCROLL_LABELS = {
  common_writ:    'Common Writ',
  sealed_charter: 'Sealed Charter',
  house_seal:     'House Seal',
}
const ACTION_LABELS = {
  common_writ:    'Issue Writ',
  sealed_charter: 'Present Charter',
  house_seal:     'Invoke the Seal',
}
const scrollLabel = computed(() => SCROLL_LABELS[props.portal.id] ?? props.portal.name)
const actionLabel = computed(() => ACTION_LABELS[props.portal.id] ?? 'Recruit')

const PORTAL_IMAGES = { common_writ: recruitImg, sealed_charter: recruit2Img, house_seal: recruit3Img }
const portalImage = computed(() => PORTAL_IMAGES[props.portal.id] ?? null)

const showRates = ref(false)
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

.contract-card.common_writ {
  border-color: #5a2810;
  box-shadow: 0 4px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(100,40,10,0.06);
}
.contract-card.sealed_charter {
  border-color: #2a4a6e;
  box-shadow: 0 4px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(30,60,120,0.08);
}
.contract-card.house_seal {
  border-color: #7a5000;
  box-shadow: 0 4px 32px rgba(0,0,0,0.6), inset 0 0 40px rgba(160,100,0,0.08);
}
.contract-card.common_writ::before,
.contract-card.common_writ::after  { color: #5a2810; }
.contract-card.sealed_charter::before,
.contract-card.sealed_charter::after { color: #2a4a6e; }
.contract-card.house_seal::before,
.contract-card.house_seal::after   { color: #7a5000; }

.contract-card.common_writ:hover    { border-color: #8a3818; box-shadow: 0 6px 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(100,40,10,0.10); }
.contract-card.sealed_charter:hover { border-color: #4a7aae; box-shadow: 0 6px 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(30,60,120,0.14); }
.contract-card.house_seal:hover     { border-color: #c09020; box-shadow: 0 6px 40px rgba(0,0,0,0.7), inset 0 0 40px rgba(160,100,0,0.14); }

/* Portal art */
.contract-art {
  position: relative;
  margin: -24px -24px 0;
  height: 220px;
  overflow: hidden;
  border-radius: 2px 2px 0 0;
}
.portal-art-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  display: block;
}
.portal-art-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 65%, rgba(12,7,3,0.98) 100%);
}

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
.contract-seal.common_writ    { color: #c87030; }
.contract-seal.sealed_charter { color: #5090cc; }
.contract-seal.house_seal     { color: #d4a020; }

.contract-name {
  font-family: var(--font-head);
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 5px;
}
.common_writ    .contract-name { color: #d4803a; }
.sealed_charter .contract-name { color: #70b0e0; }
.house_seal     .contract-name { color: #d4a020; }
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
.sealed_charter .contract-divider { background: linear-gradient(to right, transparent, #2a4a6e, transparent); }
.house_seal     .contract-divider { background: linear-gradient(to right, transparent, #7a5000, transparent); }

/* Scroll inventory */
.scroll-row   { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.scroll-label { font-family: var(--font-head); font-size: 0.60rem; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-muted); }
.scroll-owned { font-size: 0.88rem; font-weight: 700; color: var(--gold); }
.scroll-owned.empty { color: #555; }

/* Rank table */
.rank-table { border-radius: 4px; overflow: hidden; }
.rank-toggle {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; background: rgba(0,0,0,0.25); border: none;
  padding: 8px 12px; cursor: pointer;
  font-family: var(--font-head);
}
.rank-toggle:hover { background: rgba(0,0,0,0.35); }
.rank-toggle-label { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); }
.rank-toggle-icon  { font-size: 0.65rem; color: var(--text-muted); opacity: 0.6; }

.rank-rows { background: rgba(0,0,0,0.20); padding: 10px 12px 8px; }
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

.rates-slide-enter-active, .rates-slide-leave-active { transition: opacity 0.2s, transform 0.2s; }
.rates-slide-enter-from, .rates-slide-leave-to { opacity: 0; transform: translateY(-4px); }

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
.ceiling-text strong.mythical  { color: #ff2244; }
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
.hire-btn-10  { font-size: 0.70rem; padding: 10px 12px; }
.hire-btn-100 { font-size: 0.65rem; padding: 8px 12px; opacity: 0.85; }
.hire-btn:active:not(:disabled) { transform: scale(0.97); }
.hire-btn:disabled { opacity: 0.30; cursor: not-allowed; }

.hire-btn.common_writ {
  background: linear-gradient(135deg, #5a1a0a, #8a2a10);
  border-color: #a03010;
  color: #f0c080;
}
.hire-btn.common_writ:not(:disabled):hover {
  box-shadow: 0 0 16px rgba(180,80,20,0.4);
  opacity: 0.92;
}
.hire-btn.sealed_charter {
  background: linear-gradient(135deg, #0a1a3a, #1a3a6a);
  border-color: #2a5a9a;
  color: #a0d0ff;
}
.hire-btn.sealed_charter:not(:disabled):hover {
  box-shadow: 0 0 16px rgba(40,100,200,0.4);
  opacity: 0.92;
}
.hire-btn.house_seal {
  background: linear-gradient(135deg, #3a2200, #6a4000);
  border-color: #b07820;
  color: #f5d060;
}
.hire-btn.house_seal:not(:disabled):hover {
  box-shadow: 0 0 18px rgba(200,140,20,0.5);
  opacity: 0.92;
}
</style>
