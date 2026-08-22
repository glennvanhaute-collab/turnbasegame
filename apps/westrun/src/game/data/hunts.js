// Hunt & forage missions — yield raw hides or fibers
// artisanBonus: heroes with the matching skill get extra rolls
import { GATHER_DURATIONS as GD } from './artisanSettings.js'

export const HUNTS = [
  {
    id:       'roughlands_hunt',
    name:     'Roughlands Hunt',
    type:     'hunt',
    biome:    'Roughlands',
    desc:     'Stalk small game across the scrubby lowlands. Quick and reliable.',
    duration: GD.roughlands_hunt,
    color:    '#c8906e',
    drops: [
      { materialType: 'hide', id: 'rough', min: 2, max: 5 },
      { materialType: 'hide', id: 'thick', min: 1, max: 1, chance: 0.30 },
    ],
    artisanBonus: { skill: 'leatherworking', materialType: 'hide', id: 'rough', min: 1, max: 3 },
  },
  {
    id:       'ironwood_chase',
    name:     'Ironwood Chase',
    type:     'hunt',
    biome:    'Ironwood Forest',
    desc:     'Track elk and boar through dense ironwood trees. Thick hides well worth the effort.',
    duration: GD.ironwood_chase,
    color:    '#b07040',
    drops: [
      { materialType: 'hide', id: 'thick',    min: 2, max: 4 },
      { materialType: 'hide', id: 'hardened', min: 1, max: 2, chance: 0.28 },
    ],
    artisanBonus: { skill: 'leatherworking', materialType: 'hide', id: 'thick', min: 1, max: 2 },
  },
  {
    id:       'ember_peaks_hunt',
    name:     'Ember Peaks Hunt',
    type:     'hunt',
    biome:    'Ember Peaks',
    desc:     'Hunt hardened-hide beasts in the volcanic foothills. Dangerous but the pelts are superb.',
    duration: GD.ember_peaks_hunt,
    color:    '#8a5028',
    drops: [
      { materialType: 'hide', id: 'hardened', min: 2, max: 3 },
      { materialType: 'hide', id: 'shadow',   min: 1, max: 1, chance: 0.22 },
    ],
    artisanBonus: { skill: 'leatherworking', materialType: 'hide', id: 'hardened', min: 1, max: 2 },
  },
  {
    id:       'shadow_wilds_hunt',
    name:     'Shadow Wilds Hunt',
    type:     'hunt',
    biome:    'Shadow Wilds',
    desc:     'Pursue phantom predators through the twilight forest. Their pelts carry permanent darkness.',
    duration: GD.shadow_wilds_hunt,
    color:    '#7040b0',
    drops: [
      { materialType: 'hide', id: 'shadow',    min: 1, max: 3 },
      { materialType: 'hide', id: 'celestial', min: 1, max: 1, chance: 0.15 },
    ],
    artisanBonus: { skill: 'leatherworking', materialType: 'hide', id: 'shadow', min: 1, max: 2 },
  },

  {
    id:       'cotton_fields',
    name:     'Cotton Fields',
    type:     'forage',
    biome:    'Riverside Meadow',
    desc:     'Gather cotton bolls from the sun-warmed fields. Soft and plentiful.',
    duration: GD.cotton_fields,
    color:    '#f0e0c0',
    drops: [
      { materialType: 'fiber', id: 'cotton', min: 2, max: 5 },
      { materialType: 'fiber', id: 'wool',   min: 1, max: 1, chance: 0.28 },
    ],
    artisanBonus: { skill: 'tailoring', materialType: 'fiber', id: 'cotton', min: 1, max: 3 },
  },
  {
    id:       'shepherds_meadow',
    name:     "Shepherd's Meadow",
    type:     'forage',
    biome:    'Highland Pasture',
    desc:     'Collect wool from wild highland sheep and harvest silk cocoons from roadside trees.',
    duration: GD.shepherds_meadow,
    color:    '#d4c4a8',
    drops: [
      { materialType: 'fiber', id: 'wool',       min: 2, max: 4 },
      { materialType: 'fiber', id: 'silkthread', min: 1, max: 2, chance: 0.25 },
    ],
    artisanBonus: { skill: 'tailoring', materialType: 'fiber', id: 'wool', min: 1, max: 2 },
  },
  {
    id:       'silkworm_grove',
    name:     'Silkworm Grove',
    type:     'forage',
    biome:    'Ashwood Grove',
    desc:     'Harvest silkworm cocoons from the ancient ashwood trees. Patience rewards with fine thread.',
    duration: GD.silkworm_grove,
    color:    '#e8d8ff',
    drops: [
      { materialType: 'fiber', id: 'silkthread',  min: 2, max: 3 },
      { materialType: 'fiber', id: 'shadowthread', min: 1, max: 1, chance: 0.20 },
    ],
    artisanBonus: { skill: 'tailoring', materialType: 'fiber', id: 'silkthread', min: 1, max: 2 },
  },
  {
    id:       'umbral_hollow',
    name:     'Umbral Hollow',
    type:     'forage',
    biome:    'Umbral Hollow',
    desc:     'Gather shadow-infused thread from the roots of the Hollow. The fibers seem to weave themselves.',
    duration: GD.umbral_hollow,
    color:    '#9060c0',
    drops: [
      { materialType: 'fiber', id: 'shadowthread', min: 1, max: 3 },
      { materialType: 'fiber', id: 'starthread',   min: 1, max: 1, chance: 0.14 },
    ],
    artisanBonus: { skill: 'tailoring', materialType: 'fiber', id: 'shadowthread', min: 1, max: 2 },
  },
]

