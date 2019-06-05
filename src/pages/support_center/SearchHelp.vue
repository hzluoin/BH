<template>
  <!--搜索结果-->
  <div class="bh-publish_root">
    <header class="bh-background_main">
      <navigation></navigation>
    </header>
    <main class="bh-publish_settings">
      <div class="bh-publish_settings-content mt10 mb80 bg-fff">
        <div class="center-lr-scatter por topBox">
          <div class="ft13 color-999">
            <a class="font1 mr5 cur" v-if="type === '1'" href="/HelpCenter?type=1">公告中心</a>
            <a class="font1 mr5 cur" v-if="type === '2'|| 2" href="/HelpCenter?type=2">帮助中心</a>>
            <span class="ml5">搜索结果</span>
          </div>
          <div class="input_size">
            <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/support_center/search.png" class="search" @click="search">
            <input class="searchInput" type="text" placeholder="搜索" maxlength="20" @keydown.enter="search" v-model="now_keyword">
          </div>
        </div>
        <div class="content">
          <div class="ft30 color-333 bold mt60">搜索结果</div>
          <!---->
          <div class="color-999 ft15 mt25" v-if="myData.length !== 0">“{{keyword}}”的结果: <span class="color-333">{{myData.length}}</span>条</div>
          <div class="color-999 ft15 mt25" v-else>“{{keyword}}”没有结果</div>
          <div class="color-333 ft18 mt35" v-if="myData.length !== 0">知识库
            <!---->
            <div v-for="(items,index) in myData" :key="index">
              <ul class="contentList mt20">
                <li class="bh_underline_size" :class="{borderTop: index === 0}">
                  <div class="font2 ft15 mt25">
                    <span class="cur" @click="xiangxi_jump(index)">{{items.title}}</span>
                    <span class="ml30 color-999 ft13">
                    <img src="https://8bihui-webapp.oss-cn-beijing.aliyuncs.com/images/support_center/agree.png" class="agree mr5">{{items.hasHelpCount}}
                  </span>
                  </div>
                  <div class="ft13 color-999 mt10 center-float-left">
                    <a class="font1 mr5 cur" v-if="items.type === 1" href="/HelpCenter?type=1">公告中心 ></a>
                    <a class="font1 mr5 cur" v-if="items.type === 2" href="/HelpCenter?type=2">帮助中心 ></a>
                    <span class="font1 ml5 cur" @click="twolevel_jump(index,$event)">{{items.categotyName}}</span>
                    <span class="dot bg-999 ml5"></span>
                    <span class="ml5">{{items.publishUser}}</span>
                    <span class="dot bg-999 ml5"></span>
                    <span class="color-333 ml5">{{newsTime[index]}}</span>
                  </div>
                  <div class="color-333 ft15 mt20 apostrophe-three text_ConTent">{{items.contentText}}</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="color-999 ft15 mt35" v-else>
            <span class="color-333 ft18">知识库</span><br>
            <p class="mt70">“{{keyword}}”没有结果。<a class="font2" href="/HelpCenter?type=1"> 浏览知识库</a></p>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <bh-footer :full-width="true"></bh-footer>
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
      // 存传来的type
      type: '',
      // 现在从新搜索的字段
      now_keyword: '',
      // 存传过来的查询字段
      keyword: '',
      // 时间
      updateTime: '',
      // 存处理好的时间
      newsTime: [],
      // 存传来的数据
      myData: []
    }
  },
  created () {
    this.type = this.$route.params.type
    this.keyword = this.$route.params.keyword
    let that = this
    this.$http.get('/help/searchUI', {
      params: {
        keyword: that.keyword
      }
    }).then(response => {
      that.myData = response.body.data
      for (let i = 0; i < response.body.data.length; i++) {
        that.newsTime[i] = that.$options.methods.getLastDate(+new Date() - response.body.data[i].publishTime)
      }
    }, response => {
      this.$message.error(response.body.msg)
    }
    )
  },
  computed: {},
  methods: {
    // 搜索框函数
    search () {
      if (this.keyword) {
        this.$router.push({name: 'SearchHelp', params: {type: this.type, keyword: this.now_keyword}})
        this.type = this.$route.params.type
        this.keyword = this.$route.params.keyword
        let that = this
        this.$http.get('/help/searchUI', {
          params: {
            keyword: that.keyword
          }
        }).then(response => {
          that.myData = response.body.data
        }, response => {
          this.$message.error(response.body.msg)
        }
        )
      }
    },
    // 详细跳转
    xiangxi_jump (index) {
      this.$router.push({ name: 'FrequentlyAskedQuestion',
        params:
          {
            type: this.myData[index].type,
            myId: this.myData[index].categoryId,
            helpId: this.myData[index].id
          } })
    },
    // 二级标题跳转
    twolevel_jump: function (index, event) {
      let name = event.currentTarget.innerHTML
      // alert('开始跳转，传的值为:' + name + this.myData[index].categoryId + '类别为' + this.myData[index].type)
      this.$router.push(
        {
          name: 'MoreOpen',
          params:
            {
              myId: this.myData[index].categoryId,
              type: this.myData[index].type,
              myname: name
            }
        })
    },
    // 获取年月日时（最小的单位是时，一个月内的按照具体的天数（一天内的单位按照小时算），超过一个月显示几月前，超过一年显示几年前）
    getLastDate (_time) {
      // 年(1000*12*30*24*60*60)
      if (_time >= 31104000000) {
        this.updateTime = parseInt(_time / 31104000000).toString() + '年前'
        return this.updateTime
      }
      // 月(1000*30*24*60*60)
      if (_time >= 2592000000 && _time < 31104000000) {
        this.updateTime = parseInt(_time / 2592000000).toString() + '月前'
        return this.updateTime
      }
      // 日(1000*24*60*60)
      if (_time >= 86400000 && _time < 2592000000) {
        this.updateTime = parseInt(_time / 86400000).toString() + '天前'
        return this.updateTime
      }
      // 一天内，一小时前(1000*60*60)
      if (_time >= 3600000 && _time < 86400000) {
        this.updateTime = parseInt(_time / 3600000).toString() + '小时前'
        return this.updateTime
      }
      // 一天内，一个小时之内(1000*60)
      if (_time >= 60000 && _time < 3600000) {
        this.updateTime = '当前'
        return this.updateTime
      }
    }
  }
  // updated () {
  //   console.log('==更新成功==')
  //   console.log(this.type)
  //   alert(typeof this.type)
  // }
}
</script>

