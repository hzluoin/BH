<template>
  <div class="">
    <!--支付宝账号设置-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="527" :height="512">
      <div slot="body">
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span >支付宝账号设置</span>
            <!--<span >支付宝账号修改</span>-->
          </el-col>
        </el-row>
        <!--姓名-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:32px 24px 22px 24px;">
            <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
          </el-col>
          <el-col :span="12">
            <el-input  style="width: 290px; height: 34px;margin: 22px 0 2px 0px;" v-model="alipayName" @focus="asName=true" clearable disabled></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="asName && !starnName" class="bh-hint bh-color_prompt" style="position: absolute;top: 60px;left: 128px;">{{isName}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--账号-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:12px 24px 18px 24px;">
            <span>账&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span>
          </el-col>
          <el-col :span="12">
            <el-input style="width: 290px; height: 34px;margin: 2px 0 10px 0px;" v-model="alipayAccount" @focus="asAccount=true" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span  v-if="asAccount && !starasAccount" class="bh-hint bh-color_prompt" style="position: absolute;top: 38px;left: 128px;">{{isAccount}}</span>
            </transition>
          </el-col>
        </el-row>
        <!--二维码-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:14px 24px 14px 24px;">
            <span>二&nbsp;&nbsp;维&nbsp;&nbsp;码</span>
          </el-col>
          <el-col :span="12" class="bh-upload">
            <div>
              <el-upload v-loading="committing" style="text-align: center;" action=""
                         :show-file-list="false" accept="image/*"
                         :on-change="handleChange" :multiple="false"
                         :auto-upload="false" list-type="picture">
                <div v-if="!qrCodeImage">
                  <span><i class="iconfont icon-upload"></i></span>
                  <p>上传支付宝收款二维码</p>
                </div>
                <img v-if="qrCodeImage && /http/.test(qrCodeImage)" :src="qrCodeImage" style="max-width: 250px;max-height: 156px;">
                <img v-else-if="qrCodeImage" :src="qrCodeImage" style="max-width: 250px;max-height: 156px;">
                <img style="    height: 186px;width: 290px;" src="../../../../assets/images/ewm.png" v-else>
              </el-upload>
            </div>
          </el-col>
        </el-row>
        <!--短信验证码-->
        <el-row>
          <el-col :span="8" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:28px 24px;">
            <span v-if="$store.getters.getUser.telephone">短信验证码</span>
            <span v-else>邮箱验证码</span>
          </el-col>
          <el-col :span="8">
            <el-input style="width: 190px; height: 34px;margin: 20px 0 8px 0px;" v-model="isVerification" @focus="asnote=true" maxlength="6" clearable></el-input>
            <transition name="el-fade-in-linear">
              <span v-if="asnote && !starAsnote"  class="bh-hint bh-color_prompt" style="position: absolute;top: 58px;left: 128px;">{{isNote}}</span>
            </transition>
          </el-col>
          <el-col :span="8">
            <button class="bh-btn_plain__large"  style="margin: 20px 0 8px 45px;" @click="getCaptcha" :disabled="onlyCheckTelephone">{{getCode}}</button>
          </el-col>
        </el-row>
        <!--取消、确认-->
        <el-row>
          <el-col :span="12">
            <button style="width: 130px; height: 34px;margin: 2px 40px 40px 120px;font-size: 14px;" class="bh-btn_plain" @click="$emit('update:visible', false)">取消</button>
          </el-col>
          <el-col :span="12">
            <button class="bh-btn_primary" style="width: 130px; height: 34px;padding: 0;margin: 2px 50px 40px 45px;" :disabled="disabled" @click="commit">
              <span>确认</span>
              <i class="el-icon-loading" v-if="committing"></i>
            </button>
          </el-col>
        </el-row>
        <picture-editor v-if="showPictureEditor" :visible.sync="showPictureEditor" :settings="settings" @success="uploadImage"></picture-editor>
      </div>
    </bh-dialog>
  </div>
</template>

<script>
import BhDialog from '../../../../components/BHDialog'
import PictureEditor from '../../../../components/PictureEditor'
export default {
  data () {
    return {
      // 上传文件图片
      qrCodeImage: '',
      // 各选项信息填写
      alipayName: this.$store.getters.getUser.username,
      alipayAccount: '',
      isVerification: '',
      // 错误提示
      isName: '姓名不能为空!',
      isAccount: '支付宝账号不能为空!',
      isNote: '验证码不能为空!',
      // 验证码获取
      getCode: '获取验证码',
      interval: 60,
      // 判断
      asName: false,
      asAccount: false,
      asnote: false,
      committing: false,
      showPictureEditor: false,
      settings: {
        outputSize: 0.3,
        fixedBox: false
      }
    }
  },
  name: 'AlipayAccount',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    BhDialog,
    PictureEditor
  },
  computed: {
    // 账号校验
    starasAccount () {
      if (this.asAccount) {
        if (this.alipayAccount) return true
        return false
      } else {
        return true
      }
    },
    // 是否可以获取手机验证码获取
    onlyCheckTelephone () {
      const reg = new RegExp(`^[0-9]{8,11}$`)
      return reg.test(this.telephone) && this.interval === 60
    },
    // 手机短信验证码
    starAsnote () {
      if (!this.asnote) {
        return true
      }
      if (this.isVerification) {
        return true
      }
      return false
    },
    // 全部输入校验
    disabled () {
      const start = (this.asAccount || this.alipayAccount) && (this.asnote || this.isVerification)
      return !(start && this.starasAccount && this.starAsnote && this.qrCodeImage)
    }
  },
  methods: {
    commit () {
      if (this.committing) {
        return
      } else if (this.committing) {
        this.committing = true
      } else {
        this.$emit('update:visible', false)
      }
      // 3.发送支付宝绑定的接口
      this.$store.dispatch('encryptConnection', {
        url: '/alipay/addUI',
        data: {
          alipayUserName: this.alipayName,
          alipay: this.alipayAccount,
          telephoneCode: this.$store.getters.getUser.telephone ? this.isVerification : '',
          emailCode: this.$store.getters.getUser.telephone ? '' : this.isVerification,
          qrcode: /http/.test(this.qrCodeImage) ? null : this.qrCodeImage.split(',')[1]
        }
      }).then(response => {
        this.committing = false
        this.$store.commit('setUser', {
          alipayUserName: this.alipayName,
          alipay: this.alipayAccount,
          telephoneCode: this.$store.getters.getUser.telephone ? this.isVerification : '',
          emailCode: this.$store.getters.getUser.telephone ? '' : this.isVerification,
          alipayQRCode: this.qrCodeImage,
          isOpenAlipay: 1
        })
        this.$message.success('支付宝设置成功')
      }, response => {
        this.committing = false
        switch (response.body.code) {
          case 666:
            return
          case 'E1202':
            if (/http/.test(this.qrCodeImage)) {
              this.$message.error('修改支付宝设置需重新上传二维码')
            } else {
              this.$message.error(response.body.msg)
            }
            break
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 上传图片
    handleChange (file) {
      this.$set(this.settings, 'image', file.url)
      this.showPictureEditor = true
    },
    uploadImage (data) {
      this.qrCodeImage = data
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
            type: '5'
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
            type: '5'
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
      this.alipayAccount = ''
      this.isVerification = ''
      // 错误提示
      this.isName = '姓名不能为空!'
      this.isAccount = '银行账号数字长度必须为12~22之间!'
      this.isNote = '验证码不能为空!'
      // 验证码获取
      this.getCode = '获取验证码'
      this.interval = 60
      // 判断
      this.asName = false
      this.asAccount = false
      this.asnote = false
      this.committing = false
      // 上传文件图片
      this.qrCodeImage = ''
    }
  },
  beforeUpdate () {
    // 关闭对话框时，清空数据
    if (!this.visible) {
      this.resetData()
    }
  },
  created () {
    const user = this.$store.getters.getUser
    if (user.alipayUserName && user.alipay) {
      // 已绑定,本地有数据
      this.alipayUserName = user.alipayName
      this.alipayAccount = user.alipay
      this.qrCodeImage = user.alipayQRCode
    } else if (user.alipay) {
      // 已绑定,本地无数据
      this.$store.dispatch('encryptConnection', {
        url: '/alipay/queryAlipayUI',
        data: {}
      }).then(response => {
        const data = response.body.data
        const bankcard = {
          alipayName: data.alipayUserName,
          alipayAccount: data.alipay,
          qrCodeImage: data.qrcode
        }
        this.$store.commit('setUser', bankcard)
        this.alipayName = data.alipayUserName
        this.alipayAccount = data.alipay
        this.qrCodeImage = data.qrcode
      }, response => {
        this.resetData()
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
</script>

<style scoped>
  .icon-upload {
    font-size: 12px;
    color: #0BB2fE;
  }
  .bh-upload>div span {
    display: inline-block;
    width: 29px;
    height: 29px;
    line-height: 29px;
    text-align: center;
    border-radius: 100%;
    background-color: #FFF;
    position: absolute;
    top: 58px;
    left: 58px;
    right: 0;
    margin: auto;
  }
  .bh-upload>div p {
    position: absolute;
    top: 95px;
    left: 50px;
    right: 0;
    margin: auto;
    font-size:12px;
    color:#ffffff;
  }
</style>
