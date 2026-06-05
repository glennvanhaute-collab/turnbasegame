import { EffectType, TargetType, StatusEffect } from './Skill.js'
import { getAffinityMultiplier } from './Hero.js'

export const BattleState = {
  IDLE: 'idle',
  SELECTING_SKILL: 'selecting_skill',
  SELECTING_TARGET: 'selecting_target',
  ANIMATING: 'animating',
  ENEMY_TURN: 'enemy_turn',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
}

export class BattleEngine {
  constructor(playerTeam, enemyTeam, options = {}) {
    this.playerTeam = playerTeam
    this.enemyTeam = enemyTeam
    this.state = BattleState.IDLE
    this.log = []
    this.turn = 0
    this.activeHero = null
    this.pendingSkill = null
    this._actionSeq = 0
    this.mechanics  = options.mechanics ?? []
    this.revivedIds = new Set()
  }

  get allHeroes() {
    return [...this.playerTeam, ...this.enemyTeam]
  }

  get livingPlayers() {
    return this.playerTeam.filter(h => !h.isDead)
  }

  get livingEnemies() {
    return this.enemyTeam.filter(h => !h.isDead)
  }

  // Advance turn meters until one hero hits 100
  advanceToNextTurn() {
    if (this.livingPlayers.length === 0 || this.livingEnemies.length === 0) return null

    const living = this.allHeroes.filter(h => !h.isDead)
    while (true) {
      for (const hero of living) {
        // Speed fills turn meter: 1 SPD = 1 point per tick
        hero.advanceTurnMeter(hero.spd / 10)
        if (hero.turnMeter >= 100) {
          hero.consumeTurnMeter()
          return hero
        }
      }
    }
  }

  startBattle() {
    this.log = []
    this.state = BattleState.IDLE
    this.logMessage('⚔️ Battle started!')
    return this.nextTurn()
  }

  nextTurn() {
    const hero = this.advanceToNextTurn()
    if (!hero) return this._checkBattleEnd()

    this.turn++
    this.activeHero = hero

    // Undead Regen: enemies recover 4% max HP each turn
    if (!hero.isPlayer && this.mechanics.includes('undead_regen')) {
      const regen = Math.floor(hero.maxHp * 0.04)
      const actual = hero.heal(regen)
      if (actual > 0) this.logMessage(`${hero.name} regenerates ${actual} HP.`)
    }

    // Tick status effects at start of turn
    const { dotEffects } = hero.tickStatusEffects()
    for (const dot of dotEffects) {
      this.logMessage(`${hero.name} takes ${dot.damage} ${dot.type} damage.`)
    }
    if (hero.isDead) {
      this.logMessage(`${hero.name} was defeated by status damage.`)
      return this._checkBattleEnd() ?? this.nextTurn()
    }

    hero.tickSkillCooldowns()

    if (!hero.canAct()) {
      this.logMessage(`${hero.name} is unable to act this turn.`)
      return this.nextTurn()
    }

    if (hero.isPlayer) {
      this.state = BattleState.SELECTING_SKILL
    } else {
      this.state = BattleState.ENEMY_TURN
    }

    return { state: this.state, activeHero: hero }
  }

  // Called when player picks a skill index
  selectSkill(skillIndex) {
    const skill = this.activeHero.skills[skillIndex]
    if (!skill || !skill.isReady()) return null
    this.pendingSkill = { skill, skillIndex }

    if (this._skillNeedsTarget(skill)) {
      this.state = BattleState.SELECTING_TARGET
      return { state: this.state, skill }
    }

    return this.executeSkill(this.activeHero, skill, null, skillIndex)
  }

  // Called when player picks a target
  selectTarget(target) {
    if (!this.pendingSkill) return null
    const { skill, skillIndex } = this.pendingSkill
    return this.executeSkill(this.activeHero, skill, target, skillIndex)
  }

