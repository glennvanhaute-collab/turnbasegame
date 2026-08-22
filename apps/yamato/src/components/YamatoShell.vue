<template>
  <YamatoCreationView v-if="!yamatoStore.isCreated" @done="onCreated" />

  <div class="yamato-app" v-else>
    <header class="yamato-header">
      <div class="yamato-header-inner">

        <div class="yamato-title-block">
          <span class="yamato-kanji-small">{{ yamatoStore.region?.kanji }}</span>
          <h1 class="yamato-logo">Yamato no Kuni</h1>
        </div>

        <nav class="yamato-nav">
          <button class="ynav-btn" :class="{ active: tab === 'clan' }"   @click="tab = 'clan'">Clan Hall</button>
          <button class="ynav-btn" :class="{ active: tab === 'roster' }" @click="tab = 'roster'">Roster</button>
          <button class="ynav-btn" :class="{ active: tab === 'combat' }" @click="tab = 'combat'">Combat</button>
          <button class="ynav-btn" :class="{ active: tab === 'realm' }"  @click="tab = 'realm'">Realm</button>
        </nav>

        <div class="yamato-player-badge" :style="{ '--rc': yamatoStore.region?.color }">
          <span class="ypb-kanji">{{ yamatoStore.region?.kanji }}</span>
          <div>
            <p class="ypb-name">{{ yamatoStore.playerName }}</p>
            <p class="ypb-region">{{ yamatoStore.region?.name }}</p>
          </div>
        </div>
      </div>
    </header>

    <main class="yamato-main">
      <!-- Clan Hall -->
      <div class="yamato-placeholder" v-if="tab === 'clan'">
        <span class="ph-kanji">{{ yamatoStore.region?.kanji }}</span>
        <h2 class="ph-title">{{ yamatoStore.region?.name }}</h2>
        <p class="ph-sub">{{ yamatoStore.region?.sub }}</p>
        <p class="ph-msg">The clan hall is being built. Your banner will fly here soon.</p>
      </div>

      <!-- Roster -->
      <div class="yamato-placeholder" v-else-if="tab === 'roster'">
        <span class="ph-kanji">将</span>
        <h2 class="ph-title">Your Warriors</h2>
        <p class="ph-msg">Recruit your clan's champions as you progress through the realm.</p>
      </div>

      <!-- Combat — training grounds -->
      <div class="yamato-combat" v-else-if="tab === 'combat'">
        <div class="combat-head">
          <span class="combat-kanji">練</span>
          <div>
            <h2 class="combat-title">Training Grounds</h2>
            <p class="combat-sub">Drill your vanguard against the ashen band.</p>
          </div>
        </div>

        <div class="ground-grid">
          <button
            v-for="g in TRAINING_GROUNDS"
            :key="g.id"
            class="ground-card"
            :style="{ backgroundImage: `url(${g.bg})` }"
            @click="enterGround(g)"
          >
            <div class="ground-scrim" />
            <span class="ground-kanji">{{ g.kanji }}</span>
            <div class="ground-body">
              <p class="ground-sub">{{ g.sub }} · {{ g.difficulty }}</p>
              <h3 class="ground-name">{{ g.name }}</h3>
              <p class="ground-desc">{{ g.desc }}</p>
              <div class="ground-meta">
                <span>{{ g.allies.length }} allies</span>
                <span class="ground-vs">vs</span>
                <span>{{ g.enemies.length }} enemies</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Realm -->
      <div class="yamato-realm" v-else :style="{ backgroundImage: `url(${realmMapImg})` }" />
    </main>

    <!-- Battle arena — full-screen overlay -->
    <YamatoBattleArena
      v-if="activeGround"
      :ground="activeGround"
      @back="activeGround = null"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useYamatoPlayerStore } from '../stores/useYamatoPlayerStore.js'
import YamatoCreationView from './YamatoCreationView.vue'
import YamatoBattleArena  from './YamatoBattleArena.vue'
import { TRAINING_GROUNDS } from '../game/data/trainingGrounds.js'
const realmMapImg = import.meta.env.BASE_URL + 'realm.png'

const yamatoStore  = useYamatoPlayerStore()
const tab          = ref('clan')
const activeGround = ref(null)

function onCreated() {
  tab.value = 'clan'
}

function enterGround(ground) {
  activeGround.value = ground
}
</script>

<style scoped>
.yamato-app {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #070906;
}

/* ── Header ── */
.yamato-header {
  background: linear-gradient(180deg, #0e1008 0%, #090b07 100%);
  border-bottom: 1px solid #2a3a2a;
  position: relative;
  z-index: 100;
}
.yamato-header::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, #cc443388 30%, #cc4433 50%, #cc443388 70%, transparent 100%);
  pointer-events: none;
}

