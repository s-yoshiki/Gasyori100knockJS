import {BaseThreeCanvasComponent} from "./BaseComponents.js"
import math from "mathjs"
/**
 * Q.29
 * アフィン変換(平行移動)
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, canvas2, image) {
    const scaleX = 1.3
    const scaleY = 0.8
    let tx = 30
    let ty = -30
    const H1 = [
      [scaleX, 0, 0],
      [0, scaleY, 0],
      [0, 0, 1],
    ]
    const H2 = [
      [scaleX, 0, tx],
      [0, scaleY, ty],
      [0, 0, 1],
    ]

    this.trans(canvas1, image, H1)
    this.trans(canvas2, image, H2)
  }
  /**
   * Homography Translation
   * @param {Object} canvas 
   * @param {Object} image 
   * @param {Array} H 3x3 - Homography
   */
  trans(canvas, image, H) {
    const getDstIndex = (x, y, channel) => {
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      return y * image.width * 4 + x * 4 + channel
    }

    let scaleX = H[0][0]
    let scaleY = H[1][1]

    let ctx = canvas.getContext("2d");

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    canvas.width = ~~(image.width * scaleX)
    canvas.height = ~~(image.height * scaleY)
    let dst = ctx.createImageData(canvas.width, canvas.height)

    let _H = math.inv(H)

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < _H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * _H[i][j]
        }
        a[i] = ~~tmp
      }
      for (let c = 0; c < 3; c++) {
        if ((0 < a[0] && a[0] < canvas.width)) {
          dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
        }
      }
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}