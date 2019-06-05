<template>
  <div class="">
    <!--微信账号设置-->
    <bh-dialog :visible="visible" @updateVisible="$emit('update:visible', false)" :close-button="false" :width="527" :height="512">
      <div slot="body">
        <el-row>
          <el-col :span="24" class="bh-align_center" style="width: 100%;height: 25px;font-size: 18px;">
            <span >微信账号设置</span>
            <!--<span >微信账号修改</span>-->
          </el-col>
        </el-row>
        <!--姓名-->
        <el-row>
          <el-col :span="12" class="bh-align_middle" style="width: 70px; height: 20px;font-size: 14px;margin:32px 24px 22px 24px;">
            <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
          </el-col>
          <el-col :span="12">
            <el-input  style="width: 290px; height: 34px;margin: 22px 0 2px 0px;" v-model="wechatName" @focus="asName=true" clearable disabled></el-input>
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
            <el-input style="width: 290px; height: 34px;margin: 2px 0 10px 0px;" v-model="wechatAccount" @focus="asAccount=true" clearable></el-input>
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
                    <p>上传微信收款二维码</p>
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
      // 各选项信息填写
      wechatName: this.$store.getters.getUser.username,
      wechatAccount: '',
      isVerification: '',
      // 错误提示
      isName: '姓名不能为空!',
      isAccount: '微信账号不能为空!',
      isNote: '验证码不能为空!',
      // 验证码获取
      getCode: '获取验证码',
      interval: 60,
      // 判断
      asName: false,
      asAccount: false,
      asnote: false,
      committing: false,
      // 图片Base64数据、Blob对象、文件名
      qrCodeImage: '',
      showPictureEditor: false,
      settings: {
        outputSize: 0.3,
        fixedBox: false
      }
    }
  },
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
        if (this.wechatAccount) return true
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
      const start = (this.asAccount || this.wechatAccount) && (this.asnote || this.isVerification)
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
      // 3.发送微信绑定接口
      this.$store.dispatch('encryptConnection', {
        url: '/wechat/addUI',
        data: {
          wechatUserName: this.wechatName,
          wechat: this.wechatAccount,
          telephoneCode: this.$store.getters.getUser.telephone ? this.isVerification : '',
          emailCode: this.$store.getters.getUser.telephone ? '' : this.isVerification,
          qrcode: /http/.test(this.qrCodeImage) ? null : this.qrCodeImage.split(',')[1]
        }
      }).then(response => {
        this.committing = false
        this.$store.commit('setUser', {
          wechatUserName: this.wechatName,
          wechat: this.wechatAccount,
          telephoneCode: this.isVerification,
          wechatQRCode: this.qrCodeImage,
          isOpenWechat: 1
        })
        this.$message.success('微信设置成功')
      }, response => {
        this.committing = false
        switch (response.body.code) {
          case 666:
            return
          case 'E1202':
            if (/http/.test(this.qrCodeImage)) {
              this.$message.error('修改微信设置需重新上传二维码')
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
            type: '4'
          }
        }).then(response => {
        }, response => {
          this.getCode = '获取验证码'
          clearInterval(this.interval)
          this.interval = null
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
            email: this.$store.getters.getUser.email,
            type: '4'
          }
        }).then(response => {
        }, response => {
          this.getCode = '获取验证码'
          clearInterval(this.interval)
          this.interval = null
          switch (response.body.code) {
            case 666:
              return
            default:
              this.$message.error(response.body.msg)
          }
        })
      }
    },
    // 重置数据
    resetData () {
      clearInterval(this.interval)
      // 各选项信息填写
      this.wechatAccount = ''
      this.isVerification = ''
      // 错误提示
      this.isName = '姓名不能为空!'
      this.isAccount = '微信账号不能为空!'
      this.isNote = '验证码不能为空!'
      // 验证码获取
      this.getCode = '获取验证码'
      this.interval = 60
      // 判断
      this.asName = false
      this.asAccount = false
      this.asnote = false
      this.committing = false
      // 图片文件上传
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
    if (user.wechatUserName && user.wechat) {
      // 已绑定,本地有数据
      this.wechatUserName = user.wechatName
      this.wechatAccount = user.wechat
      this.qrCodeImage = user.wechatQRCode
    } else if (user.wechat) {
      // 已绑定,本地无数据
      this.$store.dispatch('encryptConnection', {
        url: '/wechat/queryWechatUI',
        data: {}
      }).then(response => {
        const data = response.body.data
        const bankcard = {
          wechatName: data.wechatUserName,
          wechatAccount: data.wechat,
          qrCodeImage: data.qrcode
        }
        this.$store.commit('setUser', bankcard)
        this.wechatName = data.wechatUserName
        this.wechatAccount = data.wechat
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
