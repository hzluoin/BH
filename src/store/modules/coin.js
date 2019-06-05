import Vue from 'vue'
import BigNumber from 'bignumber.js'

const state = {
  // 平台币种详情数据：全部(接口返回数据)
  // {"BTC": {
  //   "symbol": "ADC",
  //   "assetCode": "ADC",
  //   "assetName": "Android chain",
  //   "platformRate": 0.001,
  //   "vipfPlatformRate": 0.001,
  //   "viptPlatformRate": 0.001,
  //   "contractAddress": "0x1e41a55030e0d0794abfb6dced22e6c7d18d8247",
  //   "miningFee": 10.0,
  //   "balance": "0",
  //   "maximum": "200",
  //   "status": 1,
  //   "createDate": 1545372844000,
  //   "updateDate": 1545372846000,
  //   "isCashTran": 1,
  //   "isRecharge": 1,
  //   "isMention": 1,
  //   "createBy": null,
  //   "isHot": null,
  //   "minimumCoin": null
  // }}
  allCoinDetail: {},
  // 场外交易名单
  otcList: '',
  // 可提币名单
  mentionList: '',
  // 可充币名单
  topUpList: '',
  // 行情数据：全部(改造后数据JSON)
  // {"BTC": {
  //   currency:"BTC"
  //   current_price:"27398.9120661419"
  //   high_24h:"27863.228192455"
  //   low_24h:"27156.2995558358"
  //   price_change_24h:"67.9407266954404"
  // }}
  allCoinPrice: {},
  rate: {
    'base': 'CNY',
    'timestamp': 1526649591621,
    'rates': {
      'USD': 1
    }
  }
}

const getters = {
  getAllCoinDetail (state) {
    return state.allCoinDetail
  },
  getAllCoinPrice (state) {
    return state.allCoinPrice
  },
  // 场外交易默认币种
  getOtcDefaultCoin (state) {
    const otcListRegExp = new RegExp(state.otcList)
    const allCoinDetail = state.allCoinDetail || {}
    for (let key in allCoinDetail) {
      // 筛选可进行场外交易的数据
      if (otcListRegExp.test(key)) {
        return key
      }
    }
    return undefined
  },
  // 场外交易列表
  // {"BTC": {
  //   symbol: 'BTC',
  //   price: 0,
  //   change_daily: 0
  // }}
  getOtcCoin (state) {
    const otcListRegExp = new RegExp(state.otcList)
    const allCoinDetail = state.allCoinDetail || {}
    const allCoinPrice = state.allCoinPrice || {}
    const otcCoin = {}
    for (let key in allCoinDetail) {
      // 筛选可进行场外交易的数据
      if (otcListRegExp.test(key)) {
        if (allCoinPrice[key]) {
          // 有行情价格
          otcCoin[key] = {
            'symbol': key,
            'price': allCoinPrice[key]['price'] || 0,
            'change_daily': allCoinPrice[key]['change_daily'] || 0,
            'up': Number(allCoinPrice[key]['change_daily']) >= 0,
            'down': Number(allCoinPrice[key]['change_daily']) < 0
          }
        } else {
          // 无行情价格
          otcCoin[key] = {
            'symbol': key,
            'price': 0,
            'change_daily': 0,
            'up': true,
            'down': false
          }
        }
      }
    }
    return otcCoin
  },
  // 可提币列表: 币种、最小提币数量、旷工费、最大单笔提币数量、备注
  // {"BTC": {
  //   symbol: 'BTC',
  //   minimumCoin: 0,
  //   miningFee: 0,
  //   maximum: 0,
  //   isRemark: false
  // }}
  getMentionCoin (state) {
    const mentionListRegExp = new RegExp(state.mentionList)
    const allCoinDetail = state.allCoinDetail
    const mentionCoin = {}
    for (let key in allCoinDetail) {
      // 筛选可进行提币的数据
      if (mentionListRegExp.test(key)) {
        mentionCoin[key] = {
          'symbol': key,
          'minimumCoin': allCoinDetail[key]['minimumCoin'] || 0,
          'miningFee': allCoinDetail[key]['miningFee'] || 0,
          'maximum': allCoinDetail[key]['maximum'] || 0,
          'isRemark': /^1$/.test(allCoinDetail[key]['isRemark'])
        }
      }
    }
    return mentionCoin
  },
  // 可充币列表: 最小充币数量，旷工费
  // {"BTC": {
  //   symbol: 'BTC',
  //   minimumCoin: 0,
  //   miningFee: 0,
  //   maximum: 0,
  //   isRemark: false
  // }}
  getTopUpCoin (state) {
    const topUpListRegExp = new RegExp(state.topUpList)
    const allCoinDetail = state.allCoinDetail
    const topUpCoin = {}
    for (let key in allCoinDetail) {
      // 筛选可进行充币的数据
      if (topUpListRegExp.test(key)) {
        topUpCoin[key] = {
          'symbol': key,
          'minimumRecharge': allCoinDetail[key]['minimumRecharge'] || 0,
          'isRemark': /^1$/.test(allCoinDetail[key]['isRemark'])
        }
      }
    }
    return topUpCoin
  },
  // 价格转换
  convert (state) {
    return function (currency, _price) {
      // 汇率
      const rate = new BigNumber(state.rate.rates[currency] || 0)
      // 价格
      const price = new BigNumber(_price || 0)
      return price.multipliedBy(rate).toNumber()
    }
  },
  // 计算估值
  calculate (state) {
    return function (coin, _number) {
      // 币种单价
      const priceNumber = state.allCoinPrice[coin] ? (state.allCoinPrice[coin]['current_price'] || 0) : 0
      const price = new BigNumber(priceNumber)
      // 币种数量
      const number = new BigNumber(_number)
      return number.multipliedBy(price).toNumber()
    }
  },
  getRate (state) {
    return state.rate
  }
}

