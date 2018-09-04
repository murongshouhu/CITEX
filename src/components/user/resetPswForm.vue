<template>
    <div class="rest-psw-form">
        <ul>
            <li class="mt-40">
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">{{accountType == "0" ? "邮箱验证码" : "手机验证码"}}:</div>
                    <div class="item-value item-msg-code">
                        <div>
                            <div class="input-box">
                                <el-input v-model="verifyCode" placeholder="请输验证码"></el-input>
                            </div>
                        </div>
                        <div>
                            <div class="input-box send-msg-code fs-18">
                                <input type="button" :disabled="disabled" @click="sendVerifyCode" v-model="senBtnTxt" :class="disabled?'disabled':''">
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">登录密码:</div>
                    <div class="item-value">
                        <div class="input-box">
                            <el-input type='password' v-model="loginPsw"  placeholder="请输入登录密码"></el-input>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">新密码:</div>
                    <div class="item-value">
                        <div class="input-box">
                            <el-input v-model="newPsw" type='password' placeholder="请输入新密码"></el-input>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">重复新密码:</div>
                    <div class="item-value">
                        <div class="input-box">
                            <el-input v-model="oneNewPsw" type='password' placeholder="请再次输入新密码"></el-input>
                        </div>
                    </div>
                </div>
            </li>
            <li class="mt-60">
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333"></div>
                    <div class="item-value">
                        <el-button @click="resetPsw" type="primary">确认修改</el-button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
export default {
  data() {
    return {
      //accountType 0是邮箱注册，1是手机注册
      senBtnTxt: "发送验证码",
      disabled: false,
      verifyCode: "",
      loginPsw: "",
      newPsw: "",
      oneNewPsw: ""
    };
  },
  methods: {
    sendVerifyCode() {
      this.sendCode();
      let count = 60;
      this.senBtnTxt = "60s";
      this.disabled = true;
      let timer = setInterval(() => {
        count--;
        this.senBtnTxt = count + "s";
        if (count == 0) {
          this.disabled = false;
          this.senBtnTxt = "发送验证码";
          clearInterval(timer);
        }
      }, 1000);
    },
    sendCode() {
      let parmars = {
        receiver: "",
        receiverType: this.accountType == 0 ? "EMAIL" : "PHONE",
        businessType:
          this.accountType == 0
            ? "changeLoginPasswordEmail"
            : "changeLoginPasswordPhone"
      };
      axios
        .fetch("/users/getVerifyCodeAfterAuth", parmars, "get")
        .then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
          }
        });
    },
    resetPsw() {
      if (!this.verifyCode) {
        this.$message.error("请输入验证码");
        return;
      }
      if (!this.loginPsw) {
        this.$message.error("请输入登录密码");
        return;
      }
      if (!this.newPsw) {
        this.$message.error("请输入新密码");
        return;
      }
      if (!this.oneNewPsw) {
        this.$message.error("请再次输入密码");
        return;
      }
      if (!this.oneNewPsw) {
        this.$message.error("请再次输入密码");
        return;
      }
      if (this.newPsw != this.oneNewPsw) {
        this.$message.error("两次输入的密码不一致");
        return;
      }
      let parmars = {
        password: this.$md5(this.loginPsw),
        newPassword: this.$md5(this.newPsw),
        login_pass_grade: "2",
        verificationCode: this.verifyCode,
        businessType:
          this.accountType == 0
            ? "changeLoginPasswordEmail"
            : "changeLoginPasswordPhone"
      };
      axios.fetch("/users/changeLoginPass", parmars, "post").then(data => {
        if (data && data.code == 0) {
          // localStorage.removeItem("userToken");
          // 修改成功页面
          this.$router.push("/personal/modify/restSuccess");
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  },
  props: ["accountType"]
};
</script>

 <style>
.lable-name {
  width: 124px;
  padding-right: 24px;
  text-align: right;
}
.rest-psw-form li {
  width: 100%;
  height: 48px;
  line-height: 48px;
  margin-top: 20px;
}
.rest-item {
  width: 100%;
  height: 100%;
}
.item-value {
  width: 100%;
  height: 100%;
  padding-left: 124px;
}
.item-msg-code {
  display: flex;
}
.item-msg-code > div {
  flex: 1;
}

.item-msg-code > div:last-child {
  padding-left: 10px;
}
.rest-item .input-box {
  width: 100%;
  height: 100%;
  border: 1px solid #d6e1f0;
}
.send-msg-code input {
  width: 100%;
  height: 100%;
  color: #fff;
  background: #66b3ff;
  vertical-align: text-bottom;
}
.send-msg-code input.disabled {
  background: #d6e1f0;
}
.item-value .el-button {
  width: 100%;
  height: 48px;
  border-radius: 0;
  border: 0 none;
  background: #66b3ff !important;
  font-size: 18px;
}
.input-box .el-input__inner {
  width: 100%;
  height: 100%;
  border: 0 none;
  background: #f8f8fb;
}
.item-value .input-box {
  background: #f8f8fb;
}
</style>
 