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
        <input
          v-model="nameSearch"
          class="wfr-search"
          placeholder="Search heroes…"
          spellcheck="false"
        />
      </div>

      <div class="wfr-list">
        <button
          v-for="entry in filteredRoster" :key="entry.key"
          class="wfr-hero"
          :class="[
            { active: selectedKey === entry.key, armed: !!getWeapon(entry.key) },
            `rarity-${entry.hero.rarity?.toLowerCase()}`
          ]"
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
        <div class="wfc-deck">Give it a name. Begin the chronicle.</div>

        <div class="wfc-preset-type">
          <span class="wfpt-hand">{{ WEAPON_TYPE_MAP[selectedHero?.weaponType]?.hands }}</span>
          <span class="wfpt-name">{{ WEAPON_TYPE_MAP[selectedHero?.weaponType]?.name }}</span>
        </div>

        <div class="wfc-name-row">
          <input
            v-model="newWeaponName"
            class="wfc-name-input"
            placeholder="Name your weapon..."
            maxlength="32"
            spellcheck="false"
          />
          <button class="wfc-roll-btn" title="Generate a name" @click="generateWeaponName">⚄</button>
        </div>

        <button
          class="wfc-begin-btn"
          :class="{ ready: !!newWeaponName.trim() }"
          :disabled="!newWeaponName.trim()"
          @click="beginChronicle"
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

        <!-- Chronicle weapon image -->
        <div v-if="chronicleImage" class="wfw-chronicle-img-wrap">
          <img :src="chronicleImage" class="wfw-chronicle-img" alt="" />
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
            <span
              v-for="mat in nextTierCost(selectedKey)" :key="mat.id"
              class="wfnt-mat"
              :class="{ unaffordable: !resourceQty(mat) }"
            >
              {{ mat.qty }}× {{ mat.name }}
            </span>
          </div>
          <button
            class="wfw-forge-btn"
            :class="{ unaffordable: !canAfford(selectedKey) }"
            :disabled="!canAfford(selectedKey)"
            @click="forgeTier"
          >⚒ Forge Next Tier</button>
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

const chronicleImages = import.meta.glob('../assets/chronicles/*.png', { eager: true, import: 'default' })
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useWeaponStore, TIER_COSTS } from '../stores/useWeaponStore.js'
import { useResourceStore } from '../stores/useResourceStore.js'

const collection  = useCollectionStore()
const weaponStore = useWeaponStore()
const resources   = useResourceStore()

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
  { id: 'shield',     name: 'Shield',     hands: 'Shield' },
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
  { id: 'shield', label: 'Shield'    },
]

const STAT_LABELS = {
  atk: 'ATK', atkPct: 'ATK %', critRate: 'Crit Rate',
  critDmg: 'Crit DMG', def: 'DEF', hp: 'HP', spd: 'SPD',
  damageReduction: 'Dmg Block',
}

// ── State ─────────────────────────────────────────────────────────────
const selectedKey   = ref(null)
const activeFilter  = ref('all')
const nameSearch    = ref('')
const newWeaponName = ref('')


