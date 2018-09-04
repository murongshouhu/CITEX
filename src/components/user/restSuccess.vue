<template>
    <div class="reset-success">
        <img src="../../assets/user/success_001.png" alt="success">
        <p class="fs-26 color-333 mt-40 mb-24">修改成功</p>
        <p class="fs-24 color-999 mb-50">{{count}} 秒钟之后将自动跳转至登录页面</p>
    </div>
</template>

<script>
export default {
  data() {
    return {
      count: 3
    };
  },
  mounted() {
    let that = this;
    setInterval(() => {
      that.count--;
      if (that.count == 0) {
        localStorage.removeItem("userToken");
        that.$router.push({ path: "/login" });
      }
    }, 1000);
  }
};
</script>

<style>
.reset-success {
  text-align: center;
  padding: 60px 0;
}
.reset-success image {
  width: 120px;
}
</style>
