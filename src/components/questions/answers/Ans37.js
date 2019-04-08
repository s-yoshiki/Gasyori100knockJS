import {BaseThreeCanvasComponent} from "./BaseComponents.js"
/**
 * Q.37
 * PSNR
 * @extends BaseThreeCanvasComponent
 */
export default class extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, canvas2, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src = [] //グレースケール成分を格納する
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    let dst2 = ctx1.createImageData(canvas1.width, canvas1.height)
    const T = 8
    const K = 4

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      let color = ~~grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let freq = this.dct2d(src, canvas1.width, canvas1.height, T)
    let dst = this.idct2d(freq, canvas1.width, canvas1.height, T, K)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      let value = Math.abs(dst[j]) > 255 ? 255 : Math.abs(dst[j])
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = value
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)

    let psnr = this.psnr(src, dst, image.width, image.height)

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
  dct2d(src, imgWidth, imgHeight, T) {
    const W = imgWidth
    const H = imgHeight
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
   * psnr算出
   * @param {Array} src 入力画像
   * @param {Array} dst 出力画像
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   */
  psnr(src, dst, imgWidth, imgHeight) {
    let sum = 0
    for (let i = 0; i < src.length; i++) {
      let d = Math.abs(src[i] - dst[i])
      sum += d ** d
    }
    let mse = sum / (imgWidth * imgHeight)
    let ans = Math.log10(255 ** 2 / mse)
    return ans
  }
}