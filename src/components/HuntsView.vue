<template>
  <div class="hunts-wrap">

    <div class="hunts-bg" :style="{ backgroundImage: `url(${huntBg})` }" />
    <div class="hunts-overlay" />

    <!-- ── Left: Mission list ───────────────────────────────────── -->
    <aside class="mission-panel">
      <div class="mp-label">Hunt Missions</div>

      <div class="mission-group">
        <div class="mg-head">🏹 Hunt</div>
        <button
          v-for="m in HUNT_MISSIONS"
          :key="m.id"
          class="mission-btn"
          :class="{ active: selectedId === m.id }"
          :style="{ '--mc': m.color }"
          @click="selectedId = m.id"
        >
          <span class="mb-dot" />
          <span class="mb-info">
            <span class="mb-name">{{ m.name }}</span>
            <span class="mb-biome">{{ m.biome }}</span>
          </span>
          <span class="mb-dur">{{ formatTime(m.duration * 1000) }}</span>
        </button>
      </div>

      <div class="mission-group">
        <div class="mg-head">🪵 Lumber</div>
        <button
          v-for="m in LUMBER_MISSIONS"
          :key="m.id"
          class="mission-btn"
          :class="{ active: selectedId === m.id }"
          :style="{ '--mc': m.color }"
          @click="selectedId = m.id"
        >
          <span class="mb-dot" />
          <span class="mb-info">
            <span class="mb-name">{{ m.name }}</span>
            <span class="mb-biome">{{ m.biome }}</span>
          </span>
          <span class="mb-dur">{{ formatTime(m.duration * 1000) }}</span>
        </button>
      </div>

      <div class="mission-group">
        <div class="mg-head">🌿 Forage</div>
        <button
          v-for="m in FORAGE_MISSIONS"
          :key="m.id"
          class="mission-btn"
          :class="{ active: selectedId === m.id }"
          :style="{ '--mc': m.color }"
          @click="selectedId = m.id"
        >
          <span class="mb-dot" />
          <span class="mb-info">
            <span class="mb-name">{{ m.name }}</span>
            <span class="mb-biome">{{ m.biome }}</span>
          </span>
          <span class="mb-dur">{{ formatTime(m.duration * 1000) }}</span>
        </button>
      </div>
    </aside>

    <!-- ── Center: Mission detail + dispatch ───────────────────── -->
    <main class="dispatch-area">

      <div class="da-idle" v-if="!selected">
        <span class="da-idle-icon">🏹</span>
        <span class="da-idle-text">Select a mission to dispatch</span>
      </div>

      <template v-if="selected">
        <div class="da-header" :style="{ '--mc': selected.color }">
          <div class="da-glow" />
          <div class="da-type-chip">{{ selected.type === 'hunt' ? '🏹 Hunt' : '🌿 Forage' }}</div>
          <div class="da-name">{{ selected.name }}</div>
          <div class="da-biome">{{ selected.biome }}</div>
          <div class="da-desc">{{ selected.desc }}</div>
        </div>

        <div class="da-meta">
          <div class="da-meta-row">
            <span class="da-meta-label">Duration</span>
            <span class="da-meta-val">{{ formatTime(selected.duration * 1000) }}</span>
          </div>
          <div class="da-meta-row">
            <span class="da-meta-label">Slots free</span>
            <span class="da-meta-val" :class="{ none: hunts.firstFreeSlot === -1 }">
              {{ hunts.slots.filter(s => s === null).length }} / {{ hunts.MAX_SLOTS }}
            </span>
          </div>
        </div>

        <div class="da-drops">
          <div class="da-drops-label">Expected drops</div>
          <div class="drop-row" v-for="drop in selected.drops" :key="drop.id" :style="{ '--dc': matColor(drop) }">
            <span class="drop-dot" />
            <span class="drop-name">{{ matName(drop) }}</span>
            <span class="drop-qty">{{ drop.min }}–{{ drop.max }}</span>
            <span class="drop-chance" v-if="drop.chance != null">{{ Math.round(drop.chance * 100) }}%</span>
            <span class="drop-chance guaranteed" v-else>always</span>
          </div>
          <div class="drop-row bonus-row" :style="{ '--dc': matColor(selected.artisanBonus) }">
            <span class="drop-dot" />
            <span class="drop-name">{{ matName(selected.artisanBonus) }}</span>
            <span class="drop-qty">+{{ selected.artisanBonus.min }}–{{ selected.artisanBonus.max }}</span>
            <span class="drop-bonus-tag">{{ selected.artisanBonus.skill }} skill</span>
          </div>
        </div>

        <!-- Hero selector -->
        <div class="da-hero-section">
          <div class="da-drops-label">Assign hero <span class="optional-tag">(optional)</span></div>
          <div class="hero-picker-row">
            <button
              class="hero-pick-btn"
              :class="{ selected: pickedHeroKey === null }"
              @click="pickedHeroKey = null"
            >
              <span class="hp-name">No hero</span>
              <span class="hp-sub">Base drops only</span>
            </button>
            <button
              v-for="{ key, hero } in eligibleHeroes"
              :key="key"
              class="hero-pick-btn"
              :class="{
                selected: pickedHeroKey === key,
                busy: hunts.heroInSlot(key) !== -1,
              }"
              :style="{ '--rc': rarityColor(hero.rarity) }"
              @click="pickedHeroKey = hunts.heroInSlot(key) !== -1 ? pickedHeroKey : key"
            >
              <span class="hp-name" :style="{ color: rarityColor(hero.rarity) }">{{ hero.name }}</span>
              <span class="hp-sub">
                <template v-if="hunts.heroInSlot(key) !== -1">on mission</template>
                <template v-else-if="heroHasBonus(key)">✦ bonus drops</template>
                <template v-else>no bonus</template>
              </span>
            </button>
          </div>
        </div>

        <div class="da-actions">
          <button
            class="dispatch-btn"
            :class="{ ready: hunts.firstFreeSlot !== -1 }"
            :disabled="hunts.firstFreeSlot === -1"
            @click="dispatch"
          >
            {{ hunts.firstFreeSlot === -1 ? 'All slots busy' : 'Dispatch' }}
          </button>
        </div>
      </template>

    </main>

    <!-- ── Right: Active slots ──────────────────────────────────── -->
    <aside class="slots-panel">
      <div class="sp-label">Active Missions</div>

      <div class="slot-card" v-for="(slot, i) in hunts.slots" :key="i" :class="{ empty: !slot, complete: slot && hunts.isComplete(i) }">

        <template v-if="!slot">
          <div class="slot-empty">
            <span class="slot-num">{{ i + 1 }}</span>
            <span class="slot-empty-text">Empty slot</span>
          </div>
        </template>

        <template v-else>
          <div class="slot-header" :style="{ '--mc': missionColor(slot.missionId) }">
            <span class="slot-type-icon">{{ slotTypeIcon(slot.missionId) }}</span>
            <div class="slot-info">
              <span class="slot-name">{{ HUNTS_BY_ID[slot.missionId]?.name }}</span>
              <span class="slot-hero" v-if="slot.heroKey">{{ heroName(slot.heroKey) }}</span>
              <span class="slot-hero solo" v-else>Solo</span>
            </div>
            <button class="slot-cancel" @click="hunts.cancelHunt(i)" title="Cancel mission">×</button>
          </div>

          <div class="slot-progress-row">
            <div class="slot-track">
              <div class="slot-fill" :style="{ width: (slotProgress[i] * 100) + '%', background: missionColor(slot.missionId) }" />
            </div>
            <span class="slot-eta" v-if="!hunts.isComplete(i)">{{ formatTime(slotEta[i]) }}</span>
            <span class="slot-eta looping" v-else>↺ collecting…</span>
          </div>
        </template>

      </div>

      <!-- Collect result toast -->
      <Transition name="collect-pop">
        <div class="collect-toast" v-if="collectResult">
          <div class="ct-title">{{ collectResult.mission }}</div>
          <div class="ct-drops">
            <span
              v-for="drop in collectResult.drops"
              :key="drop.id + drop.materialType"
              class="ct-drop"
              :style="{ '--dc': matColorById(drop.materialType, drop.id) }"
            >
              <span class="ct-dot" />
              <span class="ct-name">{{ matNameById(drop.materialType, drop.id) }}</span>
              <span class="ct-amt">+{{ drop.amount }}</span>
              <span class="ct-bonus-star" v-if="drop.bonus">✦</span>
            </span>
          </div>
        </div>
      </Transition>
    </aside>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import huntBg from '../assets/backgrounds/hunting_ground_bg.png'
