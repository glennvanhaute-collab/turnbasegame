<template>
  <div class="woodworking">

    <div class="ww-bg" :style="{ backgroundImage: `url(${wwBg})` }" />
    <div class="ww-overlay" />

    <!-- ── Left: Recipe list ───────────────────────────────────────── -->
    <aside class="recipe-panel">
      <div class="panel-label">Recipes</div>

      <div class="recipe-section-head">🪵 Planks</div>
      <div class="plank-group">
        <button
          v-for="plank in PLANK_LIST"
          :key="plank.id"
          class="plank-btn"
          :style="{ '--pc': plank.color }"
          :disabled="(resources.logs[plank.id] ?? 0) < plank.logCost"
          @click="makePlanks(plank.id)"
        >
          <span class="pb-dot" />
          <span class="pb-name">{{ plank.name }}</span>
          <span class="pb-cost">{{ plank.logCost }} logs → 1</span>
          <span class="pb-stock" :class="{ short: (resources.logs[plank.id] ?? 0) < plank.logCost }">
            {{ resources.logs[plank.id] ?? 0 }}
          </span>
        </button>
      </div>

      <div class="recipe-section-head">⚐ Carve</div>
      <div class="tier-group" v-for="tier in WOOD_RECIPE_TIERS" :key="tier.id">
        <div
          class="tier-header"
          :class="{
            locked: isTierLocked(tier.id),
            'no-stock': !isTierLocked(tier.id) && tier.recipes.every(r => !canAfford(r)),
            collapsible: true,
          }"
          :style="{ '--tier-color': tier.color }"
          @click="!isTierLocked(tier.id) && toggleTier(tier.id)"
        >
          <span class="tier-dot" />
          <span class="tier-name">{{ tier.name }}</span>
          <span class="tier-count" v-if="!isTierLocked(tier.id)">{{ tier.recipes.length }}</span>
          <span class="tier-soon" v-else>—</span>
          <span class="tier-chevron" v-if="!isTierLocked(tier.id)">{{ openTier === tier.id ? '⌄' : '›' }}</span>
        </div>

        <div class="tier-skill-lock" v-if="isTierLocked(tier.id)">
          ⚐ Requires Woodworking Lv.{{ tier.woodworkingLevel }}
        </div>
        <template v-else-if="openTier === tier.id">
          <button
            v-for="recipe in tier.recipes"
            :key="recipe.id"
            class="recipe-btn"
            :class="{ active: selectedId === recipe.id, unaffordable: !canAfford(recipe) }"
            :style="{ '--tier-color': tier.color }"
            @click="selectRecipe(recipe)"
          >
            <GameIcon :icon="`ww_${recipe.tier}_${recipe.weaponType}`" :size="20" class="recipe-type-badge" :class="recipe.finishType" />
            <span class="recipe-name">{{ recipe.name }}</span>
            <span class="recipe-cost">
              <template v-if="recipe.plankCost">
                <span
                  v-for="(amt, woodId) in recipe.plankCost"
                  :key="woodId"
                  class="cost-pill"
                  :class="{ short: (resources.planks[woodId] ?? 0) < amt }"
                >{{ amt }}p</span>
                <span
                  v-if="recipe.bowstringCost"
                  class="cost-pill string-pill"
                  :class="{ short: (resources.bowstrings[recipe.bowstringCost] ?? 0) < 1 }"
                >🏹</span>
              </template>
              <template v-else>
                <span
                  v-for="(amt, woodId) in recipe.logCost"
                  :key="woodId"
                  class="cost-pill"
                  :class="{ short: (resources.logs[woodId] ?? 0) < amt }"
                >{{ amt }}</span>
              </template>
            </span>
          </button>
        </template>
      </div>
    </aside>

    <!-- ── Center: Craft area ─────────────────────────────────────── -->
    <main class="craft-area">

      <!-- Item header -->
      <div class="craft-header" v-if="selected">
        <div class="craft-item-name">{{ selected.name }}</div>
        <div class="craft-badges">
          <span class="craft-badge tier-badge" :style="{ '--tier-color': selectedTierColor }">
            {{ selectedTierName }} Tier
          </span>
          <span class="craft-badge type-badge" :class="selected.finishType">
            {{ selected.weaponType === 'bow' ? 'Bow' : 'Staff' }}
          </span>
          <span class="craft-badge unfinished-badge">
            {{ selected.finishType === 'string' ? 'Needs Stringing' : 'Needs Imbuing' }}
          </span>
        </div>
      </div>

      <!-- Idle -->
      <div class="craft-idle" v-if="!selected">
        <div class="craft-idle-icon">⚐</div>
        <div class="craft-idle-text">Select a recipe to begin carving</div>
      </div>

      <!-- Item showcase -->
      <template v-if="selected">
        <div
          class="item-showcase"
          :class="{ ready: canAfford(selected) }"
          :style="{ '--tier-color': selectedTierColor }"
        >
          <div class="showcase-glow" />
          <div class="showcase-icon-wrap">
            <GameIcon :icon="`ww_${selected.tier}_${selected.weaponType}`" :size="96" class="showcase-weapon-icon" />
          </div>
          <div class="unfinished-tag" :class="selected.finishType">
            {{ selected.finishType === 'string' ? 'Unstrung' : 'Unimbued' }}
          </div>
        </div>
      </template>

      <!-- Description -->
      <p class="craft-desc" v-if="selected">{{ selected.desc }}</p>

      <!-- Stats + materials -->
      <div class="craft-details" v-if="selected">
        <div class="craft-col">
          <div class="craft-col-label">Base Stats</div>
          <div class="craft-stats">
            <div class="craft-stat" v-for="(val, key) in selected.baseStats" :key="key">
              <span class="craft-stat-label">{{ STAT_LABELS[key] ?? key }}</span>
              <span class="craft-stat-val">{{ formatStatValue(key, val) }}</span>
            </div>
          </div>
        </div>
        <div class="craft-col">
          <div class="craft-col-label">Materials</div>
          <div class="craft-materials">
            <template v-if="selected.plankCost">
              <div
                class="material-row"
                v-for="(amt, woodId) in selected.plankCost"
                :key="woodId"
                :style="{ '--wood-color': WOODS[woodId]?.color ?? '#888' }"
              >
                <span class="mat-dot" />
                <span class="mat-name">{{ WOODS[woodId]?.name ?? woodId }} Planks</span>
                <span class="mat-tally">
                  <span class="mat-have" :class="{ ok: (resources.planks[woodId] ?? 0) >= amt }">{{ resources.planks[woodId] ?? 0 }}</span>
                  <span class="mat-sep">/</span>
                  <span class="mat-need">{{ amt }}</span>
                </span>
              </div>
              <div class="material-row" v-if="selected.bowstringCost" :style="{ '--wood-color': BOWSTRINGS[selected.bowstringCost]?.color ?? '#888' }">
                <span class="mat-dot" />
                <span class="mat-name">{{ BOWSTRINGS[selected.bowstringCost]?.name }}</span>
                <span class="mat-tally">
                  <span class="mat-have" :class="{ ok: (resources.bowstrings[selected.bowstringCost] ?? 0) >= 1 }">{{ resources.bowstrings[selected.bowstringCost] ?? 0 }}</span>
                  <span class="mat-sep">/</span>
                  <span class="mat-need">1</span>
                </span>
              </div>
            </template>
            <template v-else>
              <div
                class="material-row"
                v-for="(amt, woodId) in selected.logCost"
                :key="woodId"
                :style="{ '--wood-color': WOODS[woodId]?.color ?? '#888' }"
              >
                <span class="mat-dot" />
                <span class="mat-name">{{ WOODS[woodId]?.name ?? woodId }}</span>
                <span class="mat-tally">
                  <span class="mat-have" :class="{ ok: (resources.logs[woodId] ?? 0) >= amt }">{{ resources.logs[woodId] ?? 0 }}</span>
                  <span class="mat-sep">/</span>
                  <span class="mat-need">{{ amt }}</span>
                </span>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- Craft button -->
      <div class="craft-actions" v-if="selected">
        <button
          class="craft-btn"
          :class="{ ready: canAfford(selected) && !isTierLocked(selected.tier) }"
          :disabled="!canAfford(selected) || isTierLocked(selected.tier)"
          @click="carve"
        >
          <span class="craft-btn-icon">⚐</span>
          Carve
        </button>
        <span class="craft-hint" v-if="isTierLocked(selected.tier)">Requires Woodworking Lv.{{ selectedTier?.woodworkingLevel }}</span>
        <span class="craft-hint" v-else-if="!canAfford(selected)">Need more logs</span>
        <span class="craft-hint finish-hint" v-else-if="selected.finishType === 'string'">Needs a bowstring from Tailoring to complete</span>
        <span class="craft-hint finish-hint" v-else-if="selected.finishType === 'imbue'">Needs Runesmithing inscription to complete</span>
      </div>

      <!-- Success flash -->
      <Transition name="craft-pop">
        <div class="craft-result" v-if="craftResult">
          <span class="craft-result-icon">✓</span>
          <div class="craft-result-text">
            <span class="craft-result-name">{{ craftResult }}</span>
            <span class="craft-result-sub">added to inventory (unfinished)</span>
          </div>
        </div>
      </Transition>

      <!-- Carpenter assignment bar -->
      <div class="carpenter-bar">
        <span class="cpb-label">⚐ Carpenter</span>

        <template v-if="assignedCarpenter">
          <div class="cpb-hero">
            <span class="cpb-name">{{ assignedCarpenter.hero.name }}</span>
            <span class="cpb-skill">
              Woodworking Lv.{{ artisan.getSkillLevel(artisan.assignedCarpenterKey, 'woodworking') }}
            </span>
            <div class="cpb-xp-wrap">
              <div class="cpb-xp-track">
                <div class="cpb-xp-fill" :style="{ width: carpenterXpPct + '%' }" />
              </div>
            </div>
          </div>
          <span class="cpb-bonus">+{{ carpenterXpBonus }}% XP</span>
          <button class="cpb-remove" @click="artisan.unassignCarpenter()">×</button>
        </template>

        <template v-else>
          <button
            class="cpb-assign"
            :disabled="eligibleCarpenters.length === 0"
            @click="showCarpenterPicker = !showCarpenterPicker"
          >{{ eligibleCarpenters.length > 0 ? 'Assign Carpenter' : 'No Woodworkers owned' }}</button>

          <Transition name="cpb-drop">
            <div class="cpb-picker" v-if="showCarpenterPicker && eligibleCarpenters.length > 0">
              <button
                v-for="{ key, hero } in eligibleCarpenters"
                :key="key"
                class="cpb-pick-row"
                @click="assignCarpenter(key)"
              >
                <span class="cpb-pick-name">{{ hero.name }}</span>
                <span class="cpb-pick-level">Lv.{{ artisan.getSkillLevel(key, 'woodworking') }}</span>
              </button>
            </div>
          </Transition>
        </template>
      </div>

      <!-- Woodworking XP bar -->
      <div class="ww-xp-bar">
        <div class="ww-xp-header">
          <span class="ww-xp-label">⚐ Woodworking</span>
          <span class="ww-xp-level">Lv. {{ resources.woodworkingLevel }}</span>
          <span class="ww-xp-count">{{ resources.woodworkingXpInLevel }} / {{ resources.XP_PER_LEVEL }} XP</span>
        </div>
        <div class="ww-xp-track">
          <div class="ww-xp-fill" :style="{ width: (resources.woodworkingProgress * 100) + '%' }" />
        </div>
      </div>

    </main>

    <!-- ── Right: Log stockpile ──────────────────────────────────── -->
    <aside class="log-panel">
      <div class="panel-label">Stockpile</div>

      <div class="panel-sublabel">Logs</div>
      <div class="log-list">
        <div
          v-for="wood in WOOD_LIST"
          :key="wood.id"
          class="log-row"
          :class="{ empty: !resources.logs[wood.id] }"
          :style="{ '--wood-color': wood.color }"
        >
          <GameIcon :icon="`ww_${wood.id}_logs`" :size="20" class="log-icon" />
          <span class="log-name">{{ wood.name }}</span>
          <span class="log-count">{{ resources.logs[wood.id] ?? 0 }}</span>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import GameIcon from './ui/GameIcon.vue'
