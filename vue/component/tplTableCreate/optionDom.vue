/**
 * @Author: Sun Rising 
 * @Date: 2019-12-03 13:11:40 
 * @Last Modified by: Sun Rising
 * @Last Modified time: 2021-01-25 14:09:21
 * @Description: 动态组件配置
 */
<template>
  <div v-if="value" class="option-dom">
    <el-form ref="form" :model="value" label-width="100px">
      <el-form-item label="标题">
        <el-input v-model="value.label"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="value.desc"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "optionDom",
  props: {
    value: {
      type: Object,
      default: function () {
        return null;
      },
    },
  },
  data() {
    return {
      // 子类型复选框
      childTypeOption: [],
    };
  },
  created() {
    this.doInit();
  },
  watch: {
    "value.domType": function () {
      this.doInit();
      if (this.childTypeOption.length > 0) {
        let currChildType = this.childTypeOption.find((v) => v.key === this.value.childType);
        if (!currChildType) this.$set(this.value, "childType", this.childTypeOption[0].key);
      }
    },
  },
  methods: {
    // 初始化数据
    doInit() {
      // 创建子类型
      let t_childTypeOption = [];
      if (this.value.domType === "input") {
        t_childTypeOption = [
          {
            key: "text",
            label: "text",
          },
          {
            key: "textarea",
            label: "textarea",
          },
        ];
      } else if (this.value.domType === "timePicker") {
        t_childTypeOption = [
          {
            key: "isRange[false]",
            label: "isRange[false]",
          },
          {
            key: "isRange[true]",
            label: "isRange[true]",
          },
        ];
      } else if (this.value.domType === "datePicker") {
        t_childTypeOption = [
          {
            key: "date",
            label: "date",
          },
          {
            key: "week",
            label: "week",
          },
          {
            key: "month",
            label: "month",
          },
          {
            key: "year",
            label: "year",
          },
          {
            key: "dates",
            label: "dates",
          },
          {
            key: "daterange",
            label: "daterange",
          },
          {
            key: "monthrange",
            label: "monthrange",
          },
          {
            key: "datetime",
            label: "datetime",
          },
          {
            key: "datetimerange",
            label: "datetimerange",
          },
        ];
      }
      this.$set(this, "childTypeOption", t_childTypeOption);
      // 创建必要字段childType
      if (this.value.domType === "input" || this.value.domType === "timePicker" || this.value.domType === "datePicker") {
        if (!this.value.hasOwnProperty("childType")) this.$set(this.value, "childType", this.childTypeOption[0].key);
      } else {
        this.$delete(this.value, "childType");
      }
      // 创建必要字段 slotName
      if (this.value.domType === "radio" || this.value.domType === "checkbox" || this.value.domType === "select") {
        if (!this.value.hasOwnProperty("slotName")) this.$set(this.value, "slotName", "");
      } else {
        this.$delete(this.value, "slotName");
      }
    },
  },
};
</script>
<style lang="scss">
.option-dom {
  padding: 20px;
}
</style>