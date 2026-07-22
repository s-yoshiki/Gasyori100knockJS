import { context2d, drawImage, fitToImage, loadImage } from '@/lib/canvas'
import { iou, nonMaximumSuppression, type TinyNeuralNetwork } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'
import { DETECTION_GROUND_TRUTH, drawBoxes, scanImage, trainFaceNetwork } from './objectDetection'

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
      const detected = nonMaximumSuppression(scanImage(image, network, 0.7).detections, 0.25)
      const sorted = detected.slice().sort((a, b) => b.score - a.score)
      const matchedGroundTruth = DETECTION_GROUND_TRUTH.filter((truth) =>
        sorted.some((box) => iou(box, truth) >= 0.5),
      ).length
      const judgements = sorted.map((box) =>
        DETECTION_GROUND_TRUTH.some((truth) => iou(box, truth) >= 0.5),
      )
      const truePositives = judgements.filter(Boolean).length
      const recall = matchedGroundTruth / DETECTION_GROUND_TRUTH.length
      const precision = sorted.length === 0 ? 0 : truePositives / sorted.length
      const fScore = recall + precision === 0 ? 0 : (2 * recall * precision) / (recall + precision)
      let accumulatedPrecision = 0
      let positives = 0
      for (let i = 0; i < judgements.length; i++) {
        if (!judgements[i]) continue
        positives++
        accumulatedPrecision += positives / (i + 1)
      }
      const meanAveragePrecision = positives === 0 ? 0 : accumulatedPrecision / positives

      const context = context2d(canvas)
      context.drawImage(image, 0, 0)
      drawBoxes(
        context,
        DETECTION_GROUND_TRUTH.map((box) => ({ ...box, score: 1 })),
        '#28c97b',
      )
      drawBoxes(
        context,
        sorted.filter((box) => DETECTION_GROUND_TRUTH.some((truth) => iou(box, truth) >= 0.5)),
        '#ff2d55',
        true,
      )
      drawBoxes(
        context,
        sorted.filter((box) => !DETECTION_GROUND_TRUTH.some((truth) => iou(box, truth) >= 0.5)),
        '#2675ef',
        true,
      )
      showMessage(
        `Recall: ${recall.toFixed(3)} (${matchedGroundTruth} / ${DETECTION_GROUND_TRUTH.length})\n` +
          `Precision: ${precision.toFixed(3)} (${truePositives} / ${sorted.length})\n` +
          `F-score: ${fScore.toFixed(3)}\n` +
          `mAP: ${meanAveragePrecision.toFixed(3)}`,
      )
    }
    return { mount, main }
  },
  { imageUrl: config.srcImage.imoriMany },
)
