import { Hero, Faction, Affinity, Rarity } from '../Hero.js'
import { Skill, SkillEffect, EffectType, TargetType, StatusEffect } from '../Skill.js'

// ── Skill helpers ────────────────────────────────────────────────────
function dmg(multi)   { return new SkillEffect({ type: EffectType.DAMAGE, multiplier: multi }) }
function aoe(multi)   { return new SkillEffect({ type: EffectType.DAMAGE, multiplier: multi }) }
function debuff(se, chance = 0.75, dur = 2) {
  return new SkillEffect({ type: EffectType.DEBUFF, statusEffect: se, statusChance: chance, statusDuration: dur })
}
function buff(se, dur = 2) {
  return new SkillEffect({ type: EffectType.BUFF, statusEffect: se, statusDuration: dur })
}
function heal(pct) { return new SkillEffect({ type: EffectType.HEAL, healPercent: pct }) }

// ── Garrison data per tier ────────────────────────────────────────────
// garrisonHp = total Phase 1 HP pool split across 3 lanes
// garrisonAtk = damage dealt to warband per tick (all lanes combined)
// warbandBaseHp = warband starting HP for Phase 1
export const SIEGE_TIER_DATA = {
  skirmish: {
    garrisonHp:    3000,
    garrisonAtk:   18,
    warbandBaseHp: 6000,
    laneGarrison: {
      west: ['Militia ×3', 'Archers ×2'],
      gate: ['Militia ×4', 'Archers ×2'],
      east: ['Militia ×3'],
    },
  },
  siege: {
    garrisonHp:    8000,
    garrisonAtk:   35,
    warbandBaseHp: 10000,
    laneGarrison: {
      west: ['Veteran soldiers ×4', 'Archers ×2'],
      gate: ['Veteran soldiers ×4', 'Tower archers ×4', 'Ballista ×1'],
      east: ['Veteran soldiers ×4', 'Archers ×2'],
    },
  },
  assault: {
    garrisonHp:    18000,
    garrisonAtk:   65,
    warbandBaseHp: 14000,
    laneGarrison: {
      west: ['Elite guard ×4', 'Battlemage ×1'],
      gate: ['Elite guard ×4', 'Artillery ×2', 'Battlemage ×2'],
      east: ['Elite guard ×4', 'Battlemage ×1'],
    },
  },
  breach: {
    garrisonHp:    40000,
    garrisonAtk:   110,
    warbandBaseHp: 18000,
    laneGarrison: {
      west: ['Full garrison ×6', 'Construct ×1'],
      gate: ['Full garrison ×8', 'Arcane construct ×2', 'The Commander'],
      east: ['Full garrison ×6', 'Construct ×1'],
    },
  },
}

// ── House Aldric commanders (Force) ──────────────────────────────────
function buildAldricSkirmish() {
  return new Hero({
    id: 'aldric_captain_valek', name: 'Captain Valek', isPlayer: false,
    faction: Faction.ALDRIC, rarity: Rarity.RARE, affinity: Affinity.FORCE,
    baseHp: 22000, baseAtk: 2200, baseDef: 800, baseSpd: 95,
    skills: [
      new Skill({ id: 'iron_strike', name: 'Iron Strike', description: '280% ATK.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(2.8)] }),
      new Skill({ id: 'shield_wall', name: 'Shield Wall', description: 'Raises defence for 2 turns.', cooldown: 3, targetType: TargetType.SELF, effects: [buff(StatusEffect.INCREASE_DEF, 2)] }),
      new Skill({ id: 'charge', name: 'Charge', description: '350% ATK. Chance to stun.', cooldown: 4, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.5), debuff(StatusEffect.STUN, 0.45, 1)] }),
    ],
  })
}

function buildAldricSiege() {
  return new Hero({
    id: 'aldric_castellan_halvard', name: 'Castellan Halvard', isPlayer: false,
    faction: Faction.ALDRIC, rarity: Rarity.EPIC, affinity: Affinity.FORCE,
    baseHp: 48000, baseAtk: 3800, baseDef: 1400, baseSpd: 88,
    skills: [
      new Skill({ id: 'wall_break', name: 'Wall Breaker', description: '310% ATK.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.1)] }),
      new Skill({ id: 'iron_bastion', name: 'Iron Bastion', description: 'DEF up + continuous heal for 2 turns.', cooldown: 3, targetType: TargetType.SELF, effects: [buff(StatusEffect.INCREASE_DEF, 2), buff(StatusEffect.CONTINUOUS_HEAL, 2)] }),
      new Skill({ id: 'aldric_volley', name: 'Tower Volley', description: 'AOE 200% ATK. All enemies weaken.', cooldown: 4, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.0), debuff(StatusEffect.DECREASE_DEF, 0.70, 2)] }),
    ],
  })
}

