<template>
  <div class="relics-view">
    <div class="relics-header">
      <h2 class="relics-title">Special Items</h2>
      <p class="relics-subtitle">Rare relics and consumables. Apply them to heroes from the Collection.</p>
    </div>

    <div class="relics-grid">

      <!-- Soul Vessel -->
      <div class="relic-card" :class="{ empty: inventory.soulVessels === 0 }">
        <div class="relic-img-wrap">
          <img :src="soulVesselImg" class="relic-img" alt="Soul Vessel" />
          <div class="relic-count" v-if="inventory.soulVessels > 0">×{{ inventory.soulVessels }}</div>
          <div class="relic-count relic-count--empty" v-else>×0</div>
        </div>
        <div class="relic-body">
          <div class="relic-name">Soul Vessel</div>
          <div class="relic-rarity">Legendary · Consumable</div>
          <p class="relic-desc">
            Imbues a hero with a living soul, binding their growth to your own.
            The chosen hero's base stats scale with your player level — up to
            <strong>×2.5</strong> at full progression.
          </p>
          <div class="relic-obtain">
            <span class="obtain-icon">⚔</span>
            Rare drop from Nightmare dungeons (~4% chance)
          </div>
          <div class="relic-hint" v-if="inventory.soulVessels > 0">
            Open any hero's detail card to apply.
          </div>
          <div class="relic-hint empty" v-else>
            You don't own any Soul Vessels yet.
          </div>
        </div>
      </div>

      <!-- Orbs — one card per type -->
      <div
        v-for="(meta, id) in forge.ORBS"
        :key="id"
        class="relic-card"
        :class="{ empty: forge.orbs[id] === 0 }"
        :style="{ '--orb-color': meta.color }"
      >
        <div class="relic-img-wrap orb-wrap">
          <OrbIcon :orbId="id" :size="64" :title="meta.label" />
          <div class="relic-count" :style="{ color: meta.color, borderColor: meta.color + '55' }" v-if="forge.orbs[id] > 0">×{{ forge.orbs[id] }}</div>
          <div class="relic-count relic-count--empty" v-else>×0</div>
        </div>
        <div class="relic-body">
          <div class="relic-name" :style="{ color: meta.color }">{{ meta.label }}</div>
          <div class="relic-rarity">Arsenal · Consumable</div>
          <p class="relic-desc">{{ meta.desc }}</p>
          <div class="relic-hint" v-if="forge.orbs[id] > 0">Go to Arsenal → Forge to apply.</div>
          <div class="relic-hint empty" v-else>Craft at Arsenal → Forge or buy with 💎 Diamonds.</div>
        </div>
      </div>

      <!-- Placeholder slot for future items -->
      <div class="relic-card relic-card--locked">
        <div class="relic-img-wrap locked-wrap">
          <div class="locked-icon">?</div>
        </div>
        <div class="relic-body">
          <div class="relic-name locked-name">Unknown Relic</div>
          <div class="relic-rarity">???</div>
          <p class="relic-desc locked-desc">Not yet discovered.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { useInventoryStore } from '../stores/useInventoryStore.js'
import { useForgeStore } from '../stores/useForgeStore.js'
const _B = import.meta.env.BASE_URL
const soulVesselImg = _B + 'ui/soulvessel.png'
import OrbIcon from './OrbIcon.vue'

const inventory = useInventoryStore()
const forge     = useForgeStore()
</script>

<style scoped>
.relics-view {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.relics-header { display: flex; flex-direction: column; gap: 4px; }
.relics-title {
  font-family: var(--font-head);
  font-size: 1rem;
  font-weight: 800;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 2px;
}
.relics-subtitle {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.relics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

/* ── Relic card ── */
.relic-card {
  display: flex;
  gap: 16px;
  background: linear-gradient(135deg, #140c04 0%, #1c1208 100%);
  border: 1px solid #5c3a14;
  border-radius: 10px;
  padding: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.relic-card:hover:not(.relic-card--locked) {
  border-color: var(--gold-dim);
  box-shadow: 0 4px 24px rgba(0,0,0,0.5);
}
.relic-card.empty {
  opacity: 0.6;
  border-color: #2a1a08;
}
.relic-card--locked {
  opacity: 0.3;
  border-color: #1a1208;
  border-style: dashed;
}

/* Image */
.relic-img-wrap {
  position: relative;
  flex-shrink: 0;
  width: 88px;
  height: 88px;
}
.relic-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(180,100,0,0.35));
}
.relic-count {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: #1c0e04;
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--gold);
  padding: 1px 7px;
  line-height: 1.4;
}
.relic-count--empty {
  color: #444;
  border-color: #2a1a08;
}
.locked-wrap {
  background: #0e0804;
  border: 1px dashed #2a1a08;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.locked-icon {
  font-size: 2rem;
  color: #2a1a08;
  font-weight: 900;
}

/* Body */
.relic-body {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
  min-width: 0;
}
.relic-name {
  font-family: var(--font-head);
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--text-parchment);
}
.locked-name { color: #2a1a08; }
.relic-rarity {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffd700;
}
.relic-desc {
  font-size: 0.7rem;
  color: #887;
  line-height: 1.5;
  margin-top: 2px;
}
.relic-desc strong { color: #aa77ff; }
.locked-desc { color: #2a1a08; }
.relic-obtain {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.62rem;
  color: #554;
  margin-top: 2px;
}
.obtain-icon { font-size: 0.7rem; color: #cc4422; }
.relic-hint {
  font-size: 0.65rem;
  color: #4dff88;
  font-style: italic;
  margin-top: 2px;
}
.relic-hint.empty { color: #443; }

.orb-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0602;
  border: 1px solid #2a1a08;
  border-radius: 8px;
}
</style>
