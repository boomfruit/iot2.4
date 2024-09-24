<template>
    <div class="scene-list-wrap">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item :label="$t('scene.list.index.079839-0')" prop="deptId">
                <treeselect v-model="queryParams.deptId" :options="deptOptions" :clearable="true" :searchable="true" :placeholder="$t('scene.list.index.079839-14')" />
            </el-form-item>
            <el-form-item :label="$t('scene.index.670805-8')" prop="status">
                <el-select v-model="queryParams.status" :placeholder="$t('scene.list.index.079839-1')" clearable>
                    <el-option :label="$t('scene.list.index.079839-2')" :value="0"></el-option>
                    <el-option :label="$t('scene.edit.202832-18')" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('scene.edit.202832-1')" prop="sceneModelName">
                <el-input v-model="queryParams.sceneModelName" :placeholder="$t('scene.edit.202832-5')" clearable />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">{{ $t('search') }}</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">{{ $t('reset') }}</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['scene:model:add']">{{ $t('add') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['scene:model:edit']">{{ $t('update') }}</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['scene:model:remove']">{{ $t('del') }}</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getSceneListDatas"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="sceneList" :border="false" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column :label="$t('scene.index.670805-8')" align="center" prop="status" width="100">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'">{{ scope.row.status === 0 ? $t('scene.list.index.079839-2') : $t('scene.edit.202832-18') }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column :label="$t('scene.edit.202832-1')" align="center" prop="sceneModelName" width="200" />
            <el-table-column :label="$t('scene.edit.202832-2')" align="center" prop="deptName" width="200" />
            <el-table-column :label="$t('scene.list.index.079839-3')" align="center" prop="deviceTotal" width="100" />
            <el-table-column :label="$t('scene.list.index.079839-4')" align="center" prop="desc" width="200" />
            <el-table-column :label="$t('scene.list.index.079839-5')" align="center" prop="createBy" width="100" />
            <el-table-column :label="$t('scene.list.index.079839-6')" align="center" prop="updateTime" width="160" />
            <el-table-column fixed="right" :label="$t('opation')" align="center" class-name="small-padding fixed-width" width="350">
                <template slot-scope="scope">
                    <el-button type="text" size="mini" icon="el-icon-view" @click="handleDetail(scope.row)" v-hasPermi="['scene:model:query']">{{ $t('look') }}</el-button>
                    <el-button style="color: #606266" size="mini" type="text" icon="el-icon-edit-outline" @click="handleEdit(scope.row)" v-hasPermi="['scene:model:edit']">{{ $t('edit') }}</el-button>
                    <el-button style="color: #e6a23c" size="mini" type="text" icon="el-icon-box" v-if="isShowScada == true" @click="handleScadaDesign(scope.row)" v-hasPermi="['scene:model:scada:design']">
                        {{ $t('scene.list.index.079839-7') }}
                    </el-button>
                    <el-button style="color: #71e2a3" size="mini" type="text" icon="el-icon-thumb" v-if="isShowScada == true" @click="handleScadaRun(scope.row)" v-hasPermi="['scene:model:scada:run']">
                        {{ $t('scene.list.index.079839-8') }}
                    </el-button>
                    <el-button style="color: #f56c6c" size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['scene:model:remove']">{{ $t('del') }}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getSceneListDatas" />

        <!-- 添加或修改场景对话框 -->
        <el-dialog :title="dialog.title" :visible.sync="dialog.open" width="450px" append-to-body>
            <div class="el-divider el-divider--horizontal" style="margin-top: -25px"></div>
            <el-form ref="dialogForm" :model="dialog.form" :rules="dialog.rules" label-width="78px">
                <el-form-item :label="$t('scene.list.index.079839-9')" prop="imgUrl">
                    <image-upload v-model="dialog.form.imgUrl" :multiple="false" :class="{ disable: uploadDisabled }" />
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-1')" prop="sceneModelName">
                    <el-input v-model="dialog.form.sceneModelName" :placeholder="$t('scene.edit.202832-5')" clearable />
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-2')" prop="deptId">
                    <treeselect style="width: 100%" v-model="dialog.form.deptId" :options="deptOptions" :clearable="true" :searchable="true" :placeholder="$t('scene.edit.202832-6')" @input="handleTreeselectInput" />
                </el-form-item>
                <el-form-item :label="$t('scene.edit.202832-4')" prop="desc">
                    <el-input v-model="dialog.form.desc" :placeholder="$t('scene.edit.202832-7')" clearable />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleDialogSubmit">{{ $t('confirm') }}</el-button>
                <el-button @click="handleDialogCancel">{{ $t('cancel') }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { deptsTreeSelect } from '@/api/system/user.js';
import { getSceneModelList, getSceneModelDetail, addSceneModel, updateSceneModel, deleteSceneModel } from '@/api/scene/list.js';
import defaultSettings from '@/settings';

export default {
    name: 'sceneList',
    components: { Treeselect },
    computed: {
        uploadDisabled: function () {
            return this.dialog.form.imgUrl !== '';
        },
    },
    data() {
        return {
            loading: true, // 遮罩层
            ids: [], // 选中数组
            single: true, // 非单个禁用
            multiple: true, // 非多个禁用
            showSearch: true, // 显示搜索条件
            deptOptions: [], // 机构树
            //组态相关按钮是否显示，true显示，false不显示
            isShowScada: defaultSettings.isShowScada,
            // 查询参数
            queryParams: {
                deptId: null,
                status: null,
                sceneModelName: '',
                pageNum: 1,
                pageSize: 10,
            },
            sceneList: [], // 场景列表数据
            total: 0, // 总条数
            dialog: {
                open: false, // 弹出层标题
                title: '', // 对话框标题
                // 表单参数
                form: {
                    imgUrl: '',
                    sceneModelName: '',
                    deptId: null,
                    desc: '',
                },
                // 表单校验
                rules: {
                    sceneModelName: [{ required: true, message: this.$t('scene.edit.202832-5'), trigger: 'blur' }],
                    deptId: [{ required: true, message: this.$t('scene.edit.202832-6'), trigger: 'change' }],
                },
            },
        };
    },
    mounted() {
        this.getDeptTree();
        this.getSceneListDatas();
    },
    methods: {
        // 获取机构树
        getDeptTree() {
            deptsTreeSelect().then((res) => {
                if (res.code === 200) {
                    this.deptOptions = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 获取场景列表数据
        getSceneListDatas() {
            this.loading = true;
            getSceneModelList(this.queryParams).then((res) => {
                if (res.code === 200) {
                    this.sceneList = res.rows;
                    this.total = res.total;
                } else {
                    this.$message.error(res.msg);
                }
                this.loading = false;
            });
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getSceneListDatas();
        },
        // 重置按钮操作
        handleResetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        // 新增按钮操作
        handleAdd() {
            this.reset();
            this.dialog.open = true;
            this.dialog.title = this.$t('scene.list.index.079839-10');
        },
        // 表单重置
        reset() {
            this.dialog.form = {
                imgUrl: '',
                sceneModelName: '',
                deptId: null,
                desc: '',
            };
            this.resetForm('dialogForm');
        },
        // 选中Treeselect触发
        handleTreeselectInput(items) {
            if (items) {
                this.$refs.dialogForm.clearValidate('deptId'); // 自动不起效果，所以手动
            }
        },
        // 提交按钮
        handleDialogSubmit() {
            this.$refs['dialogForm'].validate((valid) => {
                if (valid) {
                    if (this.dialog.form.sceneModelId != null) {
                        updateSceneModel(this.dialog.form).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess(this.$t('updateSuccess'));
                                this.dialog.open = false;
                                this.getSceneListDatas();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    } else {
                        addSceneModel(this.dialog.form).then((res) => {
                            if (res.code === 200) {
                                this.$modal.msgSuccess(this.$t('addSuccess'));
                                this.dialog.open = false;
                                this.getSceneListDatas();
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    }
                }
            });
        },
        // 取消按钮
        handleDialogCancel() {
            this.dialog.open = false;
        },
        // 修改按钮操作
        handleUpdate() {
            this.dialog.title = this.$t('scene.list.index.079839-11');
            const id = this.ids;
            getSceneModelDetail(id).then((res) => {
                if (res.code === 200) {
                    this.dialog.form = res.data;
                    this.dialog.open = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 删除按钮操作
        handleDelete(row) {
            const ids = row.sceneModelId || this.ids;
            this.$modal
                .confirm(this.$t('scene.list.index.079839-12', [ids]))
                .then(function () {
                    return deleteSceneModel(ids);
                })
                .then(() => {
                    this.getSceneListDatas();
                    if (Array.isArray(ids)) {
                        this.ids = [];
                    }
                    this.$modal.msgSuccess(this.$t('delSuccess'));
                })
                .catch(() => {});
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map((item) => item.sceneModelId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        // 查看场景
        handleDetail(item) {
            this.$router.push({
                path: '/scene/list/detail',
                query: {
                    sceneModelId: item.sceneModelId,
                },
            });
        },
        // 编辑场景
        handleEdit(item) {
            this.$router.push({
                path: '/scene/list/edit',
                query: {
                    id: item.sceneModelId,
                },
            });
        },
        // 组态设计
        handleScadaDesign(item) {
            const { scadaId, guid, sceneModelId } = item;
            if (guid) {
                const routeUrl = this.$router.resolve({
                    path: '/scada/topo/editor',
                    query: {
                        id: scadaId,
                        guid: guid,
                        type: 2,
                        sceneModelId: sceneModelId,
                    },
                });
                window.open(routeUrl.href, '_blank');
            } else {
                this.$router.push({
                    path: '/scada/center/scene',
                    query: {
                        sceneModelId: item.sceneModelId,
                    },
                });
            }
        },
        // 组态运行
        handleScadaRun(item) {
            if (item.guid) {
                const routeUrl = this.$router.resolve({
                    //以下组态特有
                    // path: '/topo/fullscreen',
                    //以上组态特有
                    query: {
                        guid: item.guid,
                        type: 2,
                        sceneModelId: item.sceneModelId,
                    },
                });
                window.open(routeUrl.href, '_blank');
            } else {
                this.$message({
                    message: this.$t('scene.list.index.079839-13'),
                    type: 'warning',
                });
            }
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
.scene-list-wrap {
    padding: 20px;

    ::v-deep .vue-treeselect {
        width: 182.5px;
        height: 30.5px;
        line-height: 30.5px;
        font-size: 13px;
    }

    ::v-deep .vue-treeselect__control {
        height: 30.5px;
    }

    ::v-deep .vue-treeselect__placeholder,
    ::v-deep .vue-treeselect__single-value {
        line-height: 30.5px;
    }
}

.disable {
    ::v-deep .el-upload--picture-card {
        display: none !important;
    }
}
</style>
