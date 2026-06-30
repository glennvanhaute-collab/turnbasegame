<template>
  <div class="mob-home">

    <!-- Tab bar -->
    <div class="mob-tab-bar">
      <button class="mob-tab" :class="{ active: activeHomeTab === 'training' }" @click="activeHomeTab = 'training'">⚔ Training</button>
      <button class="mob-tab" :class="{ active: activeHomeTab === 'artisan' }"  @click="activeHomeTab = 'artisan'">⚒ Artisan</button>
      <button class="mob-tab" :class="{ active: activeHomeTab === 'hunts' }"    @click="activeHomeTab = 'hunts'">🌿 Gathering</button>
    </div>

    <!-- ── Training tab ── -->
    <div v-if="activeHomeTab === 'training'" class="mob-training">

      <!-- Map banner (atmospheric background, not interactive) -->
      <div class="mob-banner" :style="{ backgroundImage: `url(${trainingBg})` }">
        <div class="mob-banner-fade" />
        <div class="mob-banner-info">
          <div class="mob-team-row">
            <template v-if="collection.team.length > 0">
              <span v-for="key in collection.team" :key="key" class="mob-chip-dot" :class="teamEntry(key)?.hero.rarity.toLowerCase()">●</span>
              <span class="mob-cp">⚡ {{ formatCP(teamCP) }}</span>
            </template>
            <span v-else class="mob-no-team">No team — visit Collection</span>
          </div>
          <div class="mob-meta-row">
            <span class="mob-gold-rate">🪙 +{{ camp.goldPerMin }}/min</span>
            <span v-if="idle.isRunning" class="mob-idle-strip">
              <span class="idle-dot" />⏱ {{ idle.session.encounterName }}
            </span>
          </div>
        </div>
      </div>

      <!-- Scrollable encounter list + encampment -->
      <div class="mob-scroll">

        <!-- Encounter accordion -->
        <div class="mob-enc-section">
          <div v-for="diff in difficultyGroups" :key="diff.label" class="mob-diff-group">
            <div class="mob-diff-label" :class="diff.cls">{{ diff.label }}</div>
            <template v-for="enc in diff.encounters" :key="enc.id">
              <button
                class="mob-enc-row"
                :class="[enc.difficulty.toLowerCase(), {
                  active:    selectedIndex === enc.index,
                  completed: campaign.isCompleted(enc.id),
                }]"
                @click="selectZone(enc.index)"
              >
                <span class="mob-enc-dot" :class="enc.difficulty.toLowerCase()" />
                <span class="mob-enc-name">{{ enc.name }}</span>
                <span class="mob-enc-idle-dot" v-if="idle.session?.encounterId === enc.id" />
                <span class="mob-enc-check" v-else-if="campaign.isCompleted(enc.id)">✓</span>
                <span class="mob-enc-chevron" :class="{ open: selectedIndex === enc.index }">›</span>
              </button>

              <!-- Inline detail -->
              <Transition name="mob-expand">
                <div v-if="selectedIndex === enc.index" class="mob-detail">

                  <div class="mob-detail-rows">
                    <div class="mob-detail-row">
                      <div class="mob-detail-label">Enemies</div>
                      <div class="mob-enemy-row">
                        <span v-for="(ef, j) in enc.enemies" :key="j" class="enemy-chip">{{ ef().name }}</span>
                      </div>
                    </div>
                    <div class="mob-detail-row" v-if="collection.team.length > 0">
                      <div class="mob-detail-label">Combat Power</div>
                      <div class="cp-row">
                        <span class="cp-yours">⚡ {{ formatCP(teamCP) }}</span>
                        <span class="cp-sep">vs</span>
                        <span class="cp-enemy">{{ formatCP(encounterCP(enc)) }}</span>
                        <span class="cp-verdict" :class="cpVerdict(enc).cls">{{ cpVerdict(enc).label }}</span>
                      </div>
                    </div>
                    <div class="mob-detail-row">
                      <div class="mob-detail-label">Rewards</div>
                      <div class="rewards-row">
                        <span class="reward gold" v-if="enc.rewards.gold > 0">🪙 {{ enc.rewards.gold.toLocaleString() }}</span>
                        <span class="reward ore"  v-if="enc.isTraining">⛏ Ore drops</span>
                        <span class="reward diamonds" v-if="enc.rewards.diamonds > 0">💎 {{ enc.rewards.diamonds }}</span>
                        <span class="reward xp">✦ XP</span>
                      </div>
                    </div>
                  </div>

                  <!-- Idle status when this zone is active -->
                  <div class="idle-status" v-if="idle.session?.encounterId === enc.id">
                    <div class="idle-status-header">
                      <span class="idle-running-dot" />
                      <span class="idle-status-label">Idle Training</span>
                      <span class="idle-elapsed">{{ formatElapsed(idle.elapsedMs) }}</span>
                    </div>
                    <div class="idle-xp-row">
                      <span class="idle-xp-value">+{{ idle.accumulatedXp.toLocaleString() }} XP</span>
                      <span class="idle-rate-pct">@ {{ Math.round(idle.currentRate * 100) }}% rate</span>
                    </div>
                    <div class="idle-rate-track">
                      <div class="idle-rate-fill" :style="{ width: (idle.currentRate * 100) + '%' }" />
                    </div>
                    <div class="idle-actions">
                      <button class="btn-collect" @click="collectIdle" :disabled="idle.accumulatedXp <= 0">Collect XP</button>
                      <button class="btn-stop-idle" @click="idle.stopIdle()">Stop</button>
                    </div>
                    <Transition name="collect-pop">
                      <div class="collect-result" v-if="lastCollect">
                        <div class="collect-xp">+{{ lastCollect.xp.toLocaleString() }} XP collected</div>
                        <div v-if="lastCollect.levelUps.length" class="collect-levelups">
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

                  <!-- Action buttons -->
                  <div class="mob-detail-actions">
                    <button class="battle-btn" :disabled="!canBattle" @click="startBattle">⚔ Battle</button>
                    <button
                      class="idle-btn"
                      v-if="idle.session?.encounterId !== enc.id"
                      :disabled="!canBattle || !campaign.isCompleted(enc.id)"
                      @click="startIdleHere"
                    >
                      ⏱ Idle
                      <span v-if="!campaign.isCompleted(enc.id)" class="idle-btn-note">· clear first</span>
                      <span v-else-if="idle.isRunning" class="idle-btn-note">· switch</span>
                    </button>
                  </div>
                  <div class="battle-hint-text" v-if="!canBattle">{{ battleHint }}</div>

                </div>
              </Transition>
            </template>
          </div>
        </div>

        <!-- Encampment -->
        <div class="mob-camp-header">⚑ Encampment</div>
        <div class="mob-camp-list">
          <button class="mob-camp-opt" @click="$emit('open-collection')">
            <GameIcon icon="collection" :size="26" class="camp-opt-icon" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Collection</span>
              <span class="camp-opt-sub">Manage your champions & team</span>
            </span>
          </button>
          <button class="mob-camp-opt" @click="$emit('open-market')">
            <GameIcon icon="market" :size="26" class="camp-opt-icon" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Market</span>
              <span class="camp-opt-sub">Sell gear for gold</span>
            </span>
          </button>
          <button class="mob-camp-opt" @click="$emit('open-blacksmith')">
            <GameIcon icon="blacksmith" :size="26" class="camp-opt-icon" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Blacksmith</span>
              <span class="camp-opt-sub">Smelt ore, forge and upgrade gear</span>
            </span>
          </button>
          <button class="mob-camp-opt" @click="$emit('open-leatherworking')">
            <img :src="leatherworkingIcon" class="camp-opt-icon" style="width:26px;height:26px;object-fit:contain;" alt="" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Leatherworking</span>
              <span class="camp-opt-sub">Tan hides and craft leather armor</span>
            </span>
          </button>
          <button class="mob-camp-opt" @click="$emit('open-tailoring')">
            <img :src="tailoringIcon" class="camp-opt-icon" style="width:26px;height:26px;object-fit:contain;" alt="" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Tailoring</span>
              <span class="camp-opt-sub">Weave cloth and craft robes</span>
            </span>
          </button>
          <button class="mob-camp-opt" @click="$emit('open-woodworking')">
            <img :src="woodworkingIcon" class="camp-opt-icon" style="width:26px;height:26px;object-fit:contain;" alt="" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Woodworking</span>
              <span class="camp-opt-sub">Carve bows and staves from timber</span>
            </span>
          </button>
          <button class="mob-camp-opt mob-fusion-opt" @click="$emit('open-fusion-workshop')">
            <img :src="fusionWorkshopIcon" class="camp-opt-icon" style="width:26px;height:26px;object-fit:contain;" alt="" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Fusion Workshop</span>
              <span class="camp-opt-sub">Combine disciplines to craft hybrid gear</span>
            </span>
          </button>
          <button class="mob-camp-opt mob-codex-opt" @click="$emit('open-codex')">
            <img :src="codexIcon" class="camp-opt-icon" style="width:26px;height:26px;object-fit:contain;" alt="" />
            <span class="camp-opt-info">
              <span class="camp-opt-name">Codex</span>
              <span class="camp-opt-sub">Adventure log & lore</span>
            </span>
          </button>
        </div>

      </div>
    </div>

    <!-- ── Artisan tab ── -->
    <div v-else-if="activeHomeTab === 'artisan'" class="mob-subview">
      <ArtisanZoneView
        @open-blacksmith="$emit('open-blacksmith')"
        @open-leatherworking="$emit('open-leatherworking')"
        @open-tailoring="$emit('open-tailoring')"
        @open-woodworking="$emit('open-woodworking')"
        @open-fusion-workshop="$emit('open-fusion-workshop')"
      />
    </div>

    <!-- ── Gathering tab ── -->
    <div v-else class="mob-subview">
      <HuntsView />
    </div>

  </div>
