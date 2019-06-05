<template>
  <div class="bh-innovateBox">
    <header>
      <navigation class="bh-nav bh-background_main"></navigation>
    </header>
    <div class="innovateBox">
      <!--kv-->
      <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/innovation/kv.png" class="kv">
      <!--content-->
      <div class="content">
        <p class="title">本期兑换项目</p>
        <div class="listBox mb80 left-float-top">
          <!--左边第一部分-->
          <div class="partOne pt40 pb40 ml60 left-tb-scatter">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/innovation/logo.png" class="logoImg">
            <div class="font1 ft22 bold">{{dataList.activityName}}</div>
            <div class="font2 ft14 color-333">兑换比例 {{dataList.reservedFieldOne}}{{dataList.reservedFieldFive}} ：{{dataList.reservedFieldTwo}}{{dataList.reservedFieldSix}}</div>
          </div>
          <!--左边第二部分-->
          <div class="partTwo">
            <!--上半部分-->
            <div class="textBox left-float-top ">
              <div class="font3 font4 ft12 color-333 mt40">
                项目介绍：塞班链是一个全球构的分布式数字支付金融平台，定位成为数字资产领域 Visa。业务包含全球支付清算网络、数字资产管理、数字货币授信管理、数字银行、增值服务等；
                运营的 X-Net（子支付清算网络）可帮助如博彩相关行业解决跨境支付、客户授信等问题，直接用于筹码通兑，项目已得到博华太平洋（HK 0176）的基石投资及大力支持，前期将在塞班岛、济州岛、塞舌尔、柬埔寨、缅甸、帕劳、澳门等区域实际落地应用。
                <div class="mt20">官网网址：<a class="color-333" target="_blank" href="http://www.saipanchain.io/">http://www.saipanchain.io/</a></div>
              </div>
              <div class="mt40">
                <div class="font3 ft12 color-333">
                  开始时间：{{new Date(dataList.startDate).format('yyyy-MM-dd hh:mm:ss')}} <br/>
                  结束时间：{{new Date(dataList.endDate).format('yyyy-MM-dd hh:mm:ss')}}
                </div>
                <button class="btn bh-btn_plain mt20" @click="loginBtn(coinName)">充值{{dataList.reservedFieldFive}}</button>
                <button class="btn mt20" @click="loginBtn('exChange')" :class="{'bh-btn_primary': isHot === 1, 'grayBtn': isHot !== 1}" :disabled="disabled1">立即兑换</button>
              </div>
              <!--0下架 1上架 其余：未开始-->
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/innovation/over.png" class="hotImg" v-if="isHot === 0">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/innovation/hot.png" class="hotImg" v-else-if="isHot === 1">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/innovation/noStart.png" class="hotImg" v-else>
            </div>
            <!--下半部分-->
            <div class="countBox">
              <ul class="center-float-center">
                <li>本期兑换总值：<span class="font1">{{dataList.reservedFieldThree}}</span> {{dataList.reservedFieldSix}}</li>
                <!--线形进度条-->
                <li class="center-float-left">兑换进度
                  <span class="por ml20">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage1" color="#0BB2FE"></el-progress>
                    <span class="percent">{{percentage1}}%</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--弹出遮罩-->
      <b-h-dialog :visible.sync="isShow" :close-button="true" :width="401" :height="237" class="mtAuto">
        <!--BHDialog页面模板-->
        <div slot="body">
          <!--标题-->
          <el-row>
            <el-col class="bh-align_center color-333 ft18 bold">兑换</el-col>
          </el-row>
          <div class="center-lr-scatter mt30 color-333 ft14">
            <span>数量</span>
            <div class="dhInput center-float-right por">
              <input type="text" v-model="pinjie" class="color-999 ft14" maxlength="20" v-if="isFocusShow" @focus="isFocus">
              <input type="number" v-model="balance" class="color-999 ft14" maxlength="20" v-else>
            </div>
            <span>{{coinName}}</span>
          </div>
          <div class="center-float-right mt5 color-666 ft14 mr20">{{NumberFormat.toFixed(new BigNumber(dhCount), 8).toNumber()}} {{dataList.reservedFieldSix}}</div>
          <!--取消、确认按钮-->
          <button class="btn1 closeBtn bh-btn_plain" @click="closeBtn">取消</button>
          <button class="btn1 confirmBtn bh-btn_primary" @click="confirmBtn" :disabled="!disabled || commit">
            <i v-if="commit" class="el-icon-loading"></i>
            <span v-else>确认</span>
          </button>
        </div>
      </b-h-dialog>
    </div>
    <footer>
      <bh-footer></bh-footer>
    </footer>
  </div>
