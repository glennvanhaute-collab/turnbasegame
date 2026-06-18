<template>
  <div class="camp-root">

    <!-- Map header strip -->
    <div class="camp-map-strip" :style="{ backgroundImage: `url(${campBg})` }">
      <div class="map-overlay" />
      <div class="map-header-content">
        <div class="camp-title-block">
          <h2 class="camp-title">The Encampment</h2>
          <p class="camp-subtitle">Forge your stronghold. Every stone laid is a battle won before it begins.</p>
        </div>
        <div class="camp-income-pill">
          <span>🪙</span>
          <span>+{{ camp.goldPerMin }}/min</span>
        </div>
      </div>
    </div>

    <!-- Buildings grid -->
    <div class="buildings-panel">
      <div class="buildings-grid">
        <div
          v-for="id in BUILDING_IDS"
          :key="id"
          class="building-card"
          :class="{ maxed: buildings.isMaxed(id) }"
          :style="cardBg(id)"
        >
          <div class="card-inner">
            <!-- Tier badge -->
            <div class="tier-pip-row">
              <span
                v-for="t in CAMP_BUILDINGS[id].tiers.length"
                :key="t"
                class="tier-pip"
                :class="{ filled: t <= buildings.getLevel(id) }"
              />
            </div>

            <div class="building-name">{{ CAMP_BUILDINGS[id].name }}</div>
            <div class="building-lore">{{ CAMP_BUILDINGS[id].lore }}</div>

            <!-- Active bonus -->
            <div v-if="buildings.getLevel(id) > 0" class="active-bonus">
              <span class="bonus-label">Active:</span>
              <span class="bonus-text">{{ CAMP_BUILDINGS[id].tiers[buildings.getLevel(id) - 1].bonus }}</span>
            </div>

            <!-- Next tier cost -->
            <div v-if="!buildings.isMaxed(id)" class="upgrade-cost">
              <span class="cost-label">Tier {{ buildings.getLevel(id) + 1 }}:</span>
              <span class="cost-item gold-cost">
                🪙 {{ buildings.getNextCost(id).gold.toLocaleString() }}
              </span>
              <span
                v-for="(amount, oreId) in buildings.getNextCost(id).ores"
                :key="oreId"
                class="cost-item ore-cost"
                :class="{ insufficient: (resources.ores[oreId] ?? 0) < amount }"
              >
                {{ ORE_NAMES[oreId] }} ×{{ amount }}
                <span class="ore-owned">({{ resources.ores[oreId] ?? 0 }})</span>
              </span>
            </div>

            <div v-if="buildings.isMaxed(id)" class="maxed-label">◈ Fully Upgraded</div>

            <!-- Next tier bonus preview -->
            <div v-if="!buildings.isMaxed(id)" class="next-bonus">
              <span class="next-label">Grants:</span>
              {{ CAMP_BUILDINGS[id].tiers[buildings.getLevel(id)].bonus }}
            </div>

            <button
              v-if="!buildings.isMaxed(id)"
              class="upgrade-btn"
              :class="{ affordable: buildings.canAfford(id) }"
              :disabled="!buildings.canAfford(id)"
              @click="buildings.upgrade(id)"
            >
              {{ buildings.getLevel(id) === 0 ? 'Construct' : 'Upgrade' }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import campBg from '../assets/backgrounds/training_camp.png'
import { useCampStore }          from '../stores/useCampStore.js'
import { useCurrencyStore }      from '../stores/useCurrencyStore.js'
import { useResourceStore }      from '../stores/useResourceStore.js'
import { useCampBuildingStore }  from '../stores/useCampBuildingStore.js'
import { CAMP_BUILDINGS, BUILDING_IDS, ORE_NAMES } from '../game/data/campBuildings.js'

const camp      = useCampStore()
const currency  = useCurrencyStore()
const resources = useResourceStore()
const buildings = useCampBuildingStore()

// Eager-load building images
const _buildingBgs = import.meta.glob('../assets/camp/*.png', { eager: true })

function cardBg(id) {
  const filename = CAMP_BUILDINGS[id]?.image
  if (!filename) return {}
  const url = _buildingBgs[`../assets/camp/${filename}`]?.default
  if (!url) return {}
  return { '--card-bg': `url(${url})` }
}

let interval = null
onMounted(() => {
  camp.catchUp(g => currency.addGold(g))
  interval = setInterval(() => camp.tick(g => currency.addGold(g)), 60_000)
})
onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.camp-root {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 92px);
  background: var(--bg-dark);
}

