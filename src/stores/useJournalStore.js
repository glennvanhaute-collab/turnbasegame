import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'raid-journal'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') } catch { return null }
}

export const ENTRY_TYPES = {
  GEAR_DROP:    'gear_drop',
  LEVEL_UP:     'level_up',
  LORE_FOUND:   'lore_found',
  DUNGEON_CLEAR:'dungeon_clear',
  RECRUIT:      'recruit',
  MANUAL:       'manual',
}

export const useJournalStore = defineStore('journal', () => {
  const saved   = load()
  const entries = ref(saved?.entries ?? [])

  watch(entries, () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: entries.value }))
  }, { deep: true })

  function addEntry({ type = ENTRY_TYPES.MANUAL, title, body, context = null }) {
    entries.value.unshift({
      id:        Date.now(),
      type,
      title,
      body,
      context,  // e.g. { dungeon, unit, item } — whatever was happening
      date:      new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
      timestamp: Date.now(),
    })
  }

  function removeEntry(id) {
    entries.value = entries.value.filter(e => e.id !== id)
  }

  return { entries, addEntry, removeEntry }
})
