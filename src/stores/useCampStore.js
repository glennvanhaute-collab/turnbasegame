import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'raid-camp'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const useCampStore = defineStore('camp', () => {
  const saved = load()

  // Buildings — each has a level and produces gold/min at that level
  const buildings = ref(saved?.buildings ?? {
    encampment: { level: 1, name: 'Encampment',  goldPerMin: 5  },
    market:     { level: 0, name: 'Market',       goldPerMin: 12 },
    blacksmith: { level: 0, name: 'Blacksmith',   goldPerMin: 0  },
    watchtower: { level: 0, name: 'Watchtower',   goldPerMin: 0  },
  })

  const lastTick = ref(saved?.lastTick ?? Date.now())

  const goldPerMin = computed(() =>
    Object.values(buildings.value)
      .filter(b => b.level > 0)
      .reduce((sum, b) => sum + b.goldPerMin * b.level, 0)
  )

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      buildings: buildings.value,
      lastTick:  lastTick.value,
    }))
  }

  // Call this on mount — collects any gold earned while offline
  function catchUp(addGold) {
    const now     = Date.now()
    const elapsed = (now - lastTick.value) / 1000 / 60 // minutes
    const earned  = Math.floor(goldPerMin.value * elapsed)
    if (earned > 0) addGold(earned)
    lastTick.value = now
    persist()
  }

  // Call every minute while online
  function tick(addGold) {
    addGold(goldPerMin.value)
    lastTick.value = Date.now()
    persist()
  }

  return { buildings, goldPerMin, lastTick, catchUp, tick }
})
