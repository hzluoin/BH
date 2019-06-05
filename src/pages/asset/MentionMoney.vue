<template>
  <div class="bh-root">
    <div v-loading="loading">
      <!--标题-->
      <el-row>
        <el-col :span="24">
          <span class="bg-F4FBFF ft16 color-0BB2FE">提币</span>
        </el-col>
      </el-row>
       <!--提币币种-->
      <el-row class="bh_height" style="margin-bottom: 26px;">
        <el-col :span="3">
          <span class="ft14 color-333">提币币种</span>
        </el-col>
        <el-col :span="8">
          <el-select v-model="coin" @change="coinChange">
            <el-option
              v-for="item in mentionCoin"
              :key="item.symbol"
              :label="item.symbol"
              :value="item.symbol">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
       <!--接收地址-->
      <el-row class="bh_height" style="margin-bottom: 26px;">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">接收地址</span>
        </el-col>
        <el-col :span="8">
          <el-select v-model="address">
            <el-option
              v-for="item in walletMentionAddressList"
              :key="item.address"
              :label="item.address"
              :value="item.address">
              <span style="float: left;">{{item.remark || '未命名'}}</span>
              <span style="float: left;margin-left: 20px">{{item.address}}</span>
              <span style="float: right;display: block;line-height: inherit;" class="el-icon-circle-close h100" @click="delWalletMentionAddress(item)"></span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8" >
          <button v-show="coin" style="margin-left: 20px;" class="bh-btn_text bh-color_hover ft14 bh-align-vertical__middle" @click="walletAddress=true">添加钱包地址</button>
        </el-col>
      </el-row>
      <!--备注-->
      <el-row class="bh_height" v-if="hasRemarks">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">Memo(备注)</span>
        </el-col>
        <el-col :span="8">
          <el-input v-model="remarks" disabled></el-input>
        </el-col>
      </el-row>
      <!--提币数量-->
      <el-row class="bh_height">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">提币数量</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" type="number" v-model="number" @focus="checkNumberFocus" @blur="checkNumberBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showNumberMsg">{{numberMsg}}</span>
          </transition>
        </el-col>
      </el-row>
      <p style="color:#999999;position: relative;top: -6px; left: 125px;">可提现额度:{{availableBalance}}&nbsp;&nbsp;&nbsp;&nbsp;暂不可提现:{{frozenBalance}}</p>
      <p style="color:#999999;position: relative;top: -6px; left: 125px;">最小提币数量:{{minNum}}&nbsp;&nbsp;&nbsp;&nbsp;最大提币数量:{{maxNum}}</p>
      <!--网络手续费-->
      <el-row class="bh_height">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">网络手续费</span>
        </el-col>
        <el-col :span="8">
          <el-input type="number" v-model="service" @focus="checkServiceFocus" @blur="checkServiceBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showServiceMsg">{{serviceMsg}}</span>
          </transition>
        </el-col>
        <!--<el-col :span="8">-->
          <!--<button class="bh-btn_text bh-color_hover ft14 bh-align-vertical__middle" style="color:#666666;margin-left: 20px;">手续费说明</button>-->
        <!--</el-col>-->
      </el-row>
        <p style="color:#999999;position: relative;top: -6px; left: 125px;">提币消耗{{miningFee}}{{coin}}矿工费，网络手续费优先从账户余额中</p>
        <p style="color:#999999;position: relative;top: -16px; left: 125px;">扣除，当余额不足网络手续费时则从提币数量中扣除。</p>
      <!--短信验证码-->
      <el-row class="bh_height" style="margin-top: -2px;" v-if="!showGoogle">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">短信验证码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" v-model="messageCaptcha" maxlength="6" @focus="checkMessageCaptchaFocus" @blur="checkMessageCaptchaBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showMessageCaptchaMsg">{{messageCaptchaMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
          <button class="bh-btn_plain__large" style="margin: 0 0 0 20px;" @click="getTelephoneCode" :disabled="!(phoneIntervalTime===60)">{{getMessageCaptcha}}</button>
        </el-col>
      </el-row>
      <!--谷歌验证-->
      <el-row class="bh_height" style="margin-top: -2px;" v-else>
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">谷歌验证码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" v-model="googleCaptcha" maxlength="6"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showGoogleCaptchaMsg">{{googleCaptchaMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>
      <!--<p style="color:#0bb2fe;position: relative;top: -5px; left: 125px;cursor: pointer;" v-if="!showGoogle" @click="changeCaptcha">切换为谷歌验证</p>-->
      <!--<p style="color:#0bb2fe;position: relative;top: -5px; left: 125px;cursor: pointer;" v-else @click="changeCaptcha">切换为短信验证</p>-->
      <p></p>
      <p></p>
      <!--邮箱验证码-->
      <el-row class="bh_height" style="margin-top: -2px;">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">邮箱验证码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" v-model="emailCaptcha" maxlength="6" @focus="checkEmailCaptchaFocus" @blur="checkEmailCaptchaBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showEmailCaptchaMsg">{{emailCaptchaMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
          <button class="bh-btn_plain__large" style="margin: 0 0 0 20px;" @click="getEmailCode" :disabled="!(emailIntervalTime===60)">{{getEmailCaptcha}}</button>
        </el-col>
      </el-row>
      <!--资金密码-->
      <el-row class="bh_height">
        <el-col :span="3">
          <span class="ft14 color-333 bh-align-vertical__middle">资金密码</span>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="" type="password" v-model="password" maxlength="6" @focus="checkPasswordFocus" @blur="checkPasswordBlur"></el-input>
          <transition name="el-fade-in-linear">
            <span class="bh-hint bh-color_prompt" v-if="showPasswordMsg">{{passwordMsg}}</span>
          </transition>
        </el-col>
        <el-col :span="8">
          <button class="bh-btn_text bh-color_hover ft14 bh-align-vertical__middle" style="color:#666666;margin-left: 20px;" @click="$router.push({name: 'ResetTradingPassword'})">忘记密码？</button>
        </el-col>
      </el-row>
      <!--提交确认提币-->
      <el-row>
        <el-button type="primary" style="width: 140px; height: 34px; padding: 0; margin-left: 370px;" @click="commit" :disabled="!disabled || loading">确认提币</el-button>
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
          1、申请提币之前请您确认接收地址正确，交易一旦发送到区块链网络便不可撤回。
        </span>
        <span class="ft14 bh-color_prompt">
          2、发起提币请求后，即可发送到区块链网络中。
        </span>
        <span class="ft14 bh-color_prompt">
          3、提币通常需要5~30分钟完成到账。
        </span>

      </el-col>
    </el-row>

    <!--提币记录-->
    <el-row style="position: relative;">
      <el-col><span style="width:56px;height:20px;display:inline-block;margin: 60px 0 8px 0;font-size:14px;color:#666666;">提币记录</span></el-col>
      <el-col><span style="position:absolute;width:56px;height:20px;display:inline-block;margin:-28px 0 0 856px;font-size:14px;color:#8ed8fa;cursor: pointer;" @click="$router.push({name: 'MoneyRecord'})">所有记录</span></el-col>
      <el-col :span="24">
        <el-table :data="withdrawList" border>
          <el-table-column label="时间" align="center" width="95">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.createDate).format('yyyy-MM-dd')}}</span><br>
              <span>{{new Date(scope.row.createDate).format('hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="currency" label="币种" align="center" width="60"></el-table-column>
          <el-table-column prop="batch" label="流水号" align="center"></el-table-column>
          <el-table-column prop="toAddress" label="接收地址" align="left" width="240"></el-table-column>
          <el-table-column prop="quantity" label="提币数量" align="center"></el-table-column>
          <el-table-column prop="platformfee" label="网络手续费" align="center">
            <template slot-scope="scope">
              <span>{{NumberFormat.toFixed(new BigNumber(scope.row.cost).plus(new BigNumber(scope.row.platformfee)).toNumber(), 8)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" align="center" width="80">
            <template slot-scope="scope">
              <span>{{Status.convert('MentionRecord', scope.row.status)}}</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作" align="center">-->
            <!--<template slot-scope="scope">-->
              <!--<el-col  style="color:#8ed8fa;cursor: pointer;">查看</el-col>-->
            <!--</template>-->
          <!--</el-table-column>-->
        </el-table>
      </el-col>
    </el-row>
    <!--添加钱包地址-->
    <wallet-address :visible.sync="walletAddress" :coin="coin" :hasRemarks="hasRemarks" v-if="walletAddress"></wallet-address>
    <!--弹窗记录查看-->
    <firefox-download :visible.sync="firefoxDownload" v-if="firefoxDownload"></firefox-download>
  </div>
</template>

<script>
import WalletAddress from './dialog/AddWalletMetionAddress'
import FirefoxDownload from './dialog/FirefoxDownload'
import BigNumber from 'bignumber.js'
export default {
  components: {
    WalletAddress,
    FirefoxDownload
  },
  data () {
    return {
      loading: false,
      // 1.提币币种
      coin: '',
      // 2.接收地址
      address: '',
      // 添加钱包地址
      walletAddress: false,
      firefoxDownload: false,
      showGoogle: false,
      emailIntervalTime: 60,
      phoneIntervalTime: 60,
      // 3.提币数量
      number: 0,
      numberTestResults: 0,
      numberMsg: '',
      showNumberMsg: false,
      // 4.网络手续费(只含旷工费)
      service: '',
      serviceTestResults: 0,
      serviceMsg: '',
      showServiceMsg: false,
      // 5.1短信验证码
      messageCaptcha: '',
      messageCaptchaTestResults: 0,
      messageCaptchaMsg: '',
      showMessageCaptchaMsg: false,
      getMessageCaptcha: '获取验证码',
      // 5.2谷歌证码
      googleCaptcha: '',
      googleCaptchaTestResults: 0,
      googleCaptchaMsg: '',
      showGoogleCaptchaMsg: false,
      // 6.邮箱验证码
      emailCaptcha: '',
      emailCaptchaTestResults: 0,
      emailCaptchaMsg: '',
      showEmailCaptchaMsg: false,
      getEmailCaptcha: '获取验证码',
      // 7.资金密码
      password: '',
      passwordTestResults: 0,
      passwordMsg: '',
      showPasswordMsg: false,
      // 提币记录
      withdrawList: []
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    // 可提币详情列表
    mentionCoin () {
      const mentionCoin = this.$store.getters.getMentionCoin
      const richWallet = this.$store.getters.getRichWalletJson
      const newMentionCoin = {}
      for (let key in richWallet) {
        // 筛选有余额的数据
        if (mentionCoin[key]) {
          newMentionCoin[key] = mentionCoin[key]
          // 补充可用余额属性
          newMentionCoin[key]['availableBalance'] = richWallet[key]['availableBalance']
          // 补充冻结余额属性
          newMentionCoin[key]['frozenAmount'] = richWallet[key]['frozenAmount']
        }
      }
      return newMentionCoin
    },
    // 当前选中币种的提币地址列表
    walletMentionAddressList () {
      return this.$store.getters.getWalletMentionAddress[this.coin]
    },
    // 当前选中币种的最大提币数量
    maxNum () {
      if (this.mentionCoin[this.coin]) {
        return this.NumberFormat.toFixed(this.mentionCoin[this.coin]['maximum'], 8)
      } else {
        return 0
      }
    },
    // 当前选中币种的最小提币数量
    minNum () {
      if (this.mentionCoin[this.coin]) {
        return this.NumberFormat.toFixed(this.mentionCoin[this.coin]['minimumCoin'], 8)
      } else {
        return 0
      }
    },
    // 当前选中币种的提币旷工费
    miningFee () {
      if (this.mentionCoin[this.coin]) {
        return this.NumberFormat.toFixed(this.mentionCoin[this.coin]['miningFee'], 8)
      } else {
        return 0
      }
    },
    // 当前选中币种的可用余额
    availableBalance () {
      if (this.mentionCoin[this.coin]) {
        return this.NumberFormat.toFixed(this.mentionCoin[this.coin]['availableBalance'], 8)
      } else {
        return 0
      }
    },
    // 当前选中币种的冻结余额
    frozenBalance () {
      if (this.mentionCoin[this.coin]) {
        return this.NumberFormat.toFixed(this.mentionCoin[this.coin]['frozenAmount'], 8)
      } else {
        return 0
      }
    },
    // 当前选中币种提币是否需要备注
    hasRemarks () {
      if (this.mentionCoin[this.coin] && this.mentionCoin[this.coin]['isRemark']) {
        return this.mentionCoin[this.coin]['isRemark']
      } else {
        return false
      }
    },
    // 当前选中币种提币地址的备注
    remarks () {
      if (this.mentionCoin[this.coin] && this.mentionCoin[this.coin]['isRemark']) {
        for (let i in this.walletMentionAddressList) {
          if (this.walletMentionAddressList[i]['address'] === this.address) {
            return this.walletMentionAddressList[i]['tag']
          }
        }
      } else {
        return ''
      }
    },
    disabled () {
      if (this.showGoogle) {
        return this.coin &&
          this.address &&
          this.numberTestResults === true &&
          this.serviceTestResults === true &&
          this.googleCaptchaTestResults === true &&
          this.emailCaptchaTestResults === true &&
          this.passwordTestResults === true
      } else {
        return this.coin &&
          this.address &&
          this.numberTestResults === true &&
          this.serviceTestResults === true &&
          this.messageCaptchaTestResults === true &&
          this.emailCaptchaTestResults === true &&
          this.passwordTestResults === true
      }
    }
  },
  watch: {
    number () {
      this.showNumberMsg = false
      this.numberMsg = ''
      this.numberTestResults = 0
      // 提币数量格式的校验
      if (Number(this.number) <= 0) {
        this.showNumberMsg = true
        this.numberMsg = '提币数量不正确'
        this.numberTestResults = 1
        return
      }
      // 提币数量格式的校验
      if (Number(this.number).cut(8) !== Number(this.number)) {
        this.showNumberMsg = true
        this.numberMsg = '提币数量小数位不能超过8位'
        this.numberTestResults = 2
        return
      }
      // 提币限制:1.最小提币数量；2.最大提币数量；3可用余额限制
      const number = new BigNumber(this.number)
      const minNum = new BigNumber(this.minNum)
      const maxNum = new BigNumber(this.maxNum)
      const availableBalance = new BigNumber(this.availableBalance)
      if (number.isLessThan(minNum)) {
        this.showNumberMsg = true
        this.numberMsg = '提币数量不能小于' + minNum
        this.numberTestResults = 1
      }
      if (number.isGreaterThan(maxNum)) {
        this.showNumberMsg = true
        this.numberMsg = '提币数量不能大于' + maxNum
        this.numberTestResults = 1
      }
      if (number.isGreaterThan(availableBalance)) {
        this.showNumberMsg = true
        this.numberMsg = '提币数量不能大于可用余额'
        this.numberTestResults = 1
      }

      this.numberTestResults = true
    },
    service () {
      this.showServiceMsg = false
      this.serviceMsg = ''
      this.serviceTestResults = 0
      // 1.服务费为空
      // if (!this.service) {
      //   return
      // }
      // 2.提币数量格式的校验
      if (Number(this.service) < 0) {
        this.showServiceMsg = true
        this.serviceMsg = '手续费不正确'
        this.serviceTestResults = 1
        return
      }
      // 2.提币数量格式的校验
      if (Number(this.service).cut(8) !== Number(this.service)) {
        this.showServiceMsg = true
        this.serviceMsg = '手续费小数位不能超过8位'
        this.serviceTestResults = 2
        return
      }
      if (new BigNumber(this.service).isLessThan(new BigNumber(this.miningFee))) {
        this.showServiceMsg = true
        this.serviceMsg = '手续费不能小于' + this.miningFee
        this.serviceTestResults = 1
      }
      this.serviceTestResults = true
    },
    messageCaptcha () {
      this.showMessageCaptchaMsg = false
      this.messageCaptchaMsg = ''
      this.messageCaptchaTestResults = 0
      // 1.短信验证码为空
      if (!this.messageCaptcha) {
        return
      }
      // 2.短信验证码格式的校验
      if (!this.$RegExp.captcha(this.messageCaptcha)) {
        this.showMessageCaptchaMsg = true
        this.messageCaptchaMsg = '验证码不正确'
        this.messageCaptchaTestResults = 1
        return
      }
      this.messageCaptchaTestResults = true
    },
    googleCaptcha () {
      this.showGoogleCaptchaMsg = false
      this.googleCaptchaMsg = ''
      this.googleCaptchaTestResults = 0
      // 1.验证码为空
      if (!this.googleCaptcha) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.numberPassword(this.googleCaptcha)) {
        this.showGoogleCaptchaMsg = true
        this.googleCaptchaMsg = '验证码格式不正确'
        this.googleCaptchaTestResults = 1
        return
      }
      this.googleCaptchaTestResults = true
    },
    emailCaptcha () {
      this.showEmailCaptchaMsg = false
      this.emailCaptchaMsg = ''
      this.emailCaptchaTestResults = 0
      // 1.邮箱验证码为空
      if (!this.emailCaptcha) {
        return
      }
      // 2.邮箱验证码格式的校验
      if (!this.$RegExp.captcha(this.emailCaptcha)) {
        this.showEmailCaptchaMsg = true
        this.emailCaptchaMsg = '格式不正确'
        this.emailCaptchaTestResults = 1
        return
      }
      this.emailCaptchaTestResults = true
    },
    password () {
      this.showPasswordMsg = false
      this.passwordMsg = ''
      this.passwordTestResults = 0
      // 1.资金密码为空
      if (!this.password) {
        return
      }
      // 2.资金密码格式的校验
      if (!this.$RegExp.numberPassword(this.password)) {
        this.showPasswordMsg = true
        this.passwordMsg = '格式不正确'
        this.passwordTestResults = 1
        return
      }
      this.passwordTestResults = true
    }
  },
  methods: {
    // 删除钱包提币地址
    delWalletMentionAddress (address) {
      this.$confirm('确定删除提币地址 ' + address.remark + ' 吗?', '删除提币地址', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$store.dispatch('delWalletMentionAddress', {
          coin: address.currencyCode,
          id: address.id
        }).then(() => {
          if (this.coin === address.currencyCode) {
            this.address = ''
          }
          this.$message.success('删除成功')
        }, () => {})
      }).catch(() => {})
    },
    // 切换选中币种
    coinChange () {
      this.service = this.miningFee
      this.address = ''
      this.qryWalletAddress()
    },
    changeCaptcha () {
      this.showGoogle = !this.showGoogle
      this.googleCaptcha = ''
      this.messageCaptcha = ''
    },
    checkNumberFocus () {
      if (this.number === '') {
        this.numberTestResults = 0
        this.showNumberMsg = false
        this.numberMsg = ''
      }
    },
    checkNumberBlur () {
      // 为空不继续校验
      // if (this.numberTestResults === 0) {
      //   this.showNumberMsg = true
      //   this.numberMsg = '提币数量不能为零'
      // }
    },
    checkServiceFocus () {
      if (this.service === '') {
        this.serviceTestResults = 0
        this.showServiceMsg = false
        this.serviceMsg = ''
      }
    },
    checkServiceBlur () {
      // 为空不继续校验
      // if (this.serviceTestResults === 0) {
      //   this.showServiceMsg = true
      //   this.serviceMsg = '提币数量不能为零'
      // }
    },
    checkMessageCaptchaFocus () {
      if (this.messageCaptcha === '') {
        this.messageCaptchaTestResults = 0
        this.showMessageCaptchaMsg = false
        this.messageCaptchaMsg = ''
      }
    },
    checkMessageCaptchaBlur () {
      // 为空不继续校验
      if (this.messageCaptchaTestResults === 0) {
        this.showMessageCaptchaMsg = true
        this.messageCaptchaMsg = '验证码不能为空'
      }
    },
    checkEmailCaptchaFocus () {
      if (this.emailCaptcha === '') {
        this.emailCaptchaTestResults = 0
        this.showEmailCaptchaMsg = false
        this.emailCaptchaMsg = ''
      }
    },
    checkEmailCaptchaBlur () {
      // 为空不继续校验
      if (this.emailCaptchaTestResults === 0) {
        this.showEmailCaptchaMsg = true
        this.emailCaptchaMsg = '验证码不能为空'
      }
    },
    checkPasswordFocus () {
      if (this.password === '') {
        this.passwordTestResults = 0
        this.showPasswordMsg = false
        this.passwordMsg = ''
      }
    },
    checkPasswordBlur () {
      // 为空不继续校验
      if (this.passwordTestResults === 0) {
        this.showPasswordMsg = true
        this.passwordMsg = '密码不能为空'
      }
    },
    qryWalletAddress () {
      this.$store.dispatch('qryWalletMentionAddressByCoin', {coin: this.coin}).then()
    },
    // 获取邮箱验证码
    getEmailCode () {
      this.getEmailCaptcha = this.emailIntervalTime--
      const temp = setInterval(() => {
        this.getEmailCaptcha = this.emailIntervalTime--
        if (this.emailIntervalTime === 0) {
          this.getEmailCaptcha = '获取验证码'
          this.emailIntervalTime = 60
          clearInterval(temp)
        }
      }, 1000)
      this.$store.dispatch('encryptConnection', {
        url: '/auth/getEmailAuthCode',
        data: {
          email: this.$store.getters.getUser.email,
          type: '18'
        }
      }).then(response => {
      }, response => {
        this.getEmailCaptcha = '获取验证码'
        this.emailIntervalTime = 60
        clearInterval(temp)
        switch (response.body.code) {
          case 666:
            return
          case 'E0901':
            this.$message.error('参数为空')
            break
          case 'E0902':
            this.$message.error('邮箱格式不正确')
            break
          case 'E0903':
            this.$message.error('发送失败' + response.body.msg)
            break
          case 'E0904':
            this.$message.error('邮箱已存在')
            break
          case 'E0906':
            this.$message.error('不存在该邮箱')
            break
          case 'E0907':
            this.$message.error('已经认证该邮箱')
            break
          case 'E0910':
            this.$message.error('已经认证该邮箱')
            break
          default:
            this.$message.error('发送失败' + response.body.msg)
        }
      })
    },
    // 获取新手机验证码
    getTelephoneCode () {
      this.getMessageCaptcha = this.phoneIntervalTime--
      const temp = setInterval(() => {
        this.getMessageCaptcha = this.phoneIntervalTime--
        if (this.getMessageCaptcha === 0) {
          clear()
        }
      }, 1000)
      const clear = () => {
        this.getMessageCaptcha = '获取验证码'
        this.phoneIntervalTime = 60
        clearInterval(temp)
      }
      this.$store.dispatch('encryptConnection', {
        url: '/auth/getTelephoneAuthCode',
        data: {
          telephone: this.$store.getters.getUser.telephone,
          type: '18'
        }
      }).then(response => {
      }, response => {
        clear()
        switch (response.body.code) {
          case 666:
            return
          case 'E0807':
            this.$message.error('短信发送过于频繁')
            break
          default:
            this.$message.error('短信发送失败' + response.body.msg)
        }
      })
    },
    commit () {
      this.loading = true
      this.$store.dispatch('encryptConnection', {
        url: '/wallet/mentionCoinUI',
        data: {
          currencyCode: this.coin,
          amount: this.number + '',
          free: this.service + '',
          toAddress: this.address,
          telephoneCode: this.messageCaptcha,
          mailCode: this.emailCaptcha,
          password: this.password,
          remark: this.remarks
        }
      }).then(response => {
        this.loading = false
        this.$message.success('发起提币申请成功，等待系统处理')
        this.$router.push({name: 'OtcTrading'})
      }, response => {
        this.loading = false
        switch (response.body.code) {
          case 666:
            return
          case 'ERROR_CAC2':
            this.$message.error('参数不合法')
            break
          case 'NO_008':
            this.$message.error('资金密码错误')
            break
          case 'NO_009':
            this.$message.error('可用余额不足')
            break
          default:
            this.$message.error(response.body.msg)
            break
        }
      })
    },
    numberFilter (value, objName) {
      if (Number(value) === 0) {
        return
      }
      this[objName] = this.NumberFormat.toFixed(value, 8)
      if (Number(value) > 1000000) {
        this[objName] = 1000000
      }
    }
  },
  created () {
    if (this.$store.getters.getUser.fundPassword === 0) {
      this.$alert('请先设置资金密码', '设置资金密码', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({name: 'SecuritySettings'})
        }
      })
      return false
    }
    this.coin = this.$route.params.coin || this.coin
    this.$store.dispatch('qryAllWallet').then()
    // 充币记录
    this.$store.dispatch('encryptConnection', {
      url: '/assetRecord/queryAssetRecordListUI',
      data: {
        type: '3',
        pageSize: '5',
        pageNo: '0'
      }
    }).then(response => {
      this.withdrawList = response.body.data
    }, response => {
      switch (response.body.code) {
        case 666:
          return
        default:
          this.$message.error(response.body.msg)
          break
      }
    })
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
  .bh_height{
    line-height: 34px;
  }

  /*报错提示*/
  .el-col-8 {
    position: relative;
  }

  .bh-hint.bh-color_prompt {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    line-height: 34px;
    padding-right: 15px;
  }
</style>