function buildAldricAssault() {
  return new Hero({
    id: 'aldric_marshal_theron', name: 'Shield-Marshal Theron', isPlayer: false,
    faction: Faction.ALDRIC, rarity: Rarity.LEGENDARY, affinity: Affinity.FORCE,
    baseHp: 85000, baseAtk: 6500, baseDef: 2400, baseSpd: 100,
    skills: [
      new Skill({ id: 'iron_reckoning', name: 'Iron Reckoning', description: '340% ATK. Provokes on hit.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.4)] }),
      new Skill({ id: 'theron_bulwark', name: 'The Bulwark', description: 'Full immunity and +DEF for 2 turns.', cooldown: 4, targetType: TargetType.SELF, effects: [buff(StatusEffect.IMMUNITY, 2), buff(StatusEffect.INCREASE_DEF, 2)] }),
      new Skill({ id: 'aldric_judgement', name: 'Aldric Judgement', description: 'AOE 260% ATK. -ATK all enemies 2 turns.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.6), debuff(StatusEffect.DECREASE_ATK, 0.80, 2)] }),
    ],
  })
}

function buildAldricBreach() {
  return new Hero({
    id: 'aldric_lord_commander', name: 'Lord-Commander Aldric III', isPlayer: false,
    faction: Faction.ALDRIC, rarity: Rarity.MYTHICAL, affinity: Affinity.FORCE,
    baseHp: 160000, baseAtk: 12000, baseDef: 3800, baseSpd: 110,
    critRate: 0.35, critDmg: 0.80, resistance: 0.55,
    skills: [
      new Skill({ id: 'conqueror_blow', name: 'Conqueror\'s Blow', description: '380% ATK. Ignores defence.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.8)] }),
      new Skill({ id: 'sovereign_will', name: 'Sovereign Will', description: 'Heals 20% HP. +ATK, +DEF for 3 turns.', cooldown: 3, targetType: TargetType.SELF, effects: [heal(0.20), buff(StatusEffect.INCREASE_ATK, 3), buff(StatusEffect.INCREASE_DEF, 3)] }),
      new Skill({ id: 'iron_dominion', name: 'Iron Dominion', description: 'AOE 300% ATK. Burns all enemies 3 turns.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(3.0), debuff(StatusEffect.BURN, 0.90, 3)] }),
    ],
  })
}

// ── House Valdris commanders (Magic) ──────────────────────────────────
function buildValdrisSkirmish() {
  return new Hero({
    id: 'valdris_archivist_pellwyn', name: 'Archivist Pellwyn', isPlayer: false,
    faction: Faction.VALDRIS, rarity: Rarity.RARE, affinity: Affinity.MAGIC,
    baseHp: 18000, baseAtk: 2600, baseDef: 500, baseSpd: 115,
    skills: [
      new Skill({ id: 'arcane_bolt', name: 'Arcane Bolt', description: '260% ATK magic damage.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(2.6)] }),
      new Skill({ id: 'sigil_burn', name: 'Sigil Burn', description: 'Burns one enemy for 3 turns.', cooldown: 3, targetType: TargetType.SINGLE_ENEMY, effects: [debuff(StatusEffect.BURN, 0.85, 3)] }),
      new Skill({ id: 'void_leech', name: 'Void Leech', description: '300% ATK. Poisons target.', cooldown: 4, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.0), debuff(StatusEffect.POISON, 0.80, 3)] }),
    ],
  })
}

function buildValdrisSiege() {
  return new Hero({
    id: 'valdris_cipher_toriel', name: 'Cipher Mage Toriel', isPlayer: false,
    faction: Faction.VALDRIS, rarity: Rarity.EPIC, affinity: Affinity.MAGIC,
    baseHp: 42000, baseAtk: 4400, baseDef: 900, baseSpd: 120,
    skills: [
      new Skill({ id: 'rift_pulse', name: 'Rift Pulse', description: '290% ATK to one enemy.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(2.9)] }),
      new Skill({ id: 'mirror_field', name: 'Mirror Field', description: 'AOE 180% ATK. -SPD all enemies.', cooldown: 3, targetType: TargetType.ALL_ENEMIES, effects: [aoe(1.8), debuff(StatusEffect.DECREASE_SPD, 0.75, 2)] }),
      new Skill({ id: 'arcane_cascade', name: 'Arcane Cascade', description: 'AOE 240% ATK. Weaken all.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.4), debuff(StatusEffect.WEAKEN, 0.80, 2)] }),
    ],
  })
}

function buildValdrisAssault() {
  return new Hero({
    id: 'valdris_grand_voss', name: 'Grand Arcanist Voss', isPlayer: false,
    faction: Faction.VALDRIS, rarity: Rarity.LEGENDARY, affinity: Affinity.MAGIC,
    baseHp: 78000, baseAtk: 7200, baseDef: 1600, baseSpd: 125,
    critRate: 0.30, critDmg: 0.70,
    skills: [
      new Skill({ id: 'void_lance', name: 'Void Lance', description: '330% ATK. Freezes target.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.3), debuff(StatusEffect.FREEZE, 0.50, 1)] }),
      new Skill({ id: 'arcane_barrier', name: 'Arcane Barrier', description: 'Immunity + +ATK for 2 turns.', cooldown: 4, targetType: TargetType.SELF, effects: [buff(StatusEffect.IMMUNITY, 2), buff(StatusEffect.INCREASE_ATK, 2)] }),
      new Skill({ id: 'reality_fracture', name: 'Reality Fracture', description: 'AOE 280% ATK. Poisons + freezes all.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.8), debuff(StatusEffect.POISON, 0.85, 3), debuff(StatusEffect.FREEZE, 0.40, 1)] }),
    ],
  })
}

function buildValdrisBreach() {
  return new Hero({
    id: 'valdris_unbound', name: 'Lord Valdris the Unbound', isPlayer: false,
    faction: Faction.VALDRIS, rarity: Rarity.MYTHICAL, affinity: Affinity.MAGIC,
    baseHp: 145000, baseAtk: 13500, baseDef: 2800, baseSpd: 135,
    critRate: 0.45, critDmg: 0.90, resistance: 0.50,
    skills: [
      new Skill({ id: 'void_rend', name: 'Void Rend', description: '400% ATK. Chance to freeze.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(4.0), debuff(StatusEffect.FREEZE, 0.55, 1)] }),
      new Skill({ id: 'mirror_collapse', name: 'Mirror Collapse', description: 'Heals 25% HP. +ATK for 3 turns.', cooldown: 3, targetType: TargetType.SELF, effects: [heal(0.25), buff(StatusEffect.INCREASE_ATK, 3)] }),
      new Skill({ id: 'unbound_singularity', name: 'Unbound Singularity', description: 'AOE 320% ATK. Burns + poisons all 3 turns.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(3.2), debuff(StatusEffect.BURN, 0.90, 3), debuff(StatusEffect.POISON, 0.85, 3)] }),
    ],
  })
}

// ── House Caelwyn commanders (Spirit) ─────────────────────────────────
function buildCaelwynSkirmish() {
  return new Hero({
    id: 'caelwyn_warden_mira', name: 'Warden Mira', isPlayer: false,
    faction: Faction.CAELWYN, rarity: Rarity.RARE, affinity: Affinity.SPIRIT,
    baseHp: 20000, baseAtk: 2400, baseDef: 700, baseSpd: 108,
    skills: [
      new Skill({ id: 'thorn_lash', name: 'Thorn Lash', description: '270% ATK. Poisons target.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(2.7), debuff(StatusEffect.POISON, 0.65, 2)] }),
      new Skill({ id: 'root_snare', name: 'Root Snare', description: 'Stuns one enemy for 1 turn.', cooldown: 3, targetType: TargetType.SINGLE_ENEMY, effects: [debuff(StatusEffect.STUN, 0.70, 1)] }),
      new Skill({ id: 'grove_surge', name: 'Grove Surge', description: '320% ATK. Heals self 15%.', cooldown: 4, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.2), heal(0.15)] }),
    ],
  })
}

function buildCaelwynSiege() {
  return new Hero({
    id: 'caelwyn_thornwarden_orvyn', name: 'Thornwarden Orvyn', isPlayer: false,
    faction: Faction.CAELWYN, rarity: Rarity.EPIC, affinity: Affinity.SPIRIT,
    baseHp: 44000, baseAtk: 4200, baseDef: 1100, baseSpd: 112,
    skills: [
      new Skill({ id: 'verdant_strike', name: 'Verdant Strike', description: '300% ATK.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.0)] }),
      new Skill({ id: 'beast_surge', name: 'Beast Surge', description: 'AOE 190% ATK. Slows all.', cooldown: 3, targetType: TargetType.ALL_ENEMIES, effects: [aoe(1.9), debuff(StatusEffect.DECREASE_SPD, 0.70, 2)] }),
      new Skill({ id: 'thornwood_ritual', name: 'Thornwood Ritual', description: 'Heals 30% HP. Continuous heal for 3 turns.', cooldown: 5, targetType: TargetType.SELF, effects: [heal(0.30), buff(StatusEffect.CONTINUOUS_HEAL, 3)] }),
    ],
  })
}

function buildCaelwynAssault() {
  return new Hero({
    id: 'caelwyn_high_druid_sylvenna', name: 'High Druid Sylvenna', isPlayer: false,
    faction: Faction.CAELWYN, rarity: Rarity.LEGENDARY, affinity: Affinity.SPIRIT,
    baseHp: 80000, baseAtk: 6800, baseDef: 1800, baseSpd: 118,
    critRate: 0.25, critDmg: 0.60,
    skills: [
      new Skill({ id: 'spirit_rend', name: 'Spirit Rend', description: '350% ATK. Weakens target.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.5), debuff(StatusEffect.WEAKEN, 0.75, 2)] }),
      new Skill({ id: 'coven_veil', name: 'Coven Veil', description: 'Immunity for 2 turns. Heals 20%.', cooldown: 4, targetType: TargetType.SELF, effects: [buff(StatusEffect.IMMUNITY, 2), heal(0.20)] }),
      new Skill({ id: 'wild_reckoning', name: 'Wild Reckoning', description: 'AOE 270% ATK. Poisons all 3 turns.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.7), debuff(StatusEffect.POISON, 0.90, 3)] }),
    ],
  })
}

function buildCaelwynBreach() {
  return new Hero({
    id: 'caelwyn_fractured_one', name: 'The Fractured One', isPlayer: false,
    faction: Faction.CAELWYN, rarity: Rarity.MYTHICAL, affinity: Affinity.SPIRIT,
    baseHp: 155000, baseAtk: 11500, baseDef: 3200, baseSpd: 128,
    critRate: 0.38, critDmg: 0.85, resistance: 0.50,
    skills: [
      new Skill({ id: 'fracture_touch', name: 'Fracture Touch', description: '380% ATK. Chance to stun.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.8), debuff(StatusEffect.STUN, 0.45, 1)] }),
      new Skill({ id: 'voodoo_surge', name: 'Voodoo Surge', description: 'Heals 20%. Poisons all enemies 3 turns.', cooldown: 3, targetType: TargetType.ALL_ENEMIES, effects: [debuff(StatusEffect.POISON, 0.90, 3)] }),
      new Skill({ id: 'thornwood_collapse', name: 'Thornwood Collapse', description: 'AOE 310% ATK. Burns + weakens all.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(3.1), debuff(StatusEffect.BURN, 0.85, 3), debuff(StatusEffect.WEAKEN, 0.80, 2)] }),
    ],
  })
}

// ── House Mordaine commanders (Void) ──────────────────────────────────
function buildMordaineSkirmish() {
  return new Hero({
    id: 'mordaine_first_mate_crux', name: 'First Mate Crux', isPlayer: false,
    faction: Faction.MORDAINE, rarity: Rarity.RARE, affinity: Affinity.VOID,
    baseHp: 19000, baseAtk: 2500, baseDef: 600, baseSpd: 118,
    skills: [
      new Skill({ id: 'cutlass_slash', name: 'Cutlass Slash', description: '275% ATK.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(2.75)] }),
      new Skill({ id: 'shadow_venom', name: 'Shadow Venom', description: 'Poisons target for 3 turns.', cooldown: 3, targetType: TargetType.SINGLE_ENEMY, effects: [debuff(StatusEffect.POISON, 0.80, 3)] }),
      new Skill({ id: 'boarding_rush', name: 'Boarding Rush', description: '340% ATK. -DEF target.', cooldown: 4, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.4), debuff(StatusEffect.DECREASE_DEF, 0.70, 2)] }),
    ],
  })
}

function buildMordaineSiege() {
  return new Hero({
    id: 'mordaine_captain_aldara', name: 'Captain Aldara', isPlayer: false,
    faction: Faction.MORDAINE, rarity: Rarity.EPIC, affinity: Affinity.VOID,
    baseHp: 40000, baseAtk: 4600, baseDef: 1000, baseSpd: 122,
    skills: [
      new Skill({ id: 'void_cut', name: 'Void Cut', description: '300% ATK. Weakens target.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.0), debuff(StatusEffect.WEAKEN, 0.65, 2)] }),
      new Skill({ id: 'privateer_mark', name: 'Privateer Mark', description: '-ATK and -DEF to target 2 turns.', cooldown: 3, targetType: TargetType.SINGLE_ENEMY, effects: [debuff(StatusEffect.DECREASE_ATK, 0.75, 2), debuff(StatusEffect.DECREASE_DEF, 0.75, 2)] }),
      new Skill({ id: 'hull_breaker', name: 'Hull Breaker', description: 'AOE 230% ATK. -DEF all enemies.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.3), debuff(StatusEffect.DECREASE_DEF, 0.75, 2)] }),
    ],
  })
}

function buildMordaineAssault() {
  return new Hero({
    id: 'mordaine_admiral_mael', name: 'Admiral Mael', isPlayer: false,
    faction: Faction.MORDAINE, rarity: Rarity.LEGENDARY, affinity: Affinity.VOID,
    baseHp: 82000, baseAtk: 7000, baseDef: 2000, baseSpd: 128,
    critRate: 0.30, critDmg: 0.75,
    skills: [
      new Skill({ id: 'void_admiral_strike', name: 'Admiral\'s Strike', description: '360% ATK. Chance to freeze.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.6), debuff(StatusEffect.FREEZE, 0.45, 1)] }),
      new Skill({ id: 'fleet_order', name: 'Fleet Order', description: '+ATK, +SPD for 3 turns.', cooldown: 4, targetType: TargetType.SELF, effects: [buff(StatusEffect.INCREASE_ATK, 3), buff(StatusEffect.INCREASE_SPD, 3)] }),
      new Skill({ id: 'void_broadside', name: 'Void Broadside', description: 'AOE 290% ATK. -SPD all enemies 2 turns.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.9), debuff(StatusEffect.DECREASE_SPD, 0.80, 2)] }),
    ],
  })
}

function buildMordaineBreach() {
  return new Hero({
    id: 'mordaine_lord_undisclosed', name: 'Lord Mordaine the Undisclosed', isPlayer: false,
    faction: Faction.MORDAINE, rarity: Rarity.MYTHICAL, affinity: Affinity.VOID,
    baseHp: 150000, baseAtk: 12800, baseDef: 3500, baseSpd: 138,
    critRate: 0.42, critDmg: 0.90, resistance: 0.55,
    skills: [
      new Skill({ id: 'undisclosed_cut', name: 'Undisclosed Cut', description: '390% ATK. Poisons + weakens.', cooldown: 0, targetType: TargetType.SINGLE_ENEMY, effects: [dmg(3.9), debuff(StatusEffect.POISON, 0.85, 3), debuff(StatusEffect.WEAKEN, 0.75, 2)] }),
      new Skill({ id: 'old_grudge', name: 'The Old Grudge', description: 'AOE 200% ATK. -ATK all enemies 3 turns.', cooldown: 3, targetType: TargetType.ALL_ENEMIES, effects: [aoe(2.0), debuff(StatusEffect.DECREASE_ATK, 0.85, 3)] }),
      new Skill({ id: 'void_reckoning', name: 'Void Reckoning', description: 'AOE 330% ATK. Burns + freezes all.', cooldown: 5, targetType: TargetType.ALL_ENEMIES, effects: [aoe(3.3), debuff(StatusEffect.BURN, 0.90, 3), debuff(StatusEffect.FREEZE, 0.50, 1)] }),
    ],
  })
}

// ── Commander registry ────────────────────────────────────────────────
const COMMANDERS = {
  aldric:   { skirmish: buildAldricSkirmish,   siege: buildAldricSiege,   assault: buildAldricAssault,   breach: buildAldricBreach   },
  valdris:  { skirmish: buildValdrisSkirmish,  siege: buildValdrisSiege,  assault: buildValdrisAssault,  breach: buildValdrisBreach  },
  caelwyn:  { skirmish: buildCaelwynSkirmish,  siege: buildCaelwynSiege,  assault: buildCaelwynAssault,  breach: buildCaelwynBreach  },
  mordaine: { skirmish: buildMordaineSkirmish, siege: buildMordaineSiege, assault: buildMordaineAssault, breach: buildMordaineBreach },
}

export function buildSiegeCommander(factionId, tierId) {
  const factory = COMMANDERS[factionId]?.[tierId]
  if (!factory) return null
  const hero = factory()
  hero.id = `${hero.id}_0`
  return hero
}

// Battle log narrative events per faction
export const SIEGE_LOG = {
  aldric: {
    open:        () => `House Aldric's garrison closes formation. The gate captain barks orders.`,
    west50:      () => `Aldric's western sentinels fall back. They're losing ground.`,
    west0:       () => `Your West Flank tears through the outer palisade. Aldric's militia scatter.`,
    gate50:      () => `The Main Gate portcullis takes damage. Iron hinges begin to crack.`,
    gate0:       () => `The Main Gate gives way. Aldric's shield captains retreat to the inner ward.`,
    east50:      () => `The eastern wall guard is faltering. Your commanders press the advantage.`,
    east0:       () => `Your East Flank has breached the wall. Enemy archers abandon their positions.`,
    flankWest:   () => `Your West Flank now harries the gate defenders from behind.`,
    flankEast:   () => `Your East Flank has surrounded the Main Gate. Enemy morale fractures.`,
    allBreached: () => `The garrison collapses. The gate commander steps forward. Phase 2 begins.`,
  },
  valdris: {
    open:        () => `Valdris scholars activate wards along the outer wall. The air smells wrong.`,
    west50:      () => `The western ward begins to fail. Your commanders resist the arcane interference.`,
    west0:       () => `Your West Flank shatters the western ward. Valdris mages fall back screaming.`,
    gate50:      () => `The gate sigil is destabilising. Something behind the wall is responding to it.`,
    gate0:       () => `The gate sigil collapses in a burst of void light. The path to the citadel is open.`,
    east50:      () => `Eastern construct patrols are losing cohesion. Your commanders are winning the flank.`,
    east0:       () => `Your East Flank has disabled the eastern constructs. The ward network is broken.`,
    flankWest:   () => `Your West Flank disrupts the arcane relay. Gate wards weaken significantly.`,
    flankEast:   () => `Your East Flank destroys the relay node. The gate ward flickers out.`,
    allBreached: () => `The outer wards are destroyed. Lord Valdris emerges from the inner sanctum.`,
  },
  caelwyn: {
    open:        () => `The Thornwood stirs. Caelwyn's wardens take position behind the roots.`,
    west50:      () => `The western thorns thin out. Your commanders carve a path through the undergrowth.`,
    west0:       () => `Your West Flank clears the western grove. The beast-handlers break and run.`,
    gate50:      () => `The gate vines are wilting. Caelwyn's rites are failing under your assault.`,
    gate0:       () => `The gate root-seal ruptures. The coven's protection over the entrance collapses.`,
    east50:      () => `The eastern summoning circle is disrupted. Their bound creatures are fading.`,
    east0:       () => `Your East Flank breaks the eastern circle. Caelwyn's summoned beasts dissolve.`,
    flankWest:   () => `Your West Flank burns through the thorn relay. Gate defences begin withering.`,
    flankEast:   () => `Your East Flank silences the eastern coven. The gate loses its blessing.`,
    allBreached: () => `The Thornwood falls silent. The Fractured One steps out of the void.`,
  },
  mordaine: {
    open:        () => `House Mordaine raises its privateer colours. The gate bolts shut with a boom.`,
    west50:      () => `Mordaine's western cutthroats are retreating. Your commanders are through the outer line.`,
    west0:       () => `Your West Flank has cleared the western approach. Mordaine's thugs scatter into the alleys.`,
    gate50:      () => `The gate mechanism is jammed. Mordaine's engineers are struggling to hold it.`,
    gate0:       () => `The Main Gate mechanism fails. The chain snaps. Mordaine's men step aside.`,
    east50:      () => `The eastern patrol route is broken. Mordaine's archers are pulling back.`,
    east0:       () => `Your East Flank has outflanked the eastern guard. The docks approach is open.`,
    flankWest:   () => `Your West Flank cuts off Mordaine's western supply line. Gate defenders thin out.`,
    flankEast:   () => `Your East Flank seals the eastern escape route. Mordaine's gate garrison is trapped.`,
    allBreached: () => `The outer defences fall. Lord Mordaine steps forward — indifferent as ever.`,
  },
}
