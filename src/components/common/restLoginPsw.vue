<template>
    <div class="rest-login-psw">
        <div class="rest-login-psw-title">重置密码</div>
        <div class="rest-psw-input">
            <ul>
                <li class="mt-60">
                    <input type="password" v-model="firstPsw" placeholder="请输入您的新密码">
                </li>
                <li class="mt-30">
                    <input type="password" v-model="secondPsw" placeholder="请重新输入您的新密码">
                </li>
            </ul>
        </div>
        <div class="reset-btn mt-50">
            <el-button @click="changePsw" type="primary">确认</el-button>
        </div>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
export default {
  data() {
    return {
      firstPsw: "",
      secondPsw: ""
    };
  },
  mounted() {
    console.log(this.$route.params.msgCode);
  },
  methods: {
    changePsw() {
      if (this.firstPsw != "" && this.firstPsw == this.secondPsw) {
        let parmars = {
          username: this.$route.params.userName,
          password: this.$md5(this.firstPsw),
          validCode: this.$route.params.msgCode,
          login_pass_grade: "2",
          businessType: "findPasswordPhone"
        };
        axios.fetch("/users/updatePassword", parmars, "post").then(data => {
          if (data && data.code == 0) {
            this.$router.push("/login");
          } else {
            this.$message.error(data.msg);
          }
        });
      } else if (this.firstPsw == "" && this.secondPsw == "") {
        this.$message.error("请输入您的新密码");
      } else {
        this.$message.error("两次输入的密码不一致");
      }
    }
  }
};
</script>

<style>
.rest-login-psw .rest-login-psw-title {
  color: #121a21;
  font-size: 34px;
}
.rest-psw-input li {
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  color: #a6a7a8;
  border-bottom: 1px solid #e7e8e8;
}
.rest-login-psw .reset-btn .el-button {
  width: 100%;
  height: 48px;
  border: 0 none;
  font-size: 16px;
}
</style>
