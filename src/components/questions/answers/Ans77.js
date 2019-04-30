import { OneCanvasComponent } from "./BaseComponents.js"
/**
 * Q.77
 * ガボールフィルタ
 * @extends OneCanvasComponent
 */
export default class extends OneCanvasComponent {
  constructor() {
    super()
    this.kSize = 111
  }
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas) {
    const kSize = this.kSize
    const getIdx = (x, y) => {
      x = Math.min(Math.max(x, 0), kSize - 1)
      y = Math.min(Math.max(y, 0), kSize - 1)
      return y * kSize + x
    }
    const sum = (arr) => {
      let result = 0
      arr.forEach(e => {
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
    for (let y = 0; y < kSize; y++) for (let x = 0; x < kSize; x++) {
      let px = x - d
      let py = y - d
      let theta = angle / 180 * Math.PI
      let _x = Math.cos(theta) * px + Math.sin(theta) * py
      let _y = -Math.sin(theta) * px + Math.cos(theta) * py
      gabor[getIdx(x, y)] = Math.exp(-(_x ** 2 + gamma ** 2 * _y ** 2) / (2 * sigma ** 2)) * Math.cos(2 * Math.PI * _x / lambda + psi)
    }
    let sumGabor = sum(gabor.slice().map(Math.abs))
    gabor = gabor.slice().map(e => e / sumGabor)
    let minGabor = Math.min(...gabor)
    gabor = gabor.map(e => e - minGabor)
    let maxGabor = Math.max(...gabor)
    gabor = gabor.map(e => e / maxGabor * 255)
    let ctx1 = canvas.getContext("2d")
    canvas.width = canvas.height = kSize
    let dst1 = ctx1.createImageData(kSize, kSize)
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = gabor[j]
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)
  }
}