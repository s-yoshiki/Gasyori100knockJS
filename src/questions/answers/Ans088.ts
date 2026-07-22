import { context2d } from '@/lib/canvas'
import { createOneCanvasAnswer } from '../base'
import config from '../images'

export default createOneCanvasAnswer(({ showMessage }) => {
  const main = (canvas: HTMLCanvasElement) => {
    // パス名が正解ラベルとなっている
    const add = (a: number[], b: number[]) => {
      const result = new Array(a.length).fill(0)
      for (let i = 0; i < a.length; i++) {
        result[i] = a[i] + b[i]
      }
      return result
    }
    // 任意の乱数
    const getRandInt = (min: number, max: number) => {
      const random = Math.floor(Math.random() * (max + 1 - min)) + min
      return random
    }
    const tests = config.dataset.tests.sort()
    let imagesCount = tests.length
    const testsData = new Array(tests.length)
    const event = () => {
      imagesCount--
      if (imagesCount > 0) {
        return
      }
      const classN = 2
      const classLength = new Array(classN).fill(0)
      const features = new Array(testsData.length).fill(0)
      const gravity = Array.from(new Array(classN), () => new Array(testsData[0].length).fill(0))
      for (let i = 0; i < testsData.length; i++) {
        const n = getRandInt(0, classN - 1)
        features[i] = n
        classLength[n]++
      }
      for (let i = 0; i < testsData.length; i++) {
        const idx = features[i]
        gravity[idx] = add(gravity[idx], testsData[i])
      }
      for (let i = 0; i < gravity.length; i++) {
        gravity[i] = gravity[i].map((e) => e / classLength[i])
      }
      showMessage(`label: ${JSON.stringify(features)}`)
      showMessage(`gravity: ${JSON.stringify(gravity, null, '\t')}`)
    }
    for (let i = 0; i < tests.length; i++) {
      const image = new Image()
      image.src = tests[i]
      image.addEventListener('load', () => {
        const hist = getHistogram(canvas, image)
        testsData[i] = hist
        event()
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
