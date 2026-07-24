<template>
  <div class="combat-stage" :style="stageStyle">
    <div class="stage-bg-art" :style="bgArtStyle" />
    <div class="stage-bg-overlay" />
    <div class="stage-bg" />

    <!-- Labels float in the corners — don't consume flex space -->
    <div class="stage-label stage-label--enemies">Enemies</div>
    <div class="stage-label stage-label--players">Your Team</div>

    <!-- ── Enemy row — anchored to top ── -->
    <div class="stage-row enemy-side">
      <div class="combatants">
        <div
          v-for="{ hero, hp, maxHp, isDead } in snapshot.enemies"
          :key="hero.id"
          class="combatant"
          :class="{ selectable: store.state === 'selecting_target' && !isDead }"
          @click="onSpriteClick(hero, isDead)"
        >
          <div class="float-zone">
            <TransitionGroup name="float">
              <span
                v-for="n in numbersFor(hero.id)"
                :key="n.id"
                class="dmg-num"
                :class="{ crit: n.isCrit, heal: n.isHeal }"
              >{{ n.prefix }}{{ n.value }}</span>
            </TransitionGroup>
          </div>

          <div class="pcard" :class="spriteClass(hero.id, isDead, false)" :style="{ '--rarity': rarityBorder(hero) }">
            <div class="pcard-active" v-if="store.activeHero?.id === hero.id" />
            <div class="pcard-target" v-if="store.state === 'selecting_target' && !isDead" />
            <img v-if="portrait(hero)" :src="portrait(hero)" class="pcard-img" alt="" />
            <HeroAvatar v-else :hero="hero" :size="140" :noBorder="true" class="pcard-avatar" />
            <img v-if="cardBorder(hero)" :src="cardBorder(hero)" class="pcard-house-border" alt="" />
            <div class="pcard-bottom">
              <div class="hp-track">
                <div class="hp-fill" :style="{ width: pct(hp, maxHp) + '%', background: hpColor(hp, maxHp) }" />
              </div>
            </div>
            <div class="dead-veil" v-if="isDead" />
          </div>
          <div class="combatant-name" :class="{ dead: isDead }">{{ hero.name }}</div>
        </div>
      </div>
    </div>

    <!-- ── Open battlefield — grows to fill, shows the art ── -->
    <div class="stage-middle" />

    <!-- ── Player row — anchored to bottom ── -->
    <div class="stage-row player-side">
      <div class="combatants">
        <div
          v-for="{ hero, hp, maxHp, isDead } in snapshot.players"
          :key="hero.id"
          class="combatant"
        >
          <div class="float-zone">
            <TransitionGroup name="float">
              <span
                v-for="n in numbersFor(hero.id)"
                :key="n.id"
                class="dmg-num"
                :class="{ crit: n.isCrit, heal: n.isHeal }"
              >{{ n.prefix }}{{ n.value }}</span>
            </TransitionGroup>
          </div>

          <div class="pcard" :class="spriteClass(hero.id, isDead, true)" :style="{ '--rarity': rarityBorder(hero) }">
            <div class="pcard-active" v-if="store.activeHero?.id === hero.id" />
            <img v-if="portrait(hero)" :src="portrait(hero)" class="pcard-img" alt="" />
            <HeroAvatar v-else :hero="hero" :size="140" :noBorder="true" class="pcard-avatar" />
            <img v-if="cardBorder(hero)" :src="cardBorder(hero)" class="pcard-house-border" alt="" />
            <div class="pcard-bottom">
              <div class="hp-track">
                <div class="hp-fill" :style="{ width: pct(hp, maxHp) + '%', background: hpColor(hp, maxHp) }" />
              </div>
            </div>
            <div class="dead-veil" v-if="isDead" />
          </div>
          <div class="combatant-name" :class="{ dead: isDead }">{{ hero.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch } from 'vue'
import { useBattleStore } from '../stores/useBattleStore.js'
import { getPortrait } from '../game/portraits.js'
import HeroAvatar from './HeroAvatar.vue'
const _B = import.meta.env.BASE_URL
const battleBg        = _B + 'backgrounds/battle.png'
const trainingBg      = _B + 'backgrounds/training_camp.png'
const borderAldric    = _B + 'ui/aldric_red_border_195x260_transparent.png'
const borderMordaine  = _B + 'ui/mordaine_border_195x260_transparent.png'
import borderValdris   from '../assets/ui/valdris_border_195x260_transparent.png'
const borderCaelwyn   = _B + 'ui/caelwyn_thin_border_transparent_full.png'

const HOUSE_CARD_BORDERS = {
  'House Aldric':   borderAldric,
  'House Mordaine': borderMordaine,
  'House Valdris':  borderValdris,
  'House Caelwyn':  borderCaelwyn,
}
function cardBorder(hero) { return HOUSE_CARD_BORDERS[hero.faction] ?? null }

const store = useBattleStore()

// ── Contextual battle background ──────────────────────────────────
const _cs_easy01 = _B + 'dungeons/dungeon_easy_01.png'
const _cs_easyG  = _B + 'dungeons/dungeon_easy_goblin_warrens.png'
const _cs_int01  = _B + 'dungeons/dungeon_intermediate_01.png'
const _cs_intA   = _B + 'dungeons/dungeon_intermediate_ashveil_mine.png'
const _cs_intT   = _B + 'dungeons/dungeon_intermediate_thornwood_depths.png'
const _cs_hard01 = _B + 'dungeons/dungeon_hard_01.png'
const _cs_hard02 = _B + 'dungeons/dungeon_hard_02.png'
const _cs_hardS  = _B + 'dungeons/dungeon_hard_dread_spire.png'
const _cs_hardTh = _B + 'dungeons/dungeon_hard_thornhaven_ruins.png'
const _cs_nm01   = _B + 'dungeons/dungeon_nightmare_01.png'
const _cs_nmB    = _B + 'dungeons/dungeon_nightmare_barrow_kings_tomb.png'
const _cs_nmC    = _B + 'dungeons/dungeon_nightmare_wailing_crypts.png'
const _CS_TIER_POOLS = {
  easy:         [_cs_easy01, _cs_easyG],
  intermediate: [_cs_int01, _cs_intA, _cs_intT],
  hard:         [_cs_hard01, _cs_hard02, _cs_hardS, _cs_hardTh],
  nightmare:    [_cs_nm01, _cs_nmB, _cs_nmC],
}
const bgArtStyle = computed(() => {
  const enc = store.currentEncounter
  let url = battleBg
  if (enc?.isTraining) url = trainingBg
  else if (enc?.isDungeon) {
    const key = enc.tier?.toLowerCase() === 'medium' ? 'intermediate' : enc.tier?.toLowerCase() ?? 'easy'
    const pool = _CS_TIER_POOLS[key] ?? []
    if (pool.length) {
      const seed = enc.id ?? enc.dungeonId ?? ''
      const idx = [...seed].reduce((s, c) => s + c.charCodeAt(0), 0) % pool.length
      url = pool[idx]
    }
  }
  return { backgroundImage: `url(${url})` }
})

// ── Animation timing scales with battle speed ──
const animTiming = computed(() => {
  const s = store.battleSpeed
  if (s === 3) return { lungeCss: '0.16s', hitCss: '0.12s', numCss: '0.4s',  lungeMs: 160, hitMs: 120, impactMs: 55,  numMs: 400  }
  if (s === 2) return { lungeCss: '0.35s', hitCss: '0.28s', numCss: '0.75s', lungeMs: 350, hitMs: 280, impactMs: 120, numMs: 750  }
  return             { lungeCss: '0.52s', hitCss: '0.42s', numCss: '1.0s',  lungeMs: 520, hitMs: 420, impactMs: 180, numMs: 1000 }
})

const stageStyle = computed(() => ({
  '--dur-lunge': animTiming.value.lungeCss,
  '--dur-hit':   animTiming.value.hitCss,
  '--dur-num':   animTiming.value.numCss,
}))

// ── Reactive snapshot (re-reads hero.hp / isDead after every action) ──
const snapshot = computed(() => {
  void store.lastAction // reactive dependency — refreshes after every combat event
  return {
    enemies: store.enemyTeam.map(h => ({ hero: h, hp: h.hp, maxHp: h.maxHp, isDead: h.isDead })),
    players: store.playerTeam.map(h => ({ hero: h, hp: h.hp, maxHp: h.maxHp, isDead: h.isDead })),
  }
})

// ── Per-sprite animation state ──
const spriteAnim = reactive({}) // { [heroId]: { attacking, hit } }

function getAnim(id) {
  if (!spriteAnim[id]) spriteAnim[id] = { attacking: false, hit: false }
  return spriteAnim[id]
}

function spriteClass(heroId, isDead, isPlayer) {
  const a = getAnim(heroId)
  return {
    'is-attacking': a.attacking,
    'is-hit':       a.hit,
    'is-dead':      isDead,
    'lunge-up':     a.attacking && isPlayer,
    'lunge-down':   a.attacking && !isPlayer,
  }
}

// ── Floating damage numbers ──
const floatingNums = ref([])
let numSeq = 0

function numbersFor(heroId) {
  return floatingNums.value.filter(n => n.targetId === heroId)
}

function spawnNumbers(hits, numMs) {
  for (const hit of hits) {
    const n = {
      id:       ++numSeq,
      targetId: hit.targetId,
      value:    hit.damage || hit.heal,
      isCrit:   hit.crit,
      isHeal:   hit.heal > 0,
      prefix:   hit.heal > 0 ? '+' : '',
    }
    floatingNums.value.push(n)
    setTimeout(() => {
      floatingNums.value = floatingNums.value.filter(x => x.id !== n.id)
    }, numMs)
  }
}

// ── Watch lastAction → trigger animations ──
watch(() => store.lastAction, (action) => {
  if (!action || !action.hits.length) return
  const t = animTiming.value

  const casterAnim = getAnim(action.casterId)
  casterAnim.attacking = true

  setTimeout(() => {
    spawnNumbers(action.hits, t.numMs)
    for (const hit of action.hits) {
      const a = getAnim(hit.targetId)
      a.hit = true
      setTimeout(() => { a.hit = false }, t.hitMs)
    }
  }, t.impactMs)

  setTimeout(() => { casterAnim.attacking = false }, t.lungeMs)
})

// ── Portrait card helpers ──
const _RARITY_BORDER = {
  Mythical:  '#ff2244', Legendary: '#ffd700', Epic: '#b44fff',
  Rare: '#4fa8ff', Uncommon: '#4dff88', Common: '#444', Ancient: '#8b0000',
}
function portrait(hero)     { return getPortrait(hero) }
function rarityBorder(hero) { return _RARITY_BORDER[hero.rarity] ?? '#444' }

// ── HP helpers ──
function pct(hp, maxHp) {
  return maxHp > 0 ? Math.max(0, (hp / maxHp) * 100) : 0
}

function hpColor(hp, maxHp) {
  const p = pct(hp, maxHp)
  if (p > 55) return '#27ae60'
  if (p > 28) return '#e67e22'
  return '#e74c3c'
}

// ── Target selection click ──
function onSpriteClick(hero, isDead) {
  if (store.state === 'selecting_target' && !isDead) {
    store.selectTarget(hero)
  }
}
</script>

<style scoped>
/* ── Stage shell ── */
.combat-stage {
  position: relative;
  background: #06020e;
  border: 1px solid #3e1c0c;
  border-radius: 12px;
  padding: 14px 20px;
  overflow: hidden;
  min-height: 560px;
  display: flex;
  flex-direction: column;
}
@container combat-col (min-width: 1400px) {
  .combat-stage { min-height: 700px; }
}
@container combat-col (min-width: 2000px) {
  .combat-stage { min-height: 960px; }
}

/* Background art layer */
.stage-bg-art {
  position: absolute; inset: 0; pointer-events: none;
  background-size: cover;
  background-position: center 30%;
  opacity: 0.65;
}

/* Gradient vignette: darken edges where units stand, open in the middle */
.stage-bg-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(4,1,10,0.78) 0%,
    rgba(4,1,10,0.15) 28%,
    rgba(8,2,12,0.05) 50%,
    rgba(10,3,2,0.15) 72%,
    rgba(10,4,2,0.80) 100%
  );
}

