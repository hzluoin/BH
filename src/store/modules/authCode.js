import Vue from 'vue'
const state = {
  authCodeTimer: {}
}

const getters = {
}

const mutations = {
  setAuthCodeTimer: (state, type) => {
    state.authCodeTimer[type] = setTimeout(function () {
      state.authCodeTimer[type] = null
    }, 60000)
  }
}

const actions = {
  sendTelCode ({state, getters, commit, dispatch}, type, telephoneNumber) {
    return new Promise((resolve, reject) => {
      dispatch('encryptConnection', {
        url: '/auth/getTelephoneAuthCode',
        data: {
          telephone: telephoneNumber || getters.getUser.telephone,
          type: type
        }
      }).then(response => {
        resolve(response)
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'E0807':
            Vue.$message.error('短信发送过于频繁')
            break
          default:
            Vue.$message.error('短信发送失败' + response.body.msg)
        }
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
