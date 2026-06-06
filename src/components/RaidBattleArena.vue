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
          {{ store.state === 'victory' ? 'Raid Complete' : 'Defeated' }}
        </div>
        <div class="end-sub" v-if="store.state === 'victory'">The Throne of Regret falls silent.</div>
        <div class="end-sub" v-else>The darkness was too great.</div>
        <div class="end-rewards" v-if="store.state === 'victory' && store.lastReward">
          <span class="reward-pill gold">🪙 {{ store.lastReward.gold?.toLocaleString() }}</span>
          <span class="reward-pill diamond">💎 {{ store.lastReward.diamonds }}</span>
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

    <!-- ── Boss section ──────────────────────────────────────────── -->
    <div class="boss-section">
      <div
        class="boss-portrait-wrap"
        :class="{ 'boss-targetable': store.state === 'selecting_target', 'boss-hit': bossHitFlash }"
        @click="onBossClick"
      >
        <img v-if="bossImg" :src="bossImg" class="boss-portrait" />
        <div v-else class="boss-fallback">?</div>
        <div class="boss-dead-veil" v-if="boss?.isDead" />
      </div>

      <div class="boss-info">
        <div class="boss-name">{{ boss?.name }}</div>
        <div class="boss-hp-track">
          <div
            class="boss-hp-fill"
            :style="{ width: bossHpPct + '%', background: bossHpColor }"
          />
          <span class="boss-hp-label">
            {{ boss?.hp?.toLocaleString() }} / {{ boss?.maxHp?.toLocaleString() }}
          </span>
        </div>
        <!-- Status effects -->
        <div class="boss-status-row" v-if="boss?.statusEffects?.length">
          <span
            v-for="se in boss.statusEffects"
            :key="se.type"
            class="status-pip"
            :class="seClass(se.type)"
          >{{ seLabel(se.type) }} {{ se.duration }}t</span>
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

    <!-- Target hint when selecting_target for ally skills -->
    <div class="target-hint" v-if="store.state === 'selecting_target' && needsAllyTarget">
      Click a hero to target them
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useBattleStore }     from '../stores/useBattleStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { getPortrait }        from '../game/portraits.js'
import { TargetType }         from '../game/Skill.js'
import { RAID_ENCOUNTERS }    from '../game/data/raidEncounters.js'
import bossImg  from '../assets/dungeons/Raid_fallen-king-batman.png'
import arenaBg  from '../assets/dungeons/raid_fallen_room.jpeg'

const props = defineProps({ raidId: { type: String, required: true } })
defineEmits(['back'])

const store      = useBattleStore()
const collection = useCollectionStore()

const encounter = RAID_ENCOUNTERS[props.raidId]

// ── Arena background ─────────────────────────────────────────────
const arenaStyle = { backgroundImage: `url(${arenaBg})` }

// ── Boss ─────────────────────────────────────────────────────────
const boss       = computed(() => store.enemyTeam[0] ?? null)
const bossHpPct  = computed(() => boss.value ? Math.max(0, boss.value.hp / boss.value.maxHp * 100) : 100)
const bossHpColor = computed(() => {
  const pct = bossHpPct.value
  if (pct > 70) return '#c9a227'
  if (pct > 30) return '#ff9944'
  return '#b44fff'
})
const bossHitFlash = ref(false)

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

// ── Auto-target boss for single-enemy skills ──────────────────────
const needsAllyTarget = ref(false)

watch(() => store.state, (newState) => {
  if (newState !== 'selecting_target') { needsAllyTarget.value = false; return }
  const targetType = store.engine?.pendingSkill?.skill?.targetType
  if (targetType === TargetType.SINGLE_ENEMY || !targetType) {
    needsAllyTarget.value = false
    nextTick(() => {
      if (store.state === 'selecting_target' && boss.value && !boss.value.isDead) {
        store.selectTarget(boss.value)
      }
    })
  } else {
    needsAllyTarget.value = true
  }
})

function onBossClick() {
  if (store.state === 'selecting_target' && !needsAllyTarget.value && boss.value) {
    store.selectTarget(boss.value)
  }
}

function onHeroSlotClick(hero) {
  if (store.state === 'selecting_target' && needsAllyTarget.value) {
    store.selectTarget(hero)
  }
}

// ── Battle log ───────────────────────────────────────────────────
const recentLog = computed(() => {
  const log = store.battleLog
  const start = Math.max(0, log.length - 5)
  return log.slice(start).map((text, i) => ({ id: start + i, text }))
})

// ── Boss hit flash (watches lastAction) ──────────────────────────
watch(() => store.lastAction, (action) => {
  if (!action) return
  const hitsBoss = action.hits?.some(h => h.targetId?.startsWith('batman'))
  if (hitsBoss && !boss.value?.isDead) {
    bossHitFlash.value = true
    setTimeout(() => { bossHitFlash.value = false }, 300)
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
  const team = collection.buildTeam()
  if (store.autoplay) store.toggleAutoplay()
  store.initBattle(encounter, team)
  // Allow phase watcher to fire after first render
  nextTick(() => { phaseWatchReady = true })
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
.raid-header, .boss-section, .battle-log-feed,
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

/* ── Boss section ────────────────────────────────────────────── */
.boss-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px 8px;
  flex-shrink: 0;
}

.boss-portrait-wrap {
  position: relative;
  height: 260px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: filter 0.1s;
  cursor: default;
}
.boss-portrait-wrap.boss-targetable {
  cursor: crosshair;
}
.boss-portrait-wrap.boss-targetable:hover {
  filter: brightness(1.15) drop-shadow(0 0 16px rgba(255, 80, 80, 0.6));
}
.boss-portrait-wrap.boss-hit {
  filter: brightness(2) saturate(0.3);
}

.boss-portrait {
  height: 260px;
  width: auto;
  max-width: 420px;
  object-fit: contain;
  filter: drop-shadow(0 4px 24px rgba(0,0,0,0.9));
}

.boss-fallback {
  width: 200px;
  height: 260px;
  background: #1a0c06;
  border: 1px solid #3a1e0a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #3a1e0a;
}

.boss-dead-veil {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.7);
  border-radius: 8px;
}

.boss-info {
  width: 100%;
  max-width: 500px;
  margin-top: 10px;
}

.boss-name {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #c9a227;
  text-align: center;
  margin-bottom: 6px;
}

.boss-hp-track {
  position: relative;
  height: 10px;
  background: #120a04;
  border: 1px solid #2a1208;
  border-radius: 5px;
  overflow: hidden;
}
.boss-hp-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.4s ease, background 0.6s ease;
  box-shadow: 0 0 8px currentColor;
}
.boss-hp-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.58rem;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0,0,0,0.9);
}

.boss-status-row {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 6px;
  justify-content: center;
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
  gap: 12px;
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
