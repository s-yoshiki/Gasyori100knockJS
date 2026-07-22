import { context2d } from '@/lib/canvas'
import {
  type BoundingBox,
  computeHog,
  cropGray,
  flattenHog,
  grayscale,
  iou,
  seededRandom,
  TinyNeuralNetwork,
} from '@/lib/vision'

export const TRAINING_GROUND_TRUTH = { x1: 47, y1: 41, x2: 129, y2: 103 }
export const DETECTION_GROUND_TRUTH = [
  { x1: 27, y1: 48, x2: 95, y2: 110 },
  { x1: 101, y1: 75, x2: 171, y2: 138 },
]

export function imageToGray(image: HTMLImageElement) {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const context = context2d(canvas)
  context.drawImage(image, 0, 0)
  return grayscale(context.getImageData(0, 0, image.width, image.height).data)
}

export function descriptorForBox(
  gray: readonly number[],
  width: number,
  height: number,
  box: Pick<BoundingBox, 'x1' | 'y1' | 'x2' | 'y2'>,
) {
  const resized = cropGray(gray, width, height, box, 32)
  return flattenHog(computeHog(resized, 32, 32, 8, true))
}

export interface TrainingDatabase {
  samples: number[][]
  labels: number[]
  boxes: BoundingBox[]
}

export function createTrainingDatabase(image: HTMLImageElement, count = 200): TrainingDatabase {
  const gray = imageToGray(image)
  const random = seededRandom(0)
  const samples: number[][] = []
  const labels: number[] = []
  const boxes: BoundingBox[] = []

  // ランダム切り抜きに加え、正例が極端に少なくならないようGT周辺も走査する。
  for (let y = 35; y <= 55; y += 5) {
    for (let x = 43; x <= 73; x += 5) {
      const box = { x1: x, y1: y, x2: x + 60, y2: y + 60, score: 1 }
      if (iou(TRAINING_GROUND_TRUTH, box) >= 0.45) boxes.push(box)
    }
  }
  while (boxes.length < count) {
    const x1 = Math.floor(random() * Math.max(1, image.width - 60))
    const y1 = Math.floor(random() * Math.max(1, image.height - 60))
    boxes.push({ x1, y1, x2: x1 + 60, y2: y1 + 60, score: 0 })
  }
  boxes.length = count
  for (const box of boxes) {
    const label = iou(TRAINING_GROUND_TRUTH, box) >= 0.45 ? 1 : 0
    box.score = label
    samples.push(descriptorForBox(gray, image.width, image.height, box))
    labels.push(label)
  }
  return { samples, labels, boxes }
}

export function trainFaceNetwork(image: HTMLImageElement) {
  const database = createTrainingDatabase(image)
  const network = new TinyNeuralNetwork(database.samples[0].length, 64, 0)
  network.train(database.samples, database.labels, 35, 0.06)
  return { network, database }
}

export function scanImage(
  image: HTMLImageElement,
  network?: TinyNeuralNetwork,
  threshold = 0.7,
): { detections: BoundingBox[]; windows: number; meanEnergy: number } {
  const gray = imageToGray(image)
  const sizes = [42, 56, 70]
  const detections: BoundingBox[] = []
  let windows = 0
  let energy = 0
  for (let y = 0; y < image.height; y += 4) {
    for (let x = 0; x < image.width; x += 4) {
      for (const size of sizes) {
        const half = Math.floor(size / 2)
        const box = {
          x1: Math.max(0, x - half),
          y1: Math.max(0, y - half),
          x2: Math.min(image.width, x + half),
          y2: Math.min(image.height, y + half),
          score: 0,
        }
        const descriptor = descriptorForBox(gray, image.width, image.height, box)
        const descriptorEnergy = descriptor.reduce((sum, value) => sum + value, 0)
        energy += descriptorEnergy
        windows++
        if (network) {
          box.score = network.predict(descriptor)
          if (box.score >= threshold) detections.push(box)
        }
      }
    }
  }
  return { detections, windows, meanEnergy: windows === 0 ? 0 : energy / windows }
}

export function drawBoxes(
  context: CanvasRenderingContext2D,
  boxes: readonly BoundingBox[],
  color: string,
  withScore = false,
) {
  context.lineWidth = 1.5
  context.strokeStyle = color
  context.fillStyle = color
  context.font = '10px sans-serif'
  for (const box of boxes) {
    context.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1)
    if (withScore) context.fillText(box.score.toFixed(2), box.x1 + 2, Math.max(10, box.y1 + 10))
  }
}
