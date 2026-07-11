<template>
  <div class="gh-wrap">

    <!-- HEADER -->
    <header class="gh-header" :style="headerBg ? { backgroundImage: headerBg } : {}">
      <div class="gh-header-overlay" />
      <div class="gh-header-inner">
        <img v-if="playerHouse?.shield" :src="playerHouse.shield" class="gh-crest" alt="" />
        <div class="gh-header-text">
          <p class="gh-eyebrow">The Great Hall</p>
          <h1 class="gh-hall-name" :style="{ color: playerHouse?.color ?? '#d4af37' }">
            {{ starterFaction ?? 'The Realm' }}
          </h1>
          <p class="gh-tagline">{{ playerHouse?.tagline }}</p>
        </div>
        <div v-if="questStore.totalQP > 0" class="gh-qp-badge" title="Quest Points">
          {{ questStore.totalQP }} QP
        </div>
      </div>
    </header>

    <!-- TAB NAV -->
    <nav class="gh-tabs">
      <button class="gh-tab" :class="{ 'is-active': activeTab === 'hall' }" @click="activeTab = 'hall'">The Hall</button>
      <button class="gh-tab" :class="{ 'is-active': activeTab === 'quests' }" @click="activeTab = 'quests'">
        Quest Log
        <span class="gh-tab-qp" v-if="questStore.totalQP > 0">{{ questStore.totalQP }} QP</span>
      </button>
    </nav>

    <!-- QUEST LOG -->
    <QuestLogPanel v-if="activeTab === 'quests'" class="gh-quest-log" />

    <!-- BODY -->
    <div class="gh-body" v-else>

      <!-- LORD / STANDINGS — left -->
      <aside class="gh-col-lord">
        <div class="gh-lord-portrait-wrap" v-if="playerHouseLordPortrait">
          <img :src="playerHouseLordPortrait" class="gh-lord-img" :alt="playerHouse?.lordName" />
          <img v-if="playerHouse?.frame" :src="playerHouse.frame" class="gh-lord-frame" aria-hidden="true" />
          <div class="gh-lord-portrait-fade" />
        </div>

        <!-- Pre-oath: house standings -->
        <div class="gh-standings" v-else>
          <p class="gh-standings-label">Houses Watching</p>
          <div
            class="gh-standing-row"
            v-for="h in houseStandings"
            :key="h.name"
            :style="{ '--house-color': h.color }"
          >
            <img :src="h.shield" class="gh-standing-crest" :alt="h.name" />
            <div class="gh-standing-info">
              <p class="gh-standing-name">{{ h.name }}</p>
              <div class="gh-standing-tier-bar">
                <div class="gh-standing-tier-fill" :style="{ width: h.tierPct + '%' }" />
              </div>
              <p class="gh-standing-tier-name" :class="{ 'is-negative': h.rep < 0 }">
                {{ h.rep < 0 ? 'Unwelcome' : h.tierName }}
              </p>
            </div>
          </div>
        </div>

        <!-- Lord info -->
        <div class="gh-lord-info">
          <p class="gh-lord-name">{{ playerHouse?.lordName ?? '— —' }}</p>
          <p class="gh-lord-role">{{ playerHouseLordPortrait ? 'House Lord' : 'No oath sworn' }}</p>
        </div>
      </aside>

      <!-- CENTER — dispatch + chronicle -->
      <main class="gh-col-center">

        <!-- ── OUTCOME REVEAL ── -->
        <section class="gh-dispatch gh-dispatch--outcome" v-if="dispatchState === 'outcome' && outcome">
          <div class="gh-dispatch-header">
            <p class="gh-dispatch-quest-name">{{ outcome.questName }}</p>
            <p class="gh-dispatch-qp">+{{ outcome.questPoints }} Quest Point{{ outcome.questPoints > 1 ? 's' : '' }}</p>
          </div>
          <p class="gh-outcome-text">{{ outcome.outcomeText }}</p>
          <div class="gh-rep-reveal">
            <div
              class="gh-rep-row"
              v-for="h in repRevealHouses"
              :key="h.name"
              :style="{ '--house-color': h.color }"
            >
              <img :src="h.shield" class="gh-rep-crest" :alt="h.name" />
              <span class="gh-rep-house-name">{{ h.shortName }}</span>
              <span class="gh-rep-delta" :class="h.delta > 0 ? 'pos' : 'neg'">
                {{ h.delta > 0 ? '+' : '' }}{{ h.delta }}
              </span>
            </div>
          </div>
          <div class="gh-dispatch-reward">
            <span v-for="r in outcome.reward" :key="r.type" class="gh-reward-chip">
              {{ r.amount }}× {{ SCROLL_LABEL[r.type] }}
            </span>
          </div>
          <button class="gh-dispatch-btn" @click="dismissOutcome">Continue</button>
        </section>

        <!-- ── READING A DISPATCH ── -->
        <section class="gh-dispatch gh-dispatch--reading" v-else-if="dispatchState === 'reading' && readyQuest">
          <div class="gh-dispatch-header">
            <span class="gh-dispatch-sender">{{ readyQuest.dispatch.sender }}</span>
            <span class="gh-dispatch-subject">{{ readyQuest.dispatch.subject }}</span>
          </div>
          <p class="gh-dispatch-body" v-for="(line, i) in readyQuest.dispatch.body.split('\n\n')" :key="i">
            {{ line }}
          </p>
          <div class="gh-dispatch-options">
            <button
              class="gh-option-btn"
              v-for="opt in readyQuest.options"
              :key="opt.id"
              @click="chooseOption(readyQuest.id, opt.id)"
            >
              <span class="gh-option-label">{{ opt.label }}</span>
              <span class="gh-option-sub">{{ opt.text }}</span>
            </button>
          </div>
        </section>

        <!-- ── DISPATCH AVAILABLE ── -->
        <section class="gh-dispatch gh-dispatch--sealed" v-else-if="readyQuest">
          <div class="gh-seal-icon">✉</div>
          <div class="gh-seal-info">
            <p class="gh-seal-from">From: {{ readyQuest.dispatch.sender }}</p>
            <p class="gh-seal-subject">{{ readyQuest.dispatch.subject }}</p>
          </div>
          <button class="gh-dispatch-btn" @click="openDispatch()">
            Open Dispatch
          </button>
        </section>

        <!-- ── IDLE ── -->
        <section class="gh-dispatch gh-dispatch--idle" v-else>
          <p class="gh-idle-text">The hall is quiet. No dispatches await.</p>
        </section>

        <!-- Chronicle -->
        <section class="gh-chronicle">
          <h2 class="gh-section-title">Chronicle</h2>
          <p class="gh-chronicle-empty" v-if="!journalStore.entries.length">
            The chronicle awaits your first deed.
          </p>
          <div class="gh-entries" v-else>
            <div class="gh-entry" :class="`gh-entry--${entry.type}`" v-for="entry in recentEntries" :key="entry.id">
              <span class="gh-entry-date">{{ entry.date }}</span>
              <span class="gh-entry-title">{{ entry.title }}</span>
            </div>
          </div>
        </section>

      </main>

      <!-- PLAYER + DEEDS — right -->
      <aside class="gh-col-player">

        <div class="gh-player-card" v-if="playerHero.isCreated">
          <div class="gh-player-avatar-wrap">
            <img v-if="playerAvatarUrl" :src="playerAvatarUrl" class="gh-player-avatar" />
          </div>
          <div class="gh-player-details">
            <p class="gh-player-name">{{ playerHero.heroName }}</p>
            <p class="gh-player-faction" :style="{ color: playerHouse?.color ?? '#a89870' }">
              {{ playerHero.heroFaction }}
            </p>
            <div class="gh-player-tags">
              <span class="gh-tag gh-tag--rarity">{{ playerHero.rarity }}</span>
              <span class="gh-tag">Lv. {{ playerHero.level }}</span>
              <span class="gh-tag" v-if="artisanLabel">{{ artisanLabel }}</span>
            </div>
          </div>
        </div>

        <div class="gh-deeds">
          <h2 class="gh-section-title">Chronicle of Deeds</h2>
          <div class="gh-deed-row" v-for="deed in deeds" :key="deed.label">
            <span class="gh-deed-label">{{ deed.label }}</span>
            <span class="gh-deed-val">{{ deed.value }}</span>
          </div>
        </div>

      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import QuestLogPanel from './QuestLogPanel.vue'
