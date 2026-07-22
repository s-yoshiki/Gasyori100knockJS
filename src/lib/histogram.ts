/**
 * ヒストグラム描画。
 *
 * かつて chart.js に依存していた棒グラフを Canvas 2D API で直接描画する。
 * 描画色は CSS カスタムプロパティから読むため、ライト/ダークテーマに追従する。
 */

import { context2d } from './canvas'

export interface HistogramOptions {
  /** グラフ上部に表示するタイトル */
  title?: string
  /** 論理ピクセルでの描画幅 */
  width?: number
  /** 論理ピクセルでの描画高さ */
  height?: number
  /** Y 軸の最大値。省略時はデータの最大値から決める */
  max?: number
}

const PADDING = { top: 28, right: 12, bottom: 22, left: 48 } as const

/** 要素に適用されている CSS カスタムプロパティを解決する。 */
function cssVar(element: Element, name: string, fallback: string): string {
  const value = getComputedStyle(element).getPropertyValue(name).trim()
  return value.length > 0 ? value : fallback
}

/** Y 軸の目盛りとして収まりの良い刻み幅を求める（1/2/5 × 10^n）。 */
function niceStep(range: number, targetTicks: number): number {
  if (range <= 0) return 1
  const rough = range / targetTicks
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const normalized = rough / magnitude
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10
  return step * magnitude
}

/** 大きな数値を 12k / 3.4M のように短く整形する。 */
function formatTick(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`
  return String(value)
}

/**
 * 度数分布を棒グラフとして canvas に描画する。
 *
 * @param canvas 描画先
 * @param data ビンごとの度数
 */
export function renderHistogram(
  canvas: HTMLCanvasElement,
  data: readonly number[],
  options: HistogramOptions = {},
): void {
  const { title = 'Histogram', width = 512, height = 240 } = options

  // devicePixelRatio を考慮して実ピクセル数を確保し、論理座標で描く
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.aspectRatio = `${width} / ${height}`

  const ctx = context2d(canvas)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, width, height)

  const axisColor = cssVar(canvas, '--chart-axis', '#c8ccd4')
  const gridColor = cssVar(canvas, '--chart-grid', '#e6e9ef')
  const textColor = cssVar(canvas, '--chart-text', '#5b6472')
  const barColor = cssVar(canvas, '--chart-bar', '#4f7cff')

  const plotWidth = width - PADDING.left - PADDING.right
  const plotHeight = height - PADDING.top - PADDING.bottom
  const baseline = PADDING.top + plotHeight

  ctx.font =
    '11px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
  ctx.textBaseline = 'middle'

  // タイトル
  ctx.fillStyle = textColor
  ctx.textAlign = 'left'
  ctx.font = '600 12px system-ui, -apple-system, "Segoe UI", sans-serif'
  ctx.fillText(title, PADDING.left, PADDING.top / 2)
  ctx.font =
    '11px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'

  // 度数の計算過程で NaN が紛れても軸が壊れないよう、有限値だけを見る
  let dataMax = 0
  for (const value of data) {
    if (Number.isFinite(value) && value > dataMax) dataMax = value
  }
  const max = options.max ?? dataMax

  // 目盛り線とラベル
  const step = niceStep(max, 4)
  const axisMax = max > 0 ? Math.ceil(max / step) * step : 1
  ctx.textAlign = 'right'
  for (let value = 0; value <= axisMax; value += step) {
    const y = baseline - (value / axisMax) * plotHeight
    ctx.strokeStyle = value === 0 ? axisColor : gridColor
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(PADDING.left, Math.round(y) + 0.5)
    ctx.lineTo(PADDING.left + plotWidth, Math.round(y) + 0.5)
    ctx.stroke()

    ctx.fillStyle = textColor
    ctx.fillText(formatTick(value), PADDING.left - 8, y)
  }

  // 棒
  if (data.length > 0 && axisMax > 0) {
    const slot = plotWidth / data.length
    ctx.fillStyle = barColor
    for (let i = 0; i < data.length; i++) {
      const value = data[i]
      if (!Number.isFinite(value) || value <= 0) continue
      const barHeight = Math.min((value / axisMax) * plotHeight, plotHeight)
      const x = PADDING.left + i * slot
      // ビンが多いときは隙間を作らず、面として見せる
      ctx.fillRect(x, baseline - barHeight, slot > 3 ? slot - 1 : slot, barHeight)
    }
  }

  // X 軸
  ctx.strokeStyle = axisColor
  ctx.beginPath()
  ctx.moveTo(PADDING.left, Math.round(baseline) + 0.5)
  ctx.lineTo(PADDING.left + plotWidth, Math.round(baseline) + 0.5)
  ctx.stroke()

  // X 軸ラベル（両端と中央のみ）
  ctx.fillStyle = textColor
  const lastIndex = Math.max(data.length - 1, 0)
  const labels: Array<[number, CanvasTextAlign]> = [
    [0, 'left'],
    [Math.round(lastIndex / 2), 'center'],
    [lastIndex, 'right'],
  ]
  for (const [index, align] of labels) {
    ctx.textAlign = align
    const x = PADDING.left + (lastIndex === 0 ? 0 : (index / lastIndex) * plotWidth)
    ctx.fillText(String(index), x, baseline + 11)
  }
}
