import { create } from 'zustand'

export type Lang = 'en' | 'ar'

interface State {
  lang: Lang
  view: string // current section / camera view id
  hovered: string | null // project id
  open: string | null // project id shown in case-study panel
  explore: boolean // free-orbit mode
  mode: '3d' | '2d'
  ready: boolean
  setLang: (l: Lang) => void
  setView: (v: string) => void
  setHovered: (h: string | null) => void
  setOpen: (o: string | null) => void
  setExplore: (e: boolean) => void
  setMode: (m: '3d' | '2d') => void
  setReady: () => void
}

export const useStore = create<State>((set) => ({
  lang: 'en',
  view: 'hero',
  hovered: null,
  open: null,
  explore: false,
  mode: '3d',
  ready: false,
  setLang: (lang) => set({ lang }),
  setView: (view) => set({ view }),
  setHovered: (hovered) => set({ hovered }),
  setOpen: (open) => set({ open }),
  setExplore: (explore) => set({ explore }),
  setMode: (mode) => set({ mode }),
  setReady: () => set({ ready: true }),
}))

/** Mutable scroll state read every frame by the camera rig (kept out of React). */
export const scrollState = {
  names: ['hero'] as string[],
  f: 0, // fractional index into names
  mx: 0,
  my: 0,
}
