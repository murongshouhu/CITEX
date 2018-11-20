<template>
    <div class="assets">
        <div class="fs-28 color-333 pb-20 assets-title mb-40">
            <p>资产管理12</p>
        </div>
        <div class="search pb-60">
            <div class="search-input">
                <div class="">
                    <input type="text" @keyup="searchCurrency" v-model="search">
                </div>
            </div>
            <div>
                <div class="checkbox check" :class="isHide?'check' :'uncheck'" @click="isHide = !isHide" ></div>
                <div>隐藏小额资产 （&lt; 0.001BTC）</div>
            </div>
            <div class="total-money ml-50">
                <span>总资产折合：</span><span class="color0b0c22">{{totalBtc}} BTC ≈ {{totalCny}} CNY</span>
            </div>
            <div class="finance-name fs-20">
              <router-link to="/assets/finance">财务记录</router-link>
            </div>
        </div>
        <div class="bblist shadow">
            <ul class="list-head">
                <li>币种</li>
                <li>可用余额</li>
                <li>冻结资产</li>
                <li>BTC估值</li>
                <li>操作</li>
            </ul>
            <ul class="list-info">
                <li v-for="(item,index) in currencyData" :key="index" v-show='currencyId ? (item.currencyId == currencyId?true :false) : true'>
                    <div>
                        <div>{{item.symbol}}</div>
                        <div>{{item.currencyId | filterBalance(balanceList,0)}}</div>
                        <div>{{item.currencyId | filterBalance(balanceList,1)}}</div>
                        <div>{{getBtcNumber(item.currencyId,index).about}}</div>
                        <div class="operation-btn">
                            <div class="rel" :class="item.show ? 'border-388' :'border-e7e'" @click="chargeMoney(item,index,getCurrencyName(item.currencyId).symbol,item.currencyId)">
                                <span>充币</span>
                                <span class="triangle abs" v-show="item.show"></span>
                            </div>
                            <div class="rel" :class="item.show1 ? 'border-388' :'border-e7e'" @click="withdrawMoney(item,index,getCurrencyName(item.currencyId).symbol,item.currencyId)">
                                <span>提币</span>
                                <span class="triangle abs" v-show="item.show1"></span>
                            </div>
                            <div class="rel" :class="item.show2 ? 'border-388' :'border-e7e'" @click="trade(item,index)">
                                <span>交易</span>
                                <span class="triangle abs" v-show="item.show2"></span>
                            </div>
                        </div>
                    </div>
                    <div class="rel">
                        <div v-if="item.show" class="transition-box">
                            <ChargeMoney v-bind:bbKey='bbKey'></ChargeMoney>
                        </div>
                        <div v-if="item.show1" class="transition-box">
                            <WithdrawMoney v-bind:withdrawParmar='withdrawParmar'></WithdrawMoney>
                        </div>
                        <div class="abs go-trade shadow" v-if="item.show2">
                          <Trade></Trade>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import ChargeMoney from "./chargeMoney";
