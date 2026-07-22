import { context2d } from '@/lib/canvas'
import { inverse } from '@/lib/matrix'
import { createThreeCanvasAnswer } from '../base'

export default createThreeCanvasAnswer(() => {
  const main = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const calcHomography = (H: number[][], x: number, y: number) => {
      const p = [x, y, 1]
      const a = [0, 0, 0]
      for (let i = 0; i < H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * H[i][j]
        }
        a[i] = ~~tmp
      }
      return a
    }

    const deg = -30
    const rad = (deg * Math.PI) / 180

    const H1 = [
      [Math.cos(rad), -Math.sin(rad), 0],
      [Math.sin(rad), Math.cos(rad), 0],
      [0, 0, 1],
    ]

    const [cx, cy] = calcHomography(H1, canvas1.width / 2, canvas1.height / 2).map((e) => ~~e)

    const H2 = [
      [Math.cos(rad), -Math.sin(rad), -cx + ~~(canvas1.width / 2)],
      [Math.sin(rad), Math.cos(rad), -cy + ~~(canvas1.height / 2)],
      [0, 0, 1],
    ]
    trans(canvas1, image, H1)
    trans(canvas2, image, H2)
  }

  const trans = (canvas: HTMLCanvasElement, image: HTMLImageElement, H: number[][]) => {
    const getDstIndex = (x: number, y: number, channel: number) => {
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x: number, y: number, channel: number) => {
      return y * image.width * 4 + x * 4 + channel
    }

    const ctx = context2d(canvas)

    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const src = ctx.getImageData(0, 0, image.width, image.height)

    canvas.width = image.width
    canvas.height = image.height
    const dst = ctx.createImageData(canvas.width, canvas.height)

    const _H = inverse(H)

    for (let x = 0; x < canvas.width; x++)
      for (let y = 0; y < canvas.height; y++) {
        const p = [x, y, 1]
        const a = [0, 0, 0]
        for (let i = 0; i < _H.length; i++) {
          let tmp = 0
          for (let j = 0; j < p.length; j++) {
            tmp += p[j] * _H[i][j]
          }
          a[i] = ~~tmp
        }
        for (let c = 0; c < 3; c++) {
          if (0 < a[0] && a[0] < canvas.width) {
            dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
          }
        }
        dst.data[getDstIndex(x, y, 3)] = 255
      }
    ctx.putImageData(dst, 0, 0)
  }

  return { main }
})
