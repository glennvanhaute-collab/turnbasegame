<template>
  <div class="wb-stage" ref="stageEl" :style="bgStyle">
    <div class="stage-scrim" />
    <div class="ink-edge ink-edge--top" />
    <div class="ink-edge ink-edge--bottom" />

    <!-- ── Header: line counts + round ── -->
    <header class="wb-header">
      <div class="line-count line-count--ally">
        <span class="mini-mon">⚔</span>
        <div><small>YOUR BANNER</small><b>{{ aliveAllies }} / {{ store.playerTeam.length }}</b></div>
      </div>
      <div class="wb-center-head">
        <div class="turn-order">
          <div
            v-for="h in turnOrder"
            :key="h.id"
            class="turn-chip"
            :class="{ active: h.id === store.activeHero?.id, dead: h.isDead, foe: !h.isPlayer }"
          >
            <img v-if="portraitOf(h)" :src="portraitOf(h)" alt="" />
          </div>
        </div>
        <div class="round-plate">
          <span>{{ store.activeHero ? store.activeHero.name.toUpperCase() : '—' }}</span>
          <small>{{ phaseLabel }}</small>
        </div>
      </div>
      <div class="line-count line-count--enemy">
        <div><small>THE FOE</small><b>{{ aliveEnemies }} / {{ store.enemyTeam.length }}</b></div>
        <span class="mini-mon">☠</span>
      </div>
    </header>

    <!-- Center panels come first in DOM so FX centre-lookup prefers them -->
    <div class="active-panel active-panel--ally" ref="allyPanelEl"
         :class="allyPulse" :data-hero-id="focusAlly?.id">
      <div class="panel-glow" />
      <div class="panel-frame" :style="{ '--rarity': rarityColor(focusAlly) }">
        <img v-if="portraitOf(focusAlly)" :src="portraitOf(focusAlly)" class="panel-img" alt="" />
        <HeroAvatar v-else-if="focusAlly" :hero="focusAlly" :size="260" noBorder class="panel-img" />
        <img v-if="houseBorder(focusAlly)" :src="houseBorder(focusAlly)" class="panel-house" alt="" />
        <div class="panel-veil" v-if="focusAlly?.isDead" />
      </div>
      <div class="name-plate name-plate--ally">
        <small>ACTING</small>
        <strong>{{ focusAlly?.name }}</strong>
        <span>{{ focusAlly?.faction ?? focusAlly?.role }}</span>
      </div>
    </div>

    <div class="active-panel active-panel--enemy" ref="enemyPanelEl"
         :class="enemyPulse" :data-hero-id="focusEnemy?.id">
      <div class="panel-glow panel-glow--foe" />
      <div class="panel-frame" :style="{ '--rarity': rarityColor(focusEnemy) }">
        <img v-if="portraitOf(focusEnemy)" :src="portraitOf(focusEnemy)" class="panel-img" alt="" />
        <HeroAvatar v-else-if="focusEnemy" :hero="focusEnemy" :size="260" noBorder class="panel-img" />
        <div class="panel-veil" v-if="focusEnemy?.isDead" />
      </div>
      <div class="name-plate name-plate--enemy">
        <small>TARGET</small>
        <strong>{{ focusEnemy?.name }}</strong>
        <span>{{ focusEnemy?.faction ?? focusEnemy?.role }}</span>
      </div>
    </div>

    <!-- ── Formation columns ── -->
    <div class="formation formation--ally">
      <button
        v-for="(h, i) in store.playerTeam"
        :key="h.id"
        type="button"
        class="battler"
        :data-hero-id="h.id"
        :class="{ dead: h.isDead, active: h.id === store.activeHero?.id, hit: hitIds.has(h.id) }"
      >
        <div class="battler-portrait" :style="{ '--rarity': rarityColor(h) }">
          <img v-if="portraitOf(h)" :src="portraitOf(h)" alt="" />
          <HeroAvatar v-else :hero="h" :size="52" noBorder />
        </div>
        <div class="battler-main">
          <div class="battler-name">
            <strong>{{ i === 0 ? '★ ' : '' }}{{ h.name }}</strong>
          </div>
          <div class="hp-frame">
            <div class="hp-fill" :class="hpCls(h)" :style="{ width: hpPct(h) + '%' }" />
          </div>
          <div class="battler-value"><span>{{ fmt(h.hp) }} / {{ fmt(h.maxHp) }}</span></div>
        </div>
      </button>
    </div>

    <div class="formation formation--enemy">
      <button
        v-for="h in store.enemyTeam"
        :key="h.id"
        type="button"
        class="battler enemy"
        :data-hero-id="h.id"
        :class="{
          dead: h.isDead,
          active: h.id === store.activeHero?.id,
          hit: hitIds.has(h.id),
          selectable: isSelecting && !h.isDead,
          selected: h.id === focusEnemy?.id,
        }"
        @click="onEnemyClick(h)"
      >
        <div class="battler-portrait" :style="{ '--rarity': rarityColor(h) }">
          <img v-if="portraitOf(h)" :src="portraitOf(h)" alt="" />
          <HeroAvatar v-else :hero="h" :size="52" noBorder />
        </div>
        <div class="battler-main">
          <div class="battler-name"><strong>{{ h.name }}</strong></div>
          <div class="hp-frame">
            <div class="hp-fill" :class="hpCls(h)" :style="{ width: hpPct(h) + '%' }" />
          </div>
          <div class="battler-value"><span>{{ fmt(h.hp) }} / {{ fmt(h.maxHp) }}</span></div>
        </div>
      </button>
    </div>

    <canvas ref="fxCanvas" class="fx-canvas" />

    <div class="action-banner" :class="{ show: bannerShow }">{{ bannerText }}</div>

    <div class="damage-layer">
      <div v-for="n in floatNumbers" :key="n.id" class="float-num" :class="n.cls"
           :style="{ left: n.x + 'px', top: n.y + 'px' }">{{ n.text }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useBattleStore } from '../../stores/useBattleStore.js'
