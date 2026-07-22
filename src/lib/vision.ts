/** 後半の問題で共有する、画素配列だけを扱う画像認識ユーティリティ。 */

export interface HogFeature {
  magnitude: number[]
  angle: number[]
  bins: number[]
  histograms: number[][]
  cellsX: number
  cellsY: number
  cellSize: number
}

export interface BoundingBox {
  x1: number
  y1: number
  x2: number
  y2: number
  score: number
}

export function grayscale(data: Uint8ClampedArray): number[] {
  const gray = new Array(data.length / 4)
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
  }
  return gray
}

/** HOG の勾配、9方向ヒストグラム、3x3セルのブロック正規化を計算する。 */
export function computeHog(
  gray: readonly number[],
  width: number,
  height: number,
  cellSize = 8,
  normalize = false,
): HogFeature {
  const magnitude = new Array(width * height).fill(0)
  const angle = new Array(width * height).fill(0)
  const bins = new Array(width * height).fill(0)
  const at = (x: number, y: number) =>
    gray[Math.min(height - 1, Math.max(0, y)) * width + Math.min(width - 1, Math.max(0, x))]

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const gx = at(x + 1, y) - at(x - 1, y)
      const gy = at(x, y + 1) - at(x, y - 1)
      const index = y * width + x
      let theta = Math.atan2(gy, gx)
      if (theta < 0) theta += Math.PI
      if (theta >= Math.PI) theta -= Math.PI
      magnitude[index] = Math.hypot(gx, gy)
      angle[index] = theta
      bins[index] = Math.min(8, Math.floor(theta / (Math.PI / 9)))
    }
  }

  const cellsX = Math.floor(width / cellSize)
  const cellsY = Math.floor(height / cellSize)
  const histograms = Array.from({ length: cellsX * cellsY }, () => new Array(9).fill(0))
  for (let cy = 0; cy < cellsY; cy++) {
    for (let cx = 0; cx < cellsX; cx++) {
      const histogram = histograms[cy * cellsX + cx]
      for (let y = 0; y < cellSize; y++) {
        for (let x = 0; x < cellSize; x++) {
          const index = (cy * cellSize + y) * width + cx * cellSize + x
          histogram[bins[index]] += magnitude[index]
        }
      }
    }
  }

  if (normalize) {
    const source = histograms.map((histogram) => histogram.slice())
    for (let cy = 0; cy < cellsY; cy++) {
      for (let cx = 0; cx < cellsX; cx++) {
        let sumSquares = 0
        for (let y = Math.max(0, cy - 1); y <= Math.min(cellsY - 1, cy + 1); y++) {
          for (let x = Math.max(0, cx - 1); x <= Math.min(cellsX - 1, cx + 1); x++) {
            for (const value of source[y * cellsX + x]) sumSquares += value ** 2
          }
        }
        const denominator = Math.sqrt(sumSquares + 1)
        histograms[cy * cellsX + cx] = source[cy * cellsX + cx].map((value) => value / denominator)
      }
    }
  }

  return { magnitude, angle, bins, histograms, cellsX, cellsY, cellSize }
}

export function flattenHog(feature: HogFeature): number[] {
  return feature.histograms.flat()
}

/** グレースケール画像を bilinear 補間で任意サイズへ縮小する。 */
export function resizeGray(
  source: readonly number[],
  sourceWidth: number,
  sourceHeight: number,
  width: number,
  height: number,
): number[] {
  const result = new Array(width * height)
  for (let y = 0; y < height; y++) {
    const sy = height === 1 ? 0 : (y * (sourceHeight - 1)) / (height - 1)
    const y0 = Math.floor(sy)
    const y1 = Math.min(sourceHeight - 1, y0 + 1)
    const dy = sy - y0
    for (let x = 0; x < width; x++) {
      const sx = width === 1 ? 0 : (x * (sourceWidth - 1)) / (width - 1)
      const x0 = Math.floor(sx)
      const x1 = Math.min(sourceWidth - 1, x0 + 1)
      const dx = sx - x0
      result[y * width + x] =
        source[y0 * sourceWidth + x0] * (1 - dx) * (1 - dy) +
        source[y0 * sourceWidth + x1] * dx * (1 - dy) +
        source[y1 * sourceWidth + x0] * (1 - dx) * dy +
        source[y1 * sourceWidth + x1] * dx * dy
    }
  }
  return result
}

