<template>
  <div class="creation-wrap">

    <div class="creation-card">

      <!-- Logo + title -->
      <div class="creation-top">
        <img :src="logoNav" class="creation-logo" alt="" />
        <h1 class="creation-title">Bannerlords of Westrun</h1>
        <p class="creation-legend">Your Legend Begins</p>
      </div>

      <!-- Step progress -->
      <div class="step-track">
        <template v-for="s in 3" :key="s">
          <div class="step-pip" :class="{ active: step === s, done: step > s }">
            {{ step > s ? '✓' : s }}
          </div>
          <div v-if="s < 3" class="step-line" :class="{ done: step > s }" />
        </template>
      </div>

      <!-- Step content -->
      <transition name="step-slide" mode="out-in">

        <!-- Step 1 — Name -->
        <div v-if="step === 1" key="s1" class="step-block">
          <div class="step-header">
            <div class="step-eyebrow">Step 1 of 3</div>
            <div class="step-heading">Who are you?</div>
            <p class="step-desc">You are a hedgeknight — a warrior without a banner, without a keep. Recruit a team, forge your name, and make yourself known across the realm.</p>
          </div>
          <input
            v-model="heroName"
            class="name-input"
            type="text"
            placeholder="Enter your name…"
            maxlength="24"
            @keydown.enter="goNext"
            autofocus
          />
          <button class="primary-btn" :disabled="heroName.trim().length < 2" @click="goNext">
            Continue →
          </button>
        </div>

        <!-- Step 2 — Avatar -->
        <div v-else-if="step === 2" key="s2" class="step-block">
          <div class="step-header">
            <div class="step-eyebrow">Step 2 of 3</div>
            <div class="step-heading">Your portrait</div>
            <p class="step-desc">Choose the face your allies and enemies will know.</p>
          </div>
          <div class="avatar-accordion">
            <button
              v-for="av in AVATAR_OPTIONS"
              :key="av.id"
              class="accord-item"
              :class="{ active: selectedAvatar === av.id }"
              @click="selectedAvatar = av.id"
            >
              <img :src="av.src" class="accord-img" alt="" />
              <div v-if="selectedAvatar === av.id" class="accord-badge">✓</div>
            </button>
          </div>
          <div class="nav-row">
            <button class="ghost-btn" @click="step--">← Back</button>
            <button class="primary-btn" :disabled="!selectedAvatar" @click="goNext">Continue →</button>
          </div>
        </div>

        <!-- Step 3 — House + Artisan -->
        <div v-else key="s3" class="step-block">
          <div class="step-header">
            <div class="step-eyebrow">Step 3 of 3</div>
            <div class="step-heading">Your path</div>
            <p class="step-desc">Choose your allegiance and the craft that will define your legacy.</p>
          </div>

          <div class="section-label">House</div>
          <div class="house-grid">
            <button
              v-for="faction in playerHero.PLAYER_FACTIONS"
              :key="faction"
              class="house-card"
              :class="{ selected: selectedFaction === faction }"
              :style="selectedFaction === faction ? { borderColor: meta(faction).color, boxShadow: `0 0 14px ${meta(faction).color}33` } : {}"
              @click="selectedFaction = faction"
            >
              <img :src="HOUSE_IMAGES[faction]" class="house-img" alt="" />
              <div class="house-info">
                <div class="house-name">{{ faction }}</div>
                <div class="house-tagline" :style="{ color: meta(faction).color }">{{ meta(faction).tagline }}</div>
                <div class="house-affinity" :style="{ color: meta(faction).color }">{{ meta(faction).affinityLabel }} affinity</div>
              </div>
              <div v-if="selectedFaction === faction" class="house-check" :style="{ color: meta(faction).color }">✓</div>
            </button>
          </div>

          <div class="section-label">Starting Craft</div>
          <div class="artisan-row">
            <button
              v-for="art in ARTISAN_OPTIONS"
              :key="art.id"
              class="artisan-card"
              :class="{ selected: selectedArtisan === art.id }"
              :style="selectedArtisan === art.id ? { borderColor: art.color, boxShadow: `0 0 14px ${art.color}33` } : {}"
              @click="selectedArtisan = art.id"
            >
              <div class="artisan-accent" :style="{ background: art.color }" />
              <div class="artisan-name">{{ art.name }}</div>
              <div class="artisan-unlock" :style="{ color: art.color }">{{ art.unlock }}</div>
              <div class="artisan-desc">{{ art.desc }}</div>
              <div v-if="selectedArtisan === art.id" class="artisan-check" :style="{ color: art.color }">✓</div>
            </button>
          </div>

          <div class="nav-row">
            <button class="ghost-btn" @click="step--">← Back</button>
            <button class="primary-btn flex-grow" :disabled="!canBegin" @click="tryBegin">Enter the Realm →</button>
          </div>
        </div>

      </transition>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import logoNav          from '../assets/ui/logo-nav.png'
