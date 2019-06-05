<template>
  <div class="">
    <!--确认购买-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="590" :height="530">
      <div slot="body">
        <!--标题-->
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span>确认购买BTC</span>
          </el-col>
        </el-row>
        <!--订单号、卖家-->
        <el-row style="text-align: center;margin: 10px 0 10px 0;">
          <el-col :span="12">
            <span style="font-size:14px;color:#333333;">订单号:</span>
            <span style="font-size:14px;color:#0bb2fe;"> 18515494626586</span>
          </el-col>
          <el-col :span="12">
            <span style="font-size:14px;color:#333333;margin-left: 20px;">卖家:</span>
            <span style="font-size:14px;color:#0bb2fe;"> lokloo</span>
          </el-col>
        </el-row>
        <!--金额、数量、价格-->
        <el-row style="margin: 0 0 10px 50px;">
          <el-col :span="8">
            <span style="font-size:14px;color:#333333;">金额:</span>
            <span style="font-size:14px;color:#0bb2fe;">  666.00CNY</span>
          </el-col>
          <el-col :span="8"><span style="font-size:14px;color:#333333;">数量:  0.01btc</span></el-col>
          <el-col :span="8"><span style="font-size:14px;color:#333333;">价格:  6000.00</span></el-col>
        </el-row>
        <!--选择付款方式-->
        <el-row style="margin: 0 0 10px 50px;">
          <span style="font-size:14px;color:#333333;">选择付款方式:</span>
          <el-radio v-model="payType" label="2" class="is-checked-all">支付宝</el-radio>
          <el-radio v-model="payType" label="1" class="is-checked-all">微信支付</el-radio>
          <el-radio v-model="payType" label="3" class="is-checked-all">银行转账</el-radio>
          <el-radio v-model="payType" label="4" class="is-checked-all">Paypal</el-radio>
        </el-row>
        <!--扫码、二维码-->
        <el-row style="text-align: center;margin-bottom: 10px;">
            <img src="../../../assets/images/qr_code.jpg" alt="">
        </el-row>
        <!--倒计时-->
        <el-row style="text-align: center;margin-bottom: 8px;">
          <span style="font-size: 14px;color:#666666;"><i class="el-icon-time"></i>&nbsp;付款倒计时:</span>
          <span style="font-size:14px;color:#ff7c44;">11分20秒</span>
        </el-row>
        <div style="border:1px solid #d8d8d8;width: 454px;margin-left: 37px;"></div>
        <!--详情-->
        <el-row style="margin-bottom: 6px;">
          <div style="background:#fff5f0;width:454px;height:144px;margin: 0 auto;font-size:12px;color:#ff7c44;">
            <ul style="margin:10px 0 0 6px;padding-top:4px;" class="bh_ul_li">
              <li>1.线下支付完成后，请务必点击【已支付】，避免15分钟后超时。</li>
              <li>2.请勿备注任何数字资产名称于转账备注，防止造成您的汇款被拦截。</li>
              <li>3.只能本人实名银行卡、支付宝、微信付款，银行转账请备注/附言订单后4位数字。</li>
              <li>4.大于5W以上汇款，请分批支付保证能及时到账(≤5W汇款可及时到账)。</li>
              <li>5.请使用能及时到账的支付方式，无法规定时间内付款，卖家有权退回款项并取消订单。</li>
            </ul>
          </div>
        </el-row>
        <!--取消、确认-->
        <el-row>
          <el-col :span="12">
            <button style="width: 212px; height: 34px;padding: 0;margin: 10px 40px 40px 40px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 212px; height: 34px;padding: 0;margin: 10px 50px 40px 15px;" class="bh-btn_primary" @click="commit">
              <span>确认</span>
              <i class="el-icon-loading" v-if="committing"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
export default {
  data () {
    return {
      committing: false,
      // 支付方式(1微信 2支付宝 3银行卡4 paypal 多种支付方式用逗号间隔)
      payType: '2'
    }
  },
  name: 'IsBuying',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BhDialog
  },
  computed: {
  },
  methods: {
    commit () {
      if (this.committing) {
        return
      } else {
        this.committing = true
      }
      console.log('....commit')
    }
  }
}
</script>

<style scoped>
.bh_ul_li li{
  margin:10px 0 10px 0;
}
  .is-checked-all{
    margin-left: 5px;
  }
</style>
