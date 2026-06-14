import { SMELT_TIMES as ST } from './artisanSettings.js'

export const FORGE_TIERS = [
  {
    level:  0,
    name:   'Basic Forge',
    unlock: null,
    color:  '#cd7f32',
    glow:   'rgba(255,140,40,0.18)',
    image:  'forge_01',
  },
  {
    level:  1,
    name:   'Iron Forge',
    unlock: 'Codex Chapter I',
    color:  '#c0c0c0',
    glow:   'rgba(220,160,60,0.20)',
    image:  'forge_02',
  },
  {
    level:  2,
    name:   'Darksteel Forge',
    unlock: 'Codex Chapter II',
    color:  '#7c5cbf',
    glow:   'rgba(255,80,20,0.22)',
    image:  'forge_03',
  },
  {
    level:  3,
    name:   'Mythril Forge',
    unlock: 'Codex Chapter III',
    color:  '#ffd700',
    glow:   'rgba(255,220,80,0.22)',
    image:  'forge_04',
  },
  {
    level:  4,
    name:   'Elven Forge',
    unlock: 'Elven Encounter',
    color:  '#7ee8ff',
    glow:   'rgba(80,200,255,0.20)',
    image:  'elven_forge',
    special: true,
  },
  {
    level:  5,
    name:   'Goblin Forge',
    unlock: 'Goblin Encounter',
    color:  '#a8d840',
    glow:   'rgba(148,200,40,0.24)',
    image:  'goblin_forge',
    special: true,
  },
  {
    level:  6,
    name:   'Dwarf Forge',
    unlock: 'Dwarf Encounter',
    color:  '#e07828',
    glow:   'rgba(200,110,30,0.24)',
    image:  'dwarven_forge',
    special: true,
  },
]

export const BARS = {
  copper:     { id: 'copper',     name: 'Copper Bar',     color: '#cd7f32', oreId: 'copper',    oreCost: 2, requiredForge: 0, xp: 5,  smeltTime: ST.copper     },
  tin:        { id: 'tin',        name: 'Tin Bar',        color: '#9ea8a8', oreId: 'tin',       oreCost: 2, requiredForge: 0, xp: 8,  smeltTime: ST.tin        },
  steel:      { id: 'steel',      name: 'Steel Bar',      color: '#6b7c85', oreId: 'steel',     oreCost: 3, requiredForge: 0, smithingLevel: 5, xp: 15, smeltTime: ST.steel    },
  darksteel:  { id: 'darksteel',  name: 'Darksteel Bar',  color: '#7c5cbf', oreId: 'darksteel', oreCost: 3, requiredForge: 2, xp: 25, smeltTime: ST.darksteel  },
  mithril:    { id: 'mithril',    name: 'Mithril Bar',    color: '#5bacd4', oreId: 'mithril',   oreCost: 4, requiredForge: 3, xp: 40, smeltTime: ST.mithril    },
  moonsilver: { id: 'moonsilver', name: 'Moonsilver Bar', color: '#7ee8ff', oreId: 'mithril',   oreCost: 2, requiredForge: 4, xp: 80, smeltTime: ST.moonsilver },
  vaultmetal: { id: 'vaultmetal', name: 'Vaultmetal Bar', color: '#a8d840', oreId: 'darksteel', oreCost: 3, requiredForge: 5, xp: 60, smeltTime: ST.vaultmetal },
  runeite:    { id: 'runeite',    name: 'Runeite Bar',    color: '#e07828', oreId: 'mithril',   oreCost: 3, requiredForge: 6, xp: 70, smeltTime: ST.runeite    },
}

export const BAR_LIST = Object.values(BARS)
