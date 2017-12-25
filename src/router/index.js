import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
    /**
     * auth true登录才能访问，false不需要登录，默认true
     */
export default new Router({
    routes: [{
            path: '/',
            component: resolve => require(['page/login'], resolve),
        }, {
            path: '*', //其他页面，强制跳转到登录页面
            component: resolve => require(['page/login'], resolve),
        }, {
            path: '/login',
            component: resolve => require(['page/login'], resolve)
        }, {
            path: '/sign',
            component: resolve => require(['page/sign'], resolve),
        }, {
            path: '/ExamList/:examBy/:name/:displayType',
            component: resolve => require(['page/ExamList'], resolve),
            props: true
        }, {
            path: '/ExamDetail',
            component: resolve => require(['page/ExamDetail'], resolve),
        }, {
            path: '/ExamDetail/:disabledID/:examID/:state',
            component: resolve => require(['page/ExamDetail'], resolve),
            props: true
        }, {
            //康复入户
            path: '/KangFuRuHuHome',
            component: resolve => require(['KangFuRuHu/KangFuRuHuHome'], resolve),
            meta: { navShow: true },
        }, {
            path: '/KangFuRuHuDetail',
            component: resolve => require(['KangFuRuHu/KangFuRuHuDetail'], resolve),
        }, {
            path: '/KangFuRuHuDetail/:id',
            component: resolve => require(['KangFuRuHu/KangFuRuHuDetail'], resolve),
        }, {
            //辅具评估
            path: '/FuJuPingGuHome',
            component: resolve => require(['FuJuPingGu/FuJuPingGuHome'], resolve),
            meta: { navShow: true },
        }, {
            path: '/FuJuPingGuDetail',
            component: resolve => require(['FuJuPingGu/FuJuPingGuDetail'], resolve),
        }, {
            path: '/FuJuPingGuDetail/:id/:targetExamName/:done',
            component: resolve => require(['FuJuPingGu/FuJuPingGuDetail'], resolve),
        }, {
            //机构评估
            path: '/JiGouPingGuHome',
            component: resolve => require(['JiGouPingGu/JiGouPingGuHome'], resolve),
            meta: { navShow: true },
        }, {
            path: '/FuJuShenHeHome',
            component: resolve => require(['JiGouPingGu/FuJuShenHeHome'], resolve),
        }, {
            //综合康复
            path: '/ZongHeKangFuHome',
            component: resolve => require(['ZongHeKangFu/ZongHeKangFuHome'], resolve),
            meta: { navShow: true },
        }, {
            path: '/FuJuFuWuHome',
            component: resolve => require(['ZongHeKangFu/FuJuFuWuHome'], resolve),
        }, {
            path: '/KangFuFuWuHome',
            component: resolve => require(['ZongHeKangFu/KangFuFuWuHome'], resolve),
        }, {
            //服务回访
            path: '/FuWuHuiFangHome',
            component: resolve => require(['FuWuHuiFang/FuWuHuiFangHome'], resolve),
            meta: { navShow: true },
        }, {
            path: '/FuJuFuWuHuiFangHome',
            component: resolve => require(['FuWuHuiFang/FuJuFuWuHuiFangHome'], resolve),
            meta: { navShow: true },
        }, {
            path: '/KangFuFuWuHuiFangHome',
            component: resolve => require(['FuWuHuiFang/KangFuFuWuHuiFangHome'], resolve),
            meta: { navShow: true },
        }, {
            //我
            path: '/profile',
            component: resolve => require(['page/profile'], resolve),
            meta: { navShow: true },
        }, {
            path: '/profile/edit',
            component: resolve => require(['page/profileedit'], resolve),
        },

    ]
})