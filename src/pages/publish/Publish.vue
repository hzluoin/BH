<template>
  <div class="bh-publish_root">
    <header class="bh-background_main">
      <navigation></navigation>
    </header>

    <main>
      <!--1交易发布说明-->
      <div class="bh-publish_explain">
        <div class="color-333 ft18">免费发布场外交易商家广告</div>
        <div class="bh-publish_explain-content">
          <!--1.1满足申请的条件-->
          <div><span class="bh-serial-number">1</span><span class="ft16 color-333">满足申请条件</span></div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="ft14 color-666">通过实名中级认证</span>
            <span class="ft16 color-333 cur" v-if="user.identityAuthenticator<3">不符合</span>
            <span class="ft16 color-333" v-else>符合</span>
            <button class="bh-btn_plain" v-if="user.identityAuthenticator<3" @click="$router.push({name: 'Authentication'})">去认证</button>
          </div>
          <!--<div>-->
            <!--<span class="bh-serial-number bh-visibility_hidden"></span>-->
            <!--<span class="ft14 color-666">场外交易 ≥5笔</span><span class="ft16 color-333">（您已成交{{record}}笔)。</span>-->
          <!--</div>-->
          <!--1.2费用说明-->
          <div><span class="bh-serial-number">2</span><span class="ft16 color-333">费用说明</span></div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="ft14 color-666">{{currency}}广告费：2019-01-01 0:00 ~ 2019-12-31 23:59免费。</span>
          </div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="ft14 color-666">{{currency}}成交手续费：成交额的{{wallet[currency] ? (wallet[currency]['platformRate'] * 100) : 0.1}}%</span>
          </div>
          <!--1.3展示说明-->
          <div><span class="bh-serial-number">3</span><span class="ft16 color-333">展示说明</span></div>
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="ft14 color-666">广告有效期：15天</span>
          </div>
          <!--<div>-->
            <!--<span class="bh-serial-number bh-visibility_hidden"></span>-->
            <!--<span class="ft14 color-666">账户余额需大于 0.1 BTC，广告才可展示，若少于0.1个BTC，您需要用比特币为您的8bihui钱包充值。</span>-->
          <!--</div>-->
          <div>
            <span class="bh-serial-number bh-visibility_hidden"></span>
            <span class="ft14 color-666">若您想直接编辑已创建的广告，请查看<button @click="$router.push({name: 'MyAdvertising'})" class="bh-btn_text bh-color_select">我的交易广告。</button></span>
          </div>
        </div>
      </div>
      <!--2.发布交易设置-->
      <div class="bh-publish_settings">
        <div class="color-333 ft18">发布交易广告</div>
        <div class="bh-publish_settings-content">
          <!--2.1交易类型设置按钮-->
          <el-row class="btnone">
            <el-col :span="5">
              <el-radio-group :span="24" v-model="exchangeType">
                <el-radio-button :span="10" label="1">我要买币</el-radio-button>
                <el-radio-button :span="10" label="2">我要卖币</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
          <!--2.2交易币种-->
          <el-row class="center-float-left mt20">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">交易币种</span>
            </el-col>
            <el-col :span="8">
              <el-radio-group v-model="currency">
                <el-radio label="BTC" class="ft16">BTC</el-radio>
                <el-radio label="ETH" class="ft16">ETH</el-radio>
                <el-radio label="GXC" class="ft16">GXC</el-radio>
                <el-radio v-if="!/BTC|ETH|GXC/.test(currency)" :label="currency" class="ft16">{{currency}}</el-radio>
              </el-radio-group>
            </el-col>
            <el-col :span="2" class="bh-input_border">
              <el-select v-model="currency" filterable placeholder="搜索" class="search_one">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
                <el-option
                  v-for="item in coinList"
                  :key="item.symbol"
                  :label="item.symbol"
                  :value="item.symbol">
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <!--2.3交易法币-->
          <!--<el-row class="mt20">-->
            <!--<el-col :span="4" class="center-float-left">-->
              <!--<span class="is_blue"></span>-->
              <!--<span class="ft16">交易法币</span>-->
            <!--</el-col>-->
            <!--<el-col :span="2">-->
              <!--<el-radio v-model="priceCurrencyType" label="CNY" class="ft16">CNY</el-radio>-->
            <!--</el-col>-->
            <!--<el-col :span="2">-->
              <!--<el-radio v-model="priceCurrencyType" label="USD" class="ft16">USD</el-radio>-->
            <!--</el-col>-->
          <!--</el-row>-->
          <!--2.4库存数量设置输入框-->
          <el-row class="center-float-left mt20">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">交易数量</span>
            </el-col>
            <el-col :span="6">
              <el-input placeholder="" v-model="stockQuantity" type="number" onpaste="return false;" class="inputNum">
                <template slot="append">{{currency}}</template>
              </el-input>
            </el-col>
            <el-col :span="14" v-if="/2/.test(exchangeType) && wallet[this.currency]['availableBalance'] <= 0">
              <span class="ft14 color-666">您还未持有该币种，无法发起出售交易，请<span class="cur" style="color:#0bb2fe;" @click="$router.push({name:'TopUp', params: {coin: currency}})">去充币</span>后再次尝试</span>
            </el-col>
          </el-row>
          <!--2.5交易价格方式开关：浮动报价或固定报价-->
          <el-row class="center-float-left mt20">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">固定价格交易</span>
            </el-col>
            <!--打开、关闭按钮-->
            <el-col :span="2" >
              <el-switch v-model="isFixedPrice" active-color="#4bd763" inactive-color="#DDDFE6"></el-switch>
            </el-col>
            <!--可隐藏可显示、可隐藏可显示-->
            <el-col :span="18" v-show="isFixedPrice">
              <i class="iconfont icon-tanhao"></i>
              <span class="ft12" style="color:#ff7c44;">启用后，您的交易价格不随币价波动，固定值不变。</span>
            </el-col>
          </el-row>
          <!--2.5.1固定交易价格输入框-->
          <el-row class="center-float-left mt20" v-show="isFixedPrice">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">交易价设置</span>
            </el-col>
            <el-col :span="7">
              <div @keyup="numberFilter(price, 'price')">
                <el-input v-model="price" type="number" step="0.01" maxlength="10" @focus="priceFocus=true" placeholder="不随市场波动价改变出售价格"  class="shop_money"></el-input>
              </div>
              <transition name="el-fade-in-linear">
                <span  v-if="priceFocus && !checkPrice" class="bh-hint bh-color_prompt shop_money_span">{{isPriceMsg}}</span>
              </transition>
            </el-col>
            <el-col :span="10">
                <span v-if="priceCurrencyType==='USD'" class="bh-color_select">
                  当前行情价格:{{convert('USD', coinPrice)}}$
                </span>
              <span v-else class="bh-color_select">
                  当前行情价格:{{coinPrice}}￥
                </span>
            </el-col>
          </el-row>
          <!--2.5.2浮动报价设置-->
          <el-row class="center-float-left mt20" v-show="!isFixedPrice">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16" v-show="exchangeType === '1'">购买价设置</span>
              <span class="ft16" v-show="exchangeType === '2'">出售价设置</span>
            </el-col>
            <el-col :span="3" class="shopout">
              <el-input @focus="numberFocus()" @blur="numberChange(pricePercent,'pricePercent')" type="text" class="center" value="pricePercent" v-model="pricePercent" max="30" min="-30"><!-- onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')" -->
                <div class="shopout_span" slot="prepend" @click="pricePercent='-30%'">-30%</div>
                <div class="shopout_span" slot="append" @click="pricePercent='30%'">+30%</div>
              </el-input>
            </el-col>
            <el-col :span="5" class="offer" v-if="coinPrice">
                <span v-if="priceCurrencyType==='USD'" class="ft12 color-999">
                 您设置的报价：<span class="offer_spantwo">{{!isNaN(pricePercent.replace('%', '')) ? NumberFormat.toFixed(convert('USD', coinPrice) * ((pricePercent.replace('%', '') / 100) + 1), 4) : 0}}</span>USD/{{currency}}。
                </span>
              <span v-else class="ft12 color-999">
                 您设置的报价：<span class="offer_spantwo">{{!isNaN(pricePercent.replace('%', '')) ? NumberFormat.toFixed(coinPrice * ((pricePercent.replace('%', '') / 100) + 1), 4) : 0}}</span> CNY/{{currency}}。
                </span>
              <br>
              <span v-if="priceCurrencyType==='USD'" class="ft12 color-999">
                  当前行情报价:<span class="bh-color_select">{{coinPrice}}$</span>
                </span>
              <span v-else class="ft12 color-999">
                  当前行情报价:<span class="bh-color_select ml12">{{coinPrice}}</span>￥
                </span>
            </el-col>
            <el-col :span="4">
              <el-tooltip class="item" effect="light" content="为基于市场价格的溢出比例，基础市场价来源于您设置的交易所的对标价格，设定适当的溢价比例能让您的广告报价处于合理范围，比如当前价格为100，溢价比例为5%，那么价格为105."  placement="top-end">
                <img class="bh-icon_hover" src="../../assets/images/hello_1.svg">
              </el-tooltip>
            </el-col>
          </el-row>
          <!--2.6最高、低单价设置输入框-->
          <el-row class="center-float-left mt20" v-show="!isFixedPrice">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16" v-if="exchangeType==='1'">最高单价设置</span>
              <span class="ft16" v-else>最低单价设置</span>
            </el-col>
            <el-col :span="7">
              <input v-if="exchangeType==='1'" type="text" placeholder="设置您可接受的最高单价，留空，则不设置。" v-model="highest" class="inputPrice">
              <input v-else type="text" placeholder="设置您可接受的最低单价，留空，则不设置。" v-model="lowest" class="inputPrice">
            </el-col>
            <el-col :span="3">
              <el-tooltip class="item" effect="light" content="该设置可保护您的广告在低于最低价时无法进行交易，比如设置最低价为2000，而市场价处于2000以下时，您的广告将无法下单交易。"  placement="top-end">
                <img class="bh-icon_hover" src="../../assets/images/hello_1.svg" >
              </el-tooltip>
            </el-col>
          </el-row>
          <!--2.7支付方式选择复选框-->
          <el-row class="mt20">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">支付方式</span>
            </el-col>
            <el-checkbox-group v-model="payTypeList">
              <el-col :span="3" v-if="user.isOpenWechat===1">
                <el-checkbox label="1" class="ft16">微信支付</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenAlipay===1">
                <el-checkbox label="2" class="ft16">支付宝</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenBank===1">
                <el-checkbox label="3" class="ft16">银行转账</el-checkbox>
              </el-col>
              <el-col :span="3" v-if="user.isOpenPaypal===1">
                <el-checkbox label="4" class="ft16">PayPal</el-checkbox>
              </el-col>
            </el-checkbox-group>
            <el-col :span="3">
              <span class="ft16 cur" style="color:#0bb2fe;" @click="$router.push({name:'TransactionSettings'})">支付方式设置</span>
            </el-col>
          </el-row>
          <!--2.8交易限额设置输入框-->
          <el-row class="center-float-left mt20">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">交易限额</span>
            </el-col>
            <el-col :span="8">
              <div @keyup="numberFilter(startAmount, 'startAmount')">
                <el-input placeholder="每笔交易的最低交易金额" v-model="startAmount" type="number" onpaste="return false;" class="inputNum">
                  <template slot="append">{{priceCurrencyType}}</template>
                </el-input>
              </div>
              <p class="ft14 color-666 mb0">最小限额:小于最大限额且大于20</p>
            </el-col>
            <el-col :span="8">
              <div @keyup="numberFilter(endAmount, 'endAmount')">
                <el-input placeholder="每笔交易的最高交易金额" v-model="endAmount" type="number" class="inputNum">
                  <template slot="append">{{priceCurrencyType}}</template>
                </el-input>
              </div>
              <p class="ft14 color-666 mb0">最大限额:大于最小限额且小于100000</p>
            </el-col>
          </el-row>
          <!--2.9交易限制设置复选框-->
          <el-row class="mt20">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">交易限制设置</span>
            </el-col>
            <el-checkbox-group v-model="tranSet">
              <el-col :span="4">
                <el-checkbox label="1" class="ft16">禁止初级认证用户交易</el-checkbox>
              </el-col>
              <el-col :span="4">
                <el-checkbox label="2" class="ft16">禁止中级认证用户交易</el-checkbox>
              </el-col>
              <!--<el-col :span="4">-->
                <!--<el-checkbox label="3" class="ft16">禁止高级认证用户交易</el-checkbox>-->
              <!--</el-col>-->
              <!--<el-col :span="4">-->
                <!--<el-checkbox label="4" class="ft16">仅限受信任的交易者</el-checkbox>-->
              <!--</el-col>-->
              <!--<el-col :span="4" style="margin-left: -14px;">-->
                <!--<el-checkbox label="5" class="ft16">禁止新手交易(0次交易)</el-checkbox>-->
              <!--</el-col>-->
            </el-checkbox-group>
          </el-row>
          <!--3.注意事项-->
          <el-row class="mt10">
            <el-col :span="4" class="center-float-left">
              <span class="is_blue"></span>
              <span class="ft16">注意事项</span>
            </el-col>
            <el-col>
              <div class="noteList">
                <ul class="ml10 ul1 pt10">
                  <li class="ft14">1、为了保证用户的交易安全，将采用数字货币托管系统，严禁绕过平台私下交易，违者将自行承担损失，且永久封号。</li>
                  <li class="ft14">2、发布广告后请履行契约精神，恶意抬价或者是反悔，被投诉将冻结账户3-14天不等。</li>
                  <li class="ft14">3、请勿在8bihui尝试欺诈行为，违者将会导致账号被冻结，并承担法律责任。</li>
                </ul>
                <div class="mt20">
                  <ul class="ml10">
                    <li class="ft14 color-666 mb5"><span class="bh-serial-number">1</span> 交易过程中，请先确认款项入账后再释放数字货币。</li>
                    <li class="ft14 color-666 mb5"><span class="bh-serial-number">2</span> 交易过程中，不要透露与您账户安全有关的敏感资讯。</li>
                    <li class="ft14 color-666 mb5"><span class="bh-serial-number">3</span> 不要直接透露你的电子邮箱给买家，否则有可能会收到诈骗信件，及对账户安全造成危害。</li>
                    <li class="ft14 color-666 mb5"><span class="bh-serial-number">4</span> 永远确保你在正确的8bihui网站上，请将网站记录在书签上，避免误闯钓鱼网站。</li>
                    <li class="ft14 color-666 mb5"><span class="bh-serial-number">5</span> 8bihui员工和客服将不会以官方名义与您进行交易，请不要与自称是8bihui的员工进行交易，避免利益损失。</li>
                  </ul>
                </div>
              </div>
            </el-col>
          </el-row>
          <!--4.发布交易广告提交按钮-->
          <el-row class="center">
            <button class="bh-btn_primary ft16" @click="commit" :disabled="loading">
              <i v-if="loading" class="el-icon-loading"></i>
              <span v-else>发布交易广告</span>
            </button>
          </el-row>
        </div>
      </div>
    </main>

  </div>
