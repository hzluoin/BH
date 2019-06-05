<template>
  <div class="bh-publish_root">
    <header class="bh-background_main">
      <navigation></navigation>
    </header>

    <main class="bh-publish_settings">
      <div class="bh-publish_settings-content bg-fff mt10 mb80">
        <!--搜索-->
        <div class="center-lr-scatter por topBox">
          <div class="ft13 color-999">
            <a class="font1 mr5"  href="/HelpCenter?type=2">帮助中心</a>>
            <a class="font1 mr5" target="_blank"  @click="two_jump">{{leftCategotyName}}</a>
          </div>
          <div class="input_size">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/support_center/search.png" class="search">
            <input class="searchInput" type="text" placeholder="搜索" maxlength="20" @keydown.enter="search" v-model="keyword">
          </div>
        </div>
        <el-row>
          <!--左边导航-->
          <el-col :span="6">
            <div class="helpNav">
              <ul >
                <li class="center-float-left li-size-all" v-for="(item, index) in pageListUI" :key="index" @click="qurInfo(item.id)"
                    :class="{liSelect: parseInt(threeId) === item.id}">
                  <span class="por apostrophe-two" v-html="item.title">{{item.title}}</span>
                </li>
                <li class="center-float-left li-size-all font2 cur" v-if="isShowMore" @click="moreBtn(totalCount)">更多 ></li>
              </ul>
            </div>
          </el-col>
          <!--右边内容-->
          <el-col :span="18">
            <div class="bigDiv">
              <div class="askedCenter bh_underline_size">
                <div class="color-333 ft30" v-html="helpInfo.title">{{helpInfo.title}}</div>
                <div class="center-float-left mt30">
                  <img :src="helpInfo.publishUserImage" class="icon" v-if="helpInfo.publishUserImage">
                  <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/support_center/icon.png" class="icon" v-else>
                  <div class="ft15 ml10 left-tb-scatter">
                    <div class="font2 ft15">{{helpInfo.publishUser}}</div>
                    <div class="ft13 color-999 center-float-left">
                      <div class="color-333">{{updateTime}}</div><div class="dot bg-999 ml5 mr5"></div>更新于
                    </div>
                  </div>
                </div>
                <div class="fontAll ft15 color-333" v-html="helpInfo.content">{{helpInfo.content}}</div>
              </div>
              <!--是否有帮助-->
              <div class="isGrade">
                <ul>
                  <li class="bh_li_size">这篇文章有帮助吗？</li>
                  <li>
                    <button class="button-size bg-fff" @click="voterBtn(1)"> √ 是</button>
                    <button class="button-size bg-fff" @click="voterBtn(2)"> × 否</button>
                  </li>
                  <li class="mb50">{{voterCount ? voterCount : 0}}人中有{{hasHelpCount ? hasHelpCount : 0}}人觉得有帮助</li>
                  <li>
                    <span class="bh_li_size">还有其他问题？</span>
                    <span class="bh_li_size cur" style="color:#0bb2fe;" @click="callServer">联系客服</span>
                  </li>
                </ul>
              </div>
            </div>
          </el-col>
        </el-row>
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
      // 左边导航栏
      selectLeftType: '', // 1 公告中心 2帮助中心，一级id
      leftCategotyId: '', // 类别id，二级id
      leftCategotyName: '', // 二级标题
      threeId: '', // 第三级id
      pageSize: '5',
      pageNo: '1',
      pageListUI: {},
      isShowMore: false,
      // 右边导航栏
      helpInfo: {},
      updateTime: '',
      infoId: '',
      // 总人数和有帮助人数
      voterCount: 0,
      hasHelpCount: 0,
      // 是否可以投票
      voter: false,
      // v-model绑定的输入框的value
      keyword: '',
      // 帮助类型
      voterType: '',
      // 页面路径
      now_path: ''
    }
  },
  created () {
    this.now_path = document.URL
    this.selectLeftType = this.$route.params.type
    this.leftCategotyId = this.$route.params.myId
    this.threeId = this.$route.params.helpId
    this.$http.get('/help/pageListUI', {
      params: {
        type: this.selectLeftType,
        categotyId: this.leftCategotyId,
        pageSize: this.pageSize,
        pageNo: this.pageNo
      }
    }).then(response => {
      this.pageListUI = response.body.data
      let totalCount = response.body.totalCount
      if (totalCount > 5) {
        this.isShowMore = true
      }
      this.qurInfo(this.threeId)
    }, response => {
      this.$message.error(response.body.msg)
    })
    this.$http.get('/help/infoUI', {
      params: {
        type: this.$route.params.type,
        id: this.threeId
      }
    }).then(response => {
      this.leftCategotyName = response.body.data.categoryName
      console.log(response.body)
    })
  },
  methods: {
    goBack () {
      if (this.now_path !== document.URL) {
        location.reload()
      }
      // this.$router.replace({path: '/'})
      // replace替换原路由，作用是避免回退死循环
    },
    // 二级跳转
    two_jump () {
      this.$router.push({ name: 'MoreOpen', params: {myId: this.leftCategotyId, type: this.selectLeftType, myname: this.leftCategotyName} })
    },
    // 联系客服
    callServer () {
      document.getElementById('chatBtn').click()
    },
    // 搜索框函数
    search () {
      let searchs = document.URL
      if (this.keyword) {
        this.$router.push({name: 'SearchHelp', params: {type: 2, keyword: this.keyword}})
      }
      if (searchs !== document.URL) {
        location.reload()
      }
    },
    moreBtn (totalCount) {
      this.$http.get('/help/pageListUI', {
        params: {
          type: this.selectLeftType,
          categotyId: this.leftCategotyId,
          pageSize: totalCount,
          pageNo: this.pageNo
        }
      }).then(response => {
        this.pageListUI = response.body.data
        this.isShowMore = false
        this.qurInfo(this.threeId)
      }, response => {
        this.$message.error(response.body.msg)
      })
    },
    // 查询右边文章信息
    qurInfo (_id) {
      this.threeId = _id
      this.infoId = _id
      this.$http.get('/help/infoUI?type=' + this.selectLeftType + '&id=' + this.infoId).then(response => {
        this.helpInfo = response.body.data
        this.voter = this.helpInfo.voter
        this.voterCount = this.helpInfo.voterCount ? this.helpInfo.voterCount : 0
        this.hasHelpCount = this.helpInfo.hasHelpCount ? this.helpInfo.hasHelpCount : 0
        this.getLastDate(+new Date() - this.helpInfo.updateTime)
      }, response => {
        this.$message.error(response.body.msg)
      })
    },
    // 点击是否有帮助
    voterBtn (_type) {
      // 用户是否登录
      if (!this.$store.getters.getUser.loginStatus) {
        // 该文章是否已投票
        if (!window.sessionStorage.getItem(this.selectLeftType + '-' + this.infoId)) {
          window.sessionStorage.setItem(this.selectLeftType + '-' + this.infoId, _type)
          this.voterCount = this.voterCount + 1
          if (parseInt(_type) === 1) {
            this.hasHelpCount = this.hasHelpCount + 1
          }
        } else {
          this.$message.success('您已投过票!')
        }
      } else {
        // 投过票则为true
        if (this.voter !== true) {
          this.$http.get('/help/voterUI', {
            params: {
              type: this.selectLeftType,
              id: this.infoId,
              voterType: _type
            }
          }).then(response => {
            this.qurInfo(this.infoId)
          }, response => {
            this.$message.error(response.body.msg)
          })
        } else {
          this.$message.success('您已投过票!')
        }
      }
    },
    // 获取年月日时（最小的单位是时，一个月内的按照具体的天数（一天内的单位按照小时算），超过一个月显示几月前，超过一年显示几年前）
    getLastDate (_time) {
      // 年(1000*12*30*24*60*60)
      if (_time >= 31104000000) {
        this.updateTime = parseInt(_time / 31104000000).toString() + '年前'
      }
      // 月(1000*30*24*60*60)
      if (_time >= 2592000000 && _time < 31104000000) {
        this.updateTime = parseInt(_time / 2592000000).toString() + '月前'
      }
      // 日(1000*24*60*60)
      if (_time >= 86400000 && _time < 2592000000) {
        this.updateTime = parseInt(_time / 86400000).toString() + '天前'
      }
      // 一天内，一小时前(1000*60*60)
      if (_time >= 3600000 && _time < 86400000) {
        this.updateTime = parseInt(_time / 3600000).toString() + '小时前'
      }
      // 一天内，一个小时之内(1000*60)
      if (_time >= 60000 && _time < 3600000) {
        this.updateTime = '当前'
      }
    }
  },
  mounted () {
    if (window.history && window.history.pushState) {
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  destroyed () {
    window.removeEventListener('popstate', this.goBack, false)
  }
}
</script>

<style scoped>
  .topBox{height: 50px;}
  .bh-publish_root{background-color: #F2F3F8;}
  .bh-publish_settings{ width: 1200px;margin: auto;}

  /*1.1标题*/
  .bh-publish_explain>div:first-child{background: #f9f7fe;height: 60px;line-height: 60px;padding-left: 18px;}
  /*2.1内容*/
  .bh-publish_settings-content {padding: 10px 36px 90px 36px;position: relative;top: 0;left: 0;min-height: 526px;}
  /*下划线*/
  .bh_underline_size{border-bottom:1px solid #ddd;width:760px;margin-bottom: 35px;padding-bottom: 50px;}
  /*侧边栏*/
  .helpNav{width: 228px;margin-top: 60px;}
  /*中心内容*/
  .bigDiv{width: 760px;position: relative;left: 0;margin-top: 60px;}

  .bh_li_size{font-size:15px;color:#333;}
  .button-size{border:1px solid #0bb2fe;border-radius:4px;width:112px;height:28px;color: #0BB2FE;margin: 15px 6px 15px 6px;}
  .isGrade{text-align: center;}
  .li-size-all{font-size:16px;color:#666;width:228px;height:64px;cursor:pointer;padding:0 9px;}
  .liSelect{color:#fff;background-color: #0BB2FE;border-radius: 4px;}
  .input_size{border: 1px solid #CFCFCF;border-radius: 100px;width: 280px;height: 40px;position: absolute;right: 0;}
  .search{position: absolute;width: 14px;height: 14px;left: 12px;top: 13px;}
  .searchInput{position: absolute;width: 240px;left: 30px;border: 0;padding: 0;height: 90%;border-radius: 0;top: 5%;font-size: 14px;}
  .bh-publish_root .font1{color: #8ED8FA;}
  .bh-publish_root .font2{color: #0BB2FE;}
  .icon{width: 39px;height: 37px;}
  .dot{position: relative;width: 2px;height: 2px;border-radius: 50px;}
</style>
