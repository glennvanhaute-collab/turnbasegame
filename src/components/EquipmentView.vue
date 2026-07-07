<template>
  <div class="equip-layout">

    <!-- ── Left: hero list ──────────────────────────────── -->
    <aside class="hero-list">
      <h3 class="panel-title">Heroes</h3>

      <!-- Filters -->
      <div class="list-filters">
        <input
          v-model="search"
          class="list-search"
          placeholder="Search…"
          type="search"
        />
        <select v-model="filterRarity" class="list-select">
          <option value="">All Rarities</option>
          <option v-for="r in RARITIES" :key="r" :value="r">{{ r }}</option>
        </select>
        <select v-model="filterFaction" class="list-select">
          <option value="">All Houses</option>
          <option v-for="f in FACTIONS" :key="f" :value="f">{{ f }}</option>
        </select>
        <select v-model="sortBy" class="list-select">
          <option value="default">Order: Team First</option>
          <option value="name">Order: Name</option>
          <option value="rarity">Order: Rarity</option>
          <option value="gear">Order: Gear</option>
        </select>
      </div>

      <button class="team-only-btn" :class="{ active: teamOnly }" @click="teamOnly = !teamOnly">
        ⚑ Team Only
      </button>

      <div class="list-count">{{ filteredRoster.length }} / {{ roster.length }}</div>

      <div class="hero-roster">
        <div
          v-for="{ key, hero } in filteredRoster"
          :key="key"
          class="hero-entry"
          :class="{ active: selectedKey === key, 'in-team': collection.team.includes(key) }"
          @click="selectedKey = key"
        >
          <div class="hero-avatar-wrap">
            <HeroAvatar :hero="hero" :size="44" :noBorder="true" />
            <span v-if="collection.team.includes(key)" class="team-slot-badge">
              {{ collection.team.indexOf(key) + 1 }}
            </span>
            <span class="gear-count-badge">{{ equippedCount(key) }}/5</span>
          </div>
          <span class="hero-entry-name">{{ hero.name }}</span>
          <span class="role-tag" :class="'role-' + hero.role">{{ ROLE_LABELS[hero.role] }}</span>
        </div>
      </div>
    </aside>

    <!-- ── Right: equipment panel ───────────────────────── -->
    <div class="equip-main" v-if="selectedKey" :key="selectedKey">
      <div class="equip-header">
        <h2 class="hero-name">{{ selectedHero.name }}</h2>
        <!-- Off-hand mode badge -->
        <div class="offhand-mode" :class="offhandMode">
          <span v-if="offhandMode === 'twohanded'">⚑ Two-Handed — off hand occupied</span>
          <span v-else-if="offhandMode === 'dual'">⚔⚔ Dual Wield — +15% ATK, +5% Crit Rate</span>
          <span v-else-if="offhandMode === 'board'">⚔🛡 Sword & Board — 12% Damage Reduction</span>
          <span v-else>Off hand: empty</span>
        </div>
        <!-- Gear toggle -->
        <button
          class="gear-toggle-btn"
          :class="{ 'gear-off': !inventory.isGearEnabled(selectedKey) }"
          @click="inventory.toggleGearEnabled(selectedKey)"
          :title="inventory.isGearEnabled(selectedKey) ? 'Gear active in battle — click to disable' : 'Gear disabled in battle — click to enable'"
        >
          {{ inventory.isGearEnabled(selectedKey) ? '⚔ Gear Active' : '⊘ Gear Disabled' }}
        </button>
        <button
          class="quick-equip-btn"
          @click="inventory.quickEquip(selectedKey)"
          title="Auto-equip the best unequipped item in each empty slot"
        >
          ⚡ Quick Equip
        </button>
        <button
          class="unequip-all-btn"
          :disabled="equippedCount(selectedKey) === 0"
          @click="unequipAll(selectedKey)"
          title="Remove all equipped items"
        >
          ✕ Unequip All
        </button>
      </div>

      <!-- Gear slots grid -->
      <div class="slots-grid" :class="{ 'slots-disabled': !inventory.isGearEnabled(selectedKey) }">
        <GearSlotCard
          v-for="slot in SLOTS"
          :key="slot"
          :slot-id="slot"
          :item="inventory.getEquippedItem(selectedKey, slot)"
          :heroKey="selectedKey"
          :blocked="false"
          @click="inventory.openPicker(selectedKey, slot)"
        />
      </div>

      <!-- Stat summary -->
      <div class="stat-summary">
        <h4 class="summary-title">Stats with gear</h4>
        <div class="stat-grid">
          <div class="stat-row" v-for="s in statSummary" :key="s.label">
            <span class="stat-label">{{ s.label }}</span>
            <span class="stat-base">{{ s.base }}</span>
            <span class="stat-arrow">→</span>
            <span class="stat-final" :class="s.changed ? 'improved' : ''">{{ s.final }}</span>
            <span class="stat-delta" v-if="s.changed">+{{ s.delta }}</span>
          </div>
        </div>
        <div class="set-bonus-section" v-if="setBonusSummary.length > 0">
          <div class="set-group" v-for="set in setBonusSummary" :key="set.type">
            <div class="set-header">
              <span class="set-name">{{ set.name }} Set</span>
              <span class="set-count">{{ set.count }} / 6</span>
            </div>
            <div
              v-for="tier in set.thresholds"
              :key="tier.t"
              class="set-tier"
              :class="{ active: tier.active }"
            >
              <span class="set-tier-mark">{{ tier.active ? '✓' : '○' }}</span>
              <span class="set-tier-label">{{ tier.t }}pc</span>
              <span class="set-tier-desc">
                <template v-if="tier.bonus">{{ formatSetBonus(tier.bonus) }}</template>
                <template v-if="tier.passive"> — {{ tier.passive.desc }}</template>
                <template v-if="!tier.bonus && !tier.passive">—</template>
              </span>
            </div>
          </div>
        </div>
        <div class="forge-affinity-note" v-if="forgeAffinities.length > 0">
          <span class="fa-label">⚒ Forge Affinity</span>
          <span class="fa-count" :class="forgeAffinityCount > 0 ? 'active' : 'inactive'">
            {{ forgeAffinityCount }} / 7 pieces
          </span>
          <span class="fa-bonus" v-if="forgeAffinityCount > 0">
            +{{ forgeAffinityCount * 6 }}% ATK &amp; DEF
          </span>
          <span class="fa-hint" v-else>equip Goblin or Dwarf forge gear to activate</span>
        </div>
      </div>
    </div>

    <div class="equip-empty" v-else>
      Select a hero to manage their gear.
    </div>
  </div>

  <GearPickerModal v-if="inventory.pendingSlot" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'
