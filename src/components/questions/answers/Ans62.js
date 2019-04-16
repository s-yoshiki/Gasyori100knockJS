import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.62
 * 8-連結数
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  init() {
    this.setSrcImage(config.srcImage.renketsu)
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
    let links = this.findLinks(bin, image.width, image.height)
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      let c = links[j]
      let p = [0, 0, 0]
      if (c === 0) p = [255, 0, 0]
      if (c === 1) p = [0, 255, 0]
      if (c === 2) p = [0, 0, 255]
      if (c === 3) p = [0, 255, 255]
      if (c === 4) p = [255, 0, 255]
      dst1.data[i] = p[0]
      dst1.data[i + 1] = p[1]
      dst1.data[i + 2] = p[2]
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
  findLinks(src, W, H) {
    const getIdx = (x, y) => {
      y = Math.min(Math.max(y, 0), H - 1)
      x = Math.min(Math.max(x, 0), W - 1)
      return y * W + x
    }
    const max = (a, b) => {
      return Math.max(a, b)
    }
    const min = (a, b) => {
      return Math.min(a, b)
    }
    let _tmp = src.slice().map(e => e > 0 ? 1 : 0)
    let tmp = _tmp.slice()
    tmp = tmp.map(e => 1 - e)
    let dst = new Array(src.length).fill(0)
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (_tmp[getIdx(x, y)] < 1) {
        dst[getIdx(x, y)] = -1
        continue
      }
      let c = 0
      c += (tmp[getIdx(min(x + 1, W - 1), y)] - tmp[getIdx(min(x + 1, W - 1), y)] * tmp[getIdx(min(x + 1, W - 1), max(y - 1, 0))] * tmp[getIdx(x, max(y - 1, 0))])
      c += (tmp[getIdx(x, max(y - 1, 0))] - tmp[getIdx(x, max(y - 1, 0))] * tmp[getIdx(max(x - 1, 0), max(y - 1, 0))] * tmp[getIdx(max(x - 1, 0), y)])
      c += (tmp[getIdx(max(x - 1, 0), y)] - tmp[getIdx(max(x - 1, 0), y)] * tmp[getIdx(max(x - 1, 0), min(y + 1, H - 1))] * tmp[getIdx(x, min(y + 1, H - 1))])
      c += (tmp[getIdx(x, min(y + 1, H - 1))] - tmp[getIdx(x, min(y + 1, H - 1))] * tmp[getIdx(min(x + 1, W - 1), min(y + 1, H - 1))] * tmp[getIdx(min(x + 1, W - 1), y)])
      dst[getIdx(x, y)] = c
    }
    return dst
  }
}