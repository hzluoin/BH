<template>
  <div class="pupcon" :visible="visible">
    <div class="title ft28 bold pt50">庆祝JON升级成功，存JON得最高72%年化收益</div>
    <div class="fontBox color-333 ft16">
      <div>为庆祝JON落地应用升级成功，自3月7号起，凡是在币汇交易所充值JON，参与持币生息的用户最高可得72%年化收益，单用户最高可充5万枚JON获得收益。具体如下：</div>
      <div>1. 在币汇交易所持币就可获得利息，利息按月结算，充值参与存币生息的JON不锁仓，随时可以提币或交易，但是出现提币和交易，那么当月的利息失效。</div>
      <div>2. 用户在存币期间交易会失去利息，但是每交易2天或每邀请2位好友注册并中级实名认证，即可获得幸运大转盘的抽奖机会，百分百中奖，奖励最高可抽iPhone XS。</div>
      <div>3. 每邀请2位朋友存币，自己持币生息利率将获得提升，具体数据如下！</div>
      <table class="table" border="1" cellspacing="0" >
        <tr>
          <th>初始年化收益</th>
          <th>邀请人数</th>
          <th>可得年化收益</th>
        </tr>
        <tr v-for="(item, index) in tableData1" :key="index">
          <td>{{item.percent1}}</td>
          <td>{{item.peopleCount}}</td>
          <td>{{item.percent2}}</td>
        </tr>
      </table>
      <div>收益发放时间为用户存币的当天至下月的当天。例如：张三在3月8号存入5000枚JON，收益发送时间为4月8号。</div>
      <div class="bold">注意事项：</div>
      <div>1.如果对收益发放存在疑问，请在收益发放后5日内提交工单，过时将不予处理，敬请谅解；</div>
      <div>2.为保证活动公平，一旦发现作弊行为，将取消奖励资格。www.8bihui.com保留对活动的最终解释权；</div>
      <div>3.ETC社区交易所币汇官方交流QQ群860165622</div>
      <div class="bold">风险提示：</div>
      <div>数字货币是一种高风险的投资方式，请投资者理性判断自己的投资能力，审慎做出投资决策。</div>
    </div>
    <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/closeBtn.png" class="closeBtn" @click="closeBtn()">
  </div>
</template>

<script>
export default {
  name: 'ActivityDialog',
  data () {
    return {
      tableData1: [
        {
          percent1: '36%', peopleCount: '2', percent2: '48%'
        },
        {
          percent1: '36%', peopleCount: '4', percent2: '62%'
        },
        {
          percent1: '36%', peopleCount: '6', percent2: '72%'
        }
      ]
    }
  },
  methods: {
    closeBtn () {
      this.$emit('update:visible', false)
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
  .pupcon{position: relative;width: 70%;height: 70%;margin: 0 auto;top: 12%;max-width: 1000px;background-color: #fff;border-radius: 20px;z-index: 1111;}
  .pupcon .title{color: #4E1496;text-align: center;position: relative;width: 100%;}
  .pupcon .fontBox{position: relative;width: 70%;left: 15%;top: 5%;height: 60%;overflow-y: scroll;line-height: 32px;}
  .pupcon .fontBox div{margin-top: 2%;}
  .pupcon .table{position: relative;width: 100%;top: 0;left: 0;text-align: center;margin-top: 2%;}
  .pupcon .red{color: #FF0000;}
  .pupcon .blue{color: #008AFF;cursor: pointer;}
  .pupcon .closeBtn{position: absolute;width: 16%;left: 42%;top: 90%;cursor: pointer;}
</style>
