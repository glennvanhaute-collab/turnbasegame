<template>
  <div class="siege-arena" :style="arenaStyle">
    <div class="arena-overlay" />

    <!-- ── Phase transition card ────────────────────────────────────── -->
    <Transition name="phase-card">
      <div class="phase-card-overlay" v-if="showPhaseCard">
        <div class="pc-eyebrow">Phase 2</div>
        <div class="pc-name">The Vanguard</div>
        <div class="pc-bar" :style="{ background: faction.color }" />
        <div class="pc-sub">The garrison falls. The commander steps forward.</div>
      </div>
    </Transition>

    <!-- ── Victory / Defeat overlay ─────────────────────────────────── -->
    <Transition name="end-fade">
      <div class="end-overlay" v-if="siegeResult">
        <div class="end-title" :class="siegeResult">
          {{ siegeResult === 'victory' ? 'Siege Complete' : 'Defeated' }}
        </div>
        <div class="end-sub" v-if="siegeResult === 'victory'">
          {{ faction.house }} has been repelled. The transgression ends here.
        </div>
        <div class="end-sub" v-else>The garrison held. Your forces retreat in disarray.</div>
        <div class="end-rewards" v-if="siegeResult === 'victory'">
          <span class="reward-pill gold">🪙 {{ tier.gold.toLocaleString() }}</span>
          <span class="reward-pill diamond">💎 {{ tier.diamonds }}</span>
          <span class="reward-pill mat" :style="{ color: faction.color }">◆ {{ faction.event.matReward }} ×{{ tier.matCount }}</span>
        </div>
        <button class="end-btn" @click="$emit('back')">← Return to Sieges</button>
      </div>
    </Transition>

    <!-- ── Header ────────────────────────────────────────────────────── -->
    <div class="siege-header">
      <button class="back-btn" @click="$emit('back')">← Retreat</button>
      <div class="phase-badge" :style="{ color: faction.color, borderColor: faction.color + '44' }">
        Phase {{ currentPhase }} — {{ currentPhase === 1 ? 'The Breach' : 'The Vanguard' }}
      </div>
      <div class="header-faction">
        <span :style="{ color: faction.color }">{{ faction.house }}</span>
        <span class="hf-sep">·</span>
        <span class="hf-tier" :style="{ color: tier.color }">{{ tier.name }}</span>
      </div>
    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- PHASE 1: The Breach                                           -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div v-if="currentPhase === 1 && !siegeResult" class="phase1-view">

      <!-- Shared HP bars -->
      <div class="siege-hp-bars">
        <div class="hp-row">
          <span class="hp-label friendly">Your Forces</span>
          <div class="hp-track">
            <div class="hp-fill friendly-fill" :style="{ width: warbandPct + '%' }" />
          </div>
          <span class="hp-val">{{ Math.round(warbandHp).toLocaleString() }} / {{ warbandMaxHp.toLocaleString() }}</span>
        </div>
        <div class="hp-row">
          <span class="hp-label enemy">Enemy Garrison</span>
          <div class="hp-track">
            <div class="hp-fill enemy-fill" :style="{ width: garrisonPct + '%', background: faction.color }" />
          </div>
          <span class="hp-val">{{ Math.round(garrisonHp).toLocaleString() }} / {{ garrisonMaxHp.toLocaleString() }}</span>
        </div>
      </div>

      <!-- Lanes + Log -->
      <div class="siege-main">

        <!-- 3 Lane columns -->
        <div class="lanes-area">
          <div
            v-for="laneId in LANE_IDS"
            :key="laneId"
            class="battle-lane-col"
            :class="laneStatus[laneId]"
          >
            <div class="lane-title">{{ LANE_NAMES[laneId] }}</div>

            <!-- Enemy garrison chips -->
            <div class="lane-enemies">
              <span v-for="g in tierData.laneGarrison[laneId]" :key="g" class="garrison-chip">{{ g }}</span>
            </div>

            <!-- Lane HP bar (enemy garrison for this lane) -->
            <div class="lane-hp-wrap">
              <div class="lane-hp-fill"
                :style="{ width: lanePct(laneId) + '%', background: laneHpColor(laneId) }" />
            </div>
            <div class="lane-hp-num">{{ Math.round(laneHp[laneId]).toLocaleString() }}</div>

            <!-- Breach/Collapse badge -->
            <div class="lane-status-badge" v-if="laneStatus[laneId] !== 'active'"
              :class="laneStatus[laneId]">
              {{ laneStatus[laneId] === 'breached' ? '⚔ BREACHED' : '✗ COLLAPSED' }}
            </div>

            <div class="lane-vs">⚔</div>

            <!-- Your commanders in this lane -->
            <div class="lane-commanders">
              <div v-for="heroKey in siege.lanes[laneId]" :key="heroKey" class="battle-commander">
                <HeroAvatar :hero="heroForKey(heroKey)" :size="34" />
                <div class="bc-info">
                  <span class="bc-name">{{ heroForKey(heroKey)?.name?.split(' ')[0] ?? heroKey }}</span>
                  <span class="bc-unit" v-if="siege.assignments[heroKey]">
                    {{ UNIT_TYPES[siege.assignments[heroKey]].icon }}
                    <span class="bc-unit-count">{{ siege.army[siege.assignments[heroKey]] }}</span>
                  </span>
                </div>
              </div>
              <div class="lane-empty-hint" v-if="!siege.lanes[laneId].length">No commanders</div>
            </div>
          </div>
        </div>

        <!-- Battle log -->
        <div class="battle-log-panel">
          <div class="log-header">Battle Log</div>
          <div class="log-entries" ref="logPanel">
            <TransitionGroup name="log-line" tag="div">
              <div v-for="entry in battleLog" :key="entry.id" class="log-entry">
                <span class="log-tick">T{{ entry.tick }}</span>
                {{ entry.text }}
              </div>
            </TransitionGroup>
          </div>
        </div>

      </div>

      <!-- Speed controls -->
      <div class="sim-footer">
        <div class="speed-btns">
          <button
            v-for="s in [1, 2, 3]"
            :key="s"
            class="speed-btn"
            :class="{ active: simSpeed === s }"
            @click="setSpeed(s)"
          >{{ s }}×</button>
        </div>
        <span class="sim-tick-label">Tick {{ tick }}</span>
      </div>

    </div>

    <!-- ══════════════════════════════════════════════════════════════ -->
    <!-- PHASE 2: The Vanguard                                         -->
    <!-- ══════════════════════════════════════════════════════════════ -->
    <div v-else-if="currentPhase === 2 && !siegeResult" class="phase2-view">

      <!-- Turn state -->
      <div class="turn-label" :class="battleStore.state">
        <span v-if="battleStore.state === 'selecting_skill'">{{ battleStore.activeHero?.name }} — choose a skill</span>
        <span v-else-if="battleStore.state === 'selecting_target'">Choose a target</span>
        <span v-else-if="battleStore.state === 'enemy_turn'">{{ battleStore.enemyTeam[0]?.name }} is acting...</span>
        <span v-else>—</span>
      </div>

      <!-- Enemy commander -->
      <div class="enemy-section">
        <div
          class="enemy-card"
          :class="{ targetable: canTargetEnemy, hit: enemyHitFlash }"
          @click="onEnemyClick"
        >
          <div class="commander-portrait-wrap">
            <div class="commander-portrait-fallback" :style="{ background: faction.color + '33', borderColor: faction.color + '88' }">
              <span class="cpf-initial" :style="{ color: faction.color }">
                {{ battleStore.enemyTeam[0]?.name?.[0] ?? '?' }}
              </span>
            </div>
            <div class="enemy-dead-veil" v-if="battleStore.enemyTeam[0]?.isDead">✟</div>
            <div class="target-ring" v-if="canTargetEnemy" :style="{ borderColor: faction.color }" />
          </div>
          <div class="commander-info">
            <div class="commander-name" :style="{ color: faction.color }">{{ battleStore.enemyTeam[0]?.name }}</div>
            <div class="commander-title">{{ faction.house }} · Commander</div>
            <div class="commander-hp-track">
              <div class="commander-hp-fill"
                :style="{ width: commanderHpPct + '%', background: commanderHpColor }" />
              <span class="commander-hp-label">
                {{ battleStore.enemyTeam[0]?.hp?.toLocaleString() }} / {{ battleStore.enemyTeam[0]?.maxHp?.toLocaleString() }}
              </span>
            </div>
            <div class="commander-status-row" v-if="battleStore.enemyTeam[0]?.statusEffects?.length">
              <span v-for="se in battleStore.enemyTeam[0].statusEffects" :key="se.type"
                class="status-pip" :class="seClass(se.type)">
                {{ seLabel(se.type) }} {{ se.duration }}t
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Phase 2 battle log -->
      <div class="p2-log-feed">
        <div v-for="entry in recentP2Log" :key="entry.id" class="p2-log-line">{{ entry.text }}</div>
      </div>

      <!-- Vanguard party row -->
      <div class="party-row">
        <div
          v-for="hero in battleStore.playerTeam"
          :key="hero.id"
          class="hero-slot"
          :class="{
            'slot-active':     battleStore.activeHero?.id === hero.id,
            'slot-dead':       hero.isDead,
            'slot-targetable': battleStore.state === 'selecting_target',
          }"
          @click="onHeroSlotClick(hero)"
        >
          <div class="slot-portrait-wrap">
            <img v-if="heroPortrait(hero)" :src="heroPortrait(hero)" class="slot-portrait" />
            <div v-else class="slot-portrait-fallback">{{ hero.name[0] }}</div>
            <div class="slot-dead-veil" v-if="hero.isDead">✟</div>
            <div class="slot-active-ring" v-if="battleStore.activeHero?.id === hero.id" />
          </div>
          <div class="slot-name">{{ hero.name.split(' ')[0] }}</div>
          <div class="slot-hp-track">
            <div class="slot-hp-fill" :style="{ width: heroHpPct(hero) + '%', background: heroHpColor(hero) }" />
          </div>
          <div class="slot-hp-label">{{ hero.hp }} / {{ hero.maxHp }}</div>
        </div>
      </div>

      <!-- Skill bar -->
      <Transition name="skill-bar">
        <div class="skill-bar" v-if="battleStore.state === 'selecting_skill' && battleStore.activeHero">
          <div class="skill-bar-hero">{{ battleStore.activeHero.name }}</div>
          <div class="skill-row">
            <button
              v-for="(skill, i) in battleStore.activeHero.skills"
              :key="skill.id"
              class="siege-skill-btn"
              :class="{ ready: skill.isReady(), selected: battleStore.selectedSkillIndex === i }"
              :disabled="!skill.isReady()"
              @click="battleStore.selectSkill(i)"
            >
              <span class="ssb-name">{{ skill.name }}</span>
              <span class="ssb-cd" v-if="!skill.isReady()">CD {{ skill.currentCooldown }}</span>
              <span class="ssb-desc">{{ skill.description }}</span>
            </button>
          </div>
        </div>
      </Transition>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import HeroAvatar from './HeroAvatar.vue'
