import Vue from 'vue'
import BigNumber from 'bignumber.js'
import NumberFormat from '../../plugin/NumberFormat'

const state = {
  // 全部钱包列表数据(接口返回)
  // [{
  //   'id': 237473,
  //   'userId': 107298,
  //   'dictionariesId': 'BTM',
  //   'dictionariesName': 'bytom',
  //   'path': '0x747cabe5b984f1f5bc5ad53f4cfbe4c72e730dba',
  //   'balance': 0.0,
  //   'frozenAmount': 0.0,
  //   'url': null,
  //   'createTime': null,
  //   'updateTime': null,
  //   'password': null,
  //   'encrypt': null,
  //   'status': null,
  //   'platformRate': '0.00100000',
  //   'miningFee': '8.00000000'
  // }]
  walletList: null,
  walletJson: null,
  // 有钱的钱包列表数据
  richWalletList: null,
  richWalletJson: null,
  walletHttp: null,
  // 提币地址
  mentionAddress: {}
}
const getters = {
  getWalletList (state) {
    return state.walletList
  },
  getWalletJson (state) {
    return state.walletJson
  },
  getRichWalletList (state) {
    return state.richWalletList
  },
  getRichWalletJson (state) {
    return state.richWalletJson
  },
  getWalletMentionAddress (state) {
    return state.mentionAddress
  }
}
const mutations = {
  setWalletHttp (state, http) {
    state.walletHttp = http
  },
  setWallet (state, allWalletList) {
    const allWalletJson = {}
    const richWalletJson = {}
    const richWalletList = []
    for (let i in allWalletList) {
      const symbol = allWalletList[i]['dictionariesId']
      const wallet = allWalletList[i]
      // 处理余额、冻结、可用余额
      const balance = new BigNumber(wallet['balance'])
      const frozenAmount = new BigNumber(wallet['frozenAmount'])
      wallet['symbol'] = symbol
      wallet['balance'] = NumberFormat.toFixed(balance.toString(), 8)
      wallet['frozenAmount'] = NumberFormat.toFixed(frozenAmount.toString(), 8)
      wallet['availableBalance'] = NumberFormat.toFixed(balance.minus(frozenAmount).toString(), 8)
      allWalletJson[symbol] = wallet
      if (balance > 0) {
        richWalletJson[symbol] = wallet
        richWalletList.push(wallet)
      }
    }
    state.walletJson = allWalletJson
    state.walletList = allWalletList
    state.richWalletJson = richWalletJson
    state.richWalletList = richWalletList
  },
  setWalletByCoin (state, wallet) {
    const symbol = wallet['dictionariesId']
    // 处理余额、冻结、可用余额
    const balance = new BigNumber(wallet['balance'])
    const frozenAmount = new BigNumber(wallet['frozenAmount'])
    wallet['symbol'] = symbol
    wallet['balance'] = NumberFormat.toFixed(balance.toString(), 8)
    wallet['frozenAmount'] = NumberFormat.toFixed(frozenAmount.toString(), 8)
    wallet['availableBalance'] = NumberFormat.toFixed(balance.minus(frozenAmount).toString(), 8)
    if (balance > 0) {
      for (let i in state.richWalletList) {
        if (state.richWalletList[i]['dictionariesId'] === symbol) {
          Vue.set(state.richWalletList, i, wallet)
        }
      }
      Vue.set(state.richWalletJson, symbol, wallet)
    }
    for (let i in state.walletList) {
      if (state.walletList[i]['dictionariesId'] === symbol) {
        Vue.set(state.walletList, i, wallet)
      }
    }
    Vue.set(state.walletJson, symbol, wallet)
  },
  setMentionAddress (state, {coin, addressList}) {
    Vue.set(state.mentionAddress, coin, addressList)
  },
  delMentionAddress (state, {coin, addressId}) {
    const newList = []
    const oldList = state.mentionAddress[coin]
    for (let i in oldList) {
      if (oldList[i].id !== addressId) {
        newList.push(oldList[i])
      }
    }
    Vue.set(state.mentionAddress, coin, newList)
  },
  clearWallet (state) {
    state.walletList = null
    state.walletJson = null
    state.richWalletList = null
    state.richWalletJson = null
    state.walletHttp = null
    state.mentionAddress = {}
  }
}
const actions = {
  qryAllWallet ({state, commit, dispatch}) {
    return new Promise((resolve, reject) => {
      if (state.walletList) {
        resolve()
      } else {
        if (!state.walletHttp) {
          const http = dispatch('encryptConnection', {
            url: '/wallet/selectWalletListUI',
            data: {}
          })
          commit('setWalletHttp', http)
        }
        state.walletHttp.then(response => {
          commit('setWalletHttp', null)
          commit('setWallet', response.body.data)
          resolve()
        }, response => {
          commit('setWalletHttp', null)
          reject(response)
        })
      }
    })
  },
  qryWalletByCoin ({commit, dispatch}, coin) {
    dispatch('encryptConnection', {
      url: '/wallet/selectWalletListUI',
      data: {
        currencyCode: coin
      }
    }).then(response => {
      commit('setWalletByCoin', response.body.data[0])
    }, response => {})
  },
  // 创建钱包
  createWallet ({commit, getters, dispatch}, {coin}) {
    return dispatch('encryptConnection', {
      url: '/wallet/createWalletUI',
      data: {
        currencyCode: coin
      }
    }).then(response => {
      const address = response.body.data
      const wallet = getters.getWalletJson[coin]
      wallet['path'] = address
      commit('setWalletByCoin', wallet)
    }, response => {})
  },
  // 根据币种查询钱包提币地址
  qryWalletMentionAddressByCoin ({state, commit, dispatch}, {coin, forced}) {
    if (!forced && state.mentionAddress[coin]) {
      return
    }
    dispatch('encryptConnection', {
      url: '/commonWalletAddress/findAddressListUI',
      data: {
        currencyCode: coin
      }
    }).then(response => {
      commit('setMentionAddress', {
        coin: coin,
        addressList: response.body.data
      })
    }, response => {})
  },
  // 新增钱包提币地址
  addWalletMentionAddress ({state, commit, dispatch}, {name, coin, tag, address, captcha, type}) {
    return dispatch('encryptConnection', {
      url: '/commonWalletAddress/addCommonAddressUI',
      data: {
        remark: name,
        currencyCode: coin,
        vCode: captcha,
        type: type,
        address: address,
        tag: tag
      }
    })
  },
  // 删除钱包提币地址
  delWalletMentionAddress ({commit, dispatch}, {id, coin}) {
    dispatch('encryptConnection', {
      url: '/commonWalletAddress/delCommonAddressUI',
      data: {
        id: id + ''
      }
    }).then(response => {
      commit('delMentionAddress', {
        coin: coin,
        addressId: id
      })
    }, response => {})
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
