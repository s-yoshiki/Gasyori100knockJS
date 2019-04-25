import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.77
 * ガボールフィルタ
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  constructor() {
    super()
    this.setSrcImage(config.srcImage.thorino)
  }
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas1, image) {
    const W = image.width
    const H = image.height
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const norm = (arr, callback = null) => {
      let min = Math.min(...arr)
      let max = Math.max(...arr) - min
      let result = []
      for (let i = 0; i < arr.length; i++) {
        let tmp = Math.floor(arr[i] / max * 255)
        if (callback) {
          tmp = callback(tmp)
        }
        result.push(tmp)
      }
      return result
    }
    const getIdx = (x, y) => {
      x = Math.min(Math.max(x, 0), W - 1)
      y = Math.min(Math.max(y, 0), H - 1)
      return y * W + x
    }
    const sobely = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1]
    ]
    const sobelx = [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1]
    ]
    const gKernel = this.getGaussianKernel(3, 3)
    const ctx1 = canvas1.getContext("2d")
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let [
      gray, Ix, Iy, Ix2, Iy2, IxIy,
      hes, Ix2t, Iy2t, Ixyt
    ] = Array.from(new Array(10), () => new Array(H * W).fill(0))
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      let c = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = c
      dst1.data[i + 3] = 255
      gray[j] = c
    }
    ctx1.putImageData(dst1, 0, 0)
    this.adaptKernel(gray, Iy, W, H, sobely)
    this.adaptKernel(gray, Ix, W, H, sobelx)
    for (let i = 0; i < Ix.length; i++) {
      Ix2t[i] = Ix[i] ** 2
      Iy2t[i] = Iy[i] ** 2
      Ixyt[i] = Ix[i] * Iy[i]
    }
    this.adaptKernel(Ix2t, Ix2, W, H, gKernel)
    this.adaptKernel(Iy2t, Iy2, W, H, gKernel)
    this.adaptKernel(Ixyt, IxIy, W, H, gKernel)
    // わかりやすくするために画像を正規化
    let obj = [
      {
        data: norm(Ix2),
        label: 'Ix^2',
      },
      {
        data: norm(Iy2),
        label: 'Iy^2',
      },
      {
        data: norm(IxIy, (e) => e + 128),
        label: 'IxIy',
      }
    ]
    obj.forEach(e => {
      for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = e.data[j]
      }
      ctx1.putImageData(dst1, 0, 0)
      let url = canvas1.toDataURL()
      this.showMessage(
        `<strong>${e.label}</strong><br><img src="${url}"/>`,
        true
      )
    });
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
      let result = []
      for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
        let _i = i - d
        let _j = j - d
        let srcIdx = getIndex((x + _j), (y + _i))
        k += kernel[i][j] * src[srcIdx]
        result.push(
          kernel[i][j] * src[srcIdx]
        )
      }
      let dstIdx = getIndex(x, y)
      if (callback != null) {
        k = callback(result, k)
        if (k !== undefined) {
          dst[dstIdx] = k
        }
      } else {
        dst[dstIdx] = k
      }
    }
  }
}