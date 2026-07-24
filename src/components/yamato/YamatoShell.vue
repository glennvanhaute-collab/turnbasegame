<template>
  <YamatoCreationView v-if="!yamatoStore.isCreated" @done="onCreated" />

  <div class="yamato-app" v-else>
    <header class="yamato-header">
      <div class="yamato-header-inner">
        <button class="hub-btn" @click="worldStore.exitWorld()" title="Return to world select">⟵</button>

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

      <!-- Combat -->
      <div class="yamato-placeholder" v-else-if="tab === 'combat'">
        <span class="ph-kanji">戦</span>
        <h2 class="ph-title">Combat</h2>
        <p class="ph-msg">The battlefield awaits. Zones and encounters are being prepared.</p>
      </div>

      <!-- Realm -->
      <div class="yamato-realm" v-else :style="{ backgroundImage: `url(${realmMapImg})` }" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWorldStore } from '../../stores/useWorldStore.js'
import { useYamatoPlayerStore } from '../../stores/useYamatoPlayerStore.js'
import YamatoCreationView from './YamatoCreationView.vue'
const realmMapImg = import.meta.env.BASE_URL + 'yamato/realm.png'

const worldStore  = useWorldStore()
const yamatoStore = useYamatoPlayerStore()
const tab         = ref('clan')

function onCreated() {
  tab.value = 'clan'
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

/* ── Realm map ── */
.yamato-realm {
  height: calc(100vh - 64px);
  background-size: cover;
  background-position: center;
}
</style>
