<template>
  <!-- First-run character creation -->
  <HeroCreationView v-if="!playerHeroStore.isCreated" @done="onHeroCreated" />

  <!-- Main Westrun app -->
  <div class="app" v-else>
    <header class="app-header">
      <div class="app-header-bg" :style="{ backgroundImage: `url(${navBg})` }" />
      <div class="header-inner">
        <img :src="navLogo" class="logo-img" alt="" @click="navigate('hall')" style="cursor:pointer" />
        <h1 class="logo" @click="navigate('hall')" style="cursor:pointer">Bannerlords of Westrun</h1>
        <nav class="nav">
          <button class="nav-btn" :class="{ active: view === 'hall' }"    @click="navigate('hall')">Hall</button>
          <button class="nav-btn" :class="{ active: view === 'summon' }"  @click="navigate('summon')">Recruit</button>
          <button class="nav-btn" :class="{ active: view === 'gear' }"    @click="navigate('gear')">Arsenal</button>
          <button class="nav-btn" :class="{ active: view === 'combat' }"  @click="navigate('combat')">Combat</button>
          <button class="nav-btn" :class="{ active: view === 'realm' }"   @click="navigate('realm')">Realm</button>
          <button v-if="isBattleActive" class="nav-btn nav-btn--battle-live" @click="showBattle = true" title="Return to running battle">
            ⚔ Battle Running
          </button>
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

    <!-- Floating Codex button — hidden on home -->
    <button class="codex-fab" v-if="view !== 'hall'" @click="showCodex = true" title="Open Codex">
      <img :src="codexIcon" class="codex-fab-icon" alt="Codex" />
    </button>

    <!-- Collection modal -->
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

    <!-- Blacksmith modal -->
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

    <!-- Leatherworking modal -->
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

    <!-- Tailoring modal -->
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

    <!-- Woodworking modal -->
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

    <!-- Weapon Forge modal -->
    <Teleport to="body">
      <Transition name="coll-modal">
        <div class="coll-modal-wrap" v-if="showWeaponForge">
          <div class="coll-modal-backdrop" @click="showWeaponForge = false" />
          <div class="coll-modal-panel">
            <button class="coll-modal-close" @click="showWeaponForge = false" title="Close">
              <img :src="closeImg" class="coll-modal-close-icon" alt="Close" />
            </button>
            <WeaponForgeView />
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Market modal -->
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

    <!-- Battle modal -->
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
      <!-- ── Hall ── -->
      <div v-if="view === 'hall'" class="hall-section">
        <nav class="hall-subnav">
          <button
            class="hall-subnav-btn"
            v-for="path in HALL_PATHS"
            :key="path.dest"
            :class="{ active: hallTab === path.dest }"
            @click="navigate(path.dest)"
          >
            <p class="hall-subnav-name">{{ path.name }}</p>
            <p class="hall-subnav-flavor">{{ path.flavor }}</p>
          </button>
        </nav>
        <nav v-if="hallTab === 'artisan'" class="hall-subnav hall-subnav--artisan">
          <button class="hall-subnav-btn" :class="{ active: artisanTab === 'smith' }"     @click="artisanTab = 'smith'">
            <p class="hall-subnav-name">Blacksmith</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: artisanTab === 'leather' }"   @click="artisanTab = 'leather'">
            <p class="hall-subnav-name">Leatherwork</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: artisanTab === 'tailoring' }" @click="artisanTab = 'tailoring'">
            <p class="hall-subnav-name">Tailoring</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: artisanTab === 'woodwork' }"  @click="artisanTab = 'woodwork'">
            <p class="hall-subnav-name">Woodwork</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: artisanTab === 'fusion' }"    @click="artisanTab = 'fusion'">
            <p class="hall-subnav-name">Fusion</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: artisanTab === 'weapon' }"    @click="artisanTab = 'weapon'">
            <p class="hall-subnav-name">Weapon Forge</p>
          </button>
        </nav>
        <div class="hall-content">
          <GreatHallView v-if="hallTab === 'hall'" @navigate="navigate" />
          <CampView v-else-if="hallTab === 'stronghold'" />
          <div v-else-if="hallTab === 'artisan'" class="artisan-shell">
            <div class="artisan-body">
              <BlacksmithView      v-if="artisanTab === 'smith'" />
              <LeatherworkingView  v-else-if="artisanTab === 'leather'" />
              <TailoringView       v-else-if="artisanTab === 'tailoring'" />
              <WoodworkingView     v-else-if="artisanTab === 'woodwork'" />
              <FusionWorkshopView  v-else-if="artisanTab === 'fusion'" />
              <WeaponForgeView     v-else />
            </div>
          </div>
          <MarketView v-else-if="hallTab === 'market'" />
        </div>
      </div>

      <!-- ── Recruit ── -->
      <SummonView v-else-if="view === 'summon'" />

      <!-- ── Arsenal ── -->
      <div v-else-if="view === 'gear'" class="gear-view arsenal-view" :style="{ '--arsenal-bg': `url(${arsenalBg})` }">
        <nav class="hall-subnav hall-subnav--5col">
          <button class="hall-subnav-btn" :class="{ active: gearTab === 'roster' }"    @click="gearTab = 'roster'">
            <p class="hall-subnav-name">Roster</p>
            <p class="hall-subnav-flavor">Your champions</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: gearTab === 'inventory' }" @click="gearTab = 'inventory'">
            <p class="hall-subnav-name">Inventory</p>
            <p class="hall-subnav-flavor">Hoarded treasures</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: gearTab === 'equipment' }" @click="gearTab = 'equipment'">
            <p class="hall-subnav-name">Equipment</p>
            <p class="hall-subnav-flavor">Arm your warriors</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: gearTab === 'forge' }"     @click="gearTab = 'forge'">
            <p class="hall-subnav-name">Forge <span class="relic-pip" v-if="forgeStore.totalOrbs > 0">{{ forgeStore.totalOrbs }}</span></p>
            <p class="hall-subnav-flavor">Reforge &amp; empower</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: gearTab === 'relics' }"    @click="gearTab = 'relics'">
            <p class="hall-subnav-name">Relics <span class="relic-pip" v-if="inventoryStore.soulVessels > 0">{{ inventoryStore.soulVessels }}</span></p>
            <p class="hall-subnav-flavor">Soul vessels</p>
          </button>
        </nav>
        <CollectionView v-if="gearTab === 'roster'" />
        <InventoryView  v-else-if="gearTab === 'inventory'" />
        <EquipmentView  v-else-if="gearTab === 'equipment'" />
        <ForgeView      v-else-if="gearTab === 'forge'" />
        <RelicsView     v-else />
      </div>

      <!-- ── Combat ── -->
      <div v-else-if="view === 'combat'" class="gear-view exploration-view" :style="{ '--exploration-bg': `url(${explorationBg})` }">
        <nav class="hall-subnav hall-subnav--5col">
          <button class="hall-subnav-btn" :class="{ active: combatTab === 'training' }" @click="combatTab = 'training'">
            <p class="hall-subnav-name">Training</p>
            <p class="hall-subnav-flavor">Sharpen your warriors</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: combatTab === 'explore' }"  @click="combatTab = 'explore'">
            <p class="hall-subnav-name">Exploration</p>
            <p class="hall-subnav-flavor">Scout the region</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: combatTab === 'dungeons' }" @click="combatTab = 'dungeons'">
            <p class="hall-subnav-name">Dungeons</p>
            <p class="hall-subnav-flavor">Delve the deep</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: combatTab === 'raids' }"    @click="combatTab = 'raids'">
            <p class="hall-subnav-name">Raids</p>
            <p class="hall-subnav-flavor">Boss encounters</p>
          </button>
          <button class="hall-subnav-btn" :class="{ active: combatTab === 'sieges' }"   @click="combatTab = 'sieges'">
            <p class="hall-subnav-name">Sieges</p>
            <p class="hall-subnav-flavor">Storm the walls</p>
          </button>
        </nav>
        <HomeView
          v-if="combatTab === 'training'"
          @start-battle="startBattle"
          @open-collection="gearTab = 'roster'; navigate('gear')"
          @open-blacksmith="hallTab = 'artisan'; artisanTab = 'smith'; navigate('hall')"
          @open-leatherworking="hallTab = 'artisan'; artisanTab = 'leather'; navigate('hall')"
          @open-tailoring="hallTab = 'artisan'; artisanTab = 'tailoring'; navigate('hall')"
          @open-woodworking="hallTab = 'artisan'; artisanTab = 'woodwork'; navigate('hall')"
          @open-fusion-workshop="hallTab = 'artisan'; artisanTab = 'fusion'; navigate('hall')"
          @open-weapon-forge="hallTab = 'artisan'; artisanTab = 'weapon'; navigate('hall')"
          @open-market="hallTab = 'market'; navigate('hall')"
          @open-codex="showCodex = true"
        />
        <ExploreView  v-else-if="combatTab === 'explore'"   @enter-dungeon="startDungeonBattle" />
        <DungeonView  v-else-if="combatTab === 'dungeons'"  @enter-dungeon="startDungeonBattle" />
        <RaidsView    v-else-if="combatTab === 'raids'"     @enter-raid="startRaidBattle" @auto-raid="startAutoRaid" />
        <SiegesView   v-else-if="combatTab === 'sieges'" />
      </div>

      <!-- ── Realm ── -->
      <RealmView v-else-if="view === 'realm'" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useMusic } from '../../composables/useMusic.js'
