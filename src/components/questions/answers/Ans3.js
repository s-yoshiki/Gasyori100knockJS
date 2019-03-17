import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, ThreeCanvasHistogramComponent
} from "./BaseComponents.js"
import config from "../configure.js"

import math from "mathjs"

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
      for (let n = 0; n < 3; n++) {
        let p = src.data[i + n]
        let v = parseInt(zMax / S * hSum[p])
        if (v > 255) {
          v = 255
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
        p = (1 / c * p) ** (1 / g)
        p *= 255
        dst.data[i + n] = p
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.25
 * 最近傍補間
 * @BaseTwoCanvasComponent
 */
export class Ans25 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    const getDstIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), image.width - 1)
      y = Math.min(Math.max(y, 0), image.height - 1)
      return y * image.width * 4 + x * 4 + channel
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    let scale = 1.5
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    let dst = ctx.createImageData(canvas.width, canvas.height)


    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let _x = parseInt(x / scale, 10)
      let _y = parseInt(y / scale, 10)
      dst.data[getDstIndex(x, y, 0)] = src.data[getSrcIndex(_x, _y, 0)]
      dst.data[getDstIndex(x, y, 1)] = src.data[getSrcIndex(_x, _y, 1)]
      dst.data[getDstIndex(x, y, 2)] = src.data[getSrcIndex(_x, _y, 2)]
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.26
 * Bi-linear補間
 * @BaseTwoCanvasComponent
 */
export class Ans26 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    const getDstIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), image.width - 1)
      y = Math.min(Math.max(y, 0), image.height - 1)
      return y * image.width * 4 + x * 4 + channel
    }

    const getWeight = (t1, t2) => {
      const d = Math.abs(t1 - t2);
      if (d > 1) {
        return 0;
      }
      return 1 - d;
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    const scale = 1.5
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    let dst = ctx.createImageData(canvas.width, canvas.height)

    const range = [0, 1]

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let _x = x / scale
      let _y = y / scale
      let rangeX = range.map(i => i + Math.floor(_x));
      let rangeY = range.map(i => i + Math.floor(_y));
      let r, g, b
      r = g = b = 0

      for (let ry of rangeY) for (let rx of rangeX) {
        let weight = getWeight(ry, _y) * getWeight(rx, _x)
        r += src.data[getSrcIndex(~~rx, ~~ry, 0)] * weight
        g += src.data[getSrcIndex(~~rx, ~~ry, 1)] * weight
        b += src.data[getSrcIndex(~~rx, ~~ry, 2)] * weight
      }
      dst.data[getDstIndex(x, y, 0)] = ~~r
      dst.data[getDstIndex(x, y, 1)] = ~~g
      dst.data[getDstIndex(x, y, 2)] = ~~b
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.27
 * Bi-cubic補間
 * @BaseTwoCanvasComponent
 */
export class Ans27 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    const getDstIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), image.width - 1)
      y = Math.min(Math.max(y, 0), image.height - 1)
      return y * image.width * 4 + x * 4 + channel
    }

    const getWeight = (t1, t2) => {
      const d = Math.abs(t1 - t2);
      if (d > 1) {
        return 0;
      }
      return 1 - d;
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    const scale = 1.5
    canvas.width = image.width * scale
    canvas.height = image.height * scale

    let dst = ctx.createImageData(canvas.width, canvas.height)

    const range = [-1, 0, 1, 2]

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let _x = x / scale
      let _y = y / scale
      let rangeX = range.map(i => i + Math.floor(_x));
      let rangeY = range.map(i => i + Math.floor(_y));
      let r, g, b
      r = g = b = 0

      for (let ry of rangeY) for (let rx of rangeX) {
        let weight = getWeight(ry, _y) * getWeight(rx, _x)
        r += src.data[getSrcIndex(~~rx, ~~ry, 0)] * weight
        g += src.data[getSrcIndex(~~rx, ~~ry, 1)] * weight
        b += src.data[getSrcIndex(~~rx, ~~ry, 2)] * weight
      }
      dst.data[getDstIndex(x, y, 0)] = ~~r
      dst.data[getDstIndex(x, y, 1)] = ~~g
      dst.data[getDstIndex(x, y, 2)] = ~~b
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.28
 * アフィン変換(平行移動)
 * @BaseTwoCanvasComponent
 */
export class Ans28 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    const getIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(canvas.width, canvas.height)

    let tx = 30
    let ty = -30

    const H = [
      [1, 0, tx],
      [0, 1, ty],
      [0, 0, 1],
    ]

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * H[i][j]
        }
        a[i] = ~~tmp
      }
      for (let c = 0; c < 3; c++) {
        dst.data[getIndex(a[0], a[1], c)] = src.data[getIndex(x, y, c)]
      }
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.29
 * アフィン変換(平行移動)
 * @BaseTwoCanvasComponent
 */
