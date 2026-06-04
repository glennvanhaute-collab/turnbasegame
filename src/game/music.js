import mainUrl   from '../assets/audio/main.ost?url'
import battleUrl from '../assets/audio/battle.mp3?url'

const VOL = { main: 0.40, battle: 0.55 }
const FADE_STEPS = 22
const STEP_MS    = 38   // ~830 ms total crossfade

const _audio = {}
let _current = null
let _muted   = false
let _timer   = null

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
  if (_timer) { clearInterval(_timer); _timer = null }

  const prevKey  = _current
  _current       = key          // ← update immediately so re-entrant calls are safe

  const incoming = _get(key, url)
  const outgoing = prevKey ? _audio[prevKey] : null
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
      if (outgoing) { outgoing.pause(); outgoing.volume = 0 }
    }
  }, STEP_MS)
}

export function playMain()   { _crossfade('main',   mainUrl)   }
export function playBattle() { _crossfade('battle', battleUrl) }

export function setMuted(val) {
  _muted = val
  // Apply instantly to whatever is audible right now
  for (const key in _audio) {
    if (!_audio[key].paused) {
      _audio[key].volume = val ? 0 : (VOL[key] ?? 0.4)
    }
  }
}
