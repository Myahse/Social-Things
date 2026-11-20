/*
 * The image shared from the Avatar view (ported from ArtSyde, in the SOCIAL THINGS style): the mannequin
 * front and back, the product name, price and sizes, and the link to the product. Loaded on demand.
 */

/** Shares a file with the system sheet (WhatsApp, Instagram…) where it can, else downloads it. */
export async function shareOrDownload(blob: Blob, name: string, text: string): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], name, { type: blob.type })
  if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
    }
  }
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name })
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
  return 'downloaded'
}

/** A transparent render cut around what it shows (a small margin, at the panel's `aspect` w/h). */
async function cropToSubject(blob: Blob, aspect: number): Promise<ImageBitmap> {
  const img = await createImageBitmap(blob)
  const sw = 160
  const sh = Math.max(1, Math.round((160 * img.height) / img.width))
  const probe = Object.assign(document.createElement('canvas'), { width: sw, height: sh }).getContext('2d', {
    willReadFrequently: true,
  })!
  probe.drawImage(img, 0, 0, sw, sh)
  const a = probe.getImageData(0, 0, sw, sh).data
  let x0 = sw
  let y0 = sh
  let x1 = -1
  let y1 = -1
  for (let y = 0; y < sh; y++)
    for (let x = 0; x < sw; x++)
      if (a[(y * sw + x) * 4 + 3] > 30) {
        x0 = Math.min(x0, x)
        x1 = Math.max(x1, x)
        y0 = Math.min(y0, y)
        y1 = Math.max(y1, y)
      }
  if (x1 < 0) return img
  const k = img.width / sw
  let h = (y1 - y0 + 1) * k * 1.12
  let w = (x1 - x0 + 1) * k * 1.12
  if (w / h < aspect) w = h * aspect
  else h = w / aspect
  const cx = ((x0 + x1 + 1) / 2) * k
  const cy = ((y0 + y1 + 1) / 2) * k
  const out = Object.assign(document.createElement('canvas'), { width: Math.round(w), height: Math.round(h) })
  out.getContext('2d')!.drawImage(img, cx - w / 2, cy - h / 2, w, h, 0, 0, w, h)
  img.close()
  return createImageBitmap(out)
}

const INK = '#0a0a0a'
const CANVAS = '#f2f2f2'
const MUTED = '#666666'

/** A slanted black box with white text (the site's tag / title look). */
function slashBox(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, padX: number, padY: number) {
  ctx.font = `${size}px Youth, system-ui, sans-serif`
  const w = ctx.measureText(text).width + padX * 2
  const h = size + padY * 2
  ctx.save()
  ctx.translate(x, y)
  ctx.transform(1, 0, -0.22, 1, 0, 0) // skewX(-12deg)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(8, 8, w, h) // the white offset shadow
  ctx.fillStyle = INK
  ctx.fillRect(0, 0, w, h)
  ctx.restore()
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x + padX - size * 0.1, y + h / 2)
  return w
}

export interface WornShareCardInput {
  front: Blob
  back: Blob
  frontLabel: string
  backLabel: string
  title: string
  price: string
  sizes: string
  link: string
}

export async function wornShareCard(o: WornShareCardInput): Promise<Blob> {
  const W = 1080
  const H = 1350
  const M = 48
  const G = 24
  const c = Object.assign(document.createElement('canvas'), { width: W, height: H })
  const ctx = c.getContext('2d')
  if (!ctx) throw new Error('canvas too large')
  const [front, back] = await Promise.all([cropToSubject(o.front, 0.8), cropToSubject(o.back, 0.8)])
  await document.fonts?.ready

  // Page: canvas grey with the site's thin diagonal stripes.
  ctx.fillStyle = CANVAS
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = 'rgba(10,10,10,0.05)'
  ctx.lineWidth = 2
  for (let d = -H; d < W; d += 22) {
    ctx.beginPath()
    ctx.moveTo(d, H)
    ctx.lineTo(d + H, 0)
    ctx.stroke()
  }

  slashBox(ctx, 'SOCIAL THINGS', M + 6, M, 26, 22, 12)

  // Front and back, side by side, in ink-bordered panels with the hard offset shadow.
  const top = M + 90
  const pw = (W - 2 * M - G) / 2
  const ph = Math.round(pw * 1.25)
  ;([
    [front, o.frontLabel],
    [back, o.backLabel],
  ] as const).forEach(([img, label], i) => {
    const x = M + i * (pw + G)
    ctx.fillStyle = INK
    ctx.fillRect(x + 10, top + 10, pw, ph)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(x, top, pw, ph)
    const k = Math.min(pw / img.width, ph / img.height)
    ctx.drawImage(img, x + (pw - img.width * k) / 2, top + (ph - img.height * k) / 2, img.width * k, img.height * k)
    ctx.lineWidth = 6
    ctx.strokeStyle = INK
    ctx.strokeRect(x, top, pw, ph)
    slashBox(ctx, label, x + 22, top + 20, 22, 16, 9)
  })
  front.close()
  back.close()

  // Name, price and sizes.
  const y = top + ph + 64
  slashBox(ctx, o.title.toUpperCase(), M + 8, y, 64, 28, 14)
  ctx.fillStyle = INK
  ctx.textBaseline = 'alphabetic'
  ctx.font = '44px Youth, system-ui, sans-serif'
  ctx.fillText(o.price, M, y + 170)
  ctx.fillStyle = MUTED
  ctx.font = '26px Youth, system-ui, sans-serif'
  ctx.fillText(o.sizes, M, y + 220, W - 2 * M)

  // The address, in a black bar at the bottom.
  const barH = 88
  ctx.fillStyle = INK
  ctx.fillRect(M, H - M - barH, W - 2 * M, barH)
  ctx.fillStyle = '#ffffff'
  ctx.font = '30px Youth, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(o.link.replace(/^https?:\/\/(www\.)?/, ''), W / 2, H - M - barH / 2, W - 2 * M - 40)

  const out = await new Promise<Blob | null>((r) => c.toBlob(r, 'image/png'))
  if (!out) throw new Error('canvas too large')
  return out
}
