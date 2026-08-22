import { onMounted, onUnmounted } from 'vue'
import { useWeavingStore } from '../stores/useWeavingStore.js'

export function useWeavingTick() {
  const weaving = useWeavingStore()
  let interval = null

  onMounted(() => { interval = setInterval(() => weaving.tick(), 1000) })
  onUnmounted(() => clearInterval(interval))
}
