<template>
  <div class="starter-screen">
    <div class="intro">
      <h1 class="title">Bannerlords of Westrun</h1>
      <p class="lore">The realm fractures. Ancient houses clash for dominion over the Westrun.<br>Every great campaign begins with a single sword.</p>
      <p class="prompt">Choose your first companion — a hedge knight hardened by years on the road.</p>
    </div>

    <div class="pick-grid">
      <div
        v-for="key in HEDGE_KNIGHT_CHOICES"
        :key="key"
        class="pick-card"
        :class="[
          'aff-' + heroes[key].affinity.toLowerCase(),
          { chosen: picked === key }
        ]"
        @click="picked = key"
      >
        <div class="card-avatar">
          <HeroAvatar :hero="heroes[key]" :size="100" />
        </div>

        <div class="card-body">
          <div class="card-meta">
            <span class="rarity rare">Rare</span>
            <span class="affinity" :class="heroes[key].affinity.toLowerCase()">{{ heroes[key].affinity }}</span>
          </div>
          <div class="card-name">{{ heroes[key].name }}</div>
          <div class="card-faction">{{ heroes[key].faction }}</div>

          <div class="card-stats">
            <div class="stat"><span class="sl">HP</span><span class="sv">{{ (heroes[key].baseHp / 1000).toFixed(0) }}k</span></div>
            <div class="stat"><span class="sl">ATK</span><span class="sv">{{ heroes[key].baseAtk }}</span></div>
            <div class="stat"><span class="sl">DEF</span><span class="sv">{{ heroes[key].baseDef }}</span></div>
            <div class="stat"><span class="sl">SPD</span><span class="sv">{{ heroes[key].baseSpd }}</span></div>
          </div>

          <div class="card-skills">
            <span v-for="skill in heroes[key].skills" :key="skill.id" class="skill-tag">{{ skill.name }}</span>
          </div>

          <p class="card-desc">{{ DESCRIPTIONS[key] }}</p>
        </div>

        <div class="chosen-mark" v-if="picked === key">✓</div>
      </div>
    </div>

    <div class="confirm-row">
      <button
        class="confirm-btn"
        :class="{ ready: !!picked }"
        :disabled="!picked"
        @click="confirm"
      >
        {{ picked ? `Ride with ${heroes[picked].name} →` : 'Choose a companion to continue' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCollectionStore } from '../stores/useCollectionStore.js'
import { HERO_TEMPLATES, HEDGE_KNIGHT_CHOICES } from '../game/data/heroes.js'
import HeroAvatar from './HeroAvatar.vue'

const store = useCollectionStore()

const heroes = computed(() =>
  Object.fromEntries(HEDGE_KNIGHT_CHOICES.map(key => [key, HERO_TEMPLATES[key]()]))
)

const DESCRIPTIONS = {
  HEDGE_BLADE:  'A grizzled warrior of House Aldric who lost his garrison. Fights with iron discipline and rallies allies in the heat of battle.',
  HEDGE_MAGE:   'A wandering spellcaster who studied under House Valdris but chose the open road. Glass-jawed — but devastating.',
  HEDGE_WARDEN: 'A quiet scout from the forests of Caelwyn. Modest in raw power, but keeps allies standing when it matters most.',
}

const picked = ref(null)

function confirm() {
  if (!picked.value) return
  store.claimStarterHero(picked.value)
}
</script>

<style scoped>
.starter-screen {
  min-height: 100vh;
  background: radial-gradient(ellipse 100% 60% at 50% 0%, rgba(100, 40, 10, 0.25) 0%, transparent 70%),
              #0e0706;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 20px 60px;
  gap: 36px;
}

.intro { text-align: center; max-width: 560px; }
.title {
  font-size: 1.6rem;
  font-weight: 900;
  color: #ffd700;
  letter-spacing: 2px;
  margin-bottom: 14px;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}
.lore  { font-size: 0.88rem; color: #777; line-height: 1.7; margin-bottom: 10px; }
.prompt { font-size: 0.82rem; color: #aaa; font-style: italic; }

/* ── 3-card grid ── */
.pick-grid {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.pick-card {
  width: 240px;
  background: #130908;
  border: 2px solid #3e1c0c;
  border-radius: 14px;
  padding: 20px 16px 16px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.pick-card:hover {
  border-color: #7a3a18;
  transform: translateY(-3px);
}
.pick-card.chosen {
  border-color: #ffd700;
  box-shadow: 0 0 24px rgba(255, 215, 0, 0.18);
  transform: translateY(-4px);
}

/* Affinity accent glow */
.pick-card.aff-force.chosen  { border-color: #ff9944; box-shadow: 0 0 24px rgba(255,153,68,0.2); }
.pick-card.aff-magic.chosen  { border-color: #88ccff; box-shadow: 0 0 24px rgba(136,204,255,0.2); }
.pick-card.aff-spirit.chosen { border-color: #4dff88; box-shadow: 0 0 24px rgba(77,255,136,0.2); }

.card-avatar { flex-shrink: 0; }

.card-body { width: 100%; display: flex; flex-direction: column; gap: 8px; }

.card-meta { display: flex; gap: 6px; align-items: center; }
.rarity { font-size: 0.62rem; padding: 2px 7px; border-radius: 10px; font-weight: 700; }
.rarity.rare { background: #0a1a3a; color: #4fa8ff; }

.affinity { font-size: 0.62rem; padding: 2px 7px; border-radius: 10px; font-weight: 700; }
.affinity.force  { background: #3a1800; color: #ff9944; }
.affinity.magic  { background: #0a1a3a; color: #88ccff; }
.affinity.spirit { background: #0a2a15; color: #4dff88; }

.card-name    { font-size: 1rem; font-weight: 800; color: #fff; }
.card-faction { font-size: 0.65rem; color: #555; margin-top: -4px; }

.card-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 8px;
}
.stat { display: flex; justify-content: space-between; font-size: 0.7rem; }
.sl { color: #555; }
.sv { color: #ccc; font-weight: 600; }

.card-skills { display: flex; flex-wrap: wrap; gap: 4px; }
.skill-tag {
  font-size: 0.6rem; padding: 2px 6px; border-radius: 4px;
  background: #2a1a00; color: #aa7733; border: 1px solid #3a2800;
}

.card-desc { font-size: 0.68rem; color: #666; line-height: 1.5; font-style: italic; }

.chosen-mark {
  position: absolute;
  top: 10px; right: 12px;
  font-size: 1rem; font-weight: 900;
  color: #ffd700;
}

/* ── Confirm button ── */
.confirm-row { text-align: center; }
.confirm-btn {
  padding: 14px 40px;
  border-radius: 8px;
  border: 2px solid #3e1c0c;
  background: #1a0d0a;
  color: #555;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: not-allowed;
  transition: all 0.2s;
  letter-spacing: 0.5px;
}
.confirm-btn.ready {
  border-color: #ffd700;
  color: #ffd700;
  background: #1a1400;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
}
.confirm-btn.ready:hover {
  background: #2a2000;
  box-shadow: 0 0 28px rgba(255, 215, 0, 0.25);
}
</style>
