<template>
  <div class="skill-panel">

    <!-- Autoplay control bar -->
    <div class="autoplay-bar" v-if="!store.isOver">
      <button
        class="auto-btn"
        :class="{ active: store.autoplay }"
        @click="store.toggleAutoplay()"
      >
        <span class="auto-dot" />
        {{ store.autoplay ? 'AUTO ON' : 'AUTO OFF' }}
      </button>
      <div class="speed-btns">
        <button
          v-for="s in [1, 2, 3]"
          :key="s"
          class="speed-btn"
          :class="{ active: store.battleSpeed === s }"
          @click="store.setSpeed(s)"
        >{{ s }}×</button>
      </div>
    </div>

    <!-- Turn status -->
    <div class="panel-title">
      <template v-if="store.autoplay && store.state === 'selecting_skill'">
        <span class="auto-acting">{{ store.activeHero?.name }} — Auto acting...</span>
      </template>
      <template v-else>
        <span v-if="store.state === 'selecting_skill'">{{ store.activeHero?.name }} — Choose a skill</span>
        <span v-else-if="store.state === 'selecting_target'">Select a target</span>
        <span v-else-if="store.state === 'enemy_turn'">Enemy is acting...</span>
        <span v-else-if="store.state === 'victory'" class="victory">Victory!</span>
        <span v-else-if="store.state === 'defeat'" class="defeat">Defeated</span>
        <span v-else>—</span>
      </template>
    </div>

    <!-- Manual skill buttons (hidden during autoplay) -->
    <div class="skills" v-if="store.state === 'selecting_skill' && store.activeHero && !store.autoplay">
      <button
        v-for="(skill, i) in store.activeHero.skills"
        :key="skill.id"
        class="skill-btn"
        :class="{ ready: skill.isReady(), selected: store.selectedSkillIndex === i }"
        :disabled="!skill.isReady()"
        @click="store.selectSkill(i)"
      >
        <span class="skill-name">{{ skill.name }}</span>
        <span class="skill-cd" v-if="!skill.isReady()">{{ skill.currentCooldown }}t</span>
        <span class="skill-desc">{{ skill.description }}</span>
      </button>
    </div>

    <div class="hint" v-if="store.state === 'selecting_target' && !store.autoplay">
      Click an enemy to target them.
    </div>
  </div>
</template>

<script setup>
import { useBattleStore } from '../stores/useBattleStore.js'
const store = useBattleStore()
</script>

<style scoped>
.skill-panel {
  background: #1a0d0a;
  border: 1px solid #3e1c0c;
  border-radius: 8px;
  padding: 12px;
}

/* Autoplay bar */
.autoplay-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 8px;
}
.auto-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #221108;
  border: 1px solid #5c2810;
  border-radius: 20px;
  color: #666;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 5px 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.auto-btn:hover { border-color: #4dff88; color: #4dff88; }
.auto-btn.active {
  background: #0a2a1a;
  border-color: #4dff88;
  color: #4dff88;
  box-shadow: 0 0 8px #4dff8833;
}
.auto-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: currentColor;
}
.auto-btn:not(.active) .auto-dot { background: #444; }

.speed-btns { display: flex; gap: 4px; }
.speed-btn {
  background: #221108;
  border: 1px solid #5c2810;
  border-radius: 4px;
  color: #555;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.speed-btn:hover { color: #ccc; border-color: #ccc; }
.speed-btn.active { background: #351808; border-color: #ffd700; color: #ffd700; }

/* Status line */
.panel-title {
  font-size: 0.85rem;
  color: #aaa;
  margin-bottom: 10px;
  font-style: italic;
}
.auto-acting { color: #4dff88; font-style: normal; }
.victory { color: #ffd700; font-weight: 700; font-style: normal; }
.defeat  { color: #e74c3c; font-weight: 700; font-style: normal; }

/* Skill buttons */
.skills { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-btn {
  background: #221108;
  border: 1px solid #5c2810;
  border-radius: 6px;
  color: #ccc;
  padding: 8px 12px;
  cursor: pointer;
  text-align: left;
  min-width: 160px;
  max-width: 200px;
  transition: background 0.15s, border-color 0.15s;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.skill-btn.ready:hover     { background: #351808; border-color: #ffd700; }
.skill-btn.selected        { border-color: #e94560; background: #2a0808; }
.skill-btn:disabled        { opacity: 0.4; cursor: not-allowed; }
.skill-btn .skill-name     { font-weight: 700; font-size: 0.82rem; color: #fff; }
.skill-btn .skill-cd       { font-size: 0.68rem; color: #ff9944; }
.skill-btn .skill-desc     { font-size: 0.68rem; color: #888; line-height: 1.3; }

.hint { color: #e94560; font-size: 0.82rem; margin-top: 6px; }
</style>
