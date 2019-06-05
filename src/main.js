import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import VueWechatTitle from 'vue-wechat-title'
import store from './store'
import vueCookies from 'vue-cookies'
import './assets/iconfont/iconfont.css'
import './assets/css/normalize.css'
import './assets/css/common.css'
import './assets/css/theme/default/index.css'
import i18n from './i18n/i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import echarts from 'echarts'
import 'particles.js'
import Filter from './filter/index'
import VueClipboard2 from 'vue-clipboard2'
import VueQr from 'vue-qr'
import 'swiper/dist/css/swiper.min.css'
// 加载自定义加密插件、图形转换插件、正则校验插件
import './plugin/index'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueResource)
Vue.use(vueCookies)
Vue.use(VueWechatTitle)
Vue.use(ElementUI)
Vue.use(echarts)
Vue.use(VueClipboard2)
Vue.use(VueQr)
/* eslint-disable no-new */

// 加载过滤器
Filter.filter()

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
