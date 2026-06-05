import { StatusEffect } from './Skill.js'

export const Rarity = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary',
  MYTHICAL: 'Mythical',
  ANCIENT: 'Ancient',
}

export const Faction = {
  ALDRIC:          'House Aldric',
  VALDRIS:         'House Valdris',
  CAELWYN:         'House Caelwyn',
  MORDAINE:        'House Mordaine',
  BLOODTUSK:       'House Bloodtusk',
  IGNAR:           'House Ignar',
  ANCIENT_NOBLES:  'Ancient Nobles',
}

export const Affinity = {
  FORCE: 'Force',    // strong vs Magic, weak vs Spirit
  MAGIC: 'Magic',   // strong vs Spirit, weak vs Force
  SPIRIT: 'Spirit', // strong vs Force, weak vs Magic
  VOID: 'Void',     // neutral to all
  BLOOD: 'Blood',   // strong vs Spirit, weak vs Force — vampiric / life-drain
  ASTRAL: 'Astral', // neutral to all — cosmic / celestial
}

const AFFINITY_CHART = {
  [Affinity.FORCE]:  { strong: Affinity.MAGIC,  weak: Affinity.SPIRIT },
  [Affinity.MAGIC]:  { strong: Affinity.SPIRIT, weak: Affinity.FORCE },
  [Affinity.SPIRIT]: { strong: Affinity.FORCE,  weak: Affinity.MAGIC },
  [Affinity.VOID]:   { strong: null,            weak: null },
  [Affinity.BLOOD]:  { strong: Affinity.SPIRIT, weak: Affinity.FORCE },
  [Affinity.ASTRAL]: { strong: null,            weak: null },
}

export function getAffinityMultiplier(attackerAffinity, defenderAffinity) {
  const chart = AFFINITY_CHART[attackerAffinity]
  if (chart.strong === defenderAffinity) return 1.15
  if (chart.weak === defenderAffinity) return 0.85
  return 1.0
}

export class Hero {
  constructor({
    id, name, faction, rarity, affinity,
    baseHp, baseAtk, baseDef, baseSpd,
    critRate = 0.15, critDmg = 0.50,
    resistance = 0.30, accuracy = 0,
    skills = [],
    artisanSkills = [],
    isPlayer = true,
    enemyType = null,
    canRevive = false,
    quote = null,
    lore = null,
  }) {
    this.id = id
    this.name = name
    this.faction = faction
    this.rarity = rarity
    this.affinity = affinity
    this.isPlayer = isPlayer
    this.quote = quote
    this.lore = lore

    // Base stats
    this.baseHp = baseHp
    this.baseAtk = baseAtk
    this.baseDef = baseDef
    this.baseSpd = baseSpd
    this.critRate = critRate
    this.critDmg = critDmg
    this.resistance = resistance
    this.accuracy = accuracy

    // Runtime state
    this.hp = baseHp
    this.maxHp = baseHp
    this.turnMeter = 0
    this.statusEffects = []
    this.skills = skills.map(s => s.clone())
    this.artisanSkills = artisanSkills
    this.isDead = false
    this.canRevive = canRevive
    this.damageReduction = 0   // set by applyGear when wielding a shield
    this.enemyType = enemyType // e.g. 'undead' — used by slayer line bonuses
    this.slayerUndead = 0      // set by applyGear from line bonuses
  }

  // Scales base combat stats by a level multiplier (Soul Vessel — same XP pool as player hero).
  applyLevelScale(multiplier) {
    if (multiplier <= 1) return
    this.baseHp  = Math.floor(this.baseHp  * multiplier)
    this.baseAtk = Math.floor(this.baseAtk * multiplier)
    this.baseDef = Math.floor(this.baseDef * multiplier)
    this.baseSpd = Math.floor(this.baseSpd * multiplier)
    this.maxHp   = this.baseHp
    this.hp      = this.baseHp
  }

  // Called by useCollectionStore.buildTeam() before battle starts.
  // Folds all gear stat bonuses into this hero's base stats (one-time, not reversible).
  applyGear(gearStats, damageReduction = 0) {
    const g = gearStats
    this.baseHp   = Math.floor(this.baseHp   * (1 + (g.hpPct  ?? 0)) + (g.hp  ?? 0))
    this.baseAtk  = Math.floor(this.baseAtk  * (1 + (g.atkPct ?? 0)) + (g.atk ?? 0))
    this.baseDef  = Math.floor(this.baseDef  * (1 + (g.defPct ?? 0)) + (g.def ?? 0))
    this.baseSpd  = Math.floor(this.baseSpd  * (1 + (g.spdPct ?? 0)) + (g.spd ?? 0))
    this.critRate = Math.min(0.95, this.critRate + (g.critRate    ?? 0))
    this.critDmg  += g.critDmg    ?? 0
    this.resistance = Math.min(1, this.resistance + (g.resistance ?? 0))
    this.accuracy   += g.accuracy ?? 0
    this.maxHp = this.baseHp
    this.hp    = this.baseHp
    this.damageReduction = damageReduction
    this.slayerUndead = g.slayerUndead ?? 0
  }

