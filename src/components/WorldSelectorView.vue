<template>
  <div class="world-selector">
    <div class="selector-bg" />

    <div class="selector-header">
      <p class="selector-sub">Choose your realm</p>
    </div>

    <div class="worlds-row">
      <!-- Westrun -->
      <button class="world-card westrun-card" @click="enter('westrun')">
        <div class="world-card-bg westrun-bg" />
        <div class="world-card-inner">
          <div class="world-badge westrun-badge">I</div>
          <h2 class="world-name westrun-name">Bannerlords<br>of Westrun</h2>
          <p class="world-tagline">A hedge knight seeks balance<br>in a fractured realm.</p>
          <div class="world-meta">
            <span class="world-affinity">Force · Magic · Spirit · Void</span>
          </div>
          <div class="world-status" v-if="westrunStarted">
            <span class="status-pip active" />
            Continue
          </div>
          <div class="world-status" v-else>
            <span class="status-pip" />
            Begin
          </div>
          <div class="world-enter">Enter Westrun</div>
        </div>
      </button>

      <div class="worlds-divider">
        <div class="divider-line" />
        <span class="divider-symbol">⬡</span>
        <div class="divider-line" />
      </div>

      <!-- Yamato no Kuni -->
      <button class="world-card yamato-card" @click="enter('yamato')">
        <div class="world-card-bg yamato-bg" />
        <div class="world-card-inner yamato-card-inner">
          <img :src="yamatoLogoImg" class="yamato-logo-img" alt="Yamato no Kuni" />
          <p class="world-tagline yamato-tagline">Put your clan on the map.</p>
          <div class="world-meta">
            <span class="world-affinity yamato-affinity">Seiryōzan · Kazanbi · Sakuragawa · Heianjo</span>
          </div>
          <div class="world-status" v-if="yamatoStarted">
            <span class="status-pip active yamato-pip" />
            Continue
          </div>
          <div class="world-status" v-else>
            <span class="status-pip yamato-pip-off" />
            Begin
          </div>
          <div class="world-enter yamato-enter">大和へ入る</div>
        </div>
      </button>
    </div>

    <p class="selector-footer">
      Progress in each realm is independent. The void awaits those who master both.
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWorldStore } from '../stores/useWorldStore.js'
import { usePlayerHeroStore } from '../stores/usePlayerHeroStore.js'
import { useYamatoPlayerStore } from '../stores/useYamatoPlayerStore.js'
import yamatoLogoImg from '../assets/yamato/ui/logo_yamato.png'

const worldStore       = useWorldStore()
const playerHeroStore  = usePlayerHeroStore()
const yamatoStore      = useYamatoPlayerStore()

const westrunStarted = computed(() => playerHeroStore.isCreated)
const yamatoStarted  = computed(() => yamatoStore.isCreated)

function enter(world) {
  worldStore.enterWorld(world)
}
</script>

<style scoped>
.world-selector {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

.selector-bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 50%, #1a0a02 0%, transparent 60%),
    radial-gradient(ellipse at 70% 50%, #0a0c0a 0%, transparent 60%),
    #080604;
  z-index: 0;
}

.selector-header {
  text-align: center;
  position: relative;
  z-index: 1;
}

.selector-sub {
  font-family: var(--font-head);
  font-size: 0.72rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--text-muted);
}

