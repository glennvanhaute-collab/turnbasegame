<template>
  <div class="collection-layout" :style="{ '--collection-bg': `url(${collectionBg})` }">

    <!-- ── Left: hero grid ─────────────────────────────── -->
    <div class="collection-main">

      <!-- Filter bar -->
      <div class="filter-bar">
        <input v-model="store.searchText" class="search-input" placeholder="Search heroes..." type="search" />
        <select v-model="store.filterRarity"   class="filter-select"><option value="">All Rarities</option>  <option v-for="r in store.RARITIES"   :key="r" :value="r">{{ r }}</option></select>
        <select v-model="store.filterFaction"  class="filter-select"><option value="">All Factions</option>  <option v-for="f in store.FACTIONS"   :key="f" :value="f">{{ f }}</option></select>
        <select v-model="store.filterAffinity" class="filter-select"><option value="">All Affinities</option><option v-for="a in store.AFFINITIES" :key="a" :value="a">{{ a }}</option></select>
        <div class="sort-toggle">
          <button class="sort-btn" :class="{ active: store.sortBy === 'rarity' }" @click="store.sortBy = 'rarity'">Rarity</button>
          <button class="sort-btn" :class="{ active: store.sortBy === 'bp' }"     @click="store.sortBy = 'bp'">⚡ BP</button>
        </div>
      </div>

      <!-- Progression units -->
      <template v-if="progressionRoster.length">
        <div class="collection-divider">
          <span class="divider-label">✦ Soul Bound</span>
          <span class="divider-sub">Heroes bound to your progression — their power scales with your level</span>
        </div>
        <div class="hero-grid" style="margin-bottom: 28px;">
          <div
            v-for="{ key, hero } in progressionRoster"
            :key="key"
            class="roster-card"
            :class="[`rarity-${effectiveRarity(hero, key).toLowerCase()}`, `affinity-${hero.affinity.toLowerCase()}`, `hero-${hero.id}`, { selected: store.isInTeam(key) }]"
          >
            <div class="card-portrait" @click="store.openDetail(key)">
              <img v-if="getPortrait(hero)" :src="getPortrait(hero)" class="portrait-img" alt="" />
              <div class="portrait-fade" />
              <span class="rarity-tag" :class="effectiveRarity(hero, key).toLowerCase()">{{ effectiveRarity(hero, key) }}</span>
              <span class="affinity-tag" :class="hero.affinity.toLowerCase()">{{ hero.affinity }}</span>
              <span class="level-tag" v-if="hero.isPlayerCharacter || inventory.isProgressive(key)">Lv.{{ effectiveLevel(hero) }}</span>
              <span v-else-if="hero.role" class="role-tag" :class="hero.role">{{ hero.role }}</span>
              <div class="selected-badge" v-if="store.isInTeam(key)">#{{ store.team.indexOf(key) + 1 }}</div>
            </div>
            <div class="card-info" @click="store.openDetail(key)">
              <div class="card-name">{{ hero.name }}<svg class="name-magnify" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.4"/><line x1="9.7" y1="9.7" x2="13.5" y2="13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></div>
              <div class="card-faction">{{ hero.faction }}</div>
              <div class="card-stars" v-if="store.getStars(key) > 0">
                <img v-for="i in 6" :key="i" :src="starImg" class="cstar" :class="{ filled: i <= store.getStars(key) }" alt="" />
              </div>
              <div class="card-stats">
                <span title="HP">❤ {{ (hero.baseHp / 1000).toFixed(1) }}k</span>
                <span title="ATK">⚔ {{ hero.baseAtk }}</span>
                <span title="DEF">🛡 {{ hero.baseDef }}</span>
                <span title="SPD">⚡ {{ hero.baseSpd }}</span>
              </div>
            </div>
            <div class="card-footer">
              <div class="skill-pips"><span v-for="skill in hero.skills" :key="skill.id" class="skill-pip" :title="skill.name">{{ skill.name.split(' ')[0] }}</span></div>
              <span class="card-cp" title="Combat Power">⚡ {{ formatCP(inventory.heroCP(key)) }}</span>
              <button class="team-btn" :class="{ 'in-team': store.isInTeam(key) }" :disabled="!store.isInTeam(key) && store.isFull" @click.stop="store.toggleTeam(key)" :title="store.isInTeam(key) ? 'Remove from team' : 'Add to team'">{{ store.isInTeam(key) ? '✓' : '+' }}</button>
            </div>
            <span class="soul-bound-chip" v-if="inventory.isProgressive(key)">✦ Soul Bound</span>
            <div class="foil-layer" />
          </div>
        </div>
        <div class="collection-divider" v-if="regularRoster.length">
          <span class="divider-label">Champions</span>
          <span class="divider-sub">Your full roster</span>
        </div>
      </template>

      <!-- Hero grid -->
      <div class="hero-grid" v-if="regularRoster.length">
        <div
          v-for="{ key, hero } in regularRoster"
          :key="key"
          class="roster-card"
          :class="[`rarity-${hero.rarity.toLowerCase()}`, `affinity-${hero.affinity.toLowerCase()}`, `hero-${hero.id}`, { selected: store.isInTeam(key) }]"
        >
          <!-- Portrait -->
          <div class="card-portrait" @click="store.openDetail(key)">
            <img v-if="getPortrait(hero)" :src="getPortrait(hero)" class="portrait-img" alt="" />
            <div class="portrait-fade" />
            <span class="rarity-tag" :class="hero.rarity.toLowerCase()">{{ hero.rarity }}</span>
            <span class="affinity-tag" :class="hero.affinity.toLowerCase()">{{ hero.affinity }}</span>
            <span class="level-tag" v-if="hero.isPlayerCharacter || inventory.isProgressive(key)">Lv.{{ effectiveLevel(hero) }}</span>
            <span v-else-if="hero.role" class="role-tag" :class="hero.role">{{ hero.role }}</span>
            <div class="selected-badge" v-if="store.isInTeam(key)">#{{ store.team.indexOf(key) + 1 }}</div>
          </div>

          <!-- Info -->
          <div class="card-info" @click="store.openDetail(key)">
            <div class="card-name">
              {{ hero.name }}
              <svg class="name-magnify" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" stroke-width="1.4"/>
                <line x1="9.7" y1="9.7" x2="13.5" y2="13.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="card-faction">{{ hero.faction }}</div>
            <div class="card-stats">
              <span title="HP">❤ {{ (hero.baseHp / 1000).toFixed(1) }}k</span>
              <span title="ATK">⚔ {{ hero.baseAtk }}</span>
              <span title="DEF">🛡 {{ hero.baseDef }}</span>
              <span title="SPD">⚡ {{ hero.baseSpd }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <div class="skill-pips">
              <span v-for="skill in hero.skills" :key="skill.id" class="skill-pip" :title="skill.name">{{ skill.name.split(' ')[0] }}</span>
            </div>
            <span class="card-cp" title="Combat Power">⚡ {{ formatCP(inventory.heroCP(key)) }}</span>
            <button
              class="team-btn"
              :class="{ 'in-team': store.isInTeam(key) }"
              :disabled="!store.isInTeam(key) && store.isFull"
              @click.stop="store.toggleTeam(key)"
              :title="store.isInTeam(key) ? 'Remove from team' : 'Add to team'"
            >{{ store.isInTeam(key) ? '✓' : '+' }}</button>
          </div>

          <!-- Soul-bound indicator -->
          <span class="soul-bound-chip" v-if="inventory.isProgressive(key)">✦ Soul Bound</span>

          <!-- Foil shimmer — shown only for .rarity-ancient via CSS -->
          <div class="foil-layer" />
        </div>
      </div>

      <div class="empty-state" v-if="!progressionRoster.length && !regularRoster.length">No heroes match your filters.</div>
    </div>

    <!-- ── Right: team panel ───────────────────────────── -->
    <aside class="team-panel">
      <h3 class="panel-title">
        Your Team
        <span class="team-count">{{ store.team.length }}/{{ store.MAX_TEAM_SIZE }}</span>
      </h3>

      <div class="team-slots">
        <div v-for="(entry, i) in teamSlots" :key="i" class="team-slot" :class="{ filled: !!entry }">
          <template v-if="entry">
            <div class="slot-info" @click="store.openDetail(entry.key)">
              <span class="slot-rarity" :class="effectiveRarity(entry.hero, entry.key).toLowerCase()">●</span>
              <div class="slot-text">
                <span class="slot-name">{{ entry.hero.name }}</span>
                <span class="slot-faction">{{ entry.hero.faction }}</span>
              </div>
            </div>
            <div class="slot-actions">
              <button class="slot-btn" @click="store.moveUp(i)"   :disabled="i === 0"                         title="Move up">↑</button>
              <button class="slot-btn" @click="store.moveDown(i)" :disabled="i === store.team.length - 1"     title="Move down">↓</button>
              <button class="slot-btn remove" @click="store.removeFromTeam(entry.key)"                        title="Remove">✕</button>
            </div>
          </template>
          <span class="slot-empty" v-else>Slot {{ i + 1 }}</span>
        </div>
      </div>

      <!-- Bond indicators -->
      <div v-if="activeBonds.length" class="bond-list">
        <div v-for="bond in activeBonds" :key="bond.id" class="bond-badge">
          <span class="bond-icon">⚔</span>
          <div class="bond-text">
            <span class="bond-name">{{ bond.name }}</span>
            <span class="bond-desc">{{ bond.description }}</span>
          </div>
        </div>
      </div>

      <div class="team-hint">
        {{ store.isReady ? 'Go to Campaign to start a battle.' : 'Select at least 1 hero to battle.' }}
      </div>
    </aside>
  </div>

  <HeroDetailModal v-if="store.detailEntry" />
</template>

<script setup>
import { computed } from 'vue'
const emit = defineEmits(['back'])
import collectionBg from '../assets/backgrounds/collection_bg.png'
import starImg from '../assets/ui/star.png'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { usePlayerHeroStore, RARITY_FLOOR_LEVEL } from '../stores/usePlayerHeroStore.js'
import { formatCP } from '../game/cp.js'
import HeroDetailModal from './HeroDetailModal.vue'
import { getPortrait as _getHeroPortrait } from '../game/portraits.js'
import { BONDS } from '../game/data/bonds.js'
const _avatarModules = import.meta.glob('../assets/units/avatar_*.png', { eager: true })

const PLAYER_AVATARS = Object.fromEntries(
  Object.entries(_avatarModules).map(([path, mod]) => {
    const id = path.match(/avatar_\d+/)?.[0]
    return [id, mod.default]
  }).filter(([id]) => id)
)

function getPortrait(hero) {
  if (hero.id === 'player_character') return PLAYER_AVATARS[hero.avatarId] ?? null
  return _getHeroPortrait(hero)
}

const store      = useCollectionStore()
const inventory  = useInventoryStore()
const playerHero = usePlayerHeroStore()

function effectiveRarity(hero, key = null) {
  if (hero.id === 'player_character') return playerHero.rarity
  if (key && inventory.isProgressive(key)) {
    const floor = RARITY_FLOOR_LEVEL[hero.rarity] ?? 1
    const level = Math.max(playerHero.level, floor)
    if (level >= 101) return 'Mythical'
    if (level >= 61)  return 'Legendary'
    if (level >= 26)  return 'Epic'
    return 'Rare'
  }
  return hero.rarity
}

function effectiveLevel(hero) {
  const floor = RARITY_FLOOR_LEVEL[hero.rarity] ?? 1
  return Math.max(playerHero.level, floor)
}

const progressionRoster = computed(() => store.filteredRoster.filter(({ key, hero }) => hero.isPlayerCharacter || inventory.isProgressive(key)))
const regularRoster     = computed(() => store.filteredRoster.filter(({ key, hero }) => !hero.isPlayerCharacter && !inventory.isProgressive(key)))

const teamSlots = computed(() => {
  const slots = Array(store.MAX_TEAM_SIZE).fill(null)
  store.teamEntries.forEach((entry, i) => { slots[i] = entry })
  return slots
})

const activeBonds = computed(() =>
  BONDS.filter(bond => bond.keys.every(k => store.team.includes(k)))
)
</script>

<style scoped>
.collection-layout {
  display: grid;
  grid-template-columns: 1fr 290px;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  align-items: start;
  position: relative;
}
.collection-layout::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: var(--collection-bg);
  background-size: cover;
  background-position: center center;
  opacity: 0.07;
  pointer-events: none;
  z-index: 0;
}
.collection-layout > * { position: relative; z-index: 1; }
@media (max-width: 760px) {
  .collection-layout { grid-template-columns: 1fr; }
}

