<template>
  <div class="bh-root otc">
    <header>
      <navigation :full-width="true"></navigation>
    </header>

    <main class="otcTrading">
      <!--轮播图-->
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide swiper-no-swiping">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/otc_trading/img1.png"/>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/otc_trading/img2.png"/>
          </div>
          <div class="swiper-slide swiper-no-swiping">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/otc_trading/img3.png"/>
          </div>
        </div>
        <!--<div class="swiper-button-prev"></div>&lt;!&ndash;左箭头&ndash;&gt;-->
        <!--<div class="swiper-button-next"></div>&lt;!&ndash;右箭头&ndash;&gt;-->
      </div>

      <!--内容——中间-->
      <div class="bh-wrap_content">
        <!--左边部分-->
        <div class="leftCon">
          <!--指数-->
          <div class="bh-exponent">
            <!--币种搜索-->
            <div class="bh-exponent_div">
              <div class="is_div">
                <div class="table_title">
                  <div class="headTitle center-lr-scatter">
                    <div class="font1">
                      <template>
                        <el-select v-model="coin" filterable placeholder="币种搜索" class="el-select" @change="chooseCoin">
                          <el-option v-for="item in otcCoin" :key="item.symbol" :label="item.symbol" :value="item.symbol"></el-option>
                        </el-select>
                      </template>
                    </div>
                    <div class="font2">指数</div>
                    <div class="font3">跌涨幅</div>
                  </div>
                  <el-col style="height: 398px;">
                    <ul class="is_ul">
                      <li v-for="(item, key) in otcCoin" :key="key" :class="{'is_active':coin===key}" @click="chooseCoin(key)" class="center-lr-scatter">
                        <div class="font1">{{key}}</div>
                        <!--指数-->
                        <div class="font2" :class="{'font_up':item['up'],'font_down':item['down']}">{{item.price}}&nbsp;CNY</div>
                        <div class="font3" :class="{'font_up':item['up'],'font_down':item['down']}" style="text-align: right;">
                          {{item['up'] ? '+' : ''}}{{item['change_daily']}}%
                          <div class="font_arrow" :class="{'arrow_up': item['up'], 'arrow_down': item['down']}"></div>
                        </div>
                      </li>
                    </ul>
                  </el-col>
                </div>
              </div>
            </div>
          </div>

          <!--常见问题-->
          <div class="bh-question">
            <el-row class="el-row">
              <img src="../../assets/images/star.svg" alt="" class="questionImg">
              <span><a @click="$router.push({name: 'MoreOpen', params: {myId: questionId, type: 2, myname: '常见问题'}})">常见问题</a></span>
            </el-row>
            <ul class="bh-curcos-all">
              <li class="bh_li apostrophe-one" v-for="(item, index) in questionList" :key="index" @click="$router.push({ name: 'FrequentlyAskedQuestion', params: {type: 2, myId: questionId, helpId: item.id} })"><a class="bh-help"><span class="bh-serial-number">{{index + 1}}</span>{{item.title}}</a></li>
            </ul>
          </div>
        </div>

        <!--右边部分 交易广告筛选条件-->
        <div class="rightCon">
          <!--买入卖出-->
          <div class="bh-transaction_menu">
              <span class="ft16 color-333 bh-curcos-all" :class="{active: transactionType===2}" @click="transactionType=2">买入{{coin}}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <span class="ft16 color-333 bh-curcos-all" :class="{active: transactionType===1}" @click="transactionType=1">卖出{{coin}}</span>
              <!--交易金额-->
              <el-select v-model="amount" class="menuBtn menuCount">
                <el-option
                  v-for="item in [{label: '单笔交易金额', value: '0'}, {label: '小于一万', value: '1'}, {label: '小于五万', value: '2'}, {label: '大于五万', value: '3'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!--支付方式-->
              <el-select v-model="pattern" class="menuBtn menuPay">
                <el-option
                  v-for="item in [{label: '所有支付方式', value: '0'}, {label: '微信', value: '1'}, {label: '支付宝', value: '2'}, {label: '银行卡', value: '3'}, {label: 'PayPal', value: '4'}]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </div>
          <!--交易广告-->
          <div class="bh-transaction_content">
            <el-table :data="transactionList" v-loading="queryStatus" stripe height="672">
              <!--商家-->
              <el-table-column label="商家" fixed min-width="200">
                <template slot-scope="scope">
                  <div class="center-float-left">
                    <span class="bh-transaction_headimg mr10 ml10">
                      <img v-if="scope.row.headimg" :src="scope.row.headimg">
                      <img v-else src="../../assets/images/headimg.png">
                      <!--在线状态-->
                      <i></i>
                    </span>
                    <div class="left-tb-scatter">
                      <div class="bh-transaction_name font-333 apostrophe-one">{{scope.row.name}}
                        <span v-if="scope.row.isAuth">
                          <span class="bh-transaction_staus font-or">已实名</span>
                          <span>
                            <img class="bh-transaction_certification" src="../../assets/images/certification.svg">
                          </span>
                        </span>
                      </div>
                      <div>
                        <span class="color-999 ft12">好评</span>
                        <span class="color-333 ft14 mr5">{{scope.row.goodCommentCount}}</span>
                        <span class="color-999 ft12">信任</span>
                        <span class="color-333 ft14 mr5">{{scope.row.trustCount}}</span>
                        <span class="color-999 ft12">交易</span>
                        <span class="color-333 ft14 mr5">{{scope.row.assetCount}}</span>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <!--数量stockQuantity-->
              <el-table-column label="数量" min-width="120">
                <template slot-scope="scope">
                  <span class="color-333 ft14">{{scope.row.stockQuantity}}</span>
                </template>
              </el-table-column>
              <!--限额-->
              <el-table-column label="限额" min-width="120">
                <template slot-scope="scope">
                  <span class="color-333 ft14">{{scope.row.startAmount}}-{{scope.row.endAmount}} {{scope.row.priceCurrencyType}}</span>
                </template>
              </el-table-column>
              <!--单价 交易价格-->
              <el-table-column label="单价" min-width="80">
                <template slot-scope="scope">
                  <span class="bh-color_select">{{scope.row.price}} {{scope.row.priceCurrencyType}}</span>
                  <div class="font_arrow" :class="{'arrow_up': scope.row.arrow, 'arrow_down': !scope.row.arrow}"></div>
                </template>
              </el-table-column>
              <!--支付方式-->
              <el-table-column label="支付方式" width="150">
                <template slot-scope="scope">
                  <span v-if="scope.row.wechat"><img class="payImg" src="../../assets/images/owechat.svg"></span>
                  <span v-if="scope.row.alipay"><img class="payImg" src="../../assets/images/oalipay.svg"></span>
                  <span v-if="scope.row.bank"><img class="payImg" src="../../assets/images/obank.svg"></span>
                  <span v-if="scope.row.paypal"><img class="payImg" src="../../assets/images/opaypal.svg"></span>
                </template>
              </el-table-column>
              <!--免手续费-->
              <el-table-column align="center" :render-header="renderHeader">
                <template slot-scope="scope">
                  <el-tooltip effect="light" placement="left" v-if="scope.row.disabled">
                    <div slot="content" v-if="scope.row.disabled" :style="scope.row.contentWidth">{{scope.row.disabledReason}}</div>
                    <el-button v-if="scope.row.businType === '2'" class="no-buy">买入</el-button>
                    <el-button v-else class="no-buy">卖出</el-button>
                  </el-tooltip>
                  <div v-else>
                    <el-button v-if="scope.row.businType === '2'" @click="exchange(true, scope.row)" class="buyIn">买入</el-button>
                    <el-button v-else @click="exchange(false, scope.row)" class="buyOut">卖出</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <el-row  class="el-row">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="6"
                :total="totalCount"
                layout="total, prev, pager, next">
              </el-pagination>
            </el-row>
          </div>
        </div>
      </div>

      <!--订单-->
      <a id="order" href="#order" ref="order"></a>
      <div class="bh-order">
        <div class="bh-order_menu por">
          <el-row>
            <el-col :span="2">
              <span class="ft16 color-333" :class="{'bh-color_select': orderMenuSelected==='ongoing'}" @click="orderMenuSelected='ongoing'">进行中订单</span>
            </el-col>
            <el-col :span="2">
              <span class="ft16 color-333" :class="{'bh-color_select': orderMenuSelected==='completed'}" @click="orderMenuSelected='completed'">已完成订单</span>
            </el-col>
            <el-col :span="2">
              <span class="ft16 color-333" :class="{'bh-color_select': orderMenuSelected==='cancel'}" @click="orderMenuSelected='cancel'">取消订单</span>
            </el-col>
            <!--<i :class="{ongoing: orderMenuSelected==='ongoing', completed: orderMenuSelected==='completed', cancel: orderMenuSelected==='cancel'}"></i>-->
            <el-col :span="15">
              <span class="manageBtn" @click="$router.push({name:'ListManagement'})">名单管理</span>
            </el-col>
          </el-row>
        </div>
        <!--进行中的订单-->
        <div class="bh-order_ongoing" v-if="orderMenuSelected==='ongoing'">
          <order-ongoing ref="ongoing"></order-ongoing>
        </div>
        <!--已完成订单-->
        <div class="bh-order_completed" v-if="orderMenuSelected==='completed'">
          <order-completed></order-completed>
        </div>
        <!--取消订单-->
        <div class="bh-order_cancel" v-else-if="orderMenuSelected==='cancel'">
          <order-canceled></order-canceled>
        </div>
      </div>
    </main>
   <footer>
     <bh-footer></bh-footer>
   </footer>
    <!--买入卖出点击进来，弹出框-->
    <exchange-dialog :visible.sync="exchangeDialog" v-if="exchangeDialog" :exchangeData="exchangeData" @success="updateOrder"></exchange-dialog>
    <!--订单确认-->
    <order-confirmation :visible.sync="orderConfirmation"></order-confirmation>
    <!--未绑定支付方式,设定支付方式-->
    <not-bound :visible.sync="notBound"></not-bound>
  </div>
