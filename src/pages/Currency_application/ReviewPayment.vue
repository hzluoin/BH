<template>
  <div class="bh-root">
    <header class="bh-background_main">
      <!--导航-->
      <navigation></navigation>
    </header>

    <main style="background: #f2f3f8;height: 1080px;">
      <!--显示-->
      <div style="opacity:0.92;background:#2c3253;width:100%;height:300px;text-align: center;line-height: 300px;" id="particles-js">
        <span style="font-size:38px;color:#ffffff;z-index: 1;position: relative;">上币审核缴费</span>
      </div>
      <!--缴纳说明-->
      <div style="background:#ffffff;width:1200px;height:150px;margin: -100px auto 20px auto;position: relative;">
        <div style="background:#f9f7fe;width:1200px;height:60px;line-height: 60px;">
          <span style="font-size:18px;color:#333333;margin-left: 20px;">审核费缴纳说明</span>
        </div>
          <el-row style="margin: 20px 0 10px 0;">
            <span class="bh-serial-number" style="margin-left: 20px;">1</span>
            <span style="font-size:14px;color:#333333;"> 付费提交上币申请，是为了提高项目资料填写的质量，降低币种基础信息沟通成本，便于审核团队集中精力挑选优质项目上线。</span>
          </el-row>
        <el-row>
          <span class="bh-serial-number" style="margin-left: 20px;">2</span>
          <span style="font-size:14px;color:#333333;"> 提交审核资料，需支付<span style="font-weight: bold;">0.2BTC</span>作为上币审核费用。若项目未通过审核，将在通知邮件发出后的两个工作日，原路退还<span style="font-weight: bold;">50%</span>的审核费用。</span>
        </el-row>
      </div>
      <!--账户信息-->
      <div style="background:#ffffff;width:1200px;height:360px;margin: auto;">
        <div style="background:#f9f7fe;width:1200px;height:60px;line-height: 60px;">
          <span style="font-size:18px;color:#333333;margin-left: 20px;">账户信息</span>
        </div>
        <div>
          <!--账户-->
          <el-row style="margin: 20px 0 10px 20px;">
            <span style="font-size:14px;color:#666666;">当前账户</span>
            <span style="font-size:14px;color:#333333;margin-left: 100px;">15**1@qq.com</span>
          </el-row>
          <!--余额-->
          <el-row style="margin: 25px 0 0px 20px;">
            <span style="font-size:14px;color:#666666;">BTC可用余额</span>
            <span style="font-size:14px;color:#333333;margin-left: 75px;">0 Btc</span>
            <el-button style="background:#0bb2fe;border-radius:2px;width:70px;height:28px;padding: 0;margin-left: 50px;">
              <span style="font-size:12px;color:#ffffff;">充币</span>
            </el-button>
          </el-row>
          <!--交纳-->
          <el-row style="margin: 25px 0 0px 20px;">
            <span style="font-size:14px;color:#666666;">本次审核需要交纳</span>
            <span style="font-size:14px;color:#333333;margin-left: 45px;">0.2btc</span>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 20px 0 20px 20px;"></div>
        <el-row style="margin-left: 20px;">
          <el-checkbox v-model="checked">我已阅读相关协议并同意</el-checkbox>
        </el-row>
        <button style="border:1px solid #0bb2fe;border-radius:4px;width:248px;height:44px;margin: 30px 0 0 470px;background: #FFFFFF;">
          <span style="font-size:16px;color:#0bb2fe;">立即缴费</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import Navigation from '../../components/Navigation'
export default {
  name: 'ReviewPayment',
  components: {
    Navigation
  },
  data () {
    return {
      checked: true
    }
  },
  mounted () {
    /* ---- particles.js config ---- */
    window.particlesJS('particles-js', require('../../assets/data/particles'))
  }
}
</script>

<style scoped>
  .bh_li_all li{
    font-size:14px;
    color:#666666;
    margin: 0 0 10px 0;
  }

  #particles-js {
    position: relative;
  }
</style>
