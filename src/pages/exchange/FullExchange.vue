<template>
  <div class="fullExchange">
    <!--导航 60px-->
    <navigation class="bh-nav"></navigation>
    <!--头部 40px-->
    <div class="full-headBox divBgColor center-lr-scatter">
      <div class="w90 center-float-left">
        <!--币种选择-->
        <el-dropdown :hide-timeout="3000000">
          <span class="el-dropdown-link">
            CWV/BTC<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <!--写在style里样式才显示-->
          <el-dropdown-menu slot="dropdown" style="width: 529px;height: 408px;padding: 0;margin: 0;border: 0;">
            <el-dropdown-item>
              <full-select-dialog class="dialogShowBox"></full-select-dialog>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <ul class="numberUl center-float-left">
          <li>
            <div>0.00005032<span class="ml10">¥1.22</span></div>
            <div class="ft12 font1">最新成交价</div>
          </li>
          <li>
            <div>-0.28%</div>
            <div class="ft12 font1">24小时涨跌幅</div>
          </li>
          <li>
            <div>0.00005032</div>
            <div class="ft12 font1">24小时最高</div>
          </li>
          <li>
            <div>0.00005032</div>
            <div class="ft12 font1">24小时最低</div>
          </li>
          <li>
            <div>1,087,613</div>
            <div class="ft12 font1">24小时成交量</div>
          </li>
        </ul>
      </div>
    </div>
    <!--content-->
    <div class="contentAll">
      <!--content1 min-height:445px;-->
      <div class="full-contentBox1 right-float-top" :style="mainStyle">
        <!--左边 k线图-->
        <div class="leftBox mr4">
          <div class="h50"></div>
        </div>
        <!--右边 买卖价格-->
        <div class="rightBox1 mr4">
          <div class="h50 center-float-center ft16 color-fff">
            <img src="../../assets/images/exChange/img1.png">盘口
          </div>
          <div class="divBgColor1 center-tb-scatter">
            <!--切换排列按钮-->
            <ul class="btnUl">
              <li class="center-float-center" :class="{'btn_on1':btnUl === 0}" @click="plBtnUl(0)">
                <el-tooltip class="item" effect="light" content="深" placement="bottom-start" :open-delay="600">
                  <img src="../../assets/images/exChange/btn1.png">
                </el-tooltip>
              </li>
              <li class="center-float-center" :class="{'btn_on1':btnUl === 1}" @click="plBtnUl(1)">
                <el-tooltip class="item" effect="light" content="买" placement="bottom-start" :open-delay="600">
                  <img src="../../assets/images/exChange/btn2.png">
                </el-tooltip>
              </li>
              <li class="center-float-center" :class="{'btn_on1':btnUl === 2}" @click="plBtnUl(2)">
                <el-tooltip class="item" effect="light" content="卖" placement="bottom-start" :open-delay="600">
                  <img src="../../assets/images/exChange/btn3.png">
                </el-tooltip>
              </li>
            </ul>
            <!--表格-->
            <table class="table">
              <tr :style="lineH">
                <th>价格(BTC)</th>
                <th>数量(BIX)</th>
                <th>时间</th>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index" :style="lineH">
                <td>{{item.date}}</td>
                <td>{{item.name}}</td>
                <td>{{item.address}}</td>
              </tr>
            </table>
            <div class="centerBox" :style="lineH">0.06688750 ≈ 0.0662 CNY</div>
            <table class="table">
              <tr v-for="(item, index) in tableData" :key="index" :style="lineH">
                <td>{{item.date}}</td>
                <td>{{item.name}}</td>
                <td>{{item.address}}</td>
              </tr>
            </table>
          </div>
        </div>
        <div class="rightBox2">
          <div class="h50 center-float-center ft16 color-fff">
            <img src="../../assets/images/exChange/img2.png">最新成交
          </div>
          <div class="divBgColor1 center-tb-scatter">
            <ul class="btnUl1 tbc-lr-scatter">
              <li @click="ownBtnUl(0)" :class="{'btn_on btn_on1':btnUl1 === 0}" class="cur ft14 bold">我的</li>
              <li @click="ownBtnUl(1)" :class="{'btn_on btn_on1':btnUl1 === 1}" class="cur ft14 bold">市场</li>
            </ul>
            <!--表格-->
            <table class="table">
              <tr :style="lineH">
                <th>价格(BTC)</th>
                <th>数量(BIX)</th>
                <th>时间</th>
              </tr>
              <tr v-for="(item, index) in tableData" :key="index" :style="lineH">
                <td>{{item.date}}</td>
                <td>{{item.name}}</td>
                <td>{{item.address}}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <!--content2 338px-->
      <div class="full-contentBox2 right-float-top">
        <!--左边 限价委托，计划委托-->
        <div class="leftBox mr4 weiTuoBox">
          <div class="h50 center-lr-scatter">
            <div class="center-float-left ft16">
              <a class="center-float-left ml20 mr20" @click="weiTuoBtn(0)" :class="{'btn_on':!isIndex}">
                <img :src="phb_one">限价委托
              </a>
              <a class="center-float-left" @click="weiTuoBtn(1)" :class="{'btn_on':isIndex}">
                <img :src="phb_two">计划委托
              </a>
            </div>
            <div class="center-float-left ft14">
              <div class="ml20 mr20">
                <el-checkbox v-model="checked">只看当前交易币种记录</el-checkbox></div>
              <a class="mr20">查看更多</a>
            </div>
          </div>
          <div class="weiTuoBox1">
            <!--表格-->
            <el-table :data="tableData">
              <el-table-column prop="date" label="时间"></el-table-column>
              <el-table-column prop="name" label="市场"></el-table-column>
              <el-table-column prop="address" label="方向"></el-table-column>
              <el-table-column prop="date" label="触发价格"></el-table-column>
              <el-table-column prop="name" label="委托价格"></el-table-column>
              <el-table-column prop="address" label="委托数量"></el-table-column>
              <el-table-column prop="date" label="委托金额"></el-table-column>
              <el-table-column prop="name" label="状态"></el-table-column>
              <el-table-column label="操作" width="37" align="center">
                <template slot-scope="scope">
                  <div v-if="scope.row.cz === '撤单'" class="btn_on btn_on2 cur">撤单</div>
                  <div v-else>成功</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!--右边 限价委托，计划委托买入卖出-->
        <div class="rightBox3">
          <div class="h50 center-float-left">
            <a class="center-float-left ml20 mr20" @click="weiTuoBtn(2)" :class="{'btn_on':!isIndex1}">
              <img :src="phb_three">限价委托
            </a>
            <a class="center-float-left" @click="weiTuoBtn(3)" :class="{'btn_on':isIndex1}">
              <img :src="phb_four">计划委托
            </a>
          </div>
          <ul class="weiTuoUl top-lr-scatter">
            <li>
              <div class="green ft16 center-lr-scatter">买入CWV<span class="color-fff ft12">BTC 可用：0.00000000</span></div>
              <!--触发价格-->
              <div class="input" v-if="isIndex1">
                <span class="textAll text1">触发价格</span>
                <el-input></el-input>
                <span class="textAll text2">BTC</span>
              </div>
              <!--委托价格-->
              <div class="input" v-if="isIndex1">
                <span class="textAll text1">委托价格</span>
                <el-input ></el-input>
                <span class="textAll text2">BTC</span>
              </div>
              <!--买价-->
              <div class="input" v-if="!isIndex1">
                <span class="textAll text1">买价</span>
                <el-input></el-input>
                <span class="textAll text2">BTC</span>
              </div>
              <!--数量-->
              <div class="input">
                <span class="textAll text1">数量</span>
                <el-input @focus="isFocus" @blur="isFocus"></el-input>
                <span class="textAll text2">CWV</span>
              </div>
              <div class="blackPup" v-show="countIndex">
                <div class="text1">最多可买</div>
                <span class="btn_on text3">0.000 BTC</span>
              </div>
              <!--百分比-->
              <div class="percent">
                <div class="font1 ft12 cur" @click="percentOne(0)" :class="{'btn_on':percentIndex === 0}">25%</div>
                <div class="font1 ft12 cur" @click="percentOne(1)" :class="{'btn_on':percentIndex === 1}">50%</div>
                <div class="font1 ft12 cur" @click="percentOne(2)" :class="{'btn_on':percentIndex === 2}">75%</div>
                <div class="font1 ft12 cur" @click="percentOne(3)" :class="{'btn_on':percentIndex === 3}">100%</div>
              </div>
              <!--金额-->
              <div class="font1 ft14 center-lr-scatter mt10">金额<span class="color-fff ft16">0.00000000 BTC</span></div>
              <!--按钮-->
              <button class="buttonAll button1 mt10 color-fff ft16">买入</button>
            </li>
            <li>
              <div class="red ft16 center-lr-scatter">卖出CWV<span class="color-fff ft12">BTC 可用：0.00000000</span></div>
              <!--触发价格-->
              <div class="input" v-if="isIndex1">
                <span class="textAll text1">触发价格</span>
                <el-input></el-input>
                <span class="textAll text2">BTC</span>
              </div>
              <!--委托价格-->
              <div class="input" v-if="isIndex1">
                <span class="textAll text1">委托价格</span>
                <el-input></el-input>
                <span class="textAll text2">BTC</span>
              </div>
              <!--买价-->
              <div class="input" v-if="!isIndex1">
                <span class="textAll text1">买价</span>
                <el-input></el-input>
                <span class="textAll text2">BTC</span>
              </div>
              <!--数量-->
              <div class="input">
                <span class="textAll text1">数量</span>
                <el-input @focus="isFocus1" @blur="isFocus1"></el-input>
                <span class="textAll text2">CWV</span>
              </div>
              <div class="blackPup" v-show="countIndex1">
                <div class="text1">最多可买</div>
                <span class="btn_on text3">0.000 BTC</span>
              </div>
              <!--百分比-->
              <div class="percent">
                <div class="font1 ft12 cur" @click="percentOne(4)" :class="{'btn_on':percentIndex === 4}">25%</div>
                <div class="font1 ft12 cur" @click="percentOne(5)" :class="{'btn_on':percentIndex === 5}">50%</div>
                <div class="font1 ft12 cur" @click="percentOne(6)" :class="{'btn_on':percentIndex === 6}">75%</div>
                <div class="font1 ft12 cur" @click="percentOne(7)" :class="{'btn_on':percentIndex === 7}">100%</div>
              </div>
              <!--金额-->
              <div class="font1 ft14 center-lr-scatter mt10">金额<span class="color-fff ft16">0.00000000 BTC</span></div>
              <!--按钮-->
              <button class="buttonAll button2 mt10 color-fff ft16">卖出</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MenuSelect from '../../components/MenuSelect'
