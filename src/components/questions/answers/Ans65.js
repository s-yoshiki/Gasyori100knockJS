import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.65
 * Zhang-Suenの細線化
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  init() {
    this.setSrcImage(config.srcImage.gazo)
  }
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(image.width, image.height)
    let bin = new Array(image.width * image.height).fill(0)
    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      bin[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2]) > 128 ? 255 : 0
    }
    let dst = this.rasterScan(bin, image.width, image.height)
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      let c = dst[j]
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = ~~(c * 255)
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
  /**
   * 連結
   * @param {Array} src src image binary
   * @param {Number} W src image width
   * @param {Number} H src image height
   * @return {Array} pos 
   */
  rasterScan(src, W, H) {
    const getIdx = (x, y) => {
      y = Math.min(Math.max(y, 0), H - 1)
      x = Math.min(Math.max(x, 0), W - 1)
      return y * W + x
    }
    const sum = (arr) => {
      return arr.reduce(function (prev, current, i, arr) {
        return prev + current;
      })
    }
    let out = src.slice().map(e => e > 0 ? 0 : 1)
    for (let i = 0; i < 5000; i++) {
      let s1 = []
      let s2 = []
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        if (out[getIdx(x, y)] > 0)
          continue

        let f1 = 0
        if ((out[getIdx(x + 1, y - 1)] - out[getIdx(x, y - 1)]) == 1) f1++
        if ((out[getIdx(x + 1, y)] - out[getIdx(x + 1, y - 1)]) == 1) f1++
        if ((out[getIdx(x + 1, y + 1)] - out[getIdx(x + 1, y)]) == 1) f1++
        if ((out[getIdx(x, y + 1)] - out[getIdx(x + 1, y + 1)]) == 1) f1++
        if ((out[getIdx(x - 1, y + 1)] - out[getIdx(x, y + 1)]) == 1) f1++
        if ((out[getIdx(x - 1, y)] - out[getIdx(x - 1, y + 1)]) == 1) f1++
        if ((out[getIdx(x - 1, y - 1)] - out[getIdx(x - 1, y)]) == 1) f1++
        if ((out[getIdx(x, y - 1)] - out[getIdx(x - 1, y - 1)]) == 1) f1++

        if (f1 !== 1)
          continue

        let f2 = sum([
          out[getIdx(x - 1, y - 1)], out[getIdx(x, y - 1)], out[getIdx(x + 1, y - 1)],
          out[getIdx(x - 1, y)], out[getIdx(x, y)], out[getIdx(x + 1, y)],
          out[getIdx(x - 1, y + 1)], out[getIdx(x, y + 1)], out[getIdx(x + 1, y + 1)],
        ])
        if (f2 < 2 || f2 > 6)
          continue
        if ((out[getIdx(x, y - 1)] + out[getIdx(x + 1, y)] + out[getIdx(x, y + 1)]) < 1)
          continue
        if ((out[getIdx(x + 1, y)] + out[getIdx(x, y + 1)] + out[getIdx(x - 1, y)]) < 1)
          continue

        s1.push([x, y])
      }

      s1.forEach(e => {
        out[getIdx(e[0], e[1])] = 1
      })
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        if (out[getIdx(x, y)] > 0)
          continue

        let f1 = 0
        if ((out[getIdx(x + 1, y - 1)] - out[getIdx(x, y - 1)]) == 1) f1++
        if ((out[getIdx(x + 1, y)] - out[getIdx(x + 1, y - 1)]) == 1) f1++
        if ((out[getIdx(x + 1, y + 1)] - out[getIdx(x + 1, y)]) == 1) f1++
        if ((out[getIdx(x, y + 1)] - out[getIdx(x + 1, y + 1)]) == 1) f1++
        if ((out[getIdx(x - 1, y + 1)] - out[getIdx(x, y + 1)]) == 1) f1++
        if ((out[getIdx(x - 1, y)] - out[getIdx(x - 1, y + 1)]) == 1) f1++
        if ((out[getIdx(x - 1, y - 1)] - out[getIdx(x - 1, y)]) == 1) f1++
        if ((out[getIdx(x, y - 1)] - out[getIdx(x - 1, y - 1)]) == 1) f1++

        if (f1 !== 1)
          continue

        let f2 = sum([
          out[getIdx(x - 1, y - 1)], out[getIdx(x, y - 1)], out[getIdx(x + 1, y - 1)],
          out[getIdx(x - 1, y)], out[getIdx(x, y)], out[getIdx(x + 1, y)],
          out[getIdx(x - 1, y + 1)], out[getIdx(x, y + 1)], out[getIdx(x + 1, y + 1)],
        ])
        if (f2 < 2 || f2 > 6)
          continue
        if ((out[getIdx(x, y - 1)] + out[getIdx(x + 1, y)] + out[getIdx(x - 1, y)]) < 1)
          continue
        if ((out[getIdx(x, y - 1)] + out[getIdx(x, y + 1)] + out[getIdx(x - 1, y)]) < 1)
          continue

        s2.push([x, y])
      }

      s2.forEach(e => {
        out[getIdx(e[0], e[1])] = 1
      })
      if (s1.length < 1 && s2.length < 1) {
        break
      }
    }
    out = out.map(e => 1 - e)
    return out
  }
}