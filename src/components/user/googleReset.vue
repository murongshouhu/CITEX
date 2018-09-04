<template>
    <div class="google-reset">
        <!-- 修改谷歌验证 -->
        <div class="rest-google">
            <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
                <el-tab-pane label="邮箱验证" name="first">
                  <div class="mt-32">
                      <ul>
                          <li class="rel mb-20">
                              <div class="goo-lable abs fs-18 color-333">邮箱验证码：</div>
                              <div class="input-item phone-code">
                                  <div class="fl">
                                      <el-input @blur="getParmars" v-model="emailCode" placeholder="请输入验证码"></el-input>
                                  </div>
                                  <div class="fr send-msgcode" :class="disabled1?'disabled':''">
                                      <el-button @click="sendEmailCode" :disabled="disabled1" type="primary">{{senBtnTxt1}}</el-button>
                                  </div>
                              </div>
                          </li>
                          <li class="rel">
                              <div class="goo-lable abs fs-18 color-333">谷歌验证码：</div>
                              <div class="input-item google-mscode">
                                  <el-input @blur="getParmars" v-model="googleCode1" placeholder="请填写谷歌验证码"></el-input>
                              </div>
                          </li>
                      </ul>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="手机验证" name="second">
                  <div class="mt-32">
                      <ul>
                          <li class="rel mb-20">
                              <div class="goo-lable abs fs-18 color-333">手机验证码：</div>
                              <div class="input-item phone-code">
                                  <div class="fl">
                                      <el-input @blur="getParmars" v-model="phoneCode" placeholder="请输入验证码"></el-input>
                                  </div>
                                  <div class="fr send-msgcode " :class="disabled2?'disabled':''">
                                      <el-button @click="sendPhoneCode" :disabled="disabled2" type="primary">{{senBtnTxt2}}</el-button>
                                  </div>
                              </div>
                          </li>
                          <li class="rel">
                              <div class="goo-lable abs fs-18 color-333">谷歌验证码：</div>
                              <div class="input-item google-mscode">
                                  <el-input @blur="getParmars" v-model="googleCode2" placeholder="请填写谷歌验证码"></el-input>
                              </div>
                          </li>
                      </ul>
                  </div>
              </el-tab-pane>
              
          </el-tabs>
        </div>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
export default {
  data() {
    return {
      activeName: "first",
      phoneCode: "",
      emailCode: "",
      googleCode1: "",
      googleCode2: "",
      tabIndex: "0",
      senBtnTxt1: "发送验证码",
      senBtnTxt2: "发送验证码",
      disabled1: false,
      disabled2: false
    };
  },
  methods: {
    handleClick(tab, event) {
      this.tabIndex = tab.index;
      this.phoneCode = "";
      this.googleCode = "";
    },
    // 发送邮箱验证码
    sendEmailCode() {
      this.sendCode(0);
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
    // 发送手机验证码
    sendPhoneCode() {
      this.sendCode(1);
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
        receiver: "",
        receiverType: flag == 0 ? "EMAIL" : "PHONE",
        businessType: flag == 0 ? "googleEmail" : "googlePhone"
      };
      axios
        .fetch("/users/getVerifyCodeAfterAuth", parmars, "get")
        .then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
          }
        });
    },
    //子传父
    getParmars() {
      // tabIndex 1代表手机 0代表邮箱
      let parmars = {
        type: this.tabIndex,
        code: this.tabIndex == 0 ? this.emailCode : this.phoneCode,
        googleCode: this.tabIndex == 0 ? this.googleCode1 : this.googleCode2
      };
      this.$emit("checkParmars", parmars);
    }
  }
};
</script>

<style>
.google-reset {
  width: 522px;
  margin: 0 auto;
}
.google-reset .el-tabs__item {
  font-size: 18px;
}
.rest-google li {
  height: 48px;
  line-height: 48px;
  padding-left: 120px;
}
.rest-google .goo-lable {
  width: 120px;
  top: 0;
  left: 0;
}
.rest-google .input-item {
  width: 100%;
  height: 100%;
}
.rest-google .phone-code > div:first-child {
  width: 200px;
  height: 100%;
}

.rest-google .google-mscode,
.rest-google .phone-code > div:first-child {
  border: 1px solid #d6e1f0;
  background: #f8f8fb;
  overflow: hidden;
}
.rest-google .send-msgcode {
  border: 1px solid #d6e1f0;
}
.rest-google .send-msgcode .el-button {
  width: 190px;
  height: 48px;
  border: 0 none;
  border-radius: 0;
  font-size: 18px;
  margin-bottom: -1px;
  vertical-align: top;
}
.rest-google .disabled .el-button {
  background: #e2e2e2 !important;
  vertical-align: top;
}
.rest-google .el-input__inner {
  border: 0 none;
  height: 48px;
  background: #f8f8fb;
}
</style>
