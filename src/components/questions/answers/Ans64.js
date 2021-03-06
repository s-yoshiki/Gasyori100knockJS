import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.64
 * ヒルディッチの細線化
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
    let out = src.slice().map(e => e > 0 ? 1 : 0)
    let count = 1
    while (count > 0) {
      count = 0
      let tmp = out.slice()
      let tmp2 = out.slice()
      let _tmp = tmp.map(e => 1 - e)
      let _tmp2 = tmp2.map(e => 1 - e)
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (out[getIdx(x, y)] < 1) {
          continue
        }

        let judge = 0
        if ((tmp[getIdx(x + 1, y)] + tmp[getIdx(x, y - 1)] + tmp[getIdx(x - 1, y)] + tmp[getIdx(x, y + 1)]) < 4) {
          judge++
        }

        let c = 0
        c += (_tmp[getIdx(x + 1, y)] - _tmp[getIdx(x + 1, y)] * _tmp[getIdx(x + 1, y - 1)] * _tmp[getIdx(x, y - 1)])
        c += (_tmp[getIdx(x, y - 1)] - _tmp[getIdx(x, y - 1)] * _tmp[getIdx(x - 1, y - 1)] * _tmp[getIdx(x - 1, y)])
        c += (_tmp[getIdx(x - 1, y)] - _tmp[getIdx(x - 1, y)] * _tmp[getIdx(x - 1, y + 1)] * _tmp[getIdx(x, y + 1)])
        c += (_tmp[getIdx(x, y + 1)] - _tmp[getIdx(x, y + 1)] * _tmp[getIdx(x + 1, y + 1)] * _tmp[getIdx(x + 1, y)])
        if (c == 1) {
          judge++
        }

        let arr1 = []
        let arr2 = []
        for (let _y = y - 1; _y < y + 2; _y++) for (let _x = x - 1; _x < x + 2; _x++) {
          arr1.push(out[getIdx(_x, _y)])
          arr2.push(tmp[getIdx(_x, _y)])
        }
        if (sum(arr1) >= 4) {
          judge++
        }
        if (sum(arr2) >= 4) {
          judge++
        }

        let flag = false
        c = 0
        c += (_tmp2[getIdx(x + 1, y)] - _tmp2[getIdx(x + 1, y)] * _tmp2[getIdx(x + 1, y - 1)] * (1 - tmp[getIdx(x, y - 1)]))
        c += ((1 - tmp[getIdx(x, y - 1)]) - (1 - tmp[getIdx(x, y - 1)]) * _tmp2[getIdx(x - 1, y - 1)] * _tmp2[getIdx(x - 1, y)])
        c += (_tmp2[getIdx(x - 1, y)] - _tmp2[getIdx(x - 1, y)] * _tmp2[getIdx(x - 1, y + 1)] * _tmp2[getIdx(x, y + 1)])
        c += (_tmp2[getIdx(x, y + 1)] - _tmp2[getIdx(x, y + 1)] * _tmp2[getIdx(x + 1, y + 1)] * _tmp2[getIdx(x + 1, y)])
        if (c == 1) {
          flag = true
        }

        _tmp2 = out.slice().map(e => 1 - e)

        c = 0
        c += (_tmp2[getIdx(x + 1, y)] - _tmp2[getIdx(x + 1, y)] * _tmp2[getIdx(x + 1, y - 1)] * _tmp2[getIdx(x, y - 1)])
        c += (_tmp2[getIdx(x, y - 1)] - _tmp2[getIdx(x, y - 1)] * _tmp2[getIdx(x - 1, y - 1)] * (1 - tmp[getIdx(x - 1, y)]))
        c += ((1 - tmp[getIdx(x - 1, y)]) - (1 - tmp[getIdx(x - 1, y)]) * _tmp2[getIdx(x - 1, y + 1)] * _tmp2[getIdx(x, y + 1)])
        c += (_tmp2[getIdx(x, y + 1)] - _tmp2[getIdx(x, y + 1)] * _tmp2[getIdx(x + 1, y + 1)] * _tmp2[getIdx(x + 1, y)])
        if (c == 1) {
          flag = true
        }

        if (flag) {
          judge++
        }

        if (judge >= 5) {
          out[getIdx(x, y)] = 0
          count++
        }
      }
    }
    return out
  }
}