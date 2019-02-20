import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, ThreeCanvasHistogramComponent
} from "./BaseComponents.js"
import config from "../configure.js"

export default null

/**
 * Q.21
 * 画像正規化 + ヒストグラム
 * @ThreeCanvasHistogramComponent
 */
export class Ans21 extends ThreeCanvasHistogramComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let pixelValues = new Array(255).fill(0)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

    let dMax = 255
    let dMin = 0
    let vMin = 255
    let vMax = 0

    const trans = (p) => (dMax - dMin) / (vMax - vMin) * (p - vMin) + dMin

    for (let i = 0; i < src.data.length; i += 4) {
      let p = parseInt(grayscale(src.data[i], src.data[i + 1], src.data[i + 2]))
      if (p > vMax) {
        vMax = p
      }
      if (p < vMin) {
        vMin = p
      }
    }

    for (let i = 0; i < src.data.length; i += 4) {
      let p = grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
      p = parseInt(trans(p))
      dst.data[i] = trans(src.data[i])
      dst.data[i + 1] = trans(src.data[i + 1])
      dst.data[i + 2] = trans(src.data[i + 2])
      dst.data[i + 3] = 255
      pixelValues[p]++
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}

/**
 * Q.22
 * ヒストグラム操作
 * @ThreeCanvasHistogramComponent
 */
export class Ans22 extends ThreeCanvasHistogramComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let pixelValues = new Array(255).fill(0)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    let m0 = 128
    let s0 = 52
    let m = 0
    let s = 0

    const trans = (p) => s0 / s * (p - m) + m0

    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
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
      grayScaleArr.push(
        parseInt(
          grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
        )
      )
    }

    s = std(grayScaleArr)
    m = grayScaleArr[
      Math.floor(grayScaleArr.length / 2)
    ]

    for (let i = 0; i < src.data.length; i += 4) {
      let p = grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
      p = parseInt(trans(p))
      dst.data[i] = trans(src.data[i])
      dst.data[i + 1] = trans(src.data[i + 1])
      dst.data[i + 2] = trans(src.data[i + 2])
      dst.data[i + 3] = 255
      pixelValues[p]++
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}