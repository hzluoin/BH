<template>
  <div class="bh-root">
    <div class="bh-nav_content" :class="{'bh-nav_content-fixed': !fullWidth, 'bh-nav_content-full-width': fullWidth}">
      <a href="/home">
        <img class="bh-nav_logo bh-logo_white bh-align-vertical__middle" src="../assets/images/logo_white.svg">
      </a>
      <button class="bh-btn_text" @click="$router.push({name: 'OtcTrading'})">{{$t('navigation.OTC')}}</button>
      <button class="bh-btn_text" @click="goTo">{{$t('navigation.EXCHANGE')}}</button>
      <!--<button class="bh-btn_text" @click="$router.push({name: 'CurrencyApplication'})">{{$t('navigation.Listing')}}</button>-->
      <button class="bh-btn_text" @click="goTo">{{$t('navigation.Listing')}}</button>
      <button class="bh-btn_text color1" @click="$router.push({name: 'Publish'})">{{$t('navigation.Release')}}</button>
      <button class="bh-btn_text color1" @click="$router.push({name: 'InnovateProject'})">{{$t('navigation.InnovationProject')}}</button>
      <!--邀请有奖-->
      <a class="invite" href="/invite" >
        <img class="bh-align-vertical__middle" src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/invite.png">
      </a>
      <!--抽奖活动-->
      <a class="jackpot" target="_blank" href="/activity">
        <img class="bh-align-vertical__middle" src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/jackpot.png">
      </a>
      <div class="bh-menu" v-if="user.loginStatus">
        <assets-management></assets-management>
        <menu-select></menu-select>
      </div>
      <div class="bh-login" v-else>
        <button class="bh-btn_text bh-isButton-all" :class="{active:isRegister}" @click="$router.push({name: 'Register', params: {inviteeCode: 'inviteeCode'}})">{{$t('button.SignUp')}}</button>
        <button class="bh-btn_text bh-isButton-all" :class="{active:!isRegister}" @click="$router.push({name: 'Login'})">{{$t('button.LoginIn')}}</button>
      </div>
      <!--语言-->
      <div class="bh-language">
        <language-select></language-select>
      </div>
    </div>
  </div>
</template>

<script>
import MenuSelect from './MenuSelect'
import AssetsManagement from './AssetsManagement'
import LanguageSelect from '../components/LanguageSelect'
export default {
  name: 'Navigation',
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LanguageSelect,
    MenuSelect,
    AssetsManagement
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    isRegister () {
      return /Register/.test(this.$route.name)
    }
  },
  methods: {
    switchLang () {
      this.$i18n.locale = this.value
    },
    goTo () {
      this.$message.success('功能开发中，敬请期待')
    }
  }
}
</script>

<style scoped>
  .bh-root {
    position: relative;
    width: 100%;
    height: 60px;
    line-height: 60px;
    text-align: left;
    padding: 0 50px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bh-nav_content-fixed {
    position: relative;
    width: 1200px;
    height: 100%;
    margin: auto;
  }

  .bh-nav_content-full-width {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 1198px;
    margin: auto;
  }

  .bh-nav_logo {
    vertical-align: middle;
    margin-right: 48px;
  }

  .bh-nav_content .bh-btn_text {
    margin-right: 24px;
    font-size: 16px;
  }

  .bh-nav_content div:last-child {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0px;
    margin: auto;z-index: 1111;
  }

  /*登录、注册*/
  .bh-login {
    text-align: right;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 100px;
  }
  .bh-login button.bh-btn_text {
    position: relative;
    display: inline-block;
    height: 37px;
    margin-right: 16px;
    font-size: 16px;
    color: #FFF;
  }
  .bh-login button.bh-btn_text.active{
    color: #0BB2FE;
    font-size: 16px;
    border-bottom: 1px solid #0BB2FE;
    height: 22px !important;
    padding: 0;
    border-radius: 0;
  }

  .bh-login button.bh-btn_text.active:hover {
    font-weight: bold;
  }

  /*登录后的小菜单*/
  .bh-menu div:first-child {
    margin-right: 100px;
  }

  .invite,.jackpot{width: 96px;height: 26px;margin-right: 24px;}
  .invite img,.jackpot img{width: 96px;height: 26px;}
  .bh-menu{position: absolute;right: 150px;bottom: 0;top: 0;}
</style>
