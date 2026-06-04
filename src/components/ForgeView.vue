<template>
  <div class="forge-view">

    <!-- Tab switcher -->
    <div class="forge-tab-bar">
      <button class="ftab" :class="{ active: tab === 'upgrade' }" @click="tab = 'upgrade'">★ Upgrade</button>
      <button class="ftab" :class="{ active: tab === 'orb' }" @click="tab = 'orb'">◈ Orb</button>
    </div>

    <!-- ── UPGRADE TAB ── -->
    <div v-if="tab === 'upgrade'" class="upgrade-view">

      <!-- Owned components strip (only shown if any are held) -->
      <div class="components-strip" v-if="hasAnyComponents">
        <template v-for="(meta, id) in resources.UPGRADE_COMPONENTS" :key="id">
          <div class="comp-chip" v-if="resources.upgradeComponents[id] > 0" :style="{ '--comp-color': meta.color }" :title="meta.desc">
            <span class="comp-dot">◆</span>
            <span class="comp-name">{{ meta.name }}</span>
            <span class="comp-count">×{{ resources.upgradeComponents[id] }}</span>
          </div>
        </template>
      </div>

      <div class="upgrade-body">

        <!-- Left: crafted item list -->
        <aside class="item-list-panel">
          <div class="panel-label">Crafted Items</div>
          <div v-if="craftedItems.length === 0" class="empty-hint">No crafted items yet —<br>forge gear in the Blacksmith first</div>
          <button
            v-for="item in craftedItems"
            :key="item.instanceId"
            class="item-list-btn"
            :class="{ active: artisanItemId === item.instanceId, maxed: item.stars >= 10 }"
            :style="{ '--tier-color': tierColorForItem(item) }"
            @click="artisanItemId = item.instanceId"
          >
            <span class="ilb-icon">{{ SLOT_ICONS[item.slot] ?? '◆' }}</span>
            <div class="ilb-info">
              <span class="ilb-name">{{ item.name }}</span>
              <span class="ilb-rarity" :class="item.rarity?.toLowerCase()">{{ item.rarity }}</span>
            </div>
            <span class="ilb-stars" v-if="item.stars > 0 && item.stars < 10">{{ '★'.repeat(item.stars) }}</span>
            <span class="ilb-maxed" v-else-if="item.stars >= 10">✦</span>
          </button>
        </aside>

        <!-- Right: upgrade workspace -->
        <main class="upgrade-workspace">

          <div class="ws-idle" v-if="!artisanItem">
            <div class="ws-idle-icon">★</div>
            <div class="ws-idle-text">Select a crafted item to upgrade its stars</div>
          </div>

          <template v-else>

            <!-- Item header -->
            <div class="item-header">
              <div class="item-name">{{ artisanItem.name }}</div>
              <div class="item-badges">
                <span class="ibadge tier-badge" :style="{ '--tier-color': artisanTierColor }">{{ artisanTier }} Tier</span>
                <span class="ibadge slot-badge">{{ SLOT_LABELS[artisanItem.slot] }}</span>
                <span class="ibadge rarity-badge" :class="artisanItem.rarity?.toLowerCase()">{{ artisanItem.rarity }}</span>
              </div>
            </div>

            <!-- Item showcase -->
            <div class="item-showcase" :class="{ maxed: artisanItem.stars >= 10 }" :style="{ '--tier-color': artisanTierColor }">
              <div class="showcase-glow" />
              <div v-if="artisanItem.image && GEAR_IMAGES[artisanItem.image]" class="showcase-frame-wrap">
                <div class="showcase-frame-inner">
                  <img :src="GEAR_IMAGES[artisanItem.image]" class="showcase-gear-img" :alt="artisanItem.name" />
                </div>
                <img :src="GEAR_FRAMES[artisanFrame] ?? itemFrameImg" class="showcase-frame-img" alt="" aria-hidden="true" />
              </div>
              <div v-else class="showcase-slot-icon">{{ SLOT_ICONS[artisanItem.slot] ?? '◆' }}</div>
              <div class="stars-row">
                <span
                  v-for="s in 10" :key="s"
                  class="star-pip"
                  :class="{ filled: artisanItem.stars >= s, gate: s === 5 || s === 6 }"
                >★</span>
              </div>
              <div class="showcase-rarity" :class="artisanItem.rarity?.toLowerCase()">{{ artisanItem.rarity }}</div>
            </div>

            <!-- Stats comparison -->
            <div class="stats-panel">
              <div class="stats-label">Stats</div>
              <div class="stat-rows">
                <div v-for="(baseStat, key) in artisanItem.baseStats" :key="key" class="stat-row">
                  <span class="sr-label">{{ STAT_LABELS[key] ?? key }}</span>
                  <span class="sr-current">{{ formatStatValue(key, artisanItem.stats[key]) }}</span>
                  <template v-if="artisanItem.stars < 10">
                    <span class="sr-arrow">→</span>
                    <span class="sr-next">{{ formatStatValue(key, nextStatValue(key, baseStat)) }}</span>
                  </template>
                </div>
              </div>
            </div>

            <!-- Upgrade panel -->
            <div class="upgrade-panel" v-if="artisanItem.stars < 10">
              <!-- Bar cost -->
              <div class="req-row" :style="{ '--req-color': BARS[artisanBarId]?.color ?? '#888' }">
                <span class="req-dot" />
                <span class="req-name">{{ BARS[artisanBarId]?.name ?? artisanBarId }}</span>
                <span class="req-tally">
                  <span class="req-have" :class="{ ok: hasEnoughBars }">{{ resources.bars[artisanBarId] ?? 0 }}</span>
                  <span class="req-sep">/</span>
                  <span class="req-need">{{ starBarCost }}</span>
                </span>
              </div>
              <!-- Gate: rare component -->
              <div class="req-row gate-req" v-if="gateCompMeta" :style="{ '--req-color': gateCompMeta.color }">
                <span class="req-dot gate-dot" />
                <span class="req-name">{{ gateCompMeta.name }}</span>
                <span class="req-tally">
                  <span class="req-have" :class="{ ok: hasComponent }">{{ resources.upgradeComponents[gateCompId] ?? 0 }}</span>
                  <span class="req-sep">/</span>
                  <span class="req-need">{{ gateQty }}</span>
                </span>
                <span class="req-hint">dungeon drop</span>
              </div>
              <!-- Gate: smithing level -->
              <div class="skill-req" v-if="starGate?.smithingLevel">
                <span class="skill-icon">⚒</span>
                <span class="skill-label">Smithing</span>
                <span class="skill-val" :class="{ ok: meetsSmithingLv }">
                  Lv.{{ resources.smithingLevel }} / Lv.{{ starGate.smithingLevel }} required
                </span>
              </div>
              <div class="upgrade-btn-row">
                <button class="upgrade-btn" :class="{ ready: canUpgrade }" :disabled="!canUpgrade" @click="upgradeItem">
                  ⚒ ★{{ artisanItem.stars }} → ★{{ nextStar }}
                </button>
                <span class="next-rarity-hint" v-if="nextRarity !== artisanItem.rarity">↑ {{ nextRarity }}</span>
              </div>
            </div>

            <!-- Maxed -->
            <div class="maxed-msg" v-else>
              <span class="maxed-icon">✦</span>
              <div>
                <div class="maxed-title">Mythical — Fully Upgraded</div>
                <div class="maxed-sub">This item has reached its maximum potential</div>
              </div>
            </div>

          </template>
        </main>
      </div>
    </div>

    <!-- ── ORB TAB ── -->
    <div v-else class="orb-view">

      <div class="materials-row">
        <div
          v-for="(meta, id) in forge.MATERIALS"
          :key="id"
          class="material-chip"
          :style="{ '--mat-color': meta.color }"
          :title="meta.desc"
        >
          <span class="mat-gem">◆</span>
          <span class="mat-label">{{ meta.label }}</span>
          <span class="mat-count">{{ forge.materials[id] }}</span>
        </div>
      </div>

      <div class="orb-body">
        <!-- Left: Craft orbs -->
        <div class="craft-panel">
          <h3 class="panel-title">Craft Orbs</h3>
          <div class="orb-recipes">
            <div
              v-for="(meta, id) in forge.ORBS"
              :key="id"
              class="orb-recipe"
              :class="{ 'can-craft': forge.canCraft(id) }"
              :style="{ '--orb-color': meta.color }"
            >
              <div class="orb-header">
                <OrbIcon :orbId="id" :size="44" />
                <div class="orb-info">
                  <div class="orb-name">{{ meta.label }}</div>
                  <div class="orb-owned">×{{ forge.orbs[id] }} owned</div>
                </div>
              </div>
              <p class="orb-desc">{{ meta.desc }}</p>
              <div class="orb-recipe-cost">
                <span
                  v-for="(qty, mat) in meta.recipe"
                  :key="mat"
                  class="cost-chip"
                  :class="{ lacking: forge.materials[mat] < qty }"
                >
                  <span class="cost-gem" :style="{ color: forge.MATERIALS[mat]?.color }">◆</span>
                  {{ qty }}× {{ forge.MATERIALS[mat]?.label }}
                </span>
              </div>
              <button class="btn-craft" :disabled="!forge.canCraft(id)" @click="forge.craft(id)">Craft</button>
            </div>
          </div>
        </div>

        <!-- Right: Apply orb -->
        <div class="orb-panel">
          <div class="panel-title-row">
            <h3 class="panel-title">Apply Orb</h3>
            <div class="orb-summary">
              <span v-for="(meta, id) in forge.ORBS" :key="id" class="orb-summary-item" :style="{ '--orb-color': meta.color }">
                <OrbIcon :orbId="id" :size="28" />
                <span class="orb-summary-count">{{ forge.orbs[id] }}</span>
              </span>
            </div>
          </div>
          <div class="workspace">
            <div class="ws-row">
              <label class="ws-label">Item</label>
              <select class="ws-select" v-model="selectedItemId">
                <option value="">— Select Legendary / Mythical gear —</option>
                <option v-for="item in orbableItems" :key="item.instanceId" :value="item.instanceId">
                  {{ item.name }} ({{ item.rarity }}) · {{ item.lines.filter(l => l.type === 'discovery').length }} lines
                </option>
              </select>
            </div>
            <div class="lines-preview" v-if="selectedItem">
              <div class="lines-label">Current lines</div>
              <div class="lines-list">
                <div v-for="(line, i) in selectedItem.lines.filter(l => l.type === 'discovery')" :key="i" class="line-chip">{{ line.label }}</div>
                <div class="line-chip line-empty" v-if="!selectedItem.lines.some(l => l.type === 'discovery')">No discovery lines yet — orbing adds 1</div>
              </div>
            </div>
            <div class="ws-row" v-if="selectedItem">
              <label class="ws-label">Orb</label>
              <div class="orb-picker">
                <button
                  v-for="(meta, id) in forge.ORBS" :key="id"
                  class="orb-pick-btn"
                  :class="{ selected: selectedOrb === id, disabled: forge.orbs[id] === 0 }"
                  :style="{ '--orb-color': meta.color }"
                  :disabled="forge.orbs[id] === 0"
                  @click="selectedOrb = id"
                >
                  <OrbIcon :orbId="id" :size="32" />
                  <span class="cp-name">{{ meta.label }}</span>
                  <span class="cp-count">×{{ forge.orbs[id] }}</span>
                </button>
              </div>
            </div>
            <button class="btn-apply" v-if="selectedItem && selectedOrb" :disabled="forge.orbs[selectedOrb] === 0" @click="applySelectedOrb">
              Apply {{ forge.ORBS[selectedOrb]?.label }}
            </button>
            <div class="dark-preview" v-if="forge.darkPreview">
              <div class="dp-title">
                <OrbIcon orbId="dark" :size="22" style="vertical-align:middle;margin-right:6px;" />
                Astral Orb — Choose your lines
              </div>
              <div class="dp-compare">
                <div class="dp-col">
                  <div class="dp-col-label">Current</div>
                  <div class="line-chip" v-for="(l,i) in forge.darkPreview.oldLines" :key="'old'+i">{{ l.label }}</div>
                  <div class="line-chip line-empty" v-if="!forge.darkPreview.oldLines.length">No lines</div>
                </div>
                <div class="dp-arrow">→</div>
                <div class="dp-col">
                  <div class="dp-col-label new-label">New Roll</div>
                  <div class="line-chip line-new" v-for="(l,i) in forge.darkPreview.newLines" :key="'new'+i">{{ l.label }}</div>
                </div>
              </div>
              <div class="dp-actions">
                <button class="btn-keep-new" @click="forge.confirmDark(true)">Keep New</button>
                <button class="btn-keep-old" @click="forge.confirmDark(false)">Keep Current</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useForgeStore } from '../stores/useForgeStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useResourceStore } from '../stores/useResourceStore.js'
