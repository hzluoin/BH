<template>
  <div class="">
    <!--买入-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="590" :height="530">
      <div slot="body">
        <!--标题-->
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span>出售BTC</span>
          </el-col>
        </el-row>
        <!--用户头像 -->
        <div style="margin:0 0 6px 25px;">
          <el-row style="margin: 0 0 20px 20px;">
            <el-col style="display: block;width: 50px;height: 50px;"><img src="../../../assets/images/headimg.png" alt="" style="border-radius: 50%;"></el-col>
          </el-row>
          <el-row style="margin: -52px 0 6px 90px;">
            <el-col>
              <span>loklok</span>
            </el-col>
            <el-col>
              <span>李**</span>
            </el-col>
            <el-col style="margin: -20px 0 30px 80px;width: 140px; height: 30px;background:#fff5f0;border-radius:2px;line-height: 30px;text-align: center;color:#ff7c44;font-size: 12px;">
              <img src="../../../assets/images/v_1.svg" alt="" style="display: inline-block; width: 13px; height: 11px;">
              <span>已通过高级认证</span>
            </el-col>
            <el-col style="margin: -60px 0 30px 245px;width: 140px; height: 30px;background:#fff5f0;border-radius:2px;line-height: 30px;text-align: center;color:#ff7c44;font-size: 12px;">
              <img src="../../../assets/images/shop.svg" alt="" style="display: inline-block; width: 13px; height: 11px;">
              <span>平台VIP商户</span>
            </el-col>
          </el-row>
        </div>
        <!--导航明细-->
        <div style="text-align: center;">
          <el-row style="font-size:14px;color:#333333;">
            <el-col :span="6">交易次数</el-col>
            <el-col :span="6">信任人数</el-col>
            <el-col :span="6">好评度</el-col>
            <el-col :span="6">支付付款方式</el-col>
          </el-row>
          <!--导航明细数据-->
          <el-row style="font-size:14px;color:#666666;">
            <el-col :span="6">1000+</el-col>
            <el-col :span="6">1934</el-col>
            <el-col :span="6">99%</el-col>
            <el-col :span="6">
              <span><img style="width:16px;height:15px;" src="../../../assets/images/obank.svg" alt=""></span>
              <span><img style="width:16px;height:15px;" src="../../../assets/images/owechat.svg" alt=""></span>
              <span><img style="width:16px;height:15px;" src="../../../assets/images/oalipay.svg" alt=""></span>
              <span><img style="width:16px;height:15px;" src="../../../assets/images/opaypal.svg" alt=""></span>
            </el-col>
          </el-row>
        </div>
        <!--支付方式-->
        <el-row style="margin:15px 0 15px 40px;">
          <span style="font-size:14px;color:#333333;">支付付款方式:</span>
          <el-col style="margin: -15px 0 0 100px;">
            <span><img style="width:16px;height:15px;" src="../../../assets/images/obank.svg" alt=""></span>
            <span><img style="width:16px;height:15px;" src="../../../assets/images/owechat.svg" alt=""></span>
            <span><img style="width:16px;height:15px;" src="../../../assets/images/oalipay.svg" alt=""></span>
            <span><img style="width:16px;height:15px;" src="../../../assets/images/opaypal.svg" alt=""></span>
          </el-col>
        </el-row>
        <!--付款时间-->
        <el-row style="margin:0 0 15px 40px;">
          <el-col>
            <span style="font-size:14px;color:#333333;">评价付款时间:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2min</span>
          </el-col>
          <el-col style="margin:-14px 0 10px 280px;">
            <span style="font-size:14px;color:#333333;">平均放币时间:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.5min</span>
          </el-col>
        </el-row>
        <div style="border:1px solid #d8d8d8;width: 456px;margin-left: 40px;"></div>
        <!--浮动报价-->
        <el-row style="margin:20px 0 15px 50px;">
          <span style="font-size:14px;color:#333333;">浮动报价 (CNY)&nbsp;&nbsp;&nbsp;&nbsp;60500</span>
        </el-row>
        <!--出售数量-->
        <el-row style="margin:20px 0 15px 40px;width: 454px;height: 40px;background:#f2f3f8;border-radius:2px;line-height: 40px;">
          <span style="font-size:14px;color:#333333;margin-left: 10px;">出售数量 (CNY)&nbsp;&nbsp;&nbsp;&nbsp;0.1</span>
          <span style="font-size:14px;color:#0bb2fe;margin-left: 230px;cursor: pointer;">全部卖出</span>
        </el-row>
        <!--出售金额-->
        <el-row style="margin:20px 0 8px 40px;width: 454px;height: 40px;background:#f2f3f8;border-radius:2px;line-height: 40px;">
          <span style="font-size:14px;color:#333333;margin-left: 10px;">出售金额 (CNY)&nbsp;&nbsp;&nbsp;&nbsp;8282</span>
          <span style="font-size:14px;color:#333333;margin-left: 120px;">单笔限额500-1000 CNY</span>
        </el-row>
        <el-row style="margin:0px 0 10px 40px;">
          <span style="font-size:12px;color:#ff7c44;margin-left:66px;">您不需要支付任何手续费，交易手续费将由广告发布商承担，请安心交易。</span>
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
      committing: false
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

</style>