</template>

<script>
import Navigation from '../components/Navigation'
import BhFooter from '../components/FooterIndex'
import BHDialog from '../components/BHDialog'
import BigNumber from 'bignumber.js'
export default {
  name: 'InnovateProject',
  components: {
    BHDialog,
    Navigation,
    BhFooter
  },
  data () {
    return {
      isHot: 0,
      isShow: false,
      // 查询兑换项目
      dataList: [],
      // 币种
      coinName: '',
      // 进度条百分比
      percentage1: 0,
      // 剩余兑换总数量
      overplusCount: 0,
      // 可兑换数量
      balance: 0,
      dhCount: 0,
      // 确认兑换开关
      isOpen: true,
      // 正在提交
      commit: false,
      isFocusShow: true,
      pinjie: ''
    }
  },
  created () {
    this.queryActivityDetail()
  },
  computed: {
    // 确认按钮是否可点击
    disabled () {
      if (Number(this.balance) <= 0) {
        return false
      }
      return true
    },
    disabled1 () {
      // 0下架 1上架 其余：未开始
      if (this.isHot === 1) {
        return false
      }
      return true
    }
  },
  watch: {
    // 监听属性
    balance: function () {
      if (this.balance === '') {
        this.dhCount = 0
      } else if (this.balance < 0) {
        this.balance = ''
        this.dhCount = 0
      } else {
        // 兑换数量长度限制一下
        if (this.balance.length > 20) {
          this.balance = this.balance.slice(0, 19)
        }
        this.balance = this.NumberFormat.toFixed(this.balance, 8)
        this.dhCount = new BigNumber(this.balance).dividedBy(new BigNumber(this.dataList.reservedFieldOne)).toNumber()
      }
    }
  },
  methods: {
    queryActivityDetail () {
      this.$store.dispatch('encryptConnection', {
        url: '/activity/queryActivityDetailById',
        data: {}
      }).then(res => {
        this.dataList = res.body.data
        // (已兑换数量/总兑换数量)*100
        if (Number(res.body.data.reservedFieldThree) !== 0) {
          this.percentage1 = (Number(res.body.data.reservedFieldFour) / Number(res.body.data.reservedFieldThree)) * 100
          if (this.percentage1 < 0.01) {
            this.percentage1 = this.NumberFormat.toFixed(this.percentage1, 4)
          } else {
            this.percentage1 = this.NumberFormat.toFixed(this.percentage1, 2)
          }
          this.percentage1 = Number(this.percentage1)
        } else {
          this.percentage1 = 0
        }
        this.coinName = res.body.data.reservedFieldFive
        // 剩余兑换总数量
        this.overplusCount = res.body.data.reservedFieldThree - res.body.data.reservedFieldFour
        // 判断是否下架(0下架 1上架 其余：未开始)
        if (res.body.data.status === 0) {
          this.isHot = 0
        } else if (res.body.data.status === 1) {
          this.isHot = 1
        } else {
          this.isHot = 2
        }
      }, res => {
        this.$message.error(res.body.msg)
      })
    },
    // 判断是否登录
    loginBtn (_name) {
      if (!this.$store.getters.getUser.loginStatus) {
        this.$router.push({
          name: 'Login', params: {to: 'InnovateProject'}
        })
      } else {
        if (_name === 'exChange') {
          this.exChange()
        } else {
          this.recharge(_name)
        }
      }
    },
    // 充值
    recharge (_name) {
      this.$router.push({name: 'TopUp', params: {coin: _name}})
    },
    // 兑换
    exChange () {
      this.isShow = true
      this.$store.dispatch('encryptConnection', {
        url: '/wallet/selectWalletListUI',
        data: {
          currencyCode: this.coinName
        }
      }).then(response => {
        // 兑换比例
        this.balance = Number(response.body.data[0].balance)
        if (this.balance > 0) {
          // 拥有的兑换数量和剩余兑换总数量，按照最小的显示
          if (this.overplusCount > this.balance) {
            this.balance = this.NumberFormat.toFixed(this.balance, 8)
            this.dhCount = new BigNumber(this.balance).dividedBy(new BigNumber(this.dataList.reservedFieldOne)).toNumber()
          } else {
            this.balance = this.NumberFormat.toFixed(this.overplusCount, 8)
            this.dhCount = new BigNumber(this.overplusCount).dividedBy(new BigNumber(this.dataList.reservedFieldOne)).toNumber()
          }
        } else {
          this.dhCount = 0
        }
        // 首次查询显示可兑换
        this.pinjie = '可兑换' + this.balance
      }, response => {
        this.$message.error(response.body.msg)
      })
    },
    // 确认兑换
    confirmBtn () {
      this.commit = true
      if (this.isOpen) {
        this.isOpen = false
        this.$store.dispatch('encryptConnection', {
          url: '/prize/exchangeUI',
          data: {
            num: this.balance.toString() // 必须要字符串
          }
        }).then(res => {
          this.queryActivityDetail()
          this.commit = false
          this.$message.success('兑换成功')
          setTimeout(() => {
            this.isOpen = true
            this.isShow = false
          }, 500)
        }, res => {
          this.commit = false
          this.isOpen = true
          this.$message.error(res.body.msg)
        })
      }
    },
    // input获得焦点
    isFocus () {
      this.isFocusShow = false
    },
    // 关闭
    closeBtn () {
      this.isShow = false
      this.commit = false
      this.isFocusShow = true
    }
  }
}
</script>

