<template>
    <div class="trade-center">
        <!-- trade nav -->
        <div class="trade-head fs-20 rel">
            <div class="mr-46 trading-on-name" @click="isShow = !isShow">
              <div>市场{{marketName | filterName}} <span class="triangle-box" :class="isShow?'rote-animation1':''"><span class="trad-triangle"></span></span></div>
            </div>
            <div class="trading-on-name-right">
                <span class="mr-20">{{marketName | filterName}}</span>
                <span class="mr-20">{{(queryIndicator.priceLow-0).toFixed(4) || '0.0000'}}</span>
                <span class="mr-20 fs-22">{{(queryIndicator.priceHigh-0).toFixed(4) || '0.0000'}}</span>
                <span class="fs-22">涨幅</span>
                <span class="mr-20 fs-18"> {{(queryIndicator.priceChangeRadio*100).toFixed(3) || '0.000'}}%</span>
                <span>24H量</span>
                <span class="fs-18"> {{(queryIndicator.totalVolume-0).toFixed(4) || '0.0000'}}{{marketName|filterTradeName}}</span>
            </div>
            <div class="trading-on" v-show='isShow' :class="isShow?'show-animation':''">
              <div class="trading-title">
                  <div class="mt-24 ml-40 mr-40 mb-16">
                      <input class="searcth-trade fs-18" type="text" @keyup="retrieval" v-model="tradingValue" placeholder="搜索交易对">
                  </div>
                  <div class="trading-tab fs-18 mb-20">
                      <ul>
                          <li v-for="(item,index) in accountCurrencyList" @click="switchCurrency(index,item.currencyId)" :key="index"><div :class="tabIndex == index?'active':''">{{item.symbol}}</div></li>
                          <li><div :class="tabIndex == 'my'?'active':''" @click="switchCurrency('my','my')">自选</div></li>
                      </ul>
                  </div>
              </div>
              <div class="trading-body">
                  <div class="trading-body-title fs-14 color-999 mb-16">
                      <ul>
                          <li>币种</li>
                          <li>最新价</li>
                          <li>涨幅跌</li>
                      </ul>
                  </div>
                  <div class="trading-list fs-16 color-333">
                    <ul v-for="(item,index) in filtersList" :key="index" @click="choseGoods(item)" v-show="(tabIndex == 'my'&& queryFavoriteList.indexOf(item.contractId) != -1) && showData.indexOf(item.contractId) !=-1 || showData.indexOf(item.contractId) !=-1">
                        <li class="select">
                          <div @click.stop="addOrDele(item.contractId,queryFavoriteList.indexOf(item.contractId) != -1)" :class="queryFavoriteList.indexOf(item.contractId) != -1? 'selected':''"></div>
                          <div>{{item.symbol | filterName}}</div>
                        </li>
                        <li>{{ getPrice(item.contractId)}}</li>
                        <li :class="getPercentage(item.contractId).flag == -1 ? 'red' : getPercentage(item.contractId).flag == 0 ?'' :'green'">{{ getPercentage(item.contractId).percentage}}</li>
                    </ul>
                  </div>
              </div>
            </div>
        </div>
        <!-- trade end -->

        <!-- show trade -->
        <div class="trade-body">
            <div class="rel">
              <div class="left-content">
                  <!-- tradingview -->
                  <Tradingview v-bind:tradeItem='tradeItem'></Tradingview>
                  <!-- entrustment -->
                  <Entrustment v-bind:tradeItem='tradeItem'></Entrustment>
              </div>
              <div class="right-content abs">
                  <!-- Trading file -->
                  <TradingFile v-bind:tradeItem='tradeItem'></TradingFile>
                  <!-- business -->
                  <Business v-bind:tradeItem='tradeItem'></Business>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
