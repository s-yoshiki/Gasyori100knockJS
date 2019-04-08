import {BaseThreeCanvasComponent} from "./BaseComponents.js"
/**
 * Q.35
 * フーリエ変換 バンドパスフィルタ
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
    let r = canvas1.width / 2
    this.bpf(Re, Im, canvas1.width, canvas1.height, r * 0.1, r * 0.9)

    let arr = this.idft2d(Re, Im, canvas1.width, canvas1.height)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = ~~Math.abs(arr[j])
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
   * バンドパスフィルタ
   * @param {Array} Re 
   * @param {Array} Im 
   * @param {Number} imgWidth image width 
   * @param {Number} imgHeight image height
   */
  bpf(Re, Im, imgWidth, imgHeight, rMin, rMax) {
    let cx = imgWidth / 2
    let cy = imgHeight / 2
    for (let y = 0; y < imgHeight; y++) for (let x = 0; x < imgWidth; x++) {
      let idx = y * imgWidth + x
      // let d = Math.sqrt(Math.pow(cx - x , 2) + Math.pow(cy - y , 2))
      let condition1 = Math.abs(cx - x) > rMin || Math.abs(cy - y) > rMin
      let condition2 = Math.abs(cx - x) < rMax && Math.abs(cy - y) < rMax
      if (!(condition1 && condition2)) {
        Re[idx] = 0
        Im[idx] = 0
      }
    }
  }
}