// ── Name generator ────────────────────────────────────────────────────
const GEN_NOUNS = {
  shield: [
    'Bulwark','Wall','Ward','Vow','Promise','Aegis','Bastion','Rampart',
    'Vigil','Shelter','Mantle','Cover','Guard','Keep','Hold','Resolve',
    'Last Stand','Defiance','Endurance','Patience','Answer','Reply',
    'Steadfast','Refuge','Sanctuary','Haven','Anchor','Foundation',
    'Cornerstone','Keystone','Linchpin','Constant','Certainty',
  ],
  sword: [
    'Fang','Edge','Vow','Oath','Talon','Resolve','Verdict','Rite','Sorrow',
    'Pact','Promise','Burden','Reckoning','Testament','Covenant','Memory',
    'Toll','Justice','Mandate','Sovereign','Name','Honour','Strike','Lament',
    'Weal','Ruin','Scar','Mercy','Silence','Wrath','Vigil','Witness',
  ],
  greatsword: [
    'Ruin','Verdict','Wrath','Mandate','Dominion','Toll','Requiem','Colossus',
    'Doom','Bane','Calamity','Undoing','Sentence','Sundering','Omen','Harbinger',
    'Titan','Dread','Fall','Edict','Reckoning','Desolation','Last Word','Atonement',
    'Cleaver','Severance','Absolution','Behemoth','Overthrow','Conquest',
  ],
  mace: [
    'Judgment','Weight','Toll','Warrant','Bastion','Verdict','Sentence',
    'Reckoning','Authority','Decree','Burden','Gospel','Canon','Writ',
    'Gavel','Compulsion','Doctrine','Ordinance','Edict','Levy','Sanction',
    'Mandate','Conviction','Ruling','Penalty','Reprisal',
  ],
  warhammer: [
    'Thunder','Tremor','Fury','Ruination','Quake','Knell','Downfall',
    'Avalanche','Fissure','Collapse','Upheaval','Shatter','Earthfall',
    'Bellow','Obliteration','Landfall','Cataclysm','Crater','Impact',
    'Detonation','Concussion','Resound','Percussion','Toll','Crescendo',
    'Reverberation','Cascade','Surge','Rupture','Torrent',
  ],
  dagger: [
    'Whisper','Spite','Needle','Veil','Umbra','Thorn','Fang','Sliver',
    'Quiet','Hiss','Malice','Sting','Catch','Lace','Prick','Hex',
    'Murmur','Rumour','Gossip','Lilt','Sigh','Flicker','Stitch',
    'Trace','Scratch','Graze','Kiss','Nip','Secret','Aside','Confession',
  ],
  bow: [
    'Song','Drift','Echo','Silence','Current','Lull','Stillness',
    'Breath','Release','Sigh','Hum','Draw','Tension','Last Breath',
    'Resonance','Pull','Refrain','Chord','Note','Verse','Aria',
    'Cadence','Melody','Interval','Pause','Rest','Suspension','Passage',
  ],
  crossbow: [
    'Mark','Reckoning','Verdict','Precision','Aim','Last Word',
    'Levy','Edict','Toll','Decree','Sentence','Point','Period',
    'Conclusion','Finality','Closure','End','Resolution','Statement',
    'Proclamation','Notice','Writ','Warrant','Summons',
  ],
  staff: [
    'Hymn','Lament','Resonance','Weaving','Vigil','Chronicle','Oration',
    'Sermon','Invocation','Codex','Accord','Witness','Verse','Recitation',
    'Utterance','Pillar','Pilgrimage','Testament','Canon','Gospel',
    'Scripture','Revelation','Prophecy','Augury','Omen','Portent',
    'Foretelling','Vision','Mandate','Word','Covenant','Decree',
  ],
  wand: [
    'Thread','Murmur','Flicker','Tendril','Spark','Refrain','Mote',
    'Wisp','Trace','Filament','Stitch','Flourish','Hum','Cantrip',
    'Tremor','Shiver','Quiver','Flutter','Drift','Curl','Coil',
    'Loop','Spiral','Arc','Ripple','Shimmer','Gleam','Pulse','Tick',
  ],
}

const GEN_PREFIXES = {
  Force: [
    'Iron','Unyielding','Stone','Bronze','Steadfast','Unbroken','Bulwark',
    'Granite','Steel','Ironclad','Tempered','Immovable','Resolute','Enduring',
    'Stoic','Forged','Bastion','Fortified','Hardened','Stalwart','Graven',
    'Solid','Immense','Heavy','Unbending','Unmoved','Unflinching','Steadied',
    'Anchored','Grounded','Rooted','Planted',
  ],
  Magic: [
    'Arcane','Runic','Crystal','Storm','Azure','Ember','Prismatic',
    'Spellbound','Sigil','Glyphic','Ether','Chromatic','Spectral','Eldritch',
    'Resonant','Mystic','Flux','Weaving','Bound','Traced','Woven',
    'Scribed','Inscribed','Etched','Branded','Marked','Sealed','Locked',
    'Threaded','Stitched','Knotted','Laced',
  ],
  Spirit: [
    'Silver','Moon','Sacred','Hallowed','Verdant','Gilded','Celestial',
    'Blessed','Sanctified','Anointed','Revered','Faithful','Pure','Luminous',
    'Radiant','Dawn','Twilight','Devoted','Consecrated','Holy','Ordained',
    'Vowed','Pledged','Sworn','Bound','Called','Chosen','Marked','Named',
    'Known','Remembered','Honoured','Kept',
  ],
  Void: [
    'Void','Shadow','Hollow','Dusk','Ashen','Forsaken','Pale','Blighted',
    'Cursed','Withered','Wretched','Sunken','Charred','Corrupted','Fractured',
    'Fading','Dimmed','Nameless','Doomed','Lost','Ruined','Fallen','Broken',
    'Shattered','Cracked','Split','Torn','Severed','Cut','Cleaved','Rent',
    'Divided','Scattered',
  ],
  Blood: [
    'Crimson','Sanguine','Scarlet','Fell','Dark','Vital','Visceral',
    'Draining','Thirsting','Hungering','Deathly','Ravenous','Fevered',
    'Flushed','Feverish','Burning','Boiling','Seething','Raging','Livid',
    'Frenzied','Manic','Rabid','Wild','Unbridled','Unbound','Unchained',
  ],
  Astral: [
    'Stellar','Astral','Celestial','Ancient','Eternal','Pale','Cosmic',
    'Timeless','Boundless','Infinite','Ageless','Distant','Wandering',
    'Drifting','Floating','Suspended','Weightless','Endless','Vast','Deep',
    'High','Far','Wide','Long','Old','Still','Quiet','Cold','Clear','Sharp',
  ],
}