// 组件引入
import Entrustment from "./entrustment"; // 委托记录
import Tradingview from "./tradingview"; //折线图
import TradingFile from "./tradingFile"; // 十档交易
import Business from "./business"; // 币币交易
import tradeApi from "../../api/tradeApi.js";
import assetsApi from "../../api/assetsApi.js";
import bigDecimal from "js-big-decimal";
let upOrDown = [];
export default {
  data() {
    return {
      // 市场名字
      marketName: "",
      isShow: false,
      // 市场交易对数据
      queryIndicator: {},
      // 搜索
      tradingValue: "",
      showData: [],
      tabIndex: 0,
      currencyId: "",
      contractId: "", //交易对id
      accountCurrencyList: [], //计价货币
      currencyListData: [], //货币ID和货币名称对应表
      queryFavoriteList: [], //自选列表
      queryContractList: [], //交易对
      queryIndicatorList: [], //交易对行情
      filtersList: [], //筛选结果
      upOrDown: upOrDown,
      tradeItem: {}
    };
  },
  mounted() {
    // this.getQueryContract();
    this.getCurrencyList();
    this.getQueryFavoriteList();
  },
  methods: {
    //搜索交易对
    retrieval() {
      let keywords = this.tradingValue.toUpperCase();
      let datas = this.filtersList;
      let arr = [];
      datas.forEach(item => {
        let symbolArr = item.symbol.split("-");
        if (symbolArr[0].indexOf(keywords) != -1) {
          arr.push(item.contractId);
        }
      });
      this.showData = arr;
    },
    //交易对table栏切换
    switchCurrency(index, id) {
      this.filtersList = [];
      this.tabIndex = index;
      //自选处理
      if (id == "my") {
        this.updatedData();
      }
      this.filterMoney(id);
      this.marketName = this.filtersList[0].symbol;
      this.getSingleData(this.filtersList[0].contractId);
      this.tradeItem = this.filtersList[0];
    },
    // 更新自选
    updatedData() {
      let list = [];
      this.queryFavoriteList.forEach(item => {
        this.queryContractList.forEach(it => {
          if (item == it.contractId) {
            list.push(it);
            this.showData.push(it.contractId);
          }
        });
      });
      this.filtersList = list;
    },
    // 添加删除自选
    addOrDele(id, boolean) {
      console.log(id, boolean);
      let parmars = {
        contractId: id
      };
      if (boolean) {
        tradeApi.deleteFavorite(parmars).then(data => {
          this.getQueryFavoriteList();
        });
      } else {
        tradeApi.addFavorite(parmars).then(data => {
          this.getQueryFavoriteList();
        });
      }
    },
    // 获取自选列表
    getQueryFavoriteList() {
      tradeApi.getQueryFavoriteList().then(data => {
        this.queryFavoriteList = data.data;
      });
    },
    //货币id对应的货币名称
    getCurrencyList() {
      assetsApi.currencyList().then(data => {
        this.currencyListData = data.result;
        this.getQueryAccountCurrency();
      });
    },
    // 获取计价货币
    getQueryAccountCurrency() {
      tradeApi.getQueryAccountCurrency().then(data => {
        let datas = data.result;
        datas.forEach(item => {
          this.currencyListData.forEach(it => {
            if (item.currencyId == it.currencyId) {
              item.symbol = it.symbol;
            }
          });
        });
        this.accountCurrencyList = datas;
        this.getQueryContract();
      });
    },
    // 获取交易对
    getQueryContract() {
      tradeApi.getQueryContract().then(data => {
        this.queryContractList = data.result;
        this.getQueryIndicatorList();
      });
    },
    //获取所有交易对行情
    getQueryIndicatorList() {
      tradeApi.getQueryIndicatorList().then(data => {
        this.queryIndicatorList = data;
        if (this.accountCurrencyList != []) {
          // 初始化的显示数据
          this.filterMoney(this.accountCurrencyList[0].currencyId);
        }
      });
    },
    //获取过滤后的数据
    filterMoney(id) {
      if (id == "my") {
        return;
      } else {
        this.queryContractList.forEach(item => {
          if (id == item.currencyId) {
            item.isActive = false;
            this.filtersList.push(item);
            this.showData.push(item.contractId);
          }
        });
        this.marketName = this.filtersList[0].symbol;
        this.getSingleData(this.filtersList[0].contractId);
        this.tradeItem = this.filtersList[0];
      }
    },
    //获取交易对详细价格
    getPrice(id) {
      let price = 0;
      for (let i = 0; i < this.queryIndicatorList.length; i++) {
        const element = this.queryIndicatorList[i];
        if (element.contractId == id) {
          price = element.lastPrice;
          break;
        }
      }
      return (price - 0).toFixed(8);
    },
    // 涨跌幅
    getPercentage(id) {
      let percentage = 0;
      for (let i = 0; i < this.queryIndicatorList.length; i++) {
        const element = this.queryIndicatorList[i];
        if (element.contractId == id) {
          percentage = element.priceChangeRadio;
          break;
        }
      }
      let perNum = (percentage - 0).toFixed(2);
      let flag = 0;
      perNum > 0 ? (flag = 1) : perNum == 0 ? (flag = 0) : (flag = -1);
      percentage > 0 ? (percentage = "+" + perNum) : (percentage = perNum);
      return { percentage: percentage, flag: flag };
    },
    // 获取交易对单个具体信息
    getSingleData(id) {
      this.queryIndicatorList.forEach(item => {
        if (id == item.contractId) {
          this.queryIndicator = item;
        }
      });
    },
    choseGoods(item) {
      this.getSingleData(item.contractId);
      this.marketName = item.symbol;
      this.tradeItem = item;
    }
  },
  filters: {
    // 转化交易对名称
    filterName(bbName) {
      if (!bbName) {
        return;
      }
      return bbName.replace("-", "/");
    },
    filterTradeName(name) {
      let list = name.split("-");
      return list[1];
    }
  },
  components: {
    Entrustment,
    Tradingview,
    TradingFile,
    Business
  }
};
</script>

