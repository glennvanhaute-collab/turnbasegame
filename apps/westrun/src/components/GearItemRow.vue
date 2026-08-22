<template>
  <div class="gear-card" :class="[item.rarity.toLowerCase(), { equipped, 'on-other': !!equippedOnName }]">
    <div class="rarity-stripe" />
    <div class="card-body">
      <div class="card-top">
        <GameIcon :icon="itemIcon" :size="22" class="gear-sprite" />
        <div class="name-block">
          <span class="item-name" :class="item.rarity.toLowerCase()">{{ item.name }}</span>
          <span class="item-type" v-if="item.weaponType">{{ item.weaponType }}</span>
        </div>
        <span class="on-badge" v-if="equippedOnName">{{ equippedOnName }}</span>
      </div>
      <div class="stat-row">
        <span v-for="s in statLines" :key="s.key" class="stat-chip" :class="s.color">{{ s.label }}</span>
      </div>
      <div class="card-footer">
        <span class="stars-line" v-if="item.stars > 0">{{ '★'.repeat(item.stars) }}</span>
        <span class="lines-count" v-if="item.lines?.length">{{ item.lines.length }} lines</span>
        <button v-if="equipped" class="action-btn remove" @click="$emit('unequip')">Remove</button>
        <button v-else class="action-btn equip" @click="$emit('equip')">Equip</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GearType, computeLineStats } from '../game/Gear.js'
import { tierSlotIcon } from '../game/data/spritesheet.js'
import GameIcon from './ui/GameIcon.vue'

const props = defineProps({
  item:           { type: Object,  required: true },
  equipped:       { type: Boolean, default: false },
  equippedOnName: { type: String,  default: null },
})
defineEmits(['equip', 'unequip'])

const GEARTYPE_SLOT = {
  [GearType.SHIELD]: 'off_hand',
  [GearType.HELMET]: 'head',
  [GearType.ARMOR]:  'chest',
  [GearType.LEGS]:   'legs',
  [GearType.BOOTS]:  'boots',
  [GearType.GLOVES]: 'gloves',
}

const itemIcon = computed(() => {
  if (props.item.image) return props.item.image
  const slot = props.item.slot ?? GEARTYPE_SLOT[props.item.gearType]
  return tierSlotIcon(props.item.tier, slot, props.item.craftDiscipline)
})

const STAT_LABELS = {
  hp:         v => `+${v} HP`,
  hpPct:      v => `+${Math.round(v*100)}% HP`,
  atk:        v => `+${v} ATK`,
  atkPct:     v => `+${Math.round(v*100)}% ATK`,
  def:        v => `+${v} DEF`,
  defPct:     v => `+${Math.round(v*100)}% DEF`,
  spd:        v => `+${v} SPD`,
  spdPct:     v => `+${Math.round(v*100)}% SPD`,
  critRate:   v => `+${Math.round(v*100)}% CR`,
  critDmg:    v => `+${Math.round(v*100)}% CD`,
  resistance: v => `+${Math.round(v*100)}% RES`,
  accuracy:   v => `+${Math.round(v*100)}% ACC`,
}
const STAT_COLORS = {
  hp: 'green', hpPct: 'green',
  atk: 'red', atkPct: 'red',
  def: 'blue', defPct: 'blue',
  spd: 'cyan', spdPct: 'cyan',
  critRate: 'orange', critDmg: 'purple',
  resistance: 'teal', accuracy: 'yellow',
}

const statLines = computed(() => {
  const merged = { ...props.item.stats }
  if (props.item.lines?.length) {
    const lineStats = computeLineStats(props.item.lines)
    for (const [key, val] of Object.entries(lineStats)) {
      merged[key] = (merged[key] ?? 0) + val
    }
  }
  return Object.entries(merged)
    .filter(([, v]) => v > 0)
    .map(([key, val]) => ({
      key,
      label: STAT_LABELS[key]?.(val) ?? `+${val} ${key}`,
      color: STAT_COLORS[key] ?? '',
    }))
})
</script>

<style scoped>
.gear-card {
  display: flex;
  border-radius: 8px;
  border: 1px solid #2a1408;
  background: #130908;
  overflow: hidden;
  transition: border-color 0.15s, background 0.15s;
  cursor: default;
}
.gear-card:hover { border-color: #4a2010; background: #180b07; }
.gear-card.equipped { border-color: #ffd700; background: #14120a; }

.rarity-stripe {
  width: 4px;
  flex-shrink: 0;
  background: #333;
}
.gear-card.mythical  .rarity-stripe { background: #ff2244; }
.gear-card.legendary .rarity-stripe { background: #ffd700; }
.gear-card.epic      .rarity-stripe { background: #b44fff; }
.gear-card.rare      .rarity-stripe { background: #4fa8ff; }
.gear-card.uncommon  .rarity-stripe { background: #4dff88; }
.gear-card.common    .rarity-stripe { background: #555; }

.card-body {
  flex: 1;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.card-top {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
}
.gear-sprite { flex-shrink: 0; opacity: 0.9; }
.name-block  { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.item-name   { font-size: 0.8rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.item-name.mythical  { color: #ff2244; }
.item-name.legendary { color: #ffd700; }
.item-name.epic      { color: #b44fff; }
.item-name.rare      { color: #4fa8ff; }
.item-name.uncommon  { color: #4dff88; }
.item-name.common    { color: #ccc; }
.item-type { font-size: 0.58rem; color: #555; text-transform: capitalize; }

.on-badge {
  font-size: 0.58rem; padding: 1px 5px; border-radius: 8px; font-weight: 700; flex-shrink: 0;
  background: #2a1a00; color: #ff9944; border: 1px solid #5c3a00; white-space: nowrap;
}

.stat-row  { display: flex; flex-wrap: wrap; gap: 3px; }
.stat-chip { font-size: 0.6rem; padding: 1px 5px; border-radius: 4px; font-weight: 600; }
.stat-chip.red    { background: #3a0a0a; color: #ff6b6b; }
.stat-chip.green  { background: #0a2a0a; color: #4dff88; }
.stat-chip.blue   { background: #0a1a3a; color: #4fa8ff; }
.stat-chip.cyan   { background: #0a2a2a; color: #00d4ff; }
.stat-chip.orange { background: #3a1a00; color: #ff9944; }
.stat-chip.purple { background: #2a0a3a; color: #b44fff; }
.stat-chip.teal   { background: #0a2a2a; color: #4dffcc; }
.stat-chip.yellow { background: #2a2a00; color: #ffff44; }

.card-footer {
  display: flex;
  align-items: center;
  gap: 5px;
}
.stars-line  { font-size: 0.6rem; color: #ffd700; letter-spacing: 0; flex: 1; }
.lines-count { font-size: 0.58rem; color: #666; flex: 1; }
.action-btn {
  margin-left: auto;
  padding: 3px 10px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.68rem;
  font-weight: 700;
  transition: opacity 0.15s;
}
.action-btn:hover { opacity: 0.8; }
.action-btn.equip  { background: #c03040; color: #fff; }
.action-btn.remove { background: #2a1408; color: #888; border: 1px solid #3e1c0c; }
</style>
