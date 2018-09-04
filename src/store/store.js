import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import tradeApi from "../api/tradeApi";
const store = new Vuex.Store({
  // 定义状态
  state: {
    isLogin: JSON.parse(localStorage.getItem("userToken") || "{}").userToken
      ? true
      : false
    // accountCurrencyList: [],//计价货币
  },
  mutations: {
    // accountCurrencyList(state, data) {
    //     state.accountCurrencyList = data;
    // }
  },
  actions: {
    // // 获取计价货币
    // getQueryAccountCurrency(context) {
    //     tradeApi.getQueryAccountCurrency().then(data => {
    //         context.commit("accountCurrencyList", data.result);
    //     });
    // },
  }
});

export default store;
