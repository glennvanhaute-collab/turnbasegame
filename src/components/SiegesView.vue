<template>
  <div class="sieges-view">

    <div class="sieges-header">
      <h2 class="sieges-title">Siege the Realm</h2>
      <p class="sieges-sub">March on the great houses of Westrun. Your faction composition determines your attack and defence — bring the right banners to the wall.</p>
      <div class="sieges-notice">
        <span class="notice-icon">⚔</span>
        <span>Sieges require a minimum <strong>10-unit war party</strong>. The scale of attacking an entire house demands numbers — and may one day call for a <strong>duplicate unit system</strong> to fill the ranks.</span>
      </div>
    </div>

    <div class="siege-list">
      <div
        v-for="siege in SIEGES"
        :key="siege.id"
        class="siege-card"
        :style="{ '--house-color': siege.color, backgroundImage: `url(${siege.img})` }"
      >
        <div class="siege-art-gradient" />

        <!-- Top badges -->
        <div class="siege-art-top">
          <span class="siege-tier-badge" :class="siege.tier.toLowerCase()">{{ siege.tier }}</span>
          <span class="siege-affinity-chip" :class="siege.affinity.toLowerCase()">{{ siege.affinity }}</span>
        </div>

        <!-- Info overlay -->
        <div class="siege-info">
          <div class="siege-header-labels">
            <div class="siege-house-label">{{ siege.house }}</div>
            <div class="siege-name">{{ siege.name }}</div>
          </div>

          <p class="siege-desc">{{ siege.desc }}</p>

          <div class="siege-matchups">
            <div class="matchup-row" v-if="siege.strongAgainst.length">
              <span class="matchup-label strong">Advantage vs</span>
              <span class="matchup-tag strong" v-for="f in siege.strongAgainst" :key="f"
                :style="{ color: AFFINITY_COLOR[f], borderColor: AFFINITY_COLOR[f] + '66', background: AFFINITY_COLOR[f] + '18' }">{{ f }}</span>
            </div>
            <div class="matchup-row" v-if="siege.weakAgainst.length">
              <span class="matchup-label weak">Weakness vs</span>
              <span class="matchup-tag weak" v-for="f in siege.weakAgainst" :key="f"
                :style="{ color: AFFINITY_COLOR[f], borderColor: AFFINITY_COLOR[f] + '66', background: AFFINITY_COLOR[f] + '18' }">{{ f }}</span>
            </div>
          </div>

          <div class="siege-footer">
            <div class="siege-rewards">
              <span class="reward-chip"><span class="r-icon">🪙</span>{{ siege.gold.toLocaleString() }}</span>
              <span class="reward-chip"><span class="r-icon">💎</span>{{ siege.diamonds }}</span>
              <span class="reward-chip mat" :style="{ '--mat-color': siege.matColor }">
                <span class="r-icon mat-gem" :style="{ color: siege.matColor }">◆</span>{{ siege.matReward }}
              </span>
            </div>
            <div class="btn-siege-group">
              <span class="siege-team-req">⚔ 10-unit war party required</span>
              <button class="btn-siege" disabled>
                <span class="btn-siege-inner">Besiege</span>
                <span class="btn-siege-soon">Coming Soon</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const AFFINITY_COLOR = {
  Force:  '#ff8c42',
  Magic:  '#4fa8ff',
  Spirit: '#4dff88',
  Void:   '#b44fff',
}

import siegeAldric   from '../assets/lore/siege_aldric.png'
import siegeValdris  from '../assets/lore/siege_Valdris.png'
import siegeCaelwyn  from '../assets/lore/siege_caelwyn.png'
import siegeMordaine from '../assets/lore/siege_mordaine.png'

