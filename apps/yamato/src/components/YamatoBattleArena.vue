<template>
  <div class="yb-shell" :class="{ 'shake-light': shakeLight, 'shake-heavy': shakeHeavy, eclipse }">

    <!-- ══ Battlefield ══ -->
    <section class="battlefield" ref="stageEl" :style="{ backgroundImage: `url(${ground.bg})` }">
      <div class="paper-grain" />
      <div class="ink-edge ink-edge--top" />
      <div class="ink-edge ink-edge--bottom" />
      <div class="petal-haze petal-haze--left" />
      <div class="petal-haze petal-haze--right" />

      <header class="battle-header">
        <div class="line-count line-count--ally">
          <span class="mini-mon">盟</span>
          <div><small>ALLIED LINE</small><b>{{ aliveAllies }} / {{ state.allies.length }}</b></div>
        </div>

        <div class="ritual-stack">
          <div class="yamato-calligraphy">大和の国</div>
          <div class="turn-order">
            <div v-for="a in turnOrder" :key="a.uid"
                 class="turn-chip" :class="{ active: a.uid === state.currentUid, dead: a.dead }">
              <img :src="a.portrait" :style="{ filter: a.filter }" alt="" />
            </div>
          </div>
          <div class="round-medallion">
            <span>ROUND {{ state.round }}</span>
            <small>{{ turnLabel }}</small>
          </div>
        </div>

        <div class="line-count line-count--enemy">
          <div><small>ENEMY LINE</small><b>{{ aliveEnemies }} / {{ state.enemies.length }}</b></div>
          <span class="mini-mon">敵</span>
        </div>
      </header>

      <!-- Stages come first in DOM so FX centre-lookup prefers them over formation cards -->
      <div class="active-stage active-stage--ally" ref="allyStageEl"
           :class="allyPulse" :data-hero-id="displayedAlly?.uid">
        <div class="combat-aura" />
        <div class="name-paper name-paper--ally">
          <small>ACTIVE ALLY</small>
          <strong>{{ displayedAlly?.name }}</strong>
          <span>{{ displayedAlly?.role }}</span>
        </div>
        <img v-if="displayedAlly" :src="displayedAlly.combat" :alt="displayedAlly.name" />
      </div>

      <div class="active-stage active-stage--enemy" ref="enemyStageEl"
           :class="enemyPulse" :data-hero-id="displayedEnemy?.uid">
        <div class="combat-aura" />
        <div class="name-paper name-paper--enemy">
          <small>CURRENT FOE</small>
          <strong>{{ displayedEnemy?.name }}</strong>
          <span>{{ displayedEnemy?.role }}</span>
        </div>
        <img v-if="displayedEnemy" :src="displayedEnemy.combat" :alt="displayedEnemy.name" />
      </div>

      <div class="formation formation--ally">
        <button v-for="a in state.allies" :key="a.uid" type="button"
                class="battler ally"
                :data-hero-id="a.uid"
                :class="{ dead: a.dead, active: a.uid === state.currentUid, hit: hitUid === a.uid }">
          <div class="battler-portrait"><img :src="a.portrait" :style="{ filter: a.filter }" alt="" /></div>
          <div class="battler-main">
            <div class="battler-name"><strong>{{ a.name }}</strong><span>{{ a.role }}</span></div>
            <div class="hp-frame">
              <span class="hp-fill ally" :style="{ width: pct(a.hp, a.maxHp) }" />
              <span class="shield-fill" :style="{ width: pct(a.shield, a.maxHp) }" />
            </div>
            <div class="battler-value">
              <span>{{ fmt(a.hp) }}/{{ fmt(a.maxHp) }}</span>
              <span>SPD {{ Math.round(effectiveSpeed(a)) }}</span>
            </div>
            <div class="battler-statuses">
              <span v-for="c in chips(a, true)" :key="c.key" class="status-chip compact" :class="c.kind" :title="c.label">
                {{ c.icon }}<small>{{ c.short }} {{ c.turns }}</small>
              </span>
            </div>
          </div>
        </button>
      </div>

      <div class="formation formation--enemy">
        <button v-for="e in state.enemies" :key="e.uid" type="button"
                class="battler enemy"
                :data-hero-id="e.uid"
                :class="{ dead: e.dead, active: e.uid === state.currentUid, selected: e.uid === state.selectedTargetUid, hit: hitUid === e.uid }"
                @click="selectTarget(e.uid)">
          <div class="battler-portrait"><img :src="e.portrait" :style="{ filter: e.filter }" alt="" /></div>
          <div class="battler-main">
            <div class="battler-name"><strong>{{ e.name }}</strong><span>{{ e.role }}</span></div>
            <div class="hp-frame">
              <span class="hp-fill enemy" :style="{ width: pct(e.hp, e.maxHp) }" />
              <span class="shield-fill" :style="{ width: pct(e.shield, e.maxHp) }" />
            </div>
            <div class="battler-value">
              <span>{{ fmt(e.hp) }}/{{ fmt(e.maxHp) }}</span>
              <span>SPD {{ Math.round(effectiveSpeed(e)) }}</span>
            </div>
            <div class="battler-statuses">
              <span v-for="c in chips(e, true)" :key="c.key" class="status-chip compact" :class="c.kind" :title="c.label">
                {{ c.icon }}<small>{{ c.short }} {{ c.turns }}</small>
              </span>
            </div>
          </div>
        </button>
      </div>

      <canvas ref="fxCanvas" class="fx-canvas" />

      <div class="action-banner" :class="{ show: bannerShow }">{{ bannerText }}</div>

      <div class="damage-layer">
        <div v-for="f in floats" :key="f.id" class="float-number" :class="f.type"
             :style="{ left: f.x + 'px', top: f.y + 'px' }">{{ f.text }}</div>
      </div>

      <footer class="battle-ribbon">
        <div class="ribbon-controls">
          <button class="ink-button" :class="{ 'is-on': state.auto }"      @click="toggleAuto">{{ state.auto ? 'AUTO ON' : 'AUTO OFF' }}</button>
          <button class="ink-button" :class="{ 'is-on': state.speed === 2 }" @click="toggleSpeed">{{ state.speed }}× SPD</button>
        </div>
        <div class="battle-log"><span>✿</span> {{ logText }}</div>
        <button class="ink-button ink-button--icon" @click="$emit('back')" title="Leave battle">✕</button>
      </footer>
    </section>

    <!-- ══ Command layer ══ -->
    <section class="command-layer">
      <img class="bottom-shell-art" :src="art.shell" alt="" />

      <!-- Commander dossier -->
      <aside class="artifact-panel commander-panel">
        <img class="artifact-base" :src="art.commander" alt="" />
        <div class="artifact-overlay">
          <div class="artifact-small-title"><span>戦</span> WAR NOTE</div>
          <div class="overlay-portrait commander-portrait">
            <img v-if="displayedAlly" :src="displayedAlly.portrait" :style="{ filter: displayedAlly.filter }" alt="" />
          </div>
          <div class="overlay-name commander-name">
            <strong>{{ displayedAlly?.name }}</strong>
            <span>{{ displayedAlly?.role }}</span>
            <b>{{ displayedAlly?.clan }}</b>
          </div>
          <div class="overlay-stats commander-stats">
            <div><span>HP</span><b>{{ fmt(displayedAlly?.hp) }}</b></div>
            <div><span>SHIELD</span><b>{{ fmt(displayedAlly?.shield) }}</b></div>
            <div><span>ATK</span><b>{{ fmt(displayedAlly?.atk) }}</b></div>
            <div><span>SPD</span><b>{{ displayedAlly ? Math.round(effectiveSpeed(displayedAlly)) : 0 }}</b></div>
          </div>
          <div class="commander-effects">
            <small>ACTIVE EFFECTS</small>
            <div class="status-list status-list--panel">
              <span v-for="c in chips(displayedAlly)" :key="c.key" class="status-chip" :class="c.kind" :title="c.label">
                {{ c.icon }}<small>{{ c.short }} {{ c.turns }}</small>
              </span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Ability board -->
      <section class="ability-board">
        <div class="ability-heading">
          <div>
            <small>BATTLE MANDATE</small>
            <h1>{{ headingText }}</h1>
            <div class="mandate-kanji">戦法選択</div>
          </div>
          <div class="mode-stamp">{{ state.auto ? 'AUTO' : 'MANUAL' }}</div>
        </div>

        <div class="skills-grid">
          <button v-for="(skill, i) in skillsActor?.skills ?? []" :key="i"
                  class="skill-plaque"
                  :data-kind="PLAQUE_KIND[i]"
                  :class="{ 'on-cooldown': (skillsActor?.cooldowns[i] ?? 0) > 0 }"
                  :disabled="!canUse(i)"
                  @click="useSkill(i)">
            <img :src="art.plaques[i] ?? art.plaques[0]" :alt="skill.name" />
            <div class="skill-num">{{ i + 1 }}</div>
            <div class="skill-name"><strong>{{ skill.name }}</strong><span>{{ skill.type }}</span></div>
            <p>{{ skill.desc }}</p>
            <div class="skill-footer">
              <span>{{ skill.cd ? `Cooldown ${skill.cd}` : 'No cooldown' }}</span>
              <span class="skill-ready">{{ (skillsActor?.cooldowns[i] ?? 0) > 0 ? 'RECHARGING' : 'READY' }}</span>
            </div>
            <div class="cooldown-mask">
              <div><b>{{ skillsActor?.cooldowns[i] }}</b><span>TURNS</span></div>
            </div>
          </button>
        </div>
      </section>

      <!-- Target dossier -->
      <aside class="artifact-panel target-panel">
        <img class="artifact-base" :src="art.target" alt="" />
        <div class="artifact-overlay">
          <div class="artifact-small-title artifact-small-title--right">FIELD DOSSIER <span>敵</span></div>
          <div class="overlay-portrait target-portrait">
            <img v-if="displayedEnemy" :src="displayedEnemy.portrait" :style="{ filter: displayedEnemy.filter }" alt="" />
          </div>
          <div class="overlay-name target-name">
            <small>CURRENT TARGET</small>
            <strong>{{ displayedEnemy?.name }}</strong>
            <span>{{ targetCondition }}</span>
          </div>
          <div class="overlay-divider overlay-divider--buff">BUFFS</div>
          <div class="status-row target-buffs">
            <span v-for="c in chips(displayedEnemy, false, 'buff')" :key="c.key" class="status-chip buff" :title="c.label">
              {{ c.icon }}<small>{{ c.short }} {{ c.turns }}</small>
            </span>
          </div>
          <div class="overlay-divider overlay-divider--debuff">DEBUFFS</div>
          <div class="status-row target-debuffs">
            <span v-for="c in chips(displayedEnemy, false, 'debuff')" :key="c.key" class="status-chip debuff" :title="c.label">
              {{ c.icon }}<small>{{ c.short }} {{ c.turns }}</small>
            </span>
          </div>
          <div class="overlay-stats target-stats">
            <div><span>HP</span><b>{{ fmt(displayedEnemy?.hp) }}</b></div>
            <div><span>DEF</span><b>{{ displayedEnemy ? Math.round(effectiveDefense(displayedEnemy)) : 0 }}</b></div>
            <div><span>ATK</span><b>{{ fmt(displayedEnemy?.atk) }}</b></div>
            <div><span>SPD</span><b>{{ displayedEnemy ? Math.round(effectiveSpeed(displayedEnemy)) : 0 }}</b></div>
            <div><span>RES</span><b>{{ fmt(displayedEnemy?.res) }}</b></div>
          </div>
          <div class="meter-block">
            <div><span>TURN METER</span><b>{{ turnMeter }}</b></div>
            <div class="turn-meter"><span :style="{ width: turnMeter }" /></div>
          </div>
        </div>
      </aside>
    </section>

    <!-- ══ Start overlay ══ -->
    <div class="modal-layer" :class="{ visible: !state.started }">
      <div class="start-card">
        <span class="eyebrow">{{ ground.sub.toUpperCase() }} — {{ ground.difficulty.toUpperCase() }}</span>
        <h2>{{ ground.name }}</h2>
        <p>{{ ground.flavor }}</p>
        <div class="duel-preview">
          <div>
            <img :src="ground.allies[0].combat" alt="" />
            <strong>{{ ground.allies.length }} Allies</strong><span>Yamato Vanguard</span>
          </div>
          <b>VS</b>
          <div>
            <img :src="ground.enemies[0].combat" alt="" />
            <strong>{{ ground.enemies.length }} Enemies</strong><span>Ashen Invaders</span>
          </div>
        </div>
        <button class="primary-button" @click="startBattle">BEGIN BATTLE</button>
        <small>Click an enemy to target it. Keys 1, 2 and 3 fire skills.</small>
      </div>
    </div>

    <!-- ══ Result overlay ══ -->
    <div class="modal-layer" :class="{ visible: showResult }">
      <div class="result-card">
        <span class="eyebrow">{{ state.victory ? 'VICTORY' : 'DEFEAT' }}</span>
        <h2>{{ state.victory ? 'Painted Triumph' : 'The Line Breaks' }}</h2>
        <p>{{ state.victory
          ? 'The Yamato line overwhelms the ashen band.'
          : 'The enemy breaks through, but the field can be retaken.' }}</p>
        <div class="result-stats">
          <div><b>{{ state.round }}</b><span>ROUNDS</span></div>
          <div><b>{{ fmt(state.damageDealt) }}</b><span>DAMAGE DEALT</span></div>
          <div><b>{{ fmt(state.damageTaken) }}</b><span>DAMAGE TAKEN</span></div>
          <div><b>{{ state.allies.filter(a => a.dead).length }}</b><span>FALLEN</span></div>
        </div>
        <button class="primary-button" @click="startBattle">FIGHT AGAIN</button>
        <button class="ghost-button" @click="$emit('back')">LEAVE FIELD</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCanvasFx } from '../../composables/useCanvasFx.js'