<style scoped>
  /*kv*/
  .innovateBox .kv{position: relative;top: 0;left: 0;display: block;min-width: 1366px;width: 100%;}
  /*content*/
  .innovateBox .content{position: relative;top: 0;left: 0;width: 1200px;margin: 0 auto;}
  .innovateBox .title{font-size: 18px;color: #333;line-height:25px;font-weight: 400;text-align: left;}
  /*listBox*/
  .listBox{position: relative;width: 1200px;height: 283px;border-radius: 8px;background-color: #fff;border:1px solid #DBDBDB;}
  .logoImg{min-width: 120px;min-height: 76px;max-width: 230px;}
  .partOne{width: 230px;position: relative;display: block;}
  .partTwo{width: 970px;position: relative;}

  .font1{color: #0BB2FE;margin-top: 32px;}
  .font2{margin-top: 9px;}
  .font3{line-height: 17px;}
  .font4{width: 515px;margin-right: 83px;}
  .hotImg{position: absolute;right: 0;top: 0;display: block;}
  .percent{position: absolute;width: 100%;top: 10%;left: 0;text-align: center;color: #000;}
  /*textBox*/
  .textBox{height: 195px;}
  /*countBox*/
  .countBox{border-top: 1px solid #ddd;width: 800px;height: 87px;}
  .countBox ul{position: relative;width: 100%;height: 100%;}
  .countBox ul li{position: relative;width: 50%;float: left;text-align: left;}
  /*btn*/
  .btn{width: 114px;height: 30px;border-radius:4px;border: 1px solid #0BB2FE;font-size: 12px;line-height: 17px;position: relative;display: block;}
  .btn1{width: 162px;height: 34px;font-size: 14px;text-align: center;border-radius: 2px;margin-top: 15px;}
  .confirmBtn{float: right;}
  .grayBtn{background-color: #DBDBDB;border: 1px solid #DBDBDB;color: #fff;}
  /*input*/
  .dhInput{width: 260px;height: 34px;border-radius:2px;border:1px solid #D8D8D8;}
  .dhInput input{border: 0;text-align: right;width:100%;}
</style>
