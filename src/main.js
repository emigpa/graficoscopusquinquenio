import Vue from 'vue/dist/vue.min.js'
import App from './App.vue'
import 'vuetify/dist/vuetify.min.css'
import {
  Vuetify,
  VApp,
  VCard,
  VList,
  VDivider,
  VSwitch,
  VGrid,
  VFooter,
  VBtn,
  VDialog,
  VIcon
  // transitions
} from 'vuetify'

Vue.use(Vuetify, {
  components: {
    VApp,
    VCard,
    VList,
    VDivider,
    VSwitch,
    VGrid,
    VFooter,
    VBtn,
    VDialog,
    VIcon
    // transitions
  }
})

const app = new Vue({
  el: '#app',
  template: `
  <v-app>
    <main>
      <v-container fluid>
      <App><App/>
      </v-container>
    </main>
  </v-app>
  `,
  components: { App }
})
