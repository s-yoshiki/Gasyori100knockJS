import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const getDstIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), image.width - 1)
      y = Math.min(Math.max(y, 0), image.height - 1)
      return y * image.width * 4 + x * 4 + channel
    }

    const getWeight = (t1: number, t2: number) => {
      const d = Math.abs(t1 - t2)
      if (d > 1) {
        return 0
      }
      return 1 - d
    }

    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const src = ctx.getImageData(0, 0, image.width, image.height)

    const scale = 1.5
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    const dst = ctx.createImageData(canvas.width, canvas.height)

    const range = [-1, 0, 1, 2]

    for (let x = 0; x < canvas.width; x++)
      for (let y = 0; y < canvas.height; y++) {
        const _x = x / scale
        const _y = y / scale
        const rangeX = range.map((i) => i + Math.floor(_x))
        const rangeY = range.map((i) => i + Math.floor(_y))
        let r = 0,
          g = 0,
          b = 0

        for (const ry of rangeY)
          for (const rx of rangeX) {
            const weight = getWeight(ry, _y) * getWeight(rx, _x)
            r += src.data[getSrcIndex(~~rx, ~~ry, 0)] * weight
            g += src.data[getSrcIndex(~~rx, ~~ry, 1)] * weight
            b += src.data[getSrcIndex(~~rx, ~~ry, 2)] * weight
          }
        dst.data[getDstIndex(x, y, 0)] = ~~r
        dst.data[getDstIndex(x, y, 1)] = ~~g
        dst.data[getDstIndex(x, y, 2)] = ~~b
        dst.data[getDstIndex(x, y, 3)] = 255
      }
    ctx.putImageData(dst, 0, 0)
  }

  return { main }
})
