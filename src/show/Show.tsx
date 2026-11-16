import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { person, type L } from '../data/content'
import { media, type Shot } from '../data/media'
import { arValues, chapters, layerOrder, projects } from '../pro/copy'
import { createEngine, N, stage } from './engine'
import { scenes, t } from './copy'
import { B } from '../base'

type Lang = 'en' | 'ar'
const LRI = String.fromCharCode(0x2066)
const PDI = String.fromCharCode(0x2069)
const WJ = String.fromCharCode(0x2060)
const chById = Object.fromEntries(chapters.map((c) => [c.id, c]))
const ordered = layerOrder.flatMap((id) => projects.filter((p) => p.chapter === id))
const pick = (id: string, n: number) => media[id]?.[n]
const gallery = [pick('platform', 0), pick('volunteers', 0), pick('satisfaction', 0), pick('satisfaction', 1), pick('learn', 0), pick('finance', 0), pick('volunteers', 1), pick('directline', 0), pick('finance', 1), pick('iconstudio', 0)].filter(Boolean) as Shot[]

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** `*…*` becomes emphasis, `|` a line break. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('|').map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split('*').map((part, j) => (j % 2 ? <em key={j}>{part}</em> : <Fragment key={j}>{part}</Fragment>))}
        </Fragment>
      ))}
    </>
  )
}

