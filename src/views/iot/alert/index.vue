<template>
    <div style="padding: 6px">
        <el-card v-show="showSearch" style="margin-bottom: 6px" v-if="tableShow">
            <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px" style="margin-bottom: -20px">
                <el-form-item :label="$t('alert.index.236501-0')" prop="alertName">
                    <el-input v-model="queryParams.alertName" :placeholder="$t('alert.log.491272-1')" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('alert.index.236501-2')" prop="alertLevel">
                    <el-select v-model="queryParams.alertLevel" :placeholder="$t('alert.index.236501-3')" clearable size="small">
                        <el-option v-for="dict in dict.type.iot_alert_level" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:alert:add']">{{ $t('add') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="padding-bottom: 100px">
            <el-table v-loading="loading" :data="alertList" @selection-change="handleSelectionChange" border size="mini">
                <el-table-column :label="$t('alert.index.236501-0')" align="center" prop="alertName" />
                <el-table-column :label="$t('alert.index.236501-44')" align="center" prop="status">
                    <template slot-scope="scope">
                        <el-tag type="success" size="small" v-if="scope.row.status == 1">{{ $t('alert.index.236501-45') }}</el-tag>
                        <el-tag type="danger" size="small" v-if="scope.row.status == 2">{{ $t('alert.index.236501-46') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alert.index.236501-2')" align="center" prop="alertLevel">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_alert_level" :value="scope.row.alertLevel" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('sip.user-list.558539-5')" align="center" prop="createTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('alert.index.236501-11')" align="center" prop="remark" />
                <el-table-column :label="$t('opation')" align="center" width="160">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['iot:alert:query']">{{ $t('look') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:alert:remove']">{{ $t('del') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <!-- 添加或修改设备告警对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <el-form ref="form" :model="form" :rules="rules" label-width="90px">
                <el-row :gutter="50">
                    <el-col :span="12">
                        <el-form-item :label="$t('alert.index.236501-0')" prop="alertName">
                            <el-input v-model="form.alertName" :placeholder="$t('alert.log.491272-1')" />
                        </el-form-item>
                        <el-form-item :label="$t('alert.index.236501-2')" prop="alertLevel">
                            <el-select v-model="form.alertLevel" :placeholder="$t('alert.index.236501-3')" style="width: 100%">
                                <el-option v-for="dict in dict.type.iot_alert_level" :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('alert.index.236501-11')" prop="remark">
                            <el-input v-model="form.remark" type="textarea" :placeholder="$t('product.category.142342-3')" rows="1" />
                        </el-form-item>
                        <el-form-item :label="$t('alert.index.236501-16')">
                            <el-switch v-model="form.status" :active-value="1" :inactive-value="2" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>

            <el-tabs v-model="activeName" style="padding: 10px">
                <el-tab-pane :label="$t('alert.index.236501-17')" name="relateScene">
                    <el-table :data="form.scenes" border v-loading="sceneLoading" size="mini">
                        <el-table-column prop="sceneName" align="center" :label="$t('alert.index.236501-18')"></el-table-column>
                        <el-table-column :label="$t('alert.index.236501-44')" align="center" prop="enable">
                            <template slot-scope="scope">
                                <el-tag type="success" size="small" v-if="scope.row.enable == 1">{{ $t('alert.index.236501-45') }}</el-tag>
                                <el-tag type="danger" size="small" v-if="scope.row.enable == 2">{{ $t('alert.index.236501-46') }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('alert.index.236501-19')" align="center" prop="cond">
                            <template slot-scope="scope">
                                <span v-if="scope.row.cond == 1">{{ $t('alert.index.236501-20') }}</span>
                                <span v-if="scope.row.cond == 2">{{ $t('alert.index.236501-21') }}</span>
                                <span v-if="scope.row.cond == 3">{{ $t('alert.index.236501-22') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('alert.index.236501-23')" align="center" prop="executeMode">
                            <template slot-scope="scope">
                                <span v-if="scope.row.executeMode == 1">{{ $t('alert.index.236501-24') }}</span>
                                <span v-if="scope.row.executeMode == 2">{{ $t('alert.index.236501-25') }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('opation')" align="center" width="120">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleAlertSceneRemove(scope.row)" v-hasPermi="['iot:alert:remove']">{{ $t('alert.index.236501-26') }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="$t('alert.index.236501-27')" name="notify">
                    <el-table :data="form.notifyTemplateList" border v-loading="notifyLoading" size="mini">
                        <el-table-column prop="name" align="center" :label="$t('alert.index.236501-28')"></el-table-column>
                        <el-table-column :label="$t('alert.index.236501-44')" align="center" prop="status">
                            <template slot-scope="scope">
                                <el-tag type="success" size="small" v-if="scope.row.status == '1'">{{ $t('alert.index.236501-45') }}</el-tag>
                                <el-tag type="danger" size="small" v-if="scope.row.status == '0'">{{ $t('alert.index.236501-46') }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('alert.index.236501-29')" align="center" prop="channelType">
                            <template slot-scope="scope">
                                <dict-tag :options="dict.type.notify_channel_type" :value="scope.row.channelType" />
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('alert.index.236501-30')" align="center" prop="channelName"></el-table-column>
                        <el-table-column :label="$t('alert.index.236501-31')" align="center" prop="provider"></el-table-column>
                        <el-table-column :label="$t('opation')" align="center" width="160">
                            <template slot-scope="scope">
                                <el-button size="mini" type="text" icon="el-icon-delete" @click="handleAlertNotifyTempRemove(scope.row)">{{ $t('alert.index.236501-26') }}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 用于设置间距 -->
                <el-tab-pane disabled v-if="(this.$i18n.locale || defaultSettings.language) == 'en-US'">
                    <span slot="label">
                        <div style="margin-left: 260px"></div>
                    </span>
                </el-tab-pane>
                <el-tab-pane disabled v-else>
                    <span slot="label">
                        <div style="margin-left: 460px"></div>
                    </span>
                </el-tab-pane>
                <el-tab-pane name="sceneButton" disabled v-if="activeName == 'relateScene'">
                    <span slot="label">
                        <el-button type="" plain size="mini" @click="getScenesByAlertId" v-hasPermi="['iot:alert:add']">{{ $t('refresh') }}</el-button>
                        <el-button type="" plain size="mini" @click="addAlertScenes" v-hasPermi="['iot:alert:add']">{{ $t('alert.index.236501-33') }}</el-button>
                    </span>
                </el-tab-pane>
                <el-tab-pane name="notifyButton" disabled v-else>
                    <span slot="label">
                        <el-button type="" plain size="mini" @click="getNotifyTempsByAlertId" v-hasPermi="['iot:alert:add']">{{ $t('refresh') }}</el-button>
                        <el-button type="" plain size="mini" @click="addAlertNotifyTemp" v-hasPermi="['iot:alert:add']">{{ $t('alert.index.236501-34') }}</el-button>
                    </span>
                </el-tab-pane>
            </el-tabs>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmitForm" :disabled="updateBtnDisabled" :loading="confirmLoading" v-hasPermi="['iot:alert:edit']" v-show="form.alertId">{{ $t('update') }}</el-button>
                <el-button type="primary" @click="handleSubmitForm" :disabled="updateBtnDisabled" :loading="confirmLoading" v-hasPermi="['iot:alert:add']" v-show="!form.alertId">{{ $t('add') }}</el-button>
                <el-button @click="handleCancel">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>
        <!-- <el-dialog :title="'确认修改'" :visible.sync="dialogVisible" width="400px">
    <p>您确定要修改第 {{ currentIndex }} 个内容吗？</p>
    <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确定</el-button>
    </span>
</el-dialog> -->
        <!-- 选择场景对话框 -->
        <scene-list ref="sceneList" @sceneEvent="getSceneData($event)" />
        <!-- 选择通知模板 -->
        <notify-temp-list ref="notifyTempList" @notifyEvent="getNotifyTempData($event)" />
    </div>
</template>

<script>
import { listAlert, getAlert, delAlert, addAlert, updateAlert, getScenesByAlertId, listNotifyTemplate } from '@/api/iot/alert';
import sceneList from './scene-list';
import notifyTempList from './notify-temp-list.vue';
import { getDeviceRunningStatus } from '@/api/iot/device';
import newEnvEc08pro from './newEnvEc08pro.json';
export default {
    name: 'alert',
    dicts: ['iot_alert_level', 'sys_job_status', 'notify_channel_type'],
    props: {},
    watch: {},
    components: { sceneList, notifyTempList },
    data() {
        return {
            // 选中的选项卡
            activeName: 'relateScene',
            // 通知模板列表加载
            notifyLoading: false,
            updateBtnDisabled: false,
            // 确认按钮加载
            confirmLoading: false,
            // 告警列表加载
            sceneLoading: false,
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
            // 设备告警表格数据
            alertList: [],
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
            },
            form: {},
            // 表单校验
            rules: {
                alertName: [
                    {
                        required: true,
                        message: this.$t('alert.index.236501-39'),
                        trigger: 'blur',
                    },
                ],
                alertLevel: [
                    {
                        required: true,
                        message: this.$t('alert.index.236501-40'),
                        trigger: 'change',
                    },
                ],
            },
            tableList: [],
            columns: [],
            currentSaveData: {},
            fixedNum: '',
            tableShow: false,
        };
    },
    computed: {
        formattedTableData() {
            return this.tableList.map((row) => {
                const formattedRow = {};
                for (const key in row) {
                    formattedRow[key] = row[key].value;
                }
                return formattedRow;
            });
        },
    },
    mounted() {
        console.log(newEnvEc08pro, 'newEnvEc08pro');
    },
    created() {
        this.getList();
    },
    methods: {
        cellStyle({ column }) {
            return column.editRender ? { cursor: 'pointer' } : {}; // 如果单元格可编辑，返回小手样式
        },
        rowClassName({ row, column }) {
            return 'cursor-pointer';
        },
        handleSelectChange(row, column) {
            console.log(row, column, 'row, column');
        },
        handleEditStart({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }) {
            this.originalRow = { ...row }; // 保存原始数据
            this.currentIndex = rowIndex; // 记录当前索引
            this.currentSaveData = { ...row }[column.field];

            // 处于报警table中，无法修改
            // if ($rowIndex === 0 && $columnIndex === 1) {
            //     this.$confirm(`无法修改`, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //     });
            // }
            // if ($rowIndex === 0 && $columnIndex === 2) {
            //     this.$confirm(`无法修改`, '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning',
            //     });
            // }
        },
        handleEditClosed({ row, column, $rowIndex, $columnIndex }) {
            console.log(row, column, 'this.tableList');
            let _obj = { ...row };
            let _changeValue = '';
            if (column.title.includes('风机')) {
                _changeValue = this.optionsFormat(_obj[column.field]);
            } else {
                _changeValue = _obj[column.field];
            }
            if (this.originalRow[column.field] != _obj[column.field]) {
                this.$confirm(`确认要修改: ${column.title}，修改的值: ${_changeValue}`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                })
                    .then(() => {
                        const { key } = this.tableList[$rowIndex][column.field];
                        const value = _obj[column.field];
                        console.log(key, value, '_updata');
                    })
                    .catch(() => {});
            }
        },
        optionsFormat(value) {
            const fanFormat = ECN22JSON.setting.fanSetting.options;
            return fanFormat.find((option) => option.value == value)?.label || value;
        },
        /** 移除告警通知项*/
        handleAlertNotifyTempRemove(row) {
            for (let i = 0; i < this.form.notifyTemplateList.length; i++) {
                if (row.id == this.form.notifyTemplateList[i].id) {
                    this.form.notifyTemplateList.splice(i, 1);
                }
            }
        },
        /**获取告警通知模板列表*/
        getNotifyTempsByAlertId() {
            if (this.form.alertId) {
                this.notifyLoading = true;
                listNotifyTemplate(this.form.alertId).then((response) => {
                    this.form.notifyTemplateList = response.rows;
                    this.notifyLoading = false;
                });
            }
        },
        /**添加通知模板*/
        addAlertNotifyTemp() {
            this.$refs.notifyTempList.open = true;
            if (this.form.notifyTemplateList) {
                let list = JSON.parse(JSON.stringify(this.form.notifyTemplateList));
                this.$refs.notifyTempList.selectNotifyTemps = list;
                this.$refs.notifyTempList.ids = list.map((item) => item.id);
            }
            this.$refs.notifyTempList.getList();
        },
        /**获取通知模板数据*/
        getNotifyTempData(data) {
            this.form.notifyTemplateList = data;
        },
        /** 移除告警场景项*/
        handleAlertSceneRemove(row) {
            for (let i = 0; i < this.form.scenes.length; i++) {
                if (row.sceneId == this.form.scenes[i].sceneId) {
                    this.form.scenes.splice(i, 1);
                }
            }
        },
        /**获取告警关联场景列表*/
        getScenesByAlertId() {
            if (this.form.alertId) {
                this.sceneLoading = true;
                getScenesByAlertId(this.form.alertId).then((response) => {
                    this.form.scenes = response.rows;
                    this.sceneLoading = false;
                });
            }
        },
        /**添加场景*/
        addAlertScenes() {
            this.$refs.sceneList.openScene = true;
            if (this.form.scenes) {
                let sceneList = JSON.parse(JSON.stringify(this.form.scenes));
                this.$refs.sceneList.selectScenes = sceneList;
                this.$refs.sceneList.ids = sceneList.map((item) => item.sceneId);
            }
            this.$refs.sceneList.getList();
        },
        /**获取场景数据*/
        getSceneData(data) {
            this.form.scenes = data;
        },
        // 查询设备告警列表
        getList() {
            this.loading = true;
            listAlert(this.queryParams).then((response) => {
                this.alertList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 表单重置
        reset() {
            this.form = {
                alertId: null,
                alertName: null,
                alertLevel: 1,
                productId: null,
                productName: null,
                remark: null,
                status: 1,
                scenes: [], // 场景列表
                notifyTemplateList: [], // 通知模板列表
            };
            this.activeName = 'relateScene';
            this.resetForm('form');
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('alert.index.236501-41');
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
            this.ids = selection.map((item) => item.alertId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 修改按钮操作
        handleUpdate(row) {
            this.reset();
            const alertId = row.alertId || this.ids;
            getAlert(alertId).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('alert.index.236501-42');
            });
        },
        // 删除按钮操作
        handleDelete(row) {
            const alertIds = row.alertId || this.ids;
            this.$modal
                .confirm(this.$t('alert.index.236501-42', [alertIds]))
                .then(function () {
                    return delAlert(alertIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        // 取消按钮
        handleCancel() {
            this.open = false;
            this.reset();
        },
        // 提交按钮
        handleSubmitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.alertId != null) {
                        updateAlert(this.form).then((res) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addAlert(this.form).then((res) => {
                            this.$modal.msgSuccess(this.$t('addSuccess'));
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
@import '@/assets/styles/tableView.scss';
@import '@/assets/styles/sunseen-btn.scss';
.cursor-pointer {
    cursor: pointer;
}
</style>
