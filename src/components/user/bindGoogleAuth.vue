<template>
    <div class="bind-google">
        <p class="fs-24 color-333 mb-26">在谷歌身份验证器中，添加您的CITEX账号密钥</p>
        <p class="fs-18 color-999 mb-60">点击“添加新账户 (iOS 下是 + 号)”->“扫描条形码”，扫描以下二维码 或 点击“输入提供的密钥”，手动输入以下密钥。</p>
        <div class="google-verify">
            <div>
                <div class="secret-key-code fl"><img class="QRCode" id="imgSrc" src="" alt=""></div>
                <div class="fr copy-secret-key">
                    <div class="mb-28 copy-key">
                        <div class="fs-20 color-333 key-text fl">密钥：{{googleKey.secret}}</div>
                        <div class="copy-btn fr">
                            <el-button type="primary"
                            v-clipboard:copy="googleKey.secret"
                            >复制</el-button>
                        </div>
                    </div>
                    <div>
                        <p class="fs-16 color-999 alert">请牢记此密码，将它保存到您熟悉的固定地方，如发生手机丢失等情况需要此密钥重新打开</p>
                    </div>
                    <p class="fs-16 color-333 mb-18 mt-60 pt-16">填写谷歌验证码，完成谷歌验证绑定</p>
                    <p class="fs-16 color-999 mb-40 left ">谷歌身份验证器配置完成后，会显示一个 6 位数字，每隔 30 秒变化一次。这个数字即为您的谷歌验证码</p>
                    <div class="fs-26 color-999 pd-10 google-verify-code">
                        <div class="rel">
                            <!-- <div class="google-lable abs fs-18 color-333">谷歌验证码：</div> -->
                            <div class="verify-code">
                                <el-input v-model="verifyCode" @blur="transmitVerifyCode" placeholder="请填写谷歌验证码"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import accountApi from "../../api/account.js";
import QRCode from "qrcode";
export default {
  data() {
    return {
      googleKey: {},
      verifyCode: ""
    };
  },
  mounted() {
    this.getGoogleKey();
  },
  methods: {
    onCopy() {},
    transmitVerifyCode() {
      this.googleKey.verifyCode = this.verifyCode;
      this.$emit("verifyCode", this.googleKey);
    },
    //获取谷歌验证二维码和秘钥
    getGoogleKey() {
      accountApi.getGoogleKey().then(data => {
        if (data && data.code == 0) {
          this.googleKey = data.data;
          this.qrCode(data.data.qrcode);
        }
      });
    },
    //生成二维码
    qrCode(newValue) {
      QRCode.toDataURL(newValue, { errorCorrectionLevel: "H" }, function(
        err,
        url
      ) {
        document.getElementById("imgSrc").src = url;
      });
    }
  }
};
</script>

<style lang="scss">
.bind-google {
  padding: 0 20px;
  .el-button--primary {
    background: #fff;
    border: 0 none;
    color: #388cff;
  }
}
.google-verify {
  width: 420px;
  margin: 0 auto;
  justify-content: center;
}
.google-verify > div {
  display: inline-block;
}
.secret-key-code {
  width: 154px;
  height: 154px;
  margin-left: -230px;
}
.secret-key-code img {
  width: 100%;
  height: 100%;
}
.copy-secret-key {
  width: 440px;
}
.copy-secret-key .alert {
  text-align: left;
}
.copy-key {
  border-bottom: 1px solid #d6e1f0;
  padding-bottom: 10px;
  overflow: hidden;
}
.key-text {
  width: 300px;
  display: inline-block;
  line-height: 44px;
}
.copy-btn .el-button {
  height: 44px;
  font-size: 16px;
}
.google-verify-code {
  justify-content: center;
  box-sizing: border-box;
}
.google-verify-code > div {
  width: 100%;
  display: inline-block;
  /* padding-left: 136px; */
  line-height: 48px;
}
.google-lable {
  top: 0;
  left: 0;
}
.verify-code .el-input {
  height: 48px;
}
.verify-code .el-input__inner {
  border: 1px solid #d6e1f0;
  height: 48px;
  width: 100%;
  border-radius: 0;
  background: #f8f8fb;
  color: #999;
  font-size: 18px;
}
</style>
