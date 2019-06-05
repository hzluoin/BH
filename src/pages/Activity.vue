<template>
  <div class="activity">
    <!--kv,转盘-->
    <div class="zpBox">
      <div class="b b_1">
        <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b1.gif">
        <div class="box1 center-float-center">
          <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b1_1.png">
          <span class="font1 center-float-left">剩余
          <span>{{times}}</span>次抽奖次数
          <a href="#bottom" class="ml5">获取抽奖机会?</a>
        </span>
        </div>
        <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/c1.png" class="b c_1" id="cycle">
        <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/c2.png" class="b c_2" @click="rotate">
      </div>
    </div>
    <!--活动流程-->
    <div class="lcBox">
      <img v-if="step === 1" src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b2_1.png" class="b b_2">
      <img v-else-if="step === 2" src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b2_2.png" class="b b_2">
      <img v-else-if="step === 3" src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b2_3.png" class="b b_2">
      <img v-else-if="step === 4" src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b2_4.png" class="b b_2">
    </div>
    <!--排行榜-->
    <div class="phbBox">
      <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b3.png" class="b b_3">
      <ul class="phbTitle center-lr-scatter">
        <li @click="phbBtn(1)"><img :src="phb_one"></li>
        <li @click="phbBtn(2)"><img :src="phb_two"></li>
        <li @click="phbBtn(3)"><img :src="phb_three"></li>
      </ul>
      <!--奖励排行榜-->
      <div class="list list1" v-if="isShowPhbList === 1">
        <p class="header">
          <span>排名</span>
          <span>用户名</span>
          <span>累计奖励</span>
        </p>
        <p :class="{odd: index % 2 === 1, even: index % 2 === 0}" v-for="(data, index) in jlList" :key="index">
          <span v-if="data.isNullData">&nbsp;</span><!--排名-->
          <span v-else>{{index + 1}}</span>
          <span>{{data.userName ? data.userName : '-'}}&nbsp;</span>
          <span>{{data.currencyNum ? data.currencyNum : '-'}}&nbsp;</span>
        </p>
      </div>
      <!--邀请排行榜-->
      <div class="list list2" v-if="isShowPhbList === 2">
        <p class="header">
          <span>排名</span>
          <span>用户名</span>
          <span>邀请人数</span>
        </p>
        <p :class="{odd: index % 2 === 1, even: index % 2 === 0}" v-for="(data, index) in yqList" :key="index">
          <span v-if="data.isNullData">&nbsp;</span>
          <span v-else>{{index + 1}}</span>
          <span>{{data.userName ? data.userName : '-'}}&nbsp;</span>
          <span>{{data.invCount ? data.invCount : 0}}&nbsp;</span>
        </p>
      </div>
      <!--交易排行榜-->
      <div class="list list3" v-if="isShowPhbList === 3">
        <p class="header">
          <span>排名</span>
          <span>用户名</span>
          <span>交易金额</span>
        </p>
        <p :class="{odd: index % 2 === 1, even: index % 2 === 0}" v-for="(data, index) in jyList" :key="index">
          <span v-if="data.isNullData">&nbsp;</span>
          <span v-else>{{index + 1}}</span>
          <span>{{data.userName ? data.userName : '-'}}&nbsp;</span>
          <span>{{data.tranNum ? NumberFormat.toFixed(data.tranNum, 8) : 0}}&nbsp;</span>
        </p>
      </div>
    </div>
    <!--活动规则-->
    <div class="ruleBox pb100">
      <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/b4.png" class="b b_4">
      <!--<div class="title">活动规则</div>-->
      <ul>
        <li>1.活动时间：2019年3月8日 12:00起;</li>
        <li>2.抽奖活动限交易2天或邀请2名注册并中级实名的用户参与;</li>
        <li>3.活动描述：交易JON/邀请2名用户中级实名认证/两种形式均可获得抽奖机会;</li>
        <li>4.奖励说明：iPhone XS/1000元京东购物卡/JON币三种奖励;</li>
        <li>5.奖励发放：iPhone XS及1000元京东购物卡需联系客服发放。其它奖励均以JON币种进行发放，JON币种奖励在每天24:00之前进行发放;
          iPhone XS及京东1000元购物卡将在活动结束后的5日内发放;</li>
        <li>6.如果对奖励发放存在疑问，请在奖励发放后5日内联系平台进行处理，过时将不予处理，敬请谅解;</li>
        <li>7.为保证活动公平，一旦发现作弊行为，将取消奖励资格。www.8bihui.com保留对活动的最终解释权;</li>
        <li class="lastLi">风险提示：数字货币是一种高风险的投资方式，请投资者理性判断自己的投资能力，审慎做出投资决策;</li>
      </ul>
      <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/moreBtn.png" class="moreBtn" @click="moreBtn()">
    </div>
    <!--锚点-->
    <p id="bottom" class="b">&nbsp;</p>
    <!--弹窗1-->
    <div class="dialog" v-if="showDialog">
      <div>
        <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/8.png"/>
        <span>获得{{amount}}</span>
        <span>奖励在资产管理查看,以等价值的{{coin}}发放</span>
        <button @click="$router.push({name: 'MyAssets'})">立即查看</button>
      </div>
    </div>
    <!--弹窗2-->
    <div class="pup" v-if="showActivityDialog">
      <div class="black"></div>
      <activity-dialog :visible.sync="showActivityDialog"></activity-dialog>
    </div>
  </div>
