<template>
    <!-- 委托记录 -->
    <div class="entrustment">
        <div class="table color-999 fs-16">
            <div class="fl mr-56" @click="checkTbale(false)" :class="active?'':'active'">当前委托</div>
            <div class="fl" @click="checkTbale(true)" :class="active?'active':''">历史委托</div>
            <div class="fr">更多</div>
        </div>
        <div class="content">
            <div>
              <div class="ent-title fs-14 color-999">
                  <ul>
                      <li>委托时间</li>
                      <li>交易对</li>
                      <li class="flex-h">方向</li>
                      <li>委托总量｜已成交</li>
                      <li>委托价|成交均价</li>
                      <li>委托金额</li>
                      <li  class="flex-h">状态</li>
                      <li v-show="!active"  class="flex-h">操作</li>
                  </ul>
              </div>
              <div class="ent-content color-333 center fs-14">
                  <ul v-for="(item,key) in queryOrdersList.list" :key="key">
                      <li v-if="!active">{{formatTime(item.placeTimestamp)}}</li>
                      <li v-else>{{formatTime(item.timestamp)}}</li>
                      <li>{{getSymbol(tradeItem,tradeItem.contractId)}}</li>
                      <li class="flex-h" :class="isBuy?'buy':'sell'">{{item.side == -1?'卖出':'买入'}}</li>
                      <li v-if="!active">{{item.quantity | numberFormat}}｜{{item.quantity-item.leftQuantity | numberFormat}}</li>
                      <li v-else>{{item.quantity | numberFormat}}｜{{item.quantity-item.canceledQuantity | numberFormat}}</li>
                      <li>{{item.price | numberFormat}}</li>
                      <li>{{item.quantity*item.price | numberFormat}}</li>
                      <li class="flex-h">{{item.filled?'完全成交':'部分成交'}}</li>
                      <li v-if="!active" class="flex-h operation" @click="cancelOrder(item.contractId,item.orderId)">撤销</li>
                  </ul>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
import formatTime from "../../utils/formatTime.js";
export default {
  data() {
    return {
      isLogin: false,
      active: false,
      isBuy: false,
      queryOrdersList: {}
    };
  },
  watch: {
    tradeItem(newValue) {
      if (this.isLogin) {
        if (!this.active) {
          this.getQueryActiveOrders(newValue.contractId);
        } else {
          this.getQueryHistoryOrders(newValue.contractId);
        }
      }
    },
    active() {
      if (this.isLogin) {
        if (!this.active) {
          this.getQueryActiveOrders(this.tradeItem.contractId);
        } else {
          this.getQueryHistoryOrders(this.tradeItem.contractId);
        }
      }
    }
  },
  mounted() {
    this.getLoginInfo();
  },
  methods: {
    getLoginInfo() {
      let token = localStorage.getItem("userToken");
      if (token) {
        this.isLogin = true;
        this.startRequestData();
      } else {
        this.isLogin = false;
      }
    },
    startRequestData() {
      let that = this;
      let timer = setInterval(() => {
        if (JSON.stringify(that.tradeItem) != "{}") {
          that.getQueryActiveOrders(that.tradeItem.contractId);
          clearInterval(timer);
        }
      }, 100);
    },
    checkTbale(b) {
      if (b == this.active) {
        return;
      }
      this.queryOrdersList = {};
      this.active = !this.active;
    },
    //当前委托数据
    getQueryActiveOrders(id) {
      axios
        .fetch("/order/queryActiveOrders" , {contractId:id}, "get")
        .then(data => {
          if (data && data.list != [] && data.list != null) {
            this.queryOrdersList = data;
          }
        });
    },
    //历史委托数据
    getQueryHistoryOrders(id) {
      let parmars = {
        contractId: id,
        pageNum: 1,
        pageSize: 10
      };
      axios.fetch("/order/queryLastestHistoryOrders", parmars, "get").then(data => {
        if (data && data.list != [] && data.list != null) {
          this.queryOrdersList = data;
        }
      });
    },
    getSymbol(data, contractId) {
      let symbol = "";
      symbol = data.symbol.replace("-", "/");
      return symbol;
    },
    formatTime(time) {
      return formatTime.formatTime(time, ":");
    },
    //撤单
    cancelOrder(contractId, originalOrderId) {
      let parmars = {
        contractId: contractId,
        originalOrderId: originalOrderId
      };
      axios.fetch("/order/cancel", parmars, "post").then(data => {
        if (!this.active) {
          this.getQueryActiveOrders(this.tradeItem.contractId);
        } else {
          this.getQueryHistoryOrders(this.tradeItem.contractId);
        }
      });
    }
  },
  filters: {
    numberFormat(num) {
      let number = num - 0;
      return number.toFixed(4);
    }
  },
  props: ["tradeItem"]
};
</script>

<style lang='scss'>
.entrustment {
  background: #fff;
  .active {
    color: #388cff;
    border-bottom: 3px solid #388cff;
  }
  .table {
    padding: 0 20px;
    height: 46px;
    line-height: 44px;
    margin-bottom: 10px;
    box-shadow: 0px 0 0 #fff, 0 0 0 #fff, 0 2px 20px #e9e9e9;
  }
  .ent-title {
    border-bottom: 1px solid #d5dfe9;
  }
  .content {
    overflow-x: scroll;
    > div {
      min-width: 980px;
    }
  }
  .ent-title,
  .ent-content {
    margin: 0 20px;
    padding: 14px 0;
    text-align: center;
    ul {
      width: 100%;
      display: flex;
    }
    li {
      flex: 2;
    }
    .flex-h {
      flex: 1;
    }
    li:first-child {
      text-align: left;
    }
    li:last-child {
      text-align: right;
    }
  }
  .ent-content {
    margin: 0 20px;
    height: 180px;
    overflow-y: scroll;
    ul {
      width: 100%;
      display: flex;
      padding: 4px 0;
    }
    .operation {
      color: #388cff;
    }
    .buy {
      color: #3c8c5f;
    }
    .sell {
      color: #d84f4f;
    }
  }
}
</style>
