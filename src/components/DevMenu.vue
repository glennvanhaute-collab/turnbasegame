<template>
  <div class="dev-root">
    <!-- Toggle button -->
    <button class="dev-fab" @click="open = !open" :class="{ active: open }">DEV</button>

    <!-- Panel -->
    <Transition name="dev-slide">
      <div class="dev-panel" v-if="open">
        <div class="dev-header">
          <span class="dev-title">Dev Menu</span>
          <button class="dev-close" @click="open = false">✕</button>
        </div>

        <!-- Ores -->
        <section class="dev-section">
          <div class="dev-section-label">Ores</div>
          <div class="dev-row" v-for="ore in ORE_LIST" :key="ore.id" :style="{ '--ore-color': ore.color }">
            <span class="dev-ore-dot" />
            <span class="dev-row-name">{{ ore.name }}</span>
            <span class="dev-row-count">{{ resources.ores[ore.id] ?? 0 }}</span>
            <div class="dev-btns">
              <button @click="resources.addOre(ore.id, 5)">+5</button>
              <button @click="resources.addOre(ore.id, 25)">+25</button>
              <button @click="resources.addOre(ore.id, 100)">+100</button>
            </div>
          </div>
        </section>

        <!-- Bars -->
        <section class="dev-section">
          <div class="dev-section-label">Bars</div>
          <div class="dev-row" v-for="bar in BAR_LIST" :key="bar.id" :style="{ '--ore-color': bar.color }">
            <span class="dev-ore-dot" />
            <span class="dev-row-name">{{ bar.name }}</span>
            <span class="dev-row-count">{{ resources.bars[bar.id] ?? 0 }}</span>
            <div class="dev-btns">
              <button @click="resources.addBar(bar.id, 5)">+5</button>
              <button @click="resources.addBar(bar.id, 25)">+25</button>
              <button @click="resources.addBar(bar.id, 100)">+100</button>
            </div>
          </div>
        </section>

        <!-- Hides -->
        <section class="dev-section">
          <div class="dev-section-label">Hides</div>
          <div class="dev-row" v-for="hide in HIDE_LIST" :key="hide.id" :style="{ '--ore-color': hide.color }">
            <span class="dev-ore-dot" />
            <span class="dev-row-name">{{ hide.name }}</span>
            <span class="dev-row-count">{{ resources.hides[hide.id] ?? 0 }}</span>
            <div class="dev-btns">
              <button @click="resources.addHide(hide.id, 5)">+5</button>
              <button @click="resources.addHide(hide.id, 25)">+25</button>
              <button @click="resources.addHide(hide.id, 100)">+100</button>
            </div>
          </div>
        </section>

        <!-- Leathers -->
        <section class="dev-section">
          <div class="dev-section-label">Leathers</div>
          <div class="dev-row" v-for="leather in LEATHER_LIST" :key="leather.id" :style="{ '--ore-color': leather.color }">
            <span class="dev-ore-dot" />
            <span class="dev-row-name">{{ leather.name }}</span>
            <span class="dev-row-count">{{ resources.leathers[leather.id] ?? 0 }}</span>
            <div class="dev-btns">
              <button @click="resources.addLeather(leather.id, 5)">+5</button>
              <button @click="resources.addLeather(leather.id, 25)">+25</button>
              <button @click="resources.addLeather(leather.id, 100)">+100</button>
            </div>
          </div>
        </section>

        <!-- Fibers -->
        <section class="dev-section">
          <div class="dev-section-label">Fibers</div>
          <div class="dev-row" v-for="fiber in FIBER_LIST" :key="fiber.id" :style="{ '--ore-color': fiber.color }">
            <span class="dev-ore-dot" />
            <span class="dev-row-name">{{ fiber.name }}</span>
            <span class="dev-row-count">{{ resources.fibers[fiber.id] ?? 0 }}</span>
            <div class="dev-btns">
              <button @click="resources.addFiber(fiber.id, 5)">+5</button>
              <button @click="resources.addFiber(fiber.id, 25)">+25</button>
              <button @click="resources.addFiber(fiber.id, 100)">+100</button>
            </div>
          </div>
        </section>

        <!-- Cloths -->
        <section class="dev-section">
          <div class="dev-section-label">Cloths</div>
          <div class="dev-row" v-for="cloth in CLOTH_LIST" :key="cloth.id" :style="{ '--ore-color': cloth.color }">
            <span class="dev-ore-dot" />
            <span class="dev-row-name">{{ cloth.name }}</span>
            <span class="dev-row-count">{{ resources.cloths[cloth.id] ?? 0 }}</span>
            <div class="dev-btns">
              <button @click="resources.addCloth(cloth.id, 5)">+5</button>
              <button @click="resources.addCloth(cloth.id, 25)">+25</button>
              <button @click="resources.addCloth(cloth.id, 100)">+100</button>
            </div>
          </div>
        </section>

        <!-- Logs -->
        <section class="dev-section">
          <div class="dev-section-label">Logs</div>
          <div class="dev-row" v-for="wood in WOOD_LIST" :key="wood.id" :style="{ '--ore-color': wood.color }">
            <span class="dev-ore-dot" />
            <span class="dev-row-name">{{ wood.name }}</span>
            <span class="dev-row-count">{{ resources.logs[wood.id] ?? 0 }}</span>
            <div class="dev-btns">
              <button @click="resources.addLog(wood.id, 5)">+5</button>
              <button @click="resources.addLog(wood.id, 25)">+25</button>
              <button @click="resources.addLog(wood.id, 100)">+100</button>
            </div>
          </div>
        </section>

        <!-- Currency -->
        <section class="dev-section">
          <div class="dev-section-label">Currency</div>
          <div class="dev-row">
            <span class="dev-row-icon">🪙</span>
            <span class="dev-row-name">Gold</span>
            <span class="dev-row-count">{{ currency.gold.toLocaleString() }}</span>
            <div class="dev-btns">
              <button @click="currency.addGold(1000)">+1k</button>
              <button @click="currency.addGold(10000)">+10k</button>
            </div>
          </div>
          <div class="dev-row">
            <span class="dev-row-icon">💎</span>
            <span class="dev-row-name">Diamonds</span>
            <span class="dev-row-count">{{ currency.diamonds }}</span>
            <div class="dev-btns">
              <button @click="currency.addDiamonds(50)">+50</button>
              <button @click="currency.addDiamonds(500)">+500</button>
            </div>
          </div>
        </section>

        <!-- Forge -->
        <section class="dev-section">
          <div class="dev-section-label">Forge</div>
          <div class="dev-row">
            <span class="dev-row-icon">🔥</span>
            <span class="dev-row-name">Forge Level</span>
            <span class="dev-row-count">{{ resources.forgeLevel }}</span>
            <div class="dev-btns">
              <button @click="resources.forgeLevel = Math.min(3, resources.forgeLevel + 1)">+1</button>
              <button @click="resources.forgeLevel = 0">Reset</button>
            </div>
          </div>
          <div class="dev-row">
            <span class="dev-row-icon" style="font-size:0.7rem">✦</span>
            <span class="dev-row-name">Elven Forge</span>
            <span class="dev-row-count" style="font-size:0.6rem">{{ resources.elvenForgeUnlocked ? 'ON' : 'OFF' }}</span>
            <div class="dev-btns">
              <button @click="resources.elvenForgeUnlocked = !resources.elvenForgeUnlocked">Toggle</button>
            </div>
          </div>
          <div class="dev-row">
            <span class="dev-row-icon" style="font-size:0.7rem">⚗</span>
            <span class="dev-row-name">Goblin Forge</span>
            <span class="dev-row-count" style="font-size:0.6rem">{{ resources.goblinForgeUnlocked ? 'ON' : 'OFF' }}</span>
            <div class="dev-btns">
              <button @click="resources.goblinForgeUnlocked = !resources.goblinForgeUnlocked">Toggle</button>
            </div>
          </div>
          <div class="dev-row">
            <span class="dev-row-icon" style="font-size:0.7rem">⛏</span>
            <span class="dev-row-name">Dwarf Forge</span>
            <span class="dev-row-count" style="font-size:0.6rem">{{ resources.dwarfForgeUnlocked ? 'ON' : 'OFF' }}</span>
            <div class="dev-btns">
              <button @click="resources.dwarfForgeUnlocked = !resources.dwarfForgeUnlocked">Toggle</button>
            </div>
          </div>
        </section>

        <!-- Flags -->
        <section class="dev-section">
          <div class="dev-section-label">Flags</div>
          <div class="dev-row">
            <span class="dev-row-icon">⚡</span>
            <span class="dev-row-name">Infinite Energy</span>
            <span class="dev-row-count" :style="{ color: energy.infiniteEnergy ? '#aaff44' : '' }">
              {{ energy.infiniteEnergy ? 'ON' : 'OFF' }}
            </span>
            <div class="dev-btns">
              <button @click="energy.infiniteEnergy = !energy.infiniteEnergy">Toggle</button>
            </div>
          </div>
        </section>

        <!-- Reset -->
        <section class="dev-section">
          <div class="dev-section-label">Reset</div>
          <div class="dev-reset-row">
            <button class="dev-reset-btn" @click="resetOres">Clear ores</button>
            <button class="dev-reset-btn" @click="clearSummonedUnits">Clear units</button>
            <button class="dev-reset-btn danger" @click="resetAll">Full reset</button>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useResourceStore } from '../stores/useResourceStore.js'
