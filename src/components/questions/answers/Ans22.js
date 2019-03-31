import { ThreeCanvasHistogramComponent } from "./BaseComponents.js"
/**
 * Q.22
 * ヒストグラム操作
 * @extends ThreeCanvasHistogramComponent
 */
export default class Ans22 extends ThreeCanvasHistogramComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let pixelValues = new Array(255).fill(0)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    let m0 = 128
    let s0 = 52
    let m = 97
    let s = 12

    const trans = (p) => s0 / s * (p - m) + m0

    // 標準偏差
    const std = (array) => {
      let average = array.reduce((previous, current) =>
        previous + current
      ) / array.length
      return Math.sqrt(
        array.map((current) => {
          let difference = current - average
          return difference ** 2
        }).reduce((previous, current) =>
          previous + current
        ) / array.length
      )
    }

    let grayScaleArr = []
    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        grayScaleArr.push(src.data[i + c])
      }
    }

    s = std(grayScaleArr)
    m = grayScaleArr.reduce((previous, current) =>
      previous + current
    ) / grayScaleArr.length

    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        dst.data[i + c] = parseInt(trans(src.data[i + c]), 10)
        pixelValues[dst.data[i + c]]++
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}