import { GearSlot, SLOT_LABELS } from '../game/Gear.js'
import { Rarity, Faction } from '../game/Hero.js'
import { SET_BONUSES, SET_PASSIVE_6, SET_NAMES } from '../game/data/setBonus.js'
import GearSlotCard from './GearSlotCard.vue'
import GearPickerModal from './GearPickerModal.vue'
import HeroAvatar from './HeroAvatar.vue'

const inventory = useInventoryStore()
const collection = useCollectionStore()
const playerHero = usePlayerHeroStore()

const SLOTS    = Object.values(GearSlot)
const RARITIES = Object.values(Rarity)

const ROLE_ICONS  = { warrior: '⚔', mage: '✦', healer: '✚', ranger: '⊕', tank: '⬡', debuffer: '✸' }
const ROLE_LABELS = { warrior: 'Warrior', mage: 'Mage', healer: 'Healer', ranger: 'Ranger', tank: 'Tank', debuffer: 'Debuffer' }
const FACTIONS = Object.values(Faction).filter(f =>
  collection.roster.some(({ hero }) => hero.faction === f)
)

const roster = computed(() => collection.roster)

// Filter / sort state
const search        = ref('')
const filterRarity  = ref('')
const filterFaction = ref('')
const sortBy        = ref('default')
const teamOnly      = ref(localStorage.getItem('equip-team-only') === 'true')
watch(teamOnly, v => localStorage.setItem('equip-team-only', v))

const RARITY_ORDER = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 }

