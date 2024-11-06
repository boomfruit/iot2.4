<template>
    <div class="notifyChannel-wrap">
        <el-card class="top-card-wrap">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                <el-form-item :label="$t('notify.channel.index.333541-0')" prop="name">
                    <el-input v-model="queryParams.name" :placeholder="$t('notify.channel.index.333541-1')" clearable @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item :label="$t('notify.channel.index.333541-2')" prop="channelType">
                    <el-select v-model="queryParams.channelType" :placeholder="$t('notify.channel.index.333541-3')" clearable size="small" style="width: 100%">
                        <el-option v-for="option in channelTypeList" :key="option.value" :label="option.label" :value="option.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                    <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">{{ $t('reset') }}</el-button>
                </el-form-item>
            </el-form>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['notify:channel:add']">{{ $t('notify.channel.index.333541-4') }}</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['notify:channel:edit']">{{ $t('notify.channel.index.333541-5') }}</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
        </el-card>

        <el-card class="card-wrap">
            <el-table v-loading="loading" :data="channelList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column :label="$t('notify.channel.index.333541-0')" align="left" prop="name" />
                <el-table-column :label="$t('notify.channel.index.333541-6')" align="left" prop="channelType" width="200">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.notify_channel_type" :value="scope.row.channelType" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('notify.channel.index.333541-7')" align="left" prop="provider" />
                <el-table-column :label="$t('notify.channel.index.333541-8')" align="left" prop="createTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{m}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="200">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="handleUpdate(scope.row)" v-hasPermi="['notify:channel:query']">{{ $t('detail') }}</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['notify:channel:remove']">{{ $t('del') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

            <!-- 添加或修改通知渠道对话框 -->
            <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
                <div style="margin-top: -55px">
                    <el-divider style="margin-top: -30px"></el-divider>
                    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
                        <el-form-item :label="$t('notify.channel.index.333541-0')" prop="name">
                            <el-input v-model="form.name" :placeholder="$t('notify.channel.index.333541-1')" />
                        </el-form-item>
                        <el-form-item :label="$t('notify.channel.index.333541-2')" prop="channelType">
                            <el-select v-model="form.channelType" :placeholder="$t('notify.channel.index.333541-3')" clearable size="small" style="width: 100%" @change="changeChannel">
                                <el-option v-for="option in channelTypeList" :key="option.value" :label="option.label" :value="option.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item :label="$t('notify.channel.index.333541-7')" prop="provider">
                            <el-select :placeholder="$t('notify.channel.index.333541-10')" clearable size="small" style="width: 100%" v-model="form.provider" :disabled="form.channelType == null" @change="changeService">
                                <el-option v-for="provider in list" :key="provider.value" :label="provider.label" :value="provider.value" />
                            </el-select>
                        </el-form-item>
                        <div>
                            <el-form-item v-for="(item, index) in configList" :key="index" :label="item.label">
                                <el-input v-model="item.value" :placeholder="$t('notify.channel.index.333541-11')" v-if="item.type == 'string'" />
                                <el-input v-model="item.value" :placeholder="$t('notify.channel.index.333541-11')" type="number" v-if="item.type == 'int'" />
                                <editor v-model="item.value" :min-height="192" v-if="item.type == 'text'" />
                                <el-switch v-model="item.value" active-color="#13ce66" inactive-color="#c0c0c0" v-if="item.type == 'boolean'"></el-switch>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitForm" v-hasPermi="['notify:channel:edit']" v-show="form.id">{{ $t('update') }}</el-button>
                    <el-button type="primary" @click="submitForm" v-hasPermi="['notify:channel:add']" v-show="!form.id">{{ $t('add') }}</el-button>
                    <el-button @click="cancel">{{ $t('cancel') }}</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
import { listChannel, getChannel, delChannel, addChannel, getConfigContent, updateChannel, getChannelMessage } from '@/api/notify/channel';

export default {
    name: 'Channel',
    dicts: ['notify_channel_type', 'notify_message_type', 'iot_yes_no', 'notify_service_code'],

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
            modelList: [],
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 通知渠道表格数据
            channelList: [],
            channelTypeList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            configType: '',
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                name: null,
                channelType: null,
                provider: null,
                configContent: null,
            },
            configList: [],
            channelMsgList: [],
            channelChildren: [],
            list: [],
            configContent: [],
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [{ required: true, message: this.$t('notify.channel.index.333541-12'), trigger: 'blur' }],
                channelType: [{ required: true, message: this.$t('notify.channel.index.333541-13'), trigger: 'change' }],
                provider: [{ required: true, message: this.$t('notify.channel.index.333541-14'), trigger: 'blur' }],
            },
        };
    },
    created() {
        this.getList();
        this.getInfo();
    },
    methods: {
        /** 查询通知渠道列表 */
        getList() {
            this.loading = true;
            listChannel(this.queryParams).then((response) => {
                this.channelList = response.rows;
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
                name: null,
                channelType: null,
                provider: null,
                configContent: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                delFlag: null,
            };
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
            this.title = this.$t('notify.channel.index.333541-15');
            this.configList = [];
        },
        /** 修改按钮操作 */
        async handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            this.$nextTick(() => {
                this.form.channelType = row.channelType;
                this.form.provider = row.provider;
                this.getConfig();
            });
            setTimeout(() => {
                getChannel(id).then((response) => {
                    this.form = response.data;
                    this.open = true;
                    this.title = this.$t('notify.channel.index.333541-16');
                    this.getServiceList();
                    if (this.form.configContent != '') {
                        const List = JSON.parse(this.form.configContent);
                        for (let j = 0; j < this.configList.length; j++) {
                            for (const key in List) {
                                if (this.configList[j].attribute == key) {
                                    this.configList[j].value = List[key];
                                }
                            }
                        }
                    }
                });
            }, 500);
        },
        //获取渠道具体信息
        getInfo() {
            this.loading = true;
            getChannelMessage().then((response) => {
                this.channelMsgList = response.data;
                //渠道类型
                this.channelTypeList = response.data.map((item) => {
                    return { value: item.channelType, label: item.channelName };
                });
                //取出服务商列表
                this.providerList = response.data.map((item) => item.providerList);
            });
            this.loading = false;
        },
        //渠道发生改变
        changeChannel() {
            this.getServiceList();
            this.form.provider = '';
            this.configList = [];
        },
        //获取服务商列表
        getServiceList() {
            const selectedChannel = this.form.channelType;
            this.channelChildren = this.channelMsgList.filter((item) => selectedChannel.includes(item.channelType)).map((item) => item.providerList);
            for (var i = 0; i < this.channelChildren.length; i++) {
                this.list = this.channelChildren[i].map((item) => {
                    return { value: item.provider, label: item.providerName, config: item.configContent };
                });
            }
        },
        //服务商发生改变后获取配置内容
        changeService() {
            this.getServiceList();
            this.getConfig();
        },
        //获取配置内容
        getConfig() {
            getConfigContent(this.form.provider, this.form.channelType).then((res) => {
                this.configList = res.data.map((item) => {
                    return { value: item.value, label: item.name, attribute: item.attribute, type: item.type };
                });
                for (let i = 0; i < this.configList.length; i++) {
                    if (this.configList[i].type === 'boolean') {
                        this.configList[i].value = Boolean(this.configList[i].value);
                    }
                }
            });
        },
        /** 提交按钮 */
        submitForm() {
            const configUseList = this.configList.map((item) => {
                return [item.attribute, item.value];
            });
            const object = Object.fromEntries(configUseList);
            const json = JSON.stringify(object);
            const query = {
                id: this.form.id,
                name: this.form.name,
                channelType: this.form.channelType,
                provider: this.form.provider,
                configContent: json,
            };
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateChannel(query).then((response) => {
                            this.$modal.msgSuccess(this.$t('updateSuccess'));
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addChannel(query).then((response) => {
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
            const ids = row.id || this.ids;
            this.$modal
                .confirm(this.$t('notify.channel.index.333541-17', [ids]))
                .then(function () {
                    return delChannel(ids);
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
                'notify/channel/export',
                {
                    ...this.queryParams,
                },
                `channel_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.notifyChannel-wrap {
    padding: 6px;

    .top-card-wrap {
        margin-bottom: 5px;
    }

    .card-wrap {
        padding-bottom: 100px;
    }
}
</style>
