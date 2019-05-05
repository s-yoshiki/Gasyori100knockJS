import { OneCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.87
 * 簡単な画像認識 (Step.4) k-NN
 * @extends OneCanvasComponent
 */
export default class extends OneCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   */
  main(canvas) {
    // パス名が正解ラベルとなっている
    const basename = (arg) => arg.split("/").reverse()[0]
    const getLabel = (arg) => basename(arg).split("_")[1]
    const diff = (a, b) => {
      let result = []
      for (let i = 0; i < a.length; i++) {
        result.push(Math.abs(a[i] - b[i]))
      }
      return result
    }
    const sum = (arr) => {
      let s = 0
      arr.forEach(e => {
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
      detail += `\n${tests.map(e => basename(e)).join(' ')}\n`

      for (let i = 0; i < trains.length; i++) {
        detail += ` <img src='${trains[i]}'> `
      }
      detail += `\n${trains.map(e => basename(e)).join(' ')}\n`
      this.showMessage(detail)
      canvas.style.width = canvas.style.height = 0
    }
    // ラベルの多数決
    const selectLabel = (arr) => {
      let tmp = {}
      arr.forEach(e => {
        if (!(tmp[e] >= 0)) {
          tmp[e] = 1
        } else {
          tmp[e] += 1
        }
      })
      let maxI = 0
      let maxV = 0
      for (let i in tmp) {
        if (maxV < tmp[i]) {
          maxV = tmp[i]
          maxI = i
        }
      }
      return maxI
    }
    const trains = config.dataset.train.sort()
    const tests = config.dataset.tests.sort()
    let imagesCount = trains.length + tests.length
    const trainsData = new Array(trains.lengt)
    const testsData = new Array(tests.lengt)
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
        let test = testsData[i]
        let result = []
        for (let j = 0; j < trainsData.length; j++) {
          let train = trainsData[j]
          let t1 = diff(test, train)
          let t2 = sum(t1)
          result.push(t2)
        }
        //小さい順にソート
        let idxs = []
        let t = result.slice().sort((a, b) => a - b)[K]
        result.forEach((e, i) => {
          if (e <= t) {
            idxs.push(i)
          }
        })
        let resultLabel = selectLabel(idxs.slice().map(e => getLabel(trains[e])))
        this.showMessage(
          `<img src='${tests[i]}'> <= ${idxs.slice().map(e => `<img src='${trains[e]}' >`).join('')}\n` +
          `${basename(tests[i])} is similar >> ` +
          `${idxs.slice().map(e => basename(trains[e])).join(', ')}` +
          ` |Pred >> ${resultLabel}`
        )
        if (getLabel(tests[i]) === resultLabel) {
          successCount++
        }
      }
      this.showMessage(
        `Accuracy >> ${successCount / testsData.length} (${successCount} / ${testsData.length})`
      )
      finalize()
    }
    for (let i = 0; i < trains.length; i++) {
      let image = new Image()
      image.src = trains[i]
      image.addEventListener('load', () => {
        let hist = this.getHistogram(canvas, image)
        trainsData[i] = hist
        event()
      })
    }
    for (let i = 0; i < tests.length; i++) {
      let image = new Image()
      image.src = tests[i]
      image.addEventListener('load', () => {
        let hist = this.getHistogram(canvas, image)
        testsData[i] = hist
        event()
      })
    }
  }
  /**
   * ヒストグラム算出
   * @param {Object} canvas 
   * @param {Object} image 
   */
  getHistogram(canvas, image) {
    const decreaseColor = (c) => {
      c = parseInt(Math.floor(c / 255 * 3), 10) 
      return c
    }
    const ctx1 = canvas.getContext("2d")
    let W,H
    W = canvas.width = image.width
    H = canvas.height = image.height
    ctx1.drawImage(image, 0, 0, W, H)
    let src = ctx1.getImageData(0, 0, W, H)
    let dst1 = ctx1.createImageData(W, H)
    let result = new Array(12).fill(0)
    for (let i = 0; i < dst1.data.length; i += 4) for (let j = 0; j < 3; j++) {
      let _i = i + j
      let c = decreaseColor(src.data[_i])
      result[j * 4 + c]++
    }
    return result
  }
}