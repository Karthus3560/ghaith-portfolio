import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Stars } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { chapters, projects } from '../data/content'
import { scrollState, useStore } from '../store'
import { tree, type Tube, type TreeNode } from './treeGen'

const chapterIndex: Record<string, number> = Object.fromEntries(chapters.map((c, i) => [c.id, i]))
const GREY = new THREE.Color(0.1, 0.12, 0.16), _c = new THREE.Color()
const grow = { v: 0 } // shared growth clock 0..1.4
const dims = new Float32Array(8).fill(1) // per-chapter brightness

function focusChapter(): string | null {
  const s = useStore.getState()
  if (s.hovered) return projects.find((p) => p.id === s.hovered)?.chapter ?? null
  if (s.open) return projects.find((p) => p.id === s.open)?.chapter ?? null
  if (s.explore) return null
  return s.view in chapterIndex ? s.view : null
}

/* ───────────────────────── tubes (trunk, branches, twigs, roots) */
const tubeVert = /* glsl */ `
  uniform float uRadius;
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main(){
    vUv = uv;
    vec3 p = position - normal * uRadius * 0.72 * uv.x;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }`
const tubeFrag = /* glsl */ `
  uniform float uGrow, uStart, uSpan, uTime, uDim, uSeed;
  uniform vec3 uA, uB;
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main(){
    float local = clamp((uGrow - uStart) / uSpan, 0.0, 1.0);
    if (vUv.x > local) discard;
    float fres = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.2);
    vec3 c = mix(uA, uB, smoothstep(0.05, 0.9, vUv.x));
    float ph = fract(vUv.x * 1.6 - uTime * 0.16 + uSeed);
    float pulse = smoothstep(0.09, 0.0, abs(ph - 0.5));
    float tip = (1.0 - step(1.0, local)) * smoothstep(0.08, 0.0, local - vUv.x);
    float bark = 0.82 + 0.18 * sin(vUv.x * 90.0 + sin(vUv.y * 12.566) * 2.0);
    vec3 col = c * (0.13 + fres * 0.75) * bark + c * pulse * 1.5 + vec3(1.0, 0.95, 0.85) * tip * 3.0;
    float k = clamp(uDim, 0.0, 1.0);
    vec3 grey = vec3(0.30, 0.37, 0.48) * (0.05 + fres * 0.22);
    gl_FragColor = vec4(mix(grey, col * max(1.0, uDim), k), 1.0);
  }`

function TubeMesh({ t }: { t: Tube }) {
  const geo = useMemo(() => new THREE.TubeGeometry(t.curve, t.segs, t.radius, 16, false), [t])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: tubeVert,
        fragmentShader: tubeFrag,
        uniforms: {
          uRadius: { value: t.radius },
          uGrow: { value: 0 },
          uStart: { value: t.start },
          uSpan: { value: t.span },
          uTime: { value: 0 },
          uDim: { value: 1 },
          uSeed: { value: t.seed },
          uA: { value: new THREE.Color(t.colorA) },
          uB: { value: new THREE.Color(t.colorB) },
        },
      }),
    [t],
  )
  useFrame((s) => {
    mat.uniforms.uGrow.value = grow.v
    mat.uniforms.uTime.value = s.clock.elapsedTime
    mat.uniforms.uDim.value = t.chapter ? dims[chapterIndex[t.chapter]] : 0.55 + 0.45 * dims[7]
  })
  return <mesh geometry={geo} material={mat} frustumCulled={false} />
}

