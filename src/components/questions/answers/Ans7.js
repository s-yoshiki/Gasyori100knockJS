import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.7
 * 平均プーリング
 * @extends BaseTwoCanvasComponent
 */
export default class Ans7 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let w = image.width
    let h = image.height
    let dx = w / 16
    let dy = h / 16

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const blurColor = (x, y, w, h) => {
      let ctx = canvas.getContext('2d')
      let r, g, b
      r = g = b = 0

      let src = ctx.getImageData(x, y, w, h);
      let dst = ctx.createImageData(w, h)

      for (let i = 0; i < src.data.length; i += 4) {
        r += src.data[i]
        g += src.data[i + 1]
        b += src.data[i + 2]
      }

      r /= src.data.length / 4
      g /= src.data.length / 4
      b /= src.data.length / 4

      r = Math.ceil(r)
      g = Math.ceil(g)
      b = Math.ceil(b)

      for (let i = 0; i < src.data.length; i += 4) {
        dst.data[i] = r
        dst.data[i + 1] = g
        dst.data[i + 2] = b
        dst.data[i + 3] = 255
      }

      ctx.putImageData(dst, x, y)
    }

    for (let i = 0; i < canvas.width; i += dx) {
      for (let j = 0; j < canvas.height; j += dy) {
        blurColor(i, j, dx, dy)
      }
    }
  }
}