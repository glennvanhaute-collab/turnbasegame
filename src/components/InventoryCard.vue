<template>
  <div class="inv-row" :class="item.rarity.toLowerCase()">
    <GameIcon :icon="slotIcon" :size="22" class="ir-icon" />
    <div class="ir-body">
      <span class="ir-name">{{ item.name }}</span>
      <span class="ir-eq" v-if="equippedBy">● {{ HERO_NAMES[equippedBy.heroKey] }}</span>
    </div>
    <div class="ir-actions">
      <span class="ir-equipped-tag" v-if="equippedBy">Equipped</span>
      <button class="ir-remove" v-if="equippedBy" @click="$emit('unequip')">✕</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { SLOT_LABELS } from '../game/Gear.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'
import { tierSlotIcon } from '../game/data/spritesheet.js'
import GameIcon from './ui/GameIcon.vue'

const props = defineProps({
  item:       { type: Object, required: true },
  equippedBy: { type: Object, default: null },
})
defineEmits(['unequip'])

const HERO_NAMES = Object.fromEntries(
  Object.entries(HERO_TEMPLATES)
    .filter(([, f]) => f().isPlayer)
    .map(([key, f]) => [key, f().name])
)

const slotIcon = computed(() => tierSlotIcon(props.item.tier, props.item.slot, props.item.craftDiscipline))
</script>

<style scoped>
.inv-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: #130908;
  border: 1px solid #2a1208;
  border-radius: 6px;
  border-left-width: 3px;
  transition: border-color 0.12s;
}
.inv-row:hover { border-color: #5a2a10; }

.inv-row.mythical  { border-left-color: #ff2244; }
.inv-row.legendary { border-left-color: #ffd700; }
.inv-row.epic      { border-left-color: #b44fff; }
.inv-row.rare      { border-left-color: #4fa8ff; }
.inv-row.uncommon  { border-left-color: #4dff88; }
.inv-row.common    { border-left-color: #444; }

.ir-icon { flex-shrink: 0; opacity: 0.85; }

.ir-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}
.ir-name {
  font-size: 0.78rem;
  font-weight: 700;
  color: #ddd;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ir-eq {
  font-size: 0.58rem;
  color: #ffd700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ir-actions { display: flex; gap: 4px; flex-shrink: 0; }
.ir-equipped-tag {
  font-size: 0.58rem;
  font-weight: 700;
  color: #4dff88;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  opacity: 0.75;
}
.ir-remove {
  padding: 4px 7px;
  border-radius: 4px;
  border: 1px solid #5a2020;
  background: rgba(90,20,20,0.3);
  color: #c08080;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.12s;
}
.ir-remove:hover { border-color: #cc4444; color: #ffaaaa; }
</style>
