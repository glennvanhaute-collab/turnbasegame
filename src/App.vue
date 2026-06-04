<template>
  <!-- First-run: create your character -->
  <HeroCreationView v-if="!playerHeroStore.isCreated" @done="onHeroCreated" />

  <!-- Main app -->
  <div class="app" v-else>
    <header class="app-header">
      <div class="app-header-bg" :style="{ backgroundImage: `url(${navBg})` }" />
      <div class="header-inner">
        <img :src="logoNav" class="logo-img" alt="" @click="view = 'campaign'" style="cursor:pointer" />
        <h1 class="logo" @click="view = 'campaign'" style="cursor:pointer">Bannerlords of Westrun</h1>
        <nav class="nav">
          <button class="nav-btn" :class="{ active: view === 'campaign' }" @click="view = 'campaign'">Home</button>
          <button class="nav-btn" :class="{ active: view === 'summon' }" @click="view = 'summon'">Recruit</button>
          <button class="nav-btn" :class="{ active: view === 'gear' }" @click="view = 'gear'">Arsenal</button>
          <button class="nav-btn" :class="{ active: view === 'dungeon' }" @click="view = 'dungeon'">Expeditions</button>
          <button class="nav-btn" :class="{ active: view === 'realm' }" @click="view = 'realm'">Realm</button>
        </nav>
        <div class="currency-display">
          <span class="currency energy" title="Energy (1 per 3 min)">
            <span class="currency-icon">⚡</span>
            {{ energyStore.energy }}/{{ energyStore.maxEnergy }}
          </span>
          <span class="currency gold" title="Gold">
            <span class="currency-icon">🪙</span>
            {{ currencyStore.gold.toLocaleString() }}
          </span>
          <span class="currency diamonds" title="Buy items with Diamonds" style="cursor:pointer" @click="showShop = true">
            <span class="currency-icon">💎</span>
            {{ currencyStore.diamonds.toLocaleString() }}
          </span>
          <button class="icon-btn" @click="toggleMute" :title="muted ? 'Unmute' : 'Mute'">{{ muted ? '🔇' : '🔊' }}</button>
        </div>
      </div>
    </header>

    <DiamondShopModal v-if="showShop"  @close="showShop = false" />
    <CodexModal        v-if="showCodex" @close="showCodex = false" />
    <AdvisorMessage />
    <DevMenu v-if="$isDev" />

    <!-- Floating Codex button — hidden on home, available everywhere else -->
    <button class="codex-fab" v-if="view !== 'campaign'" @click="showCodex = true" title="Open Codex">
      <img :src="codexIcon" class="codex-fab-icon" alt="Codex" />
    </button>

    <!-- Collection modal — floats over the homepage map -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showCollection">
          <div class="coll-modal-backdrop" @click="showCollection = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showCollection = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <CollectionView @back="showCollection = false" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Blacksmith modal — floats over the homepage map -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showBlacksmith">
          <div class="coll-modal-backdrop" @click="showBlacksmith = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showBlacksmith = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <BlacksmithView />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Battle modal — floats over whatever view is active -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap battle-modal-wrap" v-if="showBattle">
          <div class="coll-modal-backdrop" @click="showBattle = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showBattle = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <BattleArena @back="showBattle = false" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <main>
      <HomeView
        v-if="view === 'campaign'"
        @start-battle="startBattle"
        @open-collection="showCollection = true"
        @open-blacksmith="showBlacksmith = true"
        @open-codex="showCodex = true"
      />
      <SummonView v-else-if="view === 'summon'" />
      <div v-else-if="view === 'gear'" class="gear-view arsenal-view" :style="{ '--arsenal-bg': `url(${arsenalBg})` }">
        <div class="gear-tabs">
          <button class="gear-tab" :class="{ active: gearTab === 'inventory' }" @click="gearTab = 'inventory'">Inventory</button>
          <button class="gear-tab" :class="{ active: gearTab === 'equipment' }" @click="gearTab = 'equipment'">Equipment</button>
          <button class="gear-tab" :class="{ active: gearTab === 'forge' }" @click="gearTab = 'forge'">
            Forge
            <span class="relic-pip" v-if="forgeStore.totalOrbs > 0">{{ forgeStore.totalOrbs }}</span>
          </button>
          <button class="gear-tab gear-tab--relics" :class="{ active: gearTab === 'relics' }" @click="gearTab = 'relics'">
            Relics
            <span class="relic-pip" v-if="inventoryStore.soulVessels > 0">{{ inventoryStore.soulVessels }}</span>
          </button>
        </div>
        <InventoryView v-if="gearTab === 'inventory'" />
        <EquipmentView v-else-if="gearTab === 'equipment'" />
        <ForgeView v-else-if="gearTab === 'forge'" />
        <RelicsView v-else />
      </div>
      <div v-else-if="view === 'dungeon'" class="gear-view">
        <div class="gear-tabs">
          <button class="gear-tab" :class="{ active: expTab === 'dungeons' }" @click="expTab = 'dungeons'">Dungeons</button>
          <button class="gear-tab" :class="{ active: expTab === 'exploration' }" @click="expTab = 'exploration'">Exploration</button>
          <button class="gear-tab" :class="{ active: expTab === 'raids' }" @click="expTab = 'raids'">Raids</button>
          <button class="gear-tab" :class="{ active: expTab === 'sieges' }" @click="expTab = 'sieges'">Sieges</button>
        </div>
        <DungeonView v-if="expTab === 'dungeons'" @enter-dungeon="startDungeonBattle" />
        <RaidsView v-else-if="expTab === 'raids'" />
        <SiegesView v-else-if="expTab === 'sieges'" />
        <ExplorationView v-else />
      </div>
      <RealmView v-else-if="view === 'realm'" />
    </main>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useMusic } from './composables/useMusic.js'
