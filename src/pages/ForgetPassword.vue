<template>
  <div class="bh-root bh-background_main" style="position: relative;min-height: 930px;height: 100%;">
    <header class="bh-background_main">
      <navigation></navigation>
    </header>

    <main id="particles-js" class="bh-background_main">
      <div class="bh-login">
        <div class="bh-login_header">
          <img src="../assets/images/logo_white_rect.svg"/>
          <span class="ft14 color-fff">安全、可靠、交易快速</span>
        </div>

        <div class="bh-login_body">
          <span class="bh-color_select">找回登录密码</span>
          <!--用户账号-->
          <div>
            <el-input class="bh-input_bottom" v-model="isAccount" placeholder="手机号/邮箱" clearable ></el-input>
          </div>
          <!--用户输入验证码-->
          <div v-if="jCaptcha">
            <div>
              <el-input class="bh-input_bottom" maxlength="6" v-model="isPassword"  placeholder="请输入验证码" clearable></el-input>
            </div>
            <!--发送邮箱或手机验证码检测-->
            <div v-if="validation">
              <button class="bh-btn_plain__large"  style="position:relative;top:-40px;left:300px;" @click="getTelephoneCode">{{getCode}}</button>
            </div>
            <div v-else>
              <button class="bh-btn_plain__large"  style="position:relative;top:-40px;left:300px;color:#ddd;cursor:default;" >获取验证码</button>
            </div>
          </div>
          <!--极验证-->
          <div v-else ref="captcha" style="width: 340px;margin: 20px auto 0 auto;"></div>
          <!--@click="$router.push({name: 'ResetPasswords'})"-->
          <button class="bh-btn_primary" @click="pass" :disabled="!(validation&&validation1)||commit">
            <i v-if="commit" class="el-icon-loading"></i>
            <span v-else>下一步</span>
          </button>
        </div>
      </div>
    </main>

    <footer>
      <bh-footer></bh-footer>
    </footer>
  </div>
</template>

