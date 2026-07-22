/**
 * 行列演算。
 *
 * かつて mathjs に依存していた 3 つの関数（inv / dotDivide / dotMultiply）だけを
 * 自前実装したもの。mathjs 本体は 1MB を超えるため、必要な分だけを持つ。
 */

export type Matrix = number[][]

/** 行列の行数・列数が一致しているか検証する。 */
function assertSameShape(a: Matrix, b: Matrix): void {
  if (a.length !== b.length || a.some((row, i) => row.length !== b[i].length)) {
    throw new Error('matrix: 行列の形状が一致していません')
  }
}

/**
 * 逆行列を求める（ガウス・ジョルダン法、部分ピボット選択あり）。
 *
 * mathjs の `math.inv` 相当。射影変換（Q.29〜31）で 3x3 行列に対して使う。
 *
 * @throws 正方行列でない場合、または特異行列の場合
 */
export function inverse(matrix: Matrix): Matrix {
  const n = matrix.length
  if (n === 0 || matrix.some((row) => row.length !== n)) {
    throw new Error('inverse: 正方行列が必要です')
  }

  // [A | I] の拡大係数行列を作る
  const a = matrix.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ])

  for (let col = 0; col < n; col++) {
    // 部分ピボット選択: 絶対値が最大の行を選ぶ
    let pivot = col
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) {
        pivot = row
      }
    }
    if (Math.abs(a[pivot][col]) < Number.EPSILON) {
      throw new Error('inverse: 特異行列のため逆行列が存在しません')
    }
    ;[a[col], a[pivot]] = [a[pivot], a[col]]

    // ピボット行を正規化
    const p = a[col][col]
    for (let j = 0; j < 2 * n; j++) {
      a[col][j] /= p
    }

    // 他の行から掃き出す
    for (let row = 0; row < n; row++) {
      if (row === col) continue
      const factor = a[row][col]
      if (factor === 0) continue
      for (let j = 0; j < 2 * n; j++) {
        a[row][j] -= factor * a[col][j]
      }
    }
  }

  return a.map((row) => row.slice(n))
}

/**
 * 要素ごとの乗算（アダマール積）。mathjs の `math.dotMultiply` 相当。
 */
export function dotMultiply(a: Matrix, b: Matrix): Matrix {
  assertSameShape(a, b)
  return a.map((row, i) => row.map((v, j) => v * b[i][j]))
}

/**
 * 要素ごとの除算。mathjs の `math.dotDivide` 相当。
 */
export function dotDivide(a: Matrix, b: Matrix): Matrix {
  assertSameShape(a, b)
  return a.map((row, i) => row.map((v, j) => v / b[i][j]))
}