import { useBattleStore }      from '../stores/useBattleStore.js'
import { useSiegeStore }       from '../stores/useSiegeStore.js'
import { useCollectionStore }  from '../stores/useCollectionStore.js'
import { useInventoryStore }   from '../stores/useInventoryStore.js'
import { usePlayerHeroStore }  from '../stores/usePlayerHeroStore.js'
import { getPortrait }         from '../game/portraits.js'
import { HERO_TEMPLATES }      from '../game/data/heroes.js'
import { UNIT_TYPES }          from '../game/data/siegeUnits.js'
import { buildSiegeCommander, SIEGE_TIER_DATA, SIEGE_LOG } from '../game/data/siegeCommanders.js'
import { TargetType }          from '../game/Skill.js'
import { BattleState }         from '../game/BattleEngine.js'
import { playSiegeBreach, playSiegeVanguard, playMain } from '../game/music.js'

const props = defineProps({
  faction: { type: Object, required: true },
  tier:    { type: Object, required: true },
})
const emit = defineEmits(['back'])

const battleStore  = useBattleStore()
const siege        = useSiegeStore()
const collection   = useCollectionStore()
const inventory    = useInventoryStore()
const playerHeroStore = usePlayerHeroStore()

// ── Arena background ─────────────────────────────────────────────────
const arenaStyle = computed(() => ({
  backgroundImage: `url(${props.faction.img})`,
}))

