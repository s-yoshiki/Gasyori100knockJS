import Vue from 'vue'
import Router from 'vue-router'
import List from '@/components/List'
import Root from '@/components/Root'
import Question from '@/components/Question'
import QuestionIframe from '@/components/QuestionIframe'
import Questions from './questions'
import QuestionsIframe from './questionsIframe'

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
    path: '/questions/:id/:iframe',
    name: 'Questioniframe',
    component: QuestionIframe,
    children: []
  },
]

Questions.forEach(e => {
  routes[2].children.push(e)
  
})

QuestionsIframe.forEach(e => {
  routes[3].children.push(e)
})

Vue.use(Router)

export default new Router({
  routes: routes
})