<style scoped>
  .topBox{height: 50px;}
  .bh-publish_root{background-color: #F2F3F8;}
  .bh-publish_settings{ width: 1200px;margin: auto;}
  .bh-publish_settings-content{padding:10px 36px 90px 36px;position: relative;top: 0;left: 0;min-height: 526px;}
  /*下划线*/
  .bh_underline_size{border-bottom:1px solid #ddd;width:100%;padding-bottom:20px;position: relative;left: 0;top: 0;}
  .borderTop{border-top:1px solid #ddd;}
  /*搜索框*/
  .input_size{border: 1px solid #CFCFCF;border-radius: 100px;width: 280px;height: 40px;position: absolute;right: 0;}
  .search{position: absolute;width: 14px;height: 14px;left: 12px;top: 13px;}
  .searchInput{position: absolute;width: 240px;left: 30px;border: 0;padding: 0;height: 90%;border-radius: 0;top: 5%;font-size: 14px;}
  .bh-publish_root .font1{color: #8ED8FA;}
  .bh-publish_root .font2{color: #0BB2FE;}
  .bh-publish_root .content{width: 528px;}
  .bh-publish_root .contentList{position: relative;width: 100%;top:0;left: 0;}
  .agree{position: relative;width: 13px;height: 13px;}
  .dot{position: relative;width: 2px;height: 2px;border-radius: 50px;}
  /*内容盒子*/
  .text_ConTent{position: relative;width: 100%;height: 70px;left: 0;top: 0;}
</style>
