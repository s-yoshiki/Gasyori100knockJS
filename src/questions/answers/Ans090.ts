import { context2d, loadImage } from '@/lib/canvas'
import { colorHistogram, kMeans } from '@/lib/vision'
import { createOneCanvasAnswer } from '../base'
import config from '../images'

export default createOneCanvasAnswer(
  ({ showMessage }) => {
    const main = async (canvas: HTMLCanvasElement) => {
      const paths = config.dataset.train.slice().sort()
      const images = await Promise.all(paths.map(loadImage))
      const scratch = document.createElement('canvas')
      const scratchContext = context2d(scratch)
      const features = images.map((image) => {
        scratch.width = image.width
        scratch.height = image.height
        scratchContext.drawImage(image, 0, 0)
        return colorHistogram(scratchContext.getImageData(0, 0, image.width, image.height).data)
      })
      const result = kMeans(features, 2, 100, 7)
      canvas.width = 560
      canvas.height = images.length * 58
      const output = context2d(canvas)
      output.fillStyle = '#fff'
      output.fillRect(0, 0, canvas.width, canvas.height)
      output.font = '13px sans-serif'
      for (let i = 0; i < images.length; i++) {
        output.drawImage(images[i], 8, i * 58 + 5, 48, 48)
        output.fillStyle = result.labels[i] === 0 ? '#3157d5' : '#d53d68'
        output.fillText(
          `${paths[i].split('/').pop()}  → cluster ${result.labels[i]}`,
          68,
          i * 58 + 34,
        )
      }
      const groups = result.labels.reduce<Record<number, string[]>>((all, label, index) => {
        ;(all[label] ??= []).push(paths[index].split('/').pop() ?? '')
        return all
      }, {})
      showMessage(`反復回数: ${result.iterations}\n${JSON.stringify(groups, null, 2)}`)
    }
    return { main }
  },
  { canvasSize: 560 },
)