/* ───────────────────────── foliage: glowing motes around every leaf and twig */
const leafVert = /* glsl */ `
  attribute vec3 aColor; attribute float aSeed; attribute float aStart; attribute float aCh; attribute float aSize;
  uniform float uTime, uGrow, uPx; uniform float uDims[8];
  varying vec3 vC; varying float vA;
  void main(){
    float appear = smoothstep(aStart, aStart + 0.14, uGrow);
    vec3 p = position;
    p.x += sin(uTime * 0.6 + aSeed * 40.0) * 0.045;
    p.y += sin(uTime * 0.8 + aSeed * 71.0) * 0.06;
    p.z += cos(uTime * 0.5 + aSeed * 23.0) * 0.045;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float tw = 0.55 + 0.45 * sin(uTime * (1.2 + aSeed * 2.0) + aSeed * 90.0);
    float dim = uDims[int(aCh + 0.5)];
    vC = mix(vec3(0.30, 0.37, 0.48) * 0.22, aColor * (0.5 + 0.8 * tw) * max(1.0, dim), clamp(dim, 0.0, 1.0));
    vA = appear;
    gl_PointSize = aSize * uPx * appear / max(0.6, -mv.z);
    gl_Position = projectionMatrix * mv;
  }`
const leafFrag = /* glsl */ `
  varying vec3 vC; varying float vA;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vC * a * vA, a * vA);
  }`

function Foliage() {
  const { geo, mat } = useMemo(() => {
    const pos: number[] = [], col: number[] = [], seed: number[] = [], start: number[] = [], ch: number[] = [], size: number[] = []
    let s = 7
    const r = () => ((s = (s * 16807) % 2147483647), s / 2147483647)
    const g = () => (r() + r() + r() - 1.5) / 1.5
    const push = (p: THREE.Vector3, spread: number, c: THREE.Color, st: number, ci: number, sz: number) => {
      const k = c.clone().lerp(new THREE.Color('#fff4d6'), r() * 0.35)
      pos.push(p.x + g() * spread, p.y + g() * spread * 0.8, p.z + g() * spread)
      col.push(k.r, k.g, k.b); seed.push(r()); start.push(st + r() * 0.1); ch.push(ci); size.push(sz * (0.5 + r()))
    }
    for (const n of tree.nodes) {
      const c = new THREE.Color(n.color)
      for (let i = 0; i < 130; i++) push(n.pos, 0.42, c, n.start, chapterIndex[n.chapter], 34)
    }
    for (const t of tree.tubes) {
      if (!t.chapter) continue
      const c = new THREE.Color(t.colorB)
      const count = t.key.startsWith('b-') ? 150 : t.key.startsWith('d-') ? 60 : t.key.startsWith('r-') ? 26 : 30
      for (let i = 0; i < count; i++) {
        const u = t.key.startsWith('d-') ? 0.6 + r() * 0.4 : 0.25 + r() * 0.75
        push(t.curve.getPoint(u), t.key.startsWith('d-') ? 0.3 : 0.22, c, t.start + t.span * u, chapterIndex[t.chapter], 26)
      }
    }
    // drifting ambient motes, tied to the trunk brightness slot (7)
    for (let i = 0; i < 900; i++) {
      const a = r() * Math.PI * 2, rad = 2 + r() * 13
      push(new THREE.Vector3(Math.cos(a) * rad, r() * 10, Math.sin(a) * rad), 0.2, new THREE.Color('#9fdcd0'), r() * 0.5, 7, 14)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3))
    geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 1))
    geo.setAttribute('aStart', new THREE.Float32BufferAttribute(start, 1))
    geo.setAttribute('aCh', new THREE.Float32BufferAttribute(ch, 1))
    geo.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1))
    const mat = new THREE.ShaderMaterial({
      vertexShader: leafVert,
      fragmentShader: leafFrag,
      uniforms: { uTime: { value: 0 }, uGrow: { value: 0 }, uPx: { value: 1 }, uDims: { value: dims } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
    return { geo, mat }
  }, [])
  useFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime
    mat.uniforms.uGrow.value = grow.v
    mat.uniforms.uPx.value = s.size.height / 900 * s.viewport.dpr
  })
  return <points geometry={geo} material={mat} frustumCulled={false} />
}

