import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.76
 * 顕著性マップ
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const diff = (a, b) => {
      let result = []
      for (let i = 0; i < a.length; i++) {
        result.push(a[i] - b[i])
      }
      return result
    }
    const add = (a, b) => {
      let result = []
      for (let i = 0; i < a.length; i++) {
        result.push(a[i] + b[i])
      }
      return result
    }
    const abs = (a) => Math.abs(a)
    let ctx = canvas.getContext("2d")
    canvas.width = image.width
    canvas.height = image.height
    let pyramid = []
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let gray = ctx.createImageData(image.width, image.height)
    for (let i = 0; i < src.data.length; i += 4) {
      gray.data[i] = gray.data[i + 1] = gray.data[i + 2] = grayscale(
        src.data[i], src.data[i + 1], src.data[i + 2]
      )
      gray.data[i + 3] = 255
    }
    for (let i = 1; i <= 32; i *= 2) {
      canvas.width = image.width
      canvas.height = image.height
      ctx.putImageData(gray, 0, 0)
      this.bilinear(canvas, 1 / i)
      this.bilinear(canvas, i)
      let tmp = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let row = []
      for (let j = 0; j < tmp.data.length; j += 4) {
        row.push(tmp.data[j])
      }
      pyramid.push(row)
    }
    let out = diff(pyramid[0], pyramid[1]).map(abs)
    out = add(out, diff(pyramid[0], pyramid[3]).map(abs))
    out = add(out, diff(pyramid[0], pyramid[5]).map(abs))
    out = add(out, diff(pyramid[1], pyramid[4]).map(abs))
    out = add(out, diff(pyramid[2], pyramid[3]).map(abs))
    out = add(out, diff(pyramid[3], pyramid[5]).map(abs))
    let k = Math.max(...out)
    let dst = ctx.createImageData(canvas.width, canvas.height)
    for (let i = 0, j = 0; i < dst.data.length; i += 4, j++) {
      dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = Math.round(out[j] / k * 255)
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
  /**
   * バイリニア補間
   * @param {Object} canvas 
   * @param {scale} scale 
   */
  bilinear(canvas, scale) {
    const srcWidth = canvas.width
    const srcHeight = canvas.height
    const dstWidth = canvas.width * scale
    const dstHeight = canvas.height * scale
    const getDstIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), dstWidth - 1)
      y = Math.min(Math.max(y, 0), dstHeight - 1)
      return y * dstWidth * 4 + x * 4 + channel
    }
    const getSrcIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), srcWidth - 1)
      y = Math.min(Math.max(y, 0), srcHeight - 1)
      return y * srcHeight * 4 + x * 4 + channel
    }
    const getWeight = (t1, t2) => {
      const d = Math.abs(t1 - t2);
      if (d > 1) {
        return 0;
      }
      return 1 - d;
    }
    let ctx = canvas.getContext("2d");
    let src = ctx.getImageData(0, 0, srcWidth, srcHeight)
    let dst = ctx.createImageData(dstWidth, dstHeight)
    canvas.width = dstWidth
    canvas.height = dstHeight
    const range = [0, 1]
    for (let x = 0; x < dstWidth; x++) for (let y = 0; y < dstHeight; y++) {
      let _x = x / scale
      let _y = y / scale
      let rangeX = range.map(i => i + Math.floor(_x));
      let rangeY = range.map(i => i + Math.floor(_y));
      let r, g, b
      r = g = b = 0

      for (let ry of rangeY) for (let rx of rangeX) {
        let weight = getWeight(ry, _y) * getWeight(rx, _x)
        r += src.data[getSrcIndex(~~rx, ~~ry, 0)] * weight
        g += src.data[getSrcIndex(~~rx, ~~ry, 1)] * weight
        b += src.data[getSrcIndex(~~rx, ~~ry, 2)] * weight
      }
      dst.data[getDstIndex(x, y, 0)] = ~~r
      dst.data[getDstIndex(x, y, 1)] = ~~g
      dst.data[getDstIndex(x, y, 2)] = ~~b
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}