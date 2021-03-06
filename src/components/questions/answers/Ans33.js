import {BaseThreeCanvasComponent} from "./BaseComponents.js"
/**
 * Q.33
 * フーリエ変換 ローパスフィルタ
 * @extends BaseThreeCanvasComponent
 */
export default class extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {Object} canvas 
   * @param {Object} image 
   */
  main(canvas1, canvas2, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src = [] //グレースケール成分を格納する
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    let dst2 = ctx1.createImageData(canvas1.width, canvas1.height)

    for (let i = 0; i < src1.data.length; i += 4) {
      let color = ~~grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let [Re, Im] = this.dft2d(src, canvas1.width, canvas1.height)

    //todo:
    this.lpf(Re, Im, canvas1.width, canvas1.height, canvas1.width / 2 * 0.5)

    let arr = this.idft2d(Re, Im, canvas1.width, canvas1.height)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = ~~arr[j]
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Array} src 
   * @param {Number} imgWidth canvas width 
   * @param {Number} imgHeight canvas height
   */
  dft2d(src, imgWidth, imgHeight) {
    const W = imgWidth
    const H = imgHeight
    const wx0 = 2 * Math.PI / W
    const wy0 = 2 * Math.PI / H
    let Re = new Array(src.length)
    let Im = new Array(src.length)
    for (let v = 0; v < H; v++) for (let u = 0; u < W; u++) {
      let uvIdx = W * v + u;
      Re[uvIdx] = 0;
      Im[uvIdx] = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        let xyIdx = W * y + x;
        Re[uvIdx] += src[xyIdx] * Math.cos(- wx0 * x * u - wy0 * y * v)
        Im[uvIdx] += src[xyIdx] * Math.sin(- wx0 * x * u - wy0 * y * v)
      }
      Re[uvIdx] /= W * H;
      Im[uvIdx] /= W * H;
    }
    return [Re, Im]
  }
  /**
   * 2次元離散逆フーリエ変換
   * @param {Array} Re 
   * @param {Array} Im 
   * @param {Number} imgWidth canvas width
   * @param {Number} imgHeight canvas height
   */
  idft2d(Re, Im, imgWidth, imgHeight) {
    const W = imgWidth
    const H = imgHeight
    const wx0 = 2 * Math.PI / W;
    const wy0 = 2 * Math.PI / H;
    let dst = new Array(W * H)
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let xyIdx = W * y + x;
      dst[xyIdx] = 0;
      for (let v = 0; v < H; v++) for (let u = 0; u < W; u++) {
        dst[xyIdx] += Re[W * v + u] * Math.cos(wx0 * x * u + wy0 * y * v) - Im[W * v + u] * Math.sin(wx0 * x * u + wy0 * y * v);
      }
    }
    return dst
  }
  /**
   * ローパスフィルタ
   * @param {Array} Re 
   * @param {Array} Im 
   * @param {Number} imgWidth image width 
   * @param {Number} imgHeight image height
   */
  lpf(Re, Im, imgWidth, imgHeight, r) {
    let cx = imgWidth / 2
    let cy = imgHeight / 2
    for (let y = 0; y < imgHeight; y++) for (let x = 0; x < imgWidth; x++) {
      let idx = y * imgWidth + x
      // let d = Math.sqrt(Math.pow(cx - x , 2) + Math.pow(cy - y , 2))
      // if (d > r) {
      //   Re[idx] = 0
      //   Im[idx] = 0
      // }
      if (Math.abs(cx - x) < r || Math.abs(cy - y) < r) {
        Re[idx] = 0
        Im[idx] = 0
      }
    }
  }
}