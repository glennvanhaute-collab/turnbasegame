import { ref, onMounted, onUnmounted } from 'vue'

// Canvas-based combat skill FX — brush arcs, orb projectiles, seal circles, petal bursts.
// Usage: const fx = useCanvasFx()
// Bind fx.stageEl to the combat stage root, fx.fxCanvas to a <canvas> element.
export function useCanvasFx() {
  const fxCanvas = ref(null)
  const stageEl  = ref(null)

  let _ctx       = null
  let _fx        = []
  let _amb       = []
  let _raf       = null
  let _lastFrame = performance.now()

  // ── Canvas sizing ────────────────────────────────────────────────
  function _resize() {
    const canvas = fxCanvas.value
    const stage  = stageEl.value
    if (!canvas || !stage) return
    const rect = stage.getBoundingClientRect()
    const dpr  = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width  = Math.round(rect.width  * dpr)
    canvas.height = Math.round(rect.height * dpr)
    canvas.style.width  = rect.width  + 'px'
    canvas.style.height = rect.height + 'px'
    _ctx = canvas.getContext('2d')
    _ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // ── Element centre relative to stage ────────────────────────────
  function _center(heroId) {
    const stage = stageEl.value
    if (!stage) return { x: 0, y: 0 }
    const card = stage.querySelector(`[data-hero-id="${heroId}"]`)
    if (!card) return { x: 0, y: 0 }
    const cr = card.getBoundingClientRect()
    const sr = stage.getBoundingClientRect()
    return { x: cr.left - sr.left + cr.width / 2, y: cr.top - sr.top + cr.height * 0.5 }
  }

  // ── Math helpers ─────────────────────────────────────────────────
  const _easeOut = t => 1 - Math.pow(1 - t, 3)
  const _easeIO  = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2
  const _cl      = (v, a, b) => Math.max(a, Math.min(b, v))

  // ── Effect queue ─────────────────────────────────────────────────
  function _addFx(e) { e.start = performance.now(); _fx.push(e) }

  // ── Draw effects ─────────────────────────────────────────────────
  function _drawFx(now) {
    _fx = _fx.filter(e => now - e.start <= e.duration)
    for (const e of _fx) {
      const t = _cl((now - e.start) / e.duration, 0, 1)
      _ctx.save()

      if (e.type === 'brush') {
        const tt = _easeIO(t)
        const x  = e.from.x + (e.to.x - e.from.x) * tt
        const y  = e.from.y + (e.to.y - e.from.y) * tt
        _ctx.globalCompositeOperation = 'screen'
        _ctx.lineCap = 'round'
        for (let i = 0; i < 4; i++) {
          _ctx.strokeStyle = `rgba(${e.rgb},${0.85 * (1 - t)})`
          _ctx.lineWidth   = 18 - i * 3
          _ctx.beginPath()
          _ctx.moveTo(x - 40 - i*5, y + 20 - i*5)
          _ctx.quadraticCurveTo(x, y - 38 - i*6, x + 44 + i*6, y - 4 + i*2)
          _ctx.stroke()
        }
      } else if (e.type === 'splash') {
        const r = 14 + _easeOut(t) * 64
        _ctx.globalCompositeOperation = 'screen'
        _ctx.strokeStyle = `rgba(${e.rgb},${1 - t})`
        _ctx.lineWidth   = 4 * (1 - t) + 1
        _ctx.beginPath(); _ctx.arc(e.at.x, e.at.y, r, 0, 6.28); _ctx.stroke()
        for (let i = 0; i < 10; i++) {
          const a   = i / 10 * 6.28 + (e.seed || 0)
          const len = 12 + t * (24 + (i % 3) * 7)
          _ctx.beginPath()
          _ctx.moveTo(e.at.x + Math.cos(a)*6,   e.at.y + Math.sin(a)*6)
          _ctx.lineTo(e.at.x + Math.cos(a)*len, e.at.y + Math.sin(a)*len)
          _ctx.stroke()
        }
      } else if (e.type === 'seal') {
        const r = 28 + Math.sin(t * Math.PI) * 14
        _ctx.translate(e.at.x, e.at.y)
        _ctx.rotate(t * Math.PI * 1.4)
        _ctx.globalCompositeOperation = 'screen'
        _ctx.strokeStyle = `rgba(${e.rgb},${Math.sin(t * Math.PI) * 0.9})`
        _ctx.lineWidth   = 2.5
        _ctx.beginPath(); _ctx.arc(0, 0, r, 0, 6.28); _ctx.stroke()
        for (let i = 0; i < 8; i++) {
          const a = i / 8 * 6.28
          _ctx.beginPath()
          _ctx.moveTo(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5)
          _ctx.lineTo(Math.cos(a) * r * 0.9, Math.sin(a) * r * 0.9)
          _ctx.stroke()
        }
      } else if (e.type === 'petals') {
        _ctx.globalCompositeOperation = 'screen'
        for (let i = 0; i < 14; i++) {
          const a  = i / 14 * 6.28 + t * 3.5
          const rr = 18 + t * 60 + (i % 3) * 4
          const px = e.at.x + Math.cos(a) * rr
          const py = e.at.y + Math.sin(a) * rr
          _ctx.fillStyle = `rgba(${e.rgb},${0.9 * (1 - t)})`
          _ctx.beginPath()
          _ctx.moveTo(px, py)
          _ctx.quadraticCurveTo(px + 7, py + 3, px, py + 9)
          _ctx.quadraticCurveTo(px - 6, py + 4, px, py)
          _ctx.fill()
        }
      } else if (e.type === 'orb') {
        const tt = _easeIO(t)
        const x  = e.from.x + (e.to.x - e.from.x) * tt
        const y  = e.from.y + (e.to.y - e.from.y) * tt + Math.sin(tt * Math.PI) * -28
        const r  = 8 + 8 * Math.sin(tt * Math.PI)
        const g  = _ctx.createRadialGradient(x, y, 0, x, y, r * 3)
        g.addColorStop(0,   `rgba(${e.rgb},1)`)
        g.addColorStop(0.3, `rgba(${e.rgb},.7)`)
        g.addColorStop(1,   `rgba(${e.rgb},0)`)
        _ctx.fillStyle = g
        _ctx.beginPath(); _ctx.arc(x, y, r * 3, 0, 6.28); _ctx.fill()
      }

      _ctx.restore()
    }
  }

  // ── Ambient spark/dust particles (gold motes drifting upward) ────
  function _seedAmb() {
    _amb = Array.from({ length: 30 }, () => ({
      x: Math.random(), y: Math.random(),
      speed: 0.003 + Math.random() * 0.008,
      drift: (Math.random() - 0.5) * 0.012,
      size:  0.5 + Math.random() * 1.5,
      alpha: 0.03 + Math.random() * 0.09,
      phase: Math.random() * 6.28,
    }))
  }

  function _drawAmb(w, h, dt) {
    for (const p of _amb) {
      p.y -= p.speed * dt
      p.x += p.drift * dt * 0.05 + Math.sin(performance.now() / 1800 + p.phase) * 0.00004 * dt
      if (p.y < -0.05) { p.y = 1.05; p.x = Math.random() }
      if (p.x < -0.05)  p.x = 1.05
      if (p.x >  1.05)  p.x = -0.05
      const px = p.x * w, py = p.y * h
      _ctx.fillStyle = `rgba(201,166,101,${p.alpha})`
      _ctx.beginPath()
      _ctx.moveTo(px, py)
      _ctx.quadraticCurveTo(px + p.size * 2.2, py + p.size * 1.1, px, py + p.size * 2.2)
      _ctx.quadraticCurveTo(px - p.size * 1.7, py + p.size * 1.1, px, py)
      _ctx.fill()
    }
  }

  // ── RAF loop ─────────────────────────────────────────────────────
  function _frame(now) {
    if (!_ctx || !stageEl.value) { _raf = requestAnimationFrame(_frame); return }
    const rect = stageEl.value.getBoundingClientRect()
    const dt   = Math.min(40, now - _lastFrame); _lastFrame = now
    _ctx.clearRect(0, 0, rect.width, rect.height)
    _drawAmb(rect.width, rect.height, dt)
    _drawFx(now)
    _raf = requestAnimationFrame(_frame)
  }

  // ── Public FX API ────────────────────────────────────────────────
  function brushFx(fromId, toId, rgb = '201,166,101') {
    _addFx({ type: 'brush', from: _center(fromId), to: _center(toId), rgb, duration: 420 })
    setTimeout(() => _addFx({ type: 'splash', at: _center(toId), rgb, duration: 340, seed: Math.random() * 6.28 }), 240)
  }

  function orbFx(fromId, toId, rgb = '82,98,200', delay = 0) {
    setTimeout(() => {
      _addFx({ type: 'orb', from: _center(fromId), to: _center(toId), rgb, duration: 500 })
      setTimeout(() => _addFx({ type: 'splash', at: _center(toId), rgb, duration: 340, seed: Math.random() * 6.28 }), 340)
    }, delay)
  }

  function sealFx(heroId, rgb = '82,98,200') {
    _addFx({ type: 'seal', at: _center(heroId), rgb, duration: 800 })
  }

  function petalsFx(heroId, rgb = '120,210,140') {
    _addFx({ type: 'petals', at: _center(heroId), rgb, duration: 740 })
  }

  function splashFx(heroId, rgb = '201,166,101') {
    _addFx({ type: 'splash', at: _center(heroId), rgb, duration: 340, seed: Math.random() * 6.28 })
  }

  // ── Lifecycle ────────────────────────────────────────────────────
  onMounted(() => {
    _resize()
    _seedAmb()
    _raf = requestAnimationFrame(_frame)
    window.addEventListener('resize', _resize)
  })

  onUnmounted(() => {
    if (_raf) cancelAnimationFrame(_raf)
    window.removeEventListener('resize', _resize)
  })

  return { fxCanvas, stageEl, brushFx, orbFx, sealFx, petalsFx, splashFx }
}
