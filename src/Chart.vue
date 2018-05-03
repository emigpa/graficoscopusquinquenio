<template>
  <v-container fluid wrap align-center justify-center>
    <v-card raised>
      <v-card-title primary-title>Scopus grafico loco</v-card-title>
      <v-card-text>Este es el grafico loco</v-card-text>
      <v-layout wrap row>
        <v-flex md10>
          <v-card-media contain>
            <canvas id="scatterchart"></canvas>
          </v-card-media>
        </v-flex>
        <v-flex md2>
          <v-container fluid>
            <v-card-media contain>
              <canvas id="polarchart"></canvas>
            </v-card-media>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12>
                Ciencias naturales y exactas
                <v-switch hide-details class="shrink" color="red" v-model="adc" value="cne"></v-switch>
                Ingenierías y tecnologías
                <v-switch hide-details color="green" v-model="adc" value="iyt"></v-switch>
                Farmacología, toxicología y neurociencias
                <v-switch hide-details color="yellow" v-model="adc" value="ftn"></v-switch>
                Bioquímica, genética y biología molecular
                <v-switch hide-details color="grey" v-model="adc" value="bgm"></v-switch>
                Ciencias sociales y humanidades
                <v-switch hide-details color="blue" v-model="adc" value="sch"></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-card>
  </v-container>