<style lang="scss">
$fff: #fff;
@keyframes show {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes hide {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes rota1 {
  0% {
    transform: rotateZ(0);
  }
  100% {
    transform: rotateZ(180deg);
  }
}
@keyframes rota2 {
  0% {
    transform: rotateZ(180deg);
  }
  100% {
    transform: rotateZ(0);
  }
}

.trade-center {
  background: #edeeef;
  .trade-head {
    height: 70px;
    padding: 21px 28px;
    background: $fff;
    margin-bottom: 8px;
    > div {
      display: inline-block;
    }
    .trading-on-name {
      width: 150px;
      vertical-align: text-top;
      .triangle-box {
        display: inline-block;
        width: 10px;
        height: 5px;
        position: relative;
        margin-bottom: 4px;
      }
      .trad-triangle {
        position: absolute;
        bottom: 0;
        left: 0;
        display: inline-block;
        width: 6px;
        height: 6px;
        border: 6px solid transparent;
        border-bottom: 6px solid #388cff;
        box-sizing: border-box;
        vertical-align: text-top;
      }
    }
    .show-animation {
      animation: show 0.3s linear forwards;
    }
    .rote-animation1 {
      animation: rota1 0.3s linear forwards;
    }
    .rote-animation2 {
      animation: rota2 0.3s linear forwards;
    }
    .trading-on {
      position: absolute;
      left: 0;
      top: 72px;
      z-index: 9;
      width: 462px;
      height: 600px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0px 0 0 #fff, 0 0 0 #fff, 0 2px 6px #e9e9e9;
      .searcth-trade {
        border: 1px solid #d5dfe9;
        width: 100%;
        height: 38px;
        line-height: 38px;
        padding-left: 36px;
        color: #333;
        background: url("../../assets/user/search.png") no-repeat left 16px
          center;
      }
      .trading-tab ul {
        box-shadow: 0px -4px 0 #fff, 0 0 0 #fff, 0 2px 6px #e9e9e9;
        display: flex;
        li {
          flex: 1;
          text-align: center;
          div {
            display: inline-block;
            padding: 10px 0;
          }
          .active {
            color: #388cff;
            border-bottom: 2px solid #388cff;
          }
        }
      }
      .trading-body {
        ul {
          padding: 0 42px;
          display: flex;
          li {
            flex: 2;
          }
          li:first-child {
            flex: 3;
          }
          li:last-child {
            flex: 1;
          }
        }
        .trading-list {
          height: 424px;
          overflow-y: auto;
          ul {
            width: 100%;
            line-height: 40px;
            .green {
              color: #3c8c5f;
            }
            .red {
              color: #d84f4f;
            }
            .select {
              > div {
                display: inline-block;
              }
              > div:first-child {
                width: 20px;
                height: 20px;
                background: url("../../assets/trade/unselect.png") no-repeat
                  center;
                background-size: 20px 20px;
                vertical-align: text-bottom;
              }
              .selected {
                background: url("../../assets/trade/select.png") no-repeat
                  center !important;
                background-size: 20px 20px !important;
                vertical-align: text-bottom !important;
              }
            }
          }
          ul:hover {
            background: #f2f2f2;
          }
        }
      }
    }
  }
  .trade-body {
    min-height: 920px;
    padding: 0 8px 24px;
    .left-content {
      padding-right: 620px;
    }
    .right-content {
      top: 0;
      right: 0;
      width: 620px;
      overflow: hidden;
    }
  }
}
</style>