export const LUMBER_MISSIONS = [
  {
    id:       'pine_forest',
    name:     'Pine Forest',
    type:     'lumber',
    biome:    'Lowland Forest',
    desc:     'Fell pine from the sprawling lowland forests. Quick and plentiful — good timber for beginners.',
    duration: GD.pine_forest,
    color:    '#c8a87a',
    drops: [
      { materialType: 'log', id: 'pine', min: 2, max: 5 },
      { materialType: 'log', id: 'oak',  min: 1, max: 1, chance: 0.30 },
    ],
    artisanBonus: { skill: 'woodworking', materialType: 'log', id: 'pine', min: 1, max: 3 },
  },
  {
    id:       'oak_highlands',
    name:     'Oak Highlands',
    type:     'lumber',
    biome:    'Heartwood Hills',
    desc:     'Chop sturdy oak from the ancient highland groves. Takes patience but the timber holds an edge well.',
    duration: GD.oak_highlands,
    color:    '#a0784a',
    drops: [
      { materialType: 'log', id: 'oak', min: 2, max: 4 },
      { materialType: 'log', id: 'yew', min: 1, max: 2, chance: 0.28 },
    ],
    artisanBonus: { skill: 'woodworking', materialType: 'log', id: 'oak', min: 1, max: 2 },
  },
  {
    id:       'yew_reaches',
    name:     'Yew Reaches',
    type:     'lumber',
    biome:    'Highland Reaches',
    desc:     'Harvest dense yew from the windswept ridges. Favoured by bowyers and weapon-crafters for its spring.',
    duration: GD.yew_reaches,
    color:    '#7a5a38',
    drops: [
      { materialType: 'log', id: 'yew',     min: 2, max: 3 },
      { materialType: 'log', id: 'ashwood', min: 1, max: 1, chance: 0.22 },
    ],
    artisanBonus: { skill: 'woodworking', materialType: 'log', id: 'yew', min: 1, max: 2 },
  },
  {
    id:       'pale_ashwood',
    name:     'Pale Ashwood',
    type:     'lumber',
    biome:    'Ashen Plateau',
    desc:     'Cut silver-grained ashwood from the high plateau. Prized for its hardness and pale lustre.',
    duration: GD.pale_ashwood,
    color:    '#8ab4c8',
    drops: [
      { materialType: 'log', id: 'ashwood',  min: 1, max: 3 },
      { materialType: 'log', id: 'ironwood', min: 1, max: 1, chance: 0.15 },
    ],
    artisanBonus: { skill: 'woodworking', materialType: 'log', id: 'ashwood', min: 1, max: 2 },
  },
  {
    id:       'ironwood_depths',
    name:     'Ironwood Depths',
    type:     'lumber',
    biome:    'Deep Ironwood',
    desc:     "Venture into the dense ironwood where axes ring like hammers on steel. Few trees fall — those that do are worth the effort.",
    duration: GD.ironwood_depths,
    color:    '#5a7080',
    drops: [
      { materialType: 'log', id: 'ironwood',   min: 1, max: 3 },
      { materialType: 'log', id: 'dragonwood', min: 1, max: 1, chance: 0.10 },
    ],
    artisanBonus: { skill: 'woodworking', materialType: 'log', id: 'ironwood', min: 1, max: 2 },
  },
  {
    id:       'dragons_scar',
    name:     "Dragon's Scar",
    type:     'lumber',
    biome:    "Dragon's Scar",
    desc:     'Harvest ancient dragonwood from forests scorched long ago. Still warm to the touch. Uncommonly dangerous — bring your best.',
    duration: GD.dragons_scar,
    color:    '#9a4444',
    drops: [
      { materialType: 'log', id: 'dragonwood', min: 1, max: 3 },
    ],
    artisanBonus: { skill: 'woodworking', materialType: 'log', id: 'dragonwood', min: 1, max: 2 },
  },
]

const ALL_HUNTS = [...HUNTS, ...LUMBER_MISSIONS]

export const HUNTS_BY_ID = Object.fromEntries(ALL_HUNTS.map(h => [h.id, h]))

export const HUNT_MISSIONS  = HUNTS.filter(h => h.type === 'hunt')
export const FORAGE_MISSIONS = HUNTS.filter(h => h.type === 'forage')