</template>
<script>
import Chart from 'chart.js/dist/Chart.min.js'
import Zoom from 'chartjs-plugin-zoom'
import axios from 'axios'
export default {
  data () {
    return {
      adc: ['cne', 'iyt', 'ftn', 'bgm', 'sch'],
      // pointHitRadius: 5,
      // pointRadius: 0,
      // backgroundColor: 'rgb(255, 34, 51)'
      // options: {
      //   scales:
      //     {
      //       yAxes:
      //       [{ ticks: {
      //         min: 0,
      //         stepSize: 10 }
      //       }]
      //       // xAxes:
      //       // [{ ticks: {
      //       //   // min: 2013,
      //       //   // max: 2017,
      //       //   stepSize: 1}
      //       // }]
      //     }
      // },
      chartData: [],
      // chartData: [['2017-01-01 00:00:00 UTC', 1], ['2018-05-01 00:00:00 UTC', 5]],
      pieData: [['Blueberry', 44], ['Strawberry', 23], ['Strawberry', 23], ['Strawberry', 23], ['Strawberry', 23]]
    }
  },
  methods: {
    getData () {
      axios.get('http://localhost:8080/api/scopus')
        .then(x => {
          const CNEdata = x.data.filter(x => x.adc === 'CNE').map(x => ({...x, y: parseInt(x.y) >= 100 ? `${parseInt(x.y) - 180}` : x.y})).map(y => ({x: y.coordX, y: y.y, r: y.citas}))
          const IYTdata = x.data.filter(x => x.adc === 'IYT').map(y => ({x: y.coordX, y: y.y, r: y.citas}))
          const FTNdata = x.data.filter(x => x.adc === 'FTN').map(y => ({x: y.coordX, y: y.y, r: y.citas}))
          const BGMdata = x.data.filter(x => x.adc === 'BGM').map(y => ({x: y.coordX, y: y.y, r: y.citas}))
          const CSHdata = x.data.filter(x => x.adc === 'CSH').map(y => ({x: y.coordX, y: y.y, r: y.citas}))
          this.chartData.cne = CNEdata
          this.chartData.iyt = IYTdata
          this.chartData.ftn = FTNdata
          this.chartData.bgm = BGMdata
          this.chartData.csh = CSHdata
          this.drawScatterChart()
          this.drawPolarChart()
        })
    },
    drawPolarChart () {
      const ctx = document.getElementById('polarchart')
      const polar = new Chart(ctx, {
        type: 'pie',
        options: {
          responsive: true,
          legend: {
            display: false
          },
          layout: {
            padding: {
              left: 0,
              right: 100,
              top: 0,
              bottom: 0
            }
          }

        },
        data: {
          datasets: [{
            backgroundColor: ['rgba(255, 34, 51, 0.6)', 'rgba(45, 255, 34, 0.6)', 'rgba(209, 162, 21, 0.6)', 'rgba(0, 0, 0, 0.6)', 'rgba(34, 50, 255, 0.6)'],
            data: [
              this.chartData.cne.length,
              this.chartData.iyt.length,
              this.chartData.ftn.length,
              this.chartData.bgm.length,
              this.chartData.csh.length
            ]
          }],
          labels: ['CNE', 'IYT', 'FTN', 'BGM', 'CSH']
        }
      })
    },
    drawScatterChart () {
      const ctx = document.getElementById('scatterchart')
      // Chart.defaults.global.elements.point.borderWidth = 5
      const scatter = new Chart(ctx, {
        plugins: [Zoom],
        type: 'scatter',
        options: {
          responsive: true,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              type: 'linear',
              gridLines: {
                display: false
              },
              ticks: {
                display: false,
                beginAtZero: true,
                min: 0}
            }],
            xAxes: [{
              gridLines: {
                color: 'grey',
                display: true,
                offsetGridLines: false,
                lineWidth: 1
              },
              ticks: {
                fontStyle: 'bold',
                fontSize: 15,
                stepSize: 1000,
                min: 0,
                max: 5000,
                callback: (value, index, values) =>
                  value === 0 ? '2013'
                    : value === 1000 ? '2014'
                      : value === 2000 ? '2015'
                        : value === 3000 ? '2016'
                          : value === 4000 ? '2017'
                            : '2018'
              }
            }]
          },
          pan: {
            enabled: false,
            mode: 'x'
          },
          zoom: {
            enabled: true,
            drag: false,
            mode: 'xy',
            rangeMin: {
              x: 0,
              y: 0
            },
            rangeMax: {
              x: 5000,
              y: 120
            }
          }
        },
        data: {
          datasets: [
            {
              radius: this.chartData.cne.map(x => x.r / 2),
              pointRadius: this.chartData.cne.map(x => x.r / 2),
              pointHoverRadius: this.chartData.cne.map(x => x.r * 0.47),
              label: 'CNE',
              data: this.chartData.cne,
              // radius: this.chartData.cne.map(x => x.y === '0' || x.y === '1' ? '1' : Math.log(x.y) * Math.log(20)),
              backgroundColor: 'rgba(255, 34, 51, 0.6)',
              borderColor: 'rgba(255, 34, 51, 0.4)',
              borderWidth: 2
            },
            {
              label: 'IYT',
              radius: this.chartData.iyt.map(x => x.r / 2),
              pointRadius: this.chartData.iyt.map(x => x.r / 2),
              pointHoverRadius: this.chartData.iyt.map(x => x.r * 0.47),
              data: this.chartData.iyt,
              // radius: this.chartData.iyt.map(x => x.y === '0' || x.y === '1' ? '1' : Math.log(x.y) * Math.log(20)),
              backgroundColor: 'rgba(45, 255, 34, 0.6)',
              borderColor: 'rgba(45, 255, 34, 0.4)',
              borderWidth: 2
            },
            {
              label: 'FTN',
              radius: this.chartData.ftn.map(x => x.r / 2),
              pointRadius: this.chartData.ftn.map(x => x.r / 2),
              pointHoverRadius: this.chartData.ftn.map(x => x.r * 0.47),
              data: this.chartData.ftn,
              // radius: this.chartData.ftn.map(x => x.y === '0' || x.y === '1' ? '1' : Math.log(x.y) * Math.log(20)),
              backgroundColor: 'rgba(209, 162, 21, 0.6)',
              borderColor: 'rgba(209, 162, 21, 0.4)',
              borderWidth: 2
            },
            {
              label: 'BGM',
              radius: this.chartData.bgm.map(x => x.r / 2),
              pointRadius: this.chartData.bgm.map(x => x.r / 2),
              pointHoverRadius: this.chartData.bgm.map(x => x.r * 0.47),
              data: this.chartData.bgm,
              // radius: this.chartData.bgm.map(x => x.y === '0' || x.y === '1' ? '1' : Math.log(x.y) * Math.log(20)),
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderColor: 'rgba(0, 0, 0, 0.4)',
              borderWidth: 2
            },
            {
              label: 'CSH',
              radius: this.chartData.csh.map(x => x.r / 2),
              pointRadius: this.chartData.csh.map(x => x.r / 2),
              pointHoverRadius: this.chartData.csh.map(x => x.r * 0.47),
              data: this.chartData.csh,
              // radius: this.chartData.csh.map(x => x.y === '0' || x.y === '1' ? '1' : Math.log(x.y) * Math.log(20)),
              backgroundColor: 'rgba(34, 50, 255, 0.6)',
              borderColor: 'rgba(34, 50, 255, 0.4)',
              borderWidth: 2
            }
          ]
        }
      })
    }
  },
  mounted () {
    this.getData()
  }
}

</script>
