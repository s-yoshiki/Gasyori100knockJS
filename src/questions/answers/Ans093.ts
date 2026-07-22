import { context2d } from '@/lib/canvas'
import { iou } from '@/lib/vision'
import { createOneCanvasAnswer } from '../base'

export default createOneCanvasAnswer(
  ({ showMessage }) => {
    const main = (canvas: HTMLCanvasElement) => {
      canvas.width = 220
      canvas.height = 190
      const context = context2d(canvas)
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      const a = { x1: 50, y1: 50, x2: 150, y2: 150 }
      const b = { x1: 60, y1: 60, x2: 170, y2: 160 }
      context.lineWidth = 3
      context.strokeStyle = '#2aa876'
      context.strokeRect(a.x1, a.y1, a.x2 - a.x1, a.y2 - a.y1)
      context.strokeStyle = '#e24372'
      context.strokeRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1)
      context.fillStyle = '#222'
      context.font = '14px sans-serif'
      context.fillText('A', a.x1 + 5, a.y1 + 18)
      context.fillText('B', b.x2 - 18, b.y2 - 8)
      showMessage(`IoU = ${iou(a, b).toFixed(6)}`)
    }
    return { main }
  },
  { canvasSize: 220 },
)
