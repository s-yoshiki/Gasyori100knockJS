import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, HistogramComponent
} from "./BaseComponents.js"
import config from "../configure.js"

export default null

/**
 * Q.11
 * @extends BaseTwoCanvasComponent
 */
export class Ans11 extends BaseTwoCanvasComponent {
  /**
   * 
   * @param {canvas} canvas 
   * @param {image} image 
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

/**
 * Q.12
 * @extends BaseTwoCanvasComponent
 */
export class Ans12 extends BaseTwoCanvasComponent {
  /**
   * 
   * @param {canvas} canvas 
   * @param {image} image 
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
    let kernel = [
      [1 / 3, 0, 0],
      [0, 1 / 3, 0],
      [0, 0, 1 / 3],
    ]

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      for (let c = 0; c < 3; c++) {
        let k = 0
        for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
          let _i = i - Math.floor(kernelSize / 2)
          let _j = j - Math.floor(kernelSize / 2)
          k += kernel[i][j] * src.data[getIndex(x + _j, y + _i, c)]
        }
        dst.data[getIndex(x, y, c)] = k
      }
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}

/**
 * Q.13
 * MAX-MINフィルタ
 * @extends BaseTwoCanvasComponent
 */
export class Ans13 extends BaseTwoCanvasComponent {
  /**
   * 
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

    const getIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const kernelSize = 3

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let k = []
      for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
        let _i = i - Math.floor(kernelSize / 2)
        let _j = j - Math.floor(kernelSize / 2)
        let r = src.data[getIndex(x + _j, y + _i, 0)]
        let g = src.data[getIndex(x + _j, y + _i, 1)]
        let b = src.data[getIndex(x + _j, y + _i, 2)]
        k.push(parseInt(grayscale(r, g, b), 10))
      }

      k.sort((a, b) => a - b)
      let c = Math.abs(k[0] - k[k.length - 1])

      dst.data[getIndex(x, y, 0)] = c
      dst.data[getIndex(x, y, 1)] = c
      dst.data[getIndex(x, y, 2)] = c
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}

/**
 * Q.14
 * 微分フィルタ
 * @extends BaseTwoCanvasComponent
 */
export class Ans14 extends BaseThreeCanvasComponent {
  /**
   * 
   * @param {canvas} canvas1 
   * @param {canvas} canvas2 
   * @param {image} image 
   */
  main(canvas1, canvas2, image) {

    const verticalKernel = [
      [0, -1, 0],
      [0, 1, 0],
      [0, 0, 0],
    ]

    const sideKernel = [
      [0, 0, 0],
      [-1, 1, 0],
      [0, 0, 0],
    ]

    this.diffFilter(canvas1, image, verticalKernel)

    this.diffFilter(canvas2, image, sideKernel)
  }

  diffFilter(canvas, image, kernel) {
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

/**
 * Q.15
 * Sobelフィルタ
 * @extends BaseTwoCanvasComponent
 */
export class Ans15 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas1 
   * @param {canvas} canvas2
   * @param {image} image 
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
   * @param {canvas} canvas 
   * @param {image} image 
   * @param {array} kernel 
   */
  sovelFilter(canvas, image, kernel) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    // this.grayscale(canvas)
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

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

/**
 * Q.16
 * Prewittフィルタ
 * @extends BaseTwoCanvasComponent
 */
export class Ans16 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas1, canvas2, image) {
    const verticalKernel = [
      [-1, -1, -1],
      [0, 0, 0],
      [1, 1, 1],
    ]
    const sideKernel = [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ]
    this.prewittFilter(canvas1, image, verticalKernel)
    this.prewittFilter(canvas2, image, sideKernel)
  }

  /**
   * Prewittフィルタ
   * @param {canvas} canvas 
   * @param {image} image 
   * @param {array} kernel 
   */
  prewittFilter(canvas, image, kernel) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    // this.grayscale(canvas)
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

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
    // const reverse = (p) => {
    //   return Math.abs(255 - p)
    // }
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

/**
 * Q.17
 * Laplacianフィルタ
 * @extends BaseTwoCanvasComponent
 */
export class Ans17 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    const kernel = [
      [0, 1, 0],
      [1, -4, 1],
      [0, 1, 0],
    ]
    this.laplacianFilter(canvas, image, kernel)
  }

  /**
   * Prewittフィルタ
   * @param {canvas} canvas 
   * @param {image} image 
   * @param {array} kernel 
   */
  laplacianFilter(canvas, image, kernel) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

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
    // const reverse = (p) => {
    //   return Math.abs(255 - p)
    // }
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

/**
 * Q.18
 * @extends BaseTwoCanvasComponent
 */
export class Ans18 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    let kernel = [
      [-2, -1, 0],
      [-1, 1, 1],
      [0, 1, 2],
    ]
    this.logFilter(canvas, image, kernel)
  }

  /**
   * embossフィルタ
   * @param {canvas} canvas 
   * @param {image} image 
   * @param {array} kernel 
   */
  logFilter(canvas, image, kernel) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

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

/**
 * Q.19
 * @extends BaseTwoCanvasComponent
 */
export class Ans19 extends BaseTwoCanvasComponent {
  /**
   * 初期処理
   * 
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
      // k /= (2 * Math.PI * (s ** 6))
      kernel[y][x] = k
    }
    // document.write(JSON.stringify(kernel))
    this.logFilter(canvas, image, kernel)
  }

  /**
   * Prewittフィルタ
   * @param {canvas} canvas 
   * @param {image} image 
   * @param {array} kernel 
   */
  logFilter(canvas, image, kernel) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

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
    // const reverse = (p) => {
    //   return Math.abs(255 - p)
    // }
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

/**
 * Q.20
 * @extends HistogramComponent
 */
export class Ans20 extends HistogramComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas) {
    let pixelValues = new Array(255).fill(0)
    let ctx = canvas.getContext("2d");
    let src = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b

    for (let i = 0; i < src.data.length; i += 4) {
      pixelValues[
        parseInt(
          grayscale(
            src.data[i],
            src.data[i + 1],
            src.data[i + 2],
          )
        )
      ]++
    }
    this.renderChart(pixelValues)
  }
}