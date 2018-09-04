<template>
	<div class="kyc1">
		<div class="id-item">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
				<el-form-item label="国家/地区:" prop="country">
					<el-select v-model="ruleForm.country" placeholder="请选择国家/地区" @visible-change="getCountries">
						<el-option v-for="(item,index) in Countries" :key="index" :label="item.cn" :value="item.code">
							<span style="float: left">{{ item.code }}</span>
							<span style="float: right; color: #8492a6; font-size: 13px">{{ item.cn }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="证件类型:" prop="certificate">
					<el-select v-model="ruleForm.certificate" placeholder="请选择证件类型">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="姓名:" prop="realName">
					<el-input v-model="ruleForm.realName" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="证件号:" prop="idNumber">
					<el-input v-model="ruleForm.idNumber" placeholder="请输入证件号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import fetch from "../../utils/fetch.js";
export default {
  data() {
    return {
      ruleForm: {
        realName: "", //姓名
        certificate: "", //证件类型
        country: "", //国家地区
        idNumber: "" //证件号
      },
      options: [
        {
          value: "1",
          label: "身份证"
        },
        {
          value: "2",
          label: "护照"
        }
      ],
      rules: {
        //表单验证
        realName: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur"
          }
        ],
        idNumber: [
          {
            required: true,
            message: "请输入证件号",
            trigger: "blur"
          }
        ],
        country: [
          {
            required: true,
            message: "请选择国家/地区",
            trigger: "change"
          }
        ],
        certificate: [
          {
            required: true,
            message: "请选择证件类型",
            trigger: "change"
          }
        ]
      },
      Countries: [] //地区
    };
  },
  methods: {
    getCountries(visible) {
      //本地国家json
      if (visible) {
        fetch.fetch("/static/json/Data.json", "post").then(data => {
          data.forEach(item => {
            this.Countries.push(item);
          });
        });
      }
    },
    submitForm(formName) {
      //提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          let that = this;

          let parmars = {
            realName: this.ruleForm.realName, //真实姓名
            idNumber: this.ruleForm.idNumber, //证件号码
            nation: this.ruleForm.country, //所属国家
            idType: this.ruleForm.certificate //证件类型
          };
          this.$emit("ee", "cc12345");
          fetch.fetch("/kyc/submitCert1", parmars, "post").then(data => {
            that.$message.success(data.msg);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style>
.kyc1 {
  width: 710px;
  margin: 0 auto;
}

.id-item input {
  width: 360px;
}

.id-item .el-input__prefix,
.el-input__suffix {
  color: #6ba9fe !important;
}

.id-item .el-select .el-input .el-select__caret {
  color: #6ba9fe !important;
  font-size: 22px;
}

.id-item button {
  width: 360px;
  background: #66b3ff;
  margin-top: 2rem;
}

.id-item li {
  margin-top: 20px;
  position: relative;
  line-height: 48px;
}

.id-item li > div {
  display: inline-block;
}

.id-item li > div:last-child {
  padding-left: 152px;
  padding-right: 156px;
  width: 100%;
  height: 48px;
}

.lable {
  position: absolute;
  top: 0;
  left: 0;
  width: 152px;
  height: 100%;
  padding-right: 30px;
  text-align: right;
}

.form-data > div {
  width: 100%;
  height: 100%;
  border: 1px solid #d6e1f0;
}

.item-content {
  padding-left: 10px;
}

.item-content-country {
  padding-left: 76px;
}

.country-number {
  top: 0;
  left: 20px;
  height: 100%;
  width: 40px;
}

.item-content-country .el-input__inner {
  padding-left: 0 !important;
}

.item-content > div {
  width: 100%;
}

.item-content .el-input__inner {
  height: 100%;
  border: 0 none;
}

.form-data .el-input__inner {
  color: #999;
}

.submit-btn .el-button {
  width: 100%;
  height: 48px;
  font-size: 18px;
}
</style>