const mutations = {
  setOtcList (state, list) {
    state.otcList = list
  },
  setMentionList (state, list) {
    state.mentionList = list
  },
  setTopUpList (state, list) {
    state.topUpList = list
  },
  setAllCoinDetail (state, list) {
    state.allCoinDetail = list
  },
  setAllCoin (state, allCoinPrice) {
    // 将行情数组转成JSON格式
    let priceJson = {}
    for (let i in allCoinPrice) {
      let newKey = allCoinPrice[i]['currency']
      priceJson[newKey] = allCoinPrice[i]
      allCoinPrice[i]['symbol'] = newKey
      // 价格只精确到小数点后四位
      priceJson[newKey]['price'] = Number(priceJson[newKey]['current_price']).cut(4)
      // 新增24小时涨跌比例属性
      priceJson[newKey]['change_daily'] = Number(allCoinPrice[i]['price_change_24h'] / allCoinPrice[i]['high_24h'] * 100).cut(2)
    }
    state.allCoinPrice = priceJson
  }
}

const actions = {
  qryAllCoinDetail ({getters, commit}) {
    // 全部币种详情
    if (JSON.stringify(getters.getAllCoinDetail) === '{}') {
      Vue.http.get('/digitalAssets/findAllAssetUI').then(response => {
        // 币种详情列表
        let allCoinDetail = response.body.data
        let coinJson = {}
        let otcList = ''
        let mentionList = ''
        let topUpList = ''
        for (let i in allCoinDetail) {
          let newKey = allCoinDetail[i]['assetCode']
          allCoinDetail[i]['symbol'] = newKey
          coinJson[newKey] = allCoinDetail[i]
          if (/1/.test(allCoinDetail[i]['isCashTran'])) {
            otcList += '|^' + newKey + '$'
          }
          if (/1/.test(allCoinDetail[i]['isMention'])) {
            mentionList += '|^' + newKey + '$'
          }
          if (/1/.test(allCoinDetail[i]['isRecharge'])) {
            topUpList += '|^' + newKey + '$'
          }
        }
        commit('setOtcList', otcList.replace(/^\|/, ''))
        commit('setMentionList', mentionList.replace(/^\|/, ''))
        commit('setTopUpList', topUpList.replace(/^\|/, ''))
        commit('setAllCoinDetail', coinJson)
      }, response => {})
    }
  },
  qryAllCoinPrice ({getters, commit}) {
    if (JSON.stringify(getters.getAllCoinPrice) === '{}') {
      Vue.http.get('/digitalAssets/findExPriceUI').then(response => {
        commit('setAllCoin', response.body.data)
      }, response => {})
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
