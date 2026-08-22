<template>
  <div class="mythos-app" :style="{ backgroundImage: `url(${MYTHOS_ART.bg})` }">
    <!-- Scrims: darken sky for the lockup, ground for the menu -->
    <div class="scrim scrim--top" />
    <div class="scrim scrim--bottom" />
    <div class="vignette" />

    <button class="hub-btn" @click="worldStore.exitWorld()" title="Return to realm select">⟵</button>

    <!-- ── Title lockup ── -->
    <header class="lockup">
      <img :src="MYTHOS_ART.logo" class="crest" alt="" />
      <h1 class="wordmark">Mythos Dominion</h1>
      <div class="rule">
        <span class="rule-line" />
        <span class="rule-gem">✦</span>
        <span class="rule-line" />
      </div>
      <p class="tagline">Favor the Gods</p>
    </header>

    <!-- ── Choose a pantheon — the sigils are the menu ── -->
    <section class="pantheon-row">
      <button
        v-for="p in PANTHEONS"
        :key="p.id"
        class="pantheon-card"
        :style="{ '--pc': p.color, '--pa': p.accent }"
        @click="choose(p)"
      >
        <img :src="p.sigil" class="pantheon-sigil" :alt="p.name" />
        <p class="pantheon-name">{{ p.name }}</p>
        <p class="pantheon-title">{{ p.title }}</p>
        <div class="pantheon-detail">
          <p class="pantheon-favor">{{ p.favor.name }}</p>
          <p class="pantheon-how">{{ p.favor.how }}</p>
        </div>
        <span class="pantheon-swear">{{ p.favor.verb }}</span>
      </button>
    </section>

    <p class="footer-note">The gods are watching. Give them a reason.</p>
  </div>
</template>

<script setup>
import { useWorldStore } from '../../stores/useWorldStore.js'
import { PANTHEONS, MYTHOS_ART } from '../../game/data/mythos/pantheons.js'

const worldStore = useWorldStore()

// TODO: hand off to Mythos character creation once useMythosPlayerStore exists.
function choose(pantheon) {
  console.info('[mythos] pantheon chosen:', pantheon.id)
}
</script>

<style scoped>
.mythos-app {
  --gold:       #c9a227;
  --gold-lit:   #e8c766;
  --gold-dim:   #8a6f2e;
  --stone:      #b9b2a4;
  --stone-dim:  #6d675c;
  --ink:        #07080b;
  --font-display: 'Marcellus SC', 'Cinzel', Georgia, serif;
  --font-body:    'Cormorant Garamond', Georgia, serif;

  position: relative;
  height: 100vh;
  overflow: hidden;
  background-size: cover;
  background-position: center 42%;
  background-color: var(--ink);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-body);
  color: var(--stone);
}

/* ── Scrims ── */
.scrim { position: absolute; left: 0; right: 0; pointer-events: none; }
.scrim--top {
  top: 0; height: 58%;
  background: linear-gradient(180deg, rgba(5,6,9,0.92) 0%, rgba(5,6,9,0.72) 34%, rgba(5,6,9,0.18) 72%, transparent 100%);
}
.scrim--bottom {
  bottom: 0; height: 46%;
  background: linear-gradient(0deg, rgba(4,5,8,0.96) 0%, rgba(4,5,8,0.74) 38%, transparent 100%);
}
.vignette {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 46%, transparent 38%, rgba(3,4,7,0.72) 100%);
}

/* ── Hub return ── */
.hub-btn {
  position: absolute; top: 20px; left: 22px; z-index: 10;
  width: 34px; height: 34px;
  display: grid; place-items: center;
  background: rgba(8,9,13,0.6);
  border: 1px solid rgba(201,162,39,0.28);
  border-radius: 4px;
  color: var(--stone-dim);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s, background 0.2s;
}
.hub-btn:hover { color: var(--gold-lit); border-color: rgba(201,162,39,0.65); background: rgba(14,12,10,0.8); }

