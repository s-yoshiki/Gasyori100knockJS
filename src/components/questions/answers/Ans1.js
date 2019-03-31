import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.1
 * チャンネル入れ替え
 * @extends BaseTwoCanvasComponent
 */
export default class Ans1 extends BaseTwoCanvasComponent {
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

    for (let i = 0; i < src.data.length; i += 4) {
      dst.data[i] = src.data[i + 2]
      dst.data[i + 1] = src.data[i + 1]
      dst.data[i + 2] = src.data[i]
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }
}









