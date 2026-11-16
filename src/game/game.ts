import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { actions, pad, useGame } from './store'
import { buildWorld, height, ISLAND, ORDER, PAD, RING, SPAWN, type Lang } from './world'

const glow = (hex: string, k = 2) => new THREE.Color(hex).multiplyScalar(k)

/** The van: a small hospital utility vehicle, facing +z. */
function buildVan() {
  const car = new THREE.Group()
  const body = new THREE.Group()
  car.add(body)
  const std = (hex: string, rough = 0.6) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0.1, emissive: hex, emissiveIntensity: 0.22 })
  const part = (w: number, h: number, d: number, m: THREE.Material, x: number, y: number, z: number) => {
    const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m)
    o.position.set(x, y, z)
    body.add(o)
    return o
  }
  part(2.0, 0.45, 4.4, std('#1a2233'), 0, 0.6, 0)
  part(2.0, 0.95, 4.3, std('#eef2f7'), 0, 1.25, 0)
  part(1.96, 1.0, 2.7, std('#eef2f7'), 0, 2.2, -0.75)
  part(1.86, 0.85, 1.25, std('#0c1626', 0.2), 0, 2.1, 1.2)
  part(2.04, 0.2, 4.34, new THREE.MeshBasicMaterial({ color: glow('#2ee6c8', 1.7) }), 0, 1.2, 0)
  for (const x of [-0.65, 0.65]) {
    part(0.45, 0.25, 0.1, new THREE.MeshBasicMaterial({ color: glow('#fff4d6', 3) }), x, 1.15, 2.17)
  }
  part(2.1, 0.3, 0.25, std('#1a2233'), 0, 0.62, 2.25)
  part(2.1, 0.3, 0.25, std('#1a2233'), 0, 0.62, -2.25)
  part(1.96, 0.12, 1.4, std('#eef2f7'), 0, 2.58, 1.15)
  for (const x of [-1.06, 1.06]) part(0.12, 0.28, 0.2, std('#eef2f7'), x, 1.95, 1.75)
  const decal = document.createElement('canvas')
  decal.width = 320; decal.height = 96
  const dc = decal.getContext('2d')!
  dc.strokeStyle = '#19b8a0'; dc.lineWidth = 9; dc.lineJoin = 'round'; dc.lineCap = 'round'
  dc.beginPath(); dc.moveTo(10, 56); dc.lineTo(96, 56); dc.lineTo(112, 40); dc.lineTo(128, 56); dc.lineTo(146, 56); dc.lineTo(160, 80); dc.lineTo(178, 12); dc.lineTo(196, 88); dc.lineTo(210, 56); dc.lineTo(310, 56); dc.stroke()
  const decalTex = new THREE.CanvasTexture(decal)
  decalTex.colorSpace = THREE.SRGBColorSpace
  for (const sx of [-1, 1]) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.7), new THREE.MeshBasicMaterial({ map: decalTex, transparent: true }))
    d.position.set(sx * 0.99, 2.25, -0.75); d.rotation.y = (sx * Math.PI) / 2
    body.add(d)
  }
  const tail = new THREE.MeshBasicMaterial({ color: glow('#ff3b4e', 1.4) })
  for (const x of [-0.7, 0.7]) part(0.4, 0.22, 0.1, tail, x, 1.25, -2.17)
  const barL = new THREE.MeshBasicMaterial({ color: glow('#2ee6c8', 2.5) }), barR = new THREE.MeshBasicMaterial({ color: glow('#ffb23e', 2.5) })
  part(0.6, 0.18, 0.36, barL, -0.32, 2.8, 0.1)
  part(0.6, 0.18, 0.36, barR, 0.32, 2.8, 0.1)
  const wheelGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.38, 16)
  wheelGeo.rotateZ(Math.PI / 2)
  const wheels: THREE.Mesh[] = [], pivots: THREE.Group[] = []
  for (const [x, z] of [[-1.03, 1.4], [1.03, 1.4], [-1.03, -1.4], [1.03, -1.4]]) {
    const pivot = new THREE.Group()
    pivot.position.set(x, 0.5, z)
    const w = new THREE.Mesh(wheelGeo, std('#0b0f18', 0.9))
    pivot.add(w)
    car.add(pivot)
    wheels.push(w); pivots.push(pivot)
  }
  const lamp = new THREE.SpotLight('#fff0cf', 900, 70, 0.55, 0.7, 1.6)
  lamp.position.set(0, 1.6, 2)
  lamp.target.position.set(0, 0, 18)
  car.add(lamp, lamp.target)
  return { car, body, wheels, pivots, tail, barL, barR }
}

