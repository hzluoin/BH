<template>
  <div class='bh-home'>
    <header>
      <div class="bh-banner-content">
        <!--导航-->
        <div class="bh-navBox">
          <div class="bh-home-bgcolor"></div>
          <navigation class="bh-nav"></navigation>
        </div>

        <!--轮播图-->
        <div class="kv swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <img src="../assets/images/home/baibai.png">
            </div>
          </div>
          <div class="swiper-pagination"></div><!--轮播点-->
        </div>
      </div>
    </header>

    <main class="content">
      <!--最新公告-->
      <div class="conBox bh-notify">
        <div class="bh-notify_content">
          <span class="bh-font_subtitle">{{$t('message.LatestNotice')}}</span>
          <span class="bh-notify-content cur" v-show="news.title" @click="$router.push({ name: 'FrequentlyAskedQuestion', params: {type: 1, myId: categoryId, helpId: news.id} })">{{news.title}}</span>
          <div class="bh-btn_text">
            <a target="_blank" href="/HelpCenter?type=1">{{$t('button.More')}}
              <i class="icon iconfont icon-gengduo_"></i>
            </a>
          </div>
        </div>
      </div>

      <!--指数-->
      <div class="conBox bh-market">
        <ul>
          <li>
            <p class="ml21 bh-unit">BTC指数</p>
            <div class="ml21 bh-price" :class="{'bh-up': priceList.BTC.rise, 'bh-down': !priceList.BTC.rise}">
              <span v-if="$store.getters.getRate && $store.getters.getRate.rates">￥{{USDToCNY(priceList.BTC.price)}}</span>
              <span v-else>${{Number(priceList.BTC.price).cut(2)}}</span>
              <div class="bh-market-arrow" :class="{'bh-up2': priceList.BTC.rise, 'bh-down2': !priceList.BTC.rise}"></div>
            </div>
            <div class="ml21 num" :class="{'bh-up1': priceList.BTC.rise, 'bh-down1': !priceList.BTC.rise}">{{priceList.BTC.risePercent}}%</div>
          </li>
          <li>
            <p class="ml21 bh-unit">LTC指数</p>
            <div class="ml21 bh-price" :class="{'bh-up': priceList.LTC.rise, 'bh-down': !priceList.LTC.rise}">
              <span v-if="$store.getters.getRate.rates">￥{{USDToCNY(priceList.LTC.price)}}</span>
              <span v-else>${{Number(priceList.LTC.price).cut(2)}}</span>
              <div class="bh-market-arrow" :class="{'bh-up2': priceList.LTC.rise, 'bh-down2': !priceList.LTC.rise}"></div>
            </div>
            <div class="ml21 num" :class="{'bh-up1': priceList.LTC.rise, 'bh-down1': !priceList.LTC.rise}">{{priceList.LTC.risePercent}}%</div>
          </li>
          <li>
            <p class="ml21 bh-unit">BCH指数</p>
            <div class="ml21 bh-price" :class="{'bh-up': priceList.BCH.rise, 'bh-down': !priceList.BCH.rise}">
              <span v-if="$store.getters.getRate.rates">￥{{USDToCNY(priceList.BCH.price)}}</span>
              <span v-else>${{Number(priceList.BCH.price).cut(2)}}</span>
              <div class="bh-market-arrow" :class="{'bh-up2': priceList.BCH.rise, 'bh-down2': !priceList.BCH.rise}"></div>
            </div>
            <div class="ml21 num" :class="{'bh-up1': priceList.BCH.rise, 'bh-down1': !priceList.BCH.rise}">{{priceList.BCH.risePercent}}%</div>
          </li>
          <li>
            <p class="ml21 bh-unit">ETH指数</p>
            <div class="ml21 bh-price" :class="{'bh-up': priceList.ETH.rise, 'bh-down': !priceList.ETH.rise}">
              <span v-if="$store.getters.getRate.rates">￥{{USDToCNY(priceList.ETH.price)}}</span>
              <span v-else>${{Number(priceList.ETH.price).cut(2)}}</span>
              <div class="bh-market-arrow" :class="{'bh-up2': priceList.ETH.rise, 'bh-down2': !priceList.ETH.rise}"></div>
            </div>
            <div class="ml21 num" :class="{'bh-up1': priceList.ETH.rise, 'bh-down1': !priceList.ETH.rise}">{{priceList.ETH.risePercent}}%</div>
          </li>
          <li>
            <p class="ml21 bh-unit">ETC指数</p>
            <div class="ml21 bh-price" :class="{'bh-up': priceList.ETC.rise, 'bh-down': !priceList.ETC.rise}">
              <span v-if="$store.getters.getRate.rates">￥{{USDToCNY(priceList.ETC.price)}}</span>
              <span v-else>${{Number(priceList.ETC.price).cut(2)}}</span>
              <div class="bh-market-arrow" :class="{'bh-up2': priceList.ETC.rise, 'bh-down2': !priceList.ETC.rise}"></div>
            </div>
            <div class="ml21 num" :class="{'bh-up1': priceList.ETC.rise, 'bh-down1': !priceList.ETC.rise}">{{priceList.ETC.risePercent}}%</div>
          </li>
        </ul>
      </div>

      <!--平台担保，安全交易-->
      <div class="conBox">
          <div class="ptBox">
            <p class="font1">平台担保 安全交易</p>
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/arrow.png" class="arrow">
            <div class="imgBox">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/img1.png" class="img1">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/img2.png" class="img2">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/img3.png" class="img3">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/img4.png" class="img4">
              <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/img5.png" class="img5">
            </div>
          </div>
      </div>

      <!--平台信息-->
      <div class="conBox bh-platform" ref="platform">
        <ul>
          <li class="imgBg mr40">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/icon1.png" class="icon1">
            <span class="title">全球场外交易</span>
            <span class="line"></span>
            <span class="font">支持多国法币交易，为用户 保值、增收、极速安全</span>
          </li>
          <li class="imgBg mr40">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/icon2.png" class="icon2">
            <span class="title">用户至上</span>
            <span class="line"></span>
            <span class="font">所有交易免费，充币、提币 实时到账，多语种客服支持</span>
          </li>
          <li class="imgBg mr40">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/icon3.png" class="icon3">
            <span class="title">安全</span>
            <span class="line"></span>
            <span class="font">专业级的金融风控团队 95%的资产冷钱包存储</span>
          </li>
          <li class="imgBg">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/icon4.png" class="icon4">
            <span class="title">专业</span>
            <span class="line"></span>
            <span class="font">人民币、美元市场无缝式交易，专业级的操盘模式</span>
          </li>
        </ul>
      </div>

      <!--买入卖出-->
      <div class="conBox bh-buy">
          <div class="bhBuyBox">
              <ul>
                <li v-for="(data, index) in bhList" :key="index">
                  <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/dollar.png" class="dollar">
                  <div class="buy">{{data.changeType}} {{data.coinCount}} {{data.coinType}}
                    <span class="time">({{data.buyTime}}完成交易)</span>
                  </div>
                  <div class="before">{{data.beforeTime}}</div>
                </li>
              </ul>
          </div>
      </div>
    </main>

    <footer>
      <bh-footer></bh-footer>
    </footer>
  </div>
