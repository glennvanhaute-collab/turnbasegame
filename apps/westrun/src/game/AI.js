import { TargetType } from './Skill.js'

// Weights for AI skill selection: prefers skills with higher utility
function scoreSkill(skill, caster, allies, enemies) {
  if (!skill.isReady()) return -1

  let score = 0
  for (const effect of skill.effects) {
    if (effect.type === 'damage')  score += (effect.multiplier ?? 1) * (effect.hits ?? 1) * 10
    if (effect.type === 'heal')    score += (effect.healPercent ?? 0) * 100 + 5
    if (effect.type === 'debuff')  score += 6
    if (effect.type === 'buff')    score += 5
  }
  return score
}

function pickTarget(skill, caster, allies, enemies, shroudActive = new Set()) {
  switch (skill.targetType) {
    case TargetType.SINGLE_ENEMY: {
      // Shroud: exclude untargetable heroes; fall back to full pool if all are shrouded
      const targetable = enemies.filter(e => !shroudActive.has(e.id))
      const pool = targetable.length > 0 ? targetable : enemies
      // Target lowest HP enemy (focus fire)
      return pool.reduce((a, b) => (a.hp / a.maxHp < b.hp / b.maxHp ? a : b))
    }

    case TargetType.SINGLE_ALLY:
      // Heal the most wounded ally
      return allies.reduce((a, b) => (a.hp / a.maxHp < b.hp / b.maxHp ? a : b))

    case TargetType.SELF:
      return caster

    // AoE targets are resolved by the engine; return null to let it handle
    default:
      return null
  }
}

export function runAI(engine) {
  const caster = engine.activeHero
  const allies  = caster.isPlayer ? engine.livingPlayers : engine.livingEnemies
  const enemies = caster.isPlayer ? engine.livingEnemies : engine.livingPlayers

  const scoredSkills = caster.skills
    .map((skill, index) => ({ skill, index, score: scoreSkill(skill, caster, allies, enemies) }))
    .filter(s => s.score >= 0)
    .sort((a, b) => b.score - a.score)

  if (scoredSkills.length === 0) return engine.nextTurn()

  const chosen = scoredSkills[0]
  const target = pickTarget(chosen.skill, caster, allies, enemies, engine._shroudActive)

  return engine.executeSkill(caster, chosen.skill, target, chosen.index)
}
