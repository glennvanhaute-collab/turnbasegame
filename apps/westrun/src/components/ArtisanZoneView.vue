<template>
  <div class="artisan-zone">
    <div class="az-bg" :style="{ backgroundImage: `url(${zoneBg})` }" />
    <div class="az-overlay" />

    <div class="az-content">

      <div class="az-header">
        <div class="az-title">Artisan Quarter</div>
        <div class="az-subtitle">Craft gear, tan hides, weave cloth, and shape timber into weapons</div>
      </div>

      <div class="az-grid">

        <button
          v-for="shop in SHOPS"
          :key="shop.id"
          class="az-card"
          :style="{ '--card-color': shop.color }"
          @click="$emit(shop.event)"
        >
          <div class="az-card-glow" />
          <div class="az-card-icon-wrap">
            <img v-if="shop.imgUrl" :src="shop.imgUrl" class="az-card-img-icon" alt="" />
            <GameIcon v-else :icon="shop.icon" :size="52" class="az-card-icon" />
          </div>
          <div class="az-card-info">
            <div class="az-card-name">{{ shop.name }}</div>
            <div class="az-card-desc">{{ shop.desc }}</div>
            <div class="az-card-level" v-if="shop.level !== null">
              <span class="az-card-lv-label">Lv.</span>
              <span class="az-card-lv-val">{{ shop.level }}</span>
              <div class="az-card-xp-track">
                <div class="az-card-xp-fill" :style="{ width: (shop.progress * 100) + '%' }" />
              </div>
            </div>
            <div class="az-card-level" v-else>
              <span class="az-card-lv-label" style="color: #9955ff; letter-spacing: 1px;">✦ Multi-discipline</span>
            </div>
          </div>
          <div class="az-card-enter">Enter →</div>
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import GameIcon from './ui/GameIcon.vue'
import { useResourceStore } from '../stores/useResourceStore.js'
const _B = import.meta.env.BASE_URL
const zoneBg          = _B + 'backgrounds/artisan-zone_bg.png'
const fusionIcon        = _B + 'ui/fusion_worshop_icon.png'
const weaponsmithIcon  = _B + 'ui/weaponsmith_icon.png'

defineEmits(['open-blacksmith', 'open-leatherworking', 'open-tailoring', 'open-woodworking', 'open-fusion-workshop', 'open-weapon-forge'])

const resources = useResourceStore()

const SHOPS = computed(() => [
  {
    id:       'blacksmith',
    event:    'open-blacksmith',
    name:     'Blacksmith',
    desc:     'Smelt ore into bars and forge plate armour & weapons',
    icon:     'skill_blacksmithing',
    color:    '#c9a227',
    level:    resources.smithingLevel,
    progress: resources.smithingProgress,
  },
  {
    id:       'leatherworking',
    event:    'open-leatherworking',
    name:     'Leatherworking',
    desc:     'Tan hides and craft leather armour for agile fighters',
    icon:     'skill_leatherworking',
    color:    '#a06830',
    level:    resources.leatherworkingLevel,
    progress: resources.leatherworkingProgress,
  },
  {
    id:       'tailoring',
    event:    'open-tailoring',
    name:     'Tailoring',
    desc:     'Weave cloth and sew robes for mages and priests',
    icon:     'skill_tailoring',
    color:    '#6688bb',
    level:    resources.tailoringLevel,
    progress: resources.tailoringProgress,
  },
  {
    id:       'woodworking',
    event:    'open-woodworking',
    name:     'Woodworking',
    desc:     'Shape timber into bows and staves for ranged warriors',
    icon:     'skill_woodworking',
    color:    '#6bba4a',
    level:    resources.woodworkingLevel,
    progress: resources.woodworkingProgress,
  },
  {
    id:       'fusion_workshop',
    event:    'open-fusion-workshop',
    name:     'Fusion Workshop',
    desc:     'Combine two disciplines to craft hybrid gear sets',
    imgUrl:   fusionIcon,
    color:    '#9955ff',
    level:    null,
    progress: 0,
  },
  {
    id:       'weapon_forge',
    event:    'open-weapon-forge',
    name:     'Weapon Forge',
    desc:     'Forge a weapon and write its chronicle',
    imgUrl:   weaponsmithIcon,
    color:    '#d4af37',
    level:    null,
    progress: 0,
  },
])
</script>

