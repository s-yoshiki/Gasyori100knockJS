import { context2d } from '@/lib/canvas'
import type { Pixels } from '@/lib/pixels'
import { createThreeCanvasAnswer } from '../base'
import config from '../images'

export default createThreeCanvasAnswer(() => {
  const main = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const ctx1 = context2d(canvas1)
    const ctx2 = context2d(canvas2)
    ctx2.drawImage(image, 0, 0, image.width, image.height)
    const template = new Image()
    template.src = config.srcImage.imori_part
    template.onload = () => {
      canvas1.width = template.width
      canvas1.height = template.height
      ctx1.drawImage(template, 0, 0, template.width, template.height)
      const src1 = ctx1.getImageData(0, 0, template.width, template.height)
      const src2 = ctx2.getImageData(0, 0, image.width, image.height)
      const [x, y] = templateMatchingSSD(
        src2.data,
        image.width,
        image.height,
        src1.data,
        template.width,
        template.height,
      )
      ctx2.strokeStyle = 'rgb(230, 10, 10)'
      ctx2.rect(x, y, template.width, template.height)
      ctx2.stroke()
    }
  }

  const templateMatchingSSD = (
    src: Pixels,
    W: number,
    H: number,
    template: Pixels,
    tW: number,
    tH: number,
  ) => {
    const getTplIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), tW - 1)
      y = Math.min(Math.max(y, 0), tH - 1)
      return y * tW * 4 + x * 4 + channel
    }
    const getSrcIndex = (x: number, y: number, channel: number) => {
      x = Math.min(Math.max(x, 0), W - 1)
      y = Math.min(Math.max(y, 0), H - 1)
      return y * W * 4 + x * 4 + channel
    }
    let resultX = 0
    let resultY = 0
    let v = 255 * W * H * 3
    for (let y = 0; y < H - tH; y++)
      for (let x = 0; x < W - tW; x++) {
        let sum = 0
        for (let j = 0; j < tH; j++)
          for (let i = 0; i < tW; i++) {
            for (let c = 0; c < 3; c++) {
              const idx1 = getSrcIndex(x + i, y + j, c)
              const idx2 = getTplIndex(i, j, c)
              sum += (src[idx1] - template[idx2]) ** 2
            }
          }
        if (sum < v) {
          v = sum
          resultX = x
          resultY = y
        }
      }
    return [resultX, resultY]
  }

  return { main }
})
