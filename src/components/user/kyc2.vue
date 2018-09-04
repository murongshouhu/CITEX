<template>
	<div>
		<div class="kyc2">
			<el-row :gutter="20">
				<el-col :span="12">
					<div class="grid-content bg-purple uploader">
						<div class="uploaderLeft"> 封  面 ：</div>
						<div class="uploaderRight">
							<div class="avatar-uploader_bg">
								<el-upload class="avatar-uploader" action="/kyc/upload/level2" name="kyc2File"
									:show-file-list="false" 
									:on-success="handleAvatarSuccess" 
									:data="imgData" 
									:headers="imgHeaders" 
									:before-upload="beforeAvatarUpload">
									<img v-if="imageUrl" :src="imageUrl" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									<p class="click_p">点击上传</p>
								</el-upload>
							</div>

							<div class="uploaderRight_text">
								<p>1、证件上所有信息清晰可见，不允许任何修改或遮挡</p>
								<p>2、必须能看清证件号和姓名</p>
								<p>3、支持.jpg .jpeg .png格式照片，大小不超过5M</p>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple uploader">
						<div class="uploaderLeft">示例：</div>
						<div class="uploaderRight">
							<img src="../../assets/card/card2.png" alt="">
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class=" kyc2">
			<el-row :gutter="20">
				<el-col :span="12" >
					<div class="grid-content bg-purple uploader">
						<div class="uploaderLeft">信息页：</div>
						<div class="uploaderRight">
							<div class="avatar-uploader_bg1">
								<el-upload class="avatar-uploader" action="/kyc/upload/level2" name="kyc2File" 
									:show-file-list="false"
									:on-success="handleAvatarSuccessCrad1"
									:data="imgData" 
									:headers="imgHeaders" 
									:before-upload="beforeAvatarUpload">
									<img v-if="imageUrlCrad1" :src="imageUrlCrad1" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									<p class="click_p">点击上传</p>
								</el-upload>
							</div>

							<div class="uploaderRight_text">
								<p>1、证件上所有信息清晰可见，不允许任何修改或遮挡</p>
								<p>2、必须能看清证件号和姓名</p>
								<p>3、支持.jpg .jpeg .png格式照片，大小不超过5M</p>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple uploader">
						<div class="uploaderLeft">示例：</div>
						<div class="uploaderRight">
							<img src="../../assets/card/card_back2.png" alt="">
						</div>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="kyc2">
			<el-row :gutter="20">
				<el-col :span="12">
					<div class="grid-content bg-purple uploader">
						<div class="uploaderLeft">手持照：</div>
						<div class="uploaderRight">
							<div class="avatar-uploader_bg2">
								<el-upload class="avatar-uploader" action="/kyc/upload/level2" name="kyc2File" 
									:show-file-list="false" 
									:on-success="handleAvatarSuccessHandheld_card2" 
									:data="imgData" 
									:headers="imgHeaders"
									:before-upload="beforeAvatarUpload">
									<img v-if="imageUrlHandheld_card2" :src="imageUrlHandheld_card2" class="avatar">
									<i v-else class="el-icon-plus avatar-uploader-icon"></i>
									<p class="click_p">点击上传</p>
								</el-upload>
							</div>
							<div class="uploaderRight_text" >
								<p>1、手持证件和手写字条的照片，字条内容CITEX+当前日期</p>
								<p>2、确保照片上证件信息清晰可见</p>
                				<p>3、确保持照人五官清晰可见</p>
								<p>4、支持.jpg .jpeg .png格式照片，大小不超过5M</p>
							</div>
						</div>
					</div>
				</el-col>
				<el-col :span="12">
					<div class="grid-content bg-purple uploader">
						<div class="uploaderLeft">示例：</div>
						<div class="uploaderRight">
							<img src="../../assets/card/handheld_card2.png" alt="">
						</div>
					</div>
				</el-col>
			</el-row>
		</div>

	<div class="kyc2_btn">
     <el-button type="primary" @click='CertificationSubmitted'>提交</el-button>
  </div>

    

	</div>

</template>

