<template>
  <div class="bh-root">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bg-F4FBFF ft16 color-0BB2FE">{{$t('menu.SecuritySettings')}}</span>
      </el-col>
    </el-row>

    <!--警告-->
    <el-row>
      <el-col :span="24">
        <i class="iconfont icon-tanhao"></i>
        <span class="ft12 bh-color_prompt">安全提示：请不要透露短信和谷歌验证码给任何人。</span>
      </el-col>
    </el-row>

    <!--手机认证-->
    <el-row>
      <el-col :span="3">
        <span class="ft14 color-333">手机认证</span>
      </el-col>
      <el-col :span="1" v-if="user.telephone">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/yrz.svg" alt=""></span>
      </el-col>
      <el-col :span="1" v-if="!user.telephone">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/wrz.svg" alt=""></span>
      </el-col>
      <el-col :span="10">
        <span class="ft12 color-666">登录、提现、修改密码，及安全设置时用以收取验证短信。</span>
      </el-col>
      <el-col :span="2" :offset="8" v-if="!user.telephone">
        <button class="bh-btn_plain" @click="$router.push({name: 'Phone'})">立即认证</button>
      </el-col>
      <el-col :span="8" v-if="user.telephone">
        <span>{{user.desensitizationTelephone}}</span>
      </el-col>
      <el-col :span="2" v-if="user.telephone">
        <button class="bh-btn_plain" @click="$router.push({name: 'UpdatePhone'})">修改</button>
      </el-col>
    </el-row>

    <!--邮箱认证-->
    <el-row>
      <el-col :span="3">
        <span class="ft14 color-333">邮箱认证</span>
      </el-col>
      <el-col :span="1" v-if="user.email">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/yrz.svg" alt=""></span>
      </el-col>
      <el-col :span="1" v-if="!user.email">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/wrz.svg" alt=""></span>
      </el-col>
      <el-col :span="10">
        <span class="ft12 color-666">邮箱用于登录、提现及安全设置时使用，激活后不可修改。</span>
      </el-col>
      <el-col :span="8" v-if="user.email">
        <span>{{user.desensitizationEmail}}</span>
      </el-col>
      <el-col :span="2" :offset="8" v-else>
        <button class="bh-btn_plain" @click="$router.push({name: 'Email'})">立即认证</button>
      </el-col>
    </el-row>

    <!--Google认证-->
    <el-row>
      <el-col :span="3">
        <span class="ft14 color-333" style="">Google认证</span>
      </el-col>
      <el-col :span="1" v-if="user.googleAuthenticator">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/yrz.svg" alt=""></span>
      </el-col>
      <el-col :span="1" v-if="!user.googleAuthenticator">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/wrz.svg" alt=""></span>
      </el-col>
      <el-col :span="10">
        <span class="ft12 color-666">提现，修改密码，及安全设置时用以输入谷歌验证码详细信息请阅读，使用指南;下载:Andriod/iOS。</span>
      </el-col>
      <el-col :span="2" :offset="8" v-if="user.googleAuthenticator===0">
        <button class="bh-btn_plain" @click="$router.push({name: 'GoogleCertification'})">立即认证</button>
      </el-col>
      <el-col :span="2" :offset="6" v-if="user.googleAuthenticator===1 || user.googleAuthenticator===2">
        <button class="bh-btn_plain" @click="$router.push({name: 'GoogleCertification'})">重置</button>
      </el-col>
      <el-col :span="2" v-if="user.googleAuthenticator===1 || user.googleAuthenticator===2">
        <el-switch v-model="googleValue" active-color="#0BB2FE" inactive-color="#DDDFE6"></el-switch>
      </el-col>
    </el-row>

    <!--实名认证-->
    <el-row>
      <el-col :span="3">
        <span class="ft14 color-333">实名认证</span>
      </el-col>
      <el-col :span="1" v-if="user.identityAuthenticator">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/yrz.svg"></span>
      </el-col>
      <el-col :span="1" v-else>
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/wrz.svg"></span>
      </el-col>
      <el-col :span="10">
        <span class="ft12 color-666">为了您的资金安全，需验证您的身份才可进行交易；认证信息一经验证不能修改，请务必如实填写。</span>
      </el-col>
      <el-col :span="2" :offset="8">
        <button class="bh-btn_plain" @click="$router.push({name: 'Authentication'})">实名认证</button>
      </el-col>
    </el-row>

    <!--资金密码-->
    <el-row>
      <el-col :span="3">
        <span class="ft14 color-333">资金密码</span>
      </el-col>
      <el-col :span="1" v-if="user.fundPassword">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/yrz.svg" alt=""></span>
      </el-col>
      <el-col :span="1" v-if="!user.fundPassword">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/wrz.svg" alt=""></span>
      </el-col>
      <el-col :span="10">
        <span class="ft12 color-666">交易，提现时使用。</span>
      </el-col>
      <el-col :span="2" :offset="8" v-if="user.fundPassword===0">
        <button class="bh-btn_primary__small" @click="assetPassword=true">设置</button>
      </el-col>
      <el-col :span="2" :offset="6" v-if="user.fundPassword===1">
        <button class="bh-btn_plain" @click="$router.push({name: 'UpdateTradingPassword'})">修改</button>
      </el-col>
      <el-col :span="2" v-if="user.fundPassword===1">
        <button class="bh-btn_plain" @click="$router.push({name: 'ResetTradingPassword'})">重置</button>
      </el-col>
    </el-row>

    <!--登录密码-->
    <el-row>
      <el-col :span="3">
        <span class="ft14 color-333">登录密码</span>
      </el-col>
      <el-col :span="1" v-if="user.passwordLevel">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/yrz.svg" alt=""></span>
      </el-col>
      <el-col :span="1" v-if="!user.passwordLevel">
        <span  style="width:14px;height:14px;"><img src="../../../assets/images/wrz.svg" alt=""></span>
      </el-col>
      <el-col :span="10">
        <span class="ft12 color-666">安全级别</span>
        <i class="bh-grade" :class="{'bh-grade_low': passwordLevel===0,'bh-grade_medium': passwordLevel===1,'bh-grade_high': passwordLevel===2}"></i>
      </el-col>
      <el-col :span="2" :offset="6">
        <button class="bh-btn_plain" @click="$router.push({name: 'UpdatePassword'})">修改</button>
      </el-col>
      <el-col :span="2">
        <button class="bh-btn_plain" @click="$router.push({name: 'ResetPassword'})">找回</button>
      </el-col>
    </el-row>
    <!--关闭Google验证-->
    <google-dialog :visible.sync="googleDialog" v-if="googleDialog"></google-dialog>
    <!--设置资金密码-->
    <money-password :visible.sync="assetPassword" v-if="assetPassword"></money-password>
  </div>
