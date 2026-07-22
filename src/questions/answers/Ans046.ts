import { context2d } from '@/lib/canvas'
import { grayscale } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'

/** Canny風のエッジ画像をHough空間へ投票し、強い直線を元画像へ逆変換する。 */
export default createTwoCanvasAnswer(
  () => {
    const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      const context = context2d(canvas)
      const width = image.width
      const height = image.height
      canvas.width = width
      canvas.height = height
      context.drawImage(image, 0, 0, width, height)
      const source = context.getImageData(0, 0, width, height)
      const gray = grayscale(source.data)
      const edges = new Array(width * height).fill(0)
      const at = (x: number, y: number) =>
        gray[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))]

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const gx =
            -at(x - 1, y - 1) +
            at(x + 1, y - 1) -
            2 * at(x - 1, y) +
            2 * at(x + 1, y) -
            at(x - 1, y + 1) +
            at(x + 1, y + 1)
          const gy =
            -at(x - 1, y - 1) -
            2 * at(x, y - 1) -
            at(x + 1, y - 1) +
            at(x - 1, y + 1) +
            2 * at(x, y + 1) +
            at(x + 1, y + 1)
          if (Math.hypot(gx, gy) >= 120) edges[y * width + x] = 1
        }
      }

      const thetaCount = 180
      const rhoMax = Math.ceil(Math.hypot(width, height))
      const rhoCount = rhoMax * 2 + 1
      const accumulator = new Uint16Array(thetaCount * rhoCount)
      const cos = new Array(thetaCount)
      const sin = new Array(thetaCount)
      for (let theta = 0; theta < thetaCount; theta++) {
        const radians = (theta * Math.PI) / thetaCount
        cos[theta] = Math.cos(radians)
        sin[theta] = Math.sin(radians)
      }
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (edges[y * width + x] === 0) continue
          for (let theta = 0; theta < thetaCount; theta++) {
            const rho = Math.round(x * cos[theta] + y * sin[theta]) + rhoMax
            accumulator[rho * thetaCount + theta]++
          }
        }
      }

      const peaks: { rho: number; theta: number; votes: number }[] = []
      for (let rho = 1; rho < rhoCount - 1; rho++) {
        for (let theta = 1; theta < thetaCount - 1; theta++) {
          const votes = accumulator[rho * thetaCount + theta]
          if (votes < 24) continue
          let maximum = true
          for (let dy = -2; dy <= 2 && maximum; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              if (accumulator[(rho + dy) * thetaCount + theta + dx] > votes) maximum = false
            }
          }
          if (maximum) peaks.push({ rho: rho - rhoMax, theta, votes })
        }
      }
      peaks.sort((a, b) => b.votes - a.votes)

      context.lineWidth = 1.5
      context.strokeStyle = '#ff2d55'
      for (const peak of peaks.slice(0, 10)) {
        const c = cos[peak.theta]
        const s = sin[peak.theta]
        const x0 = c * peak.rho
        const y0 = s * peak.rho
        context.beginPath()
        context.moveTo(x0 + 1000 * -s, y0 + 1000 * c)
        context.lineTo(x0 - 1000 * -s, y0 - 1000 * c)
        context.stroke()
      }
    }

    return { main }
  },
  { imageUrl: config.srcImage.thorino },
)