export default function Show() {
  const [lang, setLang] = useState<Lang>(() => (new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en'))
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState<string | null>(null)
  const [gl] = useState(webglOk)
  const canvas = useRef<HTMLCanvasElement>(null)
  const count = useRef<HTMLElement>(null)
  const ceiling = useRef<HTMLParagraphElement>(null)

  // numeric ranges never break across lines, and keep left-to-right order inside Arabic
  const tr = useMemo(() => (x: L) => (lang === 'ar' ? x.ar.replace(/(\d[\d,]*)–(\d[\d,]*)/g, `${LRI}$1${WJ}–${WJ}$2${PDI}`) : x.en.replace(/(\d[\d,]*)–(\d[\d,]*)/g, `$1${WJ}–${WJ}$2`)), [lang])
  const val = useMemo(
    () => (v: string) => {
      if (lang !== 'ar') return v
      const a = arValues[v] ?? v
      return /[؀-ۿ]/.test(a) ? a : `${LRI}${a}${PDI}`
    },
    [lang],
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = `${person.name[lang]} · ${person.title[lang]}`
    stage.rtl = lang === 'ar'
  }, [lang])

  useEffect(() => {
    if (!gl || !canvas.current) return
    return createEngine(canvas.current)
  }, [gl])

  // scroll position → scene index, record counter
  useEffect(() => {
    let els: HTMLElement[] = []
    let centers: number[] = []
    let rec: HTMLElement | null = null
    let last = -1
    const onScroll = () => {
      if (!centers.length) return
      const vh = window.innerHeight
      const y = window.scrollY + vh / 2
      let i = 0
      while (i < centers.length - 2 && y > centers[i + 1]) i++
      const f = Math.max(0, Math.min(centers.length - 1, i + (y - centers[i]) / (centers[i + 1] - centers[i] || 1)))
      stage.f = f
      const a = Math.round(f)
      if (a !== last) { last = a; setActive(a) }
      if (rec) {
        const p = Math.max(0, Math.min(1, (window.scrollY - rec.offsetTop + vh * 0.15) / vh))
        stage.reveal = p
        const n = Math.round(p * N)
        if (count.current) count.current.textContent = n.toLocaleString('en-US')
        ceiling.current?.classList.toggle('hit', n >= 15000)
        count.current?.classList.toggle('past', n > 15000)
      }
      document.documentElement.style.setProperty('--progress', String(window.scrollY / Math.max(1, document.documentElement.scrollHeight - vh)))
    }
    const measure = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
      centers = els.map((e) => e.offsetTop + e.offsetHeight / 2)
      rec = document.querySelector<HTMLElement>('[data-scene="records"]')
      onScroll()
    }
    const onMove = (e: PointerEvent) => {
      stage.mx = (e.clientX / window.innerWidth) * 2 - 1
      stage.my = (e.clientY / window.innerHeight) * 2 - 1
      stage.hover = e.pointerType === 'mouse'
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setZoom(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])

  const go = (i: number) => {
    const e = document.querySelectorAll<HTMLElement>('[data-scene]')[i]
    if (e) window.scrollTo({ top: e.offsetTop + (e.offsetHeight - window.innerHeight) / 2, behavior: 'smooth' })
  }

  const story = scenes.slice(0, -1)
  const finale = scenes[scenes.length - 1]
  const q = lang === 'ar' ? '?lang=ar' : ''

  const scene = (s: (typeof scenes)[number], i: number, extra?: React.ReactNode) => (
    <section key={s.id} className={`scene s-${s.id}`} data-scene={s.id} style={{ '--a': s.color } as React.CSSProperties}>
      <div className="say">
        <div className={`copy${active === i ? ' on' : ''}`}>
          <p className="kick">{i > 0 && <b>{String(i).padStart(2, '0')}</b>}{tr(s.kick)}</p>
          {s.id === 'records' && (
            <div className="counter">
              <strong ref={count}>0</strong>
              <span>{tr(t.counter)}</span>
              <p ref={ceiling} className="ceiling">{tr(t.ceiling)}</p>
            </div>
          )}
          {i === 0 ? <h1><Rich text={tr(s.head)} /></h1> : <h2><Rich text={tr(s.head)} /></h2>}
          <p className="body">{tr(s.body)}</p>
          {s.id === 'bridge' && (
            <p className="legend">
              <i style={{ background: '#ff8f7d' }} />{tr(t.clinical)}
              <i style={{ background: '#5eead4' }} />{tr(t.hr)}
              <i style={{ background: '#6fb1ff' }} />{tr(t.it)}
            </p>
          )}
          {s.stats && (
            <dl className="stats" data-n={s.stats.length} style={{ '--n': s.stats.length } as React.CSSProperties}>
              {s.stats.map((x) => (
                <div key={x.label.en}><dt>{val(x.value)}</dt><dd>{tr(x.label)}</dd></div>
              ))}
            </dl>
          )}
          {s.note && <p className="note">{tr(s.note)}</p>}
          {extra}
        </div>
      </div>
    </section>
  )

  return (
    <>
      {gl ? <canvas ref={canvas} className="stage" aria-hidden="true" /> : <div className="stage flat" />}

      <header className="top">
        <a href="#top" className="name" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{tr(person.name)}</a>
        <div className="top-end">
          <a className="pill" href={`${B}${q}`}>{tr(t.cv)}</a>
          <button className="pill" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} lang={lang === 'en' ? 'ar' : 'en'}>{lang === 'en' ? 'عربي' : 'English'}</button>
        </div>
      </header>

      <nav className="rail" aria-label="Story">
        {scenes.map((s, i) => (
          <button key={s.id} className={active === i ? 'on' : ''} style={{ '--a': s.color } as React.CSSProperties} onClick={() => go(i)} aria-label={tr(s.kick)} title={tr(s.kick)} />
        ))}
      </nav>

      <main id="top">
        {story.map((s, i) => scene(s, i, i === 0 ? <p className="cue">{tr(t.scroll)}<span /></p> : undefined))}

        <div className="solid">
          <section className="block">
            <div className="wrap">
              <h2><Rich text={tr(t.proofHead)} /></h2>
              <p className="body">{tr(t.proofBody)}</p>
            </div>
            <div className="strip" dir="ltr">
              {gallery.map((s) => (
                <figure key={s.src} className={s.portrait ? 'tall' : ''}>
                  {s.type === 'video' ? (
                    <video src={s.src} poster={s.poster} controls preload="none" playsInline />
                  ) : (
                    <button onClick={() => setZoom(s.src)} aria-label={tr(s.caption)}><img src={s.src} alt={tr(s.caption)} loading="lazy" /></button>
                  )}
                  <figcaption dir={lang === 'ar' ? 'rtl' : 'ltr'}>{tr(s.caption)}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="block wrap">
            <h2><Rich text={tr(t.allHead)} /></h2>
            <p className="body">{val(String(projects.length))} {tr(t.allBody)}</p>
            <div className="tiles">
              {ordered.map((p) => {
                const c = chById[p.chapter]
                return (
                  <article key={p.id} className="tile" style={{ '--a': c.color } as React.CSSProperties}>
                    <p className="tile-ch"><i />{tr(c.title)}</p>
                    <h3>{tr(p.title)}</h3>
                    <p className="tile-tag">{tr(p.tag)}</p>
                    <p className="tile-n"><b>{val(p.impact[0].value)}</b>{tr(p.impact[0].label)}</p>
                  </article>
                )
              })}
            </div>
          </section>
        </div>

        {scene(finale, scenes.length - 1, (
          <div className="ends">
            <a className="pill solid-pill" href={`${B}${q}`}>{tr(t.readCv)}</a>
            <a className="pill" href={`${B}game.html${q}`}>{tr(t.game)}</a>
            <a className="pill" href={`${B}tree.html${q}`}>{tr(t.tree)}</a>
            <button className="pill" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{tr(t.top)}</button>
          </div>
        ))}
      </main>

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <img src={zoom} alt="" />
        </div>
      )}
    </>
  )
}
