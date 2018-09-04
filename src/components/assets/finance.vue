<template>
    <div class="finance">
        <div class="fs-28 color-333 finance-title mb-40">
            <p>
                <router-link to="/assets">资产管理 ></router-link>
                <span>财务记录</span>
            </p>
            <div class="fr table fs-20 color-999">
                <ul>
                    <li :class="parmars.table == '0' ?'active':''" @click="clickTab('0')">充币记录</li>
                    <li :class="parmars.table == '1' ?'active':''" @click="clickTab('1')">提币记录</li>
                </ul>
            </div>
        </div>
        <div class="search-bar mb-60">
            <div class="fl search">
                <div>
                    <input class="key-search" type="text" @keyup.enter="searKeywords" v-model="keywords">
                </div>
            </div>
            <div class="fl search-tab">
                <input type="button" v-for="(item,index) in searchBtnList" :class="item.isActive ? 'active' :''" :key="index" :value="item.keyName" @click="clickKeywords(item,index)">
            </div>
        </div>
        <div class="data-list shadow">
          <ChargeRecord v-bind:parmars='parmars'></ChargeRecord>
        </div>
    </div>
</template>

<script>
import ChargeRecord from "./chargeRecord";
export default {
  data() {
    return {
      parmars: {
        table: "0",
        keywords: ""
      },
      keywords: "",
      searchBtnList: [
        {
          keyName: "BTC",
          value: "btc",
          isActive: false
        },
        {
          keyName: "ETH",
          value: "eth",
          isActive: false
        },
        {
          keyName: "EOS",
          value: "eos",
          isActive: false
        },
        {
          keyName: "CTT",
          value: "ctt",
          isActive: false
        },
        {
          keyName: "全部",
          value: "all",
          isActive: false
        }
      ]
    };
  },
  methods: {
    clickTab(table) {
      this.keywords = "";
      this.searchBtnList.forEach(i => {
        i.isActive = false;
      });
      this.parmars = {
        table: table,
        keywords: this.keywords
      };
    },
    clickKeywords(item, index) {
      let keywords = "";
      this.searchBtnList[index].isActive = !item.isActive;
      this.searchBtnList.forEach(i => {
        if (i.isActive) {
          keywords += "-" + i.value;
        }
      });
      keywords = keywords.substring(1);
      this.parmars = {
        table: this.parmars.table,
        keywords: keywords
      };
    },
    searKeywords() {
      this.searchBtnList.forEach(i => {
        i.isActive = false;
      });
      this.parmars = {
        table: this.parmars.table,
        keywords: this.keywords
      };
    }
  },
  components: {
    ChargeRecord
  }
};
</script>


<style>
.shadow {
  -moz-box-shadow: 0 6px 5px #e8f1fb;
  box-shadow: 0 6px 5px #e8f1fb;
}
.finance {
  width: 100%;
  background: #f3f6f9;
  padding: 60px 100px 0;
  overflow: hidden;
}
.finance-title {
  border-bottom: 1px solid #d6e1f0;
  height: 48px;
}
.finance-title p {
  display: inline;
}
.finance-title a {
  color: #66b3ff;
}
.finance .table {
  height: 100%;
  margin-top: 2px;
}
.finance .table ul {
  height: 100%;
}
.finance .table li {
  height: 100%;
  float: left;
  padding: 10px 33px 0;
}
.finance .active {
  border-bottom: 3px solid #388cff;
  color: #388cff;
}
.finance .search-bar {
  overflow: hidden;
}
.finance .search-bar .search {
  width: 190px;
  background: #fff;
  border: 1px solid #dce0e9;
  margin-right: 18px;
}
.finance .search-bar .search > div {
  padding-left: 30px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  background: url("../../assets/user/search.png") no-repeat left 10px center;
}
.finance .search-bar .search .key-search {
  border: 0 none;
}
.finance .search-tab {
  height: 38px;
}
.finance .search-tab input {
  padding: 0 40px;
  line-height: 40px;
  border: 1px solid #dce0e9;
  border-radius: 40px;
  background: #fff;
  color: #dce0e9;
  margin-right: 10px;
  font-size: 16px;
}
.finance .search-tab .active {
  border: 1px solid #388cff;
  color: #388cff;
}
.finance .data-list {
  width: 100%;
  background: #fff;
  min-height: 654px;
  border-radius: 6px;
  margin-bottom: 40px;
  padding-top: 18px;
  padding-bottom: 60px;
}
</style>