/* Atmospheric pseudo-ground lines */
.stage-bg {
  position: absolute; inset: 0; pointer-events: none;
  background:
    repeating-linear-gradient(
      90deg,
      transparent 0px,
      transparent 98px,
      rgba(255,180,50,0.015) 99px,
      transparent 100px
    );
}

/* ── Corner labels — absolute, don't take flex space ── */
.stage-label {
  position: absolute;
  font-size: 0.58rem; text-transform: uppercase; letter-spacing: 2px;
  color: #2e2820; font-weight: 700;
  z-index: 10; pointer-events: none;
}
.stage-label--enemies { top: 12px; right: 18px; }
.stage-label--players { bottom: 12px; left: 18px; }

/* ── Rows ── */
.stage-row { position: relative; z-index: 2; }
.enemy-side { padding-bottom: 0; }
.player-side { padding-top: 0; }

/* ── Open battlefield — flex spacer ── */
.stage-middle {
  flex: 1;
  min-height: 80px;
  pointer-events: none;
}

.combatants {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}

/* ── Individual combatant ── */
.combatant {
  display: flex; flex-direction: column; align-items: center;
  gap: 6px; position: relative;
}
.combatant.selectable { cursor: crosshair; }

/* ── Float zone for damage numbers ── */
.float-zone {
  position: absolute;
  top: -10px; left: 50%; transform: translateX(-50%);
  width: 180px; height: 90px;
  pointer-events: none; z-index: 20;
  overflow: visible;
}

