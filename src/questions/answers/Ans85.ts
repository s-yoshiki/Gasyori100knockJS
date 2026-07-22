import { OneCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
import config from '../images'
/**
 * Q.85
 * 簡単な画像認識 (Step.2) クラス判別
 * @extends OneCanvasAnswer
 */
export default class extends OneCanvasAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement) {
    const basename = (arg: string) => arg.split('/').reverse()[0]
    const diff = (a: number[], b: number[]) => {
      const result = []
      for (let i = 0; i < a.length; i++) {
        result.push(Math.abs(a[i] - b[i]))
      }
      return result
    }
    const sum = (arr: number[]) => {
      let s = 0
      arr.forEach((e: number) => {
        s += e
      })
      return s
    }
    const finalize = () => {
      // 終了処理
      let detail = ''
      for (let i = 0; i < tests.length; i++) {
        detail += ` <img src='${tests[i]}'> `
      }
      detail += `\n${tests.map((e) => basename(e)).join(' ')}\n`

      for (let i = 0; i < trains.length; i++) {
        detail += ` <img src='${trains[i]}'> `
      }
      detail += `\n${trains.map((e) => basename(e)).join(' ')}\n`
      this.showMessage(detail)
      canvas.style.width = canvas.style.height = '0'
    }
    const trains = config.dataset.train.sort()
    const tests = config.dataset.tests.sort()
    let imagesCount = trains.length + tests.length
    const trainsData = new Array(trains.length)
    const testsData = new Array(tests.length)
    const event = () => {
      imagesCount--
      if (imagesCount > 0) {
        return
      }
      // メイン処理
      for (let i = 0; i < testsData.length; i++) {
        const test = testsData[i]
        let min = Number.MAX_VALUE
        let idx = 0
        for (let j = 0; j < trainsData.length; j++) {
          const train = trainsData[j]
          const t1 = diff(test, train)
          const t2 = sum(t1)
          // console.log([i,j,t2])
          if (t2 < min) {
            min = t2
            idx = j
          }
        }
        this.showMessage(`
        <img src='${tests[i]}'> <img src='${trains[idx]}'>
        ${basename(tests[i])} is similar >> ${basename(trains[idx])}  Pred >> ${basename(trains[idx]).split('_')[1]}
        `)
      }
      finalize()
    }
    for (let i = 0; i < trains.length; i++) {
      const image = new Image()
      image.src = trains[i]
      image.addEventListener('load', () => {
        const hist = this.getHistogram(canvas, image)
        trainsData[i] = hist
        event()
      })
    }
    for (let i = 0; i < tests.length; i++) {
      const image = new Image()
      image.src = tests[i]
      image.addEventListener('load', () => {
        const hist = this.getHistogram(canvas, image)
        testsData[i] = hist
        event()
      })
    }
  }
  /**
   * ヒストグラム算出
   */
  getHistogram(canvas: HTMLCanvasElement, image: HTMLImageElement) {
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
}
