import { FourCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.32
 * フーリエ変換
 * @extends FourCanvasAnswer
 */
export default class extends FourCanvasAnswer {
  /**
   * メイン
   */
  main(
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    canvas3: HTMLCanvasElement,
    image: HTMLImageElement,
  ) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = context2d(canvas1)
    const ctx2 = context2d(canvas2)
    const ctx3 = context2d(canvas3)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src = [] //グレースケール成分を格納する
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    const dst2 = ctx2.createImageData(canvas2.width, canvas3.height)
    const dst3 = ctx3.createImageData(canvas3.width, canvas3.height)
    for (let i = 0; i < src1.data.length; i += 4) {
      const color = ~~grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    const [Re, Im] = this.dft2d(src, canvas1.width, canvas1.height)
    const dst = this.idft2d(Re, Im, canvas1.width, canvas1.height)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = ~~dst[j]
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)

    // パワースペクトル画像
    const max = Math.max.apply(null, Re.map(Math.abs))
    for (let i = 0, j = 0; i < dst3.data.length; i += 4, j++) {
      dst3.data[i] = dst3.data[i + 1] = dst3.data[i + 2] = ~~((Math.abs(Re[j]) / max) * 255)
      dst3.data[i + 3] = 255
    }
    for (let i = 0, j = 0; i < dst3.data.length; i += 4, j++) {
      dst3.data[i] = dst3.data[i + 1] = dst3.data[i + 2] = ~~((Math.abs(Re[j]) / max) * 255)
      dst3.data[i + 3] = 255
    }
    ctx3.putImageData(dst3, 0, 0)
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Number} imgWidth canvas width
   * @param {Number} imgHeight canvas height
   */
  dft2d(src: number[], imgWidth: number, imgHeight: number) {
    const W = imgWidth
    const H = imgHeight
    const wx0 = (2 * Math.PI) / W
    const wy0 = (2 * Math.PI) / H
    const Re = new Array(src.length)
    const Im = new Array(src.length)
    for (let v = 0; v < H; v++)
      for (let u = 0; u < W; u++) {
        const uvIdx = W * v + u
        Re[uvIdx] = 0
        Im[uvIdx] = 0
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) {
            const xyIdx = W * y + x
            Re[uvIdx] += src[xyIdx] * Math.cos(-wx0 * x * u - wy0 * y * v)
            Im[uvIdx] += src[xyIdx] * Math.sin(-wx0 * x * u - wy0 * y * v)
          }
        Re[uvIdx] /= W * H
        Im[uvIdx] /= W * H
      }
    return [Re, Im]
  }
  /**
   * 2次元離散逆フーリエ変換
   * @param {Number} imgWidth canvas width
   * @param {Number} imgHeight canvas height
   */
  idft2d(Re: number[], Im: number[], imgWidth: number, imgHeight: number) {
    const W = imgWidth
    const H = imgHeight
    const wx0 = (2 * Math.PI) / W
    const wy0 = (2 * Math.PI) / H
    const dst = new Array(W * H)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const xyIdx = W * y + x
        dst[xyIdx] = 0
        for (let v = 0; v < H; v++)
          for (let u = 0; u < W; u++) {
            dst[xyIdx] +=
              Re[W * v + u] * Math.cos(wx0 * x * u + wy0 * y * v) -
              Im[W * v + u] * Math.sin(wx0 * x * u + wy0 * y * v)
          }
      }
    return dst
  }
}
