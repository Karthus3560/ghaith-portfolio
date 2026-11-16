import * as THREE from 'three'
import { chapters, projects } from '../data/content'

export interface Tube {
  key: string
  curve: THREE.CatmullRomCurve3
  radius: number
  start: number
  span: number
  chapter: string | null
  colorA: string
  colorB: string
  seed: number
  segs: number
}
export interface TreeNode {
  id: string
  chapter: string
  pos: THREE.Vector3
  start: number
  color: string
}
export interface View {
  pos: THREE.Vector3
  target: THREE.Vector3
  shift: number // horizontal screen shift, fraction of width (LTR)
}

function mulberry(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const TRUNK = '#f3d9a4'
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)

export function buildTree() {
  const rnd = mulberry(20231101)
  const tubes: Tube[] = []
  const nodes: TreeNode[] = []
  const views: Record<string, View> = {}
  const anchors: Record<string, THREE.Vector3> = { nursing: v(2.6, 1.2, 2.2) }

  const trunk = new THREE.CatmullRomCurve3([
    v(0, -0.1, 0),
    v(0.12, 1.3, 0.1),
    v(-0.14, 2.9, -0.08),
    v(0.1, 4.5, 0.06),
    v(-0.04, 5.9, -0.03),
    v(0.02, 6.9, 0),
  ])
  tubes.push({ key: 'trunk', curve: trunk, radius: 0.2, start: 0, span: 0.34, chapter: null, colorA: '#c9a86a', colorB: TRUNK, seed: 0, segs: 90 })

  const aerial = chapters.filter((c) => c.id !== 'nursing')
  const n = aerial.length

  aerial.forEach((ch, i) => {
    const mine = projects.filter((p) => p.chapter === ch.id)
    const a = i * 2.39996 + 0.9
    const t = 0.43 + 0.5 * (i / Math.max(1, n - 1))
    const base = trunk.getPoint(t)
    const L = 3.7 - i * 0.22
    const rise = 1.5 + rnd() * 0.5
    const dir = v(Math.cos(a), 0, Math.sin(a))
    const side = v(-dir.z, 0, dir.x)
    const p1 = base.clone().addScaledVector(dir, L * 0.33).add(v(0, rise * 0.34, 0)).addScaledVector(side, (rnd() - 0.5) * 0.7)
    const p2 = base.clone().addScaledVector(dir, L * 0.68).add(v(0, rise * 0.7, 0)).addScaledVector(side, (rnd() - 0.5) * 0.9)
    const end = base.clone().addScaledVector(dir, L).add(v(0, rise, 0))
    const curve = new THREE.CatmullRomCurve3([base, p1, p2, end])
    const bStart = 0.16 + t * 0.3
    const bSpan = 0.3
    tubes.push({ key: `b-${ch.id}`, curve, radius: 0.085, start: bStart, span: bSpan, chapter: ch.id, colorA: TRUNK, colorB: ch.color, seed: rnd(), segs: 70 })

    const m = mine.length
    mine.forEach((p, k) => {
      const u = m === 1 ? 1 : 0.34 + 0.66 * (k / (m - 1))
      const from = curve.getPoint(u)
      const ang = k * 2.39996 + i
      const out = dir.clone().multiplyScalar(0.35).addScaledVector(side, Math.cos(ang) * 0.95).add(v(0, Math.sin(ang) * 0.75 + 0.45, 0))
      const len = u >= 0.999 ? 0.55 : 0.95 + rnd() * 0.45
      const leaf = from.clone().addScaledVector(out.normalize(), len)
      const mid = from.clone().lerp(leaf, 0.5).add(v(0, 0.14, 0))
      const s = bStart + bSpan * u
      tubes.push({ key: `t-${p.id}`, curve: new THREE.CatmullRomCurve3([from, mid, leaf]), radius: 0.032, start: s, span: 0.12, chapter: ch.id, colorA: ch.color, colorB: ch.color, seed: rnd(), segs: 24 })
      nodes.push({ id: p.id, chapter: ch.id, pos: leaf, start: s + 0.12, color: ch.color })
    })

    // decorative twigs for a fuller crown
    for (let d = 0; d < 5; d++) {
      const u = 0.25 + rnd() * 0.75
      const from = curve.getPoint(u)
      const o = v(rnd() - 0.5, rnd() * 0.9 + 0.1, rnd() - 0.5).normalize().multiplyScalar(0.5 + rnd() * 0.6)
      const leaf = from.clone().add(o)
      tubes.push({ key: `d-${ch.id}-${d}`, curve: new THREE.CatmullRomCurve3([from, from.clone().lerp(leaf, 0.5).add(v(0, 0.1, 0)), leaf]), radius: 0.02, start: bStart + bSpan * u, span: 0.1, chapter: ch.id, colorA: ch.color, colorB: ch.color, seed: rnd(), segs: 14 })
    }

    anchors[ch.id] = end.clone().add(v(0, 0.9, 0)).addScaledVector(dir, 1.5)
    const focus = curve.getPoint(0.78).add(v(0, 0.35, 0))
    views[ch.id] = {
      target: focus,
      pos: focus.clone().addScaledVector(dir, 6.6).addScaledVector(side, 1.8).add(v(0, 1.1, 0)),
      shift: 0.25,
    }
  })

  // roots = nursing
  const rootCh = chapters.find((c) => c.id === 'nursing')!
  const rootProjects = projects.filter((p) => p.chapter === 'nursing')
  const rootCount = 7
  for (let r = 0; r < rootCount; r++) {
    const a = (r / rootCount) * Math.PI * 2 + 0.35
    const L = 2.3 + rnd() * 1.5
    const dir = v(Math.cos(a), 0, Math.sin(a))
    const side = v(-dir.z, 0, dir.x)
    const pts = [
      v(0, 0.35, 0),
      dir.clone().multiplyScalar(L * 0.3).add(v(0, 0.1, 0)),
      dir.clone().multiplyScalar(L * 0.65).addScaledVector(side, (rnd() - 0.5) * 0.9).add(v(0, 0.03, 0)),
      dir.clone().multiplyScalar(L).addScaledVector(side, (rnd() - 0.5) * 0.9).add(v(0, 0.02, 0)),
    ]
    const p = rootProjects[r % 2 === 0 ? r / 2 : -1]
    tubes.push({ key: `r-${r}`, curve: new THREE.CatmullRomCurve3(pts), radius: 0.07, start: 0.02, span: 0.3, chapter: 'nursing', colorA: TRUNK, colorB: rootCh.color, seed: rnd(), segs: 40 })
    if (p) {
      const tip = pts[3]
      const leaf = tip.clone().add(v(0, 0.55, 0))
      tubes.push({ key: `t-${p.id}`, curve: new THREE.CatmullRomCurve3([tip, tip.clone().add(v(0.05, 0.28, 0.03)), leaf]), radius: 0.03, start: 0.3, span: 0.1, chapter: 'nursing', colorA: rootCh.color, colorB: rootCh.color, seed: rnd(), segs: 12 })
      nodes.push({ id: p.id, chapter: 'nursing', pos: leaf, start: 0.4, color: rootCh.color })
    }
  }

  const C = v(0, 3.7, 0)
  views.hero = { pos: v(0, 3.1, 14.2), target: v(0, 3.9, 0), shift: 0.23 }
  views.impact = { pos: v(-7.5, 5.2, 10.5), target: v(0, 3.6, 0), shift: 0 }
  views.nursing = { pos: v(6.2, 4.2, 9.2), target: v(0, 0.9, 0), shift: 0.25 }
  views.timeline = { pos: v(9, 9.5, 9), target: C, shift: 0.22 }
  views.skills = { pos: v(-10, 4.5, -6.5), target: C, shift: -0.22 }
  views.contact = { pos: v(0, 2.6, 22), target: v(0, 0.4, 0), shift: 0 }
  views.explore = { pos: v(10, 6.5, 14.5), target: v(0, 4.3, 0), shift: 0 }

  return { tubes, nodes, views, anchors }
}

export const tree = buildTree()