import { useSmeltingTick } from './composables/useSmeltingTick.js'
import logoNav from './assets/ui/logo-nav.png'
import { useBattleStore } from './stores/useBattleStore.js'
import { useCollectionStore } from './stores/useCollectionStore.js'
import { useCurrencyStore } from './stores/useCurrencyStore.js'
import { useEnergyStore } from './stores/useEnergyStore.js'
import { usePlayerHeroStore } from './stores/usePlayerHeroStore.js'
import { useInventoryStore } from './stores/useInventoryStore.js'
import { useForgeStore } from './stores/useForgeStore.js'
import { ENCOUNTERS } from './game/data/heroes.js'
import StarterPickView from './components/StarterPickView.vue'
import HeroCreationView from './components/HeroCreationView.vue'
import HomeView from './components/HomeView.vue'
import CollectionView from './components/CollectionView.vue'
import BlacksmithView from './components/BlacksmithView.vue'
import InventoryView from './components/InventoryView.vue'
import EquipmentView from './components/EquipmentView.vue'
import SummonView from './components/SummonView.vue'
import BattleArena from './components/BattleArena.vue'
import DungeonView from './components/DungeonView.vue'
import RaidsView from './components/RaidsView.vue'
import SiegesView from './components/SiegesView.vue'
import ExplorationView from './components/ExplorationView.vue'
import RealmView from './components/RealmView.vue'
import RelicsView from './components/RelicsView.vue'
import ForgeView from './components/ForgeView.vue'
import DiamondShopModal from './components/DiamondShopModal.vue'
import CampView from './components/CampView.vue'
import CodexModal from './components/CodexModal.vue'
import AdvisorMessage from './components/AdvisorMessage.vue'
import DevMenu from './components/DevMenu.vue'
import arsenalBg from './assets/backgrounds/arsenal.png'
import navBg from './assets/backgrounds/bg_nav.png'
import codexIcon from './assets/ui/codex.png'
import closeImg from './assets/ui/close.png'
import { useAdvisorStore } from './stores/useAdvisorStore.js'
import { buildDungeonEncounter } from './game/data/dungeons.js'

const view       = ref('campaign')
const gearTab    = ref('inventory')
const expTab     = ref('dungeons')
const showShop   = ref(false)
const showCodex  = ref(false)
const showCollection  = ref(false)
const showBlacksmith  = ref(false)
const showBattle      = ref(false)

