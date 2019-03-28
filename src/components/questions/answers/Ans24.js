import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure.js"
/**
 * Q.24
 * ガンマ補正
 * @extends BaseTwoCanvasComponent
 */
export default class Ans24 extends BaseTwoCanvasComponent {
  /**
   * 初期処理
   * 
   * @param {Document} self 
   */
  init() {
    // ノイズ画像セット
    this.setSrcImage(config.srcImage.gamma)
  }
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    let c = 1.0
    let g = 2.2

    for (let i = 0; i < src.data.length; i += 4) {
      for (let n = 0; n < 3; n++) {
        let p = src.data[i + n]
        p /= 255
        p = (1 / c * p) ** (1 / g)
        p *= 255
        dst.data[i + n] = p
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}