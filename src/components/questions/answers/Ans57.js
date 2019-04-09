import { BaseThreeCanvasComponent } from "./BaseComponents.js"
import config from "../configure"
/**
 * Q.57
 * テンプレートマッチング ZNCC
 * @extends BaseThreeCanvasComponent
 */
export default class extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, canvas2, image) {
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    ctx2.drawImage(image, 0, 0, image.width, image.height)
    let template = new Image()
    template.src = config.srcImage.imori_part
    const onloadFunction = () => {
      canvas1.width = template.width
      canvas1.height = template.height
      ctx1.drawImage(template, 0, 0, template.width, template.height)
      let src1 = ctx1.getImageData(0, 0, template.width, template.height)
      let src2 = ctx2.getImageData(0, 0, image.width, image.height)
      let [x, y] = this.templateMatchingZNCC(src2.data, image.width, image.height, src1.data, template.width, template.height)
      ctx2.strokeStyle = "rgb(230, 10, 10)";
      ctx2.rect(x, y, template.width, template.height)
      ctx2.stroke()
    }
    template.addEventListener("load", onloadFunction, true)
  }
  /**
   * template matching (ZNCC)
   * @param {Array} src src image
   * @param {Number} W src image width
   * @param {Number} H src image height
   * @param {Array} template template image
   * @param {Number} tW template image width
   * @param {NUmber} tH template image height
   * @return {Array} pos 
   */
  templateMatchingZNCC(src, W, H, template, tW, tH) {
    const getTplIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), tW - 1)
      y = Math.min(Math.max(y, 0), tH - 1)
      return y * tW * 4 + x * 4 + channel
    }
    const getSrcIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), W - 1)
      y = Math.min(Math.max(y, 0), H - 1)
      return y * W * 4 + x * 4 + channel
    }
    let resultX = 0
    let resultY = 0
    let v = 0
    for (let y = 0; y < H - tH; y++) for (let x = 0; x < W - tW; x++) {
      let sum = 0
      let A = 0
      let B = 0
      let C = 0
      for (let j = 0; j < tH; j++) for (let i = 0; i < tW; i++) {
        for (let c = 0; c < 3; c++) {
          let idx1 = getSrcIndex(x + i, y + j, c)
          let idx2 = getTplIndex(i, j, c)
          // sum += Math.abs(src[idx1] - template[idx2]) //todo:
          A += (src[idx1] * template[idx2])
          B += (src[idx1]) ** 2
          C += (template[idx2]) ** 2
        }
      }
      sum = A / Math.sqrt(B) * Math.sqrt(C)
      if (sum > v) {
        v = sum
        resultX = x
        resultY = y
      }
    }
    return [resultX, resultY]
  }
}