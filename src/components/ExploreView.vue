<template>
  <div class="dungeon-wrap">

    <!-- Header -->
    <div class="dungeon-header">
      <h2 class="dungeon-title">Exploration</h2>
      <p class="dungeon-intro">Spend energy to scout the region. Discover forge sites, sacred grounds, taverns, and city contacts.</p>
    </div>

    <!-- Explore button -->
    <div class="explore-row">
      <button
        class="explore-btn"
        :disabled="!energy.canAfford(dungeonStore.EXPLORE_COST)"
        @click="doExplore"
      >
        <span class="explore-icon">🔭</span>
        Explore
        <span class="explore-cost">
          <span class="energy-icon">⚡</span>{{ dungeonStore.EXPLORE_COST }}
        </span>
      </button>
      <span class="energy-status">{{ energy.energy }}/{{ energy.maxEnergy }} energy</span>
    </div>

    <!-- Current discovered options -->
    <div v-if="dungeonStore.currentOptions.length" class="section">
      <div class="section-label">Discovered</div>
      <div class="dungeon-grid">
        <DungeonCard
          v-for="d in dungeonStore.currentOptions"
          :key="d.id"
          :dungeon="d"
          @enter="$emit('enter-dungeon', d)"
          @pin="dungeonStore.pin(d.id)"
          @claim="openNodePicker(d.id)"
        />
      </div>
    </div>

    <div v-else-if="explored" class="empty-hint">No dungeons found. Explore again.</div>

    <!-- Pinned Nightmares -->
    <div v-if="dungeonStore.pinnedDungeons.length" class="section">
      <div class="section-label">
        📌 Pinned Nightmares
        <span class="section-note">— saved until you clear them</span>
      </div>
      <div class="dungeon-grid">
        <DungeonCard
          v-for="d in dungeonStore.pinnedDungeons"
          :key="d.id"
          :dungeon="d"
          @enter="$emit('enter-dungeon', d)"
          @unpin="dungeonStore.unpin(d.id)"
        />
      </div>
    </div>

    <!-- Tavern modal -->
    <div class="modal-backdrop" v-if="dungeonStore.pendingTavernId" @click.self="dungeonStore.closeTavern()">
      <div class="node-modal tavern-modal">
        <div class="modal-title">{{ tavernNode?.name }}</div>
        <div class="tavern-scene">
          You settle into a corner and listen to the murmur of the room...
        </div>

        <div v-if="dungeonStore.pendingTavernFrag" class="fragment-reveal">
          <div class="fragment-header">
            <img
              v-if="HERO_AVATARS[dungeonStore.pendingTavernFrag.heroId]"
              :src="HERO_AVATARS[dungeonStore.pendingTavernFrag.heroId]"
              class="fragment-avatar"
              alt=""
            />
            <div class="fragment-header-text">
              <div class="fragment-title">"{{ dungeonStore.pendingTavernFrag.frag.title }}"</div>
              <div class="fragment-hero">— A rumor about <em>{{ dungeonStore.pendingTavernFrag.heroTitle }}</em></div>
            </div>
          </div>
          <div v-if="dungeonStore.pendingTavernFrag.frag.text" class="fragment-excerpt">
            {{ dungeonStore.pendingTavernFrag.frag.text.slice(0, 220).trimEnd() }}...
          </div>
          <div class="fragment-hint">Full account available in the Codex.</div>
        </div>
        <div v-else class="no-legends">
          Nothing of note tonight. The regulars are quiet.
        </div>

        <div class="modal-actions">
          <button
            class="enter-btn tavern-claim-btn"
            :disabled="!dungeonStore.pendingTavernFrag"
            @click="claimTavern"
          >Remember This</button>
          <button class="modal-cancel" @click="dungeonStore.closeTavern()">Leave</button>
        </div>
      </div>
    </div>

    <!-- Node picker modal -->
    <div class="modal-backdrop" v-if="dungeonStore.pendingNodeId" @click.self="dungeonStore.closeNode()">
      <div class="node-modal">
        <div class="modal-title">
          {{ pendingNode?.nodeType === 'forge' ? '🔨 Ancient Forge' : '✨ Blessed Area' }}
        </div>
        <div class="modal-sub">Choose an item to receive a permanent stat line.</div>

        <div v-if="equippedLegendaries.length" class="legend-list">
          <button
            v-for="entry in equippedLegendaries"
            :key="entry.instance.instanceId"
            class="legend-item"
            :class="entry.instance.rarity.toLowerCase()"
            @click="claimNode(entry.instance.instanceId)"
          >
            <div class="li-name">{{ entry.instance.name }}</div>
            <div class="li-meta">{{ entry.instance.rarity }} · {{ entry.heroName }} · {{ entry.slot }}</div>
            <div class="li-lines" v-if="entry.instance.lines?.length">{{ entry.instance.lines.length }} line{{ entry.instance.lines.length > 1 ? 's' : '' }} already</div>
          </button>
        </div>

        <div v-else class="no-legends">
          No items equipped on your team — equip gear first.
        </div>

        <button class="modal-cancel" @click="dungeonStore.closeNode()">Cancel</button>
      </div>
    </div>

    <!-- Claim result toast -->
    <div class="claim-toast" :class="{ visible: !!claimResult }">
      ✦ {{ claimResult }}
    </div>

    <!-- Empty state -->
    <div v-if="!dungeonStore.currentOptions.length && !dungeonStore.pinnedDungeons.length && !explored" class="empty-state">
      <div class="empty-icon">⚔</div>
      <div class="empty-text">No dungeons discovered yet.</div>
      <div class="empty-sub">Hit Explore to reveal what lurks nearby.</div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDungeonStore }  from '../stores/useDungeonStore.js'
