<template>
    <div class="bind-tell">
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
            <!-- <li v-if="type != 0">
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">谷歌验证码:</div>
                    <div class="item-value">
                        <div class="input-box">
                            <el-input v-model="loginPsw" placeholder="请输入谷歌验证码"></el-input>
                        </div>
                    </div>
                </div>
            </li> -->
            <li>
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">手机号:</div>
                    <div class="item-value tell-number">
                        <div>
                            <div class="input-box">
                                <el-select v-model="country" placeholder="请选择">
                                    <el-option
                                    v-for="item in cities"
                                    :key="item.value"
                                    :label="item.value"
                                    :value="item.value">
                                    <span style="float: left">{{ item.value }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.label }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <div>
                            <div class="input-box">
                                <el-input v-model="phoneNumber" maxlength="11" placeholder="请输入手机号码"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            
            <li>
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333">手机验证码:</div>
                    <div class="item-value item-msg-code">
                        <div>
                            <div class="input-box">
                                <el-input v-model="phoneVerifyCode" placeholder="请输验证码"></el-input>
                            </div>
                        </div>
                        <div>
                            <div class="input-box send-msg-code" :class="disabled1?'disabled':''" ><el-button :disabled="disabled1" @click="sendPhoneCode(0)" type="primary">{{senBtnTxt1}}</el-button></div>
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
                                <el-input v-model="emailVerifyCode" placeholder="请输验证码"></el-input>
                            </div>
                        </div>
                        <div>
                            <div class="input-box send-msg-code" :class="disabled2?'disabled':''"><el-button :disabled="disabled2" @click="sendEmailCode(1)" type="primary">{{senBtnTxt2}}</el-button></div>
                        </div>
                    </div>
                </div>
            </li>

            <li class="mt-60">
                <div class="rel rest-item">
                    <div class="abs lable-name fs-18 color333"></div>
                    <div class="item-value">
                        <el-button type="primary" @click="bindPhone">确认</el-button>
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
      loginPsw: "",
      phoneNumber: "",
      phoneVerifyCode: "",
      emailVerifyCode: "",
      senBtnTxt1: "发送验证码",
      senBtnTxt2: "发送验证码",
      disabled1: false,
      disabled2: false,
      type: "",
      cities: [
        {
          value: "86",
          label: "中国"
        }
      ],
      country: "86"
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.type = JSON.parse(localStorage.getItem("crumbs")).type;
    },
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
    sendEmailCode(flag) {
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
    sendCode(flag) {
      let parmars = {
        receiver: flag == 0 ? this.phoneNumber : "",
        receiverType: flag == 0 ? "" : "EMAIL",
        businessType: flag == 1 ? "bindPhoneEmail" : "bindPhonePhone"
      };
      axios
        .fetch("/users/getVerifyCodeAfterAuth", parmars, "get")
        .then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
          }
        });
    },
    bindPhone() {
      if (!this.phoneNumber) {
        this.$message.error("请输入手机号");
        return;
      }
      if (!this.phoneVerifyCode) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.emailVerifyCode) {
        this.$message.error("请输入邮箱验证码");
        return;
      }
      let parmars = {
        phoneCode: this.phoneVerifyCode,
        emailCode: this.emailVerifyCode,
        phone: this.phoneNumber,
        email: "",
        emailBusinessType: "bindPhoneEmail",
        phoneBusinessType: "bindPhonePhone"
      };
      axios.fetch("/users/bindEmailOrPhone", parmars, "post").then(data => {
        if (data.code == 0) {
          let crumbs = JSON.parse(localStorage.getItem("crumbs") || "{}");
          if (crumbs.type == 0) {
            this.$message("绑定成功");
          } else {
            this.$message.success("修改成功");
          }
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
.bind-tell {
  width: 524px;
  margin: 0 auto;
  padding: 60px 0;
}
.bind-tell .lable-name {
  width: 124px;
  padding-right: 24px;
  text-align: right;
}
.bind-tell li {
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
.rest-item .tell-number {
  display: flex;
}
.tell-number > div:first-child {
  flex: 1;
}
.tell-number > div:last-child {
  flex: 3;
  padding-left: 10px;
}
.item-value .el-button {
  width: 100%;
  height: 48px;
  border-radius: 0;
  border: 0 none;
  background: #66b3ff;
  font-size: 18px;
}
.item-value .disabled .el-button {
  background: #d6e1f0 !important;
}
.input-box .el-input__inner {
  width: 100%;
  height: 100%;
  border: 0 none;
}
</style>
