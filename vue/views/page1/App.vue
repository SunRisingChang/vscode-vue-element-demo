<template>
  <div class="app" v-loading="isLoading">
    <el-alert v-if="errorMsg" :title="errorMsg" type="warning" :closable="false"> </el-alert>
    <div class="button-block">
      <el-button plain type="info" @click="handleCreatQueryFile">生成查询页</el-button>
      <el-button plain type="primary" @click="handleCreatTypingFile">生成接口泛型</el-button>
    </div>
    <div class="path-block" v-if="reqPathTree.length > 0">
      选择 From 节点：
      <el-cascader v-model="reqNodePath" :options="reqPathTree" :props="{ checkStrictly: true }"></el-cascader>
      <el-button plain type="primary" @click="resolveInterfaceReqInfo">确认</el-button>
    </div>
    <tpl-form-create ref="tpl-form-create" :initFormItem="interFace.queryBody" :pathTree="reqPathTree" class="tpl-form-create"></tpl-form-create>
    <div class="path-block">
      选择 Table 节点：
      <el-cascader v-model="resNodePath" :options="resPathTree"></el-cascader>
      <el-button plain type="primary" @click="resolveInterfaceResInfo">确认</el-button>
    </div>
    <tpl-table-create ref="tpl-table-create" :initFormItem="interFace.tableBody" :pathTree="resPathTree" class="tpl-table-create"></tpl-table-create>
  </div>
</template>

<script>
import { sayOpSuccess, sayOpError } from "../../lib/utils";

export default {
  name: "tplFormCreatePage",
  data() {
    return {
      interFace: {
        queryBody: [{ key: "key1" }, { key: "key2" }],
        tableBody: [{ key: "key1" }],
      },
      isLoading: false,
      errorMsg: "",
      apiType: "GET",
      reqPathTree: [],
      resPathTree: [],
      fullInterFaceInfo: {},
      // 表单节点路径
      resNodePath: [],
      // 表单节点路径
      reqNodePath: [],
    };
  },
  mounted() {
    this.doGetInterfaceInfo();
  },
  methods: {
    // 加载接口数据
    async doGetInterfaceInfo() {
      try {
        this.isLoading = true;
        await this.$vscPost("getCurrInterface");
      } catch (error) {
        this.errorMsg = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    // 生成查询页
    async handleCreatQueryFile() {
      try {
        if (this.interFace.tableBody.length == 0 || this.interFace.queryBody.length == 0) {
          throw Error("数据为空无法生成");
        }
        this.isLoading = true;
        await this.$vscPost("saveQueryPageFile", {
          queryBody: this.$refs["tpl-form-create"].getFormItem(),
          tableBody: this.$refs["tpl-table-create"].getFormItem(),
        });
        sayOpSuccess("生成成功!");
      } catch (error) {
        sayOpError(error.message);
      } finally {
        this.isLoading = false;
      }
    },
    // 生成接口泛型
    async handleCreatTypingFile() {
      try {
        this.isLoading = true;
        await this.$vscPost("saveTypingFile");
        sayOpSuccess("生成成功!");
      } catch (error) {
        sayOpError(error.message);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.app {
  display: flex;
  flex-direction: column;
  padding-top: 10px;
  & > * {
    margin-bottom: 10px;
  }
  .button-block {
    text-align: right;
  }
  .tpl-form-create {
    margin-bottom: 20px;
  }
  .path-block {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    color: #c0c4cc;
    & .el-button {
      margin-left: 10px;
    }
  }
}
</style>
