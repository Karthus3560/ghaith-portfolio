import { useMemo } from 'react'
import { useStore } from '../store'
import { tree } from '../three/treeGen'

/** Lightweight SVG rendering of the same tree for weak devices / no WebGL. */
export default function Tree2D() {
  const view = useStore((s) => s.view)
  const hovered = useStore((s) => s.hovered)
  const setOpen = useStore((s) => s.setOpen)
  const { paths, nodes } = useMemo(() => {
    const th = 0.55, c = Math.cos(th), s = Math.sin(th)
    const proj = (x: number, y: number, z: number) => {
      const X = x * c + z * s
      const Z = -x * s + z * c
      const k = 1 / (1 + Z * 0.03)
      return [400 + X * 62 * k, 640 - y * 72 * k + Z * 9] as const
    }
    const paths = tree.tubes.map((t) => {
      const pts = t.curve.getPoints(t.key === 'trunk' ? 40 : 18).map((p) => proj(p.x, p.y, p.z))
      return { key: t.key, chapter: t.chapter, color: t.colorB, w: Math.max(1, t.radius * 46), d: 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') }
    })
    const nodes = tree.nodes.map((n) => {
      const [x, y] = proj(n.pos.x, n.pos.y, n.pos.z)
      return { ...n, x, y }
    })
    return { paths, nodes }
  }, [])
  return (
    <svg className="tree2d" viewBox="0 0 800 700" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="400" cy="645" rx="300" ry="26" fill="none" stroke="#5eead4" strokeOpacity=".18" />
      <ellipse cx="400" cy="645" rx="190" ry="16" fill="none" stroke="#5eead4" strokeOpacity=".25" />
      <g filter="url(#glow)" fill="none" strokeLinecap="round">
        {paths.map((p) => (
          <path key={p.key} d={p.d} stroke={p.color} strokeWidth={p.w} opacity={p.chapter && view !== p.chapter && chaptersActive(view) ? 0.25 : 0.9} />
        ))}
        {nodes.map((n) => (
          <circle key={n.id} cx={n.x} cy={n.y} r={hovered === n.id ? 9 : 5.5} fill={n.color} opacity={view !== n.chapter && chaptersActive(view) ? 0.3 : 1} onClick={() => setOpen(n.id)} style={{ cursor: 'pointer', pointerEvents: 'auto' }} />
        ))}
      </g>
    </svg>
  )
}

const chapterIds = new Set(tree.nodes.map((n) => n.chapter))
const chaptersActive = (view: string) => chapterIds.has(view)
