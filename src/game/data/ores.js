export const ORES = {
  copper:      { id: 'copper',      name: 'Copper Ore',      color: '#cd7f32', tier: 1 },
  tin:         { id: 'tin',         name: 'Tin Ore',          color: '#9ea8a8', tier: 2 },
  steel:       { id: 'steel',       name: 'Steel Ore',        color: '#6b7c85', tier: 3 },
  darksteel:   { id: 'darksteel',   name: 'Darksteel Ore',    color: '#7c5cbf', tier: 4 },
  mithril:     { id: 'mithril',     name: 'Mithril Ore',      color: '#5bacd4', tier: 5 },
}

export const ORE_LIST = Object.values(ORES)

// Returns array of { oreId, amount } based on dungeon difficulty.
// Each dungeon tier maps to its matching ore tier — no gold, ore is the reward.
export function rollOreDrops(difficulty) {
  const drops = []
  const d = difficulty?.toLowerCase() ?? 'easy'

  if (d === 'easy') {
    drops.push({ oreId: 'copper', amount: rand(2, 5) })
    if (Math.random() < 0.65) drops.push({ oreId: 'tin', amount: rand(1, 3) })
  } else if (d === 'normal' || d === 'medium') {
    drops.push({ oreId: 'steel', amount: rand(2, 4) })
    if (Math.random() < 0.50) drops.push({ oreId: 'steel', amount: rand(1, 2) })
  } else if (d === 'hard') {
    drops.push({ oreId: 'darksteel', amount: rand(2, 4) })
    if (Math.random() < 0.50) drops.push({ oreId: 'darksteel', amount: rand(1, 2) })
  } else if (d === 'nightmare') {
    drops.push({ oreId: 'mithril', amount: rand(2, 4) })
    if (Math.random() < 0.60) drops.push({ oreId: 'mithril', amount: rand(1, 2) })
  }

  return drops
}

// Training grounds ore drops — capped at steel, scales with encounter difficulty.
export function rollTrainingOreDrops(difficulty) {
  const drops = []
  const d = difficulty?.toLowerCase() ?? 'easy'

  if (d === 'easy') {
    if (Math.random() < 0.60) drops.push({ oreId: 'copper', amount: rand(1, 2) })
    if (Math.random() < 0.30) drops.push({ oreId: 'tin',    amount: rand(1, 2) })
  } else if (d === 'normal') {
    if (Math.random() < 0.85) drops.push({ oreId: 'copper', amount: rand(2, 4) })
    if (Math.random() < 0.55) drops.push({ oreId: 'tin',    amount: rand(1, 3) })
  } else if (d === 'hard') {
    if (Math.random() < 0.75) drops.push({ oreId: 'copper', amount: rand(2, 3) })
    if (Math.random() < 0.70) drops.push({ oreId: 'tin',    amount: rand(2, 4) })
    if (Math.random() < 0.38) drops.push({ oreId: 'steel',  amount: rand(1, 2) })
  } else if (d === 'nightmare') {
    if (Math.random() < 0.70) drops.push({ oreId: 'tin',       amount: rand(2, 3) })
    if (Math.random() < 0.75) drops.push({ oreId: 'steel',     amount: rand(2, 3) })
    if (Math.random() < 0.20) drops.push({ oreId: 'darksteel', amount: 1 })
  }

  return drops
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
