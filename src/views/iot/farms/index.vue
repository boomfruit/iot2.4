<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="农场名" prop="farmsName">
                <el-input v-model="queryParams.farmsName" placeholder="请输入农场名" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="省" prop="province">
                <el-input v-model="queryParams.province" placeholder="请输入省" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="市" prop="city">
                <el-input v-model="queryParams.city" placeholder="请输入市" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="区县" prop="district">
                <el-input v-model="queryParams.district" placeholder="请输入区县" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="区域码" prop="areaCode">
                <el-input v-model="queryParams.areaCode" placeholder="请输入区域码" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
                <el-input v-model="queryParams.address" placeholder="请输入详细地址" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
                <el-input v-model="queryParams.longitude" placeholder="请输入经度" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
                <el-input v-model="queryParams.latitude" placeholder="请输入纬度" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['iot:farms:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['iot:farms:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['iot:farms:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['iot:farms:export']">导出</el-button>
            </el-col>
            <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table style="height: 680px; background-color: #0d1827" v-loading="loading" :data="farmsList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="农场ID" align="center" prop="id" />
            <el-table-column label="农场名" align="center" prop="farmsName" />
            <el-table-column label="省" align="center" prop="province" />
            <el-table-column label="市" align="center" prop="city" />
            <el-table-column label="区县" align="center" prop="district" />
            <el-table-column label="区域码" align="center" prop="areaCode" />
            <el-table-column label="详细地址" align="center" prop="address" />
            <el-table-column label="经度" align="center" prop="longitude" />
            <el-table-column label="纬度" align="center" prop="latitude" />
            <el-table-column label="农场图片" align="center" prop="farmImage" width="100">
                <template slot-scope="scope">
                    <image-preview :src="scope.row.farmImage" :width="50" :height="50" />
                </template>
            </el-table-column>
            <el-table-column label="农场简介" align="center" prop="description" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['iot:farms:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['iot:farms:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />
        <!-- 添加或修改农场管理对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="选择机构" prop="farmsName">
                    <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                </el-form-item>
                <el-form-item label="农场名" prop="farmsName">
                    <el-input v-model="form.farmsName" placeholder="请输入农场名" />
                </el-form-item>
                <!-- <el-form-item label="所属公司id默认账号带出，不需要填" prop="companyId">
                    <el-input v-model="form.companyId" placeholder="请输入所属公司id默认账号带出，不需要填" />
                </el-form-item>
                <el-form-item label="所属公司名称默认账号带出，不需要填" prop="companyName">
                    <el-input v-model="form.companyName" placeholder="请输入所属公司名称默认账号带出，不需要填" />
                </el-form-item> -->
                <!-- <el-form-item label="省" prop="province">
                    <el-input v-model="form.province" placeholder="请输入省" />
                </el-form-item>
                <el-form-item label="市" prop="city">
                    <el-input v-model="form.city" placeholder="请输入市" />
                </el-form-item>
                <el-form-item label="区县" prop="district">
                    <el-input v-model="form.district" placeholder="请输入区县" />
                </el-form-item> -->
                <el-form-item label="区域码" prop="areaCode">
                    <el-input v-model="form.areaCode" placeholder="请输入区域码" />
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入详细地址" />
                </el-form-item>
                <el-form-item label="经度" prop="longitude">
                    <el-input v-model="form.longitude" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="form.latitude" placeholder="请输入纬度" />
                </el-form-item>
                <el-form-item label="农场图片" prop="farmImage">
                    <image-upload v-model="form.farmImage" />
                </el-form-item>
                <el-form-item label="农场简介" prop="description">
                    <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { listFarms, getFarms, delFarms, addFarms, updateFarms, companyOtherFarms } from '@/api/iot/farms';

export default {
    name: 'Farms',
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
            // 农场管理表格数据
            farmsList: [],
            // 弹出层标题
            title: '',
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                farmsName: null,
                companyId: null,
                companyName: null,
                province: null,
                city: null,
                district: null,
                areaCode: null,
                address: null,
                longitude: null,
                latitude: null,
                farmImage: null,
                description: null,
                managerId: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                farmsName: [{ required: true, message: '农场名不能为空', trigger: 'blur' }],
                companyId: [{ required: true, message: '所属公司id默认账号带出，不需要填不能为空', trigger: 'blur' }],
                companyName: [{ required: true, message: '所属公司名称默认账号带出，不需要填不能为空', trigger: 'blur' }],
                managerId: [{ required: true, message: '厂长user_id不能为空', trigger: 'blur' }],
            },
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'deptName',
            },
        };
    },
    created() {
        this.getList();
        this.getCompanyOtherFarms();
    },
    methods: {
        handleNodeClick(data) {
            this.form.companyName = data.deptName;
            this.form.companyId = data.deptId;
            this.form.managerId = data.deptUserId;
            console.log('Clicked node:', data);
        },
        // 获取当前公司及子公司接口
        getCompanyOtherFarms() {
            companyOtherFarms().then((response) => {
                // console.log('response', response);
                this.treeData = this.buildTree(response.data);
            });
        },
        buildTree(nodes) {
            const tree = [];

            function findChildren(parentId) {
                return nodes.filter((node) => node.parentId === parentId);
            }

            function recursive(node) {
                const children = findChildren(node.deptId);
                if (children.length > 0) {
                    node.children = children.map((child) => {
                        child = { ...child };
                        delete child.parentId;
                        delete child.ancestors;
                        return recursive(child);
                    });
                }
                return node;
            }

            nodes.forEach((node) => {
                if (node.parentId === 0) {
                    const newNode = { ...node };
                    delete newNode.parentId;
                    delete newNode.ancestors;
                    tree.push(recursive(newNode));
                }
            });

            return tree;
        },
        /** 查询农场管理列表 */
        getList() {
            this.loading = true;
            listFarms(this.queryParams).then((response) => {
                this.farmsList = response.rows;
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
                farmsName: null,
                companyId: null,
                companyName: null,
                province: null,
                city: null,
                district: null,
                areaCode: null,
                address: null,
                longitude: null,
                latitude: null,
                farmImage: null,
                description: null,
                managerId: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
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
            this.title = '添加农场管理';
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids;
            getFarms(id).then((response) => {
                this.form = response.data;
                this.open = true;
                this.title = '修改农场管理';
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if (this.form.id != null) {
                        updateFarms(this.form).then((response) => {
                            this.$modal.msgSuccess('修改成功');
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addFarms(this.form).then((response) => {
                            this.$modal.msgSuccess('新增成功');
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
                .confirm('是否确认删除农场管理编号为"' + ids + '"的数据项？')
                .then(function () {
                    return delFarms(ids);
                })
                .then(() => {
                    this.getList();
                    this.$modal.msgSuccess('删除成功');
                })
                .catch(() => {});
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download(
                'iot/farms/export',
                {
                    ...this.queryParams,
                },
                `farms_${new Date().getTime()}.xlsx`
            );
        },
    },
};
</script>
<style lang="scss" scoped>
@import '@/assets/styles/tableView.scss';
// 树状图
::v-deep .el-tree-node__content {
    background-color: #0d1827 !important;
    color: #fff;
}
::v-deep .el-tree-node__content:hover {
    background-color: #0d1827 !important;
}

::v-deep .el-tree-node.is-current > .el-tree-node__content {
    background-color: #0d1827 !important;
    color: #a8aec9;
}

::v-deep .el-tree-node:focus > .el-tree-node__content {
    background-color: #0d1827 !important;
    color: #a8aec9;
}
::v-deep .el-upload--picture-card {
    background-color: transparent !important;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
}
</style>
