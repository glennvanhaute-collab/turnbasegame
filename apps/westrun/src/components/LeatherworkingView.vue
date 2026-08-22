<template>
  <div class="tannery" :class="{ 'drawer-open': drawerOpen }">

    <div class="tannery-bg" :style="{ backgroundImage: `url(${bg})` }" />
    <div class="tannery-overlay" />
    <div class="mob-drawer-backdrop" v-if="drawerOpen" @click="drawerOpen = false" />

    <!-- Mobile drawer toggle -->
    <button class="mob-drawer-toggle" @click="drawerOpen = !drawerOpen" :class="{ open: drawerOpen }">
      <span>{{ drawerOpen ? '‹' : '🪡' }}</span>
    </button>

    <!-- ── Left: Recipe list ────────────────────────────────────── -->
    <aside class="recipe-panel">
      <div class="panel-label">Leatherworking</div>

      <!-- Tan section -->
      <div class="recipe-section-head">✂ Tan</div>
      <div class="tan-group">
        <button
          v-for="leather in LEATHER_LIST"
          :key="leather.id"
          class="tan-btn"
          :class="{ active: selectedType === 'tan' && selectedId === leather.id }"
          :style="{ '--mat-color': leather.color }"
          @click="selectTan(leather)"
        >
          <GameIcon :icon="leatherIcon(leather.id)" :size="16" class="mat-icon" />
          <span class="tan-name">{{ leather.name }}</span>
          <span class="tan-cost">{{ leather.hideCost }}× hide</span>
        </button>
      </div>

      <!-- Craft section -->
      <div class="recipe-section-head">⚒ Craft</div>
      <div class="tier-group" v-for="tier in LEATHER_RECIPE_TIERS" :key="tier.id">
        <div
          class="tier-header collapsible"
          :style="{ '--tier-color': tier.color }"
          @click="toggleTier(tier.id)"
        >
          <span class="tier-dot" />
          <span class="tier-name">{{ tier.name }}</span>
          <span class="tier-count">{{ tier.recipes.length }}</span>
          <span class="tier-chevron">{{ openTier === tier.id ? '⌄' : '›' }}</span>
        </div>
        <template v-if="openTier === tier.id">
          <button
            class="craft-set-btn"
            :style="{ '--tier-color': tier.color }"
            :disabled="tier.recipes.every(r => !canAfford(r))"
            @click.stop="craftFullSet(tier)"
          >
            ✂ Craft Full Set
            <span class="csb-count">{{ tier.recipes.filter(r => canAfford(r)).length }} / {{ tier.recipes.length }}</span>
          </button>
          <button
            v-for="recipe in tier.recipes"
            :key="recipe.id"
            class="recipe-btn"
            :class="{ active: selectedType === 'craft' && selectedId === recipe.id, unaffordable: !canAfford(recipe) }"
            :style="{ '--tier-color': tier.color }"
            @click="selectCraft(recipe)"
          >
            <GameIcon :icon="tierSlotIcon(recipe.tier, recipe.slot, 'leatherworking')" :size="16" class="recipe-slot-icon" />
            <span class="recipe-name">{{ recipe.name }}</span>
            <span class="recipe-cost">
              <span
                v-for="(amt, matId) in recipe.materialCost"
                :key="matId"
                class="cost-pill"
                :class="{ short: (resources.leathers[matId] ?? 0) < amt }"
              >{{ amt }}</span>
            </span>
          </button>
        </template>
      </div>
    </aside>

    <!-- ── Center: Work area ────────────────────────────────────── -->
    <main class="work-area">

      <!-- TAN MODE -->
      <template v-if="selectedType === 'tan' && selectedLeather">

        <div class="tan-stage" :style="{ '--mat-color': selectedLeather.color }">
          <div class="tan-stage-glow" />
          <div class="tan-station-icon">🔨</div>
          <div class="tan-station-name">Tannery</div>
          <div class="tan-station-sub">{{ Math.ceil(selectedLeather.xp * 0.5) }} XP per strip</div>

          <div class="tan-conv-row">
            <div class="tco-side">
              <GameIcon :icon="hideIcon(selectedLeather.hideId)" :size="20" class="mat-icon" />
              <div class="tco-info">
                <span class="tco-name">{{ HIDES[selectedLeather.hideId]?.name }}</span>
                <span class="tco-stock">{{ resources.hides[selectedLeather.hideId] ?? 0 }} in stock</span>
              </div>
            </div>
            <div class="tco-middle">
              <span class="tco-cost">×{{ selectedLeather.hideCost }}</span>
              <span class="tco-arrow">→</span>
              <span class="tco-yield">1 strip</span>
            </div>
            <div class="tco-side tco-right">
              <div class="tco-info tco-info-right">
                <span class="tco-name">{{ selectedLeather.name }}</span>
                <span class="tco-stock" :class="{ 'tco-none': maxTan === 0 }">{{ maxTan }} can tan</span>
              </div>
              <GameIcon :icon="leatherIcon(selectedLeather.id)" :size="20" class="mat-icon" />
            </div>
          </div>

          <!-- IDLE -->
          <template v-if="!tanning.isRunning">
            <div class="qty-row">
              <button class="qty-adj" @click="adjustQty(-5)" :disabled="tanQty <= 1">−5</button>
              <button class="qty-adj" @click="adjustQty(-1)" :disabled="tanQty <= 1">−</button>
              <span class="qty-val">{{ tanQty }}</span>
              <button class="qty-adj" @click="adjustQty(1)"  :disabled="tanQty >= maxTan">+</button>
              <button class="qty-adj" @click="adjustQty(5)"  :disabled="tanQty >= maxTan">+5</button>
              <button class="qty-max" @click="tanQty = maxTan" :disabled="tanQty >= maxTan || maxTan === 0">Max</button>
            </div>
            <span class="tan-eta-hint" v-if="maxTan > 0">Est. {{ formatTime(tanQty * selectedLeather.tanTime * 1000 / tanSpeed) }}</span>
            <button
              class="action-btn"
              :class="{ ready: maxTan > 0 }"
              :disabled="maxTan <= 0 || tanQty <= 0"
              @click="startTan"
            >✂ Tan ×{{ tanQty }}</button>
          </template>

          <!-- RUNNING (this leather) -->
          <template v-else-if="isMyTanJob">
            <div class="run-header">
              <span class="run-title">Tanning in progress</span>
              <span class="run-count">{{ tanning.completedCount }} / {{ tanning.job.totalStrips }}</span>
            </div>
            <div class="progress-wrap">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: (tanning.currentProgress * 100) + '%' }" />
              </div>
              <span class="progress-eta">{{ formatTime(tanEta) }}</span>
            </div>
            <div class="qty-row" v-if="maxTan > 0">
              <button class="qty-adj" @click="adjustQty(-5)" :disabled="tanQty <= 1">−5</button>
              <button class="qty-adj" @click="adjustQty(-1)" :disabled="tanQty <= 1">−</button>
              <span class="qty-val">{{ tanQty }}</span>
              <button class="qty-adj" @click="adjustQty(1)"  :disabled="tanQty >= maxTan">+</button>
              <button class="qty-adj" @click="adjustQty(5)"  :disabled="tanQty >= maxTan">+5</button>
              <button class="qty-max" @click="tanQty = maxTan" :disabled="tanQty >= maxTan">Max</button>
            </div>
            <button class="action-btn action-btn--queue" :class="{ ready: maxTan > 0 }" :disabled="maxTan <= 0" @click="addToTanQueue">
              ✂ Add ×{{ tanQty }}
            </button>
            <button class="cancel-btn" @click="tanning.cancelTan()">Cancel &amp; Refund Hides</button>
          </template>

          <!-- BLOCKED (other leather running) -->
          <template v-else>
            <div class="busy-msg">
              <span class="busy-icon">✂</span>
              <div class="busy-text">
                <span class="busy-title">Tannery busy</span>
                <span class="busy-sub">Currently tanning {{ LEATHERS[tanning.job?.leatherId]?.name }}</span>
              </div>
            </div>
            <div class="busy-bar">
              <div class="busy-fill" :style="{ width: (tanning.currentProgress * 100) + '%' }" />
            </div>
          </template>
        </div>

      </template>

      <!-- CRAFT MODE / IDLE -->
      <template v-else>

        <div class="work-header" v-if="selected">
          <div class="work-item-name">{{ selected.name }}</div>
          <div class="work-badges">
            <span class="work-badge tier-badge" :style="{ '--tier-color': selectedTierColor }">{{ selectedTierName }} Tier</span>
            <span class="work-badge slot-badge">{{ SLOT_LABELS[selected.slot] }}</span>
            <span class="work-badge rarity-badge common">Common</span>
          </div>
        </div>

        <div class="work-idle" v-if="!selected">
          <div class="work-idle-icon">✂</div>
          <div class="work-idle-text">Select a recipe or hide to begin</div>
        </div>

        <template v-if="selected">
          <div class="item-showcase" :class="{ ready: canAfford(selected) }" :style="{ '--tier-color': selectedTierColor }">
            <div class="showcase-glow" />
            <GameIcon :icon="tierSlotIcon(selected.tier, selected.slot, 'leatherworking')" :size="72" class="showcase-icon" />
          </div>

          <p class="work-desc" v-if="selected.desc">{{ selected.desc }}</p>

          <div class="work-details">
            <div class="work-col">
              <div class="work-col-label">Base Stats</div>
              <div class="work-stats">
                <div class="work-stat" v-for="(val, key) in selected.baseStats" :key="key">
                  <span class="ws-label">{{ STAT_LABELS[key] ?? key }}</span>
                  <span class="ws-val">{{ formatStatValue(key, val) }}</span>
                </div>
              </div>
            </div>
            <div class="work-col">
              <div class="work-col-label">Materials</div>
              <div class="work-materials">
                <div
                  class="material-row"
                  v-for="(amt, matId) in selected.materialCost"
                  :key="matId"
                  :style="{ '--ore-color': LEATHERS[matId]?.color ?? '#888' }"
                >
                  <GameIcon :icon="leatherIcon(matId)" :size="20" class="mat-icon" />
                  <span class="mat-name">{{ LEATHERS[matId]?.name ?? matId }}</span>
                  <span class="mat-tally">
                    <span class="mat-have" :class="{ ok: (resources.leathers[matId] ?? 0) >= amt }">{{ resources.leathers[matId] ?? 0 }}</span>
                    <span class="mat-sep">/</span>
                    <span class="mat-need">{{ amt }}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="work-actions">
            <button
              class="work-btn"
              :class="{ ready: canAfford(selected) }"
              :disabled="!canAfford(selected)"
              @click="craft"
            >
              <span>✂</span> Craft
            </button>
          </div>

          <Transition name="forge-pop">
            <div class="craft-result" v-if="craftResult">
              <span class="cr-icon">✓</span>
              <div class="cr-text">
                <span class="cr-name">{{ craftResult }}</span>
                <span class="cr-sub">added to inventory</span>
              </div>
            </div>
          </Transition>
        </template>

      </template>

      <!-- Artisan assignment bar -->
      <div class="artisan-bar">
        <span class="ab-label">✂ Tanner</span>

        <template v-if="assignedTanner">
          <div class="ab-hero">
            <span class="ab-name">{{ assignedTanner.hero.name }}</span>
            <span class="ab-skill">Leatherworking Lv.{{ artisan.getSkillLevel(artisan.assignedTannerKey, 'leatherworking') }}</span>
            <div class="ab-xp-wrap">
              <div class="ab-xp-track">
                <div class="ab-xp-fill" :style="{ width: tannerXpPct + '%' }" />
              </div>
              <span class="ab-xp-text">
                {{ artisan.getSkillXp(artisan.assignedTannerKey, 'leatherworking') }}
                / {{ artisan.xpForLevel(artisan.getSkillLevel(artisan.assignedTannerKey, 'leatherworking')) }}
              </span>
            </div>
          </div>
          <span class="ab-bonus">+{{ Math.round((tanSpeed - 1) * 100) }}% speed</span>
          <button class="ab-remove" @click="artisan.unassignTanner()">×</button>
        </template>

        <template v-else>
          <button class="ab-assign" :disabled="eligibleTanners.length === 0" @click="showPicker = !showPicker">
            {{ eligibleTanners.length > 0 ? 'Assign Tanner' : 'No Leatherworkers owned' }}
          </button>
          <Transition name="ab-drop">
            <div class="ab-picker" v-if="showPicker && eligibleTanners.length > 0">
              <button
                v-for="{ key, hero } in eligibleTanners"
                :key="key"
                class="ab-pick-row"
                @click="assignTanner(key)"
              >
                <span class="ab-pick-name">{{ hero.name }}</span>
                <span class="ab-pick-level">Lv.{{ artisan.getSkillLevel(key, 'leatherworking') }}</span>
                <span class="ab-pick-bonus">+{{ Math.round((artisan.tannerSpeedMultiplier(key) - 1) * 100) }}%</span>
              </button>
            </div>
          </Transition>
        </template>
      </div>

      <!-- Leatherworking XP bar -->
      <div class="skill-xp-bar">
        <div class="skill-xp-header">
          <span class="skill-xp-label">✂ Leatherworking</span>
          <span class="skill-xp-level">Lv. {{ resources.leatherworkingLevel }}</span>
          <span class="skill-xp-count">{{ resources.leatherworkingXpInLevel }} / {{ resources.XP_PER_LEVEL }} XP</span>
        </div>
        <div class="skill-xp-track">
          <div class="skill-xp-fill" :style="{ width: (resources.leatherworkingProgress * 100) + '%' }" />
        </div>
      </div>

    </main>

    <!-- ── Right: Stockpile ─────────────────────────────────────── -->
    <aside class="stock-panel">
      <div class="panel-label">Stockpile</div>

      <div class="panel-sublabel">Hides</div>
      <div class="stock-list">
        <div
          v-for="hide in HIDE_LIST"
          :key="hide.id"
          class="stock-row"
          :class="{
            empty: !resources.hides[hide.id],
            clickable: !!resources.hides[hide.id] && !!hideToLeather[hide.id],
            active: selectedType === 'tan' && selectedId === hideToLeather[hide.id]?.id,
          }"
          :style="{ '--mat-color': hide.color }"
          @click="resources.hides[hide.id] && hideToLeather[hide.id] && selectTan(hideToLeather[hide.id])"
        >
          <GameIcon :icon="hideIcon(hide.id)" :size="20" class="mat-icon" />
          <span class="stock-name">{{ hide.name }}</span>
          <span class="stock-count">{{ resources.hides[hide.id] ?? 0 }}</span>
          <span class="stock-arrow" v-if="resources.hides[hide.id] && hideToLeather[hide.id]">→</span>
        </div>
      </div>

      <div class="panel-sublabel bar-sublabel">Leather</div>
      <div class="stock-list">
        <div
          v-for="leather in LEATHER_LIST"
          :key="leather.id"
          class="stock-row"
          :class="{ empty: !resources.leathers[leather.id] }"
          :style="{ '--mat-color': leather.color }"
        >
          <GameIcon :icon="leatherIcon(leather.id)" :size="20" class="mat-icon" />
          <span class="stock-name">{{ leather.name }}</span>
          <span class="stock-count">{{ resources.leathers[leather.id] ?? 0 }}</span>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useResourceStore }  from '../stores/useResourceStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useTanningStore }   from '../stores/useTanningStore.js'
