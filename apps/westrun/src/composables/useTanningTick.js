import { onMounted, onUnmounted } from 'vue'
import { useTanningStore } from '../stores/useTanningStore.js'

export function useTanningTick() {
  const tanning = useTanningStore()
  let interval = null

  onMounted(() => { interval = setInterval(() => tanning.tick(), 1000) })
  onUnmounted(() => clearInterval(interval))
}
