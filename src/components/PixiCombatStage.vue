<template>
  <div ref="stageEl" class="combat-stage" :style="bgStyle">
    <div class="stage-bg-overlay" />

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
      <div class="pcard" :style="{ '--rarity': rarityBorder(hero) }">
        <img v-if="cardImage(hero)" :src="cardImage(hero)" class="pcard-img" alt="" />
        <HeroAvatar v-else :hero="hero" :size="CARD_W" noBorder class="pcard-avatar" />
        <div class="pcard-bottom">
          <div class="hp-track"><div class="hp-fill" :class="hpCls(hero)" :style="{ width: hpPct(hero) + '%' }" /></div>
        </div>
        <div class="pcard-active" v-if="store.activeHero?.id === hero.id" />
        <div class="anim-flash" :class="{ on: hitIds.has(hero.id) }" />
        <div class="anim-veil"  :class="{ on: hero.isDead }" />
      </div>
      <div class="hero-name" :class="[{ leader: i === 0 }, heroRarity(hero)?.toLowerCase()]">{{ i === 0 ? '★ ' : '' }}{{ hero.name }}</div>
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
      <div class="pcard" :style="{ '--rarity': rarityBorder(hero) }">
        <img v-if="cardImage(hero)" :src="cardImage(hero)" class="pcard-img" alt="" />
        <HeroAvatar v-else :hero="hero" :size="CARD_W" noBorder class="pcard-avatar" />
        <div class="pcard-bottom">
          <div class="hp-track"><div class="hp-fill" :class="hpCls(hero)" :style="{ width: hpPct(hero) + '%' }" /></div>
        </div>
        <div class="pcard-active" v-if="store.activeHero?.id === hero.id" />
        <div class="pcard-target" v-if="isSelectingTarget && !hero.isDead" />
        <div class="anim-flash" :class="{ on: hitIds.has(hero.id) }" />
        <div class="anim-veil"  :class="{ on: hero.isDead }" />
      </div>
      <div class="hero-name" :class="[{ leader: i === 0 }, heroRarity(hero)?.toLowerCase()]">{{ i === 0 ? '★ ' : '' }}{{ hero.name }}</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useBattleStore } from '../stores/useBattleStore.js'
import { BattleState } from '../game/BattleEngine.js'
import { getPortrait } from '../game/portraits.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import HeroAvatar from './HeroAvatar.vue'
import battlegroundBg from '../assets/backgrounds/battleground_background.png'

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 800)
const onResize = () => { windowWidth.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

const CARD_W = computed(() => {
  const w = windowWidth.value
  if (w <= 500)  return 58
  if (w <= 1440) return 130
  if (w <= 2000) return 180
  if (w <= 2800) return 240
  return 300
})

const store      = useBattleStore()
const playerHero = usePlayerHeroStore()
const stageEl    = ref(null)

// ── Contextual battle background ──────────────────────────────────
const _dungeonBgs = import.meta.glob('../assets/dungeons/dungeon_*.png', { eager: true })
const DUNGEON_TIER_PREFIX = { medium: 'intermediate' }
function dungeonTierBgs(tier) {
  const prefix = `dungeon_${DUNGEON_TIER_PREFIX[tier.toLowerCase()] ?? tier.toLowerCase()}_`
  return Object.entries(_dungeonBgs).filter(([p]) => p.includes(prefix)).map(([, m]) => m.default)
}
const bgStyle = computed(() => {
  const enc = store.currentEncounter
  let url = battlegroundBg
  if (enc?.isDungeon) {
    const pool = dungeonTierBgs(enc.tier ?? 'easy')
    if (pool.length) {
      const seed = enc.id ?? enc.dungeonId ?? ''
      const idx = [...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % pool.length
      url = pool[idx]
    }
  }
  return { backgroundImage: `url(${url})`, backgroundSize: 'cover', backgroundPosition: 'center 30%' }
})

// ── Portrait card helpers ─────────────────────────────────────────
const _avatarModules = import.meta.glob('../assets/units/avatar_*.png', { eager: true })
const PLAYER_AVATARS = Object.fromEntries(
  Object.entries(_avatarModules).map(([path, mod]) => {
    const id = path.match(/avatar_\d+/)?.[0]
    return [id, mod.default]
  }).filter(([id]) => id)
)

const _RARITY_BORDER = {
  Mythical: '#ff2244', Legendary: '#ffd700', Epic: '#b44fff',
  Rare: '#4fa8ff', Uncommon: '#4dff88', Common: '#444', Ancient: '#8b0000',
}

function cardImage(hero) {
  if (hero.id === 'player_character') return PLAYER_AVATARS[hero.avatarId] ?? null
  return getPortrait(hero)
}
function heroRarity(hero) {
  if (hero.displayRarity) return hero.displayRarity
  return hero.id === 'player_character' ? playerHero.rarity : hero.rarity
}
function rarityBorder(hero) { return _RARITY_BORDER[heroRarity(hero)] ?? '#444' }

const PLAYER_SLOTS = [
  { xf: 0.40, yf: 0.50 },
  { xf: 0.26, yf: 0.27 },
  { xf: 0.26, yf: 0.73 },
  { xf: 0.12, yf: 0.27 },
  { xf: 0.12, yf: 0.73 },
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
    dead:          hero.isDead,
    hit:           hitIds.value.has(hero.id),
    'lunge-right': lunging && !isEnemy,
    'lunge-left':  lunging &&  isEnemy,
    'can-target':  isSelectingTarget.value && isEnemy && !hero.isDead,
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
  border: 1px solid #3e1c0c;
  background-color: #06020e;
}
@container combat-col (min-width: 1400px) {
  .combat-stage { min-height: 660px; }
}
@container combat-col (min-width: 2000px) {
  .combat-stage { min-height: 900px; }
}
@container combat-col (min-width: 2800px) {
  .combat-stage { min-height: 1100px; }
}

/* Dark vignette over background art */
.stage-bg-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(4,1,10,0.40) 0%,
    rgba(4,1,10,0.05) 30%,
    rgba(8,2,12,0.00) 50%,
    rgba(10,3,2,0.05) 70%,
    rgba(10,4,2,0.45) 100%
  );
}

