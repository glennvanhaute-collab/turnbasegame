<template>
  <!-- First-run: create your character -->
  <HeroCreationView v-if="!playerHeroStore.isCreated" @done="onHeroCreated" />

  <!-- Main app -->
  <div class="app" v-else>
    <header class="app-header">
      <div class="app-header-bg" :style="{ backgroundImage: `url(${navBg})` }" />
      <div class="header-inner">
        <img :src="navLogo" class="logo-img" alt="" @click="navigate('campaign')" style="cursor:pointer" />
        <h1 class="logo" @click="navigate('campaign')" style="cursor:pointer">Bannerlords of Westrun</h1>
        <nav class="nav">
          <button class="nav-btn" :class="{ active: view === 'campaign' }" @click="navigate('campaign')">Home</button>
          <button class="nav-btn" :class="{ active: view === 'summon' }" @click="navigate('summon')">Recruit</button>
          <button class="nav-btn" :class="{ active: view === 'gear' }" @click="navigate('gear')">Arsenal</button>
          <button class="nav-btn" :class="{ active: view === 'dungeon' }" @click="navigate('dungeon')">Expeditions</button>
          <button class="nav-btn" :class="{ active: view === 'sieges' }" @click="navigate('sieges')">Sieges</button>
          <button class="nav-btn" :class="{ active: view === 'camp' }" @click="navigate('camp')">Stronghold</button>
          <button class="nav-btn" :class="{ active: view === 'realm' }" @click="navigate('realm')">Realm</button>
          <button class="nav-btn nav-icon-btn" :class="{ active: showCollection }" @click="showCollection = true" title="Hero Collection">
            <img :src="collectionIcon" class="nav-icon-img" alt="Collection" />
          </button>
        </nav>
        <div class="currency-display">
          <span class="currency energy" title="Energy (1 per 3 min)">
            <GameIcon icon="energy" :size="16" class="currency-icon" />
            {{ energyStore.energy }}/{{ energyStore.maxEnergy }}
          </span>
          <span class="currency gold" title="Gold">
            <GameIcon icon="gold" :size="16" class="currency-icon" />
            {{ currencyStore.gold.toLocaleString() }}
          </span>
          <span class="currency diamonds" title="Buy items with Diamonds" style="cursor:pointer" @click="showShop = true">
            <GameIcon icon="diamond" :size="16" class="currency-icon" />
            {{ currencyStore.diamonds.toLocaleString() }}
          </span>
          <button class="icon-btn" @click="toggleMute" :title="muted ? 'Unmute' : 'Mute'">
            <GameIcon :icon="muted ? 'mute' : 'unmute'" :size="18" />
          </button>
          <button class="icon-btn" @click="exportProgression" title="Export save file">⬇</button>
          <button class="icon-btn" @click="$refs.importInput.click()" title="Import save file">⬆</button>
          <input ref="importInput" type="file" accept=".json" style="display:none" @change="importProgression" />
          <SettingsPanel />
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

    <!-- Leatherworking modal — floats over the homepage map -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showLeatherworking">
          <div class="coll-modal-backdrop" @click="showLeatherworking = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showLeatherworking = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <LeatherworkingView />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Tailoring modal — floats over the homepage map -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showTailoring">
          <div class="coll-modal-backdrop" @click="showTailoring = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showTailoring = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <TailoringView />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Woodworking modal — floats over the homepage map -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showWoodworking">
          <div class="coll-modal-backdrop" @click="showWoodworking = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showWoodworking = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <WoodworkingView />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Fusion Workshop modal -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showFusionWorkshop">
          <div class="coll-modal-backdrop" @click="showFusionWorkshop = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showFusionWorkshop = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <FusionWorkshopView />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Market modal — floats over the homepage map -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showMarket">
          <div class="coll-modal-backdrop" @click="showMarket = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showMarket = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <MarketView />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Battle modal — floats over whatever view is active -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap battle-modal-wrap" v-if="showBattle">
          <div class="coll-modal-backdrop" @click="showBattle = false" />
          <div class="coll-modal-panel battle-modal-panel">
            <button class="coll-modal-close" @click="showBattle = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <BattleArena @back="showBattle = false" />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Raid battle — true full-screen, no modal chrome -->
    <Teleport to="body">
      <Transition name="raid-enter">
        <RaidBattleArena
          v-if="showRaidBattle && activeRaidId"
          :raidId="activeRaidId"
          :autoComplete="isAutoRaid"
          @back="showRaidBattle = false; isAutoRaid = false"
        />
      </Transition>
    </Teleport>

    <main>
      <HomeView
        v-if="view === 'campaign'"
        @start-battle="startBattle"
        @open-collection="showCollection = true"
        @open-blacksmith="showBlacksmith = true"
        @open-leatherworking="showLeatherworking = true"
        @open-tailoring="showTailoring = true"
        @open-woodworking="showWoodworking = true"
        @open-fusion-workshop="showFusionWorkshop = true"
        @open-market="showMarket = true"
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
      <div v-else-if="view === 'dungeon'" class="gear-view exploration-view" :style="{ '--exploration-bg': `url(${explorationBg})` }">
        <div class="gear-tabs">
          <button class="gear-tab" :class="{ active: expTab === 'dungeons' }" @click="expTab = 'dungeons'">Dungeons</button>
          <button class="gear-tab" :class="{ active: expTab === 'explore' }" @click="expTab = 'explore'">Explore</button>
          <button class="gear-tab" :class="{ active: expTab === 'raids' }" @click="expTab = 'raids'">Raids</button>
        </div>
        <DungeonView v-if="expTab === 'dungeons'" @enter-dungeon="startDungeonBattle" />
        <ExploreView v-else-if="expTab === 'explore'" @enter-dungeon="startDungeonBattle" />
        <RaidsView v-else-if="expTab === 'raids'" @enter-raid="startRaidBattle" @auto-raid="startAutoRaid" />
        <ExplorationView v-else />
      </div>
      <SiegesView v-else-if="view === 'sieges'" />
      <CampView v-else-if="view === 'camp'" @open-fusion-workshop="showFusionWorkshop = true" />
      <RealmView v-else-if="view === 'realm'" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMusic } from './composables/useMusic.js'
