import { ThreeCanvasHistogramComponent } from "./BaseComponents.js"
import config from "../configure.js"
/**
 * Q.23
 * ヒストグラム平坦化
 * @extends ThreeCanvasHistogramComponent
 */
export default class Ans23 extends ThreeCanvasHistogramComponent {
  /**
   * 初期処理
   * 
   * @param {Document} self 
   */
  init() {
    // ノイズ画像セット
    this.setSrcImage(config.srcImage.default)
  }
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let pixelValues = new Array(255).fill(0)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    const zMax = 255
    const S = canvas.width * canvas.height * 3

    let h = new Array(255).fill(0)
    let hSum = new Array(255).fill(0)

    for (let n = 0; n < 3; n++) {
      for (let i = 0; i < src.data.length; i += 4) {
        h[src.data[i + n]]++
      }
    }

    for (let i = 0; i < hSum.length; i++) {
      for (let j = 0; j < i; j++) {
        hSum[i] += h[j]
      }
    }

    for (let i = 0; i < src.data.length; i += 4) {
      for (let n = 0; n < 3; n++) {
        let p = src.data[i + n]
        let v = parseInt(zMax / S * hSum[p])
        if (v > 255) {
          v = 255
        } else if (v < 0) {
          v = 0
        }
        dst.data[i + n] = v
        pixelValues[v]++
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}
