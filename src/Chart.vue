<template>
  <v-container fluid wrap align-center justify-center>
    <v-card raised>
      <v-card-title class="title">Publicaciones en revistas en Scopus. UNSAM período 2013-2017</v-card-title>
      <v-card-text class="subheading">El tamaño de las bolas es proporcional a la cantidad de citaciones.</v-card-text>
      <v-layout wrap row>
        <v-flex md10>
          <v-card-media contain>
            <canvas id="scatterchart"></canvas>
          </v-card-media>
        </v-flex>
        <v-flex md2>
          <v-container fluid>
            <v-card-media contain>
              <canvas id="piechart"></canvas>
            </v-card-media>
            <v-layout row wrap>
              <v-flex xs12 sm12 md12>
                Ciencias naturales y exactas
                <v-switch hide-details color="red" v-model="adc" value="cne"></v-switch>
                Ingenierías y tecnologías
                <v-switch hide-details color="blue" v-model="adc" value="iyt"></v-switch>
                Farmacología, toxicología y neurociencias
                <v-switch hide-details color="yellow" v-model="adc" value="ftn"></v-switch>
                Bioquímica, genética y biología molecular
                <v-switch hide-details color="grey" v-model="adc" value="bgm"></v-switch>
                Ciencias sociales y humanidades
                <v-switch hide-details color="blue" v-model="adc" value="csh"></v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
      <v-footer height="48" class="pa-3">
    <v-spacer></v-spacer>
    <span>Elsevier nos presta la data. &copy;</span>
    <img src="public/data-favicon.png"></img>
  </v-footer>
    </v-card>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
           <span class="title">{{ this.dialogData.titulo }}</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="caption">
            <span class="subheading">Revista: </span>{{this.dialogData.editorial}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="caption">
            <span class="subheading">Autores:</span> {{this.dialogData.autores}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="caption">
            <span class="subheading">Instituciones:</span> {{this.dialogData.instituciones}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="caption">
            <span class="subheading">Issn: </span>{{this.dialogData.issn}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="caption">
            <span class="subheading">E-issn: </span>{{this.dialogData.eissn}}
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="caption">
            <span class="subheading">Abstract: </span>{{this.dialogData.abstract}}
          </v-card-text>
          <v-card-text class="caption">
            <span class="subheading">Enlace a la publicación: </span>
                <v-btn :href="`http://doi.org/${this.dialogData.doi}`" target="_blank" small flat icon outline color="blue">
                  <v-icon>link</v-icon>
                </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialog=false">Cerrar</v-btn>
          </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import Chart from 'chart.js/dist/Chart.min.js'
import Zoom from 'chartjs-plugin-zoom'
import Datalabels from 'chartjs-plugin-datalabels'
import axios from 'axios'
export default {
  data () {
    return {
      adc: ['cne', 'iyt', 'ftn', 'bgm', 'csh'],
      color: {
        cne: 'rgba(239, 7, 3, 0.6)',
        iyt: 'rgba(186, 3, 249, 0.6)',
        ftn: 'rgba(0, 20, 226, 0.6)',
        bgm: 'rgba(0, 222, 249, 0.6)',
        csh: 'rgba(0, 239, 59, 0.6)'
        // cne: 'rgba(255, 34, 51, 0.6)',
        // iyt: 'rgba(45, 255, 34, 0.6)',
        // ftn: 'rgba(209, 162, 21, 0.6)',
        // bgm: 'rgba(0, 0, 0, 0.6)',
        // csh: 'rgba(34, 50, 255, 0.6)'
      },
      chartData: [],
      dialog: false,
      dialogData: {}
    }
  },
  methods: {
    getData () {
      axios.get('http://sinos.unsam.edu.ar/api/scopus')
        .then(x => {
          const CNEdata = x.data.filter(x => x.adc === 'CNE').map(x => ({...x, y: x.y >= 100 ? x.y - 180 : x.y + 1})).map(y => ({...y, x: y.coordX, y: y.y, r: y.citas}))
          const IYTdata = x.data.filter(x => x.adc === 'IYT').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas}))
          const FTNdata = x.data.filter(x => x.adc === 'FTN').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas}))
          const BGMdata = x.data.filter(x => x.adc === 'BGM').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas}))
          const CSHdata = x.data.filter(x => x.adc === 'CSH').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas}))
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
      const setPieDatasets = () => [{
        data: Object.entries(this.chartData).map(dataset => this.adc.includes(dataset[0]) ? dataset[1].length : 0),
        backgroundColor: [this.color.cne, this.color.iyt, this.color.ftn, this.color.bgm, this.color.csh]
      }]
      if (this.pieChart) {
        this.pieChart.data.datasets = setPieDatasets()
        this.pieChart.update({duration: 0})
      } else {
        this.pieChart = new Chart(document.getElementById('piechart'), {
          plugins: [Datalabels],
          type: 'doughnut',
          options: {
            animation: {
              easing: 'easeOutCirc',
              duration: 1500},
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
            },
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => {
                  const dataset = data.datasets[tooltipItem.datasetIndex]
                  const meta = dataset._meta[Object.keys(dataset._meta)[0]]
                  const total = meta.total
                  const currentValue = dataset.data[tooltipItem.index]
                  const percentage = parseFloat((currentValue / total * 100).toFixed(1))
                  return currentValue + ' (' + percentage + '%)'
                },
                title: (tooltipItem, data) => data.labels[tooltipItem[0].index]
              }
            }
          },
          data: {
            datasets: setPieDatasets(),
            labels: ['CNE', 'IYT', 'FTN', 'BGM', 'CSH'],
            datalabels: {
              display: true,
              formatter: (value, context) => {
                console.log(value)
              }
            }
          }
        })
      }
    },
    drawScatterChart () {
      const setScatterDatasets = () => Object.entries(this.chartData).map(dataset => ({
        data: this.adc.includes(dataset[0]) ? dataset[1] : [],
        pointRadius: dataset[1].map(x => x.r <= 2 ? 2 : x.r / 3),
        pointHoverRadius: dataset[1].map(x => x.r <= 2 ? 2 : x.r / 3),
        // radius: dataset[1].map(x => x.y === '0' || x.y === '1' ? '1' : Math.log(x.y) * Math.log(20)),
        backgroundColor: this.color[dataset[0]],
        pointHoverBorderColor: 'black',
        pointHoverBorderWidth: 3,
        borderWidth: 3}
      ))
      if (this.scatterChart) {
        this.scatterChart.data.datasets = setScatterDatasets()
        this.scatterChart.update({duration: 0})
      } else {
        this.scatterChart = new Chart(document.getElementById('scatterchart'), {
          plugins: [Zoom],
          type: 'scatter',
          options: {
            animation: {
              easing: 'easeOutCirc',
              duration: 2000},
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
                  display: false,
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
            tooltips: {
              callbacks: {
                label: (tooltipItem, data) => {
                  const dataset = data.datasets[tooltipItem.datasetIndex]
                  // const meta = dataset._meta[Object.keys(dataset._meta)[0]]
                  // const total = meta.total
                  const currentValue = dataset.data[tooltipItem.index]
                  // const percentage = parseFloat((currentValue / total * 100).toFixed(1))
                  // console.log(currentValue)
                  return `CANTIDAD DE CITAS: ${currentValue.citas}`
                },
                title: (tooltipItem, data) => {
                  const dataset = data.datasets[tooltipItem[0].datasetIndex]
                  const currentValue = dataset.data[tooltipItem[0].index]
                  return `${currentValue.titulo}`
                  // const dataset = data.datasets[tooltipItem.datasetIndex]
                  // const currentValue = dataset.data[tooltipItem.index]
                  // return currentValue.citas
                },
                footer: (tooltipItem, data) => {
                  const dataset = data.datasets[tooltipItem[0].datasetIndex]
                  const currentValue = dataset.data[tooltipItem[0].index]
                  return `${currentValue.fecha}` // currentValue.titulo // + ' (' + percentage + '%)'
                }
              }
            },
            pan: {
              enabled: true,
              mode: 'xy',
              rangeMin: {
                x: 0,
                y: 0
              },
              rangeMax: {
                x: 5000,
                y: 120
              }
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
            },
            onClick: (e, data) => {
              const dataset = data[0]._chart.data.datasets[data[0]._datasetIndex]
              this.dialogData = dataset.data[data[0]._index]
              this.dialog = true
            }
          },
          data: {
            datasets: setScatterDatasets()
          }
        })
      }
    }
  },
  mounted () {
    this.getData()
  },
  watch: {
    adc () {
      this.drawScatterChart()
      this.drawPolarChart()
    }
  }
}
</script>
