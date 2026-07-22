import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.3
 * 二値化
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const THRESHOLD = 128
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      let y = 0.2126 * src.data[i] + 0.7152 * src.data[i + 1] + 0.0722 * src.data[i + 2]
      y = Math.trunc(y)
      if (y > THRESHOLD) {
        y = 255
      } else {
        y = 0
      }
      dst.data[i] = y
      dst.data[i + 1] = y
      dst.data[i + 2] = y
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }
}
