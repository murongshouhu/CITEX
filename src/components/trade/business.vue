<template>
    <div class="business rel">
      <!-- login or register mask start-->
        <div class="abs mask" v-if="!isLogin">
          <div class="abs fs-18">
            <span>
              <router-link to="/login">登录</router-link>
            </span>
            <span>或</span>
            <span>
              <router-link to="/register">注册</router-link>
            </span>
            <span>后查看</span>
          </div>
        </div>
        <!-- login or register mask end-->
        <div class="business-title lh-44 fs-16">
            <div class="fl" @click="checkBuyMode('0')" :class="!marketPrice?'active':''">限价</div>
            <div class="fl" @click="checkBuyMode('1')" :class="marketPrice?'active':''">市价</div>
        </div>
        <div class="mt-24 busy-content">
            <div class="busy-content-left">
                <div class="fs-14 color-999 mb-22">
                    <span>余额:</span>
                    <span class="amount">{{buyPropertyData.available || 0.00}}</span>
                    <span>{{tradeItem.symbol|buyFiltersName}}</span>
                    <span class="fr recharge">充值</span>
                </div>
                <div class="input-item">
                    <span class="mr-22">买价</span>
                    <input type="text" @keyup="totalValue(1)" v-model="buyPrice" :disabled='marketPrice'>
                    <span class="fr valuation">≈{{buyMoney}}</span>
                </div>
                <div class="input-item mt-22 mb-30">
                    <span class="mr-22">数量</span>
                    <input @keyup="totalValue(1)" type="text" v-model="buyNumber">
                    <span class="fr valuation">{{tradeItem.symbol|buyFiltersName}}</span>
                </div>
                <div class="step rel mb-40">
                    <div class="abs end-tooltip"></div>
                    <el-slider
                    v-model="ratioBuy"
                    :step="25"
                    :disabled='buyDisabled'
                    show-stops>
                    </el-slider>
                    <div class="fl color-999">0%</div>
                    <div class="fr color-999">100%</div>
                </div>
                <div class="fs-14 color-999 mb-20">
                    <span>累计{{buyTotalValue}}{{tradeItem.symbol|buyFiltersName}}</span>
                </div>
                <div class="btn mb-22" :class="SellBtnDisabled ? 'disable' :'buy-undisable'">
                    <input @click="placeOrder(1)" type="button" class="fs-16" :disabled="BuyBtnDisabled" :class="BuyBtnDisabled?'disable':'buy-undisable'" v-model="buyBtnValue">
                </div>
            </div>
            <div class="busy-content-right">
                <div class="fs-14 color-999 mb-22">
                    <span>余额:</span>
                    <span class="amount">{{sellPropertyData.available || 0.00}}</span>
                    <span>{{tradeItem.symbol|sellFiltersName}}</span>
                    <span class="fr recharge">充值</span>
                </div>
                <div class="input-item">
                    <span class="mr-22">卖价</span>
                    <input @keyup="totalValue(-1)" type="text" v-model="sellPrice" :disabled='marketPrice'>
                    <span class="fr valuation">≈{{sellMoney}}</span>
                </div>
                <div class="input-item mt-22 mb-30">
                    <span class="mr-22">数量</span>
                    <input @keyup="totalValue(-1)" type="text" v-model="sellNumber">
                    <span class="fr valuation">{{tradeItem.symbol|sellFiltersName}}</span>
                </div>
                <div class="step rel mb-40">
                    <div class="abs end-tooltip"></div>
                    <el-slider
                    v-model="ratioSell"
                    :step="25"
                    :disabled='sellDisabled'
                    show-stops>
                    </el-slider>
                    <div class="fl color-999">0%</div>
                    <div class="fr color-999">100%</div>
                </div>
                <div class="fs-14 color-999 mb-22">
                    <span>累计{{sellTotalValue}}{{tradeItem.symbol|sellFiltersName}}</span>
                </div>
                <div class="btn sell-btn mb-20" :class="SellBtnDisabled ? 'disable' :'sell-undisable'">
                    <input @click="placeOrder(-1)" type="button" class="fs-16" :disabled="SellBtnDisabled" :class="SellBtnDisabled?'disable':'sell-undisable'" v-model="sellBtnValue">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import tradeApi from "../../api/tradeApi.js";
