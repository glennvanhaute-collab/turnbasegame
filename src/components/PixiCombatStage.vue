<template>
  <div ref="stageEl" class="combat-stage">

    <!-- Floating numbers -->
    <div
      v-for="n in floatingNumbers"
      :key="n.id"
      class="float-num"
      :class="n.cls"
      :style="n.style"
    >{{ n.text }}</div>

    <div class="stage-divider" />
    <span class="stage-label stage-label--left">YOUR TEAM</span>
    <span class="stage-label stage-label--right">ENEMIES</span>

    <!-- Player units -->
    <div
      v-for="(hero, i) in store.playerTeam"
      :key="hero.id"
      class="hero-unit"
      :class="unitClasses(hero, false)"
      :style="unitStyle(PLAYER_SLOTS, i, hero)"
      :data-id="hero.id"
    >
      <div class="avatar-anim" :style="{ width: SZ + 'px', height: SZ + 'px' }">
        <HeroAvatar :hero="hero" :size="SZ" noBorder />
        <div class="anim-flash" :class="{ on: hitIds.has(hero.id) }" />
        <div class="anim-veil"  :class="{ on: hero.isDead }" />
      </div>
      <div class="anim-ring active-ring" :class="{ on: store.activeHero?.id === hero.id }" />
      <div class="hero-name" :class="[{ leader: i === 0 }, hero.rarity?.toLowerCase()]">{{ i === 0 ? '★ ' : '' }}{{ hero.name }}</div>
      <div class="hp-track"><div class="hp-fill" :class="hpCls(hero)" :style="{ width: hpPct(hero) + '%' }" /></div>
    </div>

    <!-- Enemy units -->
    <div
      v-for="(hero, i) in store.enemyTeam"
      :key="hero.id"
      class="hero-unit enemy"
      :class="unitClasses(hero, true)"
      :style="unitStyle(ENEMY_SLOTS, i, hero)"
      :data-id="hero.id"
      @click="onEnemyClick(hero)"
    >
      <div class="avatar-anim" :style="{ width: SZ + 'px', height: SZ + 'px' }">
        <HeroAvatar :hero="hero" :size="SZ" noBorder />
        <div class="anim-flash" :class="{ on: hitIds.has(hero.id) }" />
        <div class="anim-veil"  :class="{ on: hero.isDead }" />
      </div>
      <div class="anim-ring active-ring" :class="{ on: store.activeHero?.id === hero.id }" />
      <div class="anim-ring target-ring" :class="{ on: isSelectingTarget && !hero.isDead }" />
      <div class="hero-name" :class="[{ leader: i === 0 }, hero.rarity?.toLowerCase()]">{{ i === 0 ? '★ ' : '' }}{{ hero.name }}</div>
      <div class="hp-track"><div class="hp-fill" :class="hpCls(hero)" :style="{ width: hpPct(hero) + '%' }" /></div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useBattleStore } from '../stores/useBattleStore.js'
