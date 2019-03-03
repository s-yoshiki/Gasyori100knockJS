import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, ThreeCanvasHistogramComponent, BaseFourCanvasComponent
} from "./BaseComponents.js"
import config from "../configure.js"

import math from "mathjs"

export default null

/**
 * Q.30
 * アフィン変換(スキュー)
 * @BaseTwoCanvasComponent
 */
export class Ans31 extends BaseFourCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, canvas3, image) {
    let dx = 30
    let a = dx / image.height
    let tx = 0
    let ty = 0
    const H1 = [
      [1, a, tx],
      [0, 1, ty],
      [0, 0, 1],
    ]
    const H2 = [
      [1, 0, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    const H3 = [
      [1, a, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    this.trans(canvas1, image, H1)
    this.trans(canvas2, image, H2)
    this.trans(canvas3, image, H3)
  }
  /**
   * Homography Translation
   * @param {canvas} canvas 
   * @param {Image} image 
   * @param {Array} H 3x3 - Homography
   */
  trans(canvas, image, H) {
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

    const calcHomography = (Hx, x, y) => {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < Hx.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * Hx[i][j]
        }
        a[i] = ~~tmp
      }
      return a
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    let [width, height] = calcHomography(H, image.width, image.height).map(e => ~~e)
    canvas.width = width
    canvas.height = height

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
        if ((0 < a[0] && a[0] < image.width) && (0 < a[1] && a[1] < image.height)) {
          dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
        }
      }
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}