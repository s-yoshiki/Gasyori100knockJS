import { context2d } from '@/lib/canvas'
import { computeHog, grayscale } from '@/lib/vision'
import { createThreeCanvasAnswer } from '../base'

export default createThreeCanvasAnswer(() => {
  const main = (
    magnitudeCanvas: HTMLCanvasElement,
    angleCanvas: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const width = image.width
    const height = image.height
    const sourceContext = context2d(magnitudeCanvas)
    sourceContext.drawImage(image, 0, 0, width, height)
    const source = sourceContext.getImageData(0, 0, width, height)
    const hog = computeHog(grayscale(source.data), width, height)
    const maximum = Math.max(...hog.magnitude, 1)
    const palette = [
      [255, 64, 64],
      [255, 144, 48],
      [246, 215, 56],
      [120, 205, 80],
      [48, 190, 155],
      [40, 170, 235],
      [75, 105, 225],
      [150, 85, 220],
      [225, 70, 175],
    ]
    const magnitudeImage = sourceContext.createImageData(width, height)
    angleCanvas.width = width
    angleCanvas.height = height
    const angleContext = context2d(angleCanvas)
    const angleImage = angleContext.createImageData(width, height)
    for (let pixel = 0; pixel < hog.magnitude.length; pixel++) {
      const offset = pixel * 4
      const value = (hog.magnitude[pixel] / maximum) * 255
      magnitudeImage.data[offset] =
        magnitudeImage.data[offset + 1] =
        magnitudeImage.data[offset + 2] =
          value
      magnitudeImage.data[offset + 3] = 255
      const color = palette[hog.bins[pixel]]
      angleImage.data[offset] = color[0]
      angleImage.data[offset + 1] = color[1]
      angleImage.data[offset + 2] = color[2]
      angleImage.data[offset + 3] = 255
    }
    sourceContext.putImageData(magnitudeImage, 0, 0)
    angleContext.putImageData(angleImage, 0, 0)
  }

  return { main }
})