const { muted, toggleMute, onViewChange, startOnFirstInteraction } = useMusic()
useSmeltingTick()

watch(view, (v) => {
  if (v !== 'campaign') showCollection.value = false
  if (v !== 'campaign') showBlacksmith.value = false
  onViewChange(v)
})

function handleEscape(e) {
  if (e.key !== 'Escape') return
  if (showBattle.value)     { showBattle.value = false; return }
  if (showCollection.value) { showCollection.value = false; return }
  if (showBlacksmith.value) { showBlacksmith.value = false; return }
  if (showCodex.value)      { showCodex.value = false; return }
  if (showShop.value)       { showShop.value = false; return }
}

onMounted(() => {
  startOnFirstInteraction()
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => window.removeEventListener('keydown', handleEscape))

const advisorStore = useAdvisorStore()
const battleStore = useBattleStore()
const collectionStore = useCollectionStore()
const playerHeroStore = usePlayerHeroStore()
const currencyStore = useCurrencyStore()
const energyStore = useEnergyStore()
const inventoryStore = useInventoryStore()
const forgeStore = useForgeStore()

function onHeroCreated() {
  view.value = 'collection'
  setTimeout(() => {
    advisorStore.say(
      `Welcome to Westrun, ${playerHeroStore.heroName}. I am Edwyn — chronicler, archivist, and apparently your keeper. ` +
      `Your collection holds your champions. Assemble a team of five and seek out the Training grounds when you are ready. ` +
      `The book in the corner is your Codex. Write in it. You will want to remember this.`
    )
  }, 800)
}

function startBattle(encounterIndex) {
  const team = collectionStore.buildTeam()
  battleStore.initBattle(encounterIndex, team)
  showBattle.value = true
}

function startDungeonBattle(dungeon) {
  const team = collectionStore.buildTeam()
  const encounter = buildDungeonEncounter(dungeon)
  battleStore.initBattle(encounter, team)
  showBattle.value = true
}
</script>

<style>
:root {
  --gold:          #c9a227;
  --gold-bright:   #ffd700;
  --gold-dim:      #7a5228;
  --gold-faint:    #2e1c08;
  --bg-deep:       #070503;
  --bg-dark:       #0e0905;
  --bg-panel:      #160f08;
  --bg-card:       #1c1208;
  --border-brown:  #3a1e0a;
  --border-gold:   #5c3a14;
  --text-gold:     #c9a227;
  --text-parchment:#c4a882;
  --text-muted:    #6b5440;
  --text-dim:      #3e2a18;
  --font-head:     'Cinzel', 'Georgia', serif;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: var(--bg-deep);
  background-image: radial-gradient(ellipse at 50% 0%, #1a0e06 0%, #070503 55%);
  color: var(--text-parchment);
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
}

/* Global scrollbar — dark parchment theme */
* {
  scrollbar-width: thin;
  scrollbar-color: #3e1c0c transparent;
}
*::-webkit-scrollbar       { width: 5px; height: 5px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: #3e1c0c; border-radius: 3px; }
*::-webkit-scrollbar-thumb:hover { background: #5c2810; }
</style>

<style scoped>
.app-header {
  background: linear-gradient(180deg, #1c1008 0%, #110a05 100%);
  border-bottom: 1px solid var(--border-gold);
  margin-bottom: 0;
  position: relative;
  overflow: visible;
  z-index: 100;
}
.app-header-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center center;
  opacity: 0.35;
  pointer-events: none;
  z-index: 0;
}
.header-inner { position: relative; z-index: 1; }
.app-header::after {
  content: '';
  position: absolute;
  bottom: -3px; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--gold-dim) 20%, var(--gold) 50%, var(--gold-dim) 80%, transparent 100%);
  pointer-events: none;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 24px;
  height: 64px;
  padding: 0 24px 0 72px;
  position: relative;
}

.logo-img {
  height: 88px;
  width: auto;
  flex-shrink: 0;
  position: absolute;
  z-index: 11;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.9));
  margin-top: 6px;
  left: -27px;
  top: -10px;
}

