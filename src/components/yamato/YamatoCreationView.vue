<template>
  <div class="yamato-creation">
    <div class="creation-bg" />

    <div class="creation-inner">
      <div class="creation-header">
        <p class="creation-jp">大和の国</p>
        <h1 class="creation-title">Yamato no Kuni</h1>
        <p class="creation-sub">Choose your clan. Put your region on the map.</p>
      </div>

      <!-- Step 1: pick region -->
      <div class="step" v-if="step === 'region'">
        <h2 class="step-heading">Select your clan region</h2>
        <div class="regions-grid">
          <button
            class="region-card"
            v-for="r in YAMATO_REGIONS"
            :key="r.id"
            :class="{ selected: selectedRegion === r.id }"
            :style="{ '--region-color': r.color }"
            @click="selectedRegion = r.id"
          >
            <span class="region-kanji">{{ r.kanji }}</span>
            <span class="region-name">{{ r.name }}</span>
            <span class="region-sub">{{ r.sub }}</span>
            <span class="region-affinity">{{ r.affinity }}</span>
          </button>
        </div>
        <button class="cta-btn" :disabled="!selectedRegion" @click="step = 'name'">
          Continue
        </button>
      </div>

      <!-- Step 2: name -->
      <div class="step" v-else-if="step === 'name'">
        <div class="selected-region-banner" :style="{ '--region-color': selectedRegionData?.color }">
          <span class="srb-kanji">{{ selectedRegionData?.kanji }}</span>
          <div>
            <p class="srb-name">{{ selectedRegionData?.name }}</p>
            <p class="srb-sub">{{ selectedRegionData?.sub }}</p>
          </div>
        </div>
        <h2 class="step-heading">How are you known?</h2>
        <input
          class="name-input"
          v-model="playerName"
          placeholder="Your name..."
          maxlength="24"
          @keyup.enter="playerName.trim() && confirm()"
        />
        <button class="cta-btn" :disabled="!playerName.trim()" @click="confirm">
          Begin
        </button>
        <button class="back-btn" @click="step = 'region'">← Back</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useYamatoPlayerStore, YAMATO_REGIONS } from '../../stores/useYamatoPlayerStore.js'

const emit = defineEmits(['done'])

const yamatoStore     = useYamatoPlayerStore()
const step            = ref('region')
const selectedRegion  = ref(null)
const playerName      = ref('')

const selectedRegionData = computed(() => YAMATO_REGIONS.find(r => r.id === selectedRegion.value))

function confirm() {
  if (!playerName.value.trim() || !selectedRegion.value) return
  yamatoStore.create(playerName.value, selectedRegion.value)
  emit('done')
}
</script>

<style scoped>
.yamato-creation {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

.creation-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 0%, #0e1008 0%, #060806 60%),
    #060806;
  z-index: 0;
}

.creation-inner {
  position: relative;
  z-index: 1;
  max-width: 780px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.creation-header { text-align: center; }
.creation-jp {
  font-family: 'Georgia', serif;
  font-size: 1.2rem;
  color: #cc4433;
  letter-spacing: 4px;
  margin-bottom: 8px;
}
.creation-title {
  font-family: 'Georgia', serif;
  font-size: 2.4rem;
  font-style: italic;
  color: #e8ddd0;
  font-weight: 700;
  margin-bottom: 10px;
}
.creation-sub {
  font-size: 0.78rem;
  color: #5a6a5a;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.step { display: flex; flex-direction: column; gap: 24px; align-items: center; }
.step-heading {
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  color: #b0a898;
  font-style: italic;
  text-align: center;
}

/* ── Region grid ── */
.regions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 100%;
}

.region-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 12px;
  background: #0c0e0a;
  border: 1px solid #1e2a1e;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s, transform 0.15s;
  text-align: center;
}
.region-card:hover {
  border-color: var(--region-color);
  background: #0e100c;
  transform: translateY(-2px);
}
.region-card.selected {
  border-color: var(--region-color);
  background: #0e100c;
  box-shadow: 0 0 16px color-mix(in srgb, var(--region-color) 20%, transparent);
}

.region-kanji {
  font-family: 'Georgia', serif;
  font-size: 1.4rem;
  color: var(--region-color);
  line-height: 1;
}
.region-name {
  font-family: 'Georgia', serif;
  font-size: 0.78rem;
  font-style: italic;
  color: #c0b8b0;
  font-weight: 600;
}
.region-sub {
  font-size: 0.6rem;
  color: #4a5a4a;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.region-affinity {
  font-size: 0.58rem;
  color: var(--region-color);
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-top: 2px;
}

/* ── Selected banner ── */
.selected-region-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #0c0e0a;
  border: 1px solid var(--region-color);
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 20px color-mix(in srgb, var(--region-color) 15%, transparent);
}
.srb-kanji {
  font-family: 'Georgia', serif;
  font-size: 2.2rem;
  color: var(--region-color);
  line-height: 1;
}
.srb-name {
  font-family: 'Georgia', serif;
  font-size: 1rem;
  font-style: italic;
  color: #e0d8d0;
  font-weight: 600;
}
.srb-sub { font-size: 0.65rem; color: #4a5a4a; text-transform: uppercase; letter-spacing: 1px; }

/* ── Name input ── */
.name-input {
  width: 100%;
  max-width: 360px;
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

/* ── Buttons ── */
.cta-btn {
  background: #cc4433;
  border: none;
  border-radius: 6px;
  color: #f0e8e0;
  font-family: 'Georgia', serif;
  font-size: 0.9rem;
  font-style: italic;
  font-weight: 700;
  padding: 12px 40px;
  cursor: pointer;
  letter-spacing: 2px;
  transition: background 0.2s, transform 0.15s;
}
.cta-btn:hover:not(:disabled) { background: #ee5544; transform: translateY(-1px); }
.cta-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.back-btn {
  background: none;
  border: none;
  color: #4a5a4a;
  font-size: 0.7rem;
  cursor: pointer;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: color 0.2s;
  padding: 4px 8px;
}
.back-btn:hover { color: #8a9a8a; }

@media (max-width: 540px) {
  .regions-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
