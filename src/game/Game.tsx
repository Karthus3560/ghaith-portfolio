import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { person, type L } from '../data/content'
import { media } from '../data/media'
import { arValues, chapters, projects } from '../pro/copy'
import { intro, t } from './copy'
import { createGame } from './game'
import { actions, pad, useGame } from './store'
import { ORB_COUNT } from './world'
import { B } from '../base'

const LRI = String.fromCharCode(0x2066)
const PDI = String.fromCharCode(0x2069)
const byId = Object.fromEntries(projects.map((p) => [p.id, p]))
const chById = Object.fromEntries(chapters.map((c) => [c.id, c]))

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function Rich({ text }: { text: string }) {
  return <>{text.split('*').map((part, j) => (j % 2 ? <em key={j}>{part}</em> : <Fragment key={j}>{part}</Fragment>))}</>
}

/** Left-thumb stick for touch screens. */
function Stick() {
  const knob = useRef<HTMLDivElement>(null)
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    let x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2)
    const m = Math.hypot(x, y)
    if (m > 1) { x /= m; y /= m }
    pad.x = Math.abs(x) < 0.15 ? 0 : x
    pad.y = Math.abs(y) < 0.15 ? 0 : -y
    if (knob.current) knob.current.style.transform = `translate(${x * 34}px, ${y * 34}px)`
  }
  const end = () => { pad.x = 0; pad.y = 0; if (knob.current) knob.current.style.transform = '' }
  return (
    <div className="stick" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e) }} onPointerMove={(e) => e.buttons && move(e)} onPointerUp={end} onPointerCancel={end}>
      <div ref={knob} />
    </div>
  )
}