import { useHuntStore }       from '../stores/useHuntStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { HUNTS_BY_ID, HUNT_MISSIONS, FORAGE_MISSIONS, LUMBER_MISSIONS } from '../game/data/hunts.js'
import { HIDES } from '../game/data/hides.js'
import { FIBERS } from '../game/data/fibers.js'
import { WOODS } from '../game/data/woods.js'
import { useArtisanStore } from '../stores/useArtisanStore.js'

const hunts      = useHuntStore()
const collection = useCollectionStore()
const artisan    = useArtisanStore()

const selectedId    = ref(null)
const pickedHeroKey = ref(null)
const collectResult = ref(null)
let _toastTimer = null

// Live progress — refresh every second
const tick = ref(0)
let _interval = null
onMounted(() => { _interval = setInterval(() => tick.value++, 1000) })
onUnmounted(() => clearInterval(_interval))

const selected = computed(() => HUNTS_BY_ID[selectedId.value] ?? null)

const slotProgress = computed(() => {
  void tick.value
  return hunts.slots.map((_, i) => hunts.progress(i))
})

const slotEta = computed(() => {
  void tick.value
  return hunts.slots.map((_, i) => hunts.eta(i))
})

// Heroes available to assign
const eligibleHeroes = computed(() => collection.roster)

