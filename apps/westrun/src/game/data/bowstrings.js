// Bowstrings — crafted from cloth at the Tailoring bench. One per bow tier.
// clothId: the cloth consumed; clothCost: bolts per string

export const BOWSTRINGS = {
  cotton:      { id: 'cotton',      name: 'Cotton Bowstring',    color: '#f0e0c0', clothId: 'cotton',      clothCost: 1, bowTier: 'pine'       },
  wool:        { id: 'wool',        name: 'Wool Bowstring',      color: '#d4c4a8', clothId: 'wool',        clothCost: 1, bowTier: 'oak'        },
  silkweave:   { id: 'silkweave',   name: 'Silk Bowstring',      color: '#e8d8ff', clothId: 'silkweave',   clothCost: 1, bowTier: 'yew'        },
  shadowcloth: { id: 'shadowcloth', name: 'Shadow Bowstring',    color: '#9060c0', clothId: 'shadowcloth', clothCost: 1, bowTier: 'ashwood'    },
  starweave:   { id: 'starweave',   name: 'Starweave Bowstring', color: '#88ccff', clothId: 'starweave',   clothCost: 1, bowTier: 'ironwood'   },
  moonweave:   { id: 'moonweave',   name: 'Moonweave String',    color: '#bbeeff', clothId: 'moonweave',   clothCost: 1, bowTier: 'dragonwood' },
}

export const BOWSTRING_LIST = Object.values(BOWSTRINGS)
