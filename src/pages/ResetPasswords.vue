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
          <span class="bh-color_select">重置登录密码</span>
          <el-input class="bh-input_bottom" v-model="newPassword" @focus="passwordFocus=true" placeholder="输入新密码" type="password" clearable></el-input>
          <transition name="el-fade-in-linear">
            <span v-if="passwordFocus && !checkPassword" class="bh-color_prompt" style="position: absolute;top: 66px;left: 204px;">{{passwordMsg}}</span>
          </transition>
          <el-input class="bh-input_bottom" v-model="confirmPassword" @focus="confirmPasswordFocus=true" placeholder="确认新密码" type="password" clearable></el-input>
          <transition name="el-fade-in-linear">
            <span  v-if="confirmPasswordFocus && !checkConfirmPassword" class="bh-color_prompt" style="position: absolute;top: 118px;left: 310px;">{{confirmPasswordMsg}}</span>
          </transition>
          <button class="bh-btn_primary" @click="affirm" :disabled="disabled">
            <!--<i class="el-icon-loading"></i>-->
            <span>确认</span>
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
import Navigation from '../components/Navigation'
import BhFooter from '../components/FooterIndex'
export default {
  name: 'ResetPasswords',
  components: {
    Navigation,
    BhFooter
  },
  data () {
    return {
      // 新密码
      newPassword: '',
      // 确认新密码
      confirmPassword: '',
      // 开启数据校验
      passwordFocus: false,
      confirmPasswordFocus: false,
      // 提示
      passwordMsg: '密码长度为字母加数字8~16位！',
      confirmPasswordMsg: '密码不一致!'
    }
  },
  computed: {
    // 新密码校验
    checkPassword () {
      return new RegExp(`^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$`).test(this.newPassword)
    },
    // 确认密码
    checkConfirmPassword () {
      if (!this.confirmPasswordFocus) {
        return true
      }
      return this.newPassword === this.confirmPassword
    },
    // 全部输入校验
    disabled () {
      const start = this.passwordFocus && this.confirmPasswordFocus
      return !(start && this.checkPassword && this.checkConfirmPassword)
    }
  },
  methods: {
    affirm () {
      let {telephone, telephoneCode, isPhone} = this.$route.query
      let data = {
        telephone: isPhone ? telephone : undefined,
        telephoneCode: isPhone ? telephoneCode : undefined,
        email: isPhone ? undefined : telephone,
        emailCode: isPhone ? undefined : telephoneCode,
        newPassword: this.confirmPassword
      }
      this.$store.dispatch('encryptConnection', {
        url: '/userinfo/resetPasswordUI',
        data
      }).then(response => {
        this.$message.success('重置成功')
        setTimeout(() => {
          this.$store.commit('setUser', {
            newPassword: this.confirmPassword
          })
          this.$router.push({name: 'Login'})
        }, 1000)
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
  mounted () {
    // console.log(this.$route.query)
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
    /*display: block;*/
    /*margin-top: 21px;*/
    /*padding: 0 47px;*/
  }

  /*登录*/
  .bh-login_body>button:last-child {
    width: 340px;
    height: 46px;
    margin: 50px 59px 0 59px;
    font-size: 16px;
  }
</style>
