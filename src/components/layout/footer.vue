<template>
    <div class="footer">
      <div class="foot-present">
          <div class="son-top">
            <div class="son-top-icon">
              <div class="icon-left">
                    <img src="../../assets/foot/home_003_login.png" alt="logo">
              </div>
              <div class="icon-right">
                <router-link to="/home">
                            <img src="../../assets/foot/test_001_wx.png" alt="微信">
                </router-link>
                <router-link to="/home">
                            <img src="../../assets/foot/test_001_face.png" alt="faecbook">
                </router-link>
                <router-link to="/home">
                            <img src="../../assets/foot/test_001_in.png" alt="ins">
                </router-link>
                <router-link to="/home">
                            <img src="../../assets/foot/test_001_bird.png" alt="bird">
                </router-link>
                <router-link to="/home">
                            <img src="../../assets/foot/test_001_tubt.png" alt="tubt">
                </router-link>
              </div>
            </div>
            <div class="son-top-text">
                <div class="text-tops">
                    <router-link to="/home">
                        <span>关于</span>
                    </router-link>
                    <router-link to="/home">
                        <span>客服服务</span>
                    </router-link>
                    <router-link to="/home">
                        <span>联系我们</span>
                    </router-link>
                </div>
                <div class="text-bots">
                    <router-link to="/home">
                        <span>CITEX</span>
                    </router-link>
                    <router-link to="/home">
                        <span>公告</span>
                    </router-link>
                    <router-link to="/home">
                        <span>意见反馈</span>
                    </router-link>
                    <router-link to="/home">
                        <span>服务条款</span>
                    </router-link>
                    <router-link to="/home">
                        <span>费率说明</span>
                    </router-link>
                    <router-link to="/home">
                        <span>WORKERMAN@CITEX.io</span>
                    </router-link>
                    <router-link to="/home">
                        <span class="last-span">免责声明</span>
                    </router-link>
                </div>
            </div>
          </div>
          <div class="son-bot">
            <span class="bot-left">CopyRight© 2018Cttrex(www.cttrex.com) All Rights Reserved.</span>
            <span class="bot-right">中国·简体中文</span>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  data(){
    return {

    }
  }
}
</script>

<style>
.footer {
  height: 320px;
  min-width: 1280px;
  background: #fff;
  
}
.foot-present{
  width:100%;
  height: 320px;
}
.son-top{
  height:267px;
  border-top: 1px solid #c8d3db;
}
.son-top-icon{
  width:50%;
  height: 100%;
  /* background-color: aquamarine; */
  display: inline-block;
  position: relative;
}
.son-top-text{
  width:50%;
  height:100%;
  float: right;
  display: inline-block;
}
.text-tops{
  height:80px;
  width: 100%;
  font-size: 16px;
  letter-spacing: 0px;
  text-align: left;
}
.text-tops span{
  width:30%;
  display: inline-block;
  margin-top: 60px;
  color: #6e6e6e;
}
.text-bots{
  font-size: 16px;
  letter-spacing: 0px;
  text-align: left;
  margin-top: 50px;
}
.text-bots span{
  width:30%;
  display: inline-block;
  margin-bottom: 20px;
  color: #6e6e6e;
}
.icon-left img{
  width:140px;
  height:50px;
  position: absolute;
  left:163px;
  top:53px;
}
.icon-right{
  position: absolute;
  left:383px;
  top:70px;
}
.icon-right img{
  width: 24px;
	height: 20px;
}
.son-bot{
  height:53px;
  line-height: 53px;
  background-color:#ffffff;
  font-size: 14px;
  font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
	color: #6e6e6e;
  border-top: 1px solid #c8d3db;
}
.bot-left{
  margin-left:191px;
  opacity: 0.6;
}
.bot-right{
  margin-right:212px;
  float: right;
  opacity: 0.6;
}
</style>
