<template>
  <div class="weapon-forge">

    <div class="wf-bg" :style="{ backgroundImage: `url(${forgeBg})` }" />
    <div class="wf-overlay" />

    <!-- ── Left: Hero roster ─────────────────────────────────────── -->
    <aside class="wf-roster">
      <div class="wfr-head">
        <div class="wfr-title">Heroes</div>
        <div class="wfr-filters">
          <button
            v-for="f in FILTERS" :key="f.id"
            class="wfr-filter"
            :class="{ active: activeFilter === f.id }"
            @click="activeFilter = f.id"
          >{{ f.label }}</button>
        </div>
      </div>

      <div class="wfr-list">
        <button
          v-for="entry in filteredRoster" :key="entry.key"
          class="wfr-hero"
          :class="{ active: selectedKey === entry.key, armed: !!getWeapon(entry.key) }"
          @click="selectHero(entry.key)"
        >
          <div class="wfrh-info">
            <span class="wfrh-name">{{ entry.hero.name }}</span>
            <span class="wfrh-role">{{ entry.hero.role }}</span>
          </div>
          <div v-if="getWeapon(entry.key)" class="wfrh-weapon">
            <span class="wfrh-wname">{{ getWeapon(entry.key).name }}</span>
            <span class="wfrh-tier">{{ TIERS[getWeapon(entry.key).tier - 1]?.numeral }}</span>
          </div>
          <div v-else class="wfrh-none">— unforged —</div>
        </button>
        <div v-if="!filteredRoster.length" class="wfr-empty">No heroes match this filter</div>
      </div>
    </aside>

    <!-- ── Center: Forge panel ───────────────────────────────────── -->
    <main class="wf-forge">

      <!-- Nothing selected -->
      <div v-if="!selectedKey" class="wf-splash">
        <div class="wfs-eyebrow">The Weapon Forge</div>
        <div class="wfs-title">Every weapon begins<br>with a name.</div>
        <div class="wfs-sub">Select a hero from the roster to forge their signature weapon or continue its chronicle.</div>
      </div>

      <!-- Hero selected — no weapon yet -->
      <template v-else-if="!getWeapon(selectedKey)">
        <div class="wfc-hero-name">{{ selectedHero?.name }}</div>
        <div class="wfc-headline">Forge a Weapon</div>
        <div class="wfc-deck">Choose its nature. Give it a name. Begin the chronicle.</div>

        <div class="wfc-type-grid">
          <button
            v-for="wt in WEAPON_TYPES" :key="wt.id"
            class="wfc-type"
            :class="{ chosen: chosenType === wt.id }"
            @click="chosenType = wt.id"
          >
            <span class="wfct-hand">{{ wt.hands }}</span>
            <span class="wfct-name">{{ wt.name }}</span>
          </button>
        </div>

        <div class="wfc-name-row">
          <input
            v-model="newWeaponName"
            class="wfc-name-input"
            placeholder="Name your weapon..."
            maxlength="32"
            spellcheck="false"
          />
        </div>

        <button
          class="wfc-begin-btn"
          :class="{ ready: chosenType && newWeaponName.trim() }"
          :disabled="!chosenType || !newWeaponName.trim()"
        >
          ✦ Begin the Chronicle
        </button>
      </template>

      <!-- Hero has weapon -->
      <template v-else>
        <div class="wfw-header">
          <div class="wfw-weapon-name">{{ getWeapon(selectedKey).name }}</div>
          <div class="wfw-meta">
            <span class="wfw-type">{{ WEAPON_TYPE_MAP[getWeapon(selectedKey).type]?.name }}</span>
            <span class="wfw-sep">·</span>
            <span class="wfw-hands">{{ WEAPON_TYPE_MAP[getWeapon(selectedKey).type]?.hands }}</span>
            <span class="wfw-sep">·</span>
            <span class="wfw-bearer">{{ selectedHero?.name }}</span>
          </div>
        </div>

        <!-- Tier track -->
        <div class="wfw-tier-track">
          <div
            v-for="t in TIERS" :key="t.num"
            class="wfw-pip"
            :class="{
              done:    getWeapon(selectedKey).tier > t.num,
              current: getWeapon(selectedKey).tier === t.num,
            }"
          >
            <div class="wfp-dot" />
            <div class="wfp-numeral">{{ t.numeral }}</div>
            <div class="wfp-name">{{ t.name }}</div>
          </div>
          <div class="wfw-tier-line" />
        </div>

        <!-- Current stats -->
        <div class="wfw-stats">
          <div class="wfws-tier-name">{{ TIERS[getWeapon(selectedKey).tier - 1]?.name }}</div>
          <div v-for="(val, stat) in currentStats(selectedKey)" :key="stat" class="wfw-stat-row">
            <span class="wfsr-key">{{ STAT_LABELS[stat] ?? stat }}</span>
            <span class="wfsr-val">+{{ typeof val === 'number' && val < 1 ? (val * 100).toFixed(0) + '%' : val }}</span>
          </div>
        </div>

        <!-- Next tier or Eternal -->
        <div v-if="getWeapon(selectedKey).tier < 6" class="wfw-next-tier">
          <div class="wfnt-label">Next — {{ TIERS[getWeapon(selectedKey).tier]?.name }}</div>
          <div class="wfnt-mats">
            <span v-for="mat in nextTierCost(selectedKey)" :key="mat.id" class="wfnt-mat">
              {{ mat.qty }}× {{ mat.name }}
            </span>
          </div>
          <button class="wfw-forge-btn">⚒ Forge Next Tier</button>
        </div>
        <div v-else class="wfw-eternal">
          <div class="wfe-sigil">✦</div>
          <div class="wfe-label">Eternal</div>
          <div class="wfe-sub">This weapon has reached its final form. Its chronicle is complete.</div>
        </div>
      </template>

    </main>

    <!-- ── Right: Chronicle ──────────────────────────────────────── -->
    <aside class="wf-chronicle">
      <div class="wfchr-head">
        <span class="wfchr-title">The Chronicle</span>
        <span v-if="getWeapon(selectedKey)" class="wfchr-wname">{{ getWeapon(selectedKey).name }}</span>
      </div>

      <div v-if="!selectedKey || !getWeapon(selectedKey)" class="wfchr-empty">
        <div class="wfchre-sigil">✦</div>
        <div class="wfchre-text">No chronicle has been written.<br>Every weapon begins with its first strike.</div>
      </div>

      <div v-else class="wfchr-entries">
        <div
          v-for="entry in [...getWeapon(selectedKey).chronicle].reverse()"
          :key="entry.tier"
          class="wfchr-entry"
          :class="{ latest: entry.tier === getWeapon(selectedKey).tier }"
        >
          <div class="wfce-tier-head">
            <span class="wfce-numeral">{{ TIERS[entry.tier - 1]?.numeral }}</span>
            <span class="wfce-tier-name">{{ TIERS[entry.tier - 1]?.name }}</span>
          </div>
          <div class="wfce-lore">{{ entry.lore }}</div>
          <div class="wfce-stats">
            <span v-for="(val, stat) in entry.stats" :key="stat" class="wfce-stat">
              {{ STAT_LABELS[stat] ?? stat }}
              +{{ typeof val === 'number' && val < 1 ? (val * 100).toFixed(0) + '%' : val }}
            </span>
          </div>
        </div>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import forgeBg from '../assets/backgrounds/weaponsmith_background.png'