/* ── Filter bar ──────────────────────────────────────── */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 18px;
  align-items: center;
}
.back-btn {
  background: var(--bg-panel);
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 7px 12px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.back-btn:hover { color: var(--gold); border-color: var(--border-gold); }
.search-input, .filter-select {
  background: var(--bg-panel);
  border: 1px solid var(--border-gold);
  border-radius: 4px;
  color: var(--text-parchment);
  padding: 7px 12px;
  font-size: 0.75rem;
  font-family: var(--font-head);
  letter-spacing: 0.5px;
  outline: none;
  transition: border-color 0.15s;
}
.search-input { flex: 1; min-width: 140px; }
.search-input:focus, .filter-select:focus { border-color: var(--gold); }

.sort-toggle {
  display: flex;
  border: 1px solid var(--border-gold);
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}
.sort-btn {
  background: var(--bg-panel);
  border: none;
  color: var(--text-muted);
  padding: 7px 12px;
  font-size: 0.72rem;
  font-family: var(--font-head);
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.sort-btn + .sort-btn { border-left: 1px solid var(--border-brown); }
.sort-btn:hover  { background: #1a0d06; color: #ccc; }
.sort-btn.active { background: #1a1200; color: var(--gold); font-weight: 700; }
.search-input::placeholder { color: var(--text-dim); }
.filter-select option { background: var(--bg-panel); color: var(--text-parchment); }

/* ── Section dividers ────────────────────────────────── */
.collection-divider {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-brown);
}
.divider-label {
  font-family: var(--font-head);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #aa77ff;
}
.divider-sub {
  font-size: 0.6rem;
  color: var(--text-dim);
  font-style: italic;
}

/* ── Hero grid ───────────────────────────────────────── */
.hero-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(168px, 1fr));
  gap: 14px;
}

/* ── Card ────────────────────────────────────────────── */
.roster-card {
  background: linear-gradient(180deg, #1e1308 0%, #140d06 100%);
  border: 1px solid var(--border-gold);
  border-radius: 0;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: visible;
  transition: transform 0.15s, box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 2px 14px rgba(0,0,0,0.55);
}
.roster-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.65);
}

