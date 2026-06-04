<template>
  <Transition name="advisor-slide">
    <div class="advisor-wrap" v-if="advisor.visible">
      <div class="advisor-frame">
        <img :src="frameImg" class="advisor-bg" alt="" draggable="false" />

        <div class="advisor-text-area">
          <p class="advisor-name">Edwyn, Royal Chronicler</p>
          <p class="advisor-message" ref="msgEl"></p>

          <!-- Prev / Next -->
          <div class="advisor-nav" v-if="advisor.messages.length > 1">
            <button class="nav-btn" @click="advisor.prev()" :disabled="!advisor.hasPrev">
              <img :src="prevImg" class="nav-icon" alt="Previous" />
            </button>
            <span class="nav-index">{{ advisor.index + 1 }} / {{ advisor.messages.length }}</span>
            <button class="nav-btn" @click="advisor.next()" :disabled="!advisor.hasNext">
              <img :src="nextImg" class="nav-icon" alt="Next" />
            </button>
          </div>
        </div>

        <button class="advisor-close" @click="advisor.dismiss()" title="Dismiss">
          <img :src="closeImg" class="advisor-close-icon" alt="Close" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { TextPlugin } from 'gsap/TextPlugin'
import { useAdvisorStore } from '../stores/useAdvisorStore.js'
import frameImg from '../assets/units/advisor_with_text_v2.png'
import closeImg from '../assets/ui/close.png'
import nextImg  from '../assets/ui/next_nobg.png'
import prevImg  from '../assets/ui/prev_nobg.png'

gsap.registerPlugin(TextPlugin)

const advisor = useAdvisorStore()
const msgEl   = ref(null)
let   tween   = null

function typeText(text) {
  if (tween) tween.kill()
  if (!msgEl.value) return
  msgEl.value.textContent = ''
  tween = gsap.to(msgEl.value, {
    duration: Math.max(1, text.length * 0.028),
    text:     { value: text },
    ease:     'none',
    delay:    0.35,
  })
}

onMounted(() => typeText(advisor.currentMessage))
onUnmounted(() => { if (tween) tween.kill() })

watch(() => advisor.currentMessage, (msg) => typeText(msg), { flush: 'post' })
</script>

<style scoped>
.advisor-wrap {
  position: fixed;
  bottom: 28px;
  left: 28px;
  z-index: 150;
  pointer-events: none;
}

.advisor-frame {
  position: relative;
  width: 560px;
  pointer-events: all;
}

.advisor-bg {
  width: 100%;
  display: block;
  user-select: none;
}

.advisor-text-area {
  position: absolute;
  top: 32%;
  left: 24%;
  right: 13%;
  bottom: 14%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 0 10px 0 20px;
}

.advisor-name {
  font-family: var(--font-head);
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.85;
}

.advisor-message {
  font-size: 0.72rem;
  color: var(--text-parchment);
  line-height: 1.6;
  font-style: italic;
  flex: 1;
}

/* Nav buttons */
.advisor-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  align-self: flex-end;
  margin-top: 4px;
}

.nav-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.15s;
  display: flex;
}
.nav-btn:disabled { opacity: 0.25; cursor: default; }
.nav-btn:not(:disabled):hover { transform: scale(1.12); }
.nav-btn:not(:disabled):hover .nav-icon {
  filter: drop-shadow(0 0 5px rgba(201,140,40,0.65));
}

.nav-index {
  font-family: var(--font-head);
  font-size: 0.55rem;
  color: var(--text-dim);
  letter-spacing: 1px;
  min-width: 30px;
  text-align: center;
}

.nav-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  display: block;
}

/* Close button */
.advisor-close {
  position: absolute;
  top: 55px;
  right: 4px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.15s;
}
.advisor-close-icon {
  width: 36px;
  height: 36px;
  display: block;
  object-fit: contain;
}
.advisor-close:hover { transform: scale(1.1); }
.advisor-close:hover .advisor-close-icon {
  filter: drop-shadow(0 0 6px rgba(201,140,40,0.7)) drop-shadow(0 0 14px rgba(180,100,20,0.4));
}

/* Slide in from left */
.advisor-slide-enter-active { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease; }
.advisor-slide-leave-active { transition: transform 0.25s ease-in, opacity 0.2s ease; }
.advisor-slide-enter-from  { transform: translateX(-40px); opacity: 0; }
.advisor-slide-leave-to    { transform: translateX(-20px); opacity: 0; }
</style>
