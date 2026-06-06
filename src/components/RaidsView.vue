<template>
  <div class="raids-wrap">

    <!-- Raid list (left) -->
    <div class="raid-list">
      <div class="list-header">
        <h2 class="list-title">Raids</h2>
        <p class="list-sub">Team content. Legendary encounters with unique mechanics and phase transitions.</p>
      </div>

      <div
        v-for="raid in RAIDS"
        :key="raid.id"
        class="raid-card"
        :class="{ selected: selected?.id === raid.id }"
        @click="selected = raid"
      >
        <div class="rc-bg" :style="bgStyle(raid)" />
        <div class="rc-overlay" />
        <div class="rc-content">
          <div class="rc-subtitle">{{ raid.subtitle }}</div>
          <div class="rc-name">{{ raid.name }}</div>
          <div class="rc-boss">{{ raid.boss }}</div>
          <div class="rc-stars">
            <span v-for="i in 5" :key="i" class="star" :class="{ filled: i <= raid.difficulty }">★</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lore detail panel (right) -->
    <div class="raid-detail" v-if="selected">

      <!-- Header image -->
      <div class="detail-banner" :style="bgStyle(selected)">
        <div class="banner-vignette" />
        <div class="banner-text">
          <div class="banner-sub">{{ selected.subtitle }}</div>
          <h1 class="banner-title">{{ selected.name }}</h1>
          <p class="banner-setting">{{ selected.setting }}</p>
        </div>
      </div>

      <!-- Features -->
      <div class="lore-section">
        <div class="lore-label">Arena Features</div>
        <ul class="feature-list">
          <li v-for="f in selected.features" :key="f" class="feature-item">
            <span class="feature-dot">◆</span> {{ f }}
          </li>
        </ul>
      </div>

      <!-- Phases -->
      <div class="lore-section">
        <div class="lore-label">Encounter Phases</div>
        <div class="phases">
          <div v-for="phase in selected.phases" :key="phase.number" class="phase-block" :class="`phase-${phase.number}`">
            <div class="phase-header">
              <span class="phase-num">Phase {{ phase.number }}</span>
              <span class="phase-separator">—</span>
              <span class="phase-name">{{ phase.name }}</span>
              <span class="phase-threshold" v-if="phase.threshold">at {{ phase.threshold }}% HP</span>
            </div>

            <div class="phase-transition" v-if="phase.transition">{{ phase.transition }}</div>
            <p class="phase-desc">{{ phase.description }}</p>

            <div class="ability-list">
              <div v-for="ab in phase.abilities" :key="ab.name" class="ability-row">
                <span class="ability-name">{{ ab.name }}</span>
                <span class="ability-desc">{{ ab.description }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Final quote -->
      <div class="final-quote-block">
        <div class="quote-bar" />
        <blockquote class="final-quote">
          <span v-for="(line, i) in selected.finalQuote.split('\n')" :key="i">
            {{ line }}<br v-if="i < selected.finalQuote.split('\n').length - 1" />
          </span>
        </blockquote>
        <div class="quote-attribution">— {{ selected.boss }}</div>
      </div>

      <!-- Enter button -->
      <div class="enter-row">
        <button class="btn-enter" disabled>
          Enter the Throne
          <span class="enter-note">· Battle mechanics coming soon</span>
        </button>
      </div>

    </div>

    <!-- Empty state -->
    <div class="raid-empty" v-else>
      <div class="empty-icon">⚔</div>
      <p>Select a raid to read its lore.</p>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RAIDS } from '../game/data/raids.js'

const _raidBgs = import.meta.glob('../assets/dungeons/Raid_*.png', { eager: true })
const raidBgMap = {}
for (const [path, mod] of Object.entries(_raidBgs)) {
  const key = path.split('/').pop().replace(/\.png$/i, '')
  raidBgMap[key] = mod.default
}

function bgStyle(raid) {
  const url = raidBgMap[raid.bgFile]
  return url ? { backgroundImage: `url(${url})` } : {}
}

const selected = ref(RAIDS[0] ?? null)
</script>

<style scoped>
.raids-wrap {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 600px;
}

