<template>
  <div class="fusion-workshop">

    <div class="fw-bg" :style="{ backgroundImage: `url(${activeAtelier.bg})` }" />
    <div class="fw-tint" :style="{ background: activeAtelier.tint }" />
    <div class="fw-overlay" />

    <!-- ── Left: Atelier tabs + recipe list ─────────────────────── -->
    <aside class="fw-panel">

      <!-- Atelier tabs -->
      <div class="atelier-tabs">
        <button
          v-for="a in ATELIERS"
          :key="a.id"
          class="atelier-tab"
          :class="{ active: activeAtelierId === a.id }"
          :style="{ '--ac': a.color }"
          @click="activeAtelierId = a.id; selectedRecipe = null"
        >
          <span class="at-icon">{{ a.icon }}</span>
          <span class="at-name">{{ a.name }}</span>
        </button>
      </div>

      <!-- Artisan requirement badge -->
      <div class="artisan-req">
        <span class="req-chip" :style="{ '--ac': activeAtelier.color }">{{ activeAtelier.req1 }}</span>
        <span class="req-plus">+</span>
        <span class="req-chip" :style="{ '--ac': activeAtelier.color }">{{ activeAtelier.req2 }}</span>
      </div>

      <!-- Recipe tiers -->
      <div class="recipe-tiers">
        <div v-for="tier in activeAtelier.tiers" :key="tier.id" class="tier-block">

          <div class="tier-head" :style="{ '--tc': tier.color }">
            <span class="tier-dot" />
            <span class="tier-name">{{ tier.name }}</span>
            <span class="tier-count">{{ tier.recipes.length }}</span>
          </div>

          <button
            v-for="r in tier.recipes"
            :key="r.id"
            class="recipe-btn"
            :class="{ active: selectedRecipe?.id === r.id }"
            :style="{ '--tc': tier.color }"
            @click="selectedRecipe = r"
          >
            <span class="rb-slot">{{ SLOT_LABELS[r.slot] }}</span>
            <span class="rb-name">{{ r.name }}</span>
            <span class="rb-cost">{{ r.barCost }}×</span>
          </button>

        </div>
      </div>

      <!-- Artisan assignment -->
      <div class="fw-artisan">
        <div class="fwa-label">Artisan</div>
        <div v-if="assignedArtisan" class="fwa-assigned">
          <div class="fwa-hero-name">{{ assignedArtisan.hero.name }}</div>
          <div class="fwa-skills">
            <span class="fwa-skill">{{ activeAtelier.req1 }} Lv.{{ artisanSkillLevel(assignedKey, activeAtelier.req1) }}</span>
            <span class="fwa-skill">{{ activeAtelier.req2 }} Lv.{{ artisanSkillLevel(assignedKey, activeAtelier.req2) }}</span>
          </div>
          <button class="fwa-unassign" @click="unassignArtisan">×</button>
        </div>
        <template v-else>
          <button
            v-for="e in eligibleArtisans"
            :key="e.key"
            class="fwa-pick-btn"
            @click="assignArtisan(e.key)"
          >
            <span class="fwa-pick-name">{{ e.hero.name }}</span>
            <span class="fwa-pick-lvs">{{ activeAtelier.req1 }} Lv.{{ artisanSkillLevel(e.key, activeAtelier.req1) }} · {{ activeAtelier.req2 }} Lv.{{ artisanSkillLevel(e.key, activeAtelier.req2) }}</span>
          </button>
          <div v-if="!eligibleArtisans.length" class="fwa-none">
            No hero has both {{ activeAtelier.req1 }} &amp; {{ activeAtelier.req2 }}
          </div>
        </template>
      </div>

    </aside>

    <!-- ── Center: Detail panel ──────────────────────────────────── -->
    <main class="fw-detail">

      <!-- Empty state -->
      <div v-if="!selectedRecipe" class="fw-empty">
        <div class="fw-empty-title">{{ activeAtelier.name }}</div>
        <div class="fw-empty-sub">{{ activeAtelier.flavour }}</div>
        <div class="fw-set-bonus">
          <div class="fsb-label">Set Bonus</div>
          <div v-for="(line, i) in activeAtelier.setBonus" :key="i" class="fsb-line">{{ line }}</div>
        </div>
      </div>

      <!-- Recipe detail -->
      <template v-else>
        <div class="detail-header">
          <div class="dh-slot">{{ SLOT_LABELS[selectedRecipe.slot] }}</div>
          <div class="dh-name">{{ selectedRecipe.name }}</div>
          <div class="dh-tier" :style="{ color: activeTierColor }">{{ activeTierName }}</div>
        </div>

        <div class="detail-stats">
          <div class="ds-label">Base Stats</div>
          <div v-for="(val, stat) in selectedRecipe.baseStats" :key="stat" class="stat-row">
            <span class="stat-key">{{ STAT_LABELS[stat] ?? stat }}</span>
            <span class="stat-val">+{{ typeof val === 'number' && val < 1 ? (val * 100).toFixed(0) + '%' : val }}</span>
          </div>
        </div>

        <div class="detail-cost">
          <div class="ds-label">Materials</div>
          <div class="cost-row">
            <span class="cost-mat">{{ selectedRecipe.barCost }}× {{ selectedRecipe.barName }}</span>
          </div>
        </div>

        <!-- Artisan level requirement -->
        <div class="detail-reqs">
          <div class="ds-label">Requires</div>
          <div class="req-row">
            <span class="req-chip" :style="{ '--ac': activeAtelier.color }">{{ activeAtelier.req1 }}</span>
            <span class="req-lv" :class="{ unmet: assignedKey && artisanSkillLevel(assignedKey, activeAtelier.req1) < selectedRecipe.reqLevel }">
              Lv. {{ selectedRecipe.reqLevel }}
            </span>
          </div>
          <div class="req-row">
            <span class="req-chip" :style="{ '--ac': activeAtelier.color }">{{ activeAtelier.req2 }}</span>
            <span class="req-lv" :class="{ unmet: assignedKey && artisanSkillLevel(assignedKey, activeAtelier.req2) < selectedRecipe.reqLevel }">
              Lv. {{ selectedRecipe.reqLevel }}
            </span>
          </div>
        </div>

        <button
          class="craft-btn"
          :class="{ ready: canCraft(selectedRecipe), flash: !!craftResult }"
          :disabled="!canCraft(selectedRecipe)"
          @click="craft"
        >
          <span v-if="craftResult">✓ {{ craftResult }}</span>
          <span v-else-if="!assignedKey">Assign an artisan first</span>
          <span v-else-if="!artisanMeetsLevel(selectedRecipe)">Artisan level too low</span>
          <span v-else-if="!canAfford(selectedRecipe)">Not enough {{ selectedRecipe.barName }}</span>
          <span v-else>✦ Craft {{ selectedRecipe.name }}</span>
        </button>
      </template>

    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import arcaneBg   from '../assets/backgrounds/fusion_workshop.png'
