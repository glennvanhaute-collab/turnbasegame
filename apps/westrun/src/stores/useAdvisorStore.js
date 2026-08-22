import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdvisorStore = defineStore('advisor', () => {
  const visible  = ref(false)
  const messages = ref([])
  const index    = ref(0)

  const currentMessage = computed(() => messages.value[index.value] ?? '')
  const hasNext = computed(() => index.value < messages.value.length - 1)
  const hasPrev = computed(() => index.value > 0)

  function say(msg) {
    messages.value = Array.isArray(msg) ? msg : [msg]
    index.value    = 0
    visible.value  = true
  }

  function next() { if (hasNext.value) index.value++ }
  function prev() { if (hasPrev.value) index.value-- }

  function dismiss() {
    visible.value  = false
    messages.value = []
    index.value    = 0
  }

  return { visible, messages, index, currentMessage, hasNext, hasPrev, say, next, prev, dismiss }
})