import { useArtisanStore }   from '../stores/useArtisanStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { createItemInstance, SLOT_LABELS } from '../game/Gear.js'
import { HIDE_LIST, HIDES } from '../game/data/hides.js'
import { LEATHER_LIST, LEATHERS } from '../game/data/leathers.js'
import { LEATHER_RECIPES, LEATHER_RECIPE_TIERS, LEATHER_XP_PER_TIER } from '../game/data/leatherRecipes.js'
import { STAT_LABELS, formatStatValue } from '../game/data/recipes.js'
import { SLOT_TO_ICON, tierSlotIcon, hideIcon, leatherIcon } from '../game/data/spritesheet.js'
import GameIcon from './ui/GameIcon.vue'
const _B = import.meta.env.BASE_URL
const leatherworkingBg = _B + 'backgrounds/leatherworking_bg.png'

const bg = leatherworkingBg

const resources  = useResourceStore()
const inventory  = useInventoryStore()
const tanning    = useTanningStore()
const artisan    = useArtisanStore()
const collection = useCollectionStore()

const showPicker = ref(false)
const drawerOpen  = ref(typeof window !== 'undefined' && window.innerWidth <= 640)
const selectedType = ref(null)  // 'tan' | 'craft' | null
const selectedId   = ref(null)
const tanQty       = ref(1)
const craftResult  = ref(null)
let _flashTimer = null

