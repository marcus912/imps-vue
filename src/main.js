// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import Meta from 'vue-meta'
import Vuex from 'vuex'
import VeeValidate, { Validator } from 'vee-validate'
import BootstrapVue from 'bootstrap-vue'
import VuejsDialog from 'vuejs-dialog'
import tw from 'vee-validate/dist/locale/zh_TW'
import 'whatwg-fetch'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.use(Meta)
Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.use(VeeValidate)
Vue.use(VuejsDialog, {
  html: false,
  loader: false,
  okText: '是',
  cancelText: '否',
  animation: 'fade',
  type: 'basic'
})
Validator.localize('zh_TW', tw)
Vue.use(iView)
Vue.prototype.$Message.config({
  top: 24,
  duration: 5
})

Vue.config.productionTip = false
require('../node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  methods: {

  }
})
