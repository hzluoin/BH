<template>
  <div class="bh-select">
    <div class="bh-select_input">sdfdsf</div>
    <div class="bh-select_dropdown" :style="dropdownStyle"></div>
  </div>
</template>

<script>
export default {
  name: 'BHSelect',
  props: ['placeholder'],
  components: {
  },
  data () {
    return {
      // 下拉框样式
      dropdownStyle: ''
    }
  },
  created () {
    // 获取
  }
}
</script>

<style scoped>

</style>
