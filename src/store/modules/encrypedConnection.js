import Vue from 'vue'

const state = {
  //  一个同步的HTTP请求,防止多个异步请求时，重复获取服务器RSA公钥
  // RSA加密公钥:从服务器获取，在localStorage做缓存,不在store存储;通过cookie保证和浏览器生命周期一致。
  http: null,
  // 在setter和getter中使用,否则无法正常执行setter和getter
  rsaPublicKey: null
}
const getters = {
  getHttp: state => {
    return state.http
  },
  getRsaPublicKey: state => {
    // 公钥是否是当前会话获取的，公钥保存是否存在，且时间是在30分钟内
    const sessionFlag = Vue.cookies.set('rsaPublicKeySessionFlag', true, '0', '/')
    const publicKey = localStorage.getItem('rsaPublicKey')
    const timeFlag = (+new Date() - Number(localStorage.getItem('rsaPublicKeyTime'))) < (1000 * 60 * 30)
    if (sessionFlag && publicKey && timeFlag) {
      state.rsaPublicKey = publicKey
    } else {
      state.rsaPublicKey = null
      localStorage.removeItem('rsaPublicKey')
      localStorage.removeItem('rsaPublicKeyTime')
    }
    return state.rsaPublicKey
  }
}
const mutations = {
  // 设置同步请求的响应对象
  setHttp: (state, response) => {
    state.http = response
  },
  // 设置从服务器获取的公钥
  setRSAPublicKey: (state, rsaPublicKey) => {
    state.rsaPublicKey = rsaPublicKey
    // cookie中保存公钥周期，同浏览器生命周期同步
    Vue.cookies.set('rsaPublicKeySessionFlag', true, '0', '/')
    // localStorage做数据缓存
    localStorage.setItem('rsaPublicKey', rsaPublicKey)
    localStorage.setItem('rsaPublicKeyTime', (+new Date()) + '')
  },
  // 清除从服务器获取的公钥
  clearRSAPublicKey: state => {
    state.rsaPublicKey = null
    Vue.cookies.remove('rsaPublicKeySessionFlag', '/')
    localStorage.removeItem('rsaPublicKey')
    localStorage.removeItem('rsaPublicKeyTime')
  }
}
const actions = {
  encryptConnection: ({getters, commit, dispatch}, {url, data}) => {
    return new Promise((resolve, reject) => {
      // 获取公钥后刷新、创建DES秘钥并加密数据，建立HTTP连接
      const createConnection = function () {
        // 1.每次请求都产生一个新的本地DES秘钥
        const desKey = Vue.cryp.generateKey(64, false)
        // 2.使用服务器RSA公钥加密DES秘钥
        const desKeyForRSA = Vue.cryp.encryptByRSA(getters.getRsaPublicKey, desKey)
        // 3.使用本地DES秘钥加密数据
        const encryptedData = Vue.cryp.encryptByDES(JSON.stringify(data), desKey)
        // 4.创建http链接
        let http = Vue.http.post(url, {data: encryptedData, mi: desKeyForRSA})
        resolve(http)
        reject(http)
      }
      if (getters.getRsaPublicKey) {
        // 1.本地已存在服务器RSA公钥:创建加密链接
        createConnection()
      } else {
        // 避免创建多个秘钥获取Http请求
        if (!getters.getHttp) {
          commit('setHttp', Vue.http.post('/rsa/get', null))
        }
        getters.getHttp.then(response => {
          commit('setRSAPublicKey', response.body.data.publicKey)
          createConnection()
          commit('setHttp', null)
        }, () => {
          commit('setHttp', null)
        })
      }
    })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
