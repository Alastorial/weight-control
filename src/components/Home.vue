// Прописываем компонент Home
// Прописываем язык на котром будем писать
<template lang='pug'>
  .content-wrapper
    section
      .container
        h1.ui-title-1 Home
        label Ведите учет своего веса с помощью графика

        .button.button--round.button-primary(
            v-if="!chartActive"
            @click="drawChart"
          ) {{ chartLoad }}

        .footer
          label(for="ageRangeField") Выберите месяц

          label(for='weigthField') Укажите вашу массу на сегодня
          input#weigthField(type='text' placeholder='Масса' v-model='chartWeigth')
          .button.button--round.button-primary(
            @click="newWeigth"
          ) Отправить
          .button.button--round.button-primary(
            v-if="chartActive"
            @click="drawChart"

          ) Обновить размеры графика

        #curve_chart(style="" v-if="checkUser")
      .container.but(style="")
        .button.button--round.button-primary(
          @click="filterAll"
          v-if="chartActive1"
        ) За все время
        .button.button--round.button-primary(
          v-if="chartActive1"
          @click="filterWeek"
        ) За последнюю неделю
        .button.button--round.button-primary(
          v-if="chartActive1"
          @click="filter2Week"
        ) За последние 2 недели
        .button.button--round.button-primary(
          v-if="chartActive1"
          @click="filterMonth"
        ) За последние 30 дней

        .button.button--round.button-primary(
          @click="filterHalf"
          v-if="chartActive1"
        ) За последние пол года

        .button.button--round.button-primary(
          @click="filterYear"
          v-if="chartActive1"
        ) За последний год

        p(v-if="chartActive1")
          label.ui-title-4 Укажите начало и конец рассматриваемого промежутка
          label(for='date') Начало периода:
          input#date(type='date' name='date' v-model="chartStart")
          label(for='date') Начало периода:
          input#date(type='date' name='date' v-model="chartEnd")

        .button.button--round.button-primary(
          @click="filterCast"
          v-if="chartActive1"
        ) Задать свой период

</template>

<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script>

// function handler() {
//   alert('Чтобы изменить размеры графика, обновите страницу')
//   window.removeEventListener('resize', handler)
// }
// window.addEventListener('resize', handler)

