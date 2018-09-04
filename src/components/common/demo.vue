<template>
    <div class="jiyan">
        <h1>我是demo</h1>
        <div id="captchaBox"></div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      data: {}
    };
  },
  mounted() {
    this.getParmars();
  },
  methods: {
    getParmars() {
      this.axios
        .get("/demo/gt/register-slide?t=" + new Date().getTime())
        .then(data => {
          let datas = data.data;
          initGeetest(
            {
              // 以下配置参数来自服务端 SDK
              gt: datas.gt,
              challenge: datas.challenge,
              offline: !datas.success,
              new_captcha: true,
              product: "popup",
              lang: "en"
            },
            function(captchaObj) {
              // 这里可以调用验证实例 captchaObj 的实例方法
              captchaObj.appendTo("#captchaBox"); //将验证按钮插入到宿主页面中captchaBox元素内
              captchaObj
                .onReady(function() {
                  //your code
                })
                .onSuccess(function() {
                  //your code
                  var result = captchaObj.getValidate();
                  console.log(result);
                  captchaObj.reset(); // 调用该接口进行重置
                })
                .onError(function() {
                  //your code
                });
            }
          );
        });
    },
    useJy() {}
  }
};
</script>


<style>
</style>
