<script setup>
import { computed } from 'vue'
import { ICONS, SHEET_COLS, SHEET_1_ROWS, SHEET_2_ROWS } from '../../game/data/spritesheet.js'
import sheet1Url from '../../assets/ui/icons_1.png'
import sheet2Url from '../../assets/ui/icons_2.png'

const SHEET_ROWS = { 1: SHEET_1_ROWS, 2: SHEET_2_ROWS }
const SHEET_URLS = { 1: sheet1Url,    2: sheet2Url    }

const props = defineProps({
  icon: { type: String, required: true },
  size: { type: Number, default: 32 },
})

const style = computed(() => {
  const entry = ICONS[props.icon]
  if (!entry) return { width: `${props.size}px`, height: `${props.size}px`, display: 'inline-block' }
  const sheet = entry.sheet ?? 1
  const rows  = SHEET_ROWS[sheet]
  return {
    width:              `${props.size}px`,
    height:             `${props.size}px`,
    backgroundImage:    `url(${SHEET_URLS[sheet]})`,
    backgroundSize:     `${SHEET_COLS * props.size}px ${rows * props.size}px`,
    backgroundPosition: `-${entry.col * props.size}px -${entry.row * props.size}px`,
    backgroundRepeat:   'no-repeat',
    display:            'inline-block',
    imageRendering:     'pixelated',
    flexShrink:         '0',
  }
})
</script>

<template>
  <span :style="style" :title="icon" />
</template>
