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
  },
  {
    id: 'regret_shield', name: 'Aegis of the Empty Throne',
    slot: GearSlot.OFF_HAND, gearType: GearType.SHIELD,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { def: 460, hp: 8000 },
    description: 'Carved from the throne itself. It stopped being a shield long ago — now it just endures.',
  },
  {
    id: 'regret_helm', name: 'Crown of the Fallen King',
    slot: GearSlot.HEAD, gearType: GearType.HELMET,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { hp: 7800, def: 190, resistance: 0.06 },
    description: 'The crown broke in the fall. It was never repaired. It still commands.',
  },
  {
    id: 'regret_chest', name: 'Breastplate of the Nightmare Court',
    slot: GearSlot.CHEST, gearType: GearType.ARMOR,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { hp: 12000, def: 320 },
    description: 'Its surface shifts like a held breath. Something inside it is still waiting for a war to end.',
  },
  {
    id: 'regret_legs', name: 'Greaves of the Endless Dark',
    slot: GearSlot.LEGS, gearType: GearType.LEGS,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { spd: 30, def: 240, hp: 4200 },
    description: 'They walked into the void once. They walk in it still.',
  },
  {
    id: 'regret_boots', name: 'Sabatons of the Last March',
    slot: GearSlot.BOOTS, gearType: GearType.BOOTS,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { spd: 26, def: 170, hp: 3200 },
    description: 'The last march was the one that ended everything. These boots remember every step.',
  },
  {
    id: 'regret_gloves', name: 'Gauntlets of the Shattered Vow',
    slot: GearSlot.GLOVES, gearType: GearType.GLOVES,
    rarity: 'Legendary', tier: 'raid', armorType: 'plate', setId: 'regret',
    stats: { atk: 340, atkPct: 0.13, critDmg: 0.10 },
    description: 'Clenched for the last time centuries ago. They cannot unclench. They will not.',
  },
]

export const REGRET_PIECES_BY_SLOT = Object.fromEntries(BASE_PIECES.map(p => [p.slot, p]))

// Creates a fresh Legendary instance of the given slot's Regret piece.
function makeRegretPiece(basePiece) {
  const inst = createItemInstance(basePiece)
  inst.craftedAt = Date.now()
  inst.crafted   = true
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
