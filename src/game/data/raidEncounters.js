import { Skill, SkillEffect, EffectType, TargetType, StatusEffect } from '../Skill.js'
import { Hero, Faction, Rarity, Affinity } from '../Hero.js'

function makeBatmanSkills() {
  return [
    new Skill({
      id: 'royal_decree',
      name: 'Royal Decree',
      description: 'Marks the target with impossible expectations. 320% ATK damage.',
      cooldown: 0,
      targetType: TargetType.SINGLE_ENEMY,
      effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 3.2 })],
    }),
    new Skill({
      id: 'burden_of_duty',
      name: 'Burden of Duty',
      description: 'Absorbs damage with a shield worth 30% max HP for 3 turns.',
      cooldown: 5,
      targetType: TargetType.SELF,
      effects: [new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.SHIELD, statusDuration: 3, buffValue: 0.30 })],
    }),
    new Skill({
      id: 'shadow_barrage',
      name: 'Shadow Barrage',
      description: 'Unleashes shadow wings across all enemies. 200% ATK.',
      cooldown: 3,
      targetType: TargetType.ALL_ENEMIES,
      effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.0 })],
    }),
    new Skill({
      id: 'the_endless_night',
      name: 'The Endless Night',
      description: '250% ATK to all enemies. Burns for 3 turns (90% chance).',
      cooldown: 4,
      targetType: TargetType.ALL_ENEMIES,
      effects: [
        new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.5 }),
        new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.BURN, statusChance: 0.90, statusDuration: 3 }),
      ],
    }),
  ]
}

export function buildBatmanBoss() {
  return new Hero({
    id: 'batman_nightmare',
    name: 'Batman, Lord of Nightmares',
    faction: Faction.ANCIENT_NOBLES,
    rarity: Rarity.MYTHICAL,
    affinity: Affinity.VOID,
    baseHp: 80000,
    baseAtk: 3800,
    baseDef: 1400,
    baseSpd: 90,
    critRate: 0.35,
    critDmg: 0.80,
    resistance: 0.50,
    accuracy: 0.40,
    skills: makeBatmanSkills(),
    isPlayer: false,
    enemyType: 'nightmare',
    canRevive: false,
  })
}

function makeAurelianSkills() {
  return [
    new Skill({
      id: 'eclipse_slash',
      name: 'Eclipse Slash',
      description: 'Void-edged strike. 350% ATK damage.',
      cooldown: 0,
      targetType: TargetType.SINGLE_ENEMY,
      effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 3.5 })],
    }),
    new Skill({
      id: 'crown_of_hunger',
      name: 'Crown of Hunger',
      description: 'Absorbs life force. Heals 25% max HP and raises ATK for 3 turns.',
      cooldown: 4,
      targetType: TargetType.SELF,
      effects: [
        new SkillEffect({ type: EffectType.HEAL, healPercent: 0.25 }),
        new SkillEffect({ type: EffectType.BUFF, statusEffect: StatusEffect.INCREASE_ATK, statusDuration: 3, buffValue: 0.30 }),
      ],
    }),
    new Skill({
      id: 'void_dominion',
      name: 'Void Dominion',
      description: 'Reality bends. All enemies suffer -DEF for 2 turns. 180% AOE damage.',
      cooldown: 3,
      targetType: TargetType.ALL_ENEMIES,
      effects: [
        new SkillEffect({ type: EffectType.DAMAGE, multiplier: 1.8 }),
        new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.DECREASE_DEF, statusChance: 0.90, statusDuration: 2 }),
      ],
    }),
    new Skill({
      id: 'eclipse_of_all',
      name: 'Eclipse of All',
      description: 'Cataclysmic void surge. 300% AOE damage. Poisons all survivors.',
      cooldown: 5,
      targetType: TargetType.ALL_ENEMIES,
      effects: [
        new SkillEffect({ type: EffectType.DAMAGE, multiplier: 3.0 }),
        new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.POISON, statusChance: 0.85, statusDuration: 3 }),
      ],
    }),
  ]
}

export function buildAurelian() {
  return new Hero({
    id: 'aurelian_eclipse',
    name: 'Aurelian, Lord of the Eclipse',
    faction: Faction.ANCIENT_NOBLES,
    rarity: Rarity.MYTHICAL,
    affinity: Affinity.VOID,
    baseHp: 60000,
    baseAtk: 4200,
    baseDef: 1100,
    baseSpd: 110,
    critRate: 0.40,
    critDmg: 0.90,
    resistance: 0.45,
    accuracy: 0.50,
    skills: makeAurelianSkills(),
    isPlayer: false,
    enemyType: 'nightmare',
    canRevive: false,
  })
}

function makeNytheraxSkills() {
  return [
    new Skill({
      id: 'singularity_breath',
      name: 'Singularity Breath',
      description: 'A collapsing singularity engulfs all enemies. 280% AOE damage.',
      cooldown: 0,
      targetType: TargetType.ALL_ENEMIES,
      effects: [new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.8 })],
    }),
    new Skill({
      id: 'starless_wings',
      name: 'Starless Wings',
      description: 'Banks across the battlefield. 220% AOE damage. 50% stun chance.',
      cooldown: 4,
      targetType: TargetType.ALL_ENEMIES,
      effects: [
        new SkillEffect({ type: EffectType.DAMAGE, multiplier: 2.2 }),
        new SkillEffect({ type: EffectType.DEBUFF, statusEffect: StatusEffect.STUN, statusChance: 0.50, statusDuration: 1 }),
      ],
    }),
  ]
}

export function buildNytherax() {
  return new Hero({
    id: 'nytherax_wyrm',
    name: 'Nytherax, the Starless Wyrm',
    faction: Faction.ANCIENT_NOBLES,
    rarity: Rarity.MYTHICAL,
    affinity: Affinity.VOID,
    baseHp: 50000,
    baseAtk: 3600,
    baseDef: 900,
    baseSpd: 70,
    critRate: 0.25,
    critDmg: 0.70,
    resistance: 0.40,
    accuracy: 0.45,
    skills: makeNytheraxSkills(),
    isPlayer: false,
    enemyType: 'nightmare',
    canRevive: false,
  })
}

export const RAID_ENCOUNTERS = {
  throne_of_regret: {
    id: 'raid_throne_of_regret',
    name: 'The Throne of Regret',
    difficulty: 'Nightmare',
    isRaid: true,
    enemies: [buildBatmanBoss],
    mechanics: [],
    rewards: { gold: 10000, diamonds: 100 },
    phases: [
      { number: 1, name: 'The Noble King',            hpAbove: 0.70, color: '#c9a227' },
      { number: 2, name: 'Prisoner of the Mind',       hpAbove: 0.30, color: '#ff9944' },
      { number: 3, name: 'Batman, Lord of Nightmares', hpAbove: 0,    color: '#b44fff' },
    ],
  },
  void_heir: {
    id: 'raid_void_heir',
    name: 'The Void Heir',
    difficulty: 'Nightmare',
    isRaid: true,
    enemies: [buildAurelian, buildNytherax],
    mechanics: [],
    rewards: { gold: 12000, diamonds: 120 },
    // Phase tracking is based on Aurelian (first enemy, index 0)
    phases: [
      { number: 1, name: 'The Void Heir',                  hpAbove: 0.65, color: '#8844ff' },
      { number: 2, name: 'Nytherax Awakens',               hpAbove: 0.30, color: '#cc66ff' },
      { number: 3, name: 'Aurelian, Lord of the Eclipse',  hpAbove: 0,    color: '#ff88ff' },
    ],
  },
}
