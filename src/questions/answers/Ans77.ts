import { OneCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.77
 * ガボールフィルタ
 * @extends OneCanvasAnswer
 */
export default class extends OneCanvasAnswer {
  constructor() {
    super()
    this.kSize = 111
  }
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement) {
    const kSize = this.kSize
    const getIdx = (x: number, y: number) => {
      x = Math.min(Math.max(x, 0), kSize - 1)
      y = Math.min(Math.max(y, 0), kSize - 1)
      return y * kSize + x
    }
    const sum = (arr: number[]) => {
      let result = 0
      arr.forEach((e: number) => {
        result += e
      })
      return result
    }
    const sigma = 10
    const gamma = 1.2
    const lambda = 10.0
    const psi = 0
    const angle = 0
    const d = ~~(kSize / 2)
    let gabor = new Array(kSize * kSize).fill(0)
    for (let y = 0; y < kSize; y++)
      for (let x = 0; x < kSize; x++) {
        const px = x - d
        const py = y - d
        const theta = (angle / 180) * Math.PI
        const _x = Math.cos(theta) * px + Math.sin(theta) * py
        const _y = -Math.sin(theta) * px + Math.cos(theta) * py
        gabor[getIdx(x, y)] =
          Math.exp(-(_x ** 2 + gamma ** 2 * _y ** 2) / (2 * sigma ** 2)) *
          Math.cos((2 * Math.PI * _x) / lambda + psi)
      }
    const sumGabor = sum(gabor.slice().map(Math.abs))
    gabor = gabor.slice().map((e) => e / sumGabor)
    const minGabor = Math.min(...gabor)
    gabor = gabor.map((e) => e - minGabor)
    const maxGabor = Math.max(...gabor)
    gabor = gabor.map((e) => (e / maxGabor) * 255)
    const ctx1 = context2d(canvas)
    canvas.width = canvas.height = kSize
    const dst1 = ctx1.createImageData(kSize, kSize)
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = gabor[j]
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
}
