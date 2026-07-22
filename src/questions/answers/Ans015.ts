import { context2d } from '@/lib/canvas'
import { createThreeCanvasAnswer } from '../base'

export default createThreeCanvasAnswer(() => {
  const main = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const verticalKernel = [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1],
    ]
    const sideKernel = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ]
    sovelFilter(canvas1, image, verticalKernel)
    sovelFilter(canvas2, image, sideKernel)
  }

  const sovelFilter = (canvas: HTMLCanvasElement, image: HTMLImageElement, kernel: number[][]) => {
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    const getIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }
    const kernelSize = kernel.length

    for (let x = 0; x < canvas.width; x++)
      for (let y = 0; y < canvas.height; y++) {
        let k = 0
        for (let c = 0; c < 3; c++) {
          for (let i = 0; i < kernelSize; i++)
            for (let j = 0; j < kernelSize; j++) {
              const _i = i - Math.floor(kernelSize / 2)
              const _j = j - Math.floor(kernelSize / 2)
              k += kernel[i][j] * src.data[getIndex(x + _j, y + _i, c)]
            }
        }
        dst.data[getIndex(x, y, 0)] = k
        dst.data[getIndex(x, y, 1)] = k
        dst.data[getIndex(x, y, 2)] = k
        dst.data[getIndex(x, y, 3)] = 255
      }
    ctx.putImageData(dst, 0, 0)
  }

  return { main }
})
