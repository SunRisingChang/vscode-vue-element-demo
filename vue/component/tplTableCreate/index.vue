/**
 * @Author: Sun Rising
 * @Date: 2019-12-03 10:53:44
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-01-25 14:08:11
 * @Description: 模板表单Json生成工具
 */
<template>
  <div class="tpl-form-create">
    <el-form label-width="80px">
      <el-table class="ws-create-table" row-key="key" ref="table" border :data="formJsonArray" @selection-change="doSelectionChange">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column label="标题" prop="label" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="Key" prop="key" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="描述" prop="desc" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="80" align="center" size="mini">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <!-- dom配置层 -->
    <el-drawer title="Table Cell 配置" :visible.sync="isDrawerShow" append-to-body size="300">
      <option-dom v-if="isDrawerShow" v-model="currEditDOM"></option-dom>
    </el-drawer>
  </div>
</template>

<script>
import OptionDom from "./optionDom";
import Sortable from "sortablejs";
import UUID from "uuid/v4";

// 默认DOM结构
const defaultDOM = {
  /**
   * 可选类型
   * input
   * time
   * select
   * radio
   * checkbox
   */
  domType: "input",
  // input标题
  label: "标题",
  // DOM的v-model
  key: "key",
  // 是否为空
  notNull: false,
  // 是否禁用
  disabled: false,
  // 是否显示
  showable: true,
  // 别名,如果传入会覆盖label属性
  alias: null,
  // 检验规则
  rule: null,
  // 最大长度
  maxlength: 255,
  // 显隐控制函数,类型字符串 ['true'|'false'|函数名]
  showFunName: "true",
  // 是否反显组件
  readonly: false,
  // ------  备用字段 --------
  // ID
  id: "snap",
  // 绑定字段
  bindingField: "snap",
  // 是否是默认必选项
  defaultRequired: false,
  // 是否参与输出
  exportable: true,
  // 表单ID
  formId: "snap",
};

export default {
  name: "TplTableCreate",
  components: {
    OptionDom,
  },
  props: {
    // 初始化
    initFormItem: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      // 编辑层开关
      isDrawerShow: false,
      // 表单Json
      formJsonArray: [],
      // 编辑的Dom
      currEditDOM: null,
      // 是否进行table复选的监听
      watchTableSelect: true,
      // json显示层
      jsonVisible: false,
      // 表单显示层
      formVisible: false,
      // 用于反显的form
      previewForm: {},
    };
  },
  watch: {
    initFormItem: {
      handler(newValue) {
        this.$set(this, "formJsonArray", newValue);
        this.doRowDrop();
        this.initTableSelect();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    // 行拖拽
    doRowDrop() {
      const tbody = document.querySelector(".ws-create-table .el-table__body-wrapper tbody");
      if (tbody) {
        const _this = this;
        Sortable.create(tbody, {
          ghostClass: "blue-background-class",
          onEnd({ newIndex, oldIndex }) {
            const currRow = _this.formJsonArray.splice(oldIndex, 1)[0];
            _this.formJsonArray.splice(newIndex, 0, currRow);
          },
        });
      }
    },
    // 编辑dom
    handleEdit(row) {
      this.isDrawerShow = true;
      this.currEditDOM = row;
    },
    // 添加dom
    handleAdd() {
      const t = Object.assign({}, defaultDOM, {
        key: "key" + UUID(),
      });
      this.formJsonArray.push(t);
      this.$refs["table"].toggleRowSelection(t, true);
    },
    // 批量显隐
    doSelectionChange(rows) {
      if (this.watchTableSelect) {
        this.formJsonArray.forEach((value) => {
          value.showable = false;
        });
        rows.forEach((value) => {
          value.showable = true;
        });
      }
    },
    // 初始化列选择
    initTableSelect() {
      this.watchTableSelect = false;
      this.formJsonArray.forEach((value) => {
        if (value.showable) {
          this.$nextTick(() => {
            this.$refs["table"].toggleRowSelection(value, true);
          });
        }
      });
      this.watchTableSelect = true;
    },
    // 获取结构
    getFormItem() {
      return this.formJsonArray;
    },
  },
};
</script>

<style lang="scss" scoped>
.tpl-form-create {
  width: 100%;
}
</style>
