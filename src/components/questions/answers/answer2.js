import config from '../configure.js'
import { ThreeCanvasTemplate, DefaultTemplate } from "../templates.js"

export default {
  /**
   * 問題11
   * 平滑化フィルタ
   */
  ans11: {
    srcImg: config.srcImage.noise,
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
            k.push(src.data[getIndex(x + _i, y + _j, c)])
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
  },
  /**
   * 問題12
   * モーションフィルタ
   */
  ans12: {
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
            k += kernel[i][j] * src.data[getIndex(x + _i, y + _j, c)]
          }
          dst.data[getIndex(x, y, c)] = k
        }
        dst.data[getIndex(x, y, 3)] = 255
      }
      ctx.putImageData(dst, 0, 0)
    },
  },
  /**
   * 問題13
   * 平滑化フィルタ
   */
  ans13: {
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
          let r = src.data[getIndex(x + _i, y + _j, 0)]
          let g = src.data[getIndex(x + _i, y + _j, 1)]
          let b = src.data[getIndex(x + _i, y + _j, 2)]
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
  },

  ans14: {
    init(self) {
      this.main('test')
    },
    main(test) {
      // alert(test)
    },
    template: ThreeCanvasTemplate
  }
}