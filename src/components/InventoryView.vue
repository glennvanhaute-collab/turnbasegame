<template>
  <div class="inventory-wrap">

    <!-- Top tabs -->
    <div class="inv-tabs">
      <button class="inv-tab" :class="{ active: activeTab === 'gear' }" @click="activeTab = 'gear'">
        ⚔ Gear
      </button>
      <button
        v-for="art in ARTISAN_LIST"
        :key="art.id"
        class="inv-tab"
        :class="{ active: activeTab === art.id }"
        :style="activeTab === art.id ? { color: art.color, borderBottomColor: art.color } : {}"
        @click="activeTab = art.id"
      >
        {{ art.icon }} {{ art.name }}
      </button>
    </div>

    <!-- ── GEAR TAB ───────────────────────────────────────────────── -->
    <template v-if="activeTab === 'gear'">
      <div class="filter-bar">
        <div class="type-filters">
          <button
            v-for="t in typeFilters"
            :key="t.value"
            class="type-btn"
            :class="{ active: filterType === t.value }"
            @click="filterType = t.value"
          >
            <GameIcon v-if="t.icon" :icon="t.icon" :size="14" />
            <span v-else>▦</span>
            {{ t.label }}
          </button>
        </div>
        <div class="right-filters">
          <select v-model="filterRarity" class="filter-select">
            <option value="">All Rarities</option>
            <option v-for="r in RARITIES" :key="r" :value="r">{{ r }}</option>
          </select>
          <span class="item-count">{{ filtered.length }} / {{ inventory.ownedItems.length }}</span>
        </div>
      </div>

      <div class="item-list" v-if="filtered.length">
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
    </template>

    <!-- ── BLACKSMITHING TAB ──────────────────────────────────────── -->
    <template v-else-if="activeTab === 'blacksmithing'">
      <div class="mat-sections">

        <div class="mat-section">
          <div class="mat-section-head">Ores</div>
          <div class="mat-grid">
            <div
              v-for="ore in ORE_LIST"
              :key="ore.id"
              class="mat-row"
              :class="{ empty: !resources.ores[ore.id] }"
              :style="{ '--mc': ore.color }"
            >
              <GameIcon :icon="oreIcon(ore.id)" :size="20" class="mat-icon" />
              <span class="mat-name">{{ ore.name }}</span>
              <span class="mat-qty">{{ resources.ores[ore.id] ?? 0 }}</span>
            </div>
          </div>
        </div>

        <div class="mat-section">
          <div class="mat-section-head">Bars</div>
          <div class="mat-grid">
            <div
              v-for="bar in BAR_LIST"
              :key="bar.id"
              class="mat-row"
              :class="{ empty: !resources.bars[bar.id] }"
              :style="{ '--mc': bar.color }"
            >
              <GameIcon :icon="barIcon(bar.id)" :size="20" class="mat-icon" />
              <span class="mat-name">{{ bar.name }}</span>
              <span class="mat-qty">{{ resources.bars[bar.id] ?? 0 }}</span>
            </div>
          </div>
        </div>

        <div class="mat-section">
          <div class="mat-section-head">Components</div>
          <div class="mat-grid">
            <div
              v-for="(comp, key) in UPGRADE_COMPONENTS"
              :key="key"
              class="mat-row"
              :class="{ empty: !resources.upgradeComponents[key] }"
              :style="{ '--mc': comp.color }"
            >
              <span class="mat-dot" />
              <span class="mat-name">{{ comp.name }}</span>
              <span class="mat-qty">{{ resources.upgradeComponents[key] ?? 0 }}</span>
            </div>
          </div>
        </div>

      </div>
    </template>

    <!-- ── LEATHERWORKING TAB ──────────────────────────────────────── -->
    <template v-else-if="activeTab === 'leatherworking'">
      <div class="mat-sections">
        <div class="mat-section">
          <div class="mat-section-head">Hides</div>
          <div class="mat-grid">
            <div v-for="hide in HIDE_LIST" :key="hide.id" class="mat-row"
                 :class="{ empty: !resources.hides[hide.id] }"
                 :style="{ '--mc': hide.color }">
              <GameIcon :icon="hideIcon(hide.id)" :size="20" class="mat-icon" />
              <span class="mat-name">{{ hide.name }}</span>
              <span class="mat-qty">{{ resources.hides[hide.id] ?? 0 }}</span>
            </div>
          </div>
        </div>
        <div class="mat-section">
          <div class="mat-section-head">Leather</div>
          <div class="mat-grid">
            <div v-for="leather in LEATHER_LIST" :key="leather.id" class="mat-row"
                 :class="{ empty: !resources.leathers[leather.id] }"
                 :style="{ '--mc': leather.color }">
              <GameIcon :icon="leatherIcon(leather.id)" :size="20" class="mat-icon" />
              <span class="mat-name">{{ leather.name }}</span>
              <span class="mat-qty">{{ resources.leathers[leather.id] ?? 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ── TAILORING TAB ─────────────────────────────────────────────── -->
    <template v-else-if="activeTab === 'tailoring'">
      <div class="mat-sections">
        <div class="mat-section">
          <div class="mat-section-head">Fibers</div>
          <div class="mat-grid">
            <div v-for="fiber in FIBER_LIST" :key="fiber.id" class="mat-row"
                 :class="{ empty: !resources.fibers[fiber.id] }"
                 :style="{ '--mc': fiber.color }">
              <GameIcon :icon="fiberIcon(fiber.id)" :size="20" class="mat-icon" />
              <span class="mat-name">{{ fiber.name }}</span>
              <span class="mat-qty">{{ resources.fibers[fiber.id] ?? 0 }}</span>
            </div>
          </div>
        </div>
        <div class="mat-section">
          <div class="mat-section-head">Cloth</div>
          <div class="mat-grid">
            <div v-for="cloth in CLOTH_LIST" :key="cloth.id" class="mat-row"
                 :class="{ empty: !resources.cloths[cloth.id] }"
                 :style="{ '--mc': cloth.color }">
              <GameIcon :icon="clothIcon(cloth.id)" :size="20" class="mat-icon" />
              <span class="mat-name">{{ cloth.name }}</span>
              <span class="mat-qty">{{ resources.cloths[cloth.id] ?? 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- ── OTHER ARTISAN TABS (stubs) ────────────────────────────── -->
    <template v-else>
      <div class="artisan-stub">
        <span class="stub-icon">{{ ARTISAN[activeTab]?.icon }}</span>
        <div class="stub-name">{{ ARTISAN[activeTab]?.name }}</div>
        <div class="stub-desc">{{ ARTISAN[activeTab]?.desc }}</div>
        <div class="stub-soon">Coming soon</div>
      </div>
    </template>

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
import { useInventoryStore }  from '../stores/useInventoryStore.js'
import { useResourceStore }   from '../stores/useResourceStore.js'
import { GearType, GearSlot, SLOT_LABELS } from '../game/Gear.js'
import { Rarity } from '../game/Hero.js'
import { HERO_TEMPLATES } from '../game/data/heroes.js'
import { ARTISAN, ARTISAN_LIST } from '../game/data/artisanSkills.js'
import { ORE_LIST } from '../game/data/ores.js'
import { BAR_LIST } from '../game/data/bars.js'
import { UPGRADE_COMPONENTS } from '../game/data/upgradeComponents.js'
import { HIDE_LIST } from '../game/data/hides.js'
import { LEATHER_LIST } from '../game/data/leathers.js'
import { FIBER_LIST } from '../game/data/fibers.js'
import { CLOTH_LIST } from '../game/data/cloths.js'
import { oreIcon, barIcon, hideIcon, leatherIcon, fiberIcon, clothIcon, SLOT_TO_ICON } from '../game/data/spritesheet.js'
import InventoryCard from './InventoryCard.vue'
import GameIcon from './ui/GameIcon.vue'

const inventory  = useInventoryStore()
const resources  = useResourceStore()

const activeTab  = ref('gear')

const RARITIES = Object.values(Rarity)
const HERO_NAMES = Object.fromEntries(
  Object.entries(HERO_TEMPLATES)
    .filter(([, f]) => f().isPlayer)
    .map(([key, f]) => [key, f().name])
)

const typeFilters = [
  { value: '',               icon: null,      label: 'All' },
  { value: GearType.WEAPON,  icon: 'sword',   label: 'Weapons' },
  { value: GearType.SHIELD,  icon: 'shield',  label: 'Shields' },
  { value: GearType.HELMET,  icon: 'helmet',  label: 'Helmets' },
  { value: GearType.ARMOR,   icon: 'chest',   label: 'Armor' },
  { value: GearType.LEGS,    icon: 'legs',    label: 'Legs' },
  { value: GearType.BOOTS,   icon: 'boots',   label: 'Boots' },
  { value: GearType.GLOVES,  icon: 'gloves',  label: 'Gloves' },
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

const equipTarget = ref(null)
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

/* ── Tabs ──────────────────────────────────────────────────────── */
.inv-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-bottom: 18px;
  border-bottom: 1px solid #2a1208;
}
.inv-tab {
  padding: 8px 14px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: #555;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.12s, border-bottom-color 0.12s;
  white-space: nowrap;
  margin-bottom: -1px;
}
.inv-tab:hover  { color: #aaa; }
.inv-tab.active { color: #ffd700; border-bottom-color: #ffd700; }

/* ── Gear: filter bar ──────────────────────────────────────────── */
.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 14px;
}
.type-filters { display: flex; flex-wrap: wrap; gap: 5px; }
.type-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #1a0a06;
  border: 1px solid #2a1208;
  border-radius: 16px;
  color: #555;
  font-size: 0.7rem;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.12s;
}
.type-btn:hover  { color: #bbb; border-color: #4a2010; }
.type-btn.active { background: #2a1408; border-color: #ffd700; color: #ffd700; }

.right-filters { display: flex; align-items: center; gap: 10px; }
.filter-select {
  background: #1a0a06;
  border: 1px solid #3a1808;
  border-radius: 6px;
  color: #aaa;
  padding: 5px 8px;
  font-size: 0.72rem;
  outline: none;
}
.item-count { font-size: 0.68rem; color: #444; white-space: nowrap; }

/* ── Gear: item list ───────────────────────────────────────────── */
.item-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 5px;
}
.empty-state { text-align: center; color: #444; padding: 60px 0; font-style: italic; }

/* ── Blacksmithing: materials ──────────────────────────────────── */
.mat-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.mat-section-head {
  font-size: 0.58rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #555;
  font-weight: 700;
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #1a0a04;
}
.mat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 4px;
}
.mat-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--mc) 18%, transparent);
  background: color-mix(in srgb, var(--mc) 5%, transparent);
  transition: background 0.1s;
}
.mat-row.empty { opacity: 0.28; filter: saturate(0.15); }
.mat-icon { flex-shrink: 0; }
.mat-row:not(.empty) .mat-icon { filter: drop-shadow(0 0 4px var(--mc)); }
.mat-dot {
  width: 9px; height: 9px; border-radius: 50%;
  background: var(--mc); box-shadow: 0 0 5px var(--mc);
  flex-shrink: 0;
}
.mat-name {
  flex: 1;
  font-size: 0.68rem;
  font-weight: 600;
  color: #ccc;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.mat-qty {
  font-family: var(--font-head);
  font-size: 0.85rem;
  font-weight: 800;
  color: var(--mc);
  min-width: 20px;
  text-align: right;
}
.mat-row.empty .mat-qty { color: #444; }

/* ── Artisan stubs ─────────────────────────────────────────────── */
.artisan-stub {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 80px 20px;
  text-align: center;
  opacity: 0.5;
}
.stub-icon { font-size: 2.4rem; }
.stub-name { font-family: var(--font-head); font-size: 1rem; color: #888; letter-spacing: 2px; text-transform: uppercase; }
.stub-desc { font-size: 0.72rem; color: #555; font-style: italic; max-width: 320px; }
.stub-soon { font-size: 0.6rem; color: #444; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 4px; }

/* ── Equip picker overlay ──────────────────────────────────────── */
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