import { useCurrencyStore } from '../stores/useCurrencyStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { useEnergyStore } from '../stores/useEnergyStore.js'
import { ORE_LIST } from '../game/data/ores.js'
import { BAR_LIST } from '../game/data/bars.js'
import { HIDE_LIST } from '../game/data/hides.js'
import { LEATHER_LIST } from '../game/data/leathers.js'
import { FIBER_LIST } from '../game/data/fibers.js'
import { CLOTH_LIST } from '../game/data/cloths.js'
import { WOOD_LIST } from '../game/data/woods.js'

const open       = ref(false)
const resources  = useResourceStore()
const currency   = useCurrencyStore()
const collection = useCollectionStore()
const energy     = useEnergyStore()

onMounted(() => {
  collection.addToRoster('ARCHITECT')
})

function clearSummonedUnits() {
  collection.ownedKeys = collection.ownedKeys.filter(k => k === 'PLAYER_CHARACTER')
  collection.team = collection.team.filter(k => k === 'PLAYER_CHARACTER')
}

function resetOres() {
  ORE_LIST.forEach(ore => {
    resources.ores[ore.id] = 0
  })
}

function resetAll() {
  resetOres()
  localStorage.clear()
  location.reload()
}
</script>

<style scoped>
.dev-root {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-start;
  gap: 8px;
}

