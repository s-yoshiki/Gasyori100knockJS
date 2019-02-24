
import Vue from 'vue'
import { BlankTemplate } from "./templates"

import {
  Ans1, Ans2, Ans3, Ans4, Ans5, Ans6, Ans7, Ans8, Ans9, Ans10
} from './answers/Ans1.js';
import {
  Ans11, Ans12, Ans13, Ans14, Ans15, Ans16, Ans17, Ans18, Ans19, Ans20
} from './answers/Ans2.js';
import {
  Ans21, Ans22, Ans23, Ans24, Ans25, Ans26, Ans27, Ans28, Ans29, Ans30
} from './answers/Ans3.js';
// import { 
//   Ans31, Ans32, Ans33, Ans34, Ans35, Ans36, Ans37, Ans38, Ans39, Ans40
// } from './answers/Ans4.js';
// import { 
//   Ans41, Ans42, Ans43, Ans44, Ans45, Ans46, Ans47, Ans48, Ans49, Ans50
// } from './answers/Ans5.js';
// import { 
//   Ans51, Ans52, Ans53, Ans54, Ans55, Ans56, Ans57, Ans58, Ans59, Ans60
// } from './answers/Ans6.js';
// import { 
//   Ans61, Ans62, Ans63, Ans64, Ans65, Ans66, Ans67, Ans68, Ans69, Ans70
// } from './answers/Ans7.js';
// import { 
//   Ans71, Ans72, Ans73, Ans74, Ans75, Ans76, Ans77, Ans78, Ans79, Ans80
// } from './answers/Ans8.js';
// import { 
//   Ans81, Ans82, Ans83, Ans84, Ans85, Ans86, Ans87, Ans88, Ans89, Ans90
// } from './answers/Ans9.js';
// import { 
//   Ans91, Ans92, Ans93, Ans94, Ans95, Ans96, Ans97, Ans98, Ans99, Ans100
// } from './answers/Ans10.js';

const componentMap = {
  "ans1": new Ans1(),
  "ans2": new Ans2(),
  "ans3": new Ans3(),
  // "ans4": new Ans4(),
  "ans5": new Ans5(),
  "ans6": new Ans6(),
  "ans7": new Ans7(),
  "ans8": new Ans8(),
  "ans9": new Ans9(),
  "ans10": new Ans10(),
  "ans11": new Ans11(),
  "ans12": new Ans12(),
  "ans13": new Ans13(),
  "ans14": new Ans14(),
  "ans15": new Ans15(),
  "ans16": new Ans16(),
  "ans17": new Ans17(),
  "ans18": new Ans18(),
  // "ans19": new Ans19(),
  "ans20": new Ans20(),
  "ans21": new Ans21(),
  "ans22": new Ans22(),
  "ans23": new Ans23(),
  "ans24": new Ans24(),
  "ans25": new Ans25(),
  "ans26": new Ans26(),
  // "ans27": new Ans27(),
  // "ans28": new Ans28(),
  // "ans29": new Ans29(),
  // "ans30": new Ans30(),
  // "ans31": new Ans31(),
  // "ans32": new Ans32(),
  // "ans33": new Ans33(),
  // "ans34": new Ans34(),
  // "ans35": new Ans35(),
  // "ans36": new Ans36(),
  // "ans37": new Ans37(),
  // "ans38": new Ans38(),
  // "ans39": new Ans39(),
  // "ans40": new Ans40(),
  // "ans41": new Ans41(),
  // "ans42": new Ans42(),
  // "ans43": new Ans43(),
  // "ans44": new Ans44(),
  // "ans45": new Ans45(),
  // "ans46": new Ans46(),
  // "ans47": new Ans47(),
  // "ans48": new Ans48(),
  // "ans49": new Ans49(),
  // "ans50": new Ans50(),
  // "ans51": new Ans51(),
  // "ans52": new Ans52(),
  // "ans53": new Ans53(),
  // "ans54": new Ans54(),
  // "ans55": new Ans55(),
  // "ans56": new Ans56(),
  // "ans57": new Ans57(),
  // "ans58": new Ans58(),
  // "ans59": new Ans59(),
  // "ans60": new Ans60(),
  // "ans61": new Ans61(),
  // "ans62": new Ans62(),
  // "ans63": new Ans63(),
  // "ans64": new Ans64(),
  // "ans65": new Ans65(),
  // "ans66": new Ans66(),
  // "ans67": new Ans67(),
  // "ans68": new Ans68(),
  // "ans69": new Ans69(),
  // "ans70": new Ans70(),
  // "ans71": new Ans71(),
  // "ans72": new Ans72(),
  // "ans73": new Ans73(),
  // "ans74": new Ans74(),
  // "ans75": new Ans75(),
  // "ans76": new Ans76(),
  // "ans77": new Ans77(),
  // "ans78": new Ans78(),
  // "ans79": new Ans79(),
  // "ans80": new Ans80(),
  // "ans81": new Ans81(),
  // "ans82": new Ans82(),
  // "ans83": new Ans83(),
  // "ans84": new Ans84(),
  // "ans85": new Ans85(),
  // "ans86": new Ans86(),
  // "ans87": new Ans87(),
  // "ans88": new Ans88(),
  // "ans89": new Ans89(),
  // "ans90": new Ans90(),
  // "ans91": new Ans91(),
  // "ans92": new Ans92(),
  // "ans93": new Ans93(),
  // "ans94": new Ans94(),
  // "ans95": new Ans95(),
  // "ans96": new Ans96(),
  // "ans97": new Ans97(),
  // "ans98": new Ans98(),
  // "ans99": new Ans99(),
  // "ans100": new Ans100(),  
}

function makeComponent() {
  let exportComponents = {};
  for (let i = 1; i <= 100; i++) {
    let key = `ans${i}`
    let obj = componentMap[key]
    if (!componentMap[key]) {
      exportComponents[key] = Vue.component(key, {
        template: BlankTemplate,
      })
      continue
    }
    exportComponents[key] = Vue.component(key, {
      name: key,
      data() {
        return {}
      },
      methods: {
      },
      mounted() {
        // canvasの処理はmoutedの中で行う
        obj.init(this)
        obj._initObject(this)
        // try {
        //   obj.init(this)
        //   obj._initObject(this)
        // } catch (e) {
        //   alert("error:" + e) //todo:
        // }
      },
      template: obj.getTemplate(),
    })
  }
  return exportComponents
}

export default makeComponent()