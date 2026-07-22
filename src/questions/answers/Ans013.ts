import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b

    const getIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const kernelSize = 3

    for (let x = 0; x < canvas.width; x++)
      for (let y = 0; y < canvas.height; y++) {
        const k = []
        for (let i = 0; i < kernelSize; i++)
          for (let j = 0; j < kernelSize; j++) {
            const _i = i - Math.floor(kernelSize / 2)
            const _j = j - Math.floor(kernelSize / 2)
            const r = src.data[getIndex(x + _j, y + _i, 0)]
            const g = src.data[getIndex(x + _j, y + _i, 1)]
            const b = src.data[getIndex(x + _j, y + _i, 2)]
            k.push(Math.trunc(grayscale(r, g, b)))
          }

        k.sort((a, b) => a - b)
        const c = Math.abs(k[0] - k[k.length - 1])

        dst.data[getIndex(x, y, 0)] = c
        dst.data[getIndex(x, y, 1)] = c
        dst.data[getIndex(x, y, 2)] = c
        dst.data[getIndex(x, y, 3)] = 255
      }
    ctx.putImageData(dst, 0, 0)
  }

  return { main }
})
