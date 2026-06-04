<template>
  <div class="summon-scene" :style="{ backgroundImage: `url(${recruitmentBg})` }">
  <div class="summon-wrap">
    <div class="summon-header">
      <div class="summon-eyebrow">The Adventurers' Hall</div>
      <h2 class="summon-title">Recruiting Grounds</h2>
      <p class="summon-sub">You are a hedge knight without a banner. Post your call — champions seek gold, glory, and a worthy cause.</p>
    </div>

    <div class="debug-bar">
      <span class="debug-label">Dev</span>
      <button class="debug-btn" @click="currency.addGold(10000)">+10k 🪙</button>
      <button class="debug-btn" @click="currency.addDiamonds(10000)">+10k 💎</button>
      <button class="debug-btn" @click="energyDev.add(energyDev.maxEnergy)">Full ⚡</button>
      <button class="debug-btn" @click="collection.unlockAll()">⚑ Unlock All</button>
      <button class="debug-btn debug-btn--danger" @click="confirmReset">↺ Reset</button>
    </div>

    <div class="portals-grid">
      <SummonPortal
        v-for="portal in Object.values(store.PORTALS)"
        :key="portal.id"
        :portal="portal"
        :canAfford="store.canAfford(portal.id)"
        :canAfford10="store.canAfford10(portal.id)"
        :pulling="store.pulling"
        :progress="store.pityProgress(portal.id)"
        @summon="store.summon($event)"
        @summon10="store.summon10($event)"
      />
    </div>
  </div>
  </div>

  <!-- Result reveal -->
  <Teleport to="body">
    <div class="result-backdrop" v-if="store.lastResult" @click.self="store.dismissResult()">
      <div class="result-card" :class="store.lastResult.rarity.toLowerCase()">
        <div class="result-sweep" v-if="store.lastResult.rarity === 'Legendary' || store.lastResult.rarity === 'Epic'" />

        <div class="result-flash" :class="store.lastResult.rarity.toLowerCase()" />

        <div class="result-portal-label">{{ portalLabel }} Portal</div>

        <div class="result-rarity" :class="store.lastResult.rarity.toLowerCase()">
          {{ store.lastResult.rarity }}
        </div>

        <div class="result-hero-icon">
          <HeroAvatar :hero="store.lastResult.hero" :size="96" />
        </div>

        <div class="result-hero-name">{{ store.lastResult.hero.name }}</div>

        <div class="result-meta">
          <span class="meta-chip">{{ store.lastResult.hero.faction }}</span>
          <span class="meta-chip affinity" :class="store.lastResult.hero.affinity.toLowerCase()">
            {{ store.lastResult.hero.affinity }}
          </span>
        </div>

        <!-- Stats preview -->
        <div class="result-stats">
          <span>❤ {{ store.lastResult.hero.baseHp.toLocaleString() }}</span>
          <span>⚔ {{ store.lastResult.hero.baseAtk }}</span>
          <span>🛡 {{ store.lastResult.hero.baseDef }}</span>
          <span>💨 {{ store.lastResult.hero.baseSpd }}</span>
        </div>

        <!-- Duplicate notice -->
        <div class="duplicate-banner" v-if="store.lastResult.isDuplicate">
          <span class="dup-icon">↺</span>
          Already owned — received
          <strong v-if="store.lastResult.compensation?.gold">
            🪙 {{ store.lastResult.compensation.gold }} gold
          </strong>
          <strong v-else-if="store.lastResult.compensation?.diamonds">
            💎 {{ store.lastResult.compensation.diamonds }} diamonds
          </strong>
          in return
        </div>
        <div class="new-banner" v-else>
          ✦ Added to your collection!
        </div>

        <button class="dismiss-btn" @click="store.dismissResult()">Continue</button>
      </div>
    </div>
  </Teleport>

  <!-- 10x result reveal -->
  <Teleport to="body">
    <div class="result-backdrop" v-if="store.lastResults.length" @click.self="store.dismissResults()">
      <div class="multi-result-card">
        <div class="multi-header">
          <div class="multi-title">×10 Summon</div>
          <div class="multi-sub">
            <span class="new-count">{{ store.lastResults.filter(r => !r.isDuplicate).length }} new</span>
            &nbsp;·&nbsp;
            <span class="dup-count">{{ store.lastResults.filter(r => r.isDuplicate).length }} duplicates</span>
          </div>
        </div>
        <div class="multi-grid">
          <div
            v-for="(result, i) in store.lastResults"
            :key="i"
            class="multi-hero-card"
            :class="result.rarity.toLowerCase()"
            :style="{ '--card-i': i }"
          >
            <div class="mh-flash" :class="result.rarity.toLowerCase()" />
            <div class="mh-icon">
              <HeroAvatar :hero="result.hero" :size="52" />
            </div>
            <div class="mh-name">{{ result.hero.name }}</div>
            <div class="mh-rarity" :class="result.rarity.toLowerCase()">{{ result.rarity }}</div>
            <div class="mh-badge new-badge" v-if="!result.isDuplicate">NEW</div>
            <div class="mh-badge dup-badge" v-else>DUP</div>
          </div>
        </div>
        <button class="dismiss-btn" @click="store.dismissResults()">Continue</button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import recruitmentBg from '../assets/backgrounds/recruitment_bg.png'
