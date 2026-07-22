import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.5
 * HSV変換
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * rgb to hsv
   */
  rgb2hsv(rgb: number[]) {
    const r = rgb[0] / 255
    const g = rgb[1] / 255
    const b = rgb[2] / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const diff = max - min

    let h = 0

    switch (min) {
      case max:
        h = 0
        break
      case r:
        h = 60 * ((b - g) / diff) + 180
        break
      case g:
        h = 60 * ((r - b) / diff) + 300
        break
      case b:
        h = 60 * ((g - r) / diff) + 60
        break
    }

    const s = max == 0 ? 0 : diff / max
    const v = max

    return [h, s, v]
  }
  /**
   * hsv to rgb
   */
  hsv2rgb(hsv: number[]): [number, number, number] {
    const h = hsv[0]
    const s = hsv[1]
    const v = hsv[2]
    const c = v * s
    const hp = h / 60
    const x = c * (1 - Math.abs((hp % 2) - 1))

    let r = 0,
      g = 0,
      b = 0
    if (0 <= hp && hp < 1) {
      ;[r, g, b] = [c, x, 0]
    }
    if (1 <= hp && hp < 2) {
      ;[r, g, b] = [x, c, 0]
    }
    if (2 <= hp && hp < 3) {
      ;[r, g, b] = [0, c, x]
    }
    if (3 <= hp && hp < 4) {
      ;[r, g, b] = [0, x, c]
    }
    if (4 <= hp && hp < 5) {
      ;[r, g, b] = [x, 0, c]
    }
    if (5 <= hp && hp < 6) {
      ;[r, g, b] = [c, 0, x]
    }

    const m = v - c
    ;[r, g, b] = [r + m, g + m, b + m]

    r = Math.floor(r * 255)
    g = Math.floor(g * 255)
    b = Math.floor(b * 255)

    return [r, g, b]
  }
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const src = ctx.getImageData(0, 0, image.width, image.height)
    const dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      const r = src.data[i]
      const g = src.data[i + 1]
      const b = src.data[i + 2]

      const hsv = this.rgb2hsv([r, g, b])
      hsv[0] = (hsv[0] + 180) % 360
      const rgb = this.hsv2rgb(hsv)

      dst.data[i] = rgb[0]
      dst.data[i + 1] = rgb[1]
      dst.data[i + 2] = rgb[2]
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }
}
