<template>
    <div class="register">
        <div class="register-title">
            <p class="fs-34">欢迎注册</p>
            <h3 class="fs-34">CITEX</h3>
        </div>
        <!-- <div class="username fs-14">
            <span class="fs-14">请输入账号</span>
            <span>*</span>
        </div> -->
        <ul class="register-form-list">
            <li class="form-item fs-16">
                <input v-model="userName" @blur="checkUserName" type="text" placeholder="请输入您的邮箱账号">
            </li>
            <li class="err-alert" :class="isShowError01?'show' : 'hide'"><p><span>*</span><span>{{error01}}</span></p></li>
            <li class="form-item fs-16">
                <input v-model="setPassword" @blur="checkSetPassword" type="password" placeholder="设置密码">
            </li>
            <li class="err-alert" :class="isShowError02?'show' : 'hide'"><p><span>*</span><span>{{error02}}</span></p></li>
            <li  class="form-item fs-16">
                <input v-model="confirmPassword" @blur="checkConfirmPassword" type="password" placeholder="确认密码">
            </li>
            <li class="err-alert" :class="isShowError03?'show' : 'hide'"><p><span>*</span><span>{{error03}}</span></p></li>
            <li  class="form-item fs-16 last-item">
                <input v-model="msgCode" @keyup="checkMsgCode" type="text" placeholder="请输入验证码">
                <div class="code fs-18" @click="getMsgCode">
                    <button :class="isClick?'disabled':''" :disabled='isClick'>{{buttonValue}}</button>
                </div>
            </li>
            <li class="err-alert" :class="isShowError04?'show' : 'hide'"><p><span>*</span><span>{{error04}}</span></p></li>
        </ul>
        <div class="register-btn">
            <el-button type="primary" @click='register' :disabled='isRegister'>注册</el-button>
        </div>
        <div class="agreement fs-14">.
          <div class="isagree fl" @click="isAgree = !isAgree" :class="isAgree? 'check' : 'uncheck'"></div>
          <div class="fl">
              <div class="inline-block">我已阅读并同意 <a href="javascript:;" class="underline">CITEX用户协议</a></div>
          </div>
          <div class="fr">
            <span>已有账户？</span>
            <span>
              <router-link to="login">登录</router-link>
            </span>
          </div>
        </div>
        <p class="err-alert mt-10" v-show="!isAgree">*请勾选协议</p>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
