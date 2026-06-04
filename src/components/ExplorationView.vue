<template>
  <div class="exploration-view">

    <!-- ── Forging Materials ──────────────────────────────────────── -->
    <div class="section-header">
      <h3 class="section-title">Forging Materials</h3>
      <p class="section-sub">Materials drop from Expeditions and are used to craft Orbs in the Arsenal → Forge tab.</p>
    </div>

    <div class="materials-grid">
      <div
        v-for="(meta, id) in MATERIALS"
        :key="id"
        class="mat-card"
        :style="{ '--mat-color': meta.color }"
      >
        <span class="mat-gem">◆</span>
        <div class="mat-info">
          <div class="mat-name">{{ meta.label }}</div>
          <div class="mat-desc">{{ meta.desc }}</div>
        </div>
        <div class="mat-qty">{{ forgeStore.materials[id] }}</div>
      </div>
    </div>

    <!-- Drop sources -->
    <div class="section-header" style="margin-top: 24px;">
      <h3 class="section-title">Drop Sources</h3>
    </div>

    <div class="sources-table">
      <div class="source-row header-row">
        <span>Tier</span>
        <span>Material</span>
        <span>Notes</span>
      </div>
      <div class="source-row">
        <span class="tier easy">Easy</span>
        <span><span class="mat-dot" style="color:#888">◆</span> Ashen Fragment</span>
        <span class="note">70% chance, +1 (25% chance for +2)</span>
      </div>
      <div class="source-row">
        <span class="tier medium">Medium</span>
        <span><span class="mat-dot" style="color:#888">◆</span> Ashen Fragment</span>
        <span class="note">80% chance, +1–2</span>
      </div>
      <div class="source-row">
        <span class="tier medium">Medium</span>
        <span><span class="mat-dot" style="color:#ff7722">◆</span> Ember Shard</span>
        <span class="note">20% chance, +1</span>
      </div>
      <div class="source-row">
        <span class="tier hard">Hard</span>
        <span><span class="mat-dot" style="color:#ff7722">◆</span> Ember Shard</span>
        <span class="note">Guaranteed +1–2</span>
      </div>
      <div class="source-row">
        <span class="tier hard">Hard</span>
        <span><span class="mat-dot" style="color:#aa44ff">◆</span> Void Crystal</span>
        <span class="note">18% chance, +1</span>
      </div>
      <div class="source-row">
        <span class="tier nightmare">Nightmare</span>
        <span><span class="mat-dot" style="color:#aa44ff">◆</span> Void Crystal</span>
        <span class="note">Guaranteed +1–2</span>
      </div>
      <div class="source-row">
        <span class="tier nightmare">Nightmare</span>
        <span><span class="mat-dot" style="color:#ff7722">◆</span> Ember Shard</span>
        <span class="note">30% chance, +1</span>
      </div>
    </div>

    <!-- Orb inventory -->
    <div class="section-header" style="margin-top: 32px;">
      <h3 class="section-title">Orb Inventory</h3>
      <p class="section-sub">Craft orbs in Arsenal → Forge and apply them to Legendary or Mythical gear to re-roll discovery lines.</p>
    </div>

    <div class="orbs-grid">
      <div
        v-for="(meta, id) in CUBES"
        :key="id"
        class="orb-card"
        :style="{ '--orb-color': meta.color }"
      >
        <OrbIcon :orbId="id" :size="48" />
        <div class="orb-info">
          <div class="orb-name">{{ meta.label }}</div>
          <div class="orb-desc">{{ meta.desc }}</div>
        </div>
        <div class="orb-qty">×{{ forgeStore.orbs[id] }}</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useForgeStore, MATERIALS, ORBS } from '../stores/useForgeStore.js'
import OrbIcon from './OrbIcon.vue'
const CUBES = ORBS

const forgeStore = useForgeStore()
</script>

<style scoped>
.exploration-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 24px 40px;
}
.section-header { margin-bottom: 14px; }
.section-title {
  font-family: var(--font-head);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
}
.section-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* Materials grid */
.materials-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mat-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #120a04;
  border: 1px solid var(--border-brown);
  border-radius: 8px;
  padding: 12px 16px;
  transition: border-color 0.15s;
}
.mat-card:hover { border-color: var(--mat-color); }
.mat-gem { font-size: 1.4rem; color: var(--mat-color); flex-shrink: 0; }
.mat-info { flex: 1; }
.mat-name { font-size: 0.8rem; font-weight: 700; color: var(--mat-color); }
.mat-desc { font-size: 0.66rem; color: var(--text-muted); margin-top: 2px; }
.mat-qty {
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--mat-color);
  min-width: 40px;
  text-align: right;
}

/* Drop sources table */
.sources-table { display: flex; flex-direction: column; gap: 2px; }
.source-row {
  display: grid;
  grid-template-columns: 100px 200px 1fr;
  gap: 12px;
  align-items: center;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 0.7rem;
  color: var(--text-muted);
}
.source-row.header-row {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dim);
  padding-bottom: 4px;
}
.source-row:not(.header-row):nth-child(even) { background: #0e0805; }
.tier {
  font-family: var(--font-head);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 4px;
  padding: 2px 8px;
  text-align: center;
}
.tier.easy      { background: #0e1a0a; color: #66bb44; border: 1px solid #226611; }
.tier.medium    { background: #101808; color: #88cc22; border: 1px solid #336611; }
.tier.hard      { background: #1a1008; color: #cc8833; border: 1px solid #663311; }
.tier.nightmare { background: #180a1a; color: #aa44ff; border: 1px solid #661188; }
.mat-dot { font-size: 0.75rem; }
.note { font-size: 0.64rem; color: var(--text-dim); }

/* Orb grid */
.orbs-grid { display: flex; flex-direction: column; gap: 8px; }
.orb-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #120a04;
  border: 1px solid var(--border-brown);
  border-radius: 8px;
  padding: 12px 16px;
  transition: border-color 0.15s;
}
.orb-card:hover { border-color: var(--orb-color); }
.orb-info { flex: 1; }
.orb-name { font-size: 0.8rem; font-weight: 700; color: var(--orb-color); }
.orb-desc { font-size: 0.66rem; color: var(--text-muted); margin-top: 2px; }
.orb-qty {
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--orb-color);
  min-width: 40px;
  text-align: right;
}
</style>
