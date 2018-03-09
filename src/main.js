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
import user from '@/store/user.js'
import '@/assets/font-awesome/css/font-awesome.min.css'
FastClick.attach(document.body)

Vue.config.productionTip = true

Vue.prototype.$axios = axios
Vue.prototype.$http = http
Vue.prototype.$api = api
Vue.prototype.$utils = utils
Vue.prototype.$user = user

/* eslint-disable no-new */
new Vue({
    router,
    render: h => h(App)
}).$mount('#app-box')

router.beforeEach((to, from, next) => {
    // 若userkey不存在并且前往页面不是登陆页面，进入登陆
    // 若userkey存在并且前往登陆页面，进入主页
    let user = JSON.parse(localStorage.getItem('loginUserBaseInfo'));
    let uID = user.I
    let rID = user.R;
    if (!user && to.path !== '/login') {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        })
    } else if (user && to.path === '/login') {
        next({ path: '/' })
    } else if (user && to.path !== '/login' &&from.path !== '/' && to.meta.role && to.meta.role.indexOf(rID) === -1) {
        next(false);
    }
    else {
        next()
    }
})