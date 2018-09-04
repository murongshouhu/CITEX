<template>
  <!-- 资产管理  提币界面 -->
    <div class="withdraw-money">
        <div>
            <div class="rel withdraw-item rel">
                <div class="abs fs-18 color-333 withdraw-lable">提币地址({{withdrawParmar.symbol}})：</div>
                <div>
                    <div class="input-border">
                        <input class="bbnum" @keyup="checkAdress" v-model="inputAddress" placeholder="提币地址">
                    </div>
                </div>
            </div>
            <div class="rel withdraw-item rel">
                <div class="abs fs-18 color-333 withdraw-lable">数量：</div>
                <div>
                    <div class="input-border">
                        <input class="bbnum" type="text" v-model="inputNumber" @keyup="getActualAccount" placeholder="提币数量">
                    </div>
                </div>
            </div>
            <div class="withdraw-item rel fs-16 color-999">
                <div class="abs withdraw-lable"></div>
                <div><span class="mr-10">实际到账:</span><span>{{actualAccount}}{{withdrawParmar.symbol}}</span><span class="ml-60 mr-10">手续费:</span><span>{{(withdrawParmar.withdrawFlatFee-0).toFixed(6)}}{{withdrawParmar.symbol}}</span></div>
            </div>
            <div class="withdraw-item rel">
                <div class="abs withdraw-lable"></div>
                <div>
                    <el-button @click="isShow = !isShow" :disabled='isAllow' type="primary">提币</el-button>
                </div>
            </div>
        </div>
        <!-- 提币弹层输入密码 -->
        <div class="projectile fixed" v-show="isShow">
          <div class="projectile-box abs">
            <img @click="isShow = !isShow" class="close abs" src="../../assets/icon/close_001.png" alt="">
            <ul class="withdraw-validate">
              <li class="fs-24 center mb-60">安全验证</li>
              <!-- <li class="fs-18 lh-48 validate-item rel">
                <div class="abs right">登录密码：</div>
                <div>
                  <input class="validate-input" type="text" placeholder="请输入登录密码">
                </div>
              </li> -->
              <li class="fs-18 lh-48 validate-item rel">
                <div class="abs right">谷歌验证码</div>
                <div>
                  <input class="validate-input" v-model="googleCode" type="text" placeholder="请输入谷歌验证码">
                </div>
              </li>
              <li class="mt-20 fs-18 lh-48 validate-item rel">
                <div class="abs right">手机验证码：</div>
                <div class="email-code">
                  <input class="validate-input" v-model="phoneCode" placeholder="请输入手机验证码" type="text">
                  <input class="validate-input send-code" :class="disabled1?'disabled' : 'undisabled'" @click="countDown(0)" type="button" :disabled='disabled1' v-model="senBtnTxt1">
                </div>
              </li>
              <li class="mt-20 mb-60 fs-18 lh-48 validate-item rel">
                <div class="abs right">邮箱验证码：</div>
                <div class="email-code">
                  <input class="validate-input" v-model="emailCode" placeholder="请输入邮箱验证码" type="text">
                  <input class="validate-input send-code" :class="disabled2?'disabled' : 'undisabled'" @click="countDown(1)" type="button" :disabled='disabled2' v-model="senBtnTxt2">
                </div>
              </li>
              <li class="center">
                 <el-button @click="getMoney" type="primary">确定</el-button>
              </li>
            </ul>
          </div>
        </div>
        <!-- 温馨提示 -->
        <div class="fs-16 reminder">
            <p>温馨提示</p>
            <ul>
                <li>• 最小提币数量为：{{withdrawParmar.withdrawFlatFee}} CMT。</li>
                <li>• 为保障资金安全，当您账户安全策略变更、密码修改、使用新地址提币，我们会对提币进行人工审核，请耐心等待工作人员电话或邮件联系。</li>
                <li>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
