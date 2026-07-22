import { context2d } from '@/lib/canvas'
import { computeHog, grayscale } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'

/** 9方向それぞれへの投票量を3x3のヒートマップとして並べる。 */
export default createTwoCanvasAnswer(() => {
  const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const scratch = document.createElement('canvas')
    scratch.width = image.width
    scratch.height = image.height
    const scratchContext = context2d(scratch)
    scratchContext.drawImage(image, 0, 0)
    const source = scratchContext.getImageData(0, 0, image.width, image.height)
    const hog = computeHog(grayscale(source.data), image.width, image.height)
    const scale = 10
    canvas.width = hog.cellsX * scale * 3
    canvas.height = hog.cellsY * scale * 3
    const context = context2d(canvas)
    context.fillStyle = '#111'
    context.fillRect(0, 0, canvas.width, canvas.height)

    for (let bin = 0; bin < 9; bin++) {
      const maximum = Math.max(...hog.histograms.map((histogram) => histogram[bin]), 1)
      const originX = (bin % 3) * hog.cellsX * scale
      const originY = Math.floor(bin / 3) * hog.cellsY * scale
      for (let cy = 0; cy < hog.cellsY; cy++) {
        for (let cx = 0; cx < hog.cellsX; cx++) {
          const value = Math.round((hog.histograms[cy * hog.cellsX + cx][bin] / maximum) * 255)
          context.fillStyle = `rgb(${value}, ${Math.round(value * 0.72)}, ${255 - value})`
          context.fillRect(originX + cx * scale, originY + cy * scale, scale, scale)
        }
      }
      context.fillStyle = '#fff'
      context.font = '10px sans-serif'
      context.fillText(`${bin * 20}°`, originX + 2, originY + 10)
    }
  }

  return { main }
})
