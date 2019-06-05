<template>
  <div class="bh-root">
    <header class="bh-background_main">
      <!--导航-->
      <navigation></navigation>
    </header>

    <main style="background: #f2f3f8;height: 3200px;">
      <!--显示-->
      <div style="opacity:0.92;background:#2c3253;width:100%;height:300px;text-align: center;line-height: 300px;" id="particles-js">
        <span style="font-size:38px;color:#ffffff;z-index: 1;position: relative;">上币申请信息</span>
      </div>
      <!--申请人信息-->
      <div style="background:#ffffff;width:1200px;height:2800px;margin: -100px auto 20px auto;position: relative;">
        <div style="background:#f9f7fe;width:1200px;height:60px;line-height: 60px;text-align: center;">
          <span class="span_all">*</span>
          <span style="font-size:14px;">为必填项，请务必认真填写完整</span>
        </div>
        <!--基本信息-->
        <div>
          <el-row>
            <span class="is_span" style="">申请人信息</span>
            <ul class="ul_all">
              <li class="li_all">您的名字以及公司职称
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 李磊-湖南360科技公司-CTO" style="margin-left: 80px;">
              </li>
              <li class="li_all">您的企业邮箱地址
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 2828822@360.com" style="margin-left: 108px;" >
              </li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 10px 0 10px 20px;"></div>
        <!--关于币种-->
        <div>
          <el-row>
            <span class="is_span">币种信息</span>
            <ul class="ul_all">
              <li class="li_all">公司名称
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 湖南360科技公司" style="margin-left: 164px;">
              </li>
              <li class="li_all">币种名称(Token Name)
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 EOS-token" style="margin-left: 69px;">
              </li>
              <li class="li_all">币种logo
                <span class="span_all">*</span>
                <el-button style="background:#f1f1f1;border:0.5px solid #a4a4a4;border-radius:2px;width:82px;height:27px;padding: 0;margin-left:161px;">
                  <span style="font-size:12px;color:#333333;">选择文件</span>
                </el-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <span style="font-size:14px;color:#333333;">为选择任何文件</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span style="font-size:14px;color:#333333;">请选择png格式，尺寸大小为52*52的图片</span>
              </li>
              <li class="li_all">币种代码(Token Symbol)
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 eos" style="margin-left: 59px;">
              </li>
              <li class="li_all">币种类型
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 ERC20" style="margin-left: 164px;">
              </li>
              <li class="li_all">发行总量
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 12200" style="margin-left: 164px;">
              </li>
              <li class="li_all">当前流通量
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 1231232323" style="margin-left: 150px;">
              </li>
              <li class="li_all">Token链接地址
                <input type="text" class="input_all" placeholder="在Coinmarketcap的链接地址" style="margin-left: 133px;">
              </li>
              <li class="li_all">是否上线交易平台
                <span class="span_all">*</span>
                <el-radio v-model="radioOne" label="1" style="margin-left: 110px;">是</el-radio>
                <el-radio v-model="radioOne" label="2">否</el-radio>
              </li>
              <li class="li_all">上线的交易平台
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 8bihui" style="margin-left: 122px;">
              </li>
              <li class="li_all">Token24小时成交量
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 您的Token/coin在所上线交易所的24小时成交量" style="margin-left: 92px;">
              </li>
              <li class="li_all">Token当前价格(CNY)
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 232.1" style="margin-left: 84px;">
              </li>
              <li class="li_all">持有Token用户数量
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 5656" style="margin-left: 95px;">
              </li>
              <li class="li_all">币种发行时间
                <input type="text" class="input_all" placeholder="如 年/月/日" style="margin-left: 146px;">
              </li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 10px 0 10px 20px;"></div>
        <!--关于项目-->
        <div>
          <el-row>
            <span class="is_span">项目信息</span>
            <ul class="ul_all">
              <li class="li_all">官方网站
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 btc.com" style="margin-left: 164px;">
              </li>
              <li class="li_all">英文版白皮书
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 链接地址" style="margin-left: 136px;">
              </li>
              <li class="li_all">中文版白皮书
                <input type="text" class="input_all" placeholder="如 链接地址" style="margin-left: 146px;">
              </li>
              <li class="li_all">项目介绍
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="" style="height:109px; margin-left: 164px;">
              </li>
              <li class="li_all">项目进展到哪个阶段
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="" style="height:109px;margin-left: 94px;">
              </li>
              <li class="li_all">长期目标以及如何实现
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="" style="height:109px;margin-left: 80px;">
              </li>
              <li class="li_all">项目是否可以看到产品
                <span class="span_all">*</span>
                <el-radio v-model="radioTwo" label="1" style="margin-left: 82px;">是</el-radio>
                <el-radio v-model="radioTwo" label="2">否</el-radio>
              </li>
              <li class="li_all">项目在Github上的链接地址
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="链接地址" style="margin-left: 48px;">
              </li>
              <li class="li_all">项目成员
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 李磊、江青、王强、李国涛" style="margin-left: 164px;">
              </li>
              <li class="li_all">团体顾问
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 薛蛮子顾问能亲自联系我们，会增加上线机会" style="margin-left: 164px;">
              </li>
              <li class="li_all">团体人数
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="如 全职30人 非全职50人" style="margin-left: 164px;">
              </li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 10px 0 10px 20px;"></div>
        <!--关于项目成员-->
        <div>
          <el-row>
            <span class="is_span" style="position: relative;top: 0;">私募信息</span>
            <ul class="ul_all">
              <li class="li_all">是否举行私募
                <span class="span_all">*</span>
                <el-radio v-model="radioThree" label="1" style="margin-left: 139px;">是</el-radio>
                <el-radio v-model="radioThree" label="2">否</el-radio>
              </li>
              <li class="li_all">私募总量
                <input type="text" class="input_all" placeholder="如 5000" style="margin-left: 174px;">
              </li>
              <li class="li_all">私募价格
                <input type="text" class="input_all" placeholder="如 30" style="margin-left: 174px;">
              </li>
              <li class="li_all">参与私募人数
                <input type="text" class="input_all" placeholder="如 300" style="margin-left: 146px;">
              </li>
              <li class="li_all">私募所占比例
                <input type="text" class="input_all" placeholder="如 2%" style="margin-left: 146px;">
              </li>
              <li class="li_all">私募时间
                <input type="text" class="input_all" placeholder="年/月/日" style="margin-left: 174px;">
              </li>
              <li class="li_all">私募发币规则
                <input type="text" class="input_all" placeholder="如 全职30人 非全职50人" style="margin-left: 146px;">
              </li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 10px 0 10px 20px;"></div>
        <!--关于私募-->
        <div>
          <el-row>
            <span class="is_span" style="position: relative;top: 0;">ICO信息</span>
            <ul class="ul_all">
              <li class="li_all">是否ICO
                <span class="span_all">*</span>
                <el-radio v-model="radioFour" label="1" style="margin-left: 170px;">是</el-radio>
                <el-radio v-model="radioFour" label="2">否</el-radio>
              </li>
              <li class="li_all">ICO总量
                <input type="text" class="input_all" placeholder="如 5000" style="margin-left: 178px;">
              </li>
              <li class="li_all">ICO价格
                <input type="text" class="input_all" placeholder="如 300" style="margin-left: 178px;">
              </li>
              <li class="li_all">参与ICO人数
                <input type="text" class="input_all" placeholder="如 30" style="margin-left: 150px;">
              </li>
              <li class="li_all">ICO所占比例
                <input type="text" class="input_all" placeholder="如 2%" style="margin-left: 150px;">
              </li>
              <li class="li_all">ICO时间
                <input type="text" class="input_all" placeholder="如 年/月/日" style="margin-left: 178px;">
              </li>
              <li class="li_all">ICO发币规则
                <input type="text" class="input_all" placeholder="如 全职30人 非全职50人" style="margin-left: 150px;">
              </li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 10px 0 10px 20px;"></div>
        <!--关于ICO-->
        <div>
          <el-row>
            <span class="is_span">社交媒体</span>
            <ul class="ul_all">
              <li class="li_all">Telegram(English Group)
                <input type="text" class="is_input" placeholder="链接" style="margin-left: 64px;">
                <input type="text" class="is_inputs" placeholder="人数" style="margin-left: 18px;">
              </li>
              <li class="li_all">Telegram(Chinese Group)
                <input type="text" class="is_input" placeholder="链接" style="margin-left: 59px;">
                <input type="text" class="is_inputs" placeholder="人数" style="margin-left: 18px;">
              </li>
              <li class="li_all">Telegram (Others)
                <input type="text" class="is_input" placeholder="链接" style="margin-left: 109px;">
                <input type="text" class="is_inputs" placeholder="人数" style="margin-left: 18px;">
              </li>
              <li class="li_all">Wechat
                <input type="text" class="is_input" placeholder="链接" style="margin-left: 180px;">
                <input type="text" class="is_inputs" placeholder="人数" style="margin-left: 17px;">
              </li>
              <li class="li_all">QQ
                <input type="text" class="is_input" placeholder="链接" style="margin-left: 208px;">
                <input type="text" class="is_inputs" placeholder="人数" style="margin-left: 17px;">
              </li>
              <li class="li_all">Weibo
                <input type="text" class="input_all" placeholder="链接" style="margin-left: 187px;">
              </li>
              <li class="li_all">Facebook
                <input type="text" class="input_all" placeholder="链接" style="margin-left: 166px;">
              </li>
              <li class="li_all">Twitter
                <input type="text" class="input_all" placeholder="链接" style="margin-left: 184px;">
              </li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 10px 0 10px 20px;"></div>
        <!--关于钱包-->
        <div>
          <el-row>
            <span class="is_span" style="position: relative;top: 0;">钱包信息</span>
            <ul class="ul_all">
              <li class="li_all">是否是ERC20代币
                <span class="span_all">*</span>
                <el-radio v-model="radioFive" label="1" style="margin-left: 110px;">是</el-radio>
                <el-radio v-model="radioFive" label="2">否</el-radio>
              </li>
              <li class="li_all">代币合约地址
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="请提供钱包下载地址，推荐Github上的下载地址" style="margin-left: 135px;">
              </li>
              <li class="li_all">项目钱包的说明
                <span class="span_all">*</span>
                <input type="text" class="input_all" placeholder="" style="margin-left: 121px;">
              </li>
            </ul>
          </el-row>
        </div>
        <div style="border:0.5px solid #d8d8d8;width:1162.5px;margin: 10px 0 10px 20px;"></div>
        <el-row style="text-align: center;">
          <span class="iconfont icon-tanhao"></span>
          <span style="font-size:14px;color:#ff7c44;">如果您的申请表符合标准，我们将在10个工作日内答复。</span>
        </el-row>
        <el-row style="margin-left: 20px;">
          <el-checkbox v-model="checked">我已阅读相关协议并同意</el-checkbox>
        </el-row>
        <button style="border:1px solid #0bb2fe;border-radius:4px;width:248px;height:44px;margin: 30px 0 0 470px;background: #FFFFFF;" @click="$router.push({name: 'DetailsCurrency'})">
          <span style="font-size:16px;color:#0bb2fe;">提交申请</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import Navigation from '../../components/Navigation'
