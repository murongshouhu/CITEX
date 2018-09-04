<template>
    <div class="reset-success">
        <img src="../../assets/user/success_001.png" alt="success">
        <p class="fs-26 color-333 mt-40 mb-24">{{bindOrResetTxt}}</p>
        <p class="fs-24 color-999 mb-50">{{count}} 秒钟之后将自动跳转至用户中心</p>
    </div>
</template>

<script>
export default {
  data() {
    return {
      count: 3,
      bindOrResetTxt: "修改成功"
    };
  },
  mounted() {
    this.getMode();
    this.countDown();
  },
  methods: {
    countDown() {
      let that = this;
      setInterval(() => {
        that.count--;
        if (that.count == 0) {
          that.$router.push({ path: "/personal/account" });
        }
      }, 1000);
    },
    getMode() {
      let crumbs = localStorage.getItem("crumbs");
      if (crumbs) {
        let crumbsObj = JSON.parse(crumbs);
        crumbsObj.type == 0
          ? (this.bindOrResetTxt = "绑定成功")
          : (this.bindOrResetTxt = "修改成功");
      } else {
        this.bindOrResetTxt = "你走错路了...";
      }
    }
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
