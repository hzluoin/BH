<template>
  <!--弹窗记录查看-->
  <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :closeButton="false" v-loading="loading">
    <div slot="body">
      <!--预览模块-->
      <div class="preview" v-show="showPreview" @click="showPreview = false">
        <div class="preview-show">
          <img :src="resultData" alt="">
        </div>
      </div>
      <!--编辑模块-->
      <div class="cropper-container">
        <vue-cropper ref="cropper" :img="option.image" :output-size="option.outputSize" :output-type="option.outputType" :info="true" :full="option.full"
                     :can-move="option.canMove" :can-move-box="option.canMoveBox" :fixed-box="option.fixedBox" :original="option.original"
                     :auto-crop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"
                     :high="option.high"></vue-cropper>
      </div>
      <div class="cropper-btn center-lr-scatter">
        <button class="bh-btn_primary ft16" @click="zoomIn"><i class="el-icon-zoom-in"></i></button>
        <button class="bh-btn_primary ft16" @click="zoomOut"><i class="el-icon-zoom-out"></i></button>
        <button class="bh-btn_primary ft16" @click="rotateRight"><i class="el-icon-refresh"></i></button>
        <button class="bh-btn_primary ft16" @click="preview">预览</button>
        <button class="bh-btn_primary ft16" @click="cancel">取消</button>
        <button class="bh-btn_primary ft16" @click="finish">完成</button>
        <!--<button class="bh-btn_primary ft16" @click="down">下载</button>-->
      </div>
    </div>
  </bh-dialog>
</template>

<script>
import BhDialog from './BHDialog'
import {VueCropper} from 'vue-cropper'
export default {
  components: {
    BhDialog,
    VueCropper
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: JSON.parse('{}')
    }
  },
  data () {
    return {
      loading: false,
      // 查看预览
      showPreview: false,
      // 截图base64
      resultData: '',
      option: {
        image: '',
        outputSize: 1,
        full: true,
        outputType: 'jpeg',
        canMove: true,
        fixedBox: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 200,
        centerBox: true,
        high: true
      }
    }
  },
  created () {
    for (let key in this.settings) {
      this.option[key] = this.settings[key] === undefined ? this.option[key] : this.settings[key]
    }
  },
  methods: {
    zoomIn () {
      this.$refs.cropper.changeScale(1)
    },
    zoomOut () {
      this.$refs.cropper.changeScale(-1)
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    preview () {
      this.loading = true
      this.$refs.cropper.getCropData((data) => {
        this.loading = false
        this.showPreview = true
        this.resultData = data
      })
    },
    cancel () {
      this.$emit('update:visible', false)
    },
    finish () {
      this.loading = true
      this.$refs.cropper.getCropData((data) => {
        this.loading = false
        this.$emit('success', data)
        this.$emit('update:visible', false)
      })
    },
    down () {
      var aLink = document.createElement('a')
      aLink.download = 'demo'
      this.$refs.cropper.getCropData((data) => {
        aLink.href = data
        aLink.click()
      })
    }
  }
}
</script>

<style scoped>
  .preview {
    position: fixed;
    z-index: 10;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
  }

  .preview-show {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
  }

  .preview img {
    display: block;
    margin: auto;
    max-width: 80%;
    user-select: none;
    background-position: 0px 0px, 10px 10px;
    background-size: 20px 20px;
    background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%, #eee 100%),linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
  }

  .cropper-container {
    width: 500px;
    height: 50vh;
  }

  .cropper-btn {
    margin-top: 30px;
  }
</style>
