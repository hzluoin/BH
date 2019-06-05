<template>
  <div>
    <div class="bh-slider">
      <div>
        <span @click="reduce" class="ft14 color-666">{{min}}</span>
      </div>
      <div class="bh-slider_content">
        <i class="bh-slider_origin"></i>
        <el-slider
          v-model="percent1"
          :min="min"
          :max="max"
          :step="step"
          :show-input="false">
        </el-slider>
      </div>
      <div>
        <span @click="increase" class="ft14 color-666">{{max}}</span>
      </div>
    </div>
    <!--输入控制-->
    <div style="text-align: center;width: 100%;" @click="$refs.input.focus()" class="ft12 color-333">
      <div style="text-align: right;display: inline-block;width: 45%;">
        <input ref="input" class="bh-slider_input ft12 color-333" v-model="percent2" type="number" maxlength="4" @blur="onBlurForInput"/>
      </div>
      <div style="text-align: left;display: inline-block;width: 45%;">
        <span>%</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    min: {
      type: Number,
      default: -30
    },
    max: {
      type: Number,
      default: 30
    },
    step: {
      type: Number,
      default: 0.01
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      inputRegExp: new RegExp(`^(.*)[\\.][\\d]{3}$`),
      percent1: 0,
      percent2: 0
    }
  },
  watch: {
    percent1 () {
      if (this.percent1 === 0 && this.percent2 === '') {
        return
      }
      if (this.percent1 === Number(this.percent2)) {
        return
      }
      this.percent2 = this.percent1
      this.$emit('getValue', {value: this.percent1})
    },
    percent2 () {
      // 小数长度超过三位数
      const str = this.percent2.toString()
      if (this.inputRegExp.test(str)) {
        this.percent1 = this.percent2 = Number(str.substr(0, str.length - 1))
      } else {
        this.percent1 = Number(this.percent2 === '' ? 0 : this.percent2)
      }
      this.$emit('getValue', {value: this.percent1})
    }
  },
  methods: {
    onBlurForInput () {
      if (this.percent2 === '') {
        this.percent2 = 0
      }
    },
    increase () {
      if ((this.percent1 + this.step) >= this.max) {
        this.percent1 = this.max
      } else {
        // 小数运算多位BUG
        this.percent1 = (this.percent1 + this.step).toFixed(2)
      }
    },
    reduce () {
      if ((this.percent1 - this.step) <= this.min) {
        this.percent1 = this.min
      } else {
        // 小数运算多位BUG
        this.percent1 = (this.percent1 - this.step).toFixed(2)
      }
    }
  },
  created () {
    this.percent1 = this.percent
    this.percent2 = this.percent
  }
}
</script>

<style scoped>
  .bh-slider {
    position: relative;
  }

  .bh-slider>:first-child, .bh-slider>:last-child {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    display: table;
    cursor: pointer;
    /*禁止选中字体*/
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none; /*webkit浏览器*/
    -ms-user-select: none; /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select:none;
  }
  .bh-slider>:first-child {
    left: 0;
  }
  .bh-slider>:last-child {
    right: 0;
  }
  .bh-slider>:last-child>span {
    display: table-cell;
  }

  .bh-slider_content {
    position: relative;
    margin: auto 30px;
  }
  .bh-slider_content .bh-slider_origin {
    display: block;
    width: 6px;
    height: 6px;
    background: #D8D8D8;
    border-radius: 100%;
    z-index: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  /*输入框*/
  .bh-slider_input {
    border: none;
    text-align: right;
    width: 40px;
    padding: 0px;
    background-color: inherit;
    margin-top: -20px;
  }
  .bh-slider_input::placeholder {
    font-style: normal;
  }
  .bh-slider_input:focus {
    font-style: normal;
  }
</style>
