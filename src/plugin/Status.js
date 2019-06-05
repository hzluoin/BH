import moneyRecord from '../assets/data/moneyRecord'
import pay from '../assets/data/pay'
import order from '../assets/data/order'
import pushOrderMessage from '../assets/data/pushOrderMessage'
import mentionRecord from '../assets/data/mentionRecord'
import topUpRecord from '../assets/data/topUpRecord'

let Status = {
  convert (type, status) {
    switch (type) {
      case 'MoneyRecord':
        return moneyRecord[status] || '状态未知'
      case 'Pay':
        return pay[status] || '状态未知'
      case 'Order':
        return order[status] || '状态未知'
      case 'PushOrderMessage':
        return pushOrderMessage[status] || '状态未知'
      case 'MentionRecord':
        return mentionRecord[status] || '状态未知'
      case 'TopUpRecord':
        return topUpRecord[status] || '状态未知'
    }
  },
  install (Vue, options) {
    Vue.Status = Status
    Vue.prototype.Status = Status
  }
}
export default Status