import shadowBg   from '../assets/backgrounds/shadow_loom_background.png'
import tanneryBg  from '../assets/backgrounds/iron_loom_background.png'

const activeAtelierId = ref('arcane')
const selectedRecipe  = ref(null)

const SLOT_LABELS = {
  main_hand: 'Weapon', off_hand: 'Off-Hand',
  head: 'Helm', chest: 'Chest', legs: 'Legs', boots: 'Boots', gloves: 'Gloves',
}

const STAT_LABELS = {
  atk: 'ATK', def: 'DEF', hp: 'HP', spd: 'SPD',
  atkPct: 'ATK %', defPct: 'DEF %', hpPct: 'HP %',
  critRate: 'Crit Rate', critDmg: 'Crit DMG',
}

const ATELIERS = [
  {
    id:      'arcane',
    name:    'Arcane Atelier',
    icon:    '✦',
    color:   '#9955ff',
    bg:      arcaneBg,
    tint:    'linear-gradient(135deg, rgba(80,20,140,0.18) 0%, transparent 60%)',
    req1:    'Blacksmithing',
    req2:    'Tailoring',
    flavour: 'Magic woven into steel. The enchanted warrior.',
    setBonus: [
      '2pc — +DEF%, +ATK%',
      '4pc — DEF% amplifies skill damage',
      '6pc — Arcane Charge: 3 hits taken → next skill +50% damage',
    ],
    tiers: [
      {
        id: 'steel', name: 'Steel', color: '#8899aa',
        recipes: [
          { id: 'arcane_chest_steel',  name: 'Arcane Hauberk',    slot: 'chest',    tier: 'steel',     barCost: 5, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { def: 90,  hp: 800,  atkPct: 0.05 } },
          { id: 'arcane_helm_steel',   name: 'Arcane Helm',       slot: 'head',     tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { def: 55,  hp: 500 } },
          { id: 'arcane_legs_steel',   name: 'Arcane Greaves',    slot: 'legs',     tier: 'steel',     barCost: 4, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { def: 70,  hp: 600,  spd: 8 } },
          { id: 'arcane_boots_steel',  name: 'Arcane Boots',      slot: 'boots',    tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { spd: 10, def: 40 } },
          { id: 'arcane_gloves_steel', name: 'Arcane Gauntlets',  slot: 'gloves',   tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { atk: 60,  atkPct: 0.04 } },
        ],
      },
      {
        id: 'mithril', name: 'Mithril', color: '#5bacd4',
        recipes: [
          { id: 'arcane_chest_mithril',  name: 'Void Plate',          slot: 'chest',  tier: 'mithril', barCost: 5, barName: 'Mithril Bars', reqLevel: 12, baseStats: { def: 280, hp: 3200, atkPct: 0.10 } },
          { id: 'arcane_helm_mithril',   name: 'Void Sallet',         slot: 'head',   tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { def: 160, hp: 2000 } },
          { id: 'arcane_legs_mithril',   name: 'Void Cuisses',        slot: 'legs',   tier: 'mithril', barCost: 4, barName: 'Mithril Bars', reqLevel: 12, baseStats: { def: 220, hp: 2600, spd: 16 } },
          { id: 'arcane_boots_mithril',  name: 'Void Sabatons',       slot: 'boots',  tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { spd: 20, def: 130 } },
          { id: 'arcane_gloves_mithril', name: 'Void Gauntlets',      slot: 'gloves', tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { atk: 200, atkPct: 0.09 } },
        ],
      },
      {
        id: 'moonsilver', name: 'Moonsilver', color: '#99ccff',
        recipes: [
          { id: 'arcane_chest_moon',  name: 'Moonshard Mantle',   slot: 'chest',  tier: 'moonsilver', barCost: 5, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { def: 420, hp: 6000, atkPct: 0.16 } },
          { id: 'arcane_helm_moon',   name: 'Moonshard Crown',    slot: 'head',   tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { def: 240, hp: 3800 } },
          { id: 'arcane_legs_moon',   name: 'Moonshard Cuisses',  slot: 'legs',   tier: 'moonsilver', barCost: 4, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { def: 340, hp: 4600, spd: 24 } },
          { id: 'arcane_boots_moon',  name: 'Moonshard Sabatons', slot: 'boots',  tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { spd: 28, def: 200 } },
          { id: 'arcane_gloves_moon', name: 'Moonshard Gauntlets',slot: 'gloves', tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { atk: 320, atkPct: 0.14 } },
        ],
      },
    ],
  },
  {
    id:      'shadow',
    name:    'Shadow Loom',
    icon:    '◈',
    color:   '#44bbaa',
    bg:      shadowBg,
    tint:    'linear-gradient(135deg, rgba(10,80,80,0.22) 0%, transparent 60%)',
    req1:    'Leatherworking',
    req2:    'Tailoring',
    flavour: 'Fast and magical. On dodge, empower your next strike.',
    setBonus: [
      '2pc — +SPD%, +Crit Rate',
      '4pc — +Crit DMG, +ATK%',
      '6pc — Phase Strike: on dodge, next skill +40% damage',
    ],
    tiers: [
      {
        id: 'steel', name: 'Steel', color: '#8899aa',
        recipes: [
          { id: 'shadow_chest_steel',  name: 'Shadowweave Cuirass', slot: 'chest',  tier: 'steel',     barCost: 4, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { spd: 12, critRate: 0.04, hp: 600 } },
          { id: 'shadow_helm_steel',   name: 'Shadowweave Cowl',    slot: 'head',   tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { spd: 8,  critRate: 0.03 } },
          { id: 'shadow_legs_steel',   name: 'Shadowweave Chaps',   slot: 'legs',   tier: 'steel',     barCost: 4, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { spd: 10, atk: 55 } },
          { id: 'shadow_boots_steel',  name: 'Shadowweave Treads',  slot: 'boots',  tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { spd: 14, critRate: 0.03 } },
          { id: 'shadow_gloves_steel', name: 'Shadowweave Wraps',   slot: 'gloves', tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { atk: 65, critRate: 0.04 } },
        ],
      },
      {
        id: 'mithril', name: 'Mithril', color: '#5bacd4',
        recipes: [
          { id: 'shadow_chest_mithril',  name: 'Phantom Cuirass',      slot: 'chest',  tier: 'mithril', barCost: 4, barName: 'Mithril Bars', reqLevel: 12, baseStats: { spd: 22, critRate: 0.07, hp: 2200 } },
          { id: 'shadow_helm_mithril',   name: 'Phantom Cowl',         slot: 'head',   tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { spd: 16, critRate: 0.06 } },
          { id: 'shadow_legs_mithril',   name: 'Phantom Chaps',        slot: 'legs',   tier: 'mithril', barCost: 4, barName: 'Mithril Bars', reqLevel: 12, baseStats: { spd: 18, atk: 160 } },
          { id: 'shadow_boots_mithril',  name: 'Phantom Treads',       slot: 'boots',  tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { spd: 26, critRate: 0.06 } },
          { id: 'shadow_gloves_mithril', name: 'Phantom Wraps',        slot: 'gloves', tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { atk: 200, critRate: 0.07 } },
        ],
      },
      {
        id: 'moonsilver', name: 'Moonsilver', color: '#99ccff',
        recipes: [
          { id: 'shadow_chest_moon',  name: 'Moonveil Coat',    slot: 'chest',  tier: 'moonsilver', barCost: 4, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { spd: 32, critRate: 0.10, hp: 4000 } },
          { id: 'shadow_helm_moon',   name: 'Moonveil Coif',    slot: 'head',   tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { spd: 24, critRate: 0.09 } },
          { id: 'shadow_legs_moon',   name: 'Moonveil Chaps',   slot: 'legs',   tier: 'moonsilver', barCost: 4, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { spd: 28, atk: 260 } },
          { id: 'shadow_boots_moon',  name: 'Moonveil Treads',  slot: 'boots',  tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { spd: 36, critRate: 0.09 } },
          { id: 'shadow_gloves_moon', name: 'Moonveil Wraps',   slot: 'gloves', tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { atk: 320, critRate: 0.10 } },
        ],
      },
    ],
  },
  {
    id:      'tannery',
    name:    'Iron Tannery',
    icon:    '⬡',
    color:   '#cc7733',
    bg:      tanneryBg,
    tint:    'linear-gradient(135deg, rgba(100,50,10,0.22) 0%, transparent 60%)',
    req1:    'Blacksmithing',
    req2:    'Leatherworking',
    flavour: 'The armored predator. Dodge that scales with DEF.',
    setBonus: [
      '2pc — +DEF%, +SPD',
      '4pc — +HP%, +Crit Rate',
      '6pc — Iron Reflex: chance to fully evade; on evade next attack +25% ATK',
    ],
    tiers: [
      {
        id: 'steel', name: 'Steel', color: '#8899aa',
        recipes: [
          { id: 'tannery_chest_steel',  name: 'Ironveil Hauberk',   slot: 'chest',  tier: 'steel',     barCost: 5, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { def: 80, hp: 700, spd: 8 } },
          { id: 'tannery_helm_steel',   name: 'Ironveil Helm',      slot: 'head',   tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { def: 50, hp: 450 } },
          { id: 'tannery_legs_steel',   name: 'Ironveil Chaps',     slot: 'legs',   tier: 'steel',     barCost: 4, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { def: 65, spd: 10 } },
          { id: 'tannery_boots_steel',  name: 'Ironveil Treads',    slot: 'boots',  tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { spd: 12, def: 38 } },
          { id: 'tannery_gloves_steel', name: 'Ironveil Gauntlets', slot: 'gloves', tier: 'steel',     barCost: 3, barName: 'Steel Bars',     reqLevel: 5,  baseStats: { atk: 55, def: 44 } },
        ],
      },
      {
        id: 'mithril', name: 'Mithril', color: '#5bacd4',
        recipes: [
          { id: 'tannery_chest_mithril',  name: 'Starforged Hide',     slot: 'chest',  tier: 'mithril', barCost: 5, barName: 'Mithril Bars', reqLevel: 12, baseStats: { def: 250, hp: 2800, spd: 16 } },
          { id: 'tannery_helm_mithril',   name: 'Starforged Helm',     slot: 'head',   tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { def: 148, hp: 1800 } },
          { id: 'tannery_legs_mithril',   name: 'Starforged Chaps',    slot: 'legs',   tier: 'mithril', barCost: 4, barName: 'Mithril Bars', reqLevel: 12, baseStats: { def: 200, spd: 20 } },
          { id: 'tannery_boots_mithril',  name: 'Starforged Treads',   slot: 'boots',  tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { spd: 22, def: 120 } },
          { id: 'tannery_gloves_mithril', name: 'Starforged Gauntlets',slot: 'gloves', tier: 'mithril', barCost: 3, barName: 'Mithril Bars', reqLevel: 12, baseStats: { atk: 175, def: 130 } },
        ],
      },
      {
        id: 'moonsilver', name: 'Moonsilver', color: '#99ccff',
        recipes: [
          { id: 'tannery_chest_moon',  name: 'Eclipse Plate',     slot: 'chest',  tier: 'moonsilver', barCost: 5, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { def: 400, hp: 5200, spd: 24 } },
          { id: 'tannery_helm_moon',   name: 'Eclipse Coif',      slot: 'head',   tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { def: 230, hp: 3200 } },
          { id: 'tannery_legs_moon',   name: 'Eclipse Chaps',     slot: 'legs',   tier: 'moonsilver', barCost: 4, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { def: 320, spd: 30 } },
          { id: 'tannery_boots_moon',  name: 'Eclipse Treads',    slot: 'boots',  tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { spd: 32, def: 185 } },
          { id: 'tannery_gloves_moon', name: 'Eclipse Gauntlets', slot: 'gloves', tier: 'moonsilver', barCost: 3, barName: 'Moonsilver Bars', reqLevel: 18, baseStats: { atk: 280, def: 200 } },
        ],
      },
    ],
  },
]

