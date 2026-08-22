import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const THEMES = {
  default:  { name: 'Westrun',        shield: null,        gold: '#c9a227', goldBright: '#ffd700', goldDim: '#7a5228', goldFaint: '#2e1c08', borderGold: '#5c3a14' },
  aldric:   { name: 'House Aldric',   shield: 'aldric',   gold: '#cc2222', goldBright: '#ee4444', goldDim: '#881010', goldFaint: '#1e0606', borderGold: '#550e0e' },
  valdris:  { name: 'House Valdris',  shield: 'valdris',  gold: '#4fa8ff', goldBright: '#80c8ff', goldDim: '#1a4880', goldFaint: '#041020', borderGold: '#183868' },
  caelwyn:  { name: 'House Caelwyn', shield: 'caelwyn', gold: '#4dff88', goldBright: '#80ffaa', goldDim: '#0a7838', goldFaint: '#041408', borderGold: '#0a3c1c' },
  mordaine: { name: 'House Mordaine', shield: 'mordaine', gold: '#b44fff', goldBright: '#cc80ff', goldDim: '#5a1080', goldFaint: '#1a0828', borderGold: '#440e60' },
}

export function applyTheme(themeId) {
  const t = THEMES[themeId] ?? THEMES.default
  const el = document.documentElement
  el.style.setProperty('--gold',        t.gold)
  el.style.setProperty('--gold-bright', t.goldBright)
  el.style.setProperty('--gold-dim',    t.goldDim)
  el.style.setProperty('--gold-faint',  t.goldFaint)
  el.style.setProperty('--border-gold', t.borderGold)
}

export const useSettingsStore = defineStore('settings', () => {
  const theme = ref(localStorage.getItem('bow-theme') ?? 'default')

  applyTheme(theme.value)

  watch(theme, (val) => {
    localStorage.setItem('bow-theme', val)
    applyTheme(val)
  })

  return { theme }
})
