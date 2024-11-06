<template>
    <el-dialog title="选择场景" :visible.sync="openScene" width="800px" append-to-body>
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" style="margin-bottom: -10px">
            <el-form-item label="场景名称" prop="sceneName">
                <el-input v-model="queryParams.sceneName" placeholder="请输入场景名称" clearable size="small" @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="handleResetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="sceneList" @row-click="rowClick" ref="singleTable" highlight-current-row size="mini">
            <el-table-column label="选择" width="50" align="center">
              <template slot-scope="scope">
                <input type="radio" :checked="scope.row.isSelect" name="product" />
              </template>
            </el-table-column>
            <el-table-column label="场景名称" align="center" prop="sceneName" />
            <el-table-column label="状态" align="center" prop="enable" width="">
                <template slot-scope="scope">
                    <el-tag type="success" size="small" v-if="scope.row.enable == 1">启动</el-tag>
                    <el-tag type="danger" size="small" v-if="scope.row.enable == 2">暂停</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="触发条件" align="center" prop="cond">
                <template slot-scope="scope">
                    <span v-if="scope.row.cond == 1">任意条件</span>
                    <span v-if="scope.row.cond == 2">所有条件</span>
                    <span v-if="scope.row.cond == 3">不满足条件</span>
                </template>
            </el-table-column>
            <el-table-column label="执行方式" align="center" prop="executeMode">
                <template slot-scope="scope">
                    <span v-if="scope.row.executeMode == 1">串行</span>
                    <span v-if="scope.row.executeMode == 2">并行</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="100">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

        <div slot="footer" style="width: 100%">
            <el-button type="primary" @click="confirmSelectScene">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { listScene } from '@/api/iot/scene';

export default {
    name: 'sceneList',
    data() {
        return {
            // 打开场景列表
            openScene: false,
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 场景联动表格数据
            sceneList: [],
            // 选中的产品编号
            selectSceneId: 0,
            // 选中的产品
            scene: {},
            // 弹出层标题
            title: '',
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                hasAlert: 1,
                sceneName: null,
            },
            form: {},
        };
    },
    created() {},
    methods: {
        /** 查询场景联动列表 */
        getList() {
            this.loading = true;
            listScene(this.queryParams).then((response) => {
                this.sceneList = response.rows;
                this.total = response.total;
                this.loading = false;
                // 设置选中
                this.setRadioSelected(this.selectSceneId);
            });
        },
        // 取消按钮
        cancel() {
            this.openScene = false;
            this.ids = [];
            this.scene = {};
        },
        // 搜索按钮操作
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        // 重置按钮操作
        handleResetQuery() {
            this.resetForm('queryForm');
            this.handleQuery();
        },
        /** 单选数据 */
        rowClick(scene) {
          if (scene != null) {
            this.setRadioSelected(scene.sceneId);
            this.scene = scene;
          }
        },
        /** 设置单选按钮选中 */
        setRadioSelected(sceneId) {
          for (let i = 0; i < this.sceneList.length; i++) {
            if (this.sceneList[i].sceneId == sceneId) {
              this.sceneList[i].isSelect = true;
            } else {
              this.sceneList[i].isSelect = false;
            }
          }
        },
        /**确定选择产品，产品传递给父组件 */
        confirmSelectScene() {
          this.$emit('sceneEvent', this.scene);
          this.openScene = false;
        },
    },
};
</script>

<style lang="scss" scoped></style>
