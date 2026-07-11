<template>
  <div class="sieges-root">

    <!-- ── Active Event Hero Banner ─────────────────────────────────── -->
    <div class="event-hero" :style="{ backgroundImage: `url(${active.img})` }">
      <div class="event-hero-gradient" />

      <div class="event-top-bar">
        <div class="event-label-group">
          <span class="event-live-pill">⚔ Active Siege</span>
          <span class="event-affinity-chip" :class="active.affinity.toLowerCase()">{{ active.affinity }}</span>
        </div>
        <div class="event-timer-block">
          <span class="timer-label">Event ends in</span>
          <span class="timer-value">{{ timeLeft }}</span>
        </div>
      </div>

      <div class="event-hero-body">
        <div class="event-house-label" :style="{ color: active.color }">{{ active.house }}</div>
        <h2 class="event-title">{{ active.event.title }}</h2>
        <div class="event-dispatch">
          <span class="dispatch-label">Field Report</span>
          <p class="dispatch-text">{{ active.event.dispatch }}</p>
        </div>
      </div>
    </div>

    <!-- ── Stronghold Tiers ──────────────────────────────────────────── -->
    <div class="tiers-section">
      <div class="tiers-label">Strongholds</div>
      <div class="tiers-list">
        <div
          v-for="tier in TIERS"
          :key="tier.id"
          class="tier-card"
          :class="tier.id"
          :style="{ '--tc': tier.color }"
        >
          <div class="tier-left">
            <span class="tier-name">{{ tier.name }}</span>
            <span class="tier-sub">{{ tier.sub }}</span>
          </div>
          <div class="tier-rewards">
            <span class="t-reward">🪙 {{ tier.gold.toLocaleString() }}</span>
            <span class="t-reward">💎 {{ tier.diamonds }}</span>
            <span class="t-reward mat" :style="{ color: active.color }">◆ {{ active.event.matReward }} ×{{ tier.matCount }}</span>
          </div>
          <button
            v-if="campBuildings.hasUnlock(tier.unlock)"
            class="tier-btn"
            @click="openSetup(tier)"
          >Besiege</button>
          <div v-else class="tier-locked">
            <span class="tier-lock-icon">🔒</span>
            <span class="tier-lock-hint">{{ tier.unlockHint }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Final Siege (quest-locked) ──────────────────────────────── -->
    <div class="final-siege-section">
      <div class="tiers-label">The Final Reckoning</div>
      <div v-if="finalSiegeUnlocked" class="final-siege-card" :style="{ '--fc': finalSiegeFaction?.color ?? '#888', backgroundImage: `url(${finalSiegeFaction?.img})` }">
        <div class="fs-gradient" />
        <div class="fs-body">
          <div class="fs-house" :style="{ color: finalSiegeFaction?.color }">{{ finalSiegeFaction?.house }}</div>
          <div class="fs-title">Siege of {{ finalSiegeFaction?.house }}</div>
          <p class="fs-sub">Your choices made this enemy. The account is final.</p>
        </div>
      </div>
      <div v-else class="final-siege-locked">
        <span class="fs-lock-icon">🔒</span>
        <div class="fs-lock-text">
          <p class="fs-lock-title">Locked</p>
          <p class="fs-lock-hint">Complete <em>The Final Breach</em> to unlock the final siege</p>
        </div>
      </div>
    </div>

    <!-- ── Rotation Strip ────────────────────────────────────────────── -->
    <div class="rotation-section">
      <div class="rotation-label">Faction Rotation</div>
      <div class="rotation-strip">
        <div
          v-for="(faction, i) in FACTIONS"
          :key="faction.id"
          class="rotation-card"
          :class="{ active: faction.id === active.id, next: i === nextIdx }"
          :style="{ '--fc': faction.color, backgroundImage: `url(${faction.img})` }"
        >
          <div class="rc-gradient" />
          <div class="rc-body">
            <span class="rc-status" v-if="faction.id === active.id">Active</span>
            <span class="rc-status next-tag" v-else-if="i === nextIdx">Next</span>
            <span class="rc-house">{{ faction.house }}</span>
            <span class="rc-sin">{{ faction.sin }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- Setup screen — full-screen overlay when a tier is clicked -->
  <Teleport to="body">
    <SiegeSetupScreen
      v-if="setupTier"
      :faction="active"
      :tier="setupTier"
      @back="closeSetup"
      @march="openBattle"
    />
    <SiegeBattleArena
      v-if="battleOpen && battleTier"
      :faction="active"
      :tier="battleTier"
      @back="closeBattle"
    />
  </Teleport>

</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import SiegeSetupScreen  from './SiegeSetupScreen.vue'
import SiegeBattleArena  from './SiegeBattleArena.vue'
import { useCampBuildingStore }  from '../stores/useCampBuildingStore.js'
import { useQuestStore }         from '../stores/useQuestStore.js'
import { useReputationStore, ALL_HOUSES } from '../stores/useReputationStore.js'

const campBuildings = useCampBuildingStore()
const questStore    = useQuestStore()
const repStore      = useReputationStore()

const finalSiegeUnlocked = computed(() => questStore.completedIds.has('final_breach'))

const finalSiegeFaction = computed(() => {
  if (!finalSiegeUnlocked.value) return null
  const lowestHouse = ALL_HOUSES.reduce((min, h) =>
    repStore.getRep(h) < repStore.getRep(min) ? h : min
  )
  return FACTIONS.find(f => f.house === lowestHouse) ?? null
})
import siegeAldric   from '../assets/lore/siege_aldric.png'
import siegeValdris  from '../assets/lore/siege_Valdris.png'
import siegeCaelwyn  from '../assets/lore/siege_caelwyn.png'
import siegeMordaine from '../assets/lore/siege_mordaine.png'

// ── Faction definitions ───────────────────────────────────────────
const FACTIONS = [
  {
    id:       'aldric',
    house:    'House Aldric',
    affinity: 'Force',
    color:    '#c8962a',
    img:      siegeAldric,
    sin:      'Territorial expansion',
    event: {
      title:     'The Iron March',
      dispatch:  'House Aldric has marched past the Thornpass boundary stones for the third time this season. A forward camp has been established in contested land. They are not accepting envoys. The other houses cannot move without triggering open war. You can.',
      matReward: 'Iron Sigil',
    },
  },
  {
    id:       'valdris',
    house:    'House Valdris',
    affinity: 'Magic',
    color:    '#4fa8ff',
    img:      siegeValdris,
    sin:      'Void experimentation',
    event: {
      title:     'The Mirror Incident',
      dispatch:  'Three Valdris scholars entered the Citadel of Mirrors six days ago. None have returned. The house has sealed the lower vaults and is refusing all investigation. Something is responding from beneath the Citadel. The other houses are afraid to find out what.',
      matReward: 'Void Shard',
    },
  },
  {
    id:       'caelwyn',
    house:    'House Caelwyn',
    affinity: 'Spirit',
    color:    '#4dff88',
    img:      siegeCaelwyn,
    sin:      'Witch mutiny',
    event: {
      title:     'The Coven Split',
      dispatch:  "House Caelwyn's eastern coven has stopped answering to the house banner. The rites they performed in the Thornwood summoned something that is no longer under their control. The house leadership will not admit this publicly. Settlements near the wood are already empty.",
      matReward: 'Thornwood Rune',
    },
  },
  {
    id:       'mordaine',
    house:    'House Mordaine',
    affinity: 'Void',
    color:    '#b44fff',
    img:      siegeMordaine,
    sin:      'Old grudges & privateers',
    event: {
      title:     'The Greyveil Closure',
      dispatch:  'House Mordaine has invoked a century-old maritime charter to close the Greyveil trade route. Grain shipments to three houses have stopped. They insist it is legal. It is not wrong — they have the documentation. That does not make it acceptable.',
      matReward: 'Privateer Seal',
    },
  },
]

// ── Tier definitions ──────────────────────────────────────────────
const TIERS = [
  {
    id: 'skirmish', name: 'Skirmish', sub: 'Outer garrison — weakened defenders',
    color: '#888', gold: 800, diamonds: 12, matCount: 1,
    unlock: 'siege_easy',
    unlockHint: "Requires Breachwright's Yard Tier 1",
    garrison: ['Militia conscripts ×8', 'Untrained archers ×4'],
  },
  {
    id: 'siege', name: 'Siege', sub: 'Main wall — organised resistance',
    color: '#c8962a', gold: 1800, diamonds: 25, matCount: 2,
    unlock: 'siege_medium',
    unlockHint: "Requires Breachwright's Yard Tier 2",
    garrison: ['Veteran soldiers ×10', 'Tower archers ×6', 'Wall ballista ×2'],
  },
  {
    id: 'assault', name: 'Full Assault', sub: 'Inner sanctum — elite guard',
    color: '#cc4444', gold: 3200, diamonds: 45, matCount: 4,
    unlock: 'siege_hard',
    unlockHint: "Requires Breachwright's Yard Tier 3",
    garrison: ['Elite guard ×8', 'Battlemage ×3', 'Siege artillery ×3', 'Captain of the Guard'],
  },
  {
    id: 'breach', name: 'The Breach', sub: 'The commander — ends the transgression',
    color: '#b44fff', gold: 5000, diamonds: 70, matCount: 7,
    unlock: 'siege_nightmare',
    unlockHint: "Requires Breachwright's Yard Tier 4",
    garrison: ['Full garrison ×20', 'Arcane constructs ×4', 'The Commander (Phase 2)'],
  },
]

// ── Active event — rotates every 7 days based on real time ───────
const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function getActiveIndex() {
  return Math.floor(Date.now() / WEEK_MS) % FACTIONS.length
}

function getWeekEnd() {
  const weekNum = Math.floor(Date.now() / WEEK_MS)
  return (weekNum + 1) * WEEK_MS
}

const activeIdx = computed(() => getActiveIndex())
const nextIdx   = computed(() => (activeIdx.value + 1) % FACTIONS.length)
const active    = computed(() => FACTIONS[activeIdx.value])

// ── Setup screen state ────────────────────────────────────────────
const setupTier  = ref(null)
const battleTier = ref(null)
const battleOpen = ref(false)

function openSetup(tier)  { setupTier.value = tier }
function closeSetup()     { setupTier.value = null }

function openBattle() {
  battleTier.value = setupTier.value
  setupTier.value  = null
  battleOpen.value = true
}
function closeBattle() {
  battleOpen.value = false
  battleTier.value = null
}

// ── Countdown timer ───────────────────────────────────────────────
const timeLeft = ref('')

function updateTimer() {
  const remaining = getWeekEnd() - Date.now()
  if (remaining <= 0) { timeLeft.value = 'Ending...'; return }
  const d = Math.floor(remaining / 86400000)
  const h = Math.floor((remaining % 86400000) / 3600000)
  const m = Math.floor((remaining % 3600000) / 60000)
  if (d > 0) timeLeft.value = `${d}d ${h}h`
  else if (h > 0) timeLeft.value = `${h}h ${m}m`
  else timeLeft.value = `${m}m`
}

let timerInterval = null
onMounted(() => { updateTimer(); timerInterval = setInterval(updateTimer, 60000) })
onUnmounted(() => clearInterval(timerInterval))
</script>

<style scoped>
.sieges-root {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  background: #0a0604;
}

/* ── Hero Banner ──────────────────────────────────────────────── */
.event-hero {
  position: relative;
  min-height: 420px;
  background-size: cover;
  background-position: center 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.event-hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.15) 0%,
    rgba(0,0,0,0.1)  35%,
    rgba(0,0,0,0.6)  70%,
    rgba(10,6,4,0.97) 100%
  );
  pointer-events: none;
}

