<template>
  <div class="bh-inviteBox">
    <header>
      <!--导航-->
      <navigation class="bh-nav bh-invite-bgcolor"></navigation>
      <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/banner.png" class="kv">
    </header>
    <main class="inviteBox">
      <!--排行榜-->
      <div class="bh-phb">
        <div class="phbBox">
          <div class="title">奖励排行榜</div>
          <div class="minTitle">{{new Date().format('MM')}}月邀请收益排行榜</div>
        </div>
        <div class="bgColor-f phbImg">
          <div class="imgBox two">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/two.png">
            <div class="fontAll phbName">
              {{top3List[1] ? (top3List[1].userName ? top3List[1].userName : (top3List[1].userAccount ? top3List[1].userAccount : '' )) : ''}}
            </div>
            <div class="fontAll phbMoney">￥{{top3List[1] ? (Number(top3List[1].rmbNum).cut(2) || '') : '0'}}</div>
            <div class="fontAll phbCount">第二名</div>
          </div>
          <div class="imgBox one">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/one.png">
            <div class="fontAll phbName phbName1">
              {{top3List[0] ? (top3List[0].userName ? top3List[0].userName : (top3List[0].userAccount ? top3List[0].userAccount : '' )) : ''}}
            </div>
            <div class="fontAll phbMoney phbMoney1">￥{{top3List[0] ? (Number(top3List[0].rmbNum).cut(2) || '') : '0'}}</div>
            <div class="fontAll phbCount phbCount1">第一名</div>
          </div>
          <div class="imgBox three">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/three.png">
            <div class="fontAll phbName">
              {{top3List[2] ? (top3List[2].userName ? top3List[2].userName : (top3List[2].userAccount ? top3List[2].userAccount : '' )) : ''}}
            </div>
            <div class="fontAll phbMoney">￥{{top3List[2] ? (Number(top3List[2].rmbNum).cut(2) || '') : '0'}}</div>
            <div class="fontAll phbCount">第三名</div>
          </div>
        </div>
      </div>

      <!--我的分享-->
      <div class="bh-myShare">
        <div class="phbBox">
          <div class="title">我的分享</div>
          <div class="minTitle">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/horn.gif" class="horn">
            分享链接或二维码邀请好友，每邀请2人获得1次抽奖机会。好友注册后发布交易广告的每一笔场外交易订单，您均可获得奖励，查看
            <a @click="returnRule">活动细则</a>
          </div>
        </div>
        <div class="bgColor-f myShareBox">
          <div class="leftBox">
              <p>分享链接邀请</p>
              <div class="fontBox">
                <div>币汇致力打造一家最有深度的数字资产交易所。ETC币汇交易所正式开通CWV、JON、SPNC、BTC、EOS、USDT的场外交易，目前注册会员自动升级为VIP账号，
                  享受交易费五折优惠。现在注册，即可领取红包！<span>{{copySrc}}</span></div>
              </div>
            <div class="exNote">复制链接邀请好友注册，您将获得交易返佣</div>
            <a class="copySrcBtn" v-clipboard:copy="copySrc1" v-clipboard:success="handleSuccess" v-clipboard:error="handleError">复制邀请链接</a>
          </div>
          <div class="rightBox">
            <el-carousel type="card" height="334px;" :interval="0" indicator-position="none" arrow="always" class="invite-swiper" @change="changeCarousel">
              <el-carousel-item>
                <img id="img0" src="http://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/bg5.jpg" crossorigin="anonymous">
                <vue-qr id="qr" :logoSrc="codeLogo" :text="copySrc1" :size="200" :margin="0" :whiteMargin="true" class="invite-qr"></vue-qr>
              </el-carousel-item>
              <el-carousel-item>
                <img id="img1" src="http://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/bg5.jpg" crossorigin="anonymous">
                <vue-qr :logoSrc="codeLogo" :text="copySrc1" :size="200" :margin="0" :whiteMargin="true" class="invite-qr"></vue-qr>
              </el-carousel-item>
              <el-carousel-item>
                <img id="img2" src="http://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/bg5.jpg" crossorigin="anonymous">
                <vue-qr :logoSrc="codeLogo" :text="copySrc1" :size="200" :margin="0" :whiteMargin="true" class="invite-qr"></vue-qr>
              </el-carousel-item>
              <!--<el-carousel-item>-->
                <!--<img id="img3" src="http://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/bg4.jpg" crossorigin="anonymous">-->
                <!--<vue-qr :logoSrc="codeLogo" :text="copySrc1" :size="200" :margin="0" :whiteMargin="true" class="invite-qr"></vue-qr>-->
              <!--</el-carousel-item>-->
            </el-carousel>
            <div class="downloadBtn" @click="downloadBtn">下载海报邀请</div>
          </div>
        </div>
      </div>

      <!--邀请记录-->
      <div class="bh-inRecord" v-if="isShow">
        <div class="phbBox">
          <div class="title">邀请记录</div>
        </div>
        <div class="bgColor-f inRecordBox">
          <ul class="inRecordBox-ul">
            <li>
              <p class="phbBoxCount">{{inviteRe.registeredCount ? inviteRe.registeredCount : 0}}</p>
              <p class="phbBoxText">邀请注册人数</p>
            </li>
            <li>
              <p class="phbBoxCount">{{inviteRe.unrealNameCount ? inviteRe.unrealNameCount : 0}}</p>
              <p class="phbBoxText">未实名认证人数</p>
            </li>
            <li>
              <p class="phbBoxCount">{{inviteRe.realNameCount ? inviteRe.realNameCount : 0}}</p>
              <p class="phbBoxText">中级实名认证人数</p>
            </li>
            <li>
              <p class="phbBoxCount">{{inviteRe.tranCount ? inviteRe.tranCount : 0}}</p>
              <p class="phbBoxText">发生交易人数</p>
            </li>
            <li>
              <p class="phbBoxCount">{{inviteRe.rmbNum ? Number(inviteRe.rmbNum).cut(2) : 0}}</p>
              <p class="phbBoxText">交易返佣总估值</p>
            </li>
          </ul>
          <div style="clear: both"></div>
          <div class="countRecord">
            <h1>邀请人员记录</h1>
            <div class="tableBox">
              <el-table :data="tableData" border style="width: 100%;" class="invite-table">
                <el-table-column prop="toUserAccount" label="用户"></el-table-column>
                <el-table-column prop="identityAuthenticator" label="认证状态"></el-table-column>
                <el-table-column prop="registeredDate" label="注册时间"></el-table-column>
                <el-table-column prop="rmbNum" label="返佣估值"></el-table-column>
              </el-table>
            </div>
            <div class="pagesBox" v-if="totalCount > pageSize">
              <el-pagination layout="prev, pager, next" :total="totalCount" :page-size="pageSize" class="invite-page" @current-change="handleCurrentChange"></el-pagination>
            </div>
          </div>
        </div>
      </div>

      <!--活动规则-->
      <div class="bh-ruleBox bgColor-f" id="returnRule">
        <h1>活动细则</h1>
        <div class="ruleBox">
          <ul class="ruleBox-ul">
            <!--<li>-->
              <!--<span class="iconIndex">1</span>-->
              <!--<div class="font">-->
                <!--奖励对象：全体用户<br>-->
                <!--活动时间：2018年12月10日00:00 – 2018年12月31日24:00（活动时间:21天）-->
              <!--</div>-->
            <!--</li>-->
            <!--<li>-->
              <!--<span class="iconIndex">2</span>-->
              <!--<div class="font">邀请有奖：凡在活动期间分享链接或二维码邀请好友，每邀请5人获得1次抽奖机会（被邀请人需完成中级实名认证）。<br/>好友注册后发布交易广告的每一笔场外交易订单，您均可获得奖励。</div>-->
            <!--</li>-->
            <!--<li>-->
              <!--<span class="iconIndex">3</span>-->
              <!--<div class="font">注册有奖：活动期间注册的会员，自动升级为VIP会员，ETC交易所币汇网交易手续费低至千分之一，相比其他交易所优惠百分之五十。</div>-->
            <!--</li>-->
            <!--<li>-->
              <!--<span class="iconIndex">4</span>-->
              <!--<div class="font">币汇保留对本活动的最终修改解释及对返佣活动规则进行调整的权利。</div>-->
            <!--</li>-->
            <!--<li>-->
              <!--<span class="iconIndex">5</span>-->
              <!--<div class="font">本次活动最终解释权归8bihui所有。</div>-->
            <!--</li>-->
            <li>
              <span class="iconIndex">1</span>
              <a class="font" href="/activity">活动详情见JON上线活动细则</a>
            </li>
          </ul>
          <div style="clear: both"></div>
        </div>
        <div style="clear: both;height: 40px;"></div>
      </div>

      <!--画布-->
      <canvas id="canvasImg" style="display: none;"></canvas>
    </main>
  </div>
