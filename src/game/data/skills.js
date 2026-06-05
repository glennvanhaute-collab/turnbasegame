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
}
