<template>
    <div class="login-register rel" :style="screenHeight">
        <Header v-bind:headerBg="headerBg"></Header>
        <div class="login-form abs">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Header from "../layout/header";
export default {
  data() {
    return {
      screenHeight: {
        height: window.screenHeight + "px"
      },
      headerBg: false
    };
  },
  components: {
    Header
  }
};
</script>

<style>
.login-register {
  width: 100%;
  background: url("../../assets/login/login_bg.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 140px;
}
.login-form {
  width: 464px;
  background: #fff;
  border-radius: 10px;
  top: 140px;
  right: 164px;
  padding: 54px 40px;
}
</style>