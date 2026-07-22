import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.28
 * アフィン変換(平行移動)
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const getIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(canvas.width, canvas.height)

    const tx = 30
    const ty = -30

    const H = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ]

    for (let x = 0; x < canvas.width; x++)
      for (let y = 0; y < canvas.height; y++) {
        const p = [x, y, 1]
        const a = [0, 0, 0]
        for (let i = 0; i < H.length; i++) {
          let tmp = 0
          for (let j = 0; j < p.length; j++) {
            tmp += p[j] * H[i][j]
          }
          a[i] = ~~tmp
        }
        for (let c = 0; c < 3; c++) {
          dst.data[getIndex(a[0], a[1], c)] = src.data[getIndex(x, y, c)]
        }
        dst.data[getIndex(x, y, 3)] = 255
      }
    ctx.putImageData(dst, 0, 0)
  }
}