.dmg-num {
  position: absolute;
  left: 50%; transform: translateX(-50%);
  white-space: nowrap;
  font-weight: 900; font-size: 1.1rem;
  color: #ff4444;
  text-shadow: 0 0 8px rgba(255,0,0,0.7), 0 1px 3px rgba(0,0,0,1);
  animation: float-up var(--dur-num, 1s) ease-out forwards;
}
.dmg-num.crit {
  font-size: 1.5rem; color: #ffd700;
  text-shadow: 0 0 14px rgba(255,210,0,0.9), 0 1px 4px rgba(0,0,0,1);
}
.dmg-num.heal {
  color: #4dff88;
  text-shadow: 0 0 8px rgba(77,255,136,0.8), 0 1px 3px rgba(0,0,0,1);
}

/* ── Portrait card — scales with combat column width via @container ── */
.pcard {
  position: relative;
  width: 160px; height: 229px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--rarity, #444) 55%, #111);
  box-shadow:
    0 0 18px rgba(0,0,0,0.85),
    0 0 0 1px rgba(255,255,255,0.04) inset;
  background: #0a0608;
  flex-shrink: 0;
  transition: transform 0.08s;
}

@container combat-col (min-width: 1400px) {
  .pcard { width: 210px; height: 300px; }
}
@container combat-col (min-width: 2000px) {
  .pcard { width: 280px; height: 400px; border-radius: 10px; }
}
@container combat-col (min-width: 2800px) {
  .pcard { width: 340px; height: 486px; }
}

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