/* ── Title lockup ── */
.lockup {
  position: relative;
  z-index: 5;
  margin-top: clamp(14px, 3.5vh, 44px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.crest {
  width: clamp(150px, 19vh, 260px);
  height: auto;
  filter: drop-shadow(0 10px 26px rgba(0,0,0,0.85)) drop-shadow(0 0 34px rgba(201,162,39,0.16));
}
.wordmark {
  margin-top: clamp(2px, 1vh, 12px);
  font-family: var(--font-display);
  font-size: clamp(2.1rem, 5.6vw, 4.6rem);
  font-weight: 400;
  letter-spacing: 0.13em;
  line-height: 1;
  color: #f2e4bf;
  text-shadow:
    0 2px 0 rgba(0,0,0,0.6),
    0 0 26px rgba(201,162,39,0.42),
    0 0 70px rgba(180,140,50,0.22);
  background: linear-gradient(180deg, #fbf1d6 0%, #e4c87e 48%, #a8802c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.rule {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  width: clamp(220px, 32vw, 460px);
}
.rule-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(201,162,39,0.72), transparent);
}
.rule-gem { color: var(--gold); font-size: 0.7rem; }
.tagline {
  margin-top: 10px;
  font-family: var(--font-display);
  font-size: clamp(0.72rem, 1.5vw, 1.05rem);
  letter-spacing: 0.44em;
  text-indent: 0.44em;
  color: #cbb27f;
  text-shadow: 0 0 18px rgba(201,162,39,0.4);
}

/* ── Pantheon row — the sigils carry the screen ── */
.pantheon-row {
  position: relative;
  z-index: 5;
  margin-top: auto;
  margin-bottom: clamp(10px, 2vh, 24px);
  display: flex;
  gap: clamp(10px, 1.6vw, 24px);
}
.pantheon-card {
  width: clamp(150px, 16vw, 226px);
  padding: clamp(14px, 1.8vh, 22px) clamp(12px, 1.2vw, 20px) clamp(12px, 1.6vh, 18px);
  background: linear-gradient(180deg, rgba(12,12,16,0.78), rgba(7,7,10,0.9));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 3px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.22s, transform 0.22s, box-shadow 0.22s, background 0.22s;
}
.pantheon-card:hover {
  border-color: var(--pc);
  transform: translateY(-5px);
  background: linear-gradient(180deg, rgba(18,17,21,0.88), rgba(9,9,12,0.94));
  box-shadow: 0 14px 34px rgba(0,0,0,0.66), 0 0 26px color-mix(in srgb, var(--pa) 34%, transparent);
}
.pantheon-sigil {
  width: clamp(74px, 8vw, 116px);
  height: auto;
  filter: drop-shadow(0 5px 14px rgba(0,0,0,0.75));
  transition: filter 0.22s, transform 0.22s;
}
.pantheon-card:hover .pantheon-sigil {
  transform: scale(1.04);
  filter: drop-shadow(0 6px 18px rgba(0,0,0,0.8))
          drop-shadow(0 0 16px color-mix(in srgb, var(--pa) 55%, transparent));
}
.pantheon-name {
  margin-top: 10px;
  font-family: var(--font-display);
  font-size: clamp(0.82rem, 1.1vw, 1rem);
  letter-spacing: 0.16em;
  color: var(--pc);
}
.pantheon-title {
  margin-top: 3px;
  font-size: clamp(0.62rem, 0.85vw, 0.76rem);
  font-style: italic;
  color: var(--stone-dim);
}
.pantheon-detail {
  margin-top: 10px;
  padding-top: 9px;
  border-top: 1px solid rgba(255,255,255,0.07);
}
.pantheon-favor {
  font-family: var(--font-display);
  font-size: clamp(0.66rem, 0.9vw, 0.78rem);
  letter-spacing: 0.14em;
  color: var(--pa);
}
.pantheon-how {
  margin-top: 5px;
  font-size: clamp(0.62rem, 0.82vw, 0.72rem);
  line-height: 1.45;
  color: #8e877a;
}
.pantheon-swear {
  display: block;
  margin-top: 11px;
  font-family: var(--font-display);
  font-size: clamp(0.58rem, 0.78vw, 0.68rem);
  letter-spacing: 0.2em;
  color: #4e483f;
  transition: color 0.22s;
}
.pantheon-card:hover .pantheon-swear { color: var(--pc); }

/* ── Footer ── */
.footer-note {
  position: relative;
  z-index: 5;
  margin-bottom: clamp(10px, 2vh, 20px);
  font-size: clamp(0.6rem, 0.85vw, 0.74rem);
  font-style: italic;
  letter-spacing: 0.08em;
  color: #55504a;
}

@media (max-height: 760px) {
  .crest { width: clamp(110px, 15vh, 180px); }
  .pantheon-sigil { width: clamp(58px, 6.5vw, 88px); }
  .pantheon-card { padding-top: 12px; }
}
</style>
