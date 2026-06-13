<template>
  <div class="market-wrap">
    <div class="market-bg" />

    <div class="market-header">
      <div>
        <div class="market-title">Market</div>
        <div class="market-sub">Sell gear for gold · Random trader offers coming soon</div>
      </div>
      <div class="market-gold">🪙 {{ currency.gold.toLocaleString() }}</div>
    </div>

    <!-- Filter + bulk actions -->
    <div class="filter-bar">
      <div class="rarity-filters">
        <button
          v-for="r in RARITY_OPTS"
          :key="r.value"
          class="rarity-btn"
          :class="[r.cls, { active: filterRarity === r.value }]"
          @click="filterRarity = r.value; confirmAll = false"
        >{{ r.label }} <span class="rarity-count">({{ countByRarity(r.value) }})</span></button>
      </div>
      <button
        class="btn-sell-all"
        v-if="sellableInFilter.length > 0"
        @click="confirmSellAll"
      >
        Sell All{{ filterRarity ? ' ' + filterRarity : '' }} · 🪙 {{ totalSellValue.toLocaleString() }}
      </button>
    </div>

    <!-- Confirm-all banner -->
    <div class="confirm-banner" v-if="confirmAll">
      <span>Sell {{ sellableInFilter.length }} item{{ sellableInFilter.length > 1 ? 's' : '' }} for 🪙 {{ totalSellValue.toLocaleString() }}?</span>
      <button class="btn-confirm-yes" @click="doSellAll">Confirm</button>
      <button class="btn-confirm-no"  @click="confirmAll = false">Cancel</button>
    </div>

    <!-- Grid -->
    <div class="item-grid" v-if="filtered.length">
      <div
        v-for="item in filtered"
        :key="item.instanceId"
        class="market-card"
        :class="item.rarity.toLowerCase()"
      >
        <div class="mc-top">
          <span class="mc-icon">{{ GEAR_ICONS[item.gearType] ?? '▪' }}</span>
          <div class="mc-info">
            <span class="mc-name">{{ item.name }}</span>
            <div class="mc-badges">
              <span class="rarity-badge" :class="item.rarity.toLowerCase()">{{ item.rarity }}</span>
              <span class="type-badge">{{ item.gearType }}</span>
            </div>
          </div>
          <div class="mc-price">
            <span class="price-gold">🪙 {{ calcSellPrice(item).toLocaleString() }}</span>
          </div>
        </div>

        <div class="mc-stats">
          <span v-for="s in statChips(item)" :key="s.key" class="stat-chip" :class="s.color">{{ s.label }}</span>
        </div>

        <div class="mc-footer">
          <button class="btn-sell" @click="sell(item.instanceId)">Sell</button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-else-if="inventory.ownedItems.length === 0">
      No gear in inventory. Craft or find items first.
    </div>
    <div class="empty-state" v-else>
      No items match this filter.
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore, calcSellPrice } from '../stores/useInventoryStore.js'
import { useCurrencyStore } from '../stores/useCurrencyStore.js'
import { GearType } from '../game/Gear.js'
import { Rarity } from '../game/Hero.js'
import marketBg from '../assets/backgrounds/market-bg.png'

const inventory = useInventoryStore()
const currency  = useCurrencyStore()

const filterRarity = ref('')
const confirmAll   = ref(false)

const RARITY_OPTS = [
  { value: '',               label: 'All',       cls: '' },
  { value: Rarity.COMMON,    label: 'Common',    cls: 'f-common' },
  { value: Rarity.UNCOMMON,  label: 'Uncommon',  cls: 'f-uncommon' },
  { value: Rarity.RARE,      label: 'Rare',      cls: 'f-rare' },
  { value: Rarity.EPIC,      label: 'Epic',      cls: 'f-epic' },
  { value: Rarity.LEGENDARY, label: 'Legendary', cls: 'f-legendary' },
]

