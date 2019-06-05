<template>
  <div class="exchangeDialog">
    <!--买入-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="590" :height="606">
      <div slot="body" v-loading="loading">
        <!--标题-->
        <div class="titleBox mt30">
          <span v-if="exchangeType">购买{{coin}}</span>
          <span v-else>卖出{{coin}}</span>
        </div>
        <!--用户头像-->
        <div class="center-float-left w550 pl10 pt20 pb30">
          <div class="por">
            <img v-if="headImage" :src="headImage" alt="" style="border-radius: 100%;width: 60px;height: 60px;">
            <img v-else src="../../../assets/images/headimg.png" alt="" style="border-radius: 100%;width: 60px;height: 60px;">
            <i></i>
          </div>
          <div class="left-tb-scatter">
            <div class="ml10 font1">{{nickname}}</div>
            <div class="ml10 center-float-left">
              <div class="mr50 ft14">{{name}}</div>
              <div class="mr50 ft14 color_font">{{identityAuthenticator}}</div>
              <div class="mr50 ft14 color_font center-float-center">
                <span>平台VIP商户</span>
                <img src="../../../assets/images/otc/vip.png" class="ml5"/>
              </div>
            </div>
          </div>
        </div>
        <!--买家信息-->
        <div class="w550 buyBox">
          <div class="buyTitle center-float-left ft14 pl10 pt15">
            <span></span>
            <div class="ml5">卖家信息</div>
          </div>
          <ul class="buyUlBox pt15 pl20 pr20 pb15">
            <li>
              <!--蓝湖上显示超过1000条显示1000+ -->
              <div>{{transactionNumber >= 1000 ? (transactionNumber + '+') : transactionNumber}}</div>
              <div class="buyUlName">交易次数</div>
            </li>
            <li>
              <div>{{trustNumber}}</div>
              <div class="buyUlName">信任人数</div>
            </li>
            <li>
              <div>{{praise}}</div>
              <div class="buyUlName">好评</div>
            </li>
            <li>
              <div>{{historyQuantity}}</div>
              <div class="buyUlName">历史成交量</div>
            </li>
          </ul>
          <!--支付方式-->
          <div class="pl20 center-float-left payTypeBox pt15">
            <div class="pr10">支持付款方式：</div>
            <div>
              <span v-if="/1/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/owechat.svg"></span>
              <span v-if="/2/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/oalipay.svg"></span>
              <span v-if="/3/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/obank.svg"></span>
              <span v-if="/4/.test(payType)"><img style="width:16px;height:15px;" src="../../../assets/images/opaypal.svg"></span>
            </div>
          </div>
          <!--付款时间-->
          <ul class="pl20 center-float-left payTimeBox pt15">
            <li>
              平均付款时间：<span class="pl10">{{avgPayTime}}min</span>
            </li>
            <li>
              平均放币时间：<span class="pl10">{{avgGoodsTime}}min</span>
            </li>
          </ul>
        </div>
        <!--浮动报价,购买数量,购买金额-->
        <ul class="buyCountBox">
          <li class="font1 mb15">
            <div class="w120" v-if="isFixedPrice">报价 ({{priceCurrencyType}})</div>
            <div class="w120" v-else>浮动报价 ({{priceCurrencyType}})</div>
            <span class="ml20 font2">{{Number(price).cut(4)}}</span>
          </li>
          <li class="font1 mb15 center-float-left">
            <div class="w120">交易数量 ({{coin}})</div>
            <span class="ml10 payInputBox">
              <input type="number" v-model="number" class="payInput payInput1"/>
              <div class="font3" @click="exchangeAll" v-if="exchangeType">全部买入</div>
              <div class="font3" @click="exchangeAll" v-else>全部卖出</div>
            </span>
          </li>
          <li class="font1 mb15 center-float-left">
            <div class="w120">交易金额 ({{priceCurrencyType}})</div>
            <span class="ml10">
              <input type="number" v-model="amount" class="payInput payInput2"/>
              <span class="font4 ml20" v-if="Number(startAmount) === 0 && Number(endAmount) === 0">单笔限额0-0 CNY</span>
              <span class="font4 ml20" v-else>单笔限额{{startAmount}}-{{endAmount}} {{priceCurrencyType}}</span>
            </span>
          </li>
        </ul>
        <!--提示文字-->
        <div class="font5">平台担保交易无需任何手续费，请放心交易</div>
        <!--取消、确认-->
        <div class="bh_btnBox mt20">
          <button class="bh_btn bh-btn_plain" @click="$emit('update:visible', false)">取消</button>&nbsp;&nbsp;&nbsp;&nbsp;
          <el-button type="primary" class="bh_btn bh-btn_primary" @click="commit">
            <span>确认</span>
          </el-button>
        </div>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
