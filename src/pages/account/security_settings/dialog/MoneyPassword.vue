<template>
  <div class="">
    <!--资金密码设置-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="closeButton" :handle-close="handleClose" :width="500" :height="270">
      <div slot="body">
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span>设置资金密码</span>
          </el-col>
        </el-row>
        <!--输入新密码-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:24px;">
            <span>输入新密码</span>
          </el-col>
          <el-col :span="12">
            <el-input  style="width: 290px; height: 34px;margin: 16px 0 20px 10px;" maxlength="6" type="password" @focus="startPassword=true" v-model="isPassword" placeholder="请输入6位数字密码" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="startPassword && !isPasswordFlag" class="bh-hint bh-color_prompt" style="position: absolute;top: 56px;left: 140px;">{{encryptedMessage}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--确认新密码-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:14px 24px 14px 24px;">
            <span>确认新密码</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 8px 0 20px 10px;" maxlength="6" type="password" @focus="startNewpassword=true" v-model="isNewpassword" placeholder="请确认新密码" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="startNewpassword && !isNewpasswordFlag" class="bh-hint bh-color_prompt" style="position: absolute;top: 48px;left: 140px;">{{newEncryptedMessage}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--确认-->
        <el-row>
            <button style="width: 290px; height: 34px;margin: 8px 50px 20px 128px;" class="bh-btn_primary" :disabled="!(isPasswordFlag && isNewpasswordFlag && !committing)" @click="commit">
              <i class="el-icon-loading" v-if="committing"></i>
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
      // 限制只输入6位数字
      isPassword: '',
      isNewpassword: '',
      // 错误提示 输入密码 确认密码
      encryptedMessage: '请输入六位数字密码！',
      newEncryptedMessage: '两次密码不一致！',
      startPassword: false,
      startNewpassword: false,
      committing: false
    }
  },
  name: 'MoneyPassword',
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
    }
  },
  components: {
    BhDialog
  },
  methods: {
    commit () {
      if (this.committing) {
        return
      } else {
        this.committing = true
      }
      this.$store.dispatch('encryptConnection', {
        url: '/userinfo/setAssetPasswordUI',
        data: {
          assetPassword: this.isPassword
        }
      }).then(response => {
        this.$store.commit('setUser', {fundPassword: 1})
        this.$message.success('设置成功')
        this.$emit('update:visible', false)
        this.$router.push({name: 'SecuritySettings'})
      }, response => {
        this.isPassword = ''
        this.isNewpassword = ''
        this.startPassword = false
        this.startNewpassword = false
        this.committing = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    }
  },
  computed: {
    // 校验密码
    isPasswordFlag () {
      return new RegExp(`^\\d{6}$`).test(this.isPassword)
    },
    // 校验确认密码
    isNewpasswordFlag () {
      return this.isPassword === this.isNewpassword
    }
  }
}
</script>

<style scoped>

</style>