const activeAtelier = computed(() => ATELIERS.find(a => a.id === activeAtelierId.value))

const activeTierColor = computed(() => {
  if (!selectedRecipe.value) return '#fff'
  for (const tier of activeAtelier.value.tiers) {
    if (tier.recipes.some(r => r.id === selectedRecipe.value.id)) return tier.color
  }
  return '#fff'
})

const activeTierName = computed(() => {
  if (!selectedRecipe.value) return ''
  for (const tier of activeAtelier.value.tiers) {
    if (tier.recipes.some(r => r.id === selectedRecipe.value.id)) return tier.name
  }
  return ''
})

// ── Stores ────────────────────────────────────────────────────────────
import { useArtisanStore }    from '../stores/useArtisanStore.js'
import { useInventoryStore }  from '../stores/useInventoryStore.js'
import { useResourceStore }   from '../stores/useResourceStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { createItemInstance } from '../game/Gear.js'

const artisan    = useArtisanStore()
const inventory  = useInventoryStore()
const resources  = useResourceStore()
const collection = useCollectionStore()

// ── Constants ─────────────────────────────────────────────────────────
const SKILL_IDS = {
  'Blacksmithing':  'blacksmithing',
  'Leatherworking': 'leatherworking',
  'Tailoring':      'tailoring',
}

