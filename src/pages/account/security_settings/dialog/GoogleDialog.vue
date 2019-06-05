<template>
  <div class="">
    <!--关闭谷歌验证-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="closeButton" :handle-close="handleClose" :width="500" :height="270">
      <div slot="body">
        <el-row>
            <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
              <span>关闭谷歌验证</span>
            </el-col>
        </el-row>
        <!--短信验证码-->
        <el-row>
            <el-col :span="8" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:24px;">
              <span>短信验证码</span>
            </el-col>
            <el-col :span="8">
              <el-input style="width: 190px; height: 34px;margin: 16px 0 20px 10px;" v-model="testGetCode" placeholder="" clearable></el-input>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" plain  style="width: 90px;height: 34px;border-radius:4px;padding: 0;margin: 16px 0 20px 64px;">获取验证码</el-button>
            </el-col>
        </el-row>
        <!--谷歌验证码-->
        <el-row>
            <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:14px 24px 14px 24px;">
              <span>谷歌验证码</span>
            </el-col>
            <el-col :span="12">
              <el-input style="width: 290px; height: 34px;margin: 8px 0 20px 10px;" v-model="verificationCode" placeholder="请查看手机端谷歌验证码" clearable></el-input>
            </el-col>
        </el-row>
        <!--确认-->
        <el-row>
            <button style="width: 290px; height: 34px;margin: 8px 50px 20px 128px;" class="bh-btn_primary" disabled>
              <i v-if="commitStatus" class="el-icon-loading"></i>
              <span v-else>确认</span>
            </button>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../../components/BHDialog'
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
