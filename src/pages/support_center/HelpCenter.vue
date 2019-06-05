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
      <div class="bh-publish_settings">
        <div class="bh-publish_settings-content bg-fff">
          <el-row class="bh-margin-size">
            <el-col :span="12">
              <el-button plain class="bh-button-size bh_nav_size" id="announcement" @click="select('announcementCenter')">
                公告中心
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button plain class="bh-button-size bh_nav_size" id="helpCenter" @click="select('helpCenter')">
                帮助中心
              </el-button>
            </el-col>
          </el-row>
          <!--公告中心解释明细-->
          <div v-if="selected==='announcementCenter'">
            <div class="xunhuan_box" v-for="(itemone,index) in Announcement" :key="itemone.id">
              <span class="bh-nav-all">{{itemone.category}}</span>
              <ul>
                <li v-for="(value1,indexs) in itemone.helps" @click="tellcategory_Jump(index,indexs)" :key="value1.id">{{value1.title}}</li>
                <span class="bh_more cur ft14"  @click="telltitle_Jump(index)"  v-if=itemone.hasMore>更多 ></span>
              </ul>
            </div>
          </div>
          <!--帮助中心解释明细-->
          <div class="helpCenter" v-else-if="selected==='helpCenter'">
              <div class="xunhuan_box" v-for="(itemtwo,index) in myhelp" :key="itemtwo.id">
                <span class="bh-nav-all">{{itemtwo.category}}</span>
                <ul>
                  <li v-for="(value2,indexs) in itemtwo.helps" :key="value2.id" @click="category_Jump(index,indexs)">{{value2.title}}</li>
                  <span class="bh_more cur ft14"  @click="title_Jump(index)" v-if=itemtwo.hasMore>更多 ></span>
                </ul>
              </div>
          </div>
        </div>
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
      // 存其他页面跳转此页的type值
      else_type: 1,
      // 切换
      selected: 'announcementCenter',
      // v-model绑定的输入框的value
      keyword: '',
      // 存type值
      // type: '',
      // 用来接收传来的得到公告中心的数据
      Announcement: [],
      // 用来接收传来的得到帮助中心的数据
      myhelp: [],
      // 分类名
      category: '',
      // 帮助中心类别id
      categoryId: [],
      // 公告中心类别id
      tellId: [],
      // 帮助中心title的id
      helpsid: '',
      // 公告中心title的id
      tellsid: []
    }
  },
  computed: {},
  methods: {
    // 搜索框函数
    search () {
      if (this.keyword) {
        this.$router.push({name: 'SearchHelp', params: {type: this.else_type, keyword: this.keyword}})
      }
    },
    select: function (key) {
      switch (key) {
        case 'announcementCenter':
          document.getElementById('helpCenter').classList.remove('btn_hover')
          document.getElementById('announcement').classList.add('btn_hover')
          this.selected = 'announcementCenter'
          break
        case 'helpCenter':
          document.getElementById('announcement').classList.remove('btn_hover')
          document.getElementById('helpCenter').classList.add('btn_hover')
          this.selected = 'helpCenter'
          break
      }
    },
    // 公告中心类别跳转
    telltitle_Jump (index) {
      let xiaobiao = index
      this.$router.push({ name: 'MoreOpen', params: {myId: this.tellId[xiaobiao], type: 1, myname: this.Announcement[xiaobiao].category} })
    },
    // 公告中心的一个类别下的标题跳转,indexs是点击的li的下标
    tellcategory_Jump (index, indexs) {
      this.tellsid = this.Announcement[index].helps[indexs].id
      this.$router.push({ name: 'FrequentlyAskedQuestion', params: { type: 1, myId: this.tellId[index], helpId: this.tellsid } })
      // alert(this.tellsid)
    },
    // 帮助中心类别跳转
    title_Jump (index) {
      let xiaobiao = index
      this.$router.push({ name: 'MoreOpen', params: {myId: this.categoryId[xiaobiao], type: 2, myname: this.myhelp[xiaobiao].category} })
    },
    // 帮助中心的一个类别下的标题跳转,indexs是点击的li的下标
    category_Jump (index, indexs) {
      this.helpsid = this.myhelp[index].helps[indexs].id
      this.$router.push({ name: 'FrequentlyAskedQuestion', params: { type: 2, myId: this.categoryId[index], helpId: this.helpsid } })
    }
  },
  created () {
    //  页面打开拉取数据渲染
    let searchs = location.search
    this.else_type = searchs.charAt(6)
    let that = this
    this.$http.get('/help/listUI', {
      params: {
        type: 2
      }
    }).then(response => {
      that.myhelp = response.body.data
      if (response.body.data[0]) {
        that.category = response.body.data[0].category
        // 循环将id存入你写好的空对象内
        for (let i = 0; i < response.body.data.length; i++) {
          that.categoryId[i] = response.body.data[i].categoryId
        }
      }
    }, response => {
      this.$message.error(response.body.msg)
    })
    this.$http.get('/help/listUI', {
      params: {
        type: 1
      }
    }).then(response => {
      that.Announcement = response.body.data
      if (response.body.data[0]) {
        that.category = response.body.data[0].category
        // 循环将id存入你写好的空对象内
        for (let i = 0; i < response.body.data.length; i++) {
          that.tellId[i] = response.body.data[i].categoryId
        }
      }
    }, response => {
      this.$message.error(response.body.msg)
    })
  },
  mounted () {
    document.getElementById('announcement').classList.add('btn_hover')
    if (this.else_type === '1') {
      this.selected = 'announcementCenter'
      this.$options.methods.select.bind(this)('announcementCenter')
      document.getElementById('helpCenter').classList.remove('btn_hover')
      document.getElementById('announcement').classList.add('btn_hover')
    } else {
      this.selected = 'helpCenter'
      this.$options.methods.select.bind(this)('helpCenter')
      document.getElementById('announcement').classList.remove('btn_hover')
      document.getElementById('helpCenter').classList.add('btn_hover')
    }
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

  /*1.发布交易说明*/
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
  .search-full{
    position: relative;

  }
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
  /*1.1标题*/
  .bh-publish_explain>div:first-child{
    background: #f9f7fe;
    height: 60px;
    line-height: 60px;
    padding-left: 18px;
  }
  .btn_hover{
    background: #fff !important;
    border-color: #409EFF !important;
    color: #409EFF !important;
  }
  /*循环盒子*/
  .xunhuan_box{
    width: 46%;
    height: 450px;
    margin-left: 45px;
    position: relative;
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    text-align: left;
  }
  /*2.1内容*/
  .bh-publish_settings-content {
    padding: 25px 18px 25px 18px;
  }
  /*更多*/
  .bh_more{
    color:#0bb2fe;
    position: absolute;
    bottom: 50px;
  }
  /*标题*/
  .bh-nav-all{
    font-size:18px;
    color:#333;
    margin-bottom: 30px;
    font-weight:bold;
  }
  /*li 字体*/
  li {
    font-size:16px;
    color:#333;
    cursor:pointer;
    height: 55px;
    line-height: 55px;
    border-bottom: 1px solid #DDD;
    width: 93%;
  }
  ul li:first-child{
    margin-top: 14px;
  }
  ul{
    max-height: 336px;
  }
  /*按钮标题*/
  .bh_nav_size{
    font-size:22px;
    color:#999;
  }
  /*按钮*/
  .bh-button-size{
    border:1px solid #bdbdbd;
    border-radius:4px;
    width:518px;
    height:62px;
    background: white;
  }
  /*内容居中*/
  .bh-margin-size{
    text-align: center;
    margin-bottom: 50px;
    margin-top: 20px;
  }
  .helpCenter{
    position: relative;
    margin:  0 auto;
    padding-bottom:62px;
  }
</style>