// ── Phase state ───────────────────────────────────────────────────────
const currentPhase   = ref(1)
const showPhaseCard  = ref(false)
const siegeResult         = ref(null)  // null | 'victory' | 'defeat'
const siegeVictoryRecorded = ref(false)

// ── Phase 1: Simulation state ─────────────────────────────────────────
const LANE_IDS   = ['west', 'gate', 'east']
const LANE_NAMES = { west: 'West Flank', gate: 'Front Gate', east: 'East Flank' }

const tick        = ref(0)
const simSpeed    = ref(1)
const TICK_DELAYS = { 1: 800, 2: 400, 3: 150 }

const tierData = computed(() => SIEGE_TIER_DATA[props.tier.id] ?? SIEGE_TIER_DATA.skirmish)

const warbandMaxHp = ref(1)
const warbandHp    = ref(1)
const garrisonMaxHp = ref(1)
const garrisonHp    = ref(1)
const laneHp     = ref({ west: 0, gate: 0, east: 0 })
const laneMaxHp  = ref({ west: 0, gate: 0, east: 0 })
const laneStatus = ref({ west: 'active', gate: 'active', east: 'active' })  // active|breached|collapsed

const battleLog  = ref([])
const logPanel   = ref(null)
let   simTimer   = null

const warbandPct  = computed(() => Math.max(0, warbandHp.value / warbandMaxHp.value * 100))
const garrisonPct = computed(() => Math.max(0, garrisonHp.value / garrisonMaxHp.value * 100))

function lanePct(laneId) {
  const max = laneMaxHp.value[laneId]
  if (!max) return 0
  return Math.max(0, laneHp.value[laneId] / max * 100)
}

function laneHpColor(laneId) {
  const pct = lanePct(laneId)
  if (pct > 60) return '#cc4040'
  if (pct > 25) return '#cc8830'
  return '#eeaa30'
}

