<template>
    <div class="trading-file right">
<!-- 买卖档显示 -->
        <div class="left-file">
            <div class="file-style left-file-style mb-20">
                <div :class="index == 0 ? 'buy-sell-01':'buy-sell-01-0'" @click="switchGear(0)"></div>
                <div :class="index == 1 ? 'buy-sell-02-0':'buy-sell-02'" @click="switchGear(1)"></div>
                <div :class="index == 2 ? 'buy-sell-03-0':'buy-sell-03'" @click="switchGear(2)"></div>
            </div>
            <div class="buy-file">
                <div class="file-title color-999 fs-14">
                    <ul>
                        <li></li>
                        <li>价格（{{tradeItem.symbol | currencyName}}）</li>
                        <li>数量（{{tradeItem.symbol | currencyNumber}}）</li>
                    </ul>
                </div>
                <div class="file-body fs-14 color-333">
                  <!-- 买卖十档 -->
                    <div v-show="index == 0">
                      <div class="sell-bb">
                        <ul v-for='(item,index) in asksList' :key="index">
                            <li class="sell">卖出{{asksList.length-index}}</li>
                            <li>{{(item.price-0).toFixed(6)}}</li>
                            <li>{{(item.quantity-0).toFixed(3)}}</li>
                        </ul>
                        <ul v-for='(item,index) in 6' :key="index+10">
                            <li :class="'sell'">---</li>
                            <li>---</li>
                            <li>---</li>
                        </ul>
                      </div>
                      <div class="buy-bb">
                        <ul v-for='(item,index) in bidsList' :key="index">
                            <li class="buy">买入{{index+1}}</li>
                            <li>{{(item.price-0).toFixed(6)}}</li>
                            <li>{{(item.quantity-0).toFixed(3)}}</li>
                        </ul>
                        <ul v-for='(item,index) in 6' :key="index+10">
                            <li :class="'buy'">---</li>
                            <li>---</li>
                            <li>---</li>
                        </ul>
                      </div>
                    </div>
                    <!-- 卖出 -->
                    <div class="full-sell" v-show="index == 1">
                      <div class="sell-bb">
                        <ul v-for='(item,index) in asksFullList' :key="index">
                            <li class="sell">卖出{{index+1}}</li>
                            <li>{{(item.price-0).toFixed(6)}}</li>
                            <li>{{(item.quantity-0).toFixed(3)}}</li>
                        </ul>
                        <ul v-for='(item,index) in 12' :key="index+12">
                          <li class="sell">---</li>
                          <li>---</li>
                          <li>---</li>
                      </ul>
                      </div>
                    </div>
                    <!-- 买入 -->
                    <div class="full-buy" v-show="index == 2">
                      <div class="buy-bb">
                        <ul v-for='(item,index) in bidsFullList' :key="index">
                            <li class="buy">买入{{index+1}}</li>
                            <li>{{(item.price-0).toFixed(6)}}</li>
                            <li>{{(item.quantity-0).toFixed(3)}}</li>
                        </ul>
                        <ul v-for='(item,index) in 12' :key="index+12">
                            <li class="buy">---</li>
                            <li>---</li>
                            <li>---</li>
                        </ul>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-file">
            <div class="file-style mb-20 pl-20 pr-20">
                <div class="latest-deal left lh-44 fs-16 fl">最新成交</div>
            </div>
            <div>
                <div class="file-title color-999 fs-14">
                    <ul>
                        <li>时间</li>
                        <li>价格（{{tradeItem.symbol | currencyName}}）</li>
                        <li>数量（{{tradeItem.symbol | currencyNumber}}）</li>
                    </ul>
                </div>
                <div class="file-body fs-14 color-333">
                    <ul v-for='(item,index) in queryTickTradeList' :key="index">
                        <li :class="item[3] == 1 ?'buy' :'sell'">{{item[0]|timeDivisionSecond}}</li>
                        <li>{{item[1]}}</li>
                        <li>{{item[2]}}</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import formatTime from "../../utils/formatTime.js";
