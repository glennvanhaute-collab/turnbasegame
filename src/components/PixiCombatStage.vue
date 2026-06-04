<template>
  <div ref="wrapEl" class="pixi-wrap" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Application, Container, Graphics, Sprite, Text, TextStyle, Assets, Texture } from 'pixi.js'
import { gsap } from 'gsap'
import { useBattleStore } from '../stores/useBattleStore.js'
import { BattleState } from '../game/BattleEngine.js'

// ── Portrait asset map (auto-discovered via portraits.js) ──────────
import { PORTRAIT_MAP } from '../game/portraits.js'
import borderAldricUrl   from '../assets/ui/avatar_border_aldric.png'
import borderValdrisUrl  from '../assets/ui/avatar_border_valdris.png'
import borderCaelwynUrl  from '../assets/ui/avatar_border__caelwyn.png'
import borderMordaineUrl from '../assets/ui/avatar_border_mordaine.png'
import borderAncientUrl  from '../assets/ui/avatar_border__ancient.png'
import borderDefaultUrl  from '../assets/ui/avatar_border.png'

const _avatarModules = import.meta.glob('../assets/units/avatar_*.png', { eager: true })
const AVATAR_URLS = Object.fromEntries(
  Object.entries(_avatarModules)
    .map(([path, mod]) => { const id = path.match(/avatar_\d+/)?.[0]; return [id, mod.default] })
    .filter(([id]) => id)
)

const BORDER_URLS = {
  'House Aldric':   borderAldricUrl,
  'House Valdris':  borderValdrisUrl,
  'House Caelwyn':  borderCaelwynUrl,
  'House Mordaine': borderMordaineUrl,
  'Ancient Nobles': borderAncientUrl,
}
const portraitTextures = {}
const borderTextures   = {}   // keyed by faction name
let defaultBorderTexture = null

const BODY_R = 32  // avatar circle radius — shared by makeHeroSprite and ticker

