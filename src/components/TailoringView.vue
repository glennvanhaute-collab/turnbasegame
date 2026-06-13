<template>
  <div class="tailoring">

    <div class="tailoring-bg" :style="{ backgroundImage: `url(${bg})` }" />
    <div class="tailoring-overlay" />

    <!-- ── Left: Recipe list ────────────────────────────────────── -->
    <aside class="recipe-panel">
      <div class="panel-label">Tailoring</div>

      <!-- Weave section -->
      <div class="recipe-section-head">✦ Weave</div>
      <div class="tan-group">
        <button
          v-for="cloth in CLOTH_LIST"
          :key="cloth.id"
          class="tan-btn"
          :class="{ active: selectedType === 'weave' && selectedId === cloth.id }"
          :style="{ '--mat-color': cloth.color }"
          @click="selectWeave(cloth)"
        >
          <GameIcon :icon="clothIcon(cloth.id)" :size="16" class="mat-icon" />
          <span class="tan-name">{{ cloth.name }}</span>
          <span class="tan-cost">{{ cloth.fiberCost }}× fiber</span>
        </button>
      </div>

      <!-- Bowstrings section -->
      <div class="recipe-section-head">🏹 Bowstrings</div>
      <div class="tan-group">
        <button
          v-for="bs in BOWSTRING_LIST"
          :key="bs.id"
          class="tan-btn"
          :class="{ unaffordable: !canAffordBowstring(bs) }"
          :style="{ '--mat-color': bs.color }"
          @click="craftBowstring(bs)"
        >
          <span class="mat-dot-plain" :style="{ background: bs.color }" />
          <span class="tan-name">{{ bs.name }}</span>
          <span class="tan-cost">{{ bs.clothCost }}× {{ CLOTHS[bs.clothId]?.name }}</span>
          <span class="bs-stock" :class="{ short: !canAffordBowstring(bs) }">{{ resources.cloths[bs.clothId] ?? 0 }}</span>
        </button>
      </div>

      <!-- Craft section -->
      <div class="recipe-section-head">✂ Craft</div>
      <div class="tier-group" v-for="tier in TAILORING_RECIPE_TIERS" :key="tier.id">
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
            <GameIcon :icon="tierSlotIcon(recipe.tier, recipe.slot, 'tailoring')" :size="16" class="recipe-slot-icon" />
            <span class="recipe-name">{{ recipe.name }}</span>
            <span class="recipe-cost">
              <span
                v-for="(amt, matId) in recipe.materialCost"
                :key="matId"
                class="cost-pill"
                :class="{ short: (resources.cloths[matId] ?? 0) < amt }"
              >{{ amt }}</span>
            </span>
          </button>
        </template>
      </div>
    </aside>

    <!-- ── Center: Work area ────────────────────────────────────── -->
    <main class="work-area">

      <!-- WEAVE MODE -->
      <template v-if="selectedType === 'weave' && selectedCloth">

        <div class="tan-stage" :style="{ '--mat-color': selectedCloth.color }">
          <div class="tan-stage-glow" />
          <div class="tan-station-icon">🧵</div>
          <div class="tan-station-name">Loom</div>
          <div class="tan-station-sub">{{ Math.ceil(selectedCloth.xp * 0.5) }} XP per bolt</div>

          <div class="tan-conv-row">
            <div class="tco-side">
              <GameIcon :icon="fiberIcon(selectedCloth.fiberId)" :size="20" class="mat-icon" />
              <div class="tco-info">
                <span class="tco-name">{{ FIBERS[selectedCloth.fiberId]?.name }}</span>
                <span class="tco-stock">{{ resources.fibers[selectedCloth.fiberId] ?? 0 }} in stock</span>
              </div>
            </div>
            <div class="tco-middle">
              <span class="tco-cost">×{{ selectedCloth.fiberCost }}</span>
              <span class="tco-arrow">→</span>
              <span class="tco-yield">1 bolt</span>
            </div>
            <div class="tco-side tco-right">
              <div class="tco-info tco-info-right">
                <span class="tco-name">{{ selectedCloth.name }}</span>
                <span class="tco-stock" :class="{ 'tco-none': maxWeave === 0 }">{{ maxWeave }} can weave</span>
              </div>
              <GameIcon :icon="clothIcon(selectedCloth.id)" :size="20" class="mat-icon" />
            </div>
          </div>

          <!-- IDLE -->
          <template v-if="!weaving.isRunning">
            <div class="qty-row">
              <button class="qty-adj" @click="adjustQty(-5)" :disabled="weaveQty <= 1">−5</button>
              <button class="qty-adj" @click="adjustQty(-1)" :disabled="weaveQty <= 1">−</button>
              <span class="qty-val">{{ weaveQty }}</span>
              <button class="qty-adj" @click="adjustQty(1)"  :disabled="weaveQty >= maxWeave">+</button>
              <button class="qty-adj" @click="adjustQty(5)"  :disabled="weaveQty >= maxWeave">+5</button>
              <button class="qty-max" @click="weaveQty = maxWeave" :disabled="weaveQty >= maxWeave || maxWeave === 0">Max</button>
            </div>
            <span class="tan-eta-hint" v-if="maxWeave > 0">Est. {{ formatTime(weaveQty * selectedCloth.weaveTime * 1000 / weaveSpeed) }}</span>
            <button
              class="action-btn"
              :class="{ ready: maxWeave > 0 }"
              :disabled="maxWeave <= 0 || weaveQty <= 0"
              @click="startWeave"
            >✦ Weave ×{{ weaveQty }}</button>
          </template>

          <!-- RUNNING (this cloth) -->
          <template v-else-if="isMyWeaveJob">
            <div class="run-header">
              <span class="run-title">Weaving in progress</span>
              <span class="run-count">{{ weaving.completedCount }} / {{ weaving.job.totalBolts }}</span>
            </div>
            <div class="progress-wrap">
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: (weaving.currentProgress * 100) + '%' }" />
              </div>
              <span class="progress-eta">{{ formatTime(weaveEta) }}</span>
            </div>
            <div class="qty-row" v-if="maxWeave > 0">
              <button class="qty-adj" @click="adjustQty(-5)" :disabled="weaveQty <= 1">−5</button>
              <button class="qty-adj" @click="adjustQty(-1)" :disabled="weaveQty <= 1">−</button>
              <span class="qty-val">{{ weaveQty }}</span>
              <button class="qty-adj" @click="adjustQty(1)"  :disabled="weaveQty >= maxWeave">+</button>
              <button class="qty-adj" @click="adjustQty(5)"  :disabled="weaveQty >= maxWeave">+5</button>
              <button class="qty-max" @click="weaveQty = maxWeave" :disabled="weaveQty >= maxWeave">Max</button>
            </div>
            <button class="action-btn action-btn--queue" :class="{ ready: maxWeave > 0 }" :disabled="maxWeave <= 0" @click="addToWeaveQueue">
              ✦ Add ×{{ weaveQty }}
            </button>
            <button class="cancel-btn" @click="weaving.cancelWeave()">Cancel &amp; Refund Fibers</button>
          </template>

          <!-- BLOCKED (other cloth running) -->
          <template v-else>
            <div class="busy-msg">
              <span class="busy-icon">🧵</span>
              <div class="busy-text">
                <span class="busy-title">Loom busy</span>
                <span class="busy-sub">Currently weaving {{ CLOTHS[weaving.job?.clothId]?.name }}</span>
              </div>
            </div>
            <div class="busy-bar">
              <div class="busy-fill" :style="{ width: (weaving.currentProgress * 100) + '%' }" />
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
          <div class="work-idle-icon">🧵</div>
          <div class="work-idle-text">Select a recipe or fiber to begin</div>
        </div>

        <template v-if="selected">
          <div class="item-showcase" :class="{ ready: canAfford(selected) }" :style="{ '--tier-color': selectedTierColor }">
            <div class="showcase-glow" />
            <GameIcon :icon="tierSlotIcon(selected.tier, selected.slot, 'tailoring')" :size="72" class="showcase-icon" />
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
                  :style="{ '--ore-color': CLOTHS[matId]?.color ?? '#888' }"
                >
                  <GameIcon :icon="clothIcon(matId)" :size="20" class="mat-icon" />
                  <span class="mat-name">{{ CLOTHS[matId]?.name ?? matId }}</span>
                  <span class="mat-tally">
                    <span class="mat-have" :class="{ ok: (resources.cloths[matId] ?? 0) >= amt }">{{ resources.cloths[matId] ?? 0 }}</span>
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
        <span class="ab-label">✦ Tailor</span>

        <template v-if="assignedTailor">
          <div class="ab-hero">
            <span class="ab-name">{{ assignedTailor.hero.name }}</span>
            <span class="ab-skill">Tailoring Lv.{{ artisan.getSkillLevel(artisan.assignedTailorKey, 'tailoring') }}</span>
            <div class="ab-xp-wrap">
              <div class="ab-xp-track">
                <div class="ab-xp-fill" :style="{ width: tailorXpPct + '%' }" />
              </div>
              <span class="ab-xp-text">
                {{ artisan.getSkillXp(artisan.assignedTailorKey, 'tailoring') }}
                / {{ artisan.xpForLevel(artisan.getSkillLevel(artisan.assignedTailorKey, 'tailoring')) }}
              </span>
            </div>
          </div>
          <span class="ab-bonus">+{{ Math.round((weaveSpeed - 1) * 100) }}% speed</span>
          <button class="ab-remove" @click="artisan.unassignTailor()">×</button>
        </template>

        <template v-else>
          <button class="ab-assign" :disabled="eligibleTailors.length === 0" @click="showPicker = !showPicker">
            {{ eligibleTailors.length > 0 ? 'Assign Tailor' : 'No Tailors owned' }}
          </button>
          <Transition name="ab-drop">
            <div class="ab-picker" v-if="showPicker && eligibleTailors.length > 0">
              <button
                v-for="{ key, hero } in eligibleTailors"
                :key="key"
                class="ab-pick-row"
                @click="assignTailor(key)"
              >
                <span class="ab-pick-name">{{ hero.name }}</span>
                <span class="ab-pick-level">Lv.{{ artisan.getSkillLevel(key, 'tailoring') }}</span>
                <span class="ab-pick-bonus">+{{ Math.round((artisan.tailorSpeedMultiplier(key) - 1) * 100) }}%</span>
              </button>
            </div>
          </Transition>
        </template>
      </div>

      <!-- Tailoring XP bar -->
      <div class="skill-xp-bar">
        <div class="skill-xp-header">
          <span class="skill-xp-label">✦ Tailoring</span>
          <span class="skill-xp-level">Lv. {{ resources.tailoringLevel }}</span>
          <span class="skill-xp-count">{{ resources.tailoringXpInLevel }} / {{ resources.XP_PER_LEVEL }} XP</span>
        </div>
        <div class="skill-xp-track">
          <div class="skill-xp-fill" :style="{ width: (resources.tailoringProgress * 100) + '%' }" />
        </div>
      </div>

    </main>

    <!-- ── Right: Stockpile ─────────────────────────────────────── -->
    <aside class="stock-panel">
      <div class="panel-label">Stockpile</div>

      <div class="panel-sublabel">Fibers</div>
      <div class="stock-list">
        <div
          v-for="fiber in FIBER_LIST"
          :key="fiber.id"
          class="stock-row"
          :class="{
            empty: !resources.fibers[fiber.id],
            clickable: !!resources.fibers[fiber.id] && !!fiberToCloth[fiber.id],
            active: selectedType === 'weave' && selectedId === fiberToCloth[fiber.id]?.id,
          }"
          :style="{ '--mat-color': fiber.color }"
          @click="resources.fibers[fiber.id] && fiberToCloth[fiber.id] && selectWeave(fiberToCloth[fiber.id])"
        >
          <GameIcon :icon="fiberIcon(fiber.id)" :size="20" class="mat-icon" />
          <span class="stock-name">{{ fiber.name }}</span>
          <span class="stock-count">{{ resources.fibers[fiber.id] ?? 0 }}</span>
          <span class="stock-arrow" v-if="resources.fibers[fiber.id] && fiberToCloth[fiber.id]">→</span>
        </div>
      </div>

      <div class="panel-sublabel bar-sublabel">Cloth</div>
      <div class="stock-list">
        <div
          v-for="cloth in CLOTH_LIST"
          :key="cloth.id"
          class="stock-row"
          :class="{ empty: !resources.cloths[cloth.id] }"
          :style="{ '--mat-color': cloth.color }"
        >
          <GameIcon :icon="clothIcon(cloth.id)" :size="20" class="mat-icon" />
          <span class="stock-name">{{ cloth.name }}</span>
          <span class="stock-count">{{ resources.cloths[cloth.id] ?? 0 }}</span>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useResourceStore }   from '../stores/useResourceStore.js'
