<template>
  <div class="layout">
      <Header></Header>
      <router-view/>
      <Footer></Footer>
  </div>
</template>

<script>
import Header from "./header";
import Footer from "./footer";
export default {
  name: "HelloWorld",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  components: {
    Header,
    Footer
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.layout {
  padding-top: 70px;
}
</style>