/** Sound is made on the fly: engine hum, horn and two chimes. No audio files. */
function makeAudio() {
  let ctx: AudioContext | null = null, engine: OscillatorNode | null = null, engGain: GainNode | null = null
  const ensure = () => {
    if (ctx) return ctx
    ctx = new AudioContext()
    engine = ctx.createOscillator(); engine.type = 'sawtooth'
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320
    engGain = ctx.createGain(); engGain.gain.value = 0
    engine.connect(lp).connect(engGain).connect(ctx.destination)
    engine.start()
    return ctx
  }
  const tone = (freq: number, at: number, dur: number, type: OscillatorType, vol: number, to?: number) => {
    const c = ensure(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime + at
    o.type = type; o.frequency.setValueAtTime(freq, t)
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur)
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05)
  }
  return {
    engine(on: boolean, speed: number) {
      if (!on) { if (engGain && ctx) engGain.gain.setTargetAtTime(0, ctx.currentTime, 0.1); return }
      const c = ensure()
      if (c.state === 'suspended') void c.resume()
      engine!.frequency.setTargetAtTime(48 + Math.abs(speed) * 3.2, c.currentTime, 0.08)
      engGain!.gain.setTargetAtTime(0.022 + Math.min(0.03, Math.abs(speed) * 0.001), c.currentTime, 0.1)
    },
    honk() { tone(392, 0, 0.28, 'square', 0.05); tone(494, 0, 0.28, 'square', 0.05) },
    orb() { tone(880, 0, 0.18, 'sine', 0.08, 1320) },
    found() { tone(523, 0, 0.3, 'triangle', 0.08); tone(659, 0.1, 0.3, 'triangle', 0.08); tone(784, 0.2, 0.45, 'triangle', 0.08) },
    close() { void ctx?.close() },
  }
}

