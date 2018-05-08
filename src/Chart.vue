<template>
  <v-container fluid grid-list-md>
    <v-card>
      <v-card-title class="title">Publicaciones en revistas en Scopus. UNSAM período 2013-2017
      </v-card-title>
      <!-- <v-card-text class="subheading">El tamaño de las bolas es proporcional a la cantidad de citaciones.
      </v-card-text> -->
      <v-card-media contain>
        <v-layout wrap row>
          <v-flex xl10 lg9 md9 s12 xs12>
            <v-card flat>
              <v-card-media contain>
                <canvas id="scatterchart"></canvas>
              </v-card-media>
            </v-card>
          </v-flex>
          <v-flex xl2 lg3 md3 s12 xs12>
            <v-card flat>
                <v-list class="mb-5" dense>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                    <v-switch hide-details class="shrink mr-3" color="red darken-4" v-model="adc" value="cne"></v-switch>
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
                    <v-switch hide-details class="shrink mr-3" color="teal lighten-2" v-model="adc" value="iyt"></v-switch>
                  </v-list-tile-avatar>
                    <v-list-tile-content>
                    Ingenierías y tecnologías
                  </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                  <v-switch hide-details class="shrink mr-3" color="blue-grey darken-1" v-model="adc" value="cbi"></v-switch>
                </v-list-tile-avatar>
                  <v-list-tile-content>
                  Ciencias Biológicas
                  </v-list-tile-content>
                  </v-list-tile>
                  <v-divider></v-divider>
                  <v-list-tile>
                    <v-list-tile-avatar>
                  <v-switch hide-details class="shrink mr-3" color="green darken-1" v-model="adc" value="csh"></v-switch>
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
            </v-card>
          </v-flex>
        </v-layout>
      </v-card-media>
      <v-footer height="48" class="pa-3" color="white">
        <v-spacer></v-spacer>
        <span style="margin-right:5px;">Datos provistos por la API de</span>
        <a href="http://api.elsevier.com" target="_blank">
        <img alt="scopus" height="16" src="https://www.elsevier.com/__data/assets/image/0003/118146/scopus_logo_r.jpg"></img>
        </a>
        <span style="margin-left:5px;margin-right:5px;">el 1/05/2018</span>
        <img alt="UNSAMDATA" src="public/data-favicon.png"></img>
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
      adc: ['cne', 'iyt', 'cbi', 'csh'],
      color: {
        cne: 'rgba(168, 32, 26, 0.8)',
        iyt: 'rgba(15, 140, 142, 0.7)',
        cbi: 'rgba(20, 54, 66, 0.7)',
        csh: 'rgba(22, 147, 15, 0.7)'
      },
      chartData: [],
      dialog: false,
      dialogData: {}
    }
  },
  methods: {
    getData () {
      axios.get('http://localhost:8080/api/scopus')
        .then(x => {
          const CNEdata = x.data.filter(x => x.adc === 'CNE').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas})).map(x => ({...x, y: x.y >= 150 ? 160 : x.y}))
          const IYTdata = x.data.filter(x => x.adc === 'IYT').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas}))
          const CBIdata = x.data.filter(x => x.adc === 'CBI').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas}))
          const CSHdata = x.data.filter(x => x.adc === 'CSH').map(y => ({...y, x: y.coordX, y: y.y + 1, r: y.citas}))
          this.chartData.cne = CNEdata
          this.chartData.iyt = IYTdata
          this.chartData.cbi = CBIdata
          this.chartData.csh = CSHdata
          this.drawScatterChart()
          this.drawPolarChart()
        })
    },
    drawPolarChart () {
      const setPieDatasets = () => [{
        data: Object.entries(this.chartData).map(dataset => this.adc.includes(dataset[0]) ? dataset[1].length : 0),
        backgroundColor: [this.color.cne, this.color.iyt, this.color.cbi, this.color.csh]
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
            labels: ['Ciencias naturales y exactas', 'Ingenierías y tecnologías', 'Ciencias biológicas', 'Ciencias sociales y humanidades'],
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
      const setScatterDatasets = () => Object.entries(this.chartData).map(dataset => {
        const dataRadius = dataset[1].map(x => x.r >= 150
          ? x.r / 6
          : x.r < 150 && x.r >= 100
            ? x.r / 5
            : x.r < 100 && x.r >= 50
              ? x.r / 4
              : x.r < 50 && x.r >= 20
                ? x.r / 3
                : x.r < 20 && x.r >= 10
                  ? x.r / 2
                  : 3)
        return {
          data: this.adc.includes(dataset[0]) ? dataset[1] : [],
          pointRadius: dataRadius,
          pointHoverRadius: dataRadius,
          backgroundColor: this.color[dataset[0]],
          pointHoverBorderColor: 'black',
          pointHoverBorderWidth: 3,
          borderWidth: 3
        }
      }
      )
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
                  fontSize: 16
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
                  min: 0}
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
                  // const meta = dataset._meta[Object.keys(dataset._meta)[0]]
                  // const total = meta.total
                  const currentValue = dataset.data[tooltipItem.index]
                  // const percentage = parseFloat((currentValue / total * 100).toFixed(1))
                  // console.log(currentValue)
                  return `Cantidad de citas: ${currentValue.citas}`
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
    adc () {
      this.drawScatterChart()
      this.drawPolarChart()
    }
  }
}
</script>
