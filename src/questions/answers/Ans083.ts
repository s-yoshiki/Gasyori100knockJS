import { context2d } from '@/lib/canvas'
import type { KernelReduceCallback, Pixels } from '@/lib/pixels'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'

export default createTwoCanvasAnswer(
  () => {
    const main = (canvas1: HTMLCanvasElement, image: HTMLImageElement) => {
      const W = image.width
      const H = image.height
      const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
      const sobely = [
        [1, 2, 1],
        [0, 0, 0],
        [-1, -2, -1],
      ]
      const sobelx = [
        [1, 0, -1],
        [2, 0, -2],
        [1, 0, -1],
      ]
      const k = 0.04
      const th = 0.1
      const gKernel = getGaussianKernel(3, 3)
      const ctx1 = context2d(canvas1)
      ctx1.drawImage(image, 0, 0, image.width, image.height)
      const dst1 = ctx1.createImageData(image.width, image.height)
      const src1 = ctx1.getImageData(0, 0, image.width, image.height)
      const [gray, Ix, Iy, Ix2, Iy2, IxIy, Ix2t, Iy2t, Ixyt, M] = Array.from(new Array(10), () =>
        new Array(H * W).fill(0),
      )
      for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
        const c = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = c
        dst1.data[i + 3] = 255
        gray[j] = c
      }
      ctx1.putImageData(dst1, 0, 0)
      adaptKernel(gray, Iy, W, H, sobely)
      adaptKernel(gray, Ix, W, H, sobelx)
      for (let i = 0; i < Ix.length; i++) {
        Ix2t[i] = Ix[i] ** 2
        Iy2t[i] = Iy[i] ** 2
        Ixyt[i] = Ix[i] * Iy[i]
      }
      adaptKernel(Ix2t, Ix2, W, H, gKernel)
      adaptKernel(Iy2t, Iy2, W, H, gKernel)
      adaptKernel(Ixyt, IxIy, W, H, gKernel)
      for (let i = 0; i < IxIy.length; i++) {
        M[i] = Ix2[i] * Iy2[i] - IxIy[i] ** 2 - k * (Ix2[i] + Iy2[i]) ** 2
      }
      const threshold = Math.max(...M) * th
      for (let i = 0; i < M.length; i++) {
        if (M[i] > threshold) {
          const x = i % W
          const y = Math.ceil(i / W)
          ctx1.beginPath()
          ctx1.fillStyle = 'rgb(192, 80, 77)'
          ctx1.arc(x, y, 2, 0, Math.PI * 2, false)
          ctx1.fill()
        }
      }
    }

    const getGaussianKernel = (kernelSize: number, sigma: number) => {
      const gaussian = (x: number, y: number, sigma: number) =>
        Math.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2))
      let w = 0
      const kernel = Array.from(new Array(kernelSize), () => new Array(kernelSize).fill(0))
      for (let y = 0; y < kernelSize; y++)
        for (let x = 0; x < kernelSize; x++) {
          const _x = x - ~~(kernelSize / 2)
          const _y = y - ~~(kernelSize / 2)
          const g = gaussian(_x, _y, sigma)
          kernel[y][x] = g
          kernel[y][x] /= sigma * Math.sqrt(2 * Math.PI)
          w += kernel[y][x]
        }
      for (let y = 0; y < kernelSize; y++)
        for (let x = 0; x < kernelSize; x++) {
          kernel[y][x] /= w
        }
      return kernel
    }

    const adaptKernel = (
      src: Pixels,
      dst: number[],
      imgWidth: number,
      imgHeight: number,
      kernel: number[][],
      callback: KernelReduceCallback | null = null,
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
          const result = []
          for (let i = 0; i < kernelSize; i++)
            for (let j = 0; j < kernelSize; j++) {
              const _i = i - d
              const _j = j - d
              const srcIdx = getIndex(x + _j, y + _i)
              k += kernel[i][j] * src[srcIdx]
              result.push(kernel[i][j] * src[srcIdx])
            }
          const dstIdx = getIndex(x, y)
          if (callback != null) {
            const applied = callback(result, k)
            if (applied !== undefined) {
              dst[dstIdx] = applied
            }
          } else {
            dst[dstIdx] = k
          }
        }
    }

    return { main }
  },
  { imageUrl: config.srcImage.thorino },
)
