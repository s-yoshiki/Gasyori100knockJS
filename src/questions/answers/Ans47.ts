import { ThreeCanvasAnswer } from '../base'
import type { KernelCallback, Pixels } from '@/lib/pixels'
import { context2d } from '@/lib/canvas'
/**
 * Q.47
 * モルフォロジー処理(膨張)
 * @extends ThreeCanvasAnswer
 */
export default class extends ThreeCanvasAnswer {
  /**
   * メイン
   */
  main(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, image: HTMLImageElement) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = context2d(canvas1)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(image.width, image.height)
    const ctx2 = context2d(canvas2)
    ctx2.drawImage(image, 0, 0, image.width, image.height)
    const dst2 = ctx2.createImageData(image.width, image.height)
    const bin = new Array(image.width * image.height).fill(0)
    // let mor1 = new Array(image.width * image.height).fill(0)
    // let mor2 = new Array(image.width * image.height).fill(0)
    const t = this.threshold(src1.data)
    const kernel = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      const c = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      bin[j] = c >= t ? 255 : 0
    }
    const mor1 = bin.slice()
    this.adaptKernel(bin, mor1, image.width, image.height, kernel, (e: number) => {
      if (e >= 255) return 255
    })
    const mor2 = mor1.slice()
    this.adaptKernel(mor1, mor2, image.width, image.height, kernel, (e: number) => {
      if (e >= 255) return 255
    })

    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = bin[j]
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = mor2[j]
      dst1.data[i + 3] = 255
      dst2.data[i + 3] = 255
    }

    ctx1.putImageData(dst1, 0, 0)
    ctx2.putImageData(dst2, 0, 0)
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
    callback: KernelCallback,
  ) {
    const getIndex = (x: number, y: number) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernelSize = kernel.length
    const d = Math.floor(kernelSize / 2)
    for (let x = 1; x < imgWidth + 1; x++)
      for (let y = 1; y < imgHeight + 1; y++) {
        let k = 0
        for (let i = 0; i < kernelSize; i++)
          for (let j = 0; j < kernelSize; j++) {
            const srcIdx = getIndex(x + i - d, y + j - d)
            k += kernel[i][j] * src[srcIdx]
          }
        const dstIdx = getIndex(x, y)
        if (callback != null) {
          const applied = callback(k)
          if (applied !== undefined) {
            dst[dstIdx] = applied
          }
        }
      }
  }
}
