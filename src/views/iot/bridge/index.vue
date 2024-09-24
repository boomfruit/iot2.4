<template>
    <div style="padding: 6px">
        <el-card style="margin-bottom: 10px; height: 100%">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" style="margin-bottom: 5px" label-width="90px">
                <el-form-item :label="$t('views.iot.bridge.index.525282-0')" prop="name">
                    <el-input v-model="queryParams.name" :placeholder="$t('views.iot.bridge.index.525282-1')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:bridge:add']">{{ $t('views.iot.bridge.index.525282-4') }}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['iot:bridge:edit']">{{ $t('views.iot.bridge.index.525282-5') }}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['iot:bridge:remove']">{{ $t('views.iot.bridge.index.525282-6') }}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['iot:bridge:export']">{{ $t('views.iot.bridge.index.525282-7') }}</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
        </el-card>
        <el-card style="padding-bottom: 100px">
            <el-table v-loading="loading" :data="bridgeList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column :label="$t('views.iot.bridge.index.525282-0')" align="center" prop="name" />
                <el-table-column :label="$t('views.iot.bridge.index.525282-8')" align="center" prop="enable">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enable" active-value="1" inactive-value="0" @change="handleEnableChange(scope.row)" :disabled="isDisabled"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('views.iot.bridge.index.525282-9')" align="center" prop="status">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.status === '0'">{{ $t('views.iot.bridge.index.525282-10') }}</el-tag>
                        <el-tag type="success" v-if="scope.row.status === '1'">{{ $t('views.iot.bridge.index.525282-11') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('views.iot.bridge.index.525282-12')" align="center" prop="type">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.type === 3">{{ $t('views.iot.bridge.index.525282-13') }}</el-tag>
                        <el-tag type="success" v-if="scope.row.type === 4">{{ $t('views.iot.bridge.index.525282-14') }}</el-tag>
                        <el-tag type="info" v-if="scope.row.type === 5">{{ $t('views.iot.bridge.index.525282-15') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('views.iot.bridge.index.525282-16')" align="center" prop="direction">
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.direction === 1">{{ $t('views.iot.bridge.index.525282-17') }}</el-tag>
                        <el-tag type="success" v-if="scope.row.direction === 2">{{ $t('views.iot.bridge.index.525282-18') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('views.iot.bridge.index.525282-19')" align="center" prop="remark" />
                <el-table-column :label="$t('views.iot.bridge.index.525282-20')" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" v-show="scope.row.shows" icon="el-icon-sort" @click="handleCommect(scope.row)" v-hasPermi="['iot:bridge:edit']">
                            {{ $t('views.iot.bridge.index.525282-21') }}
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['iot:bridge:edit']">{{ $t('views.iot.bridge.index.525282-5') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:bridge:remove']">{{ $t('views.iot.bridge.index.525282-6') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改数据桥接对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body :close-on-click-modal="false">
                <el-form ref="form.bridge" :model="form.bridge" :rules="rules" :label-width="labelWidth">
                    <el-form-item :label="$t('views.iot.bridge.index.525282-22')" prop="name">
                        <el-input v-model="form.bridge.name" :placeholder="$t('views.iot.bridge.index.525282-23')" />
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-16')" prop="direction">
                        <el-select v-model="form.bridge.direction" :placeholder="$t('views.iot.bridge.index.525282-24')" style="width: 100%" @change="clearconfig">
                            <el-option v-for="item in directionOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="label-top" :label="$t('views.iot.bridge.index.525282-12')" prop="type">
                        <el-row>
                            <el-col :span="13">
                                <el-radio-group v-model="form.bridge.type" @change="clearconfig">
                                    <el-radio-button label="3">{{ $t('views.iot.bridge.index.525282-13') }}</el-radio-button>
                                    <el-radio-button label="4">{{ $t('views.iot.bridge.index.525282-14') }}</el-radio-button>
                                    <el-radio-button label="5">{{ $t('views.iot.bridge.index.525282-15') }}</el-radio-button>
                                </el-radio-group>
                            </el-col>
                            <el-col :span="11">
                                <el-form-item :label="$t('views.iot.bridge.index.525282-8')" prop="enable">
                                    <el-switch v-model="form.bridge.enable" active-value="1" inactive-value="0" default-value="1" />
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>

                <!-- BEGIN:HTTP桥接 ------------------------------------->
                <el-form ref="form.httpform" :model="form.httpform" :rules="httprules" label-width="80px" v-show="form.bridge.type == 3">
                    <div v-show="form.bridge.direction === 2">
                        <el-form-item :label="$t('views.iot.bridge.index.525282-25')" prop="hostUrlbody">
                            <el-input :placeholder="$t('views.iot.bridge.index.525282-26')" v-model="form.httpform.hostUrlbody" class="input-with-select" prop="hostUrl">
                                <el-select v-model="hostUrlhead" slot="prepend" :placeholder="$t('views.iot.bridge.index.525282-27')" style="width: 100px">
                                    <el-option v-for="item in urlOptions" :key="item" :value="item"></el-option>
                                </el-select>
                            </el-input>
                        </el-form-item>
                        <el-form-item :label="$t('views.iot.bridge.index.525282-28')" prop="method">
                            <el-select v-model="form.httpform.method" :placeholder="$t('views.iot.bridge.index.525282-27')" style="width: 100%">
                                <el-option v-for="item in options" :key="item" :value="item"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item :label="$t('views.iot.bridge.index.525282-29')" prop="requestHeaders">
                            <div v-for="(item, index) in requestHeadersMap" :key="index">
                                <el-row>
                                    <el-col :span="10">
                                        <el-input size="small" :placeholder="$t('views.iot.bridge.index.525282-30')" v-model="item.key">
                                            <template slot="prepend">{{ $t('views.iot.bridge.index.525282-32') }}:</template>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="10" style="margin-left: 25px; margin-right: 25px">
                                        <el-input size="small" :placeholder="$t('views.iot.bridge.index.525282-31')" v-model="item.value">
                                            <template slot="prepend">{{ $t('views.iot.bridge.index.525282-33') }}:</template>
                                        </el-input>
                                    </el-col>
                                    <div class="delete-wrap">
                                        <el-button size="small" v-if="index != 0" plain type="danger" style="padding: 5px" icon="el-icon-delete" @click="handleRemoveAction(index)">{{ $t('delete') }}</el-button>
                                    </div>
                                </el-row>
                            </div>
                            <div>
                                +
                                <a style="color: #409eff" @click="handleAddAction()">{{ $t('views.iot.bridge.index.525282-34') }}</a>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('views.iot.bridge.index.525282-35')" prop="requestQuerys">
                            <div v-for="(item, index) in requestQuerysMap" :key="index">
                                <el-row>
                                    <el-col :span="10">
                                        <el-input size="small" :placeholder="$t('views.iot.bridge.index.525282-30')" v-model="item.key">
                                            <template slot="prepend">{{ $t('views.iot.bridge.index.525282-32') }}:</template>
                                        </el-input>
                                    </el-col>
                                    <el-col :span="10" style="margin-left: 25px; margin-right: 25px">
                                        <el-input size="small" :placeholder="$t('views.iot.bridge.index.525282-31')" v-model="item.value">
                                            <template slot="prepend">{{ $t('views.iot.bridge.index.525282-33') }}:</template>
                                        </el-input>
                                    </el-col>
                                    <div class="delete-wrap">
                                        <el-button size="small" v-if="index != 0" plain type="danger" style="padding: 5px" icon="el-icon-delete" @click="handleRemoveAction(index)">{{ $t('delete') }}</el-button>
                                    </div>
                                </el-row>
                            </div>
                            <div>
                                +
                                <a style="color: #409eff" @click="handleAddQuerys()">{{ $t('views.iot.bridge.index.525282-34') }}</a>
                            </div>
                        </el-form-item>
                        <el-form-item :label="$t('views.iot.bridge.index.525282-36')" prop="requestBody">
                            <el-input v-model="form.httpform.requestBody" type="textarea" rows="6" :placeholder="$t('views.iot.bridge.index.525282-37')" />
                        </el-form-item>
                    </div>
                    <div v-show="form.bridge.direction === 1">
                        <el-form-item :label="$t('views.iot.bridge.index.525282-82')" prop="route">
                            <el-select v-model="form.httpform.route" :placeholder="$t('views.iot.bridge.index.525282-82')" style="width: 100%">
                                <el-option v-for="item in routeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
                <!-- END:HTTP桥接 -----------------------  -------------->

                <!-- BEGIN:Mqtt桥接 ------------------------------------->
                <el-form ref="form.mqttform" :model="form.mqttform" :rules="mqttrules" label-width="120px" v-show="form.bridge.type == 4">
                    <el-form-item :label="$t('views.iot.bridge.index.525282-38')" prop="hostUrlbody">
                        <el-input :placeholder="$t('views.iot.bridge.index.525282-39')" v-model="form.mqttform.hostUrlbody">
                            <template slot="prepend">tcp://</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-40')" prop="clientId">
                        <el-input v-model="form.mqttform.clientId" :placeholder="$t('views.iot.bridge.index.525282-41')" />
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-42')" prop="username">
                        <el-input v-model="form.mqttform.username" :placeholder="$t('views.iot.bridge.index.525282-43')" />
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-44')" prop="password">
                        <el-input v-model="form.mqttform.password" :placeholder="$t('views.iot.bridge.index.525282-45')" type="password" />
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-46')" prop="route">
                        <el-input v-model="form.mqttform.route" :placeholder="$t('views.iot.bridge.index.525282-47')" />
                    </el-form-item>
                </el-form>

                <!-- END:Mqtt桥接 -------------------------- ------------>

                <!-- BEGIN:数据存储 ------------------------------------->
                <el-form ref="form.dbform" :model="form.dbform" :rules="dbrules" label-width="95px" v-show="form.bridge.type == 5">
                    <el-form-item :label="$t('views.iot.bridge.index.525282-48')" prop="type">
                        <el-select v-model="form.dbform.type" :placeholder="$t('views.iot.bridge.index.525282-49')" style="width: 100%">
                            <el-option v-for="item in dbTypeOptions" :key="item.value" :value="item.label" :disabled="item.disabled"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-50')" prop="databaseSource">
                        <el-select v-model="form.dbform.databaseSource" :placeholder="$t('views.iot.bridge.index.525282-51')" style="width: 100%">
                            <el-option v-for="item in dbOptions" :key="item" :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-52')" prop="host">
                        <el-input v-model="form.dbform.host" :placeholder="$t('views.iot.bridge.index.525282-81')" />
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-42')" prop="userName">
                        <el-input v-model="form.dbform.userName" :placeholder="$t('views.iot.bridge.index.525282-43')" />
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-44')" prop="password">
                        <el-input v-model="form.dbform.password" :placeholder="$t('views.iot.bridge.index.525282-45')" type="password" />
                    </el-form-item>
                    <el-form-item :label="$t('views.iot.bridge.index.525282-53')" prop="dataBaseName">
                        <el-input v-model="form.dbform.dataBaseName" :placeholder="$t('views.iot.bridge.index.525282-54')" />
                    </el-form-item>
                    <el-form-item label="SQL" prop="sql">
                        <el-input v-model="form.dbform.sql" type="textarea" :placeholder="$t('views.iot.bridge.index.525282-55')" :rows="3" />
                    </el-form-item>
                </el-form>

                <!-- END:数据存储 ---------------  ---------------------->

                <div slot="footer" class="dialog-footer">
                    <el-button type="success" @click="test" v-show="testshow">{{ $t('views.iot.bridge.index.525282-56') }}</el-button>
                    <el-button type="primary" @click="submitForm">{{ $t('views.iot.bridge.index.525282-57') }}</el-button>
                    <el-button @click="cancel">{{ $t('views.iot.bridge.index.525282-58') }}</el-button>
                </div>
                <div v-show="isShown" style="border: 1px solid #ccc; border-radius: 5px; height: 150px; background-color: #eef3f7; padding: 0 5px; line-height: 20px; overflow: auto" v-loading="bridgeloading">
                    <pre>
            {{ $t('views.iot.bridge.index.525282-97') }}
            {{ response }}


        </pre
                    >
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { listBridge, getBridge, delBridge, addBridge, updateBridge, connectBridge } from '@/api/iot/bridge';
import clientList from '@/views/iot/scene/client-list.vue';

export default {
    name: 'Bridge',
    components: { clientList },
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
            // 数据桥接表格数据
            bridgeList: [],
            // 弹出层标题
            title: '',
            //初始lable宽度
            labelWidth: '80px',
            //防止一直点击是否生效按钮
            isDisabled: false,
            requestHeadersMap: [{ key: '', value: '' }],
            requestQuerysMap: [{ key: '', value: '' }],
            methodValue: 'POST',
            options: ['POST', 'PUT', 'GET'],
            hostUrlhead: 'http://',
            urlOptions: ['http://', 'https://'],
            activeTab: '3',
            dbOptions: ['MySQL', 'SQLServer', 'Oracle', 'PostgreSQL'],
            bridgeloading: false,
            //测试信息框的显隐
            isShown: false,
            //测试信息框的消息提示
            response: '',
            //连通按钮的显隐
            testshow: false,
            dbTypeOptions: [
                {
                    value: 1,
                    label: this.$t('views.iot.bridge.index.525282-59'),
                },
                {
                    value: 2,
                    label: this.$t('views.iot.bridge.index.525282-60'),
                    disabled: true,
                },
            ],
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: null,
                enable: null,
                status: null,
                type: null,
                direction: null,
            },
            directionOptions: [
                { value: 1, label: this.$t('views.iot.bridge.index.525282-17') },
                { value: 2, label: this.$t('views.iot.bridge.index.525282-18') },
            ],
            typeOptions: [
                { value: 3, label: this.$t('views.iot.bridge.index.525282-13') },
                { value: 4, label: this.$t('views.iot.bridge.index.525282-14') },
                { value: 5, label: this.$t('views.iot.bridge.index.525282-15') },
            ],
            routeOptions: [
                { value: '/bridge/get', label: this.$t('views.iot.bridge.index.525282-83') },
                { value: '/bridge/put', label: this.$t('views.iot.bridge.index.525282-84') },
                { value: '/bridge/post', label: this.$t('views.iot.bridge.index.525282-85') },
            ],
            // 表单参数
            form: {
                bridge: {
                    enable: 1,
                    direction: 1,
                },
                httpform: {
                    name: 'Http桥接',
                    method: 'POST',
                },
                mqttform: {
                    name: 'Mqtt桥接',
                },
                dbform: {
                    name: '数据库存储',
                    type: this.$t('views.iot.bridge.index.525282-59'),
                },
            },
            type: 3,
            // 表单校验
            rules: {
                name: [{ required: true, message: this.$t('views.iot.bridge.index.525282-61'), trigger: 'blur' }],

                type: [{ required: true, message: this.$t('views.iot.bridge.index.525282-62'), trigger: 'change' }],
                direction: [{ required: true, message: this.$t('views.iot.bridge.index.525282-63'), trigger: 'blur' }],
            },
            httprules: {
                method: [{ required: true, message: this.$t('views.iot.bridge.index.525282-64'), trigger: 'blur' }],
                hostUrl: [{ required: true, message: this.$t('views.iot.bridge.index.525282-65'), trigger: 'blur' }],
                hostUrlbody: [{ required: true, message: this.$t('views.iot.bridge.index.525282-65'), trigger: 'blur' }],
                createTime: [{ required: true, message: this.$t('views.iot.bridge.index.525282-66'), trigger: 'blur' }],
                updateTime: [{ required: true, message: this.$t('views.iot.bridge.index.525282-67'), trigger: 'blur' }],
                route: [{ required: true, message: this.$t('views.iot.bridge.index.525282-65'), trigger: 'blur' }],
            },
            mqttrules: {
                hostUrl: [{ required: true, message: this.$t('views.iot.bridge.index.525282-68'), trigger: 'blur' }],
                hostUrlbody: [
                    { required: true, message: this.$t('views.iot.bridge.index.525282-65'), trigger: 'blur' },
                    { pattern: /^[\w.-]+:\d+$/, message: this.$t('views.iot.bridge.index.525282-69'), trigger: 'blur' },
                ],
                clientId: [{ required: true, message: this.$t('views.iot.bridge.index.525282-70'), trigger: 'blur' }],
                username: [{ required: true, message: this.$t('views.iot.bridge.index.525282-71'), trigger: 'blur' }],
                password: [{ required: true, message: this.$t('views.iot.bridge.index.525282-72'), trigger: 'blur' }],
                createTime: [{ required: true, message: this.$t('views.iot.bridge.index.525282-66'), trigger: 'blur' }],
                updateTime: [{ required: true, message: this.$t('views.iot.bridge.index.525282-77'), trigger: 'blur' }],
                route: [{ required: true, message: this.$t('views.iot.bridge.index.525282-73'), trigger: 'blur' }],
            },

            dbrules: {
                databaseSource: [{ required: true, message: this.$t('views.iot.bridge.index.525282-74'), trigger: 'blur' }],
                type: [{ required: true, message: this.$t('views.iot.bridge.index.525282-75'), trigger: 'blur' }],
                port: [{ required: true, message: this.$t('views.iot.bridge.index.525282-76'), trigger: 'blur' }],
                dataBaseName: [{ required: true, message: this.$t('views.iot.bridge.index.525282-77'), trigger: 'blur' }],
                sql: [{ required: true, message: this.$t('views.iot.bridge.index.525282-78'), trigger: 'blur' }],
                host: [
                    { required: true, message: this.$t('views.iot.bridge.index.525282-79'), trigger: 'blur' },
                    { pattern: /^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost):\d+$/, message: this.$t('views.iot.bridge.index.525282-80'), trigger: 'blur' },
                ],
                userName: [{ required: true, message: this.$t('views.iot.bridge.index.525282-71'), trigger: 'blur' }],
                password: [{ required: true, message: this.$t('views.iot.bridge.index.525282-72'), trigger: 'blur' }],
            },
        };
    },

    created() {
        this.getList();
    },
    watch: {
        'form.bridge': {
            deep: true,
            handler(newVal, oldVal) {
                if (newVal.direction === 1) {
                    if (this.form.bridge.type === 3) {
                        this.testshow = false;
                    } else {
                        this.testshow = true;
                    }
                } else {
                    this.testshow = true;
                }
                if (newVal.type === '3' && newVal.direction === 1) {
                    this.testshow = false;
                }

                if (newVal.type === '3') {
                    this.labelWidth = '80px';
                } else if (newVal.type === '4') {
                    this.labelWidth = '120px';
                } else if (newVal.type === '5') {
                    this.labelWidth = '95px';
                }

                this.$nextTick(() => {
                    if (newVal.direction === 1) {
                        this.httprules.method = [];
                        this.httprules.hostUrl = [];
                        this.httprules.hostUrlbody = [];
                        this.httprules.route = [{ required: true, message: this.$t('views.iot.bridge.index.525282-65'), trigger: 'blur' }];
                        if (this.$refs['form.mqttform']) {
                            this.$refs['form.mqttform'].clearValidate('route');
                        }
                        this.mqttrules.route = [{ required: true, message: this.$t('views.iot.bridge.index.525282-73'), trigger: 'blur' }];
                    } else {
                        if (this.$refs['form.mqttform']) {
                            this.$refs['form.mqttform'].clearValidate('route');
                        }
                        this.mqttrules.route = [];
                        this.httprules.method = [{ required: true, message: this.$t('views.iot.bridge.index.525282-64'), trigger: 'blur' }];
                        this.httprules.hostUrl = [{ required: true, message: this.$t('views.iot.bridge.index.525282-65'), trigger: 'blur' }];
                        this.httprules.hostUrlbody = [{ required: true, message: this.$t('views.iot.bridge.index.525282-65'), trigger: 'blur' }];
                        this.httprules.route = [];
                    }
                });
            },
            // immediate: true,
        },
    },
    methods: {
        /** 查询数据桥接列表 */
        getList() {
            this.loading = true;
            listBridge(this.queryParams).then((response) => {
                this.bridgeList = response.rows;
                //判断是否显示连接测试，若为HTTP推送且方向为输入则不显示
                this.bridgeList.forEach((item) => {
                    if (item.type == 3 && item.direction == 1) {
                        item.status = '1';
                        item.shows = false;
                    } else {
                        item.shows = true;
                    }
                });

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
            this.form.bridge = {
                id: null,
                name: null,
                status: null,
                type: null,
                //direction: null,
                route: null,
                delFlag: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null,
            };
            this.isShown = false;
            this.requestHeadersMap = [{ key: '', value: '' }];
            this.requestQuerysMap = [{ key: '', value: '' }];
            for (let key in this.form.httpform) {
                if (key != 'name' && key != 'method') {
                    this.form.httpform[key] = null;
                }
            }
            for (let key in this.form.mqttform) {
                if (key != 'name') {
                    this.form.mqttform[key] = null;
                }
                // 或者 this.form.httpform[key] = undefined;
            }
            for (let key in this.form.dbform) {
                if (key != 'name' && key != 'type') {
                    this.form.dbform[key] = null;
                }
                // 或者 this.form.httpform[key] = undefined;
            }
            this.response = null;
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
            this.ids = selection.map((item) => item.id);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = this.$t('views.iot.bridge.index.525282-86');
            this.form.bridge.type = 3;
            this.testshow = false;
        },

        handleCommect(row) {
            connectBridge(row)
                .then((response) => {
                    if (response.code == 200) {
                        this.$message({
                            message: this.$t('views.iot.bridge.index.525282-87'),
                            type: 'success',
                        });
                    } else if (response.code == 500) {
                        this.$message({
                            message: this.$t('views.iot.bridge.index.525282-88'),
                            type: 'warning',
                        });
                    }
                    this.getList();
                })
                .catch(() => {
                    this.getList();
                });
        },

        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            //获取id
            const id = row.id || this.ids;
            getBridge(id).then((response) => {
                if (response.data.type == 3) {
                    this.form.bridge = response.data;
                    this.form.httpform = JSON.parse(response.data.configJson);
                    this.open = true;
                    this.title = this.$t('views.iot.bridge.index.525282-89');
                    if (this.form.httpform.hostUrl) {
                        const parts = this.form.httpform.hostUrl.split('://');
                        if (parts.length === 2) {
                            this.hostUrlhead = parts[0] + '://';
                            this.form.httpform.hostUrlbody = parts[1];
                        }
                    }

                    //按照格式回显请求头
                    this.requestHeadersMap = [];
                    if (this.form.httpform.requestHeaders != '') {
                        const requestHeardJson = JSON.parse(this.form.httpform.requestHeaders);
                        for (let key in requestHeardJson) {
                            if (requestHeardJson.hasOwnProperty(key)) {
                                this.requestHeadersMap.push({ key: key, value: requestHeardJson[key] });
                            }
                        }
                    }
                    //按照格式回显请求参数
                    this.requestQuerysMap = [];
                    if (this.form.httpform.requestQuerys != '') {
                        const requestQueryJson = JSON.parse(this.form.httpform.requestQuerys);
                        for (let key in requestQueryJson) {
                            if (requestQueryJson.hasOwnProperty(key)) {
                                this.requestQuerysMap.push({ key: key, value: requestQueryJson[key] });
                            }
                        }
                    }
                }
                if (response.data.type == 4) {
                    this.form.bridge = response.data;
                    this.form.mqttform = JSON.parse(response.data.configJson);
                    if (this.form.mqttform.hostUrl) {
                        const parts = this.form.mqttform.hostUrl.split('://');
                        if (parts.length == 2) {
                            this.form.mqttform.hostUrlbody = parts[1];
                        }
                    }
                    this.open = true;
                    this.title = this.$t('views.iot.bridge.index.525282-89');
                }
                if (response.data.type == 5) {
                    this.form.bridge = response.data;
                    this.form.dbform = JSON.parse(response.data.configJson);
                    this.open = true;
                    this.title = this.$t('views.iot.bridge.index.525282-89');
                }
            });
        },
        // 测试连接显示信息框
        test() {
            this.$refs['form.bridge'].validate((valid) => {
                if (valid) {
                    if (this.form.bridge.type == 3) {
                        this.$refs['form.httpform'].validate((valid) => {
                            if (valid) {
                                this.bridgeloading = true;
                                this.isShown = true;
                                this.getConfigJson();
                                this.testConnect();
                            }
                        });
                    } else if (this.form.bridge.type == 4) {
                        this.$refs['form.mqttform'].validate((valid) => {
                            if (valid) {
                                this.bridgeloading = true;
                                this.isShown = true;
                                this.getConfigJson();
                                this.testConnect();
                            }
                        });
                    } else if (this.form.bridge.type == 5) {
                        this.$refs['form.dbform'].validate((valid) => {
                            if (valid) {
                                this.bridgeloading = true;
                                this.isShown = true;
                                this.getConfigJson();
                                this.testConnect();
                            }
                        });
                    }
                }
            });
        },
        /** 测试连接 */
        testConnect() {
            connectBridge(this.form.bridge)
                .then((response) => {
                    this.bridgeloading = false;
                    this.response = response;
                    if (response.code == 200) {
                        this.$message({
                            message: this.$t('views.iot.bridge.index.525282-90'),
                            type: 'success',
                        });
                    } else if (response.code == 500) {
                        this.$message({
                            message: this.$t('views.iot.bridge.index.525282-91'),
                            type: 'warning',
                        });
                    }
                    this.getList();
                })
                .catch((error) => {
                    this.bridgeloading = false;
                    this.response = this.$t('views.iot.bridge.index.525282-92');
                });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form.bridge'].validate((valid) => {
                if (valid) {
                    if (this.form.bridge.type == 3) {
                        this.$refs['form.httpform'].validate((valid) => {
                            if (valid) {
                                this.addOrUpdate();
                            }
                        });
                    } else if (this.form.bridge.type == 4) {
                        this.$refs['form.mqttform'].validate((valid) => {
                            if (valid) {
                                this.addOrUpdate();
                            }
                        });
                    } else if (this.form.bridge.type == 5) {
                        this.$refs['form.dbform'].validate((valid) => {
                            if (valid) {
                                this.addOrUpdate();
                            }
                        });
                    }
                }
            });
        },
        //修改或新增
        addOrUpdate() {
            if (this.form.bridge.id != null) {
                this.getConfigJson();
                updateBridge(this.form.bridge).then((response) => {
                    this.$modal.msgSuccess(this.$t('views.iot.bridge.index.525282-93'));
                    this.open = false;
                    this.getList();
                });
            } else {
                this.getConfigJson();
                addBridge(this.form.bridge).then((response) => {
                    this.$modal.msgSuccess(this.$t('views.iot.bridge.index.525282-94'));
                    this.open = false;
                    this.getList();
                });
            }
        },

        //字符串拼接
        getConfigJson() {
            //http的json封装
            if (this.form.bridge.type == 3) {
                this.form.httpform.hostUrl = this.hostUrlhead + this.form.httpform.hostUrlbody;

                if (this.requestHeadersMap.length != 0) {
                    const jsonStr = this.requestHeadersMap.map((item) => {
                        return [item.key, item.value];
                    });
                    const object = Object.fromEntries(jsonStr);
                    this.form.httpform.requestHeaders = JSON.stringify(object);
                }

                if (this.requestQuerysMap.length != 0) {
                    const jsonSt = this.requestQuerysMap.map((item) => {
                        return [item.key, item.value];
                    });
                    const obj = Object.fromEntries(jsonSt);
                    this.form.httpform.requestQuerys = JSON.stringify(obj);
                }
                this.form.bridge.configJson = JSON.stringify(this.form.httpform);
                this.form.bridge.route = this.form.httpform.route;
            }
            //mqtt的json封装
            if (this.form.bridge.type == 4) {
                this.form.mqttform.name = this.form.bridge.name;
                this.form.mqttform.hostUrl = 'tcp://' + this.form.mqttform.hostUrlbody;
                this.form.bridge.configJson = JSON.stringify(this.form.mqttform);
                this.form.bridge.route = this.form.mqttform.route;
            }
            //数据库存储的json封装
            if (this.form.bridge.type == 5) {
                this.form.bridge.configJson = JSON.stringify(this.form.dbform);
            }
        },
        //更改桥接类型时清空表格
        clearconfig() {
            this.isShown = false;
            this.response = null;
        },
        handleSelectConfig() {
            this.$refs.clientList.type = this.form.bridge.type;
            this.$refs.clientList.queryParams.pageNum = 1;
            this.$refs.clientList.open = true;
            this.$refs.clientList.getList();
        },

        async handleEnableChange(row) {
            this.isDisabled = true; // 设置为不可选择
            /**简单防抖 */
            setTimeout(() => {
                this.isDisabled = false; // 2秒后恢复可选择状态
            }, 1000);
            this.reset();
            const id = row.id || this.ids;
            getBridge(id).then((response) => {
                this.form.bridge = response.data;
                this.form.bridge.enable = this.form.bridge.enable == 1 ? 0 : 1;
                updateBridge(this.form.bridge).then((response) => {
                    this.$modal.msgSuccess(this.$t('views.iot.bridge.index.525282-93'));
                    this.open = false;
                });
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal
                .confirm(this.$t('views.iot.bridge.index.525282-96', [ids]))
                .then(function () {
                    return delBridge(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess(this.$t('views.iot.bridge.index.525282-95'));
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/bridge/export',
                {
                    ...this.queryParams,
                },
                `bridge_${new Date().getTime()}.xlsx`
            );
        },
        handleAddAction() {
            this.requestHeadersMap.push({
                key: '',
                value: '',
            });
        },
        //添加请求参数
        handleAddQuerys() {
            this.requestQuerysMap.push({
                key: '',
                value: '',
            });
        },
        // 删除请求头参数
        handleRemoveAction(index) {
            this.requestHeadersMap.splice(index, 1);
        },
        // 删除请求参数
        handleRemoveQuerys(index) {
            this.requestQuerysMap.splice(index, 1);
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
</style>
