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
    },
    // {
    //     path: '/register',
    //     component: resolve => require(['page/register'], resolve)
    // }, 
    {
        path: '/sign',
        component: resolve => require(['@/components/AppSign'], resolve),
    }, {
        path: '/ExamList/:examBy/:name/:displayType',
        component: resolve => require(['page/ExamList'], resolve),
        props: true
    }, {
        path: '/DisabledList/:examBy/:name/:displayType',
        component: resolve => require(['page/DisabledList'], resolve),
        props: true
    }, {
        //评估试题
        path: '/ExamDetail',
        component: resolve => require(['page/ExamDetail'], resolve),
    }, {
        path: '/ExamDetail/:disabledID/:examID/:state',
        component: resolve => require(['page/ExamDetail'], resolve),
        props: true,
        meta: { navShow: true, role: [1, 2, 12] },
    }, {
        //评估审核
        path: '/ExamAudit',
        component: resolve => require(['page/ExamAudit'], resolve),
    }, {
        path: '/ExamAudit/:disabledID/:examID/:state',
        component: resolve => require(['page/ExamAudit'], resolve),
        props: true
    }, {
        //辅具服务
        path: '/AssistService',
        component: resolve => require(['page/AssistService'], resolve),
    }, {
        path: '/AssistService/:disabledID/:examID/:state',
        component: resolve => require(['page/AssistService'], resolve),
        props: true
    }, {
        //辅具回访
        path: '/AssistVisit',
        component: resolve => require(['page/AssistVisit'], resolve),
    }, {
        path: '/AssistVisit/:disabledID/:examID/:state',
        component: resolve => require(['page/AssistVisit'], resolve),
        props: true,
        meta: { navShow: true, role: [1, 2, 12] },
    }, {
        //机构评估
        path: '/JiGou',
        component: resolve => require(['page/JiGou'], resolve),
    }, {
        path: '/JiGou/:disabledID/:examID/:state',
        component: resolve => require(['page/JiGou'], resolve),
        props: true,
        meta: { navShow: true, role: [3, 4, 5, 6, 7, 8, 9, 12] },
    }, {
        //康复服务
        path: '/FuWu',
        component: resolve => require(['page/FuWu'], resolve),
    }, {
        path: '/FuWu/:disabledID/:examID/:state',
        component: resolve => require(['page/FuWu'], resolve),
        props: true
    }, {
        //康复入户
        path: '/KangFuRuHuHome',
        component: resolve => require(['KangFuRuHu/KangFuRuHuHome'], resolve),
        meta: { navShow: true, role: [1, 2, 12] },
    }, {
        path: '/KangFuRuHuDetail',
        component: resolve => require(['KangFuRuHu/KangFuRuHuDetail'], resolve),
    }, {
        path: '/KangFuRuHuDetail/:disabledID',
        component: resolve => require(['KangFuRuHu/KangFuRuHuDetail'], resolve),
        props: true
    }, {
        //辅具评估
        path: '/FuJuPingGuHome',
        component: resolve => require(['FuJuPingGu/FuJuPingGuHome'], resolve),
        meta: { navShow: true, role: [1, 2, 12] },
    }, {
        //机构评估
        path: '/JiGouPingGuHome',
        component: resolve => require(['JiGouPingGu/JiGouPingGuHome'], resolve),
        meta: { navShow: true, role: [3, 4, 5, 6, 7, 8, 9, 12] },
    }, {
        //综合康复
        path: '/ZongHeKangFuHome',
        component: resolve => require(['ZongHeKangFu/ZongHeKangFuHome'], resolve),
        meta: { navShow: true, role: [10, 11, 12] },
    }, {
        //服务回访
        path: '/FuWuHuiFangHome',
        component: resolve => require(['FuWuHuiFang/FuWuHuiFangHome'], resolve),
        meta: { navShow: true, role: [1, 2, 12] },
    }, {
        //我
        path: '/profile',
        component: resolve => require(['page/profile'], resolve),
        meta: { navShow: true },
    }, {
        path: '/profile/edit',
        component: resolve => require(['page/profileedit'], resolve),
    }, {
        path: '/profile/all',
        component: resolve => require(['page/profileall'], resolve),
    }, {
        path: '/profileDetail',
        component: resolve => require(['page/profileDetail'], resolve),
    }, {
        path: '/profile/profileDetail',
        component: resolve => require(['page/profileDetail'], resolve),
    }, {
        path: '/profileDetail/:userID',
        component: resolve => require(['page/profileDetail'], resolve),
        props: true
    },
    ]
});