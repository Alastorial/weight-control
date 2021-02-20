import firebase from 'firebase/app'
import 'firebase/database'

import Chart from './charts_help'

export default {
  state: {
    chartDate: [
      // ['day', 'kg'],
      // ['2 фев',  55]
      // ['3 фев',  56],
      // ['4 фев',  70],
      // ['5 фев',  57],
      // ['6 фев',  55],
      // ['7 фев',  56]
    ]
  },
  mutations: {
    newChart (state, payload) {
      state.chartDate.push(payload)
    },
    loadCharts (state, payload) {
      // console.log(state.chartDate)
      state.chartDate = payload
      // console.log(state.chartDate)
    }
  },

  actions: {
    async loadCharts ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        // Получили из бд
        const chart = await firebase.database().ref('charts').once('value')

        const charts = chart.val()
        // console.log(tags)

        const chartsArray = []

        // Перебираем масссив с тегами
        Object.keys(charts).forEach(key => {
          // Кладем в t соответствующий тег
          const t = charts[key]
          // Добавляем в массив тегами значения из t,
          // предварительно распаковав их
          chartsArray.push(
            new Chart(
              t.mass,
              t.user,
              key
            )
          )
        })

        // Отправляем список тегов на создание
        commit('loadCharts', chartsArray)

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },

    async newWeigth ({commit, getters}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const newChart = new Chart(
          payload.mass,
          getters.user.id
        )

        // Отправляем в базу данных новый таск
        const tag = await firebase.database().ref('charts').push(newChart)

        // Отправляем в таски новый таск
        commit('newChart', {
          ...newChart,
          id: tag.key
        })

        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }

  },
  getters: {
    // Возвращаем теги для конкретного пользователя
    charts (state, getters) {
      return state.chartDate.filter(tag => {
        return tag.user === getters.user.id
      })
    }
  }
}