import { useCollectionStore } from '../stores/useCollectionStore.js'

const collection = useCollectionStore()

// ── Constants ─────────────────────────────────────────────────────────
const WEAPON_TYPES = [
  { id: 'sword',      name: 'Sword',      hands: '1H'     },
  { id: 'greatsword', name: 'Greatsword', hands: '2H'     },
  { id: 'mace',       name: 'Mace',       hands: '1H'     },
  { id: 'warhammer',  name: 'War Hammer', hands: '2H'     },
  { id: 'dagger',     name: 'Dagger',     hands: '1H'     },
  { id: 'bow',        name: 'Bow',        hands: 'Ranged' },
  { id: 'crossbow',   name: 'Crossbow',   hands: 'Ranged' },
  { id: 'staff',      name: 'Staff',      hands: '2H'     },
  { id: 'wand',       name: 'Wand',       hands: '1H'     },
]
const WEAPON_TYPE_MAP = Object.fromEntries(WEAPON_TYPES.map(w => [w.id, w]))

const TIERS = [
  { num: 1, numeral: 'I',   name: 'First Light' },
  { num: 2, numeral: 'II',  name: 'Tempered'    },
  { num: 3, numeral: 'III', name: 'Bound'       },
  { num: 4, numeral: 'IV',  name: 'Hallowed'    },
  { num: 5, numeral: 'V',   name: 'Ascendant'   },
  { num: 6, numeral: 'VI',  name: 'Eternal'     },
]