import AssetsManagement from '../../components/AssetsManagement'
import FullSelectDialog from './dialog/FullSelectDialog'
import Navigation from '../../components/Navigation'
export default {
  name: 'fullExchange',
  components: {
    FullSelectDialog,
    AssetsManagement,
    MenuSelect,
    Navigation
  },
  data () {
    return {
      tableData: [{
        date: '0.00005233',
        name: '1,400.0000',
        address: '13:11:13',
        cz: '撤单'
      }, {
        date: '0.00005233',
        name: '1,400.0000',
        address: '13:11:13',
        cz: '成功'
      }, {
        date: '0.00005233',
        name: '1,400.0000',
        address: '13:11:13',
        cz: '成功'
      }, {
        date: '0.00005233',
        name: '1,400.0000',
        address: '13:11:13',
        cz: '成功'
      }, {
        date: '0.00005233',
        name: '1,400.0000',
        address: '13:11:13',
        cz: '成功'
      }],
      // 点击的下标
      btnUl: 0,
      btnUl1: 0,
      // document.body.clientHeight网页可见区域高
      clientHeight: 0,
      // navigation(定死60px) full-headBox(定死40px),full-contentBox2(定死338px)和间隙(定死8px)的高度
      divHeight: (60 + 40 + 338 + 8),
      // content1Height  min-height
      minHeight: 445,
      // content1Height  计算得到的height
      content1Height1: 0,
      // 50px的title + 32px的图标
      height1: (50 + 32),
      // 背景图片路径替换
      phbBg: [
        {
          'on': require('../../assets/images/exChange/img4_on.png'),
          'no': require('../../assets/images/exChange/img4.png')
        },
        {
          'on': require('../../assets/images/exChange/img3_on.png'),
          'no': require('../../assets/images/exChange/img3.png')
        }
      ],
      phb_one: '',
      phb_two: '',
      phb_three: '',
      phb_four: '',
      isIndex: false,
      isIndex1: false,
      //  单选按钮
      checked: true,
      // 是否显示最多可买提示
      countIndex: false,
      countIndex1: false,
      // 百分比下标
      percentIndex: 0
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    isRegister () {
      return /Register/.test(this.$route.name)
    },
    mainStyle () {
      let content1Height = this.clientHeight - this.divHeight
      if (content1Height <= this.minHeight) {
        content1Height = this.minHeight
      }
      this.publicFun(content1Height)
      return 'height:' + content1Height + 'px;'
    },
    lineH () {
      let lineH = (this.content1Height1 - this.height1) / 14
      return 'height:' + lineH + 'px;' + 'line-height:' + lineH + 'px;'
    }
  },
  methods: {
    publicFun (_let) {
      this.content1Height1 = _let
    },
    plBtnUl (_value) {
      this.btnUl = _value
    },
    ownBtnUl (_value) {
      this.btnUl1 = _value
    },
    weiTuoBtn (_value) {
      switch (_value) {
        case 0:
          this.recoverCss()
          this.isIndex = false
          this.phb_one = this.phbBg[0]['on']
          break
        case 1:
          this.recoverCss()
          this.isIndex = true
          this.phb_two = this.phbBg[1]['on']
          break
        case 2:
          this.recoverCss1()
          this.isIndex1 = false
          this.phb_three = this.phbBg[0]['on']
          break
        default:
          this.recoverCss1()
          this.isIndex1 = true
          this.phb_four = this.phbBg[1]['on']
      }
    },
    recoverCss () {
      this.phb_one = this.phbBg[0]['no']
      this.phb_two = this.phbBg[1]['no']
    },
    recoverCss1 () {
      this.phb_three = this.phbBg[0]['no']
      this.phb_four = this.phbBg[1]['no']
    },
    // 是否显示最多可买
    isFocus () {
      this.countIndex = !this.countIndex
    },
    isFocus1 () {
      this.countIndex1 = !this.countIndex1
    },
    // 百分比
    percentOne (_value) {
      this.percentIndex = _value
    }
  },
  created () {
    // 初始化高度
    this.clientHeight = document.body.clientHeight
    // 初始化图片
    this.phb_one = this.phbBg[0]['on']
    this.phb_two = this.phbBg[1]['no']
    this.phb_three = this.phbBg[0]['on']
    this.phb_four = this.phbBg[1]['no']
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.clientHeight = document.body.clientHeight
    })
  }
}
</script>