import axios from "../../utils/fetch.js";
import bigDecimal from "js-big-decimal";
export default {
  data() {
    return {
      isLogin: false,
      // 市价现价
      marketPrice: false,
      buyMoney: "100",
      sellMoney: "100",
      buyPrice: "",
      buyNumber: "",
      buyTotalValue: 0.0,
      sellPrice: "",
      sellNumber: "",
      sellTotalValue: 0.0,
      ratioBuy: 0,
      ratioSell: 0,
      buyDisabled: false,
      sellDisabled: false,
      buyBtnValue: "买入BTC",
      sellBtnValue: "卖出BTC",
      BuyBtnDisabled: true,
      SellBtnDisabled: true,
      buyPropertyData: {}, //买入   剩余余额
      sellPropertyData: {} //卖出    剩余余额
    };
  },
  watch: {
    ratioBuy(value) {
      if (this.buyPropertyData.available) {
        this.buyNumber = bigDecimal.divide(
          bigDecimal.multiply(value, 100),
          this.buyPropertyData.available || 0
        );
      } else {
        this.buyNumber = 0;
      }
      if (
        this.buyPrice &&
        this.buyPrice != 0 &&
        this.buyNumber &&
        this.buyNumber != 0
      ) {
        this.BuyBtnDisabled = false;
      } else {
        this.BuyBtnDisabled = true;
      }
    },
    ratioSell(value) {
      if (this.sellPropertyData.available) {
        this.sellNumber = bigDecimal.divide(
          bigDecimal.multiply(value, 100),
          this.sellPropertyData.available || 0
        );
      } else {
        this.sellNumber = 0;
      }
      if (
        this.sellPrice &&
        this.sellPrice != 0 &&
        this.sellNumber &&
        this.sellNumber != 0
      ) {
        this.SellBtnDisabled = false;
      } else {
        this.SellBtnDisabled = true;
      }
    }
  },
  mounted() {
    this.getLoginInfo();
  },
  methods: {
    getLoginInfo() {
      let that = this;
      let token = localStorage.getItem("userToken");
      if (token) {
        this.isLogin = true;
        let timer = setInterval(() => {
          if (JSON.stringify(that.tradeItem) != "{}") {
            this.getQueryAccBalance();
            clearInterval(timer);
          }
        }, 300);
      } else {
        this.isLogin = false;
      }
    },
    checkBuyMode(parmar) {
      if (parmar == "0") {
        this.marketPrice = false;
      } else {
        this.marketPrice = true;
      }
      this.buyPrice = "";
      this.sellPrice = "";
    },
    // 查询用户可用资金
    getQueryAccBalance() {
      tradeApi.getQueryAccBalance().then(data => {
        this.filtersData(data.result || []);
      });
    },
    filtersData(data) {
      for (let i = 0; i < data.length; i++) {
        if (this.tradeItem.currencyId == data[i].currencyId) {
          this.buyPropertyData = data[i];
          if (data[i].available == 0) {
            this.buyDisabled = true;
          } else {
            this.buyDisabled = false;
          }
        }
        if (this.tradeItem.commodityId == data[i].currencyId) {
          this.sellPropertyData = data[i];
          if (data[i].available == 0) {
            this.sellDisabled = true;
          } else {
            this.sellDisabled = false;
          }
        }
      }
    },
    // 下单
    placeOrder(side) {
      let price = 0;
      let quantity = "";
      let orderType = this.marketPrice ? "3" : "1";
      if (side == 1) {
        price = this.buyPrice;
        quantity = this.buyNumber;
      } else {
        price = this.sellPrice;
        quantity = this.sellNumber;
      }
      // 买卖校验

      if (
        (!price || price == 0 || price < this.tradeItem.priceTick) &&
        !this.marketPrice
      ) {
        this.$message.error("请确认价格");
        return;
      }
      if (!quantity || quantity == 0 || quantity < this.tradeItem.lotSize) {
        this.$message.error("请确认数量");
        return;
      }
      // 、、参数
      let parmars = {
        contractId: this.tradeItem.contractId,
        side: side, //buy 1,sell-1
        price: price,
        quantity: quantity,
        orderType: orderType, //委托类型，LIMIT(1, "限价"), STOP_LIMIT(2, "限价止损/止赢"), MARKET(3, "市价单"), STOP_MARKET(4, "市价止损/止赢")
        timeInForce: "2" //GTC(1, ""), IOC(2, "立即成交剩余撤销")，默认传2
      };
      axios.fetch("/order/place", parmars, "post").then(data => {
        if (data.code == 0) {
          this.$message({
            message: "下单成功",
            type: "success"
          });
          this.getQueryAccBalance();
          if (side == 1) {
            this.buyPrice = "";
            this.buyNumber = "";
            this.BuyBtnDisabled = true;
          } else {
            this.sellPrice = "";
            this.sellNumber = "";
            this.SellBtnDisabled = true;
          }
        } else {
          this.$message.error("下单失败");
        }
      });
    },
    // 校验数量和价格是否符合要求
    totalValue(type) {
      // type 1买  -1卖
      if (type == 1) {
        if (
          this.buyPrice != 0 &&
          this.buyPrice != "" &&
          this.buyNumber != "" &&
          this.buyNumber != 0
        ) {
          this.BuyBtnDisabled = false;
        } else {
          this.BuyBtnDisabled = true;
        }
        this.buyTotalValue =
          (this.buyPrice - 0 || 0) + (this.buyNumber - 0 || 0);
      } else {
        if (
          this.sellPrice != 0 &&
          this.sellPrice != "" &&
          this.sellNumber != "" &&
          this.sellNumber != 0
        ) {
          this.SellBtnDisabled = false;
        } else {
          this.SellBtnDisabled = true;
        }
        this.sellTotalValue =
          (this.sellPrice - 0 || 0) + (this.sellNumber - 0 || 0);
      }
    }
  },
  filters: {
    buyFiltersName(name) {
      if (name) {
        return name.split("-")[1];
      } else {
        return "";
      }
    },
    sellFiltersName(name) {
      if (name) {
        return name.split("-")[0];
      } else {
        return "";
      }
    }
  },
  props: ["tradeItem"]
};
</script>

