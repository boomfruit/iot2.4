<template>
  <div style="margin-top:-50px;">
    <el-divider></el-divider>
    <el-form :model="queryParams" ref="product-select-template" :inline="true" label-width="48px">
      <el-form-item :label="$t('product.product-select-template.318012-0')" prop="templateName">
        <el-input v-model="queryParams.templateName" :placeholder="$t('product.product-select-template.318012-1')"
          clearable size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('product.product-select-template.318012-2')" prop="type">
        <el-select v-model="queryParams.type" :placeholder="$t('product.product-select-template.318012-3')" clearable
          size="small">
          <el-option v-for="dict in dict.type.iot_things_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{
          $t('product.product-select-template.318012-4') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{
          $t('product.product-select-template.318012-5') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="templateList" @selection-change="handleSelectionChange"
      ref="selectTemplateTable" size="small">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('product.product-select-template.318012-0')" align="center" prop="templateName" />
      <el-table-column :label="$t('product.product-select-template.318012-6')" align="center" prop="identifier" />
      <el-table-column :label="$t('product.product-select-template.318012-7')" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_things_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-things-model.142341-12')" align="center" prop="isChart" width="75">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isChart" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-select-template.318012-9')" align="center" prop="isMonitor"
        width="75">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isMonitor" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-select-template.318012-10')" align="center" prop="isReadonly"
        width="75">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isReadonly" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-select-template.318012-11')" align="center" prop="isHistory"
        width="75">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_yes_no" :value="scope.row.isHistory" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('product.product-select-template.318012-12')" align="center" prop="datatype">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_data_type" :value="scope.row.datatype" />
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
  </div>
</template>

<script>
import {
  listTemplate,
} from "@/api/iot/template";
export default {
  name: "product-select-template",
  dicts: ["iot_things_type", "iot_data_type", "iot_yes_no"],
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 通用物模型表格数据
      templateList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        templateName: null,
        type: null,
      },
    };
  },
  created() {
    this.getList();
    this.ids = [];
  },
  methods: {
    /** 查询通用物模型列表 */
    getList() {
      this.loading = true;
      listTemplate(this.queryParams).then((response) => {
        this.templateList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.templateId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      // Id数组传递到父组件
      this.$emit('idsToParentEvent', this.ids)
    },

  },
};
</script>
