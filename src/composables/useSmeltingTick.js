import { onMounted, onUnmounted } from 'vue'
import { useSmeltingStore } from '../stores/useSmeltingStore.js'

export function useSmeltingTick() {
  const smeltingStore = useSmeltingStore()
  let interval = null

  onMounted(() => {
    interval = setInterval(() => smeltingStore.tick(), 1000)
  })

  onUnmounted(() => clearInterval(interval))
}
