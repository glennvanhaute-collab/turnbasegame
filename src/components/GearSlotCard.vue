<template>
  <div class="slot-card" :class="{ filled: !!item, [slotId]: true }" @click="$emit('click')">
    <div class="slot-label">{{ SLOT_LABELS[slotId] }}</div>

    <div class="slot-content" v-if="item">
      <div class="item-icon">{{ gearIcon }}</div>
      <div class="item-info">
        <span class="item-name" :class="item.rarity.toLowerCase()">{{ item.name }}</span>
        <div class="item-stats">
          <span v-for="s in topStats" :key="s" class="stat-chip">{{ s }}</span>
        </div>
      </div>
    </div>

    <div class="slot-empty" v-else>
      <span class="empty-icon">{{ emptyIcon }}</span>
      <span class="empty-label">Empty</span>
      <!-- Off-hand hint -->
      <span class="offhand-hint" v-if="slotId === 'off_hand'">weapon or shield</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GearType, GearSlot, SLOT_LABELS } from '../game/Gear.js'

const props = defineProps({
  slotId:  { type: String, required: true },
  item:    { type: Object, default: null },
  heroKey: { type: String, required: true },
})
defineEmits(['click'])

const GEAR_ICONS  = { [GearType.WEAPON]: '⚔', [GearType.SHIELD]: '🛡', [GearType.HELMET]: '⛑', [GearType.ARMOR]: '🥋', [GearType.BOOTS]: '👟' }
const EMPTY_ICONS = {
  [GearSlot.MAIN_HAND]: '⚔', [GearSlot.OFF_HAND]: '⚔/🛡',
  [GearSlot.HEAD]: '⛑', [GearSlot.CHEST]: '🥋', [GearSlot.BOOTS]: '👟',
}

const gearIcon  = computed(() => props.item ? (GEAR_ICONS[props.item.gearType] ?? '▪') : '')
const emptyIcon = computed(() => EMPTY_ICONS[props.slotId] ?? '▪')

const STAT_FMT = {
  hp: v => `+${v}HP`, hpPct: v => `+${Math.round(v*100)}%HP`,
  atk: v => `+${v}A`, atkPct: v => `+${Math.round(v*100)}%A`,
  def: v => `+${v}D`, defPct: v => `+${Math.round(v*100)}%D`,
  spd: v => `+${v}S`, spdPct: v => `+${Math.round(v*100)}%S`,
  critRate: v => `+${Math.round(v*100)}%CR`, critDmg: v => `+${Math.round(v*100)}%CD`,
}

const topStats = computed(() =>
  props.item
    ? Object.entries(props.item.stats)
        .filter(([, v]) => v > 0)
        .slice(0, 3)
        .map(([k, v]) => STAT_FMT[k]?.(v) ?? `+${v}`)
    : []
)
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
.item-icon    { font-size: 1.4rem; line-height: 1; flex-shrink: 0; }
.item-info    { flex: 1; min-width: 0; }
.item-name    { display: block; font-size: 0.78rem; font-weight: 700; margin-bottom: 4px; }
.item-name.mythical  { color: #ff6ef7; }
.item-name.legendary { color: #ffd700; }
.item-name.epic      { color: #b44fff; }
.item-name.rare      { color: #4fa8ff; }
.item-name.uncommon  { color: #4dff88; }
.item-name.common    { color: #ccc; }
.item-stats { display: flex; flex-wrap: wrap; gap: 3px; }
.stat-chip  { font-size: 0.58rem; background: #221108; color: #888; padding: 1px 4px; border-radius: 3px; }

.slot-empty  { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.empty-icon  { font-size: 1.2rem; opacity: 0.2; }
.empty-label { font-size: 0.68rem; color: #333; }
.offhand-hint { font-size: 0.6rem; color: #3e1c0c; font-style: italic; }
</style>
