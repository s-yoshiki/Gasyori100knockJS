import {BaseThreeCanvasComponent} from "./BaseComponents.js"
/**
 * Q.71
 * マスキング
 * @extends BaseThreeCanvasComponent
 */
export default class Ans71 extends BaseThreeCanvasComponent {
    /**
     * メイン
     * @param {canvas} canvas 
     * @param {Image} image 
     */
    main(canvas1, canvas2, image) {
      let ctx1 = canvas1.getContext("2d");
      let ctx2 = canvas2.getContext("2d");
      let width = image.width
      let height = image.height
  
      canvas1.width = canvas2.width = width
      canvas1.height = canvas2.height = height
  
      ctx1.drawImage(image, 0, 0, width, height)
      ctx2.drawImage(image, 0, 0, width, height)
      let src1 = ctx1.getImageData(0, 0, width, height)
      let dst1 = ctx1.createImageData(canvas1.width, canvas1.height)
      let src2 = ctx2.getImageData(0, 0, width, height)
      let dst2 = ctx2.createImageData(canvas2.width, canvas2.height)
  
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
  
      for (let i = 0; i < src2.data.length; i += 4) {
        if (dst1.data[i] === 0) {
          dst2.data[i] = src2.data[i]
          dst2.data[i + 1] = src2.data[i + 1]
          dst2.data[i + 2] = src2.data[i + 2]
        } else {
          dst2.data[i] = dst2.data[i + 1] = dst2.data[i + 2] = 0
        }
        dst2.data[i + 3] = 255
      }
      ctx2.putImageData(dst2, 0, 0)
    }
    /**
     * rgb -> hsv
     * @param {array} rgb
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