// google.charts.load('current', {'packages':['corechart']});
// google.charts.setOnLoadCallback(drawChart);
google.charts.load('current', {'packages':['corechart']})
// google.charts.setOnLoadCallback(drawChart);
export default {
  data () {
    return {
      chartStart: '',
      chartEnd: '',
      chartLoad: 'Загрузить мой график',
      chartActive: false,
      chartActive1: false,
      chartMonth: '',
      chartDay: '',
      chartWeigth: '',
      filterChart: ''

    }
  },

  methods: {
    filterCast () {
      if (this.chartStart && this.chartEnd) {
        this.filterChart = 1
        this.drawChart()
      }
    },
    filterYear () {
      this.filterChart = 365
      this.drawChart()
    },
    filterHalf () {
      this.filterChart = 182
      this.drawChart()
    },
    filterWeek () {
      this.filterChart = 7
      this.drawChart()
    },
    filter2Week () {
      this.filterChart = 14
      this.drawChart()
    },
    filterMonth () {
      this.filterChart = 31
      this.drawChart()
    },
    filterAll () {
      this.filterChart = ''
      this.drawChart()
    },
    newWeigth () {
      google.charts.load('current', {'packages':['corechart']})
      const Data = new Date()
      let monthWorld = Data.getMonth()
      const dayWorld = Data.getDate()
      const yearWorld = Data.getFullYear()
      // let monthWorld = 1
      // const dayWorld = 19

      if (this.chartWeigth) {

        switch (monthWorld) {
              case 0:
                monthWorld = 'янв';
                break
              case 1:
                monthWorld = 'фев';
                break
              case 2:
                monthWorld = 'мар';
                break
              case 3:
                monthWorld = 'апр';
                break
              case 4:
                monthWorld = 'май';
                break
              case 5:
                monthWorld = 'июн';
                break
              case 6:
                monthWorld = 'июл';
                break
              case 7:
                monthWorld = 'авг';
                break
              case 8:
                monthWorld = 'сен';
                break
              case 9:
                monthWorld = 'окт';
                break
              case 10:
                monthWorld = 'ноя';
                break
              case 11:
                monthWorld = 'дек';
                break
            }

        const com = {mass :[dayWorld + ' ' + monthWorld + ' ' + yearWorld, parseFloat(this.chartWeigth)]}

        this.$store.dispatch('newWeigth', com)
          .then(() => {
            localStorage.setItem('chart', 1)
            this.drawChart()
          })

      } else {
        // console.log(this.loading);
        this.drawChart()
      }
    },

    drawChart() {
      this.chartLoad = 'Loading...'
      setTimeout(() => {
        this.chartActive = true
        this.chartActive1 = true
        google.charts.load('current', {'packages':['corechart']});

        let chartDate = [
          ['day', 'kg']
        ]

        const Data = new Date()
        // const monthWorld = Data.getMonth()
        const monthWorld = Data.getMonth()
        const dayWorld = Data.getDate()
        const yearWorld = Data.getFullYear()
        // const monthWorld = 1
        // const dayWorld = 19

        const monthLen = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        // Создаю массив из которого буду извлекать массивы в отсортированный массив
        let chartArray = this.$store.getters.charts
        if (!chartArray) {
          chartArray = [['0 mon', 0]]
        }
        let sortArray = [['day', 'kg']]
        // console.log(chartArray[0])

        // Перебрасываю элементы из одного массива в массив для сортировки
        // Проверка на одинаковые элементы

        for (let i = 0; i < chartArray.length - 1; i++) {
          if (chartArray[i].mass.slice(0, 2)[0] !== chartArray[i + 1].mass.slice(0, 2)[0]) {
            // console.log(chartArray[i].mass.slice(0, 2))
            // console.log(chartArray[i - 1].mass.slice(0, 2))
            sortArray.push(chartArray[i].mass.slice(0, 2))
          }

        }
        try {
          sortArray.push(chartArray[chartArray.length - 1].mass.slice(0, 2))
        } catch (error) {

        }

        // Если выбрано за все время
        if (!this.filterChart) {
          chartDate = sortArray

        } else if (this.filterChart === 7) {

          let lastDayChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[0]
          let lastMonthChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[1]
          let lastYearChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[2]

          switch (lastMonthChart) {
              case 'янв':
                lastMonthChart = 0;
                break
              case 'фев':
                lastMonthChart = 1;
                break
              case 'мар':
                lastMonthChart = 2;
                break
              case 'апр':
                lastMonthChart = 3;
                break
              case 'май':
                lastMonthChart = 4;
                break
              case 'июн':
                lastMonthChart = 5;
                break
              case 'июл':
                lastMonthChart = 6;
                break
              case 'авг':
                lastMonthChart = 7;
                break
              case 'сен':
                lastMonthChart = 8;
                break
              case 'окт':
                lastMonthChart = 9;
                break
              case 'ноя':
                lastMonthChart = 10;
                break
              case 'дек':
                lastMonthChart = 11;
                break
            }

          // console.log(lastDayChart)
          // console.log(lastMonthChart)
          for (let i = 0; i < this.$store.getters.charts.length - 1; i++) {

            let dayChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[0]
            let monthChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[1]
            let yearChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[2]

            switch (monthChart) {
              case 'янв':
                monthChart = 0;
                break
              case 'фев':
                monthChart = 1;
                break
              case 'мар':
                monthChart = 2;
                break
              case 'апр':
                monthChart = 3;
                break
              case 'май':
                monthChart = 4;
                break
              case 'июн':
                monthChart = 5;
                break
              case 'июл':
                monthChart = 6;
                break
              case 'авг':
                monthChart = 7;
                break
              case 'сен':
                monthChart = 8;
                break
              case 'окт':
                monthChart = 9;
                break
              case 'ноя':
                monthChart = 10;
                break
              case 'дек':
                monthChart = 11;
                break
            }

            if (this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0] && yearChart == yearWorld) {
              // console.log(this.$store.getters.charts[i].mass.slice(0, 2)[0]);
              // console.log(this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]);
              if ((dayChart <= dayWorld && dayWorld - dayChart < 7 && monthChart === monthWorld ||
                monthChart === monthWorld - 1 && (dayWorld + monthLen[monthChart]) - dayChart < 7) &&
                this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]) {

                chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))
                // console.log(this.$store.getters.charts[i].mass.slice(0, 2))
              } else if ((monthChart === 12 + monthWorld - 1 && (dayWorld + monthLen[monthChart]) - dayChart < 7 &&
                          this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0])) {
                  chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))
              }
            }

          }
          // console.log(dayWorld);
          // console.log(monthWorld);
          // console.log(lastDayChart);
          // console.log(lastMonthChart);
          // console.log(chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)));

          // Добавляем последний элемент, если он удовлетворяет условиям
          if (lastYearChart == yearWorld) {
            if (lastDayChart <= dayWorld && dayWorld - lastDayChart < 7 && lastMonthChart === monthWorld ||
                lastMonthChart === monthWorld - 1 && (dayWorld + monthLen[lastMonthChart]) - lastDayChart < 7) {

              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
            } else if (lastMonthChart === 12 + monthWorld - 1 && (dayWorld + monthLen[lastMonthChart]) - lastDayChart < 7) {
              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
            }
          }

        } else if (this.filterChart === 14) {

          let lastDayChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[0]
          let lastMonthChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[1]
          let lastYearChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[2]

          switch (lastMonthChart) {
              case 'янв':
                lastMonthChart = 0;
                break
              case 'фев':
                lastMonthChart = 1;
                break
              case 'мар':
                lastMonthChart = 2;
                break
              case 'апр':
                lastMonthChart = 3;
                break
              case 'май':
                lastMonthChart = 4;
                break
              case 'июн':
                lastMonthChart = 5;
                break
              case 'июл':
                lastMonthChart = 6;
                break
              case 'авг':
                lastMonthChart = 7;
                break
              case 'сен':
                lastMonthChart = 8;
                break
              case 'окт':
                lastMonthChart = 9;
                break
              case 'ноя':
                lastMonthChart = 10;
                break
              case 'дек':
                lastMonthChart = 11;
                break
            }

          // console.log(lastDayChart)
          // console.log(lastMonthChart)
          for (let i = 0; i < this.$store.getters.charts.length - 1; i++) {

            let dayChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[0]
            let monthChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[1]
            let yearChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[2]

            switch (monthChart) {
              case 'янв':
                monthChart = 0;
                break
              case 'фев':
                monthChart = 1;
                break
              case 'мар':
                monthChart = 2;
                break
              case 'апр':
                monthChart = 3;
                break
              case 'май':
                monthChart = 4;
                break
              case 'июн':
                monthChart = 5;
                break
              case 'июл':
                monthChart = 6;
                break
              case 'авг':
                monthChart = 7;
                break
              case 'сен':
                monthChart = 8;
                break
              case 'окт':
                monthChart = 9;
                break
              case 'ноя':
                monthChart = 10;
                break
              case 'дек':
                monthChart = 11;
                break
            }

            if (this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]  && yearChart == yearWorld) {
              // console.log(this.$store.getters.charts[i].mass.slice(0, 2)[0]);
              // console.log(this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]);
              if ((dayChart <= dayWorld && dayWorld - dayChart < 14 && monthChart === monthWorld ||
                monthChart === monthWorld - 1 && (dayWorld + monthLen[monthChart]) - dayChart < 14) &&
                this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]) {

                chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))
              } else if ((monthChart === 12 + monthWorld - 1 && (dayWorld + monthLen[monthChart]) - dayChart < 14 &&
                          this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0])) {
                  chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))
              }
            }

          }
          // console.log(dayWorld);
          // console.log(monthWorld);
          // console.log(lastDayChart);
          // console.log(lastMonthChart);
          // console.log(chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)));

          // Добавляем последний элемент, если он удовлетворяет условиям
          if (lastYearChart == yearWorld) {
            if (lastDayChart <= dayWorld && dayWorld - lastDayChart < 14 && lastMonthChart === monthWorld ||
                lastMonthChart === monthWorld - 1 && (dayWorld + monthLen[lastMonthChart]) - lastDayChart < 14) {

              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
            } else if (lastMonthChart === 12 + monthWorld - 1 && (dayWorld + monthLen[lastMonthChart]) - lastDayChart < 14) {
              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
            }
          }

        } else if (this.filterChart === 31) {

          let lastDayChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[0]
          let lastMonthChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[1]
          let lastYearChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[2]

          switch (lastMonthChart) {
              case 'янв':
                lastMonthChart = 0;
                break
              case 'фев':
                lastMonthChart = 1;
                break
              case 'мар':
                lastMonthChart = 2;
                break
              case 'апр':
                lastMonthChart = 3;
                break
              case 'май':
                lastMonthChart = 4;
                break
              case 'июн':
                lastMonthChart = 5;
                break
              case 'июл':
                lastMonthChart = 6;
                break
              case 'авг':
                lastMonthChart = 7;
                break
              case 'сен':
                lastMonthChart = 8;
                break
              case 'окт':
                lastMonthChart = 9;
                break
              case 'ноя':
                lastMonthChart = 10;
                break
              case 'дек':
                lastMonthChart = 11;
                break
            }

          // console.log(lastDayChart)
          // console.log(lastMonthChart)
          for (let i = 0; i < this.$store.getters.charts.length - 1; i++) {

            let dayChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[0]
            let monthChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[1]
            let yearChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[2]

            switch (monthChart) {
              case 'янв':
                monthChart = 0;
                break
              case 'фев':
                monthChart = 1;
                break
              case 'мар':
                monthChart = 2;
                break
              case 'апр':
                monthChart = 3;
                break
              case 'май':
                monthChart = 4;
                break
              case 'июн':
                monthChart = 5;
                break
              case 'июл':
                monthChart = 6;
                break
              case 'авг':
                monthChart = 7;
                break
              case 'сен':
                monthChart = 8;
                break
              case 'окт':
                monthChart = 9;
                break
              case 'ноя':
                monthChart = 10;
                break
              case 'дек':
                monthChart = 11;
                break
            }

            if (this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0] && yearChart == yearWorld) {
              // console.log(this.$store.getters.charts[i].mass.slice(0, 2)[0]);
              // console.log(this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]);
              if ((dayChart <= dayWorld && dayWorld - dayChart < 30 && monthChart === monthWorld ||
                monthChart === monthWorld - 1 && (dayWorld + monthLen[monthChart]) - dayChart < 30) &&
                this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]) {

                chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))
              } else if ((monthChart === 12 + monthWorld - 1 && (dayWorld + monthLen[monthChart]) - dayChart < 30 &&
                          this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0])) {
                  chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))
              }
            }

          }
          // console.log(dayWorld);
          // console.log(monthWorld);
          // console.log(lastDayChart);
          // console.log(lastMonthChart);
          // console.log(chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)));

          // Добавляем последний элемент, если он удовлетворяет условиям
          if (lastYearChart == yearWorld) {
            if (lastDayChart <= dayWorld && dayWorld - lastDayChart < 30 && lastMonthChart === monthWorld ||
                lastMonthChart === monthWorld - 1 && (dayWorld + monthLen[lastMonthChart]) - lastDayChart < 30) {

              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
            } else if (lastMonthChart === 12 + monthWorld - 1 && (dayWorld + monthLen[lastMonthChart]) - lastDayChart < 30) {
              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
            }
          }

        } else if (this.filterChart === 182) {

          // let lastDayChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[0]
          let lastMonthChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[1]
          let lastYearChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[2]

          switch (lastMonthChart) {
              case 'янв':
                lastMonthChart = 0;
                break
              case 'фев':
                lastMonthChart = 1;
                break
              case 'мар':
                lastMonthChart = 2;
                break
              case 'апр':
                lastMonthChart = 3;
                break
              case 'май':
                lastMonthChart = 4;
                break
              case 'июн':
                lastMonthChart = 5;
                break
              case 'июл':
                lastMonthChart = 6;
                break
              case 'авг':
                lastMonthChart = 7;
                break
              case 'сен':
                lastMonthChart = 8;
                break
              case 'окт':
                lastMonthChart = 9;
                break
              case 'ноя':
                lastMonthChart = 10;
                break
              case 'дек':
                lastMonthChart = 11;
                break
            }

          // console.log(lastDayChart)
          // console.log(lastMonthChart)

          for (let i = 0; i < this.$store.getters.charts.length - 1; i++) {

            let yearChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[2]
            let monthChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[1]

            switch (monthChart) {
              case 'янв':
                monthChart = 0;
                break
              case 'фев':
                monthChart = 1;
                break
              case 'мар':
                monthChart = 2;
                break
              case 'апр':
                monthChart = 3;
                break
              case 'май':
                monthChart = 4;
                break
              case 'июн':
                monthChart = 5;
                break
              case 'июл':
                monthChart = 6;
                break
              case 'авг':
                monthChart = 7;
                break
              case 'сен':
                monthChart = 8;
                break
              case 'окт':
                monthChart = 9;
                break
              case 'ноя':
                monthChart = 10;
                break
              case 'дек':
                monthChart = 11;
                break
            }

            if (this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]) {
              // console.log(this.$store.getters.charts[i].mass.slice(0, 2)[0]);
              // console.log(this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]);
              // console.log('-------------')
              // console.log(yearWorld);
              // console.log(monthWorld);
              // console.log(yearChart);
              // console.log(monthChart);
            // console.log(lastYearChart);
            // console.log(lastMonthChart);
              // console.log('-------------')

              if (monthChart <= monthWorld && monthWorld - monthChart < 6 && yearChart == yearWorld ||
                yearChart == yearWorld - 1 && (12 - monthChart + monthWorld < 6)) {
                // console.log("Креветка")
                chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))

              }
            }

          }

          // console.log(yearWorld);
          // console.log(monthWorld);
          // console.log(lastYearChart);
          // console.log(lastMonthChart);
          // console.log(chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)));

          // Добавляем последний элемент, если он удовлетворяет условиям
          if (lastMonthChart <= monthWorld && monthWorld - lastMonthChart < 6 && lastYearChart == yearWorld ||
                lastMonthChart === monthWorld - 1 && monthWorld + 12 - lastMonthChart < 6) {

              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
          }

        } else if (this.filterChart === 365) {

          // let lastDayChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[0]
          let lastMonthChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[1]
          let lastYearChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[2]

          switch (lastMonthChart) {
              case 'янв':
                lastMonthChart = 0;
                break
              case 'фев':
                lastMonthChart = 1;
                break
              case 'мар':
                lastMonthChart = 2;
                break
              case 'апр':
                lastMonthChart = 3;
                break
              case 'май':
                lastMonthChart = 4;
                break
              case 'июн':
                lastMonthChart = 5;
                break
              case 'июл':
                lastMonthChart = 6;
                break
              case 'авг':
                lastMonthChart = 7;
                break
              case 'сен':
                lastMonthChart = 8;
                break
              case 'окт':
                lastMonthChart = 9;
                break
              case 'ноя':
                lastMonthChart = 10;
                break
              case 'дек':
                lastMonthChart = 11;
                break
            }

          // console.log(lastDayChart)
          // console.log(lastMonthChart)

          for (let i = 0; i < this.$store.getters.charts.length - 1; i++) {

            let yearChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[2]
            let monthChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[1]

            switch (monthChart) {
              case 'янв':
                monthChart = 0;
                break
              case 'фев':
                monthChart = 1;
                break
              case 'мар':
                monthChart = 2;
                break
              case 'апр':
                monthChart = 3;
                break
              case 'май':
                monthChart = 4;
                break
              case 'июн':
                monthChart = 5;
                break
              case 'июл':
                monthChart = 6;
                break
              case 'авг':
                monthChart = 7;
                break
              case 'сен':
                monthChart = 8;
                break
              case 'окт':
                monthChart = 9;
                break
              case 'ноя':
                monthChart = 10;
                break
              case 'дек':
                monthChart = 11;
                break
            }

            if (this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]) {

              if (monthChart <= monthWorld && monthWorld - monthChart < 12 && yearChart == yearWorld ||
                yearChart == yearWorld - 1 && (12 - monthChart + monthWorld < 12)) {
                // console.log("Креветка")
                chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))

              }
            }

          }

          // Добавляем последний элемент, если он удовлетворяет условиям
          if (lastMonthChart <= monthWorld && monthWorld - lastMonthChart < 12 && lastYearChart == yearWorld ||
                lastMonthChart === monthWorld - 1 && monthWorld + 12 - lastMonthChart < 12) {

              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
          }

        } else if (this.filterChart) {

          let lastDayChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[0]
          let lastMonthChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[1]
          let lastYearChart = this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2)[0].split(' ')[2]
          let lastSelectTime = Date.parse(lastYearChart + '.' + lastMonthChart + '.' + lastDayChart)/1000

          let startDay = parseInt(this.chartStart.split('-')[2])
          let startMonth = parseInt(this.chartStart.split('-')[1])
          let startYear = parseInt(this.chartStart.split('-')[0])
          let startTime = Date.parse(startYear + '.' + startMonth + '.' + startDay)/1000
          // console.log(startTime)

          let endDay = parseInt(this.chartEnd.split('-')[2])
          let endMonth = parseInt(this.chartEnd.split('-')[1])
          let endYear = parseInt(this.chartEnd.split('-')[0])
          let endTime = Date.parse(endYear + '.' + endMonth + '.' + endDay)/1000
          // console.log(endTime)

          // console.log(startTime)
          // console.log(endTime)
          // console.log(lastDayChart)
          // console.log(lastMonthChart)

          for (let i = 0; i < this.$store.getters.charts.length - 1; i++) {

            let dayChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[0]
            let monthChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[1]
            let yearChart = this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')[2]
            // console.log(dayChart)
            // console.log(monthChart)
            // console.log(yearChart)
            switch (monthChart) {
              case 'янв':
                monthChart = 0;
                break
              case 'фев':
                monthChart = 1;
                break
              case 'мар':
                monthChart = 2;
                break
              case 'апр':
                monthChart = 3;
                break
              case 'май':
                monthChart = 4;
                break
              case 'июн':
                monthChart = 5;
                break
              case 'июл':
                monthChart = 6;
                break
              case 'авг':
                monthChart = 7;
                break
              case 'сен':
                monthChart = 8;
                break
              case 'окт':
                monthChart = 9;
                break
              case 'ноя':
                monthChart = 10;
                break
              case 'дек':
                monthChart = 11;
                break
            }
            monthChart += 1

            let selectTime = Date.parse(yearChart + '.' + monthChart + '.' + dayChart)/1000
            // console.log(selectTime, this.$store.getters.charts[i].mass.slice(0, 2)[0].split(' ')

            if (this.$store.getters.charts[i].mass.slice(0, 2)[0] !== this.$store.getters.charts[i + 1].mass.slice(0, 2)[0]) {

              if (startTime <= selectTime && selectTime <= endTime) {
                // console.log("Креветка")
                chartDate.push(this.$store.getters.charts[i].mass.slice(0, 2))

              }
            }

          }

          // Добавляем последний элемент, если он удовлетворяет условиям
          if (startTime <= lastSelectTime && lastSelectTime <= endTime) {

              chartDate.push(this.$store.getters.charts[this.$store.getters.charts.length - 1].mass.slice(0, 2))
          }

        }

        // console.log(chartDate);

        // Функция по очистке массива от года
        if (chartDate.length === 1) {
          return
        }
        for (let i = 1; i < chartDate.length; i++) {
          chartDate[i][0] = chartDate[i][0].split(' ')[0] + ' ' + chartDate[i][0].split(' ')[1]
        }

        // console.log(chartDate);

        if (chartDate.length === 1 && !localStorage.getItem('chart')) {
          chartDate.push(['начало', 0])
        }

        try{
          let data = google.visualization.arrayToDataTable(chartDate);
        // console.log(data);

        let options = {
          title: 'Your Weigth',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart =  new google.visualization.LineChart(document.getElementById('curve_chart'))

        chart.draw(data, options)
        this.chartActive = true

        } catch (error) {
          console.log('wait');
        }
      }, 1800)

      // console.log(chartDate)
    },
    googleDate (date) {
      return
    },
    getHoursAndMinutes (minutes) {
      let hours = Math.trunc(minutes / 60)
      let min = minutes % 60
      return hours + ' Hours ' + min + ' Minutes'
    }
  },

  computed: {
    loading () {
      return this.$store.getters.loading
    },
    checkUser () {
      // return this.$store.getters.checkUser
      return localStorage.getItem('auth')
    },
    charts () {
      return this.$store.getters.charts
    }
  }

}

</script>

<!--С помощью scoped мы объявляем стили только для этого файла-->
<style lang="stylus" scoped>

.button--round
  margin-top: 20px;
  margin-bottom: 20px;
  margin-right: 15px;
  flex-wrap wrap

#curve_chart
  // position: absolute;
  // top: -100px;
  // left: -10px;
  width: 1300px
  height: 500px
@media screen
  #curve_chart
    position: absolute;
    left: -100px;
    width: 1550px
  .but
    bottom: -600px

@media screen and (max-width: 1280px)
  #curve_chart
    width: 1400px
  .but
    bottom: -600px

@media screen and (max-width: 1140px)
  #curve_chart
    width: 1100px
  .but
    bottom: -600px

@media screen and (max-width: 980px)
  #curve_chart
    width: 1000px
  .but
    bottom: -600px

@media screen and (max-width: 780px)
  #curve_chart
    width: 700px
  .but
    position: absolute;
    bottom: -750px;

@media screen and (max-width: 490px)
  #curve_chart
    width: 400px
    left: -30px
  .but
    position: absolute;
    bottom: -980px;

</style>
