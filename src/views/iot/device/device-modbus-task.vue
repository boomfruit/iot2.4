<template>
    <div class="instruction-parsing">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
            <el-form-item :label="$t('device.device-modbus-task.384302-0')" prop="jobName">
                <el-input v-model="queryParams.jobName" :placeholder="$t('device.device-modbus-task.384302-1')" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('device.device-modbus-task.384302-2')" prop="status">
                <el-select v-model="queryParams.status" :placeholder="$t('device.device-modbus-task.384302-3')" clearable size="small">
                    <el-option v-for="dict in dict.type.sys_job_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('device.device-modbus-task.384302-4') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('device.device-modbus-task.384302-5') }}</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="openEdit">{{ $t('device.device-modbus.433390-1') }}</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="jobList">
            <el-table-column :label="$t('device.device-modbus-task.384302-56')" align="center" prop="taskId" />
            <el-table-column :label="$t('device.device-timer.433369-7')" align="center" prop="jobName" />
            <el-table-column :label="$t('device.device-modbus-task.384302-57')" align="center" prop="command" />
            <el-table-column :label="$t('device.device-modbus-task.384302-58')" align="center" prop="status">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" :active-text="$t('device.device-timer.433369-12')" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column :label="$t('device.device-modbus-task.384302-59')" align="center" prop="remark">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.variable_operation_interval" :value="scope.row.remark" />
                </template>
            </el-table-column>
            <el-table-column :label="$t('device.device-modbus-task.384302-60')" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['modbus:job:remove']">{{ $t('device.device-modbus-task.384302-61') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <el-dialog :title="editName ? $t('device.device-modbus-task.384302-12') : $t('device.device-modbus-task.384302-13')" :visible.sync="editDialog" :width="editName ? '30%' : '40%'">
            <div class="dialog-content beautify-scroll-def">
                <el-form :model="createForm" label-position="top">
                    <el-form-item :label="$t('device.device-modbus-task.384302-0')" prop="jobName">
                        <el-input v-model="createForm.jobName" :placeholder="$t('device.device-modbus-task.384302-1')" style="width: 280px" />
                    </el-form-item>
                    <el-row :gutter="40">
                        <!-- 从机地址 -->
                        <el-col :span="12">
                            <el-form-item :label="$t('device.device-modbus-task.384302-14')" prop="path">
                                <el-input v-model="createForm.path"></el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 功能码 -->
                        <el-col :span="12">
                            <el-form-item :label="$t('device.device-modbus-task.384302-15')" prop="functionCode">
                                <el-select v-model="createForm.functionCode" @change="changeNum">
                                    <el-option :label="functionCode.label" :value="functionCode.value" v-for="functionCode in functionCodeList" :key="functionCode.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <!--起始寄存器地址-->
                        <el-col :span="12">
                            <el-form-item prop="startPath">
                                <div slot="label" class="form-item-label">
                                    <div style="margin-right: auto">{{ $t('device.device-modbus-task.384302-16') }}</div>
                                    <el-tooltip :content="createForm.startPathSwitch" placement="top">
                                        <el-switch v-model="createForm.startPathSwitch" size="mini" active-color="#13ce66" inactive-color="#ff4949" active-value="Dec" inactive-value="Hex" />
                                    </el-tooltip>
                                </div>
                                <el-input
                                    v-model="createForm.startPath"
                                    type="number"
                                    v-show="createForm.startPathSwitch == 'Dec'"
                                    :min="0"
                                    @change="
                                        () => {
                                            createForm.startPath16 = int2hex(createForm.startPath);
                                        }
                                    "
                                    @input="
                                        () => {
                                            createForm.startPath16 = int2hex(createForm.startPath);
                                        }
                                    "
                                >
                                    <div slot="append">0x{{ createForm.startPath16 }}</div>
                                </el-input>
                                <el-input
                                    v-model="createForm.startPath16"
                                    v-show="createForm.startPathSwitch != 'Dec'"
                                    @input="
                                        () => {
                                            createForm.startPath = hex2int(createForm.startPath16);
                                        }
                                    "
                                >
                                    <div slot="append">{{ createForm.startPath }}</div>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 个数或写值 -->
                        <el-col :span="12">
                            <!-- 个数 -->
                            <el-form-item :label="registerNumTitle" prop="registerNum" v-show="!['05', '06'].includes(createForm.functionCode)">
                                <el-input-number v-model="createForm.registerNum" controls-position="right" :min="0" @change="changeNum" />
                            </el-form-item>
                            <!-- 写值 -->
                            <el-form-item prop="setValue" v-show="['05', '06'].includes(createForm.functionCode)">
                                <div slot="label" class="form-item-label">
                                    <div style="margin-right: auto">{{ registerNumTitle }}</div>
                                    <el-tooltip :content="createForm.setValueSwitch" placement="top">
                                        <el-switch v-model="createForm.setValueSwitch" size="mini" active-color="#13ce66" inactive-color="#ff4949" active-value="Dec" inactive-value="Hex" />
                                    </el-tooltip>
                                </div>
                                <el-input
                                    v-model="createForm.setValue"
                                    type="number"
                                    v-show="createForm.setValueSwitch == 'Dec'"
                                    @change="
                                        () => {
                                            createForm.setValue16 = int2hex(createForm.setValue);
                                        }
                                    "
                                    @input="
                                        () => {
                                            createForm.setValue16 = int2hex(createForm.setValue);
                                        }
                                    "
                                >
                                    <div slot="append">0x{{ createForm.setValue16 }}</div>
                                </el-input>
                                <el-input
                                    v-model="createForm.setValue16"
                                    v-show="createForm.setValueSwitch != 'Dec'"
                                    @input="
                                        () => {
                                            createForm.setValue = hex2int(createForm.setValue16);
                                        }
                                    "
                                >
                                    <div slot="append">{{ createForm.setValue }}</div>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 批量写寄存器值  -->
                        <el-col :span="12" v-for="(item, index) in registerValList" :key="'register' + index" v-show="createForm.functionCode == '16'">
                            <el-form-item prop="registerValList">
                                <div slot="label" class="form-item-label">
                                    <div style="margin-right: auto">#{{ index }} {{ $t('device.device-modbus-task.384302-17') }}</div>
                                    <el-tooltip :content="item.switch" placement="top">
                                        <el-switch
                                            v-model="item.switch"
                                            size="mini"
                                            active-color="#13ce66"
                                            @change="
                                                () => {
                                                    refreshRegisterInpust(item, index);
                                                }
                                            "
                                            inactive-color="#ff4949"
                                            active-value="Dec"
                                            inactive-value="Hex"
                                        />
                                    </el-tooltip>
                                </div>
                                <el-input
                                    v-model="item.value"
                                    type="number"
                                    v-show="item.switch == 'Dec'"
                                    :min="0"
                                    @change="
                                        () => {
                                            item.value16 = int2hex(item.value);
                                            refreshRegisterInpust(item, index);
                                        }
                                    "
                                    @input="
                                        () => {
                                            item.value16 = int2hex(item.value);
                                            refreshRegisterInpust(item, index);
                                        }
                                    "
                                >
                                    <div slot="append">0x{{ item.value16 }}</div>
                                </el-input>
                                <el-input
                                    v-model="item.value16"
                                    v-show="item.switch != 'Dec'"
                                    @input="
                                        () => {
                                            item.value = hex2int(item.value16);
                                            refreshRegisterInpust(item, index);
                                        }
                                    "
                                >
                                    <div slot="append">{{ item.value }}</div>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <!-- 批量写线圈值  -->
                        <el-col :span="6" v-for="(item, index) in IOValList" :key="'IO' + index" v-show="createForm.functionCode == '15'">
                            <el-form-item prop="registerValList">
                                <div slot="label" class="form-item-label">
                                    <div style="margin-right: auto">#{{ index }} {{ $t('device.device-modbus-task.384302-18') }}</div>
                                </div>
                                <el-switch
                                    v-model="item.value"
                                    active-value="1"
                                    inactive-value="0"
                                    @change="
                                        () => {
                                            refreshIOInpust(item, index);
                                        }
                                    "
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!-- 任务状态-->
                    <el-form-item :label="$t('device.device-timer.433369-2')" prop="status">
                        <el-radio-group v-model="createForm.status">
                            <el-radio v-for="dict in dict.type.sys_job_status" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 时间周期-->
                    <el-form-item :label="$t('device.device-modbus-task.384302-19')" prop="cycleType">
                        <div class="timer-wrap">
                            <el-radio-group v-model="createForm.cycleType" @input="handleCycleTypeInput">
                                <el-radio :label="1" style="display: block">
                                    {{ $t('device.device-modbus-task.384302-20') }}
                                    <el-tooltip placement="right">
                                        <div slot="content">
                                            {{ $t('device.device-modbus-task.384302-21') }}
                                            <br />
                                            {{ $t('device.device-modbus-task.384302-22') }}
                                        </div>
                                        <i class="el-icon-question" style="color: #909399"></i>
                                    </el-tooltip>
                                    <div class="timer-period">
                                        <span>{{ $t('device.device-modbus-task.384302-23') }}</span>
                                        <el-select style="width: 100px; margin-left: 10px" v-model="cycles1[0].interval" size="mini" :disabled="createForm.cycleType === 2" @change="handleCycleInterval">
                                            <el-option v-for="dict in dict.type.variable_operation_interval" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                        </el-select>
                                        <el-select v-if="cycles1[0].interval === 'week'" style="width: 100px; margin-left: 5px" v-model="cycles1[0].week" size="mini" :disabled="createForm.cycleType === 2">
                                            <el-option v-for="dict in dict.type.variable_operation_week" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                        </el-select>
                                        <el-select v-if="cycles1[0].interval === 'month'" style="width: 100px; margin-left: 5px" v-model="cycles1[0].day" size="mini" :disabled="createForm.cycleType === 2">
                                            <el-option v-for="dict in dict.type.variable_operation_day" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                        </el-select>
                                        <el-select
                                            v-if="cycles1[0].interval === 'day' || cycles1[0].interval === 'week' || cycles1[0].interval === 'month'"
                                            style="width: 100px; margin-left: 5px"
                                            v-model="cycles1[0].time"
                                            size="mini"
                                            :disabled="createForm.cycleType === 2"
                                            @change="handleCycleTime"
                                        >
                                            <el-option v-for="dict in dict.type.variable_operation_time" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                        </el-select>
                                        <span style="margin-left: 10px">{{ $t('device.device-modbus-task.384302-24') }}</span>
                                    </div>
                                </el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item>
                </el-form>
                <div v-loading="createLoading">
                    <div class="create-title">
                        <el-button type="text" @click.stop="encode">{{ $t('device.device-modbus-task.384302-25') }}</el-button>
                        <div class="title-right">
                            <el-button type="primary" size="mini" @click="copyText(createCode)">{{ $t('device.device-modbus-task.384302-26') }}</el-button>
                        </div>
                    </div>
                    <div class="create-code">{{ createCode }}</div>
                </div>
            </div>
            <div slot="footer" class="dialog-btn">
                <el-button type="" size="mini" @click="editDialog = false">{{ $t('device.device-modbus-task.384302-27') }}</el-button>
                <el-button type="primary" size="mini" @click="handleAdd">{{ $t('confirm') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { hex2int, int2hex, copyText } from '@/utils/common';
import { encode } from '@/api/iot/mqttTest';
import { listJob, getJob, delJob, addJob, updateJob } from '@/api/iot/modbusJob';
export default {
    name: 'device-modbus-task',
    dicts: ['sys_job_group', 'sys_job_status', 'variable_operation_interval', 'variable_operation_time', 'variable_operation_week', 'variable_operation_day', 'variable_operation_type'],
    props: {
        device: {
            type: Object,
            default: null,
        },
    },
    watch: {
        device: {
            handler(newVal, oldVal) {
                if (newVal.deviceId && newVal.deviceId !== oldVal.deviceId) {
                    this.queryParams.subDeviceId = newVal.deviceId;
                    this.deviceInfo = newVal;
                    this.getList();
                }
            },
        },
    },

    computed: {
        /**编辑寄存器个数显示的标题 */
        registerNumTitle() {
            switch (this.createForm.functionCode) {
                case '01':
                case '02':
                case '15':
                    return this.$t('device.device-modbus-task.384302-29');
                case '03':
                case '04':
                case '16':
                    return this.$t('device.device-modbus-task.384302-30');
                case '05':
                    return this.$t('device.device-modbus-task.384302-31');
                case '06':
                    return this.$t('device.device-modbus-task.384302-32');
            }
        },
    },
    data() {
        return {
            //选中的格式
            format: 'Hex',
            // 遮罩层
            loading: false,

            //编辑框
            editDialog: false,
            //生成表单
            createForm: {
                cycleType: 1, // 1周期,2自定义
                status: '0',
            },
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            //功能码列表
            functionCodeList: [
                {
                    label: this.$t('device.device-modbus-task.384302-33'),
                    value: '01',
                },
                {
                    label: this.$t('device.device-modbus-task.384302-34'),
                    value: '02',
                },
                {
                    label: this.$t('device.device-modbus-task.384302-35'),
                    value: '03',
                },
                {
                    label: this.$t('device.device-modbus-task.384302-36'),
                    value: '04',
                },
                {
                    label: this.$t('device.device-modbus-task.384302-37'),
                    value: '05',
                },
                {
                    label: this.$t('device.device-modbus-task.384302-38'),
                    value: '06',
                },
                {
                    label: this.$t('device.device-modbus-task.384302-39'),
                    value: '15',
                },
                {
                    label: this.$t('device.device-modbus-task.384302-40'),
                    value: '16',
                },
            ],
            jobList: [],
            // 显示搜索条件
            showSearch: true,
            //生成的指令码
            createCode: '',
            //批量写的寄存器值数组
            registerValList: [],
            //批量写的线圈个数
            IOValList: [],
            //编辑名称
            editName: false,
            //编辑名称表单
            editNameForm: {},
            //生成刷新
            createLoading: false,
            //删除快捷指令
            delDialog: false,
            //选择删除的快捷指令
            delItem: {},
            //父组件传过来的对象
            deviceInfo: {},
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                subDeviceId: null,
                subSerialNumber: null,
                command: null,
                jobId: null,
                status: null,
            },
            cycles1: [{ interval: '300', time: '', week: '', day: '' }],
            cycles2: [{ type: 'day', time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' }],
        };
    },
    methods: {
        /** 查询轮训任务列列表 */
        getList() {
            this.loading = true;
            listJob(this.queryParams).then((response) => {
                this.jobList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },

        /** 提交按钮 */
        submitForm() {
            if (this.createForm.taskId != null) {
                updateJob(this.createForm).then((response) => {
                    this.$modal.msgSuccess(this.$t('device.device-modbus-task.384302-62'));
                    this.open = false;
                    this.getList();
                });
            } else {
                addJob(this.createForm).then((response) => {
                    this.$modal.msgSuccess(this.$t('device.device-modbus-task.384302-63'));
                    this.open = false;
                    this.getList();
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const taskIds = row.taskId || this.ids;
            const data = {
                taskId: taskIds,
                jobId: row.jobId,
            };
            this.$modal
                .confirm(this.$t('device.device-modbus-task.384302-64', [taskIds]))
                .then(function () {
                    return delJob(data);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('device.device-modbus-task.384302-65'));
                })
                .catch(() => {});
        },

        /**新增确认按钮*/
        handleAdd() {
            let params = {
                slaveId: parseInt(this.createForm.path), //从机地址
                address: this.createForm.startPath, //起始寄存器地址
                code: parseInt(this.createForm.functionCode), //功能码
            };
            switch (this.createForm.functionCode) {
                case '01':
                case '02':
                case '03':
                case '04':
                    //线圈个数/寄存器个数
                    params.count = this.createForm.registerNum;
                    break;
                case '05':
                case '06':
                    //线圈值/寄存器值
                    params.writeData = this.createForm.setValue;
                    break;
                case '15':
                    //线圈个数/寄存器个数
                    params.count = this.createForm.registerNum;
                    //线圈值数组
                    const IOValList = this.IOValList.map((item) => {
                        return item.value;
                    });
                    params.bitString = IOValList.join('');
                    break;
                case '16':
                    //线圈个数/寄存器个数
                    params.count = this.createForm.registerNum;
                    //寄存器值数组
                    const registerValList = this.registerValList.map((item) => {
                        return item.value;
                    });
                    params.tenWriteData = registerValList;
                    break;
            }
            const res = encode(params).then((response) => {
                this.createCode = response.msg;
                this.handlePush();
            });
        },

        handlePush() {
            /**计算定时时间*/
            let cycle = '';
            const c = this.cycles1.map((item) => {
                if (item.interval === 'hour') {
                    return { type: 'hour' };
                } else if (item.interval === 'day') {
                    return { type: 'day', time: item.time };
                } else if (item.interval === 'week') {
                    return { type: 'week', week: item.week, time: item.time };
                } else if (item.interval === 'month') {
                    return { type: 'month', day: item.day, time: item.time };
                } else {
                    return { interval: item.interval };
                }
            });
            cycle = JSON.stringify(c);
            this.createForm.subDeviceId = this.device.deviceId;
            this.createForm.subSerialNumber = this.device.serialNumber;
            this.createForm.command = this.createCode;
            this.createForm.remark = cycle;
            this.submitForm();
            this.editDialog = false;
        },

        /**打开编辑框 */
        openEdit() {
            this.resetCreateForm();
            this.editName = false;
            this.editDialog = true;
        },
        // 表单重置
        reset() {
            this.form = {
                taskId: null,
                subDeviceId: null,
                subSerialNumber: null,
                command: null,
                jobId: null,
                status: null,
                createBy: null,
                createTime: null,
                remark: null,
            };
            this.resetForm('form');
        },
        /**重置编辑框 */
        resetCreateForm() {
            this.createForm = {
                path: '01',
                functionCode: '01',
                startPath: 0,
                startPath16: '0000',
                registerNum: 1,
                startPathSwitch: 'Dec',
                setValue: 0,
                setValue16: '0000',
                setValueSwitch: 'Dec',
                status: '0',
                cycleType: 1, // 1周期,2自定义
            };
            this.createCode = '';
        },
        /**十进制变成十六进制 */
        int2hex(str) {
            return int2hex(str);
        },
        /**十六进制变成十进制 */
        hex2int(str) {
            return hex2int(str);
        },
        /**修改批量写的寄存器个数或者线圈个数 */
        changeNum() {
            //批量写寄存器
            if (this.createForm.functionCode == '16') {
                for (let index = 0; index < this.createForm.registerNum; index++) {
                    const item = this.registerValList[index];
                    if (!item) {
                        this.registerValList[index] = {
                            value: 0,
                            value16: '0000',
                            switch: 'Dec',
                        };
                    }
                }
                //如果编写数组大于他需要写的数字，就到写的个数
                if (this.registerValList.length > this.createForm.registerNum) {
                    //多的个数
                    const num = this.registerValList.length - this.createForm.registerNum;
                    this.registerValList.splice(this.createForm.registerNum, num);
                }
            }
            //批量写线圈
            if (this.createForm.functionCode == '15') {
                for (let index = 0; index < this.createForm.registerNum; index++) {
                    const item = this.IOValList[index];
                    if (!item) {
                        this.IOValList[index] = {
                            value: '0',
                        };
                    }
                }
                //如果编写数组大于他需要写的数字，就到写的个数
                if (this.IOValList.length > this.createForm.registerNum) {
                    //多的个数
                    const num = this.IOValList.length - this.createForm.registerNum;
                    this.IOValList.splice(this.createForm.registerNum, num);
                }
            }
        },
        /**刷新寄存器输入框 */
        refreshRegisterInpust(item, index) {
            this.$set(this.registerValList, index, item);
        },
        /**刷新线圈值 */
        refreshIOInpust(item, index) {
            this.$set(this.IOValList, index, item);
        },

        /**复制 */
        copyText(code) {
            const res = copyText(code);
            this.$message({
                type: res.type,
                message: res.message,
            });
        },
        /**编码 */
        async encode() {
            try {
                this.createLoading = true;
                let params = {
                    slaveId: parseInt(this.createForm.path), //从机地址
                    address: this.createForm.startPath, //起始寄存器地址
                    code: parseInt(this.createForm.functionCode), //功能码
                };
                switch (this.createForm.functionCode) {
                    case '01':
                    case '02':
                    case '03':
                    case '04':
                        //线圈个数/寄存器个数
                        params.count = this.createForm.registerNum;
                        break;
                    case '05':
                    case '06':
                        //线圈值/寄存器值
                        params.writeData = this.createForm.setValue;
                        break;
                    case '15':
                        //线圈个数/寄存器个数
                        params.count = this.createForm.registerNum;
                        //线圈值数组
                        const IOValList = this.IOValList.map((item) => {
                            return item.value;
                        });
                        params.bitString = IOValList.join('');
                        break;
                    case '16':
                        //线圈个数/寄存器个数
                        params.count = this.createForm.registerNum;
                        //寄存器值数组
                        const registerValList = this.registerValList.map((item) => {
                            return item.value;
                        });
                        params.tenWriteData = registerValList;
                        break;
                }
                const res = await encode(params);
                this.createCode = res.msg;
            } catch (err) {
                this.$message({
                    type: 'error',
                    message: err.message || this.$t('device.device-modbus-task.384302-41'),
                });
            } finally {
                this.createLoading = false;
            }
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 重置按钮操作
        resetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 定时状态修改
        handleStatusChange(row) {
            let text = row.status === '0' ? this.$t('device.device-modbus-task.384302-42') : this.$t('device.device-modbus-task.384302-43');
            this.$modal
                .confirm(this.$t('device.device-modbus-task.384302-44', [text + '""' + row.jobName]))
                .then(function () {
                    return updateJob(row.taskId, row.status);
                })
                .then(() => {
                    this.$modal.msgSuccess(text + this.$t('device.device-modbus-task.384302-45'));
                })
                .catch(function () {
                    row.status = row.status === '0' ? '1' : '0';
                });
        },
        // 格式化显示CRON描述
        formatCronDisplay(item) {
            let result = '';
            if (item.isAdvance == 0) {
                let time = '<br /><span style="color:#F56C6C">时间 ' + item.cronExpression.substring(5, 7) + ':' + item.cronExpression.substring(2, 4) + '</span>';
                let week = item.cronExpression.substring(12);
                if (week == '1,2,3,4,5,6,7') {
                    (result = this.$t('device.device-modbus-task.384302-47')), +time;
                } else {
                    let weekArray = week.split(',');
                    for (let i = 0; i < weekArray.length; i++) {
                        if (weekArray[i] == '1') {
                            result = result + this.$t('device.device-modbus-task.384302-48');
                        } else if (weekArray[i] == '2') {
                            result = result + this.$t('device.device-modbus-task.384302-49');
                        } else if (weekArray[i] == '3') {
                            result = result + this.$t('device.device-modbus-task.384302-50');
                        } else if (weekArray[i] == '4') {
                            result = result + this.$t('device.device-modbus-task.384302-51');
                        } else if (weekArray[i] == '5') {
                            result = result + this.$t('device.device-modbus-task.384302-52');
                        } else if (weekArray[i] == '6') {
                            result = result + this.$t('device.device-modbus-task.384302-53');
                        } else if (weekArray[i] == '7') {
                            result = result + this.$t('device.device-modbus-task.384302-54');
                        }
                    }
                    result = result.substring(0, result.length - 1) + ' ' + time;
                }
            } else {
                result = this.$t('device.device-modbus-task.384302-55');
            }
            return result;
        },

        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            const jobId = row.jobId || this.ids;
            getJob(jobId).then((response) => {
                this.form = response.data;
                // actionList赋值
                this.actionList = JSON.parse(this.form.actions);
                for (let i = 0; i < this.actionList.length; i++) {
                    if (this.actionList[i].type == 1) {
                        this.setParentAndModelData(this.actionList[i], this.thingsModel.properties);
                    } else if (this.actionList[i].type == 2) {
                        this.setParentAndModelData(this.actionList[i], this.thingsModel.functions);
                    }
                }
                if (this.form.isAdvance == 0) {
                    let arrayValue = this.form.cronExpression.substring(12).split(',').map(Number);
                    this.timerWeekValue = arrayValue;
                    this.timerTimeValue = this.form.cronExpression.substring(5, 7) + ':' + this.form.cronExpression.substring(2, 4);
                }
                this.open = true;
                this.title = this.$t('device.device-timer.433369-71');
            });
        },

        // 时间周期-自定义-添加
        handleCustomIntervalAdd() {
            this.cycles2.push({ type: 'day', time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' });
        },
        // 时间周期类型切换
        handleCycleTypeInput(val) {
            if (val === 1) {
                this.cycles2 = [{ type: 'day', time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' }];
            } else {
                this.cycles1 = [{ interval: 'hour', time: '', week: '', day: '' }];
            }
        },
        handleCustomIntervalDelete(index) {
            this.cycles2.splice(index, 1);
        },
        // 时间周期-周期循环
        handleCycleInterval(val) {
            if (val === 'hour') {
                this.$set(this.cycles1, 0, { interval: val, time: '', week: '', day: '' });
            } else if (val === 'day') {
                this.$set(this.cycles1, 0, { interval: val, time: '01', week: '', day: '' });
            } else if (val === 'week') {
                this.$set(this.cycles1, 0, { interval: val, time: '01', week: '1', day: '' });
            } else if (val === 'month') {
                this.$set(this.cycles1, 0, { interval: val, time: '01', week: '', day: '1' });
            } else {
                this.$set(this.cycles1, 0, { interval: val, time: '', week: '', day: '' });
            }
        },
        // 时间周期-自定义
        handleCustomInterval(index, val) {
            if (val === 'day') {
                this.$set(this.cycles2, index, { type: val, time: '00', week: '', day: '', toType: '1', toTime: '02', toWeek: '', toDay: '' });
            } else if (val === 'week') {
                this.$set(this.cycles2, index, { type: val, time: '00', week: '1', day: '', toType: '3', toTime: '02', toWeek: '2', toDay: '' });
            } else if (val === 'month') {
                this.$set(this.cycles2, index, { type: val, time: '00', week: '', day: '1', toType: '4', toTime: '02', toWeek: '', toDay: '2' });
            }
        },
    },
    mounted() {
        const { deviceId } = this.device;
        if (deviceId) {
            this.queryParams.subDeviceId = deviceId;
            this.getList();
        }
        this.resetCreateForm();
    },
};
</script>

<style lang="scss" scoped>
$border-color: #dcdfe6;
$right-btn-color: #1890ff;

::v-deep .el-dialog__body {
    border-top: 1px solid $border-color;
    border-bottom: 1px solid $border-color;
    box-sizing: border-box;
    padding: 0;
}

.dialog-content {
    //max-height:1000px;
    width: 100%;
    box-sizing: border-box;
    padding: 30px 20px;
    overflow: auto;

    .create-title {
        display: flex;
        line-height: 36px;
        margin-bottom: 16px;

        .title-right {
            margin-left: auto;
        }
    }

    .create-code {
        font-size: 18px;
        line-height: 36px;
        font-weight: 800;
    }

    .form-item-label {
        display: flex;
        align-items: center;
        width: 100%;

        ::v-deep .el-form-item__label {
            width: 100%;
        }
    }

    .timer-wrap {
        .timer-period {
            display: inline-block;
            margin-left: 30px;
            color: #000000;
            font-size: 12px;
            font-weight: normal;
        }

        .timer-custom {
            display: block;
            margin-top: 12px;
            color: #000000;
            font-size: 12px;
            font-weight: normal;
        }
    }

    .comp-add-edit {
        display: flex;
        flex-direction: column;

        ::v-deep .el-form-item__content {
            margin-left: 0 !important;
        }

        .comput-formula-box {
            padding: 20px 0;
            border: 1px solid #e7e9f1;
            margin-left: 50px;
            display: flex;

            .title {
                text-align: right;
                width: 96px;
                padding-right: 16px;
            }

            .content {
                font-size: 12px;
                line-height: 32px;

                .alias-wrap {
                    width: 28px;
                    height: 28px;
                    background-image: linear-gradient(180deg, #6fb0ff, #3c78ff);
                    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.2);
                    font-size: 12px;
                    font-weight: 400;
                    line-height: 28px;
                    text-align: center;
                    margin-top: 2px;
                    color: #fff;
                }
            }
        }
    }
}
</style>