import { useInventoryStore }  from '../stores/useInventoryStore.js'
import { useWeavingStore }    from '../stores/useWeavingStore.js'
import { useArtisanStore }    from '../stores/useArtisanStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { createItemInstance, SLOT_LABELS } from '../game/Gear.js'
import { FIBER_LIST, FIBERS } from '../game/data/fibers.js'
import { CLOTH_LIST, CLOTHS } from '../game/data/cloths.js'
import { BOWSTRING_LIST, BOWSTRINGS } from '../game/data/bowstrings.js'
import { TAILORING_RECIPES, TAILORING_RECIPE_TIERS, TAILORING_XP_PER_TIER } from '../game/data/tailoringRecipes.js'
import { STAT_LABELS, formatStatValue } from '../game/data/recipes.js'
import { SLOT_TO_ICON, tierSlotIcon, fiberIcon, clothIcon } from '../game/data/spritesheet.js'
import GameIcon from './ui/GameIcon.vue'
import tailoringBg from '../assets/backgrounds/tailoring_bg.png'

const bg = tailoringBg

const resources  = useResourceStore()
const inventory  = useInventoryStore()
const weaving    = useWeavingStore()
const artisan    = useArtisanStore()
const collection = useCollectionStore()

const showPicker  = ref(false)
const selectedType = ref(null)  // 'weave' | 'craft' | null
const selectedId   = ref(null)
const weaveQty     = ref(1)
const craftResult  = ref(null)
let _flashTimer = null

