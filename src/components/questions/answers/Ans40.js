import {BaseTwoCanvasComponent} from "./BaseComponents.js"
import math from "mathjs"
/**
 * Q.40
 * JPEG圧縮 (Step.2)DCT+量子化
 * @extends BaseTwoCanvasComponent
 */
export default class Ans40 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, image) {
    const rgb2ycc = (r, g, b) => [
      0.299 * r + 0.5870 * g + 0.114 * b,
      -0.1687 * r - 0.3313 * g + 0.5 * b + 128,
      0.5 * r - 0.4187 * g - 0.0813 * b + 128
    ]
    const ycc2rgb = (y, cr, cb) => [
      y + (cb - 128) * 1.7718,
      y - (cb - 128) * 0.3441 - (cr - 128) * 0.7139,
      y + (cr - 128) * 1.402,
    ]
    let ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let srcY = []
    let srcCr = []
    let srcCb = []
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    const T = 8
    const K = 8

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      let [y, cr, cb] = rgb2ycc(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      srcY.push(y)
      srcCr.push(cr)
      srcCb.push(cb)
    }
    ctx1.putImageData(dst1, 0, 0)

    let dctY = this.dct2d(srcY, canvas1.width, canvas1.height, T, this.getQuantum1())
    let dstY = this.idct2d(dctY, canvas1.width, canvas1.height, T, K)
    let dctCr = this.dct2d(srcCr, canvas1.width, canvas1.height, T, this.getQuantum2())
    let dstCr = this.idct2d(dctCr, canvas1.width, canvas1.height, T, K)
    let dctCb = this.dct2d(srcCb, canvas1.width, canvas1.height, T, this.getQuantum2())
    let dstCb = this.idct2d(dctCb, canvas1.width, canvas1.height, T, K)

    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      let rgb = ycc2rgb(dstY[j], dstCr[j], dstCb[j]).map(e => {
        if (e > 255) {
          return 255
        }
        return e
      })
      dst1.data[i + 0] = rgb[0]
      dst1.data[i + 1] = rgb[1]
      dst1.data[i + 2] = rgb[2]
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let psnr = this.psnr(srcY, dstY, srcCr, dstCr, srcCb, dstCb, image.width, image.height)
    this.showMessage(
      JSON.stringify({
        psnr,
        bitrate: 1 * T * K ** 2 / (T ** 2)
      }, null, '\t')
    )
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Array} src 2次元配列
   * @param {Number} imgWidth canvas width 
   * @param {Number} imgHeight canvas height
   * @param {Number} T DCT係数
   */
  dct2d(src, imgWidth, imgHeight, T, Q) {
    const W = imgWidth
    const H = imgHeight
    // const Q = this.getQuantum()
    let dst = new Array(W * H).fill(0)
    let theta = Math.PI / (2 * T)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let v = 0; v < T; v++) for (let u = 0; u < T; u++) {
        let uvIdx = W * (v + yi) + (u + xi);
        for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
          let xyIdx = W * (y + yi) + (x + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) *
            Math.cos((2 * x + 1) * u * theta) *
            Math.cos((2 * y + 1) * v * theta)
          dst[uvIdx] += src[xyIdx] * w
        }
      }
      // 量子化
      let b = Array.from(new Array(T), () => new Array(T).fill(0))
      for (let yj = yi, _y = 0; yj < yi + T; yj++ , _y++) for (let xj = xi, _x = 0; xj < xi + T; xj++ , _x++) {
        b[_y][_x] = dst[W * yj + xj]
      }
      let m = math.dotDivide(b, Q).map(row => row.map(v => Math.round(v)))
      m = math.dotMultiply(m, Q)
      for (let yj = yi, _y = 0; yj < yi + T; yj++ , _y++) for (let xj = xi, _x = 0; xj < xi + T; xj++ , _x++) {
        dst[W * yj + xj] = b[_y][_x]
      }
    }
    return dst
  }
  /**
   * 2次元離散逆フーリエ変換
   * @param {Array} src
   * @param {Number} imgWidth canvas width
   * @param {Number} imgHeight canvas height
   * @param {Number} T DCT係数
   * @param {Number} K DCT係数
   */
  idct2d(src, imgWidth, imgHeight, T, K) {
    const W = imgWidth
    const H = imgHeight
    let theta = Math.PI / (2 * T)
    let dst = new Array(W * H).fill(0)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        let xyIdx = W * (y + yi) + (x + xi);
        for (let v = 0; v < K; v++) for (let u = 0; u < K; u++) {
          let uvIdx = W * (v + yi) + (u + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) * Math.cos((2 * x + 1) * u * theta) * Math.cos((2 * y + 1) * v * theta)
          dst[xyIdx] += src[uvIdx] * w
        }
      }
    }
    return dst
  }
  /**
   * @return {Array} quantum
   */
  /**
   * @return {Array} quantum
   */
  getQuantum1() {
    return [
      [16, 11, 10, 16, 24, 40, 51, 61],
      [12, 12, 14, 19, 26, 58, 60, 55],
      [14, 13, 16, 24, 40, 57, 69, 56],
      [14, 17, 22, 29, 51, 87, 80, 62],
      [18, 22, 37, 56, 68, 109, 103, 77],
      [24, 35, 55, 64, 81, 104, 113, 92],
      [49, 64, 78, 87, 103, 121, 120, 101],
      [72, 92, 95, 98, 112, 100, 103, 99]
    ]
  }
  /**
   * @return {Array} quantum
   */
  getQuantum2() {
    return [
      [17, 18, 24, 47, 99, 99, 99, 99],
      [18, 21, 26, 66, 99, 99, 99, 99],
      [24, 26, 56, 99, 99, 99, 99, 99],
      [47, 66, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99]
    ]
  }
  /**
   * psnr算出
   * @param {Array} src 入力画像
   * @param {Array} dst 出力画像
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   */
  psnr(srcY, dstY, srcCr, dstCr, srcCb, dstCb, imgWidth, imgHeight) {
    let sum = 0
    let data = [
      [srcY, dstY],
      [srcCr, dstCr],
      [srcCb, dstCb],
    ]
    data.forEach(e => {
      let src = e[0]
      let dst = e[1]
      for (let i = 0; i < src.length; i++) {
        let d = Math.abs(src[i] - dst[i])
        sum += d ** d
      }
    })
    let mse = sum / (imgWidth * imgHeight)
    let ans = Math.log10(255 ** 2 / mse)
    return ans
  }
}