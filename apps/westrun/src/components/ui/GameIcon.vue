<script setup>
import { computed } from 'vue'
import { ICONS, SHEET_COLS, SHEET_1_ROWS, SHEET_2_ROWS, SHEET_BS_COLS, SHEET_BS_ROWS, SHEET_LW_COLS, SHEET_LW_ROWS, SHEET_TW_COLS, SHEET_TW_ROWS, SHEET_MATS_COLS, SHEET_MATS_ROWS, SHEET_WW_COLS, SHEET_WW_ROWS, SHEET_ELV_COLS, SHEET_ELV_ROWS, SHEET_REGRET_COLS, SHEET_REGRET_ROWS } from '../../game/data/spritesheet.js'
const _B = import.meta.env.BASE_URL
const sheet1Url      = _B + 'ui/icons_1.png'
const sheet2Url      = _B + 'ui/icons_2.png'
const sheetBsUrl     = _B + 'ui/sprites_blacksmith.png'
const sheetLwUrl     = _B + 'ui/sprites_leatherworking.png'
const sheetTwUrl     = _B + 'ui/sprites_tailoring.png'
const sheetMatsUrl   = _B + 'ui/sprites_materials.png'
const sheetWwUrl     = _B + 'ui/sprites_woodworking.png'
const sheetElvUrl    = _B + 'ui/sprites_elvish.png'
const sheetRegretUrl = _B + 'ui/sprites_regret.png'

const SHEET_ROWS     = { 1: SHEET_1_ROWS, 2: SHEET_2_ROWS, bs: SHEET_BS_ROWS, lw: SHEET_LW_ROWS, tw: SHEET_TW_ROWS, mats: SHEET_MATS_ROWS, ww: SHEET_WW_ROWS, elv: SHEET_ELV_ROWS, regret: SHEET_REGRET_ROWS }
const SHEET_URLS     = { 1: sheet1Url,    2: sheet2Url,    bs: sheetBsUrl,    lw: sheetLwUrl,    tw: sheetTwUrl,    mats: sheetMatsUrl,    ww: sheetWwUrl,    elv: sheetElvUrl,   regret: sheetRegretUrl    }
const SHEET_COLS_MAP = { 1: SHEET_COLS,   2: SHEET_COLS,   bs: SHEET_BS_COLS, lw: SHEET_LW_COLS, tw: SHEET_TW_COLS, mats: SHEET_MATS_COLS, ww: SHEET_WW_COLS, elv: SHEET_ELV_COLS, regret: SHEET_REGRET_COLS }

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
