import { context2d } from '@/lib/canvas'
import { renderHistogram } from '@/lib/histogram'
import { createOneCanvasAnswer } from '../base'
import config from '../images'

export default createOneCanvasAnswer(({ showMessage }) => {
  const main = (canvas: HTMLCanvasElement) => {
    const basename = (arg: string) => arg.split('/').reverse()[0]
    const trains = config.dataset.train.sort()
    for (let i = 0; i < trains.length; i++) {
      const image = new Image()
      image.src = trains[i]
      image.addEventListener('load', () => {
        const hist = getHistogram(canvas, image)
        canvas.height = 200
        renderHistogram(canvas, hist)
        const url = canvas.toDataURL()
        showMessage(`
          <strong>${basename(trains[i])}</strong>
          <img src='${url}' style='height:200px;width:450px;'><img src='${trains[i]}'>
        `)
        canvas.style.width = canvas.style.height = '0'
      })
    }
  }

  const getHistogram = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
    const decreaseColor = (c: number) => {
      c = Math.floor((c / 255) * 3)
      return c
    }
    const ctx1 = context2d(canvas)
    const W = (canvas.width = image.width)
    const H = (canvas.height = image.height)
    ctx1.drawImage(image, 0, 0, W, H)
    const src = ctx1.getImageData(0, 0, W, H)
    const dst1 = ctx1.createImageData(W, H)
    const result = new Array(12).fill(0)
    for (let i = 0; i < dst1.data.length; i += 4)
      for (let j = 0; j < 3; j++) {
        const _i = i + j
        const c = decreaseColor(src.data[_i])
        result[j * 4 + c]++
      }
    return result
  }

  return { main }
})