const GEAR_ICONS = {
  [GearType.WEAPON]: '⚔', [GearType.SHIELD]: '🛡',
  [GearType.HELMET]: '⛑', [GearType.ARMOR]:  '🥋',
  [GearType.BOOTS]:  '👟', [GearType.GLOVES]: '🧤',
}

const STAT_LABELS = {
  hp: v => `+${v} HP`, hpPct: v => `+${Math.round(v*100)}% HP`,
  atk: v => `+${v} ATK`, atkPct: v => `+${Math.round(v*100)}% ATK`,
  def: v => `+${v} DEF`, defPct: v => `+${Math.round(v*100)}% DEF`,
  spd: v => `+${v} SPD`, spdPct: v => `+${Math.round(v*100)}% SPD`,
  critRate: v => `+${Math.round(v*100)}% CR`, critDmg: v => `+${Math.round(v*100)}% CD`,
}
const STAT_COLORS = {
  hp: 'green', hpPct: 'green', atk: 'red', atkPct: 'red',
  def: 'blue', defPct: 'blue', spd: 'cyan', spdPct: 'cyan',
  critRate: 'orange', critDmg: 'purple',
}

function statChips(item) {
  return Object.entries(item.stats)
    .filter(([, v]) => v > 0)
    .map(([key, val]) => ({ key, label: STAT_LABELS[key]?.(val) ?? `+${val}`, color: STAT_COLORS[key] ?? '' }))
}

const filtered = computed(() =>
  inventory.ownedItems.filter(i => {
    if (inventory.getEquippedBy(i.instanceId)) return false
    return !filterRarity.value || i.rarity === filterRarity.value
  })
)

const sellableInFilter = computed(() =>
  filtered.value.filter(i => !inventory.getEquippedBy(i.instanceId))
)

const totalSellValue = computed(() =>
  sellableInFilter.value.reduce((s, i) => s + calcSellPrice(i), 0)
)

const unequippedItems = computed(() =>
  inventory.ownedItems.filter(i => !inventory.getEquippedBy(i.instanceId))
)

function countByRarity(r) {
  if (!r) return unequippedItems.value.length
  return unequippedItems.value.filter(i => i.rarity === r).length
}

function sell(instanceId) {
  inventory.sellItem(instanceId)
}

function confirmSellAll() {
  confirmAll.value = true
}

function doSellAll() {
  const ids = sellableInFilter.value.map(i => i.instanceId)
  for (const id of ids) inventory.sellItem(id)
  confirmAll.value = false
}
</script>

