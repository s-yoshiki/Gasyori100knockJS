import { context2d, loadImage } from '@/lib/canvas'
import { colorHistogram, kMeans } from '@/lib/vision'
import { createOneCanvasAnswer } from '../base'
import config from '../images'

export default createOneCanvasAnswer(
  ({ showMessage }) => {
    const main = async (canvas: HTMLCanvasElement) => {
      const paths = config.dataset.tests.slice().sort()
      const images = await Promise.all(paths.map(loadImage))
      const scratch = document.createElement('canvas')
      const context = context2d(scratch)
      const features = images.map((image) => {
        scratch.width = image.width
        scratch.height = image.height
        context.drawImage(image, 0, 0)
        return colorHistogram(context.getImageData(0, 0, image.width, image.height).data)
      })
      const result = kMeans(features, 2, 50, 4)
      canvas.width = 520
      canvas.height = images.length * 82
      const output = context2d(canvas)
      output.fillStyle = '#fff'
      output.fillRect(0, 0, canvas.width, canvas.height)
      output.font = '14px sans-serif'
      for (let i = 0; i < images.length; i++) {
        output.drawImage(images[i], 8, i * 82 + 8, 64, 64)
        output.fillStyle = result.labels[i] === 0 ? '#3157d5' : '#d53d68'
        output.fillText(
          `${paths[i].split('/').pop()}  → cluster ${result.labels[i]}`,
          84,
          i * 82 + 44,
        )
      }
      showMessage(`反復回数: ${result.iterations}\nクラスタ: ${JSON.stringify(result.labels)}`)
    }
    return { main }
  },
  { canvasSize: 520 },
)