</template>

<script>
import Navigation from '../../components/Navigation'
export default {
  components: {
    Navigation
  },
  data () {
    return {
      // 用户已完成的场外交易数量
      record: 0,
      // 交易类型:1买入;2卖出
      exchangeType: '1',
      // 交易币种
      currency: 'BTC',
      // 交易数量
      stockQuantity: 0,
      // 交易法币
      priceCurrencyType: 'CNY',
      // 是否固定价格:1是，0否
      isFixedPrice: false,
      // 出售单价
      price: null,
      // 溢价比例
      pricePercent: '0%',
      // 最高价格设置
      highest: '',
      // 最低价格设置
      lowest: null,
      // 支付方式
      payTypeList: [],
      // 出售价设置
      isPriceMsg: '交易价格不能为空或零!',
      priceFocus: false,
      // 最小限额
      startAmount: 20,
      // 最大限额
      endAmount: 100000,
      // 交易设置1.禁止初级用户交易 2禁止终极认证用户交易 3.禁止高级认证用户交易 4仅限受信任的用户交易 5禁止新手交易
      tranSet: [],
      loading: false
    }
  },
  computed: {
    convert () {
      return this.$store.getters.convert
    },
    // 所选币种价格
    coinPrice () {
      if (this.$store.getters.getAllCoinPrice[this.currency]) {
        return this.$store.getters.getAllCoinPrice[this.currency]['current_price']
      } else {
        return 0
      }
    },
    // 币种列表
    coinList () {
      return this.$store.getters.getOtcCoin || {
        BTC: {
          symbol: 'BTC'
        }
      }
    },
    // 钱包信息
    wallet () {
      return this.$store.getters.getWalletJson
    },
    user () {
      return this.$store.getters.getUser
    },
    // 出售价设置位数校验
    checkPrice () {
      if (!this.priceFocus) {
        return true
      }
      if (this.price) {
        return true
      }
      return false
    }
  },
  methods: {
    commit () {
      const stockQuantityNumber = Number(this.stockQuantity)
      const priceNumber = Number(this.price)
      const floatPriceNumber = Number(this.coinPrice * ((this.pricePercent.replace('%', '') / 100) + 1)).cut(2)
      const startAmountNumber = Number(this.startAmount)
      const endAmountNumber = Number(this.endAmount)
      // 1.中级实名
      if (this.$store.getters.getUser.identityAuthenticator <= 2) {
        this.$message.error('请完成中级实名认证')
        return
      }
      // 2.五笔场外交易
      // if (this.record < 5) {
      //   this.$message.error('请先完成五笔场外交易')
      //   return
      // }
      if (this.exchangeType === '1') {
        // A.买入逻辑
        if (this.isFixedPrice) {
          // A.A固定交易价格
          // 3.交易数量
          if (stockQuantityNumber <= 0) {
            this.$message.error('交易数量必须大于零')
            return
          }
          // 4.交易价格
          if (!priceNumber) {
            this.$message.error('交易价格必须大于零')
            return
          }
          if (stockQuantityNumber * priceNumber < startAmountNumber) {
            this.$message.error('交易数量总价必须大于最低交易限额')
            return
          }
        } else {
          // A.B浮动交易价格
          // 3.交易数量
          if (stockQuantityNumber <= 0) {
            this.$message.error('交易数量必须大于零')
            return
          }
          if (stockQuantityNumber * floatPriceNumber < startAmountNumber) {
            this.$message.error('交易数量总价必须大于最低交易限额')
            return
          }
          // 4.最高单价
          const highest = this.highest === '' ? Number.MAX_SAFE_INTEGER : this.highest
          if (highest <= floatPriceNumber) {
            this.$message.error('最高单价必须大于当前设置价格')
            return
          }
        }
      } else {
        // B.卖出逻辑
        const availableBalance = this.wallet[this.currency]['availableBalance']
        if (this.isFixedPrice) {
          // B.A固定交易价格
          // 3.交易数量
          if (availableBalance < 0) {
            this.$message.error('该币种可用余额不足')
            return
          }
          if (stockQuantityNumber > availableBalance) {
            this.$message.error('交易数量超出可用余额')
            return
          }
          // 4.交易价格
          if (!priceNumber) {
            this.$message.error('交易价格必须大于零')
            return
          }
          if (stockQuantityNumber * priceNumber < startAmountNumber) {
            this.$message.error('交易数量总价必须大于最低交易限额')
            return
          }
        } else {
          // B.B浮动交易价格
          // 3.交易数量
          if (availableBalance <= 0) {
            this.$message.error('该币种可用余额不足')
            return
          }
          if (stockQuantityNumber > availableBalance) {
            this.$message.error('交易数量超出可用余额')
            return
          }
          if (stockQuantityNumber * floatPriceNumber < startAmountNumber) {
            this.$message.error('交易数量总价必须大于最低交易限额')
            return
          }
          // 4.最低单价
          if (this.lowest >= floatPriceNumber) {
            this.$message.error('最低单价必须小于当前设置价格')
            return
          }
          if (this.lowest < 0) {
            this.$message.error('最低单价必须大于或等于零')
            return
          }
        }
      }
      // 5.交易限额
      if (startAmountNumber < 20) {
        this.$message.error('最低限额不能小于20')
        return
      }
      if (endAmountNumber > 100000) {
        this.$message.error('最高限额不能大于100000')
        return
      }
      if (startAmountNumber > endAmountNumber) {
        this.$message.error('最低限额不能大于最高限额')
        return
      }
      // 6.支付方式
      if (this.payTypeList.length === 0) {
        this.$message.error('请选择至少一种支付方式')
        return
      }
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/addBussinssResourceUI',
        data: {
          // 最小限额
          startAmount: startAmountNumber,
          // 最大限额
          endAmount: endAmountNumber,
          // 单价
          price: priceNumber,
          // 价格(币种)
          priceCurrencyType: this.priceCurrencyType === 'CNY' ? 1 : 2,
          // 溢价比例
          pricePercent: (this.pricePercent.replace('%', '') / 100) + 1,
          lowestPrice: this.exchangeType === '1' ? this.highest : this.lowest,
          // 交易类型
          businType: this.exchangeType,
          // 数字币种
          currency: this.currency,
          quantity: 0,
          // 出售(买入)数量
          stockQuantity: this.stockQuantity,
          // // 支付方式
          payType: this.payTypeList.sort().toString(),
          // 交易设置
          tranSet: this.tranSet.toString(),
          // 是否启动固定价格交易
          isFixedPrice: this.isFixedPrice ? '1' : '0',
          // 对接交易所
          exchangeResourceId: 1

        }
      }).then(response => {
        this.loading = false
        this.$message.success('交易发布成功!')
        this.$router.push({name: 'MyAdvertising'})
      }, response => {
        this.loading = false
        if (response.body.code === 666) {
          return
        }
        switch (response.body.code) {
          case 666:
            return
          case 'NO_004':
            this.$message.error('余额不足!')
            break
          case 'NO_005':
            this.$message.error('请先绑定银行卡!')
            break
          case 'BS_2034':
            this.$message.error('已经存在该币种的广告!')
            break
          default:
            this.$message.error(response.body.msg)
            break
        }
      })
    },
    numberChange (value, objName) {
      if (!isNaN(value)) {
        if (this[objName].indexOf('%') !== -1) {
          this[objName] = this[objName].replace('%', '')
        }
        if (Number(this[objName].replace('%', '')) > 30) {
          this[objName] = 30 + '%'
        } else if (Number(this[objName].replace('%', '')) < -30) {
          this[objName] = -30 + '%'
        } else if (parseInt(value) === 0 || value.trim() === '') {
          this[objName] = 0 + '%'
        } else {
          this[objName] = value + '%'
        }
        if (value.indexOf('.') !== -1) {
          if (value.split('.')[1].length > 2) {
            this[objName] = Number(value).cut(2)
            this[objName] = this[objName] + '%'
          }
        }
      } else {
        this[objName] = 0 + '%'
      }
    },
    numberFilter (value, objName) {
      if (Number(value) > 1000000) {
        this[objName] = 1000000
      }
      if (value.indexOf('.') === -1) {
        this[objName] = Number(value).cut(3)
      } else {
        if (value.split('.')[1].length > 3) {
          this[objName] = Number(value).cut(3)
        }
      }
    },
    numberFocus () {
      this.value = ''
      this.pricePercent = ''
    }
  },
  created () {
    // this.$store.dispatch('encryptConnection', {
    //   url: '/assetRecord/queryAssetRecordListUI',
    //   data: {}
    // }).then(response => {
    //   const data = response.body.data
    //   let total = 0
    //   for (let i in data) {
    //     if (/^1$|^2$|^5$|^6$/.test(data[i]['businType'])) {
    //       total++
    //     }
    //   }
    //   this.record = total
    // }, response => {
    //   switch (response.body.code) {
    //     case 666:
    //       return
    //     default:
    //       this.$message.error(response.body.msg)
    //   }
    // })
    // 初始化用户信息、钱包信息
    this.$store.dispatch('qryUserInfo').then()
    this.$store.dispatch('qryAllWallet').then()
  }
}
</script>

