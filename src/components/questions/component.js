
import Vue from 'vue'

import { DefaultTemplate } from './templates.js'
import CanvasUtility from '@/lib/CanvasTools'

import config from './configure.js'
import answer1 from './answers/answer1.js';
import answer2 from './answers/answer2.js';


let answerSrc = [
  answer1,
  answer2,
]
let answers = {}
let exportComponents = {};

answerSrc.forEach((v) => {
  for (let key in v) {
    answers[key] = v[key]
  }
})

for (let key in answers) {
  let image = answers[key]["srcImg"] ? answers[key]["srcImg"] : config.srcImage.default
  exportComponents[key] = Vue.component(key, {
    name: key,
    data() {
      return {
        imageUrl: image,
      };
    },
    methods: {
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
        answers[key].main(canvas, image)
      })
    },
    template: DefaultTemplate
  })
}

export default exportComponents