import { useResourceStore } from '../stores/useResourceStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useArtisanStore } from '../stores/useArtisanStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useAdvisorStore } from '../stores/useAdvisorStore.js'
import { createItemInstance } from '../game/Gear.js'
import { WOODS, WOOD_LIST } from '../game/data/woods.js'
import { PLANK_LIST, PLANKS } from '../game/data/planks.js'
import { BOWSTRINGS } from '../game/data/bowstrings.js'
import { WOOD_RECIPE_TIERS } from '../game/data/woodworkingRecipes.js'
import { STAT_LABELS, formatStatValue } from '../game/data/recipes.js'
import wwBg from '../assets/backgrounds/woodworking_bg.png'

const resources  = useResourceStore()
const inventory  = useInventoryStore()
const artisan    = useArtisanStore()
const collection = useCollectionStore()
const advisor    = useAdvisorStore()

const showCarpenterPicker = ref(false)
const selectedId   = ref(null)
const craftResult  = ref(null)
const openTier     = ref(null)
let _flashTimer = null

const selected     = computed(() => {
  if (!selectedId.value) return null
  for (const tier of WOOD_RECIPE_TIERS) {
    const found = tier.recipes.find(r => r.id === selectedId.value)
    if (found) return found
  }
  return null
})

const selectedTier      = computed(() => selected.value ? WOOD_RECIPE_TIERS.find(t => t.id === selected.value.tier) : null)
const selectedTierColor = computed(() => selectedTier.value?.color ?? '#888')
const selectedTierName  = computed(() => selectedTier.value?.name ?? '')