import { useSummonStore } from '../stores/useSummonStore.js'
import { useCurrencyStore } from '../stores/useCurrencyStore.js'
import { useEnergyStore } from '../stores/useEnergyStore.js'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import SummonPortal from './SummonPortal.vue'
import HeroAvatar from './HeroAvatar.vue'

const store = useSummonStore()
const currency = useCurrencyStore()
const energyDev = useEnergyStore()
const collection = useCollectionStore()

function confirmReset() {
  if (!confirm('Reset all progress and start over? This cannot be undone.')) return
  localStorage.clear()
  location.reload()
}

const portalLabel = computed(() =>
  store.lastResult?.portal === 'void' ? 'Void' : 'Ancient'
)
</script>

<style scoped>
.summon-scene {
  min-height: calc(100vh - 64px);
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  background-color: var(--bg-deep);
  position: relative;
}
.summon-scene::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(5,3,1,0.78) 0%,
    rgba(5,3,1,0.50) 30%,
    rgba(5,3,1,0.65) 100%
  );
  pointer-events: none;
}

.summon-wrap {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.summon-header {
  text-align: center;
  margin-bottom: 40px;
}
.summon-eyebrow {
  font-family: var(--font-head);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--gold-dim);
  margin-bottom: 8px;
  text-shadow: 0 1px 6px rgba(0,0,0,0.95);
}
.summon-title {
  font-family: var(--font-head);
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--gold);
  text-shadow: 0 0 40px rgba(201,162,39,0.4), 0 2px 8px rgba(0,0,0,0.9);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.summon-sub {
  font-size: 0.82rem;
  color: #b9b9b9;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 0 1px 6px rgba(0,0,0,0.95), 0 2px 16px rgba(0,0,0,0.85);
}

