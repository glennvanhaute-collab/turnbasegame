import { ref, onMounted, onUnmounted } from 'vue'

export function useIsMobile(breakpoint = 640) {
  const isMobile = ref(typeof window !== 'undefined' && window.innerWidth <= breakpoint)

  function onResize() {
    isMobile.value = window.innerWidth <= breakpoint
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return { isMobile }
}
