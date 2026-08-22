// Raw materials for Woodworking — gathered from forests/exploration
// Each tier aligns with the blacksmith tier for level gates

export const WOODS = {
  pine:       { id: 'pine',       name: 'Pine Logs',       color: '#c8a87a', desc: 'Common softwood. Plentiful in lowland forests.' },
  oak:        { id: 'oak',        name: 'Oak Logs',        color: '#a0784a', desc: 'Sturdy hardwood favoured by village bowyers.' },
  yew:        { id: 'yew',        name: 'Yew Logs',        color: '#7a5a38', desc: 'Dense and flexible. The traditional war bow wood.' },
  ashwood:    { id: 'ashwood',    name: 'Ashwood Logs',    color: '#8ab4c8', desc: 'Pale and hard. Found in the highland groves.' },
  ironwood:   { id: 'ironwood',   name: 'Ironwood Logs',   color: '#5a7080', desc: 'Named for the ring it makes when struck. Unnaturally heavy.' },
  dragonwood: { id: 'dragonwood', name: 'Dragonwood Logs', color: '#9a4444', desc: 'Ancient wood scorched by dragon fire long ago. Still warm to the touch.' },
}

export const WOOD_LIST = Object.values(WOODS)
