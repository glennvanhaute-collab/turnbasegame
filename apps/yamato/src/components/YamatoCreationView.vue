<template>
  <div class="yamato-creation">
    <button class="world-back-btn" @click="worldStore.exitWorld()">⟵ Choose realm</button>

    <!-- ── Step 1: Region selection ── -->
    <div class="region-screen" v-if="step === 'region'">
      <div class="region-map-wrap">
        <img :src="regionMapImg" class="region-map-img" alt="Yamato no Kuni regions" draggable="false" />

        <!-- 9 hotspot overlays, one per panel -->
        <div class="hotspots" :class="{ 'has-selection': selectedRegion }">
          <button
            v-for="(r, i) in YAMATO_REGIONS"
            :key="r.id"
            class="hotspot"
            :class="{ selected: selectedRegion === r.id }"
            :style="{ '--rc': r.color, '--i': i }"
            @click="selectedRegion = r.id"
            :title="r.name"
          />
        </div>
      </div>

      <!-- Bottom bar: shows selected info + CTA -->
      <div class="region-footer">
        <Transition name="fade">
          <div class="selected-info" v-if="selectedRegion && selectedRegionData" :style="{ '--rc': selectedRegionData.color }">
            <span class="si-kanji">{{ selectedRegionData.kanji }}</span>
            <div class="si-text">
              <p class="si-name">{{ selectedRegionData.name }}</p>
              <p class="si-sub">{{ selectedRegionData.sub }} · {{ selectedRegionData.affinity }}</p>
            </div>
            <button class="cta-btn" @click="step = 'name'">Choose this clan</button>
          </div>
          <p class="footer-hint" v-else>Hover a province to explore · Click to choose your clan</p>
        </Transition>
      </div>
    </div>

    <!-- ── Step 2: Name entry ── -->
    <div class="name-screen" v-else-if="step === 'name'">
      <div class="name-inner">
        <div class="selected-banner" :style="{ '--rc': selectedRegionData?.color }">
          <span class="sb-kanji">{{ selectedRegionData?.kanji }}</span>
          <div>
            <p class="sb-name">{{ selectedRegionData?.name }}</p>
            <p class="sb-sub">{{ selectedRegionData?.sub }}</p>
          </div>
        </div>
        <h2 class="name-heading">How are you known?</h2>
        <input
          class="name-input"
          v-model="playerName"
          placeholder="Your name..."
          maxlength="24"
          autofocus
          @keyup.enter="playerName.trim() && confirm()"
        />
        <div class="name-actions">
          <button class="back-btn" @click="step = 'region'">← Back</button>
          <button class="cta-btn" :disabled="!playerName.trim()" @click="confirm">Begin</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useYamatoPlayerStore, YAMATO_REGIONS } from '../../stores/useYamatoPlayerStore.js'
import { useWorldStore } from '../../stores/useWorldStore.js'
const regionMapImg = import.meta.env.BASE_URL + 'yamato/startscreen_chose_region.png'

const emit = defineEmits(['done'])
const worldStore  = useWorldStore()
const yamatoStore = useYamatoPlayerStore()

const step           = ref('region')
const selectedRegion = ref(null)
const playerName     = ref('')

const selectedRegionData = computed(() => YAMATO_REGIONS.find(r => r.id === selectedRegion.value))

function confirm() {
  if (!playerName.value.trim() || !selectedRegion.value) return
  yamatoStore.create(playerName.value, selectedRegion.value)
  emit('done')
}
</script>

<style scoped>
.yamato-creation {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: #060806;
  display: flex;
  flex-direction: column;
  position: relative;
}

.world-back-btn {
  position: fixed;
  top: 16px;
  left: 20px;
  z-index: 20;
  background: rgba(6,8,6,0.7);
  border: 1px solid #2a3a2a;
  border-radius: 4px;
  color: #4a5a4a;
  font-size: 0.68rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 6px 14px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  backdrop-filter: blur(4px);
}
.world-back-btn:hover { color: #cc4433; border-color: #cc443355; }

/* ── Region screen ── */
.region-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.region-map-wrap {
  position: relative;
  flex: 1;
  overflow: hidden;
  cursor: crosshair;
}

.region-map-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  user-select: none;
}

