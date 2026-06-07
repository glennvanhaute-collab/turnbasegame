export const ORES = {
  copper:      { id: 'copper',      name: 'Copper Ore',      color: '#cd7f32', tier: 1 },
  tin:         { id: 'tin',         name: 'Tin Ore',          color: '#9ea8a8', tier: 2 },
  steel:       { id: 'steel',       name: 'Steel Ore',        color: '#6b7c85', tier: 3 },
  darksteel:   { id: 'darksteel',   name: 'Darksteel Ore',    color: '#7c5cbf', tier: 4 },
  mithril:     { id: 'mithril',     name: 'Mithril Ore',      color: '#5bacd4', tier: 5 },
}

export const ORE_LIST = Object.values(ORES)

// Returns array of { oreId, amount } based on encounter difficulty.
// Primary drop is not guaranteed — each difficulty has a base miss chance.
export function rollOreDrops(difficulty) {
  const drops = []
  const d = difficulty?.toLowerCase() ?? 'easy'

  if (d === 'easy') {
    if (Math.random() < 0.65) drops.push({ oreId: 'copper', amount: rand(1, 3) })
  } else if (d === 'normal' || d === 'medium') {
    if (Math.random() < 0.70) drops.push({ oreId: 'copper', amount: rand(1, 2) })
    if (Math.random() < 0.40) drops.push({ oreId: 'tin', amount: 1 })
  } else if (d === 'hard') {
    if (Math.random() < 0.75) drops.push({ oreId: 'tin', amount: rand(1, 2) })
    if (Math.random() < 0.35) drops.push({ oreId: 'steel', amount: 1 })
  } else if (d === 'nightmare') {
    if (Math.random() < 0.80) drops.push({ oreId: 'steel', amount: rand(1, 2) })
    if (Math.random() < 0.45) drops.push({ oreId: 'darksteel', amount: rand(1, 2) })
    if (Math.random() < 0.03) drops.push({ oreId: 'mithril', amount: 1 })
  }

  return drops
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
