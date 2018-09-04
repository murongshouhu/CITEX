<template>
    <div class="head abs">
        <div class="nav-color" :class="isShowBg ? 'nav' : 'unnav'">
            <div class="nav-left rel fl">
                <div class="logo abs">
                    <h1>
                        <router-link to="/home">
                            <img src="../../assets/logo/logo.png" alt="logo">
                        </router-link>
                    </h1>
                </div>
                <ul class="nav-lists fl flex">
                    <li>
                        <div class="nav-list fs-18">
                            <router-link to="/otc">法币交易</router-link>
                        </div>
                    </li>
                    <li>
                        <div class="nav-list fs-18">
                            <router-link to="/trade">币币交易</router-link>
                        </div>
                    </li>
                    <li>
                        <div class="nav-list fs-18">
                            <router-link to="/ctt">CTT</router-link>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="nav-right fr">
                <ul>
                    <li>
                        <div class="nav-list lang fs-18">
                            <img src="../../assets/icon/earth.png" alt="lang">
                                简体中文
                        </div>
                    </li>
                    <li v-if="!isLogin">
                        <div class="nav-list fs-18">
                            <router-link to="/login">
                                <img src="../../assets/icon/person_center.png" alt="user">
                                登录
                            </router-link>
                        </div>
                    </li>
                    <li v-if="isLogin">
                        <div class="nav-list fs-18">
                            <router-link to="/personal/account">
                                <img src="../../assets/icon/person_center.png" alt="user">
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        {{userName}}
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item>
                                            <router-link to="/personal/account">用户中心</router-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <router-link to="/personal/identity/kyc1">身份认证</router-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item>
                                            <router-link to="">我的推荐码</router-link>
                                        </el-dropdown-item>
                                        <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
                                    </el-dropdown-menu>
                                    </el-dropdown>
                            </router-link>
                        </div>
                    </li>
                    <li>
                        <div class="nav-list fs-18">
                            <router-link to="/assets">资产管理</router-link>
                        </div>
                    </li>
                    <li>
                        <div class="nav-list fs-18">
                            <router-link to="/help">帮助中心</router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import account from "../../api/account.js";
export default {
  data() {
    return {
      isShowBg: true,
      userName: "",
      isLogin: false
    };
  },
  mounted() {
    if (this.headerBg == undefined) {
      this.isShowBg = true;
    } else {
      this.isShowBg = this.headerBg;
    }

    let userToken = JSON.parse(localStorage.getItem("userToken") || "{}")
      .access_token;
    if (userToken) {
      this.isLogin = true;
    } else {
      this.isLogin = false;
    }
    this.getUserName();
  },
  beforeRouteEnter(to, from, next) {
    // ...
    this.getUserName();
    next();
  },
  methods: {
    logout() {
      localStorage.removeItem("userToken");
      this.isLogin = false;
      this.$router.push({ path: "/" });
    },
    getUserName() {
      let userName =
        JSON.parse(localStorage.getItem("userToken") || "{}").userName || "";
      if (userName.indexOf("@") != -1) {
        this.userName =
          userName.substring(0, 4) +
          "****" +
          userName.substring(userName.indexOf("@"));
      } else {
        this.userName =
          userName.substring(0, 3) + "****" + userName.substring(10);
      }
    }
  },
  props: ["headerBg"]
};
</script>

<style>
.head {
  width: 100%;
  min-width: 1280px;
  top: 0;
  left: 0;
  z-index: 9999999999999999999;
}
.nav {
  width: 100%;
  height: 70px;
  background: #388cff;
}
.unnav {
  width: 100%;
  height: 70px;
  background: transparent;
}

.nav-color > div a {
  color: #fff;
}
.nav-left {
  padding-left: 240px;
}
.logo {
  width: 280px;
  height: 70px;
  top: 0;
  left: 0;
  color: #fff;
  text-align: center;
  line-height: 70px;
}
.logo img {
  width: 138px;
  vertical-align: middle;
}
.logo h1 {
  display: inline-block;
}
.nav-list {
  height: 70px;
  line-height: 70px;
  color: #fff;
}
.nav-left li {
  padding: 0 20px;
}
.nav-list a {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.nav-list .el-dropdown {
  color: #fff;
  font-size: 18px;
}
.el-dropdown-menu {
  min-width: 150px;
}
.el-dropdown-menu__item {
  font-size: 16px;
  padding: 0;
  text-align: center;
}
.el-dropdown-menu__item a {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #606266;
  font-size: 16px;
  padding: 0 20px;
  box-sizing: border-box;
}
.el-dropdown-menu__item:hover,
.el-dropdown-menu__item a:hover {
  background-color: #ecf5ff;
  color: #66b1ff;
}
@keyframes rotate {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(180deg);
  }
}
.nav-list .el-dropdown:hover .el-icon-arrow-down {
  animation: rotate 0.5s forwards;
}
.nav-list .el-dropdown-link {
  display: inline-block;
  height: 100%;
}
.nav-right ul {
  width: 100%;
  height: 100%;
  padding-right: 58px;
}
.nav-right ul li {
  padding: 0 22px;
  float: right;
  line-height: 70px;
}
.nav-right .nav-list img {
  width: 28px;
  height: 28px;
  line-height: 70px;
  vertical-align: middle;
}
</style>