import { useYamatoBattle } from '../../composables/useYamatoBattle.js'
import { STATUS_META } from '../../game/data/yamato/units.js'

const props = defineProps({ ground: { type: Object, required: true } })
defineEmits(['back'])

const A = import.meta.env.BASE_URL + 'yamato/battle/'
const art = {
  shell:     A + 'yamato_bottom_stage_v3.png',
  commander: A + 'commander_dossier_art.png',
  target:    A + 'target_dossier_v3.png',
  plaques:   [A + 'plaque_attack.png', A + 'plaque_support.png', A + 'plaque_ultimate.png'],
}
const PLAQUE_KIND = ['attack', 'support', 'ultimate']

// ── Presentation state ────────────────────────────────────────────
const allyStageEl  = ref(null)
const enemyStageEl = ref(null)
const bannerText   = ref('')
const bannerShow   = ref(false)
const logText      = ref('Petals drift on the wind. Battle begins.')
const floats       = ref([])
const hitUid       = ref(null)
const allyPulse    = ref('')
const enemyPulse   = ref('')
const shakeLight   = ref(false)
const shakeHeavy   = ref(false)
const eclipse      = ref(false)
const showResult   = ref(false)
let floatSeq = 0

// Painted parchment battlefield: ink effects multiply into the ground, petals drift on top.
const fx = useCanvasFx({ blend: 'multiply', ambient: 'petal' })
const { fxCanvas, stageEl } = fx

