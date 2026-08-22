<template>
  <div class="battle-log" :class="{ open: isOpen }">
    <button class="log-title" @click="isOpen = !isOpen">
      <span>Battle Log</span>
      <span class="log-chevron">{{ isOpen ? '▲' : '▼' }}</span>
    </button>
    <transition name="log-slide">
      <div class="log-body" v-if="isOpen">
        <transition-group name="log" tag="div" class="log-entries">
          <div v-for="entry in store.battleLog.slice(0, 30)" :key="entry.id" class="log-entry">
            <span class="log-turn">[{{ entry.turn }}]</span>
            {{ entry.text }}
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useBattleStore } from '../stores/useBattleStore.js'
const store = useBattleStore()
const isOpen = ref(false)
</script>

<style scoped>
.battle-log {
  background: #130908;
  border: 1px solid #3e1c0c;
  border-radius: 8px;
  overflow: hidden;
}
.log-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.72rem;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.15s;
}
.log-title:hover { color: #888; }
.log-chevron { font-size: 0.6rem; opacity: 0.6; }
.log-body {
  padding: 0 10px 10px;
  height: 180px;
  overflow-y: auto;
}
.log-entry {
  font-size: 0.75rem;
  color: #bbb;
  padding: 2px 0;
  border-bottom: 1px solid #221108;
  line-height: 1.4;
}
.log-turn { color: #555; margin-right: 4px; }

.log-slide-enter-active { transition: all 0.2s ease; }
.log-slide-leave-active { transition: all 0.15s ease; }
.log-slide-enter-from, .log-slide-leave-to { opacity: 0; transform: translateY(-6px); }

.log-enter-active { transition: all 0.25s ease; }
.log-enter-from   { opacity: 0; transform: translateX(-6px); }
</style>
