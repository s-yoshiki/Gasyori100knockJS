import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'

import Questions from './questions'

let routes = [
  {
    path: '/',
    name: 'root',
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
]

Questions.forEach(e => {
  routes.push(e)
})

Vue.use(Router)

export default new Router({
  routes: routes
})