.worlds-row {
  display: flex;
  align-items: stretch;
  gap: 0;
  max-width: 900px;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* ── World card ── */
.world-card {
  flex: 1;
  min-height: 480px;
  position: relative;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
  padding: 0;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
}
.world-card:hover { transform: translateY(-4px); }

.world-card-bg {
  position: absolute;
  inset: 0;
  transition: opacity 0.3s;
}
.world-card:hover .world-card-bg { opacity: 1 !important; }

.westrun-bg {
  background:
    linear-gradient(160deg, #1e0c04 0%, #0e0804 40%, #160a04 100%);
  border: 1px solid #3a1e0a;
  border-radius: 12px 0 0 12px;
  opacity: 0.9;
}
.westrun-card:hover .westrun-bg {
  border-color: #c9a22755;
  box-shadow: inset 0 0 60px rgba(201,162,39,0.05), 0 0 40px rgba(201,162,39,0.08);
}

.yamato-bg {
  background:
    linear-gradient(160deg, #0c0e0a 0%, #060806 40%, #0e100a 100%);
  border: 1px solid #1e2a1e;
  border-left: none;
  border-radius: 0 12px 12px 0;
  opacity: 0.9;
}
.yamato-card:hover .yamato-bg {
  border-color: #cc333355;
  box-shadow: inset 0 0 60px rgba(180,40,40,0.05), 0 0 40px rgba(180,40,40,0.08);
}

.world-card-inner {
  position: relative;
  z-index: 1;
  padding: 48px 36px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

/* ── Badge ── */
.world-badge {
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 3px;
  display: inline-block;
  align-self: flex-start;
}
.westrun-badge {
  background: #1e0c04;
  color: var(--gold);
  border: 1px solid #3a1e0a;
}
.yamato-badge {
  background: #0c0e0a;
  color: #cc5544;
  border: 1px solid #2a1a1a;
  font-family: 'Georgia', serif;
  font-size: 0.85rem;
  letter-spacing: 1px;
}

/* ── Name ── */
.world-name {
  font-family: var(--font-head);
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 1px;
}
.westrun-name { color: #f0deb4; }
.yamato-name {
  color: #e8ddd0;
  font-family: 'Georgia', serif;
  font-style: italic;
}

/* ── Tagline ── */
.world-tagline {
  font-size: 0.78rem;
  line-height: 1.7;
  color: var(--text-muted);
}
.yamato-card .world-tagline {
  color: #7a8a7a;
}

/* ── Meta ── */
.world-meta { margin-top: auto; }
.world-affinity {
  font-size: 0.6rem;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #4a3020;
  font-family: var(--font-head);
}
.yamato-affinity { color: #2a3a2a; }

/* ── Status ── */
.world-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-head);
  font-size: 0.65rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--text-muted);
}
.status-pip {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #2a1a0a;
  border: 1px solid #3a2a1a;
  display: inline-block;
}
.status-pip.active { background: #4dcc77; border-color: #2a8844; box-shadow: 0 0 6px #4dcc7777; }
.yamato-pip-off { background: #1a1e1a; border-color: #2a2e2a; }
.yamato-pip { background: #cc4433; border-color: #882211; box-shadow: 0 0 6px #cc443377; }

/* ── Enter CTA ── */
.world-enter {
  font-family: var(--font-head);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #4a3828;
  transition: color 0.2s;
  margin-top: 8px;
}
.westrun-card:hover .world-enter { color: var(--gold); }
.yamato-enter { color: #2a3a2a; font-style: normal; }
.yamato-card:hover .yamato-enter  { color: #cc5544; }

.yamato-card-inner { align-items: center; text-align: center; }
.yamato-logo-img {
  width: 220px;
  height: 220px;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), filter 0.3s;
  filter: brightness(0.8) saturate(0.85);
}
.yamato-card:hover .yamato-logo-img {
  transform: scale(1.04);
  filter: brightness(1) saturate(1.1);
}
.yamato-tagline { color: #7a8a7a; }
.yamato-card .world-meta { margin-top: 0; }

/* ── Divider ── */
.worlds-divider {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 2px;
  gap: 12px;
  z-index: 2;
}
.divider-line {
  flex: 1;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #2a1e1288, transparent);
}
.divider-symbol {
  font-size: 1rem;
  color: #2a1e12;
}

/* ── Footer ── */
.selector-footer {
  font-size: 0.62rem;
  color: #2a2218;
  letter-spacing: 1px;
  text-align: center;
  font-family: var(--font-head);
  position: relative;
  z-index: 1;
}

@media (max-width: 640px) {
  .worlds-row { flex-direction: column; }
  .westrun-bg { border-radius: 12px 12px 0 0; }
  .yamato-bg  { border-left: 1px solid #1e2a1e; border-top: none; border-radius: 0 0 12px 12px; }
  .worlds-divider { flex-direction: row; padding: 2px 0; }
  .divider-line { flex: 1; width: auto; height: 1px; background: linear-gradient(to right, transparent, #2a1e1288, transparent); }
  .world-card { min-height: 260px; }
  .world-name { font-size: 1.4rem; }
}
</style>
