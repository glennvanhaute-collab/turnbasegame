<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="inventory.closePicker()">
      <div class="modal">

        <!-- Header -->
        <div class="modal-header">
          <div>
            <div class="slot-label">{{ SLOT_LABELS[inventory.pendingSlot] }}</div>
            <div class="slot-hint" v-if="inventory.pendingSlot === GearSlot.OFF_HAND">
              Equip a <strong>weapon</strong> for dual wield (+15% ATK, +5% Crit) or a <strong>shield</strong> for defence (-12% damage taken)
            </div>
          </div>
          <button class="close-btn" @click="inventory.closePicker()">✕</button>
        </div>

        <!-- Filter bar -->
        <div class="filter-bar">
          <button
            v-for="r in RARITY_FILTERS"
            :key="r"
            class="rarity-pill"
            :class="[r.toLowerCase(), { active: filterRarity === r }]"
            @click="filterRarity = filterRarity === r ? '' : r"
          >{{ r === '' ? 'All' : r }}</button>
          <select v-if="availableTiers.length > 1" v-model="filterTier" class="tier-select">
            <option value="">All sets</option>
            <option v-for="t in availableTiers" :key="t" :value="t">{{ t.charAt(0).toUpperCase() + t.slice(1) }}</option>
          </select>
          <div class="armor-pills" v-if="availableArmorTypes.length > 1">
            <button
              v-for="a in availableArmorTypes"
              :key="a"
              class="armor-pill"
              :class="{ active: filterArmorType === a }"
              @click="filterArmorType = filterArmorType === a ? '' : a"
            >{{ a }}</button>
          </div>
          <div class="sort-toggle">
            <button
              v-for="s in SORT_OPTIONS"
              :key="s.key"
              class="sort-btn"
              :class="{ active: sortKey === s.key }"
              @click="sortKey = s.key"
            >{{ s.label }}</button>
          </div>
        </div>

        <!-- Currently equipped -->
        <div class="current-section" v-if="currentItem">
          <div class="section-label">Equipped</div>
          <GearItemRow :item="currentItem" :equipped="true" @unequip="doUnequip" />
        </div>

        <!-- Available grid -->
        <div class="modal-body">
          <div class="section-label" v-if="filtered.length">
            Available <span class="count">({{ filtered.length }})</span>
          </div>
          <div class="item-grid" v-if="filtered.length">
            <GearItemRow
              v-for="{ item, equippedOnName } in filtered"
              :key="item.instanceId"
              :item="item"
              :equipped="item.instanceId === currentId"
              :equipped-on-name="equippedOnName"
              @equip="doEquip(item.instanceId)"
            />
          </div>
          <div class="empty" v-else>
            {{ availableWithOwner.length ? 'No items match the filter.' : 'No compatible items in inventory.' }}
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { SLOT_LABELS, GearSlot } from '../game/Gear.js'
import GearItemRow from './GearItemRow.vue'

const inventory = useInventoryStore()

const heroKey = computed(() => inventory.focusedHeroKey)
const slot    = computed(() => inventory.pendingSlot)

const currentId   = computed(() => inventory.getLoadout(heroKey.value)?.[slot.value] ?? null)
const currentItem = computed(() => currentId.value ? inventory.instanceById(currentId.value) : null)

const RARITY_FILTERS = ['', 'Rare', 'Epic', 'Legendary', 'Mythical']
const SORT_OPTIONS   = [
  { key: 'rarity', label: 'Rarity' },
  { key: 'atk',   label: 'ATK' },
  { key: 'def',   label: 'DEF' },
  { key: 'hp',    label: 'HP' },
]
const RARITY_RANK = { Mythical: 0, Legendary: 1, Epic: 2, Rare: 3, Uncommon: 4, Common: 5 }

const filterRarity    = ref('')
const filterTier      = ref('')
const filterArmorType = ref('')
const sortKey         = ref('rarity')

const availableWithOwner = computed(() =>
  inventory.availableForSlot(heroKey.value, slot.value)
    .filter(item => {
      const owner = inventory.getEquippedBy(item.instanceId)
      return !owner || owner.heroKey === heroKey.value
    })
    .map(item => ({ item, equippedOnName: null }))
)

const availableTiers = computed(() => {
  const seen = new Set()
  for (const { item } of availableWithOwner.value) {
    if (item.tier) seen.add(item.tier)
  }
  return [...seen].sort()
})

const ARMOR_ORDER = ['plate', 'leather', 'cloth']
const availableArmorTypes = computed(() => {
  const seen = new Set()
  for (const { item } of availableWithOwner.value) {
    if (item.armorType) seen.add(item.armorType)
  }
  return ARMOR_ORDER.filter(t => seen.has(t))
})