<style lang="scss">
.business {
  height: 100%;
  margin-left: 8px;
  margin-top: 8px;
  background: #fff;
  .mask {
    width: 100%;
    height: 100%;
    background: RGBA(0, 0, 0, 0.15);
    z-index: 9999;
    > div {
      width: 220px;
      padding: 18px 30px;
      background: #fff;
      border-radius: 4px;
      top: 22%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      a {
        color: #388cff;
      }
    }
  }
  .business-title {
    padding: 0 20px;
    height: 44px;
    box-shadow: 0px 0 0 #fff, 0 0 0 #fff, 0 2px 20px #e9e9e9;
    div:first-child {
      margin-right: 56px;
    }
    .active {
      color: #388cff;
      border-bottom: 2px solid #388cff;
    }
  }
  .busy-content {
    display: flex;
    padding: 0 20px;
    > div {
      flex: 1;
    }
    > div:first-child {
      padding-right: 25px;
    }
    > div:last-child {
      padding-left: 25px;
    }
    .recharge {
      color: #388cff;
    }
    .amount {
      margin-left: 4px;
      margin-right: 8px;
    }
    .input-item {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      font-size: 14px;
      border: 1px solid #d5dfe9;
      border-radius: 2px;
      input {
        max-width: 108px;
      }
      .valuation {
        color: #d5dfe9;
      }
    }
    .step {
      .el-slider__button {
        background: #388cff;
        border: 2px solid #d5dfe9;
      }
      .el-slider__stop {
        width: 10px;
        height: 10px;
        border: 1px solid #d5dfe9;
        margin-top: -2px;
      }
      .el-slider__runway {
        margin: 0 0 7px;
        background-color: #d5dfe9;
      }
      .end-tooltip {
        top: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #fff;
        border: 1px solid #d5dfe9;
        margin-top: -2px;
        z-index: 9;
      }
    }
    .btn {
      height: 40px;
      line-height: 40px;
      input {
        color: #fff;
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    .buy-undisable {
      background: #48bd67;
    }
    .sell-undisable {
      background: #d84f4f;
    }
    .disable {
      background: #b5bec6;
    }
    .el-slider__button-wrapper :focus {
      border: 0 none !important;
    }
  }
}
</style>
