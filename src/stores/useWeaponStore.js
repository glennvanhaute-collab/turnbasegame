import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useResourceStore } from './useResourceStore.js'

// ── Soul weapon categories ──────────────────────────────────────────────────
export const SOUL_CATEGORIES = {
  hp:       { id: 'hp',       label: 'Vitality',  stat: 'hp',       weaponForm: 'Sword & Shield', color: '#33dd77' },
  atk:      { id: 'atk',     label: 'Strength',  stat: 'atk',      weaponForm: 'Longsword',      color: '#dd4422' },
  def:      { id: 'def',     label: 'Fortitude', stat: 'def',      weaponForm: 'Mace & Shield',  color: '#3377dd' },
  spd:      { id: 'spd',     label: 'Swiftness', stat: 'spd',      weaponForm: 'Katana',         color: '#33ddcc' },
  critRate: { id: 'critRate', label: 'Precision', stat: 'critRate', weaponForm: 'Bow',            color: '#ddbb22' },
  critDmg:  { id: 'critDmg', label: 'Lethality', stat: 'critDmg',  weaponForm: 'Scythe',         color: '#9933dd' },
}

export const STAT_LABELS = {
  hp: 'HP', atk: 'ATK', def: 'DEF', spd: 'SPD',
  critRate: 'Crit Rate', critDmg: 'Crit DMG',
}

const SOUL_STATS = {
  hp:       [2000,  4500,  8000, 12000, 17000, 24000],
  atk:      [150,   320,   560,   900,  1300,  1900],
  def:      [120,   260,   450,   720,  1050,  1500],
  spd:      [8,     16,    27,    40,    55,    72],
  critRate: [0.04,  0.08,  0.12,  0.16,  0.21,  0.27],
  critDmg:  [0.08,  0.16,  0.26,  0.38,  0.52,  0.68],
}

export const TIER_COSTS = [
  [
    { store: 'bars',   id: 'steel',      qty: 3, name: 'Steel Bars'      },
    { store: 'hides',  id: 'rough',      qty: 2, name: 'Rough Hide'      },
  ],
  [
    { store: 'bars',   id: 'steel',      qty: 6, name: 'Steel Bars'      },
    { store: 'hides',  id: 'thick',      qty: 2, name: 'Thick Hide'      },
    { store: 'planks', id: 'pine',       qty: 2, name: 'Pine Planks'     },
  ],
  [
    { store: 'bars',   id: 'darksteel',  qty: 4, name: 'Darksteel Bars'  },
    { store: 'hides',  id: 'hardened',   qty: 3, name: 'Hardened Pelt'   },
    { store: 'planks', id: 'oak',        qty: 2, name: 'Oak Planks'      },
  ],
  [
    { store: 'bars',   id: 'mithril',    qty: 5, name: 'Mithril Bars'    },
    { store: 'hides',  id: 'shadow',     qty: 3, name: 'Shadow Pelt'     },
    { store: 'planks', id: 'yew',        qty: 2, name: 'Yew Planks'      },
  ],
  [
    { store: 'bars',   id: 'moonsilver', qty: 4, name: 'Moonsilver Bars' },
    { store: 'hides',  id: 'celestial',  qty: 2, name: 'Celestial Pelt'  },
    { store: 'planks', id: 'ironwood',   qty: 2, name: 'Ironwood Planks' },
  ],
]

