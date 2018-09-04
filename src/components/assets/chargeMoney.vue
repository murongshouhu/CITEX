<template>
    <div class="charge-money">
        <div class="bb-address pl-40 fs-16 rel">
            <p class="mb-30">充币地址({{bbKey.name}})：</p>
            <div class="bb-key">
                <el-input v-model="bbKey.key"></el-input>
                <el-button type="primary"
                v-clipboard:copy="bbKey.key"
                v-clipboard:success="onCopy"
                >复制地址</el-button>
                <div class="qr-code rel"><div>
                    <img class="abs QRCode" id="imgSrc" src="" alt="">
                  </div></div>
            </div>
            <div class="fs-16 color-999 abs track">
              <span>查看</span><span class="charge-record" @click="track">充币记录</span><span>跟踪状态</span>
            </div>
        </div>
        <div class="intro fs-16">
            <p>温馨提示</p>
            <ul>
                <li>• 请勿向上述地址充值任何非BCH资产，否则资产将不可找回。</li>
                <li>• 您充值至上述地址后，需要整个网络节点的确认，2次网络确认后到账，6次网络确认后可提币。</li>
                <li>• 最小充值金额：0.0001 BCH，小于最小金额的充值将不会上账且无法退回。</li>
                <li>• 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</li>
            </ul>
        </div>
    </div>
</template>

<script>
import QRCode from "qrcode";
export default {
  data() {
    return {
      show: true
    };
  },
  watch:{
    bbKey(newValue){
      this.qrCode(newValue);
    }
  },
  mounted() {
    
  },
  methods: {
    onCopy() {},
    track() {
      this.$router.push({ path: "/assets/finance" });
    },
    //生成二维码
    qrCode(newValue) {
      QRCode.toDataURL(
        newValue.key,
        { errorCorrectionLevel: "H" },
        function(err, url) {
          document.getElementById("imgSrc").src = url;
        }
      );
    }
  },
  props: ["bbKey"]
};
</script>
<style>
.charge-money {
  display: flex;
}
.charge-money > div {
  flex: 1;
}
.bb-address {
  color: #0b0c22;
}
.bb-key .el-input {
  width: 272px;
  margin-right: 10px;
}
.bb-key .el-input .el-input__inner {
  height: 46px;
  line-height: 46px;
  font-size: 16px;
  color: #0b0c22;
  border-radius: 1px solid #dfe4ef;
}
.bb-key .el-button {
  border: 0 none;
}
.bb-key .qr-code {
  display: inline-block;
  width: 60px;
  height: 44px;
  border-radius: 4px;
  border: 1px solid #e8ebf3;
  vertical-align: middle;
  margin-left: 10px;
  background: #fff;
}
.bb-key .qr-code div {
  width: 100%;
  height: 100%;
  background: url("../../assets/user/code.png") no-repeat center;
}
.bb-key .qr-code div:hover .QRCode {
  display: block;
}
.bb-key .qr-code .QRCode {
  top: 40px;
  right: 0;
  display: none;
}
.intro {
  padding: 0 20px;
}
.intro p {
  color: #0b0c22;
}
.intro li {
  color: #626262;
  margin-top: 30px;
}
</style>

