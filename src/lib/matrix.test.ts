import { describe, expect, it } from 'vitest'
import { dotDivide, dotMultiply, inverse, type Matrix } from './matrix'

/** a × b を計算する（検証用）。 */
function multiply(a: Matrix, b: Matrix): Matrix {
  return a.map((row) => b[0].map((_, j) => row.reduce((sum, v, k) => sum + v * b[k][j], 0)))
}

describe('inverse', () => {
  it('単位行列の逆行列は単位行列', () => {
    const identity = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
    expect(inverse(identity)).toEqual(identity)
  })

  it('射影変換で使う 3x3 行列の逆行列は、元の行列との積が単位行列になる', () => {
    const h = [
      [1.2, 0.3, 5],
      [0.1, 0.9, -3],
      [0.002, 0.001, 1],
    ]
    const product = multiply(h, inverse(h))
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        expect(product[i][j]).toBeCloseTo(i === j ? 1 : 0, 10)
      }
    }
  })

  it('ピボットが 0 でも部分ピボット選択で解ける', () => {
    const m = [
      [0, 1],
      [1, 0],
    ]
    expect(inverse(m)).toEqual([
      [0, 1],
      [1, 0],
    ])
  })

  it('特異行列では例外を投げる', () => {
    expect(() =>
      inverse([
        [1, 2],
        [2, 4],
      ]),
    ).toThrow()
  })

  it('正方行列でなければ例外を投げる', () => {
    expect(() => inverse([[1, 2, 3]])).toThrow()
  })
})

describe('dotMultiply / dotDivide', () => {
  const a = [
    [2, 4],
    [6, 8],
  ]
  const b = [
    [1, 2],
    [3, 4],
  ]

  it('要素ごとに掛ける', () => {
    expect(dotMultiply(a, b)).toEqual([
      [2, 8],
      [18, 32],
    ])
  })

  it('要素ごとに割る', () => {
    expect(dotDivide(a, b)).toEqual([
      [2, 2],
      [2, 2],
    ])
  })

  it('割って掛け戻すと元に戻る（JPEG の量子化と同じ流れ）', () => {
    expect(dotMultiply(dotDivide(a, b), b)).toEqual(a)
  })

  it('形状が違えば例外を投げる', () => {
    expect(() => dotMultiply(a, [[1, 2]])).toThrow()
  })
})
