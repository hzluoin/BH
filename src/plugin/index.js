import Vue from 'vue'
import './Date'
import './Number'
import './String'
import BHCryp from './cryp'
import RegExp from './RegExp'
import NumberFormat from './NumberFormat'
import KeyboardListener from './KeyboardListener'
import BigNumber from './BigNumber'
import Status from './Status'

Vue.use(BHCryp)
Vue.use(RegExp)
Vue.use(NumberFormat)
Vue.use(KeyboardListener)
Vue.use(BigNumber)
Vue.use(Status)
