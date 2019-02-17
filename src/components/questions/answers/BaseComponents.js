import config from '../configure.js'
import { ThreeCanvasTemplate, DefaultTemplate } from "../templates.js"
import CanvasUtility from '@/lib/CanvasTools'

//  BaseTwoCanvasComponent

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
  _initObject(self){}

  /**
   * 子クラスでのオブジェクト操作
   * 
   * @param {Document} self 
   */
  init(self) {
    return;
  }

  /**
   * init内で呼ぶ
   */
  main() {
    return;
  }

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
 * 2canvas用Component
 */
export class BaseTwoCanvasComponent extends BasePagesComponent {

  constructor() {
    super()
    super.setTemplate(DefaultTemplate)
    this.setSrcImage(config.srcImage.default)
  }

  /**
   * 子クラスでのオブジェクト操作
   * 
   * @param {Document} self 
   */
  init(self) {}

  /**
   * DOMの初期処理
   * 
   * @param {Document} self 
   */
  _initObject(self) {
    let canvasAsset = self.$refs["canvas-view-only"]
    let canvas = self.$refs["canvas"]
    let button = self.$refs["button-run"]

    let image = new Image()
    image.src = this.imageUrl

    image.addEventListener("load", () => {
      canvas.width = image.width
      canvas.height = image.height
    })

    CanvasUtility.drawImage(canvasAsset, image)
  
    button.addEventListener("click", () => {
      this.main(canvas, image)
    })
  }

  /**
   * 画像を処理してcanvasに描画
   * 
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {}

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
 * 3canvas用Component
 */
export class BaseThreeCanvasComponent extends BasePagesComponent {

  constructor() {
    super()
    super.setTemplate(ThreeCanvasTemplate)
    // this.setSrcImage(config.srcImage.default)
  }

  init(self) {
    this.setSrcImage(config.srcImage.default)
  }

  /**
   * DOMの初期処理
   * 
   * @param {Document} self 
   */
  _initObject(self) {
    let canvasAsset = self.$refs["canvas-view-only"]
    let canvas1 = self.$refs["canvas1"]
    let canvas2 = self.$refs["canvas2"]
    let button = self.$refs["button-run"]

    let image = new Image()
    image.src = this.imageUrl

    image.addEventListener("load", () => {
      canvas1.width  = canvas2.width = image.width
      canvas1.height = canvas2.height = image.height
    })

    CanvasUtility.drawImage(canvasAsset, image)
  
    button.addEventListener("click", () => {
      this.main(canvas1, canvas2, image)
    })
  }

  /**
   * 画像を処理してcanvasに描画
   * 
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, image) {}

  /**
   * src画像のセット
   * 
   * @param {String} url 
   */
  setSrcImage(url) {
    super.imageUrl = url
  }
}