.pcard-house-border {
  position: absolute;
  inset: 0;
  width: 100%; height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 2;
}

/* Gradient + HP bar pinned to card bottom */
.pcard-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 60px 8px 8px;
  background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.92));
}

/* Active — gold card glow */
.pcard-active {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  border-radius: 8px;
  border: 2px solid #ffd700;
  box-shadow: inset 0 0 18px rgba(255,215,0,0.25), 0 0 24px rgba(255,215,0,0.5);
  animation: card-pulse 1.2s ease-in-out infinite;
}

/* Target — red card glow */
.pcard-target {
  position: absolute; inset: 0; z-index: 5; pointer-events: none;
  border-radius: 8px;
  border: 2px solid #ff4444;
  box-shadow: inset 0 0 18px rgba(255,60,60,0.25), 0 0 24px rgba(255,60,60,0.55);
  animation: card-pulse-red 0.8s ease-in-out infinite;
}

/* Dead veil */
.dead-veil {
  position: absolute; inset: 0;
  border-radius: 8px;
  background: rgba(0,0,0,0.55);
  backdrop-filter: grayscale(1);
  pointer-events: none;
  z-index: 6;
}

/* ── HP bar (inside card) ── */
.hp-track {
  width: 100%; height: 5px;
  background: rgba(0,0,0,0.6); border-radius: 3px; overflow: hidden;
}
.hp-fill {
  height: 100%; border-radius: 3px;
  transition: width 0.35s ease-out, background 0.35s;
}

