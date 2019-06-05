import Vue from 'vue'
import store from '../store'
import router from '../router'
import vueCookies from 'vue-cookies'

let Http = {
  filter () {
    // 请求数据格式
    Vue.http.options.emulateJSON = true
    // 请求超时时间
    Vue.http.options.timeout = 60000
    // 请求处理、和响应处理
    Vue.http.interceptors.push((request, next) => {
      // IE防缓存
      request.headers.set('Cache-Control', 'no-cache')
      request.headers.set('Pragma', 'no-cache')
      request.url = '/api' + request.url
      let timeout = null
      if (request.timeout) {
        timeout = setTimeout(() => {
          // request.respondWith(request.body, {
          //   status: 404,
          //   statusText: 'Not found'
          // })
          request.abort()
        }, request.timeout)
      }
      // 2.响应处理
      next((response) => {
        // 2.1登录状态下重置登录有效时间:半小时
        if (vueCookies.get('login_status') && !/sso/.test(request.url)) {
          vueCookies.set('login_status', true, 1800, '/')
        }
        // 2.2清除超时时间
        clearTimeout(timeout)
        // 2.4处理响应码
        if (parseInt(response.status) === 200) {
          // 2.4.1服务器正常响应
          const code = parseInt(response.body.code) || response.body.code
          switch (code) {
            case 1:
              store.dispatch('delUserInfo')
              Vue.prototype.$message('您的账号已在别处登陆')
              response.ok = false
              response.status = 666
              response.statusText = response.body.msg
              router.push({name: 'Login'})
              break
            // 正确
            case 200:
              break
            case NaN:
              break
            // 登录超时
            case 300:
              store.dispatch('delUserInfo')
              Vue.prototype.$message('登录已超时')
              response.ok = false
              response.status = 666
              response.statusText = response.body.msg
              router.push({name: 'Login'})
              break
            case 400:
              Vue.prototype.$message.error(response.body.msg)
              break
            case 500:
              Vue.prototype.$message.error('请尝试刷新页面')
              response.ok = false
              response.status = 666
              response.statusText = '请尝试刷新页面'
              response.body.msg = '请尝试刷新页面'
              break
            case 501:
              Vue.prototype.$message.error(response.body.msg)
              break
            case 'NO_18':
              window.location.reload()
              break
            default:
              // 将其他自定义错误进行转换
              response.ok = false
              response.status = response.body.code
              response.statusText = response.body.msg
              break
          }
        } else {
          // 2.4.2服务器响应出错
          // 清除公钥
          store.commit('clearRSAPublicKey')
          store.commit('clearSSORSAPublicKey')
          const code = parseInt(response.status)
          switch (code) {
            case 0:
              response.statusText = '请尝试刷新页面'
              Vue.prototype.$message.error(response.statusText)
              break
            default:
              response.statusText = '请尝试刷新页面：' + response.status + '/' + response.statusText
              Vue.prototype.$message.error(response.statusText)
              break
          }
        }
        return response
      })
    })
  }
}

export default Http
