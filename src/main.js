import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import VueCookies from 'vue-cookies'
import VueClipboard from 'vue-clipboard2'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(VueCookies)
Vue.use(VueClipboard)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

