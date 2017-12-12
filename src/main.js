import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Paginate from 'vuejs-paginate'
Vue.component('paginate', Paginate)
Vue.use(VueAxios, axios)
new Vue({
  el: '#app',
  render: h => h(App)
})