export function cropGray(
  gray: readonly number[],
  width: number,
  height: number,
  box: Pick<BoundingBox, 'x1' | 'y1' | 'x2' | 'y2'>,
  outputSize = 32,
): number[] {
  const x1 = Math.max(0, Math.floor(box.x1))
  const y1 = Math.max(0, Math.floor(box.y1))
  const x2 = Math.min(width, Math.ceil(box.x2))
  const y2 = Math.min(height, Math.ceil(box.y2))
  const cropWidth = Math.max(1, x2 - x1)
  const cropHeight = Math.max(1, y2 - y1)
  const crop = new Array(cropWidth * cropHeight)
  for (let y = 0; y < cropHeight; y++) {
    for (let x = 0; x < cropWidth; x++) crop[y * cropWidth + x] = gray[(y1 + y) * width + x1 + x]
  }
  return resizeGray(crop, cropWidth, cropHeight, outputSize, outputSize)
}

export function iou(
  a: Pick<BoundingBox, 'x1' | 'y1' | 'x2' | 'y2'>,
  b: Pick<BoundingBox, 'x1' | 'y1' | 'x2' | 'y2'>,
): number {
  const intersectionWidth = Math.max(0, Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1))
  const intersectionHeight = Math.max(0, Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1))
  const intersection = intersectionWidth * intersectionHeight
  const areaA = Math.max(0, a.x2 - a.x1) * Math.max(0, a.y2 - a.y1)
  const areaB = Math.max(0, b.x2 - b.x1) * Math.max(0, b.y2 - b.y1)
  const union = areaA + areaB - intersection
  return union === 0 ? 0 : intersection / union
}

export function nonMaximumSuppression(boxes: readonly BoundingBox[], threshold = 0.25) {
  const remaining = boxes.slice().sort((a, b) => b.score - a.score)
  const selected: BoundingBox[] = []
  while (remaining.length > 0) {
    const best = remaining.shift()
    if (!best) break
    selected.push(best)
    for (let index = remaining.length - 1; index >= 0; index--) {
      if (iou(best, remaining[index]) >= threshold) remaining.splice(index, 1)
    }
  }
  return selected
}

/** 同じ入力から常に同じ結果を得るための小さな疑似乱数生成器。 */
export function seededRandom(seed = 0): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return state / 0x100000000
  }
}

export interface KMeansResult {
  labels: number[]
  centers: number[][]
  iterations: number
}

export function kMeans(
  samples: readonly number[][],
  clusterCount: number,
  maxIterations = 30,
  seed = 0,
  updateCenters = true,
): KMeansResult {
  if (samples.length === 0) return { labels: [], centers: [], iterations: 0 }
  const random = seededRandom(seed)
  const chosen = new Set<number>()
  while (chosen.size < Math.min(clusterCount, samples.length)) {
    chosen.add(Math.floor(random() * samples.length))
  }
  const centers = [...chosen].map((index) => samples[index].slice())
  while (centers.length < clusterCount)
    centers.push(samples[centers.length % samples.length].slice())
  const labels = new Array(samples.length).fill(0)
  let iterations = 0

  for (; iterations < maxIterations; iterations++) {
    let labelsChanged = false
    for (let i = 0; i < samples.length; i++) {
      let best = 0
      let bestDistance = Number.POSITIVE_INFINITY
      for (let k = 0; k < centers.length; k++) {
        let distance = 0
        for (let j = 0; j < samples[i].length; j++) distance += (samples[i][j] - centers[k][j]) ** 2
        if (distance < bestDistance) {
          bestDistance = distance
          best = k
        }
      }
      if (labels[i] !== best) labelsChanged = true
      labels[i] = best
    }
    if (!updateCenters) return { labels, centers, iterations: 1 }

    const sums = Array.from({ length: clusterCount }, () => new Array(samples[0].length).fill(0))
    const counts = new Array(clusterCount).fill(0)
    for (let i = 0; i < samples.length; i++) {
      counts[labels[i]]++
      for (let j = 0; j < samples[i].length; j++) sums[labels[i]][j] += samples[i][j]
    }
    let maxShift = 0
    for (let k = 0; k < clusterCount; k++) {
      if (counts[k] === 0) continue
      for (let j = 0; j < centers[k].length; j++) {
        const value = sums[k][j] / counts[k]
        maxShift = Math.max(maxShift, Math.abs(centers[k][j] - value))
        centers[k][j] = value
      }
    }
    if (!labelsChanged || maxShift < 0.01) break
  }
  return { labels, centers, iterations: iterations + 1 }
}