</template>

<script setup>
import { useHomeLogic }       from '../../composables/useHomeLogic.js'
import trainingBg             from '../../assets/backgrounds/homepage_bg.png'
import codexIcon              from '../../assets/ui/codex.png'
import leatherworkingIcon     from '../../assets/ui/leatherworking_icon.png'
import tailoringIcon          from '../../assets/ui/tailoring_icon.png'
import woodworkingIcon        from '../../assets/ui/woodworking_icon.png'
import fusionWorkshopIcon     from '../../assets/ui/fusion_worshop_icon.png'
import GameIcon               from '../ui/GameIcon.vue'
import HuntsView              from '../HuntsView.vue'
import ArtisanZoneView        from '../ArtisanZoneView.vue'

const emit = defineEmits(['start-battle', 'open-collection', 'open-blacksmith', 'open-market', 'open-codex', 'open-leatherworking', 'open-tailoring', 'open-woodworking', 'open-fusion-workshop'])

const {
  activeHomeTab,
  camp, collection, campaign, idle,
  teamCP, encounterCP, cpVerdict,
  selectedIndex,
  difficultyGroups,
  selectZone, teamEntry,
  canBattle, battleHint, startBattle,
  lastCollect, collectIdle, startIdleHere, formatElapsed,
  formatCP,
} = useHomeLogic(emit)
</script>

