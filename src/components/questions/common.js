import { DefaultTemplate } from './templates.js'
import CanvasUtility from '@/lib/CanvasTools'
import config from './configure.js'

// export let Controller = {}
export default {
  name: "ans1",
  data() {
    return {
      imageUrl: config.imageUrl,
    };
  },
  methods: {
    run(canvas, image) {}
    // run(canvas, image) {
    //   let ctx = canvas.getContext("2d")
    //   ctx.drawImage(image, 0, 0, image.width, image.height)

    //   let src = ctx.getImageData(0, 0, image.width, image.height)
    //   let dst = ctx.createImageData(image.width, image.height)

    //   for (let i = 0; i < src.data.length; i += 4) {
    //     dst.data[i] = src.data[i + 2]
    //     dst.data[i + 1] = src.data[i + 1]
    //     dst.data[i + 2] = src.data[i]
    //     dst.data[i + 3] = src.data[i + 3]
    //   }
    //   ctx.putImageData(dst, 0, 0)
    // },
  },
  mounted() {
    let canvasAsset = this.$refs["canvas-view-only"]
    let canvas = this.$refs["canvas"]
    let button = this.$refs["button-run"]

    let image = new Image()
    image.src = this.imageUrl

    image.addEventListener("load", () => {
      canvas.width = image.width
      canvas.height = image.height
    })

    CanvasUtility.drawImage(canvasAsset, image)

    button.addEventListener("click", () => {
      this.run(canvas, image)
    })
  },
  template: DefaultTemplate
};