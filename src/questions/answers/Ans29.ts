import { ThreeCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
import { inverse } from '@/lib/matrix'
/**
 * Q.29
 * アフィン変換(平行移動)
 * @extends TwoCanvasAnswer
 */
export default class extends ThreeCanvasAnswer {
  /**
   * メイン
   */
  main(canvas1: HTMLCanvasElement, canvas2: HTMLCanvasElement, image: HTMLImageElement) {
    const scaleX = 1.3
    const scaleY = 0.8
    const tx = 30
    const ty = -30
    const H1 = [
      [scaleX, 0, 0],
      [0, scaleY, 0],
      [0, 0, 1],
    ]
    const H2 = [
      [scaleX, 0, tx],
      [0, scaleY, ty],
      [0, 0, 1],
    ]

    this.trans(canvas1, image, H1)
    this.trans(canvas2, image, H2)
  }
  /**
   * Homography Translation
   * @param {Array} H 3x3 - Homography
   */
  trans(canvas: HTMLCanvasElement, image: HTMLImageElement, H: number[][]) {
    const getDstIndex = (x: number, y: number, channel: number) => {
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x: number, y: number, channel: number) => {
      return y * image.width * 4 + x * 4 + channel
    }

    const scaleX = H[0][0]
    const scaleY = H[1][1]

    const ctx = context2d(canvas)

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const src = ctx.getImageData(0, 0, image.width, image.height)

    canvas.width = ~~(image.width * scaleX)
    canvas.height = ~~(image.height * scaleY)
    const dst = ctx.createImageData(canvas.width, canvas.height)

    const _H = inverse(H)

    for (let x = 0; x < canvas.width; x++)
      for (let y = 0; y < canvas.height; y++) {
        const p = [x, y, 1]
        const a = [0, 0, 0]
        for (let i = 0; i < _H.length; i++) {
          let tmp = 0
          for (let j = 0; j < p.length; j++) {
            tmp += p[j] * _H[i][j]
          }
          a[i] = ~~tmp
        }
        for (let c = 0; c < 3; c++) {
          if (0 < a[0] && a[0] < canvas.width) {
            dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
          }
        }
        dst.data[getDstIndex(x, y, 3)] = 255
      }
    ctx.putImageData(dst, 0, 0)
  }
}