watch(selectedId, () => { tanQty.value = 1 })

const selected       = computed(() => selectedType.value === 'craft' ? LEATHER_RECIPES.find(r => r.id === selectedId.value) ?? null : null)
const selectedLeather = computed(() => selectedType.value === 'tan'  ? LEATHERS[selectedId.value] ?? null : null)
const selectedTierColor = computed(() => LEATHER_RECIPE_TIERS.find(t => t.id === selected.value?.tier)?.color ?? '#c8906e')
const selectedTierName  = computed(() => LEATHER_RECIPE_TIERS.find(t => t.id === selected.value?.tier)?.name ?? '')

const openTier = ref(null)
function toggleTier(id) { openTier.value = openTier.value === id ? null : id }

function selectTan(leather)    { selectedType.value = 'tan';   selectedId.value = leather.id;  drawerOpen.value = false }
function selectCraft(recipe)   { selectedType.value = 'craft'; selectedId.value = recipe.id; drawerOpen.value = false }

function canAfford(recipe) {
  if (!recipe?.materialCost) return false
  return Object.entries(recipe.materialCost).every(([id, amt]) => (resources.leathers[id] ?? 0) >= amt)
}

// Maps hide ID → the LEATHERS entry that consumes it
const hideToLeather = computed(() => {
  const map = {}
  for (const l of LEATHER_LIST) map[l.hideId] = l
  return map
})

