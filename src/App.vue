<template>
  <div id="app">
    <router-view v-wechat-title="getTitle"></router-view>
  </div>
</template>

<script>
export default {
  computed: {
    getTitle () {
      // 注册有礼的标题
      if (this.$route.name === 'Activity') {
        return '抽奖活动'
      }
      const messages = this.$i18n.messages
      const locale = this.$i18n.locale
      return messages[locale].title.Description
    },
    user () {
      return this.$store.getters.getUser
    },
    loginStatus () {
      return this.$store.getters.getUser.loginStatus
    },
    wallet () {
      return this.$store.getters.getWalletJson
    }
  },
  watch: {
    loginStatus () {
      this.$store.dispatch('createWebSocket', this.user.userId).then()
    },
    wallet () {
      for (let symbol in this.wallet) {
        if (!this.wallet[symbol]['path']) {
          this.$store.dispatch('createWallet', {coin: symbol}).then()
        }
      }
    }
  },
  created () {
    // 创建websocket
    this.$store.dispatch('createWebSocket', this.user.userId).then()
    // 初始化
    this.$store.dispatch('qryAllCoinDetail').then(() => {}, response => {})
    this.$store.dispatch('qryAllCoinPrice').then(() => {}, response => {})
    // 开启友盟统计
    if (process.env.NODE_ENV !== 'development') {
      var cnzzProtocol = ((document.location.protocol === 'https:') ? ' https://' : ' http://')
      document.write(unescape("%3Cspan id='cnzz_stat_icon_1274113368'%3E%3C/span%3E%3Cscript src='" + cnzzProtocol + "s19.cnzz.com/z_stat.php%3Fid%3D1274113368%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"))
    }
    this.$store.commit('setScreenWidth', window.innerWidth)
    this.$store.commit('setScreenHeight', window.innerHeight)
  },
  mounted () {
    // 增加webSocket消息订单渠道监听
    this.$store.commit('setWSChannel', {
      channelId: '1',
      funcId: 'app',
      func: data => {
        const title = '8币汇的订单消息!'
        const content = this.Status.convert('PushOrderMessage', data['oStatus'])
        if (window.Notification && window.Notification.permission !== 'denied') {
          // 支持
          Notification.requestPermission(function (status) {
            let notification = new Notification(title, { body: content })
            notification.onerror = () => {
              this.$notify({
                title: title,
                message: content
              })
            }
          })
        } else {
          // 不支持
          this.$notify({
            title: title,
            message: content
          })
        }
      }
    })
    // 增加webSocket消息行情渠道监听
    this.$store.commit('setWSChannel', {
      channelId: '2',
      funcId: 'app',
      func: data => {
        this.$store.commit('setAllCoin', data['priceData'])
      }
    })
  }
}
</script>

<style>
</style>
