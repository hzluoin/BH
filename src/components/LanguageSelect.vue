<template>
  <div class="bh-select-language">
    <div class="bh-select_input" @mouseover="mouseOver" @mouseout="mouseOut">
      <div v-if="simple"><img src="../assets/images/china.png"/>&nbsp;<span class="bh-select_input_span">简体中文</span></div>
      <div v-if="traditional"><img src="../assets/images/china.png"/>&nbsp;<span class="bh-select_input_span">繁體中文</span></div>
      <div v-if="english"><img src="../assets/images/english.png"/>&nbsp;<span class="bh-select_input_span">English</span></div>
      <div v-if="japan"><img src="../assets/images/japan.png"/>&nbsp;<span class="bh-select_input_span">日本語</span></div>
      <div v-if="south_korea"><img src="../assets/images/south_korea.png"/>&nbsp;<span class="bh-select_input_span">한글</span></div>
      <i class="iconfont icon-sanjiaoxing-up" :class="{'bh-rotate': !showDropdown}">️</i>
    </div>
    <div class="bh-select_dropdown" :class="{'bh-select_dropdown_show': showDropdown}" @mouseover="mouseOver" @mouseout="mouseOut">
      <ul ref="options">
        <li v-if="!simple" @click="select('simple')"><img src="../assets/images/china.png"/>&nbsp;<span class="bh-select_dropdown_span">简体中文</span></li>
        <li v-if="!traditional" @click="select('traditional')"><img src="../assets/images/china.png"/>&nbsp;<span class="bh-select_dropdown_span">繁體中文</span></li>
        <li v-if="!english" @click="select('english')"><img src="../assets/images/english.png"/>&nbsp;<span class="bh-select_dropdown_span">English</span></li>
        <!--<li v-if="!japan" @click="select('japan')"><img src="../assets/images/japan.png"/>&nbsp;<span class="bh-select_dropdown_span">日本語</span></li>-->
        <!--<li v-if="!south_korea" @click="select('south_korea')"><img src="../assets/images/south_korea.png"/>&nbsp;<span class="bh-select_dropdown_span">한글</span></li>-->
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LanguageSelect',
  props: ['placeholder', 'data'],
  components: {
  },
  data () {
    return {
      // 下拉选项是否显示
      showDropdown: false,
      // 被选中语言
      simple: false,
      traditional: false,
      english: false,
      japan: false,
      south_korea: false,
      // 当前被选中语言
      currentSelect: 'simple',
      // 一个时间锁，防止收下拉的时候有BUG，true打开，false锁上
      lock: true
    }
  },
  created () {
    switch (this.$i18n.locale) {
      case 'cn':
        this.simple = true
        this.currentSelect = 'simple'
        break
      case 'tw':
        this.traditional = true
        this.currentSelect = 'traditional'
        break
      case 'en':
        this.english = true
        this.currentSelect = 'english'
        break
      case 'japan':
        this.japan = true
        this.currentSelect = 'japan'
        break
      case 'south_korea':
        this.south_korea = true
        this.currentSelect = 'south_korea'
        break
      default:
        this.simple = true
    }
  },
  methods: {
    select (key) {
      // 上锁
      this.lock = false
      // 隐藏下拉
      this.showDropdown = false
      // 修改显示项
      this[key] = true
      this[this.currentSelect] = false
      this.currentSelect = key
      // 解锁
      setTimeout(() => {
        this.lock = true
      }, 200)
      // 换语言
      switch (key) {
        case 'simple':
          this.$i18n.locale = 'cn'
          this.$cookies.set('language', 'cn')
          break
        case 'traditional':
          this.$i18n.locale = 'tw'
          this.$cookies.set('language', 'tw')
          break
        case 'english':
          this.$i18n.locale = 'en'
          this.$cookies.set('language', 'en')
          break
        case 'japan':
          this.$i18n.locale = 'japan'
          this.$cookies.set('language', 'japan')
          break
        case 'south_korea':
          this.$i18n.locale = 'south_korea'
          this.$cookies.set('language', 'south_korea')
          break
      }
    },
    mouseOver () {
      if (this.lock) {
        this.showDropdown = true
      }
    },
    mouseOut () {
      this.showDropdown = false
    }
  }
}
</script>

<style scoped>
  .bh-select-language {
    display: inline-block;
    width: 95px;
    height: 17px;
    overflow: visible;
    position: relative;
  }

  /*已选中框*/
  .bh-select_input {
    width: 100%;
    height: 17px;
    line-height: 17px;
    color: #FFF;
    background-color: transparent;
    text-align: left;
  }

  /*小箭头哦*/
  .bh-select_input i {
    position: absolute;
    top: 0;
    right: 0;
    color: #8C8C8F;
    -webkit-transition: all 200ms;
    -moz-transition: all 200ms;
    -ms-transition: all 200ms;
    -o-transition: all 200ms;
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
    width: 100%;
    background-color: #464648;
    color: #8C8C8F;
    position: absolute;
    overflow: hidden;
    height: 0;
    -webkit-transition: height 200ms;
    -moz-transition: height 200ms;
    -ms-transition: height 200ms;
    -o-transition: height 200ms;
    transition: height 200ms;
    z-index: 1;
  }

  .bh-select_dropdown_show {
    height: 54px;
  }

  .bh-select_dropdown ul {
    padding-top: 2px;
    padding-bottom: 2px;
  }

  /*国旗、文字两端对齐*/
  .bh-select_dropdown li {
    position: relative;
    line-height: 20px;
    cursor: pointer;
    margin-top: 4px;
    margin-bottom: 4px;
  }
  .bh-select_dropdown li:hover {
    background-color: #303030;
    color: #0BB2FE;
  }

  .bh-select_dropdown img {
    vertical-align: middle;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 7px;
    margin: auto;

  }

  .bh-select_dropdown span {
    position: absolute;
    right: 9px;
    display: inline-block;
    height: 20px;
    line-height: 20px;
  }

  .bh-select_dropdown_span {
    font-size: 12px;
  }
</style>
