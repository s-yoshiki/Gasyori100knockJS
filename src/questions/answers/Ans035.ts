import { context2d } from '@/lib/canvas'
import { createThreeCanvasAnswer } from '../base'

export default createThreeCanvasAnswer(() => {
  const main = (
    canvas1: HTMLCanvasElement,
    canvas2: HTMLCanvasElement,
    image: HTMLImageElement,
  ) => {
    const grayscale = (r: number, g: number, b: number) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    const ctx1 = context2d(canvas1)
    const ctx2 = context2d(canvas2)
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    const src = [] //グレースケール成分を格納する
    const src1 = ctx1.getImageData(0, 0, image.width, image.height)
    const dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    const dst2 = ctx1.createImageData(canvas1.width, canvas1.height)

    for (let i = 0; i < src1.data.length; i += 4) {
      const color = ~~grayscale(src1.data[i], src1.data[i + 1], src1.data[i + 2])
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    const [Re, Im] = dft2d(src, canvas1.width, canvas1.height)

    //todo:
    const r = canvas1.width / 2
    bpf(Re, Im, canvas1.width, canvas1.height, r * 0.1, r * 0.9)

    const arr = idft2d(Re, Im, canvas1.width, canvas1.height)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = ~~Math.abs(arr[j])
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)
  }

  const dft2d = (src: number[], imgWidth: number, imgHeight: number) => {
    const W = imgWidth
    const H = imgHeight
    const wx0 = (2 * Math.PI) / W
    const wy0 = (2 * Math.PI) / H
    const Re = new Array(src.length)
    const Im = new Array(src.length)
    for (let v = 0; v < H; v++)
      for (let u = 0; u < W; u++) {
        const uvIdx = W * v + u
        Re[uvIdx] = 0
        Im[uvIdx] = 0
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) {
            const xyIdx = W * y + x
            Re[uvIdx] += src[xyIdx] * Math.cos(-wx0 * x * u - wy0 * y * v)
            Im[uvIdx] += src[xyIdx] * Math.sin(-wx0 * x * u - wy0 * y * v)
          }
        Re[uvIdx] /= W * H
        Im[uvIdx] /= W * H
      }
    return [Re, Im]
  }

  const idft2d = (Re: number[], Im: number[], imgWidth: number, imgHeight: number) => {
    const W = imgWidth
    const H = imgHeight
    const wx0 = (2 * Math.PI) / W
    const wy0 = (2 * Math.PI) / H
    const dst = new Array(W * H)
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const xyIdx = W * y + x
        dst[xyIdx] = 0
        for (let v = 0; v < H; v++)
          for (let u = 0; u < W; u++) {
            dst[xyIdx] +=
              Re[W * v + u] * Math.cos(wx0 * x * u + wy0 * y * v) -
              Im[W * v + u] * Math.sin(wx0 * x * u + wy0 * y * v)
          }
      }
    return dst
  }

  const bpf = (
    Re: number[],
    Im: number[],
    imgWidth: number,
    imgHeight: number,
    rMin: number,
    rMax: number,
  ) => {
    const cx = imgWidth / 2
    const cy = imgHeight / 2
    for (let y = 0; y < imgHeight; y++)
      for (let x = 0; x < imgWidth; x++) {
        const idx = y * imgWidth + x
        // let d = Math.sqrt(Math.pow(cx - x , 2) + Math.pow(cy - y , 2))
        const condition1 = Math.abs(cx - x) > rMin || Math.abs(cy - y) > rMin
        const condition2 = Math.abs(cx - x) < rMax && Math.abs(cy - y) < rMax
        if (!(condition1 && condition2)) {
          Re[idx] = 0
          Im[idx] = 0
        }
      }
  }

  return { main }
})