import { BattleState } from '../game/BattleEngine.js'
import HeroAvatar from './HeroAvatar.vue'

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 800)
const onResize = () => { windowWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
const SZ = computed(() => windowWidth.value <= 500 ? 58 : 92)

const store   = useBattleStore()
const stageEl = ref(null)

const PLAYER_SLOTS = [
  { xf: 0.40, yf: 0.50 },   // leader — centre of player half
  { xf: 0.26, yf: 0.27 },   // 2nd — top
  { xf: 0.26, yf: 0.73 },   // 3rd — bottom
  { xf: 0.12, yf: 0.27 },   // 4th — top far
  { xf: 0.12, yf: 0.73 },   // 5th — bottom far
]
const ENEMY_SLOTS = PLAYER_SLOTS.map(p => ({ xf: 1 - p.xf, yf: p.yf }))

function unitStyle(slots, i, hero) {
  const s = slots[Math.min(i, slots.length - 1)]
  const style = { left: `${s.xf * 100}%`, top: `${s.yf * 100}%` }
  if (lungingIds.value.has(hero.id)) style['--lunge-ms'] = timings().lungeMs + 'ms'
  return style
}

function hpPct(hero) { return hero.maxHp > 0 ? Math.max(0, (hero.hp / hero.maxHp) * 100) : 0 }
function hpCls(hero) {
  const p = hpPct(hero) / 100
  return p > 0.55 ? 'hp-green' : p > 0.28 ? 'hp-orange' : 'hp-red'
}

// ── Animation state ────────────────────────────────────────────────
const lungingIds      = ref(new Set())
const hitIds          = ref(new Set())
const floatingNumbers = ref([])
let   numCounter      = 0

function timings() {
  const s = store.battleSpeed
  if (s === 3) return { lungeMs: 160, numMs: 400,  impactMs: 55  }
  if (s === 2) return { lungeMs: 350, numMs: 750,  impactMs: 120 }
  return             { lungeMs: 520, numMs: 1000, impactMs: 180 }
}

const isSelectingTarget = computed(() => store.state === BattleState.SELECTING_TARGET)

function unitClasses(hero, isEnemy) {
  const lunging = lungingIds.value.has(hero.id)
  return {
    dead:            hero.isDead,
    hit:             hitIds.value.has(hero.id),
    'lunge-right':   lunging && !isEnemy,
    'lunge-left':    lunging &&  isEnemy,
    'can-target':    isSelectingTarget.value && isEnemy && !hero.isDead,
  }
}

function onEnemyClick(hero) {
  if (isSelectingTarget.value && !hero.isDead) store.selectTarget(hero)
}

function spawnNumber(hit) {
  const el = stageEl.value?.querySelector(`[data-id="${hit.targetId}"]`)
  if (!el || !stageEl.value) return
  const rect  = el.getBoundingClientRect()
  const sRect = stageEl.value.getBoundingClientRect()
  const x = rect.left - sRect.left + rect.width  / 2
  const y = rect.top  - sRect.top  + rect.height / 2 - 46

  const isHeal = (hit.heal ?? 0) > 0
  const isCrit = hit.crit
  const value  = hit.damage || hit.heal || 0
  const id     = numCounter++

  floatingNumbers.value.push({
    id,
    text:  (isHeal ? '+' : '') + value,
    cls:   isHeal ? 'num-heal' : isCrit ? 'num-crit' : 'num-dmg',
    style: {
      left:             x + 'px',
      top:              y + 'px',
      '--num-duration': timings().numMs + 'ms',
      fontSize:         isCrit ? '1.6rem' : '1.1rem',
    },
  })
  setTimeout(() => {
    floatingNumbers.value = floatingNumbers.value.filter(n => n.id !== id)
  }, timings().numMs + 100)
}

function setAdd(s, id)    { return new Set([...s, id]) }
function setRemove(s, id) { return new Set([...s].filter(x => x !== id)) }

watch(() => store.lastAction, (action) => {
  if (!action?.hits?.length) return
  const t  = timings()
  const id = action.casterId

  lungingIds.value = setAdd(lungingIds.value, id)
  setTimeout(() => { lungingIds.value = setRemove(lungingIds.value, id) }, t.lungeMs)

  setTimeout(() => {
    for (const hit of action.hits) {
      hitIds.value = setAdd(hitIds.value, hit.targetId)
      setTimeout(() => { hitIds.value = setRemove(hitIds.value, hit.targetId) }, 300)
      spawnNumber(hit)
    }
  }, t.lungeMs * 0.42)
})

watch(() => store.battleKey, () => {
  lungingIds.value      = new Set()
  hitIds.value          = new Set()
  floatingNumbers.value = []
})
</script>

<style scoped>
.combat-stage {
  position: relative;
  width: 100%;
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background:
    linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.35) 100%),
    url('../assets/backgrounds/battleground_background.png') center / cover no-repeat;
  border: 1px solid #3e1c0c;
}

.stage-divider {
  position: absolute;
  left: 50%; top: 14px; bottom: 14px;
  width: 1px;
  background: #3e1c0c;
  transform: translateX(-50%);
  pointer-events: none;
}
.stage-label {
  position: absolute;
  top: 10px;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #3a3030;
  text-transform: uppercase;
  pointer-events: none;
}
.stage-label--left  { left:  14px; }
.stage-label--right { right: 14px; }

/* ── Hero unit slot ──────────────────────────────────────────────── */
.hero-unit {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 130px;
  transition: opacity 0.4s;
}
.hero-unit.dead { opacity: 0.3; }
.hero-unit.can-target { cursor: crosshair; }

