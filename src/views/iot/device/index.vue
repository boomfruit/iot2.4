<template>
    <div style="padding: 6px">
        <el-card style="margin-bottom: 6px">
            <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="75px" v-show="showSearch">
                <el-form-item :label="$t('device.index.105953-0')" prop="deviceName">
                    <el-input v-model="queryParams.deviceName" :placeholder="$t('device.index.105953-1')" clearable size="small" @keyup.enter.native="handleQuery" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('device.index.105953-2')" prop="serialNumber">
                    <el-input v-model="queryParams.serialNumber" :placeholder="$t('device.index.105953-3')" clearable size="small" @keyup.enter.native="handleQuery" style="width: 150px" />
                </el-form-item>
                <el-form-item :label="$t('device.index.105953-4')" prop="status">
                    <el-select v-model="queryParams.status" :placeholder="$t('device.index.105953-5')" clearable size="small" style="width: 150px">
                        <el-option v-for="dict in dict.type.iot_device_status" :key="dict.value" :label="dict.label" :value="dict.value" />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('device.index.105953-6')">
                    <el-select v-model="queryParams.groupId" :placeholder="$t('device.index.105953-7')" clearable size="small" style="width: 150px">
                        <el-option v-for="group in myGroupList" :key="group.groupId" :label="group.groupName" :value="group.groupId" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('device.index.105953-8') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('device.index.105953-9') }}</el-button>
                </el-form-item>
            </el-form>
            <el-row :gutter="10" class="mb8" v-show="FuncBtn">
                <el-col :span="1.5">
                    <el-dropdown @command="(command) => handleCommand(command)" v-hasPermi="['iot:device:add']">
                        <el-button size="mini" type="primary" plain>
                            {{ $t('device.index.105953-10') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleEditDevice" v-hasPermi="['iot:device:add']">{{ $t('device.index.105953-11') }}</el-dropdown-item>
                            <el-dropdown-item command="handleBatchImport" v-hasPermi="['iot:device:add']">{{ $t('device.index.105953-12') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="1.5">
                    <el-dropdown @command="(command) => handleCommand1(command)" v-hasPermi="['iot:device:assignment']">
                        <el-button size="mini" type="primary" plain>
                            {{ $t('device.index.105953-13') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="handleSelectAllot" v-hasPermi="['iot:device:assignment']">{{ $t('device.index.105953-14') }}</el-dropdown-item>
                            <el-dropdown-item command="handleImportAllot" v-hasPermi="['iot:device:assignment']">{{ $t('device.index.105953-15') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="1.5">
                    <el-button size="mini" type="primary" plain @click="recycleDevice" v-hasPermi="['iot:device:recovery']">{{ $t('device.index.105953-16') }}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-dropdown @command="(command) => handleCommandMore(command)" v-hasPermi="['iot:device:record:list', 'iot:device:batchGenerator']">
                        <el-button size="mini" type="primary" plain>
                            {{ $t('device.index.105953-48') }}
                            <i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="importRecord" v-hasPermi="['iot:device:record:list']">{{ $t('device.index.105953-49') }}</el-dropdown-item>
                            <el-dropdown-item command="generateSerialNumber" v-hasPermi="['iot:device:batchGenerator']">{{ $t('device.index.105953-50') }}</el-dropdown-item>
                            <el-dropdown-item command="recycleRecord" v-hasPermi="['iot:device:record:list']">{{ $t('device.index.105953-51') }}</el-dropdown-item>
                            <el-dropdown-item command="allotRecord" v-hasPermi="['iot:device:record:list']">{{ $t('device.index.105953-52') }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
                <el-col :span="1.5">
                    <el-checkbox v-model="queryParams.showChild" style="margin: 5px 0 0" @change="handleQuery">{{ $t('device.index.105953-18') }}</el-checkbox>
                    <el-tooltip :content="$t('device.index.105953-19')" placement="top"><i class="el-icon-question"></i></el-tooltip>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
        </el-card>

        <el-card style="padding-bottom: 100px" v-if="showType == 'list'">
            <el-table style="height: 680px; background-color: #0d1827" v-loading="loading" :data="deviceList" border>
                <el-table-column :label="$t('device.index.105953-20')" align="center" header-align="center" prop="deviceId" width="50" />
                <el-table-column :label="$t('device.index.105953-0')" align="center" header-align="center" prop="deviceName" min-width="120" />
                <el-table-column :label="$t('device.index.105953-2')" align="center" prop="serialNumber" min-width="130" />
                <el-table-column :label="$t('device.index.105953-21')" align="center" prop="productName" min-width="120" />
                <el-table-column :label="$t('device.index.105953-22')" align="center" prop="transport" min-width="50" />
                <el-table-column :label="$t('device.index.105953-23')" align="center" prop="protocolCode" min-width="100" />
                <el-table-column :label="$t('device.index.105953-24')" align="center" prop="subDeviceCount" width="80">
                    <template slot-scope="scope">
                        {{ scope.row.subDeviceCount }}
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.index.105953-25')" align="center" prop="isShadow" width="80">
                    <template slot-scope="scope">
                        <el-tag type="success" size="small" v-if="scope.row.isShadow == 1">{{ $t('device.index.105953-26') }}</el-tag>
                        <el-tag type="info" size="small" v-else>{{ $t('device.index.105953-27') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.index.105953-28')" align="center" prop="status" width="80">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_device_status" :value="scope.row.status" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.index.105953-29')" align="center" prop="rssi" width="60">
                    <template slot-scope="scope">
                        <svg-icon v-if="scope.row.status == 3 && scope.row.rssi >= '-55'" icon-class="wifi_4" />
                        <svg-icon v-else-if="scope.row.status == 3 && scope.row.rssi >= '-70' && scope.row.rssi < '-55'" icon-class="wifi_3" />
                        <svg-icon v-else-if="scope.row.status == 3 && scope.row.rssi >= '-85' && scope.row.rssi < '-70'" icon-class="wifi_2" />
                        <svg-icon v-else-if="scope.row.status == 3 && scope.row.rssi >= '-100' && scope.row.rssi < '-85'" icon-class="wifi_1" />
                        <svg-icon v-else icon-class="wifi_0" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.index.105953-30')" align="center" prop="locationWay">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.iot_location_way" :value="scope.row.locationWay" size="small" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.index.105953-31')" align="center" prop="firmwareVersion">
                    <template slot-scope="scope">
                        <el-tag size="mini" type="info">Ver {{ scope.row.firmwareVersion }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.index.105953-32')" align="center" prop="activeTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.activeTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('device.index.105953-33')" align="center" prop="createTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>

                <el-table-column :label="$t('device.index.105953-34')" align="center" class-name="small-padding fixed-width" width="200">
                    <template slot-scope="scope">
                        <el-button type="danger" size="small" style="padding: 5px" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:device:remove']">{{ $t('device.index.105953-35') }}</el-button>
                        <el-button size="small" style="padding: 5px" icon="el-icon-view" @click="handleEditDevice(scope.row)" v-hasPermi="['iot:device:query']">
                            {{ $t('device.index.105953-36') }}
                        </el-button>
                        <el-button size="small" style="padding: 5px" @click="openSummaryDialog(scope.row)" v-if="form.deviceId != 0" v-hasPermi="['iot:device:query']">
                            {{ $t('device.index.105953-37') }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :pageSizes="[12, 24, 36, 60]" @pagination="getList" />
        </el-card>

        <el-card style="padding-bottom: 100px" v-if="showType == 'card'">
            <el-row :gutter="30" v-loading="loading">
                <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="6" v-for="(item, index) in deviceList" :key="index" style="margin-bottom: 30px; text-align: center">
                    <el-card :body-style="{ padding: '20px' }" shadow="always" class="card-item">
                        <el-row type="flex" :gutter="10" justify="space-between">
                            <el-col :span="20" style="text-align: left">
                                <el-link type="" :underline="false" @click="handleDeviceDetail(item)" style="font-weight: bold; font-size: 16px; line-height: 32px">
                                    <el-tooltip class="item" effect="dark" :content="$t('device.index.105953-38')" placement="top-start">
                                        <svg-icon icon-class="share" style="font-size: 20px" v-if="item.isOwner != 1" />
                                    </el-tooltip>
                                    <svg-icon icon-class="device" v-if="item.isOwner == 1" />
                                    <span style="margin: 0 5px">{{ item.deviceName }}</span>
                                    <!-- <el-tag size="mini" type="info">Ver {{item.firmwareVersion}}</el-tag>-->
                                    <!-- <el-text v-if="item.protocolCode" type="info" size="mini" style="font-size: 14px; color: #ccc">{{ item.protocolCode }}</el-text> -->
                                </el-link>
                            </el-col>
                            <el-col :span="1.5" style="font-size: 20px; padding-top: 5px; cursor: pointer">
                                <svg-icon icon-class="qrcode" @click="openSummaryDialog(item)" v-hasPermi="['iot:device:query']" />
                            </el-col>
                            <el-col :span="3">
                                <div style="font-size: 28px; color: #ccc">
                                    <svg-icon v-if="item.status == 3 && item.rssi >= '-55'" icon-class="wifi_4" />
                                    <svg-icon v-else-if="item.status == 3 && item.rssi >= '-70' && item.rssi < '-55'" icon-class="wifi_3" />
                                    <svg-icon v-else-if="item.status == 3 && item.rssi >= '-85' && item.rssi < '-70'" icon-class="wifi_2" />
                                    <svg-icon v-else-if="item.status == 3 && item.rssi >= '-100' && item.rssi < '-85'" icon-class="wifi_1" />
                                    <svg-icon v-else icon-class="wifi_0" />
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="10">
                            <el-col :span="17">
                                <div style="text-align: left; line-height: 40px; white-space: nowrap">
                                    <dict-tag :options="dict.type.iot_device_status" :value="item.status" size="mini" style="display: inline-block" />
                                    <span style="display: inline-block; margin: 0 10px">
                                        <!-- <el-tag type="success" size="small" v-if="item.isShadow == 1">影子</el-tag>
                                        <el-tag type="info" size="small" v-else>影子</el-tag> -->
                                        <el-tag type="primary" size="mini" v-if="item.protocolCode">{{ item.protocolCode }}</el-tag>
                                    </span>
                                    <el-tag type="primary" size="mini" v-if="item.transport">{{ item.transport }}</el-tag>
                                    <el-tag type="danger" size="mini" style="display: inline-block; margin: 0 0 0 10px" v-if="item.alertCount">
                                        {{ $t('device.index.105953-53') }}{{ item.alertCount.unprocessedCount }}
                                    </el-tag>
                                    <!-- <dict-tag :options="dict.type.iot_location_way" :value="item.locationWay" size="small" style="display:inline-block;" /> -->
                                    <!-- <dict-tag :options="dict.type.iot_transport_type" :value="item.transport" size="small" style="display: inline-block" /> -->
                                </div>
                                <el-descriptions :column="1" size="mini" style="white-space: nowrap">
                                    <el-descriptions-item :label="$t('device.index.105953-20')">
                                        {{ item.serialNumber }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :label="$t('device.index.105953-39')">
                                        {{ item.productName }}
                                    </el-descriptions-item>
                                    <el-descriptions-item :label="$t('device.index.105953-32')">
                                        {{ parseTime(item.activeTime, '{y}-{m}-{d}') }}
                                    </el-descriptions-item>
                                </el-descriptions>
                            </el-col>
                            <el-col :span="7">
                                <div style="margin-top: 10px">
                                    <el-image
                                        style="width: 100%; height: 100px; border-radius: 10px"
                                        lazy
                                        :preview-src-list="[baseUrl + item.imgUrl]"
                                        :src="baseUrl + item.imgUrl"
                                        fit="cover"
                                        v-if="item.imgUrl != null && item.imgUrl != ''"
                                    ></el-image>
                                    <el-image
                                        style="width: 100%; height: 100px; border-radius: 10px"
                                        :preview-src-list="[require('@/assets/images/gateway.png')]"
                                        :src="require('@/assets/images/gateway.png')"
                                        fit="cover"
                                        v-else-if="item.deviceType == 2"
                                    ></el-image>
                                    <el-image
                                        style="width: 100%; height: 100px; border-radius: 10px"
                                        :preview-src-list="[require('@/assets/images/video.png')]"
                                        :src="require('@/assets/images/video.png')"
                                        fit="cover"
                                        v-else-if="item.deviceType == 3"
                                    ></el-image>
                                    <el-image
                                        style="width: 100%; height: 100px; border-radius: 10px"
                                        :preview-src-list="[require('@/assets/images/product.png')]"
                                        :src="require('@/assets/images/product.png')"
                                        fit="cover"
                                        v-else
                                    ></el-image>
                                </div>
                            </el-col>
                        </el-row>
                        <el-button-group style="margin-top: 15px">
                            <el-button type="danger" size="mini" style="padding: 5px 10px" icon="el-icon-delete" @click="handleDelete(item)" v-hasPermi="['iot:device:remove']">
                                {{ $t('device.index.105953-35') }}
                            </el-button>
                            <el-button type="primary" size="mini" style="padding: 5px 15px" icon="el-icon-view" @click="handleEditDevice(item, 'basic')" v-hasPermi="['iot:device:query']">
                                {{ $t('device.index.105953-36') }}
                            </el-button>
                            <el-button type="success" size="mini" style="padding: 5px 15px" icon="el-icon-odometer" @click="handleRunDevice(item)" v-hasPermi="['iot:device:query']">
                                {{ $t('device.index.105953-40') }}
                            </el-button>
                        </el-button-group>
                    </el-card>
                </el-col>
            </el-row>
            <el-empty :description="$t('device.index.105953-41')" v-if="total == 0"></el-empty>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" :pageSizes="[12, 24, 36, 60]" @pagination="getList" />
        </el-card>
        <!-- 二维码 -->
        <el-dialog :visible.sync="openSummary" width="300px" append-to-body>
            <div style="border: 1px solid #ccc; width: 220px; text-align: center; margin: 0 auto; margin-top: -15px">
                <vue-qr :text="qrText" :size="200"></vue-qr>
                <div style="padding-bottom: 10px">{{ $t('device.index.105953-42') }}</div>
            </div>
        </el-dialog>

        <el-dialog :title="$t('device.index.105953-54')" :visible.sync="openGenerate" width="500px" append-to-body>
            <el-form v-model="elForm" style="height: 100%; padding: 0 20px">
                <el-form-item label-width="80px" :label="$t('device.index.105953-55')">
                    <el-input v-model="elForm.count" type="number" style="width: 240px" :max="200" oninput="if(value>200)value=200;if(value<0)value=0"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm" v-hasPermi="['iot:device:batchGenerator']">{{ $t('device.index.105953-56') }}</el-button>
                <el-button @click="openGenerate = false">{{ $t('device.index.105953-57') }}</el-button>
            </div>
        </el-dialog>
        <!-- 批量导入设备 -->
        <batchImport ref="batchImport" @save="saveDialog"></batchImport>
        <!-- 导入分配 -->
        <allotImport ref="allotImport" @save="saveAllotDialog"></allotImport>
        <!-- 导入记录 -->
        <importRecord ref="importRecord"></importRecord>
        <!-- 设备回收记录 -->
        <recycleRecord ref="recycleRecord"></recycleRecord>
        <!-- 设备分配记录 -->
        <allotRecord ref="allotRecord"></allotRecord>
    </div>
</template>

<script>
import vueQr from 'vue-qr';
import { listDeviceShort, delDevice } from '@/api/iot/device';
import { listGroup } from '@/api/iot/group';
import { delSipDeviceBySipId } from '@/api/iot/sipdevice';
import auth from '@/plugins/auth';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import batchImport from './batch-import-dialog';
import allotImport from './allot-import-dialog';
import importRecord from './import-record';
import recycleRecord from './recycle-record';
import allotRecord from './allot-record';
export default {
    name: 'Device',
    dicts: ['iot_device_status', 'iot_is_enable', 'iot_location_way', 'iot_transport_type'],
    components: {
        vueQr,
        Treeselect,
        batchImport,
        allotImport,
        importRecord,
        recycleRecord,
        allotRecord,
    },
    data() {
        return {
            // 二维码内容
            qrText: 'SUNSEEN',
            // 打开设备配置对话框
            openSummary: false,
            openGenerate: false,
            // 显示搜索条件
            showSearch: true,
            // 展示方式
            showType: 'list',
            // 遮罩层
            loading: true,
            // 总条数
            total: 0,
            // 设备列表数据
            deviceList: [],
            // 我的分组列表数据
            myGroupList: [],
            // 根路径
            baseUrl: process.env.VUE_APP_BASE_API,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 12,
                showChild: true,
                deviceName: null,
                productId: null,
                groupId: null,
                productName: null,
                userId: null,
                userName: null,
                tenantId: null,
                tenantName: null,
                serialNumber: null,
                status: null,
                networkAddress: null,
                activeTime: null,
            },
            // 表单参数
            form: {
                productId: 0,
                status: 1,
                locationWay: 1,
                firmwareVersion: 1.0,
                serialNumber: '',
                deviceType: 1,
                isSimulate: 0,
            },
            productList: [],
            elForm: {
                count: 1,
            },
            // 批量导入参数
            isSubDev: false,
            FuncBtn: true,
        };
    },
    created() {
        // 产品筛选
        let productId = this.$route.query.productId;
        if (productId != null) {
            this.queryParams.productId = Number(productId);
            this.queryParams.groupId = null;
            this.queryParams.serialNumber = null;
        }
        // 分组筛选
        let groupId = this.$route.query.groupId;
        if (groupId != null) {
            this.queryParams.groupId = Number(groupId);
            this.queryParams.productId = null;
            this.queryParams.serialNumber = null;
        }
        // 设备编号筛选
        let sn = this.$route.query.sn;
        if (sn != null) {
            this.queryParams.serialNumber = sn;
            this.queryParams.productId = null;
            this.queryParams.groupId = null;
        }
        this.connectMqtt();
        if (this.$store.state.user.roles[0] == 'sysShowUser') {
            this.FuncBtn = false;
        }
    },
    activated() {
        const time = this.$route.query.t;
        if (time != null && time != this.uniqueId) {
            this.uniqueId = time;
            // 页码筛选
            let pageNum = this.$route.query.pageNum;
            if (pageNum != null) {
                this.queryParams.pageNum = Number(pageNum);
            }
            // 产品筛选
            let productId = this.$route.query.productId;
            if (productId != null) {
                this.queryParams.productId = Number(productId);
                this.queryParams.groupId = null;
                this.queryParams.serialNumber = null;
            }
            // 分组筛选
            let groupId = this.$route.query.groupId;
            if (groupId != null) {
                this.queryParams.groupId = Number(groupId);
                this.queryParams.productId = null;
                this.queryParams.serialNumber = null;
            }
            // 设备编号筛选
            let sn = this.$route.query.sn;
            if (sn != null) {
                this.queryParams.serialNumber = sn;
                this.queryParams.productId = null;
                this.queryParams.groupId = null;
            }
            this.getList();
        }
    },
    methods: {
        /* 连接Mqtt消息服务器 */
        async connectMqtt() {
            if (this.$mqttTool.client == null) {
                await this.$mqttTool.connect();
            }
            // 删除所有message事件监听器
            this.$mqttTool.client.removeAllListeners('message');
            // 添加message事件监听器
            this.mqttCallback();
            this.getList();
        },
        /* Mqtt回调处理  */
        mqttCallback() {
            this.$mqttTool.client.on('message', (topic, message, buffer) => {
                let topics = topic.split('/');
                let productId = topics[1];
                let deviceNum = topics[2];
                message = JSON.parse(message.toString());
                if (!message) {
                    return;
                }
                if (topics[3] == 'status') {
                    console.log(this.$t('device.index.105953-43'), topic);
                    console.log(this.$t('device.index.105953-44'), message);
                    // 更新列表中设备的状态
                    for (let i = 0; i < this.deviceList.length; i++) {
                        if (this.deviceList[i].serialNumber == deviceNum) {
                            this.deviceList[i].status = message.status;
                            this.deviceList[i].isShadow = message.isShadow;
                            this.deviceList[i].rssi = message.rssi;
                            return;
                        }
                    }
                }
            });
        },
        // 新增设备更多操作触发
        handleCommand(command) {
            switch (command) {
                case 'handleEditDevice':
                    this.handleEditDevice(0);
                    break;
                case 'handleBatchImport':
                    this.handleBatchImport();
                    break;
                default:
                    break;
            }
        },
        //批量导入设备
        handleBatchImport() {
            this.$refs.batchImport.upload.importDeviceDialog = true;
            this.$refs.batchImport.importForm.productId = null;
        },
        //导入分配设备
        handleImportAllot() {
            this.$refs.allotImport.upload.importAllotDialog = true;
            this.$refs.allotImport.allotForm.productId = null;
            this.$refs.allotImport.allotForm.deptId = null;
        },
        // dialog 保存响应
        saveDialog() {
            this.getList();
        },
        // dialog 保存响应
        saveAllotDialog() {
            this.getList();
        },
        // 分配设备更多操作触发
        handleCommand1(command) {
            switch (command) {
                case 'handleSelectAllot':
                    this.handleSelectAllot();
                    break;
                case 'handleImportAllot':
                    this.handleImportAllot();
                    break;
                default:
                    break;
            }
        },
        //跳转选择分配设备页面
        handleSelectAllot() {
            this.$router.push({
                path: '/iot/device-select-allot',
            });
        },
        //跳转回收设备页面
        recycleDevice() {
            this.$router.push({
                path: '/iot/device-recycle',
            });
        },
        //更多操作
        handleCommandMore(command) {
            switch (command) {
                case 'importRecord':
                    this.handleImportRecord();
                    break;
                case 'generateSerialNumber':
                    this.generateSerialNumber();
                    break;
                case 'recycleRecord':
                    this.handleRecycleRecord();
                    break;
                case 'allotRecord':
                    this.handleAllotRecord();
                    break;
                default:
                    break;
            }
        },
        //导入记录
        handleImportRecord() {
            this.$refs.importRecord.open = true;
            this.$refs.importRecord.getList();
        },
        //设备回收记录
        handleRecycleRecord() {
            this.$refs.recycleRecord.open = true;
            this.$refs.recycleRecord.getList();
        },
        //设备分配记录
        handleAllotRecord() {
            this.$refs.allotRecord.open = true;
            this.$refs.allotRecord.getList();
        },
        //生成设备编号
        generateSerialNumber() {
            this.openGenerate = true;
        },
        //生成设备编号确定操作
        submitForm() {
            this.download(
                'iot/device/batchGenerator',
                {
                    ...this.elForm,
                },
                `batchGenerator_${new Date().getTime()}.xlsx`
            );
            this.openGenerate = false;
        },
        openSummaryDialog(row) {
            let json = {
                type: 1, // 1=扫码关联设备
                deviceNumber: row.serialNumber,
                productId: row.productId,
                productName: row.productName,
            };
            this.qrText = JSON.stringify(json);
            this.openSummary = true;
        },
        /* 订阅消息 */
        mqttSubscribe(list) {
            // 订阅当前页面设备状态和实时监测
            let topics = [];
            for (let i = 0; i < list.length; i++) {
                let topicStatus = '/' + '+' + '/' + list[i].serialNumber + '/status/post';
                topics.push(topicStatus);
            }
            this.$mqttTool.subscribe(topics);
        },
        /** 查询设备分组列表 */
        getGroupList() {
            this.loading = true;
            let queryParams = {
                pageSize: 30,
                pageNum: 1,
                userId: this.$store.state.user.userId,
            };
            listGroup(queryParams).then((response) => {
                this.myGroupList = response.rows;
            });
        },
        /** 查询所有简短设备列表 */
        getList() {
            this.loading = true;
            this.queryParams.params = {};
            this.getGroupList();
            listDeviceShort(this.queryParams).then((response) => {
                this.deviceList = response.rows;
                this.total = response.total;
                // 订阅消息
                if (this.deviceList && this.deviceList.length > 0) {
                    this.mqttSubscribe(this.deviceList);
                }
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
            this.queryParams.productId = null;
            this.queryParams.groupId = null;
            this.queryParams.serialNumber = null;
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 切换显示方式 */
        handleChangeShowType() {
            this.showType = this.showType == 'card' ? 'list' : 'card';
        },
        // 点击名称查看
        handleDeviceDetail(item) {
            if (auth.hasPermi('iot:device:query')) {
                this.handleEditDevice(item);
            }
        },
        /** 修改按钮操作 */
        handleEditDevice(row, activeName) {
            let deviceId = 0;
            let isSubDev = 0;
            if (row != 0) {
                deviceId = row.deviceId || this.ids;
                isSubDev = row.subDeviceCount > 0 ? 1 : 0;
            }
            this.$router.push({
                path: '/iot/device-edit',
                query: {
                    deviceId: deviceId,
                    isSubDev: isSubDev,
                    pageNum: this.queryParams.pageNum,
                    activeName: activeName,
                },
            });
        },
        /** 运行状态按钮操作 */
        handleRunDevice(row) {
            let deviceId = 0;
            let isSubDev = 0;
            if (row != 0) {
                deviceId = row.deviceId || this.ids;
                isSubDev = row.subDeviceCount > 0 ? 1 : 0;
            }
            if (row.deviceType === 3) {
                this.$router.push({
                    path: '/iot/device-edit',
                    query: {
                        deviceId: deviceId,
                        isSubDev: isSubDev,
                        pageNum: this.queryParams.pageNum,
                        activeName: 'sipChannel',
                    },
                });
            } else {
                this.$router.push({
                    path: '/iot/device-edit',
                    query: {
                        deviceId: deviceId,
                        isSubDev: isSubDev,
                        pageNum: this.queryParams.pageNum,
                        activeName: 'runningStatus',
                    },
                });
            }
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const deviceIds = row.deviceId || this.ids;
            console.log(deviceIds, 'deviceIds');
            this.$modal.confirm(this.$t('device.index.105953-45', [deviceIds])).then(function () {
                if (row.deviceType === 3) {
                    // delSipDeviceBySipId(row.serialNumber);
                }
                // return delDevice(deviceIds);
            });
            // .then(() => {
            //     this.getList();
            //     this.$modal.msgSuccess(this.$t('device.index.105953-47'));
            // })
            // .catch(() => {});
        },
        /** 未启用设备影子*/
        shadowUnEnable(device, thingsModel) {
            // 1-未激活，2-禁用，3-在线，4-离线
            if (device.status != 3 && device.isShadow == 0) {
                return true;
            }
            if (thingsModel.isReadonly) {
                return true;
            }
            return false;
        },
    },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
@import '@/assets/styles/sunseen-btn.scss';

.card-item {
    border-radius: 15px;
}

::v-deep .el-upload-dragger {
    width: 510px;
}

.el-dropdown-menu__item {
    font-size: 12px;
    /* 设置字体大小 */
}
</style>
