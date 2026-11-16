// usage: node scripts/sheet.mjs out.jpg cols tileW file1 file2 ...
import sharp from 'sharp'
const [out, cols, tw, ...files] = process.argv.slice(2)
const C = +cols, W = +tw, H = Math.round(W * (+process.env.RATIO || 0.66))
const tiles = []
for (let i = 0; i < files.length; i++) {
  try {
    const img = await sharp(files[i]).resize(W, H, { fit: 'contain', background: '#222' }).jpeg({ quality: 70 }).toBuffer()
    const label = Buffer.from(`<svg width="${W}" height="26"><rect width="100%" height="100%" fill="#000"/><text x="6" y="19" font-size="18" fill="#ff0" font-family="Arial">${i}</text></svg>`)
    tiles.push({ input: img, left: (i % C) * W, top: Math.floor(i / C) * H }, { input: label, left: (i % C) * W, top: Math.floor(i / C) * H })
  } catch (e) { console.log('FAIL', i, files[i], e.message) }
}
await sharp({ create: { width: C * W, height: Math.ceil(files.length / C) * H, channels: 3, background: '#111' } }).composite(tiles).jpeg({ quality: 72 }).toFile(out)
console.log('ok', out)
