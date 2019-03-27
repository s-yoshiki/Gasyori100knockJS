import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Root from '@/components/Root'
import Question from '@/components/Question'
import Questions from './questions'

let routes = [
  {
    path: '/',
    name: 'root',
    component: Root
  },
  {
    path: '/list',
    name: 'List',
    component: List
  },
  {
    path: '/questions/:id',
    name: 'Question',
    component: Question,
    children: []
  },
  {
    path: '/reset',
    redirect: '/questions/ans1'
  }
]

Questions.forEach(e => {
  routes[2].children.push(e)
})

Vue.use(Router)

export default new Router({
  // mode: 'history', //urlの間に#を挟まない
  routes: routes
})