const GEN_GENERAL = [
  'Forgotten','Last','First','Undying','Shattered','Crimson','Ashen','Gilded',
  'Broken','Sundered','Mended','Tempered','Weeping','Silent','Patient',
  'Hungry','Scarred','Nameless','Wandering','Exiled','Remnant','Buried',
  'Ancient','Hidden','Saved','Kept','Held','Carried','Worn','Battered',
  'Faithful','Loyal','True','Honest','Plain','Simple','Quiet','Steady',
  'Tired','Old','Weathered','Tested','Proven','Known','Sure','Certain',
]

const GEN_CONCEPTS = [
  'Ruin','Ash','Sorrow','the Fallen','the Abyss','the First Dawn','the Last Age',
  'Silence','Blood','Embers','Thorns','Shadows','the Void','the Crown','the Pyre',
  'Last Light','Grief','Regret','the Deep','Winter','Dust','Old Wars','the Veil',
  'Mourning','the Forsaken','the Undying','Exile','the Long Road','Hunger',
  'the Final Hour','Broken Oaths','Forgotten Names','Lost Kings','the Pale Shore',
  'Old Debts','the Long Dark','Weeping Fields','the Second Death','Stillwater',
  'Thorn & Ember','the Unmarked Grave','Bitter Hours','the Weight of Years',
  'Fading Light','the Cold Shore','Unfinished Wars','Every Name I Carry',
]

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

function generateWeaponName() {
  const hero     = selectedHero.value
  const type     = hero?.weaponType ?? 'sword'
  const nouns    = GEN_NOUNS[type] ?? GEN_NOUNS.sword
  const affPfx   = GEN_PREFIXES[hero?.affinity] ?? []
  const prefixes = [...affPfx, ...GEN_GENERAL]
  const noun     = pick(nouns)
  const r        = Math.random()

  // 15%: "FirstName's Noun"
  if (r < 0.15 && hero?.name) {
    const first = hero.name.split(' ')[0]
    newWeaponName.value = `${first}'s ${noun}`
    return
  }
  // 20%: "Noun of [Concept]"
  if (r < 0.35) {
    newWeaponName.value = `${noun} of ${pick(GEN_CONCEPTS)}`
    return
  }
  // 20%: "The Prefix Noun"
  if (r < 0.55) {
    newWeaponName.value = `The ${pick(prefixes)} ${noun}`
    return
  }
  // 45%: "Prefix Noun"
  newWeaponName.value = `${pick(prefixes)} ${noun}`
}

// ── Computed ──────────────────────────────────────────────────────────
const selectedHero = computed(() =>
  collection.roster.find(e => e.key === selectedKey.value)?.hero ?? null
)

const chronicleImage = computed(() => {
  const id = selectedHero.value?.id
  if (!id) return null
  return chronicleImages[`../assets/chronicles/${id}.png`] ?? null
})

const RARITY_ORDER = ['ancient', 'mythical', 'legendary', 'epic', 'rare', 'uncommon', 'common']
const rarityRank = r => { const i = RARITY_ORDER.indexOf(r?.toLowerCase() ?? ''); return i === -1 ? 99 : i }

const filteredRoster = computed(() => {
  const q = nameSearch.value.trim().toLowerCase()
  let list = collection.roster

  if (q) list = list.filter(e => e.hero.name.toLowerCase().includes(q))

  if (activeFilter.value === 'none') {
    list = list.filter(e => !getWeapon(e.key))
  } else if (activeFilter.value !== 'all') {
    list = list.filter(e => {
      const w = getWeapon(e.key)
      if (!w) return false
      const hands = WEAPON_TYPE_MAP[w.type]?.hands ?? ''
      if (activeFilter.value === '1h')     return hands === '1H'
      if (activeFilter.value === '2h')     return hands === '2H'
      if (activeFilter.value === 'ranged') return hands === 'Ranged'
      if (activeFilter.value === 'shield') return hands === 'Shield'
      return true
    })
  }

  return [...list].sort((a, b) => rarityRank(a.hero.rarity) - rarityRank(b.hero.rarity))
})

// ── Helpers ───────────────────────────────────────────────────────────
function getWeapon(heroKey)    { return weaponStore.getWeapon(heroKey) }
function resourceQty(mat)      { return (resources[mat.store]?.[mat.id] ?? 0) >= mat.qty }
function currentStats(heroKey) { const w = getWeapon(heroKey); return w ? weaponStore.weaponStats(w.type, w.tier) : {} }
function nextTierCost(heroKey) { const w = getWeapon(heroKey); return w ? weaponStore.tierCost(w.tier) : [] }
function canAfford(heroKey)    { const w = getWeapon(heroKey); return w ? weaponStore.canAffordTier(w.tier) : false }

