export const Faction = {
  ALDRIC:         'House Aldric',
  VALDRIS:        'House Valdris',
  CAELWYN:        'House Caelwyn',
  MORDAINE:       'House Mordaine',
  BLOODTUSK:      'House Bloodtusk',
  IGNAR:          'House Ignar',
  HARTVANE:       'House Hartvane',
  AEGIRA:         'House Aegira',
  VAERYN:         'House Vaeryn',
  ROSWAINE:       'House Roswaine',
  ANCIENT_NOBLES: 'Ancient Nobles',
}

// The seat above the board. Hartvane is not one of the four — it is the thing
// the four are arranged around. You do not earn reputation with a throne; you
// are loyal to it or you are not, so it carries no rep track of its own.
export const THE_CROWN = Faction.HARTVANE

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

// ── The Crown ─────────────────────────────────────────────────────
// Hartvane sits outside HOUSES on purpose: it is not a pole on the board, it is
// the seat the board is arranged around. Crowned by New Gods septons, which is
// precisely why the Old Gods houses have never quite conceded the point.
export const CROWN = {
  id: 'hartvane',
  name: 'House Hartvane',
  color: '#c9a227',
  region: 'The Stormhold',
  tagline: 'The Antlered Seat',
  sigil: 'A black hart rampant, crowned, on gold',
  faith: Faith.NEW_GODS,
  devotion: 'crowned',
  creed: 'The realm answers to one seat, or it answers to no one.',
  summary:
    'Hartvane took the crown the direct way and has kept it the same way. Its kings ' +
    'are warlike, plainspoken and impatient with council — a hammer where a scalpel ' +
    'was wanted, but the only house that ever ended a war rather than inheriting one. ' +
    'It was crowned in a New Gods sept, and the Old Gods houses have spent two ' +
    'centuries being formally respectful about it.',
  // What the four actually think about the seat
  standing: {
    [Faction.ALDRIC]:   'Sworn, and means it. Aldric built half those walls.',
    [Faction.VALDRIS]:  'Sworn in writing, which Valdris considers the binding part.',
    [Faction.CAELWYN]:  'Sworn in the way one is polite to weather.',
    [Faction.MORDAINE]: 'Sworn. Mordaine has never said to what.',
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

  [Faction.VAERYN]: {
    id: 'vaeryn',
    name: 'House Vaeryn',
    liege: Faction.MORDAINE,
    color: '#8f2c2c',
    region: 'The Ashen Reach',
    tagline: 'The Red Fox at the Pyre',
    motto: 'We Give Them Back',
    sigil: 'A red fox\'s head on black, ringed in ash',
    faith: Faith.OLD_GODS,
    devotion: 'funerary',
    creed: 'The ground keeps what it is given. Fire gives it back faster.',
    // The seam: Mordaine BURIES — barrows, standing stones, the dark under the
    // roots. Vaeryn BURNS. Same gods, same debt, opposite rite, and an argument
    // two centuries old about which one the dead were actually promised.
    summary:
      'Pyre-keepers of the Ashen Reach, sworn to Mordaine and quietly at odds with ' +
      'it since the day they swore. Mordaine lays its dead under stone and lets the ' +
      'old things take their time. Vaeryn burns them, and holds that a debt settled ' +
      'slowly is a debt still owed. Generations in pyre-smoke have taken the colour ' +
      'out of them — white-haired by twenty, most of them, which the rest of Westrun ' +
      'reads as sorcery and Vaeryn has never bothered to deny.',
    splinter: null,
  },

  [Faction.AEGIRA]: {
    id: 'aegira',
    name: 'House Aegira',
    liege: Faction.VALDRIS,
    color: '#4a9fd8',
    region: 'The Salt Colonnade',
    tagline: 'The Edge of the Tide',
    motto: 'Aegira Fortis Est',
    sigil: 'A gold trident over breaking waves, on storm-dark blue',
    faith: Faith.NEW_GODS,
    devotion: 'oracular',
    creed: 'The gods did not stop speaking merely because we stopped writing.',
    // The seam: Valdris doctrine holds that revelation is FINISHED. Aegira keeps
    // oracles. Its liege has never called that heresy out loud, because Aegira
    // also keeps the oldest texts in Westrun and Valdris cannot read them.
    summary:
      'An old maritime house of columns, harbours and salt-eaten marble, sworn to ' +
      'Valdris since before either could produce the paperwork. Aegira keeps the ' +
      'sea-roads, the tide-oracles, and a library half of which is underwater. ' +
      'Its septons hold that the gods still speak — through storm, through water, ' +
      'through the mouths of women who did not ask for it — which is precisely the ' +
      'thing Valdris doctrine exists to deny.',
    splinter: null,
  },

  [Faction.ROSWAINE]: {
    id: 'roswaine',
    name: 'House Roswaine',
    liege: Faction.CAELWYN,
    color: '#d4566e',
    region: 'The Rosemarch',
    tagline: 'The Cultivated Hand',
    sigil: 'Three red roses on green',
    // Same green world as its liege, opposite philosophy of it. Caelwyn keeps the
    // grove wild because it was never theirs to touch; Roswaine prunes, grafts and
    // improves — and considers that the higher devotion.
    faith: Faith.OLD_GODS,
    devotion: 'cultivated',
    creed: 'A thing left wild is a thing left unloved.',
    summary:
      'The richest holding in Westrun and the least armed, which Roswaine regards ' +
      'as the same sentence. It feeds four houses, marries into three, and has won ' +
      'more ground with harvest ledgers and wedding contracts than Aldric has with ' +
      'siege engines. Caelwyn finds its gardens faintly blasphemous. Roswaine finds ' +
      "Caelwyn's grove sentimental. Neither has ever said so at table.",
    splinter: null,
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
// themselves; bannermen pass it up to their liege. The Crown has no track at
// all — loyalty to a throne is not a bar you fill — so it credits nothing.
export function repHouseFor(faction) {
  if (faction === THE_CROWN) return null
  return BANNERMEN[faction]?.liege ?? faction
}

export function houseInfo(faction) {
  if (faction === THE_CROWN) return CROWN
  return HOUSES[faction] ?? BANNERMEN[faction] ?? null
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