function isTierLocked(tierId) {
  const tier = WOOD_RECIPE_TIERS.find(t => t.id === tierId)
  if (!tier) return false
  return resources.woodworkingLevel < (tier.woodworkingLevel ?? 1)
}

function canAfford(recipe) {
  if (recipe?.plankCost) {
    const planksOk = Object.entries(recipe.plankCost).every(([id, amt]) => (resources.planks[id] ?? 0) >= amt)
    const stringOk = !recipe.bowstringCost || (resources.bowstrings[recipe.bowstringCost] ?? 0) >= 1
    return planksOk && stringOk
  }
  if (recipe?.logCost) {
    return Object.entries(recipe.logCost).every(([id, amt]) => (resources.logs[id] ?? 0) >= amt)
  }
  return false
}

function makePlanks(woodId) {
  const plank = PLANKS[woodId]
  if (!plank) return
  if ((resources.logs[woodId] ?? 0) < plank.logCost) return
  resources.removeLog(woodId, plank.logCost)
  resources.addPlank(woodId, 1)
  resources.addWoodworkingXp(3)
}

function toggleTier(id) {
  openTier.value = openTier.value === id ? null : id
}

function selectRecipe(recipe) {
  selectedId.value = recipe.id
}

const eligibleCarpenters = computed(() =>
  collection.roster.filter(({ hero }) =>
    hero.artisanSkills?.some(s => s.id === 'woodworking')
  )
)

