import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { contact, impact, person, skills, timeline, type L, type Project } from '../data/content'
import { media, portrait } from '../data/media'
import { arValues, chapters, experienceOrder, featured, layerOrder, projects, screens, t } from './copy'
import { u } from '../base'

const StackMap = lazy(() => import('./StackMap'))

type Lang = 'en' | 'ar'
const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
const chById = Object.fromEntries(chapters.map((c) => [c.id, c]))
const inChapter = (id: string) => projects.filter((p) => p.chapter === id)
const num = (n: number) => String(n).padStart(2, '0')

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const LRI = String.fromCharCode(0x2066)
const PDI = String.fromCharCode(0x2069)
/** Text in the current language; numeric ranges inside Arabic keep left-to-right order. */
const text = (lang: Lang) => (x: L) => (lang === 'ar' ? x.ar.replace(/(\d[\d,]*–\d[\d,]*)/g, `${LRI}$1${PDI}`) : x.en)
/** A figure value: Arabic word where one exists, otherwise isolated so signs stay beside their digits. */
const figure = (lang: Lang) => (v: string) => {
  if (lang !== 'ar') return v
  const a = arValues[v] ?? v
  return /[؀-ۿ]/.test(a) ? a : `${LRI}${a}${PDI}`
}

function Arrow() {
  return (
    <svg className="arrow" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ───────── case study dialog */
function CaseStudy({ id, list, tr, val, onClose, onGo }: { id: string; list: Project[]; tr: (x: L) => string; val: (v: string) => string; onClose: () => void; onGo: (id: string) => void }) {
  const p = byId[id]
  const ch = chById[p.chapter]
  const shots = media[p.id] ?? []
  const i = list.findIndex((x) => x.id === id)
  const prev = list[(i - 1 + list.length) % list.length]
  const next = list[(i + 1) % list.length]
  const [zoom, setZoom] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') (zoom ? setZoom(null) : onClose())
    }
    window.addEventListener('keydown', onKey)
    document.body.classList.add('locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.classList.remove('locked')
    }
  }, [onClose, zoom])
  useEffect(() => {
    box.current?.scrollTo({ top: 0 })
    box.current?.focus()
  }, [id])

  return (
    <div className="cs-wrap" onClick={onClose}>
      <div className="cs" role="dialog" aria-modal="true" aria-label={tr(p.title)} tabIndex={-1} ref={box} onClick={(e) => e.stopPropagation()}>
        <header className="cs-head">
          <span className="label">{tr(ch.title)}</span>
          <button className="btn ghost" onClick={onClose}>{tr(t.close)}</button>
        </header>
        <h2>{tr(p.title)}</h2>
        <p className="cs-tag">{tr(p.tag)}</p>

        <dl className="cs-metrics">
          {p.impact.map((m) => (
            <div key={m.value}>
              <dt>{val(m.value)}</dt>
              <dd>{tr(m.label)}</dd>
            </div>
          ))}
        </dl>

        <div className="cs-body">
          <section>
            <h3>{tr(t.problem)}</h3>
            <p>{tr(p.problem)}</p>
            <h3>{tr(t.tech)}</h3>
            <ul className="chips">{p.tech.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
          <section>
            <h3>{tr(t.built)}</h3>
            <ul className="built">{p.built.map((b) => <li key={b.en}>{tr(b)}</li>)}</ul>
          </section>
        </div>

        {shots.length > 0 && (
          <section className="cs-shots">
            <h3>{tr(t.shots)}</h3>
            <div className="shots">
              {shots.map((s) => (
                <figure key={s.src} className={s.portrait ? 'tall' : ''}>
                  {s.type === 'video' ? (
                    <video src={s.src} poster={s.poster} controls preload="none" playsInline />
                  ) : (
                    <button onClick={() => setZoom(s.src)} aria-label={tr(s.caption)}>
                      <img src={s.src} alt={tr(s.caption)} loading="lazy" />
                    </button>
                  )}
                  <figcaption>{tr(s.caption)}</figcaption>
                </figure>
              ))}
            </div>
            <p className="note">{tr(t.redacted)}</p>
          </section>
        )}

        <footer className="cs-foot">
          <button className="btn ghost" onClick={() => onGo(prev.id)}><span className="flip"><Arrow /></span>{tr(t.prev)}: {tr(prev.title)}</button>
          <button className="btn ghost" onClick={() => onGo(next.id)}>{tr(t.next)}: {tr(next.title)}<Arrow /></button>
        </footer>
      </div>
      {zoom && (
        <div className="lightbox" onClick={(e) => { e.stopPropagation(); setZoom(null) }}>
          <img src={zoom} alt="" />
        </div>
      )}
    </div>
  )
}