export class Ans29 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, image) {

    const scaleX = 1.3
    const scaleY = 0.8

    let tx = 30
    let ty = -30

    const H1 = [
      [scaleX, 0, 0],
      [0, scaleY, 0],
      [0, 0, 1],
    ]
    const H2 = [
      [scaleX, 0, tx],
      [0, scaleY, ty],
      [0, 0, 1],
    ]

    this.trans(canvas1, image, H1)
    this.trans(canvas2, image, H2)
  }
  /**
   * Homography Translation
   * @param {canvas} canvas 
   * @param {Image} image 
   * @param {Array} H 3x3 - Homography
   */
  trans(canvas, image, H) {
    const getDstIndex = (x, y, channel) => {
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      return y * image.width * 4 + x * 4 + channel
    }

    let scaleX = H[0][0]
    let scaleY = H[1][1]

    let ctx = canvas.getContext("2d");

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    canvas.width = ~~(image.width * scaleX)
    canvas.height = ~~(image.height * scaleY)
    let dst = ctx.createImageData(canvas.width, canvas.height)

    let _H = math.inv(H)

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < _H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * _H[i][j]
        }
        a[i] = ~~tmp
      }
      for (let c = 0; c < 3; c++) {
        if ((0 < a[0] && a[0] < canvas.width)) {
          dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
        }
      }
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.30
 * アフィン変換(回転)
 * @BaseTwoCanvasComponent
 */
export class Ans30 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, image) {
    const calcHomography = (H, x, y) => {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * H[i][j]
        }
        a[i] = ~~tmp
      }
      return a
    }

    const deg = -30
    const rad = deg * Math.PI / 180

    const H1 = [
      [Math.cos(rad), -Math.sin(rad), 0],
      [Math.sin(rad), Math.cos(rad), 0],
      [0, 0, 1],
    ]

    let [cx, cy] = calcHomography(
      H1,
      canvas1.width / 2,
      canvas1.height / 2
    ).map(e => ~~e)

    const H2 = [
      [Math.cos(rad), -Math.sin(rad), -cx + ~~(canvas1.width / 2)],
      [Math.sin(rad), Math.cos(rad), -cy + ~~(canvas1.height / 2)],
      [0, 0, 1],
    ]
    this.trans(canvas1, image, H1)
    this.trans(canvas2, image, H2)
  }
  /**
   * Homography Translation
   * @param {canvas} canvas 
   * @param {Image} image 
   * @param {Array} H 3x3 - Homography
   */
  trans(canvas, image, H) {
    const getDstIndex = (x, y, channel) => {
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      return y * image.width * 4 + x * 4 + channel
    }

    let ctx = canvas.getContext("2d");

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    canvas.width = image.width
    canvas.height = image.height
    let dst = ctx.createImageData(canvas.width, canvas.height)

    let _H = math.inv(H)

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < _H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * _H[i][j]
        }
        a[i] = ~~tmp
      }
      for (let c = 0; c < 3; c++) {
        if ((0 < a[0] && a[0] < canvas.width)) {
          dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
        }
      }
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}