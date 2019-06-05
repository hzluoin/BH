import Vue from 'vue'

const state = {
  userId: '',
  // 头像
  headImage: '',
  // 登录状态
  loginStatus: false,
  // 账户状态
  accountStatus: '',
  // 邮箱
  email: '',
  desensitizationEmail: '',
  // 昵称
  nickname: '',
  // 手机号码
  countryCode: '',
  telephone: '',
  desensitizationTelephone: '',
  // 姓名
  username: '',
  desensitizationUsername: '',
  // 认证类型
  authenticationType: '',
  // google认证状态
  googleAuthenticator: '',
  // 实名认证等级
  identityAuthenticator: '',
  // 实名认证失败原因
  identityAuthenticationFailedReason: '',
  // 资金密码状态
  fundPassword: '',
  // 登录密码等级
  passwordLevel: '',
  // 银行账户
  bankcard: '',
  desensitizationBankcard: '',
  bankUserName: '',
  bankOfDeposit: '',
  branches: '',
  isOpenBank: '',
  // 微信账号
  isOpenWechat: '',
  wechat: '',
  desensitizationWechat: '',
  // 支付宝账号
  isOpenAlipay: '',
  alipay: '',
  desensitizationAlipay: '',
  // PayPal账号
  isOpenPaypal: '',
  paypal: '',
  paypalName: '',
  paypalAccount: '',
  desensitizationPayPal: '',
  // 邀请码
  inviteeCode: '',
  // 邀请人
  inviteAccount: '',
  // 查询用户信息的http连接
  queryUserInfoHttp: null
}
const getters = {
  getUser: state => {
    return state
  },
  getLoginStatus: state => {
    return state.loginStatus
  }
}
const mutations = {
  setUser: (state, user) => {
    const cacheLocal = user.cacheLocal
    delete user.cacheLocal
    for (let key in user) {
      state[key] = user[key]
    }
    // 设置脱敏数据
    // 姓名
    if (user.username) {
      if (user.username.length < 3) {
        state.desensitizationUsername = user.username[0] + '*'
      } else {
        state.desensitizationUsername = user.username[0] + '*' + user.username[user.username.length - 1]
      }
    }
    // 邮箱
    if (user.email) {
      state.desensitizationEmail = user.email.substr(0, 3) + '****' + user.email.substr(user.email.indexOf('@'))
    }
    // 手机
    if (user.telephone) {
      const start = user.telephone.substr(0, 3)
      const end = user.telephone.substr(7, user.telephone.length)
      state.desensitizationTelephone = start + '****' + end
    }
    // 微信
    if (user.wechat) {
      const start = user.wechat.substr(0, 3)
      const end = user.wechat.substr(user.wechat.length - 3, user.wechat.length)
      state.desensitizationWechat = start + ' **** ' + end
    }
    // 支付宝
    if (user.alipay) {
      const start = user.alipay.substr(0, 3)
      const end = user.alipay.substr(user.alipay.length - 3, user.alipay.length)
      state.desensitizationAlipay = start + ' **** ' + end
    }
    // 银行卡
    if (user.bankcard) {
      const start = user.bankcard.substr(0, 4)
      const end = user.bankcard.substr(user.bankcard.length - 4, user.bankcard.length)
      state.desensitizationBankcard = start + ' **** **** ' + end
    }
    // PayPal
    if (user.paypal) {
      const start = user.paypal.substr(0, 3)
      const end = user.paypal.substr(user.paypal.length - 3, user.paypal.length)
      state.desensitizationPayPal = start + ' **** ' + end
    }
    if (cacheLocal) {
      // cookie中保存数据有效期，同浏览器生命周期同步
      Vue.cookies.set('validLocalStorage', true, '0', '/')
      // localStorage保存数据
      localStorage.setItem('user', JSON.stringify(state))
    }
  },
  delUser (state) {
    for (let i in state) {
      state[i] = undefined
    }
  },
  setQueryUserInfoHttp (state, http) {
    state.queryUserInfoHttp = http
  }
}
const actions = {
  login: ({commit, dispatch}, data) => {
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/userinfo/loginUI',
        data: data
      }).then(response => {
        // 登录有效时间半小时
        Vue.cookies.set('login_status', true, 1800, '/')
        commit('setUser', {
          loginStatus: true,
          telephone: data.telephone,
          email: data.email,
          userId: response.body.userId,
          cacheLocal: true
        })
        resolve(response)
      }, response => {
        reject(response)
      })
    })
  },
  logout ({dispatch}) {
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/userinfo/logOutUI',
        data: {}
      }).then(response => {
        dispatch('delUserInfo')
        resolve(response)
      }, response => {
        reject(response)
      })
    })
  },
  delUserInfo ({commit}) {
    Vue.cookies.remove('login_status', '/')
    // cookie中保存数据有效期，同浏览器生命周期同步
    Vue.cookies.remove('validLocalStorage', '/')
    // localStorage保存数据
    localStorage.removeItem('user')
    commit('delUser')
    commit('clearRSAPublicKey')
    commit('clearSSORSAPublicKey')
    commit('clearWallet')
  },
  qryUserInfo ({state, commit, dispatch}) {
    return new Promise((resolve, reject) => {
      if (!state.queryUserInfoHttp) {
        commit('setQueryUserInfoHttp', dispatch('encryptConnection', {
          url: '/userinfo/queryUserInfoUI',
          data: {}
        }))
      }
      state.queryUserInfoHttp.then(response => {
        commit('setQueryUserInfoHttp', null)
        const data = response.body.data
        const user = {
          // 账户状态
          accountStatus: data['STATUS'],
          // 邮箱
          email: data.email,
          // 头像
          headImage: data['headimg'],
          // 昵称
          nickname: data.nickname,
          // 手机号码
          countryCode: data.countryCode,
          telephone: data.telephone,
          // 姓名
          username: data.username,
          // 认证类型
          authenticationType: data.authenticationType,
          // google认证状态
          googleAuthenticator: parseInt(data.googleAuthenticator),
          // 实名认证等级
          identityAuthenticator: Number(data.identityAuthenticator),
          identityAuthenticationFailedReason: data['unPassReason'],
          // 资金密码状态
          fundPassword: data.fundPassword,
          // 登录密码等级
          passwordLevel: parseInt(data.passwordLevel),
          // 银行账户绑定数量
          bankcard: data.bankcard,
          // 微信账号
          wechat: data.wechat,
          // 支付宝账号
          alipay: data.alipay,
          // PayPal账号
          paypal: data.paypal,
          // 设置银行账号
          isOpenBank: parseInt(data.isOpenBank),
          // 设置支付宝账号
          isOpenAlipay: parseInt(data.isOpenAlipay),
          // 设置微信账号
          isOpenWechat: parseInt(data.isOpenWechat),
          // 设置Paypal
          isOpenPaypal: parseInt(data.isOpenPaypal),
          inviteeCode: data.inviterCode,
          inviteAccount: data.inviteAccount,
          cacheLocal: true
        }
        commit('setUser', user)
        resolve(response)
      }, response => {
        commit('setQueryUserInfoHttp', null)
        reject(response)
      })
    })
  },
  updateUserHeadImage ({commit, dispatch}, {headImage}) {
    return new Promise((resolve, reject) => {
      Vue.http.post('/headPicture/setUI', {
        picture: headImage.toString().split(',')[1]
      }).then(response => {
        commit('setUser', {
          headImage: headImage
        })
        resolve(response)
      }, response => {
        reject(response)
      })
    })
  },
  updateUserAliPayStatus ({state, commit, dispatch}) {
    commit('setUser', {
      isOpenAlipay: state.isOpenAlipay === 1 ? 2 : 1
    })
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/userinfo/changeAlipayPayStatusUI',
        data: {}
      }).then(response => {
        resolve(response)
      }, response => {
        commit('setUser', {
          isOpenAlipay: state.isOpenAlipay === 1 ? 2 : 1
        })
        reject(response)
      })
    })
  },
  updateUserWeChatStatus ({state, commit, dispatch}) {
    commit('setUser', {
      isOpenWechat: state.isOpenWechat === 1 ? 2 : 1
    })
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/userinfo/changeWechatpayStatusUI',
        data: {}
      }).then(response => {
        resolve(response)
      }, response => {
        commit('setUser', {
          isOpenWechat: state.isOpenWechat === 1 ? 2 : 1
        })
        reject(response)
      })
    })
  },
  updateUserBankStatus ({state, commit, dispatch}) {
    commit('setUser', {
      isOpenBank: state.isOpenBank === 1 ? 2 : 1
    })
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/userinfo/changeBankpayStatusUI',
        data: {}
      }).then(response => {
        resolve(response)
      }, response => {
        commit('setUser', {
          isOpenBank: state.isOpenBank === 1 ? 2 : 1
        })
        reject(response)
      })
    })
  },
  updateUserPayPalStatus ({state, commit, dispatch}) {
    commit('setUser', {
      isOpenPaypal: state.isOpenPaypal === 1 ? 2 : 1
    })
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/userinfo/changePaypalPayStatusUI',
        data: {}
      }).then(response => {
        resolve(response)
      }, response => {
        commit('setUser', {
          isOpenPaypal: state.isOpenPaypal === 1 ? 2 : 1
        })
        reject(response)
      })
    })
  },
  qryUserBankInfo ({commit, dispatch}) {
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/bank/queryUI'
      }).then(response => {
        const data = response.body.data
        const bankcard = {
          bankUserName: data['UserName'],
          bankCard: data['BankAccount'],
          bankOfDeposit: data['BankName'],
          branches: data['BankDot']
        }
        commit('setUser', bankcard)
        resolve(response)
      }, response => {
        reject(response)
      })
    })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
