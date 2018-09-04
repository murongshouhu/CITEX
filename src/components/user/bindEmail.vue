<template>
    <div class="bind-email">
        <p class="fs-26 color-333 mb-26">邮箱验证之后将不可更换</p>
        <p class="fs-20 color-999 mb-50">请先确认您所绑定的邮箱地址，一旦验证成功将不可更换</p>
        <ul>
            <!-- <li class="mt-10">
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">登录密码:</div>
                    <div class="item-value">
                        <div class="input-box">
                            <el-input v-model="loginPsw" placeholder="请输入登录密码"></el-input>
                        </div>
                    </div>
                </div>
            </li> -->
            <li>
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">手机验证码:</div>
                    <div class="item-value item-msg-code">
                        <div>
                            <div class="input-box">
                                <el-input v-model="phoneVerifyCode" placeholder="请输手机验证码"></el-input>
                            </div>
                        </div>
                        <div>
                            <div class="input-box send-msg-code" :class="disabled1?'disabled':''"><el-button @click="sendPhoneCode(0)" :disabled="disabled1" type="primary">{{senBtnTxt1}}</el-button></div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="mt-10">
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">邮箱地址:</div>
                    <div class="item-value">
                        <div class="input-box">
                            <el-input v-model="emailAdress" placeholder="请输入邮箱"></el-input>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">邮箱验证码:</div>
                    <div class="item-value item-msg-code">
                        <div>
                            <div class="input-box">
                                <el-input v-model="emailVerifyCode" placeholder="请输邮箱验证码"></el-input>
                            </div>
                        </div>
                        <div>
                            <div class="input-box send-msg-code" :class="disabled2?'disabled':''"><el-button @click="sendEmailCode(1)" :disabled="disabled2" type="primary">{{senBtnTxt2}}</el-button></div>
                        </div>
                    </div>
                </div>
            </li>
            <li class="mt-60">
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333"></div>
                    <div class="item-value">
                        <el-button type="primary" @click="bindEmail">确定</el-button>
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
      //   loginPsw: "",
      phoneVerifyCode: "",
      emailAdress: "",
      emailVerifyCode: "",
      senBtnTxt1: "发送验证码",
      senBtnTxt2: "发送验证码",
      disabled1: false,
      disabled2: false
    };
  },
  methods: {
    // 发送手机验证码
    sendPhoneCode(flag) {
      this.sendCode(flag);
      let count = 60;
      this.senBtnTxt1 = "60s";
      this.disabled1 = true;
      let timer = setInterval(() => {
        count--;
        this.senBtnTxt1 = count + "s";
        if (count == 0) {
          this.disabled1 = false;
          this.senBtnTxt1 = "发送验证码";
          clearInterval(timer);
        }
      }, 1000);
    },
    // 发送邮箱验证码
    sendEmailCode(flag) {
      if (flag == 1 && !this.emailAdress) {
        this.$message.error("请输入邮箱");
        return;
      }
      if (flag == 1 && this.emailAdress.indexOf("@") == -1) {
        this.$message.error("请输入正确邮箱");
        return;
      }
      this.sendCode(flag);
      let count = 60;
      this.senBtnTxt2 = "60s";
      this.disabled2 = true;
      let timer = setInterval(() => {
        count--;
        this.senBtnTxt2 = count + "s";
        if (count == 0) {
          this.disabled2 = false;
          this.senBtnTxt2 = "发送验证码";
          clearInterval(timer);
        }
      }, 1000);
    },
    // 发送验证码
    sendCode(flag) {
      let parmars = {
        receiver: flag == 0 ? "" : this.emailAdress,
        receiverType: flag == 0 ? "PHONE" : "",
        businessType: flag == 0 ? "bindEmailPhone" : "bindEmailEmail"
      };
      axios
        .fetch("/users/getVerifyCodeAfterAuth", parmars, "get")
        .then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
          }
        });
    },
    bindEmail() {
      if (!this.phoneVerifyCode) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.emailAdress) {
        this.$message.error("请输入邮箱");
        return;
      }
      if (this.emailAdress.indexOf("@") == -1) {
        this.$message.error("请输入正确邮箱");
        return;
      }
      if (!this.emailVerifyCode) {
        this.$message.error("请输入邮箱验证码");
        return;
      }
      let parmars = {
        phoneCode: this.phoneVerifyCode,
        emailCode: this.emailVerifyCode,
        phone: "",
        email: this.emailAdress,
        emailBusinessType: "bindEmailEmail",
        phoneBusinessType: "bindEmailPhone"
      };
      axios.fetch("/users/bindEmailOrPhone", parmars, "post").then(data => {
        if (data.code == 0) {
          this.$router.push("/personal/modify/bindOresetSuccess");
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>

<style>
.bind-email {
  width: 524px;
  margin: 0 auto;
  padding: 60px 0;
}
.bind-email p {
  text-align: center;
}
.bind-email .lable-name {
  width: 124px;
  padding-right: 24px;
  text-align: right;
}
.bind-email li {
  width: 100%;
  height: 48px;
  line-height: 48px;
  margin-top: 20px;
}
.bind-email .rest-item {
  width: 100%;
  height: 100%;
}
.bind-email .item-value {
  width: 100%;
  height: 100%;
  padding-left: 124px;
}
.bind-email .item-msg-code {
  display: flex;
}
.bind-email .item-msg-code > div {
  flex: 1;
}

.bind-email .item-msg-code > div:last-child {
  padding-left: 10px;
}
.bind-email .rest-item .input-box {
  width: 100%;
  height: 100%;
  border: 1px solid #d6e1f0;
}
.bind-email .rest-item .tell-number {
  display: flex;
}
.bind-email .tell-number > div:first-child {
  flex: 1;
}
.bind-email .tell-number > div:last-child {
  flex: 3;
  padding-left: 10px;
}
.bind-email .item-value .el-button {
  width: 100%;
  height: 48px;
  border-radius: 0;
  border: 0 none;
  background: #66b3ff;
  font-size: 18px;
}
.bind-email .item-value .disabled .el-button {
  background: #e2e2e2;
}
.bind-email .input-box .el-input__inner {
  width: 100%;
  height: 100%;
  border: 0 none;
}
</style>
