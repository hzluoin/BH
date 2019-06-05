import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import screen from './modules/screen'
import coin from './modules/coin'
import wallet from './modules/wallet'
import EncrypedConnection from './modules/encrypedConnection'
import EncrypedConnectionSSO from './modules/encrypedConnectionSSO'
import webSocket from './modules/webSocket'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    screen,
    coin,
    wallet,
    EncrypedConnection,
    EncrypedConnectionSSO,
    webSocket
  }
})