</template>

<script>
import GoogleDialog from './dialog/GoogleDialog'
import MoneyPassword from './dialog/MoneyPassword'
export default {
  name: 'SecuritySettings',
  components: {
    GoogleDialog,
    MoneyPassword
  },
  data () {
    return {
      user: this.$store.getters.getUser,
      // Dialog对话框
      // 关闭谷歌验证
      googleDialog: false,
      // 设置资金密码
      assetPassword: false,
      // google开关定时器
      googleFrequency: null
    }
  },
  computed: {
    googleValue: {
      set () {
        if (this.googleFrequency) {
          return false
        } else {
          this.googleFrequency = setTimeout(() => {
            clearTimeout(this.googleFrequency)
            this.googleFrequency = null
          }, 2000)
        }
        this.$store.commit('setUser', {
          googleAuthenticator: this.$store.getters.getUser.googleAuthenticator === 1 ? 2 : 1
        })
      },
      get () {
        return this.$store.getters.getUser.googleAuthenticator === 1
      }
    },
    // 实名认证
    identityAuthenticator () {
      return this.$store.getters.getUser.identityAuthenticator
    },
    // 资金密码
    fundPassword () {
      return this.$store.getters.getUser.fundPassword
    },
    // 登录密码等级
    passwordLevel () {
      return parseInt(this.$store.getters.getUser.passwordLevel)
    }

  }
}
</script>

<style scoped>
  /*路由的标题*/
  .bh-root .el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
  }

  .bh-root .el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
   }

  /*警告*/
  .bh-root .el-row:nth-child(2) {
    height: 17px;
    min-height: 17px;
    line-height: 17px;
    margin-bottom: 24px;
    vertical-align: middle;
    border: none;
  }

  .bh-root .el-row:first-child .icon-tanhao {
    margin-right: 6px;
    font-size: 12px;
  }

  /*底线*/
  .el-row {
    border-bottom: 1px solid #D8D8D8;
    min-height: 52px;
    max-height: 156px;
    line-height: 52px;
    padding-left: 5px;
  }

  /*中间多行文字的垂直居中*/
  .el-row .el-col span {
    line-height: normal;
    display:inline-block;
    vertical-align: middle;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  /*除第一行提示外的小图标*/
  .icon-tanhao {
    font-size: 14px;
    margin-right: 6px;
    vertical-align: middle;
  }

  /*所有按钮的对齐方式*/
  .el-row .el-col-2 {
    text-align: right;
  }
  .el-row .el-col-1 {
    text-align: left;
  }
</style>
