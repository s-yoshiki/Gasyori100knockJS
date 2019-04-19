import {BaseTwoCanvasComponent} from "./BaseComponents.js"
/**
 * Q.70
 * カラートラッキング
 * @extends BaseTwoCanvasComponent
 */
export default class extends BaseTwoCanvasComponent {
    /**
     * メイン
     * @param {Object} canvas 
     * @param {Object} image 
     */
    main(canvas1, image) {
      let ctx1 = canvas1.getContext("2d");
      let width = image.width
      let height = image.height
      ctx1.drawImage(image, 0, 0, width, height)
      let src1 = ctx1.getImageData(0, 0, width, height)
      let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
      for (let i = 0; i < src1.data.length; i += 4) {
        let c = this.rgb2hsv([
          src1.data[i],
          src1.data[i + 1],
          src1.data[i + 2],
        ])
        if (180 <= c[0] && c[0] <= 260) {
          dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = 255
        } else {
          dst1.data[i] = dst1.data[i + 1] = dst1.data[i + 2] = 0
        }
        dst1.data[i + 3] = 255
      }
      ctx1.putImageData(dst1, 0, 0)
    }
    /**
     * rgb -> hsv
     * @param {Array} rgb
     * @return {array} hsv
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
  }