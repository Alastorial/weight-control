// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import Uimini from 'uimini/dist/css/uimini.css'

// Подключили все папки

import App from './App'
import router from './router'
import store from './store'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

Vue.use(
  Vuelidate,
  Uimini
)

Vue.config.productionTip = false

/* eslint-disable no-new */
// Подключили все объекты
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    var config = {
      apiKey: 'AIzaSyDfgOEzaUoiMvGjn2yEVvLJjLsZ_vEuwy0',
      authDomain: 'weight-control-e72da.firebaseapp.com',
      databaseURL: 'https://weight-control-e72da-default-rtdb.firebaseio.com/',
      projectId: 'weight-control-e72da',
      storageBucket: 'weight-control-e72da.appspot.com',
      messagingSenderId: '186086937309'
    }
    firebase.initializeApp(config)

    // Проверка, вошел ли юзер
    firebase.auth().onAuthStateChanged(user => {
      // console.log(user)
      if (user) {
        this.$store.dispatch('loggedUser', user)
      }
      this.$store.dispatch('loadCharts')
    })
  }
})
