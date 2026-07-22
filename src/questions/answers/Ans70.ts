import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.70
 * カラートラッキング
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * メイン
   */
  main(canvas1: HTMLCanvasElement, image: HTMLImageElement) {
    const ctx1 = context2d(canvas1)
    const width = image.width
    const height = image.height
    ctx1.drawImage(image, 0, 0, width, height)
    const src1 = ctx1.getImageData(0, 0, width, height)
    const dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    for (let i = 0; i < src1.data.length; i += 4) {
      const c = this.rgb2hsv([src1.data[i], src1.data[i + 1], src1.data[i + 2]])
      if (180 <= c[0] && c[0] <= 260) {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = 255
      } else {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = 0
      }
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
  /**
   * rgb -> hsv
   * @return {array} hsv
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
}
