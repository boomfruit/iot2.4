<template>
  <div class="device-variable">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item :label="$t('device.variable-case.347856-0')" prop="type">
        <el-select v-model="queryParams.type" :placeholder="$t('device.variable-case.347856-1')">
          <el-option v-for="dict in dict.type.iot_things_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('device.variable-case.347856-2')" prop="modelName">
        <el-input v-model="queryParams.modelName" :placeholder="$t('device.variable-case.347856-3')" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{
          $t('device.variable-case.347856-4') }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">{{ $t('device.variable-case.347856-5')
          }}</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="activeCollectionAll">{{
          $t('device.variable-case.347856-16') }}</el-button>

      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="variableList" style="width: 100%; margin-top: 5px" :border="false">
      <el-table-column prop="identifier" :label="$t('device.variable-case.347856-6')" width="130"></el-table-column>
      <el-table-column prop="type" :label="$t('device.variable-case.347856-7')" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.iot_things_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column prop="modelName" :label="$t('device.variable-case.347856-8')"></el-table-column>
      <el-table-column prop="ts" :label="$t('device.variable-case.347856-9')"></el-table-column>
      <el-table-column prop="value" :label="$t('device.variable-case.347856-10')">
        <template slot-scope="scope">
          <span>
            {{ scope.row.valueName === '' || scope.row.valueName === null ? '-' : scope.row.valueName }} {{
              scope.row.unit }}
            <i v-if="scope.row.isReadonly === 0 && scope.row.type != 3" style="cursor: pointer; color: #1890ff"
              class="el-icon-edit" @click="editFunc(scope.row)"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('device.variable-case.347856-11')" align="center"
        class-name="small-padding fixed-width" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="activeCollection(scope.row)">{{
            $t('device.variable-case.347856-13') }}</el-button>
          <el-button size="mini" type="text" @click="handleQueryHistory(scope.row)">{{
            $t('device.variable-case.347856-12') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getVariableList" />

    <el-dialog :title="$t('device.variable-case.347856-15')" :visible.sync="centerDialogVisible" width="30%" center>
      <span>{{ $t('device.variable-case.347856-14') }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">{{ $t('iot.group.device-list.849593-12') }}</el-button>
        <el-button type="primary" @click="confirmCollection">{{ $t('iot.group.device-list.849593-11') }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="$t('device.realTime-status.099127-26')" :visible.sync="dialogValue" width="30%">
      <el-form size="mini" style="height: 100%; padding: 0 20px;">
        <el-form-item v-for="(item, index) in opationList" :label="`${item.label}：`" :key="index" label-width="180px">
          <el-input v-model="funVal[item.key]" :precision="0" :controls="false" @input="justNumber(item)" type="number"
            v-if="item.dataTypeName == 'integer' || item.dataTypeName == 'decimal' || (item.dataTypeName == 'array' && item.arrayType == 'integer') || (item.dataTypeName == 'array' && item.arrayType == 'decimal')"
            style="width:50%">
          </el-input>
          <el-input v-model="funVal[item.key]" :precision="0" :controls="false" placeholder="请输入内容" type="text"
            v-if="item.dataTypeName == 'string' || (item.dataTypeName == 'array' && item.arrayType == 'string')"
            style="width:50%" @input="justNumber(item)"></el-input>
          <el-select v-if="item.dataTypeName == 'enum' || item.dataTypeName == 'bool'" v-model="funVal[item.key]"
            @change="changeSelect()">
            <el-option v-for="option in item.options" :key="option.value" :label="option.label" :value="option.value">
            </el-option>
          </el-select>
          <span
            v-if="(item.dataTypeName == 'integer' || item.dataTypeName == 'decimal' || (item.dataTypeName == 'array' && item.arrayType == 'integer') || (item.dataTypeName == 'array' && item.arrayType == 'decimal')) && item.unit && item.unit != 'un' && item.unit != '/'">({{
              item.unit
            }})</span>
          <span class="range"
            v-if="item.dataTypeName == 'integer' || item.dataTypeName == 'decimal' || (item.dataTypeName == 'array' && item.arrayType == 'integer') || (item.dataTypeName == 'array' && item.arrayType == 'decimal')">
            ({{ item.min }} ~ {{ item.max }})
          </span>
        </el-form-item>
        <el-form-item style="display: none">
          <el-input v-model="functionName">
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogValue = false">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="sendService" :loading="btnLoading" :disabled="!canSend">{{ $t('confirm')
          }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment';
import { listThingsModel } from '@/api/iot/device';
import { serviceInvokeReply } from '@/api/iot/runstatus.js';
import { propGet } from "@/api/iot/runstatus";
import { getOrderControl } from "@/api/iot/control";


export default {
  name: 'DeviceVariable',
  dicts: ['iot_things_type'],
  props: {
    device: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      queryParams: {
        deviceId: null,
        type: null,
        modelName: '',
        pageNum: 1,
        pageSize: 10,
      },
      dialogValue: false,
      centerDialogVisible: false,
      form: {},
      canSend: false,//是否可以下发，主要判断数值在不在范围
      btnLoading: false,
      funVal: {},
      chooseFun: {},
      //下发的设备
      serialNumber: '',
      opationList: [],
      functionName: '',
      variableList: [],
      total: 0, // 总条数
    };
  },
  watch: {
    device: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.deviceId && newVal.deviceId !== oldVal.deviceId) {
          this.queryParams.deviceId = newVal.deviceId;
          this.getVariableList();
          // this.initData();
        }
      },
    },
  },
  mounted() {
    const { deviceId, serialNumber } = this.device;
    if (deviceId) {
      this.queryParams.deviceId = deviceId;
      this.serialNumber = serialNumber;
      this.getVariableList();
    }
    this.initData();
  },
  methods: {
    initData() {
      // 监听值的实时更新
      this.$busEvent.$on('updateData', (params) => {
        this.updateParam(params);
      });
    },
    // 获取变量情况列表
    getVariableList() {
      this.loading = true;
      listThingsModel(this.queryParams).then((res) => {
        if (res.code === 200) {
          this.variableList = res.rows.map(item => {
            return {
              ...item,
              valueName: this.getValueName(item),
              dataTypeName: item.datatype.type || ''
            }
          })
          // this.variableList = res.rows;
          this.total = res.total;
        }
        this.loading = false;
      });
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getVariableList();
    },
    // 重置按钮操作
    handleResetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    //指令下发
    async editFunc(item) {
      //判断是否有权限
      const params = {
        deviceId: this.device.deviceId,
        modelId: item.modelId
      }
      const response = await getOrderControl(params)
      if (response.code != 200) {
        this.$message({
          type: 'warning',
          message: response.msg,
        });
        return;
      }
      //这里兼容子设备的下发，在网关设备下发的时候选择实际子设备的编号
      this.serialNumber = item.serialNumber;
      let title = '';
      if (this.device.status !== 3 && this.device.isShadow !== 1) {
        if (this.device.status === 1) {
          title = this.$t('device.device-variable.930930-0');
        } else if (this.device.status === 2) {
          title = this.$t('device.device-variable.930930-1');
        } else {
          title = this.$t('device.device-variable.930930-2');
        }
        this.$message({
          type: 'warning',
          message: title,
        });
        return;
      }
      this.dialogValue = true
      this.canSend = true
      this.funVal = {}
      this.chooseFun = item
      this.getOpationList(item)
    },

    // 封装操作列表
    getOpationList(item) {
      this.opationList = []
      let options = []
      this.funVal = {}
      const datatype = item.datatype;
      if (datatype.type == 'enum') {
        options = datatype.enumList?.map(option => {
          return {
            label: option.text,
            value: option.value + ''
          }
        }) || []
      }
      if (datatype.type == 'bool') {

        options = [{
          label: datatype.falseText || '',
          value: '0'
        }, {
          label: datatype.trueText || '',
          value: '1'
        }]
      }
      this.opationList.push({
        dataTypeName: datatype.type,
        arrayType: datatype.arrayType,
        label: item.modelName,
        key: item.identifier,
        max: parseInt(datatype?.max || 100),
        min: parseInt(datatype?.min || -100),
        options: options,
        value: item.value
      })
      this.opationList.forEach(item => {
        let value = item.value
        if (item.datatype == 'integer' || item.datatype == 'decimal' || (item.dataTypeName == 'array' && item.arrayType == 'integer') || (item.dataTypeName == 'array' && item.arrayType == 'decimal')) {
          value = parseInt(value)
        }
        this.funVal[item.key] = value
      })
    },

    // 发送指令
    async sendService() {
      try {
        let params = this.funVal
        const pas = {
          serialNumber: this.serialNumber,
          identifier: this.chooseFun.identifier,
          remoteCommand: params
        }
        this.btnLoading = true
        const res = await serviceInvokeReply(pas)
        if (res.code == 200) {
          this.$message.success(this.$t('device.device-variable.930930-3'))
        } else {
          this.$message.error(res.data)
        }
      } finally {
        this.btnLoading = false
        this.dialogValue = false
      }
    },

    //下拉选择修改触发
    changeSelect() {
      this.$forceUpdate()
    },

    //判断输入是否超过范围
    justNumber(val) {
      this.canSend = true
      this.opationList.some(item => {
        if (item.max < this.funVal[item.key] || item.min > this.funVal[item.key]) {
          this.canSend = false
          return true
        }
      })
      this.$forceUpdate()
    },
    // 编辑变量值
    handleEditVariable(item) {

      this.$prompt(this.$t('device.device-variable.930930-4'), this.$t('device.device-variable.930930-5'), {
        confirmButtonText: this.$t('device.device-variable.930930-6'),
        cancelButtonText: this.$t('device.device-variable.930930-7'),
        inputPattern: /\S/,
        inputErrorMessage: this.$t('device.device-variable.930930-8'),
        inputPlaceholder: item.value,
      }).then(({ value }) => {
        if (this.device.status !== 3 && this.device.isShadow !== 1) {
          let title = '';
          if (this.device.status === 1) {
            title = this.$t('device.device-variable.930930-9');
          } else if (this.device.status === 2) {
            title = this.$t('device.device-variable.930930-10');
          } else {
            title = this.$t('device.device-variable.930930-11');
          }
          this.$message({
            type: 'warning',
            message: title,
          });
          return;
        }
        const command = {};
        command[item.identifier] = value;
        const data = {
          serialNumber: item.serialNumber,
          remoteCommand: command,
          identifier: item.identifier,
          isShadow: this.device.status != 3,
        };
        serviceInvokeReply(data).then((res) => {
          if (res.code === 200) {
            item.ts = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            item.value = value;
          } else if (res.code === 204) {
            this.$message({
              type: 'warning',
              message: res.msg,
            });
          }
        });
      });
    },

    // 查询历史数据
    handleQueryHistory(item) {
      this.$router.push({
        path: '/dataCenter/history',
        query: {
          deviceId: this.device.deviceId,
          identifier: item.identifier,
          activeName: 'device',
        },
      });
    },
    //更新参数值
    updateParam(params) {
      let { serialNumber, productId, data } = params;
      if (data) {
        data = data.message;
        data.forEach((msg) => {
          this.variableList.some((item, index) => {
            if (msg.id === item.identifier) {
              const variable = this.variableList[index];
              variable.ts = msg.ts;
              variable.value = msg.value;
              variable.valueName = this.getValueName(item)
              this.$set(this.variableList, index, variable);
              return true;
            }
          });
        });
      }
    },
    getValueName(item) {
      //返回的数据
      let res = item.value || '-';
      //需要解析的类型
      const optionsType = ['bool', 'enum'];
      //如果有datatype并且需要解析就遍历解析
      if (item.datatype) {
        switch (item.datatype.type) {
          case 'bool':
            if (0 == item.value) res = item.datatype.falseText;
            if (1 == item.value) res = item.datatype.trueText;
            break;
          case 'enum':
            item.datatype.enumList?.some((enumOpt) => {
              if (enumOpt.value == item.value) {
                res = enumOpt.text;
                return true;
              }
            });
            break;
        }
      }
      return res;
    },
    //主动采集数据
    activeCollection(item) {
      this.centerDialogVisible = true;
      this.form.serialNumber = item.serialNumber;
      this.form.type = 1;
      this.form.identifier = item.identifier;
    },
    //确认采集
    confirmCollection() {
      propGet(this.form).then(response => {
        if (response.code == 200) {
          this.centerDialogVisible = false;
        }
      })
    },
    //采集所有
    activeCollectionAll() {
      this.centerDialogVisible = true;
      this.form.serialNumber = this.serialNumber;
      this.form.type = 2;
    }
  },
};
</script>

<style lang="scss" scoped>
.device-variable {
  width: 100%;
  padding: 5px 5px 10px 20px;
}
</style>