export default {
  data() {
    return {
      inputAddress: "",
      inputNumber: "",
      actualAccount: 0,
      googleCode: "",
      phoneCode: "",
      emailCode: "",
      isShow: false,
      senBtnTxt1: "发送验证码",
      disabled1: false,
      senBtnTxt2: "发送验证码",
      disabled2: false,
      isAllow: true
    };
  },
  mounted() {
    console.log(this.withdrawParmar);
  },
  methods: {
    //计算实际到账数量
    getActualAccount() {
      if (this.inputAddress) {
        if (
          !this.inputNumber ||
          this.inputNumber <= this.withdrawParmar.minWithdrawQuantity
        ) {
          this.actualAccount = 0;
          this.isAllow = true;
          return;
        } else {
          this.isAllow = false;
        }
      }
      this.actualAccount =
        this.inputNumber - 0 - this.withdrawParmar.withdrawFlatFee;
    },
    // 校验提币数量是否符合要求
    checkAdress() {
      if (
        this.inputAddress &&
        this.inputNumber &&
        this.inputNumber >= this.withdrawParmar.withdrawFlatFee
      ) {
        this.isAllow = false;
      } else {
        this.isAllow = true;
      }
    },
    //倒计时
    countDown(type) {
      this.sendCode(type);
      let count = 60;
      type == 0 ? (this.senBtnTxt1 = "60s") : (this.senBtnTxt2 = "60s");
      type == 0 ? (this.disabled1 = true) : (this.disabled2 = true);
      let timer = setInterval(() => {
        count--;
        type == 0
          ? (this.senBtnTxt1 = count + "s")
          : (this.senBtnTxt2 = count + "s");
        if (count == 0) {
          type == 0 ? (this.disabled1 = false) : (this.disabled2 = false);
          type == 0
            ? (this.senBtnTxt1 = "发送验证码")
            : (this.senBtnTxt2 = "发送验证码");
          clearInterval(timer);
        }
      }, 1000);
    },
    sendCode(type) {
      let parmars = {
        receiver: "",
        receiverType: type == 1 ? "EMAIL" : "PHONE",
        businessType: type == 1 ? "withdrawEmail" : "withdrawPhone"
      };
      axios
        .fetch("/users/getVerifyCodeAfterAuth", parmars, "get")
        .then(data => {
          if (data.code != 0) {
            this.$message.error(data.msg);
          }
        });
    },
    // 提现操作
    getMoney() {
      if (!this.googleCode) {
        this.$message.error("请输入谷歌验证码");
        return;
      }
      if (!this.phoneCode) {
        this.$message.error("请输入手机验证码");
        return;
      }
      if (!this.emailCode) {
        this.$message.error("请输入邮箱验证码");
        return;
      }
      let parmars = {
        currencyId: this.withdrawParmar.currencyId, //币种ID
        address: this.inputAddress, //转入地址
        num: this.inputNumber, //数量
        phoneCode: this.phoneCode, //手机验证码
        emailCode: this.emailCode, //邮箱验证码
        googleCode: this.emailCode, //谷歌验证码
        emailBusinessType: "withdrawEmail",
        phoneBusinessType: "withdrawPhone"
      };
      axios.fetch("/asset/wallet/withdraw", parmars, "post").then(data => {
        console.log(data);
      });
    }
  },
  props: ["withdrawParmar"]
};
</script>
<style lang='scss'>
.withdraw-money {
  display: flex;
  padding: 0 40px;
  .projectile {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba($color: #000000, $alpha: 0.3);
    z-index: 99999999999;
    .projectile-box {
      width: 860px;
      top: 50%;
      left: 50%;
      padding: 46px 168px 60px;
      border-radius: 6px;
      transform: translateX(-50%) translateY(-50%);
      background: #fff;
      .close {
        top: 30px;
        right: 30px;
      }
      .withdraw-validate {
        overflow: hidden;
        color: #000;
        .el-button {
          width: 206px;
          height: 48px;
          margin: 0 auto;
          font-size: 20px;
          border: 0 none;
        }
      }
    }
    .validate-item > div:first-child {
      top: 0;
      left: 0;
      width: 118px;
    }
    .validate-item > div:last-child {
      padding-left: 140px;
    }
    .validate-input {
      width: 100%;
      line-height: 46px;
      padding-left: 52px;
      background: #f8f8fb;
      border: 1px solid #d6e1f0;
    }
    .email-code {
      display: flex;
      input {
        flex: 1;
      }
      .send-code {
        padding: 0;
        margin-left: 10px;
      }
      .undisabled {
        background: #66b3ff;
        color: #fff;
      }
      .disabled {
        background: #f8f8fb;
      }
    }
  }
}
.withdraw-money > div {
  flex: 1;
}
.withdraw-money > div:first-child {
  padding-right: 40px;
}
.withdraw-money > div:last-child {
  margin-left: 40px;
}
.withdraw-item {
  max-width: 620px;
  height: 48px;
  line-height: 48px;
  padding-left: 150px;
  margin-bottom: 15px;
}
.withdraw-item:last-child {
  margin-top: 45px;
}
.withdraw-item > div {
  display: inline-block;
}
.withdraw-item > div:last-child {
  width: 100%;
  height: 48px;
}
.withdraw-item .withdraw-lable {
  width: 140px;
  top: 0;
  left: 0;
  text-align: right;
}
.input-border {
  border: 1px solid #d6e1f0;
  background: #fff;
}
.input-border .bbnum {
  height: 100%;
  font-size: 18px;
  height: 48px;
  line-height: 48px;
  padding-left: 16px;
  color: #606266;
}
.input-border .el-input {
  font-size: 18px;
}
.input-border .el-input__inner {
  border: 0 none;
  height: 48px;
}
.withdraw-item:last-child .el-button {
  width: 100%;
  font-size: 18px;
  height: 48px;
  border-radius: 0;
  border: 0 none;
}
.withdraw-money .reminder {
  color: #626262;
  line-height: 48px;
}
.withdraw-money .reminder p {
  color: #0b0c22;
}
</style>