/* Inner border line */
.roster-card::before {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(90, 50, 10, 0.30);
  pointer-events: none;
  z-index: 5;
}

/* Corner diamond ornaments via ::after on a wrapper — use 4 pseudo spans */
.roster-card .corner { display: none; }

/* We place 4 absolute corner diamonds using a single repeating trick */
.roster-card::after {
  content: '◆';
  position: absolute;
  top: -5px; left: -5px;
  font-size: 9px;
  color: var(--border-gold);
  line-height: 1;
  pointer-events: none;
  z-index: 10;
  transition: color 0.2s;
}

/* The other 3 corners are handled by the card-portrait and card-footer pseudo-elements */
.card-portrait::before {
  content: '◆';
  position: absolute;
  top: -5px; right: -5px;
  font-size: 9px;
  color: var(--border-gold);
  line-height: 1;
  pointer-events: none;
  z-index: 10;
  transition: color 0.2s;
}
.card-footer::before {
  content: '◆';
  position: absolute;
  bottom: -5px; left: -5px;
  font-size: 9px;
  color: var(--border-gold);
  line-height: 1;
  pointer-events: none;
  z-index: 10;
  transition: color 0.2s;
}
.card-footer::after {
  content: '◆';
  position: absolute;
  bottom: -5px; right: -5px;
  font-size: 9px;
  color: var(--border-gold);
  line-height: 1;
  pointer-events: none;
  z-index: 10;
  transition: color 0.2s;
}

