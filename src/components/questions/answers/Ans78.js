import BasePagesComponent from "./BaseComponents.js"
import { OneCanvasTemplate } from "../templates"
/**
 * Q.78
 * ガボールフィルタの回転
 * @extends BasePagesComponent
 */
export default class extends BasePagesComponent {
  constructor() {
    super()
    super.setTemplate(OneCanvasTemplate)
    this.kSize = 111
  }
  /**
   * DOMの初期処理
   * @access private
   * @param {Document} self 
   */
  _initObject(self) {
    let canvas = self.$refs["canvas1"]
    canvas.width = canvas.height = this.kSize
    self.$refs["button-run"].addEventListener("click", () => {
      this.main(canvas)
    })
  }
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas) {
    const kSize = this.kSize
    let ctx1 = canvas.getContext("2d")
    let angles = [0, 45 , 90, 135]
    for (let i in angles) {
      let out = this.gabor({
        kSize,
        sigma: 10,
        gamma: 1.2,
        lambda: 10.0,
        psi: 1,
        angle: angles[i],
      })
      canvas.width = canvas.height = kSize
      let dst1 = ctx1.createImageData(kSize, kSize)
      for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = out[j]
        dst1.data[i + 3] = 255
      }
      ctx1.putImageData(dst1, 0, 0)
      let url = canvas.toDataURL()
      this.showMessage(
        `<img src="${url}"/> deg : ${angles[i]}`,
        true
      )
    }
  }
  /**
   * ガボールフィルタ
   * @param {Object} arg 
   */
  gabor(arg) {
    const kSize = arg.kSize
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
    const sigma = arg.sigma
    const gamma = arg.gamma
    const lambda = arg.lambda
    const psi = arg.psi
    const angle = arg.angle
    const d = ~~(kSize / 2)
    let out = new Array(kSize * kSize).fill(0)
    for (let y = 0; y < kSize; y++) for (let x = 0; x < kSize; x++) {
      let px = x - d
      let py = y - d
      let theta = angle / 180 * Math.PI
      let _x = Math.cos(theta) * px + Math.sin(theta) * py
      let _y = -Math.sin(theta) * px + Math.cos(theta) * py
      out[getIdx(x, y)] = Math.exp(-(_x ** 2 + gamma ** 2 * _y ** 2) / (2 * sigma ** 2)) * Math.cos(2 * Math.PI * _x / lambda + psi)
    }
    let sumGabor = sum(out.slice().map(Math.abs))
    out = out.slice().map(e => e / sumGabor)
    let minGabor = Math.min(...out)
    out = out.map(e => e - minGabor)
    let maxGabor = Math.max(...out)
    out = out.map(e => e / maxGabor * 255)
    return out
  }
}