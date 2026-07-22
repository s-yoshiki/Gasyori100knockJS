import { createOneCanvasAnswer } from '../base'

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

import { context2d } from '@/lib/canvas'

export default createOneCanvasAnswer(
  ({ showMessage }) => {
    const main = (canvas: HTMLCanvasElement) => {
      const kSize = 111
      const ctx1 = context2d(canvas)
      const angles = [0, 45, 90, 135]
      for (let i = 0; i < angles.length; i++) {
        const out = gabor({
          kSize,
          sigma: 10,
          gamma: 1.2,
          lambda: 10.0,
          psi: 1,
          angle: angles[i],
        })
        canvas.width = canvas.height = kSize
        const dst1 = ctx1.createImageData(kSize, kSize)
        for (let i = 0, j = 0; i < dst1.data.length; i += 4, j++) {
          dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = out[j]
          dst1.data[i + 3] = 255
        }
        ctx1.putImageData(dst1, 0, 0)
        const url = canvas.toDataURL()
        showMessage(`<img src="${url}"/> deg : ${angles[i]}`, true)
      }
    }

    const gabor = (arg: GaborParams) => {
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
      const minGabor = Math.min(...out)
      out = out.map((e) => e - minGabor)
      const maxGabor = Math.max(...out)
      out = out.map((e) => (e / maxGabor) * 255)
      return out
    }

    return { main }
  },
  { canvasSize: 111 },
)
