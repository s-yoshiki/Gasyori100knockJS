import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'

export default createTwoCanvasAnswer(
  () => {
    const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      const ctx = context2d(canvas)
      ctx.drawImage(image, 0, 0, image.width, image.height)
      const src = ctx.getImageData(0, 0, image.width, image.height)
      const dst = ctx.createImageData(image.width, image.height)

      const c = 1.0
      const g = 2.2

      for (let i = 0; i < src.data.length; i += 4) {
        for (let n = 0; n < 3; n++) {
          let p = src.data[i + n]
          p /= 255
          p = ((1 / c) * p) ** (1 / g)
          p *= 255
          dst.data[i + n] = p
        }
        dst.data[i + 3] = 255
      }
      ctx.putImageData(dst, 0, 0)
    }

    return { main }
  },
  { imageUrl: config.srcImage.gamma },
)
