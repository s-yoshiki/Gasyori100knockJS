import {
  BaseTwoCanvasComponent, BaseThreeCanvasComponent, ThreeCanvasHistogramComponent
} from "./BaseComponents.js"
import config from "../configure.js"

export default null

export class Ans21 extends ThreeCanvasHistogramComponent {
  main(canvas, image) {
    let ctx = canvas.getContext("2d");
    let pixelValues = new Array(255).fill(0)

    ctx.drawImage(image, 0, 0, image.width, image.height)
    let src = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const grayscale = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b
    for (let i = 0; i < src.data.length; i += 4) {
      pixelValues[
        parseInt(
          grayscale(
            src.data[i],
            src.data[i + 1],
            src.data[i + 2],
          )
        )
      ]++
    }
    this.renderChart(pixelValues)
  }
}