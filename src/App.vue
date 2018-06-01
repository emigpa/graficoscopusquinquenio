<template>
  <v-container fluid grid-list-md>
    <v-card>
      <v-layout wrap row>
        <v-flex class="pb-3" xl12 lg12 md12 s12 xs12>
      <v-card-title class="title">Publicaciones en revistas en Scopus. UNSAM período 2013-2017.
      </v-card-title>
    </v-flex>
          <v-flex xl10 lg9 md9 s12 xs12>
            <v-card flat>
              <v-card-media contain>
                <canvas id="scatterchart"></canvas>
              </v-card-media>
            </v-card>
          </v-flex>
          <v-flex class="pr-3" xl2 lg3 md3 s12 xs12>
            <v-text-field :rules="this.rules" append-icon="search" id="input1" name="input1" label="Buscar" v-model="search" hint="por título, autor, institución, revista.">
            </v-text-field>
            <v-card class="" flat>
                <v-list class="mb-5" dense>
                  <v-divider></v-divider>
                  <v-list-tile>
                  <v-list-tile-avatar>
                  <v-switch @click.native="setAdc()" hide-details class="shrink mr-3" color="red darken-4" v-model="adc" value="CNE"></v-switch>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      Ciencias naturales y exactas
                    </v-list-tile-title>
                  </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                    <v-switch @click.native="setAdc()" hide-details class="shrink mr-3" color="orange accent-3" v-model="adc" value="IYT"></v-switch>
                  </v-list-tile-avatar>
                    <v-list-tile-content>
                    Ingenierías y tecnologías
                  </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                  <v-switch @click.native="setAdc()" hide-details class="shrink mr-3" color="grey darken-3" v-model="adc" value="CBI"></v-switch>
                </v-list-tile-avatar>
                  <v-list-tile-content>
                  Ciencias biológicas
                  </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                  <v-switch @click.native="setAdc()" hide-details class="shrink mr-3" color="green darken-1" v-model="adc" value="CSH"></v-switch>
                </v-list-tile-avatar>
                  <v-list-tile-content>
                  Ciencias sociales y humanidades
                  </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
            </v-list>
            <v-card-media contain>
              <canvas id="piechart"></canvas>
            </v-card-media>
            <v-card-text class="text-xs-center caption">
              Cantidad de artículos
            </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      <v-footer height="48" class="" color="white">
        <v-spacer></v-spacer>
        <span style="margin-right:5px;">Datos provistos por la API de</span>
        <a href="https://api.elsevier.com" target="_blank">
        <img alt="scopus" height="16" style="vertical-align:bottom;" src="https://www.elsevier.com/__data/assets/image/0003/118146/scopus_logo_r.jpg"></img>
        </a>
        <span style="margin-left:5px;margin-right:5px;">el 1/05/2018</span>
        <a href="https://github.com/emigpa/graficoscopusquinquenio" target="_blank">
        <img class="pr-3" height="24px" alt="github.com/emigpa/graficoscopusquinquenio" src="http://sinos.unsam.edu.ar/graficoscopus/github.png"></img>
      </a>
      </v-footer>
    </v-card>
    <v-dialog v-model="dialog" max-width="1000px">
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
                <v-btn :href="`https://doi.org/${this.dialogData.doi}`" target="_blank" small flat icon outline color="blue">
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
import axios from 'axios'
export default {
  data () {
    return {
      adc: ['CNE', 'IYT', 'CBI', 'CSH'],
      color: {
        CNE: 'rgba(168, 32, 26, 0.8)',
        IYT: 'rgba(255, 145, 0, 0.8)',
        CBI: 'rgba(55, 71, 79, 0.8)',
        CSH: 'rgba(22, 147, 15, 0.8)'
      },
      chartData: [],
      origChartData: [],
      chartResults: [],
      dialog: false,
      dialogData: {},
      search: '',
      rules: [() => this.search.length >= 3 && this.chartResults.length !== 0
        ? `Se encontraton ${this.chartResults.length} resultados.`
        : this.search.length >= 3 && this.chartResults.length === 0
          ? 'No se encontraton resultados.'
          : []
      ]
    }
  },
  methods: {
    getData () {
      axios.get('http://sinos.unsam.edu.ar/api/graficoscopus')
        .then(response => {
          this.chartData = response.data.map(x => ({...x, y: parseInt(x.y) >= 150 ? 160 : parseInt(x.y) + 1}))
          this.origChartData = this.chartData
          this.drawScatterChart()
          this.drawPieChart()
        })
    },
    setAdc () {
      if (this.search.length >= 3) {
        this.chartData = this.chartResults.filter(x => this.adc.includes(x.adc))
        this.drawPieChart()
        this.drawScatterChart()
      } else {
        this.chartData = this.origChartData.filter(x => this.adc.includes(x.adc))
        this.drawPieChart()
        this.drawScatterChart()
      }
    },
    searchChart () {
      if (this.search.length >= 3) {
        const results = this.origChartData.filter(x => {
          const sinAcento = this.search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\\/g, '').replace(/-/g, ' ').replace(/\*/g, '')
          const regex = new RegExp(`\\b${sinAcento}\\b`, 'gi')
          return [regex.test(x.titulo), regex.test(x.autores), regex.test(x.editorial), regex.test(x.instituciones), regex.test(x.licencia)].some(x => x === true)
        })
        const adcs = results.map(x => x.adc).filter((x, y, z) => z.indexOf(x) === y)
        this.chartResults = results
        this.chartData = results
        this.adc = adcs
      }
      if (this.search.length === 0) {
        this.adc = ['CNE', 'IYT', 'CBI', 'CSH']
        this.chartData = this.origChartData
      }
    },
    drawPieChart () {
      const setPieDatasets = () => [{
        data: [
          this.chartData.filter(x => x.adc === 'CNE').length,
          this.chartData.filter(x => x.adc === 'IYT').length,
          this.chartData.filter(x => x.adc === 'CBI').length,
          this.chartData.filter(x => x.adc === 'CSH').length
        ],
        backgroundColor: [this.color.CNE, this.color.IYT, this.color.CBI, this.color.CSH]
      }]
      if (this.pieChart) {
        this.pieChart.data.datasets = setPieDatasets()
        this.pieChart.update({duration: 0})
      } else {
        this.pieChart = new Chart(document.getElementById('piechart'), {
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
                right: 0,
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
            labels: ['Ciencias naturales y exactas', 'Ingenierías y tecnologías', 'Ciencias biológicas', 'Ciencias sociales y humanidades']
          }
        })
      }
    },
    drawScatterChart () {
      const setScatterDatasets = () => this.chartData.map(dataset => {
        const dataRadius = dataset.r >= 150
          ? dataset.r / 6
          : dataset.r < 150 && dataset.r >= 100
            ? dataset.r / 5
            : dataset.r < 100 && dataset.r >= 50
              ? dataset.r / 4
              : dataset.r < 50 && dataset.r >= 20
                ? dataset.r / 3
                : dataset.r < 20 && dataset.r >= 10
                  ? dataset.r / 2
                  : 3
        return {
          data: [this.adc.includes(dataset.adc) ? dataset : []],
          pointRadius: dataRadius,
          pointHoverRadius: dataRadius,
          backgroundColor: this.color[dataset.adc],
          pointHoverBorderColor: 'black',
          pointHoverBorderWidth: 3,
          borderWidth: 3
        }
      })
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
                scaleLabel: {
                  display: true,
                  labelString: 'Citas por artículo',
                  fontStyle: 'bold',
                  fontSize: 15
                },
                type: 'linear',
                gridLines: {
                  display: true,
                  lineWidth: 2,
                  borderDash: [10]
                },
                ticks: {
                  display: false,
                  beginAtZero: true,
                  min: 0,
                  max: 160}
              }],
              xAxes: [{
                gridLines: {
                  display: false,
                  offsetGridLines: false,
                  lineWidth: 5,
                  borderDash: [10]
                },
                ticks: {
                  fontStyle: 'bold',
                  fontSize: 16,
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
                  const currentValue = dataset.data[tooltipItem.index]
                  return `Cantidad de citas: ${currentValue.r}`
                },
                title: (tooltipItem, data) => {
                  const dataset = data.datasets[tooltipItem[0].datasetIndex]
                  const currentValue = dataset.data[tooltipItem[0].index]
                  return `${currentValue.titulo}`
                },
                footer: (tooltipItem, data) => {
                  const dataset = data.datasets[tooltipItem[0].datasetIndex]
                  const currentValue = dataset.data[tooltipItem[0].index]
                  return `${currentValue.fecha}`
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
                y: 160
              }
            },
            onClick: (e, data) => {
              if (data.length !== 0) {
                const dataset = data[0]._chart.data.datasets[data[0]._datasetIndex]
                this.dialogData = dataset.data[data[0]._index]
                this.dialog = true
              } else {}
            },
            onHover: (e, data) => {
              const chart = document.getElementById('scatterchart')
              data.length !== 0
                ? chart.style.cursor = 'pointer'
                : chart.style.cursor = 'zoom-in'
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
    search () {
      this.searchChart()
      this.drawPieChart()
      this.drawScatterChart()
    }
  }
}
</script>
<style>
body {
  background-color: 'white';
  font-family: 'Lato';
}
.application {
  font-family: 'Lato';
}
.chart-container {
  font-family: 'Lato';
}
label[for=input1] {
  font-weight: bold;
}
</style>