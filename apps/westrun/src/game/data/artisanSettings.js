// Central tuning file for all artisan timers (seconds)
// Edit values here to adjust pacing across Forge, Tannery, Loom, and Gathering Zone.

// ── Forge smelting ──────────────────────────────────────────────────────────
export const SMELT_TIMES = {
  copper:     3,
  tin:        5,
  steel:      9,
  darksteel:  15,
  mithril:    25,
  moonsilver: 40,
  vaultmetal: 28,
  runeite:    32,
}

// ── Tailoring weaving ────────────────────────────────────────────────────────
export const WEAVE_TIMES = {
  cotton:      3,
  wool:        5,
  silkweave:   9,
  shadowcloth: 15,
  starweave:   25,
  moonweave:   40,
}

// ── Leatherworking tanning ───────────────────────────────────────────────────
export const TAN_TIMES = {
  rough:     3,
  thick:     5,
  hardened:  9,
  shadow:    15,
  celestial: 25,
  moonscale: 40,
}

// ── Gathering Zone mission durations ────────────────────────────────────────
// Hunt missions
export const GATHER_DURATIONS = {
  roughlands_hunt:    10,
  ironwood_chase:     60,
  ember_peaks_hunt:   600,
  shadow_wilds_hunt:  1800,
  // Forage missions
  cotton_fields:      10,
  shepherds_meadow:   60,
  silkworm_grove:     600,
  umbral_hollow:      1800,
  // Lumber missions
  pine_forest:        10,
  oak_highlands:      60,
  yew_reaches:        600,
  pale_ashwood:       1800,
  ironwood_depths:    3600,
  dragons_scar:       7200,
}
