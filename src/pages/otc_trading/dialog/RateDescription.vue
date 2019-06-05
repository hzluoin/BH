<template>
  <div class="rate_description" >
    <!--弹窗记录查看-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :width="527" :height="0">
      <div slot="body">
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  components: {
    BhDialog
  }
}
</script>

<style scoped>
</style>
