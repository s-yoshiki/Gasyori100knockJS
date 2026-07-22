import { ThreeCanvasAnswer } from '../base'
import config from '../images'
import { context2d, drawImage, fitToImage, loadImage } from '@/lib/canvas'
/**
 * Q.60
 * アルファブレンド
 *
 * 2 枚目の画像（thorino）は入力セレクタとは独立に固定で読み込む。
 * @extends ThreeCanvasAnswer
 */
export default class extends ThreeCanvasAnswer {
  /** ブレンド相手の画像。mount 完了後にセットされる。 */
  private overlayImage: HTMLImageElement | null = null

  override async mount(canvases: HTMLCanvasElement[], image: HTMLImageElement) {
    const [src, overlay, dst] = canvases
    fitToImage(image, src, overlay, dst)
    drawImage(src, image)

    const overlayImage = await loadImage(config.srcImage.thorino)
    this.overlayImage = overlayImage
    overlay.width = image.width
    overlay.height = image.height
    context2d(overlay).drawImage(overlayImage, 0, 0, image.width, image.height)
  }

  main(_overlay: HTMLCanvasElement, canvas: HTMLCanvasElement, image1: HTMLImageElement) {
    const image2 = this.overlayImage
    if (!image2) {
      this.showMessage('ブレンド用の画像がまだ読み込まれていません。')
      return
    }
    const ctx = context2d(canvas)
    const width = image1.width
    const height = image1.height
    canvas.width = width
    canvas.height = height
    ctx.drawImage(image1, 0, 0, width, height)
    const src1 = ctx.getImageData(0, 0, width, height)

    ctx.drawImage(image2, 0, 0, width, height)
    const src2 = ctx.getImageData(0, 0, width, height)

    const dst = ctx.createImageData(canvas.width, canvas.height)

    for (let i = 0; i < dst.data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        dst.data[i + j] = src1.data[i + j] / 2 + src2.data[i + j] / 2
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