import { useReputationStore, ALL_HOUSES } from '../stores/useReputationStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useBattleStore } from '../stores/useBattleStore.js'
import { useDungeonStore } from '../stores/useDungeonStore.js'
import { useWeaponStore } from '../stores/useWeaponStore.js'
import { useJournalStore } from '../stores/useJournalStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { useQuestStore } from '../stores/useQuestStore.js'

import shieldAldric      from '../assets/lore/house_aldric.png'
import shieldValdris     from '../assets/lore/house_valdris.png'
import shieldCaelwyn     from '../assets/lore/house_caelwyn.png'
import shieldMordaine    from '../assets/lore/house_mordaine.png'
import siegeAldric       from '../assets/lore/siege_aldric.png'
import siegeValdris      from '../assets/lore/siege_Valdris.png'
import siegeCaelwyn      from '../assets/lore/siege_caelwyn.png'
import siegeMordaine     from '../assets/lore/siege_mordaine.png'
import frameCaelwyn      from '../assets/ui/caelwyn_thin_border_transparent_full.png'
import frameMordaine     from '../assets/ui/mordaine_border_195x260_transparent.png'
import frameAldric       from '../assets/ui/aldric_red_border_195x260_transparent.png'
import frameValdris      from '../assets/ui/valdris_border_195x260_transparent.png'
import _parchmentBg      from '../assets/ui/background_parchment.png'
import { getPortrait }   from '../game/portraits.js'
import { HERO_TEMPLATES, STARTER_KEYS } from '../game/data/heroes.js'

