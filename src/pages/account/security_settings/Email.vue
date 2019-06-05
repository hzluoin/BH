<template>
  <div class="bh-update_phone_lost">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bg-F4FBFF ft16 color-0BB2FE">{{$t('title.VerificationEmail')}}</span>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4" type="flex">
        <span class="bh-col_1 ft14 color-333">邮箱</span>
      </el-col>
      <el-col :span="7">
        <el-input maxlength="30" v-model="email" placeholder="请输入邮箱" @focus="checkEmailByFocus" @blur="checkEmailByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showEmailMsg">{{emailMsg}}</span>
        </transition>
      </el-col>
    </el-row>

    <el-row>
      <el-col type="flex" :span="4" >
        <span class="bh-col_1 ft14 color-333">邮箱验证码</span>
      </el-col>
      <el-col :span="7">
        <el-input maxlength="6" v-model="emailCode" placeholder="请登录邮箱查看验证码" @focus="checkEmailCodeByFocus" @blur="checkEmailCodeByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showEmailCodeMsg">{{emailCodeMsg}}</span>
        </transition>
      </el-col>
      <el-col :span="13">
        &nbsp;&nbsp;
        <button class="bh-btn_plain__large" @click="getEmailCode" :disabled="!((emailTestResults === 2 || emailTestResults === true) && emailIntervalTime===60)">{{emailCaptchaMsg}}</button>
      </el-col>
    </el-row>

    <el-row>
      <el-col type="flex" :span="4" >
        <span class="bh-col_1 ft14 color-333">短信验证码</span>
      </el-col>
      <el-col :span="7">
        <el-input maxlength="6" v-model="telephoneCode" placeholder="请输入验证码" @focus="checkNewTelephoneCodeFocus" @blur="checkNewTelephoneCodeBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showTelephoneCodeMsg">{{telephoneCodeMsg}}</span>
        </transition>
      </el-col>
      <el-col :span="13">
        &nbsp;&nbsp;
        <button class="bh-btn_plain__large" @click="getTelephoneCode" :disabled="phoneIntervalTime!==60">{{phoneCaptchaMsg}}</button>
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
      // 1.手机号码,手机号码检测结果：true通过检测，0输入为空，1格式错误，2格式正确但未检测唯一性，3正在检测唯一性，4账号已存在
      email: '',
      emailTestResults: 0,
      showEmailMsg: false,
      emailMsg: '',
      // 2.手机短信验证码
      telephoneCode: '',
      telephoneCodeTestResults: 0,
      showTelephoneCodeMsg: false,
      telephoneCodeMsg: '',
      // 3.邮箱验证码
      emailCode: '',
      emailCodeTestResults: 0,
      showEmailCodeMsg: false,
      emailCodeMsg: '',
      // 提交中。。。
      commitStatus: false,
      // 验证码获取间隔
      phoneIntervalTime: 60,
      phoneCaptchaMsg: '获取验证码',
      emailIntervalTime: 60,
      emailCaptchaMsg: '获取验证码'
    }
  },
  watch: {
    email () {
      this.showEmailMsg = false
      this.emailMsg = ''
      this.emailTestResults = 0
      // 1.手机为空
      if (!this.email) {
        return
      }
      // 2.手机格式的校验
      if (!this.$RegExp.email(this.email)) {
        this.showEmailMsg = true
        this.emailMsg = '邮箱不正确'
        this.emailTestResults = 1
        return
      }
      this.emailTestResults = 2
    },
    telephoneCode () {
      this.showTelephoneCodeMsg = false
      this.telephoneCodeMsg = ''
      this.telephoneCodeTestResults = 0
      // 1.验证码为空
      if (!this.telephoneCode) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.captcha(this.telephoneCode)) {
        this.showTelephoneCodeMsg = true
        this.telephoneCodeMsg = '验证码格式不正确'
        this.telephoneCodeTestResults = 1
        return
      }
      this.telephoneCodeTestResults = true
    },
    emailCode () {
      this.showEmailCodeMsg = false
      this.emailCodeMsg = ''
      this.emailCodeTestResults = 0
      // 1.验证码为空
      if (!this.emailCode) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.captcha(this.emailCode)) {
        this.showEmailCodeMsg = true
        this.emailCodeMsg = '验证码格式不正确'
        this.emailCodeTestResults = 1
        return
      }
      this.emailCodeTestResults = true
    }
  },
  computed: {
    disabled () {
      return this.emailTestResults === true &&
        this.emailCodeTestResults === true &&
        this.telephoneCodeTestResults === true
    }
  },
  methods: {
    // 通过监听Focus控制邮箱报错提示
    checkEmailByFocus () {
      if (this.email === '') {
        this.emailTestResults = 0
        this.showEmailMsg = false
        this.emailMsg = ''
      }
    },
    // 通过监听blur校验邮箱：邮箱唯一性检查
    checkEmailByBlur () {
      // 为空不继续校验
      if (this.emailTestResults === 0) {
        this.showEmailMsg = true
        this.emailMsg = '邮箱不能为空'
      }
    },
    // 通过监听Focus控制手机短信验证码报错提示
    checkNewTelephoneCodeFocus () {
      if (this.telephoneCode === '') {
        this.telephoneCodeTestResults = 0
        this.showTelephoneCodeMsg = false
        this.telephoneCodeMsg = ''
      }
    },
    // 通过监听blur校验手机短信验证码
    checkNewTelephoneCodeBlur () {
      // 为空不继续校验
      if (this.telephoneCodeTestResults === 0) {
        this.showTelephoneCodeMsg = true
        this.telephoneCodeMsg = '验证码不能为空'
      }
    },
    // 通过监听Focus控制邮箱验证码报错提示
    checkEmailCodeByFocus () {
      if (this.emailCode === '') {
        this.emailCodeTestResults = 0
        this.showEmailCodeMsg = false
        this.emailCodeMsg = ''
      }
    },
    // 通过监听blur校验邮箱验证码
    checkEmailCodeByBlur () {
      // 为空不继续校验
      if (this.emailCodeTestResults === 0) {
        this.showEmailCodeMsg = true
        this.emailCodeMsg = '验证码不能为空'
      }
    },
    // 获取邮箱验证码
    getEmailCode () {
      this.emailCaptchaMsg = this.emailIntervalTime--
      const temp = setInterval(() => {
        this.emailCaptchaMsg = this.emailIntervalTime--
        if (this.emailIntervalTime === 0) {
          this.emailCaptchaMsg = '获取验证码'
          this.emailIntervalTime = 60
          clearInterval(temp)
        }
      }, 1000)

      this.$store.dispatch('encryptConnection', {
        url: '/userinfo/findByEmailUI',
        data: {
          email: this.email
        }
      }).then(response => {
        if (response.body.data.isExist) {
          this.emailCaptchaMsg = '获取验证码'
          this.emailIntervalTime = 60
          clearInterval(temp)
          this.emailTestResults = 3
          this.showEmailMsg = true
          this.emailMsg = '邮箱已注册'
        } else {
          this.emailTestResults = true
          this.$store.dispatch('encryptConnection', {
            url: '/auth/getEmailAuthCode',
            data: {
              email: this.email,
              type: '2'
            }
          }).then(response => {
          }, response => {
            this.emailCaptchaMsg = '获取验证码'
            this.emailIntervalTime = 60
            clearInterval(temp)
            switch (response.body.code) {
              case 666:
                return
              default:
                this.$message.error(response.body.msg)
            }
          })
        }
      }, response => {
        this.emailTestResults = 3
        this.showEmailMsg = true
        this.emailMsg = '邮箱已注册'
      })
    },
    // 获取手机验证码
    getTelephoneCode () {
      this.phoneCaptchaMsg = this.phoneIntervalTime--
      const temp = setInterval(() => {
        this.phoneCaptchaMsg = this.phoneIntervalTime--
        if (this.phoneCaptchaMsg === 0) {
          clear()
        }
      }, 1000)
      const clear = () => {
        this.phoneCaptchaMsg = '获取验证码'
        this.phoneIntervalTime = 60
        clearInterval(temp)
      }
      this.telephoneCodeTestResults = true
      this.telephoneCodeMsg = ''
      this.$store.dispatch('encryptConnection', {
        url: '/auth/getTelephoneAuthCode',
        data: {
          telephone: this.$store.getters.getUser.telephone,
          type: '10'
        }
      }).then(response => {
      }, response => {
        clear()
        switch (response.body.code) {
          case 666:
            return
          case 'E0807':
            this.$message.error('短信发送过于频繁')
            break
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    commit () {
      this.$store.dispatch('encryptConnection', {
        url: '/email/emailAuthenticationUI',
        data: {
          email: this.email,
          telephoneCode: this.telephoneCode,
          emailCode: this.emailCode
        }
      }).then(response => {
        this.$cookies.set('bh_email', this.email, 86400, '/')
        this.$store.commit('setUser', {email: this.email})
        this.$message.success('认证成功')
        this.$router.push({name: 'SecuritySettings'})
      }, response => {
        switch (response.body.code) {
          case 200:
            return
          case 'E1001':
            this.$message.error('用户未登录:' + response.body.msg)
            break
          case 'E1002':
            this.$message.error('邮箱为空:' + response.body.msg)
            break
          case 'E1003':
            this.$message.error('不合法的邮箱:' + response.body.msg)
            break
          case 'E1004':
            this.$message.error('空邮箱验证码:' + response.body.msg)
            break
          case 'E1005':
            this.$message.error('邮箱验证码为空或者失效:' + response.body.msg)
            break
          case 'E1006':
            this.$message.error('邮箱不正确:' + response.body.msg)
            break
          case 'E1007':
            this.$message.error('手机验证为空:' + response.body.msg)
            break
          case 'E1008':
            this.$message.error('手机验证码失效:' + response.body.msg)
            break
          case 'E1009':
            this.$message.error('手机验证码不正确:' + response.body.msg)
            break
          case 'E1010':
            this.$message.error('绑定失败:' + response.body.msg)
            break
          default:
            this.$message.error('认证失败:' + response.body.msg)
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
    margin-bottom: 24px;
  }

  .bh-update_phone_lost .el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
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
