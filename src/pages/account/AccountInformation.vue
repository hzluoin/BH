<template>
  <div class="bh-root">
    <div>
      <!--标题-->
      <el-row>
        <el-col :span="24">
          <span class="bg-F4FBFF ft16 color-0BB2FE">{{$t('title.PersonalInformation')}}</span>
        </el-col>
      </el-row>

      <!--个人信息-->
      <el-row class="bh-info">
        <el-col :span="3" style="margin-left: -10px;">
          <el-upload action="" :show-file-list="false" accept="image/*"
                     :on-change="editHeadImage" :multiple="false"
                     :auto-upload="false" list-type="picture">
            <img class="head-image" v-if="user.headImage" :src="user.headImage">
            <img class="head-image" v-else src="../../assets/images/head.png">
          </el-upload>
          <span class="ft12 color-666" style="margin-top: 10px;">实名认证</span>
          <span style="color:#0bb2fe;font-size:14px;cursor: pointer;" @click="$router.push({name: 'Authentication'})" v-if="user.identityAuthenticator!==4">去认证</span>
        </el-col>

        <el-col :span="2" style="margin-left: 66px;">
          <span class="ft14 color-666">手机号码</span>
          <span class="ft14 color-666">邮箱地址</span>
          <span class="ft14 color-666">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
          <span class="ft14 color-666">认证类型</span>
          <span class="ft14 color-666">昵&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;称</span>
          <span class="ft14 color-666">邀&nbsp;请&nbsp;&nbsp;人</span>
        </el-col>

        <el-col :span="8" :offset="1">
          <span class="ft14 color-333">{{user.desensitizationTelephone}}&nbsp;</span>
          <span class="ft14 color-333">{{user.desensitizationEmail}}&nbsp;</span>
          <span style="color:#0bb2fe;font-size:14px;">{{user.desensitizationUsername}}&nbsp;</span>
          <span style="color:#0bb2fe;font-size:14px;cursor: pointer;" v-if="user.identityAuthenticator===0" @click="$router.push({name: 'Authentication'})">去认证</span>
          <!--<span style="color:#0bb2fe;font-size:14px;" v-else-if="user.identityAuthenticator===1 || user.identityAuthenticator===2">初级认证</span>-->
          <!--<span style="color:#0bb2fe;font-size:14px;" v-else-if="user.identityAuthenticator===3">中级认证</span>-->
          <!--初级认证=1,2,初级往中级认证失败-->
          <span style="color:#0bb2fe;font-size:14px;" v-else-if="user.identityAuthenticator >= 1 && user.identityAuthenticator < 3">初级认证</span>
          <!--中级认证=3,中级往高级认证失败-->
          <span style="color:#0bb2fe;font-size:14px;" v-else-if="user.identityAuthenticator >= 3 && user.identityAuthenticator < 4">中级认证</span>
          <span style="color:#0bb2fe;font-size:14px;" v-else-if="user.identityAuthenticator===4">高级认证</span>
          <span style="color:#0bb2fe;font-size:14px;" v-else>&nbsp;</span>
          <span class="ft14 color-333">
            {{user.nickname}}
            <button v-if="user.nickname" class="bh-btn_text bh-color_select" @click="showNickNameDialog=true">修改</button>
            <button v-else class="bh-btn_text bh-color_select" @click="showNickNameDialog=true">去设置</button>
          </span>
          <span class="ft14 color-333">
            <span v-if="user.inviteAccount">{{user.inviteAccount}}</span>
            <button v-else class="bh-btn_text bh-color_select" @click="showInviteDialog=true">请输入邀请码</button>
          </span>
        </el-col>
      </el-row>
    </div>

    <!--登录信息-->
    <el-row>
      <el-col :span="24" style="margin-bottom: 10px;">
        <span class="bh-font_size__big ft16 color-333">登录信息</span>
      </el-col>
      <el-col :span="24" class="bh-thead">
        <el-table :data="loginData" style="width: 100%;">
          <el-table-column label="时间" class="color-666 ft12">
            <template slot-scope="scope">
              <span>{{new Date(scope.row.lCreateTime).format('yyyy-MM-dd hh:mm:ss')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lEquipment" label="登录类型"></el-table-column>
          <el-table-column prop="lIpAddress" label="IP地址"></el-table-column>
          <el-table-column prop="lAddress" label="地点"></el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <nick-name v-if="showNickNameDialog" :visible.sync="showNickNameDialog" :nickname="user.nickname"></nick-name>
    <Invite v-if="showInviteDialog" :visible.sync="showInviteDialog"></Invite>
    <picture-editor v-if="showPictureEditor" :visible.sync="showPictureEditor" :settings="settings" @success="uploadHeadImage"></picture-editor>
  </div>
</template>

<script>
import NickName from './dialog/NickName'
import Invite from './dialog/Invite'
import PictureEditor from '../../components/PictureEditor'
export default {
  components: {
    NickName,
    Invite,
    PictureEditor
  },
  data () {
    return {
      showNickNameDialog: false,
      showInviteDialog: false,
      showPictureEditor: false,
      loginData: [],
      settings: {}
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  created () {
    this.$store.dispatch('encryptConnection', {
      url: '/userinfo/queryLoginInfoUI',
      data: {
        pageSize: '5',
        pageIndex: '1'
      }
    }).then(response => {
      this.loginData = response.body.data
    }).then()
  },
  methods: {
    editHeadImage (file) {
      this.showPictureEditor = true
      this.settings = {
        image: file.url,
        outputSize: 0.1
      }
    },
    uploadHeadImage (data) {
      this.$store.dispatch('updateUserHeadImage', {
        headImage: data
      }).then(response => {
        this.$message.success('用户头像设置成功')
      }, response => {
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
  /*丧心病狂*/
  .bh-root>div:first-child {
    margin-bottom: 40px;
    border: 1px solid #D8D8D8;
    border-radius: 2px;
    height: 230px;
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

  /*个人信息：第一列*/
  .bh-info {
    padding: 15px 10px;
    margin-top: 20px;
  }

  .bh-info .el-col:first-child {
    text-align: center;
  }

  .bh-info .el-col:first-child span{
    display: inline-block;
    width: 100%;
  }

  /*个人信息：第二列*/
  .bh-info>.el-col:nth-child(2) span {
    display: inline-block;
    width: 100%;
    text-align: center;
    line-height: 24px;
  }

  .bh-info>.el-col:last-child span {
    display: inline-block;
    text-align: left;
    width: 100%;
    line-height: 24px;
  }

  .bh-info>.el-col .bh-color_prompt {
    font-size: 14px;
  }

  /*登录信息*/
  .bh-root>.el-row:last-child .bh-font_size__big {
    margin-left: 10px;
  }
  /*更改表头样式*/
  .has-gutter{
    background: white;
  }

  .head-image {
    width: 84px;
    height: 84px;
    border-radius: 100%;
  }
</style>