import { usePlayerHeroStore } from '../../stores/usePlayerHeroStore.js'
import { getPortrait, PLAYER_AVATARS } from '../../game/portraits.js'
import { useCanvasFx } from '../../composables/useCanvasFx.js'
import HeroAvatar from '../HeroAvatar.vue'

const _B = import.meta.env.BASE_URL
const battlegroundBg = _B + 'backgrounds/battleground_background.png'
const HOUSE_CARD_BORDERS = {
  'House Aldric':   _B + 'ui/aldric_red_border_195x260_transparent.png',
  'House Mordaine': _B + 'ui/mordaine_border_195x260_transparent.png',
  'House Caelwyn':  _B + 'ui/caelwyn_thin_border_transparent_full.png',
}

const store      = useBattleStore()
const playerHero = usePlayerHeroStore()

const fx = useCanvasFx()
const { fxCanvas, stageEl } = fx

const allyPanelEl  = ref(null)
const enemyPanelEl = ref(null)
const allyPulse    = ref('')
const enemyPulse   = ref('')
const hitIds       = ref(new Set())
const floatNumbers = ref([])
const bannerText   = ref('')
const bannerShow   = ref(false)
const lastFoeHit   = ref(null)
let   numSeq       = 0

// ── Helpers ───────────────────────────────────────────────────────
const fmt = n => Math.max(0, Math.round(n ?? 0)).toLocaleString('en-US')
const hpPct = h => (h?.maxHp > 0 ? Math.max(0, (h.hp / h.maxHp) * 100) : 0)
const hpCls = h => {
  const p = hpPct(h) / 100
  return p > 0.55 ? 'hp-green' : p > 0.28 ? 'hp-orange' : 'hp-red'
}

const RARITY = {
  Mythical: '#ff2244', Legendary: '#ffd700', Epic: '#b44fff',
  Rare: '#4fa8ff', Uncommon: '#4dff88', Common: '#6a6a6a', Ancient: '#8b0000',
}
function heroRarity(h) {
  if (!h) return null
  if (h.displayRarity) return h.displayRarity
  return h.id === 'player_character' ? playerHero.rarity : h.rarity
}
const rarityColor = h => RARITY[heroRarity(h)] ?? '#5a4a34'

function portraitOf(h) {
  if (!h) return null
  if (h.id === 'player_character') return PLAYER_AVATARS[h.avatarId] ?? null
  return getPortrait(h)
}
const houseBorder = h => (h ? HOUSE_CARD_BORDERS[h.faction] ?? null : null)

const aliveAllies  = computed(() => store.playerTeam.filter(h => !h.isDead).length)
const aliveEnemies = computed(() => store.enemyTeam.filter(h => !h.isDead).length)
const isSelecting  = computed(() => store.state === 'selecting_target')