<style scoped>
.artisan-zone {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.az-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.45; pointer-events: none; z-index: 0;
}
.az-overlay {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at 50% 30%,
    rgba(14,8,4,0.55) 0%,
    rgba(7,3,1,0.90) 70%
  );
  pointer-events: none; z-index: 1;
}

.az-content {
  position: relative; z-index: 2;
  display: flex; flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 24px 20px;
  width: 100%;
  max-width: 880px;
}

.az-header {
  text-align: center;
  display: flex; flex-direction: column; gap: 7px;
}
.az-title {
  font-family: var(--font-head);
  font-size: 1.6rem; font-weight: 800;
  color: #fff; letter-spacing: 3px; text-transform: uppercase;
  text-shadow: 0 2px 20px rgba(0,0,0,0.95), 0 0 40px rgba(201,162,39,0.12);
}
.az-subtitle {
  font-size: 0.72rem; color: var(--text-muted);
  font-style: italic; letter-spacing: 0.5px;
}

/* ── Workshop grid ── */
.az-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 100%;
}

.az-card {
  position: relative;
  display: flex; align-items: center; gap: 18px;
  padding: 22px 20px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--card-color) 20%, rgba(58,30,10,0.6));
  background: color-mix(in srgb, var(--card-color) 5%, rgba(10,5,2,0.88));
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.2s;
  overflow: hidden;
  backdrop-filter: blur(8px);
}
.az-card:hover {
  border-color: color-mix(in srgb, var(--card-color) 55%, transparent);
  background: color-mix(in srgb, var(--card-color) 10%, rgba(12,6,2,0.92));
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5),
              0 0 24px color-mix(in srgb, var(--card-color) 15%, transparent);
}
.az-card:active { transform: translateY(0); }

.az-card-glow {
  position: absolute;
  inset: -40px;
  background: radial-gradient(ellipse at 20% 50%,
    color-mix(in srgb, var(--card-color) 12%, transparent) 0%,
    transparent 65%
  );
  pointer-events: none;
  transition: opacity 0.2s;
  opacity: 0;
}
.az-card:hover .az-card-glow { opacity: 1; }

.az-card-icon-wrap {
  flex-shrink: 0;
  width: 64px; height: 64px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--card-color) 30%, transparent);
  background: color-mix(in srgb, var(--card-color) 8%, rgba(0,0,0,0.5));
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.az-card:hover .az-card-icon-wrap {
  border-color: color-mix(in srgb, var(--card-color) 60%, transparent);
  box-shadow: 0 0 16px color-mix(in srgb, var(--card-color) 25%, transparent);
}
.az-card-icon { image-rendering: pixelated; }
.az-card-img-icon { width: 52px; height: 52px; object-fit: contain; }

.az-card-info {
  flex: 1; min-width: 0;
  display: flex; flex-direction: column; gap: 5px;
}
.az-card-name {
  font-family: var(--font-head);
  font-size: 0.9rem; font-weight: 800;
  color: #fff; letter-spacing: 1.5px; text-transform: uppercase;
}
.az-card-desc {
  font-size: 0.64rem; color: var(--text-muted);
  line-height: 1.5; font-style: italic;
}
.az-card-level {
  display: flex; align-items: center; gap: 7px; margin-top: 2px;
}
.az-card-lv-label {
  font-family: var(--font-head); font-size: 0.55rem;
  text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-dim);
}
.az-card-lv-val {
  font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  color: var(--card-color); min-width: 20px;
}
.az-card-xp-track {
  flex: 1; height: 5px;
  background: rgba(255,255,255,0.06); border-radius: 3px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.04);
}
.az-card-xp-fill {
  height: 100%;
  background: linear-gradient(to right,
    color-mix(in srgb, var(--card-color) 60%, #000),
    var(--card-color)
  );
  border-radius: 3px;
  transition: width 0.5s ease;
}

.az-card-enter {
  flex-shrink: 0;
  font-family: var(--font-head); font-size: 0.62rem; font-weight: 700;
  color: var(--card-color); letter-spacing: 1.5px; text-transform: uppercase;
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.2s, transform 0.2s;
}
.az-card:hover .az-card-enter {
  opacity: 1;
  transform: translateX(0);
}

/* Responsive: 1 column on narrow */
@media (max-width: 560px) {
  .az-grid { grid-template-columns: 1fr; }
  .az-title { font-size: 1.2rem; }
}
</style>