import WithdrawMoney from "./withdrawMoney";
import Trade from "./trade";
import assetsApi from "../../api/assetsApi.js";
import axios from "../../utils/fetch.js";
import bigDecimal from "js-big-decimal";
let totalBtc = 0;
let totalCny = 0;
let count = 0;
export default {
  data() {
    return {
      isHide: false,
      //隐藏小额参数
      condition: 0,
      //搜索参数
      currencyId: "",
      search: "",
      type: "",
      bbKey: { name: "***", key: "" },
      withdrawParmar: {},
      balanceList: [],
      currencyData: [],
      currentUsPrice: [],
      exchangeList: [],
      totalBtc: 0,
      totalCny: 0,
      UsRateCny: 0
    };
  },
  watch: {
    //隐藏小额资产
    isHide() {
      if (this.isHide) {
        this.condition = 0.001;
      } else {
        this.condition = 0;
      }
    }
  },
  created() {
    // 获取货币列表
    this.currencyList();
  },
  methods: {
    //搜索功能
    searchCurrency() {
      let keywords = this.search.toUpperCase();
      let currencyId = "";
      this.currencyData.forEach(item => {
        if (item.symbol == keywords) {
          currencyId = item.currencyId;
        }
      });
      this.currencyId = currencyId;
    },
    //充币
    chargeMoney(item, index, name, id) {
      let that = this;
      this.currencyData.forEach(i => {
        // 判断如果数据中的headerData[i]的show属性不等于当前数据的show属性那么headerData[i]等于false
        if (i.show !== this.currencyData[index].show) {
          i.show = false;
        }
        if (i.show1 !== this.currencyData[index].show1) {
          i.show1 = false;
        }
        if (i.show2 !== this.currencyData[index].show2) {
          i.show2 = false;
        }
      });
      this.currencyData[index].show = !item.show;
      this.currencyData[index].show1 = false;
      this.currencyData[index].show2 = false;

      if (item.show) {
        this.bbKey.key = "";
        let parmars = {
          currencyId: id,
          opType: 1 //1充值，2提现
        };
        axios.fetch("/asset/wallet/queryAddr", parmars, "get").then(data => {
          if (data && data.code == 0) {
            this.bbKey = {
              name: name,
              key: data.data[0] ? data.data[0].address : ""
            };
          }
        });
      }
    },
    //提币
    withdrawMoney(item, index, name, id) {
      let that = this;
      this.currencyData.forEach(i => {
        if (i.show !== this.currencyData[index].show) {
          i.show = false;
        }
        if (i.show1 !== this.currencyData[index].show1) {
          i.show1 = false;
        }
        if (i.show2 !== this.currencyData[index].show2) {
          i.show2 = false;
        }
      });
      this.currencyData[index].show1 = !item.show1;
      this.currencyData[index].show = false;
      this.currencyData[index].show2 = false;
      if (item.show1) {
        that.withdrawParmar = that.getCurrencyName(id);
      }
    },
    //交易
    trade(item, index) {
      let that = this;
      this.currencyData.forEach(i => {
        if (i.show !== that.currencyData[index].show) {
          i.show = false;
        }
        if (i.show1 !== that.currencyData[index].show1) {
          i.show1 = false;
        }
        if (i.show2 !== that.currencyData[index].show2) {
          i.show2 = false;
        }
      });
      this.currencyData[index].show = false;
      this.currencyData[index].show1 = false;
      this.currencyData[index].show2 = !item.show2;
    },
    // 获取余额列表
    balance() {
      assetsApi.balance().then(data => {
        this.balanceList = data.data;
        // console.log("余额", this.balanceList);
      });
    },
    // 获取货币列表
    currencyList() {
      assetsApi.currencyList().then(data => {
        // console.log("货币列表", data);
        // 获取货币对应的当前美元价格
        data.result.forEach(item => {
          item.show = false;
          item.show1 = false;
          item.show2 = false;
        });
        this.currencyData = data.result;
        this.getCurrencyPrice();
      });
    },
    // 获取货币对应的当前美元价格
    getCurrencyPrice() {
      assetsApi.currencyPrice().then(data => {
        this.currentUsPrice = data.result;
        // console.log("美元价格", this.currentUsPrice);
        // 获取人民币币对应的美元汇率
        this.getExchangeList();
      });
    },
    // 获取人民币币对应的美元汇率
    getExchangeList() {
      assetsApi.exchangeList().then(data => {
        this.exchangeList = data.result;
        data.result.forEach(i => {
          if (i.name == "CNY") {
            this.UsRateCny = i.rate;
          }
        });

        // console.log(data);

        // 获取余额列表
        this.balance();
      });
    },
    //获取货币名称
    getCurrencyName(id) {
      let currencyData = "";
      this.currencyData.forEach(item => {
        if (item.currencyId == id) {
          currencyData = item;
        }
      });
      return currencyData;
    },

    // 获取货币转换成btc是多少
    getBtcNumber(id, index) {
      //余额
      let balance = 0;
      //1个币对应的美元价格
      let USPrice = 0;
      //BTC对应的美元价格
      let btcUsPrice = 0;

      this.balanceList.forEach(item => {
        if (item.currencyId == id) {
          balance = item.available - 0 + (item.locked - 0);
        }
      });

      this.currentUsPrice.forEach(item => {
        if (item.currencyId == id) {
          USPrice = item.latest || 0;
        } else if (item.currencyId == 2) {
          btcUsPrice = item.latest;
        }
      });
      //计算出拥有多少美元
      let hasUS = (balance - 0) * (USPrice - 0);

      //换算出拥有多少BTC
      let btcNumber = (hasUS / btcUsPrice).toFixed(8) - 0;

      let cnyNumber = (hasUS - 0 * this.UsRateCny).toFixed(2);

      let about = btcNumber + "≈" + cnyNumber + "CNY";

      let parmars = {
        index: index,
        btcNumber: btcNumber,
        cnyNumber: cnyNumber
      };
      let totalCount = localStorage.getItem("totalCount");
      if (totalCount) {
        let totalCountArr = JSON.parse(totalCount);
        let isAllowPush = true;
        totalCountArr.forEach(item => {
          if (item.index == parmars.index) {
            isAllowPush = false;
          }
        });
        if (isAllowPush) {
          totalCountArr.push(parmars);
        }
        localStorage.setItem("totalCount", JSON.stringify(totalCountArr));
      } else {
        let totalCountArr = [];
        totalCountArr.push(parmars);
        localStorage.setItem("totalCount", JSON.stringify(totalCountArr));
      }
      if (this.balanceList.length - 1 == index) {
        this.getCompromise();
      }
      // console.log(id);
      return { btcNumber, about };
    },
    getCompromise() {
      let that = this;
      let totalCount = localStorage.getItem("totalCount");

      let totalCountArr = JSON.parse(totalCount);
      if (totalCount) {
        totalCountArr.forEach(item => {
          count++;
          totalBtc = bigDecimal.add(totalBtc, item.btcNumber);
          totalCny = bigDecimal.add(totalCny, item.cnyNumber);
          // console.log(totalCny);
        });
      }
      if (count == totalCountArr.length) {
        that.totalBtc = totalBtc - 0;
        that.totalCny = totalCny - 0;
        localStorage.removeItem("totalCount");
      }
    }
  },
  components: {
    ChargeMoney,
    WithdrawMoney,
    Trade
  },
  filters: {
    //过滤剩余余额
    filterBalance(id, data, type) {
      //id币种id, data余额数据,type:0     available可用余额
      // 1  locked冻结
      let obj = {};
      data.forEach(item => {
        if (id == item.currencyId) {
          obj = item;
        }
      });
      let num = 0;
      if (JSON.stringify(obj) != "{}") {
        if (type == 0) {
          num = obj.available;
        } else {
          num = obj.locked;
        }
      } else {
      }
      return num.toFixed(6);
    }
  }
};
</script>

