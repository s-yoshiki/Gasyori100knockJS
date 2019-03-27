import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.19
 * LoGフィルタ
 * @extends BaseTwoCanvasComponent
 */
export default class Ans19 extends BaseTwoCanvasComponent {
  /**
   * 初期処理
   * @param {Document} self 
   */
  init() {
    // ノイズ画像セット
    this.setSrcImage(config.srcImage.noise)
  }
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    let kernel = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]
    let kernelSize = 3
    const s = 3
    for (let y = 0; y < kernel.length; y++) for (let x = 0; x < kernel.length; x++) {
      let _x = x - Math.floor(kernelSize / 2)
      let _y = y - Math.floor(kernelSize / 2)
      let k = (_x ** 2 + _y ** 2 - s ** 2) * Math.exp(-(_x ** 2 + _y ** 2) / (2 * (s ** 2)))
      kernel[y][x] = k
    }
    this.logFilter(canvas, image, kernel)
  }
  /**
   * LoGフィルタ
   * @param {canvas} canvas 
   * @param {image} image 
   * @param {array} kernel 
   */
  logFilter(canvas, image, kernel) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    const getIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }
    const toInt8 = (p) => {
      if (p > 255) return 255
      if (p < 0) return 0
      return p
    }
    const kernelSize = kernel.length

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let k = 0
      for (let c = 0; c < 3; c++) {
        for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
          let _i = i - Math.floor(kernelSize / 2)
          let _j = j - Math.floor(kernelSize / 2)
          k += kernel[i][j] * src.data[getIndex(x + _j, y + _i, c)]
        }
      }
      k = toInt8(k)
      dst.data[getIndex(x, y, 0)] = k
      dst.data[getIndex(x, y, 1)] = k
      dst.data[getIndex(x, y, 2)] = k
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}