const SLOT_TO_GEARTYPE = {
  chest: 'armor', head: 'helmet', legs: 'legs', boots: 'boots', gloves: 'gloves',
}

const FUSION_XP_PER_TIER = { steel: 20, mithril: 45, moonsilver: 90 }

// ── Artisan helpers ───────────────────────────────────────────────────
const assignedKey = computed(() => {
  if (activeAtelierId.value === 'arcane')   return artisan.assignedFusionArcaneKey
  if (activeAtelierId.value === 'shadow')   return artisan.assignedFusionShadowKey
  if (activeAtelierId.value === 'tannery')  return artisan.assignedFusionTanneryKey
  return null
})

function artisanSkillLevel(heroKey, reqName) {
  return artisan.getSkillLevel(heroKey, SKILL_IDS[reqName])
}

const eligibleArtisans = computed(() => {
  const s1 = SKILL_IDS[activeAtelier.value.req1]
  const s2 = SKILL_IDS[activeAtelier.value.req2]
  return collection.roster.filter(({ hero }) =>
    hero.artisanSkills?.some(s => s.id === s1) &&
    hero.artisanSkills?.some(s => s.id === s2)
  )
})

const assignedArtisan = computed(() => {
  const key = assignedKey.value
  if (!key) return null
  return eligibleArtisans.value.find(e => e.key === key) ?? null
})

