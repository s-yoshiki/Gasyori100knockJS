import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.6
 * 減色処理
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
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

    let thresholds = [32, 96, 160, 224]

    for (let i = 0; i < src.data.length; i++) {
      if (i % 4 === 3) {
        dst.data[i] = src.data[i]
        continue
      }

      let neer = Number.MAX_SAFE_INTEGER
      let _j = 0

      for (let j in thresholds) {
        let d = Math.abs(src.data[i] - thresholds[j])
        if (d < neer) {
          neer = d
          _j = j
        }
      }

      dst.data[i] = thresholds[_j]
    }
    ctx.putImageData(dst, 0, 0)
  }
}