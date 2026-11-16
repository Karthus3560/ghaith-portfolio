import { chromium } from 'playwright-core'
const browser = await chromium.launch({ channel: 'chrome', headless: false, args: ['--window-position=-2400,0'] })
for (const p of ['', 'story.html', 'game.html', 'tree.html']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const bad = []
  page.on('response', (r) => r.status() >= 400 && bad.push(r.status() + ' ' + r.url()))
  page.on('pageerror', (e) => bad.push('ERR ' + e.message))
  await page.goto('https://karthus3560.github.io/ghaith-portfolio/' + p)
  await page.waitForTimeout(4000)
  console.log(p || 'index', bad.length ? bad : 'ok', '|', await page.title())
  await page.close()
}
await browser.close()