function selectHero(key) {
  selectedKey.value   = key
  newWeaponName.value = ''
}

function beginChronicle() {
  if (!selectedKey.value || !newWeaponName.value.trim()) return
  const hero      = selectedHero.value
  const firstName = hero?.name?.split(' ')[0] ?? hero?.name ?? 'Unknown'
  weaponStore.createWeapon(selectedKey.value, firstName, hero.weaponType, newWeaponName.value.trim())
  newWeaponName.value = ''
}

function forgeTier() {
  if (!selectedKey.value) return
  const hero      = selectedHero.value
  const firstName = hero?.name?.split(' ')[0] ?? hero?.name ?? 'Unknown'
  weaponStore.forgeTierFor(selectedKey.value, firstName)
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
.wfr-search {
  display: block; width: 100%; margin-top: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 3px; padding: 5px 9px;
  font-size: 0.6rem; color: #aaa;
  outline: none; transition: border-color 0.12s;
  box-sizing: border-box;
}
.wfr-search::placeholder { color: #3a3a3a; }
.wfr-search:focus { border-color: rgba(212,175,55,0.35); }

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

/* Rarity borders */
.wfr-hero.rarity-common    { border-color: #383030; }
.wfr-hero.rarity-uncommon  { border-color: #186838; }
.wfr-hero.rarity-rare      { border-color: #1a50a0; }
.wfr-hero.rarity-epic      { border-color: #6a2890; }
.wfr-hero.rarity-legendary { border-color: #8a6418; }
.wfr-hero.rarity-mythical  { border-color: #5a1010; }
.wfr-hero.rarity-ancient   { border-color: #7a1060; }
.wfr-hero.rarity-legendary .wfrh-name { color: #c9a227; }
.wfr-hero.rarity-mythical  .wfrh-name { color: #ff2244; }
.wfr-hero.rarity-ancient   .wfrh-name { color: #ee22ee; }

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

.wfc-preset-type {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 28px;
  padding: 10px 24px;
  background: rgba(212,175,55,0.06);
  border: 1px solid rgba(212,175,55,0.25);
  border-radius: 6px;
}
.wfpt-hand {
  font-size: 0.52rem; color: #888;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 2px 7px;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 3px;
}
.wfpt-name {
  font-family: var(--font-head, serif);
  font-size: 1rem; color: #d4af37;
  letter-spacing: 1px;
}

.wfc-name-row {
  width: 100%; max-width: 420px; margin-bottom: 20px;
  display: flex; gap: 8px; align-items: stretch;
}
.wfc-name-input {
  flex: 1; background: rgba(255,255,255,0.04);
  border: 1px solid rgba(212,175,55,0.2);
  border-radius: 6px; padding: 12px 16px;
  font-family: var(--font-head, serif);
  font-size: 1.1rem; color: #e8d88a;
  text-align: center; letter-spacing: 1px;
  outline: none; transition: border-color 0.15s;
}
.wfc-name-input::placeholder { color: #3a3a3a; font-style: italic; }
.wfc-name-input:focus { border-color: rgba(212,175,55,0.55); }
.wfc-roll-btn {
  flex-shrink: 0;
  background: rgba(212,175,55,0.07);
  border: 1px solid rgba(212,175,55,0.22);
  border-radius: 6px; padding: 0 14px;
  font-size: 1.2rem; color: #b8960a;
  cursor: pointer; transition: all 0.12s;
  line-height: 1;
}
.wfc-roll-btn:hover {
  background: rgba(212,175,55,0.16);
  border-color: rgba(212,175,55,0.5);
  color: #d4af37;
}

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
.wfw-header { text-align: center; margin-bottom: 20px; }

.wfw-chronicle-img-wrap {
  display: flex; justify-content: center;
  margin-bottom: 28px;
  position: relative;
}
.wfw-chronicle-img-wrap::before {
  content: '';
  position: absolute;
  inset: -20px 20%;
  background: radial-gradient(ellipse at center, rgba(212,175,55,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.wfw-chronicle-img {
  max-height: 380px; max-width: 520px;
  width: 100%;
  object-fit: contain;
  filter:
    drop-shadow(0 0 28px rgba(212,175,55,0.45))
    drop-shadow(0 0 60px rgba(212,175,55,0.18));
  position: relative; z-index: 1;
}
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
.wfnt-mat.unaffordable { color: #883333; border-color: rgba(180,40,40,0.25); background: rgba(180,40,40,0.05); }

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
.wfw-forge-btn:hover:not(:disabled) {
  background: rgba(212,175,55,0.20);
  border-color: rgba(212,175,55,0.7);
}
.wfw-forge-btn.unaffordable {
  color: #555; border-color: rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02); cursor: not-allowed;
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