const filteredRoster = computed(() => {
  let list = roster.value

  if (search.value)
    list = list.filter(({ hero }) => hero.name.toLowerCase().includes(search.value.toLowerCase()))
  if (teamOnly.value)
    list = list.filter(({ key }) => collection.team.includes(key))
  if (filterRarity.value)
    list = list.filter(({ hero }) => hero.rarity === filterRarity.value)
  if (filterFaction.value)
    list = list.filter(({ hero }) => hero.faction === filterFaction.value)

  // Team members always float to the top; secondary sort varies by mode
  const teamRank = key => collection.isInTeam(key) ? 0 : 1

  if (sortBy.value === 'name')
    list = [...list].sort((a, b) =>
      teamRank(a.key) - teamRank(b.key) || a.hero.name.localeCompare(b.hero.name))
  else if (sortBy.value === 'rarity')
    list = [...list].sort((a, b) =>
      teamRank(a.key) - teamRank(b.key) || RARITY_ORDER[b.hero.rarity] - RARITY_ORDER[a.hero.rarity])
  else if (sortBy.value === 'gear')
    list = [...list].sort((a, b) =>
      teamRank(a.key) - teamRank(b.key) || equippedCount(b.key) - equippedCount(a.key))
  else
    list = [...list].sort((a, b) =>
      teamRank(a.key) - teamRank(b.key) || inventory.heroCP(b.key) - inventory.heroCP(a.key))

  return list
})

const selectedKey  = ref(collection.ownedKeys[0])
const selectedHero = computed(() => roster.value.find(r => r.key === selectedKey.value)?.hero)

const offhandMode = computed(() => 'empty')

function equippedCount(key) {
  return SLOTS.filter(s => !!inventory.getEquippedItem(key, s)).length
}

function unequipAll(key) {
  for (const slot of SLOTS) {
    if (inventory.getEquippedItem(key, slot)) inventory.unequip(key, slot)
  }
}

function buildBaseHero(key) {
  if (key === 'PLAYER_CHARACTER') return playerHero.buildHeroInstance()
  return HERO_TEMPLATES[key]?.() ?? null
}

const forgeAffinityCount = computed(() =>
  inventory.computeGearStats(selectedKey.value).forgeAffinityCount ?? 0
)
const forgeAffinities = computed(() => {
  const hero = buildBaseHero(selectedKey.value)
  return hero?.forgeAffinities ?? []
})

const BONUS_STAT_LABELS = {
  hpPct: 'HP', defPct: 'DEF', atkPct: 'ATK', spdPct: 'SPD',
  critRate: 'Crit Rate', critDmg: 'Crit DMG',
}

function formatSetBonus(bonus) {
  return Object.entries(bonus)
    .map(([k, v]) => `+${Math.round(v * 100)}% ${BONUS_STAT_LABELS[k] ?? k}`)
    .join(', ')
}

const setBonusSummary = computed(() => {
  const { setPieces } = inventory.computeGearStats(selectedKey.value)
  if (!setPieces) return []
  return Object.entries(setPieces)
    .filter(([, count]) => count > 0)
    .map(([armorType, count]) => ({
      type: armorType,
      name: SET_NAMES[armorType] ?? armorType,
      count,
      thresholds: [2, 4, 6].map(t => ({
        t,
        active: count >= t,
        bonus:   SET_BONUSES[armorType]?.[t] ?? null,
        passive: t === 6 ? (SET_PASSIVE_6[armorType] ?? null) : null,
      })),
    }))
})

// Build stat comparison (base hero vs hero + gear)
const statSummary = computed(() => {
  const base = buildBaseHero(selectedKey.value)
  if (!base) return []
  const { stats, damageReduction } = inventory.computeGearStats(selectedKey.value)
  const boosted = buildBaseHero(selectedKey.value)
  boosted.applyGear(stats, damageReduction)

  return [
    { label: 'HP',       base: base.baseHp,                          final: boosted.baseHp,   delta: boosted.baseHp   - base.baseHp },
    { label: 'ATK',      base: base.baseAtk,                         final: boosted.baseAtk,  delta: boosted.baseAtk  - base.baseAtk },
    { label: 'DEF',      base: base.baseDef,                         final: boosted.baseDef,  delta: boosted.baseDef  - base.baseDef },
    { label: 'SPD',      base: base.baseSpd,                         final: boosted.baseSpd,  delta: boosted.baseSpd  - base.baseSpd },
    { label: 'Crit%',    base: pct(base.critRate),                   final: pct(boosted.critRate),  delta: pct(boosted.critRate - base.critRate) },
    { label: 'Crit DMG', base: pct(base.critDmg),                    final: pct(boosted.critDmg),   delta: pct(boosted.critDmg  - base.critDmg) },
  ].map(s => ({ ...s, changed: s.delta > 0 }))
})

