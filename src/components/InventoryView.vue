<template>
  <div class="inventory-wrap">

    <!-- Filter bar -->
    <div class="filter-bar">
      <div class="type-filters">
        <button
          v-for="t in typeFilters"
          :key="t.value"
          class="type-btn"
          :class="{ active: filterType === t.value }"
          @click="filterType = t.value"
        >
          {{ t.icon }} {{ t.label }}
        </button>
      </div>
      <div class="right-filters">
        <select v-model="filterRarity" class="filter-select">
          <option value="">All Rarities</option>
          <option v-for="r in RARITIES" :key="r" :value="r">{{ r }}</option>
        </select>
        <span class="item-count">{{ filtered.length }} / {{ inventory.ownedItems.length }} items</span>
      </div>
    </div>

    <!-- Grid -->
    <div class="item-grid" v-if="filtered.length">
      <InventoryCard
        v-for="item in filtered"
        :key="item.instanceId"
        :item="item"
        :equipped-by="inventory.getEquippedBy(item.instanceId)"
        @equip="openEquipMenu(item)"
        @unequip="doUnequip(item)"
      />
    </div>
    <div class="empty-state" v-else>No items match your filters.</div>
  </div>

  <!-- Equip-to picker -->
  <Teleport to="body">
    <div class="equip-backdrop" v-if="equipTarget" @click.self="equipTarget = null">
      <div class="equip-popover">
        <div class="popover-title">
          Equip <strong>{{ equipTarget.name }}</strong> to…
        </div>
        <div class="target-list">
          <button
            v-for="t in targets"
            :key="t.heroKey + t.slot"
            class="target-btn"
            :class="{ occupied: !!inventory.getEquippedItem(t.heroKey, t.slot) }"
            @click="doEquip(t.heroKey, t.slot)"
          >
            <span class="target-hero">{{ HERO_NAMES[t.heroKey] }}</span>
            <span class="target-slot">{{ SLOT_LABELS[t.slot] }}</span>
            <span class="target-current" v-if="inventory.getEquippedItem(t.heroKey, t.slot)">
              replaces {{ inventory.getEquippedItem(t.heroKey, t.slot).name }}
            </span>
            <span class="target-current empty" v-else>empty</span>
          </button>
        </div>
        <button class="cancel-btn" @click="equipTarget = null">Cancel</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { GearType, GearSlot, SLOT_LABELS } from '../game/Gear.js'
import { Rarity } from '../game/Hero.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'
import InventoryCard from './InventoryCard.vue'

const inventory = useInventoryStore()

const RARITIES = Object.values(Rarity)
const HERO_NAMES = Object.fromEntries(
  Object.entries(HERO_TEMPLATES)
    .filter(([, f]) => f().isPlayer)
    .map(([key, f]) => [key, f().name])
)

const typeFilters = [
  { value: '',                 icon: '▦',  label: 'All' },
  { value: GearType.WEAPON,   icon: '⚔',  label: 'Weapons' },
  { value: GearType.SHIELD,   icon: '🛡', label: 'Shields' },
  { value: GearType.HELMET,   icon: '⛑',  label: 'Helmets' },
  { value: GearType.ARMOR,    icon: '🥋', label: 'Armor' },
  { value: GearType.BOOTS,    icon: '👟', label: 'Boots' },
]

const filterType   = ref('')
const filterRarity = ref('')

const filtered = computed(() =>
  inventory.ownedItems.filter(item => {
    if (filterType.value   && item.gearType !== filterType.value)   return false
    if (filterRarity.value && item.rarity   !== filterRarity.value) return false
    return true
  })
)

// Equip flow
const equipTarget = ref(null)   // the GearItem being equipped
const targets     = computed(() =>
  equipTarget.value ? inventory.equipTargets(equipTarget.value.instanceId) : []
)

function openEquipMenu(item) { equipTarget.value = item }

function doEquip(heroKey, slot) {
  inventory.equip(heroKey, slot, equipTarget.value.instanceId)
  equipTarget.value = null
}

function doUnequip(item) {
  const eq = inventory.getEquippedBy(item.instanceId)
  if (eq) inventory.unequip(eq.heroKey, eq.slot)
}
</script>

<style scoped>
.inventory-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

/* Filter bar */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}
.type-filters { display: flex; flex-wrap: wrap; gap: 6px; }
.type-btn {
  background: #221108;
  border: 1px solid #3e1c0c;
  border-radius: 20px;
  color: #666;
  font-size: 0.75rem;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.type-btn:hover  { color: #ccc; border-color: #555; }
.type-btn.active { background: #351808; border-color: #ffd700; color: #ffd700; }

.right-filters { display: flex; align-items: center; gap: 10px; }
.filter-select {
  background: #221108;
  border: 1px solid #5c2810;
  border-radius: 6px;
  color: #ccc;
  padding: 6px 10px;
  font-size: 0.78rem;
  outline: none;
}
.item-count { font-size: 0.72rem; color: #444; white-space: nowrap; }

/* Grid */
.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 10px;
}
.empty-state { text-align: center; color: #444; padding: 60px 0; font-style: italic; }

/* Equip picker overlay */
.equip-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex; align-items: center; justify-content: center;
  z-index: 300;
  backdrop-filter: blur(2px);
}
.equip-popover {
  background: #1a0d0a;
  border: 1px solid #5c2810;
  border-radius: 10px;
  padding: 20px;
  width: min(460px, 94vw);
  max-height: 80vh;
  overflow-y: auto;
}
.popover-title { font-size: 0.9rem; color: #ccc; margin-bottom: 14px; }
.popover-title strong { color: #fff; }

.target-list { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.target-btn {
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  align-items: center;
  gap: 10px;
  background: #130908;
  border: 1px solid #3e1c0c;
  border-radius: 6px;
  padding: 9px 12px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
  color: #ccc;
}
.target-btn:hover       { border-color: #e94560; background: #1a0808; }
.target-btn.occupied    { border-color: #3a1a00; }
.target-btn.occupied:hover { border-color: #ff9944; }
.target-hero   { font-size: 0.8rem; font-weight: 600; color: #fff; }
.target-slot   { font-size: 0.7rem; color: #888; text-align: center; }
.target-current { font-size: 0.65rem; color: #555; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.target-current.empty { color: #3e1c0c; font-style: italic; }

.cancel-btn {
  background: #221108; border: 1px solid #5c2810; border-radius: 6px;
  color: #888; font-size: 0.78rem; padding: 7px 16px; cursor: pointer; width: 100%;
}
.cancel-btn:hover { color: #ccc; }
</style>