function assignArtisan(heroKey) {
  if (activeAtelierId.value === 'arcane')   artisan.assignFusionArcane(heroKey)
  if (activeAtelierId.value === 'shadow')   artisan.assignFusionShadow(heroKey)
  if (activeAtelierId.value === 'tannery')  artisan.assignFusionTannery(heroKey)
}

function unassignArtisan() {
  if (activeAtelierId.value === 'arcane')   artisan.unassignFusionArcane()
  if (activeAtelierId.value === 'shadow')   artisan.unassignFusionShadow()
  if (activeAtelierId.value === 'tannery')  artisan.unassignFusionTannery()
}

// ── Crafting logic ────────────────────────────────────────────────────
function canAfford(recipe) {
  return (resources.bars[recipe.tier] ?? 0) >= recipe.barCost
}

function artisanMeetsLevel(recipe) {
  const key = assignedKey.value
  if (!key) return false
  return artisanSkillLevel(key, activeAtelier.value.req1) >= recipe.reqLevel &&
         artisanSkillLevel(key, activeAtelier.value.req2) >= recipe.reqLevel
}

function canCraft(recipe) {
  return !!recipe && canAfford(recipe) && !!assignedKey.value && artisanMeetsLevel(recipe)
}

const craftResult = ref(null)
let _flashTimer = null

