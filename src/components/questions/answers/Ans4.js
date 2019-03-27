import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, ThreeCanvasHistogramComponent, BaseFourCanvasComponent
} from "./BaseComponents.js"
// import config from "../configure.js"
import math from "mathjs"

export default null

/**
 * Q.31
 * アフィン変換(スキュー)
 * @BaseTwoCanvasComponent
 */
export class Ans31 extends BaseFourCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, canvas3, image) {
    let dx = 30
    let a = dx / image.height
    let tx = 0
    let ty = 0
    const H1 = [
      [1, a, tx],
      [0, 1, ty],
      [0, 0, 1],
    ]
    const H2 = [
      [1, 0, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    const H3 = [
      [1, a, tx],
      [a, 1, ty],
      [0, 0, 1],
    ]
    this.trans(canvas1, image, H1)
    this.trans(canvas2, image, H2)
    this.trans(canvas3, image, H3)
  }
  /**
   * Homography Translation
   * @param {canvas} canvas 
   * @param {Image} image 
   * @param {Array} H 3x3 - Homography
   */
  trans(canvas, image, H) {
    const getDstIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const getSrcIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), image.width - 1)
      y = Math.min(Math.max(y, 0), image.height - 1)
      return y * image.width * 4 + x * 4 + channel
    }

    const calcHomography = (Hx, x, y) => {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < Hx.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * Hx[i][j]
        }
        a[i] = ~~tmp
      }
      return a
    }

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)

    let [width, height] = calcHomography(H, image.width, image.height).map(e => ~~e)
    canvas.width = width
    canvas.height = height

    let dst = ctx.createImageData(canvas.width, canvas.height)

    let _H = math.inv(H)

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      let p = [x, y, 1]
      let a = [0, 0, 0]
      for (let i = 0; i < _H.length; i++) {
        let tmp = 0
        for (let j = 0; j < p.length; j++) {
          tmp += p[j] * _H[i][j]
        }
        a[i] = ~~tmp
      }
      for (let c = 0; c < 3; c++) {
        if ((0 < a[0] && a[0] < image.width) && (0 < a[1] && a[1] < image.height)) {
          dst.data[getDstIndex(x, y, c)] = src.data[getSrcIndex(a[0], a[1], c)]
        }
      }
      dst.data[getDstIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.32
 * フーリエ変換
 * @BaseFourCanvasComponent
 */
export class Ans32 extends BaseFourCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas1, canvas2, canvas3, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx1 = canvas1.getContext("2d");
    let ctx2 = canvas2.getContext("2d");
    let ctx3 = canvas3.getContext("2d");
    ctx1.drawImage(image, 0, 0, image.width, image.height)
    let src = [] //グレースケール成分を格納する
    let src1 = ctx1.getImageData(0, 0, image.width, image.height)
    let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
    let dst2 = ctx2.createImageData(canvas2.width, canvas3.height)
    let dst3 = ctx3.createImageData(canvas3.width, canvas3.height)
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
    let dst = this.idft2d(Re, Im, canvas1.width, canvas1.height)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = ~~dst[j]
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)

    // パワースペクトル画像
    let max = Math.max.apply(null, Re.map(Math.abs));
    for (let i = 0, j = 0; i < dst3.data.length; i += 4, j++) {
      dst3.data[i] = dst3.data[i + 1] = dst3.data[i + 2] = ~~(Math.abs(Re[j]) / max * 255)
      dst3.data[i + 3] = 255
    }
    for (let i = 0, j = 0; i < dst3.data.length; i += 4, j++) {
      dst3.data[i] = dst3.data[i + 1] = dst3.data[i + 2] = ~~(Math.abs(Re[j]) / max * 255)
      dst3.data[i + 3] = 255
    }
    ctx3.putImageData(dst3, 0, 0)
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Array} src 
   * @param {int} imgWidth canvas width 
   * @param {int} imgHeight canvas height
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
   * @param {int} imgWidth canvas width
   * @param {int} imgHeight canvas height
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
}
/**
 * Q.33
 * フーリエ変換 ローパスフィルタ
 * @BaseThreeCanvasComponent
 */
