<template>
  <div class="bh-root">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bg-F4FBFF ft16 color-0BB2FE">我的订单</span>
      </el-col>
    </el-row>

    <!--小标题-->
    <el-row>
      <el-col :span="24">
        <span class="ft16" :class="{'color-666': selected==='ongoing'}" @click="select('ongoing')">进行中订单</span>
        <span class="ft16" :class="{'color-666': selected==='completed'}" @click="select('completed')">已完成订单</span>
        <span class="ft16" :class="{'color-666': selected==='cancel'}" @click="select('cancel')">取消订单</span>
        <i :class="{ongoing: selected==='ongoing',completed: selected==='completed',cancel: selected==='cancel'}"></i>
      </el-col>
    </el-row>

    <!--订单呢-->
    <el-row>
      <el-col :span="24">
        <el-table :data="orders" border style="width: 100%">
          <el-table-column prop="oCode" label="订单编号" align="center" width="140"></el-table-column>
          <el-table-column label="时间" align="center" width="110">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.oCreateTime).format('yyyy-MM-dd')}}</span><br>
              <span>{{new Date(scope.row.oCreateTime).format('hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" width="60">
            <template slot-scope="scope">
              <span>{{parseInt(scope.row.oBuyerId) === parseInt(userId) ? '买入' : parseInt(scope.row.oSellerId) === parseInt(userId) ? '卖出' : '类型错误'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oStatus" label="状态" align="center" width="80">
            <template slot-scope="scope">
              <span>
                <!--1 待付款2.待确认收款 3.已收款,待放币 4.平台已放币,待确认收币 5.商家放币 ,待确认收币  6.收币完成 7.超时取消 8.手动取消-->
                {{scope.row.oStatus === '1' ? '待付款' : scope.row.oStatus === '2' ? '待确认收款' : scope.row.oStatus === '3' ? '已收款,待放币' : scope.row.oStatus === '4' ? '平台已放币,待确认收币' : scope.row.oStatus === '5' ? '商家放币 ,待确认收币' : scope.row.oStatus === '6' ? '收币完成' : scope.row.oStatus === '7' ? '超时取消' : scope.row.oStatus === '8' ? '手动取消' : scope.row.oStatus === '9' ? '投诉中' : scope.row.oStatus === '10' ? '付款超时' : '状态错误'}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="价格(CNY)" align="center">
            <template slot-scope="scope">
              <!--<span>{{Number(scope.row.oCapitalCount / scope.row.oCoinCount).cut(2)}}&nbsp;{{scope.row.oCapitalType === '1' ? 'CNY' : 'USD'}}</span>-->
              <span>{{Number(scope.row.oCapitalCount / scope.row.oCoinCount).cut(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="oCoinCount" label="数量" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(scope.row.oCoinCount, 8)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易金额(CNY)" align="center">
            <template slot-scope="scope">
              <!--<span>{{Number(scope.row.oCapitalCount).cut(2)}}&nbsp;{{scope.row.oCapitalType === '1' ? 'CNY' : 'USD'}}</span>-->
              <span>{{Number(scope.row.oCapitalCount).cut(4)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="60">
            <template slot-scope="scope">
              <el-col  style="color:#8ed8fa;cursor: pointer;"><span @click="showDetail(scope.row)">查看</span></el-col>
              <el-col  style="color:#8ed8fa;cursor: pointer;"><span @click="$router.push({path: '/otc_trading#order'})">去处理</span></el-col>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!--翻页呢-->
    <el-row>
      <el-col :span="24" style="text-align: right;margin-top: 20px;">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="5"
          :total="totalCount"
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>

    <order-detail :visible.sync="showOrderDetail" :orderDetail="orderDetail" v-if="showOrderDetail"></order-detail>
  </div>
</template>

<script>
import OrderDetail from './dialog/OrderDetail'
export default {
  components: {
    OrderDetail
  },
  data () {
    return {
      orders: [],
      totalCount: 0,
      currentPage: 1,
      selected: 'ongoing',
      showOrderDetail: false,
      orderDetail: null
    }
  },
  computed: {
    userId () {
      return this.$store.getters.getUser.userId
    }
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.query()
    },
    select (key) {
      this.orders = []
      this.totalCount = 0
      this.currentPage = 1
      switch (key) {
        case 'ongoing':
          this.selected = 'ongoing'
          break
        case 'completed':
          this.selected = 'completed'
          break
        case 'cancel':
          this.selected = 'cancel'
          break
      }
      this.query(this.selected)
    },
    // 订单查询
    query () {
      const type = this.selected === 'ongoing' ? 1 : this.selected === 'completed' ? 2 : this.selected === 'cancel' ? 3 : 1
      const pageNo = this.currentPage - 1
      this.$http.get('/orders/listUI', {
        params: {
          type: type,
          pageSize: 5,
          pageNo: pageNo
        }
      }).then(response => {
        this.orders = response.body.data
        this.totalCount = response.body.totalCount
      }, response => {
        this.totalCount = 0
      })
    },
    showDetail (orderDetail) {
      this.showOrderDetail = true
      this.orderDetail = orderDetail
    }
  },
  created () {
    this.query()
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
