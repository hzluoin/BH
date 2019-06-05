<template>
  <div class="bh-root">

    <div class="bh-select_input" @mouseover="mouseOver" @mouseout="mouseOut">
      <div><img src="../assets/images/proper.svg"/></div>
      <i class="iconfont icon-sanjiaoxing-up" :class="{'bh-rotate': !showDropdown}">️</i>
    </div>

    <div class="bh-select_dropdown" :class="{'bh-select_dropdown_show': showDropdown}" @mouseover="mouseOver" @mouseout="mouseOut">
      <ul>
        <li @click="goTo('AccountInformation')">
          <img src="../assets/images/user_gray.svg" class="bh-inactivated"/>
          <img src="../assets/images/user_blue.svg" class="bh-active"/>&nbsp;
          <span>个人中心</span>
        </li>
        <li @click="goTo('SecuritySettings')">
          <img src="../assets/images/settings_gray_bold.svg" class="bh-inactivated"/>
          <img src="../assets/images/settings_blue_bold.svg" class="bh-active"/>&nbsp;
          <span>安全设置</span>
        </li>
        <li @click="goTo('Order')">
          <img src="../assets/images/orders_gray.svg" class="bh-inactivated"/>
          <img src="../assets/images/orders_blue.svg" class="bh-active"/>&nbsp;
          <span>我的订单</span>
        </li>
        <li @click="goTo('logout')">
          <img src="../assets/images/exit_gray.svg" class="bh-inactivated"/>
          <img src="../assets/images/exit_blue.svg" class="bh-active"/>&nbsp;
          <span>安全退出</span>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: 'LanguageSelect',
  data () {
    return {
      // 下拉选项是否显示
      showDropdown: false
    }
  },
  methods: {
    mouseOver () {
      this.showDropdown = true
    },
    mouseOut () {
      this.showDropdown = false
    },
    goTo (url) {
      switch (url) {
        case 'AccountInformation':
          this.$router.push({name: 'AccountInformation'})
          break
        case 'SecuritySettings':
          this.$router.push({name: 'SecuritySettings'})
          break
        case 'Order':
          this.$router.push({name: 'Order'})
          break
        case 'logout':
          this.$store.dispatch('logout').then()
          this.$router.push({name: 'Login'})
          break
      }
      this.showDropdown = false
    }
  }
}
</script>

<style scoped>
  .bh-root {
    width: 95px;
    height: 20px;
    overflow: visible;
    position: relative;
  }

  /*输入框*/
  .bh-select_input {
    width: 40px;
    height: 20px;
    line-height: 20px;
    color: #FFF;
    background-color: transparent;
    text-align: left;
    position: absolute;
    right: 0;
  }

  .bh-select_input img {
    width: 20px;
    height: 20px;
  }

  /*小箭头哦*/
  .bh-select_input i {
    position: absolute;
    top: 0;
    right: 0;
    color: #8C8C8F;
    -webkit-transition: all 500ms;
    -moz-transition: all 500ms;
    -ms-transition: all 500ms;
    -o-transition: all 500ms;
    transition: all 500ms;
  }

  .bh-select_input:hover {
    cursor: pointer;
   }

  /*小箭头翻滚*/
  .bh-rotate {
    transform: rotate(180deg);
  }

  /*偷偷出来的下拉框*/
  .bh-select_dropdown {
    position: absolute;
    top: 30px;
    left: 0;
    overflow: hidden;
    width: 130px;
    height: 0;
    background-color: #FFF;
    color: #8C8C8F;
    z-index: 5;
    border-radius:3px;
    box-shadow: 0 1px 3px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    -webkit-transition: height 200ms;
    -moz-transition: height 200ms;
    -ms-transition: height 200ms;
    -o-transition: height 200ms;
    transition: height 200ms;
  }

  .bh-select_dropdown_show {
    height: 142px;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  /*图标、文字两端对齐*/
  .bh-select_dropdown li {
    position: relative;
    line-height: 30px;
    cursor: pointer;
    margin-bottom: 4px;
    padding: 0 28px;
  }

  .bh-select_dropdown li:last-child {
    margin-bottom: 0;
  }

  /*鼠标划过*/
  .bh-active {
    display: none;
  }

  .bh-select_dropdown li:hover {
    background-color: #F4FBFF;
    color: #0BB2FE;
  }

  .bh-select_dropdown li:hover .bh-active {
    display: inline-block;
  }

  .bh-select_dropdown li:hover .bh-inactivated {
    display: none;
  }

  .bh-select_dropdown i {
    vertical-align: middle;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 7px;
    margin: auto;
  }

  .bh-select_dropdown span {
    position: absolute;
    /*right: 9px;*/
    display: inline-block;
    height: 30px;
    line-height: 30px;
  }

  .bh-select_dropdown img {
    width: 15px;
    height: 15px;
    vertical-align: middle;
  }

</style>