export class Ans33 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
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
   * @param {int} imgWidth canvas width 
   * @param {int} imgHeight canvas height
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
   * @param {int} imgWidth canvas width
   * @param {int} imgHeight canvas height
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
   * @param {int} imgWidth image width 
   * @param {int} imgHeight image height
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
/**
 * Q.34
 * フーリエ変換 ハイパスフィルタ
 * @BaseThreeCanvasComponent
 */
export class Ans34 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
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
    this.hpf(Re, Im, canvas1.width, canvas1.height, canvas1.width / 2 * 0.9)

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
   * @param {int} imgWidth canvas width 
   * @param {int} imgHeight canvas height
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
   * @param {int} imgWidth canvas width
   * @param {int} imgHeight canvas height
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
   * ハイパスフィルタ
   * @param {Array} Re 
   * @param {Array} Im 
   * @param {int} imgWidth image width 
   * @param {int} imgHeight image height
   */
  hpf(Re, Im, imgWidth, imgHeight, r) {
    let cx = imgWidth / 2
    let cy = imgHeight / 2
    for (let y = 0; y < imgHeight; y++) for (let x = 0; x < imgWidth; x++) {
      let idx = y * imgWidth + x
      // let d = Math.sqrt(Math.pow(cx - x , 2) + Math.pow(cy - y , 2))
      // if (d > r) {
      //   Re[idx] = 0
      //   Im[idx] = 0
      // }
      if (Math.abs(cx - x) > r || Math.abs(cy - y) > r) {
        Re[idx] = 0
        Im[idx] = 0
      }
    }
  }
}
/**
 * Q.35
 * フーリエ変換 バンドパスフィルタ
 * @BaseThreeCanvasComponent
 */
export class Ans35 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
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
   * @param {int} imgWidth canvas width 
   * @param {int} imgHeight canvas height
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
   * @param {int} imgWidth canvas width
   * @param {int} imgHeight canvas height
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
   * @param {int} imgWidth image width 
   * @param {int} imgHeight image height
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
/**
 * Q.36
 * JPEG圧縮 (Step.1)離散コサイン変換
 * @BaseThreeCanvasComponent
 */
export class Ans36 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
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
    const T = 8
    const K = 8

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      let color = ~~grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let freq = this.dct2d(src, canvas1.width, canvas1.height, T)
    let arr = this.idct2d(freq, canvas1.width, canvas1.height, T, K)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      let value = Math.abs(arr[j]) > 255 ? 255 : Math.abs(arr[j])
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = value
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Array} src 2次元配列
   * @param {int} imgWidth canvas width 
   * @param {int} imgHeight canvas height
   * @param {int} T DCT係数
   */
  dct2d(src, imgWidth, imgHeight, T) {
    const W = imgWidth
    const H = imgHeight
    let dst = new Array(W * H).fill(0)
    let theta = Math.PI / (2 * T)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let v = 0; v < T; v++) for (let u = 0; u < T; u++) {
        let uvIdx = W * (v + yi) + (u + xi);
        for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
          let xyIdx = W * (y + yi) + (x + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) * 
          Math.cos((2 * x + 1) * u * theta) * 
          Math.cos((2 * y + 1) * v * theta)
          dst[uvIdx] += src[xyIdx] * w
        }
      }
    }
    return dst
  }
  /**
   * 2次元離散逆フーリエ変換
   * @param {Array} src
   * @param {int} imgWidth canvas width
   * @param {int} imgHeight canvas height
   * @param {int} T DCT係数
   * @param {int} K DCT係数
   */
  idct2d(src, imgWidth, imgHeight, T, K) {
    const W = imgWidth
    const H = imgHeight
    let theta = Math.PI / (2 * T)
    let dst = new Array(W * H).fill(0)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        let xyIdx = W * (y + yi) + (x + xi);
        for (let v = 0; v < K; v++) for (let u = 0; u < K; u++) {
          let uvIdx = W * (v + yi) + (u + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) * Math.cos((2 * x + 1) * u * theta) * Math.cos((2 * y + 1) * v * theta)
          dst[xyIdx] += src[uvIdx] * w
        }
      }
    }
    return dst
  }
}
/**
 * Q.37
 * PSNR
 * @BaseThreeCanvasComponent
 */
