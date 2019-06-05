<template>
  <div class="">
    <!--添加钱包地址-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="527" :height="460">
      <div slot="body">
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span>添加钱包地址</span>
          </el-col>
        </el-row>
        <!--币种-->
        <el-row>
          <el-col :span="4" class="ft14" style="margin:32px 24px 0px 24px;">
            <span>币&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;种</span>
          </el-col>
          <el-col :span="12">
            <span style="display:inline-block;width: 290px; height: 34px;margin: 32px 0 2px 0px;font-size: 14px;">{{coin}}</span>
          </el-col>
        </el-row>
        <!--别名-->
        <el-row style="margin-bottom: 10px;">
          <el-col :span="4" class="ft14" style="margin:16px 24px 14px 24px;">
            <span>地址名称</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 6px 0 10px 0px;" v-model="name" @focus="checkNameFocus" @blur="checkNameBlur" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="showNameMsg" class="bh-hint bh-color_prompt" style="position: absolute;top: 45px;left: 128px;">{{nameMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--接收地址-->
        <el-row>
          <el-col :span="4" class="ft14" style="margin:16px 24px 14px 24px;">
            <span>接收地址</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 6px 0 10px 0px;" v-model="address" @focus="checkAddressFocus" @blur="checkAddressBlur" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="showAddressMsg" class="bh-hint bh-color_prompt" style="position: absolute;top: 45px;left: 128px;">{{addressMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--地址标签-->
        <el-row v-if="hasRemarks">
          <el-col :span="4" class="ft14" style="margin:32px 24px 32px 24px;">
            <span>Memo(备注)</span>
          </el-col>
          <el-col :span="16">
            <el-input  style="width: 290px; height: 34px;margin: 22px 0 2px 0px;" v-model="tag" @focus="checkTagFocus" @blur="checkTagBlur" clearable></el-input><br>
            <span class="bh-color_prompt">（填写错误可能导致资产损失，请仔细核对）</span>
            <transition name="el-fade-in-linear">
              <span v-if="showTagMsg" class="bh-hint bh-color_prompt" style="position: absolute;top: 60px;left: 128px;">{{tagMsg}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--短信验证码-->
        <el-row>
          <el-col :span="4" class="ft14" style="margin:16px 24px;">
            <span v-if="user.telephone">短信验证码</span>
            <span v-else>邮箱验证码</span>
          </el-col>
          <el-col :span="8">
            <el-input style="width: 190px; height: 34px;margin: 8px 0 8px 0px;" v-model="captcha" @focus="checkCaptchaFocus" @blur="checkCaptchaBlur" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="showCaptchaMsg"  class="bh-hint bh-color_prompt" style="position: absolute;top: 19px;left: 208px;">{{captchaMsg}}</span>
            </transition>
          </el-col>
          <el-col :span="8">
            <button class="bh-btn_plain__large" style="margin: 8px 0 8px 45px;" @click="getCaptcha" :disabled="!(intervalTime===60)">{{getCaptchaMsg}}</button>
          </el-col>
        </el-row>
        <!--切换为谷歌验证-->
        <!--<el-row>-->
          <!--<span style="display: inline-block;margin:0 0 12px 120px;cursor: pointer;color:#0bb2fe;">切换为谷歌验证</span>-->
        <!--</el-row>-->
        <!--取消、确认-->
        <el-row>
          <el-col :span="12">
            <button style="width: 130px; height: 34px;padding: 0;margin: 10px 40px 40px 120px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" style="width: 130px; height: 34px;padding: 0;margin: 10px 50px 40px 45px;" class="bh-btn_primary" :disabled="!disabled || committing" @click="commit">
              <span>确认</span>
              <i class="el-icon-loading" v-if="committing"></i>
            </el-button>
          </el-col>
        </el-row>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../components/BHDialog'
export default {
  data () {
    return {
      // 名称
      name: '',
      nameTestResults: 0,
      nameMsg: '',
      showNameMsg: false,
      // 地址
      address: '',
      addressTestResults: 0,
      addressMsg: '',
      showAddressMsg: false,
      // 标签
      tag: '',
      tagTestResults: 0,
      tagMsg: '',
      showTagMsg: false,
      // 验证码
      captcha: '',
      captchaTestResults: 0,
      captchaMsg: '',
      showCaptchaMsg: false,
      // 验证码获取间隔
      intervalTime: 60,
      getCaptchaMsg: '获取验证码',
      committing: false
    }
  },
  props: {
    coin: {
      type: String,
      default: 'BTC'
    },
    hasRemarks: {
      type: Boolean,
      default: false
    },
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
    // 全部输入校验
    disabled () {
      return this.addressTestResults === true &&
        (this.tagTestResults === true || !this.hasRemarks) &&
        this.captchaTestResults === true
    }
  },
  watch: {
    name () {
      this.showNameMsg = false
      this.nameMsg = ''
      this.nameTestResults = 0
      // 1.地址为空
      if (!this.name) {
        return
      }
      this.nameTestResults = true
    },
    address () {
      this.showAddressMsg = false
      this.addressMsg = ''
      this.addressTestResults = 0
      // 1.地址为空
      if (!this.address) {
        return
      }
      this.addressTestResults = true
    },
    tag () {
      this.showTagMsg = false
      this.tagMsg = ''
      this.tagTestResults = 0
      // 1.标签为空
      if (!this.tag) {
        return
      }
      this.tagTestResults = true
    },
    captcha () {
      this.showCaptchaMsg = false
      this.captchaMsg = ''
      this.captchaTestResults = 0
      // 1.验证码为空
      if (!this.captcha) {
        return
      }
      // 2.验证码格式的校验
      if (!this.$RegExp.captcha(this.captcha)) {
        this.showCaptchaMsg = true
        this.captchaMsg = '验证码格式不正确'
        this.captchaTestResults = 1
        return
      }
      this.captchaTestResults = true
    }
  },
  methods: {
    checkNameFocus () {
      if (this.name === '') {
        this.nameTestResults = 0
        this.showNameMsg = false
        this.nameMsg = ''
      }
    },
    checkNameBlur () {
      // 为空不继续校验
      if (this.nameTestResults === 0) {
        this.showNameMsg = true
        this.nameMsg = '名称不能为空'
      }
    },
    checkAddressFocus () {
      if (this.address === '') {
        this.addressTestResults = 0
        this.showAddressMsg = false
        this.addressMsg = ''
      }
    },
    checkAddressBlur () {
      // 为空不继续校验
      if (this.addressTestResults === 0) {
        this.showAddressMsg = true
        this.addressMsg = '地址不能为空'
      }
    },
    checkTagFocus () {
      if (this.tag === '') {
        this.tagTestResults = 0
        this.showTagMsg = false
        this.tagMsg = ''
      }
    },
    checkTagBlur () {
      // 为空不继续校验
      if (this.tagTestResults === 0) {
        this.showTagMsg = true
        this.tagMsg = '标签不能为空'
      }
    },
    checkCaptchaFocus () {
      if (this.captcha === '') {
        this.captchaTestResults = 0
        this.showCaptchaMsg = false
        this.captchaMsg = ''
      }
    },
    checkCaptchaBlur () {
      // 为空不继续校验
      if (this.captchaTestResults === 0) {
        this.showCaptchaMsg = true
        this.captchaMsg = '验证码不能为空'
      }
    },
    commit () {
      if (this.committing) {
        return
      } else {
        this.committing = true
      }
      this.$store.dispatch('addWalletMentionAddress', {
        name: this.name,
        coin: this.coin,
        captcha: this.captcha,
        type: this.user.telephone ? '0' : '1',
        address: this.address,
        tag: this.tag || 'tag'
      }).then(response => {
        this.$store.dispatch('qryWalletMentionAddressByCoin', {
          coin: this.coin,
          forced: true
        }).then()
        this.$message.success('添加成功')
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
    // 获取验证码
    getCaptcha () {
      this.getCaptchaMsg = this.intervalTime--
      const temp = setInterval(() => {
        this.getCaptchaMsg = this.intervalTime--
        if (this.getCaptchaMsg === 0) {
          this.getCaptchaMsg = '获取验证码'
          this.intervalTime = 60
          clearInterval(temp)
        }
      }, 1000)
      if (this.user.telephone) {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getTelephoneAuthCode',
          data: {
            countryCode: this.user.countryCode,
            telephone: this.user.telephone,
            type: '19'
          }
        }).then(response => {
        }, response => {
          this.getCaptchaMsg = '获取验证码'
          this.intervalTime = 60
          clearInterval(temp)
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      } else {
        this.$store.dispatch('encryptConnection', {
          url: '/auth/getEmailAuthCode',
          data: {
            email: this.user.email,
            type: '19'
          }
        }).then(response => {
        }, response => {
          this.getCaptchaMsg = '获取验证码'
          this.intervalTime = 60
          clearInterval(temp)
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

</style>
