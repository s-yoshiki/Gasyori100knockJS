import config from '../configure.js'
import { ThreeCanvasTemplate, DefaultTemplate, HistogramTemplate } from "../templates.js"
import CanvasUtility from '@/lib/CanvasTools'


/**
 * ページ処理基底
 */
export default class BasePagesComponent {
  /**
   * コンストラクタ
   */
  constructor() {
    return;
  }
  /**
   * Vueでマウントされたdomを受け取る
   * mainの初期処理
   * 
   * @param {Document} self 
   */
  _initObject() { }
  /**
   * 子クラスでのオブジェクト操作
   * 
   * @param {Document} self 
   */
  init() { }
  /**
   * init内で呼ぶ
   */
  main() { }
  /**
   * テンプレートをセット
   * @param {String} template 
   */
  setTemplate(template) {
    this.template = template
  }
  /**
   * テンプレートをゲット
   * @return {String} template
   */
  getTemplate() {
    return this.template
  }
}

/**
 * 2canvas用オブジェクト
 */
export class BaseTwoCanvasComponent extends BasePagesComponent {

  constructor() {
    super()
    super.setTemplate(DefaultTemplate)
    this.setSrcImage(config.srcImage.default)
  }

  /**
   * 子クラスでのオブジェクト操作
   * @param {Document} self 
   */
  init() {
    return;
  }

  /**
   * DOMの初期処理
   * @access private
   * @param {Document} self 
   */
  _initObject(self) {
    let canvas1 = self.$refs["canvas1"]
    let canvas2 = self.$refs["canvas2"]
    let button = self.$refs["button-run"]

    let image = new Image()
    image.src = this.imageUrl

    image.addEventListener("load", () => {
      canvas2.width = image.width
      canvas2.height = image.height
    })

    CanvasUtility.drawImage(canvas1, image)

    button.addEventListener("click", () => {
      this.main(canvas2, image)
    })
  }

  /**
   * 画像を処理してcanvasに描画
   * 
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main() { }

  /**
   * src画像のセット
   * 
   * @param {String} url 
   */
  setSrcImage(url) {
    super.imageUrl = url
  }
}

/**
 * 3canvas用オブジェクト
 */
export class BaseThreeCanvasComponent extends BasePagesComponent {

  constructor() {
    super()
    super.setTemplate(ThreeCanvasTemplate)
  }

  /**
   * 継承先で行う初期処理
   */
  init() {
    this.setSrcImage(config.srcImage.default)
  }

  /**
   * DOMの初期処理
   * 
   * @access private
   * @param {Document} self 
   */
  _initObject(self) {
    let canvas1 = self.$refs["canvas1"]
    let canvas2 = self.$refs["canvas2"]
    let canvas3 = self.$refs["canvas3"]
    let button = self.$refs["button-run"]

    let image = new Image()
    image.src = this.imageUrl

    image.addEventListener("load", () => {
      canvas3.width = canvas2.width = image.width
      canvas3.height = canvas2.height = image.height
    })

    CanvasUtility.drawImage(canvas1, image)

    button.addEventListener("click", () => {
      this.main(canvas2, canvas3, image)
    })
  }

  /**
   * 画像を処理してcanvasに描画
   */
  main() { }

  /**
   * src画像のセット
   * 
   * @param {String} url 
   */
  setSrcImage(url) {
    super.imageUrl = url
  }
}

/**
 * ヒストグラム表示オブジェクト
 */
export class HistogramComponent extends BaseTwoCanvasComponent {
  /**
   * 継承先で行う初期処理
   */
  init() {
    this.setSrcImage(config.srcImage.dark)
  }

  /**
   * DOMの初期処理
   * 
   * @access private
   * @param {Document} self 
   */
  _initObject(self) {
    let canvasSrc = self.$refs["canvas1"]
    this.graph = self.$refs["canvas2"]
    let button = self.$refs["button-run"]

    // ダミーデータを表示
    this.renderChart(new Array(255).fill(0))

    let image = new Image()
    image.src = this.imageUrl

    image.addEventListener("load", () => {
      canvasSrc.width = image.width
      canvasSrc.height = image.height
    })

    CanvasUtility.drawImage(canvasSrc, image)

    button.addEventListener("click", () => {
      this.main(canvasSrc, image)
    })
  }

  /**
   * ヒストグラム表示
   * 
   * @param {Array} data
   */
  renderChart(data) {
    CanvasUtility.renderHistogram(this.graph, data)
  }
}

/**
 * 
 */
export class ThreeCanvasHistogramComponent extends HistogramComponent {
  /**
   * コンストラクタ
   */
  constructor() {
    super()
    super.setTemplate(ThreeCanvasTemplate)
  }
  /**
   * DOMの初期処理
   * 
   * @access private
   * @param {Document} self 
   */
  _initObject(self) {
    let canvas1 = self.$refs["canvas1"]
    let canvas2 = self.$refs["canvas2"]
    this.graph = self.$refs["canvas3"]
    let button = self.$refs["button-run"]

    // ダミーデータを表示
    this.renderChart(new Array(255).fill(0))

    let image = new Image()
    image.src = this.imageUrl

    image.addEventListener("load", () => {
      canvas1.width = canvas2.width = image.width
      canvas1.height = canvas2.height = image.height
    })

    CanvasUtility.drawImage(canvas1, image)

    button.addEventListener("click", () => {
      this.main(canvas2, image)
    })
  }
}