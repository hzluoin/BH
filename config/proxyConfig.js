module.exports = {
  proxyList: {
    '/api/sso/**': {
      target: 'http://192.168.1.249:8761',
      changeOrigin: true,
      pathRewrite: {
        '^/api/sso': ''
      }
    },
    '/api/**': {
      target: 'http://192.168.1.249:8766',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    },
    '/websocket/**': {
      target: 'ws://192.168.1.249:8999',
      changeOrigin: true,
      ws: true
    }
  }
}