const FILTERS = [
  { id: 'all',    label: 'All'       },
  { id: 'none',   label: 'Unforged'  },
  { id: '1h',     label: '1H'        },
  { id: '2h',     label: '2H'        },
  { id: 'ranged', label: 'Ranged'    },
]

const STAT_LABELS = {
  atk: 'ATK', atkPct: 'ATK %', critRate: 'Crit Rate',
  critDmg: 'Crit DMG', def: 'DEF', hp: 'HP', spd: 'SPD',
}

// ── State ─────────────────────────────────────────────────────────────
const selectedKey   = ref(null)
const activeFilter  = ref('all')
const chosenType    = ref(null)
const newWeaponName = ref('')

// Placeholder weapon store — will be replaced by useWeaponStore
const weapons = ref({})

// ── Computed ──────────────────────────────────────────────────────────
const selectedHero = computed(() =>
  collection.roster.find(e => e.key === selectedKey.value)?.hero ?? null
)

const filteredRoster = computed(() => {
  const roster = collection.roster
  if (activeFilter.value === 'all')    return roster
  if (activeFilter.value === 'none')   return roster.filter(e => !getWeapon(e.key))
  return roster.filter(e => {
    const w = getWeapon(e.key)
    if (!w) return false
    const hands = WEAPON_TYPE_MAP[w.type]?.hands ?? ''
    if (activeFilter.value === '1h')     return hands === '1H'
    if (activeFilter.value === '2h')     return hands === '2H'
    if (activeFilter.value === 'ranged') return hands === 'Ranged'
    return true
  })
})

// ── Helpers ───────────────────────────────────────────────────────────
function getWeapon(heroKey) {
  return weapons.value[heroKey] ?? null
}

function selectHero(key) {
  selectedKey.value   = key
  chosenType.value    = null
  newWeaponName.value = ''
}

// Placeholder stat/cost functions — will come from store logic
function currentStats(heroKey) {
  const w = getWeapon(heroKey)
  if (!w) return {}
  const base = { sword: { atk: 380 }, greatsword: { atk: 520 }, mace: { atk: 360 }, warhammer: { atk: 480 }, dagger: { atk: 320, critRate: 0.04 }, bow: { atk: 310, critDmg: 0.10 }, crossbow: { atk: 340 }, staff: { atk: 400 }, wand: { atk: 290, critRate: 0.05 } }
  return base[w.type] ?? { atk: 350 }
}

function nextTierCost(heroKey) {
  const w = getWeapon(heroKey)
  if (!w) return []
  const tier = w.tier
  const costs = [
    [{ id: 'steel',      qty: 3, name: 'Steel Bars'       }, { id: 'leather', qty: 1, name: 'Leather Scraps' }],
    [{ id: 'steel',      qty: 5, name: 'Steel Bars'       }, { id: 'leather', qty: 2, name: 'Leather Scraps' }, { id: 'wood',    qty: 1, name: 'Wood Planks'    }],
    [{ id: 'darksteel',  qty: 4, name: 'Darksteel Bars'   }, { id: 'hide',    qty: 2, name: 'Thick Hide'      }, { id: 'wood',    qty: 2, name: 'Wood Planks'    }],
    [{ id: 'mithril',    qty: 5, name: 'Mithril Bars'     }, { id: 'shadow',  qty: 3, name: 'Shadow Hide'     }, { id: 'crystal', qty: 1, name: 'Arcane Crystal' }],
    [{ id: 'moonsilver', qty: 4, name: 'Moonsilver Bars'  }, { id: 'void',    qty: 2, name: 'Void Essence'    }, { id: 'crystal', qty: 2, name: 'Arcane Crystal' }],
  ]
  return costs[tier - 1] ?? []
}
</script>

