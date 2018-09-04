<template>
  <div  class="home-list">
    <div class="home-present">
       <span class="title-text">行情</span>
       <div class="list-main">
            <div class="tab-title">
              <ul class="tab">
                  <li v-for="(item,index) in accountCurrencyList" @click="switchCurrency(index,item.currencyId)" :key="index" :class="{'tab-active':tabIndex===index}">{{item.symbol}}</li>
                  <li><div :class="{'nav-co':activeIndex === 'my'}" @click="switchCurrency('my','my')">自选</div></li>
              </ul>
            </div>
            <div class="tab-content">
              <div class="content-text-tit">
                  <ul>
                    <li class="length-15">交易对</li>
                    <li class="text-left">即时市价</li>
                    <li>24H涨跌幅</li>
                    <li>24H最高</li>
                    <li>24H最低</li>
                    <li>24H成交</li>
                    <li>去交易</li> 
                  </ul>
              </div>
              <div class="content-text-list" v-show="!active">
                  <ul v-for="(item,key) in filtersList" :key="key">
                    <li class="marleft73">{{item.symbol | filterName}}</li>
                    <li class="text-left marleftz45">
                      <span class="tx-top">{{item.lastPrice | filterFour}}</span>
                      <span class="text-co tx-bot">≈￥{{item.lastPriceCn | filterTwo}}</span>
                      </li>
                    <li :class="{'text-red':item.priceChangeRadio<0}" class="marleft60">{{item.priceChangeRadio | filterPercent}}</li>
                    <li>{{item.priceHigh | filterTwo}}</li>
                    <li>{{item.priceLow | filterTwo}}</li>
                    <li class="marleftz35">{{item.totalVolume | filterThree}}</li>
                    <li class="text-color marleft32 cursor-pointer" @click="seeDetails(item.contractId)">查看</li>
                  </ul>
              </div> 
              <div class="content-text-list n-list" v-show ="active">暂无数据</div> 
            </div>
       </div>  
    </div> 
  </div>
</template>
 
<script>
import tradeApi from '../../api/tradeApi'
import assetsApi from '../../api/assetsApi'
export default {
   data() {
    return {
      priceChange:"",
      isColor:false,
      tabIndex: 0,
      currencyId: "",
      contractId: "", //交易对id
      queryContractList: [], //交易对
      queryIndicatorList: [], //交易对行情
      filtersList:[], //筛选结果
      tradeItem: {},
      currencyList:[],
      active:false,
      activeIndex: "",
      accountCurrencyList:[],
      currentUsPrice:[],
      exchangeList:[]
    };
  },
  mounted() {
    this.getQueryAccountCurrency();
    this.getCurrencyPrice();
    this.getExchangeList();
  },
  methods: {
    //初始化数据
    init(){
      if(this.accountCurrencyList.length > 0){
        this.filterMoney(this.accountCurrencyList[0].currencyId);
      }
      if(this.currencyList.length > 0){
        this.getCurrencyPrice(this.currencyList[0].currencyId);
      }
      if(this.filtersList.length>0){
        this.active =false;
      }else{
        this.active = true;
      }
      
    },
    switchCurrency(index, id) {
      this.filtersList = [];
      this.tabIndex = index;
      this.activeIndex = id;
      // if (id == "my") {
      //   return;
      // }
      this.filterMoney(id);
      this.getCurrencyPrice(id);//获取当前货币对应美元的美元价格
      if(this.filtersList.length>0){
        this.active =false;
      }else{
        this.active = true;
      }

    },
    //获取计价货币
    getQueryAccountCurrency(){
      tradeApi.getQueryAccountCurrency().then(data =>{
        this.accountCurrencyList =data.result;
        this.getCurrencyList();
      })
    },
    // 获取货币信息渲染导航栏
    getCurrencyList() {
      assetsApi.currencyList().then(data => {
        this.currencyList = data.result;
        this.getQueryContract();
        this.filterSymbol();//筛选货币名称
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
        this.init();// 初始化调用
      });
    },
    // 获取货币对应的当前美元价格
    getCurrencyPrice(id) {
      assetsApi.currencyPrice().then(data => {
        this.currentUsPrice = data.result;
        // 获取人民币币对应的美元汇率
        this.getExchangeList();
      });
    },
    //获取人民币币对应的美元汇率
    getExchangeList(){
      assetsApi.exchangeList().then(data =>{
        this.exchangeList = data.result;
        data.result.forEach(i => {
          if (i.name == "CNY") {
            this.UsRateCny = i.rate;
          }
        });
      })
    },
    //查看详情跳转到币币交易
    seeDetails(contractId){
      //alert(contractId);
       this.$router.push({
        path: '../trade',
        params: { contractId: contractId }//传递给其他页面的参数
       })
    },
    //获取导航栏过滤的货币名称
    filterSymbol(){
      let arr = [];
      this.currencyList.forEach(item => {
          this.accountCurrencyList.forEach(i =>{
            if(i.currencyId == item.currencyId){
              i.symbol = item.symbol; 
              arr.push(i);
            }
          })
      });
      this.accountCurrencyList = arr;
      console.log(this.accountCurrencyList);
    },
    //获取当前货币转化成美元
    getUsPrice(id){
      //1个当前币对应的美元价格
      let lastPriceUs = 0;
      this.currentUsPrice.forEach(item => {
        if(item.currencyId == id){
          this.lastPriceUs = item.latest;
        }
      })
    },

    //获取过滤后的数据
    filterMoney(id) {
      if (id == "my") {
        return;
      } else {
        this.getUsPrice(id);//调用获取USD价格 
        this.queryContractList.forEach(item => {
          if (id == item.currencyId) {
            this.queryIndicatorList.forEach(i =>{
              if(item.contractId == i.contractId){
                i.symbol = item.symbol;
                i.totalVolume = (i.totalVolume)+','+(i.symbol).substring(0,3);
                i.lastPriceCn = (i.lastPrice*this.lastPriceUs*this.UsRateCny).toFixed(2);
                this.filtersList.push(i);
              }
            })
          }
        });
      }
    },
  },
  filters: {
    // 转化交易对名称
    filterName(bbName) {
      if (!bbName) {
        return;
      }
      return bbName.replace("-", "/");
    },
    //保留两位小数
    filterTwo(num) {
      if(!num){
        return;
      }
      num = Number(num).toFixed(2);
      if(num =="-0.00"){
        num = "0.00"
      }
      return num;
    },
    //保留4位小数
    filterFour(num) {
      if(!num){
        return;
      }
      num = Number(num).toFixed(4);
      if(num =="-0.00"){
        num = "0.00"
      }
      return num;
    },
    //*100+保留一位小数
    filterPercent(num){
      if(!num){
        return;
      }
      num = Number(num * 100).toFixed(1)+'%';
      return num;
    },
    //保留三位小数+"万"+"对应货币名称"
    filterThree(num){
      if(!num){
        return;
      }
      let  numArr = num.split(',');
      num = Number(numArr[0]/10000).toFixed(3)+'万'+numArr[1];
      return num
    }  
  },
  components: {
  }
}
</script>
 
