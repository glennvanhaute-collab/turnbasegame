<template>
  <div class="gh-wrap">

    <!-- ══════════════════════════════════
         HEADER — house identity
         ══════════════════════════════════ -->
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
      </div>
    </header>

    <!-- ══════════════════════════════════
         BODY — 3 columns
         ══════════════════════════════════ -->
    <div class="gh-body">

      <!-- ── LORD — left ── -->
      <aside class="gh-col-lord">
        <!-- Portrait -->
        <div class="gh-lord-portrait-wrap" v-if="playerHouseLordPortrait">
          <img
            :src="playerHouseLordPortrait"
            class="gh-lord-img"
            :alt="playerHouse?.lordName"
          />
          <img
            v-if="playerHouse?.frame"
            :src="playerHouse.frame"
            class="gh-lord-frame"
            aria-hidden="true"
          />
          <div class="gh-lord-portrait-fade" />
        </div>
        <div class="gh-lord-unclaimed" v-else>
          <img v-if="playerHouse?.shield" :src="playerHouse.shield" class="gh-lord-crest-placeholder" />
          <p class="gh-lord-unclaimed-text">No lord has answered</p>
        </div>

        <!-- Lord info -->
        <div class="gh-lord-info">
          <p class="gh-lord-name">{{ playerHouse?.lordName ?? '— —' }}</p>
          <p class="gh-lord-role">House Lord</p>
          <div class="gh-rep-badge" :style="{ borderColor: playerHouse?.color ?? '#2a2418', color: playerHouse?.color ?? '#d4af37' }">
            {{ playerRepTier }}
          </div>
        </div>
      </aside>

      <!-- ── CENTER — notices + chronicle ── -->
      <main class="gh-col-center">

        <!-- Hall Notices -->
        <section class="gh-notices">
          <h2 class="gh-section-title">Hall Notices</h2>
          <div class="gh-notice-list">
            <div
              class="gh-notice"
              :class="{ 'gh-notice--done': notice.done }"
              v-for="notice in hallNotices"
              :key="notice.id"
              @click="emit('navigate', notice.dest)"
              role="button"
              tabindex="0"
            >
              <div class="gh-notice-check">
                <span v-if="notice.done">✓</span>
              </div>
              <div class="gh-notice-body">
                <p class="gh-notice-title">{{ notice.title }}</p>
                <p class="gh-notice-flavor">{{ notice.flavor }}</p>
              </div>
              <span class="gh-notice-dest">{{ notice.destLabel }} →</span>
            </div>
          </div>
        </section>

        <!-- Chronicle -->
        <section class="gh-chronicle">
          <h2 class="gh-section-title">Chronicle</h2>
          <p class="gh-chronicle-empty" v-if="!journalStore.entries.length">
            The chronicle awaits your first deed.
          </p>
          <div class="gh-entries" v-else>
            <div
              class="gh-entry"
              v-for="entry in recentEntries"
              :key="entry.id"
            >
              <span class="gh-entry-date">{{ entry.date }}</span>
              <span class="gh-entry-title">{{ entry.title }}</span>
            </div>
          </div>
        </section>

      </main>

      <!-- ── PLAYER + DEEDS — right ── -->
      <aside class="gh-col-player">

        <!-- Player card -->
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

        <!-- Deeds -->
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
import { computed } from 'vue'
import { useReputationStore } from '../stores/useReputationStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useBattleStore } from '../stores/useBattleStore.js'
import { useDungeonStore } from '../stores/useDungeonStore.js'
import { useWeaponStore } from '../stores/useWeaponStore.js'
import { useJournalStore } from '../stores/useJournalStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'

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

const HOUSES = [
  {
    name: 'House Caelwyn',  color: '#4dff88', shield: shieldCaelwyn,
    frame: frameCaelwyn, lordKey: 'LORD_CAELWYN', lordName: 'Lord Caelwyn',
    tagline: 'Wardens of the Ancient Grove',
  },
  {
    name: 'House Aldric',   color: '#c8962a', shield: shieldAldric,
    frame: frameAldric, lordKey: 'LORD_ALDRIC', lordName: 'Lord Aldric',
    tagline: 'Warriors of the Iron Gate',
  },
  {
    name: 'House Valdris',  color: '#4fa8ff', shield: shieldValdris,
    frame: frameValdris, lordKey: 'ARCHMAGE_VALDRIS', lordName: 'Archmage Valdris',
    tagline: 'Scholars of the Arcane Tower',
  },
  {
    name: 'House Mordaine', color: '#b44fff', shield: shieldMordaine,
    frame: frameMordaine, lordKey: 'LORD_MORDAINE', lordName: 'Lord Mordaine',
    tagline: 'Shadowblades of the Dark Spire',
  },
]

const SIEGE_IMAGES = {
  'House Aldric':   siegeAldric,
  'House Valdris':  siegeValdris,
  'House Caelwyn':  siegeCaelwyn,
  'House Mordaine': siegeMordaine,
}

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

const playerHouse = computed(() => HOUSES.find(h => h.name === starterFaction.value) ?? null)

const houseLordHero = computed(() => {
  const h = playerHouse.value
  if (!h?.lordKey) return null
  return HERO_TEMPLATES[h.lordKey]?.() ?? null
})

const playerHouseLordPortrait = computed(() => {
  const hero = houseLordHero.value
  return hero ? getPortrait(hero) : null
})

const lordOwned = computed(() => {
  const h = playerHouse.value
  if (!h?.lordKey) return false
  return collection.ownsHero(h.lordKey)
})

