<template>
  <div class="battle-log">
    <div class="log-title">Battle Log</div>
    <transition-group name="log" tag="div" class="log-entries">
      <div v-for="entry in store.battleLog.slice(0, 30)" :key="entry.id" class="log-entry">
        <span class="log-turn">[{{ entry.turn }}]</span>
        {{ entry.text }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useBattleStore } from '../stores/useBattleStore.js'
const store = useBattleStore()
</script>

<style scoped>
.battle-log {
  background: #130908;
  border: 1px solid #3e1c0c;
  border-radius: 8px;
  padding: 10px;
  height: 220px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.log-title {
  font-size: 0.75rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 6px;
  flex-shrink: 0;
}
.log-entries { flex: 1; overflow-y: auto; }
.log-entry {
  font-size: 0.75rem;
  color: #bbb;
  padding: 2px 0;
  border-bottom: 1px solid #221108;
  line-height: 1.4;
}
.log-turn { color: #555; margin-right: 4px; }

.log-enter-active { transition: all 0.25s ease; }
.log-enter-from   { opacity: 0; transform: translateX(-6px); }
</style>
