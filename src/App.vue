<template>
  <v-container fluid>
    <v-layout wrap column>
      <v-flex>
      <chart></chart>
      <!-- <guia-tabla></guia-tabla> -->
    </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import GuiaTabla from './GuiaTabla.vue'
import Chart from './Chart.vue'
export default {
  components: {
    'guia-tabla': GuiaTabla,
    'chart': Chart
  },
  data () {
    return {
    }
  }
}
</script>
<style>
body {
  font-family: 'Lato';
}
.application {
  font-family: 'Lato';
}
.chart-container {
  font-family: 'Lato';
}
</style>