import OrbIcon from './OrbIcon.vue'
import { STAR_GATES, UPGRADE_COMPONENTS } from '../game/data/upgradeComponents.js'
import { RECIPE_TIERS, SLOT_ICONS, STAT_LABELS, formatStatValue, rarityForStars, STAR_BAR_COST, starMultiplier } from '../game/data/recipes.js'
import { SLOT_LABELS } from '../game/Gear.js'
import { BARS } from '../game/data/bars.js'
import itemFrameImg      from '../assets/gear/frames/item_frame.png'
import elvenBorderImg   from '../assets/gear/frames/elven_border.png'
import dwarvenFrameImg  from '../assets/gear/frames/dwarven_frame.png'
import goblinFrameImg   from '../assets/gear/frames/goblin_frame.png'
import elvenSwordImg     from '../assets/gear/elven/sword.png'
import elvenSpearImg     from '../assets/gear/elven/spear.png'
import elvenShieldImg    from '../assets/gear/elven/shield.png'
import elvenHelmImg      from '../assets/gear/elven/helm.png'
import elvenChestImg     from '../assets/gear/elven/chest.png'
import elvenPlateImg     from '../assets/gear/elven/platelegs.png'
import elvenGlovesImg    from '../assets/gear/elven/gloves.png'

const GEAR_FRAMES = {
  elven:   elvenBorderImg,
  dwarven: dwarvenFrameImg,
  goblin:  goblinFrameImg,
}

