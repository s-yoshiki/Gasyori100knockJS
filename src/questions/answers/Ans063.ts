import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'

export default createTwoCanvasAnswer(
  () => {
    const main = (canvas1: HTMLCanvasElement, image: HTMLImageElement) => {
      const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
      const ctx1 = context2d(canvas1)
      ctx1.drawImage(image, 0, 0, image.width, image.height)
      const src1 = ctx1.getImageData(0, 0, image.width, image.height)
      const dst1 = ctx1.createImageData(image.width, image.height)
      const bin = new Array(image.width * image.height).fill(0)
      for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
        bin[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2]) > 128 ? 255 : 0
      }
      const dst = rasterScan(bin, image.width, image.height)
      for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
        const c = dst[j]
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = ~~(c * 255)
        dst1.data[i + 3] = 255
      }
      ctx1.putImageData(dst1, 0, 0)
    }

    const rasterScan = (src: number[], W: number, H: number): number[] => {
      const getIdx = (x: number, y: number) => {
        y = Math.min(Math.max(y, 0), H - 1)
        x = Math.min(Math.max(x, 0), W - 1)
        return y * W + x
      }
      const sum = (arr: number[]) => {
        return arr.reduce(
          (prev: number, current: number, _i: number, _arr: number[]) => prev + current,
        )
      }
      const out: number[] = src.slice().map((e: number) => (e > 0 ? 1 : 0))
      let count = 1
      while (count > 0) {
        count = 0
        const tmp = out.slice()
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) {
            if (out[getIdx(x, y)] < 1) {
              continue
            }

            let judge = 0
            if (
              tmp[getIdx(x + 1, y)] +
                tmp[getIdx(x, y - 1)] +
                tmp[getIdx(x - 1, y)] +
                tmp[getIdx(x, y + 1)] <
              4
            ) {
              judge++
            }

            let c = 0
            c +=
              out[getIdx(x + 1, y)] -
              out[getIdx(x + 1, y)] * out[getIdx(x + 1, y - 1)] * out[getIdx(x, y - 1)]
            c +=
              out[getIdx(x, y - 1)] -
              out[getIdx(x, y - 1)] * out[getIdx(x - 1, y - 1)] * out[getIdx(x - 1, y)]
            c +=
              out[getIdx(x - 1, y)] -
              out[getIdx(x - 1, y)] * out[getIdx(x - 1, y + 1)] * out[getIdx(x, y + 1)]
            c +=
              out[getIdx(x, y + 1)] -
              out[getIdx(x, y + 1)] * out[getIdx(x + 1, y + 1)] * out[getIdx(x + 1, y)]
            if (c == 1) {
              judge++
            }

            const arr = []
            for (let _y = y - 1; _y < y + 2; _y++)
              for (let _x = x - 1; _x < x + 2; _x++) {
                arr.push(out[getIdx(_x, _y)])
              }
            if (sum(arr) >= 4) {
              judge++
            }

            if (judge == 3) {
              out[getIdx(x, y)] = 0
              count++
            }
          }
      }
      return out
    }

    return { main }
  },
  { imageUrl: config.srcImage.gazo },
)
