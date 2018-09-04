<template>
    <div class="forgot-psw">
        <div>
          <div class="fl fs-30">忘记密码</div>
          <div class="fr">
            <ul class="for-table">
              <li :class="table == '0' ? 'active' : ''" @click="table = '0'">手机找回</li>
              <li :class="table == '1' ? 'active' : ''" @click="table = '1'">邮箱找回</li>
            </ul>
          </div>
        </div>
        <div class="mt-50">
          <div class="phone-table-form" v-if='table == "0"'>
            <ul>
              <li class="mb-30">
                <div class="show-national-number">+{{value}}</div>
                <div class="national-number">
                  <el-select v-model="value" placeholder="请选择">
                    <el-option
                      v-for="item in cities"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </div>
                <div class="phone-number">
                  <input type="text" v-model="phoneNumber" placeholder="请您输入手机号" maxlength="11">
                </div>
              </li>
              <li class="phone-code">
                <div class="fl">
                  <input type="text" placeholder="请输入验证码" @keyup="checkMscode" v-model="msgCode">
                </div>
                <div class="fr">
                  <input type="button" @click="countDown" :disabled='isDis' :class="isDis?'disable' : 'undisable'" :value="btnValue">
                </div>
              </li>
            </ul>
          </div>
          <div class="email-address" v-if='table == "1"'>
            <div>
              <input type="text" v-bind="emailNumber" placeholder="请输入您的邮箱地址">
            </div>
          </div>
          <div class="sub-btn" :class="disSubBtn? 'disable-btn':''">
            <el-button :disabled="disSubBtn" @click="submitCheck" type="primary">{{table == '0'? "提交":"发射重置密码邮件"}}</el-button>
          </div>
        </div>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
export default {
  data() {
    return {
      table: "0",
      phoneNumber: "",
      emailNumber: "",
      msgCode: "",
      cities: [
        {
          value: "86",
          label: "北京"
        },
        {
          value: "89",
          label: "上海"
        },
        {
          value: "90",
          label: "南京"
        }
      ],
      value: "86",
      btnValue: "获取验证码",
      isDis: false,
      disSubBtn: true
    };
  },
  watch: {
    table(newValue) {
      this.disSubBtn = true;
    }
  },
  methods: {
    //倒计时
    countDown() {
      let parmars = {
        receiver: this.phoneNumber,
        businessType: "findPasswordPhone"
      };
      axios
        .fetch("/users/getVerifyCodeBeforeAuth", parmars, "get")
        .then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
          }
        });
      let that = this;
      this.isDis = true;
      let number = 60;
      this.btnValue = number + "s";
      let timeer = setInterval(() => {
        number--;
        that.btnValue = number + "s";
        if (number < 0) {
          that.isDis = false;
          that.btnValue = "获取验证码";
          clearInterval(timeer);
        }
      }, 1000);
    },
    //校验账号验证码是否符合规范
    checkMscode() {
      if (this.msgCode) {
        this.disSubBtn = false;
      }
    },
    // 校验验证码是否正确
    submitCheck() {
      if (this.table == 0) {
        let parmars = {
          receiver: this.phoneNumber,
          businessType: "findPasswordPhone",
          code: this.msgCode
        };
        axios.fetch("/users/isValidBeforeAuth", parmars, "get").then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
            return;
          }
          this.$router.push(
            "/restLoginPsw/" + this.phoneNumber + "/" + this.msgCode
          );
        });
      } else {
      }
    }
  }
};
</script>

<style>
.forgot-psw {
  overflow: hidden;
}
.forgot-psw > div {
  overflow: hidden;
}
.for-table {
  display: flex;
}
.for-table li {
  flex: 1;
  height: 38px;
  line-height: 38px;
  font-size: 18px;
  color: #121a21;
}
.for-table li:first-child {
  margin-right: 50px;
}
.for-table .active {
  border-bottom: 2px solid #66b3ff;
  color: #66b3ff;
}
.forgot-psw .phone-table-form li {
  height: 48px;
  line-height: 48px;
  border-bottom: 1px solid #e7e8e8;
  box-sizing: border-box;
  color: #a6a7a8;
}
.show-national-number {
  display: inline-block;
  padding: 0 0 0 10px;
  line-height: 48px;
  font-size: 16px;
}
.national-number .el-input__inner {
  border: 0 none;
  color: #a6a7a8;
  font-size: 16px;
}
.phone-table-form .national-number {
  display: inline-block;
  width: 100px;
  height: 48px;
}
.phone-table-form .phone-number {
  float: right;
  width: 220px;
  height: 48px;
}
.phone-table-form .phone-number input {
  float: right;
  font-size: 16px;
  text-align: right;
  height: 100%;
}
.forgot-psw .phone-code input {
  line-height: 48px;
  height: 100%;
  font-size: 16px;
  color: #a6a7a8;
}
.forgot-psw .phone-code input[type="button"] {
  line-height: 30px;
  padding-left: 34px;
  padding-right: 8px;
  border-left: 1px solid #e7e8e8;
  color: #66b3ff;
}

.forgot-psw .phone-code .disable {
  color: #a6a7a8 !important;
}
.forgot-psw .phone-code .undisable {
  color: #66b3ff !important;
}
.forgot-psw .sub-btn {
  width: 100%;
  height: 48px;
  margin-top: 48px;
}
.forgot-psw .sub-btn .el-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border: 0 none;
}
.disable-btn .el-button {
  background: #d6e1f0;
}
.forgot-psw .email-address {
  height: 48px;
  line-height: 48px;
}
.forgot-psw .email-address input {
  width: 100%;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  color: #a6a7a8;
}
</style>
