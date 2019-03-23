import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, ThreeCanvasHistogramComponent, BaseFourCanvasComponent
} from "./BaseComponents.js"
import config from "../configure.js"

import math from "mathjs"

export default null

/**
 * Q.31
 * アフィン変換(スキュー)
 * @BaseTwoCanvasComponent
 */
export class Ans31 extends BaseFourCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, canvas3, image) {
    let dx = 30
    let a = dx / image.height
    let tx = 0
    let ty = 0
    const H1 = [
      [1, a, tx],
      [0, 1, ty],
      [0, 0, 1],
    ]
    const H2 = [
      [1, 0, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    const H3 = [
      [1, a, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    this.trans(canvas1, image, H1)
    this.trans(canvas2, image, H2)
    this.trans(canvas3, image, H3)
  }
  /**
   * Homography Translation
   * @param {canvas} canvas 
   * @param {Image} image 
   * @param {Array} H 3x3 - Homography
   */
  trans(canvas, image, H) {
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

    const calcHomography = (Hx, x, y) => {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < Hx.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * Hx[i][j]
        }
        a[i] = ~~tmp
      }
      return a
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    let [width, height] = calcHomography(H, image.width, image.height).map(e => ~~e)
    canvas.width = width
    canvas.height = height

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
        if ((0 < a[0] && a[0] < image.width) && (0 < a[1] && a[1] < image.height)) {
          dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
        }
      }
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.32
 * フーリエ変換
 * @BaseFourCanvasComponent
 */
export class Ans32 extends BaseFourCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, canvas3, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    let ctx3 = canvas3.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src = [] //グレースケール成分を格納する
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    let dst2 = ctx2.createImageData(canvas2.width, canvas3.height)
    let dst3 = ctx3.createImageData(canvas3.width, canvas3.height)
    for (let i = 0; i < src1.data.length; i += 4) {
      let color = ~~grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let [Re, Im] = this.dft(src)
    let [Re2, Im2] = this.idft(Re, Im)

    Re2 = Re2.reverse()

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = ~~Re2[j]
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)

    // パワースペクトル画像
    let max = Math.max.apply(null, Re.map(Math.abs));
    for (let i = 0, j = 0; i < dst3.data.length; i += 4, j++) {
      dst3.data[i] = dst3.data[i + 1] = dst3.data[i + 2] = ~~(Math.abs(Re[j]) / max * 255)
      dst3.data[i + 3] = 255
    }
    for (let i = 0, j = 0; i < dst3.data.length; i += 4, j++) {
      dst3.data[i] = dst3.data[i + 1] = dst3.data[i + 2] = ~~(Math.abs(Re[j]) / max * 255)
      dst3.data[i + 3] = 255
    }
    ctx3.putImageData(dst3, 0, 0)
  }
  /**
   * 離散フーリエ変換
   * @param {Array} arr 入力画像
   */
  dft(arr) {
    let Re = []
    let Im = []
    let N = arr.length
    // DFTの計算
    for (let j = 0; j < N; ++j) {
      let re = 0.0;
      let im = 0.0;
      for (let i = 0; i < N; ++i) {
        let theta = 2 * Math.PI / N * j * i
        re += arr[i] * Math.cos(theta)
        im += arr[i] * Math.sin(theta)
      }
      Re.push(re)
      Im.push(im)
    }
    return [Re, Im]
  }
  /**
   * 離散逆フーリエ変換
   * @param {Array} srcRe 実数部
   * @param {Array} srcIm 虚数部
   */
  idft(srcRe, srcIm) {
    let Re = []
    let Im = []
    let N = srcRe.length
    for (let j = 0; j < N; ++j) {
      let re = 0.0;
      let im = 0.0;
      for (let i = 0; i < N; ++i) {
        let theta = 2 * Math.PI / N * j * i
        re += (srcRe[i] * Math.cos(theta) - srcIm[i] * Math.sin(theta)) / N
        im += (srcRe[i] * Math.sin(theta) + srcIm[i] * Math.cos(theta)) / N
      }
      Re.push(re)
      Im.push(im)
    }
    return [Re, Im]
  }
}
/**
 * Q.33
 * フーリエ変換 ローパスフィルタ
 * @BaseThreeCanvasComponent
 */
export class Ans33 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src = [] //グレースケール成分を格納する
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    let dst2 = ctx1.createImageData(canvas1.width, canvas1.height)

    for (let i = 0; i < src1.data.length; i += 4) {
      let color = ~~grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let [Re, Im] = this.dft(src)
    for (var i = 0; i < Re.length; i++) {
      let r = Re.length / 2
      if (i > 0.2 * r) {
        Re[i] = 0
      }
    }
    let [Re2, Im2] = this.idft(Re, Im)

    Re2 = Re2.reverse()

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = ~~Re2[j]
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)
  }
  /**
   * 離散フーリエ変換
   * @param {Array} arr 入力画像
   */
  dft(arr) {
    let Re = []
    let Im = []
    let N = arr.length
    // DFTの計算
    for (let j = 0; j < N; ++j) {
      let re = 0.0;
      let im = 0.0;
      for (let i = 0; i < N; ++i) {
        let theta = 2 * Math.PI / N * j * i
        re += arr[i] * Math.cos(theta)
        im += arr[i] * Math.sin(theta)
      }
      Re.push(re)
      Im.push(im)
    }
    return [Re, Im]
  }
  /**
   * 離散逆フーリエ変換
   * @param {Array} srcRe 実数部
   * @param {Array} srcIm 虚数部
   */
  idft(srcRe, srcIm) {
    let Re = []
    let Im = []
    let N = srcRe.length
    for (let j = 0; j < N; ++j) {
      let re = 0.0;
      let im = 0.0;
      for (let i = 0; i < N; ++i) {
        let theta = 2 * Math.PI / N * j * i
        re += (srcRe[i] * Math.cos(theta) - srcIm[i] * Math.sin(theta)) / N
        im += (srcRe[i] * Math.sin(theta) + srcIm[i] * Math.cos(theta)) / N
      }
      Re.push(re)
      Im.push(im)
    }
    return [Re, Im]
  }
}
