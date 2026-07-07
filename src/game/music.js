import mainUrl          from '../assets/audio/main.ost?url'
import battleUrl        from '../assets/audio/battle.mp3?url'
import raidUrl          from '../assets/audio/Throne of regret.mp3?url'
import voidHeirUrl      from '../assets/audio/Aurelian Dragonforge .mp3?url'
import malacharUrl      from '../assets/audio/Malachar_trimmed.mp3?url'
import siegeBreachUrl   from '../assets/audio/Siege of Mordaine - The Iron Thirst - Treblo.mp3?url'
import siegeVanguardUrl from '../assets/audio/Siege of Mordaine - The Silent Pact - Treblo.mp3?url'
import kyverUrl         from '../assets/audio/kyver.mp3?url'

const VOL = { main: 0.40, battle: 0.55, raid: 0.55, void_heir: 0.55, malachar: 0.55, siege_breach: 0.55, siege_vanguard: 0.50, kyver: 0.55 }

// heroId → { key, url } — add entries here when a hero gets their own track
const HERO_TRACKS = {
  kyver: { key: 'kyver', url: kyverUrl },
}
const FADE_STEPS = 22
const STEP_MS    = 38   // ~830 ms total crossfade

const _audio = {}
let _current  = null
let _outgoing = null   // track being faded out — must be stopped if interrupted
let _muted    = false
let _timer    = null

function _get(key, url) {
  if (!_audio[key]) {
    const a = new Audio(url)
    a.loop   = true
    a.volume = 0
    _audio[key] = a
  }
  return _audio[key]
}

function _vol(key) {
  return _muted ? 0 : (VOL[key] ?? 0.4)
}

function _crossfade(key, url) {
  if (_current === key) return
  if (_timer) {
    clearInterval(_timer)
    _timer = null
    // Stop any track that was mid-fade-out so it doesn't keep playing
    if (_outgoing && _outgoing !== _audio[key]) {
      _outgoing.pause()
      _outgoing.volume = 0
    }
    _outgoing = null
  }

  const prevKey  = _current
  _current       = key

  const incoming = _get(key, url)
  const outgoing = prevKey ? _audio[prevKey] : null
  _outgoing      = outgoing
  const outStart = outgoing?.volume ?? 0

  incoming.play().catch(() => {})

  let step = 0
  _timer = setInterval(() => {
    step++
    const t = Math.min(1, step / FADE_STEPS)
    if (outgoing) outgoing.volume = Math.max(0, outStart * (1 - t))
    incoming.volume = _vol(key) * t
    if (step >= FADE_STEPS) {
      clearInterval(_timer); _timer = null
      _outgoing = null
      if (outgoing) { outgoing.pause(); outgoing.volume = 0 }
    }
  }, STEP_MS)
}

export function playMain()         { _crossfade('main',           mainUrl)          }
export function playBattle()       { _crossfade('battle',         battleUrl)        }

export function playBattleForTeam(heroIds = []) {
  const matches = heroIds.filter(id => HERO_TRACKS[id])
  if (!matches.length) { playBattle(); return }
  const pick = matches[Math.floor(Math.random() * matches.length)]
  const { key, url } = HERO_TRACKS[pick]
  _crossfade(key, url)
}
export function playRaid()         { _crossfade('raid',           raidUrl)          }
export function playMalachar()     { _crossfade('malachar',       malacharUrl)      }
export function playVoidHeir()     { _crossfade('void_heir',      voidHeirUrl)      }
export function playSiegeBreach()  { _crossfade('siege_breach',   siegeBreachUrl)   }
export function playSiegeVanguard(){ _crossfade('siege_vanguard', siegeVanguardUrl) }

export function setMuted(val) {
  _muted = val
  // Apply instantly to whatever is audible right now
  for (const key in _audio) {
    if (!_audio[key].paused) {
      _audio[key].volume = val ? 0 : (VOL[key] ?? 0.4)
    }
  }
}
