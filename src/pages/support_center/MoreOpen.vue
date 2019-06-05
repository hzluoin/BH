<template>
<div class="bh-publish_root">
  <header class="bh-background_main">
    <navigation></navigation>
  </header>
  <main>
    <!--搜索框盒子-->
    <div class="container hero">
      <div class="hero-inner search-full">
          <!--<i class="el-icon-search icon_one"></i>-->
          <input type="text" v-model="keyword" placeholder="搜索"  id="query" @keydown.enter="search"/>
          <i slot="prefix" class="el-input__icon el-icon-search" style="position: absolute;left: 10px;top: 0;" @click="search"></i>
      </div>
    </div>
    <div class="bh-publish_settings bg-fff">
      <div class="bh-publish_settings-content bg-fff">
        <el-row>
          <el-col :span="12" class="left_font">
            <a class="bh-color_blue ft13" href="/HelpCenter?type=1" v-if="type == 1">公告中心</a>
            <a class="bh-color_blue ft13" href="/HelpCenter?type=2" v-if="type == 2">帮助中心</a>
            <span class="color-999 ft13"> > {{myname}}</span>
          </el-col>
        </el-row>
      </div>
      <!--具体问题排列-->
      <div class="question_box">
        <span class="ft30 color-333">{{myname}}</span>
        <el-table style="width: 765px;"
                  class="mt20"
                  @cell-click="xiangxi_jump"
                  :show-header=false
                  :data="myData.slice((currentPages-1)*pagesize,currentPages*pagesize)">  <!--//对数据请求的处理，最为重要的一句话表示显示多少数据-->
          <el-table-column
            prop="title"
            show-header="false"
            ><!--里面可以加就是小标题 label="新闻与活动" -->
          </el-table-column>
        </el-table>
      </div>
      <el-row style="text-align: center;" class="mt30">
        <el-col :span="24">
          <el-pagination
            @current-change="handleCurrentChanges"
            :current-page="currentPages"
            :page-size="pagesize"
            :total="TotalCount"
            layout="total, prev, pager, next">
          </el-pagination>
        </el-col>
      </el-row>
      <p class="last_p mt50">
        <span class="bh_li_size">还有其他问题？</span>
        <span class="bh_li_size cur" style="color:#0bb2fe;" @click="callServer">联系客服</span>
      </p>
    </div>
  </main>
  <footer>
    <bh-footer></bh-footer>
  </footer>
</div>
</template>

<script>
import Navigation from '../../components/Navigation'
import BhFooter from '../../components/FooterIndex'
export default {
  components: {
    Navigation,
    BhFooter
  },
  data () {
    return {
      // v-model绑定的输入框的value
      keyword: '',
      // 存type值
      type: '',
      // 存传来的类别id
      get_id: '',
      // 用来接收ajax得到的数据
      myData: [],
      // 默认总条数
      TotalCount: 0,
      // 每页显示的数据条数
      pagesize: 15,
      // 当前页数（默认开始页面
      currentPages: 1,
      // 打开的类别
      myname: ''
    }
  },
  name: 'MoreOpen',
  watch: {
    // keyword () {
    //   this.$router.push({name: 'SearchHelp'})
    // }
  },
  methods: {
    // 联系客服
    callServer () {
      document.getElementById('chatBtn').click()
    },
    // 搜索框函数
    search () {
      let searchs = document.URL
      if (this.keyword) {
        this.$router.push({name: 'SearchHelp', params: {type: this.type, keyword: this.keyword}})
      }
      if (searchs !== document.URL) {
        location.reload()
      }
    },
    handleCurrentChanges: function (currentPages) {
      this.currentPages = currentPages
      let that = this
      this.$http.get('/help/pageListUI', {
        params: {
          type: that.type,
          categotyId: that.get_id,
          pageSize: that.pagesize,
          pageNo: that.currentPages
        }
      }).then(response => {
        that.myData = response.body.data
        that.TotalCount = response.body.data.length
      }, response => {
        this.$message.error(response.body.msg)
      })
    },
    xiangxi_jump: function (row, event, column) {
      this.$router.push({ name: 'FrequentlyAskedQuestion', params: {type: row.type, myId: this.get_id, helpId: row.id} })
    }
  },
  created () {
    this.get_id = this.$route.params.myId
    this.type = this.$route.params.type
    this.myname = this.$route.params.myname
    var that = this
    this.$http.get('/help/pageListUI', {
      params: {
        type: that.type,
        categotyId: that.get_id,
        pageSize: that.pagesize,
        pageNo: that.currentPages
      }
    }).then(response => {
      that.myData = response.body.data
      that.TotalCount = response.body.data.length
    }, response => {
      this.$message.error(response.body.msg)
    })
  }
}
</script>

<style scoped>
  main {
    background-color: #F2F3F8;
    padding-bottom: 80px;
  }

  main>div {
    width: 1200px;
    margin: auto;
  }
  /*居中白底盒子*/
  .bh-publish_settings {
    position: relative;
    margin: 0 auto;
    left: 0;
    top: 0;
    height: auto;
    padding-bottom: 60px;
  }
  /*1.1 内容*/
  /*搜索框盒子*/
  .container {
    min-width: 1160px;
    margin: 0 auto;
    max-width: 1920px;

  }
  .hero {
    background-image: url("https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/support_center/navtu.png");
    background-position: center;
    background-size: cover;
    height: 200px;
    text-align: center;
    width: 100%;
  }
  .hero-inner {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    max-width: 610px;
    margin: 0 auto;
  }
  /*form搜索框*/
  .icon_one{
    position: absolute;
    left: 15px;
    top: 10px;
  }
  .search-full input{
    border: 0px;
    border-radius: 30px;
    box-sizing: border-box;
    color: #999;
    height: 40px;
    padding-left: 40px;
    padding-right: 20px;
    -webkit-appearance: none;
    width: 100%;
  }
  /*搜索框盒子结束*/
  .bh-publish_settings-content {
    padding: 25px 32px 25px 35px;
  }
  /*1.2具体问题排列*/
  .question_box{
    position: relative;
    margin-left: 312px;
    top: 0;
    left: 0;
  }
  /*左上角的字*/
  .left_font{
    height:38px;line-height: 38px;
  }
  .question_box div{
    cursor: pointer ;
  }
  .question_box div:first-child{
    cursor: default;
  }
  .bh-color_blue {
    color:#8ed8fa;
  }
  .last_p{
    text-align: center;
  }
</style>
