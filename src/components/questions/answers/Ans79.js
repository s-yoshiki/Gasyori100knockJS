import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.77
 * ガボールフィルタ
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas1, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = canvas1.getContext("2d")
    const W = image.width
    const H = image.height
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(image.width, image.height)
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let gray = new Array(H * W).fill(0)
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      let c = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = c
      dst1.data[i + 3] = 255
      gray[j] = c
    }
    ctx1.putImageData(dst1, 0, 0)
    const kSize = 11
    let angles = [0, 45 , 90, 135]
    for (let key in angles) {
      let kernel = this.getGaborKernel({
        kSize,
        sigma: 1.5,
        gamma: 1.2,
        lambda: 3.0,
        psi: 0,
        angle: angles[key],
      })
      let out = new Array(H * W)
      this.adaptKernel(gray, out, W, H, kernel)
      let max = Math.max(...out)
      out = out.map(e => {
        // 正規化
        e = e / max * 255
        if (e > 255) return 255
        if (e < 0) return 0
        return Math.floor(e)
      })
      console.log(out)
      for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = out[j]
      }
      ctx1.putImageData(dst1, 0, 0)

      let url = canvas1.toDataURL()
      this.showMessage(
        `<img src="${url}"/> deg : ${angles[key]}`,
        true
      )
    }
  }
  /**
   * ガボールフィルタ
   * @param {Object} arg 
   * @return {Array} images array
   */
  getGaborKernel(arg) {
    const kSize = arg.kSize
    const getIdx = (x, y) => {
      x = Math.min(Math.max(x, 0), kSize - 1)
      y = Math.min(Math.max(y, 0), kSize - 1)
      return y * kSize + x
    }
    const sum = (arr) => {
      let result = 0
      arr.forEach(e => {
        result += e
      })
      return result
    }
    const sigma = arg.sigma
    const gamma = arg.gamma
    const lambda = arg.lambda
    const psi = arg.psi
    const angle = arg.angle
    const d = ~~(kSize / 2)
    let out = new Array(kSize * kSize).fill(0)
    for (let y = 0; y < kSize; y++) for (let x = 0; x < kSize; x++) {
      let px = x - d
      let py = y - d
      let theta = angle / 180 * Math.PI
      let _x = Math.cos(theta) * px + Math.sin(theta) * py
      let _y = -Math.sin(theta) * px + Math.cos(theta) * py
      out[getIdx(x, y)] = Math.exp(-(_x ** 2 + gamma ** 2 * _y ** 2) / (2 * sigma ** 2)) * Math.cos(2 * Math.PI * _x / lambda + psi)
    }
    let sumGabor = sum(out.slice().map(Math.abs))
    out = out.slice().map(e => e / sumGabor)
    let kernel = []
    for (let i = 0; i < kSize; i++) {
      let tmp = []
      for (let j = 0; j < kSize; j++) {
        tmp.push(out[i * kSize + j])
      }
      kernel.push(tmp)
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
      } else {
        dst[dstIdx] = k
      }
    }
  }
}