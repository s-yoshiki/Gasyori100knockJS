/**
 * 解答の基底クラス群。
 *
 * ここには React も DOM ツリーの組み立ても登場しない。解答クラスは
 * 「canvas を何枚要求するか（layout）」と「run したときに何をするか（main）」
 * だけを宣言し、canvas の生成と配置は React 側（AnswerRunner）が担当する。
 * この分離のおかげで、解答本体は UI の変更から独立していられる。
 */

import { drawImage, fitToImage } from '@/lib/canvas'
import { renderHistogram } from '@/lib/histogram'
import { srcImage } from './images'

/** 解答が要求する canvas の構成。AnswerRunner がこれを見てレイアウトを決める。 */
export type AnswerLayout =
  | 'one-canvas'
  | 'two-canvas'
  | 'three-canvas'
  | 'four-canvas'
  | 'histogram'
  | 'three-canvas-histogram'

/** レイアウトごとに必要な canvas 枚数。 */
export const CANVAS_COUNT: Record<AnswerLayout, number> = {
  'one-canvas': 1,
  'two-canvas': 2,
  'three-canvas': 3,
  'four-canvas': 4,
  histogram: 2,
  'three-canvas-histogram': 3,
}

/** 解答から UI 側へ情報を返すための口。 */
export interface AnswerHost {
  /** 実行ログを表示する。 */
  log(message: string, options?: { preformatted?: boolean; clear?: boolean }): void
}

/**
 * すべての解答の基底。
 *
 * 各解答は `main()` だけを実装する。canvas の寸法合わせや入力画像の描画は
 * レイアウト別のサブクラスが `mount()` で面倒を見る。
 */
export abstract class BaseAnswer {
  /** 要求する canvas の構成。 */
  abstract readonly layout: AnswerLayout

  /** 入力画像の URL。`setSrcImage()` で切り替わる。 */
  protected imageUrl: string = srcImage.default

  /** UI 側から注入される。`showMessage()` の出力先。 */
  private host: AnswerHost | null = null

  /** UI 側が実行環境を接続する。 */
  attach(host: AnswerHost): void {
    this.host = host
  }

  /** 入力画像を切り替える。 */
  setSrcImage(url: string): void {
    this.imageUrl = url
  }

  /** 現在の入力画像 URL。 */
  getSrcImage(): string {
    return this.imageUrl
  }

  /**
   * canvas が用意された直後に呼ばれる。入力画像の表示など初期描画を行う。
   * run ボタンを押す前の状態をここで作る。
   *
   * 追加の画像を読み込むなど非同期の準備がある場合は Promise を返してよい。
   * UI 側はそれが解決するまで run を押せない状態を保つ。
   */
  abstract mount(canvases: HTMLCanvasElement[], image: HTMLImageElement): void | Promise<void>

  /** run ボタン押下時に呼ばれる。レイアウト別サブクラスが `main()` へ振り分ける。 */
  abstract run(canvases: HTMLCanvasElement[], image: HTMLImageElement): void

  /**
   * 実行結果のメッセージを出力する。
   *
   * @param msg 本文
   * @param preformatted 等幅・改行維持で表示するか
   * @param clear 既存のログを消してから出力するか
   */
  protected showMessage(msg: string, preformatted = true, clear = false): void {
    this.host?.log(msg, { preformatted, clear })
  }
}

/**
 * canvas 1 枚。入力画像を使わず、フィルタのカーネルなどを直接描くための構成。
 */
export abstract class OneCanvasAnswer extends BaseAnswer {
  readonly layout = 'one-canvas' as const

  /** 描画する正方 canvas の一辺。サブクラスのコンストラクタで上書きする。 */
  protected kSize = 128

  override mount(canvases: HTMLCanvasElement[]): void {
    canvases[0].width = canvases[0].height = this.kSize
  }

  override run(canvases: HTMLCanvasElement[]): void {
    this.main(canvases[0])
  }

  protected abstract main(canvas: HTMLCanvasElement): void
}

/**
 * canvas 2 枚。左に入力画像、右に処理結果という最も基本的な構成。
 */
export abstract class TwoCanvasAnswer extends BaseAnswer {
  readonly layout = 'two-canvas' as const

  override mount(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    fitToImage(image, canvases[0], canvases[1])
    drawImage(canvases[0], image)
  }

  override run(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    this.main(canvases[1], image)
  }

  protected abstract main(canvas: HTMLCanvasElement, image: HTMLImageElement): void
}

/**
 * canvas 3 枚。入力画像 + 中間結果 + 最終結果。
 */
export abstract class ThreeCanvasAnswer extends BaseAnswer {
  readonly layout = 'three-canvas' as const

  override mount(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    fitToImage(image, canvases[0], canvases[1], canvases[2])
    drawImage(canvases[0], image)
  }

  override run(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    this.main(canvases[1], canvases[2], image)
  }

  protected abstract main(
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    image: HTMLImageElement,
  ): void
}

/**
 * canvas 4 枚。入力画像 + 3 段階の結果。
 */
export abstract class FourCanvasAnswer extends BaseAnswer {
  readonly layout = 'four-canvas' as const

  override mount(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    fitToImage(image, canvases[0], canvases[1], canvases[2], canvases[3])
    drawImage(canvases[0], image)
  }

  override run(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    this.main(canvases[1], canvases[2], canvases[3], image)
  }

  protected abstract main(
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    canvas3: HTMLCanvasElement,
    image: HTMLImageElement,
  ): void
}

/**
 * 入力画像 + ヒストグラム。
 *
 * `main()` には入力画像が描かれた canvas がそのまま渡る（画素値を読むため）。
 * 既定の入力画像は、ヒストグラムの偏りが分かりやすい imori_dark。
 */
export abstract class HistogramAnswer extends BaseAnswer {
  readonly layout = 'histogram' as const

  /** ヒストグラムの描画先。`mount()` で確定する。 */
  private graph: HTMLCanvasElement | null = null

  constructor() {
    super()
    this.setSrcImage(srcImage.dark)
  }

  override mount(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    this.graph = canvases[1]
    drawImage(canvases[0], image)
    // run 前でも軸だけは見えるように空のグラフを描く
    this.renderChart(new Array(256).fill(0))
  }

  override run(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    this.main(canvases[0], image)
  }

  /** ヒストグラムを描画する。 */
  protected renderChart(data: readonly number[]): void {
    if (this.graph) {
      renderHistogram(this.graph, data, { title: '画素値の度数分布' })
    }
  }

  protected abstract main(canvas: HTMLCanvasElement, image: HTMLImageElement): void
}

/**
 * 入力画像 + 処理結果 + ヒストグラム。
 *
 * ヒストグラム平坦化など「処理前後をヒストグラムで比べたい」問題で使う。
 */
export abstract class ThreeCanvasHistogramAnswer extends BaseAnswer {
  readonly layout = 'three-canvas-histogram' as const

  private graph: HTMLCanvasElement | null = null

  constructor() {
    super()
    this.setSrcImage(srcImage.dark)
  }

  override mount(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    this.graph = canvases[2]
    fitToImage(image, canvases[0], canvases[1])
    drawImage(canvases[0], image)
    this.renderChart(new Array(256).fill(0))
  }

  override run(canvases: HTMLCanvasElement[], image: HTMLImageElement): void {
    this.main(canvases[1], image)
  }

  /** ヒストグラムを描画する。 */
  protected renderChart(data: readonly number[]): void {
    if (this.graph) {
      renderHistogram(this.graph, data, { title: '画素値の度数分布' })
    }
  }

  protected abstract main(canvas: HTMLCanvasElement, image: HTMLImageElement): void
}
