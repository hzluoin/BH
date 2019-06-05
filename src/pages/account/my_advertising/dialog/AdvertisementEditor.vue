<template>
  <div class="">
    <!--买入-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false">
      <div slot="body" v-loading="loading">
        <!--标题-->
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span>广告编辑</span>
          </el-col>
        </el-row>
        <!--2.4库存数量设置输入框-->
        <el-row class="center-float-left mt20">
          <el-col :span="4" class="center-float-left">
            <span class="is_blue"></span>
            <span class="ft16">交易数量</span>
          </el-col>
          <el-col :span="2">
            <el-input placeholder="" v-model="stockQuantity" type="number" onpaste="return false;" style="border:0 solid #d8d8d8;border-radius:2px;width:274px;height:33px;">
              <template slot="append">{{currency}}</template>
            </el-input>
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
            <span style="font-size:12px;color:#ff7c44;">启用后，您的交易价格不随币价波动，固定值不变。</span>
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
            <span class="ft16" v-show="/^1$/.test(exchangeType)">购买价设置</span>
            <span class="ft16" v-show="/^2$/.test(exchangeType)">出售价设置</span>
          </el-col>
          <el-col :span="6" class="shopout">
            <el-input @blur="numberChange(pricePercent,'pricePercent')" onfocus="value=''"  type="text" style="text-align: center" onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')" v-model="pricePercent">
              <span class="shopout_span" slot="prepend" @click="pricePercent='-30%'">-30</span>
              <span class="shopout_span" slot="append" @click="pricePercent='30%'">+30</span>
            </el-input>
          </el-col>
          <el-col :span="8" :offset="1" v-if="coinPrice">
                <span v-if="priceCurrencyType==='USD'" class="offer_span">
                 您设置的报价：<span class="offer_spantwo">{{NumberFormat.toFixed(convert('USD', coinPrice) * ((pricePercent.replace('%', '') / 100) + 1), 2)}}</span>USD/{{currency}}。
                </span>
            <span v-else class="offer_span">
                 您设置的报价：<span class="offer_spantwo">{{NumberFormat.toFixed(coinPrice * ((pricePercent.replace('%', '') / 100) + 1), 2)}}</span> CNY/{{currency}}。
                </span>
            <br>
            <span v-if="priceCurrencyType==='USD'" class="offer_span">
                  当前行情报价:<span class="bh-color_select">{{coinPrice}}$</span>
                </span>
            <span v-else class="offer_span">
                  当前行情报价:<span class="bh-color_select" style="margin-left: 12px">{{coinPrice}}</span>￥
                </span>
          </el-col>
          <el-col :span="4">
            <el-tooltip class="item" effect="light" content="为基于市场价格的溢出比例，基础市场价来源于您设置的交易所的对标价格，设定适当的溢价比例能让您的广告报价处于合理范围，比如当前价格为100，溢价比例为5%，那么价格为105."  placement="top-end">
              <img class="bh-icon_hover" src="../../../../assets/images/hello_1.svg">
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
            <input v-if="exchangeType==='1'" type="text" placeholder="设置您可接受的最高单价，留空，则不设置。" v-model="highest" style="border:0.5px solid #d8d8d8;border-radius:4px;width:324px;height:33px;">
            <input v-else type="text" placeholder="设置您可接受的最低单价，留空，则不设置。" v-model="lowest" style="border:0.5px solid #d8d8d8;border-radius:4px;width:324px;height:33px;">
          </el-col>
          <el-col :span="3">
            <el-tooltip class="item" effect="light" content="该设置可保护您的广告在低于最低价时无法进行交易，比如设置最低价为2000，而市场价处于2000以下时，您的广告将无法下单交易。"  placement="top-end">
              <img class="bh-icon_hover" src="../../../../assets/images/hello_1.svg" >
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
            <el-col :span="4" v-if="user.isOpenWechat===1">
              <el-checkbox label="1" class="ft16">微信支付</el-checkbox>
            </el-col>
            <el-col :span="4" v-if="user.isOpenAlipay===1">
              <el-checkbox label="2" class="ft16">支付宝</el-checkbox>
            </el-col>
            <el-col :span="4" v-if="user.isOpenBank===1">
              <el-checkbox label="3" class="ft16">银行转账</el-checkbox>
            </el-col>
            <el-col :span="4" v-if="user.isOpenPaypal===1">
              <el-checkbox label="4" class="ft16">PayPal</el-checkbox>
            </el-col>
          </el-checkbox-group>
          <el-col :span="4">
            <span style="font-size:16px;color:#0bb2fe;cursor: pointer;" @click="$router.push({name:'TransactionSettings'})">支付方式设置</span>
          </el-col>
        </el-row>
        <!--2.8交易限额设置输入框-->
        <el-row class="center-float-left mt20">
          <el-col :span="4" class="center-float-left">
            <span class="is_blue"></span>
            <span class="ft16">交易限额</span>
          </el-col>
          <el-col :span="10">
            <div @keyup="numberFilter(startAmount, 'startAmount')">
              <el-input placeholder="每笔交易的最低交易金额" v-model="startAmount" type="number" onpaste="return false;" style="border:0 solid #d8d8d8;border-radius:2px;width:174px;height:33px;">
                <template slot="append">{{priceCurrencyType}}</template>
              </el-input>
            </div>
            <p class="ft14 color-666" style="margin-bottom: 0;">最小限额:小于最大限额且大于20</p>
          </el-col>
          <el-col :span="10">
            <div @keyup="numberFilter(endAmount, 'endAmount')">
              <el-input placeholder="每笔交易的最高交易金额" v-model="endAmount" type="number" style="border:0 solid #d8d8d8;border-radius:2px;width:174px;height:33px;">
                <template slot="append">{{priceCurrencyType}}</template>
              </el-input>
            </div>
            <p class="ft14 color-666" style="margin-bottom: 0;">最大限额:大于最小限额且小于100000</p>
          </el-col>
        </el-row>
        <!--2.9交易限制设置复选框-->
        <el-row class="mt20">
          <el-col :span="4" class="center-float-left">
            <span class="is_blue"></span>
            <span class="ft16">交易限制设置</span>
          </el-col>
          <el-checkbox-group v-model="tranSet">
            <el-col :span="8">
              <el-checkbox label="1" class="ft16">禁止初级认证用户交易</el-checkbox>
            </el-col>
            <el-col :span="8">
              <el-checkbox label="2" class="ft16">禁止中级认证用户交易</el-checkbox>
            </el-col>
          </el-checkbox-group>
        </el-row>

        <el-row style="margin-top: 10px;" v-if="advertising.status!==1">
          <el-col :span="4" class="center-float-left">
            <span class="is_blue"></span>
            <span class="ft16">重新上架</span>
          </el-col>
          <el-col :span="6">
            <el-switch v-model="online" active-color="#4bd763" inactive-color="#DDDFE6"></el-switch>
          </el-col>
        </el-row>
        <!--取消、确认-->
        <el-row>
          <el-col :span="12">
            <button style="width: 194px; height: 34px;padding: 0;margin: 20px 40px 40px 108px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 194px; height: 34px;padding: 0;margin: 20px 50px 40px 66px;" class="bh-btn_primary" @click="commit">
              <span>确认</span>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhSlider from '../../../../components/BHSlider'
