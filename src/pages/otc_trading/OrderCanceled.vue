<template>
  <div class="order_completed">
    <div v-if="orderList.length !== 0" v-loading="loading">
      <el-table :data="orderList" border>
        <el-table-column prop="id" label="订单" align="center" min-width="135"></el-table-column>
        <el-table-column prop="merchant" label="交易人" align="center"></el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.exchangeTypeName}}</span><br>
            <span>{{scope.row.coin}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格(CNY)" align="center"></el-table-column>
        <el-table-column prop="number" label="数量" align="center"></el-table-column>
        <el-table-column prop="amount" label="金额(CNY)" align="center"></el-table-column>
        <el-table-column label="下单时间" align="center" min-width="95">
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span><br>
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="取消时间" align="center" min-width="95">
          <template slot-scope="scope">
            <span>{{scope.row.cancelDate}}</span><br>
            <span>{{scope.row.cancelTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column prop="character" label="操作" align="center" width="150%">
          <template slot-scope="scope">
            <el-row style="margin-left: 10px;text-align: center;">
              <el-col :span="8" class="pointer">
                <div @click="addList(scope.row.merchantId, '2')">
                  <p style="margin: 0;"><img class="bh-icon_hover" src="../../assets/images/hmd.svg" style="width: 17px; height: 20px;"></p>
                  <p><span>拉黑</span></p>
                </div>
              </el-col>
              <el-col :span="8" class="pointer">
                <div @click="addList(scope.row.merchantId, '1')">
                  <p style="margin: 0;"><img class="bh-icon_hover" src="../../assets/images/mdl.svg" style="width: 17px; height: 20px;"></p>
                  <p><span>信任</span></p>
                </div>
              </el-col>
              <el-col :span="8">
                <el-tooltip class="item" effect="dark" content="什么是黑名单？"  placement="top-end" style="">
                  <a target="_blank" href="https://8bihui.zendesk.com/hc/zh-cn/community/posts/360022580692-2-5-%E5%90%8D%E5%8D%95%E7%AE%A1%E7%90%86"><img class="bh-icon_hover" src="../../assets/images/hello_1.svg" style="width: 14px; height: 14px;"></a>
                </el-tooltip>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
      <!--翻页呢-->
      <el-row style="text-align: right;margin-top: 30px;">
      <el-col :span="24">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="6"
          :total="totalCount"
          layout="total, prev, pager, next, jumper">
        </el-pagination>
      </el-col>
    </el-row>
    </div>
    <!--暂无订单信息-->
    <div class="bh-order_none" v-else>
      <img src="../../assets/images/order.svg">
      <span class="ft18 color-666">暂无订单信息</span>
      <span class="ft12 color-999">温馨提示：超过三笔取消订单，将被冻结当天下单权限。</span>
    </div>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js'
export default {
  data () {
    return {
      loading: false,
      orderList: [],
      totalCount: 0,
      currentPage: 0
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  methods: {
    // 查询已完成订单
    qryOrderList (pageNo) {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/orders/listUI',
        data: {
          type: 3,
          pageSize: 6,
          pageNo: pageNo || 0
        }
      }).then(response => {
        this.totalCount = response.body.totalCount
        this.orderList = this.refactorOrderList(response.body.data)
        this.loading = false
      }, response => {
        this.loading = false
      })
    },
    // 处理已完成的订单数据
    refactorOrderList (list) {
      const newList = []
      for (let i in list) {
        const order = list[i]
        const newOrder = {}
        newOrder.id = order['oCode']
        newOrder.merchantId = order['oBuyerId'] === this.user.userId ? order['oSellerId'] : order['oBuyerId']
        newOrder.merchant = order['oBuyerId'] === this.user.userId ? order['sellNickName'] : order['buyNickName']
        newOrder.exchangeTypeName = order['oBuyerId'] === this.user.userId ? '买入' : '卖出'
        newOrder.coin = order['oCoinType']
        newOrder.price = this.NumberFormat.toFixed(new BigNumber(order['oCapitalCount']).div(new BigNumber(order['oCoinCount'])), 4)
        newOrder.number = this.NumberFormat.toFixed(order['oCoinCount'], 8)
        newOrder.amount = this.NumberFormat.toFixed(order['oCapitalCount'], 4)
        newOrder.createDate = new Date(order['oCreateTime']).format('yyyy-MM-dd')
        newOrder.createTime = new Date(order['oCreateTime']).format('hh:mm:ss')
        newOrder.cancelDate = new Date(order['oUpdateTime']).format('yyyy-MM-dd')
        newOrder.cancelTime = new Date(order['oUpdateTime']).format('hh:mm:ss')
        newOrder.status = this.Status.convert('Order', order['oStatus'])
        newOrder.rateable = false
        if (/^1$/.test(order['commentType'])) {
          newOrder.rate = 3
        } else if (/^2$/.test(order['commentType'])) {
          newOrder.rate = 2
        } else if (/^3$/.test(order['commentType'])) {
          newOrder.rate = 1
        } else {
          newOrder.rate = 0
          newOrder.rateable = true
        }
        newList.push(newOrder)
      }
      return newList
    },
    // 信任
    addList (id, type) {
      this.loading = true
      this.$http.post('/userTrust/addUserTrustById', {
        trustUserId: id + '',
        type: type
      }).then(response => {
        this.$message.success('添加成功')
        this.loading = false
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          case 'E2801':
            this.$message.error('不可重复添加')
            break
          default:
            this.$message.error(response.body.msg)
        }
        this.loading = false
      })
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.qryOrderList(this.currentPage - 1)
    }
  },
  created () {
    this.qryOrderList(this.currentPage)
  }
}
</script>

<style scoped>
  .order_completed {
    position: relative;
  }

  .order_completed .pointer {
    cursor: pointer;
  }

  /*暂无订单信息*/
  .bh-order_none {
    text-align: center;
    padding-top: 45px;
    padding-bottom: 42px;
  }
  .bh-order_none img {
    width: 51px;
    height: 74px;
    margin-bottom: 20px;
  }
  .bh-order_none span {
    display: block;
    margin-top: 6px;
  }
</style>
