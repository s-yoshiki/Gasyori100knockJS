import { BaseThreeCanvasComponent } from "./BaseComponents.js"
/**
 * Q.50
 * クロージング処理
 * @extends BaseThreeCanvasComponent
 */
export default class Ans50 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, canvas2, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx1 = canvas1.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(image.width, image.height)
    let ctx2 = canvas2.getContext("2d");
    ctx2.drawImage(image, 0, 0, image.width, image.height)
    let dst2 = ctx2.createImageData(image.width, image.height)
    let gray = new Array(image.width * image.height).fill(0)
    const kernel = [
      [0, 1, 0],
      [1, 0, 1],
      [0, 1, 0],
    ]
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      gray[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
    }
    let bin = this.cannyEdge(gray, image.width, image.height)
    let mol = bin.slice()
    this.adaptKernel(mol.slice(), mol, image.width, image.height, kernel, (e) => {
      if (e >= 255) return 255
    })
    this.adaptKernel(mol.slice(), mol, image.width, image.height, kernel, (e) => {
      if (e < 255 * 4) return 0
    })
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = bin[j]
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = mol[j]
      dst1.data[i + 3] = 255
      dst2.data[i + 3] = 255
    }

    ctx1.putImageData(dst1, 0, 0)
    ctx2.putImageData(dst2, 0, 0)
  }
  /**
   * フィルタを適用する
   * @param {Array} src 
   * @param {Array} dst 
   * @param {Number} imgWidth 
   * @param {Number} imgHeight 
   * @param {Array} kernel 
   */
  adaptKernel(src, dst, imgWidth, imgHeight, kernel, callback = null) {
    const getIndex = (x, y) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernelSize = kernel.length
    let d = Math.floor(kernelSize / 2)
    for (let x = 0; x < imgWidth; x++) for (let y = 0; y < imgHeight; y++) {
      let k = 0
      for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
        let _i = i - d
        let _j = j - d
        let srcIdx = getIndex((x + _j), (y + _i))
        k += kernel[i][j] * src[srcIdx]
      }
      let dstIdx = getIndex(x, y)
      if (callback != null) {
        k = callback(k)
        if (k !== undefined) {
          dst[dstIdx] = k
        }
      } else{
        dst[dstIdx] = k
      }
    }
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
    let d = Math.floor(kernelSize / 2)
    for (let y = 0; y < kernelSize; y++) for (let x = 0; x < kernelSize; x++) {
      let _x = x - d
      let _y = y - d
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
   * canny
   */
  cannyEdge(src, imgWidth, imgHeight,) {
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
    let gaussian = new Array(imgWidth * imgHeight).fill(0)
    let fx = new Array(imgWidth * imgHeight).fill(0)
    let fy = new Array(imgWidth * imgHeight).fill(0)
    let edge = new Array(imgWidth * imgHeight).fill(0)
    let angle = new Array(imgWidth * imgHeight).fill(0)
    let out = new Array(imgWidth * imgHeight).fill(0)
    this.adaptKernel(src, gaussian, imgWidth, imgHeight, gaussianKernel)
    this.adaptKernel(gaussian, fx, imgWidth, imgHeight, KSH)
    this.adaptKernel(gaussian, fy, imgWidth, imgHeight, KSV)
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
    this.nonMaximumSuppression(edge, angle, imgWidth, imgHeight)
    this.histeresisThreshold(edge, out, imgWidth, imgHeight, HT, LT)
    return out
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
}