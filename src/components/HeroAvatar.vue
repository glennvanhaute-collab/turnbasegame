<template>
  <!-- Portrait image mode -->
  <div v-if="portrait" class="portrait-wrap" :style="{ width: size + 'px', height: size + 'px' }">
    <img :src="portrait" class="portrait-img" alt="" />
    <div class="portrait-ring" :style="{ '--ring': rarityColor }" />
    <div class="portrait-glow" :style="{ '--glow': rarityColor }" />
  </div>

  <!-- SVG fallback -->
  <div v-else class="avatar-wrap" :style="{ width: size + 'px', height: size + 'px' }">
  <svg :width="size" :height="size" viewBox="0 0 80 80" class="hero-avatar">
    <defs>
      <radialGradient :id="`grad-${uid}`" cx="42%" cy="32%" r="70%">
        <stop offset="0%"   :stop-color="colors.light" stop-opacity="0.55" />
        <stop offset="100%" :stop-color="colors.dark"  stop-opacity="1" />
      </radialGradient>
      <radialGradient :id="`glow-${uid}`" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   :stop-color="rarityColor" stop-opacity="0.18" />
        <stop offset="100%" :stop-color="rarityColor" stop-opacity="0" />
      </radialGradient>
    </defs>

    <circle cx="40" cy="40" r="40" :fill="`url(#glow-${uid})`" />
    <circle cx="40" cy="40" r="38.5" fill="none" :stroke="rarityColor" stroke-width="1" opacity="0.75" />
    <circle cx="40" cy="40" r="36.5" :fill="`url(#grad-${uid})`" />
    <circle cx="40" cy="40" r="30" fill="none" :stroke="colors.mid" stroke-width="0.7" opacity="0.3" />

    <circle cx="40" cy="12" r="1.8" :fill="colors.mid" opacity="0.45" />
    <circle cx="40" cy="68" r="1.8" :fill="colors.mid" opacity="0.45" />
    <circle cx="12" cy="40" r="1.8" :fill="colors.mid" opacity="0.45" />
    <circle cx="68" cy="40" r="1.8" :fill="colors.mid" opacity="0.45" />

    <line x1="21" y1="21" x2="24" y2="24" :stroke="colors.mid" stroke-width="1" opacity="0.25" stroke-linecap="round" />
    <line x1="59" y1="21" x2="56" y2="24" :stroke="colors.mid" stroke-width="1" opacity="0.25" stroke-linecap="round" />
    <line x1="21" y1="59" x2="24" y2="56" :stroke="colors.mid" stroke-width="1" opacity="0.25" stroke-linecap="round" />
    <line x1="59" y1="59" x2="56" y2="56" :stroke="colors.mid" stroke-width="1" opacity="0.25" stroke-linecap="round" />

    <text x="40" y="56" text-anchor="middle" font-size="10"
      font-family="Segoe UI, system-ui, sans-serif"
      :fill="colors.mid" opacity="0.45">{{ affinitySymbol }}</text>

    <text x="40" y="46" text-anchor="middle"
      :font-size="initials.length > 2 ? 17 : 22"
      font-weight="800"
      font-family="Segoe UI, system-ui, sans-serif"
      letter-spacing="1"
      :fill="colors.text" opacity="0.95">{{ initials }}</text>
  </svg>
  <img v-if="borderImg" :src="borderImg" class="border-overlay" alt="" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getPortrait } from '../game/portraits.js'
const _avatarModules = import.meta.glob('../assets/avatar_*.png', { eager: true })
import borderAldric   from '../assets/avatar_border_aldric.png'
import borderValdris  from '../assets/avatar_border_valdris.png'
import borderCaelwyn  from '../assets/avatar_border__caelwyn.png'
import borderMordaine from '../assets/avatar_border_mordaine.png'
import borderAncient  from '../assets/avatar_border__ancient.png'

const PLAYER_AVATARS = Object.fromEntries(
  Object.entries(_avatarModules).map(([path, mod]) => {
    const id = path.match(/avatar_\d+/)?.[0]
    return [id, mod.default]
  }).filter(([id]) => id)
)

const HOUSE_BORDERS = {
  'House Aldric':   borderAldric,
  'House Valdris':  borderValdris,
  'House Caelwyn':  borderCaelwyn,
  'House Mordaine': borderMordaine,
  'Ancient Nobles': borderAncient,
}

const props = defineProps({
  hero: { type: Object, required: true },
  size: { type: Number, default: 72 },
})

const portrait   = computed(() => {
  if (props.hero.id === 'player_character') {
    return PLAYER_AVATARS[props.hero.avatarId] ?? null
  }
  return getPortrait(props.hero)
})
const borderImg  = computed(() => HOUSE_BORDERS[props.hero.faction] ?? null)
const uid        = computed(() => props.hero.id)

const SKIP_WORDS = new Set(['the', 'of', 'von', 'de', 'la', 'le'])

const initials = computed(() => {
  const words = props.hero.name.split(' ').filter(w => !SKIP_WORDS.has(w.toLowerCase()))
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
})

const AFFINITY_COLORS = {
  Force:  { light: '#ff8c42', mid: '#ff6a1a', dark: '#1c0600', text: '#ffb882' },
  Magic:  { light: '#6ec6ff', mid: '#3399ee', dark: '#00101f', text: '#a8d8ff' },
  Spirit: { light: '#5dff9a', mid: '#2ecc70', dark: '#001a0c', text: '#90ffcc' },
  Void:   { light: '#cc66ff', mid: '#9933ee', dark: '#0f001a', text: '#dd99ff' },
  Blood:  { light: '#ff4455', mid: '#cc1133', dark: '#1a0005', text: '#ff9aaa' },
  Astral: { light: '#ff88ff', mid: '#ee44cc', dark: '#1a0018', text: '#ffaaff' },
}

const AFFINITY_SYMBOLS = { Force: '⚔', Magic: '✦', Spirit: '☽', Void: '◈', Blood: '◆', Astral: '✧' }

const RARITY_COLORS = {
  Ancient:   '#3a0808',
  Mythical:  '#ff6ef7',
  Legendary: '#ffd700',
  Epic:      '#b44fff',
  Rare:      '#4fa8ff',
  Uncommon:  '#4dff88',
  Common:    '#666666',
}

const colors         = computed(() => AFFINITY_COLORS[props.hero.affinity] ?? AFFINITY_COLORS.Force)
const rarityColor    = computed(() => RARITY_COLORS[props.hero.rarity] ?? '#666')
const affinitySymbol = computed(() => AFFINITY_SYMBOLS[props.hero.affinity] ?? '·')
</script>

<style scoped>
.hero-avatar { display: block; }

.portrait-wrap,
.avatar-wrap {
  position: relative;
  border-radius: 50%;
  flex-shrink: 0;
  display: block;
  overflow: visible;
}
.portrait-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
}
.portrait-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid var(--ring);
  pointer-events: none;
}
.portrait-glow {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  box-shadow: 0 0 12px 2px var(--glow);
  opacity: 0.45;
  pointer-events: none;
}

/* House-specific border frame — sits on top, slightly oversized */
.border-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 135%;
  height: 135%;
  pointer-events: none;
  object-fit: contain;
}
</style>
