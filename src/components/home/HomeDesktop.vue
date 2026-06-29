<template>
  <div class="training-scene">

    <!-- Tab bar -->
    <div class="tg-tab-bar">
      <div class="tg-tabs">
        <button class="tg-tab" :class="{ 'tg-tab--active': activeHomeTab === 'training' }" @click="activeHomeTab = 'training'">⚔ Training Grounds</button>
        <button class="tg-tab" :class="{ 'tg-tab--active': activeHomeTab === 'artisan' }" @click="activeHomeTab = 'artisan'">⚒ Artisan Zone</button>
        <button class="tg-tab" :class="{ 'tg-tab--active': activeHomeTab === 'hunts' }" @click="activeHomeTab = 'hunts'">🌿 Gathering Zone</button>
      </div>
      <div class="tg-team" v-if="activeHomeTab === 'training'">
        <span v-if="collection.team.length === 0" class="no-team">No team set — visit Collection</span>
        <template v-else>
          <div class="team-hero-chip" v-for="key in collection.team" :key="key">
            <span class="chip-dot" :class="teamEntry(key)?.hero.rarity.toLowerCase()">●</span>
            <span class="chip-name">{{ teamEntry(key)?.hero.name }}</span>
          </div>
          <span class="team-cp">⚡ {{ formatCP(teamCP) }}</span>
        </template>
        <span class="team-gold-rate">🪙 +{{ camp.goldPerMin }}/min</span>
        <span class="idle-strip-indicator" v-if="idle.isRunning">
          <span class="idle-running-dot" />⏱ {{ idle.session.encounterName }}
        </span>
      </div>
    </div>

    <template v-if="activeHomeTab === 'training'">

    <div class="map-bg" :style="{ backgroundImage: `url(${trainingBg})` }" />

    <!-- Left sidebar — encounter list -->
    <div class="tg-sidebar">
      <div class="sidebar-section" v-for="diff in difficultyGroups" :key="diff.label">
        <div class="sidebar-diff-label" :class="diff.cls">{{ diff.label }}</div>
        <button
          v-for="enc in diff.encounters"
          :key="enc.id"
          class="sidebar-enc-btn"
          :class="[enc.difficulty.toLowerCase(), {
            active:    selectedIndex === enc.index,
            completed: campaign.isCompleted(enc.id),
            idling:    idle.session?.encounterId === enc.id,
          }]"
          @click="selectZone(enc.index)"
        >
          <span class="sidebar-enc-indicator" :class="enc.difficulty.toLowerCase()" />
          <span class="sidebar-enc-name">{{ enc.name }}</span>
          <span class="sidebar-enc-check" v-if="campaign.isCompleted(enc.id)">✓</span>
          <span class="sidebar-idle-dot" v-if="idle.session?.encounterId === enc.id" />
        </button>
      </div>
    </div>

    <!-- Zone hotspots on the map -->
    <button
      v-for="(enc, i) in ENCOUNTERS"
      :key="enc.id"
      class="zone-btn"
      :class="[enc.difficulty.toLowerCase(), { active: selectedIndex === i, completed: campaign.isCompleted(enc.id), idling: idle.session?.encounterId === enc.id }]"
      :style="ZONE_POSITIONS[i]"
      @click="selectZone(i)"
    >
      <span class="zone-pulse" />
      <span class="zone-dot">
        <span v-if="campaign.isCompleted(enc.id)">✓</span>
      </span>
      <span class="zone-label">{{ enc.name }}</span>
    </button>

    <!-- Center detail card -->
    <Transition name="fade-up">
      <div class="detail-card" v-if="selectedEnc !== null">

        <button class="detail-close" @click="selectedIndex = null">✕</button>

        <div class="detail-header">
          <div class="detail-name">{{ selectedEnc.name }}</div>
          <div class="detail-badges">
            <span class="diff-badge" :class="selectedEnc.difficulty.toLowerCase()">{{ selectedEnc.difficulty }}</span>
            <span class="done-badge" v-if="campaign.isCompleted(selectedEnc.id)">Completed</span>
          </div>
        </div>

        <div class="detail-body">
          <div class="detail-section">
            <div class="section-label">Enemies</div>
            <div class="enemy-row">
              <span v-for="(ef, j) in selectedEnc.enemies" :key="j" class="enemy-chip">{{ ef().name }}</span>
            </div>
          </div>

          <div class="detail-section" v-if="collection.team.length > 0">
            <div class="section-label">Combat Power</div>
            <div class="cp-row">
              <span class="cp-yours">⚡ {{ formatCP(teamCP) }}</span>
              <span class="cp-sep">vs</span>
              <span class="cp-enemy">{{ formatCP(encounterCP(selectedEnc)) }}</span>
              <span class="cp-verdict" :class="cpVerdict(selectedEnc).cls">{{ cpVerdict(selectedEnc).label }}</span>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-label">Rewards</div>
            <div class="rewards-row">
              <span class="reward gold" v-if="selectedEnc.rewards.gold > 0">🪙 {{ selectedEnc.rewards.gold.toLocaleString() }}</span>
              <span class="reward ore"  v-if="selectedEnc.isTraining">⛏ Ore drops</span>
              <span class="reward diamonds" v-if="selectedEnc.rewards.diamonds > 0">💎 {{ selectedEnc.rewards.diamonds }}</span>
              <span class="reward xp">✦ XP</span>
            </div>
          </div>
        </div>

        <button
          class="battle-btn"
          :disabled="!canBattle"
          :title="battleHint"
          @click="startBattle"
        >
          ⚔ Battle
        </button>
        <div class="battle-hint-text" v-if="!canBattle">{{ battleHint }}</div>

        <!-- Idle training — active on this zone -->
        <div class="idle-status" v-if="isActiveIdleZone">
          <div class="idle-status-header">
            <span class="idle-running-dot" />
            <span class="idle-status-label">Idle Training</span>
            <span class="idle-elapsed">{{ formatElapsed(idle.realElapsedMs) }}</span>
            <span class="idle-cap-badge" v-if="idle.isCapped">FULL</span>
          </div>

          <!-- Cap progress bar -->
          <div class="idle-cap-row">
            <div class="idle-cap-track">
              <div class="idle-cap-fill" :style="{ width: (idle.capProgress * 100) + '%' }" />
            </div>
            <span class="idle-cap-label">
              {{ idle.isCapped ? `${idle.CAP_HOURS}h cap reached` : formatElapsed((idle.CAP_HOURS * 3_600_000) - idle.elapsedMs) + ' left' }}
            </span>
          </div>

          <!-- Accumulated resources -->
          <div class="idle-resources">

            <!-- XP -->
            <div class="idle-res-chip xp">
              <div class="chip-main">✦ {{ idle.accumulatedXp.toLocaleString() }} XP</div>
              <div class="chip-rate">+{{ idle.xpHourlyRate.toLocaleString() }}/hr</div>
            </div>

            <!-- Gold -->
            <div class="idle-res-chip gold">
              <div class="chip-main">🪙 {{ idle.accumulatedGold.toLocaleString() }}</div>
              <div class="chip-rate">+{{ idle.IDLE_HOURLY_RATES[idle.session.difficulty]?.gold ?? 0 }}/hr</div>
            </div>

            <!-- Ores -->
            <div class="idle-res-chip ore"
              v-for="t in idle.resourceTimers.ores" :key="t.id">
              <div class="chip-main">⛏ {{ t.id }} ×{{ idle.accumulatedOres.find(o => o.id === t.id)?.amount ?? 0 }}</div>
              <div class="chip-sub">
                <span class="chip-rate">+{{ t.rate }}/hr</span>
                <span class="chip-next" v-if="!idle.isCapped && t.nextMs !== null">
                  next {{ formatCountdown(t.nextMs) }}
                </span>
              </div>
            </div>

            <!-- Keys -->
            <div class="idle-res-chip key"
              v-for="t in idle.resourceTimers.keys" :key="t.tier">
              <div class="chip-main">🗝 {{ DUNGEON_KEY_NAMES[t.tier] }} ×{{ idle.accumulatedKeys.find(k => k.tier === t.tier)?.amount ?? 0 }}</div>
              <div class="chip-sub">
                <span class="chip-rate">+{{ t.rate }}/hr</span>
                <span class="chip-next" v-if="!idle.isCapped && t.nextMs !== null">
                  next {{ formatCountdown(t.nextMs) }}
                </span>
              </div>
            </div>

          </div>

          <div class="idle-actions">
            <button class="btn-collect" @click="collectIdle" :disabled="!idle.hasAnything">
              Collect
            </button>
            <button class="btn-stop-idle" @click="idle.stopIdle()">Stop</button>
          </div>

          <Transition name="collect-pop">
            <div class="collect-result" v-if="lastCollect">
              <div class="collect-row" v-if="lastCollect.xp > 0">✦ {{ lastCollect.xp.toLocaleString() }} XP</div>
              <div class="collect-row gold" v-if="lastCollect.gold > 0">🪙 {{ lastCollect.gold.toLocaleString() }}</div>
              <div class="collect-row" v-for="o in lastCollect.ores" :key="o.id">⛏ {{ o.id }} ×{{ o.amount }}</div>
              <div class="collect-row" v-for="k in lastCollect.keys" :key="k.tier">🗝 ×{{ k.amount }}</div>
              <div class="collect-levelups" v-if="lastCollect.levelUps.length">
                <div class="levelup-row" v-for="(lu, i) in lastCollect.levelUps" :key="i">
                  <span class="levelup-star">★</span>
                  <span class="levelup-name" :class="lu.rarity.toLowerCase()">{{ lu.name }}</span>
                  <span class="levelup-arrow">→</span>
                  <span class="levelup-level">Lv. {{ lu.level }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>

        <!-- Idle training — not active here -->
        <button
          class="idle-btn"
          v-else
          :disabled="!canBattle || !campaign.isCompleted(selectedEnc.id)"
          @click="startIdleHere"
        >
          ⏱ Idle Train
          <span v-if="!campaign.isCompleted(selectedEnc.id)" class="idle-btn-note">· clear this stage first</span>
          <span v-else-if="idle.isRunning" class="idle-btn-note">· switch from {{ idle.session?.encounterName }}</span>
        </button>

      </div>
    </Transition>

    <!-- Map legend -->
    <div class="map-legend">
      <span class="legend-row"><span class="legend-dot easy" />Easy</span>
      <span class="legend-divider" />
      <span class="legend-row"><span class="legend-dot normal" />Normal</span>
      <span class="legend-divider" />
      <span class="legend-row"><span class="legend-dot hard" />Hard</span>
      <span class="legend-divider" />
      <span class="legend-row"><span class="legend-dot nightmare" />Nightmare</span>
    </div>

    <!-- Encampment hotspot -->
    <div class="hotspot-enc" title="Encampment">
      <span class="enc-ping" />
      <span class="enc-label">⚑ Encampment</span>
    </div>

    <!-- Encampment right panel -->
    <div class="enc-panel">
        <div class="enc-panel-header">
          <span class="enc-panel-title">⚑ Encampment</span>
        </div>

        <div class="enc-panel-body">

          <button class="enc-option" @click="$emit('open-collection')">
            <GameIcon icon="collection" :size="28" class="enc-opt-icon" />
            <span class="enc-opt-info">
              <span class="enc-opt-name">Collection</span>
              <span class="enc-opt-sub">Manage your champions & team</span>
            </span>
          </button>

          <button class="enc-option" @click="$emit('open-market')">
            <GameIcon icon="market" :size="28" class="enc-opt-icon" />
            <span class="enc-opt-info">
              <span class="enc-opt-name">Market</span>
              <span class="enc-opt-sub">Sell gear for gold</span>
            </span>
          </button>

          <button class="enc-option" @click="$emit('open-blacksmith')">
            <GameIcon icon="blacksmith" :size="28" class="enc-opt-icon" />
            <span class="enc-opt-info">
              <span class="enc-opt-name">Blacksmith</span>
              <span class="enc-opt-sub">Smelt ore, forge gear, and upgrade all crafted equipment</span>
            </span>
          </button>

          <button class="enc-option" @click="$emit('open-leatherworking')">
            <img :src="leatherworkingIcon" class="enc-opt-icon" style="width:28px;height:28px;object-fit:contain;" alt="" />
            <span class="enc-opt-info">
              <span class="enc-opt-name">Leatherworking</span>
              <span class="enc-opt-sub">Tan hides and craft leather armor</span>
            </span>
          </button>

          <button class="enc-option" @click="$emit('open-tailoring')">
            <img :src="tailoringIcon" class="enc-opt-icon" style="width:28px;height:28px;object-fit:contain;" alt="" />
            <span class="enc-opt-info">
              <span class="enc-opt-name">Tailoring</span>
              <span class="enc-opt-sub">Weave cloth and craft robes</span>
            </span>
          </button>

          <button class="enc-option" @click="$emit('open-woodworking')">
            <img :src="woodworkingIcon" class="enc-opt-icon" style="width:28px;height:28px;object-fit:contain;" alt="" />
            <span class="enc-opt-info">
              <span class="enc-opt-name">Woodworking</span>
              <span class="enc-opt-sub">Carve bows and staves from raw timber</span>
            </span>
          </button>

        </div>

        <div class="enc-panel-footer">
          <button class="enc-codex-btn" @click="$emit('open-codex')">
            <img :src="codexIcon" class="enc-codex-icon" alt="Codex" />
            <span class="enc-opt-info">
              <span class="enc-opt-name">Codex</span>
              <span class="enc-opt-sub">Adventure log & lore</span>
            </span>
          </button>
        </div>
    </div>

    </template>

    <div v-else-if="activeHomeTab === 'hunts'" class="hunting-zone-view">
      <HuntsView />
    </div>

    <div v-else class="artisan-zone-view">
      <ArtisanZoneView
        @open-blacksmith="$emit('open-blacksmith')"
        @open-leatherworking="$emit('open-leatherworking')"
        @open-tailoring="$emit('open-tailoring')"
        @open-woodworking="$emit('open-woodworking')"
        @open-fusion-workshop="$emit('open-fusion-workshop')"
      />
    </div>

  </div>
</template>

<script setup>
import { useHomeLogic }       from '../../composables/useHomeLogic.js'
import { DUNGEON_KEY_NAMES }  from '../../game/data/dungeons.js'
import trainingBg             from '../../assets/backgrounds/homepage_bg.png'
import codexIcon              from '../../assets/ui/codex.png'
import leatherworkingIcon     from '../../assets/ui/leatherworking_icon.png'
import tailoringIcon          from '../../assets/ui/tailoring_icon.png'
import woodworkingIcon        from '../../assets/ui/woodworking_icon.png'
import GameIcon               from '../ui/GameIcon.vue'
import HuntsView              from '../HuntsView.vue'
import ArtisanZoneView        from '../ArtisanZoneView.vue'

const emit = defineEmits(['start-battle', 'open-collection', 'open-blacksmith', 'open-market', 'open-codex', 'open-leatherworking', 'open-tailoring', 'open-woodworking', 'open-fusion-workshop'])

const {
  activeHomeTab,
  camp, collection, campaign, idle,
  ENCOUNTERS, ZONE_POSITIONS,
  teamCP, encounterCP, cpVerdict,
  selectedIndex, selectedEnc,
  difficultyGroups,
  selectZone, teamEntry,
  canBattle, battleHint, startBattle,
  isActiveIdleZone,
  lastCollect, collectIdle, startIdleHere, formatElapsed, formatCountdown,
  formatCP,
} = useHomeLogic(emit)
</script>

<style scoped>
.training-scene {
  position: relative;
  width: 100%;
  height: calc(100vh - 64px);
  background: #070503;
  overflow: hidden;
}
.map-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 0;
}
.training-scene::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5, 3, 1, 0.55) 0%,
    rgba(5, 3, 1, 0.25) 35%,
    rgba(5, 3, 1, 0.40) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* ── Zone hotspot buttons ── */
