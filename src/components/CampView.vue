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
        >
          <!-- Image section — full bleed art with name/lore overlay -->
          <div class="card-image" :style="cardBg(id)">
            <div class="tier-pip-row">
              <span
                v-for="t in CAMP_BUILDINGS[id].tiers.length"
                :key="t"
                class="tier-pip"
                :class="{ filled: t <= buildings.getLevel(id) }"
              />
            </div>
            <div class="card-name-block">
              <div class="building-name">{{ CAMP_BUILDINGS[id].name }}</div>
              <div class="building-lore">{{ CAMP_BUILDINGS[id].lore }}</div>
            </div>
          </div>

          <!-- Info panel — clean dark section below the image -->
          <div class="card-info">

            <!-- Active bonus (if any tiers built) -->
            <div v-if="buildings.getLevel(id) > 0" class="active-bonus">
              <span class="bonus-label">Active</span>
              <span class="bonus-text">{{ CAMP_BUILDINGS[id].tiers[buildings.getLevel(id) - 1].bonus }}</span>
            </div>
            <div v-else class="inactive-hint">Not yet constructed</div>

            <div class="info-divider" />

            <!-- Maxed -->
            <div v-if="buildings.isMaxed(id)" class="maxed-label">◈ Fully Upgraded</div>

            <!-- Next tier -->
            <template v-else>
              <div class="next-bonus">
                <span class="next-label">Next:</span>
                {{ CAMP_BUILDINGS[id].tiers[buildings.getLevel(id)].bonus }}
              </div>

              <div class="upgrade-cost">
                <span
                  class="cost-row gold-cost"
                  :class="{ insufficient: currency.gold < buildings.getNextCost(id).gold }"
                >
                  🪙 {{ buildings.getNextCost(id).gold.toLocaleString() }}
                  <span class="ore-owned">({{ currency.gold.toLocaleString() }})</span>
                </span>
                <span
                  v-for="(amount, oreId) in buildings.getNextCost(id).ores"
                  :key="oreId"
                  class="cost-row ore-cost"
                  :class="{ insufficient: (resources.ores[oreId] ?? 0) < amount }"
                >
                  {{ ORE_NAMES[oreId] }} ×{{ amount }}
                  <span class="ore-owned">({{ resources.ores[oreId] ?? 0 }})</span>
                </span>
              </div>

              <button
                class="upgrade-btn"
                :class="{ affordable: buildings.canAfford(id) }"
                :disabled="!buildings.canAfford(id)"
                @click="buildings.upgrade(id)"
              >
                {{ buildings.getLevel(id) === 0 ? 'Construct' : 'Upgrade' }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import campBgDefault  from '../assets/backgrounds/training_camp.png'
import campBgAldric   from '../assets/lore/siege_aldric.png'
import campBgValdris  from '../assets/lore/siege_Valdris.png'
import campBgCaelwyn  from '../assets/lore/siege_caelwyn.png'
import campBgMordaine from '../assets/lore/siege_mordaine.png'
import { useCampStore }          from '../stores/useCampStore.js'
import { useCurrencyStore }      from '../stores/useCurrencyStore.js'
import { useResourceStore }      from '../stores/useResourceStore.js'
import { useCampBuildingStore }  from '../stores/useCampBuildingStore.js'
import { useSettingsStore }      from '../stores/useSettingsStore.js'
import { CAMP_BUILDINGS, BUILDING_IDS, ORE_NAMES } from '../game/data/campBuildings.js'

const camp      = useCampStore()
const currency  = useCurrencyStore()
const resources = useResourceStore()
const buildings = useCampBuildingStore()
const settings  = useSettingsStore()

const HOUSE_BGS = {
  aldric:   campBgAldric,
  valdris:  campBgValdris,
  caelwyn:  campBgCaelwyn,
  mordaine: campBgMordaine,
}

const campBg = computed(() => HOUSE_BGS[settings.theme] ?? campBgDefault)

// Eager-load building images
const _buildingBgs = import.meta.glob('../assets/camp/*.png', { eager: true })

function cardBg(id) {
  const house    = settings.theme  // 'aldric' | 'valdris' | 'caelwyn' | 'mordaine'
  const houseKey = `../assets/camp/${house}_${id}.png`
  const generic  = `../assets/camp/${CAMP_BUILDINGS[id]?.image ?? ''}`
  const url = (_buildingBgs[houseKey] ?? _buildingBgs[generic])?.default
  return url ? { backgroundImage: `url(${url})` } : {}
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

/* ── Building card: two sections ─────────────────────────── */
.building-card {
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  overflow: hidden;
  background: #0d0a07;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
}
.building-card:not(.maxed):hover {
  border-color: rgba(201,162,39,0.45);
  box-shadow: 0 0 28px rgba(201,162,39,0.1);
  transform: translateY(-2px);
}
.building-card.maxed {
  border-color: rgba(153,80,220,0.35);
  box-shadow: 0 0 22px rgba(140,60,220,0.12);
}

/* ── Image section ─────────────────────────────────────── */
.card-image {
  position: relative;
  height: 200px;
  background-size: cover;
  background-position: center 25%;
  flex-shrink: 0;
}
.card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(8,4,2,0.0)  0%,
    rgba(8,4,2,0.0)  35%,
    rgba(8,4,2,0.65) 65%,
    rgba(8,4,2,0.95) 100%
  );
}