<style scoped>
.weapon-forge {
  position: relative;
  width: 100%; height: 100%;
  display: flex; overflow: hidden;
  font-family: var(--font-body, sans-serif);
  color: #ccc;
}

/* Background */
.wf-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center 20%;
  filter: brightness(0.35) saturate(0.7);
}
.wf-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    90deg,
    rgba(4,3,8,0.88) 0%,
    rgba(4,3,8,0.55) 30%,
    rgba(4,3,8,0.45) 60%,
    rgba(4,3,8,0.85) 100%
  );
}

/* ── Left panel ───────────────────────────────────────────────────── */
.wf-roster {
  position: relative; z-index: 1;
  width: 230px; flex-shrink: 0;
  display: flex; flex-direction: column;
  border-right: 1px solid rgba(212,175,55,0.12);
  background: rgba(4,3,8,0.5);
  backdrop-filter: blur(6px);
}

.wfr-head {
  padding: 20px 16px 10px;
  border-bottom: 1px solid rgba(212,175,55,0.10);
}
.wfr-title {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 3px;
  text-transform: uppercase; color: #b8960a;
  margin-bottom: 10px;
}
.wfr-filters {
  display: flex; flex-wrap: wrap; gap: 4px;
}
.wfr-filter {
  background: none;
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: 3px; padding: 3px 8px;
  font-size: 0.58rem; color: #666; cursor: pointer;
  transition: all 0.12s;
}
.wfr-filter.active, .wfr-filter:hover {
  border-color: rgba(212,175,55,0.4);
  color: #b8960a;
}

