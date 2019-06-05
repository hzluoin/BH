<template>
  <div class="bh-root bh-background_main" style="font-size: 1em;position: relative;min-height: 950px;height: 100%;">
    <header>
      <navigation></navigation>
    </header>

    <main id="particles-js">
      <div class="bh-login">
        <div class="bh-login_header">
          <img src="../assets/images/logo_white_rect.svg"/>
          <span class="ft14 color-fff">安全、可靠、交易快速</span>
        </div>

        <!--注册方式切换-->
        <div class="bh-login_body">
          <div>
            <button class="bh-btn_text color-999" :class="{'bh-active': accountType}" @click="toggleAccountType(true)">手机注册</button>
            <button class="bh-btn_text color-999" :class="{'bh-active': !accountType}" @click="toggleAccountType(false)">邮箱注册</button>
          </div>

          <!--国际区号-->
          <div v-if="accountType">
            <el-select v-model="iTelCodeValue" class="bh-input_bottom">
              <el-option
                v-for="item in iTelCodeOptions"
                :key="item.label"
                :label="'+'+item.value+item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>

          <!--手机号码-->
          <div v-if="accountType">
            <transition name="el-fade-in-linear">
              <span class="bh-hint bh-color_prompt" v-if="showTelephoneMsg">{{telephoneMsg}}</span>
            </transition>
            <el-input maxlength="15" class="bh-input_bottom" v-model="telephone" @blur="checkTelephoneByBlur" @focus="checkTelephoneByFocus" placeholder="请输入您的手机号码" clearable></el-input>
          </div>
          <!--邮箱-->
          <div v-else>
            <transition name="el-fade-in-linear">
              <span class="bh-hint bh-color_prompt" v-if="showEmailMsg">{{emailMsg}}</span>
            </transition>
            <el-input class="bh-input_bottom" v-model="email" @blur="checkEmailByBlur" @focus="checkEmailByFocus" placeholder="请输入您的个人邮箱" clearable></el-input>
          </div>

          <!--手机验证码-->
          <div class="bh-verification-code" v-if="accountType">
            <transition name="el-fade-in-linear">
              <span class="bh-hint bh-color_prompt" v-if="showTelephoneCodeMsg">{{telephoneCodeMsg}}</span>
            </transition>
            <el-input maxlength="6" class="bh-input_bottom" v-model="telephoneCode" @blur="checkTelephoneCodeByBlur" @focus="checkTelephoneCodeByFocus" placeholder="请输入手机验证码" clearable></el-input>
            <button class="bh-btn_text" @click="getTelephoneCode" :disabled="telephoneTestResults===0 || telephoneTestResults===1 || telephoneTestResults===3 || ((telephoneTestResults===2 || telephoneTestResults===true) && intervalTime!==60)">{{captchaMsg}}</button>
          </div>
          <!--邮箱验证码-->
          <div class="bh-verification-code" v-else>
            <transition name="el-fade-in-linear">
              <span class="bh-hint bh-color_prompt" v-if="showEmailCodeMsg">{{emailCodeMsg}}</span>
            </transition>
            <el-input maxlength="6" class="bh-input_bottom" v-model="emailCode" @blur="checkEmailCodeByBlur" @focus="checkEmailCodeByFocus" placeholder="请输入邮箱验证码" clearable></el-input>
            <button class="bh-btn_text" @click="getEmailCode" :disabled="emailTestResults===0 || emailTestResults===1 || emailTestResults===3 || ((emailTestResults===2 || emailTestResults===true) && intervalTime!==60)">{{captchaMsg}}</button>
          </div>

          <!--密码-->
          <div>
            <transition name="el-fade-in-linear">
              <span class="bh-hint bh-color_prompt" v-if="showPasswordMsg">{{passwordMsg}}</span>
            </transition>
            <el-input maxlength="20" class="bh-input_bottom" v-model="password" @blur="checkPasswordByBlur" @focus="checkPasswordByFocus" placeholder="密码，8-20位英文数字组合" type="password" clearable></el-input>
          </div>

          <!--确认密码-->
          <div>
            <transition name="el-fade-in-linear">
              <span class="bh-hint bh-color_prompt" v-if="showConfirmPasswordMsg">{{confirmPasswordMsg}}</span>
            </transition>
            <el-input class="bh-input_bottom" v-model="confirmPassword" @blur="checkConfirmPasswordByBlur" @focus="checkConfirmPasswordByFocus" placeholder="确认密码" type="password" clearable></el-input>
          </div>

          <!--同意协议-->
          <div class="bh-protocol">
            <el-checkbox v-model="protocol"></el-checkbox>
            <span class="ft14 color-333">我已阅读并同意《<button class="bh-btn_text bh-color_select" @click="showProtocolDialog=true">网络服务协议</button>》</span>
          </div>

          <!--注册按钮-->
          <button class="bh-btn_primary" @click="register" :disabled="!disabled || commitStatus">
            <i v-if="commitStatus" class="el-icon-loading"></i>
            <span v-else>注册</span>
          </button>

        </div>

      </div>
    </main>

    <footer>
      <bh-footer></bh-footer>
    </footer>

    <protocol-dialog :visible.sync="showProtocolDialog" @agree="protocol=true" @disagree="protocol=false"></protocol-dialog>
  </div>
