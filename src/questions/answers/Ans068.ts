import { context2d } from '@/lib/canvas'
import { computeHog, grayscale } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const context = context2d(canvas)
    context.drawImage(image, 0, 0)
    const source = context.getImageData(0, 0, image.width, image.height)
    const hog = computeHog(grayscale(source.data), image.width, image.height, 8, true)
    const strengths = hog.histograms.map((histogram) =>
      Math.sqrt(histogram.reduce((sum, value) => sum + value ** 2, 0)),
    )
    const maximum = Math.max(...strengths, 1e-6)
    context.fillStyle = '#111'
    context.fillRect(0, 0, canvas.width, canvas.height)
    for (let cy = 0; cy < hog.cellsY; cy++) {
      for (let cx = 0; cx < hog.cellsX; cx++) {
        const strength = strengths[cy * hog.cellsX + cx] / maximum
        const value = Math.round(strength * 255)
        context.fillStyle = `rgb(${value}, ${Math.round(value * 0.85)}, 255)`
        context.fillRect(cx * hog.cellSize, cy * hog.cellSize, hog.cellSize, hog.cellSize)
      }
    }
  }

  return { main }
})