// ── Chronicle lore ──────────────────────────────────────────────────────────
const LORE_TEMPLATES = {
  1: [
    'The soul given form. The weapon listens.',
    'Before this day, {weapon} was only a name. Now it exists.',
    'The first strike is always uncertain. This one was not.',
    'It did not look like much, the first time it was held. Most things worth keeping never do.',
    'Every weapon has a day it becomes real. This was that day.',
  ],
  2: [
    '{weapon} went back into the fire. What survived was worth keeping.',
    'The second forging is never nostalgic. It is just necessary.',
    'The metal remembered being worked. It was guided toward something better.',
    '{weapon} came back harder.',
    'There were things that could not be taught before the first battles. The forge reflected this.',
  ],
  3: [
    'Three tiers in, {weapon} has stopped being an object and started being a record.',
    'By now, {weapon} fits the hand as though it had always been there.',
    'Some weapons develop preferences. {weapon} has preferences.',
    'The forge-master said nothing. He simply watched and nodded once.',
    'It crossed something at the third tier. It is noticeable.',
  ],
  4: [
    'There is a tier past which a weapon is no longer improved — it is revealed.',
    'People began to speak of {weapon} by name. That is when it knew.',
    'Four tiers of fire and the metal has not failed. It will not.',
    '{weapon} crossed something. It is felt in the way it sits in the hand.',
    'The debt runs both ways now.',
  ],
  5: [
    '{weapon} does not need to be introduced anymore. It precedes its bearer.',
    'The fifth time the fire touched it, {weapon} did not flinch.',
    'Veterans step aside when they see {weapon}. Some of them leave.',
    'What it carries now is not just itself. It is everything decided along the way.',
    'There is not much left to prove. It keeps going anyway.',
  ],
  6: [
    '{weapon} is done. The only variable remaining is its bearer.',
    'The chronicle closes here — not because the story ends, but because the weapon is complete.',
    'The forge-master retired after this work. He said he had nothing left to give it.',
    'Final form. Final entry. The weapon speaks for itself now — and it speaks well.',
    'There are things that cannot be improved further. {weapon} is one of them.',
  ],
}

function generateLore(tier, weaponName) {
  const pool = LORE_TEMPLATES[tier] ?? LORE_TEMPLATES[1]
  const t    = pool[Math.floor(Math.random() * pool.length)]
  return t.replace(/\{weapon\}/g, weaponName)
}

// ── Name generator ──────────────────────────────────────────────────────────
const CAT_NOUNS = {
  hp:       ['Endurance', 'Vigil', 'Bulwark', 'Resolve', 'Last Stand', 'Steadfast', 'Bastion', 'Hold', 'Shelter'],
  atk:      ['Fang', 'Edge', 'Wrath', 'Verdict', 'Reckoning', 'Sorrow', 'Mandate', 'Oath', 'Rite'],
  def:      ['Judgment', 'Weight', 'Edict', 'Authority', 'Doctrine', 'Canon', 'Warrant', 'Gavel', 'Toll'],
  spd:      ['Whisper', 'Echo', 'Drift', 'Flash', 'Current', 'Flicker', 'Rush', 'Blur', 'Passage'],
  critRate: ['Song', 'Silence', 'Mark', 'Tension', 'Draw', 'Precision', 'Breath', 'Stillness', 'Note'],
  critDmg:  ['Ruin', 'Doom', 'Sentence', 'Last Word', 'Execution', 'End', 'Finality', 'Severance', 'Fall'],
}
const CAT_PREFIXES = {
  hp:       ['Unyielding', 'Ironclad', 'Enduring', 'Steadfast', 'Unbroken', 'Eternal', 'Last', 'Immovable'],
  atk:      ['Crimson', 'Burning', 'Seething', 'Hungering', 'Scarlet', 'Fell', 'Furious', 'Wrathful'],
  def:      ['Iron', 'Stone', 'Granite', 'Tempered', 'Immovable', 'Solid', 'Graven', 'Fortified'],
  spd:      ['Swift', 'Fleeting', 'Silent', 'Sudden', 'Unseen', 'Pale', 'Untracked', 'Weightless'],
  critRate: ['True', 'Still', 'Patient', 'Aimed', 'Quiet', 'Certain', 'Steady', 'Poised'],
  critDmg:  ['Void', 'Shadow', 'Forsaken', 'Dark', 'Pale', 'Cold', 'Nameless', 'Hollow'],
}
const GEN_CONCEPTS = [
  'Winter', 'Ash', 'Sorrow', 'the Fallen', 'the Abyss', 'the First Dawn',
  'Silence', 'Blood', 'Embers', 'the Void', 'Last Light', 'Grief', 'the Deep',
  'Regret', 'Mourning', 'the Forsaken', 'Exile', 'Hunger', 'Dust', 'Old Wars',
  'Broken Oaths', 'the Long Dark', 'Bitter Hours', 'the Weight of Years',
]

