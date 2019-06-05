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
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_medium.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">中级认证</span>
        </div>
        <img src="../../../assets/images/arrow_red.png"/>
        <div>
          <img class="bh-align-vertical__middle" src="../../../assets/images/grade_high.png">
          <span class="bh-align-vertical__middle ft16 color-0BB2FE">高级认证</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <span class="bh-icon_serial bh-align-vertical__middle">I</span><span class="bh-align-vertical__middle ft14 color-333">扫描下方二维码，在手机上下载安装"币汇手机APP"，并完成登录。</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <span class="bh-icon_serial bh-align-vertical__middle">2</span><span class="bh-align-vertical__middle ft14 color-333">在"币汇"应用程序中，点击"我的"，然后选择"实名认证"。</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <span class="bh-icon_serial bh-align-vertical__middle">3</span><span class="bh-align-vertical__middle ft14 color-333">通过录制视频和人脸识别完成高级认证。</span><br>
        <img src="../../../assets/images/qr_code.jpg">
      </el-col>
    </el-row>

    <!--确定-->
    <el-row>
      <el-col :span="24">
        <!--<button class="bh-btn_primary_lg" @click="$message.success('功能开发中，敬请期待')">完成认证</button>-->
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  created () {
    switch (parseInt(this.$store.getters.getUser.identityAuthenticator)) {
      case 1:
        this.$router.push({name: 'AuthenticationMedium'})
        break
      case 2:
        this.$router.push({name: 'AuthenticationHigh'})
        break
    }
  }
}
</script>

<style scoped>
  /*认证哦:我你双手感觉你的温柔，真的有点透不过气*/
  .bh-root>.el-row {
    margin-bottom: 17px;
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
  .bh-authentication_low .el-col-24 div:last-child {
    border-bottom: 2px solid #0BB2fE;
    height: 34px !important;
    margin-bottom: -2px;
    margin-left: 0;
  }

    /*序号*/
  .bh-icon_serial {
    display: inline-block;
    width: 14px;
    height: 14px;
    line-height: 14px;
    /*padding-right: 3px;*/
    text-align: center;
    -webkit-border-radius: 100%;
    -moz-border-radius: 100%;
    border-radius: 100%;
    color: #f78754;
    background-color: #ffe0d2;
  }
  .bh-icon_serial::content {
    color: black;
  }

  /*二三列的下边框*/
  .bh-root .el-row:nth-child(2), .bh-root .el-row:nth-child(3) {
    border-bottom: 1px solid #D8D8D8;
    height: 54px;
    line-height: 54px;
    margin-bottom: 0;
  }

  /*第四列*/
  .bh-root .el-row:nth-child(4) {
    height: auto;
    line-height: 54px;
  }

  .bh-root .el-row:nth-child(4) img{
    margin-left: 50px;
  }

  /*完成按钮*/
  .bh-root .el-row:last-child {
    text-align: center;
    margin-bottom: 40px;
  }
</style>
