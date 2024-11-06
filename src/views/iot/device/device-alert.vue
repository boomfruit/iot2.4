<template>
  <div style="padding: 6px">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="$t('device.device-alert.309509-0')" prop="alertName">
        <el-input v-model="queryParams.alertName" :placeholder="$t('device.device-alert.309509-1')" clearable
          size="small" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('device.device-alert.309509-2')" prop="alertLevel">
        <el-select v-model="queryParams.alertLevel" :placeholder="$t('device.device-alert.309509-3')" clearable
          size="small">
          <el-option v-for="dict in dict.type.iot_alert_level" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('device.device-alert.309509-4')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="$t('device.device-alert.309509-5')" clearable
          size="small">
          <el-option v-for="dict in dict.type.iot_process_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{
          $t('device.device-alert.309509-6') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('device.device-alert.309509-7')
          }}</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="alertLogList" @selection-change="handleSelectionChange" border>
      <el-table-column :label="$t('device.device-alert.309509-0')" align="center" prop="alertName" />
      <el-table-column :label="$t('device.device-alert.309509-2')" align="center" prop="alertLevel" width="170">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_alert_level" :value="scope.row.alertLevel" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('device.device-alert.309509-8')" align="center" prop="createBy" width="170" />
      <el-table-column :label="$t('device.device-alert.309509-9')" align="center" prop="createTime" width="170">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('device.device-alert.309509-10')" align="left" header-align="center" prop="detail">
        <template slot-scope="scope">
          <div v-html="formatDetail(scope.row.detail)"></div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('device.device-alert.309509-11')" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_process_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('device.device-alert.309509-12')" align="center" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['iot:alertLog:edit']">{{ $t('device.device-alert.309509-13') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 添加或修改设备告警对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item :label="$t('device.device-alert.309509-14')" prop="remark">
          <el-input v-model="form.remark" type="textarea" :placeholder="$t('device.device-alert.309509-15')" rows="8" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">{{ $t('device.device-alert.309509-16') }}</el-button>
        <el-button @click="cancel">{{ $t('device.device-alert.309509-17') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addAlertLog, getAlertLog, listAlertLog, updateAlertLog } from '@/api/iot/alertLog';

export default {
  name: 'DeviceAlertLog',
  dicts: ['iot_alert_level', 'iot_process_status'],
  props: {
    device: {
      type: Object,
      default: null
    }
  },
  watch: {
    // 获取到父组件传递的device后，刷新列表
    device: function (newVal, oldVal) {
      this.deviceInfo = newVal;
      if (this.deviceInfo && this.deviceInfo.deviceId != 0) {
        this.queryParams.serialNumber = this.deviceInfo.serialNumber;
        this.getList();
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 设备告警表格数据
      alertLogList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        alertName: null,
        alertLevel: null,
        status: null,
        productId: null,
        productName: null,
        serialNumber: null,
        deviceName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        remark: [
          {
            required: true,
            message: this.$t('device.device-alert.309509-18'),
            trigger: 'blur',
          },
        ],
      },
    };
  },
  created() {
    this.queryParams.serialNumber = this.device.serialNumber;
    this.getList();
  },
  methods: {
    /** 查询设备告警列表 */
    getList() {
      this.loading = true;
      listAlertLog(this.queryParams).then((response) => {
        this.alertLogList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        alertLogId: null,
        alertName: null,
        alertLevel: null,
        status: null,
        productId: null,
        productName: null,
        deviceId: null,
        deviceName: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.alertLogId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const alertLogId = row.alertLogId || this.ids;
      getAlertLog(alertLogId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = this.$t('device.device-alert.309509-19');
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.alertLogId != null) {
            updateAlertLog(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t('device.device-alert.309509-20'));
              this.open = false;
              this.getList();
            });
          } else {
            addAlertLog(this.form).then((response) => {
              this.$modal.msgSuccess(this.$t('device.device-alert.309509-21'));
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /**格式化显示物模型**/
    formatDetail(json) {
      if (json == null || json == '') {
        return;
      }
      let item = JSON.parse(json);
      let result = 'id：<span style="color:#F56C6C">' + item.id + '</span><br />';
      result = result + 'value：<span style="color:#F56C6C">' + item.value + '</span><br />';
      result = result + 'remark：<span style="color:#F56C6C">' + item.remark + '</span>';
      return result;
    },
  },
};
</script>