/* ───────────────────────── ground: slow pulse rings, like a monitor trace seen from above */
const groundFrag = /* glsl */ `
  uniform float uTime, uGrow; varying vec2 vUv;
  void main(){
    vec2 p = (vUv - 0.5) * 60.0;
    float d = length(p);
    float ring = smoothstep(0.06, 0.0, abs(fract(d * 0.42 - uTime * 0.11) - 0.5) - 0.44);
    float ang = atan(p.y, p.x);
    float spokes = smoothstep(0.02, 0.0, abs(fract(ang * 3.8197) - 0.5) - 0.485) * smoothstep(1.5, 6.0, d);
    float fade = exp(-d * 0.2) * smoothstep(0.0, 0.4, uGrow);
    vec3 col = vec3(0.37, 0.92, 0.83) * (ring * 0.2 + spokes * 0.07) + vec3(1.0, 0.75, 0.45) * exp(-d * 1.1) * 0.35;
    gl_FragColor = vec4(col * fade, 1.0);
  }`
function Ground() {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
        fragmentShader: groundFrag,
        uniforms: { uTime: { value: 0 }, uGrow: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  useFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime
    mat.uniforms.uGrow.value = grow.v
  })
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-0.02} material={mat}>
      <planeGeometry args={[60, 60]} />
    </mesh>
  )
}

/* ───────────────────────── project nodes (the "leaves" you can open) */
function Node({ n }: { n: TreeNode }) {
  const ref = useRef<THREE.Group>(null!)
  const core = useRef<THREE.Mesh>(null!)
  const p = useMemo(() => projects.find((x) => x.id === n.id)!, [n.id])
  const lang = useStore((s) => s.lang)
  const hovered = useStore((s) => s.hovered === n.id)
  const showLabel = useStore((s) => s.ready && !s.open && s.hovered === n.id)
  const color = useMemo(() => new THREE.Color(n.color), [n.color])
  useFrame((s, dt) => {
    const appear = THREE.MathUtils.smoothstep(grow.v, n.start, n.start + 0.12)
    const target = appear * (hovered ? 1.7 : 1) * (0.92 + 0.08 * Math.sin(s.clock.elapsedTime * 2 + n.pos.x * 3))
    const k = ref.current.scale.x + (target - ref.current.scale.x) * Math.min(1, dt * 8)
    ref.current.scale.setScalar(k)
    const d = dims[chapterIndex[n.chapter]]
    ;(core.current.material as THREE.MeshBasicMaterial).color.copy(GREY).lerp(_c.copy(color).multiplyScalar(2.6 * Math.max(1, d)), Math.min(1, d))
  })
  const set = useStore.getState()
  return (
    <group ref={ref} position={n.pos} scale={0}>
      <mesh ref={core}>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshBasicMaterial toneMapped={false} />
      </mesh>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); set.setHovered(n.id); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { if (useStore.getState().hovered === n.id) set.setHovered(null); document.body.style.cursor = '' }}
        onClick={(e) => { e.stopPropagation(); set.setOpen(n.id) }}
      >
        <sphereGeometry args={[0.36, 10, 10]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {showLabel && (
        <Html center position={[0, 0.34, 0]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <button
            className={'leaf-label' + (hovered ? ' is-hover' : '')}
            style={{ ['--c' as string]: n.color, pointerEvents: 'auto' }}
            onMouseEnter={() => set.setHovered(n.id)}
            onMouseLeave={() => set.setHovered(null)}
            onClick={() => set.setOpen(n.id)}
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {p.title[lang]}
          </button>
        </Html>
      )}
    </group>
  )
}

function ChapterLabels() {
  const explore = useStore((s) => s.explore)
  const lang = useStore((s) => s.lang)
  const open = useStore((s) => s.open)
  if (!explore || open) return null
  return (
    <>
      {chapters.map((c) => (
        <Html key={c.id} center position={tree.anchors[c.id]} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
          <span className="branch-label" style={{ ['--c' as string]: c.color }} dir={lang === 'ar' ? 'rtl' : 'ltr'}>{c.title[lang]}</span>
        </Html>
      ))}
    </>
  )
}

