import { OneCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
import CanvasTools from "@/lib/CanvasTools"
/**
 * Q.84
 * 簡単な画像認識 (Step.1) 減色化 + ヒストグラム
 * @extends OneCanvasComponent
 */
export default class extends OneCanvasComponent {
  constructor() {
    super()
  }
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas) {
    const basename = (arg) => arg.split("/").reverse()[0]
    const trains = config.dataset.train.sort()
    for (let i = 0; i < trains.length; i++) {
      let image = new Image()
      image.src = trains[i]
      image.addEventListener('load', () => {
        let hist = this.getHistogram(canvas, image)
        canvas.height = 200
        CanvasTools.renderHistogram(canvas, hist)
        let url = canvas.toDataURL()
        this.showMessage(`
          <strong>${basename(trains[i])}</strong>
          <img src='${url}' style='height:200px;width:450px;'><img src='${trains[i]}'>
        `)
        canvas.style.width = canvas.style.height = 0
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