<template>
    <div class="google-auth">
      <div class="google">
        <div class="auth-name">
            <div class="rel" @click="firstStep">
                <div class=" abs" :class="step > 0 ?'step-active':'auth-icon'"></div>
                <div class="pl-40">
                    <div class="rel mb-14">
                        <span class="fs-16 color-333">第一步</span>
                        <div class="abs right-line" :class="step > 0 ?'authing':'unauth'"></div>
                    </div>
                    <div class="fs-16 color-999">{{stepTxt1}}</div>
                </div>
            </div>
            <div class="rel">
                <div class="abs" :class="step > 1 ?'step-active':'auth-icon'"></div>
                <div class="pl-40">
                    <div class="rel mb-14">
                        <span class="fs-16 color-333">第二步</span>
                        <div class="abs right-line" :class="step > 1 ?'authing':'unauth'"></div>
                    </div>
                    <div class="fs-16 color-999">{{stepTxt2}}</div>
                </div>
            </div>
            <div class="rel">
                <div class="abs" :class="step == 2 ?'step-active':'auth-icon'"></div>
                <div class="pl-40">
                    <div class="mb-14">
                        <span class="fs-16 color-333">第三步</span>
                    </div>
                    <div class="fs-16 color-999">完成谷歌验证绑定</div>
                </div>
            </div>
          </div>
          <div class="google-content shadow">
            <Googlnstall v-if="step == 0 && type != '1'"></Googlnstall>
            <GoogleReset @checkParmars='checkParmars' v-if="step == 0 && type == '1'"></GoogleReset>
            <BindGoogleAuth @verifyCode="verifyCode" v-if="step == 1"></BindGoogleAuth>
            <GoogleAuthSuccess v-if="step == 2"></GoogleAuthSuccess>
            <div class="mt-60 next-step" v-if="step != 2">
                <el-button @click="nextStep"  type="primary">{{nextStepTxt}}</el-button>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
import Googlnstall from "./googlnstall";
import GoogleReset from "./googleReset";
import BindGoogleAuth from "./bindGoogleAuth";
import GoogleAuthSuccess from "./googleAuthSuccess";
import axios from "../../utils/fetch.js";
export default {
  data() {
    return {
      type: "0",
      step: 0,
      stepTxt1: "安装谷歌认证器",
      stepTxt2: "添加CITEX账号",
      nextStepTxt: "下一步",
      verifyCodeData: {},
      resetGooleData: {}
    };
  },
  watch: {
    step: {
      handler(newValue, oldValue) {
        if (this.step == 0) {
          if ((this.type = 1)) {
            this.stepTxt1 = "重置谷歌认证器";
          } else {
            this.stepTxt1 = "安装谷歌认证器";
          }
          this.nextStepTxt = "下一步";
        } else if (this.step == 1) {
          this.stepTxt1 = "验证";
          this.nextStepTxt = "开启验证";
        } else if (this.step == 2) {
          this.stepTxt1 = "验证";
          this.stepTxt2 = "重新添加账号";
        }
      }
    }
  },
  mounted() {
    this.initGoogle();
  },
  components: {
    Googlnstall,
    GoogleReset,
    BindGoogleAuth,
    GoogleAuthSuccess
  },
  methods: {
    initGoogle() {
      let crumbs = JSON.parse(localStorage.getItem("crumbs"));
      this.type = crumbs.type;
      if (crumbs.type == 1) {
        this.step = 2;
      }
    },
    firstStep() {
      this.step = 0;
    },
    nextStep() {
      let that = this;
      if (this.step == 1) {
        this.bindGoogleAuth();
      } else {
        //绑定直接绑定
        if (this.type == 0) {
          this.step++;
        } else {
          // 、、修改需要验证谷歌验证码和手机验证码 flag 0 代表邮箱 1代表手机
          if (JSON.stringify(this.resetGooleData) == "{}") {
            this.$message.error("请输入验证码");
            return;
          }
          if (!this.resetGooleData.code) {
            this.$message.error("邮箱或手机验证码");
            return;
          }
          if (!this.resetGooleData.googleCode) {
            this.$message.error("请输入谷歌验证码");
            return;
          }

          let flag = this.resetGooleData.type;
          this.checkCode(flag);
        }
      }
    },
    //检查手机或者邮箱验证码
    checkCode(flag) {
      let parmars = {
        receiver: "", //接受者（手机号,邮箱号）
        receiverType: flag == 0 ? "EMAIL" : "PHONE", //接受者类型（手机：PHONE,邮箱:EMAIL）
        businessType: flag == 0 ? "googleEmail" : "googlePhone", //业务类型（注册等）
        code: this.resetGooleData.code //验证码
      };
      axios.fetch("/users/isValidAfterAuth", parmars, "get").then(data => {
        if (data && data.code == 0) {
          this.verificationGoogleCode();
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    // 验证谷歌验证码
    verificationGoogleCode() {
      if (
        !this.resetGooleData.googleCode ||
        this.resetGooleData.googleCode.length != 6
      ) {
        this.$message.error("请输入6位谷歌验证码");
        return;
      }
      let parmars = {
        googleCode: this.resetGooleData.googleCode
      };
      axios.fetch("/users/judgeGoogleCode", parmars, "get").then(data => {
        if (data && data.code == 0) {
          this.step++;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //绑定谷歌验证
    bindGoogleAuth() {
      if (
        !this.verifyCodeData.verifyCode ||
        this.verifyCodeData.verifyCode.length != 6
      ) {
        this.$message.error("请输入6位谷歌验证码");
        return;
      }
      let that = this;
      let parmars = {
        googleCode: this.verifyCodeData.secret, //密钥（secret）
        code: this.verifyCodeData.verifyCode //谷歌验证码
      };
      axios.fetch("/users/bindGoogleKey", parmars, "get").then(data => {
        if (data && data.code == 0) {
          that.step++;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    //谷歌验证码
    verifyCode(data) {
      this.verifyCodeData = data;
    },
    //重置谷歌验证码所需的短信或者邮箱验证码
    checkParmars(data) {
      this.resetGooleData = data;
    }
  }
};
</script>

<style>
.step-active {
  width: 40px;
  height: 100%;
  top: 0;
  left: 0;
  background: url("../../assets/user/kyc_003.png") no-repeat left top;
}
.google-auth {
  width: 100%;
  background: #f8f8fb;
}
.google {
  margin-bottom: 100px;
}
.auth-icon {
  width: 40px;
  height: 100%;
  top: 0;
  left: 0;
  background: url("../../assets/user/kyc_002.png") no-repeat left top;
}
.auth-name {
  width: 710px;
  display: flex;
  margin: 0 auto;
  padding-bottom: 30px;
}
.auth-name > div {
  margin-right: 10px;
  display: inline-block;
  flex: 1;
}
.right-line {
  width: 86px;
  height: 1px;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
}
.authing {
  background: #66b3ff;
}
.unauth {
  background: #d6e1f0;
}
.google-content {
  width: 100%;
  padding: 60px 0;
  border-radius: 6px;
  background: #fff;
  text-align: center;
}
.shadow {
  -moz-box-shadow: 0 6px 5px #e8f1fb;
  box-shadow: 0 6px 5px #e8f1fb;
}
.next-step .el-button {
  width: 400px;
  height: 50px;
  border-radius: 0;
  font-size: 18px;
  background: #66b3ff;
  border: 0 none;
}
</style>