watch(selectedId, () => { weaveQty.value = 1 })

const selected       = computed(() => selectedType.value === 'craft' ? TAILORING_RECIPES.find(r => r.id === selectedId.value) ?? null : null)
const selectedCloth  = computed(() => selectedType.value === 'weave' ? CLOTHS[selectedId.value] ?? null : null)
const selectedTierColor = computed(() => TAILORING_RECIPE_TIERS.find(t => t.id === selected.value?.tier)?.color ?? '#a080e0')
const selectedTierName  = computed(() => TAILORING_RECIPE_TIERS.find(t => t.id === selected.value?.tier)?.name ?? '')

const openTier = ref(null)
function toggleTier(id) { openTier.value = openTier.value === id ? null : id }

function selectWeave(cloth)   { selectedType.value = 'weave'; selectedId.value = cloth.id  }
function selectCraft(recipe)  { selectedType.value = 'craft'; selectedId.value = recipe.id }

function canAffordBowstring(bs) {
  return (resources.cloths[bs.clothId] ?? 0) >= bs.clothCost
}

function craftBowstring(bs) {
  if (!canAffordBowstring(bs)) return
  resources.removeCloth(bs.clothId, bs.clothCost)
  resources.addBowstring(bs.id, 1)
  resources.addTailoringXp(5)
  craftResult.value = bs.name
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { craftResult.value = null }, 3000)
}