</template>

<script>
import Navigation from '../components/Navigation'
import VueClipboard2 from 'vue-clipboard2'
import VueQr from 'vue-qr'
export default {
  name: 'Invite',
  components: {
    VueQr,
    Navigation,
    VueClipboard2
  },
  data () {
    return {
      // 邀请码
      inviteCode: '',
      // 下载地址
      copySrc: window.location.origin + '/register/',
      copySrc1: '',
      // 没有邀请码的情况下友情提示
      noCode: '邀请码迷路了，请刷新后再次尝试',
      noCode1: '请登录后扫码',
      // 判断是否登录，未登录不显示
      isShow: true,
      // 二维码中心logo
      codeLogo: require('../assets/images/invite/logo.png'),
      // 轮播图下标初始值为0
      imgIndex: 0,
      top3List: [],
      inviteRe: {},
      // 分页页数
      pageIndex: 0,
      pageSize: 10,
      tableData: [],
      // 总条数
      totalCount: 0,
      // 获取电话号码,邮箱
      telephone: '',
      email: ''
    }
  },
  created () {
    // 一进来判断是否登录，登录状态下显示邀请记录，获取邀请码
    if (this.$store.getters.getUser.loginStatus) {
      this.$store.dispatch('qryUserInfo').then(response => {
        if (response.body.data.inviterCode) {
          this.inviteCode = response.body.data.inviterCode
          this.telephone = response.body.data.telephone
          this.email = response.body.data.email
          // 拼接，复制时脱敏
          let pinjie = this.copySrc + this.inviteCode + '/'
          if (this.telephone) {
            this.copySrc = pinjie + this.telephone
            this.copySrc1 = pinjie + this.$store.getters.getUser.desensitizationTelephone
          } else {
            this.copySrc = pinjie + this.email
            this.copySrc1 = pinjie + this.$store.getters.getUser.desensitizationEmail
          }
          // 邀请记录
          this.$store.dispatch('encryptConnection', {
            url: '/inviterCode/findInvetrCodeInfoUI',
            data: {}
          }).then(response => {
            this.inviteRe = response.body.data
          }, response => {})

          // 邀请人员记录
          this.publicFun()
        } else {
          this.$message.error(this.noCode)
          this.copySrc1 = this.noCode
        }
      }, response => {
        this.$message.error(this.noCode)
        this.copySrc1 = this.noCode
      })
    } else {
      this.isShow = false
      // 未登录下二维码友情提示
      this.copySrc1 = this.noCode1
    }
    // 排行榜
    this.$store.dispatch('encryptConnection', {
      url: '/incomeRecord/findTheMontyTopThreeUI',
      data: {}
    }).then(response => {
      this.top3List = response.body.data
    }, response => {})
  },
  methods: {
    // 幻灯片切换
    changeCarousel (_index) {
      this.imgIndex = _index
    },
    handleSuccess (e) {
      // 判断是否登录
      if (!this.$store.getters.getUser.loginStatus) {
        this.$router.push({
          name: 'Login', params: {to: 'Invite'}
        })
      } else {
        // 判断是否有邀请码,没有的话禁止点击
        if (this.inviteCode === '') {
          this.$message.error(this.noCode)
          this.copySrc1 = this.noCode
        } else {
          this.$message.success('复制邀请链接成功')
          this.copySrc1 = this.copySrc1
        }
      }
    },
    handleError () {
      this.$message.error('复制邀请链接失败')
    },
    // 锚点
    returnRule () {
      this.$el.querySelector('#returnRule').scrollIntoView(true)
    },
    // 下载海报
    downloadBtn () {
      // 判断是否登录
      if (!this.$store.getters.getUser.loginStatus) {
        this.$router.push({
          name: 'Login', params: {to: 'Invite'}
        })
      } else {
        // 判断是否有邀请码,没有的话禁止点击
        if (this.inviteCode === '') {
          this.$message.error(this.noCode)
          this.copySrc1 = this.noCode
        } else {
          this.$message.success('下载海报邀请成功')
          this.copySrc1 = this.copySrc1
          // 判断浏览器
          let userAgent = navigator.userAgent
          let isOpera = userAgent.indexOf('Opera') > -1

          const myCanvas = document.getElementById('canvasImg')
          myCanvas.width = 750
          myCanvas.height = 1334

          let ctx = myCanvas.getContext('2d')
          let imgIndex = document.getElementById('img' + this.imgIndex)
          ctx.drawImage(imgIndex, 0, 0)

          // 给二维码加一个矩形背景
          ctx.lineJoin = 'round'
          ctx.lineWidth = 10
          ctx.fillStyle = '#FFF'
          ctx.strokeStyle = '#FFF'
          ctx.strokeRect(265, 930, 220, 220)
          ctx.fillRect(265, 930, 220, 220)

          // 二维码left,top=(画布宽-二维码真实宽)/2
          let qr = document.getElementById('qr').firstChild
          ctx.drawImage(qr, 275, 940)

          // ctx.font = '30px PingFangSC'
          // ctx.fillStyle = '#fff'
          // ctx.textAlign = 'center'
          // ctx.fillText('—— 分享时    人正在扫码抽奖 ——', 375, 1300)
          //
          // ctx.font = '30px PingFangSC'
          // ctx.fillStyle = '#FFAE0E'
          // ctx.textAlign = 'center'

          // 1-60随机数
          // let randomNum = Math.floor(Math.random() * 59 + 1)
          // ctx.fillText(randomNum.toString(), 318, 1300)

          let imgData = myCanvas.toDataURL('png')
          imgData = imgData.replace(this._fixType('png'), 'image/octet-stream')

          if (userAgent.indexOf('Trident') > -1 || userAgent.indexOf('Edge') > -1) {
            // console.log('Edge')
            this.ieFun(myCanvas)
          } else if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
            // console.log('IE')
            this.ieFun(myCanvas)
          } else {
            this.otherFun(imgData)
          }
        }
      }
    },
    ieFun (myCanvas) {
      window.navigator.msSaveBlob(myCanvas.msToBlob(), 'inviteCode.png')
    },
    otherFun (imgData) {
      // 创建带有指定命名空间的元素节点
      let saveLink = document.createElement('a')
      saveLink.href = imgData
      saveLink.download = 'inviteCode.png'

      let event = document.createEvent('MouseEvents')
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      saveLink.dispatchEvent(event)
    },
    _fixType (type) {
      type = type.toLowerCase().replace(/jpg/i, 'jpeg')
      const r = type.match(/png|jpeg|bmp|gif/)[0]
      return 'image/' + r
    },
    // 邀请人员记录当前页
    handleCurrentChange (val) {
      this.pageIndex = val - 1
      this.publicFun()
    },
    publicFun () {
      // 邀请人员记录
      this.$http.get('/inviterCode/findUserInvRecordListUI', {
        params: {
          pageSize: this.pageSize,
          pageNo: this.pageIndex
        }
      }).then(response => {
        this.totalCount = response.body.totalCount
        const data = response.body.data
        const newData = []
        for (let i in data) {
          const item = {}
          item['toUserAccount'] = data[i].toUserAccount
          const auth = Number(data[i].identityAuthenticator)
          if (!auth) {
            item['identityAuthenticator'] = '未认证'
          } else if (auth >= 1 && auth < 3) {
            item['identityAuthenticator'] = '初级认证'
          } else if (auth >= 3 && auth < 4) {
            item['identityAuthenticator'] = '中级认证'
          } else if (auth === 4) {
            item['identityAuthenticator'] = '高级认证'
          }
          item['registeredDate'] = new Date(data[i].registeredDate).format('yyyy-MM-dd hh:mm:ss')
          item['rmbNum'] = Number(data[i].rmbNum).cut(2) + 'CNY'
          newData.push(item)
        }
        this.tableData = newData
      }, response => {})
    },
    IsPC () {
      const userAgentInfo = navigator.userAgent
      const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
      let flag = true
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false
          break
        }
      }
      return flag
    }
  }
}
</script>

