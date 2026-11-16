import * as THREE from 'three'
import type { L } from '../data/content'
import { chapters, projects } from '../pro/copy'
import { u } from '../base'

export type Lang = 'en' | 'ar'
export interface Circle { x: number; z: number; r: number }
export interface Box { x0: number; x1: number; z0: number; z1: number }
export interface Beacon { id: string; chapter: string; x: number; y: number; z: number; group: THREE.Group; ring: THREE.Mesh; gem: THREE.Mesh; beam: THREE.Mesh; label: THREE.Sprite; found: boolean }
export interface Orb { x: number; y: number; z: number; mesh: THREE.Mesh; taken: boolean; fade: number }
export interface Prop { mesh: THREE.Object3D; x: number; z: number; y: number; vx: number; vz: number; vy: number; r: number; lift: number; roll: boolean }
export interface District { id: string; x: number; z: number; color: string; sign: THREE.Sprite; title: L }

export const ISLAND = 140
export const RING = 70
export const PAD = 27
const DIST = 102
export const ORDER = ['nursing', 'dhmc', 'hr', 'academy', 'aha', 'azu', 'lab']
export const SPAWN = { x: 0, z: 10, yaw: Math.PI }
export const ORB_COUNT = 53

const TAU = Math.PI * 2
const angleOf = (i: number) => -Math.PI / 2 + (i * TAU) / ORDER.length
const centre = (i: number) => ({ x: Math.cos(angleOf(i)) * DIST, z: Math.sin(angleOf(i)) * DIST })

const POND = { ...centre(5), r: 14 }
const BRIDGE = { len: 18, half: 3.5, h: 3 }
const RAMPS = [
  { x0: 16, x1: 25, z0: 8, z1: 14, h: 2 },
  { x0: 14, x1: 23, z0: -71, z1: -64, h: 2 },
]

/** Ground height: flat, except the pond, the bridge over it and two jump ramps. */
export function height(x: number, z: number) {
  let h = 0
  const u = x - POND.x, v = z - POND.z
  const d = Math.hypot(u, v)
  if (d < POND.r) { const t = Math.min(1, (POND.r - d) / 4); h = -0.8 * t * t * (3 - 2 * t) }
  if (Math.abs(u) < BRIDGE.len && Math.abs(v) < BRIDGE.half) h = BRIDGE.h * (1 - (u / BRIDGE.len) ** 2)
  for (const r of RAMPS) if (x > r.x0 && x < r.x1 && z > r.z0 && z < r.z1) h = Math.max(h, ((x - r.x0) / (r.x1 - r.x0)) * r.h)
  return h
}

/* ───────── small helpers */
const glow = (hex: string, k = 2) => new THREE.Color(hex).multiplyScalar(k)
const solid = (hex: string, rough = 0.9) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0.05 })
const lit = (hex: string, k = 2) => new THREE.MeshBasicMaterial({ color: glow(hex, k) })
function canvasTex(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  draw(c.getContext('2d')!)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}
const FONT = '"Manrope Variable","IBM Plex Sans Arabic",sans-serif'
/** Text on a sprite: a dark pill for beacon labels, glowing letters for district signs. */
export function setLabel(sprite: THREE.Sprite, text: string, lang: Lang, color: string, big: boolean, worldH: number) {
  const px = big ? 72 : 36, pad = big ? 24 : 20
  const font = `${big ? 800 : 700} ${px}px ${FONT}`
  const m = document.createElement('canvas').getContext('2d')!
  m.font = font
  const w = Math.ceil(m.measureText(text).width) + pad * 2, h = Math.ceil(px * 1.7)
  const tex = canvasTex(w, h, (c) => {
    c.font = font
    c.direction = lang === 'ar' ? 'rtl' : 'ltr'
    c.textAlign = 'center'
    c.textBaseline = 'middle'
    if (!big) {
      c.fillStyle = 'rgba(6,9,16,0.82)'
      c.strokeStyle = color
      c.lineWidth = 3
      c.beginPath()
      c.roundRect(2, 2, w - 4, h - 4, h / 2)
      c.fill(); c.stroke()
      c.fillStyle = '#ffffff'
    } else {
      c.shadowColor = color; c.shadowBlur = 22
      c.fillStyle = color
    }
    c.fillText(text, w / 2, h / 2 + px * 0.04)
  })
  const mat = sprite.material as THREE.SpriteMaterial
  mat.map?.dispose()
  mat.map = tex
  mat.needsUpdate = true
  sprite.scale.set((worldH * w) / h, worldH, 1)
}