/* ── Hotspot grid ── */
.hotspots {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
}

/* Dim all siblings when any is hovered */
.hotspots:has(.hotspot:hover) .hotspot:not(:hover) {
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 30%, transparent 55%);
}

/* Dim non-selected when selection exists */
.hotspots.has-selection .hotspot:not(.selected) {
  background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.55) 30%, transparent 55%);
}

.hotspot {
  background: transparent;
  border: none;
  border-right: 1px solid rgba(255,255,255,0.04);
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}
.hotspot:last-child { border-right: none; }

/* Hover: warm highlight rising from bottom, transparent above midpoint */
.hotspot:hover {
  background: linear-gradient(to top, rgba(255,240,200,0.13) 0%, rgba(255,240,200,0.07) 40%, transparent 65%);
}

/* Selected: colored top border + glow tint */
.hotspot.selected {
  background: color-mix(in srgb, var(--rc) 12%, transparent);
  box-shadow: inset 0 0 30px color-mix(in srgb, var(--rc) 15%, transparent);
}
.hotspot.selected::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 3px;
  background: var(--rc);
  box-shadow: 0 0 12px var(--rc);
}

/* ── Footer bar ── */
.region-footer {
  background: rgba(6,8,6,0.92);
  border-top: 1px solid #1e2a1e;
  min-height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  backdrop-filter: blur(6px);
}

.footer-hint {
  font-family: 'Georgia', serif;
  font-size: 0.72rem;
  font-style: italic;
  color: #2a3a2a;
  letter-spacing: 1px;
}

.selected-info {
  display: flex;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 700px;
}

.si-kanji {
  font-family: 'Georgia', serif;
  font-size: 2rem;
  color: var(--rc);
  line-height: 1;
  flex-shrink: 0;
}
.si-text { flex: 1; }
.si-name {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  font-style: italic;
  color: #e0d8d0;
  font-weight: 700;
}
.si-sub {
  font-size: 0.62rem;
  color: var(--rc);
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-top: 2px;
}

/* ── Name screen ── */
.name-screen {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background:
    radial-gradient(ellipse at 50% 0%, #0e1008 0%, #060806 60%),
    #060806;
}

.name-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  max-width: 420px;
  width: 100%;
  padding: 24px;
}

.selected-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #0c0e0a;
  border: 1px solid var(--rc);
  border-radius: 8px;
  width: 100%;
  box-shadow: 0 0 24px color-mix(in srgb, var(--rc) 12%, transparent);
}
.sb-kanji { font-family: 'Georgia', serif; font-size: 2.4rem; color: var(--rc); line-height: 1; }
.sb-name  { font-family: 'Georgia', serif; font-size: 1.05rem; font-style: italic; color: #e0d8d0; font-weight: 700; }
.sb-sub   { font-size: 0.62rem; color: #4a5a4a; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }

.name-heading {
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  font-style: italic;
  color: #7a8a7a;
}

.name-input {
  width: 100%;
  background: #0a0c08;
  border: 1px solid #2a3a2a;
  border-radius: 6px;
  color: #e0d8d0;
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  font-style: italic;
  padding: 12px 18px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s;
}
.name-input:focus { border-color: #cc4433; }
.name-input::placeholder { color: #2a3a2a; }

.name-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* ── Shared buttons ── */
.cta-btn {
  background: #cc4433;
  border: none;
  border-radius: 6px;
  color: #f0e8e0;
  font-family: 'Georgia', serif;
  font-size: 0.85rem;
  font-style: italic;
  font-weight: 700;
  padding: 11px 28px;
  cursor: pointer;
  letter-spacing: 1px;
  white-space: nowrap;
  transition: background 0.2s, transform 0.15s;
  flex-shrink: 0;
}
.cta-btn:hover:not(:disabled) { background: #ee5544; transform: translateY(-1px); }
.cta-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.back-btn {
  background: none;
  border: none;
  color: #3a4a3a;
  font-family: 'Georgia', serif;
  font-size: 0.75rem;
  font-style: italic;
  cursor: pointer;
  letter-spacing: 1px;
  transition: color 0.2s;
  padding: 4px 8px;
}
.back-btn:hover { color: #8a9a8a; }

/* ── Transition ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