.roster-card:hover::after,
.roster-card:hover .card-portrait::before,
.roster-card:hover .card-footer::before,
.roster-card:hover .card-footer::after { color: var(--gold); }

/* Rarity border tints */
.roster-card.rarity-mythical {
  border-color: #9933cc;
  animation: mythical-pulse 3s ease-in-out infinite;
}
.roster-card.rarity-mythical::before {
  border-color: rgba(200, 80, 255, 0.20);
  animation: mythical-inner 3s ease-in-out infinite;
}
.roster-card.rarity-mythical::after,
.roster-card.rarity-mythical .card-portrait::before,
.roster-card.rarity-mythical .card-footer::before,
.roster-card.rarity-mythical .card-footer::after { color: #c050ff; }
.roster-card.rarity-mythical:hover::after,
.roster-card.rarity-mythical:hover .card-portrait::before,
.roster-card.rarity-mythical:hover .card-footer::before,
.roster-card.rarity-mythical:hover .card-footer::after { color: #ff2244; }

.roster-card.rarity-legendary { border-color: #8a6418; }
.roster-card.rarity-legendary::after,
.roster-card.rarity-legendary .card-portrait::before,
.roster-card.rarity-legendary .card-footer::before,
.roster-card.rarity-legendary .card-footer::after { color: #8a6418; }
.roster-card.rarity-legendary:hover { border-color: #a87c28; }

.roster-card.rarity-epic      { border-color: #6a2890; }
.roster-card.rarity-epic::after,
.roster-card.rarity-epic .card-portrait::before,
.roster-card.rarity-epic .card-footer::before,
.roster-card.rarity-epic .card-footer::after { color: #6a2890; }

.roster-card.rarity-rare      { border-color: #1a50a0; }
.roster-card.rarity-rare::after,
.roster-card.rarity-rare .card-portrait::before,
.roster-card.rarity-rare .card-footer::before,
.roster-card.rarity-rare .card-footer::after { color: #1a50a0; }

.roster-card.rarity-uncommon  { border-color: #186838; }
.roster-card.rarity-uncommon::after,
.roster-card.rarity-uncommon .card-portrait::before,
.roster-card.rarity-uncommon .card-footer::before,
.roster-card.rarity-uncommon .card-footer::after { color: #186838; }

.roster-card.rarity-common    { border-color: #383030; }

.roster-card.selected {
  border-color: var(--gold-bright) !important;
  box-shadow: 0 2px 14px rgba(0,0,0,0.55), inset 0 0 12px rgba(201,162,39,0.08);
}
.roster-card.selected::after,
.roster-card.selected .card-portrait::before,
.roster-card.selected .card-footer::before,
.roster-card.selected .card-footer::after { color: var(--gold-bright) !important; }

/* ── Portrait ────────────────────────────────────────── */
.card-portrait {
  position: relative;
  height: 144px;
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  background: #0a0704;
  display: flex;
  align-items: center;
  justify-content: center;
  /* clip the image within the card border */
  clip-path: inset(0);
}

/* Portrait image fills the card area */
.portrait-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
}

/* Bottom fade — blends portrait into card body */
.portrait-fade {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 44px;
  background: linear-gradient(0deg, #140d06 0%, transparent 100%);
  pointer-events: none;
  z-index: 2;
}

/* Rarity badge — top left, hidden until hover */
.rarity-tag {
  position: absolute;
  top: 8px; left: 8px;
  z-index: 3;
  font-family: var(--font-head);
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  border: 1px solid currentColor;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(2px);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.card-portrait:hover .rarity-tag {
  opacity: 1;
  transform: translateY(0);
}
.rarity-tag.mythical  { color: #ff2244; }
.rarity-tag.legendary { color: var(--gold-bright); }
.rarity-tag.epic      { color: #c070ff; }
.rarity-tag.rare      { color: #60b0ff; }
.rarity-tag.uncommon  { color: #50ff90; }
.rarity-tag.common    { color: #888; }

/* Affinity tag — top right area (small) */
.affinity-tag {
  position: absolute;
  top: 8px; right: 8px;
  z-index: 3;
  font-size: 0.52rem;
  font-family: var(--font-head);
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 5px;
  border-radius: 3px;
  background: rgba(0,0,0,0.55);
}
.affinity-tag.force   { color: #ff8c42; }
.affinity-tag.magic   { color: #60b0ff; }
.affinity-tag.spirit  { color: #50ff90; }
.affinity-tag.void    { color: #c070ff; }

/* Level tag — bottom left (player character only) */
.level-tag {
  position: absolute;
  bottom: 10px; left: 8px;
  z-index: 3;
  font-size: 0.52rem;
  font-family: var(--font-head);
  font-weight: 700;
  letter-spacing: 1px;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(0,0,0,0.65);
  color: #aaff44;
  border: 1px solid #aaff4466;
}

/* Role tag — bottom left (regular heroes) */
.role-tag {
  position: absolute;
  bottom: 10px; left: 8px;
  z-index: 3;
  font-size: 0.50rem;
  font-family: var(--font-head);
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 3px;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(2px);
  border: 1px solid currentColor;
}
.role-tag.warrior  { color: #e08840; }
.role-tag.tank     { color: #6090c8; }
.role-tag.mage     { color: #a060d0; }
.role-tag.healer   { color: #40cc80; }
.role-tag.ranger   { color: #88bb44; }
.role-tag.debuffer { color: #c08044; }

/* Team slot badge */
.selected-badge {
  position: absolute;
  bottom: 10px; right: 8px;
  z-index: 3;
  background: var(--gold-bright);
  color: #000;
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 3px;
}

/* ── Card info ───────────────────────────────────────── */
.card-info {
  padding: 8px 10px 4px;
  cursor: pointer;
  flex: 1;
}
.card-info:hover .card-name { color: #fff; }

.card-name {
  font-family: var(--font-head);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-parchment);
  line-height: 1.2;
  margin-bottom: 1px;
  transition: color 0.15s;
  display: flex;
  align-items: center;
  gap: 4px;
}
.name-magnify {
  width: 11px;
  height: 11px;
  color: #444;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
}
.card-info:hover .name-magnify {
  opacity: 1;
  color: #888;
}
.card-faction {
  font-size: 0.6rem;
  color: var(--text-muted);
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}
.card-stars { display: flex; gap: 2px; margin-bottom: 4px; }
.cstar { width: 12px; height: 12px; object-fit: contain; opacity: 0.18; }
.cstar.filled { opacity: 1; filter: drop-shadow(0 0 2px #ffd70066); }
.card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2px 6px;
  font-size: 0.62rem;
  color: var(--text-muted);
}
.card-stats span { white-space: nowrap; }

/* ── Card footer ─────────────────────────────────────── */
.card-footer {
  position: relative;
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-top: 1px solid var(--border-brown);
  gap: 6px;
  margin-top: auto;
}
.skill-pips { display: flex; gap: 3px; flex: 1; flex-wrap: wrap; align-items: center; }
.skill-pip {
  font-size: 0.50rem;
  padding: 1px 4px;
  border-radius: 3px;
  background: rgba(90, 50, 10, 0.4);
  border: 1px solid var(--gold-dim);
  color: #a07838;
  white-space: nowrap;
  overflow: hidden;
  max-width: 48px;
  text-overflow: ellipsis;
  line-height: 1.3;
}
.card-cp {
  font-size: 0.58rem;
  color: var(--gold-dim);
  font-weight: 700;
  white-space: nowrap;
}

/* Team toggle */
.team-btn {
  width: 24px; height: 24px;
  border-radius: 4px;
  border: 1px solid var(--border-gold);
  background: var(--bg-panel);
  color: var(--text-muted);
  font-size: 0.88rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
  flex-shrink: 0;
}
.team-btn:not(:disabled):hover { border-color: var(--gold); color: var(--gold); }
.team-btn.in-team { background: var(--gold-bright); border-color: var(--gold-bright); color: #000; font-weight: 900; }
.team-btn:disabled { opacity: 0.18; cursor: not-allowed; }

.empty-state {
  color: var(--text-dim);
  text-align: center;
  padding: 60px 0;
  font-family: var(--font-head);
  font-size: 0.85rem;
  letter-spacing: 1px;
}

/* ── Team panel ──────────────────────────────────────── */
.team-panel {
  background: linear-gradient(180deg, #1a1108 0%, #120c06 100%);
  border: 1px solid var(--border-gold);
  border-radius: 8px;
  padding: 18px;
  position: sticky;
  top: 20px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.025);
  /* Inner frame */
  outline: 1px solid var(--gold-faint);
  outline-offset: -5px;
}

.panel-title {
  font-family: var(--font-head);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gold);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 0 0 8px rgba(201,162,39,0.3);
}
.team-count {
  font-size: 0.68rem;
  color: var(--text-muted);
  font-weight: 400;
}

.team-slots { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
.team-slot {
  background: var(--bg-deep);
  border: 1px solid var(--border-brown);
  border-radius: 5px;
  padding: 7px 10px;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  transition: border-color 0.15s;
}
.team-slot.filled { border-color: var(--border-gold); }

.slot-info { display: flex; align-items: center; gap: 7px; flex: 1; min-width: 0; cursor: pointer; }
.slot-info:hover .slot-name { color: #fff; }
.slot-text { display: flex; flex-direction: column; min-width: 0; }

.slot-rarity { font-size: 0.7rem; flex-shrink: 0; }
.slot-rarity.legendary { color: var(--gold-bright); }
.slot-rarity.epic      { color: #b44fff; }
.slot-rarity.rare      { color: #4fa8ff; }
.slot-rarity.uncommon  { color: #4dff88; }
.slot-rarity.common    { color: #666; }

.slot-name    { font-family: var(--font-head); font-size: 0.72rem; font-weight: 600; color: var(--text-parchment); transition: color 0.15s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.slot-faction { font-size: 0.58rem; color: var(--text-muted); white-space: nowrap; }
.slot-empty   { font-size: 0.68rem; color: var(--text-dim); font-style: italic; font-family: var(--font-head); }

.slot-actions { display: flex; gap: 3px; flex-shrink: 0; }
.slot-btn {
  background: none;
  border: 1px solid var(--border-brown);
  border-radius: 3px;
  color: var(--text-dim);
  font-size: 0.65rem;
  width: 20px; height: 20px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s, border-color 0.15s;
}
.slot-btn:not(:disabled):hover         { color: var(--text-parchment); border-color: var(--border-gold); }
.slot-btn.remove:not(:disabled):hover  { color: #e74c3c; border-color: #e74c3c66; }
.slot-btn:disabled { opacity: 0.15; cursor: not-allowed; }

.team-hint {
  font-size: 0.68rem;
  color: var(--text-dim);
  text-align: center;
  padding: 10px 0 0;
  font-style: italic;
  font-family: var(--font-head);
  letter-spacing: 0.3px;
}

/* Companionship bonds */
.bond-list  { display: flex; flex-direction: column; gap: 6px; margin-top: 10px; }
.bond-badge {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: linear-gradient(135deg, #1a1000 0%, #2a1800 100%);
  border: 1px solid #c8860a;
  border-radius: 6px;
  padding: 8px 10px;
  animation: bond-appear 0.4s ease-out;
}
@keyframes bond-appear { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.bond-icon { font-size: 1rem; color: #f5c842; flex-shrink: 0; margin-top: 1px; }
.bond-text  { display: flex; flex-direction: column; gap: 2px; }
.bond-name  { font-size: 0.72rem; font-weight: 700; color: #f5c842; font-family: var(--font-head); letter-spacing: 0.5px; }
.bond-desc  { font-size: 0.62rem; color: #a08050; font-style: italic; line-height: 1.35; }

/* Aurelan — divine gold light override */
.roster-card.rarity-mythical.hero-aurelan {
  border-color: #a07820;
  animation: mythical-pulse-gold 3s ease-in-out infinite;
}
.roster-card.rarity-mythical.hero-aurelan::before {
  border-color: rgba(220, 180, 60, 0.20);
  animation: mythical-inner-gold 3s ease-in-out infinite;
}
.roster-card.rarity-mythical.hero-aurelan::after,
.roster-card.rarity-mythical.hero-aurelan .card-portrait::before,
.roster-card.rarity-mythical.hero-aurelan .card-footer::before,
.roster-card.rarity-mythical.hero-aurelan .card-footer::after { color: #c9a227; }
.roster-card.rarity-mythical.hero-aurelan:hover::after,
.roster-card.rarity-mythical.hero-aurelan:hover .card-portrait::before,
.roster-card.rarity-mythical.hero-aurelan:hover .card-footer::before,
.roster-card.rarity-mythical.hero-aurelan:hover .card-footer::after { color: #fff5aa; }

@keyframes mythical-pulse {
  0%, 100% {
    border-color: #9933cc;
    box-shadow: 0 0 10px rgba(180, 60, 220, 0.30), 0 2px 14px rgba(0,0,0,0.55);
  }
  50% {
    border-color: #ff2244;
    box-shadow: 0 0 28px rgba(255, 110, 247, 0.55), 0 0 55px rgba(200, 80, 255, 0.18), 0 2px 14px rgba(0,0,0,0.55);
  }
}
@keyframes mythical-inner {
  0%, 100% { border-color: rgba(180, 60, 220, 0.15); }
  50%       { border-color: rgba(255, 110, 247, 0.35); }
}

@keyframes mythical-pulse-gold {
  0%, 100% {
    border-color: #a07820;
    box-shadow: 0 0 10px rgba(201, 162, 39, 0.35), 0 2px 14px rgba(0,0,0,0.55);
  }
  50% {
    border-color: #fff5aa;
    box-shadow: 0 0 28px rgba(255, 240, 120, 0.60), 0 0 55px rgba(255, 215, 0, 0.22), 0 2px 14px rgba(0,0,0,0.55);
  }
}
@keyframes mythical-inner-gold {
  0%, 100% { border-color: rgba(201, 162, 39, 0.15); }
  50%       { border-color: rgba(255, 240, 120, 0.40); }
}

/* ── Ancient rarity — shared base ── */
.roster-card.rarity-ancient {
  overflow: hidden;
  animation: ancient-pulse 3.5s ease-in-out infinite;
}
.roster-card.rarity-ancient::before {
  animation: ancient-inner 3.5s ease-in-out infinite;
}

/* Blood ancient (Vaeric) */
.roster-card.rarity-ancient.affinity-blood {
  border-color: #5a0808;
}
.roster-card.rarity-ancient.affinity-blood::before { border-color: rgba(180, 20, 20, 0.35); }
.roster-card.rarity-ancient.affinity-blood::after,
.roster-card.rarity-ancient.affinity-blood .card-portrait::before,
.roster-card.rarity-ancient.affinity-blood .card-footer::after { color: #7a1010; }
.roster-card.rarity-ancient.affinity-blood:hover::after { color: #cc2020; }

@keyframes ancient-pulse {
  0%, 100% {
    border-color: #5a0808;
    box-shadow: 0 0 12px rgba(140, 10, 10, 0.65), 0 0 30px rgba(80, 0, 0, 0.35), 0 2px 14px rgba(0,0,0,0.7);
  }
  50% {
    border-color: #aa1515;
    box-shadow: 0 0 24px rgba(210, 20, 20, 0.90), 0 0 60px rgba(160, 5, 5, 0.55), 0 2px 14px rgba(0,0,0,0.7);
  }
}
@keyframes ancient-inner {
  0%, 100% { border-color: rgba(150, 15, 15, 0.25); }
  50%       { border-color: rgba(220, 25, 25, 0.55); }
}

/* Astral ancient */
.roster-card.rarity-ancient.affinity-astral {
  border-color: #580858;
  animation: ancient-pulse-astral 3.5s ease-in-out infinite;
}
.roster-card.rarity-ancient.affinity-astral::before {
  border-color: rgba(200, 20, 200, 0.35);
  animation: ancient-inner-astral 3.5s ease-in-out infinite;
}
.roster-card.rarity-ancient.affinity-astral::after,
.roster-card.rarity-ancient.affinity-astral .card-portrait::before,
.roster-card.rarity-ancient.affinity-astral .card-footer::after { color: #aa10aa; }
.roster-card.rarity-ancient.affinity-astral:hover::after { color: #ee22ee; }

@keyframes ancient-pulse-astral {
  0%, 100% {
    border-color: #580858;
    box-shadow: 0 0 12px rgba(180, 20, 180, 0.65), 0 0 30px rgba(100, 0, 100, 0.35), 0 2px 14px rgba(0,0,0,0.7);
  }
  50% {
    border-color: #cc15cc;
    box-shadow: 0 0 24px rgba(240, 30, 240, 0.90), 0 0 60px rgba(180, 0, 180, 0.55), 0 2px 14px rgba(0,0,0,0.7);
  }
}
@keyframes ancient-inner-astral {
  0%, 100% { border-color: rgba(180, 20, 180, 0.25); }
  50%       { border-color: rgba(240, 40, 240, 0.55); }
}

/* Foil shimmer — color-dodge gradient sweep */
.foil-layer { display: none; }
.roster-card.rarity-ancient .foil-layer {
  display: block;
  position: absolute;
  top: 0; right: 0; bottom: 0; left: 0;
  border-radius: 10px;
  opacity: 0.11;
  mix-blend-mode: color-dodge;
  background-position: 50% 50%;
  background-repeat: no-repeat;
  background-size: 300% 300%;
  animation: foilGradient 7s ease infinite;
  pointer-events: none;
  z-index: 6;
}

/* Blood foil — red/amber */
.roster-card.affinity-blood .foil-layer {
  background-image: linear-gradient(115deg, transparent, #cc0011 20%, #ff4400 40%, #cc0011 60%, #ff4400 80%, transparent);
}

/* Astral foil — pink/violet */
.roster-card.affinity-astral .foil-layer {
  background-image: linear-gradient(115deg, transparent, #ff00e7 20%, #aa00ff 40%, #ff00e7 60%, #aa00ff 80%, transparent);
}

@keyframes foilGradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Soul Vessel chip */
.soul-bound-chip {
  position: absolute;
  bottom: 44px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #aa77ff;
  background: rgba(20, 4, 40, 0.88);
  border: 1px solid #6622cc55;
  border-radius: 20px;
  padding: 2px 8px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 3;
}
</style>