.event-top-bar {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 18px 28px;
}

.event-label-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.event-live-pill {
  font-family: var(--font-head);
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: rgba(200,150,42,0.18);
  border: 1px solid #c8962a88;
  color: #c8962a;
  border-radius: 20px;
  padding: 4px 12px;
  backdrop-filter: blur(4px);
}

.event-affinity-chip {
  font-family: var(--font-head);
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border-radius: 12px;
  padding: 3px 10px;
  backdrop-filter: blur(4px);
}
.event-affinity-chip.force  { background: rgba(26,6,0,0.75);  color: #ff8c42; border: 1px solid #66331166; }
.event-affinity-chip.magic  { background: rgba(0,16,31,0.75); color: #4fa8ff; border: 1px solid #11336666; }
.event-affinity-chip.spirit { background: rgba(0,16,8,0.75);  color: #4dff88; border: 1px solid #11663366; }
.event-affinity-chip.void   { background: rgba(15,0,26,0.75); color: #b44fff; border: 1px solid #44118866; }

.event-timer-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  backdrop-filter: blur(4px);
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  padding: 6px 14px;
}
.timer-label { font-size: 0.54rem; color: #666; text-transform: uppercase; letter-spacing: 1px; }
.timer-value { font-family: var(--font-head); font-size: 1rem; font-weight: 700; color: #ddd; letter-spacing: 2px; }

.event-hero-body {
  position: relative;
  z-index: 1;
  padding: 0 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.event-house-label {
  font-family: var(--font-head);
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 3px;
  text-shadow: 0 1px 8px rgba(0,0,0,0.9);
}

.event-title {
  font-family: var(--font-head);
  font-size: 2.2rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 20px rgba(0,0,0,0.95);
  letter-spacing: 1px;
  line-height: 1.1;
  margin: 0;
}

.event-dispatch {
  max-width: 580px;
  background: rgba(0,0,0,0.45);
  border-left: 3px solid rgba(255,255,255,0.1);
  border-radius: 0 6px 6px 0;
  padding: 10px 16px;
  backdrop-filter: blur(4px);
}
.dispatch-label {
  display: block;
  font-size: 0.52rem;
  font-family: var(--font-head);
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #666;
  margin-bottom: 5px;
}
.dispatch-text {
  font-size: 0.74rem;
  color: #aaa;
  line-height: 1.75;
  margin: 0;
  font-style: italic;
}

/* ── Stronghold Tiers ─────────────────────────────────────────── */
.tiers-section {
  padding: 24px 28px 8px;
}
.tiers-label {
  font-family: var(--font-head);
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #555;
  margin-bottom: 12px;
}

.tiers-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tier-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #0e0906;
  border: 1px solid #1e1008;
  border-left: 3px solid var(--tc);
  border-radius: 8px;
  padding: 12px 16px;
  transition: background 0.15s, border-color 0.15s;
}
.tier-card:hover { background: #13100a; }

.tier-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.tier-name {
  font-family: var(--font-head);
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--tc);
  letter-spacing: 1px;
}
.tier-sub {
  font-size: 0.62rem;
  color: #555;
}

.tier-rewards {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-shrink: 0;
}
.t-reward {
  font-size: 0.68rem;
  font-family: var(--font-head);
  font-weight: 700;
  color: #777;
}
.t-reward.mat { }

.tier-btn {
  padding: 8px 22px;
  border-radius: 6px;
  border: 1px solid var(--tc);
  background: color-mix(in srgb, var(--tc) 8%, transparent);
  color: var(--tc);
  font-family: var(--font-head);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;
  min-width: 110px;
  transition: background 0.15s, box-shadow 0.15s;
}
.tier-btn:hover {
  background: color-mix(in srgb, var(--tc) 18%, transparent);
  box-shadow: 0 0 16px -4px var(--tc);
}

.tier-locked {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  opacity: 0.5;
}
.tier-lock-icon { font-size: 0.8rem; }
.tier-lock-hint {
  font-size: 0.58rem;
  color: #666;
  font-style: italic;
  max-width: 140px;
  line-height: 1.4;
}

/* ── Rotation Strip ───────────────────────────────────────────── */
.rotation-section {
  padding: 24px 28px 40px;
}
.rotation-label {
  font-family: var(--font-head);
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #555;
  margin-bottom: 12px;
}

.rotation-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.rotation-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  min-height: 130px;
  border: 1px solid #1e1008;
  transition: border-color 0.2s;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.rotation-card.active {
  border-color: var(--fc);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--fc) 40%, transparent);
}
.rotation-card.next { border-color: #3a2a1a; }

.rc-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.82) 100%);
}

.rc-body {
  position: relative;
  z-index: 1;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.rc-status {
  font-family: var(--font-head);
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--fc);
  margin-bottom: 1px;
}
.rc-status.next-tag { color: #666; }

.rc-house {
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 800;
  color: #ddd;
  line-height: 1.2;
}
.rc-sin {
  font-size: 0.57rem;
  color: #555;
  font-style: italic;
}

/* ── Final Siege ── */
.final-siege-section {
  padding: 24px 24px 0;
}

.final-siege-card {
  position: relative;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--fc, #888);
  background-size: cover;
  background-position: center 30%;
  cursor: pointer;
  transition: border-color 0.2s;
}

.final-siege-card:hover { border-color: color-mix(in srgb, var(--fc) 80%, white); }

.fs-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(9,8,12,0.85) 0%, rgba(9,8,12,0.4) 100%);
}

.fs-body {
  position: relative;
  z-index: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.fs-house {
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin: 0;
}

.fs-title {
  font-size: 1rem;
  font-weight: 700;
  color: #e8dfc0;
  margin: 0;
}

.fs-sub {
  font-size: 0.68rem;
  color: #7a6a50;
  font-style: italic;
  margin: 0;
}

.final-siege-locked {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  background: #0d0c0a;
  border: 1px solid #1a1814;
  border-radius: 6px;
}

.fs-lock-icon { font-size: 1.2rem; opacity: 0.4; flex-shrink: 0; }

.fs-lock-title {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4a4030;
  margin: 0 0 3px;
}

.fs-lock-hint {
  font-size: 0.65rem;
  color: #4a4030;
  font-style: italic;
  margin: 0;
}
</style>