import { playBattleForTeam, playMain } from '../../game/music.js'
import { useSmeltingTick } from '../../composables/useSmeltingTick.js'
import { useTanningTick }  from '../../composables/useTanningTick.js'
import { useWeavingTick }  from '../../composables/useWeavingTick.js'
const _B = import.meta.env.BASE_URL
const logoNav        = _B + 'ui/logo-nav.png'
const shieldAldric   = _B + 'lore/house_aldric.png'
const shieldValdris  = _B + 'lore/house_valdris.png'
const shieldCaelwyn  = _B + 'lore/house_caelwyn.png'
const shieldMordaine = _B + 'lore/house_mordaine.png'
import { useBattleStore }      from '../../stores/useBattleStore.js'
import { useCollectionStore }  from '../../stores/useCollectionStore.js'
import { useCurrencyStore }    from '../../stores/useCurrencyStore.js'
import { useEnergyStore }      from '../../stores/useEnergyStore.js'
import { usePlayerHeroStore }  from '../../stores/usePlayerHeroStore.js'
import { useInventoryStore }   from '../../stores/useInventoryStore.js'
import { useForgeStore }       from '../../stores/useForgeStore.js'
import { useAdvisorStore }     from '../../stores/useAdvisorStore.js'
import { useSettingsStore }    from '../../stores/useSettingsStore.js'
import { buildDungeonEncounter } from '../../game/data/dungeons.js'
const arsenalBg     = _B + 'backgrounds/arsenal.png'
const explorationBg = _B + 'backgrounds/exploration_bg.png'
const navBg         = _B + 'backgrounds/bg_nav.png'
const collectionIcon = _B + 'ui/collection-icon.png'
import codexIcon from '../../assets/ui/codex.png'
import closeImg  from '../../assets/ui/close.png'
import GameIcon         from '../ui/GameIcon.vue'
import HeroCreationView from '../HeroCreationView.vue'
import GreatHallView    from '../GreatHallView.vue'
import HomeView         from '../HomeView.vue'
import CollectionView   from '../CollectionView.vue'
import BlacksmithView   from '../BlacksmithView.vue'
import LeatherworkingView from '../LeatherworkingView.vue'
import TailoringView    from '../TailoringView.vue'
import WoodworkingView  from '../WoodworkingView.vue'
import FusionWorkshopView from '../FusionWorkshopView.vue'
import WeaponForgeView  from '../WeaponForgeView.vue'
import MarketView       from '../MarketView.vue'
import InventoryView    from '../InventoryView.vue'
import EquipmentView    from '../EquipmentView.vue'
import SummonView       from '../SummonView.vue'
import BattleArena      from '../BattleArena.vue'
import DungeonView      from '../DungeonView.vue'
import ExploreView      from '../ExploreView.vue'
import RaidsView        from '../RaidsView.vue'
import RaidBattleArena  from '../RaidBattleArena.vue'
import SiegesView       from '../SiegesView.vue'
import RealmView        from '../RealmView.vue'
import RelicsView       from '../RelicsView.vue'
import ForgeView        from '../ForgeView.vue'
import DiamondShopModal from '../DiamondShopModal.vue'
import CampView         from '../CampView.vue'
import CodexModal       from '../CodexModal.vue'
import AdvisorMessage   from '../AdvisorMessage.vue'
import DevMenu          from '../DevMenu.vue'
import SettingsPanel    from '../SettingsPanel.vue'