import { useCityStore }     from '../stores/useCityStore.js'
import { useAdvisorStore }  from '../stores/useAdvisorStore.js'
import { useEnergyStore } from '../stores/useEnergyStore.js'
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { GearSlot, SLOT_LABELS } from '../game/Gear.js'
import DungeonCard from './DungeonCard.vue'
import avatarAldric  from '../assets/units/legendary/lord-aldric.png'
import avatarHelga   from '../assets/units/legendary/Helga.png'
import avatarGarrett from '../assets/units/rare/garrett-the-unbroken.png'

const HERO_AVATARS = { lord_aldric: avatarAldric, helga: avatarHelga, hedge_blade: avatarGarrett }

defineEmits(['enter-dungeon'])

const dungeonStore = useDungeonStore()
const cityStore    = useCityStore()
const advisor      = useAdvisorStore()
const energy       = useEnergyStore()
const inventory    = useInventoryStore()
const collection   = useCollectionStore()
const explored     = ref(dungeonStore.currentOptions.length > 0)
const claimResult  = ref('')
let claimTimer = null

const pendingNode = computed(() =>
  dungeonStore.pendingNodeId
    ? dungeonStore.findDungeon(dungeonStore.pendingNodeId)
    : null
)

const tavernNode = computed(() =>
  dungeonStore.pendingTavernId
    ? dungeonStore.findDungeon(dungeonStore.pendingTavernId)
    : null
)

// All equipped items across the team — any rarity can receive a node line
const equippedLegendaries = computed(() => {
  const results = []
  for (const heroKey of collection.team) {
    const heroEntry = collection.roster.find(r => r.key === heroKey)
    for (const slot of Object.values(GearSlot)) {
      const item = inventory.getEquippedItem(heroKey, slot)
      if (item) {
        results.push({
          instance: item,
          heroName: heroEntry?.hero?.name ?? heroKey,
          slot: SLOT_LABELS[slot] ?? slot,
        })
      }
    }
  }
  return results
})

function doExplore() {
  dungeonStore.explore()
  explored.value = true
}

const NODE_ADVISOR_FLAGS = {
  forge:   'seen-node-forge',
  blessed: 'seen-node-blessed',
  tavern:  'seen-node-tavern',
  city:    'seen-node-city',
}
const NODE_ADVISOR_LINES = {
  forge: [
    'A forge imbued with ancient power — rarer than anything you will find in camp.',
    'You can use it to inscribe a physical stat line onto any Legendary item you carry. The enhancement is permanent.',
    'Choose wisely. The forge will not wait.',
  ],
  blessed: [
    'Sacred ground, still warm with old light. These places predate the houses.',
    'A blessed area can inscribe a magical stat line onto a Legendary item. Critical rates, resistances, things the hammer cannot add.',
    'Once chosen, the blessing is bound to that item forever. Think before you act.',
  ],
  tavern: [
    'Sit long enough in any tavern and the world talks around you. People forget you are listening.',
    'Some of what you overhear is useful. Some of it is history that was never meant to be recorded.',
    'I keep notes. Visit the Codex — Heroes tab — when you want to read what we have gathered so far.',
  ],
  city: [
    'Every great house has cities. And every city has names worth knowing.',
    'When you pass through a city aligned with a house, you may hear of a notable warrior looking for a worthy banner to follow.',
    'Hear enough of their name and they will answer when you call. Visit the summon portal — they will be waiting.',
  ],
}

