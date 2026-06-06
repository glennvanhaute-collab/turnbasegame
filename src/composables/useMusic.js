import { ref } from 'vue'
import { playMain, playBattle, setMuted } from '../game/music.js'

export function useMusic(view) {
  const muted = ref(localStorage.getItem('music_muted') === 'true')
  setMuted(muted.value)

  function toggleMute() {
    muted.value = !muted.value
    setMuted(muted.value)
    localStorage.setItem('music_muted', muted.value)
  }

  function onViewChange(v) {
    if (v === 'battle') playBattle()
    else                playMain()
  }

  function startOnFirstInteraction() {
    const start = (e) => {
      if (e.target.closest('.icon-btn')) return
      playMain()
      document.removeEventListener('pointerdown', start)
    }
    document.addEventListener('pointerdown', start)
  }

  return { muted, toggleMute, onViewChange, startOnFirstInteraction }
}