export default {
  name: 'ApplicationInformation',
  components: {
    Navigation
  },
  data () {
    return {
      checked: true,
      radioOne: '1',
      radioTwo: '1',
      radioThree: '1',
      radioFour: '1',
      radioFive: '1'
    }
  },
  mounted () {
    /* ---- particles.js config ---- */
    window.particlesJS('particles-js', require('../../assets/data/particles'))
  }
}
</script>

<style scoped>
  .ul_all{
    margin-left: 200px;
    margin-top: -18px;
  }
  .ul_all li{
    margin-bottom: 5px;
  }
  .li_all{
    font-size:14px;
    /*color:#666666;*/
  }
  .li_sall{
    font-size:14px;
    color:#333333;
  }
  .is_span{
    font-size:16px;
    color:#333333;
    margin-left: 20px;
    margin-top: 10px;
    display: inline-block;
    position: relative;
    top: 10px;
  }

  #particles-js {
    position: relative;
  }
  .span_all{
    color:#f55858;
    font-size:14px;
  }
  .is_input{
    border:0.5px solid #d8d8d8;
    border-radius:4px;
    width:421px;
    height:39px;
  }
  .is_inputs{
    border:0.5px solid #d8d8d8;
    border-radius:4px;
    width:84px;
    height:39px;
  }
  .input_all{
    border:0.5px solid #d8d8d8;
    border-radius:4px;
    width:527px;
    height:39px;
  }
</style>