function maybeShowNodeAdvisor(nodeType) {
  const flag = NODE_ADVISOR_FLAGS[nodeType]
  if (!flag || localStorage.getItem(flag)) return
  localStorage.setItem(flag, '1')
  const lines = NODE_ADVISOR_LINES[nodeType]
  if (lines) advisor.say(lines)
}

function openNodePicker(id) {
  const node = dungeonStore.findDungeon(id)
  if (node?.nodeType) maybeShowNodeAdvisor(node.nodeType)
  if (node?.nodeType === 'tavern') {
    const result = dungeonStore.openTavern(id)
    if (!result) showToast('Nothing new in the tavern tonight.')
  } else if (node?.nodeType === 'forge_discovery') {
    const forgeType = dungeonStore.claimForgeDiscovery(id)
    if (forgeType) {
      const labels = { elven: 'Elven Moonforge', goblin: 'Goblin Contraption Works', dwarf: 'Dwarven Ironhall' }
      showToast(`✦ ${labels[forgeType]} discovered — new crafting tier unlocked!`)
    }
  } else if (node?.nodeType === 'city') {
    const result = dungeonStore.claimCityNode(id)
    if (result) {
      cityStore.addPending(result.heroKey)
      showToast(`🏙 You heard of ${result.heroName} in ${node.cityName}. They will answer your next call.`)
    }
  } else {
    dungeonStore.openNode(id)
  }
}

function claimNode(instanceId) {
  const result = dungeonStore.applyNodeToItem(instanceId)
  if (result) {
    showToast(`${result.itemName} received: ${result.line.label}`)
  }
}

function claimTavern() {
  const result = dungeonStore.claimTavern()
  if (result) showToast(`Fragment discovered: "${result.frag.title}"`)
}

function showToast(msg) {
  claimResult.value = msg
  clearTimeout(claimTimer)
  claimTimer = setTimeout(() => { claimResult.value = '' }, 3500)
}
</script>

<style scoped>
.dungeon-wrap {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 60px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.dungeon-header { text-align: center; }
.dungeon-title {
  font-family: var(--font-head);
  font-size: 1.3rem;
  color: var(--gold);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.dungeon-intro {
  font-size: 0.8rem;
  color: var(--text-muted);
  max-width: 540px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Explore row */
.explore-row { display: flex; align-items: center; gap: 14px; }
.explore-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1a0e05, #2a1508);
  border: 1px solid var(--gold-dim);
  border-radius: 8px;
  color: var(--gold);
  font-family: var(--font-head);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, opacity 0.15s;
}
.explore-btn:hover:not(:disabled) { border-color: var(--gold); box-shadow: 0 0 14px rgba(201,162,39,0.25); }
.explore-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.explore-icon { font-size: 1rem; }
.explore-cost {
  display: flex;
  align-items: center;
  gap: 3px;
  background: rgba(0,0,0,0.35);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 0.75rem;
  color: #aaff44;
}
.energy-icon { font-size: 0.78rem; }
.energy-status { font-size: 0.72rem; color: var(--text-muted); }

/* Section */
.section { display: flex; flex-direction: column; gap: 12px; }
.section-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--text-muted);
  font-weight: 600;
}
.section-note { text-transform: none; font-style: italic; letter-spacing: 0; color: var(--text-dim); }

.dungeon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.empty-hint { font-size: 0.75rem; color: var(--text-dim); font-style: italic; }

