import { HistogramComponent } from "./BaseComponents.js"
/**
 * Q.20
 * ヒストグラム表示
 * @extends HistogramComponent
 */
export default class Ans20 extends HistogramComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas) {
    let pixelValues = new Array(255).fill(0)
    let ctx = canvas.getContext("2d");
    let src = ctx.getImageData(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        pixelValues[src.data[i] + c]++
      }
    }
    this.renderChart(pixelValues)
  }
}