/* ───────────────────────── camera */
const _p = new THREE.Vector3(), _t = new THREE.Vector3(), _look = new THREE.Vector3(0, 3.9, 0)
function Rig() {
  const { camera, size } = useThree()
  const shift = useRef(0)
  const started = useRef(false)
  useFrame((s, dt) => {
    const st = useStore.getState()
    // growth clock + per-chapter dimming
    grow.v = Math.min(1.4, grow.v + dt * 0.36)
    if (!started.current && grow.v > 0.9) { started.current = true; st.setReady() }
    const fc = focusChapter()
    for (let i = 0; i < 7; i++) {
      const tgt = fc == null ? 1 : chapters[i].id === fc ? 1.25 : 0
      dims[i] += (tgt - dims[i]) * Math.min(1, dt * 4)
    }
    dims[7] += ((fc == null ? 1 : 0.45) - dims[7]) * Math.min(1, dt * 4)

    const cam = camera as THREE.PerspectiveCamera
    const narrow = size.width < 900
    if (st.explore) {
      shift.current += (0 - shift.current) * Math.min(1, dt * 4)
    } else {
      const names = scrollState.names
      const f = Math.max(0, Math.min(names.length - 1, scrollState.f))
      const i = Math.floor(f), j = Math.min(names.length - 1, i + 1)
      let t = f - i
      t = t * t * (3 - 2 * t)
      const a = tree.views[names[i]] ?? tree.views.hero, b = tree.views[names[j]] ?? tree.views.hero
      _p.lerpVectors(a.pos, b.pos, t)
      _t.lerpVectors(a.target, b.target, t)
      // gentle idle drift + pointer parallax
      const e = s.clock.elapsedTime
      _p.x += Math.sin(e * 0.21) * 0.22 + scrollState.mx * 0.5
      _p.y += Math.cos(e * 0.17) * 0.14 - scrollState.my * 0.3
      if (narrow) { _p.sub(_t).multiplyScalar(1.45).add(_t) }
      const k = Math.min(1, dt * 2.6)
      cam.position.lerp(_p, k)
      _look.lerp(_t, k)
      cam.lookAt(_look)
      const dir = st.lang === 'ar' ? -1 : 1
      const sh = narrow ? 0 : (a.shift + (b.shift - a.shift) * t) * dir
      shift.current += (sh - shift.current) * k
    }
    const w = size.width, h = size.height
    const yOff = narrow && !st.explore && scrollState.f > 0.5 ? 0.16 : 0
    cam.setViewOffset(w, h, -shift.current * w, yOff * h, w, h)
  })
  return null
}

function ExploreControls() {
  const explore = useStore((s) => s.explore)
  const { camera } = useThree()
  useEffect(() => {
    if (explore) {
      camera.position.copy(tree.views.explore.pos)
      camera.lookAt(tree.views.explore.target)
    }
  }, [explore, camera])
  if (!explore) return null
  return (
    <OrbitControls
      makeDefault
      target={tree.views.explore.target}
      enablePan={false}
      minDistance={4}
      maxDistance={22}
      maxPolarAngle={Math.PI * 0.52}
      autoRotate
      autoRotateSpeed={0.5}
      enableDamping
    />
  )
}

export default function Scene() {
  const low = useMemo(() => window.innerWidth < 900 || (navigator.hardwareConcurrency ?? 8) <= 4, [])
  return (
    <Canvas
      className="scene"
      dpr={[1, low ? 1.5 : 2]}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 120, position: [0, 3.1, 19] }}
      onPointerMissed={() => useStore.getState().setHovered(null)}
    >
      <color attach="background" args={['#04060c']} />
      <fog attach="fog" args={['#04060c', 16, 46]} />
      <Stars radius={70} depth={30} count={low ? 1500 : 3500} factor={3.2} saturation={0} fade speed={0.6} />
      <Ground />
      {tree.tubes.map((t) => (
        <TubeMesh key={t.key} t={t} />
      ))}
      <Foliage />
      {tree.nodes.map((n) => (
        <Node key={n.id} n={n} />
      ))}
      <ChapterLabels />
      <Rig />
      <ExploreControls />
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={low ? 0.85 : 1.0} luminanceThreshold={0.42} luminanceSmoothing={0.25} radius={0.78} />
        <Vignette eskil={false} offset={0.22} darkness={0.82} />
      </EffectComposer>
    </Canvas>
  )
}
