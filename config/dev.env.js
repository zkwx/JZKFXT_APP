var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    //BASE_API: '"http://192.168.180.178:8081/api"',
    BASE_API: '"http://localhost:8081/api"',
})