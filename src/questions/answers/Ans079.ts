import { context2d } from '@/lib/canvas'
import type { KernelCallback, Pixels } from '@/lib/pixels'
import { createTwoCanvasAnswer } from '../base'

/** ガボールフィルタのパラメータ。 */
interface GaborParams {
  /** カーネルの一辺 */
  kSize: number
  /** ガウス分布の標準偏差 */
  sigma: number
  /** 縦横比 */
  gamma: number
  /** 波長 */
  lambda: number
  /** 位相オフセット */
  psi: number
  /** カーネルの回転角（度） */
  angle: number
}
export default createTwoCanvasAnswer(({ showMessage }) => {
  const main = (canvas1: HTMLCanvasElement, image: HTMLImageElement) => {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = context2d(canvas1)
    const W = image.width
    const H = image.height
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(image.width, image.height)
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const gray = new Array(H * W).fill(0)
    for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
      const c = grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = c
      dst1.data[i + 3] = 255
      gray[j] = c
    }
    ctx1.putImageData(dst1, 0, 0)
    const kSize = 11
    const angles = [0, 45, 90, 135]
    for (let key = 0; key < angles.length; key++) {
      const kernel = getGaborKernel({
        kSize,
        sigma: 1.5,
        gamma: 1.2,
        lambda: 3.0,
        psi: 0,
        angle: angles[key],
      })
      let out = new Array(H * W)
      adaptKernel(gray, out, W, H, kernel)
      const max = Math.max(...out)
      out = out.map((e) => {
        // 正規化
        e = (e / max) * 255
        if (e > 255) return 255
        if (e < 0) return 0
        return Math.floor(e)
      })
      for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
        dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = out[j]
      }
      ctx1.putImageData(dst1, 0, 0)

      const url = canvas1.toDataURL()
      showMessage(`<img src="${url}"/> deg : ${angles[key]}`, true)
    }
  }

  const getGaborKernel = (arg: GaborParams) => {
    const kSize = arg.kSize
    const getIdx = (x: number, y: number) => {
      x = Math.min(Math.max(x, 0), kSize - 1)
      y = Math.min(Math.max(y, 0), kSize - 1)
      return y * kSize + x
    }
    const sum = (arr: number[]) => {
      let result = 0
      arr.forEach((e: number) => {
        result += e
      })
      return result
    }
    const sigma = arg.sigma
    const gamma = arg.gamma
    const lambda = arg.lambda
    const psi = arg.psi
    const angle = arg.angle
    const d = ~~(kSize / 2)
    let out = new Array(kSize * kSize).fill(0)
    for (let y = 0; y < kSize; y++)
      for (let x = 0; x < kSize; x++) {
        const px = x - d
        const py = y - d
        const theta = (angle / 180) * Math.PI
        const _x = Math.cos(theta) * px + Math.sin(theta) * py
        const _y = -Math.sin(theta) * px + Math.cos(theta) * py
        out[getIdx(x, y)] =
          Math.exp(-(_x ** 2 + gamma ** 2 * _y ** 2) / (2 * sigma ** 2)) *
          Math.cos((2 * Math.PI * _x) / lambda + psi)
      }
    const sumGabor = sum(out.slice().map(Math.abs))
    out = out.slice().map((e) => e / sumGabor)
    const kernel = []
    for (let i = 0; i < kSize; i++) {
      const tmp = []
      for (let j = 0; j < kSize; j++) {
        tmp.push(out[i * kSize + j])
      }
      kernel.push(tmp)
    }
    return kernel
  }

  const adaptKernel = (
    src: Pixels,
    dst: number[],
    imgWidth: number,
    imgHeight: number,
    kernel: number[][],
    callback: KernelCallback | null = null,
  ) => {
    const getIndex = (x: number, y: number) => {
      x = Math.min(Math.max(x, 0), imgWidth - 1)
      y = Math.min(Math.max(y, 0), imgHeight - 1)
      return y * imgWidth + x
    }
    const kernelSize = kernel.length
    const d = Math.floor(kernelSize / 2)
    for (let x = 0; x < imgWidth; x++)
      for (let y = 0; y < imgHeight; y++) {
        let k = 0
        for (let i = 0; i < kernelSize; i++)
          for (let j = 0; j < kernelSize; j++) {
            const _i = i - d
            const _j = j - d
            const srcIdx = getIndex(x + _j, y + _i)
            k += kernel[i][j] * src[srcIdx]
          }
        const dstIdx = getIndex(x, y)
        if (callback != null) {
          const applied = callback(k)
          if (applied !== undefined) {
            dst[dstIdx] = applied
          }
        } else {
          dst[dstIdx] = k
        }
      }
  }

  return { main }
})