const emit = defineEmits(['navigate'])

const SCROLL_LABEL = {
  commonWrit:    'Common Writ',
  sealedCharter: 'Sealed Charter',
  houseSeal:     'House Seal',
}

const HOUSE_META = {
  'House Caelwyn':  { shield: shieldCaelwyn,  color: '#4dff88', shortName: 'Caelwyn',  frame: frameCaelwyn,  lordKey: 'LORD_CAELWYN',     lordName: 'Lord Caelwyn',     tagline: 'Wardens of the Ancient Grove' },
  'House Aldric':   { shield: shieldAldric,   color: '#c8962a', shortName: 'Aldric',   frame: frameAldric,   lordKey: 'LORD_ALDRIC',       lordName: 'Lord Aldric',       tagline: 'Warriors of the Iron Gate' },
  'House Valdris':  { shield: shieldValdris,  color: '#4fa8ff', shortName: 'Valdris',  frame: frameValdris,  lordKey: 'ARCHMAGE_VALDRIS',  lordName: 'Archmage Valdris',  tagline: 'Scholars of the Arcane Tower' },
  'House Mordaine': { shield: shieldMordaine, color: '#b44fff', shortName: 'Mordaine', frame: frameMordaine, lordKey: 'LORD_MORDAINE',     lordName: 'Lord Mordaine',     tagline: 'Shadowblades of the Dark Spire' },
}

const SIEGE_IMAGES = {
  'House Aldric':   siegeAldric,
  'House Valdris':  siegeValdris,
  'House Caelwyn':  siegeCaelwyn,
  'House Mordaine': siegeMordaine,
}

const _avatarModules = import.meta.glob('../assets/units/avatar_*.png', { eager: true })
const PLAYER_AVATARS = Object.fromEntries(
  Object.entries(_avatarModules).map(([path, mod]) => {
    const id = path.match(/avatar_\d+/)?.[0]
    return [id, mod.default]
  }).filter(([id]) => id)
)

