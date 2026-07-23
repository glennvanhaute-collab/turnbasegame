<template>
  <div class="raid-arena" :style="arenaStyle">

    <!-- Gradient overlay: dark at bottom so party row is readable -->
    <div class="arena-overlay" />

    <!-- ── Phase transition card ─────────────────────────────────── -->
    <Transition name="phase-card">
      <div class="phase-card-overlay" v-if="showPhaseCard">
        <div class="pc-eyebrow">Phase {{ activePhaseCard.number }}</div>
        <div class="pc-name">{{ activePhaseCard.name }}</div>
        <div class="pc-bar" :style="{ background: activePhaseCard.color }" />
        <div class="pc-sub">The battlefield shifts...</div>
      </div>
    </Transition>

    <!-- ── Victory / Defeat overlay ──────────────────────────────── -->
    <Transition name="end-fade">
      <div class="end-overlay" v-if="store.isOver">
        <div class="end-title" :class="store.state">
          {{ store.state === 'victory' ? (store.lastReward?.isAutoComplete ? 'Quick Clear' : 'Raid Complete') : 'Defeated' }}
        </div>
        <div class="end-sub" v-if="store.state === 'victory'">
          {{ store.lastReward?.isAutoComplete ? 'Loot awarded — no battle required.' : encounter?.victoryText ?? 'The raid falls silent.' }}
        </div>
        <div class="end-sub" v-else>The darkness was too great.</div>
        <div class="end-rewards" v-if="store.state === 'victory' && store.lastReward">
          <div class="reward-main-row">
            <span class="reward-pill gold">🪙 {{ store.lastReward.gold?.toLocaleString() }}</span>
            <span class="reward-pill diamond">💎 {{ store.lastReward.diamonds }}</span>
          </div>
          <template v-if="store.lastReward.raidDrops">
            <div class="raid-drops-label">Rare Materials</div>
            <div class="raid-drops">
              <span v-for="d in store.lastReward.raidDrops.ores"     :key="'o'+d.id"  class="reward-pill ore">⛏ {{ d.amount }}× Mithril Ore</span>
              <span v-for="d in store.lastReward.raidDrops.logs"     :key="'l'+d.id"  class="reward-pill wood">🪵 {{ d.amount }}× Dragonwood</span>
              <span v-for="d in store.lastReward.raidDrops.hides"    :key="'h'+d.id"  class="reward-pill hide">🐉 {{ d.amount }}× Moonscale Hide</span>
              <span v-for="d in store.lastReward.raidDrops.fibers"   :key="'f'+d.id"  class="reward-pill fiber">🌙 {{ d.amount }}× Moonthread</span>
              <span v-for="d in store.lastReward.raidDrops.leathers"   :key="'lt'+d.id" class="reward-pill leather">🧶 {{ d.amount }}× Moonscale Strip</span>
              <span v-for="d in store.lastReward.raidDrops.cloths"     :key="'c'+d.id"  class="reward-pill cloth">✨ {{ d.amount }}× Moonweave</span>
              <span v-for="d in store.lastReward.raidDrops.components" :key="'cmp'+d.id" class="reward-pill essence">✦ {{ d.amount }}× {{ UPGRADE_COMPONENTS[d.id]?.name ?? d.id }}</span>
            </div>
          </template>
          <template v-if="store.lastReward.raidDrops?.gearDrops?.length">
            <div class="raid-drops-label" :style="{ color: gearSetColor, borderColor: gearSetColor + '44' }">{{ gearSetName }}</div>
            <div class="raid-drops">
              <span v-for="g in store.lastReward.raidDrops.gearDrops" :key="g.instanceId" class="reward-pill regret-gear">
                ◈ {{ g.name }}
              </span>
            </div>
          </template>
        </div>
        <button class="end-btn" @click="$emit('back')">← Return to Raids</button>
      </div>
    </Transition>

    <!-- ── Header bar ────────────────────────────────────────────── -->
    <div class="raid-header">
      <button class="back-btn" @click="$emit('back')">← Retreat</button>
      <div class="phase-badge" :style="{ color: currentPhase.color, borderColor: currentPhase.color + '44' }">
        Phase {{ currentPhase.number }} — {{ currentPhase.name }}
      </div>
      <div class="turn-label" :class="store.state">
        <span v-if="store.state === 'selecting_skill'">{{ store.activeHero?.name }} — your move</span>
        <span v-else-if="store.state === 'selecting_target'">Choose a target</span>
        <span v-else-if="store.state === 'enemy_turn'">Enemy is acting...</span>
        <span v-else-if="store.state === 'victory'">Victory!</span>
        <span v-else-if="store.state === 'defeat'">Defeated</span>
        <span v-else>—</span>
      </div>
    </div>

    <!-- ── Enemy section (1 or 2 enemies) ──────────────────────────── -->
    <div class="enemy-section" :class="{ 'multi-enemy': store.enemyTeam.length > 1 }">
      <div
        v-for="enemy in store.enemyTeam"
        :key="enemy.id"
        class="enemy-card"
        :class="{
          'enemy-targetable': canTargetEnemy(enemy),
          'enemy-hit':        hitFlash[enemy.id],
          'enemy-dead':       enemy.isDead,
        }"
        @click="onEnemyClick(enemy)"
      >
        <div class="enemy-portrait-wrap">
          <img v-if="enemyPortrait(enemy)" :src="enemyPortrait(enemy)" class="enemy-portrait" />
          <div v-else class="enemy-fallback">{{ enemy.name[0] }}</div>
          <div class="enemy-dead-veil" v-if="enemy.isDead">✟</div>
          <div class="target-ring" v-if="canTargetEnemy(enemy)" />
        </div>
        <div class="enemy-info">
          <div class="enemy-name">{{ enemy.name }}</div>
          <div class="enemy-hp-track">
            <div class="enemy-hp-fill" :style="{ width: enemyHpPct(enemy) + '%', background: enemyHpColor(enemy) }" />
            <span class="enemy-hp-label">{{ enemy.hp?.toLocaleString() }} / {{ enemy.maxHp?.toLocaleString() }}</span>
          </div>
          <div class="enemy-status-row" v-if="enemy.statusEffects?.length">
            <span v-for="se in enemy.statusEffects" :key="se.type" class="status-pip" :class="seClass(se.type)">
              {{ seLabel(se.type) }} {{ se.duration }}t
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Battle log ─────────────────────────────────────────────── -->
    <div class="battle-log-feed" aria-live="polite">
      <TransitionGroup name="log-line" tag="div" class="log-lines">
        <div v-for="entry in recentLog" :key="entry.id" class="log-line">
          {{ entry.text }}
        </div>
      </TransitionGroup>
    </div>

    <!-- ── Party row ─────────────────────────────────────────────── -->
    <div class="party-row">
      <div
        v-for="hero in store.playerTeam"
        :key="hero.id"
        class="hero-slot"
        :class="{
          'slot-active':    store.activeHero?.id === hero.id && !store.isOver,
          'slot-dead':      hero.isDead,
          'slot-targetable': store.state === 'selecting_target',
        }"
        @click="onHeroSlotClick(hero)"
      >
        <!-- Portrait -->
        <div class="slot-portrait-wrap">
          <img
            v-if="portraits[hero.id]"
            :src="portraits[hero.id]"
            class="slot-portrait"
          />
          <div v-else class="slot-portrait-fallback">{{ hero.name[0] }}</div>
          <div class="slot-dead-veil" v-if="hero.isDead">✟</div>
          <div class="slot-active-ring" v-if="store.activeHero?.id === hero.id && !store.isOver" />
        </div>

        <!-- Name -->
        <div class="slot-name">{{ hero.name.split(' ')[0] }}</div>

        <!-- HP bar -->
        <div class="slot-hp-track">
          <div class="slot-hp-fill" :style="{ width: heroHpPct(hero) + '%', background: heroHpColor(hero) }" />
        </div>
        <div class="slot-hp-label">{{ hero.hp }} / {{ hero.maxHp }}</div>

        <!-- Status pips -->
        <div class="slot-status-row" v-if="hero.statusEffects?.length">
          <span
            v-for="se in hero.statusEffects.slice(0, 3)"
            :key="se.type"
            class="status-pip mini"
            :class="seClass(se.type)"
          >{{ seLabel(se.type) }}</span>
        </div>
      </div>
    </div>

    <!-- ── Skill bar ─────────────────────────────────────────────── -->
    <Transition name="skill-bar">
      <div class="skill-bar" v-if="store.state === 'selecting_skill' && store.activeHero">
        <div class="skill-bar-hero">{{ store.activeHero.name }}</div>
        <div class="skill-row">
          <button
            v-for="(skill, i) in store.activeHero.skills"
            :key="skill.id"
            class="raid-skill-btn"
            :class="{ ready: skill.isReady(), selected: store.selectedSkillIndex === i }"
            :disabled="!skill.isReady()"
            @click="store.selectSkill(i)"
          >
            <span class="rsb-name">{{ skill.name }}</span>
            <span class="rsb-cd" v-if="!skill.isReady()">CD {{ skill.currentCooldown }}</span>
            <span class="rsb-desc">{{ skill.description }}</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Target hints -->
    <div class="target-hint" v-if="store.state === 'selecting_target' && needsAllyTarget">
      Click a hero to target them
    </div>
    <div class="target-hint enemy" v-else-if="store.state === 'selecting_target' && needsEnemyTarget && store.enemyTeam.filter(e => !e.isDead).length > 1">
      Click an enemy to target them
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useBattleStore }     from '../stores/useBattleStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { getPortrait, PORTRAIT_MAP } from '../game/portraits.js'
import { TargetType }         from '../game/Skill.js'
import { RAID_ENCOUNTERS }    from '../game/data/raidEncounters.js'
import { UPGRADE_COMPONENTS } from '../game/data/upgradeComponents.js'
import { playRaid, playVoidHeir, playMalachar, playMain } from '../game/music.js'
import _arenaMalachar    from '../assets/backgrounds/malachar_raid.png'
import _arenaFallenRoom  from '../assets/dungeons/raid_fallen_room.jpeg'
import _arenaVoidHeir    from '../assets/dungeons/dungeon_battle_arena_Aurelian-Dragonforge.png'