const GEAR_IMAGES = {
  'elven/sword':     elvenSwordImg,
  'elven/spear':     elvenSpearImg,
  'elven/shield':    elvenShieldImg,
  'elven/helm':      elvenHelmImg,
  'elven/chest':     elvenChestImg,
  'elven/platelegs': elvenPlateImg,
  'elven/gloves':    elvenGlovesImg,
}

const ARTISAN_XP  = { copper: 8, tin: 12, steel: 20, darksteel: 32, mithril: 50, moonsilver: 80 }
const TIER_TO_BAR = { copper: 'copper', tin: 'tin', steel: 'steel', darksteel: 'darksteel', mithril: 'mithril', moonsilver: 'moonsilver' }
const TIER_ORDER  = { copper: 0, tin: 1, steel: 2, darksteel: 3, mithril: 4, moonsilver: 5 }
const PCT_STATS   = ['hpPct','atkPct','defPct','spdPct','critRate','critDmg','resistance','accuracy']

const forge     = useForgeStore()
const inventory = useInventoryStore()
const resources = useResourceStore()

const tab = ref('upgrade')

// ── Orb tab state ─────────────────────────────────────────────────
const selectedItemId = ref('')
const selectedOrb    = ref('')

const orbableItems = computed(() =>
  inventory.ownedInstances.filter(i => i.rarity === 'Legendary' || i.rarity === 'Mythical')
)
const selectedItem = computed(() =>
  selectedItemId.value ? inventory.instanceById(selectedItemId.value) : null
)
function applySelectedOrb() {
  if (!selectedItemId.value || !selectedOrb.value) return
  forge.applyOrb(selectedItemId.value, selectedOrb.value)
}

