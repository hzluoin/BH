<template>
  <div class="order_ongoing" v-loading="loading">
    <div v-if="orderList.length !== 0">
      <div class="order_root" v-for="(order, index) in orderList" :key="index" v-loading="order.loading">
        <!--订单头部-->
        <div class="order_header">
          <span>订单号：{{order.startCode}}</span><span class="font_blue">{{order.endCode}}</span>
          <span class="margin_left_b">{{order.exchangeSubject}}：{{order.otherName}}</span>
          <span class="margin_left_c">下单时间：{{order.oCreateTime}}</span>
          <span class="pointer align_right margin_left_a btn_blue" v-if="order.rescissible" @click="cancelOrder(order)">取消订单</span>
          <span class="pointer align_right margin_left_a btn_blue" v-if="order.notice" @click="call(order)">通知对方</span>
          <span class="pointer align_right margin_left_a btn_blue" v-if="order.service" @click="complain(order)">客户投诉</span>
        </div>
        <!--订单内容-->
        <div class="order_body left-float-top">
          <!--1-->
          <div class="tbc-tb-scatter">
            <div class="color_bule">{{order.exchangeTypeName}}</div>
            <div class="color_bule font-bold ft18">{{order.oCoinType}}</div>
          </div>
          <!--2-->
          <div class="center-tb-scatter">
            <div class="detail">
              <ul class="pt30">
                <li>
                  <div>订单金额</div>
                  <div class="detail_font1 color_bule ft14 font-bold">{{order.capitalTag}}{{order.oCapitalCount}}</div>
                </li>
                <li>
                  <div>单价</div>
                  <div class="detail_font1">{{order.capitalTag}}{{order.price}}</div>
                </li>
                <li>
                  <div>交易数量</div>
                  <div class="detail_font1">{{order.oCoinCount}}</div>
                </li>
                <li>
                  <!--买方：1,2买家未付款时可选对方交易方式；3买家已付款时，显示买家所选交易方式（真实交易方式）；-->
                  <!--卖方：6买家未付款时不显示；7，8卖家确认收款时，显示真实交易方式对应的买家交易方式-->
                  <div>对方支付方式</div>
                  <div class="detail_font1">
                    <span v-if="/^1$|^2$/.test(order.status.toString())" class="detail_select" >
                      <el-select v-model="order.pay" @change="qryOtherUserPayInfo(order.showPayUserId, order.pay, order)">
                        <el-option v-for="item in order.payList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                      </el-select>
                    </span>
                    <span v-else-if="/^3$|^7$|^8$|^100$|^101$|^110$|^111$/.test(order.status.toString())">支付方式：{{order.oPayTypeName}}</span>
                  </div>
                </li>
              </ul>
            </div>
            <!--提示-->
            <div class="background_gray">
              <div class="contentBox left-tb-scatter">
                <p>1.下单后请请及时核对付款信息并点击【确认付款】，避免订单超时。 </p>
                <p>2.对于未付款点击【确认付款】的买家将会降低信用权重，甚至冻结账户使用权限。</p>
                <p class="color_red">3.请核对仔细核对支付账号是否与支付信息一致，未填写付款备注，卖家有权取消订单并投诉。</p>
              </div>
            </div>
          </div>
          <!--3-->
          <div>
            <div class="pt30">对方支付信息</div>
            <!--买方：1,2买家未付款时可选对方交易方式；3买家已付款时，显示买家所选交易方式（真实交易方式）；-->
            <!--卖方：6买家未付款时不显示；7，8卖家确认收款时，显示真实交易方式对应的买家交易方式-->
            <div v-if="/^6$/.test(order.status.toString())"></div>
            <!--微信-->
            <div class="pay1" v-else-if="order.pay === '1' || order.oPayType === '1'">
              <el-tooltip effect="light" placement="top-end" transition="el-fade-in-linear">
                <div slot="content">
                  <img class="main hoverImg" :src="getUserPayInfo(order.showPayUserId, 'wechat')['WechatQrcode']">
                </div>
                <img class="main codeImg" :src="getUserPayInfo(order.showPayUserId, 'wechat')['WechatQrcode']" @error="imgHandleError($event, order)" @load="imgHandleLoad($event, order)">
              </el-tooltip>
              <i class="el-icon-refresh" :class="{'icon-rotate': order.codeLoading}" @click="refreshImage($event, order)"></i>
              <div class="main">姓名：{{getUserPayInfo(order.showPayUserId, 'wechat')['WechatName']}}</div>
              <div class="main">账号：{{getUserPayInfo(order.showPayUserId, 'wechat')['WechatAccount']}}</div>
            </div>
            <!--支付宝-->
            <div class="pay1" v-else-if="order.pay === '2' || order.oPayType === '2'">
              <el-tooltip effect="light" placement="top-end" transition="el-fade-in-linear">
                <div slot="content">
                  <img class="main hoverImg" :src="getUserPayInfo(order.showPayUserId, 'alipay')['AlipayQrcode']">
                </div>
                <img class="main codeImg" :src="getUserPayInfo(order.showPayUserId, 'alipay')['AlipayQrcode']" @error="imgHandleError($event, order)" @load="imgHandleLoad($event, order)">
              </el-tooltip>
              <i class="el-icon-refresh" :class="{'icon-rotate': order.codeLoading}" @click="refreshImage($event, order)"></i>
              <div class="main">姓名：{{getUserPayInfo(order.showPayUserId, 'alipay')['AlipayName']}}</div>
              <div class="main">账号：{{getUserPayInfo(order.showPayUserId, 'alipay')['AlipayAccount']}}</div>
            </div>
            <!--银行卡-->
            <div class="pay left-tb-scatter" v-else-if="order.pay === '3' || order.oPayType === '3'">
              <div class="main ml10">姓名：{{getUserPayInfo(order.showPayUserId, 'bankcard')['UserName']}}</div>
              <div class="main ml10">银行：{{getUserPayInfo(order.showPayUserId, 'bankcard')['BankName']}}</div>
              <div class="main ml10">支行：{{getUserPayInfo(order.showPayUserId, 'bankcard')['BankDot']}}</div>
              <div class="main ml10" v-if="getUserPayInfo(order.showPayUserId, 'bankcard')['BankAccount']">
                卡号：{{getUserPayInfo(order.showPayUserId, 'bankcard')['BankAccount']}}
                <a class="copyBtn" v-clipboard:copy="getUserPayInfo(order.showPayUserId, 'bankcard')['BankAccount']" v-clipboard:success="handleSuccess" v-clipboard:error="handleError">
                  <img src="../../assets/images/otc/copyBtn.png" class=" ml5">
                </a>
              </div>
            </div>
            <!--PayPal-->
            <div class="pay left-lr-scatter" v-else-if="order.pay === '4' || order.oPayType === '4'">
              <div class="main ml10 mt10">姓名：{{getUserPayInfo(order.showPayUserId, 'paypal')['PaypalName']}}</div>
              <div class="main ml10 mt10">账户：{{getUserPayInfo(order.showPayUserId, 'paypal')['PaypalAccount']}}</div>
            </div>
            <div class="pay" v-else></div>
          </div>
          <!--4-->
          <div class="center-tb-scatter">
            <!--买家下单状态-->
            <!--4.1买家待付款-->
            <div class="operation" v-if="order.status === 1">
              <p class="redFont">付款备注：{{order.endCode}}
                <el-tooltip class="item" effect="light" placement="left-start" visible-arrow="true">
                  <div slot="content">
                    <otc-e-l-hover></otc-e-l-hover>
                  </div>
                  <img src="../../assets/images/otc/puzzled.png">
                </el-tooltip>
              </p>
              <p class="ft16 color-333"><i class="el-icon-time mr8"></i>付款倒计时...</p>
              <p class="ft14 color-333">
                <span class="time">{{order.countDownTimer.minutes}}</span>分
                <span class="time">{{order.countDownTimer.second}}</span>秒
              </p>
              <p>
                <button class="bh-btn_primary" @click="preparePayMoney(order)">确认付款</button>
              </p>
            </div>
            <!--4.2买家确认付款-->
            <div class="operation mt50" v-else-if="order.status === 2">
              <p class="por center-float-center">
                <input v-model="order.password" v-if="order.showPassword" type="text" placeholder="请输入钱包密码" maxlength="6"/>
                <input v-model="order.password" v-else type="password" placeholder="请输入钱包密码" maxlength="6"/>
                <img class="eyeImg" v-if="order.showPassword" src="../../assets/images/otc/openEye.png"  @click="showOrHide(order)">
                <img class="eyeImg" v-else src="../../assets/images/otc/closeEye.png" @click="showOrHide(order)">
              </p>
              <p>
                <button class="bh-btn_plain" @click="order.status = 1">取消</button>
                <button class="bh-btn_primary" @click="payMoney(order)" :disabled="!/[0-9]{6}/.test(order.password)">确认</button>
              </p>
            </div>
            <!--4.3买家等待卖家确认收款-->
            <div class="operation h100" v-else-if="order.status === 3">
              <!--<div class="h100 w100 tbc-tb-scatter">-->
              <p class="redFont">付款备注：{{order.endCode}}</p>
              <p class="ft16 color-333"><i class="el-icon-time mr8"></i>等待卖家确认收款...</p>
              <p class="ft14 color-333">
                <span class="time">{{order.countDownTimer.minutes}}</span>分
                <span class="time">{{order.countDownTimer.second}}</span>秒
              </p>
              <!--<p>-->
              <!--<span class="ft12 color-999">超时后系统将冻结订单</span>-->
              <!--</p>-->
              <!--</div>-->
            </div>

            <!--卖家下单状态-->
            <!--4.6卖家等待买家付款-->
            <div class="operation" v-else-if="order.status === 6">
              <p class="redFont">付款备注：{{order.endCode}}
                <el-tooltip class="item" effect="light" placement="left-start" visible-arrow="true">
                  <div slot="content">
                    <otc-e-l-hover></otc-e-l-hover>
                  </div>
                  <img src="../../assets/images/otc/puzzled.png">
                </el-tooltip>
              </p>
              <p class="ft16 color-333"><i class="el-icon-time mr8"></i>等待买家付款中...</p>
              <p class="ft14 color-333">
                <span class="time">{{order.countDownTimer.minutes}}</span>分
                <span class="time">{{order.countDownTimer.second}}</span>秒
              </p>
            </div>
            <!--4.7卖家待收款-->
            <div class="operation" v-else-if="order.status === 7">
              <p class="redFont">付款备注：{{order.endCode}}</p>
              <p class="ft16 color-333"><i class="el-icon-time mr8"></i>付款倒计时...</p>
              <p class="ft14 color-333">
                <span class="time">{{order.countDownTimer.minutes}}</span>分
                <span class="time">{{order.countDownTimer.second}}</span>秒
              </p>
              <p>
                <span class="ft12 color-999">超时后系统将冻结订单</span>
              </p>
              <p>
                <span class="hint">待确认收款</span>
                <button class="bh-btn_primary" @click="order.status = 8">确认收款</button>
              </p>
            </div>
            <!--4.8卖家确认收款-->
            <div class="operation mt50" v-else-if="order.status === 8">
              <p class="por center-float-center">
                <input v-model="order.password" v-if="order.showPassword" type="text" placeholder="请输入钱包密码" maxlength="6"/>
                <input v-model="order.password" v-else type="password" placeholder="请输入钱包密码" maxlength="6"/>
                <img class="eyeImg" v-if="order.showPassword" src="../../assets/images/otc/openEye.png"  @click="showOrHide(order)">
                <img class="eyeImg" v-else src="../../assets/images/otc/closeEye.png" @click="showOrHide(order)">
              </p>
              <p>
                <button class="bh-btn_plain" @click="order.status = 7">取消</button>
                <button class="bh-btn_primary" @click="collectMoney(order)" :disabled="!/[0-9]{6}/.test(order.password)">确认</button>
              </p>
            </div>
            <!--4.100 被投诉啦，客服介入中-->
            <div class="operation h100" v-else-if="/^100$|^110$/.test(order.status)">
              <div class="ft14 color-333 color-333 ft16 h100 center-float-center">
                被投诉啦，客服介入中<a class="color_bule" @click="callServer">(联系客服)</a>
              </div>
            </div>
            <!--4.101 卖家确认收款超时-->
            <div class="operation h100" v-else-if="/^101$|^111$/.test(order.status)">
              <div class="ft14 color-333 redFont h100 center-float-center">收款放币超时<a class="color_bule" @click="callServer">(联系客服)</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--暂无订单信息-->
    <div class="bh-order_none" v-else>
      <img src="../../assets/images/order.svg">
      <span class="ft18 color-666">暂无订单信息</span>
      <span class="ft12 color-999">温馨提示：超过三笔取消订单，将被冻结当天下单权限。</span>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