.dev-fab {
  background: #1a0a1a;
  border: 1px solid #5a1a8a;
  color: #cc44ff;
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 2px;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}
.dev-fab:hover, .dev-fab.active {
  background: #2a0a3a;
  box-shadow: 0 0 12px rgba(180,68,255,0.35);
}

/* Panel */
.dev-panel {
  background: rgba(10,4,16,0.97);
  border: 1px solid #3a1a5a;
  border-radius: 8px;
  width: 300px;
  max-height: 70vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
}

.dev-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 8px;
  border-bottom: 1px solid #2a1a3a;
}
.dev-title {
  font-family: var(--font-head);
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #cc44ff;
}
.dev-close {
  background: none;
  border: none;
  color: #554466;
  font-size: 0.7rem;
  cursor: pointer;
  transition: color 0.12s;
}
.dev-close:hover { color: #aaa; }

.dev-section {
  padding: 10px 14px;
  border-bottom: 1px solid #1a0a2a;
}
.dev-section:last-child { border-bottom: none; }
.dev-section-label {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #554466;
  font-weight: 700;
  margin-bottom: 7px;
  font-family: var(--font-head);
}

.dev-row {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 5px;
}
.dev-row:last-child { margin-bottom: 0; }

.dev-ore-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--ore-color);
  box-shadow: 0 0 5px var(--ore-color);
  flex-shrink: 0;
}
.dev-row-icon { font-size: 0.8rem; flex-shrink: 0; }
.dev-row-name {
  flex: 1;
  font-size: 0.65rem;
  color: #998899;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dev-row-count {
  font-family: var(--font-head);
  font-size: 0.7rem;
  font-weight: 700;
  color: #cc44ff;
  min-width: 28px;
  text-align: right;
}

.dev-btns {
  display: flex;
  gap: 3px;
  flex-shrink: 0;
}
.dev-btns button {
  background: rgba(180,68,255,0.12);
  border: 1px solid #3a1a5a;
  color: #aa66ee;
  font-size: 0.58rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.1s;
  font-family: var(--font-head);
}
.dev-btns button:hover {
  background: rgba(180,68,255,0.25);
  border-color: #7a3aaa;
}

/* Reset row */
.dev-reset-row { display: flex; gap: 6px; }
.dev-reset-btn {
  padding: 5px 12px;
  border-radius: 4px;
  border: 1px solid #2a1a4a;
  background: rgba(255,255,255,0.03);
  color: #776688;
  font-size: 0.62rem;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  font-family: var(--font-head);
  letter-spacing: 0.5px;
}
.dev-reset-btn:hover { background: rgba(255,255,255,0.07); color: #aaa; }
.dev-reset-btn.danger { border-color: #5a1a1a; color: #886666; }
.dev-reset-btn.danger:hover { background: rgba(255,80,80,0.08); color: #ff6b6b; }

/* Slide transition */
.dev-slide-enter-active { transition: opacity 0.18s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1); }
.dev-slide-leave-active { transition: opacity 0.14s ease, transform 0.14s ease-in; }
.dev-slide-enter-from   { opacity: 0; transform: translateY(8px); }
.dev-slide-leave-to     { opacity: 0; transform: translateY(6px); }
</style>