</template>

<script>
import ActivityDialog from './dialog/ActivityDialog'
export default {
  components: {ActivityDialog},
  data () {
    return {
      disabled: false,
      showDialog: false,
      times: 0,
      coin: '',
      level: 0, // 旋转样式
      amount: '0', // 奖项
      tableData: [],
      // 场外交易次数
      record: 0,
      // 排行榜按钮背景图
      phbBg: [
        {
          'on': 'https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/top1_on.png', 'no': 'https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/top1.png'
        },
        {
          'on': 'https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/top2_on.png', 'no': 'https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/top2.png'
        },
        {
          'on': 'https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/top3_on.png', 'no': 'https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/top3.png'
        }
      ],
      phb_one: '',
      phb_two: '',
      phb_three: '',
      showActivityDialog: false,
      isShowPhbList: 1,
      // 活动id
      activityId: '1028',
      jlList: [], // 奖励排行榜
      yqList: [], // 邀请排行榜
      jyList: [], // 交易排行榜
      // 假数据
      jlThreeList: [
        {
          'personOne': { currencyNum: '500', userName: '刘**' },
          'personTwo': { currencyNum: '300', userName: '只要998' },
          'personThree': { currencyNum: '200', userName: '周**' }
        },
        {
          'personOne': { currencyNum: '600', userName: '刘**' },
          'personTwo': { currencyNum: '400', userName: '只要998' },
          'personThree': { currencyNum: '300', userName: '周**' }
        },
        {
          'personOne': { currencyNum: '800', userName: '刘**' },
          'personTwo': { currencyNum: '400', userName: '只要998' },
          'personThree': { currencyNum: '400', userName: '周**' }
        },
        {
          'personOne': { currencyNum: '1000', userName: '刘**' },
          'personTwo': { currencyNum: '700', userName: '只要998' },
          'personThree': { currencyNum: '4500', userName: '周**' }
        }
      ],
      yqThreeList: [
        {
          'personOne': { invCount: '8', userName: '刘**' },
          'personTwo': { invCount: '17', userName: '只要998' },
          'personThree': { invCount: '5', userName: '周**' }
        },
        {
          'personOne': { invCount: '19', userName: '刘**' },
          'personTwo': { invCount: '32', userName: '只要998' },
          'personThree': { invCount: '16', userName: '周**' }
        },
        {
          'personOne': { invCount: '30', userName: '刘**' },
          'personTwo': { invCount: '50', userName: '只要998' },
          'personThree': { invCount: '25', userName: '周**' }
        },
        {
          'personOne': { invCount: '45', userName: '刘**' },
          'personTwo': { invCount: '55', userName: '只要998' },
          'personThree': { invCount: '36', userName: '周**' }
        }
      ],
      jyThreeList: [
        {
          'personOne': { tranNum: '85.9541367', userName: '刘**' },
          'personTwo': { tranNum: '15.0589761', userName: '只要998' },
          'personThree': { tranNum: '30.6487153', userName: '周**' }
        },
        {
          'personOne': { tranNum: '263.6416452', userName: '刘**' },
          'personTwo': { tranNum: '75.4156478', userName: '只要998' },
          'personThree': { tranNum: '130.1546587', userName: '周**' }
        },
        {
          'personOne': { tranNum: '312.5461236', userName: '刘**' },
          'personTwo': { tranNum: '453.1564819', userName: '只要998' },
          'personThree': { tranNum: '364.3158792', userName: '周**' }
        },
        {
          'personOne': { tranNum: '540.1564819', userName: '刘**' },
          'personTwo': { tranNum: '563.6489123', userName: '只要998' },
          'personThree': { tranNum: '522.4612387', userName: '周**' }
        }
      ]
    }
  },
  computed: {
    // 用户参与抽奖资格
    step () {
      let step = 1
      if (this.$store.getters.getUser.identityAuthenticator > 2) {
        step = 2
      }
      if (step === 2 && this.record > 0) {
        step = 3
      }
      if (step === 3 && this.times) {
        step = 4
      }
      return step
    }
  },
  created () {
    this.phb_one = this.phbBg[0]['on']
    this.phb_two = this.phbBg[1]['no']
    this.phb_three = this.phbBg[2]['no']
    this.findLotteryRecordUI()
    if (!this.$store.getters.getUser.loginStatus) {
      return
    }
    // 获取用户信息
    this.$store.dispatch('qryUserInfo').then(response => {}, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })
    for (let i = 0; i < 10; i++) {
      this.tableData.push({username: '', prize: ''})
    }
    this.$http.get('/prize/lotteryTimesUI', {
    }).then(response => {
      this.times = Number(response.body.times) || 0
    }, response => {
      this.times = Number(response.body.times) || 0
    })
    // 查询场外交易次数
    this.$store.dispatch('encryptConnection', {
      url: '/assetRecord/queryAssetRecordListUI',
      data: {}
    }).then(response => {
      this.record = response.body.totalCount || 0
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })
  },
  methods: {
    rotate () {
      if (!this.$store.getters.getUser.loginStatus) {
        this.$router.push({name: 'Register'})
        return
      }
      if (this.step < 2) {
        this.$message.error('请先完成中级实名认证')
        return
      }
      if (this.step < 3) {
        this.$message.error('请先完成一笔场外交易')
        return
      }
      if (!this.times) {
        this.$message.error('抽奖机会不足')
        return
      }
      if (this.disabled) {
        return
      }
      this.disabled = true
      this.$http.get('/prize/lotteryUI', {
      }).then(response => {
        --this.times
        let cycle = document.getElementById('cycle')
        let classNames = cycle.getAttribute('class')
        cycle.setAttribute('class', classNames + ' rotate')
        this.coin = response.body.data.currencyCode
        switch (response.body.data.lotteryLevel) {
          case 0: // 一等奖
            this.level = 7
            this.amount = 'Iphone XS'
            break
          case 1: // 二等奖
            this.level = 5
            this.amount = '价值1000元京东购物卡'
            break
          case 2: // 三等奖
            this.level = 3
            this.amount = '2000个JON'
            break
          case 3: // 四等奖
            this.level = 1
            this.amount = '1000个JON'
            break
          case 4: // 五等奖
            this.level = 6
            this.amount = '500个JON'
            break
          case 5: // 六等奖
            this.level = 4
            this.amount = '300个JON'
            break
          case 6: // 参与有奖
            this.level = 2
            this.amount = '100个JON'
            break
        }
        setTimeout(() => {
          cycle.setAttribute('class', classNames + ' rotate' + this.level)
          setTimeout(() => {
            this.showDialog = true
            this.disabled = false
            // cycle.setAttribute('class', classNames)
          }, 2000)
        }, 2000)
      }, response => {
        this.disabled = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 切换排行榜
    phbBtn (_index) {
      this.isShowPhbList = _index
      this.recoverCss()
      if (_index === 1) {
        this.phb_one = this.phbBg[0]['on']
        this.findLotteryRecordUI()
      } else if (_index === 2) {
        this.phb_two = this.phbBg[1]['on']
        this.findInviteRecordUI()
      } else {
        this.phb_three = this.phbBg[2]['on']
        this.findTranNumRecordUI()
      }
    },
    recoverCss () {
      this.phb_one = this.phbBg[0]['no']
      this.phb_two = this.phbBg[1]['no']
      this.phb_three = this.phbBg[2]['no']
    },
    // 奖励排行榜
    findLotteryRecordUI () {
      this.$store.dispatch('encryptConnection', {
        url: '/prize/findLotteryRecordUI',
        data: {
          activityId: this.activityId
        }
      }).then(response => {
        this.jlList = response.body.data.slice(0, 7)
        this.sortArr(this.jlList, this.jlThreeList, 'currencyNum')
      }, response => {
        this.message.error(response.body.msg)
      })
    },
    // 邀请排行榜
    findInviteRecordUI () {
      this.$store.dispatch('encryptConnection', {
        url: '/prize/findInviteRecordUI',
        data: {
          activityId: this.activityId
        }
      }).then(response => {
        this.yqList = response.body.data.slice(0, 7)
        this.sortArr(this.yqList, this.yqThreeList, 'invCount')
      }, response => {
        this.message.error(response.body.msg)
      })
    },
    // 交易排行榜
    findTranNumRecordUI () {
      this.$store.dispatch('encryptConnection', {
        url: '/prize/findTranNumRecordUI',
        data: {
          activityId: this.activityId
        }
      }).then(response => {
        this.jyList = response.body.data.slice(0, 7)
        this.sortArr(this.jyList, this.jyThreeList, 'tranNum')
      }, response => {
        this.message.error(response.body.msg)
      })
    },
    // 假数据插入，新数组排序
    sortArr (list, threeList, sortName) {
      let date = parseInt(new Date().format('dd'))
      if (date === 27) {
        list.unshift(threeList[0].personOne, threeList[0].personTwo, threeList[0].personThree)
      } else if (date === 28) {
        list.unshift(threeList[1].personOne, threeList[1].personTwo, threeList[1].personThree)
      } else if (date === 1) {
        list.unshift(threeList[2].personOne, threeList[2].personTwo, threeList[2].personThree)
      } else if (date === 2) {
        list.unshift(threeList[3].personOne, threeList[3].personTwo, threeList[3].personThree)
      } else {
        list.unshift(threeList[3].personOne, threeList[3].personTwo, threeList[3].personThree)
      }

      let temp
      for (let i = 0; i < list.length - 1; i++) {
        for (let j = 0; j < list.length - i - 1; j++) {
          if (sortName === 'currencyNum') {
            if (parseInt(list[j].currencyNum) < parseInt(list[j + 1].currencyNum)) {
              temp = list[j]
              list[j] = list[j + 1]
              list[j + 1] = temp
            }
          } else if (sortName === 'invCount') {
            if (parseInt(list[j].invCount) < parseInt(list[j + 1].invCount)) {
              temp = list[j]
              list[j] = list[j + 1]
              list[j + 1] = temp
            }
          } else {
            if (parseInt(list[j].tranNum) < parseInt(list[j + 1].tranNum)) {
              temp = list[j]
              list[j] = list[j + 1]
              list[j + 1] = temp
            }
          }
        }
      }
    },
    // 活动详情
    moreBtn () {
      this.showActivityDialog = true
    }
  }
}
</script>
<style scoped>
  .activity {
    position: relative;
    color: #FFF;
    background-color: #551794;
    min-width: 1366px;
  }
  ul, p {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
  }
  .b {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

  .list {left: 0;right: 0;margin: auto;position: absolute;width: 71%;top: 31%;height: 60%;max-width: 1000px;}
  .list>p {
    font-size: 0;
  }
  .list>p span {
    background-color: #7107AA;
    display: inline-block;
    width: 33%;
    height: 46px;
    line-height: 46px;
    text-align: center;
    font-size: 14px;
  }
  .list .header span {
    height: 60px;
    line-height: 60px;
  }
  .list .odd span {
    background-color: #891CC3;
  }
  .list .even span {
    background-color: #8109BE;
  }

  #bottom {
    bottom: 0;
  }

  .rotate {
    -webkit-animation: rotate 2s linear;
    -o-animation: rotate 2s linear;
    animation: rotate 2s linear;
  }

  .rotate1 {
    -webkit-animation: rotate1 142ms linear forwards;
    -o-animation: rotate1 142ms linear forwards;
    animation: rotate1 142ms linear forwards;
  }

  .rotate2 {
    -webkit-animation: rotate2 286ms linear forwards;
    -o-animation: rotate2 286ms linear forwards;
    animation: rotate2 286ms linear forwards;
  }

  .rotate3 {
    -webkit-animation: rotate3 428ms linear forwards;
    -o-animation: rotate3 428ms linear forwards;
    animation: rotate3 428ms linear forwards;
  }

  .rotate4 {
    -webkit-animation: rotate4 571ms linear forwards;
    -o-animation: rotate4 571ms linear forwards;
    animation: rotate4 571ms linear forwards;
  }

  .rotate5 {
    -webkit-animation: rotate5 714ms linear forwards;
    -o-animation: rotate5 714ms linear forwards;
    animation: rotate5 714ms linear forwards;
  }

  .rotate6 {
    -webkit-animation: rotate6 857ms linear forwards;
    -o-animation: rotate6 857ms linear forwards;
    animation: rotate6 857ms linear forwards;
  }

  .rotate7 {
    -webkit-animation: rotate7 1s linear forwards;
    -o-animation: rotate7 1s linear forwards;
    animation: rotate7 1s linear forwards;
  }

  @keyframes rotate {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(720deg);
      -moz-transform: rotate(720deg);
      -ms-transform: rotate(720deg);
      -o-transform: rotate(720deg);
      transform: rotate(720deg);
    }
  }

  @keyframes rotate1 {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(51.12deg);
      -moz-transform: rotate(51.12deg);
      -ms-transform: rotate(51.12deg);
      -o-transform: rotate(51.12deg);
      transform: rotate(51.12deg);
    }
  }

  @keyframes rotate2 {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(102.85deg);
      -moz-transform: rotate(102.85deg);
      -ms-transform: rotate(102.85deg);
      -o-transform: rotate(102.85deg);
      transform: rotate(102.85deg);
    }
  }

  @keyframes rotate3 {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(154.28deg);
      -moz-transform: rotate(154.28deg);
      -ms-transform: rotate(154.28deg);
      -o-transform: rotate(154.28deg);
      transform: rotate(154.28deg);
    }
  }

  @keyframes rotate4 {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(205.71deg);
      -moz-transform: rotate(205.71deg);
      -ms-transform: rotate(205.71deg);
      -o-transform: rotate(205.71deg);
      transform: rotate(205.14deg);
    }
  }

  @keyframes rotate5 {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(257.14deg);
      -moz-transform: rotate(257.14deg);
      -ms-transform: rotate(257.14deg);
      -o-transform: rotate(257.14deg);
      transform: rotate(257.14deg);
    }
  }

  @keyframes rotate6 {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(308.57deg);
      -moz-transform: rotate(308.57deg);
      -ms-transform: rotate(308.57deg);
      -o-transform: rotate(308.57deg);
      transform: rotate(308.57deg);
    }
  }

  @keyframes rotate7 {
    from {
      -webkit-transform: rotate(0deg);
      -moz-transform: rotate(0deg);
      -ms-transform: rotate(0deg);
      -o-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      -moz-transform: rotate(360deg);
      -ms-transform: rotate(360deg);
      -o-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99;
    background-color: rgba(0, 0, 0, .8);
  }

  .dialog div {
    position: fixed;
    width: 584px;
    height: 401px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }

  .dialog span {
    display: block;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
  }

  .dialog span:nth-child(2) {
    bottom: 120px;
    color: #FB2058;
    font-size: 26px;
  }

  .dialog span:nth-child(3) {
    bottom: 100px;
    color: #3A0C62;
  }

  .dialog button {
    display: block;
    width: 200px;
    height: 44px;
    border-radius: 999px;
    background-color: #FBCC2F;
    border: none;
    font-size: 22px;
    color: #BB590A;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
    margin: auto;
  }
.zpBox,.lcBox,.phbBox,.ruleBox{position: relative;top:0;left:0;width: 100%;}
.zpBox img,.lcBox img,.phbBox img,.ruleBox img{position: relative;top:0;left:0;width: 100%;display: block;}

  /*转盘*/
  .zpBox{background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/bg1.jpg") no-repeat;background-size: 100%;}
  .zpBox .b_1 {position: relative;padding-top: 30%;width: 44%;}
  .box1 {top: 38%;font-size: 16px;font-weight: 400;position: absolute;width: 62%;left: 19%;height: 3.4%;}
  .b_1 .box1 img{position: absolute;width: 7%;top: 20%;left: 9%;}
  .b_1 .font1{top: 0;left: 18%;position: absolute;height: 100%;}
  .box1 a {color: #FBF900;text-decoration: none;position: relative;top: 0;}
  .box1>span>span {font-size: 180%;font-weight: bold;color: red;margin: 0 5px;position: relative;top: 0;}
  .zpBox .c_1 {position: absolute;width: 79%;top: 47.4%;}
  .zpBox .c_2 {position: absolute;width: 27%;top: 59%;cursor: pointer;}

  /*活动流程*/
  .lcBox{background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/bg2.jpg") no-repeat;background-size: cover;}
  .lcBox .b_2{width: auto;position: relative;}

  /*排行榜*/
  .phbBox{background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/bg3.jpg") no-repeat;background-size: cover;}
  .phbBox .b_3{width: auto;position: relative;}
  .phbBox .phbTitle{position: absolute;width: 50%;top: 24.2%;max-width: 800px;left: 0;right: 0;margin: 0 auto;}
  .phbBox .phbTitle li{position: relative;width: 24%;float: left;cursor: pointer;}

  /*活动规则*/
  .ruleBox{clear: both;background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/activity/bg4.jpg") no-repeat;background-size: cover;}
  .ruleBox .b_4 {width: auto;position: relative;}
  /*.ruleBox .title{position: relative;width: 100%;text-align: center;font-size: 32px;color: #fff;line-height:37px;font-weight: bold;}*/
  .ruleBox ul{position: absolute;width: 72%;height: auto;left: 0;right: 0;margin: auto;top: 16%;max-width: 1000px;}
  .ruleBox ul li{position: relative;width: 100%;float: left;font-size: 20px;font-weight: 400;color: #fff;line-height: 36px;margin-top: 5px;}
  .ruleBox ul .lastLi{color: #FCE700;margin-top: 30px;}
  .ruleBox .moreBtn{position: absolute;width: 12%;left: 0;right: 0;top: 66%;cursor: pointer;margin: 0 auto;max-width: 200px;}

  .pup{position: fixed;top: 0;left:0;width: 100%;height: 100%;z-index: 1111;}
  .pup .black{position: fixed;top: 0;left:0;width: 100%;height: 100%;z-index: 1111;background-color: #000;opacity:0.8;filter: alpha(opacity = 80);}
</style>
