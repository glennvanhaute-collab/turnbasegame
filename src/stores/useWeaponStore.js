import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useResourceStore } from './useResourceStore.js'

// ── Stat tables ─────────────────────────────────────────────────────────────
// Each array index = tier - 1. Stats chosen to give each weapon type a clear identity.
const WEAPON_STATS = {
  sword:      [
    { atk: 800,  critRate: 0.04 },
    { atk: 1200, critRate: 0.06 },
    { atk: 1700, critRate: 0.08 },
    { atk: 2400, critRate: 0.10 },
    { atk: 3200, critRate: 0.12 },
    { atk: 4400, critRate: 0.15 },
  ],
  greatsword: [
    { atk: 1100, atkPct: 0.04 },
    { atk: 1650, atkPct: 0.07 },
    { atk: 2300, atkPct: 0.10 },
    { atk: 3100, atkPct: 0.13 },
    { atk: 4200, atkPct: 0.17 },
    { atk: 5600, atkPct: 0.21 },
  ],
  mace:       [
    { atk: 750,  def: 120 },
    { atk: 1100, def: 190 },
    { atk: 1550, def: 280 },
    { atk: 2100, def: 390 },
    { atk: 2900, def: 530 },
    { atk: 3900, def: 720 },
  ],
  warhammer:  [
    { atk: 1300 },
    { atk: 1950 },
    { atk: 2750 },
    { atk: 3700 },
    { atk: 5000 },
    { atk: 6800 },
  ],
  dagger:     [
    { atk: 600,  critRate: 0.06, critDmg: 0.10 },
    { atk: 880,  critRate: 0.09, critDmg: 0.15 },
    { atk: 1250, critRate: 0.12, critDmg: 0.20 },
    { atk: 1700, critRate: 0.15, critDmg: 0.26 },
    { atk: 2300, critRate: 0.18, critDmg: 0.33 },
    { atk: 3100, critRate: 0.22, critDmg: 0.42 },
  ],
  bow:        [
    { atk: 700,  critDmg: 0.12 },
    { atk: 1050, critDmg: 0.18 },
    { atk: 1480, critDmg: 0.25 },
    { atk: 2000, critDmg: 0.33 },
    { atk: 2700, critDmg: 0.42 },
    { atk: 3700, critDmg: 0.53 },
  ],
  crossbow:   [
    { atk: 760,  atkPct: 0.03 },
    { atk: 1140, atkPct: 0.05 },
    { atk: 1600, atkPct: 0.07 },
    { atk: 2150, atkPct: 0.10 },
    { atk: 2900, atkPct: 0.13 },
    { atk: 3900, atkPct: 0.17 },
  ],
  staff:      [
    { atk: 850,  hp: 1200 },
    { atk: 1280, hp: 1800 },
    { atk: 1800, hp: 2600 },
    { atk: 2450, hp: 3600 },
    { atk: 3300, hp: 4900 },
    { atk: 4500, hp: 6600 },
  ],
  wand:       [
    { atk: 650,  critRate: 0.05 },
    { atk: 980,  critRate: 0.08 },
    { atk: 1380, critRate: 0.11 },
    { atk: 1870, critRate: 0.14 },
    { atk: 2530, critRate: 0.17 },
    { atk: 3430, critRate: 0.21 },
  ],
  shield:     [
    { def: 600,  hp: 2000, damageReduction: 0.05 },
    { def: 900,  hp: 3000, damageReduction: 0.08 },
    { def: 1300, hp: 4400, damageReduction: 0.10 },
    { def: 1800, hp: 6000, damageReduction: 0.13 },
    { def: 2500, hp: 8200, damageReduction: 0.16 },
    { def: 3400, hp: 11000, damageReduction: 0.20 },
  ],
}

// ── Tier upgrade costs ───────────────────────────────────────────────────────
// Index = current tier - 1 (cost to advance FROM that tier)
// Uses real resource IDs from bars/hides/planks stores
export const TIER_COSTS = [
  // T1 → T2
  [
    { store: 'bars',   id: 'steel',     qty: 3, name: 'Steel Bars'     },
    { store: 'hides',  id: 'rough',     qty: 2, name: 'Rough Hide'     },
  ],
  // T2 → T3
  [
    { store: 'bars',   id: 'steel',     qty: 6, name: 'Steel Bars'     },
    { store: 'hides',  id: 'thick',     qty: 2, name: 'Thick Hide'     },
    { store: 'planks', id: 'pine',      qty: 2, name: 'Pine Planks'    },
  ],
  // T3 → T4
  [
    { store: 'bars',   id: 'darksteel', qty: 4, name: 'Darksteel Bars' },
    { store: 'hides',  id: 'hardened',  qty: 3, name: 'Hardened Pelt'  },
    { store: 'planks', id: 'oak',       qty: 2, name: 'Oak Planks'     },
  ],
  // T4 → T5
  [
    { store: 'bars',   id: 'mithril',   qty: 5, name: 'Mithril Bars'   },
    { store: 'hides',  id: 'shadow',    qty: 3, name: 'Shadow Pelt'    },
    { store: 'planks', id: 'yew',       qty: 2, name: 'Yew Planks'     },
  ],
  // T5 → T6
  [
    { store: 'bars',   id: 'moonsilver', qty: 4, name: 'Moonsilver Bars'  },
    { store: 'hides',  id: 'celestial',  qty: 2, name: 'Celestial Pelt'   },
    { store: 'planks', id: 'ironwood',   qty: 2, name: 'Ironwood Planks'  },
  ],
]

