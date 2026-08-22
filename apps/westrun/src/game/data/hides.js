// Raw materials for Leatherworking — dropped from wilderness/dungeons
// Each tier aligns with the blacksmith tier of the same name for upgrades/gates

export const HIDES = {
  rough:     { id: 'rough',     name: 'Rough Hide',     color: '#c8906e', desc: 'Scraped from common beasts. Serviceable once tanned.' },
  thick:     { id: 'thick',     name: 'Thick Hide',     color: '#b07040', desc: 'Dense hide from larger predators. Resists wear well.' },
  hardened:  { id: 'hardened',  name: 'Hardened Pelt',  color: '#8a5028', desc: 'Battle-scarred hide, already half-cured by conflict.' },
  shadow:    { id: 'shadow',    name: 'Shadow Pelt',    color: '#7040b0', desc: 'From creatures that dwell where light cannot follow.' },
  celestial: { id: 'celestial', name: 'Celestial Pelt', color: '#5bacd4', desc: 'Sheds starlight. Left behind by beasts born above the clouds.' },
  moonscale: { id: 'moonscale', name: 'Moonscale',      color: '#7ee8ff', desc: 'Not hide — scale. Shed by a moonbound drake. Nearly weightless.' },
}

export const HIDE_LIST = Object.values(HIDES)
