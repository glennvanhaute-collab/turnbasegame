export const Faction = {
  ALDRIC:         'House Aldric',
  VALDRIS:        'House Valdris',
  CAELWYN:        'House Caelwyn',
  MORDAINE:       'House Mordaine',
  BLOODTUSK:      'House Bloodtusk',
  IGNAR:          'House Ignar',
  ANCIENT_NOBLES: 'Ancient Nobles',
}

// ── The two faiths ────────────────────────────────────────────────
// Westrun is split by belief as well as by banner, and the two splits do not
// agree. A house can be your ally in council and your enemy at the altar.
export const Faith = {
  NEW_GODS: 'The New Gods',
  OLD_GODS: 'The Old Gods',
}

export const FAITHS = {
  [Faith.NEW_GODS]: {
    id: 'new',
    name: 'The New Gods',
    color: '#4fa8ff',
    // Codified, hierarchical, written down. Faith as institution.
    creed: 'What is written can be kept.',
    summary:
      'A faith of scripture and septs, brought to Westrun within recorded memory. ' +
      'It has doctrine, an order of priests, and an answer for every question — which ' +
      'is precisely what its critics hold against it.',
    tenets: [
      'The gods gave law, and law is the shape of mercy.',
      'A vow spoken before witnesses binds harder than blood.',
      'What cannot be written down cannot be trusted.',
    ],
  },
  [Faith.OLD_GODS]: {
    id: 'old',
    name: 'The Old Gods',
    color: '#b44fff',
    // Older than writing. No doctrine, no clergy — only places that remember.
    creed: 'What is older than us does not require our belief.',
    summary:
      'No scripture, no priesthood, no name for the things being worshipped. ' +
      'The Old Gods are kept in places rather than books — barrows, standing stones, ' +
      'and the dark under the roots. They are not prayed to so much as not disturbed.',
    tenets: [
      'The oldest debts are owed to the land, not to men.',
      'Some doors were shut by people wiser than you.',
      'A god that needs a book is a god that needs convincing.',
    ],
  },
}

// ── Houses ────────────────────────────────────────────────────────
// `faith` is where the house's heart is. `devotion` is how loudly it says so —
// which is the seam most political trouble comes through.
export const HOUSES = {
  [Faction.ALDRIC]: {
    id: 'aldric',
    name: 'House Aldric',
    color: '#c8962a',
    tagline: 'Warriors of the Iron Gate',
    faith: Faith.NEW_GODS,
    devotion: 'political',
    creed: 'The realm first. The gods will keep.',
    summary:
      'Keeps the New Gods the way it keeps its walls — because the realm runs better ' +
      'with them standing. Aldric septs are well funded and thinly attended. The old ' +
      'customs were never quite stamped out in the Iron Moors, and Aldric has never ' +
      'looked very hard for them.',
  },
  [Faction.VALDRIS]: {
    id: 'valdris',
    name: 'House Valdris',
    color: '#4fa8ff',
    tagline: 'Keepers of the Written Word',
    faith: Faith.NEW_GODS,
    devotion: 'doctrinal',
    creed: 'The gods spoke once, clearly, and we wrote it down.',
    summary:
      'The New Gods have no seat more certain of itself than Valdris. Its septons ' +
      'hold that revelation is finished — that everything needed was given and recorded, ' +
      'and that what remains is not discovery but obedience. They keep the largest ' +
      'library in Westrun and read from very little of it.',
  },
  [Faction.CAELWYN]: {
    id: 'caelwyn',
    name: 'House Caelwyn',
    color: '#4dff88',
    tagline: 'Wardens of the Ancient Grove',
    faith: Faith.OLD_GODS,
    devotion: 'inherited',
    creed: 'We did not choose the grove. We were born inside it.',
    summary:
      'Keeps the Old Gods without ceremony, the way one keeps a family name. There are ' +
      'no Caelwyn rites worth the word — only a long list of places nobody walks through ' +
      'and nobody explains. Ask a Caelwyn what they believe and you will get directions ' +
      'rather than an answer.',
  },
  [Faction.MORDAINE]: {
    id: 'mordaine',
    name: 'House Mordaine',
    color: '#b44fff',
    tagline: 'Keepers of the Old Silence',
    faith: Faith.OLD_GODS,
    devotion: 'zealous',
    creed: 'Older things were here first, and they are still owed.',
    summary:
      'Where Caelwyn inherits the Old Gods, Mordaine serves them — deliberately, and at ' +
      'a price. Its wardens keep the barrows and the standing stones, settle debts the ' +
      'rest of Westrun has forgotten it owes, and regard the New Gods as a bookkeeping ' +
      'error two centuries in the making.',
  },
}

// ── Bannermen ─────────────────────────────────────────────────────
// Minor houses sworn to a great house. They add names, regions and colour to
// the world without adding political poles: a bannerman has no reputation track
// of its own — what you earn with them is credited to their liege.
export const BANNERMEN = {
  [Faction.IGNAR]: {
    id: 'ignar',
    name: 'House Ignar',
    liege: Faction.ALDRIC,
    color: '#7fa8c4',
    region: 'The Frostmoors',
    tagline: 'Oathsworn of the Frostmoors',
    // Ignar keeps the Old Gods while sworn to a New Gods house. Aldric's own
    // devotion is political, so it has never pressed the point — and Ignar has
    // never once let the difference loosen the oath.
    faith: Faith.OLD_GODS,
    devotion: 'ancestral',
    creed: 'The oath outlives the man who swore it.',
    summary:
      'A northern warband culture of jarls, shieldwalls and long memory, sworn to ' +
      'Aldric three generations back and not one day late since. Ignar keeps the ' +
      'Old Gods in the plain northern way — no rites, no priests, only the stones ' +
      'their grandfathers were buried under. Southern houses mistake them for ' +
      'raiders because they were, once, and because Ignar has never bothered to ' +
      'correct anyone.',
    // Those who broke with the house — the enemy Ignar you meet in the field.
    splinter: {
      name: 'The Frostbound Cult',
      summary:
        'Not every jarl accepted the oath to Aldric. Those who refused went north ' +
        'past the moors and kept going, and what they kneel to now is older than ' +
        'anything Ignar buried its dead beside. House Ignar does not call them ' +
        'kin, and hunts them harder than any southern army would.',
    },
  },
}

export function isBannerman(faction) {
  return Object.hasOwn(BANNERMEN, faction)
}

export function liegeOf(faction) {
  return BANNERMEN[faction]?.liege ?? null
}

export function bannermenOf(house) {
  return Object.entries(BANNERMEN)
    .filter(([, b]) => b.liege === house)
    .map(([faction]) => faction)
}

// The house a faction's reputation is credited to. Great houses answer for
// themselves; bannermen pass it up to their liege.
export function repHouseFor(faction) {
  return BANNERMEN[faction]?.liege ?? faction
}

export function houseFaith(faction) {
  return HOUSES[faction]?.faith ?? BANNERMEN[faction]?.faith ?? null
}

export function sharesFaith(a, b) {
  const fa = houseFaith(a)
  return fa !== null && fa === houseFaith(b)
}

export const HOUSES_BY_FAITH = {
  [Faith.NEW_GODS]: [Faction.ALDRIC, Faction.VALDRIS],
  [Faith.OLD_GODS]: [Faction.CAELWYN, Faction.MORDAINE],
}
