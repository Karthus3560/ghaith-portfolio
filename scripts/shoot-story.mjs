// QA screenshots of the story edition. usage: node scripts/shoot-story.mjs outDir [width height] [query]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const [out, w = '1440', h = '900', query = ''] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-position=-2400,0'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
await page.goto('http://localhost:5199/story.html' + query)
await page.waitForTimeout(3500)
const snap = async (name) => { await page.screenshot({ path: `${out}/${name}.jpg`, quality: 85 }); console.log(name) }
const to = async (y) => { await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y); await page.waitForTimeout(2600) }
const mid = (id, k = 0.5) => page.evaluate(([id, k]) => { const e = document.querySelector(`[data-scene="${id}"]`); return e.offsetTop + (e.offsetHeight - innerHeight) * k }, [id, k])
await snap('01-hero')
await to(await mid('night')); await snap('02-night')
await to(await mid('records', 0.18)); await snap('03-records-a')
await to(await mid('records', 0.6)); await snap('04-records-b')
await to((await mid('records', 0.6) + await mid('globe')) / 2 + 150); await snap('05-morph')
await to(await mid('globe')); await snap('06-globe')
await to(await mid('hr')); await snap('07-hr')
await to(await mid('seal')); await snap('08-seal')
await to(await mid('bridge')); await snap('09-bridge')
const solid = await page.evaluate(() => document.querySelector('.solid').offsetTop)
await to(solid + 60); await snap('10-proof')
await to(await page.evaluate(() => document.querySelectorAll('.block')[1].offsetTop + document.querySelector('.solid').offsetTop - 40)); await snap('11-all')
await to(await mid('portrait')); await snap('12-portrait')
console.log('scrollWidth', await page.evaluate(() => document.documentElement.scrollWidth))
await browser.close()
