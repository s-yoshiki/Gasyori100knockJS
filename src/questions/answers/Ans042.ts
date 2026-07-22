import { context2d } from '@/lib/canvas'
import type { Pixels } from '@/lib/pixels'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(() => {
  const main = (canvas1: HTMLCanvasElement, image: HTMLImageElement) => {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
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
    const ctx1 = context2d(canvas1)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(image.width, image.height)
    const gray = []

    for (let i = 0; i < src1.data.length; i += 4) {
      const color = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      gray.push(color)
    }
    const gaussian = new Array(image.width * image.height).fill(0)
    const fx = new Array(image.width * image.height).fill(0)
    const fy = new Array(image.width * image.height).fill(0)
    const edge = new Array(image.width * image.height).fill(0)
    const angle = new Array(image.width * image.height).fill(0)
    adaptKernel(gray, gaussian, image.width, image.height, gaussianKernel)
    adaptKernel(gaussian, fx, image.width, image.height, KSH)
    adaptKernel(gaussian, fy, image.width, image.height, KSV)

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

    nonMaximumSuppression(edge, angle, image.width, image.height)

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = edge[j]
      dst1.data[i + 3] = 255
    }

    ctx1.putImageData(dst1, 0, 0)
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
  ) => {
    const getIndex = (x: number, y: number) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernelSize = kernel.length
    for (let x = 0; x < imgWidth; x++)
      for (let y = 0; y < imgHeight; y++) {
        let k = 0
        for (let i = 0; i < kernelSize; i++)
          for (let j = 0; j < kernelSize; j++) {
            const _i = i - ~~(kernelSize / 2)
            const _j = j - ~~(kernelSize / 2)
            const srcIdx = getIndex(x + _j, y + _i)
            k += kernel[i][j] * src[srcIdx]
          }
        const dstIdx = getIndex(x, y)
        dst[dstIdx] = k
      }
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

  return { main }
})
