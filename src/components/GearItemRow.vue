<template>
  <div class="gear-row" :class="{ equipped }">
    <div class="gear-info">
      <div class="gear-top">
        <span class="gear-icon">{{ gearIcon }}</span>
        <span class="gear-name">{{ item.name }}</span>
        <span class="rarity-badge" :class="item.rarity.toLowerCase()">{{ item.rarity }}</span>
        <span class="weapon-type" v-if="item.weaponType">{{ item.weaponType }}</span>
        <span class="on-hero-badge" v-if="equippedOnName">On: {{ equippedOnName }}</span>
      </div>
      <div class="gear-stats">
        <span v-for="s in statLines" :key="s.key" class="stat-chip" :class="s.color">
          {{ s.label }}
        </span>
      </div>
    </div>
    <div class="gear-actions">
      <button v-if="equipped" class="btn btn-remove" @click="$emit('unequip')">Remove</button>
      <button v-else class="btn btn-equip" @click="$emit('equip')">Equip</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GearType, WeaponType } from '../game/Gear.js'

const props = defineProps({
  item:           { type: Object,  required: true },
  equipped:       { type: Boolean, default: false },
  equippedOnName: { type: String,  default: null },
})
defineEmits(['equip', 'unequip'])

const GEAR_ICONS = {
  [GearType.WEAPON]:  '⚔',
  [GearType.SHIELD]:  '🛡',
  [GearType.HELMET]:  '⛑',
  [GearType.ARMOR]:   '🥋',
  [GearType.BOOTS]:   '👟',
}
const gearIcon = computed(() => GEAR_ICONS[props.item.gearType] ?? '▪')

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

const statLines = computed(() =>
  Object.entries(props.item.stats)
    .filter(([, v]) => v > 0)
    .map(([key, val]) => ({
      key,
      label: STAT_LABELS[key]?.(val) ?? `+${val} ${key}`,
      color: STAT_COLORS[key] ?? '',
    }))
)
</script>

<style scoped>
.gear-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #3e1c0c;
  background: #130908;
  transition: border-color 0.15s;
}
.gear-row:hover   { border-color: #6a2e14; }
.gear-row.equipped { border-color: #ffd700; background: #12120a; }

.gear-info { flex: 1; min-width: 0; }
.gear-top  { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; flex-wrap: wrap; }
.gear-icon { font-size: 0.9rem; flex-shrink: 0; }
.gear-name { font-size: 0.82rem; font-weight: 700; color: #ddd; }

.rarity-badge { font-size: 0.6rem; padding: 1px 6px; border-radius: 10px; font-weight: 700; flex-shrink: 0; }
.rarity-badge.mythical  { background: #2a0a2a; color: #ff6ef7; border: 1px solid #ff6ef755; }
.rarity-badge.legendary { background: #3a2a00; color: #ffd700; }
.rarity-badge.epic      { background: #2a0a3a; color: #b44fff; }
.rarity-badge.rare      { background: #0a1a3a; color: #4fa8ff; }
.rarity-badge.uncommon  { background: #0a2a1a; color: #4dff88; }
.rarity-badge.common    { background: #2a2a2a; color: #888; }

.weapon-type  { font-size: 0.6rem; color: #555; text-transform: capitalize; }
.on-hero-badge {
  font-size: 0.6rem; padding: 1px 6px; border-radius: 10px; font-weight: 700;
  background: #2a1a00; color: #ff9944; border: 1px solid #5c3a00;
  white-space: nowrap;
}

.gear-stats { display: flex; flex-wrap: wrap; gap: 4px; }
.stat-chip  { font-size: 0.62rem; padding: 1px 5px; border-radius: 4px; font-weight: 600; }
.stat-chip.red    { background: #3a0a0a; color: #ff6b6b; }
.stat-chip.green  { background: #0a2a0a; color: #4dff88; }
.stat-chip.blue   { background: #0a1a3a; color: #4fa8ff; }
.stat-chip.cyan   { background: #0a2a2a; color: #00d4ff; }
.stat-chip.orange { background: #3a1a00; color: #ff9944; }
.stat-chip.purple { background: #2a0a3a; color: #b44fff; }
.stat-chip.teal   { background: #0a2a2a; color: #4dffcc; }
.stat-chip.yellow { background: #2a2a00; color: #ffff44; }

.gear-actions { flex-shrink: 0; }
.btn { padding: 5px 12px; border-radius: 5px; border: none; cursor: pointer; font-size: 0.72rem; font-weight: 700; transition: opacity 0.15s; }
.btn:hover  { opacity: 0.8; }
.btn-equip  { background: #e94560; color: #fff; }
.btn-remove { background: #3e1c0c; color: #aaa; }
</style>