export default {
  data() {
    return {
      index: 0,
      queryTickTradeList: [],
      asksList: [],
      bidsList: [],
      asksFullList: [],
      bidsFullList: []
    };
  },
  watch: {
    tradeItem(newValue) {
      this.$socket.emit("addQuery", {
        depth: "6",
        symbol: newValue.contractId,
        num: 12
      });
    }
  },
  sockets: {
    connect() {
      const that = this;
      console.log("socket连接成功...");
      //定时查询参数是否存在，存在再向后台发送参数，否则一直查询，直到查到为止
      let timer = setInterval(() => {
        if (JSON.stringify(that.tradeItem) != "{}") {
          clearInterval(timer);
          that.$socket.emit("addQuery", {
            //深度
            // depth:'6',
            //交易对ID
            symbol: that.tradeItem.contractId,
            //默认条数
            num: 12
          });
        }
      }, 300);
    },
    // 订阅queryTickTradeList获取服务端返回的数据
    queryTickTradeList(data) {
      this.queryTickTradeList = data.trades;
      // console.log(data)
    },
    //订阅querySnapshot获取买卖十档的交易数据
    querySnapshot(data) {
      let asks = data.result.asks || [];
      this.asksFullList = asks.reverse();
      let bids = data.result.bids || [];
      this.bidsFullList = bids.reverse();

      //买卖深度交易渲染
      asks.length > 6
        ? (this.asksList = asks.slice(asks.length - 6))
        : (this.asksList = asks);
      this.bidsList = bids;
      // console.log(data)
    }
  },
  methods: {
    switchGear(index) {
      this.index = index;
    }
  },
  mounted() {
    // this.$socket.emit('connect');
  },
  filters: {
    timeDivisionSecond(time) {
      return formatTime.timeDivisionSecond(time);
    },
    currencyName(name) {
      if (name) {
        return name.split("-")[1];
      } else {
        return "";
      }
    },
    currencyNumber(name) {
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
.trading-file {
  display: flex;
  min-height: 512px;
  margin-left: 8px;
  > div {
    flex: 1;
    background: #fff;
    .file-style {
      height: 44px;
      box-shadow: 0px 0 0 #fff, 0 0 0 #fff, 0 2px 20px #e9e9e9;
    }
  }
  .left-file {
    margin-right: 4px;
    .left-file-style {
      padding: 10px 22px;
      display: flex;
      justify-content: space-between;
      > div {
        width: 24px;
        height: 24px;
        display: inline-block;
        background-size: 24px 24px !important;
      }
      .buy-sell-01 {
        background: url("../../assets/trade/buy_sell_icon_001.png");
      }
      .buy-sell-01-0 {
        background: url("../../assets/trade/buy_sell_icon_006.png");
      }
      .buy-sell-02 {
        background: url("../../assets/trade/buy_sell_icon_002.png");
      }
      .buy-sell-02-0 {
        background: url("../../assets/trade/buy_sell_icon_004.png");
      }
      .buy-sell-03 {
        background: url("../../assets/trade/buy_sell_icon_003.png");
      }
      .buy-sell-03-0 {
        background: url("../../assets/trade/buy_sell_icon_005.png");
      }
    }
    .file-title {
      padding: 0 20px;
      ul {
        padding-bottom: 15px;
      }
    }
    .file-title ul,
    .file-body ul {
      display: flex;
      > li {
        flex: 3;
      }
      > li:first-child {
        flex: 1.3;
        text-align: left;
      }
    }
    .file-body {
      .buy-bb {
        height: 204px;
        overflow: hidden;
        ul:first-child {
          margin-top: 4px;
        }
      }
      .sell-bb {
        overflow: hidden;
        height: 204px;
        ul:last-child {
          margin-bottom: 4px;
        }
      }
      .sell-bb {
        border-bottom: 1px solid #d5dfe9;
      }
      ul {
        padding: 7px 20px;
      }
      ul:hover {
        background: RGBA(216, 79, 79, 0.1);
      }
      .buy {
        color: #3c8c5f;
      }
      .sell {
        color: #d84f4f;
      }
      .full-buy {
        > .buy-bb {
          height: 406px;
          overflow: hidden;
        }
      }
      .full-sell {
        > .sell-bb {
          height: 406px;
          border-bottom: 0 none;
          overflow: hidden;
        }
      }
    }
  }
  .right-file {
    margin-left: 4px;
    .latest-deal {
      display: inline-block;
      color: #388cff;
      height: 44px;
      border-bottom: 2px solid #388cff;
    }
    .file-title {
      padding: 0 20px;
      ul {
        padding-bottom: 15px;
      }
    }
    .file-body {
      padding: 0 20px;
      ul {
        padding: 7px;
      }
    }
    .file-title ul,
    .file-body ul {
      display: flex;
      > li {
        flex: 3;
      }
      > li:first-child {
        flex: 1;
        text-align: left;
      }
      .buy {
        color: #3c8c5f;
      }
      .sell {
        color: #d84f4f;
      }
    }
  }
}
</style>
