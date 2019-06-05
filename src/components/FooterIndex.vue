<template>
  <div class="bh-root">
    <div class="foot_box">
      <el-row :class="{'bh-width_full': fullWidth, 'bh-width_fixed': !fullWidth}">

        <!--左边-->
        <el-col :span="5" class="bh-left">
          <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/logo_white.png">
          <span class="ft14 color-fff">{{$t('message.SSP')}}</span>
        </el-col>

        <!--中间-->
        <el-col :span="10" :offset="1" class="bh-center">
          <el-row class="one">
            <el-col :span="6">
              <a class="bh-btn_text" target="_blank" @click="show_This">{{$t('message.About')}}</a>
            </el-col>
            <el-col :span="6">
              <a class="bh-btn_text" target="_blank" href="/HelpCenter?type=1">{{$t('message.News')}}</a>
            </el-col>
            <el-col :span="6">
              <a class="bh-btn_text" target="_blank" @click="show_This">{{$t('message.Fee')}}</a>
            </el-col>
            <el-col :span="6">
              <a class="bh-btn_text" target="_blank" href="/HelpCenter?type=2">{{$t('message.Help')}}</a>
            </el-col>
          </el-row>
          <el-row class="two">
            <el-col :span="12">投诉建议：services@8bihui.com</el-col>
            <!--<el-col :span="12">客服热线：400000000</el-col>-->
          </el-row>
          <el-row class="three">
            <el-col :span="6">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i1.svg"
              onmouseover="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i2.svg'"
              onmouseout="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i1.svg'">
            </el-col>
            <el-col :span="6">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i3.svg"
                   onmouseover="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i4.svg'"
                   onmouseout="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i3.svg'">
            </el-col>
            <el-col :span="6">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i5.svg"
                   onmouseover="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i6.svg'"
                   onmouseout="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i5.svg'">
            </el-col>
            <el-col :span="6">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i7.svg"
                   onmouseover="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i8.svg'"
                   onmouseout="this.src='https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/i7.svg'">
            </el-col>
          </el-row>
        </el-col>

        <!--右边-->
        <div class="bh-right">
          <div class="codeBox1">
            <img src="../assets/images/qr_code.png">
            <div class="ft16 color-fff" @click="goTo" style="cursor: pointer;">{{$t('message.ConcernOnWechat')}}</div>
          </div>
          <div class="codeBox2">
            <img src="../assets/images/qr_code1.png">
            <div class="ft16 color-fff">{{$t('message.Download')}}</div>
          </div>
        </div>
        <!--<el-col :span="7" :offset="1" class="bh-right">-->
        <!--<el-row>-->
        <!--<el-col :span="12">-->
        <!--<div class="codeBox">-->
        <!--<img src="../assets/images/qr_code.jpg">-->
        <!--<span class="ft16 color-fff" @click="goTo">{{$t('message.ConcernOnWechat')}}</span>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--<el-col :span="12">-->
        <!--<div class="codeBox">-->
        <!--<img src="../assets/images/qr_code.jpg">-->
        <!--<span class="ft16 color-fff">{{$t('message.Download')}}</span>-->
        <!--</div>-->
        <!--</el-col>-->
        <!--</el-row>-->
        <!--</el-col>-->
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    show_This () {
      this.$message.error('正在开发中')
    },
    goTo () {
      document.location.href = 'http://www.cnzz.com/stat/website.php?web_id=1274113368'
    }
  }
}
</script>

<style scoped>
  .bh-root {background-color: #191542;}
  .foot_box{position: relative;margin: 0 auto;top: 0;left: 0;max-width: 1200px;padding: 0;}
  .el-row {height: 220px;margin: auto;}
  .bh-width_fixed {width: 1198px;}
  .bh-width_full {width: 100%;padding: 0 0;}
  .el-col {height: 100%;}
  span {display: inline-block;}

  /*左*/
  .bh-left img {width: 148px;height: 70px;margin-top: 47px;}
  .bh-left span {display: block;color: #fff;font-size: 16px;margin-top: 35px;}
  .bh-left span:first-child {margin-top: 21px;}

  /*中*/
  .bh-center .one {width: 100%;text-align: left;margin-top: 47px;}
  .bh-center .one a {font-size:16px;text-decoration: none;color: #C0C8EB;}
  .bh-center .el-col{height: auto;text-align: left;color: #646E9D;font-size: 14px;margin-top: 21px;}
  .bh-center .el-row{height: auto;}

  .bh-center .el-row button {
    font-size:20px;
  }

  /*分享*/
  .bh-center .el-row:last-child {
    height: auto;
    /*margin-top: 75px;*/
  }

  .bh-center .el-row span {
    display: inline-block;
    width: 34px;
    height: 34px;
    border-radius: 100%;
    cursor: pointer;
    margin-top: 28px;
  }

  /*右*/
  /*二维码*/
  .bh-right .codeBox1,.bh-right .codeBox2{position: absolute;width: 125px;height: auto;text-align: center;top: 50px;}
  .bh-right .codeBox1{right: 200px;}
  .bh-right .codeBox2{right: 20px;}
  .bh-right img{width: 100px;height: 100px;}
  .bh-right div{font-size: 13px;font-weight: 400;line-height: 18px;color: #fff;text-align: center;margin-top: 8px;}

  /*.bh-right .el-row:first-child {*/
  /*width: 100%;*/
  /*height: 125px;*/
  /*}*/

  /*.bh-right .el-row:first-child .el-col:first-child {*/
  /*text-align: left;*/
  /*}*/

  /*.bh-right .el-row:first-child .el-col:last-child {*/
  /*text-align: right;*/
  /*}*/

  /*二维码下的字*/
  /*.bh-right .el-row:last-child {*/
  /*width: 100%;*/
  /*height: auto;*/
  /*}*/
  /*.bh-right .el-row:last-child .el-col:last-child {*/
  /*padding-left: 50px;*/
  /*}*/
</style>
