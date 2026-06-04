<template>
  <div class="creation-wrap">

    <div class="creation-card">
      <div class="creation-top">
        <img :src="logoNav" class="creation-logo" alt="" />
        <h1 class="creation-title">Welcome to Bannerlords of Westrun</h1>
        <p class="creation-legend">Your Legend Begins</p>
        <p class="creation-subtitle">You are a hedgeknight — a warrior without a banner, without a keep. Recruit a team, forge your name, and make yourself known across the realm.</p>
      </div>

      <!-- Name input -->
      <div class="field-group">
        <label class="field-label">Your name</label>
        <input
          v-model="heroName"
          class="name-input"
          type="text"
          placeholder="Enter your name…"
          maxlength="24"
          @keydown.enter="tryBegin"
          autofocus
        />
      </div>

      <!-- Avatar selection -->
      <div class="field-group">
        <label class="field-label">Choose your portrait</label>
        <div class="avatar-grid">
          <button
            v-for="av in AVATAR_OPTIONS"
            :key="av.id"
            class="avatar-option"
            :class="{ selected: selectedAvatar === av.id }"
            @click="selectedAvatar = av.id"
          >
            <img :src="av.src" class="avatar-option-img" alt="" />
            <div v-if="selectedAvatar === av.id" class="avatar-check">✓</div>
          </button>
        </div>
      </div>

      <!-- House selection -->
      <div class="field-group">
        <label class="field-label">Choose your house</label>
        <div class="house-grid">
          <button
            v-for="faction in playerHero.PLAYER_FACTIONS"
            :key="faction"
            class="house-card"
            :class="{ selected: selectedFaction === faction }"
            :style="selectedFaction === faction ? { borderColor: meta(faction).color, boxShadow: `0 0 18px ${meta(faction).color}33` } : {}"
            @click="selectedFaction = faction"
          >
            <div class="house-banner-wrap">
              <img :src="HOUSE_IMAGES[faction]" class="house-banner-img" alt="" />
            </div>

            <div class="house-info">
              <div class="house-name">{{ faction }}</div>
              <div class="house-tagline" :style="{ color: meta(faction).color }">{{ meta(faction).tagline }}</div>
              <div class="house-flavor">{{ meta(faction).flavor }}</div>
              <div class="house-affinity" :style="{ color: meta(faction).color }">{{ meta(faction).affinityLabel }} affinity</div>
            </div>

            <div class="house-check" v-if="selectedFaction === faction" :style="{ color: meta(faction).color }">✓</div>
          </button>
        </div>
      </div>

      <!-- Starting skills preview -->
      <div class="skills-preview" v-if="selectedFaction">
        <div class="skills-label">Starting skills <span class="skills-note">(weak — grow stronger through adventure)</span></div>
        <div class="skills-row">
          <div class="skill-chip" v-for="s in STARTER_SKILLS" :key="s.name">
            <span class="skill-chip-name">{{ s.name }}</span>
            <span class="skill-chip-desc">{{ s.desc }}</span>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <button
        class="begin-btn"
        :disabled="!canBegin"
        @click="tryBegin"
      >
        Enter the Realm →
      </button>
      <div class="begin-hint" v-if="heroName.length > 0 && !selectedFaction">Choose a house to continue</div>
      <div class="begin-hint" v-else-if="!heroName.length">Enter your name to continue</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import logoNav          from '../assets/logo-nav.png'
import startupBg        from '../assets/startup_background.png'
import houseAldricImg   from '../assets/house_aldric.png'
import houseValdrisImg  from '../assets/house_valdris.png'
import houseCaelwynImg  from '../assets/house_caelwyn.png'
import houseMordaineImg from '../assets/house_mordaine.png'
const _avatarModules = import.meta.glob('../assets/avatar_*.png', { eager: true })

const HOUSE_IMAGES = {
  'House Aldric':   houseAldricImg,
  'House Valdris':  houseValdrisImg,
  'House Caelwyn':  houseCaelwynImg,
  'House Mordaine': houseMordaineImg,
}

const emit = defineEmits(['done'])

const playerHero = usePlayerHeroStore()
const collection = useCollectionStore()

const heroName        = ref('')
const selectedFaction = ref(null)
const selectedAvatar  = ref(null)

const AVATAR_OPTIONS = Object.entries(_avatarModules)
  .map(([path, mod]) => {
    const id = path.match(/avatar_\d+/)?.[0]
    return { id, src: mod.default }
  })
  .filter(a => a.id)
  .sort((a, b) => a.id.localeCompare(b.id))

const meta = (faction) => playerHero.HOUSE_META[faction] ?? {}

const STARTER_SKILLS = [
  { name: 'Crude Swing',  desc: '100% ATK — no cooldown' },
  { name: 'Fortify',      desc: '+15% DEF for 2 turns — CD 4' },
  { name: 'Patch Up',     desc: 'Heal 7% HP — CD 4' },
]