.logo {
  font-family: var(--font-head);
  font-size: 0.78rem;
  color: var(--gold);
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
  text-shadow: 0 0 12px rgba(201,162,39,0.3);
}

.nav { display: flex; gap: 0; }

.nav-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 13px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  position: relative;
  top: 1px;
}
.nav-btn:hover:not(:disabled) { color: var(--text-parchment); border-bottom-color: var(--gold-dim); }
.nav-btn.active { color: var(--gold); border-bottom-color: var(--gold); }
.nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }

.currency-display {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: center;
}
.currency {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--font-head);
  background: var(--bg-panel);
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  padding: 4px 10px;
  letter-spacing: 0.5px;
}
.currency.energy   { color: #aaff44; border-color: #2a3a0055; }
.currency.gold     { color: var(--gold); border-color: var(--gold-faint); }
.currency.diamonds { color: #88ccff; border-color: #0a204055; }
.currency-icon     { font-size: 0.82rem; }

.codex-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 150;
  background: transparent;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  box-shadow: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}
.codex-fab-icon {
  width: 96px;
  height: 96px;
  object-fit: contain;
  display: block;
}
.codex-fab:hover {
  transform: scale(1.06);
  opacity: 0.85;
}

.icon-btn {
  background: var(--bg-panel);
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  color: var(--text-muted);
  font-size: 0.85rem;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  flex-shrink: 0;
}
.icon-btn:hover { color: var(--gold); border-color: var(--gold-dim); }

/* ── Collection modal overlay ── */
.coll-modal-wrap {
  position: fixed;
  inset: 0;
  top: 64px;
  z-index: 80;
}
.coll-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(4, 2, 1, 0.45);
  backdrop-filter: blur(2px);
  cursor: pointer;
}
.coll-modal-panel {
  position: absolute;
  top: 35px;
  left: 35px;
  right: 35px;
  bottom: 35px;
  overflow-y: auto;
  padding-top: 48px;
  isolation: isolate;
  background: rgba(10, 5, 2, 0.97);
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  box-shadow: 0 8px 48px rgba(0,0,0,0.85), 0 0 0 1px rgba(201,162,39,0.08);
}
.coll-modal-close {
  position: absolute;
  top: 8px;
  right: 10px;
  z-index: 10;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.15s;
}
.coll-modal-close-icon {
  width: 36px;
  height: 36px;
  display: block;
  object-fit: contain;
}
.coll-modal-close:hover {
  transform: scale(1.1);
}
.coll-modal-close:hover .coll-modal-close-icon {
  filter: drop-shadow(0 0 6px rgba(201,140,40,0.7)) drop-shadow(0 0 14px rgba(180,100,20,0.4));
}

.coll-modal-enter-active { transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1); }
.coll-modal-leave-active { transition: opacity 0.18s ease, transform 0.18s ease-in; }
.coll-modal-enter-from   { opacity: 0; transform: translateY(24px); }
.coll-modal-leave-to     { opacity: 0; transform: translateY(16px); }

.gear-view { display: flex; flex-direction: column; }
.arsenal-view {
  position: relative;
  min-height: calc(100vh - 92px);
}
.arsenal-view::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: var(--arsenal-bg);
  background-size: cover;
  background-position: center center;
  opacity: 0.12;
  pointer-events: none;
  z-index: 0;
}
.arsenal-view > * { position: relative; z-index: 1; }

.gear-tabs {
  display: flex;
  gap: 4px;
  padding: 16px 24px 0;
  max-width: 1200px;
  margin: 0 auto 8px;
}
.gear-tab {
  background: var(--bg-panel);
  border: 1px solid var(--border-brown);
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  color: var(--text-muted);
  font-family: var(--font-head);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 6px 20px;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.gear-tab:hover  { color: var(--text-parchment); background: var(--bg-card); }
.gear-tab.active { color: var(--gold); background: var(--bg-card); border-color: var(--border-gold); }
.gear-tab--relics { display: flex; align-items: center; gap: 6px; }
.relic-pip {
  background: #3a1a6a;
  color: #aa77ff;
  border: 1px solid #6622cc55;
  border-radius: 10px;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0px 5px;
  line-height: 1.5;
}
</style>