</template>

<script>
import Navigation from '../components/Navigation'
import BhFooter from '../components/FooterIndex'
import ITelCode from '../assets/data/internationalTelephoneCode'
import ProtocolDialog from './dialog/ProtocolDialog'
export default {
  name: 'Login',
  components: {
    Navigation,
    BhFooter,
    ProtocolDialog
  },
  data () {
    return {
      // 国际电话区号数据
      iTelCodeOptions: ITelCode[this.$i18n.locale],
      // 手机号码格式校验正则
      telephoneRegExp: new RegExp(`^[0-9]{11}$`),
      // 邮箱号码格式校验正则
      emailRegExp: new RegExp(`^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$`),
      // 验证码格式校验正则
      captchaRegExp: new RegExp('^[a-zA-Z0-9]{4,6}$'),
      // 密码格式校验正则
      passwordsRegExp: new RegExp(`^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$`),
      // 国家名+国际电话区号
      iTelCodeValue: '86',
      // 处理之后的国际区号
      iTelCode: '',
      // 账号类型：phone:true，email:false
      accountType: true,
      // 1.手机号码相关属性
      // 1.1手机号码
      telephone: '',
      // 1.2手机号码检测结果：true通过检测，0输入为空，1格式错误，2格式正确但未检测唯一性，3账号已存在
      telephoneTestResults: 0,
      // 1.3是否显示手机号码错误信息
      showTelephoneMsg: false,
      // 1.4手机号码错误信息
      telephoneMsg: '',
      // 2.邮箱相关属性
      email: '',
      // 2.2邮箱检测结果：true通过检测，0输入为空，1格式错误，2格式正确但未检测唯一性，3账号已存在
      emailTestResults: 0,
      // 2.3是否显示邮箱错误信息
      showEmailMsg: false,
      // 2.4邮箱错误信息
      emailMsg: '',
      // 3.1手机验证码；验证码、错误信息、焦点获取；true通过检测，false验证码格式错误，0输入为空
      telephoneCode: '',
      telephoneCodeTestResults: 0,
      showTelephoneCodeMsg: false,
      telephoneCodeMsg: '验证码不能为空',
      // 3.2邮箱验证码；验证码、错误信息、焦点获取
      emailCode: '',
      emailCodeTestResults: 0,
      showEmailCodeMsg: false,
      emailCodeMsg: '验证码不能为空',
      // 4.密码
      password: '',
      passwordTestResults: 0,
      showPasswordMsg: false,
      passwordMsg: '密码格式不正确',
      // 5.确认密码
      confirmPassword: '',
      confirmPasswordTestResults: 0,
      showConfirmPasswordMsg: false,
      confirmPasswordMsg: '两次密码不一致',
      // 6.同意协议
      protocol: false,
      // 7.邀请码
      inviteeCode: null,
      // 提交中。。。
      commitStatus: false,
      // 验证码获取间隔
      intervalTime: 60,
      captchaMsg: '获取验证码',
      // 账号通过验证啦,就算你改了账号的也可以继续提交
      accountPassValidation: false,
      // 协议弹窗
      showProtocolDialog: false
    }
  },
  computed: {
    // 全部输入校验
    disabled () {
      if (this.accountType) {
        return (this.telephoneTestResults === true || (this.telephoneTestResults === 2 && this.accountPassValidation)) &&
          this.telephoneCodeTestResults === true &&
          this.passwordTestResults === true &&
          this.confirmPasswordTestResults === true &&
          this.protocol
      } else {
        return (this.emailTestResults === true || (this.emailTestResults === 2 && this.accountPassValidation)) &&
          this.emailCodeTestResults === true &&
          this.passwordTestResults === true &&
          this.confirmPasswordTestResults === true &&
          this.protocol
      }
    }
  },
  watch: {
    // 通过监听输入校验手机号：是否为空，是否格式正确
    telephone () {
      this.showTelephoneMsg = false
      this.telephoneMsg = ''
      this.telephoneTestResults = 0
      // 1.手机为空
      if (!this.telephone) {
        return
      }
      // 2.手机格式的校验
      if (!this.telephoneRegExp.test(this.telephone)) {
        this.showTelephoneMsg = true
        this.telephoneMsg = '手机号码不正确'
        this.telephoneTestResults = 1
        return
      }
      this.telephoneTestResults = 2
    },
    // 通过监听输入校验Email：是否为空，是否格式正确
    email () {
      this.showEmailMsg = false
      this.emailMsg = ''
      this.emailTestResults = 0
      // 1.邮箱为空
      if (!this.email) {
        return
      }
      // 2.邮箱格式的校验
      if (!this.emailRegExp.test(this.email)) {
        this.showTelephoneMsg = true
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
      if (!this.captchaRegExp.test(this.telephoneCode)) {
        this.showTelephoneCodeMsg = true
        this.telephoneCodeMsg = '验证码格式错误'
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
      if (!this.captchaRegExp.test(this.emailCode)) {
        this.showEmailCodeMsg = true
        this.emailCodeMsg = '验证码格式错误'
        this.emailCodeTestResults = 1
        return
      }
      this.emailCodeTestResults = true
    },
    password () {
      this.showPasswordMsg = false
      this.passwordMsg = ''
      this.passwordTestResults = 0
      // 1.密码为空
      if (!this.password) {
        return
      }
      // 2.密码格式的校验
      if (!this.passwordsRegExp.test(this.password)) {
        this.showPasswordMsg = true
        this.passwordMsg = '密码格式错误'
        this.passwordTestResults = 1
        return
      }
      this.passwordTestResults = true
      // 3.确认密码已填写，判断两者是否相等
      if (this.confirmPassword && this.password !== this.confirmPassword) {
        this.showConfirmPasswordMsg = true
        this.confirmPasswordMsg = '两次密码不一致'
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
      // 1.确认密码为空
      if (!this.confirmPassword) {
        return
      }
      // 2.密码格式的校验
      if (this.password !== this.confirmPassword) {
        this.showConfirmPasswordMsg = true
        this.confirmPasswordMsg = '两次密码不一致'
        this.confirmPasswordTestResults = 1
        return
      }
      this.confirmPasswordTestResults = true
    }
  },
  methods: {
    // 通过监听Focus控制手机号报错提示
    checkTelephoneByFocus () {
      if (this.telephone === '') {
        this.telephoneTestResults = 0
        this.showTelephoneMsg = false
        this.telephoneMsg = ''
      }
    },
    // 通过监听blur校验手机号：手机账号唯一性检查
    checkTelephoneByBlur () {
      // 为空
      if (this.telephoneTestResults === 0) {
        this.showTelephoneMsg = true
        this.telephoneMsg = '手机号码不能为空'
      }
    },
    // 通过监听Focus控制邮箱报错提示
    checkEmailByFocus () {
      if (this.email === '') {
        this.emailTestResults = 0
        this.showEmailMsg = false
        this.emailMsg = ''
      }
    },
    // 通过监听blur校验邮箱：邮箱账号唯一性检查
    checkEmailByBlur () {
      // 为空不继续校验
      if (this.emailTestResults === 0) {
        this.showEmailMsg = true
        this.emailMsg = '邮箱不能为空'
      }
    },
    // 通过监听Focus控制手机验证码报错提示
    checkTelephoneCodeByFocus () {
      if (this.telephoneCode === '') {
        this.telephoneCodeTestResults = 0
        this.showTelephoneCodeMsg = false
        this.telephoneCodeMsg = ''
      }
    },
    // 通过监听blur校验手机验证码
    checkTelephoneCodeByBlur () {
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
    // 通过监听Focus控制密码报错提示
    checkPasswordByFocus () {
      if (this.password === '') {
        this.passwordTestResults = 0
        this.showPasswordMsg = false
        this.passwordMsg = ''
      }
    },
    // 通过监听blur校验密码
    checkPasswordByBlur () {
      // 为空不继续校验
      if (this.passwordTestResults === 0) {
        this.showPasswordMsg = true
        this.passwordMsg = '密码不能为空'
      }
    },
    // 通过监听Focus控制确认密码报错提示
    checkConfirmPasswordByFocus () {
      if (this.confirmPassword === '') {
        this.confirmPasswordTestResults = 0
        this.showConfirmPasswordMsg = false
        this.confirmPasswordMsg = ''
      }
    },
    // 通过监听blur校验确认密码
    checkConfirmPasswordByBlur () {
      // 为空不继续校验
      if (this.confirmPasswordTestResults === 0) {
        this.showConfirmPasswordMsg = true
        this.confirmPasswordMsg = '确认密码不能为空'
      }
    },
    // 切换注册方式
    toggleAccountType (type) {
      if (type === this.accountType) {
        return
      }
      this.accountType = !this.accountType
      // 重置数据
      this.resetData()
    },
    // 注册
    register () {
      this.commitStatus = true
      if (this.accountType) {
        this.email = ''
      } else {
        this.telephone = ''
      }
      this.$store.dispatch('encryptConnectionSSO', {
        url: '/sso/user/register',
        data: {
          source: '2',
          countryCode: this.iTelCode,
          uTelephone: this.telephone,
          email: this.email,
          telephoneCode: this.telephoneCode,
          emailCode: this.emailCode,
          uPassword: this.password,
          uInvCode: this.inviteeCode
        }
      }).then(response => {
        this.$message.success('注册成功')
        setTimeout(() => {
          this.$store.commit('setUser', {
            id: response.body.uId,
            userName: this.username
          })
          this.commitStatus = false
          this.$router.push({name: 'Login'})
        }, 2000)
      }, response => {
        this.commitStatus = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 获取手机验证码
    async getTelephoneCode () {
      // 保证国际区号长度为四位
      this.iTelCode = this.iTelCodeValue
      if (this.iTelCode.length > 4) {
        this.iTelCode = this.iTelCode.toString().substr(this.iTelCode.length - 4, this.iTelCode.length)
      } else if (this.iTelCode.length === 3) {
        this.iTelCode = '0' + this.iTelCode
      } else if (this.iTelCode.length === 2) {
        this.iTelCode = '00' + this.iTelCode
      }
      this.captchaMsg = --this.intervalTime
      const temp = setInterval(() => {
        this.captchaMsg = --this.intervalTime
        if (this.intervalTime === 0) {
          clear()
        }
      }, 1000)
      const clear = () => {
        this.captchaMsg = '获取验证码'
        this.intervalTime = 60
        clearInterval(temp)
      }
      // 1.验证码账号是否重复
      const response = await this.$store.dispatch('encryptConnection', {
        url: '/userinfo/findByTelephoneUI',
        data: {
          telephone: this.telephone
        }
      })
      if (parseInt(response.body.code) === 200) {
        if (response.body.data.isExist) {
          this.telephoneTestResults = 3
          this.showTelephoneMsg = true
          this.telephoneMsg = '账号已存在'
          clear()
          return
        } else {
          this.telephoneTestResults = true
        }
      } else {
        this.telephoneTestResults = 3
        this.showTelephoneMsg = true
        this.telephoneMsg = '账号已存在'
        clear()
        return
      }
      this.accountPassValidation = true
      // 2.获取验证码
      this.$store.dispatch('encryptConnectionSSO', {
        url: '/sso/message/send',
        data: {
          source: '2',
          countryCode: this.iTelCode,
          telephone: this.telephone,
          index: '0'
        }
      }).then(response => {
      }, response => {
        this.captchaMsg = '获取验证码'
        this.intervalTime = 60
        clearInterval(temp)
        switch (response.body.code) {
          case 666:
            return
          case 'E0807':
            this.$message.error('短信发送过于频繁')
            break
          default:
            this.$message.error('短信发送失败' + response.body.msg)
        }
      })
    },
    // 获取邮箱验证码
    async getEmailCode () {
      this.captchaMsg = --this.intervalTime
      const temp = setInterval(() => {
        this.captchaMsg = --this.intervalTime
        if (this.intervalTime === 0) {
          clear()
        }
      }, 1000)
      const clear = () => {
        this.captchaMsg = '获取验证码'
        this.intervalTime = 60
        clearInterval(temp)
      }
      // 1.验证码账号是否重复
      const response = await this.$store.dispatch('encryptConnection', {
        url: '/userinfo/findByEmailUI',
        data: {
          email: this.email
        }
      })
      if (parseInt(response.body.code) === 200) {
        if (response.body.data.isExist) {
          this.emailTestResults = 3
          this.showEmailMsg = true
          this.emailMsg = '账号已存在'
          clear()
          return
        } else {
          this.emailTestResults = true
        }
      } else {
        this.emailTestResults = 3
        this.showEmailMsg = true
        this.emailMsg = '账号已存在'
        clear()
        return
      }
      this.accountPassValidation = true
      // 2.获取验证码
      this.$store.dispatch('encryptConnectionSSO', {
        url: '/sso/email/send',
        data: {
          source: '2',
          email: this.email,
          index: '0'
        }
      }).then(response => {}, response => {
        this.captchaMsg = '获取验证码'
        this.intervalTime = 60
        clearInterval(temp)
        switch (response.body.code) {
          case 666:
            return
          case 'E0807':
            this.$message.error('发送过于频繁')
            break
          default:
            this.$message.error('发送失败' + response.body.msg)
        }
      })
    },
    resetData () {
      this.iTelCodeValue = '86'
      this.iTelCode = ''
      this.telephone = ''
      this.telephoneTestResults = 0
      this.showTelephoneMsg = false
      this.telephoneMsg = ''
      this.email = ''
      this.emailTestResults = 0
      this.showEmailMsg = false
      this.emailMsg = ''
      this.telephoneCode = ''
      this.telephoneCodeTestResults = 0
      this.showTelephoneCodeMsg = false
      this.telephoneCodeMsg = '验证码不能为空'
      this.emailCode = ''
      this.emailCodeTestResults = 0
      this.showEmailCodeMsg = false
      this.emailCodeMsg = '验证码不能为空'
      this.password = ''
      this.passwordTestResults = 0
      this.showPasswordMsg = false
      this.passwordMsg = '密码格式不正确'
      this.confirmPassword = ''
      this.confirmPasswordTestResults = 0
      this.showConfirmPasswordMsg = false
      this.confirmPasswordMsg = '两次密码不一致'
      this.protocol = false
      this.commitStatus = false
      this.intervalTime = 60
      this.captchaMsg = '获取验证码'
    }
  },
  mounted () {
    if (this.$route.params.inviteeCode && this.$route.params.inviteeCode !== 'inviteeCode') {
      this.inviteeCode = this.$route.params.inviteeCode
      // 校验邀请码是否存在
      this.$http.post('/userinfo/inviteeCodeIsExistUI', {
        inviteeCode: this.inviteeCode
      }).then(response => {
        if (!response.body.data) {
          this.$message.warning('邀请码不存在，请核对您的注册链接')
        }
      }, response => {})
    }
    /* ---- particles.js config ---- */
    window.particlesJS('particles-js', require('../assets/data/particles'))
  }
}
</script>

<style scoped>
  header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
  }
  main {
    position: absolute;
    top: 60px;
    bottom: 300px;
    left: 0;
    width: 100%;
  }

  footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .bh-login {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 38.333em;
    position: relative;
    margin: 2% auto 15% auto;
    background-color: #FFF;
    box-shadow: 0 2px 5px 0 #4478d3;
    border-radius: 2px;
    z-index: 1;
  }

  /*上半部分*/
  .bh-login_header {
    width: 100%;
    height: 86px;
    position: relative;
    background: url('../assets/images/login_background.png') no-repeat 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /*LOGO*/
  .bh-login_header img {
    width: 3.5em;
    height: 3.5em;
    position: absolute;
    top: 17px;
    left: 0;
    right: 0;
    margin: auto;
  }

  .bh-login_header span {
    display: inline-block;
    position: absolute;
    width: 100%;
    top: 65px;
    text-align: center;
  }

  /*下半部分*/
  .bh-login_body {
    width: 100%;
    padding-bottom: 34px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bh-login_body>div {
    width: 340px;
    margin: .25em auto auto auto;
    position: relative;
  }

  /*注册方式：手机、邮箱*/
  .bh-login_body>div:first-child {
    height: auto;
    font-size: 1.5em;
    margin-top: 1.5em;
    margin-bottom: .667em;
    display: block;
    text-align: left;
    font-weight: bold;
  }

  .bh-login_body>div:first-child button {
    margin-right: 4.833em;
  }

  .bh-login_body>div:first-child .bh-active {
    border-bottom: 2px solid #0BB2FE;
    color: #0BB2FE;
  }

  /*国际区号、其他输入框*/
  .bh-input_bottom.el-select, .bh-input_bottom.el-input {
    font-size: 1em;
    width: 28.333em;
    height: 3.833em;
  }

  /*获取验证码*/
  .bh-verification-code button {
    font-size: 1.167em;
    position: absolute;
    z-index: 1;
    width: 8.571em;
    height: 3.286em;
    right: 0;
    bottom: 0;
    color: #0BB2FE;
  }

  /*协议*/
  .bh-protocol {
    height: 20px;
    line-height: 20px;
  }
  .bh-protocol .el-checkbox {
    margin-right: 9px;
  }

  /*注册*/
  .bh-login_body>button:last-child {
    font-size: 16px;
    display: block;
    width: 21.25em;
    height: 2.875em;
    margin: 1.625em auto 0 auto;
  }

  /*错误提示*/
  .bh-hint {
    display: inline-block;
    width: auto;
    height: 3.667em;
    line-height: 3.667em;
    padding-left: 10px;
    position: absolute;
    right: 2.5em;
    background-color: #FFF;
    z-index: 1;
  }

  .bh-verification-code .bh-hint {
    right: 9em;
  }

</style>
