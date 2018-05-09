<template>
  <v-container fluid>
    <v-layout wrap column>
      <v-flex>
      <chart></chart>
    </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import Chart from './Chart.vue'
export default {
  components: {
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