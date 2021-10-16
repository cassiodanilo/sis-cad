import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify'
import VueMask from 'v-mask';
import VueCurrencyInput from "vue-currency-input";

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:3000/'
axios.interceptors.response.use(undefined, function (error) {
  if (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      store.dispatch('LogOut')
      return router.push('/login')
    }
  }
})

Vue.config.productionTip = false

Vue.use(VueMask);
Vue.use(VueCurrencyInput);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
