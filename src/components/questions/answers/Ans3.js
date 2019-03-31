import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.3
 * 二値化
 * @extends BaseTwoCanvasComponent
 */
export default class Ans3 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas, image) {
    const THRESHOLD = 128
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      let y = 0.2126 * src.data[i] + 0.7152 * src.data[i + 1] + 0.0722 * src.data[i + 2]
      y = parseInt(y, 10)
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


