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
}