/* Tier pips — top-left of image */
.tier-pip-row {
  position: absolute;
  top: 12px;
  left: 14px;
  display: flex;
  gap: 5px;
  z-index: 2;
}
.tier-pip {
  width: 26px;
  height: 5px;
  border-radius: 3px;
  background: rgba(0,0,0,0.55);
  border: 1px solid rgba(255,255,255,0.12);
  transition: background 0.2s, box-shadow 0.2s;
}
.tier-pip.filled {
  background: var(--gold);
  border-color: var(--gold);
  box-shadow: 0 0 7px rgba(201,162,39,0.7);
}

/* Name + lore anchored to bottom of image */
.card-name-block {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  padding: 0 14px 12px;
}
.building-name {
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.4px;
  text-shadow: 0 2px 10px rgba(0,0,0,1), 0 0 24px rgba(0,0,0,0.8);
  line-height: 1.2;
  margin-bottom: 3px;
}
.building-lore {
  font-size: 0.66rem;
  color: #bbb;
  line-height: 1.45;
  font-style: italic;
  text-shadow: 0 1px 5px rgba(0,0,0,1);
}

/* ── Info panel ────────────────────────────────────────── */
.card-info {
  flex: 1;
  padding: 14px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 9px;
  background: #0d0a07;
}

.active-bonus {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: rgba(201,162,39,0.08);
  border: 1px solid rgba(201,162,39,0.22);
  border-radius: 6px;
  padding: 7px 10px;
}
.bonus-label {
  color: var(--gold);
  font-weight: 700;
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  flex-shrink: 0;
  padding-top: 2px;
}
.bonus-text {
  color: #e5d9b8;
  font-size: 0.72rem;
  line-height: 1.45;
}
.inactive-hint {
  font-size: 0.66rem;
  color: #444;
  font-style: italic;
  padding: 2px 0;
}

.info-divider {
  height: 1px;
  background: rgba(255,255,255,0.05);
}

.next-bonus {
  font-size: 0.68rem;
  color: #6688aa;
  line-height: 1.45;
}
.next-label {
  color: #446688;
  font-weight: 700;
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-right: 5px;
}

.upgrade-cost {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.cost-row {
  font-size: 0.69rem;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #bbb;
}
.cost-row.gold-cost { color: var(--gold); font-weight: 600; }
.cost-row.insufficient { color: #e05050; }
.ore-owned { color: #555; font-size: 0.60rem; }

.upgrade-btn {
  margin-top: auto;
  padding: 11px 0;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 7px;
  color: #3a3830;
  font-family: var(--font-head);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: not-allowed;
  transition: all 0.15s;
  width: 100%;
}
.upgrade-btn.affordable {
  background: rgba(201,162,39,0.10);
  border-color: rgba(201,162,39,0.5);
  color: var(--gold);
  cursor: pointer;
}
.upgrade-btn.affordable:hover {
  background: rgba(201,162,39,0.20);
  border-color: var(--gold);
  box-shadow: 0 0 18px rgba(201,162,39,0.2);
}
.upgrade-btn.affordable:active { transform: scale(0.98); }

.maxed-label {
  font-size: 0.68rem;
  color: #9955dd;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: auto;
}

@media (max-width: 700px) {
  .buildings-grid { grid-template-columns: 1fr; }
  .buildings-panel { padding: 20px 14px 60px; }
  .map-header-content { padding: 0 16px 20px; flex-direction: column; align-items: flex-start; gap: 12px; }
}
</style>