const canBegin = computed(() =>
  heroName.value.trim().length >= 2 && selectedFaction.value !== null && selectedAvatar.value !== null
)

function tryBegin() {
  if (!canBegin.value) return
  playerHero.create(heroName.value, selectedFaction.value, selectedAvatar.value)
  collection.addPlayerCharacter()
  emit('done')
}
</script>

<style scoped>
.creation-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  background: v-bind("'url(' + startupBg + ')'") center / cover no-repeat fixed;
}
.creation-wrap::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(4, 2, 1, 0.72);
  pointer-events: none;
  z-index: 0;
}
.creation-card {
  position: relative;
  z-index: 1;
  width: min(760px, 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.creation-top { text-align: center; }
.creation-logo {
  height: 72px;
  width: auto;
  display: block;
  margin: 0 auto 10px;
  filter: drop-shadow(0 4px 16px rgba(0,0,0,0.9));
}
.creation-title {
  font-family: var(--font-head);
  font-size: 1.5rem;
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 2px 18px rgba(0,0,0,0.9), 0 0 32px rgba(201,162,39,0.5);
  margin-bottom: 4px;
}
.creation-legend {
  font-family: var(--font-head);
  font-size: 0.75rem;
  color: var(--text-parchment);
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 1px 8px rgba(0,0,0,0.9);
  margin-bottom: 6px;
  opacity: 0.8;
}
.creation-subtitle {
  font-size: 0.82rem;
  color: #b09070;
  line-height: 1.55;
  text-shadow: 0 1px 6px rgba(0,0,0,0.95);
  max-width: 480px;
  margin: 0 auto;
}

/* Field groups */
.field-group { display: flex; flex-direction: column; gap: 10px; }
.field-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); font-weight: 600; }

.name-input {
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  color: var(--text-parchment);
  font-size: 1rem;
  font-family: var(--font-head);
  letter-spacing: 1px;
  padding: 10px 16px;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #120805;
  width: 100%;
}
.name-input:focus { border-color: var(--gold); box-shadow: 0 0 12px rgba(201,162,39,0.2); }
.name-input::placeholder { color: #3a2a18; }

/* Avatar picker */
.avatar-grid {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.avatar-option {
  position: relative;
  background: none;
  border: 2px solid var(--border-brown);
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  overflow: visible;
}
.avatar-option:hover { border-color: #5c3a14; }
.avatar-option.selected {
  border-color: var(--gold);
  box-shadow: 0 0 18px rgba(201,162,39,0.45);
}
.avatar-option-img {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center top;
}
.avatar-check {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--gold);
  color: #0a0500;
  font-size: 0.65rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

/* House grid */
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
  display: flex;
  gap: 10px;
  align-items: flex-start;
  text-align: left;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  position: relative;
}
.house-card:hover { background: #140a05; border-color: #5c3a14; }
.house-card.selected { background: #120906; }

/* House banner image */
.house-banner-wrap { flex-shrink: 0; }
.house-banner-img {
  width: 52px;
  height: auto;
  display: block;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.8));
}

.house-info { flex: 1; min-width: 0; }
.house-name    { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: #fff; margin-bottom: 2px; }
.house-tagline { font-size: 0.65rem; font-weight: 700; margin-bottom: 4px; }
.house-flavor  { font-size: 0.62rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 4px; }
.house-affinity { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }

.house-check {
  position: absolute;
  top: 10px; right: 12px;
  font-size: 0.9rem;
  font-weight: 900;
}

/* Starter skills preview */
.skills-preview { background: #0a0503; border: 1px solid #2a1508; border-radius: 8px; padding: 12px 14px; }
.skills-label   { font-size: 0.62rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
.skills-note    { text-transform: none; font-style: italic; letter-spacing: 0; color: #3a2a18; }
.skills-row     { display: flex; gap: 8px; flex-wrap: wrap; }
.skill-chip {
  background: #140a04;
  border: 1px solid #3a1c0a;
  border-radius: 6px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 140px;
}
.skill-chip-name { font-size: 0.72rem; font-weight: 700; color: #ccc; }
.skill-chip-desc { font-size: 0.62rem; color: #555; }

/* CTA */
.begin-btn {
  padding: 12px 32px;
  background: var(--gold);
  color: #0a0500;
  font-family: var(--font-head);
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.15s, box-shadow 0.15s;
  width: 100%;
}
.begin-btn:hover:not(:disabled) { opacity: 0.9; box-shadow: 0 0 20px rgba(201,162,39,0.3); }
.begin-btn:disabled { opacity: 0.25; cursor: not-allowed; }
.begin-hint { text-align: center; font-size: 0.7rem; color: #3a2a18; font-style: italic; margin-top: -16px; }

/* Responsive */
@media (max-width: 520px) {
  .house-grid { grid-template-columns: 1fr; }
}
</style>