// Speed-ordered preview of who acts next
const turnOrder = computed(() =>
  [...store.playerTeam, ...store.enemyTeam]
    .filter(h => !h.isDead)
    .sort((a, b) => (b.speed ?? 0) - (a.speed ?? 0))
)

const phaseLabel = computed(() => {
  if (store.isOver) return 'BATTLE ENDED'
  if (isSelecting.value) return 'CHOOSE A TARGET'
  if (store.isPlayerTurn) return 'CHOOSE A SKILL'
  return 'THE FOE ACTS'
})

// ── Which portraits fill the centre ───────────────────────────────
const focusAlly = computed(() => {
  const a = store.activeHero
  if (a && a.isPlayer && !a.isDead) return a
  const lastHit = store.playerTeam.find(h => h.id === lastFoeHit.value && !h.isDead)
  return lastHit ?? store.playerTeam.find(h => !h.isDead) ?? store.playerTeam[0] ?? null
})

const focusEnemy = computed(() => {
  const a = store.activeHero
  if (a && !a.isPlayer && !a.isDead) return a
  return store.enemyTeam.find(h => !h.isDead) ?? store.enemyTeam[0] ?? null
})

function onEnemyClick(h) {
  if (!isSelecting.value || h.isDead) return
  store.selectTarget(h)
}

// ── Presentation effects ──────────────────────────────────────────
function timings() {
  const s = store.battleSpeed
  if (s === 3) return { lungeMs: 160, numMs: 700,  impactMs: 55 }
  if (s === 2) return { lungeMs: 350, numMs: 1300, impactMs: 120 }
  return             { lungeMs: 520, numMs: 1800, impactMs: 180 }
}

function pulse(which, cls, ms) {
  const target = which === 'ally' ? allyPulse : enemyPulse
  target.value = ''
  requestAnimationFrame(() => {
    target.value = cls
    setTimeout(() => { target.value = '' }, ms)
  })
}

function banner(text) {
  bannerText.value = text
  bannerShow.value = false
  requestAnimationFrame(() => { bannerShow.value = true })
}

function spawnNumber(targetId, text, cls) {
  const isAlly = store.playerTeam.some(h => h.id === targetId)
  const el = isAlly ? allyPanelEl.value : enemyPanelEl.value
  if (!el) return
  const x = el.offsetLeft + el.clientWidth / 2
  const y = el.offsetTop + el.clientHeight * 0.34
  const id = ++numSeq
  floatNumbers.value.push({ id, x, y, text, cls })
  setTimeout(() => {
    floatNumbers.value = floatNumbers.value.filter(n => n.id !== id)
  }, timings().numMs)
}

// ── Drive visuals from the engine's lastAction ────────────────────
watch(() => store.lastAction, (action) => {
  if (!action?.hits?.length) return
  const t        = timings()
  const casterId = action.casterId
  // The engine reports this directly — no need to look the caster up.
  const isAlly   = action.casterIsPlayer ?? store.playerTeam.some(h => h.id === casterId)

  if (!isAlly) lastFoeHit.value = action.hits[0]?.targetId ?? null
  if (action.skillName) banner(action.skillName.toUpperCase())
  pulse(isAlly ? 'ally' : 'enemy', 'attack', t.lungeMs)

  // Spell arcs between the two centre panels
  for (const hit of action.hits) {
    if (hit.heal > 0) fx.petalsFx(hit.targetId, '100,210,140')
    else fx.brushFx(casterId, hit.targetId, isAlly ? '201,166,101' : '200,70,50')
  }

  setTimeout(() => {
    for (const hit of action.hits) {
      hitIds.value = new Set(hitIds.value).add(hit.targetId)
      setTimeout(() => {
        const s = new Set(hitIds.value); s.delete(hit.targetId); hitIds.value = s
      }, 300)

      const targetIsAlly = store.playerTeam.some(h => h.id === hit.targetId)
      pulse(targetIsAlly ? 'ally' : 'enemy', 'flash', 300)

      if (hit.heal > 0)        spawnNumber(hit.targetId, `+${fmt(hit.heal)}`, 'heal')
      else if (hit.damage > 0) spawnNumber(hit.targetId, fmt(hit.damage), hit.crit ? 'crit' : 'dmg')
    }
  }, t.lungeMs * 0.42)
})