function canAfford(recipe) {
  if (!recipe?.materialCost) return false
  return Object.entries(recipe.materialCost).every(([id, amt]) => (resources.cloths[id] ?? 0) >= amt)
}

const fiberToCloth = computed(() => {
  const map = {}
  for (const c of CLOTH_LIST) map[c.fiberId] = c
  return map
})

const maxWeave = computed(() => {
  if (!selectedCloth.value) return 0
  return Math.floor((resources.fibers[selectedCloth.value.fiberId] ?? 0) / selectedCloth.value.fiberCost)
})

const isMyWeaveJob = computed(() => weaving.isRunning && weaving.job?.clothId === selectedId.value)

const weaveEta = computed(() => {
  if (!weaving.isRunning || !weaving.job) return 0
  return Math.max(0, (weaving.remainingCount - weaving.currentProgress) * weaving.job.timePerBolt)
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
  weaveQty.value = Math.max(1, Math.min(Math.max(1, maxWeave.value), weaveQty.value + delta))
}

// Artisan helpers
const eligibleTailors = computed(() =>
  collection.roster.filter(({ hero }) =>
    hero.artisanSkills?.some(s => s.id === 'tailoring')
  )
)

const assignedTailor = computed(() => {
  const key = artisan.assignedTailorKey
  if (!key) return null
  return eligibleTailors.value.find(e => e.key === key) ?? null
})

const weaveSpeed = computed(() => {
  if (!assignedTailor.value) return 1.0
  return artisan.tailorSpeedMultiplier(artisan.assignedTailorKey)
})

const tailorXpPct = computed(() => {
  const key = artisan.assignedTailorKey
  if (!key) return 0
  const level = artisan.getSkillLevel(key, 'tailoring')
  const xp    = artisan.getSkillXp(key, 'tailoring')
  return Math.round((xp / artisan.xpForLevel(level)) * 100)
})

function assignTailor(key) {
  artisan.assignTailor(key)
  showPicker.value = false
}

function startWeave() {
  if (!selectedCloth.value || maxWeave.value <= 0) return
  weaving.startWeave(selectedCloth.value.id, Math.min(weaveQty.value, maxWeave.value), weaveSpeed.value)
}

function addToWeaveQueue() {
  if (!selectedCloth.value || maxWeave.value <= 0) return
  weaving.addToQueue(selectedCloth.value.id, Math.min(weaveQty.value, maxWeave.value))
}

function craft() {
  if (!selected.value || !canAfford(selected.value)) return
  const recipe = selected.value
  Object.entries(recipe.materialCost).forEach(([id, amt]) => resources.removeCloth(id, amt))
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
  instance.craftDiscipline = 'tailoring'
  inventory.addInstance(instance)
  resources.addTailoringXp(TAILORING_XP_PER_TIER[recipe.tier] ?? 8)
  craftResult.value = recipe.name
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { craftResult.value = null }, 3000)
}