<style lang="scss">

  .home-list{
    .text-red{
      color:#ef7070;
    }
    .home-present{
      padding-top: 100px;
      width: 80%;
      margin: auto;
      background-color: #ffffff;
      margin-bottom: 150px;
      min-width:1280px;
    }
    .list-main{
      width:100%;
      border:1px solid #d0d0d0;
    }
    .title-text{
      width: 50px;
      height: 25px;
      font-family: PingFangSC-Medium;
      font-size: 26px;
      font-weight: normal;
      font-stretch: normal;
      line-height: 96px;
      letter-spacing: 0px;
      color: #333333;
    }
    .tab-title.ul{
      border-top: solid 1px #d0d0d0;
    }
    .content-text-tit{
      width:100%;
    }
    .content-text-tit ul{
      height: 60px;
      border-top: solid 1px #d0d0d0;
    }
    .content-text-tit ul li{
      width:14%;
      font-size: 18px;
      height:37px;
      line-height:37px;
      display:inline-block;
      text-align: center;
      font-weight: normal;
	    font-stretch: normal;
      margin-top: 10px;
    }
    .n-list{
      color: #333333;
    padding-top: 28px;
    padding-bottom: 28px;
    font-weight: 300;
    font-size: 18px;
    text-align: center;
    border-top: 1px solid #d0d0d0;
    }
    .text-left{
      text-align: left !important;
    }
    .content-text-list ul{
      border-top: solid 1px #d0d0d0;
      height: 55px;
      line-height: 60px;
      margin-bottom: 20px;
      margin:0;
    }
    .content-text-list ul li{
      width:14%;
      font-size: 18px;
      height:37px;
      line-height:37px;
      display:inline-block;
      text-align: right;
      font-weight: normal;
	    font-stretch: normal; 
    }
    .cursor-pointer{
        cursor: pointer;
    }
    .marleft73{
      margin-left: -73px;
    }
    .marleft60{
      margin-left:-60px;
    }
    .marleft32{
      margin-left:-32px;
    }
    .marleftz45{
      margin-left:45px
    }
    .marleftz35{
      margin-left:35px;
    }
    .content-text-list .text-color{
      color:#398bfe;
    }
   .content-text-list .text-co{
     color:#c7c7c7;
   }
    .tab {
      margin: 0;
      padding: 0;
      background-color: #fafcff;
      height:86px;
    }
    .tab li {
      display: inline-block;
      padding: 5px 12px;
      color: #666;
      height:55px;
      line-height: 65px;
      border: 0px solid #fafcff;
      border-radius: 3px 3px 0 0;
      cursor: pointer;
      font-size: 18px;
      border-bottom-width: 3px;
    }
    .tab li.tab-active {
      color: #666;
      color:#398bfe;
      border-bottom-color: #398bfe;
    }
    .nav-co {
      color: #388cff;
      border-bottom: 3px solid #388cff;
      height:50px
    }     
  }
  
</style>