function heroHasBonus(heroKey) {
  if (!selected.value) return false
  const skill = selected.value.artisanBonus.skill
  return artisan.getSkillLevel(heroKey, skill) >= 1
}

const RARITY_COLORS = {
  Common: '#9a9a9a', Uncommon: '#4dcc4d', Rare: '#4d9fff',
  Epic: '#cc66ff', Legendary: '#ff9900', Mythical: '#ff4466', Ancient: '#ffdd44',
}
function rarityColor(rarity) { return RARITY_COLORS[rarity] ?? '#9a9a9a' }

function missionColor(missionId) { return HUNTS_BY_ID[missionId]?.color ?? '#888' }
function slotTypeIcon(missionId) {
  const t = HUNTS_BY_ID[missionId]?.type
  return t === 'hunt' ? '🏹' : t === 'lumber' ? '🪵' : '🌿'
}

function heroName(key) {
  return collection.roster.find(r => r.key === key)?.hero?.name ?? key
}

// Material helpers
function logColor(id) { return WOODS[id]?.color ?? '#888' }
function logName(id)  { return WOODS[id]?.name ?? id }

function matColor(drop) {
  if (drop.materialType === 'log') return logColor(drop.id)
  if (!drop) return '#888'
  return drop.materialType === 'hide'
    ? (HIDES[drop.id]?.color ?? '#888')
    : (FIBERS[drop.id]?.color ?? '#888')
}
function matColorById(type, id) {
  if (type === 'log')  return logColor(id)
  return type === 'hide' ? (HIDES[id]?.color ?? '#888') : (FIBERS[id]?.color ?? '#888')
}
function matName(drop) {
  if (!drop) return ''
  if (drop.materialType === 'log') return logName(drop.id)
  return drop.materialType === 'hide'
    ? (HIDES[drop.id]?.name ?? drop.id)
    : (FIBERS[drop.id]?.name ?? drop.id)
}
function matNameById(type, id) {
  if (type === 'log')  return logName(id)
  return type === 'hide' ? (HIDES[id]?.name ?? id) : (FIBERS[id]?.name ?? id)
}

