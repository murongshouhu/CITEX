<template>
    <div class="identity">
        <div class="kycOne">
            <el-steps :active="active" :space="500" finish-status="success">
                <el-step title="KYC1" >1111</el-step>
                <el-step title="KYC2">2222</el-step>
                <el-step title="KYC3">3333</el-step>
            </el-steps>
        </div>
        <div class="identity-content shadow">
        <kyc1 @ee="cc" v-show="kyc1Show"></kyc1>
        <kyc2 @ee="cc" v-show="kyc2Show"></kyc2>
        <div class="authentication-Ok" v-show="kyc3Show">
            <img src="../../assets/user/success_001.png" alt="">
            KYC2认证已通过
        </div>
        </div>
    </div>
</template>

<script>
import fetch from "../../utils/fetch.js";
import kyc1 from "./kyc1";
import kyc2 from "./kyc2";
export default {
  data() {
    return {
      active: 1,
      kyc1Show: true,
      kyc2Show: false,
      kyc3Show: false
    };
  },
  components: {
    kyc1,
    kyc2
  },
  mounted() {
    this.toshow();
  },
  methods: {
    cc() {
      if (this.active++ > 2) this.active = 0;
      this.kyc1Show = !this.kyc1Show;
      this.kyc2Show = !this.kyc2Show;
    },
    toshow() {
      fetch.fetch("/kyc/getCertInfo", "get").then(data => {
        if (data && data.code == 0) {
          let leve = data.data.certificationGrade;
          if (leve == 1) {
            this.active = 2;
            this.kyc1Show = false;
            this.kyc2Show = true;
          } else if (leve == 2) {
            this.active = 3;
            this.kyc1Show = false;
            this.kyc2Show = false;
            this.kyc3Show = true;
          }
        }
      });
    }
  }
};
</script>

<style>
.identity {
  margin-bottom: 100px;
}
.kyc-icon {
  width: 40px;
  height: 100%;
  top: 0;
  left: 0;
  background: url("../../assets/user/kyc_002.png") no-repeat left top;
}
.kycOne {
  width: 810px;
  margin: 0 auto;
}
.kycOne .el-step__title.is-process {
  font-size: 14px;
  font-weight: 200 !important;
}
.kyc-name {
  width: 710px;
  display: flex;
  margin: 0 auto;
  padding-bottom: 30px;
}
.kyc-name a {
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
.identity-content {
  width: 100%;
  padding: 60px 0;
  border-radius: 6px;
  background: #fff;
}
.shadow {
  -moz-box-shadow: 0 6px 5px #e8f1fb;
  box-shadow: 0 6px 5px #e8f1fb;
}
.authentication-Ok {
  text-align: center;
  font-size: 42px;
  color: #333;
  padding: 100px 0;
}
.authentication-Ok img {
  width: 76px;
  height: 76px;
  vertical-align: middle;
}
</style>