import startupBg        from '../assets/backgrounds/startup_background.png'
import houseAldricImg   from '../assets/lore/house_aldric.png'
import houseValdrisImg  from '../assets/lore/house_valdris.png'
import houseCaelwynImg  from '../assets/lore/house_caelwyn.png'
import houseMordaineImg from '../assets/lore/house_mordaine.png'

const _avatarModules = import.meta.glob('../assets/units/avatar_*.png', { eager: true })

const HOUSE_IMAGES = {
  'House Aldric':   houseAldricImg,
  'House Valdris':  houseValdrisImg,
  'House Caelwyn':  houseCaelwynImg,
  'House Mordaine': houseMordaineImg,
}

const ARTISAN_OPTIONS = [
  {
    id:     'blacksmithing',
    name:   'Blacksmithing',
    unlock: 'Unlocks: Forge',
    desc:   'Assign yourself to the forge from day one. Craft plate armor and metal weapons from ore.',
    color:  '#ff9944',
  },
  {
    id:     'leatherworking',
    name:   'Leatherworking',
    unlock: 'Unlocks: Tannery',
    desc:   'Head into the wild from day one. Hunt beasts and process hides into leather gear.',
    color:  '#6bba4a',
  },
  {
    id:     'tailoring',
    name:   'Tailoring',
    unlock: 'Unlocks: Loom',
    desc:   'Begin weaving from day one. Craft cloth garments and enchanted robes for mages.',
    color:  '#b44fff',
  },
]

const emit = defineEmits(['done'])

const playerHero = usePlayerHeroStore()
const collection = useCollectionStore()

const step            = ref(1)
const heroName        = ref('')
const selectedAvatar  = ref(null)
const selectedFaction = ref(null)
const selectedArtisan = ref(null)

const AVATAR_OPTIONS = Object.entries(_avatarModules)
  .map(([path, mod]) => ({ id: path.match(/avatar_\d+/)?.[0], src: mod.default }))
  .filter(a => a.id)
  .sort((a, b) => a.id.localeCompare(b.id))

const meta     = (faction) => playerHero.HOUSE_META[faction] ?? {}
const canBegin = computed(() =>
  heroName.value.trim().length >= 2 &&
  selectedAvatar.value !== null &&
  selectedFaction.value !== null &&
  selectedArtisan.value !== null
)

function goNext() {
  if (step.value === 1 && heroName.value.trim().length >= 2) { step.value = 2; return }
  if (step.value === 2 && selectedAvatar.value)               { step.value = 3; return }
}

function tryBegin() {
  if (!canBegin.value) return
  playerHero.create(heroName.value, selectedFaction.value, selectedAvatar.value, selectedArtisan.value)
  collection.addPlayerCharacter()
  emit('done')
}
</script>

<style scoped>
.creation-wrap {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 20px 60px;
  background: v-bind("'url(' + startupBg + ')'") center / cover no-repeat fixed;
}
.creation-wrap::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(4, 2, 1, 0.74);
  pointer-events: none;
  z-index: 0;
}
.creation-card {
  position: relative;
  z-index: 1;
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Header ── */
.creation-top { text-align: center; }
.creation-logo {
  height: 72px; width: auto;
  display: block; margin: 0 auto 10px;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.9));
}
.creation-title {
  font-family: var(--font-head);
  font-size: 1.5rem; font-weight: 700;
  color: var(--gold); letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 2px 18px rgba(0,0,0,0.9), 0 0 32px rgba(201,162,39,0.5);
  margin-bottom: 4px;
}
.creation-legend {
  font-family: var(--font-head);
  font-size: 0.75rem; letter-spacing: 4px;
  text-transform: uppercase; color: var(--text-parchment);
  text-shadow: 0 1px 8px rgba(0,0,0,0.9); opacity: 0.8;
}

