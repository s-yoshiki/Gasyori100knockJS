import { context2d } from '@/lib/canvas'
import { computeHog, grayscale } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'

export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const context = context2d(canvas)
    context.drawImage(image, 0, 0)
    const source = context.getImageData(0, 0, image.width, image.height)
    const gray = grayscale(source.data)
    const hog = computeHog(gray, image.width, image.height, 8, true)
    const output = context.createImageData(image.width, image.height)
    for (let pixel = 0; pixel < gray.length; pixel++) {
      const value = gray[pixel] * 0.45
      const offset = pixel * 4
      output.data[offset] = output.data[offset + 1] = output.data[offset + 2] = value
      output.data[offset + 3] = 255
    }
    context.putImageData(output, 0, 0)

    for (let cy = 0; cy < hog.cellsY; cy++) {
      for (let cx = 0; cx < hog.cellsX; cx++) {
        const histogram = hog.histograms[cy * hog.cellsX + cx]
        const maximum = Math.max(...histogram, 1e-6)
        const centerX = cx * hog.cellSize + hog.cellSize / 2
        const centerY = cy * hog.cellSize + hog.cellSize / 2
        for (let bin = 0; bin < 9; bin++) {
          const radians = ((bin * 20 + 10) * Math.PI) / 180
          const radius = (hog.cellSize / 2) * (histogram[bin] / maximum)
          context.strokeStyle = `rgba(255, 255, 255, ${0.15 + 0.85 * (histogram[bin] / maximum)})`
          context.beginPath()
          context.moveTo(centerX - Math.cos(radians) * radius, centerY - Math.sin(radians) * radius)
          context.lineTo(centerX + Math.cos(radians) * radius, centerY + Math.sin(radians) * radius)
          context.stroke()
        }
      }
    }
  }

  return { main }
})