const SIEGES = [
  {
    id:           'aldric',
    house:        'House Aldric',
    name:         'Storm the Iron Bastion',
    img:          siegeAldric,
    color:        '#c8962a',
    affinity:     'Force',
    tier:         'Hard',
    desc:         'The walls of House Aldric have never been broken. Iron gates, disciplined ranks, and knights sworn to die before they yield. You will need brute force and tactical cunning to shatter their defences.',
    strongAgainst: ['Spirit', 'Void'],
    weakAgainst:   ['Magic'],
    gold:          2500,
    diamonds:      35,
    matReward:     'Ember Shard ×3',
    matColor:      '#ff7722',
  },
  {
    id:           'valdris',
    house:        'House Valdris',
    name:         'Breach the Arcane Citadel',
    img:          siegeValdris,
    color:        '#4fa8ff',
    affinity:     'Magic',
    tier:         'Hard',
    desc:         'The mages of House Valdris have warded every stone of their citadel. Wards detonate on contact, runic barriers redirect force. Spirit and void champions can pierce their arcane defences where steel cannot.',
    strongAgainst: ['Force', 'Void'],
    weakAgainst:   ['Spirit'],
    gold:          2500,
    diamonds:      35,
    matReward:     'Void Crystal ×2',
    matColor:      '#aa44ff',
  },
  {
    id:           'caelwyn',
    house:        'House Caelwyn',
    name:         'Fell the Eternal Grove',
    img:          siegeCaelwyn,
    color:        '#4dff88',
    affinity:     'Spirit',
    tier:         'Nightmare',
    desc:         "The ancient wardens of House Caelwyn fight on terrain that fights back. Living roots seal breaches, stone titans guard the gate, and their healers keep the line standing long after hope is gone. Void corruption is their only true vulnerability.",
    strongAgainst: ['Force', 'Magic'],
    weakAgainst:   ['Void'],
    gold:          4000,
    diamonds:      60,
    matReward:     'Void Crystal ×4',
    matColor:      '#aa44ff',
  },
  {
    id:           'mordaine',
    house:        'House Mordaine',
    name:         'Shatter the Void Sanctum',
    img:          siegeMordaine,
    color:        '#b44fff',
    affinity:     'Void',
    tier:         'Nightmare',
    desc:         'House Mordaine has built their sanctum in the space between worlds. Shadow knights phase through walls, void rift towers warp incoming strikes, and the Sovereign himself waits at the throne. Only holy light and overwhelming force can end this darkness.',
    strongAgainst: ['Magic', 'Spirit'],
    weakAgainst:   ['Force'],
    gold:          4000,
    diamonds:      60,
    matReward:     'Ember Shard ×4',
    matColor:      '#ff7722',
  },
]
</script>

<style scoped>
.sieges-view {
  max-width: 1100px;
  margin: 0 auto;
  padding: 20px 24px 48px;
}

.sieges-header {
  margin-bottom: 24px;
}
.sieges-title {
  font-family: var(--font-head);
  font-size: 1rem;
  font-weight: 800;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 6px;
}
.sieges-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 640px;
  margin-bottom: 10px;
}
.sieges-notice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #100a04;
  border: 1px solid var(--border-brown);
  border-left: 3px solid var(--gold-dim);
  border-radius: 6px;
  padding: 9px 14px;
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 680px;
}
.sieges-notice strong { color: var(--text-parchment); }
.notice-icon { font-size: 0.8rem; flex-shrink: 0; margin-top: 1px; }

/* ── Siege list ─────────────────────────────────────────────────── */
.siege-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.siege-card {
  position: relative;
  border: 1px solid #3e1c0c;
  border-radius: 14px;
  overflow: hidden;
  background-size: cover;
  background-position: center center;
  transition: border-color 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 400px;
}
.siege-card:hover {
  border-color: var(--house-color);
  box-shadow: 0 6px 40px rgba(0,0,0,0.7), 0 0 0 1px color-mix(in srgb, var(--house-color) 30%, transparent);
}

.siege-art-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.05) 0%,
    rgba(0,0,0,0.08) 45%,
    rgba(0,0,0,0.55) 70%,
    rgba(0,0,0,0.82) 100%
  );
  pointer-events: none;
}