/* ── Step progress ── */
.step-track {
  display: flex;
  align-items: center;
  justify-content: center;
}
.step-pip {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 2px solid #3a1c0a;
  background: #0d0806;
  color: #3a1c0a;
  font-family: var(--font-head);
  font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  transition: border-color 0.3s, background 0.3s, color 0.3s;
  flex-shrink: 0;
}
.step-pip.active { border-color: var(--gold); color: var(--gold); background: rgba(201,162,39,0.1); }
.step-pip.done   { border-color: #5c3a14; color: #5c3a14; background: #1a0c06; }
.step-line {
  width: 60px; height: 2px;
  background: #2a1208;
  transition: background 0.3s;
  flex-shrink: 0;
}
.step-line.done { background: #5c3a14; }

/* ── Step blocks ── */
.step-block {
  background: rgba(10, 5, 2, 0.90);
  border: 1px solid #2a1208;
  border-radius: 12px;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.step-eyebrow {
  font-size: 0.58rem;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--text-muted);
  font-family: var(--font-head);
  margin-bottom: 2px;
}
.step-heading {
  font-family: var(--font-head);
  font-size: 1.15rem; font-weight: 800;
  color: var(--gold); letter-spacing: 1px;
}
.step-desc {
  font-size: 0.78rem;
  color: #b09070; line-height: 1.55;
}

/* ── Name input ── */
.name-input {
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  color: var(--text-parchment);
  font-size: 1rem; font-family: var(--font-head); letter-spacing: 1px;
  padding: 10px 16px; outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #120805; width: 100%; box-sizing: border-box;
}
.name-input:focus { border-color: var(--gold); box-shadow: 0 0 12px rgba(201,162,39,0.2); }
.name-input::placeholder { color: #3a2a18; }

/* ── Avatar accordion ── */
.avatar-accordion {
  display: flex;
  gap: 8px;
  height: 360px;
  align-items: stretch;
}
.accord-item {
  flex: 1;
  transition: flex 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s, box-shadow 0.2s;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #2a1208;
  cursor: pointer;
  position: relative;
  padding: 0;
  background: none;
  min-width: 0;
}
.accord-item:hover { border-color: #5c3a14; }
.accord-item.active {
  flex: 4;
  border-color: var(--gold);
  box-shadow: 0 0 22px rgba(201, 162, 39, 0.35);
}
.accord-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center top;
  display: block;
}
.accord-badge {
  position: absolute;
  bottom: 8px; right: 8px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--gold); color: #0a0500;
  font-size: 0.65rem; font-weight: 900;
  display: flex; align-items: center; justify-content: center;
}

/* ── Nav row ── */
.nav-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* ── Buttons ── */
.primary-btn {
  padding: 10px 28px;
  background: var(--gold); color: #0a0500;
  font-family: var(--font-head);
  font-size: 0.82rem; font-weight: 900;
  letter-spacing: 1.5px; text-transform: uppercase;
  border: none; border-radius: 8px; cursor: pointer;
  transition: opacity 0.15s, box-shadow 0.15s;
  flex-shrink: 0;
}
.primary-btn.flex-grow { flex: 1; }
.primary-btn:hover:not(:disabled) { opacity: 0.9; box-shadow: 0 0 16px rgba(201,162,39,0.3); }
.primary-btn:disabled { opacity: 0.25; cursor: not-allowed; }

.ghost-btn {
  padding: 10px 20px;
  background: none; color: #5c3a14;
  font-family: var(--font-head);
  font-size: 0.78rem; font-weight: 700; letter-spacing: 1px;
  border: 1px solid #2a1208; border-radius: 8px; cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.ghost-btn:hover { color: #8c5a24; border-color: #5c3a14; }

/* ── Section labels ── */
.section-label {
  font-size: 0.6rem;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--text-muted);
  font-family: var(--font-head); font-weight: 700;
  margin-bottom: -6px;
}

/* ── House grid ── */
.house-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}
.house-card {
  background: #0e0804;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 10px 12px;
  cursor: pointer;
  display: flex; gap: 10px; align-items: flex-start;
  text-align: left; position: relative;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}
.house-card:hover { background: #140a05; border-color: #5c3a14; }
.house-card.selected { background: #120906; }
.house-img {
  width: 44px; height: auto;
  display: block; object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
  flex-shrink: 0;
}
.house-info { flex: 1; min-width: 0; }
.house-name     { font-family: var(--font-head); font-size: 0.75rem; font-weight: 700; color: #fff; margin-bottom: 2px; }
.house-tagline  { font-size: 0.62rem; font-weight: 700; margin-bottom: 3px; }
.house-affinity { font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
.house-check    { position: absolute; top: 10px; right: 12px; font-size: 0.85rem; font-weight: 900; }

/* ── Artisan row ── */
.artisan-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.artisan-card {
  background: #0e0804;
  border: 1px solid #2a1208;
  border-radius: 10px;
  padding: 14px 14px 12px;
  cursor: pointer;
  display: flex; flex-direction: column; gap: 5px;
  text-align: left; position: relative;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.artisan-card:hover { background: #140a05; }
.artisan-card.selected { background: #120906; }
.artisan-accent {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 10px 10px 0 0;
}
.artisan-name   { font-family: var(--font-head); font-size: 0.78rem; font-weight: 800; color: #fff; margin-top: 4px; }
.artisan-unlock { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.artisan-desc   { font-size: 0.62rem; color: var(--text-muted); line-height: 1.45; }
.artisan-check  { position: absolute; top: 10px; right: 10px; font-size: 0.8rem; font-weight: 900; }

/* ── Step transition ── */
.step-slide-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.step-slide-leave-active { transition: opacity 0.15s ease; }
.step-slide-enter-from   { opacity: 0; transform: translateY(8px); }
.step-slide-leave-to     { opacity: 0; }

/* ── Responsive ── */
@media (max-width: 520px) {
  .house-grid   { grid-template-columns: 1fr; }
  .artisan-row  { grid-template-columns: 1fr; }
  .step-block   { padding: 20px 18px; }
  .avatar-accordion { height: 240px; }
}
</style>