</template>

<script>
import Navigation from '../components/Navigation'
import LanguageSelect from '../components/LanguageSelect'
import BhFooter from '../components/FooterIndex'
import Swiper from 'swiper'
import NumberFormat from '../plugin/NumberFormat'
export default {
  name: 'Home',
  components: {
    Navigation,
    LanguageSelect,
    BhFooter
  },
  data () {
    return {
      bhList: [
        {changeType: '买入', coinCount: '3.171', coinType: 'GXC', buyTime: '12秒', beforeTime: '12分钟前'},
        {changeType: '卖出', coinCount: '5.172', coinType: 'GXC', buyTime: '8秒', beforeTime: '6分钟前'},
        {changeType: '买入', coinCount: '3', coinType: 'GXC', buyTime: '12秒', beforeTime: '12分钟前'},
        {changeType: '买入', coinCount: '2.221', coinType: 'GXC', buyTime: '12秒', beforeTime: '7分钟前'},
        {changeType: '卖出', coinCount: '0.3', coinType: 'BTC', buyTime: '12秒', beforeTime: '10分钟前'},
        {changeType: '卖出', coinCount: '0.371', coinType: 'ETH', buyTime: '12秒', beforeTime: '12分钟前'},
        {changeType: '买入', coinCount: '3.342', coinType: 'GXC', buyTime: '10秒', beforeTime: '1分钟前'},
        {changeType: '卖出', coinCount: '3.371', coinType: 'GXC', buyTime: '2秒', beforeTime: '2分钟前'},
        {changeType: '买入', coinCount: '0.371', coinType: 'ETH', buyTime: '1秒', beforeTime: '12分钟前'},
        {changeType: '卖出', coinCount: '0.171', coinType: 'ETH', buyTime: '12秒', beforeTime: '1分钟前'}
      ],
      // 最新公告
      news: {},
      newsCategoryId: ''
    }
  },
  computed: {
    priceList () {
      let data = this.$store.getters.getAllCoinPrice || {}
      return {
        BTC: {price: (data.BTC && data.BTC['price']) || 0, rise: (!data.BTC) || (data.BTC.change_daily >= 0), risePercent: (data.BTC && data.BTC.change_daily) || 0},
        LTC: {price: (data.LTC && data.LTC['price']) || 0, rise: (!data.LTC) || (data.LTC.change_daily >= 0), risePercent: (data.LTC && data.LTC.change_daily) || 0},
        BCH: {price: (data.BCH && data.BCH['price']) || 0, rise: (!data.BCH) || (data.BCH.change_daily >= 0), risePercent: (data.BCH && data.BCH.change_daily) || 0},
        ETH: {price: (data.ETH && data.ETH['price']) || 0, rise: (!data.ETH) || (data.ETH.change_daily >= 0), risePercent: (data.ETH && data.ETH.change_daily) || 0},
        ETC: {price: (data.ETC && data.ETC['price']) || 0, rise: (!data.ETC) || (data.ETC.change_daily >= 0), risePercent: (data.ETC && data.ETC.change_daily) || 0}
      }
    }
  },
  mounted () {
    // 1.首页加载后查询最新十条交易记录
    this.$store.dispatch('encryptConnection', {
      url: '/orders/findAllFinishOrderUI',
      data: {}
    }).then(response => {
      let data = response.body.data
      const newList = []
      for (let i in data) {
        newList.push({
          changeType: parseInt((Math.random() * 10).toString()) % 2 === 0 ? '买入' : '卖出',
          coinCount: NumberFormat.toFixed(data[i].coinCount, 8),
          coinType: data[i].coinType,
          buyTime: this.convertTime2(data[i].finishTime - data[i].createTime),
          beforeTime: this.convertTime(+new Date() - data[i].finishTime)
        })
      }
      this.bhList = newList
    }, response => {})
    // 2.增加webSocket消息最新交易渠道监听
    this.$store.commit('setWSChannel', {
      channelId: '3',
      funcId: 'home',
      func: data => {
        this.bhList.pop()
        this.bhList.push({
          changeType: parseInt((Math.random() * 10).toString()) % 2 === 0 ? '买入' : '卖出',
          coinCount: NumberFormat.toFixed(data.coinCount, 8),
          coinType: data.coinType,
          buyTime: this.convertTime2(data.finishTime - data.createTime),
          beforeTime: this.convertTime(+new Date() - data.finishTime)
        })
      }
    })
    // 3.查询最新公告
    this.$http.get('/help/listUI', {
      params: {
        type: 1
      }
    }).then(response => {
      const data = response.body.data
      for (let i in data) {
        if (/最新/.test(data[i]['category'])) {
          this.newsCategoryId = data[i]['categoryId']
          this.news = data[i]['helps'][0] || {}
          return
        }
      }
    })
    // 4.swiper轮播图
    let swiper1 = new Swiper('.bh-home .swiper-container', {
      autoplay: 4000, // 自动滑动
      speed: 500,
      autoHeight: true, // 高度随内容变化
      loop: true,
      noSwiping: true, // 无法拖动
      pagination: '.bh-home .swiper-pagination'
    })
    swiper1.init()
  },
  destroyed () {
    this.$store.commit('delWSChannel', {
      channelId: '3',
      funcId: 'home'
    })
  },
  methods: {
    // 时间转换
    convertTime (time) {
      // 一个月前 1000*60*60*24*30
      if (time >= 2592000000) {
        return '1个月前'
      }
      // 一天前，一个月内 1000*60*60*24
      if (time >= 86400000) {
        const days = parseInt((time / 86400000).toString())
        const hours = parseInt(((time % 86400000) / 3600000).toString())
        const minutes = parseInt((((time % 86400000) % 3600000) / 60000).toString())
        return days + '天' + hours + '小时' + minutes + '分钟前'
      }
      // 一小时前，一天内
      if (time >= 3600000) {
        const hours = parseInt(((time % 86400000) / 3600000).toString())
        const minutes = parseInt((((time % 86400000) % 3600000) / 60000).toString())
        return hours + '小时' + minutes + '分钟前'
      }
      // 一分钟前，一小时内
      if (time >= 60000) {
        const minutes = parseInt((((time % 86400000) % 3600000) / 60000).toString())
        return minutes + '分钟前'
      }
      return '1分钟前'
    },
    convertTime2 (time) {
      let days = ''
      let hours = ''
      let minutes = ''
      let second = ''
      // time大于一天
      if (time >= 86400000) {
        hours = parseInt((time / 86400000).toString()) + '天'
      }
      // time小于一天
      if (time >= 3600000) {
        hours = parseInt((time / 3600000).toString()) + '小时'
      }
      // time小于一小时
      // time小于一分钟
      if (time >= 60000) {
        minutes = parseInt((time / 60000).toString()) + '分'
      }
      second = parseInt((time % 60000 / 1000).toString()) + '秒'
      return days + hours + minutes + second
    },
    USDToCNY (price) {
      if (this.$store.getters.getRate.rates && this.$store.getters.getRate.rates.CNY) {
        return new this.BigNumber(price).multipliedBy(new this.BigNumber(this.$store.getters.getRate.rates.CNY)).toNumber().cut(2)
      } else {
        return price
      }
    },
    goTo () {
      this.$router.push('Account')
    }
  }
}
</script>

