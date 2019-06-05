<template>
  <div class="">
    <!--银行账户设置-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="527">
      <div slot="body" v-loading="loading">
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span >银行账户设置</span>
            <!--<span >银行账户修改</span>-->
          </el-col>
        </el-row>
        <!--姓名-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:32px 24px 22px 24px;">
            <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
          </el-col>
          <el-col :span="12">
            <el-input  style="width: 290px; height: 34px;margin: 22px 0 2px 0px;" v-model="user.username" @focus="bankUserNameFocus=true" clearable disabled></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="bankUserNameFocus && !checkBankUserName" class="bh-hint bh-color_prompt" style="position: absolute;top: 60px;left: 128px;">{{bankUserNameMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--银行账号-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:12px 24px 18px 24px;">
            <span>银行账号</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 2px 0 10px 0px;" type="number" v-model="bankCard" @focus="bankCardFocus=true" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="bankCardFocus && !checkBankcard" class="bh-hint bh-color_prompt" style="position: absolute;top: 38px;left: 128px;">{{bankCardMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--确认账号-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:14px 24px 14px 24px;">
            <span>确认账号</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 4px 0 10px 0px;" v-model="confirmBankCard" @focus="confirmBankCardFocus=true" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span  v-if="confirmBankCardFocus && !checkConfirmBankcard" class="bh-hint bh-color_prompt" style="position: absolute;top: 40px;left: 128px;">{{confirmBankCardMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--开户银行-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:18px 24px 16px 24px;">
            <span>开户银行</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 6px 0 10px 0px;" v-model="bankOfDeposit" @focus="bankOfDepositFocus=true" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="bankOfDepositFocus && !checkBankOfDeposit"  class="bh-hint bh-color_prompt" style="position: absolute;top: 44px;left: 128px;">{{bankOfDepositMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--银行网点-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:16px 24px 14px 24px;">
            <span>银行网点</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 6px 0 10px 0px;" v-model="branches" @focus="branchesFocus=true" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="branchesFocus && !checkBranches"  class="bh-hint bh-color_prompt" style="position: absolute;top: 42px;left: 128px;">{{branchesMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--短信验证码-->
        <el-row>
          <el-col :span="8" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:14px 24px;">
            <span v-if="user.telephone">短信验证码</span>
            <span v-else>邮箱验证码</span>
          </el-col>
          <el-col :span="8">
            <el-input style="width: 190px; height: 34px;margin: 8px 0 8px 0px;" v-model="telephoneCode" @focus="telephoneCodeFocus=true" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="telephoneCodeFocus && !checkTelephoneCode"  class="bh-hint bh-color_prompt" style="position: absolute;top: 45px;left: 128px;">{{telephoneCodeMsg}}</span>
            </transition>
          </el-col>
          <el-col :span="8">
            <button class="bh-btn_plain__large"  style="margin: 8px 0 8px 45px;" @click="getCaptcha" :disabled="onlyCheckTelephone">{{getCode}}</button>
          </el-col>
        </el-row>
        <!--取消、确认-->
        <el-row>
          <el-col :span="12">
            <button style="width: 130px; height: 34px;padding: 0;margin: 10px 40px 40px 120px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <button class="bh-btn_primary" style="width: 130px; height: 34px;padding: 0;margin: 10px 50px 40px 45px;" :disabled="disabled" @click="commit">
              <span>确认</span>
              <i class="el-icon-loading" v-if="loading"></i>
            </button>
          </el-col>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../../components/BHDialog'
export default {
  data () {
    return {
      loading: false,
      // 姓名、银行账号、确认账号、开户行、开户网点、手机验证码
      bankUserName: '',
      bankCard: '',
      confirmBankCard: '',
      bankOfDeposit: '',
      branches: '',
      telephoneCode: '',
      // 错误提示
      bankUserNameMsg: '姓名不能为空!',
      bankCardMsg: '银行账号数字长度必须为12~22之间!',
      confirmBankCardMsg: '账号不一致!',
      bankOfDepositMsg: '此选项不能为空!',
      branchesMsg: '此选项不能为空!',
      telephoneCodeMsg: '验证码不能为空!',
      // 验证码获取
      getCode: '获取验证码',
      // 验证码获取的倒数计时
      interval: null,
      // 输入框是否获取过焦点：是否开启数据校验
      bankUserNameFocus: false,
      bankCardFocus: false,
      confirmBankCardFocus: false,
      bankOfDepositFocus: false,
      branchesFocus: false,
      telephoneCodeFocus: false
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BhDialog
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    },
    // 银行账号校验
    checkBankcard () {
      return new RegExp(`^([1-9])([0-9]{11,21})$`).test(this.bankCard)
    },
    // 确认账号校验
    checkConfirmBankcard () {
      if (!this.confirmBankCardFocus) {
        return true
      }
      return this.bankCard === this.confirmBankCard
    },
    // 开户银行校验
    checkBankOfDeposit () {
      if (!this.bankOfDepositFocus) {
        return true
      }
      if (this.bankOfDeposit) {
        return true
      }
      return false
    },
    // 银行网点校验
    checkBranches () {
      if (!this.branchesFocus) {
        return true
      }
      if (this.branches) {
        return true
      }
      return false
    },
    // 手机短信验证码校验
    checkTelephoneCode () {
      if (!this.telephoneCodeFocus) {
        return true
      }
      if (this.telephoneCode) {
        return true
      }
      return false
    },
    // 是否可以获取手机验证码
    onlyCheckTelephone () {
      return this.interval === 60
    },
    // 全部输入校验
    disabled () {
      const start = (this.bankCardFocus || this.bankCard) && (this.confirmBankCardFocus || (this.bankCard === this.confirmBankCard)) && (this.bankOfDepositFocus || this.bankOfDeposit) && (this.branchesFocus || this.branches) && (this.telephoneCodeFocus || this.telephoneCode)
      return !(start && this.checkBankcard && this.checkConfirmBankcard && this.checkBankOfDeposit && this.checkBranches && this.checkTelephoneCode)
    }
  },
  methods: {
    // 提交
    commit () {
      this.committing = true
      this.$store.dispatch('encryptConnection', {
        url: '/bank/addUI',
        data: {
          bankUserName: this.user.username,
          bankcard: this.bankCard,
          bankofdeposit: this.bankOfDeposit,
          branches: this.branches,
          telephoneCode: this.$store.getters.getUser.telephone ? this.telephoneCode : '',
          emailCode: this.$store.getters.getUser.telephone ? '' : this.telephoneCode
        }
      }).then(response => {
        this.$message.success('设置成功')
        this.committing = false
        this.$store.commit('setUser', {
          bankUserName: this.user.username,
          bankCard: this.bankCard,
          bankOfDeposit: this.bankOfDeposit,
          branches: this.branches,
          isOpenBank: 1
        })
        this.$emit('update:visible', false)
      }, response => {
        this.committing = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 获取手机验证码
    getCaptcha () {
      this.getCode = 59
      this.interval = setInterval(() => {
        if (!this.visible) this.resetData()
        if (this.getCode-- === 0) {
          this.getCode = '获取验证码'
          clearInterval(this.interval)
          this.interval = null
        }
      }, 1000)
      if (this.$store.getters.getUser.telephone) {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getTelephoneAuthCode',
          data: {
            telephone: this.$store.getters.getUser.telephone,
            type: '3'
          }
        }).then(response => {
        }, response => {
          this.getCode = '获取验证码'
          clearInterval(this.interval)
          this.interval = null
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
      } else {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getEmailAuthCode',
          data: {
            email: this.$store.getters.getUser.email,
            type: '17'
          }
        }).then(response => {
        }, response => {
          this.getCode = '获取验证码'
          clearInterval(this.interval)
          this.interval = null
          switch (response.body.code) {
            case 666:
              return
            case 'E0807':
              this.$message.error('发送过于频繁')
              break
            default:
              this.$message.error('发送失败' + response.body.msg)
          }
        })
      }
    },
    // 重置数据
    resetData () {
      clearInterval(this.interval)
      // 各选项信息填写
      this.bankUserName = ''
      this.bankCard = ''
      this.confirmBankCard = ''
      this.bankOfDeposit = ''
      this.branches = ''
      this.telephoneCode = ''
      // 错误提示
      this.bankUserNameMsg = '姓名不能为空!'
      this.bankCardMsg = '银行账号数字长度必须为12~22之间!'
      this.confirmBankCardMsg = '账号不一致!'
      this.bankOfDepositMsg = '此选项不能为空!'
      this.branchesMsg = '此选项不能为空!'
      this.telephoneCodeMsg = '验证码不能为空!'
      // 验证码获取
      this.getCode = '获取验证码'
      this.interval = null
      // 判断
      this.bankUserNameFocus = false
      this.bankCardFocus = false
      this.confirmBankCardFocus = false
      this.bankOfDepositFocus = false
      this.branchesFocus = false
      this.telephoneCodeFocus = false
      this.committing = false
    }
  },
  beforeUpdate () {
    // 关闭对话框时，清空数据
    if (!this.visible) {
      // this.resetData()
    }
  },
  created () {
    if (/^1$|^2$/.test(this.user.isOpenBank) && !this.user.bankUserName) {
      this.loading = true
      this.$store.dispatch('qryUserBankInfo').then(response => {
        this.loading = false
        this.bankUserName = this.user.bankUserName
        this.bankCard = this.user.bankCard
        // this.confirmBankCard = this.user.bankCard
        this.bankOfDeposit = this.user.bankOfDeposit
        this.branches = this.user.branches
        // Object.assign(this.confirmBankCard, this.user.bankCard)
      }, response => {
        this.loading = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    } else {
      // Object.assign(this.confirmBankCard, this.user.bankCard)
      this.bankUserName = this.user.bankUserName
      this.bankCard = this.user.bankCard
      // this.confirmBankCard = this.user.bankCard
      this.bankOfDeposit = this.user.bankOfDeposit
      this.branches = this.user.branches
    }
  }
}
</script>

<style scoped>
</style>
