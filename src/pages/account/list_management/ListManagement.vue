<template>
  <div class="bh-root">
    <div style="margin-bottom: 80px;">
      <!--信任标题-->
      <el-row>
        <el-col :span="24">
          <span class="bg-F4FBFF ft16 color-0BB2FE">信任名单</span>
        </el-col>
      </el-row>

      <!--信任警告-->
      <el-row>
        <el-col :span="24">
          <i class="iconfont icon-tanhao"></i>
          <span class="ft12 bh-color_prompt">设置信任名单后，对方发布的交易信息将会推送给您。</span>
        </el-col>
      </el-row>

      <!--信任名单-->
      <el-row  style="margin: 2px 2px 50px 2px;">
        <el-col :span="24">
          <el-table :data="trustList" v-loading="trustListLoading" border style="width: 100%">
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <el-table-column label="信任时间" align="center" min-width="95">
              <template slot-scope="scope">
                <span>{{new Date(scope.row.createDate).format('yyyy-MM-dd')}}</span><br>
                <span>{{new Date(scope.row.createDate).format('hh:mm:ss')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="assetCount" label="交易次数" align="center"></el-table-column>
            <el-table-column label="好评度" align="center">
              <template slot-scope="scope">
                <span>{{Number((((scope.row.goodCommentCount * 2) / (scope.row.badCommentCount + (scope.row.goodCommentCount * 2))) * 100) || 0).cut(2)}}%</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240">
              <template slot-scope="scope">
                <el-button round style="height: 21px;" class="bh-btn_plain" size="mini" @click="showInformation(scope.row.userId, scope.row.name)">查看</el-button>
                <el-button round style="height: 21px;" class="bh-btn_plain" size="mini" @click="removeTrust(scope.row.id)">解除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!--信任名单-->
      <el-row>
        <router-view/>
      </el-row>
    </div>
    <div>
      <!--黑名单标题-->
      <el-row>
        <el-col :span="24">
          <span class="bg-F4FBFF ft16 color-0BB2FE">黑名单</span>
        </el-col>
      </el-row>

      <!--黑名单警告-->
      <el-row>
        <el-col :span="24">
          <i class="iconfont icon-tanhao"></i>
          <span class="ft12 bh-color_prompt">拉黑对方后您将无法再和对方产生交易订单，您可以在黑名单管理里面解除该限制。</span>
        </el-col>
      </el-row>
      <!--黑名单-->
      <el-row  style="margin: 2px 2px 50px 2px;">
        <el-col :span="24">
          <el-table :data="blackList" v-loading="blackListLoading"  border style="width: 100%">
            <el-table-column prop="name" label="姓名" align="center"></el-table-column>
            <el-table-column label="拉黑时间" align="center" min-width="95">
              <template slot-scope="scope">
                <span>{{new Date(scope.row.createDate).format('yyyy-MM-dd')}}</span><br>
                <span>{{new Date(scope.row.createDate).format('hh:mm:ss')}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="assetCount" label="交易次数" align="center"></el-table-column>
            <el-table-column label="好评度" align="center">
              <template slot-scope="scope">
                <span>{{Number((((scope.row.goodCommentCount * 2) / (scope.row.badCommentCount + (scope.row.goodCommentCount * 2))) * 100) || 0).cut(2) + '%'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240">
              <template slot-scope="scope">
                <el-button round size="mini" style="height: 21px;" class="bh-btn_plain" @click="removeBlack(scope.row.id)">
                  <span>解除</span>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!--黑名单-->
      <el-row>
        <!--<router-view/>-->
      </el-row>
      <!--查看管理明细-->
      <management-sheet :visible.sync="managementSheet" v-if="managementSheet" :userId="userId" :username="username"></management-sheet>
    </div>
  </div>
</template>

<script>
import ManagementSheet from './dialog/ManagementSheet'
export default {
  name: 'ListManagement',
  components: {
    ManagementSheet
  },
  data () {
    return {
      // 白名单操作中
      trustListLoading: false,
      blackListLoading: false,
      managementSheet: false,
      trustList: [],
      blackList: [],
      // 查看详情的用户ID
      userId: '',
      username: ''
    }
  },
  methods: {
    // 查看对方信息
    showInformation (userId, username) {
      this.managementSheet = true
      this.userId = userId
      this.username = username
    },
    query (type, pageIndex, pageSize) {
      this.$store.dispatch('encryptConnection', {
        url: '/userTrust/findAllUserTrust',
        data: {
          pageSize: pageSize || 10,
          pageIndex: pageIndex || 0,
          type: type
        }
      }).then(response => {
        let list = response.body.data
        if (type === 1) {
          this.trustList = list
        } else {
          this.blackList = list
        }
      }, response => {
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 信任名单移除
    removeTrust (id) {
      console.log(id)
      this.trustListLoading = true
      this.$store.dispatch('encryptConnection', {
        url: '/userTrust/removeUserTrustById',
        data: {
          id: id.toString()
        }
      }).then(response => {
        this.trustListLoading = false
        this.$message.success('操作成功！')
        this.query(1)
      }, response => {
        this.trustListLoading = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    },
    // 黑名单移除
    removeBlack (id) {
      this.blackListLoading = true
      this.$store.dispatch('encryptConnection', {
        url: '/userTrust/removeUserTrustById',
        data: {
          id: id.toString()
        }
      }).then(response => {
        this.blackListLoading = false
        this.$message.success('操作成功！')
        this.query(2)
      }, response => {
        this.blackListLoading = false
        switch (response.body.code) {
          case 666:
            return
          default:
            this.$message.error(response.body.msg)
        }
      })
    }
  },
  created () {
    // 信任名单数据
    this.query(1)
    // 黑任名单数据
    this.query(2)
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
  .bh-root>div:last-child {
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
  /*.bh-root>div>.el-row:nth-child(3) {*/
  /*padding-left: 5px;*/
  /*}*/

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
  /*button样式*/
  .el-button{
    line-height: 0;
  }
  .bh-btn_plain {
    color: #0BB2FE;
    background-color: #FFF;
    border: 1px solid #0BB2FE;
    min-width: 0px;
  }
</style>
