import i18n from '../i18n/i18n'
import router from '../router'
import store from '../store'
import vueCookies from 'vue-cookies'
import Vue from 'vue'

let Limit = {
  filter () {
    router.beforeEach((to, from, next) => {
      // 1.语言
      if (vueCookies.get('language') && (vueCookies.get('language') !== i18n.locale)) {
        i18n.locale = vueCookies.get('language')
      }
      // 2.刷新页面时，读取localStorage登录信息
      let userInfo
      if (vueCookies.get('login_status') && !store.getters.getUser.loginStatus && (userInfo = JSON.parse(localStorage.getItem('user')))) {
        store.commit('setUser', userInfo)
      }
      // 登录超时处理
      if (store.getters.getLoginStatus && !vueCookies.get('login_status')) {
        store.dispatch('delUserInfo')
        Vue.prototype.$message('登录已失效')
      }
      // 3.登录权限校验
      if (to.matched.some(record => record.meta.requiresAuth)) {
        // this route requires auth, check if logged in
        // if not, redirect to login page.
        if (vueCookies.get('login_status')) {
          next()
        } else {
          next({
            path: '/login',
            query: { redirect: to.fullPath }
          })
        }
      } else {
        next() // 确保一定要调用 next()
      }
    })
  }
}

export default Limit
