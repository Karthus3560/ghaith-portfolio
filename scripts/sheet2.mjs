// contact sheet of a screenshot folder: node scripts/sheet2.mjs dir out.jpg [cols] [cellW] [cellH]
import sharp from 'sharp'
import { readdirSync } from 'node:fs'
const [dir, out, cols = '3', cw = '640', ch = '400'] = process.argv.slice(2)
const files = readdirSync(dir).filter((f) => f.endsWith('.jpg')).sort()
const C = +cols, W = +cw, H = +ch, rows = Math.ceil(files.length / C)
const imgs = await Promise.all(files.map((f) => sharp(`${dir}/${f}`).resize(W, H, { fit: 'contain', background: '#222' }).toBuffer()))
await sharp({ create: { width: C * (W + 6) + 6, height: rows * (H + 6) + 6, channels: 3, background: '#555' } })
  .composite(imgs.map((b, i) => ({ input: b, left: 6 + (i % C) * (W + 6), top: 6 + Math.floor(i / C) * (H + 6) })))
  .jpeg({ quality: 82 }).toFile(out)
