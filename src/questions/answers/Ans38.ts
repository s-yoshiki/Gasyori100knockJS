import { ThreeCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
import { dotDivide, dotMultiply } from '@/lib/matrix'
/**
 * Q.38
 * JPEG圧縮 (Step.2)DCT+量子化
 * @extends ThreeCanvasAnswer
 */
export default class extends ThreeCanvasAnswer {
  /**
   * メイン
   */
  main(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, image: HTMLImageElement) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = context2d(canvas1)
    const ctx2 = context2d(canvas2)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src = [] //グレースケール成分を格納する
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    const dst2 = ctx1.createImageData(canvas1.width, canvas1.height)
    const T = 8
    const K = 8

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      const color = ~~grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    const freq = this.dct2d(src, canvas1.width, canvas1.height, T)
    const dst = this.idct2d(freq, canvas1.width, canvas1.height, T, K)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      const value = Math.abs(dst[j]) > 255 ? 255 : Math.abs(dst[j])
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = value
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)

    const psnr = this.psnr(src, dst, image.width, image.height)

    this.showMessage(
      JSON.stringify(
        {
          psnr,
          bitrate: (1 * T * K ** 2) / T ** 2,
        },
        null,
        '\t',
      ),
    )
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Array} src 2次元配列
   * @param {Number} imgWidth canvas width
   * @param {Number} imgHeight canvas height
   * @param {Number} T DCT係数
   */
  dct2d(src: number[], imgWidth: number, imgHeight: number, T: number) {
    const W = imgWidth
    const H = imgHeight
    const Q = this.getQuantum()
    const dst = new Array(W * H).fill(0)
    const theta = Math.PI / (2 * T)
    const k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T)
      for (let xi = 0; xi < imgWidth; xi += T) {
        for (let v = 0; v < T; v++)
          for (let u = 0; u < T; u++) {
            const uvIdx = W * (v + yi) + (u + xi)
            for (let y = 0; y < T; y++)
              for (let x = 0; x < T; x++) {
                const xyIdx = W * (y + yi) + (x + xi)
                const cu = u === 0 ? k : 1
                const cv = v === 0 ? k : 1
                const w =
                  ((2 * cu * cv) / T) *
                  Math.cos((2 * x + 1) * u * theta) *
                  Math.cos((2 * y + 1) * v * theta)
                dst[uvIdx] += src[xyIdx] * w
              }
          }
        // 量子化
        const b = Array.from(new Array(T), () => new Array(T).fill(0))
        for (let yj = yi, _y = 0; yj < yi + T; yj++, _y++)
          for (let xj = xi, _x = 0; xj < xi + T; xj++, _x++) {
            b[_y][_x] = dst[W * yj + xj]
          }
        const quantized = dotDivide(b, Q).map((row) => row.map((v) => Math.round(v)))
        const m = dotMultiply(quantized, Q)
        for (let yj = yi, _y = 0; yj < yi + T; yj++, _y++)
          for (let xj = xi, _x = 0; xj < xi + T; xj++, _x++) {
            dst[W * yj + xj] = m[_y][_x]
          }
      }
    return dst
  }
  /**
   * 2次元離散逆フーリエ変換
   * @param {Number} imgWidth canvas width
   * @param {Number} imgHeight canvas height
   * @param {Number} T DCT係数
   * @param {Number} K DCT係数
   */
  idct2d(src: number[], imgWidth: number, imgHeight: number, T: number, K: number) {
    const W = imgWidth
    const H = imgHeight
    const theta = Math.PI / (2 * T)
    const dst = new Array(W * H).fill(0)
    const k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T)
      for (let xi = 0; xi < imgWidth; xi += T) {
        for (let y = 0; y < T; y++)
          for (let x = 0; x < T; x++) {
            const xyIdx = W * (y + yi) + (x + xi)
            for (let v = 0; v < K; v++)
              for (let u = 0; u < K; u++) {
                const uvIdx = W * (v + yi) + (u + xi)
                const cu = u === 0 ? k : 1
                const cv = v === 0 ? k : 1
                const w =
                  ((2 * cu * cv) / T) *
                  Math.cos((2 * x + 1) * u * theta) *
                  Math.cos((2 * y + 1) * v * theta)
                dst[xyIdx] += src[uvIdx] * w
              }
          }
      }
    return dst
  }
  /**
   * @return {Array} quantum
   */
  getQuantum() {
    return [
      [16, 11, 10, 16, 24, 40, 51, 61],
      [12, 12, 14, 19, 26, 58, 60, 55],
      [14, 13, 16, 24, 40, 57, 69, 56],
      [14, 17, 22, 29, 51, 87, 80, 62],
      [18, 22, 37, 56, 68, 109, 103, 77],
      [24, 35, 55, 64, 81, 104, 113, 92],
      [49, 64, 78, 87, 103, 121, 120, 101],
      [72, 92, 95, 98, 112, 100, 103, 99],
    ]
  }
  /**
   * psnr算出
   * @param {Array} src 入力画像
   * @param {Array} dst 出力画像
   */
  psnr(src: number[], dst: number[], imgWidth: number, imgHeight: number) {
    let sum = 0
    for (let i = 0; i < src.length; i++) {
      const d = Math.abs(src[i] - dst[i])
      sum += d ** 2
    }
    const mse = sum / (imgWidth * imgHeight)
    const ans = 10 * Math.log10(255 ** 2 / mse)
    return ans
  }
}