const props = defineProps({
  raidId:       { type: String,  required: true },
  autoComplete: { type: Boolean, default: false },
})
defineEmits(['back'])

const store      = useBattleStore()
const collection = useCollectionStore()

const encounter = RAID_ENCOUNTERS[props.raidId]

// ── Arena background (per-raid) ──────────────────────────────────
const ARENA_BG = {
  malachar_void:    _arenaMalachar,
  throne_of_regret: _arenaFallenRoom,
  void_heir:        _arenaVoidHeir,
}
const arenaStyle = computed(() => {
  const url = ARENA_BG[props.raidId] ?? _arenaFallenRoom
  return { backgroundImage: `url(${url})` }
})

// ── Enemy portraits ───────────────────────────────────────────────
// Maps base enemy ID (strip trailing _0 index) → key in PORTRAIT_MAP
// PORTRAIT_MAP keys = lowercased filename without extension
const ENEMY_PORTRAIT_KEYS = {
  malachar_void:    'malachar',                   // units/enemy/Malachar.png
  batman_nightmare: 'raid_fallen-king-batman',    // units/mythical/Raid_fallen-king-batman.png
  aurelian_eclipse: 'aurelian-dragonforge',       // units/mythical/Aurelian-Dragonforge.png
  nytherax_wyrm:    'nytherax-the-starless-wyrm', // units/enemy/nytherax-the-starless-wyrm.png
}
function enemyPortrait(enemy) {
  const baseId = enemy.id?.replace(/_\d+$/, '') ?? ''
  const key = ENEMY_PORTRAIT_KEYS[baseId]
  if (key && PORTRAIT_MAP[key]) return PORTRAIT_MAP[key]
  return getPortrait(enemy)
}

