<script setup>
import { computed } from 'vue'
import { ICONS, SHEET_COLS, SHEET_1_ROWS, SHEET_2_ROWS, SHEET_BS_COLS, SHEET_BS_ROWS, SHEET_LW_COLS, SHEET_LW_ROWS, SHEET_TW_COLS, SHEET_TW_ROWS, SHEET_MATS_COLS, SHEET_MATS_ROWS, SHEET_WW_COLS, SHEET_WW_ROWS, SHEET_REGRET_COLS, SHEET_REGRET_ROWS } from '../../game/data/spritesheet.js'
import sheet1Url      from '../../assets/ui/icons_1.png'
import sheet2Url      from '../../assets/ui/icons_2.png'
import sheetBsUrl     from '../../assets/ui/sprites_blacksmith.png'
import sheetLwUrl     from '../../assets/ui/sprites_leatherworking.png'
import sheetTwUrl     from '../../assets/ui/sprites_tailoring.png'
import sheetMatsUrl   from '../../assets/ui/sprites_materials.png'
import sheetWwUrl     from '../../assets/ui/sprites_woodworking.png'
import sheetRegretUrl from '../../assets/ui/sprites_regret.png'

const SHEET_ROWS     = { 1: SHEET_1_ROWS, 2: SHEET_2_ROWS, bs: SHEET_BS_ROWS, lw: SHEET_LW_ROWS, tw: SHEET_TW_ROWS, mats: SHEET_MATS_ROWS, ww: SHEET_WW_ROWS, regret: SHEET_REGRET_ROWS }
const SHEET_URLS     = { 1: sheet1Url,    2: sheet2Url,    bs: sheetBsUrl,    lw: sheetLwUrl,    tw: sheetTwUrl,    mats: sheetMatsUrl,    ww: sheetWwUrl,    regret: sheetRegretUrl    }
const SHEET_COLS_MAP = { 1: SHEET_COLS,   2: SHEET_COLS,   bs: SHEET_BS_COLS, lw: SHEET_LW_COLS, tw: SHEET_TW_COLS, mats: SHEET_MATS_COLS, ww: SHEET_WW_COLS, regret: SHEET_REGRET_COLS }

const props = defineProps({
  icon: { type: String, required: true },
  size: { type: Number, default: 32 },
})

const style = computed(() => {
  const entry = ICONS[props.icon]
  if (!entry) return { width: `${props.size}px`, height: `${props.size}px`, display: 'inline-block' }
  const sheet = entry.sheet ?? 1
  const rows  = SHEET_ROWS[sheet]
  const cols  = SHEET_COLS_MAP[sheet] ?? SHEET_COLS
  return {
    width:              `${props.size}px`,
    height:             `${props.size}px`,
    backgroundImage:    `url(${SHEET_URLS[sheet]})`,
    backgroundSize:     `${cols * props.size}px ${rows * props.size}px`,
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
