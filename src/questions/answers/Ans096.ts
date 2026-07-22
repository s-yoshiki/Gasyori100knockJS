import { context2d } from '@/lib/canvas'
import { TinyNeuralNetwork } from '@/lib/vision'
import { createTwoCanvasAnswer } from '../base'
import config from '../images'
import { createTrainingDatabase, drawBoxes, TRAINING_GROUND_TRUTH } from './objectDetection'

export default createTwoCanvasAnswer(
  ({ showMessage }) => {
    const main = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
      const database = createTrainingDatabase(image)
      const network = new TinyNeuralNetwork(database.samples[0].length, 64, 0)
      network.train(database.samples, database.labels, 35, 0.06)
      const predictions = database.samples.map((sample) => network.predict(sample))
      const correct = predictions.filter(
        (score, index) => (score >= 0.5 ? 1 : 0) === database.labels[index],
      ).length
      const context = context2d(canvas)
      context.drawImage(image, 0, 0)
      drawBoxes(
        context,
        database.boxes.filter((box) => box.score === 0),
        'rgba(35, 105, 235, .16)',
      )
      drawBoxes(
        context,
        database.boxes.filter((box) => box.score === 1),
        'rgba(255, 45, 85, .8)',
      )
      drawBoxes(context, [{ ...TRAINING_GROUND_TRUTH, score: 1 }], '#23c875')
      showMessage(
        `Accuracy: ${(correct / database.samples.length).toFixed(3)} (${correct} / ${database.samples.length})`,
      )
    }
    return { main }
  },
  { imageUrl: config.srcImage.imori1 },
)