<style scoped>
  .el-radio-button:first-child .el-radio-button__inner{
    border-radius: 25px 0 0 25px;
  }
  main {
    background-color: #F2F3F8;
    padding-top: 20px;
    padding-bottom: 80px;
  }

  main>div {
    width: 1200px;
    margin: auto;
  }

  /*1.发布交易说明*/
  /*1.1标题*/
  .bh-publish_explain>div:first-child{
    background: #f9f7fe;
    height: 60px;
    line-height: 60px;
    padding-left: 18px;
  }
  /*1.2内容*/
  .bh-publish_explain-content {
    padding: 18px 18px 21px 18px;
    background-color: #FFF;
  }

  .bh-publish_explain-content .bh-serial-number {
    margin-right: 7px;
  }

  .bh-visibility_hidden {
    visibility: hidden;
  }

  /*1.2.1满足申请条件*/
  .bh-publish_explain-content>div:nth-child(2) {
    margin-top: 10px;
  }

  .bh-publish_explain-content>div:nth-child(2)>:nth-child(3) {
    display: inline-block;
    margin-left: 9px;
    margin-right: 36px;
    padding: 2px 10px;
    background-color: #FFEEEE;
    color: #f55858;
    font-size: 12px;
  }

  .bh-publish_explain-content>div:nth-child(2)>:nth-child(4) {
    border-radius: 999px;
  }

  /*1.2.2费用说明*/
  .bh-publish_explain-content>:nth-child(4) {
    margin-top: 20px;
  }

  .bh-publish_explain-content>:nth-child(5) {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  /*1.2.3展示说明*/
  .bh-publish_explain-content>:nth-child(7) {
    margin-top: 20px;
  }

  .bh-publish_explain-content>:nth-child(8) {
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .bh-publish_explain-content>:nth-child(9) {
    margin-bottom: 5px;
  }

  .bh-publish_explain-content>:nth-child(10) .bh-btn_text{
    color: #0BB2FE;
  }

  /*2.发布交易设置 */
  .bh-publish_settings {
    margin-top: 20px;
  }
  /*2.1标题*/
  .bh-publish_settings>:first-child {
    background: #f9f7fe;
    height: 60px;
    line-height: 60px;
    padding-left: 18px;
  }

  /*2.1内容*/
  .bh-publish_settings-content {
    padding: 25px 18px 25px 18px;
    background-color: #FFF;
  }
  /*蓝色小竖条*/
  .is_blue{
    background:#7cd6ff;
    width:2px;
    height:16px;
    display: inline-block;margin-right: 5px;
  }
  /*2.2 交易类型选择按钮*/
  .btnone el-radio-group{
    height: 50px;
  }
  /*2.5 出售价设置*/
  .shop_money{
    border:0 solid #d8d8d8;
    border-radius:4px;
    width:324px;
    height:33px;
  }
  .shop_money_span{
    position: absolute;
    top: 35px;
    left: 194px;
  }
  /*出售价设置*/
  .shopout_span{
    cursor:pointer;
  }
  .offer{
    margin-left: 5%;
  }
  .offer_spantwo{
    color:#0bb2fe;
  }
  .mb0{margin-bottom: 0;}
  .ml12{margin-left: 12px;}
  /*注意事项*/
  .bh-icon_hover{width: 17px; height: 17px;display: inline-block;}
  /*交易数量*/
  .inputNum{border:0 solid #d8d8d8;border-radius:2px;width:274px;height:33px;}
  /*最高单价设置*/
  .inputPrice{border:0.5px solid #d8d8d8;border-radius:4px;width:324px;height:33px;}
  /*注意事项*/
  .noteList{background:#fafafa;width:980px;height:254px;margin: -15px 0 20px 190px;}
  .noteList .ul1 li{color:#ff7c44;margin-top: 8px;}
  /*提交按钮*/
  .bh-btn_primary{width:248px;height:44px;}
</style>
