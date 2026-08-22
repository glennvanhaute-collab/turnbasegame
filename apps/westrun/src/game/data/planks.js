// Planks — milled from logs at the woodworking bench. Intermediate material for bows and furniture.
// logCost: logs consumed per plank

export const PLANKS = {
  pine:       { id: 'pine',       name: 'Pine Planks',       color: '#c8a87a', logId: 'pine',       logCost: 2 },
  oak:        { id: 'oak',        name: 'Oak Planks',        color: '#a0784a', logId: 'oak',        logCost: 2 },
  yew:        { id: 'yew',        name: 'Yew Planks',        color: '#7a5a38', logId: 'yew',        logCost: 3 },
  ashwood:    { id: 'ashwood',    name: 'Ashwood Planks',    color: '#8ab4c8', logId: 'ashwood',    logCost: 3 },
  ironwood:   { id: 'ironwood',   name: 'Ironwood Planks',   color: '#5a7080', logId: 'ironwood',   logCost: 4 },
  dragonwood: { id: 'dragonwood', name: 'Dragonwood Planks', color: '#9a4444', logId: 'dragonwood', logCost: 2 },
}

export const PLANK_LIST = Object.values(PLANKS)
