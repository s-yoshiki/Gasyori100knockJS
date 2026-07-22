import { context2d } from '@/lib/canvas'
import type { KernelCallback, Pixels } from '@/lib/pixels'
import { createThreeCanvasAnswer } from '../base'

export default createThreeCanvasAnswer(() => {
  const main = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const ctx1 = context2d(canvas1)
    const ctx2 = context2d(canvas2)
    const width = image.width
    const height = image.height
    // canvas1.width = canvas2.width = width
    // canvas1.height = canvas2.height = height
    const kernel = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]
    ctx1.drawImage(image, 0, 0, width, height)
    ctx2.drawImage(image, 0, 0, width, height)
    const src1 = ctx1.getImageData(0, 0, width, height)
    const dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    const src2 = ctx2.getImageData(0, 0, width, height)
    const dst2 = ctx2.createImageData(canvas2.width, canvas2.height)
    const bin = new Array(width * height).fill(0)
    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      const c = rgb2hsv([src1.data[i], src1.data[i + 1], src1.data[i + 2]])
      if (180 <= c[0] && c[0] <= 260) {
        bin[j] = 255
      }
    }
    const morphologyTime = 3
    const mor = bin.slice()
    for (let i = 0; i < morphologyTime; i++) {
      adaptKernel(mor.slice(), mor, image.width, image.height, kernel, (e: number) => {
        if (e >= 255) return 255
      })
    }
    for (let i = 0; i < morphologyTime; i++) {
      adaptKernel(mor.slice(), mor, image.width, image.height, kernel, (e: number) => {
        if (e < 255 * 4) return 0
      })
    }
    for (let i = 0; i < morphologyTime; i++) {
      adaptKernel(mor.slice(), mor, image.width, image.height, kernel, (e: number) => {
        if (e < 255 * 4) return 0
      })
    }
    for (let i = 0; i < morphologyTime; i++) {
      adaptKernel(mor.slice(), mor, image.width, image.height, kernel, (e: number) => {
        if (e >= 255) return 255
      })
    }

    for (let i = 0, j = 0; i < src2.data.length; i += 4, j++) {
      if (mor[j] === 0) {
        dst2.data[i] = src2.data[i]
        dst2.data[i + 1] = src2.data[i + 1]
        dst2.data[i + 2] = src2.data[i + 2]
      } else {
        dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = 0
      }
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = mor[j]
      dst1.data[i + 3] = 255
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)
    ctx1.putImageData(dst1, 0, 0)
  }

  const rgb2hsv = (rgb: number[]) => {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0

    switch (min) {
      case max:
        h = 0
        break
      case r:
        h = 60 * ((b - g) / diff) + 180
        break
      case g:
        h = 60 * ((r - b) / diff) + 300
        break
      case b:
        h = 60 * ((g - r) / diff) + 60
        break
    }

    const s = max == 0 ? 0 : diff / max
    const v = max

    return [h, s, v]
  }

  const adaptKernel = (
    src: Pixels,
    dst: number[],
    imgWidth: number,
    imgHeight: number,
    kernel: number[][],
    callback: KernelCallback | null = null,
  ) => {
    const getIndex = (x: number, y: number) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernelSize = kernel.length
    const d = Math.floor(kernelSize / 2)
    for (let x = 0; x < imgWidth; x++)
      for (let y = 0; y < imgHeight; y++) {
        let k = 0
        for (let i = 0; i < kernelSize; i++)
          for (let j = 0; j < kernelSize; j++) {
            const _i = i - d
            const _j = j - d
            const srcIdx = getIndex(x + _j, y + _i)
            k += kernel[i][j] * src[srcIdx]
          }
        const dstIdx = getIndex(x, y)
        if (callback != null) {
          const applied = callback(k)
          if (applied !== undefined) {
            dst[dstIdx] = applied
          }
        } else {
          dst[dstIdx] = k
        }
      }
  }

  return { main }
})
