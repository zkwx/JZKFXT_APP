// 引用axios
var axios = require('axios')
var utils = require('@/utils/index')
    //axios.defaults.timeout = 5000

// 配置默认API接口地址
axios.defaults.baseURL = process.env.BASE_API
    //axios.defaults.baseURL = 'http://118.89.231.50:8081/api'
    // 配置默认发送类型
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//发送前拦截
axios.interceptors.request.use(config => {
        // loading
        // 若是有做鉴权token , 就给头部带上token
        // if (localStorage.token) {
        //     config.headers.Authorization = localStorage.token;
        //   }
        return config
    }, error => {
        return Promise.reject(error.data.error.message)
    })
    //接受前拦截
    // axios.interceptors.response.use(response => {

//     return response;
// }, error => {
//     if (!window.localStorage.getItem("loginUserBaseInfo")) {
//         // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
//         //router.push("/login");
//     }
//     return Promise.reject(error);
// })

// 判断元素类型
function toType(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数 过滤掉值为null得节点
function filterNull(o) {
    for (var key in o) {
        if (o[key] === null) {
            delete o[key]
        }
        if (toType(o[key]) === 'string') {
            o[key] = o[key].trim()
        } else if (toType(o[key]) === 'object') {
            o[key] = filterNull(o[key])
        } else if (toType(o[key]) === 'array') {
            o[key] = filterNull(o[key])
        }
    }
    return o
}
/*
  接口处理函数
  这个函数每个项目都是不一样的，需要根据接口的参数进行调整。
  不同的接口的成功标识和失败提示是不一致的。
  另外，不同的项目的处理方法也是不一致的，这里出错就是简单的alert
*/

function apiAxios(method, url, params) {
    if (params) {
        params = filterNull(params)
    }
    return new Promise((resolve, reject) => {
        axios({
                method: method,
                url: url,
                data: method === 'POST' || method === 'PUT' ? params : null,
                params: method === 'GET' || method === 'DELETE' ? params : null,
            })
            .then(response => {
                if (response.data) {
                    resolve(response.data)
                } else if (response) {
                    resolve(response)
                }
            })
            .catch(err => {
                console.log(err)
                utils.default.AlertErr(err)
                reject(err)
            })
    })
}

// 返回在vue模板中的调用接口
export default {
    get: function(url, params) {
        return apiAxios('GET', url, params)
    },
    post: function(url, params) {
        return apiAxios('POST', url, params)
    },
    put: function(url, params) {
        return apiAxios('PUT', url, params)
    },
    delete: function(url, params) {
        return apiAxios('DELETE', url, params)
    }
}