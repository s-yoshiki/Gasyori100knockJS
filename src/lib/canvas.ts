/**
 * Canvas 操作のユーティリティ。
 */

/** 2D コンテキストを取得する。取れない場合は例外を投げる。 */
export function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('canvas: 2D コンテキストを取得できませんでした')
  }
  return ctx
}

/** 画像を読み込み、デコード完了後に解決する Promise を返す。 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', () => reject(new Error(`画像を読み込めませんでした: ${src}`)))
    image.src = src
  })
}

/** canvas を画像と同じ寸法にし、等倍で描画する。 */
export function drawImage(canvas: HTMLCanvasElement, image: HTMLImageElement): void {
  canvas.width = image.width
  canvas.height = image.height
  context2d(canvas).drawImage(image, 0, 0, image.width, image.height)
}

/** 複数の canvas を画像と同じ寸法に揃える（描画はしない）。 */
export function fitToImage(image: HTMLImageElement, ...canvases: HTMLCanvasElement[]): void {
  for (const canvas of canvases) {
    canvas.width = image.width
    canvas.height = image.height
  }
}

/** canvas を透明にクリアする。 */
export function clear(canvas: HTMLCanvasElement): void {
  context2d(canvas).clearRect(0, 0, canvas.width, canvas.height)
}