<style>
.shadow {
  -moz-box-shadow: 0 6px 5px #e8f1fb;
  box-shadow: 0 6px 5px #e8f1fb;
}
.assets {
  width: 100%;
  background: #f3f6f9;
  padding: 60px 100px 0;
  overflow: hidden;
}
.assets-title {
  border-bottom: 1px solid #d6e1f0;
}
.search {
  line-height: 36px;
}
.search .finance-name {
  float: right;
}
.search .finance-name a {
  color: #388cff;
}
.search .search-input {
  width: 190px;
  margin-right: 34px;
}
.search div {
  display: inline-block;
  font-size: 16px;
  color: #6a6a6a;
}
.search .search-input {
  border: 1px solid #dce0e9;
  background: #fff;
  padding-left: 10px;
}
.search .search-input input {
  background: url("../../assets/user/search.png") no-repeat left center;
  padding-left: 20px;
}
.checkbox {
  width: 22px;
  height: 40px;
  vertical-align: middle;
  margin-right: 14px;
}
.checkbox.check {
  background: url("../../assets/icon/check.png") no-repeat left center;
}
.checkbox.uncheck {
  background: url("../../assets/icon/uncheck.png") no-repeat left center;
}
.total-money .color0b0c22 {
  color: #0b0c22;
}
.bblist {
  width: 100%;
  background: #fff;
  margin-bottom: 100px;
  border-radius: 8px;
}
.list-head {
  display: flex;
  padding: 0 28px;
}
.list-head li {
  flex: 1;
  text-align: center;
  padding: 40px 0 16px;
  font-size: 18px;
  color: #464a53;
  border-bottom: 1px solid #d6e1f0;
}
.list-info > li > div:first-child {
  padding: 18px 0;
  margin: 0 28px;
  display: flex;
  border-bottom: 1px solid #e6edf6;
}
.list-info > li > div:first-child > div {
  flex: 1;
  text-align: center;
  font-size: 16px;
  color: #333;
  line-height: 34px;
}
.operation-btn {
  justify-content: center;
}
.operation-btn > div {
  padding: 6px 10px;
  display: inline-block;
  line-height: normal;
  border: 1px solid #e7e8ef;
}
.assets .transition-box {
  margin-bottom: 10px;
  width: 100%;
  background-color: #f6faff;
  color: #fff;
  padding: 50px 0 40px;
  box-sizing: border-box;
  margin-top: -2px;
}
.assets .border-388 {
  border-color: #388cff;
  color: #388cff;
}
.assets .border-e7e {
  border-color: #e7e8ef;
}
.triangle {
  display: inline-block;
  width: 22px;
  height: 10px;
  border: 10px solid transparent;
  border-bottom: 10px solid #f6faff;
  box-sizing: border-box;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
}
.track {
  left: 40px;
  bottom: 0;
}
.charge-record {
  color: #388cff;
}
</style>