const repStore     = useReputationStore()
const collection   = useCollectionStore()
const battleStore  = useBattleStore()
const dungeonStore = useDungeonStore()
const weaponStore  = useWeaponStore()
const journalStore = useJournalStore()
const playerHero   = usePlayerHeroStore()
const questStore   = useQuestStore()

// ── House identity ──────────────────────────────────────────────────────────

const starterFaction = computed(() => {
  if (playerHero.heroFaction) return playerHero.heroFaction
  for (const key of collection.ownedKeys) {
    if (!STARTER_KEYS.includes(key)) continue
    const faction = HERO_TEMPLATES[key]?.()?.faction
    if (faction) return faction
  }
  return null
})

const headerBg = computed(() => {
  const img = starterFaction.value ? SIEGE_IMAGES[starterFaction.value] : null
  return img ? `url(${img})` : null
})

const playerHouse = computed(() => {
  if (!starterFaction.value) return null
  const meta = HOUSE_META[starterFaction.value]
  if (!meta) return null
  return { name: starterFaction.value, ...meta }
})

const houseLordHero = computed(() => {
  const meta = playerHouse.value
  if (!meta?.lordKey) return null
  return HERO_TEMPLATES[meta.lordKey]?.() ?? null
})

const playerHouseLordPortrait = computed(() => {
  const hero = houseLordHero.value
  return hero ? getPortrait(hero) : null
})

const playerAvatarUrl = computed(() => {
  const id = playerHero.heroAvatar
  return id ? (PLAYER_AVATARS[id] ?? null) : null
})

const artisanLabel = computed(() => {
  const s = playerHero.heroArtisanSkill
  if (!s) return null
  return s.charAt(0).toUpperCase() + s.slice(1)
})

// ── House standings (left column) ──────────────────────────────────────────

const houseStandings = computed(() =>
  ALL_HOUSES.map(name => {
    const meta   = HOUSE_META[name]
    const t      = repStore.tier(name)
    return {
      name,
      shield:    meta.shield,
      color:     meta.color,
      rep:       repStore.getRep(name),
      tierName:  t.name,
      tierPct:   t.pct,
    }
  })
)

// ── Quest + dispatch logic ──────────────────────────────────────────────────

const activeTab = ref('hall')

const dispatchState = ref('idle')  // 'idle' | 'reading' | 'outcome'
const outcome       = ref(null)

const currentStats = computed(() => ({
  battleWins:    battleStore.battleWins,
  dungeonClears: dungeonStore.dungeonClears,
  heroCount:     collection.ownedKeys.filter(k => k !== 'PLAYER_CHARACTER').length,
  raidClears:    battleStore.clearedRaids.size,
  siegeClears:   battleStore.siegeClears,
}))

const readyQuest = computed(() => questStore.getReadyDispatch(currentStats.value))

function openDispatch() {
  dispatchState.value = 'reading'
}

function chooseOption(questId, optionId) {
  const result = questStore.complete(questId, optionId)
  if (!result) return
  outcome.value       = result
  dispatchState.value = 'outcome'
}

function dismissOutcome() {
  outcome.value       = null
  dispatchState.value = 'idle'
}

