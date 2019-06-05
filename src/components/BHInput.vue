<template>
  <div>
    <div v-if="type==='text'">
      <input type="text" v-model="currentValue" :maxLength="maxLength" :disabled="disabled"/>
    </div>
    <div v-else-if="type==='integer'">
      <input ref="int" @input="integerFilter" v-model="currentValue" type="text" :maxLength="maxLength" :disabled="disabled"/>
    </div>
    <div v-else-if="type==='password'">
      <!--组件功能：通过动态修改type的值来防止浏览记住密码-->
      <input @input="passwordFilter" @foucs="passwordType='password'"  v-model="currentValue" :type="passwordType" :maxLength="maxLength" :disabled="disabled" autocomplete="new-password" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'BHInput',
  model: {
    prop: 'currentValue',
    event: 'input'
  },
  props: {
    // 输入类型: text(文本)、integer(整数)、double、password；
    type: {
      type: String,
      default: 'text'
    },
    // 最大可输入长度: 对type为integer、double的输入无效；达到最大值无法输入，超出则合规校验失败； -1无限制；
    maxLength: {
      type: Number,
      default: 9999
    },
    // 最小可输入长度: 对type为integer、double的输入无效；不满足最小值合规校验失败； -1无限制；
    minLength: {
      type: Number,
      default: -1
    },
    // 整数最大位数: 仅对type为integer、double的输入有效；达到最大值无法在整数部分继续输入，超出则合规校验失败； -1无限制；
    integerDigits: {
      type: Number,
      default: -1
    },
    // 小数最大位数: 仅对type为double的输入有效；达到最大值无法在小数部分继续输入，超出则合规校验失败； -1无限制；
    decimalDigits: {
      type: Number,
      default: -1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 一般输入框的当前值
      currentValue: '',
      // 输入框的上次值
      lastValue: '',
      // 密码输入框的真●值
      passwordValue: '',
      passwordType: 'text'
    }
  },
  watch: {
    currentValue () {
      this.$emit('input', this.currentValue)
    }
  },
  methods: {
    integerFilter (event) {
      // 禁止非授信输入
      if (!event.isTrusted) {
        this.currentValue = this.lastValue
        return
      }
      // 过滤非字符输入;insertText:按键输入;insertFromPaste:粘贴;
      switch (event.inputType) {
        case 'insertText':
          if (/^\d$/.test(event.data)) {
            this.lastValue = this.currentValue
          } else {
            this.currentValue = this.lastValue
          }
          break
        case 'insertFromPaste':
          if (/^\d*$/.test(this.currentValue) && (this.currentValue.length <= this.maxLength)) {
            this.lastValue = this.currentValue
          } else {
            this.currentValue = this.lastValue
          }
          break
        default:
          this.lastValue = this.currentValue
      }
      // 合规检测
      if (this.currentValue.length >= this.minLength && this.currentValue.length <= this.maxLength) {
        this.$emit('update:condition', true)
      } else {
        this.$emit('update:condition', false)
      }
    },
    passwordFilter (event) {
      // 禁止非授信输入
      if (!event.isTrusted) {
        this.currentValue = this.lastValue
        return false
      }
      // 仅允许单个字符输入
      // if (/insertText/.test(event.inputType)) {
      //   let str = ''
      //   for (; str.length < this.passwordValue.length; str += '●') ;
      //   this.passwordValue = str
      //   this.currentValue
      // } else {
      //   this.lastValue = this.currentValue
      // }
      // if (this.currentValue.length >= this.minLength && this.currentValue.length <= this.maxLength) {
      //   this.$emit('update:condition', true)
      // } else {
      //   this.$emit('update:condition', false)
      // }
    }
  }
}
</script>

<style scoped>

</style>