// ── Foil gradient textures for Ancient rarity ──────────────────────
const _foilCache = {}
function getFoilTexture(affinity) {
  if (_foilCache[affinity]) return _foilCache[affinity]
  const size = 128
  const cv = document.createElement('canvas')
  cv.width = size * 3; cv.height = size
  const ctx = cv.getContext('2d')
  const [c1, c2] = affinity === 'Blood'
    ? ['rgba(220,10,30,', 'rgba(255,80,0,']
    : ['rgba(200,0,240,', 'rgba(255,0,220,']
  const g = ctx.createLinearGradient(0, 0, size * 3, 0)
  g.addColorStop(0,    'rgba(0,0,0,0)')
  g.addColorStop(0.25, c1 + '0.05)')
  g.addColorStop(0.45, c2 + '0.20)')
  g.addColorStop(0.5,  'rgba(255,255,255,0.30)')
  g.addColorStop(0.55, c1 + '0.20)')
  g.addColorStop(0.75, c2 + '0.05)')
  g.addColorStop(1,    'rgba(0,0,0,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size * 3, size)
  _foilCache[affinity] = Texture.from(cv)
  return _foilCache[affinity]
}

const store = useBattleStore()
const wrapEl = ref(null)

let app = null
const sprites = {}
let dividerLine = null
let labelsLayer = null

// ── Color maps ─────────────────────────────────────────────────────
const AFFINITY_COLOR = { Force: 0xff9944, Magic: 0x4fa8ff, Spirit: 0x4dff88, Void: 0xb44fff, Blood: 0xcc1133, Astral: 0xee44cc }
const RARITY_COLOR   = { Ancient: 0x991111, Mythical: 0xff6ef7, Legendary: 0xffd700, Epic: 0xb44fff, Rare: 0x4fa8ff, Uncommon: 0x4dff88, Common: 0x888888 }

// ── Formation slots (fractions of W / H) ──────────────────────────
const PLAYER_SLOTS = [
  { xf: 0.38, yf: 0.50 },
  { xf: 0.24, yf: 0.30 },
  { xf: 0.24, yf: 0.70 },
  { xf: 0.11, yf: 0.30 },
  { xf: 0.11, yf: 0.70 },
]
const ENEMY_SLOTS = PLAYER_SLOTS.map(p => ({ xf: 1 - p.xf, yf: p.yf }))

// ── Hero sprite factory ────────────────────────────────────────────
function makeHeroSprite(hero, isEnemy, teamIndex) {
  const c = new Container()
  c.heroRef  = hero
  c.isEnemy  = isEnemy
  c.baseX    = 0
  c.baseY    = 0
  c.isLeader = teamIndex === 0

  const ac  = AFFINITY_COLOR[hero.affinity] ?? 0xaaaaaa
  const rc  = RARITY_COLOR[hero.rarity]     ?? 0x666666
  const texKey = hero.id === 'player_character'
    ? (hero.avatarId ?? `player_character|${hero.faction}`)
    : hero.name?.toLowerCase().replace(/\s+/g, '-')
  const tex = portraitTextures[texKey]

  const bodyR = BODY_R
  const bodyY = 0
  const feetY = 48

  // ── Background circle (affinity fill) ─────────────────────────
  const body = new Graphics()
  body.circle(0, bodyY, bodyR).fill({ color: ac, alpha: 0.18 })
  c.addChild(body)

  // ── Portrait image (if available) ─────────────────────────────
  if (tex) {
    const img = new Sprite(tex)
    // Scale so width fills the circle, then pin the top of the image
    // to the top of the circle — this shows the face/head area of portrait images
    const scale = (bodyR * 2) / tex.width
    img.scale.set(scale)
    img.anchor.set(0.5, 0.0)
    img.y = bodyY - bodyR
    const mask = new Graphics()
    mask.circle(0, bodyY, bodyR).fill(0xffffff)
    img.mask = mask
    c.addChild(mask)
    c.addChild(img)
  } else {
    // ── Initials fallback ────────────────────────────────────────
    const words    = hero.name.split(' ').filter(w => !/^(the|of|von|de)$/i.test(w))
    const initials = words.length >= 2 ? words[0][0] + words[words.length - 1][0] : hero.name.slice(0, 2)
    const label = new Text({
      text: initials.toUpperCase(),
      style: new TextStyle({ fontFamily: 'Segoe UI, system-ui, sans-serif', fontSize: 17, fontWeight: '800', fill: ac }),
    })
    label.anchor.set(0.5)
    c.addChild(label)
  }

  // ── Ancient foil sheen ────────────────────────────────────────
  if (hero.rarity === 'Ancient') {
    const foilTex  = getFoilTexture(hero.affinity)
    const foil     = new Sprite(foilTex)
    const foilMask = new Graphics()
    foilMask.circle(0, bodyY, bodyR).fill(0xffffff)
    foil.width  = bodyR * 4
    foil.height = bodyR * 2
    foil.anchor.set(0.5, 0.5)
    foil.y      = bodyY
    foil.blendMode = 'screen'
    foil.mask   = foilMask
    c.addChild(foilMask)
    c.addChild(foil)
    c.foil = foil
  }

  // ── Ornate border frame (house-specific, fallback to default) ─
  const frameTex = borderTextures[hero.faction] ?? defaultBorderTexture ?? null
  if (frameTex) {
    const frame = new Sprite(frameTex)
    const frameSize = bodyR * 2 + 20
    frame.width  = frameSize
    frame.height = frameSize
    frame.anchor.set(0.5, 0.5)
    frame.y = bodyY
    c.addChild(frame)
  } else {
    const rarityRing = new Graphics()
    rarityRing.circle(0, bodyY, bodyR + 0.5).stroke({ color: rc, width: 2.5 })
    c.addChild(rarityRing)
  }

  // ── Active / target rings ──────────────────────────────────────
  const ring = new Graphics()
  ring.circle(0, bodyY, bodyR + 8).stroke({ color: 0xffd700, width: 2 })
  ring.alpha = 0
  c.addChild(ring)
  c.ring = ring

  const targetRing = new Graphics()
  targetRing.circle(0, bodyY, bodyR + 8).stroke({ color: 0xff4444, width: 2 })
  targetRing.alpha = 0
  c.addChild(targetRing)
  c.targetRing = targetRing

  // ── Hit flash + death veil ─────────────────────────────────────
  const flash = new Graphics()
  flash.circle(0, bodyY, bodyR).fill({ color: 0xffffff, alpha: 1 })
  flash.alpha = 0
  c.addChild(flash)
  c.flash = flash

  const veil = new Graphics()
  veil.circle(0, bodyY, bodyR).fill({ color: 0x000000, alpha: 0.6 })
  veil.alpha = 0
  c.addChild(veil)
  c.veil = veil

  // ── Name label ─────────────────────────────────────────────────
  const nameText = new Text({
    text: (c.isLeader ? '★ ' : '') + hero.name,
    style: new TextStyle({ fontFamily: 'Segoe UI, system-ui, sans-serif', fontSize: 9,
      fill: c.isLeader ? 0xffd700 : 0x888888, fontWeight: '600' }),
  })
  nameText.anchor.set(0.5, 0)
  nameText.y = feetY + 4
  c.addChild(nameText)

  // ── HP bar ─────────────────────────────────────────────────────
  const hpBg = new Graphics()
  hpBg.rect(-33, feetY + 18, 66, 5).fill({ color: 0x1a0505 })
  c.addChild(hpBg)

  const hpFill = new Graphics()
  c.addChild(hpFill)
  c.hpFill = hpFill
  c.feetY  = feetY

  c.eventMode = 'none'
  c.cursor    = 'crosshair'
  c.on('pointerdown', () => {
    if (store.state === BattleState.SELECTING_TARGET && !c.heroRef.isDead) {
      store.selectTarget(c.heroRef)
    }
  })

  drawHpBar(c, 1)
  return c
}

async function preloadTextures() {
  await Promise.all([
    // Hero portraits — keyed by name-slug ('brenna-shieldmaiden', etc.)
    ...Object.entries(PORTRAIT_MAP).map(async ([slug, url]) => {
      try { portraitTextures[slug] = await Assets.load(url) }
      catch (e) { console.warn(`Failed to load portrait ${slug}:`, e) }
    }),
    // Player character avatars (keyed by avatarId e.g. "avatar_1")
    ...Object.entries(AVATAR_URLS).map(async ([id, url]) => {
      try { portraitTextures[id] = await Assets.load(url) }
      catch (e) { console.warn(`Failed to load avatar ${id}:`, e) }
    }),
    // House-specific borders
    ...Object.entries(BORDER_URLS).map(async ([faction, url]) => {
      try { borderTextures[faction] = await Assets.load(url) }
      catch (e) { console.warn(`Failed to load border for ${faction}:`, e) }
    }),
    // Fallback border
    Assets.load(borderDefaultUrl).then(t => { defaultBorderTexture = t }).catch(() => {}),
  ])
}

function drawHpBar(sprite, pct) {
  const color = pct > 0.55 ? 0x27ae60 : pct > 0.28 ? 0xe67e22 : 0xe74c3c
  const fy = sprite.feetY ?? 32
  sprite.hpFill.clear()
  if (pct > 0) sprite.hpFill.rect(-33, fy + 18, Math.max(1, 66 * pct), 5).fill({ color })
}

// ── Layout ─────────────────────────────────────────────────────────
function layout() {
  if (!app) return
  const W = app.screen.width
  const H = app.screen.height

  const placeFormation = (heroes, slots) => {
    heroes.forEach((hero, i) => {
      const s    = sprites[hero.id]
      const slot = slots[Math.min(i, slots.length - 1)]
      if (!s || !slot) return
      s.baseX = slot.xf * W
      s.baseY = slot.yf * H
      s.x = s.baseX
      s.y = s.baseY
    })
  }

  placeFormation(store.playerTeam, PLAYER_SLOTS)
  placeFormation(store.enemyTeam,  ENEMY_SLOTS)

  if (dividerLine) dividerLine.destroy()
  dividerLine = new Graphics()
  dividerLine.moveTo(W * 0.5, 20).lineTo(W * 0.5, H - 20)
  dividerLine.stroke({ color: 0x3e1c0c, width: 1 })
  app.stage.addChildAt(dividerLine, 0)

  if (labelsLayer) labelsLayer.destroy()
  labelsLayer = new Container()
  const mkLabel = (txt, x, y, anchor = [0, 0]) => {
    const t = new Text({ text: txt, style: new TextStyle({ fontFamily: 'Segoe UI, system-ui, sans-serif', fontSize: 8, fill: 0x333333, fontWeight: '700', letterSpacing: 2 }) })
    t.anchor.set(...anchor)
    t.x = x; t.y = y
    labelsLayer.addChild(t)
  }
  mkLabel('YOUR TEAM', 14,      14)
  mkLabel('ENEMIES',   W - 14, 14, [1, 0])
  app.stage.addChildAt(labelsLayer, 1)
}

// ── Build sprites ──────────────────────────────────────────────────
function buildSprites() {
  for (const id in sprites) { sprites[id].destroy({ children: true }); delete sprites[id] }
  for (let i = app.stage.children.length - 1; i >= 0; i--) {
    const child = app.stage.children[i]
    if (child !== dividerLine && child !== labelsLayer) app.stage.removeChild(child)
  }
  store.enemyTeam.forEach((h, i)  => { const s = makeHeroSprite(h, true,  i); sprites[h.id] = s; app.stage.addChild(s) })
  store.playerTeam.forEach((h, i) => { const s = makeHeroSprite(h, false, i); sprites[h.id] = s; app.stage.addChild(s) })
}

// ── Animations ─────────────────────────────────────────────────────
function animateLunge(sprite, onImpact) {
  const t   = timings()
  const dir = sprite.isEnemy ? -1 : 1
  const startX = sprite.baseX
  const peakX  = startX + dir * 52
  gsap.timeline()
    .to(sprite, { x: peakX,   duration: t.lungeMs / 1000 * 0.42, ease: 'power2.out' })
    .call(onImpact)
    .to(sprite, { x: startX,  duration: t.lungeMs / 1000 * 0.58, ease: 'power2.in' })
}

function animateHit(sprite) {
  const startX = sprite.baseX
  sprite.flash.alpha = 0.9
  gsap.to(sprite.flash, { alpha: 0, duration: 0.3, ease: 'power2.out' })
  gsap.timeline()
    .to(sprite, { x: startX - 9, duration: 0.06, ease: 'none' })
    .to(sprite, { x: startX + 7, duration: 0.07, ease: 'none' })
    .to(sprite, { x: startX - 4, duration: 0.06, ease: 'none' })
    .to(sprite, { x: startX + 2, duration: 0.06, ease: 'none' })
    .to(sprite, { x: startX,     duration: 0.07, ease: 'none' })
}

function animateDeath(sprite) {
  gsap.to(sprite.veil,  { alpha: 1, duration: 0.45 })
  gsap.to(sprite,       { alpha: 0.3, y: sprite.baseY + 6, duration: 0.5, ease: 'power2.out' })
  gsap.to(sprite.scale, { x: 0.86, y: 0.86, duration: 0.5, ease: 'power2.out' })
}

function spawnNumber(hit, x, y) {
  const value  = hit.damage || hit.heal || 0
  const isHeal = hit.heal > 0
  const isCrit = hit.crit
  const color  = isHeal ? '#4dff88' : isCrit ? '#ffd700' : '#ff4444'
  const size   = isCrit ? 24 : 17

  const text = new Text({
    text: (isHeal ? '+' : '') + value,
    style: new TextStyle({
      fontFamily: 'Segoe UI, system-ui, sans-serif',
      fontSize: size, fontWeight: '900', fill: color,
      stroke: { color: '#000000', width: isCrit ? 4 : 3 },
    }),
  })
  text.anchor.set(0.5)
  text.x = x + (Math.random() - 0.5) * 18
  text.y = y
  app.stage.addChild(text)

  gsap.to(text, { y: y - 68, alpha: 0, duration: timings().numMs / 1000, ease: 'power2.out',
    onComplete: () => { text.destroy() }
  })
  if (isCrit) {
    gsap.fromTo(text.scale, { x: 0.6, y: 0.6 }, { x: 1, y: 1, duration: 0.18, ease: 'back.out(2)' })
  }
}

function timings() {
  const s = store.battleSpeed
  if (s === 3) return { lungeMs: 160, numMs: 400,  impactMs: 55  }
  if (s === 2) return { lungeMs: 350, numMs: 750,  impactMs: 120 }
  return             { lungeMs: 520, numMs: 1000, impactMs: 180 }
}

function updateAllHp() {
  const all = [...store.enemyTeam, ...store.playerTeam]
  for (const hero of all) {
    const s = sprites[hero.id]
    if (!s) continue
    const pct = hero.maxHp > 0 ? Math.max(0, hero.hp / hero.maxHp) : 0
    drawHpBar(s, pct)
    if (hero.isDead && s.veil.alpha < 0.5) animateDeath(s)
  }
}

// ── Reactive watchers ──────────────────────────────────────────────
watch(() => store.lastAction, (action) => {
  if (!action?.hits?.length) return
  const t      = timings()
  const caster = sprites[action.casterId]
  if (!caster) return

  animateLunge(caster, () => {
    for (const hit of action.hits) {
      const target = sprites[hit.targetId]
      if (target) {
        animateHit(target)
        spawnNumber(hit, target.x, target.y - 44)
      }
    }
    setTimeout(updateAllHp, t.impactMs)
  })
})

watch(() => store.activeHero, (hero) => {
  for (const id in sprites) sprites[id].ring.alpha = 0
  if (hero) {
    const s = sprites[hero.id]
    if (s) s.ring.alpha = 0.8
  }
})

watch(() => store.state, (state) => {
  const selecting = state === BattleState.SELECTING_TARGET
  store.enemyTeam.forEach(hero => {
    const s = sprites[hero.id]
    if (!s) return
    s.eventMode    = (selecting && !hero.isDead) ? 'static' : 'none'
    s.targetRing.alpha = (selecting && !hero.isDead) ? 0.75 : 0
  })
})

watch(
  () => store.battleKey,
  () => { if (app) { buildSprites(); layout() } },
)

// ── PixiJS init ────────────────────────────────────────────────────
onMounted(async () => {
  app = new Application()
  await app.init({
    resizeTo:        wrapEl.value,
    backgroundAlpha: 0,
    antialias:       true,
    resolution:      window.devicePixelRatio || 1,
    autoDensity:     true,
  })
  wrapEl.value.appendChild(app.canvas)

  await preloadTextures()
  buildSprites()
  layout()

  app.ticker.add(() => {
    const now   = performance.now()
    const pulse = 0.55 + 0.45 * Math.sin(now / 200)
    for (const id in sprites) {
      const s = sprites[id]
      if (s.ring.alpha > 0)       s.ring.alpha       = 0.5 + 0.5 * pulse
      if (s.targetRing.alpha > 0) s.targetRing.alpha = 0.4 + 0.55 * pulse
      if (s.foil) {
        // Sweep the foil strip left-to-right over 5 seconds, then reset
        const t = (now / 5000) % 1
        s.foil.x = t * BODY_R * 6 - BODY_R * 3
      }
    }
  })

  if (store.activeHero) {
    const s = sprites[store.activeHero.id]
    if (s) s.ring.alpha = 0.8
  }
})

onUnmounted(() => {
  gsap.killTweensOf([...Object.values(sprites)])
  app?.destroy(true, { children: true })
  app = null
  for (const id in sprites) delete sprites[id]
})
</script>

<style scoped>
.pixi-wrap {
  width: 100%;
  min-height: 320px;
  border-radius: 12px;
  overflow: hidden;
  background:
    linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.35) 100%),
    url('../assets/backgrounds/battleground_background.png') center / cover no-repeat;
  border: 1px solid #3e1c0c;
  position: relative;
}
.pixi-wrap :deep(canvas) {
  display: block;
  width: 100% !important;
}
</style>
