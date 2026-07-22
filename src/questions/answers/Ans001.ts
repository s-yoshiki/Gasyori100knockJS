import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      dst.data[i] = src.data[i + 2]
      dst.data[i + 1] = src.data[i + 1]
      dst.data[i + 2] = src.data[i]
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }

  return { main }
})
