import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'
const fb = require('./firebaseConfig')

Vue.use(require('vue-moment'))

Vue.config.productionTip = false

let app
fb.auth.onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
})
