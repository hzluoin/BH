<template>
  <div class="bh-root">
    <header>
      <navigation></navigation>
    </header>

    <main :style="mainStyle">
      <div class="bh-account_main">
        <ul class="bh-account_menu ft14 color-666">
          <li :class="{'bh-account_active': m1, 'bh-color_select': m1, 'bg-F4FBFF': m1}" @click="$router.push({name: 'MyAssets'})">
            <img class="bh-icon_normal" src="../../assets/images/zch.svg">
            <img class="bh-icon_hover" src="../../assets/images/zc.svg">
            <span>{{$t('menu.Asset')}}</span>
          </li>
          <li :class="{'bh-account_active': m2, 'bh-color_select': m2, 'bg-F4FBFF': m2}" @click="$router.push({name: 'TopUp'})">
            <img class="bh-icon_normal" src="../../assets/images/cbh.svg">
            <img class="bh-icon_hover" src="../../assets/images/cb.svg">
            <span>充币</span>
          </li>
          <li :class="{'bh-account_active': m3, 'bh-color_select': m3, 'bg-F4FBFF': m3}" @click="$router.push({name: 'MentionMoney'})">
            <img class="bh-icon_normal" src="../../assets/images/tbh.svg">
            <img class="bh-icon_hover" src="../../assets/images/tb.svg">
            <span>提币</span>
          </li>
          <li :class="{'bh-account_active': m4, 'bh-color_select': m4, 'bg-F4FBFF': m4}" @click="$router.push({name: 'MoneyRecord'})">
            <img class="bh-icon_normal" src="../../assets/images/jlh.svg">
            <img class="bh-icon_hover" src="../../assets/images/jl.svg">
            <span>资金记录</span>
          </li>
          <li :class="{'bh-account_active': m5, 'bh-color_select': m5, 'bg-F4FBFF': m5}" @click="$router.push({name: 'Order'})">
            <img class="bh-icon_normal" src="../../assets/images/ddanh.svg">
            <img class="bh-icon_hover" src="../../assets/images/ddan.svg">
            <span>我的订单</span>
          </li>
        </ul>
        <div class="bh-account_router">
          <router-view/>
        </div>
      </div>
    </main>

    <footer>
      <bh-footer></bh-footer>
    </footer>
  </div>
</template>

<script>
import IconSelect from '../../components/LanguageSelect'
import Navigation from '../../components/Navigation'
import BhFooter from '../../components/FooterIndex'
export default {
  name: 'Account',
  components: {
    Navigation,
    IconSelect,
    BhFooter
  },
  computed: {
    mainStyle () {
      // 导航60 底部220
      return 'min-height:' + (this.$store.getters.getScreenHeight - 280) + 'px;'
    },
    divStyle () {
      // 导航74 底部370 上间距10 下间距41
      return 'min-height:' + (this.$store.getters.getScreenHeight - 495) + 'px;'
    },
    m1 () {
      return this.$route.name === 'MyAssets'
    },
    m2 () {
      return this.$route.name === 'TopUp'
    },
    m3 () {
      return this.$route.name === 'MentionMoney'
    },
    m4 () {
      return this.$route.name === 'MoneyRecord'
    },
    m5 () {
      return this.$route.name === 'Order'
    }
  },
  created () {
    // 获取用户信息
    this.$store.dispatch('qryUserInfo').then(response => {
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
</script>

<style scoped>
  .bh-root {
  }

  header {
    background-color: #2C3253;
  }

  main {
    background-color: #F2F3F8;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-top: 10px;
    padding-bottom: 80px;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }

  .bh-account_main {
    width: 1200px;
    min-height: 555px;
    padding: 15px 35px 58px 35px;
    margin: 10px auto 20px auto;
    background-color: #FFF;
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
    transition: all 200ms;
  }

  .bh-account_main img {
    width: 16px;
    height: 17px;
    vertical-align: middle;
  }

  /*小菜单*/
  .bh-account_main ul {
    display: inline-block;
    width: 180px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 1px solid #D8D8D8;
    vertical-align: top;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  /*鼠标划过*/
  .bh-account_main li {
    min-height: 35px;
    max-height: 70px;
    line-height: 35px;
    text-align: left;
    cursor: pointer;
    border-left: 2px solid transparent;
    padding-left: 28px;
  }

  .bh-account_main li:hover {
    background-color: #F2F3F8;
  }

  .bh-icon_hover {
    display: none;
  }

  .bh-icon_normal {
    display: inline-block;
  }

  .bh-account_main li:hover .bh-icon_normal {
    display: none;
  }
  .bh-account_main li:hover .bh-icon_hover {
    display: inline-block;
  }

  /*被选中*/
  .bh-account_main .bh-account_active {
    background-color: #F2F3F8;
    border-left: 2px solid #0BB2FE;
  }

  .bh-account_active img[class='bh-icon_hover'] {
    display: inline-block;
  }

  .bh-account_active img[class='bh-icon_normal'] {
    display: none;
  }

  /*路由*/
  .bh-account_router {
    display: inline-block;
    width: 917px;
    vertical-align: top;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin-left: 29px;
  }

  .bh-account_router_title span {
    display: inline-block;
    height: 25px;
    line-height: 25px;
    margin: 5px 0 0 10px;
  }

  footer {
    position: relative;
    bottom: 0;
  }
</style>