const GEAR_SET_INFO = {
  malachar_void:    { name: 'Null Panoply',       color: '#8844ff' },
  throne_of_regret: { name: 'Regalia of Regret',  color: '#b44fff' },
}
const gearSetName  = computed(() => GEAR_SET_INFO[props.raidId]?.name  ?? 'Raid Gear')
const gearSetColor = computed(() => GEAR_SET_INFO[props.raidId]?.color ?? '#b44fff')

// Phase tracking uses first enemy (main boss)
const boss       = computed(() => store.enemyTeam[0] ?? null)
const bossHpPct  = computed(() => boss.value ? Math.max(0, boss.value.hp / boss.value.maxHp * 100) : 100)

// Per-enemy HP helpers
function enemyHpPct(enemy) { return Math.max(0, enemy.hp / enemy.maxHp * 100) }
function enemyHpColor(enemy) {
  const pct = enemyHpPct(enemy)
  if (pct > 60) return '#c9a227'
  if (pct > 30) return '#ff9944'
  return '#b44fff'
}

// Hit flash — per enemy
const hitFlash = ref({})

// ── Phase detection ───────────────────────────────────────────────
const currentPhase = computed(() => {
  const pct = bossHpPct.value / 100
  const phases = encounter?.phases ?? []
  for (const p of phases) {
    if (pct > p.hpAbove) return p
  }
  return phases[phases.length - 1] ?? { number: 1, name: '', hpAbove: 0, color: '#c9a227' }
})