.yamato-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 20px;
  height: 64px;
  padding: 0 24px;
}

.hub-btn {
  background: none;
  border: 1px solid #2a3a2a;
  border-radius: 4px;
  color: #4a5a4a;
  font-size: 1rem;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  flex-shrink: 0;
}
.hub-btn:hover { color: #cc4433; border-color: #cc443355; }

.yamato-title-block {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.yamato-kanji-small {
  font-family: 'Georgia', serif;
  font-size: 1.2rem;
  color: #cc4433;
  line-height: 1;
}
.yamato-logo {
  font-family: 'Georgia', serif;
  font-size: 0.82rem;
  font-style: italic;
  font-weight: 700;
  color: #c0b8b0;
  letter-spacing: 1px;
  white-space: nowrap;
}

/* ── Nav ── */
.yamato-nav { display: flex; gap: 0; }
.ynav-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: #3a4a3a;
  font-family: 'Georgia', serif;
  font-size: 0.72rem;
  font-style: italic;
  padding: 6px 14px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  position: relative;
  top: 1px;
}
.ynav-btn:hover  { color: #8a9a8a; border-bottom-color: #3a4a3a; }
.ynav-btn.active { color: #cc4433; border-bottom-color: #cc4433; }

/* ── Player badge ── */
.yamato-player-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #0c0e0a;
  border: 1px solid #1e2a1e;
  border-radius: 6px;
  padding: 6px 14px;
}
.ypb-kanji {
  font-family: 'Georgia', serif;
  font-size: 1.3rem;
  color: var(--rc);
  line-height: 1;
}
.ypb-name {
  font-family: 'Georgia', serif;
  font-size: 0.72rem;
  font-style: italic;
  color: #c0b8b0;
  font-weight: 600;
}
.ypb-region {
  font-size: 0.58rem;
  color: var(--rc);
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ── Main ── */
.yamato-main {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yamato-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 60px 24px;
  text-align: center;
}
.ph-kanji {
  font-family: 'Georgia', serif;
  font-size: 5rem;
  color: #1a2a1a;
  line-height: 1;
}
.ph-title {
  font-family: 'Georgia', serif;
  font-size: 1.6rem;
  font-style: italic;
  color: #5a6a5a;
}
.ph-sub {
  font-size: 0.65rem;
  color: #2a3a2a;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.ph-msg {
  font-size: 0.8rem;
  color: #3a4a3a;
  max-width: 380px;
  line-height: 1.6;
}

/* ── Combat / training grounds ── */
.yamato-combat {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 36px 24px;
  align-self: flex-start;
}
.combat-head {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 26px;
  padding-bottom: 18px;
  border-bottom: 1px solid #1e2a1e;
}
.combat-kanji {
  font-family: 'Georgia', serif;
  font-size: 3rem;
  color: #cc4433;
  line-height: 1;
  opacity: 0.85;
}
.combat-title {
  font-family: 'Georgia', serif;
  font-size: 1.5rem;
  font-style: italic;
  color: #c0b8b0;
}
.combat-sub {
  font-size: 0.75rem;
  color: #4a5a4a;
  margin-top: 4px;
}

.ground-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 18px;
}
.ground-card {
  position: relative;
  min-height: 210px;
  padding: 0;
  border: 1px solid #1e2a1e;
  border-radius: 6px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
.ground-card:hover {
  transform: translateY(-3px);
  border-color: #cc443355;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.5);
}
.ground-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(7, 9, 6, 0.35) 0%, rgba(7, 9, 6, 0.88) 55%, rgba(7, 9, 6, 0.96) 100%);
}
.ground-kanji {
  position: absolute;
  top: 12px;
  right: 16px;
  font-family: 'Georgia', serif;
  font-size: 2.4rem;
  color: #cc4433;
  opacity: 0.5;
  line-height: 1;
}
.ground-body {
  position: relative;
  padding: 16px 18px 18px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  min-height: 210px;
}
.ground-sub {
  font-size: 0.56rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #cc4433;
  opacity: 0.9;
}
.ground-name {
  font-family: 'Georgia', serif;
  font-size: 1.25rem;
  font-style: italic;
  color: #ded5c8;
  margin-top: 4px;
}
.ground-desc {
  font-size: 0.72rem;
  color: #7a8a7a;
  line-height: 1.5;
  margin-top: 6px;
}
.ground-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 0.62rem;
  color: #5a6a5a;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.ground-vs { color: #cc4433; font-style: italic; }

/* ── Realm map ── */
.yamato-realm {
  width: 100%;
  height: calc(100vh - 64px);
  background-size: cover;
  background-position: center;
}
</style>
