<template>
  <div class="" >
    <!--弹窗记录查看-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :width="676" :height="462">
      <div slot="body">
        <!--用户头像-->
        <el-row style="margin: 0 0 20px 278px;">
          <el-col style="display: block;width: 50px;height: 50px;"><img src="../../../../assets/images/headimg.png" alt="" style="border-radius: 50%;"></el-col>
        </el-row>
        <el-row style="margin: -52px 0 10px 350px;">
          <el-col><span></span></el-col>
          <el-col><span class="bh_color">{{username}}</span></el-col>
        </el-row>
        <!--导航明细-->
        <div style="margin:20px 0 20px 68px;">
        <el-row>
          <el-col :span="6" class="bh_color">交易次数</el-col>
          <el-col :span="6" class="bh_color">信任人数</el-col>
          <el-col :span="6" class="bh_color">好评度</el-col>
          <el-col :span="6" class="bh_color">支付付款方式</el-col>
        </el-row>
        <!--导航明细数据-->
        <el-row>
          <el-col :span="6">{{transactionNumber}}</el-col>
          <el-col :span="6">{{trustNumber}}</el-col>
          <el-col :span="6">{{praise}}</el-col>
          <el-col :span="6">
            <span v-if="/1/.test(payType)"><img style="width:16px;height:15px;" src="../../../../assets/images/owechat.svg"></span>
            <span v-if="/2/.test(payType)"><img style="width:16px;height:15px;" src="../../../../assets/images/oalipay.svg"></span>
            <span v-if="/3/.test(payType)"><img style="width:16px;height:15px;" src="../../../../assets/images/obank.svg"></span>
            <span v-if="/4/.test(payType)"><img style="width:16px;height:15px;" src="../../../../assets/images/opaypal.svg"></span>
          </el-col>
        </el-row>
        </div>
        <div style="width: 612px;border:1px solid #d8d8d8;margin-top: -8px;"></div>
        <!--数据明细表-->
        <div class="bh-order">
          <div class="bh-order_menu">
            <el-row style="margin: 30px 0 14px 0;">
              <el-col :span="24">
                <span class="ft16" :class="{'bh-color_select': selected==='ongoing'}" @click="select('ongoing')" style="font-size: 14px;display: inline-block; margin-right: 20px;cursor:pointer;">出售广告</span>
                <span class="ft16" :class="{'bh-color_select': selected==='completed'}" @click="select('completed')" style="font-size: 14px;display: inline-block; margin-right: 20px;cursor:pointer;">购买广告</span>
                <span class="ft16" :class="{'bh-color_select': selected==='cancel'}" @click="select('cancel')" style="font-size: 14px;cursor:pointer;">最近交易记录</span>
                <i :class="{ongoing: selected==='ongoing',completed: selected==='completed',cancel: selected==='cancel'}"></i>
              </el-col>
            </el-row>
          </div>
          <!--出售广告-->
          <div class="bh-order_ongoing" v-if="selected==='ongoing'">
            <el-row style="width: 615px;height: 192px;">
              <el-col :span="24">
                <el-table :data="tableData" border style="width: 100%" key="sell">
                  <el-table-column prop="currency" label="出售币种" align="center"></el-table-column>
                  <el-table-column label="收款币种" align="center">
                    <template slot-scope="scope">
                      <span>{{(scope.row.priceCurrencyType ? scope.row.priceCurrencyType.toString() : '').replace(/1/, 'CNY').replace(/2/, 'USD')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="出售单价" align="center"></el-table-column>
                  <el-table-column label="交易限额" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.startAmount}}-{{scope.row.endAmount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="发布时间" align="center" min-width="95">
                    <template slot-scope="scope">
                      <span>{{new Date(scope.row.createDate).format('yyyy-MM-dd')}}</span><br>
                      <span>{{new Date(scope.row.createDate).format('hh:mm:ss')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="广告状态" align="center">
                    <template slot-scope="scope">
                      <span>{{/0/.test(scope.row.status) ? '过期' : /1/.test(scope.row.status) ? '有效' : /2/.test(scope.row.status) ? '下架' : '状态未知'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <button class="bh-btn_plain" @click="exchange(scope.row.id)">交易</button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24" style="text-align: right;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="2"
                  :total="totalCount"
                  layout="total, prev, pager, next, jumper">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
          <!--购买广告-->
          <div class="bh-order_completed" v-else-if="selected==='completed'">
            <el-row style="width: 615px;height: 192px;">
              <el-col :span="24">
                <el-table :data="tableData" border style="width: 100%" key="buy">
                  <el-table-column prop="currency" label="购买币种" align="center"></el-table-column>
                  <el-table-column label="收款币种" align="center">
                    <template slot-scope="scope">
                      <span>{{(scope.row.priceCurrencyType ? scope.row.priceCurrencyType.toString() : '').replace(/1/, 'CNY').replace(/2/, 'USD')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="购买单价" align="center"></el-table-column>
                  <el-table-column label="交易限额" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.startAmount}}-{{scope.row.endAmount}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="发布时间" align="center" min-width="95">
                    <template slot-scope="scope">
                      <span>{{new Date(scope.row.createDate).format('yyyy-MM-dd')}}</span><br>
                      <span>{{new Date(scope.row.createDate).format('hh:mm:ss')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="广告状态" align="center">
                    <template slot-scope="scope">
                      <span>{{/0/.test(scope.row.status) ? '过期' : /1/.test(scope.row.status) ? '有效' : /2/.test(scope.row.status) ? '下架' : '状态未知'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                      <button class="bh-btn_plain" @click="exchange(scope.row.id)">交易</button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24" style="text-align: right;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="2"
                  :total="totalCount"
                  layout="total, prev, pager, next, jumper">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
          <!--最近交易记录-->
          <div class="bh-order_cancel" v-else-if="selected==='cancel'">
            <el-row style="width: 615px;height: 192px;">
              <el-col :span="24">
                <el-table :data="recordTableData" border style="width: 100%" key="record">
                  <el-table-column label="交易" align="center">
                    <template slot-scope="scope">
                      <span>{{/1|5/.test(scope.row.businType) ? '买入' : '卖出'}}{{scope.row.oCoinType}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评价" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.commentType === '3' ? '差评' : scope.row.commentType === '2' ? '中评' : scope.row.commentType === '1' ? '好评' : '未评价'}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评价时间" align="center" min-width="95">
                    <template slot-scope="scope">
                      <span v-if="scope.row.commentDate">{{new Date(scope.row.commentDate).format('yyyy-MM-dd')}}</span>
                      <span v-else>/</span>
                      <br>
                      <span v-if="scope.row.commentDate">{{new Date(scope.row.commentDate).format('hh:mm:ss')}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="评价用户" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.commentUser">
                        {{scope.row.commentUser || (/1|5/.test(scope.row.businType) ? (scope.row.sellname.length > 2 ? (scope.row.sellname[0] + '*' + scope.row.sellname.substring(2, scope.row.sellname.length)) : scope.row.sellname[0] + '*') : (scope.row.buyname.length > 2 ? (scope.row.buyname[0] + '*' + scope.row.buyname.substring(2, scope.row.buyname.length)) : scope.row.buyname[0] + '*'))}}
                      </span>
                      <span v-else>
                        /
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24" style="text-align: right;">
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="currentPage"
                  :page-size="2"
                  :total="totalCount"
                  layout="total, prev, pager, next, jumper">
                </el-pagination>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../../components/BHDialog'
export default {
  data () {
    return {
      selected: 'ongoing',
      // 加载状态
      loading: true,
      // 提交状态
      committing: false,
      // 商家交易数量
      transactionNumber: 0,
      // 商家信任人数
      trustNumber: 0,
      // 商家好评
      praise: '0%',
      // 商家支持的支付方式
      payType: '',
      // 平均付款时间
      avgPaytime: null,
      // 平均放币时间
      avgFbtime: null,
      historyQuantity: 4,
      // 交易价格
      price: 0,
      // 交易数量
      number: 0,
      // 交易金额
      amount: 0,
      // 卖家余额
      balance: 0,
      // 广告表格数据
      tableData: [],
      // 交易记录表格数据
      recordTableData: [],
      // 翻页参数: 总数，页数
      totalCount: 0,
      currentPage: 0
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    username: {
      type: String,
      default: ''
    },
    userId: {
      type: Number,
      default: 0
    }
  },
  components: {
    BhDialog
  },
  methods: {
    desensitizationName (source) {
      if (source.length < 3) {
        return source[0] + '*'
      } else {
        return source[0] + '*' + source[source.length - 1]
      }
    },
    select (key) {
      if (this.selected === key) {
        return
      }
      this.selected = ''
      this.tableData = []
      this.totalCount = 0
      this.currentPage = 0
      switch (key) {
        case 'ongoing':
          this.selected = 'ongoing'
          this.queryAd(this.userId, this.currentPage, 1)
          break
        case 'completed':
          this.selected = 'completed'
          this.queryAd(this.userId, this.currentPage, 2)
          break
        case 'cancel':
          this.selected = 'cancel'
          this.queryOrder(this.userId, this.currentPage)
          break
      }
    },
    exchange (id) {
      this.$router.push({
        name: 'OtcTrading',
        query: {
          type: 'id',
          id: window.btoa(id.toString())
        }
      })
    },
    handleCurrentChange (val) {
      console.error(this.selected, this.selected === 'cancel')
      let type = this.selected === 'ongoing' ? 1 : this.selected === 'completed' ? 2 : this.selected === 'cancel' ? false : this.selected
      this.currentPage = val
      if (type) {
        this.queryAd(this.userId, this.currentPage - 1, type)
      } else {
        this.queryOrder(this.userId, this.currentPage - 1)
      }
    },
    queryAd (userId, pageNo, type) {
      this.$http.post('/bussinssResource/findBusByUserIdUI', {
        userId: userId || 0,
        pageSize: 2,
        pageNo: pageNo || 0,
        businType: type || 1
      }).then(response => {
        this.totalCount = response.body.totalCount
        this.tableData = response.body.data
      }, response => {})
    },
    queryOrder (userId, pageNo) {
      this.$http.get('/orders/listUI', {
        params: {
          userId: userId,
          type: '2',
          pageSize: '2',
          pageNo: pageNo + ''
        }
      }).then(response => {
        this.recordTableData = response.body.data
        this.totalCount = response.body.totalCount
      }, response => {})
    }
  },
  created () {
    this.queryAd(this.userId, this.currentPage, 1)
    this.$http.post('/userinfo/findComprehensiveUI', {
      userId: this.userId + ''
    }).then(response => {
      const merchant = response.body.data
      this.transactionNumber = merchant.transationNumber || 0
      this.trustNumber = merchant.trustNumber || 0
      this.praise = merchant.praise || '100%'
      this.historyQuantity = merchant.historyQuantity || 0
      this.avgPaytime = merchant.avgPaytime || 0
      this.avgFbtime = merchant.avgFbtime || 0
      this.payType = merchant.payType || 0
      this.price = merchant.price || 0
      this.loading = false
      if (this.type) {
        this.balance = merchant.balance || 0
      }
    }, response => {})
  }
}
</script>

<style scoped>
  /*按钮样式*/
  .bh-btn_plain {
    color: #0BB2FE;
    background-color: #FFF;
    border: 1px solid #0BB2FE;
    min-width: 0px;
    width:43px;
    height:19px;
    border-radius:2px;
  }
  /*导航字体颜色*/
  .bh_color{
    color:#666666;
  }
</style>