</template>

<script>
import Navigation from '../../components/Navigation'
import BhFooter from '../../components/FooterIndex'
import ExchangeDialog from './dialog/ExchangeDialog'
import OrderConfirmation from './dialog/OrderConfirmation'
import NotBound from './dialog/NotBound'
import OrderOngoing from './OrderOngoing'
import OrderCompleted from './OrderCompleted'
import OrderCanceled from './OrderCanceled'
import Swiper from 'swiper'
export default {
  name: 'OtcTrading',
  components: {
    Navigation,
    BhFooter,
    ExchangeDialog,
    OrderConfirmation,
    NotBound,
    OrderOngoing,
    OrderCompleted,
    OrderCanceled
  },
  data () {
    return {
      // 3.显示的交易广告类型1:买入；2：卖出；
      transactionType: 2,
      // 交易广告币种
      coin: '',
      // 交易广告筛选金额
      amount: '0',
      // 交易广告支付方式筛选
      pattern: '0',
      // 交易广告数据
      transactionList: [],
      // 4.交易对话框
      exchangeDialog: false,
      exchangeType: false,
      exchangeData: null,
      // 确认订单对话框
      orderConfirmation: false,
      notBound: false,
      // 5.进行中订单、已完成订单、已取消订单
      orderMenuSelected: 'ongoing',
      order: true,
      // 交易广告查询中
      queryStatus: false,
      // 订单数据
      orderList: [],
      orderTotalCount: 0,
      orderCurrentPage: 0,
      // 所有订单的加载
      ordersLoading: false,
      // 支付方式查询中
      payTypeStatus: false,
      // 交易广告页码、总数
      currentPage: 1,
      totalCount: 0,
      // 常见问题
      questionId: '',
      questionList: []
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    otcCoin () {
      return this.$store.getters.getOtcCoin
    },
    otcDefaultCoin () {
      return this.$store.getters.getOtcDefaultCoin
    }
  },
  watch: {
    coin () {
      if (this.coin) {
        this.qryTransactionList(this.coin, this.transactionType, this.amount, this.pattern, this.currentPage - 1)
      }
    },
    otcDefaultCoin: {
      handler () {
        this.coin = this.otcDefaultCoin
      },
      immediate: true
    },
    orderMenuSelected () {
      this.orderList = []
    },
    amount () {
      this.currentPage = 1
      this.totalCount = 0
      this.qryTransactionList(this.coin, this.transactionType, this.amount, this.pattern, this.currentPage - 1)
    },
    pattern () {
      this.currentPage = 1
      this.totalCount = 0
      this.qryTransactionList(this.coin, this.transactionType, this.amount, this.pattern, this.currentPage - 1)
    },
    transactionType () {
      this.currentPage = 1
      this.totalCount = 0
      this.qryTransactionList(this.coin, this.transactionType, this.amount, this.pattern, this.currentPage - 1)
    }
  },
  methods: {
    // 选中币种
    chooseCoin (coin) {
      this.coin = coin
      // 当前页数
      this.currentPage = 1
      this.totalCount = 0
    },
    // 查询交易广告列表
    qryTransactionList (coin, businType, amount, payType, pageNo) {
      this.queryStatus = true
      payType = /0/.test(payType) ? undefined : payType
      let start = null
      let end = null
      switch (parseInt(amount)) {
        case 1:
          start = '0'
          end = '10000'
          break
        case 2:
          start = '0'
          end = '50000'
          break
        case 3:
          start = '50000'
          end = Number.MAX_SAFE_INTEGER + ''
          break
        default:
          start = null
          end = null
      }
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/findAllBussinssResource',
        data: {
          pageSize: 5,
          pageNo: pageNo || 0,
          businType: businType + '' || '1',
          currency: coin,
          startAmount: start,
          endAmount: end,
          payType: payType
        }
      }).then(response => {
        this.totalCount = response.body.totalCount
        const list = response.body.data
        // 该币种的行情价
        const price = this.otcCoin[coin]['price']
        for (let i in list) {
          list[i]['goodCommentCount'] = list[i]['goodCommentCount'] || 0
          list[i]['trustCount'] = list[i]['trustCount'] || 0
          list[i]['assetCount'] = list[i]['assetCount'] || 0
          list[i]['isAuth'] = /Y/i.test(list[i]['isAuth'])
          list[i]['stockQuantity'] = this.NumberFormat.toFixed(list[i]['stockQuantity'], 8) || 0
          list[i]['startAmount'] = list[i]['startAmount'] || 20
          list[i]['endAmount'] = list[i]['endAmount'] || 100000
          list[i]['priceCurrencyType'] = /1/.test(list[i]['priceCurrencyType']) ? 'CNY' : 'USD'
          list[i]['price'] = this.NumberFormat.toFixed(list[i]['price'], 4)
          list[i]['arrow'] = list[i]['price'] > price
          list[i]['wechat'] = /1/.test(list[i]['payType'])
          list[i]['alipay'] = /2/.test(list[i]['payType'])
          list[i]['bank'] = /3/.test(list[i]['payType'])
          list[i]['paypal'] = /4/.test(list[i]['payType'])
          // 禁止交易及其原因
          if (this.user.loginStatus) {
            if (list[i]['userId'] === this.user.userId) {
              list[i]['disabled'] = true
              list[i]['disabledReason'] = '不能和自己交易'
            } else if (!((/1/.test(this.user.isOpenWechat) && list[i]['wechat']) || (/1/.test(this.user.isOpenAlipay) && list[i]['alipay']) || (/1/.test(this.user.isOpenBank) && list[i]['bank']) || (/1/.test(this.user.isOpenPaypal) && list[i]['paypal']))) {
              list[i]['disabled'] = true
              list[i]['disabledReason'] = '没有对方支持的交易方式'
            }
            // 计算文字的宽度
            if (list[i]['disabled']) {
              const span = document.createElement('span')
              span.innerText = list[i]['disabledReason']
              document.getElementsByTagName('body')[0].appendChild(span)
              list[i]['contentWidth'] = 'width: ' + span.getBoundingClientRect().width + 'px;'
              document.getElementsByTagName('body')[0].removeChild(span)
            }
          }
        }
        this.transactionList = list
        this.queryStatus = false
      }, response => {
        this.queryStatus = false
      })
    },
    // 交易：交易类型，广告ID，限额-限额，币种
    exchange (exchangeType, exchangeData) {
      // 禁止交易
      if (exchangeData.disabled) {
        return
      }
      // 1.用户未登录限制
      if (!this.user.loginStatus) {
        this.$router.push({name: 'Login'})
        return
      }
      // 2.用户交易方式未设置限制
      if (!(this.user.isOpenBank || this.user.isOpenAlipay || this.user.isOpenWechat || this.user.isOpenPaypal)) {
        this.notBound = true
        return
      }
      exchangeData.exchangeType = exchangeType
      this.exchangeType = exchangeType
      this.exchangeData = exchangeData
      this.exchangeDialog = true
    },
    // 查询订单
    updateOrder () {
      this.orderMenuSelected = 'ongoing'
      this.$refs.order.click()
      this.$refs.ongoing.qryOrderList()
    },
    // 广告翻页
    handleCurrentChange (val) {
      this.currentPage = val
      this.qryTransactionList(this.coin, this.transactionType, this.amount, this.pattern, this.currentPage - 1)
    },
    // 自定义el-table组件表头
    renderHeader (createElement, { column, _self }) {
      let fireImage = require('../../assets/images/otc/fire.png')
      return createElement(
        'div',
        {
          'class': 'cell'
        },
        [
          createElement('img', {
            attrs: { src: fireImage }}
          ),
          createElement('span', {
            attrs: { class: 'ml10', style: 'color:#F55858' }}, ['免手续费']
          )
        ]
      )
    }
  },
  mounted () {
    // type：交易广告类型，id为交易广告id；
    // coin：交易广告币种；
    const type = this.$route.query.type
    if (type === 'id') {
      let id = this.$route.query.id || '0'
      id = window.atob(id)
      // 根据ID查询广告
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/findResourceByIdUI',
        data: {
          id: id
        }
      }).then(response => {
        this.coin = response.body.data[0].currency
        this.transactionType = parseInt(response.body.data[0].businType)
        this.transactionList = response.body.data
      }, response => {})
    } else {
      this.coin = this.$route.params['coin'] || this.coin
    }

    if (this.$store.getters.getUser.loginStatus) {
      // 获取用户信息
      this.$store.dispatch('qryUserInfo').then(response => {}, response => {})
    }
    // swiper轮播图
    let swiper = new Swiper('.otc .swiper-container', {
      slidesPerView: 3, // slider容器能够同时显示的slides数量
      spaceBetween: 15, // 在slide之间设置距离（单位px）
      autoplay: 300000, // 钟总要求5分钟轮播一次
      speed: 1000,
      autoHeight: true, // 高度随内容变化
      loop: true,
      noSwiping: true, // 无法拖动
      pagination: '.otc .swiper-pagination'
    })
    swiper.init()

    // 查询常见问题
    this.$http.get('/help/listUI', {
      params: {
        type: 2
      }
    }).then(response => {
      const data = response.body.data
      for (let i in data) {
        if (/常见问题/.test(data[i]['category'])) {
          this.questionId = data[i]['categoryId']
          this.questionList = data[i]['helps']
          return
        }
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name === 'Login' && JSON.stringify(this.$route.query) !== '{}') {
      to.params.type = this.$route.query.type
      to.params.id = this.$route.query.id
    }
    next()
  }
}
</script>

