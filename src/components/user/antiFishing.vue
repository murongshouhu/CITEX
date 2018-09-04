<template>
    <div class="anti-fishing">
        <p class="fs-26 color-333 mb-22">设置您专属的防钓鱼码</p>
        <p class="fs-22 color-999 mb-60">设置防钓鱼码之后，CITEX给您发送的邮件中会包含此码；没有包含此码的为伪造、诈骗邮件。</p>
        <div>
            <ul>
                <li>
                    <div class="rel fish-item pt-10">
                        <div class="abs fish-lable fs-18 color-333">设置防钓鱼码:</div>
                        <div class="info-input">
                            <el-input v-model="antiFishInfo"></el-input>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="rel fish-item pt-10">
                        <div class="abs fish-lable fs-18 color-333"></div>
                        <div class="info-input mt-60">
                             <el-button type="primary" @click="goSet">确认</el-button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="bomb-box" v-show="isShow">
            <div class="show-box">
              <img class="close abs" @click="isShow = !isShow" src="../../assets/icon/close_001.png" alt="">
              <div class="phone-Email-msgcode">
                <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
                    <el-tab-pane label="邮箱修改" name="first">
                        <div class="input-item">
                          <input type="text" v-model="emailMsg">
                          <input type="button" :class="disabled1?'disabled':''"  :disabled="disabled1" @click="sendEmailMsg"  v-model="senBtnTxt1">
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="手机修改" name="second">
                        <div class="input-item">
                          <input type="text" v-model="phoneMsg">
                          <input type="button" :class="disabled2?'disabled':''" :disabled="disabled2" @click="sendPhoneMsg" v-model="senBtnTxt2">
                        </div>
                    </el-tab-pane>
                </el-tabs>
              </div>
              <div class="sure" @click="bindFishingCode"> 确定</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
export default {
  data() {
    return {
      antiFishInfo: "",
      isShow: false,
      activeName: "first",
      accountType: "0",
      phoneMsg: "",
      emailMsg: "",
      disabled1: false,
      disabled2: false,
      senBtnTxt1: "发送验证码",
      senBtnTxt2: "发送验证码"
    };
  },
  methods: {
    handleClick(tab, event) {
      this.accountType = tab.index;
    },
    goSet() {
      if (!this.antiFishInfo) {
        this.$message.error("请输入防钓鱼码");
        return;
      }
      this.isShow = true;
    },
    sendEmailMsg() {
      this.sendCode();
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
    sendPhoneMsg() {
      this.sendCode();
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
    sendCode() {
      let parmars = {
        receiver: "",
        receiverType: this.accountType == 0 ? "EMAIL" : "PHONE",
        businessType: this.accountType == 0 ? "fishingEmail" : "fishingPhone"
      };
      axios
        .fetch("/users/getVerifyCodeAfterAuth", parmars, "get")
        .then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
          }
        });
    },
    bindFishingCode() {
      if (
        (this.accountType == 1 && !this.phoneMsg) ||
        (this.accountType == 0 && !this.emailMsg)
      ) {
        this.$message.error("请输入验证码");
        return;
      }
      let parmars = {
        validCode: this.accountType == 0 ? this.emailMsg : this.phoneMsg,
        fishingCode: this.antiFishInfo,
        businessType: this.accountType == 0 ? "fishingEmail" : "fishingPhone"
      };
      axios.fetch("/users/bindFishingCode", parmars, "post").then(data => {
        if (data.code == 0) {
          this.isShow = false;
          this.$router.push("/personal/modify/bindOresetSuccess");
        } else {
          this.$message.error(data.msg);
        }
      });
    }
  }
};
</script>

<style lang="scss">
.anti-fishing {
  width: 100%;
  background: #fff;
  padding: 80px 0;
}
.anti-fishing > p {
  text-align: center;
}
.fish-item {
  width: 540px;
  margin: 0 auto;
}
.fish-lable {
  top: 10px;
  left: 0;
  line-height: 48px;
}
.info-input {
  padding-left: 140px;
}
.info-input .el-input__inner {
  height: 48px;
  border-radius: 0;
  background: #f8f8fb;
}
.info-input .el-button {
  width: 100%;
  border: 0 none;
  height: 48px;
  font-size: 18px;
}
.bomb-box {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 99999999999999999;
  .show-box {
    position: absolute;
    top: 50%;
    left: 50%;
    display: inline-block;
    padding: 20px 200px;
    background: #fff;
    border-radius: 4px;
    transform: translateX(-50%) translateY(-50%);
    .close {
      top: 20px;
      right: 20px;
    }
    .phone-Email-msgcode {
      width: 524px;
      margin: 0 auto;
      padding: 60px 0 40px;
      .el-tabs__item {
        font-size: 18px;
      }
      .input-item {
        width: 522px;
        margin: 40px auto 0;
        display: flex;
        > input {
          border: 1px solid #e2e2e2;
          height: 48px;
          line-height: 48px;
          font-size: 18px;
        }
        > input:first-child {
          flex: 2;
          padding-left: 10px;
        }
        > input:last-child {
          margin-left: 10px;
          flex: 1;
          color: #fff;
          background: #66b3ff;
        }
        .disabled {
          background: #e2e2e2 !important;
        }
      }
    }
    .sure {
      width: 50%;
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      color: #fff;
      background: #66b3ff;
      text-align: center;
      margin: 0 auto 30px;
    }
  }
}
</style>
