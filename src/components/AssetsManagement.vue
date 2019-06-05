<template>
  <div class="bh-root" :class="{'bh-assets-management': showDropdown}">
    <div class="bh-select_input">
      <button class="bh-btn_text" @click="$router.push({name: 'MyAssets'})">资产管理</button>
      <!--<i class="iconfont icon-sanjiaoxing-up bh-iconfont"></i>-->
    </div>
    <div class="bh-body">
      <el-row  style="height:28px;border:1px solid #d8d8d8;">
        <el-col style="line-height:28px;background-color:#f4f4f4;text-align: center;cursor: pointer;" >
          <span>账户总资产：<span style="color:#0bb2fe;">{{NumberFormat.toFixed(totalMoney, 4)}}</span>{{showCNY ? 'CNY' : 'USD'}}</span>&nbsp;&nbsp;
          <span>可用：<span style="color:#0bb2fe;">{{NumberFormat.toFixed(totalMoney - frozenTotalMoney, 4)}}</span>{{showCNY ? 'CNY' : 'USD'}}</span>&nbsp;&nbsp;
          <span>冻结：<span style="color:#0bb2fe;">{{NumberFormat.toFixed(frozenTotalMoney, 4)}}</span>{{showCNY ? 'CNY' : 'USD'}}</span>&nbsp;&nbsp;
          <!--<span :class="{'bh-color_select': showCNY}" @click="showCNY=!showCNY">CNY</span><span :class="{'bh-color_select': !showCNY}" @click="showCNY=!showCNY">/USD</span>-->
        </el-col>
      </el-row>
      <el-row  style="text-align: center;background-color:#f4f4f4;" v-loading="committing">
        <el-col  style="border:1px solid #d8d8d8; border-bottom: 0;">
          <el-table  :data="tableData" height="150" class="bh-table_header-white bh-table_body-whites">
            <el-table-column prop="dictionariesId" label="币种" align="center"></el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.balance}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="availableAmount" label="可用余额" align="center">
              <template slot-scope="scope">
                <span>{{NumberFormat.toFixed(scope.row.availableAmount, 8)}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="frozenAmount" label="冻结数量" align="center">
              <template slot-scope="scope">
                <span>{{NumberFormat.toFixed(scope.row.frozenAmount, 8)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="height:45px;line-height: normal;border:1px solid #d8d8d8; border-top:0;background-color: white;border-bottom-right-radius:3px;border-bottom-left-radius:3px;">
        <el-col :span="6" style="height: 100%;line-height: 45px;">
          <button class="bh-btn_plain" @click="goTo('TopUp')">充币</button>
        </el-col>
        <el-col :span="6" style="height: 100%;line-height: 45px;">
          <button class="bh-btn_plain" @click="goTo('MentionMoney')">提币</button>
        </el-col>
        <el-col :span="6" style="height: 100%;line-height: 45px;">
          <button class="bh-btn_plain" @click="goTo('MoneyRecord')">交易记录</button>
        </el-col>
        <el-col :span="6" style="height: 100%;line-height: 45px;">
          <button class="bh-btn_plain" @click="refreshData" :disabled="committing">刷新</button>
        </el-col>
      </el-row>
   </div>
  </div>
</template>

<script>
export default {
  name: 'AssetsManagement',
  data () {
    return {
      showCNY: true,
      showDropdown: true,
      committing: false
    }
  },
  computed: {
    totalMoney () {
      let total = 0
      for (let i in this.tableData) {
        total += this.$store.getters.calculate(this.tableData[i].dictionariesId, this.tableData[i].balance)
      }
      if (!this.showCNY) {
        total = this.$store.getters.convert('USD', total)
      }
      return total
    },
    frozenTotalMoney () {
      let frozenTotal = 0
      const calculate = this.$store.getters.calculate
      for (let i in this.tableData) {
        frozenTotal += calculate(this.tableData[i].dictionariesId, this.tableData[i].frozenAmount)
      }
      if (!this.showCNY) {
        frozenTotal = this.$store.getters.convert('USD', frozenTotal)
      }
      return frozenTotal
    },
    tableData () {
      return this.$store.getters.getWalletList
    }
  },
  methods: {
    goTo (key) {
      switch (key) {
        case 'TopUp':
          this.$router.push({name: 'TopUp'})
          break
        case 'MentionMoney':
          this.$router.push({name: 'MentionMoney'})
          break
        case 'MoneyRecord':
          this.$router.push({name: 'MoneyRecord'})
          break
      }
    },
    refreshData () {
      window.location.reload()
    }
  },
  created () {
    this.committing = true
    this.$store.dispatch('qryAllWallet').then(() => {
      this.committing = false
    }, () => {
      this.committing = false
    })
  }
}
</script>

<style scoped>
.bh-root{
  width: 80px;
  height: 20px;
  padding: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
.bh-select_input{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
}
.bh-select_input:hover {
  cursor: pointer;
}

.bh-select_input .bh-btn_text {
  width: 64px;
  font-size: 16px;
  position: absolute;
  left: 0;
}

.bh-select_input>i {
  width: 16px;
  height: 20px;
  line-height: 20px;
  position: absolute;
  top: 0;
  right: 0;
  color: #8C8C8F;
  -webkit-transition: all 500ms;
  -moz-transition: all 500ms;
  -ms-transition: all 500ms;
  -o-transition: all 500ms;
  transition: all 500ms;
  -webkit-transform: rotate(180deg) ;
  -moz-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  transform: rotate(180deg);
}

.bh-body{
  position: absolute;
  width: 494px;
  height: 0;
  overflow: hidden;
  text-align: center;
  margin-top: 30px;
  margin-left: -414px;
  z-index: 5;
  border-radius:3px;
  -webkit-transition: all 200ms;
  -moz-transition: all 200ms;
  -ms-transition: all 200ms;
  -o-transition: all 200ms;
  transition: all 200ms;
}
.bh-assets-management:hover .bh-body{
  /*height: 267px;*/
  height: 0px;
}

.bh-assets-management:hover .bh-select_input i {
  -webkit-transform: rotate(0deg) ;
  -moz-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -o-transform: rotate(0deg);
  transform: rotate(0deg);
}
.bh-btn_plain {
  border-radius: 9999px;
  width: 75px;
  height: 25px;
  display: inline-block;
  vertical-align: middle;
}
</style>
