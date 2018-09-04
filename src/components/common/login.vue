<template>
    <div class="login">
        <div class="login-title">
            <p class="fs-34">欢迎登录</p>
            <h3 class="fs-34">CITEX</h3>
        </div>
        <!-- <div class="username fs-14">
            <span class="fs-14">请输入账号</span>
            <span>*</span>
        </div> -->
        <ul class="login-form-list">
            <li class="form-item fs-16">
                <input v-model="userName" @blur="checkUserName" type="text" placeholder="请输入您的邮箱账号">
            </li>
            <li class="err-alert" :class="isShowError01?'show' : 'hide'"><p><span>*</span><span>{{error01}}</span></p></li>
            <li  class="form-item fs-16">
                <input v-model="passWord" @keyup="checkPsw" @blur="checkPsw" type="password" placeholder="请输入您的密码">
            </li>
            <li class="err-alert" :class="isShowError02?'show' : 'hide'"><p><span>*</span><span>{{error02}}</span></p></li>
        </ul>
        <div class="login-btn"><el-button type="primary" @click='login' :disabled='isLogin'>登录</el-button></div>
        <div>
            <ul class="login-other fs-16">
                <li class="fl">
                    <div>
                        <router-link to="/forgetPassword">忘记密码</router-link>
                    </div>
                </li>
                <li class="fr">
                    <div>
                        <router-link to="/register">注册</router-link>
                    </div>
                </li>
                <li class="fr">
                    <div>还没有账户？</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import checkReg from "../../utils/check.js";
import fetch from "../../utils/fetch.js";
import accountApi from "../../api/account.js";
export default {
  data() {
    return {
      fromPath: "",
      userName: "",
      uNameIsSure: false,
      passWord: "",
      pswIsSure: false,
      isLogin: true,
      error01: "",
      error02: "",
      isShowError01: false,
      isShowError02: false
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromPath = from.fullPath || "/home";
    });
  },
  watch: {
    isShowError() {
      let that = this;
      setTimeout(() => {
        that.isShowError = false;
      }, 3000);
    }
  },
  methods: {
    checkUserName() {
      let isRight = checkReg.emailReg.test(this.userName);
      if (this.userName == "") {
        this.error01 = "请输入您的邮箱账号";
        this.uNameIsSure = false;
        this.isShowError01 = true;
        this.isLogin = true;
        return;
      } else if (!isRight) {
        this.error01 = "请输入正确的邮箱账号";
        this.uNameIsSure = false;
        this.isShowError01 = true;
        this.isLogin = true;
        return;
      }
      this.uNameIsSure = true;
      this.isShowError01 = false;

      if (this.uNameIsSure && this.pswIsSure) {
        this.isLogin = false;
      }
    },
    checkPsw() {
      if (this.passWord == "") {
        this.error02 = "请输入您的密码";
        this.pswIsSure = false;
        this.isShowError02 = true;
        this.isLogin = true;
        return;
      }
      this.pswIsSure = true;
      this.isShowError02 = false;
      if (this.uNameIsSure && this.pswIsSure) {
        this.isLogin = false;
      }
    },
    login() {
      let that = this;
      let parmars = {
        username: this.userName,
        password: this.$md5(this.passWord)
      };
      fetch.fetch("/user/login", parmars, "post").then(data => {
        if (data && data.code == 0) {
          let datas = data.data;
          localStorage.setItem("userToken", JSON.stringify(datas));
          that.getUserInfo();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    getUserInfo() {
      accountApi.baseInfo().then(data => {
        let userToken = JSON.parse(localStorage.getItem("userToken"));
        userToken.userName = data.username;
        localStorage.setItem("userToken", JSON.stringify(userToken));
        this.$router.push({ path: this.fromPath || "/home" });
      });
    }
  }
};
</script>

<style>
.login-title {
  height: 70px;
}
.login-title p,
.login-title h3 {
  float: left;
}
.login-title h3 {
  margin-left: 10px;
}
.login-form-list ul,
.login-form-list li {
  width: 100%;
}
.username {
  line-height: 26px;
}
.username span:last-child {
  color: #388cff;
}

.form-item {
  line-height: 48px;
  border-bottom: 1px solid #e7e8e8;
  color: #121a21;
  margin-top: 30px;
}
.err-alert {
  color: #ea6565;
}
.login-btn {
  margin-top: 20px;
}
.login-btn .el-button {
  margin-top: 28px;
  width: 100%;
  height: 48px;
  margin-bottom: 22px;
  font-size: 18px;
}
.login-other a {
  color: #388cff;
}
</style>
