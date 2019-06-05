<template>
  <!--通用弹出遮罩-->
  <transition name="el-fade-in">
    <div class="dialog-background" v-if="visible">
      <div class="dialog-container" :style="size" @click.stop="()=>{}">
        <i class="iconfont icon-close" @click="closeDialog" v-if="closeButton"></i>
        <div class="header" v-else></div>
        <slot name="body"></slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    closeButton: {
      type: Boolean,
      default: true
    },
    handleClose: {
      type: Function,
      default: () => {}
    },
    width: {
      type: Number,
      default: 0
    },
    height: {
      type: Number,
      default: 0
    }
  },
  computed: {
    size () {
      const width = this.width ? 'width: ' + this.width + 'px; ' : ''
      const height = this.height ? 'height: ' + this.height + 'px;' : ''
      return width + height
    }
  },
  methods: {
    closeDialog () {
      this.handleClose()
      this.$emit('updateVisible')
    }
  }
}
</script>

<style scoped>
  .dialog-background {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    filter: alpha(opacity=35);
    background-color: rgba(0, 0, 0, .35);
  }

  .dialog-container {
    width: fit-content;
    width: -moz-fit-content;
    position: absolute;
    left: 0;
    right: 0;
    margin: 5% auto;
    border-radius: 4px;
    background-color: #FFF;
    padding: 30px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .iconfont.icon-close {
    font-size: 13px;
    color: #666;
    position: absolute;
    top: 17px;
    right: 17px;
    -webkit-transition: all 300ms;
    -moz-transition: all 300ms;
    -ms-transition: all 300ms;
    -o-transition: all 300ms;
    transition: all 300ms;
  }

  .iconfont.icon-close:hover {
    transform: rotate(180deg);
    cursor: pointer;
    color: #0BB2FE;
  }

  /*顶部丑死的蓝条*/
  .header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: #0BB2FE;
    height: 10px;
    -webkit-border-radius: 4px 4px 0 0;
    -moz-border-radius: 4px 4px 0 0;
    border-radius: 4px 4px 0 0;
  }

  /*不同页面距离顶部的样式*/
  .exchangeDialog .dialog-container{margin:0 auto;padding: 0;width: 590px;height: 606px;top: 50%;margin-top: -303px;}
  .notBound .dialog-container{width: 590px;height: 277px;top: 50%;margin-top: -138.5px;}

</style>
