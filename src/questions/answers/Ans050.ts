import { context2d } from '@/lib/canvas'
import type { KernelCallback, Pixels } from '@/lib/pixels'
import { createThreeCanvasAnswer } from '../base'

export default createThreeCanvasAnswer(() => {
  const main = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = context2d(canvas1)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(image.width, image.height)
    const ctx2 = context2d(canvas2)
    ctx2.drawImage(image, 0, 0, image.width, image.height)
    const dst2 = ctx2.createImageData(image.width, image.height)
    const gray = new Array(image.width * image.height).fill(0)
    const kernel = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      gray[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
    }
    const bin = cannyEdge(gray, image.width, image.height)
    const mor = bin.slice()
    adaptKernel(mor.slice(), mor, image.width, image.height, kernel, (e: number) => {
      if (e >= 255) return 255
    })
    adaptKernel(mor.slice(), mor, image.width, image.height, kernel, (e: number) => {
      if (e < 255 * 4) return 0
    })
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = bin[j]
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = mor[j]
      dst1.data[i + 3] = 255
      dst2.data[i + 3] = 255
    }

    ctx1.putImageData(dst1, 0, 0)
    ctx2.putImageData(dst2, 0, 0)
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

  const getGaussianKernel = (kernelSize: number, sigma: number) => {
    const gaussian = (x: number, y: number, sigma: number) =>
      Math.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2))
    let w = 0
    const kernel = Array.from(new Array(kernelSize), () => new Array(kernelSize).fill(0))
    const d = Math.floor(kernelSize / 2)
    for (let y = 0; y < kernelSize; y++)
      for (let x = 0; x < kernelSize; x++) {
        const _x = x - d
        const _y = y - d
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

  const cannyEdge = (src: number[], imgWidth: number, imgHeight: number) => {
    const gaussianKernel = getGaussianKernel(5, 1.4)
    const KSV = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ]
    const KSH = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ]
    const HT = 100
    const LT = 30
    const gaussian = new Array(imgWidth * imgHeight).fill(0)
    const fx = new Array(imgWidth * imgHeight).fill(0)
    const fy = new Array(imgWidth * imgHeight).fill(0)
    const edge = new Array(imgWidth * imgHeight).fill(0)
    const angle = new Array(imgWidth * imgHeight).fill(0)
    const out = new Array(imgWidth * imgHeight).fill(0)
    adaptKernel(src, gaussian, imgWidth, imgHeight, gaussianKernel)
    adaptKernel(gaussian, fx, imgWidth, imgHeight, KSH)
    adaptKernel(gaussian, fy, imgWidth, imgHeight, KSV)
    for (let i = 0; i < fx.length; i++) {
      edge[i] = Math.sqrt(fx[i] ** 2 + fy[i] ** 2)
      if (edge[i] == 0) {
        edge[i] = 1e-5
      }
      const t = Math.atan(fy[i] / fx[i])
      if (-0.4142 < t && t <= 0.4142) angle[i] = 0
      else if (0.4142 < t && t <= 2.4142) angle[i] = 45
      else if (Math.abs(t) >= 2.4142) angle[i] = 90
      else if (-2.4142 < t && t <= -0.4142) angle[i] = 135
    }
    nonMaximumSuppression(edge, angle, imgWidth, imgHeight)
    histeresisThreshold(edge, out, imgWidth, imgHeight, HT, LT)
    return out
  }

  const nonMaximumSuppression = (
    edge: number[],
    angle: number[],
    imgWidth: number,
    imgHeight: number,
  ) => {
    const getIdx = (x: number, y: number) => x + y * imgWidth
    for (let y = 0; y < imgHeight; y++)
      for (let x = 0; x < imgWidth; x++) {
        const idx = getIdx(x, y)
        let dx1 = 0,
          dy1 = 0,
          dx2 = 0,
          dy2 = 0
        if (angle[idx] == 0) {
          ;[dx1, dy1, dx2, dy2] = [-1, 0, 1, 0]
        } else if (angle[idx] == 45) {
          ;[dx1, dy1, dx2, dy2] = [-1, 1, 1, -1]
        } else if (angle[idx] == 90) {
          ;[dx1, dy1, dx2, dy2] = [0, -1, 0, 1]
        } else if (angle[idx] == 135) {
          ;[dx1, dy1, dx2, dy2] = [-1, -1, 1, 1]
        }
        if (x === 0) {
          dx1 = Math.max(dx1, 0)
          dx2 = Math.max(dx2, 0)
        }
        if (x === imgWidth - 1) {
          dx1 = Math.min(dx1, 0)
          dx2 = Math.min(dx2, 0)
        }
        if (y === 0) {
          dy1 = Math.max(dy1, 0)
          dy2 = Math.max(dy2, 0)
        }
        if (y === imgHeight - 1) {
          dy1 = Math.min(dy1, 0)
          dy2 = Math.min(dy2, 0)
        }
        if (
          Math.max(edge[idx], edge[getIdx(x + dx1, y + dy1)], edge[getIdx(x + dx2, y + dy2)]) !==
          edge[idx]
        ) {
          edge[idx] = 0
        }
      }
  }

  const histeresisThreshold = (
    src: number[],
    dst: number[],
    imgWidth: number,
    imgHeight: number,
    HT: number,
    LT: number,
  ) => {
    const getIndex = (x: number, y: number) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernel = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ]
    for (let i = 0; i < src.length; i++) {
      if (src[i] >= HT) {
        dst[i] = 255
      } else if (src[i] <= LT) {
        dst[i] = 0
      } else {
        dst[i] = src[i]
      }
    }
    const kernelSize = kernel.length
    for (let x = 0; x < imgWidth; x++)
      for (let y = 0; y < imgHeight; y++) {
        const idx = getIndex(x, y)
        if (HT < src[idx] || src[idx] < LT) {
          continue
        }
        const k = []
        for (let i = 0; i < kernelSize; i++)
          for (let j = 0; j < kernelSize; j++) {
            const _i = i - ~~(kernelSize / 2)
            const _j = j - ~~(kernelSize / 2)
            const _idx = getIndex(x + _j, y + _i)
            k.push(kernel[i][j] * src[_idx])
          }
        const max = Math.max(...k)
        if (max >= HT) {
          dst[idx] = 255
        } else {
          dst[idx] = 0
        }
      }
  }

  return { main }
})
