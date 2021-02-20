import Vue from 'vue'
import Router from 'vue-router'
// import store from '../store'

import Home from '@/components/Home'
// import Task from '@/components/Task'
import Login from '@/components/Auth/Login'
import Registration from '@/components/Auth/Registration'
// МЫ ИМПОРТИРУЕМ КОМПОНЕНТЫ (КУСКИ КОДА) В РОУТЕР, ЧТОБЫ ПОДКЛЮЧИТЬ ИХ К САЙТУ ПО ОПРЕДЕЛЕННЫМ ДИРИКТОРИЯМ
Vue.use(Router)

// Короче мы заранее по роутам подгружаем компоненты, чтобы не грузить их потом, круто же
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/', // ПО ТАКОЙ ССЫЛКЕ МЫ ДОБАВЛЯЕМ КОМПОНЕНТ Home, дальше аналогично
      name: 'home', // фиг знает, зачем нам имя, пока что оно не нужно
      component: Home,
      beforeEnter (to, from, next) {
        localStorage.getItem('auth') ? next() : next('/login')
        // store.getters.checkUser ? next() : next('/login')
      }
    },
    // {
    //   path: '/task',
    //   name: 'task',
    //   component: Task,
    //   beforeEnter (to, from, next) {
    //     localStorage.getItem('auth') ? next() : next('/login')
    //     // store.getters.checkUser ? next() : next('/login')
    //   }
    // },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter (to, from, next) {
        localStorage.getItem('auth') ? next('/') : next()
      }
    },
    {
      path: '/registration',
      name: 'registration',
      component: Registration,
      beforeEnter (to, from, next) {
        localStorage.getItem('auth') ? next('/') : next()
      }
    }
  ]
})
