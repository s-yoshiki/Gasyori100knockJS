import { ThreeCanvasHistogramAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.22
 * ヒストグラム操作
 * @extends ThreeCanvasHistogramAnswer
 */
export default class extends ThreeCanvasHistogramAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const pixelValues = new Array(256).fill(0)
    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    const m0 = 128
    const s0 = 52
    let m = 97
    let s = 12

    const trans = (p: number) => (s0 / s) * (p - m) + m0

    // 標準偏差
    const std = (array: number[]) => {
      const average =
        array.reduce((previous: number, current: number) => previous + current) / array.length
      return Math.sqrt(
        array
          .map((current: number) => {
            const difference = current - average
            return difference ** 2
          })
          .reduce((previous: number, current: number) => previous + current) / array.length,
      )
    }

    const grayScaleArr = []
    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        grayScaleArr.push(src.data[i + c])
      }
    }

    s = std(grayScaleArr)
    m = grayScaleArr.reduce((previous, current) => previous + current) / grayScaleArr.length

    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        dst.data[i + c] = Math.trunc(trans(src.data[i + c]))
        pixelValues[dst.data[i + c]]++
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}
