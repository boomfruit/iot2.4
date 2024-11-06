<template>
    <div style="padding: 6px">
        <el-card v-show="showSearch" style="margin-bottom: 6px">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: -20px">
                <el-form-item :label="$t('firmware.index.222541-0')" prop="firmwareName">
                    <el-input v-model="queryParams.firmwareName" :placeholder="$t('firmware.index.222541-1')" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('firmware.index.222541-2')">
                    <el-select v-model="queryParams.productId" :placeholder="$t('firmware.index.222541-2')" clearable @change="handleQuery">
                        <el-option v-for="product in productShortList" :key="product.id" :label="product.name" :value="product.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    ·
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:firmware:add']">{{ $t('firmware.index.222541-3') }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card style="padding-bottom: 100px">
            <el-table v-loading="loading" :data="firmwareList" @selection-change="handleSelectionChange">
                <el-table-column :label="$t('firmware.index.222541-0')" align="center" prop="firmwareName" />
                <el-table-column :label="$t('firmware.index.222541-4')" align="center" prop="version" width="120">
                    <template slot-scope="scope">
                        <span>Version</span>
                        {{ scope.row.version }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('firmware.index.222541-5')" align="center" prop="productName">
                    <template slot-scope="scope">
                        <el-link :underline="false" type="primary" @click="handleViewProduct(scope.row.productId)">
                            {{ scope.row.productName }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('firmware.index.222541-6')" align="center" prop="filePath" min-width="100">
                    <template slot-scope="scope">
                        <el-link :href="getDownloadUrl(scope.row.filePath)" :underline="false" type="success">
                            {{ getDownloadUrl(scope.row.filePath) }}
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('firmware.index.222541-7')" align="center" prop="isLatest" width="80">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isLatest == 1">{{ $t('firmware.index.222541-8') }}</el-tag>
                        <el-tag type="info" v-else>{{ $t('firmware.index.222541-9') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('firmware.index.222541-10')" align="center" prop="createTime" width="100">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('firmware.index.222541-11')" align="center" prop="remark" min-width="150" />
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="350">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" style="padding: 5px" icon="el-icon-upload" @click="otaUpGrade(scope.row)" v-hasPermi="['iot:firmware:edit']">{{ $t('firmware.index.222541-12') }}</el-button>
                        <el-button size="small" type="primary" style="padding: 5px" icon="el-icon-edit" @click="handleEdit(scope.row)" v-hasPermi="['iot:firmware:edit']">{{ $t('update') }}</el-button>
                        <el-button size="small" type="primary" style="padding: 5px" icon="el-icon-info" @click="handleInfo(scope.row)" v-hasPermi="['iot:firmware:query']">{{ $t('detail') }}</el-button>
                        <el-button size="small" type="danger" style="padding: 5px" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:firmware:remove']">{{ $t('del') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改产品固件对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
                <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                    <el-form-item :label="$t('firmware.index.222541-0')" prop="firmwareName">
                        <el-input v-model="form.firmwareName" :placeholder="$t('firmware.index.222541-1')" />
                        <span style="font-size: 10px">{{ $t('firmware.index.222541-13') }}</span>
                    </el-form-item>

                    <el-form-item :label="$t('firmware.index.222541-2')" prop="productId">
                        <el-select v-model="form.productId" :placeholder="$t('firmware.index.222541-14')" @change="selectProduct">
                            <el-option v-for="product in productShortList" :key="product.id" :label="product.name" :value="product.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-15')" prop="version">
                        <el-input v-model="form.version" :placeholder="$t('firmware.index.222541-16')" type="number" step="0.1" />
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-17')" prop="isLatest">
                        <el-switch v-model="form.isLatest" active-text="" inactive-text="" :active-value="1" :inactive-value="0"></el-switch>
                        <el-link type="info" :underline="false" style="font-size: 12px; margin-left: 15px">{{ $t('firmware.index.222541-18') }}</el-link>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-19')" prop="filePath">
                        <fileUpload ref="file-upload" :value="form.filePath" :limit="1" :fileSize="10" :fileType="['bin', 'zip', 'pdf']" @input="getFilePath($event)"></fileUpload>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-11')" prop="remark">
                        <el-input v-model="form.remark" type="textarea" :placeholder="$t('firmware.index.222541-21')" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm">{{ $t('save') }}</el-button>
                    <el-button @click="cancel">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>

            <!-- 分组设备列表 -->
            <deviceList ref="deviceList" :upGrade="formUpGrade"></deviceList>

            <!-- 固件升级 -->
            <el-dialog :title="title" :visible.sync="openUpGrade" width="700px" append-to-body>
                <el-form ref="formUpGrade" :model="formUpGrade" :rules="rulesUpGrade" label-width="100px">
                    <el-form-item :label="$t('firmware.index.222541-0')" prop="firmwareName">
                        {{ form.firmwareName }}
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-2')" prop="productId">
                        {{ form.productName }}
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-15')" prop="version">Version {{ form.version }}</el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-20')" prop="taskName">
                        <el-input v-model="formUpGrade.taskName" :placeholder="$t('firmware.index.222541-22')" maxlength="20" />
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-23')" prop="upgradeType">
                        <el-radio-group v-model="formUpGrade.upgradeType" size="small" @change="changeUpgradeType">
                            <el-radio-button label="1" active>{{ $t('firmware.index.222541-24') }}</el-radio-button>
                            <el-radio-button label="2">{{ $t('firmware.index.222541-25') }}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-26')" prop="upVersion" v-if="formUpGrade.upgradeType == 1">
                        <el-select v-model="formUpGrade.upVersion" :placeholder="$t('firmware.index.222541-27')" @change="selectUpGradeVersion">
                            <el-option v-for="firmware in upGradeVersionList" :key="firmware.firmwareId" :label="firmware.firmwareName" :value="firmware.firmwareId">
                                <span style="float: left">{{ firmware.firmwareName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">V.{{ firmware.version }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-28')" prop="upType" v-if="formUpGrade.upgradeType == 1">
                        <el-select v-model="formUpGrade.upType" :placeholder="$t('firmware.index.222541-29')" clearable @change="changeUpType">
                            <el-option v-for="type in dict.type.oat_update_limit" :key="type.value" :label="type.label" :value="type.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-30')">
                        <el-badge :value="formUpGrade.deviceAmount" class="item">
                            <el-button type="primary" size="mini" plain class="mr5" @click="selectDeviceList">{{ $t('firmware.index.222541-31') }}</el-button>
                        </el-badge>
                        <el-tag :key="tag" v-for="tag in formUpGrade.deviceList" closable size="small" :disable-transitions="false" @close="handleClose(tag)">
                            {{ tag }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-32')" prop="bookTime">
                        <el-date-picker v-model="formUpGrade.bookTime" type="datetime" :placeholder="$t('firmware.index.222541-33')"></el-date-picker>
                    </el-form-item>
                    <el-form-item :label="$t('firmware.index.222541-34')" prop="taskDesc">
                        <el-input v-model="formUpGrade.taskDesc" type="textarea" :placeholder="$t('firmware.index.222541-35')" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitFormUpGrade">{{ $t('save') }}</el-button>
                    <el-button @click="canceUpGrade">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import fileUpload from '../../../components/FileUpload/index';
import deviceList from './device-list';
import { listShortProduct } from '@/api/iot/product';
import { listFirmware, upGradeVersionList, getFirmware, delFirmware, addFirmware, updateFirmware } from '@/api/iot/firmware';
import { addTask } from '@/api/iot/firmwareTask';
import { listDeviceByGroup } from '@/api/iot/device';
import { getToken } from '@/utils/auth';

export default {
    name: 'Firmware',
    dicts: ['iot_yes_no', 'oat_update_limit'],
    components: {
        fileUpload,
        deviceList,
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
            // 产品固件表格数据
            firmwareList: [],
            // 产品简短列表
            productShortList: [],
            // 待升级固件(小于当前版本的产品固件)
            upGradeVersionList: [],
            // 设备分组
            group: {},
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            //
            openUpGrade: false,
            queryUpGradeVersion: {
                productId: null,
                version: 0,
            },
            queryDeviceByVersion: {
                productId: null,
                firmwareVersion: 0,
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                firmwareName: null,
                productName: null,
                tenantName: null,
                isSys: null,
            },
            // 表单参数
            form: {
                version: 1.0,
            },
            // 表单校验
            rules: {
                firmwareName: [
                    {
                        required: true,
                        message: this.$t('firmware.index.222541-36'),
                        trigger: 'blur',
                    },
                ],
                productId: [
                    {
                        required: true,
                        message: this.$t('firmware.index.222541-37'),
                        trigger: 'blur',
                    },
                ],
                productName: [
                    {
                        required: true,
                        message: this.$t('firmware.index.222541-38'),
                        trigger: 'blur',
                    },
                ],
                version: [
                    {
                        required: true,
                        message: this.$t('firmware.index.222541-39'),
                        trigger: 'blur',
                    },
                ],
                filePath: [
                    {
                        required: true,
                        message: this.$t('firmware.index.222541-40'),
                        trigger: 'blur',
                    },
                ],
            },
            formUpGrade: {
                taskName: null,
                firmwareId: 0,
                deviceAmount: 0,
                bookTime: null,
                upgradeType: '1',
                upType: null,
                deviceList: [],
                version: null,
                flag: false,
            },
            rulesUpGrade: {
                taskName: [
                    {
                        required: true,
                        message: this.$t('firmware.index.222541-41'),
                        trigger: 'blur',
                    },
                ],
                // bookTime: [{
                //   required: true,
                //   message: "请设置预定时间",
                //   trigger: "blur"
                // }]
            },
            // 上传参数
            upload: {
                // 是否禁用上传
                isUploading: false,
                // 设置上传的请求头部
                headers: {
                    Authorization: 'Bearer ' + getToken(),
                },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + '/iot/tool/upload',
                // 上传的文件列表
                fileList: [],
            },
        };
    },
    created() {
        this.getList();
        this.getProductShortList();
    },
    methods: {
        /** 查看产品按钮操作 */
        handleViewProduct(productId) {
            this.$router.push({
                path: '/iot/product-edit',
                query: {
                    t: Date.now(),
                    productId: productId,
                },
            });
        },
        // 获取下载路径前缀
        getDownloadUrl(path) {
            return window.location.origin + process.env.VUE_APP_BASE_API + path;
        },
        /** 查询产品固件列表 */
        getList() {
            this.loading = true;
            listFirmware(this.queryParams).then((response) => {
                this.firmwareList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 查询产品简短列表 */
        getProductShortList() {
            listShortProduct().then((response) => {
                this.productShortList = response.data;
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
                firmwareId: null,
                firmwareName: null,
                productId: null,
                productName: null,
                tenantId: null,
                tenantName: null,
                isLatest: 0,
                isSys: null,
                version: 1.0,
                filePath: null,
                delFlag: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
            };
            // 固件升级表单
            this.formUpGrade = {
                taskName: null,
                firmwareId: 0,
                deviceAmount: 0,
                bookTime: null,
                upgradeType: '1',
                upType: null,
                deviceList: [],
                version: null,
                flag: false,
            };
            this.resetForm('form');
            this.resetForm('formUpGrade');
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
            this.ids = selection.map((item) => item.firmwareId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('firmware.index.222541-42');
            this.upload.fileList = [];
        },
        /** 修改按钮操作 */
        handleEdit(row) {
            this.reset();
            const firmwareId = row.firmwareId || this.ids;
            getFirmware(firmwareId).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = this.$t('firmware.index.222541-43');
                this.upload.fileList = [
                    {
                        name: this.form.firmwareName,
                        url: this.form.filePath,
                    },
                ];
            });
        },
        // 详情按钮
        handleInfo(row) {
            if (row) {
                sessionStorage.setItem('firmwareTaskInfo', JSON.stringify(row));
                this.$router.push({
                    name: 'FirmwareTask',
                });
            }
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.firmwareId != null) {
                        updateFirmware(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addFirmware(this.form).then((response) => {
                            this.$modal.msgSuccess(this.$t('addSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const firmwareIds = row.firmwareId || this.ids;
            this.$modal
                .confirm(this.$t('firmware.index.222541-44', [firmwareIds]))
                .then(function () {
                    return delFirmware(firmwareIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/firmware/export',
                {
                    ...this.queryParams,
                },
                `firmware_${new Date().getTime()}.xlsx`
            );
        },
        /** 选择产品 */
        selectProduct(val) {
            for (var i = 0; i < this.productShortList.length; i++) {
                if (this.productShortList[i].id == val) {
                    this.form.productName = this.productShortList[i].name;
                    return;
                }
            }
        },
        /** 切换升级类型*/
        changeUpgradeType(val) {
            this.resetDeviceList();
            if (val == 2) {
                this.formUpGrade.version = null;
            }
        },
        /** 升级范围 */
        changeUpType(val) {
            this.resetDeviceList();
            if (val == '1') {
                this.queryDeviceByVersion.productId = this.formUpGrade.productId;
                this.queryDeviceByVersion.firmwareVersion = this.formUpGrade.version;
                listDeviceByGroup(this.queryDeviceByVersion).then((response) => {
                    response.rows.forEach((row) => {
                        this.formUpGrade.deviceList.push(row.serialNumber);
                    });
                    this.formUpGrade.deviceAmount = response.total;
                });
            }
        },
        /** 选择待升级固件版本 */
        selectUpGradeVersion(val) {
            this.resetDeviceList();
            for (var i = 0; i < this.upGradeVersionList.length; i++) {
                if (this.upGradeVersionList[i].firmwareId == val) {
                    this.formUpGrade.version = this.upGradeVersionList[i].version;
                    return;
                }
            }
        },
        resetDeviceList() {
            this.formUpGrade.upType = this.formUpGrade.upType;
            this.formUpGrade.deviceList = [];
            this.formUpGrade.deviceAmount = 0;
        },
        /*选择设备*/
        selectDeviceList() {
            // 刷新子组件
            this.formUpGrade.flag = true;
            this.$refs.deviceList.openDeviceList = true;
        },
        // 移除选中设备
        handleClose(tag) {
            this.formUpGrade.deviceList.splice(this.formUpGrade.deviceList.indexOf(tag), 1);
            this.formUpGrade.deviceAmount = this.formUpGrade.deviceList.length;
        },
        // 获取文件路径
        getFilePath(data) {
            this.form.filePath = data;
        },
        // 文件提交处理
        submitUpload() {
            this.$refs.upload.submit();
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.isUploading = false;
            this.form.filePath = response.url;
            this.$modal.msgSuccess(response.msg);
        },
        // 文件下载处理
        handleDownload(row) {
            window.open(process.env.VUE_APP_BASE_API + row.filePath);
        },
        //ota升级
        otaUpGrade(row) {
            this.reset();
            const firmwareId = row.firmwareId || this.ids;
            getFirmware(firmwareId).then((response) => {
                this.form = response.data;
                this.openUpGrade = true;
                this.title = this.$t('firmware.index.222541-46');
                this.getUpGradeVersionList();
                this.formUpGrade.productId = this.form.productId;
                this.formUpGrade.firmwareId = firmwareId;
            });
        },
        submitFormUpGrade() {
            this.$refs['formUpGrade'].validate((valid) => {
                if (valid) {
                    if (this.formUpGrade.deviceAmount > 0) {
                        addTask(this.formUpGrade).then((response) => {
                            if (response.code == 200) {
                                this.$modal.msgSuccess(this.$t('updateSuccess'));
                                this.openUpGrade = false;
                                this.reset();
                            } else {
                                this.$modal.msgError(res.data.message);
                            }
                        });
                    } else {
                        this.$modal.msgError(this.$t('firmware.index.222541-47'));
                    }
                }
            });
        },
        canceUpGrade() {
            this.openUpGrade = false;
            this.reset();
        },
        /** 查询待升级固件版本简短列表 */
        getUpGradeVersionList() {
            this.queryUpGradeVersion.productId = this.form.productId;
            this.queryUpGradeVersion.version = this.form.version;
            upGradeVersionList(this.queryUpGradeVersion).then((response) => {
                this.upGradeVersionList = response.data;
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.el-tag + .el-tag {
    margin-left: 10px;
}

.item {
    margin-right: 10px;
}
</style>
