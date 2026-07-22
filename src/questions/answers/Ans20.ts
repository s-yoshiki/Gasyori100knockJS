import { HistogramAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.20
 * ヒストグラム表示
 * @extends HistogramAnswer
 */
export default class extends HistogramAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement) {
    const pixelValues = new Array(256).fill(0)
    const ctx = context2d(canvas)
    const src = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        pixelValues[src.data[i] + c]++
      }
    }
    this.renderChart(pixelValues)
  }
}