import BhDialog from '../../../../components/BHDialog'
export default {
  data () {
    return {
      // 上架状态
      online: true,
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
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    advertising: {
      type: Object,
      default: JSON.parse('{}')
    }
  },
  components: {
    BhDialog,
    BhSlider
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
          const highest = this.highest ? Number(this.highest) : Number.MAX_SAFE_INTEGER
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
          // if (availableBalance < 0) {
          //   this.$message.error('该币种可用余额不足')
          //   return
          // }
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
          // if (availableBalance <= 0) {
          //   this.$message.error('该币种可用余额不足')
          //   return
          // }
          if (stockQuantityNumber > availableBalance) {
            this.$message.error('交易数量超出可用余额')
            return
          }
          if (stockQuantityNumber * floatPriceNumber < startAmountNumber) {
            this.$message.error('交易数量总价必须大于最低交易限额')
            return
          }
          // 4.最低单价
          const lowestNumber = Number(this.lowest)
          if (lowestNumber >= floatPriceNumber) {
            this.$message.error('最低单价必须小于当前设置价格')
            return
          }
          if (lowestNumber < 0) {
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
        url: '/bussinssResource/updateUI',
        data: {
          id: this.advertising.id,
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
          exchangeResourceId: 1,
          status: this.advertising.status !== 1 && this.online ? '1' : null

        }
      }).then(response => {
        this.loading = false
        this.$message.success('交易发布成功!')
        this.$emit('success')
        this.$emit('update:visible', false)
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
      if (this[objName].indexOf('%') !== -1) {
        this[objName] = this[objName].replace('%', '')
      }
      if (this.value !== '') {
        this[objName] = this[objName] + '%'
      }
      if (Number(this[objName].replace('%', '')) > 30) {
        this[objName] = 30 + '%'
      } else {
        if (Number(this[objName].replace('%', '')) < -30) {
          this[objName] = -30 + '%'
        }
      }
      if (value.indexOf('.') !== -1) {
        if (value.split('.')[1].length > 2) {
          this[objName] = Number(value).cut(2)
          this[objName] = this[objName] + '%'
        }
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
    }
  },
  created () {
    this.online = this.advertising.status === 1
    this.exchangeType = this.advertising.businType + ''
    this.currency = this.advertising.currency
    this.stockQuantity = this.advertising.stockQuantity
    this.priceCurrencyType = /1/.test(this.advertising.priceCurrencyType.toString()) ? 'CNY' : 'USD'
    this.isFixedPrice = parseInt(this.advertising.isFixedPrice) === 1
    this.price = Number(this.advertising.price).cut(3)
    this.pricePercent = this.NumberFormat.toFixed(((this.advertising.pricePercent - 1) * 100), 2) + '%'
    this.startAmount = this.advertising.startAmount
    this.endAmount = this.advertising.endAmount
    this.highest = this.advertising.lowestPrice
    this.lowest = this.advertising.lowestPrice
    if (typeof this.advertising.payType === 'string') {
      this.payTypeList = this.advertising.payType.split(',')
    }
    if (typeof this.advertising.tranSet === 'string') {
      this.tranSet = this.advertising.tranSet.split(',')
    }
  }
}
</script>

<style scoped>
/*蓝色小竖条*/
.is_blue{
  background:#7cd6ff;
  width:2px;
  height:16px;
  display: inline-block;margin-right: 5px;
}
/*2.5 出售价设置*/
.shop_money{
  border:0 solid #d8d8d8;
  border-radius:4px;
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
.offer_span{
  font-size:12px;
  color:#999999;
}
.offer_spantwo{
  color:#0bb2fe;
}
.bh-icon_hover{width: 17px; height: 17px;display: inline-block;}
</style>