<script>
import fetch from "../../utils/fetch.js";
export default {
  data() {
    return {
      imageUrl: "", //身份证正面
      imageUrlCrad1: "", //身份证反面
      imageUrlHandheld_card2: "", //手持照
      imgHeaders: {
        //token
        Authorization: ""
      },
      imgData: {
        //照片附带参数
        imgType: "hold_certificate"
      },
      images: [], //图片
      form: {
        idPositive: "", //身份证正面
        idOpposite: "", //身份证反面
        holdCertificate: "" //手持照
      }
    };
  },
  methods: {
    handleAvatarSuccess(response, file) {
      //身份证正面成功回调
      this.imageUrl = URL.createObjectURL(file.raw);
      let imgUrl = response.data;
      this.form.idPositive = imgUrl;
    },
    handleAvatarSuccessCrad1(response, file) {
      ////身份证反面成功回调
      this.imageUrlCrad1 = URL.createObjectURL(file.raw);
      let imgUrl = response.data;
      this.form.idOpposite = imgUrl;
    },
    handleAvatarSuccessHandheld_card2(response, file) {
      ////手持照成功回调
      this.imageUrlHandheld_card2 = URL.createObjectURL(file.raw);
      let imgUrl = response.data;
      this.form.holdCertificate = imgUrl;
    },
    beforeAvatarUpload(file) {
      //验证图片格式
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //提交
    CertificationSubmitted() {
      if (this.form.idPositive == "") {
        this.$message.error("请上传身份证正面照!");
        return;
      }
      if (this.form.idOpposite == "") {
        this.$message.error("请上传身份证反面照!");
        return;
      }
      if (this.form.holdCertificate == "") {
        this.$message.error("请上传手持证件照!");
        return;
      }
      let that = this;
      console.log(this.form, "form");
      let parmars = {
        idPositive: this.form.idPositive,
        idOpposite: this.form.idOpposite,
        holdCertificate: this.form.holdCertificate
      };
      fetch.fetch("/kyc/submitCert2", parmars, "post").then(data => {
        this.$emit("ee", "cc12345");
      });
    }
  },
  mounted() {
    let userToken = JSON.parse(localStorage.getItem("userToken") || "{}");
    this.imgHeaders.Authorization =
      userToken.token_type + userToken.access_token;
  }
};
</script>

<style>
.kyc2 {
  width: 910px;
  margin: 0 auto;
}

.el-row {
  margin-bottom: 20px;
}

.el-col {
  border-radius: 4px;
}

.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.avatar-uploader .el-upload {
  /* border: 1px dashed #d9d9d9; */
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  /* overflow: hidden; */
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader {
  height: 177px;
}

.avatar-uploader_bg {
  height: 177px;
  background: url(../../assets/card/card1.png);
}

.avatar-uploader_bg1 {
  height: 177px;
  background: url(../../assets/card/card_back1.png);
}

.avatar-uploader_bg2 {
  width: 298px;
  height: 177px;
  background: url(../../assets/card/handheld_card1.png);
}

.avatar-uploader-icon {
  z-index: 999;
  font-size: 42px;
  color: #fff;
  width: 280px;
  height: 30px;
  line-height: 170px;
  text-align: center;
}

.el-icon-plus:before {
  z-index: 999;
  color: #fff;
  width: 200px;
  height: 200px;
  border: 1px dashed #ccc;
}

.avatar {
  width: 291px;
  height: 176px;
  display: block;
}

.click_p {
  font-size: 14px;
  color: #fff;
  padding: 1rem;
}

.uploader {
  display: flex;
}

.uploaderLeft .uploaderRight {
  float: left;
}

.uploaderLeft {
  line-height: 88px;
  padding-right: 30px;
  font-size: 14px;
  font-weight: 600;
}

.uploaderRight_text p {
  padding: 0.3rem;
  color: #999;
}

.kyc2_center {
  border: 1px solid #d6e1f0;
  border-left: none;
  border-right: none;
  width: 1200px;
  margin: 0 auto;
  padding: 2rem 0 1.2rem;
  margin-bottom: 2rem;
}
.kyc2_btn {
  text-align: center;
  margin-top: 4rem;
}
.kyc2_btn button {
  width: 400px;
  height: 45px;
  text-align: center;
  background: #66b3ff;
  color: #fff;
  font-size: 16px;
}
</style>