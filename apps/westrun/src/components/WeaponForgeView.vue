<template>
  <div class="weapon-forge">

    <div class="wf-bg" :style="{ backgroundImage: `url(${forgeBg})` }" />
    <div class="wf-overlay" />

    <!-- ── Left: Soul weapon inventory ──────────────────────────────── -->
    <aside class="wf-inventory">
      <div class="wfi-head">
        <div class="wfi-title">Soul Weapons</div>
        <input v-model="nameSearch" class="wfi-search" placeholder="Search…" spellcheck="false" />
      </div>

      <div class="wfi-list">
        <button
          v-for="w in filteredWeapons" :key="w.id"
          class="wfi-weapon"
          :class="{ active: selectedId === w.id }"
          :style="{ '--cc': SOUL_CATEGORIES[w.category]?.color }"
          @click="selectWeapon(w.id)"
        >
          <div class="wfiw-top">
            <span class="wfiw-name">{{ w.name }}</span>
            <span class="wfiw-tier">{{ TIERS[w.tier - 1]?.numeral }}</span>
          </div>
          <div class="wfiw-bottom">
            <span class="wfiw-cat">{{ SOUL_CATEGORIES[w.category]?.label }}</span>
            <span v-if="weaponStore.getHeroForWeapon(w.id)" class="wfiw-bearer">
              {{ heroName(weaponStore.getHeroForWeapon(w.id)) }}
            </span>
            <span v-else class="wfiw-unassigned">unassigned</span>
          </div>
        </button>
        <div v-if="!filteredWeapons.length && !nameSearch" class="wfi-empty">No soul weapons forged yet.</div>
      </div>

      <div class="wfi-foot">
        <button class="wfi-craft-btn" @click="openCreate">✦ Craft New Weapon</button>
      </div>
    </aside>

    <!-- ── Center: Forge panel ───────────────────────────────────────── -->
    <main class="wf-center">

      <!-- Splash -->
      <div v-if="!showCreate && !selectedWeapon" class="wf-splash">
        <div class="wfs-eyebrow">The Soul Forge</div>
        <div class="wfs-title">Every weapon begins<br>with a name.</div>
        <div class="wfs-sub">Craft a soul weapon, forge it through six tiers, and assign it to a hero. The weapon carries their story.</div>
        <button class="wfs-cta" @click="openCreate">✦ Craft First Weapon</button>
      </div>

      <!-- Create form -->
      <div v-else-if="showCreate" class="wfc-create">
        <div class="wfc-eyebrow">New Soul Weapon</div>
        <div class="wfc-title">Choose its nature.</div>

        <div class="wfc-cats">
          <button
            v-for="cat in SOUL_CATEGORIES" :key="cat.id"
            class="wfc-cat"
            :class="{ selected: newCategory === cat.id }"
            :style="{ '--c': cat.color }"
            @click="newCategory = cat.id"
          >
            <span class="wfcc-label">{{ cat.label }}</span>
            <span class="wfcc-form">{{ cat.weaponForm }}</span>
            <span class="wfcc-stat">{{ STAT_LABELS[cat.stat] }}</span>
          </button>
        </div>

        <div v-if="newCategory" class="wfc-name-section">
          <div class="wfc-name-row">
            <input
              v-model="newWeaponName"
              class="wfc-name-input"
              placeholder="Name your weapon…"
              maxlength="32"
              spellcheck="false"
            />
            <button class="wfc-roll-btn" title="Generate a name" @click="rollName">⚄</button>
          </div>
        </div>

        <div class="wfc-actions">
          <button class="wfc-cancel" @click="showCreate = false; newCategory = null; newWeaponName = ''">Cancel</button>
          <button
            class="wfc-forge-btn"
            :class="{ ready: !!newWeaponName.trim() && !!newCategory }"
            :disabled="!newWeaponName.trim() || !newCategory"
            @click="craftWeapon"
          >✦ Forge Weapon</button>
        </div>
      </div>

      <!-- Weapon detail -->
      <template v-else-if="selectedWeapon">
        <div class="wfw-header">
          <div class="wfw-name">{{ selectedWeapon.name }}</div>
          <div class="wfw-meta">
            <span class="wfw-cat" :style="{ color: catColor }">{{ SOUL_CATEGORIES[selectedWeapon.category]?.label }}</span>
            <span class="wfw-sep">·</span>
            <span class="wfw-form">{{ SOUL_CATEGORIES[selectedWeapon.category]?.weaponForm }}</span>
          </div>
        </div>

        <!-- Weapon image -->
        <div class="wfw-img-wrap">
          <img
            v-if="weaponImg"
            :src="weaponImg"
            class="wfw-img"
            :style="{ '--glow': catColor }"
            alt=""
          />
          <div v-else class="wfw-img-placeholder" :style="{ '--c': catColor }">
            <span class="wfip-form">{{ SOUL_CATEGORIES[selectedWeapon.category]?.weaponForm }}</span>
            <span class="wfip-tier">{{ TIERS[selectedWeapon.tier - 1]?.name }}</span>
          </div>
        </div>

        <!-- Tier track -->
        <div class="wfw-tier-track">
          <div
            v-for="t in TIERS" :key="t.num"
            class="wfw-pip"
            :class="{ done: selectedWeapon.tier > t.num, current: selectedWeapon.tier === t.num }"
          >
            <div class="wfp-dot" :style="selectedWeapon.tier >= t.num ? { background: catColor, borderColor: catColor, boxShadow: `0 0 8px ${catColor}88` } : {}" />
            <div class="wfp-numeral">{{ t.numeral }}</div>
            <div class="wfp-name">{{ t.name }}</div>
          </div>
          <div class="wfw-tier-line" />
        </div>

        <!-- Stat bonus -->
        <div class="wfw-bonus">
          <div class="wfb-label">{{ STAT_LABELS[selectedWeapon.category] }} Bonus</div>
          <div class="wfb-val" :style="{ color: catColor }">{{ formatStat(selectedWeapon.category, selectedWeapon.tier) }}</div>
          <div v-if="selectedWeapon.tier < 6" class="wfb-next">
            Next tier: <span :style="{ color: catColor + 'bb' }">{{ formatStat(selectedWeapon.category, selectedWeapon.tier + 1) }}</span>
          </div>
        </div>

        <!-- Chronicle lore -->
        <div class="wfw-lore">{{ latestLore }}</div>

        <!-- Forge / Eternal -->
        <div v-if="selectedWeapon.tier < 6" class="wfw-next">
          <div class="wfn-tier-label">Next — {{ TIERS[selectedWeapon.tier]?.name }}</div>
          <div class="wfn-mats">
            <span
              v-for="mat in weaponStore.tierCost(selectedWeapon.tier)" :key="mat.id"
              class="wfn-mat"
              :class="{ short: !canAffordMat(mat) }"
            >{{ mat.qty }}× {{ mat.name }}</span>
          </div>
          <button
            class="wfn-btn"
            :class="{ cant: !weaponStore.canAffordTier(selectedWeapon.tier) }"
            :disabled="!weaponStore.canAffordTier(selectedWeapon.tier)"
            @click="forgeTier"
          >⚒ Forge Next Tier</button>
        </div>
        <div v-else class="wfw-eternal">
          <div class="wfe-sigil" :style="{ color: catColor }">✦</div>
          <div class="wfe-label">Eternal</div>
          <div class="wfe-sub">This weapon has reached its final form. Its chronicle is complete.</div>
        </div>
      </template>

    </main>

    <!-- ── Right: Team assignment ───────────────────────────────────── -->
    <aside class="wf-assign">
      <div class="wfa-head">
        <span class="wfa-title">Your Team</span>
        <span class="wfa-count">{{ collection.teamEntries.filter(Boolean).length }}/{{ collection.teamEntries.length }}</span>
      </div>

      <div v-if="!collection.teamEntries.filter(Boolean).length" class="wfa-empty">
        <div class="wfae-sigil">✦</div>
        <div class="wfae-text">No heroes in your team yet. Build your team from the Roster.</div>
      </div>

      <div v-else class="wfa-list">
        <div
          v-for="(entry, i) in collection.teamEntries" :key="entry?.key ?? i"
          class="wfa-slot"
          :class="[
            entry ? `rarity-${entry.hero.rarity?.toLowerCase()}` : 'empty-slot',
            { equipped: entry && assignedKey === entry.key, clickable: !!selectedWeapon && !!entry },
          ]"
          @click="entry && selectedWeapon && toggleAssign(entry.key)"
        >
          <div class="wfas-num">#{{ i + 1 }}</div>
          <template v-if="entry">
            <div class="wfas-info">
              <span class="wfas-name">{{ entry.hero.name }}</span>
              <span class="wfas-role">{{ entry.hero.role }}</span>
            </div>
            <div class="wfas-weapon">
              <template v-if="assignedKey === entry.key && selectedWeapon">
                <span class="wfasw-name" :style="{ color: catColor }">{{ selectedWeapon.name }}</span>
                <span class="wfasw-stat" :style="{ color: catColor }">{{ formatStat(selectedWeapon.category, selectedWeapon.tier) }}</span>
              </template>
              <template v-else-if="weaponStore.getAssignedWeapon(entry.key)">
                <span class="wfasw-name">{{ weaponStore.getAssignedWeapon(entry.key).name }}</span>
                <span class="wfasw-cat">{{ SOUL_CATEGORIES[weaponStore.getAssignedWeapon(entry.key).category]?.label }}</span>
              </template>
              <span v-else class="wfasw-none">no soul weapon</span>
            </div>
          </template>
          <div v-else class="wfas-empty">— empty slot —</div>
        </div>
      </div>

      <div v-if="selectedWeapon" class="wfa-hint">
        Click a hero to assign <em>{{ selectedWeapon.name }}</em>
      </div>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const _B = import.meta.env.BASE_URL
