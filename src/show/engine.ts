import * as THREE from 'three'
import { u } from '../base'

/** One point for every record captured by the first system. */
export const N = 53000
export const SCENES = ['ecg', 'night', 'records', 'globe', 'hr', 'seal', 'bridge', 'portrait'] as const
export type SceneName = (typeof SCENES)[number]

/** Written by the page on scroll and pointer move, read by the render loop. */
export const stage = { f: 0, reveal: 0, mx: 0, my: 0, hover: false, rtl: false }

interface Shape { pos: Float32Array; col: Uint8Array }

const KARBALA: [number, number] = [44.02, 32.62]
const GLOBE_R = 2.2
/** Illustrative origins for the arcs: cities, not patient data. */
const ORIGINS: [number, number][] = [
  [51.39, 35.69], [67.01, 24.86], [74.34, 31.55], [72.88, 19.08], [80.95, 26.85], [47.98, 29.38], [50.59, 26.23],
  [35.5, 33.89], [28.98, 41.01], [49.87, 40.41], [69.17, 34.53], [-0.13, 51.51], [3.38, 6.52], [39.28, -6.79],
  [106.85, -6.21], [-83.18, 42.32], [151.21, -33.87], [13.4, 52.52], [90.41, 23.81], [58.4, 23.59],
]