import BigNumber from 'bignumber.js'
export default {
  components: {
    BhDialog
  },
  props: {
    exchangeData: {
      type: Object,
      default: JSON.parse('{}')
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 加载状态
      loading: true,
      // 商家头像
      headImage: '',
      // 商家交易数量
      transactionNumber: 0,
      // 商家信任人数
      trustNumber: 0,
      // 商家好评
      praise: '0%',
      // 商家支持的支付方式
      supportPayType: '4',
      // 平均付款时间
      avgPayTime: null,
      // 平均放币时间
      avgGoodsTime: null,
      // 历史成交量
      historyQuantity: '',
      // 交易价格
      price: 0,
      // 交易数量
      number: 0,
      // 交易金额
      amount: 0,
      // 数量同步锁
      synchronizedNumber: false,
      // 金额同步锁
      synchronizedAmount: false,
      // 实名
      name: '',
      // 昵称
      nickname: '',
      // 实名等级
      identityAuthenticator: '',
      // 交易广告数据
      businessId: '',
      exchangeType: true,
      startAmount: 0,
      endAmount: 0,
      coin: '',
      isFixedPrice: 0,
      priceCurrencyType: 'CNY',
      payType: '',
      stockQuantity: 0
    }
  },
  watch: {
    number (value) {
      if (this.synchronizedNumber) {
        this.synchronizedNumber = false
        return
      }
      // 同步交易金额
      this.synchronizedAmount = true
      this.amount = new BigNumber(value || 0).multipliedBy(new BigNumber(this.price)).toNumber().cut(4) || 0
    },
    amount (value, lastValue) {
      if (this.synchronizedAmount) {
        this.synchronizedAmount = false
        return
      }
      if (value.length > 9) {
        this.synchronizedAmount = true
        this.amount = lastValue
        return
      }
      this.synchronizedNumber = true
      this.number = new BigNumber(value).dividedBy(new BigNumber(this.price)).toNumber()
    }
  },
  computed: {
    // 我的余额
    myBalance () {
      // 买入时参考库存，卖出时才参考我的余额
      if (this.exchangeType) {
        return 0
      } else {
        const walletJson = this.$store.getters.getWalletJson
        if (!walletJson) {
          return 0
        }
        const coinJson = walletJson[this.coin]
        if (!coinJson) {
          return 0
        }
        return new BigNumber(coinJson.balance).minus(coinJson.frozenAmount).toNumber()
      }
    }
  },
  methods: {
    commit () {
      // 1.交易数量大于零
      if (Number(this.number) <= 0) {
        this.$message.error('交易数量必须大于零')
        return
      }
      // 2.交易金额小于最低限额
      if (Number(this.amount) < Number(this.startAmount)) {
        this.$message.error('交易金额不能小于最低限额')
        return
      }
      // 3.交易金额大于最大限额
      if (Number(this.amount) > Number(this.endAmount)) {
        this.$message.error('交易金额不能大于最大限额')
        return
      }
      // 4.交易数量不能大于库存
      if (Number(this.number) > Number(this.stockQuantity)) {
        this.$message.error('交易数量不能大于库存')
        return
      }
      // 5.卖出时，交易数量不能大于自己的余额
      if (!this.exchangeType && Number(this.number) > this.myBalance) {
        this.$message.error('交易数量不能大于您的余额')
        return
      }
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/orders/addUI',
        data: {
          businResourceId: this.businessId + '',
          oCapitalCount: this.amount + '',
          oCoinCount: this.number + ''
        }
      }).then(response => {
        this.loading = false
        this.$message.success('下单成功!')
        this.$emit('success')
        this.$emit('update:visible', false)
      }, response => {
        this.loading = false
        switch (response.body.code) {
          case 666:
            return
          case '403':
            this.$message.error('当日取消订单已超限制，不可下单!')
            break
          case 'E5203':
            this.$message.error('卖家余额不足!')
            break
          case 'NO-0023':
            this.$message.error('未通过中级实名认证!')
            break
          case 'E5208':
            this.$message.error('本人不能做交易!')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.$emit('update:visible', false)
      })
    },
    exchangeAll () {
      // 最大交易限额
      const end = (new BigNumber(this.endAmount).div(new BigNumber(this.price))).toNumber()
      const stockQuantity = Number(this.stockQuantity)
      if (this.exchangeType) {
        // 全部买入（取最小值）:商家库存--》商家最大交易限额
        this.number = stockQuantity > end ? end : stockQuantity
      } else {
        // 全部卖出（取最小值）:我的余额--》商家库存--》最大交易限额
        this.number = end < this.myBalance ? (end < stockQuantity ? end : stockQuantity) : (this.myBalance < stockQuantity ? this.myBalance : stockQuantity)
      }
    },
    qryMerchantInfo (businessId) {
      this.loading = true
      this.$http.post('/userinfo/findUserInfoByUI', {
        businessId: businessId
      }).then(response => {
        this.loading = false
        const merchant = response.body.data
        this.transactionNumber = merchant.transationNumber || 0
        this.trustNumber = merchant.trustNumber || 0
        this.praise = merchant.praise || '100%'
        this.historyQuantity = this.NumberFormat.toFixed(merchant.historyQuantity, 8) || 0
        this.avgPayTime = merchant.avgPaytime || 0
        this.avgGoodsTime = merchant.avgFbtime || 0
        this.supportPayType = merchant.payType || 0
        this.price = merchant.price + '' || 0
        // exchangeData传入的name可能是真实姓名或昵称
        this.nickname = merchant.nickname
        if (merchant.name.length < 3) {
          this.name = merchant.name[0] + '*'
        } else {
          this.name = merchant.name[0] + '*' + merchant.name[merchant.name.length - 1]
        }
        // 实名等级
        const identityAuthenticator = Number(merchant.identityAuthenticator)
        if (identityAuthenticator >= 4) {
          this.identityAuthenticator = '已通过高级认证'
        } else if (identityAuthenticator >= 3) {
          this.identityAuthenticator = '已通过中级认证'
        } else if (identityAuthenticator >= 1) {
          this.identityAuthenticator = '已通过初级认证'
        } else {
          this.identityAuthenticator = '未实名认证'
        }
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    }
  },
  created () {
    this.$store.dispatch('qryAllWallet').then()
    // 1.解析交易广告数据
    this.businessId = this.exchangeData.id
    this.exchangeType = this.exchangeData.exchangeType
    this.startAmount = this.exchangeData.startAmount || 0
    this.endAmount = this.exchangeData.endAmount || 0
    this.coin = this.exchangeData.currency || ''
    this.isFixedPrice = this.exchangeData.isFixedPrice || 0
    this.priceCurrencyType = this.exchangeData.priceCurrencyType || 'CNY'
    this.payType = this.exchangeData.payType || ''
    this.stockQuantity = this.exchangeData.stockQuantity
    this.headImage = this.exchangeData['headimg']
    // 2.补充查询商家信息
    this.qryMerchantInfo(this.businessId)
  }
}
</script>

<style scoped>
  .titleBox{width: 100%;text-align: center;font-size: 18px;color: #333;font-weight: bold;}
  /*宽550px*/
  .w550{width: 550px;position: relative;margin: 0 auto;}
  .minTitle{font-size: 12px;color: #FF7C44;}
  .mr50{margin-right: 50px;}
  .ml10{margin-left: 10px;}
  .ft14{font-size: 14px;}
  .font1{font-size: 16px;color: #333;}
  .color_font{color: #FF7C44;}

  /*卖家信息*/
  .buyBox{height: 170px;background-color: #F5F5F5;border-radius: 4px;}
  .buyTitle{color: #0BB2FE;line-height: 20px;}
  .buyTitle span{width: 4px;height: 12px;background-color: #0BB2FE;}
  .buyUlBox li{position: relative;width: 25%;float: left;}
  .buyUlBox li div,.font1{color: #333;font-size: 14px;line-height: 20px;}
  .exchangeDialog .font2{color: #666;font-size: 16px;line-height: 22px;}
  .buyUlBox li .buyUlName{color: #666;font-size: 12px;margin-top: 4px;}
  .payTypeBox{clear: both;}
  .payTypeBox div,.payTimeBox li{color: #666;font-size: 12px;}
  .payTimeBox li{position: relative;width: 50%;float: left;}
  .buyCountBox{margin: 31px 37px 0 37px;}
  /**/
  .w120{width: 120px;display: inline-table;}
  .payInputBox{width: 260px;height: 34px;border: 1px solid #D8D8D8;border-radius: 2px;}
  .payInput{border: 0;color: #000;font-size: 16px;font-weight: bold;}
  .payInput1{width: 190px;height: 34px;}
  .exchangeDialog .font3{height: 34px;border-left: 1px solid #D8D8D8;width:69px;position: absolute;
    display: inline-table;line-height: 34px;text-align: center;color: #0BB2FE;font-size: 12px;cursor: pointer;}

  .payInput2{width: 190px;height: 34px;border: 1px solid #D8D8D8;}
  .exchangeDialog .font4{color: #999;font-size: 12px;line-height: 17px;}
  .font5{color: #F55858;font-size: 12px;width: 100%;text-align: center;line-height: 17px;clear: both;}

  .bh_btnBox{position: relative;width: 100%; text-align: center;}
  .bh_btn{width: 195px; height: 34px;padding: 0;font-size: 14px;top: 0;}
  .bh-btn_plain{color: #0BB2FE;left: 85px;}
  .bh-btn_primary{color: #fff;right: 85px;}

  .w550 i{display: inline-block;
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background-color: #38f64b;
    position: absolute;
    bottom: 11%;
    right: 13%;}
</style>
