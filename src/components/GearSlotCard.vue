<template>
  <div class="slot-card" :class="{ filled: !!item, [slotId]: true }" @click="$emit('click')">
    <div class="slot-label">{{ SLOT_LABELS[slotId] }}</div>

    <div class="slot-content" v-if="item">
      <div class="item-icon">
        <GameIcon :icon="slotIcon" :size="28" />
      </div>
      <div class="item-info">
        <div class="item-name-row">
          <span class="item-name" :class="item.rarity.toLowerCase()">{{ item.name }}</span>
          <span class="item-stars" :class="item.rarity.toLowerCase()">{{ item.stars > 0 ? '★'.repeat(item.stars) : '☆' }}</span>
        </div>
        <div class="item-stats">
          <span v-for="s in topStats" :key="s" class="stat-chip">{{ s }}</span>
        </div>
      </div>
    </div>

    <div class="slot-empty" v-else>
      <GameIcon :icon="slotIcon" :size="24" class="empty-icon" />
      <span class="empty-label">Empty</span>
      <!-- Off-hand hint -->
      <span class="offhand-hint" v-if="slotId === 'off_hand'">weapon or shield</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GearSlot, SLOT_LABELS, computeLineStats } from '../game/Gear.js'
import { SLOT_TO_ICON } from '../game/data/spritesheet.js'
import GameIcon from './ui/GameIcon.vue'

const props = defineProps({
  slotId:  { type: String, required: true },
  item:    { type: Object, default: null },
  heroKey: { type: String, required: true },
})
defineEmits(['click'])

const slotIcon = computed(() => SLOT_TO_ICON[props.slotId] ?? 'sword')

const STAT_FMT = {
  hp: v => `+${v}HP`, hpPct: v => `+${Math.round(v*100)}%HP`,
  atk: v => `+${v}A`, atkPct: v => `+${Math.round(v*100)}%A`,
  def: v => `+${v}D`, defPct: v => `+${Math.round(v*100)}%D`,
  spd: v => `+${v}S`, spdPct: v => `+${Math.round(v*100)}%S`,
  critRate: v => `+${Math.round(v*100)}%CR`, critDmg: v => `+${Math.round(v*100)}%CD`,
}

const topStats = computed(() => {
  if (!props.item) return []
  const merged = { ...props.item.stats }
  if (props.item.lines?.length) {
    const lineStats = computeLineStats(props.item.lines)
    for (const [key, val] of Object.entries(lineStats)) {
      merged[key] = (merged[key] ?? 0) + val
    }
  }
  return Object.entries(merged)
    .filter(([, v]) => v > 0)
    .slice(0, 3)
    .map(([k, v]) => STAT_FMT[k]?.(v) ?? `+${v}`)
})
</script>

<style scoped>
.slot-card {
  background: #130908;
  border: 2px dashed #3e1c0c;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.slot-card:hover   { border-color: #ffd700; background: #1a0d0a; }
.slot-card.filled  { border-style: solid; border-color: #5c2810; background: #150a07; }
.slot-card.off_hand.filled { border-color: #4fa8ff; }

.slot-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 1px; color: #444; }

.slot-content { display: flex; align-items: flex-start; gap: 8px; flex: 1; }
.item-icon    { flex-shrink: 0; }
.item-info     { flex: 1; min-width: 0; }
.item-name-row { display: flex; align-items: baseline; gap: 5px; margin-bottom: 4px; min-width: 0; }
.item-name     { font-size: 0.78rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-stars    { font-size: 0.58rem; white-space: nowrap; flex-shrink: 0; letter-spacing: 0; }
.item-name.mythical,  .item-stars.mythical  { color: #ff6ef7; }
.item-name.legendary, .item-stars.legendary { color: #ffd700; }
.item-name.epic,      .item-stars.epic      { color: #b44fff; }
.item-name.rare,      .item-stars.rare      { color: #4fa8ff; }
.item-name.uncommon,  .item-stars.uncommon  { color: #4dff88; }
.item-name.common,    .item-stars.common    { color: #ccc; }
.item-stats { display: flex; flex-wrap: wrap; gap: 3px; }
.stat-chip  { font-size: 0.58rem; background: #221108; color: #888; padding: 1px 4px; border-radius: 3px; }

.slot-empty  { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.empty-icon  { opacity: 0.2; }
.empty-label { font-size: 0.68rem; color: #333; }
.offhand-hint { font-size: 0.6rem; color: #3e1c0c; font-style: italic; }
</style>