const showPhaseCard  = ref(false)
const activePhaseCard = ref(encounter?.phases[0] ?? {})
let lastPhaseNum = 1
let phaseWatchReady = false

watch(currentPhase, (newPhase, oldPhase) => {
  if (!phaseWatchReady) { phaseWatchReady = true; return }
  if (newPhase.number > lastPhaseNum) {
    lastPhaseNum = newPhase.number
    activePhaseCard.value = newPhase
    showPhaseCard.value = true
    setTimeout(() => { showPhaseCard.value = false }, 3000)
  }
})

// ── Targeting ─────────────────────────────────────────────────────
const needsAllyTarget  = ref(false)
const needsEnemyTarget = ref(false)

watch(() => store.state, (newState) => {
  if (newState !== 'selecting_target') {
    needsAllyTarget.value  = false
    needsEnemyTarget.value = false
    return
  }
  const targetType = store.engine?.pendingSkill?.skill?.targetType
  if (targetType === TargetType.SINGLE_ALLY) {
    needsAllyTarget.value  = true
    needsEnemyTarget.value = false
  } else {
    needsAllyTarget.value  = false
    needsEnemyTarget.value = true
    // Auto-target only if there is exactly one living enemy
    const living = store.enemyTeam.filter(e => !e.isDead)
    if (living.length === 1) {
      nextTick(() => { if (store.state === 'selecting_target') store.selectTarget(living[0]) })
    }
  }
})

function canTargetEnemy(enemy) {
  return !enemy.isDead && store.state === 'selecting_target' && needsEnemyTarget.value
}

function onEnemyClick(enemy) {
  if (canTargetEnemy(enemy)) store.selectTarget(enemy)
}

function onHeroSlotClick(hero) {
  if (store.state === 'selecting_target' && needsAllyTarget.value && !hero.isDead) {
    store.selectTarget(hero)
  }
}

// ── Battle log ───────────────────────────────────────────────────
const recentLog = computed(() => {
  const log = store.battleLog
  const start = Math.max(0, log.length - 5)
  return log.slice(start).map((text, i) => ({ id: start + i, text }))
})

// ── Hit flash per enemy ───────────────────────────────────────────
watch(() => store.lastAction, (action) => {
  if (!action) return
  for (const hit of action.hits ?? []) {
    const enemy = store.enemyTeam.find(e => e.id === hit.targetId)
    if (enemy && hit.damage > 0) {
      hitFlash.value = { ...hitFlash.value, [enemy.id]: true }
      setTimeout(() => {
        hitFlash.value = { ...hitFlash.value, [enemy.id]: false }
      }, 280)
    }
  }
})

