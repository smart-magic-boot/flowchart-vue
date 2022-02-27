import Vue from 'vue';
import App from './views/App';
import axios from 'axios'
import qs from 'qs'
Vue.prototype.axios = axios    //全局注册，使用方法为:this.$axios
Vue.prototype.qs = qs           //全局注册，使用方法为:this.qs

// axios.defaults.baseURL = 'http://localhost:8888';
axios.defaults.headers.post['Content-Type'] = 'application/json';

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  mounted() {},
  components: {
    App,
  },
});