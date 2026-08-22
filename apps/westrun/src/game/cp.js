// Combat Power formula — weighted sum of a Hero's effective stats
export function computeCP(hero) {
  return Math.round(
    hero.baseHp   * 0.05 +
    hero.baseAtk  * 1.5  +
    hero.baseDef  * 1.5  +
    hero.baseSpd  * 8    +
    hero.critRate * 500  +
    hero.critDmg  * 100
  )
}

export function formatCP(cp) {
  if (cp >= 1000) return (cp / 1000).toFixed(1) + 'k'
  return String(cp)
}