.stage-divider {
  position: absolute;
  left: 50%; top: 14px; bottom: 14px;
  width: 1px;
  background: rgba(62,28,12,0.5);
  transform: translateX(-50%);
  pointer-events: none;
}
.stage-label {
  position: absolute;
  top: 10px;
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(80,60,50,0.7);
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
  width: 140px;
  transition: opacity 0.4s;
}
@container combat-col (min-width: 1400px) { .hero-unit { width: 190px; } }
@container combat-col (min-width: 2000px) { .hero-unit { width: 250px; } }
@container combat-col (min-width: 2800px) { .hero-unit { width: 310px; } }
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

/* Hit shake — on the pcard */
@keyframes hit-shake {
  0%   { transform: translateX(0); }
  15%  { transform: translateX(-11px); }
  35%  { transform: translateX(8px); }
  55%  { transform: translateX(-5px); }
  75%  { transform: translateX(3px); }
  100% { transform: translateX(0); }
}
.hero-unit.hit .pcard { animation: hit-shake 0.28s ease both; }

/* ── Portrait card ───────────────────────────────────────────────── */
.pcard {
  position: relative;
  width: 130px;
  height: 186px;
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--rarity, #444) 55%, #111);
  box-shadow: 0 0 14px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04) inset;
  background: #0a0608;
  flex-shrink: 0;
}

@container combat-col (min-width: 1400px) { .pcard { width: 180px; height: 257px; } }
@container combat-col (min-width: 2000px) { .pcard { width: 240px; height: 343px; border-radius: 9px; } }
@container combat-col (min-width: 2800px) { .pcard { width: 300px; height: 429px; border-radius: 10px; } }

.pcard-img {
  display: block;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center top;
}

.pcard-avatar {
  position: absolute;
  top: 8px; left: 50%;
  transform: translateX(-50%);
}

/* Gradient + HP bar pinned to card bottom */
.pcard-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 20px 5px 5px;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.88));
}

/* Active — gold card glow */
.pcard-active {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  border-radius: 5px;
  border: 2px solid #ffd700;
  box-shadow: inset 0 0 14px rgba(255,215,0,0.25), 0 0 20px rgba(255,215,0,0.5);
  animation: card-pulse 1.2s ease-in-out infinite;
}

/* Target — red card glow */
.pcard-target {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  border-radius: 5px;
  border: 2px solid #ff4444;
  box-shadow: inset 0 0 14px rgba(255,60,60,0.25), 0 0 20px rgba(255,60,60,0.55);
  animation: card-pulse-red 0.8s ease-in-out infinite;
}

/* Hit flash */
.anim-flash {
  position: absolute;
  inset: 0;
  background: white;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease-out;
}
.anim-flash.on { opacity: 0.75; transition: opacity 0s; }

/* Death veil */
.anim-veil {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.60);
  backdrop-filter: grayscale(1);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.45s;
  z-index: 7;
}
.anim-veil.on { opacity: 1; }

@keyframes card-pulse {
  0%, 100% { opacity: 0.75; }
  50%       { opacity: 1; box-shadow: inset 0 0 18px rgba(255,215,0,0.35), 0 0 28px rgba(255,215,0,0.6); }
}
@keyframes card-pulse-red {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; box-shadow: inset 0 0 18px rgba(255,60,60,0.35), 0 0 28px rgba(255,60,60,0.7); }
}

/* ── HP bar ──────────────────────────────────────────────────────── */
.hp-track {
  width: 100%; height: 4px;
  background: rgba(0,0,0,0.6); border-radius: 2px; overflow: hidden;
}
.hp-fill {
  height: 100%; border-radius: 2px;
  transition: width 0.3s ease, background-color 0.3s;
}
.hp-green  { background: #27ae60; }
.hp-orange { background: #e67e22; }
.hp-red    { background: #e74c3c; }

/* ── Name ────────────────────────────────────────────────────────── */
.hero-name {
  font-size: 0.62rem;
  font-weight: 600;
  color: #555;
  text-align: center;
  max-width: 138px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: 'Segoe UI', system-ui, sans-serif;
  text-shadow: 0 1px 4px rgba(0,0,0,1);
}
.hero-name.leader    { color: #ffd700; font-weight: 700; }
.hero-name.mythical  { color: #ff2244; }
.hero-name.legendary { color: #ffd700; }
.hero-name.epic      { color: #b44fff; }
.hero-name.rare      { color: #4fa8ff; }
.hero-name.uncommon  { color: #4dff88; }
.hero-name.common    { color: #aaa; }

@container combat-col (min-width: 1400px) { .hero-name { font-size: 0.68rem; max-width: 188px; } }
@container combat-col (min-width: 2000px) { .hero-name { font-size: 0.76rem; max-width: 248px; } }
@container combat-col (min-width: 2800px) { .hero-name { font-size: 0.86rem; max-width: 308px; } }

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 500px) {
  .combat-stage { min-height: 340px; }
  .hero-unit    { width: 72px; gap: 3px; }
  .pcard        { width: 58px; height: 84px; }
  .hero-name    { font-size: 0.44rem; max-width: 70px; }
  .stage-label  { font-size: 0.42rem; }
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