.debug-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(10,4,2,0.88);
  border: 1px dashed #5c2810;
  border-radius: 6px;
  width: fit-content;
  position: fixed;
  bottom: 16px;
  left: 16px;
  z-index: 50;
}
.debug-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #5c2810;
  font-weight: 700;
}
.debug-btn {
  background: #221108;
  border: 1px solid #5c2810;
  border-radius: 4px;
  color: #888;
  font-size: 0.72rem;
  padding: 3px 10px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.debug-btn:hover { color: #ffd700; border-color: #ffd700; }
.debug-btn--danger:hover { color: #ff6b6b; border-color: #ff6b6b66; }

.portals-grid {
  display: flex;
  justify-content: center;
}
.portals-grid > * {
  width: 100%;
  max-width: 480px;
}

/* Result overlay */
.result-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex; align-items: center; justify-content: center;
  z-index: 400;
  backdrop-filter: blur(4px);
  animation: backdrop-in 0.25s ease both;
}
.result-card {
  background: #130908;
  border-radius: 16px;
  padding: 32px 28px;
  width: min(380px, 94vw);
  text-align: center;
  position: relative;
  overflow: hidden;
  border: 2px solid #3e1c0c;
  animation: card-drop-in 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.result-card.legendary {
  border-color: #ffd700;
  animation: card-drop-in 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) both,
             glow-legendary 2.2s 0.9s ease-in-out infinite;
}
.result-card.epic {
  border-color: #b44fff;
  animation: card-drop-in 0.52s cubic-bezier(0.34, 1.56, 0.64, 1) both,
             glow-epic 2.2s 0.9s ease-in-out infinite;
}
.result-card.rare      { border-color: #4fa8ff; }
.result-card.uncommon  { border-color: #4dff88; }
.result-card.common    { border-color: #555; }

/* Light sweep for high-rarity pulls */
.result-sweep {
  position: absolute; top: 0; left: -60%;
  width: 45%; height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent);
  transform: skewX(-15deg);
  pointer-events: none;
  animation: sweep 0.9s 0.3s ease-out forwards;
}

/* Background glow */
.result-flash {
  position: absolute; inset: 0; border-radius: 16px;
  pointer-events: none;
  animation: flash-burst 1s ease-out both;
}
.result-flash.legendary { background: radial-gradient(circle, #ffd700, transparent 65%); }
.result-flash.epic      { background: radial-gradient(circle, #b44fff, transparent 65%); }
.result-flash.rare      { background: radial-gradient(circle, #4fa8ff, transparent 65%); }
.result-flash.uncommon  { background: radial-gradient(circle, #4dff88, transparent 65%); }
.result-flash.common    { opacity: 0; }

.result-portal-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 2px; color: #444; margin-bottom: 10px; animation: fade-up 0.3s 0.25s both; }

.result-rarity { font-size: 0.72rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px; animation: fade-up 0.35s 0.3s both; }
.result-rarity.legendary { color: #ffd700; }
.result-rarity.epic      { color: #b44fff; }
.result-rarity.rare      { color: #4fa8ff; }
.result-rarity.uncommon  { color: #4dff88; }
.result-rarity.common    { color: #888; }

.result-hero-icon { display: flex; justify-content: center; margin-bottom: 10px; animation: avatar-pop 0.55s 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.result-hero-name { font-size: 1.4rem; font-weight: 800; color: #fff; margin-bottom: 10px; animation: fade-up 0.4s 0.42s both; }

.result-meta  { display: flex; justify-content: center; gap: 8px; margin-bottom: 14px; animation: fade-up 0.35s 0.52s both; }
.meta-chip    { font-size: 0.68rem; padding: 2px 10px; border-radius: 20px; background: #221108; color: #888; }
.meta-chip.affinity.force   { background: #3a1a0a; color: #ff8c42; }
.meta-chip.affinity.magic   { background: #0a1a3a; color: #4fa8ff; }
.meta-chip.affinity.spirit  { background: #0a2a1a; color: #4dff88; }
.meta-chip.affinity.void    { background: #1a0a2a; color: #b44fff; }

.result-stats { display: flex; justify-content: center; gap: 14px; font-size: 0.72rem; color: #888; margin-bottom: 18px; animation: fade-up 0.35s 0.58s both; }

.duplicate-banner, .new-banner {
  font-size: 0.78rem; padding: 8px 14px; border-radius: 6px; margin-bottom: 20px;
  animation: fade-up 0.35s 0.64s both;
}
.duplicate-banner { background: #2a1a00; color: #ff9944; border: 1px solid #5a3a00; }
.duplicate-banner strong { color: #ffd700; }
.new-banner { background: #0a2a0a; color: #4dff88; border: 1px solid #1a5a1a; }

.dismiss-btn {
  background: linear-gradient(135deg, #6a1a0a, #a02a10);
  border: none; border-radius: 8px;
  color: #fff; font-size: 0.9rem; font-weight: 700;
  padding: 11px 40px; cursor: pointer;
  transition: opacity 0.15s;
  animation: fade-up 0.35s 0.72s both;
}
.dismiss-btn:hover { opacity: 0.85; }

/* 10x multi-result overlay */
.multi-result-card {
  background: #130908;
  border: 2px solid #3e1c0c;
  border-radius: 16px;
  padding: 24px 20px;
  width: min(860px, 96vw);
  text-align: center;
}
.multi-header    { margin-bottom: 16px; }
.multi-title     { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
.multi-sub       { font-size: 0.78rem; color: #666; }
.new-count       { color: #4dff88; font-weight: 700; }
.dup-count       { color: #ff9944; font-weight: 700; }

.multi-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}
@media (max-width: 600px) { .multi-grid { grid-template-columns: repeat(2, 1fr); } }

.multi-hero-card {
  background: #150a07;
  border: 1px solid #3e1c0c;
  border-radius: 10px;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  position: relative;
  overflow: hidden;
  animation: card-pop-in 0.42s calc(var(--card-i, 0) * 80ms) cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.multi-hero-card.legendary {
  border-color: #ffd700;
  animation: card-pop-in 0.42s calc(var(--card-i, 0) * 80ms) cubic-bezier(0.34, 1.56, 0.64, 1) both,
             glow-legendary 2.2s calc(var(--card-i, 0) * 80ms + 0.8s) ease-in-out infinite;
}
.multi-hero-card.epic {
  border-color: #b44fff;
  animation: card-pop-in 0.42s calc(var(--card-i, 0) * 80ms) cubic-bezier(0.34, 1.56, 0.64, 1) both,
             glow-epic 2.2s calc(var(--card-i, 0) * 80ms + 0.8s) ease-in-out infinite;
}
.multi-hero-card.rare      { border-color: #4fa8ff; }
.multi-hero-card.uncommon  { border-color: #4dff88; }

.mh-flash {
  position: absolute; inset: 0; pointer-events: none;
  opacity: 0.07;
}
.mh-flash.legendary { background: radial-gradient(circle, #ffd700, transparent 70%); }
.mh-flash.epic      { background: radial-gradient(circle, #b44fff, transparent 70%); }
.mh-flash.rare      { background: radial-gradient(circle, #4fa8ff, transparent 70%); }
.mh-flash.uncommon  { background: radial-gradient(circle, #4dff88, transparent 70%); }

.mh-icon    { display: flex; justify-content: center; }
.mh-name    { font-size: 0.65rem; font-weight: 600; color: #ccc; text-align: center; line-height: 1.2; }
.mh-rarity  { font-size: 0.58rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
.mh-rarity.legendary { color: #ffd700; }
.mh-rarity.epic      { color: #b44fff; }
.mh-rarity.rare      { color: #4fa8ff; }
.mh-rarity.uncommon  { color: #4dff88; }
.mh-rarity.common    { color: #666; }

.mh-badge    { font-size: 0.55rem; font-weight: 800; letter-spacing: 1px; padding: 1px 6px; border-radius: 4px; }
.new-badge   { background: #0a2a0a; color: #4dff88; border: 1px solid #1a5a1a; }
.dup-badge   { background: #2a1a00; color: #ff9944; border: 1px solid #5a3a00; }

/* ── Keyframes ── */
@keyframes backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes card-drop-in {
  0%   { transform: scale(0.5) translateY(-50px); opacity: 0; }
  65%  { transform: scale(1.06) translateY(3px); opacity: 1; }
  82%  { transform: scale(0.97); }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

@keyframes flash-burst {
  0%   { opacity: 0.75; }
  30%  { opacity: 0.45; }
  100% { opacity: 0.06; }
}

@keyframes avatar-pop {
  0%   { transform: scale(0.15) rotate(-20deg); opacity: 0; filter: brightness(4); }
  55%  { transform: scale(1.18) rotate(4deg);   opacity: 1; filter: brightness(1.6); }
  78%  { transform: scale(0.94) rotate(-1deg);  filter: brightness(1); }
  100% { transform: scale(1) rotate(0);         opacity: 1; filter: brightness(1); }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes sweep {
  from { left: -60%; }
  to   { left: 130%; }
}

@keyframes card-pop-in {
  0%   { transform: scale(0.4) rotateY(-50deg); opacity: 0; }
  70%  { transform: scale(1.07) rotateY(5deg);  opacity: 1; }
  100% { transform: scale(1) rotateY(0);        opacity: 1; }
}

@keyframes glow-legendary {
  0%, 100% { box-shadow: 0 0 18px rgba(255,215,0,0.25), inset 0 0 18px rgba(255,215,0,0.04); }
  50%       { box-shadow: 0 0 55px rgba(255,215,0,0.55), inset 0 0 30px rgba(255,215,0,0.10); }
}

@keyframes glow-epic {
  0%, 100% { box-shadow: 0 0 18px rgba(180,79,255,0.25), inset 0 0 18px rgba(180,79,255,0.04); }
  50%       { box-shadow: 0 0 55px rgba(180,79,255,0.55), inset 0 0 30px rgba(180,79,255,0.10); }
}
</style>