watch(() => store.battleKey, () => {
  hitIds.value       = new Set()
  floatNumbers.value = []
  lastFoeHit.value   = null
  bannerShow.value   = false
})

// ── Background ────────────────────────────────────────────────────
const _TIER_POOLS = {
  easy:         ['dungeon_easy_01', 'dungeon_easy_goblin_warrens'],
  intermediate: ['dungeon_intermediate_01', 'dungeon_intermediate_ashveil_mine', 'dungeon_intermediate_thornwood_depths'],
  hard:         ['dungeon_hard_01', 'dungeon_hard_02', 'dungeon_hard_dread_spire', 'dungeon_hard_thornhaven_ruins'],
  nightmare:    ['dungeon_nightmare_01', 'dungeon_nightmare_barrow_kings_tomb', 'dungeon_nightmare_wailing_crypts'],
}
const bgStyle = computed(() => {
  const enc = store.currentEncounter
  let url = battlegroundBg
  if (enc?.isDungeon) {
    const raw = enc.tier?.toLowerCase()
    const key = raw === 'medium' ? 'intermediate' : raw ?? 'easy'
    const pool = _TIER_POOLS[key] ?? []
    if (pool.length) {
      const seed = enc.id ?? enc.dungeonId ?? ''
      const idx  = [...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % pool.length
      url = _B + 'dungeons/' + pool[idx] + '.png'
    }
  }
  return { backgroundImage: `url(${url})` }
})

const onResize = () => {}
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
.wb-stage {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 520px;
  overflow: hidden;
  border-radius: 12px;
  background-size: cover;
  background-position: center 32%;
  background-color: #0a0704;
  isolation: isolate;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.stage-scrim {
  position: absolute; inset: 0; z-index: 1; pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 46%, rgba(255,240,200,0.06), transparent 46%),
    linear-gradient(90deg, rgba(4,3,2,0.72), transparent 16%, transparent 84%, rgba(4,3,2,0.72));
}
.ink-edge { position: absolute; left: 0; right: 0; z-index: 2; pointer-events: none; height: 74px; }
.ink-edge--top    { top: 0;    background: linear-gradient(180deg, rgba(6,4,2,0.94), rgba(6,4,2,0.5) 42%, transparent); }
.ink-edge--bottom { bottom: 0; background: linear-gradient(0deg,   rgba(6,4,2,0.96), rgba(6,4,2,0.44) 44%, transparent); }

/* ── Header ── */
.wb-header {
  position: absolute; z-index: 12; top: 10px; left: 16px; right: 16px;
  display: grid; grid-template-columns: 170px 1fr 170px; align-items: start; gap: 14px;
}
.line-count {
  display: flex; align-items: center; gap: 9px; padding: 7px 12px; color: #e8d9bb;
  background: linear-gradient(90deg, rgba(14,10,6,0.94), rgba(38,26,16,0.88));
  border: 1px solid rgba(201,162,39,0.4);
  clip-path: polygon(0 0, 100% 0, 93% 100%, 0 100%);
}
.line-count--enemy { justify-content: flex-end; text-align: right; clip-path: polygon(7% 0, 100% 0, 100% 100%, 0 100%); }
.line-count small { display: block; font-size: 9px; letter-spacing: 0.16em; color: #b39a69; }
.line-count b     { display: block; font: 700 19px/1 'Cinzel', Georgia, serif; margin-top: 2px; }
.mini-mon {
  display: grid; place-items: center; width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid rgba(201,162,39,0.5); box-shadow: inset 0 0 0 3px rgba(12,8,4,0.8);
  color: #cdae72; font-size: 14px; flex-shrink: 0;
}
.wb-center-head { display: grid; justify-items: center; gap: 5px; }
.turn-order { display: flex; justify-content: center; gap: 5px; min-height: 28px; }
.turn-chip {
  width: 26px; height: 26px; transform: rotate(45deg); overflow: hidden;
  background: #1a120a; border: 2px solid rgba(201,162,39,0.36); opacity: 0.45;
}
.turn-chip img { width: 150%; height: 150%; object-fit: cover; transform: rotate(-45deg) translate(-16%,-16%); }
.turn-chip.active { opacity: 1; border-color: var(--gold, #c9a227); box-shadow: 0 0 12px rgba(201,162,39,0.6); }
.turn-chip.foe.active { border-color: #c1443c; box-shadow: 0 0 12px rgba(193,68,60,0.6); }
.turn-chip.dead { opacity: 0.12; filter: grayscale(1); }
.round-plate {
  display: grid; place-items: center; padding: 5px 20px; text-align: center;
  background: linear-gradient(180deg, rgba(20,14,8,0.94), rgba(10,7,4,0.94));
  border-top: 1px solid rgba(201,162,39,0.44); border-bottom: 1px solid rgba(201,162,39,0.3);
  color: #e9d7ae;
}
.round-plate span  { font: 700 12px/1 'Cinzel', Georgia, serif; letter-spacing: 0.14em; }
.round-plate small { font-size: 8px; letter-spacing: 0.14em; color: #8a745a; margin-top: 3px; }

/* ── Formation columns ── */
.formation {
  position: absolute; z-index: 9; top: 92px; bottom: 20px; width: 208px;
  display: flex; flex-direction: column; justify-content: center; gap: 7px;
}
.formation--ally  { left: 12px; }
.formation--enemy { right: 12px; }
.battler {
  border: 0; background: transparent; padding: 0; font-family: inherit;
  display: grid; grid-template-columns: 52px 1fr; gap: 8px; align-items: center;
  text-align: left; color: #e2d3b8; cursor: default;
  transition: transform 0.18s ease, filter 0.18s ease;
}
.formation--enemy .battler { grid-template-columns: 1fr 52px; text-align: right; }
.formation--enemy .battler-portrait { grid-column: 2; grid-row: 1; }
.formation--enemy .battler-main     { grid-column: 1; grid-row: 1; }
.battler.selectable { cursor: pointer; }
.battler.selectable:hover { transform: translateX(-5px); }
.formation--ally .battler:hover { transform: translateX(5px); }
.battler.dead { opacity: 0.32; filter: grayscale(1); }
.battler.active .battler-portrait { box-shadow: 0 0 0 2px var(--gold, #c9a227), 0 0 16px rgba(201,162,39,0.5); }
.battler.selected .battler-portrait { box-shadow: 0 0 0 2px #c1443c, 0 0 16px rgba(193,68,60,0.55); }
.battler.hit { animation: battlerHit 0.34s ease; }
@keyframes battlerHit {
  0%, 100% { transform: translateX(0); filter: none; }
  30%      { transform: translateX(-5px); filter: brightness(1.7) saturate(0.5); }
  60%      { transform: translateX(3px); }
}
.battler-portrait {
  width: 52px; height: 52px; border-radius: 50%; overflow: hidden;
  border: 2px solid var(--rarity, #5a4a34);
  background: #120c07; box-shadow: 0 4px 10px rgba(0,0,0,0.6);
}
.battler-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 18%; }
.battler-main {
  padding: 4px 8px; min-width: 0;
  background: linear-gradient(90deg, rgba(18,12,7,0.9), rgba(18,12,7,0.5), transparent);
}
.formation--enemy .battler-main { background: linear-gradient(270deg, rgba(18,12,7,0.9), rgba(18,12,7,0.5), transparent); }
.battler-name strong {
  font: 600 11px/1.2 'Cinzel', Georgia, serif;
  display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.hp-frame {
  height: 6px; margin-top: 4px; position: relative; overflow: hidden;
  background: rgba(0,0,0,0.5); border-bottom: 1px solid rgba(201,162,39,0.28);
}
.hp-fill { height: 100%; transition: width 0.3s ease; }
.hp-green  { background: linear-gradient(90deg, #2f7a45, #58b06d); }
.hp-orange { background: linear-gradient(90deg, #9a6a1c, #d8a63a); }
.hp-red    { background: linear-gradient(90deg, #8f2a2a, #c84a42); }
.battler-value { font: 700 8px/1 Arial, sans-serif; margin-top: 3px; color: #9a856a; }
.formation--enemy .battler-value { text-align: right; }

/* ── Centre panels ── */
.active-panel {
  position: absolute; z-index: 7; top: 96px; bottom: 34px; width: 27%;
  display: flex; align-items: center; justify-content: center; pointer-events: none;
}
.active-panel--ally  { left: 21%; }
.active-panel--enemy { right: 21%; }
.panel-frame {
  position: relative; height: 100%; aspect-ratio: 3 / 4; max-width: 100%;
  border: 2px solid var(--rarity, #5a4a34); border-radius: 6px; overflow: hidden;
  box-shadow: 0 16px 40px rgba(0,0,0,0.75), inset 0 0 42px rgba(0,0,0,0.5);
  transition: transform 0.22s ease, filter 0.22s ease;
}
.panel-img { width: 100%; height: 100%; object-fit: cover; object-position: center 16%; display: block; }
.panel-house { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill; pointer-events: none; }
.panel-veil { position: absolute; inset: 0; background: rgba(6,3,2,0.72); }
.panel-glow {
  position: absolute; left: 8%; right: 8%; bottom: 2%; height: 22%; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(201,162,39,0.3), transparent 68%);
  filter: blur(6px);
}
.panel-glow--foe { background: radial-gradient(ellipse, rgba(193,68,60,0.3), transparent 68%); }
.active-panel.attack .panel-frame  { transform: translateX(26px) scale(1.015); }
.active-panel--enemy.attack .panel-frame { transform: translateX(-26px) scale(1.015); }
.active-panel.flash .panel-frame   { filter: brightness(1.5) saturate(0.6); }
.name-plate {
  position: absolute; z-index: 4; bottom: 6%; min-width: 190px; padding: 7px 14px;
  background: linear-gradient(180deg, rgba(18,12,7,0.95), rgba(9,6,3,0.95));
  border-top: 1px solid rgba(201,162,39,0.5); border-bottom: 1px solid rgba(201,162,39,0.3);
  box-shadow: 0 6px 18px rgba(0,0,0,0.6);
}
.name-plate--ally  { left: -6%;  text-align: left; }
.name-plate--enemy { right: -6%; text-align: right; }
.name-plate small  { display: block; font-size: 8px; letter-spacing: 0.18em; color: #8a745a; }
.name-plate strong { display: block; font: 700 15px/1.15 'Cinzel', Georgia, serif; color: #edddb8; margin-top: 2px; }
.name-plate span   { font-size: 10px; color: #9a856a; }

/* ── FX / banner / floats ── */
.fx-canvas    { position: absolute; inset: 0; z-index: 10; pointer-events: none; border-radius: 12px; }
.damage-layer { position: absolute; inset: 0; z-index: 11; pointer-events: none; }
.action-banner {
  position: absolute; z-index: 14; left: 50%; top: 44%; transform: translate(-50%,-50%);
  padding: 10px 28px; color: #f3e5d0;
  background: linear-gradient(90deg, transparent, rgba(14,10,6,0.94) 14%, rgba(14,10,6,0.94) 86%, transparent);
  border-top: 1px solid rgba(201,167,105,0.44); border-bottom: 1px solid rgba(201,167,105,0.44);
  font: 700 13px/1 'Cinzel', Georgia, serif; letter-spacing: 0.2em; opacity: 0;
}
.action-banner.show { animation: bannerReveal 1s ease both; }
@keyframes bannerReveal {
  0%       { opacity: 0; transform: translate(-50%,-50%) scale(0.9); }
  20%, 70% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  100%     { opacity: 0; transform: translate(-50%,-50%) scale(1.04); }
}
.float-num {
  position: absolute; transform: translate(-50%,-50%);
  font: 800 clamp(19px, 1.9vw, 34px)/1 Arial, sans-serif; color: #fff3e2;
  text-shadow: 0 2px 0 #46180f, 0 0 12px rgba(201,120,60,0.7);
  animation: floatUp 1.1s ease-out forwards;
}
.float-num.crit { color: #ffe08a; }
.float-num.heal { color: #b9ffc4; }
@keyframes floatUp {
  0%   { opacity: 0; transform: translate(-50%,-20%)  scale(0.8); }
  18%  { opacity: 1; transform: translate(-50%,-50%)  scale(1.08); }
  100% { opacity: 0; transform: translate(-50%,-160%) scale(0.94); }
}

@media (max-width: 1200px) {
  .formation { width: 168px; }
  .active-panel--ally  { left: 19%; }
  .active-panel--enemy { right: 19%; }
  .name-plate { min-width: 150px; padding: 6px 10px; }
  .name-plate strong { font-size: 13px; }
}
@media (max-width: 820px) {
  .formation { width: 120px; top: 84px; }
  .battler { grid-template-columns: 40px 1fr; gap: 6px; }
  .formation--enemy .battler { grid-template-columns: 1fr 40px; }
  .battler-portrait { width: 40px; height: 40px; }
  .active-panel--ally  { left: 16%; }
  .active-panel--enemy { right: 16%; }
}
</style>
