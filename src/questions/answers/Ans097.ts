import { context2d } from '@/lib/canvas'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'
import { scanImage } from './objectDetection'

export default createTwoCanvasAnswer(
  ({ showMessage }) => {
    const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      const result = scanImage(image)
      const context = context2d(canvas)
      context.drawImage(image, 0, 0)
      context.strokeStyle = 'rgba(255, 45, 85, .26)'
      context.lineWidth = 1
      // 全窓を描くと画像が埋まるため、16px間隔の代表位置だけを表示する。
      for (let y = 0; y < image.height; y += 16) {
        for (let x = 0; x < image.width; x += 16) {
          for (const size of [42, 56, 70]) {
            context.strokeRect(x - size / 2, y - size / 2, size, size)
          }
        }
      }
      showMessage(
        `スライディングウィンドウ: ${result.windows}\nHOG平均投票量: ${result.meanEnergy.toFixed(4)}\n各領域は32x32へ補間してから144次元HOGを抽出`,
      )
    }
    return { main }
  },
  { imageUrl: config.srcImage.imoriMany },
)