// ── Chronicle lore ───────────────────────────────────────────────────────────
// {hero} = hero first name, {weapon} = weapon name, {type} = weapon type name
const SHIELD_LORE_TEMPLATES = {
  1: [
    'The shield has no edge. {hero} named it anyway.',
    '{weapon} was not made to win fights. It was made so {hero} could survive them.',
    'A shield with a name means someone decided to come back. {hero} decided.',
    'The first time {hero} raised {weapon}, it was not yet certain it would hold. It held.',
    'Most shields are anonymous. {hero} refused to let this one be.',
  ],
  2: [
    '{weapon} has taken three blows that would have ended other stories. {hero}\'s story continues.',
    'The surface is marked now. {hero} calls the marks a record, not damage.',
    'It came back to the forge heavier with history. It left heavier with purpose.',
    'There are things {hero} knows now that could not have been learned any other way. {weapon} was present for all of them.',
    'The second forging does not remove the dents. It builds around them.',
  ],
  3: [
    'Three tiers in, {weapon} is no longer just protection. It is a statement.',
    'People look at {weapon} before they look at {hero}. {hero} considers this an advantage.',
    'A shield this far along has absorbed things most people never face. {hero} has faced all of them.',
    'The crest is worn smooth now. {hero} knows every scratch and what made it.',
    '{weapon} fits the arm as though it always belonged there. It did not, once.',
  ],
  4: [
    '{weapon} has stopped things that should not have been stoppable. {hero} keeps that to themselves.',
    'Allies stand closer to {hero} than they used to. They have noticed what {weapon} does.',
    'There is a tier past which a shield is no longer equipment. It is architecture.',
    'Four tiers of forging, and {weapon} has never failed. {hero} intends to keep it that way.',
    'The forge-master ran a hand along the rim and said nothing. That was enough.',
  ],
  5: [
    '{weapon} is spoken of in battles {hero} was not present for. The reputation preceded them both.',
    'Fifth tier. {hero} does not count anymore — only holds the line.',
    'Veterans step behind {hero} without being asked. They have seen {weapon} work.',
    'What {weapon} has stopped would fill a ledger no one would want to read.',
    'The weight has become nothing. {hero} stopped noticing it years ago.',
  ],
  6: [
    '{weapon} is done. No forge can improve it. {hero} is the only variable remaining.',
    'Eternal. The chronicle closes not because the protection ends — but because the shield has become what it was always going to be.',
    'Every blow it has taken is still in the metal, converted into something that does not break.',
    'The forge-master looked at {weapon} for a long time. Then he said: there is nothing left to add.',
    'Final form. Final entry. {hero} stands behind it, and that is enough.',
  ],
}

const LORE_TEMPLATES = {
  1: [
    '{hero} brought nothing to the forge but the name. The rest was decided in fire.',
    'Before this day, {weapon} was only a name {hero} carried quietly. Now it exists.',
    'The first strike is always uncertain. {hero} did not hesitate.',
    'It did not look like much, the first time {hero} held it. Most things worth keeping never do.',
    'Every weapon has a day it becomes real. For {weapon}, that day was the day {hero} named it.',
  ],
  2: [
    '{weapon} went back into the fire. What survived was worth keeping.',
    'There were things {hero} understood after the first battles that could not be taught before them. The forge reflected this.',
    '{weapon} came back harder. So did {hero}.',
    'The second forging is never nostalgic. It is just necessary.',
    'The metal remembered being worked. {hero} guided it toward something better.',
  ],
  3: [
    'Three tiers in, {weapon} had stopped being an object and started being a record.',
    '{hero} stopped counting the victories. The weapon kept count without being asked.',
    'By now, {weapon} fit the hand as though it had always been there.',
    'The forge-master said nothing this time. He simply watched {hero} work and nodded once.',
    'Some weapons develop preferences. {weapon} preferred the way {hero} held it.',
  ],
  4: [
    '{weapon} crossed something. {hero} felt it the morning after the fourth forging.',
    'There is a tier past which a weapon is no longer improved — it is revealed.',
    'The metal is only part of it now. The rest is all the miles {hero} has walked with it.',
    'People began to speak of {weapon} by name. That is when {hero} knew.',
    '{hero} has bled for this weapon. {weapon} has bled for {hero}. The debt runs both ways.',
  ],
  5: [
    '{weapon} does not need to be introduced anymore. It precedes {hero} into every room.',
    'There is not much left to prove. {hero} keeps going anyway.',
    'The fifth time the fire touched it, {weapon} did not flinch. Neither did {hero}.',
    'Veterans have three reactions when they see {weapon}: they step aside, they pay attention, or they leave.',
    'What {hero} carries now is not just a weapon. It is everything that was decided along the way.',
  ],
  6: [
    '{weapon} is done. {hero} is not. That is the only unresolved question left.',
    'The chronicle closes here — not because the story ends, but because the weapon is complete.',
    'There are things that cannot be improved further. {weapon} is one of them. {hero} remains the other variable.',
    'The forge-master retired after this work. He said he had nothing left to teach {hero}.',
    'Final form. Final entry. The weapon speaks for itself now — and it speaks well.',
  ],
}