// ── Hooks bridging engine → DOM presentation ──────────────────────
const battle = useYamatoBattle(fx, {
  onBanner(text) {
    bannerText.value = text
    bannerShow.value = false
    requestAnimationFrame(() => { bannerShow.value = true })
  },
  onLog(text) { logText.value = text },
  onFloat(uid, value, type, extra) {
    const actor = battle.getActor(uid)
    const el = actor?.team === 'ally' ? allyStageEl.value : enemyStageEl.value
    if (!el) return
    const x = el.offsetLeft + el.clientWidth / 2
    const y = el.offsetTop + el.clientHeight / 2 - 20
    const text = type === 'status' ? extra
      : (type === 'heal' || type === 'shield') ? `+${fmt(value)}` : fmt(value)
    const id = ++floatSeq
    floats.value.push({ id, x, y, text, type })
    setTimeout(() => { floats.value = floats.value.filter(f => f.id !== id) },
      1150 / battle.state.speed + 200)
  },
  onHit(uid) {
    hitUid.value = uid
    setTimeout(() => { if (hitUid.value === uid) hitUid.value = null }, 380 / battle.state.speed)
  },
  onPulse(team, cls) {
    const target = team === 'ally' ? allyPulse : enemyPulse
    target.value = ''
    requestAnimationFrame(() => {
      target.value = cls
      setTimeout(() => { target.value = '' }, 300 / battle.state.speed)
    })
  },
  onShake(heavy) {
    const flag = heavy ? shakeHeavy : shakeLight
    flag.value = false
    requestAnimationFrame(() => {
      flag.value = true
      setTimeout(() => { flag.value = false }, (heavy ? 420 : 280) / battle.state.speed)
    })
  },
  onEclipse(on) { eclipse.value = on },
  onEnd() { showResult.value = true },
})

const {
  state, useSkill, selectTarget, toggleAuto, toggleSpeed,
  displayedAlly, displayedEnemy, turnOrder, aliveAllies, aliveEnemies,
  activeActor, effectiveSpeed, effectiveDefense,
} = battle

// ── Derived display ───────────────────────────────────────────────
const fmt = n => Math.round(n ?? 0).toLocaleString('en-US')
const pct = (v, max) => `${Math.max(0, Math.min(100, (v / max) * 100))}%`

const skillsActor = computed(() => {
  const a = activeActor()
  return a?.team === 'ally' ? a : displayedAlly.value
})

function canUse(i) {
  const a = activeActor()
  if (!a || a.team !== 'ally' || state.busy || state.over) return false
  if (skillsActor.value?.uid !== a.uid) return false
  return (a.cooldowns[i] ?? 0) === 0
}