const forgeBg = _B + 'backgrounds/weaponsmith_background.png'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useResourceStore }   from '../stores/useResourceStore.js'
import { useWeaponStore, SOUL_CATEGORIES, STAT_LABELS, generateWeaponName } from '../stores/useWeaponStore.js'

const collection   = useCollectionStore()
const resources    = useResourceStore()
const weaponStore  = useWeaponStore()

const _swB = import.meta.env.BASE_URL
function getSoulImg(category, tier) {
  return _swB + `soul_weapons/${category}_t${tier}.png`
}

const TIERS = [
  { num: 1, numeral: 'I',   name: 'First Light' },
  { num: 2, numeral: 'II',  name: 'Tempered'    },
  { num: 3, numeral: 'III', name: 'Bound'        },
  { num: 4, numeral: 'IV',  name: 'Hallowed'    },
  { num: 5, numeral: 'V',   name: 'Ascendant'   },
  { num: 6, numeral: 'VI',  name: 'Eternal'     },
]

// ── State ──────────────────────────────────────────────────────────────────
const selectedId   = ref(null)
const showCreate   = ref(false)
const newCategory  = ref(null)
const newWeaponName = ref('')
const nameSearch   = ref('')

// ── Computed ───────────────────────────────────────────────────────────────
const selectedWeapon = computed(() =>
  selectedId.value != null ? weaponStore.soulWeapons.find(w => w.id === selectedId.value) ?? null : null
)