export default function Pro() {
  const [lang, setLang] = useState<Lang>(() => (new URLSearchParams(location.search).get('lang') === 'ar' ? 'ar' : 'en'))
  const [open, setOpen] = useState<string | null>(() => {
    const o = new URLSearchParams(location.search).get('open')
    return o && byId[o] ? o : null
  })
  const [filter, setFilter] = useState<string>('all')
  const [active, setActive] = useState<string | null>(null)
  const [gl] = useState(() => webglOk() && !new URLSearchParams(location.search).has('nomap'))
  const tr = useMemo(() => text(lang), [lang])
  const val = useMemo(() => figure(lang), [lang])
  const org = tr(person.org).replace(/-/g, String.fromCharCode(0x2011))

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.title = `${person.name[lang]} · ${person.title[lang]}`
  }, [lang])

  const layers = useMemo(() => layerOrder.map((id) => ({ id, items: inChapter(id) })), [])
  const list = useMemo(() => (filter === 'all' ? experienceOrder.flatMap(inChapter) : inChapter(filter)), [filter])
  const showLayer = useCallback((id: string) => {
    setFilter(id)
    document.getElementById('index')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])
  const close = useCallback(() => setOpen(null), [])

  return (
    <>
      <header className="bar">
        <a className="mark" href="#top">{tr(person.name)}</a>
        <nav aria-label="Sections">
          <a href="#results">{tr(t.navResults)}</a>
          <a href="#experience">{tr(t.navExperience)}</a>
          <a href="#work">{tr(t.navWork)}</a>
          <a href="#timeline">{tr(t.navTimeline)}</a>
          <a href="#skills">{tr(t.navSkills)}</a>
        </nav>
        <div className="bar-end">
          <button className="btn ghost" onClick={() => setLang(lang === 'en' ? 'ar' : 'en')} lang={lang === 'en' ? 'ar' : 'en'}>{lang === 'en' ? 'عربي' : 'English'}</button>
          <button className="btn" onClick={() => window.print()}>{tr(t.print)}</button>
        </div>
      </header>

      <main id="top">
        {/* ───────── hero */}
        <section className="hero wrap">
          <div className="hero-text">
            <p className="label">{tr(t.eyebrow)}</p>
            <div className="who">
              {portrait && <img src={portrait} alt="" width="88" height="88" />}
              <div>
                <h1>{tr(person.name)}</h1>
                <p className="role">{tr(person.title)}</p>
              </div>
            </div>
            <p className="lede">{tr(person.sub)}</p>
            <dl className="facts">
              <div><dt>{tr(t.employer)}</dt><dd>{org}</dd></div>
              <div><dt>{tr(t.based)}</dt><dd>{tr(contact.location)}</dd></div>
              <div><dt>{tr(t.education)}</dt><dd>{tr(t.educationValue)}</dd></div>
            </dl>
            <div className="actions">
              <a className="btn" href="#work">{tr(t.viewWork)}<Arrow /></a>
              <button className="btn ghost" onClick={() => window.print()}>{tr(t.print)}</button>
            </div>
          </div>

          <aside className="map" aria-label={tr(t.mapTitle)}>
            <div className="map-head">
              <p className="label">{tr(t.mapTitle)}</p>
              <p className="note">{tr(t.mapNote)}</p>
            </div>
            <div className="map-body">
              {gl && (
                <div className="map-canvas" dir="ltr">
                  <Suspense fallback={null}>
                    <StackMap layers={layers} active={active} onActive={setActive} onLayer={showLayer} onProject={setOpen} label={(p) => tr(p.title)} />
                  </Suspense>
                </div>
              )}
              <ol className="legend" reversed>
                {[...layerOrder].reverse().map((id) => {
                  const c = chById[id]
                  return (
                    <li key={id}>
                      <button
                        className={active === id ? 'on' : ''}
                        onMouseEnter={() => setActive(id)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(id)}
                        onBlur={() => setActive(null)}
                        onClick={() => showLayer(id)}
                      >
                        <span className="n">{num(layerOrder.indexOf(id) + 1)}</span>
                        <span className="name">{tr(c.title)}</span>
                        <span className="count">{inChapter(id).length}</span>
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>
          </aside>
        </section>

        {/* ───────── results */}
        <section id="results" className="band">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-n">01</span>
              <h2>{tr(t.resultsTitle)}</h2>
              <p className="note">{tr(t.resultsNote)}</p>
            </div>
            <dl className="figures">
              {impact.map((m) => (
                <div key={m.label.en}>
                  <dt>{m.text ? tr(m.text) : val(`${m.value.toLocaleString('en-US')}${m.suffix ?? ''}`)}</dt>
                  <dd>{tr(m.label)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ───────── experience */}
        <section id="experience" className="wrap sec">
          <div className="sec-head">
            <span className="sec-n">02</span>
            <h2>{tr(t.experienceTitle)}</h2>
          </div>
          <div className="roles">
            {experienceOrder.map((id) => {
              const c = chById[id]
              return (
                <article key={id} className="role-row">
                  <p className="when">{tr(c.period)}</p>
                  <div className="what">
                    <h3>{tr(c.role)}</h3>
                    <p className="area">{tr(c.title)}</p>
                    <p>{tr(c.blurb)}</p>
                    <button className="link" onClick={() => showLayer(id)}>{tr(t.seeWork)} ({inChapter(id).length})<Arrow /></button>
                  </div>
                  <dl className="mini">
                    {c.stats.map((s) => (
                      <div key={s.label.en}><dt>{val(s.value)}</dt><dd>{tr(s.label)}</dd></div>
                    ))}
                  </dl>
                </article>
              )
            })}
          </div>
        </section>

        {/* ───────── work */}
        <section id="work" className="band">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-n">03</span>
              <h2>{tr(t.workTitle)}</h2>
            </div>

            <h3 className="sub">{tr(t.featuredTitle)}</h3>
            <div className="cards">
              {featured.map((id) => {
                const p = byId[id]
                return (
                  <button key={id} className="card" onClick={() => setOpen(id)}>
                    <span className="label">{tr(chById[p.chapter].title)}</span>
                    <span className="card-title">{tr(p.title)}</span>
                    <span className="card-tag">{tr(p.tag)}</span>
                    <span className="card-metrics">
                      {p.impact.slice(0, 2).map((m) => (
                        <span key={m.value}><b>{val(m.value)}</b>{tr(m.label)}</span>
                      ))}
                    </span>
                    <span className="card-go">{tr(t.read)}<Arrow /></span>
                  </button>
                )
              })}
            </div>

            <h3 className="sub">{tr(t.screensTitle)}</h3>
            <div className="screens">
              {screens.map((id) => {
                const p = byId[id]
                const s = media[id]?.find((x) => x.type === 'img' && !x.portrait)
                if (!s) return null
                return (
                  <button key={id} className="screen" onClick={() => setOpen(id)}>
                    <img src={s.src} alt={tr(s.caption)} loading="lazy" />
                    <span className="card-title">{tr(p.title)}</span>
                    <span className="card-tag">{tr(s.caption)}</span>
                  </button>
                )
              })}
            </div>
            <p className="note">{tr(t.redacted)}</p>

            <div id="index" className="index-head">
              <h3 className="sub">{tr(t.indexTitle)}</h3>
              <div className="filters" role="tablist">
                <button role="tab" aria-selected={filter === 'all'} className={filter === 'all' ? 'on' : ''} onClick={() => setFilter('all')}>{tr(t.all)} <i>{projects.length}</i></button>
                {experienceOrder.map((id) => (
                  <button key={id} role="tab" aria-selected={filter === id} className={filter === id ? 'on' : ''} onClick={() => setFilter(id)}>
                    {tr(chById[id].title)} <i>{inChapter(id).length}</i>
                  </button>
                ))}
              </div>
            </div>
            <div className="index" role="table">
              <div className="index-row index-cols" role="row">
                <span role="columnheader">#</span>
                <span role="columnheader">{tr(t.colWork)}</span>
                <span role="columnheader">{tr(t.colArea)}</span>
                <span role="columnheader">{tr(t.colResult)}</span>
                <span />
              </div>
              {list.map((p, i) => (
                <button key={p.id} className="index-row" role="row" onClick={() => setOpen(p.id)}>
                  <span className="n">{num(i + 1)}</span>
                  <span className="w">
                    <b>{tr(p.title)}</b>
                    <em>{tr(p.tag)}</em>
                  </span>
                  <span className="a">{tr(chById[p.chapter].title)}</span>
                  <span className="r"><b>{val(p.impact[0].value)}</b> {tr(p.impact[0].label)}</span>
                  <span className="go">{media[p.id] && <i className="tagged">{tr(t.withScreens)}</i>}<Arrow /></span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── timeline */}
        <section id="timeline" className="wrap sec">
          <div className="sec-head">
            <span className="sec-n">04</span>
            <h2>{tr(t.timelineTitle)}</h2>
          </div>
          <ol className="tl">
            {timeline.map((e) => (
              <li key={e.what.en}>
                <time>{tr(e.when)}</time>
                <p>{tr(e.what)}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ───────── skills */}
        <section id="skills" className="band">
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-n">05</span>
              <h2>{tr(t.skillsTitle)}</h2>
            </div>
            <div className="skills">
              {skills.map((g) => (
                <div key={g.title.en}>
                  <h3>{tr(g.title)}</h3>
                  <ul>{g.items.map((x) => <li key={x.en}>{tr(x)}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── contact */}
        <section id="contact" className="wrap sec contact">
          <div className="sec-head">
            <span className="sec-n">06</span>
            <h2>{tr(t.contactTitle)}</h2>
          </div>
          <div className="contact-body">
            <p className="lede">{tr(t.contactBody)}</p>
            <dl className="facts">
              <div><dt>{tr(t.employer)}</dt><dd>{org}</dd></div>
              <div><dt>{tr(t.based)}</dt><dd>{tr(contact.location)}</dd></div>
              {contact.email && <div><dt>Email</dt><dd><a href={`mailto:${contact.email}`}>{contact.email}</a></dd></div>}
              {contact.linkedin && <div><dt>LinkedIn</dt><dd><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></dd></div>}
            </dl>
          </div>
        </section>
      </main>

      <footer className="foot wrap">
        <span>{tr(person.name)} · {tr(person.title)}</span>
        <span className="foot-links">
          <a href={u('story.html')}>{tr(t.story)}</a>
          <a href={u('game.html')}>{tr(t.game)}</a>
          <a href={u('tree.html')}>{tr(t.tree)}</a>
          <a href="#top">{tr(t.top)}</a>
        </span>
      </footer>

      {open && <CaseStudy id={open} list={list.some((p) => p.id === open) ? list : projects} tr={tr} val={val} onClose={close} onGo={setOpen} />}
    </>
  )
}
