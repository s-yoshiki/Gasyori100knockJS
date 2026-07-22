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
      const getIdx = (x: number, y: number) => {
        x = Math.min(Math.max(x, 0), W - 1)
        y = Math.min(Math.max(y, 0), H - 1)
        return y * W + x
      }
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
      const ctx1 = context2d(canvas1)
      ctx1.drawImage(image, 0, 0, image.width, image.height)
      const dst1 = ctx1.createImageData(image.width, image.height)
      const src1 = ctx1.getImageData(0, 0, image.width, image.height)
      const gray = new Array(H * W).fill(0)
      const Ix = new Array(H * W).fill(0)
      const Iy = new Array(H * W).fill(0)
      const Ix2 = new Array(H * W).fill(0)
      const Iy2 = new Array(H * W).fill(0)
      const IxIy = new Array(H * W).fill(0)
      const hes = new Array(H * W).fill(0)
      for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
        const c = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = c
        dst1.data[i + 3] = 255
        gray[j] = c
      }
      ctx1.putImageData(dst1, 0, 0)
      adaptKernel(gray, Iy, W, H, sobely, (arr: number[], sum: number) => {
        return ~~sum / arr.length
      })
      adaptKernel(gray, Ix, W, H, sobelx, (arr: number[], sum: number) => {
        return ~~sum / arr.length
      })
      for (let i = 0; i < Ix.length; i++) {
        IxIy[i] = Ix[i] * Iy[i]
        Ix2[i] = Ix[i] ** 2
        Iy2[i] = Iy[i] ** 2
      }
      for (let x = 0; x < W; x++)
        for (let y = 0; y < H; y++) {
          hes[getIdx(x, y)] = Ix2[getIdx(x, y)] * Iy2[getIdx(x, y)] - IxIy[getIdx(x, y)] ** 2
        }
      for (let x = 0; x < W; x++)
        for (let y = 0; y < H; y++) {
          const tmp = [
            hes[getIdx(x - 1, y - 1)],
            hes[getIdx(x, y - 1)],
            hes[getIdx(x + 1, y - 1)],
            hes[getIdx(x - 1, y)],
            hes[getIdx(x, y)],
            hes[getIdx(x + 1, y)],
            hes[getIdx(x - 1, y + 1)],
            hes[getIdx(x, y + 1)],
            hes[getIdx(x + 1, y + 1)],
          ]
          const m = Math.max(...tmp)
          if (hes[getIdx(x, y)] === m && hes[getIdx(x, y)] > Math.max(...hes) * 0.1) {
            ctx1.beginPath()
            ctx1.fillStyle = 'rgb(192, 80, 77)'
            ctx1.arc(x, y, 2, 0, Math.PI * 2, false)
            ctx1.fill()
          }
        }
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