const catColor = computed(() =>
  SOUL_CATEGORIES[selectedWeapon.value?.category]?.color ?? '#d4af37'
)

const weaponImg = computed(() => {
  if (!selectedWeapon.value) return null
  return getSoulImg(selectedWeapon.value.category, selectedWeapon.value.tier)
})

const latestLore = computed(() => {
  const entries = selectedWeapon.value?.chronicle
  if (!entries?.length) return ''
  return entries[entries.length - 1].lore
})

const assignedKey = computed(() =>
  selectedId.value != null ? weaponStore.getHeroForWeapon(selectedId.value) ?? null : null
)

const filteredWeapons = computed(() => {
  const q = nameSearch.value.trim().toLowerCase()
  if (!q) return weaponStore.soulWeapons
  return weaponStore.soulWeapons.filter(w =>
    w.name.toLowerCase().includes(q) || SOUL_CATEGORIES[w.category]?.label.toLowerCase().includes(q)
  )
})


// ── Helpers ────────────────────────────────────────────────────────────────
function heroName(heroKey) {
  return collection.roster.find(e => e.key === heroKey)?.hero.name ?? heroKey
}

function formatStat(category, tier) {
  const stats = weaponStore.weaponStats(category, tier)
  const val   = stats[category]
  if (val == null) return '—'
  if (category === 'critRate' || category === 'critDmg') return `+${(val * 100).toFixed(0)}%`
  return `+${val.toLocaleString()}`
}

function canAffordMat(mat) {
  return (resources[mat.store]?.[mat.id] ?? 0) >= mat.qty
}

