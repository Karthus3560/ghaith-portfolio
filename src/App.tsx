import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { chapters, contact, impact, person, projects, skills, timeline, ui, type Chapter, type L } from './data/content'
import { media, portrait } from './data/media'
import { scrollState, useStore } from './store'
import Tree2D from './components/Tree2D'

const Scene = lazy(() => import('./three/Scene'))

function useT() {
  const lang = useStore((s) => s.lang)
  return (x: L) => x[lang]
}

/* ───────── scroll → camera view */
function useScrollViews() {
  useEffect(() => {
    let els: HTMLElement[] = []
    let centers: number[] = []
    const measure = () => {
      els = Array.from(document.querySelectorAll<HTMLElement>('[data-view]'))
      scrollState.names = els.map((e) => e.dataset.view!)
      centers = els.map((e) => e.offsetTop + Math.min(e.offsetHeight, window.innerHeight) / 2)
      onScroll()
    }
    const onScroll = () => {
      if (!centers.length) return
      const y = window.scrollY + window.innerHeight / 2
      let i = 0
      while (i < centers.length - 2 && y > centers[i + 1]) i++
      const span = centers[i + 1] - centers[i] || 1
      const f = Math.max(0, Math.min(centers.length - 1, i + (y - centers[i]) / span))
      scrollState.f = f
      const name = scrollState.names[Math.round(f)]
      if (name && useStore.getState().view !== name) useStore.getState().setView(name)
      document.documentElement.style.setProperty('--progress', String(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)))
    }
    const onMove = (e: PointerEvent) => {
      scrollState.mx = (e.clientX / window.innerWidth) * 2 - 1
      scrollState.my = (e.clientY / window.innerHeight) * 2 - 1
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
}

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

const goTo = (view: string) => document.querySelector(`[data-view="${view}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/* ───────── pieces */
function Ecg({ className = '' }: { className?: string }) {
  return (
    <svg className={'ecg ' + className} viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden>
      <path d="M0 34 H150 l10 -6 l10 6 h26 l8 -4 l10 -24 l12 50 l10 -30 l8 8 h30 l14 -10 l14 10 H420 l10 -5 l10 5 H600" />
    </svg>
  )
}

function Nav() {
  const t = useT()
  const { lang, setLang, explore, setExplore, mode, setMode, view } = useStore()
  return (
    <header className="nav">
      <button className="mono-mark" onClick={() => goTo('hero')} aria-label={t(ui.top)}>
        <span>G</span>
        <i />
        <b>{t(person.name)}</b>
      </button>
      <nav className="nav-actions">
        {mode === '3d' && (
          <button className={'pill' + (explore ? ' is-on' : '')} onClick={() => setExplore(!explore)}>
            <span className="dot" /> {t(explore ? ui.exitExplore : ui.explore)}
          </button>
        )}
        <button className="pill ghost mode" onClick={() => { setExplore(false); setMode(mode === '3d' ? '2d' : '3d') }}>
          {t(mode === '3d' ? ui.mode2d : ui.mode3d)}
        </button>
        <button className="pill ghost lang" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} aria-label="Language">
          {lang === 'en' ? 'عربي' : 'English'}
        </button>
      </nav>
      {!explore && (
        <ol className="rail" aria-label="Sections">
          {chapters.map((c) => (
            <li key={c.id}>
              <button className={view === c.id ? 'is-on' : ''} style={{ ['--c' as string]: c.color }} onClick={() => goTo(c.id)}>
                <span>{t(c.title)}</span>
                <i />
              </button>
            </li>
          ))}
        </ol>
      )}
    </header>
  )
}

function Hero() {
  const t = useT()
  const ready = useStore((s) => s.ready)
  const mode = useStore((s) => s.mode)
  const [late, setLate] = useState(false)
  useEffect(() => { const id = setTimeout(() => setLate(true), 5000); return () => clearTimeout(id) }, [])
  return (
    <section className={'hero' + (ready || mode === '2d' || late ? ' is-in' : '')} data-view="hero">
      <div className="hero-inner">
        <div className="hero-id">
          {portrait && <img src={portrait} alt="" />}
          <p><b>{t(person.title)}</b><span>{t(person.org)}</span></p>
        </div>
        <h1>{t(person.name)}</h1>
        <Ecg />
        <p className="hero-line">{t(person.line)}</p>
        <p className="hero-sub">{t(person.sub)}</p>
        <div className="hero-cta">
          <button className="btn" onClick={() => goTo('impact')}>{t(ui.scroll)} <span aria-hidden>↓</span></button>
        </div>
      </div>
    </section>
  )
}

function Counter({ value, prefix = '', suffix = '', run }: { value: number; prefix?: string; suffix?: string; run: boolean }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 1800)
      setN(Math.round(value * (1 - Math.pow(1 - k, 4))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, value])
  return <>{prefix}{n.toLocaleString('en-US')}{suffix}</>
}

function Impact() {
  const t = useT()
  const [ref, seen] = useInView<HTMLDivElement>(0.25)
  return (
    <section className="impact" data-view="impact">
      <div className="wrap">
        <p className="eyebrow">{t(ui.impactKicker)}</p>
        <h2>{t(ui.impactTitle)}</h2>
        <div ref={ref} className={'impact-grid' + (seen ? ' is-in' : '')}>
          {impact.map((s, i) => (
            <div className="stat" key={i} style={{ ['--i' as string]: i }}>
              <strong>{s.text ? t(s.text) : <Counter value={s.value} suffix={s.suffix} run={seen} />}</strong>
              <span>{t(s.label)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ChapterSection({ ch }: { ch: Chapter }) {
  const t = useT()
  const mine = useMemo(() => projects.filter((p) => p.chapter === ch.id), [ch.id])
  const { hovered, setHovered, setOpen } = useStore()
  const [ref, seen] = useInView<HTMLDivElement>(0.2)
  return (
    <section className="chapter" data-view={ch.id} style={{ ['--c' as string]: ch.color }}>
      <div ref={ref} className={'card' + (seen ? ' is-in' : '')}>
        <p className="eyebrow">{t(ch.kicker)}</p>
        <h2>{t(ch.title)}</h2>
        <p className="role">{t(ch.role)}<span>{t(ch.period)}</span></p>
        <p className="blurb">{t(ch.blurb)}</p>
        <div className="mini-stats">
          {ch.stats.map((s, i) => (
            <div key={i}><strong>{s.value}</strong><span>{t(s.label)}</span></div>
          ))}
        </div>
        <p className="leaves-h">{t(ui.leaves)}</p>
        <ul className={'leaves' + (mine.length > 5 ? ' dense' : '')}>
          {mine.map((p) => (
            <li key={p.id}>
              <button
                className={hovered === p.id ? 'is-hover' : ''}
                onMouseEnter={() => setHovered(p.id)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(p.id)}
                onBlur={() => setHovered(null)}
                onClick={() => setOpen(p.id)}
              >
                <i />
                <span><b>{t(p.title)}</b><em>{t(p.tag)}</em></span>
                <u aria-hidden>→</u>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Timeline() {
  const t = useT()
  const [ref, seen] = useInView<HTMLOListElement>(0.1)
  return (
    <section className="timeline" data-view="timeline">
      <div className="card wide is-in">
        <p className="eyebrow">{t(ui.timelineKicker)}</p>
        <h2>{t(ui.timelineTitle)}</h2>
        <ol ref={ref} className={'tl' + (seen ? ' is-in' : '')}>
          {timeline.map((e, i) => {
            const c = chapters.find((x) => x.id === e.chapter)!
            return (
              <li key={i} style={{ ['--c' as string]: c.color, ['--i' as string]: i }}>
                <button onClick={() => goTo(e.chapter)}>
                  <time>{t(e.when)}</time>
                  <p>{t(e.what)}</p>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function Skills() {
  const t = useT()
  return (
    <section className="skills side-end" data-view="skills">
      <div className="card wide is-in">
        <p className="eyebrow">{t(ui.skillsKicker)}</p>
        <h2>{t(ui.skillsTitle)}</h2>
        <div className="skill-grid">
          {skills.map((g, i) => (
            <div key={i}>
              <h3>{t(g.title)}</h3>
              <ul>{g.items.map((s, k) => <li key={k}>{t(s)}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const t = useT()
  const mode = useStore((s) => s.mode)
  const setExplore = useStore((s) => s.setExplore)
  return (
    <section className="contact" data-view="contact">
      <div className="contact-inner">
        {portrait && <img className="portrait" src={portrait} alt={t(person.name)} />}
        <p className="eyebrow">{t(ui.contactKicker)}</p>
        <h2>{t(ui.contactTitle)}</h2>
        <p>{t(ui.contactBody)}</p>
        <div className="hero-cta">
          {contact.email && <a className="btn" href={`mailto:${contact.email}`}>{contact.email}</a>}
          {contact.linkedin && <a className="btn ghost" href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
          {mode === '3d' && <button className="btn" onClick={() => setExplore(true)}>{t(ui.explore)}</button>}
          <button className="btn ghost" onClick={() => goTo('hero')}>{t(ui.top)} ↑</button>
        </div>
        <footer>
          <Ecg className="small" />
          <span>{t(person.name)} · {t(contact.location)} · {projects.length} {t(ui.systems)}</span>
        </footer>
      </div>
    </section>
  )
}

function Panel() {
  const t = useT()
  const { open, setOpen, lang } = useStore()
  const p = projects.find((x) => x.id === open)
  const [zoom, setZoom] = useState<string | null>(null)
  const body = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (zoom ? setZoom(null) : setOpen(null))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setOpen, zoom])
  useEffect(() => { body.current?.scrollTo(0, 0); setZoom(null) }, [open])
  const ch = p && chapters.find((c) => c.id === p.chapter)!
  const sibs = p ? projects.filter((x) => x.chapter === p.chapter) : []
  const idx = p ? sibs.indexOf(p) : 0
  const shots = p ? media[p.id] ?? [] : []
  return (
    <>
      <div className={'scrim' + (p ? ' is-on' : '')} onClick={() => setOpen(null)} />
      <aside className={'panel' + (p ? ' is-on' : '')} style={{ ['--c' as string]: ch?.color ?? '#fff' }} aria-hidden={!p} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {p && ch && (
          <div className="panel-body" ref={body} key={p.id}>
            <div className="panel-top">
              <span className="chip">{t(ch.title)}</span>
              <button className="x" onClick={() => setOpen(null)} aria-label={t(ui.close)}>×</button>
            </div>
            <h2>{t(p.title)}</h2>
            <p className="tag">{t(p.tag)}</p>
            <div className="panel-impact">
              {p.impact.map((s, i) => (
                <div key={i}><strong>{s.value}</strong><span>{t(s.label)}</span></div>
              ))}
            </div>
            {shots.length > 0 && (
              <div className="shots">
                {shots.map((s, i) =>
                  s.type === 'video' ? (
                    <figure key={i} className={s.portrait ? 'is-portrait' : ''}>
                      <video src={s.src} poster={s.poster} controls preload="none" playsInline />
                      <figcaption>{t(s.caption)}</figcaption>
                    </figure>
                  ) : (
                    <figure key={i} className={s.portrait ? 'is-portrait' : ''}>
                      <img src={s.src} alt={t(s.caption)} loading="lazy" onClick={() => setZoom(s.src)} />
                      <figcaption>{t(s.caption)}</figcaption>
                    </figure>
                  ),
                )}
                <p className="note">{t(ui.redacted)}</p>
              </div>
            )}
            <h3>{t(ui.problem)}</h3>
            <p className="problem">{t(p.problem)}</p>
            <h3>{t(ui.built)}</h3>
            <ul className="built">{p.built.map((b, i) => <li key={i}>{t(b)}</li>)}</ul>
            <h3>{t(ui.tech)}</h3>
            <ul className="tech">{p.tech.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="panel-nav">
              <button onClick={() => setOpen(sibs[(idx - 1 + sibs.length) % sibs.length].id)}>← {t(ui.prev)}</button>
              <span>{idx + 1} / {sibs.length}</span>
              <button onClick={() => setOpen(sibs[(idx + 1) % sibs.length].id)}>{t(ui.next)} →</button>
            </div>
          </div>
        )}
      </aside>
      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <img src={zoom} alt="" />
        </div>
      )}
    </>
  )
}

function Loader() {
  const ready = useStore((s) => s.ready)
  const mode = useStore((s) => s.mode)
  const [gone, setGone] = useState(false)
  const [late, setLate] = useState(false)
  useEffect(() => { const id = setTimeout(() => setLate(true), 5000); return () => clearTimeout(id) }, [])
  const done = ready || mode === '2d' || late
  useEffect(() => {
    if (done) { const id = setTimeout(() => setGone(true), 1200); return () => clearTimeout(id) }
  }, [done])
  if (gone) return null
  return (
    <div className={'loader' + (done ? ' is-done' : '')} aria-hidden>
      <Ecg />
    </div>
  )
}

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function App() {
  const { lang, mode, explore, setMode, open } = useStore()
  const t = useT()
  useScrollViews()
  useEffect(() => {
    const q = new URLSearchParams(location.search)
    if (q.has('lite') || !webglOk()) setMode('2d')
    if (q.get('lang') === 'ar') useStore.getState().setLang('ar')
  }, [setMode])
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = `${person.name[lang]} · ${person.title[lang]}`
  }, [lang])
  useEffect(() => {
    document.body.classList.toggle('is-explore', explore)
    document.body.classList.toggle('is-locked', explore || !!open)
  }, [explore, open])

  return (
    <div className={'app mode-' + mode}>
      <div className="stage" aria-hidden>
        {mode === '3d' ? (
          <Suspense fallback={null}><Scene /></Suspense>
        ) : (
          <Tree2D />
        )}
      </div>
      <div className="grain" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Impact />
        {chapters.map((c) => <ChapterSection key={c.id} ch={c} />)}
        <Timeline />
        <Skills />
        <Contact />
      </main>
      {explore && (
        <div className="explore-bar">
          <p>{t(ui.exploreHint)}</p>
          <div className="legend">
            {chapters.map((c) => <span key={c.id} style={{ ['--c' as string]: c.color }}><i />{t(c.title)}</span>)}
          </div>
        </div>
      )}
      <Panel />
      <Loader />
    </div>
  )
}
