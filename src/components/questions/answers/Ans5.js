import { BaseTwoCanvasComponent } from "./BaseComponents.js"
/**
 * Q.5
 * HSV変換
 * @extends BaseTwoCanvasComponent
 */
export default class Ans5 extends BaseTwoCanvasComponent {
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