export default function Game() {
  const { lang, started, sound, near, district, open, found, orbs, set } = useGame()
  const [gl] = useState(webglOk)
  const [doneSeen, setDoneSeen] = useState(false)
  const [zoom, setZoom] = useState<string | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const map = useRef<HTMLCanvasElement>(null)

  const tr = useMemo(() => (x: L) => (lang === 'ar' ? x.ar.replace(/(\d[\d,]*–\d[\d,]*)/g, `${LRI}$1${PDI}`) : x.en), [lang])
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
    document.title = `${person.name[lang]} · ${t.edition[lang]}`
  }, [lang])

  useEffect(() => {
    if (!gl || !canvas.current) return
    return createGame(canvas.current, map.current, (lg) => ({ name: person.name[lg], title: person.title[lg], line: t.boardLine[lg] }))
  }, [gl])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopImmediatePropagation(); setZoom(null) } }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [zoom])

  const p = open ? byId[open] : null
  const nearP = near ? byId[near] : null
  const d = district ? chById[district] : null
  const done = found.length === projects.length && orbs === ORB_COUNT
  const q = lang === 'ar' ? '&lang=ar' : ''
  const q1 = lang === 'ar' ? '?lang=ar' : ''
  const shots = p ? media[p.id] ?? [] : []

  if (!gl) {
    return (
      <div className="nogl">
        <p>{tr(t.noGl)}</p>
        <a className="btn" href={`${B}${q1}`}>{tr(t.cv)}</a>
      </div>
    )
  }

  return (
    <>
      <canvas ref={canvas} className="view" />

      <header className="hud-top">
        <div className="who">
          <b>{tr(person.name)}</b>
          <span>{tr(t.edition)}</span>
        </div>
        {started && (
          <div className="score" aria-live="polite">
            <span><b>{val(String(found.length))}</b> / {val(String(projects.length))} {tr(t.found)}</span>
            <span><b>{val((orbs * 1000).toLocaleString('en-US'))}</b> / {val('53,000')} {tr(t.records)}</span>
          </div>
        )}
        <div className="hud-end">
          <button className={`chip${sound ? ' on' : ''}`} onClick={() => set({ sound: !sound })} aria-pressed={sound}>{tr(t.sound)}</button>
          <a className="chip" href={`${B}${q1}`}>{tr(t.cv)}</a>
          <button className="chip" onClick={() => set({ lang: lang === 'en' ? 'ar' : 'en' })} lang={lang === 'en' ? 'ar' : 'en'}>{lang === 'en' ? 'عربي' : 'English'}</button>
        </div>
      </header>

      {started && d && !p && (
        <div className="banner" key={d.id} style={{ '--a': d.color } as React.CSSProperties}>
          <b>{tr(d.title)}</b>
          <span>{tr(intro[d.id])}</span>
        </div>
      )}

      {started && nearP && !p && (
        <button className="prompt" style={{ '--a': chById[nearP.chapter].color } as React.CSSProperties} onClick={() => actions.interact()}>
          <kbd>E</kbd>
          <span>{tr(t.open)}: <b>{tr(nearP.title)}</b></span>
        </button>
      )}

      <canvas ref={map} className={`map${started ? '' : ' off'}`} width={320} height={320} aria-hidden="true" />

      {started && !p && (
        <>
          <ul className="keys">
            <li><kbd>W A S D</kbd>{tr(t.kDrive)}</li>
            <li><kbd>Shift</kbd>{tr(t.kBoost)}</li>
            <li><kbd>Space</kbd>{tr(t.kHonk)}</li>
            <li><kbd>R</kbd>{tr(t.kReset)}</li>
          </ul>
          <div className="touch">
            <Stick />
            <div className="touch-btns">
              <button onPointerDown={() => { pad.boost = true }} onPointerUp={() => { pad.boost = false }} onPointerCancel={() => { pad.boost = false }}>{tr(t.kBoost)}</button>
              <button onClick={() => actions.honk()}>{tr(t.kHonk)}</button>
              <button onClick={() => actions.reset()}>{tr(t.plaza)}</button>
            </div>
          </div>
        </>
      )}

      {!started && (
        <div className="start">
          <div className="start-box">
            <p className="kick">{tr(person.name)} · {tr(t.edition)}</p>
            <h1><Rich text={tr(t.title)} /></h1>
            <p className="lead">{tr(t.lead)}</p>
            <button className="btn" autoFocus onClick={() => set({ started: true })}>{tr(t.start)}</button>
            <ul className="keys inline">
              <li><kbd>W A S D</kbd>{tr(t.kDrive)}</li>
              <li><kbd>Shift</kbd>{tr(t.kBoost)}</li>
              <li><kbd>Space</kbd>{tr(t.kHonk)}</li>
              <li><kbd>E</kbd>{tr(t.kOpen)}</li>
              <li><kbd>R</kbd>{tr(t.kReset)}</li>
            </ul>
            <p className="fine touch-only">{tr(t.touch)}</p>
          </div>
        </div>
      )}

      {p && (
        <aside className="card" style={{ '--a': chById[p.chapter].color } as React.CSSProperties} role="dialog" aria-label={tr(p.title)}>
          <header>
            <span className="tag">{tr(chById[p.chapter].title)}</span>
            <button className="chip" onClick={() => set({ open: null })}>{tr(t.close)} <kbd>E</kbd></button>
          </header>
          <h2>{tr(p.title)}</h2>
          <p className="sub">{tr(p.tag)}</p>
          <dl className="nums">
            {p.impact.map((m) => (
              <div key={m.value}><dt>{val(m.value)}</dt><dd>{tr(m.label)}</dd></div>
            ))}
          </dl>
          <h3>{tr(t.start2)}</h3>
          <p>{tr(p.problem)}</p>
          {shots.length > 0 && (
            <>
              <h3>{tr(t.screens)}</h3>
              <div className="shots">
                {shots.map((s) => (
                  <figure key={s.src} className={s.portrait ? 'tall' : ''}>
                    {s.type === 'video' ? <video src={s.src} poster={s.poster} controls preload="none" playsInline /> : <button onClick={() => setZoom(s.src)}><img src={s.src} alt={tr(s.caption)} loading="lazy" /></button>}
                    <figcaption>{tr(s.caption)}</figcaption>
                  </figure>
                ))}
              </div>
              <p className="fine">{tr(t.redacted)}</p>
            </>
          )}
          <a className="more" href={`${B}?open=${p.id}${q}`}>{tr(t.full)}</a>
        </aside>
      )}

      {done && !doneSeen && (
        <div className="start">
          <div className="start-box">
            <h1>{tr(t.doneTitle)}</h1>
            <p className="lead">{tr(t.doneBody)}</p>
            <div className="row">
              <a className="btn" href={`${B}${q1}`}>{tr(t.cv)}</a>
              <a className="chip" href={`${B}story.html${q1}`}>{tr(t.story)}</a>
              <button className="chip" onClick={() => setDoneSeen(true)}>{tr(t.keep)}</button>
            </div>
          </div>
        </div>
      )}

      {zoom && (
        <div className="lightbox" onClick={() => setZoom(null)}>
          <img src={zoom} alt="" />
        </div>
      )}
    </>
  )
}
