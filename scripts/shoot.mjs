// QA screenshots of the running dev server using the locally installed Chrome.
// usage: node scripts/shoot.mjs outDir [width height] [query]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const [out, w = '1440', h = '900', query = ''] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-position=-2400,0'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
await page.goto('http://localhost:5199/tree.html' + query)
await page.waitForTimeout(6000)
const snap = async (name) => { await page.screenshot({ path: `${out}/${name}.jpg`, quality: 80 }); console.log(name) }
await snap('01-hero')
const views = ['impact', 'nursing', 'dhmc', 'hr', 'academy', 'aha', 'azu', 'lab', 'timeline', 'skills', 'contact']
let i = 2
for (const v of views) {
  await page.evaluate((v) => { const e = document.querySelector(`[data-view="${v}"]`); window.scrollTo({ top: e.offsetTop + Math.max(0, (e.offsetHeight - innerHeight) / 2), behavior: 'instant' }) }, v)
  await page.waitForTimeout(2600)
  await snap(String(i++).padStart(2, '0') + '-' + v)
}
await page.evaluate(() => { const e = document.querySelector('[data-view="academy"]'); window.scrollTo({ top: e.offsetTop + 200, behavior: 'instant' }) })
await page.waitForTimeout(1500)
await page.evaluate(() => document.querySelectorAll('[data-view="academy"] .leaves button')[1].click())
await page.waitForTimeout(1800)
await snap('20-panel')
await page.keyboard.press('Escape')
await page.waitForTimeout(600)
if (+w > 900) {
  await page.evaluate(() => [...document.querySelectorAll('.nav .pill')][0].click())
  await page.waitForTimeout(3500)
  await snap('21-explore')
}
await browser.close()