/* Map strip */
.camp-map-strip {
  position: relative;
  height: 200px;
  background-size: cover;
  background-position: center 40%;
  flex-shrink: 0;
}
.map-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(8,4,2,0.3) 0%, rgba(8,4,2,0.85) 100%);
}
.map-header-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 32px 24px;
}
.camp-title {
  font-family: var(--font-head);
  font-size: 1.5rem;
  color: var(--gold);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin: 0 0 6px;
}
.camp-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
  max-width: 480px;
  line-height: 1.6;
  margin: 0;
  font-style: italic;
}
.camp-income-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(8,4,2,0.8);
  border: 1px solid var(--border-gold);
  border-radius: 6px;
  padding: 6px 14px;
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gold);
  white-space: nowrap;
}

/* Buildings panel */
.buildings-panel {
  flex: 1;
  padding: 28px 28px 60px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
.buildings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

/* Building card */
.building-card {
  position: relative;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  overflow: hidden;
  background-color: #0b0806;
  background-image: var(--card-bg);
  background-size: cover;
  background-position: center top;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.building-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(8,4,2,0.5) 0%, rgba(8,4,2,0.88) 50%, rgba(8,4,2,0.96) 100%);
  pointer-events: none;
}
.building-card:not(.maxed):hover {
  border-color: var(--gold-dim);
  box-shadow: 0 0 20px rgba(201,162,39,0.1);
}
.building-card.maxed {
  border-color: #5a3a8a;
  box-shadow: 0 0 18px rgba(140,60,220,0.12);
}

.card-inner {
  position: relative;
  z-index: 1;
  padding: 18px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 260px;
}

/* Tier pip row */
.tier-pip-row {
  display: flex;
  gap: 5px;
}
.tier-pip {
  width: 22px;
  height: 4px;
  border-radius: 2px;
  background: #2a2118;
  border: 1px solid #3a3020;
  transition: background 0.2s;
}
.tier-pip.filled {
  background: var(--gold);
  border-color: var(--gold);
}

.building-name {
  font-family: var(--font-head);
  font-size: 1.0rem;
  font-weight: 700;
  color: var(--text-parchment);
  letter-spacing: 0.5px;
}
.building-lore {
  font-size: 0.70rem;
  color: var(--text-muted);
  line-height: 1.5;
  font-style: italic;
}

/* Active bonus */
.active-bonus {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.72rem;
  background: rgba(201,162,39,0.08);
  border: 1px solid rgba(201,162,39,0.2);
  border-radius: 4px;
  padding: 5px 8px;
}
.bonus-label {
  color: var(--gold-dim);
  font-weight: 700;
  flex-shrink: 0;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-top: 1px;
}
.bonus-text { color: var(--text-parchment); line-height: 1.4; }

/* Upgrade cost */
.upgrade-cost {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 0.68rem;
}
.cost-label {
  color: var(--text-muted);
  font-size: 0.60rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1px;
}
.cost-item {
  color: #bbb;
  display: flex;
  align-items: center;
  gap: 5px;
}
.cost-item.gold-cost { color: var(--gold); }
.cost-item.insufficient { color: #e05050; }
.ore-owned { color: #666; font-size: 0.62rem; }

/* Next bonus preview */
.next-bonus {
  font-size: 0.68rem;
  color: #8899aa;
  line-height: 1.4;
  border-top: 1px solid #1e1812;
  padding-top: 8px;
  margin-top: auto;
}
.next-label {
  color: #557799;
  font-weight: 700;
  font-size: 0.60rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-right: 4px;
}

/* Upgrade button */
.upgrade-btn {
  padding: 10px 0;
  background: transparent;
  border: 1px solid #3a3020;
  border-radius: 6px;
  color: #555;
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: not-allowed;
  transition: all 0.15s;
  width: 100%;
}
.upgrade-btn.affordable {
  border-color: var(--gold-dim);
  color: var(--gold);
  cursor: pointer;
}
.upgrade-btn.affordable:hover {
  background: rgba(201,162,39,0.1);
  border-color: var(--gold);
  box-shadow: 0 0 14px rgba(201,162,39,0.15);
}

/* Maxed state */
.maxed-label {
  font-size: 0.68rem;
  color: #9966cc;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: auto;
}

@media (max-width: 700px) {
  .buildings-grid { grid-template-columns: 1fr; }
  .buildings-panel { padding: 20px 14px 60px; }
  .map-header-content { padding: 0 16px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
