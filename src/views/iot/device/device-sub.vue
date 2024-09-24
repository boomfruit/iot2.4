<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button plain type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">{{ $t('device.sub.083943-0')
          }}</el-button>
      </el-form-item>
      <el-form-item v-if="this.ids.length > 0">
        <el-button plain type="danger" icon="el-icon-delete" size="mini" @click="handleDelete">{{
          $t('device.sub.083943-1') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('refresh') }}</el-button>
        <span style="font-size: 12px">{{ $t('device.device-sub.299018-28') }}</span>
      </el-form-item>
      <el-form-item v-if="!isSet" style="float: right">
        <el-button plain type="primary" icon="el-icon-edit" size="mini" @click="setSubDeviceAddress">{{
          $t('device.sub.083943-2') }}</el-button>
      </el-form-item>
      <el-form-item v-if="isSet" style="float: right">
        <el-button plain type="primary" icon="el-icon-edit" size="mini" @click="saveSetting">{{ $t('save')
          }}</el-button>
      </el-form-item>
      <el-form-item v-if="isSet" style="float: right">
        <el-button plain type="info" icon="el-icon-edit" size="mini" @click="cancelSetting">{{ $t('cancel')
          }}</el-button>
      </el-form-item>

    </el-form>

    <el-table v-loading="loading" :data="deviceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="$t('device.device-edit.148398-1')" align="center" prop="subDeviceName" />
      <el-table-column :label="$t('device.device-edit.148398-7')" align="center" prop="subDeviceNo" />
      <el-table-column :label="$t('device.sub.083943-3')" align="center" prop="slaveId" width="180px">
        <template slot-scope="scope">
          <el-input style="width: 120px; text-align: center" :disabled="!isSet" v-model="scope.row.slaveId" size="small"
            :placeholder="$t('device.sub.083943-2')"></el-input>
        </template>
      </el-table-column>
      <!--            <el-table-column label="在线状态" align="center" prop="status">-->
      <!--                <template slot-scope="scope">-->
      <!--                    <dict-tag :options="dict.type.iot_device_status" :value="scope.row.status" />-->
      <!--                </template>-->
      <!--            </el-table-column>-->
      <el-table-column :label="$t('creatTime')" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 子设备列表 -->
    <subDeviceList ref="subDeviceList" :gateway="gateway" @addSuccess="addSuccess"></subDeviceList>
  </div>
</template>

<script>

import { listGateway, delGateway, editGatewayBatch } from "@/api/iot/gateway";

import subDeviceList from './sub-device-list'

export default {
  name: "device-sub",
  props: {
    device: {
      type: Object,
      default: null,
    },
  },
  components: {
    subDeviceList,
  },
  dicts: ['iot_device_status'],
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
      // 设备表格数据
      deviceList: [],
      deviceInfo: {},
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      gateway: {},
      //是否可设置子设备地址
      isSet: false,
    };
  },

  watch: {
    device: {
      handler(newVal) {
        this.deviceInfo = newVal;
        if (this.deviceInfo && this.deviceInfo.deviceId != 0) {
          this.gateway.gwDeviceId = this.deviceInfo.deviceId;
          this.queryParams.gwDeviceId = this.deviceInfo.deviceId;
          this.getList();
        }
      }
    },
  },

  methods: {
    /** 查询子设备列表 */
    getList() {
      // this.loading = true;
      listGateway(this.queryParams).then(response => {
        this.deviceList = response.rows;
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
        id: null,
        gwDeviceId: null,
        subDeviceId: null,
        slaveId: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    /** 新增按钮操作 */
    handleAdd() {
      //刷新子组件
      this.$refs.subDeviceList.openDeviceList = true;
      this.$refs.subDeviceList.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const deviceIds = row.deviceId || this.ids;
      this.$modal.confirm(this.$t('device.device-sub.299018-26', [deviceIds])).then(function () {
        return delGateway(deviceIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess(this.$t('device.device-sub.299018-27'));
      }).catch(() => { });
    },
    /**设置子设备地址*/
    setSubDeviceAddress() {
      this.isSet = !this.isSet;

    },
    /**保存子设备地址设置*/
    saveSetting() {
      this.isSet = !this.isSet;
      editGatewayBatch(this.deviceList).then(response => {
        this.getList();
        this.$modal.msgSuccess(this.$t('saveSuccess'));
      })
    },
    cancelSetting() {
      this.isSet = !this.isSet;
    },
    /**添加成功 */
    addSuccess() {
      this.getList()
    }
  }
};
</script>