function formatTime(ms) {
  const s = Math.ceil(ms / 1000)
  if (s <= 0) return '0s'
  if (s < 60)  return `${s}s`
  const m = Math.floor(s / 60), r = s % 60
  if (m < 60)  return r > 0 ? `${m}m ${r}s` : `${m}m`
  const h = Math.floor(m / 60), rm = m % 60
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`
}

function dispatch() {
  if (!selected.value || hunts.firstFreeSlot === -1) return
  hunts.startHunt(selected.value.id, pickedHeroKey.value)
  pickedHeroKey.value = null
}

function collect(i) {
  const slot = hunts.slots[i]
  if (!slot) return
  const missionName = HUNTS_BY_ID[slot.missionId]?.name ?? 'Mission'
  const drops = hunts.collectHunt(i)
  if (drops) showToast(missionName, drops)
}

function showToast(missionName, drops) {
  collectResult.value = { mission: missionName, drops }
  clearTimeout(_toastTimer)
  _toastTimer = setTimeout(() => { collectResult.value = null }, 4000)
}

// Show toast when the store auto-collects a completed loop
watch(() => hunts.lastAutoCollect, (val) => {
  if (val) showToast(val.missionName, val.drops)
})
</script>

<style scoped>
.hunts-wrap {
  position: relative;
  display: flex; height: 100%; min-height: calc(100vh - 130px); overflow: hidden;
}

.hunts-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center;
  opacity: 0.45; pointer-events: none; z-index: 0;
}
.hunts-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right,
    rgba(3,2,1,0.92) 0%,
    rgba(3,2,1,0.55) 18%,
    rgba(3,2,1,0.30) 50%,
    rgba(3,2,1,0.55) 82%,
    rgba(3,2,1,0.92) 100%
  );
  pointer-events: none; z-index: 1;
}

/* ── Left: Mission list ─────────────────────────────────────────── */
.mission-panel {
  position: relative; z-index: 2;
  width: 220px; flex-shrink: 0;
  border-right: 1px solid var(--border-brown);
  background: var(--bg-panel); padding: 16px 12px; overflow-y: auto;
  display: flex; flex-direction: column; gap: 12px;
}
.mp-label {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 2.5px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 10px; border-bottom: 1px solid var(--border-brown);
}
.mission-group { display: flex; flex-direction: column; gap: 2px; }
.mg-head {
  font-family: var(--font-head); font-size: 0.56rem; text-transform: uppercase;
  letter-spacing: 2px; color: var(--text-dim); font-weight: 700;
  padding: 6px 4px 5px; border-bottom: 1px solid rgba(255,255,255,0.04); margin-bottom: 4px;
}
.mission-btn {
  width: 100%; display: flex; align-items: center; gap: 8px;
  padding: 8px 8px; background: transparent; border: 1px solid transparent;
  border-radius: 6px; cursor: pointer; text-align: left; transition: all 0.12s;
}
.mission-btn:hover { background: rgba(255,255,255,0.04); border-color: color-mix(in srgb, var(--mc) 25%, transparent); }
.mission-btn.active { background: color-mix(in srgb, var(--mc) 12%, rgba(0,0,0,0.4)); border-color: color-mix(in srgb, var(--mc) 50%, transparent); }
.mb-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mc); box-shadow: 0 0 5px var(--mc); flex-shrink: 0; }
.mb-info { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.mb-name { font-size: 0.68rem; font-weight: 600; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mb-biome { font-size: 0.56rem; color: var(--text-dim); font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mb-dur { font-family: var(--font-head); font-size: 0.6rem; color: var(--mc); font-weight: 700; flex-shrink: 0; }

/* ── Center: Dispatch area ──────────────────────────────────────── */
.dispatch-area {
  position: relative; z-index: 2;
  flex: 1; padding: 24px 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px;
}
.da-idle { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; flex: 1; opacity: 0.3; }
.da-idle-icon { font-size: 2.5rem; }
.da-idle-text { font-size: 0.8rem; color: var(--text-muted); font-style: italic; }
.da-header {
  position: relative; padding: 20px 22px; border-radius: 10px; overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--mc) 30%, transparent);
  background: color-mix(in srgb, var(--mc) 8%, rgba(6,3,1,0.90));
}
.da-glow {
  position: absolute; top: 0; left: 0; right: 0; height: 80px;
  background: radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--mc) 20%, transparent) 0%, transparent 70%);
  pointer-events: none;
}
.da-type-chip { font-family: var(--font-head); font-size: 0.55rem; text-transform: uppercase; letter-spacing: 2px; color: var(--mc); font-weight: 700; margin-bottom: 6px; }
.da-name { font-family: var(--font-head); font-size: 1.15rem; font-weight: 800; color: #fff; letter-spacing: 2px; margin-bottom: 4px; }
.da-biome { font-size: 0.66rem; color: var(--mc); font-style: italic; margin-bottom: 10px; }
.da-desc { font-size: 0.72rem; color: var(--text-muted); line-height: 1.6; }
.da-meta { display: flex; gap: 20px; }
.da-meta-row { display: flex; flex-direction: column; gap: 3px; }
.da-meta-label { font-family: var(--font-head); font-size: 0.54rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-dim); font-weight: 700; }
.da-meta-val { font-family: var(--font-head); font-size: 0.88rem; font-weight: 800; color: var(--gold); }
.da-meta-val.none { color: #cc4444; }
.da-drops { display: flex; flex-direction: column; gap: 6px; }
.da-drops-label { font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); font-weight: 700; margin-bottom: 2px; }
.drop-row {
  display: flex; align-items: center; gap: 9px; padding: 7px 12px; border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--dc) 22%, transparent);
  background: color-mix(in srgb, var(--dc) 6%, rgba(0,0,0,0.3));
}
.bonus-row { border-style: dashed; opacity: 0.75; }
.drop-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--dc); box-shadow: 0 0 5px var(--dc); flex-shrink: 0; }
.drop-name { flex: 1; font-size: 0.7rem; font-weight: 600; color: var(--text-parchment); }
.drop-qty { font-family: var(--font-head); font-size: 0.72rem; font-weight: 700; color: var(--dc); }
.drop-chance { font-size: 0.6rem; color: var(--text-dim); font-family: var(--font-head); }
.drop-chance.guaranteed { color: #4dff88; }
.drop-bonus-tag { font-size: 0.58rem; font-family: var(--font-head); font-weight: 700; color: #c8906e; background: rgba(200,144,110,0.12); border: 1px solid rgba(200,144,110,0.25); border-radius: 8px; padding: 1px 7px; }
.optional-tag { font-family: sans-serif; font-size: 0.6rem; color: var(--text-dim); font-weight: 400; letter-spacing: 0; text-transform: none; }
.da-hero-section { display: flex; flex-direction: column; gap: 8px; }
.hero-picker-row { display: flex; flex-wrap: wrap; gap: 7px; }
.hero-pick-btn {
  display: flex; flex-direction: column; gap: 2px; padding: 8px 12px;
  border-radius: 7px; border: 1px solid var(--border-brown);
  background: rgba(255,255,255,0.03); cursor: pointer; transition: all 0.12s;
  text-align: left; min-width: 110px;
}
.hero-pick-btn:hover:not(.busy) { border-color: var(--border-gold); background: rgba(255,255,255,0.06); }
.hero-pick-btn.selected { border-color: var(--gold-dim); background: rgba(201,162,39,0.08); }
.hero-pick-btn.busy { opacity: 0.35; cursor: not-allowed; }
.hp-name { font-size: 0.7rem; font-weight: 700; color: var(--text-parchment); }
.hp-sub { font-size: 0.58rem; color: var(--text-dim); }
.da-actions { display: flex; }
.dispatch-btn {
  padding: 12px 48px; border-radius: 8px; border: 1px solid var(--border-brown);
  background: var(--bg-panel); color: var(--text-dim);
  font-family: var(--font-head); font-size: 0.88rem; font-weight: 800;
  letter-spacing: 3px; text-transform: uppercase; cursor: not-allowed; transition: all 0.2s;
}
.dispatch-btn.ready {
  border-color: #7a4a10; background: linear-gradient(135deg, #3a2208, #200e04);
  color: #d4a060; cursor: pointer; box-shadow: 0 0 20px rgba(180,100,30,0.25);
}
.dispatch-btn.ready:hover {
  background: linear-gradient(135deg, #5a3210, #2a1408);
  border-color: #d4a060; box-shadow: 0 0 32px rgba(200,120,40,0.40);
}

/* ── Right: Slots ───────────────────────────────────────────────── */
.slots-panel {
  width: 230px; flex-shrink: 0; position: relative; z-index: 2;
  border-left: 1px solid var(--border-brown);
  background: var(--bg-panel); padding: 16px 14px;
  overflow-y: auto; display: flex; flex-direction: column; gap: 10px;
}
.sp-label {
  font-family: var(--font-head); font-size: 0.58rem; text-transform: uppercase;
  letter-spacing: 2.5px; color: var(--text-muted); font-weight: 700;
  padding-bottom: 10px; border-bottom: 1px solid var(--border-brown);
}
.slot-card {
  border-radius: 8px; border: 1px solid var(--border-brown);
  background: rgba(255,255,255,0.02); overflow: hidden; transition: border-color 0.2s;
}
.slot-card.complete { border-color: #4dff88; box-shadow: 0 0 12px rgba(77,255,136,0.18); }
.slot-empty {
  display: flex; align-items: center; gap: 10px; padding: 14px 12px; opacity: 0.25;
}
.slot-num { font-family: var(--font-head); font-size: 0.78rem; font-weight: 800; color: var(--text-dim); }
.slot-empty-text { font-size: 0.65rem; color: var(--text-dim); font-style: italic; }
.slot-header {
  display: flex; align-items: center; gap: 8px; padding: 10px 12px;
  background: color-mix(in srgb, var(--mc) 10%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--mc) 20%, transparent);
}
.slot-type-icon { font-size: 1rem; flex-shrink: 0; }
.slot-info { flex: 1; display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.slot-name { font-size: 0.68rem; font-weight: 700; color: var(--text-parchment); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.slot-hero { font-size: 0.58rem; color: var(--mc); font-style: italic; }
.slot-hero.solo { color: var(--text-dim); }
.slot-cancel {
  width: 20px; height: 20px; border-radius: 50%; border: 1px solid rgba(180,60,60,0.4);
  background: rgba(90,20,20,0.3); color: #c08080; font-size: 0.7rem; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: all 0.15s;
}
.slot-cancel:hover { border-color: #cc4444; background: rgba(120,20,20,0.5); color: #ffaaaa; }
.slot-progress-row { display: flex; align-items: center; gap: 8px; padding: 10px 12px; }
.slot-track { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 3px; overflow: hidden; }
.slot-fill { height: 100%; border-radius: 3px; transition: width 0.9s linear; }
.slot-eta { font-family: var(--font-head); font-size: 0.62rem; color: var(--text-muted); flex-shrink: 0; min-width: 42px; text-align: right; }
.slot-eta.looping { color: #4dcc88; animation: loop-pulse 1.4s ease-in-out infinite; }
@keyframes loop-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.slot-complete-msg { padding: 8px 12px 4px; font-size: 0.7rem; font-weight: 700; color: #4dff88; font-family: var(--font-head); text-align: center; }
.collect-btn {
  display: block; width: calc(100% - 24px); margin: 0 12px 12px;
  padding: 8px; border-radius: 6px; border: 1px solid #2a6a3a;
  background: rgba(10,40,20,0.8); color: #4dff88; font-family: var(--font-head);
  font-size: 0.72rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
  cursor: pointer; transition: all 0.15s;
}
.collect-btn:hover { background: rgba(20,80,40,0.9); border-color: #4dff88; box-shadow: 0 0 12px rgba(77,255,136,0.3); }

/* Collect toast */
.collect-toast {
  padding: 12px 14px; border-radius: 8px; border: 1px solid #2a5a3a;
  background: rgba(8,24,14,0.95); display: flex; flex-direction: column; gap: 8px;
}
.ct-title { font-family: var(--font-head); font-size: 0.65rem; font-weight: 700; color: #4dff88; text-transform: uppercase; letter-spacing: 1.5px; }
.ct-drops { display: flex; flex-direction: column; gap: 4px; }
.ct-drop { display: flex; align-items: center; gap: 7px; }
.ct-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--dc); box-shadow: 0 0 4px var(--dc); flex-shrink: 0; }
.ct-name { flex: 1; font-size: 0.66rem; color: var(--text-parchment); }
.ct-amt { font-family: var(--font-head); font-size: 0.72rem; font-weight: 800; color: var(--dc); }
.ct-bonus-star { font-size: 0.6rem; color: #c8906e; }
.collect-pop-enter-active { animation: pop-in 0.25s ease-out; }
.collect-pop-leave-active { transition: opacity 0.4s; }
.collect-pop-leave-to { opacity: 0; }
@keyframes pop-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
</style>
