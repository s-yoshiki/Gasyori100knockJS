import { context2d, drawImage, fitToImage, loadImage } from '@/lib/canvas'
import type { TinyNeuralNetwork } from '@/lib/vision'
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
      const detections = result.detections.sort((a, b) => b.score - a.score).slice(0, 120)
      const context = context2d(canvas)
      context.drawImage(image, 0, 0)
      drawBoxes(context, detections, '#ff2d55')
      showMessage(
        `候補窓: ${result.windows}\nscore ≥ 0.7: ${result.detections.length}\n描画: 上位 ${detections.length} 件`,
      )
    }
    return { mount, main }
  },
  { imageUrl: config.srcImage.imoriMany },
)
