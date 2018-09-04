<template>
    <div class="home" >
        <div class="home-main-present" >
          <div class="home-book">
            <img src="../../assets/home/head_test_book.png">
            <router-link to="/home" >
                <span class="book-sty sty1">币币交易</span>
                <span class="book-sty sty2">新手攻略</span>
            </router-link>
          </div>
          <div class="main-sonhead">
              <div class="block">
                <span class="demonstration" style="display:none">首页轮播图</span>
                <el-carousel trigger="click" arrow="always">
                  <el-carousel-item v-for="item in imgList" :key="item.index">
                  <img ref="imgHeight" :src="item.url" alt="">
                  </el-carousel-item>
                </el-carousel>
              </div>
              <div class="home-nav-sty">
                <ul class="home-nav-ul">
                    <li class="home-nav-li" title ="交易区正式上线,百万豪CTT人人有">
                        <router-link to="/trade" class="text-color">交易区正式上线,百万豪CTT人人有</router-link>
                    </li>
                    <li class="home-nav-li" title ="交易挖矿调整通知">
                        <router-link to="/home" class="text-color">交易挖矿调整通知</router-link>
                    </li>
                    <li class="home-nav-li" title ="锁仓分红加倍活动重磅上线">
                        <router-link to="/home" class="text-color">锁仓分红加倍活动重磅上线</router-link>
                    </li >
                    <li class="home-nav-li" title ="关于私募合伙人计划的公告">
                        <router-link to="/home" class="text-color">关于私募合伙人计划的公告</router-link>
                    </li>
                    <li class="home-nav-li fr" title ="关于团队和基金会所得分红回馈使用说明">
                        <router-link to="/home" class="text-color">关于团队和基金会所得分红回馈使用说明</router-link>
                    </li>
                </ul>
            </div>
          </div>
        </div>
        <div>
            <HomeMining></HomeMining>
        </div>
        <div>
            <HomeList></HomeList>
        </div>
        <div>
            <HomeFoot></HomeFoot>
        </div>
        <!-- <div>延禧攻略</div> -->
    </div>
    
</template>
<script>
// 组件引入
import HomeList from "./homeList.vue"; // 首页列表
import HomeFoot from "./homeFoot.vue"; //首页图片内容
 import HomeMining from "./homeMining.vue";//首页挖矿实时图
import indexApi from "../../api/indexApi.js";
export default {
  data() {
    return {
      imgList: [
        {
          url: require("../../assets/home/home_test_001.png")
        },
        {
          url: require("../../assets/home/home_hw_001.jpg")
        },
        {
          url: require("../../assets/home/home_hw_002.jpg")
        }
      ]
    };
  },
  components: {
    //注册组件
    HomeList,
    HomeFoot,
     HomeMining
  },
  mounted() {}
};
</script>


<style lang="scss">
.home {
  width: 100%;
  height: 100%;
  .home-main-present {
    position: relative;
  }
  .home-book {
    display: none;
    width: 812px;
    height: 512px;
    background-color: #ffffff;
    opacity: 0.5;
    position: absolute;
    left: 30%;
    z-index: 3;
  }
  .home-book img {
    width: 812px;
    height: 512px;
  }
  .home-book .book-sty {
    font-size: 46px;
    letter-spacing: 0px;
    color: #ffffff;
    position: absolute;
    left: 216px;
    top: 259px;
  }
  .home-book .sty1 {
    left: 193px;
  }
  .home-book .sty2 {
    left: 428px;
  }
  .main-sonhead {
    background: #99a9bf;
    width: 100%;
    height: 561px;
  }
  .el-carousel__item {
    img {
      width: 100%;
      height: 100%;
    }
    h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 150px;
      margin: 0;
    }
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
  .el-carousel__container {
    height: 512px;
  }
  .home-nav-sty {
    width: 100%;
    text-align: center;
    height: 47px;
    color: white;
    background-color: #99a9bf;
    border: 1px solid #546192;
    opacity: 0.9;
    font-family: PingFangSC-Regular;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    background-image: url(../../assets/home/home_back.png);
  }
  .home-nav-ul {
    text-align: center;
    margin-left: 100px;
    width: 85%;
    margin-top: 15px;
  }
  .home-nav-li {
    width: 18%;
    display: inline-block;
    height: 20px;
    line-height: 17px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .home-nav-li:hover {
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
  }
  .text-color {
    color: #ffffff;
  }
  .fr {
    float: right;
  }
}
</style>
