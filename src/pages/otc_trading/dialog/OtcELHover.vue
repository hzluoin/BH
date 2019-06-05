<template>
  <div class="el-ulBox">
    <ul class="el-ul">
      <li>
        <div class="pageBgL">
          <img src="../../../assets/images/otc/p1.png">
          <div class="font">支付宝添加付款备注位置</div>
        </div>
      </li>
      <li>
        <div class="pageBgR">
          <img src="../../../assets/images/otc/p2.png">
          <div class="font">微信添加付款备注位置</div>
        </div>
      </li>
    </ul>
    <!--<a class="closeBtn"><img src="../assets/images/otc/closeBtn.png"></a>-->
  </div>
</template>

<script>
export default {
  name: 'OtcELHover'
}
</script>

<style scoped>
  .el-ulBox{position: relative;width: 660px;height: 514px;z-index: 111;}
  .el-ul{position: absolute;width: 100%;height: 100%;}
  .el-ul li{position: relative;width: 50%;float: left;}
  .el-ul li .font{text-align: center;color: #333333;font-size: 14px;margin-top: 9px;}
  .el-ul .pageBgL{margin: 29px 0 49px 69px;}
  .el-ul .pageBgR{margin: 29px 69px 49px 0;}
  .closeBtn{position: absolute;width: 30px;height: 30px;top: 10px;right: 12px;display: block;cursor: pointer;}
</style>
