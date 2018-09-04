<template>
    <div class="personal">
        <div class="personal-title pr-30">
            <p class="fs-28 fl">用户中心</p>
            <div class="fr auth fs-20">
                <ul>
                    <li>
                        <router-link to="/personal/account">账户信息</router-link>
                    </li>
                    <li class="rel">
                        <div class="abs uncertified fs-14">未认证</div>
                        <router-link to="/personal/identity/kyc1">身份认证</router-link>
                    </li>
                </ul>
            </div>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style>
.personal {
  background: #f8f8fb;
  padding: 68px 100px 0;
  overflow: hidden;
}
.personal-title {
  border-bottom: 1px solid #d6e1f0;
  margin-bottom: 40px;
  height: 62px;
}
.personal-title p {
  color: #333;
}

.auth li {
  float: left;
  line-height: 60px;
}
.auth li:first-child {
  margin-right: 75px;
}
.uncertified {
  top: 0;
  right: -34px;
  color: #fff;
  padding: 1px 8px 3px;
  line-height: 20px;
  background: url("../../assets/user/uncertified.png") no-repeat left center;
  background-size: 100%;
}
.auth li a {
  display: inline-block;
  width: 100%;
  height: 100%;
  color: #999;
  padding: 0 6px;
}

.auth li .router-link-active {
  color: #388cff;
  border-bottom: 3px solid #388cff;
  text-align: center;
}
</style>


