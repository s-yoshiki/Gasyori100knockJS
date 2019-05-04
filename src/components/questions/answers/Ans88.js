import { OneCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.88
 * K-means (Step.1) 重心作成
 * @extends OneCanvasComponent
 */
export default class extends OneCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas) {
    // パス名が正解ラベルとなっている
    const add = (a, b) => {
      let result = new Array(a.length).fill(0)
      for (let i = 0; i < a.length; i++) {
        result[i] = a[i] + b[i]
      }
      return result
    }
    // 任意の乱数
    const getRandInt = ( min, max ) => {
      let random = Math.floor( Math.random() * (max + 1 - min) ) + min;
      return random;
    }
    const tests = config.dataset.tests.sort()
    let imagesCount = tests.length
    const testsData = new Array(tests.lengt)
    const event = () => {
      imagesCount--
      if (imagesCount > 0) {
        return
      }
      const classN = 2
      let classLength = new Array(classN).fill(0)
      let features = new Array(testsData.length).fill(0)
      let gravity = Array.from(new Array(classN), () => new Array(testsData[0].length).fill(0));
      for (let i = 0; i < testsData.length; i++) {
        let n = getRandInt(0, classN - 1)
        features[i] = n
        classLength[n]++
      }
      for (let i = 0; i < testsData.length; i++) {
        let idx = features[i]
        gravity[idx] = add(gravity[idx], testsData[i])
      }
      for (let i = 0; i < gravity.length; i++) {
        gravity[i] = gravity[i].map(e => e / classLength[i])
      }
      this.showMessage(`label: ${JSON.stringify(features)}`)
      this.showMessage(`gravity: ${JSON.stringify(gravity, null, '\t')}`)
    }
    for (let i = 0; i < tests.length; i++) {
      let image = new Image()
      image.src = tests[i]
      image.addEventListener('load', () => {
        let hist = this.getHistogram(canvas, image)
        testsData[i] = hist
        event()
      })
    }
  }
  /**
   * ヒストグラム算出
   * @param {Object} canvas 
   * @param {Object} image 
   */
  getHistogram(canvas, image) {
    const decreaseColor = (c) => {
      c = parseInt(Math.floor(c / 255 * 3), 10) 
      return c
    }
    const ctx1 = canvas.getContext("2d")
    let W,H
    W = canvas.width = image.width
    H = canvas.height = image.height
    ctx1.drawImage(image, 0, 0, W, H)
    let src = ctx1.getImageData(0, 0, W, H)
    let dst1 = ctx1.createImageData(W, H)
    let result = new Array(12).fill(0)
    for (let i = 0; i < dst1.data.length; i += 4) for (let j = 0; j < 3; j++) {
      let _i = i + j
      let c = decreaseColor(src.data[_i])
      result[j * 4 + c]++
    }
    return result
  }
}