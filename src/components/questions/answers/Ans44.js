import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.44
 * Hough変換・直線検出 (Step.1) Hough変換
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  /**
   * 初期処理
   */
  init() {
    this.setSrcImage(config.srcImage.thorino)
  }
  /**
   * メイン
   * @param {Object} canvas canvas object
   * @param {Object} image image object 
   */
  main(canvas1, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const gaussianKernel = this.getGaussianKernel(5, 1.4)
    const KSV = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1],
    ]
    const KSH = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1],
    ]
    const HT = 100
    const LT = 30
    let ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    // let dst1 = ctx1.createImageData(image.width, image.height)
    let gray = []

    for (let i = 0; i < src1.data.length; i += 4) {
      let color = grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      gray.push(color)
    }
    let gaussian = new Array(image.width * image.height).fill(0)
    let fx = new Array(image.width * image.height).fill(0)
    let fy = new Array(image.width * image.height).fill(0)
    let edge = new Array(image.width * image.height).fill(0)
    let angle = new Array(image.width * image.height).fill(0)
    let out = new Array(image.width * image.height).fill(0)
    this.adaptKernel(gray, gaussian, image.width, image.height, gaussianKernel)
    this.adaptKernel(gaussian, fx, image.width, image.height, KSH)
    this.adaptKernel(gaussian, fy, image.width, image.height, KSV)

    for (let i = 0; i < fx.length; i++) {
      edge[i] = Math.sqrt(Math.pow(fx[i], 2) + Math.pow(fy[i], 2))
      if (edge[i] == 0) {
        edge[i] = 1e-5
      }
      let t = Math.atan(fy[i] / fx[i])
      if (-0.4142 < t && t <= 0.4142) angle[i] = 0
      else if (0.4142 < t && t <= 2.4142) angle[i] = 45
      else if (Math.abs(t) >= 2.4142) angle[i] = 90
      else if (-2.4142 < t && t <= -0.4142) angle[i] = 135
    }
    this.nonMaximumSuppression(edge, angle, image.width, image.height)
    this.histeresisThreshold(edge, out, image.width, image.height, HT, LT)
    let [hough, dstWidth, dstHeight] = this.hough(out, image.width, image.height)

    canvas1.width = dstWidth
    canvas1.height = dstHeight
    let dst1 = ctx1.createImageData(dstWidth, dstHeight)

    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = hough[j]
      dst1.data[i + 3] = 255
    }

    ctx1.putImageData(dst1, 0, 0)
  }
  /**
   * ガウシアンカーネル生成
   * @param {Number} kernelSize 
   * @param {Number} sigma 
   */
  getGaussianKernel(kernelSize, sigma) {
    const gaussian = (x, y, sigma) => Math.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2))
    let w = 0
    let kernel = Array.from(new Array(kernelSize), () => new Array(kernelSize).fill(0))

    for (let y = 0; y < kernelSize; y++) for (let x = 0; x < kernelSize; x++) {
      let _x = x - ~~(kernelSize / 2)
      let _y = y - ~~(kernelSize / 2)
      let g = gaussian(_x, _y, sigma)
      kernel[y][x] = g
      kernel[y][x] /= sigma * (Math.sqrt(2 * Math.PI))
      w += kernel[y][x]
    }
    for (let y = 0; y < kernelSize; y++) for (let x = 0; x < kernelSize; x++) {
      kernel[y][x] /= w
    }
    return kernel
  }
  /**
   * フィルタを適用する
   * @param {Array} src 
   * @param {Array} dst 
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   * @param {Array} kernel 
   */
  adaptKernel(src, dst, imgWidth, imgHeight, kernel) {
    const getIndex = (x, y) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernelSize = kernel.length
    for (let x = 0; x < imgWidth; x++) for (let y = 0; y < imgHeight; y++) {
      let k = 0
      for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
        let _i = i - ~~(kernelSize / 2)
        let _j = j - ~~(kernelSize / 2)
        let srcIdx = getIndex((x + _j), (y + _i))
        k += kernel[i][j] * src[srcIdx]
      }
      let dstIdx = getIndex(x, y)
      dst[dstIdx] = k
    }
  }
  /**
   * Non-maximum suppression(NMS)
   * @param {Array} edge edge image
   * @param {Array} angle angle array
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   */
  nonMaximumSuppression(edge, angle, imgWidth, imgHeight) {
    const getIdx = (x, y) => x + y * imgWidth
    for (let y = 0; y < imgHeight; y++) for (let x = 0; x < imgWidth; x++) {
      let idx = getIdx(x, y)
      let dx1, dy1, dx2, dy2
      if (angle[idx] == 0) {
        [dx1, dy1, dx2, dy2] = [-1, 0, 1, 0]
      } else if (angle[idx] == 45) {
        [dx1, dy1, dx2, dy2] = [-1, 1, 1, -1]
      } else if (angle[idx] == 90) {
        [dx1, dy1, dx2, dy2] = [0, -1, 0, 1]
      } else if (angle[idx] == 135) {
        [dx1, dy1, dx2, dy2] = [-1, -1, 1, 1]
      }
      if (x === 0) {
        dx1 = Math.max(dx1, 0)
        dx2 = Math.max(dx2, 0)
      }
      if (x === imgWidth - 1) {
        dx1 = Math.min(dx1, 0)
        dx2 = Math.min(dx2, 0)
      }
      if (y === 0) {
        dy1 = Math.max(dy1, 0)
        dy2 = Math.max(dy2, 0)
      }
      if (y === imgHeight - 1) {
        dy1 = Math.min(dy1, 0)
        dy2 = Math.min(dy2, 0)
      }
      if (Math.max(edge[idx], edge[getIdx(x + dx1, y + dy1)], edge[getIdx(x + dx2, y + dy2)]) !== edge[idx]) {
        edge[idx] = 0
      }
    }
  }
  /**
   * ヒステリシス閾処理
   * @param {Array} src 
   * @param {Array} dst 
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   * @param {Number} HT 
   * @param {Number} LT 
   */
  histeresisThreshold(src, dst, imgWidth, imgHeight, HT, LT) {
    const getIndex = (x, y) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernel = [
      [1, 1, 1],
      [1, 0, 1],
      [1, 1, 1],
    ]
    for (let i = 0; i < src.length; i++) {
        if (src[i] >= HT) {
          dst[i] = 255
        } else if (src[i] <= LT) {
          dst[i] = 0
        } else {
          dst[i] = src[i]
        }
    }
    let kernelSize = kernel.length
    for (let x = 0; x < imgWidth; x++) for (let y = 0; y < imgHeight; y++) {
      let idx = getIndex(x, y)
      if ( HT < src[idx] || src[idx] < LT){
        continue
      }
      let k = []
      for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
        let _i = i - ~~(kernelSize / 2)
        let _j = j - ~~(kernelSize / 2)
        let _idx = getIndex((x + _j), (y + _i))
        k.push(kernel[i][j] * src[_idx])
      }
      let max = Math.max(...k)
      if (max >= HT) {
        dst[idx] = 255
      } else {
        dst[idx] = 0
      }
    }
  }
  /**
   * 
   * @param {Array} src 
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   * @return {Array} [hough, imgWidth, imgHeight]
   */
  hough(src, imgWidth, imgHeight) {
    // let drho = 1
    const dtheta = 1
    const radMax = 180
    const rhoMax = Math.ceil(Math.sqrt(imgHeight ** 2 + imgWidth ** 2))
    let hough = new Array(rhoMax * radMax).fill(0)

    for (let y = 0; y < imgHeight; y++) for (let x = 0; x < imgWidth; x++) {
      let idx = y * imgHeight + x
      if (src[idx] === 0) {
        continue
      }
      for (let theta = 0; theta < radMax; theta += dtheta) {
        let t = Math.PI / radMax * theta
        let rho = ~~(x * Math.cos(t) + y * Math.sin(t))
        hough[theta + rho * radMax] += 1
      }
    }
    return [hough, radMax, rhoMax]
  }
}