import VueClipboard2 from 'vue-clipboard2'
import OtcELHover from './dialog/OtcELHover'
export default {
  components: {
    VueClipboard2,
    OtcELHover
  },
  data () {
    return {
      // 订单列表
      orderList: [],
      // 对方用户支付信息列表
      payInfoList: {},
      // 对方用户支付信息查询队列，唯一标识：userId + payType
      payInfoHttpList: {},
      loading: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    getUserPayInfo () {
      return (userId, payType) => {
        if (this.payInfoList[userId]) {
          return this.payInfoList[userId][payType] || {}
        } else {
          return {}
        }
      }
    }
  },
  created () {
    if (this.$store.getters.getUser.loginStatus) {
      this.qryOrderList()
    }
    this.$store.commit('setWSChannel', {
      channelId: '1',
      funcId: 'orderOngoing',
      func: (data) => {
        this.qryOrderList()
      }
    })
  },
  destroyed () {
    this.$store.commit('delWSChannel', {
      channelId: '1',
      funcId: 'orderOngoing'
    })
  },
  methods: {
    // 查询进行中订单
    qryOrderList () {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/orders/listUI',
        data: {
          type: 1,
          pageSize: 9999,
          pageNo: 0
        }
      }).then(response => {
        this.orderList = this.refactorOrderList(response.body.data)
        this.loading = false
      }, response => {
        this.loading = false
      })
    },
    // 处理进行中的订单数据
    refactorOrderList (list) {
      const newList = []
      for (let i in list) {
        const order = list[i]
        const newOrder = Object.assign({}, order)
        // 0.设置资金密码是否可见
        newOrder.showPassword = false
        // 1.添加订单号前半部分和后四位尾数,下单时间;
        newOrder.startCode = order['oCode'].substring(0, order['oCode'].length - 4)
        newOrder.endCode = order['oCode'].substring(order['oCode'].length - 4, order.oCode.length)
        newOrder.oCreateTime = new Date(order.oCreateTime).format('yyyy-MM-dd hh:mm:ss')
        // 2.交易类型.true:买入;false:卖出;显示对方则反过来
        newOrder.exchangeType = this.user.userId === parseInt(order['oBuyerId'])
        newOrder.exchangeTypeName = newOrder.exchangeType ? '买入' : '卖出'
        newOrder.exchangeSubject = newOrder.exchangeType ? '卖家' : '买家'
        // 3.对方名称;
        newOrder.otherName = newOrder.exchangeType ? order['sellname'] : order['buyname']
        newOrder.otherId = newOrder.exchangeType ? order['oSellerId'] : order['oBuyerId']
        // 4.订单状态.
        // 买家:1.买家付款倒计时;2.买家确认付款,输入资金密码;3.买家付款,等待卖家确认收款倒计时;100.客户投诉中;101.卖家收款超时
        // 卖家:6.等待对方付款;7.确认收款;8.输入资金密码,确认收款;110.客户投诉中;111.卖家收款超时
        if (newOrder.exchangeType) {
          switch (order['oStatus']) {
            case '1':
              newOrder.status = 1
              break
            case '2':
              newOrder.status = 3
              break
            case '9':
              newOrder.status = 100
              break
            case '10':
              newOrder.status = 101
              break
          }
        } else {
          switch (order['oStatus']) {
            case '1':
              newOrder.status = 6
              break
            case '2':
              newOrder.status = 7
              break
            case '9':
              newOrder.status = 110
              break
            case '10':
              newOrder.status = 111
              break
          }
        }
        // 5.卖家可选收款方式:{wechat, alipay, bankcard, paypal}
        // 买方：1,2买家未付款时可选对方交易方式；3买家已付款时，显示买家所选真实交易方式（对方交易方式）；
        // 卖方：6买家未付款时不显示；7，8卖家确认收款时，显示真实交易方式对应的买家交易方式
        if (/^1$/.test(newOrder.status.toString())) {
          // 显示支付方式归属的用户
          newOrder.showPayUserId = order['oSellerId']
          const pays = (order['sellerPayType'] + order['resPayType'])
          // 统计卖家支付方式、交易广告支付方式的交集
          const wechat = pays.match(/1/g) || []
          const alipay = pays.match(/2/g) || []
          const bankcard = pays.match(/3/g) || []
          const paypal = pays.match(/4/g) || []
          const payList = []
          newOrder.payList = payList
          if (wechat.length >= 2) {
            payList.push({label: '微信', value: '1'})
          }
          if (alipay.length >= 2) {
            payList.push({label: '支付宝', value: '2'})
          }
          if (bankcard.length >= 2) {
            payList.push({label: '银行卡', value: '3'})
          }
          if (paypal.length >= 2) {
            payList.push({label: 'PayPal', value: '4'})
          }
          // 查询需要显示的默认支付信息
          if (payList.length) {
            newOrder.pay = payList[0].value
            this.qryOtherUserPayInfo(order['oSellerId'], payList[0].value)
          }
        } else {
          // 买家所选支付方式
          switch (order.oPayType) {
            case '1':
              newOrder.oPayTypeName = '微信'
              break
            case '2':
              newOrder.oPayTypeName = '支付宝'
              break
            case '3':
              newOrder.oPayTypeName = '银行卡'
              break
            case '4':
              newOrder.oPayTypeName = 'PayPal'
              break
          }
          let id = ''
          if (/^3$|^100$|^101$/.test(newOrder.status.toString())) {
            id = order['oSellerId']
            this.qryOtherUserPayInfo(id, order.oPayType)
            // 显示支付方式归属的用户
            newOrder.showPayUserId = id
          } else if (/^7$|^8$|^110$|^111$/.test(newOrder.status.toString())) {
            id = order['oBuyerId']
            this.qryOtherUserPayInfo(id, order.oPayType)
            // 显示支付方式归属的用户
            newOrder.showPayUserId = id
          }
        }
        // 7.操作倒计时
        if (/1|2|3|6|7|8/.test(newOrder.status.toString())) {
          const countDown = order['countDown']
          const countDownTimer = {}
          countDownTimer.lastTime = countDown
          countDownTimer.minutes = parseInt((countDown / 60).toString())
          countDownTimer.second = parseInt((countDown % 60).toString())
          if (parseInt(countDown) > 0) {
            countDownTimer.timer = setInterval(() => {
              // 倒计时结束
              if (--countDownTimer.lastTime <= 0) {
                clearTimeout(countDownTimer.timer)
                // 重新查询全部订单
                this.qryOrderList()
                return
              }
              this.$set(countDownTimer, 'minutes', parseInt(countDownTimer.lastTime / 60))
              this.$set(countDownTimer, 'second', parseInt(countDownTimer.lastTime) % 60)
            }, 1000)
          }
          newOrder.countDownTimer = countDownTimer
        }
        // 8.交易金额
        newOrder.oCapitalCount = this.NumberFormat.toFixed(order.oCapitalCount, 2)
        // 9.电子币数量
        newOrder.oCoinCount = this.NumberFormat.toFixed(order.oCoinCount, 8)
        // 10.交易价格
        newOrder.price = this.NumberFormat.toFixed(new BigNumber(order.oCapitalCount).div(new BigNumber(order.oCoinCount)).toString(), 4)
        // 11.交易币种符号
        newOrder.capitalTag = /1/.test(order['oCapitalType']) ? '￥' : '$'
        // 12.订单是否可取消
        newOrder.rescissible = /^1$/.test(newOrder.status.toString())
        // 13.订单是否可通知对方
        newOrder.notice = /^3$|^4$|^6$|^7$|^8$/.test(newOrder.status.toString())
        // 14.订单是否可投诉
        newOrder.service = /^3$|^4$|^7$|^8$|^9$/.test(newOrder.status.toString())
        newList.push(newOrder)
      }
      return newList
    },
    // 查询指定用户支付账号信息
    qryOtherUserPayInfo (userId, payType, order) {
      if (order) {
        this.$set(order, 'pay', payType)
      }
      // 已有该信息，不再重复查询
      if (this.payInfoList[userId] && this.payInfoList[userId][payType]) {
        return
      }
      // 该信息正在查询中
      if (this.payInfoHttpList[userId] && this.payInfoHttpList[userId][payType]) {
        return
      }
      // 在从未查询的情况下，向查询队列中添加一个标识符，避免同一信息重复查询
      if (!this.payInfoHttpList[userId]) {
        this.payInfoHttpList[userId] = {}
      }
      this.payInfoHttpList[userId][payType] = true
      // 根据用户ID查询对应的支付方式信息
      this.$http.post('/userinfo/getPayMethodsInfoUI', {
        userId: userId + '',
        type: payType
      }).then(response => {
        // 删除查询队列
        this.payInfoHttpList[userId][payType] = false
        let type = ''
        const data = response.body.data
        switch (payType) {
          case '1':
            type = 'wechat'
            break
          case '2':
            type = 'alipay'
            break
          case '3':
            type = 'bankcard'
            break
          case '4':
            type = 'paypal'
            break
        }
        if (!this.payInfoList[userId]) {
          this.$set(this.payInfoList, userId, {})
        }
        this.$set(this.payInfoList[userId], type, data)
      }, response => {
        this.payInfoHttpList[userId][payType] = false
      })
    },
    // 买家准备付款
    preparePayMoney (order) {
      if (order.payList.length < 1) {
        this.$message.error('请选择至少一种支付方式')
        return
      }
      order.status = 2
    },
    // 买家付款
    payMoney (order) {
      this.$set(order, 'loading', true)
      this.$store.dispatch('encryptConnection', {
        url: '/orders/alreadyPayUI',
        data: {
          orderId: order['oId'] + '',
          password: order['password'],
          oPayType: order['pay']
        }
      }).then(response => {
        this.$set(order, 'loading', false)
        this.qryOrderList()
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'NO_008':
            this.$message.error('资金密码错误')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.$set(order, 'loading', false)
        this.qryOrderList()
      })
    },
    // 卖家收款
    collectMoney (order) {
      this.$set(order, 'loading', true)
      this.$store.dispatch('encryptConnection', {
        url: '/orders/alreadyReceiveUI',
        data: {
          orderId: order['oId'] + '',
          password: order['password']
        }
      }).then(response => {
        // 重新查询订单
        this.$set(order, 'loading', true)
        this.qryOrderList()
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'NO_008':
            this.$message.error('资金密码错误')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.$set(order, 'loading', false)
        this.qryOrderList()
      })
    },
    // 取消订单
    cancelOrder (order) {
      this.$set(order, 'loading', true)
      this.$http.post('/orders/cancelUI', {
        orderId: order['oId'] + ''
      }).then(response => {
        this.$message.success('取消成功')
        this.$set(order, 'loading', false)
        this.qryOrderList()
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'NO-014':
            this.$message.error('订单无法取消，请联系客服处理!')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.$set(order, 'loading', false)
        this.qryOrderList()
      })
    },
    // 投诉订单
    complain (order) {
      this.$set(order, 'loading', true)
      this.$http.post('/orders/complainUI', {
        orderId: order['oId'] + ''
      }).then(response => {
        this.$message.success('投诉成功')
        this.$set(order, 'loading', false)
        this.qryOrderList()
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        this.$set(order, 'loading', false)
      })
    },
    // 通知对方
    call (order) {
      this.$store.dispatch('encryptConnection', {
        url: '/call/callNotifyUI',
        data: {
          orderId: order['oId'] + ''
        }
      }).then(response => {
        this.$message.success('已电话通知对方')
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'E7602':
            this.$message.error('超过限定次数')
            break
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 联系客服
    callServer () {
      document.getElementById('chatBtn').click()
    },
    // 显示或隐藏资金密码
    showOrHide (order) {
      this.$set(order, 'showPassword', !order.showPassword)
    },
    // 复制卡号成功回调
    handleSuccess () {
      this.$message.success('复制卡号成功')
    },
    // 复制卡号失败回调
    handleError () {
      this.$message.error('复制卡号失败')
    },
    // img标签加载失败
    imgHandleError (event, order) {
      this.$set(order, 'codeLoading', false)
      event.srcElement.setAttribute('data-load', 'false')
    },
    // img标签加载成功
    imgHandleLoad (event, order) {
      this.$set(order, 'codeLoading', false)
      event.srcElement.setAttribute('data-load', 'true')
    },
    refreshImage (event, order) {
      this.$set(order, 'codeLoading', true)
      const img = event.srcElement.previousElementSibling
      img.setAttribute('data-load', 'true')
      img.setAttribute('src', img.getAttribute('src') + '?time=' + +new Date())
    }
  }
}
</script>

<style scoped>
  .order_ongoing {
    position: relative;
  }

  .order_ongoing .pointer {
    cursor: pointer;
  }

  .order_root {
    position: relative;
    background: #FFF;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.11);
    border-radius: 2px;
  }

  /*标题头：订单号、对方名称、联系商家、客服投诉*/
  .order_header {
    background: #F2F3F8;
    /*padding: 10px 14px;*/
    height: 40px;line-height: 40px;padding-left: 14px;
  }

  .order_header img {
    width: 18px;
    height: 16px;
    line-height: normal;
    vertical-align: middle;
  }

  .order_header span {
    font-size:14px;
    color: #333;
    text-align:left;
    line-height: normal;
    display: inline-block;
    vertical-align: middle;
  }

  .order_header .font_blue {
    color: #0BB2FE;
  }

  .order_header .margin_left_a{
    margin-left: 40px;
  }

  .order_header .margin_left_b{
    margin-left: 134px;
  }
  .order_header .margin_left_c{
    margin-left: 116px;
  }

  .order_header .align_right {
    float: right;
  }
  .order_header .btn_blue{
    color: #8ED8FA;
    border: 1px solid #8ED8FA;border-radius: 4px;
    width: 70px;
    height: 26px;margin: 7px 0;
    margin-right: 20px;line-height: 26px;text-align: center;
  }

  /*订单主体*/
  .order_body {
    background-color: #FFF;
    /*padding: 20px 0;*/
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 260px;
    width: 100%;
  }

  .order_body>div {
    display: inline-block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    height: 100%;vertical-align: top;
  }

  /*分四列*/
  .order_body>div:nth-child(1) {
    width: 8%;
    /*padding-left: 26px;*/
    text-align: center;
    font-size: 16px;display: inherit;
  }
  .order_body>div:nth-child(2) {
    width: 41%;
    height: 100%;
  }
  .order_body>div:nth-child(3) {
    width: 24%;
    text-align: center;
  }
  .order_body>div:nth-child(4) {
    width: 25%;
    height: 195px;
    border-left: 1px solid #D8D8D8;
    text-align: center;margin-top: 32.5px;
  }

  /*第一列*/
  .order_body .one_font1{font-weight: 500;font-size: 18px;}
  /*第二列*/
  .order_body .detail {
    font-size: 14px;
    color: #666;height: 127px;
    position: relative;
  }
  .mt10{margin-top: 10px;}
  .pt30{padding-top: 30px;}
  .detail ul{position: relative;width: 100%;}
  .detail ul li{position: relative;width: 25%;float: left;color: #333;font-size: 14px;}
  .detail_font1{margin-top: 13px;height: 34px;line-height: 34px;}
  .detail_select{width: 100%;}

  .font-bold{font-weight: 500;}

  .detail>span {
    display: inline-block;
    overflow: visible;
  }

  .order_body .hint {
    padding: 17px 15px;
  }

  .hint span {
    line-height: 150%;
  }

  .order_body .background_gray {
    background-color: #F7F7F7;
    height: 71px;
    padding: 16px 0 15px 15px;
  }
  .order_body .background_gray .contentBox{height: 100%;}
  .order_body .background_gray p{margin: 0;font-size: 12px;color: #333;}
  .order_body .background_gray .color_red {
    color: #FF3A3A;
  }
  /*第三列*/
  .order_body .pay {text-align: left;height: 140px;margin-top: 20px;}
  .order_body .pay1{position: relative;margin: 0 auto;width: 100%;}
  /*微信支付宝未悬浮时图片的尺寸*/
  .codeImg{min-width: 120px;min-height: 120px;margin-top: 20px;max-width: 250px;max-height: 156px;cursor: pointer;}
  /*悬浮上去图片的尺寸*/
  .hoverImg{
    max-width: 50vw;
    max-height: 50vh;
  }

  /*刷新按钮默认不显示*/
  .codeImg + .el-icon-refresh {
    display: none;
  }
  /*二维码加载失败时，二维码不显示*/
  .codeImg[data-load='false'] {
    display: none;
  }
  /*二维码加载失败时，刷新按钮显示*/
  .codeImg[data-load='false'] + .el-icon-refresh {
    display: inline-block;
    font-size: 60px;
    cursor: pointer;
    width: 156px;
    height: 156px;
    line-height: 156px;
    border: 1px solid black;
    margin: 10px auto;
    color: #666;
  }
  /*刷新按钮点击时，旋转按钮*/
  .icon-rotate:before {
    display: inline-block;
    -webkit-animation: ir 1s linear infinite;
    -o-animation: ir 1s linear infinite;
    animation: ir 1s linear infinite;
  }

  @keyframes ir {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  .ml10{padding-left: 10%;}

  .pay .main{
    font-size: 14px;
    color: #666;
    /*line-height: 100%;*/
  }

  .pay .secondary{
    font-size: 14px;
    color: #333;
    line-height: 100%;
  }

  /*第四列*/
  .order_body .operation {
    display: inline-block;
    /*padding-top: 30px;*/
    /*padding-top: 15px;*/
  }

  .operation .time {
    font-size: 28px;
    color: #FF3A3A;
  }

  .operation .hint {
    font-size: 14px;
    color: #FF3A3A;
  }

  .operation button {
    width: 100px;
    height: 36px;
  }

  .operation input {
    height: 34px;
  }

  .operation .ft16 color-0BB2FE {
    /*margin-bottom: 54px;*/
    margin-bottom: 24px;
  }
  /*字体大小颜色*/
  .color_bule{font-size: 16px;color: #0BB2FE;}
  .redFont{font-size: 16px;color: #FF3A3A;}
  .mr8{margin-right: 8px;}

  .eyeImg{    position: absolute;
    top: 30%;
    right: 4%;
    width: 16px;
    height: 12px;}

  .copyBtn{cursor: pointer;}

  /*暂无订单信息*/
  .bh-order_none {
    text-align: center;
    padding-top: 45px;
    padding-bottom: 42px;
  }
  .bh-order_none img {
    width: 51px;
    height: 74px;
    margin-bottom: 20px;
  }
  .bh-order_none span {
    display: block;
    margin-top: 6px;
  }
</style>