<style scoped>
/* ── Container ── */
.mob-home {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background: #070503;
  overflow: hidden;
}

/* ── Tab bar ── */
.mob-tab-bar {
  display: flex;
  flex-shrink: 0;
  background: rgba(8, 4, 2, 0.96);
  border-bottom: 1px solid var(--border-brown);
}
.mob-tab {
  flex: 1;
  padding: 13px 4px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.mob-tab.active {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

/* ── Training tab ── */
.mob-training {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Map banner ── */
.mob-banner {
  position: relative;
  flex-shrink: 0;
  height: 140px;
  background-size: cover;
  background-position: center 30%;
}
.mob-banner-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5, 3, 1, 0.3) 0%,
    rgba(5, 3, 1, 0.85) 100%
  );
}
.mob-banner-info {
  position: absolute;
  bottom: 10px;
  left: 14px;
  right: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.mob-team-row {
  display: flex;
  align-items: center;
  gap: 5px;
}
.mob-chip-dot { font-size: 0.6rem; }
.mob-chip-dot.mythical  { color: #ff2244; }
.mob-chip-dot.legendary { color: #ffd700; }
.mob-chip-dot.epic      { color: #b44fff; }
.mob-chip-dot.rare      { color: #4fa8ff; }
.mob-chip-dot.uncommon  { color: #4dff88; }
.mob-chip-dot.common    { color: #666; }
.mob-cp    { font-size: 0.7rem; color: #aa8833; font-weight: 700; padding-left: 6px; }
.mob-no-team { font-size: 0.62rem; color: #555; font-style: italic; }
.mob-meta-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mob-gold-rate { font-size: 0.65rem; color: var(--gold); font-weight: 700; }
.mob-idle-strip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.62rem;
  color: #4dff88;
}
.idle-dot {
  display: inline-block;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #44ffaa;
  animation: idle-pulse 1.4s ease-in-out infinite;
}
@keyframes idle-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

/* ── Scrollable body ── */
.mob-scroll {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 40px;
}

/* ── Encounter accordion ── */
.mob-enc-section {
  padding: 12px 14px 0;
}
.mob-diff-group {
  margin-bottom: 4px;
}
.mob-diff-label {
  font-family: var(--font-head);
  font-size: 0.52rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  padding: 8px 4px 5px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 3px;
}
.mob-diff-label.easy      { color: #4dff88; }
.mob-diff-label.normal    { color: #4fa8ff; }
.mob-diff-label.hard      { color: #ff9944; }
.mob-diff-label.brutal    { color: #ff5544; }
.mob-diff-label.nightmare { color: #cc44ff; }

.mob-enc-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  background: none;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 11px 10px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
}
.mob-enc-row:hover { background: rgba(255,255,255,0.04); }
.mob-enc-row.active {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.08);
}
.mob-enc-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.mob-enc-dot.easy      { background: #4dff88; box-shadow: 0 0 5px #4dff88; }
.mob-enc-dot.normal    { background: #4fa8ff; box-shadow: 0 0 5px #4fa8ff; }
.mob-enc-dot.hard      { background: #ff9944; box-shadow: 0 0 5px #ff9944; }
.mob-enc-dot.brutal    { background: #ff5544; box-shadow: 0 0 5px #ff5544; }
.mob-enc-dot.nightmare { background: #cc44ff; box-shadow: 0 0 5px #cc44ff; }
.mob-enc-name {
  flex: 1;
  font-size: 0.72rem;
  color: var(--text-parchment);
  font-weight: 600;
}
.mob-enc-row.completed .mob-enc-name { opacity: 0.55; }
.mob-enc-check { font-size: 0.62rem; color: #4dff88; font-weight: 800; }
.mob-enc-idle-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #44ffaa;
  animation: idle-pulse 1.4s ease-in-out infinite;
  flex-shrink: 0;
}
.mob-enc-chevron {
  font-size: 1.1rem;
  color: #333;
  line-height: 1;
  transform: rotate(0deg);
  transition: transform 0.2s ease, color 0.15s;
}
.mob-enc-chevron.open {
  transform: rotate(90deg);
  color: var(--gold);
}

/* ── Inline detail ── */
.mob-detail {
  margin: 0 0 6px 18px;
  background: rgba(10, 6, 2, 0.7);
  border: 1px solid var(--border-brown);
  border-radius: 8px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
}
.mob-detail-rows { display: flex; flex-direction: column; gap: 10px; }
.mob-detail-row  { display: flex; flex-direction: column; gap: 4px; }
.mob-detail-label {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  font-weight: 600;
}
.mob-enemy-row { display: flex; gap: 5px; flex-wrap: wrap; }
.enemy-chip { font-size: 0.65rem; padding: 2px 7px; border-radius: 8px; background: #1a0808; color: #cc6644; border: 1px solid #3e1c0c; }
.cp-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.cp-yours  { font-size: 0.7rem; color: #aa8833; font-weight: 700; }
.cp-sep    { font-size: 0.62rem; color: #333; }
.cp-enemy  { font-size: 0.7rem; color: #cc6644; font-weight: 700; }
.cp-verdict { font-size: 0.62rem; font-weight: 800; padding: 2px 7px; border-radius: 10px; }
.verdict-strong { background: #0a2a0a; color: #4dff88; }
.verdict-even   { background: #2a2a00; color: #ffd700; }
.verdict-weak   { background: #2a0a0a; color: #ff6b6b; }
.rewards-row { display: flex; gap: 10px; flex-wrap: wrap; }
.reward      { font-size: 0.75rem; font-weight: 700; }
.reward.gold     { color: var(--gold); }
.reward.ore      { color: #b07840; }
.reward.diamonds { color: #88ccff; }
.reward.xp       { color: #aaffcc; }

/* ── Detail action buttons ── */
.mob-detail-actions {
  display: flex;
  gap: 8px;
}
.battle-btn {
  flex: 1;
  padding: 11px;
  border-radius: 8px;
  border: none;
  background: #c9a227;
  color: #0a0500;
  font-family: var(--font-head);
  font-size: 0.8rem;
  font-weight: 900;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.15s, box-shadow 0.15s;
}
.battle-btn:hover:not(:disabled) { opacity: 0.88; box-shadow: 0 0 16px rgba(201,162,39,0.3); }
.battle-btn:disabled { background: #1a1208; color: #3a2a10; cursor: not-allowed; }
.battle-hint-text { font-size: 0.62rem; color: #555; font-style: italic; text-align: center; }
.idle-btn {
  padding: 11px 14px;
  border-radius: 8px;
  border: 1px solid #1a3a2a;
  background: rgba(10, 30, 16, 0.7);
  color: #4dff88;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.idle-btn:hover:not(:disabled) { background: rgba(20, 50, 28, 0.9); border-color: #2a6a3a; }
.idle-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.idle-btn-note { font-size: 0.58rem; color: #446; font-weight: 400; }

/* ── Idle status ── */
.idle-status {
  background: rgba(0, 20, 10, 0.85);
  border: 1px solid #1a4a2a;
  border-radius: 8px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.idle-status-header { display: flex; align-items: center; gap: 8px; }
.idle-running-dot {
  display: inline-block; width: 7px; height: 7px; border-radius: 50%;
  background: #44ffaa; animation: idle-pulse 1.4s ease-in-out infinite; flex-shrink: 0;
}
.idle-status-label { font-size: 0.65rem; font-weight: 700; color: #4dff88; text-transform: uppercase; letter-spacing: 1px; }
.idle-elapsed      { font-size: 0.65rem; color: #666; margin-left: auto; }
.idle-xp-row { display: flex; align-items: baseline; gap: 8px; }
.idle-xp-value { font-size: 0.88rem; font-weight: 800; color: #aaffcc; }
.idle-rate-pct { font-size: 0.6rem; color: #556; }
.idle-rate-track { height: 3px; background: #0a1a10; border-radius: 2px; overflow: hidden; }
.idle-rate-fill  { height: 100%; background: linear-gradient(to right, #44ffaa, #aaff44); border-radius: 2px; transition: width 2s ease; }
.idle-actions { display: flex; gap: 8px; }
.btn-collect {
  flex: 1; padding: 8px; border-radius: 6px; border: none;
  background: #1a4a2a; color: #4dff88; font-size: 0.75rem; font-weight: 700;
  cursor: pointer; transition: background 0.15s;
}
.btn-collect:hover:not(:disabled) { background: #226633; }
.btn-collect:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-stop-idle {
  padding: 8px 12px; border-radius: 6px; border: 1px solid #1a2a1a;
  background: transparent; color: #446644; font-size: 0.7rem;
  cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.btn-stop-idle:hover { color: #aaa; border-color: #444; }
.collect-result {
  background: #0a0f06; border: 1px solid #1a4411;
  border-radius: 8px; padding: 10px 12px;
  display: flex; flex-direction: column; gap: 5px;
}
.collect-xp { font-size: 0.7rem; font-weight: 700; color: #aaffcc; }
.collect-levelups { display: flex; flex-direction: column; gap: 3px; }
.levelup-row { display: flex; align-items: center; gap: 5px; font-size: 0.68rem; }
.levelup-star { color: var(--gold); }
.levelup-name { font-family: var(--font-head); font-weight: 700; }
.levelup-name.legendary { color: var(--gold-bright); }
.levelup-name.mythical  { color: #ff2244; }
.levelup-name.epic      { color: #c070ff; }
.levelup-name.rare      { color: #60b0ff; }
.levelup-name.uncommon  { color: #50ff90; }
.levelup-name.common    { color: #aaa; }
.levelup-arrow { color: var(--text-dim); font-size: 0.62rem; }
.levelup-level { font-family: var(--font-head); font-weight: 800; color: #aaff44; font-size: 0.68rem; }
.collect-pop-enter-active { animation: result-pop 0.25s ease-out; }
.collect-pop-leave-active { transition: opacity 0.4s ease; }
.collect-pop-leave-to     { opacity: 0; }
@keyframes result-pop {
  from { transform: translateY(4px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
}

/* ── Encampment section ── */
.mob-camp-header {
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--gold);
  padding: 20px 14px 8px;
  border-top: 1px solid var(--border-brown);
  margin-top: 16px;
}
.mob-camp-list {
  padding: 0 14px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.mob-camp-opt {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--border-brown);
  border-radius: 7px;
  padding: 11px 12px;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s, border-color 0.15s;
}
.mob-camp-opt:hover { background: rgba(201,162,39,0.07); border-color: var(--border-gold); }
.mob-codex-opt { border-color: rgba(120,60,180,0.3); }
.camp-opt-icon { flex-shrink: 0; }
.camp-opt-info { display: flex; flex-direction: column; gap: 1px; flex: 1; }
.camp-opt-name { font-family: var(--font-head); font-size: 0.68rem; font-weight: 700; color: var(--text-parchment); text-transform: uppercase; letter-spacing: 1px; }
.camp-opt-sub  { font-size: 0.58rem; color: var(--text-dim); line-height: 1.4; }

/* ── Accordion expand animation ── */
.mob-expand-enter-active {
  transition: max-height 0.28s ease, opacity 0.2s ease;
  max-height: 600px;
  overflow: hidden;
}
.mob-expand-leave-active {
  transition: max-height 0.2s ease, opacity 0.15s ease;
  overflow: hidden;
}
.mob-expand-enter-from {
  max-height: 0;
  opacity: 0;
}
.mob-expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* ── Sub-views (artisan / gathering) ── */
.mob-subview {
  flex: 1;
  overflow-y: auto;
}
</style>
