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

      const getIndex = (x: number, y: number, channel: number) => {
        x = Math.min(Math.max(x, 0), canvas.width - 1)
        y = Math.min(Math.max(y, 0), canvas.height - 1)
        return y * canvas.width * 4 + x * 4 + channel
      }
      const gaussian = (x: number, y: number, sigma: number) =>
        Math.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2))

      const kernelSize = 3
      const sigma = 1.3
      let w = 0
      const kernel = Array.from(new Array(kernelSize), () => new Array(kernelSize).fill(0))

      for (let y = 0; y < kernelSize; y++)
        for (let x = 0; x < kernelSize; x++) {
          const _x = x - Math.floor(kernelSize / 2)
          const _y = y - Math.floor(kernelSize / 2)
          const g = gaussian(_x, _y, sigma)
          kernel[y][x] = g
          kernel[y][x] /= sigma * Math.sqrt(2 * Math.PI)
          w += kernel[y][x]
        }

      for (let y = 0; y < kernelSize; y++)
        for (let x = 0; x < kernelSize; x++) {
          kernel[y][x] /= w
        }

      for (let x = 0; x < canvas.width; x++)
        for (let y = 0; y < canvas.height; y++) {
          for (let c = 0; c < 3; c++) {
            let k = 0
            for (let i = 0; i < kernelSize; i++)
              for (let j = 0; j < kernelSize; j++) {
                const _i = i - Math.floor(kernelSize / 2)
                const _j = j - Math.floor(kernelSize / 2)
                k += kernel[i][j] * src.data[getIndex(x + _j, y + _i, c)]
              }
            dst.data[getIndex(x, y, c)] = k
          }
          dst.data[getIndex(x, y, 3)] = 255
        }
      ctx.putImageData(dst, 0, 0)
    }

    return { main }
  },
  { imageUrl: config.srcImage.noise },
)
