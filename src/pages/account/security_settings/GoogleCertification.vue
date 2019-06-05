<template>
  <div class="bh-root">
    <div style="margin-bottom: 80px;">
      <!--谷歌认证-->
      <el-row style="background:#f4fbff;border-radius:1px 1px 0 0;width:919px;height:38px;line-height: 38px;">
        <el-col :span="24">
          <span class="bg-F4FBFF ft16 color-0BB2FE" style="margin-left: 6px;">Google认证</span>
        </el-col>
      </el-row>
      <!--第一步-->
      <div style="border: 1px solid #d8d8d8;border-radius: 1px 1px 0 0;width: 918px;height: 422px;">
        <el-row style="margin: 30px 0 0 10px;">
          <el-col>
            <span class="bh-serial-number">1</span>
            <span style="font-size:14px;color:#666666;">在手机上下载安装“Google Authenticator”(身份验证器)。</span>
          </el-col>
        </el-row>
        <!--图标-->
        <el-row>
          <el-tooltip :disabled="disabled" placement="bottom-start" effect="light">
            <img slot="content" src="../../../assets/images/google_authenticator_ios.png">
            <div style="cursor: pointer;background:#000000;border-radius:2px;width:94px;height:30px;color: #FFFFFF;text-align: center;margin: 10px 0 0 30px;">
              <span>
                <img src="../../../assets/images/apple.svg" alt="" style="width: 16px; height: 18px;margin-top: 5px;">
              </span>
              <span >IOS</span>
            </div>
          </el-tooltip>
          <el-tooltip :disabled="disabled" placement="bottom-start" effect="light">
            <img slot="content" src="../../../assets/images/google_authenticator_android.png">
            <div style="cursor: pointer;background:#49c70c;border-radius:2px;width:94px;height:30px;color: #FFFFFF;text-align: center;margin: -30px 0 20px 150px;">
              <span>
                <img src="../../../assets/images/anzuo.svg" alt="" style="width: 16px; height: 18px;margin-top: 5px;">
              </span>
              <span>Android</span>
            </div>
          </el-tooltip>
        </el-row>
        <div style="border:1px solid #d8d8d8;width:910.5px;"></div>
        <!--第二步-->
        <el-row style="margin: 20px 0 20px 10px;">
          <el-col>
            <span class="bh-serial-number">2</span>
            <span style="font-size:14px;color:#666666;">在“验证器”应用程序中，点击“添加新账户(ios下是 + 号)”,然后选择“扫描条形码”。</span>
          </el-col>
        </el-row>
        <div style="border:1px solid #d8d8d8;width:910.5px;"></div>
        <!--第三步-->
        <el-row style="margin: 20px 0 20px 10px;">
          <el-col>
            <span class="bh-serial-number">3</span>
            <span style="font-size:14px;color:#666666;">扫描下方条形码，输入Google验证码，完成认证。如果您无法扫描成功上图的条形码，</span>
            <p style="font-size:14px;color:#666666;margin-left: 20px;">您还可以手动添加账户，并输入如下密匙:
              <span style="font-size:14px;color:#0bb2fe;">{{privateKey}}</span>
            </p>
          </el-col>
        </el-row>
        <!--二维码位置-->
        <el-row style="margin:-10px 0 10px 200px;">
          <div ref="svg" style="width: 125px;height: 125px;"></div>
        </el-row>
      </div>
      <!--信息加密、验证-->
      <el-row style="margin-top: 30px">
        <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:32px 24px 22px 24px;">
          <span>密匙</span>
        </el-col>
        <el-col :span="12">
          <el-input  style="width: 260px; height: 34px;margin: 22px 0 2px 0px;" v-model="privateKey" placeholder="" disabled></el-input>
        </el-col>
      </el-row>
      <!--谷歌验证码-->
      <el-row>
        <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:16px 24px 14px 24px;">
          <span>谷歌验证码</span>
        </el-col>
        <el-col :span="12">
          <el-input style="width: 260px; height: 34px;margin: 6px 0 10px 0px;" maxlength="6" v-model="googleCaptcha" @focus="checkGoogleCaptchaByFocus" @blur="checkGoogleCaptchaByBlur" placeholder="请输入验证码" clearable></el-input>
          <transition name="el-fade-in-linear">
            <span v-if="showGoogleCaptchaMsg"  class="bh-hint bh-color_prompt" style="position: absolute;top: 42px;left: 128px;">{{googleCaptchaMsg}}</span>
          </transition>
        </el-col>
      </el-row>
      <!--手机/邮箱验证码-->
      <el-row>
        <el-col :span="8" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:14px 24px;">
          <span v-if="user.telephone">手机验证码</span>
          <span v-else>邮箱验证码</span>
        </el-col>
        <el-col :span="8">
          <el-input style="width: 260px; height: 34px;margin: 8px 0 8px 0px;" maxlength="6" v-model="captcha" @focus="checkCaptchaByFocus" @blur="checkCaptchaByBlur" placeholder="请输入验证码" clearable></el-input>
          <transition name="el-fade-in-linear">
            <span v-if="showCaptchaMsg"  class="bh-hint bh-color_prompt" style="position: absolute;top: 45px;left: 128px;">{{captchaMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
          <button class="bh-btn_plain__large" @click="getCaptcha" :disabled="!(intervalTime===60)">{{getCaptchaMsg}}</button>
        </el-col>
      </el-row>
      <!--确认-->
      <el-row>
        <button style="width: 260px;height: 34px;margin: 10px 0 0 118px;" class="bh-btn_primary_lg" @click="commit" :disabled="!disabled || committing">确认</button>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoogleCertification',
  data () {
    return {
      user: this.$store.getters.getUser,
      // 秘钥
      privateKey: '',
      // 1.谷歌验证码
      googleCaptcha: '',
      googleCaptchaTestResults: 0,
      showGoogleCaptchaMsg: false,
      googleCaptchaMsg: '',
      // 2.手机/邮箱验证码
      captcha: '',
      captchaTestResults: 0,
      showCaptchaMsg: false,
      captchaMsg: '',
      intervalTime: 60,
      getCaptchaMsg: '获取验证码',
      committing: false
    }
  },
  watch: {
    googleCaptcha () {
      this.showGoogleCaptchaMsg = false
      this.googleCaptchaMsg = ''
      this.googleCaptchaTestResults = 0
      // 1.验证码为空
      if (!this.googleCaptcha) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.captcha(this.googleCaptcha)) {
        this.showGoogleCaptchaMsg = true
        this.googleCaptchaMsg = '验证码格式不正确'
        this.googleCaptchaTestResults = 1
        return
      }
      this.googleCaptchaTestResults = true
    },
    captcha () {
      this.showCaptchaMsg = false
      this.captchaMsg = ''
      this.captchaTestResults = 0
      // 1.验证码为空
      if (!this.captcha) {
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
    // 全部输入校验
    disabled () {
      return this.privateKey &&
        this.googleCaptchaTestResults === true &&
        this.captchaTestResults === true
    }
  },
  methods: {
    // 通过监听Focus控制谷歌验证码报错提示
    checkGoogleCaptchaByFocus () {
      if (this.googleCaptchaMsg === '') {
        this.googleCaptchaTestResults = 0
        this.showGoogleCaptchaMsg = false
        this.googleCaptchaMsg = ''
      }
    },
    // 通过监听blur校验谷歌验证码
    checkGoogleCaptchaByBlur () {
      // 为空不继续校验
      if (this.googleCaptchaTestResults === 0) {
        this.showGoogleCaptchaMsg = true
        this.googleCaptchaMsg = '验证码不能为空'
      }
    },
    // 通过监听Focus控制手机/邮箱验证码报错提示
    checkCaptchaByFocus () {
      if (this.captchaMsg === '') {
        this.captchaTestResults = 0
        this.showCaptchaMsg = false
        this.captchaMsg = ''
      }
    },
    // 通过监听blur校验手机/邮箱验证码
    checkCaptchaByBlur () {
      // 为空不继续校验
      if (this.captchaTestResults === 0) {
        this.showCaptchaMsg = true
        this.captchaMsg = '验证码不能为空'
      }
    },
    // 获取手机/邮箱验证码
    getCaptcha () {
      const temp = setInterval(() => {
        this.getCaptchaMsg = 59
        this.getCaptchaMsg = this.intervalTime--
        if (this.intervalTime === 0) {
          this.getCaptchaMsg = '获取验证码'
          clearInterval(temp)
          this.intervalTime = 60
        }
      }, 1000)
      if (this.user.telephone) {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getTelephoneAuthCode',
          data: {
            telephone: this.user.telephone,
            type: '6'
          }
        }).then(response => {
        }, response => {
          this.getCaptchaMsg = '获取验证码'
          clearInterval(temp)
          this.intervalTime = 60
        })
      } else {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getEmailAuthCode',
          data: {
            email: this.user.email,
            type: '20'
          }
        }).then(response => {
        }, response => {
          this.getCaptchaMsg = '获取验证码'
          clearInterval(temp)
          this.intervalTime = 60
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
      this.committing = true
      this.$store.dispatch('encryptConnection', {
        url: '/googleAuthenticator/addGoogleAuthenticatorUI',
        data: {
          dynamicPassword: this.googleCaptcha,
          secret: this.privateKey,
          telephoneCode: this.user.telephone ? this.captcha : null,
          emailCode: this.user.telephone ? null : this.captcha
        }
      }).then(response => {
        this.$store.commit('setUser', {googleAuthenticator: 1})
        this.$message.success('认证成功')
        this.$router.push({name: 'SecuritySettings'})
      }, response => {
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
  mounted () {
    this.$store.dispatch('encryptConnection', {
      url: '/googleAuthenticator/showGoogleIngoUI'
    }).then(response => {
      this.privateKey = response.body.data.secret
      this.$refs.svg.innerHTML = require('qr-image').imageSync(response.body.data.content, { type: 'svg' })
    }, response => {
      this.privateKey = '获取失败'
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })
  }
}
</script>

<style scoped>
</style>
