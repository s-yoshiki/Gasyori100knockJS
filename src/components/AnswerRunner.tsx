import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { loadImage } from '@/lib/canvas'
import { CANVAS_COUNT, type AnswerLayout } from '@/questions/base'
import { srcImageOptions } from '@/questions/images'
import { createAnswer } from '@/questions/registry'
import './AnswerRunner.css'

/** canvas に添えるラベル。レイアウトごとに意味が違う。 */
const CANVAS_LABELS: Record<AnswerLayout, string[]> = {
  'one-canvas': ['出力'],
  'two-canvas': ['入力', '出力'],
  'three-canvas': ['入力', '出力 1', '出力 2'],
  'four-canvas': ['入力', '出力 1', '出力 2', '出力 3'],
  histogram: ['入力', 'ヒストグラム'],
  'three-canvas-histogram': ['入力', '出力', 'ヒストグラム'],
}

/** ヒストグラムの canvas は画像ではないので幅いっぱいに広げる。 */
function isGraph(layout: AnswerLayout, index: number): boolean {
  if (layout === 'histogram') return index === 1
  if (layout === 'three-canvas-histogram') return index === 2
  return false
}

interface LogEntry {
  id: number
  html: string
  preformatted: boolean
}

export interface AnswerRunnerProps {
  /** 問題番号 */
  id: number
}

/**
 * 解答クラスを実際に動かす場所。
 *
 * canvas の生成・入力画像の読み込み・run ボタン・ログ表示を受け持ち、
 * 画像処理そのものは解答クラス側に委ねる。
 */
export function AnswerRunner({ id }: AnswerRunnerProps) {
  const answer = useMemo(() => createAnswer(id), [id])
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const imageRef = useRef<HTMLImageElement | null>(null)

  const [imageSrc, setImageSrc] = useState(() => answer?.getSrcImage() ?? '')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [running, setRunning] = useState(false)

  const layout = answer?.layout ?? 'two-canvas'
  const canvasCount = CANVAS_COUNT[layout]
  const labels = CANVAS_LABELS[layout]

  // 解答からのメッセージ出力をこのコンポーネントの state に流す。
  // 問題ごとに AnswerRunner を key で作り直しているので、購読は一度だけでよい。
  useEffect(() => {
    if (!answer) return
    let sequence = 0
    answer.attach({
      log(message, options) {
        if (options?.clear) {
          setLogs([])
        }
        if (message.length === 0) return
        setLogs((prev) => [
          ...prev,
          { id: sequence++, html: message, preformatted: options?.preformatted ?? true },
        ])
      },
    })
  }, [answer])

  // 入力画像の読み込みと初期描画。
  // 「読み込み中」への切り替えは選択を変えたハンドラ側で行い、ここでは結果だけを反映する。
  useEffect(() => {
    if (!answer || imageSrc.length === 0) return
    let cancelled = false

    answer.setSrcImage(imageSrc)

    void loadImage(imageSrc)
      .then(async (image) => {
        if (cancelled) return
        const canvases = canvasRefs.current.slice(0, canvasCount).filter((c) => c !== null)
        if (canvases.length < canvasCount) return
        imageRef.current = image
        // mount が追加の読み込みを行う問題（Q.60 など）もあるので完了を待つ
        await answer.mount(canvases, image)
        if (cancelled) return
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [answer, imageSrc, canvasCount])

  const handleRun = useCallback(() => {
    const image = imageRef.current
    if (!answer || !image) return
    const canvases = canvasRefs.current.slice(0, canvasCount).filter((c) => c !== null)
    if (canvases.length < canvasCount) return

    setRunning(true)
    setLogs([])
    // 重い処理でボタンの押下状態が描画される前に固まらないよう、一度制御を返す。
    // requestAnimationFrame は非表示タブで発火しないため setTimeout を使う。
    setTimeout(() => {
      try {
        answer.run(canvases, image)
      } finally {
        setRunning(false)
      }
    }, 0)
  }, [answer, canvasCount])

  if (!answer) {
    return (
      <div className="runner runner--empty card">
        <p>この問題はまだ実装されていません。</p>
      </div>
    )
  }

  return (
    <div className="runner">
      <div className="runner__toolbar">
        <label className="runner__field">
          <span className="runner__field-label">入力画像</span>
          <select
            className="select"
            value={imageSrc}
            onChange={(event) => {
              setImageSrc(event.target.value)
              setStatus('loading')
              setLogs([])
            }}
          >
            {srcImageOptions.map((option) => (
              <option key={option.src} value={option.src}>
                {option.label}
              </option>
            ))}
            {/* 選択肢に無い既定画像（thorino など）も表示できるようにする */}
            {!srcImageOptions.some((option) => option.src === imageSrc) && (
              <option value={imageSrc}>この問題の既定画像</option>
            )}
          </select>
        </label>

        <button
          type="button"
          className="button button--primary"
          onClick={handleRun}
          disabled={status !== 'ready' || running}
        >
          {running ? '実行中…' : '実行'}
        </button>
      </div>

      {status === 'error' && (
        <p className="runner__error" role="alert">
          入力画像を読み込めませんでした。
        </p>
      )}

      <div className={`runner__canvases runner__canvases--${layout}`}>
        {Array.from({ length: canvasCount }, (_, index) => (
          <figure
            key={index}
            className={`runner__figure${isGraph(layout, index) ? ' runner__figure--graph' : ''}`}
          >
            <canvas
              ref={(node) => {
                canvasRefs.current[index] = node
              }}
              className="runner__canvas"
            />
            <figcaption className="runner__caption">{labels[index]}</figcaption>
          </figure>
        ))}
      </div>

      {logs.length > 0 && (
        <div className="runner__logs">
          {logs.map((entry) =>
            entry.preformatted ? (
              // 解答が生成する文字列はリポジトリ内のコードのみが作る。外部入力は混ざらない。
              <pre
                key={entry.id}
                className="runner__log"
                dangerouslySetInnerHTML={{ __html: entry.html }}
              />
            ) : (
              <div
                key={entry.id}
                className="runner__log"
                dangerouslySetInnerHTML={{ __html: entry.html }}
              />
            ),
          )}
        </div>
      )}
    </div>
  )
}
