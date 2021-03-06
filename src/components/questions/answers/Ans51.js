import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.51
 * モルフォロジー勾配
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
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
    let erode = new Array(image.width * image.height).fill(0)
    let dilate = new Array(image.width * image.height).fill(0)
    let t = this.threshold(src1.data)
    const kernel = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      bin[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2]) < t ? 0 : 255
    }
    this.adaptKernel(bin.slice(), erode, image.width, image.height, kernel, (e) => {
      if (e < 255 * 4) return 0
      else return 255
    })
    this.adaptKernel(bin.slice(), dilate, image.width, image.height, kernel, (e) => {
      if (e >= 255) return 255
    })
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      let p = Math.abs(erode[j] - dilate[j])
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = p
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
  /**
   * 大津の2値化
   * @param {ImageData} src
   */
  threshold(src) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let histgram = Array(256).fill(0)
    let t = 0
    let max = 0

    for (let i = 0; i < src.length; i += 4) {
      let g = ~~grayscale(src[i], src[i + 1], src[i + 2])
      histgram[g]++
    }

    for (let i = 0; i < 256; i++) {
      let w1 = 0
      let w2 = 0
      let sum1 = 0
      let sum2 = 0
      let m1 = 0
      let m2 = 0
      for (let j = 0; j <= i; ++j) {
        w1 += histgram[j]
        sum1 += j * histgram[j]
      }
      for (let j = i + 1; j < 256; ++j) {
        w2 += histgram[j]
        sum2 += j * histgram[j]
      }
      if (w1) {
        m1 = sum1 / w1
      }
      if (w2) {
        m2 = sum2 / w2
      }
      let tmp = (w1 * w2 * (m1 - m2) * (m1 - m2))
      if (tmp > max) {
        max = tmp
        t = i
      }
    }
    return t
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
      for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
        let _i = i - d
        let _j = j - d
        let srcIdx = getIndex((x + _j), (y + _i))
        k += kernel[i][j] * src[srcIdx]
      }
      let dstIdx = getIndex(x, y)
      if (callback != null) {
        k = callback(k)
        if (k !== undefined) {
          dst[dstIdx] = k
        }
      } else{
        dst[dstIdx] = k
      }
    }
  }
}