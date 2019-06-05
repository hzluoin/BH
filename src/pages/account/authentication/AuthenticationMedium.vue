<template>
  <div class="bh-root">

    <el-row class="bh-authentication_medium">
      <el-col :span="24">
        <div>
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_low.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">初级认证</span>
        </div>
        <img src="../../../assets/images/arrow_red.png"/>
        <div>
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_medium.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">中级认证</span>
        </div>
        <img src="../../../assets/images/arrow_red.png"/>
        <div>
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_high_gray.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">高级认证</span>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col class="bh-upload" :span="8">
        <span class="ft14 color-666">证件正面照</span>
        <div>
          <el-upload v-loading="loading" action=""
                     :show-file-list="false" accept="image/*"
                     :on-change="frontHandleChange" :multiple="false"
                     :auto-upload="false" list-type="picture">
            <span v-if="!front"><i class="iconfont icon-upload"></i></span>
            <img style="width: 250px;height: 156px;" v-if="front" :src="front">
            <img src="../../../assets/images/document_front.png" v-else>
          </el-upload>
          <!--<button v-if="!front" class="bh-btn_plain__large">查看示例</button>-->
        </div>
      </el-col>
      <el-col class="bh-upload" :span="8">
        <span class="ft14 color-666">证件反面照</span>
        <div>
          <el-upload v-loading="loading" action=""
                     :show-file-list="false" accept="image/*"
                     :on-change="backHandleChange" :multiple="false"
                     :auto-upload="false" list-type="picture">
            <span v-if="!back"><i class="iconfont icon-upload"></i></span>
            <img style="width: 250px;height: 156px;" v-if="back" :src="back">
            <img src="../../../assets/images/document_back.png" v-else>
          </el-upload>
          <!--<button v-if="!back" class="bh-btn_plain__large">查看示例</button>-->
        </div>
      </el-col>
      <el-col class="bh-upload" :span="8">
        <span class="ft14 color-666">手持证件照</span>
        <div>
          <el-upload v-loading="loading" action=""
                     :show-file-list="false" accept="image/*"
                     :on-change="graspHandleChange" :multiple="false"
                     :auto-upload="false" list-type="picture">
            <span v-if="!grasp"><i class="iconfont icon-upload"></i></span>
            <img style="width: 250px;height: 156px;" v-if="grasp" :src="grasp">
            <img src="../../../assets/images/document_grasp.png" v-else>
          </el-upload>
          <!--<button v-if="!grasp" class="bh-btn_plain__large">查看示例</button>-->
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <button class="bh-btn_primary" @click="commit" :disabled="!(front&&back&&grasp&&!loading)">确认</button>
      </el-col>
    </el-row>

    <picture-editor v-if="showPictureEditor" :visible.sync="showPictureEditor" :settings="settings" @success="uploadImage"></picture-editor>

  </div>
</template>

<script>
import PictureEditor from '../../../components/PictureEditor'
export default {
  components: {
    PictureEditor
  },
  data () {
    return {
      loading: false,
      // 正、反、手持
      front: '',
      back: '',
      grasp: '',
      showPictureEditor: false,
      editType: 1,
      settings: {
        outputSize: 0.3,
        autoCropWidth: 423,
        autoCropHeight: 270
      }
    }
  },
  created () {
    switch (parseInt(this.$store.getters.getUser.identityAuthenticator)) {
      case 0:
        this.$router.push({name: 'AuthenticationLow'})
        break
      case 2:
        this.$router.push({name: 'AuthenticationMediumAudit'})
        break
      case 3:
        this.$router.push({name: 'AuthenticationHigh'})
        break
      case 4:
        this.$router.push({name: 'AuthenticationHigh'})
        break
    }
  },
  methods: {
    uploadImage (data) {
      switch (this.editType) {
        case 1:
          this.front = data
          break
        case 2:
          this.back = data
          break
        case 3:
          this.grasp = data
          break
      }
    },
    frontHandleChange (file) {
      this.editType = 1
      this.showPictureEditor = true
      this.$set(this.settings, 'image', file.url)
    },
    backHandleChange (file) {
      this.editType = 2
      this.showPictureEditor = true
      this.$set(this.settings, 'image', file.url)
    },
    graspHandleChange (file) {
      this.editType = 3
      this.showPictureEditor = true
      this.$set(this.settings, 'image', file.url)
    },
    commit () {
      this.loading = true
      this.$http.post('/identityauthentication/secondAuthenticationUI', {
        img: this.front.split(',')[1],
        imgBack: this.back.split(',')[1],
        base64Img: this.grasp.split(',')[1]
      }).then(response => {
        this.loading = false
        this.$message.success('提交成功，等待人工审核！')
        this.$store.commit('setUser', {identityAuthenticator: 2})
        this.$router.push({name: 'Authentication'})
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>
  .bh-root>.el-row {
    margin-bottom: 17px;
  }

  .bh-authentication_medium .el-col {
    height: 34px;
    line-height: 34px;
  }

  .bh-authentication_medium div {
    display: inline-block;
  }

  /*灰色下划线*/
  .bh-authentication_medium {
    border-bottom: 2px solid #D8D8D8;
    text-align: left;
  }

  .bh-authentication_medium .el-col-24 img {
    margin: 0 10px;
  }

  .bh-authentication_medium .el-col-24>img {
    margin: 0 15px;
  }

  /*低级认证:蓝色下划线*/
  .bh-authentication_medium .el-col-24 div:nth-child(3) {
    border-bottom: 2px solid #0BB2fE;
    height: 34px !important;
    margin-bottom: -2px;
  }

  .bh-upload {
    text-align: center;
  }

  .bh-upload>span {
    display: inline-block;
    margin: 10px auto;
  }

  /*上传图标*/
  .bh-upload>div {
    position: relative;
    width: 250px;
    text-align: center;
    border-radius: 2px;
    border: 1px solid #D8D8D8;
    padding: 5px 5px 15px 5px;
    margin: auto;
  }

  .bh-upload>div span {
    display: inline-block;
    width: 29px;
    height: 29px;
    line-height: 29px;
    text-align: center;
    border-radius: 100%;
    background-color: #FFF;
    position: absolute;
    top: 58px;
    left: 0;
    right: 0;
    margin: auto;
  }

  .bh-upload>div img {
    cursor: pointer;
  }

  .icon-upload {
    font-size: 12px;
    color: #0BB2fE;
  }

  /*查看示例*/
  .bh-btn_plain__large {
    margin-top: 15px;
  }

  /*确定*/
  .bh-root .el-row:last-child {
    text-align: center;
  }

  .bh-btn_primary {
    width: 200px;
    height: 36px;
  }
</style>