// ── Hero helpers ──────────────────────────────────────────────────────
function heroForKey(key) {
  if (!key) return null
  const entry = collection.roster.find(r => r.key === key)
  return entry ? entry.hero : (HERO_TEMPLATES[key]?.() ?? null)
}

// ── Simulation ────────────────────────────────────────────────────────
function initSimulation() {
  const data = tierData.value
  const perLane = Math.floor(data.garrisonHp / 3)
  const gateHp  = data.garrisonHp - 2 * perLane

  warbandMaxHp.value  = data.warbandBaseHp
  warbandHp.value     = data.warbandBaseHp
  garrisonMaxHp.value = data.garrisonHp
  garrisonHp.value    = data.garrisonHp

  laneMaxHp.value = { west: perLane, gate: gateHp, east: perLane }
  laneHp.value    = { west: perLane, gate: gateHp, east: perLane }
  laneStatus.value = { west: 'active', gate: 'active', east: 'active' }

  tick.value       = 0
  battleLog.value  = []
  addLog(SIEGE_LOG[props.faction.id]?.open?.() ?? 'The battle begins.')

  startSim()
}

function getLanePower(laneId) {
  const heroes = siege.lanes[laneId] ?? []
  let power = heroes.length * 250
  for (const heroKey of heroes) {
    const unitId = siege.assignments[heroKey]
    if (unitId) {
      const unit  = UNIT_TYPES[unitId]
      const count = Math.min(siege.army[unitId] ?? 0, 40)
      power += unit.atk * count * 0.12
    }
  }
  return power
}

const MILESTONE_FIRED = ref({ west50: false, gate50: false, east50: false })

function runTick() {
  tick.value++
  const data = tierData.value
  let activeCount = 0

  for (const laneId of LANE_IDS) {
    if (laneStatus.value[laneId] !== 'active') continue
    activeCount++

    const power = getLanePower(laneId)
    const dmg   = Math.max(3, power * 0.009)
    laneHp.value[laneId] = Math.max(0, laneHp.value[laneId] - dmg)

    const pct = lanePct(laneId)

    // 50% milestone event
    const mKey = `${laneId}50`
    if (pct <= 50 && !MILESTONE_FIRED.value[mKey]) {
      MILESTONE_FIRED.value[mKey] = true
      const text = SIEGE_LOG[props.faction.id]?.[mKey]?.()
      if (text) addLog(text)
    }

    // Lane breached
    if (laneHp.value[laneId] <= 0) {
      const hasHeroes = (siege.lanes[laneId]?.length ?? 0) > 0
      laneStatus.value[laneId] = hasHeroes ? 'breached' : 'collapsed'

      const breachText = SIEGE_LOG[props.faction.id]?.[`${laneId}0`]?.()
      if (breachText) addLog(breachText)

      // Flanking bonus: breach a flank → gate takes extra damage
      if (hasHeroes && laneId !== 'gate') {
        const flankKey = laneId === 'west' ? 'flankWest' : 'flankEast'
        const flankText = SIEGE_LOG[props.faction.id]?.[flankKey]?.()
        if (flankText) addLog(flankText)
        laneHp.value.gate = Math.max(0, laneHp.value.gate - laneMaxHp.value.gate * 0.18)
      }
    }
  }

  // Garrison counterattacks warband (only active lanes deal pressure)
  if (activeCount > 0) {
    const pressure = (data.garrisonAtk * activeCount / LANE_IDS.length) * 0.9
    warbandHp.value = Math.max(0, warbandHp.value - pressure)
  }

  // Update total garrison HP
  garrisonHp.value = Math.max(0,
    laneHp.value.west + laneHp.value.gate + laneHp.value.east
  )

  // Check defeat
  if (warbandHp.value <= 0) {
    stopSim()
    siegeResult.value = 'defeat'
    return
  }

  // Check all lanes done
  const allDone = LANE_IDS.every(l => laneStatus.value[l] !== 'active')
  if (allDone) {
    const anyBreached = LANE_IDS.some(l => laneStatus.value[l] === 'breached')
    if (anyBreached) {
      const txt = SIEGE_LOG[props.faction.id]?.allBreached?.()
      if (txt) addLog(txt)
      stopSim()
      triggerPhaseTransition()
    } else {
      stopSim()
      siegeResult.value = 'defeat'
    }
  }
}

function addLog(text) {
  if (!text) return
  battleLog.value.unshift({ id: `${tick.value}-${Math.random()}`, text, tick: tick.value })
  if (battleLog.value.length > 60) battleLog.value.pop()
}

function startSim() {
  stopSim()
  simTimer = setInterval(runTick, TICK_DELAYS[simSpeed.value] ?? 800)
}

function stopSim() {
  if (simTimer) { clearInterval(simTimer); simTimer = null }
}

function setSpeed(s) {
  simSpeed.value = s
  if (simTimer) startSim()  // restart with new interval
}

