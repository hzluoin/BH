<template>
  <div class="" >
    <!--弹窗记录查看-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="closeButton" :handle-close="handleClose" :width="527" :height="376">
      <div slot="body">
        <!--币种-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:32px 24px 6px 24px;">
            <span>币&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;margin-top: 30px;">ETH</span>
          </el-col>
        </el-row>
        <!--流水号-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>流&nbsp;水&nbsp;号:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">188888888</span>
          </el-col>
        </el-row>
        <!--当前状态-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>当前状态:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">已完成</span>
          </el-col>
        </el-row>
        <!--地址标签-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>地址标签:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">imtoken钱包</span>
          </el-col>
        </el-row>
        <!--接收地址-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>接收地址:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">jsjdabjksbsebynvahjkkg</span>
          </el-col>
        </el-row>
        <!--提币数量-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>提币数量:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">0.017ETH</span>
          </el-col>
        </el-row>
        <!--矿工费-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>矿&nbsp;工&nbsp;费:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">0.017ETH</span>
          </el-col>
        </el-row>
        <!--提币时间-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>提币时间:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">2018-5-20 15:50</span>
          </el-col>
        </el-row>
        <!--完成时间-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>完成时间:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">2018-5-21 17:50</span>
          </el-col>
        </el-row>
        <!--交易哈希-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:0px 24px 0 24px;">
            <span>交易哈希:</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 28px;font-size: 14px;">BSJYJHMKSFNFSJSKWSTKM</span>
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
      testGetCode: '',
      verificationCode: '',
      commitStatus: false
    }
  },
  name: 'GoogleDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closeButton: {
      type: Boolean,
      default: true
    },
    handleClose: {
      type: Function,
      default: () => {}
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    }
  },
  components: {
    BhDialog
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
