import { BaseThreeCanvasComponent } from "./BaseComponents.js"
/**
 * Q.15
 * Sobelフィルタ
 * @extends BaseThreeCanvasComponent
 */
export default class Ans15 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas1 
   * @param {Object} canvas2
   * @param {Object} image 
   */
  main(canvas1, canvas2, image) {
    const verticalKernel = [
      [1, 0, -1],
      [2, 0, -2],
      [1, 0, -1],
    ]
    const sideKernel = [
      [1, 2, 1],
      [0, 0, 0],
      [-1, -2, -1],
    ]
    this.sovelFilter(canvas1, image, verticalKernel)
    this.sovelFilter(canvas2, image, sideKernel)
  }
  /**
   * ソーベルフィルタ
   * @param {Object} canvas 
   * @param {Object} image 
   * @param {Array} kernel 
   */
  sovelFilter(canvas, image, kernel) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    const getIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
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
      dst.data[getIndex(x, y, 0)] = k
      dst.data[getIndex(x, y, 1)] = k
      dst.data[getIndex(x, y, 2)] = k
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}