// QA screenshots of the professional edition. usage: node scripts/shoot-pro.mjs outDir [width height] [query]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const [out, w = '1440', h = '900', query = ''] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-position=-2400,0'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h } })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
await page.goto('http://localhost:5199/' + query)
await page.waitForTimeout(3500)
const snap = async (name) => { await page.screenshot({ path: `${out}/${name}.jpg`, quality: 82 }); console.log(name) }
await snap('01-hero')
if (+w > 900) {
  await page.hover('.legend li:nth-child(5) button')
  await page.waitForTimeout(1200)
  await snap('02-map-hover')
  await page.mouse.move(5, 5)
}
let i = 3
for (const id of ['results', 'experience', 'work', 'index', 'timeline', 'skills', 'contact']) {
  await page.evaluate((id) => { const e = document.getElementById(id); window.scrollTo({ top: e.getBoundingClientRect().top + scrollY - 70, behavior: 'instant' }) }, id)
  await page.waitForTimeout(500)
  await snap(String(i++).padStart(2, '0') + '-' + id)
}
await page.evaluate(() => document.querySelectorAll('.screen')[1].click())
await page.waitForTimeout(900)
await snap('20-case')
await page.evaluate(() => document.querySelector('.cs').scrollTo(0, 9999))
await page.waitForTimeout(700)
await snap('21-case-end')
console.log('scrollWidth', await page.evaluate(() => document.documentElement.scrollWidth))
await browser.close()
