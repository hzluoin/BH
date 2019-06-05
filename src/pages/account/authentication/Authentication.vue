<template>
  <div class="bh-root">
    <div>
      <!--标题-->
      <el-row>
        <el-col :span="24">
          <span class="bg-F4FBFF ft16 color-0BB2FE">{{$t('title.VerificationPersonalIdentity')}}</span>
        </el-col>
      </el-row>

      <!--警告-->
      <el-row>
        <el-col :span="24">
          <i class="iconfont icon-tanhao"></i>
          <span class="ft12 bh-color_prompt">为了您的资产安全，修改资金密码24小时内不允许提币。</span>
        </el-col>
      </el-row>

      <!--个人实名认证-->
      <el-row>
        <router-view/>
      </el-row>
    </div>

    <!--帮助呢-->
    <el-row class="bg-F4FBFF">
      <el-col :span="24" class="ft14 color-666">
        <span>1、没有数字资产不知道怎么开始交易？<a target="_blank" href="https://8bihui.zendesk.com/hc/zh-cn/community/posts/360022463491-5-%E5%9C%BA%E5%A4%96%E4%BA%A4%E6%98%93.com" class="bh-btn_link">点击学习如何利用场外交易BTC、ETC、ETH</a></span>
        <span>2、已有数字资产不知道怎么充币到8bihui？<a target="_blank" href="https://8bihui.zendesk.com/hc/zh-cn/community/posts/360022580772-3-2-%E5%85%85%E5%B8%81" class="bh-btn_link">点击学习如何充币到平台</a></span>
      </el-col>
    </el-row>

    <!--认证详情呢-->
    <el-row>
      <el-col :span="24">

        <table class="bh-table">
          <thead>
            <tr>
              <td></td>
              <td :class="{'bh-color_select': identityAuthenticator===0}"><span>未认证</span><span v-if="identityAuthenticator===0">（当前级别）</span></td>
              <td :class="{'bh-color_select': identityAuthenticator===1}"><span>初级认证</span><span v-if="identityAuthenticator===1 || identityAuthenticator===2">（当前级别）</span></td>
              <td :class="{'bh-color_select': identityAuthenticator===2}"><span>中级认证</span><span v-if="identityAuthenticator===3">（当前级别）</span></td>
              <td :class="{'bh-color_select': identityAuthenticator===3}"><span>高级认证</span><span v-if="identityAuthenticator===4">（当前级别）</span></td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>充币</td>
              <td><i class="iconfont el-icon-check"></i></td>
              <td><i class="iconfont el-icon-check"></i></td>
              <td><i class="iconfont el-icon-check"></i></td>
              <td><i class="iconfont el-icon-check"></i></td>
            </tr>
            <tr>
              <td>提币</td>
              <td><i class="iconfont el-icon-close"></i></td>
              <td><i class="iconfont el-icon-check"></i></td>
              <td><i class="iconfont el-icon-check"></i></td>
              <td><i class="iconfont el-icon-check"></i></td>
            </tr>
            <tr>
              <td>场外交易</td>
              <td><i class="iconfont el-icon-close"></i></td>
              <td><span>单笔限额500人民币</span></td>
              <td><span>单笔限额10万人民币</span></td>
              <td><span>单笔限额100万人民币</span></td>
            </tr>
          </tbody>
        </table>

      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  computed: {
    // 实名认证
    identityAuthenticator () {
      const level = Number(this.$store.getters.getUser.identityAuthenticator)
      this.control(level)
      return level
    }
  },
  methods: {
    control (level) {
      //   "0": "未认证",
      //   "1": "已通过初级认证",
      //   "2": "中级认证:人工审核中",
      //   "2.1": "不是手持证件照",
      //   "2.2": "图片不清晰",
      //   "2.3": "不是本人",
      //   "2.4": 其他,取后台原因说明,
      //   "3": "已通过中级认证",
      //   "4": "已通过高级认证"
      switch (level) {
        case 0:
          this.$router.push({name: 'AuthenticationLow'})
          break
        case 1:
          this.$router.push({name: 'AuthenticationMedium'})
          break
        case 2:
          this.$router.push({name: 'AuthenticationMediumAudit'})
          break
        case 2.1:
          this.$router.push({name: 'AuthenticationMediumAudit'})
          break
        case 2.2:
          this.$router.push({name: 'AuthenticationMediumAudit'})
          break
        case 2.3:
          this.$router.push({name: 'AuthenticationMediumAudit'})
          break
        case 2.4:
          this.$router.push({name: 'AuthenticationMediumAudit'})
          break
        case 3:
          this.$router.push({name: 'AuthenticationHigh'})
          break
        case 4:
          this.$router.push({name: 'AuthenticationHigh'})
          break
        default:
          if (level >= 3 && level < 4) {
            // 3.52中级往高级认证失败
            this.$router.push({name: 'AuthenticationHigh'})
          }
      }
    }
  },
  created () {
    if (!this.$store.getters.getUser.email) {
      this.$alert('请先前往邮箱绑定', '绑定邮箱', {
        confirmButtonText: '确定',
        callback: action => {
          this.$router.push({name: 'Email'})
        }
      })
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
  }

  /*路由的标题*/
  .bh-root>div>.el-row:first-child {
    height: 34px;
    min-height: 34px;
    line-height: 34px;
    border: none;
    padding-left: 0;
  }

  .bh-root>div>.el-row:first-child span {
    display: block;
    height: 34px;
    line-height: 34px;
    padding-left: 8px;
  }

  /*警告*/
  .bh-root>div>.el-row:nth-child(2) {
    height: 17px;
    min-height: 17px;
    line-height: 17px;
    margin-bottom: 24px;
    vertical-align: middle;
    padding-left: 5px;
  }

  .bh-root .icon-tanhao {
    margin-right: 6px;
    font-size: 12px;
  }

  /*认证哦:我你双手感觉你的温柔，真的有点透不过气*/
  .bh-root>div>.el-row:nth-child(3) {
    padding-left: 5px;
  }

  .bh-root>div>.el-row:nth-child(3) .el-row {
    margin-bottom: 17px;
  }

  .bh-root>div>.el-row:nth-child(3) .el-row .el-col {
    height: 34px;
    line-height: 34px;
  }

  .bh-authentication_low div, .bh-authentication_medium div, .bh-authentication_high div {
    display: inline-block;
  }

  /*灰色下划线*/
  .bh-authentication_low, .bh-authentication_medium, .bh-authentication_high {
    border-bottom: 2px solid #D8D8D8;
    text-align: left;
  }

  .bh-authentication_low .el-col-24 *, .bh-authentication_medium .el-col-24 *,.bh-authentication_high .el-col-24 * {
    margin: 0 5px;
  }

  /*低级认证:蓝色下划线*/
  .bh-authentication_low>div div:first-child, .bh-authentication_medium>div div:nth-child(3) ,.bh-authentication_high>div div:last-child {
    border-bottom: 2px solid #0BB2fE;
    height: 34px !important;
    margin-bottom: -2px;
    margin-left: 0;
  }

  /*帮助啊*/
  .bh-root>.el-row:nth-child(2) {
    padding: 24px 12px;
    margin-bottom: 41px;
  }

  .bh-root>.el-row:nth-child(2) span {
    display: inline-block;
    width: 100%;
    line-height: normal;
    vertical-align: middle;
  }

  /*绿勾勾、红叉叉*/
  .el-icon-check {
    color: #11DF61;
  }
  .el-icon-close {
    color: #FE652E;
  }
</style>
