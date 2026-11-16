import { create } from 'zustand'
import type { Lang } from './world'

interface State {
  lang: Lang
  started: boolean
  sound: boolean
  /** Beacon the van is standing on, if any. */
  near: string | null
  district: string | null
  /** Project whose card is open. */
  open: string | null
  found: string[]
  orbs: number
  set: (p: Partial<State>) => void
}

export const useGame = create<State>((set) => ({
  lang: new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en',
  started: false,
  sound: false,
  near: null,
  district: null,
  open: null,
  found: [],
  orbs: 0,
  set: (p) => set(p),
}))

/** Touch stick and buttons write here; the game loop reads it. */
export const pad = { x: 0, y: 0, boost: false }
/** Filled in by the game so the HUD can trigger the same actions as the keys. */
export const actions = { interact: () => {}, honk: () => {}, reset: () => {} }
