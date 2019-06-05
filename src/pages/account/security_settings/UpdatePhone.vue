<template>
  <div class="bh-update_phone">
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
        <span class="bh-col_1 ft14 color-333">原手机号码</span>
      </el-col>
      <el-col :span="7">
        <el-input :placeholder="originTelephone" disabled></el-input>
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
        <span class="bh-col_1 ft14 color-333">原手机短信验证码</span>
      </el-col>
      <el-col :span="7">
        <el-input maxlength="6" v-model="originTelephoneCode" placeholder="请输入验证码" @focus="checkOriginTelephoneCodeByFocus" @blur="checkOriginTelephoneCodeByBlur"></el-input>
        <transition name="el-fade-in-linear">
          <span class="bh-hint bh-color_prompt" v-if="showOriginTelephoneCodeMsg">{{originTelephoneCodeMsg}}</span>
        </transition>
      </el-col>
      <el-col :span="13">
        &nbsp;&nbsp;
        <button class="bh-btn_plain__large" @click="getOriginTelephoneCode" :disabled="originIntervalTime!==60">{{originCaptchaMsg}}</button>&nbsp;
        <button class="bh-btn_plain__large" @click="$router.push({name: 'UpdatePhoneLost'})">遗失旧手机</button>
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
        <button class="bh-btn_plain__large" @click="getNewTelephoneCode" :disabled="newTelephoneTestResults===0 ||newTelephoneTestResults===1 || newTelephoneTestResults===3 || ((newTelephoneTestResults===2 || newTelephoneTestResults===true) && newIntervalTime!==60)">{{newCaptchaMsg}}</button>
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
      // 2.原手机短信验证码
      originTelephoneCode: '',
      originTelephoneCodeTestResults: 0,
      showOriginTelephoneCodeMsg: false,
      originTelephoneCodeMsg: '',
      // 3.新手机短信验证码
      newTelephoneCode: '',
      newTelephoneCodeTestResults: 0,
      showNewTelephoneCodeMsg: false,
      newTelephoneCodeMsg: '',
      // 提交中。。。
      commitStatus: false,
      // 验证码获取间隔
      originIntervalTime: 60,
      originCaptchaMsg: '获取验证码',
      newIntervalTime: 60,
      newCaptchaMsg: '获取验证码'
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
    originTelephoneCode () {
      this.showOriginTelephoneCodeMsg = false
      this.originTelephoneCodeMsg = ''
      this.originTelephoneCodeTestResults = 0
      // 1.验证码为空
      if (!this.originTelephoneCode) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.captcha(this.originTelephoneCode)) {
        this.showOriginTelephoneCodeMsg = true
        this.originTelephoneCodeMsg = '验证码格式不正确'
        this.originTelephoneCodeTestResults = 1
        return
      }
      this.originTelephoneCodeTestResults = true
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
    }
  },
  computed: {
    originTelephone () {
      return this.$store.getters.getUser.telephone
    },
    // 国际电话区号数据
    iTelCodeOptions () {
      return ITelCode[this.$i18n.locale]
    },
    disabled () {
      return this.newTelephoneTestResults === true &&
        this.originTelephoneCodeTestResults === true &&
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
      // 为空
      if (this.newTelephoneTestResults === 0) {
        this.showNewTelephoneMsg = true
        this.newTelephoneMsg = '手机号码不能为空'
      }
    },
    // 通过监听Focus控制原手机短信验证码报错提示
    checkOriginTelephoneCodeByFocus () {
      if (this.originTelephoneCode === '') {
        this.originTelephoneCodeTestResults = 0
        this.showOriginTelephoneCodeMsg = false
        this.originTelephoneCodeMsg = ''
      }
    },
    // 通过监听blur校验原手机短信验证码
    checkOriginTelephoneCodeByBlur () {
      // 为空不继续校验
      if (this.originTelephoneCodeTestResults === 0) {
        this.showOriginTelephoneCodeMsg = true
        this.originTelephoneCodeMsg = '验证码不能为空'
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
    // 获取原手机验证码
    getOriginTelephoneCode () {
      this.originCaptchaMsg = --this.originIntervalTime
      const temp = setInterval(() => {
        this.originCaptchaMsg = --this.originIntervalTime
        if (this.originIntervalTime === 0) {
          this.originCaptchaMsg = '获取验证码'
          this.originIntervalTime = 60
          clearInterval(temp)
        }
      }, 1000)
      this.$store.dispatch('encryptConnectionSSO', {
        url: '/sso/message/send',
        data: {
          source: '2',
          countryCode: this.$store.getters.getUser.countryCode,
          telephone: this.originTelephone,
          index: '3'
        }
      }).then(response => {
      }, response => {
        this.$message.error(response.body.msg)
        this.originCaptchaMsg = '获取验证码'
        this.originIntervalTime = 60
        clearInterval(temp)
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
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
    // 获取新手机验证码
    getNewTelephoneCode () {
      // 保证国际区号长度为四位
      this.iTelCode = this.getCountryCode(this.iTelCodeValue)
      this.newCaptchaMsg = --this.newIntervalTime
      const temp = setInterval(() => {
        this.newCaptchaMsg = --this.newIntervalTime
        if (this.newIntervalTime === 0) {
          clear()
        }
      }, 1000)
      const clear = () => {
        this.newCaptchaMsg = '获取验证码'
        this.newIntervalTime = 60
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
        clear()
        this.newTelephoneTestResults = 3
        this.showNewTelephoneMsg = true
        this.newTelephoneMsg = '手机号码已注册'
      })
    },
    commit () {
      this.$store.dispatch('encryptConnectionSSO', {
        url: '/sso/user/updatePhoneAuthenticationUI',
        data: {
          countryCode: this.getCountryCode(this.iTelCodeValue),
          originTelephone: this.originTelephone,
          newTelephone: this.newTelephone,
          originTelephoneCode: this.originTelephoneCode,
          newTelephoneCode: this.newTelephoneCode
        }
      }).then(response => {
        this.$store.commit('setUser', {telephone: this.newTelephone})
        this.$cookies.set('bh_telephone', this.newTelephone)
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
  .bh-update_phone .el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
    margin-bottom: 0;
  }

  .bh-update_phone .el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
  }

  /*警告*/
  .bh-update_phone .el-row:nth-child(2) {
    height: 17px;
    min-height: 17px;
    line-height: 17px;
    margin-bottom: 24px;
    vertical-align: middle;
  }

  .bh-update_phone .icon-tanhao {
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
  .bh-update_phone .el-row:last-child {
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
