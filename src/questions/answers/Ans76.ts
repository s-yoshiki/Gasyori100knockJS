import { TwoCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
/**
 * Q.76
 * 顕著性マップ
 * @extends TwoCanvasAnswer
 */
export default class extends TwoCanvasAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement, image: HTMLImageElement) {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const diff = (a: number[], b: number[]) => {
      const result = []
      for (let i = 0; i < a.length; i++) {
        result.push(a[i] - b[i])
      }
      return result
    }
    const add = (a: number[], b: number[]) => {
      const result = []
      for (let i = 0; i < a.length; i++) {
        result.push(a[i] + b[i])
      }
      return result
    }
    const abs = (a: number) => Math.abs(a)
    const ctx = context2d(canvas)
    canvas.width = image.width
    canvas.height = image.height
    const pyramid = []
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const src = ctx.getImageData(0, 0, image.width, image.height)
    const gray = ctx.createImageData(image.width, image.height)
    for (let i = 0; i < src.data.length; i += 4) {
      gray.data[i] =
        gray.data[i + 1] =
        gray.data[i + 2] =
          grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
      gray.data[i + 3] = 255
    }
    for (let i = 1; i <= 32; i *= 2) {
      canvas.width = image.width
      canvas.height = image.height
      ctx.putImageData(gray, 0, 0)
      this.bilinear(canvas, 1 / i)
      this.bilinear(canvas, i)
      const tmp = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const row = []
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
    const k = Math.max(...out)
    const dst = ctx.createImageData(canvas.width, canvas.height)
    for (let i = 0, j = 0; i < dst.data.length; i += 4, j++) {
      dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = Math.round((out[j] / k) * 255)
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
  /**
   * バイリニア補間
   */
  bilinear(canvas: HTMLCanvasElement, scale: number) {
    const srcWidth = canvas.width
    const srcHeight = canvas.height
    const dstWidth = canvas.width * scale
    const dstHeight = canvas.height * scale
    const getDstIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), dstWidth - 1)
      y = Math.min(Math.max(y, 0), dstHeight - 1)
      return y * dstWidth * 4 + x * 4 + channel
    }
    const getSrcIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), srcWidth - 1)
      y = Math.min(Math.max(y, 0), srcHeight - 1)
      return y * srcHeight * 4 + x * 4 + channel
    }
    const getWeight = (t1: number, t2: number) => {
      const d = Math.abs(t1 - t2)
      if (d > 1) {
        return 0
      }
      return 1 - d
    }
    const ctx = context2d(canvas)
    const src = ctx.getImageData(0, 0, srcWidth, srcHeight)
    const dst = ctx.createImageData(dstWidth, dstHeight)
    canvas.width = dstWidth
    canvas.height = dstHeight
    const range = [0, 1]
    for (let x = 0; x < dstWidth; x++)
      for (let y = 0; y < dstHeight; y++) {
        const _x = x / scale
        const _y = y / scale
        const rangeX = range.map((i) => i + Math.floor(_x))
        const rangeY = range.map((i) => i + Math.floor(_y))
        let r, g, b
        r = g = b = 0

        for (const ry of rangeY)
          for (const rx of rangeX) {
            const weight = getWeight(ry, _y) * getWeight(rx, _x)
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