import { playBattleForTeam, playMain } from './game/music.js'
import { useSmeltingTick } from './composables/useSmeltingTick.js'
import { useTanningTick }  from './composables/useTanningTick.js'
import { useWeavingTick }  from './composables/useWeavingTick.js'
import logoNav from './assets/ui/logo-nav.png'
import shieldAldric  from './assets/lore/house_aldric.png'
import shieldValdris from './assets/lore/house_valdris.png'
import shieldCaelwyn from './assets/lore/house_caelwyn.png'
import shieldMordaine from './assets/lore/house_mordaine.png'
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
import LeatherworkingView from './components/LeatherworkingView.vue'
import TailoringView from './components/TailoringView.vue'
import WoodworkingView from './components/WoodworkingView.vue'
import FusionWorkshopView from './components/FusionWorkshopView.vue'
import MarketView from './components/MarketView.vue'
import InventoryView from './components/InventoryView.vue'
import EquipmentView from './components/EquipmentView.vue'
import SummonView from './components/SummonView.vue'
import BattleArena from './components/BattleArena.vue'
import DungeonView from './components/DungeonView.vue'
import ExploreView from './components/ExploreView.vue'
import RaidsView from './components/RaidsView.vue'
import RaidBattleArena from './components/RaidBattleArena.vue'
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
import SettingsPanel from './components/SettingsPanel.vue'
import arsenalBg     from './assets/backgrounds/arsenal.png'
import explorationBg from './assets/backgrounds/exploration_bg.png'
import navBg from './assets/backgrounds/bg_nav.png'
import codexIcon        from './assets/ui/codex.png'
import collectionIcon  from './assets/ui/collection-icon.png'
import closeImg from './assets/ui/close.png'
import GameIcon from './components/ui/GameIcon.vue'
import { useAdvisorStore } from './stores/useAdvisorStore.js'
import { useSettingsStore } from './stores/useSettingsStore.js'
import { buildDungeonEncounter } from './game/data/dungeons.js'

const view       = ref('campaign')
const gearTab    = ref('inventory')
const expTab     = ref('dungeons')
const showShop        = ref(false)
const showCodex       = ref(false)
const showCollection  = ref(false)
const showBlacksmith      = ref(false)
const showLeatherworking  = ref(false)
const showTailoring       = ref(false)
const showWoodworking     = ref(false)
const showFusionWorkshop  = ref(false)
const showMarket          = ref(false)
const showBattle      = ref(false)
const showRaidBattle  = ref(false)
const activeRaidId    = ref(null)

function closeAllPanels() {
  showCollection.value      = false
  showBlacksmith.value      = false
  showLeatherworking.value  = false
  showTailoring.value       = false
  showWoodworking.value     = false
  showMarket.value          = false
  showBattle.value          = false
  showRaidBattle.value      = false
  showShop.value            = false
  showCodex.value           = false
}

const isAutoRaid = ref(false)

function startRaidBattle(raidId) {
  isAutoRaid.value     = false
  activeRaidId.value   = raidId
  showRaidBattle.value = true
}

function startAutoRaid(raidId) {
  isAutoRaid.value     = true
  activeRaidId.value   = raidId
  showRaidBattle.value = true
}

function navigate(newView) {
  closeAllPanels()
  view.value = newView
}

const { muted, toggleMute, onViewChange, startOnFirstInteraction } = useMusic()
useSmeltingTick()
useTanningTick()
useWeavingTick()
const settings = useSettingsStore()

const SHIELD_IMAGES = { aldric: shieldAldric, valdris: shieldValdris, caelwyn: shieldCaelwyn, mordaine: shieldMordaine }
const navLogo = computed(() => SHIELD_IMAGES[settings.theme] ?? logoNav)

watch(view, (v) => { onViewChange(v) })

