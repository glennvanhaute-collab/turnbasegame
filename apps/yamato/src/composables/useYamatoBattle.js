import { reactive, computed } from 'vue'
import { STATUS_META, PALETTE } from '../game/data/units.js'
import { SKILL_FX } from '../game/data/skillFxLibrary.js'

// Reactive port of the Yamato demo battle engine.
// Visuals are dispatched through SKILL_FX (52-skill library) via each skill's fxId,
// so skill definitions there are consumed as-is and never modified.
export function useYamatoBattle(fx, hooks = {}) {
  const {
    onBanner  = () => {},
    onLog     = () => {},
    onFloat   = () => {},
    onShake   = () => {},
    onPulse   = () => {},
    onHit     = () => {},
    onEclipse = () => {},
    onEnd     = () => {},
  } = hooks

  const state = reactive({
    allies: [], enemies: [],
    round: 1, currentUid: null, queue: [], queueIndex: 0,
    busy: true, over: false, started: false, victory: false,
    selectedTargetUid: null,
    damageDealt: 0, damageTaken: 0,
    lastEnemyTargetUid: null,
    speed: 1, auto: false,
  })

  // ── Helpers ──────────────────────────────────────────────────────
  const sleep     = ms => new Promise(r => setTimeout(r, ms / state.speed))
  const clamp     = (v, a, b) => Math.max(a, Math.min(b, v))
  const allActors = () => [...state.allies, ...state.enemies]
  const getActor  = uid => allActors().find(a => a.uid === uid)
  const living    = arr => arr.filter(a => !a.dead && a.hp > 0)
  const statusOf  = (actor, id) => actor.statuses.find(s => s.id === id)
  const activeActor = () => getActor(state.currentUid)

  const effectiveSpeed = actor => {
    let v = actor.speed
    if (statusOf(actor, 'speedUp')) v *= 1.15
    return v
  }
  const effectiveDefense = actor => {
    let v = actor.def
    if (statusOf(actor, 'defDown')) v *= 0.7
    if (statusOf(actor, 'defUp'))   v *= 1.3
    return v
  }

  function makeActor(template, idx) {
    return {
      ...template,
      uid: `${template.team}-${template.id}-${idx}`,
      hp: template.maxHp, shield: 0, statuses: [],
      cooldowns: template.skills.map(() => 0),
      dead: false, orderTiebreak: idx,
    }
  }

  function addStatus(actor, id, turns) {
    const s = statusOf(actor, id)
    if (s) s.turns = Math.max(s.turns, turns)
    else actor.statuses.push({ id, turns })
  }

  // ── Setup ────────────────────────────────────────────────────────
  function setup(ground) {
    state.allies  = ground.allies.map(makeActor)
    state.enemies = ground.enemies.map(makeActor)
    state.round = 1; state.queueIndex = 0
    state.busy = true; state.over = false; state.started = false; state.victory = false
    state.damageDealt = 0; state.damageTaken = 0
    state.lastEnemyTargetUid = null
    state.selectedTargetUid = living(state.enemies)[0]?.uid ?? null
    buildQueue()
  }

  function buildQueue() {
    state.queue = allActors()
      .filter(a => !a.dead)
      .sort((a, b) => effectiveSpeed(b) - effectiveSpeed(a) || a.orderTiebreak - b.orderTiebreak)
      .map(a => a.uid)
    state.queueIndex = 0
    state.currentUid = state.queue[0] ?? null
  }

  function advanceQueue() {
    if (!living(state.allies).length || !living(state.enemies).length) return
    state.queueIndex++
    if (state.queueIndex >= state.queue.length) {
      state.round++
      buildQueue()
    } else {
      state.currentUid = state.queue[state.queueIndex]
      const a = activeActor()
      if (!a || a.dead) advanceQueue()
    }
  }

  // ── Display selection (drives the big stage portraits) ───────────
  const displayedAlly = computed(() => {
    const actor = activeActor()
    if (actor?.team === 'ally') return actor
    if (state.lastEnemyTargetUid) {
      const a = getActor(state.lastEnemyTargetUid)
      if (a && !a.dead) return a
    }
    return living(state.allies)[0] ?? null
  })

  const displayedEnemy = computed(() => {
    const actor = activeActor()
    if (actor?.team === 'enemy') return actor
    const t = getActor(state.selectedTargetUid)
    return (!t || t.dead) ? (living(state.enemies)[0] ?? null) : t
  })

  const turnOrder = computed(() =>
    [...state.queue.slice(state.queueIndex), ...state.queue.slice(0, state.queueIndex)]
      .map(getActor).filter(Boolean)
  )

  const aliveAllies  = computed(() => living(state.allies).length)
  const aliveEnemies = computed(() => living(state.enemies).length)

  // ── Damage ───────────────────────────────────────────────────────
  function rollDamage(attacker, defender, mult, opts = {}) {
    const def = effectiveDefense(defender) * (1 - (opts.ignoreDef || 0))
    const mitigation = 5000 / (5000 + def)
    let amount = attacker.atk * mult * mitigation
    if (statusOf(defender, 'weaken')) amount *= 1.15
    amount *= 0.94 + Math.random() * 0.12
    const crit = Math.random() < (opts.forceCrit ? 1 : attacker.crit)
    if (crit) amount *= attacker.critDamage
    return { amount: Math.max(1, Math.round(amount)), crit }
  }

  function applyRawDamage(target, amount) {
    const shieldHit = Math.min(target.shield, amount)
    target.shield -= shieldHit
    const hpHit = amount - shieldHit
    target.hp = Math.max(0, target.hp - hpHit)
    if (target.hp <= 0) target.dead = true
    return { shieldHit, hpHit }
  }

  function deal(attacker, defender, mult, opts = {}) {
    const rolled  = rollDamage(attacker, defender, mult, opts)
    const applied = applyRawDamage(defender, rolled.amount)
    if (attacker.team === 'ally') state.damageDealt += applied.hpHit + applied.shieldHit
    else                          state.damageTaken += applied.hpHit + applied.shieldHit
    return { ...rolled, ...applied }
  }

  // ── FX dispatch — reads the untouched SKILL_FX library ───────────
  // Library entries use five signatures; the shape of arg 3 is predicted by the
  // entry's own `type` field ('team…' → ally array, 'aoe…' → target array, else scalar):
  //   (fx, caster)                     (fx, caster, targetId)     (fx, caster, targetIds)
  //   (fx, caster, allyIds)            (fx, caster, allyIds, targetIds)
  function playSkillFx(skill, casterUid, targetUid, ctx = {}) {
    const entry = SKILL_FX[skill.fxId]
    const caster = getActor(casterUid)
    const allyUids   = ctx.allyUids   ?? living(caster?.team === 'ally' ? state.allies : state.enemies).map(a => a.uid)
    const targetUids = ctx.targetUids ?? (targetUid ? [targetUid] : [])

    if (entry?.fx) {
      try {
        const arity = entry.fx.length
        if (arity <= 2) {
          entry.fx(fx, casterUid)
        } else if (arity >= 4) {
          entry.fx(fx, casterUid, allyUids, targetUids)
        } else if (/team/i.test(entry.type ?? '')) {
          entry.fx(fx, casterUid, allyUids)
        } else if (/aoe/i.test(entry.type ?? '')) {
          entry.fx(fx, casterUid, targetUids)
        } else {
          entry.fx(fx, casterUid, targetUid)
        }
        return
      } catch (err) {
        if (import.meta.env.DEV) console.warn(`[yamato] FX "${skill.fxId}" threw:`, err)
      }
    }
    // Fallback if fxId is missing or the effect throws
    if (targetUid) {
      fx.brushFx(casterUid, targetUid, caster?.team === 'ally' ? PALETTE.ally : PALETTE.enemy)
    } else {
      fx.sealFx(casterUid, PALETTE.magic)
    }
  }

  function bannerFor(skill) {
    return SKILL_FX[skill.fxId]?.banner ?? skill.name.toUpperCase()
  }

  // ── Skill resolution ─────────────────────────────────────────────
  async function resolveSkill(actor, idx) {
    const skill = actor.skills[idx]
    const isAlly = actor.team === 'ally'
    const foes   = isAlly ? state.enemies : state.allies
    const team   = isAlly ? state.allies  : state.enemies
    const target = isAlly ? currentTarget() : chooseEnemyTarget(actor)

    onBanner(bannerFor(skill))
    onLog(`${actor.name} — ${skill.name}.`)
    if (skill.cd) actor.cooldowns[idx] = skill.cd

    // ── Self shield ──
    if (skill.kind === 'selfShield') {
      playSkillFx(skill, actor.uid, actor.uid)
      const amount = Math.round(actor.maxHp * skill.shieldPct)
      actor.shield += amount
      if (skill.buff) addStatus(actor, skill.buff, 2)
      onFloat(actor.uid, amount, 'shield')
      await sleep(340)
      return
    }

    // ── Self heal ──
    if (skill.kind === 'selfHeal') {
      playSkillFx(skill, actor.uid, actor.uid)
      const before = actor.hp
      actor.hp = Math.min(actor.maxHp, actor.hp + Math.round(actor.maxHp * skill.healPct))
      onFloat(actor.uid, actor.hp - before, 'heal')
      await sleep(320)
      return
    }

    // ── Team shield ──
    if (skill.kind === 'shield') {
      const mates = living(team)
      playSkillFx(skill, actor.uid, actor.uid, { allyUids: mates.map(a => a.uid) })
      for (const a of mates) {
        const amount = Math.round(a.maxHp * skill.shieldPct)
        a.shield += amount
        if (skill.buff) addStatus(a, skill.buff, 2)
        onFloat(a.uid, amount, 'shield')
      }
      await sleep(360)
      return
    }

    // ── Team heal ──
    if (skill.kind === 'heal') {
      playSkillFx(skill, actor.uid, actor.uid, { allyUids: living(team).map(a => a.uid) })
      for (const a of living(team)) {
        const before = a.hp
        a.hp = Math.min(a.maxHp, a.hp + Math.round(a.maxHp * skill.healPct))
        const healed = a.hp - before
        if (skill.buff) addStatus(a, skill.buff, 2)
        if (healed > 0) onFloat(a.uid, healed, 'heal')
      }
      await sleep(320)
      return
    }

    // ── AoE ──
    if (skill.kind === 'aoe') {
      const targets = living(foes)
      playSkillFx(skill, actor.uid, targets[0]?.uid, { targetUids: targets.map(t => t.uid) })
      await sleep(360)
      for (const foe of targets) {
        const hit = deal(actor, foe, skill.power, {})
        onHit(foe.uid)
        onFloat(foe.uid, hit.amount, hit.crit ? 'crit' : 'damage')
        applyRider(skill, foe)
      }
      onShake(false)
      return
    }

    if (!target) return

    // ── Multi-hit ──
    if (skill.kind === 'multihit') {
      for (let i = 0; i < skill.hits; i++) {
        await executeHit(actor, target, skill.power, skill)
        applyRider(skill, target)
        if (i < skill.hits - 1) await sleep(120)
      }
      return
    }

    // ── Single-target attack ──
    let power = skill.power
    if (skill.debuffScale) {
      power += target.statuses.filter(s => STATUS_META[s.id]?.kind === 'debuff').length * skill.debuffScale
    }
    if (skill.afflictedBonus && target.statuses.length) power += skill.afflictedBonus

    if (skill.eclipse) { onEclipse(true); await sleep(520) }

    await executeHit(actor, target, power, {
      ...skill,
      forceCrit: (skill.critIfMarked && statusOf(target, 'marked')) ||
                 (skill.eclipse && target.hp < target.maxHp * 0.28),
    })

    if (skill.eclipse) onEclipse(false)
    applyRider(skill, target)
  }

  function applyRider(skill, target) {
    if (skill.apply) {
      addStatus(target, skill.apply.id, skill.apply.turns)
      onFloat(target.uid, 0, 'status', STATUS_META[skill.apply.id]?.short ?? '')
    }
    if (skill.apply2) addStatus(target, skill.apply2.id, skill.apply2.turns)
    if (skill.applyChance && Math.random() < skill.applyChance.chance) {
      addStatus(target, skill.applyChance.id, skill.applyChance.turns)
      onFloat(target.uid, 0, 'status', STATUS_META[skill.applyChance.id]?.short ?? '')
    }
  }

  async function executeHit(attacker, target, mult, opts = {}) {
    onPulse(attacker.team, 'attack')
    playSkillFx(opts, attacker.uid, target.uid)
    await sleep(opts.delay || 340)
    const hit = deal(attacker, target, mult, opts)
    onHit(target.uid)
    onPulse(target.team, 'flash')
    onShake(!!opts.heavy)
    onFloat(target.uid, hit.amount, hit.crit ? 'crit' : 'damage')
    return hit
  }

  // ── Targeting / AI ───────────────────────────────────────────────
  function currentTarget() {
    let t = getActor(state.selectedTargetUid)
    if (!t || t.dead) t = living(state.enemies)[0] ?? null
    state.selectedTargetUid = t?.uid ?? null
    return t
  }

  function selectTarget(uid) {
    const t = getActor(uid)
    if (!t || t.dead || t.team !== 'enemy') return
    state.selectedTargetUid = uid
    onLog(`${t.name} selected as target.`)
  }

  function chooseEnemyTarget(actor) {
    const allies = living(state.allies)
    if (!allies.length) return null
    if (actor.ai === 'lowestHp')  return [...allies].sort((a, b) => a.hp - b.hp)[0]
    if (actor.ai === 'lowestDef') return [...allies].sort((a, b) => a.def - b.def)[0]
    if (actor.ai === 'marked') {
      return [...allies].sort((a, b) =>
        (statusOf(b, 'marked') ? 1 : 0) - (statusOf(a, 'marked') ? 1 : 0) || a.hp - b.hp)[0]
    }
    return allies[0]
  }

  function chooseEnemySkill(actor) {
    const ready = i => actor.cooldowns[i] === 0
    // Ultimate first if its condition holds, then A2, else basic.
    const ult = actor.skills[2]
    if (ready(2)) {
      if (ult.kind === 'selfHeal'   && actor.hp < actor.maxHp * 0.75) return 2
      if (ult.kind === 'selfShield' && actor.shield <= 0)             return 2
      if (ult.kind === 'attack') {
        const t = chooseEnemyTarget(actor)
        if (t && t.hp < t.maxHp * 0.7) return 2
      }
    }
    if (ready(1)) {
      const a2 = actor.skills[1]
      if (a2.kind === 'selfShield' && (actor.shield > 0 || actor.hp >= actor.maxHp * 0.7)) return 0
      return 1
    }
    return 0
  }

  function autoChooseSkill(actor) {
    const target = currentTarget()
    const ready  = i => actor.cooldowns[i] === 0
    const hurt   = living(state.allies).some(a => a.hp / a.maxHp < 0.66)
    const s1 = actor.skills[1], s2 = actor.skills[2]

    if (ready(2)) {
      if (s2.kind === 'aoe' && living(state.enemies).length > 1)   return 2
      if (s2.critIfMarked && target && statusOf(target, 'marked')) return 2
      if (s2.debuffScale && target && target.statuses.length >= 2) return 2
      if (s2.apply?.id === 'marked' && target && !statusOf(target, 'marked')) return 2
      if (s2.afflictedBonus && target && target.statuses.length)   return 2
    }
    if (ready(1)) {
      if (s1.kind === 'heal' && hurt)   return 1
      if (s1.kind === 'shield' && living(state.allies).some(a => a.shield < a.maxHp * 0.12)) return 1
    }
    return 0
  }

  // ── Turn flow ────────────────────────────────────────────────────
  function startTurn(actor) {
    if (!actor || actor.dead) return false
    actor.cooldowns = actor.cooldowns.map(c => Math.max(0, c - 1))
    if (statusOf(actor, 'bleed')) {
      const dmg = Math.round(actor.maxHp * 0.04)
      applyRawDamage(actor, dmg)
      onFloat(actor.uid, dmg, 'damage')
      onHit(actor.uid)
      onLog(`${actor.name} suffers Bleed damage.`)
      if (actor.dead) return false
    }
    actor.statuses.forEach(s => s.turns--)
    actor.statuses = actor.statuses.filter(s => s.turns > 0)
    return true
  }

  function checkBattleEnd() {
    if (!living(state.enemies).length || !living(state.allies).length) {
      state.over    = true
      state.busy    = true
      state.victory = living(state.allies).length > 0
      setTimeout(() => onEnd(state.victory), 700 / state.speed)
      return true
    }
    return false
  }

  async function useSkill(idx) {
    const actor = activeActor()
    if (!actor || actor.team !== 'ally' || state.busy || state.over) return
    if (actor.cooldowns[idx] > 0) return
    state.busy = true
    await resolveSkill(actor, idx)
    if (checkBattleEnd()) return
    await sleep(260)
    endTurn()
  }

  async function takeTurn() {
    if (state.over) return
    const actor = activeActor()
    if (!actor || actor.dead) { advanceQueue(); return takeTurn() }
    if (!startTurn(actor)) {
      if (checkBattleEnd()) return
      advanceQueue(); return takeTurn()
    }
    if (checkBattleEnd()) return

    if (actor.team === 'ally') {
      state.busy = false
      onLog(`${actor.name} is ready. Choose a skill.`)
      if (state.auto) {
        await sleep(500)
        if (state.over) return
        currentTarget()
        await useSkill(autoChooseSkill(actor))
      }
      return
    }

    state.busy = true
    const target = chooseEnemyTarget(actor)
    state.lastEnemyTargetUid = target?.uid ?? null
    await sleep(460)
    await resolveSkill(actor, chooseEnemySkill(actor))
    if (checkBattleEnd()) return
    await sleep(300)
    endTurn()
  }

  function endTurn() {
    if (checkBattleEnd()) return
    advanceQueue()
    setTimeout(() => takeTurn(), 180 / state.speed)
  }

  async function begin(ground) {
    setup(ground)
    state.started = true
    onBanner('BATTLE BEGINS')
    onLog('The Yamato vanguard enters the painted field.')
    await sleep(620)
    state.busy = true
    takeTurn()
  }

  function toggleAuto() {
    state.auto = !state.auto
    if (state.auto && !state.busy && !state.over && activeActor()?.team === 'ally') {
      setTimeout(() => useSkill(autoChooseSkill(activeActor())), 300 / state.speed)
    }
  }

  function toggleSpeed() { state.speed = state.speed === 1 ? 2 : 1 }

  return {
    state, setup, begin, useSkill, selectTarget, toggleAuto, toggleSpeed,
    displayedAlly, displayedEnemy, turnOrder, aliveAllies, aliveEnemies,
    activeActor, effectiveSpeed, effectiveDefense, getActor, clamp,
  }
}
