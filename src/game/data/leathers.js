// Processed leather — produced by tanning hides at the Leatherworker's bench
// hideId: the raw hide consumed; hideCost: hides per strip; tanTime: seconds per strip

export const LEATHERS = {
  rough:     { id: 'rough',     name: 'Rough Leather',    color: '#c8906e', hideId: 'rough',     hideCost: 2, xp: 5,  tanTime: 6  },
  thick:     { id: 'thick',     name: 'Thick Leather',    color: '#b07040', hideId: 'thick',     hideCost: 2, xp: 10, tanTime: 10 },
  hardened:  { id: 'hardened',  name: 'Hardened Leather', color: '#8a5028', hideId: 'hardened',  hideCost: 3, xp: 18, tanTime: 18 },
  shadow:    { id: 'shadow',    name: 'Shadow Leather',   color: '#7040b0', hideId: 'shadow',    hideCost: 3, xp: 28, tanTime: 30 },
  celestial: { id: 'celestial', name: 'Celestial Leather',color: '#5bacd4', hideId: 'celestial', hideCost: 4, xp: 45, tanTime: 50 },
  moonscale: { id: 'moonscale', name: 'Moonscale Strip',  color: '#7ee8ff', hideId: 'moonscale', hideCost: 2, xp: 85, tanTime: 80 },
}

export const LEATHER_LIST = Object.values(LEATHERS)

// Maps blacksmith tier IDs → leather type ID (for upgrade material lookup in ForgeView)
export const LEATHER_FOR_TIER = {
  copper:     'rough',
  tin:        'thick',
  steel:      'hardened',
  darksteel:  'shadow',
  mithril:    'celestial',
  moonsilver: 'moonscale',
}

// Tannery "levels" — always available (no special unlock needed for now)
export const TANNERY_TIERS = [
  { level: 0, name: 'Basic Tannery', color: '#c8906e', glow: 'rgba(200,144,110,0.20)' },
]
