<template>
    <div class="google-code">
      <!-- 绑定谷歌验证 -->
        <div class="first-step">
            <p class="fs-26 color-333 mb-26">下载并安装 “Google Authenticator (谷歌身份验证器)”  APP</p>
            <p class="fs-24 color-999 mb-40">打开手机，扫描下面的二维码下载并安装</p>
            <div class="pt-40 QR-code">
                <div>
                    <img src="../../assets/user/qr_code.png" alt="code">
                    <p class="mt-24">IOS版 扫码下载</p>
                </div>
                <div>
                    <img src="../../assets/user/qr_code.png" alt="code">
                    <p class="mt-24">Android版 扫码下载</p>
                </div>
            </div>
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
.google-code {
  width: 100%;
  text-align: center;
}
.QR-code {
  justify-content: center;
}
.QR-code > div {
  display: inline-block;
  width: 132px;
  text-align: center;
}
.QR-code > div > image {
  width: 132px;
  height: 132px;
}
</style>