<style scoped>
  /*页面背景色*/
  .fullExchange{background-color: #080934;}
  /*块级背景色*/
  .divBgColor{background-color: #0F103A;}
  .divBgColor1{padding: 0 10px 0 10px;}
  .fullExchange img{width: 100%;display: block;position: relative;}
  .w90{width: 90%;}
  .w10{width: 10%;}
  /*头部 50px*/
  .h50{height: 50px;background-color: #0F103A;}
  .mr4{margin-right: 4px;}
  .red{color: #F55858;}
  .green{color: #02C087;}

  /*头部*/
  .full-headBox{width: 100%;height: 40px;}
  .numberUl{position: relative;width: 44%;}
  .numberUl li{position: relative;float: left;text-align:center;color: #fff;width: 25%;font-size: 14px;color: #fff;}
  .font1{color: #77799C;}
  .fullExchange button.bh-btn_text.active{color: #0BB2FE;border-bottom: 1px solid #0BB2FE;height: 22px !important;padding: 0;border-radius: 0;}
  .fullExchange button.bh-btn_text.active:hover {font-weight: bold;}
  .bh-menu{position: relative;right: 4%;}
  /*content*/
  .contentAll{position: relative;height: auto;top:0;left: 0;width: 100%;}
  .full-contentBox1{margin: 4px 4px 0 4px;min-height:445px;}
  .full-contentBox2{margin: 4px 4px 0 4px;height:338px;}

  /*k线图*/
  .leftBox{min-width:830px;width: 100%;background-color: #17173B;position: relative;top: 0;left:0;}
  .rightBox1,.rightBox2{width: 260px;min-width: 260px;max-width: 260px;position: relative;background-color:#17173B;}
  .rightBox3{width: 524px;min-width: 524px;max-width: 524px;position: relative;background-color:#17173B;color: #fff;font-size: 16px;}

  .h50 img{position: relative;width: 10%;margin-right: 5px;}
  .btnUl{position: relative;width: 100%;top: 0;left: 0;/*padding: 2% 0;*/height: 32px;}
  .btnUl li{position: relative;width: 40px;height: 30px;float: left;cursor: pointer;}
  .btnUl li img{width: 20px;height: 15px;}
  .centerBox{position: relative;color: #fff;width: 100%;text-align: center;/*margin: 2% 0;*/height: 20px;line-height: 20px;}

  .btnUl1{position: relative;width: 100%;border-bottom: 1px solid #2A2A4A;height: 36px;margin-bottom: 3%;}
  .btnUl1 li{position: relative;float: left;width: 80px;text-align: center;color: #fff;line-height:35px;}
  .fullExchange .btn_on{color: #0BB2FE;}
  .fullExchange .btn_on1{border-bottom: 2px solid #0BB2FE;}
  .fullExchange .btn_on2{border: 1px solid #0bb2fe;text-align: center;}

  .weiTuoBox{color: #fff;font-size: 16px;}
  .weiTuoBox1{padding: 10px 10px;}
  .weiTuoBox .h50 img,.rightBox3 .h50 img{width: 20%;margin: 0 4px;}

  .weiTuoUl{position: relative;height: 288px;padding: 0 19px 0 19px;}
  .weiTuoUl li{position: relative;width: 233px;float: left;height: 100%;}

  .fullExchange .input{height: 44px;width: 100%;background-color: #252548;position: relative;margin-top: 8px;}
  .textAll{position: absolute;color: #77799C;z-index: 1;height: 100%;line-height: 44px;top: 0;}
  .text1{width: 75px;left: 0;text-align: left;padding-left: 6px;}
  .text2{width: 50px;right: 0;text-align: right;padding-right: 6px;}
  .text3{position: absolute;top:0;text-align: center;width: 100%;}

  .fullExchange .buttonAll{width:100%;height:44px;border-radius:2px;position: relative;border: 0;}
  .fullExchange .button1{background-color: #02C087;}
  .fullExchange .button2{background-color: #F55858;}

  .blackPup{position: absolute;width: 100%;z-index: 111;font-size: 12px;background-color: #080934;}
  .percent{width:100%;height:26px;border-radius:2px;margin-top: 8px;border:1px dashed #2D2E53;}
  .percent div{position: relative;width: 25%;float: left;text-align: center;line-height: 26px;}

  /*table*/
  .fullExchange .table{width: 100%;}
  .fullExchange .table tr{color: #77799C;font-size: 12px;background-color: transparent;border: 0;line-height: 30px;height: 30px;}
  .fullExchange .table td{color: #fff;font-size: 12px;}
  .fullExchange .table tr:hover>td{background-color:#080934;}

  .dialogShowBox{padding: 20px 20px;}
</style>