const view       = ref('hall')
const hallTab    = ref('hall')
const artisanTab = ref('smith')
const gearTab    = ref('roster')
const combatTab  = ref('training')
const showShop           = ref(false)
const showCodex          = ref(false)
const showCollection     = ref(false)
const showBlacksmith     = ref(false)
const showLeatherworking = ref(false)
const showTailoring      = ref(false)
const showWoodworking    = ref(false)
const showFusionWorkshop = ref(false)
const showWeaponForge    = ref(false)
const showMarket         = ref(false)
const showBattle         = ref(false)
const showRaidBattle     = ref(false)
const activeRaidId       = ref(null)
const isAutoRaid         = ref(false)

const advisorStore     = useAdvisorStore()
const battleStore      = useBattleStore()
const collectionStore  = useCollectionStore()
const playerHeroStore  = usePlayerHeroStore()
const currencyStore    = useCurrencyStore()
const energyStore      = useEnergyStore()
const inventoryStore   = useInventoryStore()
const forgeStore       = useForgeStore()
const settings         = useSettingsStore()

const isBattleActive = computed(() =>
  battleStore.isBatchRunning || (!battleStore.isOver && battleStore.engine !== null)
)

const HALL_PATHS = [
  { dest: 'hall',       name: 'Great Hall',  flavor: 'Your seat of power' },
  { dest: 'stronghold', name: 'Stronghold',  flavor: 'The keep demands your attention' },
  { dest: 'artisan',    name: 'Artisan',     flavor: 'The forge and loom await your craft' },
  { dest: 'market',     name: 'Market',      flavor: 'Trade routes feed the war machine' },
]