const assignedCarpenter = computed(() => {
  const key = artisan.assignedCarpenterKey
  if (!key) return null
  return eligibleCarpenters.value.find(e => e.key === key) ?? null
})

const carpenterXpPct = computed(() => {
  const key = artisan.assignedCarpenterKey
  if (!key) return 0
  const level = artisan.getSkillLevel(key, 'woodworking')
  const xp    = artisan.getSkillXp(key, 'woodworking')
  return Math.round((xp / artisan.xpForLevel(level)) * 100)
})

const carpenterXpBonus = computed(() => {
  const key = artisan.assignedCarpenterKey
  if (!key) return 0
  return 5 + artisan.getSkillLevel(key, 'woodworking') * 3
})

function assignCarpenter(key) {
  artisan.assignCarpenter(key)
  showCarpenterPicker.value = false
}

const XP_PER_TIER = { pine: 10, oak: 20, yew: 35, ashwood: 55, ironwood: 80, dragonwood: 120 }

function carve() {
  if (!selected.value || !canAfford(selected.value)) return
  if (isTierLocked(selected.value.tier)) return
  const recipe = selected.value

  if (recipe.plankCost) {
    Object.entries(recipe.plankCost).forEach(([id, amt]) => resources.removePlank(id, amt))
    if (recipe.bowstringCost) resources.removeBowstring(recipe.bowstringCost, 1)
  } else {
    Object.entries(recipe.logCost).forEach(([id, amt]) => resources.removeLog(id, amt))
  }

  const instance = createItemInstance({
    id:          recipe.id,
    name:        recipe.name,
    gearType:    recipe.gearType,
    weaponType:  recipe.weaponType,
    rarity:      recipe.rarity,
    description: recipe.desc,
    stats:       { ...recipe.baseStats },
    baseStats:   { ...recipe.baseStats },
    tier:        recipe.tier,
    slot:        recipe.slot,
    armorType:   recipe.armorType,
    unfinished:  true,
    finishType:  recipe.finishType,
  })
  instance.craftedAt = Date.now()
  instance.crafted   = true
  inventory.addInstance(instance)

  const baseXp = XP_PER_TIER[recipe.tier] ?? 10
  const bonus  = assignedCarpenter.value ? carpenterXpBonus.value / 100 : 0
  resources.addWoodworkingXp(Math.round(baseXp * (1 + bonus)))

  if (assignedCarpenter.value) {
    artisan.addSkillXp(artisan.assignedCarpenterKey, 'woodworking', Math.ceil(baseXp * 0.5))
  }

  craftResult.value = recipe.name
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { craftResult.value = null }, 3000)

  if (!localStorage.getItem('bow-tip-woodworking')) {
    localStorage.setItem('bow-tip-woodworking', '1')
    setTimeout(() => advisor.say([
      `A fine piece of work. The ${recipe.name} is in your inventory — but it is unfinished. ` +
      (recipe.finishType === 'string'
        ? `A bowstring is needed before it can be strung. Your tailor can craft one.`
        : `It needs rune inscription before its power manifests. A runesmith can imbue it.`),
    ]), 600)
  }
}
</script>