const maxTan = computed(() => {
  if (!selectedLeather.value) return 0
  return Math.floor((resources.hides[selectedLeather.value.hideId] ?? 0) / selectedLeather.value.hideCost)
})

const isMyTanJob = computed(() => tanning.isRunning && tanning.job?.leatherId === selectedId.value)

const tanEta = computed(() => {
  if (!tanning.isRunning || !tanning.job) return 0
  return Math.max(0, (tanning.remainingCount - tanning.currentProgress) * tanning.job.timePerStrip)
})

function formatTime(ms) {
  const s = Math.ceil(ms / 1000)
  if (s < 60)  return `${s}s`
  const m = Math.floor(s / 60), r = s % 60
  if (m < 60)  return r > 0 ? `${m}m ${r}s` : `${m}m`
  const h = Math.floor(m / 60), rm = m % 60
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`
}

function adjustQty(delta) {
  tanQty.value = Math.max(1, Math.min(Math.max(1, maxTan.value), tanQty.value + delta))
}

// Artisan helpers
const eligibleTanners = computed(() =>
  collection.roster.filter(({ hero }) =>
    hero.artisanSkills?.some(s => s.id === 'leatherworking')
  )
)

const assignedTanner = computed(() => {
  const key = artisan.assignedTannerKey
  if (!key) return null
  return eligibleTanners.value.find(e => e.key === key) ?? null
})

const tanSpeed = computed(() => {
  if (!assignedTanner.value) return 1.0
  return artisan.tannerSpeedMultiplier(artisan.assignedTannerKey)
})

const tannerXpPct = computed(() => {
  const key = artisan.assignedTannerKey
  if (!key) return 0
  const level = artisan.getSkillLevel(key, 'leatherworking')
  const xp    = artisan.getSkillXp(key, 'leatherworking')
  return Math.round((xp / artisan.xpForLevel(level)) * 100)
})

function assignTanner(key) {
  artisan.assignTanner(key)
  showPicker.value = false
}

function startTan() {
  if (!selectedLeather.value || maxTan.value <= 0) return
  tanning.startTan(selectedLeather.value.id, Math.min(tanQty.value, maxTan.value), tanSpeed.value)
}

function addToTanQueue() {
  if (!selectedLeather.value || maxTan.value <= 0) return
  tanning.addToQueue(selectedLeather.value.id, Math.min(tanQty.value, maxTan.value))
}

function craft() {
  if (!selected.value || !canAfford(selected.value)) return
  const recipe = selected.value
  Object.entries(recipe.materialCost).forEach(([id, amt]) => resources.removeLeather(id, amt))
  const instance = createItemInstance({
    id:          recipe.id,
    name:        recipe.name,
    gearType:    recipe.gearType,
    weaponType:  null,
    rarity:      recipe.rarity,
    description: recipe.desc,
    stats:       { ...recipe.baseStats },
    baseStats:   { ...recipe.baseStats },
    tier:        recipe.tier,
    slot:        recipe.slot,
    armorType:   recipe.armorType,
  })
  instance.craftedAt       = Date.now()
  instance.crafted         = true
  instance.craftDiscipline = 'leatherworking'
  inventory.addInstance(instance)
  resources.addLeatherworkingXp(LEATHER_XP_PER_TIER[recipe.tier] ?? 8)
  craftResult.value = recipe.name
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { craftResult.value = null }, 3000)
}

function craftFullSet(tier) {
  const affordable = tier.recipes.filter(r => canAfford(r))
  if (!affordable.length) return
  for (const recipe of affordable) {
    Object.entries(recipe.materialCost).forEach(([id, amt]) => resources.removeLeather(id, amt))
    const instance = createItemInstance({
      id: recipe.id, name: recipe.name, gearType: recipe.gearType,
      weaponType: null, rarity: recipe.rarity, description: recipe.desc,
      stats: { ...recipe.baseStats }, baseStats: { ...recipe.baseStats },
      tier: recipe.tier, slot: recipe.slot, armorType: recipe.armorType,
    })
    instance.craftedAt       = Date.now()
    instance.crafted         = true
    instance.craftDiscipline = 'leatherworking'
    inventory.addInstance(instance)
    resources.addLeatherworkingXp(LEATHER_XP_PER_TIER[recipe.tier] ?? 8)
  }
  craftResult.value = `${affordable.length} ${tier.name} pieces crafted`
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { craftResult.value = null }, 3000)
}
</script>

<style scoped>
.tannery {
  position: relative; display: flex; height: 100%; min-height: 100%;
  overflow: hidden; border-radius: 12px;
}
.tannery-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.55; pointer-events: none; z-index: 0; border-radius: 12px;
  filter: hue-rotate(-20deg) saturate(0.8);
}
.tannery-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right,
    rgba(8,4,2,0.96) 0%, rgba(8,4,2,0.55) 18%,
    rgba(8,4,2,0.28) 50%, rgba(8,4,2,0.55) 82%, rgba(8,4,2,0.96) 100%
  );
  pointer-events: none; z-index: 1; border-radius: 12px;
}
.panel-label {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 2.5px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 10px; border-bottom: 1px solid var(--border-brown); margin-bottom: 12px;
}

/* ── Left panel ─────────────────────────────────────────────────── */
.recipe-panel {
  width: 210px; flex-shrink: 0; position: relative; z-index: 2;
  border-right: 1px solid rgba(200,144,110,0.3);
  background: rgba(8,4,2,0.90); backdrop-filter: blur(8px);
  padding: 16px 12px; display: flex; flex-direction: column; overflow-y: auto;
}
.recipe-section-head {
  font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-dim); font-weight: 700;
  padding: 8px 4px 6px; margin-bottom: 4px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.tan-group { display: flex; flex-direction: column; gap: 2px; margin-bottom: 10px; }
.tan-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 7px 8px; background: transparent; border: 1px solid transparent;
  border-radius: 6px; cursor: pointer; text-align: left; transition: all 0.12s;
}
.tan-btn:hover {
  background: rgba(255,255,255,0.04);
  border-color: color-mix(in srgb, var(--mat-color) 25%, transparent);
}
.tan-btn.active {
  background: color-mix(in srgb, var(--mat-color) 12%, rgba(0,0,0,0.4));
  border-color: color-mix(in srgb, var(--mat-color) 50%, transparent);
}
.tan-btn:not(.active) .mat-icon { opacity: 0.75; }
.tan-btn .mat-icon { filter: drop-shadow(0 0 3px var(--mat-color)); }
.tan-name { flex: 1; font-size: 0.66rem; font-weight: 600; color: var(--text-parchment); }
.tan-cost { font-size: 0.58rem; color: var(--text-muted); font-family: var(--font-head); background: rgba(255,255,255,0.04); border-radius: 6px; padding: 1px 5px; }

/* Tier groups */
.tier-group { margin-bottom: 6px; }
.tier-header {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 8px 5px; margin-bottom: 2px; cursor: pointer;
}
.tier-header:hover .tier-name { color: #fff; }
.tier-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tier-color); flex-shrink: 0; }
.tier-name { font-family: var(--font-head); font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: var(--tier-color); flex: 1; }
.tier-count { font-size: 0.55rem; color: var(--text-dim); background: rgba(255,255,255,0.05); border-radius: 8px; padding: 0 5px; line-height: 1.6; }
.tier-chevron { font-size: 0.7rem; color: var(--text-dim); margin-left: auto; }
.craft-set-btn {
  width: 100%; display: flex; align-items: center; justify-content: center; gap: 7px;
  padding: 7px 10px; margin-bottom: 4px;
  background: color-mix(in srgb, var(--tier-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--tier-color) 35%, transparent);
  border-radius: 6px; cursor: pointer;
  font-size: 0.65rem; font-weight: 700; color: var(--tier-color);
  letter-spacing: 0.5px; transition: all 0.12s;
}
.craft-set-btn:hover:not(:disabled) { background: color-mix(in srgb, var(--tier-color) 18%, transparent); border-color: var(--tier-color); }
.craft-set-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.csb-count { font-size: 0.58rem; opacity: 0.65; }
.recipe-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 7px 8px; background: transparent; border: 1px solid transparent;
  border-radius: 6px; cursor: pointer; text-align: left; margin-bottom: 2px; transition: all 0.12s;
}
.recipe-btn:hover { background: rgba(255,255,255,0.04); border-color: color-mix(in srgb, var(--tier-color) 25%, transparent); }
.recipe-btn.active { background: color-mix(in srgb, var(--tier-color) 12%, rgba(0,0,0,0.4)); border-color: color-mix(in srgb, var(--tier-color) 50%, transparent); }
.recipe-btn.unaffordable { opacity: 0.42; }
.recipe-slot-icon { flex-shrink: 0; }
.recipe-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recipe-cost { display: flex; gap: 3px; flex-shrink: 0; }
.cost-pill { font-size: 0.6rem; font-family: var(--font-head); font-weight: 700; color: var(--tier-color); background: color-mix(in srgb, var(--tier-color) 12%, transparent); border-radius: 8px; padding: 0 5px; line-height: 1.6; }
.cost-pill.short { color: #ff6b6b; background: rgba(255,107,107,0.12); }

/* ── Center work area ────────────────────────────────────────────── */
.work-area {
  flex: 1; position: relative; z-index: 2;
  padding: 0 16px 20px; overflow-y: auto;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}

/* Tan stage */
.tan-stage {
  flex: 1; width: 100%; display: flex; flex-direction: column;
  align-items: center; gap: 14px; padding: 28px 24px;
  background: radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--mat-color) 8%, transparent) 0%, transparent 70%);
  border: 1px solid color-mix(in srgb, var(--mat-color) 20%, transparent);
  border-radius: 10px; position: relative; overflow: hidden;
}
.tan-stage-glow {
  position: absolute; top: 0; left: 0; right: 0; height: 120px;
  background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--mat-color) 18%, transparent) 0%, transparent 70%);
  pointer-events: none; z-index: 0;
}
.tan-station-icon { font-size: 2rem; position: relative; z-index: 1; }
.tan-station-name { font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; letter-spacing: 4px; text-transform: uppercase; color: var(--text-parchment); position: relative; z-index: 1; }
.tan-station-sub { font-size: 0.6rem; color: var(--text-dim); letter-spacing: 1.5px; text-transform: uppercase; font-family: var(--font-head); position: relative; z-index: 1; }

.tan-conv-row {
  display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 420px;
  padding-bottom: 14px; border-bottom: 1px solid rgba(200,144,110,0.15); position: relative; z-index: 1;
}
.tco-side { display: flex; align-items: center; gap: 10px; }
.tco-right { flex-direction: row-reverse; }
.tco-dot { width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 8px currentColor; }
.tco-info { display: flex; flex-direction: column; gap: 2px; }
.tco-info-right { text-align: right; }
.tco-name { font-size: 0.78rem; font-weight: 700; color: var(--text-parchment); font-family: var(--font-head); }
.tco-stock { font-size: 0.6rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; }
.tco-none { color: #884444 !important; }
.tco-middle { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
.tco-cost { font-family: var(--font-head); font-size: 0.65rem; font-weight: 700; color: rgba(200,144,110,0.7); }
.tco-arrow { font-size: 1.3rem; color: rgba(200,144,110,0.35); }
.tco-yield { font-family: var(--font-head); font-size: 0.6rem; color: var(--text-dim); }

/* Qty row / progress / buttons — shared styles */
.qty-row { display: flex; align-items: center; gap: 4px; position: relative; z-index: 1; }
.qty-adj {
  width: 34px; height: 34px; border-radius: 6px; border: 1px solid var(--border-brown);
  background: rgba(255,255,255,0.03); color: var(--text-muted);
  font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: all 0.12s;
}
.qty-adj:not(:disabled):hover { background: rgba(255,255,255,0.07); border-color: #8a5a18; color: var(--gold); }
.qty-adj:disabled { opacity: 0.28; cursor: not-allowed; }
.qty-val { min-width: 48px; text-align: center; font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; color: var(--gold); }
.qty-max {
  padding: 0 10px; height: 34px; border-radius: 6px; border: 1px solid var(--border-brown);
  background: rgba(255,255,255,0.03); color: var(--text-dim);
  font-family: var(--font-head); font-size: 0.6rem; font-weight: 700; cursor: pointer;
  letter-spacing: 1px; text-transform: uppercase; transition: all 0.12s; margin-left: 4px;
}
.qty-max:not(:disabled):hover { background: rgba(255,255,255,0.06); border-color: #8a5a18; color: var(--gold); }
.qty-max:disabled { opacity: 0.28; cursor: not-allowed; }
.tan-eta-hint { font-size: 0.6rem; color: var(--text-dim); font-style: italic; position: relative; z-index: 1; }
.action-btn {
  padding: 12px 44px; border-radius: 8px; border: 1px solid var(--border-brown);
  background: linear-gradient(135deg, #2a1408 0%, #160a04 100%);
  color: var(--text-dim); font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase; cursor: not-allowed; transition: all 0.2s;
  position: relative; z-index: 1;
}
.action-btn.ready {
  border-color: #7a4a10; background: linear-gradient(135deg, #3a2208 0%, #200e04 100%);
  color: #d4a060; cursor: pointer; box-shadow: 0 0 20px rgba(180,100,30,0.25);
}
.action-btn.ready:hover {
  background: linear-gradient(135deg, #5a3210 0%, #2a1408 100%);
  border-color: #d4a060; box-shadow: 0 0 32px rgba(200,120,40,0.40);
}
.action-btn--queue { padding: 9px 32px; font-size: 0.78rem; }
.run-header { display: flex; align-items: baseline; gap: 10px; width: 100%; max-width: 360px; position: relative; z-index: 1; }
.run-title { flex: 1; font-family: var(--font-head); font-size: 0.62rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); }
.run-count { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: #d4a060; }
.progress-wrap { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 360px; position: relative; z-index: 1; }
.progress-track { flex: 1; height: 8px; background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; border: 1px solid var(--border-brown); }
.progress-fill { height: 100%; background: linear-gradient(to right, #c8906e, #d4a060); border-radius: 4px; transition: width 0.8s linear; }
.progress-eta { font-family: var(--font-head); font-size: 0.68rem; color: rgba(200,144,110,0.8); flex-shrink: 0; min-width: 50px; text-align: right; }
.cancel-btn {
  padding: 8px 24px; border-radius: 6px; border: 1px solid #5a2020; background: rgba(90,20,20,0.25);
  color: #c08080; font-family: var(--font-head); font-size: 0.68rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.15s; position: relative; z-index: 1;
}
.cancel-btn:hover { border-color: #cc4444; background: rgba(120,20,20,0.4); color: #ffaaaa; }
.busy-msg { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(200,144,110,0.15); background: rgba(20,8,2,0.6); position: relative; z-index: 1; }
.busy-icon { font-size: 1.1rem; color: #c8906e; opacity: 0.7; }
.busy-text { display: flex; flex-direction: column; gap: 1px; }
.busy-title { font-family: var(--font-head); font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; }
.busy-sub { font-size: 0.62rem; color: var(--text-dim); }
.busy-bar { width: 100%; max-width: 300px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; position: relative; z-index: 1; }
.busy-fill { height: 100%; background: linear-gradient(to right, #c8906e, #d4a060); border-radius: 2px; transition: width 0.8s linear; }

/* Craft mode */
.work-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; }
.work-item-name { font-family: var(--font-head); font-size: 1.2rem; font-weight: 800; color: #fff; letter-spacing: 2px; }
.work-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.work-badge { font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; padding: 2px 10px; border-radius: 10px; border: 1px solid; }
.tier-badge { color: var(--tier-color); border-color: color-mix(in srgb, var(--tier-color) 40%, transparent); background: color-mix(in srgb, var(--tier-color) 10%, transparent); }
.slot-badge { color: var(--text-muted); border-color: var(--border-brown); background: rgba(255,255,255,0.03); }
.rarity-badge.common { color: #aaa; border-color: #333; background: rgba(255,255,255,0.03); }
.work-idle { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; opacity: 0.35; padding: 40px 0; }
.work-idle-icon { font-size: 2.4rem; }
.work-idle-text { font-size: 0.78rem; color: var(--text-muted); font-style: italic; }
.item-showcase {
  position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 160px; height: 160px;
  border: 1.5px solid color-mix(in srgb, var(--tier-color) 30%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--tier-color) 8%, rgba(6,3,1,0.85));
  box-shadow: 0 0 24px color-mix(in srgb, var(--tier-color) 18%, transparent);
  transition: all 0.4s;
}
.item-showcase.ready {
  border-color: color-mix(in srgb, var(--tier-color) 65%, transparent);
  box-shadow: 0 0 32px color-mix(in srgb, var(--tier-color) 35%, transparent);
}
.showcase-glow {
  position: absolute; inset: -20px;
  background: radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--tier-color) 20%, transparent) 0%, transparent 65%);
  pointer-events: none; animation: glow-pulse 2.4s ease-in-out infinite;
}
@keyframes glow-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.9; } }
.showcase-icon { position: relative; z-index: 1; }
.work-desc { font-size: 0.7rem; color: var(--text-muted); line-height: 1.6; font-style: italic; text-align: center; max-width: 380px; }
.work-details { display: flex; gap: 16px; width: 100%; max-width: 440px; }
.work-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.work-col-label { font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); font-weight: 700; padding-bottom: 5px; border-bottom: 1px solid rgba(58,30,10,0.5); }
.work-stats { display: flex; gap: 6px; flex-wrap: wrap; }
.work-stat { display: flex; flex-direction: column; align-items: center; gap: 1px; background: rgba(0,0,0,0.35); border: 1px solid var(--border-brown); border-radius: 6px; padding: 7px 12px; min-width: 58px; }
.ws-label { font-size: 0.54rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-family: var(--font-head); }
.ws-val { font-size: 0.95rem; font-weight: 800; color: #ffd700; font-family: var(--font-head); }
.work-materials { display: flex; flex-direction: column; gap: 5px; }
.material-row { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--ore-color) 20%, transparent); background: color-mix(in srgb, var(--ore-color) 6%, rgba(0,0,0,0.3)); }
.mat-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--ore-color); box-shadow: 0 0 5px var(--ore-color); flex-shrink: 0; }
.mat-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); }
.mat-tally { display: flex; align-items: baseline; gap: 2px; flex-shrink: 0; }
.mat-have { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: #666; }
.mat-have.ok { color: var(--ore-color); }
.mat-sep { font-size: 0.6rem; color: var(--text-dim); }
.mat-need { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }
.work-actions { display: flex; align-items: center; gap: 12px; }
.work-btn {
  display: flex; align-items: center; gap: 8px; padding: 12px 40px; border-radius: 8px;
  border: 1px solid var(--border-brown); background: linear-gradient(135deg, #2a1408 0%, #160a04 100%);
  color: var(--text-dim); font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase; cursor: not-allowed; transition: all 0.2s;
}
.work-btn.ready {
  border-color: #7a4a10; background: linear-gradient(135deg, #3a2208 0%, #200e04 100%);
  color: #d4a060; cursor: pointer; box-shadow: 0 0 20px rgba(180,100,30,0.25);
}
.work-btn.ready:hover {
  background: linear-gradient(135deg, #5a3210 0%, #2a1408 100%);
  border-color: #d4a060; box-shadow: 0 0 32px rgba(200,120,40,0.40);
}
.craft-result { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 8px; border: 1px solid #2a5a2a; background: rgba(10,30,10,0.75); }
.cr-icon { font-size: 1.1rem; color: #4dff88; }
.cr-text { display: flex; flex-direction: column; gap: 1px; }
.cr-name { font-size: 0.8rem; font-weight: 700; color: #aaffcc; font-family: var(--font-head); }
.cr-sub { font-size: 0.6rem; color: #3a6a3a; }
.forge-pop-enter-active { animation: forge-flash 0.3s ease-out; }
.forge-pop-leave-active { transition: opacity 0.4s ease; }
.forge-pop-leave-to { opacity: 0; }
@keyframes forge-flash { from { transform: translateY(6px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* Artisan bar */
.artisan-bar {
  width: 100%; max-width: 440px; position: relative;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 10px 14px; border-radius: 8px;
  border: 1px solid rgba(200,144,110,0.20);
  background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); margin-top: auto;
}
.ab-label { font-family: var(--font-head); font-size: 0.6rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); font-weight: 700; flex-shrink: 0; }
.ab-hero { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; flex-wrap: wrap; }
.ab-name { font-size: 0.72rem; font-weight: 700; color: var(--text-parchment); }
.ab-skill { font-size: 0.6rem; color: #c8906e; font-family: var(--font-head); font-weight: 700; }
.ab-xp-wrap { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ab-xp-track { width: 72px; height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
.ab-xp-fill { height: 100%; background: linear-gradient(to right, #c8906e, #d4a060); border-radius: 2px; transition: width 0.4s ease; }
.ab-xp-text { font-size: 0.56rem; color: var(--text-dim); white-space: nowrap; }
.ab-bonus { font-family: var(--font-head); font-size: 0.65rem; font-weight: 800; color: #4dff88; background: rgba(77,255,136,0.08); border: 1px solid rgba(77,255,136,0.2); border-radius: 6px; padding: 2px 8px; white-space: nowrap; flex-shrink: 0; }
.ab-remove { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #5a2020; background: rgba(90,20,20,0.3); color: #c08080; font-size: 0.7rem; font-weight: 700; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.ab-remove:hover { border-color: #cc4444; background: rgba(120,20,20,0.5); color: #ffaaaa; }
.ab-assign { flex: 1; padding: 6px 12px; border-radius: 6px; border: 1px dashed rgba(200,144,110,0.25); background: transparent; color: var(--text-dim); font-size: 0.66rem; font-family: var(--font-head); cursor: pointer; transition: all 0.15s; text-align: left; }
.ab-assign:not(:disabled):hover { border-color: #7a4a10; color: #d4a060; }
.ab-assign:disabled { opacity: 0.3; cursor: not-allowed; }
.ab-picker { position: absolute; bottom: calc(100% + 6px); left: 0; right: 0; z-index: 10; background: rgba(12,6,2,0.97); border: 1px solid rgba(200,144,110,0.4); border-radius: 8px; overflow: hidden; box-shadow: 0 -8px 32px rgba(0,0,0,0.8); }
.ab-pick-row { width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background 0.1s; text-align: left; }
.ab-pick-row:last-child { border-bottom: none; }
.ab-pick-row:hover { background: rgba(255,255,255,0.05); }
.ab-pick-name { flex: 1; font-size: 0.7rem; font-weight: 600; color: var(--text-parchment); }
.ab-pick-level { font-size: 0.6rem; color: #c8906e; font-family: var(--font-head); }
.ab-pick-bonus { font-size: 0.6rem; color: #4dff88; font-family: var(--font-head); font-weight: 700; }
.ab-drop-enter-active { transition: opacity 0.15s, transform 0.15s; }
.ab-drop-leave-active { transition: opacity 0.1s; }
.ab-drop-enter-from { opacity: 0; transform: translateY(4px); }
.ab-drop-leave-to { opacity: 0; }

/* Skill XP bar */
.skill-xp-bar { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 6px; }
.skill-xp-header { display: flex; align-items: baseline; gap: 8px; }
.skill-xp-label { font-family: var(--font-head); font-size: 0.62rem; font-weight: 700; color: #c8906e; text-transform: uppercase; letter-spacing: 1.5px; flex: 1; }
.skill-xp-level { font-family: var(--font-head); font-size: 0.75rem; font-weight: 800; color: #d4a060; }
.skill-xp-count { font-size: 0.6rem; color: var(--text-muted); }
.skill-xp-track { height: 6px; background: #1a0e04; border-radius: 3px; overflow: hidden; border: 1px solid var(--border-brown); }
.skill-xp-fill { height: 100%; background: linear-gradient(to right, #c8906e, #d4a060); border-radius: 3px; transition: width 0.6s ease; }

/* ── Right: Stockpile ───────────────────────────────────────────── */
.stock-panel {
  width: 190px; flex-shrink: 0; position: relative; z-index: 2;
  border-left: 1px solid rgba(200,144,110,0.3);
  background: rgba(8,4,2,0.90); backdrop-filter: blur(8px);
  padding: 16px 14px; display: flex; flex-direction: column; overflow-y: auto;
}
.panel-sublabel { font-family: var(--font-head); font-size: 0.52rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-dim); font-weight: 700; margin-bottom: 6px; }
.bar-sublabel { margin-top: 14px; }
.stock-list { display: flex; flex-direction: column; gap: 5px; }
.stock-row { display: flex; align-items: center; gap: 8px; padding: 7px 10px; border-radius: 6px; border: 1px solid transparent; transition: background 0.12s; }
.stock-row:not(.empty) { border-color: color-mix(in srgb, var(--mat-color) 20%, transparent); background: color-mix(in srgb, var(--mat-color) 5%, transparent); }
.stock-row.empty { opacity: 0.28; filter: saturate(0.2); }
.stock-row:not(.empty) .mat-icon { filter: drop-shadow(0 0 4px var(--mat-color)); }
.stock-name { flex: 1; font-size: 0.65rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.stock-count { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: var(--mat-color); min-width: 20px; text-align: right; }
.stock-row.empty .stock-count { color: var(--text-dim); }
.stock-row.clickable { cursor: pointer; }
.stock-row.clickable:hover { background: color-mix(in srgb, var(--mat-color) 12%, transparent); border-color: color-mix(in srgb, var(--mat-color) 40%, transparent); }
.stock-row.active { background: color-mix(in srgb, var(--mat-color) 15%, transparent); border-color: color-mix(in srgb, var(--mat-color) 55%, transparent); }
.stock-arrow { font-size: 0.65rem; color: var(--mat-color); opacity: 0.7; flex-shrink: 0; }

/* ── Mobile ── */
/* ── Mobile drawer ── */
.mob-drawer-toggle  { display: none; }
.mob-drawer-backdrop { display: none; }

@media (max-width: 640px) {
  .recipe-panel {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 240px;
    max-height: none;
    z-index: 20;
    border-right: 1px solid rgba(200,144,110,0.4);
    border-bottom: none;
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    overflow-y: auto;
  }
  .tannery.drawer-open .recipe-panel { transform: translateX(0); }
  .stock-panel { display: none; }
  .mob-drawer-backdrop {
    display: block;
    position: absolute;
    inset: 0;
    z-index: 18;
    background: rgba(0,0,0,0.5);
  }
  .mob-drawer-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 28px;
    height: 56px;
    background: rgba(4,2,1,0.92);
    border: 1px solid rgba(200,144,110,0.4);
    border-left: none;
    border-radius: 0 8px 8px 0;
    color: #c8906e;
    font-size: 0.9rem;
    cursor: pointer;
    z-index: 25;
    padding: 0;
    transition: background 0.15s;
  }
  .mob-drawer-toggle:hover { background: rgba(20,10,2,0.98); }
  .mob-drawer-toggle.open  { left: 240px; }
  .work-area { padding: 12px 10px; }
}
</style>