// ── Actions ────────────────────────────────────────────────────────────────
function selectWeapon(id) {
  selectedId.value = id
  showCreate.value = false
}

function openCreate() {
  selectedId.value  = null
  showCreate.value  = true
  newCategory.value = null
  newWeaponName.value = ''
}

function rollName() {
  if (newCategory.value) newWeaponName.value = generateWeaponName(newCategory.value)
}

function craftWeapon() {
  if (!newCategory.value || !newWeaponName.value.trim()) return
  const id = weaponStore.craftWeapon(newCategory.value, newWeaponName.value.trim())
  showCreate.value = false
  newCategory.value = null
  newWeaponName.value = ''
  selectedId.value = id
}

function forgeTier() {
  if (!selectedId.value) return
  weaponStore.forgeWeapon(selectedId.value)
}

function toggleAssign(heroKey) {
  if (!selectedId.value) return
  if (assignedKey.value === heroKey) {
    weaponStore.unassignWeapon(heroKey)
  } else {
    weaponStore.assignWeapon(selectedId.value, heroKey)
  }
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

.wf-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center 20%;
  filter: brightness(0.30) saturate(0.6);
}
.wf-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(
    90deg,
    rgba(4,3,8,0.92) 0%,
    rgba(4,3,8,0.55) 30%,
    rgba(4,3,8,0.45) 65%,
    rgba(4,3,8,0.90) 100%
  );
}

/* ── Left: Inventory ──────────────────────────────────────────────── */
.wf-inventory {
  position: relative; z-index: 1;
  width: 230px; flex-shrink: 0;
  display: flex; flex-direction: column;
  border-right: 1px solid rgba(212,175,55,0.12);
  background: rgba(4,3,8,0.55);
  backdrop-filter: blur(6px);
}

