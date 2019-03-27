import { BaseThreeCanvasComponent } from "./BaseComponents.js"
/**
 * Q.41
 * Cannyエッジ検出 (Step.1) エッジ強度
 * @extends BaseThreeCanvasComponent
 */
export default class Ans41 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, image) {
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
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(image.width, image.height)
    let dst2 = ctx2.createImageData(image.width, image.height)
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
    let tan = new Array(image.width * image.height).fill(0)
    this.adaptKernel(gray, gaussian, image.width, image.height, gaussianKernel)
    this.adaptKernel(gaussian, fx, image.width, image.height, KSV)
    this.adaptKernel(gaussian, fy, image.width, image.height, KSH)

    for (let i = 0; i < fx.length; i++) {
      edge[i] = Math.sqrt(Math.pow(fx[i], 2) + Math.pow(fx[i], 2))
      if (edge[i] == 0) {
        edge[i] = 1e-5
      }
      let t = Math.atan(fy[i] / fx[i])
      if (-0.4142 < t && t <= 0.4142) tan[i] = 0
      else if (0.4142 < t && t <= 2.4142) tan[i] = 45
      else if (Math.abs(t) >= 2.4142) tan[i] = 90
      else if (-2.4142 < t && t <= -0.4142) tan[i] = 135
    }

    for (let i = 0, j = 0; i < src1.data.length; i+= 4, j++) {
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = edge[j]
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = tan[j]
      dst1.data[i + 3] = dst2.data[i + 3] = 255
    }

    ctx1.putImageData(dst1, 0, 0)
    ctx2.putImageData(dst2, 0, 0)
  }
  /**
   * ガウシアンカーネル生成
   * @param {double} kernelSize 
   * @param {double} sigma 
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
   * @param {int} imgWidth 
   * @param {int} imgHeight 
   * @param {Array} kernel 
   */
  adaptKernel(src, dst, imgWidth, imgHeight, kernel) {
    const getIndex = (x, y) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    // console.log(src)
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
}