export class Ans37 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
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
    const T = 8
    const K = 4

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      let color = ~~grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let freq = this.dct2d(src, canvas1.width, canvas1.height, T)
    let dst = this.idct2d(freq, canvas1.width, canvas1.height, T, K)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      let value = Math.abs(dst[j]) > 255 ? 255 : Math.abs(dst[j])
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = value
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)

    let psnr = this.psnr(src, dst, image.width, image.height)

    this.showMessage(
      JSON.stringify({
        psnr,
        bitrate: 1 * T * K ** 2 / (T ** 2)
      }, null, '\t')
    )
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Array} src 2次元配列
   * @param {int} imgWidth canvas width 
   * @param {int} imgHeight canvas height
   * @param {int} T DCT係数
   */
  dct2d(src, imgWidth, imgHeight, T) {
    const W = imgWidth
    const H = imgHeight
    let dst = new Array(W * H).fill(0)
    let theta = Math.PI / (2 * T)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let v = 0; v < T; v++) for (let u = 0; u < T; u++) {
        let uvIdx = W * (v + yi) + (u + xi);
        for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
          let xyIdx = W * (y + yi) + (x + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) * 
          Math.cos((2 * x + 1) * u * theta) * 
          Math.cos((2 * y + 1) * v * theta)
          dst[uvIdx] += src[xyIdx] * w
        }
      }
    }
    return dst
  }
  /**
   * 2次元離散逆フーリエ変換
   * @param {Array} src
   * @param {int} imgWidth canvas width
   * @param {int} imgHeight canvas height
   * @param {int} T DCT係数
   * @param {int} K DCT係数
   */
  idct2d(src, imgWidth, imgHeight, T, K) {
    const W = imgWidth
    const H = imgHeight
    let theta = Math.PI / (2 * T)
    let dst = new Array(W * H).fill(0)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        let xyIdx = W * (y + yi) + (x + xi);
        for (let v = 0; v < K; v++) for (let u = 0; u < K; u++) {
          let uvIdx = W * (v + yi) + (u + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) * Math.cos((2 * x + 1) * u * theta) * Math.cos((2 * y + 1) * v * theta)
          dst[xyIdx] += src[uvIdx] * w
        }
      }
    }
    return dst
  }
  /**
   * psnr算出
   * @param {Array} src 入力画像
   * @param {Array} dst 出力画像
   * @param {int} imgWidth 
   * @param {int} imgHeight 
   */
  psnr(src, dst, imgWidth, imgHeight) {
    let sum = 0
    for (let i = 0; i < src.length; i++) {
      let d = Math.abs(src[i] - dst[i])
      sum += d ** d
    }
    let mse = sum / (imgWidth * imgHeight)
    let ans = Math.log10(255 ** 2 / mse)
    return ans
  }
}
/**
 * Q.38
 * JPEG圧縮 (Step.2)DCT+量子化
 * @BaseThreeCanvasComponent
 */
