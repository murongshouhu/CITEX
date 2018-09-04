<template>
    <div class="modify">
        <div class="modify-title pr-30">
            <p class="fs-28 fl">
                <router-link to="/personal/account">用户中心></router-link>
            </p>
            <p class="fs-28 fl">{{title}}</p>
        </div>
        <div class="modify-content shadow">
            <router-view></router-view>
        </div>
    </div>
</template>

 <script>
export default {
  data() {
    return {
      title: ""
    };
  },
  created() {
    let crumbs = JSON.parse(localStorage.getItem("crumbs"));
    this.title = crumbs.title;
  }
};
</script>

 <style>
.modify {
  width: 100%;
  padding: 60px 0;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
}
.modify {
  background: #f8f8fb;
  padding: 68px 100px 0;
}
.modify-title {
  border-bottom: 1px solid #d6e1f0;
  margin-bottom: 40px;
  height: 62px;
}
.modify-title p a {
  color: #388cff;
}
.modify-content {
  width: 100%;
  border-radius: 6px;
  background: #fff;
  margin-bottom: 100px;
}
.shadow {
  -moz-box-shadow: 0 6px 5px #e8f1fb;
  box-shadow: 0 6px 5px #e8f1fb;
}
</style>
 
 