  get atk() { return this._statWithBuffs('baseAtk', StatusEffect.INCREASE_ATK, StatusEffect.DECREASE_ATK) }
  get def() { return this._statWithBuffs('baseDef', StatusEffect.INCREASE_DEF, StatusEffect.DECREASE_DEF) }
  get spd() { return this._statWithBuffs('baseSpd', StatusEffect.INCREASE_SPD, StatusEffect.DECREASE_SPD) }

  _statWithBuffs(baseProp, buffType, debuffType) {
    let val = this[baseProp]
    for (const se of this.statusEffects) {
      if (se.type === buffType)   val *= (1 + (se.value ?? 0.25))
      if (se.type === debuffType) val *= (1 - (se.value ?? 0.25))
    }
    return Math.floor(val)
  }

  hasStatus(type) {
    return this.statusEffects.some(se => se.type === type)
  }

  hasImmunity() {
    return this.hasStatus(StatusEffect.IMMUNITY)
  }

  applyStatus(type, duration, value = null) {
    if (this.hasImmunity() && this._isDebuff(type)) return false
    const existing = this.statusEffects.find(se => se.type === type)
    if (existing) {
      existing.duration = Math.max(existing.duration, duration)
    } else {
      this.statusEffects.push({ type, duration, value })
    }
    return true
  }

  _isDebuff(type) {
    const debuffs = [
      StatusEffect.POISON, StatusEffect.BURN, StatusEffect.FREEZE,
      StatusEffect.STUN, StatusEffect.WEAKEN, StatusEffect.DECREASE_ATK,
      StatusEffect.DECREASE_DEF, StatusEffect.DECREASE_SPD, StatusEffect.SLEEP,
    ]
    return debuffs.includes(type)
  }

  tickStatusEffects() {
    const log = []
    const dotEffects = []

    for (const se of this.statusEffects) {
      if (se.type === StatusEffect.POISON || se.type === StatusEffect.BURN) {
        const dmg = Math.floor(this.maxHp * 0.05)
        this.takeDamage(dmg)
        dotEffects.push({ type: se.type, damage: dmg })
      }
      if (se.type === StatusEffect.CONTINUOUS_HEAL) {
        const heal = Math.floor(this.maxHp * 0.075)
        this.heal(heal)
        log.push({ type: 'heal', value: heal })
      }
      se.duration--
    }

    this.statusEffects = this.statusEffects.filter(se => se.duration > 0)
    return { dotEffects, log }
  }

  takeDamage(amount) {
    if (this.damageReduction > 0) {
      amount = Math.floor(amount * (1 - this.damageReduction))
    }
    const shield = this.statusEffects.find(se => se.type === StatusEffect.SHIELD)
    if (shield) {
      if (shield.value >= amount) {
        shield.value -= amount
        return 0
      }
      amount -= shield.value
      this.statusEffects = this.statusEffects.filter(se => se.type !== StatusEffect.SHIELD)
    }
    this.hp = Math.max(0, this.hp - amount)
    if (this.hp === 0) this.isDead = true
    return amount
  }

  heal(amount) {
    const before = this.hp
    this.hp = Math.min(this.maxHp, this.hp + amount)
    return this.hp - before
  }

  advanceTurnMeter(amount) {
    this.turnMeter = Math.min(100, this.turnMeter + amount)
  }

  consumeTurnMeter() {
    this.turnMeter = 0
  }

  canAct() {
    return !this.hasStatus(StatusEffect.STUN) &&
           !this.hasStatus(StatusEffect.FREEZE) &&
           !this.hasStatus(StatusEffect.SLEEP)
  }

  tickSkillCooldowns() {
    this.skills.forEach(s => s.tickCooldown())
  }

  clone() {
    const h = new Hero({
      id: this.id, name: this.name, faction: this.faction,
      rarity: this.rarity, affinity: this.affinity,
      baseHp: this.baseHp, baseAtk: this.baseAtk,
      baseDef: this.baseDef, baseSpd: this.baseSpd,
      critRate: this.critRate, critDmg: this.critDmg,
      resistance: this.resistance, accuracy: this.accuracy,
      skills: this.skills,
      isPlayer: this.isPlayer,
    })
    return h
  }
}
