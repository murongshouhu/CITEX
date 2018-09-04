<template>
    <div class="rest-password">
        <div class="table-change">
            <el-tabs v-model="activeName" @tab-click="handleClick" stretch>
              <el-tab-pane label="邮箱修改" name="first">
                  <ResetPswForm v-bind:accountType='accountType'></ResetPswForm>
              </el-tab-pane>
              <el-tab-pane label="手机修改" name="second">
                  <ResetPswForm v-bind:accountType='accountType'></ResetPswForm>
              </el-tab-pane>
          </el-tabs>
        </div>
    </div>
</template>

<script>
import ResetPswForm from "./resetPswForm";
export default {
  data() {
    return {
      activeName: "first",
      accountType: "0"
    };
  },
  methods: {
    handleClick(tab, event) {
      this.accountType = tab.index;
    }
  },
  components: {
    ResetPswForm
  }
};
</script>

<style>
.rest-password {
  width: 524px;
  margin: 0 auto;
  padding: 60px 0;
}
.rest-password .el-tabs__item {
  font-size: 18px;
}
</style>

