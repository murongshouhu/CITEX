<template>
    <div class="charge-record rel">
        <ul class="charge-record-title">
            <li>时间</li>
            <li>币种</li>
            <li>类型</li>
            <li>数量</li>
            <li>状态</li>
            <li>操作</li>
        </ul>
        <!-- 充币记录 -->
        <ul class="charge-record-list fs-16 color-333" v-if="table==0">
            <li v-for="(item,index) in data.list" :key="index" v-show='currencyIdArr.indexOf(item.currencyId-0) != -1'>
                <div class="record-list">
                    <div>{{getFormatTime(item.addTime)}}</div>
                    <div>{{getCurrencyname(item.currencyId)}}</div>
                    <div>充币</div>
                    <div>{{item.num | formatNumber}}</div>
                    <div>
                        <div>
                          <span v-if="table==0">已完成</span>
                          <span v-if="table==1">{{item.status == 'S'?'已完成': item.status == 'F' ? '转账中' : '待确认'}}</span>
                          <span v-if="table==1" class="brief rel">？
                            <span class="flag abs"></span>
                            <span class="abs brief-content shadow fs-16">如果长时间未到账，有可能是因为区块拥堵或转出平台未成功转出。</span>
                          </span>
                        </div>
                    </div>
                    <div class="rel">
                        <span class="info-tab" @click="checkInfo(item,index)">详情</span>
                        <span class="arrow abs" v-show='item.show'></span>
                    </div>
                </div>
                <div class="record-list-info fs-18" v-if="item.show">
                    <div>
                        <div><span class="record-list-info-lable">区块链交易ID:</span><span class="trade-id">{{item.txHash}}</span></div>
                        <div><span class="record-list-info-lable">钱包处理时间：</span><span>{{getFormatTime(item.addTime)}}</span></div>
                    </div>
                </div>
            </li>
        </ul>
        <!-- 提现记录 -->
        <ul class="charge-record-list fs-16 color-333" v-if="table == 1">
            <li v-for="(item,index) in data.list" :key="index" v-show='currencyIdArr.indexOf(item.currencyId-0) != -1'>
                <div class="record-list">
                    <div>{{getFormatTime(item.createTime)}}</div>
                    <div>{{getCurrencyname(item.currencyId)}}</div>
                    <div>提币</div>
                    <div>{{item.amount | formatNumber}}</div>
                    <div>
                        <div>
                          <span v-if="table==0">已完成</span>
                          <span v-if="table==1">{{item.auditStatus==0 && item.transferStatus == 1?'已完成':['2','4','6'].indexOf(item.auditStatus) != -1 &&   item.transferStatus == 2? '待确认' : '转账中'}}</span>
                          <span v-if="table==1 && item.auditStatus !=0 && item.transferStatus != 1" class="brief rel">？
                            <span class="flag abs"></span>
                            <span class="abs brief-content shadow fs-16">如果长时间未到账，有可能是因为区块拥堵或转出平台未成功转出。</span>
                          </span>
                        </div>
                    </div>
                    <div class="rel">
                        <span class="info-tab" @click="checkInfo(item,index)">详情</span>
                        <span class="arrow abs" v-show='item.show'></span>
                    </div>
                </div>
                <div class="record-list-info fs-18" v-if="item.show">
                    <div>
                        <div><span class="record-list-info-lable">区块链交易ID:</span><span class="trade-id">{{item.txHash || '暂无地址'}}</span></div>
                        <div><span class="record-list-info-lable">钱包处理时间：</span><span>{{getFormatTime(item.createTime)}}</span></div>
                    </div>
                    <div class="mt-26" v-if="parmars.table == 1">
                        <div><span class="record-list-info-lable">提币地址:</span><span class="trade-id color-333 fs-16">{{item.address}}</span></div>
                        <div><span class="record-list-info-lable">手续费:</span><span>{{item.fee}}</span></div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="block abs">
          <el-pagination
            @current-change='handleChange'
            layout="prev, pager, next"
            :total="data.pages">
          </el-pagination>
        </div>
    </div>
</template>