function craft() {
  if (!selectedRecipe.value || !canCraft(selectedRecipe.value)) return
  const recipe = selectedRecipe.value
  resources.removeBar(recipe.tier, recipe.barCost)

  const instance = createItemInstance({
    id:        recipe.id,
    name:      recipe.name,
    gearType:  SLOT_TO_GEARTYPE[recipe.slot],
    weaponType: null,
    rarity:    'Common',
    stats:     { ...recipe.baseStats },
    baseStats: { ...recipe.baseStats },
    tier:      recipe.tier,
    slot:      recipe.slot,
    armorType: activeAtelierId.value,
  })
  instance.craftedAt       = Date.now()
  instance.crafted         = true
  instance.craftDiscipline = 'fusion'
  inventory.addInstance(instance)

  const xp  = FUSION_XP_PER_TIER[recipe.tier] ?? 20
  const key = assignedKey.value
  artisan.addSkillXp(key, SKILL_IDS[activeAtelier.value.req1], xp)
  artisan.addSkillXp(key, SKILL_IDS[activeAtelier.value.req2], xp)

  craftResult.value = recipe.name
  clearTimeout(_flashTimer)
  _flashTimer = setTimeout(() => { craftResult.value = null }, 3000)
}
</script>

<style scoped>
.fusion-workshop {
  position: relative;
  width: 100%; height: 100%;
  display: flex; overflow: hidden;
}