.wfr-list {
  flex: 1; overflow-y: auto; padding: 8px;
}
.wfr-hero {
  width: 100%; text-align: left;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; padding: 9px 12px;
  margin-bottom: 4px; cursor: pointer;
  transition: all 0.12s;
  display: flex; flex-direction: column; gap: 4px;
}
.wfr-hero:hover {
  background: rgba(212,175,55,0.05);
  border-color: rgba(212,175,55,0.2);
}
.wfr-hero.active {
  background: rgba(212,175,55,0.08);
  border-color: rgba(212,175,55,0.4);
}
.wfr-hero.armed .wfrh-name { color: #d4af37; }

.wfrh-info { display: flex; justify-content: space-between; align-items: baseline; }
.wfrh-name {
  font-family: var(--font-head, serif);
  font-size: 0.7rem; color: #bbb; font-weight: 700;
}
.wfrh-role {
  font-size: 0.52rem; color: #555;
  text-transform: capitalize; letter-spacing: 0.5px;
}
.wfrh-weapon {
  display: flex; justify-content: space-between; align-items: center;
}
.wfrh-wname { font-size: 0.6rem; color: #b8960a; font-style: italic; }
.wfrh-tier {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; color: #777;
}
.wfrh-none { font-size: 0.58rem; color: #3a3a3a; font-style: italic; }
.wfr-empty { font-size: 0.65rem; color: #444; text-align: center; padding: 20px 0; }

/* ── Center ───────────────────────────────────────────────────────── */
.wf-forge {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 48px; overflow-y: auto;
}

/* Splash */
.wf-splash { text-align: center; max-width: 420px; }
.wfs-eyebrow {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 4px;
  text-transform: uppercase; color: #b8960a;
  margin-bottom: 20px;
}
.wfs-title {
  font-family: var(--font-head, serif);
  font-size: 2.2rem; color: #e8d88a;
  line-height: 1.15; margin-bottom: 16px;
  font-weight: 400;
}
.wfs-sub { font-size: 0.8rem; color: #555; line-height: 1.6; }

/* Creation form */
.wfc-hero-name {
  font-family: var(--font-head, serif);
  font-size: 0.58rem; letter-spacing: 3px;
  text-transform: uppercase; color: #777;
  margin-bottom: 6px;
}
.wfc-headline {
  font-family: var(--font-head, serif);
  font-size: 1.8rem; color: #e8d88a;
  margin-bottom: 8px; font-weight: 400;
}
.wfc-deck { font-size: 0.75rem; color: #555; margin-bottom: 28px; }

.wfc-type-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 8px; width: 100%; max-width: 420px;
  margin-bottom: 24px;
}
.wfc-type {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 12px 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; cursor: pointer;
  transition: all 0.12s;
}
.wfc-type:hover {
  background: rgba(212,175,55,0.06);
  border-color: rgba(212,175,55,0.25);
}
.wfc-type.chosen {
  background: rgba(212,175,55,0.10);
  border-color: rgba(212,175,55,0.55);
}
.wfct-hand {
  font-size: 0.48rem; color: #666;
  letter-spacing: 1px; text-transform: uppercase;
}
.wfct-name {
  font-family: var(--font-head, serif);
  font-size: 0.75rem; color: #bbb;
}
.wfc-type.chosen .wfct-name { color: #d4af37; }

.wfc-name-row { width: 100%; max-width: 420px; margin-bottom: 20px; }
.wfc-name-input {
  width: 100%; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 6px; padding: 12px 16px;
  font-family: var(--font-head, serif);
  font-size: 1.1rem; color: #e8d88a;
  text-align: center; letter-spacing: 1px;
  outline: none; transition: border-color 0.15s;
}
.wfc-name-input::placeholder { color: #3a3a3a; font-style: italic; }
.wfc-name-input:focus { border-color: rgba(212,175,55,0.55); }

.wfc-begin-btn {
  padding: 13px 40px;
  background: rgba(212,175,55,0.08);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 6px; color: #666;
  font-family: var(--font-head, serif);
  font-size: 0.85rem; letter-spacing: 2px;
  text-transform: uppercase; cursor: not-allowed;
  transition: all 0.15s;
}
.wfc-begin-btn.ready {
  color: #d4af37; cursor: pointer;
  border-color: rgba(212,175,55,0.5);
  background: rgba(212,175,55,0.12);
}
.wfc-begin-btn.ready:hover {
  background: rgba(212,175,55,0.20);
  border-color: rgba(212,175,55,0.7);
}

/* Weapon detail */
.wfw-header { text-align: center; margin-bottom: 28px; }
.wfw-weapon-name {
  font-family: var(--font-head, serif);
  font-size: 2rem; color: #e8d88a;
  font-weight: 400; letter-spacing: 1px;
  margin-bottom: 6px;
}
.wfw-meta { display: flex; align-items: center; justify-content: center; gap: 8px; }
.wfw-type { font-size: 0.7rem; color: #b8960a; text-transform: uppercase; letter-spacing: 1px; }
.wfw-sep  { color: #444; }
.wfw-hands { font-size: 0.7rem; color: #666; }
.wfw-bearer { font-size: 0.7rem; color: #555; font-style: italic; }

/* Tier track */
.wfw-tier-track {
  position: relative;
  display: flex; justify-content: center; gap: 0;
  width: 100%; max-width: 480px; margin-bottom: 32px;
}
.wfw-tier-line {
  position: absolute; top: 10px; left: 10%; right: 10%;
  height: 1px; background: rgba(212,175,55,0.15); z-index: 0;
}
.wfw-pip {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  flex: 1; gap: 4px;
}
.wfp-dot {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2px solid rgba(212,175,55,0.2);
  background: rgba(4,3,8,0.9);
  transition: all 0.2s;
}
.wfw-pip.done .wfp-dot {
  background: rgba(212,175,55,0.3);
  border-color: rgba(212,175,55,0.7);
}
.wfw-pip.current .wfp-dot {
  background: #b8960a;
  border-color: #d4af37;
  box-shadow: 0 0 10px rgba(212,175,55,0.4);
}
.wfp-numeral {
  font-family: var(--font-head, serif);
  font-size: 0.6rem; color: #444;
}
.wfw-pip.done .wfp-numeral    { color: #b8960a; }
.wfw-pip.current .wfp-numeral { color: #d4af37; }
.wfp-name { font-size: 0.48rem; color: #444; letter-spacing: 0.5px; text-align: center; white-space: nowrap; }
.wfw-pip.current .wfp-name { color: #888; }

/* Stats */
.wfw-stats { margin-bottom: 28px; text-align: center; }
.wfws-tier-name {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 2px;
  text-transform: uppercase; color: #666;
  margin-bottom: 10px;
}
.wfw-stat-row {
  display: flex; justify-content: center; gap: 24px;
  font-size: 0.8rem;
}
.wfsr-key { color: #666; }
.wfsr-val { color: #d4af37; font-family: var(--font-head, serif); }

/* Next tier */
.wfw-next-tier { text-align: center; }
.wfnt-label {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 2px;
  text-transform: uppercase; color: #666;
  margin-bottom: 10px;
}
.wfnt-mats { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
.wfnt-mat {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 4px; padding: 4px 12px;
  font-size: 0.65rem; color: #888;
}
.wfnt-qty { color: #d4af37; margin-right: 3px; }

.wfw-forge-btn {
  padding: 12px 36px;
  background: rgba(212,175,55,0.10);
  border: 1px solid rgba(212,175,55,0.4);
  border-radius: 6px; color: #d4af37;
  font-family: var(--font-head, serif);
  font-size: 0.85rem; letter-spacing: 2px;
  text-transform: uppercase; cursor: pointer;
  transition: all 0.15s;
}
.wfw-forge-btn:hover {
  background: rgba(212,175,55,0.20);
  border-color: rgba(212,175,55,0.7);
}

/* Eternal */
.wfw-eternal { text-align: center; }
.wfe-sigil { font-size: 2rem; color: #d4af37; margin-bottom: 6px; opacity: 0.7; }
.wfe-label {
  font-family: var(--font-head, serif);
  font-size: 1.2rem; color: #e8d88a;
  letter-spacing: 3px; text-transform: uppercase;
  margin-bottom: 8px;
}
.wfe-sub { font-size: 0.7rem; color: #555; max-width: 280px; margin: 0 auto; line-height: 1.6; }

/* ── Right: Chronicle ─────────────────────────────────────────────── */
.wf-chronicle {
  position: relative; z-index: 1;
  width: 280px; flex-shrink: 0;
  display: flex; flex-direction: column;
  border-left: 1px solid rgba(212,175,55,0.12);
  background: rgba(8,6,2,0.6);
  backdrop-filter: blur(6px);
}

.wfchr-head {
  padding: 20px 18px 14px;
  border-bottom: 1px solid rgba(212,175,55,0.10);
  display: flex; flex-direction: column; gap: 3px;
}
.wfchr-title {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 3px;
  text-transform: uppercase; color: #b8960a;
}
.wfchr-wname {
  font-family: var(--font-head, serif);
  font-size: 0.85rem; color: #e8d88a;
  font-style: italic;
}

.wfchr-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px; text-align: center; gap: 12px;
}
.wfchre-sigil { font-size: 1.5rem; color: #2a2415; }
.wfchre-text { font-size: 0.68rem; color: #3a3a3a; line-height: 1.7; font-style: italic; }

.wfchr-entries {
  flex: 1; overflow-y: auto; padding: 12px;
  display: flex; flex-direction: column; gap: 0;
}
.wfchr-entry {
  padding: 14px 4px 14px;
  border-bottom: 1px solid rgba(212,175,55,0.07);
}
.wfchr-entry:first-child { border-top: none; }
.wfchr-entry.latest .wfce-tier-head { opacity: 1; }

.wfce-tier-head {
  display: flex; align-items: baseline; gap: 8px;
  margin-bottom: 8px; opacity: 0.7;
}
.wfce-numeral {
  font-family: var(--font-head, serif);
  font-size: 0.85rem; color: #d4af37;
}
.wfce-tier-name {
  font-family: var(--font-head, serif);
  font-size: 0.6rem; letter-spacing: 1.5px;
  text-transform: uppercase; color: #888;
}

.wfce-lore {
  font-size: 0.67rem; color: #777;
  line-height: 1.75; margin-bottom: 10px;
  font-style: italic;
}
.wfce-stats { display: flex; flex-wrap: wrap; gap: 6px; }
.wfce-stat {
  font-size: 0.58rem; color: #b8960a;
  background: rgba(212,175,55,0.06);
  border: 1px solid rgba(212,175,55,0.12);
  border-radius: 3px; padding: 2px 8px;
}
</style>
