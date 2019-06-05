<template>
  <div class="bh-root">
    <!--标题-->
    <el-row>
      <el-col :span="24">
        <span class="bg-F4FBFF ft16 color-0BB2FE">我的交易广告</span>
      </el-col>
    </el-row>

    <!--小标题-->
    <el-row style="width: 600px;">
      <el-col :span="24">
        <span class="ft16" :class="{'color-666': selected==='ALL'}" @click="select('ALL')">全部币种</span>
        <span class="ft16" :class="{'color-666': selected==='BTC'}" @click="select('BTC')">BTC</span>
        <span class="ft16" :class="{'color-666': selected==='ETH'}" @click="select('ETH')">ETH</span>
        <span class="ft16" :class="{'color-666': selected==='GXC'}" @click="select('GXC')">GXC</span>
        <span style="cursor: not-allowed" class="ft16" :class="{'color-666': selected==='More'}">{{/BTC|ETH|GXC/.test(currencyCode) ? '' : currencyCode}}</span>
        <i :class="{all: selected==='ALL',btc: selected==='BTC',eth: selected==='ETH',gxs: selected==='GXC',more: selected==='More'}"></i>
      </el-col>
      <el-col style="width:20%;margin-top: -35px;position: relative;left: 758px;">
        <el-select v-model="currencyCode" filterable placeholder="搜索币种" style="border:0 solid #d8d8d8;width:153px;height:22px;line-height: 22px;" @change="select(currencyCode)">
          <el-option
            v-for="item in platformCoinDetailList"
            :key="item.symbol"
            :label="item.symbol"
            :value="item.symbol">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <!--选择-->
    <el-row style="margin-top: 20px;width: 100%;">
      <!--全选-->
      <el-col :span="8" style="margin-left: 4px;">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange" :disabled="!(allList && allList.length)">全选</el-checkbox>
      </el-col>
      <!--下架广告-->
      <el-col :span="4" style="margin:0 0px 20px 326px;">
        <button style="border:0.5px solid #0bb2fe;border-radius:4px;width:121px;height:25px;padding: 0;background: #FFFFFF;" :disabled="!(isIndeterminate || checkAll)" @click="unShelve(checkedAds)">
          <span style="font-size:12px;color:#0bb2fe;">下架所选交易广告</span>
        </button>
      </el-col>
      <!--删除广告-->
      <el-col :span="4" style="margin-left: 30px;">
        <button style="border:0.5px solid #0bb2fe;border-radius:4px;width:121px;height:25px;padding: 0;background: #FFFFFF;" @click="remove(checkedAds)" :disabled="!(isIndeterminate || checkAll)">
          <span style="font-size:12px;color:#0bb2fe;">删除所选交易广告</span>
        </button>
      </el-col>
    </el-row>
    <!--订单呢-->
    <el-row>
      <el-col :span="24">
        <el-checkbox-group v-model="checkedAds" @change="handleCheckedAdsChange">
          <el-table :data="allList" v-loading="loading" border>
            <el-table-column prop="choice" label="选择" align="center" width="45">
              <template slot-scope="scope">
                <el-checkbox :label="scope.row.id" class="bh-checkbox"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="currency" label="币种" align="center" width="60"></el-table-column>
            <el-table-column prop="expirationTime" label="到期时间" align="center" style="position: relative" min-width="95">
              <template slot-scope="scope">
                <span>{{new Date(scope.row.createDate + 1296000000).format('yyyy-MM-dd')}}</span><br>
                <span>{{new Date(scope.row.createDate + 1296000000).format('hh:mm:ss')}}</span>
                <div v-if="+new Date() - scope.row.createDate > 1209600000" style="position: absolute;bottom: 0;right: 0;width: 100%;height: 20px;background-color: red;"></div>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center" width="50">
              <template slot-scope="scope">
                <span>{{scope.row.businType === 1 ? '买入' : scope.row.businType === 2 ? '卖出' : '未知'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="stockQuantity" label="库存" align="center"></el-table-column>
            <el-table-column prop="price" label="价格(CNY)" align="center">
              <template slot-scope="scope">
                <span>{{Number(scope.row.price).cut(3)}}</span>
                <!--<span>{{scope.row.priceCurrencyType === 1 ? 'CNY' : 'USD'}}</span>-->
              </template>
            </el-table-column>
            <el-table-column label="交易限额(CNY)" align="center" min-width="110">
              <template slot-scope="scope">
                <!--<span>{{Number(scope.row.startAmount)}}-{{Number(scope.row.endAmount)}}&nbsp;{{scope.row.priceCurrencyType === 1 ? 'CNY' : 'USD'}}</span>-->
                <span>{{Number(scope.row.startAmount)}}-{{Number(scope.row.endAmount)}}</span>
              </template>
            </el-table-column>
            <el-table-column label="支付方式" align="center" width="70">
              <template slot-scope="scope">
                <span v-if="/1/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../../assets/images/owechat.svg"></span>
                <span v-if="/2/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../../assets/images/oalipay.svg"></span>
                <span v-if="/3/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../../assets/images/obank.svg"></span>
                <span v-if="/4/.test(scope.row.payType)"><img style="width:16px;height:15px;" src="../../../assets/images/opaypal.svg"></span>
              </template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="50">
              <template slot-scope="scope">
                <span>{{scope.row.status === 0 ? '过期' : scope.row.status === 1 ? '有效' : scope.row.status === 2 ? '下架' : '未知'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="tranAmount" label="成交量" align="center"></el-table-column>
            <el-table-column prop="tranCount" label="交易订单" align="center" width="70"></el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                  <el-col :span="8">
                    <span style="color:#8ed8fa;cursor: pointer;" @click="edit(scope.row)">编辑</span>
                  </el-col>
                  <el-col :span="8">
                    <el-tooltip class="item" effect="dark" content="广告链接复制成功后，立即分享给你的好友吧。"  placement="top-end" style="">
                      <button class="bh-btn_text share" style="color: rgb(142, 216, 250);" @click="shareId=scope.row.id" :disabled="scope.row.status!==1">分享</button>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="8">
                    <span style="color:#8ed8fa;cursor: pointer;" @click="remove([scope.row.id + ''])">删除</span>
                  </el-col>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </el-col>
    </el-row>

    <!--翻页呢-->
    <el-row>
      <el-col :span="24">
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
    <!--广告编辑-->
    <advertisement-editor :advertising="advertising" :visible.sync="advertisementEditor" v-if="advertisementEditor" @success="query"></advertisement-editor>
  </div>
</template>

<script>
import AdvertisementEditor from './dialog/AdvertisementEditor'
import ClipboardJS from 'clipboard'
export default {
  components: {
    AdvertisementEditor
  },
  data () {
    return {
      user: this.$store.getters.getUser,
      // 列表加载状态
      loading: false,
      // 数据查询条件
      currencyCode: '',
      businType: '',
      // 全选
      checkAll: false,
      isIndeterminate: false,
      // 广告编辑
      advertisementEditor: false,
      // 所有广告数据
      allList: [],
      // 币种列表
      coins: [
        {
          label: 'BTC',
          value: 'BTC'
        }
      ],
      // 所有广告ID
      allAdIds: [],
      // 已选广告
      checkedAds: [],
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      selected: 'ongoing',
      currentPage: 1,
      totalCount: 0,
      // 当前需要编辑的广告
      advertising: {},
      // 要分享的广告ID
      shareId: 0
    }
  },
  computed: {
    url () {
      return window.location.host + '/otc_trading?type=id&id=' + window.btoa(this.shareId.toString())
    },
    platformCoinDetailList () {
      return this.$store.getters.getOtcCoin
    }
  },
  methods: {
    // 全选
    handleCheckAllChange (val) {
      this.checkedAds = val ? this.allAdIds : []
      this.isIndeterminate = false
    },
    // 单选
    handleCheckedAdsChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.allAdIds.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allAdIds.length
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.query()
    },
    select (key) {
      this.currentPage = 1
      this.totalCount = 0
      this.selected = /ALL|BTC|ETH|GXC/.test(key) ? key : 'More'
      this.currencyCode = key.replace(/^ALL$/, '')
      this.query()
    },
    // 查询广告数据
    query () {
      this.allList = []
      this.allAdIds = []
      this.checkedAds = []
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/findBusByUserIdUI',
        data: {
          currencyCode: this.currencyCode || '',
          businType: this.businType || '',
          pageSize: 5,
          pageNo: this.currentPage - 1 || 0
        }
      }).then(response => {
        this.allAdIds = []
        this.allList = response.body.data
        for (let i in this.allList) {
          this.allAdIds.push(this.allList[i].id)
        }
        this.checkAll = false
        this.isIndeterminate = false
        this.totalCount = response.body.totalCount
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 下架
    unShelve (id) {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/bussinssResource/merchandiseUI',
        data: {
          id: id
        }
      }).then(response => {
        this.loading = false
        this.query()
      }, response => {
        this.loading = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
        this.query()
      })
    },
    // 删除
    remove (idList) {
      this.$confirm('确定删除广告吗?', '删除交易广告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.loading = true
        this.$store.dispatch('encryptConnection', {
          url: '/bussinssResource/deleteBatchResUI',
          data: {
            id: idList
          }
        }).then(response => {
          this.loading = false
          this.query()
        }, response => {
          this.loading = false
          this.query()
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      }).catch(() => {})
    },
    // 广告编辑
    edit (advertising) {
      this.advertisementEditor = true
      this.advertising = advertising
    }
  },
  created () {
    this.query()
    const clipboard = new ClipboardJS('.share', {
      text: () => {
        return this.url
      },
      target: () => {
        const input = document.createElement('input')
        input.setAttribute('value', '')
        return input
      }
    })
    clipboard.on('success', e => {
      this.$message.success('分享链接复制成功')
    })
    clipboard.on('error', e => {
      this.$message.success('分享链接复制失败')
    })
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
    width: 78px;
    height: 100%;
    text-align: center;
    cursor: pointer;
  }

  .bh-root .el-row:nth-child(2) i {
    display: inline-block;
    width: 80px;
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

  .bh-root .el-row:nth-child(2) i.all {
    left: 0;
  }
  .bh-root .el-row:nth-child(2) i.btc {
    -webkit-transform: translateX(100%);
    -moz-transform: translateX(100%);
    -ms-transform: translateX(100%);
    -o-transform: translateX(100%);
    transform: translateX(100%);
  }
  .bh-root .el-row:nth-child(2) i.eth {
    -webkit-transform: translateX(200%);
    -moz-transform: translateX(200%);
    -ms-transform: translateX(200%);
    -o-transform: translateX(200%);
    transform: translateX(200%);
  }
  .bh-root .el-row:nth-child(2) i.gxs {
    -webkit-transform: translateX(300%);
    -moz-transform: translateX(300%);
    -ms-transform: translateX(300%);
    -o-transform: translateX(300%);
    transform: translateX(300%);
  }
  .bh-root .el-row:nth-child(2) i.more {
    -webkit-transform: translateX(400%);
    -moz-transform: translateX(400%);
    -ms-transform: translateX(400%);
    -o-transform: translateX(400%);
    transform: translateX(400%);
  }

  /*翻页器*/
  .bh-root .el-row:last-child {
    text-align: right;
    /*margin-top: 24px;*/
  }
  .el-col-4 {
    width: 13.66667%;
  }
  /*到期提醒*/
  .bh-div-size{
    background:#f55858;
    width:48px;
    height:18px;
    line-height: 18px;
  }
  /*即将到期*/
  .bh-span-size{
    width:39px;
    height:14px;
    font-size:8px;
    color:#ffffff;
    letter-spacing:-0.47px;
  }
</style>
