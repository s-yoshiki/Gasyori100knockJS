import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.58
 * ラベリング 4近傍
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  init() {
    this.setSrcImage(config.srcImage.seg)
  }
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const getRandInt = (min, max) => {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min
    }
    let ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(image.width, image.height)
    let bin = new Array(image.width * image.height).fill(0)
    let out = new Array(image.width * image.height).fill([0, 0, 0])
    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      bin[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2]) > 128 ? 255 : 0
    }
    let [label, lut, nabelLength] = this.rasterScan(bin, image.width, image.height)
    let colors = Array.from(new Array(nabelLength), () => [
      getRandInt(0, 255), getRandInt(0, 255), getRandInt(0, 255)
    ])
    for (let i = 0, idx = 2; idx < lut.length; i++ , idx++) {
      let c = colors[lut[idx] - 2]
      for (let j = 0; j < label.length; j++) {
        if (label[j] === i + 2) {
          out[j] = c
        }
      }
    }
    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      let p = out[j]
      if (!p) {
        p = [0, 0, 0]
      }
      dst1.data[i] = p[0]
      dst1.data[i + 1] = p[1]
      dst1.data[i + 2] = p[2]
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
  /**
   * raster scan
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
    let label = src.slice().map(e => e > 0 ? 1 : 0)
    let lut = new Array(src.length).fill(0)
    let n = 1
    let count = 1
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (label[getIdx(x, y)] == 0) {
        continue
      }
      let c3 = label[getIdx(x, y - 1)]
      let c5 = label[getIdx(x - 1, y)]
      if ((c3 < 2) && (c5 < 2)) {
        n++
        label[getIdx(x, y)] = n
      } else {
        let _vs = [c3, c5]
        let vs = []
        _vs.forEach(e => {
          if (e > 1) {
            vs.push(e)
          }
        })
        let v = Math.min(...vs)
        label[getIdx(x, y)] = v
        let minv = v
        vs.forEach(_v => {
          if (lut[_v] !== 0) {
            minv = Math.min(minv, lut[_v])
          }
        })
        vs.forEach(_v => {
          lut[_v] = minv
        })
      }
    }
    for (let l = 2; l < n + 1; l++) {
      let flag = true
      for (let i = 0; i < n + 1; i++) {
        if (lut[i] === l) {
          if (flag) {
            count++
            flag = false
          }
          lut[i] = count
        }
      }
    }
    return [label, lut, count]
  }
}