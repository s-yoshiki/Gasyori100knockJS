import { context2d, drawImage, fitToImage, loadImage } from '@/lib/canvas'
import { nonMaximumSuppression, type TinyNeuralNetwork } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'
import { drawBoxes, scanImage, trainFaceNetwork } from './objectDetection'

export default createTwoCanvasAnswer(
  ({ showMessage }) => {
    let network: TinyNeuralNetwork | null = null
    const mount = async (canvases: HTMLCanvasElement[], image: HTMLImageElement) => {
      fitToImage(image, ...canvases)
      drawImage(canvases[0], image)
      const trainingImage = await loadImage(config.srcImage.imori1)
      network = trainFaceNetwork(trainingImage).network
    }
    const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      if (!network) return
      const result = scanImage(image, network, 0.7)
      const selected = nonMaximumSuppression(result.detections, 0.25)
      const context = context2d(canvas)
      context.drawImage(image, 0, 0)
      drawBoxes(context, selected, '#ff2d55', true)
      showMessage(`NMS前: ${result.detections.length}\nNMS後: ${selected.length}\nIoU閾値: 0.25`)
    }
    return { mount, main }
  },
  { imageUrl: config.srcImage.imoriMany },
)