/* ───────── helpers */
function rng(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const hex = (h: string): [number, number, number] => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const mixc = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const blank = (): Shape => ({ pos: new Float32Array(N * 3), col: new Uint8Array(N * 4) })
function put(s: Shape, i: number, x: number, y: number, z: number, c: [number, number, number], a: number) {
  s.pos[i * 3] = x; s.pos[i * 3 + 1] = y; s.pos[i * 3 + 2] = z
  s.col[i * 4] = c[0]; s.col[i * 4 + 1] = c[1]; s.col[i * 4 + 2] = c[2]; s.col[i * 4 + 3] = a
}
const gauss = (r: () => number) => (r() + r() + r() + r() - 2) * 0.7
function dust(s: Shape, i: number, r: () => number, c: [number, number, number], a = 14) {
  put(s, i, (r() * 2 - 1) * 9, (r() * 2 - 1) * 5, -1 - r() * 4, c, a * (0.4 + r()))
}
/** lon/lat to a globe turned so Karbala faces the viewer. */
function globePoint(lon: number, lat: number, R: number): [number, number, number] {
  const p = (lat * Math.PI) / 180
  const l = ((lon - KARBALA[0]) * Math.PI) / 180
  const x = R * Math.cos(p) * Math.sin(l)
  const y = R * Math.sin(p)
  const z = R * Math.cos(p) * Math.cos(l)
  const t = (20 * Math.PI) / 180
  return [x, y * Math.cos(t) - z * Math.sin(t), y * Math.sin(t) + z * Math.cos(t)]
}

/* ───────── shapes */
const ecgWave = (x: number) => {
  const t = (((x / 2.6) % 1) + 1) % 1
  const g = (c: number, w: number, a: number) => a * Math.exp(-(((t - c) / w) ** 2))
  return g(0.18, 0.035, 0.13) + g(0.36, 0.012, -0.16) + g(0.4, 0.014, 1.25) + g(0.445, 0.013, -0.32) + g(0.66, 0.05, 0.3)
}
function ecg(): Shape {
  const s = blank(), r = rng(1), c = hex('#ff5d73'), c2 = hex('#ffb199')
  for (let i = 0; i < N; i++) {
    const x = (r() * 2 - 1) * 8.5
    if (i < N * 0.78) put(s, i, x, ecgWave(x) * 0.95 + gauss(r) * 0.014, gauss(r) * 0.03, mixc(c, c2, r() * 0.5), 225)
    else put(s, i, x, ecgWave(x) * 0.95 + (r() - 0.5) * 2.2, -r() * 2, c, 22 + r() * 30)
  }
  return s
}
function night(): Shape {
  const s = blank(), r = rng(2), moon = hex('#ffe7a8'), a = hex('#9fb8ff'), b = hex('#ffffff')
  let i = 0
  while (i < 12000) {
    const x = (r() * 2 - 1) * 1.5, y = (r() * 2 - 1) * 1.5
    if (x * x + y * y > 2.25) continue
    const dx = x - 0.62, dy = y - 0.3
    if (dx * dx + dy * dy < 1.5) continue
    put(s, i++, x - 0.3, y + 0.2, gauss(r) * 0.03, moon, 215)
  }
  for (; i < N; i++) put(s, i, (r() * 2 - 1) * 10, (r() * 2 - 1) * 5.5, -r() * 5, mixc(a, b, r()), 18 + r() ** 5 * 237)
  return s
}
function records(): Shape {
  const s = blank(), amber = hex('#ffb23e'), teal = hex('#2ee6c8'), cols = 265, dx = 5.0 / cols, rows = 200
  for (let i = 0; i < N; i++) {
    const cx = i % cols, cy = Math.floor(i / cols)
    put(s, i, (cx - (cols - 1) / 2) * dx, (cy - (rows - 1) / 2) * dx, 0, i < 15000 ? amber : teal, 235)
  }
  return s
}
function globe(land: Int16Array | null): Shape {
  const s = blank(), r = rng(4), c1 = hex('#3fa9ff'), c2 = hex('#8ff3ff'), R = GLOBE_R
  const M = land ? land.length / 2 : 0
  for (let i = 0; i < N; i++) {
    let lon: number, lat: number
    if (M) {
      const j = i % M
      lon = land![j * 2] / 100 + gauss(r) * 0.12
      lat = land![j * 2 + 1] / 100 + gauss(r) * 0.12
    } else {
      lat = (Math.asin(1 - (2 * (i + 0.5)) / N) * 180) / Math.PI
      lon = (i * 137.508) % 360
    }
    const p = globePoint(lon, lat, R)
    put(s, i, p[0], p[1], p[2], mixc(c1, c2, r()), p[2] > 0 ? 200 : 60)
  }
  return s
}
function hr(): Shape {
  const s = blank(), r = rng(5), mint = hex('#5eead4'), pale = hex('#d9fff7')
  const heights = [5, 9, 7, 11, 6, 8, 10, 6, 9, 7, 8, 8], sp = 0.1, pitch = 8 * sp + 0.36
  const ry = (38 * Math.PI) / 180, rx = (24 * Math.PI) / 180
  const turn = (x: number, y: number, z: number): [number, number, number] => {
    const x1 = x * Math.cos(ry) + z * Math.sin(ry), z1 = -x * Math.sin(ry) + z * Math.cos(ry)
    return [x1, y * Math.cos(rx) - z1 * Math.sin(rx) + 0.35, y * Math.sin(rx) + z1 * Math.cos(rx)]
  }
  let i = 0
  outer: for (let b = 0; b < 12; b++) {
    const bc = b % 4, br = Math.floor(b / 4)
    for (let lv = 0; lv < heights[b]; lv++) for (let ix = 0; ix < 8; ix++) for (let iz = 0; iz < 8; iz++) {
      if (i >= 6000) break outer
      const p = turn((bc - 1.5) * pitch + (ix - 3.5) * sp, lv * sp - 1.25, (br - 1) * pitch + (iz - 3.5) * sp)
      put(s, i++, p[0], p[1], p[2], mixc(mint, pale, lv / 11), 235)
    }
  }
  for (; i < N; i++) {
    const p = turn((r() * 2 - 1) * 7, -1.29, (r() * 2 - 1) * 7)
    put(s, i, p[0], p[1], p[2], mint, 10 + r() * 16)
  }
  return s
}
function seal(): Shape {
  const s = blank(), r = rng(6), gold = hex('#ffd166'), lite = hex('#fff3c4'), violet = hex('#b79cff')
  let i = 0
  for (; i < 1150; i++) {
    const th = r() * Math.PI * 2, rad = (1.72 + r() * 0.4) * (1 + 0.05 * Math.cos(18 * th))
    put(s, i, Math.cos(th) * rad, Math.sin(th) * rad, gauss(r) * 0.03, gold, 235)
  }
  for (; i < 1550; i++) {
    const th = r() * Math.PI * 2, rad = 1.34 + gauss(r) * 0.012
    put(s, i, Math.cos(th) * rad, Math.sin(th) * rad, 0, lite, 235)
  }
  for (; i < 2000; i++) {
    const first = r() < 0.36, t = r()
    const x = first ? -0.62 + t * 0.44 : -0.18 + t * 0.9, y = first ? -0.02 - t * 0.5 : -0.52 + t * 1.06
    put(s, i, x + gauss(r) * 0.035, y + gauss(r) * 0.035, 0.05, lite, 245)
  }
  for (; i < N; i++) dust(s, i, r, violet, 13)
  return s
}
function bridge(): Shape {
  const s = blank(), r = rng(7)
  const nodes: { p: [number, number, number]; c: [number, number, number] }[] = [
    { p: [0, 1.55, 0], c: hex('#ff8f7d') },
    { p: [-1.95, -1.2, 0], c: hex('#5eead4') },
    { p: [1.95, -1.2, 0], c: hex('#6fb1ff') },
  ]
  let i = 0
  for (; i < 24000; i++) {
    const n = nodes[i % 3], u = r() * 2 - 1, th = r() * Math.PI * 2, q = Math.sqrt(1 - u * u), R = 0.78
    put(s, i, n.p[0] + R * q * Math.cos(th), n.p[1] + R * u, R * q * Math.sin(th), n.c, 150)
  }
  for (; i < 43000; i++) {
    const a = nodes[i % 3], b = nodes[(i + 1) % 3], t = r()
    const mx = (a.p[0] + b.p[0]) / 2 * 0.55, my = ((a.p[1] + b.p[1]) / 2) * 0.55 - 0.12
    const x = (1 - t) * (1 - t) * a.p[0] + 2 * (1 - t) * t * mx + t * t * b.p[0]
    const y = (1 - t) * (1 - t) * a.p[1] + 2 * (1 - t) * t * my + t * t * b.p[1]
    put(s, i, x + gauss(r) * 0.05, y + gauss(r) * 0.05, gauss(r) * 0.05, mixc(a.c, b.c, t), 120)
  }
  for (; i < N; i++) dust(s, i, r, hex('#6fb1ff'), 12)
  return s
}
/** The portrait as a relief of coloured points, faded into a round medallion. */
function portrait(img: ImageData): Shape {
  const s = blank(), r = rng(8), G = 230, size = 5.2, d = size / G
  let i = 0
  for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++, i++) {
    const px = Math.min(img.width - 1, Math.floor(((gx + 0.5) / G) * img.width))
    const py = Math.min(img.height - 1, Math.floor(((gy + 0.5) / G) * img.height))
    const o = (py * img.width + px) * 4
    const c: [number, number, number] = [img.data[o], img.data[o + 1], img.data[o + 2]]
    const lum = (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255
    const x = (gx - (G - 1) / 2) * d, y = ((G - 1) / 2 - gy) * d
    const rad = Math.hypot(x, y) / (size / 2)
    const fade = Math.max(0, Math.min(1, (1.0 - rad) / 0.2))
    if (fade <= 0) dust(s, i, r, c, 12)
    else put(s, i, x, y, lum * 0.7 - 0.35, [Math.min(255, c[0] * 1.12 + 6), Math.min(255, c[1] * 1.12 + 6), Math.min(255, c[2] * 1.12 + 6)], 240 * fade)
  }
  for (; i < N; i++) dust(s, i, r, [255, 200, 160], 12)
  return s
}

/* ───────── per-scene staging: horizontal and vertical offset as fractions of the view, point size */
const STAGING: Record<SceneName, { ox: number; oy: number; size: number; nx: number; ny: number }> = {
  ecg: { ox: 0, oy: -0.34, size: 0.05, nx: 0, ny: -0.3 },
  night: { ox: 0.22, oy: 0.02, size: 0.05, nx: 0, ny: 0.25 },
  records: { ox: 0.22, oy: 0, size: 0.025, nx: 0, ny: 0.27 },
  globe: { ox: 0.22, oy: 0, size: 0.034, nx: 0, ny: 0.24 },
  hr: { ox: 0.22, oy: 0, size: 0.036, nx: 0, ny: 0.27 },
  seal: { ox: 0.22, oy: 0, size: 0.052, nx: 0, ny: 0.25 },
  bridge: { ox: 0.22, oy: 0, size: 0.04, nx: 0, ny: 0.25 },
  portrait: { ox: 0.235, oy: 0, size: 0.034, nx: 0, ny: 0.25 },
}

const VERT = /* glsl */ `
attribute vec3 aTo;
attribute vec4 aCFrom;
attribute vec4 aCTo;
attribute float aRnd;
attribute float aIdx;
uniform float uMix, uTime, uSize, uK, uAspect, uReveal, uRevealW, uPulseW;
uniform vec2 uMouse;
varying vec4 vC;
void main() {
  float t = clamp((uMix - aRnd * 0.35) / 0.65, 0.0, 1.0);
  t = t * t * (3.0 - 2.0 * t);
  vec3 p = mix(position, aTo, t);
  float mid = sin(t * 3.14159);
  p += mid * 0.55 * vec3(sin(aRnd * 40.0 + uTime * 0.6), cos(aRnd * 31.0 + uTime * 0.5), sin(aRnd * 23.0));
  p.xy += 0.008 * vec2(sin(uTime * 1.3 + aRnd * 100.0), cos(uTime * 1.1 + aRnd * 70.0));
  vec4 c = mix(aCFrom, aCTo, t);
  c.a *= mix(1.0, mix(0.07, 1.0, step(aIdx, uReveal)), uRevealW);
  float ph = fract(p.x * 0.085 - uTime * 0.3);
  c.rgb *= 1.0 + uPulseW * 2.2 * exp(-ph * ph * 110.0);
  c.a *= 1.0 - (0.2 - 0.12 * uRevealW) * (0.5 + 0.5 * sin(uTime * 2.0 + aRnd * 200.0));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  vec2 ndc = gl_Position.xy / gl_Position.w;
  vec2 d = ndc - uMouse;
  d.x *= uAspect;
  float push = exp(-dot(d, d) * 22.0) * 0.045;
  vec2 dir = normalize(d + vec2(1e-5));
  ndc += vec2(dir.x / uAspect, dir.y) * push;
  gl_Position.xy = ndc * gl_Position.w;
  gl_PointSize = max(1.2, uSize * uK / -mv.z * mix(0.75 + 0.5 * fract(aRnd * 7.31), 0.95, uRevealW));
  vC = c;
}`
const FRAG = /* glsl */ `
varying vec4 vC;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  gl_FragColor = vec4(vC.rgb * vC.a * a, 1.0);
}`
const ARC_VERT = /* glsl */ `
attribute float aT;
uniform float uTime, uOff, uPx;
varying float vG;
void main() {
  float h = fract(aT - uTime * 0.2 - uOff);
  vG = 0.22 + 0.78 * exp(-h * h * 40.0);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.5, uPx / -mv.z * (0.6 + vG));
}`
const ARC_FRAG = /* glsl */ `
uniform float uAlpha;
varying float vG;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vec3(1.0, 0.7, 0.26) * vG * a * uAlpha, 1.0);
}`

export function createEngine(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'high-performance' })
  renderer.setClearColor(0x04050a, 1)
  const scene = new THREE.Scene()
  const FOV = 40
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100)
  camera.position.z = 10
  const VH = 2 * 10 * Math.tan((FOV * Math.PI) / 360)

  const shapes: Shape[] = [ecg(), night(), records(), globe(null), hr(), seal(), bridge(), globe(null)]

  const geo = new THREE.BufferGeometry()
  const aFrom = new THREE.BufferAttribute(new Float32Array(N * 3), 3)
  const aTo = new THREE.BufferAttribute(new Float32Array(N * 3), 3)
  const aCFrom = new THREE.BufferAttribute(new Uint8Array(N * 4), 4, true)
  const aCTo = new THREE.BufferAttribute(new Uint8Array(N * 4), 4, true)
  const rnd = new Float32Array(N), idx = new Float32Array(N), r = rng(99)
  for (let i = 0; i < N; i++) { rnd[i] = r(); idx[i] = i / N }
  geo.setAttribute('position', aFrom)
  geo.setAttribute('aTo', aTo)
  geo.setAttribute('aCFrom', aCFrom)
  geo.setAttribute('aCTo', aCTo)
  geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1))
  geo.setAttribute('aIdx', new THREE.BufferAttribute(idx, 1))
  const uniforms = {
    uMix: { value: 0 }, uTime: { value: 0 }, uSize: { value: 0.04 }, uK: { value: 1 }, uAspect: { value: 1 },
    uReveal: { value: 0 }, uRevealW: { value: 0 }, uPulseW: { value: 1 }, uMouse: { value: new THREE.Vector2(9, 9) },
  }
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending })
  const points = new THREE.Points(geo, mat)
  points.frustumCulled = false
  const group = new THREE.Group()
  group.add(points)
  scene.add(group)

  // arcs into Karbala, shown only with the globe
  const arcMats: THREE.ShaderMaterial[] = []
  const arcPx = { value: 1 }
  const arcs = new THREE.Group()
  const k = new THREE.Vector3(...globePoint(KARBALA[0], KARBALA[1], 1)).normalize()
  ORIGINS.forEach((o, n) => {
    const a = new THREE.Vector3(...globePoint(o[0], o[1], 1)).normalize()
    const ang = a.angleTo(k), seg = 150, pos = new Float32Array((seg + 1) * 3), ts = new Float32Array(seg + 1)
    for (let j = 0; j <= seg; j++) {
      const t = j / seg
      const v = a.clone().multiplyScalar(Math.sin((1 - t) * ang) / Math.sin(ang)).add(k.clone().multiplyScalar(Math.sin(t * ang) / Math.sin(ang)))
      v.multiplyScalar(GLOBE_R * (1.012 + Math.sin(t * Math.PI) * (0.05 + ang * 0.085)))
      pos.set([v.x, v.y, v.z], j * 3)
      ts[j] = t
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aT', new THREE.BufferAttribute(ts, 1))
    const m = new THREE.ShaderMaterial({ uniforms: { uTime: uniforms.uTime, uAlpha: { value: 0 }, uOff: { value: (n * 0.37) % 1 }, uPx: arcPx }, vertexShader: ARC_VERT, fragmentShader: ARC_FRAG, transparent: true, depthTest: false, blending: THREE.AdditiveBlending })
    arcMats.push(m)
    arcs.add(new THREE.Points(g, m))
  })
  arcs.visible = false
  group.add(arcs)

  let seg = -1
  let dirty = true
  const load = (from: Shape, to: Shape) => {
    ;(aFrom.array as Float32Array).set(from.pos); (aTo.array as Float32Array).set(to.pos)
    ;(aCFrom.array as Uint8Array).set(from.col); (aCTo.array as Uint8Array).set(to.col)
    aFrom.needsUpdate = aTo.needsUpdate = aCFrom.needsUpdate = aCTo.needsUpdate = true
  }

  // async shapes: land for the globe, pixels for the portrait
  let alive = true
  fetch(u('land.bin')).then((x) => x.arrayBuffer()).then((buf) => {
    if (!alive) return
    shapes[SCENES.indexOf('globe')] = globe(new Int16Array(buf))
    dirty = true
  }).catch(() => {})
  const img = new Image()
  img.onload = () => {
    if (!alive) return
    const c = document.createElement('canvas')
    c.width = c.height = 460
    const ctx = c.getContext('2d')!
    ctx.drawImage(img, 0, 0, 460, 460)
    shapes[SCENES.indexOf('portrait')] = portrait(ctx.getImageData(0, 0, 460, 460))
    dirty = true
  }
  img.src = u('shots/portrait.webp')

  let w = 0, h = 0, narrow = false
  const resize = () => {
    w = canvas.clientWidth; h = canvas.clientHeight
    if (!w || !h) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    narrow = w < 900
  }
  resize()
  window.addEventListener('resize', resize)

  const clock = new THREE.Clock()
  const cur = { ox: 0, oy: -0.34, size: 0.05 }
  let raf = 0
  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!w || !h) return
    const dt = Math.min(0.05, clock.getDelta()), time = clock.elapsedTime
    const S = SCENES.length
    const f = Math.max(0, Math.min(S - 1, stage.f))
    const s = Math.min(S - 2, Math.floor(f))
    if (s !== seg || dirty) { seg = s; dirty = false; load(shapes[s], shapes[s + 1]) }
    const frac = f - s
    const m = Math.max(0, Math.min(1, (frac - 0.3) / 0.4))
    const weight = (name: SceneName) => { const i = SCENES.indexOf(name); return i === s ? 1 - m : i === s + 1 ? m : 0 }
    uniforms.uMix.value = m
    uniforms.uTime.value = time
    uniforms.uReveal.value = stage.reveal
    uniforms.uRevealW.value = weight('records')
    uniforms.uPulseW.value = weight('ecg')

    const A = STAGING[SCENES[s]], B = STAGING[SCENES[s + 1]]
    const e = m * m * (3 - 2 * m)
    const dir = stage.rtl ? -1 : 1
    const tox = narrow ? A.nx + (B.nx - A.nx) * e : (A.ox + (B.ox - A.ox) * e) * dir
    const toy = narrow ? A.ny + (B.ny - A.ny) * e : A.oy + (B.oy - A.oy) * e
    const kk = 1 - Math.exp(-dt * 6)
    cur.ox += (tox - cur.ox) * kk
    cur.oy += (toy - cur.oy) * kk
    cur.size = A.size + (B.size - A.size) * e
    const VW = VH * camera.aspect
    const scale = narrow ? Math.min((VW * 0.94) / 5.6, (VH * 0.37) / 5.6) : Math.min((VW * 0.5) / 5.6, (VH * 0.84) / 5.6)
    group.scale.setScalar(scale)
    group.position.set(cur.ox * VW, cur.oy * VH, 0)
    const g = weight('globe')
    group.rotation.y += (stage.mx * 0.16 + Math.sin(time * 0.21) * 0.05 + Math.sin(time * 0.17) * 0.24 * g - group.rotation.y) * kk
    group.rotation.x += (-stage.my * 0.09 - group.rotation.x) * kk
    arcs.visible = g > 0.02
    const ga = g * g * g
    arcMats.forEach((x) => { x.uniforms.uAlpha.value = ga })

    const buf = renderer.getDrawingBufferSize(new THREE.Vector2())
    uniforms.uK.value = (buf.y / (2 * Math.tan((FOV * Math.PI) / 360))) * scale
    uniforms.uSize.value = cur.size
    arcPx.value = uniforms.uK.value * 0.05
    uniforms.uAspect.value = camera.aspect
    if (stage.hover) uniforms.uMouse.value.set(stage.mx, -stage.my)
    renderer.render(scene, camera)
  }
  frame()

  return () => {
    alive = false
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    geo.dispose(); mat.dispose(); renderer.dispose()
  }
}
