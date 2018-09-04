<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "App",
  created() {
    window.screenHeight = window.screen.availHeight;
  }
};
</script>
<style>
#app {
  min-width: 1280px;
}
</style>
