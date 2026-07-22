import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.39
 * JPEG圧縮 (Step.3)YCbCr表色系
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * メイン
   */
  main(canvas1: HTMLCanvasElement, image: HTMLImageElement) {
    const rgb2ycc = (r: number, g: number, b: number) => [
      0.299 * r + 0.587 * g + 0.114 * b,
      -0.1687 * r - 0.3313 * g + 0.5 * b + 128,
      0.5 * r - 0.4187 * g - 0.0813 * b + 128,
    ]
    const ycc2rgb = (y: number, cr: number, cb: number) => [
      y + (cb - 128) * 1.7718,
      y - (cb - 128) * 0.3441 - (cr - 128) * 0.7139,
      y + (cr - 128) * 1.402,
    ]

    const ctx1 = context2d(canvas1)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(canvas1.width, canvas1.height)

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      const [y, cr, cb] = rgb2ycc(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      const rgb = ycc2rgb(y * 0.7, cr, cb)
      dst1.data[i + 0] = rgb[0]
      dst1.data[i + 1] = rgb[1]
      dst1.data[i + 2] = rgb[2]
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
}
