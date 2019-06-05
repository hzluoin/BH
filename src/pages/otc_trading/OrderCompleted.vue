<template>
  <div class="order_completed">
    <div v-if="orderList.length" v-loading="loading">
      <el-table :data="orderList" border>
        <el-table-column prop="id" label="订单" align="center" min-width="135"></el-table-column>
        <el-table-column prop="merchant" label="交易人" align="center"></el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.exchangeTypeName}}</span><br>
            <span>{{scope.row.coin}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payTypeName" label="支付方式" align="center"></el-table-column>
        <el-table-column prop="price" label="价格(CNY)" align="center"></el-table-column>
        <el-table-column prop="number" label="数量" align="center"></el-table-column>
        <el-table-column prop="amount" label="金额(CNY)" align="center"></el-table-column>
        <el-table-column label="下单时间" align="center" min-width="95">
          <template slot-scope="scope">
            <span>{{scope.row.createDate}}</span><br>
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="付款时间" align="center" min-width="95">
          <template slot-scope="scope">
            <span>{{scope.row.payDate}}</span><br>
            <span>{{scope.row.payTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="放币时间" align="center" min-width="95">
          <template slot-scope="scope">
            <span>{{scope.row.goodsDate}}</span><br>
            <span>{{scope.row.goodsTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center"></el-table-column>
        <el-table-column label="评价" align="center" width="180%">
          <template slot-scope="scope">
            <el-rate v-model="scope.row.rate" :max="3" :texts="['差评','中评','好评']" :colors="['#F7BA2A', '#F7BA2A', '#F7BA2A']" show-text @change="rating(scope.row.rate, scope.row)" :disabled="!scope.row.rateable">
            </el-rate>
          </template>
        </el-table-column>
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
                <el-tooltip class="item" effect="dark" content="什么是黑名单？" placement="top-end">
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
            :page-size="5"
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
          type: 2,
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
        newOrder.payTypeName = this.Status.convert('Pay', order['oPayType'])
        newOrder.price = this.NumberFormat.toFixed(new BigNumber(order['oCapitalCount']).div(new BigNumber(order['oCoinCount'])), 4)
        newOrder.number = this.NumberFormat.toFixed(order['oCoinCount'], 8)
        newOrder.amount = this.NumberFormat.toFixed(order['oCapitalCount'], 4)
        newOrder.createDate = new Date(order['oCreateTime']).format('yyyy-MM-dd')
        newOrder.createTime = new Date(order['oCreateTime']).format('hh:mm:ss')
        newOrder.payDate = new Date(order['oPayTime']).format('yyyy-MM-dd')
        newOrder.payTime = new Date(order['oPayTime']).format('hh:mm:ss')
        newOrder.goodsDate = new Date(order['oSendGoodsTime']).format('yyyy-MM-dd')
        newOrder.goodsTime = new Date(order['oSendGoodsTime']).format('hh:mm:ss')
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
    // 信任/拉黑
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
    // 评价
    rating (rate, order) {
      this.loading = true
      // 禁止再次评论
      this.$set(order, 'rateable', false)
      // 提交评价等级
      this.$http.post('/orderComment/addUI', {
        orderNo: order.id + '',
        type: rate === 1 ? 3 : rate === 3 ? 1 : rate,
        content: ' . '
      }).then(response => {
        this.loading = false
        switch (response.body.code) {
          case 'E7401':
            this.$message.error('订单号不能为空')
            break
          case 'E7402':
            this.$message.error('评价等级不能为空')
            break
          case 'E7403':
            this.$message.error('评价描述不能为空')
            break
          case 'E7404':
            this.$message.error('添加失败')
            break
          case '200':
            this.$message.success('评论成功')
            return
        }
        // 撤销评论结果
        this.$set(order, 'rateable', true)
        order.rate = 0
      }, response => {
        this.loading = false
        // 撤销评论结果
        this.$set(order, 'rateable', true)
        order.rate = 0
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

  .order_completed .disabled {
    cursor: not-allowed;
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
