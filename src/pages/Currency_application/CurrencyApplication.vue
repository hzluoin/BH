<template>
  <div class="bh-root">
    <header class="bh-background_main">
      <!--导航-->
      <navigation></navigation>
    </header>

    <main style="background: #f2f3f8;height: 1200px;">
      <!--显示-->
      <div style="opacity:0.92;background:#2c3253;width:100%;height:300px;text-align: center;line-height: 300px;" id="particles-js">
        <span style="font-size:38px;color:#ffffff;z-index: 1;position: relative;">上币申请</span>
      </div>
      <!--申请记录标题-->
      <div style="background:#ffffff;width:1200px;height:150px;margin: -100px auto 20px auto;position: relative;">
        <div style="background:#f9f7fe;width:1200px;height:60px;line-height: 60px;">
          <span style="font-size:18px;color:#333333;margin-left: 20px;">我的申请记录</span>
        </div>
        <div style="background:#ffffff;width:1200px;height:90px;line-height: 90px;">
          <el-row>
            <span style="font-size:14px;color:#333333;margin-left: 20px;">GRAM</span>
            <span style="font-size:14px;color:#333333;margin-left: 100px;">GRAM-Token</span>
            <span style="font-size:14px;color:#333333;margin-left: 160px;">项目资料已保存，请缴纳“项目审核费”。</span>
            <span style="margin-left: 100px;">
              <el-button style="width:120px;height:30px;padding: 0;" type="primary" @click="$router.push({name: 'ReviewPayment'})">缴纳项目审核费</el-button>
              <el-button style="width:120px;height:30px;padding: 0;" type="primary">设置投票奖励</el-button>
              <el-button style="width:120px;height:29px;padding: 0;" type="primary" plain>项目详情</el-button>
            </span>
          </el-row>
        </div>
      </div>
      <!--上币说明-->
      <div style="background:#ffffff;width:1200px;height:699px;margin: auto;">
        <div style="background:#f9f7fe;width:1200px;height:60px;line-height: 60px;">
          <span style="font-size:18px;color:#333333;margin-left: 20px;">上币说明</span>
        </div>
        <div>
          <!--第一点-->
          <el-row style="margin: 20px 0 10px 20px;">
            <span style="font-size:14px;color:#666666;">一、上线币种:为了保证用户交易体验、保护投资者利益，我们会严格评估项目的投资潜力和风险，考察内容如下:</span>
          </el-row>
          <el-row style="margin-left: 50px;">
            <ul class="bh_li_all">
              <li><span class="bh-serial-number">1</span> 团队实力</li>
              <li><span class="bh-serial-number">2</span> 社区维护</li>
              <li><span class="bh-serial-number">3</span> 技术实力</li>
              <li><span class="bh-serial-number">4</span> 项目发展</li>
              <li><span style="color:#ff7c44;">项目审核需要交纳一定的费用(使用btc支付)</span></li>
            </ul>
          </el-row>
          <!--第二点-->
          <el-row style="margin: 25px 0 0px 20px;">
            <span style="font-size:14px;color:#666666;">二、8币汇作为专业的数字资产交易平台，为了保护投资者利益，将会选择优质币种上线交易的权利，同时也对不良</span>
            <div style="font-size:14px;color:#666666;margin:6px 0 10px 28px;">币种无偿下线项目的权利，以下情形，可能会造成币种的下线:</div>
          </el-row>
          <el-row style="margin-left: 50px;">
            <ul class="bh_li_all">
              <li><span class="bh-serial-number">1</span> 交易量持续低迷</li>
              <li><span class="bh-serial-number">2</span> 项目停滞不前，团队投入度不够</li>
              <li><span class="bh-serial-number">3</span> 申请或沟通的信息造假</li>
              <li><span class="bh-serial-number">4</span> 重大负面新闻</li>
              <li><span class="bh-serial-number">5</span> 项目方主动要求下线</li>
              <li><span class="bh-serial-number">6</span> 其他不支持继续交易的事项</li>
              <li><span style="color:#ff7c44;">对于确定下线的项目，我们会提前5天发出公告通知，用户将有30天时间从交易所提现该资产。</span></li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 20px 0 20px 20px;"></div>
        <el-row style="margin-left: 20px;">
          <el-checkbox v-model="checked">我已阅读相关协议并同意</el-checkbox>
        </el-row>
        <button style="border:1px solid #0bb2fe;border-radius:4px;width:248px;height:44px;margin: 30px 0 0 470px;background: #FFFFFF;" @click="$router.push({name: 'ApplicationInformation'})">
          <span style="font-size:16px;color:#0bb2fe;">发起申请</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import Navigation from '../../components/Navigation'
export default {
  name: 'CurrencyApplication',
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
