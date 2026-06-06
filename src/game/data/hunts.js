// Hunt & forage missions — yield raw hides or fibers
// artisanBonus: heroes with the matching skill get extra rolls

export const HUNTS = [
  {
    id:       'roughlands_hunt',
    name:     'Roughlands Hunt',
    type:     'hunt',
    biome:    'Roughlands',
    desc:     'Stalk small game across the scrubby lowlands. Quick and reliable.',
    duration: 300,
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
    duration: 900,
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
    duration: 1800,
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
    duration: 3600,
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
    duration: 300,
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
    duration: 900,
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
    duration: 1800,
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
    duration: 3600,
    color:    '#9060c0',
    drops: [
      { materialType: 'fiber', id: 'shadowthread', min: 1, max: 3 },
      { materialType: 'fiber', id: 'starthread',   min: 1, max: 1, chance: 0.14 },
    ],
    artisanBonus: { skill: 'tailoring', materialType: 'fiber', id: 'shadowthread', min: 1, max: 2 },
  },
]

export const HUNTS_BY_ID = Object.fromEntries(HUNTS.map(h => [h.id, h]))

export const HUNT_MISSIONS  = HUNTS.filter(h => h.type === 'hunt')
export const FORAGE_MISSIONS = HUNTS.filter(h => h.type === 'forage')
