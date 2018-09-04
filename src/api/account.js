import fetch from "../utils/fetch";
export default {
  //获取用户信息
  account() {
    return fetch.fetch("/users/userInfo", {}, "get");
  },
  //获取登陆记录
  loginTime() {
    return fetch.fetch("/users/loginRecord", {}, "get");
  },
  //获取用户基本信息
  baseInfo() {
    return fetch.fetch("/users/queryUserInfo", {}, "get");
  },
  // 退出登录
  logout() {
    return fetch.fetch("/users/logout", {}, "get");
  },
  // 退出登录
  getGoogleKey() {
    return fetch.fetch("/users/getGoogleKey", {}, "get");
  }
};
