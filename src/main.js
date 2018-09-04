// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "babel-polyfill"; //解决ie浏览器不支持promise
import Vuex from "vuex";
import store from "./store/store";
import axios from "axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en";
import i18n from "../static/lang/lang.config";
import "./base/base.css";
import uweb from "vue-uweb";
import VueClipboard from "vue-clipboard2";
import axiosConfig from "./utils/axios.config";
// socket
import VueSocketio from "vue-socket.io";
import md5 from "js-md5";

Vue.prototype.$md5 = md5;

Vue.prototype.axios = axios;

Vue.use(ElementUI, { locale });

Vue.use(Vuex);

Vue.use(uweb, { siteId: "1274330811" });

Vue.use(VueClipboard);
Vue.config.productionTip = false;

axiosConfig.axiosConfig();

Vue.use(VueSocketio, "http://47.52.234.104:8081");

// 组件之间通信
let transmit = new Vue();
Vue.prototype.transmit = transmit;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  i18n,
  store,
  components: { App },
  template: "<App/>"
});