<script>
import Vue from 'vue'
import Navigation from '../components/Navigation'
import BhFooter from '../components/FooterIndex'
export default {
  name: 'ForgetPassword',
  components: {
    Navigation,
    BhFooter
  },
  data () {
    return {
      // // 手机校验
      phoneFilter: /^[1][3,4,5,7,8][0-9]{9}/,
      // // 邮箱检验，正则来源：https://blog.csdn.net/liudglink/article/details/78511759
      emailFilter: /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/,
      // 验证码格式校验正则
      valiCode: new RegExp('^[a-zA-Z0-9]{4,6}$'),
      // 用户输入的账号
      isAccount: '',
      // 用户输入验证码
      isPassword: '',
      // 手机验证码
      telephoneCode: '',
      // 正在提交
      commit: false,
      // 验证码获取
      getCode: '获取验证码',
      // 验证手机号
      validation: false,
      // 验证验证码
      validation1: false,
      // 手机区号
      countryCode: '',
      interval: null,
      // 是否通过极验证
      jCaptcha: false,
      geetestResult: ''
    }
  },
  methods: {
    pass () {
      this.commit = true
      let data = {}
      let isPhone = true
      // 表示是手机
      if (this.phoneFilter.test(this.isAccount)) {
        data.telephone = this.isAccount
        data.telephoneCode = this.isPassword
        // 表示是邮箱
      } else if (this.emailFilter.test(this.isAccount)) {
        isPhone = false
        data.email = this.isAccount
        data.emailCode = this.isPassword
      }
      this.$store.dispatch('encryptConnection', {
        url: '/userinfo/verificationCodeByAccountUI',
        data
      }).then(response => {
        this.$store.commit('setUser', {
          telephone: this.isAccount,
          telephoneCode: this.isPassword,
          email: this.isAccount,
          emailCode: this.isPassword
        })
        this.$router.push({name: 'ResetPasswords',
          query: {
            telephone: this.isAccount,
            telephoneCode: this.isPassword,
            isPhone
          }})
      }, response => {
        switch (response.status) {
          case 666:
            this.commit = false
            break
          case 'E7001':
            this.commit = false
            this.$message.error('手机验证码为空')
            break
          case 'E7002':
            this.commit = false
            this.$message.error('邮箱验证码为空')
            break
          case '110':
            this.commit = false
            this.$message.error('验证码错误')
            break
          case '108':
            this.commit = false
            this.$message.error('验证码错误')
            break
          case '109':
            this.commit = false
            this.$message.error('验证码错误')
            break
          default:
            this.$message.error(response.body.msg)
            this.commit = false
            break
        }
      })
    },

    // 验证手机号是否正确
    handleTestPhone () {
      if (this.isAccount) {
        this.validation = (this.phoneFilter.test(this.isAccount) || this.emailFilter.test(this.isAccount))
      } else {
        this.validation = false
      }
    },
    // 验证验证码是否正确
    validateValiCode () {
      if (this.isPassword) {
        this.validation1 = (this.valiCode.test(this.isPassword))
      } else {
        this.validation1 = false
      }
    },
    // 初始化及验证
    initGeetestPlugin () {
      this.$http.get('/gt/startCaptcha', {t: +new Date()}).then(response => {
        const data = response.body.data
        // 调用 initGeetest 初始化参数
        // 参数1：配置参数
        // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它调用相应的接口
        window.initGeetest({
          gt: data.gt,
          challenge: data.challenge,
          new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机
          offline: !data.success, // 表示用户后台检测极验服务器是否宕机，一般不需要关注
          product: 'popup', // 产品形式，包括：float，popup
          width: '100%'
          // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
        }, (captchaObj) => {
          // 将验证码加到id为captcha的元素里，同时会有三个input的值用于表单提交
          captchaObj.appendTo(this.$refs.captcha)
          this.captchaObj = captchaObj
          captchaObj.onReady(() => {
            // 及验证创建完成
          }).onSuccess(() => {
            this.jCaptcha = true
            this.geetestResult = captchaObj.getValidate()
          }).onError(() => {
          })
        })
      }, response => {
      })
      // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
    },
    // 获取验证码
    async getTelephoneCode () {
      if (this.interval !== null) {
        return
      }
      let isExistData = {}
      let urll = ''
      let data1 = {}
      let isPhone = true
      if (this.phoneFilter.test(this.isAccount)) {
        urll = '/userinfo/findByTelephoneUI'
        data1.telephone = this.isAccount
        // 表示是邮箱
      } else if (this.emailFilter.test(this.isAccount)) {
        isPhone = false
        urll = '/userinfo/findByEmailUI'
        data1.email = this.isAccount
      }
      // console.log(urll)
      // 判断手机号是否存在
      isExistData = await this.$store.dispatch('encryptConnection', {
        url: urll,
        data: data1
      })
      if (parseInt(isExistData.body.code) === 200) {
        if (isPhone) {
          if (isExistData.body.data.isExist) {
            this.countryCode = isExistData.body.data.countryCode
          } else {
            this.$message({message: '此手机号不存在，请重新输入！', type: 'warning', duration: 1000})
            return
          }
        } else {
          if (!isExistData.body.data.isExist) {
            this.$message({message: '此邮箱不存在，请重新输入！', type: 'warning', duration: 1000})
            return
          }
        }
      } else {
        this.$message({message: isExistData.msg, type: 'warning', duration: 1000})
        return
      }
      // 修改验证码倒计时
      this.getCode = 59
      this.interval = setInterval(() => {
        if (this.getCode-- === 0) {
          this.getCode = '获取验证码'
          clearInterval(this.interval)
          this.interval = null
        }
      }, 1000)
      let url = ''
      let data = {type: '9'}
      // 表示是手机
      if (this.phoneFilter.test(this.isAccount)) {
        url = '/auth/getTelephoneAuthCode'
        data.countryCode = this.countryCode
        data.telephone = this.isAccount
        // 表示是邮箱
      } else if (this.emailFilter.test(this.isAccount)) {
        url = '/auth/getEmailAuthCode'
        data.email = this.isAccount
      }
      this.$store.dispatch('encryptConnection', {
        url,
        data
      }).then(response => {
      }, response => {
        this.getCode = '获取验证码'
        clearInterval(this.interval)
        this.interval = null
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        // this.resetData()
      })
    }
  },
  mounted () {
    /* ---- particles.js config ---- */
    window.particlesJS('particles-js', require('../assets/data/particles'))
    Vue.nextTick(() => {
      try {
        this.initGeetestPlugin()
      } catch (e) {
        this.$message.error('验证码创建失败，请刷新页面重试')
      }
    })
  },
  watch: {
    isAccount () {
      this.handleTestPhone()
    },
    isPassword () {
      this.validateValiCode()
    }
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
    min-height: 500px;
    top: 60px;
    bottom: 300px;
    left: 0;
    width: 100%;
  }

  footer {
    position: absolute;
    height: 220px;
    left: 0;
    bottom: 0;
    width: 100%;
  }

  .bh-login {
    width: 460px;
    /*height: 426px;*/
    position: relative;
    margin: 3% auto 10% auto;
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
    width: 42px;
    height: 42px;
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
    height: 268px;
    position: relative;
    padding-top: 18px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  /*小标题：账号登录*/
  .bh-login_body>.bh-color_select:first-child {
    font-size: 22px;
    display: block;
    text-align: center;
  }

  /*手机号、邮箱*/
  .el-input.el-input--suffix {
    width: 340px;
    height: 46px;
    margin: 6px 59px 0 59px;
  }

  /*密码*/
  .bh-login_body>span:nth-child(4) {
    display: block;
    margin-top: 21px;
    padding: 0 47px;
  }

  /*登录*/
  .bh-login_body>button:last-child {
    width: 340px;
    height: 46px;
    margin: 16px 59px 0 59px;
    font-size: 16px;
  }
  /*获取验证码 取消边框*/
  .bh-btn_plain__large{
    border: 1px solid #ffffff;
  }
</style>
