import { ThreeCanvasHistogramAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.21
 * 画像正規化 + ヒストグラム
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

    const dMax = 255
    const dMin = 0
    let vMin = 255
    let vMax = 0

    const trans = (p: number) => ((dMax - dMin) / (vMax - vMin)) * (p - vMin) + dMin

    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        const p = src.data[i + c]
        if (p > vMax) {
          vMax = p
        }
        if (p < vMin) {
          vMin = p
        }
      }
    }

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
