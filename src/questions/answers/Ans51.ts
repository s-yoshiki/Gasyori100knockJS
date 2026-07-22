import { TwoCanvasAnswer } from '../base'
import type { KernelCallback, Pixels } from '@/lib/pixels'
import { context2d } from '@/lib/canvas'
/**
 * Q.51
 * モルフォロジー勾配
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * メイン
   */
  main(canvas1: HTMLCanvasElement, image: HTMLImageElement) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = context2d(canvas1)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(image.width, image.height)
    const bin = new Array(image.width * image.height).fill(0)
    const erode = new Array(image.width * image.height).fill(0)
    const dilate = new Array(image.width * image.height).fill(0)
    const t = this.threshold(src1.data)
    const kernel = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      bin[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2]) < t ? 0 : 255
    }
    this.adaptKernel(bin.slice(), erode, image.width, image.height, kernel, (e: number) => {
      if (e < 255 * 4) return 0
      else return 255
    })
    this.adaptKernel(bin.slice(), dilate, image.width, image.height, kernel, (e: number) => {
      if (e >= 255) return 255
    })
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      const p = Math.abs(erode[j] - dilate[j])
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = p
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
  /**
   * 大津の2値化
   */
  threshold(src: Pixels) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const histgram = Array(256).fill(0)
    let t = 0
    let max = 0

    for (let i = 0; i < src.length; i += 4) {
      const g = ~~grayscale(src[i], src[i + 1], src[i + 2])
      histgram[g]++
    }

    for (let i = 0; i < 256; i++) {
      let w1 = 0
      let w2 = 0
      let sum1 = 0
      let sum2 = 0
      let m1 = 0
      let m2 = 0
      for (let j = 0; j <= i; ++j) {
        w1 += histgram[j]
        sum1 += j * histgram[j]
      }
      for (let j = i + 1; j < 256; ++j) {
        w2 += histgram[j]
        sum2 += j * histgram[j]
      }
      if (w1) {
        m1 = sum1 / w1
      }
      if (w2) {
        m2 = sum2 / w2
      }
      const tmp = w1 * w2 * (m1 - m2) * (m1 - m2)
      if (tmp > max) {
        max = tmp
        t = i
      }
    }
    return t
  }
  /**
   * フィルタを適用する
   */
  adaptKernel(
    src: Pixels,
    dst: number[],
    imgWidth: number,
    imgHeight: number,
    kernel: number[][],
    callback: KernelCallback | null = null,
  ) {
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
}
