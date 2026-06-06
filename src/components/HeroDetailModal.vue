<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="store.closeDetail()">
      <div class="modal" v-if="entry" :style="portraitPanelStyle"
        :class="[hero.rarity === 'Ancient' ? 'rarity-ancient' : '', `affinity-${hero.affinity.toLowerCase()}`]"
      >
        <button class="close-btn" @click="store.closeDetail()">✕</button>

        <!-- Two-column layout -->
        <div class="modal-inner">

          <!-- ── Left: portrait panel ── -->
          <div class="portrait-panel" :style="heroPanelStyle">
            <div class="portrait-overlay" />
            <div class="foil-layer" />
            <div class="portrait-house-label">{{ hero.faction }}</div>
            <div class="portrait-avatar" v-if="!heroPortrait">
              <HeroAvatar :hero="hero" :size="120" />
            </div>
            <button v-if="heroPortrait" class="portrait-zoom-btn" @click="lightboxOpen = true" title="View full artwork">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.4"/>
                <line x1="9.7" y1="9.7" x2="13.5" y2="13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </button>
            <div class="portrait-name">{{ hero.name }}</div>
            <div class="portrait-quote" v-if="hero.quote">"{{ hero.quote }}"</div>
          </div>

          <!-- Fullscreen artwork lightbox -->
          <Teleport to="body">
            <div class="lightbox" v-if="lightboxOpen" @click="lightboxOpen = false">
              <img :src="heroPortrait" class="lightbox-img" alt="" @click.stop />
              <button class="lightbox-close" @click="lightboxOpen = false">✕</button>
            </div>
          </Teleport>

          <!-- ── Right: info panel ── -->
          <div class="info-panel">

            <!-- Header -->
            <div class="info-header">
              <div class="badges">
                <span class="badge rarity" :class="hero.rarity.toLowerCase()">{{ hero.rarity }}</span>
                <span class="badge faction">{{ hero.faction }}</span>
                <span class="badge affinity" :class="hero.affinity.toLowerCase()">
                  <GameIcon v-if="AFFINITY_ICON[hero.affinity]" :icon="AFFINITY_ICON[hero.affinity]" :size="14" />
                  {{ hero.affinity }}
                </span>
              </div>
            </div>

            <!-- Scrollable body -->
            <div class="info-body">

              <!-- Lore -->
              <section class="section" v-if="hero.lore">
                <h3 class="section-title">Lore</h3>
                <p class="hero-lore">{{ hero.lore }}</p>
              </section>

              <!-- Level progression — player character or soul-bound units -->
              <section class="section" v-if="hero.isPlayerCharacter || inventory.isProgressive(entry.key)">
                <h3 class="section-title">Progression</h3>
                <div class="prog-level">
                  <span class="prog-lv-label">Level</span>
                  <span class="prog-lv-value">{{ effectiveLevel }}</span>
                  <span class="prog-rarity-badge" :class="playerHero.rarity.toLowerCase()">{{ playerHero.rarity }}</span>
                </div>
                <div class="prog-xp-label">
                  <span>XP</span>
                  <span>{{ playerHero.xpProgress }} / {{ playerHero.XP_PER_LEVEL }}</span>
                </div>
                <div class="prog-bar-track">
                  <div class="prog-bar-fill" :style="{ width: (playerHero.xpProgress / playerHero.XP_PER_LEVEL * 100) + '%' }" />
                </div>
                <div class="prog-thresholds">
                  <span
                    v-for="t in rarityThresholds"
                    :key="t.label"
                    class="prog-threshold"
                    :class="{ reached: playerHero.level >= t.level, next: t.level > playerHero.level && t.level === nextThreshold?.level }"
                  >
                    <span class="thr-rarity" :class="t.label.toLowerCase()">{{ t.label }}</span>
                    <span class="thr-level">Lv.{{ t.level }}</span>
                  </span>
                </div>
              </section>

              <!-- Equipped gear -->
              <section class="section">
                <h3 class="section-title">Equipped Gear</h3>
                <div class="equipped-list">
                  <div
                    v-for="slot in SLOTS"
                    :key="slot"
                    class="eq-row"
                    :class="equippedGear[slot] ? equippedGear[slot].rarity.toLowerCase() : 'empty'"
                  >
                    <GameIcon :icon="SLOT_TO_ICON[slot] ?? 'sword'" :size="20" class="eq-icon" />
                    <template v-if="equippedGear[slot]">
                      <div class="eq-details">
                        <div class="eq-name-row">
                          <span class="eq-name">{{ equippedGear[slot].name }}</span>
                          <span class="eq-stars" :class="equippedGear[slot].rarity.toLowerCase()">{{ '★'.repeat(equippedGear[slot].stars) || '☆' }}</span>
                        </div>
                        <span class="eq-rarity" :class="equippedGear[slot].rarity.toLowerCase()">{{ equippedGear[slot].rarity }}</span>
                      </div>
                      <div class="eq-stats">
                        <span
                          v-for="s in itemStatChips(equippedGear[slot])"
                          :key="s"
                          class="eq-stat-chip"
                        >{{ s }}</span>
                      </div>
                    </template>
                    <span v-else class="eq-empty">{{ SLOT_LABELS[slot] }} — empty</span>
                  </div>
                </div>
              </section>

              <!-- Stats -->
              <section class="section">
                <h3 class="section-title">Stats</h3>
                <div class="stat-list">
                  <div class="stat-row" v-for="s in stats" :key="s.label">
                    <span class="stat-label">{{ s.label }}</span>
                    <div class="stat-bar-wrap">
                      <div class="stat-bar" :style="{ width: s.pct + '%', background: s.color }" />
                    </div>
                    <span class="stat-val">{{ s.value }}</span>
                  </div>
                </div>
              </section>

              <!-- Skills -->
              <section class="section">
                <h3 class="section-title">Skills</h3>
                <div class="skill-list">
                  <div class="skill-item" v-for="skill in hero.skills" :key="skill.id">
                    <div class="skill-header">
                      <span class="skill-name">{{ skill.name }}</span>
                      <span class="skill-cd" v-if="skill.cooldown > 0">CD: {{ skill.cooldown }}t</span>
                      <span class="skill-cd passive" v-else>No CD</span>
                    </div>
                    <p class="skill-desc">{{ skill.description }}</p>
                    <div class="skill-target">
                      Target: <span class="target-tag">{{ formatTarget(skill.targetType) }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Soul Vessel -->
              <section class="section" v-if="!hero.isPlayerCharacter">
                <h3 class="section-title">Soul Vessel</h3>
                <div class="soul-bound-row" v-if="inventory.isProgressive(entry.key)">
                  <span class="soul-bound-badge">✦ Soul Bound</span>
                  <span class="soul-bound-desc">
                    Effective level {{ effectiveLevel }}
                    <template v-if="effectiveLevel > playerHero.level"> (floored at {{ hero.rarity }} tier)</template>
                    · ×{{ playerHero.levelMultiplier.toFixed(2) }} multiplier
                  </span>
                </div>
                <div class="soul-vessel-row" v-else>
                  <button
                    class="btn-use-vessel"
                    :disabled="inventory.soulVessels <= 0"
                    @click="inventory.useSoulVessel(entry.key)"
                  >
                    <span class="vessel-icon">⚗</span>
                    Use Soul Vessel
                  </button>
                  <span class="vessel-count" v-if="inventory.soulVessels > 0">×{{ inventory.soulVessels }} owned</span>
                  <span class="vessel-hint" v-else>Drops rarely from Nightmare dungeons</span>
                </div>
              </section>

            </div>

            <!-- Footer actions -->
            <div class="info-footer">
              <button
                v-if="$isDev && hero.isPlayerCharacter"
                class="btn btn-dev-xp"
                @click="playerHero.addXp(1000)"
                title="Dev: add 1000 XP"
              >
                +1k XP
              </button>
              <button
                v-if="!collectionStore.isInTeam(entry.key)"
                class="btn btn-add"
                :disabled="collectionStore.isFull"
                @click="collectionStore.toggleTeam(entry.key); store.closeDetail()"
              >
                {{ collectionStore.isFull ? 'Team Full' : '+ Add to Team' }}
              </button>
              <button
                v-else
                class="btn btn-remove"
                @click="collectionStore.toggleTeam(entry.key); store.closeDetail()"
              >
                − Remove from Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { TargetType } from '../game/Skill.js'
import { GearSlot, SLOT_LABELS } from '../game/Gear.js'
import { SLOT_TO_ICON, AFFINITY_ICON } from '../game/data/spritesheet.js'
import { RARITY_FLOOR_LEVEL } from '../stores/usePlayerHeroStore.js'
import GameIcon from './ui/GameIcon.vue'
import HeroAvatar from './HeroAvatar.vue'
import ValdrisBg  from '../assets/lore/Valdris.png'
import AldricBg   from '../assets/lore/Aldric.png'
import { getPortrait as _getHeroPortrait } from '../game/portraits.js'
const _avatarModules = import.meta.glob('../assets/units/avatar_*.png', { eager: true })
const PLAYER_AVATARS = Object.fromEntries(
  Object.entries(_avatarModules).map(([path, mod]) => {
    const id = path.match(/avatar_\d+/)?.[0]
    return [id, mod.default]
  }).filter(([id]) => id)
)

const HOUSE_BACKGROUNDS = {
  'House Valdris': ValdrisBg,
  'House Aldric':  AldricBg,
}

const HOUSE_COLORS = {
  'House Aldric':    '#c8962a',
  'House Valdris':   '#4fa8ff',
  'House Caelwyn':   '#4dff88',
  'House Mordaine':  '#b44fff',
  'House Bloodtusk': '#ff6b6b',
  'House Ignar':     '#ff9944',
  'Ancient Nobles':  '#8a0a10',
}

const store = useCollectionStore()
const collectionStore = store
const inventory   = useInventoryStore()
const playerHero  = usePlayerHeroStore()

const rarityThresholds = [
  { level: 1,   label: 'Rare' },
  { level: 26,  label: 'Epic' },
  { level: 61,  label: 'Legendary' },
  { level: 101, label: 'Mythical' },
]
const nextThreshold = computed(() =>
  rarityThresholds.find(t => t.level > playerHero.level) ?? null
)

const effectiveLevel = computed(() => {
  if (!hero.value) return playerHero.level
  const floor = RARITY_FLOOR_LEVEL[hero.value.rarity] ?? 1
  return Math.max(playerHero.level, floor)
})

const SLOTS = Object.values(GearSlot)

const equippedGear = computed(() => {
  const key = entry.value?.key
  if (!key) return {}
  return Object.fromEntries(SLOTS.map(slot => [slot, inventory.getEquippedItem(key, slot)]))
})

const STAT_CHIP_LABELS = {
  hp: v => `+${v} HP`, hpPct: v => `+${Math.round(v*100)}% HP`,
  atk: v => `+${v} ATK`, atkPct: v => `+${Math.round(v*100)}% ATK`,
  def: v => `+${v} DEF`, defPct: v => `+${Math.round(v*100)}% DEF`,
  spd: v => `+${v} SPD`, critRate: v => `+${Math.round(v*100)}% CR`,
  critDmg: v => `+${Math.round(v*100)}% CD`,
}
function itemStatChips(item) {
  return Object.entries(item.stats)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => STAT_CHIP_LABELS[k]?.(v) ?? `+${v}`)
    .slice(0, 3)
}

