import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, HistogramComponent
} from "./BaseComponents.js"
import CanvasUtility from '@/lib/CanvasTools'
import config from "../configure.js"

export default null

/**
 * Q.71
 * マスキング
 * @BaseTwoCanvasComponent
 */
export class Ans71 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, image) {
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    let width = image.width
    let height = image.height

    canvas1.width = canvas2.width = width
    canvas1.height = canvas2.height = height

    ctx1.drawImage(image, 0, 0, width, height)
    ctx2.drawImage(image, 0, 0, width, height)
    let src1 = ctx1.getImageData(0, 0, width, height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    let src2 = ctx2.getImageData(0, 0, width, height)
    let dst2 = ctx2.createImageData(canvas2.width, canvas2.height)

    for (let i = 0; i < src1.data.length; i += 4) {
      let c = this.rgb2hsv([
        src1.data[i],
        src1.data[i + 1],
        src1.data[i + 2],
      ])
      if (180 <= c[0] && c[0] <= 260) {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = 255
      } else {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = 0
      }
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    for (let i = 0; i < src2.data.length; i += 4) {
      if (dst1.data[i] === 0) {
        dst2.data[i] = src2.data[i]
        dst2.data[i + 1] = src2.data[i + 1]
        dst2.data[i + 2] = src2.data[i + 2]
      } else {
        dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = 0
      }
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)
  }
  /**
   * rgb -> hsv
   * @param {array} rgb
   * @return {array} hsv
   */
  rgb2hsv(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let diff = max - min;

    let h = 0;

    switch (min) {
      case max: h = 0; break;
      case r: h = (60 * ((b - g) / diff)) + 180; break;
      case g: h = (60 * ((r - b) / diff)) + 300; break;
      case b: h = (60 * ((g - r) / diff)) + 60; break;
    }

    let s = max == 0 ? 0 : diff / max;
    let v = max;

    return [h, s, v];
  }
}
/**
 * Q.73
 * マスキング
 * @BaseTwoCanvasComponent
 */
export class Ans73 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)
    for (let i = 0; i < src.data.length; i += 4) {
      dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = grayscale(
        src.data[i], src.data[i + 1], src.data[i + 2]
      )
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
    this.bilinear(canvas, 0.5)
    this.bilinear(canvas, 2)
  }
  /**
   * バイリニア補間
   * @param {canvas} canvas 
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