const headingText = computed(() => {
  if (state.over) return 'Battle resolved'
  const a = activeActor()
  if (a?.team === 'ally' && !state.busy) return `${a.name}'s Turn`
  if (a?.team === 'enemy') return `${a.name} is acting`
  return 'Choose a skill'
})

const turnLabel = computed(() => {
  if (state.over) return 'BATTLE ENDED'
  const a = activeActor()
  if (!a) return '—'
  return a.team === 'ally' ? `${a.name.toUpperCase()} TO ACT` : `${a.name.toUpperCase()} ACTING`
})

const turnMeter = computed(() => (activeActor()?.team === 'ally' ? '100%' : '18%'))

const targetCondition = computed(() => {
  const t = displayedEnemy.value
  if (!t) return '—'
  if (t.dead) return 'Defeated'
  if (t.hp <= t.maxHp * 0.25) return 'Near defeat'
  if (t.shield > 0) return 'Shielded'
  if (t.statuses.length) return t.statuses.map(s => STATUS_META[s.id]?.label).join(' · ')
  return 'Unbroken'
})

function chips(actor, compact = false, filterKind = null) {
  if (!actor) return []
  const out = []
  if (actor.shield > 0 && (!filterKind || filterKind === 'buff')) {
    out.push({ key: 'shield', ...STATUS_META.shield, turns: 'S' })
  }
  for (const s of actor.statuses) {
    const m = STATUS_META[s.id]
    if (!m) continue
    if (filterKind && m.kind !== filterKind) continue
    out.push({ key: s.id, ...m, turns: s.turns })
  }
  return out
}

// ── Lifecycle ─────────────────────────────────────────────────────
function startBattle() {
  showResult.value = false
  battle.begin(props.ground)
}

function onKey(e) {
  if (!state.started || state.over) return
  if (['1', '2', '3'].includes(e.key)) useSkill(Number(e.key) - 1)
}

battle.setup(props.ground)
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.yb-shell {
  --ink:#11100f; --paper:#eee4d2; --gold:#b49257;
  --red:#9d3f46; --red2:#c35d64; --jade:#54766b;
  position: fixed; inset: 0; z-index: 200;
  display: grid; grid-template-rows: minmax(0, 62fr) minmax(340px, 38fr);
  background: #11100f;
  font-family: Georgia, 'Times New Roman', serif;
  color: #2c241f;
  user-select: none;
}

/* ══ Battlefield ══ */
.battlefield {
  position: relative; isolation: isolate; overflow: hidden;
  background-size: cover; background-position: center; background-repeat: no-repeat;
}
.paper-grain {
  position: absolute; inset: 0; z-index: 1; pointer-events: none; mix-blend-mode: multiply;
  background:
    radial-gradient(circle at 50% 45%, rgba(255,255,255,.08), transparent 44%),
    linear-gradient(90deg, rgba(0,0,0,.35), transparent 8%, transparent 92%, rgba(0,0,0,.35));
}
.ink-edge { position: absolute; left: 0; right: 0; z-index: 2; pointer-events: none; height: 70px; }
.ink-edge--top    { top: 0;    background: linear-gradient(180deg, rgba(9,8,8,.96), rgba(9,8,8,.56) 38%, transparent); }
.ink-edge--bottom { bottom: 0; background: linear-gradient(0deg,   rgba(9,8,8,.98), rgba(9,8,8,.48) 40%, transparent); }
.petal-haze { position: absolute; bottom: 0; width: 300px; height: 280px; z-index: 2; pointer-events: none; }
.petal-haze--left  { left: 0;  background: radial-gradient(circle at 15% 85%, rgba(173,69,80,.28), transparent 58%); }
.petal-haze--right { right: 0; background: radial-gradient(circle at 85% 85%, rgba(173,69,80,.25), transparent 58%); }

