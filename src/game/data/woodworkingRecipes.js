import { WOODS } from './woods.js'

// Woodworking now produces planks and bowstrings only.
// Bows, staves, and other weapons have moved to the Weapon Forge (useWeaponStore).
// This file is kept for the WOOD_RECIPE_TIERS structure used by WoodworkingView.

export const WOODWORKING_RECIPES = []

export const WOOD_RECIPE_TIERS = [
  { id: 'pine',       name: 'Pine',       color: WOODS.pine.color,       woodworkingLevel: 1,  recipes: [] },
  { id: 'oak',        name: 'Oak',        color: WOODS.oak.color,        woodworkingLevel: 3,  recipes: [] },
  { id: 'yew',        name: 'Yew',        color: WOODS.yew.color,        woodworkingLevel: 6,  recipes: [] },
  { id: 'ashwood',    name: 'Ashwood',    color: WOODS.ashwood.color,    woodworkingLevel: 10, recipes: [] },
  { id: 'ironwood',   name: 'Ironwood',   color: WOODS.ironwood.color,   woodworkingLevel: 15, recipes: [] },
  { id: 'dragonwood', name: 'Dragonwood', color: WOODS.dragonwood.color, woodworkingLevel: 20, recipes: [] },
]
