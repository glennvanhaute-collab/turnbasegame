// ── Sheet registry ────────────────────────────────────────────────────────
// Each sheet is a numbered PNG in src/assets/ui/.
// pos(col, row, sheet) — sheet defaults to 1.
// GameIcon.vue picks the right image based on entry.sheet.
//
// icons_1.png              — 8×4 grid (1774×887px)   — nav, ores, bars, gear slots
// icons_2.png              — 8×3 grid (2048×768px)   — currency/UI, affinities, artisan skills
// sprites_blacksmith.png   — 8×6 grid (1448×1086px)  — tiered plate gear (copper→moonsilver)
// sprites_leatherworking.png — 5×6 grid (1145×1374px) — tiered leather gear
// sprites_tailoring.png    — 5×6 grid (1145×1374px)  — tiered cloth gear
// sprites_materials.png    — 6×4 grid (1536×1024px)  — hides, leathers, fibers, cloths
// sprites_elvish.png       — 8×6 grid (1448×1086px)  — tiered elvish gear (copper→moonsilver quality)

export const SHEET_COLS = 8

function pos(col, row, sheet = 1) { return { col, row, sheet } }

// ── Sheet 1: icons_1.png ─────────────────────────────────────────────────
// rows: 0=nav, 1=ores, 2=bars, 3=gear slots
export const SHEET_1_ROWS = 4

const ICONS_1 = {
  // Navigation
  collection:     pos(0, 0),
  market:         pos(1, 0),
  blacksmith:     pos(2, 0),

  // Ores
  copper_ore:     pos(0, 1),
  tin_ore:        pos(1, 1),
  steel_ore:      pos(2, 1),
  darksteel_ore:  pos(3, 1),
  mithril_ore:    pos(4, 1),
  moonsilver_ore: pos(5, 1),
  vaultmetal_ore: pos(6, 1),
  runite_ore:     pos(7, 1),

  // Bars
  copper_bar:     pos(0, 2),
  tin_bar:        pos(1, 2),
  steel_bar:      pos(2, 2),
  darksteel_bar:  pos(3, 2),
  mithril_bar:    pos(4, 2),
  moonsilver_bar: pos(5, 2),
  vaultmetal_bar: pos(6, 2),
  runite_bar:     pos(7, 2),

  // Gear slots
  sword:          pos(0, 3),
  dagger:         pos(1, 3),
  shield:         pos(2, 3),
  helmet:         pos(3, 3),
  chest:          pos(4, 3),
  legs:           pos(5, 3),
  boots:          pos(6, 3),
  gloves:         pos(7, 3),
}

// ── Sheet 2: icons_2.png ─────────────────────────────────────────────────
// rows: 0=currency/UI, 1=affinities, 2=artisan skills
export const SHEET_2_ROWS = 3

const ICONS_2 = {
  // Currency & UI
  energy:          pos(0, 0, 2),
  gold:            pos(1, 0, 2),
  diamond:         pos(2, 0, 2),
  mute:            pos(3, 0, 2),
  unmute:          pos(4, 0, 2),

  // Combat affinities
  affinity_force:   pos(0, 1, 2),
  affinity_spirit:  pos(1, 1, 2),
  affinity_magic:   pos(2, 1, 2),

  // Artisan skills
  skill_blacksmithing:  pos(0, 2, 2),
  skill_tailoring:      pos(1, 2, 2),
  skill_leatherworking: pos(2, 2, 2),
  skill_woodworking:    pos(3, 2, 2),
  skill_herbalism:      pos(4, 2, 2),
  skill_apothecary:     pos(5, 2, 2),
}

// ── Sheet BS: sprites_blacksmith.png ─────────────────────────────────────
// rows: 0=copper, 1=tin, 2=steel, 3=darksteel, 4=mithril, 5=moonsilver
// cols: 0=sword, 1=dagger, 2=shield, 3=helmet, 4=chest, 5=legs, 6=boots, 7=gloves
export const SHEET_BS_COLS = 8
export const SHEET_BS_ROWS = 6

const BS_TIERS = ['copper', 'tin', 'steel', 'darksteel', 'mithril', 'moonsilver']
const BS_SLOTS = ['sword', 'dagger', 'shield', 'helmet', 'chest', 'legs', 'boots', 'gloves']

