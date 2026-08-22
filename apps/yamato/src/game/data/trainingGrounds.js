import { ALLY_UNITS, ENEMY_UNITS } from './units.js'

const A = import.meta.env.BASE_URL + 'battle/'

// One training ground to start. Add entries here as the realm grows.
export const TRAINING_GROUNDS = [
  {
    id: 'painted-field',
    name: 'The Painted Field',
    kanji: '練武場',
    sub: 'Training Grounds',
    flavor: 'Petals drift on the wind. Steel meets steel beneath the old cherry.',
    desc: 'A sparring field where the Yamato vanguard drills against ashen invaders. Five against three.',
    bg: A + 'yamato_battlefield_clean.jpg',
    difficulty: 'Novice',
    allies: ALLY_UNITS,
    enemies: ENEMY_UNITS,
  },
]

export function getTrainingGround(id) {
  return TRAINING_GROUNDS.find(g => g.id === id) ?? null
}
