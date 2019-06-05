<template>
  <div class="bh-root">
    <div v-loading="loading" >
      <!--标题-->
      <el-row>
        <el-col :span="24">
          <span class="bg-F4FBFF ft16 color-0BB2FE">充币</span>
        </el-col>
      </el-row>

      <el-row style="line-height: 34px;">
        <el-col :span="3">
          <span class="ft14 color-333">充值币种</span>
        </el-col>
        <el-col :span="8">
          <el-select v-model="coin" @change="createQRCode">
            <el-option
              v-for="item in topUpCoin"
              :key="item.symbol"
              :label="item.symbol"
              :value="item.symbol">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row style="line-height: 34px;">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">钱包地址</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" :value="walletAddress" id="foo"></el-input>
        </el-col>
        <el-col :span="8">
          <button id="copy"  data-clipboard-target="#foo" style="margin-left: 20px;" class="bh-btn_text bh-color_hover ft14 bh-align-vertical__middle">复制钱包地址</button>
        </el-col>
      </el-row>

      <el-row style="line-height: 34px;" v-if="hasRemarks">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">Memo(备注)</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" v-model="remarks" disabled></el-input>
        </el-col>
      </el-row>

      <el-row style="line-height: 34px;" v-if="hasRemarks">
        <el-col :span="8" :offset="3">
          <span class="bh-color_prompt ft14 bh-align-vertical__middle">Memo(备注)不填或填错，将导致充值不成功。</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="3">
          <span class="ft14 color-333">地址二维码</span>
        </el-col>
        <el-col :span="8">
          <div ref="svg" style="width: 125px;height: 125px"></div>
        </el-col>
      </el-row>
    </div>

    <!--温馨提示-->
    <el-row>
      <el-col :span="24">
        <span class="ft16 bh-color_prompt">
          <i class="iconfont icon-tanhao"></i>
          温馨提示
        </span>
        <span class="ft14 bh-color_prompt">
          1、禁止充值除{{coin}}之外的其他资产，任何非{{coin}}资产充值将不可找回。
        </span>
        <span class="ft14 bh-color_prompt">
          2、往该地址充值，汇款完成，等待网络自动确认后系统自动到账。
        </span>
        <span class="ft14 bh-color_prompt">
          3、为了快速到账，充值时可以适当提高网络手续费。
        </span>

      </el-col>
    </el-row>

    <!--充币记录-->
    <el-row style="position: relative;" >
      <el-col><span style="width:56px;height:20px;display:inline-block;margin: 60px 0 8px 0;font-size:14px;color:#666666;">充币记录</span></el-col>
      <el-col><span style="position:absolute;width:56px;height:20px;display:inline-block;margin:-28px 0 0 856px;font-size:14px;color:#8ed8fa;cursor: pointer;" @click="$router.push({name: 'MoneyRecord'})">所有记录</span></el-col>
      <el-col :span="24" >
        <el-table :data="topUpRecordList" border>
          <el-table-column label="充币时间" align="center">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.createDate).format('yyyy-MM-dd')}}</span><br>
              <span>{{new Date(scope.row.createDate).format('hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="currency" label="币种" align="center"></el-table-column>
          <el-table-column prop="toAddress" label="充币地址" align="center" width="430"></el-table-column>
          <el-table-column prop="quantity" label="充币数量" align="center"></el-table-column>
          <el-table-column label="充币状态" align="center">
            <template slot-scope="scope">
              <span>{{Status.convert('TopUpRecord', scope.row.status)}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import qrImage from 'qr-image'
import ClipboardJS from 'clipboard'
export default {
  data () {
    return {
      // 当前所选币种
      coin: '',
      // 充币记录列表
      topUpRecordList: [],
      // 二维码生成中
      loading: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    // 可充币详情列表
    topUpCoin () {
      const topUpCoin = this.$store.getters.getTopUpCoin
      const wallet = this.$store.getters.getWalletJson
      const newTopUpCoin = {}
      for (let key in wallet) {
        // 筛选可充币的数据
        if (topUpCoin[key]) {
          newTopUpCoin[key] = {}
          newTopUpCoin[key]['symbol'] = topUpCoin[key]['symbol']
          newTopUpCoin[key]['hasRemark'] = topUpCoin[key]['isRemark']
          newTopUpCoin[key]['address'] = wallet[key]['path']
        }
      }
      return newTopUpCoin
    },
    // 当前所选币种的充币地址
    walletAddress () {
      return this.topUpCoin[this.coin] ? this.topUpCoin[this.coin]['address'] : ''
    },
    // 当前所选币种的充币地址二维码
    walletAddressQRCode () {
      return qrImage.imageSync(this.walletAddress, { type: 'svg' })
    },
    // 当前所选币种是否需要备注
    hasRemarks () {
      return this.topUpCoin[this.coin] ? this.topUpCoin[this.coin]['hasRemark'] : ''
    },
    // 当前所选币种的备注
    remarks () {
      return this.user.userId
    }
  },
  mounted () {
    // 1.创建复制按钮
    const clipboard = new ClipboardJS('#copy')
    clipboard.on('success', e => {
      this.$message.success('复制成功')
    })
    // 2.设置默认币种:带参查询或者列表第一项
    this.coin = this.$route.params['coin']
    for (let key in this.topUpCoin) {
      this.coin = this.coin || key
      break
    }
    // 3.创建二维码
    this.createQRCode()
    // 充币记录
    this.$store.dispatch('encryptConnection', {
      url: '/assetRecord/queryAssetRecordListUI',
      data: {
        type: '4',
        pageSize: '5',
        pageNo: '0'
      }
    }).then(response => {
      this.topUpRecordList = response.body.data
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
      }
    })
  },
  methods: {
    createQRCode () {
      this.$refs.svg.innerHTML = ''
      if (this.walletAddress) {
        this.$refs.svg.innerHTML = this.walletAddressQRCode.toString()
      } else {
        this.loading = true
        this.$store.dispatch('createWallet', {
          coin: this.coin
        }).then(response => {
          this.loading = false
        }, response => {
          this.loading = false
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  /*丧心病狂*/
  .bh-root>div:first-child {
    margin-bottom: 40px;
    border: 1px solid #D8D8D8;
    border-radius: 2px;
    padding-bottom: 37px;
  }

  /*标题*/
  .bh-root>div:first-child>.el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
    margin: 0;
  }

  .bh-root>div:first-child>.el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
  }

  /*行高，input宽度*/
  .bh-root>div:first-child .el-row {
    min-height: 34px;
    margin-top: 20px;
    padding-left: 8px;
  }
  .bh-root>div:first-child .el-col {
    min-height: 34px;
  }

  .bh-root>div:first-child .el-input, .bh-root>div:first-child .el-select {
    width: 300px;
    height: 34px;
  }

  /*温馨提示*/
  .bh-root>.el-row:nth-child(2) {
    padding: 20px 12px;
    background: #fff5f0;
  }
  .bh-root>.el-row:nth-child(2) .el-col-24>span {
    display: inline-block;
    width: 100%;
    min-height: 20px;
    word-wrap: break-word;
    word-break: break-word;
  }
  .bh-root>.el-row:nth-child(2) .el-col-24>span:first-child {
    margin-bottom: 4px;
  }

  /*充币记录*/
  .bh-root>.el-row:last-child {
    margin-top: 20px;
  }
</style>