/* ── Raid list ──────────────────────────── */
.raid-list {
  border-right: 1px solid var(--border-brown, #3e1c0c);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.list-header { margin-bottom: 4px; }
.list-title {
  font-family: var(--font-head);
  font-size: 1rem;
  font-weight: 800;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 2px;
}
.list-sub {
  font-size: 0.62rem;
  color: var(--text-dim, #666);
  margin-top: 4px;
  line-height: 1.5;
}

.raid-card {
  position: relative;
  height: 130px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #2a1208;
  transition: border-color 0.15s, transform 0.1s;
}
.raid-card:hover { border-color: var(--gold, #c9a227); transform: translateX(2px); }
.raid-card.selected { border-color: var(--gold, #c9a227); border-width: 2px; }

.rc-bg {
  position: absolute; inset: 0;
  background-size: cover; background-position: center top;
  transition: transform 0.3s;
}
.raid-card:hover .rc-bg { transform: scale(1.04); }

.rc-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to right, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.3));
}
.rc-content {
  position: relative;
  padding: 12px 14px;
  display: flex; flex-direction: column; gap: 3px;
  height: 100%; box-sizing: border-box; justify-content: flex-end;
}
.rc-subtitle { font-size: 0.52rem; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-dim, #7a5228); font-family: var(--font-head); }
.rc-name { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: #fff; letter-spacing: 1px; }
.rc-boss { font-size: 0.6rem; color: #aaa; font-style: italic; }
.rc-stars { display: flex; gap: 2px; margin-top: 2px; }
.star { font-size: 0.55rem; color: #2a1208; }
.star.filled { color: var(--gold, #c9a227); }

/* ── Detail panel ───────────────────────── */
.raid-detail {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.detail-banner {
  position: relative;
  height: 280px;
  background-size: cover;
  background-position: center 20%;
  flex-shrink: 0;
}
.banner-vignette {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(8,4,2,1) 100%);
}
.banner-text {
  position: absolute;
  bottom: 24px; left: 28px; right: 28px;
}
.banner-sub {
  font-size: 0.55rem; letter-spacing: 3px; text-transform: uppercase;
  color: var(--gold-dim, #7a5228); font-family: var(--font-head); margin-bottom: 6px;
}
.banner-title {
  font-family: var(--font-head);
  font-size: 1.6rem; font-weight: 900;
  color: #fff; letter-spacing: 2px;
  text-transform: uppercase; line-height: 1.1;
  margin-bottom: 8px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.8);
}
.banner-setting {
  font-size: 0.72rem; color: #bbb; font-style: italic;
}

/* ── Lore sections ─────────────────────── */
.lore-section {
  padding: 20px 28px;
  border-bottom: 1px solid #1a0c06;
}
.lore-label {
  font-family: var(--font-head);
  font-size: 0.55rem; letter-spacing: 2px; text-transform: uppercase;
  color: var(--gold-dim, #7a5228); margin-bottom: 12px; font-weight: 700;
}

.feature-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.feature-item { font-size: 0.72rem; color: #bbb; display: flex; gap: 8px; align-items: flex-start; }
.feature-dot { color: var(--gold-dim, #7a5228); font-size: 0.55rem; margin-top: 2px; flex-shrink: 0; }

/* ── Phases ─────────────────────────────── */
.phases { display: flex; flex-direction: column; gap: 16px; }

.phase-block {
  background: #0d0704;
  border: 1px solid #2a1208;
  border-radius: 8px;
  padding: 16px 18px;
  border-left-width: 3px;
}
.phase-1 { border-left-color: #c9a227; }
.phase-2 { border-left-color: #ff9944; }
.phase-3 { border-left-color: #b44fff; }

.phase-header {
  display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;
}
.phase-num {
  font-family: var(--font-head); font-size: 0.55rem; letter-spacing: 2px;
  text-transform: uppercase; color: var(--gold-dim, #7a5228); font-weight: 700;
}
.phase-separator { color: #3a2010; }
.phase-name { font-family: var(--font-head); font-size: 0.85rem; font-weight: 800; color: #fff; }
.phase-threshold {
  margin-left: auto;
  font-size: 0.6rem; color: #ff6b6b;
  background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.2);
  border-radius: 10px; padding: 1px 8px;
  font-family: var(--font-head); letter-spacing: 1px;
}

.phase-transition {
  font-size: 0.65rem; font-style: italic;
  color: var(--gold, #c9a227); margin-bottom: 6px;
  letter-spacing: 0.5px;
}
.phase-desc {
  font-size: 0.7rem; color: #999; line-height: 1.6; margin-bottom: 12px;
}

.ability-list { display: flex; flex-direction: column; gap: 8px; }
.ability-row { display: flex; flex-direction: column; gap: 2px; }
.ability-name {
  font-family: var(--font-head); font-size: 0.7rem; font-weight: 700;
  color: #ddb; letter-spacing: 0.5px;
}
.ability-desc { font-size: 0.65rem; color: #888; line-height: 1.5; }

/* ── Final quote ────────────────────────── */
.final-quote-block {
  padding: 28px 28px 24px;
  display: flex; flex-direction: column; gap: 12px;
  border-bottom: 1px solid #1a0c06;
}
.quote-bar {
  width: 40px; height: 2px;
  background: linear-gradient(to right, #b44fff, transparent);
}
.final-quote {
  font-family: var(--font-head);
  font-size: 1rem; font-style: italic;
  color: #e0d0ff;
  line-height: 1.9;
  letter-spacing: 0.5px;
  margin: 0;
}
.quote-attribution {
  font-size: 0.62rem; color: var(--gold-dim, #7a5228);
  letter-spacing: 1px; font-family: var(--font-head);
}

/* ── Enter button ───────────────────────── */
.enter-row { padding: 20px 28px; }
.btn-enter {
  background: #1a0a00;
  border: 1px solid var(--gold-dim, #7a5228);
  border-radius: 6px;
  color: var(--gold, #c9a227);
  font-family: var(--font-head);
  font-size: 0.8rem; font-weight: 800;
  letter-spacing: 1px; text-transform: uppercase;
  padding: 12px 28px;
  cursor: not-allowed;
  opacity: 0.6;
  display: flex; align-items: center; gap: 10px;
}
.enter-note { font-size: 0.58rem; font-weight: 400; color: #555; text-transform: none; letter-spacing: 0; }

/* ── Empty state ────────────────────────── */
.raid-empty {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 12px; color: #333; font-size: 0.72rem; font-style: italic;
}
.empty-icon { font-size: 2.5rem; opacity: 0.2; }
</style>