function generateLore(tier, heroFirstName, weaponName, weaponType) {
  const templates = weaponType === 'shield' ? SHIELD_LORE_TEMPLATES : LORE_TEMPLATES
  const pool = templates[tier] ?? templates[1]
  const template = pool[Math.floor(Math.random() * pool.length)]
  return template
    .replace(/\{hero\}/g, heroFirstName)
    .replace(/\{weapon\}/g, weaponName)
}

export const useWeaponStore = defineStore('weapons', () => {
  const resources = useResourceStore()

  const SAVE_KEY = 'weapon_store_v1'
  const saved = (() => { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) } catch { return null } })()

  // { [heroKey]: { name, type, tier, chronicle: [{ tier, lore, stats }] } }
  const weapons = ref(saved ?? {})

  function persist() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(weapons.value))
  }

  // ── Getters ────────────────────────────────────────────────────────────────
  function getWeapon(heroKey) {
    return weapons.value[heroKey] ?? null
  }

  function weaponStats(type, tier) {
    return WEAPON_STATS[type]?.[tier - 1] ?? { atk: 0 }
  }

  function tierCost(currentTier) {
    return TIER_COSTS[currentTier - 1] ?? []
  }

  function canAffordTier(currentTier) {
    const costs = tierCost(currentTier)
    return costs.every(c => {
      const pool = resources[c.store]
      return (pool?.[c.id] ?? 0) >= c.qty
    })
  }

  // ── Actions ────────────────────────────────────────────────────────────────
  function createWeapon(heroKey, heroFirstName, weaponType, weaponName) {
    const stats = weaponStats(weaponType, 1)
    const lore  = generateLore(1, heroFirstName, weaponName, weaponType)
    weapons.value[heroKey] = {
      name:      weaponName,
      type:      weaponType,
      tier:      1,
      chronicle: [{ tier: 1, lore, stats: { ...stats } }],
    }
    persist()
  }

  function forgeTier(heroKey) {
    const weapon = weapons.value[heroKey]
    if (!weapon || weapon.tier >= 6) return false
    if (!canAffordTier(weapon.tier)) return false

    // Consume resources
    const costs = tierCost(weapon.tier)
    for (const c of costs) {
      if (c.store === 'bars')   resources.removeBar(c.id, c.qty)
      if (c.store === 'hides')  resources.removeHide(c.id, c.qty)
      if (c.store === 'planks') resources.removePlank(c.id, c.qty)
    }

    const newTier = weapon.tier + 1
    const stats   = weaponStats(weapon.type, newTier)
    const heroFirstName = weapon.name.split("'")[0] // fallback; view passes proper name
    const lore    = generateLore(newTier, heroFirstName, weapon.name)

    weapon.tier = newTier
    weapon.chronicle.push({ tier: newTier, lore, stats: { ...stats } })
    persist()
    return true
  }

  // Forge with explicit hero first name (called from view)
  function forgeTierFor(heroKey, heroFirstName) {
    const weapon = weapons.value[heroKey]
    if (!weapon || weapon.tier >= 6) return false
    if (!canAffordTier(weapon.tier)) return false

    const costs = tierCost(weapon.tier)
    for (const c of costs) {
      if (c.store === 'bars')   resources.removeBar(c.id, c.qty)
      if (c.store === 'hides')  resources.removeHide(c.id, c.qty)
      if (c.store === 'planks') resources.removePlank(c.id, c.qty)
    }

    const newTier = weapon.tier + 1
    const stats   = weaponStats(weapon.type, newTier)
    const lore    = generateLore(newTier, heroFirstName, weapon.name, weapon.type)

    weapon.tier = newTier
    weapon.chronicle.push({ tier: newTier, lore, stats: { ...stats } })
    persist()
    return true
  }

  return {
    weapons,
    getWeapon,
    weaponStats,
    tierCost,
    canAffordTier,
    createWeapon,
    forgeTier,
    forgeTierFor,
  }
})
