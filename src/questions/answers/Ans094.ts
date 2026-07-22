import { context2d } from '@/lib/canvas'
import { iou, seededRandom } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'

export default createTwoCanvasAnswer(
  ({ showMessage }) => {
    const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      const context = context2d(canvas)
      context.drawImage(image, 0, 0)
      const groundTruth = { x1: 47, y1: 41, x2: 129, y2: 103 }
      const random = seededRandom(0)
      let positives = 0
      context.lineWidth = 1
      for (let i = 0; i < 200; i++) {
        const x1 = Math.floor(random() * Math.max(1, image.width - 60))
        const y1 = Math.floor(random() * Math.max(1, image.height - 60))
        const crop = { x1, y1, x2: x1 + 60, y2: y1 + 60 }
        const positive = iou(groundTruth, crop) >= 0.5
        if (positive) positives++
        context.strokeStyle = positive ? 'rgba(255, 45, 85, .8)' : 'rgba(30, 110, 255, .28)'
        context.strokeRect(x1, y1, 60, 60)
      }
      context.lineWidth = 2
      context.strokeStyle = '#27d17f'
      context.strokeRect(
        groundTruth.x1,
        groundTruth.y1,
        groundTruth.x2 - groundTruth.x1,
        groundTruth.y2 - groundTruth.y1,
      )
      showMessage(`学習候補: 200枚\n正例: ${positives}\n負例: ${200 - positives}`)
    }
    return { main }
  },
  { imageUrl: config.srcImage.imori1 },
)
