<template>
  <div class="" >
    <!--弹窗记录查看-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :width="527" :height="0">
      <div slot="body">
        <p class="ft18 bh-font_size__large">{{changeType ? '买入' : '卖出'}}{{orderDetail.oCoinType}}</p>
        <p class="ft16">
          <span>订单信息</span>
          <span>{{orderDetail.oStatus === '1' ? '待付款' : orderDetail.oStatus === '2' ? '待确认收款' : orderDetail.oStatus === '3' ? '已收款,待放币' : orderDetail.oStatus === '4' ? '平台已放币,待确认收币' : orderDetail.oStatus === '5' ? '商家放币 ,待确认收币' : orderDetail.oStatus === '6' ? '收币完成' : orderDetail.oStatus === '7' ? '超时取消' : orderDetail.oStatus === '8' ? '手动取消' :  orderDetail.oStatus === '9' ? '订单被投诉' : orderDetail.oStatus === '10' ? '付款超时' : '状态错误'}}</span>
        </p>
        <ul>
          <li v-if="changeType">
            <span>买家</span>
            <span>{{orderDetail.sellNickName}}
              <span class="bh-color_select" v-if="orderDetail.sellAuthenticator">已实名</span>
              <span class="bh-color_prompt" v-else>未实名</span>
            </span>
          </li>
          <li v-else>
            <span>卖家</span>
            <span>{{orderDetail.buyNickName}}
              <span class="bh-color_select" v-if="orderDetail.buyAuthenticator">已实名</span>
              <span class="bh-color_prompt" v-else>未实名</span>
            </span>
          </li>
          <li><span>交易金额</span><span>{{Number(orderDetail.oCapitalCount).cut(4)}}&nbsp;{{orderDetail.oCapitalType === '1' ? 'CNY' : 'USD'}}</span></li>
          <li><span>单价</span><span>{{new BigNumber(orderDetail.oCapitalCount).div(new BigNumber(orderDetail.oCoinCount)).toString().toNumber().cut(4)}}&nbsp;{{orderDetail.oCapitalType === '1' ? 'CNY' : 'USD'}}</span></li>
          <li><span>数量</span><span>{{orderDetail.oCoinCount}}</span></li>
          <li><span>下单时间</span><span>{{new Date(orderDetail.oCreateTime).format('yyyy-MM-dd hh:mm:ss')}}</span></li>
          <li><span>订单编号</span><span>{{orderDetail.oCode}}</span></li>
        </ul>
        <p class="bh-font_size__big">支付信息</p>
        <ul v-if="/2|3|4|5|6|7|8|9/.test(orderDetail.oStatus)">
          <li v-if="orderDetail.oPayType"><span>支付方式</span><span>{{orderDetail.oPayType.toString().replace(/1/, '微信支付').replace(/2/, '支付宝支付').replace(/3/, '银行转账').replace(/4/, 'PayPal支付')}}</span></li>
          <li v-if="orderDetail.oPayType"><span>{{orderDetail.oPayType.toString().replace(/1/, '微信').replace(/2/, '支付宝').replace(/3/, '银行').replace(/4/, 'PayPal')}}账号</span><span>{{orderDetail.userAccount}}</span></li>
          <li v-if="/2|3|4|5|6/.test(orderDetail.oStatus)"><span>付款时间</span><span>{{new Date(orderDetail.oPayTime).format('yyyy-MM-dd hh:mm:ss')}}</span></li>
          <li v-if="/4|5|6/.test(orderDetail.oStatus)"><span>放币时间</span><span>{{new Date(orderDetail.oSendGoodsTime).format('yyyy-MM-dd hh:mm:ss')}}</span></li>
        </ul>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    },
    orderDetail: {
      type: Object,
      default: JSON.parse('{}')
    }
  },
  data () {
    return {
      // 交易类型: true买入，false卖出
      changeType: true
    }
  },
  components: {
    BhDialog
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  created () {
    this.changeType = this.orderDetail.oBuyerId === this.user.userId
  }
}
</script>

<style scoped>
  p {
    margin: auto;
  }
  ul {
    float: left;
  }

  ul, li {
    display: block;
    width: 100%;
    float: left;
  }

  li>span {
    font-size:14px;
    color:#666;
    line-height: 150%;
  }

  li>span:first-child{
    float: left;
  }

  li>span:last-child{
    float: right;
  }

  p.bh-font_size__large {
    text-align: center;
    font-weight: bold;
  }

  p.bh-font_size__big {
    float: left;
    width: 100%;
    line-height: 200%;
    border-bottom: 1px solid gray;
  }

  p>span:first-child {
    float: left;
  }

  p>span:last-child {
    float: right;
    font-size: 14px;
    color: #0BB2FE;
  }
</style>
