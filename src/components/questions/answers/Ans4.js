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
    
    let _x, _y
    [_x, _y] = calcHomography(H1, image.width, image.height).map(e => ~~e)
    canvas1.width = _x
    canvas1.height = _y
    this.trans(canvas1, image, H1)

    [_x, _y] = calcHomography(H2, image.width, image.height).map(e => ~~e)
    canvas2.width = _x
    canvas2.height = _y
    this.trans(canvas2, image, H2)


  }
  /**
   * Homography Translation
   * @param {canvas} canvas 
   * @param {Image} image 
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

    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
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
        if ((0 < a[0] && a[0] < image.width)) {
          dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
        }
      }
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}