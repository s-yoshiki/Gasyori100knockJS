import { ThreeCanvasHistogramComponent } from "./BaseComponents.js"
/**
 * Q.21
 * 画像正規化 + ヒストグラム
 * @extends ThreeCanvasHistogramComponent
 */
export default class Ans21 extends ThreeCanvasHistogramComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let pixelValues = new Array(255).fill(0)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    let dMax = 255
    let dMin = 0
    let vMin = 255
    let vMax = 0

    const trans = (p) => (dMax - dMin) / (vMax - vMin) * (p - vMin) + dMin

    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        let p = src.data[i + c]
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
        dst.data[i + c] = parseInt(trans(src.data[i + c]), 10)
        pixelValues[dst.data[i + c]]++
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}