.zone-btn {
  position: absolute;
  transform: translate(-50%, -50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  z-index: 1;
}
.zone-dot {
  position: relative;
  z-index: 1;
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 2px solid currentColor;
  background: rgba(8, 4, 2, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 900;
  transition: transform 0.15s, box-shadow 0.15s;
}
.zone-pulse {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 36px; height: 36px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.4;
  animation: pulse 2.2s ease-out infinite;
  pointer-events: none;
}
@keyframes pulse {
  0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.4; }
  100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
}
.zone-label {
  font-size: 0.6rem; font-weight: 700; color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.9), 0 0 12px rgba(0,0,0,0.9);
  white-space: nowrap; letter-spacing: 0.5px; text-transform: uppercase;
}
.zone-btn.easy      { color: #4dff88; }
.zone-btn.normal    { color: #4fa8ff; }
.zone-btn.hard      { color: #ff9944; }
.zone-btn.nightmare { color: #cc44ff; }
.zone-btn.completed .zone-dot  { background: rgba(8,8,8,0.85); opacity: 0.75; }
.zone-btn.completed .zone-label { opacity: 0.6; }
.zone-btn:hover .zone-dot,
.zone-btn.active .zone-dot {
  transform: scale(1.18);
  box-shadow: 0 0 18px currentColor;
}
.zone-btn.active .zone-dot { background: rgba(12,6,2,0.92); box-shadow: 0 0 24px currentColor; }

/* ── Center detail card ── */
.detail-card {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  width: min(380px, 90vw);
  background: rgba(10, 5, 2, 0.92);
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  padding: 22px 24px 20px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 48px rgba(0,0,0,0.7), 0 0 40px rgba(201,162,39,0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.detail-close {
  position: absolute;
  top: 12px; right: 14px;
  background: none; border: none; color: #444;
  font-size: 0.8rem; cursor: pointer;
  transition: color 0.15s; padding: 2px 4px; line-height: 1;
}
.detail-close:hover { color: #aaa; }
.detail-header { display: flex; flex-direction: column; gap: 6px; }
.detail-name {
  font-family: var(--font-head); font-size: 1.1rem; font-weight: 800;
  color: #fff; padding-right: 24px;
}
.detail-badges { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.diff-badge { font-size: 0.6rem; font-weight: 700; text-transform: uppercase; padding: 2px 8px; border-radius: 10px; }
.diff-badge.easy      { background: #0a2a0a; color: #4dff88; }
.diff-badge.normal    { background: #0a1a3a; color: #4fa8ff; }
.diff-badge.hard      { background: #3a1a00; color: #ff9944; }
.diff-badge.nightmare { background: #2a0a3a; color: #b44fff; }
.done-badge { font-size: 0.6rem; padding: 2px 8px; border-radius: 10px; background: #1a1400; color: #ffd700; font-weight: 700; }
.detail-body { display: flex; flex-direction: column; gap: 12px; }
.detail-section { display: flex; flex-direction: column; gap: 5px; }
.section-label { font-size: 0.58rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-muted); font-weight: 600; }
.enemy-row  { display: flex; gap: 5px; flex-wrap: wrap; }
.enemy-chip { font-size: 0.68rem; padding: 2px 8px; border-radius: 8px; background: #1a0808; color: #cc6644; border: 1px solid #3e1c0c; }
.cp-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cp-yours  { font-size: 0.72rem; color: #aa8833; font-weight: 700; }
.cp-sep    { font-size: 0.65rem; color: #333; }
.cp-enemy  { font-size: 0.72rem; color: #cc6644; font-weight: 700; }
.cp-verdict { font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 10px; }
.verdict-strong { background: #0a2a0a; color: #4dff88; }
.verdict-even   { background: #2a2a00; color: #ffd700; }
.verdict-weak   { background: #2a0a0a; color: #ff6b6b; }
.rewards-row { display: flex; gap: 12px; }
.reward      { font-size: 0.78rem; font-weight: 700; }
.reward.gold     { color: var(--gold); }
.reward.ore      { color: #b07840; }
.reward.diamonds { color: #88ccff; }
.reward.xp       { color: #aaffcc; }
.battle-btn {
  padding: 12px; border-radius: 8px; border: none;
  background: #c9a227; color: #0a0500;
  font-family: var(--font-head); font-size: 0.85rem; font-weight: 900;
  letter-spacing: 1.5px; text-transform: uppercase;
  cursor: pointer; width: 100%;
  transition: opacity 0.15s, box-shadow 0.15s;
}
.battle-btn:hover:not(:disabled) { opacity: 0.88; box-shadow: 0 0 20px rgba(201,162,39,0.3); }
.battle-btn:disabled { background: #1a1208; color: #3a2a10; cursor: not-allowed; }
.battle-hint-text { font-size: 0.65rem; color: #555; font-style: italic; text-align: center; margin-top: -8px; }

/* ── Tab bar ── */
.tg-tab-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 48px;
  z-index: 15;
  display: flex;
  align-items: stretch;
  background: rgba(8, 4, 2, 0.92);
  border-bottom: 1px solid var(--border-brown);
  backdrop-filter: blur(10px);
  padding: 0 12px 0 0;
}
.tg-tabs { display: flex; align-items: stretch; }
.tg-tab {
  height: 100%; padding: 0 22px;
  background: none; border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-family: var(--font-head); font-size: 0.70rem; font-weight: 800;
  letter-spacing: 2px; text-transform: uppercase;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.tg-tab--active { color: var(--gold); border-bottom-color: var(--gold); }
.tg-team {
  margin-left: auto;
  display: flex; align-items: center; gap: 10px;
  padding: 0 4px; flex-wrap: nowrap; overflow: hidden;
}
.no-team    { font-size: 0.68rem; color: #444; font-style: italic; }
.team-hero-chip { display: flex; align-items: center; gap: 4px; }
.chip-dot { font-size: 0.55rem; }
.chip-dot.mythical  { color: #ff2244; }
.chip-dot.legendary { color: #ffd700; }
.chip-dot.epic      { color: #b44fff; }
.chip-dot.rare      { color: #4fa8ff; }
.chip-dot.uncommon  { color: #4dff88; }
.chip-dot.common    { color: #666; }
.chip-name { font-size: 0.68rem; color: #ccc; font-weight: 600; }
.team-cp   { font-size: 0.70rem; color: #aa8833; font-weight: 700; padding-left: 10px; border-left: 1px solid #2a1a0a; }
.team-gold-rate { font-size: 0.65rem; color: var(--gold); font-family: var(--font-head); font-weight: 700; padding-left: 10px; border-left: 1px solid #2a1a0a; }

/* ── Left sidebar ── */
.tg-sidebar {
  position: absolute;
  top: 48px; left: 0; bottom: 0;
  width: 220px; z-index: 10;
  background: rgba(8, 4, 2, 0.90);
  border-right: 1px solid var(--border-brown);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  display: flex; flex-direction: column; gap: 18px;
  padding: 14px 8px 20px;
}
.sidebar-section { display: flex; flex-direction: column; gap: 2px; }
.sidebar-diff-label {
  font-family: var(--font-head); font-size: 0.54rem; font-weight: 800;
  text-transform: uppercase; letter-spacing: 2.5px;
  padding: 0 8px 7px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 4px;
}
.sidebar-diff-label.easy      { color: #4dff88; }
.sidebar-diff-label.normal    { color: #4fa8ff; }
.sidebar-diff-label.hard      { color: #ff9944; }
.sidebar-diff-label.brutal    { color: #ff5544; }
.sidebar-diff-label.nightmare { color: #cc44ff; }
.sidebar-enc-btn {
  display: flex; align-items: center; gap: 9px;
  width: 100%; background: none; border: 1px solid transparent;
  border-radius: 6px; padding: 8px 10px;
  cursor: pointer; text-align: left;
  transition: background 0.15s, border-color 0.15s;
}
.sidebar-enc-btn:hover { background: rgba(255,255,255,0.04); border-color: var(--border-brown); }
.sidebar-enc-btn.active {
  background: linear-gradient(90deg, rgba(255,255,255,0.08), transparent);
  border-color: transparent; border-left: 2px solid currentColor; padding-left: 9px;
}
.sidebar-enc-btn.easy      { color: #4dff88; }
.sidebar-enc-btn.normal    { color: #4fa8ff; }
.sidebar-enc-btn.hard      { color: #ff9944; }
.sidebar-enc-btn.brutal    { color: #ff5544; }
.sidebar-enc-btn.nightmare { color: #cc44ff; }
.sidebar-enc-indicator { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sidebar-enc-indicator.easy      { background: #4dff88; box-shadow: 0 0 5px #4dff88; }
.sidebar-enc-indicator.normal    { background: #4fa8ff; box-shadow: 0 0 5px #4fa8ff; }
.sidebar-enc-indicator.hard      { background: #ff9944; box-shadow: 0 0 5px #ff9944; }
.sidebar-enc-indicator.brutal    { background: #ff5544; box-shadow: 0 0 5px #ff5544; }
.sidebar-enc-indicator.nightmare { background: #cc44ff; box-shadow: 0 0 5px #cc44ff; }
.sidebar-enc-name { font-size: 0.70rem; color: var(--text-parchment); font-weight: 600; flex: 1; line-height: 1.3; }
.sidebar-enc-btn.completed .sidebar-enc-name { opacity: 0.55; }
.sidebar-enc-check { font-size: 0.62rem; color: #4dff88; font-weight: 800; }
.sidebar-idle-dot { width: 6px; height: 6px; border-radius: 50%; background: #44ffaa; animation: idle-pulse 1.4s ease-in-out infinite; flex-shrink: 0; }

/* Transitions */
.fade-up-enter-active { transition: opacity 0.2s, transform 0.2s; }
.fade-up-leave-active { transition: opacity 0.15s, transform 0.12s; }
.fade-up-enter-from   { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
.fade-up-leave-to     { opacity: 0; transform: translate(-50%, calc(-50% - 8px)); }

/* ── Idle training ── */
.zone-btn.idling .zone-dot { box-shadow: 0 0 16px 2px #44ffaa; border-color: #44ffaa; }
.zone-btn.idling .zone-pulse { color: #44ffaa; }
.idle-status {
  background: rgba(0, 20, 10, 0.85); border: 1px solid #1a4a2a;
  border-radius: 8px; padding: 12px 14px;
  display: flex; flex-direction: column; gap: 8px;
}
.idle-status-header { display: flex; align-items: center; gap: 8px; }
.idle-running-dot {
  display: inline-block; width: 7px; height: 7px; border-radius: 50%;
  background: #44ffaa; animation: idle-pulse 1.4s ease-in-out infinite; flex-shrink: 0;
}
@keyframes idle-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}
.idle-status-label { font-size: 0.65rem; font-weight: 700; color: #4dff88; text-transform: uppercase; letter-spacing: 1px; }
.idle-elapsed      { font-size: 0.65rem; color: #666; margin-left: auto; }
.idle-cap-badge {
  font-size: 0.55rem; font-weight: 800; letter-spacing: 1px;
  color: #ffdd44; background: rgba(255,220,40,0.12); border: 1px solid #554400;
  border-radius: 4px; padding: 1px 6px;
}
.idle-cap-row { display: flex; align-items: center; gap: 8px; }
.idle-cap-track { flex: 1; height: 4px; background: #0a1a10; border-radius: 2px; overflow: hidden; }
.idle-cap-fill { height: 100%; background: linear-gradient(to right, #44ffaa, #aaff44); border-radius: 2px; transition: width 4s linear; }
.idle-cap-label { font-size: 0.58rem; color: #446; white-space: nowrap; }
.idle-resources {
  display: flex; flex-wrap: wrap; gap: 5px;
}
.idle-res-chip {
  display: flex; flex-direction: column; gap: 2px;
  padding: 5px 10px; border-radius: 8px; border: 1px solid;
  min-width: 0;
}
.idle-res-chip.xp   { color: #aaffcc; border-color: #1a4a2a; background: rgba(0,30,15,0.6); }
.idle-res-chip.gold { color: var(--gold); border-color: #3a2a00; background: rgba(20,12,0,0.6); }
.idle-res-chip.ore  { color: #b07840; border-color: #3a2010; background: rgba(20,10,0,0.6); }
.idle-res-chip.key  { color: #cd7f32; border-color: #3a2800; background: rgba(20,14,0,0.6); }
.chip-main { font-size: 0.72rem; font-weight: 700; white-space: nowrap; }
.chip-rate { font-size: 0.58rem; color: #556; font-weight: 400; }
.chip-sub  { display: flex; gap: 6px; align-items: center; }
.chip-next {
  font-size: 0.58rem; font-weight: 600;
  color: #88cc88; opacity: 0.85;
  white-space: nowrap;
}
.chip-next::before { content: '· '; }
.idle-actions { display: flex; gap: 8px; }
.btn-collect {
  flex: 1; padding: 8px; border-radius: 6px; border: none;
  background: #1a4a2a; color: #4dff88; font-size: 0.78rem; font-weight: 700;
  cursor: pointer; transition: background 0.15s;
}
.btn-collect:hover:not(:disabled) { background: #226633; }
.btn-collect:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-stop-idle {
  padding: 8px 14px; border-radius: 6px; border: 1px solid #1a2a1a;
  background: transparent; color: #446644; font-size: 0.72rem;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.btn-stop-idle:hover { color: #aaa; border-color: #444; }
.collect-result {
  background: #0a0f06; border: 1px solid #1a4411;
  border-radius: 8px; padding: 10px 14px;
  display: flex; flex-direction: column; gap: 5px;
}
.collect-row { font-size: 0.72rem; font-weight: 700; color: #aaffcc; letter-spacing: 0.5px; }
.collect-row.gold { color: var(--gold); }
.collect-levelups { display: flex; flex-direction: column; gap: 4px; }
.levelup-row { display: flex; align-items: center; gap: 6px; font-size: 0.7rem; }
.levelup-star { color: var(--gold); font-size: 0.8rem; }
.levelup-name { font-family: var(--font-head); font-weight: 700; }
.levelup-name.legendary { color: var(--gold-bright); }
.levelup-name.mythical  { color: #ff2244; }
.levelup-name.epic      { color: #c070ff; }
.levelup-name.rare      { color: #60b0ff; }
.levelup-name.uncommon  { color: #50ff90; }
.levelup-name.common    { color: #aaa; }
.levelup-arrow { color: var(--text-dim); font-size: 0.65rem; }
.levelup-level { font-family: var(--font-head); font-weight: 800; color: #aaff44; font-size: 0.72rem; }
.collect-pop-enter-active { animation: result-pop 0.25s ease-out; }
.collect-pop-leave-active { transition: opacity 0.4s ease; }
.collect-pop-leave-to     { opacity: 0; }
@keyframes result-pop {
  from { transform: translateY(4px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}
.idle-btn {
  width: 100%; padding: 10px; border-radius: 8px;
  border: 1px solid #1a3a2a; background: rgba(10, 30, 16, 0.7); color: #4dff88;
  font-size: 0.78rem; font-weight: 700; cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.idle-btn:hover:not(:disabled) { background: rgba(20, 50, 28, 0.9); border-color: #2a6a3a; }
.idle-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.idle-btn-note { font-size: 0.62rem; color: #446; font-weight: 400; }

/* Map legend */
.map-legend {
  position: absolute; bottom: 28px; left: 50%;
  transform: translateX(-50%); z-index: 3;
  display: flex; flex-direction: row; align-items: center;
  background: rgba(6, 3, 1, 0.80); border: 1px solid var(--border-brown);
  border-radius: 20px; padding: 8px 20px; backdrop-filter: blur(6px); white-space: nowrap;
}
.legend-row {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: var(--font-head); font-size: 0.78rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px;
  color: var(--text-parchment); padding: 0 20px;
}
.legend-divider { width: 1px; height: 16px; background: var(--border-brown); flex-shrink: 0; }
.legend-dot { width: 13px; height: 13px; border-radius: 50%; flex-shrink: 0; }
.legend-dot.easy      { background: #4dff88; box-shadow: 0 0 8px #4dff88; }
.legend-dot.normal    { background: #4fa8ff; box-shadow: 0 0 8px #4fa8ff; }
.legend-dot.hard      { background: #ff9944; box-shadow: 0 0 8px #ff9944; }
.legend-dot.nightmare { background: #cc44ff; box-shadow: 0 0 8px #cc44ff; }

/* Encampment hotspot */
.hotspot-enc {
  position: absolute; top: 52%; left: 42%;
  transform: translate(-50%, -50%);
  background: none; border: none; padding: 0; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; gap: 6px; z-index: 1;
}
.enc-ping {
  display: block; width: 16px; height: 16px; border-radius: 50%;
  background: var(--gold); box-shadow: 0 0 0 0 rgba(201,162,39,0.6);
  animation: enc-pulse 2.2s ease-out infinite;
}
@keyframes enc-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(201,162,39,0.6); }
  70%  { box-shadow: 0 0 0 14px rgba(201,162,39,0); }
  100% { box-shadow: 0 0 0 0 rgba(201,162,39,0); }
}
.enc-label {
  font-family: var(--font-head); font-size: 0.6rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-parchment);
  background: rgba(8,4,2,0.85); border: 1px solid var(--border-gold);
  border-radius: 4px; padding: 3px 10px; white-space: nowrap;
  backdrop-filter: blur(4px); transition: color 0.15s, border-color 0.15s;
}
.hotspot-enc:hover .enc-label { color: var(--gold); border-color: var(--gold); }

/* Encampment right panel */
.enc-panel {
  position: absolute; top: 48px; right: 0; bottom: 0; width: 260px;
  background: linear-gradient(180deg, rgba(18,10,4,0.97) 0%, rgba(10,6,2,0.97) 100%);
  border-left: 1px solid var(--border-gold);
  display: flex; flex-direction: column; z-index: 20;
  box-shadow: -8px 0 32px rgba(0,0,0,0.8);
}
.enc-panel-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 16px 12px; border-bottom: 1px solid var(--border-brown);
}
.enc-panel-title { font-family: var(--font-head); font-size: 0.72rem; font-weight: 800; color: var(--gold); text-transform: uppercase; letter-spacing: 2px; }
.enc-panel-body { flex: 1; display: flex; flex-direction: column; padding: 12px 10px; gap: 6px; overflow-y: auto; }
.enc-option {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border-brown);
  border-radius: 6px; padding: 11px 12px; cursor: pointer; text-align: left;
  transition: background 0.15s, border-color 0.15s; position: relative;
}
.enc-option:not(:disabled):hover { background: rgba(201,162,39,0.08); border-color: var(--border-gold); }
.enc-opt-icon { flex-shrink: 0; width: 28px; text-align: center; }
.enc-opt-info { display: flex; flex-direction: column; gap: 2px; flex: 1; }
.enc-opt-name { font-family: var(--font-head); font-size: 0.68rem; font-weight: 700; color: var(--text-parchment); text-transform: uppercase; letter-spacing: 1px; }
.enc-opt-sub  { font-size: 0.58rem; color: var(--text-dim); line-height: 1.4; }
.enc-panel-footer { padding: 12px 16px; border-top: 1px solid var(--border-brown); }
.enc-codex-btn {
  display: flex; align-items: center; gap: 12px; width: 100%;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border-brown);
  border-radius: 6px; padding: 10px 12px; cursor: pointer; text-align: left;
  transition: background 0.15s, border-color 0.15s;
}
.enc-codex-btn:hover { background: rgba(201,162,39,0.08); border-color: var(--border-gold); }
.enc-codex-icon { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; }

.idle-strip-indicator {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.65rem; color: #4dff88;
  padding-left: 10px; border-left: 1px solid #1a3a1a;
}
.hunting-zone-view {
  position: absolute; top: 48px; left: 0; right: 0; bottom: 0; overflow-y: auto;
}
.artisan-zone-view {
  position: absolute; top: 48px; left: 0; right: 0; bottom: 0; overflow-y: auto;
}
</style>