<style scoped>
  /*安全区域*/
  .bh-inviteBox{background-color: #F2F3F8;}
  .bh-invite-bgcolor{background-color: #2C3253;}
  /*公共样式*/
  .bh-inviteBox .inviteBox{position: relative;width: 1200px;margin: 0 auto;}
  .bh-inviteBox .phbBox{background-color: #F9F7FE;margin-top: 20px;}
  .bh-inviteBox .bgColor-f{background-color: #fff;}
  .bh-inviteBox .title{color: #333;font-size: 20px;font-weight: 500;text-align: center;line-height: 28px;position: relative;width: 100%;}
  .bh-inviteBox .minTitle{color: #666;font-size: 16px;font-weight: 400;text-align: center;line-height: 22px;position: relative;width: 100%;}
  .bh-inviteBox .minTitle a{color: #0BB2FE;cursor: pointer;}

  /*kv*/
  .kv{position: relative;width: 100%;max-width: 1920px;min-width: 1200px;display: block;margin: 0 auto;}

  /*排行榜*/
  .phbBox{padding: 19px 0;}
  .phbImg{position: relative;width: 100%;height: 320px;}
  .phbImg .imgBox{position: absolute;width: 235px;height: 257px;top: 43px;}
  .phbImg .imgBox img{position: relative;width: 100%;height: 100%;display: block;}
  .phbImg .one{height: 288px;left: 492px;top: 13px;}
  .phbImg .two{left: 110px;}
  .phbImg .three{right: 110px;}
  .bh-phb .fontAll{position: absolute;width: 100%;text-align: center;}
  .phbName {font-size:16px;font-weight:400;color:#0BB2FE;line-height:22px;top: 87px;}
  .phbMoney{font-size:30px;font-weight:500;color:#0BB2FE;line-height:42px;top: 117px;}
  .phbCount{font-size:22px;font-weight:500;color:#8FA2F3;line-height:30px;top: 173px;}
  .bh-phb .phbName1 {top: 125px;}
  .bh-phb .phbMoney1{top: 147px;}
  .bh-phb .phbCount1{top: 203px;}

  /*我的分享*/
  .myShareBox{position: relative;width: 100%;height: 438px;}
  .inRecordBox{position: relative;width: 100%;}
  .inRecordBox .inRecordBox-ul{position: relative;width: 100%;border-bottom:1px solid #D8D8D8;
    height: 111px;box-sizing: border-box;-webkit-box-sizing:border-box;padding: 15px 0;}
  .inRecordBox .inRecordBox-ul li{position: relative;width: 20%;float: left;height: 100%;
    border-right:1px solid #D8D8D8;box-sizing: border-box;-webkit-box-sizing:border-box;}
  .inRecordBox-ul .phbBoxCount{position: relative;width:100%;height:28px;font-size:20px;font-weight:400;
    color:rgba(11,178,254,1);line-height:28px;text-align: center;padding: 0;margin: 0;margin-top: 14px;}
  .inRecordBox-ul .phbBoxText{position: relative;width:100%;height:20px;font-size:14px;font-weight:400;
    color:rgba(51,51,51,1);line-height:20px;text-align: center;padding: 0;margin: 0;margin-top: 6px;}
  .countRecord{position: relative;clear: both;}
  .horn{height: 15px;}

  .leftBox{position: absolute;width: 285px;height: 337px;top: 29px;left: 132px;
    background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/invite/leftBoxBg.png") no-repeat;}
  .leftBox p{position: relative;width:100%;height:22px;font-size:16px;font-weight:500;color:#333;line-height:22px;
    text-align: center;margin: 19px 0;}
  .fontBox{position: relative;width: 240px;height: 215px;margin: 0 auto;background-color: #F2F3F8;}
  .fontBox div{font-size: 14px;color: #666;padding: 28px 23px 0 23px;position: relative;}
  .fontBox span{position: relative;width: 100%;word-wrap: break-word;}
  .exNote{position: absolute;width: 100%;font-size: 12px;color: #666;bottom: 2px;text-align: center;}
  .copySrcBtn,.downloadBtn{position: absolute;width: 130px;height: 30px;background: #0BB2FE;cursor: pointer;
    border-radius: 2px;color: #fff;font-size: 12px;text-align: center;left: 50%;margin-left: -65px;bottom: -46px;
    line-height: 30px;}
  .rightBox{position: relative;top: 29px;margin-left: 450px;height: 334px;width: 660px;}
  .rightBox img{width: 100%;}

  /*邀请记录*/
  .countRecord h1,.bh-ruleBox h1{position: relative;height:22px;font-size:16px;font-weight:400;color:#333;
    line-height:22px;margin-left: 20px;}
  .tableBox{position: relative;width: 1170px;margin: 0 auto;text-align: center;padding-bottom: 10px;}
  .pagesBox{position: relative;width: 100%;margin: 0 auto;text-align: center;height: 30px;line-height: 30px;padding: 20px 0;
    color: #666;font-size: 18px;}

  /*活动细则*/
  .bh-ruleBox{position: relative;width: 100%;margin: 0 auto;}
  .bh-ruleBox h1{margin: 0 0 0 20px;}
  .ruleBox{position: relative;margin-left: 20px;}
  .ruleBox ul{position: relative;width: 90%;left: 0;top: 0;}
  .ruleBox ul li{position: relative;width: 100%;margin-top: 14px;}
  .iconIndex{position: absolute;width: 20px;height: 20px;background-color: #E0F5FF;font-size: 12px;
    font-weight: 400;color: #0BB2FE;line-height: 20px;text-align: center;border-radius: 30px;
    display: inline-block;margin-right: 10px;top: 0;left: 0;}
  .ruleBox .font{font-size:14px;font-weight:400;color:#666666;line-height:20px;margin-left: 30px;}
</style>
