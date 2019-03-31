import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.25
 * 最近傍補間
 * @extends BaseTwoCanvasComponent
 */
export default class Ans25 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas, image) {
    const getDstIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), image.width - 1)
      y = Math.min(Math.max(y, 0), image.height - 1)
      return y * image.width * 4 + x * 4 + channel
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    let scale = 1.5
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    let dst = ctx.createImageData(canvas.width, canvas.height)


    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let _x = parseInt(x / scale, 10)
      let _y = parseInt(y / scale, 10)
      dst.data[getDstIndex(x, y, 0)] = src.data[getSrcIndex(_x, _y, 0)]
      dst.data[getDstIndex(x, y, 1)] = src.data[getSrcIndex(_x, _y, 1)]
      dst.data[getDstIndex(x, y, 2)] = src.data[getSrcIndex(_x, _y, 2)]
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
