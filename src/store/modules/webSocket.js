const state = {
  webSocket: null,
  channel: {}
}
const getters = {

}
const mutations = {
  setWebSocket (state, ws) {
    state.webSocket = ws
  },
  setWSChannel (state, {channelId, funcId, func}) {
    if (state.channel[channelId]) {
      state.channel[channelId][funcId] = func
    } else {
      state.channel[channelId] = {}
      state.channel[channelId][funcId] = func
    }
  },
  delWSChannel (state, {channelId, funcId}) {
    if (state.channel[channelId]) {
      delete state.channel[channelId][funcId]
    }
  }
}
const actions = {
  createWebSocket ({state, commit, dispatch}, userId) {
    let protocol = 'ws'
    if (process.env.NODE_ENV !== 'development') {
      protocol = 'wss'
    }
    const host = protocol + '://' + window.location.host + '/websocket/' + (userId || 'null')
    if (state.webSocket) {
      state.webSocket.close()
      commit('setWebSocket', null)
    }
    const ws = new WebSocket(host)
    commit('setWebSocket', ws)
    ws.onerror = function () {
      commit('setWebSocket', null)
      // 间隔三秒重连
      setTimeout(() => {
        dispatch('createWebSocket', userId)
      }, 3000)
    }
    ws.onclose = function () {
      commit('setWebSocket', null)
    }
    ws.onmessage = function (evt) {
      // {"channel":"1","oId":1579,"oStatus":"1"}
      let data
      try {
        data = JSON.parse(evt.data)
      } catch (e) {
        return
      }
      const funcJson = state.channel[data.channel] || {}
      for (let key in funcJson) {
        funcJson[key](data)
      }
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
