<template>
  <Teleport to="body">
    <div class="lore-backdrop" @click.self="$emit('dismiss')">
      <div class="lore-frame">

        <!-- Portrait — left panel -->
        <div class="lore-portrait-panel" v-if="portrait">
          <img :src="portrait" class="lore-portrait-img" alt="" />
          <div class="lore-portrait-edge" />
        </div>

        <!-- Content — right panel -->
        <div class="lore-content">
          <div class="lore-eyebrow">📜 Lore Fragment Discovered</div>
          <div class="lore-book-title">{{ fragment.heroTitle }}</div>
          <div class="lore-frag-title">{{ fragment.frag.title }}</div>
          <div class="lore-divider" />
          <p class="lore-text">{{ fragment.frag.text }}</p>
          <button class="lore-continue" @click="$emit('dismiss')">Continue →</button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { PORTRAIT_MAP } from '../game/portraits.js'

const props = defineProps({
  fragment: { type: Object, required: true },
})
defineEmits(['dismiss'])

const portrait = computed(() => {
  const id = props.fragment.heroId?.replace(/_/g, '-')
  return id ? (PORTRAIT_MAP[id] ?? null) : null
})
</script>

<style scoped>
.lore-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.88);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Outer frame — side-by-side layout */
.lore-frame {
  display: flex;
  width: min(960px, 96vw);
  max-height: 88vh;
  background: #0d0805;
  border: 1px solid #5a3a18;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(201,162,39,0.06);
}

/* ── Portrait panel ── */
.lore-portrait-panel {
  width: 300px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.lore-portrait-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  display: block;
}

/* Fade portrait right-edge into the content background */
.lore-portrait-edge {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to right,  transparent 55%, #0d0805 100%),
    linear-gradient(to bottom, transparent 75%, #0d0805 100%);
  pointer-events: none;
}

/* ── Content panel ── */
.lore-content {
  flex: 1;
  padding: 2.6rem 2.8rem 2.2rem 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.lore-eyebrow {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #c9a44a;
  opacity: 0.7;
}

.lore-book-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #f5e6c8;
  line-height: 1.2;
}

.lore-frag-title {
  font-size: 0.9rem;
  font-style: italic;
  color: #a07840;
  margin-top: 0.1rem;
}

.lore-divider {
  height: 1px;
  background: linear-gradient(to right, #5a3a18 0%, transparent 80%);
  margin: 0.6rem 0 0.4rem;
}

.lore-text {
  font-size: 0.88rem;
  line-height: 1.85;
  color: #c8b99a;
  white-space: pre-line;
  margin: 0;
}

.lore-continue {
  align-self: flex-end;
  margin-top: 1.5rem;
  background: transparent;
  border: 1px solid #5a3a18;
  border-radius: 3px;
  color: #c9a44a;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 0.45rem 1.2rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.lore-continue:hover {
  background: #5a3a18;
  color: #f5e6c8;
}

/* Narrow screens — stack vertically, portrait becomes a header band */
@media (max-width: 600px) {
  .lore-frame { flex-direction: column; }
  .lore-portrait-panel { width: 100%; height: 220px; }
  .lore-portrait-edge {
    background:
      linear-gradient(to bottom, transparent 55%, #0d0805 100%);
  }
  .lore-content { padding: 1.6rem 1.4rem 1.4rem; }
}
</style>
