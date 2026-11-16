import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Project } from '../data/content'

interface Props {
  layers: { id: string; items: Project[] }[]
  active: string | null
  onActive: (id: string | null) => void
  onLayer: (id: string) => void
  onProject: (id: string) => void
  label: (p: Project) => string
}

const SIZE = 3.6
const GAP = 0.95
const OPEN = 1.25
const INK = new THREE.Color('#12213a')
const ACCENT = new THREE.Color('#0b6b6b')
const PLATE = new THREE.Color('#e9edf1')
const PLATE_ON = new THREE.Color('#cfe6e3')
const EDGE = new THREE.Color('#9eabb9')
type Hover = { id: string; title: string; mesh: THREE.Mesh }

/** Positions for n dots on a plate: a centred grid. */
function grid(n: number): [number, number][] {
  const cols = Math.ceil(Math.sqrt(n))
  const rows = Math.ceil(n / cols)
  const step = Math.min(1.05, (SIZE - 1.1) / Math.max(1, Math.max(cols, rows) - 1 || 1))
  const out: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const r = Math.floor(i / cols)
    const c = i % cols
    const inRow = r === rows - 1 ? n - cols * (rows - 1) : cols
    out.push([(c - (inRow - 1) / 2) * step, (r - (rows - 1) / 2) * step])
  }
  return out
}

function Layer({ index, layer, active, onActive, onLayer, onProject, label, hovered, setHovered }: {
  index: number
  layer: Props['layers'][number]
  hovered: React.RefObject<Hover | null>
  setHovered: (h: Hover | null) => void
} & Omit<Props, 'layers'>) {
  const g = useRef<THREE.Group>(null!)
  const mat = useRef<THREE.MeshBasicMaterial>(null!)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const edge = useRef<any>(null)
  const dots = useMemo(() => grid(layer.items.length), [layer.items.length])
  const on = active === layer.id
  const dim = active !== null && !on

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 7)
    g.current.position.y += (index * GAP + (g.current.userData.lift ?? 0) - g.current.position.y) * k
    mat.current.color.lerp(on ? PLATE_ON : PLATE, k)
    mat.current.opacity += ((on ? 0.92 : dim ? 0.3 : 0.62) - mat.current.opacity) * k
    const em = edge.current?.material
    if (em) {
      em.color.lerp(on ? ACCENT : EDGE, k)
      em.opacity += ((dim ? 0.3 : 1) - em.opacity) * k
    }
  })

  return (
    <group ref={g} position={[0, index * GAP, 0]} name={layer.id}>
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); onActive(layer.id) }}
        onPointerOut={() => onActive(null)}
        onClick={(e) => { e.stopPropagation(); onLayer(layer.id) }}
      >
        <boxGeometry args={[SIZE, 0.06, SIZE]} />
        <meshBasicMaterial ref={mat} color={PLATE} transparent opacity={0.62} depthWrite={false} />
        <Edges ref={edge} threshold={15} color="#9eabb9" lineWidth={1.3} transparent />
      </mesh>
      {layer.items.map((p, i) => (
        <Dot key={p.id} x={dots[i][0]} z={dots[i][1]} on={on} dim={dim} title={label(p)} hovered={hovered} setHovered={setHovered} id={p.id}
          onOver={() => onActive(layer.id)} onClick={() => onProject(p.id)} />
      ))}
    </group>
  )
}

function Dot({ x, z, on, dim, title, id, hovered, setHovered, onOver, onClick }: {
  x: number; z: number; on: boolean; dim: boolean; title: string; id: string
  hovered: React.RefObject<Hover | null>; setHovered: (h: Hover | null) => void; onOver: () => void; onClick: () => void
}) {
  const m = useRef<THREE.Mesh>(null!)
  const mat = useRef<THREE.MeshBasicMaterial>(null!)
  useFrame((_, dt) => {
    const k = 1 - Math.exp(-dt * 9)
    const h = hovered.current?.id === id
    const s = h ? 1.7 : 1
    m.current.scale.x += (s - m.current.scale.x) * k
    m.current.scale.y = m.current.scale.z = m.current.scale.x
    mat.current.color.lerp(on || h ? ACCENT : INK, k)
    mat.current.opacity += ((dim ? 0.25 : 1) - mat.current.opacity) * k
  })
  return (
    <mesh
      ref={m}
      position={[x, 0.12, z]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered({ id, title, mesh: m.current }); onOver(); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(null); document.body.style.cursor = '' }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
    >
      <sphereGeometry args={[0.095, 20, 14]} />
      <meshBasicMaterial ref={mat} color={INK} transparent />
    </mesh>
  )
}

const V = new THREE.Vector3()

function Stack(props: Props & { tip: React.RefObject<HTMLDivElement | null> }) {
  const root = useRef<THREE.Group>(null!)
  const hovered = useRef<Hover | null>(null)
  const tip = props.tip
  const { camera, size, pointer } = useThree()
  const n = props.layers.length
  const height = (n - 1) * GAP

  useFrame((state, dt) => {
    // open the stack above the active layer
    const ai = props.layers.findIndex((x) => x.id === props.active)
    root.current.children.forEach((c, i) => { c.userData.lift = ai >= 0 && i > ai ? OPEN : 0 })
    // fit: orthographic zoom from the container size
    const cam = camera as THREE.OrthographicCamera
    const zoom = Math.min(size.width / 5.5, size.height / ((height + OPEN) * 0.883 + 2.9))
    if (Math.abs(cam.zoom - zoom) > 0.01) { cam.zoom = zoom; cam.updateProjectionMatrix() }
    // slow drift plus a little pointer parallax
    const target = Math.sin(state.clock.elapsedTime * 0.25) * 0.14 + pointer.x * 0.22
    root.current.rotation.y += (target - root.current.rotation.y) * (1 - Math.exp(-dt * 3))
    // one shared tooltip that follows the hovered dot
    const h = hovered.current
    if (tip.current) {
      tip.current.style.opacity = h ? '1' : '0'
      if (h) {
        h.mesh.getWorldPosition(V).project(camera)
        tip.current.style.transform = `translate(${((V.x + 1) / 2) * size.width}px, ${((1 - V.y) / 2) * size.height}px) translate(-50%, -190%)`
        if (tip.current.textContent !== h.title) tip.current.textContent = h.title
      }
    }
  })

  return (
    <>
      <group ref={root} position={[0, -(height + OPEN) / 2, 0]}>
        {props.layers.map((layer, i) => (
          <Layer key={layer.id} index={i} layer={layer} {...props} hovered={hovered} setHovered={(h) => { hovered.current = h }} />
        ))}
      </group>
    </>
  )
}

export default function StackMap(props: Props) {
  const elev = (28 * Math.PI) / 180
  const d = 30
  const tip = useRef<HTMLDivElement>(null)
  return (
    <>
    <Canvas
      orthographic
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [d * Math.cos(elev) * Math.SQRT1_2, d * Math.sin(elev), d * Math.cos(elev) * Math.SQRT1_2], zoom: 60, near: 0.1, far: 100 }}
      onCreated={({ camera }) => camera.lookAt(0, 0, 0)}
      onPointerMissed={() => props.onActive(null)}
    >
      <Stack {...props} tip={tip} />
    </Canvas>
    <div ref={tip} className="map-tip" />
    </>
  )
}