// Houses shown in the rep reveal, ordered by magnitude of change
const repRevealHouses = computed(() => {
  if (!outcome.value?.repChanges) return []
  return Object.entries(outcome.value.repChanges)
    .map(([name, delta]) => ({
      name,
      delta,
      shield:    HOUSE_META[name]?.shield,
      color:     HOUSE_META[name]?.color,
      shortName: HOUSE_META[name]?.shortName ?? name,
    }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
})

// ── Deeds / chronicle ──────────────────────────────────────────────────────

const clearedRaidsCount    = computed(() => battleStore.clearedRaids.size)
const highestWeaponTier    = computed(() => {
  const weapons = weaponStore.soulWeapons
  if (!weapons.length) return 0
  return Math.max(...weapons.map(w => w.tier ?? 1))
})

const recentEntries = computed(() =>
  journalStore.entries.slice(0, 8)
)

const deeds = computed(() => [
  { label: 'Quest Points',    value: questStore.totalQP },
  { label: 'Raids Cleared',   value: clearedRaidsCount.value },
  { label: 'Dungeons Cleared',value: dungeonStore.dungeonClears },
  { label: 'Battles Won',     value: battleStore.battleWins },
  { label: 'Heroes in Banner',value: collection.ownedKeys.length },
  { label: 'Highest Forge',   value: `T${highestWeaponTier.value}` },
])

const parchmentUrl = `url(${_parchmentBg})`
const houseColor   = computed(() => playerHouse.value?.color ?? '#d4af37')
</script>

<style scoped>
/* ══════════════════════════════════
   Root
   ══════════════════════════════════ */
.gh-wrap {
  height: 100%;
  background: #09080c;
  color: #d4c9a8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ══════════════════════════════════
   TABS
   ══════════════════════════════════ */
.gh-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #1e1a2a;
  flex-shrink: 0;
  padding: 0 20px;
}

.gh-tab {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  font-size: 0.65rem;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: #504868;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s;
  margin-bottom: -1px;
}
.gh-tab:hover { color: #9a8e70; }
.gh-tab.is-active {
  color: #d4af37;
  border-bottom-color: #d4af37;
}

.gh-tab-qp {
  font-size: 0.58rem;
  padding: 1px 5px;
  background: #1a140a;
  color: #d4af37;
  border: 1px solid #3a2e10;
  border-radius: 2px;
}

.gh-quest-log {
  flex: 1;
  overflow: hidden;
}

/* ══════════════════════════════════
   HEADER
   ══════════════════════════════════ */
.gh-header {
  height: 180px;
  background-size: cover;
  background-position: center 25%;
  position: relative;
  flex-shrink: 0;
}

.gh-header::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent 0%, v-bind(houseColor) 50%, transparent 100%);
  box-shadow: 0 0 14px v-bind(houseColor), 0 0 4px v-bind(houseColor);
  z-index: 2;
}

.gh-header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(9,8,12,0.45) 0%, rgba(9,8,12,0.88) 75%, rgba(9,8,12,1.00) 100%);
}

.gh-header-inner {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: flex-end;
  gap: 16px;
  padding: 0 28px 20px;
}

.gh-crest {
  width: 40px; height: 40px;
  object-fit: contain;
  opacity: 0.85;
  flex-shrink: 0;
}

.gh-header-text { display: flex; flex-direction: column; gap: 2px; flex: 1; }

.gh-eyebrow {
  font-size: 0.58rem;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: #4a4030;
  margin: 0;
}

.gh-hall-name {
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
  text-shadow: 0 2px 16px rgba(0,0,0,0.95);
  line-height: 1;
}

.gh-tagline {
  font-size: 0.65rem;
  color: #5a5040;
  letter-spacing: 0.12em;
  margin: 0;
}

.gh-qp-badge {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #d4af37;
  border: 1px solid #3a3020;
  padding: 4px 10px;
  border-radius: 3px;
  margin-bottom: 2px;
  flex-shrink: 0;
}

/* ══════════════════════════════════
   BODY
   ══════════════════════════════════ */
.gh-body {
  display: grid;
  grid-template-columns: 300px 1fr 280px;
  flex: 1;
  min-height: 0;
  border-top: 1px solid #1a1814;
  overflow: hidden;
}

/* ── Lord / standings column ── */
.gh-col-lord {
  border-right: 1px solid #1a1814;
  display: flex;
  flex-direction: column;
  background: #0a0909;
  overflow-y: auto;
}

.gh-lord-portrait-wrap {
  position: relative;
  flex-shrink: 0;
  padding: 10px;
  display: inline-flex;
  width: 100%;
  box-sizing: border-box;
}

