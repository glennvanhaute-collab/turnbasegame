import { createItemInstance } from '../Gear.js'
import { GearSlot, GearType, WeaponType } from '../Gear.js'

// ── Regalia of Regret — drops from The Throne of Regret ────────────────────
// Full 7-piece Legendary set. Each piece is a pre-built instance ready for
// addInstance(). Stats sit ~50% above moonsilver Epic equivalents.
export const REGRET_SET = {
  id:    'regret',
  name:  'Regalia of Regret',
  color: '#b44fff',
  desc:  'Forged in the void beneath the Fallen Throne — armour that remembers every war its king could not win.',
}

const BASE_PIECES = [
  {
    id: 'regret_sword', name: 'Sword of Undying Regret',
    slot: GearSlot.MAIN_HAND, gearType: GearType.WEAPON, weaponType: WeaponType.SWORD,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { atk: 640, critRate: 0.08, critDmg: 0.16 },
    description: 'The blade weeps a thin shadow-ichor. It has never forgotten the hand that first wielded it.',
    image: 'regret_sword',
  },
  {
    id: 'regret_shield', name: 'Aegis of the Empty Throne',
    slot: GearSlot.OFF_HAND, gearType: GearType.SHIELD,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { def: 460, hp: 8000 },
    description: 'Carved from the throne itself. It stopped being a shield long ago — now it just endures.',
    image: 'regret_shield',
  },
  {
    id: 'regret_helm', name: 'Crown of the Fallen King',
    slot: GearSlot.HEAD, gearType: GearType.HELMET,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { hp: 7800, def: 190, resistance: 0.06 },
    description: 'The crown broke in the fall. It was never repaired. It still commands.',
    image: 'regret_helmet',
  },
  {
    id: 'regret_chest', name: 'Breastplate of the Nightmare Court',
    slot: GearSlot.CHEST, gearType: GearType.ARMOR,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { hp: 12000, def: 320 },
    description: 'Its surface shifts like a held breath. Something inside it is still waiting for a war to end.',
    image: 'regret_chest',
  },
  {
    id: 'regret_legs', name: 'Greaves of the Endless Dark',
    slot: GearSlot.LEGS, gearType: GearType.LEGS,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { spd: 30, def: 240, hp: 4200 },
    description: 'They walked into the void once. They walk in it still.',
    image: 'regret_legs',
  },
  {
    id: 'regret_boots', name: 'Sabatons of the Last March',
    slot: GearSlot.BOOTS, gearType: GearType.BOOTS,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { spd: 26, def: 170, hp: 3200 },
    description: 'The last march was the one that ended everything. These boots remember every step.',
    image: 'regret_boots',
  },
  {
    id: 'regret_gloves', name: 'Gauntlets of the Shattered Vow',
    slot: GearSlot.GLOVES, gearType: GearType.GLOVES,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { atk: 340, atkPct: 0.13, critDmg: 0.10 },
    description: 'Clenched for the last time centuries ago. They cannot unclench. They will not.',
    image: 'regret_gloves',
  },
]

export const REGRET_PIECES_BY_SLOT = Object.fromEntries(BASE_PIECES.map(p => [p.slot, p]))

// ── Null Panoply — drops from The Null Throne (Malachar) ───────────────────
export const NULL_SET = {
  id:    'null_panoply',
  name:  'Null Panoply',
  color: '#8844ff',
  desc:  'Armour worn by the commander of nothing. It absorbs light. It does not give it back.',
}