export function buildWorld(scene: THREE.Scene) {
  const circles: Circle[] = []
  const boxes: Box[] = []
  const beacons: Beacon[] = []
  const orbs: Orb[] = []
  const props: Prop[] = []
  const districts: District[] = []
  const ticks: ((t: number, dt: number) => void)[] = []
  const chById = Object.fromEntries(chapters.map((c) => [c.id, c]))

  const add = <T extends THREE.Object3D>(o: T, parent: THREE.Object3D = scene) => { parent.add(o); return o }
  const box = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = scene) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
    o.position.set(x, y + h / 2, z)
    return add(o, parent)
  }
  const flat = (geo: THREE.BufferGeometry, m: THREE.Material, y: number, x = 0, z = 0) => {
    const o = new THREE.Mesh(geo, m)
    o.rotation.x = -Math.PI / 2
    o.position.set(x, y, z)
    return add(o)
  }

  /* ───────── sky, sea, ground */
  scene.background = new THREE.Color('#05070f')
  scene.fog = new THREE.FogExp2('#05070f', 0.0052)
  add(new THREE.HemisphereLight('#6f86c8', '#0a0d16', 1.5))
  const moonLight = add(new THREE.DirectionalLight('#aebfff', 1.3))
  moonLight.position.set(-60, 90, -40)

  const sp = new Float32Array(1600 * 3)
  for (let i = 0; i < 1600; i++) {
    const a = Math.random() * TAU, e = Math.acos(Math.random() * 0.95), R = 700
    sp.set([Math.cos(a) * Math.sin(e) * R, Math.cos(e) * R + 10, Math.sin(a) * Math.sin(e) * R], i * 3)
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3))
  add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: glow('#cfe0ff', 1.6), size: 2.2, sizeAttenuation: false, fog: false })))
  const moon = add(new THREE.Mesh(new THREE.SphereGeometry(26, 24, 16), new THREE.MeshBasicMaterial({ color: glow('#ffe7a8', 1.5), fog: false })))
  moon.position.set(-260, 250, -520)

  flat(new THREE.CircleGeometry(1400, 48), new THREE.MeshStandardMaterial({ color: '#06122a', roughness: 0.35, metalness: 0.4 }), -1.3)
  flat(new THREE.CircleGeometry(ISLAND + 5, 96), solid('#3a3526'), -0.4)
  flat(new THREE.CircleGeometry(ISLAND, 96), solid('#16283c'), 0)
  const road = solid('#1d2740', 0.95)
  flat(new THREE.RingGeometry(RING - 4.5, RING + 4.5, 128), road, 0.02)
  flat(new THREE.RingGeometry(RING - 0.12, RING + 0.12, 128), lit('#ffb23e', 0.9), 0.04)
  flat(new THREE.CircleGeometry(22, 48), solid('#19263c'), 0.03)
  flat(new THREE.RingGeometry(21.6, 22, 64), lit('#ffffff', 1.2), 0.05)

  /* ───────── districts: pad, road, sign, beacons */
  const glowTex = canvasTex(128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 0, 64, 64, 64)
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)')
    c.fillStyle = g; c.fillRect(0, 0, 128, 128)
  })

  ORDER.forEach((id, i) => {
    const a = angleOf(i), c = centre(i), ch = chById[id]
    const len = DIST - PAD + 4 - 20
    const r = new THREE.Mesh(new THREE.PlaneGeometry(9, len), road)
    r.rotation.set(-Math.PI / 2, 0, Math.PI / 2 - a)
    r.position.set(Math.cos(a) * (20 + len / 2), 0.02, Math.sin(a) * (20 + len / 2))
    add(r)
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.24, len), lit(ch.color, 1.1))
    line.rotation.copy(r.rotation)
    line.position.copy(r.position).setY(0.04)
    add(line)
    flat(new THREE.CircleGeometry(PAD, 64), solid('#17243a'), 0.025, c.x, c.z)
    flat(new THREE.RingGeometry(PAD - 0.5, PAD, 96), lit(ch.color, 1.6), 0.05, c.x, c.z)

    const sign = add(new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthWrite: false, fog: false })))
    sign.position.set(c.x, id === 'hr' ? 31 : id === 'dhmc' ? 22 : 19, c.z)
    districts.push({ id, x: c.x, z: c.z, color: ch.color, sign, title: ch.title })

    const list = projects.filter((p) => p.chapter === id)
    list.forEach((p, k) => {
      let bx: number, bz: number
      if (id === 'azu') {
        if (k === 0) { bx = c.x; bz = c.z } else { const t = (Math.PI / 2) + ((k - 1) * TAU) / 3; bx = c.x + Math.cos(t) * 20.5; bz = c.z + Math.sin(t) * 20.5 }
      } else if (list.length > 5) {
        const t = a + Math.PI + ((k + 0.5) * TAU) / list.length
        bx = c.x + Math.cos(t) * 23; bz = c.z + Math.sin(t) * 23
      } else {
        const t = a + Math.PI + (k - (list.length - 1) / 2) * 0.6
        bx = c.x + Math.cos(t) * 17; bz = c.z + Math.sin(t) * 17
      }
      const by = Math.max(0, height(bx, bz))
      const group = new THREE.Group()
      group.position.set(bx, by, bz)
      const col = ch.color
      const ring = new THREE.Mesh(new THREE.RingGeometry(2.5, 3, 40), new THREE.MeshBasicMaterial({ color: glow(col, 1.8), side: THREE.DoubleSide }))
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.08
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 10, 16, 1, true), new THREE.MeshBasicMaterial({ color: glow(col, 1.2), transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
      beam.position.y = 5
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.75), new THREE.MeshBasicMaterial({ color: glow(col, 2.4) }))
      gem.position.y = 2.3
      const label = new THREE.Sprite(new THREE.SpriteMaterial({ transparent: true, depthTest: false, depthWrite: false }))
      label.position.y = 4.6
      label.renderOrder = 10
      group.add(ring, beam, gem, label)
      add(group)
      beacons.push({ id: p.id, chapter: id, x: bx, y: by, z: bz, group, ring, gem, beam, label, found: false })
    })
  })

  /* ───────── landmarks */
  const winTex = canvasTex(256, 256, (c) => {
    c.fillStyle = '#0b1220'; c.fillRect(0, 0, 256, 256)
    const cols = ['#ffd9a0', '#bfe3ff', '#fff1cf']
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      c.fillStyle = Math.random() < 0.55 ? cols[Math.floor(Math.random() * 3)] : '#141d30'
      c.fillRect(x * 32 + 8, y * 32 + 8, 16, 18)
    }
  })
  winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping
  const windowed = (tint: string) => new THREE.MeshStandardMaterial({ color: tint, roughness: 0.8, emissive: '#ffffff', emissiveMap: winTex, emissiveIntensity: 0.85 })
  /** A box whose side faces repeat the window texture; the top stays dark. */
  const building = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D) => {
    const o = box(w, h, d, m, x, y, z, parent)
    const uv = o.geometry.attributes.uv as THREE.BufferAttribute
    for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) {
      const n = f * 4 + k
      if (f === 2 || f === 3) uv.setXY(n, 0.01, 0.01)
      else uv.setXY(n, (uv.getX(n) * (f < 2 ? d : w)) / 24, (uv.getY(n) * h) / 24)
    }
    return o
  }
  /** A group at a district centre, turned so its +z side faces the plaza. */
  const facing = (i: number) => {
    const a = angleOf(i), c = centre(i), g = new THREE.Group()
    g.position.set(c.x, 0, c.z)
    g.rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a))
    add(g)
    const world = (lx: number, lz: number) => {
      const y = g.rotation.y
      return { x: c.x + lx * Math.cos(y) + lz * Math.sin(y), z: c.z - lx * Math.sin(y) + lz * Math.cos(y) }
    }
    return { g, c, world, solidAt: (lx: number, lz: number, r: number) => circles.push({ ...world(lx, lz), r }) }
  }
  const white = solid('#dfe6f0', 0.7)

  // 0 · the ward: a hospital with lit windows and a heartbeat sign
  {
    const { g, solidAt } = facing(0)
    building(20, 9, 9, windowed('#22304a'), 0, 0, 0, g)
    building(7, 6, 8, windowed('#1d2a42'), -13, 0, 0, g)
    building(7, 6, 8, windowed('#1d2a42'), 13, 0, 0, g)
    box(8, 0.4, 4, white, 0, 3.4, 6.2, g)
    box(0.3, 3.4, 0.3, white, -3.6, 0, 8, g); box(0.3, 3.4, 0.3, white, 3.6, 0, 8, g)
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(9, 3), new THREE.MeshBasicMaterial({ transparent: true, color: glow('#ffffff', 2.2), map: canvasTex(384, 128, (c) => {
      c.strokeStyle = '#ff5d73'; c.lineWidth = 9; c.lineJoin = 'round'; c.lineCap = 'round'
      c.beginPath(); c.moveTo(12, 70); c.lineTo(110, 70); c.lineTo(128, 50); c.lineTo(146, 70); c.lineTo(168, 70); c.lineTo(184, 100); c.lineTo(206, 14); c.lineTo(228, 112); c.lineTo(244, 70); c.lineTo(372, 70); c.stroke()
    }) }))
    sign.position.set(0, 11, 4.6)
    g.add(sign)
    for (const x of [-13, -6.5, 0, 6.5, 13]) solidAt(x, 0, 5.4)
  }

  // 1 · the Arbaeen camp: tents around a globe drawn in points
  {
    const i = 1, a = angleOf(i), c = centre(i)
    const tent = solid('#e9e2cf', 0.95)
    for (let k = 0; k < 8; k++) {
      const t = a + (k - 3.5) * 0.4, x = c.x + Math.cos(t) * 15, z = c.z + Math.sin(t) * 15
      const m = new THREE.Mesh(new THREE.ConeGeometry(3.3, 3.8, 4), tent)
      m.position.set(x, 1.9, z); m.rotation.y = Math.PI / 4 - t
      add(m)
      const lamp = add(new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), lit('#ffb23e', 3)))
      lamp.position.set(x - Math.cos(t) * 2.9, 1.5, z - Math.sin(t) * 2.9)
      circles.push({ x, z, r: 2.7 })
    }
    const ped = add(new THREE.Mesh(new THREE.CylinderGeometry(2, 2.6, 2.2, 20), solid('#27354f')))
    ped.position.set(c.x, 1.1, c.z)
    circles.push({ x: c.x, z: c.z, r: 2.9 })
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3))
    const globe = add(new THREE.Points(geo, new THREE.PointsMaterial({ color: glow('#58c7ff', 1.7), size: 0.14, sizeAttenuation: true, fog: false })))
    globe.position.set(c.x, 10.5, c.z)
    const halo = add(new THREE.Mesh(new THREE.TorusGeometry(7.4, 0.07, 8, 96), lit('#ffb23e', 2.2)))
    halo.position.copy(globe.position); halo.rotation.x = 1.2
    fetch(u('land.bin')).then((r) => r.arrayBuffer()).then((buf) => {
      const land = new Int16Array(buf), n = land.length / 2, pos = new Float32Array(n * 3), R = 6
      for (let k = 0; k < n; k++) {
        const lon = (land[k * 2] / 100) * (Math.PI / 180), lat = (land[k * 2 + 1] / 100) * (Math.PI / 180)
        pos.set([R * Math.cos(lat) * Math.sin(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.cos(lon)], k * 3)
      }
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    }).catch(() => {})
    ticks.push((t) => { globe.rotation.y = t * 0.2; halo.rotation.z = t * 0.3 })
  }

  // 2 · HR: a small city of towers, one grid, shared lights
  {
    const c = centre(2), hs = [9, 16, 12, 22, 11, 14, 19, 10, 15, 12, 17, 13]
    hs.forEach((h, k) => {
      const x = c.x + ((k % 4) - 1.5) * 10, z = c.z + (Math.floor(k / 4) - 1) * 10
      building(5.5, h, 5.5, windowed(k % 2 ? '#1f3a40' : '#1b3038'), x, 0, z, scene)
      box(5.7, 0.25, 5.7, lit('#5eead4', 1.5), x, h, z)
      boxes.push({ x0: x - 2.75, x1: x + 2.75, z0: z - 2.75, z1: z + 2.75 })
    })
  }

  // 3 · the academy: columns, a pediment and a verified seal above the roof
  {
    const { g, solidAt } = facing(3)
    const stone = solid('#cfc8b8', 0.8)
    box(21, 1, 10.5, stone, 0, 0, 0, g)
    building(18, 6, 7, windowed('#2a2740'), 0, 1, -0.6, g)
    for (let k = 0; k < 6; k++) { const col = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 6, 12), stone); col.position.set(-7.5 + k * 3, 4, 4); g.add(col) }
    box(20, 0.8, 10, stone, 0, 7, 0, g)
    const tri = new THREE.Shape(); tri.moveTo(-10, 0); tri.lineTo(10, 0); tri.lineTo(0, 3); tri.closePath()
    const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 10, bevelEnabled: false }), stone)
    roof.position.set(0, 7.8, -5); g.add(roof)
    const seal = new THREE.Group(); seal.position.set(0, 15.5, 0); g.add(seal)
    seal.add(new THREE.Mesh(new THREE.TorusGeometry(3, 0.26, 10, 48), lit('#ffd166', 2.2)))
    const tick1 = box(0.4, 1.9, 0.4, lit('#fff3c4', 2.6), -0.9, -1.2, 0, seal); tick1.rotation.z = 0.75
    const tick2 = box(0.4, 3.4, 0.4, lit('#fff3c4', 2.6), 0.55, -1.5, 0, seal); tick2.rotation.z = -0.6
    ticks.push((t) => { seal.rotation.y = t * 0.6 })
    for (const x of [-7.5, 0, 7.5]) solidAt(x, 0, 5.6)
  }

  // 4 · AHA training: a beating heart and a slalom of cones
  {
    const { g, solidAt, world } = facing(4)
    building(14, 5, 8, windowed('#3a2030'), 0, 0, -2, g)
    box(14.4, 0.3, 8.4, lit('#fb7699', 1.4), 0, 5, -2, g)
    for (const x of [-4.5, 4.5]) solidAt(x, -2, 5)
    const s = new THREE.Shape()
    s.moveTo(0, -1.6); s.bezierCurveTo(-3.4, 0.6, -1.8, 3, 0, 1.3); s.bezierCurveTo(1.8, 3, 3.4, 0.6, 0, -1.6)
    const heart = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.7, bevelEnabled: false }), lit('#fb7699', 2.4))
    heart.geometry.translate(0, 0, -0.35)
    heart.position.set(0, 9.5, -2); g.add(heart)
    ticks.push((t) => { const b = (t * 1.1) % 1; heart.scale.setScalar(1 + 0.16 * Math.exp(-b * 9) + 0.1 * Math.exp(-((b - 0.18) ** 2) * 220)); heart.rotation.y = Math.sin(t * 0.5) * 0.5 })
    const cone = new THREE.ConeGeometry(0.45, 1.2, 10), orange = new THREE.MeshStandardMaterial({ color: '#ff7a2f', roughness: 0.6, emissive: '#ff7a2f', emissiveIntensity: 0.35 })
    for (let k = 0; k < 10; k++) {
      const p = world(-13.5 + k * 3, 22 + (k % 2 ? 1.6 : -1.6)), m = add(new THREE.Mesh(cone, orange))
      props.push({ mesh: m, x: p.x, z: p.z, y: 0, vx: 0, vz: 0, vy: 0, r: 0.5, lift: 0.6, roll: false })
    }
  }

  // 5 · AZU60: a bridge over water between three pylons
  {
    const c = POND
    flat(new THREE.CircleGeometry(POND.r - 0.4, 48), new THREE.MeshStandardMaterial({ color: '#0d3a66', roughness: 0.2, metalness: 0.5, emissive: '#0a2a55', emissiveIntensity: 0.8 }), 0.06 - 0.5, c.x, c.z)
    const N = 36, pts: number[] = [], idx: number[] = []
    for (let k = 0; k <= N; k++) {
      const u = -BRIDGE.len + (2 * BRIDGE.len * k) / N, y = BRIDGE.h * (1 - (u / BRIDGE.len) ** 2) + 0.05
      pts.push(c.x + u, y, c.z - BRIDGE.half, c.x + u, y, c.z + BRIDGE.half)
      if (k < N) idx.push(k * 2, k * 2 + 1, k * 2 + 2, k * 2 + 1, k * 2 + 3, k * 2 + 2)
    }
    const deck = new THREE.BufferGeometry()
    deck.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3)); deck.setIndex(idx); deck.computeVertexNormals()
    add(new THREE.Mesh(deck, new THREE.MeshStandardMaterial({ color: '#2a3550', roughness: 0.8, side: THREE.DoubleSide })))
    for (const s of [-1, 1]) {
      const rail = new THREE.CatmullRomCurve3(Array.from({ length: 13 }, (_, k) => { const u = -BRIDGE.len + (2 * BRIDGE.len * k) / 12; return new THREE.Vector3(c.x + u, BRIDGE.h * (1 - (u / BRIDGE.len) ** 2) + 1, c.z + s * BRIDGE.half) }))
      add(new THREE.Mesh(new THREE.TubeGeometry(rail, 48, 0.09, 6), lit('#6fb1ff', 2.2)))
      boxes.push({ x0: c.x - BRIDGE.len, x1: c.x + BRIDGE.len, z0: c.z + s * BRIDGE.half - (s < 0 ? 0.6 : 0), z1: c.z + s * BRIDGE.half + (s > 0 ? 0.6 : 0) })
    }
    ;['#ff8f7d', '#5eead4', '#6fb1ff'].forEach((col, k) => {
      const t = Math.PI / 6 + (k * TAU) / 3, x = c.x + Math.cos(t) * 19, z = c.z + Math.sin(t) * 19
      const pole = add(new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 12, 10), solid('#27354f'))); pole.position.set(x, 6, z)
      const ball = add(new THREE.Mesh(new THREE.SphereGeometry(1.1, 20, 14), lit(col, 2.4))); ball.position.set(x, 12.8, z)
      ticks.push((tm) => { ball.scale.setScalar(1 + 0.12 * Math.sin(tm * 2 + k * 2.1)) })
      circles.push({ x, z, r: 1 })
    })
  }

  // 6 · the lab: a workshop, a dish, crates and a ball to knock about
  {
    const { g, solidAt, world } = facing(6)
    building(14, 5, 8, windowed('#2c3a1c'), 0, 0, -3, g)
    box(14.4, 0.3, 8.4, lit('#c6f26a', 1.3), 0, 5, -3, g)
    for (const x of [-4.5, 4.5]) solidAt(x, -3, 5)
    const dish = new THREE.Mesh(new THREE.SphereGeometry(2.2, 20, 10, 0, TAU, 0, 1.1), new THREE.MeshStandardMaterial({ color: '#dfe6f0', roughness: 0.5, side: THREE.DoubleSide }))
    dish.position.set(4, 8.4, -3); dish.rotation.x = Math.PI + 0.7; g.add(dish)
    box(0.3, 1.6, 0.3, white, 4, 5.3, -3, g)
    const neon = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.4), new THREE.MeshBasicMaterial({ transparent: true, color: glow('#ffffff', 2.4), map: canvasTex(320, 128, (c) => {
      c.strokeStyle = '#c6f26a'; c.lineWidth = 12; c.lineJoin = 'round'; c.lineCap = 'round'
      c.beginPath(); c.moveTo(96, 28); c.lineTo(40, 64); c.lineTo(96, 100); c.moveTo(224, 28); c.lineTo(280, 64); c.lineTo(224, 100); c.moveTo(184, 20); c.lineTo(136, 108); c.stroke()
    }) }))
    neon.position.set(-2.5, 3.2, 1.05); g.add(neon)
    const crate = new THREE.BoxGeometry(1.5, 1.5, 1.5), wood = solid('#7a5a36', 0.9)
    for (let k = 0; k < 8; k++) {
      const p = world(-6 + (k % 4) * 1.7, 9 + Math.floor(k / 4) * 1.7), m = add(new THREE.Mesh(crate, wood))
      props.push({ mesh: m, x: p.x, z: p.z, y: 0, vx: 0, vz: 0, vy: 0, r: 0.95, lift: 0.75, roll: false })
    }
    const p = world(7, 11), ball = add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), new THREE.MeshStandardMaterial({ color: '#c6f26a', roughness: 0.4, flatShading: true, emissive: '#c6f26a', emissiveIntensity: 0.25 })))
    props.push({ mesh: ball, x: p.x, z: p.z, y: 0, vx: 0, vz: 0, vy: 0, r: 1.5, lift: 1.5, roll: true })
  }

  // plaza: a ball and a few cones to warm up on
  {
    const ball = add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 1), new THREE.MeshStandardMaterial({ color: '#ff5d73', roughness: 0.4, flatShading: true, emissive: '#ff5d73', emissiveIntensity: 0.25 })))
    props.push({ mesh: ball, x: -9, z: -2, y: 0, vx: 0, vz: 0, vy: 0, r: 1.4, lift: 1.4, roll: true })
    const cone = new THREE.ConeGeometry(0.45, 1.2, 10), orange = new THREE.MeshStandardMaterial({ color: '#ff7a2f', roughness: 0.6, emissive: '#ff7a2f', emissiveIntensity: 0.35 })
    for (let k = 0; k < 6; k++) {
      const m = add(new THREE.Mesh(cone, orange))
      props.push({ mesh: m, x: 8 + (k % 3) * 1.6, z: -8 - Math.floor(k / 3) * 1.6, y: 0, vx: 0, vz: 0, vy: 0, r: 0.5, lift: 0.6, roll: false })
    }
  }

  // jump ramps
  for (const r of RAMPS) {
    const s = new THREE.Shape(); s.moveTo(0, 0); s.lineTo(r.x1 - r.x0, 0); s.lineTo(r.x1 - r.x0, r.h); s.closePath()
    const m = add(new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: r.z1 - r.z0, bevelEnabled: false }), solid('#2a3550', 0.7)))
    m.position.set(r.x0, 0, r.z0)
    const edge = box(0.25, 0.12, r.z1 - r.z0, lit('#ffb23e', 2.4), r.x1 - 0.12, r.h, (r.z0 + r.z1) / 2)
    edge.position.y = r.h + 0.02
  }

  /* ───────── trees and lamps (instanced) */
  const onRoad = (x: number, z: number) => {
    const r = Math.hypot(x, z)
    if (r < 26 || Math.abs(r - RING) < 9) return true
    for (let i = 0; i < ORDER.length; i++) {
      const c = centre(i)
      if (Math.hypot(x - c.x, z - c.z) < PAD + 4) return true
      const a = angleOf(i), along = x * Math.cos(a) + z * Math.sin(a), side = Math.abs(-x * Math.sin(a) + z * Math.cos(a))
      if (along > 0 && along < DIST && side < 8) return true
    }
    for (const rp of RAMPS) if (x > rp.x0 - 6 && x < rp.x1 + 16 && z > rp.z0 - 4 && z < rp.z1 + 4) return true
    return false
  }
  const trees = new THREE.InstancedMesh(new THREE.ConeGeometry(1.5, 4.6, 6), new THREE.MeshStandardMaterial({ color: '#14514a', roughness: 1, flatShading: true }), 240)
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v3 = new THREE.Vector3(), s3 = new THREE.Vector3()
  let placed = 0, guard = 0
  while (placed < 240 && guard++ < 6000) {
    const a = Math.random() * TAU, r = Math.sqrt(Math.random()) * (ISLAND - 5), x = Math.cos(a) * r, z = Math.sin(a) * r
    if (onRoad(x, z)) continue
    const k = 0.7 + Math.random() * 0.9
    trees.setMatrixAt(placed++, m4.compose(v3.set(x, 2.3 * k, z), q, s3.set(k, k, k)))
    circles.push({ x, z, r: 0.75 * k })
  }
  trees.count = placed
  add(trees)

  const lampAt: [number, number][] = []
  for (let i = 0; i < ORDER.length; i++) {
    const a = angleOf(i)
    for (let d = 30; d < DIST - PAD; d += 13) { const s = (d / 13) % 2 < 1 ? 6 : -6; lampAt.push([Math.cos(a) * d - Math.sin(a) * s, Math.sin(a) * d + Math.cos(a) * s]) }
  }
  for (let k = 0; k < 28; k++) { const a = (k / 28) * TAU + 0.11, r = RING + (k % 2 ? 6 : -6); lampAt.push([Math.cos(a) * r, Math.sin(a) * r]) }
  const poles = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.09, 0.12, 4.4, 6), solid('#3a4660'), lampAt.length)
  const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.3, 10, 8), lit('#ffe2ad', 1.5), lampAt.length)
  const pools = new THREE.InstancedMesh(new THREE.PlaneGeometry(13, 13), new THREE.MeshBasicMaterial({ map: glowTex, color: '#ffcf8a', transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }), lampAt.length)
  const down = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0))
  lampAt.forEach(([x, z], k) => {
    poles.setMatrixAt(k, m4.compose(v3.set(x, 2.2, z), q, s3.set(1, 1, 1)))
    bulbs.setMatrixAt(k, m4.compose(v3.set(x, 4.5, z), q, s3.set(1, 1, 1)))
    pools.setMatrixAt(k, m4.compose(v3.set(x, 0.07, z), down, s3.set(1, 1, 1)))
  })
  add(poles); add(bulbs); add(pools)

  /* ───────── 53 lights to collect: each stands for 1,000 records */
  const orbGeo = new THREE.IcosahedronGeometry(0.5, 0)
  const orbAt: [number, number, number][] = []
  for (let k = 0; k < 28; k++) { const a = ((k + 0.5) / 28) * TAU; orbAt.push([Math.cos(a) * RING, 1.2, Math.sin(a) * RING]) }
  for (let i = 0; i < ORDER.length; i++) for (const d of [32, 45, 58]) orbAt.push([Math.cos(angleOf(i)) * d, 1.2, Math.sin(angleOf(i)) * d])
  orbAt.push([31, 2.6, 11], [29, 2.6, -64.5], [-12, 1.2, 12], [12, 1.2, 14])
  orbAt.slice(0, ORB_COUNT).forEach(([x, y, z], k) => {
    const mesh = add(new THREE.Mesh(orbGeo, new THREE.MeshBasicMaterial({ color: glow(k % 4 === 0 ? '#ffb23e' : '#2ee6c8', 1.7), transparent: true })))
    mesh.position.set(x, y, z)
    orbs.push({ x, y, z, mesh, taken: false, fade: 0 })
  })

  /* ───────── welcome board with the portrait */
  const board = new THREE.Group()
  board.position.set(-13, 0, -13)
  board.rotation.y = Math.atan2(13, 23)
  add(board)
  box(0.3, 3, 0.3, solid('#3a4660'), -4.4, 0, 0, board); box(0.3, 3, 0.3, solid('#3a4660'), 4.4, 0, 0, board)
  const face = new THREE.Mesh(new THREE.PlaneGeometry(11, 5.5), new THREE.MeshBasicMaterial({ color: glow('#ffffff', 1.05) }))
  face.position.set(0, 5.4, 0.1); board.add(face)
  box(11.4, 5.9, 0.2, lit('#ff5d73', 1.6), 0, 2.45, -0.05, board)
  const bw = board.rotation.y
  circles.push({ x: -13 - 4.4 * Math.cos(bw), z: -13 + 4.4 * Math.sin(bw), r: 0.6 }, { x: -13 + 4.4 * Math.cos(bw), z: -13 - 4.4 * Math.sin(bw), r: 0.6 })
  const portrait = new Image()
  portrait.src = u('shots/portrait.webp')
  let boardText = { name: '', title: '', line: '', lang: 'en' as Lang }
  const paintBoard = () => {
    const mat = face.material as THREE.MeshBasicMaterial
    mat.map?.dispose()
    mat.map = canvasTex(1024, 512, (c) => {
      const rtl = boardText.lang === 'ar'
      c.fillStyle = '#080c16'; c.fillRect(0, 0, 1024, 512)
      const px = rtl ? 1024 - 56 - 400 : 56
      if (portrait.complete && portrait.naturalWidth) { c.save(); c.beginPath(); c.roundRect(px, 56, 400, 400, 28); c.clip(); c.drawImage(portrait, px, 56, 400, 400); c.restore() }
      c.direction = rtl ? 'rtl' : 'ltr'; c.textAlign = rtl ? 'right' : 'left'
      const tx = rtl ? 1024 - 56 - 400 - 40 : 56 + 400 + 40, maxW = 470
      c.fillStyle = '#ff5d73'; c.font = `700 30px ${FONT}`; c.fillText(boardText.line, tx, 130, maxW)
      c.fillStyle = '#ffffff'; c.font = `800 62px ${FONT}`
      const words = boardText.name.split(' ')
      c.fillText(words.slice(0, 2).join(' '), tx, 220, maxW); c.fillText(words.slice(2).join(' '), tx, 292, maxW)
      c.fillStyle = '#b9c2d4'; c.font = `500 28px ${FONT}`
      const t = boardText.title.split(' '), half = Math.ceil(t.length / 2)
      c.fillText(t.slice(0, half).join(' '), tx, 370, maxW); c.fillText(t.slice(half).join(' '), tx, 410, maxW)
    })
    mat.needsUpdate = true
  }
  portrait.onload = paintBoard

  /** Redraw every piece of text in the world for the chosen language. */
  const relabel = (lang: Lang, text: { name: string; title: string; line: string }) => {
    const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
    for (const b of beacons) setLabel(b.label, (b.found ? '✓ ' : '') + byId[b.id].title[lang], lang, b.found ? '#8ff5c8' : chById[b.chapter].color, false, 1.1)
    for (const d of districts) setLabel(d.sign, d.title[lang], lang, d.color, true, 4.2)
    boardText = { ...text, lang }
    paintBoard()
  }

  return { circles, boxes, beacons, orbs, props, districts, ticks, relabel }
}