/* Node picker modal */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0,0,0,0.75);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.node-modal {
  background: #120a05;
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  padding: 24px;
  width: min(480px, 92vw);
  display: flex; flex-direction: column; gap: 14px;
  box-shadow: 0 0 40px rgba(0,0,0,0.8);
}
.modal-title { font-family: var(--font-head); font-size: 1rem; color: var(--gold); font-weight: 700; letter-spacing: 2px; }
.modal-sub   { font-size: 0.75rem; color: var(--text-muted); }
.legend-list { display: flex; flex-direction: column; gap: 8px; max-height: 320px; overflow-y: auto; }
.legend-item {
  background: #0e0804; border: 1px solid #3a1c0a; border-radius: 8px;
  padding: 10px 14px; text-align: left; cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  display: flex; flex-direction: column; gap: 3px;
}
.legend-item:hover          { background: #180e06; border-color: var(--gold-dim); }
.legend-item.legendary      { border-color: #7a5228; }
.legend-item.legendary:hover{ border-color: var(--gold); }
.legend-item.mythical       { border-color: #6a1a6a; }
.legend-item.mythical:hover { border-color: #cc44ff; }
.li-name  { font-size: 0.85rem; font-weight: 700; color: var(--text-parchment); }
.li-meta  { font-size: 0.65rem; color: var(--text-muted); }
.li-lines { font-size: 0.62rem; color: #cc44ff; font-weight: 600; }
.no-legends { font-size: 0.75rem; color: var(--text-dim); font-style: italic; text-align: center; padding: 16px 0; }
.modal-cancel {
  align-self: flex-end; background: none; border: 1px solid #3a1c0a;
  border-radius: 6px; color: var(--text-muted); font-size: 0.72rem;
  padding: 6px 16px; cursor: pointer; transition: color 0.15s, border-color 0.15s;
}
.modal-cancel:hover { color: #ff6b6b; border-color: #ff6b6b66; }

/* Tavern modal */
.tavern-modal { border-color: #4a3208; }
.tavern-scene {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.6;
}
.fragment-reveal {
  display: flex; flex-direction: column; gap: 10px;
  background: #0a0804; border: 1px solid #3a2c0a;
  border-radius: 8px; padding: 16px;
}
.fragment-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.fragment-avatar {
  width: 56px;
  height: 68px;
  object-fit: cover;
  object-position: top center;
  border-radius: 4px;
  flex-shrink: 0;
  filter: sepia(0.15);
  border: 1px solid #3a2c0a;
}
.fragment-header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: center;
}
.fragment-title {
  font-family: var(--font-head);
  font-size: 0.95rem;
  color: var(--gold);
  font-weight: 700;
}
.fragment-hero {
  font-size: 0.68rem;
  color: var(--text-muted);
  letter-spacing: 0.5px;
}
.fragment-hero em { color: #c9a227; font-style: normal; }
.fragment-excerpt {
  font-size: 0.72rem;
  color: #aaa;
  line-height: 1.65;
  border-left: 2px solid #3a2c0a;
  padding-left: 10px;
  margin-top: 4px;
}
.fragment-hint {
  font-size: 0.62rem;
  color: var(--text-dim);
  font-style: italic;
}
.modal-actions { display: flex; gap: 10px; align-items: center; justify-content: flex-end; }
.tavern-claim-btn {
  padding: 8px 18px;
  background: transparent;
  border: 1px solid #c9a227;
  border-radius: 6px;
  color: #c9a227;
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}
.tavern-claim-btn:hover:not(:disabled) { background: rgba(201,162,39,0.1); box-shadow: 0 0 12px rgba(201,162,39,0.2); }
.tavern-claim-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Toast */
.claim-toast {
  position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
  background: #1a1208; border: 1px solid var(--gold-dim);
  border-radius: 8px; padding: 10px 20px;
  font-size: 0.8rem; color: var(--gold); font-weight: 600;
  z-index: 200; pointer-events: none;
  opacity: 0; transition: opacity 0.3s;
}
.claim-toast.visible { opacity: 1; }

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-dim);
}
.empty-icon { font-size: 2rem; margin-bottom: 12px; opacity: 0.3; }
.empty-text { font-size: 0.9rem; font-weight: 600; margin-bottom: 6px; }
.empty-sub  { font-size: 0.75rem; font-style: italic; }

/* ── Responsive ── */
@media (max-width: 1100px) {
  .dungeon-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 700px) {
  .dungeon-grid { grid-template-columns: repeat(2, 1fr); }
  .dungeon-wrap { padding: 0 14px 60px; }
}
@media (max-width: 460px) {
  .dungeon-grid { grid-template-columns: 1fr; }
}
</style>
