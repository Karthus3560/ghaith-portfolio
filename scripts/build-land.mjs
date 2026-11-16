// Builds public/land.bin: evenly spaced points on land (lon, lat as Int16 hundredths of a degree)
// for the dotted globe in the story edition. Source: Natural Earth via the world-atlas package (public domain).
import { readFileSync, writeFileSync } from 'node:fs'
import { feature } from 'topojson-client'
import { geoEquirectangular, geoPath } from 'd3-geo'
import sharp from 'sharp'

const topo = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'))
const land = feature(topo, topo.objects.land)
const W = 3600, H = 1800
const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2])
const d = geoPath(proj)(land)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="#000"/><path d="${d}" fill="#fff"/></svg>`
const { data } = await sharp(Buffer.from(svg), { limitInputPixels: false }).greyscale().raw().toBuffer({ resolveWithObject: true })
const isLand = (lon, lat) => data[Math.min(H - 1, Math.floor(((90 - lat) / 180) * H)) * W + Math.min(W - 1, Math.floor(((lon + 180) / 360) * W))] > 127

const STEP = 0.62
const out = []
let row = 0
for (let lat = -58; lat <= 84; lat += STEP, row++) {
  const n = Math.max(1, Math.round((360 * Math.cos((lat * Math.PI) / 180)) / STEP))
  for (let k = 0; k < n; k++) {
    const lon = -180 + ((k + (row % 2) * 0.5) * 360) / n
    if (isLand(lon, lat)) out.push(Math.round(lon * 100), Math.round(lat * 100))
  }
}
writeFileSync('public/land.bin', Buffer.from(new Int16Array(out).buffer))
console.log('land points', out.length / 2)
