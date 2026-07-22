import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.4
 * 大津の2化
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    const t = this.threshold(src)

    for (let i = 0; i < dst.data.length; i += 4) {
      const v = grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
      if (v < t) {
        dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = 0
      } else {
        dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = 255
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
  /**
   * 大津の2値化
   */
  threshold(src: ImageData) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const histgram = Array(256).fill(0)
    let t = 0
    let max = 0

    for (let i = 0; i < src.data.length; i += 4) {
      const g = ~~grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
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
}
