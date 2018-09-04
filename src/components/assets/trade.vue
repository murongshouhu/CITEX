<template>
    <div class="go-trade-show">
        <div>
          <router-link to="">OTC/BTC</router-link>
        </div>
        <div>
          <router-link to="">OTC/USDT</router-link>
        </div>
        <div>
          <router-link to="">OTC/ETH</router-link>
        </div>
      </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style>
.go-trade {
  padding: 22px 50px;
  top: -2px;
  right: 10px;
  background: #f6faff;
  border-radius: 6px;
  z-index: 9;
}
.go-trade-show > div {
  display: inline-block;
  padding: 0 11px;
  font-size: 16px;
}
.go-trade-show > div a {
  color: #333;
}
.go-trade-show > div:first-child a {
  color: #388cff;
}
</style>