const ICONS_BS = {}
BS_TIERS.forEach((tier, row) => {
  BS_SLOTS.forEach((slot, col) => {
    ICONS_BS[`${tier}_${slot}`] = pos(col, row, 'bs')
  })
})

// ── Sheet LW: sprites_leatherworking.png ─────────────────────────────────
// rows: 0=copper, 1=tin, 2=steel, 3=darksteel, 4=mithril, 5=moonsilver
// cols: 0=helmet, 1=chest, 2=legs, 3=boots, 4=gloves
export const SHEET_LW_COLS = 5
export const SHEET_LW_ROWS = 6

const LW_SLOTS = ['helmet', 'chest', 'legs', 'boots', 'gloves']

const ICONS_LW = {}
BS_TIERS.forEach((tier, row) => {
  LW_SLOTS.forEach((slot, col) => {
    ICONS_LW[`lw_${tier}_${slot}`] = pos(col, row, 'lw')
  })
})

// ── Sheet TW: sprites_tailoring.png ──────────────────────────────────────
// rows: 0=copper, 1=tin, 2=steel, 3=darksteel, 4=mithril, 5=moonsilver
// cols: 0=helmet, 1=chest, 2=legs, 3=boots, 4=gloves
export const SHEET_TW_COLS = 5
export const SHEET_TW_ROWS = 6

const ICONS_TW = {}
BS_TIERS.forEach((tier, row) => {
  LW_SLOTS.forEach((slot, col) => {
    ICONS_TW[`tw_${tier}_${slot}`] = pos(col, row, 'tw')
  })
})

// ── Sheet REGRET: sprites_regret.png ─────────────────────────────────────
// rows: 0=regret (single tier)
// cols: 0=sword, 1=shield, 2=helmet, 3=chest, 4=legs, 5=boots, 6=gloves
export const SHEET_REGRET_COLS = 7
export const SHEET_REGRET_ROWS = 1

const REGRET_SLOTS = ['sword', 'shield', 'helmet', 'chest', 'legs', 'boots', 'gloves']
const ICONS_REGRET = {}
REGRET_SLOTS.forEach((slot, col) => {
  ICONS_REGRET[`regret_${slot}`] = pos(col, 0, 'regret')
})

// ── Sheet WW: sprites_woodworking.png ────────────────────────────────────
// rows: 0=pine, 1=oak, 2=yew, 3=ashwood, 4=ironwood, 5=dragonwood
// cols: 0=bow, 1=staff, 2=logs
export const SHEET_WW_COLS = 3
export const SHEET_WW_ROWS = 6

const WW_TIERS = ['pine', 'oak', 'yew', 'ashwood', 'ironwood', 'dragonwood']
const WW_ITEMS = ['bow', 'staff', 'logs']

const ICONS_WW = {}
WW_TIERS.forEach((tier, row) => {
  WW_ITEMS.forEach((item, col) => {
    ICONS_WW[`ww_${tier}_${item}`] = pos(col, row, 'ww')
  })
})

// ── Sheet ELV: sprites_elvish.png ────────────────────────────────────────
// rows: 0=copper, 1=tin, 2=steel, 3=darksteel, 4=mithril, 5=moonsilver (quality tiers)
// cols: 0=sword, 1=dagger, 2=shield, 3=helmet, 4=chest, 5=legs, 6=boots, 7=gloves
export const SHEET_ELV_COLS = 8
export const SHEET_ELV_ROWS = 6

const ICONS_ELV = {}
BS_TIERS.forEach((tier, row) => {
  BS_SLOTS.forEach((slot, col) => {
    ICONS_ELV[`elv_${tier}_${slot}`] = pos(col, row, 'elv')
  })
})

// ── Sheet MATS: sprites_materials.png ────────────────────────────────────
// rows: 0=hides, 1=leathers, 2=fibers, 3=cloths
// cols: 0=rough/cotton, 1=thick/wool, 2=hardened/silkweave, 3=shadow, 4=celestial/starweave, 5=moonscale/moonweave
export const SHEET_MATS_COLS = 6
export const SHEET_MATS_ROWS = 4

