<template>
  <div class="bh-root">
    <el-row class="bh-authentication_low">
      <el-col :span="24">
        <div>
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_low.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">初级认证</span>
        </div>
        <img src="../../../assets/images/arrow_red.png"/>
        <div>
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_medium_gray.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">中级认证</span>
        </div>
        <img src="../../../assets/images/arrow_gray.png"/>
        <div>
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_high_gray.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">高级认证</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" style="vertical-align: middle">
        <span class="bh-col_1 ft14 color-333 bh-align-vertical__middle">国籍</span>
      </el-col>
      <el-col :span="20">
        <el-select v-model="iTelCodeValue">
          <el-option
            v-for="item in iTelCodeOptions"
            :key="item.label"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">姓名</el-col>
      <el-col :span="20">
        <el-input placeholder="请输入本人真实姓名，无法再次修改" v-model="name" clearable></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3">身份证号</el-col>
      <el-col :span="20">
        <el-input placeholder="请输入本人身份证号" v-model="identityCard" clearable></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3"></el-col>
      <el-col :span="20">
        <button class="bh-btn_primary_lg" @click="commit" :disabled="disabled">
          <i class="el-icon-loading" v-if="committing"></i>
          <span v-else>确认</span>
        </button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ITelCode from '../../../assets/data/internationalTelephoneCode'
export default {
  name: 'MyAccount',
  data () {
    return {
      iTelCodeValue: '',
      name: '',
      identityCard: '',
      committing: false
    }
  },
  computed: {
    // 国际电话区号数据
    iTelCodeOptions () {
      return ITelCode[this.$i18n.locale]
    },
    disabled () {
      return !(this.iTelCodeValue && this.name && this.identityCard && !this.committing)
    }
  },
  created () {
    switch (parseInt(this.$store.getters.getUser.identityAuthenticator)) {
      case 1:
        this.$router.push({name: 'AuthenticationMedium'})
        break
      case 2:
        this.$router.push({name: 'AuthenticationHigh'})
        break
    }
  },
  methods: {
    commit () {
      this.committing = true
      this.$store.dispatch('encryptConnection', {
        url: '/identityauthentication/firstAuthenticationUI',
        data: {
          userId: this.$store.getters.getUser.userId,
          name: this.name,
          cardNo: this.identityCard
        }
      }).then(response => {
        this.$store.commit('setUser', {username: this.name, identityAuthenticator: 1})
        this.$message.success('认证成功')
        this.iTelCodeValue = ''
        this.name = ''
        this.identityCard = ''
        this.committing = false
        this.$router.push({name: 'SecuritySettings'})
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error('认证失败：' + response.body.msg)
        }
        this.committing = false
        this.iTelCodeValue = ''
        this.name = ''
        this.identityCard = ''
      })
    }
  }
}
</script>

<style scoped>
  /*认证哦:*/
  .bh-root>.el-row {
    margin-bottom: 17px;
  }

  .bh-root .el-select, .bh-root .el-input {
    width: 260px;
    height: 34px;
  }

  .bh-root .el-row .el-col {
    height: 34px;
    line-height: 34px;
  }

  .bh-authentication_low div {
    display: inline-block;
  }

  /*灰色下划线*/
  .bh-authentication_low {
    border-bottom: 2px solid #D8D8D8;
    text-align: left;
  }

  .bh-authentication_low .el-col-24 img {
    margin: 0 10px;
  }

  .bh-authentication_low .el-col-24>img {
    margin: 0 15px;
  }

  /*低级认证:蓝色下划线*/
  .bh-authentication_low .el-col-24 div:first-child {
    border-bottom: 2px solid #0BB2fE;
    height: 34px !important;
    margin-bottom: -2px;
    margin-left: 0;
  }
</style>
