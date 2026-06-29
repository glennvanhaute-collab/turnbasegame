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
    this.revivedIds        = new Set()
    this._openerUsed       = new Set()  // hero IDs that have consumed their opener bonus
    this._steadfastTriggered = new Set() // hero IDs that have triggered steadfast this battle
    this._shroudActive     = new Set()  // hero IDs currently untargetable (leather 6pc Shroud)
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

  get shroudActive() { return this._shroudActive }

  startBattle() {
    this.log = []
    this.state = BattleState.IDLE
    this.logMessage('⚔️ Battle started!')
    // Shroud: leather 6pc — apply untargetable status to qualifying player heroes
    for (const hero of this.playerTeam) {
      if (hero.passives?.has('shroud')) {
        this._shroudActive.add(hero.id)
        this.logMessage(`🌑 ${hero.name} fades into shadow — untargetable this turn.`)
      }
    }
    return this.nextTurn()
  }

  nextTurn() {
    const hero = this.advanceToNextTurn()
    if (!hero) return this._checkBattleEnd()

    this.turn++
    this.activeHero = hero

    // Shroud: hero steps out of shadow when they take their own turn
    this._shroudActive.delete(hero.id)

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
    const isAoe = targets.length > 1
    const results = []
    const actionHits = []

    for (const effect of skill.effects) {
      for (let hit = 0; hit < (effect.hits ?? 1); hit++) {
        for (const target of targets) {
          if (target.isDead) continue
          const result = this._applyEffect(caster, target, effect, isAoe, skill)
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
            // Execute: warrior passive — gain turn meter on kill
            if (caster.isPlayer && !target.isPlayer && caster.passives?.has('execute')) {
              const bonus = caster.passives.has('execute_boosted') ? 60 : 40
              caster.turnMeter = Math.min(100, caster.turnMeter + bonus)
              if (caster.passives.has('execute_boosted')) caster.applyStatus(StatusEffect.INCREASE_ATK, 1, 0.20)
              this.logMessage(`⚡ ${caster.name}'s Execute — +${bonus} turn meter!`)
            }
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

    // Steadfast: plate 6pc — shield triggers when a player hero drops below 30% HP (once per battle)
    for (const hero of this.livingPlayers) {
      if (hero.passives?.has('steadfast') && !this._steadfastTriggered.has(hero.id) && hero.hp < hero.maxHp * 0.30) {
        this._steadfastTriggered.add(hero.id)
        const shieldAmt = Math.floor(hero.maxHp * 0.10)
        hero.applyStatus(StatusEffect.SHIELD, 999, shieldAmt)
        this.logMessage(`🛡 ${hero.name}'s Steadfast triggers — absorbed ${shieldAmt} damage!`)
        actionHits.push({ targetId: hero.id, damage: 0, heal: 0, crit: false, died: false, shield: shieldAmt })
      }
    }

    skill.use()
    this.pendingSkill = null
    this.state = BattleState.IDLE

    const battleEnd = this._checkBattleEnd()
    if (battleEnd) return { ...battleEnd, action }

    const next = this.nextTurn()
    return next ? { ...next, action } : { action }
  }

  _applyEffect(caster, target, effect, isAoe = false, skill = null) {
    const result = {}

    if (effect.type === EffectType.DAMAGE) {
      const affinityMult = getAffinityMultiplier(caster.affinity, target.affinity)
      const isCrit = Math.random() < caster.critRate
      const critMult = isCrit ? (1 + caster.critDmg) : 1
      const slayerMult = (caster.slayerUndead > 0 && target.enemyType === 'undead')
        ? (1 + caster.slayerUndead) : 1
      // Opener (leather 6pc): first action deals 25% bonus damage
      const openerMult = (caster.passives?.has('opener') && !this._openerUsed.has(caster.id)) ? 1.25 : 1
      if (openerMult > 1) this._openerUsed.add(caster.id)
      // AOE Amplify (cloth 6pc): AOE skills deal 15% more damage
      const aoeMult = (isAoe && caster.passives?.has('aoe_amplify')) ? 1.15 : 1
      // Spellweave: mage passive — skills that apply a status deal bonus damage
      const skillHasStatus = skill?.effects?.some(e => e.statusEffect) ?? false
      const spellweaveMult = (skillHasStatus && caster.passives?.has('spellweave'))
        ? (caster.passives.has('spellweave_boosted') ? 1.20 : 1.12) : 1
      // Mark: target takes bonus damage when marked
      const markMult = target.hasStatus(StatusEffect.MARKED) ? (caster.passives?.has('mark_boosted') ? 1.20 : 1.15) : 1
      // Damage formula
      const raw = caster.atk * effect.multiplier * affinityMult * critMult * slayerMult * openerMult * aoeMult * spellweaveMult * markMult
      const mitigated = raw / (1 + target.def / 1000)
      // Grit: tank passive — reduce large incoming hits
      let damage = Math.floor(mitigated)
      if (target.passives?.has('grit') && damage > target.maxHp * 0.15) {
        damage = Math.floor(damage * (target.passives.has('grit_boosted') ? 0.70 : 0.80))
      }
      const dealt = target.takeDamage(damage)
      result.damage = dealt
      result.crit = isCrit
      // Mark application: ranger passive — chance to mark on single-target hits
      if (!isAoe && dealt > 0 && caster.isPlayer && !target.isPlayer && caster.passives?.has('mark')) {
        const markChance = caster.passives.has('mark_boosted') ? 0.40 : 0.25
        if (Math.random() < markChance) {
          target.applyStatus(StatusEffect.MARKED, caster.passives.has('mark_boosted') ? 2 : 1)
          result.marked = true
        }
      }

    } else if (effect.type === EffectType.HEAL) {
      let amount = effect.healPercent
        ? Math.floor(target.maxHp * effect.healPercent)
        : Math.floor(caster.atk * effect.multiplier)
      // Mending: healer passive — extra heal amount
      if (caster.passives?.has('mending')) {
        amount += Math.floor(target.maxHp * (caster.passives.has('mending_boosted') ? 0.08 : 0.05))
      }
      result.heal = target.heal(amount)
      // Mending+: remove one debuff from the healed target
      if (caster.passives?.has('mending_boosted') && result.heal > 0) {
        this._removeOneDebuff(target)
      }

    } else if (effect.type === EffectType.DEBUFF && effect.statusEffect) {
      let resistChance = Math.max(0, target.resistance - caster.accuracy)
      // Spellweave+: status effects are harder to resist
      if (caster.passives?.has('spellweave_boosted')) resistChance = Math.max(0, resistChance - 0.15)
      if (Math.random() > resistChance) {
        let duration = effect.statusDuration
        // Lingering Curse: debuffer passive — debuffs last longer
        if (caster.passives?.has('lingering_curse')) duration += caster.passives.has('lingering_curse_boosted') ? 2 : 1
        const applied = target.applyStatus(effect.statusEffect, duration, effect.buffValue || null)
        if (applied) {
          result.statusApplied = effect.statusEffect
          // Lingering Curse+: also poison the target when a debuff lands
          if (caster.passives?.has('lingering_curse_boosted')) target.applyStatus(StatusEffect.POISON, duration)
        }
      }

    } else if (effect.type === EffectType.BUFF && effect.statusEffect) {
      target.applyStatus(effect.statusEffect, effect.statusDuration, effect.buffValue || null)
      result.statusApplied = effect.statusEffect
    }

    return result
  }

  _removeOneDebuff(hero) {
    const DEBUFF_TYPES = [
      StatusEffect.POISON, StatusEffect.BURN, StatusEffect.FREEZE, StatusEffect.STUN,
      StatusEffect.WEAKEN, StatusEffect.DECREASE_ATK, StatusEffect.DECREASE_DEF, StatusEffect.DECREASE_SPD, StatusEffect.SLEEP,
    ]
    const idx = hero.statusEffects.findIndex(se => DEBUFF_TYPES.includes(se.type))
    if (idx >= 0) hero.statusEffects.splice(idx, 1)
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
          // Shroud: exclude untargetable heroes; fall back to full pool if all are shrouded
          const targetable = enemies.filter(e => !this._shroudActive.has(e.id))
          const pool = targetable.length > 0 ? targetable : enemies
          return [pool.reduce((a, b) => (a.hp / a.maxHp < b.hp / b.maxHp ? a : b))]
        }
        return [enemies[0]]
      }
      case TargetType.ALL_ENEMIES:    return enemies
      case TargetType.RANDOM_ENEMY: {
        if (!caster.isPlayer) {
          const targetable = enemies.filter(e => !this._shroudActive.has(e.id))
          const pool = targetable.length > 0 ? targetable : enemies
          return [pool[Math.floor(Math.random() * pool.length)]]
        }
        return [enemies[Math.floor(Math.random() * enemies.length)]]
      }
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