// ── Upgrade tab state ─────────────────────────────────────────────
const artisanItemId = ref(null)

const craftedItems = computed(() =>
  inventory.ownedItems
    .filter(item => item.craftedAt && item.tier)
    .sort((a, b) => (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99))
)

const artisanItem      = computed(() => artisanItemId.value ? inventory.instanceById(artisanItemId.value) : null)
const artisanTier      = computed(() => artisanItem.value?.tier ?? null)
const artisanTierColor = computed(() => RECIPE_TIERS.find(t => t.id === artisanTier.value)?.color ?? '#888')
const artisanBarId     = computed(() => TIER_TO_BAR[artisanTier.value] ?? null)

const nextStar     = computed(() => artisanItem.value ? artisanItem.value.stars + 1 : null)
const starBarCost  = computed(() => nextStar.value != null ? (STAR_BAR_COST[nextStar.value] ?? 0) : 0)
const starGate     = computed(() => nextStar.value != null ? (STAR_GATES[nextStar.value] ?? null) : null)
const gateCompId   = computed(() => starGate.value && artisanTier.value ? starGate.value.component(artisanTier.value) : null)
const gateCompMeta = computed(() => gateCompId.value ? (UPGRADE_COMPONENTS[gateCompId.value] ?? null) : null)
const gateQty      = computed(() => starGate.value?.qty ?? 1)

const hasEnoughBars   = computed(() => !artisanBarId.value ? false : (resources.bars[artisanBarId.value] ?? 0) >= starBarCost.value)
const hasComponent    = computed(() => !gateCompId.value || (resources.upgradeComponents[gateCompId.value] ?? 0) >= gateQty.value)
const meetsSmithingLv = computed(() => !starGate.value?.smithingLevel || resources.smithingLevel >= starGate.value.smithingLevel)

const canUpgrade = computed(() => {
  if (!artisanItem.value || !artisanBarId.value || artisanItem.value.stars >= 10) return false
  return hasEnoughBars.value && hasComponent.value && meetsSmithingLv.value
})

const nextRarity = computed(() => artisanItem.value ? rarityForStars(artisanItem.value.stars + 1) : '')

const hasAnyComponents = computed(() =>
  Object.values(resources.upgradeComponents).some(v => v > 0)
)

// Resolve frame from instance or fall back to recipe lookup (handles pre-frame items)
const artisanFrame = computed(() => {
  if (!artisanItem.value) return null
  if (artisanItem.value.frame) return artisanItem.value.frame
  for (const tier of RECIPE_TIERS) {
    const recipe = tier.recipes.find(r => r.id === artisanItem.value.id)
    if (recipe?.frame) return recipe.frame
  }
  return null
})

function nextStatValue(key, baseStat) {
  if (!artisanItem.value) return baseStat
  const mult = starMultiplier(artisanItem.value.stars + 1)
  return PCT_STATS.includes(key)
    ? Math.round(baseStat * mult * 1000) / 1000
    : Math.round(baseStat * mult)
}

function tierColorForItem(item) {
  return RECIPE_TIERS.find(t => t.id === item.tier)?.color ?? '#888'
}

