/* eslint-disable no-new */
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

// google analyticsのSPA対応
Vue.use(VueAnalytics, {
  id: 'UA-103231688-4',
  router
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
