import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const w = image.width
    const h = image.height
    const dx = w / 16
    const dy = h / 16

    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const blurColor = (x: number, y: number, w: number, h: number) => {
      const ctx = context2d(canvas)
      let r = 0,
        g = 0,
        b = 0

      const src = ctx.getImageData(x, y, w, h)
      const dst = ctx.createImageData(w, h)

      for (let i = 0; i < src.data.length; i += 4) {
        r = src.data[i] > r ? src.data[i] : r
        g = src.data[i + 1] > g ? src.data[i + 1] : g
        b = src.data[i + 2] > b ? src.data[i + 2] : b
      }

      for (let i = 0; i < src.data.length; i += 4) {
        dst.data[i] = r
        dst.data[i + 1] = g
        dst.data[i + 2] = b
        dst.data[i + 3] = 255
      }

      ctx.putImageData(dst, x, y)
    }

    for (let i = 0; i < canvas.width; i += dx) {
      for (let j = 0; j < canvas.height; j += dy) {
        blurColor(i, j, dx, dy)
      }
    }
  }

  return { main }
})
