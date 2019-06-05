<template>
  <div class="bh-root">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bg-F4FBFF ft16 color-0BB2FE">资金记录</span>
      </el-col>
    </el-row>

    <!--标题选择导航-->
    <div style="width: 100%; height:60px;">
      <div style="margin-left: 12px;">
        <el-col :span="6" style="margin-top:18px; ">
          <span style="font-size: 14px;">币种</span>&nbsp;
          <el-select v-model="selectedCoin" style="width: 79px; height: 26px;">
            <el-option
              v-for="(item, key) in coinList"
              :key="key"
              :label="key"
              :value="key">
            </el-option>
          </el-select>
        </el-col>
      </div>
      <div>
        <el-col :span="6" style="margin:18px 0 0 -100px;">
          <span style="font-size: 14px;">交易类型</span>&nbsp;
          <el-select v-model="exchangeType" placeholder="全部" style="width: 110px; height: 26px;">
            <el-option
              v-for="item in exchangeTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </div>
      <div>
        <el-col :span="6">
          <el-date-picker
            v-model="date"
            type="daterange"
            align="center"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            style="width: 300px;height: 32px; padding: 0; margin-top: 16px;padding-left: 15px;">
          </el-date-picker>
        </el-col>
      </div>
      <el-col :span="6" style="width: 320px;">
        <button  style="margin: 18px 0 0 130px;height: 30px;" class="bh-btn_plain" @click="query(0)">查询</button>
        <button  style="margin-left: 30px;height: 30px;" class="bh-btn_plain" @click="download">下载报表</button>
      </el-col>
    </div>
    <!--订单呢-->
    <el-row>
      <el-col :span="24">
        <el-table :data="moneyRecordList" border style="width: 100%" :fit="true">
          <el-table-column prop="currency" label="币种" align="center" width="60"></el-table-column>
          <el-table-column label="时间" align="center" width="95">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.date).format('yyyy-MM-dd')}}</span><br>
              <span>{{new Date(scope.row.date).format('hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易类型" align="center" width="95">
            <template slot-scope="scope">
              <span>{{Status.convert('MoneyRecord', scope.row.businType)}}</span>
            </template>businType
          </el-table-column>
          <el-table-column prop="quantity" label="交易数量" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(scope.row.quantity, 8)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="platformfee" label="交易手续费" align="center">
            <template slot-scope="scope">
              <span>
                <!--{{new BigNumber(scope.row.platformfee).plus(new BigNumber(scope.row.cost)).toNumber().cut(8)}}-->
                {{NumberFormat.toFixed(new BigNumber(scope.row.platformfee).plus(new BigNumber(scope.row.cost)).toNumber(), 8)}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="balance" label="资产余额" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(new BigNumber(scope.row.balance), 8).toNumber()}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易估值(CNY)" align="center">
            <template slot-scope="scope">
              <!--<span>{{Number(scope.row.dealAssess).cut(2)}}&nbsp;{{scope.row.priceType || 'CNY'}}</span>-->
              <span>{{Number(scope.row.dealAssess).cut(4)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="资产估值(CNY)" align="center">
            <template slot-scope="scope">
              <!--<span>{{Number(scope.row.assetAaess).cut(2)}}&nbsp;{{scope.row.priceType || 'CNY'}}</span>-->
              <span>{{Number(scope.row.assetAaess).cut(4)}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作" align="center" >-->
            <!--<template slot-scope="scope">-->
              <!--<el-col  style="color:#8ed8fa;cursor: pointer;">查看</el-col>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-col>
    </el-row>

    <!--翻页呢-->
    <el-row>
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-size="5"
          :total="totalCount"
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'MoneyRecord',
  data () {
    return {
      // 当前所选币种
      selectedCoin: '全部',
      // 交易类型列表(7活动奖励,8提币审核失败恢复钱包余额不在这里)
      exchangeTypeList: [
        {
          label: '全部',
          value: 0
        }
      ],
      // 交易类型
      exchangeType: 0,
      // 资金记录列表
      moneyRecordList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 交易日期
      date: '',
      // 当前页
      currentPage: 1,
      // 数据总数
      totalCount: 0,
      temp: false
    }
  },
  computed: {
    coinList () {
      return this.$store.getters.getAllCoinDetail
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.query(this.currentPage - 1)
    },
    query (pageNo) {
      // 准备查询参数
      const currencyCode = this.selectedCoin === '全部' ? '' : this.selectedCoin
      const type = this.exchangeType === 0 ? '' : this.exchangeType + ''
      let beginDate = null
      let endDate = null
      if (this.date) {
        beginDate = this.date[0].format('yyyy-MM-dd 00:00:00')
        endDate = this.date[1].format('yyyy-MM-dd 23:59:59')
      }
      // 重置已有数据
      this.moneyRecordList = []
      this.$store.dispatch('encryptConnection', {
        url: '/assetRecord/queryAssetRecordListUI',
        data: {
          assetStatus: '2',
          currencyCode: currencyCode,
          type: type,
          beginDate: beginDate,
          endDate: endDate,
          pageSize: '5',
          pageNo: pageNo + ''
        }
      }).then(response => {
        this.moneyRecordList = response.body.data
        this.totalCount = response.body.totalCount
      }, response => {
        this.totalCount = 0
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    download () {
      const currencyCode = this.selectedCoin === '全部' ? '' : this.selectedCoin
      const type = this.exchangeType === 0 ? '' : this.exchangeType + ''
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = '/api/server/assetRecord/downloadUI?currencyCode=' + currencyCode + '&type=' + type
      link.setAttribute('download', new Date().format('yyyy年MM月dd日') + '.xls')
      document.body.appendChild(link)
      link.click()
    }
  },
  created () {
    const moneyRecordList = require('../../assets/data/moneyRecord')
    for (let key in moneyRecordList) {
      this.exchangeTypeList.push({
        label: moneyRecordList[key],
        value: key
      })
    }
    this.query(this.currentPage - 1)
    if (this.sysPlatformCoinList) {
      this.platformCoinList = [{symbol: '全部'}]
      for (let i in this.sysPlatformCoinList) {
        this.platformCoinList.push(this.sysPlatformCoinList[i])
      }
    }
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

  .bh-root .el-row:nth-child(2) i.ongoing {
    left: 0;
  }
  .bh-root .el-row:nth-child(2) i.completed {
    -webkit-transform: translateX(100%);
    -moz-transform: translateX(100%);
    -ms-transform: translateX(100%);
    -o-transform: translateX(100%);
    transform: translateX(100%);
  }
  .bh-root .el-row:nth-child(2) i.cancel {
    -webkit-transform: translateX(200%);
    -moz-transform: translateX(200%);
    -ms-transform: translateX(200%);
    -o-transform: translateX(200%);
    transform: translateX(200%);
  }

  /*翻页器*/
  .bh-root .el-row:last-child {
    text-align: right;
    margin-top: 24px;
  }
</style>
