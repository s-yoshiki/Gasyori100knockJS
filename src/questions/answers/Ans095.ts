import { context2d } from '@/lib/canvas'
import { TinyNeuralNetwork } from '@/lib/vision'
import { createOneCanvasAnswer } from '../base'

export default createOneCanvasAnswer(
  ({ showMessage }) => {
    const main = (canvas: HTMLCanvasElement) => {
      const inputs = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ]
      const targets = [0, 1, 1, 0]
      const network = new TinyNeuralNetwork(2, 64, 0)
      network.train(inputs, targets, 3000, 0.2)
      const predictions = inputs.map((input) => network.predict(input))

      canvas.width = 520
      canvas.height = 230
      const context = context2d(canvas)
      context.fillStyle = '#fff'
      context.fillRect(0, 0, canvas.width, canvas.height)
      const layers = [
        { x: 55, count: 2, label: '入力層' },
        { x: 185, count: 8, label: '中間層 1（64）' },
        { x: 325, count: 8, label: '中間層 2（64）' },
        { x: 465, count: 1, label: '出力層' },
      ]
      context.strokeStyle = 'rgba(70, 90, 130, .16)'
      for (let layer = 0; layer < layers.length - 1; layer++) {
        for (let from = 0; from < layers[layer].count; from++) {
          for (let to = 0; to < layers[layer + 1].count; to++) {
            const fromY = 35 + ((from + 1) * 150) / (layers[layer].count + 1)
            const toY = 35 + ((to + 1) * 150) / (layers[layer + 1].count + 1)
            context.beginPath()
            context.moveTo(layers[layer].x, fromY)
            context.lineTo(layers[layer + 1].x, toY)
            context.stroke()
          }
        }
      }
      for (const layer of layers) {
        context.fillStyle = '#3157d5'
        for (let node = 0; node < layer.count; node++) {
          const y = 35 + ((node + 1) * 150) / (layer.count + 1)
          context.beginPath()
          context.arc(layer.x, y, 5, 0, Math.PI * 2)
          context.fill()
        }
        context.fillStyle = '#222'
        context.font = '12px sans-serif'
        context.textAlign = 'center'
        context.fillText(layer.label, layer.x, 215)
      }
      showMessage(
        inputs
          .map((input, index) => `in: [${input}]  pred: ${predictions[index].toFixed(4)}`)
          .join('\n'),
      )
    }
    return { main }
  },
  { canvasSize: 520 },
)