  executeSkill(caster, skill, explicitTarget, skillIndex = 0) {
    const targets = this._resolveTargets(caster, skill, explicitTarget)
    const results = []
    const actionHits = []

    for (const effect of skill.effects) {
      for (let hit = 0; hit < (effect.hits ?? 1); hit++) {
        for (const target of targets) {
          if (target.isDead) continue
          const result = this._applyEffect(caster, target, effect)
          results.push({ target, ...result })

          if (result.damage) {
            this.logMessage(`${caster.name} uses ${skill.name} on ${target.name} for ${result.damage} damage${result.crit ? ' (CRIT!)' : ''}.`)
          }
          if (result.heal) {
            this.logMessage(`${caster.name} heals ${target.name} for ${result.heal} HP.`)
          }
          if (result.statusApplied) {
            this.logMessage(`${target.name} is afflicted with ${result.statusApplied}.`)
          }
          if (target.isDead) {
            this.logMessage(`${target.name} has been defeated!`)
            // Revival mechanic: boss rises once at 30% HP
            if (!target.isPlayer && target.canRevive && !this.revivedIds.has(target.id) && this.mechanics.includes('revival')) {
              this.revivedIds.add(target.id)
              target.isDead = false
              target.hp = Math.floor(target.maxHp * 0.30)
              this.logMessage(`☠ ${target.name} refuses to fall — rising at 30% HP! Burst now!`)
            }
          }

          if (result.damage > 0 || result.heal > 0) {
            actionHits.push({
              targetId: target.id,
              damage:   result.damage ?? 0,
              heal:     result.heal   ?? 0,
              crit:     !!result.crit,
              died:     target.isDead,
            })
          }
        }
      }
    }

    const action = {
      seq:            ++this._actionSeq,
      casterId:       caster.id,
      casterIsPlayer: caster.isPlayer,
      skillName:      skill.name,
      skillIndex,
      hits:           actionHits,
    }

    skill.use()
    this.pendingSkill = null
    this.state = BattleState.IDLE

    const battleEnd = this._checkBattleEnd()
    if (battleEnd) return { ...battleEnd, action }

    const next = this.nextTurn()
    return next ? { ...next, action } : { action }
  }

  _applyEffect(caster, target, effect) {
    const result = {}

    if (effect.type === EffectType.DAMAGE) {
      const affinityMult = getAffinityMultiplier(caster.affinity, target.affinity)
      const isCrit = Math.random() < caster.critRate
      const critMult = isCrit ? (1 + caster.critDmg) : 1
      const slayerMult = (caster.slayerUndead > 0 && target.enemyType === 'undead')
        ? (1 + caster.slayerUndead) : 1
      // Damage formula: ATK * multiplier * affinity * slayer / (1 + DEF/1000)
      const raw = caster.atk * effect.multiplier * affinityMult * critMult * slayerMult
      const mitigated = raw / (1 + target.def / 1000)
      const damage = Math.floor(mitigated)
      const dealt = target.takeDamage(damage)
      result.damage = dealt
      result.crit = isCrit

    } else if (effect.type === EffectType.HEAL) {
      const amount = effect.healPercent
        ? Math.floor(target.maxHp * effect.healPercent)
        : Math.floor(caster.atk * effect.multiplier)
      result.heal = target.heal(amount)

    } else if (effect.type === EffectType.DEBUFF && effect.statusEffect) {
      const resistChance = Math.max(0, target.resistance - caster.accuracy)
      if (Math.random() > resistChance) {
        const applied = target.applyStatus(effect.statusEffect, effect.statusDuration, effect.buffValue || null)
        if (applied) result.statusApplied = effect.statusEffect
      }

    } else if (effect.type === EffectType.BUFF && effect.statusEffect) {
      target.applyStatus(effect.statusEffect, effect.statusDuration, effect.buffValue || null)
      result.statusApplied = effect.statusEffect
    }

    return result
  }

  _resolveTargets(caster, skill, explicitTarget) {
    const enemies = caster.isPlayer ? this.livingEnemies : this.livingPlayers
    const allies  = caster.isPlayer ? this.livingPlayers : this.livingEnemies

    switch (skill.targetType) {
      case TargetType.SINGLE_ENEMY: {
        if (explicitTarget) return [explicitTarget]
        if (!caster.isPlayer) {
          const provoked = enemies.find(e => e.hasStatus(StatusEffect.PROVOKE))
          if (provoked) return [provoked]
        }
        return [enemies[0]]
      }
      case TargetType.ALL_ENEMIES:    return enemies
      case TargetType.RANDOM_ENEMY:   return [enemies[Math.floor(Math.random() * enemies.length)]]
      case TargetType.SINGLE_ALLY:    return explicitTarget ? [explicitTarget] : [allies[0]]
      case TargetType.ALL_ALLIES:     return allies
      case TargetType.SELF:           return [caster]
      default:                        return [enemies[0]]
    }
  }

  _skillNeedsTarget(skill) {
    return skill.targetType === TargetType.SINGLE_ENEMY || skill.targetType === TargetType.SINGLE_ALLY
  }

  _checkBattleEnd() {
    if (this.livingPlayers.length === 0) {
      this.state = BattleState.DEFEAT
      this.logMessage('💀 Your team has been defeated.')
      return { state: BattleState.DEFEAT }
    }
    if (this.livingEnemies.length === 0) {
      this.state = BattleState.VICTORY
      this.logMessage('🏆 Victory! All enemies defeated.')
      return { state: BattleState.VICTORY }
    }
    return null
  }

  logMessage(msg) {
    this.log.unshift({ id: Date.now() + Math.random(), text: msg, turn: this.turn })
  }
}