const playerRepTier = computed(() => {
  if (!starterFaction.value) return 'Stranger'
  return repStore.tier(starterFaction.value).name
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

const clearedRaidsCount = computed(() => battleStore.clearedRaids.size)

const highestWeaponTier = computed(() => {
  const weapons = weaponStore.soulWeapons
  if (!weapons.length) return 0
  return Math.max(...weapons.map(w => w.tier ?? 1))
})

const recentEntries = computed(() =>
  [...journalStore.entries].reverse().slice(0, 5)
)

const hallNotices = computed(() => [
  {
    id: 'campaign',
    title: 'Answer the Warfront',
    flavor: 'Troops rally beyond the grove. Victory secures the house.',
    dest: 'campaign',
    destLabel: 'Campaign',
    done: battleStore.battleWins > 0,
  },
  {
    id: 'dungeon',
    title: 'Heed the Expedition Board',
    flavor: 'Scouts report uncharted paths. Essence and glory await the bold.',
    dest: 'dungeon',
    destLabel: 'Expeditions',
    done: dungeonStore.dungeonClears > 0,
  },
  {
    id: 'forge',
    title: 'Visit the Forge',
    flavor: 'A weapon unfinished is a battle half-lost. The smith awaits.',
    dest: 'camp',
    destLabel: 'Stronghold',
    done: highestWeaponTier.value > 1,
  },
  {
    id: 'realm',
    title: 'Survey the Realm',
    flavor: 'Lords watch. Alliances shift. Stand known or stand forgotten.',
    dest: 'realm',
    destLabel: 'Realm',
    done: false,
  },
])

const deeds = computed(() => [
  { label: 'Raids Cleared',    value: clearedRaidsCount.value },
  { label: 'Dungeons Cleared', value: dungeonStore.dungeonClears },
  { label: 'Battles Won',      value: battleStore.battleWins },
  { label: 'Heroes in Banner', value: collection.ownedKeys.length },
  { label: 'Highest Forge',    value: `T${highestWeaponTier.value}` },
])

const parchmentUrl = `url(${_parchmentBg})`
const houseColor = computed(() => playerHouse.value?.color ?? '#d4af37')
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
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent 0%, v-bind(houseColor) 50%, transparent 100%);
  box-shadow: 0 0 14px v-bind(houseColor), 0 0 4px v-bind(houseColor);
  z-index: 2;
}

.gh-header-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(9,8,12,0.45) 0%,
    rgba(9,8,12,0.88) 75%,
    rgba(9,8,12,1.00) 100%
  );
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
  width: 40px;
  height: 40px;
  object-fit: contain;
  opacity: 0.85;
  flex-shrink: 0;
}

.gh-header-text { display: flex; flex-direction: column; gap: 2px; }

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

/* ── Lord column ── */
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
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 2;
}

.gh-lord-portrait-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, #0a0909 0%, transparent 100%);
  z-index: 3;
}


.gh-lord-unclaimed {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 12px;
}

.gh-lord-crest-placeholder {
  width: 80px;
  height: 80px;
  object-fit: contain;
  opacity: 0.25;
}

.gh-lord-unclaimed-text {
  font-size: 0.75rem;
  color: #4a4030;
  font-style: italic;
  margin: 0;
  text-align: center;
}

.gh-lord-unclaimed-hint {
  font-size: 0.62rem;
  color: #2a2418;
  letter-spacing: 0.08em;
  margin: 0;
  text-align: center;
}

.gh-lord-info {
  padding: 16px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 4px;
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

.gh-rep-badge {
  display: inline-block;
  margin-top: 8px;
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  border: 1px solid;
  border-radius: 3px;
  padding: 3px 8px;
  width: fit-content;
  opacity: 0.8;
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

/* Hall Notices */
.gh-notices {
  padding: 24px 28px;
  border-bottom: 1px solid #1a1814;
  flex-shrink: 0;
}

.gh-notice-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gh-notice {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #0d0c0a;
  border: 1px solid #1a1814;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.gh-notice:hover {
  background: #121110;
  border-color: #2a2418;
}

.gh-notice--done {
  opacity: 0.45;
}

.gh-notice-check {
  width: 18px;
  height: 18px;
  border: 1px solid #2a2418;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  color: #4dff88;
  flex-shrink: 0;
}

.gh-notice-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #c4b888;
  margin: 0 0 3px;
}

.gh-notice-flavor {
  font-size: 0.68rem;
  color: #4a4030;
  margin: 0;
  line-height: 1.4;
}

.gh-notice-dest {
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4a4030;
  white-space: nowrap;
  flex-shrink: 0;
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
  padding: 16px 16px;
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

.gh-tag--rarity {
  color: #d4af37;
  border-color: #3a3020;
}

.gh-deeds {
  padding: 20px 20px 28px;
  flex: 1;
}

.gh-deed-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid #16151200;
  border-bottom-color: rgba(255,255,255,0.03);
}

.gh-deed-row:last-child {
  border-bottom: none;
}

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

/* ══════════════════════════════════
   QUICK PATHS
   ══════════════════════════════════ */
.gh-paths {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid #1a1814;
  flex-shrink: 0;
}

/* All paths are hall sections — house-colored names */
.gh-path .gh-path-name {
  color: v-bind(houseColor);
}

.gh-path {
  background: none;
  border: none;
  border-right: 1px solid #1a1814;
  padding: 16px 20px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
  color: inherit;
}

.gh-path:last-child {
  border-right: none;
}

.gh-path:hover {
  background: #0f0e0b;
}

.gh-path-name {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #c4b888;
  margin: 0 0 4px;
}

.gh-path-flavor {
  font-size: 0.6rem;
  color: #4a4030;
  margin: 0;
  line-height: 1.4;
}
</style>