<style scoped>
/* ── Shell ─────────────────────────────────────────────────────── */
.woodworking {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  border-radius: 12px;
}

.ww-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.5; pointer-events: none; z-index: 0; border-radius: 12px;
}
.ww-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right,
    rgba(2,4,2,0.94) 0%,
    rgba(2,4,2,0.55) 18%,
    rgba(2,4,2,0.30) 50%,
    rgba(2,4,2,0.55) 82%,
    rgba(2,4,2,0.94) 100%
  );
  pointer-events: none; z-index: 1; border-radius: 12px;
}

.panel-label {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 2.5px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 10px; border-bottom: 1px solid var(--border-brown); margin-bottom: 12px;
}

/* ── Left: Recipe panel ─────────────────────────────────────────── */
.recipe-panel {
  width: 210px; flex-shrink: 0; position: relative; z-index: 2;
  border-right: 1px solid var(--border-gold);
  background: rgba(2,4,2,0.88); backdrop-filter: blur(8px);
  padding: 16px 12px; display: flex; flex-direction: column; overflow-y: auto;
}

.recipe-section-head {
  font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-dim); font-weight: 700;
  padding: 8px 4px 6px; margin-bottom: 4px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

/* Tier groups */
.tier-group { margin-bottom: 6px; }

.plank-group { display: flex; flex-direction: column; gap: 3px; margin-bottom: 8px; }
.plank-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 5px 8px; border-radius: 6px;
  background: transparent; border: 1px solid transparent;
  cursor: pointer; text-align: left; width: 100%;
  transition: background 0.1s, border-color 0.1s;
}
.plank-btn:hover:not(:disabled) { background: rgba(255,255,255,0.05); border-color: color-mix(in srgb, var(--pc) 30%, transparent); }
.plank-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.pb-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; background: var(--pc); }
.pb-name { flex: 1; font-size: 0.64rem; font-weight: 600; color: #887766; font-family: var(--font-head); }
.pb-cost { font-size: 0.58rem; color: #554433; font-family: var(--font-head); }
.pb-stock { font-size: 0.6rem; font-weight: 700; color: #666; min-width: 22px; text-align: right; }
.pb-stock.short { color: #884444; }
.tier-header {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 8px 5px; margin-bottom: 2px; cursor: pointer;
}
.tier-header.locked { opacity: 0.35; cursor: default; }
.tier-header.no-stock { opacity: 0.42; filter: saturate(0.25); }
.tier-header:not(.locked):hover .tier-name { color: #fff; }
.tier-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--tier-color); flex-shrink: 0; }
.tier-name {
  font-family: var(--font-head); font-size: 0.62rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px; color: var(--tier-color); flex: 1;
}
.tier-count { font-size: 0.55rem; color: var(--text-dim); background: rgba(255,255,255,0.05); border-radius: 8px; padding: 0 5px; line-height: 1.6; }
.tier-soon  { font-size: 0.55rem; color: var(--text-dim); }
.tier-chevron { font-size: 0.7rem; color: var(--text-dim); margin-left: auto; line-height: 1; }
.tier-skill-lock {
  font-size: 0.58rem; color: #3a5a38; font-style: italic;
  padding: 5px 8px 3px; letter-spacing: 0.3px;
}

.recipe-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 7px 8px; background: transparent; border: 1px solid transparent;
  border-radius: 6px; cursor: pointer; text-align: left;
  transition: background 0.12s, border-color 0.12s; margin-bottom: 2px;
}
.recipe-btn:hover {
  background: rgba(255,255,255,0.04);
  border-color: color-mix(in srgb, var(--tier-color) 25%, transparent);
}
.recipe-btn.active {
  background: color-mix(in srgb, var(--tier-color) 12%, rgba(0,0,0,0.4));
  border-color: color-mix(in srgb, var(--tier-color) 50%, transparent);
}
.recipe-btn.unaffordable { opacity: 0.42; }
.recipe-type-badge {
  flex-shrink: 0;
  image-rendering: pixelated;
}
.recipe-type-badge.string { filter: drop-shadow(0 0 3px #6bba4a); }
.recipe-type-badge.imbue  { filter: drop-shadow(0 0 3px #b44fff); }
.recipe-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.recipe-cost { display: flex; gap: 3px; flex-shrink: 0; }
.cost-pill {
  font-size: 0.6rem; font-family: var(--font-head); font-weight: 700;
  color: var(--tier-color); background: color-mix(in srgb, var(--tier-color) 12%, transparent);
  border-radius: 8px; padding: 0 5px; line-height: 1.6;
}
.cost-pill.short { color: #ff6b6b; background: rgba(255,107,107,0.12); }

/* ── Center: Craft area ─────────────────────────────────────────── */
.craft-area {
  flex: 1; position: relative; z-index: 2;
  padding: 0 16px 20px; overflow-y: auto;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}

.craft-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; }
.craft-item-name {
  font-family: var(--font-head); font-size: 1.3rem; font-weight: 800;
  color: #fff; letter-spacing: 2px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.95), 0 0 32px rgba(80,160,60,0.15);
}
.craft-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.craft-badge {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 1.5px; font-weight: 700; padding: 2px 10px;
  border-radius: 10px; border: 1px solid;
}
.tier-badge { color: var(--tier-color); border-color: color-mix(in srgb, var(--tier-color) 40%, transparent); background: color-mix(in srgb, var(--tier-color) 10%, transparent); }
.type-badge.string { color: #6bba4a; border-color: rgba(107,186,74,0.35); background: rgba(107,186,74,0.08); }
.type-badge.imbue  { color: #b44fff; border-color: rgba(180,79,255,0.35); background: rgba(180,79,255,0.08); }
.unfinished-badge  { color: #8a7040; border-color: rgba(138,112,64,0.35); background: rgba(138,112,64,0.08); font-style: italic; }

/* Idle */
.craft-idle {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; opacity: 0.35; padding: 40px 0;
}
.craft-idle-icon { font-size: 2.4rem; }
.craft-idle-text { font-size: 0.78rem; color: var(--text-muted); font-style: italic; }

/* Item showcase */
.item-showcase {
  position: relative; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  width: 200px; height: 200px; border-radius: 16px; flex-shrink: 0;
  border: 1.5px solid color-mix(in srgb, var(--tier-color) 30%, transparent);
  background: color-mix(in srgb, var(--tier-color) 6%, rgba(4,8,4,0.85));
  transition: border-color 0.4s, box-shadow 0.4s;
}
.item-showcase.ready {
  border-color: color-mix(in srgb, var(--tier-color) 70%, transparent);
  box-shadow: 0 0 28px color-mix(in srgb, var(--tier-color) 30%, transparent);
}
.showcase-glow {
  position: absolute; inset: -24px;
  background: radial-gradient(ellipse at 50% 50%, color-mix(in srgb, var(--tier-color) 18%, transparent) 0%, transparent 68%);
  pointer-events: none;
  animation: ww-glow 2.4s ease-in-out infinite;
}
@keyframes ww-glow {
  0%, 100% { opacity: 0.5; }
  50%       { opacity: 0.9; }
}
.showcase-icon-wrap {
  display: flex; align-items: center; justify-content: center;
  width: 96px; height: 96px;
  animation: ww-float 2.8s ease-in-out infinite;
}
@keyframes ww-float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
}
.showcase-weapon-icon {
  filter: drop-shadow(0 0 12px var(--tier-color));
  image-rendering: pixelated;
}
.unfinished-tag {
  font-family: var(--font-head); font-size: 0.56rem; letter-spacing: 2px;
  text-transform: uppercase; padding: 3px 10px; border-radius: 8px;
  border: 1px solid;
}
.unfinished-tag.string { color: #6bba4a; border-color: rgba(107,186,74,0.4); background: rgba(107,186,74,0.08); }
.unfinished-tag.imbue  { color: #b44fff; border-color: rgba(180,79,255,0.4); background: rgba(180,79,255,0.08); }

.craft-desc {
  font-size: 0.7rem; color: var(--text-muted); line-height: 1.6;
  font-style: italic; text-align: center; max-width: 380px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.8);
}

/* Stats + materials */
.craft-details { display: flex; gap: 16px; width: 100%; max-width: 440px; }
.craft-col { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.craft-col-label {
  font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 5px; border-bottom: 1px solid rgba(30,58,30,0.5);
}
.craft-stats { display: flex; gap: 6px; flex-wrap: wrap; }
.craft-stat {
  display: flex; flex-direction: column; align-items: center; gap: 1px;
  background: rgba(0,0,0,0.35); border: 1px solid var(--border-brown);
  border-radius: 6px; padding: 7px 12px; backdrop-filter: blur(4px); min-width: 58px;
}
.craft-stat-label { font-size: 0.54rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); font-family: var(--font-head); }
.craft-stat-val   { font-size: 0.95rem; font-weight: 800; color: #6bba4a; font-family: var(--font-head); }

.craft-materials { display: flex; flex-direction: column; gap: 5px; }
.material-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: 6px; border: 1px solid color-mix(in srgb, var(--wood-color) 20%, transparent);
  background: color-mix(in srgb, var(--wood-color) 6%, rgba(0,0,0,0.3));
  backdrop-filter: blur(4px);
}
.mat-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--wood-color); box-shadow: 0 0 5px var(--wood-color); flex-shrink: 0; }
.mat-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); }
.mat-tally { display: flex; align-items: baseline; gap: 2px; flex-shrink: 0; }
.mat-have { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: #666; }
.mat-have.ok { color: var(--wood-color); }
.mat-sep  { font-size: 0.6rem; color: var(--text-dim); }
.mat-need { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }

/* Craft button */
.craft-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; }
.craft-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 40px; border-radius: 8px;
  border: 1px solid var(--border-brown);
  background: linear-gradient(135deg, #0a180a 0%, #060e06 100%);
  color: var(--text-dim);
  font-family: var(--font-head); font-size: 0.9rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase;
  cursor: not-allowed; transition: all 0.2s;
}
.craft-btn.ready {
  border-color: #2a6018;
  background: linear-gradient(135deg, #182808 0%, #0a1808 100%);
  color: #6bba4a; cursor: pointer;
  box-shadow: 0 0 20px rgba(60,140,30,0.2);
}
.craft-btn.ready:hover {
  background: linear-gradient(135deg, #243810 0%, #142208 100%);
  border-color: #4daa28;
  box-shadow: 0 0 32px rgba(80,180,40,0.35), inset 0 1px 0 rgba(140,220,80,0.1);
}
.craft-btn-icon { font-size: 1rem; }
.craft-hint { font-size: 0.62rem; color: #885544; font-style: italic; }
.finish-hint { color: #5a6a3a; }

/* Result flash */
.craft-result {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 16px; border-radius: 8px;
  border: 1px solid #1a3a1a; background: rgba(10,24,10,0.75);
  backdrop-filter: blur(4px);
}
.craft-result-icon { font-size: 1.1rem; color: #6bba4a; }
.craft-result-text { display: flex; flex-direction: column; gap: 1px; }
.craft-result-name { font-size: 0.8rem; font-weight: 700; color: #aaffcc; font-family: var(--font-head); }
.craft-result-sub  { font-size: 0.6rem; color: #3a5a3a; }
.craft-pop-enter-active { animation: craft-flash 0.3s ease-out; }
.craft-pop-leave-active { transition: opacity 0.4s ease; }
.craft-pop-leave-to     { opacity: 0; }
@keyframes craft-flash {
  from { transform: translateY(6px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

/* Carpenter assignment bar */
.carpenter-bar {
  width: 100%; max-width: 440px; position: relative;
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  padding: 12px 16px; border-radius: 8px;
  border: 1px solid rgba(107,186,74,0.18);
  background: rgba(0,0,0,0.35); backdrop-filter: blur(4px);
  margin-top: auto;
}
.cpb-label {
  font-family: var(--font-head); font-size: 0.65rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-muted); font-weight: 700; flex-shrink: 0;
}
.cpb-hero { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; flex-wrap: wrap; }
.cpb-name  { font-size: 0.8rem; font-weight: 700; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cpb-skill { font-size: 0.68rem; color: #6bba4a; font-family: var(--font-head); font-weight: 700; white-space: nowrap; }
.cpb-xp-wrap  { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.cpb-xp-track { width: 80px; height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
.cpb-xp-fill  { height: 100%; background: linear-gradient(to right, #3a7a20, #6bba4a); border-radius: 3px; transition: width 0.4s ease; }
.cpb-bonus {
  font-family: var(--font-head); font-size: 0.72rem; font-weight: 800;
  color: #6bba4a; background: rgba(107,186,74,0.08); border: 1px solid rgba(107,186,74,0.2);
  border-radius: 6px; padding: 3px 10px; white-space: nowrap; flex-shrink: 0;
}
.cpb-remove {
  width: 22px; height: 22px; border-radius: 50%; border: 1px solid #5a2020;
  background: rgba(90,20,20,0.3); color: #c08080; font-size: 0.7rem; font-weight: 700;
  cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  transition: all 0.15s;
}
.cpb-remove:hover { border-color: #cc4444; background: rgba(120,20,20,0.5); color: #ffaaaa; }
.cpb-assign {
  flex: 1; padding: 6px 12px; border-radius: 6px;
  border: 1px dashed rgba(107,186,74,0.25); background: transparent;
  color: var(--text-dim); font-size: 0.66rem; font-family: var(--font-head);
  cursor: pointer; transition: all 0.15s; text-align: left;
}
.cpb-assign:not(:disabled):hover { border-color: #3a7a20; color: #6bba4a; }
.cpb-assign:disabled { opacity: 0.3; cursor: not-allowed; }
.cpb-picker {
  position: absolute; bottom: calc(100% + 6px); left: 0; right: 0; z-index: 10;
  background: rgba(4,10,4,0.97); border: 1px solid rgba(107,186,74,0.35);
  border-radius: 8px; overflow: hidden;
  box-shadow: 0 -8px 32px rgba(0,0,0,0.8);
}
.cpb-pick-row {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 9px 14px; background: transparent; border: none;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  cursor: pointer; transition: background 0.1s; text-align: left;
}
.cpb-pick-row:last-child { border-bottom: none; }
.cpb-pick-row:hover { background: rgba(255,255,255,0.05); }
.cpb-pick-name  { flex: 1; font-size: 0.7rem; font-weight: 600; color: var(--text-parchment); }
.cpb-pick-level { font-size: 0.6rem; color: #6bba4a; font-family: var(--font-head); }
.cpb-drop-enter-active { transition: opacity 0.15s, transform 0.15s; }
.cpb-drop-leave-active { transition: opacity 0.1s; }
.cpb-drop-enter-from   { opacity: 0; transform: translateY(4px); }
.cpb-drop-leave-to     { opacity: 0; }

/* Woodworking XP bar */
.ww-xp-bar { width: 100%; max-width: 440px; display: flex; flex-direction: column; gap: 7px; }
.ww-xp-header { display: flex; align-items: baseline; gap: 8px; }
.ww-xp-label { font-family: var(--font-head); font-size: 0.7rem; font-weight: 700; color: #6bba4a; text-transform: uppercase; letter-spacing: 1.5px; flex: 1; }
.ww-xp-level { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: #8acc66; }
.ww-xp-count { font-size: 0.68rem; color: var(--text-muted); }
.ww-xp-track { height: 8px; background: #040e04; border-radius: 4px; overflow: hidden; border: 1px solid rgba(107,186,74,0.15); }
.ww-xp-fill  { height: 100%; background: linear-gradient(to right, #3a7a20, #6bba4a); border-radius: 4px; transition: width 0.6s ease; }

/* ── Right: Log stockpile ───────────────────────────────────────── */
.log-panel {
  width: 190px; flex-shrink: 0; position: relative; z-index: 2;
  border-left: 1px solid rgba(107,186,74,0.3);
  background: rgba(2,4,2,0.88); backdrop-filter: blur(8px);
  padding: 16px 14px; display: flex; flex-direction: column; overflow-y: auto;
}
.panel-sublabel {
  font-family: var(--font-head); font-size: 0.52rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-dim); font-weight: 700; margin-bottom: 6px;
}
.log-list { display: flex; flex-direction: column; gap: 5px; }
.log-row {
  display: flex; align-items: center; gap: 9px; padding: 7px 10px;
  border-radius: 6px; border: 1px solid transparent; transition: background 0.12s;
}
.log-row:not(.empty) {
  border-color: color-mix(in srgb, var(--wood-color) 20%, transparent);
  background: color-mix(in srgb, var(--wood-color) 5%, transparent);
}
.log-row.empty { opacity: 0.28; filter: saturate(0.2); }
.log-icon { flex-shrink: 0; filter: drop-shadow(0 0 3px var(--wood-color)); }
.log-name  { flex: 1; font-size: 0.65rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.log-count { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: var(--wood-color); min-width: 20px; text-align: right; }
.log-row.empty .log-count { color: var(--text-dim); }

/* ── Mobile ── */
@media (max-width: 640px) {
  .woodworking { flex-direction: column; overflow-y: auto; overflow-x: hidden; }
  .recipe-panel { width: 100%; border-right: none; border-bottom: 1px solid var(--border-gold); max-height: 200px; flex-shrink: 0; }
  .log-panel { width: 100%; border-left: none; border-top: 1px solid rgba(107,186,74,0.3); flex-shrink: 0; max-height: 220px; }
  .craft-area { padding: 12px 10px; }
}
</style>
