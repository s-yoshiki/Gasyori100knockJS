import { OneCanvasAnswer } from '../base'
import { context2d } from '@/lib/canvas'
import config from '../images'
/**
 * Q.87
 * 簡単な画像認識 (Step.4) k-NN
 * @extends OneCanvasAnswer
 */
export default class extends OneCanvasAnswer {
  /**
   * メイン
   */
  main(canvas: HTMLCanvasElement) {
    // パス名が正解ラベルとなっている
    const basename = (arg: string) => arg.split('/').reverse()[0]
    const getLabel = (arg: string) => basename(arg).split('_')[1]
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
    // 終了処理
    const finalize = () => {
      let detail = ''
      for (let i = 0; i < tests.length; i++) {
        detail += `<img src='${tests[i]}'> `
      }
      detail += `\n${tests.map((e) => basename(e)).join(' ')}\n`

      for (let i = 0; i < trains.length; i++) {
        detail += ` <img src='${trains[i]}'> `
      }
      detail += `\n${trains.map((e) => basename(e)).join(' ')}\n`
      this.showMessage(detail)
      canvas.style.width = canvas.style.height = '0'
    }
    // ラベルの多数決。最も多く現れたラベルを返す。
    const selectLabel = (labels: string[]): string => {
      const counts = new Map<string, number>()
      for (const label of labels) {
        counts.set(label, (counts.get(label) ?? 0) + 1)
      }
      let selected = ''
      let selectedCount = 0
      for (const [label, count] of counts) {
        if (count > selectedCount) {
          selectedCount = count
          selected = label
        }
      }
      return selected
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
      // knn 距離
      const K = 2
      // メイン処理
      let successCount = 0
      for (let i = 0; i < testsData.length; i++) {
        const test = testsData[i]
        const result = []
        for (let j = 0; j < trainsData.length; j++) {
          const train = trainsData[j]
          const t1 = diff(test, train)
          const t2 = sum(t1)
          result.push(t2)
        }
        //小さい順にソート
        const idxs: number[] = []
        const t = result.slice().sort((a, b) => a - b)[K]
        result.forEach((e, i) => {
          if (e <= t) {
            idxs.push(i)
          }
        })
        const resultLabel = selectLabel(idxs.slice().map((e) => getLabel(trains[e])))
        this.showMessage(
          `<img src='${tests[i]}'> <= ${idxs
            .slice()
            .map((e) => `<img src='${trains[e]}' >`)
            .join('')}\n` +
            `${basename(tests[i])} is similar >> ` +
            `${idxs
              .slice()
              .map((e) => basename(trains[e]))
              .join(', ')}` +
            ` |Pred >> ${resultLabel}`,
        )
        if (getLabel(tests[i]) === resultLabel) {
          successCount++
        }
      }
      this.showMessage(
        `Accuracy >> ${successCount / testsData.length} (${successCount} / ${testsData.length})`,
      )
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