// ── Phase transition ──────────────────────────────────────────────────
function triggerPhaseTransition() {
  showPhaseCard.value = true
  setTimeout(() => {
    showPhaseCard.value = false
    currentPhase.value = 2
    nextTick(() => startPhase2())
  }, 2500)
}

// ── Phase 2: Vanguard fight ───────────────────────────────────────────
function buildVanguardTeam() {
  return siege.phase2Party
    .filter(k => k !== null)
    .map(key => {
      const hero = key === 'PLAYER_CHARACTER'
        ? playerHeroStore.buildHeroInstance()
        : HERO_TEMPLATES[key]?.()
      if (!hero) return null
      const stars = collection.getStars(key)
      if (stars > 0) hero.applyStarBonus?.(stars)
      const { stats, damageReduction } = inventory.computeGearStats(key)
      const flatScale = key === 'PLAYER_CHARACTER' ? playerHeroStore.levelMultiplier : 1
      hero.applyGear(stats, damageReduction, flatScale)
      if (key !== 'PLAYER_CHARACTER' && inventory.isProgressive?.(key)) {
        hero.applyLevelScale?.(playerHeroStore.levelMultiplier)
      }
      return hero
    })
    .filter(Boolean)
}

function startPhase2() {
  playSiegeVanguard()
  const commander = buildSiegeCommander(props.faction.id, props.tier.id)
  if (!commander) { siegeResult.value = 'victory'; return }

  const encounter = {
    id:         `siege_${props.faction.id}_${props.tier.id}`,
    enemies:    [() => commander],
    rewards:    { gold: props.tier.gold, diamonds: props.tier.diamonds },
    mechanics:  [],
    isSiege:    true,
    isRaid:     false,
    isDungeon:  false,
    isTraining: false,
  }

  const vanguard = buildVanguardTeam()
  if (battleStore.autoplay) battleStore.toggleAutoplay()
  battleStore.initBattle(encounter, vanguard)
}

// Watch battle store for phase 2 end
import { watch } from 'vue'
watch(() => battleStore.state, (state) => {
  if (currentPhase.value !== 2) return
  if (state === BattleState.VICTORY) {
    siegeResult.value = 'victory'
    if (!siegeVictoryRecorded.value) {
      siegeVictoryRecorded.value = true
      battleStore.recordSiegeVictory()
    }
  }
  if (state === BattleState.DEFEAT)  siegeResult.value = 'defeat'
})

// ── Phase 2 UI helpers ────────────────────────────────────────────────
const canTargetEnemy = computed(() =>
  battleStore.state === BattleState.SELECTING_TARGET &&
  battleStore.enemyTeam[0] && !battleStore.enemyTeam[0].isDead
)

const enemyHitFlash = ref(false)

const commanderHpPct = computed(() => {
  const e = battleStore.enemyTeam[0]
  if (!e) return 100
  return Math.max(0, e.hp / e.maxHp * 100)
})

const commanderHpColor = computed(() => {
  const p = commanderHpPct.value
  if (p > 60) return props.faction.color
  if (p > 30) return '#ff9944'
  return '#ff4444'
})

function heroPortrait(hero) { return getPortrait(hero) }
function heroHpPct(hero)    { return Math.max(0, hero.hp / hero.maxHp * 100) }
function heroHpColor(hero)  {
  const p = heroHpPct(hero)
  if (p > 60) return '#4daa66'
  if (p > 25) return '#cc8830'
  return '#cc4040'
}

function onEnemyClick() {
  if (!canTargetEnemy.value) return
  battleStore.selectTarget(battleStore.enemyTeam[0])
}

function onHeroSlotClick(hero) {
  if (battleStore.state !== BattleState.SELECTING_TARGET) return
  if (hero.isDead) return
  const skill = battleStore.activeHero?.skills[battleStore.selectedSkillIndex]
  if (!skill) return
  const t = skill.targetType
  if (t === TargetType.SINGLE_ALLY || t === TargetType.ALL_ALLIES || t === TargetType.SELF) {
    battleStore.selectTarget(hero)
  }
}

const recentP2Log = computed(() => (battleStore.battleLog ?? []).slice(-6).reverse())

const SE_LABELS = {
  poison: 'PSN', burn: 'BRN', freeze: 'FRZ', stun: 'STN', weaken: 'WKN',
  decrease_atk: '-ATK', decrease_def: '-DEF', decrease_spd: '-SPD', sleep: 'SLP',
  shield: 'SHD', increase_atk: '+ATK', increase_def: '+DEF', increase_spd: '+SPD',
  counter: 'CTR', immunity: 'IMN', continuous_heal: 'HOT', provoke: 'PRV',
}
function seLabel(type) { return SE_LABELS[type] ?? type }
function seClass(type) {
  const debuffs = new Set(['poison','burn','freeze','stun','weaken','decrease_atk','decrease_def','decrease_spd','sleep'])
  return debuffs.has(type) ? 'se-debuff' : 'se-buff'
}

