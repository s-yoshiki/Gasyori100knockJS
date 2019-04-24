import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.77
 * ガボールフィルタ
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  constructor() {
    super()
    this.setSrcImage(config.srcImage.thorino)
  }
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas1, image) {
    const W = image.width
    const H = image.height
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const multiply = (a, b) => {
      let result = []
      for (let i = 0; i < a.length; i++) {
        result.push(a[i] * b[i])
      }
      return result
    }
    const getIdx = (x, y) => {
      x = Math.min(Math.max(x, 0), W - 1)
      y = Math.min(Math.max(y, 0), H - 1)
      return y * W + x
    }
    const sobely = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ]
    const sobelx = [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1]
    ]
    const ctx1 = canvas1.getContext("2d")

    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let gray = new Array(H * W).fill(0)
    let Ix = new Array(H * W).fill(0)
    let Iy = new Array(H * W).fill(0)
    let hes = new Array(H * W).fill(0)
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      let c = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = c
      dst1.data[i + 3] = 255
      gray[j] = c
    }
    ctx1.putImageData(dst1, 0, 0)
    this.adaptKernel(gray, Iy, W, H, sobely)
    this.adaptKernel(gray, Ix, W, H, sobelx)
    let IxIy = multiply(Ix, Iy)
    let Ix2 = Ix.slice().map(e => e ** 2)
    let Iy2 = Iy.slice().map(e => e ** 2)
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) {
      hes[getIdx(x, y)] = Ix2[getIdx(x, y)] * Iy2[getIdx(x, y)] - IxIy[getIdx(x, y)] ** 2
    }
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) {
      let tmp = [
        hes[getIdx(x - 1, y - 1)], hes[getIdx(x, y - 1)], hes[getIdx(x + 1, y - 1)],
        hes[getIdx(x - 1, y)], hes[getIdx(x, y)], hes[getIdx(x + 1, y)],
        hes[getIdx(x - 1, y + 1)], hes[getIdx(x, y + 1)], hes[getIdx(x + 1, y + 1)],
      ]
      let m = Math.max(...tmp)
      if (hes[getIdx(x, y)] === m && hes[getIdx(x, y)] > Math.max(...hes) * 0.1) {
        ctx1.beginPath()
        ctx1.fillStyle = 'rgb(192, 80, 77)'
        ctx1.arc(x, y, 3, 0, Math.PI*2, false)
        ctx1.fill()
      }
    }
  }
  /**
   * フィルタを適用する
   * @param {Array} src 
   * @param {Array} dst 
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   * @param {Array} kernel 
   */
  adaptKernel(src, dst, imgWidth, imgHeight, kernel, callback = null) {
    const getIndex = (x, y) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernelSize = kernel.length
    let d = Math.floor(kernelSize / 2)
    for (let x = 0; x < imgWidth; x++) for (let y = 0; y < imgHeight; y++) {
      let k = 0
      let result = []
      for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
        let _i = i - d
        let _j = j - d
        let srcIdx = getIndex((x + _j), (y + _i))
        k += kernel[i][j] * src[srcIdx]
        result.push(
          kernel[i][j] * src[srcIdx]
        )
      }
      let dstIdx = getIndex(x, y)
      if (callback != null) {
        k = callback(result)
        if (k !== undefined) {
          dst[dstIdx] = k
        }
      } else {
        dst[dstIdx] = k
      }
    }
  }
}