function upgradeItem() {
  const item = artisanItem.value
  if (!item || !canUpgrade.value) return
  const toStar = item.stars + 1
  resources.removeBar(artisanBarId.value, STAR_BAR_COST[toStar])
  if (gateCompId.value) resources.removeUpgradeComponent(gateCompId.value, gateQty.value)
  item.stars  = toStar
  item.rarity = rarityForStars(toStar)
  const mult  = starMultiplier(toStar)
  Object.keys(item.baseStats).forEach(key => {
    item.stats[key] = PCT_STATS.includes(key)
      ? Math.round(item.baseStats[key] * mult * 1000) / 1000
      : Math.round(item.baseStats[key] * mult)
  })
  resources.addSmithingXp(ARTISAN_XP[artisanTier.value] ?? 10)
}
</script>

<style scoped>
.forge-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ── Tab bar ── */
.forge-tab-bar {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--border-brown);
  padding-bottom: 0;
}
.ftab {
  background: none;
  border: 1px solid transparent;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 7px 20px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
  position: relative;
  bottom: -1px;
}
.ftab:hover  { color: var(--text-parchment); }
.ftab.active { color: var(--gold); background: var(--bg-card); border-color: var(--border-gold); }

/* ── Upgrade tab ── */
.upgrade-view { display: flex; flex-direction: column; gap: 14px; }

.components-strip { display: flex; gap: 8px; flex-wrap: wrap; }
.comp-chip {
  display: flex; align-items: center; gap: 6px;
  background: #120a04; border: 1px solid color-mix(in srgb, var(--comp-color) 30%, transparent);
  border-radius: 8px; padding: 5px 12px;
}
.comp-dot  { color: var(--comp-color); font-size: 0.75rem; }
.comp-name { font-size: 0.65rem; color: var(--text-muted); font-weight: 600; }
.comp-count { font-size: 0.8rem; font-weight: 800; color: var(--comp-color); margin-left: 2px; }

.upgrade-body {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 16px;
  align-items: start;
}