<script>
import axios from "../../utils/fetch.js";
import formatTime from "../../utils/formatTime.js";
import assetsApi from "../../api/assetsApi.js";
export default {
  data() {
    return {
      data: {},
      currencyList: [],
      currencyIdArr: [],
      pageNum: 0,
      pageSize: 10,
      table:0
    };
  },
  watch: {
    parmars(newValue) {
      this.table = this.parmars.table;
      this.getCurrencyId(this.parmars.keywords);
      if (this.parmars.keywords == "") {
        this.getCurrencyList();
      }
      this.pageNum = 0;
      this.pageSize = 0;
      if (this.parmars.table == 0) {
        this.getChargeRecord();
      } else {
        this.getWithdrawRecord();
      }
    }
  },
  created() {
    if (this.parmars.table == 0) {
      this.getChargeRecord();
    } else {
      this.getWithdrawRecord();
    }
    this.getCurrencyList();
  },
  methods: {
    //充值记录
    getChargeRecord() {
      let parmars = {
        pageNum: this.pageNum, //第几页
        pageSize: this.pageSize //每页条数
      };
      axios
        .fetch("/asset/wallet/queryDepositList", parmars, "get")
        .then(data => {
          let datas = data.data.list || [];
          datas.forEach(item => {
            item.show = false;
          });
          this.data = data.data;
        });
    },
    //提现记录
    getWithdrawRecord() {
      let parmars = {
        pageNum: this.pageNum, //第几页
        pageSize: this.pageSize //每页条数
      };
      axios
        .fetch("/asset/wallet/queryWithdrawList", parmars, "get")
        .then(data => {
          let datas = data.data.list || [];
          datas.forEach(item => {
            item.show = false;
          });
          this.data = data.data;
        });
    },
    //分页
    handleChange(v) {
      this.pageNum = v;
      if (this.parmars.table == 0) {
        this.getChargeRecord();
      } else {
        this.getWithdrawRecord();
      }
    },
    //获取id和币名对照表
    getCurrencyList() {
      assetsApi.currencyList().then(data => {
        let currencyIdArr = [];
        this.currencyList = data.result;
        data.result.forEach(item => {
          currencyIdArr.push(item.currencyId);
        });
        this.currencyIdArr = currencyIdArr;
        // console.log(this.currencyIdArr);
      });
    },
    //获取货币名称
    getCurrencyname(id) {
      let currencyname = "";
      this.currencyList.forEach(item => {
        if (item.currencyId == id) {
          currencyname = item.symbol;
        }
      });
      return currencyname;
    },
    // 获取货币ID
    getCurrencyId(keywords) {
      let keywordsArr = keywords.split("-");
      let currencyIdArr = [];
      if (keywordsArr.indexOf("all") != -1) {
        this.currencyList.forEach(item => {
          currencyIdArr.push(item.currencyId);
        });
      } else {
        for (let i = 0; i < keywordsArr.length; i++) {
          this.currencyList.forEach(item => {
            if (item.symbol.indexOf(keywordsArr[i].toUpperCase()) != -1) {
              currencyIdArr.push(item.currencyId);
            }
          });
        }
      }

      this.currencyIdArr = currencyIdArr;
      // console.log('currencyIdArr',currencyIdArr);
    },
    checkInfo(item, index) {
      let that = this;
      this.data.list.forEach(i => {
        if (i.show !== this.data.list[index].show) {
          i.show = false;
        }
      });
      this.data.list[index].show = !item.show;
    },
    getFormatTime(time) {
      return formatTime.formatTime(time);
    }
  },
  filters:{
    formatNumber(num){
      return (num-0).toFixed(8)
    }
  },
  props: ["parmars"]
};
</script>

<style>
.charge-record {
  width: 100%;
  min-height: 570px;
}
.charge-record-title {
  display: flex;
  padding: 0 44px;
}
.charge-record ul li {
  text-align: center;
}
.charge-record-title li {
  flex: 1;
  font-size: 16px;
  color: #464a53;
  line-height: 56px;
}
.charge-record-list li:nth-child(2n-1) .record-list {
  background: #f6faff;
}
.charge-record-list li .record-list {
  display: flex;
  line-height: 42px;
  margin: 0 44px 6px;
}
.charge-record-list .record-list > div {
  flex: 1;
}
.record-list-info {
  padding: 40px 0;
  background: #f6faff;
}
.charge-record-list .arrow {
  width: 20px;
  height: 10px;
  display: inline-block;
  bottom: -8px;
  left: 50%;
  box-sizing: border-box;
  transform: translateX(-50%);
  border: 10px solid transparent;
  border-bottom: 10px solid #f6faff;
}
.charge-record-list .brief {
  display: inline-block;
  width: 16px;
  height: 16px;
  color: #fff;
  background: #999;
  vertical-align: middle;
  font-size: 12px;
  line-height: 16px;
  border-radius: 50%;
}
.charge-record-list .brief:hover {
  background: #388cff;
}
.charge-record-list .brief .flag {
  top: 16px;
  left: 0;
  display: inline-block;
  width: 20px;
  height: 10px;
  box-sizing: border-box;
  border: 10px solid transparent;
  border-bottom: 10px solid #f6faff;
  display: none;
}
.charge-record-list .brief .brief-content {
  display: inline-block;
  width: 390px;
  line-height: 26px;
  text-align: left;
  color: #666;
  padding: 30px;
  top: 36px;
  right: -80px;
  z-index: 9;
  background: #f6faff;
  border-radius: 6px;
  display: none;
}
.charge-record-list .brief:hover .flag,
.charge-record-list .brief:hover .brief-content {
  display: inline-block;
}
.record-list-info {
  text-align: left;
  padding-left: 70px;
  padding-right: 70px;
  margin-bottom: 6px;
}
.record-list-info > div {
  display: flex;
  overflow: hidden;
}

.record-list-info > div div:first-child {
  float: left;
  flex: 1.5;
}
.record-list-info > div div:last-child {
  float: right;
  flex: 1;
}
.record-list-info span {
  display: inline-block;
}
.record-list-info .trade-id {
  color: #388cff;
}
.record-list-info-lable {
  width: 136px;
  margin-right: 30px;
  text-align: right;
}
.info-tab {
  color: #388cff;
}
.charge-record .block {
  left: 50%;
  bottom: -48px;
  transform: translateX(-50%);
}
.charge-record .block .el-pagination {
  font-weight: 100;
}
</style>
