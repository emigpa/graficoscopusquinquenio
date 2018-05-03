<template>
  <v-container fluid wrap align-center justify-center>
    <v-card>
    <v-card-title>
          <h1 class="subheading">PUBLICACIONES EN SCOPUS</h1>
      <v-spacer></v-spacer>
      <v-btn-toggle v-model="button">
        <v-btn flat small @click="resetPage">
          Artículos
        </v-btn>
        <v-btn flat small @click="resetPage">
          Libros
        </v-btn>
        <v-btn flat small @click="resetPage">
          Capítulos de libro
        </v-btn>
        <v-btn flat small @click="resetPage">
          Trabajos en eventos
        </v-btn>
        <v-btn flat small @click="resetPage">
          Otras producciones científicas
        </v-btn>
      </v-btn-toggle>
  </v-card-title>
    <v-data-table
      v-if="button === 0"
      :headers="headers"
      :items="this.tabladata"
      :pagination.sync="pagination"
      class="elevation-3"
      item-key="titulo"
      hide-actions
    >
    <template slot="items" slot-scope="props">
      <tr @click="props.expanded = !props.expanded">
        <!-- <v-icon v-if="!props.expanded">expand_more</v-icon>
        <v-icon v-if="props.expanded">expand_less</v-icon> -->
        <td>{{ props.item.titulo }}</td>
        <td>{{ props.item.autores }}</td>
        <td>{{ props.item.revista }}</td>
        <td>{{ props.item.fecha }}</td>
        <td>{{ props.item.citas }}</td>
        <td>{{ props.item.doi }}</td>
        <td>{{ props.item.eid }}</td>
        <td>{{ props.item.issn }}</td>
        <td>{{ props.item.eissn }}</td>
        <td>{{ props.item.instituciones }}</td>
      </tr>
    </template>
    <!-- <template slot="expand" slot-scope="props">
      <v-container grid-list-sm id="listdetail">
        <v-card flat class="blue-grey lighten-4">
          <v-layout row wrap>
            <v-flex xs5>
              <v-card-text>Editorial: <em>{{ props.item.editorial }}</em></br> País: <em>{{ props.item.pais }}</em></br> Área de conocimiento: <em>{{ props.item.areadc }}</em>
              </v-card-text>
            </v-flex>
            <v-flex xs4>
              <v-card-text>ISSN: {{ props.item.issn }}</br>DOI: {{ props.item.doi }}</br>
              </v-card-text>
            </v-flex>
            <v-flex xs3 v-if="props.item.url">
              Enlace a la publicación:
                <v-btn :href="props.item.url" target="_blank" small flat icon outline color="blue">
                  <v-icon>link</v-icon>
                </v-btn>
            </v-flex>
          </v-layout>
        </v-card>
      </v-container>
    </template>
    <template slot="no-data">
      <v-alert :value="true" color="secondary" icon="warning">
        No se encontraron artículos publicados en el período 2014-2017.
      </v-alert>
    </template> -->
    </v-data-table>
  <!-- <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages" :value="1"></v-pagination>
  </div> -->
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      tabladata: [{
        adc: 'CNE',
        autores: 'Aab, A.;Abreu, P.;Aglietta, M.;Ahn, E.J.;Al Samarai, I.;Albert, J.N.;Albuquerque, I.F.M.;Allekotte, I.;Allen, J.;Allison, P.;Almela, A.;Alvarez Castillo, J.;Alvarez-Muñiz, J.;Alves Batista, R.;Ambrosio, M.;Aminaei, A.;Anchordoqui, L.;Andringa, S.;Aramo, C.;Aranda, V.M.;Argirò, S.;Arisaka, K.;Arneodo, F.;Arqueros, F.;Asch, T.;Asorey, H.;Assis, P.;Aublin, J.;Ave, M.;Avenier, M.;Avila, G.;Awal, N.;Badescu, A.M.;Balzer, M.;Barber, K.B.;Barbosa, A.;Barenthien, N.;Bäuml, J.;Baus, C.;Beatty, J.J.;Becker, K.H.;Bellido, J.A.;BenZvi, S.;Berat, C.;Bergmann, T.;Bertaina, M.E.;Biermann, P.L.;Bilhaut, R.;Billoir, P.;Blaess, S.G.;Blanco, M.;Bleve, C.;Blümer, H.;Boháčová, M.;Bolz, H.;Boncioli, D.;Bonifazi, C.;Bonino, R.;Boratav, M.;Borodai, N.;Bracci, F.;Brack, J.;Brancus, I.;Bridgeman, A.;Brogueira, P.;Brown, W.C.;Buchholz, P.;Bueno, A.;Buitink, S.;Buscemi, M.;Caballero-Mora, K.S.;Caccianiga, B.;Caccianiga, L.;Camin, D.;Candusso, M.;Caramete, L.;Caruso, R.;Castellina, A.;Castera, A.;Cataldi, G.;Cazon, L.;Cester, R.;Chavez, A.G.;Chiavassa, A.;Chinellato, J.A.;Chiosso, M.;Chudoba, J.;Cilmo, M.;Clark, P.D.J.;Clay, R.W.;Cocciolo, G.;Colalillo, R.;Coleman, A.;Collica, L.;Colombo, E.;Colonges, S.;Coluccia, M.R.',
        citas: '142',
        doi: '10.1016/j.nima.2015.06.058',
        revista: 'Nuclear Instruments and Methods in Physics Research, Section A: Accelerators, Spectrometers, Detectors and Associated Equipment',
        eid: '2-s2.0-84940537475',
        eissn: '',
        issn: '01689002',
        isbn: '',
        fecha: '2015-10-21',
        instituciones: 'National Oceanic and Atmospheric Administration;Konan University;Universidad Autonoma de Chiapas;Instituto Politecnico Nacional;Vrije Universiteit Brussel;Instituto Balseiro;Consejo Nacional de Investigaciones Cientificas y Tecnicas;Universidad de Buenos Aires;Universidad Nacional de La Plata;Instituto de Fisica Rosario;Universidad Tecnologica Nacional;Comision Nacional de Energia Atomica Argentina;Observatorio Pierre Auger;University of Adelaide;Centro Brasileiro de Pesquisas Fisicas;Faculdade Independente do Nordeste;Universidade de Sao Paulo - USP;Universidade Estadual de Campinas;Universidade Estadual de Feira de Santana;Universidade Federal da Bahia;Universidade Federal de Pelotas;Universidade Federal do ABC;Universidade Federal do Rio de Janeiro;Universidade Federal Fluminense;Institute Ruder Boskovic;Charles University;Institute of Physics of the Academy of Sciences of the Czech Republic;Univerzita Palack&amp;eacute;ho v Olomouci;Institut de Physique Nucleaire Orsay;Laboratoire de lAccelerateur Lineaire;Universite Pierre et Marie Curie;Universite Grenoble Alpes;Institut National des Sciences de lUnivers;Universite de Nantes;Universite Paris 7- Denis Diderot;Bergische Universität Wuppertal;Karlsruhe Institute of Technology Campus South Institut für Experimentelle Kernphysik (IEKP);Karlsruhe Institute of Technology Campus North Institut für Kernphysik;Karlsruhe Institute of Technology Campus North Institut für Prozessdatenverarbeitung und Elektronik;Max-Planck-Institut für Radioastronomie;Rheinisch-Westfalische Technische Hochschule Aachen;Universitat Hamburg;Universität Siegen;Universita degli Studi di Milano;Universita degli Studi di Napoli Federico II;Universita degli Studi di Roma Tor Vergata;Universita degli Studi di Catania;Universita degli Studi di Torino;Universita del Salento;Istituto Nazionale Di Fisica Nucleare, Frascati;Gran Sasso Science Institute (INFN);INAF Istituto di Astrofisica Spaziale e Fisica Cosmica di Palermo;Laboratori Nazionali del Gran Sasso;Benemerita Universidad Autonoma de Puebla;Centro de Investigacion y de Estudios Avanzados;Universidad Michoacana de San Nicolas de Hidalgo;Universidad Nacional Autonoma de Mexico;Radboud University Nijmegen;University of Groningen;FOM-Institute of Subatomic Physics - NIKHEF;Netherlands Foundation for Research in Astronomy;Henryk Niewodniczanski Institute of Nuclear Physics of the Polish Academy of Sciences;Uniwersytet Lodzki;Instituto Superior Tecnico;Horia Hulubei National Institute of Physics and Nuclear Engineering;Institute for Space Sciences, Bucharest;Universitatea din Bucuresti;University Politehnica of Bucharest;Jozef Stefan Institute;University of Nova Gorica;Universidad Complutense de Madrid;Universidad de Alcala;Universidad de Granada;Universidad de Santiago de Compostela;University of Leeds;Case Western Reserve University;Colorado School of Mines;Colorado State University;Colorado State University-Pueblo;Lehman College;Fermi National Accelerator Laboratory;Louisiana State University;Michigan Technological University;New York University;Northeastern University;Ohio State University;Pennsylvania State University;University of Chicago;University of Hawaii at Manoa;University of Nebraska - Lincoln;University of New Mexico;University of California, Los Angeles;University of Wisconsin Madison',
        titulo: 'The Pierre Auger Cosmic Ray Observatory' },
      {
        adc: 'CNE',
        autores: 'Rodrigues, D.;Hojman, D.;Lenzi, S.M.;Cardona, M.A.;Farnea, E.;Axiotis, M.;Beck, C.;Bednarczyk, P.;Bizzetti, P.G.;Bizzetti-Sona, A.M.;Della Vedova, F.;Grębosz, J.;Haas, F.;Kmiecik, M.;Maj, A.;Męczyński, W.;Napoli, D.R.;Nespolo, M.;Papka, P.;Zafra, A.S.I.;Styczen, J.;Thummerer, S.;Ziębliński, M.',
        citas: '0',
        doi: '10.1103/PhysRevC.92.024323',
        revista: 'Physical Review C - Nuclear Physics',
        eid: '2-s2.0-84940826375',
        eissn: '1089490X',
        issn: '05562813',
        fecha: '2015-08-27',
        instituciones: 'Comision Nacional de Energia Atomica Argentina;Consejo Nacional de Investigaciones Cientificas y Tecnicas;Universidad de Buenos Aires;Istituto Nazionale Di Fisica Nucleare, Frascati;Universidad Nacional de San Martin;Laboratori Nazionali di Legnaro;Universite de Strasbourg;Henryk Niewodniczanski Institute of Nuclear Physics of the Polish Academy of Sciences;Helmholtz-Zentrum Berlin für Materialien und Energie (HZB)',
        titulo: 'High-spin states and band terminations in v 49' }],
      button: 0,
      currentpage: 1,
      // pagination: {'sortBy': 'anio', 'descending': true},
      selected: ['articulos', 'libros', 'pdl', 'tep', 'dem'],
      headers: [
        // {
        //   text: '',
        //   align: 'left',
        //   sortable: false,
        //   value: ''
        // },
        {
          text: 'Título',
          align: 'left',
          sortable: false,
          value: 'titulo'
        },
        {
          text: 'Autores',
          align: 'left',
          sortable: false,
          value: 'autores'
        },
        {
          text: 'Revista',
          align: 'left',
          sortable: true,
          value: 'revista'
        },
        {
          text: 'Fecha de publicación',
          align: 'left',
          sortable: true,
          value: 'fecha'
        },
        {
          text: 'citas',
          align: 'left',
          sortable: true,
          value: 'citas'
        },
        {
          text: 'doi',
          align: 'left',
          sortable: true,
          value: 'doi'
        },
        {
          text: 'eid',
          align: 'left',
          sortable: true,
          value: 'eid'
        },
        {
          text: 'issn',
          align: 'left',
          sortable: true,
          value: 'issn'
        },
        {
          text: 'eissn',
          align: 'left',
          sortable: true,
          value: 'eissn'
        },
        {
          text: 'instituciones',
          align: 'left',
          sortable: true,
          value: 'instituciones'
        }
      ]
    }
  },
  computed: {
    pages () {
      return this.tabladata[this.selected[this.button]].length > 0 ? Math.ceil(this.tabladata[this.selected[this.button]].length / 5) : 0
    }
  },
  methods: {
    resetPage () {
      this.pagination.page = 1
    }
  }
}

</script>
<style>
.datatable__expand-content {
  background-color: #CFD8DC;
}
tbody {
  cursor: pointer;
}
</style>