// ── Lifecycle ─────────────────────────────────────────────────────────
onMounted(() => {
  playSiegeBreach()
  initSimulation()
})

onUnmounted(() => {
  stopSim()
  playMain()
})
</script>

<style scoped>
.siege-arena {
  position: fixed;
  inset: 0;
  z-index: 300;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.arena-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(4,2,1,0.94) 100%);
  pointer-events: none;
}

/* ── Phase card overlay ─────────────────────────────────────────── */
.phase-card-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.85);
  gap: 12px;
  backdrop-filter: blur(12px);
}
.pc-eyebrow { font-family: var(--font-head); font-size: 0.7rem; letter-spacing: 4px; color: #555; text-transform: uppercase; }
.pc-name    { font-family: var(--font-head); font-size: 2.4rem; font-weight: 900; color: #ddd; letter-spacing: 2px; }
.pc-bar     { width: 120px; height: 3px; border-radius: 2px; }
.pc-sub     { font-size: 0.72rem; color: #888; font-style: italic; margin-top: 4px; }
.phase-card-enter-active, .phase-card-leave-active { transition: opacity 0.4s, transform 0.4s; }
.phase-card-enter-from, .phase-card-leave-to { opacity: 0; transform: scale(1.04); }

/* ── End overlay ────────────────────────────────────────────────── */
.end-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  background: rgba(0,0,0,0.88);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  backdrop-filter: blur(10px);
}
.end-title { font-family: var(--font-head); font-size: 2.8rem; font-weight: 900; letter-spacing: 2px; }
.end-title.victory { color: #c8962a; }
.end-title.defeat  { color: #cc4444; }
.end-sub { font-size: 0.78rem; color: #888; font-style: italic; max-width: 460px; text-align: center; line-height: 1.8; }
.end-rewards { display: flex; gap: 10px; align-items: center; }
.reward-pill { font-size: 0.72rem; font-weight: 700; font-family: var(--font-head); padding: 5px 14px; border-radius: 20px; border: 1px solid; }
.reward-pill.gold    { color: #c8962a; border-color: #c8962a55; background: #c8962a11; }
.reward-pill.diamond { color: #88aaff; border-color: #88aaff55; background: #88aaff11; }
.reward-pill.mat     { border-color: currentColor; }
.end-btn { margin-top: 8px; background: none; border: 1px solid #444; color: #888; font-size: 0.72rem; padding: 10px 28px; border-radius: 8px; font-family: var(--font-head); letter-spacing: 1.5px; cursor: pointer; transition: all 0.15s; }
.end-btn:hover { border-color: #888; color: #ccc; }
.end-fade-enter-active, .end-fade-leave-active { transition: opacity 0.5s; }
.end-fade-enter-from, .end-fade-leave-to { opacity: 0; }

/* ── Header ─────────────────────────────────────────────────────── */
.siege-header {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(0,0,0,0.3);
  backdrop-filter: blur(8px);
  flex-shrink: 0;
}
.back-btn { background: none; border: 1px solid #333; color: #888; font-size: 0.7rem; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-family: var(--font-head); letter-spacing: 1px; transition: all 0.15s; }
.back-btn:hover { border-color: #666; color: #ccc; }
.phase-badge { font-family: var(--font-head); font-size: 0.68rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 14px; border-radius: 12px; border: 1px solid; background: rgba(255,255,255,0.03); }
.header-faction { display: flex; align-items: center; gap: 6px; margin-left: auto; font-family: var(--font-head); font-size: 0.64rem; font-weight: 700; }
.hf-sep { color: #333; }
.hf-tier { font-size: 0.6rem; }

/* ══════════════════════════════════════════════════════════════════ */
/* PHASE 1                                                           */
/* ══════════════════════════════════════════════════════════════════ */
.phase1-view {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow: hidden;
  min-height: 0;
}

/* HP bars */
.siege-hp-bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 22px 8px;
  flex-shrink: 0;
}
.hp-row { display: flex; align-items: center; gap: 10px; }
.hp-label { font-family: var(--font-head); font-size: 0.56rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; width: 110px; flex-shrink: 0; }
.hp-label.friendly { color: #4daa66; }
.hp-label.enemy    { color: #cc6644; }
.hp-track { flex: 1; height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden; }
.hp-fill  { height: 100%; border-radius: 4px; transition: width 0.4s ease; }
.friendly-fill { background: #4daa66; }
.enemy-fill    { transition: width 0.4s ease; }
.hp-val { font-family: var(--font-head); font-size: 0.6rem; color: #666; width: 130px; text-align: right; flex-shrink: 0; }

/* Lane area */
.siege-main {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 12px;
  padding: 10px 22px;
  overflow: hidden;
  min-height: 0;
}

.lanes-area {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  overflow: hidden;
}

.battle-lane-col {
  background: rgba(8,4,2,0.7);
  border: 1px solid #1e1008;
  border-radius: 10px;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
  transition: border-color 0.3s;
}
.battle-lane-col.breached { border-color: #c8962a55; background: rgba(10,6,2,0.7); }
.battle-lane-col.collapsed { border-color: #44141466; opacity: 0.65; }

.lane-title {
  font-family: var(--font-head);
  font-size: 0.56rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: #666;
  border-bottom: 1px solid #1e1008;
  padding-bottom: 6px;
  flex-shrink: 0;
}

.lane-enemies {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex-shrink: 0;
}
.garrison-chip {
  font-size: 0.54rem;
  color: #888;
  background: rgba(255,255,255,0.04);
  border: 1px solid #2a1208;
  border-radius: 4px;
  padding: 2px 6px;
  white-space: nowrap;
}

.lane-hp-wrap {
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
  flex-shrink: 0;
}
.lane-hp-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
.lane-hp-num { font-size: 0.54rem; color: #444; font-family: var(--font-head); flex-shrink: 0; text-align: right; }

.lane-status-badge {
  font-family: var(--font-head);
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: center;
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
}
.lane-status-badge.breached  { color: #c8962a; background: #c8962a18; border: 1px solid #c8962a44; }
.lane-status-badge.collapsed { color: #cc4444; background: #cc444418; border: 1px solid #cc444444; }

.lane-vs {
  text-align: center;
  font-size: 0.9rem;
  color: #2a1808;
  flex-shrink: 0;
}

.lane-commanders {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow-y: auto;
}
.lane-empty-hint { font-size: 0.56rem; color: #2a1808; font-style: italic; text-align: center; padding: 6px 0; }

.battle-commander {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.02);
  border: 1px solid #1e1008;
  border-radius: 6px;
  padding: 5px 7px;
  flex-shrink: 0;
}
.bc-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.bc-name { font-size: 0.6rem; font-weight: 700; color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.bc-unit { font-size: 0.56rem; color: #888; display: flex; align-items: center; gap: 3px; }
.bc-unit-count { color: #555; }

/* Battle log */
.battle-log-panel {
  background: rgba(6,3,1,0.8);
  border: 1px solid #1a0e06;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.log-header {
  font-family: var(--font-head);
  font-size: 0.54rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: #444;
  padding: 10px 14px 8px;
  border-bottom: 1px solid #1a0e06;
  flex-shrink: 0;
}
.log-entries {
  flex: 1;
  overflow-y: auto;
  padding: 8px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.log-entry {
  font-size: 0.65rem;
  color: #888;
  line-height: 1.6;
  border-bottom: 1px solid #1a0e0644;
  padding-bottom: 5px;
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.log-tick { font-family: var(--font-head); font-size: 0.5rem; color: #3a2210; flex-shrink: 0; min-width: 24px; }
.log-line-enter-active { transition: opacity 0.3s, transform 0.3s; }
.log-line-enter-from   { opacity: 0; transform: translateY(-6px); }

/* Speed controls */
.sim-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 22px;
  border-top: 1px solid rgba(255,255,255,0.04);
  flex-shrink: 0;
}
.speed-btns { display: flex; gap: 4px; }
.speed-btn {
  background: none;
  border: 1px solid #2a1808;
  color: #555;
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.12s;
}
.speed-btn:hover { border-color: #5a3820; color: #888; }
.speed-btn.active { border-color: #c8962a; color: #c8962a; background: #c8962a18; }
.sim-tick-label { font-size: 0.54rem; color: #333; font-family: var(--font-head); margin-left: auto; letter-spacing: 1px; }

/* ══════════════════════════════════════════════════════════════════ */
/* PHASE 2                                                           */
/* ══════════════════════════════════════════════════════════════════ */
.phase2-view {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.turn-label {
  position: relative;
  z-index: 1;
  text-align: center;
  font-family: var(--font-head);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 10px;
  color: #666;
  flex-shrink: 0;
}
.turn-label.selecting_skill { color: #4daa88; }
.turn-label.selecting_target { color: #c8962a; }
.turn-label.enemy_turn { color: #cc6644; }

/* Enemy section */
.enemy-section {
  display: flex;
  justify-content: center;
  padding: 20px 24px 12px;
  flex-shrink: 0;
}

.enemy-card {
  display: flex;
  align-items: center;
  gap: 24px;
  background: rgba(6,3,1,0.6);
  border: 1px solid #2a1208;
  border-radius: 14px;
  padding: 18px 28px;
  backdrop-filter: blur(8px);
  cursor: default;
  transition: border-color 0.2s;
  max-width: 560px;
  width: 100%;
}
.enemy-card.targetable { border-color: #c8962a66; cursor: crosshair; }
.enemy-card.hit { animation: hit-flash 0.25s ease; }
@keyframes hit-flash { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }

.commander-portrait-wrap { position: relative; flex-shrink: 0; }
.commander-portrait-fallback {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cpf-initial { font-family: var(--font-head); font-size: 2rem; font-weight: 900; }
.enemy-dead-veil { position: absolute; inset: 0; background: rgba(0,0,0,0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #888; font-size: 1.2rem; }
.target-ring { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid; animation: pulse-ring 1s ease infinite; }
@keyframes pulse-ring { 0%,100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }

.commander-info { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.commander-name { font-family: var(--font-head); font-size: 1.1rem; font-weight: 800; letter-spacing: 1px; }
.commander-title { font-size: 0.62rem; color: #555; font-family: var(--font-head); text-transform: uppercase; letter-spacing: 2px; }
.commander-hp-track { height: 10px; background: rgba(255,255,255,0.06); border-radius: 5px; overflow: hidden; position: relative; }
.commander-hp-fill { height: 100%; border-radius: 5px; transition: width 0.4s ease; }
.commander-hp-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.54rem; font-family: var(--font-head); color: rgba(255,255,255,0.6); }
.commander-status-row { display: flex; flex-wrap: wrap; gap: 4px; }

/* P2 log */
.p2-log-feed {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 24px;
  flex-shrink: 0;
  max-height: 80px;
  overflow: hidden;
}
.p2-log-line { font-size: 0.63rem; color: #666; font-style: italic; text-align: center; }

/* Party row */
.party-row {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 24px;
  margin-top: auto;
  flex-shrink: 0;
}

.hero-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 90px;
  cursor: default;
  padding: 8px 6px;
  border-radius: 10px;
  border: 1px solid #1a1008;
  background: rgba(8,4,2,0.6);
  transition: all 0.15s;
}
.hero-slot.slot-active { border-color: #4daa6666; background: rgba(10,20,12,0.6); }
.hero-slot.slot-dead   { opacity: 0.4; }
.hero-slot.slot-targetable { cursor: crosshair; border-color: #c8962a44; }
.hero-slot.slot-targetable:hover { border-color: #c8962a; }

.slot-portrait-wrap { position: relative; }
.slot-portrait { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
.slot-portrait-fallback { width: 56px; height: 56px; border-radius: 50%; background: #1e1008; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-family: var(--font-head); color: #888; }
.slot-dead-veil { position: absolute; inset: 0; background: rgba(0,0,0,0.7); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #888; font-size: 0.9rem; }
.slot-active-ring { position: absolute; inset: -3px; border-radius: 50%; border: 2px solid #4daa66; animation: pulse-ring 1s ease infinite; }

.slot-name { font-size: 0.6rem; font-weight: 700; color: #ccc; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80px; }
.slot-hp-track { width: 100%; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
.slot-hp-fill  { height: 100%; border-radius: 2px; transition: width 0.3s ease; }
.slot-hp-label { font-size: 0.52rem; color: #555; font-family: var(--font-head); }

/* Status pips */
.status-pip { font-size: 0.5rem; padding: 1px 5px; border-radius: 3px; font-family: var(--font-head); font-weight: 700; border: 1px solid; }
.se-debuff { color: #e05050; border-color: #e0505044; background: #e0505018; }
.se-buff   { color: #4daa88; border-color: #4daa8844; background: #4daa8818; }

/* Skill bar */
.skill-bar {
  position: relative;
  z-index: 2;
  border-top: 1px solid rgba(255,255,255,0.05);
  background: rgba(4,2,1,0.9);
  backdrop-filter: blur(8px);
  padding: 12px 20px 16px;
  flex-shrink: 0;
}
.skill-bar-hero { font-family: var(--font-head); font-size: 0.58rem; color: #555; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; }
.skill-row { display: flex; gap: 8px; justify-content: center; }

.siege-skill-btn {
  flex: 1;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  padding: 10px 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid #2a1808;
  border-radius: 8px;
  cursor: not-allowed;
  text-align: left;
  transition: all 0.15s;
}
.siege-skill-btn.ready { border-color: #5a3820; cursor: pointer; }
.siege-skill-btn.ready:hover { background: rgba(255,255,255,0.06); border-color: #c8962a66; }
.siege-skill-btn.selected { border-color: #c8962a; background: rgba(200,150,42,0.08); }
.ssb-name { font-family: var(--font-head); font-size: 0.64rem; font-weight: 700; color: #ccc; }
.ssb-cd   { font-size: 0.54rem; color: #cc6644; font-family: var(--font-head); }
.ssb-desc { font-size: 0.58rem; color: #666; line-height: 1.5; }

.skill-bar-enter-active, .skill-bar-leave-active { transition: opacity 0.2s, transform 0.2s; }
.skill-bar-enter-from, .skill-bar-leave-to { opacity: 0; transform: translateY(8px); }
</style>
