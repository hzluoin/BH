<template>
  <div class="notBound">
    <!--绑定实名银行卡-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="590" :height="277">
      <div slot="body">
        <!--标题-->
        <el-row>
          <el-col :span="24" class="bh-align_center ft18">
            <span>设定支付方式</span>
          </el-col>
        </el-row>
        <!--银行卡位置-->
        <!--<el-row>-->
          <!--<div style="text-align: center; margin: 20px 0 20px 0;">-->
            <!--<img src="../../../assets/images/bank_card.svg" alt="" style="width: 120px; height: 120px;">-->
          <!--</div>-->
        <!--</el-row>-->
        <!--提示-->
        <el-row class="font1 ft20 mt60">
          <span>提示：进行场外交易，需要先设定支付方式</span>
        </el-row>
        <!--取消、确认-->
        <div class="bh_btnBox mt60">
          <button class="bh-btn bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          <el-button type="primary" class="bh-btn bh-btn_primary" @click="$router.push({name: 'TransactionSettings'})">
            去设置
          </el-button>
        </div>
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
  }
}
</script>

<style scoped>
  .notBound .bh-align_center{width: 100%;height: 25px;color: #333;font-weight:600;}
  .notBound .font1{text-align: center;margin-bottom: 30px;color:#333;}
  .notBound .bh_btnBox{position: relative;width: 100%;}
  .notBound .bh-btn{width: 195px; height: 34px;padding: 0;font-size: 14px;text-align: center;position: absolute;}
  .notBound .bh-btn_plain{color: #0BB2FE;left: 55px;}
  .notBound .bh-btn_primary{color: #fff;right: 55px;}
</style>
