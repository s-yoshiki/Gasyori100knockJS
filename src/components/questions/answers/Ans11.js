import { BaseTwoCanvasComponent } from "./BaseComponents.js"

/**
 * Q.11
 * 平滑化フィルタ
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    const getIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const kernelSize = 3

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      for (let c = 0; c < 3; c++) {
        let k = []
        for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
          let _i = i - Math.floor(kernelSize / 2)
          let _j = j - Math.floor(kernelSize / 2)
          k.push(src.data[getIndex(x + _j, y + _i, c)])
        }
        let sum = k.reduce((prev, current) => {
          return prev + current;
        });
        dst.data[getIndex(x, y, c)] = sum / k.length
      }
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}