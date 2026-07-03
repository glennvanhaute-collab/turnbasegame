import { Skill, SkillEffect, EffectType, TargetType, StatusEffect } from '../Skill.js'

export const SKILLS = {
  // ── Warrior skills ──────────────────────────────────────────
  HEAVY_STRIKE: new Skill({
    id: 'heavy_strike',
    name: 'Heavy Strike',
    description: 'A powerful blow dealing 250% ATK damage.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.5 })],
  }),

  WHIRLWIND: new Skill({
    id: 'whirlwind',
    name: 'Whirlwind',
    description: 'Hits all enemies for 150% ATK.',
    cooldown: 3,
    targetType: TargetType.ALL_ENEMIES,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.5 })],
  }),

  BATTLE_CRY: new Skill({
    id: 'battle_cry',
    name: 'Battle Cry',
    description: 'Increases own ATK by 25% for 2 turns.',
    cooldown: 4,
    targetType: TargetType.SELF,
    effects: [new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_ATK, statusDuration: 2, buffValue: 0.25 })],
  }),

  // ── Mage skills ─────────────────────────────────────────────
  FIREBALL: new Skill({
    id: 'fireball',
    name: 'Fireball',
    description: 'Launches a fireball dealing 200% ATK with 75% chance to Burn.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.0 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.BURN, statusChance: 0.75, statusDuration: 2 }),
    ],
  }),

  BLIZZARD: new Skill({
    id: 'blizzard',
    name: 'Blizzard',
    description: 'Hits all enemies for 120% ATK with 50% Freeze chance.',
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.FREEZE, statusChance: 0.50, statusDuration: 1 }),
    ],
  }),

  ARCANE_SHIELD: new Skill({
    id: 'arcane_shield',
    name: 'Arcane Shield',
    description: 'Places a shield worth 20% max HP on all allies for 2 turns.',
    cooldown: 5,
    targetType: TargetType.ALL_ALLIES,
    effects: [new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.SHIELD, statusDuration: 2, buffValue: 0.20 })],
  }),

  // ── Healer skills ────────────────────────────────────────────
  MEND: new Skill({
    id: 'mend',
    name: 'Mend',
    description: 'Heals an ally for 30% of their max HP.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ALLY,
    effects: [new SkillEffect({ type: EffectType.HEAL, healPercent: 0.30 })],
  }),

  MASS_HEAL: new Skill({
    id: 'mass_heal',
    name: 'Mass Heal',
    description: 'Heals all allies for 20% of their max HP.',
    cooldown: 4,
    targetType: TargetType.ALL_ALLIES,
    effects: [new SkillEffect({ type: EffectType.HEAL, healPercent: 0.20 })],
  }),

  REVITALIZE: new Skill({
    id: 'revitalize',
    name: 'Revitalize',
    description: 'Places continuous heal on all allies for 2 turns.',
    cooldown: 5,
    targetType: TargetType.ALL_ALLIES,
    effects: [new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.CONTINUOUS_HEAL, statusDuration: 2 })],
  }),

  // ── Rogue skills ─────────────────────────────────────────────
  BACKSTAB: new Skill({
    id: 'backstab',
    name: 'Backstab',
    description: 'A quick strike for 180% ATK with 60% Poison chance.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.8 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.POISON, statusChance: 0.60, statusDuration: 3 }),
    ],
  }),

  MULTI_STAB: new Skill({
    id: 'multi_stab',
    name: 'Multi-Stab',
    description: 'Hits a single enemy 4 times for 80% ATK each.',
    cooldown: 3,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 0.8, hits: 4 })],
  }),

  // ── Player character starter skills (intentionally weak) ───
  CRUDE_SWING: new Skill({
    id: 'crude_swing',
    name: 'Crude Swing',
    description: 'A clumsy but earnest attack. Deals 100% ATK damage to one enemy.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.0 })],
  }),

  FORTIFY: new Skill({
    id: 'fortify',
    name: 'Fortify',
    description: 'Steel yourself. Gain +15% DEF for 2 turns.',
    cooldown: 4,
    targetType: TargetType.SELF,
    effects: [new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_DEF, statusDuration: 2, buffValue: 0.15 })],
  }),

  PATCH_UP: new Skill({
    id: 'patch_up',
    name: 'Patch Up',
    description: 'Tend your wounds in the heat of battle. Recover 7% of max HP.',
    cooldown: 4,
    targetType: TargetType.SELF,
    effects: [new SkillEffect({ type: EffectType.HEAL, healPercent: 0.07 })],
  }),

  // ── Tank skills ──────────────────────────────────────────────
  PROVOKE: new Skill({
    id: 'provoke',
    name: 'Provoke',
    description: 'Taunt all enemies — forces them to attack you for 2 turns.',
    cooldown: 4,
    targetType: TargetType.SELF,
    effects: [new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.PROVOKE, statusDuration: 2 })],
  }),

  IRON_BASTION: new Skill({
    id: 'iron_bastion',
    name: 'Iron Bastion',
    description: 'Harden your void-forged armour. Gain +35% DEF for 3 turns.',
    cooldown: 5,
    targetType: TargetType.SELF,
    effects: [new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_DEF, statusDuration: 3, buffValue: 0.35 })],
  }),

  // ── Aldric Crossbowman ──────────────────────────────────────
  CROSSBOW_SHOT: new Skill({
    id: 'crossbow_shot',
    name: 'Crossbow Shot',
    description: 'A precise bolt dealing 190% ATK to one enemy.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.9 })],
  }),

  VOLLEY: new Skill({
    id: 'volley',
    name: 'Volley',
    description: 'Unleash a hail of bolts hitting all enemies for 100% ATK.',
    cooldown: 3,
    targetType: TargetType.ALL_ENEMIES,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.0 })],
  }),

  // ── Lord Vaeric Corvayne — Ancient ──────────────────────────
  SANGUINE_STRIKE: new Skill({
    id: 'sanguine_strike',
    name: 'Sanguine Strike',
    description: 'A vampiric blow dealing 240% ATK. The wound never fully closes.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.4 })],
  }),

  RAVENS_CURSE: new Skill({
    id: 'ravens_curse',
    name: "Raven's Curse",
    description: "His ravens descend on all foes, dealing 110% ATK and reducing their Attack for 3 turns.",
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.1 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_ATK, statusDuration: 3 }),
    ],
  }),

  DUSK_COMMUNION: new Skill({
    id: 'dusk_communion',
    name: 'Dusk Communion',
    description: 'Retreats into ancient shadow. Gains Immunity and Continuous Heal for 2 turns.',
    cooldown: 5,
    targetType: TargetType.SELF,
    effects: [
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.IMMUNITY, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.CONTINUOUS_HEAL, statusDuration: 2 }),
    ],
  }),

  // ── Valerius Dawnchaser — Ancient Astral ───────────────────────
  STELLAR_STRIKE: new Skill({
    id: 'stellar_strike',
    name: 'Stellar Strike',
    description: 'Channels astral energy into a devastating blow dealing 260% ATK.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.6 })],
  }),

  STELLAR_RIFT: new Skill({
    id: 'stellar_rift',
    name: 'Stellar Rift',
    description: 'Tears open an astral rift, hitting all enemies for 130% ATK and reducing their Defence for 2 turns.',
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.3 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_DEF, statusDuration: 2 }),
    ],
  }),

  ASTRAL_FORM: new Skill({
    id: 'astral_form',
    name: 'Astral Form',
    description: 'Ascends briefly into the astral plane. Gains Immunity and +30% Speed for 2 turns.',
    cooldown: 5,
    targetType: TargetType.SELF,
    effects: [
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.IMMUNITY, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_SPD, statusDuration: 2, buffValue: 0.30 }),
    ],
  }),

  // ── Generic enemy skills ─────────────────────────────────────
  SLASH: new Skill({
    id: 'slash',
    name: 'Slash',
    description: 'A basic slash for 200% ATK.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.0 })],
  }),

  CRUSH: new Skill({
    id: 'crush',
    name: 'Crush',
    description: 'A heavy blow dealing 300% ATK.',
    cooldown: 3,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 3.0 })],
  }),

  DARK_WAVE: new Skill({
    id: 'dark_wave',
    name: 'Dark Wave',
    description: 'Hits all enemies for 130% ATK with a chance to Weaken.',
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.3 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.WEAKEN, statusChance: 0.5, statusDuration: 2 }),
    ],
  }),

  // ── Zwierls ─────────────────────────────────────────────────────
  RUNIC_SMASH: new Skill({
    id: 'runic_smash',
    name: 'Runic Smash',
    description: 'He swings with the enthusiasm of a man celebrating something. It is always devastating. Deals 260% ATK.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.6 })],
  }),

  HAMMER_ROUND: new Skill({
    id: 'hammer_round',
    name: 'Hammer Round',
    description: 'He hits everyone. This is not unlike his approach to buying drinks. Deals 140% ATK to all enemies with 65% chance to Stun.',
    cooldown: 3,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.4 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.STUN, statusChance: 0.65, statusDuration: 1 }),
    ],
  }),

  STONE_RESOLVE: new Skill({
    id: 'stone_resolve',
    name: 'Stone Resolve',
    description: 'He has taken harder hits at the tavern and danced afterward. Raises own DEF by 40% and regenerates HP for 3 turns.',
    cooldown: 4,
    targetType: TargetType.SELF,
    effects: [
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_DEF, statusDuration: 3, buffValue: 0.40 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.CONTINUOUS_HEAL, statusDuration: 3 }),
    ],
  }),

  // ── Gribzak Gearvein ────────────────────────────────────────────
  CRYSTAL_STRIKE: new Skill({
    id: 'crystal_strike',
    name: 'Crystal Strike',
    description: 'A direct blow with the green-crystal hammer. Deals 200% ATK damage.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.0 })],
  }),

  EMERGENCY_PATCH: new Skill({
    id: 'emergency_patch',
    name: 'Emergency Patch',
    description: "Field repair — restores 15% max HP to one ally and raises their DEF for 2 turns. He's done this mid-battle. More than once.",
    cooldown: 3,
    targetType: TargetType.SINGLE_ALLY,
    effects: [
      new SkillEffect({ type: EffectType.HEAL, healPercent: 0.15 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_DEF, statusDuration: 2, buffValue: 0.25 }),
    ],
  }),

  SCRAP_SURGE: new Skill({
    id: 'scrap_surge',
    name: 'Scrap Surge',
    description: 'Unleashes a burst of unstable crystal energy at all enemies, dealing 110% ATK with 60% chance to reduce their ATK for 2 turns.',
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.1 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_ATK, statusChance: 0.60, statusDuration: 2 }),
    ],
  }),

  // ── Borrik Stormcog ─────────────────────────────────────────────
  SKYBREAKER_STRIKE: new Skill({
    id: 'skybreaker_strike',
    name: 'Skybreaker',
    description: "Skybreaker doesn't care how fancy your spell theory is. Deals 270% ATK damage.",
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.7 })],
  }),

  ARC_DISCHARGE: new Skill({
    id: 'arc_discharge',
    name: 'Arc Discharge',
    description: 'Releases a shockwave from the arc-core. Hits all enemies for 150% ATK with 65% chance to Stun for 1 turn.',
    cooldown: 3,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.5 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.STUN, statusChance: 0.65, statusDuration: 1 }),
    ],
  }),

  ARTIFICERS_SHIELD: new Skill({
    id: 'artificers_shield',
    name: "Artificer's Shield",
    description: 'Raises arcane barriers for all allies, granting a Shield and increasing DEF for 3 turns. Soldiers feel safer when he is near.',
    cooldown: 4,
    targetType: TargetType.ALL_ALLIES,
    effects: [
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.SHIELD, statusDuration: 3 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_DEF, statusDuration: 3, buffValue: 0.30 }),
    ],
  }),

  // ── Arri the Witch ──────────────────────────────────────────────
  VERDANT_HEX: new Skill({
    id: 'verdant_hex',
    name: 'Verdant Hex',
    description: 'A quiet curse that finds the cracks. Deals 200% ATK with 80% chance to Poison for 2 turns.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.0 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.POISON, statusChance: 0.80, statusDuration: 2 }),
    ],
  }),

  FROM_THE_ARCHIVES: new Skill({
    id: 'from_the_archives',
    name: 'From the Archives',
    description: "She doesn't need to guess. She already knows. Deals 120% ATK and reduces target's ATK and DEF for 3 turns.",
    cooldown: 3,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_ATK, statusChance: 1.0, statusDuration: 3 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_DEF, statusChance: 1.0, statusDuration: 3 }),
    ],
  }),

  THE_LEDGER: new Skill({
    id: 'the_ledger',
    name: 'The Ledger',
    description: 'Everyone owes her something. Hits all enemies for 100% ATK, reduces their SPD and Weakens them for 2 turns.',
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.0 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_SPD, statusChance: 1.0, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.WEAKEN, statusChance: 1.0, statusDuration: 2 }),
    ],
  }),

  // ── Kyver ───────────────────────────────────────────────────────
  HONOUR_SLASH: new Skill({
    id: 'honour_slash',
    name: 'For Rice and Honour',
    description: 'A mighty slash drawn from deep discipline — or possibly just hunger. Deals 280% ATK damage.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.8 })],
  }),

  THOUSAND_CUTS: new Skill({
    id: 'thousand_cuts',
    name: 'Thousand Cuts',
    description: 'Kyver unleashes a flurry on all enemies. He has never stopped to count if it is actually a thousand. Hits all for 100% ATK 3 times.',
    cooldown: 3,
    targetType: TargetType.ALL_ENEMIES,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.0, hits: 3 })],
  }),

  WARLORDS_RESOLVE: new Skill({
    id: 'warlords_resolve',
    name: "Warlord's Resolve",
    description: 'He has faced death, dishonour, and a shortage of rice. Nothing stops him now. Raises own ATK by 35% and SPD by 25% for 3 turns.',
    cooldown: 4,
    targetType: TargetType.SELF,
    effects: [
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_ATK, statusDuration: 3, buffValue: 0.35 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_SPD, statusDuration: 3, buffValue: 0.25 }),
    ],
  }),

  // ── Jade Dragonforge ────────────────────────────────────────────
  DRAGON_LANCE: new Skill({
    id: 'dragon_lance',
    name: 'Dragon Lance',
    description: 'A devastating spear thrust dealing 310% ATK damage.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 3.1 })],
  }),

  SEARING_DIVE: new Skill({
    id: 'searing_dive',
    name: 'Searing Dive',
    description: 'Her dragon dives and breathes fire on all enemies for 165% ATK with 90% chance to Burn for 2 turns.',
    cooldown: 3,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.65 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.BURN, statusChance: 0.90, statusDuration: 2 }),
    ],
  }),

  FORGE_WRATH: new Skill({
    id: 'forge_wrath',
    name: 'Forge Wrath',
    description: 'Channels dragonfire into her armour — raises own ATK by 40% and DEF by 30% for 3 turns.',
    cooldown: 4,
    targetType: TargetType.SELF,
    effects: [
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_ATK, statusDuration: 3, buffValue: 0.40 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_DEF, statusDuration: 3, buffValue: 0.30 }),
    ],
  }),

  // ── Lord Caelwyn — Mythical Spirit Champion ─────────────────────
  MOONLIT_SEVERANCE: new Skill({
    id: 'moonlit_severance',
    name: 'Moonlit Severance',
    description: 'The First Lord\'s blade finds the seam between armour and oath. Strikes twice for 160% ATK each, with a 75% chance to reduce the target\'s Defence for 2 turns.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.6, hits: 2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_DEF, statusChance: 0.75, statusDuration: 2 }),
    ],
  }),

  MARBLE_DECREE: new Skill({
    id: 'marble_decree',
    name: 'Marble Decree',
    description: 'The First Lord speaks, and the house answers. Grants Shield and +30% Defence to all allies for 2 turns, then heals the entire party for 18% of their max HP.',
    cooldown: 4,
    targetType: TargetType.ALL_ALLIES,
    effects: [
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.SHIELD, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_DEF, statusDuration: 2, buffValue: 0.30 }),
      new SkillEffect({ type: EffectType.HEAL, healPercent: 0.18 }),
    ],
  }),

  OATH_OF_THE_WHITE_GROVE: new Skill({
    id: 'oath_of_the_white_grove',
    name: 'Oath of the White Grove',
    description: 'The sacred vow made weapon. Strikes all enemies for 140% ATK. Those who stand against the grove are left with reduced Attack and Weakened for 2 turns.',
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.4 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_ATK, statusChance: 1.0, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.WEAKEN, statusChance: 1.0, statusDuration: 2 }),
    ],
  }),

  LETHARIEL_ASCENDANT: new Skill({
    id: 'lethariel_ascendant',
    name: 'Lethariel Ascendant',
    description: 'The First Lord\'s final word. He does not raise his voice. He raises his blade. Deals 390% ATK to one enemy. If they survive, they are Stunned and Weakened for 2 turns.',
    cooldown: 5,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 3.9 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.STUN, statusChance: 0.85, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.WEAKEN, statusChance: 1.0, statusDuration: 2 }),
    ],
  }),

  // ── Lord Mordaine — Mythical Blood Arbiter ────────────────────────
  BLOOD_DRAIN: new Skill({
    id: 'blood_drain',
    name: 'Blood Drain',
    description: 'He does not reach for you. He reaches into what sustains you, and takes it. Deals 185% ATK to one enemy and restores 20% of his own maximum HP.',
    cooldown: 0,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.85 }),
      new SkillEffect({ type: EffectType.SELF_HEAL, healPercent: 0.20 }),
    ],
  }),

  CRIMSON_EDICT: new Skill({
    id: 'crimson_edict',
    name: 'Crimson Edict',
    description: 'The lord\'s decree does not travel in ink. It travels in blood. Deals 155% ATK to all enemies, reduces their Attack for 2 turns, and restores 20% of his own maximum HP.',
    cooldown: 4,
    targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.55 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_ATK, statusChance: 1.0, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.SELF_HEAL, healPercent: 0.20 }),
    ],
  }),

  SHADOW_DOMINION: new Skill({
    id: 'shadow_dominion',
    name: 'Shadow Dominion',
    description: 'The house that walks in shadow is never blinded by light. Deals 220% ATK to one enemy and drains their vital force — restoring 20% of Lord Mordaine\'s maximum HP. Leaves them Weakened for 2 turns.',
    cooldown: 4,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.20 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.WEAKEN, statusChance: 1.0, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.SELF_HEAL, healPercent: 0.20 }),
    ],
  }),

  THE_VOID_RECEIVES: new Skill({
    id: 'the_void_receives',
    name: 'The Void Receives',
    description: 'You mistake what I do for cruelty. I simply let the void show you what was already true. Deals 480% ATK to one enemy, heals Lord Mordaine for 20% of his maximum HP. They are Stunned for 2 turns and Poisoned for 3.',
    cooldown: 5,
    targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 4.8 }),
      new SkillEffect({ type: EffectType.SELF_HEAL, healPercent: 0.20 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.STUN, statusChance: 0.90, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.POISON, statusChance: 1.0, statusDuration: 3 }),
    ],
  }),

  // ── Archmage Valdris skills (Arcane · House Valdris) ─────────────
  ARCANE_LANCE: new Skill({
    id: 'arcane_lance', name: 'Arcane Lance',
    description: 'Precision made lethal. Deals 195% ATK to one enemy and strips their defences — 80% chance to Weaken for 2 turns.',
    cooldown: 0, targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.95 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.WEAKEN, statusChance: 0.80, statusDuration: 2 }),
    ],
  }),

  THEORY_OF_RUIN: new Skill({
    id: 'theory_of_ruin', name: 'Theory of Ruin',
    description: 'He wrote the paper. He burned the archive. Deals 140% ATK to all enemies and saps their power — reducing ATK by 25% for 2 turns.',
    cooldown: 4, targetType: TargetType.ALL_ENEMIES,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.40 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_ATK, statusChance: 1.0, statusDuration: 2 }),
    ],
  }),

  TEMPORAL_SEAL: new Skill({
    id: 'temporal_seal', name: 'Temporal Seal',
    description: 'Time is a variable. He is not. Deals 265% ATK to one enemy and arrests them in a sealed moment — 90% chance to Stun for 2 turns.',
    cooldown: 4, targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.65 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.STUN, statusChance: 0.90, statusDuration: 2 }),
    ],
  }),

  THE_ABSOLUTE: new Skill({
    id: 'the_absolute', name: 'The Absolute',
    description: 'There is a theorem at the end of all things. He has solved it. Deals 530% ATK to one enemy, Freezes them for 2 turns, and Weakens them for 2 turns.',
    cooldown: 5, targetType: TargetType.SINGLE_ENEMY,
    effects: [
      new SkillEffect({ type: EffectType.DAMAGE, multiplier: 5.30 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.FREEZE, statusChance: 1.0, statusDuration: 2 }),
      new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.WEAKEN, statusChance: 1.0, statusDuration: 2 }),
    ],
  }),
}
