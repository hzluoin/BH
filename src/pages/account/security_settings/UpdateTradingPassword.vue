<template>
  <div class="bh-update_phone_lost">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bg-F4FBFF ft16 color-0BB2FE">资金密码修改</span>
      </el-col>
    </el-row>

    <!--警告-->
    <el-row>
      <el-col :span="24">
        <i class="iconfont icon-tanhao"></i>
        <span class="ft12 bh-color_prompt">为了您的资产安全，修改资金密码24小时内不允许提币。</span>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4" type="flex">
        <span class="bh-col_1 ft14 color-333">原资金密码</span>
      </el-col>
      <el-col :span="7">
        <el-input type="password" v-model="oldPassword" maxlength="6" placeholder="请输入原密码" @focus="checkOldPasswordFocus" @blur="checkOldPasswordBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showOldPasswordMsg">{{oldPasswordMsg}}</span>
        </transition>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4" type="flex">
        <span class="bh-col_1 ft14 color-333">新密码</span>
      </el-col>
      <el-col :span="7">
        <el-input type="password" v-model="newPassword" maxlength="6" placeholder="请输入新密码" @focus="checkNewPasswordByFocus" @blur="checkNewPasswordByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showNewPasswordMsg">{{newPasswordMsg}}</span>
        </transition>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4" type="flex">
        <span class="bh-col_1 ft14 color-333">确认密码</span>
      </el-col>
      <el-col :span="7">
        <el-input type="password" v-model="confirmPassword" maxlength="6" placeholder="确认密码" @focus="checkConfirmPasswordByFocus" @blur="checkConfirmPasswordByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showConfirmPasswordMsg">{{confirmPasswordMsg}}</span>
        </transition>
      </el-col>
    </el-row>

    <el-row>
      <el-col type="flex" :span="4" >
        <span class="bh-col_1 ft14 color-333">短信验证码</span>
      </el-col>
      <el-col :span="7">
        <el-input v-model="captcha" placeholder="请输入验证码" maxlength="6" @focus="checkCaptchaByFocus" @blur="checkCaptchaByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showCaptchaMsg">{{captchaMsg}}</span>
        </transition>
      </el-col>
      <el-col :span="13">
        &nbsp;&nbsp;
        <button class="bh-btn_plain__large" @click="getCaptcha" :disabled="!(intervalTime===60)">{{getCaptchaMsg}}</button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7" :offset="4">
        <button class="bh-btn_primary_lg" @click="commit" :disabled="!disabled">确定</button>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  data () {
    return {
      user: this.$store.getters.getUser,
      // 1.原资金密码
      oldPassword: '',
      oldPasswordTestResults: 0,
      showOldPasswordMsg: false,
      oldPasswordMsg: '',
      // 2.新资金密码
      newPassword: '',
      newPasswordTestResults: 0,
      showNewPasswordMsg: false,
      newPasswordMsg: '',
      // 3.确认密码
      confirmPassword: '',
      confirmPasswordTestResults: 0,
      showConfirmPasswordMsg: false,
      confirmPasswordMsg: '',
      // 4.验证码
      captcha: '',
      captchaTestResults: 0,
      showCaptchaMsg: false,
      captchaMsg: '',
      // 提交中。。。
      commitStatus: false,
      // 验证码获取间隔
      intervalTime: 60,
      getCaptchaMsg: '获取验证码'
    }
  },
  watch: {
    oldPassword () {
      this.showOldPasswordMsg = false
      this.oldPasswordMsg = ''
      this.oldPasswordTestResults = 0
      // 1.原密码为空
      if (!this.oldPassword) {
        return
      }
      // 2.原密码格式的校验
      if (!this.$RegExp.numberPassword(this.oldPassword)) {
        this.showOldPasswordMsg = true
        this.oldPasswordMsg = '请输入六位数字密码'
        this.oldPasswordTestResults = 1
        return
      }
      this.oldPasswordTestResults = true
    },
    newPassword () {
      this.showNewPasswordMsg = false
      this.newPasswordMsg = ''
      this.newPasswordTestResults = 0
      // 1.新密码为空
      if (!this.newPassword) {
        return
      }
      // 2.新密码格式的校验
      if (!this.$RegExp.numberPassword(this.newPassword)) {
        this.showNewPasswordMsg = true
        this.newPasswordMsg = '请输入六位数字密码'
        this.newPasswordTestResults = 1
        return
      }
      this.newPasswordTestResults = true
      // 3.确认密码的校验
      if (this.confirmPassword && this.confirmPassword !== this.newPassword) {
        this.showConfirmPasswordMsg = true
        this.confirmPasswordMsg = '两次密码输入不一致'
        this.confirmPasswordTestResults = 1
      } else if (!this.confirmPassword) {
        this.showConfirmPasswordMsg = false
        this.confirmPasswordMsg = ''
        this.confirmPasswordTestResults = 0
      } else {
        this.showConfirmPasswordMsg = false
        this.confirmPasswordMsg = ''
        this.confirmPasswordTestResults = true
      }
    },
    confirmPassword () {
      this.showConfirmPasswordMsg = false
      this.confirmPasswordMsg = ''
      this.confirmPasswordTestResults = 0
      // 1.验证码为空
      if (!this.confirmPassword) {
        return
      }
      // 2.确认密码的校验
      if (this.confirmPassword !== this.newPassword) {
        this.showConfirmPasswordMsg = true
        this.confirmPasswordMsg = '两次密码输入不一致'
        this.confirmPasswordTestResults = 1
        return
      }
      this.confirmPasswordTestResults = true
    },
    captcha () {
      this.showCaptchaMsg = false
      this.captchaMsg = ''
      this.captchaTestResults = 0
      // 1.验证码为空
      if (!this.newPassword) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.captcha(this.captcha)) {
        this.showCaptchaMsg = true
        this.captchaMsg = '验证码格式不正确'
        this.captchaTestResults = 1
        return
      }
      this.captchaTestResults = true
    }
  },
  computed: {
    disabled () {
      return this.oldPasswordTestResults === true &&
        this.newPasswordTestResults === true &&
        this.confirmPasswordTestResults === true &&
        this.captchaTestResults === true
    }
  },
  methods: {
    // 1.1通过监听Focus控制原密码报错提示
    checkOldPasswordFocus () {
      if (this.oldPassword === '') {
        this.oldPasswordTestResults = 0
        this.showOldPasswordMsg = false
        this.oldPasswordMsg = ''
      }
    },
    // 1.2通过监听blur校验原密码
    checkOldPasswordBlur () {
      // 为空不继续校验
      if (this.newTelephoneCodeTestResults === 0) {
        this.showNewTelephoneCodeMsg = true
        this.newTelephoneCodeMsg = '验证码不能为空'
      }
    },
    // 2.1通过监听Focus控制新密码报错提示
    checkNewPasswordByFocus () {
      if (this.newPassword === '') {
        this.newPasswordTestResults = 0
        this.showNewPasswordMsg = false
        this.newPasswordMsg = ''
      }
    },
    // 2.2通过监听blur校验新密码
    checkNewPasswordByBlur () {
      // 为空不继续校验
      if (this.newPasswordTestResults === 0) {
        this.showNewPasswordMsg = true
        this.newPasswordMsg = '新密码不能为空'
      }
    },
    // 3.1通过监听Focus控制确认密码报错提示
    checkConfirmPasswordByFocus () {
      if (this.confirmPassword === '') {
        this.confirmPasswordTestResults = 0
        this.showConfirmPasswordMsg = false
        this.confirmPasswordMsg = ''
      }
    },
    // 3.2通过监听blur校验确认密码
    checkConfirmPasswordByBlur () {
      // 为空不继续校验
      if (this.confirmPasswordTestResults === 0) {
        this.showConfirmPasswordMsg = true
        this.confirmPasswordMsg = '确认密码不能为空'
      }
    },
    // 3.1通过监听Focus控制验证码报错提示
    checkCaptchaByFocus () {
      if (this.captcha === '') {
        this.captchaTestResults = 0
        this.showCaptchaMsg = false
        this.captchaMsg = ''
      }
    },
    // 3.2通过监听blur校验验证码
    checkCaptchaByBlur () {
      // 为空不继续校验
      if (this.emailCodeTestResults === 0) {
        this.showEmailCodeMsg = true
        this.emailCodeMsg = '验证码不能为空'
      }
    },
    // 获取验证码
    getCaptcha () {
      this.getCaptchaMsg = this.intervalTime--
      const temp = setInterval(() => {
        this.getCaptchaMsg = this.intervalTime--
        if (this.getCaptchaMsg === 0) {
          this.getCaptchaMsg = '获取验证码'
          this.intervalTime = 60
          clearInterval(temp)
        }
      }, 1000)
      if (this.user.telephone) {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getTelephoneAuthCode',
          data: {
            countryCode: this.user.countryCode,
            telephone: this.user.telephone,
            type: '12'
          }
        }).then(response => {
        }, response => {
          this.getCaptchaMsg = '获取验证码'
          this.intervalTime = 60
          clearInterval(temp)
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      } else {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getEmailAuthCode',
          data: {
            email: this.user.email,
            type: '12'
          }
        }).then(response => {
        }, response => {
          this.getCaptchaMsg = '获取验证码'
          this.intervalTime = 60
          clearInterval(temp)
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      }
    },
    commit () {
      this.$store.dispatch('encryptConnection', {
        url: '/userinfo/updateAssetPasswordUI',
        data: {
          originAssetPassword: this.oldPassword,
          newAssetPassword: this.newPassword,
          telephoneCode: this.user.telephone ? this.captcha : null,
          emailCode: this.user.telephone ? null : this.captcha
        }
      }).then(response => {
        this.$message.success('修改成功')
        this.$router.push({name: 'SecuritySettings'})
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
  /*路由的标题*/
  .bh-update_phone_lost .el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
    margin-bottom: 0;
  }

  .bh-update_phone_lost .el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
  }

  /*警告*/
  .bh-update_phone_lost .el-row:nth-child(2) {
    height: 17px;
    min-height: 17px;
    line-height: 17px;
    margin-bottom: 24px;
    vertical-align: middle;
  }

  .bh-update_phone_lost .icon-tanhao {
    margin-right: 6px;
    font-size: 12px;
  }

  .el-row {
    margin-bottom: 21px;
    min-height: 34px;
    line-height: 34px;
    padding-left: 5px;
  }

  .el-col {
    height: 34px;
  }

  .el-col span {
    line-height: normal;
    display: inline-block;
    vertical-align:middle;
  }

  .el-col-6 {
    margin-right: 10px;
  }

  .el-col-2 {
    margin-right: 12px;
  }

  .el-input {
    width: 260px;
    height: 34px;
  }

  .el-select {
    width: 260px;
    height: 34px;
  }

  /*确定按钮*/
  .bh-update_phone_lost .el-row:last-child {
    margin-top: 30px;
  }

  /*报错提示*/
  .el-col-7 {
    position: relative;
  }

  .el-col-7 .bh-hint.bh-color_prompt {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    line-height: 34px;
    padding-right: 15px;
  }
</style>