function craftFullSet(tier) {
  const affordable = tier.recipes.filter(r => canAfford(r))
  if (!affordable.length) return
  for (const recipe of affordable) {
    Object.entries(recipe.materialCost).forEach(([id, amt]) => resources.removeCloth(id, amt))
    const instance = createItemInstance({
      id: recipe.id, name: recipe.name, gearType: recipe.gearType,
      weaponType: null, rarity: recipe.rarity, description: recipe.desc,
      stats: { ...recipe.baseStats }, baseStats: { ...recipe.baseStats },
      tier: recipe.tier, slot: recipe.slot, armorType: recipe.armorType,
    })
    instance.craftedAt       = Date.now()
    instance.crafted         = true
    instance.craftDiscipline = 'tailoring'
    inventory.addInstance(instance)
    resources.addTailoringXp(TAILORING_XP_PER_TIER[recipe.tier] ?? 8)
  }
  craftResult.value = `${affordable.length} ${tier.name} pieces crafted`
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { craftResult.value = null }, 3000)
}
</script>

<style scoped>
.tailoring {
  position: relative; display: flex; height: 100%; min-height: 100%;
  overflow: hidden; border-radius: 12px;
}
.tailoring-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.40; pointer-events: none; z-index: 0; border-radius: 12px;
  filter: hue-rotate(200deg) saturate(0.6);
}
.tailoring-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right,
    rgba(2,2,12,0.97) 0%, rgba(2,2,12,0.55) 18%,
    rgba(2,2,12,0.25) 50%, rgba(2,2,12,0.55) 82%, rgba(2,2,12,0.97) 100%
  );
  pointer-events: none; z-index: 1; border-radius: 12px;
}
.panel-label {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 2.5px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 10px; border-bottom: 1px solid rgba(160,128,224,0.25); margin-bottom: 12px;
}

