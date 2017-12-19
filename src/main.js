// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import FastClick from 'fastclick'
import router from './router/index'
import axios from 'axios'
import http from '@/http/http.js'
import api from '@/http/api.js'
import utils from './utils/index.js'
import '@/assets/font-awesome/css/font-awesome.min.css'
FastClick.attach(document.body)

Vue.config.productionTip = true

Vue.prototype.$axios = axios
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$utils = utils

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app-box')