const HIDE_IDS    = ['rough', 'thick', 'hardened', 'shadow', 'celestial', 'moonscale']
const LEATHER_IDS = ['rough', 'thick', 'hardened', 'shadow', 'celestial', 'moonscale']
const FIBER_IDS   = ['cotton', 'wool', 'silkthread', 'shadowthread', 'starthread', 'moonthread']
const CLOTH_IDS   = ['cotton', 'wool', 'silkweave', 'shadowcloth', 'starweave', 'moonweave']

const ICONS_MATS = {}
HIDE_IDS.forEach((id, col)    => { ICONS_MATS[`hide_${id}`]    = pos(col, 0, 'mats') })
LEATHER_IDS.forEach((id, col) => { ICONS_MATS[`leather_${id}`] = pos(col, 1, 'mats') })
FIBER_IDS.forEach((id, col)   => { ICONS_MATS[`fiber_${id}`]   = pos(col, 2, 'mats') })
CLOTH_IDS.forEach((id, col)   => { ICONS_MATS[`cloth_${id}`]   = pos(col, 3, 'mats') })

// ── Merged lookup ─────────────────────────────────────────────────────────
export const ICONS = { ...ICONS_1, ...ICONS_2, ...ICONS_BS, ...ICONS_LW, ...ICONS_TW, ...ICONS_MATS, ...ICONS_WW, ...ICONS_ELV, ...ICONS_REGRET }

// ── Convenience helpers ───────────────────────────────────────────────────
export function oreIcon(tierId)     { return `${tierId}_ore` }
export function barIcon(tierId)     { return `${tierId}_bar` }
export function hideIcon(id)        { return `hide_${id}` }
export function leatherIcon(id)     { return `leather_${id}` }
export function fiberIcon(id)       { return `fiber_${id}` }
export function clothIcon(id)       { return `cloth_${id}` }
export function woodBowIcon(tier)   { return `ww_${tier}_bow` }
export function woodStaffIcon(tier) { return `ww_${tier}_staff` }
export function woodLogsIcon(tier)  { return `ww_${tier}_logs` }

export const SLOT_TO_ICON = {
  main_hand: 'sword',
  off_hand:  'shield',
  head:      'helmet',
  chest:     'chest',
  legs:      'legs',
  boots:     'boots',
  gloves:    'gloves',
}

const SLOT_TO_BS_KEY = {
  main_hand: 'sword',
  off_hand:  'shield',
  head:      'helmet',
  chest:     'chest',
  legs:      'legs',
  boots:     'boots',
  gloves:    'gloves',
}

const SLOT_TO_LW_KEY = {
  head:   'helmet',
  chest:  'chest',
  legs:   'legs',
  boots:  'boots',
  gloves: 'gloves',
}

// Returns a tier+slot icon key, routing to the correct sheet based on discipline
export function tierSlotIcon(tier, slot, discipline = 'blacksmithing') {
  if (discipline === 'leatherworking') {
    const slotKey = SLOT_TO_LW_KEY[slot]
    if (tier && slotKey && BS_TIERS.includes(tier)) return `lw_${tier}_${slotKey}`
    return SLOT_TO_ICON[slot] ?? 'chest'
  }
  if (discipline === 'tailoring') {
    const slotKey = SLOT_TO_LW_KEY[slot]
    if (tier && slotKey && BS_TIERS.includes(tier)) return `tw_${tier}_${slotKey}`
    return SLOT_TO_ICON[slot] ?? 'chest'
  }
  if (discipline === 'elven') {
    const slotKey = SLOT_TO_BS_KEY[slot]
    if (tier && slotKey && BS_TIERS.includes(tier)) return `elv_${tier}_${slotKey}`
    return SLOT_TO_ICON[slot] ?? 'sword'
  }
  const slotKey = SLOT_TO_BS_KEY[slot]
  if (tier && slotKey && BS_TIERS.includes(tier)) return `${tier}_${slotKey}`
  return SLOT_TO_ICON[slot] ?? 'sword'
}

export const AFFINITY_ICON = {
  Force:   'affinity_force',
  Magic:   'affinity_magic',
  Spirit:  'affinity_spirit',
}

export const ARTISAN_SKILL_ICON = {
  Blacksmithing:  'skill_blacksmithing',
  Tailoring:      'skill_tailoring',
  Leatherworking: 'skill_leatherworking',
  Woodworking:    'skill_woodworking',
  Herbalism:      'skill_herbalism',
  Apothecary:     'skill_apothecary',
}
