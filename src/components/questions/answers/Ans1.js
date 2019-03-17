import { BaseTwoCanvasComponent } from "./BaseComponents.js"
import config from "../configure.js"

export default null

/**
 * Q.1
 * @extends BaseTwoCanvasComponent
 */
export class Ans1 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      dst.data[i] = src.data[i + 2]
      dst.data[i + 1] = src.data[i + 1]
      dst.data[i + 2] = src.data[i]
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }
}

/**
 * Q.2
 * @extends BaseTwoCanvasComponent
 */
export class Ans2 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      let y = 0.2126 * src.data[i] + 0.7152 * src.data[i + 1] + 0.0722 * src.data[i + 2]
      y = parseInt(y, 10)
      dst.data[i] = y
      dst.data[i + 1] = y
      dst.data[i + 2] = y
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }
}

/**
 * Q.3
 * @extends BaseTwoCanvasComponent
 */
export class Ans3 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    const THRESHOLD = 128
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      let y = 0.2126 * src.data[i] + 0.7152 * src.data[i + 1] + 0.0722 * src.data[i + 2]
      y = parseInt(y, 10)
      if (y > THRESHOLD) {
        y = 255
      } else {
        y = 0
      }
      dst.data[i] = y
      dst.data[i + 1] = y
      dst.data[i + 2] = y
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }
}

/**
 * Q.4 大津の2化
 * @extends BaseTwoCanvasComponent
 */
export class Ans4 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    let t = this.threshold(src)

    for (let i = 0; i < dst.data.length; i += 4) {
      let v = grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
      if (v < t) {
        dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = 0
      } else {
        dst.data[i] = dst.data[i + 1] = dst.data[i + 2] = 255
      }
      dst.data[i + 3] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
  /**
   * 大津の2値化
   * @param {ImageData} src
   */
  threshold(src) {
    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    let histgram = Array(256).fill(0)
    let t = 0
    let max = 0

    for (let i = 0; i < src.data.length; i += 4) {
      let g = ~~grayscale(src.data[i], src.data[i + 1], src.data[i + 2])
      histgram[g]++
    }

    for (let i = 0; i < 256; i++) {
      let w1 = 0
      let w2 = 0
      let sum1 = 0
      let sum2 = 0
      let m1 = 0
      let m2 = 0
      for (let j = 0; j <= i; ++j) {
        w1 += histgram[j]
        sum1 += j * histgram[j]
      }
      for (let j = i + 1; j < 256; ++j) {
        w2 += histgram[j]
        sum2 += j * histgram[j]
      }
      if (w1) {
        m1 = sum1 / w1
      }
      if (w2) {
        m2 = sum2 / w2
      }
      let tmp = (w1 * w2 * (m1 - m2) * (m1 - m2))
      if (tmp > max) {
        max = tmp
        t = i
      }
    }
    return t
  }
}

/**
 * Q.5
 * @extends BaseTwoCanvasComponent
 */
export class Ans5 extends BaseTwoCanvasComponent {
  /**
   * rgb to hsv
   * @param {Array} rgb 
   */
  rgb2hsv(rgb) {
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let diff = max - min;

    let h = 0;

    switch (min) {
      case max: h = 0; break;
      case r: h = (60 * ((b - g) / diff)) + 180; break;
      case g: h = (60 * ((r - b) / diff)) + 300; break;
      case b: h = (60 * ((g - r) / diff)) + 60; break;
    }

    let s = max == 0 ? 0 : diff / max;
    let v = max;

    return [h, s, v];
  }
  /**
   * hsv to rgb
   * @param {Array} hsv 
   */
  hsv2rgb(hsv) {
    let h = hsv[0]
    let s = hsv[1]
    let v = hsv[2]
    let c = v * s;
    let hp = h / 60;
    let x = c * (1 - Math.abs(hp % 2 - 1));

    let r, g, b;
    if (0 <= hp && hp < 1) { [r, g, b] = [c, x, 0] }
    if (1 <= hp && hp < 2) { [r, g, b] = [x, c, 0] }
    if (2 <= hp && hp < 3) { [r, g, b] = [0, c, x] }
    if (3 <= hp && hp < 4) { [r, g, b] = [0, x, c] }
    if (4 <= hp && hp < 5) { [r, g, b] = [x, 0, c] }
    if (5 <= hp && hp < 6) { [r, g, b] = [c, 0, x] }

    let m = v - c;
    [r, g, b] = [r + m, g + m, b + m];

    r = Math.floor(r * 255);
    g = Math.floor(g * 255);
    b = Math.floor(b * 255);

    return [r, g, b];
  }
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    for (let i = 0; i < src.data.length; i += 4) {
      let r = src.data[i]
      let g = src.data[i + 1]
      let b = src.data[i + 2]

      let hsv = this.rgb2hsv([r, g, b])
      hsv[0] = (hsv[0] + 180) % 360
      let rgb = this.hsv2rgb(hsv)

      dst.data[i] = rgb[0]
      dst.data[i + 1] = rgb[1]
      dst.data[i + 2] = rgb[2]
      dst.data[i + 3] = src.data[i + 3]
    }
    ctx.putImageData(dst, 0, 0)
  }
}

/**
 * Q.6
 * @extends BaseTwoCanvasComponent
 */
export class Ans6 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    let thresholds = [32, 96, 160, 224]

    for (let i = 0; i < src.data.length; i++) {
      if (i % 4 === 3) {
        dst.data[i] = src.data[i]
        continue
      }

      let neer = Number.MAX_SAFE_INTEGER
      let _j = 0

      for (let j in thresholds) {
        let d = Math.abs(src.data[i] - thresholds[j])
        if (d < neer) {
          neer = d
          _j = j
        }
      }

      dst.data[i] = thresholds[_j]
    }
    ctx.putImageData(dst, 0, 0)
  }
}
/**
 * Q.7
 * @extends BaseTwoCanvasComponent
 */