.fw-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  z-index: 0;
}
.fw-tint {
  position: absolute; inset: 0; z-index: 1;
  pointer-events: none; transition: background 0.5s ease;
}
.fw-overlay {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(to right, rgba(4,2,8,0.82) 0%, rgba(4,2,8,0.55) 42%, rgba(4,2,8,0.28) 100%);
}

/* ── Left panel ──────────────────────────────────────────────────── */
.fw-panel {
  position: relative; z-index: 3;
  width: 260px; min-width: 220px;
  display: flex; flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.06);
  background: rgba(4,2,8,0.30);
  overflow: hidden;
}

.atelier-tabs {
  display: flex; flex-direction: column;
  padding: 14px 10px 8px;
  gap: 4px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.atelier-tab {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  color: #888; font-size: 0.72rem; letter-spacing: 0.5px;
  cursor: pointer; transition: all 0.15s;
  font-family: var(--font-head);
}
.atelier-tab:hover { color: #ccc; background: rgba(255,255,255,0.06); }
.atelier-tab.active {
  color: var(--ac);
  border-color: var(--ac);
  background: rgba(255,255,255,0.07);
  box-shadow: 0 0 10px -4px var(--ac);
}
.at-icon { font-size: 0.85rem; }
.at-name { font-weight: 700; }

.artisan-req {
  display: flex; align-items: center; gap: 6px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.req-chip {
  font-size: 0.58rem; font-family: var(--font-head);
  letter-spacing: 1px; text-transform: uppercase;
  color: var(--ac); border: 1px solid var(--ac);
  padding: 2px 7px; border-radius: 20px;
  opacity: 0.8;
}
.req-plus { font-size: 0.65rem; color: #555; }

.recipe-tiers {
  flex: 1; overflow-y: auto;
  padding: 8px 0 12px;
}
.recipe-tiers::-webkit-scrollbar { width: 3px; }
.recipe-tiers::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); }

.tier-block { margin-bottom: 4px; }

.tier-head {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 14px;
  font-family: var(--font-head);
  font-size: 0.58rem; letter-spacing: 2px; text-transform: uppercase;
  color: #666;
}
.tier-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--tc); opacity: 0.7; flex-shrink: 0;
}
.tier-name { color: var(--tc); font-weight: 700; }
.tier-count {
  margin-left: auto;
  font-size: 0.58rem; color: #555;
  background: rgba(255,255,255,0.05);
  padding: 1px 6px; border-radius: 10px;
}