export function createGame(canvas: HTMLCanvasElement, map: HTMLCanvasElement | null, text: (lang: Lang) => { name: string; title: string; line: string }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(55, 1, 0.3, 1600)
  const world = buildWorld(scene)
  const van = buildVan()
  scene.add(van.car)
  const shadow = new THREE.Mesh(new THREE.CircleGeometry(2.6, 24), new THREE.MeshBasicMaterial({ color: '#000000', transparent: true, opacity: 0.45, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  scene.add(shadow)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.6, 1.2)
  composer.addPass(bloom)
  composer.addPass(new OutputPass())

  const audio = makeAudio()
  const car = { x: SPAWN.x, z: SPAWN.z, y: 0, yaw: SPAWN.yaw, vx: 0, vz: 0, vy: 0, vf: 0, steer: 0, grounded: true, pitch: 0, roll: 0, spin: 0 }
  let camYaw = SPAWN.yaw
  const look = new THREE.Vector3(0, 1.5, 0)
  const keys = new Set<string>()

  const relabel = () => { const lang = useGame.getState().lang; world.relabel(lang, text(lang)) }
  void document.fonts.ready.then(relabel)
  relabel()
  let lastLang = useGame.getState().lang
  const unsub = useGame.subscribe((s) => { if (s.lang !== lastLang) { lastLang = s.lang; relabel() } })

  const reset = () => { Object.assign(car, { x: SPAWN.x, z: SPAWN.z, y: 0, yaw: SPAWN.yaw, vx: 0, vz: 0, vy: 0 }); camYaw = SPAWN.yaw }
  const interact = () => {
    const s = useGame.getState()
    if (!s.started) return
    if (s.open) { s.set({ open: null }); return }
    if (!s.near) return
    const b = world.beacons.find((x) => x.id === s.near)!
    if (!b.found) {
      b.found = true
      ;(b.ring.material as THREE.MeshBasicMaterial).color.copy(glow('#8ff5c8', 1.4))
      ;(b.gem.material as THREE.MeshBasicMaterial).color.copy(glow('#8ff5c8', 1.6))
      s.set({ found: [...s.found, b.id] })
      relabel()
      if (s.sound) audio.found()
    }
    s.set({ open: b.id })
  }
  const honk = () => { if (useGame.getState().sound) audio.honk(); for (const p of world.props) if (Math.hypot(p.x - car.x, p.z - car.z) < 9) p.vy = Math.max(p.vy, 3.5) }
  actions.interact = interact; actions.honk = honk; actions.reset = reset

  const onKey = (e: KeyboardEvent) => {
    if (e.type === 'keydown') {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault()
      if (e.repeat) return
      keys.add(e.code)
      if (e.code === 'KeyE' || e.code === 'Enter') { if (useGame.getState().started) { e.preventDefault(); interact() } }
      else if (e.code === 'Escape') useGame.getState().set({ open: null })
      else if (e.code === 'KeyR') reset()
      else if (e.code === 'Space' || e.code === 'KeyH') honk()
    } else keys.delete(e.code)
  }
  const onBlur = () => keys.clear()
  window.addEventListener('keydown', onKey)
  window.addEventListener('keyup', onKey)
  window.addEventListener('blur', onBlur)

  let w = 0, h = 0
  const resize = () => {
    w = canvas.clientWidth; h = canvas.clientHeight
    if (!w || !h) return
    const pr = Math.min(window.devicePixelRatio, 1.75)
    renderer.setPixelRatio(pr)
    renderer.setSize(w, h, false)
    composer.setPixelRatio(pr)
    composer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', resize)

  /** Push a moving circle out of everything solid. Returns true on a hit. */
  const collide = (o: { x: number; z: number; vx: number; vz: number }, r: number, bounce: number) => {
    let hit = false
    const out = (nx: number, nz: number, depth: number) => {
      o.x += nx * depth; o.z += nz * depth
      const vn = o.vx * nx + o.vz * nz
      if (vn < 0) { o.vx -= (1 + bounce) * vn * nx; o.vz -= (1 + bounce) * vn * nz }
      hit = true
    }
    for (const c of world.circles) {
      const dx = o.x - c.x, dz = o.z - c.z, rr = r + c.r
      if (Math.abs(dx) > rr || Math.abs(dz) > rr) continue
      const d = Math.hypot(dx, dz)
      if (d < rr && d > 1e-4) out(dx / d, dz / d, rr - d)
    }
    for (const b of world.boxes) {
      const px = Math.max(b.x0, Math.min(b.x1, o.x)), pz = Math.max(b.z0, Math.min(b.z1, o.z))
      const dx = o.x - px, dz = o.z - pz, d = Math.hypot(dx, dz)
      if (d < r && d > 1e-4) out(dx / d, dz / d, r - d)
      else if (d <= 1e-4) { // centre is inside: leave by the nearest side
        const l = o.x - b.x0, rgt = b.x1 - o.x, t = o.z - b.z0, bt = b.z1 - o.z, m = Math.min(l, rgt, t, bt)
        if (m === l) out(-1, 0, l + r); else if (m === rgt) out(1, 0, rgt + r); else if (m === t) out(0, -1, t + r); else out(0, 1, bt + r)
      }
    }
    const rad = Math.hypot(o.x, o.z)
    if (rad > ISLAND - r - 1) { const nx = -o.x / rad, nz = -o.z / rad; out(nx, nz, rad - (ISLAND - r - 1)) }
    return hit
  }

  const clock = new THREE.Clock()
  let raf = 0, frameNo = 0, blink = 0
  const tmp = new THREE.Vector3()
  const R_CAR = 1.55

  const frame = () => {
    raf = requestAnimationFrame(frame)
    if (!w || !h) return
    const dt = Math.min(0.033, Math.max(0.001, clock.getDelta())), t = clock.elapsedTime
    const s = useGame.getState()
    const driving = s.started && !s.open
    frameNo++

    /* ── input */
    let throttle = 0, steer = 0, boost = false
    if (driving) {
      throttle = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) + pad.y
      steer = (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) - (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - pad.x
      boost = keys.has('ShiftLeft') || keys.has('ShiftRight') || pad.boost
      throttle = Math.max(-1, Math.min(1, throttle)); steer = Math.max(-1, Math.min(1, steer))
    }
    car.steer += (steer - car.steer) * (1 - Math.exp(-dt * 9))

    /* ── van physics: arcade grip model on a height field */
    let fx = Math.sin(car.yaw), fz = Math.cos(car.yaw)
    let vf = car.vx * fx + car.vz * fz, vl = car.vx * fz - car.vz * fx
    const inWater = car.y < -0.25
    if (car.grounded) {
      const top = (boost ? 40 : 29) * (inWater ? 0.4 : 1)
      if (throttle > 0) vf += throttle * (boost ? 34 : 22) * dt * (vf < top ? 1 : 0)
      else if (throttle < 0) vf += throttle * (vf > 0 ? 38 : 14) * dt * (vf > -11 ? 1 : 0)
      vf *= Math.exp(-dt * (throttle === 0 ? 0.9 : 0.25) * (inWater ? 5 : 1))
      vl *= Math.exp(-dt * 5.5)
      car.yaw += car.steer * 2.3 * dt * Math.max(-1, Math.min(1, vf / 9))
    } else car.yaw += car.steer * 0.6 * dt
    fx = Math.sin(car.yaw); fz = Math.cos(car.yaw)
    car.vx = fx * vf + fz * vl; car.vz = fz * vf - fx * vl
    car.vf = vf

    const px = car.x, pz = car.z
    car.x += car.vx * dt; car.z += car.vz * dt
    if (collide(car, R_CAR, 0.25)) { car.vx *= 0.9; car.vz *= 0.9 }
    let g = height(car.x, car.z)
    if (g - car.y > 0.8) { car.x = px; car.z = pz; car.vx *= -0.3; car.vz *= -0.3; g = height(car.x, car.z) }
    const gPrev = height(px, pz)
    car.vy -= 26 * dt
    car.y += car.vy * dt
    if (car.y <= g + 0.001) { car.y = g; car.vy = Math.min(13, Math.max(0, (g - gPrev) / dt)); car.grounded = true } else car.grounded = car.y - g < 0.08

    // props: knock them about
    for (const p of world.props) {
      const dx = p.x - car.x, dz = p.z - car.z, rr = p.r + R_CAR, d = Math.hypot(dx, dz)
      if (d < rr && d > 1e-4 && Math.abs(car.y - p.y) < 2.2) {
        const nx = dx / d, nz = dz / d
        p.x += nx * (rr - d); p.z += nz * (rr - d)
        const push = Math.max(2, Math.hypot(car.vx, car.vz))
        p.vx = car.vx * 0.9 + nx * push * 0.6; p.vz = car.vz * 0.9 + nz * push * 0.6
        p.vy = Math.min(7, 1.5 + push * 0.16)
        car.vx *= 0.96; car.vz *= 0.96
      }
      const sp = Math.hypot(p.vx, p.vz)
      if (sp > 0.02 || p.y > 0 || p.vy !== 0) {
        p.x += p.vx * dt; p.z += p.vz * dt
        collide(p, p.r, 0.5)
        const k = Math.exp(-dt * (p.roll ? 0.7 : 2.2))
        p.vx *= k; p.vz *= k
        const pg = Math.max(-0.8, height(p.x, p.z))
        p.vy -= 22 * dt; p.y += p.vy * dt
        if (p.y <= pg) { p.y = pg; p.vy = p.vy < -3 ? -p.vy * 0.35 : 0 }
        p.mesh.position.set(p.x, p.y + p.lift, p.z)
        if (p.roll) { p.mesh.rotation.x += (p.vz * dt) / p.r; p.mesh.rotation.z -= (p.vx * dt) / p.r }
        else p.mesh.rotation.y += sp * dt * 0.6
      } else p.mesh.position.set(p.x, p.y + p.lift, p.z)
    }

    /* ── van pose */
    const hf = height(car.x + fx * 1.6, car.z + fz * 1.6), hb = height(car.x - fx * 1.6, car.z - fz * 1.6)
    const hl = height(car.x + fz * 1, car.z - fx * 1), hr = height(car.x - fz * 1, car.z + fx * 1)
    const tp = car.grounded ? Math.atan2(hb - hf, 3.2) : Math.max(-0.5, Math.min(0.5, -car.vy * 0.03))
    const tr = (car.grounded ? Math.atan2(hl - hr, 2) : 0) + car.steer * vf * 0.0045
    car.pitch += (tp - car.pitch) * (1 - Math.exp(-dt * 10)); car.roll += (tr - car.roll) * (1 - Math.exp(-dt * 8))
    van.car.position.set(car.x, car.y, car.z)
    van.car.rotation.set(0, car.yaw, 0)
    van.body.rotation.set(car.pitch - throttle * 0.02, 0, car.roll)
    car.spin += (vf * dt) / 0.5
    van.wheels.forEach((wh) => { wh.rotation.x = car.spin })
    van.pivots[0].rotation.y = van.pivots[1].rotation.y = car.steer * 0.45
    van.tail.color.copy(glow('#ff3b4e', throttle < 0 ? 3.2 : 1.3))
    blink += dt
    const on = Math.floor(blink * 3) % 2 === 0
    van.barL.color.copy(glow('#2ee6c8', on ? 3 : 0.5)); van.barR.color.copy(glow('#ffb23e', on ? 0.5 : 3))
    shadow.position.set(car.x, Math.max(g, -0.45) + 0.06, car.z)
    shadow.scale.setScalar(Math.max(0.4, 1 - (car.y - g) * 0.12))

    /* ── camera: chase when driving, slow orbit on the title screen */
    if (!s.started) {
      const a = t * 0.12 + 2.4
      camera.position.set(Math.cos(a) * 30, 12, Math.sin(a) * 30 + 6)
      look.set(0, 2, 0)
      camera.fov = 50
    } else {
      let dy = car.yaw - camYaw
      dy = Math.atan2(Math.sin(dy), Math.cos(dy))
      camYaw += dy * (1 - Math.exp(-dt * 3.2))
      const narrow = w < h, sp = Math.abs(vf)
      const dist = (narrow ? 13.5 : 10) + sp * 0.11, hgt = (narrow ? 6.2 : 4.6) + sp * 0.035
      tmp.set(car.x - Math.sin(camYaw) * dist, car.y + hgt, car.z - Math.cos(camYaw) * dist)
      camera.position.lerp(tmp, 1 - Math.exp(-dt * 7))
      tmp.set(car.x + fx * 3.5, car.y + 1.5, car.z + fz * 3.5)
      look.lerp(tmp, 1 - Math.exp(-dt * 10))
      camera.fov += (56 + sp * 0.4 - camera.fov) * (1 - Math.exp(-dt * 4))
    }
    camera.updateProjectionMatrix()
    camera.lookAt(look)

    /* ── beacons, lights to collect, districts */
    let near: string | null = null, best = 4.3, closest = 1e9
    for (const b of world.beacons) closest = Math.min(closest, Math.hypot(b.x - car.x, b.z - car.z))
    for (const b of world.beacons) {
      const d = Math.hypot(b.x - car.x, b.z - car.z)
      b.gem.rotation.y = t * 1.4
      b.gem.position.y = 2.3 + Math.sin(t * 2 + b.x) * 0.25
      const lm = b.label.material as THREE.SpriteMaterial
      const want = d === closest && d < 30 && d > 9 ? 1 : 0
      lm.opacity += (want - lm.opacity) * (1 - Math.exp(-dt * 8))
      ;(b.beam.material as THREE.MeshBasicMaterial).opacity = (b.found ? 0.07 : 0.22) * (0.12 + 0.88 * Math.max(0, Math.min(1, (d - 3) / 8)))
      if (d < best && Math.abs(car.y - b.y) < 2.5) { best = d; near = b.id }
    }
    let got = 0
    for (const o of world.orbs) {
      if (o.taken) {
        if (o.fade < 1) { o.fade = Math.min(1, o.fade + dt * 3.5); o.mesh.scale.setScalar(1 + o.fade * 2.5); (o.mesh.material as THREE.MeshBasicMaterial).opacity = 1 - o.fade; if (o.fade >= 1) o.mesh.visible = false }
        continue
      }
      o.mesh.rotation.y = t * 1.6; o.mesh.position.y = o.y + Math.sin(t * 2.4 + o.x * 0.3) * 0.18
      if (s.started && Math.hypot(o.x - car.x, o.z - car.z) < 2.6 && Math.abs(o.y - (car.y + 1.1)) < 2.4) { o.taken = true; got++ }
    }
    let district: string | null = null
    for (const d of world.districts) {
      const dd = Math.hypot(d.x - car.x, d.z - car.z)
      if (dd < PAD + 2) district = d.id
      const sm = d.sign.material as THREE.SpriteMaterial
      sm.opacity += ((dd < PAD + 14 ? 0 : 1) - sm.opacity) * (1 - Math.exp(-dt * 4))
    }
    if (got) { s.set({ orbs: s.orbs + got }); if (s.sound) audio.orb() }
    if (near !== s.near) s.set({ near })
    if (district !== s.district) s.set({ district })
    for (const f of world.ticks) f(t, dt)
    audio.engine(s.sound && s.started, vf)

    /* ── minimap */
    if (map && frameNo % 5 === 0) {
      const c = map.getContext('2d')!, S = map.width, k = S / (2 * (ISLAND + 8)), o = S / 2
      c.clearRect(0, 0, S, S)
      c.fillStyle = 'rgba(18,32,49,0.9)'; c.beginPath(); c.arc(o, o, ISLAND * k, 0, 7); c.fill()
      c.strokeStyle = 'rgba(255,255,255,0.22)'; c.lineWidth = 3
      c.beginPath(); c.arc(o, o, RING * k, 0, 7); c.stroke()
      world.districts.forEach((d) => {
        c.beginPath(); c.moveTo(o, o); c.lineTo(o + d.x * k * 0.74, o + d.z * k * 0.74); c.stroke()
        c.fillStyle = d.color + '55'; c.beginPath(); c.arc(o + d.x * k, o + d.z * k, PAD * k, 0, 7); c.fill()
      })
      for (const b of world.beacons) { c.fillStyle = b.found ? '#8ff5c8' : '#ffffff'; c.globalAlpha = b.found ? 1 : 0.75; c.beginPath(); c.arc(o + b.x * k, o + b.z * k, 2.2, 0, 7); c.fill() }
      c.globalAlpha = 1
      c.save(); c.translate(o + car.x * k, o + car.z * k); c.rotate(-car.yaw + Math.PI)
      c.fillStyle = '#ff5d73'; c.beginPath(); c.moveTo(0, -8); c.lineTo(5.5, 6); c.lineTo(0, 3); c.lineTo(-5.5, 6); c.closePath(); c.fill()
      c.restore()
    }

    composer.render()
  }
  frame()

  // QA hook: lets the screenshot script place the van. Present in development only.
  if (import.meta.env.DEV) (window as unknown as { __game: unknown }).__game = { car, order: ORDER, beacons: world.beacons, go(x: number, z: number, yaw: number) { Object.assign(car, { x, z, yaw, vx: 0, vz: 0, y: Math.max(0, height(x, z)) }); camYaw = yaw } }

  return () => {
    cancelAnimationFrame(raf)
    unsub()
    window.removeEventListener('keydown', onKey)
    window.removeEventListener('keyup', onKey)
    window.removeEventListener('blur', onBlur)
    window.removeEventListener('resize', resize)
    audio.close()
    renderer.dispose()
  }
}