/* ── Left panel ─────────────────────────────────────────────────── */
.recipe-panel {
  width: 210px; flex-shrink: 0; position: relative; z-index: 2;
  border-right: 1px solid rgba(160,128,224,0.25);
  background: rgba(2,2,12,0.90); backdrop-filter: blur(8px);
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
  padding-bottom: 14px; border-bottom: 1px solid rgba(160,128,224,0.12); position: relative; z-index: 1;
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
.tco-cost { font-family: var(--font-head); font-size: 0.65rem; font-weight: 700; color: rgba(160,128,224,0.7); }
.tco-arrow { font-size: 1.3rem; color: rgba(160,128,224,0.35); }
.tco-yield { font-family: var(--font-head); font-size: 0.6rem; color: var(--text-dim); }

.qty-row { display: flex; align-items: center; gap: 4px; position: relative; z-index: 1; }
.qty-adj {
  width: 34px; height: 34px; border-radius: 6px; border: 1px solid rgba(160,128,224,0.2);
  background: rgba(255,255,255,0.03); color: var(--text-muted);
  font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: all 0.12s;
}
.qty-adj:not(:disabled):hover { background: rgba(255,255,255,0.07); border-color: #6040a8; color: #c0a0ff; }
.qty-adj:disabled { opacity: 0.28; cursor: not-allowed; }
.qty-val { min-width: 48px; text-align: center; font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; color: #c0a0ff; }
.qty-max {
  padding: 0 10px; height: 34px; border-radius: 6px; border: 1px solid rgba(160,128,224,0.2);
  background: rgba(255,255,255,0.03); color: var(--text-dim);
  font-family: var(--font-head); font-size: 0.6rem; font-weight: 700; cursor: pointer;
  letter-spacing: 1px; text-transform: uppercase; transition: all 0.12s; margin-left: 4px;
}
.qty-max:not(:disabled):hover { background: rgba(255,255,255,0.06); border-color: #6040a8; color: #c0a0ff; }
.qty-max:disabled { opacity: 0.28; cursor: not-allowed; }
.tan-eta-hint { font-size: 0.6rem; color: var(--text-dim); font-style: italic; position: relative; z-index: 1; }
.action-btn {
  padding: 12px 44px; border-radius: 8px; border: 1px solid rgba(160,128,224,0.2);
  background: linear-gradient(135deg, #080412 0%, #040208 100%);
  color: var(--text-dim); font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase; cursor: not-allowed; transition: all 0.2s;
  position: relative; z-index: 1;
}
.action-btn.ready {
  border-color: #6040a8; background: linear-gradient(135deg, #180830 0%, #0a0418 100%);
  color: #c0a0ff; cursor: pointer; box-shadow: 0 0 20px rgba(128,80,200,0.25);
}
.action-btn.ready:hover {
  background: linear-gradient(135deg, #280d50 0%, #160830 100%);
  border-color: #c0a0ff; box-shadow: 0 0 32px rgba(160,100,240,0.40);
}
.action-btn--queue { padding: 9px 32px; font-size: 0.78rem; }
.run-header { display: flex; align-items: baseline; gap: 10px; width: 100%; max-width: 360px; position: relative; z-index: 1; }
.run-title { flex: 1; font-family: var(--font-head); font-size: 0.62rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); }
.run-count { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: #c0a0ff; }
.progress-wrap { display: flex; align-items: center; gap: 10px; width: 100%; max-width: 360px; position: relative; z-index: 1; }
.progress-track { flex: 1; height: 8px; background: rgba(255,255,255,0.07); border-radius: 4px; overflow: hidden; border: 1px solid rgba(160,128,224,0.2); }
.progress-fill { height: 100%; background: linear-gradient(to right, #a080e0, #c0a0ff); border-radius: 4px; transition: width 0.8s linear; }
.progress-eta { font-family: var(--font-head); font-size: 0.68rem; color: rgba(160,128,224,0.8); flex-shrink: 0; min-width: 50px; text-align: right; }
.cancel-btn {
  padding: 8px 24px; border-radius: 6px; border: 1px solid #3a2050; background: rgba(58,32,80,0.25);
  color: #a080c0; font-family: var(--font-head); font-size: 0.68rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.15s; position: relative; z-index: 1;
}
.cancel-btn:hover { border-color: #8040cc; background: rgba(80,32,120,0.4); color: #e0c0ff; }
.busy-msg { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(160,128,224,0.15); background: rgba(4,2,16,0.6); position: relative; z-index: 1; }
.busy-icon { font-size: 1.1rem; color: #a080e0; opacity: 0.7; }
.busy-text { display: flex; flex-direction: column; gap: 1px; }
.busy-title { font-family: var(--font-head); font-size: 0.65rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1.5px; }
.busy-sub { font-size: 0.62rem; color: var(--text-dim); }
.busy-bar { width: 100%; max-width: 300px; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; position: relative; z-index: 1; }
.busy-fill { height: 100%; background: linear-gradient(to right, #a080e0, #c0a0ff); border-radius: 2px; transition: width 0.8s linear; }

/* Craft mode */
.work-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; }
.work-item-name { font-family: var(--font-head); font-size: 1.2rem; font-weight: 800; color: #fff; letter-spacing: 2px; }
.work-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.work-badge { font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; padding: 2px 10px; border-radius: 10px; border: 1px solid; }
.tier-badge { color: var(--tier-color); border-color: color-mix(in srgb, var(--tier-color) 40%, transparent); background: color-mix(in srgb, var(--tier-color) 10%, transparent); }
.slot-badge { color: var(--text-muted); border-color: rgba(160,128,224,0.2); background: rgba(255,255,255,0.03); }
.rarity-badge.common { color: #aaa; border-color: #333; background: rgba(255,255,255,0.03); }
.work-idle { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; opacity: 0.35; padding: 40px 0; }
.work-idle-icon { font-size: 2.4rem; }
.work-idle-text { font-size: 0.78rem; color: var(--text-muted); font-style: italic; }
.item-showcase {
  position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 160px; height: 160px;
  border: 1.5px solid color-mix(in srgb, var(--tier-color) 30%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--tier-color) 8%, rgba(2,1,10,0.85));
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
.work-col-label { font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); font-weight: 700; padding-bottom: 5px; border-bottom: 1px solid rgba(80,40,120,0.4); }
.work-stats { display: flex; gap: 6px; flex-wrap: wrap; }
.work-stat { display: flex; flex-direction: column; align-items: center; gap: 1px; background: rgba(0,0,0,0.35); border: 1px solid rgba(80,40,120,0.3); border-radius: 6px; padding: 7px 12px; min-width: 58px; }
.ws-label { font-size: 0.54rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-family: var(--font-head); }
.ws-val { font-size: 0.95rem; font-weight: 800; color: #c0a0ff; font-family: var(--font-head); }
.work-materials { display: flex; flex-direction: column; gap: 5px; }
.material-row { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--ore-color) 20%, transparent); background: color-mix(in srgb, var(--ore-color) 6%, rgba(0,0,0,0.3)); }
.mat-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--ore-color); box-shadow: 0 0 5px var(--ore-color); flex-shrink: 0; }
.mat-dot-plain { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.tan-btn.unaffordable { opacity: 0.38; }
.bs-stock { font-size: 0.6rem; font-weight: 700; color: #666; min-width: 18px; text-align: right; }
.bs-stock.short { color: #884444; }
.mat-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); }
.mat-tally { display: flex; align-items: baseline; gap: 2px; flex-shrink: 0; }
.mat-have { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: #666; }
.mat-have.ok { color: var(--ore-color); }
.mat-sep { font-size: 0.6rem; color: var(--text-dim); }
.mat-need { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }
.work-actions { display: flex; align-items: center; gap: 12px; }
.work-btn {
  display: flex; align-items: center; gap: 8px; padding: 12px 40px; border-radius: 8px;
  border: 1px solid rgba(160,128,224,0.2); background: linear-gradient(135deg, #080412 0%, #040208 100%);
  color: var(--text-dim); font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase; cursor: not-allowed; transition: all 0.2s;
}
.work-btn.ready {
  border-color: #6040a8; background: linear-gradient(135deg, #180830 0%, #0a0418 100%);
  color: #c0a0ff; cursor: pointer; box-shadow: 0 0 20px rgba(128,80,200,0.25);
}
.work-btn.ready:hover {
  background: linear-gradient(135deg, #280d50 0%, #160830 100%);
  border-color: #c0a0ff; box-shadow: 0 0 32px rgba(160,100,240,0.40);
}
.craft-result { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-radius: 8px; border: 1px solid #2a4a5a; background: rgba(10,20,30,0.75); }
.cr-icon { font-size: 1.1rem; color: #88ddff; }
.cr-text { display: flex; flex-direction: column; gap: 1px; }
.cr-name { font-size: 0.8rem; font-weight: 700; color: #c0e8ff; font-family: var(--font-head); }
.cr-sub { font-size: 0.6rem; color: #3a5a6a; }
.forge-pop-enter-active { animation: forge-flash 0.3s ease-out; }
.forge-pop-leave-active { transition: opacity 0.4s ease; }
.forge-pop-leave-to { opacity: 0; }
@keyframes forge-flash { from { transform: translateY(6px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

/* Artisan bar */
.artisan-bar {
  width: 100%; max-width: 440px; position: relative;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 10px 14px; border-radius: 8px;
  border: 1px solid rgba(160,128,224,0.20);
  background: rgba(0,0,0,0.35); backdrop-filter: blur(4px); margin-top: auto;
}
.ab-label { font-family: var(--font-head); font-size: 0.6rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); font-weight: 700; flex-shrink: 0; }
.ab-hero { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; flex-wrap: wrap; }
.ab-name { font-size: 0.72rem; font-weight: 700; color: var(--text-parchment); }
.ab-skill { font-size: 0.6rem; color: #a080e0; font-family: var(--font-head); font-weight: 700; }
.ab-xp-wrap { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.ab-xp-track { width: 72px; height: 4px; background: rgba(255,255,255,0.07); border-radius: 2px; overflow: hidden; }
.ab-xp-fill { height: 100%; background: linear-gradient(to right, #a080e0, #c0a0ff); border-radius: 2px; transition: width 0.4s ease; }
.ab-xp-text { font-size: 0.56rem; color: var(--text-dim); white-space: nowrap; }
.ab-bonus { font-family: var(--font-head); font-size: 0.65rem; font-weight: 800; color: #4dff88; background: rgba(77,255,136,0.08); border: 1px solid rgba(77,255,136,0.2); border-radius: 6px; padding: 2px 8px; white-space: nowrap; flex-shrink: 0; }
.ab-remove { width: 22px; height: 22px; border-radius: 50%; border: 1px solid #3a2050; background: rgba(58,32,80,0.3); color: #a080c0; font-size: 0.7rem; font-weight: 700; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.ab-remove:hover { border-color: #8040cc; background: rgba(80,32,120,0.5); color: #e0c0ff; }
.ab-assign { flex: 1; padding: 6px 12px; border-radius: 6px; border: 1px dashed rgba(160,128,224,0.22); background: transparent; color: var(--text-dim); font-size: 0.66rem; font-family: var(--font-head); cursor: pointer; transition: all 0.15s; text-align: left; }
.ab-assign:not(:disabled):hover { border-color: #6040a8; color: #c0a0ff; }
.ab-assign:disabled { opacity: 0.3; cursor: not-allowed; }
.ab-picker { position: absolute; bottom: calc(100% + 6px); left: 0; right: 0; z-index: 10; background: rgba(4,2,16,0.97); border: 1px solid rgba(160,128,224,0.35); border-radius: 8px; overflow: hidden; box-shadow: 0 -8px 32px rgba(0,0,0,0.8); }
.ab-pick-row { width: 100%; display: flex; align-items: center; gap: 10px; padding: 9px 14px; background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background 0.1s; text-align: left; }
.ab-pick-row:last-child { border-bottom: none; }
.ab-pick-row:hover { background: rgba(255,255,255,0.05); }
.ab-pick-name { flex: 1; font-size: 0.7rem; font-weight: 600; color: var(--text-parchment); }
.ab-pick-level { font-size: 0.6rem; color: #a080e0; font-family: var(--font-head); }
.ab-pick-bonus { font-size: 0.6rem; color: #4dff88; font-family: var(--font-head); font-weight: 700; }
.ab-drop-enter-active { transition: opacity 0.15s, transform 0.15s; }
.ab-drop-leave-active { transition: opacity 0.1s; }
.ab-drop-enter-from { opacity: 0; transform: translateY(4px); }
.ab-drop-leave-to { opacity: 0; }

/* Skill XP bar */
.skill-xp-bar { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 6px; }
.skill-xp-header { display: flex; align-items: baseline; gap: 8px; }
.skill-xp-label { font-family: var(--font-head); font-size: 0.62rem; font-weight: 700; color: #a080e0; text-transform: uppercase; letter-spacing: 1.5px; flex: 1; }
.skill-xp-level { font-family: var(--font-head); font-size: 0.75rem; font-weight: 800; color: #c0a0ff; }
.skill-xp-count { font-size: 0.6rem; color: var(--text-muted); }
.skill-xp-track { height: 6px; background: #080418; border-radius: 3px; overflow: hidden; border: 1px solid rgba(80,40,120,0.4); }
.skill-xp-fill { height: 100%; background: linear-gradient(to right, #a080e0, #c0a0ff); border-radius: 3px; transition: width 0.6s ease; }

/* ── Right: Stockpile ───────────────────────────────────────────── */
.stock-panel {
  width: 190px; flex-shrink: 0; position: relative; z-index: 2;
  border-left: 1px solid rgba(160,128,224,0.25);
  background: rgba(2,2,12,0.90); backdrop-filter: blur(8px);
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
@media (max-width: 640px) {
  .tailoring { flex-direction: column; overflow-y: auto; overflow-x: hidden; }
  .recipe-panel { width: 100%; border-right: none; border-bottom: 1px solid rgba(160,128,224,0.25); max-height: 200px; flex-shrink: 0; }
  .stock-panel { width: 100%; border-left: none; border-top: 1px solid rgba(160,128,224,0.25); flex-shrink: 0; max-height: 220px; }
  .work-area { padding: 12px 10px; }
}
</style>
