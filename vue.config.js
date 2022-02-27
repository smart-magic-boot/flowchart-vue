const proxy = require('http-proxy-middleware');

module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      // 配置跨域
      '/flow-data': {
        target: 'http://localhost:8888',//后端接口地址
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/flow-data': '/flow-data'
        }
      }
    }
  },
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {},
      },
      postcss: {
        plugins: [],
      },
    },
    extract: false,
  },
  publicPath: process.env.NODE_ENV === "production" ? "/flowchart-vue" : "/"
};