const entry = computed(() => store.detailEntry)
const hero  = computed(() => entry.value?.hero)
const lightboxOpen = ref(false)

const heroPortrait = computed(() => {
  if (!hero.value) return null
  if (hero.value.id === 'player_character') return PLAYER_AVATARS[hero.value.avatarId] ?? null
  return _getHeroPortrait(hero.value)
})

// Style for the whole modal (house art bg, or color gradient)
const portraitPanelStyle = computed(() => {
  if (!hero.value) return {}
  if (heroPortrait.value) {
    const color = HOUSE_COLORS[hero.value.faction] ?? '#3e1c0c'
    return { background: `radial-gradient(ellipse at 50% 20%, ${color}22 0%, #0a0403 70%)` }
  }
  const bg    = HOUSE_BACKGROUNDS[hero.value.faction]
  const color = HOUSE_COLORS[hero.value.faction] ?? '#3e1c0c'
  return bg
    ? { backgroundImage: `url(${bg})` }
    : { background: `radial-gradient(ellipse at 50% 20%, ${color}40 0%, #0a0403 70%)` }
})

// Style for the portrait panel itself when a hero portrait is available
const heroPanelStyle = computed(() => {
  if (!heroPortrait.value) return {}
  return {
    backgroundImage: `url(${heroPortrait.value})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
  }
})

const TARGET_LABELS = {
  [TargetType.SINGLE_ENEMY]: 'Single Enemy',
  [TargetType.ALL_ENEMIES]:  'All Enemies',
  [TargetType.RANDOM_ENEMY]: 'Random Enemy',
  [TargetType.SINGLE_ALLY]:  'Single Ally',
  [TargetType.ALL_ALLIES]:   'All Allies',
  [TargetType.SELF]:         'Self',
}
const formatTarget = t => TARGET_LABELS[t] ?? t

const MAX_STATS  = { hp: 35000, atk: 2000, def: 1500, spd: 130, crit: 100, critDmg: 100 }
const STAT_COLORS = {
  hp: '#27ae60', atk: '#e74c3c', def: '#3498db', spd: '#00d4ff', crit: '#e67e22', critDmg: '#9b59b6'
}

const stats = computed(() => {
  if (!hero.value) return []
  const h = hero.value
  return [
    { label: 'HP',        value: h.baseHp,                       pct: (h.baseHp / MAX_STATS.hp) * 100,      color: STAT_COLORS.hp },
    { label: 'ATK',       value: h.baseAtk,                      pct: (h.baseAtk / MAX_STATS.atk) * 100,    color: STAT_COLORS.atk },
    { label: 'DEF',       value: h.baseDef,                      pct: (h.baseDef / MAX_STATS.def) * 100,    color: STAT_COLORS.def },
    { label: 'SPD',       value: h.baseSpd,                      pct: (h.baseSpd / MAX_STATS.spd) * 100,    color: STAT_COLORS.spd },
    { label: 'Crit Rate', value: Math.round(h.critRate * 100) + '%', pct: h.critRate * 100,                 color: STAT_COLORS.crit },
    { label: 'Crit DMG',  value: Math.round(h.critDmg * 100) + '%', pct: (h.critDmg / 1.5) * 100,          color: STAT_COLORS.critDmg },
  ]
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
  backdrop-filter: blur(3px);
}

.modal {
  background-color: #1a0d0a;
  background-size: cover;
  background-position: center top;
  border: 1px solid #5c2810;
  border-radius: 14px;
  width: min(780px, 95vw);
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute; top: 12px; right: 14px; z-index: 10;
  background: rgba(0,0,0,0.5); border: 1px solid #5c2810;
  border-radius: 50%; width: 28px; height: 28px;
  color: #999; font-size: 0.85rem;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: color 0.15s, background 0.15s;
}
.close-btn:hover { color: #fff; background: rgba(90,20,10,0.7); }

/* Two-column wrapper */
.modal-inner {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ── Portrait panel ── */
.portrait-panel {
  width: 220px;
  flex-shrink: 0;
  background: transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding-bottom: 20px;
  gap: 10px;
}
.portrait-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(8,2,1,0.82) 100%);
  pointer-events: none;
}
.portrait-house-label {
  position: absolute; top: 14px; left: 0; right: 0;
  text-align: center;
  font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2px;
  color: rgba(255,255,255,0.35);
  z-index: 1;
}
.portrait-avatar { position: relative; z-index: 1; }
.portrait-name {
  position: relative; z-index: 1;
  font-size: 0.85rem; font-weight: 800;
  color: #fff; text-align: center;
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
  line-height: 1.2;
  padding: 0 12px;
}
.hero-lore {
  font-size: 0.72rem;
  color: #8a7560;
  line-height: 1.6;
  font-style: italic;
  border-left: 2px solid var(--border-brown);
  padding-left: 10px;
}

.portrait-quote {
  position: relative; z-index: 1;
  font-size: 0.62rem; font-style: italic;
  color: rgba(196, 168, 130, 0.7);
  text-align: center;
  text-shadow: 0 1px 4px rgba(0,0,0,0.9);
  padding: 0 14px;
  line-height: 1.4;
}

/* ── Info panel ── */
.info-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid rgba(90,40,16,0.35);
  background: rgba(8, 3, 1, 0.78);
}

.info-header {
  padding: 16px 18px 12px;
  border-bottom: 1px solid rgba(42,16,8,0.8);
  flex-shrink: 0;
}
.badges { display: flex; gap: 6px; flex-wrap: wrap; }
.badge { font-size: 0.68rem; padding: 2px 8px; border-radius: 20px; font-weight: 600; }
.rarity.mythical  { background: #2a0a2a; color: #ff6ef7; border: 1px solid #ff6ef7; }
.rarity.legendary { background: #3a2a00; color: #ffd700; border: 1px solid #ffd700; }
.rarity.epic      { background: #2a0a3a; color: #b44fff; border: 1px solid #b44fff; }
.rarity.rare      { background: #0a1a3a; color: #4fa8ff; border: 1px solid #4fa8ff; }
.rarity.uncommon  { background: #0a2a1a; color: #4dff88; border: 1px solid #4dff88; }
.rarity.common    { background: #2a2a2a; color: #aaa;    border: 1px solid #444; }
.faction  { background: #221108; color: #aaa; border: 1px solid #5c2810; }
.affinity.force   { background: #3a1a0a; color: #ff8c42; border: 1px solid #ff8c42; }
.affinity.magic   { background: #0a1a3a; color: #4fa8ff; border: 1px solid #4fa8ff; }
.affinity.spirit  { background: #0a2a1a; color: #4dff88; border: 1px solid #4dff88; }
.affinity.void    { background: #1a0a2a; color: #b44fff; border: 1px solid #b44fff; }

.info-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px 18px;
  scrollbar-width: thin;
  scrollbar-color: #3e1c0c transparent;
}
.info-body::-webkit-scrollbar       { width: 5px; }
.info-body::-webkit-scrollbar-track { background: transparent; }
.info-body::-webkit-scrollbar-thumb { background: #3e1c0c; border-radius: 3px; }
.info-body::-webkit-scrollbar-thumb:hover { background: #5c2810; }
.section { margin-bottom: 18px; }
.section-title { font-size: 0.68rem; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 10px; }

/* Progression */
.prog-level { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.prog-lv-label { font-size: 0.68rem; color: #666; }
.prog-lv-value { font-family: var(--font-head); font-size: 1.1rem; font-weight: 900; color: #fff; }
.prog-rarity-badge { font-size: 0.62rem; font-weight: 700; padding: 2px 8px; border-radius: 20px; margin-left: 2px; }
.prog-rarity-badge.rare      { background: #0a1a3a; color: #4fa8ff; border: 1px solid #4fa8ff55; }
.prog-rarity-badge.epic      { background: #2a0a3a; color: #b44fff; border: 1px solid #b44fff55; }
.prog-rarity-badge.legendary { background: #3a2a00; color: #ffd700; border: 1px solid #ffd70055; }
.prog-rarity-badge.mythical  { background: #2a0a2a; color: #ff6ef7; border: 1px solid #ff6ef755; }
.prog-xp-label { display: flex; justify-content: space-between; font-size: 0.62rem; color: #555; margin-bottom: 4px; }
.prog-bar-track { height: 5px; background: #1a0e06; border-radius: 3px; overflow: hidden; margin-bottom: 10px; }
.prog-bar-fill  { height: 100%; background: linear-gradient(to right, #4dff88, #aaff44); border-radius: 3px; transition: width 0.4s; }
.prog-thresholds { display: flex; gap: 6px; flex-wrap: wrap; }
.prog-threshold {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 4px 10px; border-radius: 6px;
  background: #0e0804; border: 1px solid #2a1008;
  opacity: 0.45; transition: opacity 0.2s;
}
.prog-threshold.reached { opacity: 1; }
.prog-threshold.next    { opacity: 1; border-color: var(--gold-dim); box-shadow: 0 0 8px rgba(201,162,39,0.1); }
.thr-rarity { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.thr-rarity.rare      { color: #4fa8ff; }
.thr-rarity.epic      { color: #b44fff; }
.thr-rarity.legendary { color: #ffd700; }
.thr-rarity.mythical  { color: #ff6ef7; }
.thr-level  { font-size: 0.58rem; color: #555; }
.prog-threshold.next .thr-level { color: var(--gold-dim); }

/* Equipped gear list */
.equipped-list { display: flex; flex-direction: column; gap: 4px; }
.eq-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; border-radius: 6px;
  background: rgba(19, 9, 8, 0.7); border-left: 3px solid #333;
  font-size: 0.72rem;
}
.eq-row.mythical  { border-left-color: #ff6ef7; }
.eq-row.legendary { border-left-color: #ffd700; }
.eq-row.epic      { border-left-color: #b44fff; }
.eq-row.rare      { border-left-color: #4fa8ff; }
.eq-row.uncommon  { border-left-color: #4dff88; }
.eq-row.common    { border-left-color: #555; }
.eq-row.empty     { border-left-color: #2a1008; opacity: 0.5; }

.eq-icon     { flex-shrink: 0; }
.eq-details  { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.eq-name-row { display: flex; align-items: center; gap: 5px; min-width: 0; }
.eq-name     { font-weight: 700; color: #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.eq-stars    { font-size: 0.6rem; letter-spacing: 0; white-space: nowrap; flex-shrink: 0; }
.eq-stars.mythical  { color: #ff6ef7; }
.eq-stars.legendary { color: #ffd700; }
.eq-stars.epic      { color: #b44fff; }
.eq-stars.rare      { color: #4fa8ff; }
.eq-stars.uncommon  { color: #4dff88; }
.eq-stars.common    { color: #888; }
.eq-rarity  { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
.eq-rarity.mythical  { color: #ff6ef7; }
.eq-rarity.legendary { color: #ffd700; }
.eq-rarity.epic      { color: #b44fff; }
.eq-rarity.rare      { color: #4fa8ff; }
.eq-rarity.uncommon  { color: #4dff88; }
.eq-rarity.common    { color: #888; }

.eq-stats   { display: flex; gap: 3px; flex-wrap: wrap; }
.eq-stat-chip { font-size: 0.58rem; padding: 1px 5px; border-radius: 3px; background: #221108; color: #888; }
.eq-empty   { color: #444; font-style: italic; }

/* Stat bars */
.stat-list { display: flex; flex-direction: column; gap: 7px; }
.stat-row  { display: grid; grid-template-columns: 72px 1fr 52px; align-items: center; gap: 10px; }
.stat-label { font-size: 0.72rem; color: #888; }
.stat-bar-wrap { height: 7px; background: rgba(34,17,8,0.7); border-radius: 4px; overflow: hidden; }
.stat-bar  { height: 100%; border-radius: 4px; transition: width 0.4s; }
.stat-val  { font-size: 0.72rem; color: #ccc; text-align: right; }

/* Skills */
.skill-list { display: flex; flex-direction: column; gap: 8px; }
.skill-item {
  background: rgba(19, 9, 8, 0.7); border: 1px solid #3e1c0c;
  border-radius: 6px; padding: 9px 12px;
}
.skill-header { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
.skill-name  { font-weight: 700; font-size: 0.8rem; color: #fff; }
.skill-cd    { font-size: 0.65rem; color: #ff9944; margin-left: auto; }
.skill-cd.passive { color: #4dff88; }
.skill-desc  { font-size: 0.72rem; color: #999; line-height: 1.4; margin-bottom: 3px; }
.skill-target { font-size: 0.65rem; color: #666; }
.target-tag  { color: #4fa8ff; }

.info-footer {
  padding: 12px 18px;
  border-top: 1px solid rgba(42,16,8,0.8);
  display: flex; justify-content: flex-end;
  flex-shrink: 0;
}
.btn { padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; font-weight: 700; font-size: 0.8rem; transition: opacity 0.15s; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-add     { background: #e94560; color: #fff; }
.btn-remove  { background: #3e1c0c; color: #ccc; }
.btn-dev-xp  { background: #1a2a0a; color: #88cc44; border: 1px dashed #3a5a10; font-size: 0.7rem; margin-right: auto; }
.btn:not(:disabled):hover { opacity: 0.85; }

/* Mobile: stack vertically */
@media (max-width: 560px) {
  .modal-inner { flex-direction: column; }
  .portrait-panel { width: 100%; height: 180px; flex-direction: row; align-items: flex-end; padding: 0 20px 16px; gap: 14px; }
  .portrait-house-label { top: 10px; }
  .portrait-name { text-align: left; padding: 0; }
}

/* ── Ancient foil sheen — portrait panel only ── */
.foil-layer { display: none; }
.modal.rarity-ancient .portrait-panel .foil-layer {
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 0;
  opacity: 0.11;
  mix-blend-mode: color-dodge;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 300% 300%;
  animation: foilGradient 7s ease infinite;
  pointer-events: none;
  z-index: 8;
}

/* Blood foil */
.modal.affinity-blood .portrait-panel .foil-layer {
  background-image: linear-gradient(115deg, transparent, #cc0011 20%, #ff4400 40%, #cc0011 60%, #ff4400 80%, transparent);
}

/* Astral foil */
.modal.affinity-astral .portrait-panel .foil-layer {
  background-image: linear-gradient(115deg, transparent, #ff00e7 20%, #aa00ff 40%, #ff00e7 60%, #aa00ff 80%, transparent);
}

@keyframes foilGradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Soul Vessel */
.soul-bound-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.soul-bound-badge {
  font-size: 0.72rem;
  font-weight: 800;
  color: #aa77ff;
  background: #1a0a2a;
  border: 1px solid #6622cc55;
  border-radius: 20px;
  padding: 3px 12px;
  letter-spacing: 0.5px;
}
.soul-bound-desc {
  font-size: 0.65rem;
  color: #664;
}
.soul-vessel-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.btn-use-vessel {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #441188;
  background: #0e0618;
  color: #aa77ff;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.btn-use-vessel:hover:not(:disabled) { background: #1a0a2a; border-color: #7722ee; }
.btn-use-vessel:disabled { opacity: 0.35; cursor: not-allowed; }
.vessel-icon { font-size: 1rem; }
.vessel-count { font-size: 0.7rem; font-weight: 700; color: #aa77ff; }
.vessel-hint  { font-size: 0.65rem; color: #444; font-style: italic; }

/* Portrait zoom button */
.portrait-zoom-btn {
  position: absolute;
  bottom: 48px;
  right: 12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.45);
  color: rgba(255,255,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s, border-color 0.2s, background 0.2s;
  z-index: 4;
}
.portrait-zoom-btn svg { width: 13px; height: 13px; }
.portrait-panel:hover .portrait-zoom-btn {
  opacity: 1;
}
.portrait-zoom-btn:hover {
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.4);
  background: rgba(0,0,0,0.65);
}

/* Fullscreen artwork lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
}
.lightbox-img {
  max-width: 90vw;
  max-height: 92vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 80px rgba(0,0,0,0.8);
  cursor: default;
}
.lightbox-close {
  position: fixed;
  top: 20px;
  right: 24px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 50%;
  color: rgba(255,255,255,0.55);
  width: 36px;
  height: 36px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-close:hover { color: #fff; background: rgba(255,255,255,0.15); }
</style>
