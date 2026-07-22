/** React から独立した、関数ベースの解答実行契約。 */
import { drawImage, fitToImage } from '@/lib/canvas'
import { renderHistogram } from '@/lib/histogram'
import { srcImage } from './images'

export type AnswerLayout =
  | 'one-canvas'
  | 'two-canvas'
  | 'three-canvas'
  | 'four-canvas'
  | 'histogram'
  | 'three-canvas-histogram'

export const CANVAS_COUNT: Record<AnswerLayout, number> = {
  'one-canvas': 1,
  'two-canvas': 2,
  'three-canvas': 3,
  'four-canvas': 4,
  histogram: 2,
  'three-canvas-histogram': 3,
}

export interface AnswerHost {
  log(message: string, options?: { preformatted?: boolean; clear?: boolean }): void
}

export interface Answer {
  readonly layout: AnswerLayout
  attach: (host: AnswerHost) => void
  getSrcImage: () => string
  setSrcImage: (url: string) => void
  mount: (canvases: HTMLCanvasElement[], image: HTMLImageElement) => void | Promise<void>
  run: (canvases: HTMLCanvasElement[], image: HTMLImageElement) => void
}

export type AnswerFactory = () => Answer

interface AnswerContext {
  showMessage: (message: string, preformatted?: boolean, clear?: boolean) => void
  renderChart: (data: readonly number[]) => void
}

interface AnswerImplementation {
  main: (...args: never[]) => void
  mount?: (canvases: HTMLCanvasElement[], image: HTMLImageElement) => void | Promise<void>
}

type AnswerBuilder<T extends AnswerImplementation> = (context: AnswerContext) => T

interface AnswerOptions {
  imageUrl?: string
  canvasSize?: number
}

type Mount = Answer['mount']
type Run = Answer['run']

const createAnswerFactory = <T extends AnswerImplementation>(
  layout: AnswerLayout,
  build: AnswerBuilder<T>,
  defaultMount: (implementation: T) => Mount,
  createRun: (implementation: T) => Run,
  options: AnswerOptions = {},
): AnswerFactory => {
  return () => {
    let imageUrl = options.imageUrl ?? srcImage.default
    let host: AnswerHost | null = null
    let graph: HTMLCanvasElement | null = null

    const context: AnswerContext = {
      showMessage: (message, preformatted = true, clear = false) => {
        host?.log(message, { preformatted, clear })
      },
      renderChart: (data) => {
        if (graph) renderHistogram(graph, data, { title: '画素値の度数分布' })
      },
    }
    const implementation = build(context)
    const mount = implementation.mount ?? defaultMount(implementation)

    return {
      layout,
      attach: (nextHost) => {
        host = nextHost
      },
      getSrcImage: () => imageUrl,
      setSrcImage: (url) => {
        imageUrl = url
      },
      mount: async (canvases, image) => {
        if (layout === 'histogram') graph = canvases[1]
        if (layout === 'three-canvas-histogram') graph = canvases[2]
        await mount(canvases, image)
        if (graph) context.renderChart(new Array(256).fill(0))
      },
      run: createRun(implementation),
    }
  }
}

export const createOneCanvasAnswer = <T extends AnswerImplementation>(
  build: AnswerBuilder<T>,
  options: AnswerOptions = {},
) =>
  createAnswerFactory(
    'one-canvas',
    build,
    () => (canvases) => {
      canvases[0].width = canvases[0].height = options.canvasSize ?? 128
    },
    ({ main }) =>
      (canvases) =>
        main(canvases[0] as never),
    options,
  )

export const createTwoCanvasAnswer = <T extends AnswerImplementation>(
  build: AnswerBuilder<T>,
  options: AnswerOptions = {},
) =>
  createAnswerFactory(
    'two-canvas',
    build,
    () => (canvases, image) => {
      fitToImage(image, canvases[0], canvases[1])
      drawImage(canvases[0], image)
    },
    ({ main }) =>
      (canvases, image) =>
        main(canvases[1] as never, image as never),
    options,
  )

export const createThreeCanvasAnswer = <T extends AnswerImplementation>(
  build: AnswerBuilder<T>,
  options: AnswerOptions = {},
) =>
  createAnswerFactory(
    'three-canvas',
    build,
    () => (canvases, image) => {
      fitToImage(image, canvases[0], canvases[1], canvases[2])
      drawImage(canvases[0], image)
    },
    ({ main }) =>
      (canvases, image) =>
        main(canvases[1] as never, canvases[2] as never, image as never),
    options,
  )

export const createFourCanvasAnswer = <T extends AnswerImplementation>(
  build: AnswerBuilder<T>,
  options: AnswerOptions = {},
) =>
  createAnswerFactory(
    'four-canvas',
    build,
    () => (canvases, image) => {
      fitToImage(image, canvases[0], canvases[1], canvases[2], canvases[3])
      drawImage(canvases[0], image)
    },
    ({ main }) =>
      (canvases, image) =>
        main(canvases[1] as never, canvases[2] as never, canvases[3] as never, image as never),
    options,
  )

export const createHistogramAnswer = <T extends AnswerImplementation>(
  build: AnswerBuilder<T>,
  options: AnswerOptions = {},
) =>
  createAnswerFactory(
    'histogram',
    build,
    () => (canvases, image) => drawImage(canvases[0], image),
    ({ main }) =>
      (canvases, image) =>
        main(canvases[0] as never, image as never),
    { imageUrl: srcImage.dark, ...options },
  )

export const createThreeCanvasHistogramAnswer = <T extends AnswerImplementation>(
  build: AnswerBuilder<T>,
  options: AnswerOptions = {},
) =>
  createAnswerFactory(
    'three-canvas-histogram',
    build,
    () => (canvases, image) => {
      fitToImage(image, canvases[0], canvases[1])
      drawImage(canvases[0], image)
    },
    ({ main }) =>
      (canvases, image) =>
        main(canvases[1] as never, image as never),
    { imageUrl: srcImage.dark, ...options },
  )