<style scoped>
.market-wrap {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.market-bg {
  position: fixed;
  inset: 0;
  background-image: v-bind("'url(' + marketBg + ')'");
  background-size: cover;
  background-position: center;
  opacity: 0.18;
  pointer-events: none;
  z-index: 0;
}

.market-wrap > *:not(.market-bg) {
  position: relative;
  z-index: 1;
}

.market-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.market-title {
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-parchment);
  text-transform: uppercase;
  letter-spacing: 2px;
}
.market-sub {
  font-size: 0.62rem;
  color: var(--text-dim);
  margin-top: 3px;
}
.market-gold {
  font-size: 0.92rem;
  font-weight: 800;
  color: var(--gold);
  font-family: var(--font-head);
  white-space: nowrap;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.rarity-filters { display: flex; flex-wrap: wrap; gap: 6px; }
.rarity-btn {
  background: #221108;
  border: 1px solid #3e1c0c;
  border-radius: 20px;
  color: #666;
  font-size: 0.72rem;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.rarity-btn:hover { color: #ccc; border-color: #555; }
.rarity-btn.active { background: #351808; border-color: currentColor; }
.rarity-btn.f-common.active    { color: #888; }
.rarity-btn.f-uncommon.active  { color: #4dff88; }
.rarity-btn.f-rare.active      { color: #4fa8ff; }
.rarity-btn.f-epic.active      { color: #b44fff; }
.rarity-btn.f-legendary.active { color: #ffd700; }
.rarity-count { opacity: 0.55; font-size: 0.65em; }

.btn-sell-all {
  background: #1a0a00;
  border: 1px solid #5c2810;
  border-radius: 6px;
  color: #ffd700;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 7px 16px;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}
.btn-sell-all:hover { background: #2a1400; border-color: #ffd700; }

.confirm-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #1a0d00;
  border: 1px solid #5c2810;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 0.78rem;
  color: #ccc;
}
.confirm-banner span { flex: 1; }
.btn-confirm-yes {
  background: #c9a227; color: #0a0500;
  border: none; border-radius: 5px;
  font-size: 0.72rem; font-weight: 800;
  padding: 6px 14px; cursor: pointer;
  transition: opacity 0.15s;
}
.btn-confirm-yes:hover { opacity: 0.85; }
.btn-confirm-no {
  background: #2a1408; color: #888;
  border: 1px solid #3e1c0c; border-radius: 5px;
  font-size: 0.72rem; padding: 6px 12px; cursor: pointer;
  transition: color 0.15s;
}
.btn-confirm-no:hover { color: #ccc; }

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
}
.empty-state { text-align: center; color: #444; padding: 60px 0; font-style: italic; }

.market-card {
  background: #130908;
  border: 1px solid #3e1c0c;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;
}
.market-card:not(.equipped):hover { border-color: #6a2e14; }
.market-card.equipped { opacity: 0.5; }

.market-card.mythical  { border-left: 3px solid #ff6ef7; }
.market-card.legendary { border-left: 3px solid #ffd700; }
.market-card.epic      { border-left: 3px solid #b44fff; }
.market-card.rare      { border-left: 3px solid #4fa8ff; }
.market-card.uncommon  { border-left: 3px solid #4dff88; }
.market-card.common    { border-left: 3px solid #444; }

.mc-top { display: flex; align-items: flex-start; gap: 10px; }
.mc-icon { font-size: 1.5rem; line-height: 1; flex-shrink: 0; }
.mc-info { flex: 1; min-width: 0; }
.mc-name { display: block; font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
.mc-badges { display: flex; flex-wrap: wrap; gap: 4px; }

.rarity-badge { font-size: 0.58rem; padding: 1px 6px; border-radius: 10px; font-weight: 700; }
.rarity-badge.mythical  { background: #2a0a2a; color: #ff6ef7; }
.rarity-badge.legendary { background: #3a2a00; color: #ffd700; }
.rarity-badge.epic      { background: #2a0a3a; color: #b44fff; }
.rarity-badge.rare      { background: #0a1a3a; color: #4fa8ff; }
.rarity-badge.uncommon  { background: #0a2a1a; color: #4dff88; }
.rarity-badge.common    { background: #2a2a2a; color: #888; }
.type-badge { font-size: 0.58rem; padding: 1px 6px; border-radius: 10px; background: #221108; color: #666; text-transform: capitalize; }

.mc-price { text-align: right; flex-shrink: 0; }
.price-gold { font-size: 0.82rem; font-weight: 800; color: #ffd700; font-family: var(--font-head); white-space: nowrap; }

.mc-stats { display: flex; flex-wrap: wrap; gap: 4px; }
.stat-chip { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.stat-chip.red    { background: #3a0a0a; color: #ff6b6b; }
.stat-chip.green  { background: #0a2a0a; color: #4dff88; }
.stat-chip.blue   { background: #0a1a3a; color: #4fa8ff; }
.stat-chip.cyan   { background: #0a2a2a; color: #00d4ff; }
.stat-chip.orange { background: #3a1a00; color: #ff9944; }
.stat-chip.purple { background: #2a0a3a; color: #b44fff; }

.mc-footer { display: flex; justify-content: flex-end; align-items: center; }
.equipped-note { font-size: 0.62rem; color: #3a2a00; font-style: italic; }
.btn-sell {
  background: #1a0a00;
  border: 1px solid #5c2810;
  border-radius: 5px;
  color: #ffd700;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 16px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-sell:hover { background: #2a1400; border-color: #ffd700; }
</style>