function itemStat(item, key) {
  const base = item.stats?.[key] ?? 0
  const pct  = item.stats?.[key + 'Pct'] ?? 0
  return base + pct * 1000
}

const filtered = computed(() => {
  let list = availableWithOwner.value
  if (filterRarity.value)    list = list.filter(({ item }) => item.rarity    === filterRarity.value)
  if (filterTier.value)      list = list.filter(({ item }) => item.tier      === filterTier.value)
  if (filterArmorType.value) list = list.filter(({ item }) => item.armorType === filterArmorType.value)
  return [...list].sort((a, b) => {
    if (sortKey.value === 'rarity') {
      return (RARITY_RANK[a.item.rarity] ?? 9) - (RARITY_RANK[b.item.rarity] ?? 9)
    }
    return itemStat(b.item, sortKey.value) - itemStat(a.item, sortKey.value)
  })
})

function doEquip(instanceId) {
  inventory.equip(heroKey.value, slot.value, instanceId)
  inventory.closePicker()
}
function doUnequip() {
  inventory.unequip(heroKey.value, slot.value)
  inventory.closePicker()
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.78);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
  backdrop-filter: blur(2px);
}
.modal {
  background: #110806;
  border: 1px solid #5c2810;
  border-radius: 12px;
  width: min(620px, 96vw);
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.modal-header {
  padding: 14px 18px;
  border-bottom: 1px solid #1e0e07;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0;
}
.slot-label { font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 3px; }
.slot-hint  { font-size: 0.7rem; color: #777; max-width: 380px; line-height: 1.4; }
.slot-hint strong { color: var(--gold, #ffd700); }
.close-btn {
  background: none; border: none; color: #555;
  font-size: 1.1rem; cursor: pointer; flex-shrink: 0; line-height: 1;
}
.close-btn:hover { color: #bbb; }

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 18px;
  border-bottom: 1px solid #1a0a06;
  flex-shrink: 0;
  flex-wrap: wrap;
}
.rarity-pill {
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid #333;
  background: transparent;
  color: #555;
  font-size: 0.68rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.rarity-pill:first-child { color: #777; border-color: #333; }
.rarity-pill:first-child.active { background: #2a2a2a; color: #ccc; border-color: #555; }
.rarity-pill.rare   { color: #4fa8ff44; border-color: #4fa8ff22; }
.rarity-pill.epic   { color: #b44fff44; border-color: #b44fff22; }
.rarity-pill.legendary { color: #ffd70044; border-color: #ffd70022; }
.rarity-pill.mythical  { color: #ff6ef744; border-color: #ff6ef722; }
.rarity-pill.rare.active      { color: #4fa8ff; border-color: #4fa8ff; background: #0a1a3a; }
.rarity-pill.epic.active      { color: #b44fff; border-color: #b44fff; background: #1a0a2a; }
.rarity-pill.legendary.active { color: #ffd700; border-color: #ffd700; background: #2a1a00; }
.rarity-pill.mythical.active  { color: #ff6ef7; border-color: #ff6ef7; background: #2a0a2a; }

.armor-pills { display: flex; gap: 3px; }
.armor-pill {
  padding: 3px 9px;
  border-radius: 6px;
  border: 1px solid #2a1408;
  background: transparent;
  color: #555;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  text-transform: capitalize;
  transition: all 0.15s;
}
.armor-pill:hover { color: #999; border-color: #3e1c0c; }
.armor-pill.active { background: #3e1c0c; color: #ffd700; border-color: #7a3818; }

.tier-select {
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid #3e1c0c;
  background: #1a0a06;
  color: #aaa;
  font-size: 0.68rem;
  cursor: pointer;
  outline: none;
}
.tier-select:focus { border-color: #ffd700; color: #fff; }
.tier-select option { background: #1a0a06; }

.sort-toggle {
  margin-left: auto;
  display: flex;
  gap: 2px;
  background: #1a0a06;
  border-radius: 6px;
  padding: 2px;
}
.sort-btn {
  padding: 3px 8px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #555;
  font-size: 0.65rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}
.sort-btn.active { background: #3e1c0c; color: #ffd700; }
.sort-btn:not(.active):hover { color: #999; }

/* Currently equipped */
.current-section {
  padding: 8px 16px;
  background: #0e0605;
  border-bottom: 1px solid #1a0a06;
  flex-shrink: 0;
}

/* Body / grid */
.modal-body { padding: 10px 16px 14px; overflow-y: auto; flex: 1; }

.section-label {
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #3a3a3a;
  margin-bottom: 8px;
}
.count { color: #555; }

.item-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.empty { color: #3a3a3a; font-style: italic; font-size: 0.78rem; padding: 16px 0; text-align: center; }
</style>