const pct = v => Math.round(v * 100) + '%'
</script>

<style scoped>
.equip-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 20px;
  width: 100%;
  padding: 20px 20px 40px;
  align-items: start;
  box-sizing: border-box;
}
@media (max-width: 700px) {
  .equip-layout { grid-template-columns: 1fr; }
  .hero-list { position: static; max-height: 300px; overflow-y: auto; }
  .slots-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
}

/* Hero list */
.hero-list {
  background: #1a0d0a;
  border: 1px solid #3e1c0c;
  border-radius: 10px;
  padding: 14px;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
}
.hero-list::-webkit-scrollbar { width: 4px; }
.hero-list::-webkit-scrollbar-thumb { background: #3e1c0c; border-radius: 2px; }
.panel-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 8px; }

.list-filters { display: grid; grid-template-columns: 1fr 1fr; gap: 5px; margin-bottom: 6px; }
.list-filters .list-search { grid-column: 1 / -1; }
.list-search, .list-select {
  background: #221108;
  border: 1px solid #3e1c0c;
  border-radius: 5px;
  color: #ccc;
  font-size: 0.72rem;
  padding: 5px 7px;
  outline: none;
  width: 100%;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.list-search:focus, .list-select:focus { border-color: #ffd700; }
.team-only-btn {
  width: 100%; padding: 5px 10px; margin-bottom: 6px;
  border-radius: 6px; border: 1px solid rgba(255,215,0,0.2);
  background: transparent; color: #666;
  font-family: var(--font-head); font-size: 0.62rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1px;
  cursor: pointer; transition: all 0.15s; text-align: left;
}
.team-only-btn:hover { border-color: rgba(255,215,0,0.45); color: #aaa; }
.team-only-btn.active { background: rgba(255,215,0,0.08); border-color: rgba(255,215,0,0.55); color: var(--gold, #ffd700); }
.list-count { font-size: 0.62rem; color: #444; text-align: right; margin-bottom: 6px; }

.hero-roster {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px;
}
.hero-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 5px 7px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  border: 1px solid transparent;
  text-align: center;
  min-width: 0;
}
.hero-entry:hover         { background: #221108; }
.hero-entry.in-team       { background: rgba(255,215,0,0.04); border-color: rgba(255,215,0,0.18); }
.hero-entry.active        { background: #221108; border-color: #ffd700; }
.hero-avatar-wrap         { position: relative; flex-shrink: 0; }
.team-slot-badge {
  position: absolute; bottom: -2px; right: -2px;
  width: 15px; height: 15px; border-radius: 50%;
  background: var(--gold, #ffd700); color: #1a0a00;
  font-size: 0.52rem; font-weight: 900; font-family: var(--font-head);
  display: flex; align-items: center; justify-content: center;
  border: 1.5px solid #1a0a00; line-height: 1; pointer-events: none;
}
.gear-count-badge {
  position: absolute; top: -3px; left: -3px;
  font-size: 0.48rem; font-weight: 700; font-family: var(--font-head);
  background: #1a0d0a; color: #555;
  border: 1px solid #3e1c0c; border-radius: 4px;
  padding: 1px 4px; line-height: 1.2; pointer-events: none;
}
.hero-entry-name {
  font-size: 0.68rem; font-weight: 600; color: #ddd;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  width: 100%; text-align: center;
}
.role-tag {
  font-size: 0.55rem; font-weight: 700; font-family: var(--font-head);
  text-transform: uppercase; letter-spacing: 1px;
}
.role-warrior  { color: #e07840; }
.role-mage     { color: #a06aff; }
.role-healer   { color: #44cc88; }
.role-ranger   { color: #44bbcc; }
.role-tank     { color: #5599ff; }
.role-debuffer { color: #cc7788; }

/* Main panel */
.equip-main { display: flex; flex-direction: column; gap: 16px; }
.equip-header { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.hero-name { font-size: 1.2rem; color: #fff; font-weight: 700; }

.offhand-mode {
  font-size: 0.75rem;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
}
.offhand-mode.twohanded { background: #1a0a2e; color: #9966dd; border: 1px solid #7744bb; }
.offhand-mode.dual      { background: #3a1a00; color: #ff9944; border: 1px solid #ff9944; }
.offhand-mode.board     { background: #0a1a3a; color: #4fa8ff; border: 1px solid #4fa8ff; }
.offhand-mode.empty     { background: #1a1a2a; color: #444; border: 1px solid #2d2d4e; }

.gear-toggle-btn {
  margin-left: auto;
  font-size: 0.72rem; font-weight: 700;
  padding: 5px 14px; border-radius: 20px; border: 1px solid #4dff88;
  background: #0a2a0a; color: #4dff88;
  cursor: pointer; transition: opacity 0.15s, background 0.15s;
  white-space: nowrap;
}
.gear-toggle-btn:hover { opacity: 0.8; }
.gear-toggle-btn.gear-off { background: #2a1a1a; color: #ff6b6b; border-color: #ff6b6b; }
.quick-equip-btn {
  margin-left: 8px;
  font-size: 0.72rem; font-weight: 700;
  padding: 5px 14px; border-radius: 20px; border: 1px solid #c9a227;
  background: #1a140a; color: #c9a227;
  cursor: pointer; transition: opacity 0.15s;
  white-space: nowrap;
}
.quick-equip-btn:hover { opacity: 0.8; }
.unequip-all-btn {
  margin-left: 8px;
  font-size: 0.72rem; font-weight: 700;
  padding: 5px 14px; border-radius: 20px; border: 1px solid #888;
  background: #1a1a1a; color: #aaa;
  cursor: pointer; transition: opacity 0.15s;
  white-space: nowrap;
}
.unequip-all-btn:hover:not(:disabled) { border-color: #ff6b6b; color: #ff6b6b; background: #2a1a1a; }
.unequip-all-btn:disabled { opacity: 0.3; cursor: default; }

.slots-disabled { opacity: 0.4; pointer-events: none; }

/* Slots */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
}

/* Stat summary */
.stat-summary {
  background: #130908;
  border: 1px solid #3e1c0c;
  border-radius: 8px;
  padding: 14px 16px;
}
.summary-title { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 10px; }
.stat-grid { display: flex; flex-direction: column; gap: 5px; }
.stat-row  { display: grid; grid-template-columns: 70px 70px 16px 70px 1fr; align-items: center; gap: 6px; font-size: 0.75rem; }
.stat-label { color: #666; }
.stat-base  { color: #555; text-align: right; }
.stat-arrow { color: #333; text-align: center; }
.stat-final { color: #ccc; font-weight: 600; }
.stat-final.improved { color: #4dff88; }
.stat-delta { color: #4dff88; font-size: 0.65rem; }
.dr-note, .dw-note { margin-top: 8px; font-size: 0.72rem; color: #888; }
.forge-affinity-note {
  margin-top: 8px; display: flex; align-items: center; gap: 8px;
  font-size: 0.72rem; flex-wrap: wrap;
}
.set-bonus-section { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
.set-group { display: flex; flex-direction: column; gap: 3px; }
.set-header {
  display: flex; align-items: baseline; gap: 8px;
  padding-bottom: 3px; border-bottom: 1px solid rgba(255,255,255,0.05);
}
.set-name  { font-size: 0.68rem; font-weight: 700; color: #c9a227; letter-spacing: 0.5px; }
.set-count { font-size: 0.6rem; color: #555; margin-left: auto; }
.set-tier  { display: flex; align-items: baseline; gap: 6px; font-size: 0.65rem; color: #444; padding-left: 2px; }
.set-tier.active { color: #aaa; }
.set-tier-mark  { font-size: 0.6rem; width: 10px; flex-shrink: 0; }
.set-tier.active .set-tier-mark { color: #4dff88; }
.set-tier-label { font-weight: 700; width: 24px; flex-shrink: 0; }
.set-tier.active .set-tier-label { color: #c9a227; }
.set-tier-desc  { flex: 1; line-height: 1.4; }
.set-tier.active .set-tier-desc { color: #aaa; }

.fa-label  { color: #888; }
.fa-count.active   { color: #e07828; font-weight: 700; }
.fa-count.inactive { color: #444; }
.fa-bonus  { color: #e07828; font-weight: 700; }
.fa-hint   { color: #444; font-style: italic; }

.equip-empty { display: flex; align-items: center; justify-content: center; color: #333; font-style: italic; min-height: 200px; }
</style>
