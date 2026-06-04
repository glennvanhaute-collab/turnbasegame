// Rare materials consumed at star upgrade gates.
// Dropped from dungeons — never crafted, never purchased.

export const UPGRADE_COMPONENTS = {
  copper_essence:     { name: 'Copper Essence',     tier: 'copper',    color: '#cd7f32', desc: 'A crystallised trace of copper power, drawn from defeated iron constructs.' },
  copper_core:        { name: 'Copper Core',         tier: 'copper',    color: '#cd7f32', desc: 'The dense heart of an ancient copper golem. Rare and irreplaceable.' },
  tin_essence:        { name: 'Tin Essence',         tier: 'tin',       color: '#a8a9ad', desc: 'A brittle sliver of refined tin energy, salvaged from shattered automatons.' },
  tin_core:           { name: 'Tin Core',            tier: 'tin',       color: '#a8a9ad', desc: 'The solid core of a tin sentinel. Harder than the metal it came from.' },
  steel_essence:      { name: 'Steel Essence',       tier: 'steel',     color: '#8899aa', desc: 'Compressed heat and will, extracted from a fallen forge guardian.' },
  steel_core:         { name: 'Steel Core',          tier: 'steel',     color: '#8899aa', desc: 'The indestructible kernel at the heart of a steel colossus.' },
  darksteel_essence:  { name: 'Darksteel Essence',   tier: 'darksteel', color: '#554466', desc: 'A fragment of void-tempered metal, still humming with dark energy.' },
  darksteel_core:     { name: 'Darksteel Core',      tier: 'darksteel', color: '#554466', desc: 'Torn from a Mordaine iron wraith. Cold to the touch. Always.' },
  mithril_essence:    { name: 'Mithril Essence',     tier: 'mithril',   color: '#4499cc', desc: 'A shard of pure mithril resonance, crystallised under starlight.' },
  mithril_core:       { name: 'Mithril Core',        tier: 'mithril',   color: '#4499cc', desc: 'The living heart of a mithril elemental. It hums if you listen closely.' },
  moonsilver_essence: { name: 'Moonsilver Essence',  tier: 'moonsilver',color: '#99ccff', desc: 'Moonsilver in its purest form — it existed before the forge that shaped it.' },
  moonsilver_core:    { name: 'Moonsilver Core',     tier: 'moonsilver',color: '#99ccff', desc: 'Ancient. Warm. You are not the first to hold this, and it knows it.' },
}

// Requirements added at specific star thresholds, beyond the bar cost.
// Stars not listed here have no special requirement.
export const STAR_GATES = {
  5: {
    component:     tier => `${tier}_essence`,
    qty:           1,
    smithingLevel: null,
  },
  6: {
    component:     tier => `${tier}_core`,
    qty:           1,
    smithingLevel: 3,
  },
  // Gates for ★7–10 to be defined during balancing
}