export class Ans38 extends BaseThreeCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
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
    const T = 8
    const K = 8

    for (let i = 0, j = 0; i < src1.data.length; i += 4, j++) {
      let color = ~~grayscale(
        src1.data[i], src1.data[i + 1], src1.data[i + 2]
      )
      src.push(color)
      dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = color
      dst1.data[i + 3] = 255
    }
    ctx1.putImageData(dst1, 0, 0)

    let freq = this.dct2d(src, canvas1.width, canvas1.height, T)
    let dst = this.idct2d(freq, canvas1.width, canvas1.height, T, K)

    for (let i = 0, j = 0; i < dst2.data.length; i += 4, j++) {
      let value = Math.abs(dst[j]) > 255 ? 255 : Math.abs(dst[j])
      dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = value
      dst2.data[i + 3] = 255
    }
    ctx2.putImageData(dst2, 0, 0)

    let psnr = this.psnr(src, dst, image.width, image.height)

    this.showMessage(
      JSON.stringify({
        psnr,
        bitrate: 1 * T * K ** 2 / (T ** 2)
      }, null, '\t')
    )
  }
  /**
   * 2次元離散フーリエ変換
   * @param {Array} src 2次元配列
   * @param {int} imgWidth canvas width 
   * @param {int} imgHeight canvas height
   * @param {int} T DCT係数
   */
  dct2d(src, imgWidth, imgHeight, T) {
    const W = imgWidth
    const H = imgHeight
    const Q = this.getQuantum()
    let dst = new Array(W * H).fill(0)
    let theta = Math.PI / (2 * T)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let v = 0; v < T; v++) for (let u = 0; u < T; u++) {
        let uvIdx = W * (v + yi) + (u + xi);
        for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
          let xyIdx = W * (y + yi) + (x + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) * 
          Math.cos((2 * x + 1) * u * theta) * 
          Math.cos((2 * y + 1) * v * theta)
          dst[uvIdx] += src[xyIdx] * w
        }
      }
      // 量子化
      let b = Array.from(new Array(T), () => new Array(T).fill(0))
      for (let yj = yi, _y = 0; yj < yi + T; yj++, _y++) for (let xj = xi, _x = 0; xj < xi + T; xj++, _x++) {
        b[_y][_x] = dst[W * yj + xj]
      }
      let m = math.dotDivide(b, Q).map(row => row.map(v => Math.round(v)))
      m = math.dotMultiply(m, Q)
      for (let yj = yi, _y = 0; yj < yi + T; yj++, _y++) for (let xj = xi, _x = 0; xj < xi + T; xj++, _x++) {
        dst[W * yj + xj] = b[_y][_x]
      }
    }
    return dst
  }
  /**
   * 2次元離散逆フーリエ変換
   * @param {Array} src
   * @param {int} imgWidth canvas width
   * @param {int} imgHeight canvas height
   * @param {int} T DCT係数
   * @param {int} K DCT係数
   */
  idct2d(src, imgWidth, imgHeight, T, K) {
    const W = imgWidth
    const H = imgHeight
    let theta = Math.PI / (2 * T)
    let dst = new Array(W * H).fill(0)
    let k = 1 / Math.sqrt(2)
    for (let yi = 0; yi < imgHeight; yi += T) for (let xi = 0; xi < imgWidth; xi += T) {
      for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
        let xyIdx = W * (y + yi) + (x + xi);
        for (let v = 0; v < K; v++) for (let u = 0; u < K; u++) {
          let uvIdx = W * (v + yi) + (u + xi);
          let cu = u === 0 ? k : 1
          let cv = v === 0 ? k : 1
          let w = (2 * cu * cv / T) * Math.cos((2 * x + 1) * u * theta) * Math.cos((2 * y + 1) * v * theta)
          dst[xyIdx] += src[uvIdx] * w
        }
      }
    }
    return dst
  }
  /**
   * @return {Array} quantum
   */
  getQuantum() {
    return [
      [16, 11, 10, 16, 24, 40, 51, 61],
      [12, 12, 14, 19, 26, 58, 60, 55],
      [14, 13, 16, 24, 40, 57, 69, 56],
      [14, 17, 22, 29, 51, 87, 80, 62],
      [18, 22, 37, 56, 68, 109, 103, 77],
      [24, 35, 55, 64, 81, 104, 113, 92],
      [49, 64, 78, 87, 103, 121, 120, 101],
      [72, 92, 95, 98, 112, 100, 103, 99]
    ]
  }
  /**
   * psnr算出
   * @param {Array} src 入力画像
   * @param {Array} dst 出力画像
   * @param {int} imgWidth 
   * @param {int} imgHeight 
   */
  psnr(src, dst, imgWidth, imgHeight) {
    let sum = 0
    for (let i = 0; i < src.length; i++) {
      let d = Math.abs(src[i] - dst[i])
      sum += d ** d
    }
    let mse = sum / (imgWidth * imgHeight)
    let ans = Math.log10(255 ** 2 / mse)
    return ans
  }
}
