<template>
  <div class="bh-root">
    <!--标题-->
    <el-row>
      <!--<el-col :span="24">-->
        <!--<span class="bg-F4FBFF ft16 color-0BB2FE">我的订单</span>-->
      <!--</el-col>-->
    </el-row>
    <!--小标题-->
    <el-row>
      <el-col :span="24">
        <span class="ft16" :class="{'color-666': selected==='law'}" @click="select('law')">法币交易账户</span>
        <!--<span class="ft16" :class="{'color-666': selected==='electronic'}" @click="select('electronic')">币币交易账户</span>-->
        <i :class="{law: selected==='law',electronic: selected==='electronic'}"></i>
      </el-col>
    </el-row>
    <!--搜索导航栏-->
    <el-row style="width: 100%;margin:30px 0 15px 0;height: 26px;line-height: 26px;">
      <el-col :span="8" style="width:150px;height:26px;margin:0 60px 0 0px;">
        <div>
          <input v-model="searchKey" type="text" placeholder="币种搜索" class="le-input-size">
        </div>
      </el-col>
      <el-col :span="8" style="width:100px; margin: 0 300px 0 0;">
        <div style="position: relative;">
          <el-checkbox v-model="showRichWalletList">隐藏0资产币种</el-checkbox>
        </div>
      </el-col>
      <el-col :span="8" style="width:305px;">
        <span>
          当前总资产估值:
          <span style="color: #0bb2fe;cursor: pointer;">{{totalMoney}}</span> &nbsp;{{isCNY?'CNY':'USD'}}
        </span>
        <!--<span style="margin-left: 50px;cursor: pointer;" v-if="isCNY">-->
          <!--<span style="color: #0bb2fe;" @click="isCNY=true">CNY</span><span>/</span><span @click="isCNY=false">USD</span>-->
        <!--</span>-->
        <!--<span style="margin-left: 50px;cursor: pointer;" v-else>-->
          <!--<span @click="isCNY=true">CNY</span><span>/</span><span style="color: #0bb2fe;" @click="isCNY=false">USD</span>-->
        <!--</span>-->
      </el-col>
    </el-row>
    <!--订单呢-->
    <el-row>
      <el-col :span="24">
        <el-table :data="showData" border style="width: 100%">
          <el-table-column prop="dictionariesId" label="币种" align="center" width="60"></el-table-column>
          <el-table-column prop="balance" label="数量" align="center"></el-table-column>
          <el-table-column prop="availableBalance" label="可用" align="center"></el-table-column>
          <el-table-column prop="frozenAmount" label="下单冻结" align="center"></el-table-column>
          <el-table-column :label="isCNY?'资产估值(CNY)':'资产估值(USD)'" align="center">
            <template slot-scope="scope">
              <span :ref="scope.row.dictionariesId" v-if="isCNY">{{NumberFormat.toFixed(calculate(scope.row.dictionariesId, scope.row.balance), 4)}}</span>
              <span :ref="scope.row.dictionariesId" v-else>{{NumberFormat.toFixed(convert('USD', calculate(scope.row.dictionariesId, scope.row.balance)), 4)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" align="center" width="240">
            <template slot-scope="scope">
              <el-button  type="primary" round size="mini" @click="topUp(scope.row.dictionariesId)">
                <span>充币</span>
              </el-button>
              <el-button type="primary" round size="mini" @click="mention(scope.row.dictionariesId)">
                <span>提币</span>
              </el-button>
              <el-button round type="primary" size="mini" @click="exchange(scope.row.dictionariesId)">
                <span>交易</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'MyAssets',
  data () {
    return {
      // 复选框选定
      showRichWalletList: false,
      tableData: null,
      // 搜索关键字筛选后数据
      showData: null,
      selected: 'law',
      // 默认单位人民币
      isCNY: true,
      // 搜索条件
      searchKey: ''
    }
  },
  computed: {
    totalMoney () {
      let total = 0
      for (let i in this.tableData) {
        total += this.$store.getters.calculate(this.tableData[i].dictionariesId, this.tableData[i].balance)
      }
      if (!this.isCNY) {
        total = this.$store.getters.convert('USD', total)
      }
      return this.NumberFormat.toFixed(total, 4)
    },
    walletList () {
      return this.$store.getters.getWalletList
    },
    richWalletList () {
      return this.$store.getters.getRichWalletList
    },
    calculate () {
      return this.$store.getters.calculate
    },
    convert () {
      return this.$store.getters.convert
    }
  },
  watch: {
    showRichWalletList (newValue) {
      if (newValue) {
        this.tableData = this.richWalletList
      } else {
        this.tableData = this.walletList
      }
      this.showData = this.tableData
      // 重新通过关键字筛选
      if (this.searchKey) {
        const list = []
        for (let i in this.tableData) {
          if (new RegExp(this.searchKey.toLowerCase()).test(this.tableData[i].dictionariesId.toString().toLowerCase())) {
            list.push(this.tableData[i])
          }
        }
        this.showData = list
      }
    },
    searchKey (val) {
      if (val) {
        const list = []
        for (let i in this.tableData) {
          if (new RegExp(val.toLowerCase()).test(this.tableData[i].dictionariesId.toString().toLowerCase())) {
            list.push(this.tableData[i])
          }
        }
        this.showData = list
      } else {
        this.showData = this.tableData
      }
    }
  },
  methods: {
    topUp (coin) {
      this.$router.push({name: 'TopUp', params: {coin: coin}})
    },
    mention (coin) {
      this.$router.push({name: 'MentionMoney', params: {coin: coin}})
    },
    exchange (coin) {
      this.$router.push({name: 'OtcTrading', params: {coin: coin}})
    },
    select (key) {
      switch (key) {
        case 'law':
          this.query()
          this.selected = 'law'
          break
        case 'electronic':
          this.tableData = []
          this.selected = 'electronic'
          break
      }
    }
  },
  created () {
    this.$store.dispatch('qryAllWallet').then(() => {
      this.tableData = this.walletList
      this.showData = this.tableData
    }, () => {})
  }
}
</script>

<style scoped>
  /*路由的标题*/
  .bh-root .el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
  }

  .bh-root .el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
  }

  /*小标题*/
  .bh-root .el-row:nth-child(2) {
    height: 38px;
    line-height: 38px;
    border-bottom: 3px solid #D8D8D8;
    margin-top: 6px;
    margin-bottom: 10px;
    position: relative;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .bh-root .el-row:nth-child(2) span {
    display: inline-block;
    width: 146px;
    height: 100%;
    text-align: center;
    cursor: pointer;
  }

  .bh-root .el-row:nth-child(2) i {
    display: inline-block;
    width: 146px;
    height: 3px;
    background-color: #0BB2FE;
    position: absolute;
    bottom: -3px;
    left: 0;
    -webkit-transition: all 400ms ease;
    -moz-transition: all 400ms ease;
    -ms-transition: all 400ms ease;
    -o-transition: all 400ms ease;
    transition: all 400ms ease;
  }

  .bh-root .el-row:nth-child(2) i.law {
    left: 0;
  }
  .bh-root .el-row:nth-child(2) i.electronic {
    -webkit-transform: translateX(100%);
    -moz-transform: translateX(100%);
    -ms-transform: translateX(100%);
    -o-transform: translateX(100%);
    transform: translateX(100%);
  }

  /*翻页器*/
  .bh-root .el-row:last-child {
    text-align: right;
    margin-top: 15px;
  }
  /*button样式*/
  .el-button{
    line-height: 0;
  }
  .bh-btn_plain {
    color: #0BB2FE;
    background-color: #FFF;
    /*border: 1px solid #0BB2FE;*/
    min-width: 0px;
    height: 21px;
  }
 /*币种搜索*/
  .le-input-size{
    border:0.5px solid #d8d8d8;
    border-radius:100px;
    width:149px;
    height:25px;
  }
</style>
