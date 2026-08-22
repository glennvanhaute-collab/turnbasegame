// Generated skill FX library — 52 skills across 11 elements.
// Each entry describes the visual effect sequence for a skill.
// effectSequence strings reference the useCanvasFx API:
//   brushFx(fromId, toId, rgb)  — slash arc
//   orbFx(fromId, toId, rgb, delayMs)  — projectile
//   sealFx(heroId, rgb)  — rotating runic circle
//   petalsFx(heroId, rgb)  — burst bloom
//   splashFx(heroId, rgb)  — impact burst
//
// These are data — the game engine calls the FX functions directly.
// Per-skill dispatch will key on skill.fxId → SKILL_FX[id].
export const SKILL_FX = {
  // ── Fire ──────────────────────────────────────────────────────────
  'fire-ember-fang': {
    name: 'Ember Fang', element: 'Fire', type: 'single-hit',
    banner: 'EMBER FANG',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(casterId, '210,75,35')
      setTimeout(() => fx.brushFx(casterId, targetId, '255,85,35'), 140)
      setTimeout(() => fx.splashFx(targetId, '255,110,40'), 420)
    },
  },
  'fire-cinder-barrage': {
    name: 'Cinder Barrage', element: 'Fire', type: 'multi-hit mage',
    banner: 'CINDER BARRAGE',
    fx: (fx, casterId, targetId) => {
      fx.orbFx(casterId, targetId, '255,90,30', 0)
      fx.orbFx(casterId, targetId, '255,130,40', 120)
      fx.orbFx(casterId, targetId, '255,175,55', 240)
    },
  },
  'fire-furnace-heart': {
    name: 'Furnace Heart', element: 'Fire', type: 'self-buff',
    banner: 'FURNACE HEART',
    fx: (fx, casterId) => {
      fx.sealFx(casterId, '180,55,30')
      setTimeout(() => fx.splashFx(casterId, '255,125,45'), 160)
    },
  },
  'fire-phoenix-judgment': {
    name: 'Phoenix Judgment', element: 'Fire', type: 'aoe ultimate',
    banner: 'PHOENIX JUDGMENT',
    fx: (fx, casterId, targetIds) => {
      fx.sealFx(casterId, '255,150,55')
      targetIds.forEach((id, i) => fx.orbFx(casterId, id, '255,75,25', 280 + i * 60))
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '255,100,30')), 700)
    },
  },

  // ── Ice ───────────────────────────────────────────────────────────
  'ice-frostbite-cut': {
    name: 'Frostbite Cut', element: 'Ice', type: 'single-hit debuffer',
    banner: 'FROSTBITE CUT',
    fx: (fx, casterId, targetId) => {
      fx.brushFx(casterId, targetId, '115,190,235')
      setTimeout(() => fx.splashFx(targetId, '175,225,255'), 300)
    },
  },
  'ice-icebound-bastion': {
    name: 'Icebound Bastion', element: 'Ice', type: 'team-buff',
    banner: 'ICEBOUND BASTION',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach(id => fx.sealFx(id, '115,185,225'))
    },
  },
  'ice-shatterpoint': {
    name: 'Shatterpoint', element: 'Ice', type: 'execute',
    banner: 'SHATTERPOINT',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '160,220,255')
      setTimeout(() => fx.brushFx(casterId, targetId, '210,240,255'), 180)
      setTimeout(() => fx.splashFx(targetId, '120,200,245'), 440)
    },
  },
  'ice-absolute-winter': {
    name: 'Absolute Winter', element: 'Ice', type: 'aoe ultimate',
    banner: 'ABSOLUTE WINTER',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach(id => fx.sealFx(id, '145,210,245'))
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '205,240,255')), 380)
    },
  },

  // ── Lightning ─────────────────────────────────────────────────────
  'lightning-thunderstep': {
    name: 'Thunderstep', element: 'Lightning', type: 'single-hit burst',
    banner: 'THUNDERSTEP',
    fx: (fx, casterId, targetId) => {
      fx.splashFx(casterId, '245,225,90')
      setTimeout(() => fx.brushFx(casterId, targetId, '255,240,100'), 90)
      setTimeout(() => fx.splashFx(targetId, '255,230,80'), 250)
    },
  },
  'lightning-chain-spark': {
    name: 'Chain Spark', element: 'Lightning', type: 'aoe mage',
    banner: 'CHAIN SPARK',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach((id, i) => fx.orbFx(casterId, id, '250,225,80', i * 90))
    },
  },
  'lightning-overcharge': {
    name: 'Overcharge', element: 'Lightning', type: 'self-buff speed',
    banner: 'OVERCHARGE',
    fx: (fx, casterId) => {
      fx.sealFx(casterId, '255,225,80')
      setTimeout(() => fx.splashFx(casterId, '245,235,120'), 160)
    },
  },
  'lightning-heavens-wrath': {
    name: "Heaven's Wrath", element: 'Lightning', type: 'aoe ultimate',
    banner: "HEAVEN'S WRATH",
    fx: (fx, casterId, targetIds) => {
      fx.sealFx(casterId, '255,225,100')
      setTimeout(() => targetIds.forEach(id => fx.sealFx(id, '210,220,130')), 300)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '255,235,100')), 550)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '255,235,100')), 740)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '255,235,100')), 930)
    },
  },

  // ── Wind ──────────────────────────────────────────────────────────
  'wind-gale-draw': {
    name: 'Gale Draw', element: 'Wind', type: 'double-hit',
    banner: 'GALE DRAW',
    fx: (fx, casterId, targetId) => {
      fx.brushFx(casterId, targetId, '175,220,190')
      setTimeout(() => fx.brushFx(casterId, targetId, '190,235,200'), 200)
    },
  },
  'wind-tailwind-formation': {
    name: 'Tailwind Formation', element: 'Wind', type: 'team-buff speed',
    banner: 'TAILWIND FORMATION',
    fx: (fx, casterId, allyIds) => {
      allyIds.forEach(id => fx.petalsFx(id, '175,230,195'))
    },
  },
  'wind-vacuum-blade': {
    name: 'Vacuum Blade', element: 'Wind', type: 'defense pierce',
    banner: 'VACUUM BLADE',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(casterId, '190,230,205')
      setTimeout(() => fx.brushFx(casterId, targetId, '220,245,225'), 130)
    },
  },
  'wind-thousand-falling-leaves': {
    name: 'Thousand Falling Leaves', element: 'Wind', type: 'aoe ultimate',
    banner: 'THOUSAND FALLING LEAVES',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach(id => fx.petalsFx(id, '185,235,200'))
      setTimeout(() => targetIds.forEach(id => fx.brushFx(casterId, id, '175,220,190')), 280)
      setTimeout(() => targetIds.forEach(id => fx.brushFx(casterId, id, '175,220,190')), 460)
      setTimeout(() => targetIds.forEach(id => fx.brushFx(casterId, id, '175,220,190')), 640)
    },
  },

  // ── Earth ─────────────────────────────────────────────────────────
  'earth-stonebreaker': {
    name: 'Stonebreaker', element: 'Earth', type: 'heavy single-hit',
    banner: 'STONEBREAKER',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(casterId, '145,110,70')
      setTimeout(() => fx.brushFx(casterId, targetId, '180,135,75'), 160)
      setTimeout(() => fx.splashFx(targetId, '170,125,70'), 440)
    },
  },
  'earth-mountain-guard': {
    name: 'Mountain Guard', element: 'Earth', type: 'team-buff tank',
    banner: 'MOUNTAIN GUARD',
    fx: (fx, casterId, allyIds) => {
      allyIds.forEach(id => fx.sealFx(id, '150,125,90'))
    },
  },
  'earth-fault-line': {
    name: 'Fault Line', element: 'Earth', type: 'aoe debuffer',
    banner: 'FAULT LINE',
    fx: (fx, casterId, targetIds) => {
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '175,130,80')), 100)
    },
  },
  'earth-worldshaker': {
    name: 'Worldshaker', element: 'Earth', type: 'aoe ultimate',
    banner: 'WORLDSHAKER',
    fx: (fx, casterId, targetIds) => {
      fx.sealFx(casterId, '180,140,80')
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '140,105,65')), 300)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '205,165,95')), 560)
    },
  },

  // ── Water ─────────────────────────────────────────────────────────
  'water-river-needle': {
    name: 'River Needle', element: 'Water', type: 'precision mage',
    banner: 'RIVER NEEDLE',
    fx: (fx, casterId, targetId) => {
      fx.orbFx(casterId, targetId, '75,165,215', 0)
      setTimeout(() => fx.splashFx(targetId, '100,185,230'), 260)
    },
  },
  'water-cleansing-current': {
    name: 'Cleansing Current', element: 'Water', type: 'team heal',
    banner: 'CLEANSING CURRENT',
    fx: (fx, casterId, allyIds) => {
      allyIds.forEach(id => { fx.petalsFx(id, '90,190,225'); fx.sealFx(id, '90,170,210') })
    },
  },
  'water-undertow-mark': {
    name: 'Undertow Mark', element: 'Water', type: 'debuffer setup',
    banner: 'UNDERTOW MARK',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '65,135,195')
      setTimeout(() => fx.orbFx(casterId, targetId, '90,175,225', 0), 180)
    },
  },
  'water-tidal-dominion': {
    name: 'Tidal Dominion', element: 'Water', type: 'aoe ultimate',
    banner: 'TIDAL DOMINION',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach(id => { fx.orbFx(casterId, id, '60,145,205', 0); fx.orbFx(casterId, id, '95,185,225', 120) })
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '95,180,225')), 430)
    },
  },

  // ── Nature ────────────────────────────────────────────────────────
  'nature-thorn-whip': {
    name: 'Thorn Whip', element: 'Nature', type: 'dot applicator',
    banner: 'THORN WHIP',
    fx: (fx, casterId, targetId) => {
      fx.petalsFx(casterId, '90,155,80')
      setTimeout(() => fx.brushFx(casterId, targetId, '80,145,75'), 100)
      setTimeout(() => fx.splashFx(targetId, '100,160,85'), 350)
    },
  },
  'nature-grove-mend': {
    name: 'Grove Mend', element: 'Nature', type: 'team heal',
    banner: 'GROVE MEND',
    fx: (fx, casterId, allyIds) => {
      allyIds.forEach(id => fx.petalsFx(id, '110,200,110'))
    },
  },
  'nature-wildheart-canopy': {
    name: 'Wildheart Canopy', element: 'Nature', type: 'team-buff shield',
    banner: 'WILDHEART CANOPY',
    fx: (fx, casterId, allyIds) => {
      allyIds.forEach(id => { fx.sealFx(id, '85,135,75'); fx.petalsFx(id, '100,175,90') })
    },
  },
  'nature-verdant-rebirth': {
    name: 'Verdant Rebirth', element: 'Nature', type: 'aoe ultimate heal',
    banner: 'VERDANT REBIRTH',
    fx: (fx, casterId, allyIds, targetIds) => {
      allyIds.forEach(id => fx.petalsFx(id, '120,210,110'))
      setTimeout(() => targetIds.forEach(id => { fx.petalsFx(id, '90,150,80'); fx.splashFx(id, '90,150,80') }), 480)
    },
  },

  // ── Light ─────────────────────────────────────────────────────────
  'light-sunblade': {
    name: 'Sunblade', element: 'Light', type: 'single-hit striker',
    banner: 'SUNBLADE',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(casterId, '255,220,135')
      setTimeout(() => fx.brushFx(casterId, targetId, '255,235,175'), 140)
      setTimeout(() => fx.splashFx(targetId, '255,235,180'), 400)
    },
  },
  'light-radiant-covenant': {
    name: 'Radiant Covenant', element: 'Light', type: 'team heal buff',
    banner: 'RADIANT COVENANT',
    fx: (fx, casterId, allyIds) => {
      allyIds.forEach(id => fx.sealFx(id, '245,215,145'))
    },
  },
  'light-beacon-brand': {
    name: 'Beacon Brand', element: 'Light', type: 'debuffer mark',
    banner: 'BEACON BRAND',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '255,225,145')
      setTimeout(() => fx.splashFx(targetId, '255,240,190'), 200)
    },
  },
  'light-dawn-ascendant': {
    name: 'Dawn Ascendant', element: 'Light', type: 'aoe ultimate',
    banner: 'DAWN ASCENDANT',
    fx: (fx, casterId, allyIds, targetIds) => {
      allyIds.forEach(id => fx.sealFx(id, '255,225,150'))
      setTimeout(() => targetIds.forEach(id => fx.orbFx(casterId, id, '255,235,175', 0)), 480)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '255,245,210')), 780)
    },
  },

  // ── Dark ──────────────────────────────────────────────────────────
  'dark-shadow-rend': {
    name: 'Shadow Rend', element: 'Dark', type: 'single-hit debuffer',
    banner: 'SHADOW REND',
    fx: (fx, casterId, targetId) => {
      fx.brushFx(casterId, targetId, '85,55,105')
      setTimeout(() => fx.splashFx(targetId, '65,40,90'), 260)
    },
  },
  'dark-black-omen': {
    name: 'Black Omen', element: 'Dark', type: 'setup debuffer',
    banner: 'BLACK OMEN',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '85,45,105')
      setTimeout(() => fx.splashFx(targetId, '70,35,95'), 220)
    },
  },
  'dark-night-feast': {
    name: 'Night Feast', element: 'Dark', type: 'drain lifesteal',
    banner: 'NIGHT FEAST',
    fx: (fx, casterId, targetId) => {
      fx.brushFx(casterId, targetId, '90,45,100')
      setTimeout(() => fx.orbFx(targetId, casterId, '105,50,110', 0), 360)
    },
  },
  'dark-eclipse-sovereign': {
    name: 'Eclipse Sovereign', element: 'Dark', type: 'aoe ultimate',
    banner: 'ECLIPSE SOVEREIGN',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach(id => fx.sealFx(id, '75,40,95'))
      setTimeout(() => targetIds.forEach(id => fx.orbFx(casterId, id, '100,45,110', Math.random() * 150)), 350)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '65,30,85')), 700)
    },
  },

  // ── Arcane ────────────────────────────────────────────────────────
  'arcane-sigil-lance': {
    name: 'Sigil Lance', element: 'Arcane', type: 'single-hit mage',
    banner: 'SIGIL LANCE',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(casterId, '90,110,210')
      setTimeout(() => fx.orbFx(casterId, targetId, '105,125,235', 0), 180)
      setTimeout(() => fx.splashFx(targetId, '115,130,240'), 460)
    },
  },
  'arcane-mirror-ward': {
    name: 'Mirror Ward', element: 'Arcane', type: 'team-buff shield',
    banner: 'MIRROR WARD',
    fx: (fx, casterId, allyIds) => {
      allyIds.forEach(id => fx.sealFx(id, '95,115,215'))
    },
  },
  'arcane-runic-collapse': {
    name: 'Runic Collapse', element: 'Arcane', type: 'double-hit burst',
    banner: 'RUNIC COLLAPSE',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '105,120,225')
      setTimeout(() => fx.sealFx(targetId, '165,95,220'), 160)
      setTimeout(() => fx.splashFx(targetId, '125,95,230'), 320)
      setTimeout(() => fx.splashFx(targetId, '205,150,255'), 470)
    },
  },
  'arcane-astral-convergence': {
    name: 'Astral Convergence', element: 'Arcane', type: 'aoe ultimate barrage',
    banner: 'ASTRAL CONVERGENCE',
    fx: (fx, casterId, targetIds) => {
      fx.sealFx(casterId, '120,110,235')
      targetIds.forEach(id => {
        fx.sealFx(id, '110,95,225')
        fx.orbFx(casterId, id, '110,130,245', 260)
        fx.orbFx(casterId, id, '175,95,235', 360)
        fx.orbFx(casterId, id, '95,170,245', 460)
      })
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '150,120,245')), 730)
    },
  },

  // ── Poison ────────────────────────────────────────────────────────
  'poison-venom-needle': {
    name: 'Venom Needle', element: 'Poison', type: 'dot applicator',
    banner: 'VENOM NEEDLE',
    fx: (fx, casterId, targetId) => {
      fx.orbFx(casterId, targetId, '105,175,70', 0)
      setTimeout(() => fx.splashFx(targetId, '125,190,75'), 240)
    },
  },
  'poison-toxic-bloom': {
    name: 'Toxic Bloom', element: 'Poison', type: 'aoe dot',
    banner: 'TOXIC BLOOM',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach(id => fx.petalsFx(id, '110,175,65'))
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '115,170,65')), 160)
    },
  },
  'poison-antivenom-rite': {
    name: 'Antivenom Rite', element: 'Poison', type: 'team heal buff',
    banner: 'ANTIVENOM RITE',
    fx: (fx, casterId, allyIds) => {
      fx.sealFx(casterId, '125,175,80')
      fx.petalsFx(casterId, '130,190,85')
    },
  },
  'poison-serpent-garden': {
    name: 'Serpent Garden', element: 'Poison', type: 'aoe ultimate dot',
    banner: 'SERPENT GARDEN',
    fx: (fx, casterId, targetIds) => {
      targetIds.forEach(id => { fx.sealFx(id, '95,150,65'); fx.petalsFx(id, '110,165,65') })
      setTimeout(() => targetIds.forEach(id => fx.orbFx(casterId, id, '125,185,70', Math.random() * 120)), 320)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '105,165,60')), 600)
    },
  },

  // ── Blood ─────────────────────────────────────────────────────────
  'blood-bloodletter': {
    name: 'Bloodletter', element: 'Blood', type: 'dot applicator',
    banner: 'BLOODLETTER',
    fx: (fx, casterId, targetId) => {
      fx.brushFx(casterId, targetId, '170,35,55')
      setTimeout(() => fx.splashFx(targetId, '190,45,60'), 250)
    },
  },
  'blood-sanguine-pact': {
    name: 'Sanguine Pact', element: 'Blood', type: 'self-buff shield speed',
    banner: 'SANGUINE PACT',
    fx: (fx, casterId) => {
      fx.sealFx(casterId, '160,35,55')
      setTimeout(() => fx.splashFx(casterId, '195,45,65'), 180)
    },
  },
  'blood-crimson-tax': {
    name: 'Crimson Tax', element: 'Blood', type: 'drain marked-finisher',
    banner: 'CRIMSON TAX',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '175,40,60')
      setTimeout(() => fx.brushFx(casterId, targetId, '210,45,65'), 120)
      setTimeout(() => fx.orbFx(targetId, casterId, '165,35,55', 0), 380)
    },
  },
  'blood-crimson-ascension': {
    name: 'Crimson Ascension', element: 'Blood', type: 'aoe drain ultimate',
    banner: 'CRIMSON ASCENSION',
    fx: (fx, casterId, targetIds) => {
      fx.sealFx(casterId, '180,35,55')
      setTimeout(() => targetIds.forEach(id => fx.orbFx(id, casterId, '155,30,50', Math.random() * 120)), 250)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '205,45,65')), 530)
    },
  },

  // ── Void ──────────────────────────────────────────────────────────
  'void-rift-cut': {
    name: 'Rift Cut', element: 'Void', type: 'defense ignore single-hit',
    banner: 'RIFT CUT',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '55,45,90')
      setTimeout(() => fx.brushFx(casterId, targetId, '100,75,150'), 110)
      setTimeout(() => fx.splashFx(targetId, '70,55,110'), 320)
    },
  },
  'void-null-seal': {
    name: 'Null Seal', element: 'Void', type: 'debuffer setup',
    banner: 'NULL SEAL',
    fx: (fx, casterId, targetId) => {
      fx.sealFx(targetId, '65,55,115')
      setTimeout(() => fx.splashFx(targetId, '80,60,125'), 220)
    },
  },
  'void-abyssal-shelter': {
    name: 'Abyssal Shelter', element: 'Void', type: 'self-buff tank',
    banner: 'ABYSSAL SHELTER',
    fx: (fx, casterId) => {
      fx.sealFx(casterId, '60,50,105')
      setTimeout(() => fx.sealFx(casterId, '100,75,145'), 120)
    },
  },
  'void-event-horizon': {
    name: 'Event Horizon', element: 'Void', type: 'aoe execute ultimate',
    banner: 'EVENT HORIZON',
    fx: (fx, casterId, targetIds) => {
      fx.sealFx(casterId, '75,55,125')
      targetIds.forEach(id => {
        fx.sealFx(id, '55,45,100')
        fx.orbFx(id, casterId, '80,60,130', 260 + Math.random() * 140)
      })
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '95,70,145')), 680)
      setTimeout(() => targetIds.forEach(id => fx.splashFx(id, '45,35,80')), 860)
    },
  },
}
