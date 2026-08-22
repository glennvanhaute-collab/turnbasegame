<template>
  <div class="realm-wrap">

    <!-- ── Interactive map ──────────────────────────────────────── -->
    <div class="map-container">
      <img :src="mapImg" class="realm-map" alt="Realm of Westrun" />

      <button
        v-for="[faction, meta] in playerHouseEntries"
        :key="faction"
        class="map-hotspot"
        :class="{ active: selectedFaction === faction }"
        :style="{ '--hc': houseColor(faction), left: meta.mapX + '%', top: meta.mapY + '%' }"
        @click="selectFaction(faction)"
        :title="faction"
      >
        <span class="hs-ping" />
        <span class="hs-dot" />
        <span class="hs-label">{{ faction }}</span>
      </button>

      <p class="map-hint" v-if="!selectedFaction">Select a territory</p>
    </div>

    <!-- ── The Crown ────────────────────────────────────────────── -->
    <section class="crown-banner" :style="{ '--house-color': crown.color }">
      <div class="crown-mark">♔</div>
      <div class="crown-body">
        <div class="crown-title-row">
          <h3 class="crown-name">{{ crown.name }}</h3>
          <span class="crown-tag">{{ crown.tagline }}</span>
        </div>
        <p class="crown-sigil">{{ crown.sigil }}</p>
        <p class="crown-creed">“{{ crown.creed }}”</p>
      </div>
      <div class="crown-note">
        <span class="crown-note-label">The seat keeps no ledger</span>
        <span class="crown-note-sub">Houses are loyal, or they are not</span>
      </div>
    </section>

    <!-- ── House sections ───────────────────────────────────────── -->
    <div class="houses">
      <section
        v-for="[faction, meta] in playerHouseEntries"
        :key="faction"
        :id="houseId(faction)"
        class="house-section"
        :class="{ highlighted: selectedFaction === faction, dimmed: selectedFaction && selectedFaction !== faction }"
        :style="{ '--house-color': houseColor(faction) }"
      >
        <div class="house-header">
          <div class="house-title-row">
            <span class="house-dot" />
            <h3 class="house-name">{{ faction }}</h3>
            <span class="affinity-chip" :class="meta.affinity.toLowerCase()">{{ meta.affinity }}</span>
          </div>
          <p class="house-desc">{{ meta.desc }}</p>
          <div class="house-count">{{ ownedInHouse(faction) }} / {{ heroesForHouse(faction).length }} owned</div>
        </div>

        <!-- ── Reputation ────────────────────────────────────────── -->
        <div class="house-rep" :class="{ exalted: repStore.isExalted(faction) }">
          <div class="rep-header">
            <span class="rep-label">Reputation</span>
            <span class="rep-tier-name" :class="{ exalted: repStore.isExalted(faction) }">
              {{ repStore.tier(faction).name }}
            </span>
            <span class="rep-count">{{ repStore.getRep(faction) }} / {{ repStore.REP_MAX }}</span>
          </div>
          <div class="rep-track">
            <div class="rep-fill" :style="{ width: repStore.tier(faction).pct + '%' }" />
            <div
              v-for="t in repStore.REP_TIERS.slice(1)"
              :key="t.threshold"
              class="rep-pip"
              :style="{ left: (t.threshold / repStore.REP_MAX * 100) + '%' }"
              :class="{ reached: repStore.getRep(faction) >= t.threshold }"
            />
          </div>

          <!-- Lord unlock panel -->
          <template v-if="repStore.lordKey(faction)">
            <div v-if="repStore.canClaimLord(faction)" class="rep-lord-panel">
              <div class="rep-lord-ready">
                <span class="rep-lord-sigil">✦</span>
                <span class="rep-lord-text">
                  {{ lordHero(faction)?.name ?? 'The Lord' }} steps forward — the house stands ready.
                </span>
              </div>
              <button class="rep-claim-btn" @click="repStore.claimLord(faction)">
                Welcome to the Banner
              </button>
            </div>
            <div v-else-if="repStore.isExalted(faction) && !repStore.canClaimLord(faction)" class="rep-lord-claimed">
              ✓ {{ lordHero(faction)?.name }} has joined your banner
            </div>
            <div v-else class="rep-lord-locked">
              Reach Exalted to summon the lord of this house
            </div>
          </template>
        </div>

        <!-- ── Sworn houses ──────────────────────────────────────── -->
        <div class="sworn" v-if="swornHouses(faction).length">
          <div class="sworn-rule"><span>Sworn Houses</span></div>
          <div
            v-for="b in swornHouses(faction)"
            :key="b.faction"
            class="sworn-card"
            :style="{ '--bc': b.color }"
          >
            <div class="sworn-head">
              <span class="sworn-dot" />
              <strong class="sworn-name">{{ b.name }}</strong>
              <span class="sworn-tag">{{ b.tagline }}</span>
              <span
                class="faith-chip"
                :class="{ differs: faithDiffers(b.faction) }"
                :style="{ '--fc': faithColor(b.faction) }"
              >{{ faithOf(b.faction) }}</span>
            </div>
            <p class="sworn-meta">{{ b.region }}<span v-if="b.motto"> · {{ b.motto }}</span></p>
            <p class="sworn-summary">{{ b.summary }}</p>
            <p class="sworn-note" v-if="faithDiffers(b.faction)">
              Sworn across the faith — {{ faithOf(b.faction) }} beneath a {{ faithOf(faction) }} banner.
            </p>
            <div class="sworn-heroes" v-if="swornChampions(b.faction).length">
              <button
                v-for="{ key, hero } in swornChampions(b.faction)"
                :key="key"
                class="sworn-hero"
                :class="{ owned: collection.ownsHero(key) }"
                @click="detailHero = hero"
                :title="hero.name"
              >
                <HeroAvatar :hero="hero" :size="42" />
                <span class="sworn-hero-name">{{ hero.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="hero-grid">
          <div
            v-for="{ key, hero } in heroesForHouse(faction)"
            :key="key"
            class="hero-card"
            :class="[hero.rarity.toLowerCase(), { owned: collection.ownsHero(key) }]"
            @click="openDetail({ key, hero })"
          >
            <div class="hc-flash" :class="hero.rarity.toLowerCase()" />
            <div class="hc-portrait"><HeroAvatar :hero="hero" :size="88" /></div>
            <div class="hc-top">
              <span class="hc-rarity" :class="hero.rarity.toLowerCase()">{{ hero.rarity }}</span>
              <span class="hc-avail" :class="availClass(key)">{{ availLabel(key) }}</span>
            </div>
            <div class="hc-name">{{ hero.name }}</div>
            <div class="hc-stats">
              <span>❤ {{ hero.baseHp.toLocaleString() }}</span>
              <span>⚔ {{ hero.baseAtk }}</span>
              <span>🛡 {{ hero.baseDef }}</span>
              <span>💨 {{ hero.baseSpd }}</span>
            </div>
            <div class="hc-skills">
              <span v-for="skill in hero.skills" :key="skill.id" class="skill-chip">{{ skill.name }}</span>
            </div>
            <div class="hc-artisan" v-if="hero.artisanSkills?.length">
              <span
                v-for="art in hero.artisanSkills"
                :key="art.id"
                class="hc-art-dot"
                :style="{ '--art-color': art.color }"
                :title="art.name"
              >{{ art.icon }} {{ art.name }}</span>
            </div>
            <div class="hc-owned-badge" v-if="collection.ownsHero(key)">✓ Owned</div>
          </div>
        </div>
      </section>

      <!-- ── Enemy factions ──────────────────────────────────────── -->

      <div class="enemy-divider">
        <button class="toggle-btn" :class="{ active: showEnemies }" @click="showEnemies = !showEnemies">
          {{ showEnemies ? '▼ Hide' : '▶ Show' }} Enemy Factions
        </button>
      </div>

      <template v-if="showEnemies">
        <section
          v-for="[faction, meta] in enemyHouseEntries"
          :key="faction"
          class="house-section"
          :style="{ '--house-color': houseColor(faction) }"
        >
          <div class="house-header">
            <div class="house-title-row">
              <span class="house-dot" />
              <h3 class="house-name">{{ faction }}</h3>
              <span class="affinity-chip" :class="meta.affinity.toLowerCase()">{{ meta.affinity }}</span>
              <span class="enemy-tag">Enemy Faction</span>
            </div>
            <p class="house-desc">{{ meta.desc }}</p>
            <div class="house-count">{{ ownedInHouse(faction) }} / {{ heroesForHouse(faction).length }} owned</div>
          </div>

          <div class="hero-grid">
            <div
              v-for="{ key, hero } in heroesForHouse(faction)"
              :key="key"
              class="hero-card"
              :class="[hero.rarity.toLowerCase(), { owned: collection.ownsHero(key) }]"
              @click="openDetail({ key, hero })"
            >
              <div class="hc-flash" :class="hero.rarity.toLowerCase()" />
              <div class="hc-portrait"><HeroAvatar :hero="hero" :size="88" /></div>
              <div class="hc-top">
                <span class="hc-rarity" :class="hero.rarity.toLowerCase()">{{ hero.rarity }}</span>
                <span class="hc-avail" :class="availClass(key)">{{ availLabel(key) }}</span>
              </div>
              <div class="hc-name">{{ hero.name }}</div>
              <div class="hc-stats">
                <span>❤ {{ hero.baseHp.toLocaleString() }}</span>
                <span>⚔ {{ hero.baseAtk }}</span>
                <span>🛡 {{ hero.baseDef }}</span>
                <span>💨 {{ hero.baseSpd }}</span>
              </div>
              <div class="hc-skills">
                <span v-for="skill in hero.skills" :key="skill.id" class="skill-chip">{{ skill.name }}</span>
              </div>
              <div class="hc-owned-badge" v-if="collection.ownsHero(key)">✓ Owned</div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>

  <!-- ── Hero detail modal ─────────────────────────────────────── -->
  <Teleport to="body">
    <Transition name="rdm-fade">
      <div class="rdm-backdrop" v-if="detailHero" @click.self="detailHero = null">
        <div class="rdm-modal" :class="detailHero.hero.rarity.toLowerCase()">

          <button class="rdm-close" @click="detailHero = null">✕</button>

          <!-- Portrait column -->
          <div class="rdm-portrait"
            :style="detailPortrait ? { backgroundImage: `url(${detailPortrait})`, backgroundSize: 'cover', backgroundPosition: 'center top' } : {}"
          >
            <div class="rdm-portrait-overlay" />
            <div v-if="!detailPortrait" class="rdm-avatar-wrap">
              <HeroAvatar :hero="detailHero.hero" :size="100" />
            </div>
            <div class="rdm-portrait-name">{{ detailHero.hero.name }}</div>
          </div>

          <!-- Info column -->
          <div class="rdm-info">
            <div class="rdm-badges">
              <span class="rdm-badge rdm-rarity" :class="detailHero.hero.rarity.toLowerCase()">{{ detailHero.hero.rarity }}</span>
              <span class="rdm-badge">{{ detailHero.hero.faction }}</span>
              <span class="rdm-badge rdm-affinity" :class="detailHero.hero.affinity.toLowerCase()">{{ detailHero.hero.affinity }}</span>
              <span class="rdm-owned-chip" v-if="collection.ownsHero(detailHero.key)">✓ Owned</span>
            </div>

            <!-- Base stats -->
            <div class="rdm-section">
              <div class="rdm-section-title">Base Stats</div>
              <div class="rdm-stat-row" v-for="s in detailStats" :key="s.label">
                <span class="rdm-stat-label">{{ s.label }}</span>
                <div class="rdm-bar-wrap">
                  <div class="rdm-bar" :style="{ width: s.pct + '%', background: s.color }" />
                </div>
                <span class="rdm-stat-val">{{ s.value }}</span>
              </div>
            </div>

            <!-- Skills -->
            <div class="rdm-section">
              <div class="rdm-section-title">Skills</div>
              <div class="rdm-skill" v-for="skill in detailHero.hero.skills" :key="skill.id">
                <div class="rdm-skill-header">
                  <span class="rdm-skill-name">{{ skill.name }}</span>
                  <span class="rdm-skill-cd" v-if="skill.cooldown > 0">CD {{ skill.cooldown }}t</span>
                  <span class="rdm-skill-cd rdm-passive" v-else>Passive</span>
                </div>
                <p class="rdm-skill-desc">{{ skill.description }}</p>
              </div>
            </div>

            <!-- Artisan skills -->
            <div class="rdm-section" v-if="detailHero.hero.artisanSkills?.length">
              <div class="rdm-section-title">Artisan</div>
              <div class="rdm-artisan-row">
                <div
                  v-for="art in detailHero.hero.artisanSkills"
                  :key="art.id"
                  class="rdm-artisan-chip"
                  :style="{ '--art-color': art.color }"
                >
                  <span class="rdm-art-icon">{{ art.icon }}</span>
                  <span class="rdm-art-info">
                    <span class="rdm-art-name">
                      {{ art.name }}
                      <span class="rdm-art-level" v-if="collection.ownsHero(detailHero.key)">
                        Lv.{{ artisan.getSkillLevel(detailHero.key, art.id) }}
                      </span>
                    </span>
                    <span class="rdm-art-desc">{{ art.desc }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useArtisanStore } from '../stores/useArtisanStore.js'
import { useReputationStore } from '../stores/useReputationStore.js'
import HeroAvatar from './HeroAvatar.vue'
import { HERO_TEMPLATES, STARTER_KEYS, NORMAL_POOL, VOID_POOL } from '../game/data/heroes.js'
import { getPortrait } from '../game/portraits.js'
import {
  Faction, HOUSES, BANNERMEN, CROWN, FAITHS,
  bannermenOf, houseInfo, houseFaith,
} from '../game/data/westrun/factions.js'
const _B = import.meta.env.BASE_URL
const mapImg = _B + 'backgrounds/map.png'

const collection = useCollectionStore()
const artisan    = useArtisanStore()
const repStore   = useReputationStore()

function lordHero(faction) {
  const key = repStore.lordKey(faction)
  if (!key || !(key in HERO_TEMPLATES)) return null
  return HERO_TEMPLATES[key]()
}

const showEnemies     = ref(false)
const selectedFaction = ref(null)
const detailHero      = ref(null)

const detailPortrait = computed(() => detailHero.value ? getPortrait(detailHero.value.hero) : null)

const STAT_MAX = { HP: 80000, ATK: 800, DEF: 600, SPD: 200 }
const detailStats = computed(() => {
  if (!detailHero.value) return []
  const h = detailHero.value.hero
  return [
    { label: 'HP',  value: h.baseHp.toLocaleString(), pct: Math.min(100, h.baseHp  / STAT_MAX.HP  * 100), color: '#e05555' },
    { label: 'ATK', value: h.baseAtk,                  pct: Math.min(100, h.baseAtk / STAT_MAX.ATK * 100), color: '#e09933' },
    { label: 'DEF', value: h.baseDef,                  pct: Math.min(100, h.baseDef / STAT_MAX.DEF * 100), color: '#5599ee' },
    { label: 'SPD', value: h.baseSpd,                  pct: Math.min(100, h.baseSpd / STAT_MAX.SPD * 100), color: '#44ffaa' },
  ]
})

function openDetail(entry) { detailHero.value = entry }

const NIGHTMARE_KEYS = new Set(['INFERNAL_OVERLORD', 'SHADOW_ARCHON', 'VOID_SPAWN'])
const STARTER_SET    = new Set(STARTER_KEYS)
const NORMAL_SET     = new Set(NORMAL_POOL.map(e => e.key))
const VOID_SET       = new Set(VOID_POOL.map(e => e.key))

// View-only data. Colour, tagline, creed, faith and summary all live in
// game/data/westrun/factions.js — this holds just what the map needs.
// mapX / mapY are % positions over the castle structures visible on the map.
const HOUSE_META = {
  'House Aldric':    { affinity: 'Force',  enemy: false, mapX: 35, mapY: 19 },
  'House Valdris':   { affinity: 'Magic',  enemy: false, mapX: 68, mapY: 28 },
  'House Caelwyn':   { affinity: 'Spirit', enemy: false, mapX: 27, mapY: 47 },
  'House Mordaine':  { affinity: 'Void',   enemy: false, mapX: 75, mapY: 63 },
  // Ignar is no longer here: it is a sworn bannerman of House Aldric, not an
  // enemy. It now renders in Aldric's sworn-houses strip.
  'House Bloodtusk': { affinity: 'Force',  enemy: true, desc: 'Ruthless raiders who take what they want and answer to no crown.' },
}

// ── Houses of the realm, resolved from faction data ────────────────
const crown = CROWN

function houseColor(faction)   { return houseInfo(faction)?.color ?? '#6a5a44' }
function houseTagline(faction) { return houseInfo(faction)?.tagline ?? '' }
function houseSummary(faction) { return houseInfo(faction)?.summary ?? '' }
function houseCreed(faction)   { return houseInfo(faction)?.creed ?? '' }
function faithOf(faction)      { return houseFaith(faction) }
function faithColor(faction)   { return FAITHS[houseFaith(faction)]?.color ?? '#6a5a44' }

// A bannerman whose faith differs from its liege is the interesting case —
// surface it rather than burying it.
function faithDiffers(faction) {
  const b = BANNERMEN[faction]
  return !!b && houseFaith(faction) !== houseFaith(b.liege)
}

function swornHouses(faction) {
  return bannermenOf(faction).map(f => ({ faction: f, ...BANNERMEN[f] }))
}

// A sworn house's strip lists the champions you can actually field for it.
// Enemy units sharing the faction tag — Ignar's Frostbound Cult, for one —
// broke the oath and do not belong on their house's banner.
function swornChampions(faction) {
  return heroesForHouse(faction).filter(({ hero }) => hero.isPlayer)
}

const RARITY_ORDER = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 }
const allHeroes = Object.entries(HERO_TEMPLATES).map(([key, fn]) => ({ key, hero: fn() }))

const playerHouseEntries = computed(() => Object.entries(HOUSE_META).filter(([, m]) => !m.enemy))
const enemyHouseEntries  = computed(() => Object.entries(HOUSE_META).filter(([, m]) => m.enemy))

const HIDDEN_RARITIES = new Set(['Mythical', 'Ancient'])

function heroesForHouse(faction) {
  return allHeroes
    .filter(({ hero }) => hero.faction === faction && !HIDDEN_RARITIES.has(hero.rarity))
    .sort((a, b) =>
      RARITY_ORDER[b.hero.rarity] - RARITY_ORDER[a.hero.rarity] ||
      a.hero.name.localeCompare(b.hero.name)
    )
}

function ownedInHouse(faction) {
  return heroesForHouse(faction).filter(({ key }) => collection.ownsHero(key)).length
}

function availLabel(key) {
  if (STARTER_SET.has(key))    return 'Starter'
  if (NIGHTMARE_KEYS.has(key)) return 'Nightmare'
  if (NORMAL_SET.has(key))     return 'Normal Portal'
  if (VOID_SET.has(key))       return 'Void Portal'
  const hero = HERO_TEMPLATES[key]?.()
  return hero?.isPlayer === false ? 'Enemy' : '?'
}

function availClass(key) {
  if (STARTER_SET.has(key))    return 'avail-starter'
  if (NIGHTMARE_KEYS.has(key)) return 'avail-nightmare'
  if (NORMAL_SET.has(key))     return 'avail-normal'
  if (VOID_SET.has(key))       return 'avail-void'
  return 'avail-enemy'
}

function houseId(faction) {
  return 'house-' + faction.toLowerCase().replace(/\s+/g, '-')
}

async function selectFaction(faction) {
  selectedFaction.value = selectedFaction.value === faction ? null : faction
  if (!selectedFaction.value) return
  await nextTick()
  const el = document.getElementById(houseId(faction))
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.realm-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

/* ── Map ──────────────────────────────────────────────────────── */
.map-container {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 28px;
  border: 1px solid var(--border-gold, #5c3a14);
  box-shadow: 0 4px 32px rgba(0,0,0,0.7);
}

.realm-map {
  display: block;
  width: 100%;
  height: auto;
}

.map-hint {
  position: absolute;
  bottom: 10px;
  right: 14px;
  font-size: 0.62rem;
  color: rgba(196,168,130,0.4);
  letter-spacing: 1px;
  pointer-events: none;
}

/* ── Hotspots ─────────────────────────────────────────────────── */
.map-hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  /* label positioned below */
}

.hs-ping {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--hc);
  opacity: 0.55;
  animation: hs-pulse 2.2s ease-out infinite;
}
.map-hotspot.active .hs-ping,
.map-hotspot:hover  .hs-ping {
  animation: none;
  opacity: 0;
}

.hs-dot {
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: var(--hc);
  border: 2px solid rgba(255,255,255,0.6);
  transition: inset 0.15s, box-shadow 0.15s;
  box-shadow: 0 0 6px var(--hc);
}
.map-hotspot:hover .hs-dot {
  inset: 4px;
  box-shadow: 0 0 14px var(--hc);
}
.map-hotspot.active .hs-dot {
  inset: 2px;
  background: #fff;
  border-color: var(--hc);
  box-shadow: 0 0 18px var(--hc), 0 0 6px #fff;
}

.hs-label {
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: var(--hc);
  text-shadow: 0 1px 4px #000, 0 0 8px #000;
  opacity: 0;
  transition: opacity 0.15s;
  pointer-events: none;
}
.map-hotspot:hover  .hs-label,
.map-hotspot.active .hs-label { opacity: 1; }

@keyframes hs-pulse {
  0%   { transform: scale(1);   opacity: 0.55; }
  70%  { transform: scale(2.8); opacity: 0; }
  100% { transform: scale(2.8); opacity: 0; }
}

/* ── Houses ───────────────────────────────────────────────────── */
.houses { display: flex; flex-direction: column; gap: 24px; }

.house-section {
  background: #130908;
  border: 1px solid #3e1c0c;
  border-left: 4px solid var(--house-color);
  border-radius: 10px;
  padding: 18px 16px;
  scroll-margin-top: 84px;
  transition: opacity 0.25s, box-shadow 0.25s;
}
.house-section.dimmed     { opacity: 0.35; }
.house-section.highlighted {
  box-shadow: 0 0 0 1px var(--house-color), 0 4px 24px rgba(0,0,0,0.5);
  opacity: 1;
}

.house-header     { margin-bottom: 14px; }
.house-title-row  { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 6px; }
.house-dot        { width: 10px; height: 10px; border-radius: 50%; background: var(--house-color); flex-shrink: 0; }
.house-name       { font-size: 1rem; font-weight: 800; color: #fff; }
.house-desc       { font-size: 0.74rem; color: #666; font-style: italic; margin-bottom: 4px; }
.house-count      { font-size: 0.65rem; color: #444; }

/* ── Reputation ────────────────────────────────────────────────── */
.house-rep {
  margin: 14px 0 18px;
  padding: 12px 14px;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.05);
  border-left: 2px solid var(--house-color, #666);
  border-radius: 6px;
  display: flex; flex-direction: column; gap: 8px;
}
.house-rep.exalted {
  border-color: rgba(212,175,55,0.4);
  border-left-color: #d4af37;
  background: rgba(212,175,55,0.04);
}
.rep-header {
  display: flex; align-items: center; gap: 8px;
}
.rep-label {
  font-size: 0.55rem; letter-spacing: 2px; text-transform: uppercase;
  color: #555; flex-shrink: 0;
}
.rep-tier-name {
  font-size: 0.68rem; font-weight: 700;
  color: var(--house-color, #888);
  flex: 1;
}
.rep-tier-name.exalted { color: #d4af37; }
.rep-count {
  font-size: 0.58rem; color: #444;
  font-variant-numeric: tabular-nums;
}
.rep-track {
  position: relative;
  height: 4px;
  background: rgba(255,255,255,0.06);
  border-radius: 2px;
  overflow: visible;
}
.rep-fill {
  position: absolute; top: 0; left: 0; bottom: 0;
  background: var(--house-color, #888);
  border-radius: 2px;
  transition: width 0.4s ease;
  opacity: 0.75;
}
.house-rep.exalted .rep-fill { background: #d4af37; opacity: 1; }
.rep-pip {
  position: absolute; top: 50%; transform: translate(-50%, -50%);
  width: 6px; height: 6px; border-radius: 50%;
  background: #222; border: 1px solid rgba(255,255,255,0.1);
  transition: border-color 0.3s, background 0.3s;
}
.rep-pip.reached {
  background: var(--house-color, #888);
  border-color: var(--house-color, #888);
}

/* Lord unlock */
.rep-lord-locked {
  font-size: 0.6rem; color: #333; font-style: italic;
}
.rep-lord-panel {
  display: flex; align-items: center; gap: 10px;
  padding-top: 4px;
}
.rep-lord-ready {
  display: flex; align-items: center; gap: 6px; flex: 1;
}
.rep-lord-sigil { font-size: 0.8rem; color: #d4af37; }
.rep-lord-text  { font-size: 0.65rem; color: #b8960a; font-style: italic; }
.rep-claim-btn {
  flex-shrink: 0;
  padding: 6px 16px;
  background: rgba(212,175,55,0.1);
  border: 1px solid rgba(212,175,55,0.5);
  border-radius: 4px;
  color: #d4af37;
  font-size: 0.65rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  cursor: pointer; transition: all 0.15s;
}
.rep-claim-btn:hover {
  background: rgba(212,175,55,0.2);
  border-color: #d4af37;
}
.rep-lord-claimed {
  font-size: 0.65rem; color: #4dff88; font-weight: 700;
}

.affinity-chip { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; letter-spacing: 1px; }
.affinity-chip.force   { background: #3a1a0a; color: #ff8c42; }
.affinity-chip.magic   { background: #0a1a3a; color: #4fa8ff; }
.affinity-chip.spirit  { background: #0a2a1a; color: #4dff88; }
.affinity-chip.void    { background: #1a0a2a; color: #b44fff; }

.enemy-tag { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; background: #3a0a0a; color: #ff6b6b; border: 1px solid #7a1a1a; }

.enemy-divider { display: flex; align-items: center; gap: 12px; }
.enemy-divider::before, .enemy-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #3e1c0c;
}

.toggle-btn {
  background: #221108;
  border: 1px solid #3e1c0c;
  border-radius: 6px;
  color: #888;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 14px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.toggle-btn:hover, .toggle-btn.active { color: #ff9944; border-color: #ff6b6b; }

/* ── Hero grid ────────────────────────────────────────────────── */
.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

.hero-card {
  background: #150a07;
  border: 1px solid #3e1c0c;
  border-radius: 10px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.15s;
}
.hero-card:hover { border-color: #6a2e14; }
.hero-card.owned { border-color: #3a2a00; }
.hero-card.legendary { border-top: 2px solid #ffd700; }
.hero-card.epic      { border-top: 2px solid #b44fff; }
.hero-card.rare      { border-top: 2px solid #4fa8ff; }
.hero-card.uncommon  { border-top: 2px solid #4dff88; }
.hero-card.common    { border-top: 2px solid #444; }

.hc-portrait { display: flex; justify-content: center; padding: 4px 0 2px; }
.hc-flash    { position: absolute; inset: 0; pointer-events: none; opacity: 0.05; }
.hc-flash.legendary { background: radial-gradient(circle at top, #ffd700, transparent 60%); }
.hc-flash.epic      { background: radial-gradient(circle at top, #b44fff, transparent 60%); }
.hc-flash.rare      { background: radial-gradient(circle at top, #4fa8ff, transparent 60%); }
.hc-flash.uncommon  { background: radial-gradient(circle at top, #4dff88, transparent 60%); }

.hc-top    { display: flex; align-items: center; justify-content: space-between; gap: 4px; flex-wrap: wrap; }
.hc-rarity { font-size: 0.58rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
.hc-rarity.legendary { color: #ffd700; }
.hc-rarity.epic      { color: #b44fff; }
.hc-rarity.rare      { color: #4fa8ff; }
.hc-rarity.uncommon  { color: #4dff88; }
.hc-rarity.common    { color: #666; }

.hc-avail { font-size: 0.55rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; white-space: nowrap; }
.avail-starter   { background: #3a2a00; color: #ffd700; border: 1px solid #5a3a00; }
.avail-normal    { background: #2a1a08; color: #d4803a; border: 1px solid #5a3010; }
.avail-void      { background: #1a0a2a; color: #b44fff; border: 1px solid #3a1a5a; }
.avail-enemy     { background: #2a0a0a; color: #ff6b6b; border: 1px solid #5a1a1a; }
.avail-nightmare { background: #1a0808; color: #ff4444; border: 1px solid #8a0000; }

.hc-name  { font-size: 0.8rem; font-weight: 700; color: #ddd; line-height: 1.2; }
.hc-stats { display: flex; flex-wrap: wrap; gap: 6px; font-size: 0.65rem; color: #555; }

.hc-skills { display: flex; flex-wrap: wrap; gap: 3px; }
.skill-chip {
  font-size: 0.58rem; padding: 1px 6px; border-radius: 4px;
  background: #221108; color: #666; border: 1px solid #3e1c0c; white-space: nowrap;
}

/* Artisan dots on card */
.hc-artisan { display: flex; gap: 4px; flex-wrap: wrap; }
.hc-art-dot {
  font-size: 0.55rem;
  padding: 1px 7px 1px 5px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--art-color) 35%, transparent);
  background: color-mix(in srgb, var(--art-color) 8%, transparent);
  color: var(--art-color);
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.hc-owned-badge {
  font-size: 0.62rem; font-weight: 800; color: #4dff88;
  background: #0a2a0a; border: 1px solid #1a5a1a;
  border-radius: 4px; padding: 1px 6px; align-self: flex-start;
}
.hero-card { cursor: pointer; }

/* ── Realm detail modal ───────────────────────────────────────── */
.rdm-backdrop {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.rdm-modal {
  position: relative;
  display: flex;
  width: min(720px, 95vw);
  max-height: 85vh;
  background: rgba(12,6,3,0.97);
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 64px rgba(0,0,0,0.9), 0 0 40px rgba(201,162,39,0.06);
}
.rdm-close {
  position: absolute; top: 12px; right: 14px; z-index: 5;
  background: none; border: none; color: #444; font-size: 0.8rem;
  cursor: pointer; padding: 2px 4px; transition: color 0.15s;
}
.rdm-close:hover { color: #aaa; }

/* Portrait column */
.rdm-portrait {
  position: relative;
  width: 200px;
  flex-shrink: 0;
  background: #0a0403;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
}
.rdm-portrait-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(6,2,1,0.85) 100%);
  pointer-events: none;
}
.rdm-avatar-wrap {
  position: relative; z-index: 1;
  display: flex; justify-content: center;
  padding-bottom: 12px;
}
.rdm-portrait-name {
  position: relative; z-index: 1;
  font-family: var(--font-head);
  font-size: 0.88rem; font-weight: 800;
  color: #fff; text-align: center;
  text-shadow: 0 1px 8px rgba(0,0,0,0.9);
}

/* Rarity accent on portrait border */
.rdm-modal.legendary .rdm-portrait { border-right: 2px solid #ffd700; }
.rdm-modal.epic      .rdm-portrait { border-right: 2px solid #b44fff; }
.rdm-modal.rare      .rdm-portrait { border-right: 2px solid #4fa8ff; }
.rdm-modal.uncommon  .rdm-portrait { border-right: 2px solid #4dff88; }
.rdm-modal.mythical  .rdm-portrait { border-right: 2px solid #ff2244; }

/* Info column */
.rdm-info {
  flex: 1;
  padding: 20px 20px 20px 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.rdm-badges { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.rdm-badge {
  font-size: 0.6rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1px; padding: 2px 8px; border-radius: 10px;
  background: #1a0e08; color: var(--text-muted); border: 1px solid var(--border-brown);
}
.rdm-rarity.legendary { background: #1a1400; color: #ffd700; border-color: #3a2a00; }
.rdm-rarity.epic      { background: #1a0a2a; color: #b44fff; border-color: #3a1a5a; }
.rdm-rarity.rare      { background: #0a1a3a; color: #4fa8ff; border-color: #1a2a5a; }
.rdm-rarity.uncommon  { background: #0a2a0a; color: #4dff88; border-color: #1a4a1a; }
.rdm-rarity.mythical  { background: #2a0808; color: #ff2244; border-color: #5a1010; }
.rdm-affinity.force  { background: #3a1a0a; color: #ff8c42; border-color: #5a2a10; }
.rdm-affinity.magic  { background: #0a1a3a; color: #4fa8ff; border-color: #1a2a5a; }
.rdm-affinity.spirit { background: #0a2a1a; color: #4dff88; border-color: #1a4a2a; }
.rdm-affinity.void   { background: #1a0a2a; color: #b44fff; border-color: #3a1a5a; }
.rdm-owned-chip { font-size: 0.6rem; font-weight: 800; color: #4dff88; background: #0a2a0a; border: 1px solid #1a5a1a; border-radius: 10px; padding: 2px 8px; }

.rdm-section { display: flex; flex-direction: column; gap: 8px; }
.rdm-section-title {
  font-family: var(--font-head);
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2px;
  color: var(--text-muted);
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-brown);
}
.rdm-stat-row { display: flex; align-items: center; gap: 10px; }
.rdm-stat-label { font-size: 0.62rem; font-weight: 700; color: #555; width: 28px; flex-shrink: 0; }
.rdm-bar-wrap { flex: 1; height: 4px; background: #1a0e08; border-radius: 2px; overflow: hidden; }
.rdm-bar { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
.rdm-stat-val { font-size: 0.68rem; font-weight: 700; color: var(--text-parchment); width: 52px; text-align: right; flex-shrink: 0; }

.rdm-skill { display: flex; flex-direction: column; gap: 4px; }
.rdm-skill-header { display: flex; align-items: center; gap: 8px; }
.rdm-skill-name { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; color: var(--text-parchment); }
.rdm-skill-cd { font-size: 0.58rem; font-weight: 700; padding: 1px 6px; border-radius: 4px; background: #2a1a08; color: #888; border: 1px solid #3e1c0c; }
.rdm-passive { background: #0a1a0a; color: #4dff88; border-color: #1a3a1a; }
.rdm-skill-desc { font-size: 0.68rem; color: #555; line-height: 1.5; }

/* Artisan section in detail modal */
.rdm-artisan-row { display: flex; flex-direction: column; gap: 6px; }
.rdm-artisan-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 7px;
  border: 1px solid color-mix(in srgb, var(--art-color) 30%, transparent);
  background: color-mix(in srgb, var(--art-color) 7%, rgba(0,0,0,0.3));
}
.rdm-art-icon { font-size: 1.1rem; flex-shrink: 0; }
.rdm-art-info { display: flex; flex-direction: column; gap: 2px; }
.rdm-art-name {
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--art-color);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.rdm-art-desc  { font-size: 0.62rem; color: var(--text-muted); line-height: 1.4; }
.rdm-art-level {
  font-size: 0.58rem; font-weight: 800; color: #cd7f32;
  background: rgba(205,127,50,0.12); border: 1px solid rgba(205,127,50,0.25);
  border-radius: 4px; padding: 0 5px; margin-left: 5px; letter-spacing: 0.5px;
}

/* Transition */
.rdm-fade-enter-active { transition: opacity 0.2s, transform 0.2s; }
.rdm-fade-leave-active { transition: opacity 0.15s, transform 0.12s; }
.rdm-fade-enter-from  { opacity: 0; transform: scale(0.96); }
.rdm-fade-leave-to    { opacity: 0; transform: scale(0.96); }

@media (max-width: 600px) {
  .rdm-modal { flex-direction: column; }
  .rdm-portrait { width: 100%; height: 160px; justify-content: flex-end; }
}

/* ── The Crown ─────────────────────────────────────────────────── */
.crown-banner {
  display: flex;
  align-items: center;
  gap: 18px;
  max-width: 1200px;
  margin: 0 auto 22px;
  padding: 16px 22px;
  background: linear-gradient(90deg, rgba(20,15,8,0.92), rgba(12,9,5,0.88));
  border: 1px solid color-mix(in srgb, var(--house-color) 42%, transparent);
  border-radius: 8px;
  box-shadow: 0 0 34px color-mix(in srgb, var(--house-color) 12%, transparent) inset;
}
.crown-mark {
  font-size: 2.1rem;
  line-height: 1;
  color: var(--house-color);
  text-shadow: 0 0 18px color-mix(in srgb, var(--house-color) 55%, transparent);
  flex-shrink: 0;
}
.crown-body { flex: 1; min-width: 0; }
.crown-title-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; }
.crown-name {
  font-family: var(--font-head);
  font-size: 1.02rem;
  letter-spacing: 0.06em;
  color: var(--house-color);
}
.crown-tag {
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--text-muted);
}
.crown-sigil { margin-top: 4px; font-size: 0.7rem; color: #7a6647; font-style: italic; }
.crown-creed { margin-top: 5px; font-size: 0.76rem; color: var(--text-parchment); }
.crown-note { text-align: right; flex-shrink: 0; }
.crown-note-label {
  display: block;
  font-family: var(--font-head);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--house-color);
  opacity: 0.85;
}
.crown-note-sub { display: block; margin-top: 3px; font-size: 0.6rem; color: var(--text-dim); }

/* ── Sworn houses ──────────────────────────────────────────────── */
.sworn { margin: 14px 0 6px; }
.sworn-rule {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}
.sworn-rule::before,
.sworn-rule::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,162,39,0.22), transparent);
}
.sworn-rule span {
  font-family: var(--font-head);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-muted);
  white-space: nowrap;
}
.sworn-card {
  position: relative;
  padding: 12px 14px 12px 18px;
  margin-bottom: 10px;
  background: rgba(10, 7, 4, 0.5);
  border: 1px solid rgba(255,255,255,0.06);
  border-left: 3px solid var(--bc);
  border-radius: 4px;
}
.sworn-head { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
.sworn-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--bc);
  box-shadow: 0 0 8px var(--bc);
  flex-shrink: 0;
  align-self: center;
}
.sworn-name {
  font-family: var(--font-head);
  font-size: 0.82rem;
  color: var(--bc);
  letter-spacing: 0.04em;
}
.sworn-tag {
  font-size: 0.63rem;
  font-style: italic;
  color: var(--text-muted);
}
.faith-chip {
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--fc) 45%, transparent);
  background: color-mix(in srgb, var(--fc) 12%, transparent);
  color: var(--fc);
  font-size: 0.56rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
}
.faith-chip.differs {
  border-style: dashed;
  font-weight: 700;
}
.sworn-meta {
  margin-top: 5px;
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6a5a44;
}
.sworn-summary {
  margin-top: 6px;
  font-size: 0.72rem;
  line-height: 1.6;
  color: var(--text-parchment);
  opacity: 0.86;
}
.sworn-note {
  margin-top: 7px;
  padding-left: 9px;
  border-left: 2px solid color-mix(in srgb, var(--bc) 50%, transparent);
  font-size: 0.66rem;
  font-style: italic;
  color: #8a7758;
}
.sworn-heroes { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 11px; }
.sworn-hero {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 4px;
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 22px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
}
.sworn-hero:hover { border-color: var(--bc); transform: translateY(-2px); }
.sworn-hero.owned { border-color: color-mix(in srgb, var(--bc) 55%, transparent); }
.sworn-hero-name {
  font-size: 0.65rem;
  color: var(--text-parchment);
  white-space: nowrap;
}

@media (max-width: 700px) {
  .crown-banner { flex-wrap: wrap; gap: 12px; }
  .crown-note { text-align: left; }
}
</style>