const pick = arr => arr[Math.floor(Math.random() * arr.length)]

export function generateWeaponName(category) {
  const nouns = CAT_NOUNS[category]   ?? CAT_NOUNS.atk
  const pfxs  = CAT_PREFIXES[category] ?? CAT_PREFIXES.atk
  const noun  = pick(nouns)
  const r     = Math.random()
  if (r < 0.30) return `${pick(pfxs)} ${noun}`
  if (r < 0.55) return `${noun} of ${pick(GEN_CONCEPTS)}`
  if (r < 0.70) return `The ${pick(pfxs)} ${noun}`
  return `${pick(pfxs)} ${noun}`
}

// ── Store ───────────────────────────────────────────────────────────────────
let _nextId = 1

export const useWeaponStore = defineStore('weapons', () => {
  const resources = useResourceStore()

  const SAVE_KEY = 'soul_weapon_store_v1'
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) } catch { return null } })()

  // Array of crafted soul weapon instances
  const soulWeapons = ref(saved?.soulWeapons ?? [])
  // { heroKey: weaponId }
  const assignments = ref(saved?.assignments ?? {})

  if (soulWeapons.value.length > 0) {
    const maxId = Math.max(...soulWeapons.value.map(w => w.id ?? 0))
    if (maxId >= _nextId) _nextId = maxId + 1
  }

  function persist() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      soulWeapons: soulWeapons.value,
      assignments: assignments.value,
    }))
  }

  function weaponStats(category, tier) {
    const val = SOUL_STATS[category]?.[tier - 1]
    return val != null ? { [category]: val } : {}
  }

  function tierCost(currentTier) { return TIER_COSTS[currentTier - 1] ?? [] }

  function canAffordTier(currentTier) {
    return tierCost(currentTier).every(c => (resources[c.store]?.[c.id] ?? 0) >= c.qty)
  }

  function getAssignedWeapon(heroKey) {
    const id = assignments.value[heroKey]
    return id != null ? (soulWeapons.value.find(w => w.id === id) ?? null) : null
  }

  // Alias for backward compatibility
  function getWeapon(heroKey) { return getAssignedWeapon(heroKey) }

  function getHeroForWeapon(weaponId) {
    return Object.entries(assignments.value).find(([, id]) => id === weaponId)?.[0] ?? null
  }

  function craftWeapon(category, name) {
    const id = _nextId++
    soulWeapons.value.push({
      id,
      category,
      name,
      tier: 1,
      chronicle: [{ tier: 1, lore: generateLore(1, name), stats: weaponStats(category, 1) }],
    })
    persist()
    return id
  }

  function forgeWeapon(weaponId) {
    const weapon = soulWeapons.value.find(w => w.id === weaponId)
    if (!weapon || weapon.tier >= 6 || !canAffordTier(weapon.tier)) return false

    for (const c of tierCost(weapon.tier)) {
      if (c.store === 'bars')   resources.removeBar(c.id, c.qty)
      if (c.store === 'hides')  resources.removeHide(c.id, c.qty)
      if (c.store === 'planks') resources.removePlank(c.id, c.qty)
    }

    const newTier = weapon.tier + 1
    weapon.tier = newTier
    weapon.chronicle.push({
      tier:  newTier,
      lore:  generateLore(newTier, weapon.name),
      stats: weaponStats(weapon.category, newTier),
    })
    persist()
    return true
  }

  function assignWeapon(weaponId, heroKey) {
    const prevHero = getHeroForWeapon(weaponId)
    if (prevHero) delete assignments.value[prevHero]
    assignments.value[heroKey] = weaponId
    persist()
  }

  function unassignWeapon(heroKey) {
    delete assignments.value[heroKey]
    persist()
  }

  return {
    soulWeapons, assignments,
    weaponStats, tierCost, canAffordTier,
    getAssignedWeapon, getWeapon, getHeroForWeapon,
    craftWeapon, forgeWeapon, assignWeapon, unassignWeapon,
  }
})