// ── Hero portraits (pre-resolved map) ────────────────────────────
const portraits = computed(() => {
  const map = {}
  for (const hero of store.playerTeam) {
    map[hero.id] = getPortrait(hero)
  }
  return map
})

function heroHpPct(hero) {
  return Math.max(0, hero.hp / hero.maxHp * 100)
}
function heroHpColor(hero) {
  const pct = heroHpPct(hero)
  if (pct > 50) return '#4dff88'
  if (pct > 25) return '#ffcc44'
  return '#ff4444'
}

// ── Status effect labels ─────────────────────────────────────────
const SE_LABELS = {
  poison: 'PSN', burn: 'BRN', freeze: 'FRZ', stun: 'STN',
  weaken: 'WKN', decrease_atk: '-ATK', decrease_def: '-DEF', decrease_spd: '-SPD',
  sleep: 'SLP', shield: 'SHD', increase_atk: '+ATK', increase_def: '+DEF',
  increase_spd: '+SPD', counter: 'CTR', immunity: 'IMN', continuous_heal: 'HOT',
  provoke: 'PRV',
}
function seLabel(type) { return SE_LABELS[type] ?? type }
function seClass(type) {
  const debuffs = new Set(['poison','burn','freeze','stun','weaken','decrease_atk','decrease_def','decrease_spd','sleep'])
  return debuffs.has(type) ? 'se-debuff' : 'se-buff'
}

// ── Init battle on mount ─────────────────────────────────────────
onMounted(() => {
  if (props.autoComplete) {
    store.autoCompleteRaid(props.raidId)
    return
  }
  if (props.raidId === 'malachar_void') playMalachar()
  else if (props.raidId === 'void_heir') playVoidHeir()
  else playRaid()
  const team = collection.buildTeam()
  if (store.autoplay) store.toggleAutoplay()
  store.currentRaidId = props.raidId
  store.initBattle(encounter, team)
  nextTick(() => { phaseWatchReady = true })
})

onUnmounted(() => {
  playMain()
})
</script>

<style scoped>
/* ── Layout shell ────────────────────────────────────────────── */
.raid-arena {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center 30%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, sans-serif;
  z-index: 200;
}

.arena-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom,
      rgba(4, 2, 1, 0.55) 0%,
      rgba(4, 2, 1, 0.30) 25%,
      rgba(4, 2, 1, 0.45) 55%,
      rgba(4, 2, 1, 0.90) 100%
    );
  pointer-events: none;
  z-index: 0;
}

/* All direct children sit above the overlay */
.raid-header, .enemy-section, .battle-log-feed,
.party-row, .skill-bar, .target-hint,
.phase-card-overlay, .end-overlay {
  position: relative;
  z-index: 1;
}

/* ── Header ──────────────────────────────────────────────────── */
.raid-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 20px;
  background: rgba(4, 2, 1, 0.6);
  border-bottom: 1px solid rgba(201, 162, 39, 0.15);
  flex-shrink: 0;
}

