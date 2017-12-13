import Vue from 'vue'
window.Vue = Vue
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Paginate from 'vuejs-paginate'
let MyPlugin = {};
MyPlugin.install = function (Vue, options) {
  Vue.param = function (obj) {
    let str = '';
    for (var key in obj) {
      if (str != "") {
        str += "&";
      }
      str += key + "=" + encodeURIComponent(obj[key]);
    };
    return str;
  }
}
Vue.use(MyPlugin)
Vue.component('paginate', Paginate)
Vue.use(VueAxios, axios)
new Vue({
  el: '#app',
  render: h => h(App)
})
