import firebase from 'firebase/app'

import User from './user_help'

export default {
  // Тут лежит id юзера
  state: {
    user: null
  },

  mutations: {
    setUser (state, payload) {
      state.user = payload
      // console.log(payload)
    }
  },

  actions: {
    async registerUser ({commit}, {email, password}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await firebase.auth().createUserWithEmailAndPassword(email, password)
        commit('setUser', new User(user.user.uid))

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async loginUser ({commit}, {email, password}) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const user = await firebase.auth().signInWithEmailAndPassword(email, password)
        commit('setUser', new User(user.user.uid))

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    // Если пользователь уже вошел, то передаем его id в state.user
    loggedUser ({commit}, payload) {
      commit('setUser', new User(payload.uid))
      // console.log(payload.uid)
    },
    logoutUser ({commit}) {
      localStorage.removeItem('chart')
      localStorage.removeItem('auth')
      localStorage.removeItem('login')
      firebase.auth().signOut()
      commit('setUser', null)
      // this.$router.push('/login')
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    checkUser (state) {
      return state.user !== null
    }
  }
}
