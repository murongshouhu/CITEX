<template>
    <div class="register-success">
        <div class="success-icon">
            <img src="../../assets/icon/reg_success.png" alt="success">
        </div>
        <div class="success-text">
            <p class="fs-30">注册成功，欢迎加入CITEX</p>
            <p class="fs-16">您现在可以进行充币操作，为了您的账户安全，再未进行身份认证之前将暂时无法进行交易。</p>
        </div>
        <div class="authen">
              <router-link to="/personal/identity/kyc1"><el-button type="primary">身份认证</el-button></router-link>
        </div>
        <div class="teach">
          <p>
            <span>如果您对数字货币还不够了解，您可以先查看 </span>
            <span class="newer"><router-link to="beginner">新手教程</router-link></span>
          </p>
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      msg: ""
    };
  }
};
</script>

<style>
.success-icon {
  text-align: center;
  margin-bottom: 60px;
}
.success-icon img {
  width: 76px;
  height: 76px;
}
.success-text {
  color: #333;
  text-align: center;
}
.success-text p:last-child {
  color: #999;
  margin-top: 42px;
  margin-bottom: 104px;
  padding: 0 10px;
}
.authen .el-button {
  width: 100%;
  height: 46px;
  font-size: 18px;
}
.authen a {
  display: inline-block;
  width: 100%;
  color: #fff;
}
.teach {
  margin-top: 22px;
  text-align: center;
  color: #999;
  margin-bottom: 70px;
}
.newer a {
  color: #66b3ff;
}
</style>