const NULL_PIECES = [
  {
    id: 'null_sword', name: 'Blade of Unbecoming',
    slot: GearSlot.MAIN_HAND, gearType: GearType.WEAPON, weaponType: WeaponType.SWORD,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'null_panoply',
    stats: { atk: 680, critDmg: 0.22, accuracy: 0.08 },
    description: 'The void flame that runs its length was never lit. It was always there, waiting for the sword to catch up.',
    image: 'null_sword',
  },
  {
    id: 'null_shield', name: 'Bulwark of the Absent',
    slot: GearSlot.OFF_HAND, gearType: GearType.SHIELD,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'null_panoply',
    stats: { def: 490, hp: 8400, resistance: 0.08 },
    description: 'The chains hanging from it lead nowhere. They always have.',
    image: 'null_shield',
  },
  {
    id: 'null_helm', name: 'Crown of the Null Sovereign',
    slot: GearSlot.HEAD, gearType: GearType.HELMET,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'null_panoply',
    stats: { hp: 8200, resistance: 0.10, accuracy: 0.06 },
    description: 'The crown\'s hollow face looks back at nothing. It has been doing this since before Malachar was born.',
    image: 'null_helm',
  },
  {
    id: 'null_chest', name: 'Mantle of the Void Vanguard',
    slot: GearSlot.CHEST, gearType: GearType.ARMOR,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'null_panoply',
    stats: { hp: 13000, def: 340, resistance: 0.06 },
    description: 'The void-torn edges are not damage. They are where the armour has begun to agree with the wearer.',
    image: 'null_chest',
  },
  {
    id: 'null_legs', name: 'Greaves of the Unmade',
    slot: GearSlot.LEGS, gearType: GearType.LEGS,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'null_panoply',
    stats: { spd: 32, def: 260, hp: 4600 },
    description: 'They have carried Malachar across every battlefield that no longer exists. They are not tired.',
    image: 'null_legs',
  },
  {
    id: 'null_boots', name: 'Treads of the Void March',
    slot: GearSlot.BOOTS, gearType: GearType.BOOTS,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'null_panoply',
    stats: { spd: 28, accuracy: 0.08, hp: 3600 },
    description: 'They make no sound. They have never made any sound. Even the void goes quiet when they land.',
    image: 'null_boots',
  },
  {
    id: 'null_gloves', name: 'Gauntlets of Null Command',
    slot: GearSlot.GLOVES, gearType: GearType.GLOVES,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'null_panoply',
    stats: { atk: 360, critRate: 0.07, critDmg: 0.18 },
    description: 'The claws are not added to the gauntlet. The gauntlet grew them.',
    image: 'null_gloves',
  },
]

export const NULL_PIECES_BY_SLOT = Object.fromEntries(NULL_PIECES.map(p => [p.slot, p]))

function makeNullPiece(basePiece) {
  const inst = createItemInstance(basePiece)
  inst.craftedAt = Date.now()
  inst.crafted   = true
  if (basePiece.image) inst.gearImageKey = basePiece.image
  return inst
}

export function rollNullGear() {
  const slots = Object.values(GearSlot)
  const shuffled = slots.sort(() => Math.random() - 0.5)
  const drops = []
  for (let i = 0; i < shuffled.length; i++) {
    const piece = NULL_PIECES.find(p => p.slot === shuffled[i])
    if (!piece) continue
    const chances = [1, 0.40, 0.14, 0.04]
    if (i >= chances.length) break
    if (i > 0 && Math.random() > chances[i]) break
    drops.push(makeNullPiece(piece))
  }
  return drops
}

// Creates a fresh Legendary instance of the given slot's Regret piece.
function makeRegretPiece(basePiece) {
  const inst = createItemInstance(basePiece)
  inst.craftedAt = Date.now()
  inst.crafted   = true
  if (basePiece.image) inst.gearImageKey = basePiece.image
  return inst
}

// Roll 1–4 pieces from the set, 1 guaranteed with steeply diminishing extras.
export function rollThroneGear() {
  const slots = Object.values(GearSlot)
  const shuffled = slots.sort(() => Math.random() - 0.5)
  const drops = []

  for (let i = 0; i < shuffled.length; i++) {
    const slot  = shuffled[i]
    const piece = BASE_PIECES.find(p => p.slot === slot)
    if (!piece) continue

    // 1st guaranteed, 2nd 40%, 3rd 14%, 4th 4%
    const chances = [1, 0.40, 0.14, 0.04]
    if (i >= chances.length) break
    if (i > 0 && Math.random() > chances[i]) break

    drops.push(makeRegretPiece(piece))
  }

  return drops
}