function handleEscape(e) {
  if (e.key !== 'Escape') return
  if (showRaidBattle.value) { showRaidBattle.value = false; return }
  if (showBattle.value)     { showBattle.value = false; return }
  if (showCollection.value) { showCollection.value = false; return }
  if (showBlacksmith.value)     { showBlacksmith.value = false; return }
  if (showLeatherworking.value) { showLeatherworking.value = false; return }
  if (showTailoring.value)      { showTailoring.value = false; return }
  if (showWoodworking.value)    { showWoodworking.value = false; return }
  if (showMarket.value)         { showMarket.value = false; return }
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

const isGameKey = (key) =>
  key.startsWith('raid-') || key.startsWith('player-') || key.startsWith('battle-')

function exportProgression() {
  const data = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (isGameKey(key)) data[key] = localStorage.getItem(key)
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `westrun-save.json`
  a.click()
  URL.revokeObjectURL(url)
}

function importProgression(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result)
      // Only wipe and restore game keys — leave unrelated localStorage untouched
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i)
        if (isGameKey(key)) localStorage.removeItem(key)
      }
      for (const [key, value] of Object.entries(data)) {
        if (isGameKey(key)) localStorage.setItem(key, value)
      }
      location.reload()
    } catch {
      alert('Invalid save file — could not import.')
    }
  }
  reader.readAsText(file)
  e.target.value = ''
}

function onHeroCreated() {
  view.value = 'campaign'
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
  playBattleForTeam(team.map(h => h.id))
  showBattle.value = true
}

function startDungeonBattle(dungeon) {
  const team = collectionStore.buildTeam()
  const encounter = buildDungeonEncounter(dungeon)
  if (dungeon.batchCount > 1) battleStore.setupBatch(dungeon.batchCount)
  battleStore.initBattle(encounter, team)
  playBattleForTeam(team.map(h => h.id))
  if (!battleStore.autoplay) battleStore.toggleAutoplay()
  showBattle.value = true
}

watch(showBattle, v => { if (!v) playMain() })
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

.nav-icon-btn { padding: 4px 8px; border-bottom: 2px solid transparent; }
.nav-icon-btn:hover { border-bottom-color: var(--gold-dim); }
.nav-icon-btn.active { border-bottom-color: var(--gold); }
.nav-icon-img { width: 35px; height: 35px; object-fit: contain; display: block; filter: brightness(0.75) sepia(0.3); transition: filter 0.15s; }
.nav-icon-btn:hover .nav-icon-img { filter: brightness(1) sepia(0.1); }
.nav-icon-btn.active .nav-icon-img { filter: brightness(1.1) sepia(0.2) drop-shadow(0 0 2px var(--gold)); }

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
.currency-icon     { flex-shrink: 0; }

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

@media (max-width: 620px) {
  .header-inner {
    flex-wrap: wrap;
    height: auto;
    padding: 6px 10px 0;
    gap: 6px;
    align-items: center;
  }
  .logo-img {
    position: static;
    height: 40px;
    left: auto;
    top: auto;
    margin: 0;
  }
  .logo { font-size: 0.6rem; letter-spacing: 1px; }
  .nav {
    order: 10;
    width: calc(100% + 20px);
    margin: 4px -10px 0;
    padding: 4px 10px 6px;
    border-top: 1px solid var(--border-brown);
    justify-content: space-evenly;
  }
  .nav-btn { font-size: 0.6rem; padding: 6px 8px; letter-spacing: 1px; }
  .currency-display { gap: 4px; margin-left: auto; }
  .currency { padding: 3px 6px; font-size: 0.65rem; gap: 3px; }
}

@media (max-width: 420px) {
  .logo { display: none; }
  .currency .currency-label { display: none; }
}

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
.battle-modal-panel {
  background:
    linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.82)),
    url('./assets/backgrounds/battle.png') center / cover no-repeat;
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

@media (max-width: 500px) {
  .coll-modal-panel { top: 8px; left: 8px; right: 8px; bottom: 8px; padding-top: 44px; }
  .gear-tabs { padding: 10px 10px 0; gap: 2px; }
  .gear-tab  { padding: 5px 10px; font-size: 0.6rem; letter-spacing: 1px; }
}

.coll-modal-enter-active { transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.22,1,0.36,1); }
.coll-modal-leave-active { transition: opacity 0.18s ease, transform 0.18s ease-in; }
.coll-modal-enter-from   { opacity: 0; transform: translateY(24px); }
.coll-modal-leave-to     { opacity: 0; transform: translateY(16px); }

.raid-enter-enter-active { transition: opacity 0.4s ease; }
.raid-enter-leave-active { transition: opacity 0.3s ease; }
.raid-enter-enter-from   { opacity: 0; }
.raid-enter-leave-to     { opacity: 0; }

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

.exploration-view {
  position: relative;
  min-height: calc(100vh - 92px);
}
.exploration-view::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: var(--exploration-bg);
  background-size: cover;
  background-position: center center;
  opacity: 0.14;
  pointer-events: none;
  z-index: 0;
}
.exploration-view > * { position: relative; z-index: 1; }

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
