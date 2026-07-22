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
        const tmp2 = out.slice()
        const _tmp = tmp.map((e: number) => 1 - e)
        let _tmp2 = tmp2.map((e: number) => 1 - e)
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
              _tmp[getIdx(x + 1, y)] -
              _tmp[getIdx(x + 1, y)] * _tmp[getIdx(x + 1, y - 1)] * _tmp[getIdx(x, y - 1)]
            c +=
              _tmp[getIdx(x, y - 1)] -
              _tmp[getIdx(x, y - 1)] * _tmp[getIdx(x - 1, y - 1)] * _tmp[getIdx(x - 1, y)]
            c +=
              _tmp[getIdx(x - 1, y)] -
              _tmp[getIdx(x - 1, y)] * _tmp[getIdx(x - 1, y + 1)] * _tmp[getIdx(x, y + 1)]
            c +=
              _tmp[getIdx(x, y + 1)] -
              _tmp[getIdx(x, y + 1)] * _tmp[getIdx(x + 1, y + 1)] * _tmp[getIdx(x + 1, y)]
            if (c == 1) {
              judge++
            }

            const arr1 = []
            const arr2 = []
            for (let _y = y - 1; _y < y + 2; _y++)
              for (let _x = x - 1; _x < x + 2; _x++) {
                arr1.push(out[getIdx(_x, _y)])
                arr2.push(tmp[getIdx(_x, _y)])
              }
            if (sum(arr1) >= 4) {
              judge++
            }
            if (sum(arr2) >= 4) {
              judge++
            }

            let flag = false
            c = 0
            c +=
              _tmp2[getIdx(x + 1, y)] -
              _tmp2[getIdx(x + 1, y)] * _tmp2[getIdx(x + 1, y - 1)] * (1 - tmp[getIdx(x, y - 1)])
            c +=
              1 -
              tmp[getIdx(x, y - 1)] -
              (1 - tmp[getIdx(x, y - 1)]) * _tmp2[getIdx(x - 1, y - 1)] * _tmp2[getIdx(x - 1, y)]
            c +=
              _tmp2[getIdx(x - 1, y)] -
              _tmp2[getIdx(x - 1, y)] * _tmp2[getIdx(x - 1, y + 1)] * _tmp2[getIdx(x, y + 1)]
            c +=
              _tmp2[getIdx(x, y + 1)] -
              _tmp2[getIdx(x, y + 1)] * _tmp2[getIdx(x + 1, y + 1)] * _tmp2[getIdx(x + 1, y)]
            if (c == 1) {
              flag = true
            }

            _tmp2 = out.slice().map((e: number) => 1 - e)

            c = 0
            c +=
              _tmp2[getIdx(x + 1, y)] -
              _tmp2[getIdx(x + 1, y)] * _tmp2[getIdx(x + 1, y - 1)] * _tmp2[getIdx(x, y - 1)]
            c +=
              _tmp2[getIdx(x, y - 1)] -
              _tmp2[getIdx(x, y - 1)] * _tmp2[getIdx(x - 1, y - 1)] * (1 - tmp[getIdx(x - 1, y)])
            c +=
              1 -
              tmp[getIdx(x - 1, y)] -
              (1 - tmp[getIdx(x - 1, y)]) * _tmp2[getIdx(x - 1, y + 1)] * _tmp2[getIdx(x, y + 1)]
            c +=
              _tmp2[getIdx(x, y + 1)] -
              _tmp2[getIdx(x, y + 1)] * _tmp2[getIdx(x + 1, y + 1)] * _tmp2[getIdx(x + 1, y)]
            if (c == 1) {
              flag = true
            }

            if (flag) {
              judge++
            }

            if (judge >= 5) {
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