/** 画像認識 Q.84〜90 と同じ、RGB各4階調の12次元ヒストグラム。 */
export function colorHistogram(data: Uint8ClampedArray): number[] {
  const histogram = new Array(12).fill(0)
  for (let i = 0; i < data.length; i += 4) {
    for (let channel = 0; channel < 3; channel++) {
      const level = Math.min(3, Math.floor((data[i + channel] / 256) * 4))
      histogram[channel * 4 + level]++
    }
  }
  return histogram
}

/** XOR と HOG 識別で用いる、2つの隠れ層を持つ小規模ニューラルネット。 */
export class TinyNeuralNetwork {
  private readonly w1: number[][]
  private readonly b1: number[]
  private readonly w2: number[][]
  private readonly b2: number[]
  private readonly wo: number[]
  private bo = 0

  constructor(inputSize: number, hiddenSize = 12, seed = 0) {
    const random = seededRandom(seed)
    const weight = (fanIn: number) => (random() * 2 - 1) * Math.sqrt(2 / fanIn)
    this.w1 = Array.from({ length: hiddenSize }, () =>
      Array.from({ length: inputSize }, () => weight(inputSize)),
    )
    this.b1 = new Array(hiddenSize).fill(0)
    this.w2 = Array.from({ length: hiddenSize }, () =>
      Array.from({ length: hiddenSize }, () => weight(hiddenSize)),
    )
    this.b2 = new Array(hiddenSize).fill(0)
    this.wo = Array.from({ length: hiddenSize }, () => weight(hiddenSize))
  }

  private sigmoid(value: number) {
    return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, value))))
  }

  private forwardAll(input: readonly number[]) {
    const h1 = this.w1.map((row, i) =>
      this.sigmoid(row.reduce((sum, weight, j) => sum + weight * input[j], this.b1[i])),
    )
    const h2 = this.w2.map((row, i) =>
      this.sigmoid(row.reduce((sum, weight, j) => sum + weight * h1[j], this.b2[i])),
    )
    const output = this.sigmoid(this.wo.reduce((sum, weight, i) => sum + weight * h2[i], this.bo))
    return { h1, h2, output }
  }

  predict(input: readonly number[]): number {
    return this.forwardAll(input).output
  }

  train(samples: readonly number[][], targets: readonly number[], epochs: number, rate: number) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let sample = 0; sample < samples.length; sample++) {
        const input = samples[sample]
        const { h1, h2, output } = this.forwardAll(input)
        const deltaOutput = output - targets[sample]
        const oldOutputWeights = this.wo.slice()
        for (let i = 0; i < this.wo.length; i++) this.wo[i] -= rate * deltaOutput * h2[i]
        this.bo -= rate * deltaOutput

        const delta2 = h2.map((value, i) => deltaOutput * oldOutputWeights[i] * value * (1 - value))
        const oldW2 = this.w2.map((row) => row.slice())
        for (let i = 0; i < this.w2.length; i++) {
          for (let j = 0; j < this.w2[i].length; j++) this.w2[i][j] -= rate * delta2[i] * h1[j]
          this.b2[i] -= rate * delta2[i]
        }

        for (let i = 0; i < this.w1.length; i++) {
          let delta1 = 0
          for (let j = 0; j < delta2.length; j++) delta1 += delta2[j] * oldW2[j][i]
          delta1 *= h1[i] * (1 - h1[i])
          for (let j = 0; j < this.w1[i].length; j++) this.w1[i][j] -= rate * delta1 * input[j]
          this.b1[i] -= rate * delta1
        }
      }
    }
  }
}
