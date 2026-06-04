<template>
  <div class="camp-view">
    <img :src="campBg" class="camp-bg" alt="" draggable="false" />

    <div class="camp-overlay">

      <!-- Income ticker -->
      <div class="camp-income">
        <span class="income-icon">🪙</span>
        <span class="income-val">+{{ camp.goldPerMin }}/min</span>
      </div>

      <!-- Encampment hotspot — center of the map -->
      <button class="hotspot hotspot--encampment" @click="$emit('open-collection')" title="Encampment">
        <span class="hotspot-ping" />
        <span class="hotspot-label">Encampment</span>
      </button>

      <!-- Placeholder hotspots for future buildings -->
      <button class="hotspot hotspot--market" disabled title="Market (coming soon)">
        <span class="hotspot-label locked">Market</span>
      </button>

      <button class="hotspot hotspot--blacksmith" disabled title="Blacksmith (coming soon)">
        <span class="hotspot-label locked">Blacksmith</span>
      </button>

      <button class="hotspot hotspot--watchtower" disabled title="Watchtower (coming soon)">
        <span class="hotspot-label locked">Watchtower</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import campBg from '../assets/backgrounds/training_camp.png'
import { useCampStore } from '../stores/useCampStore.js'
import { useCurrencyStore } from '../stores/useCurrencyStore.js'

defineEmits(['open-collection'])

const camp     = useCampStore()
const currency = useCurrencyStore()

let interval = null

onMounted(() => {
  camp.catchUp(g => currency.addGold(g))
  interval = setInterval(() => {
    camp.tick(g => currency.addGold(g))
  }, 60_000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.camp-view {
  position: relative;
  width: 100%;
  height: calc(100vh - 92px);
  overflow: hidden;
}

.camp-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  user-select: none;
}

.camp-overlay {
  position: absolute;
  inset: 0;
}

/* Income display */
.camp-income {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(8, 4, 2, 0.75);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 6px 14px;
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gold);
  backdrop-filter: blur(4px);
}
.income-icon { font-size: 0.85rem; }

/* Hotspots */
.hotspot {
  position: absolute;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  transform: translate(-50%, -50%);
}

.hotspot-ping {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 0 rgba(201, 162, 39, 0.6);
  animation: ping 2s ease-out infinite;
}
@keyframes ping {
  0%   { box-shadow: 0 0 0 0 rgba(201,162,39,0.6); }
  70%  { box-shadow: 0 0 0 14px rgba(201,162,39,0); }
  100% { box-shadow: 0 0 0 0 rgba(201,162,39,0); }
}

.hotspot-label {
  font-family: var(--font-head);
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-parchment);
  background: rgba(8,4,2,0.8);
  border: 1px solid var(--border-gold);
  border-radius: 4px;
  padding: 3px 10px;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  transition: color 0.15s, border-color 0.15s;
}
.hotspot:not(:disabled):hover .hotspot-label {
  color: var(--gold);
  border-color: var(--gold);
}
.hotspot-label.locked {
  color: var(--text-dim);
  border-color: var(--border-brown);
  cursor: not-allowed;
}

/* Positions — tuned to the training_camp.png layout */
.hotspot--encampment { top: 54%; left: 42%; }
.hotspot--market     { top: 38%; left: 62%; }
.hotspot--blacksmith { top: 68%; left: 28%; }
.hotspot--watchtower { top: 30%; left: 30%; }
</style>
