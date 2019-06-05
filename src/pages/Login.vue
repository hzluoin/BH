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
          <div><span class="bh-color_select">账号登录</span></div>
          <div><el-input class="bh-input_bottom" v-model="account" placeholder="手机号/邮箱" maxlength="30" clearable></el-input></div>
          <div><el-input class="bh-input_bottom" v-model="password" placeholder="请输入密码" maxlength="20" type="password" clearable></el-input></div>
          <div>
            <el-input class="bh-input_bottom" v-if="showCaptcha" v-model="captcha" placeholder="验证码" maxlength="6" clearable></el-input>
            <button class="bh-btn_text getCaptcha bh-color_select" :disabled="timeRemaining !== 60" @click="sendCaptcha">{{captchaTile}}</button>
          </div>
          <div><div class="ft12 bh-color_select forget" @click="$router.push({name: 'ForgetPassword'})">忘记密码?</div></div>
          <div><div ref="captcha" style="width: 340px;margin: auto;"></div></div>
          <div>
            <button class="bh-btn_primary commit" ref="loginButton" @click="login" :disabled="!disabled||commit">
              <i v-if="commit" class="el-icon-loading"></i>
              <span v-else>登录</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <bh-footer></bh-footer>
    </footer>
  </div>
</template>

<script>
import Navigation from '../components/Navigation'
import BhFooter from '../components/FooterIndex'
export default {
  name: 'Login',
  components: {
    Navigation,
    BhFooter
  },
  data () {
    return {
      // 手机校验
      phoneFilter: new RegExp(`^[0-9]+$`),
      // 邮箱检验，正则来源：https://blog.csdn.net/liudglink/article/details/78511759
      emailFilter: new RegExp(`^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\\.[a-zA-Z0-9-]+)*\\.[a-zA-Z0-9]{2,6}$`),
      // 用户输入的账号
      account: '',
      email: '',
      telephone: '',
      password: '',
      // 正在提交
      commit: false,
      // 是否需要极验证、极验证结果
      captchaObj: null,
      geetest: false,
      geetestResult: {},
      // 短信、邮箱验证码
      captcha: '',
      showCaptcha: false,
      captchaTile: '获取验证码',
      timeRemaining: 60
    }
  },
  computed: {
    // 输入校验
    disabled () {
      if (!(this.phoneFilter.test(this.account) ||
        this.emailFilter.test(this.account)) ||
        !this.geetestResult ||
        !(!this.showCaptcha || (this.showCaptcha && this.$RegExp.captcha(this.captcha)))) {
        return false
      }
      // 密码长度校验
      if (this.password.length < 6) {
        return false
      }
      return true
    }
  },
  methods: {
    login () {
      this.commit = true
      if (this.phoneFilter.test(this.account)) {
        this.telephone = this.account
        this.email = ''
      } else if (this.emailFilter.test(this.account)) {
        this.telephone = ''
        this.email = this.account
      }
      this.$store.dispatch('login', {
        telephone: this.telephone,
        email: this.email,
        password: this.password,
        check: this.geetest ? 'Yes' : 'No',
        geetest_challenge: this.geetestResult.geetest_challenge,
        geetest_validate: this.geetestResult.geetest_validate,
        geetest_seccode: this.geetestResult.geetest_seccode,
        telephoneCode: this.telephone ? this.captcha : '',
        emailCode: this.email ? this.captcha : ''
      }).then(response => {
        this.commit = false
        let to = this.$route.params.to
        if (to) {
          this.$router.push({name: to})
        } else {
          this.$router.push({name: 'Home'})
        }
      }, response => {
        switch (response.status) {
          case 200:
            return
          case 'E0116':
            this.commit = false
            this.$message.error('账号或密码错误')
            break
          case 'E0118':
            this.commit = false
            this.$message.error('账号或密码错误')
            break
          case 'E0112':
            // 输入密码连续错误三次，需要进行极验证
            this.geetestResult = null
            this.geetest = true
            this.initGeetest()
            break
          case 'E0115':
            // 异地登录，需要进行极验证
            this.geetestResult = null
            this.geetest = true
            this.initGeetest(() => {
              this.showCaptcha = true
              this.sendCaptcha()
            })
            break
          case 'E0101':
            // 极验证未通过
            this.geetestResult = null
            this.captchaObj.reset()
            this.commit = false
            break
          default:
            this.commit = false
            this.$message.error('登录失败:' + response.body.msg)
        }
      })
    },
    // 发送验证码
    sendCaptcha () {
      const clear = (interval) => {
        this.captchaTile = '获取验证码'
        this.timeRemaining = 60
        clearInterval(interval)
      }
      this.captchaTile = --this.timeRemaining
      const temp = setInterval(() => {
        this.captchaTile = --this.timeRemaining
        if (this.timeRemaining === 0) {
          clear(temp)
        }
      }, 1000)
      if (this.telephone) {
        // 1.获取验证码
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getTelephoneAuthCode',
          data: {
            telephone: this.telephone,
            type: '1'
          }
        }).then(response => {
        }, response => {
          clear(temp)
          switch (response.body.code) {
            case 666:
              return
            case 'E0807':
              this.$message.error('短信发送过于频繁')
              break
            default:
              this.$message.error(this.telephone + '短信发送失败' + response.body.msg)
          }
        })
      } else {
      // 4
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getEmailAuthCode',
          data: {
            email: this.email,
            type: '8'
          }
        }).then(response => {}, response => {
          clear(temp)
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
      }
    },
    // 初始化及验证
    initGeetest (success) {
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
            this.commit = false
          }).onSuccess(() => {
            this.geetestResult = captchaObj.getValidate()
            if (typeof success === 'function') {
              success()
            }
          }).onError(() => {
          })
        })
      }, response => {
      })
      // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
    }
  },
  mounted () {
    /* ---- particles.js config ---- */
    window.particlesJS('particles-js', require('../assets/data/particles'))
    const login = (e) => {
      if (e.key === 'Enter') {
        this.$refs.loginButton.click()
      }
    }
    this.$keyboardListener.addListener({name: 'login', func: login})
  },
  destroyed () {
    this.$keyboardListener.removeListener('login')
  },
  beforeRouteLeave (to, from, next) {
    if (JSON.stringify(this.$route.params) !== '{}' && to.name === 'Home') {
      next(false)
      this.$router.push({path: 'otc_trading', query: this.$route.params})
    } else {
      next()
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
    position: relative;
    padding-top: 18px;
    padding-bottom: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bh-login_body > div {
    position: relative;
  }

  /*小标题：账号登录*/
  .bh-login_body>div:first-child .bh-color_select {
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

  .bh-login_body .getCaptcha {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 80px;
    margin: auto;
  }

  /*忘记密码？*/
  .bh-login_body .forget {
    width: 340px;
    text-align: right;
    margin: 8px auto;
    cursor: pointer;
  }

  /*登录*/
  .bh-login_body .commit {
    width: 340px;
    height: 46px;
    margin: 20px 59px 0 59px;
    font-size: 16px;
  }
</style>