.combatant-name {
  font-size: 0.68rem; color: #bbb; font-weight: 600;
  text-align: center; max-width: 164px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  text-shadow: 0 1px 4px rgba(0,0,0,1);
}
.combatant-name.dead { color: #444; }
@container combat-col (min-width: 1400px) {
  .combatant-name { max-width: 214px; font-size: 0.72rem; }
  .float-zone { width: 220px; }
}
@container combat-col (min-width: 2000px) {
  .combatant-name { max-width: 284px; font-size: 0.8rem; }
  .float-zone { width: 290px; }
  .dmg-num { font-size: 1.4rem; }
  .dmg-num.crit { font-size: 1.9rem; }
}
@container combat-col (min-width: 2800px) {
  .combatant-name { max-width: 344px; font-size: 0.9rem; }
  .float-zone { width: 350px; }
}

/* ── Card animation classes ── */
.pcard.lunge-up   { animation: lunge-up    var(--dur-lunge, 0.52s) ease-in-out forwards; }
.pcard.lunge-down { animation: lunge-down  var(--dur-lunge, 0.52s) ease-in-out forwards; }
.pcard.is-hit     { animation: hit-shake   var(--dur-hit,   0.42s) ease-out    forwards; }
.pcard.is-dead    { animation: death-slump 0.5s ease-out forwards; animation-fill-mode: both; }

/* ── Keyframes ── */
@keyframes lunge-up {
  0%   { transform: translateY(0)    scale(1); }
  28%  { transform: translateY(-56px) scale(1.06); }
  55%  { transform: translateY(-52px) scale(1.04); }
  100% { transform: translateY(0)    scale(1); }
}
@keyframes lunge-down {
  0%   { transform: translateY(0)   scale(1); }
  28%  { transform: translateY(56px) scale(1.06); }
  55%  { transform: translateY(52px) scale(1.04); }
  100% { transform: translateY(0)   scale(1); }
}
@keyframes hit-shake {
  0%   { transform: translateX(0); filter: brightness(1); }
  12%  { transform: translateX(-7px); filter: brightness(5) saturate(0); }
  28%  { transform: translateX(6px);  filter: brightness(2) sepia(1) hue-rotate(-15deg) saturate(4); }
  44%  { transform: translateX(-4px); filter: brightness(1.4); }
  60%  { transform: translateX(3px);  filter: brightness(1); }
  80%  { transform: translateX(-2px); }
  100% { transform: translateX(0); filter: brightness(1); }
}
@keyframes death-slump {
  to { opacity: 0.28; transform: translateY(5px) scale(0.88); filter: grayscale(1) brightness(0.5); }
}
@keyframes float-up {
  0%   { opacity: 1; transform: translateX(-50%) translateY(0) scale(0.85); }
  18%  { opacity: 1; transform: translateX(-50%) translateY(-14px) scale(1.15); }
  100% { opacity: 0; transform: translateX(-50%) translateY(-64px) scale(0.9); }
}
@keyframes card-pulse {
  0%, 100% { opacity: 0.75; }
  50%       { opacity: 1; box-shadow: inset 0 0 18px rgba(255,215,0,0.35), 0 0 28px rgba(255,215,0,0.6); }
}
@keyframes card-pulse-red {
  0%, 100% { opacity: 0.6; }
  50%       { opacity: 1; box-shadow: inset 0 0 18px rgba(255,60,60,0.35), 0 0 28px rgba(255,60,60,0.7); }
}

/* TransitionGroup for floating numbers */
.float-enter-active { animation: float-up 1s ease-out forwards; }
.float-leave-active { display: none; }
</style>
