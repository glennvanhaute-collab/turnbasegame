// ── Sheet registry ────────────────────────────────────────────────────────
// Each sheet is a numbered PNG in src/assets/ui/.
// pos(col, row, sheet) — sheet defaults to 1.
// GameIcon.vue picks the right image based on entry.sheet.
//
// icons_1.png        — 8×4 grid (1774×887px)  — nav, ores, bars, gear slots
// icons_2.png        — 8×3 grid (2048×768px)  — currency/UI, affinities, artisan skills
// sprites_blacksmith — 8×6 grid (1448×1086px) — tiered gear icons (copper→moonsilver)

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

// ── Merged lookup ─────────────────────────────────────────────────────────
export const ICONS = { ...ICONS_1, ...ICONS_2, ...ICONS_BS }

// ── Convenience helpers ───────────────────────────────────────────────────
export function oreIcon(tierId)  { return `${tierId}_ore` }
export function barIcon(tierId)  { return `${tierId}_bar` }

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

// Returns a tier-specific icon key if available, falls back to generic slot icon
export function tierSlotIcon(tier, slot) {
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
