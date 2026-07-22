import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'

export default createTwoCanvasAnswer(
  () => {
    const main = (canvas1: HTMLCanvasElement, image: HTMLImageElement) => {
      const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
      const getRandInt = (min: number, max: number) => {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min)) + min
      }
      const ctx1 = context2d(canvas1)
      ctx1.drawImage(image, 0, 0, image.width, image.height)
      const src1 = ctx1.getImageData(0, 0, image.width, image.height)
      const dst1 = ctx1.createImageData(image.width, image.height)
      const bin = new Array(image.width * image.height).fill(0)
      const out = new Array(image.width * image.height).fill([0, 0, 0])
      for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
        bin[j] = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2]) > 128 ? 255 : 0
      }
      const [label, lut, nabelLength] = rasterScan(bin, image.width, image.height)
      const colors = Array.from(new Array(nabelLength), () => [
        getRandInt(0, 255),
        getRandInt(0, 255),
        getRandInt(0, 255),
      ])
      for (let i = 0, idx = 2; idx < lut.length; i++, idx++) {
        const c = colors[lut[idx] - 2]
        for (let j = 0; j < label.length; j++) {
          if (label[j] === i + 2) {
            out[j] = c
          }
        }
      }
      for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
        let p = out[j]
        if (!p) {
          p = [0, 0, 0]
        }
        dst1.data[i] = p[0]
        dst1.data[i + 1] = p[1]
        dst1.data[i + 2] = p[2]
        dst1.data[i + 3] = 255
      }
      ctx1.putImageData(dst1, 0, 0)
    }

    const rasterScan = (src: number[], W: number, H: number): [number[], number[], number] => {
      const getIdx = (x: number, y: number) => {
        y = Math.min(Math.max(y, 0), H - 1)
        x = Math.min(Math.max(x, 0), W - 1)
        return y * W + x
      }
      const label: number[] = src.slice().map((e: number) => (e > 0 ? 1 : 0))
      const lut = new Array(src.length).fill(0)
      let n = 1
      let count = 1
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          if (label[getIdx(x, y)] == 0) {
            continue
          }
          const c2 = label[getIdx(x + 1, y - 1)]
          const c3 = label[getIdx(x, y - 1)]
          const c4 = label[getIdx(x - 1, y - 1)]
          const c5 = label[getIdx(x - 1, y)]
          if (Math.max(c2, c3, c4, c5) < 2) {
            n++
            label[getIdx(x, y)] = n
          } else {
            const _vs = [c2, c3, c4, c5]
            const vs: number[] = []
            _vs.forEach((e) => {
              if (e > 1) {
                vs.push(e)
              }
            })
            const v = Math.min(...vs)
            label[getIdx(x, y)] = v
            let minv = v
            vs.forEach((_v) => {
              if (lut[_v] !== 0) {
                minv = Math.min(minv, lut[_v])
              }
            })
            vs.forEach((_v) => {
              lut[_v] = minv
            })
          }
        }
      for (let l = 2; l < n + 1; l++) {
        let flag = true
        for (let i = 0; i < n + 1; i++) {
          if (lut[i] === l) {
            if (flag) {
              count++
              flag = false
            }
            lut[i] = count
          }
        }
      }
      return [label, lut, count]
    }

    return { main }
  },
  { imageUrl: config.srcImage.seg },
)