/* ── Header ── */
.battle-header {
  position: absolute; z-index: 12; top: 12px; left: 24px; right: 24px;
  display: grid; grid-template-columns: 190px 1fr 190px; align-items: start; gap: 18px;
}
.line-count {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px; color: #f2e5cf;
  background: linear-gradient(90deg, rgba(15,14,13,.96), rgba(44,36,31,.91));
  border: 1px solid rgba(193,156,94,.48); box-shadow: 0 10px 22px rgba(0,0,0,.28);
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
}
.line-count--enemy { justify-content: flex-end; text-align: right; clip-path: polygon(8% 0, 100% 0, 100% 100%, 0 100%); }
.line-count small { display: block; color: #d1bd98; font-size: 10px; letter-spacing: .18em; }
.line-count b     { display: block; font: 700 22px/1 Arial, sans-serif; margin-top: 3px; }
.mini-mon {
  display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%;
  border: 1px solid rgba(205,174,113,.58); box-shadow: inset 0 0 0 3px rgba(17,16,15,.78);
  color: #d7bc84; font-size: 16px;
}
.ritual-stack { display: grid; justify-items: center; gap: 4px; color: #f0e4d0; }
.yamato-calligraphy { font-size: 34px; line-height: 1; letter-spacing: .08em; text-shadow: 0 2px 0 #000; }
.turn-order { display: flex; justify-content: center; gap: 7px; min-height: 33px; }
.turn-chip {
  width: 29px; height: 29px; transform: rotate(45deg); overflow: hidden;
  background: #e9dfcd; border: 2px solid rgba(229,210,177,.52); opacity: .42;
}
.turn-chip img { width: 145%; height: 145%; object-fit: cover; transform: rotate(-45deg) translate(-15%,-15%); }
.turn-chip.active { opacity: 1; border-color: var(--red2); box-shadow: 0 0 14px rgba(195,93,100,.55); }
.turn-chip.dead   { opacity: .15; filter: grayscale(1); }
.round-medallion {
  display: grid; place-items: center; width: 116px; height: 72px; border-radius: 50%;
  background: radial-gradient(circle, rgba(241,232,215,.96), rgba(221,206,178,.94));
  border: 3px double rgba(41,32,27,.74); box-shadow: 0 8px 18px rgba(0,0,0,.24);
  color: #392c24; text-align: center;
}
.round-medallion span  { font-size: 14px; letter-spacing: .1em; }
.round-medallion small { font-size: 8px; line-height: 1.1; letter-spacing: .08em; max-width: 92px; }

/* ── Formations ── */
.formation {
  position: absolute; z-index: 9; top: 100px; bottom: 78px; width: 222px;
  display: flex; flex-direction: column; justify-content: center; gap: 10px;
}
.formation--ally  { left: 14px; }
.formation--enemy { right: 14px; }
.battler {
  border: 0; background: transparent; padding: 0;
  display: grid; grid-template-columns: 56px 1fr; gap: 8px; align-items: center;
  text-align: left; color: #2e2520; cursor: default;
  transition: transform .17s ease, filter .17s ease;
  font-family: inherit;
}
.formation--enemy .battler { grid-template-columns: 1fr 56px; text-align: right; }
.formation--enemy .battler-portrait { grid-column: 2; grid-row: 1; }
.formation--enemy .battler-main     { grid-column: 1; grid-row: 1; }
.battler.enemy { cursor: pointer; }
.battler:hover, .battler.selected { transform: translateX(5px); }
.formation--enemy .battler:hover, .formation--enemy .battler.selected { transform: translateX(-5px); }
.battler.dead { opacity: .3; filter: grayscale(1); }
.battler.active .battler-portrait, .battler.selected .battler-portrait {
  border-color: var(--red2);
  box-shadow: 0 0 0 3px rgba(157,63,70,.28), 0 0 14px rgba(157,63,70,.3);
}
.battler.hit { animation: battlerHit .38s ease; }
@keyframes battlerHit {
  0%, 100% { transform: translateX(0); filter: none; }
  30%      { transform: translateX(-6px); filter: brightness(1.6) saturate(.4); }
  60%      { transform: translateX(4px); }
}
.battler-portrait {
  width: 56px; height: 56px; border-radius: 50%; padding: 4px;
  background: rgba(238,228,210,.9); border: 2px solid rgba(28,23,20,.72);
  box-shadow: 0 6px 12px rgba(0,0,0,.24);
}
.battler-portrait img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; filter: sepia(.15); }
.battler-main {
  padding: 5px 7px; min-width: 0;
  background: linear-gradient(90deg, rgba(238,228,210,.9), rgba(238,228,210,.55), transparent);
}
.formation--enemy .battler-main { background: linear-gradient(270deg, rgba(238,228,210,.9), rgba(238,228,210,.55), transparent); }
.battler-name { display: flex; justify-content: space-between; gap: 5px; align-items: end; }
.formation--enemy .battler-name { flex-direction: row-reverse; }
.battler-name strong { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.battler-name span   { font-size: 8px; color: #7f6b5b; max-width: 70px; }
.hp-frame {
  height: 7px; margin-top: 4px; position: relative; overflow: hidden;
  background: rgba(31,27,24,.16); border-bottom: 2px solid rgba(31,27,24,.66);
}
.hp-fill, .shield-fill { position: absolute; left: 0; top: 0; bottom: 0; transition: width .28s ease; }
.hp-fill.ally  { background: linear-gradient(90deg, #3f665c, #6b947f); }
.hp-fill.enemy { background: linear-gradient(90deg, #8f303a, #c15c63); }
.shield-fill   { background: rgba(65,87,141,.58); border-right: 1px solid #d5e1ff; }
.battler-value { display: flex; justify-content: space-between; font: 700 9px/1 Arial, sans-serif; margin-top: 3px; }
.formation--enemy .battler-value { flex-direction: row-reverse; }
.battler-statuses { display: flex; gap: 3px; flex-wrap: wrap; margin-top: 3px; min-height: 14px; }

/* ── Active stages ── */
.active-stage {
  position: absolute; z-index: 7; top: 120px; bottom: 75px; width: 34%;
  display: flex; align-items: flex-end; justify-content: center; pointer-events: none;
}
.active-stage--ally  { left: 16%; }
.active-stage--enemy { right: 16%; }
.active-stage img {
  position: relative; z-index: 3; max-height: 89%; max-width: 78%; object-fit: contain;
  filter: drop-shadow(0 18px 20px rgba(0,0,0,.32));
  transition: transform .22s ease, opacity .22s ease;
  transform-origin: 50% 100%;
}
.active-stage.flash img  { opacity: .7; transform: scale(1.02); }
.active-stage.attack img { transform: translateX(28px); }
.active-stage--enemy.attack img { transform: translateX(-28px); }
.combat-aura {
  position: absolute; left: 18%; right: 18%; bottom: 6%; height: 24%; border-radius: 50%;
  border: 2px solid rgba(190,150,86,.42);
  box-shadow: 0 0 0 5px rgba(190,150,86,.08), inset 0 0 30px rgba(190,150,86,.14);
}
.active-stage--enemy .combat-aura {
  border-color: rgba(162,60,68,.46);
  box-shadow: 0 0 0 5px rgba(162,60,68,.08), inset 0 0 30px rgba(162,60,68,.16);
}
.name-paper {
  position: absolute; z-index: 4; top: 42%; min-width: 220px; padding: 9px 14px;
  background: rgba(242,233,217,.87); border: 1px solid rgba(61,47,37,.24);
  box-shadow: 0 7px 15px rgba(0,0,0,.12);
}
.name-paper--ally  { left: 2%;  text-align: left; }
.name-paper--enemy { right: 2%; text-align: right; }
.name-paper small  { display: block; font-size: 9px; letter-spacing: .16em; color: #7f6b59; }
.name-paper strong { display: block; font-size: 19px; }
.name-paper span   { font-size: 11px; color: #785f52; }

/* ── FX / banner / floats ── */
.fx-canvas    { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 10; pointer-events: none; }
.damage-layer { position: absolute; inset: 0; z-index: 11; pointer-events: none; }
.action-banner {
  position: absolute; z-index: 14; left: 50%; top: 48%; transform: translate(-50%,-50%);
  padding: 12px 30px; color: #f3e5d0;
  background: linear-gradient(90deg, transparent, rgba(14,13,12,.92) 14%, rgba(14,13,12,.92) 86%, transparent);
  border-top: 1px solid rgba(201,167,105,.4); border-bottom: 1px solid rgba(201,167,105,.4);
  font: 700 14px/1 Arial, sans-serif; letter-spacing: .2em; opacity: 0;
}
.action-banner.show { animation: bannerReveal 1s ease both; }
@keyframes bannerReveal {
  0%       { opacity: 0; transform: translate(-50%,-50%) scale(.9); }
  20%, 70% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
  100%     { opacity: 0; transform: translate(-50%,-50%) scale(1.04); }
}
.float-number {
  position: absolute; transform: translate(-50%,-50%);
  font: 800 clamp(20px, 2vw, 38px)/1 Arial, sans-serif; color: #fff6ef;
  text-shadow: 0 2px 0 #541b23, 0 0 12px rgba(161,72,83,.7);
  animation: floatDamage 1.1s ease-out forwards;
}
.float-number.crit   { color: #ffe7a2; }
.float-number.heal   { color: #d9ffd4; }
.float-number.shield { color: #d5edff; }
.float-number.status { font-size: 14px; letter-spacing: .08em; }
@keyframes floatDamage {
  0%   { opacity: 0; transform: translate(-50%,-20%)  scale(.8); }
  18%  { opacity: 1; transform: translate(-50%,-50%)  scale(1.08); }
  100% { opacity: 0; transform: translate(-50%,-155%) scale(.94); }
}

/* ── Ribbon ── */
.battle-ribbon {
  position: absolute; z-index: 13; left: 12%; right: 12%; bottom: 10px; height: 52px;
  display: grid; grid-template-columns: 210px 1fr 44px; gap: 12px; align-items: center;
  padding: 6px 9px;
  background: linear-gradient(90deg, rgba(13,12,11,.96), rgba(39,33,29,.94), rgba(13,12,11,.96));
  border-top: 1px solid rgba(195,157,91,.45); border-bottom: 1px solid rgba(195,157,91,.35);
  box-shadow: 0 10px 20px rgba(0,0,0,.3);
}
.ribbon-controls { display: flex; gap: 5px; }
.ink-button {
  height: 36px; padding: 0 14px; color: #e6d4b7; background: rgba(32,27,24,.72);
  border: 1px solid rgba(190,151,87,.45); cursor: pointer; font: inherit; font-size: 12px;
}
.ink-button:hover { filter: brightness(1.2); }
.ink-button.is-on { color: #fff3e3; border-color: var(--red2); box-shadow: inset 0 0 12px rgba(157,63,70,.26); }
.ink-button--icon { min-width: 38px; padding: 0; }
.battle-log {
  text-align: center; color: #d8c5a7; font-style: italic; font-size: 12px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.battle-log span { color: var(--red2); margin-right: 7px; }

/* ══ Command layer ══ */
.command-layer {
  position: relative; display: grid;
  grid-template-columns: 260px minmax(760px, 1fr) 300px; gap: 20px;
  align-items: end; padding: 14px 18px 18px; overflow: hidden;
  background: linear-gradient(180deg, #080706 0%, #0b0908 100%);
}
.command-layer::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(circle at 50% 15%, rgba(196,152,82,.06), transparent 30%),
    linear-gradient(180deg, transparent, rgba(255,255,255,.02) 26%, transparent 88%);
}
.bottom-shell-art {
  position: absolute; left: 50%; bottom: 0; transform: translateX(-50%);
  width: min(97%, 1520px); pointer-events: none;
  filter: drop-shadow(0 10px 18px rgba(0,0,0,.25));
}
.artifact-panel, .ability-board { position: relative; z-index: 2; }
.artifact-panel { height: 288px; align-self: end; }
.artifact-base  { width: 100%; height: 100%; object-fit: contain; display: block; filter: drop-shadow(0 10px 24px rgba(0,0,0,.26)); }
.artifact-overlay { position: absolute; inset: 0; }
.commander-panel { justify-self: start; width: 236px; }
.target-panel    { justify-self: end;   width: 266px; }

.ability-board { min-height: 292px; align-self: end; padding: 6px 6px 8px; }
.ability-heading {
  position: relative; display: flex; justify-content: center; align-items: flex-start;
  text-align: center; color: #efe2c7; padding-top: 4px; min-height: 78px;
}
.ability-heading small { display: block; font-size: 9px; letter-spacing: .22em; color: #bda884; }
.ability-heading h1    { margin: 4px 0 0; font-size: 30px; font-weight: normal; color: #f3e6cd; }
.mandate-kanji         { margin-top: 4px; font-size: 28px; letter-spacing: .12em; color: #d5bb86; line-height: 1; }
.mode-stamp {
  position: absolute; right: 12px; top: 2px; width: 60px; height: 60px; border-radius: 50%;
  display: grid; place-items: center; background: #151211; color: #ebd8b8;
  border: 2px solid rgba(188,150,87,.72); font: 700 9px/1 Arial, sans-serif;
  letter-spacing: .12em; box-shadow: 0 6px 14px rgba(0,0,0,.3);
}

/* ── Skill plaques ── */
.skills-grid { display: flex; justify-content: center; align-items: flex-end; gap: 10px; }
.skill-plaque {
  position: relative; width: 190px; height: 264px; border: 0; background: transparent; padding: 0;
  cursor: pointer; color: #2d241f; overflow: visible; font-family: inherit;
  transition: transform .18s ease, filter .18s ease;
}
.skill-plaque[data-kind="attack"]   { transform: rotate(-1.8deg); }
.skill-plaque[data-kind="support"]  { transform: translateY(12px); }
.skill-plaque[data-kind="ultimate"] { transform: rotate(1.8deg); }
.skill-plaque:hover:not(:disabled)[data-kind="attack"]   { transform: rotate(-1.2deg) translateY(-6px) scale(1.015); }
.skill-plaque:hover:not(:disabled)[data-kind="support"]  { transform: translateY(6px) scale(1.015); }
.skill-plaque:hover:not(:disabled)[data-kind="ultimate"] { transform: rotate(1.2deg) translateY(-6px) scale(1.015); }
.skill-plaque:hover:not(:disabled) { filter: brightness(1.03); }
.skill-plaque:disabled { cursor: not-allowed; filter: saturate(.86) brightness(.82); }
.skill-plaque > img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain;
  filter: drop-shadow(0 18px 18px rgba(0,0,0,.35));
}
.skill-num {
  position: absolute; top: 28px; left: 50%; transform: translateX(-50%);
  width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
  font: 700 14px/1 Arial, sans-serif; color: #fff4e4; background: rgba(141,57,63,.95);
  border: 2px solid rgba(52,41,32,.82); box-shadow: 0 3px 8px rgba(0,0,0,.24);
}
.skill-plaque[data-kind="support"]  .skill-num { background: rgba(72,120,112,.95); }
.skill-plaque[data-kind="ultimate"] .skill-num { background: rgba(75,82,138,.95); }
.skill-name { position: absolute; top: 108px; left: 22px; right: 22px; text-align: center; }
.skill-name strong { display: block; font-size: 18px; line-height: 1.03; color: #32261f; }
.skill-name span   { display: block; margin-top: 5px; font-size: 8px; letter-spacing: .22em; color: #806a58; text-transform: uppercase; }
.skill-plaque p {
  position: absolute; left: 22px; right: 22px; top: 168px; margin: 0;
  text-align: center; font-size: 10px; line-height: 1.3; color: #5d4d43;
}
.skill-footer {
  position: absolute; left: 20px; right: 20px; bottom: 24px;
  display: flex; justify-content: space-between; align-items: center;
  font-size: 8px; color: #7f6b58;
}
.skill-ready {
  padding: 4px 9px; border-radius: 999px; font-weight: 700; letter-spacing: .08em;
  background: #ece3d4; border: 1px solid rgba(70,55,42,.14);
}
.skill-plaque[data-kind="attack"]   .skill-ready { background: #5f2b31; color: #f0d6d6; }
.skill-plaque[data-kind="support"]  .skill-ready { background: #2f4e49; color: #daebe5; }
.skill-plaque[data-kind="ultimate"] .skill-ready { background: #343667; color: #e2ddf7; }
.cooldown-mask { position: absolute; inset: 0; display: none; place-items: center; background: rgba(16,14,13,.54); }
.cooldown-mask > div {
  display: grid; justify-items: center; gap: 4px; padding: 16px 18px; border-radius: 18px;
  background: rgba(20,18,17,.65); box-shadow: 0 0 0 1px rgba(255,255,255,.06);
}
.cooldown-mask b    { display: block; font: 700 34px/1 Arial, sans-serif; color: #f3e4c5; }
.cooldown-mask span { font-size: 8px; letter-spacing: .18em; color: #ceb38b; }
.skill-plaque.on-cooldown .cooldown-mask { display: grid; }

/* ── Dossier overlays ── */
.artifact-small-title {
  position: absolute; top: 20px; left: 44px; right: 34px; text-align: center;
  font-size: 8px; letter-spacing: .22em; color: #806857;
}
.artifact-small-title--right { left: 72px; right: 52px; }
.overlay-portrait { position: absolute; overflow: hidden; background: rgba(0,0,0,.06); }
.overlay-portrait img { width: 100%; height: 100%; object-fit: cover; filter: sepia(.08); }
.commander-portrait { left: 26px; top: 48px; width: 62px; height: 78px; }
.target-portrait    { left: 22px; top: 58px; width: 54px; height: 68px; }
.overlay-name { position: absolute; color: #2f241d; }
.commander-name { left: 102px; right: 22px; top: 46px; }
.commander-name strong, .target-name strong { display: block; font-size: 14px; line-height: 1.06; }
.commander-name span,   .target-name span   { display: block; margin-top: 3px; font-size: 10px; color: #786254; }
.commander-name b {
  display: inline-block; margin-top: 6px; padding: 3px 6px;
  background: #1b1715; color: #efe0c7; font-size: 7px; letter-spacing: .12em;
}
.target-name { left: 92px; right: 18px; top: 52px; }
.target-name small { display: block; font-size: 8px; letter-spacing: .12em; color: #7e6a59; margin-bottom: 4px; }
.overlay-stats { position: absolute; display: grid; font-size: 8px; color: #6d594b; }
.commander-stats { left: 24px; right: 24px; top: 140px; grid-template-columns: 1fr 1fr; gap: 5px 8px; }
.commander-stats div, .target-stats div {
  display: flex; justify-content: space-between;
  border-bottom: 1px dotted rgba(87,69,53,.25); padding-bottom: 2px;
}
.commander-stats b, .target-stats b { font: 700 9px/1 Arial, sans-serif; color: #2b211c; }
.commander-effects { position: absolute; left: 20px; right: 20px; bottom: 30px; }
.commander-effects small { display: block; text-align: center; font-size: 8px; letter-spacing: .18em; color: #7f6a58; margin-bottom: 6px; }
.status-list, .status-row { display: flex; flex-wrap: wrap; gap: 4px; }
.status-list--panel { min-height: 26px; justify-content: center; }
.status-chip {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 26px; min-height: 20px; padding: 2px 6px;
  background: rgba(235,223,200,.92); border: 1px solid rgba(57,44,34,.16);
  font: 700 8px/1 Arial, sans-serif; border-radius: 2px;
}
.status-chip small   { font-size: 7px; margin-left: 3px; }
.status-chip.buff    { color: #315f56; background: rgba(217,231,224,.95); }
.status-chip.debuff  { color: #8d3641; background: rgba(240,220,216,.95); }
.status-chip.compact { min-width: 16px; min-height: 14px; padding: 1px 3px; font-size: 7px; }
.overlay-divider {
  position: absolute; left: 94px; right: 22px; text-align: center;
  font-size: 8px; letter-spacing: .18em; color: #a07e59;
}
.overlay-divider--buff   { top: 152px; }
.overlay-divider--debuff { top: 190px; }
.target-buffs, .target-debuffs { position: absolute; left: 96px; right: 24px; min-height: 20px; }
.target-buffs   { top: 166px; }
.target-debuffs { top: 204px; }
.target-stats   { left: 22px; right: 22px; top: 228px; grid-template-columns: 1fr; gap: 3px; }
.meter-block { position: absolute; left: 22px; right: 22px; bottom: 40px; }
.meter-block > div:first-child {
  display: flex; justify-content: space-between;
  font: 700 8px/1 Arial, sans-serif; letter-spacing: .12em; color: #755f50;
}
.turn-meter { height: 6px; margin-top: 5px; background: rgba(31,26,22,.12); border-bottom: 1px solid rgba(31,26,22,.42); }
.turn-meter span { display: block; height: 100%; background: linear-gradient(90deg, var(--red), var(--red2)); transition: width .35s; }

/* ══ Modals ══ */
.modal-layer {
  position: fixed; z-index: 100; inset: 0; display: grid; place-items: center; padding: 24px;
  background: radial-gradient(circle at 50% 45%, rgba(55,43,35,.2), rgba(10,9,8,.88) 68%);
  opacity: 0; visibility: hidden; transition: .3s;
}
.modal-layer.visible { opacity: 1; visibility: visible; }
.start-card, .result-card {
  position: relative; width: min(720px, 94vw); padding: 34px; text-align: center;
  background: linear-gradient(180deg, #eee4d2, #d9c5a4);
  border: 1px solid rgba(31,25,21,.72); box-shadow: 0 20px 60px rgba(0,0,0,.48);
}
.start-card::before,  .result-card::before,
.start-card::after,   .result-card::after {
  content: ''; position: absolute; left: 18px; right: 18px; height: 12px;
  background: linear-gradient(90deg, transparent, #181513 20%, #181513 80%, transparent);
}
.start-card::before, .result-card::before { top: -6px; }
.start-card::after,  .result-card::after  { bottom: -6px; }
.eyebrow { font-size: 10px; letter-spacing: .2em; color: #735e4c; }
.start-card h2, .result-card h2 { margin: 9px 0; font-size: 40px; font-weight: normal; }
.start-card p,  .result-card p  { max-width: 580px; margin: 0 auto 16px; color: #665548; line-height: 1.5; }
.duel-preview { display: grid; grid-template-columns: 1fr 50px 1fr; align-items: center; gap: 10px; margin: 18px 0; }
.duel-preview > div { display: grid; justify-items: center; }
.duel-preview img    { width: 100px; height: 115px; object-fit: contain; }
.duel-preview strong { font-size: 15px; }
.duel-preview span   { font-size: 11px; color: #765f51; }
.duel-preview b      { color: var(--red); font-size: 18px; }
.primary-button {
  min-width: 220px; padding: 12px 22px; color: #f1e2c9; background: #1b1714;
  border: 1px solid #b28c52; letter-spacing: .13em; cursor: pointer; font: inherit; font-size: 13px;
}
.primary-button:hover { filter: brightness(1.18); }
.ghost-button {
  display: block; margin: 10px auto 0; padding: 8px 18px; background: none;
  border: 1px solid rgba(31,25,21,.28); color: #6b5648; letter-spacing: .12em;
  cursor: pointer; font: inherit; font-size: 11px;
}
.ghost-button:hover { border-color: rgba(31,25,21,.5); color: #3f3229; }
.start-card > small { display: block; margin-top: 10px; color: #756354; font-size: 10px; }
.result-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 18px 0; }
.result-stats div { padding: 12px; background: rgba(255,255,255,.25); border: 1px solid rgba(61,47,37,.18); }
.result-stats b    { display: block; font: 700 18px/1 Arial, sans-serif; }
.result-stats span { font-size: 8px; letter-spacing: .12em; }

/* ══ Screen shake / eclipse ══ */
.yb-shell.shake-light .battlefield { animation: shakeLight .28s linear; }
.yb-shell.shake-heavy .battlefield { animation: shakeHeavy .42s linear; }
.yb-shell.eclipse .battlefield::after {
  content: ''; position: absolute; inset: 0; z-index: 4;
  background: radial-gradient(circle at 70% 42%, transparent 0 12%, rgba(66,56,102,.18) 26%, rgba(20,17,21,.6) 68%);
  animation: eclipseDark 1.35s ease both;
}
@keyframes shakeLight {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(-4px, 1px); }
  50% { transform: translate(3px, -2px); }
  75% { transform: translate(-2px, 1px); }
}
@keyframes shakeHeavy {
  0%, 100% { transform: translate(0); }
  15% { transform: translate(-7px, 2px); }
  30% { transform: translate(6px, -3px); }
  45% { transform: translate(-5px, 4px); }
  60% { transform: translate(4px, -2px); }
  75% { transform: translate(-3px, 2px); }
}
@keyframes eclipseDark {
  0%       { opacity: 0; }
  22%, 72% { opacity: 1; }
  100%     { opacity: 0; }
}

/* ══ Responsive ══ */
@media (max-width: 1500px) {
  .command-layer { grid-template-columns: 228px minmax(640px, 1fr) 255px; gap: 12px; }
  .artifact-panel { height: 274px; }
  .commander-panel { width: 225px; }
  .target-panel { width: 255px; }
  .skill-plaque { width: 176px; height: 244px; }
  .skill-name { top: 100px; }
  .skill-plaque p { top: 156px; }
  .ability-heading h1 { font-size: 28px; }
  .formation { width: 190px; }
  .active-stage--ally  { left: 15%; }
  .active-stage--enemy { right: 15%; }
}
@media (max-height: 860px) {
  .yb-shell { grid-template-rows: minmax(0, 60fr) minmax(320px, 40fr); }
  .command-layer { padding-top: 12px; }
  .artifact-panel { height: 280px; }
  .skill-plaque { width: 176px; height: 244px; }
  .skill-name { top: 98px; }
  .skill-plaque p { top: 152px; }
  .ability-board { min-height: 286px; }
  .active-stage { top: 110px; bottom: 68px; }
  .formation { top: 92px; bottom: 68px; gap: 7px; }
  .battle-ribbon { bottom: 7px; }
}
</style>