import indexApi from "../../api/indexApi.js";
import checkReg from "../../utils/check.js";
import accountApi from "../../api/account.js";
export default {
  data() {
    return {
      userName: "",
      uNameIsSure: false,
      setPassword: "",
      pswIsSure: false,
      confirmPassword: "",
      msgCode: "",
      msgCodeIsSue: false,
      isRegister: true,
      buttonValue: "获取验证码",
      error01: "",
      error02: "",
      error03: "",
      error04: "",
      isClick: false,
      isShowError01: false,
      isShowError02: false,
      isShowError03: false,
      isShowError04: false,
      isAgree: true
    };
  },
  watch: {
    isAgree() {
      if (!this.isAgree) {
        this.isRegister = true;
      } else {
        this.isRegister = false;
      }
    }
  },
  mounted() {
    // this.getKaptchaImage();
  },
  methods: {
    checkUserName() {
      let isRight = checkReg.emailReg.test(this.userName);
      if (this.userName == "") {
        this.error01 = "请输入您的邮箱账号";
        this.uNameIsSure = false;
        this.isShowError01 = true;
        this.isRegister = true;
        return;
      } else if (!isRight) {
        this.error01 = "账号格式不正确，请重新输入";
        this.uNameIsSure = false;
        this.isShowError01 = true;
        this.isRegister = true;
        return;
      }
      this.uNameIsSure = true;
      this.isShowError01 = false;

      if (
        this.uNameIsSure &&
        this.pswIsSure &&
        this.msgCodeIsSue &&
        this.isAgree
      ) {
        this.isRegister = false;
      }
    },
    checkSetPassword() {
      if (this.setPassword == "") {
        this.error02 = "请设置密码";
        this.isShowError02 = true;
        this.pswIsSure = false;
        this.isRegister = true;
        return;
      }
      this.isShowError02 = false;
    },
    checkConfirmPassword() {
      if (this.setPassword == "" && this.confirmPassword == "") {
        this.error03 = "请设置密码";
        this.isShowError03 = true;
        this.pswIsSure = false;
        this.isRegister = true;
        return;
      } else if (this.confirmPassword != this.setPassword) {
        this.error03 = "两次设置密码不一致，请重新输入";
        this.isShowError03 = true;
        this.pswIsSure = false;
        this.isRegister = true;
        return;
      }
      this.pswIsSure = true;
      this.isShowError03 = false;
      if (
        this.uNameIsSure &&
        this.pswIsSure &&
        this.msgCodeIsSue &&
        this.isAgree
      ) {
        this.isRegister = false;
      }
    },
    //获取验证码
    getMsgCode() {
      let parmars = {
        receiver: this.userName,
        businessType: "registerEmail"
      };
      axios
        .fetch("/users/getVerifyCodeBeforeAuth", parmars, "get")
        .then(data => {});
      let countDown = 60;
      let that = this;
      that.isClick = true;
      that.buttonValue = countDown + "s";
      let timer = setInterval(() => {
        countDown--;
        that.buttonValue = countDown + "s";
        if (countDown == 0) {
          clearInterval(timer);
          that.buttonValue = "获取验证码";
          that.isClick = false;
        }
      }, 1000);
    },
    checkMsgCode() {
      if (this.msgCode == "") {
        this.error04 = "请输入验证码";
        this.isShowError04 = true;
        this.msgCodeIsSue = false;
        this.isRegister = true;
        return;
      }
      this.msgCodeIsSue = true;
      this.isShowError04 = false;
      if (
        this.uNameIsSure &&
        this.pswIsSure &&
        this.msgCodeIsSue &&
        this.isAgree
      ) {
        this.isRegister = false;
      }
    },
    // 注册协议勾选
    getKaptchaImage() {
      indexApi.getKaptchaImage().then(data => {
        console.log(data);
      });
    },
    // 、、注册
    register() {
      if (!this.isAgree) {
        //请勾选协议
        this.isRegister = true;
      }
      if (this.confirmPassword != this.setPassword) {
        this.error03 = "两次设置密码不一致，请重新输入";
        this.isShowError03 = true;
        this.pswIsSure = false;
        this.isRegister = true;
        return;
      }
      let parmars = {
        email: this.userName.indexOf("@") != -1 ? this.userName : "",
        phone: this.userName.indexOf("@") != -1 ? "" : this.userName,
        login_pass_grade: "2",
        password: this.$md5(this.setPassword),
        validCode: this.msgCode,
        businessType: "registerEmail"
      };
      let that = this;
      //注册程序
      axios.fetch("/users/register", parmars, "post").then(data => {
        if (data && data.code == 0) {
          that.goLogin();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //登录操作
    goLogin() {
      let parmars = {
        username: this.userName,
        password: this.$md5(this.setPassword)
      };
      axios.fetch("/user/login", parmars, "post").then(data => {
        if (data && data.code == 0) {
          localStorage.setItem("userToken", JSON.stringify(data.data));
          this.getUserInfo();
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
        this.$router.push("/registerSuccess");
      });
    }
  }
};
</script>

<style>
.disabled {
  color: #c2c2c2 !important;
}
.register-title {
  height: 70px;
}
.register-title p,
.register-title h3 {
  float: left;
}
.register-title h3 {
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
.code {
  float: right;
  height: 100%;
  width: 130px;
  text-align: center;
}
.code button {
  color: #388cff;
  width: 100%;
  line-height: 30px;
  border-left: 1px solid #e7e8e8;
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
.register-btn {
  margin-top: 20px;
}

.register-btn .el-button {
  margin-top: 28px;
  width: 100%;
  height: 48px;
  margin-bottom: 22px;
  font-size: 18px;
}
.login-other a {
  color: #388cff;
}
.agreement {
  height: 22px;
  color: #6a6a6a;
  overflow: hidden;
}
.agreement > div {
  height: 100%;
}
.agreement span {
  display: inline-block;
  line-height: 22px;
}
.agreement a {
  color: #66b3ff;
}
.isagree {
  width: 22px;
  height: 100%;
  margin-right: 25px;
  background-size: 100% 100%;
}

.check {
  background: url("../../assets/icon/check.png") no-repeat center;
}
.uncheck {
  background: url("../../assets/icon/uncheck.png") no-repeat center;
}
.underline {
  text-decoration: underline;
}
</style>