.back-btn {
  background: rgba(20, 10, 4, 0.8);
  border: 1px solid #3a1e0a;
  border-radius: 5px;
  color: #7a5228;
  font-family: 'Cinzel', serif;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 6px 14px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.back-btn:hover { color: #c9a227; border-color: #c9a227; }

.phase-badge {
  font-family: 'Cinzel', serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border: 1px solid;
  border-radius: 20px;
  padding: 3px 14px;
  transition: color 0.5s, border-color 0.5s;
}

.turn-label {
  margin-left: auto;
  font-size: 0.72rem;
  font-style: italic;
  color: #aaa;
  white-space: nowrap;
}
.turn-label.selecting_skill { color: #ffd700; }
.turn-label.enemy_turn { color: #ff8844; }
.turn-label.victory { color: #ffd700; font-style: normal; font-weight: 700; }
.turn-label.defeat  { color: #ff4444; font-style: normal; font-weight: 700; }

/* ── Enemy section ───────────────────────────────────────────── */
.enemy-section {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 32px;
  padding: 12px 20px 8px;
  flex-shrink: 0;
}

.enemy-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: filter 0.1s, transform 0.1s;
}
.enemy-card.enemy-targetable { cursor: crosshair; }
.enemy-card.enemy-targetable:hover {
  filter: brightness(1.15) drop-shadow(0 0 20px rgba(255, 80, 80, 0.6));
  transform: translateY(-4px);
}
.enemy-card.enemy-hit { filter: brightness(2.5) saturate(0); }
.enemy-card.enemy-dead { opacity: 0.35; filter: grayscale(1); }

.enemy-portrait-wrap {
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.enemy-portrait {
  height: 240px;
  width: auto;
  max-width: 320px;
  object-fit: contain;
  filter: drop-shadow(0 4px 24px rgba(0,0,0,0.9));
}
/* Shrink second enemy (dragon) slightly */
.multi-enemy .enemy-card:nth-child(2) .enemy-portrait { height: 180px; }

.enemy-fallback {
  width: 160px; height: 220px;
  background: #1a0c06; border: 1px solid #3a1e0a; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 3rem; color: #3a1e0a;
}
.enemy-dead-veil {
  position: absolute; inset: 0; background: rgba(0,0,0,0.65);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; color: #666; border-radius: 8px;
}
.target-ring {
  position: absolute; inset: -4px;
  border: 2px solid rgba(255, 80, 80, 0.7);
  border-radius: 8px; pointer-events: none;
  animation: target-pulse 0.8s ease-in-out infinite;
}
@keyframes target-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(255,80,80,0.4); }
  50%       { opacity: 0.5; box-shadow: 0 0 20px rgba(255,80,80,0.7); }
}

.enemy-info { width: 100%; text-align: center; }
.enemy-name {
  font-family: 'Cinzel', serif; font-size: 0.65rem; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase; color: #c9a227; margin-bottom: 5px;
}
.enemy-hp-track {
  position: relative; height: 8px; background: #120a04;
  border: 1px solid #2a1208; border-radius: 4px; overflow: hidden; width: 100%;
}
.enemy-hp-fill {
  height: 100%; border-radius: 4px;
  transition: width 0.4s ease, background 0.6s ease;
  box-shadow: 0 0 6px currentColor;
}
.enemy-hp-label {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.52rem; font-weight: 700;
  color: rgba(255,255,255,0.9); text-shadow: 0 1px 3px rgba(0,0,0,0.9);
}
.enemy-status-row {
  display: flex; gap: 3px; flex-wrap: wrap; margin-top: 4px; justify-content: center;
}

/* ── Battle log ──────────────────────────────────────────────── */
.battle-log-feed {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 28px 8px;
  min-height: 0;
  overflow: hidden;
}
.log-lines {
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: flex-end;
}
.log-line {
  font-size: 0.72rem;
  color: #ccc;
  line-height: 1.5;
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
  transition: opacity 0.3s;
}
.log-line:last-child { color: #fff; font-weight: 600; }

.log-line-enter-active { transition: opacity 0.3s, transform 0.3s; }
.log-line-leave-active { transition: opacity 0.4s; position: absolute; }
.log-line-enter-from   { opacity: 0; transform: translateY(6px); }
.log-line-leave-to     { opacity: 0; }

/* ── Party row ───────────────────────────────────────────────── */
.party-row {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  flex-shrink: 0;
}

.hero-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 110px;
  cursor: default;
  transition: transform 0.15s;
}
.hero-slot.slot-targetable { cursor: pointer; }
.hero-slot.slot-targetable:hover { transform: translateY(-4px); }
.hero-slot.slot-active { transform: translateY(-6px); }
.hero-slot.slot-dead { opacity: 0.45; }

.slot-portrait-wrap {
  position: relative;
  width: 90px;
  height: 110px;
  border-radius: 6px;
  overflow: hidden;
  background: #120a04;
  border: 1px solid #2a1208;
  flex-shrink: 0;
}
.slot-active .slot-portrait-wrap {
  border-color: #c9a227;
  box-shadow: 0 0 16px rgba(201, 162, 39, 0.5), inset 0 0 12px rgba(201, 162, 39, 0.1);
}

.slot-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}
.slot-portrait-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 900;
  color: #3a1e0a;
}
.slot-dead-veil {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  color: #666;
}
.slot-active-ring {
  position: absolute;
  inset: -2px;
  border: 2px solid #c9a227;
  border-radius: 7px;
  pointer-events: none;
  animation: ring-pulse 1.2s ease-in-out infinite;
}
@keyframes ring-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(201, 162, 39, 0.5); }
  50%       { opacity: 0.7; box-shadow: 0 0 16px rgba(201, 162, 39, 0.8); }
}

