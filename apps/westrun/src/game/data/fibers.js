// Raw materials for Tailoring — gathered from plants, creatures, and arcane sources

export const FIBERS = {
  cotton:     { id: 'cotton',     name: 'Cotton',        color: '#f0e0c0', desc: 'Soft and common. Spun by peasants, worn by everyone.' },
  wool:       { id: 'wool',       name: 'Wool',          color: '#d4c4a8', desc: 'Sheared from highland sheep. Warmer than its weight suggests.' },
  silkthread: { id: 'silkthread', name: 'Silkthread',    color: '#e8d8ff', desc: 'Spun by moon-silk worms. Finer than any loom deserves.' },
  shadowthread:{ id: 'shadowthread', name: 'Shadow Thread', color: '#9060c0', desc: 'Harvested from void-touched moths. Resists light and scrutiny alike.' },
  starthread: { id: 'starthread', name: 'Starthread',    color: '#88ccff', desc: 'Falls from the sky on certain nights. Never decays.' },
  moonthread: { id: 'moonthread', name: 'Moonthread',    color: '#bbeeff', desc: 'Woven by lunar wraiths. Hums faintly under a full moon.' },
}

export const FIBER_LIST = Object.values(FIBERS)
