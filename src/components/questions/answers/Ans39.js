import {BaseTwoCanvasComponent} from "./BaseComponents.js"
/**
 * Q.39
 * JPEG圧縮 (Step.3)YCbCr表色系
 * @extends BaseTwoCanvasComponent
 */
export default class Ans39 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, image) {
    const rgb2ycc = (r, g, b) => [
      0.299 * r + 0.5870 * g + 0.114 * b,
      -0.1687 * r - 0.3313 * g + 0.5 * b + 128,
      0.5 * r - 0.4187 * g - 0.0813 * b + 128
    ]
    const ycc2rgb = (y, cr, cb) => [
      y + (cb - 128) * 1.7718,
      y - (cb - 128) * 0.3441 - (cr - 128) * 0.7139,
      y + (cr - 128) * 1.402,
    ]

    let ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      let [y, cr, cb] = rgb2ycc(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      y *= 0.7
      let rgb = ycc2rgb(y, cr, cb)
      dst1.data[i + 0] = rgb[0]
      dst1.data[i + 1] = rgb[1]
      dst1.data[i + 2] = rgb[2]
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
}