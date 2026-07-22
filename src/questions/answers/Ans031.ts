import { context2d } from '@/lib/canvas'
import { inverse } from '@/lib/matrix'
import { createFourCanvasAnswer } from '../base'

export default createFourCanvasAnswer(() => {
  const main = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    canvas3: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const dx = 30
    const a = dx / image.height
    const tx = 0
    const ty = 0
    const H1 = [
      [1, a, tx],
      [0, 1, ty],
      [0, 0, 1],
    ]
    const H2 = [
      [1, 0, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    const H3 = [
      [1, a, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    trans(canvas1, image, H1)
    trans(canvas2, image, H2)
    trans(canvas3, image, H3)
  }

  const trans = (canvas: HTMLCanvasElement, image: HTMLImageElement, H: number[][]) => {
    const getDstIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), image.width - 1)
      y = Math.min(Math.max(y, 0), image.height - 1)
      return y * image.width * 4 + x * 4 + channel
    }

    const calcHomography = (Hx: number[][], x: number, y: number) => {
      const p = [x, y, 1]
      const a = [0, 0, 0]
      for (let i = 0; i < Hx.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * Hx[i][j]
        }
        a[i] = ~~tmp
      }
      return a
    }

    const ctx = context2d(canvas)
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const src = ctx.getImageData(0, 0, image.width, image.height)

    const [width, height] = calcHomography(H, image.width, image.height).map((e) => ~~e)
    canvas.width = width
    canvas.height = height

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
          if (0 < a[0] && a[0] < image.width && 0 < a[1] && a[1] < image.height) {
            dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
          }
        }
        dst.data[getDstIndex(x, y, 3)] = 255
      }
    ctx.putImageData(dst, 0, 0)
  }

  return { main }
})