/* Item list panel */
.item-list-panel {
  background: #0e0805;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.panel-label {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 8px; border-bottom: 1px solid var(--border-brown); margin-bottom: 4px;
}
.empty-hint { font-size: 0.62rem; color: var(--text-dim); font-style: italic; line-height: 1.5; padding: 4px 2px; }
.item-list-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 8px 8px; background: transparent; border: 1px solid transparent;
  border-radius: 6px; cursor: pointer; text-align: left;
  transition: background 0.12s, border-color 0.12s;
}
.item-list-btn:hover { background: rgba(255,255,255,0.04); border-color: color-mix(in srgb, var(--tier-color) 25%, transparent); }
.item-list-btn.active { background: color-mix(in srgb, var(--tier-color) 12%, rgba(0,0,0,0.4)); border-color: color-mix(in srgb, var(--tier-color) 50%, transparent); }
.ilb-icon  { font-size: 0.9rem; flex-shrink: 0; width: 18px; text-align: center; }
.ilb-info  { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.ilb-name  { font-size: 0.66rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ilb-rarity { font-size: 0.54rem; font-family: var(--font-head); text-transform: uppercase; letter-spacing: 1px; }
.ilb-rarity.common    { color: #888; }
.ilb-rarity.uncommon  { color: #4dff88; }
.ilb-rarity.rare      { color: #4fa8ff; }
.ilb-rarity.epic      { color: #b44fff; }
.ilb-rarity.legendary { color: #ffd700; }
.ilb-rarity.mythical  { color: #ff88ff; }
.ilb-stars { font-size: 0.5rem; color: var(--tier-color); letter-spacing: 1px; flex-shrink: 0; }
.ilb-maxed { font-size: 0.65rem; color: #ff88ff; flex-shrink: 0; }

/* Upgrade workspace */
.upgrade-workspace {
  background: #0e0805;
  border: 1px solid var(--border-brown);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  min-height: 300px;
}
.ws-idle { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; opacity: 0.3; padding: 40px 0; }
.ws-idle-icon { font-size: 2.4rem; color: var(--gold); }
.ws-idle-text { font-size: 0.76rem; color: var(--text-muted); font-style: italic; }

.item-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 7px; width: 100%; }
.item-name {
  font-family: var(--font-head); font-size: 1.2rem; font-weight: 800;
  color: #fff; letter-spacing: 2px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.95);
}
.item-badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
.ibadge {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 1.5px; font-weight: 700; padding: 2px 10px;
  border-radius: 10px; border: 1px solid;
}
.tier-badge  { color: var(--tier-color); border-color: color-mix(in srgb, var(--tier-color) 40%, transparent); background: color-mix(in srgb, var(--tier-color) 10%, transparent); }
.slot-badge  { color: var(--text-muted); border-color: var(--border-brown); background: rgba(255,255,255,0.03); }
.rarity-badge.common    { color: #aaa;    border-color: #333;    background: rgba(255,255,255,0.03); }
.rarity-badge.uncommon  { color: #4dff88; border-color: #1a4a22; background: rgba(77,255,136,0.05); }
.rarity-badge.rare      { color: #4fa8ff; border-color: #1a3060; background: rgba(79,168,255,0.05); }
.rarity-badge.epic      { color: #b44fff; border-color: #3a1060; background: rgba(180,79,255,0.05); }
.rarity-badge.legendary { color: #ffd700; border-color: #5a3a00; background: rgba(255,215,0,0.05); }
.rarity-badge.mythical  { color: #ff88ff; border-color: #5a1050; background: rgba(255,136,255,0.05); }

/* Item showcase */
.item-showcase {
  position: relative; display: flex; flex-direction: column; align-items: center; gap: 12px;
  padding: 28px 40px 20px;
  background: color-mix(in srgb, var(--tier-color) 6%, rgba(0,0,0,0.45));
  border: 1px solid color-mix(in srgb, var(--tier-color) 22%, transparent);
  border-radius: 14px; width: 100%; max-width: 340px; overflow: hidden;
  align-self: center;
}
.showcase-glow {
  position: absolute; inset: 0; border-radius: 14px; pointer-events: none;
  background: radial-gradient(ellipse at 50% 40%, color-mix(in srgb, var(--tier-color) 14%, transparent) 0%, transparent 65%);
  animation: glow-breathe 3s ease-in-out infinite;
}
@keyframes glow-breathe { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
.showcase-frame-wrap { position: relative; width: 130px; height: 130px; z-index: 1; animation: item-float 2.8s ease-in-out infinite; }
.showcase-frame-inner { position: absolute; inset: 14%; overflow: hidden; display: flex; align-items: center; justify-content: center; }
.showcase-gear-img { width: 100%; height: 100%; object-fit: cover; filter: drop-shadow(0 0 10px var(--tier-color)); }
.showcase-frame-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; pointer-events: none; z-index: 2; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.7)); }
.showcase-slot-icon { font-size: 3.5rem; z-index: 1; filter: drop-shadow(0 0 18px var(--tier-color)); animation: item-float 2.8s ease-in-out infinite; }
@keyframes item-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

.stars-row { display: flex; gap: 6px; z-index: 1; }
.star-pip { font-size: 1rem; color: rgba(255,255,255,0.12); transition: color 0.2s, text-shadow 0.2s; }
.star-pip.filled { color: var(--tier-color); text-shadow: 0 0 10px var(--tier-color); }
.star-pip.gate:not(.filled) { color: rgba(255,255,255,0.2); }
.star-pip.gate.filled { text-shadow: 0 0 14px var(--tier-color), 0 0 28px color-mix(in srgb, var(--tier-color) 60%, transparent); }

.showcase-rarity {
  font-family: var(--font-head); font-size: 0.65rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 2.5px; z-index: 1;
}
.showcase-rarity.common    { color: #888; }
.showcase-rarity.uncommon  { color: #4dff88; }
.showcase-rarity.rare      { color: #4fa8ff; }
.showcase-rarity.epic      { color: #b44fff; text-shadow: 0 0 10px rgba(180,79,255,0.5); }
.showcase-rarity.legendary { color: #ffd700; text-shadow: 0 0 14px rgba(255,215,0,0.55); }
.showcase-rarity.mythical  { color: #ff88ff; text-shadow: 0 0 14px rgba(255,136,255,0.55); }
.item-showcase.maxed { border-color: rgba(255,136,255,0.35); }

/* Stats panel */
.stats-panel { width: 100%; max-width: 340px; display: flex; flex-direction: column; gap: 8px; }
.stats-label { font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); font-weight: 700; padding-bottom: 5px; border-bottom: 1px solid rgba(58,30,10,0.5); }
.stat-rows   { display: flex; flex-direction: column; gap: 4px; }
.stat-row    { display: flex; align-items: center; gap: 8px; padding: 5px 10px; border-radius: 6px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.04); }
.sr-label   { flex: 1; font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
.sr-current { font-family: var(--font-head); font-size: 0.82rem; font-weight: 700; color: var(--text-parchment); }
.sr-arrow   { font-size: 0.7rem; color: rgba(255,200,100,0.35); }
.sr-next    { font-family: var(--font-head); font-size: 0.82rem; font-weight: 700; color: var(--tier-color); text-shadow: 0 0 8px color-mix(in srgb, var(--tier-color) 40%, transparent); }

/* Upgrade panel */
.upgrade-panel { width: 100%; max-width: 340px; display: flex; flex-direction: column; gap: 8px; }
.req-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: 6px; border: 1px solid color-mix(in srgb, var(--req-color) 20%, transparent);
  background: color-mix(in srgb, var(--req-color) 6%, rgba(0,0,0,0.3));
}
.gate-req { border-style: dashed; }
.req-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--req-color); box-shadow: 0 0 5px var(--req-color); flex-shrink: 0; }
.gate-dot { box-shadow: 0 0 8px var(--req-color), 0 0 16px color-mix(in srgb, var(--req-color) 30%, transparent); }
.req-name { flex: 1; font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); }
.req-tally { display: flex; align-items: baseline; gap: 2px; flex-shrink: 0; }
.req-have { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: #666; }
.req-have.ok { color: var(--req-color); }
.req-sep  { font-size: 0.6rem; color: var(--text-dim); }
.req-need { font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; color: var(--text-muted); }
.req-hint { font-size: 0.52rem; color: var(--text-dim); font-style: italic; font-family: var(--font-head); letter-spacing: 0.5px; flex-shrink: 0; margin-left: 4px; }

.skill-req {
  display: flex; align-items: center; gap: 8px; padding: 6px 10px;
  border-radius: 6px; border: 1px solid rgba(201,162,39,0.15); background: rgba(201,162,39,0.04);
}
.skill-icon  { font-size: 0.85rem; color: var(--gold); flex-shrink: 0; }
.skill-label { font-family: var(--font-head); font-size: 0.62rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; flex: 1; }
.skill-val   { font-size: 0.64rem; color: #884444; font-family: var(--font-head); }
.skill-val.ok { color: var(--gold); }

.upgrade-btn-row { display: flex; align-items: center; gap: 12px; }
.upgrade-btn {
  flex: 1; padding: 12px; border-radius: 8px;
  border: 1px solid var(--border-brown);
  background: linear-gradient(135deg, #2a1408 0%, #160a04 100%);
  color: var(--text-dim);
  font-family: var(--font-head); font-size: 0.85rem; font-weight: 800;
  letter-spacing: 2px; text-transform: uppercase; cursor: not-allowed; transition: all 0.2s;
}
.upgrade-btn.ready {
  border-color: color-mix(in srgb, var(--tier-color, #c9a227) 55%, transparent);
  background: color-mix(in srgb, var(--tier-color, #c9a227) 14%, rgba(5,3,1,0.9));
  color: var(--tier-color, var(--gold)); cursor: pointer;
  box-shadow: 0 0 22px color-mix(in srgb, var(--tier-color, #c9a227) 18%, transparent);
}
.upgrade-btn.ready:hover {
  background: color-mix(in srgb, var(--tier-color, #c9a227) 22%, rgba(5,3,1,0.85));
  border-color: var(--tier-color, var(--gold));
}
.next-rarity-hint { font-family: var(--font-head); font-size: 0.6rem; color: rgba(255,200,100,0.6); letter-spacing: 1.5px; flex-shrink: 0; }

.maxed-msg {
  display: flex; align-items: center; gap: 14px; padding: 16px 24px;
  border-radius: 12px; border: 1px solid rgba(255,136,255,0.22); background: rgba(255,136,255,0.05);
  width: 100%; max-width: 340px;
}
.maxed-icon  { font-size: 1.6rem; color: #ff88ff; }
.maxed-title { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; color: #ff88ff; text-transform: uppercase; letter-spacing: 2px; }
.maxed-sub   { font-size: 0.6rem; color: var(--text-muted); margin-top: 3px; }

/* ── Orb tab ── */
.orb-view { display: flex; flex-direction: column; gap: 16px; }
.materials-row { display: flex; gap: 10px; flex-wrap: wrap; }
.material-chip { display: flex; align-items: center; gap: 8px; background: #120a04; border: 1px solid var(--border-brown); border-radius: 8px; padding: 8px 16px; cursor: default; transition: border-color 0.15s; }
.material-chip:hover { border-color: var(--mat-color); }
.mat-gem   { color: var(--mat-color); font-size: 1rem; }
.mat-label { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
.mat-count { font-size: 0.88rem; font-weight: 800; color: var(--mat-color); margin-left: 4px; }

.orb-body { display: grid; grid-template-columns: 380px 1fr; gap: 20px; align-items: start; }
.panel-title { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 14px; }
.craft-panel { background: #0e0805; border: 1px solid var(--border-brown); border-radius: 10px; padding: 18px; }
.orb-recipes { display: flex; flex-direction: column; gap: 12px; }
.orb-recipe { background: #140c06; border: 1px solid #2a1a08; border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; transition: border-color 0.2s; }
.orb-recipe.can-craft { border-color: color-mix(in srgb, var(--orb-color) 40%, transparent); }
.orb-header { display: flex; align-items: center; gap: 10px; }
.orb-info   { display: flex; flex-direction: column; gap: 1px; }
.orb-name   { font-size: 0.8rem; font-weight: 700; color: var(--orb-color); }
.orb-owned  { font-size: 0.6rem; color: #554; }
.orb-desc   { font-size: 0.68rem; color: #776; line-height: 1.5; }
.orb-recipe-cost { display: flex; gap: 8px; flex-wrap: wrap; }
.cost-chip { display: flex; align-items: center; gap: 4px; font-size: 0.64rem; color: #887; background: #0a0602; border: 1px solid #1a1008; border-radius: 6px; padding: 2px 8px; }
.cost-chip.lacking { color: #cc3333; border-color: #3a1010; }
.cost-gem { font-size: 0.7rem; }
.btn-craft { padding: 7px; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--orb-color) 35%, transparent); background: color-mix(in srgb, var(--orb-color) 10%, transparent); color: var(--orb-color); font-size: 0.72rem; font-weight: 700; cursor: pointer; transition: background 0.15s; align-self: flex-end; min-width: 72px; }
.btn-craft:hover:not(:disabled) { background: color-mix(in srgb, var(--orb-color) 20%, transparent); }
.btn-craft:disabled { opacity: 0.3; cursor: not-allowed; }

.panel-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.panel-title-row .panel-title { margin-bottom: 0; }
.orb-summary { display: flex; gap: 8px; align-items: center; }
.orb-summary-item { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.orb-summary-count { font-size: 0.6rem; font-weight: 800; color: var(--orb-color); line-height: 1; }

.orb-panel { background: #0e0805; border: 1px solid var(--border-brown); border-radius: 10px; padding: 18px; }
.workspace { display: flex; flex-direction: column; gap: 14px; }
.ws-row { display: flex; flex-direction: column; gap: 6px; }
.ws-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
.ws-select { background: #0a0602; border: 1px solid #3a1e0a; border-radius: 6px; color: var(--text-parchment); font-size: 0.76rem; padding: 8px 10px; width: 100%; cursor: pointer; }
.ws-select option { background: #1a0e06; }
.lines-preview { display: flex; flex-direction: column; gap: 6px; }
.lines-label { font-size: 0.62rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
.lines-list { display: flex; flex-wrap: wrap; gap: 6px; }
.line-chip { font-size: 0.68rem; font-weight: 700; color: #cc88ff; background: #1a0828; border: 1px solid #44116655; border-radius: 6px; padding: 3px 10px; }
.line-chip.line-empty { color: #443; background: #0e0805; border-color: #1a1008; font-weight: 400; font-style: italic; }
.line-chip.line-new   { color: #44ffaa; background: #081a10; border-color: #114422; }
.orb-picker { display: flex; gap: 8px; flex-wrap: wrap; }
.orb-pick-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; border-radius: 8px; border: 1px solid #2a1a08; background: #0a0602; cursor: pointer; transition: border-color 0.15s, background 0.15s; flex: 1; }
.orb-pick-btn:hover:not(.disabled):not(.selected) { border-color: var(--orb-color); }
.orb-pick-btn.selected { border-color: var(--orb-color); background: color-mix(in srgb, var(--orb-color) 12%, transparent); }
.orb-pick-btn.disabled { opacity: 0.35; cursor: not-allowed; }
.cp-name { font-size: 0.66rem; font-weight: 700; color: var(--orb-color); flex: 1; text-align: left; }
.cp-count { font-size: 0.62rem; color: #554; }
.btn-apply { padding: 11px; border-radius: 8px; border: 1px solid var(--border-gold); background: #1c1208; color: var(--gold); font-family: var(--font-head); font-size: 0.78rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: background 0.15s, border-color 0.15s; }
.btn-apply:hover:not(:disabled) { background: #2a1c0a; border-color: var(--gold-bright); }
.btn-apply:disabled { opacity: 0.35; cursor: not-allowed; }
.dark-preview { background: #0e0618; border: 1px solid #6622cc55; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; gap: 14px; }
.dp-title { font-size: 0.75rem; font-weight: 800; color: #aa77ff; letter-spacing: 0.5px; }
.dp-compare { display: flex; gap: 16px; align-items: flex-start; }
.dp-col { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.dp-col-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; color: #554; margin-bottom: 2px; }
.dp-col-label.new-label { color: #2a8844; }
.dp-arrow { color: #aa77ff; font-size: 1.2rem; margin-top: 24px; flex-shrink: 0; }
.dp-actions { display: flex; gap: 10px; }
.btn-keep-new { flex: 1; padding: 9px; border-radius: 7px; border: 1px solid #114422; background: #081a10; color: #44ffaa; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.btn-keep-new:hover { background: #0d2a1a; border-color: #226644; }
.btn-keep-old { flex: 1; padding: 9px; border-radius: 7px; border: 1px solid #2a1a08; background: #0e0805; color: #887; font-size: 0.76rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
.btn-keep-old:hover { background: #1a0e06; color: #aaa; }
</style>
