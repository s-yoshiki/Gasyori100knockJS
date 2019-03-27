import {BaseThreeCanvasComponent} from "./BaseComponents.js"
import CanvasUtility from '@/lib/CanvasTools'
import config from "../configure.js"

/**
 * Q.60
 * アルファブレンド
 * @extends BaseThreeCanvasComponent
 */
export default class Ans60 extends BaseThreeCanvasComponent {
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

    let imori = new Image()
    imori.src = config.srcImage.default

    let thorino = new Image()
    thorino.src = config.srcImage.thorino

    imori.addEventListener("load", () => {
      canvas1.width = canvas3.width = imori.width
      canvas1.height = canvas3.height = imori.height
    })

    thorino.addEventListener("load", () => {
      canvas2.width = imori.width
      canvas2.height = imori.height
      canvas2.getContext("2d").drawImage(thorino, 0, 0, imori.width, imori.height)
    })

    CanvasUtility.drawImage(canvas1, imori)

    button.addEventListener("click", () => {
      this.main(canvas3, imori, thorino)
    })
  }
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image1, image2) {
    let ctx = canvas.getContext("2d");
    let width = image1.width
    let height = image1.height
    canvas.width = width
    canvas.height = height
    ctx.drawImage(image1, 0, 0, width, height)
    let src1 = ctx.getImageData(0, 0, width, height)

    ctx.drawImage(image2, 0, 0, width, height)
    let src2 = ctx.getImageData(0, 0, width, height)

    let dst = ctx.createImageData(canvas.width, canvas.height)

    for (let i = 0; i < dst.data.length; i += 4) {
      for (var j = 0; j < 3; j++) {
        dst.data[i + j] = src1.data[i + j] / 2 + src2.data[i + j] / 2
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}