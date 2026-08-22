<template>
  <div
    class="hero-card"
    :class="{
      dead: hero.isDead,
      active: isActive,
      selectable: selectable,
      enemy: !hero.isPlayer,
    }"
    @click="selectable && !hero.isDead && $emit('select', hero)"
  >
    <div class="hero-name" :class="hero.rarity.toLowerCase()">{{ hero.name }}</div>
    <div class="hero-meta">
      <span class="rarity" :class="hero.rarity.toLowerCase()">{{ hero.rarity }}</span>
      <span class="affinity" :title="hero.affinity">
        <GameIcon v-if="AFFINITY_ICON[hero.affinity]" :icon="AFFINITY_ICON[hero.affinity]" :size="14" />
        <template v-else>{{ hero.affinity }}</template>
      </span>
    </div>

    <div class="hp-bar-wrap">
      <div class="hp-bar" :style="{ width: hpPercent + '%' }" :class="hpClass" />
      <span class="hp-text">{{ hero.hp }} / {{ hero.maxHp }}</span>
    </div>

    <div class="turn-meter-wrap">
      <div class="turn-meter" :style="{ width: hero.turnMeter + '%' }" />
    </div>

    <div class="status-effects" v-if="hero.statusEffects.length">
      <span
        v-for="se in hero.statusEffects"
        :key="se.type"
        class="status-badge"
        :class="isDebuff(se.type) ? 'debuff' : 'buff'"
        :title="se.type + ' (' + se.duration + ' turns)'"
      >{{ statusIcon(se.type) }}{{ se.duration }}</span>
    </div>

    <div class="stats-row">
      <span title="ATK">⚔ {{ hero.atk }}</span>
      <span title="DEF">🛡 {{ hero.def }}</span>
      <span title="SPD">💨 {{ hero.spd }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { StatusEffect } from '../game/Skill.js'
import { AFFINITY_ICON } from '../game/data/spritesheet.js'
import GameIcon from './ui/GameIcon.vue'

const props = defineProps({
  hero: { type: Object, required: true },
  isActive: { type: Boolean, default: false },
  selectable: { type: Boolean, default: false },
})
defineEmits(['select'])

const hpPercent = computed(() => Math.max(0, (props.hero.hp / props.hero.maxHp) * 100))
const hpClass = computed(() => {
  if (hpPercent.value > 60) return 'green'
  if (hpPercent.value > 30) return 'yellow'
  return 'red'
})

const DEBUFFS = new Set([
  StatusEffect.POISON, StatusEffect.BURN, StatusEffect.FREEZE,
  StatusEffect.STUN, StatusEffect.WEAKEN, StatusEffect.DECREASE_ATK,
  StatusEffect.DECREASE_DEF, StatusEffect.DECREASE_SPD, StatusEffect.SLEEP,
])
const isDebuff = type => DEBUFFS.has(type)

const STATUS_ICONS = {
  [StatusEffect.POISON]: '☠',
  [StatusEffect.BURN]: '🔥',
  [StatusEffect.FREEZE]: '❄',
  [StatusEffect.STUN]: '⚡',
  [StatusEffect.WEAKEN]: '💢',
  [StatusEffect.SHIELD]: '🔰',
  [StatusEffect.INCREASE_ATK]: '↑A',
  [StatusEffect.INCREASE_DEF]: '↑D',
  [StatusEffect.INCREASE_SPD]: '↑S',
  [StatusEffect.DECREASE_ATK]: '↓A',
  [StatusEffect.DECREASE_DEF]: '↓D',
  [StatusEffect.DECREASE_SPD]: '↓S',
  [StatusEffect.CONTINUOUS_HEAL]: '💚',
  [StatusEffect.IMMUNITY]: '✨',
}
const statusIcon = type => STATUS_ICONS[type] ?? '?'
</script>

<style scoped>
.hero-card {
  background: #221108;
  border: 2px solid #3e1c0c;
  border-radius: 8px;
  padding: 10px;
  min-width: 140px;
  cursor: default;
  transition: border-color 0.2s, transform 0.15s;
  user-select: none;
}
.hero-card.active  { border-color: #ffd700; box-shadow: 0 0 8px #ffd70066; }
.hero-card.selectable:not(.dead) { cursor: pointer; }
.hero-card.selectable:not(.dead):hover { border-color: #e94560; transform: translateY(-3px); }
.hero-card.dead    { opacity: 0.35; filter: grayscale(1); }
.hero-card.enemy   { border-color: #5a0000; }

.hero-name           { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; color: #eee; }
.hero-name.mythical  { color: #ff2244; }
.hero-name.legendary { color: #ffd700; }
.hero-name.epic      { color: #b44fff; }
.hero-name.rare      { color: #4fa8ff; }
.hero-name.uncommon  { color: #4dff88; }
.hero-name.common    { color: #ccc; }

.hero-meta { display: flex; gap: 6px; margin-bottom: 6px; font-size: 0.7rem; }
.rarity.legendary { color: #ffd700; }
.rarity.epic      { color: #b44fff; }
.rarity.rare      { color: #4fa8ff; }
.rarity.uncommon  { color: #4dff88; }
.rarity.common    { color: #aaa; }
.affinity         { color: #aaa; }

.hp-bar-wrap { position: relative; height: 12px; background: #333; border-radius: 4px; margin-bottom: 3px; overflow: hidden; }
.hp-bar      { height: 100%; border-radius: 4px; transition: width 0.4s; }
.hp-bar.green  { background: #27ae60; }
.hp-bar.yellow { background: #f39c12; }
.hp-bar.red    { background: #e74c3c; }
.hp-text { position: absolute; right: 4px; top: 0; font-size: 0.6rem; color: #fff; line-height: 12px; }

.turn-meter-wrap { height: 4px; background: #222; border-radius: 2px; margin-bottom: 5px; overflow: hidden; }
.turn-meter      { height: 100%; background: #00d4ff; transition: width 0.3s; }

.status-effects { display: flex; flex-wrap: wrap; gap: 3px; margin-bottom: 5px; }
.status-badge   { font-size: 0.65rem; padding: 1px 4px; border-radius: 3px; }
.status-badge.buff   { background: #1a4a1a; color: #4dff88; border: 1px solid #4dff88; }
.status-badge.debuff { background: #4a1a1a; color: #ff6b6b; border: 1px solid #ff6b6b; }

.stats-row { display: flex; justify-content: space-between; font-size: 0.68rem; color: #aaa; }
</style>
