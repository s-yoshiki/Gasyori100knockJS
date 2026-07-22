import { describe, expect, it } from 'vitest'
import { computeHog, iou, kMeans, nonMaximumSuppression, TinyNeuralNetwork } from './vision'

describe('vision', () => {
  it('IoUを共通部分と和集合の比として計算する', () => {
    const a = { x1: 50, y1: 50, x2: 150, y2: 150 }
    const b = { x1: 60, y1: 60, x2: 170, y2: 160 }
    expect(iou(a, b)).toBeCloseTo(0.6279069, 6)
    expect(iou(a, { x1: 200, y1: 200, x2: 210, y2: 210 })).toBe(0)
  })

  it('NMSで重なる低スコア矩形を除く', () => {
    const boxes = [
      { x1: 0, y1: 0, x2: 10, y2: 10, score: 0.9 },
      { x1: 1, y1: 1, x2: 11, y2: 11, score: 0.8 },
      { x1: 30, y1: 30, x2: 40, y2: 40, score: 0.7 },
    ]
    expect(nonMaximumSuppression(boxes, 0.5)).toEqual([boxes[0], boxes[2]])
  })

  it('K-meansが離れた標本を2群へ分ける', () => {
    const result = kMeans(
      [
        [0, 0],
        [0, 1],
        [10, 10],
        [10, 11],
      ],
      2,
      30,
      2,
    )
    expect(result.labels[0]).toBe(result.labels[1])
    expect(result.labels[2]).toBe(result.labels[3])
    expect(result.labels[0]).not.toBe(result.labels[2])
  })

  it('一定濃度の画像ではHOGの勾配が0になる', () => {
    const hog = computeHog(new Array(16 * 16).fill(128), 16, 16, 8, true)
    expect(hog.magnitude.every((value) => value === 0)).toBe(true)
    expect(hog.histograms.flat().every((value) => value === 0)).toBe(true)
    expect(hog.cellsX).toBe(2)
    expect(hog.cellsY).toBe(2)
  })

  it('2隠れ層ネットワークがXORを学習する', () => {
    const samples = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]
    const network = new TinyNeuralNetwork(2, 64, 0)
    network.train(samples, [0, 1, 1, 0], 3000, 0.2)
    expect(samples.map((sample) => network.predict(sample) >= 0.5)).toEqual([
      false,
      true,
      true,
      false,
    ])
  })
})