export class Ans7 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let w = image.width
    let h = image.height
    let dx = w / 16
    let dy = h / 16

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const blurColor = (x, y, w, h) => {
      let ctx = canvas.getContext('2d')
      let r, g, b
      r = g = b = 0

      let src = ctx.getImageData(x, y, w, h);
      let dst = ctx.createImageData(w, h)

      for (let i = 0; i < src.data.length; i += 4) {
        r += src.data[i]
        g += src.data[i + 1]
        b += src.data[i + 2]
      }

      r /= src.data.length / 4
      g /= src.data.length / 4
      b /= src.data.length / 4

      r = Math.ceil(r)
      g = Math.ceil(g)
      b = Math.ceil(b)

      for (let i = 0; i < src.data.length; i += 4) {
        dst.data[i] = r
        dst.data[i + 1] = g
        dst.data[i + 2] = b
        dst.data[i + 3] = 255
      }

      ctx.putImageData(dst, x, y)
    }

    for (let i = 0; i < canvas.width; i += dx) {
      for (let j = 0; j < canvas.height; j += dy) {
        blurColor(i, j, dx, dy)
      }
    }
  }
}
/**
 * Q.8
 * @extends BaseTwoCanvasComponent
 */
export class Ans8 extends BaseTwoCanvasComponent {
  /**
   * メイン
   * @param {canvas} canvas 
   * @param {Image} image 
   */
  main(canvas, image) {
    let w = image.width
    let h = image.height
    let dx = w / 16
    let dy = h / 16

    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    const blurColor = (x, y, w, h) => {
      let ctx = canvas.getContext('2d')
      let r, g, b
      r = g = b = 0

      let src = ctx.getImageData(x, y, w, h);
      let dst = ctx.createImageData(w, h)

      for (let i = 0; i < src.data.length; i += 4) {
        r = src.data[i] > r ? src.data[i] : r
        g = src.data[i + 1] > g ? src.data[i + 1] : g
        b = src.data[i + 2] > b ? src.data[i + 2] : b
      }

      for (let i = 0; i < src.data.length; i += 4) {
        dst.data[i] = r
        dst.data[i + 1] = g
        dst.data[i + 2] = b
        dst.data[i + 3] = 255
      }

      ctx.putImageData(dst, x, y)
    }

    for (let i = 0; i < canvas.width; i += dx) {
      for (let j = 0; j < canvas.height; j += dy) {
        blurColor(i, j, dx, dy)
      }
    }
  }
}

/**
 * Q.9
 * @extends BaseTwoCanvasComponent
 */
export class Ans9 extends BaseTwoCanvasComponent {
  /**
   * 初期処理
   * @param {Document} self 
   */
  init() {
    // ノイズ画像セット
    this.setSrcImage(config.srcImage.noise)
  }
  /**
   * メイン処理
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    const getIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }
    const gaussian = (x, y, sigma) => Math.exp(-(x ** 2 + y ** 2) / (2 * sigma ** 2))

    const kernelSize = 3
    const sigma = 1.3
    let w = 0
    let kernel = Array.from(new Array(kernelSize), () => new Array(kernelSize).fill(0));

    for (let y = 0; y < kernelSize; y++) for (let x = 0; x < kernelSize; x++) {
      let _x = x - Math.floor(kernelSize / 2)
      let _y = y - Math.floor(kernelSize / 2)
      let g = gaussian(_x, _y, sigma)
      kernel[y][x] = g
      kernel[y][x] /= sigma * (Math.sqrt(2 * Math.PI))
      w += kernel[y][x]
    }

    for (let y = 0; y < kernelSize; y++) for (let x = 0; x < kernelSize; x++) {
      kernel[y][x] /= w
    }

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      for (let c = 0; c < 3; c++) {
        let k = 0
        for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
          let _i = i - Math.floor(kernelSize / 2)
          let _j = j - Math.floor(kernelSize / 2)
          k += kernel[i][j] * src.data[getIndex(x + _j, y + _i, c)]
        }
        dst.data[getIndex(x, y, c)] = k
      }
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}

/**
 * Q.10
 * @extends BaseTwoCanvasComponent
 */
export class Ans10 extends BaseTwoCanvasComponent {
  /**
   * 初期処理
   * @param {Document} self 
   */
  init() {
    // ノイズ画像セット
    this.setSrcImage(config.srcImage.noise)
  }
  /**
   * メイン処理
   * @param {canvas} canvas 
   * @param {image} image 
   */
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let src = ctx.getImageData(0, 0, image.width, image.height)
    let dst = ctx.createImageData(image.width, image.height)

    const getIndex = (x, y, channel) => {
      x = Math.min(Math.max(x, 0), canvas.width - 1)
      y = Math.min(Math.max(y, 0), canvas.height - 1)
      return y * canvas.width * 4 + x * 4 + channel
    }

    const kernelSize = 3

    for (let x = 0; x < canvas.width; x++) for (let y = 0; y < canvas.height; y++) {
      for (let c = 0; c < 3; c++) {
        let k = []
        for (let i = 0; i < kernelSize; i++) for (let j = 0; j < kernelSize; j++) {
          let _i = i - Math.floor(kernelSize / 2)
          let _j = j - Math.floor(kernelSize / 2)
          k.push(src.data[getIndex(x + _j, y + _i, c)])
        }
        k.sort((a, b) => a - b)
        dst.data[getIndex(x, y, c)] = k[Math.floor(k.length / 2)]
      }
      dst.data[getIndex(x, y, 3)] = 255
    }
    ctx.putImageData(dst, 0, 0)
  }
}