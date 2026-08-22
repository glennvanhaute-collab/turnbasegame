<template>
  <span class="orb-icon" :style="spriteStyle" :title="title" />
</template>

<script setup>
import { computed } from 'vue'
const _B = import.meta.env.BASE_URL
const orbSheet = _B + 'ui/orbs_icons.png'

const props = defineProps({
  orbId:  { type: String, required: true },   // 'cracked' | 'master' | 'dark'
  size:   { type: Number, default: 40 },
  title:  { type: String, default: '' },
})

// Sprite sheet: 3 orbs side by side, equal width
// backgroundPosition: 0%=Simple, 50%=Magnificent, 100%=Astral
const X_POS = { cracked: '0%', master: '50%', dark: '100%' }

const spriteStyle = computed(() => ({
  width:              props.size + 'px',
  height:             props.size + 'px',
  backgroundImage:    `url(${orbSheet})`,
  backgroundSize:     '300% 300%',
  backgroundPosition: `${X_POS[props.orbId] ?? '0%'} 50%`,
  backgroundRepeat:   'no-repeat',
  display:            'inline-block',
  flexShrink:         '0',
}))
</script>
