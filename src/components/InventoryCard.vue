<template>
  <div class="inv-card" :class="[item.rarity.toLowerCase(), { 'is-equipped': !!equippedBy }]">
    <!-- Top row -->
    <div class="card-header">
      <span class="gear-icon">{{ gearIcon }}</span>
      <div class="card-title">
        <span class="item-name">{{ item.name }}</span>
        <div class="badges">
          <span class="rarity-badge" :class="item.rarity.toLowerCase()">{{ item.rarity }}</span>
          <span class="type-badge">{{ item.gearType }}</span>
          <span class="wtype-badge" v-if="item.weaponType">{{ item.weaponType }}</span>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="card-stats">
      <span
        v-for="s in statLines"
        :key="s.key"
        class="stat-chip"
        :class="s.color"
      >{{ s.label }}</span>
    </div>

    <!-- Lines (Legendary / Mythical only) -->
    <div class="lines-section" v-if="item.lines && item.lines.length > 0">
      <div class="lines-header">
        <span class="lines-title">Lines</span>
        <span class="lines-count" :class="item.rarity.toLowerCase()">{{ item.lines.length }}/6</span>
      </div>
      <div class="lines-list">
        <div v-for="(line, idx) in item.lines" :key="idx" class="line-entry" :class="line.type">
          <span class="line-icon">{{ lineIcon(line.type) }}</span>
          <span class="line-label">{{ line.label }}</span>
          <span class="line-bonus" v-if="lineBonusSummary(line)">{{ lineBonusSummary(line) }}</span>
        </div>
      </div>
    </div>
    <div class="lines-section lines-empty" v-else-if="item.rarity === 'Legendary' || item.rarity === 'Mythical'">
      <span class="lines-title">Lines</span>
      <span class="lines-none">0/6 — earn lines through battle &amp; discovery</span>
    </div>

    <!-- Equipped-by tag -->
    <div class="equipped-tag" v-if="equippedBy">
      <span class="eq-dot" />
      Equipped on <strong>{{ HERO_NAMES[equippedBy.heroKey] }}</strong>
      · {{ SLOT_LABELS[equippedBy.slot] }}
    </div>
    <div class="equipped-tag unequipped" v-else>— Unequipped</div>

    <!-- Actions -->
    <div class="card-actions">
      <button class="btn btn-equip" @click="$emit('equip')">Equip…</button>
      <button class="btn btn-remove" v-if="equippedBy" @click="$emit('unequip')">Unequip</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { GearType, SLOT_LABELS } from '../game/Gear.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'

const props = defineProps({
  item:       { type: Object, required: true },
  equippedBy: { type: Object, default: null },   // { heroKey, slot } | null
})
defineEmits(['equip', 'unequip'])

const HERO_NAMES = Object.fromEntries(
  Object.entries(HERO_TEMPLATES)
    .filter(([, f]) => f().isPlayer)
    .map(([key, f]) => [key, f().name])
)

const GEAR_ICONS = {
  [GearType.WEAPON]: '⚔', [GearType.SHIELD]: '🛡',
  [GearType.HELMET]: '⛑', [GearType.ARMOR]:  '🥋', [GearType.BOOTS]: '👟',
}
const gearIcon = computed(() => GEAR_ICONS[props.item.gearType] ?? '▪')

const STAT_LABELS = {
  hp: v => `+${v} HP`, hpPct: v => `+${Math.round(v*100)}% HP`,
  atk: v => `+${v} ATK`, atkPct: v => `+${Math.round(v*100)}% ATK`,
  def: v => `+${v} DEF`, defPct: v => `+${Math.round(v*100)}% DEF`,
  spd: v => `+${v} SPD`, spdPct: v => `+${Math.round(v*100)}% SPD`,
  critRate: v => `+${Math.round(v*100)}% CR`, critDmg: v => `+${Math.round(v*100)}% CD`,
  resistance: v => `+${Math.round(v*100)}% RES`, accuracy: v => `+${Math.round(v*100)}% ACC`,
}
const STAT_COLORS = {
  hp: 'green', hpPct: 'green', atk: 'red', atkPct: 'red',
  def: 'blue', defPct: 'blue', spd: 'cyan', spdPct: 'cyan',
  critRate: 'orange', critDmg: 'purple', resistance: 'teal', accuracy: 'yellow',
}
const statLines = computed(() =>
  Object.entries(props.item.stats)
    .filter(([, v]) => v > 0)
    .map(([key, val]) => ({ key, label: STAT_LABELS[key]?.(val) ?? `+${val}`, color: STAT_COLORS[key] ?? '' }))
)

const LINE_ICONS = { use: '⚔', slayer: '☠', discovery: '✦' }
function lineIcon(type) { return LINE_ICONS[type] ?? '◆' }

function lineBonusSummary(line) {
  if (!line.bonus) return ''
  return Object.entries(line.bonus)
    .map(([key, val]) => STAT_LABELS[key]?.(val) ?? `+${val}`)
    .join(' ')
}
</script>

