export const EffectType = {
  DAMAGE: 'damage',
  HEAL: 'heal',
  BUFF: 'buff',
  DEBUFF: 'debuff',
  REVIVE: 'revive',
}

export const StatusEffect = {
  // Debuffs
  POISON: 'poison',
  BURN: 'burn',
  FREEZE: 'freeze',
  STUN: 'stun',
  WEAKEN: 'weaken',       // -25% DEF
  DECREASE_ATK: 'decrease_atk',
  DECREASE_DEF: 'decrease_def',
  DECREASE_SPD: 'decrease_spd',
  SLEEP: 'sleep',
  // Buffs
  SHIELD: 'shield',
  INCREASE_ATK: 'increase_atk',
  INCREASE_DEF: 'increase_def',
  INCREASE_SPD: 'increase_spd',
  COUNTER: 'counter',
  IMMUNITY: 'immunity',
  CONTINUOUS_HEAL: 'continuous_heal',
  PROVOKE: 'provoke',        // forces enemies to target this unit
  MARKED: 'marked',          // ranger mark — target takes bonus damage
}

export const TargetType = {
  SINGLE_ENEMY: 'single_enemy',
  ALL_ENEMIES: 'all_enemies',
  RANDOM_ENEMY: 'random_enemy',
  SINGLE_ALLY: 'single_ally',
  ALL_ALLIES: 'all_allies',
  SELF: 'self',
}

export class Skill {
  constructor({ id, name, description, cooldown = 0, effects = [], targetType, passive = false }) {
    this.id = id
    this.name = name
    this.description = description
    this.cooldown = cooldown       // max cooldown turns
    this.currentCooldown = 0      // turns remaining before usable
    this.effects = effects        // array of SkillEffect
    this.targetType = targetType
    this.passive = passive
  }

  isReady() {
    return this.currentCooldown === 0
  }

  use() {
    this.currentCooldown = this.cooldown
  }

  tickCooldown() {
    if (this.currentCooldown > 0) this.currentCooldown--
  }

  clone() {
    const s = new Skill({
      id: this.id,
      name: this.name,
      description: this.description,
      cooldown: this.cooldown,
      effects: this.effects.map(e => ({ ...e })),
      targetType: this.targetType,
      passive: this.passive,
    })
    s.currentCooldown = this.currentCooldown
    return s
  }
}

// A single effect within a skill (damage hit, apply debuff, etc.)
export class SkillEffect {
  constructor({
    type,
    multiplier = 0,       // of ATK for damage, or flat value for heal
    healPercent = 0,      // % of max HP for heals
    statusEffect = null,
    statusChance = 1.0,   // 0–1 probability
    statusDuration = 2,   // turns
    buffValue = 0,        // flat % increase (0.25 = 25%)
    hits = 1,
  }) {
    this.type = type
    this.multiplier = multiplier
    this.healPercent = healPercent
    this.statusEffect = statusEffect
    this.statusChance = statusChance
    this.statusDuration = statusDuration
    this.buffValue = buffValue
    this.hits = hits
  }
}
