<template>
    <div class="device-timer-wrap">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="70px">
            <el-form-item :label="$t('device.device-timer.433369-0')" prop="jobName">
                <el-input v-model="queryParams.jobName" :placeholder="$t('device.device-timer.433369-1')" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item :label="$t('device.device-timer.433369-2')" prop="status">
                <el-select v-model="queryParams.status" :placeholder="$t('device.device-timer.433369-3')" clearable size="small">
                    <el-option v-for="dict in dict.type.sys_job_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('device.device-timer.433369-4') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('device.device-timer.433369-5') }}</el-button>
            </el-form-item>
            <el-form-item style="float: right">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:device:timer:add']">{{ $t('device.device-timer.433369-6') }}</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange" size="mini">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('device.device-timer.433369-7')" align="center" prop="jobName" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('device.device-timer.433369-8')" align="center" prop="cronText">
                <template slot-scope="scope">
                    <div v-html="formatCronDisplay(scope.row)"></div>
                </template>
            </el-table-column>
            <el-table-column :label="$t('device.device-timer.433369-9')" align="center" prop="cronExpression" :show-overflow-tooltip="true" />
            <el-table-column :label="$t('device.device-timer.433369-10')" align="left" prop="actions" :show-overflow-tooltip="true" width="260">
                <template slot-scope="scope">
                    <div v-html="formatActionsDisplay(scope.row.actions)" style="overflow: hidden; white-space: nowrap"></div>
                </template>
            </el-table-column>

            <el-table-column :label="$t('device.device-timer.433369-11')" align="center">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" :active-text="$t('device.device-timer.433369-12')" @change="handleStatusChange(scope.row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['iot:device:timer:query']">{{ $t('device.device-timer.433369-14') }}</el-button>
                    <el-button size="mini" type="text" icon="el-icon-caret-right" @click="handleView(scope.row)" v-hasPermi="['iot:device:timer:query']">{{ $t('device.device-timer.433369-15') }}</el-button>
                    <br />
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:device:timer:remove']">{{ $t('device.device-timer.433369-16') }}</el-button>
                    <el-button size="mini" type="text" icon="el-icon-caret-right" @click="handleRun(scope.row)" v-hasPermi="['iot:device:timer:execute']">{{ $t('device.device-timer.433369-17') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <!-- 添加或修改定时定时对话框 -->
        <el-dialog class="device-timer-config-dialog" :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item :label="$t('device.device-timer.433369-0')" prop="jobName">
                    <el-input v-model="form.jobName" :placeholder="$t('device.device-timer.433369-1')" style="width: 280px" />
                </el-form-item>
                <el-form-item :label="$t('device.device-timer.433369-18')" prop="timerTimeValue">
                    <el-time-picker
                        v-model="timerTimeValue"
                        value-format="HH:mm"
                        format="HH:mm"
                        :placeholder="$t('device.device-timer.433369-19')"
                        style="width: 280px"
                        @change="timeChange"
                        :disabled="form.isAdvance == 1"
                    ></el-time-picker>
                </el-form-item>
                <el-form-item :label="$t('device.device-timer.433369-20')" prop="timerWeek">
                    <el-row>
                        <el-col :span="18">
                            <el-select v-model="timerWeekValue" :placeholder="$t('device.device-timer.433369-21')" multiple style="width: 100%" @change="weekChange" :disabled="form.isAdvance == 1">
                                <el-option v-for="item in timerWeeks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item :label="$t('device.device-timer.433369-22')" prop="cron">
                    <el-row>
                        <el-col :span="18">
                            <el-input v-model="form.cronExpression" :placeholder="$t('device.device-timer.433369-23')" :disabled="form.isAdvance == 0">
                                <template slot="append">
                                    <el-button type="primary" @click="handleShowCron" :disabled="form.isAdvance == 0">
                                        {{ $t('device.device-timer.433369-24') }}
                                        <i class="el-icon-time el-icon--right"></i>
                                    </el-button>
                                </template>
                            </el-input>
                        </el-col>
                        <el-col :span="4" :offset="1">
                            <el-checkbox v-model="form.isAdvance" :true-label="1" :false-label="0" @change="customerCronChange">{{ $t('device.device-timer.433369-25') }}</el-checkbox>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item :label="$t('device.device-timer.433369-2')" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in dict.type.sys_job_status" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <div style="height: 1px; background-color: #ddd; margin: 0 0 20px 0"></div>
                <el-form-item class="action-wrap" :label="$t('device.device-timer.433369-26')" prop="actions">
                    <div class="item-wrap" v-for="(actionItem, index) in actionList" :key="index + 'action'">
                        <el-row :gutter="16">
                            <el-col :span="5">
                                <el-select v-model="actionItem.type" :placeholder="$t('device.device-timer.433369-27')" size="small" @change="handleActionTypeChange($event, index)">
                                    <el-option v-for="(subItem, subIndex) in modelTypes" :key="subIndex + 'type'" :label="subItem.label" :value="subItem.value"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="10">
                                <el-select
                                    style="width: 100%"
                                    v-model="actionItem.parentId"
                                    :placeholder="$t('device.device-timer.433369-28')"
                                    v-if="actionItem.type == 1"
                                    size="small"
                                    @change="handleActionParentModelChange($event, index)"
                                >
                                    <el-option v-for="(subItem, subIndex) in thingsModel.properties" :key="subIndex + 'property'" :label="subItem.name" :value="subItem.id"></el-option>
                                </el-select>
                                <el-select
                                    style="width: 100%"
                                    v-model="actionItem.parentId"
                                    :placeholder="$t('device.device-timer.433369-28')"
                                    v-else-if="actionItem.type == 2"
                                    size="small"
                                    @change="handleActionParentModelChange($event, index)"
                                >
                                    <el-option v-for="(subItem, subIndex) in thingsModel.functions" :key="subIndex + 'func'" :label="subItem.name" :value="subItem.id"></el-option>
                                </el-select>
                            </el-col>
                            <div class="delete-wrap">
                                <el-button v-if="index !== 0" size="small" plain type="danger" style="padding: 5px" icon="el-icon-delete" @click="handleRemoveActionItem(index)">
                                    {{ $t('device.device-timer.433369-16') }}
                                </el-button>
                            </div>
                        </el-row>

                        <!--数组索引/物模型/{{ $t('device.device-timer.433369-29') }}-->
                        <el-row :gutter="16">
                            <el-col :span="5" v-if="actionItem.parentModel && actionItem.parentModel.datatype.type === 'array'">
                                <el-select v-model="actionItem.arrayIndex" :placeholder="$t('device.device-timer.433369-21')" size="small" @change="handleActionIndexChange($event, index)">
                                    <el-option v-for="subItem in actionItem.parentModel.datatype.arrayModel" :key="subItem.id" :label="subItem.name" :value="subItem.id"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5" v-if="actionItem.parentModel && actionItem.parentModel.datatype.type === 'array' && actionItem.parentModel.datatype.arrayType === 'object'">
                                <el-select v-model="actionItem.id" :placeholder="$t('device.device-timer.433369-21')" size="small" @change="handleActionModelChange($event, index)">
                                    <el-option v-for="(subItem, subIndex) in actionItem.parentModel.datatype.params" :key="subIndex" :label="subItem.name" :value="subItem.id"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="5" v-if="actionItem.parentModel && actionItem.parentModel.datatype.type === 'object'">
                                <el-select v-model="actionItem.id" :placeholder="$t('device.device-timer.433369-21')" size="small" @change="handleActionModelChange($event, index)">
                                    <el-option v-for="(subItem, subIndex) in actionItem.parentModel.datatype.params" :key="subIndex" :label="subItem.name" :value="subItem.id"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="10" v-if="actionItem.model">
                                <div v-if="actionItem.model.datatype.type == 'integer' || actionItem.model.datatype.type == 'decimal'">
                                    <el-input
                                        style="vertical-align: baseline"
                                        v-model="actionItem.value"
                                        :placeholder="$t('device.device-timer.433369-29')"
                                        :max="actionItem.model.datatype.max"
                                        :min="actionItem.model.datatype.min"
                                        type="number"
                                        size="small"
                                    >
                                        <template slot="append">{{ actionItem.model.datatype.unit }}</template>
                                    </el-input>
                                </div>
                                <div v-else-if="actionItem.model.datatype.type == 'bool'">
                                    <el-switch
                                        style="vertical-align: baseline"
                                        v-model="actionItem.value"
                                        :active-text="actionItem.model.datatype.trueText"
                                        :inactive-text="actionItem.model.datatype.falseText"
                                        :active-value="1"
                                        :inactive-value="0"
                                    ></el-switch>
                                </div>
                                <div v-else-if="actionItem.model.datatype.type == 'enum'">
                                    <el-select v-model="actionItem.value" :placeholder="$t('device.device-timer.433369-21')" style="width: 100%" size="small">
                                        <el-option v-for="(subItem, subIndex) in actionItem.model.datatype.enumList" :key="subIndex + 'things'" :label="subItem.text" :value="subItem.value"></el-option>
                                    </el-select>
                                </div>
                                <div v-else-if="actionItem.model.datatype.type == 'string'">
                                    <el-input v-model="actionItem.value" :placeholder="$t('device.device-timer.433369-30')" :max="actionItem.model.datatype.maxLength" size="small" />
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div>
                        +
                        <a style="color: #409eff" @click="handleAddActionItem()">{{ $t('device.device-timer.433369-31') }}</a>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmitForm" :loading="submitButtonLoading" v-hasPermi="['iot:device:timer:add']" v-show="!form.jobId">{{ $t('device.device-timer.433369-32') }}</el-button>
                <el-button type="primary" @click="handleSubmitForm" :loading="submitButtonLoading" v-hasPermi="['iot:device:timer:edit']" v-show="form.jobId">{{ $t('device.device-timer.433369-33') }}</el-button>
                <el-button @click="handleCancel">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>

        <el-dialog :title="$t('device.device-timer.433369-35')" :visible.sync="openCron" append-to-body destroy-on-close class="scrollbar">
            <crontab @hide="openCron = false" @fill="crontabFill" :expression="expression" style="padding-bottom: 80px"></crontab>
        </el-dialog>

        <!-- 定时日志详细 -->
        <el-dialog :title="$t('device.device-timer.433369-15')" :visible.sync="openView" width="700px" append-to-body>
            <el-form ref="form" :model="form" label-width="120px" size="mini">
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.device-timer.433369-36')">{{ form.jobId }}</el-form-item>
                        <el-form-item :label="$t('device.device-timer.433369-37')">{{ form.jobName }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.device-timer.433369-38')">{{ jobGroupFormat(form) }}</el-form-item>
                        <el-form-item :label="$t('device.device-timer.433369-39')">{{ form.createTime }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.device-timer.433369-40')">
                            <div v-if="form.concurrent == 0">{{ $t('device.device-timer.433369-41') }}</div>
                            <div v-else-if="form.concurrent == 1">{{ $t('device.device-timer.433369-42') }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.device-timer.433369-43')">{{ form.cronExpression }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.device-timer.433369-44')">
                            <div v-if="form.misfirePolicy == 0">{{ $t('device.device-timer.433369-45') }}</div>
                            <div v-else-if="form.misfirePolicy == 1">{{ $t('device.device-timer.433369-46') }}</div>
                            <div v-else-if="form.misfirePolicy == 2">{{ $t('device.device-timer.433369-17') }}</div>
                            <div v-else-if="form.misfirePolicy == 3">{{ $t('device.device-timer.433369-47') }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.device-timer.433369-48')">{{ parseTime(form.nextValidTime) }}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('device.device-timer.433369-49')">
                            <div v-if="form.status == 0">{{ $t('device.device-timer.433369-50') }}</div>
                            <div v-else-if="form.status == 1">{{ $t('device.device-timer.433369-51') }}</div>
                        </el-form-item>
                    </el-col>

                    <el-col :span="24">
                        <el-form-item :label="$t('device.device-timer.433369-52')">
                            <div v-html="formatActionsDisplay(form.actions)" style="border: 1px solid #ddd; padding: 10px; border-radius: 5px; width: 465px"></div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="openView = false">{{ $t('device.device-timer.433369-53') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listJob, getJob, delJob, addJob, updateJob, runJob, changeJobStatus } from '@/api/iot/deviceJob';
import Crontab from '@/components/Crontab';

export default {
    components: {
        Crontab,
    },
    name: 'device-timer',
    dicts: ['sys_job_group', 'sys_job_status'],
    props: {
        device: {
            type: Object,
            default: null,
        },
    },
    watch: {
        // 获取到父组件传递的device后
        device: function (newVal, oldVal) {
            this.deviceInfo = newVal;
            this.initThingsModel();
        },
    },
    data() {
        return {
            deviceInfo: {}, // 设备
            actionList: [], // 动作列表
            thingsModel: {}, // 物模型JSON
            // 遮罩层
            loading: false,
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
            // 定时定时表格数据
            jobList: [],
            timerWeeks: [
                {
                    value: 1,
                    label: '周一',
                },
                {
                    value: 2,
                    label: '周二',
                },
                {
                    value: 3,
                    label: '周三',
                },
                {
                    value: 4,
                    label: '周四',
                },
                {
                    value: 5,
                    label: '周五',
                },
                {
                    value: 6,
                    label: '周六',
                },
                {
                    value: 7,
                    label: '周日',
                },
            ],

            timerWeekValue: [],
            timerTimeValue: '',
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 是否显示详细弹出层
            openView: false,
            // 是否显示Cron表达式弹出层
            openCron: false,
            // 传入的表达式
            expression: '',
            // 提交按钮加载
            submitButtonLoading: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deviceId: 0,
                jobName: undefined,
                jobGroup: undefined,
                status: undefined,
            },
            // 物模型类别
            modelTypes: [
                {
                    value: 1,
                    label: this.$t('device.device-timer.433369-61'),
                },
                {
                    value: 2,
                    label: this.$t('device.device-timer.433369-62'),
                },
            ],
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                jobName: [
                    {
                        required: true,
                        message: this.$t('device.device-timer.433369-63'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    created() {
        this.getList();
        this.deviceInfo = this.device;
        this.initThingsModel();
    },
    methods: {
        initThingsModel() {
            if (this.deviceInfo && this.deviceInfo.deviceId !== 0) {
                this.thingsModel = this.formatArrayIndex(this.deviceInfo.cacheThingsModel);

                // 过滤监测数据和只读数据
                if (this.thingsModel.properties && this.thingsModel.properties.length !== 0) {
                    this.thingsModel.properties = this.thingsModel.properties.filter((item) => {
                        if (item.datatype.params && item.datatype.params.length !== 0) {
                            item.datatype.params = item.datatype.params.filter((item) => item.isMonitor == 0 && item.isReadonly == 0);
                        }
                        return item.isMonitor == 0 && item.isReadonly == 0;
                    });
                }
                if (this.thingsModel.functions && this.thingsModel.functions.length !== 0) {
                    this.thingsModel.functions = this.thingsModel.functions.filter((item) => {
                        if (item.datatype.params && item.datatype.params.length !== 0) {
                            item.datatype.params = item.datatype.params.filter((item) => item.isMonitor == 0 && item.isReadonly == 0);
                        }
                        return item.isMonitor == 0 && item.isReadonly == 0;
                    });
                }
                this.queryParams.deviceId = this.deviceInfo.deviceId;
            }
        },
        // 查询定时定时列表
        getList() {
            this.loading = true;
            listJob(this.queryParams).then((response) => {
                this.jobList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 定时组名字典翻译
        jobGroupFormat(row, column) {
            return this.selectDictLabel(this.dict.type.sys_job_group, row.jobGroup);
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.jobId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        // 定时状态修改
        handleStatusChange(row) {
            let text = row.status === '0' ? this.$t('device.device-timer.433369-12') : this.$t('device.device-timer.433369-64');
            this.$modal
                .confirm(this.$t('device.device-timer.433369-65', [text + '""' + row.jobName]))
                .then(function () {
                    return changeJobStatus(row.jobId, row.status);
                })
                .then(() => {
                    this.$modal.msgSuccess(text + this.$t('device.device-timer.433369-67'));
                })
                .catch(function () {
                    row.status = row.status === '0' ? '1' : '0';
                });
        },
        /* 立即执行一次 */
        handleRun(row) {
            this.$modal
                .confirm(this.$t('device.device-timer.433369-68', [row.jobName]))
                .then(function () {
                    return runJob(row.jobId, row.jobGroup);
                })
                .then(() => {
                    this.$modal.msgSuccess(this.$t('device.device-timer.433369-69'));
                })
                .catch(() => {});
        },
        /** 定时详细信息 */
        handleView(row) {
            getJob(row.jobId).then((response) => {
                this.form = response.data;
                this.openView = true;
            });
        },
        /** cron表达式按钮操作 */
        handleShowCron() {
            this.expression = this.form.cronExpression;
            this.openCron = true;
        },
        /** 确定后回传值 */
        crontabFill(value) {
            this.form.cronExpression = value;
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('device.device-timer.433369-70');
        },
        // 取消按钮
        handleCancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                jobId: undefined,
                jobName: undefined,
                cronExpression: undefined,
                status: '0',
                jobGroup: 'DEFAULT', // 定时分组
                misfirePolicy: 2, // 1=立即执行，2=执行一次，3=放弃执行
                concurrent: 1, // 是否并发，1=禁止，0=允许
                isAdvance: 0, // 是否详细cron表达式
                jobType: 1, // 任务类型 1=设备定时，2=设备告警，3=场景联动
                productId: 0,
                productName: '',
                sceneId: 0, //场景ID
                alertId: 0, // 告警ID
                actions: '',
            };
            this.submitButtonLoading = false;
            this.timerWeekValue = [1, 2, 3, 4, 5, 6, 7];
            this.timerTimeValue = '';
            this.actionList = [
                {
                    id: '',
                    name: '',
                    value: '',
                    valueName: '',
                    type: 1,
                    parentId: '',
                    parentName: '',
                    arrayIndex: '',
                    arrayIndexName: '',
                    model: null,
                },
            ];
            // 物模型项,对应actions
            this.resetForm('form');
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
        // 设置父级物模型和物模型值
        setParentAndModelData(sceneScript, sceneScripts) {
            for (let i = 0; i < sceneScripts.length; i++) {
                if (sceneScript.parentId == sceneScripts[i].id) {
                    sceneScript.parentModel = sceneScripts[i];
                    if (sceneScript.parentModel.datatype.type === 'object') {
                        // 对象类型，物模型赋值
                        for (let j = 0; j < sceneScript.parentModel.datatype.params.length; j++) {
                            if (sceneScript.id == sceneScript.parentModel.datatype.params[j].id) {
                                sceneScript.model = sceneScript.parentModel.datatype.params[j];
                            }
                        }
                    } else if (sceneScript.parentModel.datatype.arrayType === 'object' && sceneScript.parentModel.datatype.type === 'array') {
                        // 对象数组类型，物模型集合移除索引前缀
                        if (sceneScript.id.indexOf('array_') != -1) {
                            sceneScript.id = sceneScript.id.substring(9);
                        }
                        // 物模型赋值
                        for (let j = 0; j < sceneScript.parentModel.datatype.params.length; j++) {
                            if (sceneScript.id == sceneScript.parentModel.datatype.params[j].id) {
                                sceneScript.model = sceneScript.parentModel.datatype.params[j];
                            }
                        }
                    } else if (sceneScript.parentModel.datatype.arrayType !== 'object' && sceneScript.parentModel.datatype.type === 'array') {
                        // 普通数组类型，物模型集合移除索引前缀
                        if (sceneScript.id.indexOf('array_') != -1) {
                            sceneScript.id = sceneScript.id.substring(9);
                        }
                        sceneScript.model = {
                            datatype: {
                                type: sceneScript.parentModel.datatype.arrayType,
                                maxLength: -1,
                                min: -1,
                                max: -1,
                                unit: this.$t('device.device-timer.433369-72'),
                            },
                        };
                    } else {
                        // 普通类型
                        sceneScript.model = sceneScript.parentModel;
                    }
                    break;
                }
            }
        },
        // 删除按钮操作
        handleDelete(row) {
            const jobIds = row.jobId || this.ids;
            this.$modal
                .confirm(this.$t('device.device-timer.433369-73', [jobIds]))
                .then(function () {
                    return delJob(jobIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('device.device-timer.433369-75'));
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/job/export',
                {
                    ...this.queryParams,
                },
                `job_${new Date().getTime()}.xlsx`
            );
        },
        /** 星期改变事件 **/
        weekChange(data) {
            this.gentCronExpression();
        },
        /** 时间改变事件 **/
        timeChange(data) {
            this.gentCronExpression();
        },
        /**自定义cron表达式选项改变事件 */
        customerCronChange(data) {
            if (data == 0) {
                this.gentCronExpression();
            }
        },
        /** 生成cron表达式**/
        gentCronExpression() {
            let hour = '00';
            let minute = '00';
            if (this.timerTimeValue != null && this.timerTimeValue != '') {
                hour = this.timerTimeValue.substring(0, 2);
                minute = this.timerTimeValue.substring(3);
            }
            let week = '*';
            if (this.timerWeekValue.length > 0) {
                let order = this.timerWeekValue.slice().sort();
                for (let i = 0; i < order.length; i++) {
                    if (order[i] == 7) {
                        order[i] = 1;
                    } else {
                        order[i] = order[i] + 1;
                    }
                }
                console.log(order);
                week = order;
            }
            this.form.cronExpression = '0 ' + minute + ' ' + hour + ' ? * ' + week;
        },
        // 格式化显示CRON描述
        formatCronDisplay(item) {
            let result = '';
            if (item.isAdvance == 0) {
                let time = '<br /><span style="color:#F56C6C">时间 ' + item.cronExpression.substring(5, 7) + ':' + item.cronExpression.substring(2, 4) + '</span>';
                let week = item.cronExpression.substring(12);
                if (week == '1,2,3,4,5,6,7') {
                    result = '每天 ' + time;
                } else {
                    let weekArray = week.split(',');
                    for (let i = 0; i < weekArray.length; i++) {
                        if (weekArray[i] == '1') {
                            result = result + this.$t('device.device-timer.433369-78');
                        } else if (weekArray[i] == '2') {
                            result = result + this.$t('device.device-timer.433369-79');
                        } else if (weekArray[i] == '3') {
                            result = result + this.$t('device.device-timer.433369-80');
                        } else if (weekArray[i] == '4') {
                            result = result + this.$t('device.device-timer.433369-81');
                        } else if (weekArray[i] == '5') {
                            result = result + this.$t('device.device-timer.433369-82');
                        } else if (weekArray[i] == '6') {
                            result = result + this.$t('device.device-timer.433369-83');
                        } else if (weekArray[i] == '7') {
                            result = result + this.$t('device.device-timer.433369-84');
                        }
                    }
                    result = result.substring(0, result.length - 1) + ' ' + time;
                }
            } else {
                result = this.$t('device.device-timer.433369-85');
            }
            return result;
        },
        // 格式化显示动作
        formatActionsDisplay(json) {
            if (json == null || json == '') {
                return;
            }
            let actions = JSON.parse(json);
            let result = '';
            for (let i = 0; i < actions.length; i++) {
                if (actions[i].arrayIndexName) {
                    result =
                        result +
                        `${actions[i].parentName} >> ${actions[i].arrayIndexName} >> ${actions[i].name} <span style="color:#F56C6C"> ${actions[i].valueName ? actions[i].valueName : actions[i].value}</span><br />`;
                } else {
                    if (actions[i].parentName !== actions[i].name) {
                        result = result + `${actions[i].parentName} >> ${actions[i].name} <span style="color:#F56C6C">${actions[i].valueName ? actions[i].valueName : actions[i].value}</span><br />`;
                    } else {
                        result = result + `${actions[i].name} <span style="color:#F56C6C">${actions[i].valueName ? actions[i].valueName : actions[i].value}</span><br />`;
                    }
                }
            }
            return result == '' ? this.$t('device.device-timer.433369-86') : result;
        },
        // 物模型格式化处理
        formatArrayIndex(data) {
            let obj = { ...data };
            for (let o in obj) {
                obj[o] = obj[o].map((item) => {
                    if (item.datatype.type === 'array') {
                        let arrayModel = [];
                        for (let k = 0; k < item.datatype.arrayCount; k++) {
                            let index = k > 9 ? String(k) : '0' + k;
                            if (item.datatype.arrayType === 'object') {
                                arrayModel.push({
                                    id: index,
                                    name: item.name + ' ' + (k + 1),
                                });
                            } else {
                                arrayModel.push({
                                    id: index,
                                    name: item.name + ' ' + (k + 1),
                                });
                            }
                        }
                        item.datatype.arrayModel = arrayModel;
                    }
                    return item;
                });
            }
            return obj;
        },
        // 添加执行动作
        handleAddActionItem() {
            this.actionList.push({
                id: '',
                name: '',
                value: '',
                valueName: '',
                type: 1, // 1=属性，2=功能，3=事件，5=设备上线，6=设备下线
                parentId: '',
                parentName: '',
                arrayIndex: '',
                arrayIndexName: '',
                model: null,
            });
        },
        // 删除执行动作
        handleRemoveActionItem(index) {
            this.actionList.splice(index, 1);
        },
        // 动作类型改变事件
        handleActionTypeChange(data, index) {
            this.actionList[index].id = '';
            this.actionList[index].name = '';
            this.actionList[index].value = '';
            this.actionList[index].valueName = '';
            this.actionList[index].parentId = '';
            this.actionList[index].parentName = '';
            this.actionList[index].arrayIndex = '';
            this.actionList[index].arrayIndexName = '';
            this.actionList[index].parentModel = null;
            this.actionList[index].model = null;
        },
        // 执行动作物模型数组索引选择
        handleActionIndexChange(id, index) {
            this.actionList[index].arrayIndexName = this.actionList[index].parentModel.datatype.arrayModel.find((x) => x.id == id).name;
            this.actionList[index].value = '';
            // 数组类型保留id和name
            if (this.actionList[index].parentModel.datatype.arrayType === 'object') {
                this.actionList[index].id = '';
                this.actionList[index].name = '';
            }
        },
        // 动作物模型项改变事件
        handleActionParentModelChange(identifier, index) {
            this.actionList[index].model = null;
            this.actionList[index].value = '';
            this.actionList[index].arrayIndex = '';
            this.actionList[index].arrayIndexName = '';

            let scripts = [];
            if (this.actionList[index].type == 1) {
                //属性
                scripts = this.thingsModel.properties;
            } else if (this.actionList[index].type == 2) {
                //功能
                scripts = this.thingsModel.functions;
            }
            for (let i = 0; i < scripts.length; i++) {
                if (scripts[i].id == identifier) {
                    this.actionList[index].parentName = scripts[i].name;
                    this.actionList[index].parentModel = scripts[i];
                    if (scripts[i].datatype.type === 'object') {
                        // 对象类型
                        this.actionList[index].id = '';
                        this.actionList[index].name = '';
                    } else if (scripts[i].datatype.type === 'array' && scripts[i].datatype.arrayType === 'object') {
                        // 对象数组类型
                        this.actionList[index].id = '';
                        this.actionList[index].name = '';
                    } else if (scripts[i].datatype.type === 'array' && scripts[i].datatype.arrayType !== 'object') {
                        // 普通类型，数组类
                        this.actionList[index].id = scripts[i].id;
                        this.actionList[index].name = scripts[i].name;
                        // 用于减少界面判断
                        this.actionList[index].model = {
                            datatype: {
                                type: scripts[i].datatype.arrayType,
                                maxLength: -1,
                                min: -1,
                                max: -1,
                                unit: this.$t('device.device-timer.433369-72'),
                            },
                        };
                    } else {
                        // 普通类型,不包含数组类型
                        this.actionList[index].id = scripts[i].id;
                        this.actionList[index].name = scripts[i].name;
                        this.actionList[index].model = scripts[i];
                    }
                    break;
                }
            }
        },
        // 执行动作物模型选择
        handleActionModelChange(id, index) {
            this.actionList[index].value = '';
            let model = null;
            if (this.actionList[index].parentModel.datatype.type === 'array' || this.actionList[index].parentModel.datatype.type === 'object') {
                model = this.actionList[index].parentModel.datatype.params.find((item) => item.id == id);
                this.actionList[index].name = model.name;
                this.actionList[index].model = model;
            }
        },
        // 提交按钮
        handleSubmitForm: function () {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let actions = [];
                    if (this.form.isAdvance == 0) {
                        if (this.timerTimeValue == '' || this.timerTimeValue == null) {
                            this.$modal.alertError(this.$t('device.device-timer.433369-87'));
                            return;
                        }
                        if (this.timerWeekValue == null || this.timerWeekValue == '') {
                            this.$modal.alertError(this.$t('device.device-timer.433369-88'));
                            return;
                        }
                    } else if (this.form.isAdvance == 1) {
                        if (this.form.cronExpression == '') {
                            this.$modal.alertError(this.$t('device.device-timer.433369-89'));
                            return;
                        }
                    }
                    for (let i = 0; i < this.actionList.length; i++) {
                        if (this.actionList[i].value === '') {
                            this.$modal.alertError(this.$t('device.device-timer.433369-90'));
                            return;
                        }
                        // 数据重组
                        let item = this.actionList[i];
                        // id拼接array索引
                        let id = '';
                        if (item.arrayIndex != '') {
                            id = 'array_' + item.arrayIndex + '_' + item.id;
                        } else {
                            id = item.id;
                        }
                        // 获取valueName
                        let valueName = '';
                        if (item.model.datatype.type === 'bool') {
                            valueName = item.value === 1 ? item.model.datatype.trueText : item.model.datatype.falseText;
                        } else if (item.model.datatype.type === 'enum') {
                            valueName = item.model.datatype.enumList.find((subItem) => subItem.value === item.value).text;
                        } else {
                            valueName = '';
                        }
                        // 只传需要的数据
                        actions[i] = {
                            type: item.type,
                            id: item.id,
                            name: item.name,
                            value: item.value,
                            valueName: valueName,
                            parentId: item.parentId,
                            parentName: item.parentName,
                            arrayIndex: item.arrayIndex,
                            arrayIndexName: item.arrayIndexName,
                            deviceId: this.deviceInfo.deviceId,
                            deviceName: this.deviceInfo.deviceName,
                        };
                    }
                    this.form.actions = JSON.stringify(actions);
                    // 设备信息
                    this.form.deviceId = this.deviceInfo.deviceId;
                    this.form.deviceName = this.deviceInfo.deviceName;
                    this.form.serialNumber = this.deviceInfo.serialNumber;
                    this.form.productId = this.deviceInfo.productId;
                    this.form.productName = this.deviceInfo.productName;
                    // 按钮等待后端加载完
                    this.submitButtonLoading = true;
                    if (this.form.jobId != undefined) {
                        updateJob(this.form).then(() => {
                            this.$modal.msgSuccess(this.$t('device.device-timer.433369-91'));
                            this.submitButtonLoading = false;
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addJob(this.form).then(() => {
                            this.$modal.msgSuccess(this.$t('device.device-timer.433369-92'));
                            this.submitButtonLoading = false;
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.device-timer-wrap {
    padding-left: 20px;
}

.device-timer-config-dialog {
    .action-wrap {
        position: relative;

        .item-wrap {
            margin-bottom: 15px;
            padding: 10px;
            background-color: #d9e5f6;
            border-radius: 5px;

            .delete-wrap {
                position: absolute;
                right: 10px;
                top: 0;
            }
        }
    }
}
</style>
