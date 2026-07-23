import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'active-world'

export const WORLDS = {
  WESTRUN: 'westrun',
  YAMATO:  'yamato',
}

export const useWorldStore = defineStore('world', () => {
  const activeWorld = ref(localStorage.getItem(STORAGE_KEY) ?? null)

  function enterWorld(world) {
    activeWorld.value = world
    localStorage.setItem(STORAGE_KEY, world)
  }

  function exitWorld() {
    activeWorld.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return { activeWorld, enterWorld, exitWorld }
})
