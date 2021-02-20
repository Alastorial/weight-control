import Vue from 'vue'
import Vuex from 'vuex'

import charts from './charts'
import common from './common'
import user from './user'

// отвечает за store
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    charts,
    common,
    user
  }
})