<style scoped>
  /*首页导航栏*/
  .bh-navBox{position: relative;width: 100%;height: 100%;}
  .bh-home-bgcolor{background-color: #000;opacity: 0.12;position: absolute;width: 100%;height: 100%;top:0;left: 0;}
  .bh-home img{display: block;}
  .bh-home p{margin: 0;padding: 0;}
  .content{position: relative;}
  /*安全区域*/
  .conBox{position: relative;width: 1200px;margin: 0 auto;}
  .bh-home{position: relative;width: 100%;max-width: 1920px;background-color: #18184C;height: auto;margin: 0 auto;}

  /*轮播图*/
  .kv{position: relative;width: 100%;max-width: 1920px;min-width: 1200px;max-height: 640px;overflow: hidden;}
  .kv img{position: relative;display: block;width: 100%;max-width: 1920px;min-width: 1200px;max-height: 640px;}
  .openBtn{display: block;position: absolute;width: 12%;height: 7%;top: 68%;left: 22.6%;cursor: pointer;}
  .banner2Btn{position: absolute;width: 9.6%;left: 30.6%;top: 69.3%;height: 6.6%;}

  /*最新公告*/
  .bh-notify{background-color: #131345;width: 1200px;height: 40px;line-height: 40px;margin-top: 50px;}
  .bh-notify_content{position: absolute;width: 100%;}
  .bh-font_subtitle{color:#56ECFF;font-size:16px;margin-left: 20px;}
  .bh-notify-content a,.bh-notify-content{color:#71719A;font-size: 14px;}
  .bh-notify-content{margin-left: 30px;}
  .bh-btn_text a{color:#71719A;font-size: 14px;}
  .bh-btn_text{position: absolute;margin-right: 20px;right: 0;top:0;}
  .bh-btn_text .iconfont{font-size: 14px;}

  /*指数*/
  .bh-market{margin-top: 90px;height:124px;}
  .bh-market .ml21{margin-left: 21px;}
  .bh-market ul{position: relative;width: 100%;}
  .bh-market ul li{position: relative;width: 224px;height:124px; float: left; margin-right: 16px;
    -webkit-transition: all 380ms;
    -moz-transition: all 380ms;
    -ms-transition: all 380ms;
    -o-transition: all 380ms;
    transition: all 380ms;}
  .bh-market ul li:hover{background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/zsBg.png") no-repeat;}
  .bh-market .bh-unit{font-size: 16px;font-weight: bold;color: #fff;margin-top: 16px;}
  .bh-market .bh-price{font-size: 24px;font-weight: bold;margin-top: 8px;position: relative;width: 100%;}
  .num{position: relative;width: 60px;height:18px;line-height:18px;font-size: 12px;color: #fff;
    border-radius: 4px;text-align: center;margin-top: 11px;}
  .bh-up{color: #4DB872;}
  .bh-down{color: #EF6560;}
  .bh-up1{background-color: #4DB872;}
  .bh-down1{background-color: #EF6560;}
  .bh-up2{background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/up.png") no-repeat;}
  .bh-down2{background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/down.png") no-repeat;}
  .bh-market-arrow{width: 16px;height: 20px;display: inline-block;}

  /*平台担保*/
  .ptBox{position: relative;margin: 120px 0;width: 100%;}
  .ptBox .font1{color: #56ECFF;font-size: 32px;text-align: center;margin-bottom: 10px;}
  .arrow{position: relative;width: 22px;height: 20px;margin: 0 auto;display: block;}
  .imgBox{position: relative;height: 450px;width: 100%;margin-top: 50px;}
  .img1{position: relative;width: 285px;height: 225px;margin: 0 auto;top: 0;}
  .img2{position: absolute;width: 312px;height: 348px;left: 0;top: 102px;}
  .img3{position: absolute;width: 312px;height: 348px;right: 0;top: 102px;}
  .img4{position: absolute;width: 87px;height: 73px;top: 141px;left: 298px;}
  .img5{position: absolute;width: 87px;height: 73px;top: 141px;right: 298px;}

  /*平台信息*/
  .bh-platform{height: 320px;}
  .bh-platform .mr40{margin-right: 40px;}
  .bh-platform ul{position: absolute;width: 100%;}
  .bh-platform ul li{position: relative;width: 270px;height: 310px;float: left;cursor: pointer;
    -webkit-transition: all 380ms;
    -moz-transition: all 380ms;
    -ms-transition: all 380ms;
    -o-transition: all 380ms;
    transition: all 380ms;}
  .bh-platform .imgBg{background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/imgBg.png") no-repeat;margin-top: 10px;}
  .bh-platform ul li:hover {background: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/home/imgBg_on.png") no-repeat;margin-top: 0;}

  .icon1{position: relative;width: 64px;margin: 0 auto;top: 46px;}
  .icon2{position: relative;width: 68px;margin: 0 auto;top: 46px;}
  .icon3{position: relative;width: 58px;margin: 0 auto;top: 46px;}
  .icon4{position: relative;width: 66px;margin: 0 auto;top: 46px;}

  .bh-platform .title{position: absolute;width: 100%;color: #fff;font-size: 18px;text-align: center;top: 164px;}
  .bh-platform .line{position: absolute;width:52px;height:2px;background-color: #484980;top: 207px;left: 109px;}
  .bh-platform .font{position: absolute;width: 144px;color: #7475B2;font-size: 12px;top: 229px;left: 63px;
    line-height: 17px;}

  /*买入卖出*/
  .bhBuyBox{min-height:270px;background:rgba(20,20,69,1);border-radius:4px;border:2px solid rgba(31,35,94,1);
    margin: 80px 0;padding: 20px 18px;box-sizing: border-box;-webkit-box-sizing:border-box;}
  .bhBuyBox ul{position: relative;width: 100%;height: 100%;}
  .bhBuyBox ul li{position: relative;float: left;width:580px;height:46px;line-height:46px;background:rgba(28,29,79,1);border-bottom: 1px solid #161646;
    box-sizing: border-box;-webkit-box-sizing:border-box;}
  .dollar{position: absolute;width: 25px;height: 30px;left: 20px;top: 8px;}
  .buy{position: absolute;left: 55px;font-size: 16px;color: #fff;font-weight: 400;}
  .time{color: #646E9D;font-size: 12px;font-weight: 400;margin-left: 10px;}
  .bh-buy .before{position: absolute;min-width:160px;height:24px;background-color: #33396F;border-radius:2px;
    top: 11px;right: 20px;line-height: 24px;text-align: center;color: #9A9EC7;font-size: 14px;font-weight: 400;}

</style>
