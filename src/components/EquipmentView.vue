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

      <div class="list-count">{{ filteredRoster.length }} / {{ roster.length }}</div>

      <div
        v-for="{ key, hero } in filteredRoster"
        :key="key"
        class="hero-entry"
        :class="{ active: selectedKey === key }"
        @click="selectedKey = key"
      >
        <span class="hero-rarity" :class="hero.rarity.toLowerCase()">●</span>
        <div class="hero-entry-info">
          <span class="hero-entry-name">{{ hero.name }}</span>
          <span class="hero-entry-meta">{{ hero.faction }} · {{ hero.affinity }}</span>
        </div>
        <span class="gear-count" :title="equippedCount(key) + ' items equipped'">
          {{ equippedCount(key) }}/5
        </span>
      </div>
    </aside>

    <!-- ── Right: equipment panel ───────────────────────── -->
    <div class="equip-main" v-if="selectedKey" :key="selectedKey">
      <div class="equip-header">
        <h2 class="hero-name">{{ selectedHero.name }}</h2>
        <!-- Off-hand mode badge -->
        <div class="offhand-mode" :class="offhandMode">
          <span v-if="offhandMode === 'dual'">⚔⚔ Dual Wield — +15% ATK, +5% Crit Rate</span>
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
      </div>

      <!-- Gear slots grid -->
      <div class="slots-grid" :class="{ 'slots-disabled': !inventory.isGearEnabled(selectedKey) }">
        <GearSlotCard
          v-for="slot in SLOTS"
          :key="slot"
          :slot-id="slot"
          :item="inventory.getEquippedItem(selectedKey, slot)"
          :heroKey="selectedKey"
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
        <div class="dr-note" v-if="inventory.hasShield(selectedKey)">
          🛡 Passive: 12% of all incoming damage is blocked
        </div>
        <div class="dw-note" v-if="inventory.isDualWielding(selectedKey)">
          ⚔ Passive: Dual Wield bonus applied to ATK and Crit Rate above
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
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'
import { GearSlot, SLOT_LABELS } from '../game/Gear.js'
import { Rarity, Faction } from '../game/Hero.js'
import GearSlotCard from './GearSlotCard.vue'
import GearPickerModal from './GearPickerModal.vue'

const inventory = useInventoryStore()
const collection = useCollectionStore()
const playerHero = usePlayerHeroStore()

const SLOTS    = Object.values(GearSlot)
const RARITIES = Object.values(Rarity)
const FACTIONS = Object.values(Faction).filter(f =>
  collection.roster.some(({ hero }) => hero.faction === f)
)

const roster = computed(() => collection.roster)

// Filter / sort state
const search        = ref('')
const filterRarity  = ref('')
const filterFaction = ref('')
const sortBy        = ref('default')

const RARITY_ORDER = { Common: 0, Uncommon: 1, Rare: 2, Epic: 3, Legendary: 4 }

const filteredRoster = computed(() => {
  let list = roster.value

  if (search.value)
    list = list.filter(({ hero }) => hero.name.toLowerCase().includes(search.value.toLowerCase()))
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

const offhandMode = computed(() => {
  if (inventory.isDualWielding(selectedKey.value)) return 'dual'
  if (inventory.hasShield(selectedKey.value))      return 'board'
  return 'empty'
})

function equippedCount(key) {
  return SLOTS.filter(s => !!inventory.getEquippedItem(key, s)).length
}

function buildBaseHero(key) {
  if (key === 'PLAYER_CHARACTER') return playerHero.buildHeroInstance()
  return HERO_TEMPLATES[key]?.() ?? null
}

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
  grid-template-columns: 220px 1fr;
  gap: 20px;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 40px;
  align-items: start;
}
@media (max-width: 700px) { .equip-layout { grid-template-columns: 1fr; } }

/* Hero list */
.hero-list {
  background: #1a0d0a;
  border: 1px solid #3e1c0c;
  border-radius: 10px;
  padding: 14px;
  position: sticky;
  top: 20px;
}
.panel-title { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 8px; }

.list-filters { display: flex; flex-direction: column; gap: 5px; margin-bottom: 6px; }
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
}
.list-search:focus, .list-select:focus { border-color: #ffd700; }
.list-count { font-size: 0.62rem; color: #444; text-align: right; margin-bottom: 6px; }
.hero-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  border: 1px solid transparent;
}
.hero-entry:hover  { background: #221108; }
.hero-entry.active { background: #221108; border-color: #ffd700; }
.hero-rarity.legendary { color: #ffd700; }
.hero-rarity.epic      { color: #b44fff; }
.hero-rarity.rare      { color: #4fa8ff; }
.hero-rarity.uncommon  { color: #4dff88; }
.hero-rarity.common    { color: #888; }
.hero-entry-info { flex: 1; min-width: 0; }
.hero-entry-name { display: block; font-size: 0.8rem; font-weight: 600; color: #ddd; }
.hero-entry-meta { font-size: 0.65rem; color: #555; }
.gear-count { font-size: 0.65rem; color: #555; flex-shrink: 0; }

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
.offhand-mode.dual  { background: #3a1a00; color: #ff9944; border: 1px solid #ff9944; }
.offhand-mode.board { background: #0a1a3a; color: #4fa8ff; border: 1px solid #4fa8ff; }
.offhand-mode.empty { background: #1a1a2a; color: #444; border: 1px solid #2d2d4e; }

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

.slots-disabled { opacity: 0.4; pointer-events: none; }

/* Slots */
.slots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
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

.equip-empty { display: flex; align-items: center; justify-content: center; color: #333; font-style: italic; min-height: 200px; }
</style>