<style scoped>
  .bh-root {
    position: relative;
    min-height: 100%;
    background-color: #F2F3F8;
    font-size: 1em;
  }

  header>div, footer>div {
    background: #2c3253 !important;
  }

  main {
    display: block;
    width: 100%;
    padding: 18px 15px 80px 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  footer {
    display: block;
    position: relative;
    width: 100%;
    background: #2c3253;
  }

  /*轮播图*/
  .swiper-slide img{position: relative;width: 100%;}

  @media screen and (max-width: 1366px) {}
  @media screen and (min-width: 1367px) {}

  /*中间部分*/
  .bh-wrap_content {
    height: 768px;
    margin: 15px 0;
  }
  .bh-wrap_content .leftCon{height: 768px;width: 30%;float: left;position: relative;}
  .bh-wrap_content .rightCon{height: 768px;width: 69%;float: right;border-radius: 2px;}

  /*指数*/
  .bh-exponent {
    width: 100%;
    height: 470px;
    background-color: #FFF;
    border-radius: 2px;
    margin-bottom: 15px;
    position: relative;
  }
  /*指数容量*/
  .bh-exponent_div{
    width: 90%;
    height: 100%;
    position: relative;
    margin: 0 auto;
    top: 0px;
  }
  /*常见问题*/
  .bh-question {
    width: 100%;
    background-color: #FFF;
    position: absolute;
    bottom: 0;
    border-radius: 2px;
    height: 283px;
  }

  /*买入卖出*/
  .bh-transaction_menu {
    width: 100%;
    height: 50px;
    background-color: #FFF;
    line-height: 50px;
    box-shadow:0 2px 3px 0 #F2F3F8;
    position: relative;
  }
  .bh-transaction_menu span{cursor: pointer;width: auto;}
  .bh-transaction_menu>span:first-child, .bh-transaction_menu>span:nth-child(2) {
    display: inline-block;
    /*min-width: 50px;*/
    height: 50px;
    line-height: 50px;text-align: center;
  }
  .bh-transaction_menu>span:first-child {
    margin-left: 20px;margin-right: 40px;
  }

  /*头像*/
  .bh-transaction_headimg {
    display: inline-block;
    /*width: 42px;*/
    /*height: 42px;*/
    position: relative;
    width: 45px;
    height: 45px;
  }
  .bh-transaction_headimg img {
    width: 42px;
    height: 42px;
    -webkit-border-radius: 9999px;
    -moz-border-radius: 9999px;
    border-radius: 9999px;
  }
  .bh-transaction_headimg i {
    display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background-color: #38f64b;
    position: absolute;
    bottom: 11%;
    right: 13%;
  }

  .bh-transaction_certification {
    width: 11px;
    height: 12px;
  }

  /*交易记录的表格*/
  .bh-transaction_content {
    height: 718px;
    padding: 1px 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #FFFFFF;
  }

  /*3.订单*/
  .bh-order {
    background: #FFF;
    border-radius: 2px;
    margin-top: 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /*订单上的菜单*/
  .bh-order_menu {
    /*height: 50px;*/
    height: 55px;
    /*border-bottom: 2px solid #F2F3F8;*/
    box-shadow: 0 2px 3px 0 #F2F3F8;
    padding: 0 24px;
    position: relative;
  }

  .bh-order_menu span {
    display: inline-block;
    width: 100px;
    height: 100%;
    line-height: 55px;
    margin-right: 40px;
    text-align: center;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }
  .bh-order_menu span:hover {
    cursor: pointer;
  }
  .bh-order_menu i {
    display: inline-block;
    width: 100px;
    height: 2px;
    background-color: #0BB2FE;
    position: absolute;
    bottom: 0;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }
  /*进行中*/
  .bh-order_menu i.ongoing {
    left: 0%;
  }
  /*已完成*/
  .bh-order_menu i.completed {
    left: 8.5%;
  }
  /*已取消*/
  .bh-order_menu i.cancel {
    left: 16.5%;
  }

  /*3.1进行中的订单呢*/
  .bh-order_ongoing {
    background: #FFF;
    border-radius: 2px;
    /*margin: 15px 35px 0 35px;*/
    padding: 15px 35px 49px  35px;
  }

  .bh-order_item {
    box-shadow: 0 2px 5px 0 rgba(0,0,0, .11);
  }
  /*进行中订单的标题*/
  .bh-order_item-title {
    background-color: #F2F3F8;
    height: 40px;
    line-height: 40px;
    padding: 0 14px;
    position: relative;
    /*overflow: hidden;*/
  }
  .bh-order_item-title>span:first-child {
    margin-right: 135px;
  }

  .bh-order_item-content {
    padding: 20px 26px 28px 26px;
    height: 200px;
    /*overflow: hidden;*/
  }

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

  /*3.2已完成订单，3.3取消订单*/
  .bh-order_completed, .bh-order_cancel {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 15px 35px 49px  35px;
  }
  /*常见问题样式*/
  .bh_li{
    margin: 15px 0 15px 30px;
    font-size: 14px;
    color: #666666;
  }

  .left .el-tooltip__popper,
  .right .el-tooltip__popper {
    padding: 8px 10px;
  }
  .bh_ul_li li{
    margin:10px 0 10px 0;
  }
  .is_div {
    display: inline-block;
    border:1px solid #d8d8d8;
    border-radius:2px;
    width:100%;
    height: 438px;
    overflow: hidden;
    vertical-align: top;
    margin-top: 15px;
  }
  .table_title{background:#f2f3f8;border-radius:2px 2px 0 0;width:100%;height:40px;text-align: center;}
  .is_ul{padding-top: 8px;cursor: pointer;height: 100%;overflow-y: scroll;}
  .is_ul li{
    width:99%;
    height:36px;
    font-size:14px;
    color:#333333;
    line-height: 36px;
  }
  .is_ul li:hover{
    background:#f4fbff;
    border-left: 2px solid #0BB2FE;
  }
  .is_active {
    background:#f4fbff;
    border-left: 2px solid #0BB2FE;
  }
  .bh_spacing{
    padding: 3% 0 12% 4%;
  }
  .is_spacing{
    padding: 0 0 2% 4%;
  }
  .bh-help {
    color: #666;
    cursor: pointer !important;
  }
  .bh-help:hover{
    color: #0BB2FE !important;
  }
  .bh-curcos-all.active {
    color:#0BB2FE;border-bottom: 1px solid #0BB2FE;
  }

  /*三个加起来是100的宽度*/
  .font1{width: 28%;text-align: left;margin:0 5%;}
  .font2{width: 40%;text-align: left;}
  .font3{width: 22%;text-align: left;}
  .headTitle{padding: 7px 0;width: 96%;top: 0;left: 0;}
  .font_up{color: #02C087;}
  .font_down{color: #F55858;}
  .font_arrow{width: 7px;height: 14px;display: inline-block}
  .arrow_up{background: url("../../assets/images/otc_trading/arrow_up.png") no-repeat;}
  .arrow_down{background: url("../../assets/images/otc_trading/arrow_down.png") no-repeat;}

  .payImg{width:16px;height:15px;}
  /*买入卖出按钮*/
  .buyIn{background:#02c087;border-radius:4px;width:60px;height:24px;padding: 0;font-size:12px;color:#fff;}
  .buyOut{background:#f65858;border-radius:4px;width:60px;height:24px;padding: 0;font-size:12px;color:#fff;}
  .no-buy{background:#ccc;border-radius:4px;width:60px;height:24px;padding: 0;font-size:12px;color:#fff;}
  /*表格里的字体大小，颜色*/
  .font-or{font-size: 13px;color: #FF7C44;}

  .questionImg{display: inline-block;width: 16px;height: 16px;margin-left: 32px;}
  /*交易金额，支付方式按钮*/
  .menuBtn{width: 130px;height: 34px;position: absolute;}
  .menuCount{right:22%;}
  .menuPay{right:3%;}

  /*名单管理*/
  .manageBtn{font-size:16px;color:#8ed8fa;position: absolute;right: -1%;}
</style>
