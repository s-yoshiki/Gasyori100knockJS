import { context2d } from '@/lib/canvas'
import { dotDivide, dotMultiply } from '@/lib/matrix'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(({ showMessage }) => {
  const main = (canvas1: HTMLCanvasElement, image: HTMLImageElement) => {
    const rgb2ycc = (r: number, g: number, b: number) => [
      0.299 * r + 0.587 * g + 0.114 * b,
      -0.1687 * r - 0.3313 * g + 0.5 * b + 128,
      0.5 * r - 0.4187 * g - 0.0813 * b + 128,
    ]
    const ycc2rgb = (y: number, cr: number, cb: number) => [
      y + (cb - 128) * 1.7718,
      y - (cb - 128) * 0.3441 - (cr - 128) * 0.7139,
      y + (cr - 128) * 1.402,
    ]
    const ctx1 = context2d(canvas1)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const srcY = []
    const srcCr = []
    const srcCb = []
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    const T = 8
    const K = 8

    for (let i = 0; i < src1.data.length; i += 4) {
      const [y, cr, cb] = rgb2ycc(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      srcY.push(y)
      srcCr.push(cr)
      srcCb.push(cb)
    }
    ctx1.putImageData(dst1, 0, 0)

    const dctY = dct2d(srcY, canvas1.width, canvas1.height, T, getQuantum1())
    const dstY = idct2d(dctY, canvas1.width, canvas1.height, T, K)
    const dctCr = dct2d(srcCr, canvas1.width, canvas1.height, T, getQuantum2())
    const dstCr = idct2d(dctCr, canvas1.width, canvas1.height, T, K)
    const dctCb = dct2d(srcCb, canvas1.width, canvas1.height, T, getQuantum2())
    const dstCb = idct2d(dctCb, canvas1.width, canvas1.height, T, K)

    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      const rgb = ycc2rgb(dstY[j], dstCr[j], dstCb[j]).map((e) => {
        if (e > 255) {
          return 255
        }
        return e
      })
      dst1.data[i + 0] = rgb[0]
      dst1.data[i + 1] = rgb[1]
      dst1.data[i + 2] = rgb[2]
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    const psnr = calculatePsnr(srcY, dstY, srcCr, dstCr, srcCb, dstCb, image.width, image.height)
    showMessage(
      JSON.stringify(
        {
          psnr,
          bitrate: (1 * T * K ** 2) / T ** 2,
        },
        null,
        '\t',
      ),
    )
  }

  const dct2d = (src: number[], imgWidth: number, imgHeight: number, T: number, Q: number[][]) => {
    const W = imgWidth
    const H = imgHeight
    // const Q = getQuantum()
    const dst = new Array(W * H).fill(0)
    const theta = Math.PI / (2 * T)
    const k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T)
      for (let xi = 0; xi < imgWidth; xi += T) {
        for (let v = 0; v < T; v++)
          for (let u = 0; u < T; u++) {
            const uvIdx = W * (v + yi) + (u + xi)
            for (let y = 0; y < T; y++)
              for (let x = 0; x < T; x++) {
                const xyIdx = W * (y + yi) + (x + xi)
                const cu = u === 0 ? k : 1
                const cv = v === 0 ? k : 1
                const w =
                  ((2 * cu * cv) / T) *
                  Math.cos((2 * x + 1) * u * theta) *
                  Math.cos((2 * y + 1) * v * theta)
                dst[uvIdx] += src[xyIdx] * w
              }
          }
        // 量子化
        const b = Array.from(new Array(T), () => new Array(T).fill(0))
        for (let yj = yi, _y = 0; yj < yi + T; yj++, _y++)
          for (let xj = xi, _x = 0; xj < xi + T; xj++, _x++) {
            b[_y][_x] = dst[W * yj + xj]
          }
        const quantized = dotDivide(b, Q).map((row) => row.map((v) => Math.round(v)))
        const m = dotMultiply(quantized, Q)
        for (let yj = yi, _y = 0; yj < yi + T; yj++, _y++)
          for (let xj = xi, _x = 0; xj < xi + T; xj++, _x++) {
            dst[W * yj + xj] = m[_y][_x]
          }
      }
    return dst
  }

  const idct2d = (src: number[], imgWidth: number, imgHeight: number, T: number, K: number) => {
    const W = imgWidth
    const H = imgHeight
    const theta = Math.PI / (2 * T)
    const dst = new Array(W * H).fill(0)
    const k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T)
      for (let xi = 0; xi < imgWidth; xi += T) {
        for (let y = 0; y < T; y++)
          for (let x = 0; x < T; x++) {
            const xyIdx = W * (y + yi) + (x + xi)
            for (let v = 0; v < K; v++)
              for (let u = 0; u < K; u++) {
                const uvIdx = W * (v + yi) + (u + xi)
                const cu = u === 0 ? k : 1
                const cv = v === 0 ? k : 1
                const w =
                  ((2 * cu * cv) / T) *
                  Math.cos((2 * x + 1) * u * theta) *
                  Math.cos((2 * y + 1) * v * theta)
                dst[xyIdx] += src[uvIdx] * w
              }
          }
      }
    return dst
  }

  const getQuantum1 = () => {
    return [
      [16, 11, 10, 16, 24, 40, 51, 61],
      [12, 12, 14, 19, 26, 58, 60, 55],
      [14, 13, 16, 24, 40, 57, 69, 56],
      [14, 17, 22, 29, 51, 87, 80, 62],
      [18, 22, 37, 56, 68, 109, 103, 77],
      [24, 35, 55, 64, 81, 104, 113, 92],
      [49, 64, 78, 87, 103, 121, 120, 101],
      [72, 92, 95, 98, 112, 100, 103, 99],
    ]
  }

  const getQuantum2 = () => {
    return [
      [17, 18, 24, 47, 99, 99, 99, 99],
      [18, 21, 26, 66, 99, 99, 99, 99],
      [24, 26, 56, 99, 99, 99, 99, 99],
      [47, 66, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99],
      [99, 99, 99, 99, 99, 99, 99, 99],
    ]
  }

  const calculatePsnr = (
    srcY: number[],
    dstY: number[],
    srcCr: number[],
    dstCr: number[],
    srcCb: number[],
    dstCb: number[],
    imgWidth: number,
    imgHeight: number,
  ) => {
    let sum = 0
    const data = [
      [srcY, dstY],
      [srcCr, dstCr],
      [srcCb, dstCb],
    ]
    data.forEach((e) => {
      const src = e[0]
      const dst = e[1]
      for (let i = 0; i < src.length; i++) {
        const d = Math.abs(src[i] - dst[i])
        sum += d ** 2
      }
    })
    const mse = sum / (imgWidth * imgHeight)
    const ans = 10 * Math.log10(255 ** 2 / mse)
    return ans
  }

  return { main }
})