.gh-lord-img {
  width: 100%;
  display: block;
  position: relative;
  z-index: 1;
}

.gh-lord-frame {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 2;
}

.gh-lord-portrait-fade {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60px;
  background: linear-gradient(to top, #0a0909 0%, transparent 100%);
  z-index: 3;
}

.gh-standings {
  flex: 1;
  padding: 20px 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gh-standings-label {
  font-size: 0.58rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #4a4030;
  margin: 0 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1a1814;
}

.gh-standing-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #1a181400;
  border-bottom-color: rgba(255,255,255,0.03);
}

.gh-standing-crest {
  width: 28px; height: 28px;
  object-fit: contain;
  flex-shrink: 0;
  opacity: 0.7;
}

.gh-standing-info {
  flex: 1;
  min-width: 0;
}

.gh-standing-name {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--house-color);
  margin: 0 0 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.gh-standing-tier-bar {
  height: 2px;
  background: #1a1814;
  border-radius: 1px;
  margin-bottom: 3px;
  overflow: hidden;
}

.gh-standing-tier-fill {
  height: 100%;
  background: var(--house-color);
  opacity: 0.6;
  border-radius: 1px;
  transition: width 0.4s ease;
}

.gh-standing-tier-name {
  font-size: 0.56rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4a4030;
  margin: 0;
}

.gh-standing-tier-name.is-negative {
  color: #6a3030;
}

.gh-lord-info {
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-top: 1px solid #1a1814;
}

.gh-lord-name {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c4b888;
  margin: 0;
}

.gh-lord-role {
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #4a4030;
  margin: 0;
}

/* ── Center column ── */
.gh-col-center {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #1a1814;
  overflow: hidden;
  min-height: 0;
}

.gh-section-title {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #4a4030;
  margin: 0 0 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #1a1814;
}

/* ── Dispatch states ── */
.gh-dispatch {
  padding: 24px 28px;
  border-bottom: 1px solid #1a1814;
  flex-shrink: 0;
}

.gh-dispatch--idle {
  display: flex;
  align-items: center;
}

.gh-idle-text {
  font-size: 0.75rem;
  color: #4a4030;
  font-style: italic;
  margin: 0;
}

/* Sealed dispatch */
.gh-dispatch--sealed {
  display: flex;
  align-items: center;
  gap: 16px;
}

.gh-seal-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
  color: #d4af37;
  opacity: 0.7;
}

.gh-seal-info { flex: 1; }

.gh-seal-from {
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #4a4030;
  margin: 0 0 4px;
}

.gh-seal-subject {
  font-size: 0.88rem;
  font-weight: 600;
  color: #c4b888;
  margin: 0;
}

/* Reading / letter */
.gh-dispatch--reading {
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
  max-height: 70%;
}

.gh-dispatch-header {
  display: flex;
  gap: 12px;
  align-items: baseline;
  margin-bottom: 16px;
}

.gh-dispatch-sender {
  font-size: 0.58rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #4a4030;
}

.gh-dispatch-subject {
  font-size: 0.78rem;
  font-weight: 600;
  color: #c4b888;
}

.gh-dispatch-body {
  font-size: 0.82rem;
  color: #b0a888;
  line-height: 1.7;
  margin: 0 0 14px;
}

.gh-dispatch-options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
}

.gh-option-btn {
  background: #0d0c0a;
  border: 1px solid #2a2418;
  border-radius: 4px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  color: inherit;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gh-option-btn:hover {
  background: #141210;
  border-color: #4a4030;
}

.gh-option-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #c4b888;
}

.gh-option-sub {
  font-size: 0.68rem;
  color: #5a5040;
  font-style: italic;
}

/* Outcome reveal */
.gh-dispatch--outcome {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gh-dispatch-quest-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #c4b888;
  letter-spacing: 0.08em;
  margin: 0;
}

.gh-dispatch-qp {
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #d4af37;
  margin: 0;
}

