<template>
  <div class="settings-root">
    <button class="settings-btn icon-btn" :class="{ active: open }" @click="open = !open" title="Settings">⚙</button>

    <Transition name="sp-slide">
      <div class="settings-panel" v-if="open" v-click-outside="() => open = false">
        <div class="sp-header">
          <span class="sp-title">Settings</span>
          <button class="sp-close" @click="open = false">✕</button>
        </div>

        <section class="sp-section">
          <div class="sp-label">House Theme</div>
          <div class="theme-list">
            <button
              v-for="(t, id) in THEMES"
              :key="id"
              class="theme-row"
              :class="{ active: settings.theme === id }"
              :style="{ '--tc': t.gold }"
              @click="settings.theme = id; open = false"
            >
              <span class="tc-dot" />
              <span class="tc-name">{{ t.name }}</span>
              <span class="tc-check" v-if="settings.theme === id">✓</span>
            </button>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore, THEMES } from '../stores/useSettingsStore.js'

const settings = useSettingsStore()
const open     = ref(false)

const vClickOutside = {
  mounted(el, binding) {
    el._handler = (e) => { if (!el.contains(e.target)) binding.value(e) }
    document.addEventListener('pointerdown', el._handler)
  },
  unmounted(el) {
    document.removeEventListener('pointerdown', el._handler)
  },
}
</script>

<style scoped>
.settings-root {
  position: relative;
}

.settings-btn {
  font-size: 1rem;
  line-height: 1;
}
.settings-btn.active { color: var(--gold); border-color: var(--gold-dim); }

/* Panel */
.settings-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  background: rgba(10,4,16,0.97);
  border: 1px solid var(--border-gold);
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  z-index: 900;
  overflow: hidden;
}

.sp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px 8px;
  border-bottom: 1px solid #2a1a3a;
}
.sp-title {
  font-family: var(--font-head);
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--gold);
}
.sp-close {
  background: none; border: none; color: #554466; font-size: 0.7rem; cursor: pointer;
  transition: color 0.12s;
}
.sp-close:hover { color: #aaa; }

/* Section */
.sp-section { padding: 10px 14px; }
.sp-label {
  font-size: 0.52rem; text-transform: uppercase; letter-spacing: 2px;
  color: #554466; font-weight: 700; margin-bottom: 8px;
  font-family: var(--font-head);
}

/* Theme list */
.theme-list { display: flex; flex-direction: column; gap: 3px; }
.theme-row {
  display: flex; align-items: center; gap: 9px;
  padding: 6px 8px; border-radius: 6px;
  background: transparent; border: 1px solid transparent;
  cursor: pointer; text-align: left; width: 100%;
  transition: background 0.1s, border-color 0.1s;
}
.theme-row:hover   { background: rgba(255,255,255,0.05); border-color: color-mix(in srgb, var(--tc) 25%, transparent); }
.theme-row.active  { background: color-mix(in srgb, var(--tc) 10%, transparent); border-color: color-mix(in srgb, var(--tc) 40%, transparent); }

.tc-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
  background: var(--tc);
  box-shadow: 0 0 6px var(--tc);
}
.tc-name {
  flex: 1; font-size: 0.67rem; font-weight: 600; color: #998899;
  font-family: var(--font-head); letter-spacing: 0.5px;
}
.theme-row.active .tc-name { color: var(--tc); }
.tc-check { font-size: 0.6rem; color: var(--tc); flex-shrink: 0; }

/* Transition */
.sp-slide-enter-active { transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.22,1,0.36,1); }
.sp-slide-leave-active { transition: opacity 0.12s ease, transform 0.12s ease-in; }
.sp-slide-enter-from   { opacity: 0; transform: translateY(-6px); }
.sp-slide-leave-to     { opacity: 0; transform: translateY(-4px); }
</style>
