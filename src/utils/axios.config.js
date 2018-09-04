import router from "../router";
import axios from "axios";
import fetch from "../utils/fetch";
import accountApi from "../api/account.js";
import Vue from "vue";
let $vm = new Vue();
let axiosConfig = () => {
  /**
   *
   * 登陆拦截信息
   */
  // axios.defaults.baseURL = 'http://47.52.234.104';               //配置你的接口请求地址
  // axios.defaults.headers.common["Authorization"] = "Basic d2ViYXBwOndlYmFwcA=="; //配置token,看情况使用
  axios.defaults.headers.post["Content-Type"] =
    "application/json;charset=UTF-8"; //配置请求头信息。

  // http request 请求拦截器，有token值则配置上token值
  axios.interceptors.request.use(
    config => {
      // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
      let userToken = JSON.parse(localStorage.getItem("userToken") || "{}");
      let AUTH_TOKEN = userToken.access_token;
      let TOKEN_TYPE = userToken.token_type;
      if (AUTH_TOKEN) {
        config.headers.Authorization = TOKEN_TYPE + " " + AUTH_TOKEN;
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    }
  );

  // http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 400:
            $vm.$message.error("400 Bad Request");
            break;
          case 401:
            // 这里写清除token的代码
            // localStorage.removeItem("userToken");
            let userToken = JSON.parse(localStorage.getItem("userToken"));
            if (userToken) {
              fetch
                .fetch(
                  "/user/refresh?refreshToken=" + userToken.refresh_token,
                  "",
                  "get"
                )
                .then(data => {
                  if (data.code == 0) {
                    localStorage.setItem(
                      "userToken",
                      JSON.stringify(data.data)
                    );
                    accountApi.baseInfo().then(data => {
                      let userToken = JSON.parse(
                        localStorage.getItem("userToken")
                      );
                      userToken.userName = data.username;
                      localStorage.setItem(
                        "userToken",
                        JSON.stringify(userToken)
                      );
                    });
                  } else {
                    localStorage.removeItem("userToken");
                  }
                });
            } else {
              router.replace({
                path: "/login",
                query: {
                  redirect: router.currentRoute.fullPath
                } //登录成功后跳入浏览的当前页面
              });
            }
            break;
          case 404:
            $vm.$message.error("404");
            break;
          case 500:
            $vm.$message.error("服务器异常，请稍后再试");
            break;
        }
      }
      return Promise.reject(error.response.data);
    }
  );

  /**
   * 路由登录拦截
   */
  router.beforeEach((to, from, next) => {
    let userToken = JSON.parse(localStorage.getItem("userToken") || "{}");
    let AUTH_TOKEN = userToken.access_token;
    if (to.meta.requireAuth) {
      // 判断该路由是否需要登录权限
      if (AUTH_TOKEN) {
        next();
      } else {
        next({
          path: "/login",
          query: { redirect: to.fullPath } // 将跳转的路由path作为参数，登录成功后跳转到该路由
        });
      }
    } else {
      next();
    }

    //已登录不允许跳转登录注册页面
    if (AUTH_TOKEN) {
      if (
        from.fullPath == "/login" &&
        to.fullPath.indexOf("/modify/restSuccess") != -1
      ) {
        next({ path: "/personal/account" });
      } else if (
        to.fullPath.indexOf("/login") != -1 ||
        to.fullPath.indexOf("/register") != -1 ||
        to.fullPath.indexOf("/restLoginPsw") != -1
      ) {
        next({ path: "/home" });
      } else {
        next();
      }
    }
  });
};

router.afterEach((to, from, next) => {
  window.scrollTo(0, 0);
});

export default {
  axiosConfig
};
