import { context2d } from '@/lib/canvas'
import { createThreeCanvasHistogramAnswer } from '../base'
import config from '../images'

export default createThreeCanvasHistogramAnswer(
  ({ renderChart }) => {
    const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      const ctx = context2d(canvas)
      ctx.drawImage(image, 0, 0, image.width, image.height)
      const pixelValues = new Array(256).fill(0)
      const src = ctx.getImageData(0, 0, image.width, image.height)
      const dst = ctx.createImageData(image.width, image.height)

      const zMax = 255
      const S = canvas.width * canvas.height * 3

      const h = new Array(256).fill(0)
      const hSum = new Array(256).fill(0)

      for (let n = 0; n < 3; n++) {
        for (let i = 0; i < src.data.length; i += 4) {
          h[src.data[i + n]]++
        }
      }

      for (let i = 0; i < hSum.length; i++) {
        for (let j = 0; j < i; j++) {
          hSum[i] += h[j]
        }
      }

      for (let i = 0; i < src.data.length; i += 4) {
        for (let n = 0; n < 3; n++) {
          const p = src.data[i + n]
          let v = Math.trunc((zMax / S) * hSum[p])
          if (v > 255) {
            v = 255
          } else if (v < 0) {
            v = 0
          }
          dst.data[i + n] = v
          pixelValues[v]++
        }
        dst.data[i + 3] = 255
      }
      ctx.putImageData(dst, 0, 0)
      renderChart(pixelValues)
    }

    return { main }
  },
  { imageUrl: config.srcImage.default },
)
