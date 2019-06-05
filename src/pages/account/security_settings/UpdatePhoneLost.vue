<template>
  <div class="bh-update_phone_lost">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bg-F4FBFF ft16 color-0BB2FE">{{$t('title.UpdateVerifiedMobilePhone')}}</span>
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
        <span class="bh-col_1 ft14 color-333">地区</span>
      </el-col>
      <el-col :span="7">
        <el-select v-model="iTelCodeValue">
          <el-option
            v-for="item in iTelCodeOptions"
            :key="item.label"
            :label="'+'+item.value+item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="4" type="flex">
        <span class="bh-col_1 ft14 color-333">新手机号码</span>
      </el-col>
      <el-col :span="7">
        <el-input maxlength="15" v-model="newTelephone" placeholder="请输入手机号码" @focus="checkNewTelephoneByFocus" @blur="checkNewTelephoneByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showNewTelephoneMsg">{{newTelephoneMsg}}</span>
        </transition>
      </el-col>
    </el-row>

    <el-row>
      <el-col type="flex" :span="4" >
        <span class="bh-col_1 ft14 color-333">新手机短信验证码</span>
      </el-col>
      <el-col :span="7">
        <el-input maxlength="6" v-model="newTelephoneCode" placeholder="请输入验证码" @focus="checkNewTelephoneCodeFocus" @blur="checkNewTelephoneCodeBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showNewTelephoneCodeMsg">{{newTelephoneCodeMsg}}</span>
        </transition>
      </el-col>
      <el-col :span="13">
        &nbsp;&nbsp;
        <button class="bh-btn_plain__large" @click="getNewTelephoneCode" :disabled="newTelephoneTestResults===0 || newTelephoneTestResults===1 || newTelephoneTestResults===3 || ((newTelephoneTestResults===2 || newTelephoneTestResults===true) && phoneIntervalTime!==60)">{{phoneCaptchaMsg}}</button>
      </el-col>
    </el-row>

    <el-row>
      <el-col type="flex" :span="4" >
        <span class="bh-col_1 ft14 color-333">邮箱验证码</span>
      </el-col>
      <el-col :span="7">
        <el-input maxlength="6" v-model="emailCode" placeholder="请输入验证码" @focus="checkEmailCodeByFocus" @blur="checkEmailCodeByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showEmailCodeMsg">{{emailCodeMsg}}</span>
        </transition>
      </el-col>
      <el-col :span="13">
        &nbsp;&nbsp;
        <button class="bh-btn_plain__large" @click="getEmailCode" :disabled="!(emailIntervalTime===60)">{{emailCaptchaMsg}}</button>
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
import ITelCode from '../../../assets/data/internationalTelephoneCode'
export default {
  name: 'department',
  data () {
    return {
      iTelCodeValue: '86',
      iTelCode: '',
      // 1.新手机号码,手机号码检测结果：true通过检测，0输入为空，1格式错误，2格式正确但未检测唯一性，3正在检测唯一性，4账号已存在
      newTelephone: '',
      newTelephoneTestResults: 0,
      showNewTelephoneMsg: false,
      newTelephoneMsg: '',
      // 2.新手机短信验证码
      newTelephoneCode: '',
      newTelephoneCodeTestResults: 0,
      showNewTelephoneCodeMsg: false,
      newTelephoneCodeMsg: '',
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
    newTelephone () {
      this.showNewTelephoneMsg = false
      this.newTelephoneMsg = ''
      this.newTelephoneTestResults = 0
      // 1.手机为空
      if (!this.newTelephone) {
        return
      }
      // 2.手机格式的校验
      if (!this.$RegExp.telephone(this.newTelephone)) {
        this.showNewTelephoneMsg = true
        this.newTelephoneMsg = '手机号码不正确'
        this.newTelephoneTestResults = 1
        return
      }
      this.newTelephoneTestResults = 2
    },
    newTelephoneCode () {
      this.showNewTelephoneCodeMsg = false
      this.newTelephoneCodeMsg = ''
      this.newTelephoneCodeTestResults = 0
      // 1.验证码为空
      if (!this.newTelephoneCode) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.captcha(this.newTelephoneCode)) {
        this.showNewTelephoneCodeMsg = true
        this.newTelephoneCodeMsg = '验证码格式不正确'
        this.newTelephoneCodeTestResults = 1
        return
      }
      this.newTelephoneCodeTestResults = true
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
    // 国际电话区号数据
    iTelCodeOptions () {
      return ITelCode[this.$i18n.locale]
    },
    disabled () {
      return this.newTelephoneTestResults === true &&
        this.emailCodeTestResults === true &&
        this.newTelephoneCodeTestResults === true
    }
  },
  methods: {
    // 通过监听Focus控制手机号报错提示
    checkNewTelephoneByFocus () {
      if (this.newTelephone === '') {
        this.newTelephoneTestResults = 0
        this.showNewTelephoneMsg = false
        this.newTelephoneMsg = ''
      }
    },
    // 通过监听blur校验手机号：手机账号唯一性检查
    checkNewTelephoneByBlur () {
      // 为空不继续校验
      if (this.newTelephoneTestResults === 0) {
        this.showNewTelephoneMsg = true
        this.newTelephoneMsg = '手机号码不能为空'
      }
    },
    // 通过监听Focus控制新手机短信验证码报错提示
    checkNewTelephoneCodeFocus () {
      if (this.newTelephoneCode === '') {
        this.newTelephoneCodeTestResults = 0
        this.showNewTelephoneCodeMsg = false
        this.newTelephoneCodeMsg = ''
      }
    },
    // 通过监听blur校验新手机短信验证码
    checkNewTelephoneCodeBlur () {
      // 为空不继续校验
      if (this.newTelephoneCodeTestResults === 0) {
        this.showNewTelephoneCodeMsg = true
        this.newTelephoneCodeMsg = '验证码不能为空'
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
      this.$store.dispatch('encryptConnectionSSO', {
        url: '/sso/email/send',
        data: {
          source: '2',
          email: this.$store.getters.getUser.email,
          index: '3'
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
    },
    // 获取新手机验证码
    getNewTelephoneCode () {
      // 保证国际区号长度为四位
      this.iTelCode = this.getCountryCode(this.iTelCodeValue)
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
      this.$store.dispatch('encryptConnection', {
        url: '/userinfo/findByTelephoneUI',
        data: {
          telephone: this.newTelephone
        }
      }).then(response => {
        if (response.body.data.isExist) {
          this.newTelephoneTestResults = 3
          this.showNewTelephoneMsg = true
          this.newTelephoneMsg = '手机号码已注册'
          clear()
        } else {
          this.newTelephoneTestResults = true
          this.newTelephoneMsg = ''
          this.$store.dispatch('encryptConnectionSSO', {
            url: '/sso/message/send',
            data: {
              source: '2',
              countryCode: this.iTelCode,
              telephone: this.newTelephone,
              index: '4'
            }
          }).then(response => {
          }, response => {
            clear()
            switch (response.body.code) {
              case 666:
                return
              default:
                this.$message.error(response.body.msg)
            }
          })
        }
      }, response => {
        this.newTelephoneTestResults = 3
        this.showNewTelephoneMsg = true
        this.newTelephoneMsg = '手机号码已注册'
      })
    },
    getCountryCode (code) {
      if (code.length > 4) {
        return code.toString().substr(code.length - 4, code.length)
      } else if (code.length === 3) {
        return '0' + code
      } else if (code.length === 2) {
        return '00' + code
      }
    },
    commit () {
      this.iTelCode = this.getCountryCode(this.iTelCodeValue)
      this.$store.dispatch('encryptConnectionSSO', {
        url: '/sso/user/resetPhoneAuthenticationUI',
        data: {
          oldTelephone: this.$store.getters.getUser.telephone,
          newTelephone: this.newTelephone,
          newTelephoneCode: this.newTelephoneCode,
          countryCode: this.iTelCode,
          emailCode: this.emailCode
        }
      }).then(response => {
        this.$store.commit('setUser', {telephone: this.newTelephone})
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
  },
  created () {
    // 要求绑定邮箱
    if (!this.$store.getters.getUser.email) {
      this.$alert('请先前往邮箱绑定', '绑定邮箱', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({name: 'Email'})
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
