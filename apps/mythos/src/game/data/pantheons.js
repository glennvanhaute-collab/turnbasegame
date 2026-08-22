// Mythos Dominion — the four pantheons.
// Mirrors the shape of src/game/data/westrun/factions.js: realm-specific data,
// kept out of the shared engine.

const UI = import.meta.env.BASE_URL + 'ui/'

export const Pantheon = {
  GREEK:    'Greek',
  ROMAN:    'Roman',
  EGYPTIAN: 'Egyptian',
  NORSE:    'Norse',
}

export const PANTHEONS = [
  {
    id: 'greek',
    name: 'Greek',
    title: 'The Olympian Court',
    sigil: UI + 'logo_greek.png',
    color: '#d8d2c4',
    accent: '#7fa8d8',
    affinity: 'Magic',
    // How this pantheon earns Favor — the faucet defines the playstyle.
    favor: {
      name: 'Arete',
      how: 'Decisive victory — flawless clears and battles won without losses.',
      verb: 'Prove yourself',
    },
    blurb: 'Excellence demands witnesses. Win well, and Olympus notices.',
  },
  {
    id: 'roman',
    name: 'Roman',
    title: 'The Eternal Senate',
    sigil: UI + 'logo_roman.png',
    color: '#c9a227',
    accent: '#a8302f',
    affinity: 'Force',
    favor: {
      name: 'Dignitas',
      how: 'Discipline — completed campaigns, objectives met, tribute paid.',
      verb: 'Serve the order',
    },
    blurb: 'The gods of Rome reward the dutiful, not the brilliant.',
  },
  {
    id: 'egyptian',
    name: 'Egyptian',
    title: 'The Ennead',
    sigil: UI + 'logo_egypt.png',
    color: '#d4a843',
    accent: '#2f7f8f',
    affinity: 'Spirit',
    favor: {
      name: 'Ma’at',
      how: 'Devotion — offerings laid and monuments raised, accruing over time.',
      verb: 'Keep the balance',
    },
    blurb: 'Build, offer, endure. The Nile gods measure patience, not glory.',
  },
  {
    id: 'norse',
    name: 'Norse',
    title: 'The Aesir',
    sigil: UI + 'logo_norse.png',
    color: '#9fb0bd',
    accent: '#4a6fa5',
    affinity: 'Void',
    favor: {
      name: 'Orðstírr',
      how: 'Battle itself — damage dealt and taken, and the fallen who earn their seat.',
      verb: 'Die well',
    },
    blurb: 'Asgard does not care whether you won. Only how you fought.',
  },
]

export function getPantheon(id) {
  return PANTHEONS.find(p => p.id === id) ?? null
}

export const MYTHOS_ART = {
  logo: UI + 'mythos_logo.png',
  bg:   UI + 'main-bg.png',
}