const HOUSE_COLORS = {
  'House Aldric':   '#c8962a',
  'House Valdris':  '#4fa8ff',
  'House Caelwyn':  '#4dff88',
  'House Mordaine': '#b44fff',
}
const hallNavColor = computed(() => HOUSE_COLORS[playerHeroStore.heroFaction] ?? 'var(--gold)')

const SHIELD_IMAGES = { aldric: shieldAldric, valdris: shieldValdris, caelwyn: shieldCaelwyn, mordaine: shieldMordaine }
const navLogo = computed(() => SHIELD_IMAGES[settings.theme] ?? logoNav)

const { muted, toggleMute, onViewChange, startOnFirstInteraction } = useMusic()
useSmeltingTick()
useTanningTick()
useWeavingTick()

watch(view, (v) => { onViewChange(v) })
watch(showBattle, v => { if (!v) playMain() })

function closeAllPanels() {
  showCollection.value     = false
  showBlacksmith.value     = false
  showLeatherworking.value = false
  showTailoring.value      = false
  showWoodworking.value    = false
  showFusionWorkshop.value = false
  showWeaponForge.value    = false
  showMarket.value         = false
  showBattle.value         = false
  showRaidBattle.value     = false
  showShop.value           = false
  showCodex.value          = false
}

function navigate(newView) {
  closeAllPanels()
  if (newView === 'hall')       { view.value = 'hall';   hallTab.value = 'hall';       return }
  if (newView === 'stronghold') { view.value = 'hall';   hallTab.value = 'stronghold'; return }
  if (newView === 'artisan')    { view.value = 'hall';   hallTab.value = 'artisan';    return }
  if (newView === 'market')     { view.value = 'hall';   hallTab.value = 'market';     return }
  if (newView === 'campaign')   { view.value = 'combat'; combatTab.value = 'training'; return }
  if (newView === 'dungeon')    { view.value = 'combat'; combatTab.value = 'dungeons'; return }
  if (newView === 'sieges')     { view.value = 'combat'; combatTab.value = 'sieges';   return }
  view.value = newView
}

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

