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
      for (let c = 0; c < 3; c++) {
        let p = src.data[i + c]
        if (p > vMax) {
          vMax = p
        }
        if (p < vMin) {
          vMin = p
        }
      }
    }

    for (let i = 0; i < src.data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        dst.data[i+c] = parseInt(trans(src.data[i+c]), 10)
        pixelValues[dst.data[i+c]]++
      }
      dst.data[i + 3] = 255
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
      for (let c = 0; c  < 3; c++) {
        dst.data[i + c] = parseInt(trans(src.data[i + c]), 10)
        pixelValues[dst.data[i + c]]++
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}
/**
 * Q.23
 * ヒストグラム平坦化
 * @ThreeCanvasHistogramComponent
 */
export class Ans23 extends ThreeCanvasHistogramComponent {
  /**
   * 初期処理
   * 
   * @param {Document} self 
   */
  init() {
    // ノイズ画像セット
    this.setSrcImage(config.srcImage.default)
  }
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

    const zMax = 255
    const S = canvas.width * canvas.height * 3

    let h = new Array(255).fill(0)
    let hSum = new Array(255).fill(0)

    for (let n = 0; n < 3; n++) {
      for (let i = 0; i < src.data.length; i += 4) {
        h[src.data[i + n]]++
      }
    }

    for (let i = 0; i < hSum.length; i++) {
      for (let j = 0; j < i; j++) {
        hSum[i] += h[j]
      }
    }

    for (let i = 0; i < src.data.length; i += 4) {
      for (let n = 0; n < 3;n++) {
        let p = src.data[i + n]
        let v = parseInt(zMax / S * hSum[p])
        if (v > 255) {
          v= 255
        } else if (v < 0) {
          v = 0
        }
        dst.data[i + n] = v
        pixelValues[v]++
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
    this.renderChart(pixelValues)
  }
}
/**
 * Q.24
 * ガンマ補正
 * @BaseTwoCanvasComponent
 */
export class Ans24 extends BaseTwoCanvasComponent {
  /**
   * 初期処理
   * 
   * @param {Document} self 
   */
  init() {
    // ノイズ画像セット
    this.setSrcImage(config.srcImage.gamma)
  }
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    let c = 1.0
    let g = 2.2

    for (let i = 0; i < src.data.length; i += 4) {
      for (let n = 0; n < 3; n++) {
        let p = src.data[i + n]
        p /= 255
        p = (1/c * p) ** (1/g)
        p *= 255
        dst.data[i + n] = p
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}