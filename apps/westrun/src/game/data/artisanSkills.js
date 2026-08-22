export const ARTISAN = {
  blacksmithing:  { id: 'blacksmithing',  name: 'Blacksmithing',  icon: '⚒',  color: '#cd7f32', desc: 'Forge and repair metal weapons and armor' },
  herbalism:      { id: 'herbalism',      name: 'Herbalism',      icon: '🌿', color: '#4dff88', desc: 'Gather and cultivate medicinal herbs' },
  tailoring:      { id: 'tailoring',      name: 'Tailoring',      icon: '🧵', color: '#88ccff', desc: 'Craft and enchant cloth garments and robes' },
  leatherworking: { id: 'leatherworking', name: 'Leatherworking', icon: '🐾', color: '#b87333', desc: 'Work hides and leather into armor and gear' },
  woodworking:    { id: 'woodworking',    name: 'Woodworking',    icon: '🪵', color: '#6bba4a', desc: 'Carve bows and staves from timber' },
  apothecary:     { id: 'apothecary',     name: 'Apothecary',     icon: '⚗',  color: '#cc44ff', desc: 'Mix remedies, elixirs, and potions' },
}

export const ARTISAN_LIST = Object.values(ARTISAN)

// How many artisan slots a rarity tier allows
export const ARTISAN_SLOTS = {
  Common:    1,
  Uncommon:  1,
  Rare:      1,
  Epic:      1,
  Legendary: 2,
  Mythical:  2,
  Ancient:   2,
}