function handleEscape(e) {
  if (e.key !== 'Escape') return
  if (showRaidBattle.value)    { showRaidBattle.value = false;    return }
  if (showBattle.value)        { showBattle.value = false;        return }
  if (showCollection.value)    { showCollection.value = false;    return }
  if (showBlacksmith.value)    { showBlacksmith.value = false;    return }
  if (showLeatherworking.value){ showLeatherworking.value = false; return }
  if (showTailoring.value)     { showTailoring.value = false;     return }
  if (showWoodworking.value)   { showWoodworking.value = false;   return }
  if (showMarket.value)        { showMarket.value = false;        return }
  if (showCodex.value)         { showCodex.value = false;         return }
  if (showShop.value)          { showShop.value = false;          return }
}

onMounted(() => {
  startOnFirstInteraction()
  window.addEventListener('keydown', handleEscape)
})

onUnmounted(() => window.removeEventListener('keydown', handleEscape))

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
  a.download = 'westrun-save.json'
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
  view.value = 'combat'
  setTimeout(() => {
    advisorStore.say(
      `Welcome to Westrun, ${playerHeroStore.heroName}. I am Edwyn — chronicler, archivist, and apparently your keeper. ` +
      `Your collection holds your champions. Assemble a team of five and seek out the Training grounds when you are ready. ` +
      `The book in the corner is your Codex. Write in it. You will want to remember this.`
    )
  }, 800)
}

function startBattle(encounterIndex) {
  if (isBattleActive.value) { showBattle.value = true; return }
  const team = collectionStore.buildTeam()
  battleStore.initBattle(encounterIndex, team)
  playBattleForTeam(team.map(h => h.id))
  showBattle.value = true
}

function startDungeonBattle(dungeon) {
  if (isBattleActive.value) { showBattle.value = true; return }
  const team = collectionStore.buildTeam()
  const encounter = buildDungeonEncounter(dungeon)
  if (dungeon.batchCount > 1) battleStore.setupBatch(dungeon.batchCount)
  battleStore.initBattle(encounter, team)
  playBattleForTeam(team.map(h => h.id))
  if (!battleStore.autoplay) battleStore.toggleAutoplay()
  showBattle.value = true
}
</script>

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

.nav-btn--battle-live {
  color: #4dff88;
  border-bottom-color: #4dff88;
  animation: battle-live-pulse 1.6s ease-in-out infinite;
}
.nav-btn--battle-live:hover { color: #88ffaa; border-bottom-color: #88ffaa; }
@keyframes battle-live-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
}
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

.hub-return-btn {
  background: none;
  border: 1px solid var(--border-brown);
  border-radius: 4px;
  color: var(--text-dim);
  font-size: 1rem;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  flex-shrink: 0;
  margin-left: -8px;
}
.hub-return-btn:hover { color: var(--gold); border-color: var(--gold-dim); }

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
    url('/turnbasegame/backgrounds/battle.png') center / cover no-repeat;
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
.coll-modal-close:hover { transform: scale(1.1); }
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

.tab-sep {
  width: 1px;
  align-self: stretch;
  background: var(--border-brown);
  margin: 4px 6px;
  flex-shrink: 0;
}

.hall-section {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
}
.hall-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.hall-subnav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-bottom: 1px solid var(--border-gold);
  background: #0b0804;
  flex-shrink: 0;
}
.hall-subnav--artisan {
  grid-template-columns: repeat(6, 1fr);
  background: #090703;
  border-top: none;
}
.hall-subnav--5col {
  grid-template-columns: repeat(5, 1fr);
}
.hall-subnav-btn {
  background: none;
  border: none;
  border-right: 1px solid var(--border-brown);
  padding: 8px 16px;
  cursor: pointer;
  text-align: center;
  transition: background 0.15s, border-bottom-color 0.15s;
  border-bottom: 2px solid transparent;
}
.hall-subnav-btn:last-child { border-right: none; }
.hall-subnav-btn:hover { background: var(--bg-panel); }
.hall-subnav-btn.active {
  background: var(--bg-panel);
  border-bottom-color: v-bind(hallNavColor);
}
.hall-subnav-name {
  font-family: var(--font-head);
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: v-bind(hallNavColor);
  margin: 0;
}
.hall-subnav-flavor {
  font-size: 0.56rem;
  color: var(--text-muted);
  margin: 2px 0 0;
}

.artisan-shell {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.artisan-body {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}
.combat-tabs { display: flex; align-items: center; }
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