.slot-name {
  font-family: 'Cinzel', serif;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #c4a882;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.slot-hp-track {
  width: 100%;
  height: 5px;
  background: #0d0804;
  border-radius: 3px;
  overflow: hidden;
}
.slot-hp-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background 0.5s;
}
.slot-hp-label {
  font-size: 0.52rem;
  color: #6b5440;
  text-align: center;
}

.slot-status-row {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}

/* ── Status pips ─────────────────────────────────────────────── */
.status-pip {
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.3px;
  border-radius: 3px;
  padding: 1px 4px;
}
.status-pip.se-debuff { background: rgba(200, 50, 50, 0.2); color: #ff6666; border: 1px solid #ff444422; }
.status-pip.se-buff   { background: rgba(50, 180, 100, 0.2); color: #66ff99; border: 1px solid #44ff8822; }
.status-pip.mini { font-size: 0.45rem; padding: 1px 3px; }

/* ── Skill bar ───────────────────────────────────────────────── */
.skill-bar {
  padding: 10px 16px 14px;
  background: rgba(4, 2, 1, 0.88);
  border-top: 1px solid rgba(201, 162, 39, 0.2);
  flex-shrink: 0;
}
.skill-bar-hero {
  font-family: 'Cinzel', serif;
  font-size: 0.6rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #c9a227;
  margin-bottom: 8px;
  text-align: center;
}
.skill-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.raid-skill-btn {
  background: rgba(18, 8, 2, 0.9);
  border: 1px solid #3a1e0a;
  border-radius: 8px;
  color: #c4a882;
  padding: 10px 14px;
  cursor: pointer;
  text-align: left;
  min-width: 150px;
  max-width: 220px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
}
.raid-skill-btn.ready:hover {
  background: rgba(40, 20, 5, 0.95);
  border-color: #c9a227;
  transform: translateY(-2px);
}
.raid-skill-btn.selected  { border-color: #e94560; background: rgba(40, 5, 10, 0.95); }
.raid-skill-btn:disabled  { opacity: 0.35; cursor: not-allowed; transform: none; }

.rsb-name { font-family: 'Cinzel', serif; font-weight: 700; font-size: 0.75rem; color: #fff; letter-spacing: 0.5px; }
.rsb-cd   { font-size: 0.6rem; color: #ff9944; }
.rsb-desc { font-size: 0.62rem; color: #7a5228; line-height: 1.4; }

.skill-bar-enter-active { transition: opacity 0.25s, transform 0.25s; }
.skill-bar-leave-active { transition: opacity 0.2s, transform 0.2s; }
.skill-bar-enter-from   { opacity: 0; transform: translateY(12px); }
.skill-bar-leave-to     { opacity: 0; transform: translateY(8px); }

/* ── Target hint ─────────────────────────────────────────────── */
.target-hint {
  text-align: center;
  padding: 6px;
  font-size: 0.7rem;
  color: #e94560;
  font-style: italic;
  background: rgba(4, 2, 1, 0.88);
  border-top: 1px solid rgba(233, 69, 96, 0.2);
  flex-shrink: 0;
}

/* ── Phase transition card ───────────────────────────────────── */
.phase-card-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(2, 1, 0, 0.88);
  pointer-events: none;
}
.pc-eyebrow {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: #7a5228;
}
.pc-name {
  font-family: 'Cinzel', serif;
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 0 40px rgba(255,255,255,0.2);
  text-align: center;
  padding: 0 24px;
}
.pc-bar {
  width: 120px;
  height: 3px;
  border-radius: 2px;
}
.pc-sub {
  font-size: 0.72rem;
  color: #6b5440;
  font-style: italic;
  letter-spacing: 1px;
}

.phase-card-enter-active { transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22,1,0.36,1); }
.phase-card-leave-active { transition: opacity 0.5s ease; }
.phase-card-enter-from   { opacity: 0; transform: scale(0.96); }
.phase-card-leave-to     { opacity: 0; }

/* ── End overlay ─────────────────────────────────────────────── */
.end-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(2, 1, 0, 0.82);
}
.end-title {
  font-family: 'Cinzel', serif;
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: 4px;
  text-transform: uppercase;
}
.end-title.victory { color: #ffd700; text-shadow: 0 0 40px rgba(255, 215, 0, 0.4); }
.end-title.defeat  { color: #e74c3c; text-shadow: 0 0 40px rgba(231, 76, 60, 0.4); }
.end-sub {
  font-size: 0.82rem;
  color: #7a5228;
  font-style: italic;
  letter-spacing: 1px;
}
.end-rewards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.reward-pill {
  font-family: 'Cinzel', serif;
  font-size: 1rem;
  font-weight: 700;
  padding: 6px 20px;
  border-radius: 20px;
}
.reward-pill.gold    { background: rgba(201, 162, 39, 0.15); color: #ffd700; border: 1px solid rgba(201, 162, 39, 0.3); }
.reward-pill.diamond { background: rgba(100, 180, 255, 0.1); color: #88ccff; border: 1px solid rgba(100, 180, 255, 0.2); }
.reward-pill.ore     { background: rgba(91, 172, 212, 0.12); color: #5bacd4; border: 1px solid rgba(91, 172, 212, 0.3); }
.reward-pill.wood    { background: rgba(154,  68,  68, 0.12); color: #c87070; border: 1px solid rgba(154, 68, 68, 0.3); }
.reward-pill.hide    { background: rgba(126, 232, 255, 0.10); color: #7ee8ff; border: 1px solid rgba(126, 232, 255, 0.25); }
.reward-pill.fiber   { background: rgba(187, 238, 255, 0.10); color: #bbeeff; border: 1px solid rgba(187, 238, 255, 0.25); }
.reward-pill.leather { background: rgba(126, 232, 255, 0.08); color: #aaddf0; border: 1px solid rgba(126, 232, 255, 0.2); }
.reward-pill.cloth   { background: rgba(136, 204, 255, 0.10); color: #88ccff; border: 1px solid rgba(136, 204, 255, 0.22); }
.reward-pill.essence     { background: rgba(153, 204, 255, 0.15); color: #99ccff; border: 1px solid rgba(153, 204, 255, 0.40); }
.reward-pill.regret-gear { background: rgba(180, 79, 255, 0.12); color: #cc88ff; border: 1px solid rgba(180, 79, 255, 0.40); font-weight: 600; }

.raid-drops-label {
  font-family: 'Cinzel', serif;
  font-size: 0.65rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #887799;
  margin-top: 4px;
}
.raid-drops {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.raid-drops .reward-pill {
  font-size: 0.78rem;
  padding: 4px 14px;
}
.reward-main-row {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.end-btn {
  background: rgba(20, 10, 4, 0.9);
  border: 1px solid #5c3a14;
  border-radius: 8px;
  color: #c9a227;
  font-family: 'Cinzel', serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 12px 32px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  margin-top: 8px;
}
.end-btn:hover { background: rgba(40, 20, 5, 0.95); border-color: #c9a227; }

.end-fade-enter-active { transition: opacity 0.5s ease; }
.end-fade-leave-active { transition: opacity 0.3s ease; }
.end-fade-enter-from   { opacity: 0; }
.end-fade-leave-to     { opacity: 0; }
</style>