.recipe-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 7px 14px;
  background: none; border: none; border-left: 2px solid transparent;
  color: #aaa; font-size: 0.70rem; cursor: pointer;
  transition: all 0.12s; text-align: left;
}
.recipe-btn:hover { background: rgba(255,255,255,0.04); color: #ddd; }
.recipe-btn.active {
  border-left-color: var(--tc);
  background: rgba(255,255,255,0.06);
  color: #fff;
}
.rb-slot {
  font-size: 0.56rem; color: #555; width: 46px;
  flex-shrink: 0; text-transform: uppercase; letter-spacing: 0.5px;
}
.rb-name { flex: 1; }
.rb-cost { font-size: 0.62rem; color: #666; flex-shrink: 0; }

/* ── Detail panel ────────────────────────────────────────────────── */
.fw-detail {
  position: relative; z-index: 3;
  flex: 1; display: flex; flex-direction: column;
  padding: 36px 40px;
  overflow-y: auto;
}

.fw-empty {
  display: flex; flex-direction: column;
  justify-content: center; align-items: flex-start;
  height: 100%; max-width: 460px;
}
.fw-empty-title {
  font-family: var(--font-head);
  font-size: 1.8rem; color: #e8dcc8; letter-spacing: 2px;
  margin-bottom: 10px;
}
.fw-empty-sub {
  font-size: 0.82rem; color: #888; font-style: italic;
  margin-bottom: 28px; line-height: 1.6;
}
.fw-set-bonus {
  border-left: 2px solid rgba(255,255,255,0.12);
  padding-left: 16px;
}
.fsb-label {
  font-family: var(--font-head); font-size: 0.55rem;
  letter-spacing: 2px; text-transform: uppercase;
  color: #666; margin-bottom: 10px;
}
.fsb-line {
  font-size: 0.73rem; color: #aaa; margin-bottom: 6px; line-height: 1.5;
}

.detail-header { margin-bottom: 28px; }
.dh-slot {
  font-size: 0.58rem; letter-spacing: 2px; text-transform: uppercase;
  color: #666; font-family: var(--font-head); margin-bottom: 6px;
}
.dh-name {
  font-family: var(--font-head); font-size: 1.5rem;
  color: #e8dcc8; letter-spacing: 1px; margin-bottom: 6px;
}
.dh-tier { font-size: 0.65rem; letter-spacing: 1.5px; text-transform: uppercase; font-family: var(--font-head); }

.detail-stats, .detail-cost, .detail-reqs {
  margin-bottom: 22px;
}
.ds-label {
  font-family: var(--font-head); font-size: 0.55rem;
  letter-spacing: 2px; text-transform: uppercase;
  color: #555; margin-bottom: 10px;
}
.stat-row {
  display: flex; justify-content: space-between;
  padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
  font-size: 0.73rem;
}
.stat-key { color: #888; }
.stat-val { color: #d4a855; font-weight: 600; }

.cost-mat { font-size: 0.78rem; color: #ccc; }

.req-row {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 8px;
}
.req-lv { font-size: 0.68rem; color: #666; }
.req-lv.unmet { color: #e05050; }

.craft-btn {
  margin-top: 8px; width: 100%;
  padding: 13px 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 6px;
  color: #444; font-family: var(--font-head);
  font-size: 0.74rem; letter-spacing: 2px; text-transform: uppercase;
  cursor: not-allowed; transition: all 0.15s;
}
.craft-btn.ready {
  background: rgba(153,85,255,0.12);
  border-color: rgba(153,85,255,0.5);
  color: #bb88ff; cursor: pointer;
}
.craft-btn.ready:hover {
  background: rgba(153,85,255,0.22);
  border-color: #9955ff;
  box-shadow: 0 0 20px rgba(153,85,255,0.2);
}
.craft-btn.flash {
  background: rgba(80,200,120,0.15);
  border-color: rgba(80,200,120,0.5);
  color: #88ddaa; cursor: default;
}

/* ── Artisan panel ──────────────────────────────────── */
.fw-artisan {
  margin-top: auto;
  padding: 12px 10px;
  border-top: 1px solid rgba(255,255,255,0.07);
}
.fwa-label {
  font-family: var(--font-head); font-size: 0.52rem;
  letter-spacing: 2px; text-transform: uppercase;
  color: #555; margin-bottom: 8px;
}
.fwa-assigned {
  display: flex; align-items: center; gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; padding: 8px 10px;
}
.fwa-hero-name {
  font-family: var(--font-head); font-size: 0.7rem;
  color: #ddd; font-weight: 700; flex: 1;
}
.fwa-skills {
  display: flex; flex-direction: column; gap: 2px;
}
.fwa-skill {
  font-size: 0.56rem; color: #777; letter-spacing: 0.5px;
}
.fwa-unassign {
  background: none; border: none; color: #555;
  font-size: 1rem; cursor: pointer; padding: 0 4px;
  line-height: 1; flex-shrink: 0;
}
.fwa-unassign:hover { color: #e05050; }
.fwa-pick-btn {
  display: flex; flex-direction: column; gap: 2px;
  width: 100%; text-align: left;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 5px; padding: 7px 10px;
  cursor: pointer; transition: all 0.12s;
  margin-bottom: 4px;
}
.fwa-pick-btn:hover {
  background: rgba(153,85,255,0.08);
  border-color: rgba(153,85,255,0.3);
}
.fwa-pick-name { font-family: var(--font-head); font-size: 0.68rem; color: #ccc; }
.fwa-pick-lvs  { font-size: 0.55rem; color: #666; }
.fwa-none { font-size: 0.63rem; color: #555; font-style: italic; }
</style>
