
import Vue from 'vue'

import answers from './answers/answer1.js'
import Controller from './common.js'

import { DefaultTemplate } from './templates.js'
import CanvasUtility from '@/lib/CanvasTools'
import config from './configure.js'
 

/**
 * 共通コンポーネント作成
 * 
 * @param {String} key コンポーネント名 
 * @param {function} callback 実行されるコールバック
 * @return {Object} vue.component
 */
function getDefaultComponet(key, callback) {
  return Vue.component(key, {
    name: key,
    data() {
      return {
        imageUrl: config.imageUrl,
      };
    },
    methods: {
      run(canvas, image) {
        callback(canvas, image)
      }
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
  })
}


let exportComponents = {};

for (let key in answers) {
  exportComponents[key] = getDefaultComponet(key, answers[key])
}

export default exportComponents