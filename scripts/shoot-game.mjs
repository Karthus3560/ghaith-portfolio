// Playtest screenshots of the game edition. usage: node scripts/shoot-game.mjs outDir [width height] [query]
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'
const [out, w = '1440', h = '900', query = ''] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-position=-2400,0'] })
const page = await browser.newPage({ viewport: { width: +w, height: +h }, hasTouch: +w < 700, isMobile: +w < 700 })
page.on('pageerror', (e) => console.log('PAGEERROR', e.message))
page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()))
await page.goto('http://localhost:5199/game.html' + query)
await page.waitForTimeout(4000)
const snap = async (name) => { await page.screenshot({ path: `${out}/${name}.jpg`, quality: 85 }); console.log(name) }
const wait = (ms) => page.waitForTimeout(ms)
await snap('01-start')
await page.click('.start .btn')
await wait(1500); await snap('02-plaza')
// drive north to the ward
await page.keyboard.down('KeyW'); await wait(2600); await snap('03-driving')
await wait(1500); await page.keyboard.up('KeyW'); await wait(900); await snap('04-ward')
console.log('car', JSON.stringify(await page.evaluate(() => { const c = window.__game.car; return { x: +c.x.toFixed(1), z: +c.z.toFixed(1), y: +c.y.toFixed(2) } })))
// visit each district from the plaza side
const D = 102, n = 7
for (let i = 1; i < n; i++) {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
  await page.evaluate(([x, z, yaw]) => window.__game.go(x, z, yaw), [Math.cos(a) * (D - 34), Math.sin(a) * (D - 34), Math.atan2(Math.cos(a), Math.sin(a))])
  await wait(1700); await snap(`1${i}-district`)
}
// open a beacon card
const b = await page.evaluate(() => { const b = window.__game.beacons.find((x) => x.id === 'satisfaction'); return [b.x, b.z] })
await page.evaluate(([x, z]) => window.__game.go(x - 1, z + 1, 0.6), b)
await wait(1200); await snap('20-prompt')
await page.keyboard.press('KeyE'); await wait(900); await snap('21-card')
await page.keyboard.press('KeyE'); await wait(300)
// the bridge and a jump
const azu = -Math.PI / 2 + (5 * 2 * Math.PI) / n
await page.evaluate(([x, z]) => window.__game.go(x - 26, z, Math.PI / 2), [Math.cos(azu) * D, Math.sin(azu) * D])
await wait(600); await page.keyboard.down('KeyW'); await wait(1700); await snap('22-bridge'); await page.keyboard.up('KeyW')
await page.evaluate(() => window.__game.go(-6, 11, Math.PI / 2))
await wait(500); await page.keyboard.down('KeyW'); await page.keyboard.down('ShiftLeft'); await wait(1750); await snap('23-jump'); await page.keyboard.up('KeyW'); await page.keyboard.up('ShiftLeft')
await page.evaluate(() => window.__game.go(-2, -1, 1.9))
await wait(400); await page.keyboard.down('KeyW'); await wait(900); await page.keyboard.up('KeyW'); await wait(500); await snap('24-ball')
console.log('score', await page.evaluate(() => document.querySelector('.score')?.textContent))
await browser.close()