.wfi-head {
  padding: 20px 16px 10px;
  border-bottom: 1px solid rgba(212,175,55,0.10);
}
.wfi-title {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 3px;
  text-transform: uppercase; color: #b8960a;
  margin-bottom: 10px;
}
.wfi-search {
  display: block; width: 100%;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 3px; padding: 5px 9px;
  font-size: 0.6rem; color: #aaa;
  outline: none; box-sizing: border-box;
  transition: border-color 0.12s;
}
.wfi-search::placeholder { color: #333; }
.wfi-search:focus { border-color: rgba(212,175,55,0.35); }

.wfi-list { flex: 1; overflow-y: auto; padding: 8px; }

.wfi-weapon {
  width: 100%; text-align: left;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-left: 2px solid transparent;
  border-radius: 5px; padding: 9px 11px;
  margin-bottom: 4px; cursor: pointer;
  transition: all 0.12s;
  display: flex; flex-direction: column; gap: 4px;
}
.wfi-weapon:hover {
  background: rgba(255,255,255,0.04);
  border-left-color: var(--cc);
}
.wfi-weapon.active {
  background: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.08);
  border-left-color: var(--cc);
  box-shadow: inset 2px 0 8px -4px var(--cc);
}
.wfiw-top { display: flex; justify-content: space-between; align-items: baseline; }
.wfiw-name {
  font-family: var(--font-head, serif);
  font-size: 0.7rem; color: #c0b080; font-weight: 700;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 150px;
}
.wfi-weapon.active .wfiw-name { color: var(--cc); }
.wfiw-tier {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; color: #666;
}
.wfiw-bottom { display: flex; justify-content: space-between; }
.wfiw-cat { font-size: 0.58rem; color: var(--cc); opacity: 0.8; }
.wfiw-bearer { font-size: 0.56rem; color: #777; font-style: italic; }
.wfiw-unassigned { font-size: 0.56rem; color: #333; font-style: italic; }
.wfi-empty { font-size: 0.65rem; color: #333; text-align: center; padding: 20px 8px; }

.wfi-foot {
  padding: 12px;
  border-top: 1px solid rgba(212,175,55,0.10);
}
.wfi-craft-btn {
  width: 100%;
  padding: 10px;
  background: rgba(212,175,55,0.07);
  border: 1px solid rgba(212,175,55,0.25);
  border-radius: 5px; color: #b8960a;
  font-family: var(--font-head, serif);
  font-size: 0.72rem; letter-spacing: 1.5px;
  text-transform: uppercase; cursor: pointer;
  transition: all 0.13s;
}
.wfi-craft-btn:hover {
  background: rgba(212,175,55,0.15);
  border-color: rgba(212,175,55,0.5);
  color: #d4af37;
}

/* ── Center ────────────────────────────────────────────────────────── */
.wf-center {
  position: relative; z-index: 1;
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 32px 48px; overflow-y: auto;
  gap: 0;
}

/* Splash */
.wf-splash { text-align: center; max-width: 400px; display: flex; flex-direction: column; gap: 14px; }
.wfs-eyebrow {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 4px;
  text-transform: uppercase; color: #b8960a;
}
.wfs-title {
  font-family: var(--font-head, serif);
  font-size: 2.2rem; color: #e8d88a;
  line-height: 1.15; font-weight: 400;
}
.wfs-sub { font-size: 0.75rem; color: #555; line-height: 1.7; }
.wfs-cta {
  margin-top: 8px; align-self: center;
  padding: 11px 32px;
  background: rgba(212,175,55,0.10);
  border: 1px solid rgba(212,175,55,0.35);
  border-radius: 5px; color: #d4af37;
  font-family: var(--font-head, serif);
  font-size: 0.8rem; letter-spacing: 2px;
  text-transform: uppercase; cursor: pointer;
  transition: all 0.13s;
}
.wfs-cta:hover { background: rgba(212,175,55,0.20); border-color: rgba(212,175,55,0.6); }

/* Create form */
.wfc-create {
  width: 100%; max-width: 560px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.wfc-eyebrow {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 4px;
  text-transform: uppercase; color: #b8960a;
}
.wfc-title {
  font-family: var(--font-head, serif);
  font-size: 1.8rem; color: #e8d88a;
  font-weight: 400; margin-top: -8px;
}

.wfc-cats {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;
  width: 100%;
}
.wfc-cat {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  padding: 12px 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 7px; cursor: pointer;
  transition: all 0.13s;
}
.wfc-cat:hover {
  border-color: var(--c);
  background: rgba(255,255,255,0.04);
}
.wfc-cat.selected {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
  box-shadow: 0 0 12px -4px var(--c);
}
.wfcc-label {
  font-family: var(--font-head, serif);
  font-size: 0.78rem; color: var(--c);
  font-weight: 700; letter-spacing: 0.5px;
}
.wfcc-form { font-size: 0.58rem; color: #666; }
.wfcc-stat { font-size: 0.55rem; color: #444; text-transform: uppercase; letter-spacing: 0.5px; }
.wfc-cat.selected .wfcc-form { color: #888; }
.wfc-cat.selected .wfcc-stat { color: #666; }

.wfc-name-section { width: 100%; }
.wfc-name-row { display: flex; gap: 8px; }
.wfc-name-input {
  flex: 1;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,55,0.22);
  border-radius: 6px; padding: 12px 16px;
  font-family: var(--font-head, serif);
  font-size: 1.05rem; color: #e8d88a;
  text-align: center; letter-spacing: 1px;
  outline: none; transition: border-color 0.15s;
}
.wfc-name-input::placeholder { color: #333; font-style: italic; }
.wfc-name-input:focus { border-color: rgba(212,175,55,0.5); }
.wfc-roll-btn {
  flex-shrink: 0;
  background: rgba(212,175,55,0.07);
  border: 1px solid rgba(212,175,55,0.22);
  border-radius: 6px; padding: 0 14px;
  font-size: 1.2rem; color: #b8960a;
  cursor: pointer; transition: all 0.12s;
}
.wfc-roll-btn:hover { background: rgba(212,175,55,0.16); color: #d4af37; }

.wfc-actions { display: flex; gap: 12px; }
.wfc-cancel {
  padding: 11px 24px;
  background: none;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 5px; color: #555;
  font-size: 0.75rem; cursor: pointer;
  transition: all 0.12s;
}
.wfc-cancel:hover { border-color: rgba(255,255,255,0.18); color: #888; }
.wfc-forge-btn {
  padding: 11px 32px;
  background: rgba(212,175,55,0.08);
  border: 1px solid rgba(212,175,55,0.18);
  border-radius: 5px; color: #555;
  font-family: var(--font-head, serif);
  font-size: 0.82rem; letter-spacing: 2px;
  text-transform: uppercase; cursor: not-allowed;
  transition: all 0.13s;
}
.wfc-forge-btn.ready {
  color: #d4af37; cursor: pointer;
  border-color: rgba(212,175,55,0.5);
  background: rgba(212,175,55,0.12);
}
.wfc-forge-btn.ready:hover { background: rgba(212,175,55,0.22); }

/* Weapon detail */
.wfw-header { text-align: center; margin-bottom: 16px; }
.wfw-name {
  font-family: var(--font-head, serif);
  font-size: 1.9rem; color: #e8d88a;
  font-weight: 400; letter-spacing: 1px;
}
.wfw-meta { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 4px; }
.wfw-cat { font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
.wfw-sep { color: #333; }
.wfw-form { font-size: 0.7rem; color: #555; }

/* Image */
.wfw-img-wrap {
  position: relative; display: flex;
  justify-content: center; align-items: center;
  margin-bottom: 20px; height: 200px;
}
.wfw-img {
  max-height: 200px; max-width: 400px;
  width: 100%; object-fit: contain;
  filter:
    drop-shadow(0 0 20px var(--glow, #d4af37))
    drop-shadow(0 0 50px color-mix(in srgb, var(--glow, #d4af37) 35%, transparent));
}
.wfw-img-placeholder {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 280px; height: 180px;
  border: 1px dashed color-mix(in srgb, var(--c) 30%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--c) 4%, transparent);
  gap: 8px;
}
.wfip-form {
  font-family: var(--font-head, serif);
  font-size: 1rem; color: var(--c); opacity: 0.7;
}
.wfip-tier { font-size: 0.6rem; color: #444; letter-spacing: 2px; text-transform: uppercase; }

/* Tier track */
.wfw-tier-track {
  position: relative; display: flex; justify-content: center;
  width: 100%; max-width: 460px; margin-bottom: 24px;
}
.wfw-tier-line {
  position: absolute; top: 10px; left: 8%; right: 8%;
  height: 1px; background: rgba(212,175,55,0.12); z-index: 0;
}
.wfw-pip {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  flex: 1; gap: 4px;
}
.wfp-dot {
  width: 20px; height: 20px; border-radius: 50%;
  border: 2px solid rgba(212,175,55,0.18);
  background: rgba(4,3,8,0.9);
  transition: all 0.2s;
}
.wfp-numeral {
  font-family: var(--font-head, serif);
  font-size: 0.58rem; color: #444;
}
.wfw-pip.done .wfp-numeral, .wfw-pip.current .wfp-numeral { color: #b8960a; }
.wfp-name { font-size: 0.45rem; color: #383838; letter-spacing: 0.5px; text-align: center; white-space: nowrap; }
.wfw-pip.current .wfp-name { color: #777; }

/* Stat bonus */
.wfw-bonus { text-align: center; margin-bottom: 10px; }
.wfb-label {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 3px;
  text-transform: uppercase; color: #555;
  margin-bottom: 4px;
}
.wfb-val {
  font-family: var(--font-head, serif);
  font-size: 2.2rem; font-weight: 400; letter-spacing: 1px;
}
.wfb-next { font-size: 0.62rem; color: #555; margin-top: 2px; }

/* Lore */
.wfw-lore {
  font-size: 0.67rem; color: #444;
  font-style: italic; text-align: center;
  max-width: 380px; line-height: 1.7;
  margin-bottom: 20px;
}

/* Next tier */
.wfw-next { text-align: center; }
.wfn-tier-label {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 2px;
  text-transform: uppercase; color: #555;
  margin-bottom: 10px;
}
.wfn-mats { display: flex; justify-content: center; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
.wfn-mat {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 4px; padding: 3px 11px;
  font-size: 0.63rem; color: #777;
}
.wfn-mat.short { color: #883333; border-color: rgba(160,40,40,0.25); background: rgba(160,40,40,0.04); }
.wfn-btn {
  padding: 11px 34px;
  background: rgba(212,175,55,0.10);
  border: 1px solid rgba(212,175,55,0.38);
  border-radius: 5px; color: #d4af37;
  font-family: var(--font-head, serif);
  font-size: 0.83rem; letter-spacing: 2px;
  text-transform: uppercase; cursor: pointer;
  transition: all 0.14s;
}
.wfn-btn:hover:not(:disabled) { background: rgba(212,175,55,0.20); border-color: rgba(212,175,55,0.65); }
.wfn-btn.cant { color: #444; border-color: rgba(255,255,255,0.06); background: rgba(255,255,255,0.01); cursor: not-allowed; }

/* Eternal */
.wfw-eternal { text-align: center; }
.wfe-sigil { font-size: 1.8rem; margin-bottom: 6px; }
.wfe-label {
  font-family: var(--font-head, serif);
  font-size: 1.1rem; color: #e8d88a;
  letter-spacing: 3px; text-transform: uppercase;
  margin-bottom: 8px;
}
.wfe-sub { font-size: 0.68rem; color: #444; max-width: 260px; margin: 0 auto; line-height: 1.6; }

/* ── Right: Assign ─────────────────────────────────────────────────── */
.wf-assign {
  position: relative; z-index: 1;
  width: 260px; flex-shrink: 0;
  display: flex; flex-direction: column;
  border-left: 1px solid rgba(212,175,55,0.12);
  background: rgba(8,6,2,0.6);
  backdrop-filter: blur(6px);
}

.wfa-head {
  padding: 20px 18px 14px;
  border-bottom: 1px solid rgba(212,175,55,0.10);
  display: flex; flex-direction: column; gap: 3px;
}
.wfa-title {
  font-family: var(--font-head, serif);
  font-size: 0.55rem; letter-spacing: 3px;
  text-transform: uppercase; color: #b8960a;
}
.wfa-count { font-size: 0.58rem; color: #444; }

.wfa-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 24px; gap: 12px;
}
.wfae-sigil { font-size: 1.4rem; color: #1e1a10; }
.wfae-text { font-size: 0.67rem; color: #333; text-align: center; line-height: 1.7; font-style: italic; }

.wfa-list { flex: 1; overflow-y: auto; padding: 10px; display: flex; flex-direction: column; gap: 6px; }

.wfa-slot {
  display: flex; align-items: flex-start; gap: 10px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-left: 2px solid rgba(255,255,255,0.06);
  border-radius: 5px; padding: 10px 12px;
  transition: all 0.13s;
}
.wfa-slot.clickable { cursor: pointer; }
.wfa-slot.clickable:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.12); }
.wfa-slot.equipped { border-color: rgba(212,175,55,0.3); background: rgba(212,175,55,0.04); }
.wfa-slot.empty-slot { opacity: 0.3; }

.wfas-num {
  font-family: var(--font-head, serif);
  font-size: 0.65rem; color: #444;
  flex-shrink: 0; padding-top: 1px;
}
.wfa-slot.equipped .wfas-num { color: #b8960a; }

.wfas-info { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.wfas-name {
  font-family: var(--font-head, serif);
  font-size: 0.72rem; color: #b0a070;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.wfas-role { font-size: 0.52rem; color: #444; text-transform: capitalize; }

.wfas-weapon { display: flex; flex-direction: column; gap: 1px; text-align: right; flex-shrink: 0; max-width: 90px; }
.wfasw-name { font-size: 0.58rem; color: #666; font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wfasw-stat { font-size: 0.6rem; font-weight: 700; }
.wfasw-cat { font-size: 0.52rem; color: #555; text-transform: uppercase; letter-spacing: 0.5px; }
.wfasw-none { font-size: 0.55rem; color: #2a2a2a; font-style: italic; }
.wfas-empty { font-size: 0.6rem; color: #252525; font-style: italic; }

/* Rarity left border */
.wfa-slot.rarity-common    { border-left-color: #303030; }
.wfa-slot.rarity-uncommon  { border-left-color: #186838; }
.wfa-slot.rarity-rare      { border-left-color: #1a50a0; }
.wfa-slot.rarity-epic      { border-left-color: #6a2890; }
.wfa-slot.rarity-legendary { border-left-color: #8a6418; }
.wfa-slot.rarity-mythical  { border-left-color: #5a1010; }
.wfa-slot.rarity-ancient   { border-left-color: #7a1060; }
.wfa-slot.rarity-legendary .wfas-name { color: #c9a227; }
.wfa-slot.rarity-mythical  .wfas-name { color: #ff2244; }
.wfa-slot.rarity-ancient   .wfas-name { color: #ee22ee; }

.wfa-hint {
  padding: 10px 14px;
  border-top: 1px solid rgba(212,175,55,0.08);
  font-size: 0.6rem; color: #555; font-style: italic; text-align: center;
}
.wfa-hint em { color: #b8960a; font-style: normal; }
</style>
