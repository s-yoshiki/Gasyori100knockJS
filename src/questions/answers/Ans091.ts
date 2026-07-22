import { context2d } from '@/lib/canvas'
import { kMeans } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(({ showMessage }) => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const context = context2d(canvas)
    context.drawImage(image, 0, 0)
    const source = context.getImageData(0, 0, image.width, image.height)
    const samples: number[][] = []
    for (let i = 0; i < source.data.length; i += 4) {
      samples.push([source.data[i], source.data[i + 1], source.data[i + 2]])
    }
    const result = kMeans(samples, 5, 1, 0, false)
    const output = context.createImageData(image.width, image.height)
    for (let pixel = 0; pixel < result.labels.length; pixel++) {
      const value = result.labels[pixel] * 60
      const offset = pixel * 4
      output.data[offset] = output.data[offset + 1] = output.data[offset + 2] = value
      output.data[offset + 3] = 255
    }
    context.putImageData(output, 0, 0)
    showMessage(
      `初期代表色:\n${result.centers.map((color) => color.map(Math.round).join(', ')).join('\n')}`,
    )
  }
  return { main }
})
