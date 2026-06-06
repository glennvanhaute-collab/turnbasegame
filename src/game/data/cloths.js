// Processed cloth — produced by weaving fibers at the Tailor's loom
// fiberId: the raw fiber consumed; fiberCost: fibers per bolt; weaveTime: seconds per bolt

export const CLOTHS = {
  cotton:      { id: 'cotton',      name: 'Cotton Cloth',   color: '#f0e0c0', fiberId: 'cotton',      fiberCost: 2, xp: 5,  weaveTime: 6  },
  wool:        { id: 'wool',        name: 'Wool Cloth',     color: '#d4c4a8', fiberId: 'wool',        fiberCost: 2, xp: 10, weaveTime: 10 },
  silkweave:   { id: 'silkweave',   name: 'Silkweave',      color: '#e8d8ff', fiberId: 'silkthread',  fiberCost: 3, xp: 18, weaveTime: 18 },
  shadowcloth: { id: 'shadowcloth', name: 'Shadow Cloth',   color: '#9060c0', fiberId: 'shadowthread',fiberCost: 3, xp: 28, weaveTime: 30 },
  starweave:   { id: 'starweave',   name: 'Starweave',      color: '#88ccff', fiberId: 'starthread',  fiberCost: 4, xp: 45, weaveTime: 50 },
  moonweave:   { id: 'moonweave',   name: 'Moonweave',      color: '#bbeeff', fiberId: 'moonthread',  fiberCost: 2, xp: 85, weaveTime: 80 },
}

export const CLOTH_LIST = Object.values(CLOTHS)

// Maps blacksmith tier IDs → cloth type ID (for upgrade material lookup in ForgeView)
export const CLOTH_FOR_TIER = {
  copper:     'cotton',
  tin:        'wool',
  steel:      'silkweave',
  darksteel:  'shadowcloth',
  mithril:    'starweave',
  moonsilver: 'moonweave',
}
