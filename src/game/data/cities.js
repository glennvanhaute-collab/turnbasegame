export const CITY_DATA = {
  'House Aldric': {
    short:      'aldric',
    color:      '#c8860a',
    cityNames:  ['Ironwall Keep', 'Stonehaven', 'Grimwatch', "The Warden's Gate", 'Fort Aldric', 'The Iron Moors'],
    rumour: (heroName, rarity) => rumourLine(heroName, rarity),
  },
  'House Caelwyn': {
    short:      'caelwyn',
    color:      '#4dcc88',
    cityNames:  ['Thornwood Hollow', 'The Verdant Spire', 'Silverglade', 'Mosswatch', 'The Grove City', 'Elderwood'],
    rumour: (heroName, rarity) => rumourLine(heroName, rarity),
  },
  'House Valdris': {
    short:      'valdris',
    color:      '#88aaff',
    cityNames:  ["The Arcane Quarter", "Spire's End", 'Hexbridge', "The Scholar's Reach", 'Valdris Minor', 'The Glass Tower'],
    rumour: (heroName, rarity) => rumourLine(heroName, rarity),
  },
  'House Mordaine': {
    short:      'mordaine',
    color:      '#aa66ff',
    cityNames:  ['The Shroud', 'Voidmark', 'Ashport', 'The Hollow City', 'Nightfall Basin', 'The Unmarked City'],
    rumour: (heroName, rarity) => rumourLine(heroName, rarity),
  },
}

const RARITY_PREFIX = {
  Rare:      'A capable warrior known as',
  Epic:      'A seasoned fighter by the name of',
  Legendary: 'They say a legendary figure — ',
  Mythical:  'Whispers speak of a mythical force known only as',
}

function rumourLine(heroName, rarity) {
  const prefix = RARITY_PREFIX[rarity] ?? 'Someone called'
  return `"${prefix} ${heroName} was last seen in this city. Word is they are looking for a worthy banner to follow."`
}

export const CITY_FACTIONS = Object.keys(CITY_DATA)