<style scoped>
.inv-card {
  background: #130908;
  border: 1px solid #3e1c0c;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;
}
.inv-card:hover { border-color: #6a2e14; }
.inv-card.is-equipped { border-color: #3a2a00; }

/* Rarity left-border accent */
.inv-card.mythical  { border-left: 3px solid #ff6ef7; box-shadow: inset 0 0 20px rgba(255,110,247,0.06); }
.inv-card.legendary { border-left: 3px solid #ffd700; }
.inv-card.epic      { border-left: 3px solid #b44fff; }
.inv-card.rare      { border-left: 3px solid #4fa8ff; }
.inv-card.uncommon  { border-left: 3px solid #4dff88; }
.inv-card.common    { border-left: 3px solid #444; }

.card-header { display: flex; align-items: flex-start; gap: 10px; }
.gear-icon   { font-size: 1.6rem; line-height: 1; flex-shrink: 0; }
.card-title  { flex: 1; min-width: 0; }
.item-name   { display: block; font-size: 0.88rem; font-weight: 700; color: #fff; margin-bottom: 4px; }
.badges      { display: flex; flex-wrap: wrap; gap: 4px; }

.rarity-badge { font-size: 0.58rem; padding: 1px 6px; border-radius: 10px; font-weight: 700; }
.rarity-badge.mythical  { background: #2a0a2a; color: #ff6ef7; border: 1px solid #ff6ef755; }
.rarity-badge.legendary { background: #3a2a00; color: #ffd700; }
.rarity-badge.epic      { background: #2a0a3a; color: #b44fff; }
.rarity-badge.rare      { background: #0a1a3a; color: #4fa8ff; }
.rarity-badge.uncommon  { background: #0a2a1a; color: #4dff88; }
.rarity-badge.common    { background: #2a2a2a; color: #888; }

.type-badge  { font-size: 0.58rem; padding: 1px 6px; border-radius: 10px; background: #221108; color: #666; text-transform: capitalize; }
.wtype-badge { font-size: 0.58rem; padding: 1px 6px; border-radius: 10px; background: #221108; color: #555; text-transform: capitalize; }

.card-stats  { display: flex; flex-wrap: wrap; gap: 4px; }
.stat-chip   { font-size: 0.62rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; }
.stat-chip.red    { background: #3a0a0a; color: #ff6b6b; }
.stat-chip.green  { background: #0a2a0a; color: #4dff88; }
.stat-chip.blue   { background: #0a1a3a; color: #4fa8ff; }
.stat-chip.cyan   { background: #0a2a2a; color: #00d4ff; }
.stat-chip.orange { background: #3a1a00; color: #ff9944; }
.stat-chip.purple { background: #2a0a3a; color: #b44fff; }
.stat-chip.teal   { background: #0a2a2a; color: #4dffcc; }
.stat-chip.yellow { background: #2a2a00; color: #ffff44; }

.equipped-tag {
  font-size: 0.7rem;
  color: #888;
  display: flex;
  align-items: center;
  gap: 5px;
}
.equipped-tag strong { color: #ffd700; }
.equipped-tag.unequipped { color: #333; font-style: italic; }
.eq-dot { width: 6px; height: 6px; border-radius: 50%; background: #ffd700; flex-shrink: 0; }

.card-actions { display: flex; gap: 6px; margin-top: 2px; }
.btn { padding: 5px 12px; border-radius: 5px; border: none; cursor: pointer; font-size: 0.72rem; font-weight: 700; transition: opacity 0.15s; }
.btn:hover   { opacity: 0.8; }
.btn-equip   { background: #e94560; color: #fff; }
.btn-remove  { background: #3e1c0c; color: #aaa; }

/* Lines section */
.lines-section {
  background: #0c0508;
  border: 1px solid #2a0a2a;
  border-radius: 6px;
  padding: 6px 8px;
}
.lines-section.lines-empty {
  display: flex;
  align-items: center;
  gap: 8px;
}
.lines-header { display: flex; align-items: center; gap: 6px; margin-bottom: 5px; }
.lines-title  { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; color: #555; font-weight: 700; }
.lines-count  { font-size: 0.6rem; font-weight: 700; padding: 1px 5px; border-radius: 8px; }
.lines-count.legendary { background: #2a1e00; color: #ffd700; }
.lines-count.mythical  { background: #2a0a2a; color: #ff6ef7; }
.lines-none   { font-size: 0.62rem; color: #3a1a3a; font-style: italic; }
.lines-list   { display: flex; flex-direction: column; gap: 3px; }

.line-entry {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  padding: 2px 0;
}
.line-icon  { font-size: 0.6rem; flex-shrink: 0; opacity: 0.8; }
.line-label { color: #ccc; flex: 1; }
.line-bonus { color: #aa8833; font-weight: 700; white-space: nowrap; }

.line-entry.use       .line-icon { color: #ff9944; }
.line-entry.slayer    .line-icon { color: #ff6b6b; }
.line-entry.discovery .line-icon { color: #88ccff; }
.line-entry.use       .line-label { color: #cc9966; }
.line-entry.slayer    .line-label { color: #cc6666; }
.line-entry.discovery .line-label { color: #88aacc; }
</style>