/* Lunge */
@keyframes lunge-right {
  0%, 100% { transform: translate(-50%, -50%); }
  42%      { transform: translate(calc(-50% + 55px), -50%); }
}
@keyframes lunge-left {
  0%, 100% { transform: translate(-50%, -50%); }
  42%      { transform: translate(calc(-50% - 55px), -50%); }
}
.hero-unit.lunge-right { animation: lunge-right var(--lunge-ms, 520ms) ease both; }
.hero-unit.lunge-left  { animation: lunge-left  var(--lunge-ms, 520ms) ease both; }

/* Hit shake — on the avatar-anim wrapper so name/HP stay still */
@keyframes hit-shake {
  0%   { transform: translateX(0); }
  15%  { transform: translateX(-11px); }
  35%  { transform: translateX(8px); }
  55%  { transform: translateX(-5px); }
  75%  { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
.hero-unit.hit .avatar-anim { animation: hit-shake 0.28s ease both; }

/* ── Avatar animation wrapper ────────────────────────────────────── */
.avatar-anim {
  position: relative;
  border-radius: 50%;
  flex-shrink: 0;
  overflow: hidden;
}

/* Hit flash */
.anim-flash {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: white;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
}
.anim-flash.on { opacity: 0.8; transition: opacity 0s; }

/* Death veil */
.anim-veil {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.65);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.45s;
}
.anim-veil.on { opacity: 1; }

/* Active / target rings — sit outside the avatar circle */
@keyframes pulse-ring {
  0%, 100% { opacity: 0.5; box-shadow: 0 0 6px 0px currentColor; }
  50%       { opacity: 1.0; box-shadow: 0 0 14px 3px currentColor; }
}
.anim-ring {
  position: absolute;
  width: 112px;   /* SZ 92 + 20px breathing room */
  height: 112px;
  top: -10px;     /* sit just outside the avatar top edge */
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;
  border: 2.5px solid transparent;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s;
}
.anim-ring.on {
  opacity: 1;
  animation: pulse-ring 0.45s ease-in-out infinite;
}
.active-ring { border-color: #ffd700; color: rgba(255,215,0,0.4); }
.target-ring { border-color: #ff4444; color: rgba(255,68,68,0.4); }

/* ── Name & HP ───────────────────────────────────────────────────── */
.hero-name {
  font-size: 0.56rem;
  font-weight: 600;
  color: #555;
  text-align: center;
  max-width: 128px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.hero-name.leader    { color: #ffd700; font-weight: 700; }
.hero-name.mythical  { color: #ff6ef7; }
.hero-name.legendary { color: #ffd700; }
.hero-name.epic      { color: #b44fff; }
.hero-name.rare      { color: #4fa8ff; }
.hero-name.uncommon  { color: #4dff88; }
.hero-name.common    { color: #aaa; }

.hp-track {
  width: 80px;
  height: 5px;
  background: #1a0505;
  border-radius: 3px;
  overflow: hidden;
}
.hp-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease, background-color 0.3s;
}
.hp-green  { background: #27ae60; }
.hp-orange { background: #e67e22; }
.hp-red    { background: #e74c3c; }

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 500px) {
  .combat-stage    { min-height: 340px; }
  .anim-ring       { width: 78px; height: 78px; top: -9px; }
  .hero-unit       { width: 86px; gap: 3px; }
  .hero-name       { font-size: 0.44rem; max-width: 84px; }
  .hp-track        { width: 56px; }
  .stage-label     { font-size: 0.42rem; }
}

/* ── Floating numbers ────────────────────────────────────────────── */
@keyframes float-up {
  0%   { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -80px); }
}
.float-num {
  position: absolute;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-weight: 900;
  pointer-events: none;
  animation: float-up var(--num-duration, 1000ms) ease-out forwards;
  text-shadow: 0 0 6px #000, 0 0 12px #000;
}
.num-dmg  { color: #ff4444; }
.num-heal { color: #4dff88; }
.num-crit {
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700, 0 0 6px #000;
  animation: float-up var(--num-duration, 1000ms) ease-out forwards,
             crit-pop 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
@keyframes crit-pop {
  from { transform: translate(-50%, 0) scale(0.5); }
  to   { transform: translate(-50%, 0) scale(1); }
}
</style>
