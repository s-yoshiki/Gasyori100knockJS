import {BaseThreeCanvasComponent} from "./BaseComponents.js"
import math from "mathjs"
/**
 * Q.30
 * アフィン変換(回転)
 * @extends BaseTwoCanvasComponent
 */
export default class Ans30 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, canvas2, image) {
    const calcHomography = (H, x, y) => {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * H[i][j]
        }
        a[i] = ~~tmp
      }
      return a
    }

    const deg = -30
    const rad = deg * Math.PI / 180

    const H1 = [
      [Math.cos(rad), -Math.sin(rad), 0],
      [Math.sin(rad), Math.cos(rad), 0],
      [0, 0, 1],
    ]

    let [cx, cy] = calcHomography(
      H1,
      canvas1.width / 2,
      canvas1.height / 2
    ).map(e => ~~e)

    const H2 = [
      [Math.cos(rad), -Math.sin(rad), -cx + ~~(canvas1.width / 2)],
      [Math.sin(rad), Math.cos(rad), -cy + ~~(canvas1.height / 2)],
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

    let ctx = canvas.getContext("2d");

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    canvas.width = image.width
    canvas.height = image.height
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