.siege-art-top {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 14px 18px;
}

.siege-tier-badge {
  font-family: var(--font-head);
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-radius: 10px;
  padding: 3px 10px;
  backdrop-filter: blur(4px);
}
.siege-tier-badge.hard      { background: rgba(26,16,8,0.75); color: #cc8833; border: 1px solid #663311; }
.siege-tier-badge.nightmare { background: rgba(24,10,26,0.75); color: #aa44ff; border: 1px solid #661188; }

.siege-affinity-chip {
  font-family: var(--font-head);
  font-size: 0.58rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  border-radius: 10px;
  padding: 3px 10px;
  backdrop-filter: blur(4px);
}
.siege-affinity-chip.force   { background: rgba(26,6,0,0.75);  color: #ff8c42; border: 1px solid #663311; }
.siege-affinity-chip.magic   { background: rgba(0,16,31,0.75); color: #4fa8ff; border: 1px solid #113366; }
.siege-affinity-chip.spirit  { background: rgba(0,16,8,0.75);  color: #4dff88; border: 1px solid #116633; }
.siege-affinity-chip.void    { background: rgba(15,0,26,0.75); color: #b44fff; border: 1px solid #441188; }

.siege-header-labels {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.siege-house-label {
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--house-color);
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
}

.siege-name {
  font-family: var(--font-head);
  font-size: 1.3rem;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0,0,0,0.95), 0 0 30px rgba(0,0,0,0.7);
  letter-spacing: 1px;
  line-height: 1.2;
}

/* ── Info overlay ───────────────────────────────────────────────── */
.siege-info {
  position: relative;
  z-index: 1;
  padding: 14px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: rgba(8, 4, 2, 0.25);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-top: 1px solid var(--house-color);
}

.siege-desc {
  font-size: 0.72rem;
  color: #9a7e68;
  line-height: 1.7;
}

/* Matchups */
.siege-matchups { display: flex; flex-direction: column; gap: 5px; }
.matchup-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.matchup-label {
  font-size: 0.56rem;
  font-family: var(--font-head);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
  min-width: 74px;
  flex-shrink: 0;
}
.matchup-label.strong { color: #44cc66; }
.matchup-label.weak   { color: #cc4444; }
.matchup-tag {
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 4px;
  padding: 1px 8px;
}
.matchup-tag.strong { background: #0d1a0a; color: #44cc66; border: 1px solid #1a4411; }
.matchup-tag.weak   { background: #1a0808; color: #cc5544; border: 1px solid #441111; }

/* Footer */
.siege-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 4px;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.siege-rewards { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.reward-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--font-head);
  background: rgba(0,0,0,0.4);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 4px;
  padding: 3px 9px;
  color: var(--text-muted);
}
.reward-chip.mat { color: var(--mat-color); }
.r-icon { font-size: 0.72rem; }
.mat-gem { font-size: 0.7rem; }

.btn-siege-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  flex-shrink: 0;
}
.siege-team-req {
  font-size: 0.58rem;
  font-family: var(--font-head);
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--gold-dim);
  opacity: 0.8;
}

/* Button */
.btn-siege {
  position: relative;
  padding: 10px 28px;
  border-radius: 8px;
  border: 1px solid var(--house-color);
  background: color-mix(in srgb, var(--house-color) 10%, transparent);
  color: var(--house-color);
  font-family: var(--font-head);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: not-allowed;
  overflow: hidden;
  opacity: 0.6;
  flex-shrink: 0;
}
.btn-siege-inner { display: block; transition: opacity 0.2s, transform 0.2s; }
.btn-siege-soon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  letter-spacing: 2px;
  opacity: 0;
  transition: opacity 0.2s;
  background: color-mix(in srgb, var(--house-color) 15%, transparent);
}
.btn-siege:hover .btn-siege-inner { opacity: 0; transform: translateY(-4px); }
.btn-siege:hover .btn-siege-soon  { opacity: 1; }
</style>