.gh-outcome-text {
  font-size: 0.82rem;
  color: #b0a888;
  line-height: 1.7;
  font-style: italic;
  margin: 0;
}

.gh-rep-reveal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.gh-rep-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #0d0c0a;
  border: 1px solid #1a1814;
  border-left: 2px solid var(--house-color);
  border-radius: 3px;
}

.gh-rep-crest {
  width: 20px; height: 20px;
  object-fit: contain;
  opacity: 0.7;
  flex-shrink: 0;
}

.gh-rep-house-name {
  font-size: 0.65rem;
  color: #7a7060;
  flex: 1;
}

.gh-rep-delta {
  font-size: 0.82rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.gh-rep-delta.pos { color: #4dff88; }
.gh-rep-delta.neg { color: #ff4444; }

.gh-dispatch-reward {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gh-reward-chip {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #d4af37;
  background: #1a1508;
  border: 1px solid #3a3020;
  padding: 4px 10px;
  border-radius: 3px;
}

.gh-dispatch-btn {
  align-self: flex-start;
  background: #1a1508;
  border: 1px solid #3a3020;
  color: #d4af37;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 8px 20px;
  cursor: pointer;
  border-radius: 3px;
  transition: background 0.15s, border-color 0.15s;
}

.gh-dispatch-btn:hover {
  background: #241e0a;
  border-color: #5a5030;
}

/* Chronicle */
.gh-chronicle {
  padding: 24px 28px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background-image:
    linear-gradient(rgba(9,8,12,0.40), rgba(9,8,12,0.72)),
    v-bind(parchmentUrl);
  background-repeat: repeat;
  background-size: auto, 600px 600px;
}

.gh-chronicle-empty {
  font-size: 0.8rem;
  color: #4a4030;
  font-style: italic;
  margin: 0;
}

.gh-entries {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.gh-entry {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(13,12,10,0.68);
  border-left: 2px solid #2a2418;
  align-items: baseline;
}

.gh-entry-date {
  font-size: 0.62rem;
  color: #4a4030;
  white-space: nowrap;
}

.gh-entry-title {
  font-size: 0.8rem;
  color: #c4b888;
  font-weight: 600;
}

.gh-entry--quest_complete  { border-left-color: #d4af37; }
.gh-entry--first_raid      { border-left-color: #aa55ff; }
.gh-entry--first_dungeon   { border-left-color: #44cc88; }
.gh-entry--first_siege     { border-left-color: #ff7744; }
.gh-entry--first_training  { border-left-color: #4488ff; }

/* ── Player + Deeds column ── */
.gh-col-player {
  display: flex;
  flex-direction: column;
  background: #09080c;
  overflow-y: auto;
}

.gh-player-card {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #1a1814;
  overflow: hidden;
}

.gh-player-avatar-wrap {
  width: 100px;
  flex-shrink: 0;
  overflow: hidden;
}

.gh-player-avatar {
  width: 100%;
  height: 130px;
  object-fit: cover;
  object-position: top center;
  display: block;
}

.gh-player-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}

.gh-player-name {
  font-size: 1rem;
  font-weight: 700;
  color: #d4c9a8;
  margin: 0;
}

.gh-player-faction {
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  margin: 0;
}

.gh-player-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.gh-tag {
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5a5040;
  background: #0f0e0b;
  border: 1px solid #2a2418;
  padding: 2px 6px;
  border-radius: 2px;
}

.gh-tag--rarity { color: #d4af37; border-color: #3a3020; }

.gh-deeds {
  padding: 20px 20px 28px;
  flex: 1;
}

.gh-deed-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom-color: rgba(255,255,255,0.03);
  border-bottom: 1px solid #16151200;
}

.gh-deed-row:last-child { border-bottom: none; }

.gh-deed-label {
  font-size: 0.63rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #4a4030;
}

.gh-deed-val {
  font-size: 1.05rem;
  font-weight: 700;
  color: #d4af37;
  font-variant-numeric: tabular-nums;
}
</style>
