<template>
    <div style="padding: 6px">
        <el-card style="margin-bottom: 6px">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="60px" style="margin-bottom: -20px">
                <el-form-item :label="$t('sip.index.998533-0')" prop="deviceSipId">
                    <el-input v-model="queryParams.deviceSipId" :placeholder="$t('sip.index.998533-1')" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('sip.index.998533-2')" prop="channelSipId">
                    <el-input v-model="queryParams.channelSipId" :placeholder="$t('sip.index.998533-3')" clearable size="small" @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('sip.index.998533-4')" prop="status">
                    <el-select v-model="queryParams.status" :placeholder="$t('sip.index.998533-5')" clearable size="small">
                        <el-option v-for="dict in dict.type.sip_gen_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
                <el-form-item style="float: right">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:video:add']" :disabled="isGeneralUser">{{ $t('sip.index.998533-6') }}</el-button>
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple || isGeneralUser" @click="handleDelete" v-hasPermi="['iot:video:remove']">
                        {{ $t('sip.index.998533-7') }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card style="margin-bottom: 5px">
            <el-table v-loading="loading" :data="sipidList" @selection-change="handleSelectionChange" @cell-dblclick="celldblclick" size="">
                <el-table-column type="selection" :selectable="selectable" width="55" align="center" />
                <el-table-column :label="$t('device.device-edit.148398-7')" align="center" prop="deviceSipId">
                    <template slot-scope="scope">
                        <el-link :underline="false" type="primary" @click="handleViewDevice(scope.row.deviceSipId)">{{ scope.row.deviceSipId }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('sip.index.998533-2')" align="center" prop="channelSipId" />
                <el-table-column :label="$t('sip.index.998533-4')" align="center" prop="status" width="80">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_device_status" :value="scope.row.status" size="mini" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('sip.index.998533-8')" align="center" prop="productName" />
                <el-table-column :label="$t('sip.index.998533-9')" align="center" prop="deviceType">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.video_type" :value="scope.row.deviceType" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('sip.index.998533-15')" align="center" prop="channelType">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.channel_type" :value="scope.row.channelType" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('sip.index.998533-10')" align="center" prop="citycode" />
                <el-table-column :label="$t('sip.index.998533-11')" align="center" prop="registerTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.registerTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleBinding(scope.row)">{{ $t('sip.index.998533-12') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        </el-card>

        <el-dialog :title="title" :visible.sync="open" width="450px" append-to-body>
            <el-form :model="createForm" label-width="80px" ref="createForm">
                <el-form-item :label="$t('sip.index.998533-13')">
                    <el-cascader :options="cityOptions" v-model="createForm.city" @change="changeProvince" change-on-select></el-cascader>
                </el-form-item>
                <el-form-item :label="$t('sip.index.998533-9')" prop="deviceType">
                    <el-select v-model="createForm.deviceType" :placeholder="$t('sip.index.998533-14')">
                        <el-option v-for="dict in dict.type.video_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('sip.index.998533-15')" prop="channelType">
                    <el-select v-model="createForm.channelType" :placeholder="$t('sip.index.998533-16')">
                        <el-option v-for="dict in dict.type.channel_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('sip.index.998533-8')" prop="productName">
                    <el-input readonly v-model="createForm.productName" :placeholder="$t('sip.index.998533-17')">
                        <el-button slot="append" @click="selectProduct()">{{ $t('sip.index.998533-18') }}</el-button>
                    </el-input>
                </el-form-item>
                <el-form-item :label="$t('sip.index.998533-20')" prop="createNum">
                    <el-input-number controls-position="right" v-model="createForm.createNum" :max="10" :placeholder="$t('sip.index.998533-19')" type="number" style="width: 330px" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">{{ $t('sip.index.998533-21') }}</el-button>
                <el-button @click="cancel">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="title" :visible.sync="bindingOpen" width="450px" append-to-body>
            <el-form :model="form" label-width="80px" ref="form">
                <el-form-item :label="$t('sip.index.998533-22')" prop="deviceId">
                    <el-select style="width: 210px" v-model="form.reDeviceId" size="small" :placeholder="$t('sip.index.998533-23')" filterable @change="handleUpdateDeviceItem(scope.row, $event)">
                        <el-option v-for="(item, index) in deviceList" :key="index" :label="item.deviceName" :disabled="item.deviceType === 3" :value="item.deviceId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('sip.index.998533-24')" prop="sceneId">
                    <el-select style="width: 210px" v-model="form.reSceneModelId" size="small" :placeholder="$t('sip.index.998533-25')" filterable>
                        <el-option v-for="(item, index) in sceneList" :key="index" :label="item.sceneModelName" :value="item.sceneModelId"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormBinding" v-hasPermi="['iot:relation:add']">{{ $t('confirm') }}</el-button>
                <el-button @click="cancelBinding">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>

        <!-- 选择产品 -->
        <product-list ref="productList" @productEvent="getProductData($event)" />
    </div>
</template>

<style>
.createNum {
    width: 300px;
}

.createNum input {
    width: 260px;
}
</style>

<script>
import { getDeviceBySerialNumber, listDeviceShort } from '@/api/iot/device';
import { regionData, CodeToText } from 'element-china-area-data';
import { listChannel, getChannel, delChannel, addChannel, binding } from '@/api/iot/channel';
import productList from './product-list.vue';
import { getSceneModelList } from '@/api/scene/list';

export default {
    name: 'Sip',
    dicts: ['iot_device_status', 'video_type', 'channel_type'],
    components: {
        productList,
    },
    props: {
        product: {
            type: Object,
            default: null,
        },
    },
    watch: {
        // 获取到父组件传递的productId后，刷新列表
        product: function (newVal, oldVal) {
            this.productInfo = newVal;
            if (this.productInfo && this.productInfo.productId != 0) {
                this.queryParams.productId = this.productInfo.productId;
                this.deviceParams.productId = this.productInfo.productId;
                this.getList();
            }
        },
    },
    data() {
        return {
            // 是否普通用户
            isGeneralUser: true,
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非多个禁用
            multiple: true,
            // 总条数
            total: 0,
            // sipid表格数据
            sipidList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            //绑定弹窗
            bindingOpen: false,
            /*选择设备列表*/
            deviceList: [],
            //场景列表
            sceneList: [],
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                deviceSipId: null,
                deviceChannelId: null,
                status: null,
            },
            // 表单参数
            createForm: {
                city: '',
                deviceType: '',
                channelType: '',
                createNum: 1,
                remark: '',
                area: '',
            },
            form: {},
            // 产品
            productInfo: {},
            // 城市
            cityOptions: regionData,
            city: '',
            // 表单校验
            rules: {
                protocol: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-26'),
                        trigger: 'blur',
                    },
                ],
                ip: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-27'),
                        trigger: 'blur',
                    },
                ],
                domain: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-28'),
                        trigger: 'blur',
                    },
                ],
                secret: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-29'),
                        trigger: 'blur',
                    },
                ],
                portHttp: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-30'),
                        trigger: 'blur',
                    },
                ],
                portHttps: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-31'),
                        trigger: 'blur',
                    },
                ],
                portRtmp: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-32'),
                        trigger: 'blur',
                    },
                ],
                portRtsp: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-33'),
                        trigger: 'blur',
                    },
                ],
                rtpPortRange: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-34'),
                        trigger: 'blur',
                    },
                ],
                delFlag: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-35'),
                        trigger: 'blur',
                    },
                ],
                createBy: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-36'),
                        trigger: 'blur',
                    },
                ],
                createTime: [
                    {
                        required: true,
                        message: this.$t('sip.index.998533-37'),
                        trigger: 'blur',
                    },
                ],
            },
        };
    },
    created() {
        // 普通用户只能查看自己的通道
        if (this.$store.state.user.roles.indexOf('general') === -1) {
            this.isGeneralUser = false;
        }
        this.getList();
        this.getDeviceList();
        this.getSceneListDatas();
    },
    methods: {
        /** 查看设备操作 */
        handleViewDevice(serialNumber) {
            this.$router.push({
                path: '/iot/device',
                query: {
                    t: Date.now(),
                    sn: serialNumber,
                },
            });
        },
        /**选择产品 */
        selectProduct() {
            this.open = false;
            this.$refs.productList.open = true;
            this.$refs.productList.getList();
        },
        /**获取选中的产品 */
        getProductData(product) {
            this.open = true;
            this.createForm.productId = product.productId;
            this.createForm.productName = product.productName;
            this.createForm.tenantId = product.tenantId;
            this.createForm.tenantName = product.tenantName;
        },
        /** 行政区划改变 **/
        changeProvince(data) {
            if (data && data[0] != null && data[1] != null && data[2] != null) {
                const str = CodeToText[data[0]] + '/' + CodeToText[data[1]] + '/' + CodeToText[data[2]];
                this.createForm.citycode = str;
            }
        },
        /**获取设备详情*/
        getDeviceBySerialNumber(serialNumber) {
            this.openDevice = true;
            getDeviceBySerialNumber(serialNumber).then((response) => {
                this.device = response.data;
            });
        },
        /** 查询通道列表 */
        getList() {
            listChannel(this.queryParams).then((response) => {
                this.sipidList = response.rows;
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
            this.createForm = {
                id: null,
                deviceSipId: null,
                channelSipId: null,
                status: 0,
                registertime: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
                createNum: 1,
            };
            this.resetForm('createForm');
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.loading = true;
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
            this.ids = selection.map((item) => item.id);
            this.multiple = !selection.length;
        },
        /** 批量新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('sip.index.998533-38');
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            console.log(row);
            getChannel(id).then((response) => {
                this.createForm = response.data;
                this.open = true;
                this.title = this.$t('sip.index.998533-39');
            });
        },
        handleBinding(row) {
            this.form = row;
            this.bindingOpen = true;
            this.title = this.$t('sip.index.998533-40');
        },

        // 获取设备列表
        getDeviceList() {
            const params = {
                showChild: true,
                pageNum: 1,
                pageSize: 9999,
            };
            listDeviceShort(params).then((res) => {
                if (res.code === 200) {
                    this.deviceList = res.rows;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取场景列表数据
        getSceneListDatas() {
            const params = {
                pageNum: 1,
                pageSize: 9999,
            };
            getSceneModelList(params).then((res) => {
                if (res.code === 200) {
                    this.sceneList = res.rows;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        cancelBinding() {
            this.bindingOpen = false;
            this.reset();
        },
        /*确认绑定设备或场景*/
        submitFormBinding() {
            const data = {
                channelId: this.form.channelSipId,
                reDeviceId: this.form.reDeviceId,
                reSceneModelId: this.form.reSceneModelId,
            };
            binding(data).then((response) => {
                if (response.code === 200) {
                    this.bindingOpen = false;
                    this.$message.success(this.$t('sip.index.998533-41'));
                } else {
                    this.$message.error(response.msg);
                }
            });
        },
        /** 提交按钮 */
        submitForm() {
            if (this.createForm.createNum < 1) {
                this.$modal.alertError(this.$t('sip.index.998533-42'));
                return;
            }
            if (!this.createForm.productId || this.createForm.productId == 0) {
                this.$modal.alertError(this.$t('sip.index.998533-43'));
                return;
            }
            this.createForm.deviceSipId = this.createForm.city[2] + '0000' + this.createForm.deviceType + '0';
            this.createForm.channelSipId = this.createForm.city[2] + '0000' + this.createForm.channelType + '0';
            if (this.createForm.deviceType !== '' && this.createForm.channelType !== '' && this.createForm.city.length === 3) {
                console.log(this.createForm);
                addChannel(this.createForm.createNum, this.createForm).then((response) => {
                    this.$modal.msgSuccess(this.$t('addSuccess'));
                    this.open = false;
                    this.getList();
                });
            } else {
                this.$message({
                    type: 'error',
                    message: this.$t('sip.index.998533-44'),
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const sipIds = row.id || this.ids;
            this.$modal
                .confirm(this.$t('sip.index.998533-45') + sipIds + this.$t('notify.channel.index.333541-18'))
                .then(function () {
                    return delChannel(sipIds);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },

        //禁用有绑定设备的复选框,status:1=未使用，2=已使用
        selectable(row) {
            if (row.status == 2 || this.isGeneralUser) {
                return false;
            }
            return true;
        },
        //表格增加复制功能
        celldblclick(row, column, cell, event) {
            this.$copyText(row[column.property]).then(
                (e) => {
                    this.onCopy();
                },
                function (e) {
                    this.onError();
                }
            );
        },
        onCopy() {
            this.$notify({
                title: this.$t('success'),
                message: this.$t('sip.index.998533-46'),
                type: 'success',
                offset: 50,
                duration: 2000,
            });
        },
        onError() {
            this.$notify({
                title: this.$t('fail'),
                message: this.$t('sip.index.998533-47'),
                type: 'error',
                offset: 50,
                duration: 2000,
            });
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
