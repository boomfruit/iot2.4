<template>
  <el-dialog :title="$t('device.sub-device-list.323213-0')" :visible.sync="openDeviceList" width="800px" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item :label="$t('device.index.105953-20')" prop="serialNumber">
        <el-input v-model="queryParams.serialNumber" :placeholder="$t('device.sub-device-list.323213-1')" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item :label="$t('device.sub-device-list.323213-2')" prop="deviceName">
        <el-input v-model="queryParams.deviceName" :placeholder="$t('device.sub-device-list.323213-3')" clearable
          @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item style="float: right">
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('refresh') }}</el-button>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
      </el-form-item>
    </el-form>


    <el-table v-loading="loading" :data="gatewayList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="deviceId" />
      <el-table-column :label="$t('device.device-edit.148398-7')" align="center" prop="serialNumber" />
      <el-table-column :label="$t('device.device-edit.148398-1')" align="center" prop="deviceName" />
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleDeviceSelected">{{ $t('confirm') }}</el-button>
      <el-button @click="closeSelectDeviceList">{{ $t('cancel') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listSubGateway, addGatewayBatch } from "@/api/iot/gateway";

export default {
  name: "sub-device-list",
  props: {
    gateway: {
      type: Object,
      default: null
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
      // 网关与子设备关联表格数据
      gatewayList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openDeviceList: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        deviceName: null,
        serialNumber: null
      },
      // 表单参数
      form: {},
      // 表单校验
    };
  },
  created() {
  },

  watch: {
    gateway: {
      handler() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      immediate: true
    }
  },
  methods: {
    /** 查询网关与子设备关联列表 */
    getList() {
      this.loading = true;
      listSubGateway(this.queryParams).then(response => {
        this.gatewayList = response.rows;
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
        deviceId: null,
        deviceName: null,
        serialNumber: null
      };
      this.resetForm("form");
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
      this.ids = selection.map(item => item.deviceId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    // 关闭选择设备列表
    closeSelectDeviceList() {
      this.openDeviceList = false;
    },
    // 批量新增子设备
    handleDeviceSelected() {
      this.gateway.subDeviceIds = this.ids;
      addGatewayBatch(this.gateway).then(response => {
        this.$modal.msgSuccess(this.$t('device.sub-device-list.323213-4'));
        this.openDeviceList = false;
        this.$emit('addSuccess')
      })
    }

  }
};
</script>
